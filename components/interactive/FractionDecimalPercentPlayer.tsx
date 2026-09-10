import React, { useState, useEffect, useCallback } from 'react';

export interface FractionDecimalPercentPlayerProps {
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
    questionText: 'Which of the following shows the exact same value written as a fraction, decimal, and percentage?',
    options: [
      '1/10 = 0.1 = 10% (one tenth equals zero point one or ten percent)',
      '1/10 = 0.01 = 1%',
      '1/10 = 1.0 = 100%'
    ],
    correctIndex: 0,
    hint: 'One tenth equals 0.1, which is also ten hundredths or 10%.'
  },
  {
    id: 2,
    questionText: 'What is one hundredth (1/100) expressed as a decimal and a percentage?',
    options: [
      '0.01 and 1% (one hundredth equals zero point zero one or one percent)',
      '0.1 and 10%',
      '0.001 and 0.1%'
    ],
    correctIndex: 0,
    hint: 'One hundredth equals zero point zero one (0.01) or 1%.'
  },
  {
    id: 3,
    questionText: 'What simple calculation shortcut converts any decimal into its percentage twin?',
    options: [
      'Multiplying the decimal by 100 gives you its percentage twin',
      'Dividing the decimal by 100',
      'Adding 10 to the decimal number'
    ],
    correctIndex: 0,
    hint: 'Remember that multiplying a decimal by 100 gives you its percentage twin!'
  }
];

