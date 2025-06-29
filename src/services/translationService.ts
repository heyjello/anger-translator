export interface TranslationRequest {
  text: string;
  style: 'corporate' | 'gamer' | 'sarcastic';
  intensity: number;
}

export interface TranslationResponse {
  translatedText: string;
  success: boolean;
  error?: string;
}

// Authentic rage responses based on real anger patterns
const mockTranslate = async (request: TranslationRequest): Promise<TranslationResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  const { text, style, intensity } = request;
  
  // Extract context without repeating input
  const extractContext = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('credit') || lowerText.includes('recognition')) return 'credit';
    if (lowerText.includes('meeting')) return 'meeting';
    if (lowerText.includes('document') || lowerText.includes('report')) return 'document';
    if (lowerText.includes('help')) return 'assistance';
    if (lowerText.includes('review')) return 'review';
    if (lowerText.includes('fix') || lowerText.includes('problem')) return 'issue';
    return 'request';
  };
  
  const context = extractContext(text);
  let translatedText = '';
  
  // Generate authentic rage responses based on intensity
  switch (style) {
    case 'corporate':
      translatedText = getCorporateRage(context, intensity);
      break;
      
    case 'gamer':
      translatedText = getGamerRage(context, intensity);
      break;
      
    case 'sarcastic':
      translatedText = getSarcasticRage(context, intensity);
      break;
      
    default:
      translatedText = `This ${context} situation is frustrating. I need this resolved.`;
  }
  
  return {
    translatedText,
    success: true
  };
};

// Corporate rage responses by intensity level
const getCorporateRage = (context: string, intensity: number): string => {
  const responses = {
    1: [
      `I wanted to follow up on this ${context} matter. Could we please address this?`,
      `Just checking in about the ${context} situation. When might this be resolved?`
    ],
    2: [
      `As mentioned, I need an update on this ${context}. Please prioritize this.`,
      `Per my email, this ${context} requires attention. Let's get this handled.`
    ],
    3: [
      `As I stated previously, this ${context} needs immediate action. This is important.`,
      `I need to reiterate that this ${context} is still pending. Please resolve this.`
    ],
    4: [
      `This is the third time I'm asking about this ${context}. I need this handled NOW.`,
      `I'm losing patience with this ${context} situation. This requires urgent attention.`
    ],
    5: [
      `I NEED this ${context} resolved immediately! This is completely unacceptable.`,
      `This ${context} situation is RIDICULOUS. I demand immediate action.`
    ],
    6: [
      `THIS IS ABSOLUTELY UNACCEPTABLE! This ${context} has gone on far too long.`,
      `I CANNOT BELIEVE this ${context} is still an issue! Fix this NOW.`
    ],
    7: [
      `I AM DONE with this ${context} nonsense! This ends TODAY.`,
      `This ${context} situation is ABSOLUTELY RIDICULOUS! I've had ENOUGH.`
    ],
    8: [
      `I HAVE HAD ENOUGH of this ${context} disaster! This is COMPLETELY unacceptable.`,
      `THIS ENDS NOW! This ${context} situation is beyond RIDICULOUS.`
    ],
    9: [
      `I AM ABSOLUTELY LIVID about this ${context}! This is BEYOND unacceptable.`,
      `THIS IS COMPLETELY INSANE! This ${context} situation is driving me CRAZY.`
    ],
    10: [
      `I AM DONE WITH THIS ABSOLUTE NONSENSE! This ${context} is a COMPLETE disaster!`,
      `WHAT THE HELL IS GOING ON with this ${context}?! This is ABSOLUTELY INSANE!`
    ]
  };
  
  const levelResponses = responses[intensity as keyof typeof responses] || responses[5];
  return levelResponses[Math.floor(Math.random() * levelResponses.length)];
};

