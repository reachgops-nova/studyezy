import React, { useState, useEffect, useCallback } from 'react';

export interface FractionDivisionPlayerProps {
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
    questionText: 'If 3 pies are shared equally among 10 plates, how much pie does each plate receive?',
    options: [
      'Each plate receives 3 ÷ 10, which equals 3/10 of a pie',
      'Each plate receives 10 ÷ 3, which equals 10/3 of a pie',
      'Each plate receives 3 × 10 = 30 whole pies'
    ],
    correctIndex: 0,
    hint: 'The total items shared (3 pies) becomes the top numerator, and the group size (10 plates) becomes the bottom denominator: 3 ÷ 10 = 3/10.'
  },
  {
    id: 2,
    questionText: 'If 1 litre of water is divided equally into 8 glasses, how much water is in each glass?',
    options: [
      '8 litres of water',
      '1/8 of a litre (1 divided by 8)',
      '8/1 of a litre'
    ],
    correctIndex: 1,
    hint: 'Dividing 1 litre equally into 8 glasses gives 1 ÷ 8, which creates the unit fraction 1/8 of a litre.'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember when working with fractions as division?',
    options: [
      'Always multiply the top and bottom numbers',
      'Think of the fraction bar as a division sign: top divided by bottom!',
      'Add the top number to the bottom number'
    ],
    correctIndex: 1,
    hint: 'Think of the fraction bar as a division sign: top divided by bottom!'
  }
];

