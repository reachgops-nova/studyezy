import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTComparingOrderingPlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type RCRTStep = 'READ' | 'COVER' | 'RECITE' | 'TEST';
type Phase = 'rcrt_loop' | 'checkpoint_quiz' | 'passed';

interface MixedCard {
  id: string;
  originalText: string;
  percentValue: number;
  userConvertedValue?: number;
}

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
    questionText: 'According to your RCRT recall, what is the best first step to compare mixed numbers like 0.6, 45%, and 1/2?',
    options: [
      'Convert all quantities into a common form like percentages (0.6 ➔ 60%, 45% ➔ 45%, 1/2 ➔ 50%)',
      'Compare only the first numbers you see',
      'Always assume the fraction is the smallest value'
    ],
    correctIndex: 0,
    hint: 'Remember the rule: Dress your numbers in matching clothes by turning them all into percentages first!'
  },
  {
    id: 2,
    questionText: 'When comparing 0.4 and 35%, which conversion and comparison is correct?',
    options: [
      '0.4 = 40%, and 40% is greater than 35%, so 0.4 > 35%',
      '0.4 = 4%, and 4% is smaller than 35%, so 0.4 < 35%',
      '35% = 3.5, so 35% is greater than 0.4'
    ],
    correctIndex: 0,
    hint: '0.4 is 4 tenths, which equals 40 hundredths or 40%! Since 40% > 35%, 0.4 is greater.'
  },
  {
    id: 3,
    questionText: 'Which list shows the quantities 20%, 0.7, and 1/2 ordered correctly from SMALLEST to LARGEST?',
    options: [
      '20% (20%), 1/2 (50%), 0.7 (70%)',
      '0.7 (70%), 1/2 (50%), 20% (20%)',
      '1/2 (50%), 0.7 (70%), 20% (20%)'
    ],
    correctIndex: 0,
    hint: 'Convert to percentages: 20% = 20%, 1/2 = 50%, 0.7 = 70%. From smallest to largest is 20%, 50%, 70%!'
  }
];

