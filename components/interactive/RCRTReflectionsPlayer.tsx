import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTReflectionsPlayerProps {
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
    questionText: 'When a vertex of a shape is 3 squares above a horizontal mirror line, where does its reflected point land?',
    options: [
      'Exactly 3 squares directly below the mirror line on the opposite side',
      '3 squares to the right of the mirror line',
      '6 squares above the mirror line'
    ],
    correctIndex: 0,
    hint: 'Reflected points land the exact same perpendicular distance from the mirror line on the opposite side!'
  },
  {
    id: 2,
    questionText: 'What pattern is created when you reflect a right-angled triangle across both a horizontal AND a vertical mirror line?',
    options: [
      'A symmetrical four-part diamond pattern',
      'A straight single line of triangles',
      'A circle with no corners'
    ],
    correctIndex: 0,
    hint: 'Reflecting across two perpendicular mirror lines creates four symmetrical sections arranged like a diamond!'
  },
  {
    id: 3,
    questionText: 'How can you find the exact position of any reflected corner on a grid?',
    options: [
      'Measure its perpendicular distance to the mirror line, then count that same distance on the opposite side',
      'Add 10 to both x and y coordinates',
      'Rotate the shape by 360 degrees'
    ],
    correctIndex: 0,
    hint: 'Picture the mirror line as a real mirror: count the distance to the line, then count the same distance past it!'
  }
];

