import React, { useState, useEffect, useCallback } from 'react';

export interface CoordinateShapesPlayerProps {
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
    questionText: 'When three corners of a rectangle are plotted at (1, 3), (5, 3), and (5, 4), where must the fourth corner be?',
    options: [
      '(1, 4) (matching equal side lengths and parallel opposite edges)',
      '(3, 5)',
      '(0, 0)'
    ],
    correctIndex: 0,
    hint: 'To complete the rectangle with parallel opposite sides, match x=1 and y=4 to plot the fourth corner at (1, 4).'
  },
  {
    id: 2,
    questionText: 'An isosceles triangle has a horizontal base between (4, 3) and (6, 3). Where should the top vertex be placed?',
    options: [
      'Halfway along the base at x=5, such as (5, 7)',
      'At (0, 0)',
      'At (10, 10)'
    ],
    correctIndex: 0,
    hint: 'An isosceles triangle has symmetrical sides, so its top vertex must sit halfway along the base at x=5, such as (5, 7).'
  },
  {
    id: 3,
    questionText: 'What is the golden rule for reading coordinate pairs written as (x, y)?',
    options: [
      'Go along the corridor along the x-axis first, before going up the stairs along the y-axis: (x, y)',
      'Go up the y-axis first, then along the x-axis',
      'Add x and y together before plotting'
    ],
    correctIndex: 0,
    hint: 'Go along the corridor along the x-axis before you go up the stairs along the y-axis: (x, y)!'
  }
];

