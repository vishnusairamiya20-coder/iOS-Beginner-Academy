import React from 'react';
import {
  Smartphone,
  Trophy,
  BookOpen,
  HelpCircle,
  Sparkles,
  RotateCcw,
  CheckCircle,
  Lightbulb,
  Award,
  Download
} from 'lucide-react';

interface HeaderProps {
  completedMissionsCount: number;
  totalMissionsCount: number;
  totalPoints: number;
  activeView: 'lessons' | 'missions' | 'glossary' | 'troubleshoot' | 'quiz';
  onSelectView: (view: 'lessons' | 'missions' | 'glossary' | 'troubleshoot' | 'quiz') => void;
  onResetSimulator: () => void;
  onOpenInstallAndroid: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  completedMissionsCount,
  totalMissionsCount,
  totalPoints,
  activeView,
  onSelectView,
  onResetSimulator,
  onOpenInstallAndroid
}) => {
  const percentComplete = Math.round((completedMissionsCount / totalMissionsCount) * 100);

  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
                  iOS Beginner Academy
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold text-[11px] border border-blue-200 dark:border-blue-800/60">
                  v18.4 Guide
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Interactive Practice Sandbox & Masterclass for New iPhone Users
              </p>
            </div>
          </div>

          {/* Install on Android & Reset button for mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenInstallAndroid}
              title="Install on Android"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={onResetSimulator}
              title="Reset Simulator to Default"
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/70 p-1 rounded-2xl border border-neutral-200 dark:border-neutral-700/60 overflow-x-auto max-w-full">
          <button
            onClick={() => onSelectView('lessons')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'lessons'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lessons</span>
          </button>

          <button
            onClick={() => onSelectView('missions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'missions'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Hands-on Missions</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px]">
              {completedMissionsCount}/{totalMissionsCount}
            </span>
          </button>

          <button
            onClick={() => onSelectView('glossary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'glossary'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>iOS Glossary</span>
          </button>

          <button
            onClick={() => onSelectView('troubleshoot')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'troubleshoot'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Troubleshooter</span>
          </button>

          <button
            onClick={() => onSelectView('quiz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'quiz'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Knowledge Quiz</span>
          </button>
        </div>

        {/* Progress Points, Install on Android & Simulator Reset button */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={onOpenInstallAndroid}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install on Android</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-xs text-amber-700 dark:text-amber-400">
              {totalPoints} pts
            </span>
          </div>

          <button
            onClick={onResetSimulator}
            title="Reset Simulator to Default State"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Phone</span>
          </button>
        </div>
      </div>
    </header>
  );
};
