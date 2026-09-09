import React, { useState, useEffect, useCallback } from 'react';

export interface ComposingDecomposingPlayerProps {
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
    questionText: 'What does decomposing 45.8 give when split into its place-value parts?',
    options: [
      '40 plus 5 plus 0.8',
      '4 plus 5 plus 8',
      '400 plus 50 plus 8'
    ],
    correctIndex: 0,
    hint: 'Decomposing 45.8 splits it into tens, ones, and tenths: 4 tens (40), 5 ones (5), and 8 tenths (0.8).'
  },
  {
    id: 2,
    questionText: 'When regrouping 3.4 by trading 1 whole for 10 tenths, what is the result?',
    options: [
      '3 wholes and 14 tenths',
      '2 wholes and 14 tenths',
      '2 wholes and 4 tenths'
    ],
    correctIndex: 1,
    hint: 'Trading 1 whole leaves 2 wholes, and adding 10 tenths to 4 tenths gives 14 tenths (2 wholes and 14 tenths).'
  },
  {
    id: 3,
    questionText: "What happens to a number's total value when it is decomposed or regrouped?",
    options: [
      'The total value gets larger',
      'The total value gets smaller',
      'The total value stays invariant (unchanged)'
    ],
    correctIndex: 2,
    hint: "A number's total value stays invariant no matter how it is decomposed, composed, or regrouped."
  }
];

export const ComposingDecomposingPlayer: React.FC<ComposingDecomposingPlayerProps> = ({
  conceptName = 'Concept 1.2: Composing, Decomposing, and Regrouping Numbers',
  unitTitle = 'Unit 1: Number (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [regrouped, setRegrouped] = useState<boolean>(false);
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
        'Decomposing a number means splitting it into its place-value parts. Composing means putting those parts back together to make the whole number. Regrouping trades an amount in one place-value column for an equal amount in a neighbouring column without changing the total value.'
      );
    } else if (phase === 'demo') {
      if (!regrouped) {
        safeNarrate(
          "3.4 is made of 3 Wholes and 4 Tenths. Click 'Trade 1 Whole for 10 Tenths' to see regrouping in action!"
        );
      } else {
        safeNarrate(
          'Regrouping 3.4 shows 2 Wholes and 14 Tenths. Notice that 2 plus 1.4 still totals 3.4! The total value stays invariant.'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate('Congratulations! You mastered Composing, Decomposing, and Regrouping Numbers! You earned 3 stars!');
    }
  }, [phase, regrouped, quizIndex, safeNarrate]);

  const handleToggleRegroup = () => {
    const nextState = !regrouped;
    setRegrouped(nextState);
    if (nextState) {
      safeNarrate(
        'Regrouping 3.4 shows 2 Wholes and 14 Tenths. Notice that 2 plus 1.4 still totals 3.4! The total value stays invariant.'
      );
    } else {
      safeNarrate(
        "3.4 is made of 3 Wholes and 4 Tenths. Click 'Trade 1 Whole for 10 Tenths' to see regrouping in action!"
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
              Core Definitions
            </h3>
            <p className="text-sm leading-relaxed text-[#16241f]">
              <strong>Decomposing</strong> a number means splitting it into its place-value parts. 
              <strong>Composing</strong> means putting those parts back together to make the whole number. 
              <strong>Regrouping</strong> trades an amount in one place-value column for an equal amount in a neighbouring column without changing the total value.
            </p>
          </div>

          {/* Place-Value Breakdown Visual for 45.8 */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            <p className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider mb-3">
              Decomposing Example: 45.8
            </p>

            <div className="flex items-center justify-center gap-2 md:gap-4 my-3">
              <div className="flex-1 p-3 bg-[#16241f]/5 rounded-xl border border-[#16241f]/15">
                <span className="block text-2xl font-black text-[#16241f]">40</span>
                <span className="text-[11px] font-bold text-[#9c6f1f] uppercase">4 Tens</span>
              </div>
              <span className="text-xl font-bold text-[#9c6f1f]">+</span>
              <div className="flex-1 p-3 bg-[#16241f]/5 rounded-xl border border-[#16241f]/15">
                <span className="block text-2xl font-black text-[#16241f]">5</span>
                <span className="text-[11px] font-bold text-[#9c6f1f] uppercase">5 Ones</span>
              </div>
              <span className="text-xl font-bold text-[#9c6f1f]">+</span>
              <div className="flex-1 p-3 bg-[#9c6f1f]/10 rounded-xl border border-[#9c6f1f]/30">
                <span className="block text-2xl font-black text-[#9c6f1f]">0.8</span>
                <span className="text-[11px] font-bold text-[#9c6f1f] uppercase">8 Tenths</span>
              </div>
            </div>

            <p className="text-xs text-[#16241f]/70 mt-2 font-medium">
              45.8 decomposed = 40 + 5 + 0.8. Total value stays invariant!
            </p>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Regrouping Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Regrouping Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            <h3 className="text-sm font-bold text-[#9c6f1f] uppercase tracking-wide mb-1">
              Interactive Regrouping: 3.4
            </h3>
            <p className="text-xs text-[#16241f]/80">
              Watch what happens when we trade 1 Whole for 10 Tenths!
            </p>
          </div>

          {/* Dynamic Place-Value Columns */}
          <div className="grid grid-cols-2 gap-4 p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm">
            {/* Wholes Column */}
            <div className="p-4 bg-[#16241f]/5 rounded-xl border border-[#16241f]/15 text-center">
              <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block mb-2">
                Wholes (Ones) Column
              </span>
              <span className="text-4xl font-black text-[#16241f] block my-2">
                {regrouped ? '2' : '3'}
              </span>
              <div className="flex justify-center gap-1.5 mt-3">
                {Array.from({ length: regrouped ? 2 : 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-12 bg-[#16241f] rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  >
                    1
                  </div>
                ))}
              </div>
            </div>

            {/* Tenths Column */}
            <div className="p-4 bg-[#9c6f1f]/10 rounded-xl border border-[#9c6f1f]/30 text-center">
              <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block mb-2">
                Tenths Column
              </span>
              <span className="text-4xl font-black text-[#9c6f1f] block my-2">
                {regrouped ? '14' : '4'}
              </span>
              <div className="flex flex-wrap justify-center gap-1 mt-3 max-h-24 overflow-y-auto p-1">
                {Array.from({ length: regrouped ? 14 : 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 bg-[#9c6f1f] rounded-sm text-white text-[9px] font-bold flex items-center justify-center shadow-xs"
                  >
                    .1
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Explanation Text */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {!regrouped ? (
                <>3.4 is made of <strong>3 Wholes and 4 Tenths</strong>.</>
              ) : (
                <>
                  Regrouping 3.4 gives <strong>2 Wholes and 14 Tenths</strong> (2 + 1.4 = 3.4).
                  <br />
                  <span className="text-xs text-[#9c6f1f] font-bold mt-1 inline-block">
                    The total value stays invariant!
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleToggleRegroup}
              className="flex-1 py-3 px-4 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
            >
              {!regrouped ? '🔄 Trade 1 Whole for 10 Tenths' : '↩️ Reset to Standard 3.4'}
            </button>
            <button
              onClick={() => setPhase('checkpoint_quiz')}
              className="flex-1 py-3 px-4 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
            >
              Start Checkpoint Quiz ➔
            </button>
          </div>
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Composing, Decomposing, and Regrouping Numbers</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Decomposing splits numbers by their place columns, while regrouping trades equal amounts between columns.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setRegrouped(false);
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

export default ComposingDecomposingPlayer;
