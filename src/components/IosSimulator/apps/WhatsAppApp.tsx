import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Camera,
  Edit3,
  Phone,
  Video,
  Plus,
  Mic,
  Send,
  ChevronLeft,
  MoreVertical,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  Play,
  Pause,
  Clock,
  Settings as SettingsIcon,
  Users,
  CircleDot,
  MessageSquare,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Image as ImageIcon,
  BarChart2,
  FileText,
  MapPin,
  User,
  Shield,
  Key,
  Bell,
  HardDrive,
  HelpCircle,
  Heart,
  Sparkles,
  QrCode,
  Laptop,
  Lock,
  X,
  Share2,
  Volume2,
  VolumeX,
  MicOff,
  VideoOff,
  Trash2,
  Star,
  Archive,
  Filter
} from 'lucide-react';
import { SimulatorState, IosAppId } from '../../../types';
import {
  playMessageSentSound,
  playMessageReceivedSound,
  playVolumeStepSound,
  playDtmfTone
} from '../../../utils/audioUtils';

interface WhatsAppAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onOpenApp?: (app: IosAppId) => void;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  text?: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'voice' | 'image' | 'poll';
  imageUrl?: string;
  voiceDuration?: number; // in seconds
  isPlaying?: boolean;
  poll?: {
    question: string;
    options: { text: string; votes: number; userVoted?: boolean }[];
  };
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  isGroup?: boolean;
  online?: boolean;
  lastSeen?: string;
  typing?: boolean;
  unreadCount?: number;
  messages: Message[];
  statusStory?: {
    mediaUrl: string;
    caption: string;
    time: string;
  };
}

interface CallLog {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  type: 'incoming' | 'outgoing' | 'missed';
  isVideo?: boolean;
  time: string;
  duration?: string;
}

interface Community {
  id: string;
  name: string;
  avatar: string;
  desc: string;
  memberCount: number;
  groups: string[];
}

