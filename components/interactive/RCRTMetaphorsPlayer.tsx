import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTMetaphorsPlayerProps {
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
    questionText: 'What is the key structural difference between a metaphor and a simile?',
    options: [
      'Metaphors state the comparison directly without using "like" or "as"; similes use "like" or "as"',
      'Metaphors must always rhyme',
      'Metaphors are only used in non-fiction reports'
    ],
    correctIndex: 0,
    hint: 'Look for the trigger words "like" or "as"! If they are absent, it is a direct metaphor.'
  },
  {
    id: 2,
    questionText: 'Which sentence below is a direct metaphor?',
    options: [
      'The moon was a silver coin in the sky.',
      'The moon was like a silver coin in the sky.',
      'The moon shone as bright as a silver coin.'
    ],
    correctIndex: 0,
    hint: '"The moon WAS a silver coin" directly calls the moon a coin without using "like" or "as"!'
  },
  {
    id: 3,
    questionText: 'Why do poets use metaphors in narrative poetry?',
    options: [
      'To create vivid mental pictures and emotional depth by connecting two different things with shared qualities',
      'To make poems harder to read',
      'To replace all verbs with adjectives'
    ],
    correctIndex: 0,
    hint: 'Metaphors paint powerful visual pictures in the reader\'s imagination!'
  }
];

interface SentenceCard {
  id: string;
  text: string;
  type: 'metaphor' | 'simile';
}

const SENTENCE_CARDS: SentenceCard[] = [
  { id: 'm1', text: 'The moon was a silver coin in the night sky.', type: 'metaphor' },
  { id: 'm2', text: 'The giant\'s voice was thunder booming across the valley.', type: 'metaphor' },
  { id: 'm3', text: 'Her eyes were stars guiding him home.', type: 'metaphor' },
  { id: 's1', text: 'The moon shone like a silver coin in the sky.', type: 'simile' },
  { id: 's2', text: 'His roar boomed as loud as thunder.', type: 'simile' },
  { id: 's3', text: 'Her smile was like sunshine on a rainy day.', type: 'simile' }
];

export const RCRTMetaphorsPlayer: React.FC<RCRTMetaphorsPlayerProps> = ({
  conceptName = 'Concept 3.4: Metaphors',
  unitTitle = 'Cambridge Primary English Stage 4/5 (Unit 3: Poetry)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Test State
  const [classifications, setClassifications] = useState<Record<string, 'metaphor' | 'simile'>>({});
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
          'STEP 1: READ. A metaphor describes one thing by directly calling it another thing without using "like" or "as". For example, "The moon was a silver coin in the sky" is a metaphor; "The moon was like a silver coin" is a simile!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Remember: metaphors state comparisons directly without "like" or "as".'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Metaphors call one thing another without using like or as!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Put your memory to work! Classify each poetic line as a Metaphor or a Simile!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Metaphors with RCRT active recall and earned 3 stars!'
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

  const handleClassify = (id: string, choice: 'metaphor' | 'simile') => {
    const updated = { ...classifications, [id]: choice };
    setClassifications(updated);

    const card = SENTENCE_CARDS.find((c) => c.id === id);
    if (card && card.type === choice) {
      safeNarrate(`Correct! "${card.text}" is a ${choice}!`);
    } else {
      safeNarrate(`Try again for "${card?.text}". Look for 'like' or 'as'!`);
    }

    if (Object.keys(updated).length === SENTENCE_CARDS.length) {
      const allCorrect = SENTENCE_CARDS.every((c) => updated[c.id] === c.type);
      if (allCorrect) {
        setTestCompleted(true);
        setStars((prev) => prev + 1);
        safeNarrate('All lines classified correctly! You mastered Metaphors vs. Similes!');
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
          <div className={`p-2 rounded-xl border-2 font-bold text-xs transition-all ${rcrtStep === 'TEST' ? 'bg-[#16241f] text-white border-[#16241f] shadow-md scale-105' : 'bg-white text-[#16241f]/40 border-[#16241f]/15'}`}>
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
                  Rule: Metaphors vs. Similes
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Metaphor:</strong> States a direct comparison by calling one thing another (NO "like" or "as").<br/>
                  &nbsp;&nbsp;<em>Example: "The moon was a silver coin in the sky."</em><br/>
                  • <strong>Simile:</strong> Uses "like" or "as" to compare two things.<br/>
                  &nbsp;&nbsp;<em>Example: "The moon was LIKE a silver coin in the sky."</em>
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  ✨ Key Test: If "like" or "as" is present ➔ Simile. If absent ➔ Metaphor!
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
                The rule card is now hidden from view. No peeking! Lock the metaphor comparison rule in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Metaphor rule locked in memory...
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
                  "Metaphors call one thing another without using like or as!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Metaphors call one thing another without using like or as!');
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
                Ready for Step 4: Metaphor Classifier Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Metaphor vs. Simile Classifier
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Classified: {Object.keys(classifications).length}/{SENTENCE_CARDS.length}
                </span>
              </div>

              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 space-y-3">
                <p className="text-xs font-bold text-[#16241f] text-center">
                  Classify each line as a <strong>Metaphor</strong> or a <strong>Simile</strong>:
                </p>

                <div className="space-y-2">
                  {SENTENCE_CARDS.map((card) => {
                    const currentChoice = classifications[card.id];
                    const isCorrect = currentChoice === card.type;

                    return (
                      <div
                        key={card.id}
                        className={`p-3 bg-white rounded-xl border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-2 ${
                          currentChoice
                            ? isCorrect
                              ? 'border-emerald-500 bg-emerald-50/50'
                              : 'border-red-400 bg-red-50/50'
                            : 'border-[#16241f]/15'
                        }`}
                      >
                        <span className="text-xs font-semibold text-[#16241f] text-center sm:text-left">
                          "{card.text}"
                        </span>

                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => handleClassify(card.id, 'metaphor')}
                            className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all ${
                              currentChoice === 'metaphor'
                                ? 'bg-[#16241f] text-white shadow'
                                : 'bg-gray-100 text-[#16241f]/70 hover:bg-gray-200'
                            }`}
                          >
                            ✨ Metaphor
                          </button>
                          <button
                            onClick={() => handleClassify(card.id, 'simile')}
                            className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all ${
                              currentChoice === 'simile'
                                ? 'bg-[#9c6f1f] text-white shadow'
                                : 'bg-gray-100 text-[#16241f]/70 hover:bg-gray-200'
                            }`}
                          >
                            🔍 Simile
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 All Poetic Lines Classified Correctly! Active recall 100% accurate!
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
          <div className="text-5xl">✨⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent active recall memory for Metaphors!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setClassifications({});
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

export default RCRTMetaphorsPlayer;
