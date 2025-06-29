/**
 * ElevenLabs Text-to-Speech Service
 * 
 * Provides high-quality voice synthesis for translated text using ElevenLabs API.
 * Now uses the centralized voice configuration system.
 */

import { 
  VOICE_CONFIGS, 
  getVoiceForStyle, 
  adjustVoiceForIntensity,
  getAdvancedVoiceConfig,
  preprocessTextForStyle,
  VOICE_MODELS,
  type VoiceConfig
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

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private isConfigured: boolean = false;
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
      this.isConfigured = true;
      console.log('🎤 ElevenLabs TTS configured from environment variables');
    } else {
      console.log('⚠️ ElevenLabs not configured. Please set VITE_ELEVENLABS_API_KEY in .env');
      console.log('💡 Get your API key from: https://elevenlabs.io/');
    }
  }

  /**
   * Check if the service is properly configured
   */
  isReady(): boolean {
    return this.isConfigured && !!this.config.apiKey && this.config.apiKey !== 'your_api_key_here';
  }

  /**
   * Get current configuration status
   */
  getStatus(): { configured: boolean; hasApiKey: boolean } {
    return {
      configured: this.isConfigured,
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
    this.isConfigured = true;
    console.log('✅ ElevenLabs TTS service configured successfully');
  }

  /**
   * Get voice configuration for a specific style using the new config system
   */
  getVoiceConfig(style: string): VoiceConfig {
    const validStyle = style as 'corporate' | 'gamer' | 'sarcastic';
    return getVoiceForStyle(validStyle);
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
    if (!this.isReady()) {
      throw new Error('ElevenLabs service not configured. Please provide a valid API key from https://elevenlabs.io/');
    }

    console.log(`🎤 Generating speech with voice: ${request.voice_id}`);

    const response = await fetch(`${this.config.baseUrl}/text-to-speech/${request.voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
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
   * Convert text to speech with advanced voice configuration
   */
  async textToSpeech(
    text: string, 
    style: string = 'corporate',
    rageLevel: number = 5
  ): Promise<string> {
    if (!this.isReady()) {
      throw new Error('ElevenLabs API key not configured. Please set up your API key from https://elevenlabs.io/');
    }

    // Get advanced voice configuration
    const voiceConfig = getAdvancedVoiceConfig(
      style as 'corporate' | 'gamer' | 'sarcastic', 
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
      style as 'corporate' | 'gamer' | 'sarcastic', 
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
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
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
  async testConnection(style: 'corporate' | 'gamer' | 'sarcastic' = 'corporate'): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🧪 Testing ElevenLabs connection...');
      
      // Import test phrase function
      const { createTestPhrase } = await import('../config/elevenLabsVoices');
      const testText = createTestPhrase(style);
      
      const audioUrl = await this.textToSpeech(testText, style, 3);
      
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
    return Object.entries(VOICE_CONFIGS).map(([style, config]) => ({
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
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService();

// Export types
export type { TTSRequest, VoiceConfig };