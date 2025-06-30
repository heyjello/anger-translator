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

// The Enforcer - Luther-style righteous fury
const ENFORCER_PATTERNS = {
  expressions: [
    "OH HELL NAH",
    "ARE YOU SERIOUS RIGHT NOW",
    "I KNOW YOU DIDN'T JUST",
    "BOY IF YOU DON'T",
    "WHAT IN THE ENTIRE",
    "LISTEN HERE",
    "LET ME TELL YOU SOMETHING",
    "I'M BOUT TO LOSE IT",
    "THAT'S WHAT WE NOT GONNA DO",
    "EXCUSE ME SIR/MA'AM"
  ],
  
  toneCues: [
    "[righteous fury]",
    "[preacher voice]",
    "[building up]",
    "[explosive energy]",
    "[mic drop moment]",
    "[rhythmic emphasis]",
    "[street wisdom]",
    "[calling out]",
    "[truth telling]",
    "[verbal takedown]"
  ],
  
  endings: [
    "AND THAT'S ON PERIOD!",
    "CASE CLOSED!",
    "NEXT QUESTION!",
    "BOOM! MIC DROP!",
    "THAT'S ALL I GOT TO SAY ABOUT THAT!",
    "AND I SAID WHAT I SAID!",
    "PERIODT!",
    "FACTS ONLY!",
    "TRUTH HAS BEEN SPOKEN!",
    "AND THAT'S THE TEA!"
  ]
};

// The Highland Howler - Explosive Scottish Dad
const HIGHLAND_HOWLER_PATTERNS = {
  expressions: [
    "OCH, FOR CRYING OUT LOUD",
    "WHAT IN THE NAME OF THE WEE MAN",
    "JESUS BLOODY CHRIST",
    "HOLY SHITE",
    "BLOODY HELL",
    "CHRIST ON A BIKE",
    "FOR THE LOVE OF ALL THAT'S HOLY",
    "WHAT FRESH HELL IS THIS",
    "AYE, RIGHT",
    "AWAY AND BILE YER HEID"
  ],
  
  insults: [
    "ya numpty",
    "ya daft wee bampot", 
    "ya absolute weapon",
    "ya muppet",
    "ya rocket",
    "ya tube",
    "ya walloper",
    "ya eejit",
    "ya pure mental case",
    "ya absolute roaster"
  ],
  
  toneCues: [
    "[shouting in fits]",
    "[sputtering with rage]",
    "[throwing wrench]",
    "[chaotic pacing]",
    "[server room fury]",
    "[deadpan disbelief]",
    "[mocking voice]",
    "[voice cracking]",
    "[absolutely mental]",
    "[pure dead brilliant]"
  ]
};

// The Don - NY Italian-American Roastmaster
const DON_PATTERNS = {
  expressions: [
    "AY, WHAT'S YA PROBLEM HERE",
    "YOU GOTTA BE KIDDIN' ME",
    "FUGGEDABOUTIT",
    "WHAT AM I, CHOPPED LIVER",
    "YOU THINK I WAS BORN YESTERDAY",
    "GET OUTTA HERE WITH THAT",
    "ARE YOU OUTTA YA MIND",
    "WHAT'S THE MATTER WITH YOU",
    "YOU'RE BREAKIN' MY BALLS HERE",
    "MADONNA MIA"
  ],
  
  insults: [
    "ya mook",
    "ya jamook", 
    "ya gavone",
    "ya stunad",
    "ya cafone",
    "ya jagoff",
    "ya mamaluke",
    "ya schifoso",
    "ya stunod",
    "ya mutt"
  ],
  
  toneCues: [
    "[yelling in traffic]",
    "[streetwise threats]",
    "[family analogies]",
    "[heavy sarcasm]",
    "[threatening calm]",
    "[gesticulating wildly]",
    "[Brooklyn fury]",
    "[offended dignity]",
    "[incredulous]",
    "[mob boss energy]"
  ]
};

// The Cracked Controller - Gen-Z Gamer
const CRACKED_CONTROLLER_PATTERNS = {
  expressions: [
    "NAH BRO",
    "WHAT THE **BLEEP**",
    "ARE YOU KIDDING ME RIGHT NOW",
    "THIS IS STRAIGHT **BLEEP**",
    "I'M ABOUT TO LOSE IT",
    "GATORADE AND ADDERALL",
    "BRUH MOMENT",
    "THAT'S CAP",
    "NO SHOT",
    "RATIO + L + BOZO"
  ],
  
  toneCues: [
    "[screaming]",
    "[panicked]",
    "[cracked energy]",
    "[hyperventilating]",
    "[keyboard smashing]",
    "[controller throwing]",
    "[energy drink chugging]",
    "[rage quitting]",
    "[mock disbelief]",
    "[absolutely losing it]"
  ],
  
  rageQuits: [
    "I'M UNINSTALLING THIS **BLEEP**",
    "DELETING MY ACCOUNT RN",
    "TOUCHING GRASS AFTER THIS",
    "SWITCHING TO CONSOLE",
    "CALLING MY MOM",
    "BREAKING MY SETUP",
    "GOING BACK TO MINECRAFT",
    "REPORTING EVERYONE"
  ]
};

