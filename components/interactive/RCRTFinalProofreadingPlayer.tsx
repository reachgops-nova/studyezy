import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTFinalProofreadingPlayerProps {
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
    questionText: 'What is the purpose of the final proofreading pass before submitting a story?',
    options: [
      'To combine content/sense checks with a thorough pass for capitals, punctuation, apostrophes, and speech marks',
      'To rewrite the entire story in a different language',
      'To change all character names'
    ],
    correctIndex: 0,
    hint: 'Final proofreading catches both sense/meaning errors and lingering punctuation or spelling mistakes!'
  },
  {
    id: 2,
    questionText: 'Why do apostrophes and speech marks get their own dedicated proofreading check?',
    options: [
      'Because punctuation marks like apostrophes and speech marks are small and easy to accidentally miss',
      'Because apostrophes are forbidden in stories',
      'Because speech marks are only used in science books'
    ],
    correctIndex: 0,
    hint: 'Small punctuation marks like apostrophes and speech marks are easily overlooked unless checked specifically!'
  },
  {
    id: 3,
    questionText: 'Why is reading your written work aloud an effective proofreading technique?',
    options: [
      'Your ears naturally hear missing words, awkward pauses, and missing full stops that your eyes skip over',
      'It makes the paper turn blue',
      'It automatically changes your font'
    ],
    correctIndex: 0,
    hint: 'Reading aloud forces your brain to process every word, catching missing words and punctuation errors!'
  }
];

export const RCRTFinalProofreadingPlayer: React.FC<RCRTFinalProofreadingPlayerProps> = ({
  conceptName = 'Concept 1.13: Final Proofreading Checklist',
  unitTitle = 'Cambridge Primary English Stage 4/5 (Unit 1 Part B)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Test State: Fix 3 Proofreading Errors in Draft Sentence
  // Draft: "the boy cant run fast"
  // Error 1: "the" (missing capital 'T') -> "The"
  // Error 2: "cant" (missing apostrophe) -> "can't"
  // Error 3: "fast" (missing full stop) -> "fast."
  const [fixedErrors, setFixedErrors] = useState<{ [key: string]: boolean }>({});
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
          'STEP 1: READ. Final proofreading combines content checks with punctuation checks. Make separate passes for sense, capitals, full stops, apostrophes, and speech marks!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Lock the proofreading checklist items in memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Read for sense first, then re-read for capitals, full stops, apostrophes, and speech marks!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Tap the 3 error spots in the draft sentence "the boy cant run fast" to fix capital letter, apostrophe, and full stop errors!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Final Proofreading Checklist with RCRT active recall and earned 3 stars!'
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

  const handleFixError = (errorKey: string) => {
    const updated = { ...fixedErrors, [errorKey]: true };
    setFixedErrors(updated);

    if (errorKey === 'capital') {
      safeNarrate('Capital letter fixed: "the" becomes "The"!');
    } else if (errorKey === 'apostrophe') {
      safeNarrate('Apostrophe added: "cant" becomes "can\'t"!');
    } else if (errorKey === 'fullstop') {
      safeNarrate('Full stop added: "fast" becomes "fast."!');
    }

    if (Object.keys(updated).length === 3) {
      setTestCompleted(true);
      setStars((prev) => prev + 1);
      safeNarrate('All 3 proofreading errors corrected! "The boy can\'t run fast." Active recall 100% accurate!');
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
                  Rule: Final Proofreading Checklist
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Dual Passes:</strong> Check content/sense first, then re-read for punctuation.<br/>
                  • <strong>Key Checks:</strong> Capital letters, full stops, apostrophes, and speech marks.<br/>
                  • <strong>Read Aloud:</strong> Your ears naturally catch missing words or punctuation stops that eyes skip!
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  ✏️ Example: "the boy cant run fast" ➔ Fix: "The boy can't run fast."
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
                The rule card is now hidden from view. No peeking! Lock the proofreading checklist steps in memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Proofreading checklist stored in memory...
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
                  "Read for sense first, then re-read for capitals, full stops, apostrophes, and speech marks!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Read for sense first, then re-read for capitals, full stops, apostrophes, and speech marks!');
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
                Ready for Step 4: Active Proofreading Spotter Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Proofreading Error Spotter
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Errors Fixed: <strong className="text-[#9c6f1f]">{Object.keys(fixedErrors).length} / 3</strong>
                </span>
              </div>

              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 text-center space-y-4">
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Tap error words below to fix them:
                </span>

                {/* Draft Sentence Interactive Buttons */}
                <div className="flex justify-center items-center gap-2 p-3 bg-white rounded-xl border border-[#16241f]/15">
                  <button
                    disabled={fixedErrors.capital}
                    onClick={() => handleFixError('capital')}
                    className={`px-3 py-1.5 rounded-lg font-mono font-bold text-sm transition-all ${
                      fixedErrors.capital
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                        : 'bg-amber-100 text-[#16241f] border-2 border-dashed border-[#9c6f1f] hover:bg-amber-200'
                    }`}
                  >
                    {fixedErrors.capital ? 'The' : 'the'} {fixedErrors.capital ? '✓' : ''}
                  </button>

                  <span className="font-mono text-sm font-bold">boy</span>

                  <button
                    disabled={fixedErrors.apostrophe}
                    onClick={() => handleFixError('apostrophe')}
                    className={`px-3 py-1.5 rounded-lg font-mono font-bold text-sm transition-all ${
                      fixedErrors.apostrophe
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                        : 'bg-amber-100 text-[#16241f] border-2 border-dashed border-[#9c6f1f] hover:bg-amber-200'
                    }`}
                  >
                    {fixedErrors.apostrophe ? "can't" : 'cant'} {fixedErrors.apostrophe ? '✓' : ''}
                  </button>

                  <span className="font-mono text-sm font-bold">run</span>

                  <button
                    disabled={fixedErrors.fullstop}
                    onClick={() => handleFixError('fullstop')}
                    className={`px-3 py-1.5 rounded-lg font-mono font-bold text-sm transition-all ${
                      fixedErrors.fullstop
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                        : 'bg-amber-100 text-[#16241f] border-2 border-dashed border-[#9c6f1f] hover:bg-amber-200'
                    }`}
                  >
                    {fixedErrors.fullstop ? 'fast.' : 'fast'} {fixedErrors.fullstop ? '✓' : ''}
                  </button>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-[#16241f]/10 text-xs text-[#16241f] font-semibold">
                  Result: "{fixedErrors.capital ? 'The' : 'the'} boy {fixedErrors.apostrophe ? "can't" : 'cant'} run {fixedErrors.fullstop ? 'fast.' : 'fast'}"
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 All 3 Proofreading Errors Fixed! "The boy can't run fast." Active recall 100% accurate!
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
          <div className="text-5xl">✏️⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Final Proofreading Checklist!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setFixedErrors({});
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

export default RCRTFinalProofreadingPlayer;