export const FractionDivisionPlayer: React.FC<FractionDivisionPlayerProps> = ({
  conceptName = 'Concept 6.1: Fractions as Division',
  unitTitle = 'Unit 6: Fractions, Decimals, Percentages and Proportion (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'pies_plates' | 'water_glasses'>('pies_plates');
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
        'A fraction represents sharing an amount into equal parts, where the division symbol and the fraction line mean the exact same thing. The top number shows how much you have to share, and the bottom number shows how many equal groups you are dividing it into. Dividing a whole number by another whole number creates a fraction, such as 1 divided by 10 equalling 1/10.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'pies_plates') {
        const desc =
          demoStep === 0
            ? 'Sharing 3 pies equally among 10 plates. Click Convert Division to Fraction!'
            : demoStep === 1
            ? '3 divided by 10 turns directly into the fraction 3/10!'
            : 'Each plate receives 3/10 of a pie! Think of the fraction bar as a division sign: top divided by bottom!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Dividing 1 litre of water equally into 8 glasses. Click Convert Division to Fraction!'
            : demoStep === 1
            ? '1 divided by 8 turns directly into the unit fraction 1/8!'
            : 'Each glass gets 1/8 of a litre of water! Dividing 1 whole item into equal parts creates a unit fraction.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Fractions as Division! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'pies_plates' | 'water_glasses') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'pies_plates') {
      safeNarrate('Sharing 3 pies equally among 10 plates. Click Convert Division to Fraction!');
    } else {
      safeNarrate('Dividing 1 litre of water equally into 8 glasses. Click Convert Division to Fraction!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'pies_plates') {
      const desc =
        next === 0
          ? 'Sharing 3 pies equally among 10 plates. Click Convert Division to Fraction!'
          : next === 1
          ? '3 divided by 10 turns directly into the fraction 3/10!'
          : 'Each plate receives 3/10 of a pie! Think of the fraction bar as a division sign: top divided by bottom!';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Dividing 1 litre of water equally into 8 glasses. Click Convert Division to Fraction!'
          : next === 1
          ? '1 divided by 8 turns directly into the unit fraction 1/8!'
          : 'Each glass gets 1/8 of a litre of water! Dividing 1 whole item into equal parts creates a unit fraction.';
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
              A <strong>fraction</strong> represents sharing an amount into equal parts, where the division symbol and the fraction line mean the exact same thing. 
              The <strong>top number (numerator)</strong> shows how much you have to share, and the <strong>bottom number (denominator)</strong> shows how many equal groups you are dividing it into. 
              Dividing a whole number by another whole number creates a fraction, such as 1 divided by 10 equalling 1/10.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Sharing Pies Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Sharing 3 pies equally among 10 plates ➔ 3 ÷ 10 = 3/10
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Each plate receives 3/10 of a pie.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                🥧 3/10
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Dividing Water Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Dividing 1 litre of water into 8 glasses ➔ 1 ÷ 8 = 1/8
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Each glass receives a unit fraction: 1/8 of a litre.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                💧 1/8 L
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Fraction Division Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('pies_plates')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'pies_plates'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🥧 3 Pies ÷ 10 Plates (3/10)
            </button>
            <button
              onClick={() => handleSelectDemoMode('water_glasses')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'water_glasses'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              💧 1 Litre ÷ 8 Glasses (1/8)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'pies_plates' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Sharing 3 Pies Equally Among 10 Plates
                </h3>

                {/* Interactive Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  {demoStep === 0 && (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex justify-center items-center gap-2 text-2xl font-black text-[#16241f]">
                        <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">3 Pies</span>
                        <span>÷</span>
                        <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">10 Plates</span>
                      </div>
                      <span className="text-xs font-semibold text-[#16241f]/70">
                        3 whole items divided among 10 equal plates.
                      </span>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center justify-center gap-3 text-2xl font-black text-[#9c6f1f]">
                        <div className="flex flex-col items-center p-3 bg-white border-2 border-[#9c6f1f] rounded-xl">
                          <span>3</span>
                          <div className="w-8 h-1 bg-[#9c6f1f] my-1" />
                          <span>10</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#9c6f1f] mt-1">
                        ✨ Top number = items (3), Bottom number = plates (10)!
                      </span>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-[#9c6f1f] text-white rounded-xl text-lg font-black shadow-md">
                        Each plate gets <span className="underline">3/10</span> of a pie!
                      </div>
                      <span className="text-xs font-bold text-[#16241f]">
                        🎉 3 ÷ 10 = 3/10 pie per plate!
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '🥧 Step 1: Convert Division (3 ÷ 10) to Fraction'
                    : demoStep === 1
                    ? '✨ Step 2: Confirm Share Per Plate (3/10)'
                    : '🔄 Reset Pies Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Dividing 1 Litre of Water Equally Into 8 Glasses
                </h3>

                {/* Interactive Visualizer */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  {demoStep === 0 && (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex justify-center items-center gap-2 text-2xl font-black text-[#16241f]">
                        <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">1 Litre</span>
                        <span>÷</span>
                        <span className="p-3 bg-white rounded-xl border border-[#16241f]/20">8 Glasses</span>
                      </div>
                      <span className="text-xs font-semibold text-[#16241f]/70">
                        1 whole litre shared equally into 8 glasses.
                      </span>
                    </div>
                  )}

                  {demoStep === 1 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center justify-center gap-3 text-2xl font-black text-[#16241f]">
                        <div className="flex flex-col items-center p-3 bg-white border-2 border-[#16241f] rounded-xl">
                          <span>1</span>
                          <div className="w-8 h-1 bg-[#16241f] my-1" />
                          <span>8</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#16241f] mt-1">
                        💧 Numerator is 1 (unit fraction showing 1 share)!
                      </span>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-[#16241f] text-white rounded-xl text-lg font-black shadow-md">
                        Each glass receives <span className="text-[#9c6f1f] underline">1/8</span> of a litre!
                      </div>
                      <span className="text-xs font-bold text-[#16241f]">
                        🎉 1 ÷ 8 = 1/8 litre per glass!
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '💧 Step 1: Convert Division (1 ÷ 8) to Fraction'
                    : demoStep === 1
                    ? '✨ Step 2: Confirm Unit Fraction Share (1/8)'
                    : '🔄 Reset Water Glasses Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'pies_plates' ? (
                <>
                  {demoStep === 0 && 'Sharing 3 pies equally among 10 plates. Click Convert Division to Fraction!'}
                  {demoStep === 1 && '3 divided by 10 turns directly into the fraction 3/10!'}
                  {demoStep === 2 && 'Each plate receives 3/10 of a pie! Think of the fraction bar as a division sign: top divided by bottom!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Dividing 1 litre of water equally into 8 glasses. Click Convert Division to Fraction!'}
                  {demoStep === 1 && '1 divided by 8 turns directly into the unit fraction 1/8!'}
                  {demoStep === 2 && 'Each glass gets 1/8 of a litre of water! Dividing 1 whole item into equal parts creates a unit fraction.'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Fractions as Division</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Think of the fraction bar as a division sign: top divided by bottom!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('pies_plates');
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

export default FractionDivisionPlayer;