// Karen - Suburban Entitlement Rage
const KAREN_PATTERNS = {
  expressions: [
    "EXCUSE ME",
    "I WANT TO SPEAK TO YOUR MANAGER",
    "THIS IS COMPLETELY UNACCEPTABLE",
    "I'M A PAYING CUSTOMER",
    "DO YOU KNOW WHO I AM",
    "I'M CALLING CORPORATE",
    "THIS IS RIDICULOUS",
    "I DEMAND TO SPEAK TO SOMEONE IN CHARGE",
    "I'M NEVER SHOPPING HERE AGAIN",
    "I'M POSTING THIS ON FACEBOOK"
  ],
  
  toneCues: [
    "[fake-nice]",
    "[condescending]",
    "[screeching]",
    "[entitled]",
    "[threatening]",
    "[passive-aggressive]",
    "[nuclear Karen]",
    "[manager summoning]",
    "[corporate threatening]",
    "[social media warfare]"
  ],
  
  escalations: [
    "I'M CALLING THE POLICE",
    "I'M CONTACTING THE BETTER BUSINESS BUREAU",
    "MY HUSBAND IS A LAWYER",
    "I KNOW THE OWNER",
    "I'M A TAXPAYER",
    "I'M CALLING THE NEWS",
    "THIS IS DISCRIMINATION",
    "I'M FILING A COMPLAINT"
  ]
};

// Generate persona-specific translations
const generateEnforcerRant = (text: string, intensity: number): string => {
  const righteousFury = Math.floor(intensity * 0.6);
  const explosiveEnergy = Math.floor(intensity * 0.5);
  const sarcasm = Math.floor(intensity * 0.3);
  
  let response = "";
  
  if (intensity <= 20) {
    response += "[building up] Listen here, ";
  } else if (intensity <= 40) {
    response += "[righteous fury] OH HELL NAH, ";
  } else if (intensity <= 60) {
    response += "[explosive energy] **ARE YOU SERIOUS RIGHT NOW?** ";
  } else if (intensity <= 80) {
    response += "[preacher voice] **I KNOW YOU DIDN'T JUST** ";
  } else {
    response += "[verbal takedown] **BOY IF YOU DON'T** ";
  }
  
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('computer') || lowerText.includes('tech')) {
    response += `this computer got me **HEATED**! [rhythmic emphasis] ${text} and I'm supposed to just sit here and take it? [street wisdom] **NAH FAM!** `;
    if (intensity > 50) {
      response += "[mic drop moment] Technology ain't supposed to be this **DISRESPECTFUL**! **THAT'S WHAT WE NOT GONNA DO!**";
    }
  } else if (lowerText.includes('work') || lowerText.includes('job')) {
    response += `work got me **STRESSED OUT**! [calling out] ${text} - and they wonder why I'm ready to **WALK OUT**! `;
    if (intensity > 60) {
      response += "[truth telling] I didn't sign up for this **NONSENSE**! **AND THAT'S ON PERIOD!**";
    }
  } else {
    response += `${text} - and I'm supposed to just **ACCEPT THIS**? [explosive energy] **NOT TODAY!** `;
    if (intensity > 40) {
      response += `[righteous fury] This is **UNACCEPTABLE** and I said what I said! ${ENFORCER_PATTERNS.endings[Math.floor(Math.random() * ENFORCER_PATTERNS.endings.length)]}`;
    }
  }
  
  if (intensity > 80) {
    const ending = ENFORCER_PATTERNS.endings[Math.floor(Math.random() * ENFORCER_PATTERNS.endings.length)];
    response += ` [verbal takedown] **${ending}**`;
  }
  
  return response;
};

