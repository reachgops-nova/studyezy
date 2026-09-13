import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTFindingFractionsOfAmountsPlayerProps {
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
    questionText: 'What is the two-step rule to find a fraction of an amount like 3/10 of $400?',
    options: [
      'Divide the total by the bottom number (10), then multiply that result by the top number (3)',
      'Multiply the total by the bottom number, then divide by the top number',
      'Add the top and bottom numbers together and subtract from $400'
    ],
    correctIndex: 0,
    hint: 'Divide by the bottom to find one slice, then multiply by the top to take as many slices as you need!'
  },
  {
    id: 2,
    questionText: 'What is 3/10 of $400?',
    options: [
      '$120 (because $400 ÷ 10 = $40, and $40 × 3 = $120)',
      '$40',
      '$300'
    ],
    correctIndex: 0,
    hint: '$400 ÷ 10 = $40 (one tenth). Then $40 × 3 = $120 (three tenths)!'
  },
  {
    id: 3,
    questionText: 'If 1/8 of a box of items equals 6 items, how many items are in the full box?',
    options: [
      '48 items (because 6 × 8 = 48)',
      '14 items',
      '24 items'
    ],
    correctIndex: 0,
    hint: 'If 1 part out of 8 is 6, multiply 6 by the denominator 8 to get the whole box of 48!'
  }
];

