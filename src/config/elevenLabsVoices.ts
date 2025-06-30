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

// Pre-made ElevenLabs voices with AUTHENTIC characteristics preserved
export const VOICE_CONFIGS: VoiceStyleMap = {
  corporate: {
    voice_id: "pNInz6obpgDQGcFmaJgB", // Adam
    name: "Adam",
    description: "Professional, authoritative voice for corporate rage",
    voice_settings: {
      stability: 0.95, // High stability to preserve natural tone
      similarity_boost: 0.95, // Maximum similarity to original voice
      style: 0.1, // Minimal style to avoid accent changes
      use_speaker_boost: false // Disabled to preserve natural characteristics
    }
  },
  gamer: {
    voice_id: "ErXwobaYiN019PkySvjV", // Antoni
    name: "Antoni",
    description: "Energetic, youthful voice for cracked Gen-Z Latino gamer rage",
    voice_settings: {
      stability: 0.9, // High stability to preserve Latino accent
      similarity_boost: 0.95, // Maximum similarity to preserve accent
      style: 0.2, // Minimal style to keep natural expressiveness
      use_speaker_boost: false // Disabled to preserve authentic voice
    }
  },
  sarcastic: {
    voice_id: "onwK4e9ZLuTAKqWW03F9", // Daniel
    name: "Daniel",
    description: "Sophisticated British accent for sarcastic roasts",
    voice_settings: {
      stability: 0.95, // High stability to preserve British accent
      similarity_boost: 0.95, // Maximum similarity to maintain accent
      style: 0.1, // Minimal style to preserve natural sophistication
      use_speaker_boost: false // Disabled to keep authentic British tone
    }
  },
  karen: {
    voice_id: "opAH2ij5oCyMnsDUGrpR", // Custom Karen voice
    name: "Karen",
    description: "Entitled suburban mom voice for Karen rants",
    voice_settings: {
      stability: 0.9, // High stability to preserve natural Karen tone
      similarity_boost: 0.95, // Maximum similarity to original voice
      style: 0.15, // Minimal style to keep natural entitlement
      use_speaker_boost: false // Disabled to preserve authentic characteristics
    }
  },
  'scottish-dad': {
    voice_id: "JwYlCv3C5tfM0wHM3xjl", // Arnold (Scottish-sounding voice)
    name: "Arnold",
    description: "Gruff Scottish dad voice for parental disappointment",
    voice_settings: {
      stability: 0.95, // High stability to preserve Scottish accent
      similarity_boost: 0.95, // Maximum similarity to maintain accent
      style: 0.1, // Minimal style to preserve natural gruffness
      use_speaker_boost: false // Disabled to keep authentic Scottish tone
    }
  },
  'ny-italian': {
    voice_id: "CaYmcrR5WjNfLsVo7ReL", // Arnold (works well for NY Italian)
    name: "Vinny",
    description: "Fast-talking NY Italian-American voice for Brooklyn fury",
    voice_settings: {
      stability: 0.9, // High stability to preserve NY accent
      similarity_boost: 0.95, // Maximum similarity to maintain accent
      style: 0.15, // Minimal style to keep natural fast-talking
      use_speaker_boost: false // Disabled to preserve authentic NY tone
    }
  },
  enforcer: {
    voice_id: "ujTRvH905hCgW1uUwWye", // Enforcer voice
    name: "Enforcer",
    description: "Deep, intimidating voice for law enforcement rage",
    voice_settings: {
      stability: 0.95, // Maximum stability to preserve deep tone
      similarity_boost: 0.95, // Maximum similarity to maintain voice characteristics
      style: 0.05, // Minimal style to prevent any pitch/tone changes
      use_speaker_boost: false // Disabled to prevent any artificial enhancement
    }
  },
  'highland-howler': {
    voice_id: "QweS0d0FetCxpq95g9bA", // Arnold - Scottish accent
    name: "Highland Howler",
    description: "Fierce Scottish Highland warrior voice for battle rage",
    voice_settings: {
      stability: 0.9, // High stability to preserve Scottish accent
      similarity_boost: 0.95, // Maximum similarity to maintain accent
      style: 0.2, // Minimal style to keep natural fierceness
      use_speaker_boost: false // Disabled to preserve authentic Scottish characteristics
    }
  },
  don: {
    voice_id: "2EiwWnXFnvU5JabPnv8n", // Clyde - sophisticated, menacing
    name: "Don",
    description: "Sophisticated, menacing voice for mafia don rage",
    voice_settings: {
      stability: 0.95, // High stability to preserve sophisticated tone
      similarity_boost: 0.95, // Maximum similarity to original voice
      style: 0.1, // Minimal style to preserve natural menace
      use_speaker_boost: false // Disabled to keep authentic characteristics
    }
  },
  'cracked-controller': {
    voice_id: "ErXwobaYiN019PkySvjV", // Antoni - high energy, erratic
    name: "Cracked Controller",
    description: "Hyper-energetic, erratic voice for gaming controller rage",
    voice_settings: {
      stability: 0.85, // Slightly lower for natural erratic energy
      similarity_boost: 0.95, // Maximum similarity to preserve voice
      style: 0.25, // Minimal style for natural expressiveness
      use_speaker_boost: false // Disabled to preserve authentic characteristics
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

// CONSERVATIVE intensity adjustments that preserve voice characteristics
export const adjustVoiceForIntensity = (
  baseSettings: VoiceConfig['voice_settings'], 
  intensity: number
): VoiceConfig['voice_settings'] => {
  // MINIMAL adjustments to preserve authentic voice characteristics
  const intensityFactor = intensity / 10;
  
  // For ALL voices, make very conservative adjustments
  return {
    ...baseSettings,
    // Only reduce stability slightly at very high intensities
    stability: Math.max(0.8, baseSettings.stability - (intensityFactor * 0.1)),
    // Keep similarity_boost high to preserve accent/characteristics
    similarity_boost: Math.max(0.9, baseSettings.similarity_boost),
    // Minimal style increases to preserve natural voice
    style: Math.min(0.3, (baseSettings.style || 0.1) + (intensityFactor * 0.05))
  };
};

// Enhanced voice configuration with emotional presets (CONSERVATIVE)
export const EMOTIONAL_PRESETS = {
  calm: {
    stability: 0.95,
    similarity_boost: 0.95,
    style: 0.05,
    use_speaker_boost: false
  },
  annoyed: {
    stability: 0.9,
    similarity_boost: 0.95,
    style: 0.1,
    use_speaker_boost: false
  },
  angry: {
    stability: 0.85,
    similarity_boost: 0.95,
    style: 0.15,
    use_speaker_boost: false
  },
  furious: {
    stability: 0.8,
    similarity_boost: 0.95,
    style: 0.2,
    use_speaker_boost: false
  },
  nuclear: {
    stability: 0.8,
    similarity_boost: 0.95,
    style: 0.25,
    use_speaker_boost: false
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

// CONSERVATIVE voice configuration that preserves ALL authentic characteristics
export const getAdvancedVoiceConfig = (
  style: RageStyle,
  intensity: number
): VoiceConfig => {
  const baseConfig = getVoiceForStyle(style);
  
  // For ALL voices, use MINIMAL adjustments to preserve authenticity
  const conservativeSettings = {
    // Keep stability high to preserve natural voice characteristics
    stability: Math.max(0.8, baseConfig.voice_settings.stability - (intensity / 100)),
    // Always keep similarity_boost at maximum to preserve accents
    similarity_boost: 0.95,
    // Minimal style adjustments to preserve natural delivery
    style: Math.min(0.3, (baseConfig.voice_settings.style || 0.1) + (intensity / 50)),
    // Never use speaker boost to avoid artificial enhancement
    use_speaker_boost: false
  };
  
  return {
    ...baseConfig,
    voice_settings: conservativeSettings
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

/**
 * Clean text for TTS by removing tone cues and formatting for speech
 */
export const cleanTextForTTS = (text: string): string => {
  let cleanedText = text;
  
  // Remove tone cues like [explosive energy], [screaming], etc.
  cleanedText = cleanedText.replace(/\[([^\]]+)\]/g, '');
  
  // Remove multiple spaces and clean up
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  
  // Remove leading/trailing punctuation that might cause issues
  cleanedText = cleanedText.replace(/^[,.\s]+|[,.\s]+$/g, '');
  
  return cleanedText;
};

// MINIMAL text preprocessing to preserve natural voice delivery
export const preprocessTextForStyle = (
  text: string, 
  style: RageStyle,
  intensity: number
): string => {
  // First, clean the text by removing tone cues
  let processedText = cleanTextForTTS(text);

  // MINIMAL preprocessing to preserve natural voice characteristics
  // Only add basic pauses for natural speech flow
  processedText = processedText.replace(/\.\.\./g, '... <break time="0.3s"/>');
  processedText = processedText.replace(/!!!/g, '!!! <break time="0.2s"/>');
  
  // Style-specific preprocessing - MINIMAL to preserve accents
  switch (style) {
    case 'corporate':
      // Only emphasize key corporate terms
      processedText = processedText.replace(/AS PER MY PREVIOUS EMAIL/g, '<emphasis level="moderate">AS PER MY PREVIOUS EMAIL</emphasis>');
      break;
      
    case 'gamer':
    case 'cracked-controller':
      // Only emphasize key gamer terms
      processedText = processedText.replace(/(NAH BRO|BRUH MOMENT|SKILL ISSUE)/g, '<emphasis level="moderate">$1</emphasis>');
      break;
      
    case 'sarcastic':
      // Minimal emphasis to preserve British sophistication
      processedText = processedText.replace(/(WOW|RIVETING|MAGNIFICENT)/g, '<emphasis level="moderate">$1</emphasis>');
      break;
      
    case 'karen':
      // Only emphasize key Karen terms
      processedText = processedText.replace(/(EXCUSE ME|MANAGER|UNACCEPTABLE)/g, '<emphasis level="moderate">$1</emphasis>');
      break;

    case 'scottish-dad':
    case 'highland-howler':
      // Only emphasize key Scottish terms
      processedText = processedText.replace(/(BLOODY HELL|FOR CRYING OUT LOUD)/g, '<emphasis level="moderate">$1</emphasis>');
      break;

    case 'ny-italian':
    case 'don':
      // Only emphasize key NY Italian terms
      processedText = processedText.replace(/(FUGGEDABOUTIT|CAPISCE|MADONNA MIA)/g, '<emphasis level="moderate">$1</emphasis>');
      break;

    case 'enforcer':
      // Only emphasize key enforcement terms - NO PITCH CHANGES
      processedText = processedText.replace(/(OH HELL NAH|ARE YOU SERIOUS|STOP)/g, '<emphasis level="moderate">$1</emphasis>');
      // NO prosody changes to maintain deep voice characteristics
      break;
  }

  // NO intensity-based prosody changes to preserve authentic voice characteristics
  // Only add emphasis for very high intensity without changing pitch/rate
  if (intensity >= 9) {
    processedText = processedText.replace(/([A-Z]{4,})/g, '<emphasis level="moderate">$1</emphasis>');
  }

  return processedText;
};

// Voice testing utilities
export const createTestPhrase = (style: RageStyle): string => {
  const testPhrases = {
    corporate: "As per my previous email, I need you to review this document immediately. Please advise how we can move forward with some actual competence!",
    gamer: "NAH BRO! This is straight **BLEEP**! SKILL ISSUE FR FR! I'm about to UNINSTALL this trash!",
    sarcastic: "Oh, how absolutely riveting! I'm just thrilled to deal with this masterpiece of communication. Truly, your eloquence knows no bounds!",
    karen: "Excuse me, I want to speak to your manager RIGHT NOW! This is completely unacceptable and I'm calling corporate!",
    'scottish-dad': "Och, for crying out loud! What in the bloody hell were ye thinking, laddie? I'm not angry, just... deeply disappointed in ye!",
    'ny-italian': "Ay, what's ya problem here? You gotta be kiddin' me with this! Fuggedaboutit - I'm done with this nonsense, capisce?",
    enforcer: "OH HELL NAH! You must be joking if you think I'm gonna let this slide! ARE YOU SERIOUS RIGHT NOW?",
    'highland-howler': "BY THE HIGHLANDS! What manner of foolishness is this?! Ye've dishonored the clan with yer incompetence!",
    don: "You come to me... on this day... with such disrespect? This is not how we do business in the famiglia, capisce?",
    'cracked-controller': "YOOO THIS CONTROLLER IS STRAIGHT TRASH! I'M ABOUT TO THROW THIS THING THROUGH THE WALL! NO CAP!"
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
  enforcer: "ujTRvH905hCgW1uUwWye",
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
    accent: 'American Latino',
    age: 'Young Adult',
    tone: 'Energetic, Expressive, Latino Accent'
  },
  [ALL_VOICE_IDS.daniel]: {
    gender: 'Male',
    accent: 'British',
    age: 'Middle-aged',
    tone: 'Sophisticated, Authoritative, British Accent'
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
    tone: 'Elegant, Refined, British Accent'
  },
  [ALL_VOICE_IDS.karen]: {
    gender: 'Female',
    accent: 'American',
    age: 'Middle-aged',
    tone: 'Entitled, Demanding, Suburban Accent'
  },
  [ALL_VOICE_IDS.arnold]: {
    gender: 'Male',
    accent: 'Scottish',
    age: 'Middle-aged',
    tone: 'Gruff, Disappointed, Scottish Accent'
  },
  [ALL_VOICE_IDS.enforcer]: {
    gender: 'Male',
    accent: 'American Urban',
    age: 'Adult',
    tone: 'Deep, Intimidating, Authoritative, Urban Accent'
  },
  [ALL_VOICE_IDS.vinny]: {
    gender: 'Male',
    accent: 'New York Italian',
    age: 'Middle-aged',
    tone: 'Fast-talking, Animated, Brooklyn Accent'
  }
} as const;