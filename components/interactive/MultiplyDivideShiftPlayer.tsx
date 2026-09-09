import React, { useState, useEffect, useCallback } from 'react';

export interface MultiplyDivideShiftPlayerProps {
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
    questionText: 'What happens when you multiply 36 by 100?',
    options: [
      'Shifts the digits 2 places to the left to make 3600',
      'Shifts the digits 2 places to the right to make 3.6',
      'Shifts the digits 1 place to the left to make 360'
    ],
    correctIndex: 0,
    hint: 'Multiplying by 100 shifts every digit 2 places to the left, making 36 become 3600.'
  },
  {
    id: 2,
    questionText: 'What happens when you divide 5380 by 10?',
    options: [
      'Shifts each digit 1 place to the left to make 53800',
      'Shifts each digit 1 place to the right to make 538',
      'Shifts each digit 2 places to the right to make 53.8'
    ],
    correctIndex: 1,
    hint: 'Dividing by 10 shifts each digit 1 place to the right, making 5380 become 538.'
  },
  {
    id: 3,
    questionText: 'What is the role of 0 when shifting digits during multiplication or division?',
    options: [
      '0 makes the total number negative',
      '0 acts as a placeholder to hold an empty place-value column',
      '0 removes the column from the number system'
    ],
    correctIndex: 1,
    hint: '0 acts as a placeholder to hold an empty place-value column when digits shift left or right.'
  }
];

