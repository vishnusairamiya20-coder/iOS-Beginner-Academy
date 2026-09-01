import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Search,
  Home,
  PlaySquare,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Bell,
  ChevronDown,
  MoreVertical,
  Maximize,
  MessageSquare,
  Send,
  ExternalLink,
  Tv,
  X,
  Link,
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';
import { SimulatorState, IosAppId } from '../../../types';
import { playVolumeStepSound } from '../../../utils/audioUtils';

export interface YouTubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  channelAvatar: string;
  subscribers: string;
  views: string;
  uploadedTime: string;
  duration: string;
  durationSec: number;
  thumbnailGradient: string;
  thumbnailEmoji: string;
  category: 'Tech' | 'Music' | 'Gaming' | 'Education' | 'Entertainment' | 'Nature' | 'Live';
  description: string;
  likes: number;
  initialComments: Array<{ user: string; avatar: string; time: string; text: string; likes: number }>;
}

export const YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: 'yt-1',
    youtubeId: 'yvNq_Cvdc84', // MKBHD iPhone 16 Pro Review
    title: 'iPhone 16 Pro Review: The Real Deal!',
    channel: 'Marques Brownlee',
    channelAvatar: 'M',
    subscribers: '18.5M',
    views: '4.2M views',
    uploadedTime: '2 days ago',
    duration: '14:28',
    durationSec: 868,
    thumbnailGradient: 'from-neutral-900 via-neutral-800 to-amber-950',
    thumbnailEmoji: '📱',
    category: 'Tech',
    description: 'The iPhone 16 Pro and Pro Max are here with the new Camera Control button, Grade 5 Titanium, A18 Pro silicon, and improved battery life. Here is the full breakdown.',
    likes: 245000,
    initialComments: [
      { user: 'TechEnthusiast', avatar: '🚀', time: '1 day ago', text: 'The titanium finish looks incredible in person. Great review as always!', likes: 1420 },
      { user: 'DevGuy99', avatar: '💻', time: '18 hours ago', text: 'Battery life improvements on this generation are very noticeable.', likes: 890 },
      { user: 'Sara_W', avatar: '🌸', time: '5 hours ago', text: 'Crisp camera footage and audio clarity!', likes: 310 }
    ]
  },
  {
    id: 'yt-2',
    youtubeId: '4NRXx6U8ABQ', // The Weeknd - Blinding Lights
    title: 'The Weeknd - Blinding Lights (Official Music Video)',
    channel: 'The Weeknd',
    channelAvatar: 'W',
    subscribers: '34.2M',
    views: '820M views',
    uploadedTime: '3 years ago',
    duration: '4:20',
    durationSec: 260,
    thumbnailGradient: 'from-red-600 via-rose-700 to-amber-600',
    thumbnailEmoji: '🎵',
    category: 'Music',
    description: 'Official music video for Blinding Lights performed by The Weeknd. Directed by Anton Tammi. Listen in Spatial Audio on Apple Music.',
    likes: 12400000,
    initialComments: [
      { user: 'RetroWaveLover', avatar: '⚡', time: '2 days ago', text: 'This song will forever be a timeless synthwave masterpiece.', likes: 8500 },
      { user: 'SynthKid', avatar: '🎹', time: '1 week ago', text: 'The cinematic production in this music video is unmatched.', likes: 3200 }
    ]
  },
  {
    id: 'yt-3',
    youtubeId: 'jfKfPfyJRdk', // Lofi Girl 24/7 Live Stream
    title: 'Lofi Hip Hop Radio 24/7 - Beats to Relax / Study to',
    channel: 'Lofi Girl',
    channelAvatar: 'L',
    subscribers: '14.1M',
    views: '16.4K watching',
    uploadedTime: 'LIVE NOW',
    duration: 'LIVE',
    durationSec: 3600,
    thumbnailGradient: 'from-amber-400 via-orange-500 to-indigo-800',
    thumbnailEmoji: '☕',
    category: 'Live',
    description: 'Welcome to the Lofi Girl live stream. Peaceful lo-fi beats, gentle vinyl piano, and relaxing rhythms for coding, studying, and resting.',
    likes: 7200000,
    initialComments: [
      { user: 'Student_Coding', avatar: '📚', time: 'Just now', text: 'Helped me finish my entire computer science project tonight!', likes: 450 },
      { user: 'PeacefulVibes', avatar: '✨', time: '2 mins ago', text: 'Sending good vibes to everyone studying or relaxing worldwide.', likes: 210 }
    ]
  },
  {
    id: 'yt-4',
    youtubeId: '7_LPdttKXPc', // Fireship How Internet Works in 100 Seconds
    title: 'How The Internet Actually Works in 100 Seconds',
    channel: 'Fireship',
    channelAvatar: 'F',
    subscribers: '3.2M',
    views: '1.8M views',
    uploadedTime: '1 month ago',
    duration: '2:15',
    durationSec: 135,
    thumbnailGradient: 'from-yellow-500 via-orange-600 to-red-600',
    thumbnailEmoji: '🔥',
    category: 'Education',
    description: 'Learn how TCP/IP packets, undersea fiber optic cables, DNS lookups, BGP routing, and CDNs deliver web data in just 100 seconds.',
    likes: 180000,
    initialComments: [
      { user: 'WebMaster', avatar: '🌐', time: '3 weeks ago', text: 'Best 100 seconds explanation on the internet.', likes: 2300 }
    ]
  },
  {
    id: 'yt-5',
    youtubeId: 'QdBZY2fkU-0', // GTA 6 Trailer 1
    title: 'Grand Theft Auto VI Trailer 1 (Official 4K)',
    channel: 'Rockstar Games',
    channelAvatar: 'R',
    subscribers: '10.8M',
    views: '210M views',
    uploadedTime: '8 months ago',
    duration: '1:31',
    durationSec: 91,
    thumbnailGradient: 'from-pink-600 via-purple-700 to-indigo-950',
    thumbnailEmoji: '🎮',
    category: 'Gaming',
    description: 'Grand Theft Auto VI heads to the state of Leonida, home to the neon-soaked streets of Vice City and beyond in the biggest, most immersive evolution of the Grand Theft Auto series yet.',
    likes: 11200000,
    initialComments: [
      { user: 'GamerX', avatar: '🕹️', time: '4 days ago', text: 'The water physics, volumetric lighting, and crowd density are breathtaking!', likes: 19400 }
    ]
  },
  {
    id: 'yt-6',
    youtubeId: 'BHACKCNDMW8', // 4K Nature Ocean Drone
    title: '4K Tropical Island & Ocean Drone Relaxation (Real 4K HDR)',
    channel: 'Scenic Relaxation',
    channelAvatar: '🏖️',
    subscribers: '5.2M',
    views: '18.9M views',
    uploadedTime: '6 months ago',
    duration: '10:00',
    durationSec: 600,
    thumbnailGradient: 'from-cyan-500 via-teal-600 to-blue-800',
    thumbnailEmoji: '🌴',
    category: 'Nature',
    description: 'Ultra HD 4K aerial drone footage over turquoise crystal waves, white sand beaches, coral reefs, and tranquil island sunsets with relaxing coastal sounds.',
    likes: 490000,
    initialComments: [
      { user: 'Traveler99', avatar: '✈️', time: '2 days ago', text: 'Most relaxing visuals on YouTube. Pure bliss.', likes: 810 }
    ]
  },
  {
    id: 'yt-7',
    youtubeId: 'fJ9rUzIMcZQ', // Queen Bohemian Rhapsody
    title: 'Queen – Bohemian Rhapsody (Official Video Remastered)',
    channel: 'Queen Official',
    channelAvatar: 'Q',
    subscribers: '17.4M',
    views: '1.7B views',
    uploadedTime: '15 years ago',
    duration: '5:59',
    durationSec: 359,
    thumbnailGradient: 'from-neutral-900 via-indigo-900 to-black',
    thumbnailEmoji: '👑',
    category: 'Music',
    description: 'The official Bohemian Rhapsody music video. Remastered in HD.',
    likes: 16000000,
    initialComments: [
      { user: 'ClassicRock', avatar: '🎸', time: '1 week ago', text: 'An undisputed masterpiece of human musical creativity.', likes: 9400 }
    ]
  }
];

