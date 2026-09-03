import React, { useState } from 'react';
import {
  Search,
  Download,
  Star,
  Check,
  ChevronLeft,
  Share2,
  Shield,
  Sparkles,
  Smartphone,
  ExternalLink,
  Layers,
  Gamepad2,
  Compass
} from 'lucide-react';
import { SimulatorState } from '../../../types';

interface StoreApp {
  id: string;
  name: string;
  subtitle: string;
  category: 'Social' | 'Entertainment' | 'Productivity' | 'Utilities' | 'Games' | 'Travel';
  icon: string;
  iconBg: string;
  rating: number;
  reviewsCount: string;
  developer: string;
  ageRating: string;
  sizeMB: number;
  description: string;
  screenshots: string[];
}

const STORE_CATALOG: StoreApp[] = [
  {
    id: 'chrome',
    name: 'Google Chrome',
    subtitle: 'Fast & Secure Web Browser',
    category: 'Productivity',
    icon: '🌐',
    iconBg: 'from-red-500 via-yellow-500 to-blue-500',
    rating: 4.8,
    reviewsCount: '28M',
    developer: 'Google LLC',
    ageRating: '4+',
    sizeMB: 185,
    description: 'Get the fast, secure browser that Google built. Sync bookmarks, use Gemini AI, browse in Incognito mode, and search with Google.',
    screenshots: ['Incognito Private Browsing', 'Google Search Integration', 'Multi-tab Sync']
  },
  {
    id: 'instagram',
    name: 'Instagram',
    subtitle: 'Photo & Video Sharing',
    category: 'Social',
    icon: '📸',
    iconBg: 'from-amber-500 via-rose-500 to-purple-600',
    rating: 4.7,
    reviewsCount: '24M',
    developer: 'Meta Platforms, Inc.',
    ageRating: '12+',
    sizeMB: 215,
    description: 'Bringing you closer to the people and things you love. Connect with friends, share what you are up to, and discover reels.',
    screenshots: ['Feed Stories & Posts', 'Reels Fullscreen Video', 'Direct Messaging with Photos']
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Messenger',
    subtitle: 'Simple. Reliable. Private.',
    category: 'Social',
    icon: '💬',
    iconBg: 'from-emerald-400 to-green-600',
    rating: 4.8,
    reviewsCount: '18M',
    developer: 'WhatsApp Inc.',
    ageRating: '12+',
    sizeMB: 145,
    description: 'Simple, reliable private messaging and calling across all devices. End-to-end encrypted for personal privacy.',
    screenshots: ['Private Encrypted Chats', 'HD Group Video Calling', 'Status Updates']
  },
  {
    id: 'youtube',
    name: 'YouTube: Watch, Listen, Stream',
    subtitle: 'Videos, Music & Live Streams',
    category: 'Entertainment',
    icon: '▶️',
    iconBg: 'from-red-600 to-red-700',
    rating: 4.8,
    reviewsCount: '35M',
    developer: 'Google LLC',
    ageRating: '12+',
    sizeMB: 280,
    description: 'Make watching your favorite videos easier with the YouTube app. Explore hot topics, music, gaming, news, and shorts.',
    screenshots: ['4K HDR Video Playback', 'Shorts Endless Scroll', 'PiP Picture in Picture']
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    subtitle: 'Videos, Music & LIVE',
    category: 'Entertainment',
    icon: '🎵',
    iconBg: 'from-black via-neutral-900 to-black',
    rating: 4.6,
    reviewsCount: '20M',
    developer: 'TikTok Pte. Ltd.',
    ageRating: '12+',
    sizeMB: 290,
    description: 'Discover entertaining short videos, original music, and creative content from creators worldwide.',
    screenshots: ['For You Endless Feed', 'Creative Video Effects', 'Sound Sync']
  },
  {
    id: 'spotify',
    name: 'Spotify: Music and Podcasts',
    subtitle: 'Stream songs & albums',
    category: 'Entertainment',
    icon: '🎧',
    iconBg: 'from-emerald-500 to-teal-700',
    rating: 4.8,
    reviewsCount: '30M',
    developer: 'Spotify AB',
    ageRating: '12+',
    sizeMB: 160,
    description: 'Listen to the music and podcasts you love and find songs from all over the world. Offline downloads on iOS.',
    screenshots: ['Personalized Playlists', 'Live Lyrics Karaoke', 'Dynamic Island Player']
  },
  {
    id: 'netflix',
    name: 'Netflix',
    subtitle: 'Movies & TV Series',
    category: 'Entertainment',
    icon: '🍿',
    iconBg: 'from-black to-red-950',
    rating: 4.5,
    reviewsCount: '15M',
    developer: 'Netflix, Inc.',
    ageRating: '12+',
    sizeMB: 120,
    description: 'Watch award-winning series, movies, documentaries, and stand-up specials. Download to watch offline.',
    screenshots: ['Spatial Audio Playback', 'Offline Downloads', '4K Ultra HD']
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    subtitle: 'The official AI app by OpenAI',
    category: 'Productivity',
    icon: '🤖',
    iconBg: 'from-emerald-600 to-teal-800',
    rating: 4.9,
    reviewsCount: '5M',
    developer: 'OpenAI',
    ageRating: '12+',
    sizeMB: 85,
    description: 'Get instant answers, professional advice, creative inspiration, and voice conversations directly on iOS.',
    screenshots: ['Advanced Voice Mode', 'Vision Image Analysis', 'Realtime Web Search']
  },
  {
    id: 'googlemaps',
    name: 'Google Maps',
    subtitle: 'GPS Navigation & Transit',
    category: 'Travel',
    icon: '🗺️',
    iconBg: 'from-blue-500 via-green-500 to-amber-500',
    rating: 4.8,
    reviewsCount: '19M',
    developer: 'Google LLC',
    ageRating: '4+',
    sizeMB: 195,
    description: 'Navigate your world faster and easier with Google Maps. Over 220 countries and territories mapped.',
    screenshots: ['Turn-by-Turn GPS', 'Live Traffic & Transit', 'Street View 360']
  },
  {
    id: 'uber',
    name: 'Uber - Request a ride',
    subtitle: 'Rides & Food Delivery',
    category: 'Travel',
    icon: '🚗',
    iconBg: 'from-black to-neutral-800',
    rating: 4.7,
    reviewsCount: '12M',
    developer: 'Uber Technologies, Inc.',
    ageRating: '4+',
    sizeMB: 175,
    description: 'Get a reliable ride in minutes with the Uber app. Dynamic Island live activity tracking included.',
    screenshots: ['Live Ride Tracking', 'Dynamic Island Activity', 'Safety Shield']
  },
  {
    id: 'twitter',
    name: 'X (formerly Twitter)',
    subtitle: 'Live news & conversation',
    category: 'Social',
    icon: '𝕏',
    iconBg: 'from-black to-neutral-900',
    rating: 4.4,
    reviewsCount: '14M',
    developer: 'X Corp.',
    ageRating: '17+',
    sizeMB: 190,
    description: 'The trusted global digital town square for everyone. Find breaking news, live spaces, and trending topics.',
    screenshots: ['Live Breaking News', 'Spaces Audio Rooms', 'Articles & Video']
  },
  {
    id: 'duolingo',
    name: 'Duolingo: Language Lessons',
    subtitle: 'Learn Spanish, French & More',
    category: 'Productivity',
    icon: '🦉',
    iconBg: 'from-lime-400 to-green-500',
    rating: 4.9,
    reviewsCount: '16M',
    developer: 'Duolingo',
    ageRating: '4+',
    sizeMB: 130,
    description: 'Learn a new language with the world’s most-downloaded education app. Fun, bite-sized lessons.',
    screenshots: ['Bite-Sized Lessons', 'Streak Widget', 'Interactive Stories']
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    subtitle: 'Visual Discovery & Creative Ideas',
    category: 'Social',
    icon: '📌',
    iconBg: 'from-red-600 to-rose-700',
    rating: 4.8,
    reviewsCount: '28M',
    developer: 'Pinterest, Inc.',
    ageRating: '12+',
    sizeMB: 155,
    description: 'Find creative ideas for home design, style inspirations, aesthetic iPhone wallpapers, recipes, and travel moodboards. Save what inspires you.',
    screenshots: ['Aesthetic Masonry Feed', 'Visual Search & Lens', 'Save Pins to Boards', 'Set Wallpapers Directly']
  },
  {
    id: 'roblox',
    name: 'Roblox',
    subtitle: 'Explore Virtual Worlds',
    category: 'Games',
    icon: '🎮',
    iconBg: 'from-neutral-900 to-black',
    rating: 4.5,
    reviewsCount: '22M',
    developer: 'Roblox Corporation',
    ageRating: '12+',
    sizeMB: 310,
    description: 'Roblox is the ultimate virtual universe that lets you create, share experiences with friends, and be anything.',
    screenshots: ['Millions of Experiences', 'Cross-Platform Play', 'Avatar Customizer']
  }
];

