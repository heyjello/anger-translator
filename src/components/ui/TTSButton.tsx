/**
 * Text-to-Speech Button Component
 * 
 * Interactive button for triggering text-to-speech with visual feedback
 * and loading states. Integrates with ElevenLabs service.
 */

import React from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

interface TTSButtonProps {
  text: string;
  style?: string;
  rageLevel?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export const TTSButton: React.FC<TTSButtonProps> = ({
  text,
  style = 'default',
  rageLevel = 5,
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  const { speak, isLoading, isPlaying, error, isAvailable, stop, clearError } = useTextToSpeech();

  const handleClick = async () => {
    if (isPlaying) {
      stop();
    } else {
      clearError();
      await speak(text, style, rageLevel);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-2 text-sm';
      case 'lg':
        return 'p-4 text-lg';
      default:
        return 'p-3 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/70';
      case 'ghost':
        return 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10';
      default:
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30 hover:border-blue-500/70';
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} className="animate-spin" />;
    }
    if (isPlaying) {
      return <VolumeX size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
    }
    return <Volume2 size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
  };

  const getTooltip = () => {
    if (!isAvailable) return 'Text-to-speech not configured';
    if (isLoading) return 'Generating speech...';
    if (isPlaying) return 'Stop playback';
    if (error) return `Error: ${error}`;
    return 'Listen to translation';
  };

  if (!isAvailable) {
    return null; // Hide button if TTS is not available
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isLoading || !text.trim()}
        className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          rounded-lg font-medium transition-all duration-300 transform hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          flex items-center gap-2
          ${isPlaying ? 'animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.4)]' : ''}
          ${className}
        `}
        title={getTooltip()}
        aria-label={getTooltip()}
      >
        {getIcon()}
        {size !== 'sm' && (
          <span>
            {isLoading ? 'Generating...' : isPlaying ? 'Stop' : 'Listen'}
          </span>
        )}
      </button>

      {/* Error display */}
      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
};