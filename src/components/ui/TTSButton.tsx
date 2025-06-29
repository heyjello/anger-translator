/**
 * Text-to-Speech Button Component
 * 
 * Provides audio playback functionality for translated text using ElevenLabs.
 * Integrates with the voice configuration system for style-specific voices.
 */

import React from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { cn } from '../../lib/utils';

export interface TTSButtonProps {
  text: string;
  style?: 'corporate' | 'gamer' | 'sarcastic';
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

  const handleSpeak = async () => {
    try {
      if (isPlaying) {
        stop();
        return;
      }

      clearError();
      
      // Pass style and intensity to the speech generation
      await speak(text, style, rageLevel);
    } catch (error) {
      console.error('Speech failed:', error);
    }
  };

  // Don't render if TTS is not available
  if (!isAvailable) {
    return null;
  }

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const variantClasses = {
    default: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/30 hover:border-blue-500/50',
    outline: 'border-2 border-gray-500/30 text-gray-400 hover:border-blue-500/50 hover:text-blue-400',
    ghost: 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10'
  };

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 20
  }[size];

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleSpeak}
        disabled={disabled || isLoading}
        className={cn(
          'flex items-center justify-center rounded-lg font-medium transition-all duration-300 transform hover:scale-105 border',
          sizeClasses[size],
          variantClasses[variant],
          'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        title={isPlaying ? 'Stop speech' : 'Listen to translation'}
        aria-label={isPlaying ? 'Stop speech' : 'Listen to translation'}
      >
        {isLoading ? (
          <Loader2 size={iconSize} className="animate-spin" />
        ) : isPlaying ? (
          <VolumeX size={iconSize} />
        ) : (
          <Volume2 size={iconSize} />
        )}
      </button>
      
      {error && (
        <div className="text-xs text-red-400 max-w-32 text-center">
          {error}
        </div>
      )}
    </div>
  );
};