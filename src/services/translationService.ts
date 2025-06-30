export interface TranslationRequest {
  text: string;
  style: 'enforcer' | 'highland-howler' | 'don' | 'cracked-controller' | 'karen' | 'corporate' | 'sarcastic';
  intensity: number;
}

export interface TranslationResponse {
  translatedText: string;
  success: boolean;
  error?: string;
}

/**
 * Dynamically add audio tags based on text content and emotion analysis
 */
const addDynamicAudioTags = (text: string, style: string, intensity: number): string => {
  let processedText = text;
  
  // Remove any existing parentheses and convert to square brackets
  processedText = processedText.replace(/\(([^)]+)\)/g, '[$1]');
  
  // Analyze text content for emotional cues and add appropriate audio tags
  const words = processedText.toLowerCase();
  
  // Detect emotional intensity from text content
  const hasAllCaps = /[A-Z]{3,}/.test(text);
  const hasExclamation = /!{2,}/.test(text);
  const hasQuestion = /\?/.test(text);
  const hasProfanity = /\b(damn|hell|shit|fuck|bullshit|crap)\b/i.test(text);
  
  // Add opening emotional context based on style and detected content
  let openingTag = '';
  switch (style) {
    case 'enforcer':
      if (intensity > 70) openingTag = '[angry] [threatening] ';
      else if (intensity > 40) openingTag = '[frustrated] [stern] ';
      else openingTag = '[disappointed] ';
      break;
    case 'highland-howler':
      if (intensity > 70) openingTag = '[explosive] [scottish accent] ';
      else if (intensity > 40) openingTag = '[annoyed] [gruff] ';
      else openingTag = '[scottish accent] [disappointed] ';
      break;
    case 'don':
      if (intensity > 70) openingTag = '[threatening calm] [italian accent] ';
      else if (intensity > 40) openingTag = '[stern] [new york accent] ';
      else openingTag = '[disappointed] [italian accent] ';
      break;
    case 'cracked-controller':
      if (intensity > 70) openingTag = '[panicked] [hyperactive] ';
      else if (intensity > 40) openingTag = '[frustrated] [energetic] ';
      else openingTag = '[annoyed] [gaming voice] ';
      break;
    case 'karen':
      if (intensity > 70) openingTag = '[demanding] [entitled] ';
      else if (intensity > 40) openingTag = '[fake sweet] [passive aggressive] ';
      else openingTag = '[polite but firm] ';
      break;
    case 'corporate':
      if (intensity > 70) openingTag = '[professional fury] [controlled anger] ';
      else if (intensity > 40) openingTag = '[passive aggressive] [building frustration] ';
      else openingTag = '[professional] [slightly annoyed] ';
      break;
    case 'sarcastic':
      if (intensity > 70) openingTag = '[dripping sarcasm] [mocking] ';
      else if (intensity > 40) openingTag = '[sarcastic] [condescending] ';
      else openingTag = '[dry humor] [slightly sarcastic] ';
      break;
  }
  
  // Add dynamic tags based on content analysis
  if (hasAllCaps) {
    processedText = processedText.replace(/\b[A-Z]{3,}\b/g, match => `[shouting] ${match.toLowerCase()}`);
  }
  
  if (hasExclamation) {
    processedText = processedText.replace(/!{2,}/g, '! [emphatic]');
  }
  
  if (hasQuestion) {
    processedText = processedText.replace(/\?/g, '? [questioning]');
  }
  
  if (hasProfanity) {
    processedText = processedText.replace(/\b(damn|hell|shit|fuck|bullshit|crap)\b/gi, match => `[angry] **${match}**`);
  }
  
  // Add pauses for dramatic effect
  processedText = processedText.replace(/\.\.\./g, '... [dramatic pause]');
  processedText = processedText.replace(/\. /g, '. [brief pause] ');
  
  // Detect and tag emotional phrases
  if (/\b(ridiculous|unacceptable|outrageous)\b/i.test(processedText)) {
    processedText = processedText.replace(/\b(ridiculous|unacceptable|outrageous)\b/gi, '[indignant] $1');
  }
  
  if (/\b(please|thank you|excuse me)\b/i.test(processedText)) {
    processedText = processedText.replace(/\b(please|thank you|excuse me)\b/gi, '[polite but strained] $1');
  }
  
  if (/\b(seriously|really|honestly)\b/i.test(processedText)) {
    processedText = processedText.replace(/\b(seriously|really|honestly)\b/gi, '[disbelief] $1');
  }
  
  // Add closing emotional tag based on intensity
  let closingTag = '';
  if (intensity > 80) {
    closingTag = ' [seething]';
  } else if (intensity > 60) {
    closingTag = ' [heated]';
  } else if (intensity > 40) {
    closingTag = ' [frustrated exhale]';
  }
  
  return `${openingTag}${processedText}${closingTag}`.replace(/\s+/g, ' ').trim();
};

