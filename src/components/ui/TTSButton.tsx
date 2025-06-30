/**
 * TTSButton Component
 * 
 * Text-to-Speech button with integrated bleep support.
 * Automatically handles both regular and censored audio playback.
 */

import React from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { cn } from '../../lib/utils';

interface TTSButtonProps {
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
        return 'px-2 py-1 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-3 py-2';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border border-blue-500/50 text-blue-400 hover:bg-blue-500/10';
      case 'ghost':
        return 'text-blue-400 hover:bg-blue-500/10';
      default:
        return 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/50';
    }
  };

  if (!isAvailable) {
    return (
      <button
        disabled
        className={cn(
          'flex items-center gap-2 rounded-lg font-medium transition-all duration-300',
          getSizeClasses(),
          'bg-gray-500/20 text-gray-500 cursor-not-allowed border border-gray-500/30',
          className
        )}
        title="Text-to-speech not available"
      >
        <VolumeX size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        <span>TTS Unavailable</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleClick}
        disabled={disabled || isLoading || !text.trim()}
        className={cn(
          'flex items-center gap-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105',
          getSizeClasses(),
          getVariantClasses(),
          'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
          (disabled || isLoading || !text.trim()) && 'opacity-50 cursor-not-allowed hover:scale-100',
          className
        )}
        aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
      >
        {isLoading ? (
          <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-spin" />
        ) : (
          <Volume2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        )}
        <span>Listen</span>
      </button>
      
      {error && (
        <div className="text-xs text-red-400 max-w-32 truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  );
};