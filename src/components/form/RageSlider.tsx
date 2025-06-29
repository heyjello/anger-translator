/**
 * RageSlider Component
 * 
 * Interactive rage level slider with visual indicators, descriptive labels,
 * emoji mascot integration, and number display inside the slider thumb.
 */

import React from 'react';
import { EmojiMascot } from '../ui/EmojiMascot';

interface RageSliderProps {
  value: number;
  onChange: (value: number) => void;
  isLoading: boolean;
  min?: number;
  max?: number;
}

export const RageSlider: React.FC<RageSliderProps> = ({
  value,
  onChange,
  isLoading,
  min = 1,
  max = 10
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    onChange(newValue);
  };

  const getAuthenticRageDescription = (level: number) => {
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

  const getRageLevelColor = (level: number) => {
    if (level <= 2) return 'text-blue-400 neon-blue';
    if (level <= 4) return 'text-green-400 neon-green';
    if (level <= 6) return 'text-yellow-400 neon-yellow';
    if (level <= 8) return 'text-orange-400 neon-orange';
    return 'text-red-400 neon-red';
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

  return (
    <div className="mb-8">
      <label className="block text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
        <span className="text-2xl">🌡️</span>
        Rage Level: 
        <span className={`font-black text-2xl ${getRageLevelColor(value)}`}>
          {value}
        </span>
        <span className={`text-lg font-semibold ${getRageLevelColor(value)}`}>
          ({getAuthenticRageDescription(value)})
        </span>
      </label>
      
      <div className="cyber-card p-6 rounded-xl border border-[#1e293b] hover:border-blue-500/30 transition-all duration-300">
        {/* Emoji Mascot */}
        <div className="flex justify-center mb-6">
          <EmojiMascot rageLevel={value} />
        </div>

        <div className="flex items-center gap-6">
          <span className="text-lg text-gray-400 font-medium filter drop-shadow-lg" role="img" aria-label="Calm">
            😊
          </span>
          <div className="flex-1 relative">
            {/* Custom slider with number inside thumb */}
            <div className="relative">
              <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full h-3 bg-gradient-to-r from-blue-300 via-green-300 via-yellow-300 via-orange-300 to-red-500 rounded-lg appearance-none cursor-pointer slider shadow-lg"
                aria-label={`Rage level: ${value} out of ${max}`}
              />
              {/* Number display positioned over the thumb */}
              <div 
                className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-white font-bold text-sm filter drop-shadow-lg"
                style={{ left: `${((value - min) / (max - min)) * 100}%` }}
              >
                {value}
              </div>
            </div>
          </div>
          <span className="text-lg text-gray-400 font-medium filter drop-shadow-lg" role="img" aria-label="Furious">
            🤬
          </span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-400 mt-6 font-medium">
          <span className="neon-blue">Meh, Chillin</span>
          <span className="neon-red font-bold">NUCLEAR RAGE</span>
        </div>

        {/* Authentic Examples with Profanity Warning */}
        <div className="mt-4 p-3 bg-[#0a0f1b]/50 rounded-lg border border-[#1e293b]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">Level {value} Examples:</p>
            {value >= 8 && (
              <span className="text-xs text-red-400 font-medium">⚠️ Strong Language</span>
            )}
          </div>
          <p className="text-sm text-gray-300 italic">
            {getIntensityExamples(value)}
          </p>
        </div>
      </div>
    </div>
  );
};