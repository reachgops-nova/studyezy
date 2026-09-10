import React, { useState, useEffect, useCallback } from 'react';

export interface PartialProductsPlayerProps {
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
    questionText: 'To find 234 times 3 using partial products, what three parts do you add together?',
    options: [
      '600 + 90 + 12 = 702 (from 200×3, 30×3, and 4×3)',
      '200 + 30 + 4 = 234',
      '600 + 30 + 12 = 642'
    ],
    correctIndex: 0,
    hint: 'Multiply each place value part by 3: 200 × 3 = 600, 30 × 3 = 90, and 4 × 3 = 12, then sum them to get 702.'
  },
  {
    id: 2,
    questionText: 'To multiply 34 by 13 using an area model, what four partial products do you sum together?',
    options: [
      '300 + 30 + 40 + 13 = 383',
      '300 + 40 + 90 + 12 = 442',
      '300 + 400 + 90 + 12 = 802'
    ],
    correctIndex: 1,
    hint: 'Split 34 into 30 + 4 and 13 into 10 + 3. The four grid sections give 300 + 40 + 90 + 12 = 442.'
  },
  {
    id: 3,
    questionText: 'In column multiplication, what critical step must you remember when multiplying by the tens digit?',
    options: [
      'Always subtract 10 from the total',
      'Place a placeholder 0 in the ones column before multiplying by the tens digit',
      'Change all numbers to even numbers'
    ],
    correctIndex: 1,
    hint: 'Never forget the 0 in the ones column when you move on to multiply by the tens digit!'
  }
];

