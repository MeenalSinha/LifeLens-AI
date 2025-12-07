# LifeLens AI 🔍✨

**Turn confusion into clarity** — A multimodal AI assistant that simplifies complex documents, images, and real-world information using Google's Gemini 2.5 Flash model.

---

## Why LifeLens?

Most AI tools answer questions. LifeLens explains things. It focuses on understanding, not just responses — especially for people facing unfamiliar or high-stakes documents.

---

## Overview

LifeLens AI helps users understand confusing documents and images through clear, structured explanations. Upload a hospital bill, rental contract, or chemistry diagram, and get it broken down into plain English.

### Key Features

- 📷 **Multimodal Input**: Upload images, PDFs, or record voice notes
- 🧠 **Structured Analysis**: Every response follows a clear 5-section format
- 💬 **Conversational Interface**: Natural chat experience with memory
- 🎙️ **Voice Recording**: Hold-to-speak audio input
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚡ **Real-time Streaming**: Fast responses with Gemini 2.5 Flash

---

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 2.5 Flash (`@google/genai`)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Markdown**: React Markdown

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Google AI Studio API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lifelens-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   
   **Note**: The code references this as `process.env.API_KEY` via Vite's define config in `vite.config.ts`.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## Project Structure

```
lifelens-ai/
├── components/
│   ├── Header.tsx          # App header with branding
│   ├── MessageList.tsx     # Chat message display
│   ├── InputArea.tsx       # Text/file/voice input
│   └── MarkdownRenderer.tsx # Formatted response rendering
├── services/
│   └── geminiService.ts    # Gemini API integration
├── utils/
│   └── fileUtils.ts        # File conversion helpers
├── App.tsx                 # Main app component
├── types.ts                # TypeScript interfaces
├── constants.ts            # System instructions & config
└── index.html              # Entry point
```

---

## How It Works

### 1. Input Methods
- **Text**: Type questions or descriptions
- **Files**: Attach images (JPG, PNG) or PDFs (max 10MB, up to 5 files)
- **Voice**: Hold the microphone button to record audio

### 2. AI Processing
The system sends your input to Gemini 2.5 Flash with a specialized system instruction that enforces a structured response format:

```
## 1. Document Type
## 2. Key Information
## 3. Why It Matters
## 4. Simple Explanation
## 5. Helpful Next Step
```

### 3. Response Display
Responses are rendered with markdown formatting for readability, including:
- Structured sections with clear headers
- Bullet points for key details
- Proper emphasis and styling

---

## Configuration

### Model Settings
Located in `constants.ts`:
- **Model**: `gemini-2.5-flash` (fast, multimodal)
- **Temperature**: `0.4` (factual, grounded responses)
- **System Instruction**: Detailed prompt engineering for consistent output

### File Limits
Located in `components/InputArea.tsx`:
- Max files: 5 per message
- Max size: 10MB per file
- Supported: Images (image/*), PDFs (application/pdf), Audio (audio/webm)

---

## Use Cases

### 📊 Financial Documents
*"Is this hospital bill accurate?"*
- Identifies charges, insurance coverage, and potential errors

### 📚 Education & Learning
*"Explain this chemistry diagram."*
- Breaks down complex concepts into simple language

### ⚖️ Legal Documents
*"Summarize this rental contract."*
- Highlights key terms, obligations, and deadlines

### 🌍 General Knowledge
*"What is this vegetable?"*
- Identifies objects and provides context

---

## API Integration

The app uses Google's Gemini API via the `@google/genai` SDK. API keys are never committed and are accessed via environment variables only.

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const chatSession = ai.chats.create({
  model: "gemini-2.5-flash",
  config: { systemInstruction, temperature: 0.4 }
});
```

**Key Features**:
- Maintains conversation context across messages
- Basic retry handling for failed requests (1 retry with 1s delay)
- Supports multimodal input (text, images, PDFs, audio)

---

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment Variables
- `GEMINI_API_KEY`: Your Google AI Studio API key (required)

---

## Limitations & Disclaimers

⚠️ **Medical Information**: This tool provides educational insights only. Always consult healthcare professionals for medical advice.

⚠️ **Legal Information**: Explanations are for understanding purposes only. Consult a licensed attorney for legal matters.

⚠️ **Accuracy**: AI-generated responses may contain errors. Verify critical information independently.

---

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

## License

This project is open source and available under the MIT License.

---

## Acknowledgments

- Built with [Google Gemini 2.5 Flash](https://ai.google.dev/)
- UI components inspired by modern chat interfaces
- Icons by [Lucide](https://lucide.dev/)

---

**Made with ❤️ to turn confusion into clarity**
