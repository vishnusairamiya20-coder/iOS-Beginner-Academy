import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  PlayCircle,
  ChevronRight,
  Sparkles,
  Smartphone,
  Check,
  ArrowRight
} from 'lucide-react';
import { LessonModule, LessonTopic, GestureType } from '../../types';
import { IOS_LESSONS } from '../../data/iosLessons';

interface LessonViewerProps {
  onTriggerSimulatorGesture: (gesture: GestureType) => void;
  onOpenAppInSimulator: (appId: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  onTriggerSimulatorGesture,
  onOpenAppInSimulator
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(IOS_LESSONS[0].id);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(IOS_LESSONS[0].topics[0].id);

  const currentModule = IOS_LESSONS.find((m) => m.id === selectedModuleId) || IOS_LESSONS[0];
  const currentTopic = currentModule.topics.find((t) => t.id === selectedTopicId) || currentModule.topics[0];

  const handleTryGesture = (gesture?: GestureType) => {
    if (!gesture) return;
    onTriggerSimulatorGesture(gesture);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Module Sidebar */}
      <div className="w-full lg:w-72 shrink-0 space-y-2">
        <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider px-2">
          Curriculum Modules
        </p>

        <div className="space-y-1.5">
          {IOS_LESSONS.map((mod, idx) => {
            const isSelected = mod.id === selectedModuleId;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  setSelectedModuleId(mod.id);
                  setSelectedTopicId(mod.topics[0].id);
                }}
                className={`w-full text-left p-3 rounded-2xl transition-all border flex items-start gap-3 ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 shadow-xs'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs truncate">{mod.title}</p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                    {mod.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Topic Reader */}
      <div className="flex-1 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-xs flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          {/* Topic Selector Tabs within Module */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-100 dark:border-neutral-800">
            {currentModule.topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopicId(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTopicId === t.id
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>

          {/* Title & Metadata */}
          <div>
            <span className="text-[11px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
              {currentModule.title}
            </span>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
              {currentTopic.title}
            </h2>
          </div>

          {/* Interactive "Try on Simulator" Callout if gesture is available */}
          {currentTopic.gestureToTry && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md shadow-blue-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-xs">Hands-on Practice Available</p>
                  <p className="text-[11px] text-blue-100">
                    Test this gesture live on the iPhone simulator on your right.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleTryGesture(currentTopic.gestureToTry)}
                className="px-4 py-2 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 active:scale-95 transition-all shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentTopic.tryButtonLabel || 'Try on Simulator'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Lesson Content Body with formatted markdown-like bullets */}
          <div className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 text-xs leading-relaxed space-y-2 whitespace-pre-line font-normal">
            {currentTopic.content}
          </div>

          {/* Pro Tips & Common Pitfalls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Pro Tips Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700 dark:text-emerald-400">
                <Lightbulb className="w-4 h-4" />
                <span>Expert Pro Tips</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-emerald-800 dark:text-emerald-300">
                {currentTopic.proTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes Box */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Common Beginner Pitfalls</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-amber-800 dark:text-amber-300">
                {currentTopic.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
