import React, { useState, useEffect, useCallback } from 'react';

export interface RoundingDecimalsPlayerProps {
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
    questionText: 'When you round 4.8 to the nearest whole number, what is the result?',
    options: [
      '5 (because 8 tenths is past halfway, so it rounds up)',
      '4 (because 4.8 is closer to 4)',
      '4.0 (without rounding)'
    ],
    correctIndex: 0,
    hint: '4.8 lies between 4 and 5. The tenths digit is 8, which is 5 or more (past halfway), so it rounds up to 5.'
  },
  {
    id: 2,
    questionText: 'When rounding 9.3 to the nearest whole number, why does it round down to 9?',
    options: [
      'Because 3 tenths is less than halfway (4 or less rolls back down)',
      'Because 9.3 is greater than 10',
      'Because 3 tenths rounds up to 10'
    ],
    correctIndex: 0,
    hint: '9.3 lies between 9 and 10. The tenths digit is 3, which is 4 or less (less than halfway), so it rounds down to 9.'
  },
  {
    id: 3,
    questionText: 'What is the tip to remember when rounding decimals using the tenths digit?',
    options: [
      'Look at the tenths: 5 and above climbs up the hill, 4 and below rolls back down!',
      'Always add 1 to the whole number regardless of the tenths',
      'Always drop the whole number and keep only the decimal'
    ],
    correctIndex: 0,
    hint: 'Look at the tenths: 5 and above climbs up the hill, 4 and below rolls back down!'
  }
];

