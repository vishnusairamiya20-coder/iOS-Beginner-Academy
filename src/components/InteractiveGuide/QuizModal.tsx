import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { IOS_QUIZZES } from '../../data/quizzes';

export const QuizModal: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = IOS_QUIZZES[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < IOS_QUIZZES.length) {
      setCurrentIdx((c) => c + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const percent = Math.round((score / IOS_QUIZZES.length) * 100);
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center text-4xl shadow-inner border border-amber-500/30">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {percent >= 80 ? 'Certified iOS Explorer! 🎓' : 'Good Effort! Keep Exploring'}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            You scored {score} out of {IOS_QUIZZES.length} questions correctly ({percent}%).
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-300">
          {percent >= 80
            ? 'You have mastered the core navigation gestures, privacy indicators, and essential apps of iOS.'
            : 'Review the lessons and practice hands-on in the simulator to sharpen your iPhone intuition!'}
        </div>

        <button
          onClick={handleRestart}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto transition-transform active:scale-95 shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Quiz</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quiz Progress Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider">
              {currentQ.category}
            </span>
            <span className="text-xs text-neutral-400">
              Question {currentIdx + 1} of {IOS_QUIZZES.length}
            </span>
          </div>

          <span className="font-mono font-bold text-xs text-amber-500">
            Score: {score}
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-snug">
          {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let borderAndBg =
              'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-200 hover:border-blue-300';

            if (isAnswerSubmitted) {
              if (isCorrect) {
                borderAndBg =
                  'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
              } else if (isSelected && !isCorrect) {
                borderAndBg =
                  'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200';
              }
            } else if (isSelected) {
              borderAndBg =
                'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${borderAndBg} cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>

                {isAnswerSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card when submitted */}
        {isAnswerSubmitted && (
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200 text-xs space-y-1 animate-fade-in">
            <span className="font-bold text-[11px] flex items-center gap-1 text-blue-700 dark:text-blue-400">
              <Sparkles className="w-3.5 h-3.5" /> Explanation
            </span>
            <p className="leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-end pt-2">
          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedOption !== null
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 cursor-pointer'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-bold text-xs flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span>{currentIdx + 1 < IOS_QUIZZES.length ? 'Next Question' : 'View Final Score'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
