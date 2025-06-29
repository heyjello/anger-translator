/**
 * Enhanced TTSButton Component
 * 
 * Updated to support bleep sound effects for censored content.
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { useBleepSound } from '../../hooks/useBleepSound';
import { enhancedTTSService } from '../../services/enhancedTTSService';

interface TTSButtonProps {
  text: string;
  style?: string;
  rageLevel?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'icon' | 'enhanced';
  enableBleeps?: boolean;
  bleepStyle?: 'tv' | 'radio' | 'harsh' | 'gentle';
  className?: string;
}

export const TTSButton: React.FC<TTSButtonProps> = ({
  text,
  style = 'corporate',
  rageLevel = 5,
  size = 'md',
  variant = 'default',
  enableBleeps = true,
  bleepStyle = 'tv',
  className = ''
}) => {
  const { speak, isLoading, isPlaying, error, isAvailable } = useTextToSpeech();
  const { isSupported: bleepSupported } = useBleepSound();
  const [isEnhancedPlaying, setIsEnhancedPlaying] = useState(false);

  const handleSpeak = async () => {
    if (!text.trim()) return;

    if (variant === 'enhanced' && enableBleeps && text.includes('**') && bleepSupported) {
      // Use enhanced TTS with bleeps
      setIsEnhancedPlaying(true);
      try {
        await enhancedTTSService.speakWithBleeps(text, {
          style,
          rageLevel,
          enableBleeps,
          bleepStyle
        });
      } catch (error) {
        console.error('Enhanced TTS failed:', error);
        // Fallback to regular TTS
        await speak(text, style, rageLevel);
      } finally {
        setIsEnhancedPlaying(false);
      }
    } else {
      // Use regular TTS
      await speak(text, style, rageLevel);
    }
  };

  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg'
  };

  const isCurrentlyPlaying = isPlaying || isEnhancedPlaying;
  const isCurrentlyLoading = isLoading;

  if (!isAvailable) {
    return (
      <button
        disabled
        className={`${sizeClasses[size]} rounded-lg bg-gray-500/20 text-gray-500 cursor-not-allowed ${className}`}
        title="Text-to-speech not available"
      >
        <VolumeX size={16} />
      </button>
    );
  }

  return (
    <button
      onClick={handleSpeak}
      disabled={isCurrentlyLoading || isCurrentlyPlaying}
      className={`${sizeClasses[size]} rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
        isCurrentlyPlaying
          ? 'bg-green-500/30 text-green-400 border border-green-500/50 animate-pulse'
          : isCurrentlyLoading
          ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
          : 'bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30 hover:border-blue-500/70'
      } ${className}`}
      title={
        isCurrentlyPlaying 
          ? 'Playing audio...' 
          : isCurrentlyLoading 
          ? 'Generating speech...' 
          : `Listen to translation${enableBleeps && text.includes('**') ? ' (with bleeps)' : ''}`
      }
    >
      <div className="flex items-center gap-2">
        {isCurrentlyLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Volume2 size={16} />
        )}
        
        {variant === 'default' && (
          <span>
            {isCurrentlyPlaying ? 'Playing...' : isCurrentlyLoading ? 'Loading...' : 'Listen'}
            {enableBleeps && text.includes('**') && bleepSupported && ' 🔊'}
          </span>
        )}
        
        {variant === 'enhanced' && enableBleeps && text.includes('**') && bleepSupported && (
          <span className="text-xs bg-red-500/20 text-red-400 px-1 rounded">BLEEP</span>
        )}
      </div>
    </button>
  );
};