export const CoordinateShapesPlayer: React.FC<CoordinateShapesPlayerProps> = ({
  conceptName = 'Concept 10.2: Shapes on a Coordinate Grid',
  unitTitle = 'Unit 10: Location and Movement (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'rectangle_4th' | 'isosceles_triangle'>('rectangle_4th');
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
        'A coordinate grid uses number pairs written as (x, y) to pinpoint positions and help us draw or complete geometric shapes. Coordinates are read along the horizontal x-axis first, then up the vertical y-axis. You can work out the missing vertex of a shape like a rectangle by matching equal side lengths and parallel edges. Given a set of vertices, sometimes more than one valid geometric shape can be formed depending on where you plot the final points. Go along the corridor along the x-axis before you go up the stairs along the y-axis: (x, y)!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'rectangle_4th') {
        const desc =
          demoStep === 0
            ? 'Plotting three corners of a rectangle at (1, 3), (5, 3), and (5, 4). Click Plot 4th Corner!'
            : demoStep === 1
            ? 'Matching equal side lengths and parallel edges points directly to the fourth corner at (1, 4)!'
            : 'Rectangle completed! Plotting three corners at (1, 3), (5, 3), and (5, 4) means the fourth corner must be at (1, 4).';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Creating an isosceles triangle with horizontal base between (4, 3) and (6, 3). Click Plot Top Vertex!'
            : demoStep === 1
            ? 'Plotting the top vertex halfway along the base at x=5, up at (5, 7)!'
            : 'Isosceles triangle completed! A horizontal base between (4, 3) and (6, 3) has its top vertex halfway along at (5, 7) for equal side lengths.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Shapes on a Coordinate Grid! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'rectangle_4th' | 'isosceles_triangle') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'rectangle_4th') {
      safeNarrate('Plotting three corners of a rectangle at (1, 3), (5, 3), and (5, 4). Click Plot 4th Corner!');
    } else {
      safeNarrate('Creating an isosceles triangle with horizontal base between (4, 3) and (6, 3). Click Plot Top Vertex!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'rectangle_4th') {
      const desc =
        next === 0
          ? 'Plotting three corners of a rectangle at (1, 3), (5, 3), and (5, 4). Click Plot 4th Corner!'
          : next === 1
          ? 'Matching equal side lengths and parallel edges points directly to the fourth corner at (1, 4)!'
          : 'Rectangle completed! Plotting three corners at (1, 3), (5, 3), and (5, 4) means the fourth corner must be at (1, 4).';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Creating an isosceles triangle with horizontal base between (4, 3) and (6, 3). Click Plot Top Vertex!'
          : next === 1
          ? 'Plotting the top vertex halfway along the base at x=5, up at (5, 7)!'
          : 'Isosceles triangle completed! A horizontal base between (4, 3) and (6, 3) has its top vertex halfway along at (5, 7) for equal side lengths.';
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
              A <strong>coordinate grid</strong> uses number pairs written as <strong>(x, y)</strong> to pinpoint positions and help us draw or complete geometric shapes. 
              Coordinates are read along the <strong>horizontal x-axis first</strong>, then <strong>up the vertical y-axis</strong>. 
              You can work out the missing vertex of a shape like a rectangle by matching <strong>equal side lengths and parallel edges</strong>. 
              Sometimes more than one valid geometric shape can be formed depending on where you plot final points!
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Rectangle Fourth Corner Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Corners at (1, 3), (5, 3), and (5, 4) ➔ Fourth corner must be (1, 4)
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Match parallel vertical and horizontal sides.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                🖼️ (1, 4)
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Isosceles Triangle Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Base between (4, 3) and (6, 3) ➔ Top vertex halfway at (5, 7)
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Halfway between x=4 and x=6 gives x=5.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🔺 (5, 7)
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Coordinate Shapes Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('rectangle_4th')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'rectangle_4th'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🖼️ Rectangle 4th Corner
            </button>
            <button
              onClick={() => handleSelectDemoMode('isosceles_triangle')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'isosceles_triangle'
                  ? 'bg-[#16241f] text-[#f4f6f1] shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🔺 Isosceles Triangle Base
            </button>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'rectangle_4th' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-2">
                  Finding the 4th Corner of Rectangle: (1, 3), (5, 3), (5, 4) ➔ ?
                </h3>

                {/* Grid Visualizer SVG */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3 flex justify-center">
                  <svg width="260" height="200" className="bg-white rounded-lg border border-[#16241f]/20 shadow-inner">
                    {/* Grid Lines (x: 0..7, y: 0..5) */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <g key={`x-${i}`}>
                        <line x1={i * 30 + 25} y1="10" x2={i * 30 + 25} y2="170" stroke="#16241f" strokeOpacity="0.1" strokeWidth="1" />
                        <text x={i * 30 + 25} y="185" fill="#16241f" fontSize="9" textAnchor="middle" fontWeight="bold">{i}</text>
                      </g>
                    ))}
                    {Array.from({ length: 6 }).map((_, i) => (
                      <g key={`y-${i}`}>
                        <line x1="25" y1={170 - i * 30} x2="235" y2={170 - i * 30} stroke="#16241f" strokeOpacity="0.1" strokeWidth="1" />
                        <text x="12" y={173 - i * 30} fill="#16241f" fontSize="9" textAnchor="middle" fontWeight="bold">{i}</text>
                      </g>
                    ))}

                    {/* Given 3 Points: (1,3)=>(55,80), (5,3)=>(175,80), (5,4)=>(175,50) */}
                    <circle cx="55" cy="80" r="5" fill="#16241f" />
                    <text x="55" y="96" fill="#16241f" fontSize="8" fontWeight="bold" textAnchor="middle">(1,3)</text>

                    <circle cx="175" cy="80" r="5" fill="#16241f" />
                    <text x="175" y="96" fill="#16241f" fontSize="8" fontWeight="bold" textAnchor="middle">(5,3)</text>

                    <circle cx="175" cy="50" r="5" fill="#16241f" />
                    <text x="175" y="42" fill="#16241f" fontSize="8" fontWeight="bold" textAnchor="middle">(5,4)</text>

                    {/* Connecting lines for given points */}
                    <line x1="55" y1="80" x2="175" y2="80" stroke="#16241f" strokeWidth="2" />
                    <line x1="175" y1="80" x2="175" y2="50" stroke="#16241f" strokeWidth="2" />

                    {/* Step 1 & 2: Fourth corner (1,4) => (55, 50) */}
                    {demoStep >= 1 && (
                      <>
                        <circle cx="55" cy="50" r="6" fill="#9c6f1f" className="animate-fade-in" />
                        <text x="55" y="42" fill="#9c6f1f" fontSize="9" fontWeight="black" textAnchor="middle">(1,4)</text>

                        <line x1="175" y1="50" x2="55" y2="50" stroke="#9c6f1f" strokeWidth="2.5" strokeDasharray="3,2" />
                        <line x1="55" y1="50" x2="55" y2="80" stroke="#9c6f1f" strokeWidth="2.5" strokeDasharray="3,2" />

                        <rect x="55" y="50" width="120" height="30" fill="#9c6f1f" fillOpacity="0.15" />
                      </>
                    )}
                  </svg>
                </div>

                {demoStep === 1 && (
                  <div className="p-2.5 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                    ✨ Side length x=1 to 5 is 4 units. Opposite side from (5,4) back 4 units gives corner (1,4)!
                  </div>
                )}

                {demoStep === 2 && (
                  <div className="p-2.5 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                    🎉 Rectangle fully closed! The four vertices are (1,3), (5,3), (5,4), and (1,4).
                  </div>
                )}

                <button
                  onClick={handleNextDemoStep}
                  className="mt-3 py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Plot 4th Corner at (1, 4)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Complete Rectangle Perimeter'
                    : '🔄 Reset Rectangle Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-2">
                  Isosceles Triangle: Base (4, 3) to (6, 3) ➔ Top Vertex (5, 7)
                </h3>

                {/* Grid Visualizer SVG for Isosceles Triangle */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3 flex justify-center">
                  <svg width="260" height="200" className="bg-white rounded-lg border border-[#16241f]/20 shadow-inner">
                    {/* Grid Lines (x: 2..8, y: 1..8) */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <g key={`x-${i}`}>
                        <line x1={i * 28 + 30} y1="10" x2={i * 28 + 30} y2="170" stroke="#16241f" strokeOpacity="0.1" strokeWidth="1" />
                        <text x={i * 28 + 30} y="185" fill="#16241f" fontSize="9" textAnchor="middle" fontWeight="bold">{i + 1}</text>
                      </g>
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <g key={`y-${i}`}>
                        <line x1="30" y1={170 - i * 20} x2={226} y2={170 - i * 20} stroke="#16241f" strokeOpacity="0.1" strokeWidth="1" />
                        <text x="15" y={173 - i * 20} fill="#16241f" fontSize="9" textAnchor="middle" fontWeight="bold">{i + 1}</text>
                      </g>
                    ))}

                    {/* Base Points: (4,3)=>(114, 130), (6,3)=>(170, 130) */}
                    <circle cx="114" cy="130" r="5" fill="#16241f" />
                    <text x="114" y="145" fill="#16241f" fontSize="8" fontWeight="bold" textAnchor="middle">(4,3)</text>

                    <circle cx="170" cy="130" r="5" fill="#16241f" />
                    <text x="170" y="145" fill="#16241f" fontSize="8" fontWeight="bold" textAnchor="middle">(6,3)</text>

                    {/* Base line */}
                    <line x1="114" y1="130" x2="170" y2="130" stroke="#16241f" strokeWidth="3" />

                    {/* Top Vertex (5,7)=>(142, 50) */}
                    {demoStep >= 1 && (
                      <>
                        {/* Vertical symmetry line x=5 */}
                        <line x1="142" y1="20" x2="142" y2="160" stroke="#9c6f1f" strokeWidth="1.5" strokeDasharray="3,2" />

                        <circle cx="142" cy="50" r="6" fill="#9c6f1f" className="animate-fade-in" />
                        <text x="142" y="40" fill="#9c6f1f" fontSize="9" fontWeight="black" textAnchor="middle">(5,7)</text>

                        <line x1="114" y1="130" x2="142" y2="50" stroke="#9c6f1f" strokeWidth="2.5" />
                        <line x1="170" y1="130" x2="142" y2="50" stroke="#9c6f1f" strokeWidth="2.5" />

                        <polygon points="114,130 170,130 142,50" fill="#9c6f1f" fillOpacity="0.2" />
                      </>
                    )}
                  </svg>
                </div>

                {demoStep === 1 && (
                  <div className="p-2.5 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                    ✨ Halfway along base x=4 and x=6 is x=5! Top vertex at (5,7) creates symmetrical equal sides.
                  </div>
                )}

                {demoStep === 2 && (
                  <div className="p-2.5 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                    🎉 Isosceles triangle complete! Side lengths from (5,7) to (4,3) and (6,3) are perfectly equal.
                  </div>
                )}

                <button
                  onClick={handleNextDemoStep}
                  className="mt-3 py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Plot Top Vertex at (5, 7)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Show Symmetrical Isosceles Shape'
                    : '🔄 Reset Isosceles Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'rectangle_4th' ? (
                <>
                  {demoStep === 0 && 'Plotting three corners of a rectangle at (1, 3), (5, 3), and (5, 4). Click Plot 4th Corner!'}
                  {demoStep === 1 && 'Matching equal side lengths and parallel edges points directly to the fourth corner at (1, 4)!'}
                  {demoStep === 2 && 'Rectangle completed! Plotting three corners at (1, 3), (5, 3), and (5, 4) means the fourth corner must be at (1, 4).'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Creating an isosceles triangle with horizontal base between (4, 3) and (6, 3). Click Plot Top Vertex!'}
                  {demoStep === 1 && 'Plotting the top vertex halfway along the base at x=5, up at (5, 7)!'}
                  {demoStep === 2 && 'Isosceles triangle completed! A horizontal base between (4, 3) and (6, 3) has its top vertex halfway along at (5, 7) for equal side lengths.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Shapes on a Coordinate Grid</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Go along the corridor along the x-axis before you go up the stairs along the y-axis: (x, y)!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('rectangle_4th');
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

export default CoordinateShapesPlayer;
