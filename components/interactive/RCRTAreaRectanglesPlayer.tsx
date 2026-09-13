import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTAreaRectanglesPlayerProps {
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
    questionText: 'What is the area of a rectangle that is 12 cm long and 4 cm wide?',
    options: [
      '48 square cm — because area = length × width (12 × 4 = 48 sq cm)',
      '32 square cm — because 12 + 4 + 12 + 4 = 32 cm',
      '16 square cm — because 12 + 4 = 16'
    ],
    correctIndex: 0,
    hint: 'Area of a rectangle is calculated by multiplying its length by its width (Length × Width).'
  },
  {
    id: 2,
    questionText: 'How do you calculate the area of an irregular or compound shape (like an L-shape)?',
    options: [
      'Slice and sum: split the shape into smaller non-overlapping rectangles, calculate each area, and add them together',
      'Multiply all side lengths together',
      'Area is always the same as perimeter'
    ],
    correctIndex: 0,
    hint: 'Slice and sum: chop a tricky shape into familiar rectangles, multiply length by width for each, then add them up!'
  },
  {
    id: 3,
    questionText: 'An L-shaped figure is split into a 6 cm × 2 cm rectangle (12 sq cm) and a 7 cm × 3 cm rectangle (21 sq cm). What is its total area?',
    options: [
      '33 square cm — because 12 + 21 = 33 square cm',
      '42 square cm — because 6 × 7 = 42 square cm',
      '18 square cm — because 6 × 3 = 18 square cm'
    ],
    correctIndex: 0,
    hint: 'Add the areas of the two simpler rectangles together: 12 sq cm + 21 sq cm = 33 sq cm!'
  }
];

export const RCRTAreaRectanglesPlayer: React.FC<RCRTAreaRectanglesPlayerProps> = ({
  conceptName = 'Concept 12.2: Area of Rectangles and Compound Shapes',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 12: Angles and Shapes)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');
  
  // Interactive Slice & Sum Stepper State
  const [areaA, setAreaA] = useState<number | null>(null);
  const [areaB, setAreaB] = useState<number | null>(null);
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
          'STEP 1: READ. Area measures the total flat surface inside a shape in square units. Rectangle area equals length times width. For compound shapes, slice the shape into simpler rectangles, compute each area, and add them up!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Lock the slice and sum area strategy in your working memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Slice and sum: chop into rectangles, multiply length by width for each, then add them up!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Slice the L-shape into Rectangle A (6cm × 2cm) and Rectangle B (7cm × 3cm), calculate both areas, and add them to reach 33 square cm!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Area of Rectangles and Compound Shapes with RCRT active recall and earned 3 stars!'
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

  const handleCalcAreaA = () => {
    setAreaA(12); // 6 * 2
    safeNarrate('Rectangle A Area calculated: 6 cm × 2 cm = 12 square cm!');
  };

  const handleCalcAreaB = () => {
    if (areaA === null) return;
    setAreaB(21); // 7 * 3
    setTestCompleted(true);
    setStars((prev) => prev + 1);
    safeNarrate('Rectangle B Area calculated: 7 cm × 3 cm = 21 square cm! Total Area = 12 + 21 = 33 square cm!');
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
                  Rule: Area of Rectangles & Compound Shapes
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Rectangle Area:</strong> Length × Width (e.g. 12 cm × 4 cm = 48 cm²).<br/>
                  • <strong>Compound Shape Area:</strong> Slice into simpler rectangles, calculate each area, and add them together!
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  ✂️ Memory Tip: Slice and sum—chop a shape into rectangles, multiply length by width for each, then add them up!
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
                The rule card is now hidden from view. No peeking! Lock the "slice and sum" area strategy in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Formula stored in memory...
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
                  "Slice and sum: chop into rectangles, multiply length by width for each, then add them up!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Slice and sum: chop into rectangles, multiply length by width for each, then add them up!');
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
                Ready for Step 4: Slice & Sum Area Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE SLICE & SUM STEPPER) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Slice & Sum Stepper
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Target Area: <strong className="text-[#9c6f1f]">33 cm²</strong>
                </span>
              </div>

              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 space-y-4 text-center">
                <div className="text-xs font-bold text-[#16241f]">
                  Slice the L-shape into 2 simple rectangles and sum their areas:
                </div>

                {/* Sub-step 1: Rectangle A */}
                <div className={`p-3 rounded-xl border-2 transition-all ${areaA !== null ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-white border-[#16241f]/20'}`}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1">
                    Rectangle A: 6 cm (length) × 2 cm (width)
                  </div>
                  {areaA === null ? (
                    <button
                      onClick={handleCalcAreaA}
                      className="py-2 px-4 bg-[#9c6f1f] text-white font-bold text-xs rounded-lg shadow hover:bg-[#9c6f1f]/90"
                    >
                      ✖️ Compute Area A (6 × 2)
                    </button>
                  ) : (
                    <div className="text-sm font-black">
                      ✅ Area A = 6 × 2 = <span className="text-emerald-700">12 cm²</span>
                    </div>
                  )}
                </div>

                {/* Sub-step 2: Rectangle B */}
                <div className={`p-3 rounded-xl border-2 transition-all ${areaB !== null ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-white border-[#16241f]/20 opacity-60'}`}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1">
                    Rectangle B: 7 cm (length) × 3 cm (width)
                  </div>
                  {areaA !== null && areaB === null && (
                    <button
                      onClick={handleCalcAreaB}
                      className="py-2 px-4 bg-[#16241f] text-white font-bold text-xs rounded-lg shadow hover:bg-[#16241f]/90"
                    >
                      ✖️ Compute Area B (7 × 3)
                    </button>
                  )}
                  {areaB !== null && (
                    <div className="text-sm font-black">
                      🎉 Area B = 7 × 3 = <span className="text-emerald-700">21 cm²</span>
                    </div>
                  )}
                  {areaA === null && (
                    <div className="text-xs text-[#16241f]/50">Complete Rectangle A first</div>
                  )}
                </div>

                {/* Total Sum Display */}
                {areaA !== null && areaB !== null && (
                  <div className="p-3 bg-white rounded-xl border border-[#16241f]/10 font-black text-sm text-[#9c6f1f]">
                    ➕ Total Compound Area = 12 cm² + 21 cm² = 33 cm²!
                  </div>
                )}
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Total Area Mastered! 12 cm² + 21 cm² = 33 cm²! 100% active recall!
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
          <div className="text-5xl">📐⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent active recall memory for Area of Rectangles and Compound Shapes!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setAreaA(null);
              setAreaB(null);
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

export default RCRTAreaRectanglesPlayer;
