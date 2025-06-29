# Usage Examples & Code Samples

## 🎯 Complete Usage Guide

### Basic Translation Example
```typescript
import { translateText, TranslationRequest } from '../services/translationService';

// Simple translation
const basicTranslation = async () => {
  const request: TranslationRequest = {
    text: "Could you please help me with this task?",
    style: "corporate",
    intensity: 5
  };

  try {
    const response = await translateText(request);
    if (response.success) {
      console.log("Original:", request.text);
      console.log("Translated:", response.translatedText);
      // Output: "AS PER MY PREVIOUS EMAIL... COULD YOU PLEASE HELP ME WITH THIS TASK?! Please advise how we can move forward with some actual competence!"
    }
  } catch (error) {
    console.error("Translation failed:", error);
  }
};
```

---

## 🎭 Style-Specific Examples

### Corporate Style Examples
```typescript
const corporateExamples = [
  {
    input: "The meeting could have been better organized",
    intensity: 3,
    expected: "Per our discussion, the meeting could have been better organized. Moving forward, let's ensure proper planning."
  },
  {
    input: "I need this report by tomorrow",
    intensity: 7,
    expected: "AS PER MY PREVIOUS EMAIL, I need this report by tomorrow! Please advise how we can ensure timely delivery with some actual competence!"
  },
  {
    input: "This process is inefficient",
    intensity: 10,
    expected: "I SHOULDN'T HAVE TO EXPLAIN THIS AGAIN! This process is absolutely INEFFICIENT! Please advise how we can escalate this to someone who actually knows what they're doing!"
  }
];

// Test corporate style
corporateExamples.forEach(async (example) => {
  const response = await translateText({
    text: example.input,
    style: "corporate",
    intensity: example.intensity
  });
  console.log(`Level ${example.intensity}:`, response.translatedText);
});
```

### Gamer Style Examples
```typescript
const gamerExamples = [
  {
    input: "This game is challenging",
    intensity: 3,
    expected: "Bruh, this game is challenging, but I got this!"
  },
  {
    input: "I keep losing matches",
    intensity: 7,
    expected: "ARE YOU KIDDING ME?! I keep losing matches! This is absolutely UNREAL! GET REKT!"
  },
  {
    input: "The lag is terrible",
    intensity: 10,
    expected: "BRUH!!! THE LAG IS TERRIBLE!!! ARE YOU ABSOLUTELY KIDDING ME RIGHT NOW?! This is completely UNPLAYABLE! GET REKT AND FIX YOUR SERVERS, NOOBS!!!"
  }
];
```

### Sarcastic Style Examples
```typescript
const sarcasticExamples = [
  {
    input: "Thanks for the quick response",
    intensity: 3,
    expected: "Oh, thanks for the 'quick' response - truly lightning fast."
  },
  {
    input: "Your presentation was informative",
    intensity: 7,
    expected: "WOW, your presentation was absolutely RIVETING! I'm just THRILLED to have experienced such groundbreaking information!"
  },
  {
    input: "Great job on the project",
    intensity: 10,
    expected: "Oh, MAGNIFICENT job on the project! Truly, your competence knows no bounds! What a delightful masterpiece of mediocrity!"
  }
];
```

---

## 🔧 Component Usage Examples

### Using the Translation Hook
```typescript
import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { RageStyle } from '../types/translation';

const TranslationExample: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [style, setStyle] = useState<RageStyle>('corporate');
  const [intensity, setIntensity] = useState(5);

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
    if (inputText.trim().length < 5) {
      alert('Please enter at least 5 characters');
      return;
    }

    await translate({
      text: inputText,
      style,
      intensity
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Translation Example</h2>
      
      {/* Input Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Enter your polite message:
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-3 border rounded-lg"
          rows={3}
          placeholder="Could you please help me with this?"
        />
      </div>

      {/* Style Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Choose rage style:
        </label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value as RageStyle)}
          className="w-full p-2 border rounded"
        >
          <option value="corporate">Corporate Meltdown</option>
          <option value="gamer">Epic Gamer Rage</option>
          <option value="sarcastic">Sarcastic Roast</option>
        </select>
      </div>

      {/* Intensity Slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Rage Level: {intensity}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Translate Button */}
      <button
        onClick={handleTranslate}
        disabled={isLoading || isRateLimited || inputText.trim().length < 5}
        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-bold disabled:bg-gray-400"
      >
        {isLoading ? 'Translating...' : 'TRANSLATE MY RAGE'}
      </button>

      {/* Rate Limit Warning */}
      {isRateLimited && (
        <div className="mt-4 p-3 bg-orange-100 border border-orange-300 rounded">
          Rate limited. Please wait {timeUntilNextRequest} seconds.
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
          <p className="text-red-700">{error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-sm text-red-600 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Your Rage Translation:</h3>
          <p className="text-gray-800 font-medium">{result}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Copy
            </button>
            <button
              onClick={clearResult}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationExample;
```

---

## 🎨 Component Integration Examples

