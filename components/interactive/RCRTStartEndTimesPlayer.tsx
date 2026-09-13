import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTStartEndTimesPlayerProps {
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
    questionText: 'To find the finish (end) time of an event when you know the start time and duration, what calculation do you use?',
    options: [
      'Start time + duration = end time (work forward)',
      'Start time - duration = end time',
      'Start time × duration = end time'
    ],
    correctIndex: 0,
    hint: 'To find an end time, add the duration to the start time and work forward!'
  },
  {
    id: 2,
    questionText: 'A film finishes at 8:15 pm and lasts 90 minutes (1 hour 30 minutes). What was its start time?',
    options: [
      '6:45 pm (count back 60 mins to 7:15 pm, then back 30 mins to 6:45 pm)',
      '9:45 pm',
      '7:15 pm'
    ],
    correctIndex: 0,
    hint: 'To find a start time, work backward! 8:15 pm - 60 mins = 7:15 pm; 7:15 pm - 30 mins = 6:45 pm.'
  },
  {
    id: 3,
    questionText: 'A show starts at 11:20 am and lasts 45 minutes. How do you break the duration into friendly chunks to find the end time easily?',
    options: [
      'Jump 40 minutes to reach 12:00 noon (the next hour), then add remaining 5 minutes to reach 12:05 pm',
      'Add 45 to 11 to get 56:20',
      'Subtract 45 minutes from 11:20'
    ],
    correctIndex: 0,
    hint: 'Jump to the next round hour first! 11:20 + 40 mins = 12:00, plus 5 remaining mins = 12:05 pm!'
  }
];

export const RCRTStartEndTimesPlayer: React.FC<RCRTStartEndTimesPlayerProps> = ({
  conceptName = 'Concept 18.2: Calculating Start and End Times',
  unitTitle = 'Cambridge Primary Math Stage 4 (Unit 18: Time)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Test Stepper for 11:20 + 45 minutes
  // Sub-step 1: Jump +40 mins to 12:00 noon
  // Sub-step 2: Jump +5 mins to 12:05 pm
  const [jump1Done, setJump1Done] = useState<boolean>(false);
  const [jump2Done, setJump2Done] = useState<boolean>(false);
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
          'STEP 1: READ. To find an end time, add the duration to the start time and work forward. To find a start time, subtract the duration from the finish time and work backward. Always break long durations into friendly chunks, like jumping to the next hour first!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Remember: End time = Start + duration (forward); Start time = Finish - duration (backward).'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "For end time, add and work forward! For start time, subtract and work backward!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Put your memory to work! A show starts at 11:20 am and lasts 45 minutes. Jump +40 mins to 12:00, then +5 mins to find the end time!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Calculating Start and End Times with RCRT active recall and earned 3 stars!'
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

  const handleJump1 = () => {
    setJump1Done(true);
    safeNarrate('Sub-step 1 Complete: 11:20 + 40 minutes = 12:00 noon! Now add the remaining 5 minutes.');
  };

  const handleJump2 = () => {
    setJump2Done(true);
    setTestCompleted(true);
    setStars((prev) => prev + 1);
    safeNarrate('Sub-step 2 Complete: 12:00 noon + 5 minutes = 12:05 pm! Target matched! 11:20 + 45 mins = 12:05 pm!');
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
                  Rule: Calculating Start and End Times
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>End Time (Work Forward):</strong> Start Time + Duration = End Time.<br/>
                  • <strong>Start Time (Work Backward):</strong> Finish Time - Duration = Start Time.<br/>
                  • <strong>Friendly Chunks Tip:</strong> Jump to the next hour first (e.g. 11:20 + 40 mins = 12:00, then +5 mins = 12:05 pm).
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  ⏰ Friendly Jump Example: 11:20 ➔ (+40m) ➔ 12:00 ➔ (+5m) ➔ 12:05 pm
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
                The rule card is now hidden from view. No peeking! Lock the forward/backward time jump rules in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Strategy stored in memory...
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
                  "For end time, add and work forward! For start time, subtract and work backward!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('For end time, add and work forward! For start time, subtract and work backward!');
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
                Ready for Step 4: Active Time Jumper Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Interactive Time Jumper
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Start: <strong>11:20 am</strong> | Duration: <strong>45 mins</strong>
                </span>
              </div>

              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 text-center space-y-4">
                <div className="text-sm font-black text-[#16241f]">
                  Find the End Time of a 45-minute show starting at 11:20 am
                </div>

                {/* Sub-step 1: Jump to 12:00 */}
                <div className={`p-3 rounded-xl border-2 transition-all ${jump1Done ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-white border-[#16241f]/20'}`}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1">
                    Sub-step 1: Jump +40 mins to reach the next round hour (12:00 noon)
                  </div>
                  {!jump1Done ? (
                    <button
                      onClick={handleJump1}
                      className="py-2 px-4 bg-[#9c6f1f] text-white font-bold text-xs rounded-lg shadow hover:bg-[#9c6f1f]/90"
                    >
                      ⏩ Tap to Jump +40 mins ➔ 12:00 Noon
                    </button>
                  ) : (
                    <div className="text-sm font-black">
                      ✅ 11:20 + 40 mins = <span className="text-emerald-700">12:00 Noon</span>
                    </div>
                  )}
                </div>

                {/* Sub-step 2: Jump +5 mins */}
                <div className={`p-3 rounded-xl border-2 transition-all ${jump2Done ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-white border-[#16241f]/20 opacity-60'}`}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1">
                    Sub-step 2: Add remaining 5 mins (45 - 40 = 5 mins)
                  </div>
                  {jump1Done && !jump2Done && (
                    <button
                      onClick={handleJump2}
                      className="py-2 px-4 bg-[#16241f] text-white font-bold text-xs rounded-lg shadow hover:bg-[#16241f]/90"
                    >
                      ➕ Tap to Add +5 mins ➔ 12:05 pm
                    </button>
                  )}
                  {jump2Done && (
                    <div className="text-sm font-black">
                      🎉 12:00 + 5 mins = <span className="text-emerald-700">12:05 pm</span>
                    </div>
                  )}
                  {!jump1Done && (
                    <div className="text-xs text-[#16241f]/50">Complete Sub-step 1 first</div>
                  )}
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Target Matched! 11:20 + 45 mins = 12:05 pm! Active recall 100% accurate!
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
          <div className="text-5xl">⏰⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Calculating Start and End Times!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setJump1Done(false);
              setJump2Done(false);
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

export default RCRTStartEndTimesPlayer;
