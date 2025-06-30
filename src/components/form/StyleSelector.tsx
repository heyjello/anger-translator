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
  color: string;
  glowColor: string;
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
    color: 'blue',
    glowColor: 'rgba(59, 130, 246, 0.3)'
  },
  {
    id: 'gamer',
    name: 'Gamer Rage Translator',
    emoji: '🎮',
    description: 'Gen-Z gamer meltdown',
    color: 'green',
    glowColor: 'rgba(34, 197, 94, 0.3)'
  },
  {
    id: 'sarcastic',
    name: 'Sarcastic Roast',
    emoji: '😏',
    description: 'Witty destruction',
    color: 'purple',
    glowColor: 'rgba(147, 51, 234, 0.3)'
  },
  {
    id: 'karen',
    name: 'Karen Translator',
    emoji: '💇‍♀️',
    description: 'Suburban entitlement',
    color: 'pink',
    glowColor: 'rgba(236, 72, 153, 0.3)'
  },
  {
    id: 'scottish-dad',
    name: 'Scottish Dad',
    emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    description: 'Glaswegian chaos',
    color: 'orange',
    glowColor: 'rgba(251, 146, 60, 0.3)'
  },
  {
    id: 'ny-italian',
    name: 'NY Italian',
    emoji: '🤌',
    description: 'Fuggedaboutit fury',
    color: 'red',
    glowColor: 'rgba(239, 68, 68, 0.3)'
  }
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
  isLoading
}) => {
  return (
    <div className="mb-8">
      <label className="block text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
        <span className="text-2xl">🎭</span>
        Choose your rage style:
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STYLE_OPTIONS.map((option) => (
          <button 
            key={option.id}
            onClick={() => onStyleSelect(option.id)}
            disabled={isLoading}
            className={`group relative py-6 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
              selectedStyle === option.id 
                ? `cyber-button selected text-${option.color}-400 border-${option.color}-500/80` 
                : 'cyber-button text-gray-300 hover:text-gray-100'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              boxShadow: selectedStyle === option.id 
                ? `0 0 30px ${option.glowColor}, inset 0 0 20px ${option.glowColor}` 
                : undefined
            }}
            aria-pressed={selectedStyle === option.id}
            aria-label={`Select ${option.name} style`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl filter drop-shadow-lg" role="img" aria-label={option.name}>
                {option.emoji}
              </span>
              <span className={selectedStyle === option.id ? `neon-${option.color}` : ''}>{option.name}</span>
              <span className="text-sm opacity-80 font-normal">{option.description}</span>
            </div>
            
            {/* Glow effect overlay */}
            {selectedStyle === option.id && (
              <div 
                className="absolute inset-0 rounded-xl opacity-20 animate-pulse"
                style={{
                  background: `linear-gradient(45deg, ${option.glowColor}, transparent)`
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};