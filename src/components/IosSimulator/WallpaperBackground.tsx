import React from 'react';

interface WallpaperBackgroundProps {
  wallpaper: string;
  isDarkMode?: boolean;
  isLockScreen?: boolean;
  className?: string;
}

export const WallpaperBackground: React.FC<WallpaperBackgroundProps> = ({
  wallpaper = 'f1',
  isDarkMode = false,
  isLockScreen = false,
  className = ''
}) => {
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

  // 4. NEON
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
