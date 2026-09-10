import React, { useState, useEffect, useCallback } from 'react';

export interface MentalAdditionStrategiesPlayerProps {
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
    questionText: 'When calculating 1972 + 28 mentally, how can bridging through a friendly benchmark number help?',
    options: [
      'Add 28 directly to 1972 to make a neat 2000 before adding other quantities',
      'Round 1972 down to 1000 and ignore 28',
      'Subtract 28 from 1972 to get 1944'
    ],
    correctIndex: 0,
    hint: 'Adding 28 directly to 1972 bridges through the friendly benchmark number 2000, making calculations much simpler.'
  },
  {
    id: 2,
    questionText: 'How do you solve 5 - 160 when subtracting a large number from a smaller positive number?',
    options: [
      'Start at 5, jump back 5 to reach zero, and jump back the remaining 155 to arrive at -155',
      'Subtract 5 from 160 to get positive 155',
      'Stop at zero because negative numbers are not allowed'
    ],
    correctIndex: 0,
    hint: 'Start at 5, count back 5 to reach zero, then count back the remaining 155 past zero into negative values to reach -155.'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember when making big addition or subtraction jumps?',
    options: [
      'Bridge through friendly benchmark numbers like zero, ten, or multiples of one hundred to make big jumps easier',
      'Always calculate one by one from right to left without rounding',
      'Never count past zero into negative numbers'
    ],
    correctIndex: 0,
    hint: 'Bridge through friendly benchmark numbers like zero, ten, or multiples of one hundred to make big jumps easier!'
  }
];

