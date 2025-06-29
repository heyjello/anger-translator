/**
 * TranslateButton Component
 * 
 * Main action button with loading states, validation feedback, accessibility,
 * and enhanced animations including pulse effect.
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TranslateButtonProps {
  onTranslate: () => void;
  isValid: boolean;
  isLoading: boolean;
  isRateLimited: boolean;
  timeUntilNext?: number;
  validationMessage?: string;
}

export const TranslateButton: React.FC<TranslateButtonProps> = ({
  onTranslate,
  isValid,
  isLoading,
  isRateLimited,
  timeUntilNext = 0,
  validationMessage
}) => {
  const getButtonText = () => {
    if (isLoading) return 'TRANSLATING...';
    return 'TRANSLATE MY RAGE';
  };

  const getHelpText = () => {
    if (isRateLimited) {
      return `Rate limited - wait ${timeUntilNext}s`;
    }
    if (validationMessage) {
      return validationMessage;
    }
    return 'Please fix the input errors above';
  };

  return (
    <div className="mb-8 text-center">
      <button 
        onClick={onTranslate}
        disabled={!isValid}
        className={`relative overflow-hidden font-black py-6 px-12 rounded-2xl text-2xl transition-all duration-300 shadow-2xl transform ${
          !isValid
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed scale-95'
            : `bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white hover:scale-105 hover:shadow-3xl active:scale-95 ${
                isLoading ? 'animate-pulse' : 'animate-button-pulse hover-fire'
              }`
        }`}
        aria-label={isLoading ? 'Translation in progress' : 'Start translation'}
      >
        <div className="relative z-10 flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>{getButtonText()}</span>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </>
          ) : (
            <>
              <span role="img" aria-label="Fire" className="animate-bounce">🔥</span>
              <span>{getButtonText()}</span>
              <span role="img" aria-label="Fire" className="animate-bounce" style={{ animationDelay: '0.2s' }}>🔥</span>
            </>
          )}
        </div>
        
        {/* Animated background effects */}
        {isValid && !isLoading && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}
        
        {/* Loading shimmer effect */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        )}
      </button>
      
      {/* Button Help Text */}
      {!isValid && !isLoading && (
        <div className="mt-3 text-sm text-gray-500 flex items-center justify-center gap-2 animate-slide-in">
          <AlertCircle size={16} />
          <span>{getHelpText()}</span>
        </div>
      )}
    </div>
  );
};