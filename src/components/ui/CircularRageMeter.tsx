/**
 * CircularRageMeter Component
 * 
 * Professional circular rage meter with emoji inside the gauge.
 * Now uses 1-10 scale for better usability while maintaining internal 10-100 conversion.
 * Improved responsive design for all screen sizes.
 */

import React from 'react';
import { EmojiMascot } from './EmojiMascot';

interface CircularRageMeterProps {
  value: number; // 1-10 scale
  onChange: (value: number) => void;
  isLoading: boolean;
  onTranslate: () => void;
  isValid: boolean;
  isRateLimited: boolean;
  timeUntilNext: number;
  validationMessage?: string;
}

export const CircularRageMeter: React.FC<CircularRageMeterProps> = ({
  value,
  onChange,
  isLoading,
  onTranslate,
  isValid,
  isRateLimited,
  timeUntilNext,
  validationMessage
}) => {
  // Convert 1-10 to percentage for visual display
  const percentage = ((value - 1) / 9) * 100;
  
  // Calculate stroke dash array for circular progress
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (level: number) => {
    if (level <= 2) return '#3b82f6'; // Blue
    if (level <= 4) return '#22c55e'; // Green
    if (level <= 6) return '#eab308'; // Yellow
    if (level <= 8) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getDescription = (level: number) => {
    if (level <= 2) return 'Chill';
    if (level <= 4) return 'Annoyed';
    if (level <= 6) return 'Angry';
    if (level <= 8) return 'Pissed';
    return 'NUCLEAR';
  };

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

  const currentColor = getColor(value);

  return (
    <div className="flex flex-col items-center space-y-6 lg:space-y-8">
      
      {/* Circular Gauge */}
      <div className="relative">
        <svg 
          width="220" 
          height="220" 
          className="transform -rotate-90"
          viewBox="0 0 200 200"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="rgba(71, 85, 105, 0.3)"
            strokeWidth="8"
            fill="none"
          />
          
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={currentColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${currentColor}40)`
            }}
          />
        </svg>
        
        {/* Content inside the circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Emoji Mascot */}
          <div className="mb-2">
            <EmojiMascot rageLevel={value} />
          </div>
          
          {/* Rage Level Number */}
          <div 
            className="text-4xl lg:text-5xl font-black transition-colors duration-300"
            style={{ color: currentColor }}
          >
            {value}
          </div>
          
          {/* Description */}
          <div 
            className="text-sm lg:text-base font-bold mt-1 transition-colors duration-300"
            style={{ color: currentColor }}
          >
            {getDescription(value)}
          </div>
        </div>
      </div>

      {/* Slider Control */}
      <div className="w-full max-w-xs">
        <div className="flex items-center justify-between text-xs lg:text-sm text-gray-400 mb-2">
          <span>😊 Chill</span>
          <span>🤬 NUCLEAR</span>
        </div>
        
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={isLoading}
          className="w-full h-2 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 via-orange-400 to-red-500 rounded-lg appearance-none cursor-pointer slider-modern"
          aria-label={`Rage level: ${value} out of 10`}
        />
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <span key={num} className={value === num ? 'text-white font-bold' : ''}>
              {num}
            </span>
          ))}
        </div>
      </div>

      {/* Translate Button - Only show on larger screens (xl and up) */}
      <div className="hidden xl:block w-full">
        <button 
          onClick={onTranslate}
          disabled={!isValid}
          className={`relative overflow-hidden font-black py-4 lg:py-6 px-8 lg:px-12 rounded-2xl text-lg lg:text-2xl transition-all duration-300 transform w-full ${
            !isValid
              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed scale-95 border border-gray-600/30'
              : `bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white hover:scale-105 active:scale-95 border border-red-500/50 ${
                  isLoading ? 'animate-pulse' : 'animate-button-pulse hover-fire'
                }`
          }`}
          style={{
            boxShadow: isValid 
              ? '0 0 40px rgba(239, 68, 68, 0.5), 0 10px 25px rgba(220, 38, 38, 0.3)' 
              : '0 5px 15px rgba(0, 0, 0, 0.2)'
          }}
          aria-label={isLoading ? 'Translation in progress' : 'Start translation'}
        >
          <div className="relative z-10 flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 lg:h-6 lg:w-6 border-b-2 border-white"></div>
                <span>{getButtonText()}</span>
                <div className="animate-spin rounded-full h-5 w-5 lg:h-6 lg:w-6 border-b-2 border-white"></div>
              </>
            ) : (
              <>
                <span role="img" aria-label="Fire" className="animate-bounce filter drop-shadow-lg">🔥</span>
                <span>{getButtonText()}</span>
                <span role="img" aria-label="Fire" className="animate-bounce filter drop-shadow-lg" style={{ animationDelay: '0.2s' }}>🔥</span>
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
          <div className="mt-3 text-sm text-gray-400 flex items-center justify-center gap-2 animate-slide-in">
            <span>{getHelpText()}</span>
          </div>
        )}
      </div>

    </div>
  );
};