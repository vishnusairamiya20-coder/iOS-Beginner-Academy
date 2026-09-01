import React from 'react';
import {
  Wifi,
  Bluetooth,
  Radio,
  Plane,
  Sun,
  Volume2,
  Flashlight,
  Moon,
  Battery,
  Lock,
  Music,
  RotateCw,
  QrCode,
  Calculator,
  Timer,
  Camera,
  Play,
  Pause
} from 'lucide-react';
import { SimulatorState } from '../../types';

interface ControlCenterProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onClose: () => void;
  onTriggerGesture?: (gesture: string) => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  state,
  onUpdateState,
  onClose,
  onTriggerGesture
}) => {
  const toggleWifi = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateState((s) => ({ ...s, isWifiOn: !s.isWifiOn }));
  };

  const toggleBluetooth = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateState((s) => ({ ...s, isBluetoothOn: !s.isBluetoothOn }));
  };

  const toggleAirplane = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateState((s) => ({ ...s, isAirplaneMode: !s.isAirplaneMode }));
  };

  const toggleFlashlight = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateState((s) => ({ ...s, isFlashlightOn: !s.isFlashlightOn }));
    onTriggerGesture?.('toggle_flashlight');
  };

  const toggleDarkMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateState((s) => ({ ...s, isDarkMode: !s.isDarkMode }));
    onTriggerGesture?.('toggle_dark_mode');
  };

  const toggleLowPower = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateState((s) => ({ ...s, isLowPowerMode: !s.isLowPowerMode }));
  };

  const toggleDoNotDisturb = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateState((s) => ({ ...s, isDoNotDisturb: !s.isDoNotDisturb }));
  };

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 bg-black/45 backdrop-blur-2xl z-40 p-4 pt-12 flex flex-col justify-between select-none text-white font-sans animate-fade-in"
    >
      <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
        {/* Top Control Grid (2x2 major modules) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Connectivity 2x2 Square */}
          <div className="bg-neutral-800/80 backdrop-blur-md rounded-3xl p-3 grid grid-cols-2 gap-2 shadow-lg border border-white/10">
            {/* Airplane */}
            <button
              onClick={toggleAirplane}
              className={`aspect-square rounded-full flex items-center justify-center transition-all ${
                state.isAirplaneMode ? 'bg-amber-500 text-white' : 'bg-neutral-700/80 text-white/70'
              }`}
            >
              <Plane className="w-5 h-5" />
            </button>

            {/* Cellular */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateState((s) => ({ ...s, isCellularOn: !s.isCellularOn }));
              }}
              className={`aspect-square rounded-full flex items-center justify-center transition-all ${
                state.isCellularOn ? 'bg-green-500 text-white' : 'bg-neutral-700/80 text-white/70'
              }`}
            >
              <Radio className="w-5 h-5" />
            </button>

            {/* Wi-Fi */}
            <button
              onClick={toggleWifi}
              className={`aspect-square rounded-full flex items-center justify-center transition-all ${
                state.isWifiOn ? 'bg-blue-500 text-white' : 'bg-neutral-700/80 text-white/70'
              }`}
            >
              <Wifi className="w-5 h-5" />
            </button>

            {/* Bluetooth */}
            <button
              onClick={toggleBluetooth}
              className={`aspect-square rounded-full flex items-center justify-center transition-all ${
                state.isBluetoothOn ? 'bg-blue-500 text-white' : 'bg-neutral-700/80 text-white/70'
              }`}
            >
              <Bluetooth className="w-5 h-5" />
            </button>
          </div>

          {/* Now Playing Widget */}
          <div className="bg-neutral-800/80 backdrop-blur-md rounded-3xl p-3.5 flex flex-col justify-between shadow-lg border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-400">Now Playing</span>
              <Music className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div>
              <p className="font-bold text-xs truncate">{state.currentSong.title}</p>
              <p className="text-[10px] text-neutral-400 truncate">{state.currentSong.artist}</p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateState((s) => ({
                    ...s,
                    isPlayingMusic: !s.isPlayingMusic,
                    dynamicIslandState: !s.isPlayingMusic ? 'music' : 'idle'
                  }));
                }}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
              >
                {state.isPlayingMusic ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sliders & Focus row */}
        <div className="grid grid-cols-4 gap-3 h-32">
          {/* Rotation lock */}
          <div className="flex flex-col gap-2">
            <button className="flex-1 rounded-2xl bg-neutral-800/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80">
              <RotateCw className="w-5 h-5" />
            </button>
            <button
              onClick={toggleDoNotDisturb}
              className={`flex-1 rounded-2xl backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors ${
                state.isDoNotDisturb ? 'bg-indigo-600 text-white' : 'bg-neutral-800/80 text-white/80'
              }`}
            >
              <Moon className="w-5 h-5" />
            </button>
          </div>

          {/* Screen Mirroring */}
          <div className="col-span-1 flex flex-col gap-2">
            <button
              onClick={toggleDarkMode}
              className={`flex-1 rounded-2xl backdrop-blur-md border border-white/10 flex flex-col items-center justify-center transition-colors ${
                state.isDarkMode ? 'bg-blue-600 text-white' : 'bg-neutral-800/80 text-white/80'
              }`}
            >
              <span className="text-xs font-bold">{state.isDarkMode ? 'Dark' : 'Light'}</span>
            </button>
            <button
              onClick={toggleLowPower}
              className={`flex-1 rounded-2xl backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors ${
                state.isLowPowerMode ? 'bg-yellow-500 text-black font-bold' : 'bg-neutral-800/80 text-white/80'
              }`}
            >
              <Battery className="w-5 h-5" />
            </button>
          </div>

          {/* Brightness Slider */}
          <div className="relative rounded-2xl bg-neutral-800/80 backdrop-blur-md border border-white/10 overflow-hidden flex flex-col justify-end">
            <div
              className="bg-white absolute bottom-0 left-0 right-0 transition-all pointer-events-none"
              style={{ height: `${state.brightness}%` }}
            />
            <input
              type="range"
              min="10"
              max="100"
              value={state.brightness}
              onChange={(e) => {
                const val = Number(e.target.value);
                onUpdateState((s) => ({ ...s, brightness: val }));
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="relative z-10 p-2 text-center pointer-events-none mix-blend-difference text-white">
              <Sun className="w-5 h-5 mx-auto" />
            </div>
          </div>

          {/* Volume Slider */}
          <div className="relative rounded-2xl bg-neutral-800/80 backdrop-blur-md border border-white/10 overflow-hidden flex flex-col justify-end">
            <div
              className="bg-white absolute bottom-0 left-0 right-0 transition-all pointer-events-none"
              style={{ height: `${state.volume}%` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={state.volume}
              onChange={(e) => {
                const val = Number(e.target.value);
                onUpdateState((s) => ({ ...s, volume: val }));
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="relative z-10 p-2 text-center pointer-events-none mix-blend-difference text-white">
              <Volume2 className="w-5 h-5 mx-auto" />
            </div>
          </div>
        </div>

        {/* Quick Tools Row */}
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={toggleFlashlight}
            className={`aspect-square rounded-2xl backdrop-blur-md border border-white/10 flex items-center justify-center transition-all ${
              state.isFlashlightOn ? 'bg-white text-black font-bold shadow-lg shadow-white/30' : 'bg-neutral-800/80 text-white/80'
            }`}
          >
            <Flashlight className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              onClose();
              onUpdateState((s) => ({ ...s, currentApp: 'clock' }));
            }}
            className="aspect-square rounded-2xl bg-neutral-800/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:bg-neutral-700"
          >
            <Timer className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              onClose();
              onUpdateState((s) => ({ ...s, currentApp: 'calculator' }));
            }}
            className="aspect-square rounded-2xl bg-neutral-800/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:bg-neutral-700"
          >
            <Calculator className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              onClose();
              onUpdateState((s) => ({ ...s, currentApp: 'camera' }));
            }}
            className="aspect-square rounded-2xl bg-neutral-800/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:bg-neutral-700"
          >
            <Camera className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Swipe up bar hint */}
      <div className="text-center pb-2">
        <div className="w-24 h-1 bg-white/40 rounded-full mx-auto" />
        <span className="text-[10px] text-white/60 mt-1 block">Tap backdrop or swipe up to close</span>
      </div>
    </div>
  );
};