export const YOUTUBE_SHORTS = [
  {
    id: 'short-1',
    youtubeId: 'n1h8yW3Zrnw', // Apple Event / iPhone
    title: 'iOS 18 Hidden Features You Did Not Know! 🤯',
    channel: 'TechInsider',
    channelAvatar: '⚡',
    views: '3.4M',
    likes: 310000,
    commentsCount: '1.2K',
    tag: '#Shorts #Apple #iOS18',
    gradient: 'from-indigo-600 to-purple-800',
    emoji: '📲'
  },
  {
    id: 'short-2',
    youtubeId: 'LXb3EKWsInQ', // 4K Nature Wave
    title: 'Satisfying 4K Drone Wave Crash 🌊',
    channel: 'OceanWander',
    channelAvatar: '🌴',
    views: '5.1M',
    likes: 620000,
    commentsCount: '2.5K',
    tag: '#Nature #Drone #Shorts',
    gradient: 'from-cyan-500 to-blue-700',
    emoji: '🏝️'
  },
  {
    id: 'short-3',
    youtubeId: 'kJQP7kiw5Fk', // Music Hit
    title: 'Top 1 Most Streamed Song of All Time 🎵',
    channel: 'MusicCharts',
    channelAvatar: '🎧',
    views: '8.9M',
    likes: 940000,
    commentsCount: '4.1K',
    tag: '#Music #Hits #Shorts',
    gradient: 'from-amber-500 to-red-700',
    emoji: '🔥'
  }
];

