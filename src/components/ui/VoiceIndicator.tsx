/**
 * VoiceIndicator Component
 * 
 * Displays voice information for text-to-speech functionality.
 * Shows the selected voice and its characteristics for each rage style.
 */

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceIndicatorProps {
  style: string;
  intensity?: number;
  className?: string;
}

// Voice configuration for each style
const VOICE_CONFIGS = {
  corporate: {
    name: "Adam",
    description: "Professional, authoritative voice",
    accent: "American",
    gender: "Male"
  },
  gamer: {
    name: "Antoni", 
    description: "Energetic, youthful voice",
    accent: "American",
    gender: "Male"
  },
  sarcastic: {
    name: "Daniel",
    description: "Sophisticated British accent",
    accent: "British", 
    gender: "Male"
  },
  karen: {
    name: "Karen",
    description: "Entitled suburban mom voice",
    accent: "American",
    gender: "Female"
  },
  'scottish-dad': {
    name: "Hamish",
    description: "Furious Glaswegian father",
    accent: "Scottish",
    gender: "Male"
  }
} as const;

// Fallback voice config
const DEFAULT_VOICE = {
  name: "Default",
  description: "Standard voice",
  accent: "Neutral",
  gender: "Neutral"
};

export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({
  style,
  intensity = 5,
  className = ''
}) => {
  // Get voice config with null safety
  const voiceConfig = VOICE_CONFIGS[style as keyof typeof VOICE_CONFIGS] || DEFAULT_VOICE;
  
  // Check if TTS is available (simplified check)
  const isTTSAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const getIntensityDescription = (level: number): string => {
    if (level <= 2) return 'Calm delivery';
    if (level <= 4) return 'Slightly animated';
    if (level <= 6) return 'Moderately intense';
    if (level <= 8) return 'Very animated';
    return 'Maximum intensity';
  };

  const getVoiceEmoji = (style: string): string => {
    switch (style) {
      case 'corporate': return '💼';
      case 'gamer': return '🎮';
      case 'sarcastic': return '😏';
      case 'karen': return '💇‍♀️';
      case 'scottish-dad': return '🏴󠁧󠁢󠁳󠁣󠁴󠁿';
      default: return '🎤';
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-gray-100">
        {isTTSAvailable ? (
          <Volume2 size={20} className="text-blue-400" />
        ) : (
          <VolumeX size={20} className="text-gray-500" />
        )}
        <span className="text-lg font-semibold">Voice Preview</span>
      </div>

      <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50 min-w-[200px]">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl" role="img" aria-label={`${style} voice`}>
            {getVoiceEmoji(style)}
          </span>
          <div>
            <div className="font-bold text-gray-100">{voiceConfig.name}</div>
            <div className="text-sm text-gray-400">{voiceConfig.accent} • {voiceConfig.gender}</div>
          </div>
        </div>
        
        <div className="text-sm text-gray-300 mb-2">
          {voiceConfig.description}
        </div>
        
        <div className="text-xs text-gray-500">
          {getIntensityDescription(intensity)}
        </div>
      </div>

      {!isTTSAvailable && (
        <div className="text-xs text-gray-500 text-center">
          Text-to-speech not available
        </div>
      )}
    </div>
  );
};