# Codesphere 2.0 - Universal Neural IDE

<div align="center">



<h1>Built by Hossain Azmal</h1>

<p>the best website </p>

<">Start building</a>

</div>

---

## 🚀 Production-Ready Cloud-Based Coding Platform

Codesphere 2.0 is a robust cloud-based development platform that mirrors all features of Replit while adding advanced functionalities for AI integration, enhanced education support, better collaboration, and comprehensive developer tools.

### ✨ Key Features

- 🤖 **Advanced AI Integration** - Multi-provider AI support (Gemini, OpenAI, OpenRouter, EdenAI)
- 💻 **Universal IDE** - Support for 200+ programming languages
- 🔒 **Security Suite** - 941+ cybersecurity tools database
- 🎓 **Education Platform** - Classroom management for teachers and students
- 🔧 **Circuit Forge** - Electronics circuit design and simulation
- 🌐 **Web Builder** - Visual website development tool
- 🖥️ **VM Simulator** - Linux OS simulation (Kali, Ubuntu, etc.)
- 🎮 **Arcade** - Game library and player
- 💬 **Real-time Chat** - Multiplayer communication
- 🎤 **Voice Integration** - Real-time audio with Gemini Live

---

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **API Keys** (see Configuration section)

---

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/appbuilder2903/Ready-.git
   cd Ready-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_GITHUB_CLIENT_ID=your_github_client_id
   # ... etc
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Configuration

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Required - Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional - OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GITHUB_CLIENT_SECRET=your_github_secret

# Optional - External AI Services
VITE_EDEN_AI_KEY=your_eden_ai_key
VITE_OPENAI_KEY=your_openai_key
VITE_OPENROUTER_KEY=your_openrouter_key
```

### Getting API Keys

- **Gemini API**: [Google AI Studio](https://aistudio.google.com/)
- **OpenAI**: [OpenAI Platform](https://platform.openai.com/)
- **OpenRouter**: [OpenRouter.ai](https://openrouter.ai/)
- **EdenAI**: [EdenAI Console](https://www.edenai.co/)

---

## 🏗️ Building for Production

### Build the application

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Bundle and minify all assets
- Remove console.log statements
- Optimize for production
- Output to `dist/` directory

### Preview production build locally

```bash
npm run preview:prod
```

Open [http://localhost:4173](http://localhost:4173) to test the production build.

---

## 🌐 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Configure environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all `VITE_*` variables from your `.env` file

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy `dist/` folder via Netlify CLI or drag-and-drop to [Netlify Drop](https://app.netlify.com/drop)

3. Configure environment variables in Netlify:
   - Go to Site Settings → Environment Variables
   - Add all `VITE_*` variables

### Deploy to GitHub Pages

1. Update `vite.config.ts` base path:
   ```ts
   base: '/your-repo-name/'
   ```

2. Build and deploy:
   ```bash
   npm run build
   gh-pages -d dist
   ```

---

## 🧪 Development Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run build:prod    # Build with production optimizations
npm run preview       # Preview production build
npm run type-check    # Run TypeScript type checking
npm run clean         # Clean build artifacts
```

---

## 🏗️ Project Structure

```
Ready-/
├── components/           # React components
│   ├── ErrorBoundary.tsx    # Error handling component
│   ├── MatrixBackground.tsx # Animated background
│   └── LiveVisualizer.tsx   # Audio visualizer
├── services/            # API services
│   ├── geminiService.ts     # Gemini AI integration
│   └── externalAiService.ts # External AI providers
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
├── env.config.ts        # Environment configuration
├── types.ts             # TypeScript type definitions
├── constants.ts         # Application constants
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies

```

---

## 🔒 Security

- **Never commit `.env` files** - API keys are excluded from version control
- **Environment variables** - All sensitive data loaded from environment
- **Error boundaries** - Graceful error handling prevents crashes
- **Production build** - Console logs removed, code minified

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is private and proprietary.

---

## 🆘 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all required environment variables are set
3. Ensure API keys are valid and have proper permissions
4. Check network connectivity for API calls

---

## 🎯 Roadmap

- [ ] Real code execution with Docker containers
- [ ] WebSocket-based real-time collaboration
- [ ] Persistent database backend
- [ ] User authentication system
- [ ] File storage and version control
- [ ] Deployment automation
- [ ] Testing framework

---

**Made with ❤️ using Google Gemini & Vite + React + TypeScript**
