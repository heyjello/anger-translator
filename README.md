# Anger Translator 🔥

A modern React-based web application that transforms polite messages into comedic rage responses using AI-powered translation. Features multiple rage personas, real-time AI integration via OpenRouter, text-to-speech with ElevenLabs, and a comprehensive user experience.

## 🚀 Features

### Core Translation
- **AI-Powered Translation**: Real AI integration via OpenRouter with fallback to mock service
- **DeepSeek v3 Optimized**: Specifically optimized for DeepSeek's instruction-following capabilities
- **Multiple AI Models**: Support for GPT-4, Claude, Llama, and other models
- **Seven Rage Personas**:
  - 🔥 **The Enforcer**: Luther-style righteous fury with urban slang
  - 🧨 **The Highland Howler**: Explosive Scottish Dad with chaotic energy
  - 🍝 **The Don**: NY Italian-American Roastmaster with streetwise threats
  - 🎮 **The Cracked Controller**: Gen-Z gamer meltdown with panic bursts
  - 👩‍🦱 **Karen**: Suburban entitlement rage with polite-to-nuclear escalation
  - 💼 **Corporate Meltdown**: Professional passive-aggressive responses
  - 😏 **Sarcastic Roast**: Witty, intellectually superior responses
- **Dynamic Intensity Control**: 100-level rage slider (1-100) with visual feedback

### Text-to-Speech Integration
- **ElevenLabs TTS**: High-quality voice synthesis for translated text
- **Persona-Matched Voices**: Different voices for each rage persona
- **Rage-Adjusted Settings**: Voice parameters adjust based on intensity level
- **Smart Text Processing**: Optimized for dramatic speech delivery with bleep censoring

### AI Integration
- **OpenRouter Service**: Access to multiple AI models through unified API
- **Seamless Fallback**: Automatic fallback to mock service if AI unavailable
- **Model Selection**: Choose from various AI models based on cost and performance
- **Real-time Status**: Live AI service status indicator and configuration
- **DeepSeek v3 Optimization**: Special prompts and parameters optimized for DeepSeek Chat v3

### User Experience
- **Interactive Emoji Mascot**: Changes expression based on rage level
- **Particle Effects**: CSS-only animation system with floating particles
- **Translation History**: Session-based storage with copy, share, and reuse
- **Usage Statistics**: Analytics dashboard showing patterns and preferences
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Dark Cyberpunk Theme**: Modern developer tool aesthetic
- **Circular Rage Meter**: Professional voice editor interface

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Shadcn/ui library
- **AI Service**: OpenRouter API integration (optimized for DeepSeek v3)
- **Text-to-Speech**: ElevenLabs API integration
- **Build Tool**: Vite
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenRouter API key (optional, for AI features)
- ElevenLabs API key (optional, for text-to-speech)

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd anger-translator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your API keys
   VITE_OPENROUTER_API_KEY=your_openrouter_key_here
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### API Configuration

