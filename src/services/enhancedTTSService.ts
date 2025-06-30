/**
 * Enhanced TTS Service
 * 
 * Uses ElevenLabs voices EXACTLY as they come from the service.
 * NO modifications to voice settings whatsoever.
 */

import { elevenLabsService } from './elevenLabsService';
import { bleepSoundService } from './bleepSoundService';
import { cleanTextForTTS } from '../config/elevenLabsVoices';

export interface EnhancedTTSOptions {
  style: string;
  rageLevel: number;
  enableBleeps: boolean;
  bleepStyle: 'tv' | 'radio' | 'harsh' | 'gentle';
}

export class EnhancedTTSService {
  private currentAudio: HTMLAudioElement | null = null;

  /**
   * Process text and play with bleep replacements
   * Uses voices EXACTLY as configured in ElevenLabs
   */
  async speakWithBleeps(
    text: string, 
    options: EnhancedTTSOptions
  ): Promise<void> {
    console.log('🎤 Enhanced TTS starting (NO VOICE MODIFICATIONS)');

    // Stop any currently playing audio
    this.stopCurrentAudio();

    if (!options.enableBleeps || !this.hasBleepMarkers(text)) {
      // No bleeps needed, use regular TTS with UNMODIFIED voice
      console.log('📢 No bleeps detected, using regular TTS with ORIGINAL voice settings');
      try {
        const audioUrl = await elevenLabsService.generateSpeech(text, options.style, options.rageLevel);
        await this.playAudio(audioUrl);
      } catch (error) {
        console.error('❌ Regular TTS failed:', error);
        throw error;
      }
      return;
    }

    console.log('🔊 Bleeps detected, using enhanced TTS with ORIGINAL voice settings');

    // Split text into segments with bleep markers
    const segments = this.parseTextWithBleeps(text);
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      
      try {
        if (segment.type === 'text' && segment.content.trim()) {
          // Speak the text with UNMODIFIED voice settings
          console.log('🗣️ Generating speech with ORIGINAL ElevenLabs voice');
          const audioUrl = await elevenLabsService.generateSpeech(
            segment.content.trim(), 
            options.style, 
            options.rageLevel
          );
          await this.playAudio(audioUrl);
        } else if (segment.type === 'bleep') {
          // Play bleep sound
          console.log('🔊 Playing bleep for:', segment.content);
          await bleepSoundService.bleepForText(segment.content);
        }
        
        // Minimal pause between segments
        if (i < segments.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } catch (error) {
        console.error(`❌ Failed to process segment ${i + 1}:`, error);
      }
    }
    
    console.log('✅ Enhanced TTS playback complete (ORIGINAL voice used)');
  }

  /**
   * Check if text contains bleep markers
   */
  private hasBleepMarkers(text: string): boolean {
    return /\*\*[^*]+\*\*/.test(text);
  }

  /**
   * Parse text into speech and bleep segments
   */
  private parseTextWithBleeps(text: string): Array<{ type: 'text' | 'bleep'; content: string }> {
    const segments: Array<{ type: 'text' | 'bleep'; content: string }> = [];
    
    const parts = text.split(/(\*\*[^*]*\*\*)/);
    
    for (const part of parts) {
      if (!part) continue;
      
      if (part.startsWith('**') && part.endsWith('**')) {
        const bleepContent = part.replace(/\*\*/g, '');
        if (bleepContent) {
          segments.push({ type: 'bleep', content: bleepContent });
        }
      } else if (part.trim()) {
        // Clean tone cues but preserve text content
        const cleanedText = cleanTextForTTS(part);
        if (cleanedText) {
          segments.push({ type: 'text', content: cleanedText });
        }
      }
    }
    
    return segments;
  }

  /**
   * Play audio from URL
   */
  private async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        resolve();
      };
      
      audio.onerror = (e) => {
        console.error('❌ Audio playback error:', e);
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        reject(new Error('Failed to play audio'));
      };
      
      audio.play().catch(error => {
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        reject(error);
      });
    });
  }

  /**
   * Stop any currently playing audio
   */
  stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      console.log('🛑 Stopped current audio playback');
    }
  }

  /**
   * Test the enhanced TTS with ORIGINAL voice settings
   */
  async testEnhancedTTS(): Promise<void> {
    const testText = "This is a test of the enhanced TTS system with **CENSORED** words!";
    
    console.log('🧪 Testing enhanced TTS with ORIGINAL ElevenLabs voices...');
    await this.speakWithBleeps(testText, {
      style: 'highland-howler',
      rageLevel: 70,
      enableBleeps: true,
      bleepStyle: 'tv'
    });
    console.log('✅ Enhanced TTS test complete (ORIGINAL voice used)');
  }
}

// Export singleton instance
export const enhancedTTSService = new EnhancedTTSService();