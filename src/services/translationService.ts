export interface TranslationRequest {
  text: string;
  style: 'corporate' | 'gamer' | 'sarcastic' | 'karen' | 'scottish-dad' | 'ny-italian';
  intensity: number;
}

export interface TranslationResponse {
  translatedText: string;
  success: boolean;
  error?: string;
}

// Scottish Dad translation patterns
const SCOTTISH_DAD_PATTERNS = {
  // Common Scottish expressions and swears
  expressions: [
    "Och, for crying out loud",
    "What in the name of the wee man",
    "Jesus wept",
    "Holy shite",
    "Bloody hell",
    "Christ on a bike",
    "For the love of all that's holy",
    "What fresh hell is this",
    "Aye, right",
    "Away and bile yer heid"
  ],
  
  // Glaswegian insults and terms
  insults: [
    "ya numpty",
    "ya daft wee bampot",
    "ya absolute weapon",
    "ya muppet",
    "ya clown",
    "ya rocket",
    "ya tube",
    "ya walloper",
    "ya eejit",
    "ya pure mental case"
  ],
  
  // Tone cues for different situations
  toneCues: [
    "[shouting]",
    "[sputtering with rage]",
    "[deadpan disbelief]",
    "[mocking voice]",
    "[throwing hands up]",
    "[pacing around]",
    "[muttering under breath]",
    "[voice cracking with fury]",
    "[dramatic pause]",
    "[exasperated sigh]"
  ],
  
  // Scottish slang and phrases
  slang: [
    "pure dead brilliant",
    "absolute state of ye",
    "having a laugh",
    "taking the piss",
    "wind yer neck in",
    "get tae",
    "away wi ye",
    "gie it laldy",
    "pure mental",
    "off yer heid"
  ]
};

// NY Italian translation patterns
const NY_ITALIAN_PATTERNS = {
  // Classic NY Italian expressions
  expressions: [
    "Ay, what's ya problem here?",
    "You gotta be kiddin' me!",
    "Fuggedaboutit!",
    "What am I, chopped liver?",
    "You think I was born yesterday?",
    "Get outta here with that!",
    "Are you outta ya mind?",
    "What's the matter with you?",
    "You're breakin' my balls here!",
    "Madonna mia!"
  ],
  
  // Insults and put-downs
  insults: [
    "ya mook",
    "ya jamook",
    "ya gavone",
    "ya stunad",
    "ya cafone",
    "ya jagoff",
    "ya mezza-morto",
    "ya stunod",
    "ya mamaluke",
    "ya schifoso"
  ],
  
  // Tone cues
  toneCues: [
    "[yelling]",
    "[mocking]",
    "[threatening calm]",
    "[offended]",
    "[gesticulating wildly]",
    "[throwing hands up]",
    "[leaning in menacingly]",
    "[voice rising]",
    "[incredulous]",
    "[disgusted]"
  ],
  
  // NY Italian slang and phrases
  slang: [
    "capisce?",
    "bada-bing bada-boom",
    "what's ya story?",
    "you're killin' me here",
    "I'm walkin' here!",
    "get the hell outta here",
    "you're bustin' my chops",
    "what's with the attitude?",
    "don't give me that",
    "I ain't playin' around"
  ]
};

// Generate NY Italian translation
const generateNYItalianRant = (text: string, intensity: number): string => {
  const aggression = Math.floor(intensity * 0.5);
  const sarcasm = Math.floor(intensity * 0.4);
  const mockery = Math.floor(intensity * 0.4);
  
  let response = "";
  
  // Opening based on intensity
  if (intensity <= 20) {
    response += "[mildly annoyed] Ay, listen here - ";
  } else if (intensity <= 40) {
    response += "[getting heated] What's ya problem? ";
  } else if (intensity <= 60) {
    response += "[yelling] **AY, WHAT THE HELL** ";
  } else if (intensity <= 80) {
    response += "[gesticulating wildly] **MADONNA MIA!** What's the matter with you? ";
  } else {
    response += "[absolutely losing it] **FUGGEDABOUTIT!** You gotta be **OUTTA YA MIND** ";
  }
  
  // Context-aware rant based on input
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('computer') || lowerText.includes('tech') || lowerText.includes('software')) {
    response += `this **PIECE OF JUNK** computer is drivin' me up the wall! [throwing hands up] I'm tryna ${text.toLowerCase()} and it's like talkin' to a brick wall! `;
    if (intensity > 50) {
      response += "[mocking] Oh, what am I, some kinda **COMPUTER GENIUS** now? [offended] This thing's got less brains than my cousin Vinny, and that's sayin' somethin'!";
    }
  } else if (lowerText.includes('work') || lowerText.includes('job') || lowerText.includes('boss')) {
    response += `work's got me ready to **LOSE MY MIND**! [voice rising] ${text} - and they wonder why I'm ready to walk outta here! `;
    if (intensity > 60) {
      response += "[incredulous] What am I, a **MIRACLE WORKER**? [yelling] These people got some nerve, I tell ya! Capisce?";
    }
  } else if (lowerText.includes('traffic') || lowerText.includes('driving') || lowerText.includes('car')) {
    response += `the traffic today is **ABSOLUTELY INSANE**! [leaning in menacingly] ${text} - and every **MOOK** in the city decided to take their car out! `;
    if (intensity > 70) {
      response += "[threatening calm] Hey, genius! **LEARN TO DRIVE!** What'd you get ya license, from a Cracker Jack box?";
    }
  } else {
    // Generic rant
    response += `${text} - and I'm supposed to just sit here and take it like some kinda **STUNAD**? [disgusted] **NO WAY!** `;
    if (intensity > 40) {
      response += `[mocking] Oh, that makes **PERFECT SENSE**, right? [offended] What am I, chopped liver here? ${NY_ITALIAN_PATTERNS.insults[Math.floor(Math.random() * NY_ITALIAN_PATTERNS.insults.length)]}!`;
    }
  }
  
  // Intensity-based escalation
  if (intensity > 80) {
    response += ` [absolutely losing it] **I'VE HAD IT UP TO HERE** with this **BULL****! You're breakin' my balls here! Fuggedaboutit!`;
  } else if (intensity > 60) {
    response += ` [gesticulating wildly] This is **RIDICULOUS**, ya hear me? **RIDICULOUS!**`;
  } else if (intensity > 40) {
    response += ` [shaking head] Unbelievable... just **UNBELIEVABLE**.`;
  }
  
  return response;
};

