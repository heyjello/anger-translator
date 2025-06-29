/**
 * TTSButton Component
 * 
 * Text-to-Speech button that integrates with ElevenLabs service.
 * Provides audio playback of translated text with style-specific voices.
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
      case 'sm': return 'p-1.5';
      case 'lg': return 'p-3';
      default: return 'p-2';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border border-gray-500/50 hover:border-blue-500/50 bg-transparent hover:bg-blue-500/10';
      case 'ghost':
        return 'hover:bg-gray-500/10';
      default:
        return 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 14;
      case 'lg': return 20;
      default: return 16;
    }
  };

  // Don't render if TTS is not available
  if (!isAvailable) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled || isLoading || !text.trim()}
        className={cn(
          'flex items-center gap-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105',
          getSizeClasses(),
          getVariantClasses(),
          isPlaying ? 'text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'text-blue-400',
          (disabled || isLoading || !text.trim()) && 'opacity-50 cursor-not-allowed',
          className
        )}
        aria-label={isPlaying ? 'Stop speech' : 'Play speech'}
        title={isPlaying ? 'Stop speech' : `Listen to translation (${style} voice)`}
      >
        {isLoading ? (
          <Loader2 size={getIconSize()} className="animate-spin" />
        ) : isPlaying ? (
          <VolumeX size={getIconSize()} />
        ) : (
          <Volume2 size={getIconSize()} />
        )}
        
        {size !== 'sm' && (
          <span className="text-sm">
            {isLoading ? 'Generating...' : isPlaying ? 'Stop' : 'Listen'}
          </span>
        )}
      </button>

      {/* Error tooltip */}
      {error && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-red-500/90 text-white text-xs rounded-lg whitespace-nowrap z-50">
          {error}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500/90"></div>
        </div>
      )}
    </div>
  );
};