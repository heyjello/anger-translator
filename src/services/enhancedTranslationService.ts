/**
 * Enhanced Translation Service
 * 
 * Integrates OpenRouter AI service with fallback to mock translation.
 * Now properly cleans audio tags for display while preserving them for TTS.
 */

import { openRouterService } from './openRouterService';
import { translateText as mockTranslate, TranslationRequest, TranslationResponse, rateLimiter } from './translationService';
import type { RageStyle } from '../config/elevenLabsVoices';

export interface EnhancedTranslationResponse extends TranslationResponse {
  usedAI: boolean;
  model?: string;
  tokensUsed?: number;
  rawText?: string; // Keep raw text with audio tags for TTS
}

/**
 * Clean translated text for end user display by removing audio tags and tone cues
 * Preserves double asterisks for profanity bleeping
 */
const cleanTextForUser = (text: string): string => {
  let cleanedText = text;
  
  // Remove tone cues like [explosive energy], [screaming], etc.
  cleanedText = cleanedText.replace(/\[([^\]]+)\]/g, '');
  
  // Remove ElevenLabs audio tags but keep the content
  cleanedText = cleanedText.replace(/<emphasis[^>]*>([^<]+)<\/emphasis>/g, '$1');
  cleanedText = cleanedText.replace(/<prosody[^>]*>([^<]+)<\/prosody>/g, '$1');
  cleanedText = cleanedText.replace(/<break[^>]*\/>/g, ' ');
  cleanedText = cleanedText.replace(/<break[^>]*><\/break>/g, ' ');
  cleanedText = cleanedText.replace(/<[^>]+>/g, ''); // Remove any remaining tags
  
  // Clean up asterisk emphasis but preserve profanity markers
  // First, temporarily replace double asterisks with a placeholder
  cleanedText = cleanedText.replace(/\*\*([^*]+)\*\*/g, '___PROFANITY_MARKER___$1___PROFANITY_MARKER___');
  
  // Now remove any remaining single asterisks
  cleanedText = cleanedText.replace(/\*/g, '');
  
  // Restore double asterisks for profanity
  cleanedText = cleanedText.replace(/___PROFANITY_MARKER___([^_]+)___PROFANITY_MARKER___/g, '**$1**');
  
  // Remove multiple spaces and clean up
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  
  // Remove leading/trailing punctuation that might cause issues
  cleanedText = cleanedText.replace(/^[,.\s]+|[,.\s]+$/g, '');
  
  // Clean up any double spaces that might remain
  cleanedText = cleanedText.replace(/\s{2,}/g, ' ');
  
  return cleanedText;
};

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

        // Clean the text for end user display
        const cleanedText = cleanTextForUser(rawTranslatedText);
        
        // Preserve raw text for TTS
        const rawText = preserveRawTextForTTS(rawTranslatedText);

        return {
          translatedText: cleanedText,
          rawText: rawText,
          success: true,
          usedAI: true,
          model: openRouterService.getCurrentModel().name
        };
      } catch (error) {
        console.warn('⚠️ AI translation failed, falling back to mock:', error);
        
        // Fall back to mock translation with clear indication
        const mockResponse = await mockTranslate(request);
        return {
          ...mockResponse,
          translatedText: mockResponse.success ? cleanTextForUser(mockResponse.translatedText) : mockResponse.translatedText,
          rawText: mockResponse.success ? preserveRawTextForTTS(mockResponse.translatedText) : mockResponse.translatedText,
          usedAI: false,
          error: `AI unavailable - using fallback. Configure OpenRouter for dynamic responses.`
        };
      }
    }

    // Use mock translation with clear indication that AI should be used
    console.log('📝 Using mock translation - configure AI for dynamic responses');
    const mockResponse = await mockTranslate(request);
    return {
      ...mockResponse,
      translatedText: mockResponse.success ? cleanTextForUser(mockResponse.translatedText) : mockResponse.translatedText,
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