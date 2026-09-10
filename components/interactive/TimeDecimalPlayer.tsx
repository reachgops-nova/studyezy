import React, { useState, useEffect, useCallback } from 'react';

export interface TimeDecimalPlayerProps {
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
    questionText: 'How many minutes are in 0.5 hours, and why?',
    options: [
      '30 minutes, because an hour has 60 minutes and 0.5 means 1/2 of 60',
      '50 minutes, because 0.5 means 50 out of 100',
      '15 minutes, because 0.5 means 1/4 of an hour'
    ],
    correctIndex: 0,
    hint: 'Always remember that an hour has 60 minutes, so 0.5 means 1/2 of 60, which equals 30 minutes, not 50 minutes!'
  },
  {
    id: 2,
    questionText: 'How many total minutes are in 1.5 hours?',
    options: [
      '150 minutes total',
      '90 minutes total (1 hour of 60 minutes plus 30 minutes)',
      '105 minutes total'
    ],
    correctIndex: 1,
    hint: '1.5 hours is equal to 1 hour (60 minutes) plus 0.5 hours (30 minutes), which is 90 minutes in total.'
  },
  {
    id: 3,
    questionText: 'How do you convert 0.5 days into hours?',
    options: [
      '12 hours, because 0.5 is 1/2 of 24 hours in a day',
      '5 hours, because 0.5 means 5 hours',
      '10 hours, because 0.5 is 1/2 of 20 hours'
    ],
    correctIndex: 0,
    hint: 'To convert days written as decimals into hours, multiply by 24: 0.5 days is 1/2 of 24 hours, giving 12 hours.'
  }
];

