import React, { useState, useEffect, useCallback } from 'react';

export interface PercentageGridPlayerProps {
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
    questionText: 'What does the percent symbol (%) mean, and how is a percentage defined?',
    options: [
      'It means "for every hundred", showing a quantity as a number of parts out of 100 equal pieces',
      'It means dividing a number by 10 equal parts',
      'It means multiplying a total by 100'
    ],
    correctIndex: 0,
    hint: 'The percent symbol means "for every hundred" - showing a quantity as parts out of 100 equal pieces.'
  },
  {
    id: 2,
    questionText: 'In a marathon group of 100 total runners, if 8 finish in under an hour, what percentage of the group is that?',
    options: [
      '8% (because 8 out of 100 equal parts equals 8 percent)',
      '80%',
      '0.8%'
    ],
    correctIndex: 0,
    hint: 'If 8 out of 100 runners finish in under an hour, that group is 8% of the total.'
  },
  {
    id: 3,
    questionText: 'When 25 squares out of a 100-square grid are shaded, how is this written as a fraction and a percentage?',
    options: [
      '25/100 or 25% (twenty-five hundredths)',
      '25/10 or 250%',
      '1/25 or 4%'
    ],
    correctIndex: 0,
    hint: 'Shading 25 squares out of a 100-square grid represents 25/100 or 25%.'
  }
];

