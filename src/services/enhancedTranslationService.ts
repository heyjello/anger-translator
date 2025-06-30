/**
 * Enhanced Translation Service
 * 
 * Integrates OpenRouter AI service with fallback to mock translation.
 * Now properly cleans audio tags for display while preserving them for TTS.
 */

import { openRouterService } from './openRouterService';
import { translateText as mockTranslate, TranslationRequest, TranslationResponse, rateLimiter } from './translationService';
import { cleanTextForDisplay } from '../utils/textProcessing';
import type { RageStyle } from '../config/elevenLabsVoices';

export interface EnhancedTranslationResponse extends TranslationResponse {
  usedAI: boolean;
  model?: string;
  tokensUsed?: number;
  rawText?: string; // Keep raw text with audio tags for TTS
}

/**
 * Keep raw text with audio tags for TTS processing
 */
const preserveRawTextForTTS = (text: string): string => {
  // Only remove tone cues, keep audio tags and profanity markers
  let rawText = text;
  
  // Remove tone cues like [explosive energy], [screaming], etc.
  rawText = rawText.replace(/\[([^\]]+)\]/g, '');
  
  // Keep audio tags and profanity markers intact
  // Just clean up spacing
  rawText = rawText.replace(/\s+/g, ' ').trim();
  
  return rawText;
};

class EnhancedTranslationService {
  private useAI: boolean = true; // Default to AI enabled

  constructor() {
    // Check if OpenRouter is configured on initialization
    this.updateAIStatus();
  }

  /**
   * Update AI status based on OpenRouter configuration
   */
  updateAIStatus(): void {
    const isAIReady = openRouterService.isReady();
    this.useAI = isAIReady; // Auto-enable AI if available
    
    if (isAIReady) {
      console.log('🤖 AI translation enabled - DeepSeek v3 dynamic responses active');
    } else {
      console.log('⚠️ AI not configured - using fallback responses');
    }
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
      usingAI: this.useAI && this.isAIAvailable(),
      model: openRouterStatus.model,
      service: (this.useAI && this.isAIAvailable()) ? 'openrouter' : 'mock'
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
    console.log(`🔄 AI translation ${useAI ? 'enabled' : 'disabled'}`);
  }

  /**
   * Main translation function with AI prioritized for dynamic responses
   * Now properly handles audio tags and provides both clean and raw text
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

    // Prioritize AI translation for dynamic responses
    if (this.useAI && this.isAIAvailable()) {
      try {
        console.log('🤖 Using DeepSeek v3 for dynamic response generation');
        const rawTranslatedText = await openRouterService.translateText(
          request.text,
          request.style as RageStyle,
          request.intensity
        );

        // Clean the text for end user display using the proper cleaning function
        const cleanedText = cleanTextForDisplay(rawTranslatedText);
        
        // Preserve raw text for TTS
        const rawText = preserveRawTextForTTS(rawTranslatedText);

        console.log('🧹 Text cleaned for display:', cleanedText);
        console.log('🎤 Raw text preserved for TTS:', rawText);

        return {
          translatedText: cleanedText,
          rawText: rawText,
          success: true,
          usedAI: true,
          model: openRouterService.getCurrentModel().name
        };
      } catch (error) {
        console.warn('⚠️ AI translation failed, falling back to mock:', error);
        
        // Enhanced error handling for specific OpenRouter issues
        let fallbackError = 'AI unavailable - using fallback responses.';
        
        if (error instanceof Error) {
          if (error.message.includes('OpenRouter Privacy Settings Issue')) {
            fallbackError = 'AI disabled due to privacy settings. Please enable prompt training in your OpenRouter account settings, then refresh the page.';
          } else if (error.message.includes('Invalid OpenRouter API key')) {
            fallbackError = 'Invalid API key. Please check your OpenRouter configuration.';
          } else if (error.message.includes('Insufficient credits')) {
            fallbackError = 'Insufficient OpenRouter credits. Please add credits to your account.';
          } else if (error.message.includes('Rate limit exceeded')) {
            fallbackError = 'OpenRouter rate limit exceeded. Please wait before trying again.';
          }
        }
        
        // Fall back to mock translation with enhanced error context
        const mockResponse = await mockTranslate(request);
        return {
          ...mockResponse,
          translatedText: mockResponse.success ? cleanTextForDisplay(mockResponse.translatedText) : mockResponse.translatedText,
          rawText: mockResponse.success ? preserveRawTextForTTS(mockResponse.translatedText) : mockResponse.translatedText,
          usedAI: false,
          error: mockResponse.success ? fallbackError : mockResponse.error
        };
      }
    }

    // Use mock translation with clear indication that AI should be used
    console.log('📝 Using mock translation - configure AI for dynamic responses');
    const mockResponse = await mockTranslate(request);
    return {
      ...mockResponse,
      translatedText: mockResponse.success ? cleanTextForDisplay(mockResponse.translatedText) : mockResponse.translatedText,
      rawText: mockResponse.success ? preserveRawTextForTTS(mockResponse.translatedText) : mockResponse.translatedText,
      usedAI: false,
      error: mockResponse.success ? 'Using mock responses. Enable AI for dynamic generation.' : mockResponse.error
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