export const MultiplyDivideShiftPlayer: React.FC<MultiplyDivideShiftPlayerProps> = ({
  conceptName = 'Concept 1.3: Multiplying and Dividing Whole Numbers by 10, 100, and 1000',
  unitTitle = 'Unit 1: Number (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'multiply' | 'divide'>('multiply');
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

  // Trigger narrations on phase or state changes
  useEffect(() => {
    if (phase === 'visual_intro') {
      safeNarrate(
        'Multiplying or dividing a whole number by 10, 100, or 1000 shifts every digit left or right by 1, 2, or 3 place-value columns. Multiplying shifts digits left to make the number bigger. Dividing shifts digits right to make the number smaller. 0 acts as a placeholder to hold an empty place-value column.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'multiply') {
        safeNarrate(
          'Multiplying 36 by 100 shifts the digits 2 places to the left to make 3600. Notice how 0 acts as a placeholder in the tens and ones columns!'
        );
      } else {
        safeNarrate(
          'Dividing 5380 by 10 shifts each digit 1 place to the right to make 538. Shifting right makes the number smaller!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Multiplying and Dividing Whole Numbers by 10, 100, and 1000! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'multiply' | 'divide') => {
    setDemoMode(mode);
    if (mode === 'multiply') {
      safeNarrate(
        'Multiplying 36 by 100 shifts the digits 2 places to the left to make 3600. Notice how 0 acts as a placeholder in the tens and ones columns!'
      );
    } else {
      safeNarrate(
        'Dividing 5380 by 10 shifts each digit 1 place to the right to make 538. Shifting right makes the number smaller!'
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
              Core Definition & Rule
            </h3>
            <p className="text-sm leading-relaxed text-[#16241f]">
              Multiplying or dividing a whole number by 10, 100, or 1000 shifts every digit left or right by 1, 2, or 3 place-value columns. 
              <strong> Multiplying shifts digits left</strong> (making the number bigger); 
              <strong> dividing shifts digits right</strong> (making the number smaller). 
              <strong> 0 acts as a placeholder</strong> where needed to hold an empty place-value column.
            </p>
          </div>

          {/* Place-Value Shift Preview Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Multiplication Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  36 × 100 = 3600
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Digits shift 2 places to the left. 0s fill the empty tens and ones places.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                ⬅️ 2 Places
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Division Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  5380 ÷ 10 = 538
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Digits shift 1 place to the right. The number becomes smaller.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                1 Place ➡️
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Digit Shift Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Digit Shift Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('multiply')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'multiply'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              ⬅️ Multiply 36 × 100
            </button>
            <button
              onClick={() => handleSelectDemoMode('divide')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'divide'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              Divide 5380 ÷ 10 ➡️
            </button>
          </div>

          {/* Animated Place Value Grid */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-4">
              {demoMode === 'multiply' ? 'Multiplying 36 by 100' : 'Dividing 5380 by 10'}
            </h3>

            {/* Place Value Column Headers */}
            <div className="grid grid-cols-4 gap-2 mb-2 text-center text-[11px] font-bold text-[#16241f]/60 uppercase tracking-wider">
              <div className="p-1 bg-[#16241f]/5 rounded">Thousands</div>
              <div className="p-1 bg-[#16241f]/5 rounded">Hundreds</div>
              <div className="p-1 bg-[#16241f]/5 rounded">Tens</div>
              <div className="p-1 bg-[#16241f]/5 rounded">Ones</div>
            </div>

            {/* Original Row */}
            <div className="mb-3">
              <span className="text-[10px] font-bold text-[#16241f]/50 block mb-1 uppercase">Start</span>
              <div className="grid grid-cols-4 gap-2 text-center font-black text-lg">
                {demoMode === 'multiply' ? (
                  <>
                    <div className="p-2.5 bg-[#16241f]/5 rounded-lg text-[#16241f]/30">-</div>
                    <div className="p-2.5 bg-[#16241f]/5 rounded-lg text-[#16241f]/30">-</div>
                    <div className="p-2.5 bg-[#16241f]/10 rounded-lg text-[#16241f]">3</div>
                    <div className="p-2.5 bg-[#16241f]/10 rounded-lg text-[#16241f]">6</div>
                  </>
                ) : (
                  <>
                    <div className="p-2.5 bg-[#16241f]/10 rounded-lg text-[#16241f]">5</div>
                    <div className="p-2.5 bg-[#16241f]/10 rounded-lg text-[#16241f]">3</div>
                    <div className="p-2.5 bg-[#16241f]/10 rounded-lg text-[#16241f]">8</div>
                    <div className="p-2.5 bg-[#16241f]/10 rounded-lg text-[#16241f]">0</div>
                  </>
                )}
              </div>
            </div>

            {/* Shift Direction Arrow */}
            <div className="my-2 py-1 bg-[#9c6f1f]/10 text-[#9c6f1f] text-xs font-bold rounded-lg flex items-center justify-center gap-2">
              {demoMode === 'multiply' ? (
                <span>⬅️ Shift Digits 2 Places Left (× 100)</span>
              ) : (
                <span>Shift Digits 1 Place Right (÷ 10) ➡️</span>
              )}
            </div>

            {/* Result Row */}
            <div>
              <span className="text-[10px] font-bold text-[#9c6f1f] block mb-1 uppercase">Result</span>
              <div className="grid grid-cols-4 gap-2 text-center font-black text-xl">
                {demoMode === 'multiply' ? (
                  <>
                    <div className="p-3 bg-[#9c6f1f]/20 rounded-lg text-[#9c6f1f] border-2 border-[#9c6f1f]">3</div>
                    <div className="p-3 bg-[#9c6f1f]/20 rounded-lg text-[#9c6f1f] border-2 border-[#9c6f1f]">6</div>
                    <div className="p-3 bg-[#16241f]/10 rounded-lg text-[#16241f]">0</div>
                    <div className="p-3 bg-[#16241f]/10 rounded-lg text-[#16241f]">0</div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-[#16241f]/5 rounded-lg text-[#16241f]/30">-</div>
                    <div className="p-3 bg-[#16241f]/20 rounded-lg text-[#16241f] border-2 border-[#16241f]">5</div>
                    <div className="p-3 bg-[#16241f]/20 rounded-lg text-[#16241f] border-2 border-[#16241f]">3</div>
                    <div className="p-3 bg-[#16241f]/20 rounded-lg text-[#16241f] border-2 border-[#16241f]">8</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'multiply' ? (
                <>
                  Multiplying 36 by 100 shifts the digits 2 places to the left to make <strong>3600</strong>. Notice how 0 acts as a placeholder in the tens and ones columns!
                </>
              ) : (
                <>
                  Dividing 5380 by 10 shifts each digit 1 place to the right to make <strong>538</strong>. Shifting right makes the number smaller!
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Multiplying and Dividing Whole Numbers by 10, 100, and 1000</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Left is bigger (multiply); right is smaller (divide). 0 acts as a placeholder to hold an empty place-value column.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('multiply');
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

export default MultiplyDivideShiftPlayer;
