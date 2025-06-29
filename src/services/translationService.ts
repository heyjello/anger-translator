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

// Style-specific prompts for better AI responses
const STYLE_PROMPTS = {
  corporate: {
    name: "Corporate Meltdown",
    prompt: "Transform this polite message into a passive-aggressive corporate email response. Use professional language but with barely contained frustration. Include phrases like 'As per my previous email', 'Please advise', 'Moving forward', and corporate buzzwords. Make it sound like someone who's had enough but still needs to maintain professionalism."
  },
  gamer: {
    name: "Epic Gamer Rage",
    prompt: "Transform this polite message into an over-the-top gamer rage response. Use gaming terminology, internet slang, and ALL CAPS for emphasis. Include words like 'BRUH', 'NOOB', 'GET REKT', 'ARE YOU KIDDING ME', and other gaming expressions. Make it sound like someone who just lost an important match."
  },
  sarcastic: {
    name: "Sarcastic Roast",
    prompt: "Transform this polite message into a witty, sarcastic response dripping with irony. Use sophisticated vocabulary mixed with cutting sarcasm. Include phrases that sound complimentary but are actually insulting. Make it sound like someone who's intellectually superior and isn't afraid to show it."
  }
};

// Intensity modifiers
const getIntensityModifier = (intensity: number): string => {
  if (intensity <= 3) return "Keep it relatively mild and restrained.";
  if (intensity <= 6) return "Make it moderately intense with clear frustration.";
  if (intensity <= 8) return "Make it quite intense and heated.";
  return "Make it absolutely explosive and over-the-top with maximum intensity.";
};

// Mock translation for development (replace with real API)
const mockTranslate = async (request: TranslationRequest): Promise<TranslationResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  const { text, style, intensity } = request;
  const exclamationMarks = '!'.repeat(Math.max(1, Math.floor(intensity / 2)));
  
  let translatedText = '';
  
  switch (style) {
    case 'corporate':
      translatedText = `AS PER MY PREVIOUS EMAIL... ${text.toUpperCase()}${exclamationMarks} I SHOULDN'T HAVE TO EXPLAIN THIS AGAIN BUT HERE WE ARE${exclamationMarks} PLEASE ADVISE HOW WE CAN MOVE FORWARD WITH SOME ACTUAL COMPETENCE${exclamationMarks} Looking forward to your prompt response.`;
      break;
      
    case 'gamer':
      translatedText = `BRUH${exclamationMarks} ${text.toUpperCase()}${exclamationMarks} ARE YOU KIDDING ME RIGHT NOW${exclamationMarks} THIS IS ABSOLUTELY UNREAL${exclamationMarks} GET REKT AND LEARN TO PLAY${exclamationMarks} NOOB${exclamationMarks}`;
      break;
      
    case 'sarcastic':
      translatedText = `Oh WOW, "${text}" - how absolutely RIVETING${exclamationMarks} I'm just THRILLED to deal with this masterpiece of communication${exclamationMarks} Truly, your eloquence knows no bounds${exclamationMarks} What a delightful way to spend my time.`;
      break;
      
    default:
      translatedText = text;
  }
  
  return {
    translatedText,
    success: true
  };
};

// Real OpenAI translation (commented out for now)
const openAITranslate = async (request: TranslationRequest): Promise<TranslationResponse> => {
  try {
    const { text, style, intensity } = request;
    const styleConfig = STYLE_PROMPTS[style];
    const intensityModifier = getIntensityModifier(intensity);
    
    const systemPrompt = `You are an expert at transforming polite messages into comedic rage responses. Your job is to take polite, professional text and convert it into humorous angry responses while maintaining the core message.

Style: ${styleConfig.name}
Instructions: ${styleConfig.prompt}
Intensity Level: ${intensity}/10 - ${intensityModifier}

Rules:
1. Keep the core message intact but transform the tone completely
2. Make it funny and over-the-top, not genuinely offensive
3. Use appropriate language for the chosen style
4. Match the intensity level requested
5. Keep it under 300 words
6. Make it entertaining and comedic, not actually mean-spirited`;

    const userPrompt = `Transform this polite message: "${text}"`;

    // This would be the actual OpenAI API call
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-4',
    //     messages: [
    //       { role: 'system', content: systemPrompt },
    //       { role: 'user', content: userPrompt }
    //     ],
    //     max_tokens: 300,
    //     temperature: 0.8,
    //   }),
    // });

    // const data = await response.json();
    // const translatedText = data.choices[0]?.message?.content || 'Translation failed';

    // For now, fall back to mock translation
    return await mockTranslate(request);
    
  } catch (error) {
    console.error('OpenAI translation failed:', error);
    return {
      translatedText: '',
      success: false,
      error: 'Translation service temporarily unavailable. Please try again.'
    };
  }
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

  // For now, use mock translation
  // In production, you would use: return await openAITranslate(request);
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