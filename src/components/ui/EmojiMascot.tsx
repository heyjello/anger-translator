/**
 * EmojiMascot Component
 * 
 * Dynamic emoji mascot that changes based on rage level
 * with smooth transitions and animations.
 */

import React from 'react';

interface EmojiMascotProps {
  rageLevel: number;
  className?: string;
}

export const EmojiMascot: React.FC<EmojiMascotProps> = ({
  rageLevel,
  className = ''
}) => {
  const getMascotEmoji = (level: number) => {
    if (level <= 3) return '😊';
    if (level <= 6) return '😤';
    return '🤬';
  };

  const getMascotAnimation = (level: number) => {
    if (level <= 3) return 'animate-bounce-gentle';
    if (level <= 6) return 'animate-shake-mild';
    return 'animate-shake-intense';
  };

  const getMascotSize = (level: number) => {
    if (level <= 3) return 'text-6xl';
    if (level <= 6) return 'text-7xl';
    return 'text-8xl';
  };

  return (
    <div className={`flex items-center justify-center transition-all duration-500 ${className}`}>
      <div className={`${getMascotSize(rageLevel)} ${getMascotAnimation(rageLevel)} transition-all duration-300 transform hover:scale-110`}>
        {getMascotEmoji(rageLevel)}
      </div>
    </div>
  );
};