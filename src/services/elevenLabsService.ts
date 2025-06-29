/**
 * ElevenLabs Text-to-Speech Service
 * 
 * Provides high-quality voice synthesis for translated text using ElevenLabs API.
 * Supports multiple voices and voice settings for different rage styles.
 */

export interface ElevenLabsConfig {
  apiKey: string;
  baseUrl: string;
  defaultVoiceId: string;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export interface TTSRequest {
  text: string;
  voice_id: string;
  voice_settings: VoiceSettings;
  model_id?: string;
}

// Voice configurations for different rage styles
export const VOICE_CONFIGS = {
  corporate: {
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella - Professional female voice
    name: 'Bella (Professional)',
    settings: {
      stability: 0.75,
      similarity_boost: 0.8,
      style: 0.2,
      use_speaker_boost: true
    }
  },
  gamer: {
    voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - Energetic male voice
    name: 'Adam (Energetic)',
    settings: {
      stability: 0.5,
      similarity_boost: 0.9,
      style: 0.8,
      use_speaker_boost: true
    }
  },
  sarcastic: {
    voiceId: 'ThT5KcBeYPX3keUQqHPh', // Dorothy - Sophisticated female voice
    name: 'Dorothy (Sophisticated)',
    settings: {
      stability: 0.8,
      similarity_boost: 0.7,
      style: 0.6,
      use_speaker_boost: true
    }
  },
  default: {
    voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam as default
    name: 'Adam (Default)',
    settings: {
      stability: 0.7,
      similarity_boost: 0.8,
      style: 0.5,
      use_speaker_boost: true
    }
  }
} as const;

export type VoiceStyle = keyof typeof VOICE_CONFIGS;

// Default configuration
const DEFAULT_CONFIG: ElevenLabsConfig = {
  apiKey: '',
  baseUrl: 'https://api.elevenlabs.io/v1',
  defaultVoiceId: VOICE_CONFIGS.default.voiceId
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
   * Get voice configuration for a specific style
   */
  getVoiceConfig(style: string): typeof VOICE_CONFIGS[VoiceStyle] {
    const voiceStyle = style as VoiceStyle;
    return VOICE_CONFIGS[voiceStyle] || VOICE_CONFIGS.default;
  }

  /**
   * Generate cache key for audio
   */
  private getCacheKey(text: string, voiceId: string, settings: VoiceSettings): string {
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
        model_id: request.model_id || 'eleven_monolingual_v1',
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
   * Convert text to speech with style-appropriate voice
   */
  async textToSpeech(
    text: string, 
    style: string = 'default',
    rageLevel: number = 5
  ): Promise<string> {
    if (!this.isReady()) {
      throw new Error('ElevenLabs API key not configured. Please set up your API key from https://elevenlabs.io/');
    }

    // Get voice configuration for the style
    const voiceConfig = this.getVoiceConfig(style);
    
    // Adjust voice settings based on rage level
    const adjustedSettings = this.adjustSettingsForRage(voiceConfig.settings, rageLevel);
    
    // Check cache first
    const cacheKey = this.getCacheKey(text, voiceConfig.voiceId, adjustedSettings);
    if (this.audioCache.has(cacheKey)) {
      console.log('🎵 Using cached audio');
      return this.audioCache.get(cacheKey)!;
    }

    // Prepare request
    const request: TTSRequest = {
      text: this.preprocessText(text, style, rageLevel),
      voice_id: voiceConfig.voiceId,
      voice_settings: adjustedSettings,
      model_id: 'eleven_monolingual_v1'
    };

    try {
      const audioBuffer = await this.makeRequest(request);
      
      // Convert to blob URL
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Cache the result
      this.audioCache.set(cacheKey, audioUrl);
      
      console.log('✅ Speech generated successfully');
      return audioUrl;
    } catch (error) {
      console.error('❌ Speech generation failed:', error);
      throw error;
    }
  }

  /**
   * Adjust voice settings based on rage level
   */
  private adjustSettingsForRage(baseSettings: VoiceSettings, rageLevel: number): VoiceSettings {
    // Higher rage = less stability, more style
    const rageMultiplier = rageLevel / 10;
    
    return {
      ...baseSettings,
      stability: Math.max(0.1, baseSettings.stability - (rageMultiplier * 0.3)),
      style: Math.min(1.0, (baseSettings.style || 0.5) + (rageMultiplier * 0.4)),
      use_speaker_boost: true
    };
  }

  /**
   * Preprocess text for better speech synthesis
   */
  private preprocessText(text: string, style: string, rageLevel: number): string {
    let processedText = text;

    // Add pauses for emphasis
    processedText = processedText.replace(/\.\.\./g, '... <break time="0.5s"/>');
    processedText = processedText.replace(/!!!/g, '!!! <break time="0.3s"/>');
    
    // Add emphasis for caps
    processedText = processedText.replace(/([A-Z]{3,})/g, '<emphasis level="strong">$1</emphasis>');
    
    // Style-specific adjustments
    switch (style) {
      case 'corporate':
        // Add professional pauses
        processedText = processedText.replace(/,/g, ', <break time="0.2s"/>');
        break;
      case 'gamer':
        // Emphasize gaming terms
        processedText = processedText.replace(/(BRUH|NOOB|GET REKT)/g, '<emphasis level="strong">$1</emphasis>');
        break;
      case 'sarcastic':
        // Add sarcastic tone with slower pace
        processedText = `<prosody rate="0.9">${processedText}</prosody>`;
        break;
    }

    // Rage level adjustments
    if (rageLevel >= 8) {
      processedText = `<prosody rate="1.1" pitch="+10%">${processedText}</prosody>`;
    } else if (rageLevel >= 6) {
      processedText = `<prosody rate="1.05" pitch="+5%">${processedText}</prosody>`;
    }

    return processedText;
  }

  /**
   * Play audio from URL
   */
  async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Failed to play audio'));
      
      audio.play().catch(reject);
    });
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🧪 Testing ElevenLabs connection...');
      const audioUrl = await this.textToSpeech('Hello, this is a test.', 'default', 3);
      
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
   * Clear audio cache
   */
  clearCache(): void {
    // Revoke all blob URLs to free memory
    this.audioCache.forEach(url => URL.revokeObjectURL(url));
    this.audioCache.clear();
    console.log('🗑️ Audio cache cleared');
  }

  /**
   * Get available voices for the current style
   */
  getAvailableVoices(): Array<{ id: string; name: string; style: string }> {
    return Object.entries(VOICE_CONFIGS).map(([style, config]) => ({
      id: config.voiceId,
      name: config.name,
      style
    }));
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService();

// Export types
export type { VoiceSettings, TTSRequest };