export const RoundingDecimalsPlayer: React.FC<RoundingDecimalsPlayerProps> = ({
  conceptName = 'Concept 7.3: Rounding Decimals to the Nearest Whole Number',
  unitTitle = 'Unit 7: Number (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'round_48' | 'round_93'>('round_48');
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
        'Rounding a decimal to the nearest whole number means deciding which whole integer it sits closest to on a number line. First find the two whole numbers that your decimal lies between, then look closely at the tenths digit. If the tenths digit is 5 or more, round up to the higher whole number; if it is 4 or less, round down. Look at the tenths: 5 and above climbs up the hill, 4 and below rolls back down!'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'round_48') {
        const desc =
          demoStep === 0
            ? 'Rounding 4.8 to the nearest whole number. Click Locate on Number Line!'
            : demoStep === 1
            ? '4.8 lies between 4 and 5. Look closely at the tenths digit: 8!'
            : 'Because 8 tenths is 5 or more (past halfway), 4.8 climbs up the hill and rounds up to 5!';
        safeNarrate(desc);
      } else {
        const desc =
          demoStep === 0
            ? 'Rounding 9.3 to the nearest whole number. Click Locate on Number Line!'
            : demoStep === 1
            ? '9.3 lies between 9 and 10. Look closely at the tenths digit: 3!'
            : 'Because 3 tenths is 4 or less (less than halfway), 9.3 rolls back down the hill and rounds down to 9!';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Rounding Decimals to the Nearest Whole Number! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, demoStep, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'round_48' | 'round_93') => {
    setDemoMode(mode);
    setDemoStep(0);
    if (mode === 'round_48') {
      safeNarrate('Rounding 4.8 to the nearest whole number. Click Locate on Number Line!');
    } else {
      safeNarrate('Rounding 9.3 to the nearest whole number. Click Locate on Number Line!');
    }
  };

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % 3;
    setDemoStep(next);
    if (demoMode === 'round_48') {
      const desc =
        next === 0
          ? 'Rounding 4.8 to the nearest whole number. Click Locate on Number Line!'
          : next === 1
          ? '4.8 lies between 4 and 5. Look closely at the tenths digit: 8!'
          : 'Because 8 tenths is 5 or more (past halfway), 4.8 climbs up the hill and rounds up to 5!';
      safeNarrate(desc);
    } else {
      const desc =
        next === 0
          ? 'Rounding 9.3 to the nearest whole number. Click Locate on Number Line!'
          : next === 1
          ? '9.3 lies between 9 and 10. Look closely at the tenths digit: 3!'
          : 'Because 3 tenths is 4 or less (less than halfway), 9.3 rolls back down the hill and rounds down to 9!';
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
              <strong>Rounding a decimal to the nearest whole number</strong> means deciding which whole integer it sits closest to on a number line. 
              First find the <strong>two whole numbers</strong> that your decimal lies between. 
              Look closely at the <strong>tenths digit</strong>: if it is <strong>5 or more</strong>, round up to the higher whole number; if it is <strong>4 or less</strong>, round down.
            </p>
          </div>

          {/* Real Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Round Up Example (4.8)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  4.8 lies between 4 and 5 ➔ 8 tenths is past halfway ➔ Rounds up to 5
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  5 and above climbs up the hill!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                📈 4.8 ➔ 5
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Round Down Example (9.3)
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  9.3 lies between 9 and 10 ➔ 3 tenths is less than halfway ➔ Rounds down to 9
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  4 and below rolls back down!
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                📉 9.3 ➔ 9
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Rounding Decimals Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('round_48')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'round_48'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              📈 Rounding 4.8 (Up to 5)
            </button>
            <button
              onClick={() => handleSelectDemoMode('round_93')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'round_93'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              📉 Rounding 9.3 (Down to 9)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'round_48' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-3">
                  Rounding 4.8 to the Nearest Whole Number
                </h3>

                {/* Number Line Visualizer for 4.8 between 4 and 5 */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="space-y-4 max-w-md mx-auto">
                    {/* Number Line Track */}
                    <div className="relative pt-6 pb-2">
                      <div className="h-3 bg-white border-2 border-[#16241f] rounded-full relative">
                        {/* Halfway Marker (4.5) */}
                        <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-[#9c6f1f]" />
                        
                        {/* Decimal Marker Position (4.8 = 80% mark) */}
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                            demoStep === 2
                              ? 'left-[100%] -translate-x-full bg-[#9c6f1f] text-white'
                              : demoStep === 1
                              ? 'left-[80%] -translate-x-1/2 bg-[#16241f] text-white scale-110'
                              : 'left-[80%] -translate-x-1/2 bg-[#9c6f1f] text-white'
                          }`}
                        >
                          {demoStep === 2 ? '5' : '4.8'}
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="flex justify-between text-xs font-black text-[#16241f] mt-2">
                        <span className={`p-1 rounded ${demoStep === 0 ? 'bg-white border' : ''}`}>4 Whole</span>
                        <span className="text-[#9c6f1f] font-bold text-[10px]">4.5 (Halfway)</span>
                        <span className={`p-1 rounded ${demoStep === 2 ? 'bg-[#9c6f1f] text-white' : ''}`}>5 Whole</span>
                      </div>
                    </div>

                    {demoStep === 1 && (
                      <div className="p-2.5 bg-[#16241f]/10 border border-[#16241f]/30 rounded-xl text-xs font-bold text-[#16241f] animate-fade-in">
                        🔍 Look at the tenths digit: 8 tenths is past halfway (4.5)!
                      </div>
                    )}

                    {demoStep === 2 && (
                      <div className="p-2.5 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                        ⛰️ 8 tenths is 5 or more, so 4.8 climbs up the hill and rounds UP to 5!
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#9c6f1f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Check Tenths Digit (8)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Round Up to 5'
                    : '🔄 Reset 4.8 Demo'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-3">
                  Rounding 9.3 to the Nearest Whole Number
                </h3>

                {/* Number Line Visualizer for 9.3 between 9 and 10 */}
                <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 my-3">
                  <div className="space-y-4 max-w-md mx-auto">
                    {/* Number Line Track */}
                    <div className="relative pt-6 pb-2">
                      <div className="h-3 bg-white border-2 border-[#16241f] rounded-full relative">
                        {/* Halfway Marker (9.5) */}
                        <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-[#9c6f1f]" />
                        
                        {/* Decimal Marker Position (9.3 = 30% mark) */}
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                            demoStep === 2
                              ? 'left-0 bg-[#16241f] text-white'
                              : demoStep === 1
                              ? 'left-[30%] -translate-x-1/2 bg-[#16241f] text-white scale-110'
                              : 'left-[30%] -translate-x-1/2 bg-[#16241f] text-white'
                          }`}
                        >
                          {demoStep === 2 ? '9' : '9.3'}
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="flex justify-between text-xs font-black text-[#16241f] mt-2">
                        <span className={`p-1 rounded ${demoStep === 2 ? 'bg-[#16241f] text-white' : ''}`}>9 Whole</span>
                        <span className="text-[#9c6f1f] font-bold text-[10px]">9.5 (Halfway)</span>
                        <span className={`p-1 rounded ${demoStep === 0 ? 'bg-white border' : ''}`}>10 Whole</span>
                      </div>
                    </div>

                    {demoStep === 1 && (
                      <div className="p-2.5 bg-[#16241f]/10 border border-[#16241f]/30 rounded-xl text-xs font-bold text-[#16241f] animate-fade-in">
                        🔍 Look at the tenths digit: 3 tenths is less than halfway (9.5)!
                      </div>
                    )}

                    {demoStep === 2 && (
                      <div className="p-2.5 bg-[#16241f] text-white rounded-xl text-xs font-bold shadow-md animate-fade-in">
                        ⛰️ 3 tenths is 4 or less, so 9.3 rolls back down the hill and rounds DOWN to 9!
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleNextDemoStep}
                  className="py-2.5 px-5 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
                >
                  {demoStep === 0
                    ? '1️⃣ Step 1: Check Tenths Digit (3)'
                    : demoStep === 1
                    ? '2️⃣ Step 2: Round Down to 9'
                    : '🔄 Reset 9.3 Demo'}
                </button>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'round_48' ? (
                <>
                  {demoStep === 0 && 'Rounding 4.8 to the nearest whole number. Click Locate on Number Line!'}
                  {demoStep === 1 && '4.8 lies between 4 and 5. Look closely at the tenths digit: 8!'}
                  {demoStep === 2 && 'Because 8 tenths is 5 or more (past halfway), 4.8 climbs up the hill and rounds up to 5!'}
                </>
              ) : (
                <>
                  {demoStep === 0 && 'Rounding 9.3 to the nearest whole number. Click Locate on Number Line!'}
                  {demoStep === 1 && '9.3 lies between 9 and 10. Look closely at the tenths digit: 3!'}
                  {demoStep === 2 && 'Because 3 tenths is 4 or less (less than halfway), 9.3 rolls back down the hill and rounds down to 9!'}
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Rounding Decimals to the Nearest Whole Number</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Look at the tenths: 5 and above climbs up the hill, 4 and below rolls back down!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setDemoMode('round_48');
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

export default RoundingDecimalsPlayer;
