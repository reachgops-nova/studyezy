import React, { useState, useEffect, useCallback } from 'react';

export interface LinearSequencePlayerProps {
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
    questionText: 'In the sequence 3, 11, 19, 27, what is the constant difference and term-to-term rule?',
    options: [
      'The constant difference is 8, so the rule is add 8',
      'The constant difference is 5, so the rule is add 5',
      'The constant difference is 11, so the rule is add 11'
    ],
    correctIndex: 0,
    hint: 'In the sequence 3, 11, 19, 27, the constant difference between consecutive terms is 8, so the rule is add 8.'
  },
  {
    id: 2,
    questionText: 'What is the missing term between 8 and 14 with one missing box in a linear sequence?',
    options: [
      '10',
      '11',
      '12'
    ],
    correctIndex: 1,
    hint: 'Between 8 and 14, the difference is 6. Sharing 6 into 2 equal steps gives a jump of 3, making the missing term 11 (8, 11, 14).'
  },
  {
    id: 3,
    questionText: 'What defines a linear sequence and its term-to-term rule?',
    options: [
      'A linear sequence changes by a different random amount each step',
      'A linear sequence changes by the same constant amount from one term to the next',
      'Each term in a linear sequence is multiplied by 10 each step'
    ],
    correctIndex: 1,
    hint: 'A linear sequence changes by the same constant amount from one term to the next, which defines the term-to-term rule.'
  }
];

