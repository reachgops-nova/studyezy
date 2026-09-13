import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTWaffleDiagramsPlayerProps {
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
    questionText: 'On a 100-square waffle diagram (10 by 10), how much percentage does each individual square represent?',
    options: [
      '1 percent (1%) — because 1 out of 100 is 1%',
      '5 percent (5%)',
      '10 percent (10%)'
    ],
    correctIndex: 0,
    hint: 'On a 100-square grid, every single square represents 1 out of 100, which equals 1%!'
  },
  {
    id: 2,
    questionText: 'On a 20-square waffle diagram (5 by 4), how much percentage does each individual square represent?',
    options: [
      '5 percent (5%) — because 100% divided by 20 squares is 5% per square',
      '1 percent (1%)',
      '20 percent (20%)'
    ],
    correctIndex: 0,
    hint: 'Divide 100% by the total 20 squares: 100 ÷ 20 = 5% per square!'
  },
  {
    id: 3,
    questionText: 'If 3 squares are shaded on a 20-square waffle diagram showing votes for fish, what percentage voted for fish?',
    options: [
      '15 percent (15%) — because 3 squares × 5% per square = 15%',
      '3 percent (3%)',
      '20 percent (20%)'
    ],
    correctIndex: 0,
    hint: 'Each square on a 20-grid is worth 5%. Multiply 3 shaded squares by 5% to get 15%!'
  }
];

