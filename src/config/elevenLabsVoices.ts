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
  'scottish-dad': VoiceConfig;
  'ny-italian': VoiceConfig;
  enforcer: VoiceConfig;
  'highland-howler': VoiceConfig;
  don: VoiceConfig;
  'cracked-controller': VoiceConfig;
}

// Define the comprehensive RageStyle type
export type RageStyle = 'corporate' | 'gamer' | 'sarcastic' | 'karen' | 'scottish-dad' | 'ny-italian' | 'enforcer' | 'highland-howler' | 'don' | 'cracked-controller';

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
    description: "Energetic, youthful voice for cracked Gen-Z Latino gamer rage",
    voice_settings: {
      stability: 0.3, // Lower stability for more erratic, cracked energy
      similarity_boost: 0.6,
      style: 0.9, // Higher style for more expressive delivery
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
    voice_id: "opAH2ij5oCyMnsDUGrpR", // Custom Karen voice
    name: "Karen",
    description: "Entitled suburban mom voice for Karen rants",
    voice_settings: {
      stability: 0.6,
      similarity_boost: 0.7,
      style: 0.7,
      use_speaker_boost: true
    }
  },
  'scottish-dad': {
    voice_id: "QweS0d0FetCxpq95g9bA", // Arnold (Scottish-sounding voice)
    name: "Arnold",
    description: "Gruff Scottish dad voice for parental disappointment",
    voice_settings: {
      stability: 0.7,
      similarity_boost: 0.8,
      style: 0.6,
      use_speaker_boost: true
    }
  },
  'ny-italian': {
    voice_id: "CaYmcrR5WjNfLsVo7ReL", // Arnold (works well for NY Italian)
    name: "Vinny",
    description: "Fast-talking NY Italian-American voice for Brooklyn fury",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.7,
      style: 0.8,
      use_speaker_boost: true
    }
  },
  enforcer: {
    voice_id: "VR6AewLTigWG4xSOukaG", // Arnold - deep, authoritative
    name: "Enforcer",
    description: "Deep, intimidating voice for law enforcement rage",
    voice_settings: {
      stability: 0.8,
      similarity_boost: 0.8,
      style: 0.4,
      use_speaker_boost: true
    }
  },
  'highland-howler': {
    voice_id: "QweS0d0FetCxpq95g9bA", // Arnold - Scottish accent
    name: "Highland Howler",
    description: "Fierce Scottish Highland warrior voice for battle rage",
    voice_settings: {
      stability: 0.4,
      similarity_boost: 0.7,
      style: 0.8,
      use_speaker_boost: true
    }
  },
  don: {
    voice_id: "2EiwWnXFnvU5JabPnv8n", // Clyde - sophisticated, menacing
    name: "Don",
    description: "Sophisticated, menacing voice for mafia don rage",
    voice_settings: {
      stability: 0.8,
      similarity_boost: 0.8,
      style: 0.5,
      use_speaker_boost: true
    }
  },
  'cracked-controller': {
    voice_id: "ErXwobaYiN019PkySvjV", // Antoni - high energy, erratic
    name: "Cracked Controller",
    description: "Hyper-energetic, erratic voice for gaming controller rage",
    voice_settings: {
      stability: 0.2, // Very low stability for maximum chaos
      similarity_boost: 0.5,
      style: 1.0, // Maximum style for extreme expressiveness
      use_speaker_boost: true
    }
  }
};

// Alternative voices for variety
export const ALTERNATIVE_VOICES = {
  corporate: ["VR6AewLTigWG4xSOukaG"], // Arnold
  gamer: ["21m00Tcm4TlvDq8ikWAM"], // Rachel - for variety in gamer voice
  sarcastic: ["2EiwWnXFnvU5JabPnv8n"], // Clyde
  karen: ["ThT5KcBeYPX3keUQqHPh"], // Dorothy
  'scottish-dad': ["2EiwWnXFnvU5JabPnv8n"], // Clyde
  'ny-italian': ["pNInz6obpgDQGcFmaJgB"], // Adam
  enforcer: ["2EiwWnXFnvU5JabPnv8n"], // Clyde
  'highland-howler': ["VR6AewLTigWG4xSOukaG"], // Arnold
  don: ["pNInz6obpgDQGcFmaJgB"], // Adam
  'cracked-controller': ["21m00Tcm4TlvDq8ikWAM"] // Rachel
};

