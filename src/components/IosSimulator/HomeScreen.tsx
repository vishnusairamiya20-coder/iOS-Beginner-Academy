import React, { useState } from 'react';
import {
  Compass,
  Sun,
  Clock,
  Search,
  Calendar,
  X,
  Share2,
  Edit3,
  Music,
  Heart,
  Sparkles,
  ArrowRightLeft,
  Tv,
  Newspaper,
  Rocket,
  CreditCard,
  Video,
  Mail,
  FileText,
  MapPin,
  Camera,
  MessageCircle,
  Wifi
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
  // =========================================================================
  // PAGE 1: EXACT 16 APPS FROM SCREENSHOT (4x4 Grid)
  // =========================================================================
  // --- ROW 1 ---
  {
    id: 'facetime',
    name: 'FaceTime',
    iconBg: 'bg-gradient-to-b from-[#34D058] to-[#249D46] shadow-md border border-white/20',
    iconElement: (
      <svg viewBox="0 0 48 48" className="w-8 h-8 fill-white drop-shadow-sm">
        <rect x="7" y="12" width="22" height="24" rx="5" />
        <path d="M29 20 L39 14 C40.5 13 42 14 42 16 L42 32 C42 34 40.5 35 39 34 L29 28 Z" />
      </svg>
    ),
    defaultPage: 0
  },
  {
    id: 'calendar',
    name: 'Calendar',
    iconBg: 'bg-white shadow-md border border-black/5',
    iconElement: (
      <div className="w-full h-full flex flex-col items-center justify-center p-1 select-none">
        <span className="text-[10px] font-black tracking-tight text-[#FF3B30] uppercase leading-none">
          Wed
        </span>
        <span className="text-[25px] font-black tracking-tighter text-[#1C1C1E] leading-none mt-0.5">
          1
        </span>
      </div>
    ),
    defaultPage: 0
  },
  {
    id: 'photos',
    name: 'Photos',
    iconBg: 'bg-white shadow-md border border-black/5',
    iconElement: (
      <div className="w-full h-full flex items-center justify-center relative p-1">
        <svg viewBox="0 0 100 100" className="w-9 h-9">
          <ellipse cx="50" cy="27" rx="8" ry="16" fill="#FFCC00" />
          <ellipse cx="66" cy="34" rx="8" ry="16" fill="#FF9500" transform="rotate(45 66 34)" />
          <ellipse cx="73" cy="50" rx="8" ry="16" fill="#FF2D55" transform="rotate(90 73 50)" />
          <ellipse cx="66" cy="66" rx="8" ry="16" fill="#AF52DE" transform="rotate(135 66 66)" />
          <ellipse cx="50" cy="73" rx="8" ry="16" fill="#5856D6" transform="rotate(180 50 73)" />
          <ellipse cx="34" cy="66" rx="8" ry="16" fill="#007AFF" transform="rotate(225 34 66)" />
          <ellipse cx="27" cy="50" rx="8" ry="16" fill="#34C759" transform="rotate(270 27 50)" />
          <ellipse cx="34" cy="34" rx="8" ry="16" fill="#A4E737" transform="rotate(315 34 34)" />
          <circle cx="50" cy="50" r="9" fill="#FFFFFF" opacity="0.95" />
        </svg>
      </div>
    ),
    defaultPage: 0
  },
  {
    id: 'camera',
    name: 'Camera',
    iconBg: 'bg-gradient-to-b from-[#2e2f33] via-[#1c1d20] to-[#121316] shadow-md border border-white/15',
    iconElement: (
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#424449] to-[#16171a] p-1 shadow-inner flex items-center justify-center border border-white/20">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#0a0c12] via-[#172036] to-[#0c1326] relative overflow-hidden flex items-center justify-center border border-white/10">
            <div className="absolute top-1 left-2 w-3.5 h-1.5 rounded-full bg-cyan-400/60 blur-[0.6px] rotate-[-25deg]" />
            <div className="absolute bottom-1 right-2 w-2 h-1.5 rounded-full bg-indigo-500/50 blur-[0.5px]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#050608] border border-blue-400/40" />
          </div>
        </div>
      </div>
    ),
    defaultPage: 0
  },

  // --- ROW 2 ---
  {
    id: 'mail',
    name: 'Mail',
    iconBg: 'bg-gradient-to-b from-[#3aa0ff] via-[#1b7eff] to-[#0062e0] shadow-md border border-white/20',
    iconElement: (
      <div className="w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 48 48" className="w-8 h-8 fill-white drop-shadow-sm">
          <rect x="7" y="12" width="34" height="24" rx="5" fill="none" stroke="white" strokeWidth="3.5" />
          <path d="M8 15 L24 27 L40 15" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    defaultPage: 0
  },
  {
    id: 'notes',
    name: 'Notes',
    iconBg: 'bg-white shadow-md border border-black/5',
    iconElement: (
      <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-black/5 shadow-inner">
        <div className="h-3 w-full bg-[#E5A912] border-b border-[#C88E00] flex items-center justify-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7C5500]/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#7C5500]/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#7C5500]/40" />
        </div>
        <div className="flex-1 p-1.5 flex flex-col justify-around">
          <div className="w-full h-0.5 bg-neutral-200" />
          <div className="w-4/5 h-0.5 bg-neutral-200" />
          <div className="w-full h-0.5 bg-neutral-200" />
          <div className="w-3/5 h-0.5 bg-neutral-200" />
        </div>
      </div>
    ),
    defaultPage: 0
  },
  {
    id: 'clock',
    name: 'Clock',
    iconBg: 'bg-white shadow-md border border-black/5',
    iconElement: (
      <div className="w-full h-full flex items-center justify-center relative p-1 bg-white rounded-2xl">
        <div className="w-10 h-10 rounded-full border border-neutral-300 relative flex items-center justify-center bg-white shadow-inner">
          <div className="absolute top-0.5 w-0.5 h-1 bg-neutral-800" />
          <div className="absolute bottom-0.5 w-0.5 h-1 bg-neutral-800" />
          <div className="absolute left-0.5 w-1 h-0.5 bg-neutral-800" />
          <div className="absolute right-0.5 w-1 h-0.5 bg-neutral-800" />
          <div className="absolute w-0.5 h-3 bg-neutral-900 rounded-full origin-bottom -translate-y-1.5 rotate-[45deg]" />
          <div className="absolute w-0.5 h-4 bg-neutral-900 rounded-full origin-bottom -translate-y-2 rotate-[-60deg]" />
          <div className="absolute w-0.5 h-4.5 bg-[#FF9500] rounded-full origin-bottom -translate-y-2.25 rotate-[160deg]" />
          <div className="w-1 h-1 rounded-full bg-[#FF9500] z-10" />
        </div>
      </div>
    ),
    defaultPage: 0
  },
  {
    id: 'maps',
    name: 'Maps',
    iconBg: 'bg-white shadow-md border border-black/5 overflow-hidden',
    iconElement: (
      <div className="w-full h-full relative overflow-hidden bg-[#E8ECE9]">
        <div className="absolute top-0 right-0 w-8 h-8 bg-[#95BDE4] rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-8 h-8 bg-[#B5E2A8] rounded-tr-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-2.5 bg-[#FFA033] transform -rotate-45 shadow-xs" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#007AFF] drop-shadow-md">
            <path d="M12 2 L19 21 L12 17 L5 21 Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    ),
    defaultPage: 0
  },

  // --- ROW 3 ---
  {
    id: 'appletv',
    name: 'Apple TV',
    iconBg: 'bg-[#141416] shadow-md border border-white/15',
    iconElement: (
      <div className="w-full h-full flex items-center justify-center gap-0.5">
        <span className="text-white text-lg font-black leading-none -mt-0.5"></span>
        <span className="text-white text-sm font-bold tracking-tight">tv</span>
      </div>
    ),
    defaultPage: 0
  },
  {
    id: 'news',
    name: 'News',
    iconBg: 'bg-white shadow-md border border-black/5',
    iconElement: (
      <div className="w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-8 h-8">
          <path d="M8 8 L8 28 L14 28 L14 16 L22 28 L28 28 L28 8 L22 8 L22 20 L14 8 Z" fill="#FF2D55" />
        </svg>
      </div>
    ),
    defaultPage: 0
  },
  {
    id: 'appstore',
    name: 'App Store',
    iconBg: 'bg-gradient-to-b from-[#2BB7F6] to-[#007AFF] shadow-md border border-white/20',
    iconElement: (
      <div className="w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 48 48" className="w-8 h-8 fill-none stroke-white" strokeWidth="3.5" strokeLinecap="round">
          <line x1="24" y1="8" x2="10" y2="38" />
          <line x1="24" y1="8" x2="38" y2="38" />
          <line x1="14" y1="28" x2="34" y2="28" />
        </svg>
      </div>
    ),
    defaultPage: 0
  },
  {
    id: 'rocket',
    name: 'Booster',
    iconBg: 'bg-gradient-to-b from-[#FF5E62] via-[#FF3B30] to-[#E52D27] shadow-md border border-white/20',
    iconElement: (
      <div className="w-full h-full flex items-center justify-center relative">
        <svg viewBox="0 0 48 48" className="w-8 h-8 fill-white drop-shadow-md transform -rotate-45">
          <path d="M24 4 C18 10 16 18 16 26 L12 28 L12 34 L18 32 L20 38 L26 38 L24 32 L30 34 L30 28 L26 26 C26 18 24 10 24 4 Z" />
          <circle cx="24" cy="18" r="3" fill="#FF3B30" />
          <path d="M21 38 L24 45 L27 38 Z" fill="#FFD600" />
        </svg>
      </div>
    ),
    defaultPage: 0
  },

  // --- ROW 4 ---
  {
    id: 'health',
    name: 'Health',
    iconBg: 'bg-white shadow-md border border-black/5',
    iconElement: (
      <div className="w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <defs>
            <linearGradient id="healthHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2D55" />
              <stop offset="100%" stopColor="#FF375F" />
            </linearGradient>
          </defs>
          <path
            d="M16 27 C16 27 4 19 4 10 C4 5.5 7.5 2.5 11.5 2.5 C14.5 2.5 15.5 4 16 5 C16.5 4 17.5 2.5 20.5 2.5 C24.5 2.5 28 5.5 28 10 C28 19 16 27 16 27 Z"
            fill="url(#healthHeartGrad)"
            filter="drop-shadow(0 2px 4px rgba(255,45,85,0.4))"
          />
        </svg>
      </div>
    ),
    defaultPage: 0
  },
  {
    id: 'wallet',
    name: 'Wallet',
    iconBg: 'bg-[#18181B] shadow-md border border-white/15',
    iconElement: (
      <div className="w-full h-full flex flex-col justify-end p-1.5 pb-2 relative overflow-hidden">
        <div className="w-full h-3 rounded-t-md bg-[#FFD60A] -mb-1 opacity-90" />
        <div className="w-full h-3 rounded-t-md bg-[#FF9F0A] -mb-1 opacity-95" />
        <div className="w-full h-3.5 rounded-t-md bg-[#30B0C7] -mb-1" />
        <div className="w-full h-5 rounded-md bg-[#2C2C2E] border border-white/20 shadow-md flex items-center px-1.5 justify-between">
          <div className="w-2.5 h-2 rounded-xs bg-amber-400" />
          <span className="text-[7px] text-white/70 font-mono">•••• 9410</span>
        </div>
      </div>
    ),
    defaultPage: 0
  },
  {
    id: 'gemini',
    name: 'Spatial',
    iconBg: 'bg-white shadow-md border border-black/5',
    iconElement: (
      <div className="w-full h-full flex items-center justify-center relative p-1">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1a1c22] via-[#5b6375] to-[#c7d1e0] p-[1.5px] shadow-[0_4px_12px_rgba(0,0,0,0.4)] relative overflow-hidden flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#e6edf8] via-[#2a2d36] to-[#0d0e12] relative overflow-hidden flex items-center justify-center">
            <div className="absolute -top-1 -left-1 w-6 h-4 rounded-full bg-white/70 blur-[1px] rotate-[-20deg]" />
            <div className="absolute bottom-1 right-1 w-5 h-2 rounded-full bg-cyan-300/40 blur-[0.8px]" />
            <div className="w-3.5 h-3.5 rounded-full bg-white/20 blur-[2px]" />
          </div>
        </div>
      </div>
    ),
    defaultPage: 0
  },
  {
    id: 'settings',
    name: 'Settings',
    iconBg: 'bg-gradient-to-b from-[#8E8E93] to-[#636366] shadow-md border border-white/15',
    iconElement: (
      <div className="w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 48 48" className="w-8 h-8 fill-neutral-200 drop-shadow-sm">
          <path d="M24 16 A 8 8 0 1 0 24 32 A 8 8 0 1 0 24 16 Z M24 20 A 4 4 0 1 1 24 28 A 4 4 0 1 1 24 20 Z" />
          <path d="M42 22 L37.5 21.5 C37.2 20.3 36.7 19.1 36 18.1 L38.8 14.5 L35.5 11.2 L31.9 14 C30.9 13.3 29.7 12.8 28.5 12.5 L28 8 L20 8 L19.5 12.5 C18.3 12.8 17.1 13.3 16.1 14 L12.5 11.2 L9.2 14.5 L12 18.1 C11.3 19.1 10.8 20.3 10.5 21.5 L6 22 L6 30 L10.5 30.5 C10.8 31.7 11.3 32.9 12 33.9 L9.2 37.5 L12.5 40.8 L16.1 38 C17.1 38.7 18.3 39.2 19.5 39.5 L20 44 L28 44 L28.5 39.5 C29.7 39.2 30.9 38.7 31.9 38 L35.5 40.8 L38.8 37.5 L36 33.9 C36.7 32.9 37.2 31.7 37.5 30.5 L42 30 Z" />
        </svg>
      </div>
    ),
    defaultPage: 0
  },

  // =========================================================================
  // PAGE 2: APPS MOVED TO NEXT PAGE (Blinkit, WhatsApp, Founder, Chrome, etc.)
  // =========================================================================
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
    defaultPage: 1
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
    defaultPage: 1
  },
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
    defaultPage: 1
  },
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
            <path d="M4 4 C 16 14, 28 14, 38 5" stroke="#ff9900" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M37 2 C 39 5, 38 8, 35 10" stroke="#ff9900" strokeWidth="3" strokeLinecap="round" />
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
    id: 'calculator',
    name: 'Calculator',
    iconBg: 'bg-gradient-to-b from-neutral-800 to-black',
    iconElement: <span className="text-2xl font-bold text-amber-400">🧮</span>,
    defaultPage: 1
  },
  {
    id: 'weather',
    name: 'Weather',
    iconBg: 'bg-gradient-to-b from-sky-400 to-blue-600',
    iconElement: <Sun className="w-7 h-7 text-white" />,
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

  // Active page: use pageOverride if provided, else state.activeScreenPage
  const activePage = pageOverride !== undefined ? pageOverride : (state.activeScreenPage || 0);

  const getAppPage = (app: AppIconConfig): number => {
    if (customAppPages[app.id] !== undefined) {
      return customAppPages[app.id];
    }
    return app.defaultPage;
  };

  const pageApps = ALL_HOME_APPS.filter((app) => getAppPage(app) === activePage);

  // Vertical Frosted Dock Apps on Right Edge (Phone, Safari, Messages, Music)
  const dockApps: AppIconConfig[] = [
    {
      id: 'phone',
      name: 'Phone',
      iconBg: 'bg-gradient-to-b from-[#34D058] to-[#249D46] shadow-md border border-white/20',
      iconElement: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white drop-shadow-sm">
          <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24c1.12.42 2.33.65 3.54.65a1 1 0 011 1V20a1 1 0 01-1 1A18 18 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.21.23 2.42.65 3.54a1 1 0 01-.24 1.05l-2.29 2.2z" />
        </svg>
      ),
      defaultPage: 0
    },
    {
      id: 'safari',
      name: 'Safari',
      iconBg: 'bg-white shadow-md border border-black/5',
      iconElement: (
        <div className="w-full h-full flex items-center justify-center relative p-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#1C7DFE] to-[#0A57CB] relative flex items-center justify-center shadow-inner">
            {/* Compass dial tick marks */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-white/30" />
            </div>
            {/* Needle */}
            <div className="w-1.5 h-6 relative flex flex-col items-center justify-center transform -rotate-45">
              <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[10px] border-b-[#FF3B30]" />
              <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[10px] border-t-white" />
            </div>
          </div>
        </div>
      ),
      defaultPage: 0
    },
    {
      id: 'messages',
      name: 'Messages',
      badge: 2,
      iconBg: 'bg-gradient-to-b from-[#34D058] to-[#249D46] shadow-md border border-white/20',
      iconElement: (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white drop-shadow-sm">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
      ),
      defaultPage: 0
    },
    {
      id: 'music',
      name: 'Music',
      iconBg: 'bg-gradient-to-tr from-[#FC3C44] via-[#F92C54] to-[#E01A4F] shadow-md border border-white/20',
      iconElement: (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white drop-shadow-sm">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
      ),
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

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setDragStartX(clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartX === null) return;
    const clientX = 'changedTouches' in e ? (e as React.TouchEvent).changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = dragStartX - clientX;

    if (diff > 40 && activePage === 0) {
      handlePageChange(1);
    } else if (diff < -40 && activePage === 1) {
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
      className="h-full flex flex-col justify-between pt-4 pb-2 px-3 select-none relative font-sans overflow-hidden transition-all duration-300"
    >
      {/* Desert Sand Dunes Wallpaper */}
      <WallpaperBackground wallpaper={state.wallpaper || 'dunes'} isDarkMode={state.isDarkMode} />

      {/* TOP STATUS & PUNCH HOLE CAMERA AREA (Matching Screenshot) */}
      <div className="relative pt-1 z-30">
        {/* Top-Right Punch Hole Camera & 9:41 Wi-Fi Halo Indicator */}
        <div className="absolute top-1 right-2 flex flex-col items-center select-none pointer-events-none">
          {/* Punch hole camera */}
          <div className="w-5 h-5 rounded-full bg-black ring-1 ring-neutral-800 shadow-inner flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#050608] via-[#10192e] to-[#0d1424] relative">
              <div className="absolute top-0.5 left-0.5 w-1 h-0.5 rounded-full bg-cyan-300/80 blur-[0.3px]" />
            </div>
          </div>
          {/* Time & Wi-Fi halo ring beneath punch-hole */}
          <span className="text-[11px] font-black tracking-tight text-white/95 mt-1 drop-shadow-sm">
            9:41
          </span>
          <div className="flex items-center justify-center mt-0.5" title="Wi-Fi 7 Halo Active">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white/90" strokeWidth="2">
              <circle cx="12" cy="12" r="8" strokeDasharray="3 3" opacity="0.8" />
              <path d="M8 10 C9.5 8.5 14.5 8.5 16 10" strokeLinecap="round" />
              <path d="M10 13 C11 12 13 12 14 13" strokeLinecap="round" />
              <circle cx="12" cy="15.5" r="1" fill="white" />
            </svg>
          </div>
        </div>

        {/* Jiggle mode banner */}
        {state.isJiggleMode && (
          <div className="flex items-center justify-between bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white animate-fade-in shadow-lg mb-2">
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

        {/* ========================================================================= */}
        {/* TOP 2 WIDGETS (Matching Screenshot)                                      */}
        {/* ========================================================================= */}
        {activePage === 0 ? (
          <div className="grid grid-cols-2 gap-2.5 pr-14 pt-1">
            {/* 1. Left Weather Widget: San Francisco 54° Partly Cloudy */}
            <div
              onClick={() => onOpenApp('weather')}
              className="h-28 rounded-[28px] bg-[#1d6fa5]/85 backdrop-blur-md p-3 text-white flex flex-col justify-between shadow-xl border border-white/25 cursor-pointer hover:scale-[1.02] transition-transform select-none"
            >
              <div>
                <p className="text-[11px] font-bold text-sky-100 tracking-tight leading-none">
                  San Francisco
                </p>
                <p className="text-3xl font-light tracking-tighter mt-1">
                  54°
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-[10px] text-sky-100 font-semibold">
                  <span>⛅</span>
                  <span>Partly Cloudy</span>
                </div>
                <p className="text-[9px] text-sky-200 font-medium">
                  H:57° L:49°
                </p>
              </div>
            </div>

            {/* 2. Right Find My Live Location Widget: Channel St, SF with Memoji avatar */}
            <div
              onClick={() => onOpenApp('maps')}
              className="h-28 rounded-[28px] bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md relative overflow-hidden shadow-xl border border-white/30 cursor-pointer hover:scale-[1.02] transition-transform select-none p-2.5 flex flex-col justify-between"
            >
              {/* Pastel Street Map Background */}
              <div className="absolute inset-0 bg-[#E8ECE9] pointer-events-none">
                <div className="absolute top-0 right-0 w-20 h-16 bg-[#95BDE4] rounded-bl-full opacity-80" />
                <span className="absolute top-7 right-4 text-[7px] font-bold text-blue-900/60 uppercase tracking-widest rotate-[-15deg]">
                  Mission Creek
                </span>
                <div className="absolute top-12 left-0 right-0 h-2 bg-white border-y border-neutral-300" />
                <span className="absolute top-14 left-8 text-[6px] font-black text-neutral-400 uppercase tracking-wider">
                  CHANNEL ST
                </span>
              </div>

              {/* Live Memoji Avatar Pin (matches user screenshot avatar with bun & yellow hoodie!) */}
              <div className="relative z-10 flex flex-col items-center mx-auto mt-0.5">
                <div className="w-10 h-10 rounded-full bg-white shadow-xl p-0.5 border-2 border-emerald-400 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#fce5c8] flex items-center justify-center text-lg overflow-hidden">
                    👧🏽
                  </div>
                </div>
                {/* Green radar point */}
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-emerald-400 mx-auto -mt-0.5" />
              </div>

              {/* Bottom Address Info */}
              <div className="relative z-10 bg-white/95 dark:bg-black/85 backdrop-blur-sm px-2 py-1 rounded-xl shadow-xs border border-black/5">
                <span className="text-[8px] font-semibold text-neutral-400 uppercase leading-none block">
                  Now
                </span>
                <p className="text-[10px] font-black text-black dark:text-white leading-tight truncate">
                  Channel St
                </p>
                <p className="text-[8px] text-neutral-500 dark:text-neutral-400 truncate leading-none">
                  San Francisco, CA
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* PAGE 2 Top Widgets: Foldable Duo Intelligence & Tools */
          <div className="grid grid-cols-2 gap-2.5 pr-14 pt-1">
            <div
              onClick={() => onOpenApp('settings')}
              className="h-28 rounded-[28px] bg-neutral-900/85 backdrop-blur-md p-3 text-white flex flex-col justify-between shadow-xl border border-white/20 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase">iPhone Duo</span>
                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full">Page 2</span>
              </div>
              <div>
                <p className="text-lg font-bold">Liquidmetal</p>
                <p className="text-[10px] text-neutral-300">Dual 120Hz Displays</p>
              </div>
              <p className="text-[9px] text-emerald-400 font-semibold">Active & Synced</p>
            </div>

            <div
              onClick={() => onOpenApp('founder')}
              className="h-28 rounded-[28px] bg-gradient-to-tr from-amber-600/85 via-orange-600/85 to-indigo-800/85 backdrop-blur-md p-3 text-white flex flex-col justify-between shadow-xl border border-white/25 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <span className="text-[10px] font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full w-max">
                Founder Mode
              </span>
              <div>
                <p className="text-sm font-black">Vishnu Sai Ramiya</p>
                <p className="text-[9px] text-amber-100">Quantum Core Architect</p>
              </div>
              <p className="text-[9px] text-white/80">Tap to inspect credits</p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MAIN BODY: 4x4 APP GRID + RIGHT VERTICAL DOCK                            */}
      {/* ========================================================================= */}
      <div className="flex-1 flex items-start gap-2 pt-2 relative z-20">
        {/* Left Side: 4 columns x 4 rows Grid */}
        <div className="flex-1 grid grid-cols-4 gap-y-3.5 gap-x-1.5 min-h-[250px]">
          {pageApps.map((app) => (
            <div
              key={app.id}
              className={`flex flex-col items-center relative group ${
                state.isJiggleMode ? 'animate-wiggle' : ''
              }`}
            >
              {/* Move badge in jiggle mode */}
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
                className={`w-[52px] h-[52px] rounded-[15px] ${app.iconBg} flex items-center justify-center shadow-lg relative cursor-pointer active:scale-90 transition-transform`}
              >
                {app.iconElement}

                {/* Badge */}
                {app.badge && (
                  <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {app.badge}
                  </div>
                )}
              </div>

              {/* App Label */}
              <span className="text-[10px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] mt-1 truncate max-w-[56px] text-center">
                {app.name}
              </span>

              {/* Haptic Menu */}
              {activeMenuApp === app.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-14 left-1/2 -translate-x-1/2 w-48 bg-neutral-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-2xl z-40 text-xs text-white divide-y divide-neutral-800 animate-fade-in"
                >
                  <button
                    onClick={() => {
                      const target = activePage === 0 ? 1 : 0;
                      moveAppToOtherPage(app.id, target);
                    }}
                    className="w-full p-2 flex items-center justify-between hover:bg-neutral-800 rounded-xl transition-colors font-medium text-left text-blue-400 cursor-pointer"
                  >
                    <span>Move to Page {activePage === 0 ? '2' : '1'}</span>
                    <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                  <button
                    onClick={startJiggleMode}
                    className="w-full p-2 flex items-center justify-between hover:bg-neutral-800 rounded-xl transition-colors font-medium text-left cursor-pointer"
                  >
                    <span>Edit Home Screen</span>
                    <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => setActiveMenuApp(null)}
                    className="w-full p-2 flex items-center justify-between hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 text-left cursor-pointer"
                  >
                    <span>Cancel</span>
                    <X className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Side: Frosted Glass Vertical Dock (Matching Screenshot) */}
        {!hideDock && (
          <div className="w-[58px] rounded-[24px] bg-white/20 dark:bg-black/30 backdrop-blur-2xl border border-white/30 p-1.5 flex flex-col items-center justify-between gap-3 shadow-2xl">
            {dockApps.map((app) => (
              <div key={app.id} className="flex flex-col items-center">
                <div
                  onClick={() => onOpenApp(app.id)}
                  title={app.name}
                  className={`w-[48px] h-[48px] rounded-[14px] ${app.iconBg} flex items-center justify-center shadow-md relative cursor-pointer active:scale-90 transition-transform`}
                >
                  {app.iconElement}
                  {app.badge && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                      {app.badge}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM CONTROLS: Centered Pagination Dots + Bottom-Right Search Button    */}
      {/* ========================================================================= */}
      <div className="relative pt-1 pb-1 z-30 flex items-center justify-center">
        {/* Centered Pagination Dots • • */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-sm">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePageChange(0);
            }}
            className={`transition-all rounded-full cursor-pointer ${
              activePage === 0
                ? 'w-2 h-2 bg-white shadow-xs'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
            }`}
            title="Page 1: 16 Apps & SF Live Location"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePageChange(1);
            }}
            className={`transition-all rounded-full cursor-pointer ${
              activePage === 1
                ? 'w-2 h-2 bg-white shadow-xs'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
            }`}
            title="Page 2: Blinkit, WhatsApp, Founder & Commerce"
          />
        </div>

        {/* Floating Circular Frosted Glass Search Button in Bottom Right (Matching Screenshot) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdateState((s) => ({ ...s, isSpotlightOpen: true }));
          }}
          title="Search / Spotlight"
          className="absolute right-1 bottom-0 w-8 h-8 rounded-full bg-white/25 dark:bg-black/35 backdrop-blur-xl border border-white/30 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-white/90" />
        </button>
      </div>
    </div>
  );
};
