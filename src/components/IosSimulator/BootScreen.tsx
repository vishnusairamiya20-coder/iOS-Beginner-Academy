import React, { useEffect, useState } from 'react';
import { Apple } from 'lucide-react';
import { playBootChimeSound } from '../../utils/audioUtils';

interface BootScreenProps {
  onBootComplete: () => void;
  isRestart?: boolean;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete, isRestart = false }) => {
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
      {/* Apple Logo */}
      <div className="flex flex-col items-center justify-center">
        <Apple className="w-16 h-16 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-pulse" />

        {/* Authentic iOS Boot Progress Bar */}
        <div className="w-36 h-1 bg-neutral-800/80 rounded-full overflow-hidden mt-10 shadow-inner">
          <div
            className="h-full bg-white rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] text-neutral-500 font-mono tracking-widest mt-4">
          {isRestart ? 'RESTARTING...' : 'BOOTING IOS...'}
        </span>
      </div>
    </div>
  );
};
