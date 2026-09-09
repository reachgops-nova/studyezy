import React, { useState, useEffect, useCallback } from 'react';

export interface NegativeNumberLinePlayerProps {
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
    questionText: 'What sequence do you get when counting back in steps of 5 starting from 6?',
    options: [
      '6, 1, -4, -9',
      '6, 1, -5, -10',
      '6, 0, -5, -10'
    ],
    correctIndex: 0,
    hint: '6 minus 5 is 1. 1 minus 5 bridges past 0 to -4. -4 minus 5 reaches -9.'
  },
  {
    id: 2,
    questionText: 'If a temperature starts at -2 degrees and rises by 5 degrees, what temperature does it reach?',
    options: [
      '3 degrees',
      '-7 degrees',
      '5 degrees'
    ],
    correctIndex: 0,
    hint: 'Rising by 2 degrees reaches 0, and rising 3 more degrees crosses 0 to reach 3 degrees.'
  },
  {
    id: 3,
    questionText: 'Where do positive and negative numbers sit in relation to 0 on a number line?',
    options: [
      'Positive numbers sit to the left of 0; negative numbers sit to the right',
      'Positive numbers sit to the right of 0; negative numbers sit to the left',
      'Both positive and negative numbers sit to the right of 0'
    ],
    correctIndex: 1,
    hint: 'Positive numbers sit to the right of 0; negative numbers sit to the left.'
  }
];