export const PercentageGridPlayer: React.FC<PercentageGridPlayerProps> = ({
  conceptName = 'Concept 11.1: Understanding Percentages',
  unitTitle = 'Unit 11: Fractions, Decimals, Percentages (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'grid_25' | 'runners_8'>('grid_25');
  const [demoStep, setDemoStep] = useState<number>(0);
  const [shadedCount, setShadedCount] = useState<number>(0);
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
        'A percentage shows a quantity as a number of parts out of one hundred equal pieces. The percent symbol means "for every hundred". The whole amount or complete object always equals one hundred percent. Any percentage can be written as a fraction where the denominator is one hundred. A hundred-square grid is a great visual tool where each individual square represents one percent. Think of a century having 100 years - "cent" in percent always means 100!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'grid_25') {
        const desc =
          demoStep === 0
            ? 'Interactive 10x10 hundred-square grid. Click Shade 25 Squares!'
            : demoStep === 1
            ? 'Shading 25 out of 100 squares on the grid!'
            : '25 squares out of 100 are shaded gold, representing twenty-five hundredths or 25%!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Interactive 100 runners grid. Click Highlight 8 Fast Runners!'
            : demoStep === 1
            ? 'Highlighting 8 out of 100 runners who finished in under an hour!'
            : '8 out of 100 runners are highlighted, representing 8% of the total runners group!';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Understanding Percentages! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'grid_25' | 'runners_8') => {
    setDemoMode(mode);
    setDemoStep(0);
    setShadedCount(0);
    if (mode === 'grid_25') {
      safeNarrate('Interactive 10x10 hundred-square grid. Click Shade 25 Squares!');
    } else {
      safeNarrate('Interactive 100 runners grid. Click Highlight 8 Fast Runners!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'grid_25') {
      if (next === 1) setShadedCount(25);
      if (next === 0) setShadedCount(0);
      const desc =
        next === 0
          ? 'Interactive 10x10 hundred-square grid. Click Shade 25 Squares!'
          : next === 1
          ? 'Shading 25 out of 100 squares on the grid!'
          : '25 squares out of 100 are shaded gold, representing twenty-five hundredths or 25%!';
      safeNarrate(desc);
    } else {
      if (next === 1) setShadedCount(8);
      if (next === 0) setShadedCount(0);
      const desc =
        next === 0
          ? 'Interactive 100 runners grid. Click Highlight 8 Fast Runners!'
          : next === 1
          ? 'Highlighting 8 out of 100 runners who finished in under an hour!'
          : '8 out of 100 runners are highlighted, representing 8% of the total runners group!';
      safeNarrate(desc);
    }
  };

  const handleToggleSquare = (index: number) => {
    if (demoMode === 'grid_25') {
      if (index < shadedCount) {
        setShadedCount((prev) => Math.max(0, prev - 1));
      } else {
        setShadedCount((prev) => Math.min(100, prev + 1));
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

  const currentPercentage = demoMode === 'grid_25' ? (demoStep >= 1 ? 25 : shadedCount) : (demoStep >= 1 ? 8 : 0);

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
              A <strong>percentage</strong> shows a quantity as a number of parts out of <strong>one hundred equal pieces</strong>. 
              The percent symbol (%) means <strong>"for every hundred"</strong>. 
              The complete whole amount always equals <strong>100%</strong>. 
              Any percentage can be written as a fraction with a denominator of <strong>100</strong>. 
              A <strong>100-square grid</strong> is a great visual tool where each square represents <strong>1%</strong>.
            </p>
          </div>

          {/* Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  100-Square Grid Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Shading 25 squares out of 100 = 25/100 or 25%
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  25 hundredths = twenty-five percent!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                🟨 25%
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Runners Group Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  8 out of 100 runners finishing under 1 hour = 8%
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  8 out of 100 equal group parts.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🏃 8%
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Percentage Grid Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('grid_25')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'grid_25'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🟨 100-Square Grid (25%)
            </button>
            <button
              onClick={() => handleSelectDemoMode('runners_8')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'runners_8'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🏃 100 Runners Group (8%)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'grid_25' ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                    Shading 25 Squares out of 100 (25%)
                  </h3>
                  <div className="px-3 py-1 bg-[#9c6f1f]/15 text-[#9c6f1f] font-black text-sm rounded-lg border border-[#9c6f1f]/30">
                    {currentPercentage}% ({currentPercentage}/100)
                  </div>
                </div>

                {/* 10x10 Grid */}
                <div className="p-3 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3 inline-block">
                  <div className="grid grid-cols-10 gap-1 max-w-[280px] mx-auto">
                    {Array.from({ length: 100 }).map((_, idx) => {
                      const isShaded = idx < currentPercentage;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleToggleSquare(idx)}
                          className={`w-6 h-6 rounded-sm text-[8px] font-bold transition-all duration-200 ${
                            isShaded
                              ? 'bg-[#9c6f1f] text-white shadow-xs scale-105'
                              : 'bg-white text-[#16241f]/30 border border-[#16241f]/15 hover:border-[#9c6f1f]'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {demoStep === 1 && (
                  <div className="p-2.5 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                    ✨ 25 out of 100 squares are shaded gold!
                  </div>
                )}

                {demoStep === 2 && (
                  <div className="p-2.5 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                    🎉 25 out of 100 squares represents 25/100 or 25%! Each square is worth 1%.
                  </div>
                )}

                <button
                  onClick={handleNextDemoStep}
                  className="mt-3 py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Shade 25 Squares (25%)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Convert to Fraction & Percent'
                    : '🔄 Reset Grid Demo'}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider">
                    100 Runners: 8 Finishing in Under 1 Hour (8%)
                  </h3>
                  <div className="px-3 py-1 bg-[#16241f]/10 text-[#16241f] font-black text-sm rounded-lg border border-[#16241f]/20">
                    {demoStep >= 1 ? '8%' : '0%'} ({demoStep >= 1 ? '8/100' : '0/100'})
                  </div>
                </div>

                {/* 100 Runners Visualizer Grid */}
                <div className="p-3 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3 inline-block">
                  <div className="grid grid-cols-10 gap-1 max-w-[280px] mx-auto">
                    {Array.from({ length: 100 }).map((_, idx) => {
                      const isHighlighted = demoStep >= 1 && idx < 8;
                      return (
                        <div
                          key={idx}
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] transition-all duration-300 ${
                            isHighlighted
                              ? 'bg-[#16241f] text-[#f4f6f1] shadow-xs scale-110 font-bold border border-[#9c6f1f]'
                              : 'bg-white text-[#16241f]/30 border border-[#16241f]/10'
                          }`}
                        >
                          🏃
                        </div>
                      );
                    })}
                  </div>
                </div>

                {demoStep === 1 && (
                  <div className="p-2.5 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                    ✨ 8 out of 100 runners highlighted in dark green!
                  </div>
                )}

                {demoStep === 2 && (
                  <div className="p-2.5 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                    🎉 8 out of 100 runners equals 8/100 or 8% of total runners!
                  </div>
                )}

                <button
                  onClick={handleNextDemoStep}
                  className="mt-3 py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Highlight 8 Fast Runners'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Express as 8% of Whole Group'
                    : '🔄 Reset Runners Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'grid_25' ? (
                <>
                  {demoStep === 0 && 'Interactive 10x10 hundred-square grid. Click Shade 25 Squares!'}
                  {demoStep === 1 && 'Shading 25 out of 100 squares on the grid!'}
                  {demoStep === 2 && '25 squares out of 100 are shaded gold, representing twenty-five hundredths or 25%!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Interactive 100 runners grid. Click Highlight 8 Fast Runners!'}
                  {demoStep === 1 && 'Highlighting 8 out of 100 runners who finished in under an hour!'}
                  {demoStep === 2 && '8 out of 100 runners are highlighted, representing 8% of the total runners group!'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Understanding Percentages</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Think of a century having 100 years - 'cent' in percent always means 100!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('grid_25');
                setDemoStep(0);
                setShadedCount(0);
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

export default PercentageGridPlayer;
