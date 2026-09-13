import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTOrderOfOperationsPlayerProps {
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
    questionText: 'When solving 4 + 6 × 3, which calculation must you do first according to the order of operations?',
    options: [
      'Multiply 6 × 3 = 18 first, then add 4 (4 + 18 = 22)',
      'Add 4 + 6 = 10 first, then multiply by 3 (10 × 3 = 30)',
      'Add 4 + 3 first'
    ],
    correctIndex: 0,
    hint: 'Multiplication has priority over addition! Always multiply before adding.'
  },
  {
    id: 2,
    questionText: 'When solving 20 - 10 ÷ 2, what is the correct result?',
    options: [
      '15 — because 10 ÷ 2 = 5 first, then 20 - 5 = 15',
      '5 — because 20 - 10 = 10 first, then 10 ÷ 2 = 5',
      '10 — because 20 - 10 = 10'
    ],
    correctIndex: 0,
    hint: 'Division takes priority over subtraction! Divide 10 by 2 first, then subtract from 20.'
  },
  {
    id: 3,
    questionText: 'What is the highest priority in the order of operations?',
    options: [
      'Calculations inside Brackets are always solved first',
      'Addition and Subtraction',
      'Multiplication only when on the left'
    ],
    correctIndex: 0,
    hint: 'Brackets always come first, before multiplication, division, addition, or subtraction!'
  }
];

export const RCRTOrderOfOperationsPlayer: React.FC<RCRTOrderOfOperationsPlayerProps> = ({
  conceptName = 'Concept 15.2: Order of Operations',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 15: Calculation)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Test Stepper State (Problem 1: 4 + 6 x 3; Problem 2: 20 - 10 / 2)
  const [prob1Step1Done, setProb1Step1Done] = useState<boolean>(false);
  const [prob1Step2Done, setProb1Step2Done] = useState<boolean>(false);
  const [prob2Step1Done, setProb2Step1Done] = useState<boolean>(false);
  const [prob2Step2Done, setProb2Step2Done] = useState<boolean>(false);

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
          'STEP 1: READ. Order of Operations rule: Brackets first! Then Multiplication and Division before Addition and Subtraction. For 4 + 6 times 3, multiply 6 by 3 first to get 18, then add 4 to reach 22!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is hidden! Lock the order of operations priority (Brackets -> Multiply/Divide -> Add/Subtract) in your memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Brackets first, then Multiply and Divide, then Add and Subtract!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Solve expressions step-by-step in the correct order of operations.'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Order of Operations with RCRT active recall and earned 3 stars!'
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

  const handleProb1Step1 = () => {
    setProb1Step1Done(true);
    safeNarrate('Step 1: 6 times 3 equals 18. Now add 4!');
  };

  const handleProb1Step2 = () => {
    setProb1Step2Done(true);
    safeNarrate('Step 2: 4 plus 18 equals 22! Expression 1 complete.');
    checkAllTestDone(true, prob2Step2Done);
  };

  const handleProb2Step1 = () => {
    setProb2Step1Done(true);
    safeNarrate('Step 1: 10 divided by 2 equals 5. Now subtract from 20!');
  };

  const handleProb2Step2 = () => {
    setProb2Step2Done(true);
    safeNarrate('Step 2: 20 minus 5 equals 15! Expression 2 complete.');
    checkAllTestDone(prob1Step2Done, true);
  };

  const checkAllTestDone = (p1: boolean, p2: boolean) => {
    if (p1 && p2) {
      setTestCompleted(true);
      setStars((prev) => prev + 1);
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
          <div className={`p-2 rounded-xl border-2 font-bold text-xs transition-all ${rcrtStep === 'TEST' ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md scale-105' : 'bg-white text-[#16241f]/40 border-[#16241f]/15'}`}>
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
                  Rule: Order of Operations Priority
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  1. <strong>Brackets ()</strong> first.<br/>
                  2. <strong>Multiplication (×) and Division (÷)</strong> next (left to right).<br/>
                  3. <strong>Addition (+) and Subtraction (-)</strong> last (left to right).
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f] space-y-1">
                  <div>4 + 6 × 3 ➔ (6 × 3 = 18) ➔ 4 + 18 = 22</div>
                  <div>20 - 10 ÷ 2 ➔ (10 ÷ 2 = 5) ➔ 20 - 5 = 15</div>
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
                The rule card is hidden! Lock the order of operations priority in your working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Priority sequence locked in working memory...
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
                  "Brackets first, then Multiply and Divide, then Add and Subtract!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Brackets first, then Multiply and Divide, then Add and Subtract!');
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

          {/* STEP 4: TEST (ACTIVE STEPPER CANVAS) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Expression Step Evaluator
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Active Doing Test
                </span>
              </div>

              {/* Expression 1: 4 + 6 x 3 */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 space-y-2 text-center">
                <div className="text-sm font-black text-[#16241f]">
                  Evaluate: 4 + 6 × 3
                </div>
                {!prob1Step1Done ? (
                  <button
                    onClick={handleProb1Step1}
                    className="py-2 px-4 bg-[#9c6f1f] text-white font-bold text-xs rounded-lg shadow hover:bg-[#9c6f1f]/90"
                  >
                    1️⃣ Do First: Multiply 6 × 3
                  </button>
                ) : !prob1Step2Done ? (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#9c6f1f]">Partial: 4 + 18</div>
                    <button
                      onClick={handleProb1Step2}
                      className="py-2 px-4 bg-[#16241f] text-white font-bold text-xs rounded-lg shadow hover:bg-[#16241f]/90"
                    >
                      2️⃣ Do Next: Add 4 + 18
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-black text-emerald-700">
                    ✅ Result = 22! (6×3=18, then 4+18=22)
                  </div>
                )}
              </div>

              {/* Expression 2: 20 - 10 / 2 */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 space-y-2 text-center">
                <div className="text-sm font-black text-[#16241f]">
                  Evaluate: 20 - 10 ÷ 2
                </div>
                {!prob2Step1Done ? (
                  <button
                    onClick={handleProb2Step1}
                    className="py-2 px-4 bg-[#9c6f1f] text-white font-bold text-xs rounded-lg shadow hover:bg-[#9c6f1f]/90"
                  >
                    1️⃣ Do First: Divide 10 ÷ 2
                  </button>
                ) : !prob2Step2Done ? (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#9c6f1f]">Partial: 20 - 5</div>
                    <button
                      onClick={handleProb2Step2}
                      className="py-2 px-4 bg-[#16241f] text-white font-bold text-xs rounded-lg shadow hover:bg-[#16241f]/90"
                    >
                      2️⃣ Do Next: Subtract 20 - 5
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-black text-emerald-700">
                    ✅ Result = 15! (10÷2=5, then 20-5=15)
                  </div>
                )}
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Both Expressions Evaluated Correctly! Order of Operations 100%!
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
          <div className="text-5xl">➕✖️⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Order of Operations!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setProb1Step1Done(false);
              setProb1Step2Done(false);
              setProb2Step1Done(false);
              setProb2Step2Done(false);
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

export default RCRTOrderOfOperationsPlayer;