export const RCRTFindingFractionsOfAmountsPlayer: React.FC<RCRTFindingFractionsOfAmountsPlayerProps> = ({
  conceptName = 'Concept 11.4: Finding Fractions of Amounts',
  unitTitle = 'Cambridge Primary Math Stage 4 (Read-Cover-Recite-Test Engine)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');
  
  // Interactive Step Calculator State: 3/10 of $400
  const [userDivResult, setUserDivResult] = useState<number>(0);
  const [userFinalResult, setUserFinalResult] = useState<number>(0);
  const [taskCompleted, setTaskCompleted] = useState<boolean>(false);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(0);
  const [reciteSpoken, setReciteSpoken] = useState<boolean>(false);

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
          'STEP 1: READ. To find a fraction of an amount, divide the total by the denominator to find one slice, then multiply the result by the numerator to take your slices!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is hidden! Lock the two steps in your mind: divide by bottom, multiply by top!'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the formula out loud: "Divide by the bottom to find one slice, multiply by the top to take your slices!"'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Put your recall into action! Calculate three-tenths of 400 dollars step by step!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Outstanding! You mastered Finding Fractions of Amounts with RCRT active recall!'
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
      setTaskCompleted(false);
    } else if (rcrtStep === 'TEST') {
      setPhase('checkpoint_quiz');
    }
  };

  const handleVerifyStep1 = (val: number) => {
    setUserDivResult(val);
    if (val === 40) {
      safeNarrate('Correct! $400 divided by 10 equals $40 for one slice. Now multiply by 3!');
    } else {
      safeNarrate(`Not quite. Try $400 divided by 10.`);
    }
  };

  const handleVerifyStep2 = (val: number) => {
    setUserFinalResult(val);
    if (val === 120 && userDivResult === 40) {
      setTaskCompleted(true);
      setStars((prev) => prev + 1);
      safeNarrate('Bingo! $40 times 3 equals $120! Perfect active recall!');
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

      {/* RCRT 4-Step Indicator */}
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

      {/* RCRT Loop Content */}
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
                  Rule: Finding Fractions of Amounts
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  1. <strong>Divide</strong> the total amount by the denominator (bottom number) to find 1 slice.<br />
                  2. <strong>Multiply</strong> the result by the numerator (top number) to get all your slices!
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  🍰 Example: 3/10 of $400 ➔ $400 ÷ 10 = $40 ➔ $40 × 3 = $120!
                </div>
              </div>
              <button
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#16241f]/90"
              >
                I Have Read & Understood! Cover the Rule 🙈 ➔
              </button>
            </div>
          )}

          {/* STEP 2: COVER */}
          {rcrtStep === 'COVER' && (
            <div className="p-8 bg-[#16241f] text-white rounded-2xl shadow-xl text-center space-y-4">
              <div className="text-5xl">🙈</div>
              <h3 className="text-lg font-black text-[#9c6f1f]">Step 2: Rule Covered!</h3>
              <p className="text-xs text-[#f4f6f1]/80 max-w-sm mx-auto leading-relaxed">
                The formula is hidden! Lock the 2 steps in working memory: divide by bottom, multiply by top.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Bottom ÷ | Top × stored in working memory...
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
                Say this out loud to your parent or partner right now:
              </p>
              <div className="p-4 bg-[#f4f6f1] rounded-xl border-2 border-dashed border-[#9c6f1f]/40">
                <p className="text-sm font-black text-[#9c6f1f]">
                  "Divide by the bottom to find one slice, then multiply by the top to take your slices!"
                </p>
              </div>
              <button
                onClick={() => {
                  setReciteSpoken(true);
                  safeNarrate('Divide by the bottom to find one slice, then multiply by the top to take your slices!');
                }}
                className={`py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${reciteSpoken ? 'bg-emerald-600 text-white' : 'bg-[#9c6f1f] text-white shadow'}`}
              >
                {reciteSpoken ? '✅ Recited Aloud!' : '🗣️ Tap to Practice Reciting'}
              </button>
              <button
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#16241f]/90"
              >
                Ready for Step 4: Active Doing Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE DOING CALCULATOR) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Active Doing Challenge
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Find <strong className="text-[#9c6f1f] text-sm">3/10 of $400</strong>
                </span>
              </div>

              {/* Sub-step 1: Divide by bottom */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl space-y-2">
                <p className="text-xs font-bold text-[#16241f]">
                  1️⃣ Divide by bottom: What is $400 ÷ 10?
                </p>
                <div className="flex gap-2">
                  {[20, 40, 400].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleVerifyStep1(opt)}
                      className={`flex-1 py-2 rounded-lg font-bold text-xs border transition-all ${
                        userDivResult === opt
                          ? opt === 40
                            ? 'bg-[#16241f] text-white border-[#16241f]'
                            : 'bg-red-500/10 text-red-600 border-red-500/30'
                          : 'bg-white text-[#16241f] border-[#16241f]/20'
                      }`}
                    >
                      ${opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-step 2: Multiply by top */}
              {userDivResult === 40 && (
                <div className="p-4 bg-[#f4f6f1] rounded-xl space-y-2 animate-fade-in">
                  <p className="text-xs font-bold text-[#16241f]">
                    2️⃣ Multiply by top: What is $40 × 3?
                  </p>
                  <div className="flex gap-2">
                    {[80, 120, 300].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleVerifyStep2(opt)}
                        className={`flex-1 py-2 rounded-lg font-bold text-xs border transition-all ${
                          userFinalResult === opt
                            ? opt === 120
                              ? 'bg-[#9c6f1f] text-white border-[#9c6f1f]'
                              : 'bg-red-500/10 text-red-600 border-red-500/30'
                            : 'bg-white text-[#16241f] border-[#16241f]/20'
                        }`}
                      >
                        ${opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {taskCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Excellent! 3/10 of $400 = $120! Perfect active recall!
                </div>
              )}

              <button
                disabled={!taskCompleted}
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow disabled:opacity-40 hover:bg-[#16241f]/90"
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
          <div className="text-5xl">🍰⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">Fractions of Amounts Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By applying active recall (Divide by bottom ➔ Multiply by top), you unlocked complete mastery over finding fractions of amounts!
          </p>
          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setQuizIndex(0);
              setSelectedOption(null);
              setShowHint(false);
              setUserDivResult(0);
              setUserFinalResult(0);
              setTaskCompleted(false);
            }}
            className="py-3 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#16241f]/90"
          >
            🔄 Replay RCRT Loop
          </button>
        </div>
      )}
    </div>
  );
};

export default RCRTFindingFractionsOfAmountsPlayer;
