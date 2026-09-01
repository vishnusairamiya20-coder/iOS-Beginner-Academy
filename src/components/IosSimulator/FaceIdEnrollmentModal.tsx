import React, { useState, useEffect, useRef } from 'react';
import {
  Scan,
  Check,
  X,
  ShieldCheck,
  Sparkles,
  Lock,
  ChevronRight,
  Eye,
  Camera,
  RefreshCw,
  AlertCircle,
  Video,
  VideoOff,
  User
} from 'lucide-react';
import { SimulatorState } from '../../types';
import {
  playFaceIdSuccessSound,
  playFaceIdFailureSound,
  playBiometricTickSound,
  playDtmfTone
} from '../../utils/audioUtils';

interface FaceIdEnrollmentModalProps {
  state: SimulatorState;
  onClose: () => void;
  onComplete: () => void;
}

export const FaceIdEnrollmentModal: React.FC<FaceIdEnrollmentModalProps> = ({
  state,
  onClose,
  onComplete
}) => {
  // Step: 'intro' | 'scanning_1' | 'pause_1' | 'scanning_2' | 'completed'
  const [step, setStep] = useState<'intro' | 'scanning_1' | 'pause_1' | 'scanning_2' | 'completed'>('intro');
  const [scanProgress, setScanProgress] = useState(0); // 0 to 100
  const [headAngle, setHeadAngle] = useState({ x: 0, y: 0 });
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedMotion, setDetectedMotion] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);

  // Total ticks on the circular Face ID ring
  const TOTAL_TICKS = 36;
  const completedTicks = Math.floor((scanProgress / 100) * TOTAL_TICKS);

  // Initialize camera stream
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 480 },
            height: { ideal: 480 }
          },
          audio: false
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
        setCameraError(null);
      } else {
        setCameraActive(false);
        setCameraError('Camera API not supported in browser environment');
      }
    } catch (err: any) {
      console.log('Face ID Camera access notice:', err);
      setCameraActive(false);
      setCameraError('Camera permission requested. Using simulated TrueDepth sensor.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Start camera when entering scanning steps
  useEffect(() => {
    if (step === 'scanning_1' || step === 'scanning_2') {
      startCamera();
    } else if (step === 'completed' || step === 'intro') {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [step, facingMode]);

  // Motion / Head Movement Detection via Canvas diffing
  useEffect(() => {
    let animId: number;
    let lastCheckTime = 0;

    const analyzeVideoMotion = (time: number) => {
      if ((step === 'scanning_1' || step === 'scanning_2') && videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx && video.readyState >= 2 && time - lastCheckTime > 120) {
          lastCheckTime = time;
          const w = 32;
          const h = 32;
          ctx.drawImage(video, 0, 0, w, h);
          const currentFrame = ctx.getImageData(0, 0, w, h).data;

          if (prevFrameDataRef.current) {
            let diffSum = 0;
            const prev = prevFrameDataRef.current;
            for (let i = 0; i < currentFrame.length; i += 4) {
              const rDiff = Math.abs(currentFrame[i] - prev[i]);
              const gDiff = Math.abs(currentFrame[i + 1] - prev[i + 1]);
              const bDiff = Math.abs(currentFrame[i + 2] - prev[i + 2]);
              diffSum += rDiff + gDiff + bDiff;
            }

            // Normalizing diff
            const avgDiff = diffSum / (w * h * 3);
            if (avgDiff > 4.5) {
              setDetectedMotion(true);
              // Accelerate scanning on real head movement
              setScanProgress((p) => {
                const next = Math.min(100, p + 2.5);
                playBiometricTickSound();
                return next;
              });
            } else {
              setDetectedMotion(false);
            }
          }
          prevFrameDataRef.current = currentFrame;
        }
      }
      animId = requestAnimationFrame(analyzeVideoMotion);
    };

    animId = requestAnimationFrame(analyzeVideoMotion);
    return () => cancelAnimationFrame(animId);
  }, [step]);

  // Standard scanning timer loop (allows completion even if static)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (step === 'scanning_1' || step === 'scanning_2') {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          const next = prev + 1.8;
          playBiometricTickSound();

          // Subtly animate virtual depth angle
          const angle = (next / 100) * Math.PI * 2;
          setHeadAngle({
            x: Math.sin(angle) * 10,
            y: Math.cos(angle) * 8
          });

          if (next >= 100) {
            if (step === 'scanning_1') {
              setStep('pause_1');
              setScanProgress(0);
              playFaceIdSuccessSound();
            } else {
              setStep('completed');
              playFaceIdSuccessSound();
            }
            return 100;
          }
          return next;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step]);

  const handleMouseMoveCircle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (step !== 'scanning_1' && step !== 'scanning_2') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    setHeadAngle({
      x: deltaX * 16,
      y: deltaY * 16
    });
  };

  return (
    <div className="absolute inset-0 z-50 bg-black text-white flex flex-col justify-between p-4 pt-12 select-none animate-fade-in font-sans">
      {/* Hidden processing canvas for webcam motion tracking */}
      <canvas ref={canvasRef} width={32} height={32} className="hidden" />

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="text-blue-400 text-xs font-semibold py-1 px-2 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
          <Scan className="w-3.5 h-3.5 text-blue-400" />
          Face ID Setup
        </span>
        {cameraActive && (
          <button
            onClick={() => setFacingMode((m) => (m === 'user' ? 'environment' : 'user'))}
            className="text-neutral-400 hover:text-white p-1"
            title="Switch Camera"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
        {!cameraActive && <div className="w-6" />}
      </div>

      {/* INTRO SCREEN */}
      {step === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-5 animate-fade-in">
          {/* Animated Face ID Graphic */}
          <div className="relative w-28 h-28 rounded-3xl border-2 border-dashed border-blue-400/60 flex items-center justify-center bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.25)]">
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-14 h-18 rounded-2xl border-2 border-blue-400 flex flex-col items-center justify-around py-3 relative">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                </div>
                <div className="w-1 h-3 rounded-full bg-blue-400/80" />
                <div className="w-4 h-2 rounded-b-full border-b-2 border-blue-400" />
              </div>
              <div className="absolute -top-3 -left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-blue-400" />
              <div className="absolute -top-3 -right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-blue-400" />
              <div className="absolute -bottom-3 -left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-blue-400" />
              <div className="absolute -bottom-3 -right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-blue-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight">How to Set Up Face ID</h2>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-[260px] mx-auto">
              Your device camera will scan your face to create a 3D depth map. Move your head in a circle to show all angles.
            </p>
          </div>

          {/* Camera Permission & Privacy Badge */}
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 text-left space-y-1.5 w-full">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Camera className="w-4 h-4 text-blue-400" />
              <span>Real-Time TrueDepth Camera Scan</span>
            </div>
            <p className="text-[10px] leading-tight text-neutral-400">
              When prompted, allow camera access so the simulator can map your facial contours live.
            </p>
          </div>

          <div className="w-full space-y-2 pt-1">
            <button
              onClick={() => {
                setStep('scanning_1');
                setScanProgress(0);
              }}
              className="w-full py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-98 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera Face Scan</span>
            </button>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="w-full py-2 text-blue-400 text-xs font-semibold hover:underline"
            >
              Set Up Later in Settings
            </button>
          </div>
        </div>
      )}

      {/* SCANNING STEP 1 OR 2 WITH REAL CAMERA */}
      {(step === 'scanning_1' || step === 'scanning_2') && (
        <div className="flex-1 flex flex-col items-center justify-between text-center py-1 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold flex items-center justify-center gap-1.5">
              <span>{step === 'scanning_1' ? 'First Face ID Scan' : 'Second Face ID Scan'}</span>
              {detectedMotion && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" title="Motion Detected" />
              )}
            </h3>
            <p className="text-[11px] text-neutral-300">
              {step === 'scanning_1'
                ? 'Look directly at the camera and slowly rotate your head.'
                : 'Turn your head slightly to complete the remaining angles.'}
            </p>
          </div>

          {/* 3D TrueDepth Circular Scanning Viewport */}
          <div
            onMouseMove={handleMouseMoveCircle}
            className="relative w-60 h-60 flex items-center justify-center cursor-pointer my-auto"
          >
            {/* Circular Ticks Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 200 200">
              {Array.from({ length: TOTAL_TICKS }).map((_, i) => {
                const angle = (i / TOTAL_TICKS) * 360;
                const isCompleted = i < completedTicks;
                const rad = (angle * Math.PI) / 180;
                const r1 = 82; // Inner radius
                const r2 = 94; // Outer radius
                const x1 = 100 + r1 * Math.cos(rad);
                const y1 = 100 + r1 * Math.sin(rad);
                const x2 = 100 + r2 * Math.cos(rad);
                const y2 = 100 + r2 * Math.sin(rad);

                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isCompleted ? '#22c55e' : '#334155'}
                    strokeWidth={isCompleted ? 3.5 : 2}
                    strokeLinecap="round"
                    className="transition-colors duration-150"
                  />
                );
              })}
            </svg>

            {/* Inner Circular Viewport with LIVE WEBCAM or Biometric Mesh */}
            <div className="w-40 h-40 rounded-full overflow-hidden bg-neutral-950 border-2 border-neutral-700 relative flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.8)]">
              {/* LIVE WEBCAM VIDEO ELEMENT */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
                  cameraActive ? 'opacity-85' : 'opacity-0'
                }`}
              />

              {/* FALLBACK SYNTHETIC FACE IF CAMERA IS OFFLINE */}
              {!cameraActive && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-100"
                  style={{
                    transform: `translate(${headAngle.x}px, ${headAngle.y}px)`
                  }}
                >
                  <div className="w-20 h-24 rounded-full border-2 border-emerald-400/80 bg-emerald-500/10 flex flex-col items-center justify-around py-3 relative">
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    </div>
                    <div className="w-1.5 h-3 rounded-full bg-emerald-400" />
                    <div className="w-6 h-2 rounded-b-full border-b-2 border-emerald-300" />
                  </div>
                </div>
              )}

              {/* OVERLAY: TRUEDEPTH 3D BIOMETRIC LIDAR MESH */}
              <div
                className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center"
                style={{
                  transform: `translate(${headAngle.x * 0.5}px, ${headAngle.y * 0.5}px)`
                }}
              >
                {/* Face Bounding Box & Landmarks */}
                <div className="relative w-24 h-30 rounded-2xl border border-emerald-400/40 shadow-[0_0_15px_rgba(34,197,94,0.3)] flex flex-col items-center justify-between p-2">
                  {/* Eye Target Reticles */}
                  <div className="flex justify-between w-full px-1 pt-4">
                    <div className="w-4 h-4 border border-dashed border-emerald-300/80 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                    </div>
                    <div className="w-4 h-4 border border-dashed border-emerald-300/80 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                    </div>
                  </div>

                  {/* Nose & Mouth Depth Line */}
                  <div className="w-6 h-3 border-b-2 border-emerald-400/80 rounded-full mb-2" />

                  {/* LiDAR Depth Matrix Dots */}
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-5 gap-1 p-2 opacity-50">
                    {Array.from({ length: 20 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-0.5 h-0.5 rounded-full mx-auto my-auto ${
                          idx % 2 === 0 ? 'bg-emerald-300' : 'bg-teal-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Crosshair markers */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>

              {/* Scanning Laser Beam Sweep */}
              <div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#22c55e] z-30 pointer-events-none animate-pulse"
                style={{ top: `${scanProgress % 100}%` }}
              />
            </div>
          </div>

          {/* Bottom Progress and Camera Status */}
          <div className="space-y-2 w-full px-2">
            <div className="flex items-center justify-between text-xs text-neutral-300 px-2">
              <span className="flex items-center gap-1.5 text-[11px]">
                {cameraActive ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live TrueDepth Stream Active
                  </>
                ) : (
                  <>
                    <Camera className="w-3 h-3 text-neutral-400" />
                    Biometric Depth Simulator
                  </>
                )}
              </span>
              <span className="font-mono font-bold text-emerald-400 text-xs">{Math.round(scanProgress)}%</span>
            </div>

            <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-neutral-700">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-150"
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-neutral-400 px-1">
              <span>{cameraActive ? 'Turn your head slightly' : 'Move mouse or tap circle'}</span>
              {!cameraActive && (
                <button
                  onClick={startCamera}
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Enable Webcam
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PAUSE SCREEN BETWEEN SCANS */}
      {step === 'pause_1' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-6 animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
            <Check className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">First Face ID Scan Complete</h2>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-[260px] mx-auto">
              Now rotate your head a second time to finish mapping the outer edges of your face.
            </p>
          </div>

          <button
            onClick={() => {
              setStep('scanning_2');
              setScanProgress(0);
            }}
            className="w-full py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-98 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            Continue to 2nd Scan
          </button>
        </div>
      )}

      {/* COMPLETED SCREEN */}
      {step === 'completed' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-5 animate-fade-in">
          {/* Animated Success Badge */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-[0_0_40px_rgba(34,197,94,0.5)]">
            <div className="w-full h-full bg-neutral-950 rounded-[22px] flex items-center justify-center flex-col">
              <Check className="w-10 h-10 text-emerald-400 mb-0.5" />
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Face Enrolled</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold">Face ID is Now Set Up</h2>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-[260px] mx-auto">
              Your face has been securely mapped. You can now unlock your iPhone, authenticate downloads, and autofill passwords.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-left text-xs space-y-2 w-full">
            <div className="flex items-center gap-2 text-neutral-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px]">Facial Geometry Stored in Secure Enclave</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px]">iPhone Unlock & Apple Pay Enabled</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px]">Attention Aware Features Active</span>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onComplete();
            }}
            className="w-full py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-98 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// Live Biometric Face ID Test / Authentication Popup with Real Camera Feed
interface FaceIdPromptProps {
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
}

export const FaceIdPrompt: React.FC<FaceIdPromptProps> = ({
  onSuccess,
  onCancel,
  title = 'Face ID',
  subtitle = 'Looking for Face...'
}) => {
  const [status, setStatus] = useState<'scanning' | 'success'>('scanning');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraStreamActive, setCameraStreamActive] = useState(false);

  useEffect(() => {
    async function startCameraFeed() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 320 } },
            audio: false
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
          setCameraStreamActive(true);
        }
      } catch (e) {
        console.log('Prompt camera stream unavailable:', e);
      }
    }

    startCameraFeed();

    const timer = setTimeout(() => {
      setStatus('success');
      playFaceIdSuccessSound();
      const finishTimer = setTimeout(() => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
        onSuccess();
      }, 700);
      return () => clearTimeout(finishTimer);
    }, 1400);

    return () => {
      clearTimeout(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [onSuccess]);

  return (
    <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in select-none">
      <div className="w-full max-w-[260px] rounded-3xl bg-neutral-900/95 border border-neutral-700/80 p-5 flex flex-col items-center text-center space-y-4 shadow-2xl text-white">
        {/* Face ID Animated Aperture with Live Camera Feed */}
        <div className="relative w-24 h-24 rounded-2xl border-2 border-blue-400/80 overflow-hidden flex items-center justify-center bg-blue-500/10 shadow-lg">
          {/* Live Camera Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
              cameraStreamActive ? 'opacity-85' : 'opacity-0'
            }`}
          />

          {status === 'scanning' ? (
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-around py-2">
              {/* Corner brackets */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-blue-400" />
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-blue-400" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-blue-400" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-blue-400" />

              {!cameraStreamActive && (
                <div className="relative w-10 h-12 rounded-xl border-2 border-blue-400 flex flex-col items-center justify-around py-2 animate-pulse">
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </div>
                  <div className="w-1 h-2 rounded-full bg-blue-400" />
                  <div className="w-3 h-1 rounded-b-full border-b-2 border-blue-400" />
                </div>
              )}

              {/* Scanning laser sweep */}
              <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#22c55e] animate-bounce" />
            </div>
          ) : (
            <div className="relative z-10 w-full h-full bg-black/40 backdrop-blur-xs flex items-center justify-center">
              <Check className="w-12 h-12 text-emerald-400 animate-scale-up" />
            </div>
          )}
        </div>

        <div>
          <h4 className="font-bold text-sm">{title}</h4>
          <p className="text-[11px] text-neutral-300 mt-0.5">
            {status === 'scanning' ? subtitle : 'Face Verified'}
          </p>
        </div>

        <button
          onClick={() => {
            if (streamRef.current) {
              streamRef.current.getTracks().forEach((t) => t.stop());
            }
            onCancel();
          }}
          className="text-xs text-blue-400 font-semibold hover:underline pt-0.5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
