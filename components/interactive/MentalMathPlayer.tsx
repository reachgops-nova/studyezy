import React, { useState, useEffect, useCallback } from 'react';

export interface MentalMathPlayerProps {
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
    questionText: 'To add 94 + 2328 + 306 mentally, what is the best strategy?',
    options: [
      'Swap the order to add 94 and 306 first to make 400, then add 2328 to get 2728',
      'Add 2328 and 94 first to make 2422, then add 306',
      'Round all numbers to 1000 before adding'
    ],
    correctIndex: 0,
    hint: 'Look for friendly pairs that make round hundreds! 94 + 306 = 400, then 400 + 2328 = 2728.'
  },
  {
    id: 2,
    questionText: 'How can you estimate 3804 + 2043 before calculating?',
    options: [
      'Round to 4000 + 3000 to get 7000',
      'Round to 3800 + 2000 to know the result is close to 5800',
      'Round to 3000 + 2000 to get 5000'
    ],
    correctIndex: 1,
    hint: 'Rounding 3804 to 3800 and 2043 to 2000 gives an estimate of 5800.'
  },
  {
    id: 3,
    questionText: 'What mental trick works quickly when subtracting near-multiples like 499?',
    options: [
      'Subtract 500 instead of 499, then add 1 back',
      'Subtract 400 first, then subtract 90, then subtract 9',
      'Add 500 first, then subtract 1'
    ],
    correctIndex: 0,
    hint: 'Near-multiples can be adjusted quickly by subtracting 500 instead of 499, then adding 1 back.'
  }
];