// The Enforcer - Luther-style righteous fury
const generateEnforcerRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "Listen here, ";
    response += `${text.toLowerCase()} and I'm supposed to just accept this? `;
    response += "Oh, that's real nice. Real professional.";
  } else if (intensity <= 60) {
    response += "OH HELL NAH! ";
    response += `${text} and you think that's gonna fly? `;
    response += "I wish you would try that again! This some bullshit right here!";
  } else {
    response += "Boy if you don't... ";
    response += `${text.toUpperCase()} ARE YOU SERIOUS RIGHT NOW?! `;
    response += "I'm bout to LOSE IT over here! ";
    response += "AND THAT'S ON PERIOD! Case CLOSED!";
  }
  
  return addDynamicAudioTags(response, 'enforcer', intensity);
};

// The Highland Howler - Explosive Scottish Dad
const generateHighlandHowlerRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "Och, ";
    response += `${text.toLowerCase()} and I'm supposed to just sit here like some numpty? `;
    response += "Aye, that's brilliant, that is.";
  } else if (intensity <= 60) {
    response += "For crying out LOUD! ";
    response += `${text} - what in the name of the wee man is this? `;
    response += "Ya absolute weapon! This is pure mental!";
  } else {
    response += "What in the name of... ";
    response += `BLOODY HELL! ${text.toUpperCase()} ya daft wee BAMPOT! `;
    response += "I'll do it maSELF before I deal with this nonsense! ";
    response += "Away and bile yer HEID, the lot of ye!";
  }
  
  return addDynamicAudioTags(response, 'highland-howler', intensity);
};

// The Don - NY Italian-American
const generateDonRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "Ay, listen here - ";
    response += `${text.toLowerCase()} and you think that's acceptable? `;
    response += "What am I, chopped liver here?";
  } else if (intensity <= 60) {
    response += "What's ya PROBLEM here? ";
    response += `${text} - you gotta be kiddin' me! `;
    response += "Ya mook! This is ridiculous!";
  } else {
    response += "You come to me... ";
    response += `FUGGEDABOUTIT! ${text.toUpperCase()} ya GAVONE! `;
    response += "You're breakin' my BALLS here! ";
    response += "Don't make me come down there, capisce?";
  }
  
  return addDynamicAudioTags(response, 'don', intensity);
};

// The Cracked Controller - Gen-Z Latino Gamer
const generateCrackedControllerRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "Bruh, ";
    response += `${text.toLowerCase()} and I'm supposed to just deal with this? `;
    response += "That's cap, no shot.";
  } else if (intensity <= 60) {
    response += "NAH BRO! ";
    response += `${text} - this is straight TRASH! `;
    response += "Skill ISSUE much? ¡No mames!";
  } else {
    response += "Brooooo... ";
    response += `WHAT THE SHIT! ${text.toUpperCase()} and I'm getting CLAPPED! `;
    response += "I'm about to UNINSTALL this whole thing! ";
    response += "RATIO + L + BOZO! Touching GRASS after this!";
  }
  
  return addDynamicAudioTags(response, 'cracked-controller', intensity);
};

