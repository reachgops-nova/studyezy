import React, { useState, useEffect, useCallback } from 'react';

export interface TranslatingShapesPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type Phase = 'visual_intro' | 'demo' | 'checkpoint_quiz' | 'passed';

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
    questionText: 'What is the mathematical definition of a 2D shape translation?',
    options: [
      'Sliding a shape in a straight direction across a grid without turning, flipping, or resizing it',
      'Turning a shape around a fixed corner point',
      'Flipping a shape over a mirror line to create an opposite image'
    ],
    correctIndex: 0,
    hint: 'Translation has "sl" in it—think of a smooth "slide" where nothing turns, flips, or resizes!'
  },
  {
    id: 2,
    questionText: 'When a shape is translated 4 squares left and 1 square down, how do its vertices move?',
    options: [
      'Every single vertex moves the exact same distance and direction (4 left and 1 down)',
      'Only the top vertex moves while the bottom corners stay in place',
      'Each vertex moves in a different random direction'
    ],
    correctIndex: 0,
    hint: 'Every single vertex on the shape moves the exact same distance and direction during a translation.'
  },
  {
    id: 3,
    questionText: 'What is true about the connecting lines drawn between matching original and translated vertices?',
    options: [
      'They will always be parallel and equal in length',
      'They always cross each other at right angles',
      'They change length depending on the size of the shape'
    ],
    correctIndex: 0,
    hint: 'Connecting lines drawn between each original vertex and its matching new vertex will always be parallel and equal in length!'
  }
];

