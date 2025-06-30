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
 * Clean text for TTS - preserves ElevenLabs v3 audio tags and profanity markers
 * - Removes [tone cues] completely (not needed for TTS)
 * - Preserves <audio>tags</audio> for ElevenLabs v3 processing
 * - Preserves **profanity** markers for bleeping system
 */
export const cleanTextForTTS = (text: string): string => {
  let cleanedText = text;
  
  // Remove tone cues like [explosive energy], [screaming], etc.
  cleanedText = cleanedText.replace(/\[([^\]]+)\]/g, '');
  
  // Keep ElevenLabs v3 audio tags like <emphasis>, <break>, <prosody>
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
  
  // Remove ElevenLabs v3 audio tags but keep the content
  cleanedText = cleanedText.replace(/<emphasis[^>]*>([^<]+)<\/emphasis>/g, '$1');
  cleanedText = cleanedText.replace(/<break[^>]*\/>/g, ' ');
  cleanedText = cleanedText.replace(/<break[^>]*><\/break>/g, ' ');
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
  dorothy: "ThT5KcBeYPX3keUQqHPh"
} as const;