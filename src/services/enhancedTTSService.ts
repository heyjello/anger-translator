/**
 * Enhanced TTS Service
 * 
 * Combines ElevenLabs TTS with bleep sound effects for censored profanity.
 * Words surrounded by ** are treated as profanity and replaced with bleeps.
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
   * Process text and play with bleep replacements for profanity
   */
  async speakWithBleeps(
    text: string, 
    options: EnhancedTTSOptions
  ): Promise<void> {
    console.log('🎤 Enhanced TTS starting - checking for profanity bleeps');

    // Stop any currently playing audio
    this.stopCurrentAudio();

    if (!options.enableBleeps || !this.hasProfanityMarkers(text)) {
      // No profanity bleeps needed, use regular TTS
      console.log('📢 No profanity detected, using regular TTS');
      try {
        const cleanedText = this.cleanTextForSpeech(text);
        const audioUrl = await elevenLabsService.generateSpeech(cleanedText, options.style, options.rageLevel);
        await this.playAudio(audioUrl);
      } catch (error) {
        console.error('❌ Regular TTS failed:', error);
        throw error;
      }
      return;
    }

    console.log('🔊 Profanity detected, using enhanced TTS with bleeps');

    // Split text into segments with profanity markers
    const segments = this.parseTextWithProfanity(text);
    console.log('📝 Parsed segments:', segments.length);
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      console.log(`🎯 Processing segment ${i + 1}/${segments.length}:`, segment.type);
      
      try {
        if (segment.type === 'text' && segment.content.trim()) {
          // Speak the clean text
          console.log('🗣️ Generating speech for clean text segment');
          const cleanedText = this.cleanTextForSpeech(segment.content);
          const audioUrl = await elevenLabsService.generateSpeech(
            cleanedText, 
            options.style, 
            options.rageLevel
          );
          await this.playAudio(audioUrl);
        } else if (segment.type === 'profanity') {
          // Play bleep sound for profanity
          console.log('🔊 Playing bleep for profanity:', segment.content);
          await bleepSoundService.bleepForText(segment.content);
        }
        
        // Minimal pause between segments for natural flow
        if (i < segments.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } catch (error) {
        console.error(`❌ Failed to process segment ${i + 1}:`, error);
        // Continue with next segment instead of throwing
        console.log(`⏭️ Continuing with next segment after error in segment ${i + 1}`);
      }
    }
    
    console.log('✅ Enhanced TTS playback complete');
  }

  /**
   * Check if text contains profanity markers (**)
   */
  private hasProfanityMarkers(text: string): boolean {
    return /\*\*[^*]+\*\*/.test(text);
  }

  /**
   * Clean text for speech by removing tone cues but preserving profanity markers
   */
  private cleanTextForSpeech(text: string): string {
    let cleanedText = text;
    
    // Remove tone cues like [explosive energy], [screaming], etc.
    cleanedText = cleanedText.replace(/\[([^\]]+)\]/g, '');
    
    // Remove multiple spaces and clean up
    cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
    
    return cleanedText;
  }

  /**
   * Parse text into speech and profanity segments
   * ** markers indicate profanity that should be bleeped
   */
  private parseTextWithProfanity(text: string): Array<{ type: 'text' | 'profanity'; content: string }> {
    const segments: Array<{ type: 'text' | 'profanity'; content: string }> = [];
    
    // Split on ** markers while preserving them
    const parts = text.split(/(\*\*[^*]*\*\*)/);
    
    for (const part of parts) {
      if (!part) continue;
      
      if (part.startsWith('**') && part.endsWith('**')) {
        // This is profanity that should be bleeped
        const profanityContent = part.replace(/\*\*/g, '');
        if (profanityContent) {
          segments.push({ type: 'profanity', content: profanityContent });
        }
      } else if (part.trim()) {
        // This is regular text that should be spoken
        const cleanedText = this.cleanTextForSpeech(part);
        if (cleanedText) {
          segments.push({ type: 'text', content: cleanedText });
        }
      }
    }
    
    return segments;
  }

  /**
   * Play audio from URL with robust error handling and cleanup
   */
  private async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let isResolved = false;
      const audio = new Audio();
      this.currentAudio = audio;

      // Consolidated cleanup function
      const cleanup = () => {
        if (audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
      };

      // Ensure promise is resolved/rejected only once
      const resolveOnce = () => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          resolve();
        }
      };

      const rejectOnce = (error: Error) => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          reject(error);
        }
      };

      // Set up event handlers before setting src
      audio.onended = resolveOnce;
      
      audio.onerror = (event) => {
        console.error('❌ Audio error event:', {
          error: audio.error,
          networkState: audio.networkState,
          readyState: audio.readyState,
          src: audio.src
        });
        
        let errorMessage = 'Audio playback failed';
        if (audio.error) {
          switch (audio.error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMessage = 'Audio playback was aborted';
              break;
            case MediaError.MEDIA_ERR_NETWORK:
              errorMessage = 'Network error during audio playback';
              break;
            case MediaError.MEDIA_ERR_DECODE:
              errorMessage = 'Audio decoding error';
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = 'Audio format not supported';
              break;
          }
        }
        
        rejectOnce(new Error(errorMessage));
      };

      audio.onabort = () => {
        console.log('🛑 Audio playback aborted');
        rejectOnce(new Error('Audio playback was aborted'));
      };

      // Set source and attempt to play
      audio.src = audioUrl;
      
      // Add a small delay to ensure the audio element is ready
      setTimeout(() => {
        if (!isResolved) {
          audio.play().catch(error => {
            console.error('❌ Audio play() failed:', error);
            rejectOnce(new Error(`Failed to start audio playback: ${error.message}`));
          });
        }
      }, 10);

      // Add a timeout to prevent hanging promises
      setTimeout(() => {
        if (!isResolved) {
          console.warn('⚠️ Audio playback timeout');
          rejectOnce(new Error('Audio playback timeout'));
        }
      }, 30000); // 30 second timeout
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
   * Test the enhanced TTS with profanity bleeps
   */
  async testEnhancedTTS(): Promise<void> {
    const testText = "This is a test of the enhanced TTS system with **DAMN** profanity words!";
    
    console.log('🧪 Testing enhanced TTS with profanity bleeps...');
    await this.speakWithBleeps(testText, {
      style: 'highland-howler',
      rageLevel: 70,
      enableBleeps: true,
      bleepStyle: 'tv'
    });
    console.log('✅ Enhanced TTS test complete');
  }

  /**
   * Test profanity parsing
   */
  testProfanityParsing(text: string): Array<{ type: 'text' | 'profanity'; content: string }> {
    console.log('🧪 Testing profanity parsing for:', text);
    const segments = this.parseTextWithProfanity(text);
    console.log('📝 Parsed segments:', segments);
    return segments;
  }
}

// Export singleton instance
export const enhancedTTSService = new EnhancedTTSService();