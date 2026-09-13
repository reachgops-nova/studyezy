import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTSynonymsPlayerProps {
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
    questionText: 'What is a synonym?',
    options: [
      'A word that means the same or nearly the same as another word',
      'A word that means the exact opposite of another word',
      'A word that sounds like a noise or animal sound'
    ],
    correctIndex: 0,
    hint: 'Synonyms are words with matching or nearly identical meanings, like "famous" and "renowned"!'
  },
  {
    id: 2,
    questionText: 'Why do biography writers use synonyms instead of repeating the same word?',
    options: [
      'To avoid repeating the same word and make writing rich, varied, and engaging',
      'To make sentences longer so the book takes more pages',
      'To confuse the reader with secret code words'
    ],
    correctIndex: 0,
    hint: 'Using synonyms keeps biography writing fresh, expressive, and interesting to read!'
  },
  {
    id: 3,
    questionText: 'Which reference tool lists synonyms for nouns, verbs, and adjectives?',
    options: [
      'A thesaurus',
      'An atlas',
      'A phone directory'
    ],
    correctIndex: 0,
    hint: 'A thesaurus is the ultimate reference tool for finding rich synonyms for any word!'
  }
];

interface SynonymTask {
  id: string;
  sentenceBefore: string;
  sentenceAfter: string;
  overusedWord: string;
  options: { word: string; isCorrect: boolean }[];
}

const TASKS: SynonymTask[] = [
  {
    id: 't1',
    sentenceBefore: 'Usain Bolt became a',
    sentenceAfter: 'sprinter in world athletics.',
    overusedWord: 'famous',
    options: [
      { word: 'renowned', isCorrect: true },
      { word: 'loud', isCorrect: false },
      { word: 'huge', isCorrect: false }
    ]
  },
  {
    id: 't2',
    sentenceBefore: 'The',
    sentenceAfter: 'scientist won the Nobel Prize.',
    overusedWord: 'famous',
    options: [
      { word: 'celebrated', isCorrect: true },
      { word: 'busy', isCorrect: false },
      { word: 'friendly', isCorrect: false }
    ]
  },
  {
    id: 't3',
    sentenceBefore: 'A',
    sentenceAfter: 'author visited the local school.',
    overusedWord: 'famous',
    options: [
      { word: 'well-known', isCorrect: true },
      { word: 'noisy', isCorrect: false },
      { word: 'young', isCorrect: false }
    ]
  }
];

export const RCRTSynonymsPlayer: React.FC<RCRTSynonymsPlayerProps> = ({
  conceptName = 'Concept 2.4: Using Synonyms',
  unitTitle = 'Cambridge Primary English Stage 4/5 (Unit 2: Non-fiction - Biography)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Test State
  const [replacements, setReplacements] = useState<{ [taskId: string]: string }>({});
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
          'STEP 1: READ. A synonym is a word that means the same or nearly the same as another word. Use a thesaurus to find synonyms and avoid repeating the same word over and over. Choose a synonym that fits the exact context and tone of your biography!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Remember that synonyms replace overused words while keeping the correct meaning and tone.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Synonyms mean almost the same thing—use them to make biography writing rich and varied!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Put your memory to work! Replace the overused word "famous" in each sentence with the best matching synonym!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Using Synonyms with RCRT active recall and earned 3 stars!'
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

  const handleSelectSynonym = (taskId: string, chosenWord: string) => {
    const updated = { ...replacements, [taskId]: chosenWord };
    setReplacements(updated);

    const taskObj = TASKS.find((t) => t.id === taskId);
    const chosenOpt = taskObj?.options.find((o) => o.word === chosenWord);

    if (chosenOpt) {
      safeNarrate(chosenOpt.isCorrect ? `Excellent! "${chosenWord}" fits the context perfectly!` : `Try again: "${chosenWord}" does not mean the same as famous in this context.`);
    }

    if (Object.keys(updated).length === TASKS.length) {
      const allCorrect = TASKS.every((t) => {
        const word = updated[t.id];
        const opt = t.options.find((o) => o.word === word);
        return opt?.isCorrect;
      });

      if (allCorrect) {
        setTestCompleted(true);
        setStars((prev) => prev + 1);
        safeNarrate('All 3 sentences upgraded with rich synonyms! Active recall 100% accurate!');
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
                  Rule: Using Synonyms to Vary Writing
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Definition:</strong> A synonym is a word with the same or nearly the same meaning as another word.<br/>
                  • <strong>Purpose:</strong> Prevents flat, repetitive writing by adding variety.<br/>
                  • <strong>Thesaurus Tool:</strong> Lists synonyms for nouns, verbs, and adjectives.<br/>
                  • <strong>Context Match:</strong> Always pick a synonym that fits the exact sentence tone (e.g. <em>renowned, celebrated, well-known</em> for "famous").
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  📚 Example: Instead of repeating "famous", write "renowned sprinter", "celebrated scientist", or "well-known author"!
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
                The rule card is now hidden from view. No peeking! Lock synonym replacement rules in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Synonym rules stored in working memory...
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
                  "Synonyms mean almost the same thing—use them to make biography writing rich and varied!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Synonyms mean almost the same thing—use them to make biography writing rich and varied!');
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
                Ready for Step 4: Active Synonym Replacer Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Synonym Replacer
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Progress: {Object.keys(replacements).length} / {TASKS.length}
                </span>
              </div>

              <div className="space-y-4">
                {TASKS.map((task) => {
                  const currentWord = replacements[task.id];
                  return (
                    <div key={task.id} className="p-3.5 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 space-y-2.5">
                      <p className="text-xs font-bold text-[#16241f] leading-normal">
                        {task.sentenceBefore}{' '}
                        <span className="px-2 py-0.5 bg-[#9c6f1f]/20 text-[#9c6f1f] border border-[#9c6f1f]/40 rounded font-black">
                          {currentWord || `[${task.overusedWord}]`}
                        </span>{' '}
                        {task.sentenceAfter}
                      </p>

                      <div className="flex gap-2">
                        {task.options.map((opt) => (
                          <button
                            key={opt.word}
                            onClick={() => handleSelectSynonym(task.id, opt.word)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              currentWord === opt.word
                                ? opt.isCorrect
                                  ? 'bg-emerald-600 text-white shadow'
                                  : 'bg-red-500 text-white'
                                : 'bg-white text-[#16241f] border border-[#16241f]/20 hover:border-[#9c6f1f]'
                            }`}
                          >
                            {opt.word}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 All Sentences Upgraded with Rich Synonyms! Active recall 100% accurate!
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
          <div className="text-5xl">📚⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent active recall memory for Using Synonyms!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setReplacements({});
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

export default RCRTSynonymsPlayer;