export const RCRTComparingOrderingPlayer: React.FC<RCRTComparingOrderingPlayerProps> = ({
  conceptName = 'Unit 11: Comparing & Ordering Quantities (Active RCRT Method)',
  unitTitle = 'Cambridge Primary Math Stage 4/5 (Read-Cover-Recite-Test Engine)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');
  const [reciteSpoken, setReciteSpoken] = useState<boolean>(false);

  // Interactive Test State
  const initialCards: MixedCard[] = [
    { id: 'c1', originalText: '0.4', percentValue: 40 },
    { id: 'c2', originalText: '35%', percentValue: 35 },
    { id: 'c3', originalText: '1/2', percentValue: 50 },
    { id: 'c4', originalText: '0.8', percentValue: 80 }
  ];

  const [cards, setCards] = useState<MixedCard[]>(initialCards);
  const [convertedCount, setConvertedCount] = useState<number>(0);
  const [sortedOrder, setSortedOrder] = useState<string[]>([]);
  const [taskCompleted, setTaskCompleted] = useState<boolean>(false);

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
          'STEP 1: READ. Look at the rule: To compare or order mixed fractions, decimals, and percentages, ALWAYS dress them in matching clothes by converting all quantities into percentages first!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule and conversion table are now covered! Lock the strategy in your mind!'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the strategy aloud: "Dress all numbers in matching clothes — convert everything to percentages before comparing!"'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Convert each card to its percentage value, then tap the cards in order from smallest to largest!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered RCRT Comparing and Ordering Mixed Quantities with 3 stars!'
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
      setCards(initialCards);
      setConvertedCount(0);
      setSortedOrder([]);
      setTaskCompleted(false);
    } else if (rcrtStep === 'TEST') {
      setPhase('checkpoint_quiz');
    }
  };

  const handleConvertCard = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, userConvertedValue: c.percentValue } : c))
    );
    setConvertedCount((prev) => prev + 1);
    safeNarrate(`Converted card to ${cards.find((c) => c.id === id)?.percentValue}%!`);
  };

  const handleSelectSortCard = (id: string) => {
    if (!sortedOrder.includes(id)) {
      const nextOrder = [...sortedOrder, id];
      setSortedOrder(nextOrder);

      if (nextOrder.length === cards.length) {
        // Verify if sorted correctly (35% -> 0.4 (40%) -> 1/2 (50%) -> 0.8 (80%))
        const values = nextOrder.map((cardId) => cards.find((c) => c.id === cardId)?.percentValue || 0);
        const isSorted = values.every((val, i, arr) => !i || arr[i - 1] <= val);

        if (isSorted) {
          setTaskCompleted(true);
          setStars((prev) => prev + 1);
          safeNarrate('🎉 Perfect! All 4 quantities arranged correctly from smallest to largest!');
        } else {
          safeNarrate('Not quite in order from smallest to largest. Click Reset Order to try again!');
        }
      }
    }
  };

  const handleResetSort = () => {
    setSortedOrder([]);
    setTaskCompleted(false);
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

      {/* RCRT Step Progress */}
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
                <span>📖 Step 1: Read & Observe the Conversion Strategy</span>
              </div>

              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10">
                <h3 className="font-bold text-base text-[#16241f] mb-1">
                  Rule: Dress Numbers in Matching Clothes!
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed mb-3">
                  To compare fractions, decimals, and percentages, convert all quantities to <strong>percentages</strong> first!
                </p>

                <div className="grid grid-cols-3 gap-2 font-bold text-xs text-center">
                  <div className="p-2 bg-white rounded-lg border border-[#16241f]/10">
                    <span className="text-[#9c6f1f] block">Decimal</span>
                    0.4 ➔ 40%
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#16241f]/10">
                    <span className="text-[#16241f] block">Fraction</span>
                    1/2 ➔ 50%
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#16241f]/10">
                    <span className="text-[#9c6f1f] block">Percent</span>
                    35% = 35%
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#16241f]/90"
              >
                I Have Read & Understood! Cover the Rule 🙈 ➔
              </button>
            </div>
          )}

          {/* STEP 2: COVER */}
          {rcrtStep === 'COVER' && (
            <div className="p-8 bg-[#16241f] text-white rounded-2xl shadow-xl text-center space-y-4 animate-shake">
              <div className="text-5xl">🙈</div>
              <h3 className="text-lg font-black text-[#9c6f1f]">Step 2: Strategy Covered!</h3>
              <p className="text-xs text-[#f4f6f1]/80 max-w-sm mx-auto leading-relaxed">
                The conversion chart is now covered. Lock the strategy in your active memory without looking back.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Strategy locked in memory...
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
                Step 3: Recite the Strategy Out Loud!
              </h3>
              <p className="text-xs text-[#16241f]/80 max-w-md mx-auto">
                Verbalizing active recall builds strong recall pathways. Say the rule out loud:
              </p>

              <div className="p-4 bg-[#f4f6f1] rounded-xl border-2 border-dashed border-[#9c6f1f]/40">
                <p className="text-sm font-black text-[#9c6f1f]">
                  "Dress numbers in matching clothes — convert everything to percentages before comparing!"
                </p>
              </div>

              <button
                onClick={() => {
                  setReciteSpoken(true);
                  safeNarrate("Dress numbers in matching clothes — convert everything to percentages before comparing!");
                }}
                className={`py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${reciteSpoken ? 'bg-emerald-600 text-white' : 'bg-[#9c6f1f] text-white shadow'}`}
              >
                {reciteSpoken ? '✅ Recited Aloud!' : '🗣️ Tap to Practice Reciting'}
              </button>

              <button
                onClick={handleNextRcrtStep}
                className="w-full py-3 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#16241f]/90"
              >
                Ready for Step 4: Active Doing Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE CONVERSION & ORDERING) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Active Doing Test
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Converted: {convertedCount}/4
                </span>
              </div>

              <p className="text-xs text-[#16241f]/80">
                1. Tap each card to convert it to its percentage value.<br />
                2. Tap the cards in order from <strong>SMALLEST to LARGEST</strong>!
              </p>

              {/* Cards Grid */}
              <div className="grid grid-cols-4 gap-2">
                {cards.map((card) => {
                  const isConverted = card.userConvertedValue !== undefined;
                  const isSorted = sortedOrder.includes(card.id);

                  return (
                    <div
                      key={card.id}
                      onClick={() => {
                        if (!isConverted) {
                          handleConvertCard(card.id);
                        } else {
                          handleSelectSortCard(card.id);
                        }
                      }}
                      className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all duration-300 ${
                        isSorted
                          ? 'bg-[#16241f] text-white border-[#16241f] scale-95 opacity-50'
                          : isConverted
                          ? 'bg-[#9c6f1f] text-white border-[#9c6f1f] shadow-md hover:scale-105'
                          : 'bg-[#f4f6f1] text-[#16241f] border-[#16241f]/20 hover:border-[#9c6f1f]'
                      }`}
                    >
                      <span className="text-xs font-mono uppercase block opacity-75">
                        {!isConverted ? 'Tap Convert' : 'Tap Order'}
                      </span>
                      <span className="text-base font-black my-1 block">
                        {card.originalText}
                      </span>
                      <span className="text-[10px] font-bold">
                        {isConverted ? `${card.userConvertedValue}%` : '???'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Sorted Sequence Display */}
              {sortedOrder.length > 0 && (
                <div className="p-3 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 text-center">
                  <span className="text-[10px] font-bold text-[#9c6f1f] uppercase tracking-wider block mb-1">
                    Your Selected Order (Smallest ➔ Largest):
                  </span>
                  <div className="flex justify-center gap-2 font-bold text-xs">
                    {sortedOrder.map((id, idx) => {
                      const c = cards.find((item) => item.id === id);
                      return (
                        <span key={id} className="px-2 py-1 bg-white border border-[#16241f]/15 rounded shadow-sm">
                          {idx + 1}. {c?.originalText} ({c?.percentValue}%)
                        </span>
                      );
                    })}
                  </div>
                  <button
                    onClick={handleResetSort}
                    className="mt-2 text-[10px] text-red-600 font-bold hover:underline"
                  >
                    🔄 Reset Order Sequence
                  </button>
                </div>
              )}

              {taskCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Perfect Recall! All 4 quantities converted & ordered correctly!
                </div>
              )}

              <button
                disabled={!taskCompleted}
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
          <div className="text-5xl">🧠⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing active conversions, Viban mastered Comparing and Ordering Mixed Quantities!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setQuizIndex(0);
              setSelectedOption(null);
              setShowHint(false);
              setCards(initialCards);
              setConvertedCount(0);
              setSortedOrder([]);
              setTaskCompleted(false);
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

export default RCRTComparingOrderingPlayer;
