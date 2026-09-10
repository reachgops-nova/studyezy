import React, { useState, useEffect, useCallback } from 'react';

export interface FrequencyChartPlayerProps {
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
    questionText: 'Why do the bars in a frequency chart touch each other without gaps?',
    options: [
      'Because the data is gathered into continuous measurement ranges where numbers flow smoothly from one interval to the next',
      'To save space on the paper',
      'Because all bars must always be the same color'
    ],
    correctIndex: 0,
    hint: 'No gaps between bars when the numbers flow smoothly from one measurement range into the next!'
  },
  {
    id: 2,
    questionText: 'When grouping learners by travel distance to school (like 1 to 2 km), what does "frequency" mean?',
    options: [
      'How fast the learners walk',
      'How many learners fall within that specific distance range',
      'The total distance of the entire school'
    ],
    correctIndex: 1,
    hint: 'Frequency tells us how many individuals or items fall within each specific range.'
  },
  {
    id: 3,
    questionText: 'Which of these is an example of grouped data measured in continuous intervals?',
    options: [
      'Counting how many apples in a harvest weigh between 100 and 150 grams',
      'Listing your favorite three colors',
      'Naming different dog breeds'
    ],
    correctIndex: 0,
    hint: 'Measuring apple weights (like 100 to 150 grams) groups continuous measurements into intervals.'
  }
];

