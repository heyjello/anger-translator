/**
 * Text-to-Speech Button Component
 * 
 * Provides audio playback functionality for translated text using ElevenLabs.
 * Integrates with the translation style and rage level for appropriate voice synthesis.
 */

import React from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { cn } from '../../lib/utils';

export interface TTSButtonProps {
  text: string;
  style?: string;
  rageLevel?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
}

export const TTSButton: React.FC<TTSButtonProps> = ({
  text,
  style = 'corporate',
  rageLevel = 5,
  size = 'md',
  variant = 'default',
  className,
  disabled = false
}) => {
  const { speak, isLoading, isPlaying, error, isAvailable, stop, clearError } = useTextToSpeech();

  // Don't render if TTS is not available
  if (!isAvailable) {
    return null;
  }

  const handleClick = async () => {
    if (isPlaying) {
      stop();
    } else if (text.trim()) {
      clearError();
      await speak(text, style, rageLevel);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-1.5 text-sm';
      case 'lg':
        return 'p-3 text-lg';
      default:
        return 'p-2 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border border-gray-500/30 hover:border-blue-500/50 bg-transparent hover:bg-blue-500/10';
      case 'ghost':
        return 'bg-transparent hover:bg-blue-500/10';
      default:
        return 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50';
    }
  };

  const buttonClasses = cn(
    'flex items-center gap-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105',
    'text-blue-400 hover:text-blue-300',
    'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    getSizeClasses(),
    getVariantClasses(),
    className
  );

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 size={16} className="animate-spin" />;
    }
    if (isPlaying) {
      return <VolumeX size={16} />;
    }
    return <Volume2 size={16} />;
  };

  const getButtonText = () => {
    if (isLoading) return 'Generating...';
    if (isPlaying) return 'Stop';
    return 'Listen';
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleClick}
        disabled={disabled || isLoading || !text.trim()}
        className={buttonClasses}
        aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
        title={`Listen to translation with ${style} voice at rage level ${rageLevel}`}
      >
        {getIcon()}
        <span>{getButtonText()}</span>
      </button>
      
      {/* Error Display */}
      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded px-2 py-1 animate-slide-in">
          {error}
        </div>
      )}
    </div>
  );
};

export default TTSButton;