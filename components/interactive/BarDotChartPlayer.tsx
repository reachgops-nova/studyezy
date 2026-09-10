import React, { useState, useEffect, useCallback } from 'react';

export interface BarDotChartPlayerProps {
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
    questionText: 'When tracking sunny days across 6 months, why is a dot plot especially useful?',
    options: [
      'Dots plotted on a scale make it easy to spot rises, falls, and overall trends as summer approaches',
      'Dot plots multiply all numbers together automatically',
      'Dots conceal individual data points so you cannot see them'
    ],
    correctIndex: 0,
    hint: 'Dot plots mark single data points or frequencies with dots on a scale, making it easy to spot rises, falls, and trends across categories.'
  },
  {
    id: 2,
    questionText: 'Why is a bar chart a great choice when comparing how many people cycle to work each month?',
    options: [
      'Solid rectangular bars make it easy to compare exact category totals and spot which month had the highest number',
      'Bars only show continuous measurements that touch with no gaps',
      'Bars hide the totals so you have to guess'
    ],
    correctIndex: 0,
    hint: 'Bar charts display quantities for separate groups with distinct vertical or horizontal bars to compare exact totals.'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember when choosing between bar charts and dot plots?',
    options: [
      'Bars are great for comparing exact totals, while dots help you see the shape of the trend',
      'Always use line graphs for separate categories',
      'Dot plots must always have touching bars with no gaps'
    ],
    correctIndex: 0,
    hint: 'Bars are great for comparing exact totals, while dots help you see the shape of the trend.'
  }
];

