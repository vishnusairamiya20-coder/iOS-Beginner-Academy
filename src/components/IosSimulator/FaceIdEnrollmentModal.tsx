import React, { useState, useEffect } from 'react';
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
  AlertCircle
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
  const [scanMessage, setScanMessage] = useState('Position your face within the frame');

  // Total ticks on the circular Face ID ring
  const TOTAL_TICKS = 36;
  const completedTicks = Math.floor((scanProgress / 100) * TOTAL_TICKS);

  // Handle auto or manual scanning progression in scanning steps
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (step === 'scanning_1' || step === 'scanning_2') {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          const next = prev + 3;
          playBiometricTickSound();

          // Subtly animate virtual head angle
          const angle = (next / 100) * Math.PI * 2;
          setHeadAngle({
            x: Math.sin(angle) * 12,
            y: Math.cos(angle) * 10
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
      }, 90);
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
      x: deltaX * 18,
      y: deltaY * 18
    });
  };

  return (
    <div className="absolute inset-0 z-50 bg-black text-white flex flex-col justify-between p-5 pt-12 select-none animate-fade-in font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-blue-400 text-xs font-semibold py-1 px-2 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Cancel
        </button>
        <span className="text-xs font-bold text-neutral-400">Face ID Setup</span>
        <div className="w-12" />
      </div>

      {/* INTRO SCREEN */}
      {step === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-6 animate-fade-in">
          {/* Animated Face ID Graphic */}
          <div className="relative w-32 h-32 rounded-3xl border-2 border-dashed border-blue-400/60 flex items-center justify-center bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <div className="relative flex flex-col items-center justify-center">
              {/* Stylized Face Icon */}
              <div className="w-16 h-20 rounded-2xl border-2 border-blue-400 flex flex-col items-center justify-around py-3 relative">
                {/* Eyes */}
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                </div>
                {/* Nose */}
                <div className="w-1 h-3 rounded-full bg-blue-400/80" />
                {/* Smile */}
                <div className="w-5 h-2 rounded-b-full border-b-2 border-blue-400" />
              </div>
              {/* Corner brackets */}
              <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
              <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
              <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
              <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight">How to Set Up Face ID</h2>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-[260px] mx-auto">
              First, position your face in the camera frame. Then move your head in a circle to show all the angles of your face.
            </p>
          </div>

          {/* Privacy & TrueDepth Info Badge */}
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 text-left space-y-1.5 w-full">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secure Enclave Protected</span>
            </div>
            <p className="text-[10px] leading-tight text-neutral-400">
              Face ID data never leaves your device and is never backed up to iCloud or anywhere else.
            </p>
          </div>

          <div className="w-full space-y-2 pt-2">
            <button
              onClick={() => {
                setStep('scanning_1');
                setScanProgress(0);
              }}
              className="w-full py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-98 text-white font-bold text-xs shadow-lg transition-all"
            >
              Get Started
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-blue-400 text-xs font-semibold hover:underline"
            >
              Set Up Later in Settings
            </button>
          </div>
        </div>
      )}

      {/* SCANNING STEP 1 OR 2 */}
      {(step === 'scanning_1' || step === 'scanning_2') && (
        <div className="flex-1 flex flex-col items-center justify-between text-center py-2 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-lg font-bold">
              {step === 'scanning_1' ? 'First Face ID Scan' : 'Second Face ID Scan'}
            </h3>
            <p className="text-[11px] text-neutral-400">
              {step === 'scanning_1'
                ? 'Move your head slowly to complete the circle.'
                : 'Move your head slowly to complete the remaining angles.'}
            </p>
          </div>

          {/* 3D TrueDepth Scanning Circular Viewport */}
          <div
            onMouseMove={handleMouseMoveCircle}
            className="relative w-56 h-56 flex items-center justify-center cursor-pointer my-auto"
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
                    strokeWidth={isCompleted ? 3 : 2}
                    strokeLinecap="round"
                    className="transition-colors duration-150"
                  />
                );
              })}
            </svg>

            {/* Inner Video / Biometric Depth Map Camera Feed Simulation */}
            <div className="w-38 h-38 rounded-full overflow-hidden bg-neutral-900 border-2 border-neutral-700 relative flex items-center justify-center shadow-inner">
              {/* Scanning Laser Beam Sweep */}
              <div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#22c55e] z-20 animate-bounce"
                style={{ top: `${(scanProgress % 100)}%` }}
              />

              {/* 3D Face Dot Matrix Representation */}
              <div
                className="relative transition-transform duration-100 flex flex-col items-center justify-center"
                style={{
                  transform: `translate(${headAngle.x}px, ${headAngle.y}px) rotateY(${headAngle.x * 1.5}deg)`
                }}
              >
                {/* 3D Face Outline */}
                <div className="w-20 h-24 rounded-full border-2 border-emerald-400/80 bg-emerald-500/10 flex flex-col items-center justify-around py-3 relative shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  {/* Eyes with Depth Crosshairs */}
                  <div className="flex gap-5">
                    <div className="w-2.5 h-2.5 rounded-full border border-emerald-300 bg-emerald-400/40 flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full border border-emerald-300 bg-emerald-400/40 flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                  </div>

                  {/* Nose Bridge Contour */}
                  <div className="w-1.5 h-4 rounded-full bg-emerald-400/70" />

                  {/* Mouth Curvature */}
                  <div className="w-7 h-2.5 rounded-b-full border-b-2 border-emerald-300" />

                  {/* Dot Grid Depth Points */}
                  <div className="absolute inset-0 grid grid-cols-5 grid-rows-6 gap-1 p-2 opacity-40 pointer-events-none">
                    {Array.from({ length: 30 }).map((_, dIdx) => (
                      <div key={dIdx} className="w-0.5 h-0.5 rounded-full bg-emerald-300 mx-auto my-auto" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Progress Counter */}
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between text-xs text-neutral-400 px-4">
              <span>Biometric TrueDepth Scan</span>
              <span className="font-mono font-bold text-emerald-400">{scanProgress}%</span>
            </div>
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-100"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-neutral-500">
              Tip: Move your mouse or finger inside the circle to adjust camera angle
            </p>
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
              Now rotate your head a second time to map remaining facial depth contours.
            </p>
          </div>

          <button
            onClick={() => {
              setStep('scanning_2');
              setScanProgress(0);
            }}
            className="w-full py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-98 text-white font-bold text-xs shadow-lg transition-all"
          >
            Continue
          </button>
        </div>
      )}

      {/* COMPLETED SCREEN */}
      {step === 'completed' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-6 animate-fade-in">
          {/* Animated Success Badge */}
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-[0_0_40px_rgba(34,197,94,0.5)]">
            <div className="w-full h-full bg-neutral-950 rounded-[22px] flex items-center justify-center flex-col">
              <Check className="w-12 h-12 text-emerald-400 mb-1" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Enrolled</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold">Face ID is Now Set Up</h2>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-[260px] mx-auto">
              Face ID is now ready to securely unlock your iPhone, authenticate Apple Pay, and autofill passwords.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-left text-xs space-y-2 w-full">
            <div className="flex items-center gap-2 text-neutral-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px]">iPhone Unlock Enabled</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px]">App Store & Apple Pay Ready</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-200">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px]">Password Autofill Active</span>
            </div>
          </div>

          <button
            onClick={() => {
              onComplete();
            }}
            className="w-full py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-98 text-white font-bold text-xs shadow-lg transition-all"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// Live Biometric Face ID Test / Authentication Popup
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
      playFaceIdSuccessSound();
      const finishTimer = setTimeout(() => {
        onSuccess();
      }, 700);
      return () => clearTimeout(finishTimer);
    }, 1100);

    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in select-none">
      <div className="w-full max-w-[260px] rounded-3xl bg-neutral-900/90 border border-neutral-700/80 p-6 flex flex-col items-center text-center space-y-4 shadow-2xl text-white">
        {/* Face ID Animated Icon */}
        <div className="relative w-20 h-20 rounded-2xl border-2 border-blue-400/80 flex items-center justify-center bg-blue-500/10">
          {status === 'scanning' ? (
            <div className="relative w-12 h-14 rounded-xl border-2 border-blue-400 flex flex-col items-center justify-around py-2 animate-pulse">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              </div>
              <div className="w-1 h-2 rounded-full bg-blue-400" />
              <div className="w-4 h-1.5 rounded-b-full border-b-2 border-blue-400" />

              {/* Scanning beam */}
              <div className="absolute inset-x-0 h-0.5 bg-blue-400 animate-bounce" />
            </div>
          ) : (
            <Check className="w-12 h-12 text-emerald-400 animate-scale-up" />
          )}

          {/* Corner brackets */}
          <div className="absolute -top-2 -left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-blue-400" />
          <div className="absolute -top-2 -right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-blue-400" />
          <div className="absolute -bottom-2 -left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-blue-400" />
          <div className="absolute -bottom-2 -right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-blue-400" />
        </div>

        <div>
          <h4 className="font-bold text-sm">{title}</h4>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            {status === 'scanning' ? subtitle : 'Authenticated'}
          </p>
        </div>

        <button
          onClick={onCancel}
          className="text-xs text-blue-400 font-semibold hover:underline pt-1"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
