import React, { useState, useEffect, useCallback } from 'react';

export interface FractionOfQuantityPlayerProps {
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
    questionText: 'To calculate 3/10 of $50, what are the two steps you should take?',
    options: [
      'Divide $50 by 10 to get $5 (for 1/10), then multiply $5 by 3 to get $15',
      'Multiply $50 by 10, then divide by 3',
      'Add $50 and 3, then subtract 10'
    ],
    correctIndex: 0,
    hint: 'Divide by the denominator to find 1 part ($50 ÷ 10 = $5), then multiply by the numerator ($5 × 3 = $15).'
  },
  {
    id: 2,
    questionText: 'If 1/8 of a bag of marbles contains 4 marbles, how many marbles are in the entire bag?',
    options: [
      '12 marbles',
      '32 marbles (4 multiplied by 8)',
      '2 marbles'
    ],
    correctIndex: 1,
    hint: 'If 1/8 is 4 marbles, multiply 4 by the denominator 8 to find the total whole: 4 × 8 = 32 marbles.'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember when calculating fractions of quantities or finding the whole?',
    options: [
      'Always add the top and bottom numbers together',
      'Divide by the bottom to find one part, multiply by the top to get what you need',
      'Subtract the numerator from the denominator'
    ],
    correctIndex: 1,
    hint: 'Divide by the bottom to find one part, multiply by the top to get what you need.'
  }
];

