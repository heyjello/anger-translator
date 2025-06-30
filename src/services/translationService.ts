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

// The Enforcer - Luther-style righteous fury with proper tone cues
const generateEnforcerRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[disappointed] Listen here, ";
    response += `${text.toLowerCase()} and I'm supposed to just [frustrated] **accept this**? `;
    response += "[sarcastic] Oh, that's **real nice**. Real **professional**.";
  } else if (intensity <= 60) {
    response += "[annoyed] OH HELL NAH! ";
    response += `[angry] ${text} and you think that's gonna **fly**? `;
    response += "[mocking] I *wish* you would try that again! [laughing] This some **bulls**t** right here!";
  } else {
    response += "[threatening calm] Boy if you don't... ";
    response += `[explosive] **${text.toUpperCase()}** [shouting] ARE YOU **SERIOUS** RIGHT NOW?! `;
    response += "[sputtering] I'm bout to **LOSE IT** over here! [exhales sharply] ";
    response += "[mic drop] **AND THAT'S ON PERIOD!** Case **CLOSED**!";
  }
  
  return response;
};

// The Highland Howler - Explosive Scottish Dad with authentic dialect
const generateHighlandHowlerRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[disappointed] Och, ";
    response += `${text.toLowerCase()} and I'm supposed to just [frustrated] **sit here** like some numpty? `;
    response += "[sarcastic] Aye, that's **brilliant**, that is.";
  } else if (intensity <= 60) {
    response += "[annoyed] For crying out **LOUD**! ";
    response += `[angry] ${text} - what in the name of the **wee man** is this? `;
    response += "[mocking] Ya absolute **weapon**! [laughing] This is pure **mental**!";
  } else {
    response += "[threatening calm] What in the name of... ";
    response += `[explosive] **BLOODY HELL!** [shouting] ${text.toUpperCase()} ya daft wee **BAMPOT**! `;
    response += "[sputtering] I'll do it ma**SELF** before I deal with this **nonsense**! [exhales sharply] ";
    response += "[boiling] Away and bile yer **HEID**, the lot of ye!";
  }
  
  return response;
};

// The Don - NY Italian-American with Brooklyn energy
const generateDonRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[disappointed] Ay, listen here - ";
    response += `${text.toLowerCase()} and you think that's **acceptable**? `;
    response += "[frustrated] What am I, chopped **liver** here?";
  } else if (intensity <= 60) {
    response += "[annoyed] What's ya **PROBLEM** here? ";
    response += `[angry] ${text} - you gotta be **kiddin'** me! `;
    response += "[mocking] Ya **mook**! [laughing] This is **ridiculous**!";
  } else {
    response += "[threatening calm] You come to me... ";
    response += `[explosive] **FUGGEDABOUTIT!** [shouting] ${text.toUpperCase()} ya **GAVONE**! `;
    response += "[furious calm] You're breakin' my **BALLS** here! [offended] ";
    response += "[yelling] Don't make me come down there, **capisce**?";
  }
  
  return response;
};

// The Cracked Controller - Gen-Z Latino Gamer with panic energy
const generateCrackedControllerRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[disappointed] Bruh, ";
    response += `${text.toLowerCase()} and I'm supposed to just [frustrated] **deal with this**? `;
    response += "[sarcastic] That's **cap**, no shot.";
  } else if (intensity <= 60) {
    response += "[annoyed] NAH **BRO**! ";
    response += `[angry] ${text} - this is straight **TRASH**! `;
    response += "[mock disbelief] Skill **ISSUE** much? [laughing] ¡No **mames**!";
  } else {
    response += "[threatening calm] Brooooo... ";
    response += `[explosive] **WHAT THE BLEEP!** [screaming] ${text.toUpperCase()} and I'm getting **CLAPPED**! `;
    response += "[panicked] I'm about to **UNINSTALL** this whole thing! [hyperventilating] ";
    response += "[rage quit] **RATIO + L + BOZO!** Touching **GRASS** after this!";
  }
  
  return response;
};

// Karen - Suburban Entitlement with escalating demands
const generateKarenRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[fake-nice] Excuse me, but ";
    response += `${text.toLowerCase()} and that's simply [frustrated] **unacceptable**. `;
    response += "[sarcastic] I'm a **paying customer** here.";
  } else if (intensity <= 60) {
    response += "[annoyed] I'm **SORRY**, but ";
    response += `[angry] ${text} - this is **RIDICULOUS**! `;
    response += "[condescending] I want to speak to your **MANAGER**! [mocking] Do you know who I **AM**?";
  } else {
    response += "[threatening calm] This is completely... ";
    response += `[explosive] **UNACCEPTABLE!** [screeching] ${text.toUpperCase()} and I'm **CALLING CORPORATE**! `;
    response += "[dead calm] My husband is a **LAWYER** and I'm posting this on **FACEBOOK**! ";
    response += "[nuclear] I *will* be leaving a **REVIEW**!";
  }
  
  return response;
};

// Corporate - Professional passive-aggressive meltdown
const generateCorporateRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[professional calm] As per my previous email, ";
    response += `${text.toLowerCase()} and I [building frustration] **need clarification** on this matter. `;
    response += "[sarcastic] Please **advise** how we can move forward.";
  } else if (intensity <= 60) {
    response += "[frustrated] I **SHOULDN'T** have to explain this again! ";
    response += `[angry] ${text} - this is the **THIRD TIME** I've addressed this! `;
    response += "[barely contained] Please advise how we can get some **ACTUAL RESULTS**!";
  } else {
    response += "[threatening calm] I've had **ENOUGH**. ";
    response += `[explosive] **${text.toUpperCase()}** [shouting] and this is **ABSOLUTELY UNACCEPTABLE**! `;
    response += "[professional fury] I'm **DONE** with this incompetence! ";
    response += "[mic drop] Please advise how we can escalate this to someone who **ACTUALLY DOES THEIR JOB**!";
  }
  
  return response;
};

// Sarcastic - Intellectual destruction with wit
const generateSarcasticRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[dripping sarcasm] Oh, how **lovely**. ";
    response += `${text.toLowerCase()} - [mock enthusiasm] truly **enlightening**. `;
    response += "[intellectual superiority] What a **delightful** experience.";
  } else if (intensity <= 60) {
    response += "[mock enthusiasm] **WOW**, ";
    response += `[sarcastic] ${text} - I'm just **THRILLED** to deal with this! `;
    response += "[dripping sarcasm] How absolutely **RIVETING**! What a **masterpiece** of communication!";
  } else {
    response += "[threatening calm] Oh, **MAGNIFICENT**. ";
    response += `[explosive sarcasm] **${text.toUpperCase()}** [mock enthusiasm] - truly, your competence knows **NO BOUNDS**! `;
    response += "[intellectual destruction] What a **DELIGHTFUL** way to waste everyone's time! ";
    response += "[devastating wit] Absolutely **EXQUISITE** work here!";
  }
  
  return response;
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
      translation = `[Mock Response] ${style.toUpperCase()} Level ${intensity}: ${text} - Please configure AI for dynamic responses!`;
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