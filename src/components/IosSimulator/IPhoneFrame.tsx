import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Wifi,
  Battery,
  Zap,
  Volume2,
  Volume1,
  Volume,
  VolumeX,
  Radio,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Scan,
  Lock,
  Unlock,
  Key,
  Plus,
  Minus,
  Bell,
  BellOff,
  Power
} from 'lucide-react';
import { SimulatorState, IosAppId } from '../../types';
import { DynamicIsland } from './DynamicIsland';
import { HomeScreen } from './HomeScreen';
import { ControlCenter } from './ControlCenter';
import { NotificationCenter } from './NotificationCenter';
import { SpotlightSearch } from './SpotlightSearch';
import { AppSwitcher } from './AppSwitcher';
import { VolumeHUD } from './VolumeHUD';
import { SiriOverlay } from './SiriOverlay';
import { SettingsApp } from './apps/SettingsApp';
import { MessagesApp } from './apps/MessagesApp';
import { CameraApp } from './apps/CameraApp';
import { PhoneApp } from './apps/PhoneApp';
import { SafariApp } from './apps/SafariApp';
import { ChromeApp } from './apps/ChromeApp';
import { PhotosApp } from './apps/PhotosApp';
import { AppStoreApp } from './apps/AppStoreApp';
import { CalculatorApp } from './apps/CalculatorApp';
import { ClockApp } from './apps/ClockApp';
import { WeatherApp } from './apps/UtilityApps';
import { FounderApp } from './apps/FounderApp';
import { MusicApp } from './apps/MusicApp';
import { YouTubeApp } from './apps/YouTubeApp';
import { PinterestApp } from './apps/PinterestApp';
import { WallpaperBackground } from './WallpaperBackground';
import { PasscodeKeypad } from './PasscodeKeypad';
import { playLockSound, playUnlockSound, playVolumeStepSound, playCameraShutterSound, playFaceIdSuccessSound, playBiometricTickSound } from '../../utils/audioUtils';
import { useLiveClock } from '../../utils/dateTime';

