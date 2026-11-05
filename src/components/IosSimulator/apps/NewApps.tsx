import React, { useState } from 'react';
import {
  Video,
  Mic,
  MicOff,
  PhoneOff,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Mail,
  Search,
  Star,
  Edit,
  FileText,
  CheckSquare,
  MapPin,
  Navigation,
  Compass,
  Tv,
  Play,
  Film,
  Newspaper,
  TrendingUp,
  Flame,
  Rocket,
  Zap,
  Cpu,
  Gauge,
  Activity,
  Heart,
  CreditCard,
  Wifi,
  Sparkles,
  Check
} from 'lucide-react';
import { SimulatorState, IosAppId } from '../../../types';

interface AppProps {
  state: SimulatorState;
  onClose?: () => void;
  onOpenApp?: (app: IosAppId) => void;
  onUpdateState?: (updater: (prev: SimulatorState) => SimulatorState) => void;
}

// 1. FaceTime App
export const FaceTimeApp: React.FC<AppProps> = ({ state, onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'recents' | 'contacts'>('recents');

  return (
    <div className="h-full flex flex-col bg-[#121214] text-white font-sans select-none overflow-hidden">
      <div className="pt-12 px-4 pb-3 flex items-center justify-between border-b border-neutral-800">
        <h1 className="text-xl font-bold">FaceTime</h1>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-full bg-neutral-800 text-xs font-semibold hover:bg-neutral-700 cursor-pointer"
        >
          Done
        </button>
      </div>

      <div className="p-3 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('recents')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'recents' ? 'bg-green-600 text-white shadow-md' : 'bg-neutral-800 text-neutral-400'
          }`}
        >
          New FaceTime
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'contacts' ? 'bg-neutral-700 text-white shadow-md' : 'bg-neutral-800 text-neutral-400'
          }`}
        >
          Create Link
        </button>
      </div>

      {/* Camera Live Mock Video Preview */}
      <div className="mx-3 rounded-2xl bg-neutral-900 border border-neutral-800 p-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[160px]">
        <div className="absolute inset-0 bg-gradient-to-tr from-green-950/30 via-neutral-900 to-indigo-950/30" />
        <div className="relative z-10 flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center text-3xl shadow-lg ring-4 ring-green-500/20">
            👤
          </div>
          <p className="font-bold text-sm">Vishnu Sai Ramiya</p>
          <span className="text-[11px] text-green-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            FaceTime HD Camera Ready
          </span>
        </div>

        <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              isMuted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-1">Recent Calls</p>
        {[
          { name: 'Sarah Chen (Design)', time: 'Yesterday', icon: '👩🏻‍💻', type: 'FaceTime Video' },
          { name: 'Alex Rivera', time: 'Monday', icon: '🧑🏽', type: 'FaceTime Audio' },
          { name: 'Quantum Core Team', time: 'Friday', icon: '👥', type: 'Group FaceTime' }
        ].map((c) => (
          <div key={c.name} className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{c.icon}</span>
              <div>
                <p className="text-xs font-bold">{c.name}</p>
                <p className="text-[10px] text-neutral-400">{c.type} • {c.time}</p>
              </div>
            </div>
            <button className="p-2 rounded-full bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white transition-colors cursor-pointer">
              <Video className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Calendar App
export const CalendarApp: React.FC<AppProps> = ({ state, onClose }) => {
  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} font-sans select-none overflow-hidden`}>
      <div className="pt-12 px-4 pb-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Wednesday</span>
          <h1 className="text-2xl font-black">October 1</h1>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold cursor-pointer"
        >
          Done
        </button>
      </div>

      {/* Week Strip */}
      <div className="grid grid-cols-7 text-center py-2 border-b border-neutral-200 dark:border-neutral-800 text-xs">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <span key={i} className="text-neutral-400 font-semibold">{day}</span>
        ))}
        {[28, 29, 30, 1, 2, 3, 4].map((date, i) => (
          <div key={i} className="flex flex-col items-center py-1">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                date === 1
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {date}
            </span>
          </div>
        ))}
      </div>

      {/* Events Schedule */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Today&apos;s Schedule</p>
        <div className="p-3 rounded-2xl bg-red-500/10 border-l-4 border-red-500 space-y-1">
          <div className="flex justify-between text-xs font-bold text-red-500">
            <span>10:00 AM - 11:30 AM</span>
            <span>Channel St Studio</span>
          </div>
          <h3 className="font-bold text-sm">iPhone Duo Foldable Launch Review</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Reviewing hinge tactile feedback and multi-screen layout</p>
        </div>

        <div className="p-3 rounded-2xl bg-blue-500/10 border-l-4 border-blue-500 space-y-1">
          <div className="flex justify-between text-xs font-bold text-blue-500">
            <span>2:00 PM - 3:00 PM</span>
            <span>Online</span>
          </div>
          <h3 className="font-bold text-sm">Vishnu Sai Ramiya Founder AMA</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Keynote on next-gen Quantum Core architecture</p>
        </div>

        <div className="p-3 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 space-y-1">
          <div className="flex justify-between text-xs font-bold text-amber-500">
            <span>5:00 PM - 6:30 PM</span>
            <span>Fitness Lab</span>
          </div>
          <h3 className="font-bold text-sm">Apple Health Ring Workout</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Outdoor Run & Strength Training</p>
        </div>
      </div>
    </div>
  );
};

// 3. Apple Mail App
export const MailApp: React.FC<AppProps> = ({ state, onClose }) => {
  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} font-sans select-none overflow-hidden`}>
      <div className="pt-12 px-4 pb-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
        <h1 className="text-2xl font-black">All Inboxes</h1>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold cursor-pointer"
        >
          Done
        </button>
      </div>

      <div className="p-3 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-400 text-xs">
          <Search className="w-3.5 h-3.5" />
          <span>Search Mail</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-neutral-200 dark:divide-neutral-800">
        {[
          { sender: 'Apple Developer', subject: 'Your iPhone Duo Build is Ready', time: '9:24 AM', unread: true, preview: 'The foldable dual-screen simulation test flight passed all security and performance checks with 120 FPS.' },
          { sender: 'Vishnu Sai Ramiya', subject: 'Architecture Update & Quantum Core', time: 'Yesterday', unread: true, preview: 'Welcome to the revolutionary iOS 27 release with ultra-refined iconography and liquidmetal precision.' },
          { sender: 'Blinkit Orders', subject: 'Delivered in 8 minutes! ⚡', time: 'Monday', unread: false, preview: 'Your organic grocery basket and snacks have arrived at Channel St, San Francisco.' }
        ].map((m, i) => (
          <div key={i} className="p-3.5 bg-white dark:bg-black hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer space-y-1">
            <div className="flex items-center justify-between">
              <span className={`text-xs ${m.unread ? 'font-black text-blue-500' : 'font-bold'}`}>{m.sender}</span>
              <span className="text-[10px] text-neutral-400">{m.time}</span>
            </div>
            <p className={`text-xs ${m.unread ? 'font-bold' : 'font-medium'}`}>{m.subject}</p>
            <p className="text-[11px] text-neutral-500 line-clamp-2">{m.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Apple Notes App
export const NotesApp: React.FC<AppProps> = ({ state, onClose }) => {
  const [notes, setNotes] = useState([
    { id: '1', title: 'iPhone Duo Foldable Ideas', date: '9:41 AM', content: '1. Smooth titanium spine fold\n2. Dual screen multi-tasking\n3. San Francisco Channel St live widget' },
    { id: '2', title: 'Founder Checklist - Vishnu', date: 'Yesterday', content: '✓ Ship high-precision 18 Pro Max\n✓ Beautiful desert dunes wallpaper\n✓ Zero pill discipline' }
  ]);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-[#1C1C1E] text-white' : 'bg-[#F2F2F7] text-black'} font-sans select-none overflow-hidden`}>
      <div className="pt-12 px-4 pb-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-2xl font-black text-amber-500">Notes</h1>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-xs font-semibold cursor-pointer"
        >
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="bg-white dark:bg-[#2C2C2E] rounded-2xl p-3 shadow-xs space-y-2 divide-y divide-neutral-200 dark:divide-neutral-700">
          {notes.map((n) => (
            <div key={n.id} className="pt-2 first:pt-0 cursor-pointer space-y-1">
              <h3 className="font-bold text-xs">{n.title}</h3>
              <p className="text-[10px] text-neutral-400">{n.date}</p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-300 whitespace-pre-line line-clamp-2">{n.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-amber-500">
        <span className="text-[11px] font-semibold text-neutral-400">2 Notes</span>
        <button className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
          <Edit className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 5. Apple Maps App
export const MapsApp: React.FC<AppProps> = ({ state, onClose }) => {
  return (
    <div className="h-full flex flex-col bg-[#EBF1ED] text-black font-sans select-none overflow-hidden relative">
      {/* Top Search Bar */}
      <div className="absolute top-12 left-3 right-3 z-20 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-black/10">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            readOnly
            value="Channel St, San Francisco, CA"
            className="w-full text-xs font-semibold bg-transparent outline-none"
          />
        </div>
        <button
          onClick={onClose}
          className="px-3 py-2 rounded-2xl bg-white/95 backdrop-blur-md text-xs font-bold shadow-lg border border-black/10 cursor-pointer"
        >
          Exit
        </button>
      </div>

      {/* Realistic Stylized Map Canvas */}
      <div className="w-full h-full relative overflow-hidden bg-[#e8ece9]">
        {/* Water Bay Area */}
        <div className="absolute top-0 right-0 w-3/5 h-1/2 bg-[#a3c9e8] rounded-bl-[120px] shadow-inner opacity-80" />
        <span className="absolute top-20 right-8 text-[11px] font-bold text-blue-900/60 uppercase tracking-widest">
          Mission Creek Bay
        </span>

        {/* Highway 280 */}
        <div className="absolute top-28 left-0 right-0 h-4 bg-[#f89b42] shadow-sm transform -rotate-12 flex items-center justify-center">
          <span className="text-[7px] font-black text-white uppercase tracking-wider bg-red-600 px-1 rounded-xs">
            I-280 N
          </span>
        </div>

        {/* Channel St Road */}
        <div className="absolute top-52 left-0 right-0 h-3 bg-white border-y border-neutral-300 shadow-xs flex items-center justify-center">
          <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest">
            Channel St
          </span>
        </div>

        {/* 4th St Road */}
        <div className="absolute left-36 top-0 bottom-0 w-3 bg-white border-x border-neutral-300 shadow-xs" />

        {/* Park Greenery */}
        <div className="absolute bottom-28 left-8 w-28 h-24 bg-[#bde0b5] rounded-3xl border border-green-300/40 opacity-70" />

        {/* Center Live Location Pin matching the Screenshot avatar! */}
        <div className="absolute top-44 left-32 z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white shadow-2xl p-0.5 border-2 border-green-500 flex items-center justify-center animate-bounce">
              <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-xl overflow-hidden">
                👧🏽
              </div>
            </div>
            {/* Green radar cone */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-green-500 mx-auto -mt-0.5" />
          </div>
          <div className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 shadow-md whitespace-nowrap">
            Now • Channel St
          </div>
        </div>
      </div>

      {/* Bottom Route Card */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-3xl shadow-2xl border border-black/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-green-600 uppercase">Fastest Route</span>
          <h4 className="font-bold text-xs">Channel St to Apple Park</h4>
          <p className="text-[10px] text-neutral-500">38 min (41.2 miles) via I-280 S</p>
        </div>
        <button className="px-4 py-2 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md flex items-center gap-1">
          <Navigation className="w-3.5 h-3.5" />
          <span>GO</span>
        </button>
      </div>
    </div>
  );
};

// 6. Apple TV App
export const AppleTvApp: React.FC<AppProps> = ({ state, onClose }) => {
  return (
    <div className="h-full flex flex-col bg-[#0A0A0C] text-white font-sans select-none overflow-hidden">
      <div className="pt-12 px-4 pb-2 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-1 font-black text-xl">
          <span></span>
          <span className="text-sm font-semibold">tv+</span>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-full bg-neutral-800 text-xs font-semibold hover:bg-neutral-700 cursor-pointer"
        >
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Hero Trailer */}
        <div className="rounded-3xl bg-gradient-to-tr from-blue-900 via-indigo-950 to-neutral-900 p-5 border border-white/10 relative overflow-hidden shadow-2xl space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
            Apple Original
          </span>
          <div>
            <h2 className="text-xl font-black">SEVERANCE</h2>
            <p className="text-xs text-neutral-300">Season 2 Streaming Now on Apple TV</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black font-bold text-xs shadow-md cursor-pointer hover:bg-neutral-200">
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Play Trailer</span>
          </button>
        </div>

        <div>
          <h3 className="font-bold text-xs text-neutral-400 uppercase tracking-wider mb-2">Featured Originals</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { title: 'Ted Lasso', genre: 'Comedy', color: 'from-amber-600 to-yellow-700', icon: '⚽' },
              { title: 'The Morning Show', genre: 'Drama', color: 'from-rose-700 to-red-900', icon: '☕' },
              { title: 'Foundation', genre: 'Sci-Fi', color: 'from-indigo-800 to-purple-950', icon: '🚀' },
              { title: 'Slow Horses', genre: 'Thriller', color: 'from-neutral-700 to-neutral-900', icon: '🕵️' }
            ].map((s) => (
              <div key={s.title} className={`h-24 rounded-2xl bg-gradient-to-br ${s.color} p-3 flex flex-col justify-between border border-white/10 cursor-pointer`}>
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="font-bold text-xs">{s.title}</p>
                  <p className="text-[9px] text-white/70">{s.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. Apple News App
export const NewsApp: React.FC<AppProps> = ({ state, onClose }) => {
  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} font-sans select-none overflow-hidden`}>
      <div className="pt-12 px-4 pb-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-md bg-[#FF2D55] text-white font-black text-xs flex items-center justify-center">N</span>
          <h1 className="text-xl font-black">Apple News</h1>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold cursor-pointer"
        >
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Top Story */}
        <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-900 p-4 border border-neutral-200 dark:border-neutral-800 space-y-2">
          <span className="text-[10px] font-black text-[#FF2D55] uppercase tracking-wider">Top Story • Technology</span>
          <h2 className="text-base font-black leading-snug">
            Vishnu Sai Ramiya Unveils Next-Gen iPhone Duo with Liquidmetal Dual-Screen Architecture
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Revolutionary book-fold mechanics and high-density 120Hz ProMotion displays provide an unprecedented mobile computing canvas.
          </p>
          <span className="text-[10px] text-neutral-400">12 min ago • Silicon Valley Tech Review</span>
        </div>

        <div className="space-y-2.5">
          {[
            { source: 'AI Insider', title: 'Gemini Intelligence and Spatial UI Breakthroughs', tag: 'AI & Machine Learning' },
            { source: 'San Francisco Chronicle', title: 'Mission Creek & Channel St Tech Corridor Grows', tag: 'Local News' }
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-1">
              <span className="text-[9px] font-bold text-neutral-400 uppercase">{item.source} • {item.tag}</span>
              <h4 className="font-bold text-xs">{item.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 8. Rocket Booster App
export const RocketApp: React.FC<AppProps> = ({ state, onClose, onOpenApp }) => {
  const [boosted, setBoosted] = useState(false);

  const triggerBoost = () => {
    setBoosted(true);
    setTimeout(() => setBoosted(false), 2500);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1c0808] via-[#120808] to-black text-white font-sans select-none overflow-hidden">
      <div className="pt-12 px-4 pb-2 flex items-center justify-between border-b border-red-950/60">
        <div className="flex items-center gap-1.5 font-bold text-lg text-rose-500">
          <Rocket className="w-5 h-5" />
          <span>Quantum Turbo Booster</span>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-full bg-neutral-800 text-xs font-semibold cursor-pointer"
        >
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-between">
        <div className="text-center space-y-2 mt-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 mx-auto flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(239,68,68,0.5)]">
            🚀
          </div>
          <h2 className="text-xl font-black">A18 Pro Max Quantum Boost</h2>
          <p className="text-xs text-neutral-400">Zero latency acceleration for dual-screen multitasking</p>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-2 my-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-neutral-400">FPS</span>
            <p className="text-lg font-black text-green-400">120</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-neutral-400">CPU TEMP</span>
            <p className="text-lg font-black text-amber-400">31°C</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-neutral-400">RAM FREED</span>
            <p className="text-lg font-black text-blue-400">4.8 GB</p>
          </div>
        </div>

        <button
          onClick={triggerBoost}
          className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide shadow-xl transition-all cursor-pointer ${
            boosted
              ? 'bg-green-500 text-white animate-pulse'
              : 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:brightness-110 active:scale-95'
          }`}
        >
          {boosted ? '⚡ HYPER-DRIVE ACTIVATED (100%)' : 'ACTIVATE TURBO BOOST'}
        </button>
      </div>
    </div>
  );
};

// 9. Apple Health App
export const HealthApp: React.FC<AppProps> = ({ state, onClose }) => {
  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} font-sans select-none overflow-hidden`}>
      <div className="pt-12 px-4 pb-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-1.5">
          <Heart className="w-5 h-5 text-[#FF2D55] fill-[#FF2D55]" />
          <h1 className="text-2xl font-black">Health</h1>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-xs font-semibold cursor-pointer"
        >
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Activity Rings Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Activity Rings</span>
            <span className="text-xs font-bold text-red-500">Today</span>
          </div>

          <div className="flex items-center justify-around py-2">
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#FA114F]">480 / 600</span>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold">Move (CAL)</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#AFFF00]">34 / 30</span>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold">Exercise (MIN)</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#00F0FF]">10 / 12</span>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold">Stand (HRS)</span>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-3 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-1 text-xs text-red-500 font-bold">
              <Heart className="w-4 h-4 fill-red-500" />
              <span>Heart Rate</span>
            </div>
            <p className="text-2xl font-black mt-2">72 <span className="text-xs font-normal text-neutral-400">BPM</span></p>
            <span className="text-[9px] text-neutral-400">Resting 58 bpm</span>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-3 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-1 text-xs text-blue-500 font-bold">
              <Activity className="w-4 h-4" />
              <span>Steps</span>
            </div>
            <p className="text-2xl font-black mt-2">8,421</p>
            <span className="text-[9px] text-neutral-400">Goal 10,000 steps</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 10. Apple Wallet App
export const WalletApp: React.FC<AppProps> = ({ state, onClose }) => {
  return (
    <div className="h-full flex flex-col bg-black text-white font-sans select-none overflow-hidden">
      <div className="pt-12 px-4 pb-2 flex items-center justify-between border-b border-neutral-800">
        <h1 className="text-2xl font-black">Wallet</h1>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-full bg-neutral-800 text-xs font-semibold cursor-pointer"
        >
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        {/* Apple Titanium Card */}
        <div className="h-44 rounded-3xl bg-gradient-to-br from-neutral-200 via-neutral-400 to-neutral-600 p-4 text-black shadow-2xl flex flex-col justify-between border border-white/40 cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm tracking-tight"> Apple Card</span>
            <Wifi className="w-4 h-4 rotate-90 opacity-70" />
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest">•••• •••• •••• 9410</p>
            <p className="text-[10px] font-bold text-neutral-700 uppercase mt-0.5">Vishnu Sai Ramiya</p>
          </div>
        </div>

        {/* Paytm UPI Express Card */}
        <div className="h-40 rounded-3xl bg-gradient-to-r from-[#002E6E] to-[#00BAF2] p-4 text-white shadow-xl flex flex-col justify-between border border-white/20 -mt-20 hover:mt-0 transition-all cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="font-black text-sm tracking-tight">Paytm UPI FastPay</span>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <div>
            <p className="font-mono text-xs">vishnu@paytm</p>
            <p className="text-[10px] text-sky-200">Instant QR & NFC SoundBox Link</p>
          </div>
        </div>

        <div className="pt-6 text-center text-xs text-neutral-400">
          <p>Hold near reader to pay with Apple Pay</p>
        </div>
      </div>
    </div>
  );
};
