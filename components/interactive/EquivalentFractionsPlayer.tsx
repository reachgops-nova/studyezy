import React, { useState, useEffect, useCallback } from 'react';

export interface EquivalentFractionsPlayerProps {
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
    questionText: 'Shading 2 out of 4 parts of a rectangle covers the exact same area as shading how many parts of a 2-part rectangle?',
    options: [
      '1 out of 2 parts (so 2/4 equals 1/2)',
      '2 out of 2 parts',
      '3 out of 2 parts'
    ],
    correctIndex: 0,
    hint: 'Shading 2 out of 4 parts of a rectangle covers the exact same area as shading 1 out of 2 parts, so 2/4 equals 1/2.'
  },
  {
    id: 2,
    questionText: 'Why are the fractions 4/6 and 6/9 equivalent?',
    options: [
      'Because both simplify to 2/3 when you divide top and bottom by their common factors',
      'Because 4 + 6 equals 6 + 9',
      'Because they have the same numerator'
    ],
    correctIndex: 0,
    hint: '4/6 simplifies to 2/3 (divide top and bottom by 2) and 6/9 simplifies to 2/3 (divide top and bottom by 3), so both name the exact same value!'
  },
  {
    id: 3,
    questionText: 'What is the golden rule to remember when finding equivalent fractions?',
    options: [
      'Whatever you do to the top, you must do to the bottom to keep the fraction balanced',
      'Always add 1 to both the top and bottom numbers',
      'Only multiply the numerator and leave the denominator alone'
    ],
    correctIndex: 0,
    hint: 'Whatever you do to the top, you must do to the bottom to keep the fraction balanced.'
  }
];

