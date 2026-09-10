import React, { useState, useEffect, useCallback } from 'react';

export interface RelatedFractionsPlayerProps {
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
    questionText: 'How do you calculate 2/5 + 3/10 when the denominators are different?',
    options: [
      'Convert 2/5 into 4/10, then add 4/10 + 3/10 to get 7/10',
      'Add the top and bottom numbers together to get 5/15',
      'Multiply 2/5 by 3/10 to get 6/50'
    ],
    correctIndex: 0,
    hint: 'Convert 2/5 to 4/10 (multiply top and bottom by 2) so both share denominator 10, then add 4/10 + 3/10 = 7/10.'
  },
  {
    id: 2,
    questionText: 'How do you solve 7/8 - 1/4?',
    options: [
      'Subtract bottom numbers to get 6/4',
      'Convert 1/4 into 2/8, then subtract 7/8 - 2/8 to get 5/8',
      'Add 7/8 and 1/4 together to get 8/12'
    ],
    correctIndex: 1,
    hint: 'Convert 1/4 into 2/8 (multiply top and bottom by 2), then subtract 7/8 - 2/8 = 5/8.'
  },
  {
    id: 3,
    questionText: 'What is the rule to remember when adding or subtracting fractions?',
    options: [
      'Match the bottoms first, then add or subtract only the tops!',
      'Always add the bottom numbers together',
      'Never match the denominators'
    ],
    correctIndex: 0,
    hint: 'Match the bottoms first, then add or subtract only the tops!'
  }
];

