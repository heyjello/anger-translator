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

/**
 * Analyze input text to understand the context and generate appropriate rage response
 */
const analyzeInputContext = (text: string): { 
  isRequest: boolean; 
  isComplaint: boolean; 
  isTest: boolean;
  isGreeting: boolean;
  isQuestion: boolean;
  subject: string;
} => {
  const lowerText = text.toLowerCase();
  
  return {
    isRequest: /\b(please|can you|could you|would you|help|need)\b/.test(lowerText),
    isComplaint: /\b(problem|issue|wrong|broken|bad|terrible|awful)\b/.test(lowerText),
    isTest: /\b(test|testing|check)\b/.test(lowerText),
    isGreeting: /\b(hello|hi|hey|good morning|good afternoon)\b/.test(lowerText),
    isQuestion: text.includes('?'),
    subject: text.length > 20 ? 'this situation' : 'this'
  };
};

// The Enforcer - Luther-style righteous fury
const generateEnforcerRant = (text: string, intensity: number): string => {
  const context = analyzeInputContext(text);
  let response = "";
  
  if (intensity <= 30) {
    if (context.isTest) {
      response = "Listen here, you wanna test something? Test my patience and see what happens!";
    } else if (context.isRequest) {
      response = "Oh, so now you need something from me? That's real convenient.";
    } else if (context.isGreeting) {
      response = "Don't you 'hello' me like everything's all good when it ain't!";
    } else {
      response = "I see what's happening here and I'm not having it. Not today.";
    }
  } else if (intensity <= 60) {
    if (context.isTest) {
      response = "OH HELL NAH! You wanna test something? I wish you would! This some bullshit right here!";
    } else if (context.isRequest) {
      response = "Are you SERIOUS right now? You think I'm just gonna drop everything for this?";
    } else if (context.isComplaint) {
      response = "Problems? You don't even KNOW what problems are yet!";
    } else {
      response = "I've had it UP TO HERE with this nonsense! What is WRONG with people?";
    }
  } else {
    if (context.isTest) {
      response = "Boy if you don't... TEST THIS! You bout to get a REAL test of my patience! AND THAT'S ON PERIOD!";
    } else if (context.isRequest) {
      response = "ARE YOU OUT OF YOUR DAMN MIND?! I'm bout to LOSE IT over here! Case CLOSED!";
    } else {
      response = "I'M DONE! ABSOLUTELY DONE! This is the LAST TIME I deal with this garbage!";
    }
  }
  
  return addDynamicAudioTags(response, 'enforcer', intensity);
};

// The Highland Howler - Explosive Scottish Dad
const generateHighlandHowlerRant = (text: string, intensity: number): string => {
  const context = analyzeInputContext(text);
  let response = "";
  
  if (intensity <= 30) {
    if (context.isTest) {
      response = "Och, testing are we? Aye, that's brilliant, that is.";
    } else if (context.isRequest) {
      response = "So you need something from me now? What am I, your personal servant?";
    } else {
      response = "Right, so this is what we're doing now? Fantastic.";
    }
  } else if (intensity <= 60) {
    if (context.isTest) {
      response = "For crying out LOUD! Testing? What in the name of the wee man is this about?";
    } else if (context.isRequest) {
      response = "Ya absolute weapon! You think I've got nothing better to do?";
    } else {
      response = "This is pure mental! What kind of nonsense is this supposed to be?";
    }
  } else {
    if (context.isTest) {
      response = "BLOODY HELL! Test THIS ya daft wee BAMPOT! Away and bile yer HEID!";
    } else if (context.isRequest) {
      response = "What in the name of... I'll do it maSELF before I deal with this garbage!";
    } else {
      response = "RIGHT! That's IT! I've had enough of this absolute NONSENSE!";
    }
  }
  
  return addDynamicAudioTags(response, 'highland-howler', intensity);
};

// The Don - NY Italian-American
const generateDonRant = (text: string, intensity: number): string => {
  const context = analyzeInputContext(text);
  let response = "";
  
  if (intensity <= 30) {
    if (context.isTest) {
      response = "Ay, you wanna test something? Test my patience, see what happens.";
    } else if (context.isRequest) {
      response = "So now you come to me with this? What am I, chopped liver?";
    } else {
      response = "Listen here, this ain't how we do things, capisce?";
    }
  } else if (intensity <= 60) {
    if (context.isTest) {
      response = "What's ya PROBLEM? You think this is some kind of game?";
    } else if (context.isRequest) {
      response = "Ya mook! You got some nerve coming to me with this!";
    } else {
      response = "This is ridiculous! What kind of operation you think I'm running here?";
    }
  } else {
    if (context.isTest) {
      response = "FUGGEDABOUTIT! You wanna test? I'll give you a test ya GAVONE!";
    } else if (context.isRequest) {
      response = "You're breakin' my BALLS here! Don't make me come down there!";
    } else {
      response = "That's IT! I'm DONE with this disrespect! CAPISCE?";
    }
  }
  
  return addDynamicAudioTags(response, 'don', intensity);
};

