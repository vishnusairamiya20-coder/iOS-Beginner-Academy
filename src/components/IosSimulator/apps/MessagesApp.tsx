import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Image as ImageIcon,
  Mic,
  ChevronLeft,
  Heart,
  ThumbsUp,
  Smile,
  Phone,
  Video,
  Plus,
  Mail,
  Check,
  Search,
  Camera,
  Play,
  Square,
  Sparkles
} from 'lucide-react';
import { SimulatorState } from '../../../types';
import { playMessageSentSound, playMessageReceivedSound } from '../../../utils/audioUtils';

interface MessagesAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onClose: () => void;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'contact';
  text: string;
  isIMessage: boolean;
  time: string;
  reaction?: string;
  photoUrl?: string;
  voiceNoteDuration?: number;
}

interface Thread {
  id: string;
  name: string;
  avatarColor: string;
  isGmail: boolean;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: MessageItem[];
}

const INITIAL_THREADS: Thread[] = [
  {
    id: 't1',
    name: 'Sarah (iOS Guide)',
    avatarColor: 'from-purple-500 to-pink-500',
    isGmail: false,
    lastMessage: 'Let me know if you need help with anything!',
    time: '9:41 AM',
    unreadCount: 1,
    messages: [
      { id: '1', sender: 'contact', text: 'Hey! Welcome to your new iPhone! 🎉', isIMessage: true, time: '9:40 AM' },
      { id: '2', sender: 'user', text: 'Thanks! Notice how this message is in a BLUE bubble?', isIMessage: true, time: '9:41 AM', reaction: '❤️' },
      { id: '3', sender: 'contact', text: 'Yes! Blue means we are using iMessage with high resolution photos and encryption.', isIMessage: true, time: '9:41 AM' },
      { id: '4', sender: 'contact', text: 'Ask me anything about gestures, Safari, camera, or Gmail sync!', isIMessage: true, time: '9:42 AM' }
    ]
  },
  {
    id: 't2',
    name: 'Mom ❤️',
    avatarColor: 'from-pink-500 to-rose-500',
    isGmail: false,
    lastMessage: 'Can you send me a picture of your dinner?',
    time: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm1', sender: 'contact', text: 'Hi sweetie! How is the new phone working?', isIMessage: false, time: 'Yesterday' },
      { id: 'm2', sender: 'user', text: 'It is amazing! Learning all the shortcuts.', isIMessage: false, time: 'Yesterday' },
      { id: 'm3', sender: 'contact', text: 'Can you send me a picture of your dinner?', isIMessage: false, time: 'Yesterday' }
    ]
  },
  {
    id: 't3',
    name: 'Google Workspace & Gmail Alert',
    avatarColor: 'from-red-500 to-amber-500',
    isGmail: true,
    lastMessage: 'Security Alert: Your Gmail account is connected to iOS Simulator.',
    time: '9:30 AM',
    unreadCount: 1,
    messages: [
      { id: 'g1', sender: 'contact', text: 'Security notice: vishnusairamiya20@gmail.com is synced in real-time.', isIMessage: true, time: '9:30 AM' },
      { id: 'g2', sender: 'contact', text: 'Google Mail & Chat are live. You can reply directly here!', isIMessage: true, time: '9:31 AM' }
    ]
  },
  {
    id: 't4',
    name: 'Alex (Work - Google)',
    avatarColor: 'from-blue-500 to-indigo-600',
    isGmail: true,
    lastMessage: 'Sent the updated slide deck to your Gmail.',
    time: 'Aug 29',
    unreadCount: 0,
    messages: [
      { id: 'a1', sender: 'contact', text: 'Hey, sent the updated slide deck to your Gmail inbox.', isIMessage: true, time: 'Aug 29' },
      { id: 'a2', sender: 'user', text: 'Got it, reviewing now!', isIMessage: true, time: 'Aug 29' }
    ]
  }
];

