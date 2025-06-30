/**
 * StyleSelector Component
 * 
 * Multi-persona anger translator selection with unique character voices.
 * Each persona has distinct emotional patterns and delivery styles.
 */

import React from 'react';
import { RageStyle } from '../../types/translation';

interface PersonaOption {
  id: RageStyle;
  name: string;
  emoji: string;
  description: string;
  style: string;
  color: string;
  glowColor: string;
}

interface StyleSelectorProps {
  selectedStyle: RageStyle;
  onStyleSelect: (style: RageStyle) => void;
  isLoading: boolean;
}

const PERSONA_OPTIONS: PersonaOption[] = [
  {
    id: 'enforcer',
    name: 'The Enforcer',
    emoji: '🔥',
    description: 'Luther-style righteous fury',
    style: 'Urban slang, preacher cadence',
    color: 'red',
    glowColor: 'rgba(239, 68, 68, 0.3)'
  },
  {
    id: 'highland-howler',
    name: 'The Highland Howler',
    emoji: '🧨',
    description: 'Explosive Scottish Dad',
    style: 'Chaotic pacing, wrench-wielding',
    color: 'orange',
    glowColor: 'rgba(251, 146, 60, 0.3)'
  },
  {
    id: 'don',
    name: 'The Don',
    emoji: '🍝',
    description: 'NY Italian-American Roastmaster',
    style: 'Streetwise threats, traffic fury',
    color: 'green',
    glowColor: 'rgba(34, 197, 94, 0.3)'
  },
  {
    id: 'cracked-controller',
    name: 'The Cracked Controller',
    emoji: '🎮',
    description: 'Gen-Z gamer meltdown',
    style: 'Panic bursts, rage-quit threats',
    color: 'purple',
    glowColor: 'rgba(147, 51, 234, 0.3)'
  },
  {
    id: 'karen',
    name: 'Karen',
    emoji: '👩‍🦱',
    description: 'Suburban entitlement rage',
    style: 'Polite-to-nuclear escalation',
    color: 'pink',
    glowColor: 'rgba(236, 72, 153, 0.3)'
  },
  {
    id: 'corporate',
    name: 'Corporate Meltdown',
    emoji: '💼',
    description: 'Professional fury',
    style: 'Passive-aggressive excellence',
    color: 'blue',
    glowColor: 'rgba(59, 130, 246, 0.3)'
  },
  {
    id: 'sarcastic',
    name: 'Sarcastic Roast',
    emoji: '😏',
    description: 'Witty destruction',
    style: 'Intellectual superiority',
    color: 'indigo',
    glowColor: 'rgba(99, 102, 241, 0.3)'
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
        Choose your anger persona:
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {PERSONA_OPTIONS.map((persona) => (
          <button 
            key={persona.id}
            onClick={() => onStyleSelect(persona.id)}
            disabled={isLoading}
            className={`group relative py-6 px-4 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
              selectedStyle === persona.id 
                ? `cyber-button selected text-${persona.color}-400 border-${persona.color}-500/80` 
                : 'cyber-button text-gray-300 hover:text-gray-100'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              boxShadow: selectedStyle === persona.id 
                ? `0 0 30px ${persona.glowColor}, inset 0 0 20px ${persona.glowColor}` 
                : undefined
            }}
            aria-pressed={selectedStyle === persona.id}
            aria-label={`Select ${persona.name} persona`}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-3xl filter drop-shadow-lg" role="img" aria-label={persona.name}>
                {persona.emoji}
              </span>
              <span className={`text-base ${selectedStyle === persona.id ? `neon-${persona.color}` : ''}`}>
                {persona.name}
              </span>
              <span className="text-xs opacity-80 font-normal leading-tight">
                {persona.description}
              </span>
              <span className="text-xs opacity-60 font-normal italic leading-tight">
                {persona.style}
              </span>
            </div>
            
            {/* Glow effect overlay */}
            {selectedStyle === persona.id && (
              <div 
                className="absolute inset-0 rounded-xl opacity-20 animate-pulse"
                style={{
                  background: `linear-gradient(45deg, ${persona.glowColor}, transparent)`
                }}
              />
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400 italic">
          Each persona has unique emotional patterns and delivery styles
        </p>
      </div>
    </div>
  );
};