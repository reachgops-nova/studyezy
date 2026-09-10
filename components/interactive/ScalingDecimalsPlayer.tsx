import React, { useState, useEffect, useCallback } from 'react';

export interface ScalingDecimalsPlayerProps {
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
    questionText: 'When 5.38 is multiplied by 10 and 100, what are the resulting numbers?',
    options: [
      '53.8 (x10) and 538 (x100)',
      '0.538 (x10) and 0.0538 (x100)',
      '538 (x10) and 5380 (x100)'
    ],
    correctIndex: 0,
    hint: 'Multiplying by 10 shifts digits 1 place left (53.8), and multiplying by 100 shifts digits 2 places left (538).'
  },
  {
    id: 2,
    questionText: 'What happens when 48 is divided by 10 and by 100?',
    options: [
      '48 divided by 10 gives 4.8, and divided by 100 gives 0.48',
      '48 divided by 10 gives 480, and divided by 100 gives 4800',
      '48 divided by 10 gives 0.48, and divided by 100 gives 0.048'
    ],
    correctIndex: 0,
    hint: 'Dividing by 10 shifts digits 1 place right (4.8), and dividing by 100 shifts digits 2 places right (0.48).'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember about digit movements when multiplying and dividing decimals?',
    options: [
      'Multiplying makes numbers bigger so digits jump left; dividing makes numbers smaller so digits jump right!',
      'Multiplying always moves digits right, dividing moves digits left',
      'Digits never move, only the decimal point disappears'
    ],
    correctIndex: 0,
    hint: 'Multiplying makes numbers bigger so digits jump left; dividing makes numbers smaller so digits jump right!'
  }
];

