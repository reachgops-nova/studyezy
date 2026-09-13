import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTAddSubtractDecimalsPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type RCRTStep = 'READ' | 'COVER' | 'RECITE' | 'TEST';
type Phase = 'rcrt_loop' | 'checkpoint_quiz' | 'passed';

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
    questionText: 'What is the golden rule when setting up written addition or subtraction for decimal numbers?',
    options: [
      'Line up the numbers strictly by their decimal points so matching place values sit in the same column',
      'Align all numbers to the far right regardless of the decimal point',
      'Remove the decimal points before calculating and never put them back'
    ],
    correctIndex: 0,
    hint: 'Line up decimal points first! Tenths sit under tenths, and hundredths sit under hundredths.'
  },
  {
    id: 2,
    questionText: 'When adding 1.35 + 1.24 column-by-column, what is the correct sum?',
    options: [
      '2.59 — because 1+1=2 ones, 0.3+0.2=0.5 tenths, and 0.05+0.04=0.09 hundredths',
      '2.11',
      '3.59'
    ],
    correctIndex: 0,
    hint: 'Add hundredths (5+4=9), tenths (3+2=5), and ones (1+1=2) to get 2.59!'
  },
  {
    id: 3,
    questionText: 'When subtracting 6.48 - 3.25, what is the result?',
    options: [
      '3.23 — because 8-5=3 hundredths, 4-2=2 tenths, and 6-3=3 ones',
      '3.11',
      '9.73'
    ],
    correctIndex: 0,
    hint: 'Subtract hundredths (8-5=3), tenths (4-2=2), and ones (6-3=3) to get 3.23!'
  }
];