// The Cracked Controller - Gen-Z Latino Gamer
const generateCrackedControllerRant = (text: string, intensity: number): string => {
  const context = analyzeInputContext(text);
  let response = "";
  
  if (intensity <= 30) {
    if (context.isTest) {
      response = "Bruh, testing? That's kinda sus, not gonna lie.";
    } else if (context.isRequest) {
      response = "Yo, you really asking me to do this right now? That's cap.";
    } else {
      response = "Nah bro, this ain't it. This is straight mid.";
    }
  } else if (intensity <= 60) {
    if (context.isTest) {
      response = "NAH BRO! Testing? This is straight TRASH! Skill ISSUE much?";
    } else if (context.isRequest) {
      response = "Are you KIDDING me right now? This is absolutely CRACKED!";
    } else {
      response = "¡No mames! This is getting me TILTED! What is this garbage?";
    }
  } else {
    if (context.isTest) {
      response = "WHAT THE SHIT! Testing? I'm about to UNINSTALL everything! RATIO + L + BOZO!";
    } else if (context.isRequest) {
      response = "Brooooo I'm getting CLAPPED by this nonsense! Touching GRASS after this!";
    } else {
      response = "I'M DONE! This whole thing is BROKEN! Time to rage quit!";
    }
  }
  
  return addDynamicAudioTags(response, 'cracked-controller', intensity);
};

// Karen - Suburban Entitlement
const generateKarenRant = (text: string, intensity: number): string => {
  const context = analyzeInputContext(text);
  let response = "";
  
  if (intensity <= 30) {
    if (context.isTest) {
      response = "Excuse me, but testing? I'm a paying customer and this is unacceptable.";
    } else if (context.isRequest) {
      response = "I shouldn't have to ask twice. This is poor customer service.";
    } else {
      response = "This is simply not acceptable. I expect better than this.";
    }
  } else if (intensity <= 60) {
    if (context.isTest) {
      response = "I'm SORRY, but testing? This is RIDICULOUS! I want to speak to your MANAGER!";
    } else if (context.isRequest) {
      response = "This is absolutely UNACCEPTABLE! Do you know who I AM?";
    } else {
      response = "I am a PAYING CUSTOMER and I will NOT be treated this way!";
    }
  } else {
    if (context.isTest) {
      response = "This is completely UNACCEPTABLE! I'm CALLING CORPORATE! My husband is a LAWYER!";
    } else if (context.isRequest) {
      response = "I will be leaving a DAMN REVIEW! This is going on FACEBOOK!";
    } else {
      response = "GET ME YOUR MANAGER RIGHT NOW! This is absolutely OUTRAGEOUS!";
    }
  }
  
  return addDynamicAudioTags(response, 'karen', intensity);
};

// Corporate - Professional passive-aggressive meltdown
const generateCorporateRant = (text: string, intensity: number): string => {
  const context = analyzeInputContext(text);
  let response = "";
  
  if (intensity <= 30) {
    if (context.isTest) {
      response = "As per my previous email, testing procedures should follow proper protocols.";
    } else if (context.isRequest) {
      response = "I need clarification on this request. Please advise on next steps.";
    } else {
      response = "This doesn't align with our established processes. Let's circle back on this.";
    }
  } else if (intensity <= 60) {
    if (context.isTest) {
      response = "I SHOULDN'T have to explain testing procedures again! This is the THIRD TIME!";
    } else if (context.isRequest) {
      response = "This request lacks proper documentation! Please advise how we can get ACTUAL RESULTS!";
    } else {
      response = "This is completely outside our SLA! We need to escalate this immediately!";
    }
  } else {
    if (context.isTest) {
      response = "I've had ENOUGH! Testing without proper approval is ABSOLUTELY UNACCEPTABLE!";
    } else if (context.isRequest) {
      response = "I'm DONE with this incompetence! Please advise how we can escalate to someone who ACTUALLY DOES THEIR JOB!";
    } else {
      response = "This is a COMPLETE FAILURE of our processes! I'm escalating this to senior management!";
    }
  }
  
  return addDynamicAudioTags(response, 'corporate', intensity);
};

// Sarcastic - Intellectual destruction
const generateSarcasticRant = (text: string, intensity: number): string => {
  const context = analyzeInputContext(text);
  let response = "";
  
  if (intensity <= 30) {
    if (context.isTest) {
      response = "Oh, how lovely. Testing. Truly enlightening.";
    } else if (context.isRequest) {
      response = "What a delightful request. How absolutely charming.";
    } else {
      response = "How wonderfully predictable. What a masterpiece of communication.";
    }
  } else if (intensity <= 60) {
    if (context.isTest) {
      response = "WOW, testing! I'm just THRILLED to witness this groundbreaking innovation!";
    } else if (context.isRequest) {
      response = "How absolutely RIVETING! What a masterpiece of professional communication!";
    } else {
      response = "Oh, MAGNIFICENT! Truly, your brilliance knows no bounds!";
    }
  } else {
    if (context.isTest) {
      response = "Oh, MAGNIFICENT! Testing! Truly, your competence knows NO BOUNDS! Absolutely EXQUISITE work!";
    } else if (context.isRequest) {
      response = "What a DELIGHTFUL way to waste everyone's time! Simply BREATHTAKING incompetence!";
    } else {
      response = "BRAVO! What an absolutely STUNNING display of professional excellence! Simply DIVINE!";
    }
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
      translation = `${style.toUpperCase()} Level ${intensity}: Please configure AI for dynamic responses!`;
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