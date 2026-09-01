import { QuizQuestion } from '../types';

export const IOS_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How do you return to the Home Screen from inside any open app on a modern iPhone?',
    options: [
      'Double-click the physical power button on the right',
      'Swipe upwards from the thin Home Bar at the bottom of the screen',
      'Swipe downwards from the top center notch',
      'Press and hold the Volume Down button'
    ],
    correctIndex: 1,
    explanation: 'Flicking up from the bottom Home Bar smoothly sends your current app to the background and brings you back to the Home Screen.',
    category: 'Core Gestures'
  },
  {
    id: 'q2',
    question: 'What is the difference between a Blue bubble and a Green bubble in the Messages app?',
    options: [
      'Blue means the message was read; Green means it is unread',
      'Blue is an encrypted Apple iMessage (free over data/Wi-Fi); Green is a standard cellular carrier SMS/MMS',
      'Blue means your Wi-Fi is weak; Green means strong cellular',
      'Blue is for emergency contacts only; Green is for regular contacts'
    ],
    correctIndex: 1,
    explanation: 'Blue bubbles indicate iMessage between Apple devices with rich features and encryption. Green bubbles indicate regular SMS/MMS texts sent over cellular networks.',
    category: 'Essential Apps'
  },
  {
    id: 'q3',
    question: 'How do you open the Control Center to quickly turn on the Flashlight or adjust Brightness?',
    options: [
      'Swipe down from the top-right corner of the screen',
      'Swipe up with two fingers from the bottom',
      'Triple-click the side button',
      'Swipe right on the home screen wallpaper'
    ],
    correctIndex: 0,
    explanation: 'Swiping down from the very top-right corner (where the battery & signal icons are) pulls down the Control Center deck.',
    category: 'System Navigation'
  },
  {
    id: 'q4',
    question: 'What does a small ORANGE dot appearing at the top of your screen signify?',
    options: [
      'Your iPhone is low on battery storage',
      'An app is currently using or recently accessed your Microphone',
      'You have an unread voicemail',
      'A software update is downloading in the background'
    ],
    correctIndex: 1,
    explanation: 'An orange dot indicates microphone access; a green dot indicates camera access. You can swipe down Control Center to see which app used it!',
    category: 'Privacy & Security'
  },
  {
    id: 'q5',
    question: 'What happens when you select "Offload Unused App" in iPhone Storage settings?',
    options: [
      'It deletes all your personal photos and passwords forever',
      'It removes the app file to free up storage space, but keeps all your documents, game saves, and data intact',
      'It transfers the app to your computer via USB',
      'It hides the app icon behind a secret passcode'
    ],
    correctIndex: 1,
    explanation: 'Offloading frees up app storage while preserving your personal settings and data. Tapping the cloud icon on the home screen redownloads it instantly.',
    category: 'Battery & Storage'
  },
  {
    id: 'q6',
    question: 'Why is it NOT recommended to constantly force-close all background apps in the App Switcher?',
    options: [
      'It makes the screen flicker permanently',
      'iOS automatically freezes background apps; relaunching them from cold storage consumes MORE battery and CPU',
      'It cancels your iCloud subscription',
      'It deletes your recent phone call history'
    ],
    correctIndex: 1,
    explanation: 'Apple engineers designed iOS to preserve RAM efficiently. Force-quitting apps is only needed if an app has frozen or crashed.',
    category: 'Core Gestures'
  }
];
