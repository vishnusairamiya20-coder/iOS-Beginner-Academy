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
  Lock,
  Unlock,
  Key,
  Plus,
  Minus,
  Bell,
  BellOff,
  Power,
  Camera,
  SlidersHorizontal,
  FoldHorizontal,
  BookOpen,
  Laptop,
  Smartphone,
  ArrowRightLeft,
  Maximize2,
  Minimize2,
  Layers,
  X
} from 'lucide-react';
import { SimulatorState, IosAppId, UserPhotoItem } from '../../types';
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
import { WhatsAppApp } from './apps/WhatsAppApp';
import { PaytmApp } from './apps/PaytmApp';
import { AmazonApp } from './apps/AmazonApp';
import { GeminiApp } from './apps/GeminiApp';
import { BlinkitApp } from './apps/BlinkitApp';
import { WallpaperBackground } from './WallpaperBackground';
import { PowerMenuOverlay } from './PowerMenuOverlay';
import { BootScreen } from './BootScreen';
import { CameraControlOverlay } from './CameraControlOverlay';
import {
  playLockSound,
  playUnlockSound,
  playVolumeStepSound,
  playCameraShutterSound,
  playPowerDownSound,
  playCameraControlClick,
  playCameraControlLightPress,
  playCameraControlScrubTick,
  playFoldHingeSnapSound
} from '../../utils/audioUtils';
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
  const [isVolumeHudVisible, setIsVolumeHudVisible] = useState(false);
  const volumeHudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousVolumeRef = useRef<number>(state.volume || 70);

  // Power Off, Restart, and Booting states
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isHoldingPower, setIsHoldingPower] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  // Camera Control physical button interaction state
  const [isCameraControlInteracting, setIsCameraControlInteracting] = useState(false);
  const cameraControlDragStartYRef = useRef<number | null>(null);
  const cameraControlDragDistRef = useRef<number>(0);
  const cameraControlHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCameraControlLongPressedRef = useRef(false);

  const powerHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const powerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const didLongPressRef = useRef<boolean>(false);

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

  const handleLockScreenTap = () => {
    playUnlockSound();
    onUpdateState((s) => ({ ...s, isLocked: false }));
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

  const handleHomeBarClick = () => {
    if (state.isLocked) {
      playUnlockSound();
      onUpdateState((s) => ({ ...s, isLocked: false }));
    } else {
      goHome();
    }
  };

  const handleRightHomeBarClick = () => {
    onUpdateState((s) => ({ ...s, duoRightApp: null }));
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setSwipeStartY(clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (swipeStartY === null) return;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const diffY = clientY - swipeStartY;

    if (diffY < -30) {
      if (state.isLocked) {
        playUnlockSound();
        onUpdateState((s) => ({ ...s, isLocked: false }));
      } else {
        if (diffY < -100) {
          openAppSwitcher();
        } else {
          goHome();
        }
      }
    }
    setSwipeStartY(null);
  };

  const captureCameraPhoto = useCallback(() => {
    playCameraShutterSound();
    setScreenshotFlash(true);
    setTimeout(() => setScreenshotFlash(false), 250);

    const currentStyle = state.cameraControl?.photographicStyle || 'Standard';
    const zoomText = (state.cameraControl?.zoomValue || 1.0).toFixed(1);
    const newPhoto: UserPhotoItem = {
      id: Date.now().toString(),
      emoji: '📸',
      title: `Camera Control Snap (${currentStyle} • ${zoomText}x)`,
      date: 'Just now',
      isFavorite: false,
      isCameraRoll: true
    };

    onUpdateState((s) => ({
      ...s,
      userPhotos: [newPhoto, ...s.userPhotos]
    }));
  }, [state.cameraControl?.photographicStyle, state.cameraControl?.zoomValue, onUpdateState]);

  const handleCameraControlClick = useCallback(() => {
    playCameraControlClick();

    if (state.isScreenOff) {
      setIsBooting(false);
      onUpdateState((s) => ({
        ...s,
        isScreenOff: false,
        isLocked: false,
        currentApp: 'camera'
      }));
      return;
    }

    if (state.isLocked) {
      onUpdateState((s) => ({
        ...s,
        isLocked: false,
        currentApp: 'camera'
      }));
      return;
    }

    if (state.currentApp !== 'camera') {
      openApp('camera');
      return;
    }

    captureCameraPhoto();
  }, [state.isScreenOff, state.isLocked, state.currentApp, captureCameraPhoto, onUpdateState]);

  const handleCameraControlLightPress = useCallback(() => {
    playCameraControlLightPress();

    if (state.isScreenOff || state.isLocked || state.currentApp !== 'camera') {
      onUpdateState((s) => ({
        ...s,
        isScreenOff: false,
        isLocked: false,
        currentApp: 'camera',
        cameraControl: {
          ...s.cameraControl,
          isOpen: true
        }
      }));
      return;
    }

    onUpdateState((s) => {
      const cc = s.cameraControl || {
        isOpen: false,
        activeTool: 'zoom',
        zoomValue: 1.0,
        exposureValue: 0,
        depthValue: 2.8,
        activeCameraLens: '1x',
        photographicStyle: 'Standard',
        toneValue: 0
      };

      if (!cc.isOpen) {
        return {
          ...s,
          cameraControl: {
            ...cc,
            isOpen: true
          }
        };
      }

      const tools: Array<'zoom' | 'exposure' | 'depth' | 'cameras' | 'styles' | 'tone'> = [
        'zoom',
        'exposure',
        'depth',
        'cameras',
        'styles',
        'tone'
      ];
      const curIdx = tools.indexOf(cc.activeTool);
      const nextIdx = (curIdx + 1) % tools.length;
      return {
        ...s,
        cameraControl: {
          ...cc,
          activeTool: tools[nextIdx]
        }
      };
    });
  }, [state.isScreenOff, state.isLocked, state.currentApp, onUpdateState]);

  const handleCameraControlDoubleClick = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handleCameraControlLightPress();
  }, [handleCameraControlLightPress]);

  const handleCameraControlPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsCameraControlInteracting(true);
    cameraControlDragStartYRef.current = e.clientY;
    cameraControlDragDistRef.current = 0;
    isCameraControlLongPressedRef.current = false;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    cameraControlHoldTimerRef.current = setTimeout(() => {
      isCameraControlLongPressedRef.current = true;
      handleCameraControlLightPress();
    }, 450);
  };

  const handleCameraControlPointerMove = (e: React.PointerEvent) => {
    if (cameraControlDragStartYRef.current === null) return;
    const deltaY = cameraControlDragStartYRef.current - e.clientY;
    if (Math.abs(deltaY) < 3) return;

    if (cameraControlHoldTimerRef.current) {
      clearTimeout(cameraControlHoldTimerRef.current);
      cameraControlHoldTimerRef.current = null;
    }

    cameraControlDragDistRef.current += Math.abs(deltaY);
    cameraControlDragStartYRef.current = e.clientY;
    playCameraControlScrubTick();

    const factor = deltaY > 0 ? 1 : -1;

    onUpdateState((s) => {
      const cc = {
        ...(s.cameraControl || {
          isOpen: false,
          activeTool: 'zoom',
          zoomValue: 1.0,
          exposureValue: 0,
          depthValue: 2.8,
          activeCameraLens: '1x',
          photographicStyle: 'Standard',
          toneValue: 0
        }),
        isOpen: true
      };

      if (cc.activeTool === 'zoom') {
        const next = Math.round((cc.zoomValue + factor * 0.1) * 10) / 10;
        cc.zoomValue = Math.max(0.5, Math.min(5.0, next));
      } else if (cc.activeTool === 'exposure') {
        const next = Math.round((cc.exposureValue + factor * 0.1) * 10) / 10;
        cc.exposureValue = Math.max(-2.0, Math.min(2.0, next));
      } else if (cc.activeTool === 'depth') {
        const apertures = [1.4, 1.8, 2.0, 2.8, 3.5, 4.0, 5.6, 8.0, 11.0, 16.0];
        const curIdx = apertures.findIndex((a) => a === cc.depthValue);
        const validIdx = curIdx >= 0 ? curIdx : 3;
        const nextIdx = Math.max(0, Math.min(apertures.length - 1, validIdx + factor));
        cc.depthValue = apertures[nextIdx];
      } else if (cc.activeTool === 'cameras') {
        const lenses: Array<'0.5x' | '1x' | '2x' | '5x'> = ['0.5x', '1x', '2x', '5x'];
        const curIdx = lenses.indexOf(cc.activeCameraLens);
        const validIdx = curIdx >= 0 ? curIdx : 1;
        const nextIdx = Math.max(0, Math.min(lenses.length - 1, validIdx + factor));
        cc.activeCameraLens = lenses[nextIdx];
        cc.zoomValue = parseFloat(lenses[nextIdx].replace('x', ''));
      } else if (cc.activeTool === 'styles') {
        const styles: Array<'Standard' | 'Vibrant' | 'Warm' | 'Cool' | 'Dramatic'> = [
          'Standard',
          'Vibrant',
          'Warm',
          'Cool',
          'Dramatic'
        ];
        const curIdx = styles.indexOf(cc.photographicStyle);
        const validIdx = curIdx >= 0 ? curIdx : 0;
        const nextIdx = (validIdx + factor + styles.length) % styles.length;
        cc.photographicStyle = styles[nextIdx];
      } else if (cc.activeTool === 'tone') {
        const next = cc.toneValue + factor * 5;
        cc.toneValue = Math.max(-100, Math.min(100, next));
      }

      return {
        ...s,
        isScreenOff: false,
        isLocked: false,
        currentApp: 'camera',
        cameraControl: cc
      };
    });
  };

  const handleCameraControlPointerUp = (e: React.PointerEvent) => {
    setIsCameraControlInteracting(false);
    if (cameraControlHoldTimerRef.current) {
      clearTimeout(cameraControlHoldTimerRef.current);
      cameraControlHoldTimerRef.current = null;
    }

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (
      cameraControlDragStartYRef.current !== null &&
      cameraControlDragDistRef.current < 6 &&
      !isCameraControlLongPressedRef.current
    ) {
      handleCameraControlClick();
    }

    cameraControlDragStartYRef.current = null;
    cameraControlDragDistRef.current = 0;
    isCameraControlLongPressedRef.current = false;
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

  const handlePowerButton = useCallback(() => {
    if (state.isLocked) {
      playUnlockSound();
      onUpdateState((s) => ({ ...s, isLocked: false }));
    } else {
      playLockSound();
      onUpdateState((s) => ({ ...s, isLocked: true }));
    }
  }, [state.isLocked, onUpdateState]);

  const handleTurnOn = useCallback(() => {
    setIsBooting(true);
    setIsRestarting(false);
  }, []);

  const handlePowerOff = useCallback(() => {
    setIsPowerMenuOpen(false);
    playPowerDownSound();
    onUpdateState((s) => ({
      ...s,
      isScreenOff: true,
      isLocked: true,
      isControlCenterOpen: false,
      isNotificationCenterOpen: false,
      isSpotlightOpen: false,
      isAppSwitcherOpen: false,
      isSiriOpen: false,
    }));
  }, [onUpdateState]);

  const handleRestart = useCallback(() => {
    setIsPowerMenuOpen(false);
    playPowerDownSound();
    onUpdateState((s) => ({
      ...s,
      isScreenOff: true,
      isLocked: true,
      isControlCenterOpen: false,
      isNotificationCenterOpen: false,
      isSpotlightOpen: false,
      isAppSwitcherOpen: false,
      isSiriOpen: false,
    }));
    setTimeout(() => {
      setIsRestarting(true);
      setIsBooting(true);
    }, 450);
  }, [onUpdateState]);

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
    setIsRestarting(false);
    onUpdateState((s) => ({
      ...s,
      isScreenOff: false,
      isLocked: true,
      currentApp: 'home',
    }));
  }, [onUpdateState]);

  const startPowerHold = useCallback((e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    didLongPressRef.current = false;
    setIsHoldingPower(true);
    setHoldProgress(0);

    if (powerHoldTimerRef.current) clearTimeout(powerHoldTimerRef.current);
    if (powerIntervalRef.current) clearInterval(powerIntervalRef.current);

    if (state.isScreenOff) {
      powerHoldTimerRef.current = setTimeout(() => {
        didLongPressRef.current = true;
        setIsHoldingPower(false);
        setHoldProgress(0);
        handleTurnOn();
      }, 400);
      return;
    }

    const startTime = Date.now();
    const duration = 650;

    powerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setHoldProgress(Math.min(100, Math.floor((elapsed / duration) * 100)));
    }, 25);

    powerHoldTimerRef.current = setTimeout(() => {
      didLongPressRef.current = true;
      setIsHoldingPower(false);
      setHoldProgress(0);
      if (powerIntervalRef.current) clearInterval(powerIntervalRef.current);
      playCameraControlClick();
      setIsPowerMenuOpen(true);
    }, duration);
  }, [state.isScreenOff, handleTurnOn]);

  const endPowerHold = useCallback((e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    setIsHoldingPower(false);
    setHoldProgress(0);
    if (powerHoldTimerRef.current) {
      clearTimeout(powerHoldTimerRef.current);
      powerHoldTimerRef.current = null;
    }
    if (powerIntervalRef.current) {
      clearInterval(powerIntervalRef.current);
      powerIntervalRef.current = null;
    }

    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }

    if (state.isScreenOff) {
      handleTurnOn();
    } else {
      handlePowerButton();
    }
  }, [state.isScreenOff, handleTurnOn, handlePowerButton]);

  const cancelPowerHold = useCallback(() => {
    setIsHoldingPower(false);
    setHoldProgress(0);
    if (powerHoldTimerRef.current) {
      clearTimeout(powerHoldTimerRef.current);
      powerHoldTimerRef.current = null;
    }
    if (powerIntervalRef.current) {
      clearInterval(powerIntervalRef.current);
      powerIntervalRef.current = null;
    }
    didLongPressRef.current = false;
  }, []);

  // Foldable mode toggles
  const setFoldMode = (mode: 'folded' | 'flex' | 'unfolded') => {
    playFoldHingeSnapSound();
    if (mode === 'folded') {
      onUpdateState((s) => ({ ...s, isFolded: true, foldAngle: 0 }));
    } else if (mode === 'flex') {
      onUpdateState((s) => ({ ...s, isFolded: false, foldAngle: 115 }));
    } else {
      onUpdateState((s) => ({ ...s, isFolded: false, foldAngle: 180 }));
    }
  };

  const swapScreens = () => {
    playFoldHingeSnapSound();
    onUpdateState((s) => {
      const leftApp = s.currentApp;
      const rightApp = s.duoRightApp || 'home';
      return {
        ...s,
        currentApp: rightApp,
        duoRightApp: leftApp === 'home' ? null : leftApp
      };
    });
  };

  const toggleSpanFull = () => {
    playFoldHingeSnapSound();
    onUpdateState((s) => ({ ...s, duoSpanFull: !s.duoSpanFull }));
  };

  // Central App Renderer for both screens
  const renderAppContent = (appId: IosAppId, isRightScreen = false) => {
    if (appId === 'home') {
      return (
        <HomeScreen
          state={state}
          onOpenApp={(targetApp) => {
            if (!state.isFolded && isRightScreen) {
              onUpdateState((s) => ({ ...s, duoRightApp: targetApp }));
            } else {
              openApp(targetApp);
            }
          }}
          onTriggerGesture={onTriggerGesture}
          onUpdateState={onUpdateState}
          pageOverride={!state.isFolded ? (isRightScreen ? 1 : 0) : undefined}
        />
      );
    }
    if (appId === 'phone') return <PhoneApp state={state} onUpdateState={onUpdateState} />;
    if (appId === 'settings') return <SettingsApp state={state} onUpdateState={onUpdateState} onClose={isRightScreen ? handleRightHomeBarClick : goHome} />;
    if (appId === 'messages') return <MessagesApp state={state} onUpdateState={onUpdateState} onClose={isRightScreen ? handleRightHomeBarClick : goHome} />;
    if (appId === 'camera') return <CameraApp state={state} onUpdateState={onUpdateState} onClose={isRightScreen ? handleRightHomeBarClick : goHome} />;
    if (appId === 'calculator') return <CalculatorApp state={state} />;
    if (appId === 'clock') return <ClockApp state={state} onUpdateState={onUpdateState} />;
    if (appId === 'weather') return <WeatherApp state={state} />;
    if (appId === 'safari') return <SafariApp state={state} onOpenApp={openApp} />;
    if (appId === 'chrome') return <ChromeApp state={state} onUpdateState={onUpdateState} onOpenApp={openApp} onClose={isRightScreen ? handleRightHomeBarClick : goHome} />;
    if (appId === 'photos') return <PhotosApp state={state} onUpdateState={onUpdateState} onClose={isRightScreen ? handleRightHomeBarClick : goHome} />;
    if (appId === 'appstore') return <AppStoreApp state={state} onOpenApp={openApp} onUpdateState={onUpdateState} />;
    if (appId === 'pinterest') return <PinterestApp state={state} onUpdateState={onUpdateState} onClose={isRightScreen ? handleRightHomeBarClick : goHome} />;
    if (appId === 'founder') return <FounderApp state={state} onUpdateState={onUpdateState} onClose={isRightScreen ? handleRightHomeBarClick : goHome} />;
    if (appId === 'music') return <MusicApp state={state} onUpdateState={onUpdateState} onOpenApp={openApp} />;
    if (appId === 'youtube') return <YouTubeApp state={state} onUpdateState={onUpdateState} onOpenApp={openApp} onClose={isRightScreen ? handleRightHomeBarClick : goHome} />;
    if (appId === 'whatsapp') return <WhatsAppApp state={state} onUpdateState={onUpdateState} onOpenApp={openApp} onClose={isRightScreen ? handleRightHomeBarClick : goHome} />;
    if (appId === 'paytm') return <PaytmApp state={state} onUpdateState={onUpdateState} onOpenApp={openApp} onClose={isRightScreen ? handleRightHomeBarClick : goHome} />;
    if (appId === 'amazon') return <AmazonApp state={state} onUpdateState={onUpdateState} onOpenApp={openApp} onClose={isRightScreen ? handleRightHomeBarClick : goHome} />;
    if (appId === 'gemini') return <GeminiApp state={state} onUpdateState={onUpdateState} onOpenApp={openApp} onClose={isRightScreen ? handleRightHomeBarClick : goHome} />;
    if (appId === 'blinkit') return <BlinkitApp state={state} onUpdateState={onUpdateState} onOpenApp={openApp} onClose={isRightScreen ? handleRightHomeBarClick : goHome} />;
    return null;
  };

  const isFolded = state.isFolded || state.foldAngle === 0;
  const isFlexMode = !isFolded && state.foldAngle === 115;

  return (
    <div className="relative flex flex-col items-center justify-center p-2 select-none">
      {/* Flashlight physical glow simulation */}
      {state.isFlashlightOn && (
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-200/40 blur-3xl rounded-full pointer-events-none z-0 animate-pulse" />
      )}

      {/* Screenshot Flash animation */}
      {screenshotFlash && (
        <div className="absolute inset-0 bg-white z-50 rounded-[55px] animate-ping pointer-events-none" />
      )}

      {/* Top Foldable Duo Mode Switcher HUD */}
      <div className="mb-3 flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 shadow-lg backdrop-blur-md text-xs z-30">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFoldMode('folded')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isFolded
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title="Fold phone into single Cover Screen mode"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Cover (Folded)</span>
          </button>

          <button
            onClick={() => setFoldMode('flex')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isFlexMode
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title="Fold into Flex Mode (115° Book Angle with 3D perspective)"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Flex Mode (115°)</span>
          </button>

          <button
            onClick={() => setFoldMode('unfolded')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              !isFolded && !isFlexMode
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title="Unfold to full 180° dual screen canvas"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Duo Flat (180°)</span>
          </button>
        </div>

        {!isFolded && (
          <div className="flex items-center gap-1 pl-2 border-l border-neutral-800">
            <button
              onClick={swapScreens}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Swap Left and Right displays"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleSpanFull}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                state.duoSpanFull
                  ? 'bg-blue-500 text-white'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white'
              }`}
              title={state.duoSpanFull ? 'Split into Dual Displays' : 'Span app across both displays'}
            >
              {state.duoSpanFull ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. FOLDED MODE: Single Compact Cover Screen (with Titanium Spine Accent) */}
      {/* ========================================================================= */}
      {isFolded ? (
        <div className="relative w-[340px] h-[680px] bg-neutral-900 rounded-[55px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_0_3px_#404040,inset_0_0_0_5px_#171717] z-10 flex flex-col">
          {/* Folded Hinge Spine Accent on Left Outer Rail */}
          <div
            onClick={() => setFoldMode('unfolded')}
            title="Titanium Fluid Hinge - Click to Unfold into iPhone Duo Dual Screen!"
            className="group absolute -left-3.5 top-12 bottom-12 w-3 rounded-l-lg bg-gradient-to-r from-neutral-600 via-neutral-400 to-neutral-700 border-l border-y border-white/30 shadow-xl cursor-pointer flex flex-col items-center justify-center hover:brightness-125 transition-all"
          >
            <div className="h-8 w-1 bg-white/40 rounded-full mb-auto mt-2" />
            <span className="text-[7px] font-black uppercase tracking-widest text-white/70 -rotate-90 whitespace-nowrap select-none">
              DUO HINGE
            </span>
            <div className="h-8 w-1 bg-white/40 rounded-full mt-auto mb-2" />
          </div>

          {/* Hardware Action Button */}
          <button
            onClick={handleActionButtonPress}
            title={`Action Button (${state.actionButtonMode})`}
            className="group absolute -left-2 top-28 w-2.5 h-8 bg-neutral-700 hover:bg-amber-500 active:scale-95 active:bg-amber-600 rounded-l-md transition-all cursor-pointer shadow-md flex items-center justify-start pl-0.5"
          >
            <span className="w-1 h-3 rounded-full bg-neutral-400 group-hover:bg-white" />
          </button>

          {/* Volume Up */}
          <button
            onClick={handleVolumeUp}
            title="Volume Up (+) / Camera Shutter"
            className="group absolute -left-2 top-40 w-2.5 h-12 bg-neutral-700 hover:bg-blue-500 active:scale-95 active:bg-blue-600 rounded-l-md transition-all cursor-pointer shadow-md flex items-center justify-start pl-0.5"
          >
            <span className="w-1 h-4 rounded-full bg-neutral-400 group-hover:bg-white" />
          </button>

          {/* Volume Down */}
          <button
            onClick={handleVolumeDown}
            title="Volume Down (-)"
            className="group absolute -left-2 top-56 w-2.5 h-12 bg-neutral-700 hover:bg-blue-500 active:scale-95 active:bg-blue-600 rounded-l-md transition-all cursor-pointer shadow-md flex items-center justify-start pl-0.5"
          >
            <span className="w-1 h-4 rounded-full bg-neutral-400 group-hover:bg-white" />
          </button>

          {/* Side Power Button */}
          <button
            id="hardware-power-button"
            onPointerDown={startPowerHold}
            onPointerUp={endPowerHold}
            onPointerLeave={cancelPowerHold}
            className={`group absolute -right-2 top-40 w-2.5 h-16 rounded-r-md transition-all cursor-pointer shadow-md flex items-center justify-end pr-0.5 ${
              isHoldingPower
                ? 'bg-rose-500 ring-2 ring-rose-400 scale-105 shadow-[0_0_15px_rgba(244,63,94,0.8)]'
                : 'bg-neutral-700 hover:bg-neutral-500 active:scale-95'
            }`}
          >
            <span className={`w-1 rounded-full ${isHoldingPower ? 'h-10 bg-white' : 'h-6 bg-neutral-400 group-hover:bg-white'}`} />
          </button>

          {/* Camera Control Key */}
          <div className="absolute -right-3 top-[420px] z-30 flex items-center">
            <button
              id="hardware-camera-control-button"
              onPointerDown={handleCameraControlPointerDown}
              onPointerMove={handleCameraControlPointerMove}
              onPointerUp={handleCameraControlPointerUp}
              onPointerCancel={handleCameraControlPointerUp}
              onDoubleClick={handleCameraControlDoubleClick}
              className={`w-3.5 h-16 rounded-r-lg transition-all cursor-pointer shadow-lg flex flex-col items-center justify-center gap-1 border-y border-r border-white/20 select-none ${
                isCameraControlInteracting
                  ? 'bg-amber-400 ring-2 ring-amber-300 scale-105 shadow-[0_0_18px_rgba(251,191,36,0.9)]'
                  : 'bg-neutral-800 hover:bg-neutral-700'
              }`}
            >
              <span className={`w-1 rounded-full ${isCameraControlInteracting ? 'h-10 bg-white' : 'h-8 bg-neutral-400'}`} />
            </button>
          </div>

          {/* Inner Screen Chassis */}
          <div className="relative w-full h-full bg-black rounded-[46px] overflow-hidden flex flex-col border border-neutral-800/80 shadow-inner">
            {/* Screen Off / Blackout */}
            {state.isScreenOff && !isBooting && (
              <div
                onClick={handleTurnOn}
                className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center cursor-pointer text-white/40"
              >
                <Power className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-[11px] font-medium">Phone is Powered Off</span>
                <span className="text-[9px] opacity-60 mt-1">Tap screen or hold Power to turn on</span>
              </div>
            )}

            {/* Apple Boot Screen */}
            {isBooting && <BootScreen isRestarting={isRestarting} onBootComplete={handleBootComplete} />}

            {/* Power Menu Overlay */}
            <PowerMenuOverlay
              isOpen={isPowerMenuOpen}
              onPowerOff={handlePowerOff}
              onRestart={handleRestart}
              onCancel={() => setIsPowerMenuOpen(false)}
            />

            {/* Camera Control Overlay */}
            {state.cameraControl?.isOpen && !state.isScreenOff && (
              <CameraControlOverlay
                state={state}
                onUpdateState={onUpdateState}
                onClose={() =>
                  onUpdateState((s) => ({
                    ...s,
                    cameraControl: { ...s.cameraControl, isOpen: false }
                  }))
                }
                onCapturePhoto={captureCameraPhoto}
              />
            )}

            {/* Volume HUD */}
            <VolumeHUD volume={state.volume} isVisible={isVolumeHudVisible} onVolumeChange={showVolumeHUD} />

            {/* Dynamic Island */}
            <DynamicIsland state={state} onUpdateState={onUpdateState} onOpenApp={openApp} />

            {/* Top Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-11 px-6 pt-3 flex items-center justify-between text-white text-[12px] font-semibold z-40 select-none">
              <div
                onClick={() => onUpdateState((s) => ({ ...s, isNotificationCenterOpen: true }))}
                className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1"
              >
                <span>{liveClock.timeString}</span>
                {state.isDoNotDisturb && <span className="text-[10px]">🌙</span>}
              </div>
              <div
                onClick={() => onUpdateState((s) => ({ ...s, isControlCenterOpen: true }))}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Radio className="w-3.5 h-3.5 text-white" />
                <span className="text-[10px] font-bold">5G</span>
                {state.isWifiOn && <Wifi className="w-3.5 h-3.5 text-white" />}
                <div className="w-5 h-2.5 rounded-xs border border-white/80 p-0.5 flex items-center">
                  <div
                    className={`h-full rounded-xs transition-all ${
                      state.batteryLevel < 20 ? 'bg-red-500' : 'bg-white'
                    }`}
                    style={{ width: `${state.batteryLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Active Cover Screen Content */}
            <div className="flex-1 relative overflow-hidden">
              {state.isLocked ? (
                <div
                  onClick={handleLockScreenTap}
                  className="h-full flex flex-col justify-between pt-14 pb-8 px-6 select-none text-white cursor-pointer relative overflow-hidden"
                >
                  <WallpaperBackground wallpaper={state.wallpaper} isDarkMode={state.isDarkMode} isLockScreen />
                  <div className="flex flex-col items-center space-y-1 relative z-10">
                    <div className="h-10 flex items-center justify-center">
                      <Lock className="w-4 h-4 opacity-80" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-90">{liveClock.fullDateString}</p>
                    <h1 className="text-6xl font-light tracking-tighter">{liveClock.timeString}</h1>
                  </div>
                  <div className="space-y-2 relative z-10">
                    <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 text-xs shadow-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-indigo-400 flex items-center gap-1">
                          <span>📱</span> iPhone Duo Fold
                        </span>
                        <span className="text-[10px] opacity-70">Cover Screen</span>
                      </div>
                      <p className="font-medium text-white leading-tight">Tap Unfold above to expand dual displays!</p>
                    </div>
                  </div>
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
                    <span className="text-[11px] font-medium opacity-80 animate-pulse">Swipe up to open</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateState((s) => ({ ...s, isLocked: false, currentApp: 'camera' }));
                      }}
                      className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center"
                    >
                      📷
                    </button>
                  </div>
                </div>
              ) : (
                renderAppContent(state.currentApp)
              )}

              {/* Overlays */}
              {state.isControlCenterOpen && (
                <ControlCenter
                  state={state}
                  onUpdateState={onUpdateState}
                  onClose={() => onUpdateState((s) => ({ ...s, isControlCenterOpen: false }))}
                  onTriggerGesture={onTriggerGesture}
                  onOpenPowerMenu={() => setIsPowerMenuOpen(true)}
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

            {/* Bottom Home Indicator Bar */}
            <div
              onMouseDown={handleTouchStart}
              onMouseUp={handleTouchEnd}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={handleHomeBarClick}
              title="Swipe up or Click to Return Home"
              className="h-7 w-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity z-40 bg-transparent"
            >
              <div className="w-32 h-1 bg-white/75 rounded-full shadow-md" />
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. UNFOLDED MODE: iPhone Duo Dual-Display Foldable Canvas                 */
        /* ========================================================================= */
        <div
          className="relative flex items-center justify-center transition-all duration-500 ease-out z-10"
          style={{
            perspective: isFlexMode ? '1200px' : 'none'
          }}
        >
          {/* Main Unfolded Chassis Container (Left Display + Central Titanium Hinge + Right Display) */}
          <div className="relative flex items-center p-2.5 bg-neutral-950 rounded-[56px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_0_2px_#333]">
            {/* Action button on outer left edge */}
            <button
              onClick={handleActionButtonPress}
              title={`Action Button (${state.actionButtonMode})`}
              className="group absolute -left-2 top-28 w-2.5 h-8 bg-neutral-700 hover:bg-amber-500 rounded-l-md transition-all cursor-pointer shadow-md flex items-center justify-start pl-0.5"
            >
              <span className="w-1 h-3 rounded-full bg-neutral-400 group-hover:bg-white" />
            </button>

            {/* Volume Up on outer left edge */}
            <button
              onClick={handleVolumeUp}
              title="Volume Up (+) / Camera Shutter"
              className="group absolute -left-2 top-40 w-2.5 h-12 bg-neutral-700 hover:bg-blue-500 rounded-l-md transition-all cursor-pointer shadow-md flex items-center justify-start pl-0.5"
            >
              <span className="w-1 h-4 rounded-full bg-neutral-400 group-hover:bg-white" />
            </button>

            {/* Volume Down on outer left edge */}
            <button
              onClick={handleVolumeDown}
              title="Volume Down (-)"
              className="group absolute -left-2 top-56 w-2.5 h-12 bg-neutral-700 hover:bg-blue-500 rounded-l-md transition-all cursor-pointer shadow-md flex items-center justify-start pl-0.5"
            >
              <span className="w-1 h-4 rounded-full bg-neutral-400 group-hover:bg-white" />
            </button>

            {/* Power Button on outer right edge */}
            <button
              id="hardware-power-button-duo"
              onPointerDown={startPowerHold}
              onPointerUp={endPowerHold}
              onPointerLeave={cancelPowerHold}
              className={`group absolute -right-2 top-40 w-2.5 h-16 rounded-r-md transition-all cursor-pointer shadow-md flex items-center justify-end pr-0.5 ${
                isHoldingPower ? 'bg-rose-500 ring-2 ring-rose-400' : 'bg-neutral-700 hover:bg-neutral-500'
              }`}
            >
              <span className="w-1 h-6 rounded-full bg-neutral-400 group-hover:bg-white" />
            </button>

            {/* Camera Control button on outer right edge */}
            <div className="absolute -right-3 top-[420px] z-30 flex items-center">
              <button
                id="hardware-camera-control-duo"
                onClick={handleCameraControlClick}
                onDoubleClick={handleCameraControlDoubleClick}
                className="w-3.5 h-16 rounded-r-lg bg-neutral-800 hover:bg-neutral-700 transition-all cursor-pointer shadow-lg flex items-center justify-center border-y border-r border-white/20"
              >
                <span className="w-1 h-8 rounded-full bg-neutral-400" />
              </button>
            </div>

            {/* ---------------------------------------------------- */}
            {/* LEFT DISPLAY PANEL (Primary Display / Home Page 1) */}
            {/* ---------------------------------------------------- */}
            <div
              className={`relative w-[320px] h-[660px] bg-black rounded-l-[44px] rounded-r-[18px] overflow-hidden flex flex-col border-y border-l border-neutral-800 transition-all duration-500 shadow-2xl ${
                isFlexMode ? 'origin-right [transform:rotateY(14deg)]' : ''
              }`}
            >
              {/* Dynamic Island */}
              <DynamicIsland state={state} onUpdateState={onUpdateState} onOpenApp={openApp} />

              {/* Left Top Status Bar */}
              <div className="absolute top-0 left-0 right-0 h-11 px-5 pt-3 flex items-center justify-between text-white text-[12px] font-semibold z-40 select-none">
                <div
                  onClick={() => onUpdateState((s) => ({ ...s, isNotificationCenterOpen: true }))}
                  className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1"
                >
                  <span>{liveClock.timeString}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/20 font-bold ml-1">
                    LEFT
                  </span>
                </div>
                <div className="text-[10px] text-white/70 font-mono">
                  {state.currentApp === 'home' ? 'Page 1: Essentials' : state.currentApp.toUpperCase()}
                </div>
              </div>

              {/* Left Screen Content */}
              <div className="flex-1 relative overflow-hidden">
                {renderAppContent(state.currentApp, false)}

                {/* Overlays on left screen */}
                {state.isControlCenterOpen && (
                  <ControlCenter
                    state={state}
                    onUpdateState={onUpdateState}
                    onClose={() => onUpdateState((s) => ({ ...s, isControlCenterOpen: false }))}
                    onTriggerGesture={onTriggerGesture}
                    onOpenPowerMenu={() => setIsPowerMenuOpen(true)}
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

              {/* Left Home Bar */}
              <div
                onClick={handleHomeBarClick}
                title="Return Left Screen to Home Page 1"
                className="h-7 w-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity z-40 bg-transparent"
              >
                <div className="w-28 h-1 bg-white/75 rounded-full shadow-md" />
              </div>

              {/* Flex mode shadow vignette on fold crease */}
              {isFlexMode && (
                <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-black/60 to-transparent pointer-events-none z-30" />
              )}
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* CENTRAL AEROSPACE TITANIUM HINGE SPINE (Liquidmetal Multi-Stop)  */}
            {/* ----------------------------------------------------------------- */}
            <div
              onClick={() => setFoldMode(isFlexMode ? 'unfolded' : 'flex')}
              title={`Titanium Liquidmetal Hinge (${state.foldAngle}°)\nClick to toggle Flex/Flat angle!`}
              className="relative w-[22px] h-[660px] mx-0.5 rounded-sm bg-gradient-to-r from-neutral-800 via-neutral-400 to-neutral-800 border-x border-neutral-700/60 shadow-2xl cursor-pointer flex flex-col items-center justify-between py-4 group select-none hover:brightness-110 transition-all z-20"
            >
              {/* Top precision knuckle pivot */}
              <div className="w-3.5 h-6 rounded-full bg-neutral-900 border border-white/30 flex flex-col items-center justify-center shadow-inner">
                <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
              </div>

              {/* Hinge Axis Specular Reflection Highlight */}
              <div className="absolute inset-y-12 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-transparent via-white/70 to-transparent opacity-80" />

              {/* Laser-etched vertical spine branding */}
              <span className="text-[7.5px] font-black uppercase tracking-widest text-neutral-800 -rotate-90 whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                IPHONE DUO • TITANIUM HINGE • {state.foldAngle}°
              </span>

              {/* Bottom precision knuckle pivot */}
              <div className="w-3.5 h-6 rounded-full bg-neutral-900 border border-white/30 flex flex-col items-center justify-center shadow-inner">
                <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* RIGHT DISPLAY PANEL (Secondary Display / Home Page 2 / Split App) */}
            {/* ----------------------------------------------------------------- */}
            <div
              className={`relative w-[320px] h-[660px] bg-black rounded-r-[44px] rounded-l-[18px] overflow-hidden flex flex-col border-y border-r border-neutral-800 transition-all duration-500 shadow-2xl ${
                isFlexMode ? 'origin-left [transform:rotateY(-14deg)]' : ''
              }`}
            >
              {/* Right Top Status Bar with Wi-Fi, 5G & Battery */}
              <div className="absolute top-0 left-0 right-0 h-11 px-5 pt-3 flex items-center justify-between text-white text-[12px] font-semibold z-40 select-none">
                <div className="text-[10px] text-white/70 font-mono">
                  {state.duoRightApp ? state.duoRightApp.toUpperCase() : 'Page 2: Utilities'}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 font-bold border border-blue-400/30">
                    RIGHT
                  </span>
                  <span className="text-[10px] font-bold">5G</span>
                  {state.isWifiOn && <Wifi className="w-3.5 h-3.5 text-white" />}
                  <div className="w-5 h-2.5 rounded-xs border border-white/80 p-0.5 flex items-center">
                    <div
                      className={`h-full rounded-xs transition-all ${
                        state.batteryLevel < 20 ? 'bg-red-500' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${state.batteryLevel}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Multitasking Action Banner when app is open on right screen */}
              {state.duoRightApp && (
                <div className="absolute top-11 left-3 right-3 z-30 flex items-center justify-between px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-white text-[10px] animate-fade-in shadow-md">
                  <span className="font-semibold text-blue-300 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>Split App Active</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={swapScreens}
                      className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                      title="Swap Left and Right apps"
                    >
                      Swap
                    </button>
                    <button
                      onClick={() => onUpdateState((s) => ({ ...s, duoRightApp: null }))}
                      className="px-2 py-0.5 rounded-md bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 font-semibold flex items-center gap-0.5 transition-colors"
                      title="Close app back to Home Page 2"
                    >
                      <X className="w-3 h-3" />
                      <span>Close to Page 2</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Right Screen Content: Renders either the Right Split App or Home Page 2 */}
              <div className="flex-1 relative overflow-hidden">
                {state.duoRightApp
                  ? renderAppContent(state.duoRightApp, true)
                  : renderAppContent('home', true)}
              </div>

              {/* Right Home Bar (Swipe/Click to Return Right Screen to Home Page 2) */}
              <div
                onClick={handleRightHomeBarClick}
                title="Return Right Screen to Home Page 2"
                className="h-7 w-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity z-40 bg-transparent"
              >
                <div className="w-28 h-1 bg-white/75 rounded-full shadow-md" />
              </div>

              {/* Flex mode crease shadow on left edge of right panel */}
              {isFlexMode && (
                <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-black/60 to-transparent pointer-events-none z-30" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Physical Hardware Controls Toolbar */}
      <div className="mt-3 w-full max-w-[360px] p-2.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-md backdrop-blur-md flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-300">
            <FoldHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>iPhone Duo Controls</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">
            {isFolded ? 'Folded (0°)' : `${state.foldAngle}° Dual-Screen`}
          </span>
        </div>

        {/* Volume & Fold Button Cluster */}
        <div className="grid grid-cols-6 gap-1">
          {/* Fold / Unfold Toggle Button */}
          <button
            onClick={() => setFoldMode(isFolded ? 'unfolded' : 'folded')}
            title="Fold or Unfold the iPhone Duo"
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl active:scale-95 text-[10px] font-medium transition-all cursor-pointer ${
              !isFolded
                ? 'bg-indigo-950/90 border border-indigo-500/60 text-indigo-200'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
            }`}
          >
            <FoldHorizontal className="w-3.5 h-3.5 mb-0.5 text-indigo-400" />
            <span>{isFolded ? 'Unfold' : 'Fold'}</span>
          </button>

          {/* Siri Button */}
          <button
            onClick={() => onUpdateState((s) => ({ ...s, isSiriOpen: true }))}
            title="Launch Siri with Apple Intelligence"
            className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-gradient-to-b from-indigo-950/80 to-purple-950/80 border border-purple-500/40 hover:border-purple-400 active:scale-95 text-purple-300 text-[10px] font-medium transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 mb-0.5 text-purple-300 animate-pulse" />
            <span>Siri</span>
          </button>

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

          {/* Volume Up */}
          <button
            onClick={handleVolumeUp}
            title="Volume Up (+ key) / Shutter"
            className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 text-[10px] font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5 mb-0.5 text-blue-400" />
            <span>Vol +</span>
          </button>

          {/* Power Button */}
          <button
            id="toolbar-power-button-duo"
            onPointerDown={startPowerHold}
            onPointerUp={endPowerHold}
            onPointerLeave={cancelPowerHold}
            title={
              state.isScreenOff
                ? "Power Button: Click or hold to Turn On"
                : "Side Power Button: Click to Lock/Wake, Long Press to Switch Off or Restart"
            }
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl active:scale-95 text-[10px] font-medium transition-all relative ${
              isHoldingPower
                ? 'bg-rose-900/90 border border-rose-500 text-white ring-2 ring-rose-500/50'
                : state.isLocked
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
      <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 max-w-[360px]">
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
        <button
          id="quick-camera-control-button"
          onClick={handleCameraControlLightPress}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 border ${
            state.cameraControl?.isOpen
              ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-sm'
              : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-200'
          }`}
          title="Toggle Camera Control Tools"
        >
          <SlidersHorizontal className="w-3 h-3 text-amber-400" />
          <span>Camera Control</span>
        </button>
      </div>
    </div>
  );
};