#### OpenRouter (AI Translation)
1. **Get OpenRouter API Key**
   - Visit [OpenRouter.ai](https://openrouter.ai)
   - Sign up and get your API key
   - Keys start with `sk-or-v1-...`

2. **Configure in App**
   - Click the AI status indicator in the app
   - Enter your API key
   - Select "DeepSeek Chat v3" (recommended and pre-optimized)
   - Test the connection

#### ElevenLabs (Text-to-Speech)
1. **Get ElevenLabs API Key**
   - Visit [ElevenLabs.io](https://elevenlabs.io/)
   - Sign up and get your API key
   - Keys are found in your profile settings

2. **Configure in Environment**
   - Add `VITE_ELEVENLABS_API_KEY=your_key_here` to `.env`
   - The app will automatically detect and enable TTS features

## 🎯 Usage

### Basic Translation
1. Enter your polite message (5-500 characters)
2. Choose a rage persona (Enforcer, Highland Howler, Don, etc.)
3. Adjust the rage level (1-100)
4. Click "TRANSLATE MY RAGE"
5. Copy, share, listen to, or reuse your translation

### Text-to-Speech Features
- **Listen Button**: Click the speaker icon to hear your translation
- **Persona-Matched Voices**: Each rage persona uses an appropriate voice
- **Intensity Adjustment**: Higher rage levels affect speech delivery
- **Smart Processing**: Text is optimized for dramatic speech synthesis with profanity bleeping

### AI Features
- **AI Toggle**: Switch between AI and mock translation
- **Model Selection**: Choose from various AI models
- **DeepSeek v3 Optimization**: Enjoy enhanced performance with DeepSeek Chat v3
- **Status Monitoring**: Real-time service status

### History & Stats
- **Translation History**: View and reuse past translations
- **Usage Statistics**: Track your rage patterns
- **Export/Share**: Share translations on social media

## 🔧 Configuration

### AI Models Available

| Model | Description | Cost/1k tokens | Speed | Recommended |
|-------|-------------|----------------|-------|-------------|
| **DeepSeek Chat v3 (Free)** | High-quality reasoning model | Free | ⚡⚡ | ⭐ **Top Choice** |
| Mixtral 8x7B Instruct | High-quality instruction-following | $0.00024 | ⚡⚡ | ⭐ |
| Claude 3 Haiku | Fast and cost-effective | $0.00025 | ⚡⚡⚡ | ⭐ |
| GPT-4o Mini | OpenAI efficient | $0.00015 | ⚡⚡⚡ | ⭐ |
| Llama 3.1 8B (Free) | Free open-source | Free | ⚡⚡ | ⭐ |

### Voice Configurations

| Persona | Voice | Description | Characteristics |
|---------|-------|-------------|----------------|
| Enforcer | Adam | Strong male voice | Authoritative, righteous fury |
| Highland Howler | Arnold | Deep Scottish voice | Explosive, chaotic energy |
| Don | Clyde | NY Italian voice | Threatening calm, streetwise |
| Cracked Controller | Antoni | Energetic gamer voice | Panicked, hyperactive |
| Karen | Bella | Entitled female voice | Fake-sweet to nuclear |
| Corporate | Adam | Professional male | Passive-aggressive authority |
| Sarcastic | Daniel | British male | Witty, intellectual superiority |

### Rate Limiting
- **Mock Service**: 10 requests per minute
- **AI Service**: Based on OpenRouter limits
- **TTS Service**: Based on ElevenLabs limits
- **Automatic Cooldown**: Visual feedback during rate limits

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── form/           # Form-related components
│   ├── display/        # Display components
│   ├── layout/         # Layout components
│   └── ui/             # Base UI components (including TTSButton)
├── hooks/              # Custom React hooks
│   ├── useEnhancedTranslation.ts  # AI translation hook
│   └── useTextToSpeech.ts         # TTS functionality hook
├── services/           # API and external services
│   ├── translationService.ts      # Mock translation
│   ├── openRouterService.ts       # OpenRouter AI integration
│   ├── elevenLabsService.ts       # ElevenLabs TTS integration
│   └── enhancedTranslationService.ts # Combined service
├── types/              # TypeScript definitions
├── config/             # Configuration files
└── App.tsx            # Main application
```

## 🎨 Rage Personas

### The Enforcer 🔥
**Style**: Luther-style righteous fury  
**Characteristics**: Urban slang, preacher cadence, moral authority  
**Examples**: "OH HELL NAH!", "I wish you would", "AND THAT'S ON PERIOD!"

### The Highland Howler 🧨
**Style**: Explosive Scottish Dad  
**Characteristics**: Chaotic pacing, wrench-wielding energy  
**Examples**: "What in the name of the wee man!", "Ya absolute weapon!", "Away and bile yer heid!"

### The Don 🍝
**Style**: NY Italian-American Roastmaster  
**Characteristics**: Streetwise threats, traffic fury, threatening calm  
**Examples**: "Fuggedaboutit!", "Ya mook!", "Don't make me come down there, capisce?"

### The Cracked Controller 🎮
**Style**: Gen-Z gamer meltdown  
**Characteristics**: Panic bursts, rage-quit threats, hyperactive energy  
**Examples**: "¡No mames!", "RATIO + L + BOZO!", "This is straight trash!"

### Karen 👩‍🦱
**Style**: Suburban entitlement rage  
**Characteristics**: Polite-to-nuclear escalation, manager threats  
**Examples**: "I want to speak to your manager!", "I'm a paying customer!", "This is unacceptable!"

### Corporate Meltdown 💼
**Style**: Professional fury  
**Characteristics**: Passive-aggressive excellence, corporate buzzwords  
**Examples**: "As per my previous email", "Please advise", "This is the third time"

### Sarcastic Roast 😏
**Style**: Witty destruction  
**Characteristics**: Intellectual superiority, cutting wit  
**Examples**: "How absolutely riveting!", "Truly enlightening", "What a masterpiece"

## 🔒 Security & Privacy

- **API Keys**: Stored locally, never sent to our servers
- **Data Privacy**: No translation data stored on external servers
- **Rate Limiting**: Built-in protection against abuse
- **Input Sanitization**: Validation and sanitization of user inputs
- **Audio Cleanup**: Automatic cleanup of generated audio files

## 📊 Performance

- **Bundle Size**: ~450KB (gzipped: ~120KB)
- **First Contentful Paint**: ~1.2s
- **AI Response Time**: 1-3 seconds (varies by model)
- **TTS Generation**: 2-5 seconds (varies by text length)
- **Mock Response Time**: 0.8-2s (simulated)
- **DeepSeek v3 Performance**: Optimized for fast, high-quality responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing component structure
- Add proper error handling
- Include comprehensive documentation
- Test with both AI and mock services
- Test TTS functionality with different voices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRouter**: For providing unified AI model access
- **DeepSeek**: For excellent instruction-following capabilities
- **ElevenLabs**: For high-quality text-to-speech synthesis
- **Shadcn/ui**: For beautiful, accessible UI components
- **Tailwind CSS**: For utility-first styling
- **Lucide React**: For consistent iconography
- **Bolt**: For the amazing development platform

## 📞 Support

For issues, feature requests, or questions:
- Create an issue in the repository
- Include version information and reproduction steps
- Check existing issues before creating new ones

## 🔮 Roadmap

### v1.1.0 (Next Release)
- [ ] Enhanced DeepSeek v3 prompt optimization
- [ ] Voice customization options
- [ ] Usage analytics and cost tracking
- [ ] Improved error handling
- [ ] Performance optimizations

### v1.2.0 (Future)
- [ ] User authentication
- [ ] Cloud storage for history
- [ ] Custom rage persona creation
- [ ] Voice cloning integration
- [ ] Multi-language TTS support

### v2.0.0 (Long-term)
- [ ] Mobile app companion
- [ ] Real-time collaboration
- [ ] Multi-language support
- [ ] Enterprise features
- [ ] Advanced voice effects

---

**Built with ❤️ and a lot of rage** 🔥  
**Powered by DeepSeek v3 & ElevenLabs** 🤖🎤  
**Made with Bolt** ⚡

*Transform your politeness into comedic fury and hear it come to life!*