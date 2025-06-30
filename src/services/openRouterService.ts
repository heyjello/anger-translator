/**
 * OpenRouter AI Service - Expressive Persona Engine
 * 
 * Implements the Anger Translator persona system with proper tone cues,
 * emotional escalation, and character-driven responses.
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
   * Expressive Persona Engine - Main Translation Function
   * Implements the full persona system with proper emotional escalation
   */
  async translateText(
    text: string, 
    persona: 'enforcer' | 'highland-howler' | 'don' | 'cracked-controller' | 'karen' | 'corporate' | 'sarcastic', 
    rageLevel: number
  ): Promise<string> {
    if (!this.isReady()) {
      throw new Error('OpenRouter API key not configured. Please set up your API key from https://openrouter.ai/keys');
    }

    const systemPrompt = this.buildExpressivePersonaPrompt(persona, rageLevel);
    const userPrompt = text; // Direct user input as specified in your prompt

    const request: OpenRouterRequest = {
      model: this.config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 200, // Increased for proper 100-200 word responses
      temperature: 0.9, // High creativity for expressive personas
      top_p: 0.95,
      frequency_penalty: 0.3,
      presence_penalty: 0.2
    };

    try {
      const response = await this.makeRequest(request);
      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from AI model');
      }

      // Clean up the response but preserve tone cues for TTS
      let cleanedContent = content.trim();
      
      // Remove any quotes that might wrap the entire response
      if (cleanedContent.startsWith('"') && cleanedContent.endsWith('"')) {
        cleanedContent = cleanedContent.slice(1, -1);
      }
      
      console.log('🎭 Expressive persona translation generated');
      return cleanedContent;
    } catch (error) {
      console.error('❌ Translation failed:', error);
      throw error;
    }
  }

  /**
   * Build the complete Expressive Persona Engine prompt
   */
  private buildExpressivePersonaPrompt(persona: string, rageLevel: number): string {
    const emotionalProgression = this.getEmotionalProgression(rageLevel);
    const personaRules = this.getPersonaRules(persona);
    
    return `# Anger Translator – Expressive Persona Engine

## 🛠️ TASK OVERVIEW:
Convert a calm sentence into an animated, emotionally volatile rant delivered by ${persona}.
The final text must feel reactive, character-driven, and escalate emotionally based on rage level ${rageLevel}.

This output will be sent to a TTS system that supports **hidden tone cues**. These are formatting instructions like [angry], [mocking], [sighing], etc., which guide speech synthesis but must not appear in spoken output.

## 🎭 GENERAL OUTPUT RULES:
- Wrap delivery cues like [angry], [sarcastic], [laughing], [threatening calm], etc. at the start of sentences, emotional shifts, or outbursts
- Use dialect, slang, and character-specific language patterns
- Use **bold** emphasis on words that should be shouted or emotionally stressed
- Always escalate: start mildly annoyed → end in full rage, mockery, or dramatic conclusion
- Limit to 100–200 words
- ${emotionalProgression}

${personaRules}

## 🧪 OUTPUT FORMAT:
- Inject appropriate cues into the dialogue
- Do NOT explain or include metadata
- Do NOT display the cue text — they are for delivery only
- Keep everything in-character
- Output 100–200 words total

Transform the user's input into a ${persona} rage response at intensity level ${rageLevel}.`;
  }

  /**
   * Get emotional progression based on rage level
   */
  private getEmotionalProgression(rageLevel: number): string {
    if (rageLevel <= 30) {
      return "EMOTIONAL PROGRESSION: [disappointed] → [frustrated] → [sarcastic]";
    } else if (rageLevel <= 60) {
      return "EMOTIONAL PROGRESSION: [annoyed] → [angry] → [mocking] → [laughing]";
    } else {
      return "EMOTIONAL PROGRESSION: [threatening calm] → [explosive] → [shouting] → [sputtering] → [exhales sharply] → [laughing] or [mic drop]";
    }
  }

  /**
   * Get persona-specific rules and characteristics
   */
  private getPersonaRules(persona: string): string {
    switch (persona) {
      case 'enforcer':
        return `## 🔥 The Enforcer (Angry Black Man – Hype Style)
- Use Black vernacular, preacher-fire cadence, high-volume bursts
- Favorite phrases: "Bet." "I *wish* you would." "This some bulls**t."
- Cues: [shouting], [mocking], [side-eye], [preacher-fire], [laughing]
- End with verbal takedowns like "AND THAT'S ON PERIOD!" or "CASE CLOSED!"`;

      case 'highland-howler':
        return `## 🧨 The Highland Howler (Explosive Scottish Dad)
- Glaswegian accent, chaos energy, uses: "nae," "yer," "bloody," "wee"
- Cues: [sputtering], [shouting], [mock disbelief], [exhales sharply], [boiling]
- End with a threat like "I'll do it maself," or walkout
- Use insults: "ya numpty," "ya daft wee bampot," "ya absolute weapon"`;

      case 'don':
        return `## 🍝 The Don (NY Italian-American Mobster)
- Loud Brooklyn guy, roast-heavy, "fuggedaboutit" energy
- Phrases: "I swear to God," "Who wrote this, your nonna?" "Capisce?"
- Cues: [yelling], [mocking], [furious calm], [offended], [laughing]
- End with: "Don't make me come down there."
- Use insults: "ya mook," "ya gavone," "ya stunad"`;

      case 'cracked-controller':
        return `## 🎮 The Cracked Controller (Latino Gamer Rage)
- Gen-Z Spanglish gamer, panic tone, meme-speak
- Phrases: "Brooooo," "¡No mames!", "Delete the game." "That's cap!"
- Cues: [screaming], [panicked], [mock disbelief], [laughing]
- End with: rage quit threat or yelling off-mic at mom
- Use: "NAH BRO," "SKILL ISSUE," "RATIO + L + BOZO"`;

      case 'karen':
        return `## 👩‍🦱 Karen (Suburban Entitlement Rage)
- Mid-40s white woman, calm → aggressive → legalistic
- Phrases: "This is unacceptable." "I need to speak to your manager."
- Cues: [fake-nice], [annoyed], [condescending], [screeching], [dead calm]
- End with: threat of escalation or "I *will* be leaving a review."
- Escalate to: "I'm calling corporate!" "My husband is a lawyer!"`;

      case 'corporate':
        return `## 💼 Corporate Professional (Office Meltdown)
- Professional passive-aggressive responses with building fury
- Phrases: "As per my previous email..." "Please advise..." "Moving forward..."
- Cues: [professional calm], [building frustration], [barely contained]
- Use corporate buzzwords while expressing rage professionally`;

      case 'sarcastic':
        return `## 😏 Sarcastic Master (Intellectual Destruction)
- Witty, intellectually superior responses with cutting sarcasm
- Phrases that sound complimentary but are actually insulting
- Cues: [dripping sarcasm], [mock enthusiasm], [intellectual superiority]
- Use sophisticated vocabulary with devastating irony`;

      default:
        return `## 🎭 Generic Persona
- Transform input into character-driven rage response
- Use appropriate tone cues and emotional escalation
- Maintain character consistency throughout`;
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