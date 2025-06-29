/**
 * Enhanced Translation Service
 * 
 * Integrates OpenRouter AI service with fallback to mock translation.
 * Provides seamless switching between AI and mock modes.
 */

import { openRouterService } from './openRouterService';
import { translateText as mockTranslate, TranslationRequest, TranslationResponse, rateLimiter } from './translationService';

export interface EnhancedTranslationResponse extends TranslationResponse {
  usedAI: boolean;
  model?: string;
  tokensUsed?: number;
}

class EnhancedTranslationService {
  private useAI: boolean = false;

  constructor() {
    // Check if OpenRouter is configured on initialization
    this.updateAIStatus();
  }

  /**
   * Update AI status based on OpenRouter configuration
   */
  updateAIStatus(): void {
    this.useAI = openRouterService.isReady();
  }

  /**
   * Check if AI translation is available
   */
  isAIAvailable(): boolean {
    return openRouterService.isReady();
  }

  /**
   * Get current service status
   */
  getStatus(): {
    aiAvailable: boolean;
    usingAI: boolean;
    model?: string;
    service: 'openrouter' | 'mock';
  } {
    const openRouterStatus = openRouterService.getStatus();
    return {
      aiAvailable: this.isAIAvailable(),
      usingAI: this.useAI,
      model: openRouterStatus.model,
      service: this.useAI ? 'openrouter' : 'mock'
    };
  }

  /**
   * Force enable/disable AI translation
   */
  setUseAI(useAI: boolean): void {
    if (useAI && !this.isAIAvailable()) {
      throw new Error('AI service not configured. Please set up OpenRouter first.');
    }
    this.useAI = useAI;
  }

  /**
   * Main translation function with AI/mock fallback
   */
  async translateText(request: TranslationRequest): Promise<EnhancedTranslationResponse> {
    // Input validation
    if (!request.text?.trim()) {
      return {
        translatedText: '',
        success: false,
        error: 'No text provided for translation',
        usedAI: false
      };
    }

    if (request.text.length > 500) {
      return {
        translatedText: '',
        success: false,
        error: 'Text too long for translation',
        usedAI: false
      };
    }

    // Check rate limiting
    if (!rateLimiter.canMakeRequest()) {
      const waitTime = rateLimiter.getTimeUntilNextRequest();
      return {
        translatedText: '',
        success: false,
        error: `Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds before trying again.`,
        usedAI: false
      };
    }

    // Update AI status in case configuration changed
    this.updateAIStatus();

    // Try AI translation first if available and enabled
    if (this.useAI && this.isAIAvailable()) {
      try {
        console.log('🤖 Using AI translation via OpenRouter');
        const translatedText = await openRouterService.translateText(
          request.text,
          request.style,
          request.intensity
        );

        return {
          translatedText,
          success: true,
          usedAI: true,
          model: openRouterService.getCurrentModel().name
        };
      } catch (error) {
        console.warn('AI translation failed, falling back to mock:', error);
        
        // Fall back to mock translation
        const mockResponse = await mockTranslate(request);
        return {
          ...mockResponse,
          usedAI: false,
          error: mockResponse.error || `AI translation failed: ${error instanceof Error ? error.message : 'Unknown error'}. Using mock translation.`
        };
      }
    }

    // Use mock translation
    console.log('🎭 Using mock translation service');
    const mockResponse = await mockTranslate(request);
    return {
      ...mockResponse,
      usedAI: false
    };
  }

  /**
   * Test AI connection
   */
  async testAIConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.isAIAvailable()) {
      return {
        success: false,
        error: 'OpenRouter not configured'
      };
    }

    try {
      const result = await openRouterService.testConnection();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed'
      };
    }
  }

  /**
   * Get available AI models
   */
  getAvailableModels() {
    return openRouterService.getCurrentModel();
  }

  /**
   * Switch AI model
   */
  setAIModel(model: string): void {
    // This would need to be implemented in openRouterService
    // openRouterService.setModel(model);
  }
}

// Export singleton instance
export const enhancedTranslationService = new EnhancedTranslationService();

// Export types
export type { EnhancedTranslationResponse };