interface YouTubeAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onOpenApp: (app: IosAppId) => void;
  onClose?: () => void;
}

export const YouTubeApp: React.FC<YouTubeAppProps> = ({ state, onUpdateState, onOpenApp, onClose }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'shorts' | 'subscriptions' | 'you'>('home');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [showCustomUrlModal, setShowCustomUrlModal] = useState(false);
  const [customInputUrl, setCustomInputUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [subscribedChannels, setSubscribedChannels] = useState<string[]>(['Marques Brownlee', 'Lofi Girl', 'Rockstar Games']);
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>(['yt-1', 'yt-2']);
  const [dislikedVideoIds, setDislikedVideoIds] = useState<string[]>([]);
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>(['yt-1']);
  const [activeShortIndex, setActiveShortIndex] = useState(0);
  const [commentsList, setCommentsList] = useState<Array<{ user: string; avatar: string; time: string; text: string; likes: number }>>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [videoList, setVideoList] = useState<YouTubeVideo[]>(YOUTUBE_VIDEOS);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // When video is selected, sync comments
  useEffect(() => {
    if (selectedVideo) {
      setCommentsList(selectedVideo.initialComments);
    }
  }, [selectedVideo]);

  // Extract YouTube ID from link or input
  const parseYouTubeId = (input: string): string => {
    const trimmed = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      return match[1];
    }
    return trimmed;
  };

  const handleLoadCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl.trim()) return;
    const extractedId = parseYouTubeId(customInputUrl);
    playVolumeStepSound();

    const customVideo: YouTubeVideo = {
      id: `custom-${Date.now()}`,
      youtubeId: extractedId,
      title: customInputUrl.length > 40 ? `Custom Stream (${extractedId})` : customInputUrl,
      channel: 'YouTube Video',
      channelAvatar: '▶️',
      subscribers: '1M',
      views: 'Live Video',
      uploadedTime: 'Just now',
      duration: 'HD',
      durationSec: 600,
      thumbnailGradient: 'from-red-600 via-neutral-900 to-black',
      thumbnailEmoji: '🎬',
      category: 'Entertainment',
      description: `Playing custom YouTube video with ID ${extractedId}`,
      likes: 1500,
      initialComments: [
        { user: 'Viewer', avatar: '📺', time: 'Just now', text: 'Streaming live in iOS Simulator!', likes: 1 }
      ]
    };

    setVideoList([customVideo, ...videoList]);
    setSelectedVideo(customVideo);
    setCustomInputUrl('');
    setShowCustomUrlModal(false);
  };

  const handleSelectVideo = (video: YouTubeVideo) => {
    playVolumeStepSound();
    setSelectedVideo(video);
  };

  const toggleSubscribe = (channelName: string) => {
    playVolumeStepSound();
    setSubscribedChannels((prev) =>
      prev.includes(channelName) ? prev.filter((c) => c !== channelName) : [...prev, channelName]
    );
  };

  const toggleLike = (videoId: string) => {
    playVolumeStepSound();
    setLikedVideoIds((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );
    setDislikedVideoIds((prev) => prev.filter((id) => id !== videoId));
  };

  const toggleDislike = (videoId: string) => {
    playVolumeStepSound();
    setDislikedVideoIds((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );
    setLikedVideoIds((prev) => prev.filter((id) => id !== videoId));
  };

  const toggleSave = (videoId: string) => {
    playVolumeStepSound();
    setSavedVideoIds((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    playVolumeStepSound();
    setCommentsList([
      {
        user: state.appleId.name || 'You',
        avatar: '⭐️',
        time: 'Just now',
        text: newCommentText.trim(),
        likes: 1
      },
      ...commentsList
    ]);
    setNewCommentText('');
  };

  const handleCopyShare = () => {
    playVolumeStepSound();
    if (selectedVideo) {
      navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  const categories = ['All', 'Tech', 'Music', 'Gaming', 'Education', 'Nature', 'Live'];

  const filteredVideos = videoList.filter((v) => {
    if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;
    if (!searchQuery) return true;
    return (
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-neutral-950 text-white'} select-none font-sans relative overflow-hidden`}>
      {/* Top YouTube Header */}
      {!selectedVideo && (
        <div className="pt-12 pb-2 px-3 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-xl z-20">
          {/* Logo */}
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-5 rounded-md bg-red-600 flex items-center justify-center text-white shadow-xs">
              <Play className="w-3 h-3 fill-white ml-0.5" />
            </div>
            <span className="font-black text-base tracking-tighter text-white">YouTube</span>
          </div>

          {/* Top Actions: Watch Any URL, Apple Music Cross-link, Search, Profile */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCustomUrlModal(true)}
              title="Watch Any YouTube Video"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-[10px] font-bold hover:bg-red-600/30 cursor-pointer active:scale-95 transition-transform"
            >
              <Plus className="w-3 h-3" />
              <span>Paste URL</span>
            </button>

            <button
              onClick={() => onOpenApp('music')}
              title="Open Apple Music"
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600/20 border border-rose-500/30 text-rose-400 text-[10px] font-semibold hover:bg-rose-600/30 cursor-pointer"
            >
              <span>🎵 Music</span>
            </button>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1.5 text-neutral-300 hover:text-white"
            >
              <Search className="w-4 h-4" />
            </button>

            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
              {state.appleId.name[0]}
            </div>
          </div>
        </div>
      )}

      {/* Expandable Search Bar */}
      {isSearchOpen && !selectedVideo && (
        <div className="px-3 py-2 bg-neutral-900 border-b border-neutral-800 flex items-center gap-2 animate-fade-in z-20">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search videos, creators, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 outline-none"
            autoFocus
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-neutral-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* FULLSCREEN / ACTIVE VIDEO PLAYER VIEW */}
      {selectedVideo ? (
        <div className="flex-1 flex flex-col overflow-y-auto animate-fade-in bg-neutral-950 text-white pt-10">
          {/* Real YouTube Embedded Iframe Player */}
          <div className="relative w-full aspect-video bg-black flex flex-col justify-between overflow-hidden shadow-2xl group shrink-0">
            <iframe
              title={selectedVideo.title}
              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&enablejsapi=1&playsinline=1&rel=0&modestbranding=1`}
              className="w-full h-full border-0 absolute inset-0 z-10"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />

            {/* Close Player Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              title="Close Player"
              className="absolute top-2 left-2 z-30 p-1.5 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors cursor-pointer border border-white/20 shadow-md backdrop-blur-md"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Video Information & Interaction Bar */}
          <div className="p-4 space-y-3">
            <div>
              <h1 className="font-bold text-sm leading-snug text-white">{selectedVideo.title}</h1>
              <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1">
                <span>{selectedVideo.views}</span>
                <span>•</span>
                <span>{selectedVideo.uploadedTime}</span>
                <span>•</span>
                <span className="text-red-400 font-semibold">{selectedVideo.category}</span>
                <span className="ml-auto text-[9px] bg-red-600/30 border border-red-500/40 text-red-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  Real Video Player
                </span>
              </div>
            </div>

            {/* Channel Info & Subscribe Button */}
            <div className="flex items-center justify-between py-2 border-y border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs shadow-xs">
                  {selectedVideo.channelAvatar}
                </div>
                <div>
                  <p className="font-bold text-xs text-white">{selectedVideo.channel}</p>
                  <p className="text-[10px] text-neutral-400">{selectedVideo.subscribers}</p>
                </div>
              </div>

              <button
                onClick={() => toggleSubscribe(selectedVideo.channel)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  subscribedChannels.includes(selectedVideo.channel)
                    ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    : 'bg-white text-black hover:bg-neutral-200 active:scale-95'
                }`}
              >
                {subscribedChannels.includes(selectedVideo.channel) ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Actions Carousel (Like, Dislike, Share, Save, Music) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
              <div className="flex items-center rounded-full bg-neutral-850 border border-neutral-800">
                <button
                  onClick={() => toggleLike(selectedVideo.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-l-full hover:bg-neutral-800 ${
                    likedVideoIds.includes(selectedVideo.id) ? 'text-red-500 font-bold' : 'text-neutral-300'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${likedVideoIds.includes(selectedVideo.id) ? 'fill-red-500' : ''}`} />
                  <span>{selectedVideo.likes.toLocaleString()}</span>
                </button>
                <div className="w-px h-4 bg-neutral-700" />
                <button
                  onClick={() => toggleDislike(selectedVideo.id)}
                  className={`px-2.5 py-1.5 rounded-r-full hover:bg-neutral-800 ${
                    dislikedVideoIds.includes(selectedVideo.id) ? 'text-red-500' : 'text-neutral-400'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleCopyShare}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-850 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 relative cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedNotification ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={() => toggleSave(selectedVideo.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-850 border border-neutral-800 ${
                  savedVideoIds.includes(selectedVideo.id) ? 'text-amber-400 border-amber-500/40' : 'text-neutral-300'
                } hover:bg-neutral-800 cursor-pointer`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{savedVideoIds.includes(selectedVideo.id) ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={() => {
                  window.open(`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`, '_blank');
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-850 border border-neutral-800 text-neutral-300 hover:bg-neutral-800 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </button>

              {/* Cross-Link to Apple Music App if track */}
              {selectedVideo.category === 'Music' && (
                <button
                  onClick={() => onOpenApp('music')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-600/30 border border-rose-500/50 text-rose-300 hover:bg-rose-600/40 cursor-pointer whitespace-nowrap"
                >
                  <span>🎵 Open in Music</span>
                </button>
              )}
            </div>

            {/* Video Description */}
            <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 leading-relaxed">
              <p>{selectedVideo.description}</p>
            </div>

            {/* Comments Preview Box */}
            <div
              onClick={() => setShowCommentsModal(true)}
              className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1.5 cursor-pointer hover:border-neutral-700"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Comments ({commentsList.length})</span>
                <span className="text-[10px] text-neutral-400 font-normal">Tap to comment</span>
              </div>
              {commentsList[0] && (
                <div className="flex items-start gap-2">
                  <span className="text-sm">{commentsList[0].avatar}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-neutral-300 line-clamp-1">{commentsList[0].text}</p>
                    <span className="text-[9px] text-neutral-500">{commentsList[0].user} • {commentsList[0].time}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Up Next / Related Videos List */}
            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-xs text-neutral-400 uppercase tracking-wider">Up Next</h3>
              {videoList.filter((v) => v.id !== selectedVideo.id).map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  className="flex items-start gap-2.5 p-2 rounded-2xl bg-neutral-900/80 border border-neutral-800 cursor-pointer hover:bg-neutral-850"
                >
                  <div className={`w-24 h-16 rounded-xl bg-gradient-to-tr ${video.thumbnailGradient} flex items-center justify-center text-xl shrink-0 relative overflow-hidden`}>
                    <span>{video.thumbnailEmoji}</span>
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.2 rounded text-[8px] font-bold text-white font-mono">
                      {video.duration}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-white line-clamp-2 leading-tight">{video.title}</p>
                    <p className="text-[10px] text-neutral-400 mt-1">{video.channel}</p>
                    <span className="text-[9px] text-neutral-500">{video.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Comments Modal Drawer */}
          {showCommentsModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in">
              <div className="w-full h-3/4 bg-neutral-900 rounded-t-3xl border-t border-neutral-800 flex flex-col p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <h3 className="font-bold text-sm">Comments</h3>
                  <button onClick={() => setShowCommentsModal(false)} className="text-neutral-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-500 active:scale-95 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {commentsList.map((c, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl bg-neutral-850">
                      <span className="text-base">{c.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] text-white">{c.user}</span>
                          <span className="text-[9px] text-neutral-500">{c.time}</span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-0.5">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MAIN YOUTUBE TABS */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="flex-1 overflow-y-auto pb-14 space-y-3">
              {/* Category Filter Chips */}
              <div className="flex gap-1.5 px-3 py-2 overflow-x-auto bg-neutral-950/80 sticky top-0 z-10">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                      selectedCategory === cat
                        ? 'bg-white text-black'
                        : 'bg-neutral-850 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Feed of Real Videos */}
              <div className="space-y-4 px-2">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => handleSelectVideo(video)}
                    className="space-y-2 cursor-pointer group"
                  >
                    {/* Thumbnail Card */}
                    <div className={`w-full aspect-video rounded-2xl bg-gradient-to-tr ${video.thumbnailGradient} flex items-center justify-center text-5xl relative overflow-hidden shadow-lg group-hover:scale-[1.01] transition-transform`}>
                      <span>{video.thumbnailEmoji}</span>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded-md text-[10px] font-bold text-white font-mono">
                        {video.duration}
                      </span>
                    </div>

                    {/* Meta Row */}
                    <div className="flex items-start gap-2.5 px-1">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {video.channelAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs leading-snug text-white line-clamp-2">{video.title}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {video.channel} • {video.views} • {video.uploadedTime}
                        </p>
                      </div>
                      <button className="text-neutral-400 hover:text-white p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHORTS TAB */}
          {activeTab === 'shorts' && (
            <div className="flex-1 relative flex flex-col justify-between pb-12 overflow-hidden select-none bg-black">
              {/* Real YouTube Short Embed */}
              <iframe
                key={YOUTUBE_SHORTS[activeShortIndex].id}
                title={YOUTUBE_SHORTS[activeShortIndex].title}
                src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_SHORTS[activeShortIndex].youtubeId}?autoplay=1&enablejsapi=1&loop=1&playlist=${YOUTUBE_SHORTS[activeShortIndex].youtubeId}&playsinline=1&modestbranding=1`}
                className="w-full h-full border-0 absolute inset-0 z-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />

              {/* Side Floating Actions (Like, Dislike, Next Short) */}
              <div className="relative z-10 self-end pr-3 pt-14 space-y-3 flex flex-col items-center text-white pointer-events-auto">
                <button
                  onClick={() => playVolumeStepSound()}
                  className="flex flex-col items-center gap-1 active:scale-90 transition-transform cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold">{YOUTUBE_SHORTS[activeShortIndex].likes.toLocaleString()}</span>
                </button>

                <button
                  onClick={() => {
                    playVolumeStepSound();
                    setActiveShortIndex((prev) => (prev + 1) % YOUTUBE_SHORTS.length);
                  }}
                  className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg active:scale-95 border border-red-400 cursor-pointer"
                  title="Next Short"
                >
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </button>
              </div>

              {/* Bottom Meta */}
              <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-1.5 pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center">
                    {YOUTUBE_SHORTS[activeShortIndex].channelAvatar}
                  </div>
                  <span className="font-bold text-xs text-white">{YOUTUBE_SHORTS[activeShortIndex].channel}</span>
                  <button className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] pointer-events-auto">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs font-medium text-white line-clamp-1">{YOUTUBE_SHORTS[activeShortIndex].title}</p>
                <p className="text-[10px] text-red-300 font-semibold">{YOUTUBE_SHORTS[activeShortIndex].tag}</p>
              </div>
            </div>
          )}

          {/* SUBSCRIPTIONS TAB */}
          {activeTab === 'subscriptions' && (
            <div className="flex-1 overflow-y-auto pb-14 p-3 space-y-4">
              <h2 className="font-bold text-base">Subscribed Channels</h2>

              {/* Channel Avatars Carousel */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[
                  { name: 'Marques', avatar: 'M', new: true },
                  { name: 'Lofi Girl', avatar: 'L', new: true },
                  { name: 'Rockstar', avatar: 'R', new: true },
                  { name: 'Fireship', avatar: 'F', new: false },
                  { name: 'Queen', avatar: 'Q', new: false }
                ].map((ch) => (
                  <div key={ch.name} className="flex flex-col items-center gap-1 cursor-pointer shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-indigo-600 p-0.5 relative">
                      <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-sm font-bold">
                        {ch.avatar}
                      </div>
                      {ch.new && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-black" />
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-300">{ch.name}</span>
                  </div>
                ))}
              </div>

              {/* Latest Subscribed Feed */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Latest Uploads</h3>
                {videoList.slice(0, 4).map((v) => (
                  <div
                    key={v.id}
                    onClick={() => handleSelectVideo(v)}
                    className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-start gap-2.5 cursor-pointer hover:bg-neutral-850"
                  >
                    <div className={`w-28 h-18 rounded-xl bg-gradient-to-tr ${v.thumbnailGradient} flex items-center justify-center text-2xl shrink-0`}>
                      <span>{v.thumbnailEmoji}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-white line-clamp-2">{v.title}</p>
                      <p className="text-[10px] text-neutral-400 mt-1">{v.channel}</p>
                      <span className="text-[9px] text-neutral-500">{v.views} • {v.uploadedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* YOU / LIBRARY TAB */}
          {activeTab === 'you' && (
            <div className="flex-1 overflow-y-auto pb-14 p-3 space-y-4">
              {/* Profile Card */}
              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-base shadow-xs">
                  {state.appleId.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{state.appleId.name}</h3>
                  <p className="text-[11px] text-neutral-400">@{state.appleId.name.toLowerCase().replace(' ', '_')} • Premium Member</p>
                </div>
              </div>

              {/* Quick History Carousel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-neutral-300">History</h3>
                  <span className="text-[10px] text-blue-400 font-semibold cursor-pointer">View all</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {videoList.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => handleSelectVideo(v)}
                      className="w-32 shrink-0 space-y-1 cursor-pointer"
                    >
                      <div className={`w-full h-20 rounded-xl bg-gradient-to-tr ${v.thumbnailGradient} flex items-center justify-center text-xl`}>
                        <span>{v.thumbnailEmoji}</span>
                      </div>
                      <p className="text-[10px] font-bold text-white line-clamp-2">{v.title}</p>
                      <p className="text-[9px] text-neutral-400">{v.channel}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Playlists & Saved Rows */}
              <div className="space-y-2">
                {[
                  { title: 'Liked Videos', count: `${likedVideoIds.length} videos`, icon: '👍' },
                  { title: 'Watch Later', count: `${savedVideoIds.length} videos`, icon: '⏱️' },
                  { title: 'Tech & Music Queue', count: '4 playlists', icon: '💻' }
                ].map((row) => (
                  <div
                    key={row.title}
                    className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{row.icon}</span>
                      <div>
                        <p className="font-bold text-xs text-white">{row.title}</p>
                        <p className="text-[10px] text-neutral-400">{row.count}</p>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-neutral-500 -rotate-90" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Paste YouTube URL Modal */}
      {showCustomUrlModal && (
        <div
          onClick={() => setShowCustomUrlModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs bg-neutral-900 rounded-3xl border border-neutral-800 p-4 space-y-4 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-5 rounded-md bg-red-600 flex items-center justify-center text-white">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
                <h3 className="font-bold text-sm">Watch Any Video</h3>
              </div>
              <button onClick={() => setShowCustomUrlModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLoadCustomUrl} className="space-y-3">
              <p className="text-xs text-neutral-400">
                Paste any YouTube video link or 11-character video ID:
              </p>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={customInputUrl}
                onChange={(e) => setCustomInputUrl(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-500 outline-none focus:border-red-500"
                autoFocus
              />

              {/* Quick Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Quick Presets</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: '🏖️ 4K Beach Sunset', id: 'BHACKCNDMW8' },
                    { label: '🎮 GTA 6 Trailer', id: 'QdBZY2fkU-0' },
                    { label: '📱 iPhone 16 Pro', id: 'yvNq_Cvdc84' },
                    { label: '☕ Lofi Girl Live', id: 'jfKfPfyJRdk' },
                    { label: '⚡ Fireship 100s', id: '7_LPdttKXPc' },
                    { label: '🎵 Bohemian Rhapsody', id: 'fJ9rUzIMcZQ' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setCustomInputUrl(`https://youtu.be/${preset.id}`)}
                      className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-[11px] text-left text-neutral-300 font-medium truncate"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomUrlModal(false)}
                  className="flex-1 py-2 rounded-xl bg-neutral-800 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-500 shadow-md"
                >
                  Stream Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom YouTube Tab Bar */}
      {!selectedVideo && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 flex justify-around items-center text-[10px] font-semibold text-neutral-400 z-30">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'home' ? 'text-white font-bold' : 'hover:text-white'}`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('shorts')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'shorts' ? 'text-red-500 font-bold' : 'hover:text-white'}`}
          >
            <PlaySquare className="w-4 h-4" />
            <span>Shorts</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'subscriptions' ? 'text-white font-bold' : 'hover:text-white'}`}
          >
            <Tv className="w-4 h-4" />
            <span>Subscriptions</span>
          </button>

          <button
            onClick={() => setActiveTab('you')}
            className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'you' ? 'text-white font-bold' : 'hover:text-white'}`}
          >
            <div className="w-4 h-4 rounded-full bg-indigo-600 text-[8px] font-bold flex items-center justify-center text-white">
              {state.appleId.name[0]}
            </div>
            <span>You</span>
          </button>
        </div>
      )}
    </div>
  );
};
