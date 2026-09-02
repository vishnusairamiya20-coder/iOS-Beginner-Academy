import React from 'react';
import { X, Smartphone, Trash2 } from 'lucide-react';
import { SimulatorState, IosAppId } from '../../types';

interface AppSwitcherProps {
  state: SimulatorState;
  onClose: () => void;
  onSelectApp: (app: IosAppId) => void;
  onRemoveApp: (app: IosAppId) => void;
}

export const AppSwitcher: React.FC<AppSwitcherProps> = ({
  state,
  onClose,
  onSelectApp,
  onRemoveApp
}) => {
  const appNames: Record<IosAppId, { name: string; icon: string }> = {
    home: { name: 'Home', icon: '📱' },
    settings: { name: 'Settings', icon: '⚙️' },
    messages: { name: 'Messages', icon: '💬' },
    camera: { name: 'Camera', icon: '📷' },
    photos: { name: 'Photos', icon: '🌸' },
    safari: { name: 'Safari', icon: '🧭' },
    chrome: { name: 'Chrome', icon: '🌐' },
    appstore: { name: 'App Store', icon: '🅰️' },
    weather: { name: 'Weather', icon: '☀️' },
    calculator: { name: 'Calculator', icon: '🔢' },
    clock: { name: 'Clock', icon: '⏰' },
    notes: { name: 'Notes', icon: '📝' },
    phone: { name: 'Phone', icon: '📞' },
    founder: { name: 'Founder', icon: '★' },
    maps: { name: 'Maps', icon: '🗺️' },
    health: { name: 'Health', icon: '❤️' },
    music: { name: 'Music', icon: '🎵' },
    youtube: { name: 'YouTube', icon: '▶️' },
    pinterest: { name: 'Pinterest', icon: '📌' }
  };

  const appsInSwitcher = state.recentApps.length > 0
    ? state.recentApps
    : (['settings', 'messages', 'camera', 'weather'] as IosAppId[]);

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 bg-black/75 backdrop-blur-2xl z-40 p-4 pt-16 flex flex-col justify-between select-none text-white font-sans overflow-hidden animate-fade-in"
    >
      <div className="text-center text-xs text-white/60">
        Swipe card UP to force close • Tap to switch
      </div>

      {/* 3D Stack Carousel */}
      <div
        className="flex-1 flex items-center gap-4 overflow-x-auto py-4 px-2 snap-x snap-mandatory"
        onClick={(e) => e.stopPropagation()}
      >
        {appsInSwitcher.map((appId) => {
          const info = appNames[appId] || { name: appId, icon: '📱' };
          return (
            <div
              key={appId}
              className="snap-center shrink-0 w-[200px] h-[320px] rounded-3xl bg-neutral-900 border border-white/20 shadow-2xl flex flex-col overflow-hidden relative group transition-transform hover:scale-105"
            >
              {/* App header in card */}
              <div className="p-3 bg-neutral-800/90 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base">{info.icon}</span>
                  <span className="font-bold text-xs">{info.name}</span>
                </div>
                <button
                  onClick={() => onRemoveApp(appId)}
                  className="w-6 h-6 rounded-full bg-neutral-700 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                  title="Close App"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card Preview Body */}
              <div
                onClick={() => onSelectApp(appId)}
                className="flex-1 p-4 flex flex-col items-center justify-center bg-gradient-to-b from-neutral-800 to-neutral-950 cursor-pointer text-center space-y-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-neutral-700/60 flex items-center justify-center text-3xl shadow-inner">
                  {info.icon}
                </div>
                <p className="text-xs font-semibold text-white/80">Tap to Resume</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Swipe Home hint */}
      <div className="text-center pb-2">
        <div className="w-28 h-1.5 bg-white/60 rounded-full mx-auto" />
      </div>
    </div>
  );
};
