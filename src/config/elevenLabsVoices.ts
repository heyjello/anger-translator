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
    voice_id: "opAH2ij5oCyMnsDUGrpR", // YOUR CUSTOM Karen voice
    name: "Karen",
    description: "Custom Karen voice",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  'scottish-dad': {
    voice_id: "VR6AewLTigWG4xSOukaG", // Arnold
    name: "Arnold",
    description: "Deep male voice",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  'ny-italian': {
    voice_id: "CaYmcrR5WjNfLsVo7ReL", // YOUR CUSTOM NY Italian voice
    name: "NY Italian",
    description: "Custom NY Italian voice",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  enforcer: {
    voice_id: "ujTRvH905hCgW1uUwWye", // YOUR CUSTOM Enforcer voice
    name: "Enforcer",
    description: "Custom Enforcer voice",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  'highland-howler': {
    voice_id: "cTMt3eRoD8RF6F0MIt0q", // YOUR CUSTOM Highland Howler voice
    name: "Highland Howler",
    description: "Custom Scottish Highland voice",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  don: {
    voice_id: "CaYmcrR5WjNfLsVo7ReL", // YOUR CUSTOM NY Italian voice (reused for Don)
    name: "Don",
    description: "Custom NY Italian voice for Don persona",
    voice_settings: { ...DEFAULT_VOICE_SETTINGS }
  },
  'cracked-controller': {
    voice_id: "ErXwobaYiN019PkySvjV", // Antoni (good for energetic gamer)
    name: "Antoni",
    description: "High energy male voice for cracked gamer",
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

// Voice model configurations
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
 * Clean text for TTS - removes tone cues, preserves audio tags and profanity markers
 * - Removes [tone cues] completely (not needed for TTS)
 * - Preserves <audio>tags</audio> for ElevenLabs processing
 * - Preserves **profanity** markers for bleeping system
 */
export const cleanTextForTTS = (text: string): string => {
  let cleanedText = text;
  
  // Remove tone cues like [explosive energy], [screaming], etc.
  cleanedText = cleanedText.replace(/\[([^\]]+)\]/g, '');
  
  // Keep audio tags like <emphasis>, <break>, <prosody> for ElevenLabs
  // Keep **profanity** markers for bleeping system
  
  // Remove multiple spaces and clean up
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  
  return cleanedText;
};

/**
 * Clean text for user display - removes tone cues and audio tags, preserves profanity markers
 * - Removes [tone cues] (user doesn't need to see these)
 * - Removes <audio>tags</audio> but keeps the content (user doesn't need to see markup)
 * - Preserves **profanity** markers for visual indication of bleeping
 */
export const cleanTextForUser = (text: string): string => {
  let cleanedText = text;
  
  // Remove tone cues like [explosive energy], [screaming], etc.
  cleanedText = cleanedText.replace(/\[([^\]]+)\]/g, '');
  
  // Remove audio tags but keep the content
  cleanedText = cleanedText.replace(/<emphasis[^>]*>([^<]+)<\/emphasis>/g, '$1');
  cleanedText = cleanedText.replace(/<break[^>]*>/g, '');
  cleanedText = cleanedText.replace(/<prosody[^>]*>([^<]+)<\/prosody>/g, '$1');
  cleanedText = cleanedText.replace(/<[^>]+>/g, ''); // Remove any remaining tags
  
  // Keep **profanity** markers for visual indication and bleeping
  
  // Remove multiple spaces and clean up
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  
  return cleanedText;
};

// NO TEXT PREPROCESSING - Just clean tone cues, preserve audio tags and profanity
export const preprocessTextForStyle = (
  text: string, 
  style: RageStyle,
  intensity: number
): string => {
  // Only remove tone cues, preserve audio tags and profanity markers
  return cleanTextForTTS(text);
};

// Voice testing utilities
export const createTestPhrase = (style: RageStyle): string => {
  const testPhrases = {
    corporate: "As per my previous email, I need you to review this document immediately.",
    gamer: "This is straight trash! I'm about to uninstall this whole thing!",
    sarcastic: "Oh, how absolutely riveting! Truly, your eloquence knows no bounds!",
    karen: "Excuse me, I want to speak to your manager RIGHT NOW!",
    'scottish-dad': "What in the bloody hell were ye thinking, laddie?",
    'ny-italian': "You gotta be kiddin' me with this! Fuggedaboutit!",
    enforcer: "OH HELL NAH! You must be joking if you think I'm gonna let this slide!",
    'highland-howler': "What in the name of the wee man is this nonsense?!",
    don: "You come to me with such disrespect? This is not how we do business!",
    'cracked-controller': "This controller is straight trash! I'm about to throw this thing!"
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
  dorothy: "ThT5KcBeYPX3keUQqHPh",
  // YOUR CUSTOM VOICES
  highlandHowler: "cTMt3eRoD8RF6F0MIt0q",
  karen: "opAH2ij5oCyMnsDUGrpR",
  nyItalian: "CaYmcrR5WjNfLsVo7ReL",
  enforcer: "ujTRvH905hCgW1uUwWye"
} as const;