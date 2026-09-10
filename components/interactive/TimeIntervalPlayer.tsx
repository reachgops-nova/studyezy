import React, { useState, useEffect, useCallback } from 'react';

export interface TimeIntervalPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type Phase = 'visual_intro' | 'demo' | 'checkpoint_quiz' | 'passed';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    questionText: 'To find the time interval from 07:57 to 08:04, what is the best strategy?',
    options: [
      'Jump 3 minutes forward to 08:00, then 4 minutes to 08:04, giving a total of 7 minutes',
      'Subtract 57 from 4 to get 53 minutes',
      'Jump 10 minutes forward to 08:07, then subtract 3 minutes'
    ],
    correctIndex: 0,
    hint: 'Jump to the next whole hour first! From 07:57, jump 3 minutes to 08:00, then 4 minutes to 08:04 (3 + 4 = 7 minutes).'
  },
  {
    id: 2,
    questionText: 'If a television program runs from 09:45 until 10:35, what is its total duration?',
    options: [
      '90 minutes total',
      '50 minutes total (15 minutes to 10:00 plus 35 minutes to 10:35)',
      '40 minutes total'
    ],
    correctIndex: 1,
    hint: 'Jump 15 minutes to reach 10:00, then 35 more minutes to reach 10:35. 15 + 35 = 50 minutes duration.'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember when calculating time intervals across the o\'clock mark?',
    options: [
      'Always round times to the nearest half hour',
      'Jump to the next whole hour first; bridging through the o\'clock mark makes counting minutes simple!',
      'Multiply the start and finish times together'
    ],
    correctIndex: 1,
    hint: 'Jump to the next whole hour first; bridging through the o\'clock mark makes counting minutes simple!'
  }
];

