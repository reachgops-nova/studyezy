import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTModeMedianPlayerProps {
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
    questionText: 'What is the key difference between the mode and median of a dataset?',
    options: [
      'Mode is the value that appears most often; Median is the middle value when ordered',
      'Mode is the largest number; Median is the smallest number',
      'Mode is the total sum; Median is the count of items'
    ],
    correctIndex: 0,
    hint: 'Memory trick: "Mode" sounds like "Most" (most frequent), and "Median" sounds like "Middle" (ordered middle)!'
  },
  {
    id: 2,
    questionText: 'For the dataset 2, 2, 9, 11, 12, what are the mode and median?',
    options: [
      'Mode = 2 (appears most), Median = 9 (middle value)',
      'Mode = 9, Median = 2',
      'Mode = 12, Median = 11'
    ],
    correctIndex: 0,
    hint: 'Count which number repeats most for mode (2 appears twice), and pick the exact middle number when ordered (9 is the 3rd value)!'
  },
  {
    id: 3,
    questionText: 'For sibling counts 0, 1, 1, 2, 4, what is true about the mode and median?',
    options: [
      'Both the mode (most frequent) and the median (ordered middle) equal 1',
      'Mode is 4 and Median is 0',
      'Mode is 2 and Median is 4'
    ],
    correctIndex: 0,
    hint: '1 appears most often (mode = 1), and when ordered [0, 1, 1, 2, 4], the 3rd middle number is also 1!'
  }
];

export const RCRTModeMedianPlayer: React.FC<RCRTModeMedianPlayerProps> = ({
  conceptName = 'Concept 16.1: Mode and Median',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 16: Statistical Methods)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Active Test State
  const dataset = [2, 2, 9, 11, 12];
  const [selectedMode, setSelectedMode] = useState<number | null>(null);
  const [selectedMedian, setSelectedMedian] = useState<number | null>(null);
  const [modeCorrect, setModeCorrect] = useState<boolean>(false);
  const [medianCorrect, setMedianCorrect] = useState<boolean>(false);
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
          'STEP 1: READ. Mode and median describe typical values in data. Mode is the value that appears most often—remember Mode sounds like Most! Median is the middle value when data is arranged from smallest to largest—remember Median sounds like Middle! For dataset 2, 2, 9, 11, 12, mode is 2 and median is 9.'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Store the distinction between Mode (most frequent) and Median (ordered middle) in working memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Mode sounds like Most (most frequent); Median sounds like Middle (ordered middle)!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Put your memory to work! For dataset 2, 2, 9, 11, 12, select the Mode (most frequent) and the Median (ordered middle)!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Mode and Median with RCRT active recall and earned 3 stars!'
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

  const handleSelectMode = (val: number) => {
    setSelectedMode(val);
    if (val === 2) {
      setModeCorrect(true);
      safeNarrate('Correct Mode! 2 appears most often (twice)! Now select the Median.');
      if (medianCorrect) {
        setTestCompleted(true);
        setStars((prev) => prev + 1);
      }
    } else {
      safeNarrate(`Not quite. Mode means most frequent. 2 appears twice!`);
    }
  };

  const handleSelectMedian = (val: number) => {
    setSelectedMedian(val);
    if (val === 9) {
      setMedianCorrect(true);
      safeNarrate('Correct Median! 9 is the exact middle number when ordered: [2, 2, 9, 11, 12]!');
      if (modeCorrect || selectedMode === 2) {
        setTestCompleted(true);
        setStars((prev) => prev + 1);
      }
    } else {
      safeNarrate(`Not quite. Median is the middle number when ordered from smallest to largest.`);
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
                  Rule: Mode vs. Median
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Mode (Most Frequent):</strong> The value that appears most often in a dataset. Memory trick: <em>"Mode" sounds like "Most"</em>!<br/>
                  • <strong>Median (Middle Value):</strong> The middle value when numbers are arranged in order from smallest to largest. Memory trick: <em>"Median" sounds like "Middle"</em>!
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  📊 Example: Dataset [2, 2, 9, 11, 12] ➔ Mode = 2 (most frequent) | Median = 9 (middle value)
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
                The rule card is now hidden from view. No peeking! Lock the distinction (Mode = Most, Median = Middle) in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Mode and Median rules locked in memory...
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
                  "Mode sounds like Most (most frequent); Median sounds like Middle (ordered middle)!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Mode sounds like Most (most frequent); Median sounds like Middle (ordered middle)!');
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
                Ready for Step 4: Active Dataset Inspector 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE DATASET INSPECTOR CANVAS) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Dataset Inspector
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Target Dataset: <strong className="text-[#9c6f1f]">[2, 2, 9, 11, 12]</strong>
                </span>
              </div>

              {/* Interactive Dataset Cards */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 text-center space-y-4">
                <div className="text-xs font-bold text-[#16241f]">
                  Ordered Dataset:
                </div>

                <div className="flex justify-center gap-2">
                  {dataset.map((val, idx) => (
                    <div
                      key={idx}
                      className={`w-12 h-14 rounded-xl border-2 flex flex-col items-center justify-center font-black text-sm shadow transition-all ${
                        idx === 2 ? 'bg-amber-100 border-[#9c6f1f] text-[#9c6f1f]' : 'bg-white border-[#16241f]/20 text-[#16241f]'
                      }`}
                    >
                      <span>{val}</span>
                      <span className="text-[9px] font-normal text-[#16241f]/50">pos {idx + 1}</span>
                    </div>
                  ))}
                </div>

                {/* Mode Selector */}
                <div className="p-3 bg-white rounded-xl border border-[#16241f]/10 text-left space-y-2">
                  <span className="text-xs font-bold text-[#16241f] block">
                    1. Which number is the MODE (appears most often)?
                  </span>
                  <div className="flex gap-2">
                    {[2, 9, 11, 12].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleSelectMode(num)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                          selectedMode === num
                            ? num === 2
                              ? 'bg-emerald-600 text-white'
                              : 'bg-red-500 text-white'
                            : 'bg-[#f4f6f1] text-[#16241f] border border-[#16241f]/15'
                        }`}
                      >
                        {num} {selectedMode === num && num === 2 ? '✅' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Median Selector */}
                <div className="p-3 bg-white rounded-xl border border-[#16241f]/10 text-left space-y-2">
                  <span className="text-xs font-bold text-[#16241f] block">
                    2. Which number is the MEDIAN (exact middle value when ordered)?
                  </span>
                  <div className="flex gap-2">
                    {[2, 9, 11, 12].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleSelectMedian(num)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                          selectedMedian === num
                            ? num === 9
                              ? 'bg-emerald-600 text-white'
                              : 'bg-red-500 text-white'
                            : 'bg-[#f4f6f1] text-[#16241f] border border-[#16241f]/15'
                        }`}
                      >
                        {num} {selectedMedian === num && num === 9 ? '✅' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Dataset Inspected! Mode = 2 (most frequent) and Median = 9 (middle value)! Your recall was 100% accurate!
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
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Mode and Median!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setSelectedMode(null);
              setSelectedMedian(null);
              setModeCorrect(false);
              setMedianCorrect(false);
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

export default RCRTModeMedianPlayer;