### Custom Input Component
```typescript
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface CustomInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  maxLength?: number;
  placeholder?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onChange,
  error,
  maxLength = 500,
  placeholder = "Enter your message..."
}) => {
  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              onChange(e.target.value);
            }
          }}
          className={`w-full p-4 border-2 rounded-xl resize-none focus:ring-4 transition-all ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30' 
              : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/30'
          }`}
          rows={4}
          placeholder={placeholder}
        />
        <div className={`absolute bottom-3 right-3 text-sm font-medium ${
          isOverLimit ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-gray-400'
        }`}>
          {characterCount}/{maxLength}
        </div>
      </div>
      
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-600">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

// Usage
const ExampleUsage = () => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleChange = (newText: string) => {
    setText(newText);
    if (newText.length < 5) {
      setError('Message must be at least 5 characters');
    } else {
      setError('');
    }
  };

  return (
    <CustomInput
      value={text}
      onChange={handleChange}
      error={error}
      maxLength={500}
      placeholder="Enter your polite message here..."
    />
  );
};
```

### Style Selector Component
```typescript
import React from 'react';
import { RageStyle } from '../types/translation';

interface StyleOption {
  id: RageStyle;
  name: string;
  emoji: string;
  description: string;
  example: string;
}

const styleOptions: StyleOption[] = [
  {
    id: 'corporate',
    name: 'Corporate Meltdown',
    emoji: '💼',
    description: 'Professional passive-aggressive responses',
    example: 'As per my previous email...'
  },
  {
    id: 'gamer',
    name: 'Epic Gamer Rage',
    emoji: '🎮',
    description: 'Over-the-top gaming terminology',
    example: 'BRUH! ARE YOU KIDDING ME?!'
  },
  {
    id: 'sarcastic',
    name: 'Sarcastic Roast',
    emoji: '😏',
    description: 'Witty, intellectually superior responses',
    example: 'Oh, how absolutely riveting...'
  }
];

interface StyleSelectorProps {
  selectedStyle: RageStyle;
  onStyleSelect: (style: RageStyle) => void;
  disabled?: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
  disabled = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {styleOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => onStyleSelect(option.id)}
          disabled={disabled}
          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
            selectedStyle === option.id
              ? 'border-blue-500 bg-blue-50 shadow-lg'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{option.emoji}</span>
            <div>
              <h3 className="font-bold text-lg">{option.name}</h3>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 italic">
            "{option.example}"
          </div>
        </button>
      ))}
    </div>
  );
};

// Usage Example
const StyleSelectorExample = () => {
  const [selectedStyle, setSelectedStyle] = useState<RageStyle>('corporate');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Choose Your Rage Style:</h2>
      <StyleSelector
        selectedStyle={selectedStyle}
        onStyleSelect={setSelectedStyle}
        disabled={isLoading}
      />
      <div className="mt-4 text-center">
        <p>Selected: <strong>{selectedStyle}</strong></p>
      </div>
    </div>
  );
};
```

---

## 🎯 Advanced Usage Patterns

### Batch Translation Example
```typescript
interface BatchTranslationRequest {
  texts: string[];
  style: RageStyle;
  intensity: number;
}

const batchTranslate = async (request: BatchTranslationRequest) => {
  const results = [];
  
  for (const text of request.texts) {
    try {
      const response = await translateText({
        text,
        style: request.style,
        intensity: request.intensity
      });
      
      results.push({
        original: text,
        translated: response.success ? response.translatedText : 'Translation failed',
        success: response.success
      });
      
      // Add delay to respect rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({
        original: text,
        translated: 'Error occurred',
        success: false
      });
    }
  }
  
  return results;
};

// Usage
const batchExample = async () => {
  const texts = [
    "Please review this document",
    "The meeting was productive",
    "Thanks for your assistance"
  ];

  const results = await batchTranslate({
    texts,
    style: "sarcastic",
    intensity: 6
  });

  results.forEach((result, index) => {
    console.log(`${index + 1}. Original: ${result.original}`);
    console.log(`   Translated: ${result.translated}`);
    console.log(`   Success: ${result.success}\n`);
  });
};
```

### Translation History Management
```typescript
interface TranslationHistoryManager {
  history: TranslationHistory[];
  addTranslation: (original: string, translated: string, style: string, level: number) => void;
  getHistory: () => TranslationHistory[];
  clearHistory: () => void;
  exportHistory: () => string;
  importHistory: (data: string) => boolean;
}

const createHistoryManager = (): TranslationHistoryManager => {
  let history: TranslationHistory[] = [];

  return {
    history,
    
    addTranslation: (original, translated, style, level) => {
      const newItem: TranslationHistory = {
        id: Date.now().toString(),
        originalText: original,
        translatedText: translated,
        style,
        rageLevel: level,
        timestamp: new Date()
      };
      
      history.unshift(newItem);
      
      // Keep only last 50 items
      if (history.length > 50) {
        history = history.slice(0, 50);
      }
    },
    
    getHistory: () => [...history],
    
    clearHistory: () => {
      history = [];
    },
    
    exportHistory: () => {
      return JSON.stringify(history, null, 2);
    },
    
    importHistory: (data) => {
      try {
        const imported = JSON.parse(data);
        if (Array.isArray(imported)) {
          history = imported.map(item => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }));
          return true;
        }
      } catch (error) {
        console.error('Failed to import history:', error);
      }
      return false;
    }
  };
};

// Usage
const historyManager = createHistoryManager();

// Add translation to history
historyManager.addTranslation(
  "Please help me",
  "PLEASE HELP ME!!! ARE YOU KIDDING ME?!",
  "gamer",
  8
);

// Export history
const exportedData = historyManager.exportHistory();
console.log('Exported history:', exportedData);

// Import history
const importSuccess = historyManager.importHistory(exportedData);
console.log('Import successful:', importSuccess);
```