export const NegativeNumberLinePlayer: React.FC<NegativeNumberLinePlayerProps> = ({
  conceptName = 'Concept 1.4: Counting Across Zero with Negative Numbers',
  unitTitle = 'Unit 1: Number (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'count_back' | 'temp_rise'>('count_back');
  const [countStep, setCountStep] = useState<number>(0); // 0 -> 6, 1 -> 1, 2 -> -4, 3 -> -9
  const [tempStep, setTempStep] = useState<number>(0);   // 0 -> -2, 1 -> 3
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

  // Trigger narrations on phase or step changes
  useEffect(() => {
    if (phase === 'visual_intro') {
      safeNarrate(
        'Negative numbers sit to the left of 0 on the number line. Counting backwards can bridge through 0 into negative numbers, and counting forwards from a negative number can bridge back through 0 into positive numbers. A count that bridges through 0 still moves in equal steps the whole way.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'count_back') {
        const vals = [6, 1, -4, -9];
        safeNarrate(
          `Counting back in steps of 5 from 6 gives ${vals[countStep]}. Notice how the steps of 5 remain equal when crossing 0!`
        );
      } else {
        const val = tempStep === 0 ? '-2 degrees' : '3 degrees';
        safeNarrate(
          `A temperature starting at -2 degrees that rises by 5 degrees crosses 0 and reaches ${val}.`
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Counting Across Zero with Negative Numbers! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, countStep, tempStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'count_back' | 'temp_rise') => {
    setDemoMode(mode);
    if (mode === 'count_back') {
      setCountStep(0);
      safeNarrate(
        'Counting back in steps of 5 from 6 gives 6. Notice how the steps of 5 remain equal when crossing 0!'
      );
    } else {
      setTempStep(0);
      safeNarrate(
        'A temperature starting at -2 degrees that rises by 5 degrees crosses 0 and reaches -2 degrees.'
      );
    }
  };

  const handleStepCountBack = () => {
    const nextStep = (countStep + 1) % 4;
    setCountStep(nextStep);
    const vals = [6, 1, -4, -9];
    safeNarrate(
      `Counting back in steps of 5 from 6 gives ${vals[nextStep]}. Notice how the steps of 5 remain equal when crossing 0!`
    );
  };

  const handleToggleTemp = () => {
    const nextStep = tempStep === 0 ? 1 : 0;
    setTempStep(nextStep);
    const val = nextStep === 0 ? '-2 degrees' : '3 degrees';
    safeNarrate(
      `A temperature starting at -2 degrees that rises by 5 degrees crosses 0 and reaches ${val}.`
    );
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

  const countBackValues = [6, 1, -4, -9];

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
              Negative numbers sit to the left of 0 on the number line. Counting backwards can bridge through 0 into negative numbers, and counting forwards from a negative number can bridge back through 0 into positive numbers. 
              <strong> A count that bridges through 0 still moves in equal steps the whole way.</strong>
            </p>
          </div>

          {/* Real Source Examples Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Counting Back Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Steps of 5 from 6: 6 ➔ 1 ➔ -4 ➔ -9
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Crossing 0 maintains equal steps of 5 each time.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                ⬅️ -5 Steps
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Thermometer Bridge Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  -2°C + 5°C = 3°C
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Starting at -2°C, rising 2°C reaches 0, and 3°C more reaches 3°C.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🌡️ +5° Rise
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Number Line Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('count_back')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'count_back'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ⬅️ Count Back in 5s
            </button>
            <button
              onClick={() => handleSelectDemoMode('temp_rise')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'temp_rise'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🌡️ Thermometer (-2° + 5°)
            </button>
          </div>

          {/* Visual Interactive Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'count_back' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-2">
                  Counting Back in Steps of 5 from 6
                </h3>

                {/* Number Line Visual */}
                <div className="relative py-8 my-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 px-4 overflow-x-auto">
                  <div className="flex justify-between items-center min-w-[320px] relative">
                    {/* Horizontal Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#16241f]/30 -translate-y-1/2" />

                    {[-10, -9, -4, 0, 1, 6, 10].map((num) => {
                      const isCurrent = countBackValues[countStep] === num;
                      const isZero = num === 0;

                      return (
                        <div key={num} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                              isCurrent
                                ? 'bg-[#9c6f1f] text-white scale-125 shadow-md ring-4 ring-[#9c6f1f]/20'
                                : isZero
                                ? 'bg-[#16241f] text-white'
                                : 'bg-white text-[#16241f] border border-[#16241f]/30'
                            }`}
                          >
                            {num}
                          </div>
                          <span className="text-[10px] font-bold text-[#16241f]/60 mt-1">
                            {isZero ? 'ZERO' : num < 0 ? 'NEG' : 'POS'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-[#9c6f1f]/10 rounded-xl border border-[#9c6f1f]/30 mb-3">
                  <p className="text-sm font-bold text-[#16241f]">
                    Current Value: <span className="text-lg text-[#9c6f1f]">{countBackValues[countStep]}</span>
                  </p>
                </div>

                <button
                  onClick={handleStepCountBack}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  ⏮️ Take Step of -5 (Step {countStep + 1} of 4)
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-2">
                  Thermometer Bridge: Temperature Rising 5°C
                </h3>

                {/* Vertical Thermometer Bar Visual */}
                <div className="flex justify-center items-center gap-6 my-4">
                  <div className="w-12 h-44 bg-[#f4f6f1] rounded-full border-2 border-[#16241f]/30 relative p-1 flex flex-col justify-between items-center">
                    <span className="text-[10px] font-bold text-[#16241f]">+5°C</span>
                    <span className="text-[10px] font-bold text-[#9c6f1f]">0°C (ZERO)</span>
                    <span className="text-[10px] font-bold text-[#16241f]">-5°C</span>

                    <div
                      className="w-8 rounded-full bg-[#9c6f1f] transition-all duration-500 absolute bottom-1"
                      style={{ height: tempStep === 0 ? '25%' : '75%' }}
                    />
                  </div>

                  <div className="text-left space-y-2">
                    <div className="p-2.5 bg-white rounded-lg border border-[#16241f]/10">
                      <span className="text-[10px] font-bold text-[#16241f]/50 uppercase block">Start</span>
                      <span className="text-base font-bold text-[#16241f]">-2°C (Below 0)</span>
                    </div>
                    <div className="p-2.5 bg-[#9c6f1f]/10 rounded-lg border border-[#9c6f1f]/30">
                      <span className="text-[10px] font-bold text-[#9c6f1f] uppercase block">After +5° Rise</span>
                      <span className="text-base font-bold text-[#9c6f1f]">
                        {tempStep === 0 ? '-2°C (Click Rise)' : '3°C (Crossed 0!)'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleToggleTemp}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {tempStep === 0 ? '🌡️ Rise Temperature by 5°C' : '🔄 Reset to -2°C'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'count_back' ? (
                <>
                  Counting back in steps of 5 from 6 gives <strong>{countBackValues[countStep]}</strong>. Notice how the steps of 5 remain equal when crossing 0!
                </>
              ) : (
                <>
                  A temperature starting at -2 degrees that rises by 5 degrees crosses 0 and reaches <strong>{tempStep === 0 ? '-2 degrees' : '3 degrees'}</strong>.
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Counting Across Zero with Negative Numbers</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Think of a thermometer: 0 is the line between positive and negative.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setCountStep(0);
                setTempStep(0);
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

export default NegativeNumberLinePlayer;
