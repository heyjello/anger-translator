import { useState, useCallback } from 'react';
import { ALTERNATIVE_VOICES } from '../config/elevenLabsVoices';

export const useVoiceVariety = () => {
  const [lastVoiceIndex, setLastVoiceIndex] = useState<Record<string, number>>({
    corporate: 0,
    gamer: 0,
    sarcastic: 0
  });

  const getNextVoice = useCallback((style: 'corporate' | 'gamer' | 'sarcastic') => {
    const alternatives = ALTERNATIVE_VOICES[style];
    if (!alternatives || alternatives.length === 0) {
      return null; // Use default voice
    }

    const currentIndex = lastVoiceIndex[style];
    const nextIndex = (currentIndex + 1) % (alternatives.length + 1); // +1 to include default
    
    setLastVoiceIndex(prev => ({
      ...prev,
      [style]: nextIndex
    }));

    // Return null to use default voice, or return alternative voice ID
    return nextIndex === 0 ? null : alternatives[nextIndex - 1];
  }, [lastVoiceIndex]);

  const resetVoiceRotation = useCallback(() => {
    setLastVoiceIndex({
      corporate: 0,
      gamer: 0,
      sarcastic: 0
    });
  }, []);

  const getCurrentVoiceInfo = useCallback((style: 'corporate' | 'gamer' | 'sarcastic') => {
    const alternatives = ALTERNATIVE_VOICES[style];
    const currentIndex = lastVoiceIndex[style];
    
    if (!alternatives || alternatives.length === 0 || currentIndex === 0) {
      return { isDefault: true, voiceId: null, index: 0 };
    }
    
    return {
      isDefault: false,
      voiceId: alternatives[currentIndex - 1],
      index: currentIndex,
      totalAlternatives: alternatives.length
    };
  }, [lastVoiceIndex]);

  return { 
    getNextVoice, 
    resetVoiceRotation, 
    getCurrentVoiceInfo,
    lastVoiceIndex 
  };
};