import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  RefreshCw,
  Sparkles,
  Image as ImageIcon,
  Check,
  Video,
  Camera,
  Timer,
  Upload,
  Layers,
  Circle,
  SlidersHorizontal
} from 'lucide-react';
import { SimulatorState, UserPhotoItem } from '../../../types';
import { playCameraShutterSound, playCameraControlLightPress } from '../../../utils/audioUtils';

interface CameraAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onClose: () => void;
}

export const CameraApp: React.FC<CameraAppProps> = ({ state, onUpdateState }) => {
  const [mode, setMode] = useState<'photo' | 'portrait' | 'video'>('photo');
  const [flash, setFlash] = useState(false);
  const [timerMode, setTimerMode] = useState<0 | 3 | 10>(0);
  const [timerCountdown, setTimerCountdown] = useState<number | null>(null);
  const [zoom, setZoom] = useState<'0.5x' | '1x' | '2x' | '3x'>('1x');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [photoSnapped, setPhotoSnapped] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [cameraStreamAvailable, setCameraStreamAvailable] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const cc = state.cameraControl || {
    isOpen: false,
    activeTool: 'zoom',
    zoomValue: 1.0,
    exposureValue: 0,
    depthValue: 2.8,
    activeCameraLens: '1x',
    photographicStyle: 'Standard',
    toneValue: 0
  };

  // Compute live visual effects from Camera Control
  const brightnessVal = 1 + cc.exposureValue * 0.25;
  const contrastVal = 1 + cc.toneValue / 200;
  let styleFilter = '';
  if (cc.photographicStyle === 'Vibrant') styleFilter = 'saturate(1.4) contrast(1.08)';
  else if (cc.photographicStyle === 'Warm') styleFilter = 'sepia(0.22) saturate(1.15) brightness(1.02)';
  else if (cc.photographicStyle === 'Cool') styleFilter = 'hue-rotate(185deg) saturate(1.1)';
  else if (cc.photographicStyle === 'Dramatic') styleFilter = 'grayscale(1) contrast(1.35)';

  const combinedFilter = `brightness(${brightnessVal}) contrast(${contrastVal}) ${styleFilter}`.trim();
  const effectiveZoom = cc.zoomValue || 1.0;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize live webcam stream from primary device
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: facingMode,
              width: { ideal: 720 },
              height: { ideal: 1280 }
            },
            audio: false
          });
          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
          setCameraStreamAvailable(true);
          setCameraError(null);
        } else {
          setCameraStreamAvailable(false);
        }
      } catch (err) {
        console.log('Camera permission or device not available:', err);
        setCameraStreamAvailable(false);
        setCameraError('Primary camera preview (interactive simulation active)');
      }
    }

    initCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Video recording timer
  useEffect(() => {
    if (isVideoRecording) {
      videoTimerRef.current = setInterval(() => {
        setVideoDuration((d) => d + 1);
      }, 1000);
    } else {
      if (videoTimerRef.current) clearInterval(videoTimerRef.current);
      setVideoDuration(0);
    }
    return () => {
      if (videoTimerRef.current) clearInterval(videoTimerRef.current);
    };
  }, [isVideoRecording]);

  // Shutter action (handles timer countdown & capture)
  const handleShutterClick = () => {
    if (mode === 'video') {
      setIsVideoRecording(!isVideoRecording);
      return;
    }

    if (timerMode > 0) {
      setTimerCountdown(timerMode);
      let count = timerMode;
      const interval = setInterval(() => {
        count -= 1;
        if (count <= 0) {
          clearInterval(interval);
          setTimerCountdown(null);
          executeCapture();
        } else {
          setTimerCountdown(count);
        }
      }, 1000);
    } else {
      executeCapture();
    }
  };

  const executeCapture = () => {
    playCameraShutterSound();
    setPhotoSnapped(true);

    let capturedUrl: string | undefined = undefined;

    // If real video is active, snapshot it to canvas
    if (videoRef.current && cameraStreamAvailable) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          capturedUrl = canvas.toDataURL('image/jpeg', 0.85);
        }
      } catch {
        // canvas fallback
      }
    }

    const newPhoto: UserPhotoItem = {
      id: Date.now().toString(),
      url: capturedUrl,
      emoji: capturedUrl ? undefined : '📸',
      title: mode === 'portrait' ? 'Portrait Capture' : 'Camera Snapshot',
      date: 'Just now',
      isFavorite: false,
      isCameraRoll: true
    };

    onUpdateState((s) => ({
      ...s,
      userPhotos: [newPhoto, ...s.userPhotos]
    }));

    setTimeout(() => {
      setPhotoSnapped(false);
    }, 200);
  };

  // Upload photo from user's primary device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newPhoto: UserPhotoItem = {
          id: Date.now().toString(),
          url,
          title: file.name || 'Imported Photo',
          date: 'Just now',
          isFavorite: true,
          isCameraRoll: true
        };
        onUpdateState((s) => ({
          ...s,
          userPhotos: [newPhoto, ...s.userPhotos]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatVideoDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const latestPhoto = state.userPhotos[0];

  return (
    <div className="h-full flex flex-col bg-black text-white select-none text-xs font-sans relative overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Camera Controls */}
      <div className="pt-12 pb-2 px-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => setFlash(!flash)}
          title="Flash Mode"
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            flash ? 'bg-amber-400 text-black' : 'bg-neutral-800/80 text-neutral-300'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
        </button>

        {/* Video recording indicator or Mode Header */}
        {isVideoRecording ? (
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-600/90 text-white font-mono text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>{formatVideoDuration(videoDuration)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-0.5 rounded-full bg-neutral-800/80 text-[10px] tracking-widest uppercase font-semibold text-neutral-300">
              {mode}
            </div>
            {cc.photographicStyle !== 'Standard' && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[8px] font-semibold">
                {cc.photographicStyle}
              </span>
            )}
          </div>
        )}

        {/* Camera Control HUD toggle, Timer toggle & Device File Import */}
        <div className="flex items-center gap-1.5">
          {/* iOS 18 Camera Control HUD Button */}
          <button
            onClick={() => {
              playCameraControlLightPress();
              onUpdateState((s) => ({
                ...s,
                cameraControl: {
                  ...s.cameraControl,
                  isOpen: !s.cameraControl.isOpen,
                },
              }));
            }}
            title="iOS 18 Camera Control HUD (Tools & Lenses)"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              cc.isOpen
                ? 'bg-amber-400 text-black shadow-md ring-2 ring-amber-400/50'
                : 'bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setTimerMode((t) => (t === 0 ? 3 : t === 3 ? 10 : 0))}
            title="Timer"
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors cursor-pointer ${
              timerMode > 0 ? 'bg-amber-400 text-black' : 'bg-neutral-800/80 text-neutral-300'
            }`}
          >
            {timerMode === 0 ? <Timer className="w-3.5 h-3.5" /> : `${timerMode}s`}
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload Photo from Primary Device"
            className="w-7 h-7 rounded-full bg-neutral-800/80 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Viewfinder Area */}
      <div className="flex-1 relative flex items-center justify-center bg-neutral-950 overflow-hidden mx-2 rounded-3xl border border-neutral-800">
        {/* Shutter flash screen animation */}
        {photoSnapped && <div className="absolute inset-0 bg-white z-40 animate-ping opacity-90 pointer-events-none" />}

        {/* Countdown Overlay */}
        {timerCountdown !== null && (
          <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center">
            <span className="text-7xl font-bold text-amber-400 animate-bounce">{timerCountdown}</span>
          </div>
        )}

        {/* Real Live Camera Video Stream */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          style={{
            transform: `scale(${effectiveZoom}) ${facingMode === 'user' ? 'scaleX(-1)' : ''}`,
            filter: combinedFilter,
            transition: 'transform 0.15s ease-out, filter 0.15s ease-out',
          }}
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity ${
            cameraStreamAvailable ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Fallback Viewfinder if webcam permission is not granted */}
        {!cameraStreamAvailable && (
          <div
            style={{ filter: combinedFilter }}
            className="w-full h-full relative flex flex-col items-center justify-center bg-gradient-to-b from-neutral-800 via-neutral-900 to-black p-4 text-center transition-all"
          >
            <div
              style={{
                transform: `scale(${effectiveZoom})`,
                transition: 'transform 0.15s ease-out',
              }}
              className="relative z-10 space-y-2 max-w-[220px]"
            >
              <div
                className={`w-32 h-32 mx-auto rounded-3xl bg-gradient-to-tr from-sky-400 via-indigo-400 to-purple-500 flex items-center justify-center shadow-2xl transition-transform duration-300 ${
                  mode === 'portrait' ? 'ring-4 ring-amber-400/40' : ''
                }`}
              >
                <span className="text-5xl">{mode === 'portrait' ? '👤' : '🌸'}</span>
              </div>
              <p className="text-neutral-300 text-[11px] font-medium">
                {mode === 'portrait'
                  ? `Depth Effect (${cc.depthValue ? `ƒ/${cc.depthValue}` : 'ƒ/1.4'}) Active`
                  : 'Primary Device Camera Ready'}
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 rounded-full bg-blue-600/40 hover:bg-blue-600/70 border border-blue-400/40 text-blue-200 text-[10px] font-semibold cursor-pointer"
              >
                + Import from My Computer
              </button>
            </div>
          </div>
        )}

        {/* Rule of thirds grid overlay */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 z-10">
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-white" />
          <div className="border-r border-white" />
          <div />
        </div>

        {/* Optical Zoom / Lens Pill */}
        <div className="absolute bottom-3 flex items-center gap-1 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 z-20 shadow-lg">
          {(['0.5x', '1x', '2x', '5x'] as const).map((z) => {
            const zNum = parseFloat(z.replace('x', ''));
            const isMatch = Math.abs(effectiveZoom - zNum) < 0.2;
            return (
              <button
                key={z}
                onClick={() => {
                  setZoom(z === '5x' ? '3x' : z);
                  onUpdateState((s) => ({
                    ...s,
                    cameraControl: {
                      ...s.cameraControl,
                      zoomValue: zNum,
                      activeCameraLens: z,
                    },
                  }));
                }}
                className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                  isMatch ? 'bg-amber-400 text-black scale-110 font-extrabold shadow' : 'text-neutral-300 hover:text-white'
                }`}
              >
                {z.replace('x', '')}
              </button>
            );
          })}
          {effectiveZoom !== 0.5 && effectiveZoom !== 1 && effectiveZoom !== 2 && effectiveZoom !== 5 && (
            <span className="text-[9px] font-mono text-amber-300 ml-1 px-1 py-0.5 rounded bg-white/10">
              {effectiveZoom.toFixed(1)}x
            </span>
          )}
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="py-2 flex items-center justify-center gap-6 text-[11px] font-semibold tracking-wider text-neutral-400 z-20">
        <button
          onClick={() => setMode('video')}
          className={`transition-colors cursor-pointer ${mode === 'video' ? 'text-amber-400 font-bold scale-105' : 'hover:text-white'}`}
        >
          VIDEO
        </button>
        <button
          onClick={() => setMode('photo')}
          className={`transition-colors cursor-pointer ${mode === 'photo' ? 'text-amber-400 font-bold scale-105' : 'hover:text-white'}`}
        >
          PHOTO
        </button>
        <button
          onClick={() => setMode('portrait')}
          className={`transition-colors cursor-pointer ${mode === 'portrait' ? 'text-amber-400 font-bold scale-105' : 'hover:text-white'}`}
        >
          PORTRAIT
        </button>
      </div>

      {/* Bottom Shutter & Gallery Bar */}
      <div className="pb-6 pt-1 px-8 flex items-center justify-between z-20">
        {/* Recent Photo thumbnail */}
        <button
          onClick={() => onUpdateState((s) => ({ ...s, currentApp: 'photos' }))}
          title="Open Photos Gallery"
          className="w-11 h-11 rounded-xl bg-neutral-800 border-2 border-white/40 overflow-hidden flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
        >
          {latestPhoto?.url ? (
            <img src={latestPhoto.url} alt="Latest" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">{latestPhoto?.emoji || '🌸'}</span>
          )}
        </button>

        {/* Big Shutter Button */}
        <button
          onClick={handleShutterClick}
          title={mode === 'video' ? (isVideoRecording ? 'Stop Recording' : 'Start Video') : 'Take Photo (or use Vol Up)'}
          className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1 cursor-pointer active:scale-90 transition-transform"
        >
          <div
            className={`w-full h-full rounded-full transition-all ${
              mode === 'video'
                ? isVideoRecording
                  ? 'bg-red-600 rounded-md scale-75'
                  : 'bg-red-600'
                : 'bg-white'
            }`}
          />
        </button>

        {/* Flip Camera (Front / Back) */}
        <button
          onClick={() => setFacingMode((f) => (f === 'user' ? 'environment' : 'user'))}
          title="Switch Front / Back Camera"
          className="w-11 h-11 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
