import { RageStyle } from '../config/elevenLabsVoices';

// Convert stage directions to audio tags WITHOUT reading them
function convertStageDirectionsToTags(text: string): string {
  let processedText = text;
  
  // Extract parenthetical stage directions and REMOVE them
  const stageDirectionRegex = /\(([^)]+)\)/g;
  const matches = Array.from(text.matchAll(stageDirectionRegex));
  
  let audioTags = [];
  
  matches.forEach(match => {
    const direction = match[1].toLowerCase();
    
    // Convert to audio tags but DON'T include in speech
    if (direction.includes('aggressive')) audioTags.push('[aggressive]');
    if (direction.includes('controlled')) audioTags.push('[measured]');
    if (direction.includes('disgusted')) audioTags.push('[disgusted]');
    if (direction.includes('screaming')) audioTags.push('[shouting]');
    if (direction.includes('face flushing')) audioTags.push('[angry]');
    if (direction.includes('fists clenching')) audioTags.push('[tense]');
    if (direction.includes('voice rising')) audioTags.push('[escalating]');
    if (direction.includes('calm')) audioTags.push('[calm]');
    if (direction.includes('threatening')) audioTags.push('[threatening]');
    if (direction.includes('explosive')) audioTags.push('[explosive]');
    if (direction.includes('building')) audioTags.push('[building intensity]');
    if (direction.includes('fury')) audioTags.push('[furious]');
    if (direction.includes('rage')) audioTags.push('[rage]');
    
    // Remove the parenthetical completely
    processedText = processedText.replace(match[0], '');
  });
  
  // Add collected tags at the beginning
  if (audioTags.length > 0) {
    processedText = audioTags.join(' ') + ' ' + processedText;
  }
  
  return processedText.trim();
}

export function addAudioTags(text: string, angerLevel: number, style: RageStyle): string {
  // Remove markdown bold markers first
  let cleanedText = text.replace(/\*\*/g, '');
  
  // Convert and remove stage directions
  let taggedText = convertStageDirectionsToTags(cleanedText);
  
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
    .replace(/\? /g, '? [pause] ')
    .replace(/\.\.\./g, '... [pause]')
    .replace(/\b[A-Z]{3,}\b/g, match => `[emphasis] ${match}`)
    .replace(/!+/g, '! [pause] ')
    // Fix profanity - keep asterisks for bleeping
    .replace(/\b(\w)\*+(\w+)\b/g, '$1*$2'); // sh*te stays as sh*te
  
  return taggedText.trim();
}

export function cleanTextForDisplay(text: string): string {
  // Remove ALL formatting: parentheses, brackets, and markdown
  let cleaned = text
    .replace(/\*\*/g, '') // Remove markdown bold
    .replace(/\[[^\]]+\]/g, '') // Remove [audio tags]
    .replace(/\([^)]*\)/g, ''); // Remove (stage directions)
  
  // Keep removing parentheses until they're all gone
  while (cleaned.includes('(') && cleaned.includes(')')) {
    cleaned = cleaned.replace(/\([^)]*\)/g, '');
  }
  
  // Clean up extra spaces and punctuation
  return cleaned
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?])/g, '$1')
    .trim();
}