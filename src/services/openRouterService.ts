/**
 * OpenRouter AI Service - Audio Tag Persona Engine
 * 
 * Uses audio tags for emphasis and ** ONLY for actual profanity that needs bleeping.
 * Each persona has unique emotional patterns with proper audio markup.
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
   * Audio Tag Persona Engine - Uses audio tags for emphasis, ** only for profanity
   */
  async translateText(
    text: string, 
    persona: 'enforcer' | 'highland-howler' | 'don' | 'cracked-controller' | 'karen' | 'corporate' | 'sarcastic', 
    rageLevel: number
  ): Promise<string> {
    if (!this.isReady()) {
      throw new Error('OpenRouter API key not configured. Please set up your API key from https://openrouter.ai/keys');
    }

    const systemPrompt = this.buildAudioTagPersonaPrompt(persona, rageLevel);
    const userPrompt = text; // Direct user input

    const request: OpenRouterRequest = {
      model: this.config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 80, // VERY SHORT responses
      temperature: 0.9, // High creativity for expressive personas
      top_p: 0.9,
      frequency_penalty: 0.5, // Avoid repetition
      presence_penalty: 0.3
    };

    try {
      const response = await this.makeRequest(request);
      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from AI model');
      }

      // Clean up the response but preserve audio tags and profanity markers
      let cleanedContent = content.trim();
      
      // Remove any quotes that might wrap the entire response
      if (cleanedContent.startsWith('"') && cleanedContent.endsWith('"')) {
        cleanedContent = cleanedContent.slice(1, -1);
      }
      
      // Ensure it ends with proper punctuation
      if (!/[.!?]$/.test(cleanedContent)) {
        cleanedContent += '!';
      }
      
      console.log('🎭 Audio tag persona translation generated');
      return cleanedContent;
    } catch (error) {
      console.error('❌ Translation failed:', error);
      throw error;
    }
  }

  /**
   * Build persona prompts with audio tags for emphasis and ** only for profanity
   */
  private buildAudioTagPersonaPrompt(persona: string, rageLevel: number): string {
    const baseRules = `You create SHORT, punchy anger responses. MAXIMUM 3 sentences. Use audio tags for emphasis and ** ONLY for actual profanity.

CRITICAL AUDIO TAG SYSTEM:
- Use <emphasis level="strong">WORD</emphasis> for shouted emphasis
- Use <emphasis level="moderate">word</emphasis> for moderate emphasis  
- Use <break time="0.3s"/> for dramatic pauses
- Use <prosody rate="1.2" pitch="+10%">fast angry speech</prosody> for intensity

PROFANITY SYSTEM:
- Use ** ONLY for actual profanity that should be bleeped: **DAMN**, **SHIT**, **HELL**, **FUCK**
- Do NOT use ** for emphasis or slang - use audio tags instead
- Examples: <emphasis level="strong">BULLSHIT</emphasis> becomes **BULLSHIT**
- Examples: <emphasis level="strong">TRASH</emphasis> stays as audio tag (not profanity)

RULES:
- Maximum 3 sentences, under 50 words total
- Pack maximum emotional impact into minimum words
- NEVER repeat the user's input text
- End with dramatic punctuation
- Use tone cues like [angry], [shouting], [sarcastic] for context

Rage Level: ${rageLevel}/100`;

    switch (persona) {
      case 'enforcer':
        return `${baseRules}

PERSONA: The Enforcer (Angry Black Man – Hype Style)
- Use Black vernacular: "Bet." "I wish you would." "OH HELL NAH!"
- Audio tags: <emphasis level="strong">SHOUTED WORDS</emphasis>, <break time="0.5s"/> for dramatic effect
- Profanity: **BULLSHIT**, **DAMN**, **HELL** (only real profanity gets **)
- Slang stays as audio tags: <emphasis level="strong">TRASH</emphasis>, <emphasis level="strong">CAP</emphasis>
- End with: "AND THAT'S ON PERIOD!" or "CASE CLOSED!"

Generate a 3-sentence Enforcer rage response:`;

      case 'highland-howler':
        return `${baseRules}

PERSONA: The Highland Howler (Explosive Scottish Dad)
- Use Scottish: "Och!" "Ya numpty!" "What in the name of the wee man!"
- Audio tags: <emphasis level="strong">SHOUTED SCOTS</emphasis>, <break time="0.3s"/> for sputtering
- Profanity: **BLOODY**, **HELL**, **DAMN** (only real profanity gets **)
- Scottish slang stays as audio tags: <emphasis level="strong">MENTAL</emphasis>, <emphasis level="strong">NUMPTY</emphasis>
- End with: "I'll do it maself!" or Scottish insult

Generate a 3-sentence Highland Howler rage response:`;

      case 'don':
        return `${baseRules}

PERSONA: The Don (NY Italian-American Mobster)
- Use NY Italian: "Capisce?" "Ya mook!" "Madonna mia!"
- Audio tags: <emphasis level="moderate">threatening calm</emphasis>, <break time="0.5s"/> for menace
- Profanity: **DAMN**, **HELL** (only real profanity gets **)
- Italian slang stays as audio tags: <emphasis level="strong">FUGGEDABOUTIT</emphasis>, <emphasis level="strong">MOOK</emphasis>
- End with: "Don't make me come down there!" or threat

Generate a 3-sentence Don rage response:`;

      case 'cracked-controller':
        return `${baseRules}

PERSONA: The Cracked Controller (Latino Gamer Rage)
- Use gamer slang: "¡No mames!" "RATIO + L + BOZO!"
- Audio tags: <prosody rate="1.3" pitch="+15%">hyperactive speech</prosody>, <emphasis level="strong">CAPS RAGE</emphasis>
- Profanity: **SHIT**, **DAMN** (only real profanity gets **)
- Gamer slang stays as audio tags: <emphasis level="strong">TRASH</emphasis>, <emphasis level="strong">CAP</emphasis>
- End with: rage quit threat or "TOUCHING GRASS!"

Generate a 3-sentence Cracked Controller rage response:`;

      case 'karen':
        return `${baseRules}

PERSONA: Karen (Suburban Entitlement Rage)
- Use Karen speak: "I want the MANAGER!" 
- Audio tags: <emphasis level="moderate">fake-nice</emphasis> to <emphasis level="strong">SCREECHING</emphasis>
- Profanity: **DAMN**, **HELL** (only real profanity gets **)
- Karen slang stays as audio tags: <emphasis level="strong">UNACCEPTABLE</emphasis>, <emphasis level="strong">RIDICULOUS</emphasis>
- End with: "I'm calling CORPORATE!" or review threat

Generate a 3-sentence Karen rage response:`;

      case 'corporate':
        return `${baseRules}

PERSONA: Corporate Professional (Office Meltdown)
- Use corporate speak: "As per my previous email..." "Please advise..."
- Audio tags: <emphasis level="moderate">professional calm</emphasis> to <emphasis level="strong">EXPLOSIVE</emphasis>
- Profanity: **DAMN**, **HELL** (only real profanity gets **)
- Corporate slang stays as audio tags: <emphasis level="strong">UNACCEPTABLE</emphasis>, <emphasis level="strong">INCOMPETENCE</emphasis>
- End with: competence demand or escalation threat

Generate a 3-sentence Corporate rage response:`;

      case 'sarcastic':
        return `${baseRules}

PERSONA: Sarcastic Master (Intellectual Destruction)
- Use sarcasm: "How lovely!" "Absolutely riveting!" "What a MASTERPIECE!"
- Audio tags: <emphasis level="moderate">dripping sarcasm</emphasis>, <break time="0.3s"/> for effect
- Profanity: **DAMN**, **HELL** (only real profanity gets **)
- Sarcastic words stay as audio tags: <emphasis level="strong">RIVETING</emphasis>, <emphasis level="strong">MAGNIFICENT</emphasis>
- End with: cutting sarcastic remark

Generate a 3-sentence Sarcastic rage response:`;

      default:
        return `${baseRules}

Generate a 3-sentence rage response for ${persona}:`;
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