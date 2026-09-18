import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Siri AI endpoint with Apple Intelligence & Gemini reasoning
  app.post('/api/siri/chat', async (req, res) => {
    try {
      const { prompt, simulatorContext } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          response: `I heard: "${prompt}". To enable full AI reasoning, attach your Gemini API key in Settings > Secrets.`,
          action: null
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are Siri with Apple Intelligence on iOS 18 inside an interactive iPhone simulator.
Respond concisely (1-3 short, crisp sentences), with an authentic, friendly, helpful Apple Siri tone.
Current local time is: ${new Date().toLocaleString()}.

If the user's intent matches one of these phone simulator actions, return an action payload in your JSON output:
- Open App: { "type": "open_app", "app": "home" | "settings" | "messages" | "camera" | "photos" | "safari" | "appstore" | "weather" | "calculator" | "clock" | "notes" | "phone" | "founder" | "maps" | "health" | "music" | "youtube" | "pinterest" }
- Toggle Flashlight: { "type": "toggle_flashlight", "value": true | false }
- Toggle Dark Mode: { "type": "toggle_dark_mode", "value": true | false }
- Toggle Low Power Mode: { "type": "toggle_low_power_mode", "value": true | false }
- Toggle Do Not Disturb: { "type": "toggle_dnd", "value": true | false }
- Set Volume: { "type": "set_volume", "value": number (0-100) }
- Set Brightness: { "type": "set_brightness", "value": number (0-100) }
- Start Timer: { "type": "start_timer", "minutes": number }
- Play/Pause Music: { "type": "play_music", "value": boolean }
- Lock Screen: { "type": "lock_screen" }

Respond strictly with valid JSON conforming to:
{
  "speech": "Your crisp spoken Siri reply",
  "action": null or { "type": "...", ... }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `User voice query: "${prompt}". Simulator status: ${JSON.stringify(simulatorContext || {})}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });

      const responseText = response.text || '{}';
      let parsed = { speech: "I'm right here.", action: null };
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = { speech: responseText, action: null };
      }

      res.json({
        response: parsed.speech || "I'm right here.",
        action: parsed.action || null
      });
    } catch (err: any) {
      console.error('Siri AI Server Error:', err);
      res.status(500).json({
        error: err.message || 'Siri service error',
        response: "Sorry, I'm having trouble processing that right now.",
        action: null
      });
    }
  });

  // Dedicated Google Gemini App chat endpoint with multimodal & streaming/generation support
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { prompt, history, model, imageBase64, imageMimeType, systemInstruction } = req.body;
      if (!prompt && !imageBase64) {
        return res.status(400).json({ error: 'Prompt or image is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback intelligent responder when API key is not configured
        return res.json({
          response: generateSimulatedGeminiResponse(prompt, imageBase64),
          source: 'simulated',
          model: model || 'gemini-3.8-flash'
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Construct contents per @google/genai guidelines
      const targetModel = model || 'gemini-3.8-flash';
      const contentsPayload: any[] = [];

      // Add prior history if provided
      if (Array.isArray(history) && history.length > 0) {
        for (const msg of history) {
          contentsPayload.push({
            role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }]
          });
        }
      }

      // Add current user prompt (multimodal if image provided)
      const currentParts: any[] = [];
      if (imageBase64 && imageMimeType) {
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        currentParts.push({
          inlineData: {
            mimeType: imageMimeType || 'image/jpeg',
            data: cleanBase64
          }
        });
      }
      if (prompt) {
        currentParts.push({ text: prompt });
      }

      contentsPayload.push({
        role: 'user',
        parts: currentParts
      });

      const response = await ai.models.generateContent({
        model: targetModel,
        contents: contentsPayload,
        config: {
          systemInstruction: systemInstruction || 'You are Google Gemini on iOS. Provide helpful, well-structured, clear, and insightful responses. Use clean Markdown with code blocks, bullet points, or bold headers where appropriate.',
          temperature: 0.7,
        }
      });

      res.json({
        response: response.text || 'I was unable to generate a response.',
        source: 'live',
        model: targetModel
      });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      // Fallback gracefully so the app remains 100% usable
      res.json({
        response: generateSimulatedGeminiResponse(req.body.prompt, req.body.imageBase64),
        source: 'fallback',
        error: err.message,
        model: req.body.model || 'gemini-3.8-flash'
      });
    }
  });

  function generateSimulatedGeminiResponse(prompt?: string, imageBase64?: string): string {
    const p = (prompt || '').toLowerCase().trim();

    if (imageBase64) {
      return `### 🔍 Visual Analysis\n\nI analyzed the image you shared! Here is what I observe:\n\n- **Composition**: Clear visual elements with balanced framing.\n- **Subject**: Identified key objects, textures, and color distribution.\n- **Context**: The visual shows high-detail characteristics suitable for further analysis or creative remixing.\n\n*Feel free to ask specific questions about colors, text extraction (OCR), or design recommendations!*`;
    }

    if (p.includes('code') || p.includes('python') || p.includes('javascript') || p.includes('function') || p.includes('react')) {
      return `Here is an elegant, modern solution:\n\n\`\`\`typescript\n// Optimized function with error handling & memoization\nexport async function fetchData<T>(endpoint: string): Promise<T> {\n  try {\n    const res = await fetch(endpoint);\n    if (!res.ok) throw new Error(\`HTTP error! Status: \${res.status}\`);\n    return await res.json() as T;\n  } catch (error) {\n    console.error('Fetch failed:', error);\n    throw error;\n  }\n}\n\`\`\`\n\n### Key Highlights:\n1. **Type Safety**: Strictly typed with generics \`<T>\`.\n2. **Resilience**: Comprehensive \`try/catch\` pipeline.\n3. **Modern Async**: Native promises with clean async/await syntax.`;
    }

    if (p.includes('trip') || p.includes('travel') || p.includes('itinerary') || p.includes('vacation') || p.includes('visit')) {
      return `### ✈️ 3-Day Travel Itinerary\n\n**Day 1: Arrival & Historic Core**\n- **Morning**: Check into your boutique hotel, grab freshly brewed artisan coffee.\n- **Afternoon**: Explore historic landmarks and local cultural squares.\n- **Evening**: Authentic local dinner at a recommended family-run bistro.\n\n**Day 2: Culture & Panoramic Views**\n- **Morning**: Contemporary art museum & sculpture park.\n- **Afternoon**: Riverside promenade stroll and rooftop café.\n- **Evening**: Sunset skyline viewpoint and twilight food market.\n\n**Day 3: Nature & Hidden Gems**\n- **Morning**: Botanical gardens hike.\n- **Afternoon**: Specialty shopping district for bespoke crafts.\n- **Evening**: Farewell dinner and lounge cocktails.`;
    }

    if (p.includes('write') || p.includes('email') || p.includes('draft') || p.includes('letter')) {
      return `Here is a polished, professional draft for you:\n\n**Subject**: Following Up on Our Discussion / Project Collaboration\n\nHi [Name],\n\nI hope you are having a productive week.\n\nI wanted to follow up on our previous conversation regarding the upcoming initiative. We are excited about the possibilities and have outlined a streamlined approach to achieve our shared goals efficiently.\n\nCould we schedule a quick 15-minute sync this Thursday or Friday to align on the next steps? Please let me know what time works best for your calendar.\n\nBest regards,\n[Your Name]`;
    }

    if (p.includes('quantum') || p.includes('explain') || p.includes('what is') || p.includes('how does')) {
      return `### 💡 Clear Explanation\n\nAt its core, **quantum computing** differs from classical computing in how it processes information:\n\n- **Classical Bits**: Represented as binary \`0\` or \`1\` (like a light switch that is either ON or OFF).\n- **Qubits (Quantum Bits)**: Can exist in a state called **superposition**—effectively representing combinations of both \`0\` and \`1\` simultaneously.\n- **Entanglement**: Qubits can be linked such that the state of one instantly influences the state of another, enabling exponential processing parallelism for specific complex problems like molecular modeling, cryptography, and optimization.\n\nIn simple terms: Imagine having to find your way through a giant labyrinth. A classical computer checks one path at a time. A quantum computer explores all possible paths simultaneously!`;
    }

    return `I am right here and ready to help! As Google Gemini on iOS, I can assist you with:\n\n- ✍️ **Writing & Editing**: Drafting emails, essays, creative stories, or professional summaries.\n- 💻 **Coding & Debugging**: Writing Python, TypeScript, React, algorithms, and bug fixing.\n- 🔍 **Learning & Deep Research**: Breaking down complex topics, science, history, and current concepts.\n- 🎨 **Creative Brainstorming**: Marketing slogans, project ideas, travel itineraries, and visual concepts.\n- 📷 **Multimodal Vision**: You can upload photos or screenshots for instant analysis!\n\n*What would you like to explore or create today?*`;
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
