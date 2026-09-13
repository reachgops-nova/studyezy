import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTPrefixesSuffixesPlayerProps {
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
    questionText: 'Which prefix spelling rule applies before words starting with the letter "l"?',
    options: [
      'The prefix "il-" is used before words starting with "l" (e.g., legal ➔ illegal)',
      'The prefix "im-" is used before words starting with "l"',
      'The prefix "ir-" is used before words starting with "l"'
    ],
    correctIndex: 0,
    hint: 'il- is used before l (illegal), im- before m or p (impatient), and ir- before r (irregular)!'
  },
  {
    id: 2,
    questionText: 'When adding a vowel suffix like "-ing" or "-ed" to a one-syllable verb ending in consonant-vowel-consonant, what happens to the final letter?',
    options: [
      'Double the final consonant letter (e.g., run ➔ running, hop ➔ hopped)',
      'Remove the final letter completely',
      'Change the final letter to "z"'
    ],
    correctIndex: 0,
    hint: 'Short one-syllable verbs double their final consonant letter before vowel suffixes like -ing or -ed!'
  },
  {
    id: 3,
    questionText: 'Which prefix should be added to the root word "patient" to mean "not patient"?',
    options: [
      'im- to form "impatient"',
      'il- to form "ilpatient"',
      'ir- to form "irpatient"'
    ],
    correctIndex: 0,
    hint: 'im- is the negative prefix rule before words starting with "p" or "m" (patient ➔ impatient)!'
  }
];

interface PrefixMatchingTask {
  id: string;
  rootWord: string;
  correctPrefix: 'il-' | 'im-' | 'ir-';
}

const PREFIX_TASKS: PrefixMatchingTask[] = [
  { id: 'p1', rootWord: 'legal', correctPrefix: 'il-' },
  { id: 'p2', rootWord: 'patient', correctPrefix: 'im-' },
  { id: 'p3', rootWord: 'regular', correctPrefix: 'ir-' }
];

interface SuffixTask {
  id: string;
  rootWord: string;
  suffix: string;
  correctWord: string;
  wrongWord: string;
}

const SUFFIX_TASKS: SuffixTask[] = [
  { id: 's1', rootWord: 'run', suffix: '-ing', correctWord: 'running', wrongWord: 'runing' },
  { id: 's2', rootWord: 'hop', suffix: '-ed', correctWord: 'hopped', wrongWord: 'hoped' }
];

