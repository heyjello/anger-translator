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
   * Extract key context from input without repeating it
   */
  private extractContext(text: string): string {
    const lowerText = text.toLowerCase();
    
    // Detect main topic
    if (lowerText.includes('credit') || lowerText.includes('recognition')) return 'credit/recognition';
    if (lowerText.includes('meeting') || lowerText.includes('schedule')) return 'meeting';
    if (lowerText.includes('document') || lowerText.includes('report')) return 'document';
    if (lowerText.includes('help') || lowerText.includes('assist')) return 'assistance';
    if (lowerText.includes('review') || lowerText.includes('feedback')) return 'review';
    if (lowerText.includes('fix') || lowerText.includes('problem')) return 'issue';
    
    return 'request';
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
   * Generate ultra-concise rage translation (optimized for Mixtral)
   */
  async translateText(
    text: string, 
    style: 'corporate' | 'gamer' | 'sarcastic', 
    intensity: number
  ): Promise<string> {
    if (!this.isReady()) {
      throw new Error('OpenRouter API key not configured. Please set up your API key from https://openrouter.ai/keys');
    }

    const context = this.extractContext(text);
    const systemPrompt = this.buildAuthenticRagePrompt(style, intensity);
    const userPrompt = `Create a brief ${style} rage response about ${context}. Maximum 2 sentences.`;

    // Ultra-restrictive parameters for minimal output
    const request: OpenRouterRequest = {
      model: this.config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 80, // Drastically reduced
      temperature: 0.7,
      top_p: 0.8,
      frequency_penalty: 0.3,
      presence_penalty: 0.2
    };

    try {
      const response = await this.makeRequest(request);
      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from AI model');
      }

      // Additional length check - truncate if too long
      const sentences = content.split(/[.!?]+/).filter(s => s.trim());
      const truncated = sentences.slice(0, 2).join('. ').trim();
      
      console.log('🎭 Ultra-concise translation generated');
      return truncated + (truncated.endsWith('.') || truncated.endsWith('!') || truncated.endsWith('?') ? '' : '!');
    } catch (error) {
      console.error('❌ Translation failed:', error);
      throw error;
    }
  }

  /**
   * Build authentic rage prompt based on real anger patterns
   */
  private buildAuthenticRagePrompt(style: string, intensity: number): string {
    const rageLevel = this.getAuthenticRageLevel(intensity);
    
    const stylePrompts = {
      corporate: `Create a brief corporate rage response. ${rageLevel.corporate}`,
      gamer: `Create a short gamer rage response. ${rageLevel.gamer}`,
      sarcastic: `Create a concise sarcastic response. ${rageLevel.sarcastic}`
    };

    return `You create ultra-brief rage responses that sound like real angry people. MAXIMUM 2 sentences. NO repetition of input text.

${stylePrompts[style as keyof typeof stylePrompts]}

Rules:
- NEVER quote or repeat the original text
- Maximum 2 sentences, under 50 words
- Make it funny, not offensive
- Sound like authentic human anger at level ${intensity}/10
- Use profanity appropriately for high intensity levels (8-10)`;
  }

  /**
   * Get authentic rage level descriptions with REAL profanity for high levels
   */
  private getAuthenticRageLevel(intensity: number): {
    corporate: string;
    gamer: string;
    sarcastic: string;
  } {
    switch (intensity) {
      case 1:
        return {
          corporate: "Slightly annoyed but professional. Use 'I wanted to follow up' or 'Just checking in'.",
          gamer: "Mildly frustrated. Use 'ugh' or 'seriously?' with minimal caps.",
          sarcastic: "Gentle irony. Use 'how lovely' or 'that's great' with subtle sarcasm."
        };
      
      case 2:
        return {
          corporate: "Politely irritated. Use 'As mentioned' or 'Per my email' with slight edge.",
          gamer: "Getting annoyed. Use 'come on' or 'really?' with some emphasis.",
          sarcastic: "Light mockery. Use 'wonderful' or 'fantastic' with obvious sarcasm."
        };
      
      case 3:
        return {
          corporate: "Clearly frustrated. Use 'As I stated previously' with firm tone.",
          gamer: "Visibly annoyed. Use 'dude' or 'what the heck' with moderate caps.",
          sarcastic: "Clear disdain. Use 'how delightful' or 'absolutely brilliant' with bite."
        };
      
      case 4:
        return {
          corporate: "Losing patience. Use 'I need to reiterate' or 'This is the third time' with urgency.",
          gamer: "Getting heated. Use 'are you serious' or 'this is ridiculous' with some CAPS.",
          sarcastic: "Sharp wit. Use 'how absolutely precious' or 'what a masterpiece' with cutting tone."
        };
      
      case 5:
        return {
          corporate: "Clearly angry. Use 'I NEED' or 'This is UNACCEPTABLE' with strategic caps.",
          gamer: "Properly mad. Use 'WHAT' or 'ARE YOU KIDDING ME' with caps and emphasis.",
          sarcastic: "Biting sarcasm. Use 'OH how WONDERFUL' or 'absolutely RIVETING' with caps for emphasis."
        };
      
      case 6:
        return {
          corporate: "Very frustrated. Use 'THIS IS RIDICULOUS' or 'I CANNOT BELIEVE' with caps and exclamation.",
          gamer: "Really angry. Use 'BRUH' or 'THIS IS INSANE' with multiple caps words.",
          sarcastic: "Scathing mockery. Use 'OH MAGNIFICENT' or 'how absolutely THRILLING' with heavy sarcasm."
        };
      
      case 7:
        return {
          corporate: "Extremely angry. Use 'I AM DONE' or 'THIS IS ABSOLUTELY UNACCEPTABLE' with multiple caps.",
          gamer: "Seriously pissed. Use 'WHAT THE HELL' or 'ARE YOU FREAKING SERIOUS' with lots of caps.",
          sarcastic: "Savage wit. Use 'OH how absolutely SPECTACULAR' or 'what a BRILLIANT display' with venom."
        };
      
      case 8:
        return {
          corporate: "Furious but professional. Use 'I HAVE HAD ENOUGH' or 'THIS ENDS NOW' with caps and urgency. Light profanity acceptable: 'damn', 'hell'.",
          gamer: "Really mad. Use 'WHAT IS WRONG WITH YOU' or 'THIS IS ABSOLUTELY INSANE' with heavy caps. Use 'damn', 'hell', 'crap'.",
          sarcastic: "Brutal sarcasm. Use 'OH how absolutely DIVINE' or 'what a STUNNING example' with pure venom. Light profanity for emphasis."
        };
      
      case 9:
        return {
          corporate: "Barely contained professional rage. Use 'I AM ABSOLUTELY LIVID' or 'THIS IS BEYOND UNACCEPTABLE' with full caps. Moderate profanity: 'damn', 'hell', 'shit'.",
          gamer: "Extremely pissed. Use 'WHAT THE ACTUAL HELL' or 'ARE YOU OUT OF YOUR MIND' with maximum caps. Strong profanity: 'shit', 'damn', 'hell'.",
          sarcastic: "Devastating wit. Use 'OH how absolutely EXQUISITE' or 'what a PHENOMENAL disaster' with pure hatred. Moderate profanity for impact."
        };
      
      case 10:
        return {
          corporate: "Nuclear professional meltdown. Use 'I AM DONE WITH THIS BULLSHIT' or 'THIS IS COMPLETE FUCKING NONSENSE' with full rage. Strong profanity acceptable: 'fucking', 'bullshit', 'goddamn'.",
          gamer: "Absolute nuclear fury. Use 'WHAT THE FUCK IS THIS SHIT' or 'I'M LOSING MY FUCKING MIND' with maximum intensity. Full profanity: 'fuck', 'shit', 'goddamn'.",
          sarcastic: "Pure nuclear destruction. Use 'OH how absolutely FUCKING PERFECT' or 'what a GODDAMN MASTERPIECE' with nuclear sarcasm. Strong profanity for maximum impact."
        };
      
      default:
        return this.getAuthenticRageLevel(5);
    }
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