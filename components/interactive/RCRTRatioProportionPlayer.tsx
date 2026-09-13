import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTRatioProportionPlayerProps {
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
    questionText: 'What is the main mathematical difference between a ratio and a proportion?',
    options: [
      'Ratio compares part-to-part with a colon (:), while proportion compares part-to-whole as a fraction or percentage',
      'Ratio only works with money, while proportion works with time',
      'Ratio always equals 100%'
    ],
    correctIndex: 0,
    hint: 'Think of Ezy\'s memory rule: Ratio is part-to-part with a colon; proportion is part-to-whole!'
  },
  {
    id: 2,
    questionText: 'In a pattern with 2 red tiles and 3 blue tiles (5 total tiles), what is the ratio of red to blue tiles?',
    options: [
      '2 : 3 — meaning 2 red tiles for every 3 blue tiles',
      '2 : 5 — comparing red to total',
      '3 : 2 — reversing the colors'
    ],
    correctIndex: 0,
    hint: 'Ratio compares part-to-part directly! Order matters: red to blue is written 2 : 3.'
  },
  {
    id: 3,
    questionText: 'In that same pattern of 2 red tiles out of 5 total tiles, what is the proportion of red tiles as a fraction and percentage?',
    options: [
      '2/5 which equals 40%',
      '2/3 which equals 66%',
      '3/5 which equals 60%'
    ],
    correctIndex: 0,
    hint: 'Proportion is part-to-whole: 2 red out of 5 total tiles is 2/5, which scales to 40/100 or 40%!'
  }
];

