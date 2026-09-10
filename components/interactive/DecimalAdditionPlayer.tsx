import React, { useState, useEffect, useCallback } from 'react';

export interface DecimalAdditionPlayerProps {
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
    questionText: 'How can 3.4 + 2.3 be solved by splitting whole numbers and tenths?',
    options: [
      'Split into whole numbers (3 + 2 = 5) and tenths (0.4 + 0.3 = 0.7) to give 5.7',
      'Add 34 + 23 to get 57 wholes',
      'Add tenths first to get 7.0, then add wholes'
    ],
    correctIndex: 0,
    hint: 'Split 3.4 and 2.3 into whole numbers (3 + 2 = 5) and tenths (0.4 + 0.3 = 0.7) to combine them into 5.7.'
  },
  {
    id: 2,
    questionText: 'When calculating 6.8 - 2.5, what is the step-by-step subtraction process?',
    options: [
      'Take away 2 wholes from 6.8 to get 4.8, then take away 5 tenths to get 4.3',
      'Take away 5 wholes first, then add 2 tenths',
      'Subtract 6 - 5 to get 1, and 8 - 2 to get 6'
    ],
    correctIndex: 0,
    hint: 'Subtract 2 wholes from 6.8 to get 4.8, then take away 5 tenths to get 4.3.'
  },
  {
    id: 3,
    questionText: 'What is the most important rule when setting up decimal addition or subtraction?',
    options: [
      'Always keep the decimal points lined up so you never mix up whole ones with tenths',
      'Always place smaller numbers on the left',
      'Remove the decimal point completely before starting'
    ],
    correctIndex: 0,
    hint: 'Always keep the decimal points lined up so you never mix up whole ones with tenths!'
  }
];

