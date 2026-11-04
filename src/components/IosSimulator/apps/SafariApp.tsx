import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Shield,
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  BookOpen,
  Share2,
  Bookmark,
  Plus,
  X,
  ExternalLink,
  Layers,
  Lock,
  Sparkles,
  Globe,
  Check,
  Copy,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  History,
  Sliders,
  Maximize2
} from 'lucide-react';
import { SimulatorState, IosAppId } from '../../../types';
import { playBiometricTickSound, playVolumeStepSound } from '../../../utils/audioUtils';

interface TabItem {
  id: string;
  url: string;
  title: string;
  history: string[];
  historyIndex: number;
  content: 'google' | 'apple' | 'wiki' | 'tech' | 'github' | 'blinkit' | 'article' | 'custom';
  query?: string;
  articleData?: {
    headline: string;
    source: string;
    body: string;
    date: string;
  };
}

interface SearchResponse {
  query: string;
  aiOverview: string;
  knowledgeCard?: {
    title: string;
    subtitle: string;
    description: string;
    facts: Array<{ label: string; value: string }>;
  } | null;
  results: Array<{
    title: string;
    url: string;
    domain: string;
    snippet: string;
  }>;
  peopleAlsoAsk: string[];
  pageContent?: string;
}

interface SafariAppProps {
  state: SimulatorState;
  onOpenApp?: (app: IosAppId) => void;
}

