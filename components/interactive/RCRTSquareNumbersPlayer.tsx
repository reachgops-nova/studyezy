import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTSquareNumbersPlayerProps {
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
    questionText: 'What is a square number?',
    options: [
      'The product you get when you multiply a whole number by itself (like 4 × 4 = 16)',
      'Any number that ends in 0 or 5',
      'The result of adding 2 to any even number'
    ],
    correctIndex: 0,
    hint: 'Square numbers are made by multiplying a whole number by itself, forming a perfect square grid!'
  },
  {
    id: 2,
    questionText: 'How can you build the square number 9 by adding consecutive odd numbers starting from 1?',
    options: [
      '1 + 3 + 5 = 9 (the first 3 odd numbers)',
      '1 + 2 + 6 = 9',
      '2 + 4 + 3 = 9'
    ],
    correctIndex: 0,
    hint: 'Adding the first N consecutive odd numbers always equals N squared (1 + 3 + 5 = 9 = 3²)!'
  },
  {
    id: 3,
    questionText: 'Which of the following factor pairs belongs to the square number 25?',
    options: [
      '5 and 5 (an identical factor pair)',
      '10 and 2.5',
      '4 and 6'
    ],
    correctIndex: 0,
    hint: 'Square numbers always have an identical factor pair, like 5 × 5 = 25!'
  }
];

export const RCRTSquareNumbersPlayer: React.FC<RCRTSquareNumbersPlayerProps> = ({
  conceptName = 'Concept 13.1: Square Numbers',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 13)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');
  
  // Interactive Grid Builder State (e.g. 3x3 = 9)
  const [gridSize, setGridSize] = useState<number>(1);
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
          'STEP 1: READ. A square number is the product you get when you multiply a whole number by itself! For example, 3 times 3 equals 9, or 4 times 4 equals 16. You can also build square numbers by adding consecutive odd numbers starting from 1: 1 plus 3 plus 5 equals 9!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Store the square number definition and identical factor pair rule in your memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Multiply a number by itself to get a square number, or add consecutive odd numbers starting from 1!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Tap the grid expand controls to build a 3 by 3 square grid containing 9 tiles (3 x 3 = 9).'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Square Numbers with RCRT active recall and earned 3 stars!'
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

  const handleSetGridSize = (size: number) => {
    setGridSize(size);
    if (size === 3) {
      setTestCompleted(true);
      setStars((prev) => prev + 1);
      safeNarrate('Square Grid Matched! 3 times 3 equals 9 tiles (1 + 3 + 5 = 9). 9 is a square number!');
    } else {
      safeNarrate(`Grid size updated to ${size} by ${size} = ${size * size} tiles.`);
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
                  Rule: Square Numbers
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • A <strong>square number</strong> is the product of a whole number multiplied by itself (e.g. 3 × 3 = 9, 4 × 4 = 16).<br/>
                  • You can also build square numbers by adding consecutive odd numbers starting from 1 (e.g. 1 + 3 + 5 = 9 = 3²).<br/>
                  • Square numbers always have identical factor pairs (e.g. 5 and 5 for 25).
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  🔲 Example: 3 × 3 = 9 tiles | Odd sum: 1 + 3 + 5 = 9
                </div>
              </div>

              <button
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#16241f]/90"
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
                The rule card is now hidden from view. No peeking! Lock the square number rules (number multiplied by itself, odd number sums) in working memory.
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
                  "Multiply a number by itself to get a square number, or add consecutive odd numbers starting from 1!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Multiply a number by itself to get a square number, or add consecutive odd numbers starting from 1!');
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
                Ready for Step 4: Square Grid Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE SQUARE GRID CANVAS) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Square Grid Builder
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Target: Build <strong className="text-[#9c6f1f]">3 × 3 = 9</strong> Square
                </span>
              </div>

              {/* Interactive Grid Canvas */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 text-center space-y-3">
                <div className="text-xs font-bold text-[#16241f]">
                  Grid Dimension: <span className="text-[#9c6f1f] font-black">{gridSize} × {gridSize}</span> = <span className="font-black">{gridSize * gridSize} tiles</span>
                </div>

                {/* Visual Square Grid */}
                <div 
                  className="mx-auto grid gap-1.5 p-3 bg-white rounded-xl border border-[#16241f]/10 shadow-inner justify-center"
                  style={{
                    gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                    maxWidth: `${gridSize * 48 + 24}px`
                  }}
                >
                  {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 bg-[#9c6f1f] text-white font-bold text-xs rounded-lg shadow flex items-center justify-center animate-fade-in"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Grid Controls */}
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => handleSetGridSize(1)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${gridSize === 1 ? 'bg-[#16241f] text-white shadow' : 'bg-white border border-[#16241f]/20 text-[#16241f]'}`}
                  >
                    1 × 1 = 1
                  </button>
                  <button
                    onClick={() => handleSetGridSize(2)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${gridSize === 2 ? 'bg-[#16241f] text-white shadow' : 'bg-white border border-[#16241f]/20 text-[#16241f]'}`}
                  >
                    2 × 2 = 4
                  </button>
                  <button
                    onClick={() => handleSetGridSize(3)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${gridSize === 3 ? 'bg-[#9c6f1f] text-white shadow' : 'bg-white border border-[#16241f]/20 text-[#16241f]'}`}
                  >
                    3 × 3 = 9 ⭐
                  </button>
                  <button
                    onClick={() => handleSetGridSize(4)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${gridSize === 4 ? 'bg-[#16241f] text-white shadow' : 'bg-white border border-[#16241f]/20 text-[#16241f]'}`}
                  >
                    4 × 4 = 16
                  </button>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-[#16241f]/10 text-xs text-[#16241f]">
                  <strong>Odd Number Sum Check:</strong> {Array.from({ length: gridSize }).map((_, idx) => 2 * idx + 1).join(' + ')} = <strong>{gridSize * gridSize}</strong>
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Target Matched! 3 × 3 = 9 tiles (1 + 3 + 5 = 9). 9 is a square number!
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
          <div className="text-5xl">🔲⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Square Numbers!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setGridSize(1);
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

export default RCRTSquareNumbersPlayer;
