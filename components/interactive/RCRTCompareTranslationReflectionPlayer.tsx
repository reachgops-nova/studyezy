import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTCompareTranslationReflectionPlayerProps {
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
    questionText: 'What is the fastest test question to determine if a transformation is a translation or a reflection?',
    options: [
      'Ask: "Does the shape still face the exact same way?" (Yes = Translation; No = Reflection)',
      'Count the number of corners on the shape',
      'Check if the shape turned into a circle'
    ],
    correctIndex: 0,
    hint: 'If a shape still faces the exact same way, it is a translation! If it has been flipped so it faces opposite, it is a reflection.'
  },
  {
    id: 2,
    questionText: 'When a triangle pointing left is moved 4 squares right and 2 squares down while STILL pointing left, what is this movement called?',
    options: [
      'Translation — because every vertex moved the same distance/direction without flipping',
      'Reflection — because it moved down',
      'Rotation — because it turned 180 degrees'
    ],
    correctIndex: 0,
    hint: 'A smooth slide where orientation stays unchanged is a translation!'
  },
  {
    id: 3,
    questionText: 'If a triangle pointing left now points right across a vertical line, what transformation occurred?',
    options: [
      'Reflection — because its orientation has been reversed across the mirror line',
      'Translation — because it moved to the right',
      'Dilation — because it changed size'
    ],
    correctIndex: 0,
    hint: 'Reversing orientation (pointing left ➔ pointing right) is the trademark of a reflection!'
  }
];

