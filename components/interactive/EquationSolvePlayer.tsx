import React, { useState, useEffect, useCallback } from 'react';

export interface EquationSolvePlayerProps {
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
    questionText: 'If 3 identical toy trucks cost $18 altogether, how do you find the cost of one truck?',
    options: [
      'Divide $18 by 3 to find that one truck costs $6',
      'Multiply $18 by 3 to get $54',
      'Subtract 3 from 18 to get $15'
    ],
    correctIndex: 0,
    hint: 'If an equation has multiple identical shapes or items, divide the total equally to find the value of one item: $18 ÷ 3 = $6.'
  },
  {
    id: 2,
    questionText: 'If a mystery number plus 6 equals 15, what inverse operation finds the mystery number?',
    options: [
      'Add 15 and 6 to get 21',
      'Use inverse subtraction: 15 minus 6 tells you the mystery number is 9',
      'Multiply 15 by 6 to get 90'
    ],
    correctIndex: 1,
    hint: 'Inverse operations undo each other. Addition undoes subtraction, so use 15 - 6 = 9.'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember when finding a missing part in an equation?',
    options: [
      'Always add all the numbers in the problem together',
      'To find a missing part, use the opposite operation to work backward',
      'Guess random numbers until one works'
    ],
    correctIndex: 1,
    hint: 'To find a missing part, use the opposite operation to work backward.'
  }
];