---

## 🔧 Testing Examples

### Unit Test Examples
```typescript
import { translateText, rateLimiter } from '../services/translationService';

describe('Translation Service', () => {
  beforeEach(() => {
    // Reset rate limiter before each test
    rateLimiter.reset?.();
  });

  test('should translate corporate style correctly', async () => {
    const request = {
      text: "Please review this document",
      style: "corporate" as const,
      intensity: 5
    };

    const response = await translateText(request);
    
    expect(response.success).toBe(true);
    expect(response.translatedText).toContain('PLEASE REVIEW THIS DOCUMENT');
    expect(response.translatedText).toContain('AS PER MY PREVIOUS EMAIL');
  });

  test('should handle validation errors', async () => {
    const request = {
      text: "", // Empty text
      style: "corporate" as const,
      intensity: 5
    };

    const response = await translateText(request);
    
    expect(response.success).toBe(false);
    expect(response.error).toBe('No text provided for translation');
  });

  test('should respect rate limiting', async () => {
    // Make maximum allowed requests
    for (let i = 0; i < 10; i++) {
      await translateText({
        text: `Test message ${i}`,
        style: "corporate",
        intensity: 5
      });
    }

    // Next request should be rate limited
    const response = await translateText({
      text: "This should be rate limited",
      style: "corporate",
      intensity: 5
    });

    expect(response.success).toBe(false);
    expect(response.error).toContain('Rate limit exceeded');
  });
});
```

### Component Testing Examples
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TranslationContainer } from '../containers/TranslationContainer';

describe('TranslationContainer', () => {
  test('should render input and translate button', () => {
    render(<TranslationContainer />);
    
    expect(screen.getByPlaceholderText(/enter your polite message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /translate my rage/i })).toBeInTheDocument();
  });

  test('should show validation error for short input', async () => {
    render(<TranslationContainer />);
    
    const input = screen.getByPlaceholderText(/enter your polite message/i);
    const button = screen.getByRole('button', { name: /translate my rage/i });
    
    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/message must be at least 5 characters/i)).toBeInTheDocument();
    });
  });

  test('should perform translation successfully', async () => {
    render(<TranslationContainer />);
    
    const input = screen.getByPlaceholderText(/enter your polite message/i);
    const button = screen.getByRole('button', { name: /translate my rage/i });
    
    fireEvent.change(input, { target: { value: 'Please help me with this task' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/translating/i)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/AS PER MY PREVIOUS EMAIL/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
```

---

## 🎨 Styling Examples

### Custom Animation Usage
```css
/* Custom rage-level animations */
.rage-level-1 { animation: gentle-pulse 2s ease-in-out infinite; }
.rage-level-5 { animation: moderate-shake 1s ease-in-out infinite; }
.rage-level-10 { animation: intense-shake 0.3s ease-in-out infinite; }

@keyframes gentle-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes moderate-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px) rotate(-1deg); }
  75% { transform: translateX(2px) rotate(1deg); }
}

@keyframes intense-shake {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  10% { transform: translateX(-3px) rotate(-2deg); }
  20% { transform: translateX(3px) rotate(2deg); }
  30% { transform: translateX(-3px) rotate(-2deg); }
  40% { transform: translateX(3px) rotate(2deg); }
}
```

### Responsive Design Examples
```typescript
const ResponsiveTranslationCard = () => {
  return (
    <div className="
      w-full max-w-4xl mx-auto
      p-4 sm:p-6 lg:p-8
      bg-white/95 backdrop-blur-lg
      rounded-xl sm:rounded-2xl
      shadow-lg sm:shadow-xl lg:shadow-2xl
      border border-white/20
    ">
      <div className="
        grid grid-cols-1 lg:grid-cols-2
        gap-4 sm:gap-6 lg:gap-8
      ">
        {/* Input Section */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
            Enter Your Message
          </h2>
          {/* Input components */}
        </div>
        
        {/* Output Section */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
            Your Rage Translation
          </h2>
          {/* Output components */}
        </div>
      </div>
    </div>
  );
};
```

---

*Last Updated: January 27, 2025*  
*Examples Version: 1.0.0*  
*Next Update: February 1, 2025*