// Gamer rage responses by intensity level
const getGamerRage = (context: string, intensity: number): string => {
  const responses = {
    1: [
      `Ugh, this ${context} thing is kinda annoying. Can we fix this?`,
      `Seriously? This ${context} is bugging me. Come on.`
    ],
    2: [
      `Come on, this ${context} is getting old. Really?`,
      `This ${context} is starting to tick me off. Fix it please.`
    ],
    3: [
      `Dude, this ${context} is really annoying me. What the heck?`,
      `This ${context} is driving me nuts. Can we please sort this out?`
    ],
    4: [
      `Are you serious with this ${context}? This is getting ridiculous.`,
      `This ${context} is really starting to piss me off. Come ON.`
    ],
    5: [
      `WHAT is going on with this ${context}?! This is RIDICULOUS.`,
      `ARE YOU KIDDING ME with this ${context}? This is insane!`
    ],
    6: [
      `BRUH! This ${context} is absolutely INSANE! What the hell?`,
      `This ${context} is driving me CRAZY! ARE YOU SERIOUS right now?`
    ],
    7: [
      `WHAT THE HELL is this ${context} nonsense?! This is ABSOLUTELY insane!`,
      `ARE YOU FREAKING SERIOUS?! This ${context} is completely RIDICULOUS!`
    ],
    8: [
      `WHAT IS WRONG with this ${context}?! This is ABSOLUTELY INSANE!`,
      `I'M LOSING MY MIND over this ${context}! This is COMPLETELY nuts!`
    ],
    9: [
      `WHAT THE ACTUAL HELL?! This ${context} is driving me ABSOLUTELY INSANE!`,
      `ARE YOU OUT OF YOUR MIND?! This ${context} is COMPLETELY RIDICULOUS!`
    ],
    10: [
      `WHAT THE F*** IS THIS ${context} BULLSH*T?! I'M LOSING MY GODDAMN MIND!`,
      `ARE YOU F***ING KIDDING ME?! This ${context} is ABSOLUTELY F***ING INSANE!`
    ]
  };
  
  const levelResponses = responses[intensity as keyof typeof responses] || responses[5];
  return levelResponses[Math.floor(Math.random() * levelResponses.length)];
};

// Sarcastic rage responses by intensity level
const getSarcasticRage = (context: string, intensity: number): string => {
  const responses = {
    1: [
      `Oh how lovely, another ${context} situation. That's just great.`,
      `Well that's fantastic, this ${context} is exactly what I needed today.`
    ],
    2: [
      `How wonderful, this ${context} is going so well. Absolutely brilliant.`,
      `Oh that's just perfect, this ${context} is such a delight to deal with.`
    ],
    3: [
      `How absolutely delightful, this ${context} is just spectacular. So impressive.`,
      `Oh magnificent, this ${context} situation is exactly what I hoped for.`
    ],
    4: [
      `How absolutely precious, this ${context} is such a masterpiece. Truly inspiring.`,
      `Oh what a brilliant display of ${context} management. Simply outstanding.`
    ],
    5: [
      `OH how WONDERFUL, this ${context} is absolutely RIVETING! What a masterpiece.`,
      `How absolutely THRILLING, this ${context} situation is just SPECTACULAR!`
    ],
    6: [
      `OH MAGNIFICENT! This ${context} is absolutely DIVINE! What a BRILLIANT display.`,
      `How absolutely EXQUISITE, this ${context} is just PHENOMENAL! Truly OUTSTANDING.`
    ],
    7: [
      `OH how absolutely SPECTACULAR! This ${context} is just DIVINE! What BRILLIANT work.`,
      `How absolutely STUNNING, this ${context} is a true MASTERPIECE of incompetence!`
    ],
    8: [
      `OH how absolutely DIVINE! This ${context} is just PHENOMENAL! What a STUNNING example.`,
      `How absolutely EXQUISITE, this ${context} is truly a MAGNIFICENT disaster!`
    ],
    9: [
      `OH how absolutely EXQUISITE! This ${context} is just PHENOMENAL! What a DIVINE disaster.`,
      `How absolutely SPECTACULAR, this ${context} is truly a GODDAMN masterpiece!`
    ],
    10: [
      `OH how absolutely F***ING PERFECT! This ${context} is just GODDAMN SPECTACULAR!`,
      `How absolutely F***ING DIVINE! This ${context} is a true MASTERPIECE of bullsh*t!`
    ]
  };
  
  const levelResponses = responses[intensity as keyof typeof responses] || responses[5];
  return levelResponses[Math.floor(Math.random() * levelResponses.length)];
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