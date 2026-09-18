import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Plus,
  Image as ImageIcon,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Menu,
  X,
  ChevronDown,
  Trash2,
  Radio,
  Share2,
  MessageSquare,
  Compass,
  Code2,
  BrainCircuit,
  Paperclip,
  ArrowUp,
  User,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SimulatorState, IosAppId } from '../../../types';
import { playSuccessChime, playBiometricTickSound } from '../../../utils/audioUtils';

interface GeminiAppProps {
  state: SimulatorState;
  onUpdateState?: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onOpenApp?: (app: IosAppId) => void;
  onClose: () => void;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  image?: string;
  timestamp: string;
  isStreaming?: boolean;
  modelUsed?: string;
}

interface SavedChat {
  id: string;
  title: string;
  date: string;
  preview: string;
}

const SAMPLE_CHATS: SavedChat[] = [
  {
    id: 'chat-1',
    title: 'Python Web Scraper & Parser',
    date: 'Today',
    preview: 'Here is an optimized asynchronous scraper using Playwright and BeautifulSoup...'
  },
  {
    id: 'chat-2',
    title: 'Weekend Itinerary in Kyoto',
    date: 'Yesterday',
    preview: 'Day 1: Fushimi Inari at sunrise, followed by Kiyomizu-dera and Gion alleyways...'
  },
  {
    id: 'chat-3',
    title: 'Quantum Computing Explained',
    date: 'Sep 14',
    preview: 'Superposition allows qubits to explore exponential configurations simultaneously...'
  }
];

const PRESET_PROMPTS = [
  { label: '💡 Brainstorm ideas', query: 'Brainstorm 5 innovative mobile app concepts utilizing modern on-device AI' },
  { label: '💻 TypeScript code', query: 'Write an asynchronous retry function in TypeScript with exponential backoff' },
  { label: '✍️ Draft an email', query: 'Draft a polite follow-up email after an executive interview' },
  { label: '🔬 Explain quantum mechanics', query: 'Explain how quantum entanglement works using a simple analogy' },
  { label: '✈️ 3-day travel plan', query: 'Create a vibrant 3-day food and cultural travel itinerary for Tokyo' }
];

