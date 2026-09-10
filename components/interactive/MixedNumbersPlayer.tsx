import React, { useState, useEffect, useCallback } from 'react';

export interface MixedNumbersPlayerProps {
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
    questionText: 'How do you convert the improper fraction 8/5 into a mixed number?',
    options: [
      '8/5 is 5/5 plus 3/5, which equals 1 and 3/5',
      '8/5 equals 8 wholes and 5 parts',
      '8/5 equals 3 and 5/8'
    ],
    correctIndex: 0,
    hint: '8/5 can be thought of as 5/5 (1 whole) plus 3/5, which equals the mixed number 1 and 3/5.'
  },
  {
    id: 2,
    questionText: 'Why does the mixed number 2 and 1/4 equal the improper fraction 9/4?',
    options: [
      'Because 2 wholes equal 8 fourths, plus 1 more fourth gives 9 fourths (2 × 4 + 1 = 9)',
      'Because 2 + 1 + 4 = 7 fourths',
      'Because 2 and 1/4 equals 21/4'
    ],
    correctIndex: 0,
    hint: 'To convert 2 and 1/4, multiply 2 wholes by 4 (8 fourths) and add 1 numerator: 8 + 1 = 9 fourths (9/4).'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember when working with improper fractions?',
    options: [
      'If the top is heavy, there is at least one whole hiding inside!',
      'Always throw away the remainder',
      'Improper fractions are always less than 1'
    ],
    correctIndex: 0,
    hint: 'If the top is heavy (numerator larger than denominator), there is at least one whole hiding inside!'
  }
];