export const RCRTRatioProportionPlayer: React.FC<RCRTRatioProportionPlayerProps> = ({
  conceptName = 'Concept 11.5: Ratio and Proportion',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 11)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');
  
  // Interactive Tile Pattern State (Target: 2 Red, 3 Blue)
  const [redTiles, setRedTiles] = useState<number>(0);
  const [blueTiles, setBlueTiles] = useState<number>(0);
  const [proportionConfirmed, setProportionConfirmed] = useState<boolean>(false);
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
          'STEP 1: READ. Ratio directly compares one part to another part using a colon, like 2 red to 3 blue written 2:3. Proportion compares a specific part to the entire whole, like 2 red out of 5 total tiles, which is 2/5 or 40%!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Store the distinction between part-to-part ratio and part-to-whole proportion in your working memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Ratio compares part-to-part with a colon; proportion compares part-to-whole!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Tap to build a tile pattern of 2 red and 3 blue tiles (5 total), then confirm the ratio and proportion!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Ratio and Proportion with RCRT active recall and earned 3 stars!'
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

  const handleAddRed = () => {
    if (redTiles < 4) {
      const updated = redTiles + 1;
      setRedTiles(updated);
      safeNarrate(`Added Red tile. Red: ${updated}, Blue: ${blueTiles}`);
    }
  };

  const handleAddBlue = () => {
    if (blueTiles < 4) {
      const updated = blueTiles + 1;
      setBlueTiles(updated);
      safeNarrate(`Added Blue tile. Red: ${redTiles}, Blue: ${updated}`);
    }
  };

  const handleResetTiles = () => {
    setRedTiles(0);
    setBlueTiles(0);
    setProportionConfirmed(false);
    setTestCompleted(false);
  };

  const isTargetPattern = redTiles === 2 && blueTiles === 3;

  const handleConfirmProportion = () => {
    if (isTargetPattern) {
      setProportionConfirmed(true);
      setTestCompleted(true);
      setStars((prev) => prev + 1);
      safeNarrate('Proportion Confirmed! 2 red tiles out of 5 total equals 2/5, which is 40%! Excellent active recall!');
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
                  Rule: Ratio vs. Proportion
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Ratio (Part-to-Part):</strong> Compares one group directly to another group using a colon (<strong>:</strong>). Order matters!<br/>
                  • <strong>Proportion (Part-to-Whole):</strong> Compares one group to the <em>entire total group</em> as a fraction or percentage.
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  🍇 Example: 4 apples & 6 oranges (10 total) ➔ Ratio = 4:6 (or 2:3) | Proportion of apples = 4/10 = 40%
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
                The rule card is now hidden from view. No peeking! Lock the distinction (ratio = part:part with colon, proportion = part:whole) in working memory.
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
                  "Ratio compares part-to-part with a colon; proportion compares part-to-whole!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Ratio compares part-to-part with a colon; proportion compares part-to-whole!');
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
                Ready for Step 4: Tile Pattern Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE TILE PATTERN CANVAS) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Tile Pattern Builder
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Target Ratio: <strong className="text-[#9c6f1f]">2 Red : 3 Blue</strong>
                </span>
              </div>

              {/* Interactive Tile Canvas */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 text-center space-y-3">
                <div className="text-xs font-bold text-[#16241f]">
                  Tap buttons to add tiles (Target: 2 Red, 3 Blue = 5 total)
                </div>

                {/* Grid Display */}
                <div className="flex justify-center gap-2 min-h-[56px] items-center p-3 bg-white rounded-xl border border-[#16241f]/10 shadow-inner">
                  {Array.from({ length: redTiles }).map((_, i) => (
                    <div key={`red-${i}`} className="w-10 h-10 bg-rose-500 rounded-lg shadow-md border-2 border-rose-600 flex items-center justify-center font-bold text-white text-xs animate-bounce">
                      🟥
                    </div>
                  ))}
                  {Array.from({ length: blueTiles }).map((_, i) => (
                    <div key={`blue-${i}`} className="w-10 h-10 bg-sky-500 rounded-lg shadow-md border-2 border-sky-600 flex items-center justify-center font-bold text-white text-xs animate-bounce">
                      🟦
                    </div>
                  ))}
                  {redTiles === 0 && blueTiles === 0 && (
                    <span className="text-xs text-[#16241f]/40 italic">No tiles added yet. Tap buttons below!</span>
                  )}
                </div>

                {/* Tile Controls */}
                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleAddRed}
                    disabled={redTiles >= 4}
                    className="py-2 px-3 bg-rose-500 text-white font-bold text-xs rounded-lg shadow hover:bg-rose-600 disabled:opacity-40"
                  >
                    + Add Red Tile ({redTiles})
                  </button>
                  <button
                    onClick={handleAddBlue}
                    disabled={blueTiles >= 4}
                    className="py-2 px-3 bg-sky-500 text-white font-bold text-xs rounded-lg shadow hover:bg-sky-600 disabled:opacity-40"
                  >
                    + Add Blue Tile ({blueTiles})
                  </button>
                  <button
                    onClick={handleResetTiles}
                    className="py-2 px-3 bg-gray-200 text-[#16241f] font-bold text-xs rounded-lg hover:bg-gray-300"
                  >
                    🔄 Reset
                  </button>
                </div>

                {/* Pattern Metrics Readout */}
                <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-[#16241f]/10">
                  <div className="p-2.5 bg-white rounded-lg border border-[#16241f]/10">
                    <span className="text-[10px] font-bold text-[#9c6f1f] uppercase block">Ratio (Part-to-Part)</span>
                    <span className="text-sm font-black text-[#16241f]">
                      {redTiles} : {blueTiles} {isTargetPattern ? '✅ (2 : 3)' : ''}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-[#16241f]/10">
                    <span className="text-[10px] font-bold text-[#16241f]/60 uppercase block">Proportion of Red (Part-to-Whole)</span>
                    <span className="text-sm font-black text-[#16241f]">
                      {redTiles + blueTiles > 0 ? `${redTiles}/${redTiles + blueTiles}` : '0/0'} 
                      {isTargetPattern ? ' = 2/5 = 40%' : ''}
                    </span>
                  </div>
                </div>

                {/* Confirmation Action */}
                {isTargetPattern && !proportionConfirmed && (
                  <button
                    onClick={handleConfirmProportion}
                    className="w-full py-2.5 bg-[#9c6f1f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-[#9c6f1f]/90 animate-fade-in"
                  >
                    ✨ Confirm Red Proportion = 2/5 = 40% ➔
                  </button>
                )}
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Target Matched! 2 Red : 3 Blue | Red Proportion = 2/5 = 40%! Your recall was 100% accurate!
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
          <div className="text-5xl">📊⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Ratio and Proportion!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setRedTiles(0);
              setBlueTiles(0);
              setProportionConfirmed(false);
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

export default RCRTRatioProportionPlayer;
