import React, { useState, useEffect, useCallback } from 'react';

export interface DecomposeRegroupPlayerProps {
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
    questionText: 'When you decompose the decimal number 23.45 into standard place value parts, what do you get?',
    options: [
      '20 + 3 + 0.4 + 0.05',
      '2 + 3 + 4 + 5',
      '200 + 30 + 4 + 5'
    ],
    correctIndex: 0,
    hint: 'Decomposing 23.45 breaks it into tens (20), ones (3), tenths (0.4), and hundredths (0.05): 20 + 3 + 0.4 + 0.05.'
  },
  {
    id: 2,
    questionText: 'Which of the following shows a correct regrouping of the decimal number 4.3?',
    options: [
      '3 ones and 13 tenths (or 43 tenths)',
      '4 ones and 3 hundredths',
      '2 ones and 3 tenths'
    ],
    correctIndex: 0,
    hint: 'Trading 1 whole from 4.3 gives 10 tenths, making 3 ones and 13 tenths (or 43 tenths in total).'
  },
  {
    id: 3,
    questionText: 'What happens whenever you trade one unit to the right on a place value chart?',
    options: [
      'It stays the exact same size without splitting',
      'Whenever you trade one unit to the right on a place value chart, it splits into ten smaller pieces',
      'It splits into one hundred larger pieces'
    ],
    correctIndex: 1,
    hint: 'Whenever you trade one unit to the right on a place value chart, it splits into ten smaller pieces.'
  }
];

