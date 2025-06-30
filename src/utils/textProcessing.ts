import { RageStyle } from '../config/elevenLabsVoices';

export function addAudioTags(text: string, angerLevel: number, style: RageStyle): string {
  // Character-specific opening tags for ElevenLabs v3
  const characterTags: Record<string, string> = {
    corporate: '[professional] [passive aggressive]',
    gamer: '[shouting] [frantic]',
    sarcastic: '[british accent] [dismissive]',
    karen: '[entitled] [demanding]',
    'scottish-dad': '[scottish accent] [gruff]',
    'ny-italian': '[new york accent] [tough]',
    enforcer: '[menacing] [deep voice]',
    'highland-howler': '[scottish accent] [battle cry]',
    don: '[italian accent] [measured]',
    'cracked-controller': '[unhinged] [screaming]'
  };
  
  let taggedText = `${characterTags[style]} ${text}`;
  
  // Add intensity-based reactions for high anger
  if (angerLevel >= 7) {
    const rageTags: Record<string, string> = {
      corporate: '[barely contained rage]',
      gamer: '[keyboard smashing]',
      sarcastic: '[laughs mockingly]',
      karen: '[shrill screaming]',
      'scottish-dad': '[incomprehensible scottish]',
      'ny-italian': '[hand gestures intensify]',
      enforcer: '[cracking knuckles]',
      'highland-howler': '[war cry]',
      don: '[deadly quiet]',
      'cracked-controller': '[controller throwing sounds]'
    };
    
    // Insert rage tags after exclamation marks
    taggedText = taggedText.replace(/! /g, `! ${rageTags[style]} `);
  }
  
  // Add natural pauses and emphasis
  taggedText = taggedText
    .replace(/\.\.\./g, '... [pause]')
    .replace(/\b[A-Z]{3,}\b/g, match => `[emphasis] ${match}`)
    // Fix profanity to be inline without breaks
    .replace(/\*([^*]+)\*/g, '*BLEEP*');
  
  return taggedText;
}

export function cleanTextForDisplay(text: string): string {
  // Remove all audio tags for user display
  return text
    .replace(/\[[^\]]+\]/g, '') // Remove [audio tags]
    .replace(/\s+/g, ' ')
    .trim();
}