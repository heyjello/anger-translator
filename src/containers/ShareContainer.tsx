import React, { useState } from 'react';
import { ShareModal } from '../components';
import { RageStyle } from '../types/translation';

interface ShareContainerProps {
  isOpen: boolean;
  onClose: () => void;
  translatedText: string;
  originalText: string;
  style: RageStyle;
  rageLevel: number;
}

export const ShareContainer: React.FC<ShareContainerProps> = ({
  isOpen,
  onClose,
  translatedText,
  originalText,
  style,
  rageLevel
}) => {
  if (!isOpen) return null;

  return (
    <ShareModal
      isOpen={isOpen}
      onClose={onClose}
      translatedText={translatedText}
      originalText={originalText}
      style={style}
      rageLevel={rageLevel}
    />
  );
};