export const MixedNumbersPlayer: React.FC<MixedNumbersPlayerProps> = ({
  conceptName = 'Concept 6.3: Improper Fractions and Mixed Numbers',
  unitTitle = 'Unit 6: Fractions, Decimals, Percentages and Proportion (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'improper_to_mixed' | 'mixed_to_improper'>('improper_to_mixed');
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
        'An improper fraction is a fraction where the numerator is equal to or greater than the denominator, meaning it has a value of 1 or more. A mixed number shows this same value using a whole number combined with a proper fraction. To change an improper fraction into a mixed number, divide the numerator by the denominator to get the whole number, and put the remainder over the denominator. If the top is heavy, there is at least one whole hiding inside!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'improper_to_mixed') {
        const desc =
          demoStep === 0
            ? 'Converting improper fraction 8/5 into a mixed number. Click Separate Wholes!'
            : demoStep === 1
            ? '8/5 can be thought of as 5/5 plus 3/5! 5/5 is 1 whole.'
            : '5/5 + 3/5 equals 1 and 3/5! If the top is heavy, there is at least one whole hiding inside!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Converting mixed number 2 and 1/4 into an improper fraction. Click Count All Fourths!'
            : demoStep === 1
            ? '2 wholes are equal to 8 fourths (2 × 4 = 8), plus 1 more fourth!'
            : '8 fourths plus 1 fourth gives 9 fourths (9/4)! Multiply whole number by denominator and add numerator.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Improper Fractions and Mixed Numbers! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'improper_to_mixed' | 'mixed_to_improper') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'improper_to_mixed') {
      safeNarrate('Converting improper fraction 8/5 into a mixed number. Click Separate Wholes!');
    } else {
      safeNarrate('Converting mixed number 2 and 1/4 into an improper fraction. Click Count All Fourths!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'improper_to_mixed') {
      const desc =
        next === 0
          ? 'Converting improper fraction 8/5 into a mixed number. Click Separate Wholes!'
          : next === 1
          ? '8/5 can be thought of as 5/5 plus 3/5! 5/5 is 1 whole.'
          : '5/5 + 3/5 equals 1 and 3/5! If the top is heavy, there is at least one whole hiding inside!';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Converting mixed number 2 and 1/4 into an improper fraction. Click Count All Fourths!'
          : next === 1
          ? '2 wholes are equal to 8 fourths (2 × 4 = 8), plus 1 more fourth!'
          : '8 fourths plus 1 fourth gives 9 fourths (9/4)! Multiply whole number by denominator and add numerator.';
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
              An <strong>improper fraction</strong> is a fraction where the <strong>numerator is equal to or greater than the denominator</strong>, meaning it has a value of 1 or more (like 7/5). 
              A <strong>mixed number</strong> shows this same value using a <strong>whole number combined with a proper fraction</strong>. 
              To change an improper fraction into a mixed number, divide the numerator by the denominator to get the whole number, and put the remainder over the denominator.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Improper Fraction to Mixed Number Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  8/5 can be thought of as 5/5 plus 3/5 = 1 and 3/5
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  If the top is heavy, there is at least one whole hiding inside!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                📦 8/5 = 1 3/5
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Mixed Number to Improper Fraction Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  2 and 1/4 equals 9/4 (2 wholes = 8 fourths + 1 fourth = 9 fourths)
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Multiply whole number by denominator and add numerator.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🍰 2 1/4 = 9/4
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Mixed Numbers Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('improper_to_mixed')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'improper_to_mixed'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              📦 8/5 ➔ 1 and 3/5
            </button>
            <button
              onClick={() => handleSelectDemoMode('mixed_to_improper')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'mixed_to_improper'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🍰 2 and 1/4 ➔ 9/4
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'improper_to_mixed' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Converting 8/5 into Mixed Number (1 and 3/5)
                </h3>

                {/* Shaded Fraction Bars Visualizer (Fifths) */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="flex flex-col gap-4 max-w-md mx-auto">
                    {/* Bar 1: 5/5 Whole */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-[#16241f] mb-1">
                        <span>First Whole (5/5 Fifths)</span>
                        <span>{demoStep >= 1 ? '1 Whole' : '5/5'}</span>
                      </div>
                      <div className="h-8 bg-white border-2 border-[#16241f] rounded-lg overflow-hidden flex">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 border-r border-[#16241f]/20 transition-all duration-300 ${
                              demoStep >= 1 ? 'bg-[#9c6f1f]' : 'bg-[#9c6f1f]/70'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Bar 2: 3/5 Remaining */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-[#16241f] mb-1">
                        <span>Remainder (3/5 Fifths)</span>
                        <span>3/5</span>
                      </div>
                      <div className="h-8 bg-white border-2 border-[#16241f] rounded-lg overflow-hidden flex">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 border-r border-[#16241f]/20 transition-all duration-300 ${
                              idx < 3 ? 'bg-[#9c6f1f]' : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f]/10 border border-[#9c6f1f]/30 rounded-xl text-xs font-bold text-[#9c6f1f] animate-fade-in">
                      ✨ 8/5 = 5/5 (1 whole) + 3/5!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      🎉 8/5 = 1 and 3/5! If the top is heavy, there is at least one whole hiding inside!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '📦 Step 1: Separate 5/5 Whole'
                    : demoStep === 1
                    ? '🎉 Step 2: Combine to 1 and 3/5'
                    : '🔄 Reset 8/5 Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Converting 2 and 1/4 into Improper Fraction (9/4)
                </h3>

                {/* Shaded Fraction Bars Visualizer (Fourths) */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="flex flex-col gap-3 max-w-md mx-auto">
                    {/* Whole 1: 4/4 */}
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-[10px] font-bold text-[#16241f] text-right">Whole 1 (4/4)</span>
                      <div className="flex-1 h-7 bg-white border-2 border-[#16241f] rounded-lg overflow-hidden flex">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <div key={idx} className="flex-1 bg-[#16241f] border-r border-white/30" />
                        ))}
                      </div>
                    </div>

                    {/* Whole 2: 4/4 */}
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-[10px] font-bold text-[#16241f] text-right">Whole 2 (4/4)</span>
                      <div className="flex-1 h-7 bg-white border-2 border-[#16241f] rounded-lg overflow-hidden flex">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <div key={idx} className="flex-1 bg-[#16241f] border-r border-white/30" />
                        ))}
                      </div>
                    </div>

                    {/* Fraction: 1/4 */}
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-[10px] font-bold text-[#16241f] text-right">Fraction (1/4)</span>
                      <div className="flex-1 h-7 bg-white border-2 border-[#16241f] rounded-lg overflow-hidden flex">
                        <div className="w-1/4 h-full bg-[#9c6f1f] border-r border-[#16241f]/30" />
                        <div className="w-1/4 h-full bg-transparent border-r border-[#16241f]/30" />
                        <div className="w-1/4 h-full bg-transparent border-r border-[#16241f]/30" />
                        <div className="w-1/4 h-full bg-transparent" />
                      </div>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f]/10 border border-[#16241f]/30 rounded-xl text-xs font-bold text-[#16241f] animate-fade-in">
                      🍰 2 wholes = 8 fourths (2 × 4 = 8), plus 1 more fourth!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 8 fourths + 1 fourth = 9 fourths (9/4)!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🍰 Step 1: Count Fourths in 2 Wholes (8)'
                    : demoStep === 1
                    ? '🎉 Step 2: Add 1 Fourth (9/4)'
                    : '🔄 Reset 2 and 1/4 Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'improper_to_mixed' ? (
                <>
                  {demoStep === 0 && 'Converting improper fraction 8/5 into a mixed number. Click Separate Wholes!'}
                  {demoStep === 1 && '8/5 can be thought of as 5/5 plus 3/5! 5/5 is 1 whole.'}
                  {demoStep === 2 && '5/5 + 3/5 equals 1 and 3/5! If the top is heavy, there is at least one whole hiding inside!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Converting mixed number 2 and 1/4 into an improper fraction. Click Count All Fourths!'}
                  {demoStep === 1 && '2 wholes are equal to 8 fourths (2 × 4 = 8), plus 1 more fourth!'}
                  {demoStep === 2 && '8 fourths plus 1 fourth gives 9 fourths (9/4)! Multiply whole number by denominator and add numerator.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Improper Fractions and Mixed Numbers</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              If the top is heavy, there is at least one whole hiding inside!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('improper_to_mixed');
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

export default MixedNumbersPlayer;
