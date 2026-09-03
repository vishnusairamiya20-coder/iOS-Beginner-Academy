import React, { useRef, useEffect } from 'react';
import {
  ZoomIn,
  SunMedium,
  Focus,
  Camera,
  Palette,
  Contrast,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { SimulatorState } from '../../types';
import { playCameraControlScrubTick, playCameraControlLightPress } from '../../utils/audioUtils';

interface CameraControlOverlayProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onClose: () => void;
  onCapturePhoto?: () => void;
}

type ControlTool = 'zoom' | 'exposure' | 'depth' | 'cameras' | 'styles' | 'tone';

const TOOLS: Array<{
  id: ControlTool;
  label: string;
  icon: React.ElementType;
}> = [
  { id: 'zoom', label: 'Zoom', icon: ZoomIn },
  { id: 'exposure', label: 'Exposure', icon: SunMedium },
  { id: 'depth', label: 'Depth', icon: Focus },
  { id: 'cameras', label: 'Cameras', icon: Camera },
  { id: 'styles', label: 'Styles', icon: Palette },
  { id: 'tone', label: 'Tone', icon: Contrast },
];

export const CameraControlOverlay: React.FC<CameraControlOverlayProps> = ({
  state,
  onUpdateState,
  onClose,
  onCapturePhoto,
}) => {
  const { cameraControl } = state;
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const lastTickRef = useRef(0);
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetAutoHide = () => {
    if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    autoHideTimerRef.current = setTimeout(() => {
      onClose();
    }, 4500);
  };

  useEffect(() => {
    resetAutoHide();
    return () => {
      if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    };
  }, [cameraControl.activeTool]);

  const triggerScrubTick = () => {
    const now = Date.now();
    if (now - lastTickRef.current > 40) {
      playCameraControlScrubTick();
      lastTickRef.current = now;
    }
  };

  const cycleTool = (direction: 'next' | 'prev') => {
    playCameraControlLightPress();
    resetAutoHide();
    const currentIndex = TOOLS.findIndex((t) => t.id === cameraControl.activeTool);
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % TOOLS.length
        : (currentIndex - 1 + TOOLS.length) % TOOLS.length;
    
    onUpdateState((s) => ({
      ...s,
      cameraControl: {
        ...s.cameraControl,
        activeTool: TOOLS[nextIndex].id,
      },
    }));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    resetAutoHide();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaY = startYRef.current - e.clientY; // drag up increases, down decreases
    if (Math.abs(deltaY) < 3) return;

    triggerScrubTick();
    resetAutoHide();
    startYRef.current = e.clientY;

    const factor = deltaY > 0 ? 1 : -1;

    onUpdateState((s) => {
      const cc = { ...s.cameraControl };
      switch (cc.activeTool) {
        case 'zoom': {
          // Range: 0.5x to 5.0x, step 0.1
          const next = Math.round((cc.zoomValue + factor * 0.1) * 10) / 10;
          cc.zoomValue = Math.max(0.5, Math.min(5.0, next));
          break;
        }
        case 'exposure': {
          // Range: -2.0 to +2.0, step 0.1
          const next = Math.round((cc.exposureValue + factor * 0.1) * 10) / 10;
          cc.exposureValue = Math.max(-2.0, Math.min(2.0, next));
          break;
        }
        case 'depth': {
          // Aperture steps: f/1.4, f/2.0, f/2.8, f/4.0, f/5.6, f/8.0, f/11, f/16
          const apertures = [1.4, 1.8, 2.0, 2.8, 3.5, 4.0, 5.6, 8.0, 11.0, 16.0];
          const curIdx = apertures.findIndex((a) => a === cc.depthValue) || 3;
          const nextIdx = Math.max(0, Math.min(apertures.length - 1, curIdx + factor));
          cc.depthValue = apertures[nextIdx];
          break;
        }
        case 'cameras': {
          const lenses: Array<'0.5x' | '1x' | '2x' | '5x'> = ['0.5x', '1x', '2x', '5x'];
          const curIdx = lenses.indexOf(cc.activeCameraLens);
          const nextIdx = Math.max(0, Math.min(lenses.length - 1, curIdx + factor));
          cc.activeCameraLens = lenses[nextIdx];
          cc.zoomValue = parseFloat(lenses[nextIdx].replace('x', ''));
          break;
        }
        case 'styles': {
          const styles: Array<'Standard' | 'Vibrant' | 'Warm' | 'Cool' | 'Dramatic'> = [
            'Standard',
            'Vibrant',
            'Warm',
            'Cool',
            'Dramatic',
          ];
          const curIdx = styles.indexOf(cc.photographicStyle);
          const nextIdx = (curIdx + factor + styles.length) % styles.length;
          cc.photographicStyle = styles[nextIdx];
          break;
        }
        case 'tone': {
          // Range: -100 to +100, step 5
          const next = cc.toneValue + factor * 5;
          cc.toneValue = Math.max(-100, Math.min(100, next));
          break;
        }
      }
      return { ...s, cameraControl: cc };
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Format current value display
  const renderCurrentValue = () => {
    switch (cameraControl.activeTool) {
      case 'zoom':
        return `${cameraControl.zoomValue.toFixed(1)}x`;
      case 'exposure':
        return `${cameraControl.exposureValue > 0 ? '+' : ''}${cameraControl.exposureValue.toFixed(1)} EV`;
      case 'depth':
        return `ƒ/${cameraControl.depthValue}`;
      case 'cameras':
        return `${cameraControl.activeCameraLens} (${
          cameraControl.activeCameraLens === '0.5x'
            ? '13mm'
            : cameraControl.activeCameraLens === '1x'
            ? '24mm'
            : cameraControl.activeCameraLens === '2x'
            ? '48mm'
            : '120mm'
        })`;
      case 'styles':
        return cameraControl.photographicStyle;
      case 'tone':
        return `${cameraControl.toneValue > 0 ? '+' : ''}${cameraControl.toneValue}`;
    }
  };

  const activeToolObj = TOOLS.find((t) => t.id === cameraControl.activeTool) || TOOLS[0];
  const IconComponent = activeToolObj.icon;

  return (
    <div
      id="camera-control-overlay"
      className="absolute right-2 top-[380px] z-40 select-none animate-fade-in flex items-center pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Floating Pill HUD aligned near the right physical button */}
      <div className="relative bg-neutral-900/90 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-3xl p-2 text-white flex flex-col items-center w-[150px] transition-all">
        {/* Top Header: Active Tool Icon & Label & Dismiss */}
        <div className="w-full flex items-center justify-between px-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <IconComponent className="w-3 h-3" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
              {activeToolObj.label}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Current Large Value Display */}
        <div className="text-center py-1">
          <span className="text-base font-bold font-mono tracking-tight text-white drop-shadow-sm">
            {renderCurrentValue()}
          </span>
        </div>

        {/* Tactile Scrub Ruler (Drag vertically or horizontally) */}
        <div
          id="camera-control-scrubber"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-10 bg-black/60 border border-white/10 rounded-2xl flex items-center justify-center cursor-ns-resize overflow-hidden relative active:border-amber-400/50 group"
          title="Slide up/down to adjust value"
        >
          {/* Subtle ruler notches */}
          <div className="flex items-center justify-between w-full px-3 opacity-60">
            {Array.from({ length: 11 }).map((_, idx) => (
              <div
                key={idx}
                className={`transition-all ${
                  idx === 5
                    ? 'w-1 h-5 bg-amber-400 rounded-full'
                    : idx % 2 === 0
                    ? 'w-0.5 h-3 bg-white/70 rounded-full'
                    : 'w-0.5 h-1.5 bg-white/30 rounded-full'
                }`}
              />
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[8px] uppercase tracking-widest text-amber-300 font-semibold bg-black/70 px-1.5 py-0.5 rounded-full">
              Slide to Scrub
            </span>
          </div>
        </div>

        {/* Quick Tool Switcher Navigation (Previous / Next tool) */}
        <div className="w-full flex items-center justify-between pt-2 px-0.5">
          <button
            onClick={() => cycleTool('prev')}
            className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors flex items-center text-[9px] gap-0.5"
            title="Previous tool (or double-click Camera Control)"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>

          {/* Mini tool pills indicator */}
          <div className="flex items-center gap-1">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  playCameraControlLightPress();
                  onUpdateState((s) => ({
                    ...s,
                    cameraControl: { ...s.cameraControl, activeTool: t.id },
                  }));
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  t.id === cameraControl.activeTool
                    ? 'w-3 bg-amber-400'
                    : 'bg-white/30 hover:bg-white/60'
                }`}
                title={t.label}
              />
            ))}
          </div>

          <button
            onClick={() => cycleTool('next')}
            className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors flex items-center text-[9px] gap-0.5"
            title="Next tool"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Shutter Quick-Tap Action */}
        {onCapturePhoto && (
          <button
            onClick={() => {
              onCapturePhoto();
              resetAutoHide();
            }}
            className="w-full mt-1.5 py-1 rounded-xl bg-white text-black font-semibold text-[10px] flex items-center justify-center gap-1 active:scale-95 shadow transition-all hover:bg-neutral-100"
          >
            <Camera className="w-3 h-3 text-black" />
            <span>Click Shutter</span>
          </button>
        )}
      </div>
    </div>
  );
};
