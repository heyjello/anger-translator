import { RageStyle } from '../config/elevenLabsVoices';

// Convert stage directions to ElevenLabs audio tags
function convertStageDirectionsToTags(text: string): string {
  let processedText = text;
  
  // Extract and convert parenthetical stage directions
  const stageDirectionRegex = /\(([^)]+)\)/g;
  const matches = Array.from(text.matchAll(stageDirectionRegex));
  
  matches.forEach(match => {
    const direction = match[1].toLowerCase();
    let tags = '';
    
    // Convert common stage directions to audio tags
    if (direction.includes('aggressive')) tags += '[aggressive] ';
    if (direction.includes('controlled')) tags += '[measured] ';
    if (direction.includes('disgusted')) tags += '[disgusted] ';
    if (direction.includes('screaming')) tags += '[shouting] ';
    if (direction.includes('sarcastic')) tags += '[sarcastic] ';
    if (direction.includes('pause')) tags += '[pause] ';
    if (direction.includes('slow')) tags += '[slow] ';
    if (direction.includes('fast')) tags += '[fast] ';
    if (direction.includes('whisper')) tags += '[whispers] ';
    if (direction.includes('laugh')) tags += '[laughs] ';
    if (direction.includes('sigh')) tags += '[sighs] ';
    if (direction.includes('calm')) tags += '[calm] ';
    if (direction.includes('threatening')) tags += '[threatening] ';
    if (direction.includes('explosive')) tags += '[explosive] ';
    if (direction.includes('building')) tags += '[building intensity] ';
    if (direction.includes('fury')) tags += '[furious] ';
    if (direction.includes('rage')) tags += '[rage] ';
    
    // Replace the parenthetical with tags at the beginning of the sentence
    if (tags) {
      processedText = processedText.replace(match[0], '').trim();
      // Find the start of the sentence and add tags
      const sentenceStart = processedText.lastIndexOf('. ', processedText.indexOf(match[0])) + 2;
      processedText = processedText.slice(0, sentenceStart) + tags + processedText.slice(sentenceStart);
    } else {
      // If no specific tags found, just remove the parenthetical
      processedText = processedText.replace(match[0], '').trim();
    }
  });
  
  return processedText;
}

export function addAudioTags(text: string, angerLevel: number, style: RageStyle): string {
  // First, convert any stage directions to tags
  let taggedText = convertStageDirectionsToTags(text);
  
  // Character-specific opening tags
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
  
  taggedText = `${characterTags[style]} ${taggedText}`;
  
  // Add natural pauses and emphasis
  taggedText = taggedText
    // Add pauses after questions
    .replace(/\? /g, '? [pause] ')
    // Add pauses for ellipses
    .replace(/\.\.\./g, '... [pause]')
    // Add emphasis for all caps words
    .replace(/\b[A-Z]{3,}\b/g, match => `[emphasis] ${match}`)
    // Add pause before final exclamation
    .replace(/([.!?])(\s+)([^.!?]+!)\s*$/g, '$1$2[pause] $3')
    // Fix profanity to be inline
    .replace(/\*([^*]+)\*/g, '*BLEEP*');
  
  // Add intensity-based reactions
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
    
    // Add rage tags after strong punctuation
    taggedText = taggedText.replace(/!+\s*/g, `! ${rageTags[style]} `);
  }
  
  return taggedText;
}

export function cleanTextForDisplay(text: string): string {
  // Remove all audio tags and parenthetical stage directions for display
  return text
    .replace(/\[[^\]]+\]/g, '') // Remove [audio tags]
    .replace(/\([^)]*\)/g, '') // Remove (stage directions)
    .replace(/\s+/g, ' ')
    .trim();
}