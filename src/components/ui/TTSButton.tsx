/**
 * TTSButton Component
 * 
 * Enhanced text-to-speech button with bleep sound integration.
 * Now properly handles **BLEEP** markers in translated text.
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
  className = '',
  disabled = false
}) => {
  const [isEnhancedPlaying, setIsEnhancedPlaying] = useState(false);
  const { isAvailable: ttsAvailable } = useTextToSpeech();
  const { isSupported: bleepSupported, testBleep } = useBleepSound();

  // Check if text contains bleep markers
  const hasBleeps = text.includes('**') && (
    text.includes('**BLEEP**') || 
    text.includes('**DAMN**') || 
    text.includes('**HELL**') ||
    text.includes('**SHIT**') ||
    text.includes('**FUCK**') ||
    /\*\*[A-Z]+\*\*/.test(text)
  );

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'p-1.5 text-sm';
      case 'lg': return 'p-3 text-lg';
      default: return 'p-2 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10';
      case 'ghost':
        return 'text-blue-400 hover:bg-blue-500/10';
      default:
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30';
    }
  };

  const handleClick = async () => {
    if (!text.trim() || disabled) return;

    try {
      if (hasBleeps && bleepSupported) {
        console.log('🎤 Playing enhanced TTS with bleeps for:', text.substring(0, 50) + '...');
        setIsEnhancedPlaying(true);
        
        await enhancedTTSService.speakWithBleeps(text, {
          style,
          rageLevel,
          enableBleeps: true,
          bleepStyle: rageLevel >= 8 ? 'harsh' : 'tv'
        });
      } else {
        // Fallback to regular TTS
        console.log('🎤 Playing regular TTS for:', text.substring(0, 50) + '...');
        const { speak } = useTextToSpeech();
        await speak(text, style, rageLevel);
      }
    } catch (error) {
      console.error('❌ TTS playback failed:', error);
    } finally {
      setIsEnhancedPlaying(false);
    }
  };

  const handleTestBleep = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await testBleep();
  };

  const isLoading = isEnhancedPlaying;
  const isDisabled = disabled || !ttsAvailable || !text.trim();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          flex items-center gap-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105
          ${getSizeClasses()}
          ${getVariantClasses()}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'}
          ${className}
        `}
        title={hasBleeps ? 'Play with bleep censoring' : 'Play text-to-speech'}
        aria-label={`${isLoading ? 'Playing' : 'Play'} text-to-speech${hasBleeps ? ' with bleeps' : ''}`}
      >
        {isLoading ? (
          <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-spin" />
        ) : (
          <Volume2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        )}
        
        <span className="hidden sm:inline">
          {isLoading ? 'Playing...' : hasBleeps ? 'Play (Censored)' : 'Listen'}
        </span>
        
        {hasBleeps && (
          <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">
            BLEEP
          </span>
        )}
      </button>

      {/* Test Bleep Button (only show if bleeps are supported and text has bleeps) */}
      {hasBleeps && bleepSupported && (
        <button
          onClick={handleTestBleep}
          className="p-1.5 text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded hover:bg-orange-500/30 transition-all duration-300"
          title="Test bleep sound"
          aria-label="Test bleep sound"
        >
          🔊
        </button>
      )}
    </div>
  );
};