export const FractionDecimalPercentPlayer: React.FC<FractionDecimalPercentPlayerProps> = ({
  conceptName = 'Concept 11.2: Connecting Fractions, Decimals, and Percentages',
  unitTitle = 'Unit 11: Fractions, Decimals, Percentages (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'convert_3_5' | 'convert_025'>('convert_3_5');
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
        'Fractions, decimals, and percentages are simply different methods for describing the exact same fractional amount. Knowing how to convert between them allows you to switch freely to the most convenient form. One tenth equals zero point one, which is ten hundredths or ten percent. One hundredth equals zero point zero one or one percent. To change a fraction into a percentage, find an equivalent fraction with a bottom number of one hundred. Remember that multiplying a decimal by one hundred gives you its percentage twin!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'convert_3_5') {
        const desc =
          demoStep === 0
            ? 'Start with 3/5. Click Step 1: Scale up denominator to 100!'
            : demoStep === 1
            ? 'Multiply top and bottom by 20 to get sixty hundredths (60/100)!'
            : demoStep === 2
            ? '60/100 written as a decimal is 0.6!'
            : '0.6 multiplied by 100 gives 60%! Three fifths equals 60/100, 0.6, or 60%!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Start with the decimal 0.25. Click Step 1: Write as fraction over 100!'
            : demoStep === 1
            ? '0.25 equals twenty-five hundredths (25/100)!'
            : demoStep === 2
            ? 'Divide top and bottom by 25 to simplify to one quarter (1/4)!'
            : '25/100 is 25%! Decimal 0.25 equals 25/100, 1/4, or 25%!';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Connecting Fractions, Decimals, and Percentages! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'convert_3_5' | 'convert_025') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'convert_3_5') {
      safeNarrate('Start with 3/5. Click Step 1: Scale up denominator to 100!');
    } else {
      safeNarrate('Start with the decimal 0.25. Click Step 1: Write as fraction over 100!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 4;
    setDemoStep(next);
    if (demoMode === 'convert_3_5') {
      const desc =
        next === 0
          ? 'Start with 3/5. Click Step 1: Scale up denominator to 100!'
          : next === 1
          ? 'Multiply top and bottom by 20 to get sixty hundredths (60/100)!'
          : next === 2
          ? '60/100 written as a decimal is 0.6!'
          : '0.6 multiplied by 100 gives 60%! Three fifths equals 60/100, 0.6, or 60%!';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Start with the decimal 0.25. Click Step 1: Write as fraction over 100!'
          : next === 1
          ? '0.25 equals twenty-five hundredths (25/100)!'
          : next === 2
          ? 'Divide top and bottom by 25 to simplify to one quarter (1/4)!'
          : '25/100 is 25%! Decimal 0.25 equals 25/100, 1/4, or 25%!';
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
              Fractions, decimals, and percentages are simply <strong>different methods for describing the exact same fractional amount</strong>. 
              Knowing how to convert between them allows you to switch freely to the most convenient form. 
              <strong> 1/10 = 0.1 = 10%</strong> (one tenth is ten hundredths). 
              <strong> 1/100 = 0.01 = 1%</strong> (one hundredth is one percent). 
              To convert a fraction to a percentage, find an equivalent fraction with a bottom number of <strong>100</strong>.
            </p>
          </div>

          {/* Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Fraction to Percent Conversion (3/5)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  3/5 ➔ 60/100 ➔ 0.6 ➔ 60%
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Scale up denominator to 100 by multiplying top & bottom by 20!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                📊 60%
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Decimal to Fraction & Percent (0.25)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  0.25 ➔ 25/100 ➔ Simplifies to 1/4 ➔ 25%
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Twenty-five hundredths simplifies to one quarter!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🍕 1/4
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Conversion Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('convert_3_5')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'convert_3_5'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              📊 Convert 3/5 ➔ 60%
            </button>
            <button
              onClick={() => handleSelectDemoMode('convert_025')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'convert_025'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🍕 Convert 0.25 ➔ 1/4 & 25%
            </button>
          </div>

          {/* Interactive Step Visualizer */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'convert_3_5' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-4">
                  Step-by-Step: Converting Fraction 3/5
                </h3>

                {/* Step Pipeline Cards */}
                <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto mb-4 font-bold text-xs">
                  {/* Step 0: 3/5 */}
                  <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 0 ? 'bg-[#16241f] text-white border-[#16241f] shadow-md' : 'bg-white border-[#16241f]/20'}`}>
                    <span className="text-[9px] uppercase block opacity-75">Start</span>
                    <span className="text-base font-black my-1 block">3/5</span>
                    <span className="text-[9px]">Fraction</span>
                  </div>

                  {/* Step 1: 60/100 */}
                  <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 1 ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20 text-[#16241f]/40'}`}>
                    <span className="text-[9px] uppercase block opacity-75">Scale ×20</span>
                    <span className="text-base font-black my-1 block">{demoStep >= 1 ? '60/100' : '?'}</span>
                    <span className="text-[9px]">Hundredths</span>
                  </div>

                  {/* Step 2: 0.6 */}
                  <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 2 ? 'bg-[#16241f] text-white border-[#16241f] shadow-md' : 'bg-white border-[#16241f]/20 text-[#16241f]/40'}`}>
                    <span className="text-[9px] uppercase block opacity-75">Decimal</span>
                    <span className="text-base font-black my-1 block">{demoStep >= 2 ? '0.6' : '?'}</span>
                    <span className="text-[9px]">6 Tenths</span>
                  </div>

                  {/* Step 3: 60% */}
                  <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 3 ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20 text-[#16241f]/40'}`}>
                    <span className="text-[9px] uppercase block opacity-75">Percent</span>
                    <span className="text-base font-black my-1 block">{demoStep >= 3 ? '60%' : '?'}</span>
                    <span className="text-[9px]">× 100</span>
                  </div>
                </div>

                {demoStep === 1 && (
                  <div className="p-2.5 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                    ✨ Multiply numerator (3×20=60) and denominator (5×20=100) to get 60/100!
                  </div>
                )}

                {demoStep === 2 && (
                  <div className="p-2.5 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                    ✨ 60 hundredths (60/100) written in decimal form is 0.6 or 0.60!
                  </div>
                )}

                {demoStep === 3 && (
                  <div className="p-2.5 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                    🎉 Multiply 0.6 by 100 to get its percentage twin: 60%! 3/5 = 60/100 = 0.6 = 60%.
                  </div>
                )}

                <button
                  onClick={handleNextDemoStep}
                  className="mt-3 py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Scale Denominator to 100 (60/100)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Convert 60/100 to Decimal (0.6)'
                    : demoStep === 2
                    ? '3️⃣ Step 3: Convert 0.6 to Percent (60%)'
                    : '🔄 Reset 3/5 Conversion Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-4">
                  Step-by-Step: Converting Decimal 0.25
                </h3>

                {/* Step Pipeline Cards */}
                <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto mb-4 font-bold text-xs">
                  {/* Step 0: 0.25 */}
                  <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 0 ? 'bg-[#16241f] text-white border-[#16241f] shadow-md' : 'bg-white border-[#16241f]/20'}`}>
                    <span className="text-[9px] uppercase block opacity-75">Start</span>
                    <span className="text-base font-black my-1 block">0.25</span>
                    <span className="text-[9px]">Decimal</span>
                  </div>

                  {/* Step 1: 25/100 */}
                  <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 1 ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20 text-[#16241f]/40'}`}>
                    <span className="text-[9px] uppercase block opacity-75">Fraction</span>
                    <span className="text-base font-black my-1 block">{demoStep >= 1 ? '25/100' : '?'}</span>
                    <span className="text-[9px]">Hundredths</span>
                  </div>

                  {/* Step 2: 1/4 */}
                  <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 2 ? 'bg-[#16241f] text-white border-[#16241f] shadow-md' : 'bg-white border-[#16241f]/20 text-[#16241f]/40'}`}>
                    <span className="text-[9px] uppercase block opacity-75">Simplify ÷25</span>
                    <span className="text-base font-black my-1 block">{demoStep >= 2 ? '1/4' : '?'}</span>
                    <span className="text-[9px]">One Quarter</span>
                  </div>

                  {/* Step 3: 25% */}
                  <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 3 ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20 text-[#16241f]/40'}`}>
                    <span className="text-[9px] uppercase block opacity-75">Percent</span>
                    <span className="text-base font-black my-1 block">{demoStep >= 3 ? '25%' : '?'}</span>
                    <span className="text-[9px]">× 100</span>
                  </div>
                </div>

                {demoStep === 1 && (
                  <div className="p-2.5 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                    ✨ 0.25 has 25 in the hundredths place, written as 25/100!
                  </div>
                )}

                {demoStep === 2 && (
                  <div className="p-2.5 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                    ✨ Divide top and bottom by 25: 25÷25=1 and 100÷25=4, giving 1/4!
                  </div>
                )}

                {demoStep === 3 && (
                  <div className="p-2.5 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                    🎉 25 out of 100 is 25%! Decimal 0.25 = 25/100 = 1/4 = 25%.
                  </div>
                )}

                <button
                  onClick={handleNextDemoStep}
                  className="mt-3 py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Write as 25/100'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Simplify 25/100 to 1/4'
                    : demoStep === 2
                    ? '3️⃣ Step 3: Convert to 25%'
                    : '🔄 Reset 0.25 Conversion Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'convert_3_5' ? (
                <>
                  {demoStep === 0 && 'Start with 3/5. Click Step 1: Scale up denominator to 100!'}
                  {demoStep === 1 && 'Multiply top and bottom by 20 to get sixty hundredths (60/100)!'}
                  {demoStep === 2 && '60/100 written as a decimal is 0.6!'}
                  {demoStep === 3 && '0.6 multiplied by 100 gives 60%! Three fifths equals 60/100, 0.6, or 60%!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Start with the decimal 0.25. Click Step 1: Write as fraction over 100!'}
                  {demoStep === 1 && '0.25 equals twenty-five hundredths (25/100)!'}
                  {demoStep === 2 && 'Divide top and bottom by 25 to simplify to one quarter (1/4)!'}
                  {demoStep === 3 && '25/100 is 25%! Decimal 0.25 equals 25/100, 1/4, or 25%!'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Connecting Fractions, Decimals, and Percentages</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Remember that multiplying a decimal by 100 gives you its percentage twin!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('convert_3_5');
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

export default FractionDecimalPercentPlayer;