export const MentalAdditionStrategiesPlayer: React.FC<MentalAdditionStrategiesPlayerProps> = ({
  conceptName = 'Concept 9.1: Mental and Written Addition and Subtraction Strategies',
  unitTitle = 'Unit 9: Calculation (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'bridge_2000' | 'subtract_negative'>('bridge_2000');
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
        'Flexible techniques such as rounding to estimate, regrouping numbers, and using number lines help us solve large additions, subtractions, and calculations involving negative numbers efficiently. Rounding numbers before calculating provides a sensible estimate to check whether your final answer makes sense. Numbers can be rearranged or split into easier place value parts to make mental calculation much simpler. When subtracting a large number from a smaller positive number, count back past zero into negative values. Bridge through friendly benchmark numbers like zero, ten, or multiples of one hundred to make big jumps easier!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'bridge_2000') {
        const desc =
          demoStep === 0
            ? 'Calculating 1972 + 28 by bridging through a benchmark number. Click Bridge to 2000!'
            : demoStep === 1
            ? 'Add 28 directly to 1972 to reach the friendly benchmark number 2000!'
            : '1972 + 28 = 2000! Bridge through friendly benchmark numbers like zero, ten, or multiples of one hundred to make big jumps easier!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Calculating 5 - 160 by jumping back past zero on a number line. Click Jump to Zero!'
            : demoStep === 1
            ? 'Start at 5 and jump back 5 to reach the benchmark number 0!'
            : 'From zero, jump back the remaining 155 to arrive at -155! When subtracting a large number from a smaller positive number, count back past zero into negative values.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Mental and Written Addition and Subtraction Strategies! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'bridge_2000' | 'subtract_negative') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'bridge_2000') {
      safeNarrate('Calculating 1972 + 28 by bridging through a benchmark number. Click Bridge to 2000!');
    } else {
      safeNarrate('Calculating 5 - 160 by jumping back past zero on a number line. Click Jump to Zero!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'bridge_2000') {
      const desc =
        next === 0
          ? 'Calculating 1972 + 28 by bridging through a benchmark number. Click Bridge to 2000!'
          : next === 1
          ? 'Add 28 directly to 1972 to reach the friendly benchmark number 2000!'
          : '1972 + 28 = 2000! Bridge through friendly benchmark numbers like zero, ten, or multiples of one hundred to make big jumps easier!';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Calculating 5 - 160 by jumping back past zero on a number line. Click Jump to Zero!'
          : next === 1
          ? 'Start at 5 and jump back 5 to reach the benchmark number 0!'
          : 'From zero, jump back the remaining 155 to arrive at -155! When subtracting a large number from a smaller positive number, count back past zero into negative values.';
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
              Flexible techniques such as <strong>rounding to estimate</strong>, <strong>regrouping numbers</strong>, and <strong>using number lines</strong> help us solve large additions, subtractions, and calculations involving negative numbers efficiently. 
              Rounding numbers before calculating provides a sensible estimate to check whether your final answer makes sense. 
              Numbers can be rearranged or split into easier place value parts to make mental calculation much simpler. 
              When subtracting a large number from a smaller positive number, <strong>count back past zero into negative values</strong>.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Addition Example (1972 + 28)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  1972 + 28 ➔ Add 28 directly to reach friendly benchmark 2000
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Bridge through friendly benchmark numbers!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                🌉 2000
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Negative Subtraction Example (5 - 160)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  5 - 5 = 0 ➔ 0 - 155 = -155
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Jump back 5 to reach zero, then remaining 155 into negative values.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                📉 -155
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Strategy Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('bridge_2000')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'bridge_2000'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🌉 Benchmark Bridge (1972 + 28)
            </button>
            <button
              onClick={() => handleSelectDemoMode('subtract_negative')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'subtract_negative'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              📉 Past Zero Jump (5 - 160)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'bridge_2000' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Bridging 1972 + 28 to Benchmark 2000
                </h3>

                {/* Benchmark Jump Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="space-y-4 max-w-md mx-auto">
                    {/* Visual Number Line Bridge */}
                    <div className="relative pt-6 pb-2">
                      <div className="h-4 bg-white border-2 border-[#16241f] rounded-full relative overflow-hidden flex items-center">
                        <div
                          className={`h-full bg-[#9c6f1f] transition-all duration-500 rounded-full ${
                            demoStep >= 1 ? 'w-full' : 'w-1/4'
                          }`}
                        />
                      </div>

                      {/* Bridge Arc & Labels */}
                      <div className="flex justify-between items-center text-xs font-black text-[#16241f] mt-2">
                        <div className="p-2 bg-white border border-[#16241f]/20 rounded-xl">
                          Start: <span className="text-[#16241f]">1972</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className={`text-xs font-black text-[#9c6f1f] transition-all duration-300 ${demoStep >= 1 ? 'scale-110' : 'opacity-60'}`}>
                            +28 Jump ➔
                          </span>
                        </div>
                        <div className={`p-2 rounded-xl transition-all duration-300 ${demoStep >= 1 ? 'bg-[#9c6f1f] text-white shadow-md' : 'bg-white border'}`}>
                          Benchmark: <span className="font-black">2000</span>
                        </div>
                      </div>
                    </div>

                    {demoStep === 1 && (
                      <div className="p-2.5 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                        ✨ Add 28 directly to 1972 to make a neat 2000 before adding other quantities!
                      </div>
                    )}

                    {demoStep === 2 && (
                      <div className="p-2.5 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                        🎉 1972 + 28 = 2000! Bridge through friendly benchmark numbers to make big jumps easier!
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Bridge 1972 + 28 to 2000'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Confirm Friendly Benchmark Rule'
                    : '🔄 Reset Bridge Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Subtracting 5 - 160 (Counting Back Past Zero)
                </h3>

                {/* Number Line Visualizer for 5 - 160 */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="space-y-4 max-w-md mx-auto">
                    {/* Visual Jump Line */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                      {/* Step A: Start +5 */}
                      <div className={`p-2.5 rounded-xl border transition-all duration-300 ${demoStep === 0 ? 'bg-[#16241f] text-white' : 'bg-white text-[#16241f]'}`}>
                        <span className="text-[10px] block opacity-75">Start</span>
                        <span className="text-base font-black">+5</span>
                      </div>

                      {/* Step B: Reach Zero */}
                      <div className={`p-2.5 rounded-xl border transition-all duration-300 ${demoStep === 1 ? 'bg-[#9c6f1f] text-white shadow-md' : 'bg-white text-[#16241f]'}`}>
                        <span className="text-[10px] block opacity-75">Jump -5 ➔</span>
                        <span className="text-base font-black">0</span>
                      </div>

                      {/* Step C: Reach -155 */}
                      <div className={`p-2.5 rounded-xl border transition-all duration-300 ${demoStep === 2 ? 'bg-red-600 text-white shadow-md' : 'bg-white text-[#16241f]'}`}>
                        <span className="text-[10px] block opacity-75">Jump -155 ➔</span>
                        <span className="text-base font-black">-155</span>
                      </div>
                    </div>

                    {demoStep === 1 && (
                      <div className="p-2.5 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                        📉 Jump back 5 from +5 to reach the benchmark number 0!
                      </div>
                    )}

                    {demoStep === 2 && (
                      <div className="p-2.5 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                        ❄️ From zero, jump back the remaining 155 to arrive at -155!
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Jump Back 5 to Zero'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Jump Remaining 155 to -155'
                    : '🔄 Reset Subtraction Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'bridge_2000' ? (
                <>
                  {demoStep === 0 && 'Calculating 1972 + 28 by bridging through a benchmark number. Click Bridge to 2000!'}
                  {demoStep === 1 && 'Add 28 directly to 1972 to reach the friendly benchmark number 2000!'}
                  {demoStep === 2 && '1972 + 28 = 2000! Bridge through friendly benchmark numbers like zero, ten, or multiples of one hundred to make big jumps easier!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Calculating 5 - 160 by jumping back past zero on a number line. Click Jump to Zero!'}
                  {demoStep === 1 && 'Start at 5 and jump back 5 to reach the benchmark number 0!'}
                  {demoStep === 2 && 'From zero, jump back the remaining 155 to arrive at -155! When subtracting a large number from a smaller positive number, count back past zero into negative values.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Mental and Written Addition and Subtraction Strategies</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Bridge through friendly benchmark numbers like zero, ten, or multiples of one hundred to make big jumps easier!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('bridge_2000');
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

export default MentalAdditionStrategiesPlayer;
