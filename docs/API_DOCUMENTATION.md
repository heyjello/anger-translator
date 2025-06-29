# API Documentation

## 🔌 Translation Service API

### Overview
The Anger Translator uses a service-based architecture for handling text translation. Currently implemented with a mock service, designed for easy integration with real AI APIs.

---

## 📡 Core Translation API

### `translateText(request: TranslationRequest): Promise<TranslationResponse>`

**Purpose**: Main translation function that converts polite text into rage responses

**Parameters**:
```typescript
interface TranslationRequest {
  text: string;           // Input text to translate (5-500 chars)
  style: RageStyle;       // Translation style
  intensity: number;      // Rage level (1-10)
}

type RageStyle = 'corporate' | 'gamer' | 'sarcastic';
```

**Returns**:
```typescript
interface TranslationResponse {
  translatedText: string; // The rage translation
  success: boolean;       // Operation success status
  error?: string;         // Error message if failed
}
```

**Example Usage**:
```typescript
const request: TranslationRequest = {
  text: "Could you please fix this when you have time?",
  style: "corporate",
  intensity: 7
};

const response = await translateText(request);
if (response.success) {
  console.log(response.translatedText);
  // Output: "AS PER MY PREVIOUS EMAIL... COULD YOU PLEASE FIX THIS WHEN YOU HAVE TIME?!! I SHOULDN'T HAVE TO EXPLAIN THIS AGAIN..."
}
```

---

## 🎭 Translation Styles

### Corporate Style
**ID**: `corporate`  
**Name**: "Corporate Meltdown"  
**Description**: Professional passive-aggressive responses

**Characteristics**:
- Uses corporate buzzwords and phrases
- Maintains professional tone while expressing frustration
- Includes phrases like "As per my previous email", "Please advise", "Moving forward"
- Escalates with intensity level

**Example Transformations**:
```
Input: "Could you please review this document?"
Level 3: "As per our discussion, could you please review this document at your earliest convenience?"
Level 7: "AS PER MY PREVIOUS EMAIL, I need you to review this document IMMEDIATELY. Please advise how we can move forward with some actual competence!"
Level 10: "I SHOULDN'T HAVE TO EXPLAIN THIS AGAIN! Review this document NOW or please advise how we can escalate this to someone who actually does their job!"
```

### Gamer Style
**ID**: `gamer`  
**Name**: "Epic Gamer Rage"  
**Description**: Over-the-top gaming terminology with CAPS LOCK

**Characteristics**:
- Heavy use of gaming slang and internet terminology
- ALL CAPS for emphasis
- Includes words like "BRUH", "NOOB", "GET REKT", "ARE YOU KIDDING ME"
- References gaming scenarios and frustrations

**Example Transformations**:
```
Input: "This isn't working properly"
Level 3: "Bruh, this isn't working properly, what's going on?"
Level 7: "ARE YOU KIDDING ME?! This isn't working properly! GET REKT and learn to code!"
Level 10: "BRUH!!! THIS ISN'T WORKING PROPERLY!!! ARE YOU ABSOLUTELY KIDDING ME RIGHT NOW?! GET REKT AND LEARN TO PLAY, NOOB!!!"
```

### Sarcastic Style
**ID**: `sarcastic`  
**Name**: "Sarcastic Roast"  
**Description**: Witty, intellectually superior responses

**Characteristics**:
- Sophisticated vocabulary with cutting sarcasm
- Phrases that sound complimentary but are actually insulting
- Intellectual superiority tone
- Irony and wit-based humor

**Example Transformations**:
```
Input: "Thanks for your help with this"
Level 3: "Oh, thanks for your 'help' with this - truly enlightening."
Level 7: "WOW, thanks for your absolutely RIVETING help with this! I'm just THRILLED to deal with this masterpiece of assistance!"
Level 10: "Oh, MAGNIFICENT! Thanks for your help with this - truly, your competence knows no bounds! What a delightful way to waste everyone's time!"
```

---

## 🔒 Rate Limiting

### RateLimiter Class
**Purpose**: Prevents API abuse and manages request frequency

**Configuration**:
```typescript
const rateLimiter = new RateLimiter(
  10,     // maxRequests: 10 requests
  60000   // timeWindow: per 60 seconds (1 minute)
);
```

**Methods**:

#### `canMakeRequest(): boolean`
Checks if a new request can be made within rate limits

**Returns**: `true` if request allowed, `false` if rate limited

#### `getTimeUntilNextRequest(): number`
Gets remaining cooldown time in milliseconds

**Returns**: Milliseconds until next request allowed (0 if no limit)

**Example Usage**:
```typescript
if (!rateLimiter.canMakeRequest()) {
  const waitTime = rateLimiter.getTimeUntilNextRequest();
  console.log(`Rate limited. Wait ${Math.ceil(waitTime / 1000)} seconds`);
  return;
}

// Proceed with request
await translateText(request);
```

---

## 🎯 Style Configuration

### Style Prompts System
Each style uses specific prompts for consistent AI responses:

