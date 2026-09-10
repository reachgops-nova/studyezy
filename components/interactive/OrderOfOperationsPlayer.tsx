import React, { useState, useEffect, useCallback } from 'react';

export interface OrderOfOperationsPlayerProps {
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
    questionText: 'When solving the expression 5 + 6 x 2, which operation must be completed first and what is the final answer?',
    options: [
      'Multiply 6 x 2 first to get 12, then add 5 to equal 17',
      'Add 5 + 6 first to get 11, then multiply by 2 to equal 22',
      'Multiply 5 x 2 first to get 10, then add 6 to equal 16'
    ],
    correctIndex: 0,
    hint: 'In 5 + 6 x 2, solve 6 x 2 first to get 12, then add 5 to equal 17.'
  },
  {
    id: 2,
    questionText: 'When evaluating 36 / 4 - 5, what is the step-by-step solution?',
    options: [
      'Divide 36 by 4 first to get 9, then subtract 5 to get 4',
      'Subtract 4 - 5 first to get -1, then divide 36 by -1',
      'Divide 36 by 5 first to get 7.2, then subtract 4'
    ],
    correctIndex: 0,
    hint: 'In 36 / 4 - 5, divide 36 by 4 first to get 9, then subtract 5 to get 4.'
  },
  {
    id: 3,
    questionText: 'What is the priority rule to remember when an expression contains multiple operations without brackets?',
    options: [
      'Multiply and divide before you add and subtract, unless brackets tell you otherwise',
      'Always add and subtract from right to left first',
      'Do whichever operation has the largest numbers first'
    ],
    correctIndex: 0,
    hint: 'Multiply and divide before you add and subtract, unless brackets tell you otherwise!'
  }
];

