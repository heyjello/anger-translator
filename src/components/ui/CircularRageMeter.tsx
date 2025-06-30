/**
 * CircularRageMeter Component
 * 
 * Professional circular rage meter with emoji inside the gauge and 1-10 scale.
 * Voice editor style interface with centered emoji and clean typography.
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
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    onChange(newValue);
  };

  const getAuthenticRageDescription = (level: number) => {
    if (level <= 2) return 'Meh, Chillin';
    if (level <= 4) return 'Slightly Annoyed';
    if (level <= 6) return 'Pretty Angry';
    if (level <= 8) return 'Seriously Pissed';
    return 'NUCLEAR RAGE';
  };

  const getRageLevelColor = (level: number) => {
    if (level <= 2) return 'text-blue-400 neon-blue';
    if (level <= 4) return 'text-green-400 neon-green';
    if (level <= 6) return 'text-yellow-400 neon-yellow';
    if (level <= 8) return 'text-orange-400 neon-orange';
    return 'text-red-400 neon-red';
  };

  const getCircleColor = (level: number) => {
    if (level <= 2) return '#3b82f6'; // blue
    if (level <= 4) return '#22c55e'; // green
    if (level <= 6) return '#eab308'; // yellow
    if (level <= 8) return '#f97316'; // orange
    return '#ef4444'; // red
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

  // Calculate progress for the circular gauge (0-100%)
  const progress = ((value - 1) / 9) * 100; // Convert 1-10 to 0-100%
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-8">
      
      {/* Circular Gauge with Emoji Inside */}
      <div className="relative">
        <svg width="280" height="280" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="rgba(71, 85, 105, 0.3)"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke={getCircleColor(value)}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
            style={{
              filter: `drop-shadow(0 0 10px ${getCircleColor(value)}40)`
            }}
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Emoji Mascot */}
          <div className="mb-2">
            <EmojiMascot rageLevel={value} />
          </div>
          
          {/* Rage Level Number */}
          <div className={`text-6xl font-black ${getRageLevelColor(value)} filter drop-shadow-lg`}>
            {value}
          </div>
          
          {/* Description */}
          <div className={`text-sm font-semibold ${getRageLevelColor(value)} text-center px-4 mt-1`}>
            {getAuthenticRageDescription(value)}
          </div>
        </div>
      </div>

      {/* Range Slider */}
      <div className="w-full max-w-xs">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={handleSliderChange}
          disabled={isLoading}
          className="w-full h-3 bg-gradient-to-r from-blue-300 via-green-300 via-yellow-300 via-orange-300 to-red-500 rounded-lg appearance-none cursor-pointer slider-modern shadow-lg"
          aria-label={`Rage level: ${value} out of 10`}
        />
        
        {/* Slider Labels */}
        <div className="flex justify-between text-sm text-gray-400 mt-2 font-medium">
          <span className="neon-blue">Chill</span>
          <span className="neon-red font-bold">NUCLEAR</span>
        </div>
      </div>

      {/* Translate Button */}
      <button 
        onClick={onTranslate}
        disabled={!isValid}
        className={`relative overflow-hidden font-black py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform ${
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
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>{getButtonText()}</span>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
        <div className="text-sm text-gray-400 flex items-center justify-center gap-2 animate-slide-in text-center">
          <span>{getHelpText()}</span>
        </div>
      )}
    </div>
  );
};