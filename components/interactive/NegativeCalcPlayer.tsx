import React, { useState, useEffect, useCallback } from 'react';

export interface NegativeCalcPlayerProps {
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
    questionText: 'When calculating -4 + 9 using 0 as a bridge, what are the two jump steps?',
    options: [
      'Jump 4 steps right to reach 0, then 5 more steps right to land on 5',
      'Jump 9 steps left to land on -13',
      'Jump 4 steps left to reach -8, then 5 steps right to land on -3'
    ],
    correctIndex: 0,
    hint: 'Starting at -4, jump 4 steps right to reach 0, then 5 more steps right (since 4 + 5 = 9) to land on 5.'
  },
  {
    id: 2,
    questionText: 'When calculating 5 - 9 using 0 as a bridge, what are the two jump steps?',
    options: [
      'Jump 5 steps right to reach 10, then 4 steps left to land on 6',
      'Jump 5 steps left to 0, then 4 more steps left to reach -4',
      'Jump 9 steps right to reach 14'
    ],
    correctIndex: 1,
    hint: 'Starting at 5, jump 5 steps left to reach 0, then 4 more steps left (since 5 + 4 = 9) to reach -4.'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember when calculating across 0 on a number line?',
    options: [
      'Always multiply the numbers before jumping',
      'Always ignore negative signs and add the numbers together',
      'Always aim for 0 first when crossing the line, then see how much more you have left to jump'
    ],
    correctIndex: 2,
    hint: 'Always aim for 0 first when crossing the line, then see how much more you have left to jump.'
  }
];