// Get voice configuration based on style
export const getVoiceForStyle = (style: RageStyle): VoiceConfig => {
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
  style: RageStyle,
  intensity: number
): VoiceConfig => {
  const baseConfig = getVoiceForStyle(style);
  const emotionalPreset = EMOTIONAL_PRESETS[getEmotionalPreset(intensity)];
  
  // Special handling for gamer and cracked-controller styles - more erratic at higher intensities
  if (style === 'gamer' || style === 'cracked-controller') {
    const crackedFactor = intensity / 10;
    const blendedSettings = {
      stability: Math.max(0.1, baseConfig.voice_settings.stability - (crackedFactor * 0.4)), // More unstable
      similarity_boost: (baseConfig.voice_settings.similarity_boost + emotionalPreset.similarity_boost) / 2,
      style: Math.min(1.0, baseConfig.voice_settings.style || 0.5 + (crackedFactor * 0.5)), // More expressive
      use_speaker_boost: true // Always boost for gamer energy
    };
    
    return {
      ...baseConfig,
      voice_settings: blendedSettings
    };
  }
  
  // Blend base settings with emotional preset for other styles
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
  style: RageStyle,
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
    case 'cracked-controller':
      // Emphasize gamer terms and add cracked energy
      processedText = processedText.replace(/(NAH BRO|BRUH MOMENT|THAT'S CAP|NO SHOT|SKILL ISSUE|GATORADE|ADDERALL)/g, '<emphasis level="strong">$1</emphasis>');
      processedText = processedText.replace(/\*\*BLEEP\*\*/g, '<emphasis level="strong">BLEEP</emphasis>');
      processedText = processedText.replace(/!!!/g, '!!! <break time="0.1s"/>'); // Faster for cracked energy
      
      // Add Latino expressions with emphasis
      processedText = processedText.replace(/(órale|no mames|qué pedo|ese|vato|chale)/g, '<emphasis level="moderate">$1</emphasis>');
      
      if (intensity >= 7) {
        processedText = `<prosody rate="1.3" pitch="+20%">${processedText}</prosody>`; // Faster, higher pitch for cracked energy
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

    case 'scottish-dad':
    case 'highland-howler':
      // Add Scottish dad-specific emphasis and disappointed pauses
      processedText = processedText.replace(/(LADDIE|LASSIE|BLOODY HELL|FOR CRYING OUT LOUD)/g, '<emphasis level="strong">$1</emphasis>');
      processedText = processedText.replace(/\*sighs heavily\*/g, '<break time="0.5s"/>');
      processedText = processedText.replace(/\*shakes head\*/g, '<break time="0.3s"/>');
      if (intensity >= 6) {
        processedText = `<prosody rate="0.95" pitch="-5%">${processedText}</prosody>`;
      }
      break;

    case 'ny-italian':
      // Add NY Italian-specific emphasis and fast-talking energy
      processedText = processedText.replace(/\[([^\]]+)\]/g, '<break time="0.2s"/>'); // Remove tone cues but add quick pauses
      processedText = processedText.replace(/(AY|FUGGEDABOUTIT|CAPISCE|MADONNA MIA)/g, '<emphasis level="strong">$1</emphasis>');
      processedText = processedText.replace(/\*\*([^*]+)\*\*/g, '<emphasis level="strong">$1</emphasis>'); // Convert **text** to emphasis
      if (intensity >= 6) {
        processedText = `<prosody rate="1.3" pitch="+8%">${processedText}</prosody>`; // Fast-talking NY style
      }
      break;

    case 'enforcer':
      // Add law enforcement emphasis and authoritative pauses
      processedText = processedText.replace(/(STOP|FREEZE|HANDS UP|COMPLY|VIOLATION)/g, '<emphasis level="strong">$1</emphasis>');
      processedText = processedText.replace(/,/g, ', <break time="0.3s"/>');
      if (intensity >= 6) {
        processedText = `<prosody rate="0.9" pitch="-10%">${processedText}</prosody>`;
      }
      break;

    case 'don':
      // Add mafia don emphasis and menacing pauses
      processedText = processedText.replace(/(CAPISCE|FAMIGLIA|RESPECT|BUSINESS)/g, '<emphasis level="strong">$1</emphasis>');
      processedText = processedText.replace(/\.\.\./g, '... <break time="0.8s"/>'); // Longer pauses for menacing effect
      if (intensity >= 6) {
        processedText = `<prosody rate="0.8" pitch="-5%">${processedText}</prosody>`;
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
export const createTestPhrase = (style: RageStyle): string => {
  const testPhrases = {
    corporate: "As per my previous email, I need you to review this document immediately. Please advise how we can move forward with some actual competence!",
    gamer: "[screaming] NAH BRO! This is straight **BLEEP**! SKILL ISSUE FR FR, órale! I'm about to UNINSTALL this trash!",
    sarcastic: "Oh, how absolutely riveting! I'm just thrilled to deal with this masterpiece of communication. Truly, your eloquence knows no bounds!",
    karen: "Excuse me, I want to speak to your manager RIGHT NOW! This is completely unacceptable and I'm calling corporate!",
    'scottish-dad': "Och, for crying out loud! What in the bloody hell were ye thinking, laddie? I'm not angry, just... deeply disappointed in ye!",
    'ny-italian': "Ay, what's ya problem here? You gotta be kiddin' me with this! Fuggedaboutit - I'm done with this nonsense, capisce?",
    enforcer: "STOP right there! You're in violation of protocol! COMPLY immediately or face the consequences!",
    'highland-howler': "BY THE HIGHLANDS! What manner of foolishness is this?! Ye've dishonored the clan with yer incompetence!",
    don: "You come to me... on this day... with such disrespect? This is not how we do business in the famiglia, capisce?",
    'cracked-controller': "[SCREAMING] YOOO THIS CONTROLLER IS STRAIGHT TRASH! I'M ABOUT TO THROW THIS THING THROUGH THE WALL! NO CAP!"
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
  dorothy: "ThT5KcBeYPX3keUQqHPh",
  karen: "opAH2ij5oCyMnsDUGrpR",
  vinny: "VR6AewLTigWG4xSOukaG" // Using Arnold's voice for NY Italian
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
    tone: 'Energetic, Cracked, Expressive' // Updated for gamer style
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
  },
  [ALL_VOICE_IDS.karen]: {
    gender: 'Female',
    accent: 'American',
    age: 'Middle-aged',
    tone: 'Entitled, Demanding'
  },
  [ALL_VOICE_IDS.arnold]: {
    gender: 'Male',
    accent: 'Scottish',
    age: 'Middle-aged',
    tone: 'Gruff, Disappointed'
  },
  [ALL_VOICE_IDS.vinny]: {
    gender: 'Male',
    accent: 'New York',
    age: 'Middle-aged',
    tone: 'Fast-talking, Animated'
  }
} as const;