export const GeminiApp: React.FC<GeminiAppProps> = ({ state, onClose }) => {
  // Navigation & UI States
  const [activeModel, setActiveModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-pro-preview'>('gemini-3.8-flash');
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hi Alex, I'm **Google Gemini**.\n\nI can help you write, plan, brainstorm, debug code, analyze images, and explore anything you are curious about.\n\nHow can I help you today?",
      timestamp: 'Just now',
      modelUsed: 'gemini-3.8-flash'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');

  // Interactive Voice & Speech Synthesis
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<{ [id: string]: 'up' | 'down' }>({});

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Speech Recognition (Web Speech API if available)
  const toggleListening = () => {
    playBiometricTickSound();
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Simulate voice recording if browser does not support SpeechRecognition
      if (isListening) {
        setIsListening(false);
      } else {
        setIsListening(true);
        setTimeout(() => {
          setInputPrompt('Explain how machine learning neural networks learn patterns');
          setIsListening(false);
          playBiometricTickSound();
        }, 2200);
      }
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Speak Gemini reply aloud using SpeechSynthesis
  const speakText = (text: string) => {
    if (isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Clean markdown tags for natural speech
      const cleanText = text
        .replace(/[#*`_~]/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .slice(0, 300); // speak first few sentences cleanly

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Send message to Gemini API
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if ((!prompt && !selectedImage) || isLoading) return;

    playBiometricTickSound();

    const userMessageId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: prompt,
      image: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputPrompt('');
    const currentImg = selectedImage;
    const currentMime = imageMimeType;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Format history for server payload
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history: historyPayload,
          model: activeModel,
          imageBase64: currentImg,
          imageMimeType: currentMime,
          systemInstruction: 'You are Google Gemini, an intelligent, helpful, and articulate AI assistant on iOS. Provide insightful, well-structured, clear responses with formatting, headers, and code blocks where helpful.'
        })
      });

      const data = await res.json();
      const responseText = data.response || 'I am right here to help you.';

      playSuccessChime();

      const assistantMessage: ChatMessage = {
        id: `gemini-${Date.now()}`,
        role: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model || activeModel
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If in Live mode or speech enabled, read aloud
      if (isLiveMode) {
        speakText(responseText);
      }
    } catch (err) {
      console.error('Gemini error:', err);
      const fallbackMessage: ChatMessage = {
        id: `gemini-err-${Date.now()}`,
        role: 'assistant',
        text: `### 💡 Quick Answer\n\nHere are the key points regarding **${prompt || 'your question'}**:\n\n- **Precision & Clarity**: Breaking down complex topics into actionable steps.\n- **Direct Application**: Apply this directly in your workflow or project.\n\n*Let me know if you would like me to expand further!*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: activeModel
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Image Upload handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setImageMimeType(file.type || 'image/jpeg');
        playBiometricTickSound();
      };
      reader.readAsDataURL(file);
    }
  };

  // Copy message text
  const handleCopyText = (id: string, text: string) => {
    playBiometricTickSound();
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simple Markdown renderer helper
  const renderMarkdown = (text: string) => {
    // Split by code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0]?.match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
        const codeContent = language ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="my-2.5 rounded-xl overflow-hidden border border-neutral-700/60 bg-[#1e1f20] text-xs font-mono">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#2a2b2d] text-neutral-400 text-[11px] border-b border-neutral-700/40">
              <span>{language || 'code'}</span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(codeContent);
                  playBiometricTickSound();
                }}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-3 overflow-x-auto text-neutral-200 leading-relaxed font-mono">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Process headers, bold, bullet points
      const lines = part.split('\n');
      return (
        <div key={index} className="space-y-1.5">
          {lines.map((line, lineIdx) => {
            if (line.startsWith('### ')) {
              return (
                <h4 key={lineIdx} className="text-sm font-bold text-neutral-100 mt-2 mb-1 flex items-center gap-1">
                  {line.replace('### ', '')}
                </h4>
              );
            }
            if (line.startsWith('## ')) {
              return (
                <h3 key={lineIdx} className="text-base font-bold text-neutral-100 mt-2.5 mb-1">
                  {line.replace('## ', '')}
                </h3>
              );
            }
            if (line.startsWith('# ')) {
              return (
                <h2 key={lineIdx} className="text-lg font-black text-neutral-100 mt-3 mb-1">
                  {line.replace('# ', '')}
                </h2>
              );
            }
            if (line.startsWith('- ') || line.startsWith('* ')) {
              const clean = line.slice(2);
              return (
                <div key={lineIdx} className="flex items-start gap-1.5 pl-1 text-[13px] leading-relaxed">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{renderInlineStyles(clean)}</span>
                </div>
              );
            }
            if (line.match(/^\d+\.\s/)) {
              return (
                <div key={lineIdx} className="flex items-start gap-1.5 pl-1 text-[13px] leading-relaxed">
                  <span className="text-purple-400 font-semibold">{line.slice(0, 3)}</span>
                  <span>{renderInlineStyles(line.slice(3))}</span>
                </div>
              );
            }
            if (line.trim() === '') {
              return <div key={lineIdx} className="h-1" />;
            }
            return (
              <p key={lineIdx} className="text-[13px] leading-relaxed text-neutral-200">
                {renderInlineStyles(line)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  const renderInlineStyles = (content: string) => {
    // Bold **text**
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((chunk, i) => {
      if (chunk.startsWith('**') && chunk.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-white">
            {chunk.slice(2, -2)}
          </strong>
        );
      }
      if (chunk.startsWith('`') && chunk.endsWith('`')) {
        return (
          <code key={i} className="bg-neutral-800 text-blue-300 px-1 py-0.5 rounded text-xs font-mono">
            {chunk.slice(1, -1)}
          </code>
        );
      }
      return chunk;
    });
  };

  return (
    <div className="w-full h-full bg-[#131314] text-neutral-100 flex flex-col select-none font-sans overflow-hidden relative">
      {/* Hidden File Input for Image Analysis */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* Top Header Bar */}
      <div className="bg-[#131314]/95 backdrop-blur-md pt-11 px-3 pb-2.5 flex items-center justify-between border-b border-white/10 z-20 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Drawer Menu Button */}
          <button
            onClick={() => {
              playBiometricTickSound();
              setIsSidebarOpen(!isSidebarOpen);
            }}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Model Selector Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => {
                playBiometricTickSound();
                setIsModelMenuOpen(!isModelMenuOpen);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1e1f20] hover:bg-[#282a2c] rounded-full text-xs font-semibold text-neutral-200 border border-white/10 transition-colors"
            >
              <div className="w-3.5 h-3.5 relative flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
              </div>
              <span className="font-bold">
                {activeModel === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Gemini 3.1 Pro'}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Model Dropdown Menu */}
            {isModelMenuOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-[#1e1f20] border border-neutral-700/80 rounded-xl shadow-2xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setActiveModel('gemini-3.8-flash');
                    setIsModelMenuOpen(false);
                    playBiometricTickSound();
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors ${
                    activeModel === 'gemini-3.8-flash' ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-neutral-800'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      Gemini 3.8 Flash
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Ultra fast multimodal reasoning</p>
                  </div>
                  {activeModel === 'gemini-3.8-flash' && <Check className="w-4 h-4 text-blue-400" />}
                </button>

                <button
                  onClick={() => {
                    setActiveModel('gemini-3.1-pro-preview');
                    setIsModelMenuOpen(false);
                    playBiometricTickSound();
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors mt-1 ${
                    activeModel === 'gemini-3.1-pro-preview' ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-neutral-800'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                      Gemini 3.1 Pro
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Deep reasoning & STEM analysis</p>
                  </div>
                  {activeModel === 'gemini-3.1-pro-preview' && <Check className="w-4 h-4 text-purple-400" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions: Live Audio Toggle, New Chat */}
        <div className="flex items-center gap-2">
          {/* Gemini Live Audio Mode Toggle */}
          <button
            onClick={() => {
              playBiometricTickSound();
              setIsLiveMode(!isLiveMode);
            }}
            className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
              isLiveMode
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 animate-pulse'
                : 'bg-[#1e1f20] text-neutral-300 hover:text-white border border-white/10'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="text-[11px]">{isLiveMode ? 'Live On' : 'Live'}</span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={() => {
              playBiometricTickSound();
              setMessages([
                {
                  id: `welcome-${Date.now()}`,
                  role: 'assistant',
                  text: "How can I help you today?",
                  timestamp: 'Just now',
                  modelUsed: activeModel
                }
              ]);
            }}
            title="New Chat"
            className="p-1.5 bg-[#1e1f20] hover:bg-[#282a2c] text-neutral-300 hover:text-white rounded-full border border-white/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Viewport */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 no-scrollbar">
        {/* Gemini Live Audio Ambient Banner when enabled */}
        {isLiveMode && (
          <div className="p-3 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl flex items-center justify-between animate-fade-in shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-pink-500 rounded-full blur-sm animate-pulse opacity-70" />
                <Sparkles className="w-4 h-4 text-white relative z-10" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Gemini Live Voice Active
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h4>
                <p className="text-[10px] text-purple-200">Spoken audio responses are automatically enabled</p>
              </div>
            </div>

            <button
              onClick={() => {
                playBiometricTickSound();
                setIsMuted(!isMuted);
              }}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
          >
            {/* Role Header */}
            <div className="flex items-center gap-1.5 mb-1 text-[11px] text-neutral-400 font-medium px-1">
              {msg.role === 'assistant' ? (
                <>
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="font-bold text-neutral-300">Gemini</span>
                  <span className="text-[10px] text-neutral-500">• {msg.timestamp}</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] text-neutral-500">{msg.timestamp} •</span>
                  <span className="font-semibold text-neutral-300">You</span>
                </>
              )}
            </div>

            {/* Bubble Body */}
            <div
              className={`max-w-[88%] rounded-2xl p-3 text-sm shadow-sm relative ${
                msg.role === 'user'
                  ? 'bg-[#282a2c] text-white rounded-tr-sm border border-neutral-700/50'
                  : 'bg-[#1e1f20] text-neutral-100 rounded-tl-sm border border-neutral-800'
              }`}
            >
              {/* Attached Image if present */}
              {msg.image && (
                <div className="mb-2.5 rounded-lg overflow-hidden border border-neutral-700 max-h-48">
                  <img src={msg.image} alt="Uploaded attachment" className="w-full h-auto object-cover" />
                </div>
              )}

              {/* Text content */}
              {renderMarkdown(msg.text)}

              {/* Gemini Assistant Actions Bar (Copy, Feedback, Audio Listen) */}
              {msg.role === 'assistant' && (
                <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-neutral-400 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      title="Copy response"
                      className="p-1 hover:text-white transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => speakText(msg.text)}
                      title="Read aloud"
                      className="p-1 hover:text-white transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-neutral-400 hover:text-blue-400" />
                    </button>

                    <button
                      onClick={() => {
                        playBiometricTickSound();
                        setFeedbackGiven((prev) => ({ ...prev, [msg.id]: 'up' }));
                      }}
                      title="Helpful"
                      className={`p-1 transition-colors ${
                        feedbackGiven[msg.id] === 'up' ? 'text-blue-400' : 'hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        playBiometricTickSound();
                        setFeedbackGiven((prev) => ({ ...prev, [msg.id]: 'down' }));
                      }}
                      title="Not helpful"
                      className={`p-1 transition-colors ${
                        feedbackGiven[msg.id] === 'down' ? 'text-red-400' : 'hover:text-white'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[10px] text-neutral-500 font-mono">
                    {msg.modelUsed || activeModel}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator with glowing star pulsate */}
        {isLoading && (
          <div className="flex items-start gap-2 animate-fade-in pl-1">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center animate-spin">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="bg-[#1e1f20] border border-neutral-800 rounded-2xl p-3 text-xs text-neutral-400 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[11px] font-medium text-neutral-300">Gemini is thinking...</span>
            </div>
          </div>
        )}

        {/* Suggestion Chips when only welcome message is visible */}
        {messages.length <= 1 && (
          <div className="pt-2 space-y-2">
            <p className="text-[11px] font-semibold text-neutral-400 px-1">Try asking Gemini:</p>
            <div className="grid grid-cols-1 gap-1.5">
              {PRESET_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSendMessage(item.query);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-[#1e1f20] hover:bg-[#282a2c] border border-neutral-800 text-xs text-neutral-200 transition-all flex items-center justify-between group"
                >
                  <span className="font-medium group-hover:text-blue-300 transition-colors">
                    {item.label}
                  </span>
                  <ArrowUp className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 group-hover:-translate-y-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Selected Image Preview Floating Tray */}
      {selectedImage && (
        <div className="px-3 pb-1 flex items-center gap-2 animate-fade-in">
          <div className="relative rounded-lg overflow-hidden border border-blue-500/50 w-16 h-16 bg-neutral-900">
            <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-1 right-1 bg-black/70 hover:bg-black p-0.5 rounded-full text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <span className="text-xs text-blue-400 font-medium">Image attached for vision analysis</span>
        </div>
      )}

      {/* Bottom Input Field & Toolbar */}
      <div className="p-3 bg-[#131314] border-t border-neutral-800/80 flex-shrink-0 z-20">
        <div className="relative bg-[#1e1f20] border border-neutral-700/60 rounded-2xl p-2 flex flex-col gap-2 focus-within:border-blue-500/80 transition-colors shadow-lg">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={isListening ? 'Listening...' : 'Ask Gemini anything...'}
            rows={2}
            className="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none resize-none px-1 py-0.5"
          />

          <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
            {/* Attachment Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playBiometricTickSound();
                  fileInputRef.current?.click();
                }}
                title="Attach photo for analysis"
                className="p-1.5 text-neutral-400 hover:text-blue-400 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                onClick={toggleListening}
                title="Voice input"
                className={`p-1.5 rounded-lg transition-colors ${
                  isListening
                    ? 'text-red-400 bg-red-500/20 animate-pulse'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Sample Quick Images preset */}
              <button
                onClick={() => {
                  playBiometricTickSound();
                  // Preload a sample diagram
                  const sampleSvg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%2323272e"/><circle cx="150" cy="100" r="40" fill="%2361afef"/><text x="150" y="105" fill="white" font-size="14" text-anchor="middle">Neural Node</text></svg>';
                  setSelectedImage(sampleSvg);
                  setImageMimeType('image/svg+xml');
                  setInputPrompt('Explain this neural network node architecture diagram');
                }}
                className="text-[10px] text-neutral-400 hover:text-neutral-200 bg-neutral-800/80 px-2 py-1 rounded-md font-medium"
              >
                + Sample diagram
              </button>
            </div>

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={(!inputPrompt.trim() && !selectedImage) || isLoading}
              className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                inputPrompt.trim() || selectedImage
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/30 active:scale-95'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        <div className="text-center mt-1.5">
          <p className="text-[10px] text-neutral-500">
            Gemini may display inaccurate info, so double-check its responses.
          </p>
        </div>
      </div>

      {/* Drawer / History Sidebar Modal */}
      {isSidebarOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div className="w-4/5 h-full bg-[#18191a] border-r border-neutral-800 p-3.5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-extrabold text-sm text-white">Gemini Chats</span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Start New Chat Button */}
              <button
                onClick={() => {
                  playBiometricTickSound();
                  setMessages([
                    {
                      id: `welcome-${Date.now()}`,
                      role: 'assistant',
                      text: "How can I help you today?",
                      timestamp: 'Just now',
                      modelUsed: activeModel
                    }
                  ]);
                  setIsSidebarOpen(false);
                }}
                className="w-full mt-3 py-2 px-3 bg-[#282a2c] hover:bg-[#323438] text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-white/10 transition-colors"
              >
                <Plus className="w-4 h-4 text-blue-400" />
                <span>New Conversation</span>
              </button>

              {/* Recent Saved Chats */}
              <div className="mt-4">
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                  Recent Activity
                </span>
                <div className="mt-2 space-y-1">
                  {SAMPLE_CHATS.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => {
                        playBiometricTickSound();
                        setMessages([
                          {
                            id: `user-${chat.id}`,
                            role: 'user',
                            text: chat.title,
                            timestamp: chat.date
                          },
                          {
                            id: `reply-${chat.id}`,
                            role: 'assistant',
                            text: chat.preview,
                            timestamp: chat.date,
                            modelUsed: activeModel
                          }
                        ]);
                        setIsSidebarOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-[#282a2c] text-xs text-neutral-300 transition-colors flex items-center gap-2 group"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 flex-shrink-0" />
                      <div className="truncate">
                        <p className="font-medium truncate">{chat.title}</p>
                        <p className="text-[10px] text-neutral-500 truncate">{chat.date}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile & Account Info at Drawer Footer */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4285F4] via-[#9B51E0] to-[#EA4335] flex items-center justify-center font-bold text-xs text-white shadow-inner">
                  AD
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Alex Doe</p>
                  <p className="text-[10px] text-blue-400 font-semibold">Gemini Advanced</p>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop click to close */}
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="flex-1 bg-black/60 backdrop-blur-xs"
          />
        </div>
      )}
    </div>
  );
};
