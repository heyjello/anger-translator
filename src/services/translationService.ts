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
    prompt: "Create a passive-aggressive corporate response that captures workplace frustration. Use professional language but with barely contained rage. Include phrases like 'As per my previous email', 'Please advise', 'Moving forward', and corporate buzzwords. Make it sound like someone who's had enough but still needs to maintain professionalism."
  },
  gamer: {
    name: "Epic Gamer Rage",
    prompt: "Create an over-the-top gamer rage response that captures gaming frustration. Use gaming terminology, internet slang, and ALL CAPS for emphasis. Include words like 'BRUH', 'NOOB', 'GET REKT', 'ARE YOU KIDDING ME', and other gaming expressions. Make it sound like someone who just lost an important match."
  },
  sarcastic: {
    name: "Sarcastic Roast",
    prompt: "Create a witty, sarcastic response dripping with irony that captures intellectual frustration. Use sophisticated vocabulary mixed with cutting sarcasm. Include phrases that sound complimentary but are actually insulting. Make it sound like someone who's intellectually superior and isn't afraid to show it."
  }
};

// Intensity modifiers
const getIntensityModifier = (intensity: number): string => {
  if (intensity <= 3) return "Keep it relatively mild and restrained.";
  if (intensity <= 6) return "Make it moderately intense with clear frustration.";
  if (intensity <= 8) return "Make it quite intense and heated.";
  return "Make it absolutely explosive and over-the-top with maximum intensity.";
};

// Enhanced mock translation with input blending
const mockTranslate = async (request: TranslationRequest): Promise<TranslationResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  const { text, style, intensity } = request;
  
  // Analyze input for context and traits
  const analyzeInput = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Detect topic/context
    let context = 'general situation';
    if (lowerText.includes('meeting')) context = 'meeting coordination';
    if (lowerText.includes('document') || lowerText.includes('report')) context = 'document management';
    if (lowerText.includes('help') || lowerText.includes('assist')) context = 'assistance request';
    if (lowerText.includes('review') || lowerText.includes('check')) context = 'review process';
    if (lowerText.includes('fix') || lowerText.includes('problem')) context = 'problem resolution';
    if (lowerText.includes('email') || lowerText.includes('message')) context = 'communication';
    
    // Detect urgency
    let urgency = 'normal';
    if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('immediately')) urgency = 'urgent';
    if (lowerText.includes('when you can') || lowerText.includes('no rush')) urgency = 'relaxed';
    
    return { context, urgency };
  };
  
  const { context, urgency } = analyzeInput(text);
  const exclamationMarks = '!'.repeat(Math.max(1, Math.floor(intensity / 2)));
  
  let translatedText = '';
  
  switch (style) {
    case 'corporate':
      const corporateResponses = [
        `AS PER MY PREVIOUS EMAIL regarding ${context}${exclamationMarks} I SHOULDN'T HAVE TO EXPLAIN THIS AGAIN but here we are dealing with ${urgency} requests${exclamationMarks} PLEASE ADVISE how we can move forward with some actual competence${exclamationMarks} Looking forward to your prompt response.`,
        `Per our discussion about ${context}, I find myself once again having to clarify what should be obvious${exclamationMarks} Moving forward, perhaps we could implement some basic communication protocols${exclamationMarks} I trust this clarifies the situation${exclamationMarks}`,
        `I'm reaching out AGAIN about this ${context} matter${exclamationMarks} As previously discussed, this ${urgency} situation requires immediate attention${exclamationMarks} Please advise on next steps so we can actually make progress${exclamationMarks}`
      ];
      translatedText = corporateResponses[Math.floor(Math.random() * corporateResponses.length)];
      break;
      
    case 'gamer':
      const gamerResponses = [
        `BRUH${exclamationMarks} This ${context} situation is absolutely UNREAL${exclamationMarks} ARE YOU KIDDING ME with this ${urgency} nonsense${exclamationMarks} GET REKT and learn how to handle basic tasks${exclamationMarks} NOOB MOVE${exclamationMarks}`,
        `ARE YOU SERIOUS RIGHT NOW${exclamationMarks} This ${context} thing is driving me INSANE${exclamationMarks} BRUH, how is this ${urgency} situation even happening${exclamationMarks} GET YOUR GAME TOGETHER${exclamationMarks}`,
        `WHAT THE ACTUAL HECK${exclamationMarks} This ${context} mess is beyond frustrating${exclamationMarks} BRUH, I can't even deal with this ${urgency} chaos${exclamationMarks} TIME TO STEP UP YOUR GAME${exclamationMarks}`
      ];
      translatedText = gamerResponses[Math.floor(Math.random() * gamerResponses.length)];
      break;
      
    case 'sarcastic':
      const sarcasticResponses = [
        `Oh WOW, another ${context} situation${exclamationMarks} How absolutely RIVETING${exclamationMarks} I'm just THRILLED to deal with this ${urgency} masterpiece of communication${exclamationMarks} Truly, the efficiency here knows no bounds${exclamationMarks}`,
        `How absolutely DELIGHTFUL${exclamationMarks} Another ${context} scenario that's clearly been handled with such remarkable competence${exclamationMarks} I'm just OVERJOYED by this ${urgency} display of organizational skills${exclamationMarks}`,
        `Oh, MAGNIFICENT${exclamationMarks} This ${context} situation is exactly what I hoped to encounter today${exclamationMarks} Such a ${urgency} and well-thought-out approach${exclamationMarks} What a delightful way to spend my time${exclamationMarks}`
      ];
      translatedText = sarcasticResponses[Math.floor(Math.random() * sarcasticResponses.length)];
      break;
      
    default:
      translatedText = `This ${context} situation is quite frustrating${exclamationMarks}`;
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
    
    const systemPrompt = `You are an expert at creating comedic rage responses that capture the essence of frustration without directly quoting input text. Your job is to analyze the situation and create authentic angry responses.

Style: ${styleConfig.name}
Instructions: ${styleConfig.prompt}
Intensity Level: ${intensity}/10 - ${intensityModifier}

Rules:
1. NEVER repeat or quote the original text
2. Analyze the context and create a natural rage response
3. Make it funny and over-the-top, not genuinely offensive
4. Use appropriate language for the chosen style
5. Match the intensity level requested
6. Keep it under 300 words
7. Make it entertaining and comedic, not actually mean-spirited`;

    const userPrompt = `Analyze this situation and create a ${style} rage response: "${text}"`;

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