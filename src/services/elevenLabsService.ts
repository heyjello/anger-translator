/**
 * ElevenLabs Text-to-Speech Service
 * 
 * Updated for ElevenLabs v3 format with proper audio tag support.
 * Uses text with audio tags directly without XML processing.
 * Now integrated with secure key manager.
 */

import { 
  getVoiceForStyle, 
  VOICE_MODELS,
  type VoiceConfig,
  type RageStyle
} from '../config/elevenLabsVoices';
import { secureKeyManager } from './secureKeyManager';

export interface ElevenLabsConfig {
  apiKey: string;
  baseUrl: string;
  defaultModel: string;
}

export interface TTSRequest {
  text: string;
  voice_id: string;
  voice_settings: VoiceConfig['voice_settings'];
  model_id?: string;
}

// Default configuration for ElevenLabs v3
const DEFAULT_CONFIG: ElevenLabsConfig = {
  apiKey: '',
  baseUrl: 'https://api.elevenlabs.io/v1',
  defaultModel: VOICE_MODELS.turbo.model_id // Use turbo v2.5 for v3 features
};

export class ElevenLabsService {
  private config: ElevenLabsConfig;
  private _isConfigured: boolean = false;
  private audioCache: Map<string, string> = new Map();

  constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.loadConfiguration();
  }

  /**
   * Load configuration from secure key manager, environment variables, or localStorage
   */
  private loadConfiguration(): void {
    // First, try secure key manager
    const secureApiKey = secureKeyManager.getKey('elevenlabs');
    if (secureApiKey) {
      this.config.apiKey = secureApiKey;
      this._isConfigured = true;
      console.log('🎤 ElevenLabs TTS configured from secure key manager');
      return;
    }

    // Fallback to environment variables
    const envApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (envApiKey && envApiKey !== 'your_api_key_here') {
      this.config.apiKey = envApiKey;
      this._isConfigured = true;
      console.log('🎤 ElevenLabs TTS configured from environment variables');
      return;
    }

    console.log('⚠️ ElevenLabs not configured. Please set up your API key.');
    console.log('💡 Get your API key from: https://elevenlabs.io/');
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    // Always check secure key manager first
    const secureKey = secureKeyManager.getKey('elevenlabs');
    if (secureKey) {
      this.config.apiKey = secureKey;
      this._isConfigured = true;
      return true;
    }

    return this._isConfigured && !!this.config.apiKey && this.config.apiKey !== 'your_api_key_here';
  }

  /**
   * Configure the service with API key
   */
  configure(apiKey: string): void {
    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error('Please provide a valid ElevenLabs API key');
    }
    
    this.config.apiKey = apiKey;
    this._isConfigured = true;
    console.log('✅ ElevenLabs TTS service configured successfully');
  }

  /**
   * Generate cache key for audio
   */
  private getCacheKey(text: string, voiceId: string): string {
    return `${voiceId}-${text.substring(0, 50)}`;
  }

  /**
   * Generate speech using ElevenLabs v3 format with audio tags
   */
  async generateSpeech(
    text: string, 
    style: string = 'corporate',
    rageLevel: number = 5
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('ElevenLabs API key not configured. Please set up your API key from https://elevenlabs.io/');
    }

    // Get voice configuration
    const voiceConfig = getVoiceForStyle(style as RageStyle);
    
    // Check cache first
    const cacheKey = this.getCacheKey(text, voiceConfig.voice_id);
    if (this.audioCache.has(cacheKey)) {
      console.log('🎵 Using cached audio');
      return this.audioCache.get(cacheKey)!;
    }

    console.log(`🎤 Generating speech with ElevenLabs v3 - Voice: ${voiceConfig.name}`);
    console.log(`📝 Text with audio tags: ${text.substring(0, 100)}...`);

    try {
      const response = await fetch(
        `${this.config.baseUrl}/text-to-speech/${voiceConfig.voice_id}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.config.apiKey
          },
          body: JSON.stringify({
            text: text, // Text with proper [audio tags], no XML processing
            model_id: this.config.defaultModel, // eleven_turbo_v2_5 for v3 features
            voice_settings: {
              ...voiceConfig.voice_settings,
              stability: 0.3, // Lower for more expression with v3
              similarity_boost: 0.7
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ ElevenLabs API error:', errorData);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your ElevenLabs API key from https://elevenlabs.io/');
        }
        
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before making another request.');
        }
        
        throw new Error(
          errorData.detail?.message || 
          `ElevenLabs API error: ${response.status} ${response.statusText}`
        );
      }

      // Convert response to blob URL
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Cache the result
      this.audioCache.set(cacheKey, audioUrl);
      
      console.log('✅ Speech generated successfully with ElevenLabs v3');
      console.log(`🎭 Voice: ${voiceConfig.name} (${voiceConfig.description})`);
      console.log(`🎚️ Model: ${this.config.defaultModel} with enhanced expression`);
      
      return audioUrl;
    } catch (error) {
      console.error('❌ Speech generation failed:', error);
      throw error;
    }
  }

  /**
   * Test the API connection
   */
  async testConnection(style: RageStyle = 'corporate'): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🧪 Testing ElevenLabs v3 connection...');
      
      const testText = "This is a test of the ElevenLabs voice service with enhanced expression.";
      const audioUrl = await this.generateSpeech(testText, style, 30);
      
      // Clean up test audio
      URL.revokeObjectURL(audioUrl);
      
      console.log('✅ ElevenLabs v3 connection test successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get voice configuration for a specific style
   */
  getVoiceConfig(style: string): VoiceConfig {
    return getVoiceForStyle(style as RageStyle);
  }

  /**
   * Clear audio cache
   */
  clearCache(): void {
    this.audioCache.forEach(url => URL.revokeObjectURL(url));
    this.audioCache.clear();
    console.log('🗑️ Audio cache cleared');
  }

  /**
   * Get current voice info for a style
   */
  getCurrentVoiceInfo(style: RageStyle): string {
    const voice = getVoiceForStyle(style);
    return `${voice.name} - ${voice.description}`;
  }

  /**
   * Get status
   */
  getStatus(): { configured: boolean; hasApiKey: boolean; model: string } {
    return {
      configured: this.isConfigured(),
      hasApiKey: this.isConfigured(),
      model: this.config.defaultModel
    };
  }

  /**
   * Test speech generation with different character styles
   */
  async testCharacterVoices(): Promise<void> {
    const testPhrases = {
      corporate: "As per my previous email, this needs immediate attention.",
      gamer: "This is absolutely ridiculous! I'm about to rage quit!",
      sarcastic: "Oh, how absolutely delightful. What a masterpiece.",
      karen: "I want to speak to your manager RIGHT NOW!",
      enforcer: "OH HELL NAH! You must be joking right now!"
    };

    console.log('🧪 Testing character voices with ElevenLabs v3...');
    
    for (const [style, phrase] of Object.entries(testPhrases)) {
      try {
        console.log(`🎭 Testing ${style} voice...`);
        const audioUrl = await this.generateSpeech(phrase, style, 50);
        URL.revokeObjectURL(audioUrl); // Clean up immediately
        console.log(`✅ ${style} voice test successful`);
      } catch (error) {
        console.error(`❌ ${style} voice test failed:`, error);
      }
    }
    
    console.log('🎉 Character voice testing complete');
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService();

// Export types
export type { TTSRequest, VoiceConfig };