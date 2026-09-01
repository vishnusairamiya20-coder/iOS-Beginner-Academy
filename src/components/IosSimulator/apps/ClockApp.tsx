import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Clock as ClockIcon, Bell, Timer as TimerIcon } from 'lucide-react';
import { SimulatorState } from '../../../types';

interface ClockAppProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
}

export const ClockApp: React.FC<ClockAppProps> = ({ state, onUpdateState }) => {
  const [activeTab, setActiveTab] = useState<'world' | 'alarm' | 'timer'>('timer');
  const [selectedMinutes, setSelectedMinutes] = useState(5);

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

  return (
    <div className="h-full flex flex-col bg-black text-white select-none text-xs font-sans">
      {/* Header */}
      <div className="pt-12 pb-2 px-4 border-b border-neutral-800 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight capitalize">{activeTab}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
        {activeTab === 'timer' && (
          <div className="w-full flex flex-col items-center space-y-6">
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
                  {[1, 3, 5, 10, 15].map((mins) => (
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

        {activeTab === 'world' && (
          <div className="w-full space-y-3">
            {[
              { city: 'Cupertino', time: '9:41 AM', diff: 'Local Time' },
              { city: 'London', time: '5:41 PM', diff: '+8 HRS' },
              { city: 'Tokyo', time: '2:41 AM', diff: '+17 HRS, Tomorrow' }
            ].map((c) => (
              <div key={c.city} className="flex justify-between items-center p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <div>
                  <p className="text-[11px] text-neutral-400">{c.diff}</p>
                  <p className="text-base font-semibold">{c.city}</p>
                </div>
                <span className="text-2xl font-light font-mono">{c.time}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'alarm' && (
          <div className="w-full space-y-3">
            {[
              { time: '07:00 AM', label: 'Morning Alarm', on: true },
              { time: '08:30 AM', label: 'Work', on: false }
            ].map((a) => (
              <div key={a.time} className="flex justify-between items-center p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <div>
                  <span className={`text-2xl font-light font-mono ${a.on ? 'text-white' : 'text-neutral-500'}`}>{a.time}</span>
                  <p className="text-neutral-400 text-[11px]">{a.label}</p>
                </div>
                <div className={`w-10 h-6 rounded-full p-0.5 flex items-center ${a.on ? 'bg-green-500 justify-end' : 'bg-neutral-700 justify-start'}`}>
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
