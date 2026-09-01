import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, AlertCircle, ShieldAlert, CheckCircle, Search } from 'lucide-react';
import { TROUBLESHOOTING_GUIDES } from '../../data/troubleshooting';

export const Troubleshooter: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(TROUBLESHOOTING_GUIDES[0].id);
  const [search, setSearch] = useState('');

  const filteredGuides = TROUBLESHOOTING_GUIDES.filter(
    (g) =>
      g.question.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase()) ||
      g.symptoms.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            &quot;What is happening to my iPhone?&quot;
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Instant step-by-step diagnostic checklists for common beginner panics and glitches.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search symptoms (e.g. frozen, sound, wifi)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 outline-hidden ring-1 ring-neutral-200 dark:ring-neutral-700 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Troubleshooting Accordion List */}
      <div className="space-y-3">
        {filteredGuides.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-white dark:bg-neutral-900 border-blue-300 dark:border-blue-800 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {item.question}
                    </h3>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-4 text-xs animate-fade-in">
                  {/* Symptoms */}
                  <div>
                    <span className="font-bold text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">
                      Common Symptoms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.symptoms.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[11px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Step by Step Fix */}
                  <div className="space-y-2">
                    <span className="font-bold text-[11px] text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                      Recommended Fix Steps
                    </span>
                    <div className="space-y-1.5">
                      {item.steps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300 flex items-start gap-2.5 leading-relaxed"
                        >
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prevention tip */}
                  <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-[11px]">
                      <strong className="font-semibold">Preventative Habit: </strong>
                      {item.preventativeTip}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