export const FractionOfQuantityPlayer: React.FC<FractionOfQuantityPlayerProps> = ({
  conceptName = 'Concept 6.4: Fractions of Quantities and Finding the Whole',
  unitTitle = 'Unit 6: Fractions, Decimals, Percentages and Proportion (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'finding_part' | 'finding_whole'>('finding_part');
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
        'You can use fractions to calculate a part of a set amount, or work backwards from a known fraction to find the original whole amount. To find a fraction of a quantity, divide by the denominator to find one equal part, then multiply by the numerator. If you know the value of a unit fraction, multiply that value by the denominator to find the total whole.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'finding_part') {
        const desc =
          demoStep === 0
            ? 'Finding 3/10 of $50. Click Step 1 to divide by the bottom number!'
            : demoStep === 1
            ? 'First, divide $50 by 10 to find 1/10 = $5 per part! Now click Step 2 to multiply by the top number.'
            : 'Next, multiply $5 by 3 to get $15! 3/10 of $50 is $15. Divide by the bottom to find one part, multiply by the top to get what you need.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Finding the whole bag of marbles when 1/8 of the bag equals 4 marbles. Click Step 1 to identify 1 part!'
            : demoStep === 1
            ? '1/8 of the bag is 4 marbles. Click Step 2 to scale up to the entire bag (8/8)!'
            : 'If 1/8 is 4 marbles, multiply 4 by 8 to get 32 marbles in the entire bag! Working backwards scales 1 unit fraction up to the total whole.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Fractions of Quantities and Finding the Whole! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'finding_part' | 'finding_whole') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'finding_part') {
      safeNarrate('Finding 3/10 of $50. Click Step 1 to divide by the bottom number!');
    } else {
      safeNarrate('Finding the whole bag of marbles when 1/8 of the bag equals 4 marbles. Click Step 1 to identify 1 part!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'finding_part') {
      const desc =
        next === 0
          ? 'Finding 3/10 of $50. Click Step 1 to divide by the bottom number!'
          : next === 1
          ? 'First, divide $50 by 10 to find 1/10 = $5 per part! Now click Step 2 to multiply by the top number.'
          : 'Next, multiply $5 by 3 to get $15! 3/10 of $50 is $15. Divide by the bottom to find one part, multiply by the top to get what you need.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Finding the whole bag of marbles when 1/8 of the bag equals 4 marbles. Click Step 1 to identify 1 part!'
          : next === 1
          ? '1/8 of the bag is 4 marbles. Click Step 2 to scale up to the entire bag (8/8)!'
          : 'If 1/8 is 4 marbles, multiply 4 by 8 to get 32 marbles in the entire bag! Working backwards scales 1 unit fraction up to the total whole.';
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
              You can use fractions to <strong>calculate a part of a set amount</strong>, or <strong>work backwards from a known fraction</strong> to find the original whole amount. 
              To find a fraction of a quantity, <strong>divide by the denominator</strong> to find one equal part, then <strong>multiply by the numerator</strong>. 
              If you know the value of a unit fraction, multiply that value by the denominator to find the total whole.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Finding 3/10 of $50
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  $50 ÷ 10 = $5 (1/10) ➔ $5 × 3 = $15 (3/10)
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Divide by denominator, multiply by numerator.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                💵 $15
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Finding Whole from 1/8 = 4 Marbles
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  If 1/8 is 4 marbles ➔ 4 × 8 = 32 total marbles
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Multiply unit fraction value by denominator to find the whole.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🔮 32 Marbles
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Fraction Quantity Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('finding_part')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'finding_part'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              💵 Finding Part: 3/10 of $50 ($15)
            </button>
            <button
              onClick={() => handleSelectDemoMode('finding_whole')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'finding_whole'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🔮 Finding Whole: 1/8 = 4 (32 Marbles)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'finding_part' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Finding 3/10 of $50 Quantity
                </h3>

                {/* 10 Equal $5 Blocks Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <span className="text-xs font-bold text-[#16241f] block mb-2">
                    Total Quantity = $50 (Split into 10 Equal Tenths)
                  </span>
                  
                  <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                    {Array.from({ length: 10 }).map((_, idx) => {
                      const isHighlighted = idx < 3 && demoStep === 2;
                      const isSingleStep = idx === 0 && demoStep === 1;

                      let blockStyle = 'bg-white text-[#16241f] border-[#16241f]/20';
                      if (isHighlighted) {
                        blockStyle = 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md scale-105';
                      } else if (isSingleStep) {
                        blockStyle = 'bg-[#16241f] text-white border-[#16241f] shadow-md scale-105';
                      }

                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl border-2 font-black text-xs transition-all duration-300 flex flex-col items-center justify-center ${blockStyle}`}
                        >
                          <span>$5</span>
                          <span className="text-[9px] font-medium opacity-80">1/10</span>
                        </div>
                      );
                    })}
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      1️⃣ Divide by bottom: $50 ÷ 10 = $5 per part (1/10)!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      2️⃣ Multiply by top: $5 × 3 = $15 total for 3/10!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Divide $50 by 10 ($5 per part)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Multiply $5 by 3 ($15 total)'
                    : '🔄 Reset $50 Quantity Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Finding Whole Bag from 1/8 = 4 Marbles
                </h3>

                {/* 8 Groups of 4 Marbles Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <span className="text-xs font-bold text-[#16241f] block mb-2">
                    1/8 of Bag = 4 Marbles ➔ Scaling up to 8/8 (Whole Bag)
                  </span>

                  <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                    {Array.from({ length: 8 }).map((_, gIdx) => {
                      const isActiveGroup = demoStep === 1 ? gIdx === 0 : demoStep === 2;

                      return (
                        <div
                          key={gIdx}
                          className={`p-2 rounded-xl border-2 transition-all duration-300 flex flex-col items-center ${
                            isActiveGroup
                              ? 'bg-[#16241f] text-white border-[#16241f] shadow-md'
                              : 'bg-white text-[#16241f] border-[#16241f]/20 opacity-40'
                          }`}
                        >
                          <span className="text-[9px] font-bold uppercase block opacity-80 mb-1">
                            Group {gIdx + 1} (1/8)
                          </span>
                          <div className="flex gap-1 justify-center">
                            {Array.from({ length: 4 }).map((_, mIdx) => (
                              <span key={mIdx} className="text-xs">
                                🔮
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] font-black mt-1">4 Marbles</span>
                        </div>
                      );
                    })}
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      1️⃣ 1/8 of the bag contains 4 marbles.
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      2️⃣ Multiply by 8: 4 marbles × 8 groups = 32 total marbles in the bag!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Identify 1/8 = 4 Marbles'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Scale up to 8/8 (4 × 8 = 32)'
                    : '🔄 Reset Marbles Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'finding_part' ? (
                <>
                  {demoStep === 0 && 'Finding 3/10 of $50. Click Step 1 to divide by the bottom number!'}
                  {demoStep === 1 && 'First, divide $50 by 10 to find 1/10 = $5 per part! Now click Step 2 to multiply by the top number.'}
                  {demoStep === 2 && 'Next, multiply $5 by 3 to get $15! 3/10 of $50 is $15. Divide by the bottom to find one part, multiply by the top to get what you need.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Finding the whole bag of marbles when 1/8 of the bag equals 4 marbles. Click Step 1 to identify 1 part!'}
                  {demoStep === 1 && '1/8 of the bag is 4 marbles. Click Step 2 to scale up to the entire bag (8/8)!'}
                  {demoStep === 2 && 'If 1/8 is 4 marbles, multiply 4 by 8 to get 32 marbles in the entire bag! Working backwards scales 1 unit fraction up to the total whole.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Fractions of Quantities and Finding the Whole</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Divide by the bottom to find one part, multiply by the top to get what you need.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('finding_part');
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

export default FractionOfQuantityPlayer;