export const RCRTCompareTranslationReflectionPlayer: React.FC<RCRTCompareTranslationReflectionPlayerProps> = ({
  conceptName = 'Concept 14.2: Comparing Translations and Reflections',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 14: Location and Movement)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Classifier State
  // Scenario 1: Triangle moving (4 right, 2 down) -> Still points LEFT -> Student classifies as 'translation'
  // Scenario 2: Triangle pointing LEFT -> Now points RIGHT across vertical line -> Student classifies as 'reflection'
  const [scenario, setScenario] = useState<1 | 2>(1);
  const [userClassification, setUserClassification] = useState<'translation' | 'reflection' | null>(null);
  const [scenario1Done, setScenario1Done] = useState<boolean>(false);
  const [scenario2Done, setScenario2Done] = useState<boolean>(false);
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
          'STEP 1: READ. A translation slides a shape without turning or flipping it, so it keeps facing the exact same way. A reflection flips a shape across a mirror line, reversing its orientation. Ask yourself: "Does it still face the same way?" If yes, it is a translation; if mirrored, it is a reflection!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Lock the distinction (orientation stays same vs. orientation reverses) in your memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Faces same way equals translation; flipped opposite equals reflection!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Observe each transformation scenario and classify whether it is a Translation or a Reflection!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Comparing Translations and Reflections with RCRT active recall and earned 3 stars!'
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

  const handleClassify = (choice: 'translation' | 'reflection') => {
    setUserClassification(choice);
    if (scenario === 1) {
      if (choice === 'translation') {
        setScenario1Done(true);
        safeNarrate('Correct! Moving 4 right and 2 down while still pointing left is a Translation (same orientation)! Now try Scenario 2.');
        setTimeout(() => {
          setScenario(2);
          setUserClassification(null);
        }, 1200);
      } else {
        safeNarrate('Not quite. Notice that the triangle still points left! Because it faces the same way, it is a Translation.');
      }
    } else if (scenario === 2) {
      if (choice === 'reflection') {
        setScenario2Done(true);
        setTestCompleted(true);
        setStars((prev) => prev + 1);
        safeNarrate('Correct! Reversing from pointing left to pointing right across a line is a Reflection! Excellent active recall!');
      } else {
        safeNarrate('Not quite. Notice the triangle flipped from pointing left to pointing right! Because its orientation reversed, it is a Reflection.');
      }
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
                  Rule: Translation vs. Reflection
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Translation (Slide):</strong> Shape moves position but keeps facing the <em>exact same direction</em> (orientation unchanged).<br/>
                  • <strong>Reflection (Flip):</strong> Shape flips across a mirror line, <em>reversing its orientation</em> (e.g. pointing left ➔ pointing right).
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  ❓ Key Question: "Does the shape still face the exact same way?" ➔ YES = Translation | NO = Reflection
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
                The rule card is now hidden from view. No peeking! Lock the orientation test ("does it face the same way?") in memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Orientation rule locked in memory...
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
                  "Faces same way equals translation; flipped opposite equals reflection!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Faces same way equals translation; flipped opposite equals reflection!');
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
                Ready for Step 4: Active Classifier Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (ACTIVE CLASSIFIER CANVAS) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Transformation Classifier
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Scenario {scenario} of 2
                </span>
              </div>

              {/* Scenario Display Canvas */}
              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 text-center space-y-3">
                {scenario === 1 ? (
                  <div>
                    <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block mb-1">
                      Scenario 1: Slide (4 Right, 2 Down)
                    </span>
                    <p className="text-xs text-[#16241f] font-semibold mb-3">
                      A triangle pointing <strong>LEFT ◄</strong> moves 4 squares right and 2 squares down, and still points <strong>LEFT ◄</strong>.
                    </p>

                    <div className="relative w-56 h-36 mx-auto bg-white border border-[#16241f]/20 rounded-lg flex items-center justify-around p-2">
                      <div className="text-center">
                        <svg width="40" height="50" viewBox="0 0 40 50"><polygon points="30,10 10,25 30,40" fill="#16241f" /></svg>
                        <span className="text-[10px] font-bold block mt-1">Start (Left ◄)</span>
                      </div>
                      <span className="text-lg font-black text-[#9c6f1f]">➔ 🛷</span>
                      <div className="text-center">
                        <svg width="40" height="50" viewBox="0 0 40 50"><polygon points="30,10 10,25 30,40" fill="#9c6f1f" /></svg>
                        <span className="text-[10px] font-bold block mt-1">End (Left ◄)</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block mb-1">
                      Scenario 2: Flip Across Vertical Line
                    </span>
                    <p className="text-xs text-[#16241f] font-semibold mb-3">
                      A triangle pointing <strong>LEFT ◄</strong> crosses a vertical mirror line and now points <strong>RIGHT ►</strong>.
                    </p>

                    <div className="relative w-56 h-36 mx-auto bg-white border border-[#16241f]/20 rounded-lg flex items-center justify-around p-2">
                      <div className="text-center">
                        <svg width="40" height="50" viewBox="0 0 40 50"><polygon points="30,10 10,25 30,40" fill="#16241f" /></svg>
                        <span className="text-[10px] font-bold block mt-1">Start (Left ◄)</span>
                      </div>
                      <div className="w-0.5 h-20 bg-amber-500 shadow" />
                      <div className="text-center">
                        <svg width="40" height="50" viewBox="0 0 40 50"><polygon points="10,10 30,25 10,40" fill="#9c6f1f" /></svg>
                        <span className="text-[10px] font-bold block mt-1">End (Right ►)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Classification Buttons */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-[#16241f] mb-2">What transformation is this?</p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleClassify('translation')}
                      className={`py-2.5 px-4 font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all ${
                        userClassification === 'translation' && scenario1Done
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#16241f] text-white hover:bg-[#16241f]/90'
                      }`}
                    >
                      🛷 Translation (Slide)
                    </button>
                    <button
                      onClick={() => handleClassify('reflection')}
                      className={`py-2.5 px-4 font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all ${
                        userClassification === 'reflection' && scenario2Done
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#9c6f1f] text-white hover:bg-[#9c6f1f]/90'
                      }`}
                    >
                      🪞 Reflection (Flip)
                    </button>
                  </div>
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Both Scenarios Classified Correctly! You mastered Translation vs. Reflection!
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
          <div className="text-5xl">🛷🪞⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Comparing Translations and Reflections!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setScenario(1);
              setUserClassification(null);
              setScenario1Done(false);
              setScenario2Done(false);
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

export default RCRTCompareTranslationReflectionPlayer;