// Generate Scottish Dad translation
const generateScottishDadRant = (text: string, intensity: number): string => {
  const disbelief = Math.floor(intensity * 0.5);
  const insults = Math.floor(intensity * 0.4);
  const sarcasm = Math.floor(intensity * 0.2);
  
  // Base response structure
  let response = "";
  
  // Opening expression based on intensity
  if (intensity <= 20) {
    response += "Och, ";
  } else if (intensity <= 40) {
    response += "[sighing heavily] Right, ";
  } else if (intensity <= 60) {
    response += "[shouting] **WHAT THE HELL** ";
  } else if (intensity <= 80) {
    response += "[sputtering with rage] **JESUS BLOODY CHRIST** ";
  } else {
    response += "[absolutely losing it] **WHAT IN THE NAME OF THE WEE MAN** ";
  }
  
  // Add context-aware rant
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('computer') || lowerText.includes('tech') || lowerText.includes('software')) {
    response += `this **BLOODY COMPUTER** is doing ma heid in! [throwing hands up] I've been trying to ${text.toLowerCase()} and it's like trying to teach a brick to dance! `;
    if (intensity > 50) {
      response += "**PURE MENTAL** this thing is! [deadpan] Aye, because that's exactly what I wanted to spend my Saturday doing - fighting wi' a machine that's got less sense than a chocolate teapot!";
    }
  } else if (lowerText.includes('work') || lowerText.includes('job') || lowerText.includes('boss')) {
    response += `work's got me **ABSOLUTELY RAGING**! [pacing around] ${text} - and they wonder why I'm ready to chuck it all in! `;
    if (intensity > 60) {
      response += "[mocking voice] Oh aye, because that's **TOTALLY REASONABLE**, ya absolute weapons! [shouting] I've had it up to here wi' the lot of them!";
    }
  } else if (lowerText.includes('traffic') || lowerText.includes('driving') || lowerText.includes('car')) {
    response += `the roads are **PURE CHAOS** today! [voice cracking with fury] ${text} - and every numpty in Glasgow's decided to take their car out for a wee jaunt! `;
    if (intensity > 70) {
      response += "**GET TAE!** [shouting] Learn to drive, ya muppets! It's like they got their licenses from a cereal box!";
    }
  } else {
    // Generic rant
    response += `${text} - and I'm supposed to just sit here and take it? [dramatic pause] **NAE CHANCE!** `;
    if (intensity > 40) {
      response += `[deadpan disbelief] Aye, because that makes **PERFECT SENSE**, doesn't it? ${SCOTTISH_DAD_PATTERNS.insults[Math.floor(Math.random() * SCOTTISH_DAD_PATTERNS.insults.length)]}!`;
    }
  }
  
  // Add intensity-based escalation
  if (intensity > 80) {
    response += ` [absolutely mental] **I'VE HAD IT UP TO HERE** wi' this pure dead brilliant nonsense! Away and bile yer heid, the lot of ye!`;
  } else if (intensity > 60) {
    response += ` [muttering] Absolute state of this... **PURE MENTAL**, so it is.`;
  } else if (intensity > 40) {
    response += ` [exasperated] Right, that's me done wi' this carry-on.`;
  }
  
  return response;
};

// Simplified mock translate that encourages AI usage
const mockTranslate = async (request: TranslationRequest): Promise<TranslationResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  const { text, style, intensity } = request;
  
  // Handle NY Italian style
  if (style === 'ny-italian') {
    const translation = generateNYItalianRant(text, intensity);
    return {
      translatedText: translation,
      success: true
    };
  }
  
  // Handle Scottish Dad style
  if (style === 'scottish-dad') {
    const translation = generateScottishDadRant(text, intensity);
    return {
      translatedText: translation,
      success: true
    };
  }
  
  // Simple fallback message for other styles
  const fallbackMessage = `[Mock Response] ${style.toUpperCase()} Level ${intensity}: ${text} - Please configure AI for dynamic responses!`;
  
  return {
    translatedText: fallbackMessage,
    success: true
  };
};

// Main translation function
export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  // Input validation
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
    // Remove old requests outside the time window
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

export const rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute