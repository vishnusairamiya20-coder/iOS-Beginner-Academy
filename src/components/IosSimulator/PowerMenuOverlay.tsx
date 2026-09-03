import React, { useState, useRef, useEffect } from 'react';
import { Power, RotateCcw, PhoneCall, X, ChevronRight } from 'lucide-react';
import { playPowerSliderHaptic } from '../../utils/audioUtils';

interface PowerMenuOverlayProps {
  isOpen: boolean;
  onPowerOff: () => void;
  onRestart: () => void;
  onCancel: () => void;
}

export const PowerMenuOverlay: React.FC<PowerMenuOverlayProps> = ({
  isOpen,
  onPowerOff,
  onRestart,
  onCancel,
}) => {
  const [powerOffProgress, setPowerOffProgress] = useState(0); // 0 to 1
  const [restartProgress, setRestartProgress] = useState(0); // 0 to 1
  const [isDraggingPowerOff, setIsDraggingPowerOff] = useState(false);
  const [isDraggingRestart, setIsDraggingRestart] = useState(false);

  const powerTrackRef = useRef<HTMLDivElement | null>(null);
  const restartTrackRef = useRef<HTMLDivElement | null>(null);
  const lastHapticRef = useRef<number>(0);

  // Reset states when closed
  useEffect(() => {
    if (!isOpen) {
      setPowerOffProgress(0);
      setRestartProgress(0);
      setIsDraggingPowerOff(false);
      setIsDraggingRestart(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerHaptic = () => {
    const now = Date.now();
    if (now - lastHapticRef.current > 120) {
      playPowerSliderHaptic();
      lastHapticRef.current = now;
    }
  };

  // Drag handler for Power Off
  const handlePowerDrag = (clientX: number) => {
    if (!powerTrackRef.current) return;
    const rect = powerTrackRef.current.getBoundingClientRect();
    const maxDrag = rect.width - 48; // track width minus knob width
    const currentX = Math.max(0, Math.min(clientX - rect.left - 24, maxDrag));
    const progress = currentX / maxDrag;
    setPowerOffProgress(progress);
    triggerHaptic();

    if (progress >= 0.85) {
      setIsDraggingPowerOff(false);
      setPowerOffProgress(1);
      onPowerOff();
    }
  };

  // Drag handler for Restart
  const handleRestartDrag = (clientX: number) => {
    if (!restartTrackRef.current) return;
    const rect = restartTrackRef.current.getBoundingClientRect();
    const maxDrag = rect.width - 48;
    const currentX = Math.max(0, Math.min(clientX - rect.left - 24, maxDrag));
    const progress = currentX / maxDrag;
    setRestartProgress(progress);
    triggerHaptic();

    if (progress >= 0.85) {
      setIsDraggingRestart(false);
      setRestartProgress(1);
      onRestart();
    }
  };

  const handlePointerUp = () => {
    if (isDraggingPowerOff) {
      setIsDraggingPowerOff(false);
      if (powerOffProgress < 0.85) {
        setPowerOffProgress(0);
      }
    }
    if (isDraggingRestart) {
      setIsDraggingRestart(false);
      if (restartProgress < 0.85) {
        setRestartProgress(0);
      }
    }
  };

  return (
    <div
      id="power-menu-overlay"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex flex-col justify-between px-6 pt-16 pb-12 select-none text-white animate-fade-in"
    >
      {/* Top Section / Header */}
      <div className="flex flex-col items-center space-y-1 text-center">
        <p className="text-[11px] font-medium tracking-wide uppercase text-white/50">
          iPhone System Power
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-white/90">
          Slide to confirm action
        </h2>
      </div>

      {/* Center Interactive Action Sliders */}
      <div className="space-y-4 my-auto w-full max-w-[280px] mx-auto">
        {/* 1. Slide to Power Off */}
        <div className="space-y-1.5">
          <div
            id="power-off-track"
            ref={powerTrackRef}
            onPointerDown={(e) => {
              setIsDraggingPowerOff(true);
              handlePowerDrag(e.clientX);
            }}
            onPointerMove={(e) => {
              if (isDraggingPowerOff) handlePowerDrag(e.clientX);
            }}
            className="relative h-14 w-full bg-neutral-900/90 border border-white/10 rounded-full p-1 flex items-center overflow-hidden cursor-grab active:cursor-grabbing shadow-inner group"
          >
            {/* Shimmering Text Prompt */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-150 pl-8"
              style={{ opacity: Math.max(0, 1 - powerOffProgress * 1.8) }}
            >
              <span className="text-sm font-medium text-white/70 tracking-wide flex items-center gap-1">
                slide to power off <ChevronRight className="w-4 h-4 opacity-50 animate-pulse" />
              </span>
            </div>

            {/* Draggable Red Power Knob */}
            <div
              style={{
                transform: `translateX(${powerOffProgress * 215}px)`,
                transition: isDraggingPowerOff ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center flex-shrink-0 z-10 active:scale-95"
            >
              <Power className="w-5 h-5 text-rose-600" />
            </div>
          </div>

          {/* Quick Tap Helper Button for accessibility */}
          <div className="flex justify-end pr-2">
            <button
              onClick={() => {
                setPowerOffProgress(1);
                setTimeout(onPowerOff, 150);
              }}
              className="text-[10px] text-rose-400 hover:text-rose-300 transition-colors"
            >
              Tap to Switch Off
            </button>
          </div>
        </div>

        {/* 2. Slide to Restart */}
        <div className="space-y-1.5 pt-2">
          <div
            id="restart-track"
            ref={restartTrackRef}
            onPointerDown={(e) => {
              setIsDraggingRestart(true);
              handleRestartDrag(e.clientX);
            }}
            onPointerMove={(e) => {
              if (isDraggingRestart) handleRestartDrag(e.clientX);
            }}
            className="relative h-14 w-full bg-neutral-900/90 border border-white/10 rounded-full p-1 flex items-center overflow-hidden cursor-grab active:cursor-grabbing shadow-inner group"
          >
            {/* Shimmering Text Prompt */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-150 pl-8"
              style={{ opacity: Math.max(0, 1 - restartProgress * 1.8) }}
            >
              <span className="text-sm font-medium text-white/70 tracking-wide flex items-center gap-1">
                slide to restart <ChevronRight className="w-4 h-4 opacity-50 animate-pulse" />
              </span>
            </div>

            {/* Draggable Sky Blue Restart Knob */}
            <div
              style={{
                transform: `translateX(${restartProgress * 215}px)`,
                transition: isDraggingRestart ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center flex-shrink-0 z-10 active:scale-95"
            >
              <RotateCcw className="w-5 h-5 text-sky-600" />
            </div>
          </div>

          {/* Quick Tap Helper Button for accessibility */}
          <div className="flex justify-end pr-2">
            <button
              onClick={() => {
                setRestartProgress(1);
                setTimeout(onRestart, 150);
              }}
              className="text-[10px] text-sky-400 hover:text-sky-300 transition-colors"
            >
              Tap to Restart
            </button>
          </div>
        </div>

        {/* Emergency SOS row */}
        <div className="pt-2">
          <div className="h-11 w-full bg-neutral-900/60 border border-white/5 rounded-full px-3 flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-white/80">Emergency SOS</span>
            </div>
            <span className="text-[10px] font-mono text-white/40">112 / 911</span>
          </div>
        </div>
      </div>

      {/* Bottom Circular Cancel Button */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <button
          id="power-menu-cancel-button"
          onClick={onCancel}
          className="w-13 h-13 rounded-full bg-neutral-800/90 hover:bg-neutral-700 active:scale-90 border border-white/10 flex items-center justify-center text-white transition-all shadow-lg"
          title="Cancel and return to iPhone"
        >
          <X className="w-6 h-6" />
        </button>
        <span className="text-[11px] text-white/60 font-medium">Cancel</span>
      </div>
    </div>
  );
};
