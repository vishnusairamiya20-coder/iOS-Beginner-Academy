import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Globe,
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  ShieldCheck,
  Star,
  Bookmark,
  Sparkles,
  ExternalLink,
  Lock,
  Layers,
  Compass,
  Mic,
  Camera,
  MoreHorizontal,
  Share2,
  History as HistoryIcon,
  Trash2,
  Settings as SettingsIcon,
  Check,
  Copy,
  ThumbsUp,
  MessageSquare,
  Send,
  Languages,
  FileText,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Code2,
  GitFork,
  QrCode,
  ScanLine,
  Sliders,
  Volume2,
  Laptop
} from 'lucide-react';
import { SimulatorState, IosAppId } from '../../../types';
import { playCameraControlLightPress, playCameraControlScrubTick } from '../../../utils/audioUtils';

export interface ChromeAppProps {
  state: SimulatorState;
  onUpdateState?: React.Dispatch<React.SetStateAction<SimulatorState>>;
  onOpenApp?: (appId: IosAppId) => void;
  onClose?: () => void;
}

interface ChromeTab {
  id: string;
  url: string;
  title: string;
  history: string[];
  historyIndex: number;
  isIncognito: boolean;
  query?: string;
}

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
}

interface HistoryItem {
  id: string;
  title: string;
  url: string;
  time: string;
}

interface DiscoverArticle {
  id: string;
  title: string;
  publisher: string;
  time: string;
  category: string;
  url: string;
  likes: number;
  image: string;
}

const DEFAULT_BOOKMARKS: BookmarkItem[] = [
  { id: 'b1', title: 'Google', url: 'google.com', icon: '🔍' },
  { id: 'b2', title: 'Google AI Studio', url: 'ai.google.dev', icon: '✨' },
  { id: 'b3', title: 'GitHub', url: 'github.com', icon: '🐙' },
  { id: 'b4', title: 'Wikipedia', url: 'wikipedia.org', icon: '📖' },
  { id: 'b5', title: 'The Verge', url: 'theverge.com', icon: '⚡' },
  { id: 'b6', title: 'Apple', url: 'apple.com', icon: '🍎' }
];

const DISCOVER_ARTICLES: DiscoverArticle[] = [
  {
    id: 'd1',
    title: 'Google DeepMind Unveils Next-Gen Multimodal Architecture for Mobile Intelligence',
    publisher: 'Wired',
    time: '2h ago',
    category: 'Artificial Intelligence',
    url: 'ai.google.dev',
    likes: 1420,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'd2',
    title: 'iOS 18 Deep Dive: How the New Modular Dynamic Island Changes App Interactions',
    publisher: 'The Verge',
    time: '4h ago',
    category: 'Mobile Tech',
    url: 'theverge.com',
    likes: 980,
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'd3',
    title: 'NASA James Webb Space Telescope Captures Cosmic Ring 12 Billion Light-Years Away',
    publisher: 'MIT Tech Review',
    time: '6h ago',
    category: 'Space Science',
    url: 'wikipedia.org',
    likes: 2150,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80'
  }
];

