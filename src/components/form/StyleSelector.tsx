/**
 * StyleSelector Component
 * 
 * Manages rage style selection with visual feedback and descriptions.
 * Provides clear indication of selected style and hover states.
 */

import React from 'react';
import { RageStyle } from '../../types/translation';

interface StyleOption {
  id: RageStyle;
  name: string;
  emoji: string;
  description: string;
  gradient: string;
  selectedGradient: string;
}

interface StyleSelectorProps {
  selectedStyle: RageStyle;
  onStyleSelect: (style: RageStyle) => void;
  isLoading: boolean;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'corporate',
    name: 'Corporate Meltdown',
    emoji: '💼',
    description: 'Professional fury',
    gradient: 'from-blue-600 to-blue-700',
    selectedGradient: 'from-blue-600 to-blue-700'
  },
  {
    id: 'gamer',
    name: 'Epic Gamer Rage',
    emoji: '🎮',
    description: 'CAPS LOCK FURY',
    gradient: 'from-green-600 to-green-700',
    selectedGradient: 'from-green-600 to-green-700'
  },
  {
    id: 'sarcastic',
    name: 'Sarcastic Roast',
    emoji: '😏',
    description: 'Witty destruction',
    gradient: 'from-purple-600 to-purple-700',
    selectedGradient: 'from-purple-600 to-purple-700'
  }
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
  isLoading
}) => {
  return (
    <div className="mb-8">
      <label className="block text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🎭</span>
        Choose your rage style:
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STYLE_OPTIONS.map((option) => (
          <button 
            key={option.id}
            onClick={() => onStyleSelect(option.id)}
            disabled={isLoading}
            className={`group relative py-6 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
              selectedStyle === option.id 
                ? `bg-gradient-to-r ${option.selectedGradient} text-white shadow-lg ring-4 ring-${option.id === 'corporate' ? 'blue' : option.id === 'gamer' ? 'green' : 'purple'}-300/50` 
                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600 shadow-md'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-pressed={selectedStyle === option.id}
            aria-label={`Select ${option.name} style`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl" role="img" aria-label={option.name}>
                {option.emoji}
              </span>
              <span>{option.name}</span>
              <span className="text-sm opacity-80 font-normal">{option.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};