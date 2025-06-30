/**
 * Secure OpenRouter Service
 * 
 * Enhanced version with proper security measures, input validation,
 * and secure API key handling.
 */

import { secureApiService, type SecureTranslationRequest } from './secureApiService';
import { secureKeyManager } from './secureKeyManager';
import { z } from 'zod';

// Validation schemas
const ModelSchema = z.enum([
  'deepseek/deepseek-chat-v3-0324:free',
  'mistralai/mixtral-8x7b-instruct',
  'anthropic/claude-3-haiku',
  'openai/gpt-4o-mini',
  'meta-llama/llama-3.1-8b-instruct:free'
]);

const PersonaSchema = z.enum([
  'enforcer', 'highland-howler', 'don', 'cracked-controller',
  'karen', 'corporate', 'sarcastic'
]);

export class SecureOpenRouterService {
  private readonly baseUrl = 'https://openrouter.ai/api/v1';
  private readonly serviceName = 'openrouter';
  private currentModel = 'deepseek/deepseek-chat-v3-0324:free';

  /**
   * Check if service is properly configured
   */
  isConfigured(): boolean {
    return secureKeyManager.hasValidKey(this.serviceName);
  }

  /**
   * Get current configuration status
   */
  getStatus(): { configured: boolean; model: string; hasApiKey: boolean } {
    const keyStatus = secureKeyManager.getKeyStatus(this.serviceName);
    return {
      configured: keyStatus.hasKey && keyStatus.isValid,
      model: this.currentModel,
      hasApiKey: keyStatus.hasKey
    };
  }

  /**
   * Set the model with validation
   */
  setModel(model: string): void {
    try {
      ModelSchema.parse(model);
      this.currentModel = model;
      console.log(`📋 Model changed to: ${model}`);
    } catch (error) {
      throw new Error(`Invalid model: ${model}`);
    }
  }

  /**
   * Build secure prompt with input sanitization
   */
  private buildSecurePrompt(text: string, persona: string, rageLevel: number): string {
    // Validate inputs
    PersonaSchema.parse(persona);
    
    if (rageLevel < 1 || rageLevel > 100) {
      throw new Error('Rage level must be between 1 and 100');
    }

    // Sanitize text input
    const sanitizedText = text
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript protocols
      .trim();

    if (sanitizedText.length === 0) {
      throw new Error('Text cannot be empty after sanitization');
    }

    // Build prompt with safe interpolation
    const baseRules = `You create SHORT, punchy anger responses. MAXIMUM 3 sentences. Use ONLY ElevenLabs v3 audio tags.

CRITICAL RULES:
- NEVER repeat user input verbatim
- Maximum 50 words total
- End with dramatic punctuation
- Use appropriate persona voice

Rage Level: ${Math.floor(rageLevel)}/100`;

    const personaInstructions = this.getPersonaInstructions(persona);
    
    return `${baseRules}\n\n${personaInstructions}\n\nTransform: "${sanitizedText}"\n\nResponse:`;
  }

  /**
   * Get persona-specific instructions
   */
  private getPersonaInstructions(persona: string): string {
    const instructions = {
      enforcer: 'ENFORCER STYLE: Use [angry], [shouting] tags. Black vernacular: "OH HELL NAH!", "I wish you would"',
      'highland-howler': 'HIGHLAND HOWLER STYLE: Use [shouting], [sputtering] tags. Scottish: "Och!", "Ya numpty!"',
      don: 'THE DON STYLE: Use [threatening], [calm] tags. NY Italian: "Capisce?", "Ya mook!"',
      'cracked-controller': 'CRACKED CONTROLLER STYLE: Use [panicked], [rushed] tags. Gen-Z: "¡No mames!", "RATIO!"',
      karen: 'KAREN STYLE: Use [fake sweet], [demanding] tags. "I\'m a paying customer!", "Manager!"',
      corporate: 'CORPORATE STYLE: Use [passive aggressive] tags. "As per my previous email"',
      sarcastic: 'SARCASTIC STYLE: Use [sarcastic], [mocking] tags. "How lovely!", "Absolutely riveting!"'
    };

    return instructions[persona as keyof typeof instructions] || instructions.enforcer;
  }

  /**
   * Secure translation with proper error handling
   */
  async translateText(text: string, persona: string, rageLevel: number): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('OpenRouter API key not configured. Please configure your API key securely.');
    }

    // Validate and sanitize inputs
    const request: SecureTranslationRequest = {
      text,
      persona,
      rageLevel
    };

    try {
      const apiKey = secureKeyManager.getKey(this.serviceName);
      if (!apiKey) {
        throw new Error('Failed to retrieve API key');
      }

      const prompt = this.buildSecurePrompt(text, persona, rageLevel);

      const requestBody = {
        model: this.currentModel,
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.9,
        top_p: 0.9,
        frequency_penalty: 0.6,
        presence_penalty: 0.4
      };

      const response = await secureApiService.makeSecureRequest(
        `${this.baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Anger Translator'
          },
          body: JSON.stringify(requestBody)
        },
        request
      );

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from AI model');
      }

      // Sanitize output
      let output = content.trim()
        .replace(/^\*\*/, '')
        .replace(/\*\*$/, '')
        .replace(/^"/, '')
        .replace(/"$/, '');

      if (output.startsWith('**') && output.endsWith('**')) {
        output = output.slice(2, -2);
      }

      return output.trim();

    } catch (error) {
      console.error('❌ Secure translation failed:', error);
      
      // Don't expose internal error details
      if (error instanceof Error) {
        if (error.message.includes('Rate limit')) {
          throw new Error('Rate limit exceeded. Please wait before trying again.');
        } else if (error.message.includes('Authentication')) {
          throw new Error('Authentication failed. Please check your API key.');
        } else if (error.message.includes('Validation failed')) {
          throw error; // Safe to expose validation errors
        }
      }
      
      throw new Error('Translation service temporarily unavailable');
    }
  }

  /**
   * Test connection securely
   */
  async testConnection(): Promise<{ success: boolean; model: string; error?: string }> {
    try {
      console.log('🧪 Testing secure OpenRouter connection...');
      
      await this.translateText(
        "Hello, this is a test message.",
        "enforcer",
        30
      );
      
      console.log('✅ Secure connection test successful');
      return {
        success: true,
        model: this.currentModel
      };
    } catch (error) {
      console.error('❌ Secure connection test failed:', error);
      return {
        success: false,
        model: this.currentModel,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const secureOpenRouterService = new SecureOpenRouterService();