const generateHighlandHowlerRant = (text: string, intensity: number): string => {
  const disbelief = Math.floor(intensity * 0.5);
  const insults = Math.floor(intensity * 0.4);
  const sarcasm = Math.floor(intensity * 0.2);
  
  let response = "";
  
  if (intensity <= 20) {
    response += "Och, ";
  } else if (intensity <= 40) {
    response += "[shouting in fits] **FOR CRYING OUT LOUD** ";
  } else if (intensity <= 60) {
    response += "[sputtering with rage] **WHAT IN THE NAME OF THE WEE MAN** ";
  } else if (intensity <= 80) {
    response += "[throwing wrench] **JESUS BLOODY CHRIST** ";
  } else {
    response += "[absolutely mental] **HOLY SHITE, WHAT FRESH HELL** ";
  }
  
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('computer') || lowerText.includes('server')) {
    response += `this **BLOODY SERVER** is doing ma heid in! [chaotic pacing] ${text} and it's like trying to fix a **BROKEN TOASTER** with a **HAMMER**! `;
    if (intensity > 50) {
      response += `[deadpan disbelief] Aye, because that's **EXACTLY** what I wanted to do today - fight wi' a machine that's got less sense than ${HIGHLAND_HOWLER_PATTERNS.insults[Math.floor(Math.random() * HIGHLAND_HOWLER_PATTERNS.insults.length)]}!`;
    }
  } else {
    response += `${text} - and I'm supposed to just **SIT HERE** and take it? [server room fury] **NAE CHANCE!** `;
    if (intensity > 40) {
      response += `[mocking voice] Oh aye, that makes **PERFECT SENSE**, doesn't it, ${HIGHLAND_HOWLER_PATTERNS.insults[Math.floor(Math.random() * HIGHLAND_HOWLER_PATTERNS.insults.length)]}!`;
    }
  }
  
  if (intensity > 80) {
    response += ` [pure dead brilliant] **AWAY AND BILE YER HEID**, the lot of ye! This is **PURE MENTAL**!`;
  }
  
  return response;
};

const generateDonRant = (text: string, intensity: number): string => {
  const aggression = Math.floor(intensity * 0.5);
  const sarcasm = Math.floor(intensity * 0.4);
  const mockery = Math.floor(intensity * 0.4);
  
  let response = "";
  
  if (intensity <= 20) {
    response += "[streetwise] Ay, listen here - ";
  } else if (intensity <= 40) {
    response += "[Brooklyn fury] **WHAT'S YA PROBLEM?** ";
  } else if (intensity <= 60) {
    response += "[yelling in traffic] **AY, WHAT THE HELL** ";
  } else if (intensity <= 80) {
    response += "[gesticulating wildly] **MADONNA MIA!** ";
  } else {
    response += "[mob boss energy] **FUGGEDABOUTIT!** You gotta be **OUTTA YA MIND** ";
  }
  
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('computer') || lowerText.includes('tech')) {
    response += `this **PIECE OF JUNK** computer! [threatening calm] ${text} and it's like talkin' to a **BRICK WALL**! `;
    if (intensity > 50) {
      response += `[heavy sarcasm] Oh, what am I, some kinda **COMPUTER GENIUS** now? This thing's got less brains than ${DON_PATTERNS.insults[Math.floor(Math.random() * DON_PATTERNS.insults.length)]}!`;
    }
  } else if (lowerText.includes('traffic') || lowerText.includes('driving')) {
    response += `the traffic today! [incredulous] ${text} - and every **MOOK** in the city decided to take their car out! `;
    if (intensity > 60) {
      response += "[family analogies] **LEARN TO DRIVE!** What'd you get ya license, from a **CRACKER JACK BOX**?";
    }
  } else {
    response += `${text} - and I'm supposed to just sit here like some kinda **STUNAD**? [offended dignity] **NO WAY!** `;
    if (intensity > 40) {
      response += `[heavy sarcasm] Oh, that makes **PERFECT SENSE**, right? What am I, chopped liver here?`;
    }
  }
  
  if (intensity > 80) {
    response += ` [mob boss energy] **I'VE HAD IT UP TO HERE** with this **BULL****! You're breakin' my balls here! **CAPISCE?**`;
  }
  
  return response;
};

