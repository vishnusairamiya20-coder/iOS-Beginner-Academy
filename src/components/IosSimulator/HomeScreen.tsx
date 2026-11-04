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
  Bookmark,
  ChevronLeft,
  ChevronRight,
  FoldHorizontal,
  ArrowRightLeft,
  Layers,
  Smartphone,
  Cpu,
  Zap,
  Globe
} from 'lucide-react';
import { SimulatorState, IosAppId } from '../../types';
import { WallpaperBackground } from './WallpaperBackground';
import { useLiveClock } from '../../utils/dateTime';

interface HomeScreenProps {
  state: SimulatorState;
  onOpenApp: (app: IosAppId) => void;
  onTriggerGesture?: (gesture: string) => void;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  pageOverride?: number; // When rendered inside unfolded dual-screen: 0 = Page 1, 1 = Page 2
  hideDock?: boolean;
}

export interface AppIconConfig {
  id: IosAppId;
  name: string;
  badge?: number | string;
  iconBg: string;
  iconElement: React.ReactNode;
  defaultPage: number; // 0 for Page 1, 1 for Page 2
}

export const ALL_HOME_APPS: AppIconConfig[] = [
  // --- PAGE 1: Daily Essentials & Intelligence ---
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
    ),
    defaultPage: 0
  },
  {
    id: 'gemini',
    name: 'Gemini',
    badge: '✦',
    iconBg: 'bg-gradient-to-b from-[#18191b] to-[#121315] shadow-md border border-white/15',
    iconElement: (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500/40 via-purple-500/30 to-pink-500/40 blur-sm pointer-events-none" />
        <svg className="w-7 h-7 relative z-10 filter drop-shadow-sm" viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id="geminiGradHome" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="50%" stopColor="#9B51E0" />
              <stop offset="100%" stopColor="#EA4335" />
            </linearGradient>
          </defs>
          <path
            d="M50 0 C 50 27.6, 72.4 50, 100 50 C 72.4 50, 50 72.4, 50 100 C 50 72.4, 27.6 50, 0 50 C 27.6 50, 50 27.6, 50 0 Z"
            fill="url(#geminiGradHome)"
          />
        </svg>
      </div>
    ),
    defaultPage: 0
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    badge: 3,
    iconBg: 'bg-gradient-to-b from-[#25D366] to-[#128C7E]',
    iconElement: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white drop-shadow-sm">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.07c-.24.68-1.2 1.28-1.78 1.36-.5.07-1.15.1-3.35-.8-2.82-1.15-4.63-4.04-4.77-4.23-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.66.5.24.57.82 2 .89 2.15.07.15.12.33.02.53-.1.19-.15.31-.3.48-.15.17-.32.38-.45.51-.15.15-.3.31-.13.61.17.29.77 1.26 1.64 2.04 1.13 1 2.08 1.31 2.37 1.46.29.15.46.13.63-.07.17-.19.73-.85.92-1.15.19-.29.38-.24.64-.15.26.1 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.7-.17 1.38z" />
      </svg>
    ),
    defaultPage: 0
  },
  {
    id: 'blinkit',
    name: 'Blinkit',
    badge: '10m',
    iconBg: 'bg-[#F7D300] shadow-md border border-amber-300/60',
    iconElement: (
      <div className="w-full h-full flex flex-col items-center justify-center p-1 relative overflow-hidden select-none">
        <div className="flex items-center tracking-tighter leading-none font-black text-[13px]">
          <span className="text-black">blink</span>
          <span className="text-[#0C831F]">it</span>
        </div>
        <span className="text-[7px] font-extrabold text-[#0C831F] bg-black/5 px-1 rounded-full uppercase tracking-wider mt-0.5">
          10 MINS
        </span>
      </div>
    ),
    defaultPage: 0
  },
  {
    id: 'messages',
    name: 'Messages',
    badge: 2,
    iconBg: 'bg-gradient-to-b from-green-400 to-green-600',
    iconElement: <MessageCircle className="w-7 h-7 text-white" />,
    defaultPage: 0
  },
  {
    id: 'camera',
    name: 'Camera',
    iconBg: 'bg-gradient-to-b from-neutral-700 to-neutral-900',
    iconElement: <Camera className="w-7 h-7 text-white" />,
    defaultPage: 0
  },
  {
    id: 'photos',
    name: 'Photos',
    iconBg: 'bg-gradient-to-tr from-amber-300 via-rose-400 to-indigo-500',
    iconElement: <span className="text-xl">🌸</span>,
    defaultPage: 0
  },
  {
    id: 'safari',
    name: 'Safari',
    iconBg: 'bg-gradient-to-b from-sky-400 to-blue-600',
    iconElement: <Compass className="w-7 h-7 text-white" />,
    defaultPage: 0
  },
  {
    id: 'settings',
    name: 'Settings',
    iconBg: 'bg-gradient-to-b from-neutral-600 to-neutral-800',
    iconElement: <Settings className="w-7 h-7 text-white" />,
    defaultPage: 0
  },
  {
    id: 'clock',
    name: 'Clock',
    iconBg: 'bg-black border border-neutral-700',
    iconElement: <Clock className="w-7 h-7 text-white" />,
    defaultPage: 0
  },
  {
    id: 'weather',
    name: 'Weather',
    iconBg: 'bg-gradient-to-b from-sky-400 to-blue-600',
    iconElement: <Sun className="w-7 h-7 text-white" />,
    defaultPage: 0
  },
  {
    id: 'phone',
    name: 'Phone',
    iconBg: 'bg-gradient-to-b from-green-400 to-green-600',
    iconElement: <span className="text-xl">📞</span>,
    defaultPage: 0
  },

  // --- PAGE 2: Apps moved to next page (Browsing, Commerce, Media, Utilities) ---
  {
    id: 'chrome',
    name: 'Chrome',
    iconBg: 'bg-white shadow-md border border-black/5',
    iconElement: (
      <div className="w-full h-full flex items-center justify-center p-1">
        <svg viewBox="0 0 48 48" className="w-8 h-8 drop-shadow-sm">
          <path fill="#4CAF50" d="M24 44c11.046 0 20-8.954 20-20h-8.001A12 12 0 0 1 24 36c-5.836 0-10.7-4.17-11.758-9.713L4.858 31.785C8.423 39.062 15.653 44 24 44z"/>
          <path fill="#FFC107" d="M44 24c0-2.457-.45-4.805-1.259-6.98l-7.384 12.787A11.968 11.968 0 0 1 24 36v8c11.046 0 20-8.954 20-20z"/>
          <path fill="#FF3D00" d="M24 4c8.347 0 15.577 4.938 19.142 12.215l-7.384 12.787A12.01 12.01 0 0 0 24 12c-5.836 0-10.7 4.17-11.758 9.713L4.858 16.215C8.423 8.938 15.653 4 24 4z"/>
          <circle fill="#FFFFFF" cx="24" cy="24" r="11"/>
          <circle fill="#1A73E8" cx="24" cy="24" r="8"/>
        </svg>
      </div>
    ),
    defaultPage: 1
  },
  {
    id: 'paytm',
    name: 'Paytm',
    badge: '₹',
    iconBg: 'bg-[#002E6E] shadow-md border border-white/10',
    iconElement: (
      <div className="w-full h-full flex flex-col items-center justify-center p-1">
        <span className="text-[14px] font-black tracking-tighter leading-none text-white">
          Pay<span className="text-[#00BAF2]">tm</span>
        </span>
        <span className="text-[7px] font-extrabold text-[#00BAF2] tracking-wider uppercase mt-0.5">
          UPI
        </span>
      </div>
    ),
    defaultPage: 1
  },
  {
    id: 'amazon',
    name: 'Amazon',
    badge: 3,
    iconBg: 'bg-white shadow-md border border-black/10',
    iconElement: (
      <div className="w-full h-full flex flex-col items-center justify-center p-1 relative overflow-hidden">
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-3 bg-[#00A8E1] rounded-sm opacity-90" />
        <div className="flex flex-col items-center mt-1">
          <span className="text-[18px] font-black text-[#131921] tracking-tighter leading-none">
            a
          </span>
          <svg className="w-6 h-2 -mt-0.5" viewBox="0 0 40 16" fill="none">
            <path
              d="M4 4 C 16 14, 28 14, 38 5"
              stroke="#ff9900"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M37 2 C 39 5, 38 8, 35 10"
              stroke="#ff9900"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    ),
    defaultPage: 1
  },
  {
    id: 'youtube',
    name: 'YouTube',
    badge: '●',
    iconBg: 'bg-gradient-to-b from-red-600 to-red-700',
    iconElement: <span className="text-2xl font-bold text-white">▶️</span>,
    defaultPage: 1
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
    ),
    defaultPage: 1
  },
  {
    id: 'appstore',
    name: 'App Store',
    iconBg: 'bg-gradient-to-b from-blue-400 to-blue-600',
    iconElement: <span className="text-xl font-bold text-white">A</span>,
    defaultPage: 1
  },
  {
    id: 'calculator',
    name: 'Calculator',
    iconBg: 'bg-gradient-to-b from-neutral-800 to-black',
    iconElement: <Calculator className="w-7 h-7 text-amber-400" />,
    defaultPage: 1
  },
  {
    id: 'music',
    name: 'Music',
    iconBg: 'bg-gradient-to-tr from-pink-500 via-rose-600 to-red-500',
    iconElement: <Music className="w-7 h-7 text-white" />,
    defaultPage: 1
  }
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  state,
  onOpenApp,
  onTriggerGesture,
  onUpdateState,
  pageOverride,
  hideDock = false
}) => {
  const [activeMenuApp, setActiveMenuApp] = useState<IosAppId | null>(null);
  const [customAppPages, setCustomAppPages] = useState<Record<string, number>>({});
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const liveClock = useLiveClock();

  // Active page: use pageOverride if provided (for dual-screen unfolded mode), else state.activeScreenPage
  const activePage = pageOverride !== undefined ? pageOverride : (state.activeScreenPage || 0);

  // Group apps by page, taking into account any user moves
  const getAppPage = (app: AppIconConfig): number => {
    if (customAppPages[app.id] !== undefined) {
      return customAppPages[app.id];
    }
    return app.defaultPage;
  };

  const pageApps = ALL_HOME_APPS.filter((app) => getAppPage(app) === activePage);

  const dockApps: AppIconConfig[] = [
    {
      id: 'phone',
      name: 'Phone',
      iconBg: 'bg-gradient-to-b from-green-400 to-green-600',
      iconElement: <span className="text-xl">📞</span>,
      defaultPage: 0
    },
    {
      id: 'safari',
      name: 'Safari',
      iconBg: 'bg-gradient-to-b from-sky-400 to-blue-600',
      iconElement: <Compass className="w-7 h-7 text-white" />,
      defaultPage: 0
    },
    {
      id: 'messages',
      name: 'Messages',
      badge: 2,
      iconBg: 'bg-gradient-to-b from-green-400 to-green-600',
      iconElement: <MessageCircle className="w-7 h-7 text-white" />,
      defaultPage: 0
    },
    {
      id: 'music',
      name: 'Music',
      iconBg: 'bg-gradient-to-tr from-pink-500 via-rose-600 to-red-500',
      iconElement: <Music className="w-7 h-7 text-white" />,
      defaultPage: 0
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

  const moveAppToOtherPage = (appId: IosAppId, targetPage: number) => {
    setCustomAppPages((prev) => ({
      ...prev,
      [appId]: targetPage
    }));
    setActiveMenuApp(null);
  };

  const handlePageChange = (newPage: number) => {
    onUpdateState((s) => ({ ...s, activeScreenPage: newPage }));
  };

  // Horizontal swipe handlers for page switching
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setDragStartX(clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartX === null) return;
    const clientX = 'changedTouches' in e ? (e as React.TouchEvent).changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = dragStartX - clientX;

    if (diff > 40 && activePage === 0) {
      // Swipe left -> Page 2
      handlePageChange(1);
    } else if (diff < -40 && activePage === 1) {
      // Swipe right -> Page 1
      handlePageChange(0);
    }
    setDragStartX(null);
  };

  return (
    <div
      onClick={() => {
        if (activeMenuApp) setActiveMenuApp(null);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      className="h-full flex flex-col justify-between pt-12 pb-3 px-3.5 select-none relative font-sans overflow-hidden transition-all duration-300"
    >
      {/* Dynamic Device Wallpaper */}
      <WallpaperBackground wallpaper={state.wallpaper} isDarkMode={state.isDarkMode} />

      {/* Main Home Screen Content (Widgets + App Grid) */}
      <div className="space-y-3.5 pt-1">
        {/* Jiggle mode banner */}
        {state.isJiggleMode && (
          <div className="flex items-center justify-between bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white animate-fade-in shadow-lg">
            <span className="text-[11px] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Editing Home Screen</span>
            </span>
            <button
              onClick={() => onUpdateState((s) => ({ ...s, isJiggleMode: false }))}
              className="px-2.5 py-0.5 rounded-full bg-white text-black font-bold text-[11px] hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

        {/* PAGE 1: Standard Weather + Date/Battery Widgets */}
        {activePage === 0 && (
          <div className={`grid grid-cols-2 gap-2.5 transition-transform ${state.isJiggleMode ? 'animate-wiggle' : ''}`}>
            {/* Weather Widget */}
            <div
              onClick={() => onOpenApp('weather')}
              className="h-28 rounded-3xl bg-sky-600/80 backdrop-blur-md p-3 text-white flex flex-col justify-between shadow-lg border border-white/20 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div>
                <p className="text-[11px] font-bold text-sky-100 flex items-center justify-between">
                  <span>Cupertino</span>
                  <span className="text-[9px] bg-white/20 px-1 rounded-sm">72°</span>
                </p>
                <p className="text-2xl font-light">72°</p>
              </div>
              <div className="flex items-center justify-between text-xs text-sky-100">
                <Sun className="w-5 h-5 text-amber-300 animate-spin-slow" />
                <span>Sunny • H:76°</span>
              </div>
            </div>

            {/* Calendar / Battery Widget */}
            <div
              onClick={() => onOpenApp('clock')}
              className="h-28 rounded-3xl bg-neutral-900/75 backdrop-blur-md p-3 text-white flex flex-col justify-between shadow-lg border border-white/20 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-red-400 uppercase">
                  {liveClock.dayOfWeekShort} • {liveClock.monthShort}
                </span>
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{liveClock.dayOfMonth}</p>
                <p className="text-[9px] text-neutral-300 font-medium truncate">
                  iPhone Duo • {state.batteryLevel}%
                </p>
              </div>
              <div className="w-full bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all"
                  style={{ width: `${state.batteryLevel}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: Foldable iPhone Duo Intelligence & System Widgets */}
        {activePage === 1 && (
          <div className={`grid grid-cols-2 gap-2.5 transition-transform ${state.isJiggleMode ? 'animate-wiggle' : ''}`}>
            {/* iPhone Duo Fold Status Widget */}
            <div
              onClick={() => onOpenApp('settings')}
              className="h-28 rounded-3xl bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-neutral-900/90 backdrop-blur-md p-3 text-white flex flex-col justify-between shadow-lg border border-indigo-400/30 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-300 uppercase flex items-center gap-1">
                  <FoldHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Duo Hinge</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/20">
                  {state.isFolded ? 'Cover' : `${state.foldAngle}° Flex`}
                </span>
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight">Liquidmetal</p>
                <p className="text-[10px] text-indigo-200 font-medium">Dual 120Hz ProMotion XDR</p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-indigo-300">
                <span>Book Fold</span>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
            </div>

            {/* Duo Multitasking & Quick Controls Widget */}
            <div
              onClick={() => onUpdateState((s) => ({ ...s, isControlCenterOpen: true }))}
              className="h-28 rounded-3xl bg-neutral-900/75 backdrop-blur-md p-3 text-white flex flex-col justify-between shadow-lg border border-white/20 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Quick Tools</span>
                </span>
                <span className="text-[9px] text-neutral-400">Page 2</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 my-auto">
                <div className="p-1.5 rounded-xl bg-white/10 flex items-center gap-1.5 text-[10px]">
                  <span>🔦</span>
                  <span className="font-semibold truncate">Torch</span>
                </div>
                <div className="p-1.5 rounded-xl bg-white/10 flex items-center gap-1.5 text-[10px]">
                  <span>🧮</span>
                  <span className="font-semibold truncate">Math</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] text-neutral-300">
                <span>Dual App Split</span>
                <span className="text-blue-400 font-bold">Enabled</span>
              </div>
            </div>
          </div>
        )}

        {/* Grid of App Icons for Current Page (4 columns) */}
        <div className="grid grid-cols-4 gap-y-3.5 gap-x-2 pt-1 min-h-[220px]">
          {pageApps.map((app) => (
            <div
              key={app.id}
              className={`flex flex-col items-center relative group ${
                state.isJiggleMode ? 'animate-wiggle' : ''
              }`}
            >
              {/* Minus delete/move badge in jiggle mode */}
              {state.isJiggleMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const target = activePage === 0 ? 1 : 0;
                    moveAppToOtherPage(app.id, target);
                  }}
                  title={`Move ${app.name} to Page ${activePage === 0 ? '2' : '1'}`}
                  className="absolute -top-1.5 -left-1 w-5 h-5 rounded-full bg-blue-600 border border-white text-white flex items-center justify-center z-20 font-bold text-[10px] shadow-md hover:bg-blue-500 cursor-pointer"
                >
                  ⇄
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
              <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] mt-1 truncate max-w-[58px] text-center">
                {app.name}
              </span>

              {/* Haptic Touch Menu Popup */}
              {activeMenuApp === app.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-16 left-1/2 -translate-x-1/2 w-48 bg-neutral-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-2xl z-40 text-xs text-white divide-y divide-neutral-800 animate-fade-in"
                >
                  <button
                    onClick={() => {
                      const target = activePage === 0 ? 1 : 0;
                      moveAppToOtherPage(app.id, target);
                    }}
                    className="w-full p-2 flex items-center justify-between hover:bg-neutral-800 rounded-xl transition-colors font-medium text-left text-blue-400"
                  >
                    <span>Move to Page {activePage === 0 ? '2' : '1'}</span>
                    <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
                  </button>
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
                    className="w-full p-2 flex items-center justify-between hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 text-left"
                  >
                    <span>Cancel</span>
                    <X className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Area: Page Indicator Dots, Spotlight Pill & Glassmorphic Dock */}
      <div className="space-y-2">
        {/* iOS Pagination Dots & Page Jumper */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {pageOverride === undefined ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/15 shadow-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePageChange(0);
                }}
                className={`transition-all rounded-full cursor-pointer ${
                  activePage === 0
                    ? 'w-4 h-1.5 bg-white shadow-xs'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
                title="Go to Home Screen Page 1"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePageChange(1);
                }}
                className={`transition-all rounded-full cursor-pointer ${
                  activePage === 1
                    ? 'w-4 h-1.5 bg-white shadow-xs'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
                title="Go to Home Screen Page 2"
              />
              <span className="text-[10px] font-bold text-white/90 ml-1.5 tracking-tight">
                Page {activePage + 1}/2
              </span>
            </div>
          ) : (
            <div className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 text-[10px] font-semibold tracking-wide">
              {activePage === 0 ? 'Left Display • Page 1' : 'Right Display • Page 2'}
            </div>
          )}

          {/* Spotlight Search Pill */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateState((s) => ({ ...s, isSpotlightOpen: true }));
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold shadow-md hover:bg-black/60 transition-colors cursor-pointer"
          >
            <Search className="w-3 h-3 text-white/80" />
            <span>Search</span>
          </button>
        </div>

        {/* Glassmorphic Dock (Shown unless hideDock is true) */}
        {!hideDock && (
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
        )}
      </div>
    </div>
  );
};
