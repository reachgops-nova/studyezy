import React, { useState, useEffect, useCallback } from 'react';

export interface SymmetryPatternPlayerProps {
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
    questionText: 'If you shade 2 squares that are 3 steps to the left of a vertical mirror line, where must the reflected squares be shaded?',
    options: [
      '2 matching squares 3 steps to the right of the mirror line',
      '2 matching squares 1 step to the right of the mirror line',
      '3 matching squares 2 steps below the mirror line'
    ],
    correctIndex: 0,
    hint: 'Each point or square in a pattern must be the exact same distance from the mirror line as its reflection, so 3 steps to the left matches 3 steps to the right.'
  },
  {
    id: 2,
    questionText: 'How does a line of symmetry function in a grid pattern?',
    options: [
      'It works like a flat mirror reflecting shapes or shaded squares directly opposite it at the exact same distance',
      'It rotates all shapes by 90 degrees around the center',
      'It doubles the size of every square on the right side'
    ],
    correctIndex: 0,
    hint: 'A line of symmetry works like a flat mirror reflecting shapes or shaded squares directly opposite it.'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember when checking if a grid pattern is symmetrical?',
    options: [
      'Count all the squares on the grid and check if the total is an even number',
      'Picture folding the grid along the mirror line - every colored square should land directly on top of its partner',
      'Make sure all four corners of the grid are colored black'
    ],
    correctIndex: 1,
    hint: 'Picture folding the grid along the mirror line - every colored square should land directly on top of its partner.'
  }
];

