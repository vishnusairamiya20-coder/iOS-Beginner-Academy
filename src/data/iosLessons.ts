import { LessonModule } from '../types';

export const IOS_LESSONS: LessonModule[] = [
  {
    id: 'hardware-and-buttons',
    title: 'iPhone Anatomy & Physical Buttons',
    icon: 'Smartphone',
    shortDesc: 'Understand physical buttons, the Dynamic Island, speakers, and charging ports.',
    estimatedMinutes: 4,
    topics: [
      {
        id: 'physical-buttons-guide',
        title: 'Side Button, Volume Keys & Action Button',
        content: `Every modern iPhone relies on a few precision physical buttons combined with fluid touch controls:
• **Side Button (Right Edge)**: 
  - Single click to Lock or Wake your screen.
  - Double click to launch Apple Pay / Wallet.
  - Hold down to talk to Siri (or press Side + Volume Down to reach the Power Off / Emergency SOS screen).
• **Volume Buttons (Left Edge)**:
  - Top button raises sound; bottom button lowers it.
  - In the Camera app, clicking either volume button snaps a photo just like a real camera shutter!
• **Action Button / Ring-Silent Switch (Left Edge)**:
  - On newer models, the Action Button can be customized in Settings to open the Flashlight, Camera, Voice Memo, or Silent Mode with a single hold.`,
        proTips: [
          'To quickly take a screenshot, press the Side Button and the Volume Up button at the exact same moment.',
          'Never hold down the Side button thinking it powers off the phone—holding Side button summons Siri. To power off, press and hold Side + Volume Down.'
        ],
        commonMistakes: [
          'Holding only the Side button to turn off the iPhone (which triggers Siri instead).',
          'Accidentally leaving the physical silent switch on orange and missing alarm or call rings.'
        ],
        visualCue: 'buttons'
      },
      {
        id: 'dynamic-island-notch',
        title: 'Dynamic Island & Face ID Sensor',
        content: `At the top of your iPhone screen sits the pill-shaped Dynamic Island or Face ID Notch:
• **Face ID**: Invisible infrared sensors securely scan your facial geometry in 3D to unlock your phone, authenticate app logins, and approve purchases without typing passwords.
• **Dynamic Island (Live Bubble)**:
  - Automatically bubbles up active background activities: running timers, sports scores, music playing, incoming Uber rides, and active phone calls.
  - **Single Tap**: Opens the full app.
  - **Touch & Hold (Long Press)**: Expands into an interactive mini-controller so you can pause music or stop timers without leaving your current app!`,
        gestureToTry: 'tap_dynamic_island',
        tryButtonLabel: 'Try Dynamic Island Interaction',
        proTips: [
          'You can swipe left or right across the Dynamic Island pill to collapse or hide it if it is distracting.',
          'Face ID works in total darkness and adapts as you grow hair, wear glasses, or put on hats.'
        ],
        commonMistakes: [
          'Blocking the top sensor array with a low-quality screen protector or your thumb when unlocking.'
        ],
        visualCue: 'dynamic-island'
      }
    ]
  },
  {
    id: 'core-gestures',
    title: 'Essential iOS Gestures',
    icon: 'HandMetal',
    shortDesc: 'Master swipe to go Home, App Switcher, Haptic Touch, and swipe navigation.',
    estimatedMinutes: 5,
    topics: [
      {
        id: 'swipe-home-and-switcher',
        title: 'Go Home & Multitasking App Switcher',
        content: `Modern iPhones do not have a physical round home button. Everything is driven by the small white or black bar at the very bottom of the screen (the Home Bar):
• **Go Home**: Flick your thumb quickly upwards from the bottom Home Bar. Your current app smoothly shrinks away back to your Home Screen.
• **App Switcher (Multitasking)**: Swipe upwards from the bottom bar and pause for half a second in the center of the screen before releasing. You will see a 3D carousel of your open apps.
• **Quick App Flipping**: Swipe directly left or right along the bottom Home Bar to instantly switch to your previous app without opening the App Switcher!`,
        gestureToTry: 'swipe_up_home',
        tryButtonLabel: 'Practice Swipe to Home',
        proTips: [
          'You do NOT need to swipe away/kill all your open apps in the App Switcher. iOS automatically freezes background apps to save battery and RAM.',
          'Swiping horizontally on the bottom bar is the fastest way to copy a 2-factor code from Messages into Safari.'
        ],
        commonMistakes: [
          'Constantly force-closing every app every hour. Apple engineers designed iOS so force-quitting apps actually uses MORE battery because the phone has to restart them from cold storage.'
        ],
        visualCue: 'home-bar'
      },
      {
        id: 'haptic-touch-and-jiggle',
        title: 'Haptic Touch & Home Screen Editing',
        content: `iPhones have sensitive haptic feedback motors that simulate physical clicks on glass:
• **Haptic Touch (Touch & Hold)**:
  - Gently press and hold down your finger on any app icon, link, or photo for one second.
  - A quick shortcut menu will pop up with direct actions (e.g. taking a selfie, creating a new note).
• **Edit Home Screen (Jiggle Mode)**:
  - Keep holding an empty space on your wallpaper or choose "Edit Home Screen" from an app's popup menu.
  - All icons will start wiggling with minus (-) badges, allowing you to drag them into folders or remove them from your screen.`,
        gestureToTry: 'long_press_app_icon',
        tryButtonLabel: 'Practice Long-Press / Jiggle',
        proTips: [
          'While in Jiggle Mode, you can drag one app icon over another to instantly create a folder named automatically by category!',
          'To stop Jiggle Mode, tap "Done" in the top right corner or swipe up from the bottom bar.'
        ],
        commonMistakes: [
          'Tapping "Delete App" when you only meant to remove it from the home screen. Choose "Remove from Home Screen" if you want to keep the app in your App Library.'
        ],
        visualCue: 'haptic-touch'
      }
    ]
  },
  {
    id: 'system-control-hubs',
    title: 'Control Center, Notifications & Spotlight',
    icon: 'SlidersHorizontal',
    shortDesc: 'Instant toggles for Flashlight, Wi-Fi, Brightness, and fast global Search.',
    estimatedMinutes: 5,
    topics: [
      {
        id: 'control-center-guide',
        title: 'Control Center: Your Quick Command Deck',
        content: `Control Center provides instantaneous access to the controls you use dozens of times a day:
• **How to Open**: Swipe downwards from the top-right corner of your screen (where the battery & Wi-Fi icons sit).
• **Core Controls**:
  - **Flashlight**: Tap to turn on/off. Long press to adjust beam brightness!
  - **Wi-Fi & Bluetooth**: Tap to disconnect.
  - **Brightness & Volume**: Slide your finger up and down directly on the tall slider bars.
  - **Dark Mode & True Tone**: Long press the Brightness bar to reveal Dark Mode and Night Shift toggles.
  - **Low Power Mode**: Saves remaining battery life by reducing background activity.`,
        gestureToTry: 'swipe_down_control_center',
        tryButtonLabel: 'Open Control Center in Simulator',
        proTips: [
          'You can customize which tools appear in Control Center! Go to Settings > Control Center to add Timer, Calculator, Screen Recording, and Shazam.',
          'Long-pressing the Wi-Fi icon inside Control Center lets you choose a new Wi-Fi network without digging through the Settings app.'
        ],
        commonMistakes: [
          'Swiping down from the middle of the screen instead of the top-right corner (which opens Notification Center instead).'
        ],
        visualCue: 'control-center'
      },
      {
        id: 'spotlight-search-guide',
        title: 'Spotlight Search: The Super Finder',
        content: `Spotlight is the single most powerful feature on iOS for beginners:
• **How to Open**: From your Home Screen, swipe down gently from anywhere in the middle of the wallpaper (or tap the "Search" pill above your dock).
• **What Spotlight Can Do**:
  - **Find any App**: Just type the first letter or two and hit return.
  - **Instant Math & Conversions**: Type "50 USD in EUR" or "45 * 18" and get instant live answers without opening the Calculator.
  - **Find Contacts & Texts**: Type someone\'s name to see their contact card, recent iMessages, and emails.
  - **Search Photos**: Type "dog", "sunset", or "receipt" to find photos with those objects.`,
        gestureToTry: 'swipe_down_spotlight',
        tryButtonLabel: 'Open Spotlight Search',
        proTips: [
          'Spotlight can set timers and alarms directly! Just type "timer 15 mins" into Spotlight and tap Start.',
          'Spotlight can define words, look up flight statuses, and check sports scores in real time.'
        ],
        commonMistakes: [
          'Spending minutes scrolling through endless pages of apps looking for an icon when typing 2 letters in Spotlight opens it in 1 second.'
        ],
        visualCue: 'spotlight'
      }
    ]
  },
  {
    id: 'essential-apps',
    title: 'Mastering Essential Apple Apps',
    icon: 'Compass',
    shortDesc: 'Messages (Blue vs Green bubbles), Camera modes, Safari privacy, and Apple Maps.',
    estimatedMinutes: 6,
    topics: [
      {
        id: 'messages-blue-vs-green',
        title: 'Messages: Blue vs Green Bubbles Explained',
        content: `When you text people on an iPhone, you will notice two bubble colors:
• **Blue Bubbles (iMessage)**:
  - The other person also has an Apple device (iPhone, iPad, Mac).
  - Sent over Wi-Fi or cellular data (free, does not use SMS carrier texting limits).
  - Features end-to-end encryption, high-res photos/videos, typing bubbles ("..."), read receipts, Tapback reactions (Heart, Thumbs Up), and unsending/editing recent messages.
• **Green Bubbles (SMS / MMS / RCS)**:
  - The recipient is using an Android or older phone without iMessage.
  - Sent through your cellular carrier text plan.`,
        proTips: [
          'You can double-tap or long-press any received message bubble to send a quick "Tapback" reaction (Heart, Haha, Thumbs Up, Exclamation).',
          'You can unsend or edit an iMessage up to 15 minutes after sending by long-pressing your message bubble.'
        ],
        commonMistakes: [
          'Worrying that green bubbles are broken. Green bubbles simply indicate a standard cellular carrier SMS.'
        ],
        visualCue: 'messages'
      },
      {
        id: 'camera-and-photos-guide',
        title: 'Camera & Photos: Snap, Zoom & Live Text',
        content: `The iPhone camera is equipped with intelligent computational photography:
• **Shooting Modes**:
  - **Photo**: Everyday sharp photos.
  - **Portrait**: Blurs the background with studio-quality depth-of-field (bokeh effect).
  - **Video / Cinematic**: Smooth stabilized HD/4K recording.
• **Live Text Feature**:
  - Point your camera at any book, whiteboard, business card, or address.
  - A small yellow bracket icon will appear in the corner. Tap it to directly select, copy, translate, or call phone numbers written on real-world objects!`,
        proTips: [
          'Swipe left on your iPhone Lock Screen to launch the camera instantly without unlocking your phone so you never miss a shot.',
          'In the Camera app, tap anywhere on the screen to set the focal point and slide the little sunshine icon up/down to brighten or darken the picture.'
        ],
        commonMistakes: [
          'Pinching to zoom with your fingers when you can simply tap the 0.5x (Ultra Wide), 1x (Main), or 3x/5x (Telephoto) lens circles for much clearer optical quality.'
        ],
        visualCue: 'camera'
      }
    ]
  },
  {
    id: 'apple-id-and-icloud',
    title: 'Apple ID, iCloud & Backups',
    icon: 'Cloud',
    shortDesc: 'Your digital key to apps, seamless sync, Find My tracking, and safe cloud backup.',
    estimatedMinutes: 5,
    topics: [
      {
        id: 'apple-id-basics',
        title: 'What is an Apple ID & Two-Factor Authentication?',
        content: `Your Apple ID (now also called Apple Account) is your master username and password:
• **What It Connects**:
  - App Store downloads & subscriptions.
  - iCloud backup (contacts, photos, notes, messages).
  - iMessage and FaceTime accounts.
  - Find My device location service.
• **Two-Factor Authentication (2FA)**:
  - Keeps your account secure. When signing into a new device or browser, a 6-digit verification code appears on your trusted iPhone screen.
  - **Golden Security Rule**: Apple will NEVER call or text asking for your 6-digit code. Never share this code with anyone.`,
        proTips: [
          'Keep your Apple ID password written down in a secure home notebook. If you forget it, use your Recovery Contact or iforgot.apple.com.',
          'Never share an Apple ID with family members! Use Apple Family Sharing instead so everyone gets their own private iCloud storage and purchase sharing.'
        ],
        commonMistakes: [
          'Creating multiple Apple IDs for different devices. Always use the same single Apple ID across your iPhone, iPad, Mac, and Apple Watch.'
        ],
        visualCue: 'apple-id'
      },
      {
        id: 'find-my-and-icloud-backup',
        title: 'Find My & Automatic iCloud Backups',
        content: `Peace of mind features built into every iPhone:
• **Find My iPhone**:
  - Allows you to track your misplaced iPhone on a map from iCloud.com or a family member's device.
  - You can play a loud sound even if the phone is on Silent, lock it with "Lost Mode", or remotely wipe it if stolen.
• **iCloud Backup**:
  - Automatically backs up your photos, health data, app data, and settings every night when your iPhone is plugged into a charger, locked, and connected to Wi-Fi.`,
        proTips: [
          'Enable "Send Last Location" in Settings > [Your Name] > Find My > Find My iPhone so your phone pings its GPS right before the battery dies.',
          'If you buy a new iPhone in the future, holding it next to your old iPhone automatically transfers every photo, app, and text message in minutes!'
        ],
        commonMistakes: [
          'Turning off iCloud backup to save a dollar, leaving your precious family memories unprotected if the phone is lost or dropped in water.'
        ],
        visualCue: 'find-my'
      }
    ]
  },
  {
    id: 'privacy-and-safety',
    title: 'Privacy, Security & Scam Defense',
    icon: 'ShieldCheck',
    shortDesc: 'App tracking permissions, location controls, Medical ID, and phishing defense.',
    estimatedMinutes: 4,
    topics: [
      {
        id: 'app-permissions-privacy',
        title: 'App Tracking & Location Permissions',
        content: `iOS is famous for putting privacy control in your hands:
• **"Ask App not to Track"**:
  - When downloading a new app, iOS prompts you if the app wants to track your activity across other companies' apps. Always tap "Ask App not to Track" to preserve privacy.
• **Location Services Options**:
  - **While Using the App**: The safest default (maps or ride-hailing only access GPS when open).
  - **Precise Location Toggle**: For weather or news apps, turn OFF "Precise Location" so they only know your general city, not your exact house!
• **Camera & Mic Indicators**:
  - A tiny **Green Dot** at the top right means an app is currently accessing your camera.
  - An **Orange Dot** means an app is listening to your microphone.`,
        proTips: [
          'Swipe down Control Center whenever you see the orange or green dot to see the exact name of the app that just used your mic or camera.',
          'Set up "Medical ID" in the Health app. First responders can view your blood type, allergies, and emergency contacts directly from your Lock Screen without needing your passcode.'
        ],
        commonMistakes: [
          'Selecting "Always Allow" for location permissions when an app only needs it while open.'
        ],
        visualCue: 'privacy'
      }
    ]
  },
  {
    id: 'battery-and-storage',
    title: 'Battery Health & Storage Management',
    icon: 'BatteryCharging',
    shortDesc: 'Prolong battery lifespan, optimize charging, and clear junk storage safely.',
    estimatedMinutes: 4,
    topics: [
      {
        id: 'battery-health-care',
        title: 'Battery Health & Charging Habits',
        content: `Modern lithium-ion batteries are intelligent, but following a few tips keeps them healthy for years:
• **Optimized Battery Charging**:
  - Located in Settings > Battery > Battery Health & Charging.
  - Learns your daily charging routine (e.g. charging overnight) and holds charging at 80% until just before you wake up, preventing heat stress.
• **Low Power Mode**:
  - Yellow battery icon indicates it is active.
  - Automatically reduces screen refresh rate, pauses background mail fetch, and extends battery life when below 20%.`,
        gestureToTry: 'open_settings',
        tryButtonLabel: 'Open Settings in Simulator',
        proTips: [
          'Extreme heat is the #1 enemy of iPhone batteries. Never leave your iPhone sitting on a car dashboard in direct summer sunlight.',
          'Fast chargers (20W+) are 100% safe because the iPhone regulates incoming power automatically.'
        ],
        commonMistakes: [
          'Letting your phone discharge to 0% before charging. Modern lithium batteries prefer being plugged in between 20% and 80%.'
        ],
        visualCue: 'battery'
      },
      {
        id: 'iphone-storage-cleanup',
        title: 'Managing Storage: "Offload Unused Apps"',
        content: `When your iPhone shows "Storage Almost Full":
• **Go to Settings > General > iPhone Storage**:
  - View a visual color-coded bar showing photos, apps, messages, and iOS system data.
• **Offload Unused Apps**:
  - Removes the large app download while keeping all your documents and personal game data intact. The app icon stays on your home screen with a small cloud icon—tap it anytime to redownload!
• **Clear Safari Website Cache**:
  - Go to Settings > Safari > Clear History and Website Data to quickly free up 1-3 GB of junk cache.`,
        proTips: [
          'Turn on "Optimize iPhone Storage" in Settings > Photos. Full-resolution originals are saved safely in iCloud, while lightweight versions stay on your phone, freeing up 80% of photo storage.',
          'Review "Large Attachments" in iPhone Storage to delete old video clips sent in Messages years ago.'
        ],
        commonMistakes: [
          'Deleting entire photo libraries manually without realizing they are backed up in iCloud.'
        ],
        visualCue: 'storage'
      }
    ]
  }
];
