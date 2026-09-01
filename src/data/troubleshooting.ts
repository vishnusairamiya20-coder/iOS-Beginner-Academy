import { TroubleshootingTopic } from '../types';

export const TROUBLESHOOTING_GUIDES: TroubleshootingTopic[] = [
  {
    id: 'frozen-screen',
    question: 'My iPhone screen is frozen or black and not responding to touches',
    category: 'Screen & Buttons',
    symptoms: ['Screen does not respond to swipes', 'Stuck on an app screen', 'Black screen with subtle backlight'],
    steps: [
      'Perform a Force Restart (No data is lost):',
      '1. Quickly press and release the Volume Up button.',
      '2. Quickly press and release the Volume Down button.',
      '3. Press and HOLD the Side Button on the right until you see the white Apple logo appear (about 10–15 seconds), then let go.',
      'Plug your iPhone into a wall charger for 15 minutes if the battery was completely drained.'
    ],
    preventativeTip: 'Keep your iOS updated to the latest version in Settings > General > Software Update to fix memory leaks.'
  },
  {
    id: 'cannot-hear-calls',
    question: 'I cannot hear people when making a phone call or sound is very faint',
    category: 'Screen & Buttons',
    symptoms: ['Caller voice is muffled', 'No sound during regular calls', 'Speakerphone works but earpiece does not'],
    steps: [
      '1. Check that the plastic shipping wrap from the box has been removed from the front earpiece.',
      '2. While on an active call, press the Volume Up button on the left edge to raise in-call volume.',
      '3. Open Control Center and check if your iPhone is accidentally connected to Bluetooth headphones or a car audio system.',
      '4. Gently clean the top speaker mesh with a clean, dry, soft-bristled toothbrush.'
    ],
    preventativeTip: 'Avoid using phone cases that block the top receiver slit.'
  },
  {
    id: 'iphone-storage-full',
    question: 'iPhone alerts "Storage Almost Full" and apps cannot take photos or update',
    category: 'Storage & Apps',
    symptoms: ['Cannot take new photos', 'Apps crash upon opening', 'System alert warning'],
    steps: [
      '1. Open Settings > General > iPhone Storage.',
      '2. Review the color-coded bar to see what is taking up space (Photos, Apps, Messages, iOS).',
      '3. Enable "Offload Unused Apps" to automatically free up gigabytes of app storage without losing your personal data.',
      '4. Open the "Recently Deleted" album in Photos and empty it (deleted photos stay for 30 days taking up space).',
      '5. Go to Settings > Safari and tap "Clear History and Website Data".'
    ],
    preventativeTip: 'Turn on "Optimize iPhone Storage" in Settings > Photos to store full-res photos safely in iCloud.'
  },
  {
    id: 'wifi-disconnecting',
    question: 'Wi-Fi keeps dropping or says "No Internet Connection"',
    category: 'Network & Wi-Fi',
    symptoms: ['Wi-Fi icon disappears', 'Websites load slowly or time out', 'Exclamation mark on Wi-Fi icon'],
    steps: [
      '1. Open Control Center, tap Airplane Mode ON, wait 10 seconds, then tap it OFF.',
      '2. Go to Settings > Wi-Fi, tap the blue (i) next to your network name, and tap "Forget This Network", then reconnect with password.',
      '3. Restart your home Wi-Fi router by unplugging its power cord for 30 seconds.',
      '4. If still stuck, go to Settings > General > Transfer or Reset iPhone > Reset > Reset Network Settings.'
    ],
    preventativeTip: 'Ensure "Private Wi-Fi Address" is enabled in your Wi-Fi network settings to protect your device identity.'
  },
  {
    id: 'battery-draining-fast',
    question: 'Battery drains unexpectedly fast during normal everyday use',
    category: 'Battery & Power',
    symptoms: ['Battery drops quickly', 'Phone feels warm in hands', 'Needs multiple charges per day'],
    steps: [
      '1. Go to Settings > Battery and scroll down to the "Battery Usage by App" chart to see which app is using power.',
      '2. Go to Settings > General > Background App Refresh and turn it OFF for apps that don’t need constant background updates.',
      '3. Go to Settings > Display & Brightness and enable Auto-Brightness and Dark Mode.',
      '4. Check your Battery Health percentage in Settings > Battery > Battery Health & Charging. If Maximum Capacity is below 80%, an Apple authorized battery replacement will restore full day battery.'
    ],
    preventativeTip: 'Avoid leaving your iPhone in hot parked cars or under pillows while charging.'
  },
  {
    id: 'forgot-passcode-or-apple-id',
    question: 'Forgot my iPhone passcode or Apple ID password',
    category: 'Apple ID & Security',
    symptoms: ['iPhone is unavailable message', 'Locked out after wrong attempts', 'Cannot sign into App Store'],
    steps: [
      '1. For Apple ID password: Go to iforgot.apple.com on any computer or family member’s phone to reset your password.',
      '2. For Lock Screen Passcode: If your iPhone says "iPhone Unavailable" with an option in the bottom corner, tap "Forgot Passcode?" and enter your Apple ID password to reset it.',
      '3. If you have a trusted computer with Finder/iTunes, you can put the iPhone in Recovery Mode to restore it from your iCloud backup.'
    ],
    preventativeTip: 'Set up an "Account Recovery Contact" (a trusted family member) in Settings > [Your Name] > Sign-In & Security.'
  }
];