export const SymmetryPatternPlayer: React.FC<SymmetryPatternPlayerProps> = ({
  conceptName = 'Concept 2.1: Symmetrical Patterns and Lines of Symmetry',
  unitTitle = 'Unit 2: Angles and Shapes (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'vertical_line' | 'four_quadrants'>('vertical_line');
  const [isReflected, setIsReflected] = useState<boolean>(false);
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
        'A symmetrical pattern is a design where one side perfectly mirrors the other across a line of symmetry. This dividing line can run vertically, horizontally, or diagonally across a grid. A line of symmetry works like a flat mirror reflecting shapes or shaded squares directly opposite it at the exact same distance.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'vertical_line') {
        if (!isReflected) {
          safeNarrate(
            'Shading 2 squares 3 steps to the left of a vertical mirror line. Click Reflect Across Mirror Line to mirror them 3 steps to the right!'
          );
        } else {
          safeNarrate(
            'Reflected! 2 matching squares are shaded 3 steps to the right of the vertical mirror line at the exact same distance.'
          );
        }
      } else {
        if (!isReflected) {
          safeNarrate(
            'Corner design in quadrant 1. Click Reflect Across Both Axes to mirror across both a horizontal line and a vertical line to create 4 matching quadrants!'
          );
        } else {
          safeNarrate(
            'Reflected across both horizontal and vertical lines of symmetry! The design now has 4 matching quadrants.'
          );
        }
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Symmetrical Patterns and Lines of Symmetry! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, isReflected, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'vertical_line' | 'four_quadrants') => {
    setDemoMode(mode);
    setIsReflected(false);
    if (mode === 'vertical_line') {
      safeNarrate(
        'Shading 2 squares 3 steps to the left of a vertical mirror line. Click Reflect Across Mirror Line to mirror them 3 steps to the right!'
      );
    } else {
      safeNarrate(
        'Corner design in quadrant 1. Click Reflect Across Both Axes to mirror across both a horizontal line and a vertical line to create 4 matching quadrants!'
      );
    }
  };

  const handleToggleReflection = () => {
    const nextState = !isReflected;
    setIsReflected(nextState);
    if (demoMode === 'vertical_line') {
      if (nextState) {
        safeNarrate(
          'Reflected! 2 matching squares are shaded 3 steps to the right of the vertical mirror line at the exact same distance.'
        );
      } else {
        safeNarrate(
          'Shading 2 squares 3 steps to the left of a vertical mirror line. Click Reflect Across Mirror Line to mirror them 3 steps to the right!'
        );
      }
    } else {
      if (nextState) {
        safeNarrate(
          'Reflected across both horizontal and vertical lines of symmetry! The design now has 4 matching quadrants.'
        );
      } else {
        safeNarrate(
          'Corner design in quadrant 1. Click Reflect Across Both Axes to mirror across both a horizontal line and a vertical line to create 4 matching quadrants!'
        );
      }
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
              Core Definition & Rules
            </h3>
            <p className="text-sm leading-relaxed text-[#16241f]">
              A <strong>symmetrical pattern</strong> is a design where one side perfectly mirrors the other across a line of symmetry. This dividing line can run vertically, horizontally, or diagonally across a grid. 
              <strong> A line of symmetry works like a flat mirror</strong> reflecting shapes or shaded squares directly opposite it at the <strong>exact same distance</strong>.
            </p>
          </div>

          {/* Real Source Examples Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Vertical Mirror Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Shading 2 squares 3 steps to the left ➔ 2 matching squares 3 steps to the right
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Each point or square is the exact same distance from the mirror line as its reflection.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                🪞 3 Steps Left/Right
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Multiple Axes Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Corner design reflected across horizontal and vertical lines
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Creates a pattern with 4 matching quadrants across both axes.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🖼️ 4 Quadrants
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Symmetry Grid Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Grid Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('vertical_line')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'vertical_line'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🪞 Vertical Mirror (3 Steps Left/Right)
            </button>
            <button
              onClick={() => handleSelectDemoMode('four_quadrants')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'four_quadrants'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🖼️ 4 Quadrants (Horizontal + Vertical)
            </button>
          </div>

          {/* Interactive Grid Visual */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'vertical_line' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Reflecting 2 Squares (3 Steps Left ➔ 3 Steps Right)
                </h3>

                {/* 7-column Grid with Vertical Mirror Line */}
                <div className="inline-block p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-2">
                  <div className="grid grid-cols-7 gap-1 max-w-[280px] mx-auto relative">
                    {/* Column Labels */}
                    {[-3, -2, -1, 0, 1, 2, 3].map((col, idx) => (
                      <div key={idx} className="text-[10px] font-bold text-[#16241f]/60 text-center mb-1">
                        {col === 0 ? 'LINE' : `${Math.abs(col)}s`}
                      </div>
                    ))}

                    {/* Row 1 Grid */}
                    <div className="w-8 h-8 rounded bg-[#9c6f1f] border border-[#9c6f1f] shadow-xs flex items-center justify-center text-white text-[10px] font-bold">1</div>
                    <div className="w-8 h-8 rounded bg-white border border-[#16241f]/20"></div>
                    <div className="w-8 h-8 rounded bg-white border border-[#16241f]/20"></div>
                    <div className="w-8 h-8 rounded bg-[#16241f] border border-[#16241f] flex items-center justify-center text-white text-[10px] font-bold">🪞</div>
                    <div className="w-8 h-8 rounded bg-white border border-[#16241f]/20"></div>
                    <div className="w-8 h-8 rounded bg-white border border-[#16241f]/20"></div>
                    <div className={`w-8 h-8 rounded border transition-all duration-300 flex items-center justify-center text-white text-[10px] font-bold ${
                      isReflected ? 'bg-[#9c6f1f] border-[#9c6f1f] scale-105 shadow-xs' : 'bg-white border-dashed border-[#16241f]/30'
                    }`}>{isReflected ? '1' : ''}</div>

                    {/* Row 2 Grid */}
                    <div className="w-8 h-8 rounded bg-[#9c6f1f] border border-[#9c6f1f] shadow-xs flex items-center justify-center text-white text-[10px] font-bold">2</div>
                    <div className="w-8 h-8 rounded bg-white border border-[#16241f]/20"></div>
                    <div className="w-8 h-8 rounded bg-white border border-[#16241f]/20"></div>
                    <div className="w-8 h-8 rounded bg-[#16241f] border border-[#16241f] flex items-center justify-center text-white text-[10px] font-bold">🪞</div>
                    <div className="w-8 h-8 rounded bg-white border border-[#16241f]/20"></div>
                    <div className="w-8 h-8 rounded bg-white border border-[#16241f]/20"></div>
                    <div className={`w-8 h-8 rounded border transition-all duration-300 flex items-center justify-center text-white text-[10px] font-bold ${
                      isReflected ? 'bg-[#9c6f1f] border-[#9c6f1f] scale-105 shadow-xs' : 'bg-white border-dashed border-[#16241f]/30'
                    }`}>{isReflected ? '2' : ''}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    onClick={handleToggleReflection}
                    className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                  >
                    {isReflected ? '🔄 Reset Reflection' : '🪞 Reflect Across Mirror Line (3 Steps Right)'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Reflecting Across Horizontal and Vertical Axes (4 Quadrants)
                </h3>

                {/* 4x4 Grid for 4 Quadrants */}
                <div className="inline-block p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-2">
                  <div className="grid grid-cols-4 gap-1 max-w-[180px] mx-auto relative">
                    {/* Top Left (Q1) - Original Design */}
                    <div className="w-9 h-9 rounded bg-[#9c6f1f] border border-[#9c6f1f] flex items-center justify-center text-white text-[10px] font-bold">Q1</div>
                    <div className="w-9 h-9 rounded bg-[#16241f]/10 border border-[#16241f]/20"></div>
                    {/* Top Right (Q2) */}
                    <div className="w-9 h-9 rounded bg-[#16241f]/10 border border-[#16241f]/20"></div>
                    <div className={`w-9 h-9 rounded border transition-all duration-300 flex items-center justify-center text-white text-[10px] font-bold ${
                      isReflected ? 'bg-[#9c6f1f] border-[#9c6f1f]' : 'bg-white border-dashed border-[#16241f]/30'
                    }`}>{isReflected ? 'Q2' : ''}</div>

                    {/* Bottom Left (Q3) */}
                    <div className="w-9 h-9 rounded bg-[#16241f]/10 border border-[#16241f]/20"></div>
                    <div className={`w-9 h-9 rounded border transition-all duration-300 flex items-center justify-center text-white text-[10px] font-bold ${
                      isReflected ? 'bg-[#9c6f1f] border-[#9c6f1f]' : 'bg-white border-dashed border-[#16241f]/30'
                    }`}>{isReflected ? 'Q3' : ''}</div>
                    {/* Bottom Right (Q4) */}
                    <div className={`w-9 h-9 rounded border transition-all duration-300 flex items-center justify-center text-white text-[10px] font-bold ${
                      isReflected ? 'bg-[#9c6f1f] border-[#9c6f1f]' : 'bg-white border-dashed border-[#16241f]/30'
                    }`}>{isReflected ? 'Q4' : ''}</div>
                    <div className="w-9 h-9 rounded bg-[#16241f]/10 border border-[#16241f]/20"></div>
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    onClick={handleToggleReflection}
                    className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                  >
                    {isReflected ? '🔄 Reset Quadrants' : '🖼️ Reflect Across Both Axes (4 Quadrants)'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'vertical_line' ? (
                <>
                  {!isReflected ? (
                    <>Shading 2 squares 3 steps to the left of a vertical mirror line. Click reflect to mirror them 3 steps to the right!</>
                  ) : (
                    <>Reflected! 2 matching squares are shaded <strong>3 steps to the right</strong> of the vertical mirror line at the exact same distance.</>
                  )}
                </>
              ) : (
                <>
                  {!isReflected ? (
                    <>Corner design in quadrant 1. Click reflect across both axes to mirror horizontal and vertical lines!</>
                  ) : (
                    <>Reflected across both horizontal and vertical lines of symmetry! The design now has <strong>4 matching quadrants</strong>.</>
                  )}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Symmetrical Patterns and Lines of Symmetry</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Picture folding the grid along the mirror line - every colored square should land directly on top of its partner.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('vertical_line');
                setIsReflected(false);
              }}
              className="py-3 px-6 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
            >
              🔄 Replay Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymmetryPatternPlayer;