export const NegativeCalcPlayer: React.FC<NegativeCalcPlayerProps> = ({
  conceptName = 'Concept 3.1: Calculating with Positive and Negative Numbers',
  unitTitle = 'Unit 3: Calculation (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'add_nine' | 'sub_nine'>('add_nine');
  const [bridgeStep, setBridgeStep] = useState<number>(0); // 0: start, 1: reach 0, 2: final answer
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
        'When adding or subtracting numbers that go below 0, we use a number line to bridge through 0 and find the new value. 0 acts as a bridge when moving between positive and negative numbers. Adding a positive number moves you to the right towards warmer temperatures or higher values, while subtracting moves you to the left, which can take you past 0 into negative territory.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'add_nine') {
        const desc =
          bridgeStep === 0
            ? 'Starting at -4 and adding 9. Click Step 1 to jump 4 steps right to reach 0!'
            : bridgeStep === 1
            ? 'Jumped 4 steps right to reach 0! Now click Step 2 to jump 5 more steps right.'
            : 'Jumped 5 more steps right to land on 5! -4 + 9 = 5.';
        safeNarrate(desc);
      } else {
        const desc =
          bridgeStep === 0
            ? 'Starting at 5 and subtracting 9. Click Step 1 to jump 5 steps left to 0!'
            : bridgeStep === 1
            ? 'Jumped 5 steps left to reach 0! Now click Step 2 to jump 4 more steps left.'
            : 'Jumped 4 more steps left to reach -4! 5 - 9 = -4.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Calculating with Positive and Negative Numbers! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, bridgeStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'add_nine' | 'sub_nine') => {
    setDemoMode(mode);
    setBridgeStep(0);
    if (mode === 'add_nine') {
      safeNarrate('Starting at -4 and adding 9. Click Step 1 to jump 4 steps right to reach 0!');
    } else {
      safeNarrate('Starting at 5 and subtracting 9. Click Step 1 to jump 5 steps left to 0!');
    }
  };

  const handleNextBridgeStep = () => {
    const next = (bridgeStep + 1) % 3;
    setBridgeStep(next);
    if (demoMode === 'add_nine') {
      const desc =
        next === 0
          ? 'Starting at -4 and adding 9. Click Step 1 to jump 4 steps right to reach 0!'
          : next === 1
          ? 'Jumped 4 steps right to reach 0! Now click Step 2 to jump 5 more steps right.'
          : 'Jumped 5 more steps right to land on 5! -4 + 9 = 5.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Starting at 5 and subtracting 9. Click Step 1 to jump 5 steps left to 0!'
          : next === 1
          ? 'Jumped 5 steps left to reach 0! Now click Step 2 to jump 4 more steps left.'
          : 'Jumped 4 more steps left to reach -4! 5 - 9 = -4.';
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
              When adding or subtracting numbers that go below 0, we use a number line to <strong>bridge through 0</strong> and find the new value. 
              <strong> 0 acts as a bridge</strong> when moving between positive and negative numbers. 
              <strong> Adding a positive number</strong> moves you to the right towards warmer temperatures or higher values, while <strong>subtracting</strong> moves you to the left, which can take you past 0 into negative territory.
            </p>
          </div>

          {/* Real Source Examples Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Addition Example (-4 + 9)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  -4 ➔ Jump 4 steps right to 0 ➔ Jump 5 more steps right to 5
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  0 acts as the bridge midpoint (-4 + 4 + 5 = 5).
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                ➡️ -4 + 9 = 5
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Subtraction Example (5 - 9)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  5 ➔ Jump 5 steps left to 0 ➔ Jump 4 more steps left to -4
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Crossing 0 into negative territory (5 - 5 - 4 = -4).
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                ⬅️ 5 - 9 = -4
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Number Line Bridge Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('add_nine')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'add_nine'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ➡️ Add (-4 + 9 = 5)
            </button>
            <button
              onClick={() => handleSelectDemoMode('sub_nine')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'sub_nine'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ⬅️ Subtract (5 - 9 = -4)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-2">
              {demoMode === 'add_nine' ? 'Adding across 0: -4 + 9' : 'Subtracting across 0: 5 - 9'}
            </h3>

            {/* Number Line Visualizer */}
            <div className="relative py-8 my-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 px-4 overflow-x-auto">
              <div className="flex justify-between items-center min-w-[340px] relative">
                {/* Baseline */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#16241f]/30 -translate-y-1/2" />

                {demoMode === 'add_nine' ? (
                  <>
                    {/* -4 to +5 scale */}
                    {[-4, -2, 0, 2, 5].map((val) => {
                      let active = false;
                      if (bridgeStep === 0 && val === -4) active = true;
                      if (bridgeStep === 1 && val === 0) active = true;
                      if (bridgeStep === 2 && val === 5) active = true;

                      const isZero = val === 0;

                      return (
                        <div key={val} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                              active
                                ? 'bg-[#9c6f1f] text-white scale-125 shadow-md ring-4 ring-[#9c6f1f]/20'
                                : isZero
                                ? 'bg-[#16241f] text-white'
                                : 'bg-white text-[#16241f] border border-[#16241f]/30'
                            }`}
                          >
                            {val}
                          </div>
                          <span className="text-[10px] font-bold text-[#16241f]/60 mt-1">
                            {isZero ? 'BRIDGE' : val < 0 ? 'START' : 'END'}
                          </span>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {/* +5 to -4 scale */}
                    {[-4, -2, 0, 2, 5].map((val) => {
                      let active = false;
                      if (bridgeStep === 0 && val === 5) active = true;
                      if (bridgeStep === 1 && val === 0) active = true;
                      if (bridgeStep === 2 && val === -4) active = true;

                      const isZero = val === 0;

                      return (
                        <div key={val} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                              active
                                ? 'bg-[#16241f] text-white scale-125 shadow-md ring-4 ring-[#16241f]/20'
                                : isZero
                                ? 'bg-[#9c6f1f] text-white'
                                : 'bg-white text-[#16241f] border border-[#16241f]/30'
                            }`}
                          >
                            {val}
                          </div>
                          <span className="text-[10px] font-bold text-[#16241f]/60 mt-1">
                            {isZero ? 'BRIDGE' : val > 0 ? 'START' : 'END'}
                          </span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Step Progress Tracker */}
            <div className="grid grid-cols-2 gap-3 my-3">
              <div
                className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                  bridgeStep >= 1
                    ? 'bg-[#9c6f1f]/10 border-[#9c6f1f]'
                    : 'bg-[#16241f]/5 border-[#16241f]/10 opacity-50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase block text-[#9c6f1f]">Jump 1 (Aim for 0)</span>
                <span className="text-sm font-bold text-[#16241f]">
                  {demoMode === 'add_nine' ? 'Jump +4 to reach 0' : 'Jump -5 to reach 0'}
                </span>
              </div>

              <div
                className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                  bridgeStep === 2
                    ? 'bg-[#16241f]/10 border-[#16241f]'
                    : 'bg-[#16241f]/5 border-[#16241f]/10 opacity-50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase block text-[#16241f]/60">
                  Jump 2 (Remaining Part)
                </span>
                <span className="text-sm font-bold text-[#16241f]">
                  {demoMode === 'add_nine' ? 'Jump +5 to reach 5' : 'Jump -4 to reach -4'}
                </span>
              </div>
            </div>

            <button
              onClick={handleNextBridgeStep}
              className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
            >
              {bridgeStep === 0
                ? '🌉 Take Jump 1: Aim for 0'
                : bridgeStep === 1
                ? '🚀 Take Jump 2: Finish Total Jump'
                : '🔄 Reset Bridge Demo'}
            </button>
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'add_nine' ? (
                <>
                  {bridgeStep === 0 && 'Starting at -4 and adding 9. Click Step 1 to jump 4 steps right to reach 0!'}
                  {bridgeStep === 1 && 'Jumped 4 steps right to reach 0! Now click Step 2 to jump 5 more steps right.'}
                  {bridgeStep === 2 && 'Jumped 5 more steps right to land on 5! -4 + 9 = 5.'}
                </>
              ) : (
                <>
                  {bridgeStep === 0 && 'Starting at 5 and subtracting 9. Click Step 1 to jump 5 steps left to 0!'}
                  {bridgeStep === 1 && 'Jumped 5 steps left to reach 0! Now click Step 2 to jump 4 more steps left.'}
                  {bridgeStep === 2 && 'Jumped 4 more steps left to reach -4! 5 - 9 = -4.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Calculating with Positive and Negative Numbers</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Always aim for 0 first when crossing the line, then see how much more you have left to jump.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('add_nine');
                setBridgeStep(0);
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

export default NegativeCalcPlayer;
