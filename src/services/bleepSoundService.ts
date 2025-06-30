/**
 * Bleep Sound Service
 * 
 * Handles censorship beep sound effects for profanity replacement.
 * Optimized for natural conversational flow with quick, seamless bleeps.
 */

export interface BleepConfig {
  frequency: number;    // Hz (typically 1000Hz for TV-style beep)
  duration: number;     // seconds
  volume: number;       // 0-1
  fadeIn: number;       // seconds
  fadeOut: number;      // seconds
}

export class BleepSoundService {
  private audioContext: AudioContext | null = null;
  private bleepAudio: HTMLAudioElement | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  /**
   * Initialize Web Audio API context
   */
  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  /**
   * Generate a seamless TV-style censor beep optimized for natural speech flow
   */
  async generateBleep(config: BleepConfig = {
    frequency: 1000,
    duration: 0.2,      // Very short for seamless flow
    volume: 0.6,        // Slightly quieter to blend better
    fadeIn: 0.01,       // Instant attack
    fadeOut: 0.01       // Instant release
  }): Promise<void> {
    if (!this.audioContext) {
      console.warn('Audio context not available');
      return;
    }

    // Resume audio context if suspended (required by some browsers)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const { frequency, duration, volume, fadeIn, fadeOut } = config;
    const currentTime = this.audioContext.currentTime;

    // Create oscillator for the beep tone
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Configure oscillator for clean beep sound
    oscillator.type = 'sine'; // Clean sine wave for professional beep
    oscillator.frequency.setValueAtTime(frequency, currentTime);

    // Configure volume envelope for seamless integration
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, currentTime + fadeIn);
    gainNode.gain.linearRampToValueAtTime(volume, currentTime + duration - fadeOut);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);

    // Connect audio nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Play the beep with precise timing
    oscillator.start(currentTime);
    oscillator.stop(currentTime + duration);

    console.log(`🔊 Playing seamless bleep: ${frequency}Hz for ${duration}s`);
  }

  /**
   * Create a bleep sound based on text length with optimized timing for speech flow
   */
  async bleepForText(text: string): Promise<void> {
    const cleanText = text.replace(/\*\*/g, ''); // Remove ** markers
    
    // Optimized duration calculation for seamless speech integration
    let duration: number;
    if (cleanText.length <= 3) {
      duration = 0.15;    // Very short words get quick bleeps
    } else if (cleanText.length <= 6) {
      duration = 0.2;     // Medium words
    } else {
      duration = 0.3;     // Longer words, but keep it short for flow
    }
    
    await this.generateBleep({
      frequency: 1000,
      duration,
      volume: 0.6,        // Balanced volume for natural integration
      fadeIn: 0.01,       // Instant attack for crisp sound
      fadeOut: 0.01       // Instant release for seamless flow
    });
  }

  /**
   * Different bleep styles optimized for natural conversation flow
   */
  async playStyleBleep(style: 'tv' | 'radio' | 'harsh' | 'gentle' = 'tv'): Promise<void> {
    const configs = {
      tv: { frequency: 1000, duration: 0.2, volume: 0.6, fadeIn: 0.01, fadeOut: 0.01 },
      radio: { frequency: 800, duration: 0.25, volume: 0.5, fadeIn: 0.02, fadeOut: 0.02 },
      harsh: { frequency: 1200, duration: 0.15, volume: 0.7, fadeIn: 0.005, fadeOut: 0.005 },
      gentle: { frequency: 600, duration: 0.3, volume: 0.4, fadeIn: 0.03, fadeOut: 0.03 }
    };

    await this.generateBleep(configs[style]);
  }

  /**
   * Load and play a pre-recorded bleep sound file
   */
  async loadBleepAudio(audioUrl: string): Promise<void> {
    try {
      this.bleepAudio = new Audio(audioUrl);
      this.bleepAudio.volume = 0.6; // Balanced volume
      await this.bleepAudio.play();
      console.log('🔊 Playing pre-recorded bleep');
    } catch (error) {
      console.error('Failed to play bleep audio:', error);
      // Fallback to generated beep
      await this.generateBleep();
    }
  }

  /**
   * Stop any currently playing bleep
   */
  stopBleep(): void {
    if (this.bleepAudio) {
      this.bleepAudio.pause();
      this.bleepAudio.currentTime = 0;
    }
  }

  /**
   * Test the bleep system with optimized settings
   */
  async testBleep(): Promise<void> {
    console.log('🧪 Testing seamless bleep sound system...');
    await this.generateBleep({
      frequency: 1000,
      duration: 0.2,      // Short test duration
      volume: 0.5,        // Moderate test volume
      fadeIn: 0.01,
      fadeOut: 0.01
    });
    console.log('✅ Seamless bleep test complete');
  }

  /**
   * Get audio context state for debugging
   */
  getAudioState(): { supported: boolean; state?: string; sampleRate?: number } {
    if (!this.audioContext) {
      return { supported: false };
    }

    return {
      supported: true,
      state: this.audioContext.state,
      sampleRate: this.audioContext.sampleRate
    };
  }
}

// Export singleton instance
export const bleepSoundService = new BleepSoundService();