const generateCrackedControllerRant = (text: string, intensity: number): string => {
  const scream = Math.floor(intensity * 0.6);
  const memeSpeak = Math.floor(intensity * 0.4);
  const whinySarcasm = Math.floor(intensity * 0.3);
  
  let response = "";
  
  if (intensity <= 20) {
    response += "[annoyed] Bruh, ";
  } else if (intensity <= 40) {
    response += "[cracked energy] **NAH BRO**, ";
  } else if (intensity <= 60) {
    response += "[screaming] **WHAT THE BLEEP** ";
  } else if (intensity <= 80) {
    response += "[panicked] **NAH NAH NAH** this is straight **BLEEP** ";
  } else {
    response += "[hyperventilating] **GATORADE AND ADDERALL** I'm about to **LOSE IT** ";
  }
  
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('computer') || lowerText.includes('lag')) {
    response += `this **TRASH** setup is lagging harder than my abuela's WiFi! [keyboard smashing] ${text} and I'm getting **CLAPPED** by 12-year-olds! `;
    if (intensity > 50) {
      response += "[mock disbelief] Oh what, now the game's broken? [cracked energy] **SKILL ISSUE** much? This is why I need that **GATORADE** sponsorship!";
    }
  } else if (lowerText.includes('team') || lowerText.includes('group')) {
    response += `my team is more **TRASH** than a TikTok compilation! [controller throwing] ${text} - these teammates got **NO HANDS**! `;
    if (intensity > 70) {
      response += "[rage quitting] **RATIO + L + BOZO** to all y'all! Touch grass and learn to play!";
    }
  } else {
    response += `${text} - and I'm supposed to just **SIT HERE** and take this? [energy drink chugging] **NO SHOT!** `;
    if (intensity > 40) {
      response += `[mock disbelief] Oh that's **TOTALLY** fair, right? This is straight up a **BRUH MOMENT**!`;
    }
  }
  
  if (intensity > 80) {
    const rageQuit = CRACKED_CONTROLLER_PATTERNS.rageQuits[Math.floor(Math.random() * CRACKED_CONTROLLER_PATTERNS.rageQuits.length)];
    response += ` [absolutely losing it] **${rageQuit}** and switching to **VALORANT**! Y'all can **COPE AND SEETHE**!`;
  }
  
  return response;
};

const generateKarenRant = (text: string, intensity: number): string => {
  const screech = Math.floor(intensity * 0.4);
  const condescension = Math.floor(intensity * 0.5);
  const sarcasm = Math.floor(intensity * 0.3);
  
  let response = "";
  
  if (intensity <= 20) {
    response += "[fake-nice] Excuse me, but ";
  } else if (intensity <= 40) {
    response += "[condescending] **I'M SORRY**, but ";
  } else if (intensity <= 60) {
    response += "[entitled] **EXCUSE ME**, ";
  } else if (intensity <= 80) {
    response += "[screeching] **I WANT TO SPEAK TO YOUR MANAGER** ";
  } else {
    response += "[nuclear Karen] **THIS IS COMPLETELY UNACCEPTABLE** ";
  }
  
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('service') || lowerText.includes('help')) {
    response += `the service here is **RIDICULOUS**! [passive-aggressive] ${text} and I'm a **PAYING CUSTOMER**! `;
    if (intensity > 50) {
      response += "[threatening] I'm **CALLING CORPORATE** and posting this on **FACEBOOK**! Do you know who I am?";
    }
  } else if (lowerText.includes('wait') || lowerText.includes('time')) {
    response += `I shouldn't have to **WAIT** for this! [entitled] ${text} - I have **IMPORTANT THINGS** to do! `;
    if (intensity > 60) {
      response += "[manager summoning] Get me someone in **CHARGE** right now! This is **DISCRIMINATION**!";
    }
  } else {
    response += `${text} - and you think that's **ACCEPTABLE**? [condescending] I don't **THINK SO**! `;
    if (intensity > 40) {
      response += `[social media warfare] I'm posting this **EVERYWHERE**! My husband is a **LAWYER** and we know the **OWNER**!`;
    }
  }
  
  if (intensity > 80) {
    const escalation = KAREN_PATTERNS.escalations[Math.floor(Math.random() * KAREN_PATTERNS.escalations.length)];
    response += ` [nuclear Karen] **${escalation}** and I'm **NEVER SHOPPING HERE AGAIN**! This is going **VIRAL**!`;
  }
  
  return response;
};

// Simple fallback for corporate and sarcastic
const generateCorporateRant = (text: string, intensity: number): string => {
  if (intensity <= 30) {
    return `As per my previous email, ${text.toLowerCase()}. Please advise how we can move forward with some actual competence.`;
  } else if (intensity <= 70) {
    return `AS PER MY PREVIOUS EMAIL, ${text}! I SHOULDN'T HAVE TO EXPLAIN THIS AGAIN! Please advise how we can escalate this to someone who actually does their job!`;
  } else {
    return `I'VE HAD ENOUGH! ${text.toUpperCase()}! THIS IS ABSOLUTELY UNACCEPTABLE and I'm DONE with this incompetence! PLEASE ADVISE how we can get some ACTUAL RESULTS!`;
  }
};

const generateSarcasticRant = (text: string, intensity: number): string => {
  if (intensity <= 30) {
    return `Oh, how lovely. ${text.toLowerCase()} - truly enlightening.`;
  } else if (intensity <= 70) {
    return `WOW, ${text}! I'm just THRILLED to deal with this masterpiece of communication. How absolutely RIVETING!`;
  } else {
    return `Oh, MAGNIFICENT! ${text.toUpperCase()}! Truly, your competence knows no bounds! What a delightful way to waste everyone's time! ABSOLUTELY EXQUISITE!`;
  }
};

// Main translation function
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