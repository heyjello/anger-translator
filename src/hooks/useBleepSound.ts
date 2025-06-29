/**
 * Bleep Sound Hook
 * 
 * React hook for managing bleep sound effects in components.
 */

import { useState, useCallback } from 'react';
import { bleepSoundService, type BleepConfig } from '../services/bleepSoundService';

export interface UseBleepSoundResult {
  playBleep: (config?: BleepConfig) => Promise<void>;
  playBleepForText: (text: string) => Promise<void>;
  playStyleBleep: (style?: 'tv' | 'radio' | 'harsh' | 'gentle') => Promise<void>;
  testBleep: () => Promise<void>;
  isPlaying: boolean;
  isSupported: boolean;
  audioState: { supported: boolean; state?: string; sampleRate?: number };
}

export const useBleepSound = (): UseBleepSoundResult => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playBleep = useCallback(async (config?: BleepConfig) => {
    setIsPlaying(true);
    try {
      await bleepSoundService.generateBleep(config);
    } catch (error) {
      console.error('Failed to play bleep:', error);
    } finally {
      // Reset playing state after a short delay
      setTimeout(() => setIsPlaying(false), (config?.duration || 0.5) * 1000 + 100);
    }
  }, []);

  const playBleepForText = useCallback(async (text: string) => {
    setIsPlaying(true);
    try {
      await bleepSoundService.bleepForText(text);
    } catch (error) {
      console.error('Failed to play text bleep:', error);
    } finally {
      const duration = Math.max(0.3, Math.min(2.0, text.length * 0.1));
      setTimeout(() => setIsPlaying(false), duration * 1000 + 100);
    }
  }, []);

  const playStyleBleep = useCallback(async (style: 'tv' | 'radio' | 'harsh' | 'gentle' = 'tv') => {
    setIsPlaying(true);
    try {
      await bleepSoundService.playStyleBleep(style);
    } catch (error) {
      console.error('Failed to play style bleep:', error);
    } finally {
      setTimeout(() => setIsPlaying(false), 1000);
    }
  }, []);

  const testBleep = useCallback(async () => {
    setIsPlaying(true);
    try {
      await bleepSoundService.testBleep();
    } catch (error) {
      console.error('Failed to test bleep:', error);
    } finally {
      setTimeout(() => setIsPlaying(false), 1500);
    }
  }, []);

  const audioState = bleepSoundService.getAudioState();

  return {
    playBleep,
    playBleepForText,
    playStyleBleep,
    testBleep,
    isPlaying,
    isSupported: audioState.supported,
    audioState
  };
};