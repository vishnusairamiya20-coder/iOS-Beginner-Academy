import React from 'react';
import { Trophy, CheckCircle2, Circle, ArrowRight, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Mission, GestureType } from '../../types';

interface MissionsPanelProps {
  missions: Mission[];
  onTriggerMissionGesture: (gesture: GestureType) => void;
  onCompleteMissionDirectly: (missionId: string) => void;
}

export const MissionsPanel: React.FC<MissionsPanelProps> = ({
  missions,
  onTriggerMissionGesture,
  onCompleteMissionDirectly
}) => {
  const completedCount = missions.filter((m) => m.isCompleted).length;
  const totalScore = missions.filter((m) => m.isCompleted).reduce((sum, m) => sum + m.rewardPoints, 0);

  const handleTestMission = (mission: Mission) => {
    onTriggerMissionGesture(mission.requiredGesture);
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Stat Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-neutral-700">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-2xl shadow-inner">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Hands-on Gesture Missions</h2>
            <p className="text-xs text-neutral-300">
              Practice each essential gesture directly on the iPhone simulator to earn certification points!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur px-5 py-3 rounded-2xl border border-white/10">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">Progress</span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {completedCount} / {missions.length} Done
            </span>
          </div>
          <div className="border-l border-white/20 pl-4">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">Score</span>
            <span className="text-xl font-bold font-mono text-green-400">{totalScore} pts</span>
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((mission) => {
          return (
            <div
              key={mission.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                mission.isCompleted
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 shadow-xs'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {mission.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-600 shrink-0" />
                    )}
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        mission.difficulty === 'Beginner'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                          : mission.difficulty === 'Essential'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                      }`}
                    >
                      {mission.difficulty}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                    +{mission.rewardPoints} pts
                  </span>
                </div>

                <h3 className={`text-sm font-bold ${mission.isCompleted ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-80' : 'text-neutral-900 dark:text-white'}`}>
                  {mission.title}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {mission.description}
                </p>

                <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 text-[11px] text-neutral-500 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-700/60">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">💡 Hint: </span>
                  {mission.hint}
                </div>
              </div>

              {/* Action button */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={() => handleTestMission(mission)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>Practice on Phone</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {!mission.isCompleted && (
                  <button
                    onClick={() => {
                      onCompleteMissionDirectly(mission.id);
                      fireConfetti();
                    }}
                    className="text-[11px] text-neutral-400 hover:text-emerald-500 font-medium transition-colors"
                  >
                    Mark done
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
