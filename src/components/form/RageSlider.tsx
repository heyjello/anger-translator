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

  const getRageLevelDescription = (level: number) => {
    if (level <= 3) return 'Mildly Annoyed';
    if (level <= 6) return 'Getting Heated';
    if (level <= 8) return 'Seriously Angry';
    return 'PURE RAGE';
  };

  const getRageLevelColor = (level: number) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    if (level <= 8) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="mb-8">
      <label className="block text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🌡️</span>
        Rage Level: 
        <span className={`font-black text-2xl ${getRageLevelColor(value)}`}>
          {value}
        </span>
        <span className={`text-lg font-semibold ${getRageLevelColor(value)}`}>
          ({getRageLevelDescription(value)})
        </span>
      </label>
      
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-xl shadow-inner">
        {/* Emoji Mascot */}
        <div className="flex justify-center mb-6">
          <EmojiMascot rageLevel={value} />
        </div>

        <div className="flex items-center gap-6">
          <span className="text-lg text-gray-600 font-medium" role="img" aria-label="Calm">
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
                className="w-full h-3 bg-gradient-to-r from-green-300 via-yellow-300 to-red-500 rounded-lg appearance-none cursor-pointer slider shadow-lg"
                aria-label={`Rage level: ${value} out of ${max}`}
              />
              {/* Number display positioned over the thumb */}
              <div 
                className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-white font-bold text-sm"
                style={{ left: `${((value - min) / (max - min)) * 100}%` }}
              >
                {value}
              </div>
            </div>
          </div>
          <span className="text-lg text-gray-600 font-medium" role="img" aria-label="Furious">
            🤬
          </span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-500 mt-6 font-medium">
          <span className="text-green-600">Zen Mode</span>
          <span className="text-red-600 font-bold">NUCLEAR MELTDOWN</span>
        </div>
      </div>
    </div>
  );
};