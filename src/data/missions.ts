import { Mission } from '../types';

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission-swipe-home',
    title: 'Return to Home Screen',
    difficulty: 'Beginner',
    description: 'Open any app (like Messages or Settings), then flick the bottom Home Bar upwards to return to the home screen.',
    requiredGesture: 'swipe_up_home',
    hint: 'Look at the horizontal white bar at the bottom of the iPhone. Swipe or click it upward!',
    rewardPoints: 50,
    isCompleted: false
  },
  {
    id: 'mission-control-center',
    title: 'Open Control Center Deck',
    difficulty: 'Beginner',
    description: 'Swipe downwards from the top-right corner of the iPhone to pull down the Control Center quick toggles.',
    requiredGesture: 'swipe_down_control_center',
    hint: 'Click or swipe down from where the Battery & Wi-Fi icons sit in the top right corner.',
    rewardPoints: 50,
    isCompleted: false
  },
  {
    id: 'mission-toggle-flashlight',
    title: 'Turn on the Flashlight',
    difficulty: 'Beginner',
    description: 'Open the Control Center (or Lock Screen) and tap the Flashlight button to illuminate your surroundings.',
    requiredGesture: 'toggle_flashlight',
    hint: 'Pull down Control Center from top-right, then tap the round Flashlight toggle icon.',
    rewardPoints: 60,
    isCompleted: false
  },
  {
    id: 'mission-spotlight-search',
    title: 'Spotlight Quick Search',
    difficulty: 'Essential',
    description: 'Swipe down on the home screen wallpaper or click the Search pill to search for apps, calculations, or contacts.',
    requiredGesture: 'swipe_down_spotlight',
    hint: 'Swipe downwards in the middle of your Home Screen wallpaper or click "Search" above the dock.',
    rewardPoints: 60,
    isCompleted: false
  },
  {
    id: 'mission-dynamic-island',
    title: 'Interact with Dynamic Island',
    difficulty: 'Essential',
    description: 'Click or hold down on the black pill at the top of the screen to expand the Dynamic Island controller.',
    requiredGesture: 'tap_dynamic_island',
    hint: 'Click directly on the pill at the very top center of the iPhone screen to see it expand with live controls.',
    rewardPoints: 75,
    isCompleted: false
  },
  {
    id: 'mission-app-switcher',
    title: 'Multitasking App Switcher',
    difficulty: 'Essential',
    description: 'Swipe up from the bottom bar and pause for a moment to view all open multitasking app cards.',
    requiredGesture: 'swipe_up_pause_app_switcher',
    hint: 'Swipe up from the bottom bar halfway and hold, or click the App Switcher gesture button.',
    rewardPoints: 75,
    isCompleted: false
  },
  {
    id: 'mission-jiggle-mode',
    title: 'Enter Home Screen Jiggle Mode',
    difficulty: 'Pro Tip',
    description: 'Long press on any app icon on the home screen until the apps start jiggling so you can organize folders.',
    requiredGesture: 'long_press_app_icon',
    hint: 'Press and hold down on any app icon (like Camera or Messages) for 1 second, or click "Edit Home Screen".',
    rewardPoints: 80,
    isCompleted: false
  },
  {
    id: 'mission-dark-mode',
    title: 'Toggle Dark Mode Theme',
    difficulty: 'Beginner',
    description: 'Switch the iOS display to eye-comforting Dark Mode from Control Center or Settings.',
    requiredGesture: 'toggle_dark_mode',
    hint: 'Open Control Center and tap the Dark Mode toggle icon or go to Settings > Display.',
    rewardPoints: 60,
    isCompleted: false
  }
];
