import React from 'react';
import { Play, Pause, Square, Music, Timer as TimerIcon, Phone, Volume2 } from 'lucide-react';
import { SimulatorState, IosAppId } from '../../types';
import { startMusicSynthesis, stopMusicSynthesis, playVolumeStepSound } from '../../utils/audioUtils';

interface DynamicIslandProps {
  state: SimulatorState;
  onUpdateState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onOpenApp: (appId: IosAppId) => void;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({ state, onUpdateState, onOpenApp }) => {
  const isExpanded =
    state.dynamicIslandState === 'expanded_timer' ||
    state.dynamicIslandState === 'expanded_music' ||
    state.dynamicIslandState === 'expanded_call';

  const handleIslandClick = () => {
    if (state.isTimerRunning) {
      if (state.dynamicIslandState === 'expanded_timer') {
        onUpdateState((s) => ({ ...s, dynamicIslandState: 'timer' }));
      } else {
        onUpdateState((s) => ({ ...s, dynamicIslandState: 'expanded_timer' }));
      }
    } else if (state.isPlayingMusic) {
      if (state.dynamicIslandState === 'expanded_music') {
        onUpdateState((s) => ({ ...s, dynamicIslandState: 'music' }));
      } else {
        onUpdateState((s) => ({ ...s, dynamicIslandState: 'expanded_music' }));
      }
    } else {
      // Open music app
      onOpenApp('music');
    }
  };

  const toggleMusicPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playVolumeStepSound();
    if (state.isPlayingMusic) {
      stopMusicSynthesis();
      onUpdateState((s) => ({
        ...s,
        isPlayingMusic: false,
        dynamicIslandState: s.isTimerRunning ? 'timer' : 'idle'
      }));
    } else {
      startMusicSynthesis('pop');
      onUpdateState((s) => ({
        ...s,
        isPlayingMusic: true,
        dynamicIslandState: 'music'
      }));
    }
  };

  const stopTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateState((s) => ({
      ...s,
      isTimerRunning: false,
      timerSecondsRemaining: 0,
      dynamicIslandState: s.isPlayingMusic ? 'music' : 'idle'
    }));
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out select-none">
      <div
        onClick={handleIslandClick}
        className={`bg-black text-white rounded-full shadow-2xl flex items-center justify-between transition-all duration-300 cursor-pointer overflow-hidden border border-neutral-800 ${
          isExpanded
            ? 'w-[280px] h-[96px] rounded-[32px] p-3'
            : state.isTimerRunning || state.isPlayingMusic
            ? 'w-[185px] h-[34px] px-3'
            : 'w-[95px] h-[28px] px-2 hover:w-[105px]'
        }`}
      >
        {/* Expanded Timer Mode */}
        {state.dynamicIslandState === 'expanded_timer' && (
          <div className="w-full flex flex-col justify-between h-full animate-fade-in text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <TimerIcon className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-xs text-amber-400">Timer</span>
              </div>
              <span className="font-mono text-base font-bold text-amber-400">
                {formatTimer(state.timerSecondsRemaining)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-neutral-400">Kitchen Timer</span>
              <button
                onClick={stopTimer}
                className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-200 text-[10px] font-bold hover:bg-neutral-700 active:scale-95"
              >
                Stop
              </button>
            </div>
          </div>
        )}

        {/* Expanded Music Mode */}
        {state.dynamicIslandState === 'expanded_music' && (
          <div className="w-full flex flex-col justify-between h-full animate-fade-in text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-xs">
                <Music className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs truncate">{state.currentSong.title}</p>
                <p className="text-[10px] text-neutral-400 truncate">{state.currentSong.artist}</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" />
                <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse delay-75" />
                <div className="w-1 h-2 bg-green-500 rounded-full animate-pulse delay-150" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="w-2/3 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-white rounded-full" />
              </div>
              <button
                onClick={toggleMusicPlay}
                className="p-1 rounded-full bg-white text-black hover:bg-neutral-200"
              >
                {state.isPlayingMusic ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>
          </div>
        )}

        {/* Compact Active States */}
        {!isExpanded && (
          <>
            {state.isTimerRunning ? (
              <div className="w-full flex items-center justify-between text-amber-400">
                <div className="flex items-center gap-1.5">
                  <TimerIcon className="w-3.5 h-3.5 animate-spin-slow" />
                  <span className="text-[11px] font-semibold">Timer</span>
                </div>
                <span className="font-mono text-xs font-bold">{formatTimer(state.timerSecondsRemaining)}</span>
              </div>
            ) : state.isPlayingMusic ? (
              <div className="w-full flex items-center justify-between text-white">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-sm bg-rose-500 flex items-center justify-center text-[8px]">
                    🎵
                  </div>
                  <span className="text-[10px] text-neutral-300 font-medium truncate max-w-[80px]">
                    {state.currentSong.title}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="w-0.5 h-2.5 bg-green-400 rounded-full animate-bounce" />
                  <span className="w-0.5 h-3.5 bg-green-400 rounded-full animate-bounce delay-100" />
                  <span className="w-0.5 h-2 bg-green-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            ) : (
              /* Idle sensor dot */
              <div className="w-full flex items-center justify-between px-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 ring-1 ring-neutral-800/80" />
                <div className="w-2 h-2 rounded-full bg-neutral-900" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
