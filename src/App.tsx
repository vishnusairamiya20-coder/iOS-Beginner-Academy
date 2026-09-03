/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Smartphone,
  Trophy,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  Lightbulb
} from 'lucide-react';
import { SimulatorState, Mission, GestureType, IosAppId } from './types';
import { INITIAL_MISSIONS } from './data/missions';
import { IPhoneFrame } from './components/IosSimulator/IPhoneFrame';
import { Header } from './components/InteractiveGuide/Header';
import { LessonViewer } from './components/InteractiveGuide/LessonViewer';
import { MissionsPanel } from './components/InteractiveGuide/MissionsPanel';
import { GlossaryModal } from './components/InteractiveGuide/GlossaryModal';
import { Troubleshooter } from './components/InteractiveGuide/Troubleshooter';
import { QuizModal } from './components/InteractiveGuide/QuizModal';
import { AndroidInstallModal } from './components/InteractiveGuide/AndroidInstallModal';

const DEFAULT_SIMULATOR_STATE: SimulatorState = {
  currentApp: 'home',
  isControlCenterOpen: false,
  isNotificationCenterOpen: false,
  isSpotlightOpen: false,
  isAppSwitcherOpen: false,
  isAppLibraryOpen: false,
  isJiggleMode: false,
  activeScreenPage: 0,
  
  isLocked: false,
  isScreenOff: false,
  faceId: {
    isEnrolled: false,
    enrollmentDate: '',
    useForIphoneUnlock: false,
    useForAppStore: false,
    useForWallet: false,
    useForAutofill: false,
    requireAttention: false,
    attentionAwareFeatures: false,
    passcode: '123456',
    isPasscodeEnabled: false,
    alternativeAppearance: false,
    maskUnlockEnabled: false,
    hapticOnSuccess: false
  },
  volumeHudVisible: false,
  actionButtonHUD: null,
  actionButtonMode: 'siri',
  isSilentMode: false,
  isSiriOpen: false,

  cameraControl: {
    isOpen: false,
    activeTool: 'zoom',
    zoomValue: 1.0,
    exposureValue: 0,
    depthValue: 2.8,
    activeCameraLens: '1x',
    photographicStyle: 'Standard',
    toneValue: 0,
  },

  isWifiOn: true,
  isBluetoothOn: true,
  isCellularOn: true,
  isAirplaneMode: false,
  isFlashlightOn: false,
  isDarkMode: false,
  isLowPowerMode: false,
  isDoNotDisturb: false,
  brightness: 80,
  volume: 70,
  batteryLevel: 94,
  isCharging: false,
  wallpaper: 'f1',

  appleId: {
    name: 'Vishnu Sai Ramiya & Rohan R. Potdar',
    email: 'vishnu.rohan.builders@gmail.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    icloudStorageUsedGB: 68.4,
    icloudStorageTotalGB: 200,
    subscriptions: ['iCloud+ 200 GB Plan', 'Apple Developer Program', 'Apple Music Family']
  },

  gmailSync: {
    connected: true,
    email: 'vishnu.rohan.builders@gmail.com',
    lastSynced: 'Just now',
    isSyncing: false,
    backupPhotosCount: 25
  },

  activeCall: null,

  userPhotos: [
    { id: 'p-f1', emoji: '🏎️', title: 'Formula 1 Racing Car (Active Wallpaper)', url: '/f1_car_wallpaper.jpg', date: 'Today, 12:30 PM', isFavorite: true, isCameraRoll: true },
    { id: 'p-beach', emoji: '🏖️', title: 'Tropical Sea Beach', url: '/beach_wallpaper.jpg', date: 'Today, 12:05 PM', isFavorite: true, isCameraRoll: true },
    { id: 'p-beach-sunset', emoji: '🌅', title: 'Golden Hour Sea Beach Sunset', url: '/beach_sunset.jpg', date: 'Today, 11:40 AM', isFavorite: true, isCameraRoll: true },
    { id: 'p-beach-tropical', emoji: '🏝️', title: 'Azure Ocean Coral Reef Shore', url: '/beach_tropical.jpg', date: 'Today, 10:50 AM', isFavorite: true, isCameraRoll: true },
    { id: 'p-ironman', emoji: '🦸‍♂️', title: 'Iron Man (Cinematic Armor)', url: '/ironman_photo.jpg', date: 'Today, 10:15 AM', isFavorite: true, isCameraRoll: true },
    { id: 'p0', emoji: '🌅', title: 'Rohan R. Potdar - Sunset Silhouette', date: 'Today, 9:32 AM', isFavorite: true, isCameraRoll: true },
    { id: 'p1', emoji: '🏔️', title: 'Yosemite Sunrise', date: 'Yesterday, 6:45 AM', isFavorite: true },
    { id: 'p2', emoji: '🐶', title: 'Golden Retriever Pup', date: 'Monday, 3:12 PM', isFavorite: true },
    { id: 'p3', emoji: '🍕', title: 'Artisan Woodfire Pizza', date: 'Aug 28, 7:30 PM', isFavorite: false },
    { id: 'p4', emoji: '🏖️', title: 'Maui Beach Cove', date: 'Aug 24, 11:20 AM', isFavorite: true },
    { id: 'p5', emoji: '🚲', title: 'Pacific Coast Cycling', date: 'Aug 20, 9:15 AM', isFavorite: false },
    { id: 'p6', emoji: '☕', title: 'Morning Flat White', date: 'Aug 18, 8:05 AM', isFavorite: false },
    { id: 'p7', emoji: '🌸', title: 'Japanese Cherry Blossoms', date: 'Aug 15, 2:40 PM', isFavorite: true },
    { id: 'p8', emoji: '🌃', title: 'Tokyo Skyline at Night', date: 'Aug 10, 10:15 PM', isFavorite: true }
  ],

  installedApps: ['instagram', 'whatsapp', 'youtube', 'pinterest', 'tiktok', 'spotify', 'netflix', 'chatgpt'],

  dynamicIslandState: 'idle',
  timerSecondsRemaining: 0,
  isTimerRunning: false,
  isPlayingMusic: false,
  currentSong: {
    title: 'Anti-Hero',
    artist: 'Taylor Swift'
  },
  recentApps: ['settings', 'messages', 'camera', 'photos', 'safari', 'phone', 'appstore'],
  notifications: [
    {
      id: 'n1',
      app: 'Messages',
      title: 'Sarah',
      message: 'Welcome to your new iPhone! Let me know if you have questions.',
      time: '9:41 AM',
      unread: true
    },
    {
      id: 'n2',
      app: 'Gmail Sync',
      title: 'Google Account Synced',
      message: 'Photos & Messages are connected with vishnusairamiya20@gmail.com',
      time: '9:35 AM',
      unread: true
    },
    {
      id: 'n3',
      app: 'Tips',
      title: 'Did you know?',
      message: 'Swipe down from the top-right corner to open Control Center.',
      time: '9:30 AM',
      unread: true
    }
  ]
};

