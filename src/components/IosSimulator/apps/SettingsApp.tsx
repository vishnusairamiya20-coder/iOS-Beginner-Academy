import React, { useState } from 'react';
import {
  ChevronRight,
  Wifi,
  Bluetooth,
  Radio,
  Bell,
  Volume2,
  VolumeX,
  Moon,
  Clock,
  Settings as SettingsIcon,
  Sun,
  Eye,
  Shield,
  Battery,
  User,
  ArrowLeft,
  Check,
  Smartphone,
  Lock,
  Cloud,
  CreditCard,
  Key,
  HelpCircle,
  Sparkles,
  Palette,
  Camera,
  Mic,
  Zap,
  RefreshCw,
  Edit2
} from 'lucide-react';
import { SimulatorState } from '../../../types';
import { playDtmfTone, playVolumeStepSound } from '../../../utils/audioUtils';
import { WallpaperBackground } from '../WallpaperBackground';

interface SettingsAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onClose: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({ state, onUpdateState }) => {
  const [activeSubpage, setActiveSubpage] = useState<string | null>(null);
  const [editAppleIdModal, setEditAppleIdModal] = useState(false);
  const [fakeName, setFakeName] = useState(state.appleId.name);
  const [fakeEmail, setFakeEmail] = useState(state.appleId.email);
  const [fakePhone, setFakePhone] = useState(state.appleId.phone);

  // Subpage toggles
  const toggleWifi = () => onUpdateState((s) => ({ ...s, isWifiOn: !s.isWifiOn }));
  const toggleBluetooth = () => onUpdateState((s) => ({ ...s, isBluetoothOn: !s.isBluetoothOn }));
  const toggleCellular = () => onUpdateState((s) => ({ ...s, isCellularOn: !s.isCellularOn }));
  const toggleAirplane = () => onUpdateState((s) => ({ ...s, isAirplaneMode: !s.isAirplaneMode }));
  const toggleDarkMode = () => onUpdateState((s) => ({ ...s, isDarkMode: !s.isDarkMode }));
  const toggleLowPower = () => onUpdateState((s) => ({ ...s, isLowPowerMode: !s.isLowPowerMode }));
  const toggleDoNotDisturb = () => onUpdateState((s) => ({ ...s, isDoNotDisturb: !s.isDoNotDisturb }));

  const handleSaveAppleId = () => {
    onUpdateState((s) => ({
      ...s,
      appleId: {
        ...s.appleId,
        name: fakeName.trim() || 'Vishnu Sai Ramiya',
        email: fakeEmail.trim() || 'vishnusairamiya20@gmail.com',
        phone: fakePhone.trim() || '+91 98765 43210'
      }
    }));
    setEditAppleIdModal(false);
  };

