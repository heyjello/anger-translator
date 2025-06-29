export interface VoiceConfig {
  voice_id: string;
  name: string;
  description: string;
  voice_settings: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

export interface VoiceStyleMap {
  corporate: VoiceConfig;
  gamer: VoiceConfig;
  sarcastic: VoiceConfig;
  karen: VoiceConfig;
}

// Pre-made ElevenLabs voices optimized for each style
export const VOICE_CONFIGS: VoiceStyleMap = {
  corporate: {
    voice_id: "pNInz6obpgDQGcFmaJgB", // Adam
    name: "Adam",
    description: "Professional, authoritative voice for corporate rage",
    voice_settings: {
      stability: 0.75,
      similarity_boost: 0.75,
      style: 0.3,
      use_speaker_boost: true
    }
  },
  gamer: {
    voice_id: "ErXwobaYiN019PkySvjV", // Antoni
    name: "Antoni",
    description: "Energetic, youthful voice for gamer rage",
    voice_settings: {
      stability: 0.4,
      similarity_boost: 0.6,
      style: 0.8,
      use_speaker_boost: true
    }
  },
  sarcastic: {
    voice_id: "onwK4e9ZLuTAKqWW03F9", // Daniel
    name: "Daniel",
    description: "Sophisticated British accent for sarcastic roasts",
    voice_settings: {
      stability: 0.9,
      similarity_boost: 0.8,
      style: 0.5,
      use_speaker_boost: true
    }
  },
  karen: {
    voice_id: "EXAVITQu4vr4xnSDxMaL", // Bella
    name: "Bella",
    description: "Entitled suburban mom voice for Karen rants",
    voice_settings: {
      stability: 0.6,
      similarity_boost: 0.7,
      style: 0.7,
      use_speaker_boost: true
    }
  }
};

// Alternative voices for variety
export const ALTERNATIVE_VOICES = {
  corporate: ["VR6AewLTigWG4xSOukaG"], // Arnold
  gamer: ["21m00Tcm4TlvDq8ikWAM"], // Rachel
  sarcastic: ["2EiwWnXFnvU5JabPnv8n"], // Clyde
  karen: ["ThT5KcBeYPX3keUQqHPh"] // Dorothy
};

// Get voice configuration based on style
export const getVoiceForStyle = (style: 'corporate' | 'gamer' | 'sarcastic' | 'karen'): VoiceConfig => {
  return VOICE_CONFIGS[style];
};

// Adjust voice settings based on rage intensity
export const adjustVoiceForIntensity = (
  baseSettings: VoiceConfig['voice_settings'], 
  intensity: number
): VoiceConfig['voice_settings'] => {
  // Higher intensity = less stability, more style/emotion
  const intensityFactor = intensity / 10;
  
  return {
    ...baseSettings,
    stability: Math.max(0.2, baseSettings.stability - (intensityFactor * 0.3)),
    style: Math.min(1.0, (baseSettings.style || 0.5) + (intensityFactor * 0.3))
  };
};

// Enhanced voice configuration with emotional presets
export const EMOTIONAL_PRESETS = {
  calm: {
    stability: 0.9,
    similarity_boost: 0.8,
    style: 0.2,
    use_speaker_boost: false
  },
  annoyed: {
    stability: 0.7,
    similarity_boost: 0.7,
    style: 0.4,
    use_speaker_boost: true
  },
  angry: {
    stability: 0.5,
    similarity_boost: 0.6,
    style: 0.7,
    use_speaker_boost: true
  },
  furious: {
    stability: 0.3,
    similarity_boost: 0.5,
    style: 0.9,
    use_speaker_boost: true
  },
  nuclear: {
    stability: 0.2,
    similarity_boost: 0.4,
    style: 1.0,
    use_speaker_boost: true
  }
} as const;

// Get emotional preset based on rage level
export const getEmotionalPreset = (rageLevel: number): keyof typeof EMOTIONAL_PRESETS => {
  if (rageLevel <= 2) return 'calm';
  if (rageLevel <= 4) return 'annoyed';
  if (rageLevel <= 6) return 'angry';
  if (rageLevel <= 8) return 'furious';
  return 'nuclear';
};

// Advanced voice configuration with style-specific adjustments
export const getAdvancedVoiceConfig = (
  style: 'corporate' | 'gamer' | 'sarcastic' | 'karen',
  intensity: number
): VoiceConfig => {
  const baseConfig = getVoiceForStyle(style);
  const emotionalPreset = EMOTIONAL_PRESETS[getEmotionalPreset(intensity)];
  
  // Blend base settings with emotional preset
  const blendedSettings = {
    stability: (baseConfig.voice_settings.stability + emotionalPreset.stability) / 2,
    similarity_boost: (baseConfig.voice_settings.similarity_boost + emotionalPreset.similarity_boost) / 2,
    style: Math.max(baseConfig.voice_settings.style || 0.5, emotionalPreset.style),
    use_speaker_boost: emotionalPreset.use_speaker_boost
  };

  return {
    ...baseConfig,
    voice_settings: blendedSettings
  };
};

// Voice model configurations for different quality levels
export const VOICE_MODELS = {
  standard: {
    model_id: 'eleven_monolingual_v1',
    name: 'Standard Quality',
    description: 'Good quality, faster generation',
    cost_multiplier: 1.0
  },
  enhanced: {
    model_id: 'eleven_multilingual_v2',
    name: 'Enhanced Quality',
    description: 'Higher quality, supports multiple languages',
    cost_multiplier: 1.5
  },
  turbo: {
    model_id: 'eleven_turbo_v2',
    name: 'Turbo Speed',
    description: 'Fastest generation, good quality',
    cost_multiplier: 0.8
  }
} as const;

// Text preprocessing for better speech synthesis
export const preprocessTextForStyle = (
  text: string, 
  style: 'corporate' | 'gamer' | 'sarcastic' | 'karen',
  intensity: number
): string => {
  let processedText = text;

  // Common preprocessing
  processedText = processedText.replace(/\.\.\./g, '... <break time="0.5s"/>');
  processedText = processedText.replace(/!!!/g, '!!! <break time="0.3s"/>');
  
  // Style-specific preprocessing
  switch (style) {
    case 'corporate':
      // Add professional pauses and emphasis
      processedText = processedText.replace(/AS PER MY PREVIOUS EMAIL/g, '<emphasis level="strong">AS PER MY PREVIOUS EMAIL</emphasis>');
      processedText = processedText.replace(/PLEASE ADVISE/g, '<emphasis level="moderate">PLEASE ADVISE</emphasis>');
      processedText = processedText.replace(/,/g, ', <break time="0.2s"/>');
      break;
      
    case 'gamer':
      // Emphasize gaming terms and add energy
      processedText = processedText.replace(/(BRUH|NOOB|GET REKT|ARE YOU KIDDING ME)/g, '<emphasis level="strong">$1</emphasis>');
      processedText = processedText.replace(/!!!/g, '!!! <break time="0.2s"/>');
      if (intensity >= 7) {
        processedText = `<prosody rate="1.2" pitch="+15%">${processedText}</prosody>`;
      }
      break;
      
    case 'sarcastic':
      // Add sarcastic tone with strategic pauses
      processedText = processedText.replace(/(WOW|RIVETING|MAGNIFICENT|DELIGHTFUL)/g, '<emphasis level="moderate">$1</emphasis>');
      processedText = processedText.replace(/\"/g, '"<break time="0.3s"/>');
      processedText = `<prosody rate="0.9">${processedText}</prosody>`;
      break;
      
    case 'karen':
      // Add Karen-specific emphasis and dramatic pauses
      processedText = processedText.replace(/\[([^\]]+)\]/g, '<break time="0.3s"/>'); // Remove tone cues but add pauses
      processedText = processedText.replace(/(EXCUSE ME|MANAGER|UNACCEPTABLE|RIDICULOUS)/g, '<emphasis level="strong">$1</emphasis>');
      processedText = processedText.replace(/\*\*([^*]+)\*\*/g, '<emphasis level="strong">$1</emphasis>'); // Convert **text** to emphasis
      if (intensity >= 6) {
        processedText = `<prosody rate="1.1" pitch="+10%">${processedText}</prosody>`;
      }
      break;
  }

  // Intensity-based adjustments
  if (intensity >= 8) {
    processedText = processedText.replace(/([A-Z]{3,})/g, '<emphasis level="strong">$1</emphasis>');
  }

  return processedText;
};

// Voice testing utilities
export const createTestPhrase = (style: 'corporate' | 'gamer' | 'sarcastic' | 'karen'): string => {
  const testPhrases = {
    corporate: "As per my previous email, I need you to review this document immediately. Please advise how we can move forward with some actual competence!",
    gamer: "BRUH! Are you kidding me right now?! This is absolutely unreal! Get rekt and learn to play, noob!",
    sarcastic: "Oh, how absolutely riveting! I'm just thrilled to deal with this masterpiece of communication. Truly, your eloquence knows no bounds!",
    karen: "Excuse me, I want to speak to your manager RIGHT NOW! This is completely unacceptable and I'm calling corporate!"
  };
  
  return testPhrases[style];
};

// Export all voice IDs for easy reference
export const ALL_VOICE_IDS = {
  adam: "pNInz6obpgDQGcFmaJgB",
  antoni: "ErXwobaYiN019PkySvjV", 
  daniel: "onwK4e9ZLuTAKqWW03F9",
  arnold: "VR6AewLTigWG4xSOukaG",
  rachel: "21m00Tcm4TlvDq8ikWAM",
  clyde: "2EiwWnXFnvU5JabPnv8n",
  bella: "EXAVITQu4vr4xnSDxMaL",
  dorothy: "ThT5KcBeYPX3keUQqHPh"
} as const;

// Voice characteristics for UI display
export const VOICE_CHARACTERISTICS = {
  [ALL_VOICE_IDS.adam]: {
    gender: 'Male',
    accent: 'American',
    age: 'Young Adult',
    tone: 'Confident, Clear'
  },
  [ALL_VOICE_IDS.antoni]: {
    gender: 'Male', 
    accent: 'American',
    age: 'Young Adult',
    tone: 'Energetic, Expressive'
  },
  [ALL_VOICE_IDS.daniel]: {
    gender: 'Male',
    accent: 'British',
    age: 'Middle-aged',
    tone: 'Sophisticated, Authoritative'
  },
  [ALL_VOICE_IDS.bella]: {
    gender: 'Female',
    accent: 'American',
    age: 'Young Adult', 
    tone: 'Professional, Warm'
  },
  [ALL_VOICE_IDS.dorothy]: {
    gender: 'Female',
    accent: 'British',
    age: 'Middle-aged',
    tone: 'Elegant, Refined'
  }
} as const;