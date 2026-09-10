import React, { useState, useEffect, useCallback } from 'react';

export interface LikelihoodScalePlayerProps {
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
    questionText: 'If a bag is filled with only blue blocks, what is the likelihood of picking a red block?',
    options: [
      'Impossible (it cannot happen at all because there are no red blocks)',
      'Likely',
      'Certain'
    ],
    correctIndex: 0,
    hint: 'An event is impossible if it cannot happen at all, like drawing a red block when only blue blocks are in the bag.'
  },
  {
    id: 2,
    questionText: 'In a bag containing 8 green marbles and 2 yellow marbles, what is the likelihood of drawing a green marble versus a yellow marble?',
    options: [
      'Green is likely, and yellow is unlikely',
      'Both are equally likely',
      'Yellow is certain, and green is impossible'
    ],
    correctIndex: 0,
    hint: '8 out of 10 marbles are green so green is likely, while only 2 out of 10 are yellow so yellow is unlikely.'
  },
  {
    id: 3,
    questionText: 'What sits right in the middle of the probability scale ladder of chance?',
    options: [
      'Equally likely (each outcome has the exact same chance, like flipping heads or tails on a coin)',
      'Certain',
      'Impossible'
    ],
    correctIndex: 0,
    hint: 'Picture a ladder of chance: impossible is at the very bottom, equally likely sits right in the middle, and certain is at the very top.'
  }
];