export const TranslatingShapesPlayer: React.FC<TranslatingShapesPlayerProps> = ({
  conceptName = 'Concept 10.1: Translating 2D Shapes',
  unitTitle = 'Unit 10: Location and Movement (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'triangle_slide' | 'rectangle_slide'>('triangle_slide');
  const [demoStep, setDemoStep] = useState<number>(0);
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
    if (phase === 'visual_intro') {
      safeNarrate(
        'A translation is sliding a shape in a straight direction across a grid without turning, flipping, or resizing it. Every single vertex on the shape moves the exact same distance and direction. Translations are described by stating how many units a shape moves horizontally (left or right) and vertically (up or down). Connecting lines drawn between each original vertex and its matching new vertex will always be parallel and equal in length. Translation has "sl" in it—just think of a smooth "slide" where nothing turns or twists!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'triangle_slide') {
        const desc =
          demoStep === 0
            ? 'Original Triangle at starting position on the grid. Click Slide 4 Left & 1 Down!'
            : demoStep === 1
            ? 'Sliding the triangle 4 squares to the left and 1 square down across the grid!'
            : 'Every vertex moved 4 squares left and 1 square down! Notice the dashed connecting lines between matching vertices—they are all parallel and equal in length!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Rectangle at starting position (2, 3). Click Move 5 Right & 2 Up!'
            : demoStep === 1
            ? 'Moving the rectangle from (2, 3) by 5 squares right and 2 squares up!'
            : 'The rectangle translated to new position (7, 5)! Every single vertex shifted 5 units right and 2 units up smoothly without turning or resizing.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Translating 2D Shapes! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'triangle_slide' | 'rectangle_slide') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'triangle_slide') {
      safeNarrate('Original Triangle at starting position on the grid. Click Slide 4 Left & 1 Down!');
    } else {
      safeNarrate('Rectangle at starting position (2, 3). Click Move 5 Right & 2 Up!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'triangle_slide') {
      const desc =
        next === 0
          ? 'Original Triangle at starting position on the grid. Click Slide 4 Left & 1 Down!'
          : next === 1
          ? 'Sliding the triangle 4 squares to the left and 1 square down across the grid!'
          : 'Every vertex moved 4 squares left and 1 square down! Notice the dashed connecting lines between matching vertices—they are all parallel and equal in length!';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Rectangle at starting position (2, 3). Click Move 5 Right & 2 Up!'
          : next === 1
          ? 'Moving the rectangle from (2, 3) by 5 squares right and 2 squares up!'
          : 'The rectangle translated to new position (7, 5)! Every single vertex shifted 5 units right and 2 units up smoothly without turning or resizing.';
      safeNarrate(desc);
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
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#16241f]/10">
        <div>
          <p className="text-xs uppercase font-bold tracking-wider text-[#9c6f1f]">{unitTitle}</p>
          <h2 className="text-lg font-bold text-[#16241f] mt-0.5">{conceptName}</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#9c6f1f]/10 rounded-full border border-[#9c6f1f]/30">
          <span className="text-base">⭐</span>
          <span className="text-sm font-bold text-[#9c6f1f]">{stars} Stars</span>
        </div>
      </div>

      {/* Phase 1: Visual Intro */}
      {phase === 'visual_intro' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm">
            <h3 className="text-sm font-bold text-[#9c6f1f] uppercase tracking-wide mb-1">
              Core Definition & Key Rules
            </h3>
            <p className="text-sm leading-relaxed text-[#16241f]">
              A <strong>translation</strong> is sliding a shape in a straight direction across a grid without turning, flipping, or resizing it. 
              <strong> Every single vertex</strong> on the shape moves the exact same distance and direction. 
              Translations are described by stating how many units a shape moves <strong>horizontally (left or right)</strong> and <strong>vertically (up or down)</strong>. 
              Connecting lines drawn between each original vertex and its matching new vertex will <strong>always be parallel and equal in length</strong>.
            </p>
          </div>

          {/* Example Overview Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Triangle Translation Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Sliding a triangle 4 squares to the left and 1 square down
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Matching vertices move along equal, parallel paths.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                📐 4 Left, 1 Down
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Rectangle Coordinate Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Moving a rectangle from starting position (2, 3) by 5 squares right and 2 squares up
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Arrives at new coordinate position (7, 5).
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🟩 (2, 3) ➔ (7, 5)
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Shape Translation Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('triangle_slide')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'triangle_slide'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              📐 Triangle (4 Left, 1 Down)
            </button>
            <button
              onClick={() => handleSelectDemoMode('rectangle_slide')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'rectangle_slide'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🟩 Rectangle (2,3) ➔ 5 Right, 2 Up
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'triangle_slide' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-2">
                  Triangle Translation: 4 Squares Left, 1 Square Down
                </h3>

                {/* Grid Visualizer SVG for Triangle */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3 flex justify-center">
                  <svg width="260" height="200" className="bg-white rounded-lg border border-[#16241f]/20 shadow-inner">
                    {/* Grid Background Lines (8x6 Grid, 30px per cell) */}
                    {Array.from({ length: 9 }).map((_, i) => (
                      <line key={`v-${i}`} x1={i * 30 + 10} y1="10" x2={i * 30 + 10} y2="190" stroke="#16241f" strokeOpacity="0.1" strokeWidth="1" />
                    ))}
                    {Array.from({ length: 7 }).map((_, i) => (
                      <line key={`h-${i}`} x1="10" y1={i * 30 + 10} x2={250} y2={i * 30 + 10} stroke="#16241f" strokeOpacity="0.1" strokeWidth="1" />
                    ))}

                    {/* Original Triangle */}
                    <polygon
                      points="190,70 250,70 220,160"
                      fill="#16241f"
                      fillOpacity={demoStep >= 1 ? '0.2' : '0.8'}
                      stroke="#16241f"
                      strokeWidth="2.5"
                    />
                    <text x="210" y="95" fill="#16241f" fontSize="10" fontWeight="bold">Original</text>

                    {/* Translated Triangle */}
                    {demoStep >= 1 && (
                      <polygon
                        points="70,100 130,100 100,190"
                        fill="#9c6f1f"
                        fillOpacity="0.8"
                        stroke="#9c6f1f"
                        strokeWidth="2.5"
                        className="animate-fade-in"
                      />
                    )}
                    {demoStep >= 1 && (
                      <text x="85" y="125" fill="#ffffff" fontSize="10" fontWeight="bold">Slide</text>
                    )}

                    {/* Parallel Dashed Path Lines connecting matching vertices */}
                    {demoStep >= 2 && (
                      <>
                        <line x1="190" y1="70" x2="70" y2="100" stroke="#9c6f1f" strokeWidth="2" strokeDasharray="4,3" />
                        <line x1="250" y1="70" x2="130" y2="100" stroke="#9c6f1f" strokeWidth="2" strokeDasharray="4,3" />
                        <line x1="220" y1="160" x2="100" y2="190" stroke="#9c6f1f" strokeWidth="2" strokeDasharray="4,3" />
                      </>
                    )}
                  </svg>
                </div>

                {demoStep === 1 && (
                  <div className="p-2.5 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                    ✨ Triangle slid 4 squares left and 1 square down without turning or resizing!
                  </div>
                )}

                {demoStep === 2 && (
                  <div className="p-2.5 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                    🎉 Notice the dashed connecting lines between matching vertices—they are all parallel and equal in length!
                  </div>
                )}

                <button
                  onClick={handleNextDemoStep}
                  className="mt-3 py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Slide Triangle 4 Left & 1 Down'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Show Parallel Vertex Connecting Lines'
                    : '🔄 Reset Triangle Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-2">
                  Rectangle Translation: Start (2, 3) ➔ Move 5 Right, 2 Up ➔ (7, 5)
                </h3>

                {/* Grid Visualizer SVG for Rectangle */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3 flex justify-center">
                  <svg width="260" height="200" className="bg-white rounded-lg border border-[#16241f]/20 shadow-inner">
                    {/* Grid Lines */}
                    {Array.from({ length: 9 }).map((_, i) => (
                      <line key={`v-${i}`} x1={i * 28 + 15} y1="10" x2={i * 28 + 15} y2="180" stroke="#16241f" strokeOpacity="0.1" strokeWidth="1" />
                    ))}
                    {Array.from({ length: 7 }).map((_, i) => (
                      <line key={`h-${i}`} x1="15" y1={180 - i * 26} x2={239} y2={180 - i * 26} stroke="#16241f" strokeOpacity="0.1" strokeWidth="1" />
                    ))}

                    {/* Original Rectangle */}
                    <rect
                      x="71"
                      y="102"
                      width="56"
                      height="52"
                      fill="#16241f"
                      fillOpacity={demoStep >= 1 ? '0.2' : '0.8'}
                      stroke="#16241f"
                      strokeWidth="2.5"
                      rx="4"
                    />
                    <text x="76" y="132" fill="#16241f" fontSize="10" fontWeight="bold">(2,3)</text>

                    {/* Translated Rectangle */}
                    {demoStep >= 1 && (
                      <rect
                        x="211"
                        y="50"
                        width="56"
                        height="52"
                        fill="#9c6f1f"
                        fillOpacity="0.85"
                        stroke="#9c6f1f"
                        strokeWidth="2.5"
                        rx="4"
                        className="animate-fade-in"
                      />
                    )}
                    {demoStep >= 1 && (
                      <text x="216" y="80" fill="#ffffff" fontSize="10" fontWeight="bold">(7,5)</text>
                    )}

                    {/* Connecting Arrow */}
                    {demoStep >= 2 && (
                      <path
                        d="M 127 102 Q 170 60 211 50"
                        fill="none"
                        stroke="#9c6f1f"
                        strokeWidth="2.5"
                        strokeDasharray="4,2"
                      />
                    )}
                  </svg>
                </div>

                {demoStep === 1 && (
                  <div className="p-2.5 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                    ✨ Shifted 5 units right and 2 units up! New corner position is (7, 5).
                  </div>
                )}

                {demoStep === 2 && (
                  <div className="p-2.5 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                    🎉 Smooth translation complete! Every single vertex moved 5 units right and 2 units up.
                  </div>
                )}

                <button
                  onClick={handleNextDemoStep}
                  className="mt-3 py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Move Rectangle 5 Right & 2 Up'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Verify Coordinate Shift to (7, 5)'
                    : '🔄 Reset Rectangle Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'triangle_slide' ? (
                <>
                  {demoStep === 0 && 'Original Triangle at starting position on the grid. Click Slide 4 Left & 1 Down!'}
                  {demoStep === 1 && 'Sliding the triangle 4 squares to the left and 1 square down across the grid!'}
                  {demoStep === 2 && 'Every vertex moved 4 squares left and 1 square down! Notice the dashed connecting lines between matching vertices—they are all parallel and equal in length!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Rectangle at starting position (2, 3). Click Move 5 Right & 2 Up!'}
                  {demoStep === 1 && 'Moving the rectangle from (2, 3) by 5 squares right and 2 squares up!'}
                  {demoStep === 2 && 'The rectangle translated to new position (7, 5)! Every single vertex shifted 5 units right and 2 units up smoothly without turning or resizing.'}
                </>
              )}
            </p>
          </div>

          <button
            onClick={() => setPhase('checkpoint_quiz')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Start Checkpoint Quiz ➔
          </button>
        </div>
      )}

      {/* Phase 3: Checkpoint Quiz */}
      {phase === 'checkpoint_quiz' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f]">
              Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <div className="flex gap-1">
              {QUIZ_QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full ${
                    idx === quizIndex
                      ? 'bg-[#9c6f1f]'
                      : idx < quizIndex
                      ? 'bg-[#16241f]'
                      : 'bg-[#16241f]/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Box */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm">
            <h3 className="text-base font-bold text-[#16241f] leading-snug">
              {QUIZ_QUESTIONS[quizIndex].questionText}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
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
                  className={`w-full p-4 text-left font-semibold text-sm rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {isSelected && isCorrectIndex && <span>✨ Correct!</span>}
                </button>
              );
            })}
          </div>

          {/* Hint Card on Error */}
          {showHint && (
            <div className="p-4 bg-[#9c6f1f]/10 rounded-xl border border-[#9c6f1f]/30 text-xs font-medium text-[#16241f] animate-fade-in">
              <span className="font-bold text-[#9c6f1f] block mb-1">💡 Helpful Hint:</span>
              {QUIZ_QUESTIONS[quizIndex].hint}
            </div>
          )}
        </div>
      )}

      {/* Phase 4: Passed State */}
      {phase === 'passed' && (
        <div className="text-center py-8 space-y-5 animate-fade-in">
          <div className="text-5xl">🎉</div>
          <h3 className="text-xl font-black text-[#16241f]">Concept Mastered!</h3>
          <p className="text-sm text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            Awesome job! You successfully completed the checkpoint quiz for <strong>Translating 2D Shapes</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Translation has 'sl' in it—just think of a smooth 'slide' where nothing turns or twists!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('triangle_slide');
                setDemoStep(0);
              }}
              className="py-3 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
            >
              🔄 Replay Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslatingShapesPlayer;