export const RCRTAddSubtractDecimalsPlayer: React.FC<RCRTAddSubtractDecimalsPlayerProps> = ({
  conceptName = 'Concept 15.4: Adding and Subtracting Decimals',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 15: Calculation)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Test Stepper State
  const [task1Solved, setTask1Solved] = useState<boolean>(false); // 1.35 + 1.24 = 2.59
  const [task2Solved, setTask2Solved] = useState<boolean>(false); // 6.48 - 3.25 = 3.23

  const [reciteSpoken, setReciteSpoken] = useState<boolean>(false);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);

  // Quiz State
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
    if (phase === 'rcrt_loop') {
      if (rcrtStep === 'READ') {
        safeNarrate(
          'STEP 1: READ. Adding and subtracting decimals: Always line up the decimal points first! Tenths sit under tenths, hundredths under hundredths. For 1.35 plus 1.24, add hundredths to get 9, tenths to get 5, and ones to get 2, giving 2.59!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is hidden! Lock the decimal alignment rule in your working memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Line up decimal points first, then add or subtract column by column!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Solve the decimal addition and subtraction tasks column by column.'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Adding and Subtracting Decimals with RCRT active recall and earned 3 stars!'
      );
    }
  }, [phase, rcrtStep, quizIndex, safeNarrate]);

  const handleNextRcrtStep = () => {
    if (rcrtStep === 'READ') {
      setRcrtStep('COVER');
    } else if (rcrtStep === 'COVER') {
      setRcrtStep('RECITE');
    } else if (rcrtStep === 'RECITE') {
      setRcrtStep('TEST');
    } else if (rcrtStep === 'TEST') {
      setPhase('checkpoint_quiz');
    }
  };

  const handleSolveTask1 = (val: string) => {
    if (val === '2.59') {
      setTask1Solved(true);
      safeNarrate('Correct! 1.35 plus 1.24 equals 2.59!');
      if (task2Solved) {
        setTestCompleted(true);
        setStars((prev) => prev + 1);
      }
    } else {
      safeNarrate('Try again! Line up decimals: 1.35 + 1.24 = 2.59.');
    }
  };

  const handleSolveTask2 = (val: string) => {
    if (val === '3.23') {
      setTask2Solved(true);
      safeNarrate('Correct! 6.48 minus 3.25 equals 3.23!');
      if (task1Solved) {
        setTestCompleted(true);
        setStars((prev) => prev + 1);
      }
    } else {
      safeNarrate('Try again! Line up decimals: 6.48 - 3.25 = 3.23.');
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
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#16241f]/10">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-[#9c6f1f] bg-[#9c6f1f]/10 px-2.5 py-0.5 rounded-full border border-[#9c6f1f]/20">
            🧠 RCRT Active Recall Loop
          </span>
          <h2 className="text-lg font-bold text-[#16241f] mt-1">{conceptName}</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#9c6f1f]/10 rounded-full border border-[#9c6f1f]/30">
          <span className="text-base">⭐</span>
          <span className="text-xs font-black text-[#9c6f1f]">{stars} Stars</span>
        </div>
      </div>

      {/* RCRT 4-Step Progress Indicator */}
      {phase === 'rcrt_loop' && (
        <div className="grid grid-cols-4 gap-2 mb-6 text-center">
          <div className={`p-2 rounded-xl border-2 font-bold text-xs transition-all ${rcrtStep === 'READ' ? 'bg-[#16241f] text-white border-[#16241f] shadow-md scale-105' : 'bg-white text-[#16241f]/40 border-[#16241f]/15'}`}>
            1️⃣ READ
          </div>
          <div className={`p-2 rounded-xl border-2 font-bold text-xs transition-all ${rcrtStep === 'COVER' ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md scale-105' : 'bg-white text-[#16241f]/40 border-[#16241f]/15'}`}>
            2️⃣ COVER
          </div>
          <div className={`p-2 rounded-xl border-2 font-bold text-xs transition-all ${rcrtStep === 'RECITE' ? 'bg-[#16241f] text-white border-[#16241f] shadow-md scale-105' : 'bg-white text-[#16241f]/40 border-[#16241f]/15'}`}>
            3️⃣ RECITE
          </div>
          <div className={`p-2 rounded-xl border-2 font-bold text-xs transition-all ${rcrtStep === 'TEST' ? 'bg-[#16241f] text-white border-[#16241f] shadow-md scale-105' : 'bg-white text-[#16241f]/40 border-[#16241f]/15'}`}>
            4️⃣ TEST
          </div>
        </div>
      )}

      {/* Phase: RCRT Loop */}
      {phase === 'rcrt_loop' && (
        <div className="space-y-5 animate-fade-in">
          {/* STEP 1: READ */}
          {rcrtStep === 'READ' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#9c6f1f] font-bold text-xs uppercase tracking-wider">
                <span>📖 Step 1: Read & Observe the Rule</span>
              </div>
              
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10">
                <h3 className="font-bold text-base text-[#16241f] mb-1">
                  Rule: Decimal Point Column Alignment
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Always line up the decimal points!</strong> Ones sit under ones, tenths under tenths, hundredths under hundredths.<br/>
                  • Calculate column-by-column starting from the rightmost place value.
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f] font-mono space-y-1">
                  <div>1.35 + 1.24 ➔ (1+1=2) . (3+2=5) (5+4=9) ➔ 2.59</div>
                  <div>6.48 - 3.25 ➔ (6-3=3) . (4-2=2) (8-5=3) ➔ 3.23</div>
                </div>
              </div>

              <button
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#16241f]/90"
              >
                I Have Read & Understood! Now Cover the Rule 🙈 ➔
              </button>
            </div>
          )}

          {/* STEP 2: COVER */}
          {rcrtStep === 'COVER' && (
            <div className="p-8 bg-[#16241f] text-white rounded-2xl shadow-xl text-center space-y-4 animate-shake">
              <div className="text-5xl">🙈</div>
              <h3 className="text-lg font-black text-[#9c6f1f]">Step 2: Rule Covered!</h3>
              <p className="text-xs text-[#f4f6f1]/80 max-w-sm mx-auto leading-relaxed">
                The rule card is hidden! Lock the decimal alignment rule in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Decimal column alignment rule locked in memory...
              </div>
              <button
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#9c6f1f]/90"
              >
                Proceed to Step 3: Recite Aloud 🎙️ ➔
              </button>
            </div>
          )}

          {/* STEP 3: RECITE */}
          {rcrtStep === 'RECITE' && (
            <div className="p-6 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm text-center space-y-5">
              <div className="text-4xl">🎙️</div>
              <h3 className="text-base font-bold text-[#16241f]">
                Step 3: Recite the Rule Out Loud!
              </h3>
              <p className="text-xs text-[#16241f]/80 max-w-md mx-auto">
                Verbalizing concepts locks them into long-term memory. Say this rule out loud to your parent or partner right now:
              </p>

              <div className="p-4 bg-[#f4f6f1] rounded-xl border-2 border-dashed border-[#9c6f1f]/40">
                <p className="text-sm font-black text-[#9c6f1f]">
                  "Line up decimal points first, then add or subtract column by column!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Line up decimal points first, then add or subtract column by column!');
                  }}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${reciteSpoken ? 'bg-emerald-600 text-white' : 'bg-[#9c6f1f] text-white shadow'}`}
                >
                  {reciteSpoken ? '✅ Recited Aloud!' : '🗣️ Tap to Practice Reciting'}
                </button>
              </div>

              <button
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#16241f]/90"
              >
                Ready for Step 4: Active Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE DECIMAL COLUMN CANVAS) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Decimal Column Aligner
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Active Doing Test
                </span>
              </div>

              {/* Task 1: 1.35 + 1.24 */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 space-y-2 text-center">
                <div className="text-xs font-bold text-[#16241f] font-mono">
                  Task 1: Add 1.35 + 1.24
                </div>
                <div className="flex gap-2 justify-center font-mono">
                  {['2.49', '2.59', '2.69'].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleSolveTask1(val)}
                      className={`px-4 py-2 rounded-lg font-bold text-xs border transition-all ${
                        task1Solved && val === '2.59'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-[#16241f] border-[#16241f]/20 hover:bg-gray-50'
                      }`}
                    >
                      {val} {task1Solved && val === '2.59' && '✓'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Task 2: 6.48 - 3.25 */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 space-y-2 text-center">
                <div className="text-xs font-bold text-[#16241f] font-mono">
                  Task 2: Subtract 6.48 - 3.25
                </div>
                <div className="flex gap-2 justify-center font-mono">
                  {['3.13', '3.23', '3.33'].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleSolveTask2(val)}
                      className={`px-4 py-2 rounded-lg font-bold text-xs border transition-all ${
                        task2Solved && val === '3.23'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-[#16241f] border-[#16241f]/20 hover:bg-gray-50'
                      }`}
                    >
                      {val} {task2Solved && val === '3.23' && '✓'}
                    </button>
                  ))}
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Decimal Column Calculation Mastered! 1.35+1.24 = 2.59, 6.48-3.25 = 3.23!
                </div>
              )}

              <button
                disabled={!testCompleted}
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow disabled:opacity-40 hover:bg-[#16241f]/90"
              >
                Proceed to Checkpoint Quiz ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* Phase: Checkpoint Quiz */}
      {phase === 'checkpoint_quiz' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f]">
              Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <div className="flex gap-1">
              {QUIZ_QUESTIONS.map((_, idx) => (
                <div key={idx} className={`w-2.5 h-2.5 rounded-full ${idx === quizIndex ? 'bg-[#9c6f1f]' : idx < quizIndex ? 'bg-[#16241f]' : 'bg-[#16241f]/20'}`} />
              ))}
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm">
            <h3 className="text-base font-bold text-[#16241f]">{QUIZ_QUESTIONS[quizIndex].questionText}</h3>
          </div>

          <div className="space-y-2.5">
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
                  className={`w-full p-3.5 text-left font-semibold text-xs rounded-xl border-2 transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {isSelected && isCorrectIndex && <span>✨ Correct!</span>}
                </button>
              );
            })}
          </div>

          {showHint && (
            <div className="p-3.5 bg-[#9c6f1f]/10 rounded-xl border border-[#9c6f1f]/30 text-xs text-[#16241f] animate-fade-in">
              <span className="font-bold text-[#9c6f1f] block mb-0.5">💡 RCRT Hint:</span>
              {QUIZ_QUESTIONS[quizIndex].hint}
            </div>
          )}
        </div>
      )}

      {/* Phase: Passed */}
      {phase === 'passed' && (
        <div className="text-center py-8 space-y-5 animate-fade-in">
          <div className="text-5xl">➕➖⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Adding and Subtracting Decimals!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setTask1Solved(false);
              setTask2Solved(false);
              setTestCompleted(false);
              setQuizIndex(0);
              setSelectedOption(null);
              setShowHint(false);
            }}
            className="py-3 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#16241f]/90"
          >
            🔄 Replay RCRT Active Loop
          </button>
        </div>
      )}
    </div>
  );
};

export default RCRTAddSubtractDecimalsPlayer;