interface AppStoreAppProps {
  state: SimulatorState;
  onOpenApp?: (app: any) => void;
  onUpdateState?: (updater: (prev: SimulatorState) => SimulatorState) => void;
}

export const AppStoreApp: React.FC<AppStoreAppProps> = ({ state, onOpenApp, onUpdateState }) => {
  const [activeTab, setActiveTab] = useState<'today' | 'games' | 'apps' | 'search'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<StoreApp | null>(null);
  const [downloadingAppId, setDownloadingAppId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [installedAppIds, setInstalledAppIds] = useState<string[]>(state.installedApps || ['instagram', 'whatsapp', 'youtube', 'pinterest']);

  const handleInstall = (app: StoreApp) => {
    setDownloadingAppId(app.id);
    setDownloadProgress(15);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingAppId(null);
          setInstalledAppIds((ids) => [...ids, app.id]);
          onUpdateState?.((s) => ({
            ...s,
            installedApps: Array.from(new Set([...(s.installedApps || []), app.id]))
          }));
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const filteredApps = STORE_CATALOG.filter((app) => {
    if (!searchQuery) return true;
    return (
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} select-none font-sans relative`}>
      {/* App Detail Fullscreen Modal */}
      {selectedApp && (
        <div className={`absolute inset-0 z-40 flex flex-col pt-12 ${state.isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} animate-fade-in`}>
          <div className="px-4 pb-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setSelectedApp(null)}
              className="flex items-center gap-0.5 text-blue-500 font-semibold text-xs cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <Share2 className="w-4 h-4 text-blue-500 cursor-pointer" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Header Hero */}
            <div className="flex items-start gap-4">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${selectedApp.iconBg} flex items-center justify-center text-4xl shadow-xl shrink-0`}>
                {selectedApp.icon}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-base leading-snug">{selectedApp.name}</h2>
                <p className="text-xs text-neutral-400">{selectedApp.subtitle}</p>
                
                <div className="mt-3 flex items-center gap-3">
                  {installedAppIds.includes(selectedApp.id) ? (
                    <button
                      onClick={() => {
                        if (onOpenApp) {
                          onOpenApp(selectedApp.id);
                        }
                      }}
                      className="px-5 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-blue-500 hover:bg-blue-500 hover:text-white font-bold text-xs cursor-pointer transition-colors"
                    >
                      OPEN
                    </button>
                  ) : downloadingAppId === selectedApp.id ? (
                    <div className="px-4 py-1 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5">
                      <span>{downloadProgress}%</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleInstall(selectedApp)}
                      className="px-6 py-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-md active:scale-95 cursor-pointer"
                    >
                      GET
                    </button>
                  )}
                  <span className="text-[10px] text-neutral-400">In-App Purchases</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-4 divide-x divide-neutral-200 dark:divide-neutral-800 py-3 border-y border-neutral-200 dark:border-neutral-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 block font-semibold">RATINGS</span>
                <span className="font-bold">{selectedApp.rating} ★</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block font-semibold">AGE</span>
                <span className="font-bold">{selectedApp.ageRating}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block font-semibold">CATEGORY</span>
                <span className="font-bold truncate px-1">{selectedApp.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block font-semibold">SIZE</span>
                <span className="font-bold">{selectedApp.sizeMB} MB</span>
              </div>
            </div>

            {/* Screenshots Carousel */}
            <div className="space-y-1.5">
              <span className="font-bold text-xs">Preview</span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {selectedApp.screenshots.map((s, idx) => (
                  <div
                    key={idx}
                    className="w-36 h-60 rounded-2xl bg-neutral-100 dark:bg-neutral-850 p-3 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shrink-0"
                  >
                    <span className="text-2xl">{selectedApp.icon}</span>
                    <p className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300">{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="font-bold text-xs">Description</span>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {selectedApp.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main App Store Navigation Header */}
      <div className="pt-14 pb-2 px-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold">App Store</h1>
          <p className="text-[10px] text-neutral-400">iOS & iPhone Apps Catalog</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
          {state.appleId.name[0]}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TODAY TAB */}
        {activeTab === 'today' && (
          <div className="space-y-4">
            {/* Featured Story Card */}
            <div
              onClick={() => setSelectedApp(STORE_CATALOG[0])}
              className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white p-5 space-y-3 shadow-xl cursor-pointer hover:scale-[1.01] transition-transform"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                App of the Day
              </span>
              <h2 className="text-2xl font-black leading-tight">Create & Connect</h2>
              <p className="text-xs text-purple-100">
                Instagram and WhatsApp bring rich messaging, real-time photos, and stories straight to your iOS home screen.
              </p>
            </div>

            {/* Top Recommended Apps List */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm">Essential iPhone Apps</h3>
              <div className="space-y-2.5">
                {STORE_CATALOG.slice(0, 6).map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-3 rounded-2xl flex items-center justify-between border cursor-pointer hover:opacity-90 ${
                      state.isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.iconBg} flex items-center justify-center text-2xl shadow-xs shrink-0`}>
                        {app.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs truncate max-w-[130px]">{app.name}</p>
                        <p className="text-[10px] text-neutral-400 truncate max-w-[130px]">{app.subtitle}</p>
                        <span className="text-[9px] text-amber-500 font-semibold">{app.rating} ★ ({app.reviewsCount})</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!installedAppIds.includes(app.id)) handleInstall(app);
                      }}
                      className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        installedAppIds.includes(app.id)
                          ? 'bg-neutral-200 dark:bg-neutral-800 text-blue-500'
                          : downloadingAppId === app.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                      }`}
                    >
                      {installedAppIds.includes(app.id)
                        ? 'OPEN'
                        : downloadingAppId === app.id
                        ? `${downloadProgress}%`
                        : 'GET'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GAMES TAB */}
        {activeTab === 'games' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold">Top Games</h2>
            {STORE_CATALOG.filter((a) => a.category === 'Games' || a.id === 'roblox' || a.id === 'tiktok').map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`p-3 rounded-2xl flex items-center justify-between border cursor-pointer ${
                  state.isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.iconBg} flex items-center justify-center text-2xl`}>
                    {app.icon}
                  </div>
                  <div>
                    <p className="font-bold text-xs">{app.name}</p>
                    <p className="text-[10px] text-neutral-400">{app.category}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!installedAppIds.includes(app.id)) handleInstall(app);
                  }}
                  className="px-4 py-1 rounded-full bg-blue-500 text-white text-xs font-bold"
                >
                  {installedAppIds.includes(app.id) ? 'OPEN' : 'GET'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* APPS & CATEGORIES TAB */}
        {activeTab === 'apps' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold">Top Categories</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: 'Social Networking', icon: '💬', count: '45+ Apps' },
                { name: 'Photo & Video', icon: '📸', count: '60+ Apps' },
                { name: 'Entertainment', icon: '🍿', count: '80+ Apps' },
                { name: 'Productivity & AI', icon: '🤖', count: '50+ Apps' },
                { name: 'Travel & Navigation', icon: '🗺️', count: '30+ Apps' },
                { name: 'Education', icon: '🦉', count: '40+ Apps' }
              ].map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => {
                    setSearchQuery(cat.name.split(' ')[0]);
                    setActiveTab('search');
                  }}
                  className={`p-3 rounded-2xl border space-y-1 cursor-pointer hover:border-blue-500 ${
                    state.isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <p className="font-bold text-xs">{cat.name}</p>
                  <p className="text-[10px] text-neutral-400">{cat.count}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <div className="space-y-3">
            {/* Search Input */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl border ${
              state.isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-black'
            }`}>
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search Games, Apps, Stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-transparent outline-none font-medium"
              />
            </div>

            {/* Results */}
            <div className="space-y-2 pt-1">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-3 rounded-2xl flex items-center justify-between border cursor-pointer hover:opacity-90 ${
                    state.isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.iconBg} flex items-center justify-center text-2xl shrink-0`}>
                      {app.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs truncate max-w-[130px]">{app.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate max-w-[130px]">{app.subtitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!installedAppIds.includes(app.id)) handleInstall(app);
                    }}
                    className={`px-4 py-1 rounded-full text-xs font-bold cursor-pointer ${
                      installedAppIds.includes(app.id) ? 'bg-neutral-200 dark:bg-neutral-800 text-blue-500' : 'bg-blue-500 text-white'
                    }`}
                  >
                    {installedAppIds.includes(app.id) ? 'OPEN' : 'GET'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Store Tabs */}
      <div className={`pt-2 pb-3 px-4 border-t flex justify-around text-[10px] font-semibold ${
        state.isDarkMode ? 'border-neutral-800 bg-neutral-900/90 text-neutral-400' : 'border-neutral-200 bg-neutral-50/90 text-neutral-500'
      }`}>
        <button
          onClick={() => setActiveTab('today')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'today' ? 'text-blue-500 font-bold' : ''}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Today</span>
        </button>
        <button
          onClick={() => setActiveTab('games')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'games' ? 'text-blue-500 font-bold' : ''}`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Games</span>
        </button>
        <button
          onClick={() => setActiveTab('apps')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'apps' ? 'text-blue-500 font-bold' : ''}`}
        >
          <Layers className="w-4 h-4" />
          <span>Apps</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'search' ? 'text-blue-500 font-bold' : ''}`}
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};
