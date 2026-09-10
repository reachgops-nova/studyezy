import React, { useState, useEffect, useCallback } from 'react';

export interface ProbabilityExperimentPlayerProps {
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
    questionText: 'If a spinner has 6 equal slices and you spin it 30 times, how many times is each number mathematically predicted to land?',
    options: [
      '5 times (30 ÷ 6 = 5 predicted lands per number)',
      '30 times each',
      '1 time each'
    ],
    correctIndex: 0,
    hint: 'With 6 equal slices and 30 total spins, 30 ÷ 6 = 5 predicted lands per number.'
  },
  {
    id: 2,
    questionText: 'If you spin a 6 three times in a row, what is the chance of landing on 6 on the very next spin?',
    options: [
      'Still 1 in 6 (spinners have no memory; each spin is independent)',
      '0 in 6 (it cannot land on 6 again)',
      '6 in 6 (it is guaranteed to land on 6)'
    ],
    correctIndex: 0,
    hint: 'Spinners and coins have no memory; each new spin or flip starts completely fresh with the exact same chances.'
  },
  {
    id: 3,
    questionText: 'Why is carrying out a large number of trials (like 50 spins) better than doing only 2 trials?',
    options: [
      'Carrying out a large number of trials gives more reliable results than only testing something a few times',
      'Because testing 2 times changes the rules of chance',
      'Because small trials always match mathematical predictions exactly'
    ],
    correctIndex: 0,
    hint: 'Carrying out a large number of trials gives more reliable results than only testing something a few times.'
  }
];