export const EquivalentFractionsPlayer: React.FC<EquivalentFractionsPlayerProps> = ({
  conceptName = 'Concept 6.2: Equivalent Fractions',
  unitTitle = 'Unit 6: Fractions, Decimals, Percentages and Proportion (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'rectangle_shading' | 'simplifying_fractions'>('rectangle_shading');
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
        'Equivalent fractions are different fractions that name the exact same value or amount of a whole. Even though they have different numerators and denominators, they take up the same space on a shape or number line. You can find an equivalent fraction by multiplying or dividing both the top and bottom numbers by the same non-zero number. Whatever you do to the top, you must do to the bottom to keep the fraction balanced.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'rectangle_shading') {
        const desc =
          demoStep === 0
            ? 'Shading 1 out of 2 parts of a rectangle covers 1/2 of the shape. Click Multiply Top and Bottom by 2!'
            : demoStep === 1
            ? 'Shading 2 out of 4 parts covers the exact same area as 1/2, so 2/4 equals 1/2!'
            : 'Whatever you do to the top, you must do to the bottom to keep the fraction balanced! 1/2 = 2/4 = 3/6.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'The fractions 4/6 and 6/9 both represent the same point on a number line. Click Simplify Both Fractions!'
            : demoStep === 1
            ? 'Divide 4 and 6 by 2 to get 2/3, and divide 6 and 9 by 3 to get 2/3!'
            : 'Both 4/6 and 6/9 simplify to 2/3! A fraction is in its simplest form when numerator and denominator share no common factor other than 1.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Equivalent Fractions! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'rectangle_shading' | 'simplifying_fractions') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'rectangle_shading') {
      safeNarrate('Shading 1 out of 2 parts of a rectangle covers 1/2 of the shape. Click Multiply Top and Bottom by 2!');
    } else {
      safeNarrate('The fractions 4/6 and 6/9 both represent the same point on a number line. Click Simplify Both Fractions!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'rectangle_shading') {
      const desc =
        next === 0
          ? 'Shading 1 out of 2 parts of a rectangle covers 1/2 of the shape. Click Multiply Top and Bottom by 2!'
          : next === 1
          ? 'Shading 2 out of 4 parts covers the exact same area as 1/2, so 2/4 equals 1/2!'
          : 'Whatever you do to the top, you must do to the bottom to keep the fraction balanced! 1/2 = 2/4 = 3/6.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'The fractions 4/6 and 6/9 both represent the same point on a number line. Click Simplify Both Fractions!'
          : next === 1
          ? 'Divide 4 and 6 by 2 to get 2/3, and divide 6 and 9 by 3 to get 2/3!'
          : 'Both 4/6 and 6/9 simplify to 2/3! A fraction is in its simplest form when numerator and denominator share no common factor other than 1.';
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
              <strong>Equivalent fractions</strong> are different fractions that name the <strong>exact same value or amount</strong> of a whole. 
              Even though they have different numerators and denominators, they take up the <strong>same space on a shape or number line</strong>. 
              You can find an equivalent fraction by multiplying or dividing both the top and bottom numbers by the same non-zero number.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Rectangle Area Shading Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Shading 2 out of 4 parts covers the exact same area as 1 out of 2 parts
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  So 2/4 equals 1/2!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                🖼️ 2/4 = 1/2
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Simplifying Fractions Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  4/6 and 6/9 are equivalent because both simplify to 2/3
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Divide top and bottom by common factors to simplify!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🔢 4/6 = 6/9 = 2/3
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Equivalent Fractions Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('rectangle_shading')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'rectangle_shading'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🖼️ Area Shading (1/2 = 2/4 = 3/6)
            </button>
            <button
              onClick={() => handleSelectDemoMode('simplifying_fractions')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'simplifying_fractions'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🔢 Simplifying (4/6 = 6/9 = 2/3)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'rectangle_shading' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Rectangle Area Shading: 1/2 vs 2/4 vs 3/6
                </h3>

                {/* Interactive Visual Shaded Rectangles */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="flex flex-col gap-3 max-w-md mx-auto">
                    {/* Rectangle 1: 1/2 */}
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-xs font-bold text-[#16241f] text-right">1/2</span>
                      <div className="flex-1 h-8 bg-white border-2 border-[#16241f] rounded-lg overflow-hidden flex">
                        <div className="w-1/2 h-full bg-[#9c6f1f]" />
                        <div className="w-1/2 h-full bg-transparent" />
                      </div>
                    </div>

                    {/* Rectangle 2: 2/4 */}
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-xs font-bold text-[#16241f] text-right">2/4</span>
                      <div className="flex-1 h-8 bg-white border-2 border-[#16241f] rounded-lg overflow-hidden flex">
                        <div className="w-1/4 h-full bg-[#9c6f1f] border-r border-[#16241f]/30" />
                        <div className="w-1/4 h-full bg-[#9c6f1f] border-r border-[#16241f]/30" />
                        <div className="w-1/4 h-full bg-transparent border-r border-[#16241f]/30" />
                        <div className="w-1/4 h-full bg-transparent" />
                      </div>
                    </div>

                    {/* Rectangle 3: 3/6 */}
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-xs font-bold text-[#16241f] text-right">3/6</span>
                      <div className="flex-1 h-8 bg-white border-2 border-[#16241f] rounded-lg overflow-hidden flex">
                        <div className="w-1/6 h-full bg-[#9c6f1f] border-r border-[#16241f]/30" />
                        <div className="w-1/6 h-full bg-[#9c6f1f] border-r border-[#16241f]/30" />
                        <div className="w-1/6 h-full bg-[#9c6f1f] border-r border-[#16241f]/30" />
                        <div className="w-1/6 h-full bg-transparent border-r border-[#16241f]/30" />
                        <div className="w-1/6 h-full bg-transparent border-r border-[#16241f]/30" />
                        <div className="w-1/6 h-full bg-transparent" />
                      </div>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f]/10 border border-[#9c6f1f]/30 rounded-xl text-xs font-bold text-[#9c6f1f] animate-fade-in">
                      ✨ Notice how 1/2, 2/4, and 3/6 cover the exact same shaded area!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ⚖️ Golden Rule: Whatever you do to the top (multiply/divide by 2 or 3), you must do to the bottom!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🖼️ Step 1: See 2/4 Equals 1/2'
                    : demoStep === 1
                    ? '⚖️ Step 2: Keep Fractions Balanced'
                    : '🔄 Reset Area Shading Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Simplifying Fractions: 4/6 and 6/9 both equal 2/3
                </h3>

                {/* Interactive Visualizer for 4/6, 6/9, 2/3 */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="flex flex-col items-center gap-4">
                    <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                      {/* 4/6 Box */}
                      <div className="p-3 bg-white border border-[#16241f]/20 rounded-xl text-center shadow-xs">
                        <span className="text-[10px] font-bold text-[#16241f]/60 block uppercase">Fraction 1</span>
                        <span className="text-lg font-black text-[#16241f]">4/6</span>
                        <span className="text-[10px] font-bold text-[#9c6f1f] block mt-1">÷ 2 / ÷ 2</span>
                        <span className="text-xs font-bold text-[#16241f] block mt-0.5">= 2/3</span>
                      </div>

                      {/* 6/9 Box */}
                      <div className="p-3 bg-white border border-[#16241f]/20 rounded-xl text-center shadow-xs">
                        <span className="text-[10px] font-bold text-[#16241f]/60 block uppercase">Fraction 2</span>
                        <span className="text-lg font-black text-[#16241f]">6/9</span>
                        <span className="text-[10px] font-bold text-[#9c6f1f] block mt-1">÷ 3 / ÷ 3</span>
                        <span className="text-xs font-bold text-[#16241f] block mt-0.5">= 2/3</span>
                      </div>

                      {/* Simplest Form Box */}
                      <div className="p-3 bg-[#9c6f1f] text-white rounded-xl text-center shadow-sm">
                        <span className="text-[10px] font-bold uppercase block opacity-80">Simplest Form</span>
                        <span className="text-lg font-black">2/3</span>
                        <span className="text-[10px] font-bold block mt-1">No common factor</span>
                        <span className="text-[10px] font-bold block mt-0.5">other than 1</span>
                      </div>
                    </div>

                    {demoStep === 1 && (
                      <div className="p-2.5 bg-[#16241f]/10 border border-[#16241f]/30 rounded-xl text-xs font-bold text-[#16241f] animate-fade-in">
                        🔢 Dividing 4 & 6 by 2 gives 2/3. Dividing 6 & 9 by 3 gives 2/3.
                      </div>
                    )}

                    {demoStep === 2 && (
                      <div className="p-2.5 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                        🌟 Both 4/6 and 6/9 simplify to 2/3 and occupy the exact same point on a number line!
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🔢 Step 1: Simplify Both Fractions (÷ 2 and ÷ 3)'
                    : demoStep === 1
                    ? '🌟 Step 2: Confirm Simplest Form (2/3)'
                    : '🔄 Reset Simplifying Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'rectangle_shading' ? (
                <>
                  {demoStep === 0 && 'Shading 1 out of 2 parts of a rectangle covers 1/2 of the shape. Click Multiply Top and Bottom by 2!'}
                  {demoStep === 1 && 'Shading 2 out of 4 parts covers the exact same area as 1/2, so 2/4 equals 1/2!'}
                  {demoStep === 2 && 'Whatever you do to the top, you must do to the bottom to keep the fraction balanced! 1/2 = 2/4 = 3/6.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'The fractions 4/6 and 6/9 both represent the same point on a number line. Click Simplify Both Fractions!'}
                  {demoStep === 1 && 'Divide 4 and 6 by 2 to get 2/3, and divide 6 and 9 by 3 to get 2/3!'}
                  {demoStep === 2 && 'Both 4/6 and 6/9 simplify to 2/3! A fraction is in its simplest form when numerator and denominator share no common factor other than 1.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Equivalent Fractions</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Whatever you do to the top, you must do to the bottom to keep the fraction balanced.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('rectangle_shading');
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

export default EquivalentFractionsPlayer;
