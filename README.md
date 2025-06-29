# Anger Translator 🔥

A modern React-based web application that transforms polite messages into comedic rage responses using AI-powered translation. Features multiple rage styles, real-time AI integration via OpenRouter, and a comprehensive user experience.

## 🚀 Features

### Core Translation
- **AI-Powered Translation**: Real AI integration via OpenRouter with fallback to mock service
- **Multiple AI Models**: Support for GPT-4, Claude, Llama, and other models
- **Three Rage Styles**:
  - 💼 **Corporate Meltdown**: Professional passive-aggressive responses
  - 🎮 **Epic Gamer Rage**: Over-the-top gaming terminology with CAPS LOCK
  - 😏 **Sarcastic Roast**: Witty, intellectually superior responses
- **Dynamic Intensity Control**: 10-level rage slider with visual feedback

### AI Integration
- **OpenRouter Service**: Access to multiple AI models through unified API
- **Seamless Fallback**: Automatic fallback to mock service if AI unavailable
- **Model Selection**: Choose from various AI models based on cost and performance
- **Real-time Status**: Live AI service status indicator and configuration

### User Experience
- **Interactive Emoji Mascot**: Changes expression based on rage level
- **Particle Effects**: CSS-only animation system with floating particles
- **Translation History**: Session-based storage with copy, share, and reuse
- **Usage Statistics**: Analytics dashboard showing patterns and preferences
- **Responsive Design**: Mobile-first approach with cross-device compatibility

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Shadcn/ui library
- **AI Service**: OpenRouter API integration
- **Build Tool**: Vite
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenRouter API key (optional, for AI features)

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

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### AI Configuration (Optional)

1. **Get OpenRouter API Key**
   - Visit [OpenRouter.ai](https://openrouter.ai)
   - Sign up and get your API key
   - Keys start with `sk-or-v1-...`

2. **Configure in App**
   - Click the settings icon in the AI status indicator
   - Enter your API key
   - Select your preferred AI model
   - Test the connection

3. **Environment Variables** (Production)
   ```bash
   VITE_OPENROUTER_API_KEY=your_api_key_here
   ```

## 🎯 Usage

### Basic Translation
1. Enter your polite message (5-500 characters)
2. Choose a rage style (Corporate, Gamer, or Sarcastic)
3. Adjust the rage level (1-10)
4. Click "TRANSLATE MY RAGE"
5. Copy, share, or reuse your translation

### AI Features
- **AI Toggle**: Switch between AI and mock translation
- **Model Selection**: Choose from various AI models
- **Cost Tracking**: Monitor usage and costs
- **Status Monitoring**: Real-time service status

### History & Stats
- **Translation History**: View and reuse past translations
- **Usage Statistics**: Track your rage patterns
- **Export/Share**: Share translations on social media

## 🔧 Configuration

### AI Models Available

| Model | Description | Cost/1k tokens | Speed |
|-------|-------------|----------------|-------|
| Claude 3 Haiku | Fast and cost-effective | $0.00025 | ⚡⚡⚡ |
| Claude 3 Sonnet | Balanced performance | $0.003 | ⚡⚡ |
| GPT-4o Mini | OpenAI efficient | $0.00015 | ⚡⚡⚡ |
| GPT-4o | Most capable | $0.005 | ⚡ |
| Llama 3.1 8B | Free open-source | Free | ⚡⚡ |

### Rate Limiting
- **Mock Service**: 10 requests per minute
- **AI Service**: Based on OpenRouter limits
- **Automatic Cooldown**: Visual feedback during rate limits

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── form/           # Form-related components
│   ├── display/        # Display components
│   ├── layout/         # Layout components
│   └── ui/             # Base UI components
├── hooks/              # Custom React hooks
├── services/           # API and external services
│   ├── translationService.ts      # Mock translation
│   ├── openRouterService.ts       # OpenRouter AI integration
│   └── enhancedTranslationService.ts # Combined service
├── types/              # TypeScript definitions
└── App.tsx            # Main application
```

## 🎨 Customization

### Adding New Rage Styles
1. Update `RageStyle` type in `src/types/translation.ts`
2. Add style configuration in translation services
3. Update `StyleSelector` component
4. Add style-specific prompts for AI

### Custom AI Models
1. Add model to `AVAILABLE_MODELS` in `openRouterService.ts`
2. Update model selection UI
3. Configure model-specific parameters

## 🔒 Security & Privacy

- **API Keys**: Stored locally, never sent to our servers
- **Data Privacy**: No translation data stored on external servers
- **Rate Limiting**: Built-in protection against abuse
- **Input Sanitization**: Validation and sanitization of user inputs

## 📊 Performance

- **Bundle Size**: ~450KB (gzipped: ~120KB)
- **First Contentful Paint**: ~1.2s
- **AI Response Time**: 1-3 seconds (varies by model)
- **Mock Response Time**: 0.8-2s (simulated)

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRouter**: For providing unified AI model access
- **Shadcn/ui**: For beautiful, accessible UI components
- **Tailwind CSS**: For utility-first styling
- **Lucide React**: For consistent iconography

## 📞 Support

For issues, feature requests, or questions:
- Create an issue in the repository
- Include version information and reproduction steps
- Check existing issues before creating new ones

## 🔮 Roadmap

### v1.1.0 (Next Release)
- [ ] Enhanced AI model selection
- [ ] Usage analytics and cost tracking
- [ ] Improved error handling
- [ ] Performance optimizations

### v1.2.0 (Future)
- [ ] User authentication
- [ ] Cloud storage for history
- [ ] Custom rage style creation
- [ ] Voice input/output

### v2.0.0 (Long-term)
- [ ] Mobile app companion
- [ ] Real-time collaboration
- [ ] Multi-language support
- [ ] Enterprise features

---

**Built with ❤️ and a lot of rage** 🔥

*Transform your politeness into comedic fury!*