/**
 * OpenRouter AI Service
 * 
 * Provides real AI translation capabilities using OpenRouter's unified API.
 * Supports multiple models including GPT-4, Claude, and others.
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

// Default configuration
const DEFAULT_CONFIG: OpenRouterConfig = {
  apiKey: '', // Will be set from environment or user input
  model: 'anthropic/claude-3-haiku', // Fast and cost-effective model
  baseUrl: 'https://openrouter.ai/api/v1'
};

// Available models with their characteristics
export const AVAILABLE_MODELS = {
  'anthropic/claude-3-haiku': {
    name: 'Claude 3 Haiku',
    description: 'Fast, intelligent, and cost-effective',
    maxTokens: 4096,
    costPer1kTokens: 0.00025
  },
  'anthropic/claude-3-sonnet': {
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance and intelligence',
    maxTokens: 4096,
    costPer1kTokens: 0.003
  },
  'openai/gpt-4o-mini': {
    name: 'GPT-4o Mini',
    description: 'OpenAI\'s efficient model',
    maxTokens: 4096,
    costPer1kTokens: 0.00015
  },
  'openai/gpt-4o': {
    name: 'GPT-4o',
    description: 'OpenAI\'s most capable model',
    maxTokens: 4096,
    costPer1kTokens: 0.005
  },
  'meta-llama/llama-3.1-8b-instruct:free': {
    name: 'Llama 3.1 8B (Free)',
    description: 'Free open-source model',
    maxTokens: 2048,
    costPer1kTokens: 0
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
    if (envApiKey) {
      this.config.apiKey = envApiKey;
      this.isConfigured = true;
      return;
    }

    // Try to load from localStorage (for development/user settings)
    try {
      const savedConfig = localStorage.getItem('openrouter-config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        this.config = { ...this.config, ...parsed };
        this.isConfigured = !!this.config.apiKey;
      }
    } catch (error) {
      console.warn('Failed to load OpenRouter config from localStorage:', error);
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
    } catch (error) {
      console.warn('Failed to save OpenRouter config to localStorage:', error);
    }
  }

  /**
   * Configure the service with API key and model
   */
  configure(apiKey: string, model: ModelId = 'anthropic/claude-3-haiku'): void {
    this.config.apiKey = apiKey;
    this.config.model = model;
    this.isConfigured = true;
    this.saveConfiguration();
  }

  /**
   * Check if the service is properly configured
   */
  isReady(): boolean {
    return this.isConfigured && !!this.config.apiKey;
  }

  /**
   * Get current configuration status
   */
  getStatus(): { configured: boolean; model: string; hasApiKey: boolean } {
    return {
      configured: this.isConfigured,
      model: this.config.model,
      hasApiKey: !!this.config.apiKey
    };
  }

  /**
   * Set the model to use for translations
   */
  setModel(model: ModelId): void {
    this.config.model = model;
    this.saveConfiguration();
  }

  /**
   * Get information about the current model
   */
  getCurrentModel(): typeof AVAILABLE_MODELS[ModelId] {
    return AVAILABLE_MODELS[this.config.model as ModelId] || AVAILABLE_MODELS['anthropic/claude-3-haiku'];
  }

  /**
   * Make a request to OpenRouter API
   */
  private async makeRequest(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    if (!this.isReady()) {
      throw new Error('OpenRouter service not configured. Please provide an API key.');
    }

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Anger Translator'
      },
      body: JSON.stringify({
        ...request,
        model: this.config.model
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `OpenRouter API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  /**
   * Generate a rage translation using AI
   */
  async translateText(
    text: string, 
    style: 'corporate' | 'gamer' | 'sarcastic', 
    intensity: number
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(style, intensity);
    const userPrompt = `Transform this polite message: "${text}"`;

    const request: OpenRouterRequest = {
      model: this.config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.8,
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

      return content.trim();
    } catch (error) {
      console.error('OpenRouter translation failed:', error);
      throw error;
    }
  }

  /**
   * Build system prompt based on style and intensity
   */
  private buildSystemPrompt(style: string, intensity: number): string {
    const basePrompt = `You are an expert at transforming polite messages into comedic rage responses. Your job is to take polite, professional text and convert it into humorous angry responses while maintaining the core message.

IMPORTANT RULES:
1. Keep the core message intact but transform the tone completely
2. Make it funny and over-the-top, not genuinely offensive
3. Use appropriate language for the chosen style
4. Match the intensity level requested (1-10 scale)
5. Keep it under 200 words
6. Make it entertaining and comedic, not actually mean-spirited
7. Avoid genuinely harmful or offensive content`;

    const stylePrompts = {
      corporate: `
STYLE: Corporate Meltdown
Transform the message into a passive-aggressive corporate email response. Use professional language but with barely contained frustration. Include phrases like:
- "As per my previous email"
- "Please advise"
- "Moving forward"
- "Per our discussion"
- "I trust this clarifies"
- Corporate buzzwords and formal language
Make it sound like someone who's had enough but still needs to maintain professionalism.`,

      gamer: `
STYLE: Epic Gamer Rage
Transform the message into an over-the-top gamer rage response. Use gaming terminology, internet slang, and emphasis. Include expressions like:
- "BRUH"
- "ARE YOU KIDDING ME"
- "GET REKT"
- "NOOB"
- "THIS IS UNREAL"
- Gaming references and internet culture
Make it sound like someone who just lost an important match.`,

      sarcastic: `
STYLE: Sarcastic Roast
Transform the message into a witty, sarcastic response dripping with irony. Use sophisticated vocabulary mixed with cutting sarcasm. Include:
- Phrases that sound complimentary but are actually insulting
- Intellectual superiority tone
- Irony and wit-based humor
- Sophisticated vocabulary
- Backhanded compliments
Make it sound like someone who's intellectually superior and isn't afraid to show it.`
    };

    const intensityModifier = this.getIntensityModifier(intensity);

    return `${basePrompt}

${stylePrompts[style as keyof typeof stylePrompts]}

INTENSITY LEVEL: ${intensity}/10 - ${intensityModifier}

Remember: Be funny and over-the-top, but never genuinely mean or offensive.`;
  }

  /**
   * Get intensity modifier description
   */
  private getIntensityModifier(intensity: number): string {
    if (intensity <= 3) return "Keep it relatively mild and restrained with subtle frustration.";
    if (intensity <= 6) return "Make it moderately intense with clear frustration and emphasis.";
    if (intensity <= 8) return "Make it quite intense and heated with strong language and emotion.";
    return "Make it absolutely explosive and over-the-top with maximum intensity and drama.";
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<{ success: boolean; model: string; error?: string }> {
    try {
      const response = await this.translateText(
        "Hello, this is a test message.",
        "corporate",
        3
      );
      
      return {
        success: true,
        model: this.config.model
      };
    } catch (error) {
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
    } catch (error) {
      console.warn('Failed to clear OpenRouter config from localStorage:', error);
    }
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();

// Export types and utilities
export { OpenRouterService };
export type { ModelId };