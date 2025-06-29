/**
 * Text-to-Speech Hook
 * 
 * React hook for managing text-to-speech functionality with ElevenLabs.
 * Provides state management for audio playback and loading states.
 */

import { useState, useCallback, useRef } from 'react';
import { elevenLabsService } from '../services/elevenLabsService';

export interface UseTextToSpeechResult {
  speak: (text: string, style?: string, rageLevel?: number) => Promise<void>;
  isLoading: boolean;
  isPlaying: boolean;
  error: string | null;
  isAvailable: boolean;
  stop: () => void;
  clearError: () => void;
}

export const useTextToSpeech = (): UseTextToSpeechResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string, style: string = 'default', rageLevel: number = 5) => {
    if (!elevenLabsService.isConfigured()) {
      setError('Text-to-speech not configured. Please set up ElevenLabs API key.');
      return;
    }

    if (!text.trim()) {
      setError('No text provided for speech synthesis');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      console.log('🎤 Generating speech for:', text.substring(0, 50) + '...');
      
      // Generate speech
      const audioUrl = await elevenLabsService.generateSpeech(text, style, rageLevel);
      
      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadstart = () => {
        console.log('🎵 Audio loading...');
      };

      audio.oncanplay = () => {
        console.log('🎵 Audio ready to play');
      };

      audio.onplay = () => {
        setIsPlaying(true);
        console.log('🎵 Audio playback started');
      };

      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
        console.log('🎵 Audio playback completed');
        
        // Clean up the blob URL
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (e) => {
        setIsPlaying(false);
        setError('Failed to play generated audio');
        audioRef.current = null;
        console.error('❌ Audio playback error:', e);
        
        // Clean up the blob URL
        URL.revokeObjectURL(audioUrl);
      };

      // Start playback
      await audio.play();
      
    } catch (err) {
      console.error('❌ Speech generation failed:', err);
      setError(err instanceof Error ? err.message : 'Speech generation failed');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
      console.log('🛑 Audio playback stopped');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    speak,
    isLoading,
    isPlaying,
    error,
    isAvailable: elevenLabsService.isConfigured(),
    stop,
    clearError
  };
};