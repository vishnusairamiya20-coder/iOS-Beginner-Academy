import React, { useState } from 'react';
import { Search, Calculator, Globe, Sparkles, X, ArrowRight } from 'lucide-react';
import { SimulatorState, IosAppId } from '../../types';

interface SpotlightSearchProps {
  state: SimulatorState;
  onClose: () => void;
  onOpenApp: (app: IosAppId) => void;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  state,
  onClose,
  onOpenApp
}) => {
  const [query, setQuery] = useState('');

  const allApps: { id: IosAppId; name: string; icon: string; category: string }[] = [
    { id: 'settings', name: 'Settings', icon: '⚙️', category: 'System' },
    { id: 'messages', name: 'Messages', icon: '💬', category: 'Communication' },
    { id: 'camera', name: 'Camera', icon: '📷', category: 'Creativity' },
    { id: 'photos', name: 'Photos', icon: '🌸', category: 'Creativity' },
    { id: 'safari', name: 'Safari', icon: '🧭', category: 'Utilities' },
    { id: 'appstore', name: 'App Store', icon: '🅰️', category: 'Utilities' },
    { id: 'pinterest', name: 'Pinterest', icon: '📌', category: 'Social & Inspiration' },
    { id: 'weather', name: 'Weather', icon: '☀️', category: 'Information' },
    { id: 'calculator', name: 'Calculator', icon: '🔢', category: 'Utilities' },
    { id: 'clock', name: 'Clock', icon: '⏰', category: 'Utilities' },
    { id: 'music', name: 'Music', icon: '🎵', category: 'Entertainment' },
    { id: 'youtube', name: 'YouTube', icon: '▶️', category: 'Entertainment' }
  ];

  const filteredApps = query.trim()
    ? allApps.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : allApps.slice(0, 4);

  // Check if query is a math expression
  const evaluateMath = (expr: string) => {
    try {
      if (/^[0-9+\-*/. ()]+$/.test(expr) && expr.length > 2) {
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${expr})`)();
        return res !== undefined && !isNaN(res) ? String(res) : null;
      }
    } catch {
      return null;
    }
    return null;
  };

  const mathResult = evaluateMath(query);

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 bg-black/60 backdrop-blur-2xl z-40 p-4 pt-14 flex flex-col justify-start select-none text-white font-sans animate-fade-in"
    >
      <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
        {/* Search Bar Input */}
        <div className="flex items-center gap-2 bg-neutral-800/90 backdrop-blur border border-white/20 rounded-2xl px-3.5 py-2.5 shadow-xl">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search apps, web, or math (e.g. 45 * 12)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-hidden text-sm text-white placeholder-neutral-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Math Result if applicable */}
        {mathResult !== null && (
          <div
            onClick={() => {
              onClose();
              onOpenApp('calculator');
            }}
            className="p-3 rounded-2xl bg-neutral-900/90 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:bg-neutral-800"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold">
                =
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Calculator Result</p>
                <p className="text-lg font-bold font-mono text-amber-400">{mathResult}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400" />
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-1">
            {query ? 'Top App Hits' : 'Siri Suggestions'}
          </p>

          <div className="grid grid-cols-4 gap-2">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  onClose();
                  onOpenApp(app.id);
                }}
                className="flex flex-col items-center p-2 rounded-2xl bg-neutral-900/80 border border-white/10 hover:bg-neutral-800 transition-transform active:scale-95"
              >
                <span className="text-2xl mb-1">{app.icon}</span>
                <span className="text-[11px] font-medium text-white truncate w-full text-center">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Web Search fallback */}
        {query && (
          <div
            onClick={() => {
              onClose();
              onOpenApp('safari');
            }}
            className="p-3 rounded-2xl bg-neutral-900/80 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-neutral-800 text-xs"
          >
            <div className="flex items-center gap-2 text-blue-400">
              <Globe className="w-4 h-4" />
              <span>Search Safari for &quot;{query}&quot;</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          </div>
        )}
      </div>
    </div>
  );
};
