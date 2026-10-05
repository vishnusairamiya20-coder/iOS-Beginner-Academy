import React, { useEffect, useState } from 'react';
import { Apple } from 'lucide-react';
import { playBootChimeSound } from '../../utils/audioUtils';

interface BootScreenProps {
  onBootComplete: () => void;
  isRestart?: boolean;
  customText?: string;
}

export const BootScreen: React.FC<BootScreenProps> = ({
  onBootComplete,
  isRestart = false,
  customText
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Play the classic Apple boot chime
    playBootChimeSound();

    const startTime = Date.now();
    const duration = isRestart ? 2200 : 2000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          onBootComplete();
        }, 150);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onBootComplete, isRestart]);

  return (
    <div
      id="boot-screen"
      className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center select-none text-white animate-fade-in"
    >
      {/* Apple Logo with iOS 27 subtle quantum shimmer */}
      <div className="flex flex-col items-center justify-center relative">
        <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl pointer-events-none animate-pulse" />
        <Apple className="w-16 h-16 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] animate-pulse relative z-10" />

        {/* Authentic iOS Boot Progress Bar */}
        <div className="w-40 h-1.5 bg-neutral-800/90 rounded-full overflow-hidden mt-10 shadow-inner relative z-10">
          <div
            className="h-full bg-gradient-to-r from-white via-cyan-200 to-white rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(255,255,255,0.9)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] text-neutral-400 font-mono tracking-widest mt-4 relative z-10 font-bold uppercase">
          {customText || (isRestart ? 'RESTARTING IOS 27...' : 'BOOTING IOS 27 QUANTUM OS...')}
        </span>
        <span className="text-[8px] text-neutral-600 font-mono tracking-widest mt-1 relative z-10">
          DARWIN QUANTUM CORE 27.0
        </span>
      </div>
    </div>
  );
};
