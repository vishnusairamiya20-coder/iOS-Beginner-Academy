import React, { useState } from 'react';
import {
  Settings,
  MessageCircle,
  Camera,
  Compass,
  Sun,
  Calculator,
  Clock,
  Search,
  Battery,
  Calendar,
  X,
  Share2,
  Edit3,
  Trash2,
  Music,
  MapPin,
  Heart,
  Sparkles,
  Award,
  Bookmark
} from 'lucide-react';
import { SimulatorState, IosAppId } from '../../types';
import { WallpaperBackground } from './WallpaperBackground';
import { useLiveClock } from '../../utils/dateTime';

interface HomeScreenProps {
  state: SimulatorState;
  onOpenApp: (app: IosAppId) => void;
  onTriggerGesture?: (gesture: string) => void;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
}

interface AppIconConfig {
  id: IosAppId;
  name: string;
  badge?: number | string;
  iconBg: string;
  iconElement: React.ReactNode;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  state,
  onOpenApp,
  onTriggerGesture,
  onUpdateState
}) => {
  const [activeMenuApp, setActiveMenuApp] = useState<IosAppId | null>(null);
  const liveClock = useLiveClock();

  const mainApps: AppIconConfig[] = [
    {
      id: 'founder',
      name: 'Founder',
      badge: '★',
      iconBg: 'bg-gradient-to-tr from-amber-500 via-orange-600 to-indigo-700',
      iconElement: (
        <div className="flex flex-col items-center">
          <Sparkles className="w-6 h-6 text-amber-200" />
          <span className="text-[8px] font-black tracking-tighter text-white uppercase -mt-0.5">VSR</span>
        </div>
      )
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      badge: '●',
      iconBg: 'bg-gradient-to-b from-[#E60023] via-[#cc001f] to-[#ad081b]',
      iconElement: (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-2xl font-black text-white italic tracking-tighter">P</span>
        </div>
      )
    },
    {
      id: 'settings',
      name: 'Settings',
      iconBg: 'bg-gradient-to-b from-neutral-600 to-neutral-800',
      iconElement: <Settings className="w-7 h-7 text-white" />
    },
    {
      id: 'messages',
      name: 'Messages',
      badge: 2,
      iconBg: 'bg-gradient-to-b from-green-400 to-green-600',
      iconElement: <MessageCircle className="w-7 h-7 text-white" />
    },
    {
      id: 'camera',
      name: 'Camera',
      iconBg: 'bg-gradient-to-b from-neutral-700 to-neutral-900',
      iconElement: <Camera className="w-7 h-7 text-white" />
    },
    {
      id: 'photos',
      name: 'Photos',
      iconBg: 'bg-gradient-to-tr from-amber-300 via-rose-400 to-indigo-500',
      iconElement: <span className="text-xl">🌸</span>
    },
    {
      id: 'weather',
      name: 'Weather',
      iconBg: 'bg-gradient-to-b from-sky-400 to-blue-600',
      iconElement: <Sun className="w-7 h-7 text-white" />
    },
    {
      id: 'calculator',
      name: 'Calculator',
      iconBg: 'bg-gradient-to-b from-neutral-800 to-black',
      iconElement: <Calculator className="w-7 h-7 text-amber-400" />
    },
    {
      id: 'clock',
      name: 'Clock',
      iconBg: 'bg-black border border-neutral-700',
      iconElement: <Clock className="w-7 h-7 text-white" />
    },
    {
      id: 'appstore',
      name: 'App Store',
      iconBg: 'bg-gradient-to-b from-blue-400 to-blue-600',
      iconElement: <span className="text-xl font-bold text-white">A</span>
    },
    {
      id: 'youtube',
      name: 'YouTube',
      badge: '●',
      iconBg: 'bg-gradient-to-b from-red-600 to-red-700',
      iconElement: <span className="text-2xl font-bold text-white">▶️</span>
    },
    {
      id: 'music',
      name: 'Music',
      iconBg: 'bg-gradient-to-tr from-pink-500 via-rose-600 to-red-500',
      iconElement: <Music className="w-7 h-7 text-white" />
    }
  ];

  const dockApps: AppIconConfig[] = [
    {
      id: 'phone',
      name: 'Phone',
      iconBg: 'bg-gradient-to-b from-green-400 to-green-600',
      iconElement: <span className="text-xl">📞</span>
    },
    {
      id: 'safari',
      name: 'Safari',
      iconBg: 'bg-gradient-to-b from-sky-400 to-blue-600',
      iconElement: <Compass className="w-7 h-7 text-white" />
    },
    {
      id: 'messages',
      name: 'Messages',
      badge: 2,
      iconBg: 'bg-gradient-to-b from-green-400 to-green-600',
      iconElement: <MessageCircle className="w-7 h-7 text-white" />
    },
    {
      id: 'music',
      name: 'Music',
      iconBg: 'bg-gradient-to-tr from-pink-500 via-rose-600 to-red-500',
      iconElement: <Music className="w-7 h-7 text-white" />
    }
  ];

  const handleAppLongPress = (appId: IosAppId, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenuApp(appId);
    onTriggerGesture?.('long_press_app_icon');
  };

  const startJiggleMode = () => {
    onUpdateState((s) => ({ ...s, isJiggleMode: true }));
    setActiveMenuApp(null);
  };

  return (
    <div
      onClick={() => {
        if (activeMenuApp) setActiveMenuApp(null);
      }}
      className="h-full flex flex-col justify-between pt-12 pb-3 px-4 select-none relative font-sans overflow-hidden"
    >
      {/* Dynamic Device Wallpaper */}
      <WallpaperBackground wallpaper={state.wallpaper} isDarkMode={state.isDarkMode} />
      {/* Top Widgets Row */}
      <div className="space-y-4 pt-2">
        {/* Jiggle mode banner */}
        {state.isJiggleMode && (
          <div className="flex items-center justify-between bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white animate-fade-in">
            <span className="text-[11px] font-semibold">Editing Home Screen</span>
            <button
              onClick={() => onUpdateState((s) => ({ ...s, isJiggleMode: false }))}
              className="px-2.5 py-0.5 rounded-full bg-white text-black font-bold text-[11px] hover:bg-neutral-200"
            >
              Done
            </button>
          </div>
        )}

        {/* 2 Medium Widgets */}
        <div className={`grid grid-cols-2 gap-3 transition-transform ${state.isJiggleMode ? 'animate-wiggle' : ''}`}>
          {/* Weather Widget */}
          <div
            onClick={() => onOpenApp('weather')}
            className="h-28 rounded-3xl bg-sky-600/80 backdrop-blur-md p-3 text-white flex flex-col justify-between shadow-lg border border-white/20 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <div>
              <p className="text-[11px] font-bold text-sky-100">Cupertino</p>
              <p className="text-2xl font-light">72°</p>
            </div>
            <div className="flex items-center justify-between text-xs text-sky-100">
              <Sun className="w-5 h-5 text-amber-300" />
              <span>Sunny • H:76°</span>
            </div>
          </div>

          {/* Calendar / Battery Widget */}
          <div
            onClick={() => onOpenApp('clock')}
            className="h-28 rounded-3xl bg-neutral-900/70 backdrop-blur-md p-3 text-white flex flex-col justify-between shadow-lg border border-white/20 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-red-400 uppercase">{liveClock.dayOfWeekShort} • {liveClock.monthShort}</span>
              <Battery className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{liveClock.dayOfMonth}</p>
              <p className="text-[10px] text-neutral-300">iPhone Battery {state.batteryLevel}%</p>
            </div>
            <div className="w-full bg-neutral-700 h-1 rounded-full overflow-hidden">
              <div
                className="bg-green-400 h-full rounded-full transition-all"
                style={{ width: `${state.batteryLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Grid of Main App Icons (4 per row) */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 pt-2">
          {mainApps.map((app) => (
            <div
              key={app.id}
              className={`flex flex-col items-center relative group ${
                state.isJiggleMode ? 'animate-wiggle' : ''
              }`}
            >
              {/* Minus delete badge in jiggle mode */}
              {state.isJiggleMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Just simulated deletion
                  }}
                  className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-neutral-700 border border-white text-white flex items-center justify-center z-20 font-bold text-xs shadow-md"
                >
                  −
                </button>
              )}

              {/* Squircle App Icon */}
              <div
                onClick={() => onOpenApp(app.id)}
                onContextMenu={(e) => handleAppLongPress(app.id, e)}
                className={`w-14 h-14 rounded-2xl ${app.iconBg} flex items-center justify-center shadow-lg relative cursor-pointer active:scale-90 transition-transform`}
              >
                {app.iconElement}

                {/* Notification Badge */}
                {app.badge && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {app.badge}
                  </div>
                )}
              </div>

              {/* App Label */}
              <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-1 truncate max-w-[58px] text-center">
                {app.name}
              </span>

              {/* Haptic Touch Menu Popup */}
              {activeMenuApp === app.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-16 left-1/2 -translate-x-1/2 w-44 bg-neutral-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-2xl z-40 text-xs text-white divide-y divide-neutral-800 animate-fade-in"
                >
                  <button
                    onClick={startJiggleMode}
                    className="w-full p-2 flex items-center justify-between hover:bg-neutral-800 rounded-xl transition-colors font-medium text-left"
                  >
                    <span>Edit Home Screen</span>
                    <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => setActiveMenuApp(null)}
                    className="w-full p-2 flex items-center justify-between hover:bg-neutral-800 rounded-xl transition-colors text-left"
                  >
                    <span>Share App</span>
                    <Share2 className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => setActiveMenuApp(null)}
                    className="w-full p-2 flex items-center justify-between hover:bg-neutral-800 rounded-xl transition-colors text-red-400 text-left"
                  >
                    <span>Remove App</span>
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Area: Spotlight Search Pill & Dock */}
      <div className="space-y-3">
        {/* Spotlight Search Pill */}
        <div className="flex justify-center">
          <button
            onClick={() => onUpdateState((s) => ({ ...s, isSpotlightOpen: true }))}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold shadow-md hover:bg-black/60 transition-colors cursor-pointer"
          >
            <Search className="w-3 h-3 text-white/80" />
            <span>Search</span>
          </button>
        </div>

        {/* Glassmorphic Dock */}
        <div className="rounded-[30px] bg-white/25 dark:bg-black/35 backdrop-blur-2xl p-2.5 grid grid-cols-4 gap-2 border border-white/25 shadow-xl">
          {dockApps.map((app, idx) => (
            <div key={`${app.id}-${idx}`} className="flex flex-col items-center">
              <div
                onClick={() => onOpenApp(app.id)}
                className={`w-13 h-13 rounded-2xl ${app.iconBg} flex items-center justify-center shadow-md relative cursor-pointer active:scale-90 transition-transform`}
              >
                {app.iconElement}
                {app.badge && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {app.badge}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
