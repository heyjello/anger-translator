import { useState, useCallback } from 'react';
import { translateText, TranslationRequest, TranslationResponse, rateLimiter } from '../services/translationService';

export interface UseTranslationResult {
  translate: (request: TranslationRequest) => Promise<void>;
  isLoading: boolean;
  result: string;
  error: string | null;
  isRateLimited: boolean;
  timeUntilNextRequest: number;
  clearResult: () => void;
  clearError: () => void;
}

export const useTranslation = (): UseTranslationResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [timeUntilNextRequest, setTimeUntilNextRequest] = useState(0);

  const translate = useCallback(async (request: TranslationRequest) => {
    // Check rate limiting
    if (!rateLimiter.canMakeRequest()) {
      const waitTime = rateLimiter.getTimeUntilNextRequest();
      setIsRateLimited(true);
      setTimeUntilNextRequest(Math.ceil(waitTime / 1000));
      setError(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds before trying again.`);
      
      // Auto-clear rate limit after wait time
      setTimeout(() => {
        setIsRateLimited(false);
        setTimeUntilNextRequest(0);
        setError(null);
      }, waitTime);
      
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult('');
    setIsRateLimited(false);

    try {
      const response: TranslationResponse = await translateText(request);
      
      if (response.success) {
        setResult(response.translatedText);
      } else {
        setError(response.error || 'Translation failed');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult('');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsRateLimited(false);
    setTimeUntilNextRequest(0);
  }, []);

  return {
    translate,
    isLoading,
    result,
    error,
    isRateLimited,
    timeUntilNextRequest,
    clearResult,
    clearError
  };
};