export const WhatsAppApp: React.FC<WhatsAppAppProps> = ({
  state,
  onUpdateState,
  onOpenApp,
  onClose
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'chats' | 'updates' | 'communities' | 'calls' | 'settings'>('chats');
  
  // Active Chat State
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'favorites' | 'groups'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordSeconds, setVoiceRecordSeconds] = useState(0);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');

  // Status Story Viewer
  const [viewingStoryContact, setViewingStoryContact] = useState<ChatContact | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);

  // Active Call State
  const [activeCall, setActiveCall] = useState<{
    contact: ChatContact;
    isVideo: boolean;
    status: 'calling' | 'connected' | 'ended';
    duration: number;
    isMuted: boolean;
    isSpeaker: boolean;
    isVideoOff: boolean;
  } | null>(null);

  // New Chat Modal
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Settings Subpage
  const [settingsSubpage, setSettingsSubpage] = useState<string | null>(null);
  const [aboutText, setAboutText] = useState('Hey there! I am using WhatsApp ⚡');
  const [readReceipts, setReadReceipts] = useState(true);

  // Voice note timer ref
  const voiceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Sample Chat Data
  const [chats, setChats] = useState<ChatContact[]>([
    {
      id: 'c1',
      name: 'Sarah (Design Lead)',
      avatar: '👩‍💼',
      avatarBg: 'bg-gradient-to-tr from-purple-500 to-indigo-600',
      online: true,
      lastSeen: 'online',
      unreadCount: 2,
      statusStory: {
        mediaUrl: '/f1_car_wallpaper.jpg',
        caption: 'Working on next-gen UI design sprint! 🎨',
        time: '45m ago'
      },
      messages: [
        {
          id: 'm1',
          sender: 'them',
          text: 'Hey Vishnu! Did you check the new iOS 18 simulator?',
          time: '10:14 AM',
          status: 'read'
        },
        {
          id: 'm2',
          sender: 'me',
          text: 'Yes! The animations and Dynamic Island are working smoothly.',
          time: '10:15 AM',
          status: 'read'
        },
        {
          id: 'm3',
          sender: 'them',
          text: 'Awesome! WhatsApp installation is ready too. Everything is interactive!',
          time: '10:16 AM',
          status: 'read'
        },
        {
          id: 'm4',
          sender: 'them',
          type: 'poll',
          time: '10:18 AM',
          status: 'read',
          poll: {
            question: 'Which wallpaper looks best on the simulator?',
            options: [
              { text: '🌋 Doomsday Apocalypse', votes: 4, userVoted: true },
              { text: '🏎️ Formula 1 Racing', votes: 2, userVoted: false },
              { text: '🏖️ Tropical Sea Beach', votes: 1, userVoted: false }
            ]
          }
        }
      ]
    },
    {
      id: 'c2',
      name: 'Tech & AI Innovators 🚀',
      avatar: '🤖',
      avatarBg: 'bg-gradient-to-tr from-blue-500 to-cyan-500',
      isGroup: true,
      online: false,
      lastSeen: 'Alex, Rohan, Sarah, Priya...',
      unreadCount: 1,
      messages: [
        {
          id: 'g1',
          sender: 'them',
          text: 'Alex: New multimodal vision update just went live.',
          time: '9:30 AM',
          status: 'read'
        },
        {
          id: 'g2',
          sender: 'me',
          text: 'Testing audio and camera tools right now in the iPhone build!',
          time: '9:45 AM',
          status: 'read'
        },
        {
          id: 'g3',
          sender: 'them',
          text: 'Rohan: WhatsApp in this simulator feels like the real thing.',
          time: '9:50 AM',
          status: 'read'
        }
      ]
    },
    {
      id: 'c3',
      name: 'Family Group 👨‍👩‍👧‍👦',
      avatar: '🏡',
      avatarBg: 'bg-gradient-to-tr from-amber-400 to-rose-500',
      isGroup: true,
      online: false,
      lastSeen: 'Mom, Dad, Sis...',
      unreadCount: 0,
      statusStory: {
        mediaUrl: '/beach_wallpaper.jpg',
        caption: 'Family vacation memories ❤️',
        time: '2h ago'
      },
      messages: [
        {
          id: 'f1',
          sender: 'them',
          text: 'Mom: Remember we have family dinner at 7:00 PM tonight!',
          time: 'Yesterday',
          status: 'read'
        },
        {
          id: 'f2',
          sender: 'me',
          text: 'Will be there on time! Bringing dessert.',
          time: 'Yesterday',
          status: 'read'
        }
      ]
    },
    {
      id: 'c4',
      name: 'Alex Rivera',
      avatar: '👨‍💻',
      avatarBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600',
      online: false,
      lastSeen: 'today at 8:42 AM',
      unreadCount: 0,
      messages: [
        {
          id: 'a1',
          sender: 'them',
          text: 'Shared the GitHub PR with you. Let me know when you review.',
          time: '8:40 AM',
          status: 'read'
        },
        {
          id: 'a2',
          sender: 'me',
          type: 'voice',
          time: '8:41 AM',
          status: 'read',
          voiceDuration: 6
        }
      ]
    },
    {
      id: 'c5',
      name: 'Rohan R. Potdar',
      avatar: '⚡',
      avatarBg: 'bg-gradient-to-tr from-red-500 to-orange-500',
      online: true,
      lastSeen: 'online',
      unreadCount: 0,
      statusStory: {
        mediaUrl: '/doomsday_wallpaper.jpg',
        caption: 'Doomsday wallpaper looks intense! 🌋🔥',
        time: '1h ago'
      },
      messages: [
        {
          id: 'r1',
          sender: 'them',
          text: 'Hey Vishnu! The iOS UI with the Doomsday theme is insane!',
          time: '10:00 AM',
          status: 'read'
        },
        {
          id: 'r2',
          sender: 'me',
          text: 'Thanks Rohan! Just installed WhatsApp so all options work properly.',
          time: '10:02 AM',
          status: 'read'
        }
      ]
    }
  ]);

  // Calls history
  const [callLogs, setCallLogs] = useState<CallLog[]>([
    {
      id: 'cl1',
      name: 'Sarah (Design Lead)',
      avatar: '👩‍💼',
      avatarBg: 'bg-purple-500',
      type: 'incoming',
      isVideo: true,
      time: 'Today, 10:05 AM',
      duration: '4m 12s'
    },
    {
      id: 'cl2',
      name: 'Mom ❤️',
      avatar: '👵',
      avatarBg: 'bg-rose-500',
      type: 'missed',
      isVideo: false,
      time: 'Yesterday, 6:40 PM'
    },
    {
      id: 'cl3',
      name: 'Rohan R. Potdar',
      avatar: '⚡',
      avatarBg: 'bg-orange-500',
      type: 'outgoing',
      isVideo: false,
      time: 'Yesterday, 3:15 PM',
      duration: '1m 45s'
    },
    {
      id: 'cl4',
      name: 'Alex Rivera',
      avatar: '👨‍💻',
      avatarBg: 'bg-emerald-500',
      type: 'incoming',
      isVideo: true,
      time: 'Monday, 11:20 AM',
      duration: '12m 04s'
    }
  ]);

  // Communities
  const [communities] = useState<Community[]>([
    {
      id: 'com1',
      name: 'AI Developers & Builders',
      avatar: '🧠',
      desc: 'Everything about Gemini, full-stack tools, React, and modern tech.',
      memberCount: 1420,
      groups: ['Announcements', 'General Discussion', 'Showcase & Feedback']
    },
    {
      id: 'com2',
      name: 'Apple iOS Creators',
      avatar: '🍏',
      desc: 'Community for designers and developers crafting mobile experiences.',
      memberCount: 890,
      groups: ['Announcements', 'Swift & Web Simulators', 'UI/UX Polish']
    }
  ]);

  // Channels
  const [channels, setChannels] = useState([
    {
      id: 'ch1',
      name: 'WhatsApp',
      verified: true,
      avatar: '💬',
      bg: 'bg-emerald-600',
      followers: '194M followers',
      isFollowing: true,
      latestPost: 'Keep your chats private with Chat Lock and secret codes. Now rolling out globally.'
    },
    {
      id: 'ch2',
      name: 'Formula 1',
      verified: true,
      avatar: '🏎️',
      bg: 'bg-red-600',
      followers: '18.2M followers',
      isFollowing: false,
      latestPost: 'Grand Prix weekend updates, pole position lap telemetry, and paddock behind the scenes!'
    },
    {
      id: 'ch3',
      name: 'National Geographic',
      verified: true,
      avatar: '🌍',
      bg: 'bg-amber-600',
      followers: '24.7M followers',
      isFollowing: true,
      latestPost: 'Rare solar flares captured over polar glaciers in Iceland this morning.'
    }
  ]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId]);

  // Story progress timer
  useEffect(() => {
    if (!viewingStoryContact) {
      setStoryProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setViewingStoryContact(null);
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [viewingStoryContact]);

  // Active call duration counter
  useEffect(() => {
    if (!activeCall || activeCall.status !== 'connected') return;

    const interval = setInterval(() => {
      setActiveCall((prev) => (prev ? { ...prev, duration: prev.duration + 1 } : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCall?.status]);

  // Active chat object
  const currentChat = chats.find((c) => c.id === activeChatId);

  // Send message handler
  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || messageInput.trim();
    if (!content || !activeChatId) return;

    playMessageSentSound();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'me',
      text: content,
      time: timeStr,
      status: 'sent',
      type: 'text'
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            unreadCount: 0,
            messages: [...chat.messages, newMsg]
          };
        }
        return chat;
      })
    );

    setMessageInput('');

    // Simulate double ticks & delivered
    setTimeout(() => {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              messages: chat.messages.map((m) => (m.id === newMsg.id ? { ...m, status: 'delivered' } : m))
            };
          }
          return chat;
        })
      );
    }, 600);

    // Simulate read blue checkmark & automatic smart reply
    setTimeout(() => {
      playMessageReceivedSound();
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === activeChatId) {
            const replies = [
              'Got your message! Loving this WhatsApp update 👌',
              'Sounds great! That is working properly now.',
              'Nice! Can you also test a voice note or call?',
              'Awesome! Let me check that right away. 🔥',
              'Agreed! The iOS experience is super smooth.'
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const replyMsg: Message = {
              id: 'reply-' + Date.now(),
              sender: 'them',
              text: randomReply,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'read',
              type: 'text'
            };

            return {
              ...chat,
              messages: [
                ...chat.messages.map((m) => (m.id === newMsg.id ? { ...m, status: 'read' as const } : m)),
                replyMsg
              ]
            };
          }
          return chat;
        })
      );
    }, 1600);
  };

  // Start voice recording
  const startVoiceRecording = () => {
    playVolumeStepSound();
    setIsRecordingVoice(true);
    setVoiceRecordSeconds(0);
    voiceTimerRef.current = setInterval(() => {
      setVoiceRecordSeconds((s) => s + 1);
    }, 1000);
  };

  // Stop and send voice recording
  const stopAndSendVoiceRecording = () => {
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    setIsRecordingVoice(false);
    playMessageSentSound();

    if (!activeChatId) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const voiceMsg: Message = {
      id: 'voice-' + Date.now(),
      sender: 'me',
      time: timeStr,
      status: 'sent',
      type: 'voice',
      voiceDuration: Math.max(1, voiceRecordSeconds)
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, voiceMsg]
          };
        }
        return chat;
      })
    );

    setVoiceRecordSeconds(0);
  };

  // Send photo from simulator photos
  const handleSendPhoto = (photoUrl: string) => {
    if (!activeChatId) return;
    playMessageSentSound();
    setShowAttachmentMenu(false);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const photoMsg: Message = {
      id: 'photo-' + Date.now(),
      sender: 'me',
      time: timeStr,
      status: 'delivered',
      type: 'image',
      imageUrl: photoUrl
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, photoMsg]
          };
        }
        return chat;
      })
    );
  };

  // Send interactive poll
  const handleCreatePoll = () => {
    if (!pollQuestion.trim() || !pollOption1.trim() || !pollOption2.trim() || !activeChatId) return;
    playMessageSentSound();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const pollMsg: Message = {
      id: 'poll-' + Date.now(),
      sender: 'me',
      time: timeStr,
      status: 'delivered',
      type: 'poll',
      poll: {
        question: pollQuestion.trim(),
        options: [
          { text: pollOption1.trim(), votes: 1, userVoted: true },
          { text: pollOption2.trim(), votes: 0, userVoted: false }
        ]
      }
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, pollMsg]
          };
        }
        return chat;
      })
    );

    setShowPollCreator(false);
    setShowAttachmentMenu(false);
    setPollQuestion('');
    setPollOption1('');
    setPollOption2('');
  };

  // Vote on poll
  const handleVotePoll = (msgId: string, optionIdx: number) => {
    playVolumeStepSound();
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: chat.messages.map((m) => {
              if (m.id === msgId && m.poll) {
                const updatedOptions = m.poll.options.map((opt, idx) => {
                  if (idx === optionIdx) {
                    const willBeVoted = !opt.userVoted;
                    return {
                      ...opt,
                      votes: willBeVoted ? opt.votes + 1 : Math.max(0, opt.votes - 1),
                      userVoted: willBeVoted
                    };
                  }
                  return opt;
                });
                return {
                  ...m,
                  poll: {
                    ...m.poll,
                    options: updatedOptions
                  }
                };
              }
              return m;
            })
          };
        }
        return chat;
      })
    );
  };

  // Play voice note simulation
  const handlePlayVoice = (msgId: string) => {
    playDtmfTone('5', 0.2);
    setChats((prev) =>
      prev.map((chat) => ({
        ...chat,
        messages: chat.messages.map((m) => {
          if (m.id === msgId) {
            return { ...m, isPlaying: !m.isPlaying };
          }
          return { ...m, isPlaying: false };
        })
      }))
    );
  };

  // Start WhatsApp Voice or Video Call
  const handleStartCall = (contact: ChatContact, isVideo = false) => {
    playDtmfTone('1', 0.1);
    setActiveCall({
      contact,
      isVideo,
      status: 'calling',
      duration: 0,
      isMuted: false,
      isSpeaker: true,
      isVideoOff: false
    });

    // Ringing to connected after 2.2s
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'connected' } : null));
    }, 2200);

    // Add to call log
    const newCallLog: CallLog = {
      id: 'call-' + Date.now(),
      name: contact.name,
      avatar: contact.avatar,
      avatarBg: contact.avatarBg,
      type: 'outgoing',
      isVideo,
      time: 'Just now'
    };
    setCallLogs((prev) => [newCallLog, ...prev]);
  };

  // End active call
  const handleEndCall = () => {
    playDtmfTone('0', 0.15);
    setActiveCall((prev) => (prev ? { ...prev, status: 'ended' } : null));
    setTimeout(() => {
      setActiveCall(null);
    }, 600);
  };

  // Toggle follow channel
  const toggleFollowChannel = (channelId: string) => {
    playVolumeStepSound();
    setChannels((prev) =>
      prev.map((ch) => (ch.id === channelId ? { ...ch, isFollowing: !ch.isFollowing } : ch))
    );
  };

  // Filtered Chats
  const filteredChats = chats.filter((c) => {
    if (chatFilter === 'unread' && (!c.unreadCount || c.unreadCount === 0)) return false;
    if (chatFilter === 'groups' && !c.isGroup) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchMsg = c.messages.some((m) => m.text?.toLowerCase().includes(q));
      return matchName || matchMsg;
    }
    return true;
  });

  const isDark = state.isDarkMode;

  return (
    <div
      className={`h-full flex flex-col ${
        isDark ? 'bg-[#121B22] text-[#E9EDEF]' : 'bg-[#F0F2F5] text-[#111B21]'
      } select-none font-sans relative overflow-hidden text-xs`}
    >
      {/* 1. ACTIVE CALL OVERLAY */}
      {activeCall && (
        <div className="absolute inset-0 z-50 bg-[#0b141a] text-white flex flex-col justify-between pt-14 pb-8 px-6 animate-fade-in">
          {/* Top Encrypted Notice */}
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center gap-1.5 text-[11px] text-[#25D366] font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>End-to-end encrypted</span>
            </div>
            <h2 className="text-xl font-bold mt-2">{activeCall.contact.name}</h2>
            <span className="text-xs text-neutral-400">
              {activeCall.status === 'calling'
                ? activeCall.isVideo
                  ? 'WhatsApp Video Calling...'
                  : 'WhatsApp Voice Calling...'
                : activeCall.status === 'connected'
                ? `Connected • ${Math.floor(activeCall.duration / 60)}:${(activeCall.duration % 60)
                    .toString()
                    .padStart(2, '0')}`
                : 'Call Ended'}
            </span>
          </div>

          {/* Center Call Visual */}
          <div className="flex-1 flex flex-col items-center justify-center my-6">
            {activeCall.isVideo ? (
              <div className="w-48 h-64 rounded-3xl bg-neutral-800 border-2 border-emerald-500/50 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-neutral-700 flex items-center justify-center text-4xl shadow-md">
                  {activeCall.contact.avatar}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded-full text-[10px]">
                  {activeCall.isVideoOff ? 'Camera Off' : 'HD Front 1080p'}
                </div>
                {/* Self preview PIP */}
                <div className="absolute top-3 right-3 w-16 h-20 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-lg shadow-lg">
                  👤
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-5xl shadow-2xl animate-pulse">
                  {activeCall.contact.avatar}
                </div>
                <div className="absolute -bottom-2 right-2 w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#0b141a] flex items-center justify-center text-white">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </div>

          {/* Bottom In-Call Controls */}
          <div className="bg-[#1f2c34] rounded-3xl p-4 shadow-2xl space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => setActiveCall((c) => (c ? { ...c, isSpeaker: !c.isSpeaker } : null))}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl ${
                  activeCall.isSpeaker ? 'bg-white text-black' : 'bg-[#2a3942] text-white'
                }`}
              >
                {activeCall.isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                <span className="text-[10px]">Speaker</span>
              </button>

              <button
                onClick={() => setActiveCall((c) => (c ? { ...c, isVideoOff: !c.isVideoOff } : null))}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl ${
                  activeCall.isVideoOff ? 'bg-red-500 text-white' : 'bg-[#2a3942] text-white'
                }`}
              >
                {activeCall.isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                <span className="text-[10px]">Video</span>
              </button>

              <button
                onClick={() => setActiveCall((c) => (c ? { ...c, isMuted: !c.isMuted } : null))}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl ${
                  activeCall.isMuted ? 'bg-red-500 text-white' : 'bg-[#2a3942] text-white'
                }`}
              >
                {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span className="text-[10px]">Mute</span>
              </button>

              <button
                onClick={handleEndCall}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg cursor-pointer"
              >
                <Phone className="w-5 h-5 transform rotate-[135deg]" />
                <span className="text-[10px]">End</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. STATUS STORY VIEWER MODAL */}
      {viewingStoryContact && viewingStoryContact.statusStory && (
        <div className="absolute inset-0 z-50 bg-black text-white flex flex-col justify-between pt-12 pb-6 px-4 animate-fade-in select-none">
          {/* Progress Bar */}
          <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden mb-3">
            <div
              className="bg-white h-full transition-all duration-100 ease-linear"
              style={{ width: `${storyProgress}%` }}
            />
          </div>

          {/* Top Status Author */}
          <div className="flex items-center justify-between z-20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-lg border-2 border-emerald-400">
                {viewingStoryContact.avatar}
              </div>
              <div>
                <p className="font-bold text-xs">{viewingStoryContact.name}</p>
                <p className="text-[10px] text-white/70">{viewingStoryContact.statusStory.time}</p>
              </div>
            </div>
            <button
              onClick={() => setViewingStoryContact(null)}
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Story Background / Media */}
          <div className="absolute inset-0 z-0">
            <img
              src={viewingStoryContact.statusStory.mediaUrl}
              alt="Status Story"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/f1_car_wallpaper.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          </div>

          {/* Bottom Story Caption & Reply */}
          <div className="z-20 space-y-3">
            <div className="bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <p className="text-sm font-medium">{viewingStoryContact.statusStory.caption}</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Reply to status..."
                className="flex-1 bg-black/60 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-white/60 outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setViewingStoryContact(null);
                    setActiveChatId(viewingStoryContact.id);
                    handleSendMessage('Replied to status: ' + (e.target as HTMLInputElement).value);
                  }
                }}
              />
              <button
                onClick={() => {
                  setViewingStoryContact(null);
                  setActiveChatId(viewingStoryContact.id);
                  handleSendMessage('❤️ Loved your status!');
                }}
                className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-lg active:scale-95"
              >
                ❤️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. NEW POLL CREATION MODAL */}
      {showPollCreator && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-3 animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-3xl ${
              isDark ? 'bg-[#1f2c34] text-white' : 'bg-white text-black'
            } p-4 shadow-2xl border border-neutral-700/50 space-y-3`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-700/40">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-sm">Create Poll</span>
              </div>
              <button onClick={() => setShowPollCreator(false)} className="text-neutral-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-neutral-400">Question</label>
              <input
                type="text"
                placeholder="Ask a question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                  isDark
                    ? 'bg-[#2a3942] border-neutral-600 text-white'
                    : 'bg-neutral-100 border-neutral-300 text-black'
                }`}
              />

              <label className="text-[11px] font-semibold text-neutral-400 mt-2 block">Options</label>
              <input
                type="text"
                placeholder="Option 1"
                value={pollOption1}
                onChange={(e) => setPollOption1(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                  isDark
                    ? 'bg-[#2a3942] border-neutral-600 text-white'
                    : 'bg-neutral-100 border-neutral-300 text-black'
                }`}
              />
              <input
                type="text"
                placeholder="Option 2"
                value={pollOption2}
                onChange={(e) => setPollOption2(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                  isDark
                    ? 'bg-[#2a3942] border-neutral-600 text-white'
                    : 'bg-neutral-100 border-neutral-300 text-black'
                }`}
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setShowPollCreator(false)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-500/20 font-semibold text-xs text-neutral-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePoll}
                className="flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] font-bold text-xs text-white shadow-md cursor-pointer"
              >
                Send Poll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. NEW CHAT CONTACT PICKER MODAL */}
      {showNewChatModal && (
        <div className="absolute inset-0 z-40 flex flex-col pt-12 bg-inherit animate-fade-in">
          <div
            className={`px-4 pb-3 flex items-center justify-between border-b ${
              isDark ? 'border-neutral-800' : 'border-neutral-200'
            }`}
          >
            <button
              onClick={() => setShowNewChatModal(false)}
              className="text-[#25D366] font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <span className="font-bold text-sm">New Chat</span>
            <div className="w-10" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Quick Actions */}
            <div className="space-y-2">
              <div
                onClick={() => {
                  setShowNewChatModal(false);
                  setActiveTab('communities');
                }}
                className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer ${
                  isDark ? 'bg-[#1f2c34]' : 'bg-white'
                } shadow-xs hover:opacity-80`}
              >
                <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs">New Group</p>
                  <p className="text-[10px] text-neutral-400">Create a group chat with friends</p>
                </div>
              </div>

              <div
                onClick={() => {
                  setShowNewChatModal(false);
                  setActiveTab('communities');
                }}
                className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer ${
                  isDark ? 'bg-[#1f2c34]' : 'bg-white'
                } shadow-xs hover:opacity-80`}
              >
                <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white">
                  <CircleDot className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs">New Community</p>
                  <p className="text-[10px] text-neutral-400">Bring together related groups</p>
                </div>
              </div>
            </div>

            {/* Contacts list */}
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400 mb-2 px-1">Contacts on WhatsApp</p>
              <div
                className={`rounded-2xl divide-y ${
                  isDark ? 'bg-[#1f2c34] divide-neutral-800' : 'bg-white divide-neutral-100'
                } shadow-xs`}
              >
                {chats.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveChatId(c.id);
                      setShowNewChatModal(false);
                    }}
                    className="p-3 flex items-center gap-3 cursor-pointer hover:opacity-75"
                  >
                    <div className={`w-9 h-9 rounded-full ${c.avatarBg} flex items-center justify-center text-lg`}>
                      {c.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-xs">{c.name}</p>
                      <p className="text-[10px] text-neutral-400">{c.lastSeen || 'Hey there! I use WhatsApp'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ACTIVE CHAT CONVERSATION VIEW */}
      {currentChat ? (
        <div className="h-full flex flex-col pt-12 relative animate-fade-in">
          {/* Chat Header */}
          <div
            className={`px-3 py-2 flex items-center justify-between border-b ${
              isDark ? 'bg-[#1f2c34] border-neutral-800' : 'bg-[#F0F2F5] border-neutral-200'
            } shadow-xs z-20`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveChatId(null)}
                className="flex items-center text-[#25D366] font-semibold text-xs cursor-pointer -ml-1 pr-1"
              >
                <ChevronLeft className="w-6 h-6" />
                {currentChat.unreadCount ? (
                  <span className="bg-[#25D366] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {currentChat.unreadCount}
                  </span>
                ) : null}
              </button>

              <div
                onClick={() => {
                  if (currentChat.statusStory) {
                    setViewingStoryContact(currentChat);
                  }
                }}
                className="relative cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full ${currentChat.avatarBg} flex items-center justify-center text-lg ${
                    currentChat.statusStory ? 'ring-2 ring-[#25D366] ring-offset-1 ring-offset-transparent' : ''
                  }`}
                >
                  {currentChat.avatar}
                </div>
                {currentChat.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[#1f2c34]" />
                )}
              </div>

              <div className="truncate max-w-[150px]">
                <h3 className="font-bold text-xs truncate leading-tight">{currentChat.name}</h3>
                <p className="text-[10px] text-neutral-400 truncate">
                  {currentChat.online ? (
                    <span className="text-[#25D366] font-medium">online</span>
                  ) : (
                    currentChat.lastSeen || 'offline'
                  )}
                </p>
              </div>
            </div>

            {/* Calling buttons */}
            <div className="flex items-center gap-3 text-[#25D366]">
              <button
                onClick={() => handleStartCall(currentChat, true)}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
              >
                <Video className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleStartCall(currentChat, false)}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
              >
                <Phone className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Area with WhatsApp wallpaper */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 relative">
            {/* WhatsApp authentic wallpaper pattern background */}
            <div
              className={`absolute inset-0 pointer-events-none ${
                isDark ? 'bg-[#0b141a] opacity-95' : 'bg-[#EFEAE2] opacity-95'
              }`}
            >
              {/* Subtle doodle SVG watermark effect */}
              <div className="w-full h-full opacity-5 bg-[radial-gradient(#25D366_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            {/* End-to-end encryption banner */}
            <div className="relative z-10 flex justify-center my-1">
              <div
                className={`max-w-[280px] text-center p-2 rounded-xl text-[10px] ${
                  isDark ? 'bg-[#182229] text-[#ffd279]' : 'bg-[#FFEECD] text-[#54656f]'
                } shadow-xs border border-amber-500/20 flex items-center gap-1.5`}
              >
                <Lock className="w-3 h-3 shrink-0" />
                <span>Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen.</span>
              </div>
            </div>

            {/* Messages Flow */}
            <div className="relative z-10 space-y-2">
              {currentChat.messages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div
                      className={`max-w-[82%] rounded-2xl px-3 py-2 shadow-xs relative ${
                        isMe
                          ? isDark
                            ? 'bg-[#005c4b] text-white rounded-br-xs'
                            : 'bg-[#DCF8C6] text-black rounded-br-xs'
                          : isDark
                          ? 'bg-[#202c33] text-white rounded-bl-xs'
                          : 'bg-white text-black rounded-bl-xs'
                      }`}
                    >
                      {/* Image Message */}
                      {msg.type === 'image' && msg.imageUrl && (
                        <div className="mb-1.5 rounded-xl overflow-hidden shadow-inner max-w-full">
                          <img
                            src={msg.imageUrl}
                            alt="Attachment"
                            className="w-full max-h-48 object-cover cursor-pointer"
                          />
                        </div>
                      )}

                      {/* Voice Note Message */}
                      {msg.type === 'voice' && (
                        <div className="flex items-center gap-2.5 py-1 min-w-[180px]">
                          <button
                            onClick={() => handlePlayVoice(msg.id)}
                            className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md shrink-0 cursor-pointer"
                          >
                            {msg.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                          </button>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-0.5 h-4">
                              {[30, 60, 40, 90, 70, 45, 80, 50, 100, 65, 40, 75, 55, 85].map((h, i) => (
                                <div
                                  key={i}
                                  className={`w-1 rounded-full transition-all ${
                                    msg.isPlaying ? 'bg-[#25D366] animate-pulse' : isMe ? 'bg-white/60' : 'bg-neutral-400'
                                  }`}
                                  style={{ height: `${h}%` }}
                                />
                              ))}
                            </div>
                            <div className="flex justify-between text-[9px] opacity-70">
                              <span>0:0{msg.voiceDuration || 4}</span>
                              <Mic className="w-3 h-3 text-[#25D366]" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Interactive Poll Message */}
                      {msg.type === 'poll' && msg.poll && (
                        <div className="space-y-2 min-w-[210px] py-1">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-[#25D366]">
                            <BarChart2 className="w-4 h-4" />
                            <span>{msg.poll.question}</span>
                          </div>
                          <div className="space-y-1.5">
                            {msg.poll.options.map((opt, oIdx) => {
                              const totalVotes = msg.poll?.options.reduce((acc, curr) => acc + curr.votes, 0) || 1;
                              const pct = Math.round((opt.votes / Math.max(1, totalVotes)) * 100);
                              return (
                                <div
                                  key={oIdx}
                                  onClick={() => handleVotePoll(msg.id, oIdx)}
                                  className={`p-2 rounded-xl border text-[11px] cursor-pointer relative overflow-hidden transition-all ${
                                    opt.userVoted
                                      ? 'border-[#25D366] bg-[#25D366]/15 font-semibold'
                                      : 'border-neutral-600/30 bg-black/10'
                                  }`}
                                >
                                  <div
                                    className="absolute left-0 top-0 bottom-0 bg-[#25D366]/20 transition-all"
                                    style={{ width: `${pct}%` }}
                                  />
                                  <div className="flex items-center justify-between relative z-10">
                                    <span>{opt.text}</span>
                                    <span className="text-[10px] text-neutral-400 font-bold">
                                      {opt.votes} ({pct}%)
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <span className="text-[9px] text-neutral-400 block text-right">Tap option to vote</span>
                        </div>
                      )}

                      {/* Text Content */}
                      {msg.text && <p className="text-xs leading-relaxed break-words">{msg.text}</p>}

                      {/* Timestamp & Delivery Ticks */}
                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-70">
                        <span>{msg.time}</span>
                        {isMe && (
                          <span>
                            {msg.status === 'sent' && <Check className="w-3 h-3" />}
                            {msg.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                            {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-[#53bdeb]" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Attachment Popup Menu */}
          {showAttachmentMenu && (
            <div
              className={`p-3 border-t z-30 animate-fade-in ${
                isDark ? 'bg-[#1f2c34] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-black'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-700/30">
                <span className="font-bold text-xs text-neutral-400">Share Content</span>
                <button onClick={() => setShowAttachmentMenu(false)} className="text-neutral-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3 pt-3 text-center">
                {/* Send Photo from Simulator Gallery */}
                <button
                  onClick={() => handleSendPhoto('/doomsday_wallpaper.jpg')}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium">Photos</span>
                </button>

                {/* Create Poll */}
                <button
                  onClick={() => setShowPollCreator(true)}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium">Poll</span>
                </button>

                {/* Simulated Location */}
                <button
                  onClick={() => {
                    handleSendMessage('📍 Current Location: Cupertino, CA (Apple Park HQ)');
                    setShowAttachmentMenu(false);
                  }}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium">Location</span>
                </button>

                {/* Contact Card */}
                <button
                  onClick={() => {
                    handleSendMessage('👤 Contact Card: Vishnu Sai Ramiya & Rohan R. Potdar');
                    setShowAttachmentMenu(false);
                  }}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium">Contact</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Chat Message Input Bar */}
          <div
            className={`p-2.5 pb-6 flex items-center gap-2 border-t z-20 ${
              isDark ? 'bg-[#1f2c34] border-neutral-800' : 'bg-[#F0F2F5] border-neutral-200'
            }`}
          >
            {/* Attachment Button */}
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="text-[#25D366] hover:opacity-80 p-1.5 rounded-full cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Voice Recording HUD or Text Input */}
            {isRecordingVoice ? (
              <div className="flex-1 flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-2xl px-3 py-1.5 text-red-400 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold text-xs">Recording Audio 0:0{voiceRecordSeconds}</span>
                </div>
                <button
                  onClick={stopAndSendVoiceRecording}
                  className="px-2.5 py-1 bg-red-500 text-white rounded-lg text-[10px] font-bold"
                >
                  Send
                </button>
              </div>
            ) : (
              <div
                className={`flex-1 flex items-center gap-2 rounded-2xl px-3 py-1.5 border shadow-inner ${
                  isDark
                    ? 'bg-[#2a3942] border-neutral-700 text-white'
                    : 'bg-white border-neutral-300 text-black'
                }`}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  className="flex-1 bg-transparent outline-none text-xs placeholder-neutral-400"
                />
              </div>
            )}

            {/* Action Buttons: Send or Mic */}
            {messageInput.trim() ? (
              <button
                onClick={() => handleSendMessage()}
                className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md cursor-pointer active:scale-95 transition-transform"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            ) : (
              <button
                onClick={isRecordingVoice ? stopAndSendVoiceRecording : startVoiceRecording}
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md cursor-pointer active:scale-95 transition-transform ${
                  isRecordingVoice ? 'bg-red-500 text-white' : 'bg-[#25D366] text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* 6. MAIN TABS ROOT VIEW */
        <div className="h-full flex flex-col pt-12">
          {/* TAB 1: CHATS */}
          {activeTab === 'chats' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-4 pb-2 flex items-center justify-between">
                <button
                  onClick={() => setShowAttachmentMenu(false)}
                  className="text-neutral-400 hover:text-white p-1 cursor-pointer"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">Chats</h1>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpdateState((s) => ({ ...s, currentApp: 'camera' }))}
                    className="text-[#25D366] hover:opacity-80 cursor-pointer"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#20bd5a]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-4 py-1.5">
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-1.5 ${
                    isDark ? 'bg-[#1f2c34] text-white' : 'bg-white text-black'
                  } border border-neutral-700/20 shadow-xs`}
                >
                  <Search className="w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search or start new chat"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-xs outline-none placeholder-neutral-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-neutral-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Pills */}
              <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {(['all', 'unread', 'favorites', 'groups'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setChatFilter(filter)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold capitalize cursor-pointer transition-colors whitespace-nowrap ${
                      chatFilter === filter
                        ? 'bg-[#25D366] text-white shadow-xs'
                        : isDark
                        ? 'bg-[#1f2c34] text-neutral-400 hover:text-white'
                        : 'bg-white text-neutral-600 hover:text-black'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Archived folder */}
              <div className="px-4 py-1">
                <div
                  onClick={() => playVolumeStepSound()}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer ${
                    isDark ? 'bg-[#1f2c34]/50 hover:bg-[#1f2c34]' : 'bg-white hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Archive className="w-4 h-4 text-[#25D366]" />
                    <span className="font-semibold text-xs">Archived</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">3</span>
                </div>
              </div>

              {/* Chats List */}
              <div className="flex-1 overflow-y-auto divide-y divide-neutral-700/20 px-4">
                {filteredChats.map((chat) => {
                  const lastMsg = chat.messages[chat.messages.length - 1];
                  return (
                    <div
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className="py-3 flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity"
                    >
                      {/* Avatar with Status Ring if available */}
                      <div
                        onClick={(e) => {
                          if (chat.statusStory) {
                            e.stopPropagation();
                            setViewingStoryContact(chat);
                          }
                        }}
                        className="relative"
                      >
                        <div
                          className={`w-11 h-11 rounded-full ${chat.avatarBg} flex items-center justify-center text-xl shadow-xs ${
                            chat.statusStory ? 'ring-2 ring-[#25D366] ring-offset-2 ring-offset-black' : ''
                          }`}
                        >
                          {chat.avatar}
                        </div>
                        {chat.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-black" />
                        )}
                      </div>

                      {/* Chat Summary */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs truncate">{chat.name}</h4>
                          <span
                            className={`text-[10px] ${
                              chat.unreadCount ? 'text-[#25D366] font-bold' : 'text-neutral-400'
                            }`}
                          >
                            {lastMsg?.time || 'Today'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-[11px] text-neutral-400 truncate max-w-[200px]">
                            {lastMsg?.type === 'poll'
                              ? `📊 Poll: ${lastMsg.poll?.question}`
                              : lastMsg?.type === 'voice'
                              ? `🎤 Voice note (${lastMsg.voiceDuration}s)`
                              : lastMsg?.type === 'image'
                              ? '📷 Photo'
                              : lastMsg?.text || 'No messages yet'}
                          </p>
                          {chat.unreadCount ? (
                            <span className="w-4.5 h-4.5 rounded-full bg-[#25D366] text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                              {chat.unreadCount}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPDATES (Status & Channels) */}
          {activeTab === 'updates' && (
            <div className="flex-1 flex flex-col overflow-y-auto px-4 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Updates</h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateState((s) => ({ ...s, currentApp: 'camera' }))}
                    className="w-8 h-8 rounded-full bg-neutral-700/40 flex items-center justify-center text-[#25D366]"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Status</span>
                </div>

                {/* My Status Card */}
                <div
                  onClick={() => onUpdateState((s) => ({ ...s, currentApp: 'camera' }))}
                  className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer ${
                    isDark ? 'bg-[#1f2c34]' : 'bg-white'
                  } shadow-xs hover:opacity-85`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-500 flex items-center justify-center text-xl">
                        👤
                      </div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#25D366] text-white flex items-center justify-center border-2 border-black">
                        <Plus className="w-3 h-3" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-xs">My Status</p>
                      <p className="text-[10px] text-neutral-400">Tap to add status update</p>
                    </div>
                  </div>
                </div>

                {/* Recent Updates from Contacts */}
                <p className="text-[10px] uppercase font-bold text-neutral-400 pt-2 px-1">Recent updates</p>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {chats
                    .filter((c) => c.statusStory)
                    .map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => setViewingStoryContact(contact)}
                        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                      >
                        <div className="w-14 h-14 rounded-full p-0.5 ring-2 ring-[#25D366] ring-offset-2 ring-offset-black">
                          <div className={`w-full h-full rounded-full ${contact.avatarBg} flex items-center justify-center text-2xl`}>
                            {contact.avatar}
                          </div>
                        </div>
                        <span className="text-[10px] font-medium truncate max-w-[65px] text-center">
                          {contact.name.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Channels Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Channels</span>
                  <span className="text-[11px] text-[#25D366] font-bold">Explore</span>
                </div>
                <p className="text-[10px] text-neutral-400">Stay updated on topics you care about</p>

                <div className="space-y-2">
                  {channels.map((ch) => (
                    <div
                      key={ch.id}
                      className={`p-3 rounded-2xl flex items-center justify-between ${
                        isDark ? 'bg-[#1f2c34]' : 'bg-white'
                      } shadow-xs`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${ch.bg} flex items-center justify-center text-xl`}>
                          {ch.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="font-bold text-xs">{ch.name}</p>
                            {ch.verified && (
                              <span className="w-3.5 h-3.5 rounded-full bg-[#25D366] text-white text-[8px] flex items-center justify-center font-black">
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-neutral-400">{ch.followers}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFollowChannel(ch.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                          ch.isFollowing
                            ? 'bg-neutral-700 text-neutral-300'
                            : 'bg-[#25D366] text-white shadow-xs'
                        }`}
                      >
                        {ch.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNITIES */}
          {activeTab === 'communities' && (
            <div className="flex-1 flex flex-col overflow-y-auto px-4 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Communities</h1>
              </div>

              {/* Start Community Card */}
              <div
                onClick={() => playVolumeStepSound()}
                className={`p-4 rounded-3xl ${
                  isDark ? 'bg-[#1f2c34]' : 'bg-white'
                } shadow-xs flex items-center gap-3 cursor-pointer hover:opacity-85`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center text-2xl shadow-md">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xs">New Community</h3>
                  <p className="text-[10px] text-neutral-400">Organize and manage related chat groups</p>
                </div>
              </div>

              {/* Active Communities */}
              <div className="space-y-3">
                {communities.map((com) => (
                  <div
                    key={com.id}
                    className={`p-4 rounded-3xl ${
                      isDark ? 'bg-[#1f2c34]' : 'bg-white'
                    } shadow-xs space-y-3`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-2xl shadow-md">
                        {com.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs">{com.name}</h4>
                        <p className="text-[10px] text-neutral-400">{com.memberCount} members</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-300">{com.desc}</p>
                    <div className="space-y-1.5 pt-1">
                      {com.groups.map((grp, gIdx) => (
                        <div
                          key={gIdx}
                          onClick={() => {
                            setActiveTab('chats');
                            setActiveChatId('c2');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl bg-black/10 dark:bg-white/5 cursor-pointer hover:opacity-75"
                        >
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                            <span className="font-semibold text-[11px]">{grp}</span>
                          </div>
                          <span className="text-[10px] text-neutral-400">View</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CALLS */}
          {activeTab === 'calls' && (
            <div className="flex-1 flex flex-col overflow-y-auto px-4 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Calls</h1>
                <button
                  onClick={() => setShowNewChatModal(true)}
                  className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md"
                >
                  <PhoneCall className="w-4 h-4" />
                </button>
              </div>

              {/* Create Call Link */}
              <div
                onClick={() => {
                  playVolumeStepSound();
                  navigator.clipboard?.writeText('https://call.whatsapp.com/video/ios-simulator');
                }}
                className={`p-3.5 rounded-3xl ${
                  isDark ? 'bg-[#1f2c34]' : 'bg-white'
                } shadow-xs flex items-center justify-between cursor-pointer hover:opacity-85`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs">Create Call Link</p>
                    <p className="text-[10px] text-neutral-400">Share a link for your WhatsApp call</p>
                  </div>
                </div>
              </div>

              {/* Recent Calls Log */}
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-400 mb-2 px-1">Recent</p>
                <div
                  className={`rounded-3xl divide-y ${
                    isDark ? 'bg-[#1f2c34] divide-neutral-800' : 'bg-white divide-neutral-100'
                  } shadow-xs`}
                >
                  {callLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 flex items-center justify-between cursor-pointer hover:opacity-80"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${log.avatarBg} flex items-center justify-center text-xl`}>
                          {log.avatar}
                        </div>
                        <div>
                          <p
                            className={`font-bold text-xs ${
                              log.type === 'missed' ? 'text-red-500' : ''
                            }`}
                          >
                            {log.name}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                            {log.type === 'incoming' && <PhoneIncoming className="w-3 h-3 text-[#25D366]" />}
                            {log.type === 'outgoing' && <PhoneOutgoing className="w-3 h-3 text-neutral-400" />}
                            {log.type === 'missed' && <PhoneMissed className="w-3 h-3 text-red-500" />}
                            <span>{log.time}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const contact = chats.find((c) => c.name.includes(log.name)) || chats[0];
                          handleStartCall(contact, log.isVideo);
                        }}
                        className="p-2 text-[#25D366] hover:opacity-80"
                      >
                        {log.isVideo ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="flex-1 flex flex-col overflow-y-auto px-4 space-y-4">
              <h1 className="text-xl font-bold">Settings</h1>

              {/* Profile Card */}
              <div
                className={`p-4 rounded-3xl ${
                  isDark ? 'bg-[#1f2c34]' : 'bg-white'
                } shadow-xs flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-500 flex items-center justify-center text-2xl shadow-md">
                    👤
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Vishnu Sai Ramiya</h3>
                    <p className="text-[10px] text-neutral-400">{aboutText}</p>
                    <span className="text-[9px] text-[#25D366] font-medium">+1 (555) 019-2834</span>
                  </div>
                </div>
                <QrCode className="w-5 h-5 text-[#25D366]" />
              </div>

              {/* Core Options */}
              <div
                className={`rounded-3xl divide-y ${
                  isDark ? 'bg-[#1f2c34] divide-neutral-800' : 'bg-white divide-neutral-100'
                } shadow-xs`}
              >
                {/* Starred Messages */}
                <div
                  onClick={() => playVolumeStepSound()}
                  className="p-3 flex items-center justify-between cursor-pointer hover:opacity-75"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                      <Star className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs">Starred Messages</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">12</span>
                </div>

                {/* Linked Devices */}
                <div
                  onClick={() => playVolumeStepSound()}
                  className="p-3 flex items-center justify-between cursor-pointer hover:opacity-75"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs">Linked Devices</span>
                  </div>
                  <span className="text-[10px] text-[#25D366] font-bold">MacBook Pro (Active)</span>
                </div>
              </div>

              {/* Security, Privacy & Account */}
              <div
                className={`rounded-3xl divide-y ${
                  isDark ? 'bg-[#1f2c34] divide-neutral-800' : 'bg-white divide-neutral-100'
                } shadow-xs`}
              >
                {/* Account */}
                <div className="p-3 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <Key className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-xs">Account</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">Security notifications</span>
                </div>

                {/* Privacy & Read Receipts */}
                <div
                  onClick={() => setReadReceipts(!readReceipts)}
                  className="p-3 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs">Read Receipts</span>
                      <p className="text-[9px] text-neutral-400">Blue ticks enabled</p>
                    </div>
                  </div>
                  <div
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                      readReceipts ? 'bg-[#25D366]' : 'bg-neutral-600'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        readReceipts ? 'transform translate-x-4' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Chats & Wallpaper */}
                <div
                  onClick={() => {
                    onUpdateState((s) => ({ ...s, isDarkMode: !s.isDarkMode }));
                  }}
                  className="p-3 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs">Chat Theme</span>
                      <p className="text-[9px] text-neutral-400">Toggle Dark / Light Mode</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-bold">
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>

                {/* Storage and Data */}
                <div className="p-3 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                      <HardDrive className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs">Storage and Data</span>
                      <p className="text-[9px] text-neutral-400">1.4 GB Used • 48.6 GB Free</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM TAB BAR (Authentic WhatsApp iOS Navigation) */}
          <div
            className={`border-t py-1.5 px-3 pb-5 grid grid-cols-5 gap-1 ${
              isDark ? 'bg-[#1f2c34] border-neutral-800' : 'bg-[#F0F2F5] border-neutral-200'
            } z-20`}
          >
            {/* Updates Tab */}
            <button
              onClick={() => setActiveTab('updates')}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'updates' ? 'text-[#25D366]' : 'text-neutral-400'
              }`}
            >
              <CircleDot className="w-5 h-5" />
              <span className="text-[9px] font-medium">Updates</span>
            </button>

            {/* Calls Tab */}
            <button
              onClick={() => setActiveTab('calls')}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'calls' ? 'text-[#25D366]' : 'text-neutral-400'
              }`}
            >
              <Phone className="w-5 h-5" />
              <span className="text-[9px] font-medium">Calls</span>
            </button>

            {/* Communities Tab */}
            <button
              onClick={() => setActiveTab('communities')}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'communities' ? 'text-[#25D366]' : 'text-neutral-400'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[9px] font-medium">Communities</span>
            </button>

            {/* Chats Tab */}
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex flex-col items-center gap-1 cursor-pointer relative ${
                activeTab === 'chats' ? 'text-[#25D366]' : 'text-neutral-400'
              }`}
            >
              <div className="relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#25D366] text-white text-[8px] font-bold flex items-center justify-center">
                  3
                </span>
              </div>
              <span className="text-[9px] font-bold">Chats</span>
            </button>

            {/* Settings Tab */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                activeTab === 'settings' ? 'text-[#25D366]' : 'text-neutral-400'
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span className="text-[9px] font-medium">Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
