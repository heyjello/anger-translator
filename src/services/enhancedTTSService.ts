/**
 * Enhanced TTS Service
 * 
 * Combines ElevenLabs TTS with bleep sound effects for censored content.
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
  /**
   * Process text and play with bleep replacements
   */
  async speakWithBleeps(
    text: string, 
    options: EnhancedTTSOptions
  ): Promise<void> {
    if (!options.enableBleeps || !text.includes('**')) {
      // No bleeps needed, use regular TTS
      return await elevenLabsService.generateSpeech(text, options.style, options.rageLevel)
        .then(audioUrl => this.playAudio(audioUrl));
    }

    // Split text into segments with bleep markers
    const segments = this.parseTextWithBleeps(text);
    
    for (const segment of segments) {
      if (segment.type === 'text') {
        // Speak the text
        const audioUrl = await elevenLabsService.generateSpeech(
          segment.content, 
          options.style, 
          options.rageLevel
        );
        await this.playAudio(audioUrl);
      } else if (segment.type === 'bleep') {
        // Play bleep sound
        await bleepSoundService.bleepForText(segment.content);
      }
      
      // Small pause between segments
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Parse text into speech and bleep segments
   */
  private parseTextWithBleeps(text: string): Array<{ type: 'text' | 'bleep'; content: string }> {
    const segments: Array<{ type: 'text' | 'bleep'; content: string }> = [];
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    
    for (const part of parts) {
      if (part.startsWith('**') && part.endsWith('**')) {
        // This is a bleep segment
        const bleepContent = part.replace(/\*\*/g, '');
        segments.push({ type: 'bleep', content: bleepContent });
      } else if (part.trim()) {
        // This is regular text
        segments.push({ type: 'text', content: part });
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
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error('Failed to play audio'));
      };
      
      audio.play().catch(reject);
    });
  }

  /**
   * Test the enhanced TTS with bleeps
   */
  async testEnhancedTTS(): Promise<void> {
    const testText = "This is a **BLEEP** test of the enhanced TTS system with **CENSORED** words!";
    
    await this.speakWithBleeps(testText, {
      style: 'ny-italian',
      rageLevel: 7,
      enableBleeps: true,
      bleepStyle: 'tv'
    });
  }
}

// Export singleton instance
export const enhancedTTSService = new EnhancedTTSService();