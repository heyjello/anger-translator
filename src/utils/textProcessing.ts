import { RageStyle } from '../config/elevenLabsVoices';

/**
 * Enhanced text processing for ElevenLabs v3 with natural language audio tags
 * Converts stage directions to natural language that ElevenLabs v3 understands
 */

export function addAudioTags(text: string, angerLevel: number, style: RageStyle): string {
  // Remove markdown formatting
  let processedText = text.replace(/\*\*/g, '').replace(/^\*|\*$/g, '');
  
  // Convert parentheses to brackets for ElevenLabs v3
  // ElevenLabs v3 understands natural language in brackets!
  processedText = processedText.replace(/\(([^)]+)\)/g, '[$1]');
  
  // Character-specific opening tags using natural language
  const characterTags: Record<string, string> = {
    corporate: '[professional tone] [passive aggressive]',
    gamer: '[shouting] [frantic energy]',
    sarcastic: '[british accent] [dismissive tone]',
    karen: '[entitled voice] [demanding tone]',
    'scottish-dad': '[scottish accent] [gruff voice]',
    'ny-italian': '[new york accent] [tough guy voice]',
    enforcer: '[menacing tone] [deep authoritative voice]',
    'highland-howler': '[scottish accent] [explosive anger]',
    don: '[italian accent] [measured threatening tone]',
    'cracked-controller': '[unhinged voice] [screaming with panic]'
  };
  
  // Add character tags at the beginning
  processedText = `${characterTags[style]} ${processedText}`;
  
  // Add natural pauses and emphasis using ElevenLabs v3 natural language
  processedText = processedText
    .replace(/\? /g, '? [brief pause] ')
    .replace(/\.\.\./g, '... [dramatic pause] ')
    .replace(/!+/g, '! [short pause] ')
    // Convert ALL CAPS to emphasis tags
    .replace(/\b[A-Z]{2,}\b/g, match => `[emphasize] ${match.toLowerCase()}`)
    // Keep profanity markers for bleeping
    .replace(/\b(\w+)\*(\w*)\b/g, '**$1$2**'); // Convert f*ck to **fuck** for bleeping
  
  // Add intensity-based emotional tags
  if (angerLevel >= 70) {
    processedText = `[extremely angry] [voice shaking with rage] ${processedText}`;
  } else if (angerLevel >= 50) {
    processedText = `[very angry] [heated voice] ${processedText}`;
  } else if (angerLevel >= 30) {
    processedText = `[moderately angry] [frustrated tone] ${processedText}`;
  } else {
    processedText = `[mildly annoyed] [controlled irritation] ${processedText}`;
  }
  
  return processedText.replace(/\s+/g, ' ').trim();
}

export function cleanTextForDisplay(text: string): string {
  // Remove ALL audio formatting tags for clean user display
  let cleaned = text;
  
  // Remove ElevenLabs emphasis tags like <emphasis level="strong">text</emphasis>
  cleaned = cleaned.replace(/<emphasis[^>]*>(.*?)<\/emphasis>/gi, '$1');
  
  // Remove ElevenLabs prosody tags like <prosody rate="1.3" pitch="+15%">text</prosody>
  cleaned = cleaned.replace(/<prosody[^>]*>(.*?)<\/prosody>/gi, '$1');
  
  // Remove any other XML-style tags
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  
  // Remove square bracket audio tags like [angry], [shouting], etc.
  cleaned = cleaned.replace(/\[[^\]]+\]/g, '');
  
  // Remove parenthetical stage directions
  cleaned = cleaned.replace(/\([^)]*\)/g, '');
  
  // Remove markdown bold markers
  cleaned = cleaned.replace(/\*\*/g, '');
  
  // Keep removing nested parentheses until they're all gone
  while (cleaned.includes('(') && cleaned.includes(')')) {
    cleaned = cleaned.replace(/\([^)]*\)/g, '');
  }
  
  // Clean up extra spaces and punctuation
  return cleaned
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?])/g, '$1')
    .trim();
}

/**
 * Test function to show the transformation
 */
export function testAudioTagConversion(text: string, style: RageStyle, angerLevel: number): void {
  console.log('🧪 Testing Audio Tag Conversion:');
  console.log('📝 Original:', text);
  
  const withTags = addAudioTags(text, angerLevel, style);
  console.log('🎤 With Audio Tags:', withTags);
  
  const cleaned = cleanTextForDisplay(text);
  console.log('👁️ Display Version:', cleaned);
}