import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTDivisibilityRulesPlayerProps {
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
    questionText: 'How do you check if a large number is divisible by 2?',
    options: [
      'Check if its final (last) digit is even (0, 2, 4, 6, or 8)',
      'Add all the digits together',
      'Check if it ends in 5 or 0'
    ],
    correctIndex: 0,
    hint: 'A number is divisible by 2 if its last digit is even (0, 2, 4, 6, 8)!'
  },
  {
    id: 2,
    questionText: 'Why is the number 536 divisible by 4?',
    options: [
      'Because its last two digits (36) can be divided evenly by 4 (36 ÷ 4 = 9)',
      'Because it ends in 6',
      'Because 5 + 3 + 6 = 14'
    ],
    correctIndex: 0,
    hint: 'Look at the last 2 digits! 36 ÷ 4 = 9, so 536 is divisible by 4.'
  },
  {
    id: 3,
    questionText: 'How many end digits must you check to test divisibility by 8?',
    options: [
      'Check the last 3 digits (e.g. 1,200 ends in 200, and 200 ÷ 8 = 25)',
      'Check only the first digit',
      'Check the last 4 digits'
    ],
    correctIndex: 0,
    hint: 'Look at 1 digit for 2, 2 digits for 4, and 3 digits for 8!'
  }
];

export const RCRTDivisibilityRulesPlayer: React.FC<RCRTDivisibilityRulesPlayerProps> = ({
  conceptName = 'Concept 13.3: Divisibility Rules for 2, 4, and 8',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 13)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');
  
  // Interactive Digit Checker State (536 for 4, 1200 for 8)
  const [testNumber, setTestNumber] = useState<number>(536);
  const [targetDivisor, setTargetDivisor] = useState<number>(4);
  const [digitsChecked, setDigitsChecked] = useState<number>(0);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [reciteSpoken, setReciteSpoken] = useState<boolean>(false);

  // Quiz state
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
          'STEP 1: READ. Divisibility rules are fast shortcuts! A number is divisible by 2 if its last digit is even (0, 2, 4, 6, 8). Divisible by 4 if the last 2 digits divide by 4 (like 536 ends in 36). Divisible by 8 if the last 3 digits divide by 8 (like 1200 ends in 200, 200 ÷ 8 = 25)!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Store the 1-digit, 2-digit, and 3-digit shortcuts in your memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Look at 1 digit for 2, 2 digits for 4, and 3 digits for 8!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Tap the 2-digit inspector button to test if 536 is divisible by 4!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Divisibility Rules for 2, 4, and 8 with RCRT active recall and earned 3 stars!'
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

  const handleInspectDigits = (count: number) => {
    setDigitsChecked(count);
    if (count === 2 && targetDivisor === 4) {
      setTestCompleted(true);
      setStars((prev) => prev + 1);
      safeNarrate('Divisibility Check Verified! Last 2 digits of 536 are 36. 36 ÷ 4 = 9, so 536 is divisible by 4!');
    } else if (count === 3 && targetDivisor === 8) {
      setTestCompleted(true);
      setStars((prev) => prev + 1);
      safeNarrate('Divisibility Check Verified! Last 3 digits of 1200 are 200. 200 ÷ 8 = 25, so 1200 is divisible by 8!');
    } else {
      safeNarrate(`Inspected last ${count} digit(s).`);
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
                  Rule: Divisibility Rules for 2, 4, and 8
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Divisible by 2:</strong> Check the last <strong>1 digit</strong> (must be even: 0, 2, 4, 6, 8).<br/>
                  • <strong>Divisible by 4:</strong> Check the last <strong>2 digits</strong> (e.g. 536 ends in 36, and 36 ÷ 4 = 9).<br/>
                  • <strong>Divisible by 8:</strong> Check the last <strong>3 digits</strong> (e.g. 1,200 ends in 200, and 200 ÷ 8 = 25).
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  ⚡ Memory Shortcut: 1 digit for 2 | 2 digits for 4 | 3 digits for 8!
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
                The rule card is now hidden from view. No peeking! Lock the digit inspection shortcuts in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Rules stored in memory...
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
                  "Look at 1 digit for 2, 2 digits for 4, and 3 digits for 8!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Look at 1 digit for 2, 2 digits for 4, and 3 digits for 8!');
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
                Ready for Step 4: Digit Inspector Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE DIGIT INSPECTOR CANVAS) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Digit Inspector Canvas
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Target: Test if <strong className="text-[#9c6f1f]">536</strong> divides by <strong className="text-[#9c6f1f]">4</strong>
                </span>
              </div>

              {/* Interactive Number Display */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 text-center space-y-3">
                <div className="text-[#16241f] font-mono text-3xl font-black tracking-widest flex justify-center gap-2">
                  <span className={`p-2 rounded-lg transition-all ${digitsChecked >= 3 ? 'bg-[#9c6f1f] text-white ring-4 ring-[#9c6f1f]/30' : 'bg-white border'}`}>5</span>
                  <span className={`p-2 rounded-lg transition-all ${digitsChecked >= 2 ? 'bg-[#9c6f1f] text-white ring-4 ring-[#9c6f1f]/30' : 'bg-white border'}`}>3</span>
                  <span className={`p-2 rounded-lg transition-all ${digitsChecked >= 1 ? 'bg-[#9c6f1f] text-white ring-4 ring-[#9c6f1f]/30' : 'bg-white border'}`}>6</span>
                </div>

                <div className="text-xs font-bold text-[#16241f]">
                  How many end digits should you inspect to test divisibility by <strong>{targetDivisor}</strong>?
                </div>

                {/* Digit Selector Buttons */}
                <div className="flex justify-center gap-2 pt-1">
                  <button
                    onClick={() => handleInspectDigits(1)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${digitsChecked === 1 ? 'bg-[#16241f] text-white shadow' : 'bg-white border border-[#16241f]/20 text-[#16241f]'}`}
                  >
                    1 Digit ('6')
                  </button>
                  <button
                    onClick={() => handleInspectDigits(2)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${digitsChecked === 2 ? 'bg-[#9c6f1f] text-white shadow ring-2 ring-[#9c6f1f]' : 'bg-white border border-[#16241f]/20 text-[#16241f]'}`}
                  >
                    2 Digits ('36') ⭐
                  </button>
                  <button
                    onClick={() => handleInspectDigits(3)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${digitsChecked === 3 ? 'bg-[#16241f] text-white shadow' : 'bg-white border border-[#16241f]/20 text-[#16241f]'}`}
                  >
                    3 Digits ('536')
                  </button>
                </div>

                {digitsChecked > 0 && (
                  <div className="p-2.5 bg-white rounded-lg border border-[#16241f]/10 text-xs text-[#16241f] animate-fade-in">
                    {digitsChecked === 2 ? (
                      <span className="text-emerald-700 font-bold">
                        ✅ Perfect! Last 2 digits are 36. 36 ÷ 4 = 9. So 536 is divisible by 4!
                      </span>
                    ) : (
                      <span>
                        Inspected last {digitsChecked} digit(s). Remember the shortcut: 2 digits for divisor 4!
                      </span>
                    )}
                  </div>
                )}
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Target Matched! 536 ends in 36, which divides by 4!
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
          <div className="text-5xl">⚡⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Divisibility Rules for 2, 4, and 8!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setDigitsChecked(0);
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

export default RCRTDivisibilityRulesPlayer;
