/**
 * ElevenLabs Text-to-Speech Service
 * 
 * Provides high-quality voice synthesis for translated text using ElevenLabs API.
 * Now uses the centralized voice configuration system with enhanced features.
 */

import { 
  getVoiceForStyle, 
  adjustVoiceForIntensity,
  getAdvancedVoiceConfig,
  preprocessTextForStyle,
  VOICE_MODELS,
  type VoiceConfig,
  type RageStyle
} from '../config/elevenLabsVoices';

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

// Default configuration
const DEFAULT_CONFIG: ElevenLabsConfig = {
  apiKey: '',
  baseUrl: 'https://api.elevenlabs.io/v1',
  defaultModel: VOICE_MODELS.standard.model_id
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
   * Load configuration from environment variables
   */
  private loadConfiguration(): void {
    const envApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    
    if (envApiKey && envApiKey !== 'your_api_key_here') {
      this.config.apiKey = envApiKey;
      this._isConfigured = true;
      console.log('🎤 ElevenLabs TTS configured from environment variables');
    } else {
      console.log('⚠️ ElevenLabs not configured. Please set VITE_ELEVENLABS_API_KEY in .env');
      console.log('💡 Get your API key from: https://elevenlabs.io/');
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return this._isConfigured && !!this.config.apiKey && this.config.apiKey !== 'your_api_key_here';
  }

  /**
   * Alternative method name for backward compatibility
   */
  isReady(): boolean {
    return this.isConfigured();
  }

  /**
   * Get current configuration status
   */
  getStatus(): { configured: boolean; hasApiKey: boolean } {
    return {
      configured: this._isConfigured,
      hasApiKey: !!this.config.apiKey && this.config.apiKey !== 'your_api_key_here'
    };
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
  private getCacheKey(text: string, voiceId: string, settings: VoiceConfig['voice_settings']): string {
    return `${voiceId}-${JSON.stringify(settings)}-${text.substring(0, 50)}`;
  }

  /**
   * Make a request to ElevenLabs API
   */
  private async makeRequest(request: TTSRequest): Promise<ArrayBuffer> {
    if (!this.isConfigured()) {
      throw new Error('ElevenLabs service not configured. Please provide a valid API key from https://elevenlabs.io/');
    }

    console.log(`🎤 Generating speech with voice: ${request.voice_id}`);

    const response = await fetch(`${this.config.baseUrl}/text-to-speech/${request.voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mp3',
        'Content-Type': 'application/json',
        'xi-api-key': this.config.apiKey
      },
      body: JSON.stringify({
        text: request.text,
        model_id: request.model_id || this.config.defaultModel,
        voice_settings: request.voice_settings
      })
    });

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

    return await response.arrayBuffer();
  }

  /**
   * Enhanced text-to-speech method using voice configuration system
   */
  async textToSpeech(
    text: string, 
    style: RageStyle,
    intensity: number
  ): Promise<ArrayBuffer> {
    if (!this.isConfigured()) {
      throw new Error('ElevenLabs service not configured');
    }

    // Get voice configuration for the style
    const voiceConfig = getVoiceForStyle(style);
    
    // Adjust settings based on intensity
    const adjustedSettings = adjustVoiceForIntensity(
      voiceConfig.voice_settings,
      intensity
    );

    // Preprocess text for better speech delivery
    const processedText = this.preprocessText(text, intensity);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voice_id}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mp3',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey
        },
        body: JSON.stringify({
          text: processedText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: adjustedSettings
        })
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return await response.arrayBuffer();
  }

  /**
   * Enhanced text preprocessing for better speech
   */
  private preprocessText(text: string, intensity: number): string {
    // Add pauses after punctuation for dramatic effect
    let processed = text
      .replace(/!/g, '! ... ')
      .replace(/\?/g, '? ... ')
      .replace(/\.\.\./g, ' ... ... ');

    // For high intensity, add more dramatic pauses
    if (intensity >= 7) {
      processed = processed.replace(/,/g, ', ... ');
    }

    // Add emphasis for all caps words
    if (intensity >= 8) {
      processed = processed.replace(/([A-Z]{3,})/g, '<emphasis level="strong">$1</emphasis>');
    }

    return processed;
  }

  /**
   * Get current voice info for a style
   */
  getCurrentVoiceInfo(style: RageStyle): string {
    const voice = getVoiceForStyle(style);
    return `${voice.name} - ${voice.description}`;
  }

  /**
   * Convert text to speech with advanced voice configuration (enhanced version)
   */
  async generateSpeech(
    text: string, 
    style: string = 'corporate',
    rageLevel: number = 5
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('ElevenLabs API key not configured. Please set up your API key from https://elevenlabs.io/');
    }

    // Get advanced voice configuration
    const voiceConfig = getAdvancedVoiceConfig(
      style as RageStyle, 
      rageLevel
    );
    
    // Check cache first
    const cacheKey = this.getCacheKey(text, voiceConfig.voice_id, voiceConfig.voice_settings);
    if (this.audioCache.has(cacheKey)) {
      console.log('🎵 Using cached audio');
      return this.audioCache.get(cacheKey)!;
    }

    // Preprocess text for better speech synthesis
    const processedText = preprocessTextForStyle(
      text, 
      style as RageStyle, 
      rageLevel
    );

    // Prepare request
    const request: TTSRequest = {
      text: processedText,
      voice_id: voiceConfig.voice_id,
      voice_settings: voiceConfig.voice_settings,
      model_id: this.config.defaultModel
    };

    try {
      const audioBuffer = await this.makeRequest(request);
      
      // Convert to blob URL
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Cache the result
      this.audioCache.set(cacheKey, audioUrl);
      
      console.log('✅ Speech generated successfully');
      console.log(`🎭 Voice: ${voiceConfig.name} (${voiceConfig.description})`);
      console.log(`🎚️ Settings: Stability ${voiceConfig.voice_settings.stability}, Style ${voiceConfig.voice_settings.style}`);
      
      return audioUrl;
    } catch (error) {
      console.error('❌ Speech generation failed:', error);
      throw error;
    }
  }

  /**
   * Test the API connection with a style-specific test phrase
   */
  async testConnection(style: RageStyle = 'corporate'): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🧪 Testing ElevenLabs connection...');
      
      // Import test phrase function
      const { createTestPhrase } = await import('../config/elevenLabsVoices');
      const testText = createTestPhrase(style);
      
      const audioUrl = await this.generateSpeech(testText, style, 3);
      
      // Clean up test audio
      URL.revokeObjectURL(audioUrl);
      
      console.log('✅ Connection test successful');
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
   * Get available voice configurations
   */
  getAvailableVoices(): Array<{ id: string; name: string; style: string; description: string }> {
    const { VOICE_CONFIGS } = require('../config/elevenLabsVoices');
    return Object.entries(VOICE_CONFIGS).map(([style, config]: [string, any]) => ({
      id: config.voice_id,
      name: config.name,
      style,
      description: config.description
    }));
  }

  /**
   * Get available voice models
   */
  getAvailableModels(): typeof VOICE_MODELS {
    return VOICE_MODELS;
  }

  /**
   * Set voice model quality
   */
  setVoiceModel(modelKey: keyof typeof VOICE_MODELS): void {
    this.config.defaultModel = VOICE_MODELS[modelKey].model_id;
    console.log(`🎚️ Voice model set to: ${VOICE_MODELS[modelKey].name}`);
  }

  /**
   * Clear audio cache
   */
  clearCache(): void {
    // Revoke all blob URLs to free memory
    this.audioCache.forEach(url => URL.revokeObjectURL(url));
    this.audioCache.clear();
    console.log('🗑️ Audio cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.audioCache.size,
      keys: Array.from(this.audioCache.keys())
    };
  }

  /**
   * Get voice configuration for a specific style
   */
  getVoiceConfig(style: string): VoiceConfig {
    const validStyle = style as RageStyle;
    return getVoiceForStyle(validStyle);
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService();

// Export types
export type { TTSRequest, VoiceConfig };