export const RCRTWaffleDiagramsPlayer: React.FC<RCRTWaffleDiagramsPlayerProps> = ({
  conceptName = 'Concept 16.2: Proportions and Waffle Diagrams',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 16: Statistical Methods)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Active Test State
  const [gridType, setGridType] = useState<100 | 20>(100);
  const [shadedCount, setShadedCount] = useState<number>(0);
  const [task100Done, setTask100Done] = useState<boolean>(false);
  const [task20Done, setTask20Done] = useState<boolean>(false);
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
          'STEP 1: READ. A waffle diagram is a grid of small squares representing proportions. On a 100-square grid (10 by 10), each square is worth 1%. Shading 25 squares equals 25%! On a 20-square grid (5 by 4), each square is worth 5%. Shading 3 squares for fish equals 3 times 5%, which is 15%!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Store the square value rules (100-grid = 1% per square; 20-grid = 5% per square) in working memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "100 squares equal 1% each; 20 squares equal 5% each!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Put your memory to work! Shade 25 squares on the 100-grid to show 25%, then switch to the 20-grid and shade 3 squares for 15%!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Proportions and Waffle Diagrams with RCRT active recall and earned 3 stars!'
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

  const handleAdjustShaded = (delta: number) => {
    const maxVal = gridType === 100 ? 100 : 20;
    const nextVal = Math.min(maxVal, Math.max(0, shadedCount + delta));
    setShadedCount(nextVal);

    if (gridType === 100 && nextVal === 25) {
      setTask100Done(true);
      safeNarrate('Correct! 25 shaded squares out of 100 equals 25%! Now switch to the 20-square grid.');
      if (task20Done) {
        setTestCompleted(true);
        setStars((prev) => prev + 1);
      }
    } else if (gridType === 20 && nextVal === 3) {
      setTask20Done(true);
      safeNarrate('Correct! 3 shaded squares out of 20 equals 3 times 5%, which is 15%!');
      if (task100Done) {
        setTestCompleted(true);
        setStars((prev) => prev + 1);
      }
    } else {
      const pct = gridType === 100 ? nextVal : nextVal * 5;
      safeNarrate(`Shaded ${nextVal} squares = ${pct}%.`);
    }
  };

  const handleSwitchGrid = (type: 100 | 20) => {
    setGridType(type);
    setShadedCount(0);
    safeNarrate(type === 100 ? 'Switched to 100-square grid (1% per square). Shade 25 squares for 25%!' : 'Switched to 20-square grid (5% per square). Shade 3 squares for 15%!');
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

  const percentValue = gridType === 100 ? shadedCount : shadedCount * 5;

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
                  Rule: Waffle Diagrams and Percentages
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>100-Square Grid (10×10):</strong> Each square represents <strong>1%</strong> of the whole (25 squares = 25%).<br/>
                  • <strong>20-Square Grid (5×4):</strong> Each square represents <strong>5%</strong> of the whole (100% ÷ 20 = 5%). Shading 3 squares for fish = 3 × 5% = 15%!
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  🧇 Value per square = 100% ÷ Total Squares (100 grid ➔ 1% | 20 grid ➔ 5%)
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
                The rule card is now hidden from view. No peeking! Lock the square values (100 grid = 1%, 20 grid = 5%) in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Waffle diagram rules locked in memory...
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
                  "100 squares equal 1% each; 20 squares equal 5% each!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('100 squares equal 1% each; 20 squares equal 5% each!');
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
                Ready for Step 4: Active Waffle Grid Canvas 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE WAFFLE GRID CANVAS) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Active Waffle Grid
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Active Grid: <strong className="text-[#9c6f1f]">{gridType}-Square Grid</strong>
                </span>
              </div>

              {/* Grid Selector */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleSwitchGrid(100)}
                  className={`py-1.5 px-3 rounded-lg font-bold text-xs transition-all ${
                    gridType === 100 ? 'bg-[#9c6f1f] text-white shadow' : 'bg-[#f4f6f1] text-[#16241f]'
                  }`}
                >
                  🧇 100-Square Grid (Target: 25% = 25 squares)
                </button>
                <button
                  onClick={() => handleSwitchGrid(20)}
                  className={`py-1.5 px-3 rounded-lg font-bold text-xs transition-all ${
                    gridType === 20 ? 'bg-[#16241f] text-white shadow' : 'bg-[#f4f6f1] text-[#16241f]'
                  }`}
                >
                  🧇 20-Square Grid (Target: 15% = 3 squares)
                </button>
              </div>

              {/* Waffle Canvas Display */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 text-center space-y-3">
                <div
                  className={`mx-auto grid gap-1 p-2 bg-white rounded-lg border border-[#16241f]/15 shadow-inner ${
                    gridType === 100 ? 'grid-cols-10 w-52 h-52' : 'grid-cols-5 w-52 h-40'
                  }`}
                >
                  {Array.from({ length: gridType }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`rounded transition-all ${
                        idx < shadedCount ? 'bg-[#9c6f1f]' : 'bg-gray-100 border border-gray-200'
                      }`}
                    />
                  ))}
                </div>

                <div className="text-xs font-bold text-[#16241f]">
                  Shaded Squares: <span className="text-[#9c6f1f] font-black">{shadedCount} / {gridType}</span> ➔ Proportion = <span className="text-[#9c6f1f] font-black">{percentValue}%</span>
                </div>

                {/* Adjust Controls */}
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleAdjustShaded(-1)}
                    className="px-3 py-1.5 bg-white border border-[#16241f]/20 rounded-lg text-xs font-bold"
                  >
                    -1 Square
                  </button>
                  <button
                    onClick={() => handleAdjustShaded(1)}
                    className="px-3 py-1.5 bg-[#9c6f1f] text-white rounded-lg text-xs font-bold shadow"
                  >
                    +1 Square ({gridType === 100 ? '+1%' : '+5%'})
                  </button>
                  <button
                    onClick={() => handleAdjustShaded(5)}
                    className="px-3 py-1.5 bg-[#16241f] text-white rounded-lg text-xs font-bold shadow"
                  >
                    +5 Squares ({gridType === 100 ? '+5%' : '+25%'})
                  </button>
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Waffle Diagrams Mastered! 100-grid (25 squares = 25%) and 20-grid (3 squares = 15%) correctly shaded!
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
          <div className="text-5xl">🧇⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Proportions and Waffle Diagrams!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setGridType(100);
              setShadedCount(0);
              setTask100Done(false);
              setTask20Done(false);
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

export default RCRTWaffleDiagramsPlayer;
