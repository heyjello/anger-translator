/**
 * OpenRouter AI Service
 * 
 * Provides real AI translation capabilities using OpenRouter's unified API.
 * Optimized for Mixtral-8x7b-instruct and other high-quality models.
 */

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Default configuration optimized for Mixtral
const DEFAULT_CONFIG: OpenRouterConfig = {
  apiKey: '', // Will be set from environment or user input
  model: 'mistralai/mixtral-8x7b-instruct', // Your specified model
  baseUrl: 'https://openrouter.ai/api/v1'
};

// Available models with their characteristics (Mixtral featured prominently)
export const AVAILABLE_MODELS = {
  'mistralai/mixtral-8x7b-instruct': {
    name: 'Mixtral 8x7B Instruct',
    description: 'High-quality instruction-following model with excellent reasoning',
    maxTokens: 32768,
    costPer1kTokens: 0.00024,
    recommended: true,
    strengths: ['Creative writing', 'Instruction following', 'Humor generation']
  },
  'anthropic/claude-3-haiku': {
    name: 'Claude 3 Haiku',
    description: 'Fast, intelligent, and cost-effective',
    maxTokens: 4096,
    costPer1kTokens: 0.00025,
    recommended: true,
    strengths: ['Speed', 'Cost efficiency', 'General tasks']
  },
  'anthropic/claude-3-sonnet': {
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance and intelligence',
    maxTokens: 4096,
    costPer1kTokens: 0.003,
    recommended: false,
    strengths: ['Balanced performance', 'Reasoning', 'Analysis']
  },
  'openai/gpt-4o-mini': {
    name: 'GPT-4o Mini',
    description: 'OpenAI\'s efficient model',
    maxTokens: 4096,
    costPer1kTokens: 0.00015,
    recommended: true,
    strengths: ['Cost efficiency', 'General tasks', 'Speed']
  },
  'openai/gpt-4o': {
    name: 'GPT-4o',
    description: 'OpenAI\'s most capable model',
    maxTokens: 4096,
    costPer1kTokens: 0.005,
    recommended: false,
    strengths: ['Highest capability', 'Complex reasoning', 'Multimodal']
  },
  'meta-llama/llama-3.1-8b-instruct:free': {
    name: 'Llama 3.1 8B (Free)',
    description: 'Free open-source model',
    maxTokens: 2048,
    costPer1kTokens: 0,
    recommended: true,
    strengths: ['Free usage', 'Open source', 'Good performance']
  }
} as const;

export type ModelId = keyof typeof AVAILABLE_MODELS;

class OpenRouterService {
  private config: OpenRouterConfig;
  private isConfigured: boolean = false;

  constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.loadConfiguration();
  }

  /**
   * Load configuration from environment variables or localStorage
   */
  private loadConfiguration(): void {
    // Try to load from environment variables (for production)
    const envApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const envModel = import.meta.env.VITE_OPENROUTER_MODEL;
    
    if (envApiKey && envApiKey !== 'your_api_key_here') {
      this.config.apiKey = envApiKey;
      if (envModel && envModel in AVAILABLE_MODELS) {
        this.config.model = envModel;
      }
      this.isConfigured = true;
      console.log('🤖 OpenRouter configured from environment variables');
      console.log(`📋 Using model: ${this.config.model}`);
      return;
    }

    // Try to load from localStorage (for development/user settings)
    try {
      const savedConfig = localStorage.getItem('openrouter-config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.apiKey && parsed.apiKey !== 'your_api_key_here') {
          this.config = { ...this.config, ...parsed };
          this.isConfigured = !!this.config.apiKey;
          if (this.isConfigured) {
            console.log('🤖 OpenRouter configured from localStorage');
            console.log(`📋 Using model: ${this.config.model}`);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load OpenRouter config from localStorage:', error);
    }

    // If still not configured, log helpful message
    if (!this.isConfigured) {
      console.log('⚠️ OpenRouter not configured. Please set up your API key.');
      console.log('💡 Get your API key from: https://openrouter.ai/keys');
      console.log('💡 Configure via the AI status indicator in the app or set VITE_OPENROUTER_API_KEY in .env');
    }
  }

  /**
   * Save configuration to localStorage
   */
  private saveConfiguration(): void {
    try {
      localStorage.setItem('openrouter-config', JSON.stringify({
        apiKey: this.config.apiKey,
        model: this.config.model
      }));
      console.log('💾 OpenRouter configuration saved');
    } catch (error) {
      console.warn('Failed to save OpenRouter config to localStorage:', error);
    }
  }

  /**
   * Configure the service with API key and model
   */
  configure(apiKey: string, model: ModelId = 'mistralai/mixtral-8x7b-instruct'): void {
    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error('Please provide a valid OpenRouter API key');
    }
    
    this.config.apiKey = apiKey;
    this.config.model = model;
    this.isConfigured = true;
    this.saveConfiguration();
    console.log('✅ OpenRouter service configured successfully');
    console.log(`📋 Model set to: ${model}`);
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
  getStatus(): { configured: boolean; model: string; hasApiKey: boolean } {
    return {
      configured: this.isConfigured,
      model: this.config.model,
      hasApiKey: !!this.config.apiKey && this.config.apiKey !== 'your_api_key_here'
    };
  }

  /**
   * Set the model to use for translations
   */
  setModel(model: ModelId): void {
    this.config.model = model;
    this.saveConfiguration();
    console.log(`📋 Model changed to: ${model}`);
  }

  /**
   * Get information about the current model
   */
  getCurrentModel(): typeof AVAILABLE_MODELS[ModelId] {
    return AVAILABLE_MODELS[this.config.model as ModelId] || AVAILABLE_MODELS['mistralai/mixtral-8x7b-instruct'];
  }

  /**
   * Get all available models
   */
  getAvailableModels(): typeof AVAILABLE_MODELS {
    return AVAILABLE_MODELS;
  }

  /**
   * Make a request to OpenRouter API
   */
  private async makeRequest(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    if (!this.isReady()) {
      throw new Error('OpenRouter service not configured. Please provide a valid API key from https://openrouter.ai/keys');
    }

    const appName = import.meta.env.VITE_OPENROUTER_APP_NAME || 'Anger Translator';

    console.log(`🚀 Making request to OpenRouter with ${this.config.model}`);

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': appName
      },
      body: JSON.stringify({
        ...request,
        model: this.config.model
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ OpenRouter API error:', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenRouter API key from https://openrouter.ai/keys');
      }
      
      throw new Error(
        errorData.error?.message || 
        `OpenRouter API error: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log('✅ OpenRouter request successful');
    console.log(`📊 Tokens used: ${result.usage?.total_tokens || 'unknown'}`);
    
    return result;
  }

  /**
   * Generate a rage translation using AI (optimized for Mixtral)
   */
  async translateText(
    text: string, 
    style: 'corporate' | 'gamer' | 'sarcastic', 
    intensity: number
  ): Promise<string> {
    if (!this.isReady()) {
      throw new Error('OpenRouter API key not configured. Please set up your API key from https://openrouter.ai/keys');
    }

    const systemPrompt = this.buildMixtralOptimizedPrompt(style, intensity);
    const userPrompt = `Transform this polite message into a ${style} rage response at intensity level ${intensity}/10: "${text}"`;

    // Optimized parameters for Mixtral
    const request: OpenRouterRequest = {
      model: this.config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 400, // Increased for Mixtral's longer context
      temperature: 0.8, // Good balance for creative but controlled output
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    };

    try {
      const response = await this.makeRequest(request);
      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from AI model');
      }

      console.log('🎭 Translation generated successfully');
      return content.trim();
    } catch (error) {
      console.error('❌ Translation failed:', error);
      throw error;
    }
  }

  /**
   * Build system prompt optimized for Mixtral's instruction-following capabilities
   */
  private buildMixtralOptimizedPrompt(style: string, intensity: number): string {
    const basePrompt = `You are a comedic rage translator. Your task is to transform polite messages into hilarious angry responses while keeping the core message intact.

CRITICAL INSTRUCTIONS:
- Transform the tone completely while preserving the original meaning
- Make it funny and over-the-top, never genuinely offensive or harmful
- Use appropriate language for the chosen style
- Match the exact intensity level requested (1-10 scale)
- Keep responses under 200 words
- Focus on entertainment value, not actual anger
- Avoid genuinely hurtful or discriminatory content`;

    const styleInstructions = {
      corporate: `CORPORATE MELTDOWN STYLE:
Transform into a passive-aggressive corporate email response. Use professional language with barely contained frustration.

Key phrases to include:
- "As per my previous email"
- "Please advise"
- "Moving forward"
- "Per our discussion"
- "I trust this clarifies"
- Corporate buzzwords and formal language

Make it sound like a professional who's reached their limit but must maintain workplace decorum.`,

      gamer: `EPIC GAMER RAGE STYLE:
Transform into an over-the-top gaming rage response. Use gaming terminology, internet slang, and strategic CAPS LOCK.

Key expressions to include:
- "BRUH"
- "ARE YOU KIDDING ME"
- "GET REKT"
- "NOOB"
- "THIS IS UNREAL"
- Gaming references and internet culture

Make it sound like someone who just experienced the most frustrating gaming moment ever.`,

      sarcastic: `SARCASTIC ROAST STYLE:
Transform into a witty, sarcastic response dripping with sophisticated irony. Use intelligent vocabulary with cutting wit.

Key elements to include:
- Backhanded compliments
- Intellectual superiority tone
- Sophisticated vocabulary
- Irony and wit-based humor
- Phrases that sound nice but are actually insulting

Make it sound like someone who's intellectually superior and uses wit as their weapon.`
    };

    const intensityGuidance = this.getMixtralIntensityGuidance(intensity);

    return `${basePrompt}

${styleInstructions[style as keyof typeof styleInstructions]}

INTENSITY LEVEL: ${intensity}/10
${intensityGuidance}

Remember: Your goal is comedy and entertainment, not genuine anger or offense.`;
  }

  /**
   * Get intensity guidance optimized for Mixtral's understanding
   */
  private getMixtralIntensityGuidance(intensity: number): string {
    if (intensity <= 2) return "VERY MILD: Keep it subtle with gentle frustration. Think 'slightly annoyed but polite.'";
    if (intensity <= 4) return "MILD: Show clear frustration but remain relatively restrained. Think 'visibly annoyed but controlled.'";
    if (intensity <= 6) return "MODERATE: Make it obviously frustrated with strong emphasis. Think 'clearly angry but not explosive.'";
    if (intensity <= 8) return "HIGH: Make it quite intense and heated with dramatic language. Think 'very angry and showing it.'";
    return "MAXIMUM: Make it absolutely explosive and over-the-top with maximum drama and intensity. Think 'nuclear meltdown level rage.'";
  }

  /**
   * Test the API connection with a simple request
   */
  async testConnection(): Promise<{ success: boolean; model: string; error?: string }> {
    try {
      console.log('🧪 Testing OpenRouter connection...');
      const response = await this.translateText(
        "Hello, this is a test message.",
        "corporate",
        3
      );
      
      console.log('✅ Connection test successful');
      return {
        success: true,
        model: this.config.model
      };
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return {
        success: false,
        model: this.config.model,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get usage statistics (if available from the API)
   */
  async getUsageStats(): Promise<{ tokensUsed: number; requestsToday: number } | null> {
    // OpenRouter doesn't provide usage stats in the standard API
    // This could be implemented with additional tracking
    return null;
  }

  /**
   * Clear stored configuration
   */
  clearConfiguration(): void {
    this.config.apiKey = '';
    this.isConfigured = false;
    try {
      localStorage.removeItem('openrouter-config');
      console.log('🗑️ OpenRouter configuration cleared');
    } catch (error) {
      console.warn('Failed to clear OpenRouter config from localStorage:', error);
    }
  }

  /**
   * Get model recommendations based on use case
   */
  getModelRecommendations(): {
    best: ModelId;
    fastest: ModelId;
    cheapest: ModelId;
    free: ModelId;
  } {
    return {
      best: 'mistralai/mixtral-8x7b-instruct', // Your choice - excellent for creative tasks
      fastest: 'anthropic/claude-3-haiku',
      cheapest: 'openai/gpt-4o-mini',
      free: 'meta-llama/llama-3.1-8b-instruct:free'
    };
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();

// Export types and utilities
export { OpenRouterService };
export type { ModelId };