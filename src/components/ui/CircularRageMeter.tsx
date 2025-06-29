/**
 * CircularRageMeter Component
 * 
 * Voice editor-inspired circular rage meter with integrated translate button.
 * Features a sleek circular progress indicator with dynamic colors and animations.
 */

import React from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { EmojiMascot } from './EmojiMascot';

interface CircularRageMeterProps {
  value: number;
  onChange: (value: number) => void;
  isLoading: boolean;
  onTranslate: () => void;
  isValid: boolean;
  isRateLimited: boolean;
  timeUntilNext?: number;
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
  timeUntilNext = 0,
  validationMessage,
  min = 1,
  max = 10
}) => {
  const radius = 120;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const progress = ((value - min) / (max - min)) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Get color based on rage level
  const getRageColor = (level: number) => {
    if (level <= 2) return '#3b82f6'; // Blue
    if (level <= 4) return '#22c55e'; // Green
    if (level <= 6) return '#eab308'; // Yellow
    if (level <= 8) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getRageDescription = (level: number) => {
    switch (level) {
      case 1: return 'Meh, Chillin';
      case 2: return 'Slightly Annoyed';
      case 3: return 'Getting Irritated';
      case 4: return 'Clearly Frustrated';
      case 5: return 'Pretty Angry';
      case 6: return 'Really Mad';
      case 7: return 'Seriously Pissed';
      case 8: return 'Extremely Angry';
      case 9: return 'Absolutely Furious';
      case 10: return 'NUCLEAR RAGE';
      default: return 'Pretty Angry';
    }
  };

  const currentColor = getRageColor(value);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    onChange(newValue);
  };

  const getButtonText = () => {
    if (isLoading) return 'TRANSLATING...';
    return 'TRANSLATE';
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      
      {/* Circular Progress Ring */}
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="#1e293b"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="opacity-30"
          />
          
          {/* Progress circle */}
          <circle
            stroke={currentColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            style={{ 
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.3s ease-in-out, stroke 0.3s ease-in-out'
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="drop-shadow-lg"
            style={{
              ...{
                strokeDashoffset,
                transition: 'stroke-dashoffset 0.3s ease-in-out, stroke 0.3s ease-in-out'
              },
              filter: `drop-shadow(0 0 8px ${currentColor}40)`
            }}
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          
          {/* Emoji Mascot */}
          <div className="mb-2">
            <EmojiMascot rageLevel={value} />
          </div>
          
          {/* Rage Level Display */}
          <div className="text-center">
            <div 
              className="text-4xl font-black mb-1"
              style={{ color: currentColor }}
            >
              {value}
            </div>
            <div 
              className="text-sm font-semibold opacity-90"
              style={{ color: currentColor }}
            >
              {getRageDescription(value)}
            </div>
          </div>
          
        </div>
      </div>

      {/* Rage Level Slider */}
      <div className="w-full max-w-xs">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleSliderChange}
          disabled={isLoading}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-modern"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #22c55e 25%, #eab308 50%, #f97316 75%, #ef4444 100%)`
          }}
          aria-label={`Rage level: ${value} out of ${max}`}
        />
        
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>Chill</span>
          <span>NUCLEAR</span>
        </div>
      </div>

      {/* Translate Button */}
      <button 
        onClick={onTranslate}
        disabled={!isValid}
        className={`relative overflow-hidden font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform flex items-center gap-3 ${
          !isValid
            ? 'bg-slate-600/50 text-slate-400 cursor-not-allowed scale-95'
            : `text-white hover:scale-105 active:scale-95 shadow-lg ${
                isLoading ? 'animate-pulse' : 'hover:shadow-xl'
              }`
        }`}
        style={{
          backgroundColor: isValid ? currentColor : undefined,
          boxShadow: isValid 
            ? `0 0 30px ${currentColor}40, 0 10px 25px rgba(0, 0, 0, 0.3)` 
            : '0 5px 15px rgba(0, 0, 0, 0.2)'
        }}
        aria-label={isLoading ? 'Translation in progress' : 'Start translation'}
      >
        <div className="relative z-10 flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>{getButtonText()}</span>
            </>
          ) : (
            <>
              <Volume2 size={20} className="animate-pulse" />
              <span>{getButtonText()}</span>
              <Play size={20} className="animate-pulse" />
            </>
          )}
        </div>
        
        {/* Animated background effects */}
        {isValid && !isLoading && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 animate-pulse"
            style={{ animationDelay: '0.5s' }}
          ></div>
        )}
      </button>

      {/* Validation Message */}
      {!isValid && !isLoading && validationMessage && (
        <div className="text-sm text-slate-400 text-center max-w-xs">
          {validationMessage}
        </div>
      )}

      {/* Rate Limit Message */}
      {isRateLimited && (
        <div className="text-sm text-orange-400 text-center max-w-xs">
          Rate limited - wait {timeUntilNext}s
        </div>
      )}

    </div>
  );
};