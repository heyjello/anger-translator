/**
 * Enhanced Translation Hook
 * 
 * React hook that uses the enhanced translation service with AI capabilities.
 * Provides the same interface as useTranslation but with AI features.
 */

import { useState, useCallback } from 'react';
import { enhancedTranslationService, type EnhancedTranslationResponse } from '../services/enhancedTranslationService';
import { TranslationRequest } from '../services/translationService';

export interface UseEnhancedTranslationResult {
  translate: (request: TranslationRequest) => Promise<void>;
  isLoading: boolean;
  result: string;
  error: string | null;
  isRateLimited: boolean;
  timeUntilNextRequest: number;
  clearResult: () => void;
  clearError: () => void;
  // Enhanced features
  usedAI: boolean;
  aiModel?: string;
  isAIAvailable: boolean;
  serviceStatus: {
    aiAvailable: boolean;
    usingAI: boolean;
    model?: string;
    service: 'openrouter' | 'mock';
  };
  refreshAIStatus: () => void;
  setUseAI: (useAI: boolean) => void;
}

export const useEnhancedTranslation = (): UseEnhancedTranslationResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [timeUntilNextRequest, setTimeUntilNextRequest] = useState(0);
  const [usedAI, setUsedAI] = useState(false);
  const [aiModel, setAiModel] = useState<string | undefined>(undefined);
  const [serviceStatus, setServiceStatus] = useState(enhancedTranslationService.getStatus());

  const refreshAIStatus = useCallback(() => {
    enhancedTranslationService.updateAIStatus();
    setServiceStatus(enhancedTranslationService.getStatus());
  }, []);

  const translate = useCallback(async (request: TranslationRequest) => {
    setIsLoading(true);
    setError(null);
    setResult('');
    setIsRateLimited(false);
    setUsedAI(false);
    setAiModel(undefined);

    try {
      const response: EnhancedTranslationResponse = await enhancedTranslationService.translateText(request);
      
      if (response.success) {
        setResult(response.translatedText);
        setUsedAI(response.usedAI);
        setAiModel(response.model);
        
        // Update service status after successful translation
        setServiceStatus(enhancedTranslationService.getStatus());
      } else {
        setError(response.error || 'Translation failed');
        
        // Check if it's a rate limit error
        if (response.error?.includes('Rate limit exceeded')) {
          setIsRateLimited(true);
          const match = response.error.match(/wait (\d+) seconds/);
          if (match) {
            const waitTime = parseInt(match[1]);
            setTimeUntilNextRequest(waitTime);
            
            // Auto-clear rate limit after wait time
            setTimeout(() => {
              setIsRateLimited(false);
              setTimeUntilNextRequest(0);
              setError(null);
            }, waitTime * 1000);
          }
        }
      }
    } catch (err) {
      console.error('Enhanced translation error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult('');
    setUsedAI(false);
    setAiModel(undefined);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsRateLimited(false);
    setTimeUntilNextRequest(0);
  }, []);

  const setUseAI = useCallback((useAI: boolean) => {
    try {
      enhancedTranslationService.setUseAI(useAI);
      setServiceStatus(enhancedTranslationService.getStatus());
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to configure AI service');
    }
  }, []);

  return {
    translate,
    isLoading,
    result,
    error,
    isRateLimited,
    timeUntilNextRequest,
    clearResult,
    clearError,
    usedAI,
    aiModel,
    isAIAvailable: enhancedTranslationService.isAIAvailable(),
    serviceStatus,
    refreshAIStatus,
    setUseAI
  };
};