export const BarDotChartPlayer: React.FC<BarDotChartPlayerProps> = ({
  conceptName = 'Concept 5.1: Bar Charts and Dot Plots',
  unitTitle = 'Unit 5: Statistical Methods (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'sunny_dots' | 'cycling_bars'>('sunny_dots');
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
        'Bar charts and dot plots are visual displays used to organize and compare discrete information. While bar charts use solid rectangles to show quantities clearly, dot plots use dots plotted on a scale to reveal patterns and overall trends across categories. Comparing both styles helps us see individual category amounts as well as broad trends over time.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'sunny_dots') {
        const desc =
          demoStep === 0
            ? 'Looking at sunny days across 6 months on a dot plot. Click Add Monthly Dots to see the trend build up!'
            : demoStep === 1
            ? 'Dots are marked on a scale for each month! Notice how the number of sunny days rises steadily.'
            : 'A dot plot lets you easily spot that sunnier days increase as summer approaches! Dots help you see the shape of the trend.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Comparing how many people cycle to work each month using a bar chart. Click Build Rectangular Bars!'
            : demoStep === 1
            ? 'Solid rectangular bars show exact totals for each month! Notice May has 45 cyclists, June has 60, and July has 80.'
            : 'A bar chart lets you easily see that July had the highest number of cyclists! Bars are great for comparing exact totals.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Bar Charts and Dot Plots! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'sunny_dots' | 'cycling_bars') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'sunny_dots') {
      safeNarrate('Looking at sunny days across 6 months on a dot plot. Click Add Monthly Dots to see the trend build up!');
    } else {
      safeNarrate('Comparing how many people cycle to work each month using a bar chart. Click Build Rectangular Bars!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'sunny_dots') {
      const desc =
        next === 0
          ? 'Looking at sunny days across 6 months on a dot plot. Click Add Monthly Dots to see the trend build up!'
          : next === 1
          ? 'Dots are marked on a scale for each month! Notice how the number of sunny days rises steadily.'
          : 'A dot plot lets you easily spot that sunnier days increase as summer approaches! Dots help you see the shape of the trend.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Comparing how many people cycle to work each month using a bar chart. Click Build Rectangular Bars!'
          : next === 1
          ? 'Solid rectangular bars show exact totals for each month! Notice May has 45 cyclists, June has 60, and July has 80.'
          : 'A bar chart lets you easily see that July had the highest number of cyclists! Bars are great for comparing exact totals.';
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
              Core Definition & Key Points
            </h3>
            <p className="text-sm leading-relaxed text-[#16241f]">
              <strong>Bar charts and dot plots</strong> are visual displays used to organize and compare discrete information. 
              While <strong>bar charts use solid rectangles</strong> to show quantities clearly, <strong>dot plots use dots plotted on a scale</strong> to reveal patterns and overall trends across categories. 
              Comparing both styles helps us see individual category amounts as well as broad trends over time.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Dot Plot Example (Sunny Days)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Looking at sunny days across 6 months
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  A dot plot lets you easily spot that sunnier days increase as summer approaches.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                ☀️ 📈
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Bar Chart Example (Cycling to Work)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Comparing how many people cycle to work each month
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  A bar chart lets you easily see which month had the highest number.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🚲 📊
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Bar & Dot Plot Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('sunny_dots')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'sunny_dots'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ☀️ Dot Plot (Sunny Days Trend)
            </button>
            <button
              onClick={() => handleSelectDemoMode('cycling_bars')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'cycling_bars'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🚲 Bar Chart (Cycling Totals)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'sunny_dots' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Dot Plot: Sunny Days Across 6 Months (Jan - Jun)
                </h3>

                {/* Dot Plot Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="grid grid-cols-6 gap-2 items-end h-36 pt-4 pb-2 border-b-2 border-[#16241f]/20 px-2">
                    {[
                      { month: 'Jan', count: 2 },
                      { month: 'Feb', count: 3 },
                      { month: 'Mar', count: 5 },
                      { month: 'Apr', count: 7 },
                      { month: 'May', count: 9 },
                      { month: 'Jun', count: 12 }
                    ].map((item) => (
                      <div key={item.month} className="flex flex-col items-center justify-end h-full">
                        {/* Dots stack */}
                        <div className="flex flex-col-reverse items-center gap-1 mb-1">
                          {Array.from({ length: item.count }).map((_, dIdx) => (
                            <div
                              key={dIdx}
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                demoStep >= 1
                                  ? 'bg-[#9c6f1f] scale-100 shadow-sm'
                                  : 'bg-[#16241f]/15 scale-75'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-[#16241f]">{item.month}</span>
                      </div>
                    ))}
                  </div>

                  {demoStep === 2 && (
                    <div className="mt-3 p-2.5 bg-[#9c6f1f]/10 border border-[#9c6f1f]/30 rounded-xl text-xs font-bold text-[#9c6f1f] animate-fade-in">
                      📈 Notice the upward trend! Sunnier days increase as summer approaches.
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '☀️ Step 1: Add Monthly Dots'
                    : demoStep === 1
                    ? '📈 Step 2: Reveal Summer Trend'
                    : '🔄 Reset Dot Plot Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Bar Chart: People Cycling to Work Each Month
                </h3>

                {/* Bar Chart Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="grid grid-cols-4 gap-3 items-end h-36 pt-4 pb-2 border-b-2 border-[#16241f]/20 px-4">
                    {[
                      { month: 'Apr', value: 30, height: 'h-[40%]' },
                      { month: 'May', value: 45, height: 'h-[60%]' },
                      { month: 'Jun', value: 60, height: 'h-[75%]' },
                      { month: 'Jul', value: 80, height: 'h-[95%]', isMax: true }
                    ].map((bar) => (
                      <div key={bar.month} className="flex flex-col items-center justify-end h-full">
                        <span className="text-[10px] font-bold text-[#16241f] mb-1">
                          {demoStep >= 1 ? bar.value : ''}
                        </span>
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${bar.height} ${
                            demoStep >= 1
                              ? bar.isMax
                                ? 'bg-[#9c6f1f] shadow-md ring-2 ring-[#9c6f1f]/30'
                                : 'bg-[#16241f]'
                              : 'bg-[#16241f]/20'
                          }`}
                        />
                        <span className="text-[10px] font-bold text-[#16241f] mt-1">{bar.month}</span>
                      </div>
                    ))}
                  </div>

                  {demoStep === 2 && (
                    <div className="mt-3 p-2.5 bg-[#16241f]/10 border border-[#16241f]/30 rounded-xl text-xs font-bold text-[#16241f] animate-fade-in">
                      🏆 July is easily spotted as the highest month with 80 cyclists!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🚲 Step 1: Build Rectangular Bars'
                    : demoStep === 1
                    ? '🏆 Step 2: Spot Highest Month (July)'
                    : '🔄 Reset Bar Chart Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'sunny_dots' ? (
                <>
                  {demoStep === 0 && 'Looking at sunny days across 6 months on a dot plot. Click Add Monthly Dots to see the trend build up!'}
                  {demoStep === 1 && 'Dots are marked on a scale for each month! Notice how the number of sunny days rises steadily.'}
                  {demoStep === 2 && 'A dot plot lets you easily spot that sunnier days increase as summer approaches! Dots help you see the shape of the trend.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Comparing how many people cycle to work each month using a bar chart. Click Build Rectangular Bars!'}
                  {demoStep === 1 && 'Solid rectangular bars show exact totals for each month! Notice May has 45 cyclists, June has 60, and July has 80.'}
                  {demoStep === 2 && 'A bar chart lets you easily see that July had the highest number of cyclists! Bars are great for comparing exact totals.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Bar Charts and Dot Plots</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Bars are great for comparing exact totals, while dots help you see the shape of the trend.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('sunny_dots');
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

export default BarDotChartPlayer;
