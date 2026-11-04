import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Send,
  X,
  Sparkles,
  Volume2,
  Command,
  CheckCircle2,
  Zap,
  Timer,
  Compass,
  ShoppingBag,
  Music,
  Sun,
  Shield,
  Smartphone
} from 'lucide-react';
import { SimulatorState, IosAppId } from '../../types';
import {
  playSiriChimeSound,
  playSiriDismissSound,
  startMusicSynthesis,
  stopMusicSynthesis,
  playLockSound,
  playBiometricTickSound
} from '../../utils/audioUtils';

interface SiriOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  state: SimulatorState;
  onUpdateState: (updater: (s: SimulatorState) => SimulatorState) => void;
  openApp: (appId: IosAppId) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'siri';
  text: string;
  timestamp: string;
  actionCard?: {
    title: string;
    description: string;
    icon: string;
  };
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
      id: 'm-init',
      sender: 'siri',
      text: "I'm right here. How can I help you?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      playSiriChimeSound();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      playSiriDismissSound();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.02;
        // Prefer natural sounding English voices if available
        const voices = window.speechSynthesis.getVoices();
        const siriVoice = voices.find(v => (v.name.includes('Siri') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Natural')) && v.lang.startsWith('en'));
        if (siriVoice) utterance.voice = siriVoice;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }
  };

  const handleExecuteAction = (action: any): { title: string; description: string; icon: string } | undefined => {
    if (!action) return;

    if (action.type === 'open_app') {
      const targetApp = action.app as IosAppId;
      setTimeout(() => {
        openApp(targetApp);
        onClose();
      }, 1000);
      return {
        title: `Opening ${targetApp.toUpperCase()}`,
        description: `Switching to ${targetApp} app on your iPhone.`,
        icon: '📱'
      };
    }

    if (action.type === 'search_safari') {
      setTimeout(() => {
        openApp('safari');
        onClose();
      }, 1000);
      return {
        title: `Safari Web Search`,
        description: `Looking up "${action.query}" on Safari.`,
        icon: '🧭'
      };
    }

    if (action.type === 'toggle_flashlight') {
      const nextVal = action.value ?? !state.isFlashlightOn;
      onUpdateState((s) => ({ ...s, isFlashlightOn: nextVal }));
      return {
        title: `Flashlight ${nextVal ? 'ON' : 'OFF'}`,
        description: `Camera LED torch is now ${nextVal ? 'illuminated' : 'switched off'}.`,
        icon: '🔦'
      };
    }

    if (action.type === 'toggle_dark_mode') {
      const nextVal = action.value ?? !state.isDarkMode;
      onUpdateState((s) => ({ ...s, isDarkMode: nextVal }));
      return {
        title: `${nextVal ? 'Dark' : 'Light'} Appearance`,
        description: `System interface switched to ${nextVal ? 'Dark Mode' : 'Light Mode'}.`,
        icon: '🌓'
      };
    }

    if (action.type === 'toggle_low_power_mode') {
      const nextVal = action.value ?? !state.isLowPowerMode;
      onUpdateState((s) => ({ ...s, isLowPowerMode: nextVal }));
      return {
        title: `Low Power Mode ${nextVal ? 'Enabled' : 'Disabled'}`,
        description: nextVal ? 'Battery conservation active (Yellow indicator).' : 'Full performance restored.',
        icon: '🔋'
      };
    }

    if (action.type === 'toggle_dnd') {
      const nextVal = action.value ?? !state.isDoNotDisturb;
      onUpdateState((s) => ({ ...s, isDoNotDisturb: nextVal }));
      return {
        title: `Do Not Disturb ${nextVal ? 'ON' : 'OFF'}`,
        description: nextVal ? 'Silencing incoming banners and rings.' : 'Normal notifications restored.',
        icon: '🌙'
      };
    }

    if (action.type === 'set_volume') {
      const val = Math.max(0, Math.min(100, action.value));
      onUpdateState((s) => ({ ...s, volume: val }));
      return {
        title: `Volume Set to ${val}%`,
        description: val === 0 ? 'Audio is currently muted.' : `Output speaker adjusted to ${val}%.`,
        icon: '🔊'
      };
    }

    if (action.type === 'set_brightness') {
      const val = Math.max(10, Math.min(100, action.value));
      onUpdateState((s) => ({ ...s, brightness: val }));
      return {
        title: `Brightness Set to ${val}%`,
        description: `Display luminescence adjusted to ${val}%.`,
        icon: '☀️'
      };
    }

    if (action.type === 'start_timer') {
      const totalSecs = (action.minutes || 5) * 60;
      onUpdateState((s) => ({
        ...s,
        timerSecondsRemaining: totalSecs,
        isTimerRunning: true,
        dynamicIslandState: 'timer'
      }));
      return {
        title: `Timer Started (${action.minutes || 5} mins)`,
        description: `Countdown visible in Dynamic Island & Clock.`,
        icon: '⏰'
      };
    }

    if (action.type === 'play_music') {
      if (action.value) {
        startMusicSynthesis('pop');
        onUpdateState((s) => ({
          ...s,
          isPlayingMusic: true,
          dynamicIslandState: 'music'
        }));
        return {
          title: 'Playing Music',
          description: `Now playing "${state.currentSong?.title || 'Anti-Hero'}" by Taylor Swift.`,
          icon: '🎵'
        };
      } else {
        stopMusicSynthesis();
        onUpdateState((s) => ({
          ...s,
          isPlayingMusic: false,
          dynamicIslandState: s.isTimerRunning ? 'timer' : 'idle'
        }));
        return {
          title: 'Music Paused',
          description: 'Audio playback stopped.',
          icon: '⏸️'
        };
      }
    }

    if (action.type === 'lock_screen') {
      playLockSound();
      onUpdateState((s) => ({ ...s, isLocked: true }));
      onClose();
      return {
        title: 'iPhone Locked',
        description: 'Screen locked.',
        icon: '🔒'
      };
    }

    return undefined;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : prompt).trim();
    if (!query || isLoading) return;

    playBiometricTickSound();

    const userMsg: Message = {
      id: `u-${Date.now()}`,
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
            battery: state.batteryLevel,
            isLowPowerMode: state.isLowPowerMode,
            isPlayingMusic: state.isPlayingMusic,
            isTimerRunning: state.isTimerRunning
          }
        })
      });

      const data = await res.json();
      const siriReply = data.response || "I've handled that for you.";
      let actionCard: Message['actionCard'];

      if (data.action) {
        actionCard = handleExecuteAction(data.action);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `s-${Date.now()}`,
          sender: 'siri',
          text: siriReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionCard
        }
      ]);

      speakText(siriReply);
    } catch (err) {
      console.warn('Siri client connection fallback:', err);
      // Local immediate answer if network fails
      const fallbackReply = "I heard you. What else can I assist with?";
      setMessages((prev) => [
        ...prev,
        {
          id: `s-${Date.now()}`,
          sender: 'siri',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      speakText(fallbackReply);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Microphone dictation requires SpeechRecognition. You can tap any chip or type below.');
      setTimeout(() => setVoiceNotice(null), 4000);
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
        setVoiceNotice('Could not capture audio. Please type or tap suggestion chips.');
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('Microphone permission required in this window. Type your request below.');
      setTimeout(() => setVoiceNotice(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-2xl flex flex-col justify-between text-white animate-fade-in select-none overflow-hidden font-sans">
      {/* APPLE INTELLIGENCE PERIMETER GLOW BORDER */}
      <div className="absolute inset-0 pointer-events-none rounded-[48px] border-[3.5px] border-transparent [border-image:linear-gradient(to_bottom_right,#38bdf8,#818cf8,#c084fc,#f472b6,#fb923c)_1] opacity-75 blur-[1px] animate-pulse" />

      {/* Top Header Glow & Close */}
      <div className="flex items-center justify-between p-4 pt-12 border-b border-white/10 bg-black/40 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 p-[1.5px] shadow-lg shadow-purple-500/30">
            <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight flex items-center gap-1.5">
              <span>Siri</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-extrabold uppercase tracking-wider">
                Apple Intelligence
              </span>
            </h3>
            <p className="text-[10px] text-neutral-400">iOS 27 Quantum Assistant</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-neutral-300" />
        </button>
      </div>

      {/* Glowing Siri Sphere Centerpiece */}
      <div className="flex flex-col items-center justify-center py-4 px-4 z-10">
        <div
          onClick={startVoiceDictation}
          className="relative w-20 h-20 mb-2 flex items-center justify-center cursor-pointer group active:scale-95 transition-transform"
          title="Click to dictate"
        >
          {/* Animated gradient wave blooms */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl opacity-60 animate-pulse" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl flex items-center justify-center border border-white/30 group-hover:scale-105 transition-transform">
            <Sparkles className={`w-7 h-7 text-white ${isLoading || isListening ? 'animate-spin' : ''}`} />
          </div>
        </div>

        <p className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1.5">
          {isListening ? (
            <span className="text-rose-400 animate-pulse">● Listening to your voice...</span>
          ) : isLoading ? (
            <span className="text-purple-300 animate-pulse">Thinking & executing...</span>
          ) : (
            <span>Tap sphere to speak or type below</span>
          )}
        </p>

        {voiceNotice && (
          <div className="mt-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-200 animate-fade-in text-center max-w-[280px]">
            {voiceNotice}
          </div>
        )}
      </div>

      {/* Messages Conversation History */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 scrollbar-none z-10 max-h-[220px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs'
                  : 'bg-neutral-850/90 border border-white/15 text-neutral-100 rounded-bl-xs backdrop-blur-md'
              }`}
            >
              {msg.text}
            </div>

            {/* Interactive Action Card Confirmation */}
            {msg.actionCard && (
              <div className="mt-1.5 p-2 px-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-[11px] flex items-center gap-2 max-w-[85%] animate-fade-in shadow-xs">
                <span className="text-base">{msg.actionCard.icon}</span>
                <div className="min-w-0">
                  <p className="font-bold text-purple-200">{msg.actionCard.title}</p>
                  <p className="text-[10px] text-neutral-300 truncate">{msg.actionCard.description}</p>
                </div>
              </div>
            )}

            <span className="text-[9px] text-neutral-500 mt-0.5 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 bg-neutral-800/80 px-3.5 py-2 rounded-2xl rounded-bl-xs w-fit text-xs text-neutral-400 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce delay-100" />
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce delay-200" />
            <span>Siri is processing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-none z-10 border-t border-white/5">
        {[
          "⚡ Open Blinkit",
          "🧭 Open Safari",
          "🔦 Turn on Flashlight",
          "⏰ Set 5 min timer",
          "🎵 Play music",
          "☀️ What's the weather?",
          "🔋 Battery status",
          "🤣 Tell me a joke"
        ].map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(suggestion.replace(/^[^\w]+/, ''))}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-[10.5px] font-medium text-neutral-200 transition-all border border-white/10 cursor-pointer shadow-xs"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Bottom Input & Voice Trigger */}
      <div className="p-3 bg-black/80 border-t border-white/10 flex items-center gap-2 z-10">
        <button
          onClick={startVoiceDictation}
          className={`p-2.5 rounded-full transition-all cursor-pointer ${
            isListening
              ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-400'
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
          className="flex-1 bg-neutral-900 border border-white/20 rounded-full px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 shadow-inner"
        />

        <button
          onClick={() => handleSend()}
          disabled={!prompt.trim() || isLoading}
          className="p-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-40 text-white transition-opacity cursor-pointer shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