export const RCRTReflectionsPlayer: React.FC<RCRTReflectionsPlayerProps> = ({
  conceptName = 'Concept 14.1: Reflections',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 14: Location and Movement)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Reflection Canvas State
  // Horizontal mirror line at y = 3 (grid height 6)
  // Original point A at (2, 5) -> distance above line = 2 (5 - 3 = 2)
  // Target reflected point A' at (2, 1) -> 3 - 2 = 1
  const [reflectedY, setReflectedY] = useState<number>(5);
  const [targetY] = useState<number>(1);
  const [dualAxisMode, setDualAxisMode] = useState<boolean>(false);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [reciteSpoken, setReciteSpoken] = useState<boolean>(false);

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
          'STEP 1: READ. A reflection flips a shape across a mirror line. Each corner stays the exact same perpendicular distance from the mirror line as the original matching corner, but on the opposite side. Reflecting across both horizontal and vertical mirror lines forms a symmetrical four-part diamond pattern!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Store the perpendicular distance rule in your working memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Same distance to the mirror line, exact same distance past the mirror line!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Put your memory to work! Flip the top point at y equals 5 across the horizontal mirror line at y equals 3 so it lands at y equals 1!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Reflections with RCRT active recall and earned 3 stars!'
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

  const handleFlipHorizontal = () => {
    // Distance from y=3: 5 - 3 = 2. Reflected: 3 - 2 = 1.
    setReflectedY(1);
    setTestCompleted(true);
    setStars((prev) => prev + 1);
    safeNarrate('Flipped! Point at y=5 is 2 units above mirror line y=3, so its reflection lands 2 units below at y=1!');
  };

  const handleToggleDualAxis = () => {
    setDualAxisMode(!dualAxisMode);
    safeNarrate(!dualAxisMode ? 'Reflecting across dual axes creates a symmetrical 4-part diamond pattern!' : 'Single axis mode.');
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
                  Rule: Perpendicular Distance in Reflections
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Matching Distance:</strong> A reflection flips a shape across a mirror line so every vertex stays the <em>exact same perpendicular distance</em> from the mirror line on the opposite side.<br/>
                  • <strong>Dual Axes:</strong> Reflecting a right-angled triangle across both horizontal and vertical mirror lines forms a symmetrical <strong>4-part diamond pattern</strong>.
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  🪞 Example: Vertex 2 units ABOVE mirror line y=3 ➔ Reflects to 2 units BELOW at y=1!
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
                The rule card is now hidden from view. No peeking! Lock the perpendicular distance rule in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Reflection rule locked in memory...
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
                  "Same distance to the mirror line, exact same distance past the mirror line!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Same distance to the mirror line, exact same distance past the mirror line!');
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
                Ready for Step 4: Active Mirror Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE MIRROR CANVAS) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Interactive Reflection Canvas
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Mirror Line: <strong className="text-[#9c6f1f]">y = 3</strong>
                </span>
              </div>

              {/* Grid Canvas */}
              <div className="relative w-64 h-64 mx-auto bg-[#f8faf7] border-2 border-[#16241f] rounded-xl shadow-inner overflow-hidden">
                {/* Grid Lines */}
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <React.Fragment key={i}>
                    <div className="absolute bg-[#16241f]/10" style={{ left: `${(i / 6) * 100}%`, top: 0, bottom: 0, width: '1px' }} />
                    <div className="absolute bg-[#16241f]/10" style={{ top: `${(1 - i / 6) * 100}%`, left: 0, right: 0, height: '1px' }} />
                  </React.Fragment>
                ))}

                {/* Horizontal Mirror Line (y = 3 -> 50% height) */}
                <div className="absolute bg-amber-500 h-1 left-0 right-0 shadow" style={{ top: '50%' }} />
                <span className="absolute top-[51%] left-2 text-[9px] font-bold text-amber-700 bg-white/90 px-1 rounded">
                  Horizontal Mirror Line (y=3)
                </span>

                {/* Vertical Mirror Line if Dual Axis */}
                {dualAxisMode && (
                  <>
                    <div className="absolute bg-sky-500 w-1 top-0 bottom-0 shadow" style={{ left: '50%' }} />
                    <span className="absolute top-2 left-[52%] text-[9px] font-bold text-sky-700 bg-white/90 px-1 rounded">
                      Vertical Mirror (x=3)
                    </span>
                  </>
                )}

                {/* Shapes and labels rendered in one SVG overlay (polygon/text require an <svg> parent to display) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
                  {/* Original Shape (Top Left Triangle at y=5, x=2) */}
                  <polygon
                    points={`${(2 / 6) * 256},${(1 - 5 / 6) * 256} ${(3 / 6) * 256},${(1 - 4 / 6) * 256} ${(2 / 6) * 256},${(1 - 4 / 6) * 256}`}
                    fill="#16241f"
                    fillOpacity="0.85"
                    stroke="#16241f"
                    strokeWidth="2"
                  />
                  <text x={(2 / 6) * 256 + 4} y={(1 - 5 / 6) * 256 - 4} fontSize="10" fontWeight="bold" fill="#16241f">
                    Original (y=5)
                  </text>

                  {/* Reflected Shape across y=3 (y=1) */}
                  {reflectedY === 1 && (
                    <polygon
                      points={`${(2 / 6) * 256},${(1 - 1 / 6) * 256} ${(3 / 6) * 256},${(1 - 2 / 6) * 256} ${(2 / 6) * 256},${(1 - 2 / 6) * 256}`}
                      fill="#9c6f1f"
                      fillOpacity="0.85"
                      stroke="#9c6f1f"
                      strokeWidth="3"
                      className="animate-fade-in"
                    />
                  )}

                  {/* Dual Axis 4-Part Diamond Patterns */}
                  {dualAxisMode && reflectedY === 1 && (
                    <>
                      {/* Top Right */}
                      <polygon
                        points={`${(4 / 6) * 256},${(1 - 5 / 6) * 256} ${(3 / 6) * 256},${(1 - 4 / 6) * 256} ${(4 / 6) * 256},${(1 - 4 / 6) * 256}`}
                        fill="#0284c7"
                        fillOpacity="0.7"
                        stroke="#0284c7"
                        strokeWidth="2"
                      />
                      {/* Bottom Right */}
                      <polygon
                        points={`${(4 / 6) * 256},${(1 - 1 / 6) * 256} ${(3 / 6) * 256},${(1 - 2 / 6) * 256} ${(4 / 6) * 256},${(1 - 2 / 6) * 256}`}
                        fill="#0284c7"
                        fillOpacity="0.7"
                        stroke="#0284c7"
                        strokeWidth="2"
                      />
                    </>
                  )}
                </svg>
              </div>

              {/* Action Controls */}
              <div className="text-center space-y-2">
                <p className="text-xs font-bold text-[#16241f]">
                  Original Apex: <span className="text-[#16241f]">y = 5 (2 units above y=3)</span> ➔ Reflected Apex: <span className="text-[#9c6f1f] font-black">y = {reflectedY}</span>
                </p>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleFlipHorizontal}
                    disabled={reflectedY === 1}
                    className="py-2.5 px-4 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#9c6f1f]/90 disabled:opacity-40"
                  >
                    🪞 Flip Across Horizontal Mirror (y=3)
                  </button>
                  <button
                    onClick={handleToggleDualAxis}
                    className="py-2.5 px-3 bg-[#16241f] text-white font-bold text-xs rounded-xl shadow hover:bg-[#16241f]/90"
                  >
                    {dualAxisMode ? '🔷 Dual Axis Diamond ON' : '💎 Toggle Dual Axis Diamond'}
                  </button>
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Reflected Target Matched! Point at y=5 reflected 2 units below y=3 to y=1!
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
          <div className="text-5xl">🪞⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent active recall memory for Reflections!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setReflectedY(5);
              setDualAxisMode(false);
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

export default RCRTReflectionsPlayer;