export const MessagesApp: React.FC<MessagesAppProps> = ({ state, onUpdateState }) => {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>('t1');
  const [inputVal, setInputVal] = useState('');
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [filterMode, setFilterMode] = useState<'all' | 'imessage' | 'gmail'>('all');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const audioIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages, isTyping]);

  const handleSendMessage = (text?: string, photoUrl?: string, voiceSeconds?: number) => {
    const content = text || inputVal.trim();
    if (!content && !photoUrl && !voiceSeconds) return;
    if (!activeThreadId) return;

    playMessageSentSound();

    const newMsg: MessageItem = {
      id: Date.now().toString(),
      sender: 'user',
      text: content,
      photoUrl,
      voiceNoteDuration: voiceSeconds,
      isIMessage: activeThread?.isGmail ? true : activeThreadId === 't1',
      time: 'Just now'
    };

    setThreads((prev) =>
      prev.map((th) =>
        th.id === activeThreadId
          ? {
              ...th,
              lastMessage: content || (photoUrl ? '📷 Photo' : '🎤 Voice message'),
              time: 'Just now',
              messages: [...th.messages, newMsg]
            }
          : th
      )
    );

    setInputVal('');
    setShowPhotoPicker(false);

    // Simulate AI smart response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      playMessageReceivedSound();

      let replyText = 'Got it! Thanks for texting me.';
      const lower = content.toLowerCase();

      if (activeThread?.isGmail) {
        replyText = `[Gmail Real-Time Sync]: Message received and logged to ${state.gmailSync.email}.`;
      } else if (lower.includes('photo') || lower.includes('picture') || photoUrl) {
        replyText = 'What a great photo! It is automatically backed up to your Google account.';
      } else if (lower.includes('call') || lower.includes('phone')) {
        replyText = 'You can tap the Phone icon at the top right to start a live call with keypad DTMF tones!';
      } else if (lower.includes('safari') || lower.includes('search')) {
        replyText = 'Safari has full web search powered by Google & Wikipedia. Try opening Safari from the home dock!';
      } else if (lower.includes('setting') || lower.includes('apple id')) {
        replyText = 'In Settings, you can view your Apple ID, iCloud storage bars, subscriptions, and Wi-Fi networks!';
      } else {
        const smartReplies = [
          'Everything is synced and running fast!',
          'Love the smooth animations on this iOS build.',
          'Try using the Volume and Action buttons on the side of the iPhone!',
          'Feel free to test taking photos with the real camera next!'
        ];
        replyText = smartReplies[Math.floor(Math.random() * smartReplies.length)];
      }

      const botMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'contact',
        text: replyText,
        isIMessage: true,
        time: 'Just now'
      };

      setThreads((prev) =>
        prev.map((th) =>
          th.id === activeThreadId
            ? {
                ...th,
                lastMessage: replyText,
                time: 'Just now',
                messages: [...th.messages, botMsg]
              }
            : th
        )
      );
    }, 1600);
  };

  const handleStartVoiceRecord = () => {
    setIsRecordingAudio(true);
    setAudioDuration(1);
    audioIntervalRef.current = setInterval(() => {
      setAudioDuration((d) => d + 1);
    }, 1000);
  };

  const handleStopVoiceRecord = () => {
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    setIsRecordingAudio(false);
    if (audioDuration > 0) {
      handleSendMessage(`Voice Memo (${audioDuration}s)`, undefined, audioDuration);
    }
    setAudioDuration(0);
  };

  const addReaction = (msgId: string, emoji: string) => {
    if (!activeThreadId) return;
    setThreads((prev) =>
      prev.map((th) =>
        th.id === activeThreadId
          ? {
              ...th,
              messages: th.messages.map((m) =>
                m.id === msgId ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m
              )
            }
          : th
      )
    );
    setSelectedMsgId(null);
  };

  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} select-none text-xs font-sans relative`}>
      {/* THREAD LIST VIEW */}
      {!activeThreadId ? (
        <div className="h-full flex flex-col pt-14 pb-2 px-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Messages</h1>
            <button
              onClick={() => {
                const newT: Thread = {
                  id: Date.now().toString(),
                  name: 'New Message',
                  avatarColor: 'from-emerald-500 to-teal-600',
                  isGmail: false,
                  lastMessage: 'Start a conversation...',
                  time: 'Just now',
                  unreadCount: 0,
                  messages: []
                };
                setThreads([newT, ...threads]);
                setActiveThreadId(newT.id);
              }}
              className="p-1 text-blue-500 font-bold"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 text-[11px] font-semibold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-full ${filterMode === 'all' ? 'bg-blue-500 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'}`}
            >
              All Messages
            </button>
            <button
              onClick={() => setFilterMode('imessage')}
              className={`px-3 py-1 rounded-full ${filterMode === 'imessage' ? 'bg-blue-500 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'}`}
            >
              iMessage
            </button>
            <button
              onClick={() => setFilterMode('gmail')}
              className={`px-3 py-1 rounded-full flex items-center gap-1 ${filterMode === 'gmail' ? 'bg-rose-500 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'}`}
            >
              <Mail className="w-3 h-3" />
              <span>Gmail Chat</span>
            </button>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-200 dark:divide-neutral-800">
            {threads
              .filter((t) => (filterMode === 'gmail' ? t.isGmail : filterMode === 'imessage' ? !t.isGmail : true))
              .map((th) => (
                <div
                  key={th.id}
                  onClick={() => setActiveThreadId(th.id)}
                  className="py-3 flex items-center gap-3 hover:opacity-80 cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${th.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-xs relative`}>
                    {th.name[0]}
                    {th.isGmail && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-[8px] flex items-center justify-center text-white border border-white">
                        G
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs truncate">{th.name}</p>
                      <span className="text-[10px] text-neutral-400">{th.time}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">{th.lastMessage}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        /* ACTIVE CONVERSATION VIEW */
        <div className="h-full flex flex-col justify-between">
          {/* Top Chat Header */}
          <div className={`pt-12 pb-2 px-3 border-b flex items-center justify-between ${
            state.isDarkMode ? 'border-neutral-800 bg-neutral-900/90' : 'border-neutral-200 bg-neutral-50/90'
          } backdrop-blur`}>
            <button
              onClick={() => setActiveThreadId(null)}
              className="flex items-center gap-0.5 text-blue-500 font-semibold cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${activeThread?.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-xs`}>
                {activeThread?.name[0]}
              </div>
              <span className="font-semibold text-xs mt-0.5 truncate max-w-[120px]">{activeThread?.name}</span>
            </div>

            <div className="flex items-center gap-3 text-blue-500">
              <button
                onClick={() => onUpdateState((s) => ({ ...s, currentApp: 'phone' }))}
                title="Start Voice Call"
                className="cursor-pointer"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdateState((s) => ({ ...s, currentApp: 'phone' }))}
                title="Start FaceTime Video"
                className="cursor-pointer"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {activeThread?.messages.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMsgId(selectedMsgId === m.id ? null : m.id)}
                className={`flex flex-col relative ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Reaction Tapback Picker */}
                {selectedMsgId === m.id && (
                  <div className="mb-1 flex items-center gap-1.5 p-1.5 rounded-full bg-neutral-800/95 text-white shadow-2xl border border-neutral-700 animate-fade-in z-30">
                    {['❤️', '👍', '👎', '😆', '‼️', '❓'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={(e) => {
                          e.stopPropagation();
                          addReaction(m.id, emoji);
                        }}
                        className="w-7 h-7 hover:scale-125 transition-transform flex items-center justify-center text-sm cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-xs relative ${
                    m.sender === 'user'
                      ? m.isIMessage
                        ? 'bg-blue-500 text-white rounded-br-xs'
                        : 'bg-green-500 text-white rounded-br-xs'
                      : state.isDarkMode
                      ? 'bg-neutral-800 text-white rounded-bl-xs'
                      : 'bg-neutral-200 text-black rounded-bl-xs'
                  }`}
                >
                  {/* Attached photo thumbnail */}
                  {m.photoUrl && (
                    <img src={m.photoUrl} alt="Attached" className="rounded-xl mb-1.5 max-h-40 object-cover" />
                  )}

                  {/* Attached voice memo */}
                  {m.voiceNoteDuration && (
                    <div className="flex items-center gap-2 py-1 font-mono text-[11px]">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Voice Note 0:{m.voiceNoteDuration < 10 ? `0${m.voiceNoteDuration}` : m.voiceNoteDuration}</span>
                    </div>
                  )}

                  <p className="leading-relaxed">{m.text}</p>

                  {/* Reaction icon badge */}
                  {m.reaction && (
                    <span className="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded-full bg-white text-black shadow-md text-[10px] border border-neutral-200">
                      {m.reaction}
                    </span>
                  )}
                </div>

                <span className="text-[9px] text-neutral-400 mt-0.5 px-1">{m.time}</span>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-neutral-200 dark:bg-neutral-800 w-16 text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Photo Picker Drawer */}
          {showPhotoPicker && (
            <div className="p-2 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between px-1">
                <span className="font-bold text-[10px] uppercase text-neutral-400">Attach from Photos / Camera</span>
                <button onClick={() => setShowPhotoPicker(false)} className="text-xs text-neutral-400">✕</button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {state.userPhotos.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSendMessage(undefined, p.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200')}
                    className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-neutral-300 dark:border-neutral-700 cursor-pointer hover:scale-105 transition-transform"
                  >
                    {p.url ? (
                      <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-xl">
                        {p.emoji || '🌸'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className={`p-2 px-3 border-t flex items-center gap-2 ${
            state.isDarkMode ? 'border-neutral-800 bg-black' : 'border-neutral-200 bg-white'
          }`}>
            <button
              onClick={() => setShowPhotoPicker(!showPhotoPicker)}
              className="p-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-400 hover:text-blue-500 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>

            {isRecordingAudio ? (
              <div className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-full bg-red-600/20 text-red-500 font-mono text-xs">
                <span className="flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Recording voice note... {audioDuration}s
                </span>
                <button
                  onClick={handleStopVoiceRecord}
                  className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px]"
                >
                  Send
                </button>
              </div>
            ) : (
              <div className={`flex-1 flex items-center rounded-full px-3 py-1.5 border ${
                state.isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-100 border-neutral-300 text-black'
              }`}>
                <input
                  type="text"
                  placeholder={activeThread?.isGmail ? 'Gmail / iMessage...' : 'iMessage...'}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="bg-transparent text-xs w-full outline-none"
                />
                <button
                  onClick={handleStartVoiceRecord}
                  className="text-neutral-400 hover:text-neutral-200 ml-1 cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputVal.trim()}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                inputVal.trim()
                  ? activeThread?.isGmail
                    ? 'bg-rose-500 text-white'
                    : 'bg-blue-500 text-white'
                  : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
