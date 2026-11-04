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

  // Siri AI endpoint with Apple Intelligence & Gemini reasoning with robust offline fallback
  app.post('/api/siri/chat', async (req, res) => {
    const { prompt, simulatorContext } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const systemInstruction = `You are Siri with Apple Intelligence on iOS 27 inside an interactive iPhone simulator.
Respond concisely (1-2 crisp, spoken sentences), with an authentic, friendly, helpful Apple Siri tone.
Current local time: ${new Date().toLocaleString()}.

If the user's intent matches one of these phone simulator actions, return an action payload in your JSON output:
- Open App: { "type": "open_app", "app": "home" | "settings" | "messages" | "camera" | "photos" | "safari" | "chrome" | "appstore" | "weather" | "calculator" | "clock" | "notes" | "phone" | "founder" | "maps" | "health" | "music" | "youtube" | "pinterest" | "whatsapp" | "paytm" | "amazon" | "gemini" | "blinkit" }
- Search on Safari: { "type": "search_safari", "query": string }
- Toggle Flashlight: { "type": "toggle_flashlight", "value": true | false }
- Toggle Dark Mode: { "type": "toggle_dark_mode", "value": true | false }
- Toggle Low Power Mode: { "type": "toggle_low_power_mode", "value": true | false }
- Toggle Do Not Disturb: { "type": "toggle_dnd", "value": true | false }
- Set Volume: { "type": "set_volume", "value": number (0-100) }
- Set Brightness: { "type": "set_brightness", "value": number (0-100) }
- Start Timer: { "type": "start_timer", "minutes": number }
- Play/Pause Music: { "type": "play_music", "value": boolean }
- Lock Screen: { "type": "lock_screen" }

Respond strictly with valid JSON:
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
        let parsed: any = null;
        try {
          parsed = JSON.parse(responseText);
        } catch {
          parsed = null;
        }

        if (parsed && typeof parsed.speech === 'string') {
          return res.json({
            response: parsed.speech,
            action: parsed.action || null,
            source: 'gemini'
          });
        }
      } catch (err) {
        console.warn('Siri Gemini error, switching to resilient intent engine:', err);
      }
    }

    // High-performance intelligent Siri fallback
    const simulated = generateSimulatedSiriResponse(prompt, simulatorContext);
    return res.json({
      response: simulated.response,
      action: simulated.action,
      source: 'intent_engine'
    });
  });

  // Safari Real-Time Search & Knowledge Graph API
  app.post('/api/safari/search', async (req, res) => {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    const cleanQuery = query.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Generate realistic Google search results and an AI overview for the query: "${cleanQuery}".`,
          config: {
            systemInstruction: `You are Google Search engine API. Return clean structured JSON conforming to:
{
  "query": "${cleanQuery}",
  "aiOverview": "A high-quality 2-3 sentence summary answering the query with key facts.",
  "knowledgeCard": null or { "title": "...", "subtitle": "...", "description": "...", "facts": [{"label": "...", "value": "..."}] },
  "results": [
    { "title": "...", "url": "https://...", "domain": "...", "snippet": "..." },
    { "title": "...", "url": "https://...", "domain": "...", "snippet": "..." },
    { "title": "...", "url": "https://...", "domain": "...", "snippet": "..." },
    { "title": "...", "url": "https://...", "domain": "...", "snippet": "..." }
  ],
  "peopleAlsoAsk": ["Question 1?", "Question 2?", "Question 3?"],
  "pageContent": "A detailed 3-paragraph article with markdown headings that represents the full webpage if the user clicks into this topic."
}`,
            responseMimeType: 'application/json',
            temperature: 0.6,
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed && Array.isArray(parsed.results) && parsed.results.length > 0) {
          return res.json({ ...parsed, source: 'gemini' });
        }
      } catch (err) {
        console.warn('Safari search Gemini error, falling back to instant knowledge base:', err);
      }
    }

    // Instant simulated search engine fallback for any query
    const fallbackResults = generateSimulatedSafariResults(cleanQuery);
    return res.json({ ...fallbackResults, source: 'local' });
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

  function generateSimulatedSiriResponse(
    prompt: string,
    simulatorContext: any
  ): { response: string; action: any } {
    const p = prompt.toLowerCase().trim();

    // 1. App Launching Intents
    if (p.includes('open blinkit') || p.includes('launch blinkit') || p.includes('groceries') || p.includes('blinkit')) {
      return { response: "Opening Blinkit for 10-minute grocery delivery.", action: { type: "open_app", app: "blinkit" } };
    }
    if (p.includes('open safari') || p.includes('open browser') || p.includes('safari')) {
      return { response: "Opening Safari.", action: { type: "open_app", app: "safari" } };
    }
    if (p.includes('open camera') || p.includes('take a photo') || p.includes('take a picture') || p.includes('take picture')) {
      return { response: "Opening Camera.", action: { type: "open_app", app: "camera" } };
    }
    if (p.includes('open whatsapp') || p.includes('whatsapp')) {
      return { response: "Opening WhatsApp.", action: { type: "open_app", app: "whatsapp" } };
    }
    if (p.includes('open paytm') || p.includes('paytm') || p.includes('send money') || p.includes('upi')) {
      return { response: "Opening Paytm UPI.", action: { type: "open_app", app: "paytm" } };
    }
    if (p.includes('open amazon') || p.includes('amazon shopping') || p.includes('amazon')) {
      return { response: "Opening Amazon.", action: { type: "open_app", app: "amazon" } };
    }
    if (p.includes('open settings') || p.includes('settings')) {
      return { response: "Opening Settings.", action: { type: "open_app", app: "settings" } };
    }
    if (p.includes('open weather') || p.includes('weather app')) {
      return { response: "Opening Weather.", action: { type: "open_app", app: "weather" } };
    }
    if (p.includes('open photos') || p.includes('photos') || p.includes('gallery')) {
      return { response: "Opening Photos.", action: { type: "open_app", app: "photos" } };
    }
    if (p.includes('open music') || p.includes('apple music')) {
      return { response: "Opening Apple Music.", action: { type: "open_app", app: "music" } };
    }
    if (p.includes('open clock') || p.includes('alarms') || p.includes('stopwatch')) {
      return { response: "Opening Clock.", action: { type: "open_app", app: "clock" } };
    }
    if (p.includes('open calculator') || p.includes('calculator')) {
      return { response: "Opening Calculator.", action: { type: "open_app", app: "calculator" } };
    }
    if (p.includes('open messages') || p.includes('text message') || p.includes('imessage')) {
      return { response: "Opening Messages.", action: { type: "open_app", app: "messages" } };
    }
    if (p.includes('open phone') || p.includes('make a call') || p.includes('dialer')) {
      return { response: "Opening Phone.", action: { type: "open_app", app: "phone" } };
    }
    if (p.includes('open youtube') || p.includes('youtube')) {
      return { response: "Opening YouTube.", action: { type: "open_app", app: "youtube" } };
    }
    if (p.includes('open gemini') || p.includes('gemini')) {
      return { response: "Opening Google Gemini.", action: { type: "open_app", app: "gemini" } };
    }
    if (p.includes('open founder') || p.includes('founder bio') || p.includes('vishnu')) {
      return { response: "Opening Founder Profile.", action: { type: "open_app", app: "founder" } };
    }
    if (p.includes('open app store') || p.includes('app store') || p.includes('install app')) {
      return { response: "Opening App Store.", action: { type: "open_app", app: "appstore" } };
    }
    if (p.includes('go home') || p.includes('home screen') || p.includes('close app')) {
      return { response: "Going to the Home screen.", action: { type: "open_app", app: "home" } };
    }

    // 2. Hardware and Device Controls
    if (p.includes('turn on flashlight') || p.includes('flashlight on') || p.includes('torch on')) {
      return { response: "Flashlight is now on.", action: { type: "toggle_flashlight", value: true } };
    }
    if (p.includes('turn off flashlight') || p.includes('flashlight off') || p.includes('torch off')) {
      return { response: "Flashlight is now off.", action: { type: "toggle_flashlight", value: false } };
    }
    if (p.includes('dark mode on') || p.includes('enable dark mode') || p.includes('turn on dark mode')) {
      return { response: "Dark Appearance enabled.", action: { type: "toggle_dark_mode", value: true } };
    }
    if (p.includes('light mode') || p.includes('turn off dark mode') || p.includes('disable dark mode')) {
      return { response: "Light Appearance enabled.", action: { type: "toggle_dark_mode", value: false } };
    }
    if (p.includes('low power mode') || p.includes('battery saver')) {
      const turnOn = !p.includes('off') && !p.includes('disable');
      return { response: `Low Power Mode is now ${turnOn ? 'on' : 'off'}.`, action: { type: "toggle_low_power_mode", value: turnOn } };
    }
    if (p.includes('do not disturb') || p.includes('silent mode') || p.includes('mute phone')) {
      const turnOn = !p.includes('off') && !p.includes('disable');
      return { response: `Do Not Disturb is ${turnOn ? 'on' : 'off'}.`, action: { type: "toggle_dnd", value: turnOn } };
    }
    if (p.includes('lock phone') || p.includes('lock screen') || p.includes('lock')) {
      return { response: "Locking iPhone.", action: { type: "lock_screen" } };
    }
    if (p.match(/volume (to )?(\d+)%/i) || p.match(/set volume (to )?(\d+)/i)) {
      const match = p.match(/(\d+)/);
      const val = match ? Math.min(100, Math.max(0, parseInt(match[1]))) : 50;
      return { response: `Volume set to ${val}%.`, action: { type: "set_volume", value: val } };
    }
    if (p.includes('volume up') || p.includes('louder')) {
      return { response: "Increasing volume.", action: { type: "set_volume", value: 85 } };
    }
    if (p.includes('volume down') || p.includes('quieter') || p.includes('mute')) {
      return { response: "Volume muted.", action: { type: "set_volume", value: 0 } };
    }
    if (p.match(/brightness (to )?(\d+)%/i) || p.match(/set brightness (to )?(\d+)/i)) {
      const match = p.match(/(\d+)/);
      const val = match ? Math.min(100, Math.max(10, parseInt(match[1]))) : 80;
      return { response: `Brightness set to ${val}%.`, action: { type: "set_brightness", value: val } };
    }

    // 3. Timers and Media
    if (p.match(/timer for (\d+)/i) || p.match(/set a timer/i) || p.match(/start timer/i)) {
      const match = p.match(/(\d+)/);
      const mins = match ? parseInt(match[1]) : 5;
      return { response: `Timer started for ${mins} minute${mins > 1 ? 's' : ''}.`, action: { type: "start_timer", minutes: mins } };
    }
    if (p.includes('play music') || p.includes('play song') || p.includes('play audio')) {
      return { response: "Playing music from your library.", action: { type: "play_music", value: true } };
    }
    if (p.includes('pause music') || p.includes('stop music')) {
      return { response: "Music paused.", action: { type: "play_music", value: false } };
    }

    // 4. Search and Web
    if (p.startsWith('search for ') || p.startsWith('google ') || p.startsWith('look up ')) {
      const query = p.replace(/^(search for|google|look up)\s+/i, '');
      return { response: `Searching Safari for "${query}".`, action: { type: "search_safari", query } };
    }

    // 5. System Stats, Math & Information
    if (p.includes('battery')) {
      const b = simulatorContext?.battery ?? 94;
      return { response: `Your battery level is ${b}%.`, action: null };
    }
    if (p.includes('time') || p.includes('what time')) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { response: `It's currently ${timeStr}.`, action: null };
    }
    if (p.includes('weather') || p.includes('temperature') || p.includes('rain')) {
      return { response: "It's 72°F and mostly sunny today in your area, with an expected high of 76°F.", action: null };
    }
    if (p.includes('who are you') || p.includes('what are you') || p.includes('your name')) {
      return { response: "I'm Siri, with Apple Intelligence on iOS 27. How can I help you today?", action: null };
    }
    if (p.includes('who made you') || p.includes('who built you') || p.includes('who created you')) {
      return { response: "I'm powered by Apple Intelligence in this iOS simulator built by Vishnu Sai Ramiya.", action: null };
    }
    if (p.includes('joke') || p.includes('funny')) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "What do you call an iPhone that isn't working? A dead ringer.",
        "Why did the computer show up at work late? It had a hard drive.",
        "There are 10 types of people in the world: those who understand binary, and those who don't."
      ];
      return { response: jokes[Math.floor(Math.random() * jokes.length)], action: null };
    }
    if (p.includes('hello') || p.includes('hi') || p.includes('hey')) {
      return { response: "Hello! What can I do for you?", action: null };
    }

    // Math evaluation
    const mathExpr = p.replace(/what is|calculate|solve|\?|=/gi, '').trim();
    if (/^[0-9+\-*/. ()%^]+$/.test(mathExpr) && mathExpr.length >= 3) {
      try {
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${mathExpr.replace(/%/g, '/100')})`)();
        if (typeof result === 'number' && !isNaN(result)) {
          return { response: `The answer is ${result}.`, action: null };
        }
      } catch {
        // ignore
      }
    }

    return {
      response: `I can search Safari for "${prompt}".`,
      action: { type: "search_safari", query: prompt }
    };
  }

  function generateSimulatedSafariResults(query: string) {
    const q = query.toLowerCase();

    let title = `${query} - Official Information & Guide`;
    let overview = `Comprehensive overview for "${query}". Explore official specifications, documentation, news, and community insights.`;
    let results = [
      {
        title: `${query} — Official Overview & Documentation`,
        url: `https://www.${query.replace(/[^a-z0-9]/g, '') || 'info'}.org/overview`,
        domain: `${query.replace(/[^a-z0-9]/g, '') || 'info'}.org`,
        snippet: `Discover all official resources, verified specifications, architecture, and live guides for ${query}. Updated for 2026.`
      },
      {
        title: `Wikipedia: ${query} (History, Architecture & Features)`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
        domain: 'en.wikipedia.org',
        snippet: `In-depth encyclopedic entry for ${query}. Covers historical origins, engineering timeline, key contributors, and impact.`
      },
      {
        title: `The Verge: Everything You Need to Know About ${query}`,
        url: `https://theverge.com/tech/${encodeURIComponent(query)}`,
        domain: 'theverge.com',
        snippet: `Our comprehensive analysis and hands-on testing of ${query}. Key highlights, performance benchmarks, and recommendations.`
      },
      {
        title: `Reddit Discussion: What are your thoughts on ${query}?`,
        url: `https://reddit.com/r/technology/comments/${encodeURIComponent(query)}`,
        domain: 'reddit.com',
        snippet: `Join 2,400+ comments from developers and enthusiasts discussing the latest updates, tips, and personal experiences with ${query}.`
      }
    ];

    if (q.includes('apple') || q.includes('iphone') || q.includes('ios')) {
      title = 'Apple Official — iPhone, iOS 27 & Apple Intelligence';
      overview = 'Apple unveils iOS 27 Quantum Intelligence Edition and iPhone 16 Pro, featuring photonic fluid liquid glass styling, A18 Pro silicon, and post-quantum security enclaves.';
      results = [
        {
          title: 'iPhone 16 Pro and iPhone 16 Pro Max — Apple',
          url: 'https://apple.com/iphone-16-pro',
          domain: 'apple.com',
          snippet: 'Featuring Grade 5 Titanium, 48MP Fusion Camera Control, A18 Pro chip, and unprecedented battery longevity.'
        },
        {
          title: 'iOS 27 Quantum OS Features — Apple Preview',
          url: 'https://apple.com/ios/ios-27',
          domain: 'apple.com',
          snippet: 'Explore Quantum Dynamic Island, Gemini 320 TOPS neural co-processor integration, and Photonic Fluid UI caustics.'
        },
        {
          title: 'Apple Support: Getting Started with Gestures & Siri',
          url: 'https://support.apple.com/guide/iphone-gestures',
          domain: 'support.apple.com',
          snippet: 'Learn how to pull down Control Center, switch between open apps with the bottom swipe bar, and launch Siri.'
        }
      ];
    } else if (q.includes('blinkit') || q.includes('grocery') || q.includes('delivery')) {
      title = 'Blinkit: 10-Minute Grocery Delivery in India';
      overview = 'Blinkit (formerly Grofers) is India’s premier instant delivery service delivering 10,000+ groceries, fresh fruits, and snacks in 10 minutes.';
      results = [
        {
          title: 'Blinkit: Everything Delivered in 10 Minutes',
          url: 'https://blinkit.com',
          domain: 'blinkit.com',
          snippet: 'Order fresh milk, vegetables, snacks, beverages, and electronics from your nearest local dark store in minutes.'
        },
        {
          title: 'Blinkit Store Locations & Bengaluru Hubs',
          url: 'https://blinkit.com/locations/bengaluru',
          domain: 'blinkit.com',
          snippet: 'Serving Koramangala, Indiranagar, HSR Layout, Bellandur, Whitefield and 30+ major cities across India.'
        }
      ];
    } else if (q.includes('react') || q.includes('javascript') || q.includes('typescript') || q.includes('code')) {
      title = 'React 18 & TypeScript Modern Frontend Documentation';
      overview = 'React is the library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript and TypeScript.';
      results = [
        {
          title: 'React – The Library for Web and Native User Interfaces',
          url: 'https://react.dev',
          domain: 'react.dev',
          snippet: 'Learn React with interactive documentation, hooks, Server Components, and best architectural patterns.'
        },
        {
          title: 'TypeScript: JavaScript With Syntax For Types',
          url: 'https://www.typescriptlang.org',
          domain: 'typescriptlang.org',
          snippet: 'TypeScript extends JavaScript by adding types to the language. Catch errors early and build robust web applications.'
        }
      ];
    }

    return {
      query,
      aiOverview: overview,
      knowledgeCard: {
        title,
        subtitle: `Verified Web Knowledge • Searched ${new Date().toLocaleDateString()}`,
        description: overview,
        facts: [
          { label: 'Category', value: 'Web Search & Intelligence' },
          { label: 'Latency', value: '0.04s' },
          { label: 'Verified Domain', value: results[0]?.domain || 'web.org' }
        ]
      },
      results,
      peopleAlsoAsk: [
        `What are the most popular features of ${query}?`,
        `How does ${query} compare to similar alternatives in 2026?`,
        `How to get started with ${query} on iOS?`
      ],
      pageContent: `## ${title}\n\n${overview}\n\n### Key Highlights\n- **Fast & Reliable**: Optimized for mobile Safari and instant responsive viewing.\n- **Verified Data**: Sources verified across official web indexes.\n- **Interactive Features**: You can bookmark this page, share it via iOS Share Sheet, or open reader mode with the **aA** control in the top bar.`
    };
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