export const LikelihoodScalePlayer: React.FC<LikelihoodScalePlayerProps> = ({
  conceptName = 'Concept 8.1: Likelihood and the Probability Scale',
  unitTitle = 'Unit 8: Probability (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'blue_blocks' | 'marbles_bag'>('blue_blocks');
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
        'Likelihood describes how probable it is that an event will happen using standard mathematical words. These chances can be arranged on a scale from impossible all the way to certain. The probability word scale goes from impossible, to unlikely, to equally likely, to likely, and finally to certain. Picture a ladder of chance: impossible is at the very bottom, equally likely sits right in the middle, and certain is at the very top.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'blue_blocks') {
        const desc =
          demoStep === 0
            ? 'A bag filled with only blue blocks. What is the chance of picking a red block? Click Inspect Bag!'
            : demoStep === 1
            ? 'There are only blue blocks inside the bag and zero red blocks!'
            : 'Picking a red block out of a bag filled with only blue blocks is impossible! An event is impossible if it cannot happen at all.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'A bag with 8 green marbles and 2 yellow marbles. Click Draw Marbles!'
            : demoStep === 1
            ? '8 out of 10 marbles are green, while only 2 out of 10 are yellow!'
            : 'In a bag with 8 green marbles and 2 yellow marbles, picking a green marble is likely, while picking a yellow marble is unlikely!';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Likelihood and the Probability Scale! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'blue_blocks' | 'marbles_bag') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'blue_blocks') {
      safeNarrate('A bag filled with only blue blocks. What is the chance of picking a red block? Click Inspect Bag!');
    } else {
      safeNarrate('A bag with 8 green marbles and 2 yellow marbles. Click Draw Marbles!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'blue_blocks') {
      const desc =
        next === 0
          ? 'A bag filled with only blue blocks. What is the chance of picking a red block? Click Inspect Bag!'
          : next === 1
          ? 'There are only blue blocks inside the bag and zero red blocks!'
          : 'Picking a red block out of a bag filled with only blue blocks is impossible! An event is impossible if it cannot happen at all.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'A bag with 8 green marbles and 2 yellow marbles. Click Draw Marbles!'
          : next === 1
          ? '8 out of 10 marbles are green, while only 2 out of 10 are yellow!'
          : 'In a bag with 8 green marbles and 2 yellow marbles, picking a green marble is likely, while picking a yellow marble is unlikely!';
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
              Core Definition & Probability Scale
            </h3>
            <p className="text-sm leading-relaxed text-[#16241f]">
              <strong>Likelihood</strong> describes how probable it is that an event will happen using standard mathematical words. 
              These chances are arranged on a scale: <strong>Impossible ➔ Unlikely ➔ Equally Likely ➔ Likely ➔ Certain</strong>. 
              An event is <strong>impossible</strong> if it cannot happen at all, and <strong>certain</strong> if it is guaranteed to happen.
            </p>
          </div>

          {/* Probability Ladder Visualizer */}
          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block mb-3">
              The Ladder of Chance
            </span>
            <div className="grid grid-cols-5 gap-1.5 max-w-md mx-auto text-[11px] font-bold">
              <div className="p-2 bg-red-500/10 text-red-700 border border-red-500/30 rounded-lg">
                ❌ Impossible
              </div>
              <div className="p-2 bg-orange-500/10 text-orange-700 border border-orange-500/30 rounded-lg">
                📉 Unlikely
              </div>
              <div className="p-2 bg-[#9c6f1f]/10 text-[#9c6f1f] border border-[#9c6f1f]/30 rounded-lg">
                ⚖️ Equally Likely
              </div>
              <div className="p-2 bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 rounded-lg">
                📈 Likely
              </div>
              <div className="p-2 bg-[#16241f] text-white rounded-lg shadow-sm">
                ✅ Certain
              </div>
            </div>
            <p className="text-xs text-[#16241f]/70 mt-3">
              Impossible is at the bottom, equally likely sits in the middle, and certain is at the top!
            </p>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Probability Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('blue_blocks')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'blue_blocks'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🟦 Blue Blocks Bag (Impossible)
            </button>
            <button
              onClick={() => handleSelectDemoMode('marbles_bag')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'marbles_bag'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🟢 8 Green & 2 Yellow Marbles
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'blue_blocks' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Bag Filled with Only Blue Blocks
                </h3>

                {/* Blue Blocks Bag Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="flex justify-center items-center gap-3 my-2">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 bg-blue-600 rounded-lg shadow-sm border border-blue-800 flex items-center justify-center text-white text-xs font-bold"
                      >
                        🟦
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 p-3 bg-white border border-[#16241f]/10 rounded-xl text-center">
                    <span className="text-xs font-bold text-[#16241f] block">
                      Target: Picking a Red Block 🟥
                    </span>
                    <span className="text-sm font-black text-red-600 block mt-1">
                      {demoStep >= 1 ? '0 Red Blocks in Bag ➔ IMPOSSIBLE (0% Chance)' : 'Bag Contents: Only Blue Blocks'}
                    </span>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-2 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ❌ There are only blue blocks inside the bag and zero red blocks!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-2 p-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🚫 Picking a red block out of a bag filled with only blue blocks is impossible!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Inspect Bag Contents'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Show Probability Word (Impossible)'
                    : '🔄 Reset Blue Blocks Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Bag with 8 Green Marbles & 2 Yellow Marbles
                </h3>

                {/* Marbles Bag Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="flex flex-wrap justify-center items-center gap-2 max-w-xs mx-auto my-2">
                    {/* 8 Green Marbles */}
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div
                        key={`g-${idx}`}
                        className="w-8 h-8 bg-emerald-500 rounded-full shadow-sm flex items-center justify-center text-white text-xs font-bold border border-emerald-700"
                      >
                        🟢
                      </div>
                    ))}
                    {/* 2 Yellow Marbles */}
                    {Array.from({ length: 2 }).map((_, idx) => (
                      <div
                        key={`y-${idx}`}
                        className="w-8 h-8 bg-yellow-400 rounded-full shadow-sm flex items-center justify-center text-xs font-bold border border-yellow-600"
                      >
                        🟡
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-800">
                      🟢 Green (8/10): <span className="text-emerald-700 font-black">LIKELY</span>
                    </div>
                    <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-xs font-bold text-yellow-800">
                      🟡 Yellow (2/10): <span className="text-yellow-700 font-black">UNLIKELY</span>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-2 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      📊 8 out of 10 marbles are green, while only 2 out of 10 are yellow!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-2 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 Picking a green marble is likely, while picking a yellow marble is unlikely!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Count Green vs Yellow Marbles'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Show Likelihood Words'
                    : '🔄 Reset Marbles Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'blue_blocks' ? (
                <>
                  {demoStep === 0 && 'A bag filled with only blue blocks. What is the chance of picking a red block? Click Inspect Bag!'}
                  {demoStep === 1 && 'There are only blue blocks inside the bag and zero red blocks!'}
                  {demoStep === 2 && 'Picking a red block out of a bag filled with only blue blocks is impossible! An event is impossible if it cannot happen at all.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'A bag with 8 green marbles and 2 yellow marbles. Click Draw Marbles!'}
                  {demoStep === 1 && '8 out of 10 marbles are green, while only 2 out of 10 are yellow!'}
                  {demoStep === 2 && 'In a bag with 8 green marbles and 2 yellow marbles, picking a green marble is likely, while picking a yellow marble is unlikely!'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Likelihood and the Probability Scale</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Picture a ladder of chance: impossible is at the very bottom, equally likely sits right in the middle, and certain is at the very top.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('blue_blocks');
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

export default LikelihoodScalePlayer;
