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
        model: 'gemini-3.7-flash',
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