interface IPhoneFrameProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onTriggerGesture?: (gesture: string) => void;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  state,
  onUpdateState,
  onTriggerGesture
}) => {
  const liveClock = useLiveClock();
  const [swipeStartY, setSwipeStartY] = useState<number | null>(null);
  const [screenshotFlash, setScreenshotFlash] = useState(false);
  const [isFaceIdScanning, setIsFaceIdScanning] = useState(false);
  const [isFaceIdUnlocked, setIsFaceIdUnlocked] = useState(false);
  const [showPasscodeUnlock, setShowPasscodeUnlock] = useState(false);
  const [lockCameraActive, setLockCameraActive] = useState(false);
  const [isVolumeHudVisible, setIsVolumeHudVisible] = useState(false);
  const volumeHudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousVolumeRef = useRef<number>(state.volume || 70);

  const showVolumeHUD = useCallback((newVolume: number) => {
    onUpdateState((s) => ({ ...s, volume: newVolume }));
    setIsVolumeHudVisible(true);
    if (volumeHudTimerRef.current) {
      clearTimeout(volumeHudTimerRef.current);
    }
    volumeHudTimerRef.current = setTimeout(() => {
      setIsVolumeHudVisible(false);
    }, 2400);
  }, [onUpdateState]);

  const handleVolumeUp = useCallback(() => {
    if (state.currentApp === 'camera') {
      playCameraShutterSound();
      setScreenshotFlash(true);
      setTimeout(() => setScreenshotFlash(false), 300);
    } else {
      const nextVol = Math.min(100, state.volume + 6);
      playVolumeStepSound(nextVol);
      showVolumeHUD(nextVol);
    }
  }, [state.currentApp, state.volume, showVolumeHUD]);

  const handleVolumeDown = useCallback(() => {
    if (state.currentApp === 'camera') {
      playCameraShutterSound();
      setScreenshotFlash(true);
      setTimeout(() => setScreenshotFlash(false), 300);
    } else {
      const nextVol = Math.max(0, state.volume - 6);
      playVolumeStepSound(nextVol);
      showVolumeHUD(nextVol);
    }
  }, [state.currentApp, state.volume, showVolumeHUD]);

  const handleToggleMute = useCallback(() => {
    if (state.volume > 0) {
      previousVolumeRef.current = state.volume;
      playVolumeStepSound(0);
      showVolumeHUD(0);
    } else {
      const restored = previousVolumeRef.current || 70;
      playVolumeStepSound(restored);
      showVolumeHUD(restored);
    }
  }, [state.volume, showVolumeHUD]);

  // Global keyboard shortcuts for hardware volume and lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input / textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === '+' || e.key === '=' || e.key === ']') {
        e.preventDefault();
        handleVolumeUp();
      } else if (e.key === '-' || e.key === '_' || e.key === '[') {
        e.preventDefault();
        handleVolumeDown();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (volumeHudTimerRef.current) {
        clearTimeout(volumeHudTimerRef.current);
      }
    };
  }, [handleVolumeUp, handleVolumeDown, handleToggleMute]);

  const lockVideoRef = useRef<HTMLVideoElement | null>(null);
  const lockStreamRef = useRef<MediaStream | null>(null);

  const handleLockScreenTap = async () => {
    if (state.faceId.isEnrolled && state.faceId.useForIphoneUnlock) {
      setIsFaceIdScanning(true);
      playBiometricTickSound();

      // Quick webcam glance
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 240 }, height: { ideal: 240 } },
            audio: false
          });
          lockStreamRef.current = stream;
          if (lockVideoRef.current) {
            lockVideoRef.current.srcObject = stream;
            lockVideoRef.current.play().catch(() => {});
          }
          setLockCameraActive(true);
        }
      } catch (e) {
        // Fallback without camera stream
        setLockCameraActive(false);
      }

      setTimeout(() => {
        setIsFaceIdScanning(false);
        setIsFaceIdUnlocked(true);
        if (state.faceId.hapticOnSuccess) {
          playFaceIdSuccessSound();
        } else {
          playUnlockSound();
        }

        setTimeout(() => {
          if (lockStreamRef.current) {
            lockStreamRef.current.getTracks().forEach((t) => t.stop());
            lockStreamRef.current = null;
          }
          setLockCameraActive(false);
          setIsFaceIdUnlocked(false);
          onUpdateState((s) => ({ ...s, isLocked: false }));
        }, 450);
      }, 700);
    } else if (state.faceId.isPasscodeEnabled) {
      setShowPasscodeUnlock(true);
    } else {
      playUnlockSound();
      onUpdateState((s) => ({ ...s, isLocked: false }));
    }
  };

  const openApp = (appId: IosAppId) => {
    onUpdateState((s) => ({
      ...s,
      currentApp: appId,
      isControlCenterOpen: false,
      isNotificationCenterOpen: false,
      isSpotlightOpen: false,
      isAppSwitcherOpen: false,
      recentApps: [appId, ...s.recentApps.filter((a) => a !== appId)].slice(0, 8)
    }));
    if (appId === 'settings') {
      onTriggerGesture?.('open_settings');
    }
  };

  const goHome = () => {
    onUpdateState((s) => ({
      ...s,
      currentApp: 'home',
      isControlCenterOpen: false,
      isNotificationCenterOpen: false,
      isSpotlightOpen: false,
      isAppSwitcherOpen: false
    }));
    onTriggerGesture?.('swipe_up_home');
  };

  const openAppSwitcher = () => {
    onUpdateState((s) => ({
      ...s,
      isAppSwitcherOpen: true,
      isControlCenterOpen: false,
      isNotificationCenterOpen: false,
      isSpotlightOpen: false
    }));
    onTriggerGesture?.('swipe_up_pause_app_switcher');
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setSwipeStartY(clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (swipeStartY === null) return;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const diffY = clientY - swipeStartY;

    // Upward swipe on home bar
    if (diffY < -30) {
      if (diffY < -100) {
        openAppSwitcher();
      } else {
        goHome();
      }
    }
    setSwipeStartY(null);
  };

  const triggerScreenshot = () => {
    setScreenshotFlash(true);
    playCameraShutterSound();
    setTimeout(() => setScreenshotFlash(false), 300);
  };

  const handleActionButtonPress = () => {
    playVolumeStepSound(state.volume);
    if (state.actionButtonMode === 'siri') {
      onUpdateState((s) => ({ ...s, isSiriOpen: true }));
    } else if (state.actionButtonMode === 'flashlight') {
      onUpdateState((s) => ({ ...s, isFlashlightOn: !s.isFlashlightOn }));
    } else if (state.actionButtonMode === 'silent') {
      onUpdateState((s) => ({ ...s, isSilentMode: !s.isSilentMode }));
    } else if (state.actionButtonMode === 'camera') {
      openApp('camera');
    } else if (state.actionButtonMode === 'focus') {
      onUpdateState((s) => ({ ...s, isDoNotDisturb: !s.isDoNotDisturb }));
    } else {
      onUpdateState((s) => ({ ...s, isSiriOpen: true }));
    }
  };

  const handlePowerButton = () => {
    if (state.isLocked) {
      playUnlockSound();
      onUpdateState((s) => ({ ...s, isLocked: false }));
    } else {
      playLockSound();
      onUpdateState((s) => ({ ...s, isLocked: true }));
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-2 select-none">
      {/* Flashlight physical glow simulation behind device */}
      {state.isFlashlightOn && (
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-200/40 blur-3xl rounded-full pointer-events-none z-0 animate-pulse" />
      )}

      {/* Screenshot Flash animation */}
      {screenshotFlash && (
        <div className="absolute inset-0 bg-white z-50 rounded-[55px] animate-ping pointer-events-none" />
      )}

      {/* Main iPhone Casing Frame */}
      <div className="relative w-[340px] h-[680px] bg-neutral-900 rounded-[55px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_0_3px_#404040,inset_0_0_0_5px_#171717] z-10 flex flex-col">
        {/* Hardware Action Button (Left edge top) */}
        <button
          onClick={handleActionButtonPress}
          title={`Action Button (${state.actionButtonMode}) - Click to toggle`}
          className="group absolute -left-2 top-28 w-2.5 h-8 bg-neutral-700 hover:bg-amber-500 active:scale-95 active:bg-amber-600 rounded-l-md transition-all cursor-pointer shadow-md flex items-center justify-start pl-0.5"
        >
          <span className="w-1 h-3 rounded-full bg-neutral-400 group-hover:bg-white" />
        </button>

        {/* Hardware Volume Up (Left edge) */}
        <button
          onClick={handleVolumeUp}
          title="Volume Up (+) / Camera Shutter"
          className="group absolute -left-2 top-40 w-2.5 h-12 bg-neutral-700 hover:bg-blue-500 active:scale-95 active:bg-blue-600 rounded-l-md transition-all cursor-pointer shadow-md flex items-center justify-start pl-0.5"
        >
          <span className="w-1 h-4 rounded-full bg-neutral-400 group-hover:bg-white" />
        </button>

        {/* Hardware Volume Down (Left edge) */}
        <button
          onClick={handleVolumeDown}
          title="Volume Down (-) - Click or press '-' key"
          className="group absolute -left-2 top-56 w-2.5 h-12 bg-neutral-700 hover:bg-blue-500 active:scale-95 active:bg-blue-600 rounded-l-md transition-all cursor-pointer shadow-md flex items-center justify-start pl-0.5"
        >
          <span className="w-1 h-4 rounded-full bg-neutral-400 group-hover:bg-white" />
        </button>

        {/* Hardware Side Power Button (Right edge) */}
        <button
          onClick={handlePowerButton}
          title={state.isLocked ? "Power Button (Wake / Unlock)" : "Power Button (Lock Screen)"}
          className="group absolute -right-2 top-40 w-2.5 h-16 bg-neutral-700 hover:bg-neutral-500 active:scale-95 active:bg-neutral-400 rounded-r-md transition-all cursor-pointer shadow-md flex items-center justify-end pr-0.5"
        >
          <span className="w-1 h-6 rounded-full bg-neutral-400 group-hover:bg-white" />
        </button>

        {/* Screen Display Area */}
        <div className="relative w-full h-full bg-black rounded-[46px] overflow-hidden flex flex-col justify-between border border-black shadow-inner">
          {/* Interactive iOS Volume HUD Pill */}
          <VolumeHUD
            volume={state.volume}
            isVisible={isVolumeHudVisible}
            onVolumeChange={showVolumeHUD}
          />
          {/* Dynamic Island */}
          <DynamicIsland
            state={state}
            onUpdateState={onUpdateState}
            onOpenApp={openApp}
          />

          {/* Top Status Bar with clickable gesture zones */}
          <div className="absolute top-0 left-0 right-0 h-11 px-6 pt-3 flex items-center justify-between text-white text-[12px] font-semibold z-40 select-none">
            {/* Left Status Bar: Time & Notification Pull Zone */}
            <div
              onClick={() => onUpdateState((s) => ({ ...s, isNotificationCenterOpen: true }))}
              title="Click to pull down Notification Center"
              className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              <span>{liveClock.timeString}</span>
              {state.isDoNotDisturb && <span className="text-[10px]">🌙</span>}
            </div>

            {/* Right Status Bar: Wi-Fi, Signal & Control Center Pull Zone */}
            <div
              onClick={() => {
                onUpdateState((s) => ({ ...s, isControlCenterOpen: true }));
                onTriggerGesture?.('swipe_down_control_center');
              }}
              title="Click or swipe down to open Control Center"
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Radio className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] font-bold">5G</span>
              {state.isWifiOn && <Wifi className="w-3.5 h-3.5 text-white" />}
              
              {/* Battery Indicator */}
              <div className="flex items-center gap-0.5">
                <div className={`w-5 h-2.5 rounded-xs border border-white/80 p-0.5 flex items-center ${state.isLowPowerMode ? 'bg-yellow-400/20 border-yellow-400' : ''}`}>
                  <div
                    className={`h-full rounded-xs transition-all ${
                      state.isLowPowerMode ? 'bg-yellow-400' : state.batteryLevel < 20 ? 'bg-red-500' : 'bg-white'
                    }`}
                    style={{ width: `${state.batteryLevel}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Screen Content */}
          <div className="flex-1 relative overflow-hidden">
            {state.isLocked ? (
              /* REALISTIC IOS LOCK SCREEN WITH FACE ID & PASSCODE */
              <div
                onClick={handleLockScreenTap}
                className="h-full flex flex-col justify-between pt-14 pb-8 px-6 select-none text-white cursor-pointer relative overflow-hidden"
              >
                {/* Lockscreen Wallpaper */}
                <WallpaperBackground wallpaper={state.wallpaper} isDarkMode={state.isDarkMode} isLockScreen />

                {/* Passcode Keypad Overlay if requested */}
                {showPasscodeUnlock && (
                  <PasscodeKeypad
                    correctPasscode={state.faceId.passcode || '123456'}
                    title="Enter Passcode"
                    subtitle="Unlock your iPhone"
                    onSuccess={() => {
                      setShowPasscodeUnlock(false);
                      onUpdateState((s) => ({ ...s, isLocked: false }));
                    }}
                    onCancel={() => setShowPasscodeUnlock(false)}
                  />
                )}

                {/* Top Lock Icon & Face ID Sensor Visual */}
                <div className="flex flex-col items-center space-y-1 relative z-10">
                  <div className="h-10 flex items-center justify-center">
                    {isFaceIdScanning ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-emerald-400 text-emerald-400 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-pulse">
                        <div className="w-5 h-5 rounded-full overflow-hidden relative border border-emerald-400 bg-neutral-900 flex items-center justify-center">
                          <video
                            ref={lockVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover transform -scale-x-100 ${
                              lockCameraActive ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                          {!lockCameraActive && <Scan className="w-3 h-3 text-emerald-400 animate-spin" />}
                        </div>
                        <span className="text-[10px] font-bold tracking-wider uppercase">Scanning Face...</span>
                      </div>
                    ) : isFaceIdUnlocked ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white backdrop-blur-md shadow-lg animate-scale-up">
                        <Unlock className="w-4 h-4" />
                        <span className="text-[10px] font-bold">Face ID Verified</span>
                      </div>
                    ) : state.faceId.isEnrolled && state.faceId.useForIphoneUnlock ? (
                      <div className="flex items-center gap-1 opacity-85 hover:opacity-100 transition-opacity">
                        <Lock className="w-4 h-4" />
                        <span className="text-[9px] text-white/70 font-medium">Face ID Ready</span>
                      </div>
                    ) : (
                      <Lock className="w-4 h-4 opacity-80" />
                    )}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-90">{liveClock.fullDateString}</p>
                  <h1 className="text-6xl font-light tracking-tighter">{liveClock.timeString}</h1>
                </div>

                {/* Notification Banner on Lock Screen */}
                <div className="space-y-2 relative z-10">
                  <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 text-xs shadow-xl space-y-1 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-rose-400 flex items-center gap-1">
                        <span>✉️</span> Gmail & Messages
                      </span>
                      <span className="text-[10px] opacity-70">Just now</span>
                    </div>
                    <p className="font-medium text-white leading-tight">Sarah: Welcome to your new iPhone!</p>
                  </div>
                </div>

                {/* Bottom Lock Screen Shortcuts (Flashlight, Swipe Up Prompt, Camera, Passcode) */}
                <div className="flex items-center justify-between pt-4 relative z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateState((s) => ({ ...s, isFlashlightOn: !s.isFlashlightOn }));
                    }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all ${
                      state.isFlashlightOn ? 'bg-white text-black' : 'bg-black/40 text-white hover:bg-black/60'
                    }`}
                  >
                    🔦
                  </button>

                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-medium opacity-80 animate-pulse">
                      {state.faceId.isEnrolled && state.faceId.useForIphoneUnlock
                        ? 'Tap to unlock with Face ID'
                        : 'Swipe up to open'}
                    </span>
                    {state.faceId.isPasscodeEnabled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPasscodeUnlock(true);
                        }}
                        className="text-[9px] text-white/60 hover:text-white underline mt-0.5"
                      >
                        Enter Passcode
                      </button>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateState((s) => ({ ...s, isLocked: false, currentApp: 'camera' }));
                    }}
                    className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all"
                  >
                    📷
                  </button>
                </div>
              </div>
            ) : (
              <>
                {state.currentApp === 'home' && (
                  <HomeScreen
                    state={state}
                    onOpenApp={openApp}
                    onTriggerGesture={onTriggerGesture}
                    onUpdateState={onUpdateState}
                  />
                )}

                {state.currentApp === 'phone' && (
                  <PhoneApp
                    state={state}
                    onUpdateState={onUpdateState}
                  />
                )}

                {state.currentApp === 'settings' && (
                  <SettingsApp
                    state={state}
                    onUpdateState={onUpdateState}
                    onClose={goHome}
                  />
                )}

                {state.currentApp === 'messages' && (
                  <MessagesApp
                    state={state}
                    onUpdateState={onUpdateState}
                    onClose={goHome}
                  />
                )}

                {state.currentApp === 'camera' && (
                  <CameraApp
                    state={state}
                    onUpdateState={onUpdateState}
                    onClose={goHome}
                  />
                )}

                {state.currentApp === 'calculator' && (
                  <CalculatorApp state={state} />
                )}

                {state.currentApp === 'clock' && (
                  <ClockApp
                    state={state}
                    onUpdateState={onUpdateState}
                  />
                )}

                {state.currentApp === 'weather' && (
                  <WeatherApp state={state} />
                )}

                {state.currentApp === 'safari' && (
                  <SafariApp state={state} />
                )}

                {state.currentApp === 'chrome' && (
                  <ChromeApp state={state} />
                )}

                {state.currentApp === 'photos' && (
                  <PhotosApp
                    state={state}
                    onUpdateState={onUpdateState}
                    onClose={goHome}
                  />
                )}

                {state.currentApp === 'appstore' && (
                  <AppStoreApp
                    state={state}
                    onOpenApp={openApp}
                    onUpdateState={onUpdateState}
                  />
                )}

                {state.currentApp === 'pinterest' && (
                  <PinterestApp
                    state={state}
                    onUpdateState={onUpdateState}
                    onClose={goHome}
                  />
                )}

                {state.currentApp === 'founder' && (
                  <FounderApp
                    state={state}
                    onUpdateState={onUpdateState}
                    onClose={goHome}
                  />
                )}

                {state.currentApp === 'music' && (
                  <MusicApp
                    state={state}
                    onUpdateState={onUpdateState}
                    onOpenApp={openApp}
                  />
                )}

                {state.currentApp === 'youtube' && (
                  <YouTubeApp
                    state={state}
                    onUpdateState={onUpdateState}
                    onOpenApp={openApp}
                    onClose={goHome}
                  />
                )}
              </>
            )}

            {/* Overlays */}
            {state.isControlCenterOpen && (
              <ControlCenter
                state={state}
                onUpdateState={onUpdateState}
                onClose={() => onUpdateState((s) => ({ ...s, isControlCenterOpen: false }))}
                onTriggerGesture={onTriggerGesture}
              />
            )}

            {state.isNotificationCenterOpen && (
              <NotificationCenter
                state={state}
                onUpdateState={onUpdateState}
                onClose={() => onUpdateState((s) => ({ ...s, isNotificationCenterOpen: false }))}
                onOpenApp={openApp}
              />
            )}

            {state.isSpotlightOpen && (
              <SpotlightSearch
                state={state}
                onClose={() => onUpdateState((s) => ({ ...s, isSpotlightOpen: false }))}
                onOpenApp={openApp}
              />
            )}

            {state.isAppSwitcherOpen && (
              <AppSwitcher
                state={state}
                onClose={() => onUpdateState((s) => ({ ...s, isAppSwitcherOpen: false }))}
                onSelectApp={openApp}
                onRemoveApp={(app) =>
                  onUpdateState((s) => ({
                    ...s,
                    recentApps: s.recentApps.filter((a) => a !== app)
                  }))
                }
              />
            )}

            <SiriOverlay
              isOpen={state.isSiriOpen}
              onClose={() => onUpdateState((s) => ({ ...s, isSiriOpen: false }))}
              state={state}
              onUpdateState={onUpdateState}
              openApp={openApp}
            />
          </div>

          {/* Bottom Home Indicator Bar (Swipe Up Zone) */}
          <div
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={goHome}
            title="Swipe up or Click to Return Home"
            className="h-7 w-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity z-40 bg-transparent"
          >
            <div className="w-32 h-1 bg-white/75 rounded-full shadow-md" />
          </div>
        </div>
      </div>

      {/* Dedicated Physical Hardware Controls Toolbar */}
      <div className="mt-3 w-full max-w-[340px] p-2 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-md backdrop-blur-md flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-300">
            <Volume2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Hardware Buttons</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">
            {state.volume === 0 ? 'Muted' : `${state.volume}%`}
          </span>
        </div>

        {/* Volume & Power Button Cluster */}
        <div className="grid grid-cols-5 gap-1.5">
          {/* Action Button */}
          <button
            onClick={handleActionButtonPress}
            title={`Action Button (${state.actionButtonMode})`}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-amber-400 text-[10px] font-medium transition-all"
          >
            <Zap className="w-3.5 h-3.5 mb-0.5" />
            <span>Action</span>
          </button>

          {/* Volume Down */}
          <button
            onClick={handleVolumeDown}
            title="Volume Down (- key)"
            className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 text-[10px] font-medium transition-all"
          >
            <Minus className="w-3.5 h-3.5 mb-0.5 text-blue-400" />
            <span>Vol -</span>
          </button>

          {/* Mute Toggle */}
          <button
            onClick={handleToggleMute}
            title="Mute / Unmute (M key)"
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl active:scale-95 text-[10px] font-medium transition-all ${
              state.volume === 0
                ? 'bg-rose-950/80 border border-rose-600/50 text-rose-300'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
            }`}
          >
            {state.volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 mb-0.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 mb-0.5 text-emerald-400" />
            )}
            <span>{state.volume === 0 ? 'Unmute' : 'Mute'}</span>
          </button>

          {/* Volume Up */}
          <button
            onClick={handleVolumeUp}
            title="Volume Up (+ key) / Shutter"
            className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 text-[10px] font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5 mb-0.5 text-blue-400" />
            <span>Vol +</span>
          </button>

          {/* Side Power Lock */}
          <button
            onClick={handlePowerButton}
            title="Side Power Button (Lock / Wake)"
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl active:scale-95 text-[10px] font-medium transition-all ${
              state.isLocked
                ? 'bg-amber-950/80 border border-amber-600/50 text-amber-300'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
            }`}
          >
            <Power className="w-3.5 h-3.5 mb-0.5 text-neutral-300" />
            <span>{state.isLocked ? 'Wake' : 'Lock'}</span>
          </button>
        </div>
      </div>

      {/* Quick Interactive Gesture Action Buttons beneath Simulator */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 max-w-[340px]">
        <button
          onClick={goHome}
          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium transition-colors"
        >
          Swipe Home
        </button>
        <button
          onClick={() => onUpdateState((s) => ({ ...s, isControlCenterOpen: !s.isControlCenterOpen }))}
          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium transition-colors"
        >
          Control Center
        </button>
        <button
          onClick={openAppSwitcher}
          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium transition-colors"
        >
          App Switcher
        </button>
        <button
          onClick={() => onUpdateState((s) => ({ ...s, isSpotlightOpen: !s.isSpotlightOpen }))}
          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium transition-colors"
        >
          Spotlight Search
        </button>
      </div>
    </div>
  );
};
