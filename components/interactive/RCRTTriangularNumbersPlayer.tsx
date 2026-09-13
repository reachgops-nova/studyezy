import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTTriangularNumbersPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type RCRTStep = 'READ' | 'COVER' | 'RECITE' | 'TEST';
type Phase = 'rcrt_loop' | 'checkpoint_quiz' | 'passed';

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
    questionText: 'How do you generate triangular numbers?',
    options: [
      'By adding consecutive whole numbers starting from 1 (1, 1+2=3, 1+2+3=6, 1+2+3+4=10)',
      'By multiplying consecutive odd numbers together',
      'By doubling each previous number'
    ],
    correctIndex: 0,
    hint: 'Triangular numbers are built row-by-row like bowling pins: 1, 1+2=3, 1+2+3=6, 1+2+3+4=10!'
  },
  {
    id: 2,
    questionText: 'What magic pattern occurs when you add any TWO consecutive triangular numbers together (like 3 and 6)?',
    options: [
      'You get a square number! (3 + 6 = 9 = 3²)',
      'You get another prime number',
      'You always get an odd number'
    ],
    correctIndex: 0,
    hint: 'Adding two consecutive triangular numbers like 3 and 6 always yields a square number like 9!'
  },
  {
    id: 3,
    questionText: 'What is the 4th triangular number?',
    options: [
      '10 (1 + 2 + 3 + 4 = 10)',
      '12',
      '8'
    ],
    correctIndex: 0,
    hint: 'Add 1 + 2 + 3 + 4 to get 10 bowling pins!'
  }
];

