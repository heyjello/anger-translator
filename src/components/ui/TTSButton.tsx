/**
 * TTSButton Component
 * 
 * Interactive text-to-speech button with loading states, error handling,
 * and visual feedback. Uses the enhanced voice configuration system.
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2, AlertCircle } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

interface TTSButtonProps {
  text: string;
  style?: string;
  rageLevel?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
}

export const TTSButton: React.FC<TTSButtonProps> = ({
  text,
  style = 'default',
  rageLevel = 5,
  size = 'md',
  variant = 'default',
  disabled = false,
  className = ''
}) => {
  const { speak, isLoading, isPlaying, error, isAvailable, stop, clearError } = useTextToSpeech();
  const [showError, setShowError] = useState(false);

  // Don't render if TTS is not available
  if (!isAvailable) {
    return null;
  }

  const handleClick = async () => {
    if (isPlaying) {
      stop();
      return;
    }

    if (error) {
      clearError();
      setShowError(false);
    }

    try {
      await speak(text, style, rageLevel);
    } catch (err) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
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
        return 'bg-transparent border-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/70';
      case 'ghost':
        return 'bg-transparent text-purple-400 hover:bg-purple-500/10';
      default:
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 hover:border-purple-500/50';
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-spin" />;
    }
    
    if (error && showError) {
      return <AlertCircle size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="text-red-400" />;
    }
    
    if (isPlaying) {
      return <VolumeX size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />;
    }
    
    return <Volume2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />;
  };

  const getTooltipText = () => {
    if (isLoading) return 'Generating speech...';
    if (error && showError) return `Error: ${error}`;
    if (isPlaying) return 'Stop playback';
    return 'Listen to translation';
  };

  const getGlowEffect = () => {
    if (isPlaying) return 'shadow-[0_0_20px_rgba(147,51,234,0.5)]';
    if (error && showError) return 'shadow-[0_0_20px_rgba(239,68,68,0.5)]';
    return 'hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]';
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          ${getGlowEffect()}
          rounded-lg font-medium transition-all duration-300 transform hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          flex items-center gap-2
          ${className}
        `}
        title={getTooltipText()}
        aria-label={getTooltipText()}
      >
        {getIcon()}
        {size === 'lg' && (
          <span className="hidden sm:inline">
            {isLoading ? 'Generating...' : isPlaying ? 'Stop' : 'Listen'}
          </span>
        )}
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {getTooltipText()}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>

      {/* Error indicator */}
      {error && showError && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      )}

      {/* Playing indicator */}
      {isPlaying && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
};