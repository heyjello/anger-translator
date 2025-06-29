# File Documentation

## 📁 Complete File Structure & Documentation

### 🏠 Root Configuration Files

#### `package.json`
**Purpose**: Project dependencies and scripts configuration
**Key Dependencies**:
- React 18.3.1 - Core UI framework
- TypeScript 5.5.3 - Type safety
- Tailwind CSS 3.4.13 - Styling framework
- Vite 5.4.8 - Build tool and dev server
- Shadcn/ui components - Pre-built UI components
- Lucide React - Icon library

**Scripts**:
- `dev` - Start development server
- `build` - Build for production
- `lint` - Run ESLint
- `preview` - Preview production build

#### `tsconfig.json` & `tsconfig.app.json`
**Purpose**: TypeScript configuration
**Key Settings**:
- ES2020 target for modern JavaScript features
- Strict type checking enabled
- Path aliases for clean imports (@/*)
- React JSX support

#### `tailwind.config.js`
**Purpose**: Tailwind CSS configuration
**Features**:
- Custom color scheme with CSS variables
- Extended animations and keyframes
- Shadcn/ui integration
- Custom border radius values

#### `vite.config.ts`
**Purpose**: Vite build tool configuration
**Features**:
- React plugin integration
- Path alias resolution
- Lucide React optimization exclusion

---

### 🎨 Source Code Structure

#### `src/App.tsx` (Main Application)
**Purpose**: Root application component and state management
**Key Features**:
- Central state management for translation history
- Modal and panel visibility control
- Translation completion handling
- Particle effect coordination

**State Management**:
```typescript
- inputText: string
- selectedStyle: RageStyle
- rageLevel: number (1-10)
- translationHistory: TranslationHistory[]
- showHistory/showStats/showShareModal: boolean
```

**Key Functions**:
- `handleTranslate()` - Orchestrates translation process
- `addToHistory()` - Manages translation history
- `handleCopyToClipboard()` - Clipboard operations

---

### 🧩 Component Architecture

#### Form Components (`src/components/form/`)

##### `InputSection.tsx`
**Purpose**: Text input with validation and character counting
**Props**:
- `value: string` - Current input text
- `onChange: (value: string) => void` - Input change handler
- `error?: string` - Validation error message
- `maxChars: number` - Maximum character limit (500)
- `minChars: number` - Minimum character limit (5)
- `isLoading: boolean` - Loading state

**Features**:
- Real-time character counting with color coding
- Input validation with error display
- Disabled state during translation
- Accessibility support with ARIA labels

##### `StyleSelector.tsx`
**Purpose**: Rage style selection (Corporate, Gamer, Sarcastic)
**Props**:
- `selectedStyle: RageStyle` - Currently selected style
- `onStyleSelect: (style: RageStyle) => void` - Style selection handler
- `isLoading: boolean` - Loading state

**Style Options**:
```typescript
corporate: "Corporate Meltdown" - Professional fury
gamer: "Epic Gamer Rage" - CAPS LOCK FURY  
sarcastic: "Sarcastic Roast" - Witty destruction
```

##### `RageSlider.tsx`
**Purpose**: Intensity level selection with visual feedback
**Props**:
- `value: number` - Current rage level (1-10)
- `onChange: (value: number) => void` - Level change handler
- `isLoading: boolean` - Loading state

**Features**:
- Custom styled range slider with gradient track
- Number display inside slider thumb
- Emoji mascot integration
- Descriptive labels for intensity levels

##### `TranslateButton.tsx`
**Purpose**: Main action button with enhanced animations
**Props**:
- `onTranslate: () => void` - Translation trigger
- `isValid: boolean` - Form validation state
- `isLoading: boolean` - Loading state
- `isRateLimited: boolean` - Rate limiting state
- `validationMessage?: string` - Validation feedback

**Features**:
- Animated pulse effect when valid
- Loading spinner during translation
- Validation feedback display
- Accessibility support

#### Display Components (`src/components/display/`)

##### `OutputSection.tsx`
**Purpose**: Translation result display with actions
**Props**:
- `outputText: string` - Translated text
- `onCopy: () => void` - Copy to clipboard handler
- `onClear: () => void` - Clear output handler
- `onShare: () => void` - Share functionality
- `isCopied: boolean` - Copy feedback state
- `isLoading: boolean` - Loading state

**Features**:
- Animated slide-in for results
- Copy/Clear/Share action buttons
- Loading state with spinner
- Gradient background styling

##### `ErrorDisplay.tsx`
**Purpose**: Reusable error/warning/info message component
**Props**:
- `type: ErrorType` - Message type (error|warning|info)
- `message: string` - Message content
- `onDismiss?: () => void` - Optional dismiss handler
- `icon?: React.ReactNode` - Custom icon override

**Features**:
- Type-specific styling and icons
- Dismissible messages
- Slide-in animation
- Consistent error handling

##### `BackgroundAnimation.tsx`
**Purpose**: Animated background elements
**Features**:
- Self-contained animated elements
- CSS-only animations (pulse, bounce, ping)
- No props required
- Performance optimized

#### Layout Components (`src/components/layout/`)

##### `NavigationHeader.tsx`
**Purpose**: App header with navigation controls
**Props**:
- `historyCount: number` - Number of history items
- `showHistory/showStats: boolean` - Panel visibility states
- `onToggleHistory/onToggleStats: () => void` - Toggle handlers

**Features**:
- Gradient text title
- History and stats toggle buttons
- Count badges
- Responsive design

#### UI Enhancement Components (`src/components/ui/`)

##### `EmojiMascot.tsx`
**Purpose**: Dynamic emoji that changes based on rage level
**Props**:
- `rageLevel: number` - Current intensity level

**Emoji Mapping**:
- 1-3: 😊 (Calm)
- 4-6: 😤 (Mild annoyance)  
- 7-8: 😠 (Angry)
- 9-10: 🤬 (Pure rage)

##### `ParticleEffect.tsx`
**Purpose**: CSS-only particle animation system
**Props**:
- `isActive: boolean` - Animation trigger
- `onComplete: () => void` - Completion callback

**Features**:
- 8 floating particles with staggered animations
- Explosion rings for dramatic effect
- Pure CSS animations for performance
- Auto-cleanup after completion

##### `EnhancedFooter.tsx`
**Purpose**: Branded footer with social links
**Features**:
- "Built with Bolt" branding
- Animated lightning bolt icons
- Glassmorphism styling
- Social media placeholders

---

### 🔧 Utility & Service Files

#### `src/hooks/useTranslation.ts`
**Purpose**: Custom hook for translation logic
**Returns**:
```typescript
{
  translate: (request: TranslationRequest) => Promise<void>
  isLoading: boolean
  result: string
  error: string | null
  isRateLimited: boolean
  timeUntilNextRequest: number
  clearResult: () => void
  clearError: () => void
}
```

**Features**:
- Rate limiting (10 requests/minute)
- Error handling and recovery
- Loading state management
- Result caching

#### `src/services/translationService.ts`
**Purpose**: Translation API service layer
**Key Functions**:
- `translateText()` - Main translation function
- `rateLimiter` - Rate limiting implementation
- Mock translation for development
- OpenAI integration ready (commented)

**Translation Styles**:
```typescript
corporate: Professional passive-aggressive responses
gamer: Over-the-top gaming terminology with CAPS
sarcastic: Witty, intellectually superior responses
```

#### `src/types/`
**Purpose**: TypeScript type definitions

##### `translation.ts`
```typescript
export type RageStyle = 'corporate' | 'gamer' | 'sarcastic'
export interface TranslationRequest
export interface TranslationHistory
export interface TranslationStats
```

##### `ui.ts`
```typescript
export type ErrorType = 'error' | 'warning' | 'info'
export interface BaseComponentProps
export interface ValidationResult
```

---

### 🎨 Styling & Assets

#### `src/App.css`
**Purpose**: Custom CSS animations and component styling
**Key Features**:
- Custom slider styling with number inside thumb
- Particle animation keyframes (8 different float patterns)
- Explosion ring animations
- Shake animations (mild and intense)
- Button pulse effects
- Gradient utilities
- Glassmorphism effects

**Animation Classes**:
- `.animate-fade-in` - Smooth fade in with slide up
- `.animate-slide-in` - Slide in from left
- `.animate-button-pulse` - Continuous pulse for buttons
- `.animate-particle-float-*` - 8 particle animation variants
- `.animate-shake-*` - Shake effects for different intensities

#### `src/index.css`
**Purpose**: Global styles and Tailwind integration
**Features**:
- Tailwind CSS imports
- CSS custom properties for theming
- Global font and layout resets
- Dark/light mode support
- Shadcn/ui integration

---

### 📊 Data Management

#### Translation History System
**Storage**: Local state (session-based)
**Structure**:
```typescript
interface TranslationHistory {
  id: string
  originalText: string
  translatedText: string
  style: string
  rageLevel: number
  timestamp: Date
}
```

**Features**:
- Automatic addition on successful translation
- Maximum 20 items (FIFO)
- Copy, share, and reuse functionality
- Timestamp tracking

#### Statistics Tracking
**Metrics Collected**:
- Total translations count
- Average rage level
- Favorite style (most used)
- Maximum rage level used
- Style breakdown percentages

---

### 🔒 Error Handling & Validation

#### Input Validation
- Minimum 5 characters required
- Maximum 500 characters allowed
- Real-time validation feedback
- Empty input prevention

#### Rate Limiting
- 10 requests per minute limit
- Automatic cooldown display
- Request queue management
- Error recovery

#### Error Boundaries
- Translation service errors
- Network failure handling
- Graceful degradation
- User-friendly error messages

---

### 📱 Responsive Design

#### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

#### Mobile Optimizations
- Touch-friendly button sizes
- Optimized slider for mobile
- Responsive grid layouts
- Readable font sizes

---

### ♿ Accessibility Features

#### ARIA Support
- Proper labeling for all interactive elements
- Screen reader friendly descriptions
- Keyboard navigation support
- Focus management

#### Visual Accessibility
- High contrast color schemes
- Readable font sizes
- Clear visual hierarchy
- Color-blind friendly design

---

### 🚀 Performance Optimizations

#### Code Splitting
- Component-based splitting
- Lazy loading ready
- Bundle size optimization

#### Animation Performance
- CSS-only animations where possible
- GPU acceleration utilization
- Minimal JavaScript animations
- Efficient re-render prevention

#### Memory Management
- Proper cleanup of timeouts
- Event listener management
- State optimization
- Component memoization ready