export const LinearSequencePlayer: React.FC<LinearSequencePlayerProps> = ({
  conceptName = 'Concept 1.5: Linear Sequences and Term-to-Term Rules',
  unitTitle = 'Unit 1: Number (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'constant_rule' | 'missing_term'>('constant_rule');
  const [ruleStep, setRuleStep] = useState<number>(0); // 0: [1], 1: [1], 2: [1], 3: [1]
  const [showMissing, setShowMissing] = useState<boolean>(false);
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
        'A linear sequence changes by the same constant amount from one term to the next. Each number in a sequence is called a term. The constant difference between consecutive terms defines the term-to-term rule, and a missing term can be found by dividing the total gap by the number of steps.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'constant_rule') {
        const terms = [3, 11, 19, 27];
        const currentTerms = terms.slice(0, ruleStep + 1).join(', ');
        safeNarrate(
          `In the sequence ${currentTerms}, the constant difference is 8, so the term-to-term rule is add 8.`
        );
      } else {
        if (!showMissing) {
          safeNarrate(
            'Between the terms 8 and 14 with one missing box, the total difference is 6. Click Reveal Missing Term to share it into 2 equal steps!'
          );
        } else {
          safeNarrate(
            'Sharing the gap of 6 into 2 equal steps gives a jump of 3, making the missing term 11! The sequence is 8, 11, 14.'
          );
        }
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Linear Sequences and Term-to-Term Rules! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, ruleStep, showMissing, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'constant_rule' | 'missing_term') => {
    setDemoMode(mode);
    if (mode === 'constant_rule') {
      setRuleStep(0);
      safeNarrate(
        'In the sequence 3, the constant difference is 8, so the term-to-term rule is add 8.'
      );
    } else {
      setShowMissing(false);
      safeNarrate(
        'Between the terms 8 and 14 with one missing box, the total difference is 6. Click Reveal Missing Term to share it into 2 equal steps!'
      );
    }
  };

  const handleNextRuleStep = () => {
    const nextStep = (ruleStep + 1) % 4;
    setRuleStep(nextStep);
    const terms = [3, 11, 19, 27];
    const currentTerms = terms.slice(0, nextStep + 1).join(', ');
    safeNarrate(
      `In the sequence ${currentTerms}, the constant difference is 8, so the term-to-term rule is add 8.`
    );
  };

  const handleToggleMissing = () => {
    const nextState = !showMissing;
    setShowMissing(nextState);
    if (nextState) {
      safeNarrate(
        'Sharing the gap of 6 into 2 equal steps gives a jump of 3, making the missing term 11! The sequence is 8, 11, 14.'
      );
    } else {
      safeNarrate(
        'Between the terms 8 and 14 with one missing box, the total difference is 6. Click Reveal Missing Term to share it into 2 equal steps!'
      );
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
              A <strong>linear sequence</strong> changes by the same constant amount from one term to the next. 
              Each number in a sequence is called a <strong>term</strong>. The constant difference between consecutive terms defines the <strong>term-to-term rule</strong>, and a missing term can be found by dividing the total gap by the number of steps.
            </p>
          </div>

          {/* Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Sequence Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  3, 11, 19, 27
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Constant difference is 8. Term-to-term rule = Add 8.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                ➕ 8 Step
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Missing Term Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  8, [ 11 ], 14
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Total gap between 8 and 14 is 6. Shared into 2 equal steps of +3 gives 11.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🔍 Gap ÷ 2
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Sequence Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('constant_rule')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'constant_rule'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ➕ Sequence (3, 11, 19, 27)
            </button>
            <button
              onClick={() => handleSelectDemoMode('missing_term')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'missing_term'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🔍 Missing Term (8, __, 14)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'constant_rule' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-2">
                  Term-to-Term Rule: Add 8
                </h3>

                {/* Sequence Term Cards */}
                <div className="flex justify-center items-center gap-2 md:gap-3 my-6 flex-wrap">
                  {[3, 11, 19, 27].map((num, idx) => {
                    const isVisible = idx <= ruleStep;

                    return (
                      <React.Fragment key={idx}>
                        <div
                          className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 ${
                            isVisible
                              ? 'bg-[#9c6f1f]/10 border-[#9c6f1f] scale-105 shadow-sm'
                              : 'bg-[#16241f]/5 border-[#16241f]/10 opacity-40'
                          }`}
                        >
                          <span className="text-xs font-bold text-[#16241f]/50 uppercase mb-1">
                            Term {idx + 1}
                          </span>
                          <span className="text-2xl font-black text-[#16241f]">
                            {isVisible ? num : '?'}
                          </span>
                        </div>

                        {idx < 3 && (
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-[#9c6f1f] bg-[#9c6f1f]/15 px-2 py-0.5 rounded-full border border-[#9c6f1f]/30">
                              +8
                            </span>
                            <span className="text-sm text-[#9c6f1f]">➔</span>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <button
                  onClick={handleNextRuleStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  ➕ Add Next Term (+8 Jump)
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-2">
                  Finding Missing Term Between 8 and 14
                </h3>

                {/* Missing Term Visual */}
                <div className="flex justify-center items-center gap-3 my-6">
                  <div className="p-4 bg-[#16241f]/10 rounded-xl border border-[#16241f]/20 text-center">
                    <span className="text-xs font-bold text-[#16241f]/60 uppercase block mb-1">Known Term</span>
                    <span className="text-3xl font-black text-[#16241f]">8</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-[#9c6f1f] mb-1">
                      {showMissing ? '+3 Jump' : '+ ? Jump'}
                    </span>
                    <span className="text-xl text-[#9c6f1f]">➔</span>
                  </div>

                  <div className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                    showMissing
                      ? 'bg-[#9c6f1f]/20 border-[#9c6f1f] scale-110 shadow-md'
                      : 'bg-white border-dashed border-[#16241f]/30'
                  }`}>
                    <span className="text-xs font-bold text-[#9c6f1f] uppercase block mb-1">
                      {showMissing ? 'Found Term' : 'Missing Box'}
                    </span>
                    <span className="text-3xl font-black text-[#16241f]">
                      {showMissing ? '11' : '?'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-[#9c6f1f] mb-1">
                      {showMissing ? '+3 Jump' : '+ ? Jump'}
                    </span>
                    <span className="text-xl text-[#9c6f1f]">➔</span>
                  </div>

                  <div className="p-4 bg-[#16241f]/10 rounded-xl border border-[#16241f]/20 text-center">
                    <span className="text-xs font-bold text-[#16241f]/60 uppercase block mb-1">Known Term</span>
                    <span className="text-3xl font-black text-[#16241f]">14</span>
                  </div>
                </div>

                <div className="p-3 bg-[#16241f]/5 rounded-xl border border-[#16241f]/15 mb-3 text-xs text-[#16241f]">
                  Total Difference = 14 - 8 = 6. Divided into 2 steps = 3 per step!
                </div>

                <button
                  onClick={handleToggleMissing}
                  className="py-2.5 px-5 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {showMissing ? '🔄 Reset Missing Box' : '🔍 Reveal Missing Term (11)'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'constant_rule' ? (
                <>
                  In the sequence <strong>3, 11, 19, 27</strong>, the constant difference is 8, so the term-to-term rule is <strong>add 8</strong>.
                </>
              ) : (
                <>
                  {!showMissing ? (
                    <>Between 8 and 14 with one missing box, the total difference is 6. Sharing it into 2 equal steps gives a jump of 3.</>
                  ) : (
                    <>Sharing the gap of 6 into 2 equal steps gives a jump of 3, making the missing term <strong>11</strong> (8, 11, 14)!</>
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Linear Sequences and Term-to-Term Rules</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Always check that the difference between neighbouring terms stays the same.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setRuleStep(0);
                setShowMissing(false);
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

export default LinearSequencePlayer;