export const RCRTPrefixesSuffixesPlayer: React.FC<RCRTPrefixesSuffixesPlayerProps> = ({
  conceptName = 'Concept 2.6: Prefixes and Suffixes',
  unitTitle = 'Cambridge Primary English Stage 4/5 (Unit 2: Non-fiction - Biography)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Test State
  const [prefixAnswers, setPrefixAnswers] = useState<{ [id: string]: string }>({});
  const [suffixAnswers, setSuffixAnswers] = useState<{ [id: string]: string }>({});
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
          'STEP 1: READ. A prefix goes at the start of a root word; a suffix goes at the end. Spelling rules: use il- before "l" (illegal), im- before "m" or "p" (impatient), and ir- before "r" (irregular). Double the final consonant of one-syllable verbs before adding vowel suffixes like "-ing" or "-ed" (running, hopped)!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Remember: il- for l, im- for m/p, ir- for r, and double consonants for short vowel suffixes.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Prefixes il- before l, im- before m or p, ir- before r—double the consonant for short vowel suffixes!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Put your memory to work! Match each root word to its correct prefix and select the correct doubled-consonant suffix spelling!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Prefixes and Suffixes with RCRT active recall and earned 3 stars!'
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

  const handleSelectPrefix = (taskId: string, prefix: 'il-' | 'im-' | 'ir-') => {
    const updated = { ...prefixAnswers, [taskId]: prefix };
    setPrefixAnswers(updated);

    const taskObj = PREFIX_TASKS.find((t) => t.id === taskId);
    if (taskObj) {
      const isCorrect = prefix === taskObj.correctPrefix;
      safeNarrate(
        isCorrect
          ? `Correct! "${prefix}${taskObj.rootWord}" matches the rule!`
          : `Try again: Check the first letter of "${taskObj.rootWord}".`
      );
    }

    checkAllTasksCompleted(updated, suffixAnswers);
  };

  const handleSelectSuffix = (taskId: string, word: string) => {
    const updated = { ...suffixAnswers, [taskId]: word };
    setSuffixAnswers(updated);

    const taskObj = SUFFIX_TASKS.find((t) => t.id === taskId);
    if (taskObj) {
      const isCorrect = word === taskObj.correctWord;
      safeNarrate(
        isCorrect
          ? `Correct! Doubled consonant spelling "${word}" is accurate!`
          : `Review: One-syllable verbs double their final consonant letter.`
      );
    }

    checkAllTasksCompleted(prefixAnswers, updated);
  };

  const checkAllTasksCompleted = (
    currentPrefixes: { [id: string]: string },
    currentSuffixes: { [id: string]: string }
  ) => {
    const prefixDone = Object.keys(currentPrefixes).length === PREFIX_TASKS.length;
    const suffixDone = Object.keys(currentSuffixes).length === SUFFIX_TASKS.length;

    if (prefixDone && suffixDone) {
      const prefixesCorrect = PREFIX_TASKS.every((t) => currentPrefixes[t.id] === t.correctPrefix);
      const suffixesCorrect = SUFFIX_TASKS.every((t) => currentSuffixes[t.id] === t.correctWord);

      if (prefixesCorrect && suffixesCorrect) {
        setTestCompleted(true);
        setStars((prev) => prev + 1);
        safeNarrate('All prefix and suffix spelling rules applied perfectly! Active recall 100% accurate!');
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
                  Rule: Prefix & Suffix Spelling Rules
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Prefix il-:</strong> Used before words starting with <em>l</em> (e.g. <em>il + legal = illegal</em>).<br/>
                  • <strong>Prefix im-:</strong> Used before words starting with <em>m</em> or <em>p</em> (e.g. <em>im + patient = impatient</em>).<br/>
                  • <strong>Prefix ir-:</strong> Used before words starting with <em>r</em> (e.g. <em>ir + regular = irregular</em>).<br/>
                  • <strong>Doubling Rule:</strong> Double the final letter of a one-syllable verb before vowel suffixes like <em>-ing</em> or <em>-ed</em> (e.g. <em>run ➔ running</em>, <em>hop ➔ hopped</em>).
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  ⚙️ Spelling Rules: il-legal | im-patient | ir-regular | run-ning
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
                The rule card is now hidden from view. No peeking! Lock the prefix spelling rules and consonant doubling rules in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Spelling rules stored in memory...
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
                  "Prefixes il- before l, im- before m or p, ir- before r—double the consonant for short vowel suffixes!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Prefixes il- before l, im- before m or p, ir- before r—double the consonant for short vowel suffixes!');
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
                Ready for Step 4: Active Prefix/Suffix Word Builder Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Word Builder Test
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Part 1: Prefixes | Part 2: Suffixes
                </span>
              </div>

              {/* Part 1: Negative Prefixes */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#16241f] uppercase tracking-wider border-b pb-1 border-[#16241f]/10">
                  Part 1: Select the Correct Negative Prefix (il-, im-, ir-)
                </p>
                {PREFIX_TASKS.map((task) => {
                  const userChoice = prefixAnswers[task.id];
                  return (
                    <div key={task.id} className="p-3 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#16241f]">
                        Root Word: <strong className="text-[#9c6f1f]">{task.rootWord}</strong>
                      </span>
                      <div className="flex gap-1.5">
                        {(['il-', 'im-', 'ir-'] as const).map((prefix) => (
                          <button
                            key={prefix}
                            onClick={() => handleSelectPrefix(task.id, prefix)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              userChoice === prefix
                                ? prefix === task.correctPrefix
                                  ? 'bg-emerald-600 text-white shadow'
                                  : 'bg-red-500 text-white'
                                : 'bg-white text-[#16241f] border border-[#16241f]/20 hover:border-[#9c6f1f]'
                            }`}
                          >
                            {prefix}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Part 2: Consonant Doubling Suffixes */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-[#16241f] uppercase tracking-wider border-b pb-1 border-[#16241f]/10">
                  Part 2: Select the Correct Doubled-Consonant Spelling
                </p>
                {SUFFIX_TASKS.map((task) => {
                  const userChoice = suffixAnswers[task.id];
                  return (
                    <div key={task.id} className="p-3 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#16241f]">
                        {task.rootWord} + {task.suffix} = ?
                      </span>
                      <div className="flex gap-2">
                        {[task.correctWord, task.wrongWord].map((word) => (
                          <button
                            key={word}
                            onClick={() => handleSelectSuffix(task.id, word)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              userChoice === word
                                ? word === task.correctWord
                                  ? 'bg-emerald-600 text-white shadow'
                                  : 'bg-red-500 text-white'
                                : 'bg-white text-[#16241f] border border-[#16241f]/20 hover:border-[#9c6f1f]'
                            }`}
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 All Prefix and Suffix Spelling Rules Applied Correctly! Active recall 100% spot-on!
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
          <div className="text-5xl">⚙️⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent active recall memory for Prefixes and Suffixes!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setPrefixAnswers({});
              setSuffixAnswers({});
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

export default RCRTPrefixesSuffixesPlayer;
