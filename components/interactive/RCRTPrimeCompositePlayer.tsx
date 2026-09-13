import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTPrimeCompositePlayerProps {
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
    questionText: 'What is the definition of a prime number?',
    options: [
      'A whole number greater than 1 that has exactly two factors: 1 and itself',
      'Any odd number',
      'A number that ends in 1 or 3'
    ],
    correctIndex: 0,
    hint: 'Prime numbers have ONLY 2 factors (1 and the number itself). For example, 7 is prime because 1 × 7 = 7!'
  },
  {
    id: 2,
    questionText: 'Why is the number 1 neither prime nor composite?',
    options: [
      'Because 1 has only ONE factor (itself), whereas primes must have 2 factors and composites 3 or more',
      'Because 1 is an even number',
      'Because 1 is too small to be counted'
    ],
    correctIndex: 0,
    hint: '1 has only 1 divisor (1), so it cannot meet the 2-factor prime rule or 3+-factor composite rule!'
  },
  {
    id: 3,
    questionText: 'Which of the following is a composite number?',
    options: [
      '9 — because its factors are 1, 3, and 9 (3 factors total)',
      '7 — because its factors are 1 and 7',
      '2 — because its factors are 1 and 2'
    ],
    correctIndex: 0,
    hint: 'Composite means composed of many factors! 9 has 3 factors (1, 3, 9), making it composite.'
  }
];

export const RCRTPrimeCompositePlayer: React.FC<RCRTPrimeCompositePlayerProps> = ({
  conceptName = 'Concept 13.4: Prime and Composite Numbers',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 13)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');
  
  // Interactive Factor Array Builder State (e.g., test 7 vs 9)
  const [testNumber, setTestNumber] = useState<number>(7);
  const [userChoice, setUserChoice] = useState<'prime' | 'composite' | null>(null);
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
          'STEP 1: READ. A prime number is a whole number greater than 1 with exactly two factors: 1 and itself (like 7, where 1 x 7 = 7). A composite number has three or more factors (like 9, with factors 1, 3, 9). The number 1 is neither prime nor composite, and 2 is the only even prime number!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Store the prime (only 2 factors) vs composite (3 or more factors) distinction in working memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Prime means exactly two factors; composite means composed of many factors!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Inspect the factors of 7 (1 and 7) and 9 (1, 3, and 9) and classify them as prime or composite!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Prime and Composite Numbers with RCRT active recall and earned 3 stars!'
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

  const handleClassify = (choice: 'prime' | 'composite') => {
    setUserChoice(choice);
    if (testNumber === 7 && choice === 'prime') {
      setTestCompleted(true);
      setStars((prev) => prev + 1);
      safeNarrate('Classification Correct! 7 has only two factors (1 and 7), so 7 is a PRIME number!');
    } else if (testNumber === 9 && choice === 'composite') {
      setTestCompleted(true);
      setStars((prev) => prev + 1);
      safeNarrate('Classification Correct! 9 has three factors (1, 3, 9), so 9 is a COMPOSITE number!');
    } else {
      safeNarrate('Try again! Check how many factors the number has.');
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
                  Rule: Prime vs. Composite Numbers
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Prime Number:</strong> A whole number &gt; 1 that has <em>exactly two factors</em>: 1 and itself (e.g. 7 ➔ factors 1, 7).<br/>
                  • <strong>Composite Number:</strong> A number that has <em>three or more factors</em> (e.g. 9 ➔ factors 1, 3, 9).<br/>
                  • <strong>Special Rules:</strong> 1 is <em>neither</em> prime nor composite (only 1 factor). 2 is the <em>only even prime number</em>!
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  👑 Prime = 2 Factors Only | 🧱 Composite = 3+ Factors | 1 = Neither
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
                The rule card is now hidden from view. No peeking! Lock the prime (only 2 factors) vs composite (3+ factors) definitions in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Definitions stored in memory...
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
                  "Prime means exactly two factors; composite means composed of many factors!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Prime means exactly two factors; composite means composed of many factors!');
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
                Ready for Step 4: Factor Classifier Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE FACTOR CLASSIFIER CANVAS) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Factor Classifier Canvas
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Number to Test: <strong className="text-[#9c6f1f] text-base">{testNumber}</strong>
                </span>
              </div>

              {/* Number Switcher & Factor Display */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 text-center space-y-3">
                <div className="flex justify-center gap-2 mb-2">
                  <button
                    onClick={() => { setTestNumber(7); setUserChoice(null); setTestCompleted(false); }}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${testNumber === 7 ? 'bg-[#9c6f1f] text-white shadow' : 'bg-white border text-[#16241f]'}`}
                  >
                    Test Number 7
                  </button>
                  <button
                    onClick={() => { setTestNumber(9); setUserChoice(null); setTestCompleted(false); }}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${testNumber === 9 ? 'bg-[#9c6f1f] text-white shadow' : 'bg-white border text-[#16241f]'}`}
                  >
                    Test Number 9
                  </button>
                </div>

                {/* Factors list */}
                <div className="p-3 bg-white rounded-lg border border-[#16241f]/10">
                  <span className="text-[10px] uppercase font-bold text-[#16241f]/60 block mb-1">
                    Factor Inspection for Number {testNumber}:
                  </span>
                  {testNumber === 7 ? (
                    <div className="text-sm font-black text-[#16241f]">
                      Factors of 7: <span className="text-[#9c6f1f]">1 and 7</span> (2 factors total)
                    </div>
                  ) : (
                    <div className="text-sm font-black text-[#16241f]">
                      Factors of 9: <span className="text-[#9c6f1f]">1, 3, and 9</span> (3 factors total)
                    </div>
                  )}
                </div>

                <div className="text-xs font-bold text-[#16241f]">
                  Is {testNumber} a PRIME number or a COMPOSITE number?
                </div>

                {/* Classification Buttons */}
                <div className="flex justify-center gap-3 pt-1">
                  <button
                    onClick={() => handleClassify('prime')}
                    className={`py-2.5 px-5 rounded-xl font-black text-xs transition-all ${userChoice === 'prime' ? 'bg-[#16241f] text-white shadow-md' : 'bg-amber-100 border border-amber-300 text-amber-900'}`}
                  >
                    👑 PRIME (2 Factors)
                  </button>
                  <button
                    onClick={() => handleClassify('composite')}
                    className={`py-2.5 px-5 rounded-xl font-black text-xs transition-all ${userChoice === 'composite' ? 'bg-[#16241f] text-white shadow-md' : 'bg-blue-100 border border-blue-300 text-blue-900'}`}
                  >
                    🧱 COMPOSITE (3+ Factors)
                  </button>
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Classification Correct! {testNumber} has been correctly classified!
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
          <div className="text-5xl">👑⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Prime and Composite Numbers!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setTestNumber(7);
              setUserChoice(null);
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

export default RCRTPrimeCompositePlayer;