export const OrderOfOperationsPlayer: React.FC<OrderOfOperationsPlayerProps> = ({
  conceptName = 'Concept 9.5: Order of Operations',
  unitTitle = 'Unit 9: Calculation (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'expression_5_6_2' | 'expression_36_4_5'>('expression_5_6_2');
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
        'When a mathematical expression contains multiple operations, we follow set priority rules by completing multiplication and division before addition and subtraction. In expressions without brackets, multiplication and division always take precedence over addition and subtraction. Addition and subtraction have equal priority and are completed from left to right when they appear together. Multiply and divide before you add and subtract, unless brackets tell you otherwise!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'expression_5_6_2') {
        const desc =
          demoStep === 0
            ? 'Evaluating 5 + 6 x 2 using order of operations. Click Solve Multiplication (6 x 2)!'
            : demoStep === 1
            ? 'Multiplication takes priority! Solve 6 x 2 first to get 12!'
            : 'Now perform addition: 5 + 12 = 17! In the expression 5 + 6 x 2, solve 6 x 2 first to get 12, then add 5 to equal 17!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Evaluating 36 / 4 - 5 using order of operations. Click Solve Division (36 / 4)!'
            : demoStep === 1
            ? 'Division takes priority! Divide 36 by 4 first to get 9!'
            : 'Now perform subtraction: 9 - 5 = 4! In the expression 36 / 4 - 5, divide 36 by 4 first to get 9, then subtract 5 to get 4!';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Order of Operations! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'expression_5_6_2' | 'expression_36_4_5') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'expression_5_6_2') {
      safeNarrate('Evaluating 5 + 6 x 2 using order of operations. Click Solve Multiplication (6 x 2)!');
    } else {
      safeNarrate('Evaluating 36 / 4 - 5 using order of operations. Click Solve Division (36 / 4)!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'expression_5_6_2') {
      const desc =
        next === 0
          ? 'Evaluating 5 + 6 x 2 using order of operations. Click Solve Multiplication (6 x 2)!'
          : next === 1
          ? 'Multiplication takes priority! Solve 6 x 2 first to get 12!'
          : 'Now perform addition: 5 + 12 = 17! In the expression 5 + 6 x 2, solve 6 x 2 first to get 12, then add 5 to equal 17!';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Evaluating 36 / 4 - 5 using order of operations. Click Solve Division (36 / 4)!'
          : next === 1
          ? 'Division takes priority! Divide 36 by 4 first to get 9!'
          : 'Now perform subtraction: 9 - 5 = 4! In the expression 36 / 4 - 5, divide 36 by 4 first to get 9, then subtract 5 to get 4!';
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
              When a mathematical expression contains multiple operations, we follow <strong>set priority rules</strong> by completing <strong>multiplication and division before addition and subtraction</strong>. 
              In expressions without brackets, multiplication and division always take precedence over addition and subtraction. 
              Addition and subtraction have equal priority and are completed from left to right when they appear together. 
              Ignoring operation priority changes the meaning of the problem and leads to incorrect results.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Multiplication First Example (5 + 6 × 2)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  5 + 6 × 2 ➔ Solve 6 × 2 = 12 first ➔ 5 + 12 = 17
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Multiply before adding!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                ✖️ 17
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Division First Example (36 ÷ 4 - 5)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  36 ÷ 4 - 5 ➔ Solve 36 ÷ 4 = 9 first ➔ 9 - 5 = 4
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Divide before subtracting!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                ➗ 4
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Order of Operations Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('expression_5_6_2')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'expression_5_6_2'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ✖️ Multiply First (5 + 6 × 2)
            </button>
            <button
              onClick={() => handleSelectDemoMode('expression_36_4_5')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'expression_36_4_5'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ➗ Divide First (36 ÷ 4 - 5)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'expression_5_6_2' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Evaluating 5 + 6 × 2 (Multiplication Priority)
                </h3>

                {/* Visual Step-by-Step Operation Cards */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="flex items-center justify-center gap-2 max-w-md mx-auto font-mono text-[#16241f]">
                    {/* Part 1: 5 + */}
                    <div className="p-3 bg-white border border-[#16241f]/20 rounded-xl font-bold text-base">
                      5 +
                    </div>

                    {/* Part 2: 6 x 2 */}
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 1 ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20'}`}>
                      <span className="text-[9px] uppercase font-sans font-bold block opacity-75">Priority 1</span>
                      <span className="text-base font-black">{demoStep >= 1 ? '12' : '6 × 2'}</span>
                    </div>

                    <span className="text-xl font-bold text-[#16241f]">=</span>

                    {/* Final Result */}
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 2 ? 'bg-[#16241f] text-white border-[#16241f] shadow-md' : 'bg-white border-[#16241f]/20 text-[#16241f]/40'}`}>
                      <span className="text-[9px] uppercase font-sans font-bold block opacity-75">Priority 2</span>
                      <span className="text-base font-black">{demoStep >= 2 ? '17' : '?'}</span>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ✨ Solve multiplication first: 6 × 2 = 12!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 Perform addition: 5 + 12 = 17! Multiply and divide before you add and subtract.
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Solve Multiplication (6 × 2 = 12)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Solve Addition (5 + 12 = 17)'
                    : '🔄 Reset Multiplication Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Evaluating 36 ÷ 4 - 5 (Division Priority)
                </h3>

                {/* Visual Step-by-Step Operation Cards */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="flex items-center justify-center gap-2 max-w-md mx-auto font-mono text-[#16241f]">
                    {/* Part 1: 36 ÷ 4 */}
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 1 ? 'bg-[#16241f] text-white border-[#16241f] shadow-md' : 'bg-white border-[#16241f]/20'}`}>
                      <span className="text-[9px] uppercase font-sans font-bold block opacity-75">Priority 1</span>
                      <span className="text-base font-black">{demoStep >= 1 ? '9' : '36 ÷ 4'}</span>
                    </div>

                    {/* Part 2: - 5 */}
                    <div className="p-3 bg-white border border-[#16241f]/20 rounded-xl font-bold text-base">
                      - 5
                    </div>

                    <span className="text-xl font-bold text-[#16241f]">=</span>

                    {/* Final Result */}
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${demoStep >= 2 ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md' : 'bg-white border-[#16241f]/20 text-[#16241f]/40'}`}>
                      <span className="text-[9px] uppercase font-sans font-bold block opacity-75">Priority 2</span>
                      <span className="text-base font-black">{demoStep >= 2 ? '4' : '?'}</span>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ✨ Solve division first: 36 ÷ 4 = 9!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 Perform subtraction: 9 - 5 = 4! Divide before subtracting.
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Solve Division (36 ÷ 4 = 9)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Solve Subtraction (9 - 5 = 4)'
                    : '🔄 Reset Division Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'expression_5_6_2' ? (
                <>
                  {demoStep === 0 && 'Evaluating 5 + 6 x 2 using order of operations. Click Solve Multiplication (6 x 2)!'}
                  {demoStep === 1 && 'Multiplication takes priority! Solve 6 x 2 first to get 12!'}
                  {demoStep === 2 && 'Now perform addition: 5 + 12 = 17! In the expression 5 + 6 x 2, solve 6 x 2 first to get 12, then add 5 to equal 17!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Evaluating 36 / 4 - 5 using order of operations. Click Solve Division (36 / 4)!'}
                  {demoStep === 1 && 'Division takes priority! Divide 36 by 4 first to get 9!'}
                  {demoStep === 2 && 'Now perform subtraction: 9 - 5 = 4! In the expression 36 / 4 - 5, divide 36 by 4 first to get 9, then subtract 5 to get 4!'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Order of Operations</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Multiply and divide before you add and subtract, unless brackets tell you otherwise!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('expression_5_6_2');
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

export default OrderOfOperationsPlayer;
