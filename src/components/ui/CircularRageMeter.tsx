/**
 * CircularRageMeter Component
 * 
 * Professional circular rage meter with proper text positioning to avoid overlap.
 */

import React from 'react';
import { EmojiMascot } from './EmojiMascot';

interface CircularRageMeterProps {
  value: number;
  onChange: (value: number) => void;
  isLoading: boolean;
  onTranslate: () => void;
  isValid: boolean;
  isRateLimited: boolean;
  timeUntilNext: number;
  validationMessage?: string;
  min?: number;
  max?: number;
}

export const CircularRageMeter: React.FC<CircularRageMeterProps> = ({
  value,
  onChange,
  isLoading,
  onTranslate,
  isValid,
  isRateLimited,
  timeUntilNext,
  validationMessage,
  min = 1,
  max = 100
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    onChange(newValue);
  };

  const getAuthenticRageDescription = (level: number) => {
    if (level <= 10) return 'Meh, Chillin';
    if (level <= 20) return 'Slightly Annoyed';
    if (level <= 30) return 'Getting Irritated';
    if (level <= 40) return 'Clearly Frustrated';
    if (level <= 50) return 'Pretty Angry';
    if (level <= 60) return 'Really Mad';
    if (level <= 70) return 'Seriously Pissed';
    if (level <= 80) return 'Extremely Angry';
    if (level <= 90) return 'Absolutely Furious';
    return 'NUCLEAR RAGE';
  };

  const getRageLevelColor = (level: number) => {
    if (level <= 20) return 'text-blue-400 neon-blue';
    if (level <= 40) return 'text-green-400 neon-green';
    if (level <= 60) return 'text-yellow-400 neon-yellow';
    if (level <= 80) return 'text-orange-400 neon-orange';
    return 'text-red-400 neon-red';
  };

  const getCircleColor = (level: number) => {
    if (level <= 20) return '#3b82f6'; // blue
    if (level <= 40) return '#22c55e'; // green
    if (level <= 60) return '#eab308'; // yellow
    if (level <= 80) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  // Calculate circle properties
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / max) * circumference;

  // Convert 1-100 scale to emoji mascot's 1-10 scale
  const getMascotLevel = (level: number) => {
    return Math.ceil(level / 10);
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

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Emoji Mascot - Above the meter */}
      <div className="mb-4">
        <EmojiMascot rageLevel={getMascotLevel(value)} />
      </div>

      {/* Circular Gauge Container */}
      <div className="relative flex items-center justify-center">
        {/* SVG Circular Progress */}
        <svg 
          width="280" 
          height="280" 
          className="transform -rotate-90"
          viewBox="0 0 280 280"
        >
          {/* Background Circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="rgba(71, 85, 105, 0.3)"
            strokeWidth="8"
            fill="none"
          />
          
          {/* Progress Circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke={getCircleColor(value)}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
            style={{
              filter: `drop-shadow(0 0 10px ${getCircleColor(value)}40)`
            }}
          />
        </svg>

        {/* Center Content - Absolutely positioned in the center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Rage Level Number */}
          <div className={`text-6xl font-black mb-2 ${getRageLevelColor(value)}`}>
            {value}
          </div>
          
          {/* Rage Description - Positioned below number, within circle */}
          <div className={`text-sm font-bold text-center px-4 ${getRageLevelColor(value)}`}>
            {getAuthenticRageDescription(value)}
          </div>
        </div>
      </div>

      {/* Range Slider - Below the circular gauge */}
      <div className="w-full max-w-xs">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full h-2 bg-gradient-to-r from-blue-300 via-green-300 via-yellow-300 via-orange-300 to-red-500 rounded-lg appearance-none cursor-pointer slider-modern"
          aria-label={`Rage level: ${value} out of ${max}`}
        />
        
        {/* Slider Labels */}
        <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
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

      {/* Button Help Text - Below everything */}
      {!isValid && !isLoading && (
        <div className="text-sm text-gray-400 flex items-center justify-center gap-2 animate-slide-in text-center">
          <span>{getHelpText()}</span>
        </div>
      )}
    </div>
  );
};