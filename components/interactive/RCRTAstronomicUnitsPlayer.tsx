import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTAstronomicUnitsPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type RCRTStep = 'READ' | 'COVER' | 'RECITE' | 'TEST';
type Phase = 'rcrt_loop' | 'checkpoint_quiz' | 'passed';

interface UnitOrderItem {
  id: string;
  name: string;
  valueStr: string;
  orderIndex: number; // Correct order from smallest (1) to largest (6)
}

const ORDER_ITEMS: UnitOrderItem[] = [
  { id: '1', name: 'Fermi (f)', valueStr: '10⁻¹⁵ m', orderIndex: 1 },
  { id: '2', name: 'Angstrom (Å)', valueStr: '10⁻¹⁰ m', orderIndex: 2 },
  { id: '3', name: 'Nanometre (nm)', valueStr: '10⁻⁹ m', orderIndex: 3 },
  { id: '4', name: 'Micron (μm)', valueStr: '10⁻⁶ m', orderIndex: 4 },
  { id: '5', name: 'Astronomical Unit (AU)', valueStr: '1.496 × 10¹¹ m', orderIndex: 5 },
  { id: '6', name: 'Light Year (ly)', valueStr: '9.46 × 10¹⁵ m', orderIndex: 6 },
  { id: '7', name: 'Parsec (pc)', valueStr: '3.08 × 10¹⁶ m (3.26 ly)', orderIndex: 7 },
];

const QUIZ_QUESTIONS = [
  {
    question: 'What is the exact metre value of 1 Astronomical Unit (AU) as given in the textbook?',
    options: ['1.496 × 10¹¹ m', '9.46 × 10¹⁵ m', '3.08 × 10¹⁶ m', '1.63 × 10¹⁰ m'],
    correctIndex: 0,
    hint: 'Hint: 1 AU is the mean distance of the centre of the Sun from the centre of the Earth, equal to 1.496 × 10¹¹ m.'
  },
  {
    question: 'How many light years are equivalent to 1 Parsec (pc)?',
    options: ['1.496 light years', '3.26 light years', '10 light years', '500 light years'],
    correctIndex: 1,
    hint: 'Hint: Parsec is used to measure astronomical objects outside the solar system. 1 Parsec = 3.26 light years.'
  },
  {
    question: 'Which smaller unit of length is equal to 10⁻¹⁰ m?',
    options: ['Fermi', 'Micron', 'Angstrom', 'Nanometre'],
    correctIndex: 2,
    hint: 'Hint: 1 Angstrom (Å) = 10⁻¹⁰ m, whereas Fermi = 10⁻¹⁵ m, Nanometre = 10⁻⁹ m, and Micron = 10⁻⁶ m.'
  }
];