export default function App() {
  const [simulatorState, setSimulatorState] = useState<SimulatorState>(DEFAULT_SIMULATOR_STATE);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [activeView, setActiveView] = useState<'lessons' | 'missions' | 'glossary' | 'troubleshoot' | 'quiz'>('lessons');
  const [lastCompletedToast, setLastCompletedToast] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'guide' | 'simulator'>('guide');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Listen for Android PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleTriggerInstallPrompt = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  // Decrement running timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (simulatorState.isTimerRunning && simulatorState.timerSecondsRemaining > 0) {
      interval = setInterval(() => {
        setSimulatorState((prev) => {
          if (prev.timerSecondsRemaining <= 1) {
            return {
              ...prev,
              timerSecondsRemaining: 0,
              isTimerRunning: false,
              dynamicIslandState: prev.isPlayingMusic ? 'music' : 'idle'
            };
          }
          return {
            ...prev,
            timerSecondsRemaining: prev.timerSecondsRemaining - 1
          };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simulatorState.isTimerRunning, simulatorState.timerSecondsRemaining]);

  // Handle Gesture Trigger from Simulator or Lesson
  const handleGestureDetected = (gesture: string) => {
    const matchedMission = missions.find(
      (m) => m.requiredGesture === gesture && !m.isCompleted
    );

    if (matchedMission) {
      setMissions((prev) =>
        prev.map((m) => (m.id === matchedMission.id ? { ...m, isCompleted: true } : m))
      );
      setLastCompletedToast(`Mission Completed: ${matchedMission.title} (+${matchedMission.rewardPoints} pts)!`);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      setTimeout(() => setLastCompletedToast(null), 4000);
    }
  };

  const handleCompleteMissionDirectly = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, isCompleted: true } : m))
    );
  };

  const handleResetSimulator = () => {
    setSimulatorState(DEFAULT_SIMULATOR_STATE);
  };

  const handleLessonTriggerGesture = (gesture: GestureType) => {
    setMobileTab('simulator');
    switch (gesture) {
      case 'swipe_up_home':
        setSimulatorState((s) => ({
          ...s,
          currentApp: 'messages',
          isControlCenterOpen: false,
          isNotificationCenterOpen: false,
          isSpotlightOpen: false,
          isAppSwitcherOpen: false
        }));
        setTimeout(() => {
          setSimulatorState((s) => ({ ...s, currentApp: 'home' }));
          handleGestureDetected('swipe_up_home');
        }, 800);
        break;
      case 'swipe_down_control_center':
        setSimulatorState((s) => ({
          ...s,
          isControlCenterOpen: true,
          isNotificationCenterOpen: false,
          isSpotlightOpen: false,
          isAppSwitcherOpen: false
        }));
        handleGestureDetected('swipe_down_control_center');
        break;
      case 'swipe_down_spotlight':
        setSimulatorState((s) => ({
          ...s,
          isSpotlightOpen: true,
          isControlCenterOpen: false,
          isNotificationCenterOpen: false
        }));
        handleGestureDetected('swipe_down_spotlight');
        break;
      case 'swipe_up_pause_app_switcher':
        setSimulatorState((s) => ({
          ...s,
          isAppSwitcherOpen: true,
          isControlCenterOpen: false,
          isNotificationCenterOpen: false
        }));
        handleGestureDetected('swipe_up_pause_app_switcher');
        break;
      case 'long_press_app_icon':
        setSimulatorState((s) => ({
          ...s,
          currentApp: 'home',
          isJiggleMode: true
        }));
        handleGestureDetected('long_press_app_icon');
        break;
      case 'tap_dynamic_island':
        setSimulatorState((s) => ({
          ...s,
          isPlayingMusic: true,
          dynamicIslandState: 'expanded_music'
        }));
        handleGestureDetected('tap_dynamic_island');
        break;
      case 'open_settings':
        setSimulatorState((s) => ({
          ...s,
          currentApp: 'settings',
          isControlCenterOpen: false
        }));
        handleGestureDetected('open_settings');
        break;
      case 'toggle_flashlight':
        setSimulatorState((s) => ({
          ...s,
          isControlCenterOpen: true,
          isFlashlightOn: true
        }));
        handleGestureDetected('toggle_flashlight');
        break;
      case 'toggle_dark_mode':
        setSimulatorState((s) => ({
          ...s,
          isDarkMode: !s.isDarkMode
        }));
        handleGestureDetected('toggle_dark_mode');
        break;
      default:
        break;
    }
  };

  const completedCount = missions.filter((m) => m.isCompleted).length;
  const totalScore = missions.filter((m) => m.isCompleted).reduce((sum, m) => sum + m.rewardPoints, 0);

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Header */}
      <Header
        completedMissionsCount={completedCount}
        totalMissionsCount={missions.length}
        totalPoints={totalScore}
        activeView={activeView}
        onSelectView={setActiveView}
        onResetSimulator={handleResetSimulator}
        onOpenInstallAndroid={() => setIsInstallModalOpen(true)}
      />

      {/* Android Install Modal */}
      <AndroidInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onTriggerInstallPrompt={handleTriggerInstallPrompt}
      />

      {/* Completion Toast Banner */}
      {lastCompletedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 border border-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>{lastCompletedToast}</span>
          </div>
        </div>
      )}

      {/* Mobile Segmented View Switcher (Guide vs Phone) */}
      <div className="lg:hidden p-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex justify-center">
        <div className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl flex items-center w-full max-w-sm">
          <button
            onClick={() => setMobileTab('guide')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mobileTab === 'guide'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-500'
            }`}
          >
            Learning Guide
          </button>
          <button
            onClick={() => setMobileTab('simulator')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mobileTab === 'simulator'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-500'
            }`}
          >
            iPhone Sandbox
          </button>
        </div>
      </div>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Learning Content / Interactive Guides */}
          <div
            className={`lg:col-span-7 space-y-6 ${
              mobileTab === 'simulator' ? 'hidden lg:block' : 'block'
            }`}
          >
            {activeView === 'lessons' && (
              <LessonViewer
                onTriggerSimulatorGesture={handleLessonTriggerGesture}
                onOpenAppInSimulator={(appId) => {
                  setSimulatorState((s) => ({ ...s, currentApp: appId as IosAppId }));
                  setMobileTab('simulator');
                }}
              />
            )}

            {activeView === 'missions' && (
              <MissionsPanel
                missions={missions}
                onTriggerMissionGesture={handleLessonTriggerGesture}
                onCompleteMissionDirectly={handleCompleteMissionDirectly}
              />
            )}

            {activeView === 'glossary' && <GlossaryModal />}

            {activeView === 'troubleshoot' && <Troubleshooter />}

            {activeView === 'quiz' && <QuizModal />}
          </div>

          {/* Right Side: Interactive iPhone Simulator Sandbox */}
          <div
            className={`lg:col-span-5 flex flex-col items-center lg:sticky lg:top-20 ${
              mobileTab === 'guide' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div className="w-full flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Interactive iOS Simulator
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">Live Touch & Gestures</span>
            </div>

            {/* Simulated iPhone Frame */}
            <IPhoneFrame
              state={simulatorState}
              onUpdateState={setSimulatorState}
              onTriggerGesture={handleGestureDetected}
            />

            {/* Quick Practice Cheatsheet Card */}
            <div className="w-full max-w-[340px] mt-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-neutral-800 dark:text-neutral-200">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Beginner Gesture Cheatsheet</span>
              </div>
              <ul className="space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400 leading-tight">
                <li>• <strong>Volume & Mute</strong>: Click chassis buttons, toolbar, or press <kbd className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px] font-mono">+</kbd> / <kbd className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px] font-mono">-</kbd> / <kbd className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px] font-mono">M</kbd>.</li>
                <li>• <strong>Go Home</strong>: Flick up from bottom white bar.</li>
                <li>• <strong>Control Center</strong>: Pull down from top-right battery corner.</li>
                <li>• <strong>Search / Spotlight</strong>: Swipe down on home screen wallpaper.</li>
                <li>• <strong>App Switcher</strong>: Swipe up from bottom and pause.</li>
                <li>• <strong>Camera Shutter</strong>: Volume buttons snap photos inside Camera app.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