// Karen - Suburban Entitlement
const generateKarenRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "Excuse me, but ";
    response += `${text.toLowerCase()} and that's simply unacceptable. `;
    response += "I'm a paying customer here.";
  } else if (intensity <= 60) {
    response += "I'm SORRY, but ";
    response += `${text} - this is RIDICULOUS! `;
    response += "I want to speak to your MANAGER! Do you know who I AM?";
  } else {
    response += "This is completely... ";
    response += `UNACCEPTABLE! ${text.toUpperCase()} and I'm CALLING CORPORATE! `;
    response += "My husband is a LAWYER and I'm posting this on FACEBOOK! ";
    response += "I will be leaving a DAMN REVIEW!";
  }
  
  return addDynamicAudioTags(response, 'karen', intensity);
};

// Corporate - Professional passive-aggressive meltdown
const generateCorporateRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "As per my previous email, ";
    response += `${text.toLowerCase()} and I need clarification on this matter. `;
    response += "Please advise how we can move forward.";
  } else if (intensity <= 60) {
    response += "I SHOULDN'T have to explain this again! ";
    response += `${text} - this is the THIRD TIME I've addressed this! `;
    response += "Please advise how we can get some ACTUAL RESULTS!";
  } else {
    response += "I've had ENOUGH. ";
    response += `${text.toUpperCase()} and this is ABSOLUTELY UNACCEPTABLE! `;
    response += "I'm DONE with this incompetence! ";
    response += "Please advise how we can escalate this to someone who ACTUALLY DOES THEIR JOB!";
  }
  
  return addDynamicAudioTags(response, 'corporate', intensity);
};

// Sarcastic - Intellectual destruction
const generateSarcasticRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "Oh, how lovely. ";
    response += `${text.toLowerCase()} - truly enlightening. `;
    response += "What a delightful experience.";
  } else if (intensity <= 60) {
    response += "WOW, ";
    response += `${text} - I'm just THRILLED to deal with this! `;
    response += "How absolutely RIVETING! What a masterpiece of communication!";
  } else {
    response += "Oh, MAGNIFICENT. ";
    response += `${text.toUpperCase()} - truly, your competence knows NO BOUNDS! `;
    response += "What a DELIGHTFUL way to waste everyone's time! ";
    response += "Absolutely EXQUISITE work here!";
  }
  
  return addDynamicAudioTags(response, 'sarcastic', intensity);
};

// Main translation function with proper persona routing
const mockTranslate = async (request: TranslationRequest): Promise<TranslationResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  const { text, style, intensity } = request;
  
  let translation = "";
  
  switch (style) {
    case 'enforcer':
      translation = generateEnforcerRant(text, intensity);
      break;
    case 'highland-howler':
      translation = generateHighlandHowlerRant(text, intensity);
      break;
    case 'don':
      translation = generateDonRant(text, intensity);
      break;
    case 'cracked-controller':
      translation = generateCrackedControllerRant(text, intensity);
      break;
    case 'karen':
      translation = generateKarenRant(text, intensity);
      break;
    case 'corporate':
      translation = generateCorporateRant(text, intensity);
      break;
    case 'sarcastic':
      translation = generateSarcasticRant(text, intensity);
      break;
    default:
      translation = `${style.toUpperCase()} Level ${intensity}: ${text} - Please configure AI for dynamic responses!`;
  }
  
  return {
    translatedText: translation,
    success: true
  };
};

export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  if (!request.text?.trim()) {
    return {
      translatedText: '',
      success: false,
      error: 'No text provided for translation'
    };
  }

  if (request.text.length > 500) {
    return {
      translatedText: '',
      success: false,
      error: 'Text too long for translation'
    };
  }

  return await mockTranslate(request);
};

// Rate limiting helper
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 10, timeWindowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  getTimeUntilNextRequest(): number {
    if (this.requests.length < this.maxRequests) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    return Math.max(0, this.timeWindow - (Date.now() - oldestRequest));
  }
}

export const rateLimiter = new RateLimiter(10, 60000);