export const RCRTAstronomicUnitsPlayer: React.FC<RCRTAstronomicUnitsPlayerProps> = ({
  conceptName = "1.2 Astronomical & Microscopic Units of Length",
  unitTitle = "Unit 1: Measurement (Pages 3-4)",
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [step, setStep] = useState<RCRTStep>('READ');
  const [phase, setPhase] = useState<Phase>('rcrt_loop');

  // TEST state: Ordering units
  const [userOrder, setUserOrder] = useState<UnitOrderItem[]>([]);
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);
  const [isOrderCorrect, setIsOrderCorrect] = useState<boolean>(false);

  // Checkpoint Quiz State
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  useEffect(() => {
    // Shuffle initial order for ordering test
    const shuffled = [...ORDER_ITEMS].sort(() => Math.random() - 0.5);
    setUserOrder(shuffled);
  }, []);

  const safeNarrate = useCallback((text: string) => {
    if (onNarrate) {
      onNarrate(text);
    }
  }, [onNarrate]);

  const conceptRuleText = `Astronomical units measure vast space distances: 1 Astronomical Unit (AU) is the mean Sun-Earth distance, equal to 1.496 times 10 to the 11th power metres. 1 Light Year is the distance light travels in one year, equal to 9.46 times 10 to the 15th power metres. 1 Parsec equals 3.26 light years or 3.08 times 10 to the 16th power metres. Microscopic submultiples include Fermi (10 to the -15 metres), Angstrom (10 to the -10 metres), Nanometre (10 to the -9 metres), and Micron (10 to the -6 metres).`;

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...userOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setUserOrder(newOrder);
  };

  const handleVerifyOrder = () => {
    const correct = userOrder.every((item, idx) => item.orderIndex === idx + 1);
    setIsOrderCorrect(correct);
    setTestSubmitted(true);
    if (onAttempt) {
      onAttempt(correct);
    }
  };

  const handleQuizAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === QUIZ_QUESTIONS[currentQIndex].correctIndex;
    if (onAttempt) {
      onAttempt(isCorrect);
    }

    if (isCorrect) {
      setShowHint(false);
      setQuizScore(prev => prev + 1);
    } else {
      setShowHint(true);
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowHint(false);
    } else {
      setPhase('passed');
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const handleReplay = () => {
    setStep('READ');
    setPhase('rcrt_loop');
    setUserOrder([...ORDER_ITEMS].sort(() => Math.random() - 0.5));
    setTestSubmitted(false);
    setIsOrderCorrect(false);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowHint(false);
    setQuizScore(0);
  };

  return (
    <div className="max-w-2xl mx-auto my-6 p-6 bg-[#f4f6f1] text-[#16241f] rounded-2xl shadow-md border border-[#9c6f1f]/20 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#9c6f1f]/20">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9c6f1f]">
            {unitTitle}
          </span>
          <h2 className="text-xl font-bold text-[#16241f]">{conceptName}</h2>
        </div>
        <div className="flex items-center gap-1 bg-[#9c6f1f]/10 text-[#9c6f1f] px-3 py-1 rounded-full text-xs font-bold">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>{quizScore} Stars</span>
        </div>
      </div>

      {phase === 'rcrt_loop' && (
        <div>
          {/* Step Indicator */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {(['READ', 'COVER', 'RECITE', 'TEST'] as RCRTStep[]).map((s, idx) => (
              <div
                key={s}
                className={`py-2 text-center text-xs font-bold rounded-lg transition-all ${
                  step === s
                    ? 'bg-[#9c6f1f] text-white shadow-sm'
                    : 'bg-white/60 text-[#16241f]/60 border border-[#9c6f1f]/10'
                }`}
              >
                {idx + 1}. {s}
              </div>
            ))}
          </div>

          {/* STEP 1: READ */}
          {step === 'READ' && (
            <div className="bg-white p-6 rounded-xl border border-[#9c6f1f]/20 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#16241f] flex items-center gap-2">
                <span>📖</span> Step 1: Astronomical & Microscopic Units
              </h3>
              <div className="space-y-3 text-sm leading-relaxed text-[#16241f]">
                <div className="p-3 bg-[#f4f6f1] rounded-lg border-l-4 border-[#9c6f1f]">
                  <p className="font-bold text-[#9c6f1f] mb-1">Larger (Astronomical) Units:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• <strong>Astronomical Unit (AU):</strong> Mean Sun-Earth distance = 1.496 × 10¹¹ m</li>
                    <li>• <strong>Light Year (ly):</strong> Distance light travels in 1 year = 9.46 × 10¹⁵ m</li>
                    <li>• <strong>Parsec (pc):</strong> Unit for objects outside solar system = 3.26 ly = 3.08 × 10¹⁶ m</li>
                  </ul>
                </div>
                <div className="p-3 bg-[#f4f6f1] rounded-lg border-l-4 border-[#16241f]">
                  <p className="font-bold text-[#16241f] mb-1">Smaller (Microscopic) Units:</p>
                  <ul className="grid grid-cols-2 gap-1 text-xs">
                    <li>• Fermi (f) = 10⁻¹⁵ m</li>
                    <li>• Angstrom (Å) = 10⁻¹⁰ m</li>
                    <li>• Nanometre (nm) = 10⁻⁹ m</li>
                    <li>• Micron (μm) = 10⁻⁶ m</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setStep('COVER')}
                className="w-full py-3 bg-[#9c6f1f] hover:bg-[#835c18] text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to STEP 2: COVER</span>
                <span>🔒</span>
              </button>
            </div>
          )}

          {/* STEP 2: COVER */}
          {step === 'COVER' && (
            <div className="bg-[#16241f] p-8 rounded-xl text-white text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 mx-auto bg-[#9c6f1f]/20 text-[#9c6f1f] rounded-full flex items-center justify-center text-3xl">
                🔒
              </div>
              <h3 className="text-xl font-bold text-white">Content Covered for Active Recall</h3>
              <p className="text-xs text-[#f4f6f1]/80 max-w-md mx-auto">
                The unit values are hidden. Test your memory on AU, Light Year, Parsec, Angstrom, and Fermi scale values.
              </p>
              <button
                onClick={() => setStep('RECITE')}
                className="px-6 py-3 bg-[#9c6f1f] hover:bg-[#835c18] text-white font-bold rounded-xl transition-all shadow"
              >
                Next: STEP 3 (RECITE) 🗣️
              </button>
            </div>
          )}

          {/* STEP 3: RECITE */}
          {step === 'RECITE' && (
            <div className="bg-white p-6 rounded-xl border border-[#9c6f1f]/20 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-[#16241f]">
                🗣️ Step 3: Recite Key Values
              </h3>
              <p className="text-sm text-[#16241f]/80">
                Tap below to listen to the formula values, then practice reciting them out loud.
              </p>
              <button
                onClick={() => safeNarrate(conceptRuleText)}
                className="w-full py-3 bg-[#9c6f1f]/10 border-2 border-[#9c6f1f] text-[#9c6f1f] hover:bg-[#9c6f1f] hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>🔊 Tap to Practice Reciting Rule</span>
              </button>

              <div className="p-4 bg-[#f4f6f1] rounded-xl text-xs space-y-2 text-[#16241f]">
                <p className="font-bold text-[#9c6f1f]">Active Memory Check:</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#9c6f1f]" />
                  <span>1 AU = 1.496 × 10¹¹ m</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#9c6f1f]" />
                  <span>1 ly = 9.46 × 10¹⁵ m and 1 Parsec = 3.26 ly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#9c6f1f]" />
                  <span>Fermi = 10⁻¹⁵ m &amp; Angstrom = 10⁻¹⁰ m</span>
                </label>
              </div>

              <button
                onClick={() => setStep('TEST')}
                className="w-full py-3 bg-[#9c6f1f] hover:bg-[#835c18] text-white font-bold rounded-xl transition-all shadow"
              >
                Proceed to STEP 4: HANDS-ON TEST ✍️
              </button>
            </div>
          )}

          {/* STEP 4: TEST */}
          {step === 'TEST' && (
            <div className="bg-white p-6 rounded-xl border border-[#9c6f1f]/20 shadow-sm space-y-5">
              <div>
                <h3 className="text-lg font-bold text-[#16241f]">
                  ✍️ Step 4: Scale Ordering Task
                </h3>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Arrange these length units from <strong>SMALLEST (top)</strong> to <strong>LARGEST (bottom)</strong> using the up/down arrows.
                </p>
              </div>

              <div className="space-y-2">
                {userOrder.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-[#f4f6f1] rounded-xl border border-[#9c6f1f]/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-[#9c6f1f]/20 text-[#9c6f1f] font-bold text-xs rounded-full flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-sm text-[#16241f]">{item.name}</span>
                        <span className="ml-2 text-xs text-[#16241f]/60 font-mono">({item.valueStr})</span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        disabled={idx === 0 || testSubmitted}
                        onClick={() => moveItem(idx, 'up')}
                        className="p-1.5 bg-white hover:bg-gray-100 disabled:opacity-30 rounded border text-xs font-bold"
                      >
                        ▲
                      </button>
                      <button
                        disabled={idx === userOrder.length - 1 || testSubmitted}
                        onClick={() => moveItem(idx, 'down')}
                        className="p-1.5 bg-white hover:bg-gray-100 disabled:opacity-30 rounded border text-xs font-bold"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {!testSubmitted ? (
                <button
                  onClick={handleVerifyOrder}
                  className="w-full py-3 bg-[#9c6f1f] hover:bg-[#835c18] text-white font-bold rounded-xl transition-all shadow"
                >
                  Verify Scale Order
                </button>
              ) : (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-xl border text-center font-bold text-sm ${
                      isOrderCorrect
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {isOrderCorrect
                      ? 'Correct Scale Order! Perfect!'
                      : 'Not quite in exact order yet! Check the exponent values (Fermi 10⁻¹⁵ < Å 10⁻¹⁰ < nm 10⁻⁹ < μm 10⁻⁶ < AU 10¹¹ < ly 10¹⁵ < pc 10¹⁶).'}
                  </div>
                  <button
                    onClick={() => setPhase('checkpoint_quiz')}
                    className="w-full py-3 bg-[#16241f] hover:bg-[#253930] text-white font-bold rounded-xl transition-all shadow flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkpoint Quiz</span>
                    <span>➔</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Checkpoint Quiz Phase */}
      {phase === 'checkpoint_quiz' && (
        <div className="bg-white p-6 rounded-xl border border-[#9c6f1f]/20 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
              Checkpoint Quiz — Q{currentQIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-xs text-[#16241f]/60 font-semibold">
              Textbook Grounded
            </span>
          </div>

          <h3 className="text-base font-bold text-[#16241f]">
            {QUIZ_QUESTIONS[currentQIndex].question}
          </h3>

          <div className="space-y-2">
            {QUIZ_QUESTIONS[currentQIndex].options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === QUIZ_QUESTIONS[currentQIndex].correctIndex;
              let btnStyle = "bg-[#f4f6f1] text-[#16241f] border-transparent hover:border-[#9c6f1f]/40";

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = "bg-green-100 text-green-900 border-green-400 font-bold";
                } else if (isSelected) {
                  btnStyle = "bg-red-100 text-red-900 border-red-400";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedOption !== null}
                  onClick={() => handleQuizAnswer(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all ${btnStyle}`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {showHint && (
            <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs space-y-1">
              <span className="font-bold">💡 Textbook Hint:</span>
              <p>{QUIZ_QUESTIONS[currentQIndex].hint}</p>
            </div>
          )}

          {selectedOption !== null && (
            <button
              onClick={handleNextQuizQuestion}
              className="w-full py-3 bg-[#9c6f1f] hover:bg-[#835c18] text-white font-bold rounded-xl transition-all shadow"
            >
              {currentQIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question ➔' : 'Complete Quiz 🏆'}
            </button>
          )}
        </div>
      )}

      {/* Passed Phase */}
      {phase === 'passed' && (
        <div className="bg-white p-8 rounded-xl border border-[#9c6f1f]/20 text-center space-y-5 shadow-sm">
          <div className="w-20 h-20 mx-auto bg-[#9c6f1f]/10 rounded-full flex items-center justify-center text-4xl">
            🌌
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#16241f]">Scale Mastered!</h3>
            <p className="text-sm text-[#16241f]/70 mt-1">
              You completed RCRT Active Recall for <strong>{conceptName}</strong>.
            </p>
          </div>

          <div className="p-4 bg-[#f4f6f1] rounded-xl inline-block px-8 border border-[#9c6f1f]/20">
            <span className="text-xs text-[#9c6f1f] font-bold uppercase tracking-wider block mb-1">
              Quiz Score
            </span>
            <span className="text-3xl font-black text-[#16241f]">
              {quizScore} / {QUIZ_QUESTIONS.length} Stars
            </span>
          </div>

          <div>
            <button
              onClick={handleReplay}
              className="px-6 py-3 bg-[#9c6f1f] hover:bg-[#835c18] text-white font-bold rounded-xl transition-all shadow"
            >
              Replay RCRT Active Loop 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RCRTAstronomicUnitsPlayer;