export const EquationSolvePlayer: React.FC<EquationSolvePlayerProps> = ({
  conceptName = 'Concept 3.3: Finding Unknowns in Missing Number Problems',
  unitTitle = 'Unit 3: Calculation (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'toy_trucks' | 'inverse_sub'>('toy_trucks');
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
        'Missing number puzzles use shapes or symbols to stand for quantities we do not know yet, which we solve using inverse operations. A symbol like a square or triangle stands in place of a specific unknown number. Inverse operations undo each other: addition undoes subtraction, and multiplication undoes division.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'toy_trucks') {
        const desc =
          demoStep === 0
            ? '3 identical toy trucks cost $18 altogether. Click Divide Equally to split the total by 3!'
            : demoStep === 1
            ? 'Dividing $18 into 3 equal parts gives $18 ÷ 3 = $6 for each truck.'
            : 'Each toy truck costs $6! $6 + $6 + $6 = $18.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'A mystery number ⬜ plus 6 equals 15 (⬜ + 6 = 15). Click Use Inverse Subtraction to solve!'
            : demoStep === 1
            ? 'Use the inverse operation: 15 minus 6 equals 9!'
            : 'The mystery number is 9! 9 + 6 = 15.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Finding Unknowns in Missing Number Problems! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'toy_trucks' | 'inverse_sub') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'toy_trucks') {
      safeNarrate('3 identical toy trucks cost $18 altogether. Click Divide Equally to split the total by 3!');
    } else {
      safeNarrate('A mystery number ⬜ plus 6 equals 15 (⬜ + 6 = 15). Click Use Inverse Subtraction to solve!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'toy_trucks') {
      const desc =
        next === 0
          ? '3 identical toy trucks cost $18 altogether. Click Divide Equally to split the total by 3!'
          : next === 1
          ? 'Dividing $18 into 3 equal parts gives $18 ÷ 3 = $6 for each truck.'
          : 'Each toy truck costs $6! $6 + $6 + $6 = $18.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'A mystery number ⬜ plus 6 equals 15 (⬜ + 6 = 15). Click Use Inverse Subtraction to solve!'
          : next === 1
          ? 'Use the inverse operation: 15 minus 6 equals 9!'
          : 'The mystery number is 9! 9 + 6 = 15.';
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
              Core Definition & Rules
            </h3>
            <p className="text-sm leading-relaxed text-[#16241f]">
              Missing number puzzles use shapes or symbols to stand for quantities we do not know yet, which we solve using <strong>inverse operations</strong>. 
              A symbol like a square or triangle stands in place of a specific unknown number. 
              <strong> Inverse operations undo each other:</strong> addition undoes subtraction, and multiplication undoes division. 
              If an equation has <strong>multiple identical shapes</strong>, divide the total equally to find the value of one shape.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Identical Items Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  3 identical toy trucks cost $18 ➔ $18 ÷ 3 = $6 per truck
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Divide the total equally to find the value of one identical item.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                🚚 $18 ÷ 3 = $6
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Inverse Operation Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Mystery number + 6 = 15 ➔ 15 - 6 = 9
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Use subtraction to undo addition and find the missing part.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                ❓ 15 - 6 = 9
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Equation Solver Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('toy_trucks')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'toy_trucks'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🚚 3 Trucks ($18 ÷ 3)
            </button>
            <button
              onClick={() => handleSelectDemoMode('inverse_sub')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'inverse_sub'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ❓ Inverse Subtraction (⬜ + 6 = 15)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'toy_trucks' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Finding Value of 1 Identical Item ($18 Total)
                </h3>

                {/* Toy Trucks Visual */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  {demoStep === 0 && (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex justify-center items-center gap-3 text-2xl">
                        <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">🚚</span>
                        <span>+</span>
                        <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">🚚</span>
                        <span>+</span>
                        <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">🚚</span>
                        <span className="text-lg font-black text-[#16241f]">= $18</span>
                      </div>
                      <span className="text-xs font-semibold text-[#16241f]/70">
                        3 identical toy trucks cost $18 altogether.
                      </span>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-[#9c6f1f]/10 border-2 border-[#9c6f1f] rounded-xl inline-block text-lg font-black text-[#9c6f1f]">
                        $18 ÷ 3 = $6
                      </div>
                      <span className="text-xs font-bold text-[#9c6f1f] mt-1">
                        ✨ Divide the total $18 equally into 3 parts!
                      </span>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex justify-center items-center gap-3 text-lg font-black text-[#16241f]">
                        <div className="p-2.5 bg-white rounded-xl border border-[#16241f]/20 flex flex-col items-center">
                          <span>🚚</span>
                          <span className="text-xs text-[#9c6f1f] font-bold">$6</span>
                        </div>
                        <span>+</span>
                        <div className="p-2.5 bg-white rounded-xl border border-[#16241f]/20 flex flex-col items-center">
                          <span>🚚</span>
                          <span className="text-xs text-[#9c6f1f] font-bold">$6</span>
                        </div>
                        <span>+</span>
                        <div className="p-2.5 bg-white rounded-xl border border-[#16241f]/20 flex flex-col items-center">
                          <span>🚚</span>
                          <span className="text-xs text-[#9c6f1f] font-bold">$6</span>
                        </div>
                        <span>=</span>
                        <span className="p-3 bg-[#16241f] text-white rounded-xl shadow-md">$18</span>
                      </div>
                      <span className="text-xs font-bold text-[#16241f] mt-1">
                        🎉 Each truck costs $6!
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '➗ Step 1: Divide Total ($18 ÷ 3)'
                    : demoStep === 1
                    ? '✅ Step 2: Confirm Each Truck Price ($6)'
                    : '🔄 Reset Toy Trucks Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Using Inverse Operation: ⬜ + 6 = 15
                </h3>

                {/* Mystery Number Visual */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  {demoStep === 0 && (
                    <div className="flex justify-center items-center gap-3 text-xl font-black text-[#16241f]">
                      <span className="px-4 py-3 bg-white border-2 border-dashed border-[#16241f]/40 rounded-xl text-2xl">
                        ❓
                      </span>
                      <span>+</span>
                      <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">6</span>
                      <span>=</span>
                      <span className="p-3 bg-[#16241f] text-white rounded-xl">15</span>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-[#16241f]/10 border-2 border-[#16241f] rounded-xl inline-block text-lg font-black text-[#16241f]">
                        15 - 6 = 9
                      </div>
                      <span className="text-xs font-bold text-[#16241f]">
                        🔄 Inverse subtraction undoes addition: 15 - 6!
                      </span>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex justify-center items-center gap-3 text-xl font-black text-[#16241f]">
                        <span className="p-3 bg-[#9c6f1f] text-white rounded-xl shadow-md">9</span>
                        <span>+</span>
                        <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">6</span>
                        <span>=</span>
                        <span className="p-3 bg-[#16241f] text-white rounded-xl shadow-md">15</span>
                      </div>
                      <span className="text-xs font-bold text-[#16241f]">
                        🎉 Mystery number is 9! 9 + 6 = 15.
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🔄 Step 1: Use Inverse Subtraction (15 - 6)'
                    : demoStep === 1
                    ? '✅ Step 2: Confirm Mystery Number (9)'
                    : '🔄 Reset Inverse Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'toy_trucks' ? (
                <>
                  {demoStep === 0 && '3 identical toy trucks cost $18 altogether. Click Divide Equally to split the total by 3!'}
                  {demoStep === 1 && 'Dividing $18 into 3 equal parts gives $18 ÷ 3 = $6 for each truck.'}
                  {demoStep === 2 && 'Each toy truck costs $6! $6 + $6 + $6 = $18.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'A mystery number ⬜ plus 6 equals 15 (⬜ + 6 = 15). Click Use Inverse Subtraction to solve!'}
                  {demoStep === 1 && 'Use the inverse operation: 15 minus 6 equals 9!'}
                  {demoStep === 2 && 'The mystery number is 9! 9 + 6 = 15.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Finding Unknowns in Missing Number Problems</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              To find a missing part, use the opposite operation to work backward.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('toy_trucks');
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

export default EquationSolvePlayer;
