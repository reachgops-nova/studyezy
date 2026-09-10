import React, { useState, useEffect, useCallback } from 'react';

export interface DivisionRemaindersPlayerProps {
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
    questionText: 'When 694 is divided by 3 using short division, what is the quotient and whole remainder?',
    options: [
      '231 full groups with a remainder of 1, written as 231 r 1',
      '230 full groups with a remainder of 4',
      '231 full groups with no remainder'
    ],
    correctIndex: 0,
    hint: '694 divided by 3 gives 231 full groups with 1 left over (231 r 1).'
  },
  {
    id: 2,
    questionText: 'How is 85 shared equally among 4 expressed as a mixed number with a fractional remainder?',
    options: [
      '21 and 1/4 (because 1 leftover part out of divisor 4 becomes the fraction 1/4)',
      '21 and 4/1',
      '20 and 5/4'
    ],
    correctIndex: 0,
    hint: '85 shared equally among 4 gives 21 full parts with 1 left over out of divisor 4, expressed as 21 and 1/4.'
  },
  {
    id: 3,
    questionText: 'How do you convert any leftover remainder into a fraction of the divisor?',
    options: [
      'Put the leftover amount as the numerator (top number) and the divisor as the denominator (bottom number)',
      'Put the divisor as the top number and the remainder as the bottom number',
      'Multiply the leftover remainder by 10 and remove the divisor'
    ],
    correctIndex: 0,
    hint: 'A leftover remainder becomes the top number of your fraction, and the number you divided by stays on the bottom!'
  }
];

