/**
 * CircularRageMeter Component
 * 
 * Professional voice editor interface with circular gauge, emoji mascot,
 * and integrated translate button. Now with 1-10 scale for better usability.
 */

import React from 'react';
import { EmojiMascot } from './EmojiMascot';
import { AlertCircle } from 'lucide-react';

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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    if (level <= 2) return 'text-blue-400';
    if (level <= 4) return 'text-green-400';
    if (level <= 6) return 'text-yellow-400';
    if (level <= 8) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGaugeColor = (level: number) => {
    if (level <= 2) return '#3b82f6'; // blue
    if (level <= 4) return '#22c55e'; // green
    if (level <= 6) return '#eab308'; // yellow
    if (level <= 8) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getIntensityExamples = (level: number) => {
    const examples = {
      1: '"I wanted to follow up..." / "ugh, this is kinda annoying" / "how lovely..."',
      2: '"As mentioned..." / "come on, really?" / "that\'s just great"',
      3: '"As I stated previously..." / "what the heck?" / "how delightful"',
      4: '"This is the third time..." / "are you serious?" / "how precious"',
      5: '"I NEED this NOW!" / "WHAT is going on?!" / "OH how WONDERFUL"',
      6: '"THIS IS UNACCEPTABLE!" / "BRUH! This is INSANE!" / "OH MAGNIFICENT!"',
      7: '"I AM DONE!" / "WHAT THE HELL?!" / "absolutely SPECTACULAR!"',
      8: '"I\'VE HAD ENOUGH!" / "This is damn INSANE!" / "absolutely DIVINE!"',
      9: '"ABSOLUTELY LIVID!" / "This is complete SHIT!" / "absolutely EXQUISITE!"',
      10: '"FUCKING BULLSHIT!" / "LOSING MY GODDAMN MIND!" / "FUCKING PERFECT!"'
    };
    
    return examples[level as keyof typeof examples] || examples[5];
  };

  // Calculate percentage for the circular gauge
  const percentage = ((value - min) / (max - min)) * 100;
  const circumference = 2 * Math.PI * 90; // radius of 90
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
    <div className="flex flex-col items-center space-y-8">
      {/* Circular Gauge Container */}
      <div className="relative">
        {/* Background Circle */}
        <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 200 200">
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="rgba(71, 85, 105, 0.3)"
            strokeWidth="8"
            fill="transparent"
            className="drop-shadow-lg"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke={getGaugeColor(value)}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out drop-shadow-lg"
            style={{
              filter: `drop-shadow(0 0 8px ${getGaugeColor(value)}40)`
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
          <div className={`text-6xl font-black ${getRageLevelColor(value)} transition-colors duration-500 filter drop-shadow-lg`}>
            {value}
          </div>
          
          {/* Rage Description */}
          <div className={`text-lg font-bold ${getRageLevelColor(value)} transition-colors duration-500 text-center px-4`}>
            {getAuthenticRageDescription(value)}
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="w-full max-w-md space-y-6">
        {/* Slider */}
        <div className="flex items-center gap-4">
          <span className="text-2xl" role="img" aria-label="Calm">😊</span>
          <div className="flex-1 relative">
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full h-3 bg-gradient-to-r from-blue-300 via-green-300 via-yellow-300 via-orange-300 to-red-500 rounded-lg appearance-none cursor-pointer slider-modern shadow-lg"
              aria-label={`Rage level: ${value} out of ${max}`}
            />
          </div>
          <span className="text-2xl" role="img" aria-label="Furious">🤬</span>
        </div>

        {/* Scale Labels */}
        <div className="flex justify-between text-sm text-gray-400 font-medium px-2">
          <span className="text-blue-400">Meh, Chillin</span>
          <span className="text-red-400 font-bold">NUCLEAR RAGE</span>
        </div>

        {/* Examples */}
        <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500">Level {value} Examples:</p>
            {value >= 8 && (
              <span className="text-xs text-red-400 font-medium">⚠️ Strong Language</span>
            )}
          </div>
          <p className="text-sm text-gray-300 italic leading-relaxed">
            {getIntensityExamples(value)}
          </p>
        </div>
      </div>

      {/* Translate Button */}
      <div className="w-full max-w-md">
        <button 
          onClick={onTranslate}
          disabled={!isValid}
          className={`relative overflow-hidden font-black py-6 px-12 rounded-2xl text-2xl transition-all duration-300 transform w-full ${
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
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>{getButtonText()}</span>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
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
            <AlertCircle size={16} />
            <span>{getHelpText()}</span>
          </div>
        )}
      </div>
    </div>
  );
};