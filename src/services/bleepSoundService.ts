/**
 * Bleep Sound Service
 * 
 * Handles censorship beep sound effects for profanity replacement.
 * Optimized for natural conversational flow with quick, punchy bleeps.
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
   * Generate a classic TV-style censor beep with faster timing
   */
  async generateBleep(config: BleepConfig = {
    frequency: 1000,
    duration: 0.3,      // Shorter default duration for better flow
    volume: 0.7,
    fadeIn: 0.02,       // Very quick fade in
    fadeOut: 0.02       // Very quick fade out
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

    // Configure oscillator
    oscillator.type = 'sine'; // Classic beep sound
    oscillator.frequency.setValueAtTime(frequency, currentTime);

    // Configure volume envelope with very quick fade in/out for natural flow
    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, currentTime + fadeIn);
    gainNode.gain.linearRampToValueAtTime(volume, currentTime + duration - fadeOut);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);

    // Connect audio nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Play the beep
    oscillator.start(currentTime);
    oscillator.stop(currentTime + duration);

    console.log(`🔊 Playing bleep: ${frequency}Hz for ${duration}s`);
  }

  /**
   * Play multiple bleeps for longer censored words
   */
  async playMultipleBleeps(count: number, interval: number = 0.05): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.generateBleep({
        frequency: 1000,
        duration: 0.2,      // Shorter bleeps for rapid fire
        volume: 0.7,
        fadeIn: 0.01,       // Very quick fades
        fadeOut: 0.01
      });
      
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, interval * 1000));
      }
    }
  }

  /**
   * Create a bleep sound based on text length with optimized timing
   */
  async bleepForText(text: string): Promise<void> {
    const cleanText = text.replace(/\*\*/g, ''); // Remove ** markers
    
    // Optimized duration calculation for better conversational flow
    let duration: number;
    if (cleanText.length <= 3) {
      duration = 0.25;    // Short words get quick bleeps
    } else if (cleanText.length <= 6) {
      duration = 0.35;    // Medium words
    } else {
      duration = 0.5;     // Longer words, but cap at 0.5s for flow
    }
    
    await this.generateBleep({
      frequency: 1000,
      duration,
      volume: 0.7,
      fadeIn: 0.02,       // Quick attack for natural speech flow
      fadeOut: 0.02       // Quick release
    });
  }

  /**
   * Different bleep styles for different contexts - all optimized for conversation
   */
  async playStyleBleep(style: 'tv' | 'radio' | 'harsh' | 'gentle' = 'tv'): Promise<void> {
    const configs = {
      tv: { frequency: 1000, duration: 0.3, volume: 0.7, fadeIn: 0.02, fadeOut: 0.02 },
      radio: { frequency: 800, duration: 0.4, volume: 0.6, fadeIn: 0.03, fadeOut: 0.03 },
      harsh: { frequency: 1200, duration: 0.25, volume: 0.8, fadeIn: 0.01, fadeOut: 0.01 },
      gentle: { frequency: 600, duration: 0.35, volume: 0.5, fadeIn: 0.05, fadeOut: 0.05 }
    };

    await this.generateBleep(configs[style]);
  }

  /**
   * Load and play a pre-recorded bleep sound file
   */
  async loadBleepAudio(audioUrl: string): Promise<void> {
    try {
      this.bleepAudio = new Audio(audioUrl);
      this.bleepAudio.volume = 0.7;
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
   * Test the bleep system with conversational timing
   */
  async testBleep(): Promise<void> {
    console.log('🧪 Testing bleep sound system...');
    await this.generateBleep({
      frequency: 1000,
      duration: 0.3,      // Shorter test duration
      volume: 0.5,
      fadeIn: 0.02,
      fadeOut: 0.02
    });
    console.log('✅ Bleep test complete');
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