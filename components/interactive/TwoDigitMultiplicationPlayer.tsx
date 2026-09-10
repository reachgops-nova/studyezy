import React, { useState, useEffect, useCallback } from 'react';

export interface TwoDigitMultiplicationPlayerProps {
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
    questionText: 'How do you partition the multiplier 26 when solving 247 x 26?',
    options: [
      'Partition 26 into 20 and 6, calculate 247 x 6 (1482) and 247 x 20 (4940), then add them to get 6422',
      'Split 247 into 200 + 40 + 7 and ignore 26',
      'Multiply 247 x 2 and add 6'
    ],
    correctIndex: 0,
    hint: 'Partition 26 into 20 and 6. Multiply 247 x 6 (1482) and 247 x 20 (4940), then add them to get 6422.'
  },
  {
    id: 2,
    questionText: 'What is the vital first step when you start multiplying by the tens digit in column multiplication?',
    options: [
      'Place a placeholder zero in the ones column first because every value shifts one column left',
      'Multiply by 1 instead of 10',
      'Round the top number to the nearest hundred'
    ],
    correctIndex: 0,
    hint: 'When you start multiplying by the tens digit, put your placeholder zero in the ones column first.'
  },
  {
    id: 3,
    questionText: 'How can you mentally multiply 43 by 20 easily?',
    options: [
      'Double 43 to get 86, then multiply by 10 to get 860',
      'Add 20 to 43 to get 63',
      'Divide 43 by 2 to get 21.5'
    ],
    correctIndex: 0,
    hint: 'To multiply 43 by 20 mentally, double 43 to get 86, then multiply by 10 to get 860.'
  }
];

