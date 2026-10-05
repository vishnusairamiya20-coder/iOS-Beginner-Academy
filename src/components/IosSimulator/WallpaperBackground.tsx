import React from 'react';

interface WallpaperBackgroundProps {
  wallpaper: string;
  isDarkMode?: boolean;
  isLockScreen?: boolean;
  className?: string;
}

export const WallpaperBackground: React.FC<WallpaperBackgroundProps> = ({
  wallpaper = 'doomsday',
  isDarkMode = false,
  isLockScreen = false,
  className = ''
}) => {
  // 0. DOOMSDAY CINEMATIC APOCALYPTIC WALLPAPER
  if (wallpaper === 'doomsday' || wallpaper === 'doomsday_wallpaper' || wallpaper === 'doomsday_apocalypse') {
    return (
      <div className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}>
        {/* Ultra HD Doomsday Wallpaper Photo */}
        <img
          src="/doomsday_wallpaper.jpg"
          alt="Doomsday Apocalyptic Sky Wallpaper"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.indexOf('doomsday_wallpaper.jpg') === -1) {
              target.src = '/doomsday_wallpaper.jpg';
            }
          }}
        />

        {/* Cinematic volcanic ember & apocalyptic crimson lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-orange-950/20 to-black/40 pointer-events-none" />

        {/* Ambient atmospheric ember particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
          <div className="absolute bottom-20 left-12 w-1.5 h-1.5 rounded-full bg-amber-500 blur-[1px] animate-pulse" />
          <div className="absolute bottom-36 left-28 w-1 h-1 rounded-full bg-orange-400 blur-[0.5px] animate-ping" />
          <div className="absolute bottom-28 right-16 w-1 h-1 rounded-full bg-red-500 blur-[0.5px] animate-pulse" />
          <div className="absolute bottom-48 right-24 w-1.5 h-1.5 rounded-full bg-amber-400 blur-[1px] animate-ping" />
        </div>

        {/* Lock Screen / Home Screen readability gradient overlay */}
        <div
          className={`absolute inset-0 pointer-events-none ${
            isLockScreen
              ? 'bg-gradient-to-b from-black/55 via-transparent to-black/75'
              : 'bg-gradient-to-b from-black/35 via-transparent to-black/55'
          }`}
        />
      </div>
    );
  }

  // 1. FORMULA 1 CAR CINEMATIC WALLPAPER
  if (wallpaper === 'f1' || wallpaper === 'f1_car' || wallpaper === 'f1_racing') {
    return (
      <div className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}>
        {/* Ultra HD Photorealistic F1 Car Photo */}
        <img
          src="/f1_car_wallpaper.jpg"
          alt="Formula 1 Race Car Wallpaper"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.indexOf('f1_car_wallpaper.jpg') === -1) {
              target.src = '/f1_car_wallpaper.jpg';
            }
          }}
        />

        {/* Speed blur & track atmospheric lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/40 pointer-events-none" />

        {/* Subtle F1 Telemetry HUD Overlay */}
        <div className="absolute top-24 right-4 text-right font-mono text-[7px] tracking-widest text-red-500/80 drop-shadow-md">
          <div className="font-bold flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
            DRS ACTIVE // GEAR 8
          </div>
          <div>SPEED: 334 KM/H</div>
          <div>APEX LATERAL: 4.8G</div>
        </div>

        {/* Lock Screen / Home Screen readability gradient overlay */}
        <div
          className={`absolute inset-0 pointer-events-none ${
            isLockScreen
              ? 'bg-gradient-to-b from-black/50 via-transparent to-black/70'
              : 'bg-gradient-to-b from-black/30 via-transparent to-black/50'
          }`}
        />
      </div>
    );
  }

  // 2. SEA BEACH WALLPAPERS
  if (wallpaper === 'beach' || wallpaper === 'beach_wallpaper' || wallpaper === 'beach_sunset' || wallpaper === 'beach_tropical') {
    let photoSrc = '/beach_wallpaper.jpg';
    if (wallpaper === 'beach_sunset') photoSrc = '/beach_sunset.jpg';
    if (wallpaper === 'beach_tropical') photoSrc = '/beach_tropical.jpg';

    return (
      <div className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}>
        {/* Ultra HD Real Sea Beach Photo */}
        <img
          src={photoSrc}
          alt="Sea Beach Wallpaper"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.indexOf('beach_wallpaper.jpg') === -1) {
              target.src = '/beach_wallpaper.jpg';
            }
          }}
        />

        {/* Natural Sun Flare & Ocean Haze Lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

        {/* Lock Screen / Home Screen readability gradient overlay */}
        <div
          className={`absolute inset-0 pointer-events-none ${
            isLockScreen
              ? 'bg-gradient-to-b from-black/45 via-transparent to-black/60'
              : 'bg-gradient-to-b from-black/25 via-transparent to-black/40'
          }`}
        />
      </div>
    );
  }

  // 2. IRON MAN CINEMATIC WALLPAPERS
  if (wallpaper === 'ironman' || wallpaper === 'ironman_suit') {
    const photoSrc = wallpaper === 'ironman_suit' ? '/ironman_suit.jpg' : '/ironman_photo.jpg';

    return (
      <div className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}>
        {/* Photorealistic HD Image Background */}
        <img
          src={photoSrc}
          alt="Iron Man Photorealistic Armor"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.indexOf('ironman_suit.jpg') === -1) {
              target.src = '/ironman_suit.jpg';
            }
          }}
        />

        {/* Photorealistic cinematic light leaks and subtle Stark HUD technical overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

        {/* Subtle holographic Stark Industries HUD scan line */}
        <div className="absolute top-24 right-4 text-right font-mono text-[6px] tracking-widest text-cyan-400/60 drop-shadow-md">
          <div>MARK LXXXV // NANO-TECH</div>
          <div>ARC OUTPUT: 100% ONLINE</div>
        </div>

        {/* Subtle glowing lens flare accent over Arc Reactor position */}
        <div className="absolute top-[46%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-cyan-400/20 blur-xl pointer-events-none mix-blend-screen" />

        {/* Lock Screen / Home Screen readability gradient overlay */}
        <div
          className={`absolute inset-0 pointer-events-none ${
            isLockScreen
              ? 'bg-gradient-to-b from-black/50 via-transparent to-black/70'
              : 'bg-gradient-to-b from-black/35 via-transparent to-black/55'
          }`}
        />
      </div>
    );
  }

  // 3. ASTRONOMY
  if (wallpaper === 'astronomy') {
    return (
      <div className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 30%, #2e1065 0%, #0f172a 45%, #020617 100%)'
          }}
        />
        {/* Star speckles */}
        <div className="absolute inset-0 opacity-80">
          <div className="absolute top-12 left-10 w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-28 right-16 w-1.5 h-1.5 bg-blue-200 rounded-full" />
          <div className="absolute top-44 left-24 w-1 h-1 bg-purple-200 rounded-full animate-ping" />
          <div className="absolute bottom-36 right-10 w-1 h-1 bg-white rounded-full" />
          <div className="absolute top-72 right-28 w-1 h-1 bg-amber-200 rounded-full" />
        </div>
      </div>
    );
  }

  // 3. IOS 27 QUANTUM HORIZON (Official iOS 27 Flagship Wallpaper)
  if (wallpaper === 'ios27_quantum' || wallpaper === 'ios27' || wallpaper === 'quantum') {
    return (
      <div className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}>
        {/* Dynamic deep cosmic backdrop with quantum light fields */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            backgroundImage: isDarkMode
              ? 'radial-gradient(circle at 50% 15%, #4f46e5 0%, #1e1b4b 30%, #030712 75%)'
              : 'radial-gradient(circle at 50% 20%, #6366f1 0%, #3b82f6 30%, #0f172a 80%)'
          }}
        />

        {/* Shifting quantum energy waveforms */}
        <div className="absolute -top-20 -left-20 w-[150%] h-[85%] rounded-full bg-gradient-to-tr from-cyan-500/35 via-fuchsia-500/25 to-transparent blur-3xl transform rotate-12 animate-pulse" />
        <div className="absolute top-1/3 -right-24 w-[130%] h-[75%] rounded-full bg-gradient-to-bl from-violet-600/30 via-indigo-500/25 to-transparent blur-3xl transform -rotate-12" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[140%] h-[60%] rounded-full bg-gradient-to-t from-emerald-500/20 via-sky-600/20 to-transparent blur-2xl" />

        {/* Quantum neural circuit nodes and star particles */}
        <div className="absolute inset-0 opacity-70">
          <div className="absolute top-20 left-16 w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_8px_#22d3ee] animate-ping" />
          <div className="absolute top-36 right-20 w-1 h-1 bg-fuchsia-300 rounded-full shadow-[0_0_6px_#e879f9]" />
          <div className="absolute top-64 left-24 w-1.5 h-1.5 bg-violet-200 rounded-full shadow-[0_0_10px_#a78bfa] animate-pulse" />
          <div className="absolute bottom-44 right-16 w-1 h-1 bg-emerald-300 rounded-full shadow-[0_0_6px_#6ee7b7]" />
          <div className="absolute bottom-28 left-20 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff] animate-ping" />
        </div>

        {/* Subtle iOS 27 Quantum Glass Watermark */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-white/15 text-[8px] font-mono tracking-[0.3em] uppercase pointer-events-none">
          iOS 27 • Quantum Intelligence
        </div>

        {/* Dynamic readability scrim */}
        <div
          className={`absolute inset-0 pointer-events-none ${
            isLockScreen
              ? 'bg-gradient-to-b from-black/50 via-transparent to-black/75'
              : 'bg-gradient-to-b from-black/35 via-transparent to-black/55'
          }`}
        />
      </div>
    );
  }

  // 4. IOS 27 CYBER AURORA
  if (wallpaper === 'ios27_aurora' || wallpaper === 'aurora') {
    return (
      <div className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 80% 20%, #10b981 0%, #064e3b 25%, #022c22 45%, #020617 80%)'
          }}
        />
        {/* Luminescent undulating Aurora curtain */}
        <div className="absolute top-10 -left-10 w-[140%] h-[70%] bg-gradient-to-r from-emerald-400/30 via-teal-300/25 to-indigo-500/20 blur-2xl transform -rotate-6 animate-pulse" />
        <div className="absolute top-44 -right-10 w-[120%] h-[60%] bg-gradient-to-l from-fuchsia-500/25 via-violet-400/20 to-transparent blur-3xl transform rotate-12" />

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-emerald-300/15 text-[8px] font-mono tracking-[0.3em] uppercase pointer-events-none">
          iOS 27 • Cyber Aurora
        </div>

        <div
          className={`absolute inset-0 pointer-events-none ${
            isLockScreen
              ? 'bg-gradient-to-b from-black/50 via-transparent to-black/75'
              : 'bg-gradient-to-b from-black/35 via-transparent to-black/55'
          }`}
        />
      </div>
    );
  }

  // 5. IOS 27 LIQUID TITANIUM PRISM
  if (wallpaper === 'ios27_prism' || wallpaper === 'prism') {
    return (
      <div className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDarkMode
              ? 'linear-gradient(135deg, #09090b 0%, #18181b 40%, #27272a 70%, #09090b 100%)'
              : 'linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 40%, #d4d4d8 70%, #f4f4f5 100%)'
          }}
        />
        {/* Chromatic prism light streaks */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(236,72,153,0.35)_0%,transparent_40%),radial-gradient(circle_at_70%_65%,rgba(59,130,246,0.35)_0%,transparent_40%),radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.3)_0%,transparent_50%)] blur-xl" />
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full border border-white/20 bg-white/5 backdrop-blur-md shadow-[0_0_50px_rgba(255,255,255,0.15)] transform rotate-45" />

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-white/20 text-[8px] font-mono tracking-[0.3em] uppercase pointer-events-none">
          iOS 27 • Liquid Prism
        </div>

        <div
          className={`absolute inset-0 pointer-events-none ${
            isLockScreen
              ? 'bg-gradient-to-b from-black/50 via-transparent to-black/75'
              : 'bg-gradient-to-b from-black/35 via-transparent to-black/55'
          }`}
        />
      </div>
    );
  }

  // 6. NEON
  if (wallpaper === 'neon') {
    return (
      <div
        className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}
        style={{
          backgroundImage: 'linear-gradient(135deg, #064e3b 0%, #0f172a 50%, #701a75 100%)'
        }}
      />
    );
  }

  // 5. MINIMAL
  if (wallpaper === 'minimal') {
    return (
      <div
        className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}
        style={{
          backgroundImage: isDarkMode
            ? 'linear-gradient(180deg, #18181b 0%, #09090b 100%)'
            : 'linear-gradient(180deg, #f4f4f5 0%, #e4e4e7 100%)'
        }}
      />
    );
  }

  // Default iOS 18 iridescent gradient
  return (
    <div
      className={`absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}
      style={{
        backgroundImage: isDarkMode
          ? 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0f172a 50%, #000000 100%)'
          : 'linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 40%, #fbcfe8 100%)'
      }}
    />
  );
};
