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
   * Analyze input text to extract key traits and context
   */
  private analyzeInputTraits(text: string): {
    topic: string;
    tone: string;
    urgency: string;
    context: string;
    keywords: string[];
  } {
    const lowerText = text.toLowerCase();
    
    // Extract topic/subject
    let topic = 'general request';
    if (lowerText.includes('meeting') || lowerText.includes('schedule')) topic = 'meeting/scheduling';
    if (lowerText.includes('document') || lowerText.includes('report') || lowerText.includes('file')) topic = 'document/report';
    if (lowerText.includes('email') || lowerText.includes('message')) topic = 'communication';
    if (lowerText.includes('project') || lowerText.includes('task')) topic = 'project/task';
    if (lowerText.includes('help') || lowerText.includes('assist')) topic = 'assistance request';
    if (lowerText.includes('review') || lowerText.includes('check')) topic = 'review/feedback';
    if (lowerText.includes('fix') || lowerText.includes('problem') || lowerText.includes('issue')) topic = 'problem/issue';
    
    // Detect tone
    let tone = 'neutral';
    if (lowerText.includes('please') || lowerText.includes('thank')) tone = 'polite';
    if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('immediately')) tone = 'urgent';
    if (lowerText.includes('when you have time') || lowerText.includes('no rush')) tone = 'casual';
    
    // Detect urgency level
    let urgency = 'normal';
    if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('immediately') || lowerText.includes('deadline')) urgency = 'high';
    if (lowerText.includes('when you can') || lowerText.includes('no rush') || lowerText.includes('whenever')) urgency = 'low';
    
    // Extract context
    let context = 'workplace';
    if (lowerText.includes('game') || lowerText.includes('play') || lowerText.includes('match')) context = 'gaming';
    if (lowerText.includes('school') || lowerText.includes('homework') || lowerText.includes('assignment')) context = 'academic';
    if (lowerText.includes('family') || lowerText.includes('friend') || lowerText.includes('personal')) context = 'personal';
    
    // Extract key action words
    const keywords = [];
    const actionWords = ['fix', 'help', 'review', 'check', 'send', 'update', 'complete', 'finish', 'start', 'stop', 'change', 'improve'];
    actionWords.forEach(word => {
      if (lowerText.includes(word)) keywords.push(word);
    });
    
    return { topic, tone, urgency, context, keywords };
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
   * Generate a rage translation using AI with input blending (optimized for Mixtral)
   */
  async translateText(
    text: string, 
    style: 'corporate' | 'gamer' | 'sarcastic', 
    intensity: number
  ): Promise<string> {
    if (!this.isReady()) {
      throw new Error('OpenRouter API key not configured. Please set up your API key from https://openrouter.ai/keys');
    }

    // Analyze input to extract traits and context
    const traits = this.analyzeInputTraits(text);
    console.log('🔍 Input analysis:', traits);

    const systemPrompt = this.buildBlendedPrompt(style, intensity, traits);
    const userPrompt = `Create a ${style} rage response about ${traits.topic} with ${traits.urgency} urgency in a ${traits.context} context. The response should reflect someone who is frustrated about ${traits.keywords.join(', ') || 'the situation'}.`;

    // Optimized parameters for Mixtral
    const request: OpenRouterRequest = {
      model: this.config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 400,
      temperature: 0.85, // Slightly higher for more creative blending
      top_p: 0.9,
      frequency_penalty: 0.2, // Encourage variety
      presence_penalty: 0.1
    };

    try {
      const response = await this.makeRequest(request);
      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from AI model');
      }

      console.log('🎭 Blended translation generated successfully');
      return content.trim();
    } catch (error) {
      console.error('❌ Translation failed:', error);
      throw error;
    }
  }

  /**
   * Build system prompt for blended responses (optimized for Mixtral)
   */
  private buildBlendedPrompt(
    style: string, 
    intensity: number, 
    traits: { topic: string; tone: string; urgency: string; context: string; keywords: string[] }
  ): string {
    const basePrompt = `You are a comedic rage translator. Create hilarious angry responses that capture the essence and frustration of the situation WITHOUT directly quoting or repeating the original input.

CRITICAL INSTRUCTIONS:
- NEVER repeat or quote the original text
- Blend the meaning and context into a natural rage response
- Make it funny and over-the-top, never genuinely offensive
- Create original content that feels authentic to the situation
- Focus on the emotional response someone would have
- Keep responses under 200 words
- Make it entertaining, not actually hurtful`;

    const styleInstructions = {
      corporate: `CORPORATE MELTDOWN STYLE:
Create a passive-aggressive corporate response about ${traits.topic}. Channel the frustration of a professional dealing with ${traits.urgency} urgency situations.

Essential elements:
- "As per my previous email" energy
- Professional language with barely contained rage
- Corporate buzzwords and formal structure
- Escalation through proper channels
- Passive-aggressive politeness

Context: ${traits.context} environment with ${traits.tone} original tone.`,

      gamer: `EPIC GAMER RAGE STYLE:
Create an explosive gaming-style rant about ${traits.topic}. Channel the energy of someone who just experienced peak gaming frustration.

Essential elements:
- Strategic CAPS LOCK usage
- Gaming terminology and internet slang
- "BRUH" and "ARE YOU KIDDING ME" energy
- References to skill levels and competition
- Over-the-top dramatic reactions

Context: ${traits.context} situation with ${traits.urgency} pressure.`,

      sarcastic: `SARCASTIC ROAST STYLE:
Create a witty, intellectually superior response about ${traits.topic}. Channel sophisticated frustration with cutting sarcasm.

Essential elements:
- Backhanded compliments and irony
- Sophisticated vocabulary with sharp wit
- "How absolutely delightful" energy
- Intellectual superiority complex
- Elegant verbal destruction

Context: ${traits.context} scenario requiring ${traits.urgency} attention.`
    };

    const intensityGuidance = this.getBlendedIntensityGuidance(intensity, traits);

    return `${basePrompt}

${styleInstructions[style as keyof typeof styleInstructions]}

INTENSITY LEVEL: ${intensity}/10
${intensityGuidance}

SITUATION ANALYSIS:
- Topic: ${traits.topic}
- Original tone: ${traits.tone}
- Urgency: ${traits.urgency}
- Context: ${traits.context}
- Key frustrations: ${traits.keywords.join(', ') || 'general situation'}

Create a response that someone would naturally have in this situation, not a translation of specific words.`;
  }

  /**
   * Get intensity guidance for blended responses
   */
  private getBlendedIntensityGuidance(
    intensity: number, 
    traits: { topic: string; tone: string; urgency: string; context: string; keywords: string[] }
  ): string {
    const baseGuidance = {
      1: "Mild annoyance - subtle frustration with professional restraint",
      2: "Light irritation - noticeable but controlled displeasure", 
      3: "Clear frustration - obvious annoyance but still measured",
      4: "Growing anger - frustration starting to show through",
      5: "Moderate rage - clear anger with dramatic emphasis",
      6: "High frustration - intense displeasure with strong language",
      7: "Serious anger - heated response with dramatic flair",
      8: "Intense fury - explosive reaction with maximum drama",
      9: "Nuclear rage - absolutely over-the-top response",
      10: "Apocalyptic meltdown - complete emotional explosion"
    };

    let guidance = baseGuidance[intensity as keyof typeof baseGuidance] || baseGuidance[5];

    // Adjust based on context and urgency
    if (traits.urgency === 'high' && intensity >= 6) {
      guidance += " Amplify the urgency-driven frustration.";
    }
    if (traits.context === 'gaming' && intensity >= 7) {
      guidance += " Channel peak gaming rage energy.";
    }
    if (traits.tone === 'polite' && intensity >= 5) {
      guidance += " Contrast the original politeness with explosive frustration.";
    }

    return guidance;
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