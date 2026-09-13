import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTAddSubtractRelatedFractionsPlayerProps {
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
    questionText: 'When adding 2/3 and 5/9, what is the common denominator and how is 2/3 converted?',
    options: [
      'The common denominator is 9; 2/3 converts to 6/9 by multiplying top and bottom by 3',
      'The common denominator is 27; 2/3 converts to 2/27',
      'You add the denominators together to get 12'
    ],
    correctIndex: 0,
    hint: 'Since 9 is a multiple of 3, 9 becomes the common denominator. Multiply 2/3 by 3/3 to get 6/9!'
  },
  {
    id: 2,
    questionText: 'After converting fractions to have matching denominators, what parts do you add or subtract?',
    options: [
      'Only add or subtract the numerators (top numbers); the denominator (bottom number) stays unchanged',
      'Add both top and bottom numbers',
      'Subtract the bottom number from the top number'
    ],
    correctIndex: 0,
    hint: 'Once denominators match, only the numerators change—the denominator stays the exact same!'
  },
  {
    id: 3,
    questionText: 'What is the answer to 7/8 - 1/4?',
    options: [
      '5/8 (since 1/4 converts to 2/8, and 7/8 - 2/8 = 5/8)',
      '6/4',
      '6/8'
    ],
    correctIndex: 0,
    hint: 'Convert 1/4 to 2/8 first, then subtract 7/8 - 2/8 = 5/8!'
  }
];

export const RCRTAddSubtractRelatedFractionsPlayer: React.FC<RCRTAddSubtractRelatedFractionsPlayerProps> = ({
  conceptName = 'Concept 17.2: Adding & Subtracting Fractions with Related Denominators',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 17)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Test Stepper for 2/3 + 5/9
  const [convertedFraction, setConvertedFraction] = useState<string | null>(null);
  const [finalSum, setFinalSum] = useState<string | null>(null);
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
          'STEP 1: READ. Related denominators are numbers where one is a multiple of the other. Convert the fraction with the smaller denominator so both share a common denominator, then add or subtract ONLY the numerators—the denominator stays the same!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Remember: find the common denominator, convert the smaller fraction, and only add the top numbers.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Match the bottom numbers first, then only add or subtract the top numbers!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Put your memory to work! Calculate 2/3 + 5/9 step-by-step: convert 2/3 to ninths first, then add!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Adding and Subtracting Fractions with Related Denominators with RCRT active recall and earned 3 stars!'
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

  const handleStep1Convert = () => {
    setConvertedFraction('6/9');
    safeNarrate('Sub-step 1 Complete: 2/3 converted to 6/9 by multiplying numerator and denominator by 3! Now add 6/9 + 5/9.');
  };

  const handleStep2Add = () => {
    setFinalSum('11/9 (1 2/9)');
    setTestCompleted(true);
    setStars((prev) => prev + 1);
    safeNarrate('Sub-step 2 Complete: 6/9 + 5/9 = 11/9, which equals 1 and 2/9! Target matched!');
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
                  Rule: Fractions with Related Denominators
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Step 1:</strong> Find the common denominator (since 9 is a multiple of 3, use 9).<br/>
                  • <strong>Step 2:</strong> Convert the smaller fraction: 2/3 = (2×3)/(3×3) = <strong>6/9</strong>.<br/>
                  • <strong>Step 3:</strong> Only add or subtract numerators: 6/9 + 5/9 = <strong>11/9 = 1 2/9</strong>.
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  ➕ Example: 2/3 + 5/9 ➔ 6/9 + 5/9 = 11/9 = 1 2/9
                </div>
              </div>

              <button
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#16241f]/90"
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
                The rule card is now hidden from view. No peeking! Lock the denominator matching strategy in memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Strategy stored in memory...
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
                  "Match the bottom numbers first, then only add or subtract the top numbers!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Match the bottom numbers first, then only add or subtract the top numbers!');
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
                Ready for Step 4: Active Stepper Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Fraction Addition Stepper
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Target: Compute <strong className="text-[#9c6f1f]">2/3 + 5/9</strong>
                </span>
              </div>

              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 space-y-4 text-center">
                <div className="text-lg font-black text-[#16241f]">
                  Solve: <span className="text-[#9c6f1f]">2/3</span> + <span>5/9</span>
                </div>

                {/* Sub-step 1: Convert */}
                <div className={`p-3 rounded-xl border-2 transition-all ${convertedFraction !== null ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-white border-[#16241f]/20'}`}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1">
                    Sub-step 1: Convert 2/3 to ninths (common denominator 9)
                  </div>
                  {convertedFraction === null ? (
                    <button
                      onClick={handleStep1Convert}
                      className="py-2 px-4 bg-[#9c6f1f] text-white font-bold text-xs rounded-lg shadow hover:bg-[#9c6f1f]/90"
                    >
                      🔄 Tap to Convert 2/3 ➔ 6/9
                    </button>
                  ) : (
                    <div className="text-sm font-black">
                      ✅ 2/3 converted to <span className="text-emerald-700">6/9</span>
                    </div>
                  )}
                </div>

                {/* Sub-step 2: Add */}
                <div className={`p-3 rounded-xl border-2 transition-all ${finalSum !== null ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-white border-[#16241f]/20 opacity-60'}`}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1">
                    Sub-step 2: Add Numerators (6 + 5)
                  </div>
                  {convertedFraction !== null && finalSum === null && (
                    <button
                      onClick={handleStep2Add}
                      className="py-2 px-4 bg-[#16241f] text-white font-bold text-xs rounded-lg shadow hover:bg-[#16241f]/90"
                    >
                      ➕ Tap to Add 6/9 + 5/9
                    </button>
                  )}
                  {finalSum !== null && (
                    <div className="text-sm font-black">
                      🎉 6/9 + 5/9 = <span className="text-emerald-700">11/9 = 1 2/9</span>
                    </div>
                  )}
                  {convertedFraction === null && (
                    <div className="text-xs text-[#16241f]/50">Complete Sub-step 1 first</div>
                  )}
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Target Matched! 2/3 + 5/9 = 11/9 = 1 2/9! Active recall 100% accurate!
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
          <div className="text-5xl">➕⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Adding and Subtracting Fractions with Related Denominators!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setConvertedFraction(null);
              setFinalSum(null);
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

export default RCRTAddSubtractRelatedFractionsPlayer;