export const ScalingDecimalsPlayer: React.FC<ScalingDecimalsPlayerProps> = ({
  conceptName = 'Concept 7.4: Multiplying and Dividing Decimals by 10 and 100',
  unitTitle = 'Unit 7: Number (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'multiply_538' | 'divide_48'>('multiply_538');
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
        'Multiplying or dividing a decimal by 10 or 100 scales the number by sliding its digits across place value columns. Multiplying by 10 shifts all digits one place to the left, making the number ten times larger, while multiplying by 100 shifts digits two places to the left. Dividing by 10 or 100 shifts digits to the right, making each part ten or one hundred times smaller.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'multiply_538') {
        const desc =
          demoStep === 0
            ? 'Multiplying 5.38 by 10 and 100. Click Multiply by 10!'
            : demoStep === 1
            ? '5.38 multiplied by 10 shifts all digits one place to the left, becoming 53.8!'
            : '5.38 multiplied by 100 shifts all digits two places to the left, becoming 538! Multiplying makes numbers bigger so digits jump left.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Dividing 48 by 10 and 100. Click Divide by 10!'
            : demoStep === 1
            ? '48 divided by 10 shifts digits one place to the right, becoming 4.8!'
            : '48 divided by 100 shifts digits two places to the right, becoming 0.48! Dividing makes numbers smaller so digits jump right.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Multiplying and Dividing Decimals by 10 and 100! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'multiply_538' | 'divide_48') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'multiply_538') {
      safeNarrate('Multiplying 5.38 by 10 and 100. Click Multiply by 10!');
    } else {
      safeNarrate('Dividing 48 by 10 and 100. Click Divide by 10!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'multiply_538') {
      const desc =
        next === 0
          ? 'Multiplying 5.38 by 10 and 100. Click Multiply by 10!'
          : next === 1
          ? '5.38 multiplied by 10 shifts all digits one place to the left, becoming 53.8!'
          : '5.38 multiplied by 100 shifts all digits two places to the left, becoming 538! Multiplying makes numbers bigger so digits jump left.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Dividing 48 by 10 and 100. Click Divide by 10!'
          : next === 1
          ? '48 divided by 10 shifts digits one place to the right, becoming 4.8!'
          : '48 divided by 100 shifts digits two places to the right, becoming 0.48! Dividing makes numbers smaller so digits jump right.';
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
              <strong>Multiplying or dividing a decimal by 10 or 100</strong> scales the number by sliding its digits across place value columns. 
              <strong>Multiplying by 10</strong> shifts all digits <strong>1 place to the left</strong> (10x larger), while <strong>multiplying by 100</strong> shifts digits <strong>2 places to the left</strong> (100x larger). 
              <strong>Dividing by 10 or 100</strong> shifts digits to the <strong>right</strong>, making each part 10 or 100 times smaller.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Multiplying Example (5.38)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  5.38 × 10 = 53.8 | 5.38 × 100 = 538
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Multiplying makes numbers bigger so digits jump left!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                ⬅️ 538
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Dividing Example (48)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  48 ÷ 10 = 4.8 | 48 ÷ 100 = 0.48
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Dividing makes numbers smaller so digits jump right!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                ➡️ 0.48
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Digit Shift Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('multiply_538')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'multiply_538'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ⬅️ Multiply (5.38 × 10/100)
            </button>
            <button
              onClick={() => handleSelectDemoMode('divide_48')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'divide_48'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ➡️ Divide (48 ÷ 10/100)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'multiply_538' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Multiplying 5.38 by 10 and 100 (Shift Digits Left)
                </h3>

                {/* Place Value Shift Chart */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="grid grid-cols-5 gap-1.5 max-w-md mx-auto text-center font-bold">
                    {/* Column Headers */}
                    <div className="p-1.5 bg-white border border-[#16241f]/10 rounded-lg text-[10px] text-[#16241f]">Hundreds</div>
                    <div className="p-1.5 bg-white border border-[#16241f]/10 rounded-lg text-[10px] text-[#16241f]">Tens</div>
                    <div className="p-1.5 bg-white border border-[#16241f]/10 rounded-lg text-[10px] text-[#16241f]">Ones</div>
                    <div className="p-1.5 bg-white border border-[#16241f]/10 rounded-lg text-[10px] text-[#9c6f1f]">Tenths</div>
                    <div className="p-1.5 bg-white border border-[#16241f]/10 rounded-lg text-[10px] text-[#9c6f1f]">Hundredths</div>

                    {/* Value Rows */}
                    {demoStep === 0 && (
                      <>
                        <div className="p-2 bg-white rounded-lg border text-sm text-[#16241f]/30">-</div>
                        <div className="p-2 bg-white rounded-lg border text-sm text-[#16241f]/30">-</div>
                        <div className="p-2 bg-[#16241f] text-white rounded-lg text-sm font-black">5</div>
                        <div className="p-2 bg-[#9c6f1f] text-white rounded-lg text-sm font-black">3</div>
                        <div className="p-2 bg-[#9c6f1f]/80 text-white rounded-lg text-sm font-black">8</div>
                      </>
                    )}

                    {demoStep === 1 && (
                      <>
                        <div className="p-2 bg-white rounded-lg border text-sm text-[#16241f]/30">-</div>
                        <div className="p-2 bg-[#16241f] text-white rounded-lg text-sm font-black shadow-md">5</div>
                        <div className="p-2 bg-[#9c6f1f] text-white rounded-lg text-sm font-black shadow-md">3</div>
                        <div className="p-2 bg-[#9c6f1f]/80 text-white rounded-lg text-sm font-black shadow-md">8</div>
                        <div className="p-2 bg-white rounded-lg border text-sm text-[#16241f]/30">-</div>
                      </>
                    )}

                    {demoStep === 2 && (
                      <>
                        <div className="p-2 bg-[#16241f] text-white rounded-lg text-sm font-black shadow-md">5</div>
                        <div className="p-2 bg-[#9c6f1f] text-white rounded-lg text-sm font-black shadow-md">3</div>
                        <div className="p-2 bg-[#9c6f1f]/80 text-white rounded-lg text-sm font-black shadow-md">8</div>
                        <div className="p-2 bg-white rounded-lg border text-sm text-[#16241f]/30">-</div>
                        <div className="p-2 bg-white rounded-lg border text-sm text-[#16241f]/30">-</div>
                      </>
                    )}
                  </div>

                  <div className="mt-3 p-2 bg-white border border-[#16241f]/10 rounded-xl text-center">
                    <span className="text-xs font-black text-[#16241f] block">
                      {demoStep === 0 && 'Start Number: 5.38'}
                      {demoStep === 1 && '5.38 × 10 = 53.8 (Shifted 1 place LEFT)'}
                      {demoStep === 2 && '5.38 × 100 = 538 (Shifted 2 places LEFT)'}
                    </span>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-2 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ⬅️ Multiplying by 10 shifts digits 1 place left: 5.38 becomes 53.8!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-2 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      ⬅️ Multiplying by 100 shifts digits 2 places left: 5.38 becomes 538!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Multiply by 10 (Shift 1 Place Left)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Multiply by 100 (Shift 2 Places Left)'
                    : '🔄 Reset Multiply Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Dividing 48 by 10 and 100 (Shift Digits Right)
                </h3>

                {/* Place Value Shift Chart */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="grid grid-cols-4 gap-2 max-w-md mx-auto text-center font-bold">
                    {/* Column Headers */}
                    <div className="p-1.5 bg-white border border-[#16241f]/10 rounded-lg text-[10px] text-[#16241f]">Tens</div>
                    <div className="p-1.5 bg-white border border-[#16241f]/10 rounded-lg text-[10px] text-[#16241f]">Ones</div>
                    <div className="p-1.5 bg-white border border-[#16241f]/10 rounded-lg text-[10px] text-[#9c6f1f]">Tenths</div>
                    <div className="p-1.5 bg-white border border-[#16241f]/10 rounded-lg text-[10px] text-[#9c6f1f]">Hundredths</div>

                    {/* Value Rows */}
                    {demoStep === 0 && (
                      <>
                        <div className="p-2 bg-[#16241f] text-white rounded-lg text-sm font-black">4</div>
                        <div className="p-2 bg-[#16241f]/80 text-white rounded-lg text-sm font-black">8</div>
                        <div className="p-2 bg-white rounded-lg border text-sm text-[#16241f]/30">-</div>
                        <div className="p-2 bg-white rounded-lg border text-sm text-[#16241f]/30">-</div>
                      </>
                    )}

                    {demoStep === 1 && (
                      <>
                        <div className="p-2 bg-white rounded-lg border text-sm text-[#16241f]/30">-</div>
                        <div className="p-2 bg-[#16241f] text-white rounded-lg text-sm font-black shadow-md">4</div>
                        <div className="p-2 bg-[#9c6f1f] text-white rounded-lg text-sm font-black shadow-md">8</div>
                        <div className="p-2 bg-white rounded-lg border text-sm text-[#16241f]/30">-</div>
                      </>
                    )}

                    {demoStep === 2 && (
                      <>
                        <div className="p-2 bg-white rounded-lg border text-sm text-[#16241f]/30">-</div>
                        <div className="p-2 bg-[#16241f]/20 text-[#16241f] rounded-lg text-sm font-black">0</div>
                        <div className="p-2 bg-[#9c6f1f] text-white rounded-lg text-sm font-black shadow-md">4</div>
                        <div className="p-2 bg-[#9c6f1f]/80 text-white rounded-lg text-sm font-black shadow-md">8</div>
                      </>
                    )}
                  </div>

                  <div className="mt-3 p-2 bg-white border border-[#16241f]/10 rounded-xl text-center">
                    <span className="text-xs font-black text-[#16241f] block">
                      {demoStep === 0 && 'Start Number: 48'}
                      {demoStep === 1 && '48 ÷ 10 = 4.8 (Shifted 1 place RIGHT)'}
                      {demoStep === 2 && '48 ÷ 100 = 0.48 (Shifted 2 places RIGHT)'}
                    </span>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-2 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ➡️ Dividing by 10 shifts digits 1 place right: 48 becomes 4.8!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-2 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      ➡️ Dividing by 100 shifts digits 2 places right: 48 becomes 0.48!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Divide by 10 (Shift 1 Place Right)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Divide by 100 (Shift 2 Places Right)'
                    : '🔄 Reset Divide Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'multiply_538' ? (
                <>
                  {demoStep === 0 && 'Multiplying 5.38 by 10 and 100. Click Multiply by 10!'}
                  {demoStep === 1 && '5.38 multiplied by 10 shifts all digits one place to the left, becoming 53.8!'}
                  {demoStep === 2 && '5.38 multiplied by 100 shifts all digits two places to the left, becoming 538! Multiplying makes numbers bigger so digits jump left.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Dividing 48 by 10 and 100. Click Divide by 10!'}
                  {demoStep === 1 && '48 divided by 10 shifts digits one place to the right, becoming 4.8!'}
                  {demoStep === 2 && '48 divided by 100 shifts digits two places to the right, becoming 0.48! Dividing makes numbers smaller so digits jump right.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Multiplying and Dividing Decimals by 10 and 100</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Multiplying makes numbers bigger so digits jump left; dividing makes numbers smaller so digits jump right!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('multiply_538');
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

export default ScalingDecimalsPlayer;