export const DecomposeRegroupPlayer: React.FC<DecomposeRegroupPlayerProps> = ({
  conceptName = 'Concept 7.2: Decomposing and Regrouping Decimals',
  unitTitle = 'Unit 7: Number (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'decompose_2345' | 'regroup_43'>('decompose_2345');
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
        'Decomposing means breaking a decimal into its standard place value parts, while regrouping means rearranging those parts into different combinations of the same total value. A decimal can be partitioned into ones, tenths, and hundredths. Whenever you trade one unit to the right on a place value chart, it splits into ten smaller pieces.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'decompose_2345') {
        const desc =
          demoStep === 0
            ? 'Decomposing 23.45 into standard place value parts. Click Partition Place Values!'
            : demoStep === 1
            ? '23.45 partitions into 20 tens, 3 ones, 0.4 tenths, and 0.05 hundredths!'
            : '20 + 3 + 0.4 + 0.05 = 23.45! Decomposing breaks a number into tens, ones, tenths, and hundredths.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Regrouping 4.3 into different combinations. Click Trade 1 Whole for 10 Tenths!'
            : demoStep === 1
            ? 'Trade 1 whole from 4 ones to get 3 ones and 10 extra tenths! 3 ones plus 13 tenths equals 4.3!'
            : 'Regrouping all 4 wholes into tenths gives 43 tenths! Whenever you trade one unit to the right on a place value chart, it splits into ten smaller pieces.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Decomposing and Regrouping Decimals! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'decompose_2345' | 'regroup_43') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'decompose_2345') {
      safeNarrate('Decomposing 23.45 into standard place value parts. Click Partition Place Values!');
    } else {
      safeNarrate('Regrouping 4.3 into different combinations. Click Trade 1 Whole for 10 Tenths!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'decompose_2345') {
      const desc =
        next === 0
          ? 'Decomposing 23.45 into standard place value parts. Click Partition Place Values!'
          : next === 1
          ? '23.45 partitions into 20 tens, 3 ones, 0.4 tenths, and 0.05 hundredths!'
          : '20 + 3 + 0.4 + 0.05 = 23.45! Decomposing breaks a number into tens, ones, tenths, and hundredths.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Regrouping 4.3 into different combinations. Click Trade 1 Whole for 10 Tenths!'
          : next === 1
          ? 'Trade 1 whole from 4 ones to get 3 ones and 10 extra tenths! 3 ones plus 13 tenths equals 4.3!'
          : 'Regrouping all 4 wholes into tenths gives 43 tenths! Whenever you trade one unit to the right on a place value chart, it splits into ten smaller pieces.';
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
              <strong>Decomposing</strong> means breaking a decimal into its standard place value parts, while <strong>regrouping</strong> means rearranging those parts into different combinations of the same total value. 
              A decimal can be partitioned into ones, tenths, and hundredths. 
              Whenever you trade one unit to the right on a place value chart, it <strong>splits into ten smaller pieces</strong>.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Decomposing Example (23.45)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  23.45 = 20 + 3 + 0.4 + 0.05
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Partitioned into tens, ones, tenths, and hundredths.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                🧩 20+3+0.4+0.05
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Regrouping Example (4.3)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  4.3 = 3 ones and 13 tenths (or 43 tenths)
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Trading 1 whole gives 10 smaller tenths.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                ⚖️ 3 Ones + 13 Tenths
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Decomposing & Regrouping Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('decompose_2345')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'decompose_2345'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🧩 Decomposing (23.45)
            </button>
            <button
              onClick={() => handleSelectDemoMode('regroup_43')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'regroup_43'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ⚖️ Regrouping (4.3)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'decompose_2345' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Decomposing 23.45 into Place Value Parts
                </h3>

                {/* Place Value Blocks Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                    {/* Tens */}
                    <div
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        demoStep >= 1 ? 'bg-[#16241f] text-white border-[#16241f] shadow-md' : 'bg-white border-[#16241f]/20'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block opacity-75">Tens</span>
                      <span className="text-xl font-black">20</span>
                      <span className="text-[9px] block mt-0.5">2 Tens</span>
                    </div>

                    {/* Ones */}
                    <div
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        demoStep >= 1 ? 'bg-[#16241f]/80 text-white border-[#16241f] shadow-md' : 'bg-white border-[#16241f]/20'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block opacity-75">Ones</span>
                      <span className="text-xl font-black">3</span>
                      <span className="text-[9px] block mt-0.5">3 Ones</span>
                    </div>

                    {/* Tenths */}
                    <div
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        demoStep >= 1 ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block opacity-75">Tenths</span>
                      <span className="text-xl font-black">0.4</span>
                      <span className="text-[9px] block mt-0.5">4 Tenths</span>
                    </div>

                    {/* Hundredths */}
                    <div
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        demoStep >= 1 ? 'bg-[#9c6f1f]/80 text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block opacity-75">Hundredths</span>
                      <span className="text-xl font-black">0.05</span>
                      <span className="text-[9px] block mt-0.5">5 Hundredths</span>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f]/10 border border-[#9c6f1f]/30 rounded-xl text-xs font-bold text-[#9c6f1f] animate-fade-in">
                      ✨ 23.45 partitions into 20 + 3 + 0.4 + 0.05!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🧩 Decomposing breaks a decimal into standard place value columns.
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Partition Place Values'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Confirm Sum (20 + 3 + 0.4 + 0.05)'
                    : '🔄 Reset Decomposing Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Regrouping 4.3 (Trading 1 Whole for 10 Tenths)
                </h3>

                {/* Regrouping Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    {/* Standard Form */}
                    <div className="p-3 bg-white border border-[#16241f]/20 rounded-xl text-center">
                      <span className="text-[10px] font-bold uppercase text-[#16241f]/60 block">Standard Form</span>
                      <span className="text-lg font-black text-[#16241f] block my-1">4.3</span>
                      <span className="text-xs font-bold text-[#16241f]">4 Ones + 3 Tenths</span>
                    </div>

                    {/* Regrouped Form */}
                    <div
                      className={`p-3 rounded-xl border-2 text-center transition-all duration-300 ${
                        demoStep >= 1
                          ? 'bg-[#16241f] text-white border-[#16241f] shadow-md'
                          : 'bg-white border-[#16241f]/20 text-[#16241f]'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase block opacity-75">Regrouped Form</span>
                      <span className="text-lg font-black block my-1">{demoStep === 2 ? '43 Tenths' : '3.13'}</span>
                      <span className="text-xs font-bold">
                        {demoStep === 2 ? '43 Tenths Total' : '3 Ones + 13 Tenths'}
                      </span>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f]/10 border border-[#16241f]/30 rounded-xl text-xs font-bold text-[#16241f] animate-fade-in">
                      ⚖️ Trading 1 whole from 4 ones gives 10 extra tenths: 3 ones + 13 tenths = 4.3!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      💡 Regrouping all 4 wholes gives 43 tenths in total!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Trade 1 Whole for 10 Tenths'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Show Total as 43 Tenths'
                    : '🔄 Reset Regrouping Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'decompose_2345' ? (
                <>
                  {demoStep === 0 && 'Decomposing 23.45 into standard place value parts. Click Partition Place Values!'}
                  {demoStep === 1 && '23.45 partitions into 20 tens, 3 ones, 0.4 tenths, and 0.05 hundredths!'}
                  {demoStep === 2 && '20 + 3 + 0.4 + 0.05 = 23.45! Decomposing breaks a number into tens, ones, tenths, and hundredths.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Regrouping 4.3 into different combinations. Click Trade 1 Whole for 10 Tenths!'}
                  {demoStep === 1 && 'Trade 1 whole from 4 ones to get 3 ones and 10 extra tenths! 3 ones plus 13 tenths equals 4.3!'}
                  {demoStep === 2 && 'Regrouping all 4 wholes into tenths gives 43 tenths! Whenever you trade one unit to the right on a place value chart, it splits into ten smaller pieces.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Decomposing and Regrouping Decimals</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Whenever you trade one unit to the right on a place value chart, it splits into ten smaller pieces.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('decompose_2345');
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

export default DecomposeRegroupPlayer;
