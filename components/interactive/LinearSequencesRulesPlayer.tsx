import React, { useState, useEffect, useCallback } from 'react';

export interface LinearSequencesRulesPlayerProps {
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
    questionText: 'In the sequence 18, 22, 26, 30, what is the term-to-term rule?',
    options: [
      'Add 4 each time',
      'Add 2 each time',
      'Multiply by 2 each time'
    ],
    correctIndex: 0,
    hint: 'Check the difference between side-by-side terms: 22 - 18 = 4, 26 - 22 = 4, 30 - 26 = 4. The rule is to add 4 each time.'
  },
  {
    id: 2,
    questionText: 'If a sequence starts at 30 and drops to 18 across 3 equal steps, what is the rule and missing terms?',
    options: [
      'Subtract 4 each time, giving missing terms 26 and 22',
      'Subtract 2 each time, giving missing terms 28 and 24',
      'Add 4 each time, giving missing terms 34 and 38'
    ],
    correctIndex: 0,
    hint: 'The total drop from 30 to 18 is 12 across 3 equal steps (12 ÷ 3 = 4). Each jump is subtracting 4, giving 30, 26, 22, 18.'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember when checking whether a number pattern is a linear sequence?',
    options: [
      'Check the jump between any two side-by-side numbers: in a linear sequence, that jump never changes!',
      'The numbers must always multiply by 10',
      'The step size should double at every term'
    ],
    correctIndex: 0,
    hint: 'Check the jump between any two side-by-side numbers: in a linear sequence, that jump never changes!'
  }
];