export const SafariApp: React.FC<SafariAppProps> = ({ state, onOpenApp }) => {
  const [tabs, setTabs] = useState<TabItem[]>([
    {
      id: 'tab-1',
      url: 'apple.com/iphone-16-pro',
      title: 'Apple — iPhone 16 Pro',
      history: ['apple.com/iphone-16-pro'],
      historyIndex: 0,
      content: 'apple'
    },
    {
      id: 'tab-2',
      url: 'google.com',
      title: 'Google Search',
      history: ['google.com'],
      historyIndex: 0,
      content: 'google',
      query: ''
    }
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [inputUrl, setInputUrl] = useState('apple.com/iphone-16-pro');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [isTabsView, setIsTabsView] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Active search result data
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Overlays: Share Sheet, Bookmarks/History, Reader Mode
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [readerTheme, setReaderTheme] = useState<'white' | 'sepia' | 'dark' | 'black'>('white');
  const [readerFontSize, setReaderFontSize] = useState<number>(15);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Apple interactive showroom state
  const [selectedTitaniumFinish, setSelectedTitaniumFinish] = useState<'natural' | 'desert' | 'white' | 'black'>('natural');

  // Bookmarks list
  const [bookmarks, setBookmarks] = useState([
    { title: 'Apple Official', url: 'apple.com', icon: '🍎' },
    { title: 'Google Search', url: 'google.com', icon: '🔍' },
    { title: 'Blinkit: 10 Min Delivery', url: 'blinkit.com', icon: '⚡' },
    { title: 'Wikipedia Encyclopedia', url: 'en.wikipedia.org', icon: '📖' },
    { title: 'GitHub Open Source', url: 'github.com', icon: '🐙' },
    { title: 'The Verge Tech News', url: 'theverge.com', icon: '⚡' }
  ]);

  // Browsing History
  const [historyList, setHistoryList] = useState<Array<{ title: string; url: string; time: string }>>([
    { title: 'Apple — iPhone 16 Pro', url: 'apple.com/iphone-16-pro', time: '10:42 AM' },
    { title: 'iOS 27 Quantum Intelligence', url: 'apple.com/ios/ios-27', time: '10:30 AM' },
    { title: 'Google Search', url: 'google.com', time: '10:15 AM' }
  ]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Sync address bar input when active tab changes
  useEffect(() => {
    if (activeTab) {
      setInputUrl(activeTab.url);
    }
  }, [activeTabId]);

  // Simulated Page Load Progress Sweep
  const triggerLoadingBar = () => {
    setIsLoadingPage(true);
    setLoadProgress(15);
    setTimeout(() => setLoadProgress(45), 100);
    setTimeout(() => setLoadProgress(80), 250);
    setTimeout(() => {
      setLoadProgress(100);
      setTimeout(() => setIsLoadingPage(false), 200);
    }, 400);
  };

  const handleNavigate = async (rawInput: string, pushHistory = true) => {
    const clean = rawInput.trim();
    if (!clean) return;

    triggerLoadingBar();
    playBiometricTickSound();

    let targetContent: TabItem['content'] = 'custom';
    let newTitle = clean;
    let query = '';
    let finalUrl = clean;

    const lower = clean.toLowerCase();

    if (lower.includes('apple.com') || lower === 'apple') {
      targetContent = 'apple';
      newTitle = 'Apple Official — iPhone 16 Pro & iOS 27';
      finalUrl = 'apple.com/iphone-16-pro';
    } else if (lower.includes('blinkit.com') || lower === 'blinkit') {
      targetContent = 'blinkit';
      newTitle = 'Blinkit — 10-Minute Grocery Delivery';
      finalUrl = 'blinkit.com';
    } else if (lower.includes('wikipedia') || lower.startsWith('wiki ')) {
      targetContent = 'wiki';
      newTitle = 'Wikipedia — The Free Encyclopedia';
      finalUrl = 'en.wikipedia.org/wiki/iOS';
      query = clean.replace(/^wiki\s*/i, '');
    } else if (lower.includes('github.com') || lower === 'github') {
      targetContent = 'github';
      newTitle = 'GitHub — Where the world builds software';
      finalUrl = 'github.com/trending';
    } else if (lower.includes('theverge.com') || lower.includes('tech') || lower.includes('news')) {
      targetContent = 'tech';
      newTitle = 'The Verge — Tech, Science & Culture';
      finalUrl = 'theverge.com/tech';
    } else if (lower === 'google.com' || lower === 'google') {
      targetContent = 'google';
      newTitle = 'Google Search';
      finalUrl = 'google.com';
      query = '';
      setSearchData(null);
    } else {
      // General web search via Google search endpoint
      targetContent = 'google';
      query = clean.replace(/^(https?:\/\/)?(www\.)?google\.com\/search\?q=/i, '');
      newTitle = `${query} — Google Search`;
      finalUrl = `google.com/search?q=${encodeURIComponent(query)}`;

      // Fetch dynamic search results
      setIsSearching(true);
      try {
        const res = await fetch('/api/safari/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        const data = await res.json();
        setSearchData(data);
      } catch (e) {
        console.warn('Search query error:', e);
      } finally {
        setIsSearching(false);
      }
    }

    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== activeTabId) return t;
        const newHistory = pushHistory
          ? [...t.history.slice(0, t.historyIndex + 1), finalUrl]
          : t.history;
        const newIndex = pushHistory ? newHistory.length - 1 : t.historyIndex;
        return {
          ...t,
          url: finalUrl,
          title: newTitle,
          content: targetContent,
          query,
          history: newHistory,
          historyIndex: newIndex
        };
      })
    );

    setInputUrl(finalUrl);
    setIsEditingUrl(false);

    // Append to browser history list
    setHistoryList((prev) => [
      { title: newTitle, url: finalUrl, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev.slice(0, 19)
    ]);
  };

  const openArticlePage = (title: string, domain: string, snippet: string) => {
    triggerLoadingBar();
    const articleUrl = `${domain}/article/${encodeURIComponent(title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`;

    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== activeTabId) return t;
        const newHistory = [...t.history.slice(0, t.historyIndex + 1), articleUrl];
        return {
          ...t,
          url: articleUrl,
          title,
          content: 'article',
          history: newHistory,
          historyIndex: newHistory.length - 1,
          articleData: {
            headline: title,
            source: domain,
            body: snippet,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          }
        };
      })
    );
    setInputUrl(articleUrl);
  };

  const goBack = () => {
    if (activeTab.historyIndex > 0) {
      playVolumeStepSound();
      const prevIndex = activeTab.historyIndex - 1;
      const prevUrl = activeTab.history[prevIndex];
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, historyIndex: prevIndex } : t))
      );
      handleNavigate(prevUrl, false);
    }
  };

  const goForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      playVolumeStepSound();
      const nextIndex = activeTab.historyIndex + 1;
      const nextUrl = activeTab.history[nextIndex];
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, historyIndex: nextIndex } : t))
      );
      handleNavigate(nextUrl, false);
    }
  };

  const handleNewTab = () => {
    playBiometricTickSound();
    const newTab: TabItem = {
      id: `tab-${Date.now()}`,
      url: 'google.com',
      title: 'Google Search',
      history: ['google.com'],
      historyIndex: 0,
      content: 'google',
      query: ''
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setInputUrl(newTab.url);
    setIsTabsView(false);
    setSearchData(null);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playVolumeStepSound();
    if (tabs.length === 1) {
      // Keep at least one tab
      handleNavigate('google.com');
      return;
    }
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      const nextTab = remaining[remaining.length - 1];
      setActiveTabId(nextTab.id);
      setInputUrl(nextTab.url);
    }
  };

  const handleAddBookmark = () => {
    playBiometricTickSound();
    setBookmarks((prev) => [
      { title: activeTab.title, url: activeTab.url, icon: '🔖' },
      ...prev
    ]);
    setIsShareSheetOpen(false);
  };

  const handleCopyLink = () => {
    playBiometricTickSound();
    navigator.clipboard?.writeText?.(`https://${activeTab.url}`);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} select-none font-sans relative overflow-hidden`}>
      {/* 3D TABS SWITCHER MODAL */}
      {isTabsView ? (
        <div className="h-full flex flex-col pt-12 pb-4 px-3.5 bg-neutral-900 text-white animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="font-bold text-sm tracking-tight">{tabs.length} Open Tabs</span>
            <button
              onClick={() => setIsTabsView(false)}
              className="text-blue-400 font-bold text-xs hover:text-blue-300 cursor-pointer"
            >
              Done
            </button>
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3 py-3">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => {
                  playBiometricTickSound();
                  setActiveTabId(tab.id);
                  setInputUrl(tab.url);
                  setIsTabsView(false);
                }}
                className={`aspect-[3/4] rounded-2xl p-2.5 flex flex-col justify-between border shadow-lg relative cursor-pointer transition-all ${
                  tab.id === activeTabId
                    ? 'border-blue-500 bg-neutral-800 ring-2 ring-blue-500/50'
                    : 'border-neutral-700 bg-neutral-850 hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold truncate max-w-[95px]">{tab.title}</span>
                  <button
                    onClick={(e) => closeTab(tab.id, e)}
                    className="p-1 rounded-full bg-black/40 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center my-auto">
                  <span className="text-3xl opacity-80 mb-1">
                    {tab.content === 'apple'
                      ? '🍎'
                      : tab.content === 'blinkit'
                      ? '⚡'
                      : tab.content === 'wiki'
                      ? '📖'
                      : tab.content === 'github'
                      ? '🐙'
                      : tab.content === 'tech'
                      ? '📰'
                      : '🔍'}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono truncate max-w-[110px]">
                    {tab.url}
                  </span>
                </div>

                <div className="text-[9px] text-neutral-400 flex items-center justify-between border-t border-neutral-700/60 pt-1">
                  <span>{isPrivateMode ? 'Private' : 'Tab'}</span>
                  <span>{tab.historyIndex + 1} steps</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => setIsPrivateMode(!isPrivateMode)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                isPrivateMode ? 'bg-white text-black' : 'text-neutral-300 hover:text-white'
              }`}
            >
              {isPrivateMode ? 'Private Active' : 'Private'}
            </button>

            <button
              onClick={handleNewTab}
              className="p-2.5 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 active:scale-95 cursor-pointer"
              title="Open New Tab"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* TOP ADDRESS & PRIVACY HEADER */}
          <div className="pt-11 px-3 pb-1 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md z-20">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-semibold text-[11px]">
                <Lock className="w-3 h-3" />
                <span>https</span>
                {isPrivateMode && (
                  <span className="text-[9px] bg-neutral-800 text-neutral-300 px-1 rounded-sm">
                    Private
                  </span>
                )}
              </div>

              <span className="font-semibold text-neutral-500 dark:text-neutral-400 truncate max-w-[140px] text-[11px]">
                {activeTab.title}
              </span>

              {/* Reader View & Display Controls */}
              <button
                onClick={() => setIsReaderMode(!isReaderMode)}
                className={`px-1.5 py-0.5 rounded-md font-serif font-bold text-xs transition-colors cursor-pointer ${
                  isReaderMode
                    ? 'bg-amber-400 text-black shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
                title="Reader View & Text Options"
              >
                aA
              </button>
            </div>

            {/* Main Interactive Address Bar */}
            <div
              className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 border shadow-xs transition-all ${
                isEditingUrl
                  ? 'border-blue-500 ring-2 ring-blue-500/30'
                  : state.isDarkMode
                  ? 'bg-neutral-800/90 border-neutral-700 text-white'
                  : 'bg-white border-neutral-300 text-neutral-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-neutral-400 mr-1.5 shrink-0" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onFocus={() => setIsEditingUrl(true)}
                onBlur={() => setTimeout(() => setIsEditingUrl(false), 200)}
                onKeyDown={(e) => e.key === 'Enter' && handleNavigate(inputUrl)}
                placeholder="Search or enter website name"
                className="w-full text-xs bg-transparent outline-none font-medium truncate"
              />
              {inputUrl && isEditingUrl && (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setInputUrl('');
                  }}
                  className="text-neutral-400 hover:text-neutral-200 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => handleNavigate(inputUrl)}
                className="text-neutral-400 hover:text-blue-500 cursor-pointer ml-1.5 shrink-0"
                title="Reload / Navigate"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLoadingPage ? 'animate-spin text-blue-500' : ''}`} />
              </button>
            </div>

            {/* Loading Blue Progress Bar */}
            {isLoadingPage && (
              <div className="w-full h-0.5 bg-neutral-200 dark:bg-neutral-800 mt-1 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* READER VIEW CONTROLS (IF ACTIVE) */}
          {isReaderMode && (
            <div className="p-2.5 px-3 bg-amber-50 dark:bg-neutral-900 border-b border-amber-200 dark:border-neutral-800 flex items-center justify-between text-xs animate-slide-up z-20">
              <span className="font-bold text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Reader View
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReaderFontSize((s) => Math.max(12, s - 1))}
                  className="px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 font-bold"
                >
                  A-
                </button>
                <span className="text-[10px] text-neutral-500">{readerFontSize}px</span>
                <button
                  onClick={() => setReaderFontSize((s) => Math.min(22, s + 1))}
                  className="px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 font-bold"
                >
                  A+
                </button>
                <div className="flex items-center gap-1 ml-1">
                  {(['white', 'sepia', 'dark', 'black'] as const).map((thm) => (
                    <button
                      key={thm}
                      onClick={() => setReaderTheme(thm)}
                      className={`w-4 h-4 rounded-full border ${
                        thm === 'white'
                          ? 'bg-white border-neutral-300'
                          : thm === 'sepia'
                          ? 'bg-[#f4ecd8] border-amber-300'
                          : thm === 'dark'
                          ? 'bg-neutral-700 border-neutral-600'
                          : 'bg-black border-neutral-800'
                      } ${readerTheme === thm ? 'ring-2 ring-blue-500' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MAIN WEBPAGE VIEWPORT */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-4 font-sans ${
              isReaderMode
                ? readerTheme === 'sepia'
                  ? 'bg-[#f8f1e5] text-amber-950 font-serif'
                  : readerTheme === 'dark'
                  ? 'bg-neutral-850 text-neutral-100'
                  : readerTheme === 'black'
                  ? 'bg-black text-neutral-100'
                  : 'bg-white text-neutral-900 font-serif'
                : ''
            }`}
            style={{ fontSize: isReaderMode ? `${readerFontSize}px` : undefined }}
          >
            {/* 1. GOOGLE SEARCH & RESULTS PAGE */}
            {activeTab.content === 'google' && (
              <div className="space-y-3.5 animate-fade-in">
                {/* Search query input box */}
                <div className="flex items-center gap-2 p-2 px-3 rounded-2xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 shadow-xs">
                  <span className="font-black text-base bg-gradient-to-r from-blue-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
                    Google
                  </span>
                  <input
                    type="text"
                    defaultValue={activeTab.query || ''}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNavigate((e.target as HTMLInputElement).value);
                    }}
                    placeholder="Search anything on Google..."
                    className="w-full text-xs bg-transparent outline-none font-medium"
                  />
                  <Search className="w-4 h-4 text-neutral-400" />
                </div>

                {isSearching && (
                  <div className="p-4 text-center text-xs text-neutral-400 animate-pulse">
                    <span>Searching Google Web Index...</span>
                  </div>
                )}

                {/* Instant AI Overview Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent border border-blue-500/20 space-y-2 shadow-xs">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Overview</span>
                  </div>
                  <p className="text-xs leading-relaxed text-neutral-800 dark:text-neutral-200">
                    {searchData?.aiOverview ||
                      `Results for "${activeTab.query || 'iOS Guide'}": Discover hardware guides, apps, gestures, and live device services.`}
                  </p>
                </div>

                {/* Knowledge Graph Card (if returned) */}
                {searchData?.knowledgeCard && (
                  <div className="p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-2 shadow-xs">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                        {searchData.knowledgeCard.title}
                      </h3>
                      <p className="text-[10px] text-neutral-400">{searchData.knowledgeCard.subtitle}</p>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">
                      {searchData.knowledgeCard.description}
                    </p>
                    {searchData.knowledgeCard.facts?.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[10px]">
                        {searchData.knowledgeCard.facts.map((fact, idx) => (
                          <div key={idx}>
                            <span className="text-neutral-400 block">{fact.label}</span>
                            <span className="font-bold text-neutral-800 dark:text-neutral-200">{fact.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Organic Search Result Links */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-1">
                    Web Results
                  </span>
                  {(searchData?.results || [
                    {
                      title: 'iPhone 16 Pro Specifications & Titanium Design — Apple',
                      snippet: 'A18 Pro chip, 48MP Fusion camera control button, Super Retina XDR display, and 33-hour battery life.',
                      url: 'https://apple.com/iphone-16-pro',
                      domain: 'apple.com'
                    },
                    {
                      title: 'Blinkit: 10-Minute Grocery Delivery App',
                      snippet: 'Everything delivered in 10 minutes. Fresh milk, farm tomatoes, snacks, cold drinks and instant noodles at doorstep.',
                      url: 'https://blinkit.com',
                      domain: 'blinkit.com'
                    },
                    {
                      title: 'Wikipedia: iOS 27 Quantum Intelligence Operating System',
                      snippet: 'iOS is Apple’s mobile operating system featuring Dynamic Island, sandbox encryption, and hardware co-processors.',
                      url: 'https://en.wikipedia.org/wiki/iOS',
                      domain: 'en.wikipedia.org'
                    },
                    {
                      title: 'Top 10 Essential iPhone Gestures Every Beginner Must Know',
                      snippet: 'Learn to pull down Control Center from top-right, access Notification Center from top-left, and switch apps smoothly.',
                      url: 'https://theverge.com/tech/ios-gestures-guide',
                      domain: 'theverge.com'
                    }
                  ]).map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => openArticlePage(item.title, item.domain, item.snippet)}
                      className={`p-3 rounded-2xl border space-y-1 cursor-pointer hover:border-blue-500 transition-colors shadow-xs ${
                        state.isDarkMode
                          ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800/80'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <span className="text-[10px] text-neutral-400 font-mono block truncate">
                        {item.url}
                      </span>
                      <h4 className="font-bold text-xs text-blue-500 hover:underline leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
                        {item.snippet}
                      </p>
                    </div>
                  ))}
                </div>

                {/* People Also Ask Accordion */}
                {(searchData?.peopleAlsoAsk || [
                  'What makes the iPhone 16 Pro camera unique?',
                  'How does 10-minute grocery delivery work on Blinkit?',
                  'How to master Siri and Apple Intelligence voice shortcuts?'
                ]).length > 0 && (
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-1">
                      People Also Ask
                    </span>
                    {(searchData?.peopleAlsoAsk || [
                      'What makes the iPhone 16 Pro camera unique?',
                      'How does 10-minute grocery delivery work on Blinkit?',
                      'How to master Siri and Apple Intelligence voice shortcuts?'
                    ]).map((q, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-2.5 bg-neutral-50 dark:bg-neutral-900"
                      >
                        <div
                          onClick={() => setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{q}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${expandedFaqIndex === idx ? 'rotate-180' : ''}`} />
                        </div>
                        {expandedFaqIndex === idx && (
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 leading-relaxed">
                            Engineered with responsive haptic sensors and fast routing, users can explore and execute actions seamlessly with authentic iOS design.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. APPLE OFFICIAL SHOWROOM PAGE */}
            {activeTab.content === 'apple' && (
              <div className="space-y-4 animate-fade-in">
                {/* Hero Showcase Card */}
                <div className="rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white p-5 space-y-3 text-center border border-neutral-800 shadow-xl">
                  <span className="text-[9px] uppercase font-black tracking-widest text-amber-400">
                    Grade 5 Titanium
                  </span>
                  <h2 className="text-2xl font-black tracking-tight">iPhone 16 Pro</h2>
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-[280px] mx-auto">
                    A18 Pro chip. Dedicated Camera Control. Quantum Dynamic Island. Built for Apple Intelligence.
                  </p>

                  {/* Titanium Color Picker */}
                  <div className="pt-2">
                    <span className="text-[10px] text-neutral-400 font-semibold block mb-2">
                      Finish: <span className="capitalize text-white font-bold">{selectedTitaniumFinish} Titanium</span>
                    </span>
                    <div className="flex justify-center gap-3">
                      {(['natural', 'desert', 'white', 'black'] as const).map((finish) => (
                        <button
                          key={finish}
                          onClick={() => setSelectedTitaniumFinish(finish)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${
                            finish === 'natural'
                              ? 'bg-[#989288]'
                              : finish === 'desert'
                              ? 'bg-[#d4b996]'
                              : finish === 'white'
                              ? 'bg-[#f2f1ed]'
                              : 'bg-[#3b3a3e]'
                          } ${selectedTitaniumFinish === finish ? 'ring-2 ring-amber-400 scale-110' : 'border-neutral-700'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleNavigate('google.com/search?q=iphone+16+pro+reviews')}
                      className="px-4 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-md"
                    >
                      Buy from $999
                    </button>
                    <button
                      onClick={() => handleNavigate('apple.com/ios/ios-27')}
                      className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                    >
                      Explore iOS 27
                    </button>
                  </div>
                </div>

                {/* Feature Spotlight Tiles */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className={`p-3.5 rounded-2xl border ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-50'} space-y-1`}>
                    <span className="text-2xl">📸</span>
                    <h4 className="font-bold text-xs">Camera Control</h4>
                    <p className="text-[10px] text-neutral-500 leading-tight">Tactile capacitive sensor button for zoom, aperture & photographic styles.</p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-50'} space-y-1`}>
                    <span className="text-2xl">⚡</span>
                    <h4 className="font-bold text-xs">A18 Pro Silicon</h4>
                    <p className="text-[10px] text-neutral-500 leading-tight">6-core CPU, 6-core GPU with hardware-accelerated ray tracing.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. BLINKIT PORTAL IN SAFARI */}
            {activeTab.content === 'blinkit' && (
              <div className="space-y-4 animate-fade-in">
                <div className="rounded-3xl bg-[#F7D300] p-5 text-neutral-900 space-y-3 border border-amber-400 shadow-lg text-center">
                  <div className="inline-flex items-center gap-1 bg-black text-[#F7D300] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                    ⚡ 10 Minutes Delivery
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">blinkit</h2>
                  <p className="text-xs text-neutral-800 max-w-[260px] mx-auto font-medium">
                    India&apos;s leading quick-commerce delivery. Farm fresh groceries, cold beverages, and electronics at your doorstep.
                  </p>
                  <button
                    onClick={() => {
                      if (onOpenApp) onOpenApp('blinkit');
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-[#0C831F] text-white font-black text-xs shadow-md hover:bg-[#0a6d1a] cursor-pointer"
                  >
                    Open Installed Blinkit App &gt;
                  </button>
                </div>

                <div className={`p-4 rounded-2xl border ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-50'} space-y-2`}>
                  <h3 className="font-bold text-xs text-neutral-900 dark:text-white">Trending Categories on Blinkit:</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold">🥛 Fresh Milk & Eggs</span>
                    <span className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold">🍅 Farm Fresh Tomatoes</span>
                    <span className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold">🍟 Magic Masala Chips</span>
                    <span className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold">🍜 Maggi Instant Noodles</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. WIKIPEDIA PAGE */}
            {activeTab.content === 'wiki' && (
              <div className="space-y-3.5 animate-fade-in font-serif">
                <div className="flex items-center gap-2.5 border-b pb-3 border-neutral-200 dark:border-neutral-800">
                  <span className="text-3xl">📖</span>
                  <div>
                    <h3 className="font-bold text-base font-sans">iOS Operating System</h3>
                    <p className="text-[10px] text-neutral-400 font-sans">From Wikipedia, the free encyclopedia</p>
                  </div>
                </div>

                <p className="text-xs leading-relaxed">
                  <strong>iOS</strong> (formerly <em>iPhone OS</em>) is a proprietary mobile operating system developed by Apple Inc. primarily for the iPhone. It is the second most widely installed mobile operating system globally after Android.
                </p>

                <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 text-xs font-sans space-y-1">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-neutral-500">Fast Facts</span>
                  <p><strong>Initial release:</strong> June 29, 2007</p>
                  <p><strong>Developer:</strong> Apple Inc.</p>
                  <p><strong>Kernel type:</strong> Hybrid (XNU / Darwin)</p>
                  <p><strong>Current Version:</strong> iOS 27.0 (Quantum OS Edition)</p>
                </div>

                <p className="text-xs leading-relaxed">
                  iOS user interface concepts center around direct manipulation via multi-touch gestures. Interaction controls consist of sliders, switches, and responsive dynamic pills such as the <strong>Dynamic Island</strong>.
                </p>
              </div>
            )}

            {/* 5. GITHUB TRENDING PAGE */}
            {activeTab.content === 'github' && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 border-b pb-2 border-neutral-200 dark:border-neutral-800">
                  <span className="text-2xl">🐙</span>
                  <div>
                    <h3 className="font-bold text-sm">GitHub Trending Repositories</h3>
                    <p className="text-[10px] text-neutral-400">See what the open source community is building today</p>
                  </div>
                </div>

                {[
                  { name: 'facebook/react', stars: '228k', desc: 'The library for web and native user interfaces.', lang: 'JavaScript' },
                  { name: 'microsoft/TypeScript', stars: '98k', desc: 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.', lang: 'TypeScript' },
                  { name: 'google/gemini', stars: '45k', desc: 'Official Google Gemini SDKs, prompt engineering guides, and multimodal recipes.', lang: 'Python' }
                ].map((repo, idx) => (
                  <div key={idx} className="p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-1">
                    <h4 className="font-bold text-xs text-blue-500">{repo.name}</h4>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{repo.desc}</p>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-400 pt-1">
                      <span>★ {repo.stars}</span>
                      <span>{repo.lang}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. ARTICLE READER VIEW (READING FROM ANY WEB RESULT) */}
            {activeTab.content === 'article' && activeTab.articleData && (
              <div className="space-y-3.5 animate-fade-in">
                <div className="space-y-1 border-b pb-3 border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-blue-500 font-sans tracking-wider">
                    {activeTab.articleData.source} • {activeTab.articleData.date}
                  </span>
                  <h2 className="text-lg font-bold leading-tight">
                    {activeTab.articleData.headline}
                  </h2>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <p className="font-medium text-neutral-800 dark:text-neutral-200">
                    {activeTab.articleData.body}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Technology advancements in modern mobile systems provide low-latency interaction, hardware-accelerated graphics, and secure on-device neural processing.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Users can easily share this article using the bottom share sheet icon or bookmark it for offline reading in Safari.
                  </p>
                </div>
              </div>
            )}

            {/* QUICK BOOKMARKS & FAVORITES TILES */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-2 px-1">
                Favorites & Speed Dial
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                {bookmarks.slice(0, 6).map((b) => (
                  <button
                    key={b.title}
                    onClick={() => handleNavigate(b.url)}
                    className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-850/80 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex flex-col items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span className="text-xl">{b.icon}</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[80px]">
                      {b.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM NAVIGATION TOOLBAR */}
          <div className={`p-2 px-4 border-t flex items-center justify-between z-20 ${
            state.isDarkMode ? 'border-neutral-800 bg-neutral-900/90' : 'border-neutral-200 bg-neutral-100/90'
          } backdrop-blur-md`}>
            {/* Back Button */}
            <button
              onClick={goBack}
              disabled={activeTab.historyIndex <= 0}
              className="text-neutral-600 dark:text-neutral-300 disabled:opacity-30 hover:text-blue-500 cursor-pointer p-1"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Forward Button */}
            <button
              onClick={goForward}
              disabled={activeTab.historyIndex >= activeTab.history.length - 1}
              className="text-neutral-600 dark:text-neutral-300 disabled:opacity-30 hover:text-blue-500 cursor-pointer p-1"
              title="Go Forward"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Share Sheet Button */}
            <button
              onClick={() => setIsShareSheetOpen(true)}
              className="text-neutral-600 dark:text-neutral-300 hover:text-blue-500 cursor-pointer p-1"
              title="Share Page"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Bookmarks Drawer Button */}
            <button
              onClick={() => setIsBookmarksOpen(true)}
              className="text-neutral-600 dark:text-neutral-300 hover:text-blue-500 cursor-pointer p-1"
              title="Bookmarks & History"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Tab Switcher Button */}
            <button
              onClick={() => setIsTabsView(true)}
              className="w-6 h-6 rounded-md border border-neutral-500 dark:border-neutral-400 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-white hover:border-white cursor-pointer active:scale-95"
              title="Tabs"
            >
              {tabs.length}
            </button>
          </div>
        </>
      )}

      {/* SHARE SHEET MODAL */}
      {isShareSheetOpen && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-t-3xl p-4 space-y-4 shadow-2xl animate-slide-up border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h4 className="font-bold text-xs">{activeTab.title}</h4>
                <p className="text-[10px] text-neutral-400 truncate max-w-[240px]">https://{activeTab.url}</p>
              </div>
              <button
                onClick={() => setIsShareSheetOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <button
                onClick={handleCopyLink}
                className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
              >
                {copyFeedback ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-blue-500" />}
                <span className="font-semibold">{copyFeedback ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <button
                onClick={handleAddBookmark}
                className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
              >
                <Bookmark className="w-5 h-5 text-amber-500" />
                <span className="font-semibold">Add Bookmark</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenApp) {
                    setIsShareSheetOpen(false);
                    onOpenApp('whatsapp');
                  }
                }}
                className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
              >
                <span className="text-xl">💬</span>
                <span className="font-semibold">WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setIsReaderMode(true);
                  setIsShareSheetOpen(false);
                }}
                className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">Reading List</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOKMARKS & BROWSING HISTORY DRAWER */}
      {isBookmarksOpen && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-t-3xl max-h-[85%] flex flex-col shadow-2xl animate-slide-up border-t border-neutral-200 dark:border-neutral-800">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm">Bookmarks & History</h3>
              </div>
              <button
                onClick={() => setIsBookmarksOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Bookmarks Section */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Saved Bookmarks</span>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {bookmarks.map((bm, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        handleNavigate(bm.url);
                        setIsBookmarksOpen(false);
                      }}
                      className="py-2.5 flex items-center justify-between hover:opacity-75 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{bm.icon}</span>
                        <div>
                          <p className="font-bold text-xs">{bm.title}</p>
                          <p className="text-[10px] text-neutral-400">{bm.url}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* History Section */}
              <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Recent History</span>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {historyList.map((h, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        handleNavigate(h.url);
                        setIsBookmarksOpen(false);
                      }}
                      className="py-2 flex items-center justify-between hover:opacity-75 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-xs truncate">{h.title}</p>
                        <p className="text-[10px] text-neutral-400 truncate">{h.url}</p>
                      </div>
                      <span className="text-[9px] text-neutral-400 ml-2 shrink-0">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
