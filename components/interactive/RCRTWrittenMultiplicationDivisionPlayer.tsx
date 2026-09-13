import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTWrittenMultiplicationDivisionPlayerProps {
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
    questionText: 'When multiplying 273 × 28 using formal column method, how do you split the calculation into partial products?',
    options: [
      'Multiply 273 × 8 (2184) and 273 × 20 (5460), then add them together (2184 + 5460 = 7644)',
      'Multiply 273 × 2 and add 8',
      'Add 273 + 28 and multiply by 10'
    ],
    correctIndex: 0,
    hint: 'Split 28 into 20 tens and 8 ones! Calculate 273 × 8 and 273 × 20, then sum them.'
  },
  {
    id: 2,
    questionText: 'When dividing 85 ÷ 4, what is the quotient with remainder expressed as a mixed number?',
    options: [
      '21 remainder 1, which equals 21 and 1/4',
      '20 remainder 5',
      '21 and 1/2'
    ],
    correctIndex: 0,
    hint: '84 ÷ 4 = 21 with 1 left over out of 4, written as 21 1/4!'
  },
  {
    id: 3,
    questionText: 'When multiplying by the tens digit in written column multiplication, what critical placeholder step must you do first?',
    options: [
      'Write a placeholder zero (0) in the ones column',
      'Add 10 to the answer',
      'Subtract 1 from the tens digit'
    ],
    correctIndex: 0,
    hint: 'A placeholder zero in the ones column ensures you are multiplying by tens!'
  }
];

export const RCRTWrittenMultiplicationDivisionPlayer: React.FC<RCRTWrittenMultiplicationDivisionPlayerProps> = ({
  conceptName = 'Concept 15.3: Written Multiplication and Division',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 15: Calculation)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Test Stepper State (273 x 28)
  const [onesPartDone, setOnesPartDone] = useState<boolean>(false); // 273 x 8 = 2184
  const [tensPartDone, setTensPartDone] = useState<boolean>(false); // 273 x 20 = 5460
  const [sumDone, setSumDone] = useState<boolean>(false); // 2184 + 5460 = 7644

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
          'STEP 1: READ. Written multiplication breaks calculation into partial products: split the second factor into tens and ones, multiply separately, then add! For 273 times 28, multiply 273 by 8 ones to get 2184, and 273 by 20 tens to get 5460, then add to get 7644.'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is hidden! Lock the partial product steps in your memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Split factor into tens and ones, multiply each part, then add partial products!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Calculate 273 times 28 using partial products step-by-step.'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Written Multiplication and Division with RCRT active recall and earned 3 stars!'
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

  const handleOnesPart = () => {
    setOnesPartDone(true);
    safeNarrate('Part 1: 273 times 8 ones equals 2184!');
  };

  const handleTensPart = () => {
    setTensPartDone(true);
    safeNarrate('Part 2: 273 times 20 tens equals 5460!');
  };

  const handleSumParts = () => {
    setSumDone(true);
    setTestCompleted(true);
    setStars((prev) => prev + 1);
    safeNarrate('Part 3: 2184 plus 5460 equals 7644! Multiplication complete!');
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
                  Rule: Partial Product Column Method
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Split 2nd Factor:</strong> Break 28 into 20 (tens) and 8 (ones).<br/>
                  • <strong>Step 1:</strong> Multiply by ones: 273 × 8 = 2184.<br/>
                  • <strong>Step 2:</strong> Multiply by tens (with placeholder 0): 273 × 20 = 5460.<br/>
                  • <strong>Step 3:</strong> Sum partial products: 2184 + 5460 = 7644!
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  📝 273 × 28 ➔ (273 × 8 = 2184) + (273 × 20 = 5460) = 7644
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
                The rule card is hidden! Lock the partial product steps in your working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Column partial product rule locked in memory...
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
                  "Split factor into tens and ones, multiply each part, then add partial products!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Split factor into tens and ones, multiply each part, then add partial products!');
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

          {/* STEP 4: TEST (ACTIVE COLUMN STEPPER CANVAS) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Partial Product Column Stepper
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Compute: 273 × 28
                </span>
              </div>

              {/* Column Stepper Container */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 space-y-3 text-center">
                <div className="text-lg font-black text-[#16241f] font-mono">
                  273 × 28
                </div>

                {/* Sub-step 1: Ones */}
                <div className={`p-3 rounded-xl border-2 transition-all ${onesPartDone ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-white border-[#16241f]/20'}`}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1">
                    Step 1: Multiply 273 × 8 ones
                  </div>
                  {!onesPartDone ? (
                    <button
                      onClick={handleOnesPart}
                      className="py-2 px-4 bg-[#9c6f1f] text-white font-bold text-xs rounded-lg shadow hover:bg-[#9c6f1f]/90"
                    >
                      Multiply 273 × 8
                    </button>
                  ) : (
                    <div className="text-sm font-black font-mono">
                      273 × 8 = <span className="text-emerald-700">2184</span>
                    </div>
                  )}
                </div>

                {/* Sub-step 2: Tens */}
                <div className={`p-3 rounded-xl border-2 transition-all ${tensPartDone ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-white border-[#16241f]/20 opacity-60'}`}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1">
                    Step 2: Multiply 273 × 20 tens (with placeholder 0)
                  </div>
                  {onesPartDone && !tensPartDone && (
                    <button
                      onClick={handleTensPart}
                      className="py-2 px-4 bg-[#16241f] text-white font-bold text-xs rounded-lg shadow hover:bg-[#16241f]/90"
                    >
                      Multiply 273 × 20
                    </button>
                  )}
                  {tensPartDone && (
                    <div className="text-sm font-black font-mono">
                      273 × 20 = <span className="text-emerald-700">5460</span>
                    </div>
                  )}
                  {!onesPartDone && (
                    <div className="text-xs text-[#16241f]/50">Complete Step 1 first</div>
                  )}
                </div>

                {/* Sub-step 3: Add Partial Products */}
                <div className={`p-3 rounded-xl border-2 transition-all ${sumDone ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-white border-[#16241f]/20 opacity-60'}`}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1">
                    Step 3: Add Partial Products (2184 + 5460)
                  </div>
                  {tensPartDone && !sumDone && (
                    <button
                      onClick={handleSumParts}
                      className="py-2 px-4 bg-[#9c6f1f] text-white font-bold text-xs rounded-lg shadow hover:bg-[#9c6f1f]/90"
                    >
                      Add 2184 + 5460
                    </button>
                  )}
                  {sumDone && (
                    <div className="text-base font-black font-mono text-emerald-700">
                      2184 + 5460 = 7644 🎉
                    </div>
                  )}
                  {!tensPartDone && (
                    <div className="text-xs text-[#16241f]/50">Complete Steps 1 & 2 first</div>
                  )}
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 273 × 28 = 7644! Partial product active recall 100%!
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
          <div className="text-5xl">📝✖️⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Written Multiplication and Division!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setOnesPartDone(false);
              setTensPartDone(false);
              setSumDone(false);
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

export default RCRTWrittenMultiplicationDivisionPlayer;
