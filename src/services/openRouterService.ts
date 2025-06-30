/**
 * OpenRouter AI Service - DeepSeek v3 Dynamic Translation Engine
 * 
 * Uses DeepSeek v3 for dynamic, varied responses that transform user input
 * while maintaining the original message's meaning and context.
 * Now optimized for ElevenLabs v3 audio tag system.
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

// Default configuration optimized for DeepSeek v3
const DEFAULT_CONFIG: OpenRouterConfig = {
  apiKey: '', // Will be set from environment or user input
  model: 'deepseek/deepseek-chat-v3-0324:free', // DeepSeek v3 free model
  baseUrl: 'https://openrouter.ai/api/v1'
};

// Available models with DeepSeek v3 featured prominently
export const AVAILABLE_MODELS = {
  'deepseek/deepseek-chat-v3-0324:free': {
    name: 'DeepSeek Chat v3 (Free)',
    description: 'High-quality reasoning model with excellent instruction following',
    maxTokens: 8192,
    costPer1kTokens: 0,
    recommended: true,
    strengths: ['Creative writing', 'Instruction following', 'Dynamic responses', 'Free usage']
  },
  'mistralai/mixtral-8x7b-instruct': {
    name: 'Mixtral 8x7B Instruct',
    description: 'High-quality instruction-following model with excellent reasoning',
    maxTokens: 32768,
    costPer1kTokens: 0.00024,
    recommended: false,
    strengths: ['Creative writing', 'Instruction following', 'Humor generation']
  },
  'anthropic/claude-3-haiku': {
    name: 'Claude 3 Haiku',
    description: 'Fast, intelligent, and cost-effective',
    maxTokens: 4096,
    costPer1kTokens: 0.00025,
    recommended: false,
    strengths: ['Speed', 'Cost efficiency', 'General tasks']
  },
  'openai/gpt-4o-mini': {
    name: 'GPT-4o Mini',
    description: 'OpenAI\'s efficient model',
    maxTokens: 4096,
    costPer1kTokens: 0.00015,
    recommended: false,
    strengths: ['Cost efficiency', 'General tasks', 'Speed']
  },
  'meta-llama/llama-3.1-8b-instruct:free': {
    name: 'Llama 3.1 8B (Free)',
    description: 'Free open-source model',
    maxTokens: 2048,
    costPer1kTokens: 0,
    recommended: false,
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
  configure(apiKey: string, model: ModelId = 'deepseek/deepseek-chat-v3-0324:free'): void {
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
    return AVAILABLE_MODELS[this.config.model as ModelId] || AVAILABLE_MODELS['deepseek/deepseek-chat-v3-0324:free'];
  }

  /**
   * Get all available models
   */
  getAvailableModels(): typeof AVAILABLE_MODELS {
    return AVAILABLE_MODELS;
  }

  /**
   * Parse and enhance OpenRouter error messages for better user experience
   */
  private parseOpenRouterError(errorData: any, status: number): string {
    const errorMessage = errorData?.error?.message || 'Unknown error';
    
    // Handle specific OpenRouter error cases
    if (errorMessage.includes('No endpoints found matching your data policy')) {
      return 'OpenRouter Privacy Settings Issue: Please visit https://openrouter.ai/settings/privacy and enable "Allow training on prompts and generations" to use AI translation. This setting is required for the service to work properly.';
    }
    
    if (errorMessage.includes('Invalid API key') || status === 401) {
      return 'Invalid OpenRouter API key. Please check your API key at https://openrouter.ai/keys and update your configuration.';
    }
    
    if (errorMessage.includes('Rate limit exceeded') || status === 429) {
      return 'OpenRouter rate limit exceeded. Please wait a moment before trying again.';
    }
    
    if (errorMessage.includes('Insufficient credits') || errorMessage.includes('balance')) {
      return 'Insufficient OpenRouter credits. Please add credits to your account at https://openrouter.ai/credits';
    }
    
    if (errorMessage.includes('Model not found') || errorMessage.includes('model')) {
      return `Model "${this.config.model}" is not available. Please try a different model or check OpenRouter's available models.`;
    }
    
    // Return enhanced error message with context
    return `OpenRouter API Error: ${errorMessage}. Please check your OpenRouter account settings and configuration.`;
  }

  /**
   * Make a request to OpenRouter API with enhanced error handling
   */
  private async makeRequest(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    if (!this.isReady()) {
      throw new Error('OpenRouter service not configured. Please provide a valid API key from https://openrouter.ai/keys');
    }

    const appName = import.meta.env.VITE_OPENROUTER_APP_NAME || 'Anger Translator';

    console.log(`🚀 Making request to OpenRouter with ${this.config.model}`);

    try {
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
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: { message: `HTTP ${response.status}: ${response.statusText}` } };
        }
        
        console.error('❌ OpenRouter API error:', errorData);
        
        // Use enhanced error parsing
        const enhancedError = this.parseOpenRouterError(errorData, response.status);
        throw new Error(enhancedError);
      }

      const result = await response.json();
      console.log('✅ OpenRouter request successful');
      console.log(`📊 Tokens used: ${result.usage?.total_tokens || 'unknown'}`);
      
      return result;
    } catch (error) {
      // If it's already our enhanced error, re-throw it
      if (error instanceof Error && error.message.includes('OpenRouter Privacy Settings Issue')) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to OpenRouter. Please check your internet connection.');
      }
      
      // Re-throw other errors as-is
      throw error;
    }
  }

  /**
   * Dynamic Translation Engine - Optimized for ElevenLabs v3 Audio Tags
   * Creates SHORT, punchy responses with proper audio formatting
   */
  async translateText(
    text: string, 
    persona: 'enforcer' | 'highland-howler' | 'don' | 'cracked-controller' | 'karen' | 'corporate' | 'sarcastic', 
    rageLevel: number
  ): Promise<string> {
    if (!this.isReady()) {
      throw new Error('OpenRouter API key not configured. Please set up your API key from https://openrouter.ai/keys');
    }

    // Build dynamic prompt optimized for ElevenLabs v3
    const prompt = this.buildElevenLabsV3Prompt(text, persona, rageLevel);

    const request: OpenRouterRequest = {
      model: this.config.model,
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 100, // Shorter responses for punchy delivery
      temperature: 0.9, // High creativity for varied responses
      top_p: 0.9,
      frequency_penalty: 0.6, // Avoid repetition
      presence_penalty: 0.4
    };

    try {
      const response = await this.makeRequest(request);
      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from AI model');
      }

      // Clean up any markdown formatting
      let output = content.trim();
      
      // Remove leading/trailing markdown bold markers
      output = output.replace(/^\*\*/, '').replace(/\*\*$/, '');
      
      // Remove any remaining markdown bold that wraps the entire response
      if (output.startsWith('**') && output.endsWith('**')) {
        output = output.slice(2, -2);
      }
      
      output = output.trim();
      
      console.log('🎭 ElevenLabs v3 optimized response generated');
      console.log('🎤 Audio tags formatted for natural TTS delivery');
      
      return output;
    } catch (error) {
      console.error('❌ Translation failed:', error);
      throw error;
    }
  }

  /**
   * Build ElevenLabs v3 optimized prompts with proper audio tag formatting
   */
  private buildElevenLabsV3Prompt(text: string, persona: string, rageLevel: number): string {
    const baseRules = `You create SHORT, punchy anger responses. MAXIMUM 3 sentences. Use ONLY ElevenLabs v3 audio tags.

ELEVENLABS V3 AUDIO TAG SYSTEM (ONLY use these approved formats):
[Square bracket tags]: [laughs], [whispers], [pause], [rushed], [drawn out], [sarcastic], [angry], [shouting], [sighs], [gulps], [nervous], [hesitant]
*Single asterisk emphasis*: *WORD* (for stressed/emphasized words)
**Double asterisk profanity**: **DAMN**, **SHIT**, **HELL**, **FUCK** (only for actual profanity)

CHAINING TAGS: You can combine tags like [whispering][pause] or [angry][shouting]

CRITICAL RULES:
- NEVER use parenthetical stage directions like (Deep inhale) or (sudden pitch rise)
- NEVER use XML tags like <emphasis level="strong">
- Use [pause] for dramatic pauses, not <break>
- Use *word* for emphasis, not <emphasis>
- Use ** ONLY for actual profanity that needs bleeping

DELIVERY CONTROL EXAMPLES:
- [drawn out] Sooooo... you're saying... [suspicious tone] 
- [rushed] Hide! Now!
- [whispering][pause] Did you hear that?
- [laughs] That's just *perfect*!

FORBIDDEN:
- (parenthetical directions)
- <XML tags>
- Any non-ElevenLabs v3 formats

RULES:
- Maximum 3 sentences, under 50 words total
- Pack maximum emotional impact into minimum words
- NEVER repeat the user's input text
- End with dramatic punctuation

Rage Level: ${rageLevel}/100`;

    // Add persona-specific instructions
    switch (persona) {
      case 'enforcer':
        return `${baseRules}

ENFORCER STYLE (Righteous Fury):
- Use: [angry], [shouting], [pause], [drawn out]
- Black vernacular: "OH HELL NAH!", "I wish you would", "Bet", "And that's on PERIOD!"
- Righteous indignation and moral authority
- End with authority: "CASE CLOSED!" or "AND THAT'S FINAL!"

Transform: "${text}"

Response:`;

      case 'highland-howler':
        return `${baseRules}

HIGHLAND HOWLER STYLE (Explosive Scottish):
- Use: [shouting], [sputtering], [angry], [pause]
- Scottish expressions: "Och!", "Ya numpty!", "What in the name of the wee man!"
- Explosive, sputtering anger
- Scottish insults: "bampot", "weapon", "daft"

Transform: "${text}"

Response:`;

      case 'don':
        return `${baseRules}

THE DON STYLE (NY Italian-American):
- Use: [threatening], [calm], [angry], [pause]
- NY Italian: "Capisce?", "Ya mook!", "Madonna mia!", "Fuggedaboutit!"
- Threatening calm that builds to explosion
- End with veiled threats

Transform: "${text}"

Response:`;

      case 'cracked-controller':
        return `${baseRules}

CRACKED CONTROLLER STYLE (Gen-Z Gamer):
- Use: [panicked], [rushed], [shouting], [nervous]
- Gamer/Gen-Z slang: "¡No mames!", "RATIO + L + BOZO!", "This is straight trash!"
- Hyperactive, panicked energy
- Gaming references: "uninstall", "rage quit"

Transform: "${text}"

Response:`;

      case 'karen':
        return `${baseRules}

KAREN STYLE (Suburban Entitlement):
- Use: [fake sweet], [shouting], [demanding], [pause]
- Start fake-nice then escalate
- "I'm a paying customer!", "This is unacceptable!"
- Threaten managers and reviews

Transform: "${text}"

Response:`;

      case 'corporate':
        return `${baseRules}

CORPORATE STYLE (Professional Meltdown):
- Use: [passive aggressive], [building anger], [professional], [pause]
- Corporate buzzwords: "As per my previous email", "Please advise"
- Passive-aggressive building to fury
- Maintain professional tone while raging

Transform: "${text}"

Response:`;

      case 'sarcastic':
        return `${baseRules}

SARCASTIC STYLE (Intellectual Destruction):
- Use: [sarcastic], [mocking], [fake enthusiasm], [pause]
- Dripping sarcasm: "How lovely!", "Absolutely riveting!"
- Intellectual superiority with cutting wit
- Mock with fake enthusiasm

Transform: "${text}"

Response:`;

      default:
        return `${baseRules}

Transform: "${text}"

Response:`;
    }
  }

  /**
   * Test the API connection with a simple request
   */
  async testConnection(): Promise<{ success: boolean; model: string; error?: string }> {
    try {
      console.log('🧪 Testing OpenRouter connection with ElevenLabs v3 format...');
      const response = await this.translateText(
        "Hello, this is a test message.",
        "enforcer",
        30
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
      best: 'deepseek/deepseek-chat-v3-0324:free', // DeepSeek v3 - excellent and free
      fastest: 'anthropic/claude-3-haiku',
      cheapest: 'deepseek/deepseek-chat-v3-0324:free', // Free model
      free: 'deepseek/deepseek-chat-v3-0324:free'
    };
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();

// Export types and utilities
export { OpenRouterService };
export type { ModelId };