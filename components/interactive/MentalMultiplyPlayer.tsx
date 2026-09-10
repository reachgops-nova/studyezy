import React, { useState, useEffect, useCallback } from 'react';

export interface MentalMultiplyPlayerProps {
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
    questionText: 'To calculate 19 times 5 mentally, how can you use the distributive law?',
    options: [
      'Think of it as (20 times 5) minus (1 times 5), which is 100 minus 5 = 95',
      'Think of it as (10 times 5) plus 9 = 59',
      'Multiply 19 by 10 to get 190, then divide by 3 = 63'
    ],
    correctIndex: 0,
    hint: 'Think of 19 as 20 minus 1. Multiply 20 by 5 to make 100, then take away 1 times 5 (5) to get 95.'
  },
  {
    id: 2,
    questionText: 'To solve 25 times 33 times 4 mentally, which factors should you pair up first?',
    options: [
      'Multiply 33 by 4 first to make 132, then multiply by 25',
      'Pair up 25 and 4 first to make 100, then multiply 100 by 33 to get 3300',
      'Multiply 25 by 33 first, then add 4'
    ],
    correctIndex: 1,
    hint: 'Whenever you see numbers like 25 and 4, pair them up first to make 100! Then 100 times 33 equals 3300.'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember when you see numbers like 25 and 4, or 50 and 2 in a multiplication problem?',
    options: [
      'Always add them together before multiplying',
      'Ignore them and start with the largest number',
      'Pair them up first to make 100!'
    ],
    correctIndex: 2,
    hint: 'Whenever you see numbers like 25 and 4, or 50 and 2, pair them up first to make 100!'
  }
];

