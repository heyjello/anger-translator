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

// The Enforcer - Luther-style righteous fury with audio tags and profanity system
const generateEnforcerRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[disappointed] Listen here, ";
    response += `${text.toLowerCase()} and I'm supposed to just [frustrated] <emphasis level="moderate">accept this</emphasis>? `;
    response += "[sarcastic] Oh, that's real nice. Real <emphasis level="moderate">professional</emphasis>.";
  } else if (intensity <= 60) {
    response += "[annoyed] OH HELL NAH! ";
    response += `[angry] ${text} and you think that's gonna <emphasis level="strong">fly</emphasis>? `;
    response += "[mocking] I wish you would try that again! [laughing] This some **bullshit** right here!";
  } else {
    response += "[threatening calm] Boy if you don't... ";
    response += `[explosive] <emphasis level="strong">${text.toUpperCase()}</emphasis> [shouting] ARE YOU **SERIOUS** RIGHT NOW?! `;
    response += "[sputtering] I'm bout to <emphasis level="strong">LOSE IT</emphasis> over here! [exhales sharply] ";
    response += "[mic drop] <emphasis level="strong">AND THAT'S ON PERIOD!</emphasis> Case **CLOSED**!";
  }
  
  return response;
};

// The Highland Howler - Explosive Scottish Dad with audio tags
const generateHighlandHowlerRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[disappointed] Och, ";
    response += `${text.toLowerCase()} and I'm supposed to just [frustrated] <emphasis level="moderate">sit here</emphasis> like some numpty? `;
    response += "[sarcastic] Aye, that's <emphasis level="moderate">brilliant</emphasis>, that is.";
  } else if (intensity <= 60) {
    response += "[annoyed] For crying out <emphasis level="strong">LOUD</emphasis>! ";
    response += `[angry] ${text} - what in the name of the <emphasis level="strong">wee man</emphasis> is this? `;
    response += "[mocking] Ya absolute <emphasis level="strong">weapon</emphasis>! [laughing] This is pure <emphasis level="strong">mental</emphasis>!";
  } else {
    response += "[threatening calm] What in the name of... ";
    response += `[explosive] **BLOODY HELL!** [shouting] ${text.toUpperCase()} ya daft wee <emphasis level="strong">BAMPOT</emphasis>! `;
    response += "[sputtering] I'll do it ma<emphasis level="strong">SELF</emphasis> before I deal with this <emphasis level="strong">nonsense</emphasis>! [exhales sharply] ";
    response += "[boiling] Away and bile yer <emphasis level="strong">HEID</emphasis>, the lot of ye!";
  }
  
  return response;
};

// The Don - NY Italian-American with audio tags
const generateDonRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[disappointed] Ay, listen here - ";
    response += `${text.toLowerCase()} and you think that's <emphasis level="moderate">acceptable</emphasis>? `;
    response += "[frustrated] What am I, chopped <emphasis level="moderate">liver</emphasis> here?";
  } else if (intensity <= 60) {
    response += "[annoyed] What's ya <emphasis level="strong">PROBLEM</emphasis> here? ";
    response += `[angry] ${text} - you gotta be <emphasis level="strong">kiddin'</emphasis> me! `;
    response += "[mocking] Ya <emphasis level="strong">mook</emphasis>! [laughing] This is <emphasis level="strong">ridiculous</emphasis>!";
  } else {
    response += "[threatening calm] You come to me... ";
    response += `[explosive] <emphasis level="strong">FUGGEDABOUTIT!</emphasis> [shouting] ${text.toUpperCase()} ya <emphasis level="strong">GAVONE</emphasis>! `;
    response += "[furious calm] You're breakin' my **BALLS** here! [offended] ";
    response += "[yelling] Don't make me come down there, <emphasis level="strong">capisce</emphasis>?";
  }
  
  return response;
};

// The Cracked Controller - Gen-Z Latino Gamer with audio tags
const generateCrackedControllerRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[disappointed] Bruh, ";
    response += `${text.toLowerCase()} and I'm supposed to just [frustrated] <emphasis level="moderate">deal with this</emphasis>? `;
    response += "[sarcastic] That's <emphasis level="moderate">cap</emphasis>, no shot.";
  } else if (intensity <= 60) {
    response += "[annoyed] NAH <emphasis level="strong">BRO</emphasis>! ";
    response += `[angry] ${text} - this is straight <emphasis level="strong">TRASH</emphasis>! `;
    response += "[mock disbelief] Skill <emphasis level="strong">ISSUE</emphasis> much? [laughing] ¡No <emphasis level="strong">mames</emphasis>!";
  } else {
    response += "[threatening calm] Brooooo... ";
    response += `[explosive] <prosody rate="1.3" pitch="+15%">**WHAT THE SHIT!**</prosody> [screaming] ${text.toUpperCase()} and I'm getting <emphasis level="strong">CLAPPED</emphasis>! `;
    response += "[panicked] I'm about to <emphasis level="strong">UNINSTALL</emphasis> this whole thing! [hyperventilating] ";
    response += "[rage quit] <emphasis level="strong">RATIO + L + BOZO!</emphasis> Touching <emphasis level="strong">GRASS</emphasis> after this!";
  }
  
  return response;
};