export const RCRTTriangularNumbersPlayer: React.FC<RCRTTriangularNumbersPlayerProps> = ({
  conceptName = 'Concept 13.2: Triangular Numbers',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 13)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');
  
  // Interactive Bowling Pin Triangle Builder State
  const [rowsCount, setRowsCount] = useState<number>(1);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [reciteSpoken, setReciteSpoken] = useState<boolean>(false);

  // Quiz state
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
    if (phase === 'rcrt_loop') {
      if (rcrtStep === 'READ') {
        safeNarrate(
          'STEP 1: READ. Triangular numbers are numbers of dots or blocks that can be arranged into an equilateral triangle! You find them by adding consecutive whole numbers starting from 1: 1, 3, 6, 10. Adding two consecutive triangular numbers like 3 and 6 gives a square number, 9!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Store the triangular number row addition rule in your working memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Add consecutive whole numbers starting from 1 to make triangular numbers like 1, 3, 6, 10!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Tap the row controls to build a 3-row triangular bowling pin pattern containing 6 dots (1 + 2 + 3 = 6).'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Triangular Numbers with RCRT active recall and earned 3 stars!'
      );
    }
  }, [phase, rcrtStep, quizIndex, safeNarrate]);

  const handleNextRcrtStep = () => {
    if (rcrtStep === 'READ') {
      setRcrtStep('COVER');
    } else if (rcrtStep === 'COVER') {
      setRcrtStep('RECITE');
    } else if (rcrtStep === 'RECITE') {
      setRcrtStep('TEST');
    } else if (rcrtStep === 'TEST') {
      setPhase('checkpoint_quiz');
    }
  };

  const handleSetRows = (rows: number) => {
    setRowsCount(rows);
    const totalDots = (rows * (rows + 1)) / 2;
    if (rows === 3) {
      setTestCompleted(true);
      setStars((prev) => prev + 1);
      safeNarrate('Triangular Pattern Matched! 1 + 2 + 3 = 6 dots. 6 is the 3rd triangular number! Adding 3 + 6 = 9 (a square number)!');
    } else {
      safeNarrate(`Triangle updated to ${rows} rows containing ${totalDots} dots.`);
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

  const calcTotalDots = (r: number) => (r * (r + 1)) / 2;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-[#f4f6f1] text-[#16241f] rounded-2xl shadow-md border-2 border-[#16241f]/10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#16241f]/10">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-[#9c6f1f] bg-[#9c6f1f]/10 px-2.5 py-0.5 rounded-full border border-[#9c6f1f]/20">
            🧠 RCRT Active Recall Loop
          </span>
          <h2 className="text-lg font-bold text-[#16241f] mt-1">{conceptName}</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#9c6f1f]/10 rounded-full border border-[#9c6f1f]/30">
          <span className="text-base">⭐</span>
          <span className="text-xs font-black text-[#9c6f1f]">{stars} Stars</span>
        </div>
      </div>

      {/* RCRT 4-Step Progress Indicator */}
      {phase === 'rcrt_loop' && (
        <div className="grid grid-cols-4 gap-2 mb-6 text-center">
          <div className={`p-2 rounded-xl border-2 font-bold text-xs transition-all ${rcrtStep === 'READ' ? 'bg-[#16241f] text-white border-[#16241f] shadow-md scale-105' : 'bg-white text-[#16241f]/40 border-[#16241f]/15'}`}>
            1️⃣ READ
          </div>
          <div className={`p-2 rounded-xl border-2 font-bold text-xs transition-all ${rcrtStep === 'COVER' ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md scale-105' : 'bg-white text-[#16241f]/40 border-[#16241f]/15'}`}>
            2️⃣ COVER
          </div>
          <div className={`p-2 rounded-xl border-2 font-bold text-xs transition-all ${rcrtStep === 'RECITE' ? 'bg-[#16241f] text-white border-[#16241f] shadow-md scale-105' : 'bg-white text-[#16241f]/40 border-[#16241f]/15'}`}>
            3️⃣ RECITE
          </div>
          <div className={`p-2 rounded-xl border-2 font-bold text-xs transition-all ${rcrtStep === 'TEST' ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md scale-105' : 'bg-white text-[#16241f]/40 border-[#16241f]/15'}`}>
            4️⃣ TEST
          </div>
        </div>
      )}

      {/* Phase: RCRT Loop */}
      {phase === 'rcrt_loop' && (
        <div className="space-y-5 animate-fade-in">
          {/* STEP 1: READ */}
          {rcrtStep === 'READ' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#9c6f1f] font-bold text-xs uppercase tracking-wider">
                <span>📖 Step 1: Read & Observe the Rule</span>
              </div>
              
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10">
                <h3 className="font-bold text-base text-[#16241f] mb-1">
                  Rule: Triangular Numbers
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Triangular numbers</strong> are numbers of items that form an equilateral triangle array (like bowling pins).<br/>
                  • Generated by adding consecutive whole numbers starting from 1: <strong>1, 3, 6, 10, 15...</strong><br/>
                  • <strong>Magic Rule:</strong> Adding two consecutive triangular numbers yields a square number (e.g. 3 + 6 = 9).
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                   bowling Pins: Row 1 (1) + Row 2 (2) + Row 3 (3) = 6 dots | 3 + 6 = 9 (Square)
                </div>
              </div>

              <button
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#16241f]/90"
              >
                I Have Read & Understood! Now Cover the Rule 🙈 ➔
              </button>
            </div>
          )}

          {/* STEP 2: COVER */}
          {rcrtStep === 'COVER' && (
            <div className="p-8 bg-[#16241f] text-white rounded-2xl shadow-xl text-center space-y-4 animate-shake">
              <div className="text-5xl">🙈</div>
              <h3 className="text-lg font-black text-[#9c6f1f]">Step 2: Rule Covered!</h3>
              <p className="text-xs text-[#f4f6f1]/80 max-w-sm mx-auto leading-relaxed">
                The rule card is now hidden from view. No peeking! Lock the triangular number row addition rule in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Formula stored in memory...
              </div>
              <button
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#9c6f1f]/90"
              >
                Proceed to Step 3: Recite Aloud 🎙️ ➔
              </button>
            </div>
          )}

          {/* STEP 3: RECITE */}
          {rcrtStep === 'RECITE' && (
            <div className="p-6 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm text-center space-y-5">
              <div className="text-4xl">🎙️</div>
              <h3 className="text-base font-bold text-[#16241f]">
                Step 3: Recite the Rule Out Loud!
              </h3>
              <p className="text-xs text-[#16241f]/80 max-w-md mx-auto">
                Verbalizing concepts locks them into long-term memory. Say this rule out loud to your parent or partner right now:
              </p>

              <div className="p-4 bg-[#f4f6f1] rounded-xl border-2 border-dashed border-[#9c6f1f]/40">
                <p className="text-sm font-black text-[#9c6f1f]">
                  "Add consecutive whole numbers starting from 1 to make triangular numbers: 1, 3, 6, 10!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Add consecutive whole numbers starting from 1 to make triangular numbers: 1, 3, 6, 10!');
                  }}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${reciteSpoken ? 'bg-emerald-600 text-white' : 'bg-[#9c6f1f] text-white shadow'}`}
                >
                  {reciteSpoken ? '✅ Recited Aloud!' : '🗣️ Tap to Practice Reciting'}
                </button>
              </div>

              <button
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#16241f]/90"
              >
                Ready for Step 4: Triangle Builder Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE TRIANGLE BUILDER CANVAS) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Triangular Pin Builder
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Target: Build <strong className="text-[#9c6f1f]">3-Row Triangle = 6 Dots</strong>
                </span>
              </div>

              {/* Interactive Triangle Canvas */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 text-center space-y-3">
                <div className="text-xs font-bold text-[#16241f]">
                  Rows: <span className="text-[#9c6f1f] font-black">{rowsCount}</span> | Total Dots: <span className="font-black">{calcTotalDots(rowsCount)}</span>
                </div>

                {/* Visual Bowling Pin Triangle */}
                <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-inner space-y-2 flex flex-col items-center">
                  {Array.from({ length: rowsCount }).map((_, rIdx) => (
                    <div key={rIdx} className="flex gap-2 justify-center">
                      {Array.from({ length: rIdx + 1 }).map((_, cIdx) => (
                        <div
                          key={cIdx}
                          className="w-8 h-8 bg-[#9c6f1f] text-white font-bold text-xs rounded-full shadow flex items-center justify-center animate-bounce"
                        >
                          🎳
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Row Selector Controls */}
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => handleSetRows(1)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${rowsCount === 1 ? 'bg-[#16241f] text-white shadow' : 'bg-white border border-[#16241f]/20 text-[#16241f]'}`}
                  >
                    1 Row (1 dot)
                  </button>
                  <button
                    onClick={() => handleSetRows(2)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${rowsCount === 2 ? 'bg-[#16241f] text-white shadow' : 'bg-white border border-[#16241f]/20 text-[#16241f]'}`}
                  >
                    2 Rows (3 dots)
                  </button>
                  <button
                    onClick={() => handleSetRows(3)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${rowsCount === 3 ? 'bg-[#9c6f1f] text-white shadow' : 'bg-white border border-[#16241f]/20 text-[#16241f]'}`}
                  >
                    3 Rows (6 dots) ⭐
                  </button>
                  <button
                    onClick={() => handleSetRows(4)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${rowsCount === 4 ? 'bg-[#16241f] text-white shadow' : 'bg-white border border-[#16241f]/20 text-[#16241f]'}`}
                  >
                    4 Rows (10 dots)
                  </button>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-[#16241f]/10 text-xs text-[#16241f]">
                  <strong>Consecutive Addition:</strong> {Array.from({ length: rowsCount }).map((_, idx) => idx + 1).join(' + ')} = <strong>{calcTotalDots(rowsCount)}</strong>
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Target Matched! 1 + 2 + 3 = 6 dots. 6 is a triangular number!
                </div>
              )}

              <button
                disabled={!testCompleted}
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow disabled:opacity-40 hover:bg-[#16241f]/90"
              >
                Proceed to Checkpoint Quiz ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* Phase: Checkpoint Quiz */}
      {phase === 'checkpoint_quiz' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f]">
              Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <div className="flex gap-1">
              {QUIZ_QUESTIONS.map((_, idx) => (
                <div key={idx} className={`w-2.5 h-2.5 rounded-full ${idx === quizIndex ? 'bg-[#9c6f1f]' : idx < quizIndex ? 'bg-[#16241f]' : 'bg-[#16241f]/20'}`} />
              ))}
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm">
            <h3 className="text-base font-bold text-[#16241f]">{QUIZ_QUESTIONS[quizIndex].questionText}</h3>
          </div>

          <div className="space-y-2.5">
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
                  className={`w-full p-3.5 text-left font-semibold text-xs rounded-xl border-2 transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {isSelected && isCorrectIndex && <span>✨ Correct!</span>}
                </button>
              );
            })}
          </div>

          {showHint && (
            <div className="p-3.5 bg-[#9c6f1f]/10 rounded-xl border border-[#9c6f1f]/30 text-xs text-[#16241f] animate-fade-in">
              <span className="font-bold text-[#9c6f1f] block mb-0.5">💡 RCRT Hint:</span>
              {QUIZ_QUESTIONS[quizIndex].hint}
            </div>
          )}
        </div>
      )}

      {/* Phase: Passed */}
      {phase === 'passed' && (
        <div className="text-center py-8 space-y-5 animate-fade-in">
          <div className="text-5xl">📐⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Triangular Numbers!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setRowsCount(1);
              setTestCompleted(false);
              setQuizIndex(0);
              setSelectedOption(null);
              setShowHint(false);
            }}
            className="py-3 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#16241f]/90"
          >
            🔄 Replay RCRT Active Loop
          </button>
        </div>
      )}
    </div>
  );
};

export default RCRTTriangularNumbersPlayer;