export const MentalMultiplyPlayer: React.FC<MentalMultiplyPlayerProps> = ({
  conceptName = 'Concept 3.4: Mental Strategies for Multiplication',
  unitTitle = 'Unit 3: Calculation (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'nineteen_x_five' | 'pair_twentyfive_four'>('nineteen_x_five');
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
        'Number properties allow us to regroup factors or split tricky numbers into friendly pieces to solve multiplications mentally. The distributive law lets you break a tricky factor into two simpler numbers, like multiplying by 20 and taking 1 away. The associative and commutative laws let you regroup and reorder factors to create helpful multiples of 10.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'nineteen_x_five') {
        const desc =
          demoStep === 0
            ? 'To calculate 19 times 5, click Split 19 into (20 - 1)!'
            : demoStep === 1
            ? 'Think of 19 times 5 as (20 times 5) minus (1 times 5). That gives 100 minus 5!'
            : '100 minus 5 equals 95! Splitting 19 into 20 minus 1 makes mental multiplication easy.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'To solve 25 times 33 times 4, click Pair (25 x 4) First!'
            : demoStep === 1
            ? 'Multiply 25 by 4 first to make a friendly 100! Now click Multiply by 33.'
            : '100 times 33 equals 3300! Pairing 25 and 4 to make 100 makes the calculation instant.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Mental Strategies for Multiplication! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'nineteen_x_five' | 'pair_twentyfive_four') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'nineteen_x_five') {
      safeNarrate('To calculate 19 times 5, click Split 19 into (20 - 1)!');
    } else {
      safeNarrate('To solve 25 times 33 times 4, click Pair (25 x 4) First!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'nineteen_x_five') {
      const desc =
        next === 0
          ? 'To calculate 19 times 5, click Split 19 into (20 - 1)!'
          : next === 1
          ? 'Think of 19 times 5 as (20 times 5) minus (1 times 5). That gives 100 minus 5!'
          : '100 minus 5 equals 95! Splitting 19 into 20 minus 1 makes mental multiplication easy.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'To solve 25 times 33 times 4, click Pair (25 x 4) First!'
          : next === 1
          ? 'Multiply 25 by 4 first to make a friendly 100! Now click Multiply by 33.'
          : '100 times 33 equals 3300! Pairing 25 and 4 to make 100 makes the calculation instant.';
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
              Core Definition & Key Laws
            </h3>
            <p className="text-sm leading-relaxed text-[#16241f]">
              Number properties allow us to regroup factors or split tricky numbers into friendly pieces to solve multiplications mentally. 
              The <strong>distributive law</strong> lets you break a tricky factor into two simpler numbers (like multiplying by 20 and taking 1 away). 
              The <strong>associative and commutative laws</strong> let you regroup and reorder factors to create helpful multiples of 10.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Distributive Law Strategy
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  19 × 5 ➔ (20 × 5) - (1 × 5) = 100 - 5 = 95
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Think of 19 as (20 - 1) to make the multiplication friendly.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                💡 100 - 5 = 95
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Regrouping Factors Strategy
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  25 × 33 × 4 ➔ (25 × 4) × 33 = 100 × 33 = 3300
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Pair 25 and 4 first to make 100!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🤝 100 × 33 = 3300
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Mental Multiplication Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('nineteen_x_five')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'nineteen_x_five'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              💡 19 × 5 (Split into 20 - 1)
            </button>
            <button
              onClick={() => handleSelectDemoMode('pair_twentyfive_four')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'pair_twentyfive_four'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🤝 25 × 33 × 4 (Pair 25 × 4)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'nineteen_x_five' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Distributive Law: 19 × 5 = (20 × 5) - (1 × 5)
                </h3>

                {/* Interactive Steps Display */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  {demoStep === 0 && (
                    <div className="flex justify-center items-center gap-2 text-xl font-black text-[#16241f]">
                      <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">19</span>
                      <span>×</span>
                      <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">5</span>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex justify-center items-center gap-2 text-lg font-black text-[#9c6f1f]">
                        <span className="p-3 bg-[#9c6f1f]/20 rounded-xl border-2 border-[#9c6f1f]">(20 × 5)</span>
                        <span>-</span>
                        <span className="p-3 bg-[#9c6f1f]/20 rounded-xl border-2 border-[#9c6f1f]">(1 × 5)</span>
                      </div>
                      <div className="flex justify-center items-center gap-2 text-lg font-black text-[#16241f] mt-1">
                        <span>100</span>
                        <span>-</span>
                        <span>5</span>
                      </div>
                      <span className="text-xs font-bold text-[#9c6f1f] mt-1">
                        ✨ 20 times 5 makes 100, then subtract 1 times 5!
                      </span>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex justify-center items-center gap-2 text-xl font-black text-[#16241f]">
                        <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">100</span>
                        <span>-</span>
                        <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">5</span>
                        <span>=</span>
                        <span className="p-3 bg-[#9c6f1f] text-white rounded-xl shadow-md">95</span>
                      </div>
                      <span className="text-xs font-bold text-[#16241f] mt-1">
                        🎉 19 × 5 = 95!
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '💡 Step 1: Split 19 into (20 - 1)'
                    : demoStep === 1
                    ? '➖ Step 2: Calculate 100 - 5'
                    : '🔄 Reset 19 × 5 Strategy'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Regrouping Factors: 25 × 33 × 4 ➔ (25 × 4) × 33
                </h3>

                {/* Interactive Steps Display */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  {demoStep === 0 && (
                    <div className="flex justify-center items-center gap-2 text-lg font-black text-[#16241f]">
                      <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">25</span>
                      <span>×</span>
                      <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">33</span>
                      <span>×</span>
                      <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">4</span>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex justify-center items-center gap-2 text-lg font-black">
                        <span className="p-3 bg-[#16241f] text-white rounded-xl border-2 border-[#16241f] shadow-sm">
                          (25 × 4)
                        </span>
                        <span className="text-[#16241f]">×</span>
                        <span className="p-3 bg-white text-[#16241f] rounded-xl border border-[#16241f]/20">33</span>
                      </div>
                      <span className="text-xs font-bold text-[#16241f] mt-1">
                        🤝 Pair 25 and 4 first to make a friendly 100!
                      </span>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex justify-center items-center gap-2 text-xl font-black text-[#16241f]">
                        <span className="p-3 bg-[#9c6f1f] text-white rounded-xl shadow-sm">100</span>
                        <span>×</span>
                        <span className="p-3 bg-white border border-[#16241f]/20 rounded-xl">33</span>
                        <span>=</span>
                        <span className="p-3 bg-[#16241f] text-white rounded-xl shadow-md">3300</span>
                      </div>
                      <span className="text-xs font-bold text-[#16241f] mt-1">
                        🎉 100 × 33 = 3300!
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🤝 Step 1: Pair (25 × 4) First'
                    : demoStep === 1
                    ? '✖️ Step 2: Multiply 100 × 33'
                    : '🔄 Reset Regrouping Strategy'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'nineteen_x_five' ? (
                <>
                  {demoStep === 0 && 'To calculate 19 times 5, click Split 19 into (20 - 1)!'}
                  {demoStep === 1 && 'Think of 19 times 5 as (20 times 5) minus (1 times 5). That gives 100 minus 5!'}
                  {demoStep === 2 && '100 minus 5 equals 95! Splitting 19 into 20 minus 1 makes mental multiplication easy.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'To solve 25 times 33 times 4, click Pair (25 x 4) First!'}
                  {demoStep === 1 && 'Multiply 25 by 4 first to make a friendly 100! Now click Multiply by 33.'}
                  {demoStep === 2 && '100 times 33 equals 3300! Pairing 25 and 4 to make 100 makes the calculation instant.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Mental Strategies for Multiplication</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Whenever you see numbers like 25 and 4, or 50 and 2, pair them up first to make 100!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('nineteen_x_five');
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

export default MentalMultiplyPlayer;