```typescript
const STYLE_PROMPTS = {
  corporate: {
    name: "Corporate Meltdown",
    prompt: "Transform this polite message into a passive-aggressive corporate email response..."
  },
  gamer: {
    name: "Epic Gamer Rage", 
    prompt: "Transform this polite message into an over-the-top gamer rage response..."
  },
  sarcastic: {
    name: "Sarcastic Roast",
    prompt: "Transform this polite message into a witty, sarcastic response..."
  }
};
```

### Intensity Modifiers
Intensity levels affect the response strength:

```typescript
const getIntensityModifier = (intensity: number): string => {
  if (intensity <= 3) return "Keep it relatively mild and restrained.";
  if (intensity <= 6) return "Make it moderately intense with clear frustration.";
  if (intensity <= 8) return "Make it quite intense and heated.";
  return "Make it absolutely explosive and over-the-top with maximum intensity.";
};
```

---

## 🔧 Custom Hook API

### `useTranslation()` Hook
**Purpose**: React hook for managing translation state and operations

**Returns**:
```typescript
interface UseTranslationResult {
  translate: (request: TranslationRequest) => Promise<void>;
  isLoading: boolean;
  result: string;
  error: string | null;
  isRateLimited: boolean;
  timeUntilNextRequest: number;
  clearResult: () => void;
  clearError: () => void;
}
```

**Usage Example**:
```typescript
function TranslationComponent() {
  const {
    translate,
    isLoading,
    result,
    error,
    isRateLimited,
    timeUntilNextRequest,
    clearResult,
    clearError
  } = useTranslation();

  const handleTranslate = async () => {
    await translate({
      text: "Please help me with this",
      style: "corporate",
      intensity: 5
    });
  };

  return (
    <div>
      <button onClick={handleTranslate} disabled={isLoading || isRateLimited}>
        {isLoading ? 'Translating...' : 'Translate'}
      </button>
      {result && <p>{result}</p>}
      {error && <p className="error">{error}</p>}
      {isRateLimited && <p>Wait {timeUntilNextRequest}s</p>}
    </div>
  );
}
```

---

## 🔄 Error Handling

### Error Types
```typescript
type TranslationError = 
  | 'VALIDATION_ERROR'    // Invalid input
  | 'RATE_LIMIT_ERROR'    // Too many requests
  | 'SERVICE_ERROR'       // Translation service failure
  | 'NETWORK_ERROR'       // Network connectivity issues
  | 'UNKNOWN_ERROR';      // Unexpected errors
```

### Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: string;
  errorType?: TranslationError;
  retryAfter?: number;    // Seconds to wait before retry
}
```

### Common Error Scenarios

#### Validation Errors
```typescript
// Empty input
{ success: false, error: "No text provided for translation" }

// Text too short
{ success: false, error: "Message must be at least 5 characters long" }

// Text too long  
{ success: false, error: "Text too long for translation" }
```

#### Rate Limiting Errors
```typescript
{
  success: false,
  error: "Rate limit exceeded. Please wait 45 seconds before trying again.",
  errorType: "RATE_LIMIT_ERROR",
  retryAfter: 45
}
```

#### Service Errors
```typescript
{
  success: false,
  error: "Translation service temporarily unavailable. Please try again.",
  errorType: "SERVICE_ERROR"
}
```

---

## 🚀 Future API Enhancements

### Planned v1.1.0 Features
- **Real AI Integration**: OpenAI GPT-4 API implementation
- **Enhanced Error Handling**: More specific error types and recovery
- **Caching System**: Response caching for improved performance
- **Batch Translation**: Multiple text translation in single request

### Planned v1.2.0 Features
- **User Authentication**: API key management for users
- **Custom Styles**: User-defined translation styles
- **Translation History API**: Cloud-based history storage
- **Analytics API**: Usage statistics and insights

### Planned v2.0.0 Features
- **Multi-language Support**: Translation to different languages
- **Voice API**: Speech-to-text and text-to-speech integration
- **Real-time API**: WebSocket-based real-time translation
- **Third-party Integration**: Webhook and external API support

---

## 📊 Performance Considerations

### Response Times
- **Mock Service**: ~800-2000ms (simulated delay)
- **Target Real API**: <3000ms for 95th percentile
- **Timeout**: 10 seconds maximum

### Caching Strategy
```typescript
// Planned caching implementation
interface CacheEntry {
  key: string;           // Hash of request parameters
  response: string;      // Cached translation
  timestamp: number;     // Cache creation time
  ttl: number;          // Time to live (5 minutes)
}
```

### Rate Limiting Best Practices
- Implement exponential backoff for retries
- Show clear user feedback during rate limiting
- Cache responses to reduce API calls
- Batch requests when possible

---

## 🔐 Security Considerations

### Input Sanitization
```typescript
const sanitizeInput = (text: string): string => {
  // Remove potentially harmful characters
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
};
```

### API Key Management (Future)
```typescript
interface APIConfig {
  apiKey: string;        // Encrypted API key
  endpoint: string;      // API endpoint URL
  timeout: number;       // Request timeout
  retries: number;       // Max retry attempts
}
```

### Content Filtering
- Implement content moderation for inappropriate input
- Filter offensive language in responses
- Maintain family-friendly output options
- Log and monitor for abuse patterns

---

*Last Updated: January 27, 2025*  
*API Version: 1.0.0*  
*Next Review: February 1, 2025*