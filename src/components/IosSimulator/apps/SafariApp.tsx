import React, { useState } from 'react';
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
  Globe
} from 'lucide-react';
import { SimulatorState } from '../../../types';

interface TabItem {
  id: string;
  url: string;
  title: string;
  content: 'google' | 'apple' | 'wiki' | 'tech' | 'custom';
  query?: string;
}

export const SafariApp: React.FC<{ state: SimulatorState }> = ({ state }) => {
  const [tabs, setTabs] = useState<TabItem[]>([
    { id: '1', url: 'apple.com/iphone-16-pro', title: 'iPhone 16 Pro — Apple', content: 'apple' },
    { id: '2', url: 'google.com/search?q=ios+shortcuts', title: 'iOS Shortcuts - Google Search', content: 'google', query: 'ios shortcuts' }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [inputUrl, setInputUrl] = useState('apple.com/iphone-16-pro');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [isTabsView, setIsTabsView] = useState(false);
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState<number>(14);
  const [isPrivateMode, setIsPrivateMode] = useState(false);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleNavigate = (input: string) => {
    let clean = input.trim();
    if (!clean) return;

    let targetContent: TabItem['content'] = 'custom';
    let newTitle = clean;
    let query = '';

    if (clean.toLowerCase().includes('apple.com')) {
      targetContent = 'apple';
      newTitle = 'Apple Official';
    } else if (clean.toLowerCase().includes('wikipedia') || clean.toLowerCase().startsWith('wiki ')) {
      targetContent = 'wiki';
      newTitle = 'Wikipedia, the Free Encyclopedia';
      query = clean.replace(/^wiki\s*/i, '');
    } else if (clean.toLowerCase().includes('tech') || clean.toLowerCase().includes('verge')) {
      targetContent = 'tech';
      newTitle = 'Technology News';
    } else {
      // General web search via Google
      targetContent = 'google';
      query = clean;
      newTitle = `${clean} - Google Search`;
      if (!clean.startsWith('http://') && !clean.startsWith('https://') && !clean.includes('.')) {
        clean = `google.com/search?q=${encodeURIComponent(clean)}`;
      }
    }

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, url: clean, title: newTitle, content: targetContent, query }
          : t
      )
    );
    setInputUrl(clean);
    setIsEditingUrl(false);
  };

  const handleNewTab = () => {
    const newTab: TabItem = {
      id: Date.now().toString(),
      url: 'google.com',
      title: 'Google Search',
      content: 'google',
      query: ''
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setInputUrl(newTab.url);
    setIsTabsView(false);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[0].id);
      setInputUrl(remaining[0].url);
    }
  };

  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} select-none font-sans relative`}>
      {/* TABS SWITCHER OVERLAY */}
      {isTabsView ? (
        <div className="h-full flex flex-col pt-14 pb-4 px-4 bg-neutral-900 text-white">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="font-bold text-base">{tabs.length} Open Tabs</span>
            <button
              onClick={() => setIsTabsView(false)}
              className="text-blue-400 font-bold text-xs"
            >
              Done
            </button>
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3 pt-3">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => {
                  setActiveTabId(tab.id);
                  setInputUrl(tab.url);
                  setIsTabsView(false);
                }}
                className={`aspect-[3/4] rounded-2xl p-3 flex flex-col justify-between border relative cursor-pointer ${
                  tab.id === activeTabId ? 'border-blue-500 bg-neutral-800' : 'border-neutral-700 bg-neutral-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold truncate max-w-[80px]">{tab.title}</span>
                  <button
                    onClick={(e) => closeTab(tab.id, e)}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-center text-3xl opacity-50">
                  {tab.content === 'apple' ? '🍎' : tab.content === 'wiki' ? '📖' : '🔍'}
                </div>
                <span className="text-[9px] text-neutral-400 truncate">{tab.url}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => setIsPrivateMode(!isPrivateMode)}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${isPrivateMode ? 'bg-white text-black' : 'text-neutral-300'}`}
            >
              {isPrivateMode ? 'Private On' : 'Private'}
            </button>
            <button
              onClick={handleNewTab}
              className="p-2 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Top Privacy Header */}
          <div className="pt-12 px-4 pb-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 text-xs">
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
              <Lock className="w-3 h-3" />
              <span>https</span>
            </div>
            <span className="font-semibold text-neutral-500 truncate max-w-[150px]">{activeTab.title}</span>
            <button
              onClick={() => setIsReaderMode(!isReaderMode)}
              className={`px-1.5 py-0.5 rounded-md font-serif font-bold text-xs ${
                isReaderMode ? 'bg-amber-400 text-black' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              aA
            </button>
          </div>

          {/* READER MODE CONTROLS */}
          {isReaderMode && (
            <div className="p-2 bg-amber-50 dark:bg-neutral-900 border-b border-amber-200 dark:border-neutral-800 flex items-center justify-between text-xs px-4">
              <span className="font-bold text-[11px] text-amber-700 dark:text-amber-400">Reader Mode Active</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReaderFontSize((s) => Math.max(11, s - 1))}
                  className="px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-xs font-bold"
                >
                  A-
                </button>
                <button
                  onClick={() => setReaderFontSize((s) => Math.min(20, s + 1))}
                  className="px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-xs font-bold"
                >
                  A+
                </button>
              </div>
            </div>
          )}

          {/* WEB CONTENT VIEW */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 font-sans"
            style={{ fontSize: isReaderMode ? `${readerFontSize}px` : undefined }}
          >
            {/* GOOGLE SEARCH RESULTS VIEW */}
            {activeTab.content === 'google' && (
              <div className="space-y-3 animate-fade-in">
                {/* Search Bar within page */}
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <span className="font-bold text-base bg-gradient-to-r from-blue-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
                    Google
                  </span>
                  <input
                    type="text"
                    defaultValue={activeTab.query || ''}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNavigate((e.target as HTMLInputElement).value);
                    }}
                    placeholder="Search anything on Google..."
                    className="w-full text-xs bg-transparent outline-none"
                  />
                  <Search className="w-4 h-4 text-neutral-400" />
                </div>

                {/* Instant Knowledge Box */}
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Overview & Instant Answers</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                    Results for &quot;<strong>{activeTab.query || 'iOS Guide'}</strong>&quot;: Discover tips, hardware guides, iCloud syncing, and Safari shortcuts.
                  </p>
                </div>

                {/* Search Result Links */}
                {[
                  {
                    title: 'iPhone User Guide — Official Apple Support',
                    snippet: 'Here is everything you need to know about iPhone, straight from Apple. Explore gestures, buttons, camera settings, and apps.',
                    url: 'support.apple.com/guide/iphone'
                  },
                  {
                    title: 'Wikipedia: iPhone 16 Pro Specifications & History',
                    snippet: 'The iPhone 16 and 16 Pro feature the A18 Pro chip, titanium framing, dynamic action button, and advanced 48MP fusion cameras.',
                    url: 'en.wikipedia.org/wiki/iPhone_16_Pro'
                  },
                  {
                    title: 'Top 10 Essential iOS Settings Every Beginner Should Change',
                    snippet: 'Configure Optimized Battery Charging, Silence Unknown Callers, and enable Two-Factor Authentication for your Apple ID.',
                    url: 'theverge.com/ios-settings-tips'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleNavigate(item.url)}
                    className={`p-3 rounded-2xl border space-y-1 cursor-pointer hover:border-blue-500 transition-colors ${
                      state.isDarkMode ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-neutral-50'
                    }`}
                  >
                    <span className="text-[10px] text-neutral-400 font-mono">{item.url}</span>
                    <h4 className="font-bold text-xs text-blue-500 hover:underline">{item.title}</h4>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">{item.snippet}</p>
                  </div>
                ))}
              </div>
            )}

            {/* APPLE OFFICIAL PAGE */}
            {activeTab.content === 'apple' && (
              <div className="space-y-4 animate-fade-in">
                <div className="rounded-3xl bg-gradient-to-b from-neutral-900 to-black text-white p-5 space-y-3 text-center border border-neutral-800">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Titanium Design</span>
                  <h2 className="text-2xl font-bold tracking-tight">iPhone 16 Pro</h2>
                  <p className="text-xs text-neutral-300">
                    A18 Pro chip. Camera Control. All-day battery life. Built for Apple Intelligence.
                  </p>
                  <button
                    onClick={() => handleNavigate('google.com/search?q=iphone+16+reviews')}
                    className="px-4 py-1.5 rounded-full bg-blue-500 text-white font-semibold text-xs hover:bg-blue-600"
                  >
                    Explore Features
                  </button>
                </div>

                <div className={`p-4 rounded-2xl border space-y-2 ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-50'}`}>
                  <h3 className="font-bold text-xs">Action Button & Hardware Keys</h3>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Press the physical Action button on the side of the simulator to activate flashlight, silent mode, or camera instantly!
                  </p>
                </div>
              </div>
            )}

            {/* WIKIPEDIA PAGE */}
            {activeTab.content === 'wiki' && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 border-b pb-2 border-neutral-200 dark:border-neutral-800">
                  <span className="text-2xl">📖</span>
                  <div>
                    <h3 className="font-bold text-sm">Wikipedia Article</h3>
                    <p className="text-[10px] text-neutral-400">The Free Encyclopedia</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                  <strong>iOS</strong> is a mobile operating system developed by Apple Inc. It powers the iPhone and iPod Touch. It is known for its gesture-based navigation, high-security sandbox architecture, and iCloud cloud synchronization.
                </p>
              </div>
            )}

            {/* QUICK BOOKMARKS */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Favorites & Bookmarks</span>
              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px]">
                {[
                  { name: 'Apple', icon: '🍎', url: 'apple.com' },
                  { name: 'Google', icon: '🔍', url: 'google.com' },
                  { name: 'Wikipedia', icon: '📖', url: 'wikipedia.org' },
                  { name: 'Tech News', icon: '⚡', url: 'theverge.com' }
                ].map((b) => (
                  <button
                    key={b.name}
                    onClick={() => handleNavigate(b.url)}
                    className="p-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 flex flex-col items-center gap-1 hover:scale-105 transition-transform"
                  >
                    <span className="text-xl">{b.icon}</span>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM ADDRESS BAR & TOOLBAR */}
          <div className={`p-2 px-3 border-t flex items-center gap-2 ${
            state.isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-100'
          }`}>
            <button
              onClick={() => handleNavigate('google.com')}
              className="text-neutral-400 hover:text-neutral-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            {/* Main Interactive Address Bar */}
            <div className={`flex-1 flex items-center justify-between rounded-xl px-3 py-1.5 border shadow-xs ${
              state.isDarkMode ? 'bg-black border-neutral-700 text-white' : 'bg-white border-neutral-300 text-black'
            }`}>
              <span className="text-[10px] font-serif font-bold text-neutral-400 mr-1.5">aA</span>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onFocus={() => setIsEditingUrl(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleNavigate(inputUrl)}
                placeholder="Search or enter website name"
                className="w-full text-xs bg-transparent outline-none font-medium truncate"
              />
              <button onClick={() => handleNavigate(inputUrl)} className="text-neutral-400 cursor-pointer ml-1">
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tab Switcher Button */}
            <button
              onClick={() => setIsTabsView(true)}
              className="w-6 h-6 rounded-md border border-neutral-400 flex items-center justify-center text-xs font-bold text-neutral-400 hover:text-white cursor-pointer"
            >
              {tabs.length}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