export const DecimalAdditionPlayer: React.FC<DecimalAdditionPlayerProps> = ({
  conceptName = 'Concept 9.2: Adding and Subtracting Decimals',
  unitTitle = 'Unit 9: Calculation (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'addition_34_23' | 'subtraction_68_25'>('addition_34_23');
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
        'Adding and subtracting numbers with tenths involves combining or separating whole parts and decimal parts while keeping their place values strictly aligned. Tenths can be decomposed into place value chunks or visualized as fractional parts of one whole. Ten tenths make one whole, so whenever your tenths add up to ten or more, you regroup ten tenths as one whole. Subtracting decimals works just like subtracting whole numbers, but you must ensure tenths are taken away from tenths and ones from ones. Always keep the decimal points lined up so you never mix up whole ones with tenths!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'addition_34_23') {
        const desc =
          demoStep === 0
            ? 'Calculating 3.4 + 2.3 by splitting wholes and tenths. Click Combine Whole Numbers!'
            : demoStep === 1
            ? 'Combine the whole numbers: 3 wholes plus 2 wholes equals 5 wholes!'
            : 'Combine the tenths: 0.4 plus 0.3 equals 0.7 tenths! Combining 5 wholes and 0.7 tenths gives 5.7!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Calculating 6.8 - 2.5 by taking away wholes then tenths. Click Subtract Wholes!'
            : demoStep === 1
            ? 'Take away 2 wholes from 6.8 to get 4.8!'
            : 'Take away 5 tenths from 4.8 to get 4.3! Always keep the decimal points lined up so you never mix up whole ones with tenths.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Adding and Subtracting Decimals! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'addition_34_23' | 'subtraction_68_25') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'addition_34_23') {
      safeNarrate('Calculating 3.4 + 2.3 by splitting wholes and tenths. Click Combine Whole Numbers!');
    } else {
      safeNarrate('Calculating 6.8 - 2.5 by taking away wholes then tenths. Click Subtract Wholes!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'addition_34_23') {
      const desc =
        next === 0
          ? 'Calculating 3.4 + 2.3 by splitting wholes and tenths. Click Combine Whole Numbers!'
          : next === 1
          ? 'Combine the whole numbers: 3 wholes plus 2 wholes equals 5 wholes!'
          : 'Combine the tenths: 0.4 plus 0.3 equals 0.7 tenths! Combining 5 wholes and 0.7 tenths gives 5.7!';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Calculating 6.8 - 2.5 by taking away wholes then tenths. Click Subtract Wholes!'
          : next === 1
          ? 'Take away 2 wholes from 6.8 to get 4.8!'
          : 'Take away 5 tenths from 4.8 to get 4.3! Always keep the decimal points lined up so you never mix up whole ones with tenths.';
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
              <strong>Adding and subtracting numbers with tenths</strong> involves combining or separating whole parts and decimal parts while keeping their place values strictly aligned. 
              Tenths can be decomposed into place value chunks or visualized as fractional parts of one whole. 
              <strong>Ten tenths make one whole</strong>, so whenever your tenths add up to ten or more, you regroup ten tenths as one whole. 
              Subtracting decimals works just like subtracting whole numbers, taking tenths away from tenths and ones from ones.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Decimal Addition Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  3.4 + 2.3 ➔ Wholes (3 + 2 = 5) and Tenths (0.4 + 0.3 = 0.7) ➔ 5.7
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Split into wholes and tenths to add easily!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                ➕ 5.7
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Decimal Subtraction Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  6.8 - 2.5 ➔ Take 2 wholes (4.8) ➔ Take 5 tenths ➔ 4.3
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Keep decimal points lined up so place values match.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                ➖ 4.3
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Decimal Addition & Subtraction Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('addition_34_23')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'addition_34_23'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ➕ Addition (3.4 + 2.3)
            </button>
            <button
              onClick={() => handleSelectDemoMode('subtraction_68_25')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'subtraction_68_25'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ➖ Subtraction (6.8 - 2.5)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'addition_34_23' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Adding 3.4 + 2.3 (Splitting Wholes and Tenths)
                </h3>

                {/* Addition Alignment Card */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-center">
                    {/* Wholes Column */}
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 1 ? 'bg-[#16241f] text-white border-[#16241f] shadow-md' : 'bg-white border-[#16241f]/20'}`}>
                      <span className="text-[10px] font-bold uppercase block opacity-75">Wholes (Ones)</span>
                      <span className="text-lg font-black my-1 block">3 + 2 = 5</span>
                      <span className="text-[10px]">5 Wholes</span>
                    </div>

                    {/* Tenths Column */}
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 2 ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20'}`}>
                      <span className="text-[10px] font-bold uppercase block opacity-75">Tenths (1/10)</span>
                      <span className="text-lg font-black my-1 block">0.4 + 0.3 = 0.7</span>
                      <span className="text-[10px]">7 Tenths</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 bg-white border border-[#16241f]/10 rounded-xl text-center">
                    <span className="text-xs font-black text-[#16241f] block">
                      Aligned Sum: 5 Wholes + 0.7 Tenths = {demoStep >= 2 ? '5.7' : '3.4 + 2.3'}
                    </span>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-2 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ✨ Combine the wholes first: 3 + 2 = 5 wholes!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-2 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 Combine the tenths: 0.4 + 0.3 = 0.7 tenths! Total = 5.7!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Combine Whole Numbers (3 + 2)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Combine Tenths (0.4 + 0.3)'
                    : '🔄 Reset Addition Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Subtracting 6.8 - 2.5 (Step-by-Step)
                </h3>

                {/* Subtraction Step Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="space-y-3 max-w-md mx-auto">
                    {/* Start Card */}
                    <div className="p-2.5 bg-white border border-[#16241f]/20 rounded-xl flex justify-between items-center text-xs font-bold">
                      <span>Start Number:</span>
                      <span className="text-base font-black text-[#16241f]">6.8</span>
                    </div>

                    {/* Step 1 Card */}
                    <div className={`p-2.5 rounded-xl border flex justify-between items-center text-xs font-bold transition-all duration-300 ${demoStep >= 1 ? 'bg-[#16241f] text-white border-[#16241f] shadow-md' : 'bg-white border-[#16241f]/20 text-[#16241f]/60'}`}>
                      <span>Step 1: Take away 2 wholes (6.8 - 2.0)</span>
                      <span className="text-base font-black">4.8</span>
                    </div>

                    {/* Step 2 Card */}
                    <div className={`p-2.5 rounded-xl border flex justify-between items-center text-xs font-bold transition-all duration-300 ${demoStep >= 2 ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20 text-[#16241f]/60'}`}>
                      <span>Step 2: Take away 5 tenths (4.8 - 0.5)</span>
                      <span className="text-base font-black">4.3</span>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ➖ Take away 2 wholes from 6.8 to get 4.8!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 Take away 5 tenths from 4.8 to get 4.3!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Subtract 2 Wholes'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Subtract 5 Tenths'
                    : '🔄 Reset Subtraction Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'addition_34_23' ? (
                <>
                  {demoStep === 0 && 'Calculating 3.4 + 2.3 by splitting wholes and tenths. Click Combine Whole Numbers!'}
                  {demoStep === 1 && 'Combine the whole numbers: 3 wholes plus 2 wholes equals 5 wholes!'}
                  {demoStep === 2 && 'Combine the tenths: 0.4 plus 0.3 equals 0.7 tenths! Combining 5 wholes and 0.7 tenths gives 5.7!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Calculating 6.8 - 2.5 by taking away wholes then tenths. Click Subtract Wholes!'}
                  {demoStep === 1 && 'Take away 2 wholes from 6.8 to get 4.8!'}
                  {demoStep === 2 && 'Take away 5 tenths from 4.8 to get 4.3! Always keep the decimal points lined up so you never mix up whole ones with tenths.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Adding and Subtracting Decimals</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Always keep the decimal points lined up so you never mix up whole ones with tenths!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('addition_34_23');
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

export default DecimalAdditionPlayer;
