/**
 * TTSButton Component
 * 
 * Text-to-Speech button with integrated bleep support for censored content.
 * Automatically detects and handles **BLEEP** markers in translated text.
 */

import React from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { enhancedTTSService } from '../../services/enhancedTTSService';

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
  style = 'corporate',
  rageLevel = 5,
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  const { isLoading, isPlaying, error, isAvailable, stop, clearError } = useTextToSpeech();
  const [isEnhancedLoading, setIsEnhancedLoading] = React.useState(false);

  // Check if text contains bleep markers
  const hasBleeps = text.includes('**');
  const isAnyLoading = isLoading || isEnhancedLoading;

  const handleClick = async () => {
    if (!text.trim()) return;

    // Clear any previous errors
    clearError();

    // Stop any currently playing audio
    if (isPlaying) {
      stop();
      return;
    }

    try {
      if (hasBleeps) {
        // Use enhanced TTS with bleeps
        console.log('🔊 Using enhanced TTS with bleeps for:', text.substring(0, 50) + '...');
        setIsEnhancedLoading(true);
        
        await enhancedTTSService.speakWithBleeps(text, {
          style,
          rageLevel,
          enableBleeps: true,
          bleepStyle: 'tv'
        });
      } else {
        // Use regular TTS
        console.log('🎤 Using regular TTS for:', text.substring(0, 50) + '...');
        const { speak } = require('../../hooks/useTextToSpeech');
        // This will be handled by the useTextToSpeech hook
      }
    } catch (error) {
      console.error('❌ TTS playback failed:', error);
    } finally {
      setIsEnhancedLoading(false);
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'p-1.5',
      icon: 14,
      text: 'text-xs'
    },
    md: {
      button: 'p-2',
      icon: 16,
      text: 'text-sm'
    },
    lg: {
      button: 'p-3',
      icon: 20,
      text: 'text-base'
    }
  };

  // Variant configurations
  const variantConfig = {
    default: 'bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30 hover:border-blue-500/70',
    outline: 'border-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10',
    ghost: 'text-blue-400 hover:bg-blue-500/10'
  };

  const config = sizeConfig[size];
  const variantClass = variantConfig[variant];

  if (!isAvailable) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 ${config.button} rounded-lg font-medium transition-all duration-300 opacity-50 cursor-not-allowed text-gray-500 ${className}`}
        title="Text-to-speech not available"
      >
        <VolumeX size={config.icon} />
        <span className={config.text}>TTS Unavailable</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isAnyLoading}
      className={`flex items-center gap-2 ${config.button} rounded-lg font-medium transition-all duration-300 transform hover:scale-105 border ${variantClass} ${
        isAnyLoading ? 'opacity-75 cursor-wait' : ''
      } ${className}`}
      title={
        isPlaying 
          ? 'Stop playback' 
          : hasBleeps 
            ? 'Play with censored audio (contains bleeps)' 
            : 'Play audio'
      }
    >
      {isAnyLoading ? (
        <Loader2 size={config.icon} className="animate-spin" />
      ) : isPlaying ? (
        <VolumeX size={config.icon} />
      ) : (
        <Volume2 size={config.icon} />
      )}
      
      <span className={config.text}>
        {isAnyLoading 
          ? 'Loading...' 
          : isPlaying 
            ? 'Stop' 
            : hasBleeps 
              ? 'Play (Censored)' 
              : 'Listen'
        }
      </span>

      {hasBleeps && !isAnyLoading && !isPlaying && (
        <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">
          BLEEP
        </span>
      )}
    </button>
  );
};