export const MentalMathPlayer: React.FC<MentalMathPlayerProps> = ({
  conceptName = 'Concept 3.2: Addition, Subtraction, and Estimation',
  unitTitle = 'Unit 3: Calculation (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'reorder_add' | 'estimate_round'>('reorder_add');
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
        'We can reorder or break apart numbers to calculate more easily in our heads, and round numbers beforehand to estimate if an answer makes sense. Addition is flexible: you can swap the order of addends to pair up friendly numbers that make round tens or hundreds. Look for pairs of digits that add up to 10 before you start adding in order.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'reorder_add') {
        const desc =
          demoStep === 0
            ? 'To add 94 + 2328 + 306, click Swap Friendly Pair to pair up 94 and 306 first!'
            : demoStep === 1
            ? 'Swapped order to pair 94 and 306! 94 plus 306 makes a friendly 400.'
            : '400 plus 2328 equals 2728! Reordering friendly addends makes mental addition easy.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'To estimate 3804 + 2043, click Round Numbers to simplify the problem!'
            : demoStep === 1
            ? 'Rounded 3804 to 3800 and 2043 to 2000! Now click Calculate Estimate.'
            : '3800 plus 2000 equals 5800! Rounding gives a quick estimate close to the exact total.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Addition, Subtraction, and Estimation! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'reorder_add' | 'estimate_round') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'reorder_add') {
      safeNarrate('To add 94 + 2328 + 306, click Swap Friendly Pair to pair up 94 and 306 first!');
    } else {
      safeNarrate('To estimate 3804 + 2043, click Round Numbers to simplify the problem!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'reorder_add') {
      const desc =
        next === 0
          ? 'To add 94 + 2328 + 306, click Swap Friendly Pair to pair up 94 and 306 first!'
          : next === 1
          ? 'Swapped order to pair 94 and 306! 94 plus 306 makes a friendly 400.'
          : '400 plus 2328 equals 2728! Reordering friendly addends makes mental addition easy.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'To estimate 3804 + 2043, click Round Numbers to simplify the problem!'
          : next === 1
          ? 'Rounded 3804 to 3800 and 2043 to 2000! Now click Calculate Estimate.'
          : '3800 plus 2000 equals 5800! Rounding gives a quick estimate close to the exact total.';
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
              Core Definition & Strategies
            </h3>
            <p className="text-sm leading-relaxed text-[#16241f]">
              We can reorder or break apart numbers to calculate more easily in our heads, and round numbers beforehand to estimate if an answer makes sense. 
              <strong> Addition is flexible:</strong> you can swap the order of addends to pair up friendly numbers that make round tens or hundreds. 
              <strong> Near-multiples</strong> can be adjusted quickly (like subtracting 500 instead of 499, then adding 1 back). 
              <strong> Rounding large numbers</strong> before calculating gives a quick estimate to spot mistakes.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Friendly Pair Addition
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  94 + 2328 + 306 ➔ (94 + 306) + 2328
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Pair 94 and 306 first to make 400, then add 2328 to get 2728.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                🤝 94 + 306 = 400
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Estimation Strategy
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  3804 + 2043 ➔ 3800 + 2000
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Round to 3800 + 2000 to know the result is close to 5800.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🎯 ~ 5800
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Mental Math Strategies ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('reorder_add')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'reorder_add'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🔄 Reorder (94 + 2328 + 306)
            </button>
            <button
              onClick={() => handleSelectDemoMode('estimate_round')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'estimate_round'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🎯 Estimate (3804 + 2043)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'reorder_add' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Reordering Addends to Make Round Hundreds
                </h3>

                {/* Addition Card Sequence */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  {demoStep === 0 && (
                    <div className="flex justify-center items-center gap-2 text-lg font-black text-[#16241f]">
                      <span className="p-3 bg-white rounded-lg border border-[#16241f]/20">94</span>
                      <span>+</span>
                      <span className="p-3 bg-white rounded-lg border border-[#16241f]/20">2328</span>
                      <span>+</span>
                      <span className="p-3 bg-white rounded-lg border border-[#16241f]/20">306</span>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex justify-center items-center gap-2 text-lg font-black">
                        <span className="p-3 bg-[#9c6f1f]/20 text-[#9c6f1f] rounded-lg border-2 border-[#9c6f1f]">94</span>
                        <span className="text-[#9c6f1f]">+</span>
                        <span className="p-3 bg-[#9c6f1f]/20 text-[#9c6f1f] rounded-lg border-2 border-[#9c6f1f]">306</span>
                        <span className="text-[#16241f]">+</span>
                        <span className="p-3 bg-white text-[#16241f] rounded-lg border border-[#16241f]/20">2328</span>
                      </div>
                      <span className="text-xs font-bold text-[#9c6f1f] mt-1">
                        ✨ 4 + 6 = 10! Pair 94 and 306 first to make 400!
                      </span>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex justify-center items-center gap-2 text-xl font-black text-[#16241f]">
                        <span className="p-3 bg-[#9c6f1f] text-white rounded-lg shadow-sm">400</span>
                        <span>+</span>
                        <span className="p-3 bg-white border border-[#16241f]/20 rounded-lg">2328</span>
                        <span>=</span>
                        <span className="p-3 bg-[#16241f] text-white rounded-lg shadow-md">2728</span>
                      </div>
                      <span className="text-xs font-bold text-[#16241f] mt-1">
                        🎉 Easy mental math: 400 + 2328 = 2728!
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🔄 Step 1: Swap Friendly Pair (94 + 306)'
                    : demoStep === 1
                    ? '➕ Step 2: Add 400 + 2328'
                    : '🔄 Reset Addition Strategy'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Rounding Numbers Beforehand to Estimate
                </h3>

                {/* Estimation Visual */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  {demoStep === 0 && (
                    <div className="flex justify-center items-center gap-3 text-lg font-black text-[#16241f]">
                      <span className="p-3 bg-white rounded-lg border border-[#16241f]/20">3804</span>
                      <span>+</span>
                      <span className="p-3 bg-white rounded-lg border border-[#16241f]/20">2043</span>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex justify-center items-center gap-3 text-lg font-black text-[#9c6f1f]">
                        <div className="text-center">
                          <span className="text-[10px] text-[#16241f]/50 block uppercase">3804 ➔</span>
                          <span className="p-3 bg-[#9c6f1f]/10 rounded-lg border border-[#9c6f1f]/30 inline-block">3800</span>
                        </div>
                        <span className="mt-4">+</span>
                        <div className="text-center">
                          <span className="text-[10px] text-[#16241f]/50 block uppercase">2043 ➔</span>
                          <span className="p-3 bg-[#9c6f1f]/10 rounded-lg border border-[#9c6f1f]/30 inline-block">2000</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#9c6f1f]">
                        🎯 Rounded to nearest hundred for quick estimation!
                      </span>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex justify-center items-center gap-2 text-xl font-black text-[#16241f]">
                        <span className="p-3 bg-white rounded-lg border border-[#16241f]/20">3800</span>
                        <span>+</span>
                        <span className="p-3 bg-white rounded-lg border border-[#16241f]/20">2000</span>
                        <span>=</span>
                        <span className="p-3 bg-[#16241f] text-white rounded-lg shadow-md">5800</span>
                      </div>
                      <span className="text-xs font-bold text-[#16241f]">
                        Result is close to 5800! (Exact total is 5847).
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🎯 Step 1: Round to 3800 + 2000'
                    : demoStep === 1
                    ? '📊 Step 2: Calculate Estimate (5800)'
                    : '🔄 Reset Estimation Strategy'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'reorder_add' ? (
                <>
                  {demoStep === 0 && 'To add 94 + 2328 + 306, click Swap Friendly Pair to pair up 94 and 306 first!'}
                  {demoStep === 1 && 'Swapped order to pair 94 and 306! 94 plus 306 makes a friendly 400.'}
                  {demoStep === 2 && '400 plus 2328 equals 2728! Reordering friendly addends makes mental addition easy.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'To estimate 3804 + 2043, click Round Numbers to simplify the problem!'}
                  {demoStep === 1 && 'Rounded 3804 to 3800 and 2043 to 2000! Now click Calculate Estimate.'}
                  {demoStep === 2 && '3800 plus 2000 equals 5800! Rounding gives a quick estimate close to the exact total.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Addition, Subtraction, and Estimation</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Look for pairs of digits that add up to 10 before you start adding in order.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('reorder_add');
                setDemoStep(0);
              }}
              className="py-3 px-6 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
            >
              🔄 Replay Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalMathPlayer;