export const LinearSequencesRulesPlayer: React.FC<LinearSequencesRulesPlayerProps> = ({
  conceptName = 'Concept 7.5: Linear Sequences and Rules',
  unitTitle = 'Unit 7: Number (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'increasing' | 'decreasing'>('increasing');
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
        'A linear sequence is a pattern of numbers where the step size between any term and the next term is always identical. The fixed change between one number and the next is called the term-to-term rule or constant difference. Linear sequences can increase by adding a fixed amount or decrease by subtracting a fixed amount. Check the jump between any two side-by-side numbers: in a linear sequence, that jump never changes!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'increasing') {
        const desc =
          demoStep === 0
            ? 'Analyzing the increasing sequence 18, 22, 26, 30. Click Check Jump Size!'
            : demoStep === 1
            ? 'The jump from 18 to 22 is +4, from 22 to 26 is +4, and from 26 to 30 is +4!'
            : 'In the sequence 18, 22, 26, 30, the rule is to add 4 each time! In a linear sequence, the jump size never changes.';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Finding missing gaps when a sequence starts at 30 and drops to 18 across 3 equal steps. Click Calculate Equal Steps!'
            : demoStep === 1
            ? 'The overall difference is 30 minus 18 equals 12. Dividing 12 by 3 steps gives a jump size of 4!'
            : 'Subtracting 4 each time gives the complete sequence: 30, 26, 22, 18! To find the step size when numbers have missing gaps, find the overall difference and divide by the number of steps.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Linear Sequences and Rules! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'increasing' | 'decreasing') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'increasing') {
      safeNarrate('Analyzing the increasing sequence 18, 22, 26, 30. Click Check Jump Size!');
    } else {
      safeNarrate('Finding missing gaps when a sequence starts at 30 and drops to 18 across 3 equal steps. Click Calculate Equal Steps!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'increasing') {
      const desc =
        next === 0
          ? 'Analyzing the increasing sequence 18, 22, 26, 30. Click Check Jump Size!'
          : next === 1
          ? 'The jump from 18 to 22 is +4, from 22 to 26 is +4, and from 26 to 30 is +4!'
          : 'In the sequence 18, 22, 26, 30, the rule is to add 4 each time! In a linear sequence, the jump size never changes.';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Finding missing gaps when a sequence starts at 30 and drops to 18 across 3 equal steps. Click Calculate Equal Steps!'
          : next === 1
          ? 'The overall difference is 30 minus 18 equals 12. Dividing 12 by 3 steps gives a jump size of 4!'
          : 'Subtracting 4 each time gives the complete sequence: 30, 26, 22, 18! To find the step size when numbers have missing gaps, find the overall difference and divide by the number of steps.';
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
              A <strong>linear sequence</strong> is a pattern of numbers where the <strong>step size</strong> between any term and the next term is <strong>always identical</strong>. 
              The fixed change between one number and the next is called the <strong>term-to-term rule</strong> or constant difference. 
              Linear sequences can increase by <strong>adding a fixed amount</strong> or decrease by <strong>subtracting a fixed amount</strong>.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Increasing Sequence Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  18, 22, 26, 30 ➔ Rule: Add 4 each time (+4)
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  The step size never changes across terms.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                📈 +4
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Decreasing Sequence with Missing Gaps
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  30 ➔ 18 across 3 steps = 12 ÷ 3 = -4 each step (30, 26, 22, 18)
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Overall difference divided by number of steps gives step size.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                📉 -4
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Linear Sequence Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('increasing')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'increasing'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              📈 Increasing (18, 22, 26, 30)
            </button>
            <button
              onClick={() => handleSelectDemoMode('decreasing')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'decreasing'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              📉 Missing Gaps (30 ➔ 18)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'increasing' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Sequence: 18, 22, 26, 30 (Term-to-Term Rule)
                </h3>

                {/* Sequence Cards with Jump Indicators */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                    {/* Term 1 */}
                    <div className="p-3 bg-white border-2 border-[#16241f] rounded-xl text-center min-w-[50px] shadow-sm">
                      <span className="text-[9px] font-bold text-[#16241f]/60 uppercase block">Term 1</span>
                      <span className="text-lg font-black text-[#16241f]">18</span>
                    </div>

                    {/* Jump 1 */}
                    <div className="flex flex-col items-center">
                      <span className={`text-[10px] font-black transition-all duration-300 ${demoStep >= 1 ? 'text-[#9c6f1f]' : 'opacity-0'}`}>
                        +4
                      </span>
                      <span className="text-xs text-[#9c6f1f]">➔</span>
                    </div>

                    {/* Term 2 */}
                    <div className="p-3 bg-white border-2 border-[#16241f] rounded-xl text-center min-w-[50px] shadow-sm">
                      <span className="text-[9px] font-bold text-[#16241f]/60 uppercase block">Term 2</span>
                      <span className="text-lg font-black text-[#16241f]">22</span>
                    </div>

                    {/* Jump 2 */}
                    <div className="flex flex-col items-center">
                      <span className={`text-[10px] font-black transition-all duration-300 ${demoStep >= 1 ? 'text-[#9c6f1f]' : 'opacity-0'}`}>
                        +4
                      </span>
                      <span className="text-xs text-[#9c6f1f]">➔</span>
                    </div>

                    {/* Term 3 */}
                    <div className="p-3 bg-white border-2 border-[#16241f] rounded-xl text-center min-w-[50px] shadow-sm">
                      <span className="text-[9px] font-bold text-[#16241f]/60 uppercase block">Term 3</span>
                      <span className="text-lg font-black text-[#16241f]">26</span>
                    </div>

                    {/* Jump 3 */}
                    <div className="flex flex-col items-center">
                      <span className={`text-[10px] font-black transition-all duration-300 ${demoStep >= 1 ? 'text-[#9c6f1f]' : 'opacity-0'}`}>
                        +4
                      </span>
                      <span className="text-xs text-[#9c6f1f]">➔</span>
                    </div>

                    {/* Term 4 */}
                    <div className="p-3 bg-white border-2 border-[#16241f] rounded-xl text-center min-w-[50px] shadow-sm">
                      <span className="text-[9px] font-bold text-[#16241f]/60 uppercase block">Term 4</span>
                      <span className="text-lg font-black text-[#16241f]">30</span>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      ✨ Every jump between side-by-side terms is exactly +4!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 Rule: Add 4 each time! In a linear sequence, that jump never changes!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Check Jump Size (+4)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Confirm Term-to-Term Rule'
                    : '🔄 Reset Increasing Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Sequence: Start 30 ➔ End 18 Across 3 Equal Steps
                </h3>

                {/* Sequence Cards with Missing Term Placeholders */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                    {/* Start 30 */}
                    <div className="p-3 bg-white border-2 border-[#16241f] rounded-xl text-center min-w-[50px] shadow-sm">
                      <span className="text-[9px] font-bold text-[#16241f]/60 uppercase block">Start</span>
                      <span className="text-lg font-black text-[#16241f]">30</span>
                    </div>

                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                      <span className={`text-[10px] font-black text-[#16241f] transition-all duration-300 ${demoStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                        -4
                      </span>
                      <span className="text-xs text-[#16241f]">➔</span>
                    </div>

                    {/* Missing Term 1 */}
                    <div className={`p-3 rounded-xl text-center min-w-[50px] border-2 transition-all duration-300 ${demoStep >= 2 ? 'bg-[#16241f] text-white border-[#16241f]' : 'bg-white text-[#16241f] border-dashed border-[#16241f]/40'}`}>
                      <span className="text-[9px] font-bold block opacity-75">Term 2</span>
                      <span className="text-lg font-black">{demoStep >= 2 ? '26' : '?'}</span>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                      <span className={`text-[10px] font-black text-[#16241f] transition-all duration-300 ${demoStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                        -4
                      </span>
                      <span className="text-xs text-[#16241f]">➔</span>
                    </div>

                    {/* Missing Term 2 */}
                    <div className={`p-3 rounded-xl text-center min-w-[50px] border-2 transition-all duration-300 ${demoStep >= 2 ? 'bg-[#16241f] text-white border-[#16241f]' : 'bg-white text-[#16241f] border-dashed border-[#16241f]/40'}`}>
                      <span className="text-[9px] font-bold block opacity-75">Term 3</span>
                      <span className="text-lg font-black">{demoStep >= 2 ? '22' : '?'}</span>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                      <span className={`text-[10px] font-black text-[#16241f] transition-all duration-300 ${demoStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                        -4
                      </span>
                      <span className="text-xs text-[#16241f]">➔</span>
                    </div>

                    {/* End 18 */}
                    <div className="p-3 bg-white border-2 border-[#16241f] rounded-xl text-center min-w-[50px] shadow-sm">
                      <span className="text-[9px] font-bold text-[#16241f]/60 uppercase block">End</span>
                      <span className="text-lg font-black text-[#16241f]">18</span>
                    </div>
                  </div>

                  {demoStep === 1 && (
                    <div className="mt-3 p-2 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-sm animate-fade-in">
                      🔍 Overall difference: 30 - 18 = 12. Divided by 3 steps = 4 per jump (-4)!
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="mt-3 p-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                      🎉 Sequence completed: 30, 26, 22, 18! Rule: Subtract 4 each time!
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Calculate Step Size (12 ÷ 3 = 4)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Fill Missing Terms (26, 22)'
                    : '🔄 Reset Decreasing Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'increasing' ? (
                <>
                  {demoStep === 0 && 'Analyzing the increasing sequence 18, 22, 26, 30. Click Check Jump Size!'}
                  {demoStep === 1 && 'The jump from 18 to 22 is +4, from 22 to 26 is +4, and from 26 to 30 is +4!'}
                  {demoStep === 2 && 'In the sequence 18, 22, 26, 30, the rule is to add 4 each time! In a linear sequence, the jump size never changes.'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Finding missing gaps when a sequence starts at 30 and drops to 18 across 3 equal steps. Click Calculate Equal Steps!'}
                  {demoStep === 1 && 'The overall difference is 30 minus 18 equals 12. Dividing 12 by 3 steps gives a jump size of 4!'}
                  {demoStep === 2 && 'Subtracting 4 each time gives the complete sequence: 30, 26, 22, 18! To find the step size when numbers have missing gaps, find the overall difference and divide by the number of steps.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Linear Sequences and Rules</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Check the jump between any two side-by-side numbers: in a linear sequence, that jump never changes!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('increasing');
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

export default LinearSequencesRulesPlayer;
