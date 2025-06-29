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

// Ultra-concise mock translation responses
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
  const exclamation = intensity > 6 ? '!' : intensity > 3 ? '!' : '.';
  
  let translatedText = '';
  
  switch (style) {
    case 'corporate':
      const corporateResponses = [
        `As per my previous email regarding this ${context}${exclamation} Please advise how we can move forward with actual competence.`,
        `Per our discussion about ${context}, I find myself clarifying the obvious again${exclamation} Moving forward, let's implement basic protocols.`,
        `I'm reaching out AGAIN about this ${context} matter${exclamation} This requires immediate attention and proper follow-through.`
      ];
      translatedText = corporateResponses[Math.floor(Math.random() * corporateResponses.length)];
      break;
      
    case 'gamer':
      const gamerResponses = [
        `BRUH${exclamation} This ${context} situation is absolutely UNREAL${exclamation} GET REKT and learn basic skills.`,
        `ARE YOU SERIOUS RIGHT NOW${exclamation} This ${context} thing is driving me INSANE${exclamation}`,
        `WHAT THE HECK${exclamation} This ${context} mess is beyond frustrating${exclamation} TIME TO STEP UP YOUR GAME.`
      ];
      translatedText = gamerResponses[Math.floor(Math.random() * gamerResponses.length)];
      break;
      
    case 'sarcastic':
      const sarcasticResponses = [
        `Oh WOW, another ${context} situation${exclamation} How absolutely riveting and well-handled.`,
        `How absolutely delightful${exclamation} Another ${context} scenario handled with such remarkable competence.`,
        `Oh magnificent${exclamation} This ${context} situation is exactly what I hoped to encounter today.`
      ];
      translatedText = sarcasticResponses[Math.floor(Math.random() * sarcasticResponses.length)];
      break;
      
    default:
      translatedText = `This ${context} situation is quite frustrating${exclamation} I need this resolved properly.`;
  }
  
  return {
    translatedText,
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