export const TimeIntervalPlayer: React.FC<TimeIntervalPlayerProps> = ({
  conceptName = 'Concept 4.2: Calculating Time Intervals',
  unitTitle = 'Unit 4: Time (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'short_interval' | 'tv_program'>('short_interval');
  const [demoStep, setDemoStep] = useState<number>(0);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(0);

  const safeNarrate = useCallback(
    (text: string) => {
      if (onNarrate) {
        onNarrate(text);
      }
    },
    [onNarrate]
  );

  useEffect(() => {
    if (phase === 'visual_intro') {
      safeNarrate(
        'A time interval, or duration, is the amount of time that passes between a starting time and a finishing time. You can work out intervals by jumping along a timeline to friendly benchmark hours. Jump to the next whole hour first; bridging through the o\'clock mark makes counting minutes simple!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'short_interval') {
        const desc =
          demoStep === 0
            ? 'To find the interval from 07:57 to 08:04, click Jump 1 to reach the whole hour 08:00!'
            : demoStep === 1
            ? 'Jumped 3 minutes forward from 07:57 to 08:00! Now click Jump 2 to reach 08:04.'
            : 'Jumped 4 minutes forward to 08:04! Total duration is 3 minutes plus 4 minutes = 7 minutes.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'A TV program runs from 09:45 until 10:35. Click Jump 1 to reach 10:00!'
            : demoStep === 1
            ? 'Jumped 15 minutes forward from 09:45 to 10:00! Now click Jump 2 to reach 10:35.'
            : 'Jumped 35 minutes forward to 10:35! Total duration is 15 minutes plus 35 minutes = 50 minutes.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Calculating Time Intervals! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'short_interval' | 'tv_program') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'short_interval') {
      safeNarrate('To find the interval from 07:57 to 08:04, click Jump 1 to reach the whole hour 08:00!');
    } else {
      safeNarrate('A TV program runs from 09:45 until 10:35. Click Jump 1 to reach 10:00!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'short_interval') {
      const desc =
        next === 0
          ? 'To find the interval from 07:57 to 08:04, click Jump 1 to reach the whole hour 08:00!'
          : next === 1
          ? 'Jumped 3 minutes forward from 07:57 to 08:00! Now click Jump 2 to reach 08:04.'
          : 'Jumped 4 minutes forward to 08:04! Total duration is 3 minutes plus 4 minutes = 7 minutes.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'A TV program runs from 09:45 until 10:35. Click Jump 1 to reach 10:00!'
          : next === 1
          ? 'Jumped 15 minutes forward from 09:45 to 10:00! Now click Jump 2 to reach 10:35.'
          : 'Jumped 35 minutes forward to 10:35! Total duration is 15 minutes plus 35 minutes = 50 minutes.';
      safeNarrate(desc);
    }
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setShowHint(false);
    const q = QUIZ_QUESTIONS[quizIndex];
    const isCorrect = idx === q.correctIndex;

    if (onAttempt) {
      onAttempt(isCorrect);
    }

    if (isCorrect) {
      setStars((prev) => prev + 1);
      setTimeout(() => {
        if (quizIndex < QUIZ_QUESTIONS.length - 1) {
          setQuizIndex((prev) => prev + 1);
          setSelectedOption(null);
          setShowHint(false);
        } else {
          setPhase('passed');
          if (onSuccess) {
            onSuccess();
          }
        }
      }, 1200);
    } else {
      setShowHint(true);
      safeNarrate(q.hint);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-[#f4f6f1] text-[#16241f] rounded-2xl shadow-md border-2 border-[#16241f]/10 transition-all duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#16241f]/10">
        <div>
          <p className="text-xs uppercase font-bold tracking-wider text-[#9c6f1f]">{unitTitle}</p>
          <h2 className="text-lg font-bold text-[#16241f] mt-0.5">{conceptName}</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#9c6f1f]/10 rounded-full border border-[#9c6f1f]/30">
          <span className="text-base">⭐</span>
          <span className="text-sm font-bold text-[#9c6f1f]">{stars} Stars</span>
        </div>
      </div>

      {/* Phase 1: Visual Intro */}
      {phase === 'visual_intro' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm">
            <h3 className="text-sm font-bold text-[#9c6f1f] uppercase tracking-wide mb-1">
              Core Definition & Key Rules
            </h3>
            <p className="text-sm leading-relaxed text-[#16241f]">
              A <strong>time interval</strong>, or <strong>duration</strong>, is the amount of time that passes between a starting time and a finishing time. 
              You can work out intervals by <strong>jumping along a timeline to friendly benchmark hours</strong>. 
              <strong> Jump to the next whole hour first;</strong> bridging through the o'clock mark makes counting minutes simple!
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Short Interval (07:57 to 08:04)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  07:57 ➔ Jump +3 mins to 08:00 ➔ Jump +4 mins to 08:04
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Total duration = 3 + 4 = 7 minutes.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                ⏱️ 7 Mins
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  TV Program Duration (09:45 to 10:35)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  09:45 ➔ Jump +15 mins to 10:00 ➔ Jump +35 mins to 10:35
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Total duration = 15 + 35 = 50 minutes.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                📺 50 Mins
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Timeline Jump Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('short_interval')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'short_interval'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ⏱️ 07:57 to 08:04 (7 Mins)
            </button>
            <button
              onClick={() => handleSelectDemoMode('tv_program')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'tv_program'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              📺 09:45 to 10:35 (50 Mins)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'short_interval' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Jumping to Whole Hour Benchmark: 07:57 to 08:04
                </h3>

                {/* Timeline Visualizer */}
                <div className="relative py-8 my-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 px-6">
                  <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#16241f]/30 -translate-y-1/2" />

                    {/* Benchmark Points */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          demoStep === 0
                            ? 'bg-[#9c6f1f] text-white scale-125 shadow-md ring-4 ring-[#9c6f1f]/20'
                            : 'bg-white text-[#16241f] border border-[#16241f]/30'
                        }`}
                      >
                        07:57
                      </div>
                      <span className="text-[10px] font-bold text-[#16241f]/60 mt-1">START</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          demoStep === 1
                            ? 'bg-[#9c6f1f] text-white scale-125 shadow-md ring-4 ring-[#9c6f1f]/20'
                            : 'bg-[#16241f] text-white'
                        }`}
                      >
                        08:00
                      </div>
                      <span className="text-[10px] font-bold text-[#9c6f1f] mt-1">BENCHMARK</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          demoStep === 2
                            ? 'bg-[#9c6f1f] text-white scale-125 shadow-md ring-4 ring-[#9c6f1f]/20'
                            : 'bg-white text-[#16241f] border border-[#16241f]/30'
                        }`}
                      >
                        08:04
                      </div>
                      <span className="text-[10px] font-bold text-[#16241f]/60 mt-1">FINISH</span>
                    </div>
                  </div>
                </div>

                {/* Jump Breakdown Cards */}
                <div className="grid grid-cols-2 gap-3 my-3">
                  <div
                    className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                      demoStep >= 1
                        ? 'bg-[#9c6f1f]/10 border-[#9c6f1f]'
                        : 'bg-[#16241f]/5 border-[#16241f]/10 opacity-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase block text-[#9c6f1f]">Jump 1 (To 08:00)</span>
                    <span className="text-sm font-bold text-[#16241f]">+3 Minutes</span>
                  </div>

                  <div
                    className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                      demoStep === 2
                        ? 'bg-[#16241f]/10 border-[#16241f]'
                        : 'bg-[#16241f]/5 border-[#16241f]/10 opacity-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase block text-[#16241f]/60">Jump 2 (To 08:04)</span>
                    <span className="text-sm font-bold text-[#16241f]">+4 Minutes</span>
                  </div>
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '⏱️ Jump 1: Reach Whole Hour (08:00)'
                    : demoStep === 1
                    ? '⏱️ Jump 2: Reach Finish Time (08:04)'
                    : '🔄 Reset Timeline Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  TV Program Duration: 09:45 to 10:35
                </h3>

                {/* Timeline Visualizer */}
                <div className="relative py-8 my-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 px-6">
                  <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#16241f]/30 -translate-y-1/2" />

                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          demoStep === 0
                            ? 'bg-[#16241f] text-white scale-125 shadow-md ring-4 ring-[#16241f]/20'
                            : 'bg-white text-[#16241f] border border-[#16241f]/30'
                        }`}
                      >
                        09:45
                      </div>
                      <span className="text-[10px] font-bold text-[#16241f]/60 mt-1">START</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          demoStep === 1
                            ? 'bg-[#9c6f1f] text-white scale-125 shadow-md ring-4 ring-[#9c6f1f]/20'
                            : 'bg-[#16241f] text-white'
                        }`}
                      >
                        10:00
                      </div>
                      <span className="text-[10px] font-bold text-[#9c6f1f] mt-1">BENCHMARK</span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          demoStep === 2
                            ? 'bg-[#16241f] text-white scale-125 shadow-md ring-4 ring-[#16241f]/20'
                            : 'bg-white text-[#16241f] border border-[#16241f]/30'
                        }`}
                      >
                        10:35
                      </div>
                      <span className="text-[10px] font-bold text-[#16241f]/60 mt-1">FINISH</span>
                    </div>
                  </div>
                </div>

                {/* Jump Breakdown Cards */}
                <div className="grid grid-cols-2 gap-3 my-3">
                  <div
                    className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                      demoStep >= 1
                        ? 'bg-[#9c6f1f]/10 border-[#9c6f1f]'
                        : 'bg-[#16241f]/5 border-[#16241f]/10 opacity-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase block text-[#9c6f1f]">Jump 1 (To 10:00)</span>
                    <span className="text-sm font-bold text-[#16241f]">+15 Minutes</span>
                  </div>

                  <div
                    className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                      demoStep === 2
                        ? 'bg-[#16241f]/10 border-[#16241f]'
                        : 'bg-[#16241f]/5 border-[#16241f]/10 opacity-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase block text-[#16241f]/60">Jump 2 (To 10:35)</span>
                    <span className="text-sm font-bold text-[#16241f]">+35 Minutes</span>
                  </div>
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '📺 Jump 1: Reach Whole Hour (10:00)'
                    : demoStep === 1
                    ? '📺 Jump 2: Reach Finish Time (10:35)'
                    : '🔄 Reset Program Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'short_interval' ? (
                <>
                  {demoStep === 0 && 'To find the interval from 07:57 to 08:04, click Jump 1 to reach the whole hour 08:00!'}
                  {demoStep === 1 && 'Jumped 3 minutes forward from 07:57 to 08:00! Now click Jump 2 to reach 08:04.'}
                  {demoStep === 2 && 'Jumped 4 minutes forward to 08:04! Total duration is 3 minutes plus 4 minutes = 7 minutes.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'A TV program runs from 09:45 until 10:35. Click Jump 1 to reach 10:00!'}
                  {demoStep === 1 && 'Jumped 15 minutes forward from 09:45 to 10:00! Now click Jump 2 to reach 10:35.'}
                  {demoStep === 2 && 'Jumped 35 minutes forward to 10:35! Total duration is 15 minutes plus 35 minutes = 50 minutes.'}
                </>
              )}
            </p>
          </div>

          <button
            onClick={() => setPhase('checkpoint_quiz')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Start Checkpoint Quiz ➔
          </button>
        </div>
      )}

      {/* Phase 3: Checkpoint Quiz */}
      {phase === 'checkpoint_quiz' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f]">
              Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <div className="flex gap-1">
              {QUIZ_QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full ${
                    idx === quizIndex
                      ? 'bg-[#9c6f1f]'
                      : idx < quizIndex
                      ? 'bg-[#16241f]'
                      : 'bg-[#16241f]/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Box */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm">
            <h3 className="text-base font-bold text-[#16241f] leading-snug">
              {QUIZ_QUESTIONS[quizIndex].questionText}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {QUIZ_QUESTIONS[quizIndex].options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectIndex = idx === QUIZ_QUESTIONS[quizIndex].correctIndex;
              let btnClass = 'bg-white text-[#16241f] border-[#16241f]/15 hover:border-[#16241f]/40';

              if (isSelected) {
                if (isCorrectIndex) {
                  btnClass = 'bg-[#16241f] text-white border-[#16241f] shadow-md';
                } else {
                  btnClass = 'bg-red-500/10 text-red-700 border-red-500/40';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 text-left font-semibold text-sm rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {isSelected && isCorrectIndex && <span>✨ Correct!</span>}
                </button>
              );
            })}
          </div>

          {/* Hint Card on Error */}
          {showHint && (
            <div className="p-4 bg-[#9c6f1f]/10 rounded-xl border border-[#9c6f1f]/30 text-xs font-medium text-[#16241f] animate-fade-in">
              <span className="font-bold text-[#9c6f1f] block mb-1">💡 Helpful Hint:</span>
              {QUIZ_QUESTIONS[quizIndex].hint}
            </div>
          )}
        </div>
      )}

      {/* Phase 4: Passed State */}
      {phase === 'passed' && (
        <div className="text-center py-8 space-y-5 animate-fade-in">
          <div className="text-5xl">🎉</div>
          <h3 className="text-xl font-black text-[#16241f]">Concept Mastered!</h3>
          <p className="text-sm text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            Awesome job! You successfully completed the checkpoint quiz for <strong>Calculating Time Intervals</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Jump to the next whole hour first; bridging through the o'clock mark makes counting minutes simple!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('short_interval');
                setDemoStep(0);
              }}
              className="py-3 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
            >
              🔄 Replay Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeIntervalPlayer;
