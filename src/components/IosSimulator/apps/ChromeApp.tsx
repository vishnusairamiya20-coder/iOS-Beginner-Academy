import React, { useState } from 'react';
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
  Compass
} from 'lucide-react';
import { SimulatorState } from '../../../types';

interface ChromeTab {
  id: string;
  url: string;
  title: string;
  content: 'google' | 'wiki' | 'github' | 'gemini' | 'custom';
  query?: string;
}

export const ChromeApp: React.FC<{ state: SimulatorState }> = ({ state }) => {
  const [tabs, setTabs] = useState<ChromeTab[]>([
    { id: '1', url: 'google.com', title: 'Google', content: 'google' },
    { id: '2', url: 'ai.google.dev', title: 'Google AI Studio', content: 'gemini' }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [inputUrl, setInputUrl] = useState('google.com');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [isTabsView, setIsTabsView] = useState(false);
  const [isIncognito, setIsIncognito] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>(['google.com', 'ai.google.dev', 'github.com']);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleNavigate = (input: string) => {
    let clean = input.trim();
    if (!clean) return;

    let targetContent: ChromeTab['content'] = 'custom';
    let newTitle = clean;
    let query = '';

    if (clean.toLowerCase().includes('google.com') && !clean.includes('search?q=')) {
      targetContent = 'google';
      newTitle = 'Google';
    } else if (clean.toLowerCase().includes('ai.google.dev') || clean.toLowerCase().includes('gemini')) {
      targetContent = 'gemini';
      newTitle = 'Google AI Studio & Gemini';
    } else if (clean.toLowerCase().includes('github.com')) {
      targetContent = 'github';
      newTitle = 'GitHub: Where the world builds software';
    } else if (clean.toLowerCase().includes('wikipedia') || clean.toLowerCase().startsWith('wiki ')) {
      targetContent = 'wiki';
      newTitle = 'Wikipedia';
      query = clean.replace(/^wiki\s*/i, '');
    } else {
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
    const newTab: ChromeTab = {
      id: Date.now().toString(),
      url: 'google.com',
      title: 'Google',
      content: 'google'
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

  const toggleBookmark = () => {
    if (bookmarks.includes(activeTab.url)) {
      setBookmarks(bookmarks.filter((b) => b !== activeTab.url));
    } else {
      setBookmarks([...bookmarks, activeTab.url]);
    }
  };

  return (
    <div className={`h-full flex flex-col ${isIncognito ? 'bg-neutral-950 text-neutral-100' : state.isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-950'} select-none font-sans relative`}>
      {/* TABS SWITCHER GRID */}
      {isTabsView ? (
        <div className="h-full flex flex-col pt-12 pb-4 px-4 bg-neutral-900 text-white z-20">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-500 via-yellow-500 to-blue-500 flex items-center justify-center font-bold text-xs text-white">
                C
              </div>
              <span className="font-bold text-sm">Chrome Tabs ({tabs.length})</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsIncognito(!isIncognito)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${isIncognito ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}
              >
                {isIncognito ? 'Incognito' : 'Normal'}
              </button>
              <button
                onClick={() => setIsTabsView(false)}
                className="text-blue-400 font-bold text-xs"
              >
                Done
              </button>
            </div>
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
                className={`aspect-[3/4] rounded-2xl p-3 flex flex-col justify-between border relative cursor-pointer shadow-lg ${
                  tab.id === activeTabId ? 'border-blue-500 bg-neutral-800' : 'border-neutral-700 bg-neutral-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold truncate max-w-[90px]">{tab.title}</span>
                  <button
                    onClick={(e) => closeTab(tab.id, e)}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-center text-3xl">
                  {tab.content === 'gemini' ? '✨' : tab.content === 'github' ? '🐙' : tab.content === 'wiki' ? '📖' : '🌐'}
                </div>
                <span className="text-[9px] text-neutral-400 truncate">{tab.url}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <button
              onClick={handleNewTab}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Tab</span>
            </button>
            <span className="text-[11px] text-neutral-400">Google Chrome for iOS</span>
          </div>
        </div>
      ) : null}

      {/* CHROME TOP URL BAR */}
      <div className={`pt-12 px-3 pb-2.5 border-b flex items-center gap-2 shadow-sm ${isIncognito ? 'bg-neutral-900 border-neutral-800' : state.isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'}`}>
        <div className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-inner ${isIncognito ? 'bg-neutral-950 border-neutral-800 text-neutral-200' : state.isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'}`}>
          <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <input
            type="text"
            value={isEditingUrl ? inputUrl : activeTab.url}
            onChange={(e) => setInputUrl(e.target.value)}
            onFocus={() => {
              setIsEditingUrl(true);
              setInputUrl(activeTab.url);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleNavigate(inputUrl);
              }
            }}
            className="flex-1 bg-transparent text-xs focus:outline-none truncate font-mono"
          />
          <button
            onClick={() => handleNavigate(inputUrl)}
            className="text-blue-500 hover:text-blue-400 text-xs font-bold"
          >
            Go
          </button>
        </div>

        {/* Tabs Counter Button */}
        <button
          onClick={() => setIsTabsView(true)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border transition-colors ${isIncognito ? 'border-neutral-700 bg-neutral-800 text-neutral-200' : state.isDarkMode ? 'border-neutral-700 bg-neutral-800 text-white' : 'border-neutral-300 bg-white text-neutral-800'}`}
        >
          {tabs.length}
        </button>
      </div>

      {/* WEB VIEW CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {activeTab.content === 'google' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto w-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-500 via-yellow-500 to-blue-500 flex items-center justify-center shadow-xl">
                <span className="text-2xl font-black text-white">C</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Google</h1>
            </div>

            {/* Google Search Input */}
            <div className={`w-full flex items-center gap-2 px-4 py-3 rounded-full border shadow-md mb-6 ${isIncognito ? 'bg-neutral-900 border-neutral-700' : state.isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}`}>
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search Google or type a URL"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNavigate((e.target as HTMLInputElement).value);
                  }
                }}
                className="flex-1 bg-transparent text-xs focus:outline-none"
              />
            </div>

            {/* Quick Shortcut App Tiles */}
            <div className="grid grid-cols-4 gap-4 w-full">
              {[
                { name: 'AI Studio', url: 'ai.google.dev', icon: '✨', bg: 'bg-indigo-600' },
                { name: 'GitHub', url: 'github.com', icon: '🐙', bg: 'bg-neutral-800' },
                { name: 'Wikipedia', url: 'wikipedia.org', icon: '📖', bg: 'bg-blue-600' },
                { name: 'Apple', url: 'apple.com', icon: '🍎', bg: 'bg-neutral-700' }
              ].map((shortcut, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigate(shortcut.url)}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-2xl ${shortcut.bg} flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform text-white`}>
                    {shortcut.icon}
                  </div>
                  <span className="text-[10px] font-medium truncate max-w-[64px]">{shortcut.name}</span>
                </button>
              ))}
            </div>

            {activeTab.query && (
              <div className="mt-8 text-left w-full bg-neutral-900/40 p-4 rounded-2xl border border-white/10">
                <p className="text-[11px] text-neutral-400 uppercase font-semibold mb-1">Search Results for "{activeTab.query}"</p>
                <div className="space-y-3">
                  <div className="p-2 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 cursor-pointer" onClick={() => handleNavigate('ai.google.dev')}>
                    <span className="text-xs font-bold text-blue-400 block">Google AI Studio — Build with Gemini</span>
                    <p className="text-[11px] text-neutral-300">Fast prototyping with Gemini 3.7 Flash, multimodal AI generation, and prompt engineering.</p>
                  </div>
                  <div className="p-2 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 cursor-pointer" onClick={() => handleNavigate('github.com')}>
                    <span className="text-xs font-bold text-blue-400 block">GitHub: Where the world builds software</span>
                    <p className="text-[11px] text-neutral-300">GitHub is where over 100 million developers shape the future of software, together.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab.content === 'gemini' && (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-sm font-bold">Google AI Studio & Gemini</h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">Gemini 3.7 Flash</span>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950 via-purple-950 to-neutral-900 border border-purple-500/30 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-purple-200">State-of-the-art AI for Developers</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Google AI Studio is the fastest way to prototype with Gemini models. Test prompts, generate code, build multimodal apps, and deploy seamlessly.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => alert("Gemini API is fully integrated server-side!")}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  Explore API
                </button>
                <button
                  onClick={() => handleNavigate('google.com')}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
                >
                  Back to Search
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab.content === 'github' && (
          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
              <div className="flex items-center gap-2">
                <span className="text-xl">🐙</span>
                <h2 className="text-sm font-bold">GitHub</h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">github.com</span>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-3">
              <h3 className="text-sm font-bold">Where the world builds software</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Hosting over 420 million repositories. Code review, project management, and collaborative software development.
              </p>
            </div>
          </div>
        )}

        {activeTab.content === 'wiki' && (
          <div className="flex-1 flex flex-col space-y-3">
            <h2 className="text-base font-bold">Wikipedia: {activeTab.query || 'Knowledge'}</h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Wikipedia is a multilingual free online encyclopedia written and maintained by a community of volunteers through open collaboration.
            </p>
          </div>
        )}
      </div>

      {/* CHROME BOTTOM TOOLBAR */}
      <div className={`p-3 border-t flex items-center justify-between ${isIncognito ? 'bg-neutral-900 border-neutral-800' : state.isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => handleNavigate('google.com')} className="text-blue-500 hover:text-blue-400">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={() => {}} className="text-neutral-500">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => handleNavigate(activeTab.url)} className="text-blue-500 hover:text-blue-400">
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <button onClick={toggleBookmark} className={bookmarks.includes(activeTab.url) ? 'text-amber-400' : 'text-neutral-400'}>
          <Star className={`w-4 h-4 ${bookmarks.includes(activeTab.url) ? 'fill-amber-400' : ''}`} />
        </button>

        <button onClick={() => setIsIncognito(!isIncognito)} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isIncognito ? 'bg-purple-600 text-white' : 'bg-neutral-700 text-neutral-300'}`} title="Toggle Incognito">
          🕶️
        </button>
      </div>
    </div>
  );
};
