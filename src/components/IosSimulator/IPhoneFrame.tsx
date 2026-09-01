import React, { useRef, useState } from 'react';
import {
  Wifi,
  Battery,
  Zap,
  Volume2,
  VolumeX,
  Radio,
  ChevronDown,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { SimulatorState, IosAppId } from '../../types';
import { DynamicIsland } from './DynamicIsland';
import { HomeScreen } from './HomeScreen';
import { ControlCenter } from './ControlCenter';
import { NotificationCenter } from './NotificationCenter';
import { SpotlightSearch } from './SpotlightSearch';
import { AppSwitcher } from './AppSwitcher';
import { SettingsApp } from './apps/SettingsApp';
import { MessagesApp } from './apps/MessagesApp';
import { CameraApp } from './apps/CameraApp';
import { PhoneApp } from './apps/PhoneApp';
import { SafariApp } from './apps/SafariApp';
import { PhotosApp } from './apps/PhotosApp';
import { AppStoreApp } from './apps/AppStoreApp';
import { CalculatorApp } from './apps/CalculatorApp';
import { ClockApp } from './apps/ClockApp';
import { WeatherApp } from './apps/UtilityApps';
import { FounderApp } from './apps/FounderApp';
import { WallpaperBackground } from './WallpaperBackground';
import { playLockSound, playUnlockSound, playVolumeStepSound, playCameraShutterSound } from '../../utils/audioUtils';

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
  const [swipeStartY, setSwipeStartY] = useState<number | null>(null);
  const [screenshotFlash, setScreenshotFlash] = useState(false);

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
    playVolumeStepSound();
    if (state.actionButtonMode === 'flashlight') {
      onUpdateState((s) => ({ ...s, isFlashlightOn: !s.isFlashlightOn }));
    } else if (state.actionButtonMode === 'silent') {
      onUpdateState((s) => ({ ...s, isSilentMode: !s.isSilentMode }));
    } else if (state.actionButtonMode === 'camera') {
      openApp('camera');
    } else if (state.actionButtonMode === 'focus') {
      onUpdateState((s) => ({ ...s, isDoNotDisturb: !s.isDoNotDisturb }));
    } else {
      onUpdateState((s) => ({ ...s, isFlashlightOn: !s.isFlashlightOn }));
    }
  };

  const handleVolumeUp = () => {
    playVolumeStepSound();
    if (state.currentApp === 'camera') {
      triggerScreenshot();
    } else {
      onUpdateState((s) => ({ ...s, volume: Math.min(100, s.volume + 10) }));
    }
  };

  const handleVolumeDown = () => {
    playVolumeStepSound();
    onUpdateState((s) => ({ ...s, volume: Math.max(0, s.volume - 10) }));
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
          title={`Action Button: ${state.actionButtonMode}`}
          className="absolute -left-1.5 top-28 w-1.5 h-7 bg-neutral-600 hover:bg-amber-400 active:scale-95 rounded-l-md transition-colors cursor-pointer"
        />

        {/* Hardware Volume Up (Left edge) */}
        <button
          onClick={handleVolumeUp}
          title="Volume Up / Camera Shutter"
          className="absolute -left-1.5 top-40 w-1.5 h-11 bg-neutral-600 hover:bg-neutral-400 active:scale-95 rounded-l-md transition-colors cursor-pointer"
        />

        {/* Hardware Volume Down (Left edge) */}
        <button
          onClick={handleVolumeDown}
          title="Volume Down"
          className="absolute -left-1.5 top-54 w-1.5 h-11 bg-neutral-600 hover:bg-neutral-400 active:scale-95 rounded-l-md transition-colors cursor-pointer"
        />

        {/* Hardware Side Power Button (Right edge) */}
        <button
          onClick={handlePowerButton}
          title={state.isLocked ? "Power Button (Wake / Unlock)" : "Power Button (Lock Screen)"}
          className="absolute -right-1.5 top-40 w-1.5 h-14 bg-neutral-600 hover:bg-neutral-400 active:scale-95 rounded-r-md transition-colors cursor-pointer"
        />

        {/* Screen Display Area */}
        <div className="relative w-full h-full bg-black rounded-[46px] overflow-hidden flex flex-col justify-between border border-black shadow-inner">
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
              <span>9:41</span>
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
              /* REALISTIC IOS LOCK SCREEN */
              <div
                onClick={() => {
                  playUnlockSound();
                  onUpdateState((s) => ({ ...s, isLocked: false }));
                }}
                className="h-full flex flex-col justify-between pt-14 pb-8 px-6 select-none text-white cursor-pointer relative overflow-hidden"
              >
                {/* Lockscreen Wallpaper */}
                <WallpaperBackground wallpaper={state.wallpaper} isDarkMode={state.isDarkMode} isLockScreen />
                {/* Lock icon & Time */}
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-sm opacity-80">🔒</span>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-90">Wednesday, August 27</p>
                  <h1 className="text-6xl font-light tracking-tighter">9:41</h1>
                </div>

                {/* Notification Banner on Lock Screen */}
                <div className="space-y-2">
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

                {/* Bottom Lock Screen Shortcuts (Flashlight & Camera) */}
                <div className="flex items-center justify-between pt-4">
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

                {state.currentApp === 'photos' && (
                  <PhotosApp
                    state={state}
                    onUpdateState={onUpdateState}
                    onClose={goHome}
                  />
                )}

                {state.currentApp === 'appstore' && (
                  <AppStoreApp state={state} />
                )}

                {state.currentApp === 'founder' && (
                  <FounderApp
                    state={state}
                    onUpdateState={onUpdateState}
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

      {/* Quick Interactive Gesture Action Buttons beneath Simulator */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 max-w-[340px]">
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