export const ProbabilityExperimentPlayer: React.FC<ProbabilityExperimentPlayerProps> = ({
  conceptName = 'Concept 8.2: Probability Experiments and Predicting Outcomes',
  unitTitle = 'Unit 8: Probability (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'spinner_30' | 'counter_bag'>('spinner_30');
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
        'A probability experiment is an activity where you test chance by repeating an action multiple times and recording what happens. You can compare your actual results with your mathematical predictions to see how chance works in real life. Each individual turn is independent, and spinners or coins have no memory!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'spinner_30') {
        const desc =
          demoStep === 0
            ? 'Spinning a 6-slice equal spinner 30 times. Click Run 30 Spins!'
            : demoStep === 1
            ? 'After 30 spins, each number from 1 to 6 is predicted to land 5 times (30 ÷ 6 = 5). Look at the tally chart of actual spins!'
            : 'Spinners have no memory! Each new spin starts completely fresh with the exact same 1 in 6 chance.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Drawing a colored counter from a hidden bag and putting it back. Click Draw Counters!'
            : demoStep === 1
            ? 'After 20 draws and tallying: 15 Green counters and 5 Yellow counters drawn!'
            : 'Carrying out a large number of trials gives more reliable results than testing only a few times! We estimate 3/4 of the bag is green counters.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Probability Experiments and Predicting Outcomes! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'spinner_30' | 'counter_bag') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'spinner_30') {
      safeNarrate('Spinning a 6-slice equal spinner 30 times. Click Run 30 Spins!');
    } else {
      safeNarrate('Drawing a colored counter from a hidden bag and putting it back. Click Draw Counters!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'spinner_30') {
      const desc =
        next === 0
          ? 'Spinning a 6-slice equal spinner 30 times. Click Run 30 Spins!'
          : next === 1
          ? 'After 30 spins, each number from 1 to 6 is predicted to land 5 times (30 ÷ 6 = 5). Look at the tally chart of actual spins!'
          : 'Spinners have no memory! Each new spin starts completely fresh with the exact same 1 in 6 chance.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Drawing a colored counter from a hidden bag and putting it back. Click Draw Counters!'
          : next === 1
          ? 'After 20 draws and tallying: 15 Green counters and 5 Yellow counters drawn!'
          : 'Carrying out a large number of trials gives more reliable results than testing only a few times! We estimate 3/4 of the bag is green counters.';
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
              A <strong>probability experiment</strong> is an activity where you test chance by repeating an action multiple times and recording what happens. 
              You can compare your <strong>actual results</strong> with your <strong>mathematical predictions</strong> to see how chance works in real life. 
              Each individual turn is <strong>independent</strong>, and <strong>large numbers of trials</strong> give more reliable results.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  6-Slice Spinner Experiment (30 Spins)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Predicted: 30 ÷ 6 = 5 times per slice
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Recorded using a tally chart after 30 trials.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                🎡 30 Spins
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Hidden Counter Bag Experiment
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Draw, tally color, and return to estimate contents
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Spinners and coins have no memory; each spin starts fresh!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🛍️ Tally Draw
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Probability Experiment Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('spinner_30')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'spinner_30'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🎡 6-Slice Spinner (30 Spins)
            </button>
            <button
              onClick={() => handleSelectDemoMode('counter_bag')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'counter_bag'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🛍️ Counter Bag Experiment
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'spinner_30' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Spinning a 6-Slice Spinner 30 Times & Tallying
                </h3>

                {/* 6-Slice Spinner & Tally Chart Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto items-center">
                    {/* Visual Spinner Wheel */}
                    <div className="flex flex-col items-center">
                      <div className="w-28 h-28 rounded-full border-4 border-[#16241f] bg-white relative flex items-center justify-center overflow-hidden shadow-sm">
                        {/* 6 Equal Slice Lines */}
                        <div className="absolute inset-0 border-b-2 border-[#16241f]/30" />
                        <div className="absolute inset-0 rotate-[60deg] border-b-2 border-[#16241f]/30" />
                        <div className="absolute inset-0 rotate-[120deg] border-b-2 border-[#16241f]/30" />
                        
                        {/* Slice Numbers */}
                        <span className="absolute top-2 font-black text-xs text-[#16241f]">1</span>
                        <span className="absolute right-3 top-6 font-black text-xs text-[#9c6f1f]">2</span>
                        <span className="absolute right-3 bottom-6 font-black text-xs text-[#16241f]">3</span>
                        <span className="absolute bottom-2 font-black text-xs text-[#9c6f1f]">4</span>
                        <span className="absolute left-3 bottom-6 font-black text-xs text-[#16241f]">5</span>
                        <span className="absolute left-3 top-6 font-black text-xs text-[#9c6f1f]">6</span>

                        {/* Spinner Arrow Pointer */}
                        <div className="w-2 h-10 bg-[#16241f] rounded-full z-10 animate-pulse" />
                      </div>
                      <span className="text-[10px] font-bold text-[#16241f]/70 mt-2 block">
                        6 Equal Slices (1/6 Chance Each)
                      </span>
                    </div>

                    {/* Tally Chart */}
                    <div className="p-2 bg-white border border-[#16241f]/15 rounded-xl text-left text-xs font-bold space-y-1">
                      <div className="text-[10px] uppercase font-bold text-[#9c6f1f] border-b pb-1">
                        Tally Chart (30 Spins)
                      </div>
                      <div className="flex justify-between">
                        <span>Number 1:</span>
                        <span className="text-[#16241f] font-black">{demoStep >= 1 ? '卌 (5)' : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number 2:</span>
                        <span className="text-[#16241f] font-black">{demoStep >= 1 ? '卌 I (6)' : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number 3:</span>
                        <span className="text-[#16241f] font-black">{demoStep >= 1 ? 'IIII (4)' : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number 4:</span>
                        <span className="text-[#16241f] font-black">{demoStep >= 1 ? '卌 (5)' : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number 5:</span>
                        <span className="text-[#16241f] font-black">{demoStep >= 1 ? '卌 (5)' : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number 6:</span>
                        <span className="text-[#16241f] font-black">{demoStep >= 1 ? '卌 (5)' : '-'}</span>
                      </div>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      📊 Math Prediction: 30 ÷ 6 = 5 times per slice! Actual tallies land very close to 5.
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      💡 Spinners have no memory! Each spin starts completely fresh with the exact same chances.
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Run 30 Spins & Record Tally'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Compare Prediction vs Reality'
                    : '🔄 Reset Spinner Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Drawing Colored Counters & Estimating Bag Contents
                </h3>

                {/* Counter Bag Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto items-center">
                    {/* Bag Graphics */}
                    <div className="p-3 bg-white border border-[#16241f]/20 rounded-xl text-center">
                      <span className="text-3xl block my-1">🛍️</span>
                      <span className="text-xs font-black text-[#16241f]">Hidden Counter Bag</span>
                      <span className="text-[10px] text-[#16241f]/70 block mt-0.5">20 Draw-and-Return Trials</span>
                    </div>

                    {/* Results Tally Card */}
                    <div className="p-3 bg-white border border-[#16241f]/20 rounded-xl text-left text-xs font-bold space-y-1.5">
                      <div className="text-[10px] uppercase font-bold text-[#16241f] border-b pb-1">
                        Draw Results (20 Total)
                      </div>
                      <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-800 flex justify-between">
                        <span>🟢 Green:</span>
                        <span className="font-black">{demoStep >= 1 ? '卌 卌 卌 (15)' : '-'}</span>
                      </div>
                      <div className="p-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-800 flex justify-between">
                        <span>🟡 Yellow:</span>
                        <span className="font-black">{demoStep >= 1 ? '卌 (5)' : '-'}</span>
                      </div>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      📊 15 out of 20 draws were green (3/4), while 5 out of 20 were yellow (1/4)!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 More trials = more reliable results! We reliably estimate 3/4 of the bag is green counters.
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Execute 20 Counter Draws'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Estimate Bag Contents'
                    : '🔄 Reset Counter Bag Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'spinner_30' ? (
                <>
                  {demoStep === 0 && 'Spinning a 6-slice equal spinner 30 times. Click Run 30 Spins!'}
                  {demoStep === 1 && 'After 30 spins, each number from 1 to 6 is predicted to land 5 times (30 ÷ 6 = 5). Look at the tally chart of actual spins!'}
                  {demoStep === 2 && 'Spinners have no memory! Each new spin starts completely fresh with the exact same 1 in 6 chance.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Drawing a colored counter from a hidden bag and putting it back. Click Draw Counters!'}
                  {demoStep === 1 && 'After 20 draws and tallying: 15 Green counters and 5 Yellow counters drawn!'}
                  {demoStep === 2 && 'Carrying out a large number of trials gives more reliable results than testing only a few times! We estimate 3/4 of the bag is green counters.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Probability Experiments and Predicting Outcomes</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Remember that spinners and coins have no memory; each new spin or flip starts completely fresh with the exact same chances.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('spinner_30');
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

export default ProbabilityExperimentPlayer;
