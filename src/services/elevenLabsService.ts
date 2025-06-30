/**
 * ElevenLabs Text-to-Speech Service
 * 
 * Uses voices EXACTLY as they come from ElevenLabs with NO modifications.
 * All voice settings are preserved exactly as configured in ElevenLabs.
 */

import { 
  getVoiceForStyle, 
  cleanTextForTTS,
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
   * Make a request to ElevenLabs API with NO MODIFICATIONS to voice settings
   */
  private async makeRequest(request: TTSRequest): Promise<ArrayBuffer> {
    if (!this.isConfigured()) {
      throw new Error('ElevenLabs service not configured. Please provide a valid API key from https://elevenlabs.io/');
    }

    console.log(`🎤 Generating speech with voice: ${request.voice_id} (NO MODIFICATIONS)`);

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
        voice_settings: request.voice_settings // USED EXACTLY AS PROVIDED
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
   * Generate speech using voice EXACTLY as configured in ElevenLabs
   */
  async generateSpeech(
    text: string, 
    style: string = 'corporate',
    rageLevel: number = 5
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('ElevenLabs API key not configured. Please set up your API key from https://elevenlabs.io/');
    }

    // Get voice configuration - NO MODIFICATIONS
    const voiceConfig = getVoiceForStyle(style as RageStyle);
    
    // Clean text to remove tone cues only
    const cleanedText = cleanTextForTTS(text);
    
    // Check cache first
    const cacheKey = this.getCacheKey(cleanedText, voiceConfig.voice_id);
    if (this.audioCache.has(cacheKey)) {
      console.log('🎵 Using cached audio');
      return this.audioCache.get(cacheKey)!;
    }

    // Prepare request with EXACT voice settings from ElevenLabs
    const request: TTSRequest = {
      text: cleanedText,
      voice_id: voiceConfig.voice_id,
      voice_settings: voiceConfig.voice_settings, // NO MODIFICATIONS
      model_id: this.config.defaultModel
    };

    try {
      const audioBuffer = await this.makeRequest(request);
      
      // Convert to blob URL
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Cache the result
      this.audioCache.set(cacheKey, audioUrl);
      
      console.log('✅ Speech generated successfully with UNMODIFIED voice settings');
      console.log(`🎭 Voice: ${voiceConfig.name} (${voiceConfig.description})`);
      console.log(`🎚️ Settings: EXACTLY as configured in ElevenLabs`);
      
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
      console.log('🧪 Testing ElevenLabs connection...');
      
      const testText = "This is a test of the ElevenLabs voice service.";
      const audioUrl = await this.generateSpeech(testText, style, 30);
      
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
  getStatus(): { configured: boolean; hasApiKey: boolean } {
    return {
      configured: this._isConfigured,
      hasApiKey: !!this.config.apiKey && this.config.apiKey !== 'your_api_key_here'
    };
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService();

// Export types
export type { TTSRequest, VoiceConfig };