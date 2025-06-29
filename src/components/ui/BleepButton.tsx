/**
 * BleepButton Component
 * 
 * Button component for testing and playing bleep sounds.
 */

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useBleepSound } from '../../hooks/useBleepSound';

interface BleepButtonProps {
  text?: string;
  style?: 'tv' | 'radio' | 'harsh' | 'gentle';
  variant?: 'test' | 'text' | 'style';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BleepButton: React.FC<BleepButtonProps> = ({
  text = 'BLEEP',
  style = 'tv',
  variant = 'test',
  size = 'md',
  className = ''
}) => {
  const { playBleep, playBleepForText, playStyleBleep, testBleep, isPlaying, isSupported } = useBleepSound();

  const handleClick = async () => {
    switch (variant) {
      case 'text':
        await playBleepForText(text);
        break;
      case 'style':
        await playStyleBleep(style);
        break;
      case 'test':
      default:
        await testBleep();
        break;
    }
  };

  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg'
  };

  if (!isSupported) {
    return (
      <button
        disabled
        className={`${sizeClasses[size]} rounded-lg bg-gray-500/20 text-gray-500 cursor-not-allowed ${className}`}
        title="Audio not supported in this browser"
      >
        <VolumeX size={16} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPlaying}
      className={`${sizeClasses[size]} rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
        isPlaying
          ? 'bg-red-500/30 text-red-400 border border-red-500/50 animate-pulse'
          : 'bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30 hover:border-blue-500/70'
      } ${className}`}
      title={isPlaying ? 'Playing bleep...' : 'Play bleep sound'}
    >
      <div className="flex items-center gap-2">
        <Volume2 size={16} />
        {variant === 'test' && <span>Test Bleep</span>}
        {variant === 'text' && <span>🔊</span>}
        {variant === 'style' && <span>{style.toUpperCase()}</span>}
      </div>
    </button>
  );
};