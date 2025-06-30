/**
 * OpenRouter AI Service
 * 
 * Provides real AI translation capabilities using OpenRouter's unified API.
 * Optimized for Mixtral-8x7b-instruct and other high-quality models.
 * Now includes multi-persona support with proper user input incorporation.
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
   * Generate rage translation that incorporates the user's actual input
   */
  async translateText(
    text: string, 
    style: 'enforcer' | 'highland-howler' | 'don' | 'cracked-controller' | 'karen' | 'corporate' | 'sarcastic', 
    intensity: number
  ): Promise<string> {
    if (!this.isReady()) {
      throw new Error('OpenRouter API key not configured. Please set up your API key from https://openrouter.ai/keys');
    }

    const systemPrompt = this.buildPersonaPrompt(style, intensity);
    const userPrompt = `Transform this polite message into a ${style} rage response: "${text}"`;

    // Ultra-restrictive parameters for minimal output
    const request: OpenRouterRequest = {
      model: this.config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 100, // Slightly increased to allow for proper transformation
      temperature: 0.8, // Increased for more creative rage
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.2
    };

    try {
      const response = await this.makeRequest(request);
      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from AI model');
      }

      // Clean up the response but keep it natural
      let cleanedContent = content.trim();
      
      // Remove any quotes that might wrap the entire response
      if (cleanedContent.startsWith('"') && cleanedContent.endsWith('"')) {
        cleanedContent = cleanedContent.slice(1, -1);
      }
      
      console.log('🎭 Persona rage translation generated');
      return cleanedContent;
    } catch (error) {
      console.error('❌ Translation failed:', error);
      throw error;
    }
  }

  /**
   * Build persona-specific prompts that ensure user input incorporation
   */
  private buildPersonaPrompt(style: string, intensity: number): string {
    const rageLevel = this.getPersonaRageLevel(intensity);
    
    const personaPrompts = {
      'enforcer': `You are The Enforcer - a righteous fury translator with Luther-style energy. ${rageLevel.enforcer}`,
      'highland-howler': `You are The Highland Howler - an explosive Scottish Dad with server room fury. ${rageLevel.highlandHowler}`,
      'don': `You are The Don - a NY Italian-American roastmaster with Brooklyn energy. ${rageLevel.don}`,
      'cracked-controller': `You are The Cracked Controller - a Gen-Z gamer in full meltdown mode. ${rageLevel.crackedController}`,
      'karen': `You are Karen - a suburban mom with nuclear entitlement rage. ${rageLevel.karen}`,
      'corporate': `You are a corporate professional having a meltdown. ${rageLevel.corporate}`,
      'sarcastic': `You are a master of sarcastic destruction. ${rageLevel.sarcastic}`
    };

    const baseRules = `Transform the user's polite message into an angry ${style} response. 

${personaPrompts[style as keyof typeof personaPrompts]}

CRITICAL RULES:
- Transform the EXACT message the user provides
- Keep the core meaning but make it angry
- Maximum 2-3 sentences
- Use the user's context (what they're actually talking about)
- Make it funny, not offensive
- Sound like authentic human anger at level ${intensity}/10
- NEVER ignore what the user actually said`;

    // Add persona-specific rules
    if (style === 'enforcer') {
      return baseRules + `
- Use authentic urban expressions: "OH HELL NAH", "ARE YOU SERIOUS", "BOY IF YOU DON'T"
- Include tone cues: [righteous fury], [preacher voice], [explosive energy]
- End with verbal takedowns: "AND THAT'S ON PERIOD!", "CASE CLOSED!"
- Sound like a righteous preacher calling out nonsense
- Transform their request into righteous indignation`;
    }

    if (style === 'highland-howler') {
      return baseRules + `
- Use Scottish dialect: "OCH", "BLOODY HELL", "WHAT IN THE NAME OF THE WEE MAN"
- Include tone cues: [shouting in fits], [sputtering with rage], [throwing wrench]
- Use insults: "ya numpty", "ya daft wee bampot", "ya absolute weapon"
- Sound like an angry Scottish dad fixing servers with a wrench
- Transform their request into Scottish fury`;
    }

    if (style === 'don') {
      return baseRules + `
- Use NY Italian dialect: "AY, WHAT'S YA PROBLEM", "FUGGEDABOUTIT", "MADONNA MIA"
- Include tone cues: [yelling in traffic], [gesticulating wildly], [Brooklyn fury]
- Use insults: "ya mook", "ya gavone", "ya stunad"
- Sound like an angry New Yorker in traffic
- Transform their request into Brooklyn rage`;
    }

    if (style === 'cracked-controller') {
      return baseRules + `
- Use Gen-Z gamer slang: "NAH BRO", "BRUH MOMENT", "THAT'S CAP", "NO SHOT"
- Include tone cues: [screaming], [panicked], [cracked energy], [keyboard smashing]
- For high rage: use **BLEEP**, **GATORADE**, **ADDERALL**
- End with rage-quit threats: "I'M UNINSTALLING THIS", "TOUCHING GRASS"
- Transform their request into cracked gamer fury`;
    }

    if (style === 'karen') {
      return baseRules + `
- Use entitled expressions: "EXCUSE ME", "I WANT TO SPEAK TO YOUR MANAGER"
- Include tone cues: [fake-nice], [condescending], [screeching], [nuclear Karen]
- Escalate: "I'M CALLING CORPORATE", "MY HUSBAND IS A LAWYER"
- Transform their request into entitled suburban rage`;
    }

    if (style === 'corporate') {
      return baseRules + `
- Use professional passive-aggressive language
- Include phrases: "AS PER MY PREVIOUS EMAIL", "PLEASE ADVISE"
- For high intensity: use professional profanity appropriately
- Transform their request into corporate fury`;
    }

    if (style === 'sarcastic') {
      return baseRules + `
- Use cutting sarcasm: "OH how WONDERFUL", "absolutely RIVETING"
- Include witty, intellectually superior responses
- For high intensity: use sarcastic profanity appropriately
- Transform their request into sarcastic destruction`;
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
          enforcer: "Mildly annoyed but building righteous energy. Use 'Listen here' with growing conviction.",
          highlandHowler: "Slightly irritated Scottish dad. Use 'Och' with mild Glaswegian frustration.",
          don: "Mildly annoyed NY Italian. Use 'Ay, listen here' with gentle Brooklyn attitude.",
          crackedController: "Mildly frustrated gamer. Use 'bruh' with minimal cracked energy.",
          karen: "Polite but entitled. Use fake-nice tone with 'Excuse me, but...'",
          corporate: "Slightly annoyed but professional. Use 'I wanted to follow up' tone.",
          sarcastic: "Gentle irony. Use 'how lovely' with subtle sarcasm."
        };
      
      case 2:
        return {
          enforcer: "Getting annoyed with building energy. Use 'OH HELL NAH' with moderate conviction.",
          highlandHowler: "Getting irritated. Use 'For crying out loud' with Scottish accent building.",
          don: "Getting heated. Use 'What's ya problem?' with NY attitude growing.",
          crackedController: "Getting annoyed. Use 'nah bro' with some cracked energy.",
          karen: "Slightly condescending. Use passive-aggressive tone and mention standards.",
          corporate: "Politely irritated. Use 'As mentioned' with slight professional edge.",
          sarcastic: "Light mockery. Use 'wonderful' with obvious sarcasm."
        };
      
      case 3:
        return {
          enforcer: "Clearly frustrated with righteous building. Use preacher-style emphasis.",
          highlandHowler: "Clearly annoyed. Use 'Bloody hell' with Scottish exasperation growing.",
          don: "Clearly annoyed. Use 'You gotta be kiddin' me' with Brooklyn frustration.",
          crackedController: "Visibly annoyed. Use 'bruh moment' with moderate gamer energy.",
          karen: "Getting snippy. Use condescending tone and mention knowing the owner.",
          corporate: "Clearly frustrated. Use 'As I stated previously' with firm professional tone.",
          sarcastic: "Clear disdain. Use 'how delightful' with bite."
        };
      
      case 4:
        return {
          enforcer: "Losing patience with righteous fury building. Use 'ARE YOU SERIOUS' with conviction.",
          highlandHowler: "Getting heated. Use 'What in the name of...' with growing Scottish anger.",
          don: "Getting heated. Use 'Are you outta ya mind?' with growing NY anger.",
          crackedController: "Getting heated. Use 'no shot' with rising gamer energy and some caps.",
          karen: "Demanding mode. Use entitled tone and threaten to call corporate.",
          corporate: "Losing patience. Use 'This is the third time' with urgency.",
          sarcastic: "Sharp wit. Use 'how absolutely precious' with cutting tone."
        };
      
      case 5:
        return {
          enforcer: "Properly angry with righteous fury. Use 'BOY IF YOU DON'T' with preacher energy.",
          highlandHowler: "Properly angry. Use 'BLOODY HELL' with authentic Scottish fury.",
          don: "Properly angry. Use 'WHAT THE HELL' with authentic NY fury.",
          crackedController: "Properly mad. Use 'NAH BRO' with caps and building cracked energy.",
          karen: "Full Karen mode. Use screeching tone and threaten Facebook posts.",
          corporate: "Clearly angry. Use 'I NEED' with strategic caps.",
          sarcastic: "Biting sarcasm. Use 'OH how WONDERFUL' with caps for emphasis."
        };
      
      case 6:
        return {
          enforcer: "Very frustrated with explosive righteous energy. Use rhythmic preacher emphasis.",
          highlandHowler: "Really angry. Use 'JESUS WEPT' with escalating Scottish rage.",
          don: "Really angry. Use 'MADONNA MIA!' with escalating NY rage.",
          crackedController: "Really angry. Use 'SKILL ISSUE FR FR' with multiple caps and energy.",
          karen: "Nuclear Karen building. Use threatening tone and mention husband's importance.",
          corporate: "Very frustrated. Use 'THIS IS RIDICULOUS' with caps and exclamation.",
          sarcastic: "Scathing mockery. Use 'OH MAGNIFICENT' with heavy sarcasm."
        };
      
      case 7:
        return {
          enforcer: "Seriously pissed with explosive righteous fury. Use 'WHAT IN THE ENTIRE' with maximum conviction.",
          highlandHowler: "Seriously pissed. Use 'WHAT IN THE NAME OF THE WEE MAN' with intense Scottish profanity.",
          don: "Seriously pissed. Use 'YOU'RE BREAKIN' MY BALLS' with intense NY profanity.",
          crackedController: "Seriously pissed. Use 'WHAT THE **BLEEP**' with cracked energy.",
          karen: "Completely unhinged. Use nuclear tone and threaten police/news.",
          corporate: "Extremely angry. Use 'I AM DONE' with multiple caps.",
          sarcastic: "Savage wit. Use 'OH how absolutely SPECTACULAR' with venom."
        };
      
      case 8:
        return {
          enforcer: "Furious with nuclear righteous energy. Use 'I'M BOUT TO LOSE IT' with maximum preacher fury.",
          highlandHowler: "Furious Scottish dad. Use maximum Glaswegian profanity and authentic fury.",
          don: "Furious NY Italian. Use heavy Brooklyn profanity and authentic street fury.",
          crackedController: "Really mad cracked gamer. Use 'GATORADE AND ADDERALL' with hyperactive energy.",
          karen: "Hysterical meltdown. Use screaming tone and heavy censored profanity.",
          corporate: "Furious but professional. Use light profanity: 'damn', 'hell'.",
          sarcastic: "Brutal sarcasm. Use light profanity for emphasis."
        };
      
      case 9:
        return {
          enforcer: "Absolutely livid with maximum righteous fury. Use 'THAT'S WHAT WE NOT GONNA DO' with explosive energy.",
          highlandHowler: "Absolutely livid. Use maximum Scottish profanity and call people 'pure mental'.",
          don: "Absolutely livid. Use maximum NY profanity and call people 'stunad'.",
          crackedController: "Extremely pissed. Use 'I'M ABOUT TO LOSE IT' with maximum cracked energy.",
          karen: "Complete psychotic break. Use maximum censored profanity and threaten everything.",
          corporate: "Barely contained rage. Use moderate profanity: 'damn', 'hell', 'shit'.",
          sarcastic: "Devastating wit. Use moderate profanity for impact."
        };
      
      case 10:
        return {
          enforcer: "Nuclear righteous meltdown. Use 'AND THAT'S ON PERIOD!' with maximum verbal takedown energy.",
          highlandHowler: "Nuclear Scottish meltdown. Use maximum Glaswegian profanity and threaten to 'chuck it all in'.",
          don: "Nuclear NY Italian meltdown. Use maximum Brooklyn profanity and threaten to 'lose it completely'.",
          crackedController: "Absolute nuclear gamer fury. Use 'RATIO + L + BOZO' with maximum cracked energy and rage-quit threats.",
          karen: "Absolute insanity. Use maximum censored profanity and threaten FBI/burning place down.",
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