export const DivisionRemaindersPlayer: React.FC<DivisionRemaindersPlayerProps> = ({
  conceptName = 'Concept 9.4: Division with Remainders and Fractional Remainders',
  unitTitle = 'Unit 9: Calculation (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'division_694_3' | 'fraction_85_4'>('division_694_3');
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
        'When an amount cannot be divided into equal whole groups, the leftover quantity can be stated either as a whole remainder or converted into a fraction of the divisor. Short division works from left to right, finding how many equal groups can be made from each place value. Leftover amounts that are too small to make another full group are called remainders. To write a remainder as a fraction, put the leftover amount as the numerator and the divisor as the denominator. A leftover remainder becomes the top number of your fraction, and the number you divided by stays on the bottom!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'division_694_3') {
        const desc =
          demoStep === 0
            ? 'Dividing 694 by 3 using short division. Click Run Short Division!'
            : demoStep === 1
            ? '600 divided by 3 is 200, 90 divided by 3 is 30, and 4 divided by 3 is 1 with 1 left over!'
            : '694 divided by 3 gives 231 full groups with a remainder of 1, written as 231 r 1!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Sharing 85 equally among 4 into fractional remainders. Click Share Equally Among 4!'
            : demoStep === 1
            ? '85 shared equally among 4 gives 21 to each group, leaving 1 leftover part out of divisor 4!'
            : '85 shared equally among 4 leaves 1 part left over, which can be expressed as 21 and 1/4! A leftover remainder becomes the top number of your fraction, and the number you divided by stays on the bottom.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Division with Remainders and Fractional Remainders! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'division_694_3' | 'fraction_85_4') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'division_694_3') {
      safeNarrate('Dividing 694 by 3 using short division. Click Run Short Division!');
    } else {
      safeNarrate('Sharing 85 equally among 4 into fractional remainders. Click Share Equally Among 4!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'division_694_3') {
      const desc =
        next === 0
          ? 'Dividing 694 by 3 using short division. Click Run Short Division!'
          : next === 1
          ? '600 divided by 3 is 200, 90 divided by 3 is 30, and 4 divided by 3 is 1 with 1 left over!'
          : '694 divided by 3 gives 231 full groups with a remainder of 1, written as 231 r 1!';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Sharing 85 equally among 4 into fractional remainders. Click Share Equally Among 4!'
          : next === 1
          ? '85 shared equally among 4 gives 21 to each group, leaving 1 leftover part out of divisor 4!'
          : '85 shared equally among 4 leaves 1 part left over, which can be expressed as 21 and 1/4! A leftover remainder becomes the top number of your fraction, and the number you divided by stays on the bottom.';
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
              When an amount cannot be divided into equal whole groups, the <strong>leftover quantity</strong> can be stated either as a <strong>whole remainder</strong> or converted into a <strong>fraction of the divisor</strong>. 
              Short division works from left to right, finding how many equal groups can be made from each place value. 
              Leftover amounts too small to make another full group are called <strong>remainders</strong>. 
              To write a remainder as a fraction, put the leftover amount as the <strong>numerator</strong> (top number) and the divisor as the <strong>denominator</strong> (bottom number).
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Whole Remainder Example (694 ÷ 3)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  694 ÷ 3 ➔ 231 full groups with 1 left over (231 r 1)
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Short division place by place from left to right.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                ➗ 231 r 1
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Fractional Remainder Example (85 ÷ 4)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  85 shared among 4 ➔ 21 full parts + 1 leftover part out of 4 ➔ 21 ¼
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Leftover becomes numerator, divisor stays denominator!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🍕 21 ¼
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Division & Remainder Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('division_694_3')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'division_694_3'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ➗ Short Division (694 ÷ 3)
            </button>
            <button
              onClick={() => handleSelectDemoMode('fraction_85_4')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'fraction_85_4'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🍕 Fractional Remainder (85 ÷ 4)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'division_694_3' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Short Division: 694 ÷ 3 (Place by Place)
                </h3>

                {/* Short Division Visual Card */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="grid grid-cols-3 gap-2 max-w-md mx-auto text-center font-bold text-xs">
                    {/* Hundreds */}
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 1 ? 'bg-[#16241f] text-white border-[#16241f] shadow-md' : 'bg-white border-[#16241f]/20'}`}>
                      <span className="text-[10px] uppercase block opacity-75">Hundreds (6 ÷ 3)</span>
                      <span className="text-base font-black my-1 block">2</span>
                      <span className="text-[10px]">200s</span>
                    </div>

                    {/* Tens */}
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 1 ? 'bg-[#16241f] text-white border-[#16241f] shadow-md' : 'bg-white border-[#16241f]/20'}`}>
                      <span className="text-[10px] uppercase block opacity-75">Tens (9 ÷ 3)</span>
                      <span className="text-base font-black my-1 block">3</span>
                      <span className="text-[10px]">30s</span>
                    </div>

                    {/* Ones + Remainder */}
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 2 ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20'}`}>
                      <span className="text-[10px] uppercase block opacity-75">Ones (4 ÷ 3)</span>
                      <span className="text-base font-black my-1 block">1 r 1</span>
                      <span className="text-[10px]">1 left over</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 bg-white border border-[#16241f]/10 rounded-xl text-center">
                    <span className="text-xs font-black text-[#16241f] block">
                      694 ÷ 3 = {demoStep >= 2 ? '231 r 1 (231 full groups + 1 remainder)' : '694 ÷ 3'}
                    </span>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-2 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ✨ 600 ÷ 3 = 200, and 90 ÷ 3 = 30!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-2 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 4 ÷ 3 = 1 with 1 left over! Final quotient: 231 r 1!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Divide Hundreds & Tens'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Divide Ones & Find Remainder (1)'
                    : '🔄 Reset Short Division Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Sharing 85 ÷ 4 into Fractional Remainders (21 ¼)
                </h3>

                {/* Fractional Remainder Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="space-y-3 max-w-md mx-auto text-xs font-bold">
                    {/* 4 Equal Groups */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="p-2.5 bg-white border border-[#16241f]/20 rounded-xl shadow-sm">
                          <span className="text-[9px] text-[#16241f]/60 block">Group {idx + 1}</span>
                          <span className="text-base font-black text-[#16241f] my-0.5 block">21</span>
                          <span className="text-[9px] text-[#9c6f1f]">Whole Parts</span>
                        </div>
                      ))}
                    </div>

                    {/* Leftover Fraction Part */}
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 flex justify-between items-center ${demoStep >= 2 ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20 text-[#16241f]'}`}>
                      <div>
                        <span className="text-[10px] uppercase font-bold block opacity-80">Leftover Part</span>
                        <span className="text-sm font-black">1 leftover part out of divisor 4</span>
                      </div>
                      <div className="text-xl font-black bg-white/20 px-3 py-1 rounded-lg">
                        ¼
                      </div>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      📊 85 shared equally gives 21 to each of the 4 groups, leaving 1 leftover!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 Express leftover 1 out of 4 as a fraction: 21 ¼! Leftover is top number, divisor is bottom number.
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Divide 85 by 4 (21 each)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Convert Leftover 1 to Fraction (¼)'
                    : '🔄 Reset Fractional Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'division_694_3' ? (
                <>
                  {demoStep === 0 && 'Dividing 694 by 3 using short division. Click Run Short Division!'}
                  {demoStep === 1 && '600 divided by 3 is 200, 90 divided by 3 is 30, and 4 divided by 3 is 1 with 1 left over!'}
                  {demoStep === 2 && '694 divided by 3 gives 231 full groups with a remainder of 1, written as 231 r 1!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Sharing 85 equally among 4 into fractional remainders. Click Share Equally Among 4!'}
                  {demoStep === 1 && '85 shared equally among 4 gives 21 to each group, leaving 1 leftover part out of divisor 4!'}
                  {demoStep === 2 && '85 shared equally among 4 leaves 1 part left over, which can be expressed as 21 and 1/4! A leftover remainder becomes the top number of your fraction, and the number you divided by stays on the bottom.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Division with Remainders and Fractional Remainders</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              A leftover remainder becomes the top number of your fraction, and the number you divided by stays on the bottom!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('division_694_3');
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

export default DivisionRemaindersPlayer;
