import React from 'react';
import { Volume2 } from 'lucide-react';
import { getVoiceForStyle } from '../../config/elevenLabsVoices';

interface VoiceIndicatorProps {
  style: 'corporate' | 'gamer' | 'sarcastic';
  intensity: number;
  className?: string;
}

export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({
  style,
  intensity,
  className = ''
}) => {
  const voice = getVoiceForStyle(style);
  
  return (
    <div className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
      <Volume2 size={16} className="text-gray-500" />
      <span>Voice: {voice.name}</span>
      {intensity >= 7 && (
        <span className="text-orange-500 text-xs">(High intensity mode)</span>
      )}
    </div>
  );
};