export const FrequencyChartPlayer: React.FC<FrequencyChartPlayerProps> = ({
  conceptName = 'Concept 5.2: Frequency Charts and Grouped Data',
  unitTitle = 'Unit 5: Statistical Methods (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'distance_groups' | 'apple_weights'>('distance_groups');
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
        'A frequency chart displays data that has been gathered into measurement ranges or intervals. Unlike regular bar charts for separate categories, the bars touch each other without gaps because the measurements form a continuous range. Frequency tells us how many individuals or items fall within each specific range.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'distance_groups') {
        const desc =
          demoStep === 0
            ? 'Grouping learners by how far they travel to school: 0 to 1 km, 1 to 2 km, and 2 to 3 km. Click Build Touching Bars to see the frequency chart!'
            : demoStep === 1
            ? 'Notice how the bars touch with NO GAPS between them! 8 learners travel 0-1 km, 15 travel 1-2 km, and 10 travel 2-3 km.'
            : 'The bars touch continuously because distance flows smoothly from 1 km straight into 2 km! No gaps between bars when numbers flow smoothly.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Counting how many apples in a harvest weigh between 50-100g, 100-150g, and 150-200g. Click Build Weight Ranges!'
            : demoStep === 1
            ? '12 apples weigh 50-100g, 25 apples weigh 100-150g, and 18 apples weigh 150-200g. The bars touch with zero gaps!'
            : 'Weight is a continuous measurement, so the frequency bars touch seamlessly! No gaps between bars when numbers flow smoothly.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Frequency Charts and Grouped Data! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'distance_groups' | 'apple_weights') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'distance_groups') {
      safeNarrate('Grouping learners by how far they travel to school: 0 to 1 km, 1 to 2 km, and 2 to 3 km. Click Build Touching Bars to see the frequency chart!');
    } else {
      safeNarrate('Counting how many apples in a harvest weigh between 50-100g, 100-150g, and 150-200g. Click Build Weight Ranges!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'distance_groups') {
      const desc =
        next === 0
          ? 'Grouping learners by how far they travel to school: 0 to 1 km, 1 to 2 km, and 2 to 3 km. Click Build Touching Bars to see the frequency chart!'
          : next === 1
          ? 'Notice how the bars touch with NO GAPS between them! 8 learners travel 0-1 km, 15 travel 1-2 km, and 10 travel 2-3 km.'
          : 'The bars touch continuously because distance flows smoothly from 1 km straight into 2 km! No gaps between bars when numbers flow smoothly.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Counting how many apples in a harvest weigh between 50-100g, 100-150g, and 150-200g. Click Build Weight Ranges!'
          : next === 1
          ? '12 apples weigh 50-100g, 25 apples weigh 100-150g, and 18 apples weigh 150-200g. The bars touch with zero gaps!'
          : 'Weight is a continuous measurement, so the frequency bars touch seamlessly! No gaps between bars when numbers flow smoothly.';
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
              A <strong>frequency chart</strong> displays data that has been gathered into <strong>measurement ranges or intervals</strong>. 
              Unlike regular bar charts for separate categories, <strong>the bars touch each other without gaps</strong> because the measurements form a continuous range. 
              <strong> Frequency</strong> tells us how many individuals or items fall within each specific range.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Distance to School Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Grouping learners by travel distance (e.g. 1 to 2 km)
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Bars touch with no gaps because distance flows continuously.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                🏫 1 - 2 km
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Apple Harvest Weights Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Counting apples that weigh between 100 and 150 grams
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Continuous weight intervals grouped into frequency ranges.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🍎 100 - 150g
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Frequency Chart Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('distance_groups')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'distance_groups'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🏫 Distance to School (0-1km, 1-2km, 2-3km)
            </button>
            <button
              onClick={() => handleSelectDemoMode('apple_weights')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'apple_weights'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🍎 Apple Harvest Weights (50g-200g)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'distance_groups' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Frequency Chart: Travel Distance to School (Bars Touch - NO GAPS!)
                </h3>

                {/* Frequency Chart Visualizer (NO GAPS!) */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="flex items-end justify-center h-36 pt-4 pb-2 border-b-2 border-[#16241f]/20 px-4">
                    {[
                      { range: '0-1 km', freq: 8, height: 'h-[50%]' },
                      { range: '1-2 km', freq: 15, height: 'h-[90%]', highlight: true },
                      { range: '2-3 km', freq: 10, height: 'h-[65%]' }
                    ].map((bar, bIdx) => (
                      <div key={bar.range} className="flex-1 flex flex-col items-center justify-end h-full">
                        <span className="text-[10px] font-bold text-[#16241f] mb-1">
                          {demoStep >= 1 ? `Freq: ${bar.freq}` : ''}
                        </span>
                        {/* Continuous Touching Bar (gap-0) */}
                        <div
                          className={`w-full border-r border-white/40 transition-all duration-500 ${bar.height} ${
                            demoStep >= 1
                              ? bar.highlight
                                ? 'bg-[#9c6f1f] shadow-sm'
                                : 'bg-[#16241f]'
                              : 'bg-[#16241f]/20'
                          } ${bIdx === 0 ? 'rounded-tl-lg' : ''} ${bIdx === 2 ? 'rounded-tr-lg' : ''}`}
                        />
                        <span className="text-[10px] font-bold text-[#16241f] mt-1">{bar.range}</span>
                      </div>
                    ))}
                  </div>

                  {demoStep === 2 && (
                    <div className="mt-3 p-2.5 bg-[#9c6f1f]/10 border border-[#9c6f1f]/30 rounded-xl text-xs font-bold text-[#9c6f1f] animate-fade-in">
                      ✨ Notice how the bars touch seamlessly! Distance is continuous, so there are NO GAPS between bars.
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🏫 Step 1: Build Touching Bars (NO GAPS)'
                    : demoStep === 1
                    ? '✨ Step 2: Highlight 1-2 km Interval'
                    : '🔄 Reset Distance Frequency Chart'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Frequency Chart: Apple Harvest Weights (50g to 200g)
                </h3>

                {/* Frequency Chart Visualizer (NO GAPS!) */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="flex items-end justify-center h-36 pt-4 pb-2 border-b-2 border-[#16241f]/20 px-4">
                    {[
                      { range: '50-100g', freq: 12, height: 'h-[45%]' },
                      { range: '100-150g', freq: 25, height: 'h-[95%]', highlight: true },
                      { range: '150-200g', freq: 18, height: 'h-[70%]' }
                    ].map((bar, bIdx) => (
                      <div key={bar.range} className="flex-1 flex flex-col items-center justify-end h-full">
                        <span className="text-[10px] font-bold text-[#16241f] mb-1">
                          {demoStep >= 1 ? `Freq: ${bar.freq}` : ''}
                        </span>
                        {/* Continuous Touching Bar */}
                        <div
                          className={`w-full border-r border-white/40 transition-all duration-500 ${bar.height} ${
                            demoStep >= 1
                              ? bar.highlight
                                ? 'bg-[#16241f] shadow-sm'
                                : 'bg-[#9c6f1f]'
                              : 'bg-[#16241f]/20'
                          } ${bIdx === 0 ? 'rounded-tl-lg' : ''} ${bIdx === 2 ? 'rounded-tr-lg' : ''}`}
                        />
                        <span className="text-[10px] font-bold text-[#16241f] mt-1">{bar.range}</span>
                      </div>
                    ))}
                  </div>

                  {demoStep === 2 && (
                    <div className="mt-3 p-2.5 bg-[#16241f]/10 border border-[#16241f]/30 rounded-xl text-xs font-bold text-[#16241f] animate-fade-in">
                      🍎 Weight flows smoothly from 100g straight into 150g, so the bars touch with zero gaps!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🍎 Step 1: Build Weight Ranges (NO GAPS)'
                    : demoStep === 1
                    ? '✨ Step 2: Highlight 100-150g Range'
                    : '🔄 Reset Apple Harvest Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'distance_groups' ? (
                <>
                  {demoStep === 0 && 'Grouping learners by how far they travel to school: 0 to 1 km, 1 to 2 km, and 2 to 3 km. Click Build Touching Bars to see the frequency chart!'}
                  {demoStep === 1 && 'Notice how the bars touch with NO GAPS between them! 8 learners travel 0-1 km, 15 travel 1-2 km, and 10 travel 2-3 km.'}
                  {demoStep === 2 && 'The bars touch continuously because distance flows smoothly from 1 km straight into 2 km! No gaps between bars when numbers flow smoothly.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Counting how many apples in a harvest weigh between 50-100g, 100-150g, and 150-200g. Click Build Weight Ranges!'}
                  {demoStep === 1 && '12 apples weigh 50-100g, 25 apples weigh 100-150g, and 18 apples weigh 150-200g. The bars touch with zero gaps!'}
                  {demoStep === 2 && 'Weight is a continuous measurement, so the frequency bars touch seamlessly! No gaps between bars when numbers flow smoothly.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Frequency Charts and Grouped Data</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              No gaps between bars when the numbers flow smoothly from one range into the next!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('distance_groups');
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

export default FrequencyChartPlayer;
