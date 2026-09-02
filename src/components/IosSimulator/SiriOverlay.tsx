import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, X, Sparkles, Volume2, Command, CheckCircle2 } from 'lucide-react';
import { SimulatorState, IosAppId } from '../../types';
import { playSiriChimeSound, playSiriDismissSound } from '../../utils/audioUtils';

interface SiriOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  state: SimulatorState;
  onUpdateState: (updater: (s: SimulatorState) => SimulatorState) => void;
  openApp: (appId: IosAppId) => void;
}

interface Message {
  sender: 'user' | 'siri';
  text: string;
  timestamp: string;
}

export const SiriOverlay: React.FC<SiriOverlayProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateState,
  openApp
}) => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'siri',
      text: "What can I help you with?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      playSiriChimeSound();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      playSiriDismissSound();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleExecuteAction = (action: any) => {
    if (!action) return;
    if (action.type === 'open_app') {
      openApp(action.app);
    } else if (action.type === 'toggle_flashlight') {
      onUpdateState((s) => ({ ...s, isFlashlightOn: action.value ?? !s.isFlashlightOn }));
    } else if (action.type === 'toggle_dark_mode') {
      onUpdateState((s) => ({ ...s, isDarkMode: action.value ?? !s.isDarkMode }));
    } else if (action.type === 'toggle_low_power_mode') {
      onUpdateState((s) => ({ ...s, isLowPowerMode: action.value ?? !s.isLowPowerMode }));
    } else if (action.type === 'toggle_dnd') {
      onUpdateState((s) => ({ ...s, isDoNotDisturb: action.value ?? !s.isDoNotDisturb }));
    } else if (action.type === 'set_volume') {
      onUpdateState((s) => ({ ...s, volume: Math.max(0, Math.min(100, action.value)) }));
    } else if (action.type === 'set_brightness') {
      onUpdateState((s) => ({ ...s, brightness: Math.max(10, Math.min(100, action.value)) }));
    } else if (action.type === 'lock_screen') {
      onUpdateState((s) => ({ ...s, isLocked: true }));
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : prompt).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/siri/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          simulatorContext: {
            currentApp: state.currentApp,
            volume: state.volume,
            isFlashlightOn: state.isFlashlightOn,
            isDarkMode: state.isDarkMode,
            isDoNotDisturb: state.isDoNotDisturb,
            battery: state.batteryLevel
          }
        })
      });

      const data = await res.json();
      const siriReply = data.response || "Done.";

      setMessages((prev) => [
        ...prev,
        {
          sender: 'siri',
          text: siriReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      if (data.action) {
        handleExecuteAction(data.action);
      }

      // Optional TTS speech synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(siriReply);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'siri',
          text: "Sorry, I encountered a connection issue.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can type your request below.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSend(transcript);
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

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xl flex flex-col justify-between text-white animate-fade-in select-none">
      {/* Top Header Glow & Close */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Siri & Apple Intelligence</h3>
            <p className="text-[10px] text-neutral-400">Real-time AI Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-neutral-300" />
        </button>
      </div>

      {/* Glowing Siri Sphere Centerpiece */}
      <div className="flex flex-col items-center justify-center py-6 px-4">
        <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl opacity-70 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl flex items-center justify-center border border-white/30">
            <Sparkles className={`w-8 h-8 text-white ${isLoading || isListening ? 'animate-spin' : 'animate-bounce'}`} />
          </div>
        </div>
        <p className="text-xs font-medium text-neutral-300">
          {isListening ? 'Listening...' : isLoading ? 'Thinking...' : 'How can I help you?'}
        </p>
      </div>

      {/* Messages History */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 max-h-[300px] scrollbar-none">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-neutral-800/90 border border-white/10 text-neutral-100 rounded-bl-sm backdrop-blur-md'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[9px] text-neutral-500 mt-0.5 px-1">{msg.timestamp}</span>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 bg-neutral-800/80 px-3.5 py-2.5 rounded-2xl rounded-bl-sm w-fit text-xs text-neutral-400 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce delay-100" />
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce delay-200" />
            <span>Siri is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-4 py-2 flex gap-1.5 overflow-x-auto scrollbar-none">
        {[
          "Open Camera",
          "Turn on Flashlight",
          "Set volume to 80%",
          "Open Weather",
          "What time is it?"
        ].map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(suggestion)}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-medium text-neutral-200 transition-colors border border-white/10 cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Bottom Input & Voice Trigger */}
      <div className="p-4 bg-black/60 border-t border-white/10 flex items-center gap-2">
        <button
          onClick={startVoiceDictation}
          className={`p-2.5 rounded-full transition-colors cursor-pointer ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-white/10 hover:bg-white/20 text-neutral-200'
          }`}
          title="Speak to Siri"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Siri or type a command..."
          className="flex-1 bg-neutral-900 border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
        />

        <button
          onClick={() => handleSend()}
          disabled={!prompt.trim() || isLoading}
          className="p-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white transition-opacity cursor-pointer shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
