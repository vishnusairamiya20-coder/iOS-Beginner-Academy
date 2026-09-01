import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Clock as ClockIcon, Bell, Timer as TimerIcon, Plus, Check } from 'lucide-react';
import { SimulatorState } from '../../../types';
import { useLiveClock, getWorldCityTime } from '../../../utils/dateTime';

interface ClockAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
}

export const ClockApp: React.FC<ClockAppProps> = ({ state, onUpdateState }) => {
  const [activeTab, setActiveTab] = useState<'world' | 'alarm' | 'timer'>('world');
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const liveClock = useLiveClock();

  const [alarms, setAlarms] = useState([
    { id: '1', time: '07:00 AM', label: 'Morning Routine', on: true },
    { id: '2', time: '08:30 AM', label: 'Work & Deep Focus', on: false },
    { id: '3', time: '10:00 PM', label: 'Wind Down', on: true }
  ]);

  const toggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, on: !a.on } : a))
    );
  };

  const startTimer = () => {
    const totalSeconds = selectedMinutes * 60;
    onUpdateState((s) => ({
      ...s,
      timerSecondsRemaining: totalSeconds,
      isTimerRunning: true,
      dynamicIslandState: 'timer'
    }));
  };

  const cancelTimer = () => {
    onUpdateState((s) => ({
      ...s,
      timerSecondsRemaining: 0,
      isTimerRunning: false,
      dynamicIslandState: s.isPlayingMusic ? 'music' : 'idle'
    }));
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const worldCities = [
    { city: 'Local Time', zone: Intl.DateTimeFormat().resolvedOptions().timeZone, label: 'Your Current Timezone' },
    { city: 'Cupertino', zone: 'America/Los_Angeles', label: 'Pacific Time (Apple HQ)' },
    { city: 'New York', zone: 'America/New_York', label: 'Eastern Time' },
    { city: 'London', zone: 'Europe/London', label: 'Greenwich Mean Time' },
    { city: 'Tokyo', zone: 'Asia/Tokyo', label: 'Japan Standard Time' }
  ];

  return (
    <div className="h-full flex flex-col bg-black text-white select-none text-xs font-sans">
      {/* Header */}
      <div className="pt-12 pb-2 px-4 border-b border-neutral-800 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight capitalize">
          {activeTab === 'world' ? 'World Clock' : activeTab}
        </h1>
        <span className="text-xs text-amber-500 font-medium font-mono">{liveClock.timeWithSeconds}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-start space-y-3">
        {activeTab === 'world' && (
          <div className="w-full space-y-2.5">
            {worldCities.map((c) => {
              const cityTime = getWorldCityTime(c.zone, liveClock.now);
              return (
                <div key={c.city} className="flex justify-between items-center p-3 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm">
                  <div>
                    <p className="text-[10px] text-neutral-400 font-semibold">{cityTime.diff}</p>
                    <p className="text-base font-bold">{c.city}</p>
                    <p className="text-[9px] text-neutral-500">{c.label}</p>
                  </div>
                  <span className="text-2xl font-light font-mono tracking-tight text-white">{cityTime.time}</span>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'timer' && (
          <div className="w-full flex-1 flex flex-col items-center justify-center space-y-6">
            {state.isTimerRunning ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-44 h-44 rounded-full border-4 border-amber-500/30 border-t-amber-500 flex items-center justify-center shadow-xl animate-spin-slow">
                  <div className="text-4xl font-mono font-light text-amber-400">
                    {formatTimer(state.timerSecondsRemaining)}
                  </div>
                </div>
                <p className="text-neutral-400 text-xs text-center">
                  Look at the Dynamic Island at the top of the phone screen! 🏝️
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={cancelTimer}
                    className="w-16 h-16 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 font-medium flex items-center justify-center hover:bg-neutral-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center space-y-6">
                {/* Time picker preset buttons */}
                <div className="text-center">
                  <span className="text-5xl font-light text-white font-mono">{selectedMinutes}</span>
                  <span className="text-neutral-400 text-base ml-1">min</span>
                </div>

                <div className="flex gap-2">
                  {[1, 3, 5, 10, 15, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setSelectedMinutes(mins)}
                      className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                        selectedMinutes === mins
                          ? 'bg-amber-500 text-black font-bold scale-105'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>

                <button
                  onClick={startTimer}
                  className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 font-bold flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all shadow-lg cursor-pointer"
                >
                  Start
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'alarm' && (
          <div className="w-full space-y-3">
            {alarms.map((a) => (
              <div
                key={a.id}
                onClick={() => toggleAlarm(a.id)}
                className="flex justify-between items-center p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 cursor-pointer hover:bg-neutral-800/80 transition-colors"
              >
                <div>
                  <span className={`text-2xl font-light font-mono ${a.on ? 'text-white' : 'text-neutral-500'}`}>{a.time}</span>
                  <p className="text-neutral-400 text-[11px] font-medium">{a.label}</p>
                </div>
                <div className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors ${a.on ? 'bg-green-500 justify-end' : 'bg-neutral-700 justify-start'}`}>
                  <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clock Bottom Tab Bar */}
      <div className="p-2 border-t border-neutral-800 bg-neutral-950 flex justify-around">
        <button
          onClick={() => setActiveTab('world')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'world' ? 'text-amber-500' : 'text-neutral-500'}`}
        >
          <ClockIcon className="w-4 h-4" />
          <span className="text-[10px]">World Clock</span>
        </button>
        <button
          onClick={() => setActiveTab('alarm')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'alarm' ? 'text-amber-500' : 'text-neutral-500'}`}
        >
          <Bell className="w-4 h-4" />
          <span className="text-[10px]">Alarm</span>
        </button>
        <button
          onClick={() => setActiveTab('timer')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'timer' ? 'text-amber-500' : 'text-neutral-500'}`}
        >
          <TimerIcon className="w-4 h-4" />
          <span className="text-[10px]">Timer</span>
        </button>
      </div>
    </div>
  );
};