export const ChromeApp: React.FC<ChromeAppProps> = ({
  state,
  onUpdateState,
  onOpenApp,
  onClose
}) => {
  // Tabs State
  const [tabs, setTabs] = useState<ChromeTab[]>([
    {
      id: 'tab-1',
      url: 'google.com',
      title: 'Google',
      history: ['google.com'],
      historyIndex: 0,
      isIncognito: false
    },
    {
      id: 'tab-2',
      url: 'ai.google.dev',
      title: 'Google AI Studio & Gemini',
      history: ['ai.google.dev'],
      historyIndex: 0,
      isIncognito: false
    }
  ]);

  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [isIncognitoMode, setIsIncognitoMode] = useState<boolean>(false);
  const [isTabsView, setIsTabsView] = useState<boolean>(false);

  // Omnibox State
  const [inputUrl, setInputUrl] = useState<string>('google.com');
  const [isOmniboxFocused, setIsOmniboxFocused] = useState<boolean>(false);
  const [isReloading, setIsReloading] = useState<boolean>(false);

  // Bookmarks & History
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(DEFAULT_BOOKMARKS);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([
    { id: 'h1', title: 'Google Search', url: 'google.com', time: 'Just now' },
    { id: 'h2', title: 'Google AI Studio', url: 'ai.google.dev', time: '10m ago' },
    { id: 'h3', title: 'GitHub: Where the world builds software', url: 'github.com', time: '1h ago' },
    { id: 'h4', title: 'Wikipedia, the Free Encyclopedia', url: 'wikipedia.org', time: '3h ago' }
  ]);

  // Modals & Tools
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<
    null | 'bookmarks' | 'history' | 'settings' | 'share' | 'voice' | 'lens' | 'find'
  >(null);

  // In-Page Interactive States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDesktopSite, setIsDesktopSite] = useState<boolean>(false);
  const [findQuery, setFindQuery] = useState<string>('');
  const [translateBannerVisible, setTranslateBannerVisible] = useState<boolean>(false);
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({});

  // Specialized App States
  // 1. Gemini Playground State
  const [geminiPrompt, setGeminiPrompt] = useState<string>('');
  const [geminiMessages, setGeminiMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    {
      role: 'model',
      text: 'Hello! I am Gemini 2.0 Flash inside Google Chrome. You can test prompts, generate ideas, or ask coding questions directly here.'
    }
  ]);
  const [isGeminiGenerating, setIsGeminiGenerating] = useState<boolean>(false);

  // 2. GitHub Star State
  const [githubStarred, setGithubStarred] = useState<boolean>(false);
  const [selectedGithubFile, setSelectedGithubFile] = useState<string | null>('README.md');

  // 3. Reddit votes
  const [redditScores, setRedditScores] = useState<Record<string, number>>({ post1: 342, post2: 891 });
  const [userVotes, setUserVotes] = useState<Record<string, 1 | -1 | 0>>({});

  // Active Tab Resolution
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0] || {
    id: 'tab-default',
    url: 'google.com',
    title: 'Google',
    history: ['google.com'],
    historyIndex: 0,
    isIncognito: false
  };

  // Sync Omnibox input with active tab URL
  useEffect(() => {
    if (!isOmniboxFocused) {
      setInputUrl(activeTab.url);
    }
  }, [activeTab.url, isOmniboxFocused]);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Sound helper
  const triggerHaptic = () => {
    try {
      playCameraControlLightPress();
    } catch {
      // fallback silent
    }
  };

  // Navigate to URL or Search
  const handleNavigate = (rawInput: string) => {
    triggerHaptic();
    const clean = rawInput.trim();
    if (!clean) return;

    let finalUrl = clean;
    let pageTitle = clean;
    let searchQuery = '';

    // Check if it's a URL or search query
    const isDomainLike = clean.includes('.') && !clean.includes(' ') && !clean.startsWith('?');
    const isFullUrl = clean.startsWith('http://') || clean.startsWith('https://');

    if (clean.toLowerCase() === 'google' || clean.toLowerCase() === 'google.com') {
      finalUrl = 'google.com';
      pageTitle = 'Google';
    } else if (clean.toLowerCase().includes('ai.google.dev') || clean.toLowerCase() === 'gemini') {
      finalUrl = 'ai.google.dev';
      pageTitle = 'Google AI Studio & Gemini';
    } else if (clean.toLowerCase().includes('github.com') || clean.toLowerCase() === 'github') {
      finalUrl = 'github.com';
      pageTitle = 'GitHub: Where the world builds software';
    } else if (clean.toLowerCase().includes('wikipedia.org') || clean.toLowerCase().startsWith('wiki ')) {
      finalUrl = 'wikipedia.org';
      searchQuery = clean.replace(/^wiki\s*/i, '');
      pageTitle = searchQuery ? `${searchQuery} — Wikipedia` : 'Wikipedia, the Free Encyclopedia';
    } else if (clean.toLowerCase().includes('theverge.com') || clean.toLowerCase() === 'verge') {
      finalUrl = 'theverge.com';
      pageTitle = 'The Verge: Tech, Science, Culture';
    } else if (clean.toLowerCase().includes('reddit.com') || clean.toLowerCase() === 'reddit') {
      finalUrl = 'reddit.com';
      pageTitle = 'Reddit: Dive into anything';
    } else if (clean.toLowerCase().includes('apple.com') || clean.toLowerCase() === 'apple') {
      finalUrl = 'apple.com';
      pageTitle = 'Apple Official';
    } else if (isDomainLike || isFullUrl) {
      finalUrl = clean.replace(/^https?:\/\//i, '');
      pageTitle = finalUrl.charAt(0).toUpperCase() + finalUrl.slice(1);
    } else {
      // Google Search
      searchQuery = clean;
      finalUrl = `google.com/search?q=${encodeURIComponent(clean)}`;
      pageTitle = `${clean} - Google Search`;
    }

    // Update Tab History
    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === activeTab.id) {
          const newHistory = tab.history.slice(0, tab.historyIndex + 1);
          newHistory.push(finalUrl);
          return {
            ...tab,
            url: finalUrl,
            title: pageTitle,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            query: searchQuery
          };
        }
        return tab;
      })
    );

    // Record History (unless incognito)
    if (!activeTab.isIncognito) {
      setHistoryList((prev) => [
        {
          id: Date.now().toString(),
          title: pageTitle,
          url: finalUrl,
          time: 'Just now'
        },
        ...prev.slice(0, 29)
      ]);
    }

    setInputUrl(finalUrl);
    setIsOmniboxFocused(false);
    setIsMenuOpen(false);
    setActiveModal(null);
  };

  // Back Navigation
  const handleGoBack = () => {
    if (activeTab.historyIndex > 0) {
      triggerHaptic();
      const nextIndex = activeTab.historyIndex - 1;
      const targetUrl = activeTab.history[nextIndex];
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTab.id ? { ...t, url: targetUrl, historyIndex: nextIndex } : t
        )
      );
      setInputUrl(targetUrl);
    }
  };

  // Forward Navigation
  const handleGoForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      triggerHaptic();
      const nextIndex = activeTab.historyIndex + 1;
      const targetUrl = activeTab.history[nextIndex];
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTab.id ? { ...t, url: targetUrl, historyIndex: nextIndex } : t
        )
      );
      setInputUrl(targetUrl);
    }
  };

  // Reload Active Page
  const handleReload = () => {
    triggerHaptic();
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
      showToast('Page refreshed');
    }, 600);
  };

  // Create New Tab
  const handleNewTab = (incognito = isIncognitoMode) => {
    triggerHaptic();
    const newId = `tab-${Date.now()}`;
    const newTab: ChromeTab = {
      id: newId,
      url: incognito ? 'chrome://incognito' : 'google.com',
      title: incognito ? 'Incognito Tab' : 'Google',
      history: [incognito ? 'chrome://incognito' : 'google.com'],
      historyIndex: 0,
      isIncognito: incognito
    };

    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setInputUrl(newTab.url);
    setIsTabsView(false);
    setIsMenuOpen(false);
  };

  // Close Specific Tab
  const handleCloseTab = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    triggerHaptic();
    if (tabs.length === 1) {
      // Reset single tab to google.com
      setTabs([
        {
          id: 'tab-1',
          url: 'google.com',
          title: 'Google',
          history: ['google.com'],
          historyIndex: 0,
          isIncognito: false
        }
      ]);
      setActiveTabId('tab-1');
      setInputUrl('google.com');
      return;
    }

    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      const nextActive = remaining[remaining.length - 1];
      setActiveTabId(nextActive.id);
      setInputUrl(nextActive.url);
    }
  };

  // Close All Tabs
  const handleCloseAllTabs = () => {
    triggerHaptic();
    const freshTab: ChromeTab = {
      id: `tab-${Date.now()}`,
      url: 'google.com',
      title: 'Google',
      history: ['google.com'],
      historyIndex: 0,
      isIncognito: false
    };
    setTabs([freshTab]);
    setActiveTabId(freshTab.id);
    setInputUrl('google.com');
    setIsTabsView(false);
    showToast('All tabs closed');
  };

  // Bookmark Toggle
  const isCurrentBookmarked = bookmarks.some((b) => b.url === activeTab.url);
  const handleToggleBookmark = () => {
    triggerHaptic();
    if (isCurrentBookmarked) {
      setBookmarks(bookmarks.filter((b) => b.url !== activeTab.url));
      showToast('Removed from Bookmarks');
    } else {
      const newBm: BookmarkItem = {
        id: Date.now().toString(),
        title: activeTab.title || activeTab.url,
        url: activeTab.url,
        icon: '⭐'
      };
      setBookmarks([...bookmarks, newBm]);
      showToast('Saved to Bookmarks');
    }
  };

  // Gemini Simulated Interactive Chat
  const handleSendGeminiPrompt = () => {
    if (!geminiPrompt.trim() || isGeminiGenerating) return;
    triggerHaptic();
    const userMsg = geminiPrompt.trim();
    setGeminiMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setGeminiPrompt('');
    setIsGeminiGenerating(true);

    setTimeout(() => {
      let botReply = `Here is the analysis for "${userMsg}":\n\n1. **Core Concept**: Gemini 2.0 Flash is designed for sub-second latency and high fidelity multimodal reasoning.\n2. **Practical Solution**: You can integrate this with the official @google/genai SDK using your server-side endpoints.\n3. **Key Advantage**: Efficient context caching and real-time streaming provide optimal user experience in iOS simulators.`;

      if (userMsg.toLowerCase().includes('code') || userMsg.toLowerCase().includes('python')) {
        botReply = `Here is the requested code snippet:\n\`\`\`python\nimport os\nfrom google import genai\n\nclient = genai.Client(api_key=os.environ["GEMINI_API_KEY"])\nresponse = client.models.generate_content(\n    model="gemini-2.5-flash",\n    contents="${userMsg}",\n)\nprint(response.text)\n\`\`\``;
      } else if (userMsg.toLowerCase().includes('weather')) {
        botReply = `Based on live atmospheric telemetry, it's currently 72°F (22°C) with pleasant sunny skies and 12 mph breeze. Ideal conditions for outdoor activities!`;
      }

      setGeminiMessages((prev) => [...prev, { role: 'model', text: botReply }]);
      setIsGeminiGenerating(false);
    }, 900);
  };

  // Reddit Upvote/Downvote
  const handleRedditVote = (postId: string, delta: 1 | -1) => {
    triggerHaptic();
    setUserVotes((prev) => {
      const current = prev[postId] || 0;
      const nextVote = current === delta ? 0 : delta;
      const scoreDiff = nextVote - current;
      setRedditScores((scores) => ({
        ...scores,
        [postId]: (scores[postId] || 0) + scoreDiff
      }));
      return { ...prev, [postId]: nextVote as 1 | -1 | 0 };
    });
  };

  // Theme Helpers
  const isIncognito = activeTab.isIncognito;
  const isDark = isIncognito || state.isDarkMode;

  // Render Tabs Grid Overlay
  if (isTabsView) {
    const regularTabs = tabs.filter((t) => !t.isIncognito);
    const incognitoTabs = tabs.filter((t) => t.isIncognito);
    const displayedTabs = isIncognitoMode ? incognitoTabs : regularTabs;

    return (
      <div className="h-full flex flex-col bg-neutral-950 text-white font-sans select-none overflow-hidden animate-fade-in">
        {/* Top Control Bar */}
        <div className="pt-12 px-4 pb-3 border-b border-neutral-800 flex items-center justify-between">
          <button
            onClick={handleCloseAllTabs}
            className="text-xs font-semibold text-red-400 hover:text-red-300"
          >
            Close All
          </button>

          {/* Segmented Controller: Regular vs Incognito */}
          <div className="flex bg-neutral-800 p-0.5 rounded-xl text-xs">
            <button
              onClick={() => {
                triggerHaptic();
                setIsIncognitoMode(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                !isIncognitoMode ? 'bg-neutral-700 text-white shadow' : 'text-neutral-400'
              }`}
            >
              Tabs ({regularTabs.length})
            </button>
            <button
              onClick={() => {
                triggerHaptic();
                setIsIncognitoMode(true);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                isIncognitoMode ? 'bg-purple-700 text-white shadow' : 'text-neutral-400'
              }`}
            >
              <span>🕶️</span>
              <span>Incognito ({incognitoTabs.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              triggerHaptic();
              setIsTabsView(false);
            }}
            className="text-xs font-bold text-blue-400 hover:text-blue-300"
          >
            Done
          </button>
        </div>

        {/* Tabs Grid View */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3.5">
          {displayedTabs.map((tab) => {
            const isActive = tab.id === activeTab.id;
            return (
              <div
                key={tab.id}
                onClick={() => {
                  triggerHaptic();
                  setActiveTabId(tab.id);
                  setInputUrl(tab.url);
                  setIsTabsView(false);
                }}
                className={`aspect-[3/4] rounded-2xl p-3 flex flex-col justify-between border relative cursor-pointer shadow-xl transition-all ${
                  isActive
                    ? 'border-blue-500 ring-2 ring-blue-500/40 bg-neutral-850'
                    : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs">{tab.isIncognito ? '🕶️' : '🌐'}</span>
                    <span className="text-[11px] font-semibold truncate text-neutral-200">
                      {tab.title}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tab Preview Icon / Artwork */}
                <div className="flex-1 flex flex-col items-center justify-center text-3xl opacity-80">
                  {tab.url.includes('ai.google.dev')
                    ? '✨'
                    : tab.url.includes('github')
                    ? '🐙'
                    : tab.url.includes('wikipedia')
                    ? '📖'
                    : tab.url.includes('verge')
                    ? '⚡'
                    : tab.url.includes('reddit')
                    ? '🤖'
                    : tab.isIncognito
                    ? '🕶️'
                    : '🔍'}
                </div>

                <div className="pt-2 border-t border-neutral-800/80">
                  <span className="text-[10px] text-neutral-400 truncate block font-mono">
                    {tab.url}
                  </span>
                </div>
              </div>
            );
          })}

          {displayedTabs.length === 0 && (
            <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center text-neutral-500">
              <span className="text-4xl mb-2">{isIncognitoMode ? '🕶️' : '📑'}</span>
              <p className="text-xs font-semibold">No open {isIncognitoMode ? 'incognito' : ''} tabs</p>
              <button
                onClick={() => handleNewTab(isIncognitoMode)}
                className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Open New Tab
              </button>
            </div>
          )}
        </div>

        {/* Bottom Tab Bar */}
        <div className="p-3 border-t border-neutral-800 flex items-center justify-between bg-neutral-900">
          <button
            onClick={() => handleNewTab(isIncognitoMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New {isIncognitoMode ? 'Incognito ' : ''}Tab</span>
          </button>
          <span className="text-[11px] text-neutral-400 font-mono">
            {tabs.length} open {tabs.length === 1 ? 'tab' : 'tabs'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-full flex flex-col font-sans select-none relative overflow-hidden transition-colors ${
        isIncognito
          ? 'bg-[#202124] text-neutral-100'
          : isDark
          ? 'bg-neutral-950 text-neutral-100'
          : 'bg-[#F8F9FA] text-neutral-900'
      }`}
    >
      {/* TOAST POPUP */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-neutral-900/90 text-white text-xs font-medium backdrop-blur-md shadow-2xl border border-white/10 animate-fade-in flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP OMNIBOX (ADDRESS BAR) */}
      <div
        className={`pt-12 px-3 pb-2.5 border-b relative z-30 ${
          isIncognito
            ? 'bg-[#202124] border-neutral-800'
            : isDark
            ? 'bg-neutral-900 border-neutral-800'
            : 'bg-white border-neutral-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Main Omnibox Pill */}
          <div
            className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
              isOmniboxFocused
                ? 'ring-2 ring-blue-500 border-blue-500'
                : isIncognito
                ? 'bg-neutral-800 border-neutral-700 text-neutral-100'
                : isDark
                ? 'bg-neutral-800 border-neutral-700 text-white'
                : 'bg-neutral-100 border-neutral-300 text-neutral-900'
            }`}
          >
            {activeTab.url.includes('chrome://') ? (
              <span className="text-xs">🕶️</span>
            ) : activeTab.url.startsWith('https://') || !activeTab.url.includes('search?q=') ? (
              <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            )}

            <input
              type="text"
              value={inputUrl}
              onFocus={() => {
                setIsOmniboxFocused(true);
                setInputUrl(activeTab.url === 'google.com' ? '' : activeTab.url);
              }}
              onBlur={() => {
                // Short delay to allow clicking suggestions
                setTimeout(() => setIsOmniboxFocused(false), 200);
              }}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNavigate(inputUrl);
                }
              }}
              placeholder="Search or enter website"
              className="flex-1 bg-transparent text-xs focus:outline-none truncate font-medium placeholder:text-neutral-400"
            />

            {inputUrl && isOmniboxFocused && (
              <button
                onClick={() => setInputUrl('')}
                className="p-0.5 text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {!isOmniboxFocused && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleToggleBookmark}
                  className="p-1 text-neutral-400 hover:text-amber-400 transition-colors"
                  title="Bookmark page"
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      isCurrentBookmarked ? 'text-amber-400 fill-amber-400' : ''
                    }`}
                  />
                </button>
                <button
                  onClick={() => setActiveModal('voice')}
                  className="p-1 text-neutral-400 hover:text-blue-500 transition-colors"
                  title="Voice Search"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveModal('lens')}
                  className="p-1 text-neutral-400 hover:text-blue-500 transition-colors"
                  title="Google Lens / QR Scanner"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Tab Count Switcher Button */}
          <button
            onClick={() => {
              triggerHaptic();
              setIsTabsView(true);
            }}
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border transition-transform active:scale-95 ${
              isIncognito
                ? 'bg-neutral-800 border-neutral-700 text-purple-300'
                : isDark
                ? 'bg-neutral-800 border-neutral-700 text-white'
                : 'bg-neutral-100 border-neutral-300 text-neutral-800 shadow-sm'
            }`}
          >
            {tabs.length}
          </button>

          {/* Three-Dots Menu Button */}
          <button
            onClick={() => {
              triggerHaptic();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${
              isMenuOpen
                ? 'bg-blue-600 text-white border-blue-500'
                : isIncognito
                ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
                : isDark
                ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
                : 'bg-neutral-100 border-neutral-300 text-neutral-700'
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Omnibox Search Predictions & Suggestions Dropdown */}
        {isOmniboxFocused && (
          <div
            className={`absolute left-3 right-3 top-full mt-1.5 rounded-2xl border shadow-2xl overflow-hidden z-50 animate-fade-in ${
              isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-200'
            }`}
          >
            <div className="p-2 divide-y divide-neutral-800/40 text-xs">
              {inputUrl.trim() && (
                <div
                  onMouseDown={() => handleNavigate(inputUrl)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer font-semibold ${
                    isDark ? 'hover:bg-neutral-800 text-blue-400' : 'hover:bg-neutral-100 text-blue-600'
                  }`}
                >
                  <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="truncate">Search Google for "{inputUrl}"</span>
                </div>
              )}

              {/* Quick Sites suggestions */}
              <div className="py-1">
                {[
                  { title: 'Google AI Studio', url: 'ai.google.dev', icon: '✨' },
                  { title: 'GitHub', url: 'github.com', icon: '🐙' },
                  { title: 'The Verge', url: 'theverge.com', icon: '⚡' },
                  { title: 'Wikipedia', url: 'wikipedia.org', icon: '📖' },
                  { title: 'Apple Official', url: 'apple.com', icon: '🍎' }
                ]
                  .filter(
                    (s) =>
                      !inputUrl ||
                      s.title.toLowerCase().includes(inputUrl.toLowerCase()) ||
                      s.url.toLowerCase().includes(inputUrl.toLowerCase())
                  )
                  .map((site, idx) => (
                    <div
                      key={idx}
                      onMouseDown={() => handleNavigate(site.url)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer ${
                        isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{site.icon}</span>
                        <div>
                          <p className="font-semibold">{site.title}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">{site.url}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WEB VIEW CONTENT AREA */}
      <div className="flex-1 overflow-y-auto relative flex flex-col">
        {/* Reloading Bar */}
        {isReloading && (
          <div className="h-0.5 bg-blue-500 w-full animate-pulse shrink-0" />
        )}

        {/* 1. INCOGNITO LANDING PAGE */}
        {activeTab.isIncognito && activeTab.url === 'chrome://incognito' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-3xl mb-4 shadow-xl">
              🕶️
            </div>
            <h1 className="text-xl font-bold mb-2 text-white">You've gone Incognito</h1>
            <p className="text-xs text-neutral-300 leading-relaxed mb-6">
              Now you can browse privately. Other people who use this device won’t see your activity. However, downloads and bookmarks will be saved.
            </p>

            <div className="w-full bg-neutral-850 p-4 rounded-2xl border border-neutral-700/60 text-left text-xs space-y-2 mb-6 text-neutral-300">
              <p className="font-semibold text-neutral-200">Chrome won't save:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-400">
                <li>Your browsing history</li>
                <li>Cookies and site data</li>
                <li>Information entered in forms</li>
              </ul>
            </div>

            <button
              onClick={() => handleNavigate('google.com')}
              className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg transition-colors"
            >
              Start Searching in Incognito
            </button>
          </div>
        )}

        {/* 2. GOOGLE NEW TAB / HOME PAGE */}
        {(!activeTab.isIncognito || activeTab.url !== 'chrome://incognito') &&
          (activeTab.url === 'google.com' || activeTab.url === 'chrome://newtab') && (
            <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full">
              {/* Google Header Logo */}
              <div className="flex flex-col items-center pt-8 pb-6">
                <div className="flex items-center gap-1 text-4xl font-extrabold tracking-tight">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </div>
                <span className="text-[10px] text-neutral-400 tracking-wider uppercase font-semibold mt-1">
                  Chrome Mobile Edition
                </span>
              </div>

              {/* Centered Search Pill */}
              <div
                onClick={() => {
                  triggerHaptic();
                  setIsOmniboxFocused(true);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full border shadow-md cursor-pointer mb-8 transition-transform active:scale-[0.99] ${
                  isDark
                    ? 'bg-neutral-850 border-neutral-700 hover:border-neutral-600'
                    : 'bg-white border-neutral-300 hover:shadow-lg'
                }`}
              >
                <Search className="w-4 h-4 text-neutral-400" />
                <span className="flex-1 text-xs text-neutral-400 font-medium">
                  Search or type URL
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModal('voice');
                  }}
                  className="p-1 text-neutral-400 hover:text-blue-500"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModal('lens');
                  }}
                  className="p-1 text-neutral-400 hover:text-blue-500"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Shortcuts Grid */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { name: 'AI Studio', url: 'ai.google.dev', icon: '✨', bg: 'bg-gradient-to-tr from-indigo-600 to-purple-600' },
                  { name: 'YouTube', url: 'youtube.com', icon: '▶️', bg: 'bg-red-600' },
                  { name: 'Wikipedia', url: 'wikipedia.org', icon: '📖', bg: 'bg-neutral-800' },
                  { name: 'GitHub', url: 'github.com', icon: '🐙', bg: 'bg-neutral-900' },
                  { name: 'The Verge', url: 'theverge.com', icon: '⚡', bg: 'bg-violet-700' },
                  { name: 'Reddit', url: 'reddit.com', icon: '🤖', bg: 'bg-orange-600' },
                  { name: 'Apple', url: 'apple.com', icon: '🍎', bg: 'bg-neutral-700' },
                  { name: 'Weather', url: 'google.com/search?q=weather+today', icon: '☀️', bg: 'bg-sky-600' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleNavigate(item.url)}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer transition-transform active:scale-95"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center text-xl text-white shadow-md group-hover:scale-105 transition-transform`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-medium truncate max-w-[64px] text-neutral-600 dark:text-neutral-300">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Discover News Feed */}
              <div className="w-full">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Compass className="w-3.5 h-3.5 text-blue-500" />
                    <span>Discover</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">Personalized</span>
                </div>

                <div className="space-y-4 pb-6">
                  {DISCOVER_ARTICLES.map((article) => {
                    const isLiked = likedArticles[article.id];
                    return (
                      <div
                        key={article.id}
                        onClick={() => handleNavigate(article.url)}
                        className={`rounded-2xl border overflow-hidden shadow-sm cursor-pointer transition-transform hover:scale-[1.01] ${
                          isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
                        }`}
                      >
                        <img
                          src={article.image}
                          alt={article.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-36 object-cover"
                        />
                        <div className="p-3.5">
                          <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1.5">
                            <span className="font-semibold text-blue-500">{article.publisher}</span>
                            <span>{article.time} • {article.category}</span>
                          </div>
                          <h3 className="text-xs font-bold leading-snug line-clamp-2 mb-2.5">
                            {article.title}
                          </h3>
                          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerHaptic();
                                setLikedArticles((prev) => ({ ...prev, [article.id]: !isLiked }));
                              }}
                              className={`flex items-center gap-1 hover:text-red-500 ${
                                isLiked ? 'text-red-500 font-bold' : ''
                              }`}
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500' : ''}`} />
                              <span>{article.likes + (isLiked ? 1 : 0)}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveModal('share');
                              }}
                              className="p-1 hover:text-blue-500"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        {/* 3. DYNAMIC GOOGLE SEARCH RESULTS PAGE */}
        {activeTab.url.includes('google.com/search') && (
          <div className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4 space-y-4">
            {/* Search Tabs (All, Images, News, etc.) */}
            <div className="flex items-center gap-4 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-neutral-800 text-xs font-medium">
              <span className="text-blue-500 border-b-2 border-blue-500 pb-1 font-bold">All</span>
              <span className="text-neutral-400 hover:text-neutral-200 cursor-pointer">Images</span>
              <span className="text-neutral-400 hover:text-neutral-200 cursor-pointer">News</span>
              <span className="text-neutral-400 hover:text-neutral-200 cursor-pointer">Videos</span>
              <span className="text-neutral-400 hover:text-neutral-200 cursor-pointer">Shopping</span>
            </div>

            {/* AI Overview Box (Gemini powered) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-purple-950/40 to-indigo-950/40 border border-blue-500/30 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI Overview</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                  Gemini
                </span>
              </div>
              <p className="text-xs leading-relaxed text-neutral-200">
                {activeTab.query
                  ? `Here is the comprehensive overview for "${activeTab.query}". High-relevance sources indicate strong developer adoption, optimized performance frameworks, and native iOS architectural support.`
                  : 'Google Search synthesizes high-accuracy intelligence across verified web indexes and developer knowledge graphs.'}
              </p>
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={() => handleNavigate('ai.google.dev')}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white font-medium"
                >
                  Explore in AI Studio
                </button>
                <span className="text-[10px] text-neutral-400">3 verified sources</span>
              </div>
            </div>

            {/* Quick Math Result if Query Has Math */}
            {activeTab.query && /^[0-9+\-*/. ()]+$/.test(activeTab.query) && (
              <div className="p-4 rounded-2xl bg-neutral-850 border border-neutral-700 shadow-md">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Calculator Result</span>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {(() => {
                    try {
                      // eslint-disable-next-line no-eval
                      return Function(`'use strict'; return (${activeTab.query})`)();
                    } catch {
                      return 'Error';
                    }
                  })()}
                </p>
              </div>
            )}

            {/* Organic Search Results */}
            <div className="space-y-4">
              {[
                {
                  title: `${activeTab.query || 'Technology'} — Official Documentation & Overview`,
                  url: 'ai.google.dev',
                  snippet: `Find guides, reference documentation, and API keys for ${activeTab.query || 'modern software'}. Accelerate prototyping with Google AI Studio.`
                },
                {
                  title: `${activeTab.query || 'Open Source Project'} on GitHub`,
                  url: 'github.com',
                  snippet: `Browse open source repositories, source code implementations, releases, and issue trackers related to ${activeTab.query || 'development'}.`
                },
                {
                  title: `${activeTab.query || 'Encyclopedia'} — Wikipedia`,
                  url: 'wikipedia.org',
                  snippet: `Free collaborative encyclopedia article detailing history, technical architecture, timeline, and global reception.`
                },
                {
                  title: `Latest News & In-Depth Analysis on ${activeTab.query || 'Tech'}`,
                  url: 'theverge.com',
                  snippet: `Breaking technology coverage, product reviews, and investigative reporting on recent developments.`
                }
              ].map((res, idx) => (
                <div
                  key={idx}
                  onClick={() => handleNavigate(res.url)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] ${
                    isDark ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700' : 'bg-white border-neutral-200 hover:shadow-md'
                  }`}
                >
                  <span className="text-[10px] text-neutral-400 font-mono block mb-1">{res.url}</span>
                  <h4 className="text-xs font-bold text-blue-500 hover:underline mb-1.5">
                    {res.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">{res.snippet}</p>
                </div>
              ))}
            </div>

            {/* People Also Ask */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>
              <h4 className="text-xs font-bold mb-3">People also ask</h4>
              <div className="space-y-2 text-xs">
                {[
                  `How does ${activeTab.query || 'this technology'} work?`,
                  `What are the best alternatives to ${activeTab.query || 'this solution'}?`,
                  `Is ${activeTab.query || 'this feature'} supported on iOS 18?`
                ].map((q, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleNavigate(`google.com/search?q=${encodeURIComponent(q)}`)}
                    className="p-2.5 rounded-xl bg-neutral-850/60 hover:bg-neutral-800 cursor-pointer flex items-center justify-between"
                  >
                    <span>{q}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. GOOGLE AI STUDIO & GEMINI PLAYGROUND */}
        {activeTab.url.includes('ai.google.dev') && (
          <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-4">
            {/* AI Studio Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold">Google AI Studio</h2>
                  <p className="text-[9px] text-purple-400 font-mono">Gemini 2.0 Flash</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                Connected
              </span>
            </div>

            {/* Chat Stream View */}
            <div className="flex-1 min-h-[220px] space-y-3 overflow-y-auto pr-1">
              {geminiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[9px] text-neutral-400 mb-1 px-1">
                    {msg.role === 'user' ? 'You' : 'Gemini 2.0 Flash'}
                  </span>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[90%] shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-neutral-850 border border-neutral-700/80 text-neutral-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isGeminiGenerating && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-850 text-xs text-purple-300 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Gemini is generating response...</span>
                </div>
              )}
            </div>

            {/* Sample Prompts */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-[10px]">
              {[
                'Explain quantum computing in 1 sentence',
                'Write Python code for web scraper',
                'Compare iOS vs Android architecture'
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setGeminiPrompt(p)}
                  className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 shrink-0 border border-neutral-700"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Prompt Input Box */}
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-inner">
              <input
                type="text"
                value={geminiPrompt}
                onChange={(e) => setGeminiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendGeminiPrompt();
                }}
                placeholder="Ask Gemini anything..."
                className="flex-1 bg-transparent text-xs px-2 text-white focus:outline-none placeholder:text-neutral-500"
              />
              <button
                onClick={handleSendGeminiPrompt}
                disabled={!geminiPrompt.trim() || isGeminiGenerating}
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 5. GITHUB VIEW */}
        {activeTab.url.includes('github.com') && (
          <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-4">
            {/* Repo Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐙</span>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span className="text-blue-400">google</span>
                    <span className="text-neutral-500">/</span>
                    <span>gemini-cookbook</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                    Public
                  </span>
                </div>
              </div>

              {/* Star Button */}
              <button
                onClick={() => {
                  triggerHaptic();
                  setGithubStarred(!githubStarred);
                  showToast(githubStarred ? 'Unstarred repository' : 'Starred repository!');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow transition-all ${
                  githubStarred
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-750 text-white'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${githubStarred ? 'fill-amber-300' : ''}`} />
                <span>{34280 + (githubStarred ? 1 : 0)}</span>
              </button>
            </div>

            {/* Description & Topics */}
            <p className="text-xs text-neutral-300 leading-relaxed">
              Examples and guides for using the Google Gemini API, including multimodal workflows, function calling, and structured JSON outputs.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {['python', 'gemini-api', 'multimodal-ai', 'google-cloud', 'llm'].map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/40 text-[10px] font-mono"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* File Explorer */}
            <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-900 text-xs">
              <div className="p-2.5 bg-neutral-850 border-b border-neutral-800 font-mono text-[10px] text-neutral-400 flex items-center justify-between">
                <span>Branch: main</span>
                <span>commit 8f2a91c</span>
              </div>
              <div className="divide-y divide-neutral-800">
                {['README.md', 'quickstarts/gemini_2_flash.py', 'examples/multimodal_vision.ipynb', 'requirements.txt'].map(
                  (fileName, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        triggerHaptic();
                        setSelectedGithubFile(fileName);
                      }}
                      className={`p-2.5 flex items-center justify-between cursor-pointer ${
                        selectedGithubFile === fileName ? 'bg-neutral-800 text-blue-400 font-semibold' : 'hover:bg-neutral-850'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="font-mono text-[11px]">{fileName}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Readme Preview */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs">
              <h4 className="font-bold border-b border-neutral-800 pb-2 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>{selectedGithubFile} Preview</span>
              </h4>
              <pre className="p-2 rounded-xl bg-black font-mono text-[10px] text-emerald-400 overflow-x-auto">
                {selectedGithubFile === 'README.md'
                  ? `# Gemini Cookbook\n\nWelcome! This repository provides runnable code samples for building with Gemini models.\n\n## Quickstart\n\`pip install google-genai\`\n\`export GEMINI_API_KEY="your_api_key"\``
                  : `# File: ${selectedGithubFile}\n\nfrom google import genai\n\nclient = genai.Client()\nresponse = client.models.generate_content(\n    model='gemini-2.0-flash',\n    contents='Explain zero shot learning'\n)`}
              </pre>
            </div>
          </div>
        )}

        {/* 6. WIKIPEDIA VIEW */}
        {activeTab.url.includes('wikipedia.org') && (
          <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif font-black">W</span>
                <div>
                  <h2 className="text-xs font-bold font-serif">WIKIPEDIA</h2>
                  <p className="text-[9px] text-neutral-400">The Free Encyclopedia</p>
                </div>
              </div>
              <button
                onClick={() => showToast('Switched to English')}
                className="text-[10px] px-2 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300"
              >
                🌐 EN (320 languages)
              </button>
            </div>

            <h1 className="text-lg font-bold font-serif tracking-tight">
              {activeTab.query ? activeTab.query.toUpperCase() : 'ARTIFICIAL INTELLIGENCE'}
            </h1>

            <p className="text-xs leading-relaxed text-neutral-300 font-serif">
              Artificial intelligence (AI) is the intelligence of machines or software, as opposed to the intelligence of living beings, primarily of humans. It is a field of study in computer science that develops and studies intelligent machines.
            </p>

            {/* Expandable Sections */}
            <div className="space-y-2">
              {[
                { title: 'History & Early Foundations', body: 'The Dartmouth workshop of 1956 is widely considered the founding event of artificial intelligence as a distinct field.' },
                { title: 'Modern Deep Learning & Transformers', body: 'The invention of the Transformer architecture in 2017 catalyzed rapid expansion across large language models and multimodal agents.' },
                { title: 'Ethics and Safety', body: 'Global governance frameworks focus on transparency, alignment, hallucination mitigation, and ethical deployment.' }
              ].map((sec, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <h4 className="font-bold text-xs font-serif text-blue-400 mb-1">{sec.title}</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">{sec.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. THE VERGE TECH NEWS VIEW */}
        {activeTab.url.includes('theverge.com') && (
          <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-base font-black tracking-widest text-violet-500 uppercase">
                THE VERGE
              </span>
              <span className="text-[10px] text-neutral-400">Tech News</span>
            </div>

            <h1 className="text-base font-black leading-tight text-white">
              The Evolution of Mobile OS: How AI Subsystems Redefined Smartphone User Interfaces
            </h1>
            <div className="text-[10px] text-neutral-400 flex items-center gap-2">
              <span>By Dieter Bohn</span>
              <span>•</span>
              <span>Updated today</span>
            </div>

            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80"
              alt="Tech"
              referrerPolicy="no-referrer"
              className="w-full h-44 object-cover rounded-2xl"
            />

            <p className="text-xs text-neutral-300 leading-relaxed">
              Modern smartphones are no longer static app grids. With dynamic islands, neural engine integrations, and continuous multimodal assistants, the boundary between hardware and operating software has dissolved.
            </p>
          </div>
        )}

        {/* 8. REDDIT VIEW */}
        {activeTab.url.includes('reddit.com') && (
          <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <span className="text-xs font-bold text-orange-500">r/technology</span>
              </div>
              <button
                onClick={() => showToast('Joined r/technology!')}
                className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold"
              >
                Join
              </button>
            </div>

            {[
              { id: 'post1', title: 'Why client-side AI processing is winning the battery efficiency war', author: 'u/circuit_wizard', comments: 142 },
              { id: 'post2', title: 'Interactive Web Audio synthesizers replacing recorded sound assets in modern web apps', author: 'u/audiophile_dev', comments: 98 }
            ].map((post) => {
              const currentScore = redditScores[post.id] || 0;
              const currentVote = userVotes[post.id] || 0;
              return (
                <div key={post.id} className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                    <span>Posted by {post.author}</span>
                    <span>•</span>
                    <span>4h ago</span>
                  </div>
                  <h3 className="text-xs font-bold leading-snug">{post.title}</h3>
                  <div className="flex items-center gap-3 pt-1 text-xs text-neutral-400">
                    <div className="flex items-center gap-1.5 bg-neutral-800 px-2.5 py-1 rounded-full">
                      <button
                        onClick={() => handleRedditVote(post.id, 1)}
                        className={`hover:text-orange-500 font-bold ${currentVote === 1 ? 'text-orange-500' : ''}`}
                      >
                        ▲
                      </button>
                      <span className="font-mono text-[11px] font-bold text-white">{currentScore}</span>
                      <button
                        onClick={() => handleRedditVote(post.id, -1)}
                        className={`hover:text-blue-500 font-bold ${currentVote === -1 ? 'text-blue-500' : ''}`}
                      >
                        ▼
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments} comments</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 9. UNIVERSAL FALLBACK WEB RENDERER FOR ANY OTHER URL */}
        {!activeTab.url.includes('google.com') &&
          !activeTab.url.includes('ai.google.dev') &&
          !activeTab.url.includes('github.com') &&
          !activeTab.url.includes('wikipedia.org') &&
          !activeTab.url.includes('theverge.com') &&
          !activeTab.url.includes('reddit.com') &&
          !activeTab.url.includes('chrome://') && (
            <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-4">
              {/* Domain Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow">
                    {activeTab.url.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xs font-bold capitalize">{activeTab.url.split('.')[0]}</h2>
                    <p className="text-[9px] text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      <span>Secure SSL Certificate</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Opening reader view...')}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300"
                >
                  Reader View
                </button>
              </div>

              {/* Hero Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-850 to-neutral-900 border border-neutral-800 shadow-md space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
                  Welcome to {activeTab.url}
                </span>
                <h1 className="text-sm font-bold text-white">
                  Experience next-generation mobile browsing on Google Chrome
                </h1>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  This site is fully responsive and rendered inside your iOS simulator with full history navigation, bookmarks, and Chrome omnibox support.
                </p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleNavigate('google.com')}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow"
                  >
                    Back to Google
                  </button>
                  <button
                    onClick={handleToggleBookmark}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
                  >
                    {isCurrentBookmarked ? 'Bookmarked ⭐' : 'Save Bookmark'}
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* CHROME BOTTOM TOOLBAR */}
      <div
        className={`p-3 border-t flex items-center justify-between z-30 ${
          isIncognito
            ? 'bg-[#202124] border-neutral-800'
            : isDark
            ? 'bg-neutral-900 border-neutral-800'
            : 'bg-white border-neutral-200 shadow-sm'
        }`}
      >
        {/* Navigation Arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            disabled={activeTab.historyIndex <= 0}
            className={`p-1.5 rounded-lg transition-colors ${
              activeTab.historyIndex > 0
                ? 'text-blue-500 hover:bg-blue-500/10'
                : 'text-neutral-500 opacity-40 cursor-not-allowed'
            }`}
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleGoForward}
            disabled={activeTab.historyIndex >= activeTab.history.length - 1}
            className={`p-1.5 rounded-lg transition-colors ${
              activeTab.historyIndex < activeTab.history.length - 1
                ? 'text-blue-500 hover:bg-blue-500/10'
                : 'text-neutral-500 opacity-40 cursor-not-allowed'
            }`}
            title="Go Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReload}
            className={`p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-transform ${
              isReloading ? 'animate-spin' : ''
            }`}
            title="Reload"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Home Button */}
        <button
          onClick={() => handleNavigate('google.com')}
          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors"
          title="Home"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Bookmarks Quick Access */}
        <button
          onClick={() => {
            triggerHaptic();
            setActiveModal('bookmarks');
          }}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 transition-colors"
          title="Bookmarks"
        >
          <Bookmark className="w-4 h-4" />
        </button>

        {/* Incognito Quick Badge */}
        {isIncognito && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40">
            🕶️
          </span>
        )}
      </div>

      {/* THREE-DOTS ACTION SHEET DRAWER */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex flex-col justify-end animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full rounded-t-3xl p-4 border-t shadow-2xl max-h-[75%] overflow-y-auto space-y-4 ${
              isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="w-12 h-1 bg-neutral-700 rounded-full mx-auto mb-2" />

            {/* Quick Action Buttons Row */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleReload();
                }}
                className="p-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-750 flex flex-col items-center gap-1.5"
              >
                <RotateCw className="w-4 h-4 text-blue-400" />
                <span>Reload</span>
              </button>
              <button
                onClick={() => {
                  handleNewTab(false);
                }}
                className="p-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-750 flex flex-col items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>New Tab</span>
              </button>
              <button
                onClick={() => {
                  handleNewTab(true);
                }}
                className="p-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-750 flex flex-col items-center gap-1.5"
              >
                <span className="text-sm">🕶️</span>
                <span>Incognito</span>
              </button>
              <button
                onClick={() => {
                  handleToggleBookmark();
                  setIsMenuOpen(false);
                }}
                className="p-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-750 flex flex-col items-center gap-1.5"
              >
                <Star
                  className={`w-4 h-4 ${
                    isCurrentBookmarked ? 'text-amber-400 fill-amber-400' : 'text-neutral-400'
                  }`}
                />
                <span>Bookmark</span>
              </button>
            </div>

            {/* Menu List Items */}
            <div className="divide-y divide-neutral-800 text-xs font-medium">
              <div
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveModal('bookmarks');
                }}
                className="py-3 flex items-center justify-between cursor-pointer hover:text-blue-400"
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Bookmarks</span>
                </div>
                <span className="text-[10px] text-neutral-400">{bookmarks.length} saved</span>
              </div>

              <div
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveModal('history');
                }}
                className="py-3 flex items-center justify-between cursor-pointer hover:text-blue-400"
              >
                <div className="flex items-center gap-3">
                  <HistoryIcon className="w-4 h-4 text-blue-400" />
                  <span>History</span>
                </div>
                <span className="text-[10px] text-neutral-400">{historyList.length} items</span>
              </div>

              <div
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveModal('share');
                }}
                className="py-3 flex items-center justify-between cursor-pointer hover:text-blue-400"
              >
                <div className="flex items-center gap-3">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>Share Link</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </div>

              <div
                onClick={() => {
                  setIsDesktopSite(!isDesktopSite);
                  setIsMenuOpen(false);
                  showToast(isDesktopSite ? 'Mobile View restored' : 'Requesting Desktop Site');
                }}
                className="py-3 flex items-center justify-between cursor-pointer hover:text-blue-400"
              >
                <div className="flex items-center gap-3">
                  <Laptop className="w-4 h-4 text-purple-400" />
                  <span>Request Desktop Site</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">
                  {isDesktopSite ? 'ON' : 'OFF'}
                </span>
              </div>

              <div
                onClick={() => {
                  setIsMenuOpen(false);
                  setActiveModal('settings');
                }}
                className="py-3 flex items-center justify-between cursor-pointer hover:text-blue-400"
              >
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-4 h-4 text-neutral-400" />
                  <span>Chrome Settings</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOOKMARKS MODAL */}
      {activeModal === 'bookmarks' && (
        <div
          onClick={() => setActiveModal(null)}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full h-[80%] rounded-t-3xl bg-neutral-900 text-white p-4 flex flex-col border-t border-neutral-800"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Bookmarks ({bookmarks.length})</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs font-bold text-blue-400"
              >
                Done
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/60 pt-2">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  onClick={() => {
                    handleNavigate(bm.url);
                    setActiveModal(null);
                  }}
                  className="py-3 px-2 flex items-center justify-between hover:bg-neutral-800/60 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{bm.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{bm.title}</h4>
                      <p className="text-[10px] text-neutral-400 font-mono">{bm.url}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBookmarks(bookmarks.filter((b) => b.id !== bm.id));
                      showToast('Bookmark deleted');
                    }}
                    className="p-1 text-neutral-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {activeModal === 'history' && (
        <div
          onClick={() => setActiveModal(null)}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full h-[80%] rounded-t-3xl bg-neutral-900 text-white p-4 flex flex-col border-t border-neutral-800"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm">Browsing History</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setHistoryList([]);
                    showToast('History cleared');
                  }}
                  className="text-xs font-semibold text-red-400"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-xs font-bold text-blue-400"
                >
                  Done
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/60 pt-2">
              {historyList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    handleNavigate(item.url);
                    setActiveModal(null);
                  }}
                  className="py-2.5 px-2 flex items-center justify-between hover:bg-neutral-800/60 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <div className="truncate">
                      <h4 className="text-xs font-semibold truncate text-white">{item.title}</h4>
                      <p className="text-[10px] text-neutral-400 font-mono truncate">{item.url}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-500 shrink-0">{item.time}</span>
                </div>
              ))}
              {historyList.length === 0 && (
                <div className="py-16 text-center text-xs text-neutral-500">
                  No browsing history
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHARE SHEET MODAL */}
      {activeModal === 'share' && (
        <div
          onClick={() => setActiveModal(null)}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-3xl bg-neutral-900 text-white p-4 border-t border-neutral-800 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div>
                <h4 className="font-bold text-xs">{activeTab.title}</h4>
                <p className="text-[10px] text-neutral-400 font-mono">{activeTab.url}</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs font-bold text-blue-400"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(activeTab.url);
                  showToast('URL copied to clipboard!');
                  setActiveModal(null);
                }}
                className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-750 flex flex-col items-center gap-1.5"
              >
                <Copy className="w-5 h-5 text-blue-400" />
                <span className="text-[10px]">Copy Link</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenApp) onOpenApp('whatsapp');
                  setActiveModal(null);
                }}
                className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-750 flex flex-col items-center gap-1.5"
              >
                <span className="text-xl">💬</span>
                <span className="text-[10px]">WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenApp) onOpenApp('messages');
                  setActiveModal(null);
                }}
                className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-750 flex flex-col items-center gap-1.5"
              >
                <span className="text-xl">✉️</span>
                <span className="text-[10px]">Messages</span>
              </button>

              <button
                onClick={() => {
                  handleToggleBookmark();
                  setActiveModal(null);
                }}
                className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-750 flex flex-col items-center gap-1.5"
              >
                <Star className="w-5 h-5 text-amber-400" />
                <span className="text-[10px]">Add Star</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VOICE SEARCH MODAL */}
      {activeModal === 'voice' && (
        <div
          onClick={() => setActiveModal(null)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-white animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col items-center text-center space-y-5"
          >
            <div className="w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 animate-pulse">
              <Mic className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold">Google Voice Search</h3>
              <p className="text-xs text-neutral-400 mt-1">Listening for query...</p>
            </div>

            {/* Simulated Animated Sound Bars */}
            <div className="flex items-center gap-1.5 h-8">
              {[40, 70, 100, 60, 90, 50, 80].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-1.5 bg-gradient-to-t from-blue-500 via-purple-500 to-red-500 rounded-full animate-pulse"
                />
              ))}
            </div>

            <div className="space-y-1.5 w-full pt-2 text-xs">
              <p className="text-[10px] text-neutral-400 uppercase font-semibold">Try saying:</p>
              {[
                'What is the weather today?',
                'Google AI Studio Gemini features',
                'Latest technology news'
              ].map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigate(phrase)}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-medium text-xs text-left truncate"
                >
                  "{phrase}"
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="text-xs text-neutral-400 hover:text-white pt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* GOOGLE LENS / QR SCANNER MODAL */}
      {activeModal === 'lens' && (
        <div
          onClick={() => setActiveModal(null)}
          className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-white animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col items-center text-center space-y-4"
          >
            <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-blue-400 relative flex items-center justify-center bg-black/40 overflow-hidden">
              <ScanLine className="w-12 h-12 text-blue-400 animate-bounce" />
              <div className="absolute inset-0 pointer-events-none border-2 border-blue-500 rounded-2xl opacity-40 animate-pulse" />
            </div>

            <div>
              <h3 className="text-sm font-bold">Google Lens & QR Scanner</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Point camera at QR code or object</p>
            </div>

            {/* Detected URL simulation */}
            <div className="w-full p-3 rounded-2xl bg-neutral-800 border border-neutral-700 text-left text-xs space-y-1">
              <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">
                QR Code Detected
              </span>
              <p className="font-mono text-xs text-white truncate">https://ai.google.dev</p>
              <button
                onClick={() => handleNavigate('ai.google.dev')}
                className="mt-2 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
              >
                Open Detected Website
              </button>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Close Lens
            </button>
          </div>
        </div>
      )}

      {/* CHROME SETTINGS MODAL */}
      {activeModal === 'settings' && (
        <div
          onClick={() => setActiveModal(null)}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full h-[75%] rounded-t-3xl bg-neutral-900 text-white p-4 flex flex-col border-t border-neutral-800 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm">Chrome Settings</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs font-bold text-blue-400"
              >
                Done
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-neutral-850 border border-neutral-800 space-y-2">
                <span className="font-semibold text-neutral-300">Default Search Engine</span>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                  {['Google', 'DuckDuckGo', 'Bing'].map((engine, idx) => (
                    <button
                      key={idx}
                      onClick={() => showToast(`Search engine set to ${engine}`)}
                      className={`py-2 rounded-xl border text-center ${
                        idx === 0
                          ? 'bg-blue-600 border-blue-500 text-white font-bold'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                      }`}
                    >
                      {engine}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-850 border border-neutral-800 space-y-2">
                <span className="font-semibold text-neutral-300">Privacy and Security</span>
                <div className="divide-y divide-neutral-800 text-[11px]">
                  <div
                    onClick={() => {
                      setHistoryList([]);
                      showToast('Browsing history & cache cleared');
                    }}
                    className="py-2.5 flex items-center justify-between cursor-pointer hover:text-red-400 text-red-400 font-semibold"
                  >
                    <span>Clear Browsing Data</span>
                    <Trash2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span>Safe Browsing Protection</span>
                    <span className="text-emerald-400 font-bold">Standard</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-850 border border-neutral-800 space-y-1 text-neutral-400">
                <span className="font-semibold text-neutral-300">About Google Chrome</span>
                <p className="text-[10px]">Version 128.0.6613.92 (iOS Simulator Edition)</p>
                <p className="text-[10px]">Google LLC</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
