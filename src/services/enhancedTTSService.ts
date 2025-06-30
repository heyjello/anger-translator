/**
 * Enhanced TTS Service
 * 
 * Combines ElevenLabs TTS with bleep sound effects for censored profanity.
 * Now optimized for natural speech flow with minimal pauses.
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
  private isPlaying: boolean = false;

  /**
   * Process text and play with bleep replacements for profanity
   * Optimized for natural conversational flow
   */
  async speakWithBleeps(
    text: string, 
    options: EnhancedTTSOptions
  ): Promise<void> {
    console.log('🎤 Enhanced TTS starting - checking for profanity bleeps');

    // Stop any currently playing audio
    this.stopCurrentAudio();
    this.isPlaying = true;

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
      } finally {
        this.isPlaying = false;
      }
      return;
    }

    console.log('🔊 Profanity detected, using enhanced TTS with bleeps');

    try {
      // Split text into segments with profanity markers
      const segments = this.parseTextWithProfanity(text);
      console.log('📝 Parsed segments:', segments.length);
      
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        console.log(`🎯 Processing segment ${i + 1}/${segments.length}:`, segment.type);
        
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
          // Play bleep sound for profanity with minimal delay
          console.log('🔊 Playing bleep for profanity:', segment.content);
          await bleepSoundService.bleepForText(segment.content);
        }
        
        // NO pause between segments for natural flow
        // The audio and bleeps should flow seamlessly
      }
      
      console.log('✅ Enhanced TTS playback complete');
    } catch (error) {
      console.error('❌ Enhanced TTS failed:', error);
      throw error;
    } finally {
      this.isPlaying = false;
    }
  }

  /**
   * Check if text contains profanity markers (**) or asterisk censoring
   */
  private hasProfanityMarkers(text: string): boolean {
    return /\*\*[^*]+\*\*/.test(text) || /\*[a-z]\*/.test(text);
  }

  /**
   * Clean text for speech - ENHANCED to handle profanity naturally
   * ✅ KEEP: Tone cues [angry], [shouting] for ElevenLabs emotion
   * ✅ KEEP: Audio tags <emphasis>, <break> for ElevenLabs processing  
   * ✅ CONVERT: Asterisk profanity *d*mn → damn for natural speech
   * ✅ KEEP: Double asterisk **damn** for bleeping system
   * ❌ REMOVE: Parenthetical stage directions (leaning in...)
   * ❌ REMOVE: Notes (Note: ...)
   */
  private cleanTextForSpeech(text: string): string {
    let cleanedText = text;
    
    // Remove parenthetical stage directions like (leaning in with narrowed eyes, pointing aggressively)
    cleanedText = cleanedText.replace(/\([^)]*\)/g, '');
    
    // Remove notes like (Note: Perfectly balanced at anger level 5/100...)
    cleanedText = cleanedText.replace(/\(Note:[^)]*\)/gi, '');
    
    // Convert asterisk-censored profanity to natural words for TTS
    // *f*ck → fuck, *d*mn → damn, *sh*t → shit, etc.
    cleanedText = cleanedText.replace(/\*([a-z])\*([a-z]*)/gi, (match, firstLetter, rest) => {
      const word = firstLetter + rest;
      // Common profanity reconstruction for natural speech
      const profanityMap: Record<string, string> = {
        'fck': 'fuck',
        'fk': 'fuck',
        'dmn': 'damn',
        'dm': 'damn',
        'sht': 'shit',
        'sh': 'shit',
        'btch': 'bitch',
        'bch': 'bitch',
        'hll': 'hell',
        'hl': 'hell',
        'crap': 'crap',
        'pss': 'piss'
      };
      
      return profanityMap[word.toLowerCase()] || word;
    });
    
    // KEEP tone cues like [angry], [shouting] - ElevenLabs v3 understands these!
    // KEEP audio tags like <emphasis>, <break>, <prosody> - ElevenLabs v3 processes these
    // KEEP double asterisk profanity markers **word** - needed for bleeping system
    
    // Clean up multiple spaces and trim
    cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
    
    console.log('🧹 Text cleaned for natural TTS speech:', cleanedText);
    return cleanedText;
  }

  /**
   * Parse text into speech and profanity segments
   * ** markers indicate profanity that should be bleeped
   * * markers indicate censored profanity that should be spoken naturally
   */
  private parseTextWithProfanity(text: string): Array<{ type: 'text' | 'profanity'; content: string }> {
    const segments: Array<{ type: 'text' | 'profanity'; content: string }> = [];
    
    // Split on ** markers while preserving them (for bleeping)
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
        // This is regular text that should be spoken (including *censored* words)
        const cleanedText = this.cleanTextForSpeech(part);
        if (cleanedText) {
          segments.push({ type: 'text', content: cleanedText });
        }
      }
    }
    
    return segments;
  }

  /**
   * Play audio from URL with optimized timing for natural flow
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

      // Set source and attempt to play immediately for natural flow
      audio.src = audioUrl;
      
      // Play immediately without delay for seamless flow
      audio.play().catch(error => {
        console.error('❌ Audio play() failed:', error);
        rejectOnce(new Error(`Failed to start audio playback: ${error.message}`));
      });

      // Increased timeout to 30 seconds for better reliability
      setTimeout(() => {
        if (!isResolved) {
          console.warn('⚠️ Audio playback timeout');
          rejectOnce(new Error('Audio playback timeout'));
        }
      }, 30000); // 30 second timeout (increased from 15)
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
    this.isPlaying = false;
  }

  /**
   * Check if TTS is currently playing
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Test the enhanced TTS with profanity bleeps
   */
  async testEnhancedTTS(): Promise<void> {
    const testText = "This is a test of the enhanced TTS system with **damn** profanity words and *f*ck censored words!";
    
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