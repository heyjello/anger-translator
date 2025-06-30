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

// ELEVENLABS DEFAULT SETTINGS - NO MODIFICATIONS WHATSOEVER
const DEFAULT_VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0,
  use_speaker_boost: true
};

export const VOICE_CONFIGS: VoiceStyleMap = {
  corporate: {
    voice_id: "pNInz6obpgDQGcFmaJgB", // Adam
    name: "Adam",
    description: "Professional male voice",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  gamer: {
    voice_id: "ErXwobaYiN019PkySvjV", // Antoni
    name: "Antoni",
    description: "Energetic male voice",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  sarcastic: {
    voice_id: "onwK4e9ZLuTAKqWW03F9", // Daniel
    name: "Daniel",
    description: "British accent male voice",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  karen: {
    voice_id: "EXAVITQu4vr4xnSDxMaL", // Bella
    name: "Bella",
    description: "Female voice for Karen persona",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  'scottish-dad': {
    voice_id: "VR6AewLTigWG4xSOukaG", // Arnold
    name: "Arnold",
    description: "Deep male voice",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  'ny-italian': {
    voice_id: "2EiwWnXFnvU5JabPnv8n", // Clyde
    name: "Clyde",
    description: "American male voice for NY Italian",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  enforcer: {
    voice_id: "pNInz6obpgDQGcFmaJgB", // Adam (reused)
    name: "Adam",
    description: "Strong male voice for Enforcer",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  'highland-howler': {
    voice_id: "VR6AewLTigWG4xSOukaG", // Arnold (good for Scottish)
    name: "Arnold",
    description: "Deep voice for Highland Howler",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  don: {
    voice_id: "2EiwWnXFnvU5JabPnv8n", // Clyde (good for Don)
    name: "Clyde",
    description: "Authoritative voice for Don persona",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  'cracked-controller': {
    voice_id: "ErXwobaYiN019PkySvjV", // Antoni (good for energetic gamer)
    name: "Antoni",
    description: "High energy voice for cracked gamer",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  }
};

// Get voice configuration - RETURNS EXACT SETTINGS
export const getVoiceForStyle = (style: RageStyle): VoiceConfig => {
  return VOICE_CONFIGS[style];
};

// NO ADJUSTMENTS - Returns settings completely unchanged
export const adjustVoiceForIntensity = (
  baseSettings: VoiceConfig['voice_settings'], 
  intensity: number
): VoiceConfig['voice_settings'] => {
  return baseSettings; // NO MODIFICATIONS
};

// NO ADVANCED CONFIGURATION - Returns voice exactly as configured
export const getAdvancedVoiceConfig = (
  style: RageStyle,
  intensity: number
): VoiceConfig => {
  return getVoiceForStyle(style); // NO MODIFICATIONS
};

// Voice model configurations for ElevenLabs v3
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
    model_id: 'eleven_turbo_v2_5',
    name: 'Turbo v2.5',
    description: 'Fastest generation with ElevenLabs v3 features',
    cost_multiplier: 0.8
  }
} as const;

/**
 * Clean text for TTS - UPDATED for ElevenLabs v3 audio tag system
 * - Removes (parenthetical stage directions) that shouldn't be spoken
 * - Preserves [square bracket audio tags] for ElevenLabs v3 processing
 * - Preserves *single asterisk emphasis* for ElevenLabs v3
 * - Preserves **double asterisk profanity** markers for bleeping system
 */
export const cleanTextForTTS = (text: string): string => {
  let cleanedText = text;
  
  // Remove parenthetical stage directions like (Deep inhale, fake-calm voice)
  cleanedText = cleanedText.replace(/\([^)]*\)/g, '');
  
  // Keep [square bracket audio tags] for ElevenLabs v3: [laughs], [whispers], [pause], etc.
  // Keep *single asterisk emphasis* for ElevenLabs v3
  // Keep **double asterisk profanity** markers for bleeping system
  
  // Remove multiple spaces and clean up
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  
  return cleanedText;
};

/**
 * Clean text for user display - removes all audio formatting for clean reading
 * - Removes [audio tags] (user doesn't need to see these)
 * - Removes *emphasis* markers but keeps the content
 * - Preserves **profanity** markers for visual indication of bleeping
 */
export const cleanTextForUser = (text: string): string => {
  let cleanedText = text;
  
  // Remove parenthetical stage directions
  cleanedText = cleanedText.replace(/\([^)]*\)/g, '');
  
  // Remove [square bracket audio tags] but keep any content
  cleanedText = cleanedText.replace(/\[([^\]]+)\]/g, '');
  
  // Remove *single asterisk emphasis* but keep the content
  cleanedText = cleanedText.replace(/\*([^*]+)\*/g, '$1');
  
  // Keep **double asterisk profanity** markers for visual indication
  
  // Remove multiple spaces and clean up
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  
  return cleanedText;
};

// NO TEXT PREPROCESSING - Just clean parentheses, preserve audio tags and profanity
export const preprocessTextForStyle = (
  text: string, 
  style: RageStyle,
  intensity: number
): string => {
  // Only remove parenthetical directions, preserve ElevenLabs v3 audio tags and profanity markers
  return cleanTextForTTS(text);
};

// Voice testing utilities
export const createTestPhrase = (style: RageStyle): string => {
  const testPhrases = {
    corporate: "[professional] As per my previous email, I need you to review this document *immediately*.",
    gamer: "[shouting] This is straight **trash**! I'm about to uninstall this whole thing!",
    sarcastic: "[sarcastic] Oh, how absolutely *riveting*! Truly, your eloquence knows no bounds!",
    karen: "[demanding] Excuse me, I want to speak to your manager *RIGHT NOW*!",
    'scottish-dad': "[angry] What in the **bloody hell** were ye thinking, laddie?",
    'ny-italian': "[tough] You gotta be kiddin' me with this! Fuggedaboutit!",
    enforcer: "[threatening] OH HELL NAH! You must be joking if you think I'm gonna let this slide!",
    'highland-howler': "[explosive] What in the name of the wee man is this **nonsense**?!",
    don: "[calm threatening] You come to me with such disrespect? This is not how we do business!",
    'cracked-controller': "[panicked] This controller is straight **trash**! I'm about to throw this thing!"
  };
  
  return testPhrases[style];
};

// Export all voice IDs for reference
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