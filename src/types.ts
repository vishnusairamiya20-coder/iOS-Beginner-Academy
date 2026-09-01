export type IosAppId =
  | 'home'
  | 'settings'
  | 'messages'
  | 'camera'
  | 'photos'
  | 'safari'
  | 'appstore'
  | 'weather'
  | 'calculator'
  | 'clock'
  | 'notes'
  | 'phone'
  | 'founder'
  | 'maps'
  | 'health'
  | 'music'
  | 'youtube';

export interface AppIconInfo {
  id: IosAppId;
  name: string;
  iconName: string;
  gradient: string;
  badge?: number;
  isDock?: boolean;
}

export type DynamicIslandState = 'idle' | 'timer' | 'music' | 'call' | 'expanded_timer' | 'expanded_music' | 'expanded_call';

export interface UserPhotoItem {
  id: string;
  url?: string;
  emoji?: string;
  title: string;
  date: string;
  isFavorite: boolean;
  isCameraRoll?: boolean;
}

export interface FaceIdState {
  isEnrolled: boolean;
  enrollmentDate?: string;
  useForIphoneUnlock: boolean;
  useForAppStore: boolean;
  useForWallet: boolean;
  useForAutofill: boolean;
  requireAttention: boolean;
  attentionAwareFeatures: boolean;
  passcode: string;
  isPasscodeEnabled: boolean;
  alternativeAppearance: boolean;
  maskUnlockEnabled: boolean;
  hapticOnSuccess: boolean;
}

export interface SimulatorState {
  currentApp: IosAppId;
  previousApp?: IosAppId;
  isControlCenterOpen: boolean;
  isNotificationCenterOpen: boolean;
  isSpotlightOpen: boolean;
  isAppSwitcherOpen: boolean;
  isAppLibraryOpen: boolean;
  isJiggleMode: boolean;
  activeScreenPage: number; // 0: Home page 1, 1: Home page 2, 2: App Library

  // Power & Lock screen
  isLocked: boolean;
  isScreenOff: boolean;

  // Face ID & Biometrics State
  faceId: FaceIdState;

  // Physical Side Buttons HUD
  volumeHudVisible: boolean;
  actionButtonHUD: { visible: boolean; label: string; icon: string } | null;
  actionButtonMode: 'flashlight' | 'silent' | 'camera' | 'focus' | 'voicememo';
  isSilentMode: boolean;
  
  // Settings & Toggles
  isWifiOn: boolean;
  isBluetoothOn: boolean;
  isCellularOn: boolean;
  isAirplaneMode: boolean;
  isFlashlightOn: boolean;
  isDarkMode: boolean;
  isLowPowerMode: boolean;
  isDoNotDisturb: boolean;
  brightness: number; // 0-100
  volume: number; // 0-100
  batteryLevel: number;
  isCharging: boolean;
  wallpaper: string; // 'astronomy' | 'neon' | 'midnight' | 'minimal' | 'gradient'

  // Apple ID Profile State
  appleId: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    icloudStorageUsedGB: number;
    icloudStorageTotalGB: number;
    subscriptions: string[];
  };

  // Gmail / Google Cloud Sync
  gmailSync: {
    connected: boolean;
    email: string;
    lastSynced: string;
    isSyncing: boolean;
    backupPhotosCount: number;
  };

  // Active Calling State
  activeCall: {
    inCall: boolean;
    contactName: string;
    contactNumber: string;
    duration: number;
    isMuted: boolean;
    isSpeaker: boolean;
    status: 'dialing' | 'connected' | 'ended';
  } | null;

  // Photos Gallery
  userPhotos: UserPhotoItem[];

  // App Store Installed Apps
  installedApps: string[];

  // Dynamic Island & Media
  dynamicIslandState: DynamicIslandState;
  timerSecondsRemaining: number;
  isTimerRunning: boolean;
  isPlayingMusic: boolean;
  currentSong: {
    title: string;
    artist: string;
  };
  
  // Active App Switcher Stack
  recentApps: IosAppId[];

  // Interactive notifications
  notifications: Array<{
    id: string;
    app: string;
    title: string;
    message: string;
    time: string;
    unread: boolean;
  }>;
}

export type GestureType =
  | 'swipe_up_home'
  | 'swipe_down_control_center'
  | 'swipe_down_notifications'
  | 'swipe_down_spotlight'
  | 'swipe_up_pause_app_switcher'
  | 'long_press_app_icon'
  | 'tap_dynamic_island'
  | 'open_settings'
  | 'toggle_flashlight'
  | 'toggle_dark_mode'
  | 'start_timer'
  | 'search_spotlight';

export interface Mission {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Essential' | 'Pro Tip';
  description: string;
  requiredGesture: GestureType;
  hint: string;
  rewardPoints: number;
  isCompleted: boolean;
}

export interface LessonModule {
  id: string;
  title: string;
  icon: string;
  shortDesc: string;
  estimatedMinutes: number;
  topics: LessonTopic[];
}

export interface LessonTopic {
  id: string;
  title: string;
  content: string;
  gestureToTry?: GestureType;
  tryButtonLabel?: string;
  proTips: string[];
  commonMistakes: string[];
  visualCue?: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  pronunciation?: string;
  simpleDefinition: string;
  realWorldAnalogy: string;
  category: 'Gestures' | 'System' | 'Cloud & Sync' | 'Hardware' | 'Security';
  whereToFind: string;
}

export interface TroubleshootingTopic {
  id: string;
  question: string;
  category: 'Battery & Power' | 'Screen & Buttons' | 'Network & Wi-Fi' | 'Storage & Apps' | 'Apple ID & Security';
  symptoms: string[];
  steps: string[];
  preventativeTip: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}
