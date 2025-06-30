/**
 * CircularRageMeter Component
 * 
 * Voice editor style circular rage meter with integrated translate button.
 * Updated for 1-100 rage scale as specified in the persona engine.
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

  const getButtonText = () => {
    if (isLoading) return 'TRANSLATING...';
    if (isRateLimited) return `WAIT ${timeUntilNext}s`;
    return 'TRANSLATE RAGE';
  };

  const getRageDescription = (level: number) => {
    if (level <= 10) return 'Calm';
    if (level <= 20) return 'Annoyed';
    if (level <= 30) return 'Frustrated';
    if (level <= 40) return 'Angry';
    if (level <= 50) return 'Mad';
    if (level <= 60) return 'Furious';
    if (level <= 70) return 'Livid';
    if (level <= 80) return 'Explosive';
    if (level <= 90) return 'Nuclear';
    return 'APOCALYPTIC';
  };

  const getRageColor = (level: number) => {
    if (level <= 20) return '#3b82f6'; // Blue
    if (level <= 40) return '#22c55e'; // Green
    if (level <= 60) return '#eab308'; // Yellow
    if (level <= 80) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  // Convert 1-100 scale to emoji mascot's 1-10 scale
  const getMascotLevel = (level: number) => {
    return Math.ceil(level / 10);
  };

  // Calculate circle properties
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Circular Meter */}
      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
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
            stroke={getRageColor(value)}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
            style={{
              filter: `drop-shadow(0 0 10px ${getRageColor(value)}40)`
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-2">
            <EmojiMascot rageLevel={getMascotLevel(value)} />
          </div>
          <div className="text-3xl font-black text-white" style={{ color: getRageColor(value) }}>
            {value}
          </div>
          <div className="text-sm font-medium text-gray-300">
            {getRageDescription(value)}
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="w-full max-w-xs">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-modern"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #22c55e 25%, #eab308 50%, #f97316 75%, #ef4444 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Calm</span>
          <span>NUCLEAR</span>
        </div>
      </div>

      {/* Translate Button */}
      <button
        onClick={onTranslate}
        disabled={!isValid || isLoading || isRateLimited}
        className={`relative overflow-hidden font-black py-4 px-8 rounded-xl text-lg transition-all duration-300 transform ${
          !isValid || isRateLimited
            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed scale-95'
            : `bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white hover:scale-105 active:scale-95 ${
                isLoading ? 'animate-pulse' : 'animate-button-pulse hover-fire'
              }`
        }`}
        style={{
          boxShadow: isValid && !isRateLimited
            ? '0 0 30px rgba(239, 68, 68, 0.4), 0 8px 20px rgba(220, 38, 38, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>{getButtonText()}</span>
            </>
          ) : (
            <>
              <span role="img" aria-label="Fire" className="animate-bounce">🔥</span>
              <span>{getButtonText()}</span>
              <span role="img" aria-label="Fire" className="animate-bounce" style={{ animationDelay: '0.2s' }}>🔥</span>
            </>
          )}
        </div>
      </button>

      {/* Validation Message */}
      {validationMessage && !isValid && (
        <div className="text-sm text-gray-400 text-center">
          {validationMessage}
        </div>
      )}
    </div>
  );
};