// Karen - Suburban Entitlement with audio tags
const generateKarenRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[fake-nice] Excuse me, but ";
    response += `${text.toLowerCase()} and that's simply [frustrated] <emphasis level="moderate">unacceptable</emphasis>. `;
    response += "[sarcastic] I'm a <emphasis level="moderate">paying customer</emphasis> here.";
  } else if (intensity <= 60) {
    response += "[annoyed] I'm <emphasis level="strong">SORRY</emphasis>, but ";
    response += `[angry] ${text} - this is <emphasis level="strong">RIDICULOUS</emphasis>! `;
    response += "[condescending] I want to speak to your <emphasis level="strong">MANAGER</emphasis>! [mocking] Do you know who I <emphasis level="strong">AM</emphasis>?";
  } else {
    response += "[threatening calm] This is completely... ";
    response += `[explosive] <emphasis level="strong">UNACCEPTABLE!</emphasis> [screeching] ${text.toUpperCase()} and I'm <emphasis level="strong">CALLING CORPORATE</emphasis>! `;
    response += "[dead calm] My husband is a <emphasis level="strong">LAWYER</emphasis> and I'm posting this on <emphasis level="strong">FACEBOOK</emphasis>! ";
    response += "[nuclear] I will be leaving a **DAMN** <emphasis level="strong">REVIEW</emphasis>!";
  }
  
  return response;
};

// Corporate - Professional passive-aggressive meltdown with audio tags
const generateCorporateRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[professional calm] As per my previous email, ";
    response += `${text.toLowerCase()} and I [building frustration] <emphasis level="moderate">need clarification</emphasis> on this matter. `;
    response += "[sarcastic] Please <emphasis level="moderate">advise</emphasis> how we can move forward.";
  } else if (intensity <= 60) {
    response += "[frustrated] I <emphasis level="strong">SHOULDN'T</emphasis> have to explain this again! ";
    response += `[angry] ${text} - this is the <emphasis level="strong">THIRD TIME</emphasis> I've addressed this! `;
    response += "[barely contained] Please advise how we can get some <emphasis level="strong">ACTUAL RESULTS</emphasis>!";
  } else {
    response += "[threatening calm] I've had <emphasis level="strong">ENOUGH</emphasis>. ";
    response += `[explosive] <emphasis level="strong">${text.toUpperCase()}</emphasis> [shouting] and this is <emphasis level="strong">ABSOLUTELY UNACCEPTABLE</emphasis>! `;
    response += "[professional fury] I'm **DONE** with this <emphasis level="strong">incompetence</emphasis>! ";
    response += "[mic drop] Please advise how we can escalate this to someone who <emphasis level="strong">ACTUALLY DOES THEIR JOB</emphasis>!";
  }
  
  return response;
};

// Sarcastic - Intellectual destruction with audio tags
const generateSarcasticRant = (text: string, intensity: number): string => {
  let response = "";
  
  if (intensity <= 30) {
    response += "[dripping sarcasm] Oh, how <emphasis level="moderate">lovely</emphasis>. ";
    response += `${text.toLowerCase()} - [mock enthusiasm] truly <emphasis level="moderate">enlightening</emphasis>. `;
    response += "[intellectual superiority] What a <emphasis level="moderate">delightful</emphasis> experience.";
  } else if (intensity <= 60) {
    response += "[mock enthusiasm] <emphasis level="strong">WOW</emphasis>, ";
    response += `[sarcastic] ${text} - I'm just <emphasis level="strong">THRILLED</emphasis> to deal with this! `;
    response += "[dripping sarcasm] How absolutely <emphasis level="strong">RIVETING</emphasis>! What a <emphasis level="strong">masterpiece</emphasis> of communication!";
  } else {
    response += "[threatening calm] Oh, <emphasis level="strong">MAGNIFICENT</emphasis>. ";
    response += `[explosive sarcasm] <emphasis level="strong">${text.toUpperCase()}</emphasis> [mock enthusiasm] - truly, your competence knows <emphasis level="strong">NO BOUNDS</emphasis>! `;
    response += "[intellectual destruction] What a <emphasis level="strong">DELIGHTFUL</emphasis> way to waste everyone's time! ";
    response += "[devastating wit] Absolutely <emphasis level="strong">EXQUISITE</emphasis> work here!";
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