export const RelatedFractionsPlayer: React.FC<RelatedFractionsPlayerProps> = ({
  conceptName = 'Concept 6.5: Adding and Subtracting Related Fractions',
  unitTitle = 'Unit 6: Fractions, Decimals, Percentages and Proportion (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'addition' | 'subtraction'>('addition');
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
        'When adding or subtracting fractions, the parts must be the exact same size before you can combine them. If the denominators are different, you first convert one fraction into an equivalent fraction so both share a common denominator. Never add or subtract the bottom numbers together.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'addition') {
        const desc =
          demoStep === 0
            ? 'Calculating 2/5 + 3/10. Denominators are different (5 and 10). Click Match Denominators!'
            : demoStep === 1
            ? 'Convert 2/5 into 4/10 by multiplying top and bottom by 2! Now both fractions share the common denominator 10: 4/10 + 3/10.'
            : 'Add only the tops: 4 + 3 = 7, so 4/10 + 3/10 = 7/10! Match the bottoms first, then add or subtract only the tops!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Solving 7/8 - 1/4. Denominators are different (8 and 4). Click Match Denominators!'
            : demoStep === 1
            ? 'Convert 1/4 into 2/8 by multiplying top and bottom by 2! Now both fractions share denominator 8: 7/8 - 2/8.'
            : 'Subtract only the tops: 7 - 2 = 5, so 7/8 - 2/8 = 5/8! Match the bottoms first, then add or subtract only the tops!';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Adding and Subtracting Related Fractions! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'addition' | 'subtraction') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'addition') {
      safeNarrate('Calculating 2/5 + 3/10. Denominators are different (5 and 10). Click Match Denominators!');
    } else {
      safeNarrate('Solving 7/8 - 1/4. Denominators are different (8 and 4). Click Match Denominators!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'addition') {
      const desc =
        next === 0
          ? 'Calculating 2/5 + 3/10. Denominators are different (5 and 10). Click Match Denominators!'
          : next === 1
          ? 'Convert 2/5 into 4/10 by multiplying top and bottom by 2! Now both fractions share the common denominator 10: 4/10 + 3/10.'
          : 'Add only the tops: 4 + 3 = 7, so 4/10 + 3/10 = 7/10! Match the bottoms first, then add or subtract only the tops!';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Solving 7/8 - 1/4. Denominators are different (8 and 4). Click Match Denominators!'
          : next === 1
          ? 'Convert 1/4 into 2/8 by multiplying top and bottom by 2! Now both fractions share denominator 8: 7/8 - 2/8.'
          : 'Subtract only the tops: 7 - 2 = 5, so 7/8 - 2/8 = 5/8! Match the bottoms first, then add or subtract only the tops!';
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
              When <strong>adding or subtracting fractions</strong>, the parts must be the <strong>exact same size</strong> before you can combine them. 
              If the denominators are different, you first <strong>convert one fraction into an equivalent fraction</strong> so both share a common denominator. 
              <strong> Never add or subtract the bottom numbers together.</strong>
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Addition Example (2/5 + 3/10)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Convert 2/5 to 4/10 ➔ 4/10 + 3/10 = 7/10
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Match the bottoms first, then add only the tops!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                ➕ 7/10
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Subtraction Example (7/8 - 1/4)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Convert 1/4 to 2/8 ➔ 7/8 - 2/8 = 5/8
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Match the bottoms first, then subtract only the tops!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                ➖ 5/8
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Related Fractions Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('addition')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'addition'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ➕ Addition (2/5 + 3/10 ➔ 7/10)
            </button>
            <button
              onClick={() => handleSelectDemoMode('subtraction')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'subtraction'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ➖ Subtraction (7/8 - 1/4 ➔ 5/8)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'addition' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Adding 2/5 + 3/10 (Convert 2/5 to 4/10)
                </h3>

                {/* Visual Fraction Bars */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3 space-y-3">
                  {/* First Fraction: 2/5 or 4/10 */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-[#16241f] mb-1">
                      <span>First Fraction: {demoStep >= 1 ? '4/10 (converted from 2/5)' : '2/5'}</span>
                      <span>{demoStep >= 1 ? '4 Tenths' : '2 Fifths'}</span>
                    </div>
                    <div className="h-7 bg-white border-2 border-[#16241f] rounded-lg overflow-hidden flex">
                      {demoStep === 0
                        ? Array.from({ length: 5 }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`flex-1 border-r border-[#16241f]/20 ${
                                idx < 2 ? 'bg-[#9c6f1f]' : 'bg-transparent'
                              }`}
                            />
                          ))
                        : Array.from({ length: 10 }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`flex-1 border-r border-[#16241f]/20 ${
                                idx < 4 ? 'bg-[#9c6f1f]' : 'bg-transparent'
                              }`}
                            />
                          ))}
                    </div>
                  </div>

                  {/* Second Fraction: 3/10 */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-[#16241f] mb-1">
                      <span>Second Fraction: 3/10</span>
                      <span>3 Tenths</span>
                    </div>
                    <div className="h-7 bg-white border-2 border-[#16241f] rounded-lg overflow-hidden flex">
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 border-r border-[#16241f]/20 ${
                            idx < 3 ? 'bg-[#16241f]' : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Step 2 Combined Result Bar */}
                  {demoStep === 2 && (
                    <div className="pt-2 border-t border-[#16241f]/20 animate-fade-in">
                      <div className="flex justify-between text-[10px] font-bold text-[#9c6f1f] mb-1">
                        <span>Combined Total: 4/10 + 3/10</span>
                        <span>7/10</span>
                      </div>
                      <div className="h-8 bg-white border-2 border-[#9c6f1f] rounded-lg overflow-hidden flex shadow-sm">
                        {Array.from({ length: 10 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 border-r border-[#16241f]/20 ${
                              idx < 4 ? 'bg-[#9c6f1f]' : idx < 7 ? 'bg-[#16241f]' : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ✨ 2/5 converted to 4/10! Now both fractions share denominator 10.
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 4/10 + 3/10 = 7/10! Match the bottoms first, then add only the tops!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Match Denominators (2/5 ➔ 4/10)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Add Tops (4/10 + 3/10 = 7/10)'
                    : '🔄 Reset Addition Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Subtracting 7/8 - 1/4 (Convert 1/4 to 2/8)
                </h3>

                {/* Visual Fraction Bars */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3 space-y-3">
                  {/* First Fraction: 7/8 */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-[#16241f] mb-1">
                      <span>Start Fraction: 7/8</span>
                      <span>7 Eighths</span>
                    </div>
                    <div className="h-7 bg-white border-2 border-[#16241f] rounded-lg overflow-hidden flex">
                      {Array.from({ length: 8 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 border-r border-[#16241f]/20 ${
                            idx < 7 ? 'bg-[#16241f]' : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Second Fraction to Subtract: 1/4 or 2/8 */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-[#16241f] mb-1">
                      <span>Subtract Fraction: {demoStep >= 1 ? '2/8 (converted from 1/4)' : '1/4'}</span>
                      <span>{demoStep >= 1 ? '2 Eighths' : '1 Fourth'}</span>
                    </div>
                    <div className="h-7 bg-white border-2 border-[#16241f] rounded-lg overflow-hidden flex">
                      {demoStep === 0
                        ? Array.from({ length: 4 }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`flex-1 border-r border-[#16241f]/20 ${
                                idx < 1 ? 'bg-red-500/80' : 'bg-transparent'
                              }`}
                            />
                          ))
                        : Array.from({ length: 8 }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`flex-1 border-r border-[#16241f]/20 ${
                                idx < 2 ? 'bg-red-500/80' : 'bg-transparent'
                              }`}
                            />
                          ))}
                    </div>
                  </div>

                  {/* Step 2 Remaining Result Bar */}
                  {demoStep === 2 && (
                    <div className="pt-2 border-t border-[#16241f]/20 animate-fade-in">
                      <div className="flex justify-between text-[10px] font-bold text-[#9c6f1f] mb-1">
                        <span>Remaining Result: 7/8 - 2/8</span>
                        <span>5/8</span>
                      </div>
                      <div className="h-8 bg-white border-2 border-[#9c6f1f] rounded-lg overflow-hidden flex shadow-sm">
                        {Array.from({ length: 8 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 border-r border-[#16241f]/20 ${
                              idx < 5 ? 'bg-[#9c6f1f]' : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ✨ 1/4 converted to 2/8! Now both fractions share denominator 8.
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 7/8 - 2/8 = 5/8! Match the bottoms first, then subtract only the tops!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Match Denominators (1/4 ➔ 2/8)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Subtract Tops (7/8 - 2/8 = 5/8)'
                    : '🔄 Reset Subtraction Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'addition' ? (
                <>
                  {demoStep === 0 && 'Calculating 2/5 + 3/10. Denominators are different (5 and 10). Click Match Denominators!'}
                  {demoStep === 1 && 'Convert 2/5 into 4/10 by multiplying top and bottom by 2! Now both fractions share the common denominator 10: 4/10 + 3/10.'}
                  {demoStep === 2 && 'Add only the tops: 4 + 3 = 7, so 4/10 + 3/10 = 7/10! Match the bottoms first, then add or subtract only the tops!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Solving 7/8 - 1/4. Denominators are different (8 and 4). Click Match Denominators!'}
                  {demoStep === 1 && 'Convert 1/4 into 2/8 by multiplying top and bottom by 2! Now both fractions share denominator 8: 7/8 - 2/8.'}
                  {demoStep === 2 && 'Subtract only the tops: 7 - 2 = 5, so 7/8 - 2/8 = 5/8! Match the bottoms first, then add or subtract only the tops!'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Adding and Subtracting Related Fractions</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Match the bottoms first, then add or subtract only the tops!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('addition');
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

export default RelatedFractionsPlayer;
