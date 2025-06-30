/**
 * OpenRouter AI Service
 * 
 * Provides real AI translation capabilities using OpenRouter's unified API.
 * Optimized for Mixtral-8x7b-instruct and other high-quality models.
 * Now includes multi-persona support for The Enforcer, Highland Howler, The Don, etc.
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
    if (lowerText.includes('service') || lowerText.includes('customer')) return 'service';
    if (lowerText.includes('manager') || lowerText.includes('speak')) return 'manager';
    if (lowerText.includes('wait') || lowerText.includes('time')) return 'waiting';
    if (lowerText.includes('computer') || lowerText.includes('tech')) return 'technology';
    if (lowerText.includes('traffic') || lowerText.includes('driving')) return 'driving';
    if (lowerText.includes('game') || lowerText.includes('lag') || lowerText.includes('team')) return 'gaming';
    
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
   * Generate ultra-concise rage translation with multi-persona support
   */
  async translateText(
    text: string, 
    style: 'enforcer' | 'highland-howler' | 'don' | 'cracked-controller' | 'karen' | 'corporate' | 'sarcastic', 
    intensity: number
  ): Promise<string> {
    if (!this.isReady()) {
      throw new Error('OpenRouter API key not configured. Please set up your API key from https://openrouter.ai/keys');
    }

    const context = this.extractContext(text);
    const systemPrompt = this.buildPersonaPrompt(style, intensity);
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
      
      console.log('🎭 Ultra-concise persona translation generated');
      return truncated + (truncated.endsWith('.') || truncated.endsWith('!') || truncated.endsWith('?') ? '' : '!');
    } catch (error) {
      console.error('❌ Translation failed:', error);
      throw error;
    }
  }

  /**
   * Build persona-specific prompts based on the multi-persona system
   */
  private buildPersonaPrompt(style: string, intensity: number): string {
    const rageLevel = this.getPersonaRageLevel(intensity);
    
    const personaPrompts = {
      'enforcer': `Create a brief Luther-style righteous fury response. ${rageLevel.enforcer}`,
      'highland-howler': `Create a short explosive Scottish Dad rant. ${rageLevel.highlandHowler}`,
      'don': `Create a brief NY Italian-American roastmaster response. ${rageLevel.don}`,
      'cracked-controller': `Create a short Gen-Z gamer meltdown. ${rageLevel.crackedController}`,
      'karen': `Create a brief suburban entitlement rage response. ${rageLevel.karen}`,
      'corporate': `Create a brief corporate rage response. ${rageLevel.corporate}`,
      'sarcastic': `Create a concise sarcastic response. ${rageLevel.sarcastic}`
    };

    const baseRules = `You create ultra-brief rage responses that sound like real angry people. MAXIMUM 2 sentences. NO repetition of input text.

${personaPrompts[style as keyof typeof personaPrompts]}

Rules:
- NEVER quote or repeat the original text
- Maximum 2 sentences, under 50 words
- Make it funny, not offensive
- Sound like authentic human anger at level ${intensity}/10`;

    // Add persona-specific rules
    if (style === 'enforcer') {
      return baseRules + `
- Use authentic urban slang and expressions
- Include tone cues: [righteous fury], [preacher voice], [explosive energy], [mic drop moment]
- Use expressions: "OH HELL NAH", "ARE YOU SERIOUS", "BOY IF YOU DON'T", "LISTEN HERE"
- End with verbal takedowns: "AND THAT'S ON PERIOD!", "CASE CLOSED!", "BOOM! MIC DROP!"
- Sound like a righteous preacher calling out nonsense`;
    }

    if (style === 'highland-howler') {
      return baseRules + `
- Use authentic Scottish dialect and expressions
- Include tone cues: [shouting in fits], [sputtering with rage], [throwing wrench], [chaotic pacing]
- Use Scottish expressions: "OCH", "BLOODY HELL", "WHAT IN THE NAME OF THE WEE MAN", "JESUS WEPT"
- Use insults: "ya numpty", "ya daft wee bampot", "ya absolute weapon", "ya muppet"
- Sound like an angry Scottish dad fixing servers with a wrench`;
    }

    if (style === 'don') {
      return baseRules + `
- Use authentic NY Italian-American dialect
- Include tone cues: [yelling in traffic], [streetwise threats], [gesticulating wildly], [Brooklyn fury]
- Use expressions: "AY, WHAT'S YA PROBLEM", "FUGGEDABOUTIT", "MADONNA MIA", "YOU GOTTA BE KIDDIN' ME"
- Use insults: "ya mook", "ya gavone", "ya stunad", "ya cafone"
- Sound like an angry New Yorker in traffic`;
    }

    if (style === 'cracked-controller') {
      return baseRules + `
- Use authentic Gen-Z gamer dialect and expressions
- Include tone cues: [screaming], [panicked], [cracked energy], [hyperventilating], [keyboard smashing]
- Use gamer slang: "NAH BRO", "BRUH MOMENT", "THAT'S CAP", "NO SHOT", "SKILL ISSUE"
- For rage levels 8-10, use censored profanity: **BLEEP**, **GATORADE**, **ADDERALL**
- End with rage-quit threats: "I'M UNINSTALLING THIS", "TOUCHING GRASS AFTER THIS"
- Sound like a cracked-out Twitch streamer mid-lag`;
    }

    if (style === 'karen') {
      return baseRules + `
- Use authentic suburban entitlement dialect
- Include tone cues: [fake-nice], [condescending], [screeching], [entitled], [nuclear Karen]
- Use expressions: "EXCUSE ME", "I WANT TO SPEAK TO YOUR MANAGER", "THIS IS UNACCEPTABLE"
- Escalate from polite to nuclear: "I'M CALLING CORPORATE", "MY HUSBAND IS A LAWYER"
- Sound like an entitled suburban mom having a meltdown`;
    }

    // Add profanity rules for high intensity levels
    if (intensity >= 8) {
      return baseRules + `
- Use profanity appropriately for high intensity levels (8-10)
- Keep it authentic but not gratuitously offensive`;
    }

    return baseRules;
  }

  /**
   * Get persona-specific rage level descriptions
   */
  private getPersonaRageLevel(intensity: number): {
    enforcer: string;
    highlandHowler: string;
    don: string;
    crackedController: string;
    karen: string;
    corporate: string;
    sarcastic: string;
  } {
    switch (intensity) {
      case 1:
        return {
          enforcer: "Mildly annoyed but righteous. Use 'Listen here' with building energy.",
          highlandHowler: "Slightly irritated Scottish dad. Use 'Och' with mild Glaswegian accent.",
          don: "Mildly annoyed NY Italian. Use 'Ay, listen here' with gentle Brooklyn accent.",
          crackedController: "Mildly frustrated gamer. Use 'bruh' with minimal energy.",
          karen: "Polite but entitled. Use '[fake-nice]' tone with 'Excuse me, but...'",
          corporate: "Slightly annoyed but professional. Use 'I wanted to follow up'.",
          sarcastic: "Gentle irony. Use 'how lovely' with subtle sarcasm."
        };
      
      case 5:
        return {
          enforcer: "Building righteous fury. Use 'OH HELL NAH' with preacher energy.",
          highlandHowler: "Properly angry Scottish dad. Use '[shouting]' and 'BLOODY HELL'.",
          don: "Properly angry NY Italian. Use '[yelling]' and 'WHAT THE HELL'.",
          crackedController: "Properly mad gamer. Use 'NAH BRO' with caps and energy.",
          karen: "Full Karen mode. Use '[screeching]' and threaten Facebook posts.",
          corporate: "Clearly angry. Use 'I NEED' with strategic caps.",
          sarcastic: "Biting sarcasm. Use 'OH how WONDERFUL' with caps for emphasis."
        };
      
      case 10:
        return {
          enforcer: "Nuclear righteous fury. Use '[verbal takedown]' and 'BOY IF YOU DON'T' with maximum energy and mic drop endings.",
          highlandHowler: "Absolutely mental Scottish rage. Use '[absolutely mental]' and 'WHAT IN THE NAME OF THE WEE MAN' with maximum profanity.",
          don: "Nuclear NY Italian fury. Use '[mob boss energy]' and 'FUGGEDABOUTIT!' with maximum Brooklyn rage.",
          crackedController: "Absolute nuclear gamer meltdown. Use '[hyperventilating]' and 'GATORADE AND ADDERALL' with maximum cracked energy.",
          karen: "Complete psychotic break. Use '[nuclear Karen]' and threaten FBI, use maximum censored profanity.",
          corporate: "Nuclear professional meltdown. Use strong profanity: 'fucking', 'bullshit', 'goddamn'.",
          sarcastic: "Pure nuclear destruction. Use strong profanity for maximum impact."
        };
      
      default:
        return this.getPersonaRageLevel(5);
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
        "enforcer",
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