export const TwoDigitMultiplicationPlayer: React.FC<TwoDigitMultiplicationPlayerProps> = ({
  conceptName = 'Concept 9.3: Multiplying by a Two-Digit Number',
  unitTitle = 'Unit 9: Calculation (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'column_247_26' | 'mental_43_20'>('column_247_26');
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
        'Multiplying by a two-digit number means partitioning the multiplier into tens and ones, finding the partial products, and adding them together. A two-digit multiplier such as 26 can be partitioned into 20 and 6. Area grids or column multiplication help organize the calculations so no place value step is missed. When you multiply by the tens digit, remember that every value shifts one column left, meaning you place a zero placeholder in the ones column. When you start multiplying by the tens digit, put your placeholder zero in the ones column first!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'column_247_26') {
        const desc =
          demoStep === 0
            ? 'Solving 247 x 26 by partitioning 26 into 20 + 6. Click Multiply Ones (x6)!'
            : demoStep === 1
            ? 'Multiply 247 by 6 ones to get 1482! Now click Place Placeholder Zero & Multiply Tens (x20)!'
            : 'Put a placeholder zero in the ones column first, then multiply 247 x 20 to get 4940! Adding partial products 1482 + 4940 equals 6422!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Multiplying 43 x 20 mentally by doubling and multiplying by 10. Click Double 43!'
            : demoStep === 1
            ? 'Double 43 to get 86!'
            : 'Multiply 86 by 10 to get 860! Double 43 is 86, times 10 is 860.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Multiplying by a Two-Digit Number! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'column_247_26' | 'mental_43_20') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'column_247_26') {
      safeNarrate('Solving 247 x 26 by partitioning 26 into 20 + 6. Click Multiply Ones (x6)!');
    } else {
      safeNarrate('Multiplying 43 x 20 mentally by doubling and multiplying by 10. Click Double 43!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'column_247_26') {
      const desc =
        next === 0
          ? 'Solving 247 x 26 by partitioning 26 into 20 + 6. Click Multiply Ones (x6)!'
          : next === 1
          ? 'Multiply 247 by 6 ones to get 1482! Now click Place Placeholder Zero & Multiply Tens (x20)!'
          : 'Put a placeholder zero in the ones column first, then multiply 247 x 20 to get 4940! Adding partial products 1482 + 4940 equals 6422!';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Multiplying 43 x 20 mentally by doubling and multiplying by 10. Click Double 43!'
          : next === 1
          ? 'Double 43 to get 86!'
          : 'Multiply 86 by 10 to get 860! Double 43 is 86, times 10 is 860.';
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
              <strong>Multiplying by a two-digit number</strong> means partitioning the multiplier into tens and ones, finding the partial products, and adding them together. 
              A two-digit multiplier such as <strong>26</strong> can be partitioned into <strong>20 and 6</strong>. 
              Area grids or column multiplication help organize calculations so no place value step is missed. 
              When you multiply by the tens digit, remember that every value shifts one column left, meaning you <strong>place a zero placeholder in the ones column first</strong>.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Column / Partial Product Example (247 × 26)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  247 × 6 = 1482 | 247 × 20 = 4940 ➔ 1482 + 4940 = 6422
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Place placeholder zero in ones column before multiplying by 20!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                ✖️ 6422
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Mental Multiplication Example (43 × 20)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Double 43 ➔ 86 | 86 × 10 ➔ 860
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Double first, then multiply by 10.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                ⚡ 860
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Two-Digit Multiplication Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('column_247_26')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'column_247_26'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ✖️ Column (247 × 26)
            </button>
            <button
              onClick={() => handleSelectDemoMode('mental_43_20')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'mental_43_20'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ⚡ Mental (43 × 20)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'column_247_26' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Solving 247 × 26 (Partitioning 26 into 20 + 6)
                </h3>

                {/* Column Multiplication Board */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="max-w-xs mx-auto font-mono text-right text-sm space-y-1.5 p-3 bg-white border border-[#16241f]/15 rounded-xl shadow-sm">
                    <div className="font-bold text-[#16241f]">2 4 7</div>
                    <div className="font-bold text-[#9c6f1f] border-b-2 border-[#16241f] pb-1">× 2 6</div>

                    {/* Partial Product 1: x6 */}
                    <div className={`p-1 rounded transition-all duration-300 ${demoStep >= 1 ? 'bg-[#16241f]/10 font-bold text-[#16241f]' : 'opacity-30'}`}>
                      <span className="text-[10px] text-[#16241f]/60 font-sans float-left">(247 × 6)</span> 1 4 8 2
                    </div>

                    {/* Partial Product 2: x20 with placeholder zero */}
                    <div className={`p-1 rounded transition-all duration-300 ${demoStep >= 2 ? 'bg-[#9c6f1f]/15 font-bold text-[#9c6f1f]' : 'opacity-30'}`}>
                      <span className="text-[10px] text-[#9c6f1f] font-sans float-left">(247 × 20)</span> 4 9 4 <span className="underline font-black text-red-600">0</span>
                    </div>

                    {/* Final Sum */}
                    <div className={`border-t-2 border-[#16241f] pt-1 font-black text-base transition-all duration-300 ${demoStep >= 2 ? 'text-[#16241f]' : 'opacity-20'}`}>
                      6 4 2 2
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ✨ First partial product: 247 × 6 = 1482!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 Place zero placeholder first (4940), then add partial products: 1482 + 4940 = 6422!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Multiply Ones (247 × 6)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Place Zero & Multiply Tens (247 × 20)'
                    : '🔄 Reset Column Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Multiplying 43 × 20 Mentally (Double then Multiply by 10)
                </h3>

                {/* Mental Math Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="grid grid-cols-3 gap-2 max-w-md mx-auto text-center font-bold text-xs">
                    {/* Start */}
                    <div className="p-2.5 bg-white border border-[#16241f]/20 rounded-xl">
                      <span className="text-[10px] uppercase text-[#16241f]/60 block">Start</span>
                      <span className="text-base font-black text-[#16241f]">43 × 20</span>
                    </div>

                    {/* Step 1: Double */}
                    <div className={`p-2.5 rounded-xl border transition-all duration-300 ${demoStep >= 1 ? 'bg-[#16241f] text-white shadow-md' : 'bg-white border-[#16241f]/20 text-[#16241f]/40'}`}>
                      <span className="text-[10px] uppercase block opacity-75">Double 43</span>
                      <span className="text-base font-black">86</span>
                    </div>

                    {/* Step 2: x 10 */}
                    <div className={`p-2.5 rounded-xl border transition-all duration-300 ${demoStep >= 2 ? 'bg-[#9c6f1f] text-white shadow-md' : 'bg-white border-[#16241f]/20 text-[#16241f]/40'}`}>
                      <span className="text-[10px] uppercase block opacity-75">Multiply by 10</span>
                      <span className="text-base font-black">860</span>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ⚡ Step 1: Double 43 to get 86!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 Step 2: Multiply 86 by 10 to get 860! 43 × 20 = 860.
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Double 43 (86)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Multiply 86 by 10 (860)'
                    : '🔄 Reset Mental Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'column_247_26' ? (
                <>
                  {demoStep === 0 && 'Solving 247 x 26 by partitioning 26 into 20 + 6. Click Multiply Ones (x6)!'}
                  {demoStep === 1 && 'Multiply 247 by 6 ones to get 1482! Now click Place Placeholder Zero & Multiply Tens (x20)!'}
                  {demoStep === 2 && 'Put a placeholder zero in the ones column first, then multiply 247 x 20 to get 4940! Adding partial products 1482 + 4940 equals 6422!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Multiplying 43 x 20 mentally by doubling and multiplying by 10. Click Double 43!'}
                  {demoStep === 1 && 'Double 43 to get 86!'}
                  {demoStep === 2 && 'Multiply 86 by 10 to get 860! Double 43 is 86, times 10 is 860.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Multiplying by a Two-Digit Number</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              When you start multiplying by the tens digit, put your placeholder zero in the ones column first!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('column_247_26');
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

export default TwoDigitMultiplicationPlayer;
