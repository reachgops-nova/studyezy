import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTVisualising3DPlayerProps {
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
    questionText: 'What shape do you see when looking straight down at a 3D cylinder from directly above (top-down view)?',
    options: [
      'A flat circle — because the height is flattened from a bird’s eye perspective',
      'A rectangle',
      'A triangle'
    ],
    correctIndex: 0,
    hint: 'Think like a bird looking straight down: looking down at a cylinder flattens it into a simple circle!'
  },
  {
    id: 2,
    questionText: 'What does a top-down view of a square-based pyramid look like?',
    options: [
      'A square with an X connecting opposite corners (showing the 4 triangular sides sloping to the top point)',
      'A simple triangle',
      'A circle with a dot in the middle'
    ],
    correctIndex: 0,
    hint: 'Looking directly down at a square-based pyramid shows a square base with an X connecting the opposite corners!'
  },
  {
    id: 3,
    questionText: 'What grid tool is commonly used to guide accurate 3D sketches like cubes and cuboids on paper?',
    options: [
      'Dot grids — which provide guide points for parallel 3D edges',
      'Circular pie charts',
      'Bar graphs'
    ],
    correctIndex: 0,
    hint: 'Dot grids provide guide points for sketching accurate 3D shapes on 2D paper.'
  }
];

export const RCRTVisualising3DPlayer: React.FC<RCRTVisualising3DPlayerProps> = ({
  conceptName = 'Concept 12.4: Visualising and Drawing 3D Shapes',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 12: Angles and Shapes)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');
  
  // Interactive Top-Down View Matcher State
  const [cylinderMatch, setCylinderMatch] = useState<string | null>(null);
  const [pyramidMatch, setPyramidMatch] = useState<string | null>(null);
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
          'STEP 1: READ. Visualising 3D shapes means understanding how solids look from different angles. A top-down bird’s eye view flattens 3D height into 2D shapes: a cylinder looks like a circle, and a square-based pyramid looks like a square with an X!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Store the top-down 2D projections in your memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Think like a bird looking down: top-down views flatten 3D objects into 2D shapes!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Match the top-down 2D view for a cylinder (Circle) and a square pyramid (Square with X)!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Visualising and Drawing 3D Shapes with RCRT active recall and earned 3 stars!'
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

  const handleMatchCylinder = (view: string) => {
    setCylinderMatch(view);
    if (view === 'circle') {
      safeNarrate('Correct! Cylinder top-down view is a flat circle!');
      if (pyramidMatch === 'square_x') {
        setTestCompleted(true);
        setStars((prev) => prev + 1);
      }
    } else {
      safeNarrate('Try again! Looking down from above flattens a cylinder into a circle.');
    }
  };

  const handleMatchPyramid = (view: string) => {
    setPyramidMatch(view);
    if (view === 'square_x') {
      safeNarrate('Correct! Square pyramid top-down view is a square with an X!');
      if (cylinderMatch === 'circle') {
        setTestCompleted(true);
        setStars((prev) => prev + 1);
      }
    } else {
      safeNarrate('Try again! Looking down at a square pyramid shows a square base with an X.');
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
                  Rule: Visualising 3D Shapes (Top-Down Bird's Eye View)
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Top-Down View (Plan View):</strong> Looking directly down flattens 3D height into a 2D shape.<br/>
                  • <strong>Cylinder:</strong> Top-down view = Flat Circle 🟢.<br/>
                  • <strong>Square Pyramid:</strong> Top-down view = Square with an X ❎.
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  🦅 Memory Tip: Think like a bird looking down: top-down views flatten 3D objects into simple 2D shapes!
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
                The rule card is now hidden from view. No peeking! Lock the top-down views (cylinder ➔ circle, pyramid ➔ square with X) in working memory.
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
                  "Think like a bird looking down: top-down views flatten 3D objects into simple 2D shapes!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Think like a bird looking down: top-down views flatten 3D objects into simple 2D shapes!');
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
                Ready for Step 4: Top-Down View Matcher Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE TOP-DOWN VIEW MATCHER) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Top-Down View Matcher Test
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Matches: <strong className="text-[#9c6f1f]">{(cylinderMatch === 'circle' ? 1 : 0) + (pyramidMatch === 'square_x' ? 1 : 0)} / 2</strong>
                </span>
              </div>

              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 text-center space-y-4">
                <p className="text-xs font-bold text-[#16241f]">
                  Match the correct 2D top-down view for each 3D shape:
                </p>

                {/* Shape 1: Cylinder */}
                <div className="p-3 bg-white rounded-xl border border-[#16241f]/10 space-y-2">
                  <span className="text-xs font-bold text-[#16241f] block">1. 🛢️ 3D Cylinder Top-Down View:</span>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleMatchCylinder('circle')}
                      className={`py-2 px-3 rounded-lg font-bold text-xs border transition-all ${
                        cylinderMatch === 'circle'
                          ? 'bg-[#16241f] text-white border-[#16241f]'
                          : 'bg-white text-[#16241f] border-[#16241f]/20 hover:border-[#9c6f1f]'
                      }`}
                    >
                      🟢 Circle {cylinderMatch === 'circle' ? '✅' : ''}
                    </button>
                    <button
                      onClick={() => handleMatchCylinder('rectangle')}
                      className={`py-2 px-3 rounded-lg font-bold text-xs border transition-all ${
                        cylinderMatch === 'rectangle'
                          ? 'bg-red-500/10 text-red-700 border-red-300'
                          : 'bg-white text-[#16241f] border-[#16241f]/20'
                      }`}
                    >
                      █ Rectangle
                    </button>
                  </div>
                </div>

                {/* Shape 2: Square-based Pyramid */}
                <div className="p-3 bg-white rounded-xl border border-[#16241f]/10 space-y-2">
                  <span className="text-xs font-bold text-[#16241f] block">2. 🛕 3D Square Pyramid Top-Down View:</span>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleMatchPyramid('triangle')}
                      className={`py-2 px-3 rounded-lg font-bold text-xs border transition-all ${
                        pyramidMatch === 'triangle'
                          ? 'bg-red-500/10 text-red-700 border-red-300'
                          : 'bg-white text-[#16241f] border-[#16241f]/20'
                      }`}
                    >
                      🔺 Triangle
                    </button>
                    <button
                      onClick={() => handleMatchPyramid('square_x')}
                      className={`py-2 px-3 rounded-lg font-bold text-xs border transition-all ${
                        pyramidMatch === 'square_x'
                          ? 'bg-[#16241f] text-white border-[#16241f]'
                          : 'bg-white text-[#16241f] border-[#16241f]/20 hover:border-[#9c6f1f]'
                      }`}
                    >
                      ❎ Square with X {pyramidMatch === 'square_x' ? '✅' : ''}
                    </button>
                  </div>
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Both Top-Down Views Matched! Cylinder = Circle | Pyramid = Square with X! 100% active recall!
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
          <div className="text-5xl">🦅⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent active recall memory for Visualising and Drawing 3D Shapes!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setCylinderMatch(null);
              setPyramidMatch(null);
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

export default RCRTVisualising3DPlayer;