export const PartialProductsPlayer: React.FC<PartialProductsPlayerProps> = ({
  conceptName = 'Concept 3.5: Multiplying Numbers up to 1000',
  unitTitle = 'Unit 3: Calculation (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'partition_three_digit' | 'area_model_grid'>('partition_three_digit');
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
        'Multi-digit multiplication involves partitioning numbers into hundreds, tens, and ones, finding partial products, and adding them together. An area or grid model shows how each place value part multiplies with the other parts. In column multiplication, multiplying by the tens digit always requires placing a placeholder 0 in the ones column.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'partition_three_digit') {
        const desc =
          demoStep === 0
            ? 'To find 234 times 3, click Partition 234 to break it into hundreds, tens, and ones!'
            : demoStep === 1
            ? '234 is split into 200, 30, and 4. Multiply each part by 3: 200 times 3 is 600, 30 times 3 is 90, and 4 times 3 is 12!'
            : 'Adding up the partial products: 600 plus 90 plus 12 equals 702! Partitioning makes multi-digit multiplication clear and accurate.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'To multiply 34 by 13 using an area model, click Build Area Grid!'
            : demoStep === 1
            ? 'Split 34 into 30 plus 4 and 13 into 10 plus 3. The four grid sections give 300, 40, 90, and 12!'
            : 'Adding all four grid sections: 300 plus 40 plus 90 plus 12 equals 442! Never forget the 0 in the ones column when multiplying by the tens digit.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Multiplying Numbers up to 1000! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'partition_three_digit' | 'area_model_grid') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'partition_three_digit') {
      safeNarrate('To find 234 times 3, click Partition 234 to break it into hundreds, tens, and ones!');
    } else {
      safeNarrate('To multiply 34 by 13 using an area model, click Build Area Grid!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'partition_three_digit') {
      const desc =
        next === 0
          ? 'To find 234 times 3, click Partition 234 to break it into hundreds, tens, and ones!'
          : next === 1
          ? '234 is split into 200, 30, and 4. Multiply each part by 3: 200 times 3 is 600, 30 times 3 is 90, and 4 times 3 is 12!'
          : 'Adding up the partial products: 600 plus 90 plus 12 equals 702! Partitioning makes multi-digit multiplication clear and accurate.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'To multiply 34 by 13 using an area model, click Build Area Grid!'
          : next === 1
          ? 'Split 34 into 30 plus 4 and 13 into 10 plus 3. The four grid sections give 300, 40, 90, and 12!'
          : 'Adding all four grid sections: 300 plus 40 plus 90 plus 12 equals 442! Never forget the 0 in the ones column when multiplying by the tens digit.';
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
              Multi-digit multiplication involves partitioning numbers into hundreds, tens, and ones, finding partial products, and adding them together. 
              An <strong>area or grid model</strong> shows how each place value part multiplies with the other parts. 
              In <strong>column multiplication</strong>, multiplying by the tens digit always requires placing a <strong>placeholder 0 in the ones column</strong>.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  3-Digit by 1-Digit Example (234 × 3)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  (200 × 3) + (30 × 3) + (4 × 3) = 600 + 90 + 12 = 702
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Partition into hundreds, tens, and ones before multiplying.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                📦 600 + 90 + 12
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Area Model Example (34 × 13)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  (30 + 4) × (10 + 3) ➔ 300 + 40 + 90 + 12 = 442
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Grid of 4 partial products summed together.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🖼️ 300 + 40 + 90 + 12
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Partial Products Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('partition_three_digit')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'partition_three_digit'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              📦 234 × 3 (Partitioning)
            </button>
            <button
              onClick={() => handleSelectDemoMode('area_model_grid')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'area_model_grid'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🖼️ 34 × 13 (Area Grid)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'partition_three_digit' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Partitioning 234 × 3 into Hundreds, Tens, and Ones
                </h3>

                {/* Interactive Steps Display */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  {demoStep === 0 && (
                    <div className="flex justify-center items-center gap-3 text-2xl font-black text-[#16241f]">
                      <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">234</span>
                      <span>×</span>
                      <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">3</span>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="grid grid-cols-3 gap-2 w-full max-w-sm text-xs font-bold">
                        <div className="p-2.5 bg-[#9c6f1f]/10 border border-[#9c6f1f]/30 rounded-xl text-center">
                          <span className="text-[10px] text-[#9c6f1f] block uppercase">200 × 3</span>
                          <span className="text-base text-[#16241f] font-black">600</span>
                        </div>
                        <div className="p-2.5 bg-[#9c6f1f]/10 border border-[#9c6f1f]/30 rounded-xl text-center">
                          <span className="text-[10px] text-[#9c6f1f] block uppercase">30 × 3</span>
                          <span className="text-base text-[#16241f] font-black">90</span>
                        </div>
                        <div className="p-2.5 bg-[#9c6f1f]/10 border border-[#9c6f1f]/30 rounded-xl text-center">
                          <span className="text-[10px] text-[#9c6f1f] block uppercase">4 × 3</span>
                          <span className="text-base text-[#16241f] font-black">12</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#9c6f1f] mt-1">
                        ✨ 200×3 = 600, 30×3 = 90, 4×3 = 12!
                      </span>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex justify-center items-center gap-2 text-xl font-black text-[#16241f]">
                        <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">600</span>
                        <span>+</span>
                        <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">90</span>
                        <span>+</span>
                        <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">12</span>
                        <span>=</span>
                        <span className="p-3 bg-[#9c6f1f] text-white rounded-xl shadow-md">702</span>
                      </div>
                      <span className="text-xs font-bold text-[#16241f] mt-1">
                        🎉 Total Product: 234 × 3 = 702!
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '📦 Step 1: Partition 234 (200 + 30 + 4)'
                    : demoStep === 1
                    ? '➕ Step 2: Sum Partial Products (600 + 90 + 12)'
                    : '🔄 Reset 234 × 3 Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Area Model Grid: 34 × 13 = (30 + 4) × (10 + 3)
                </h3>

                {/* Interactive Area Grid Visual */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  {demoStep === 0 && (
                    <div className="flex justify-center items-center gap-3 text-2xl font-black text-[#16241f]">
                      <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">34</span>
                      <span>×</span>
                      <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">13</span>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="flex flex-col items-center gap-2">
                      {/* 2x2 Area Grid */}
                      <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto text-xs font-bold">
                        <div className="p-3 bg-white rounded-xl border-2 border-[#16241f]/20 text-center">
                          <span className="text-[10px] text-[#16241f]/50 block uppercase">30 × 10</span>
                          <span className="text-base font-black text-[#16241f]">300</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border-2 border-[#16241f]/20 text-center">
                          <span className="text-[10px] text-[#16241f]/50 block uppercase">4 × 10</span>
                          <span className="text-base font-black text-[#16241f]">40</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border-2 border-[#16241f]/20 text-center">
                          <span className="text-[10px] text-[#16241f]/50 block uppercase">30 × 3</span>
                          <span className="text-base font-black text-[#16241f]">90</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border-2 border-[#16241f]/20 text-center">
                          <span className="text-[10px] text-[#16241f]/50 block uppercase">4 × 3</span>
                          <span className="text-base font-black text-[#16241f]">12</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#16241f] mt-1">
                        🖼️ 4 grid sections: 300, 40, 90, and 12!
                      </span>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex justify-center items-center gap-1.5 text-sm font-black text-[#16241f]">
                        <span className="p-2 bg-white rounded-lg border border-[#16241f]/20">300</span>
                        <span>+</span>
                        <span className="p-2 bg-white rounded-lg border border-[#16241f]/20">40</span>
                        <span>+</span>
                        <span className="p-2 bg-white rounded-lg border border-[#16241f]/20">90</span>
                        <span>+</span>
                        <span className="p-2 bg-white rounded-lg border border-[#16241f]/20">12</span>
                        <span>=</span>
                        <span className="p-2 bg-[#16241f] text-white rounded-lg shadow-md">442</span>
                      </div>
                      <span className="text-xs font-bold text-[#16241f] mt-1">
                        🎉 Total Product: 34 × 13 = 442!
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🖼️ Step 1: Build Area Grid (30+4 × 10+3)'
                    : demoStep === 1
                    ? '➕ Step 2: Sum All 4 Sections (300+40+90+12)'
                    : '🔄 Reset 34 × 13 Grid Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'partition_three_digit' ? (
                <>
                  {demoStep === 0 && 'To find 234 times 3, click Partition 234 to break it into hundreds, tens, and ones!'}
                  {demoStep === 1 && '234 is split into 200, 30, and 4. Multiply each part by 3: 200 times 3 is 600, 30 times 3 is 90, and 4 times 3 is 12!'}
                  {demoStep === 2 && 'Adding up the partial products: 600 plus 90 plus 12 equals 702! Partitioning makes multi-digit multiplication clear and accurate.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'To multiply 34 by 13 using an area model, click Build Area Grid!'}
                  {demoStep === 1 && 'Split 34 into 30 plus 4 and 13 into 10 plus 3. The four grid sections give 300, 40, 90, and 12!'}
                  {demoStep === 2 && 'Adding all four grid sections: 300 plus 40 plus 90 plus 12 equals 442! Never forget the 0 in the ones column when multiplying by the tens digit.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Multiplying Numbers up to 1000</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Never forget the 0 in the ones column when you move on to multiply by the tens digit!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('partition_three_digit');
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

export default PartialProductsPlayer;