export const TimeDecimalPlayer: React.FC<TimeDecimalPlayerProps> = ({
  conceptName = 'Concept 4.1: Units and Decimals of Time',
  unitTitle = 'Unit 4: Time (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'hours_to_mins' | 'days_to_hours'>('hours_to_mins');
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
        'Time can be measured using units ranging from tiny fractions of a second to full days and years, with fractional parts often written as decimals. Because time units are not based on tens, converting decimal times requires using facts like 60 minutes in an hour. A decimal such as 0.5 represents 1/2 of whatever time unit is being used, so 0.5 hours is 30 minutes, not 50 minutes!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'hours_to_mins') {
        const desc =
          demoStep === 0
            ? 'Since an hour has 60 minutes, 0.5 hours is 1/2 of 60, which equals 30 minutes, not 50 minutes!'
            : demoStep === 1
            ? '1.5 hours is equal to 1 hour and 30 minutes, which is 90 minutes in total!'
            : 'Tip to remember: Always remember that an hour has 60 minutes, so 0.5 means 1/2 of 60, not 50!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'To convert days written as decimals into hours, multiply the decimal amount by 24.'
            : demoStep === 1
            ? '0.5 days is 1/2 of 24 hours, giving 12 hours.'
            : 'Tiny fractions of time include milliseconds (1/1000 of a second) and nanoseconds which are even smaller!';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Units and Decimals of Time! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'hours_to_mins' | 'days_to_hours') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'hours_to_mins') {
      safeNarrate('Since an hour has 60 minutes, 0.5 hours is 1/2 of 60, which equals 30 minutes, not 50 minutes!');
    } else {
      safeNarrate('To convert days written as decimals into hours, multiply the decimal amount by 24.');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'hours_to_mins') {
      const desc =
        next === 0
          ? 'Since an hour has 60 minutes, 0.5 hours is 1/2 of 60, which equals 30 minutes, not 50 minutes!'
          : next === 1
          ? '1.5 hours is equal to 1 hour and 30 minutes, which is 90 minutes in total!'
          : 'Tip to remember: Always remember that an hour has 60 minutes, so 0.5 means 1/2 of 60, not 50!';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'To convert days written as decimals into hours, multiply the decimal amount by 24.'
          : next === 1
          ? '0.5 days is 1/2 of 24 hours, giving 12 hours.'
          : 'Tiny fractions of time include milliseconds (1/1000 of a second) and nanoseconds which are even smaller!';
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
              Core Definition & Key Facts
            </h3>
            <p className="text-sm leading-relaxed text-[#16241f]">
              Time can be measured using units ranging from tiny fractions of a second to full days and years, with fractional parts often written as decimals. 
              Because time units are not based on tens, converting decimal times requires using facts like <strong>60 minutes in an hour</strong>. 
              A decimal such as 0.5 represents <strong>1/2 of whatever time unit is being used</strong>, so 0.5 hours is <strong>30 minutes, not 50 minutes</strong>!
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Decimal Hours Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  0.5 hours = 30 minutes | 1.5 hours = 90 minutes
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  0.5 means 1/2 of 60 minutes, not 50 minutes!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                ⏱️ 0.5 h = 30 m
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Decimal Days Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  0.5 days = 1/2 of 24 hours = 12 hours
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Multiply decimal days by 24 to convert into hours.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                ☀️ 0.5 d = 12 h
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Time & Decimal Converter Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('hours_to_mins')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'hours_to_mins'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ⏱️ Hours to Minutes (0.5h & 1.5h)
            </button>
            <button
              onClick={() => handleSelectDemoMode('days_to_hours')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'days_to_hours'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ☀️ Days to Hours (0.5 days = 12h)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'hours_to_mins' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Converting Decimal Hours (60 minutes per hour)
                </h3>

                {/* Interactive Display */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  {demoStep === 0 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-white border border-[#16241f]/20 rounded-xl text-lg font-black text-[#16241f]">
                        0.5 Hours = <span className="text-[#9c6f1f]">30 Minutes</span>
                      </div>
                      <span className="text-xs font-bold text-[#9c6f1f]">
                        ✨ 0.5 means 1/2 of 60 minutes = 30 minutes (NOT 50 minutes!)
                      </span>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-[#16241f] text-white rounded-xl text-lg font-black shadow-md">
                        1.5 Hours = 1 hr (60 m) + 0.5 hr (30 m) = <span className="text-[#9c6f1f]">90 Minutes</span>
                      </div>
                      <span className="text-xs font-bold text-[#16241f]">
                        🎉 1 full hour (60 min) + half an hour (30 min) = 90 minutes total!
                      </span>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-[#9c6f1f]/20 border-2 border-[#9c6f1f] rounded-xl text-sm font-black text-[#16241f]">
                        💡 Rule: 0.5 = 1/2 of 60 = 30 minutes!
                      </div>
                      <span className="text-xs font-bold text-[#9c6f1f]">
                        Always remember that an hour has 60 minutes!
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '⏱️ Step 1: See 1.5 Hours in Minutes (90 m)'
                    : demoStep === 1
                    ? '💡 Step 2: See Key Rule (0.5 = 1/2 of 60)'
                    : '🔄 Reset Hours Converter'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Converting Decimal Days (24 hours per day)
                </h3>

                {/* Interactive Display */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  {demoStep === 0 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-white border border-[#16241f]/20 rounded-xl text-lg font-black text-[#16241f]">
                        0.5 Days ➔ Multiply by 24 Hours
                      </div>
                      <span className="text-xs font-bold text-[#16241f]">
                        To convert decimal days to hours, multiply by 24!
                      </span>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-[#16241f] text-white rounded-xl text-lg font-black shadow-md">
                        0.5 × 24 = <span className="text-[#9c6f1f]">12 Hours</span>
                      </div>
                      <span className="text-xs font-bold text-[#16241f]">
                        🎉 0.5 days is exactly half a day = 12 hours!
                      </span>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-[#9c6f1f]/10 border border-[#9c6f1f]/30 rounded-xl text-xs font-black text-[#16241f]">
                        ⚡ Milliseconds = 1/1000 of a second | Nanoseconds = even smaller!
                      </div>
                      <span className="text-xs font-bold text-[#9c6f1f]">
                        Time can be measured down to tiny fractions of a second!
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '☀️ Step 1: Calculate 0.5 Days in Hours (12 h)'
                    : demoStep === 1
                    ? '⚡ Step 2: Tiny Units (Milliseconds & Nanoseconds)'
                    : '🔄 Reset Days Converter'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'hours_to_mins' ? (
                <>
                  {demoStep === 0 && 'Since an hour has 60 minutes, 0.5 hours is 1/2 of 60, which equals 30 minutes, not 50 minutes!'}
                  {demoStep === 1 && '1.5 hours is equal to 1 hour and 30 minutes, which is 90 minutes in total!'}
                  {demoStep === 2 && 'Tip to remember: Always remember that an hour has 60 minutes, so 0.5 means 1/2 of 60, not 50!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'To convert days written as decimals into hours, multiply the decimal amount by 24.'}
                  {demoStep === 1 && '0.5 days is 1/2 of 24 hours, giving 12 hours.'}
                  {demoStep === 2 && 'Tiny fractions of time include milliseconds (1/1000 of a second) and nanoseconds which are even smaller!'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Units and Decimals of Time</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Always remember that an hour has 60 minutes, so 0.5 means 1/2 of 60, not 50!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('hours_to_mins');
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

export default TimeDecimalPlayer;
