/**
 * Enhanced TTS Service
 * 
 * Combines ElevenLabs TTS with bleep sound effects for censored content.
 * Optimized for natural conversational flow with minimal pauses.
 */

import { elevenLabsService } from './elevenLabsService';
import { bleepSoundService } from './bleepSoundService';

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
   */
  async speakWithBleeps(
    text: string, 
    options: EnhancedTTSOptions
  ): Promise<void> {
    console.log('🎤 Enhanced TTS starting for:', text.substring(0, 50) + '...');
    console.log('🎭 Style:', options.style, 'Rage:', options.rageLevel, 'Bleeps:', options.enableBleeps);

    // Stop any currently playing audio
    this.stopCurrentAudio();

    if (!options.enableBleeps || !this.hasBleepMarkers(text)) {
      // No bleeps needed, use regular TTS
      console.log('📢 No bleeps detected, using regular TTS');
      try {
        const audioUrl = await elevenLabsService.generateSpeech(text, options.style, options.rageLevel);
        await this.playAudio(audioUrl);
      } catch (error) {
        console.error('❌ Regular TTS failed:', error);
        throw error;
      }
      return;
    }

    console.log('🔊 Bleeps detected, using enhanced TTS with censoring');

    // Split text into segments with bleep markers
    const segments = this.parseTextWithBleeps(text);
    console.log('📝 Parsed segments:', segments.length);
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      console.log(`🎯 Processing segment ${i + 1}/${segments.length}:`, segment.type, segment.content.substring(0, 20) + '...');
      
      try {
        if (segment.type === 'text' && segment.content.trim()) {
          // Speak the text
          console.log('🗣️ Generating speech for text segment');
          const audioUrl = await elevenLabsService.generateSpeech(
            segment.content.trim(), 
            options.style, 
            options.rageLevel
          );
          await this.playAudio(audioUrl);
        } else if (segment.type === 'bleep') {
          // Play bleep sound with minimal delay for natural flow
          console.log('🔊 Playing bleep for:', segment.content);
          await bleepSoundService.bleepForText(segment.content);
        }
        
        // Minimal pause between segments for natural conversational flow
        // Only add pause between text segments, not before/after bleeps
        if (i < segments.length - 1) {
          const nextSegment = segments[i + 1];
          const currentIsText = segment.type === 'text';
          const nextIsText = nextSegment.type === 'text';
          
          // Only pause between text segments, not around bleeps
          if (currentIsText && nextIsText) {
            await new Promise(resolve => setTimeout(resolve, 50)); // Very short pause between text segments
          } else {
            // No pause when transitioning to/from bleeps for natural flow
            await new Promise(resolve => setTimeout(resolve, 10)); // Minimal processing delay
          }
        }
      } catch (error) {
        console.error(`❌ Failed to process segment ${i + 1}:`, error);
        // Continue with next segment instead of failing completely
      }
    }
    
    console.log('✅ Enhanced TTS playback complete');
  }

  /**
   * Check if text contains bleep markers
   */
  private hasBleepMarkers(text: string): boolean {
    return /\*\*[^*]+\*\*/.test(text);
  }

  /**
   * Parse text into speech and bleep segments with smart text handling
   */
  private parseTextWithBleeps(text: string): Array<{ type: 'text' | 'bleep'; content: string }> {
    const segments: Array<{ type: 'text' | 'bleep'; content: string }> = [];
    
    // Split on ** markers while preserving them
    const parts = text.split(/(\*\*[^*]*\*\*)/);
    
    for (const part of parts) {
      if (!part) continue;
      
      if (part.startsWith('**') && part.endsWith('**')) {
        // This is a bleep segment
        const bleepContent = part.replace(/\*\*/g, '');
        if (bleepContent) {
          segments.push({ type: 'bleep', content: bleepContent });
        }
      } else if (part.trim()) {
        // This is regular text - clean up spacing around bleeps
        let cleanText = part;
        
        // Remove extra spaces that might cause awkward pauses
        cleanText = cleanText.replace(/\s+/g, ' ').trim();
        
        // If this text segment starts or ends with punctuation, preserve natural flow
        if (cleanText) {
          segments.push({ type: 'text', content: cleanText });
        }
      }
    }
    
    return segments;
  }

  /**
   * Play audio from URL with proper cleanup
   */
  private async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      
      audio.onloadstart = () => {
        console.log('🎵 Audio loading...');
      };

      audio.oncanplay = () => {
        console.log('🎵 Audio ready to play');
      };
      
      audio.onended = () => {
        console.log('🎵 Audio playback completed');
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
        console.error('❌ Audio play failed:', error);
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
   * Test the enhanced TTS with bleeps
   */
  async testEnhancedTTS(): Promise<void> {
    const testText = "This is a **BLEEP** test of the enhanced TTS system with **CENSORED** words!";
    
    console.log('🧪 Testing enhanced TTS with bleeps...');
    await this.speakWithBleeps(testText, {
      style: 'ny-italian',
      rageLevel: 7,
      enableBleeps: true,
      bleepStyle: 'tv'
    });
    console.log('✅ Enhanced TTS test complete');
  }

  /**
   * Test just the bleep parsing
   */
  testBleepParsing(text: string): Array<{ type: 'text' | 'bleep'; content: string }> {
    console.log('🧪 Testing bleep parsing for:', text);
    const segments = this.parseTextWithBleeps(text);
    console.log('📝 Parsed segments:', segments);
    return segments;
  }
}

// Export singleton instance
export const enhancedTTSService = new EnhancedTTSService();