  // 1. APPLE ID & ICLOUD PROFILE SUBPAGE
  if (activeSubpage === 'apple_id') {
    return (
      <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} select-none text-xs font-sans`}>
        <div className={`pt-12 pb-2 px-3 flex items-center gap-2 border-b ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-white/80'} backdrop-blur`}>
          <button onClick={() => setActiveSubpage(null)} className="flex items-center text-blue-500 font-medium cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-0.5" />
            <span>Settings</span>
          </button>
          <span className="font-semibold text-sm mx-auto pr-6">Apple Account</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Profile Card */}
          <div className={`rounded-2xl p-4 flex flex-col items-center text-center space-y-2 shadow-xs ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-orange-600 to-indigo-700 text-white font-bold flex items-center justify-center text-2xl shadow-md relative">
              {state.appleId.name[0]}
              <button
                onClick={() => setEditAppleIdModal(true)}
                className="absolute bottom-0 right-0 p-1 rounded-full bg-blue-500 text-white border-2 border-white shadow-xs"
              >
                <Edit2 className="w-2.5 h-2.5" />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-sm">{state.appleId.name}</h3>
              <p className="text-neutral-400 text-[11px] font-mono">{state.appleId.email}</p>
              <p className="text-neutral-400 text-[10px] font-mono">{state.appleId.phone}</p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setEditAppleIdModal(true)}
                className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 font-semibold text-[10px] hover:bg-blue-500/20 cursor-pointer"
              >
                Edit Account Details
              </button>
              <button
                onClick={() => onUpdateState((s) => ({ ...s, currentApp: 'founder' }))}
                className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 font-semibold text-[10px] hover:bg-amber-500/20 cursor-pointer flex items-center gap-1"
              >
                <span>★ Founder Bio</span>
              </button>
            </div>
          </div>

          {/* iCloud Storage Breakdown Meter */}
          <div className={`rounded-2xl p-4 shadow-xs space-y-3 ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-xs">iCloud+</span>
              </div>
              <span className="text-[11px] font-bold text-blue-500">200 GB Plan</span>
            </div>

            {/* Storage Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden flex">
                <div style={{ width: '42%' }} className="bg-amber-400 h-full" title="Photos (42 GB)" />
                <div style={{ width: '18%' }} className="bg-blue-500 h-full" title="Backups (18 GB)" />
                <div style={{ width: '10%' }} className="bg-emerald-400 h-full" title="Docs & Drive (8.4 GB)" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span>{state.appleId.icloudStorageUsedGB} GB of {state.appleId.icloudStorageTotalGB} GB Used</span>
                <span>131.6 GB Free</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Photos 42GB</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Backups 18GB</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Docs 8.4GB</span>
              </div>
            </div>
          </div>

          {/* Subscriptions Card */}
          <div className={`rounded-2xl p-4 shadow-xs space-y-2 ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            <div className="flex items-center gap-2 pb-1 border-b border-neutral-200 dark:border-neutral-800">
              <CreditCard className="w-4 h-4 text-purple-500" />
              <span className="font-bold text-xs">Active Subscriptions</span>
            </div>
            {state.appleId.subscriptions.map((sub, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 text-xs">
                <span className="font-medium">{sub}</span>
                <span className="text-[10px] text-emerald-500 font-semibold">Active</span>
              </div>
            ))}
          </div>

          {/* Password & Security Card */}
          <div className={`rounded-2xl p-4 shadow-xs space-y-2 ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-green-500" />
                <span className="font-bold text-xs">Sign-In & Security</span>
              </div>
              <span className="text-[10px] text-neutral-400">2FA On</span>
            </div>
            <p className="text-[10px] text-neutral-400">
              Two-Factor Authentication is active with trusted phone number {state.appleId.phone}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. WI-FI SUBPAGE
  if (activeSubpage === 'wifi') {
    return (
      <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} select-none text-xs font-sans`}>
        <div className={`pt-12 pb-2 px-3 flex items-center gap-2 border-b ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-white/80'} backdrop-blur`}>
          <button onClick={() => setActiveSubpage(null)} className="flex items-center text-blue-500 font-medium">
            <ArrowLeft className="w-4 h-4 mr-0.5" />
            <span>Settings</span>
          </button>
          <span className="font-semibold text-sm mx-auto pr-6">Wi-Fi</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className={`rounded-2xl p-3 flex items-center justify-between shadow-xs ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            <span className="font-semibold text-sm">Wi-Fi</span>
            <button
              onClick={toggleWifi}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${state.isWifiOn ? 'bg-green-500' : state.isDarkMode ? 'bg-neutral-700' : 'bg-neutral-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${state.isWifiOn ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {state.isWifiOn && (
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-neutral-400 px-1">Connected Network</span>
              <div className={`rounded-2xl p-3 flex items-center justify-between shadow-xs ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-500 font-bold" />
                  <div>
                    <p className="font-bold text-xs">Home-WiFi-5G</p>
                    <p className="text-[10px] text-neutral-400">IP: 192.168.1.108 • 5 GHz</p>
                  </div>
                </div>
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
              </div>

              <span className="text-[10px] uppercase font-bold text-neutral-400 px-1">Other Available Networks</span>
              <div className={`rounded-2xl divide-y divide-neutral-200 dark:divide-neutral-800 shadow-xs ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
                {['Starbucks_Free_WiFi', 'Apple_HQ_Secure', 'Fiber_Mesh_Guest', 'Android_Pixel_Hotspot'].map((net) => (
                  <div key={net} className="p-3 flex items-center justify-between hover:opacity-75 cursor-pointer">
                    <span className="font-medium text-xs">{net}</span>
                    <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. BLUETOOTH SUBPAGE
  if (activeSubpage === 'bluetooth') {
    return (
      <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} select-none text-xs font-sans`}>
        <div className={`pt-12 pb-2 px-3 flex items-center gap-2 border-b ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-white/80'} backdrop-blur`}>
          <button onClick={() => setActiveSubpage(null)} className="flex items-center text-blue-500 font-medium">
            <ArrowLeft className="w-4 h-4 mr-0.5" />
            <span>Settings</span>
          </button>
          <span className="font-semibold text-sm mx-auto pr-6">Bluetooth</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className={`rounded-2xl p-3 flex items-center justify-between shadow-xs ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            <span className="font-semibold text-sm">Bluetooth</span>
            <button
              onClick={toggleBluetooth}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${state.isBluetoothOn ? 'bg-green-500' : state.isDarkMode ? 'bg-neutral-700' : 'bg-neutral-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${state.isBluetoothOn ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {state.isBluetoothOn && (
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-neutral-400 px-1">My Devices</span>
              <div className={`rounded-2xl divide-y divide-neutral-200 dark:divide-neutral-800 shadow-xs ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
                {[
                  { name: 'AirPods Pro (2nd Gen)', status: 'Connected (92%)', isConnected: true },
                  { name: 'Apple Watch Series 9', status: 'Connected', isConnected: true },
                  { name: 'Sony WH-1000XM5', status: 'Not Connected', isConnected: false },
                  { name: 'Tesla Model Y Bluetooth', status: 'Not Connected', isConnected: false }
                ].map((d) => (
                  <div key={d.name} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-xs">{d.name}</p>
                      <p className={`text-[10px] ${d.isConnected ? 'text-blue-500 font-bold' : 'text-neutral-400'}`}>{d.status}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. BATTERY SUBPAGE
  if (activeSubpage === 'battery') {
    return (
      <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} select-none text-xs font-sans`}>
        <div className={`pt-12 pb-2 px-3 flex items-center gap-2 border-b ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-white/80'} backdrop-blur`}>
          <button onClick={() => setActiveSubpage(null)} className="flex items-center text-blue-500 font-medium">
            <ArrowLeft className="w-4 h-4 mr-0.5" />
            <span>Settings</span>
          </button>
          <span className="font-semibold text-sm mx-auto pr-6">Battery</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className={`rounded-2xl p-3 flex items-center justify-between shadow-xs ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            <div>
              <p className="font-semibold text-sm">Low Power Mode</p>
              <p className="text-[10px] text-neutral-400 leading-tight">Reduces background activity until fully charged.</p>
            </div>
            <button
              onClick={toggleLowPower}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${state.isLowPowerMode ? 'bg-yellow-400' : state.isDarkMode ? 'bg-neutral-700' : 'bg-neutral-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${state.isLowPowerMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className={`rounded-2xl p-4 shadow-xs space-y-2.5 ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">Battery Health & Charging</span>
              <span className="text-blue-500 font-medium text-xs">Normal</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2 border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500">Maximum Capacity</span>
              <span className="font-bold text-sm text-emerald-500">98%</span>
            </div>
            <p className="text-[10px] text-neutral-400">
              Your battery is currently supporting normal peak performance capability.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 5. DISPLAY & BRIGHTNESS SUBPAGE
  if (activeSubpage === 'display') {
    return (
      <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} select-none text-xs font-sans`}>
        <div className={`pt-12 pb-2 px-3 flex items-center gap-2 border-b ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-white/80'} backdrop-blur`}>
          <button onClick={() => setActiveSubpage(null)} className="flex items-center text-blue-500 font-medium">
            <ArrowLeft className="w-4 h-4 mr-0.5" />
            <span>Settings</span>
          </button>
          <span className="font-semibold text-sm mx-auto pr-6">Display & Brightness</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Light vs Dark Appearance Selector */}
          <div className={`rounded-2xl p-4 shadow-xs space-y-3 ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            <span className="text-[10px] uppercase font-bold text-neutral-400">Appearance</span>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div
                onClick={() => onUpdateState((s) => ({ ...s, isDarkMode: false }))}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-pointer ${
                  !state.isDarkMode ? 'border-blue-500 bg-blue-50/20' : 'border-neutral-700 bg-neutral-800'
                }`}
              >
                <div className="w-12 h-18 rounded-xl bg-white border border-neutral-300 shadow-sm" />
                <span className="font-bold text-xs">Light</span>
              </div>

              <div
                onClick={() => onUpdateState((s) => ({ ...s, isDarkMode: true }))}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 cursor-pointer ${
                  state.isDarkMode ? 'border-blue-500 bg-blue-950/20' : 'border-neutral-300 bg-neutral-100'
                }`}
              >
                <div className="w-12 h-18 rounded-xl bg-black border border-neutral-700 shadow-sm" />
                <span className="font-bold text-xs">Dark</span>
              </div>
            </div>
          </div>

          {/* Brightness Slider */}
          <div className={`rounded-2xl p-4 shadow-xs space-y-2 ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">Brightness</span>
              <span className="text-xs font-mono">{state.brightness}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={state.brightness}
              onChange={(e) => onUpdateState((s) => ({ ...s, brightness: Number(e.target.value) }))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  }

  // 6. SOUNDS & HAPTICS SUBPAGE
  if (activeSubpage === 'sounds') {
    return (
      <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} select-none text-xs font-sans`}>
        <div className={`pt-12 pb-2 px-3 flex items-center gap-2 border-b ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-white/80'} backdrop-blur`}>
          <button onClick={() => setActiveSubpage(null)} className="flex items-center text-blue-500 font-medium">
            <ArrowLeft className="w-4 h-4 mr-0.5" />
            <span>Settings</span>
          </button>
          <span className="font-semibold text-sm mx-auto pr-6">Sounds & Haptics</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className={`rounded-2xl p-4 shadow-xs space-y-2 ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">Ringtone & Alerts Volume</span>
              <span className="text-xs font-mono">{state.volume}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={state.volume}
              onChange={(e) => {
                const vol = Number(e.target.value);
                onUpdateState((s) => ({ ...s, volume: vol }));
                playVolumeStepSound();
              }}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div className={`rounded-2xl divide-y divide-neutral-200 dark:divide-neutral-800 shadow-xs ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            {['Reflection (Default)', 'Opening', 'Marimba', 'Chimes', 'Silk'].map((tone) => (
              <div
                key={tone}
                onClick={() => playDtmfTone('5')}
                className="p-3 flex items-center justify-between hover:opacity-75 cursor-pointer"
              >
                <span className="font-medium text-xs">{tone}</span>
                <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 7. GENERAL > ABOUT SUBPAGE
  if (activeSubpage === 'about') {
    return (
      <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} select-none text-xs font-sans`}>
        <div className={`pt-12 pb-2 px-3 flex items-center gap-2 border-b ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-white/80'} backdrop-blur`}>
          <button onClick={() => setActiveSubpage(null)} className="flex items-center text-blue-500 font-medium">
            <ArrowLeft className="w-4 h-4 mr-0.5" />
            <span>Settings</span>
          </button>
          <span className="font-semibold text-sm mx-auto pr-6">About</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className={`rounded-2xl divide-y divide-neutral-200 dark:divide-neutral-800 shadow-xs ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            {[
              { label: 'Name', value: 'iPhone 16 Pro' },
              { label: 'iOS Version', value: '18.2 (22C150)' },
              { label: 'OS Architect & Founder', value: 'Vishnu Sai Ramiya' },
              { label: 'Academic Standing', value: 'Class 9 Scholar & AI Developer' },
              { label: 'Founder Gmail', value: 'vishnusairamiya20@gmail.com' },
              { label: 'Model Name', value: 'iPhone 16 Pro' },
              { label: 'Model Number', value: 'MYWP3LL/A' },
              { label: 'Serial Number', value: 'F2LZ19XP0D' },
              { label: 'Capacity', value: '256 GB' },
              { label: 'Available', value: '178.4 GB' },
              { label: 'Wi-Fi Address', value: '7C:11:CB:59:E4:31' },
              { label: 'Bluetooth', value: '7C:11:CB:59:E4:32' }
            ].map((item) => (
              <div key={item.label} className="p-3 flex items-center justify-between">
                <span className="font-medium text-neutral-500">{item.label}</span>
                <span className="font-bold text-xs truncate max-w-[170px]">{item.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onUpdateState((s) => ({ ...s, currentApp: 'founder' }))}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 cursor-pointer"
          >
            <span>★ Read Founder Vishnu Sai Ramiya Full Biography</span>
          </button>
        </div>
      </div>
    );
  }

  // 8. ACTION BUTTON SUBPAGE
  if (activeSubpage === 'action_button') {
    return (
      <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} select-none text-xs font-sans`}>
        <div className={`pt-12 pb-2 px-3 flex items-center gap-2 border-b ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-white/80'} backdrop-blur`}>
          <button onClick={() => setActiveSubpage(null)} className="flex items-center text-blue-500 font-medium">
            <ArrowLeft className="w-4 h-4 mr-0.5" />
            <span>Settings</span>
          </button>
          <span className="font-semibold text-sm mx-auto pr-6">Action Button</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
            <span className="text-3xl">🎛️</span>
            <h3 className="font-bold text-sm">Action Button</h3>
            <p className="text-[11px] text-neutral-400">
              Customize the physical button on the left edge above Volume buttons.
            </p>
          </div>

          <div className={`rounded-2xl divide-y divide-neutral-200 dark:divide-neutral-800 shadow-xs ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
            {[
              { id: 'flashlight', name: 'Flashlight', icon: '🔦' },
              { id: 'silent', name: 'Silent Mode', icon: '🔕' },
              { id: 'camera', name: 'Camera Shortcut', icon: '📸' },
              { id: 'focus', name: 'Focus / Do Not Disturb', icon: '🌙' },
              { id: 'voicememo', name: 'Voice Memo', icon: '🎙️' }
            ].map((act) => (
              <div
                key={act.id}
                onClick={() =>
                  onUpdateState((s) => ({
                    ...s,
                    actionButtonMode: act.id as any
                  }))
                }
                className="p-3.5 flex items-center justify-between cursor-pointer hover:opacity-80"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{act.icon}</span>
                  <span className="font-bold text-xs">{act.name}</span>
                </div>
                {state.actionButtonMode === act.id && <Check className="w-4 h-4 text-blue-500 font-bold" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 7. WALLPAPER SUBPAGE
  if (activeSubpage === 'wallpaper') {
    const wallpapersList = [
      {
        id: 'beach',
        name: 'Tropical Sea Beach',
        subtitle: 'Crystal turquoise ocean water, white sand shore & sunny sky',
        tag: 'Active Beach'
      },
      {
        id: 'beach_sunset',
        name: 'Sea Beach Golden Sunset',
        subtitle: 'Warm sunset reflections and soft evening coastal waves',
        tag: 'Sunset'
      },
      {
        id: 'beach_tropical',
        name: 'Azure Coral Reef Beach',
        subtitle: 'Vibrant turquoise coastal shallows & clear waters',
        tag: 'Tropical'
      },
      {
        id: 'ironman',
        name: 'Iron Man (Cinematic Armor)',
        subtitle: 'Photorealistic Mark LXXXV nanotech movie armor & glowing Arc Reactor',
        tag: 'Cinematic'
      },
      {
        id: 'ironman_suit',
        name: 'Iron Man (Stark Lab Suit)',
        subtitle: 'High-detail studio titanium metallic suit & HUD lighting',
        tag: 'Ultra HD'
      },
      {
        id: 'astronomy',
        name: 'Astronomy Deep Space',
        subtitle: 'Night sky constellation & stellar nebula',
        tag: 'iOS Classic'
      },
      {
        id: 'neon',
        name: 'Cyberpunk Emerald',
        subtitle: 'Vibrant neon synthwave gradients',
        tag: 'Dynamic'
      },
      {
        id: 'ios18',
        name: 'iOS 18 Iridescent',
        subtitle: 'Apple official iridescent flowing wave',
        tag: 'Default'
      },
      {
        id: 'minimal',
        name: 'Minimal Dark/Light',
        subtitle: 'Pure monochrome studio backdrop',
        tag: 'Clean'
      }
    ];

    return (
      <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} select-none text-xs font-sans`}>
        <div className={`pt-12 pb-2 px-3 flex items-center gap-2 border-b ${state.isDarkMode ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-white/80'} backdrop-blur`}>
          <button onClick={() => setActiveSubpage(null)} className="flex items-center text-blue-500 font-medium">
            <ArrowLeft className="w-4 h-4 mr-0.5" />
            <span>Settings</span>
          </button>
          <span className="font-semibold text-sm mx-auto pr-6">Wallpaper</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Current Active Preview */}
          <div className={`rounded-3xl p-4 shadow-sm space-y-3 ${state.isDarkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-white border border-neutral-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Active Wallpaper</h3>
                <p className="text-[11px] text-neutral-400 capitalize">{state.wallpaper} Theme</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                Applied
              </span>
            </div>

            {/* Live miniature phone mock preview */}
            <div className="relative h-44 rounded-2xl overflow-hidden shadow-inner border border-neutral-700/50 flex flex-col justify-between p-3">
              <WallpaperBackground wallpaper={state.wallpaper} isDarkMode={state.isDarkMode} />
              <div className="relative z-10 flex justify-between items-center text-[10px] text-white/90 font-bold">
                <span>9:41</span>
                <span>🔒 Lock & Home Screen</span>
              </div>
              <div className="relative z-10 text-center text-white/90 font-light text-2xl">
                Wednesday, Aug 27
              </div>
              <div className="relative z-10 flex justify-around py-1 bg-black/30 backdrop-blur-md rounded-xl">
                <span className="text-xs">📞</span>
                <span className="text-xs">🧭</span>
                <span className="text-xs">💬</span>
                <span className="text-xs">🎵</span>
              </div>
            </div>
          </div>

          {/* Wallpaper Selection Carousel */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1">
              Choose New Wallpaper
            </h4>

            <div className="grid grid-cols-1 gap-2.5">
              {wallpapersList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onUpdateState((s) => ({ ...s, wallpaper: item.id }));
                    playVolumeStepSound();
                  }}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    state.wallpaper === item.id
                      ? 'border-blue-500 bg-blue-500/10 shadow-md'
                      : state.isDarkMode
                      ? 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Miniature thumbnail */}
                    <div className="w-12 h-16 rounded-xl overflow-hidden relative border border-white/20 shadow-xs shrink-0">
                      <WallpaperBackground wallpaper={item.id} isDarkMode={state.isDarkMode} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs">{item.name}</span>
                        {item.tag && (
                          <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                            item.id === 'ironman' ? 'bg-red-500/20 text-red-400' : 'bg-neutral-500/20 text-neutral-400'
                          }`}>
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-tight mt-0.5 max-w-[170px]">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {state.wallpaper === item.id ? (
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <button className="px-2.5 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-[10px] font-semibold text-neutral-700 dark:text-neutral-300">
                      Set
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN SETTINGS ROOT VIEW
  return (
    <div className={`h-full flex flex-col ${state.isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-black'} select-none font-sans relative text-xs`}>
      {/* Edit Fake Apple ID Modal */}
      {editAppleIdModal && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md z-50 p-4 pt-14 flex flex-col justify-center animate-fade-in">
          <div className={`rounded-3xl p-5 space-y-4 shadow-2xl ${state.isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-black'}`}>
            <h3 className="font-bold text-base">Edit Fake Apple ID</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-neutral-400 font-semibold uppercase">Full Name</label>
                <input
                  type="text"
                  value={fakeName}
                  onChange={(e) => setFakeName(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 font-semibold uppercase">Apple ID / iCloud Email</label>
                <input
                  type="email"
                  value={fakeEmail}
                  onChange={(e) => setFakeEmail(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-xs outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 font-semibold uppercase">Phone Number</label>
                <input
                  type="tel"
                  value={fakePhone}
                  onChange={(e) => setFakePhone(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-xs outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditAppleIdModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAppleId}
                className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Header */}
      <div className="pt-14 pb-2 px-4 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Apple ID Profile Card */}
        <div
          onClick={() => setActiveSubpage('apple_id')}
          className={`p-3 rounded-2xl flex items-center justify-between shadow-xs cursor-pointer hover:opacity-85 ${
            state.isDarkMode ? 'bg-neutral-900' : 'bg-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-xs shrink-0">
              {state.appleId.name[0]}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs truncate">{state.appleId.name}</p>
              <p className="text-[10px] text-neutral-400 truncate">Apple Account, iCloud+ & Subscriptions</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </div>

        {/* Connectivity Stack */}
        <div className={`rounded-2xl divide-y divide-neutral-200 dark:divide-neutral-800 shadow-xs ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                ✈️
              </div>
              <span className="font-semibold text-xs">Airplane Mode</span>
            </div>
            <button
              onClick={toggleAirplane}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${state.isAirplaneMode ? 'bg-green-500' : state.isDarkMode ? 'bg-neutral-700' : 'bg-neutral-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${state.isAirplaneMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div onClick={() => setActiveSubpage('wifi')} className="p-3 flex items-center justify-between cursor-pointer hover:opacity-75">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                <Wifi className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs">Wi-Fi</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-400 text-[11px]">
              <span>{state.isWifiOn ? 'Home-WiFi-5G' : 'Off'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div onClick={() => setActiveSubpage('bluetooth')} className="p-3 flex items-center justify-between cursor-pointer hover:opacity-75">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Bluetooth className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs">Bluetooth</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-400 text-[11px]">
              <span>{state.isBluetoothOn ? 'AirPods Pro' : 'Off'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs">Cellular 5G</span>
            </div>
            <button
              onClick={toggleCellular}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${state.isCellularOn ? 'bg-green-500' : state.isDarkMode ? 'bg-neutral-700' : 'bg-neutral-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${state.isCellularOn ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* System & Hardware Controls Stack */}
        <div className={`rounded-2xl divide-y divide-neutral-200 dark:divide-neutral-800 shadow-xs ${state.isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
          <div onClick={() => setActiveSubpage('about')} className="p-3 flex items-center justify-between cursor-pointer hover:opacity-75">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-neutral-600 text-white flex items-center justify-center">
                <SettingsIcon className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs">General (About, iOS 18)</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          </div>

          <div onClick={() => setActiveSubpage('action_button')} className="p-3 flex items-center justify-between cursor-pointer hover:opacity-75">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs">Action Button</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-400 text-[11px]">
              <span className="capitalize">{state.actionButtonMode}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div onClick={() => setActiveSubpage('display')} className="p-3 flex items-center justify-between cursor-pointer hover:opacity-75">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs">Display & Brightness</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-400 text-[11px]">
              <span>{state.isDarkMode ? 'Dark' : 'Light'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div onClick={() => setActiveSubpage('wallpaper')} className="p-3 flex items-center justify-between cursor-pointer hover:opacity-75">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs">Wallpaper</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-400 text-[11px]">
              <span className="capitalize">
                {state.wallpaper === 'beach' || state.wallpaper === 'beach_wallpaper'
                  ? '🏖️ Sea Beach'
                  : state.wallpaper === 'beach_sunset'
                  ? '🌅 Beach Sunset'
                  : state.wallpaper === 'beach_tropical'
                  ? '🏝️ Tropical Sea'
                  : state.wallpaper === 'ironman'
                  ? '🦸‍♂️ Iron Man'
                  : state.wallpaper}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div onClick={() => setActiveSubpage('sounds')} className="p-3 flex items-center justify-between cursor-pointer hover:opacity-75">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs">Sounds & Haptics</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-400 text-[11px]">
              <span>{state.volume}%</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div onClick={() => setActiveSubpage('battery')} className="p-3 flex items-center justify-between cursor-pointer hover:opacity-75">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                <Battery className="w-4 h-4" />
              </div>
              <span className="font-semibold text-xs">Battery (Health 98%)</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-400 text-[11px]">
              <span>{state.batteryLevel}%</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
