import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTPersonificationPlayerProps {
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
    questionText: 'What is the definition of personification in poetry?',
    options: [
      'Giving human qualities, actions, or feelings to non-human things (like nature or objects)',
      'Rhyming the last word of every line',
      'Writing an official biography of a real person'
    ],
    correctIndex: 0,
    hint: 'Personification gives human traits ("person") to non-human things!'
  },
  {
    id: 2,
    questionText: 'In the sentence "The wind howled angrily through the trees", what human traits are given to the wind?',
    options: [
      'Human emotion (angry) and human-like action (howling)',
      'Human clothing and shoes',
      'Human mathematical calculations'
    ],
    correctIndex: 0,
    hint: 'Anger is a human feeling, and howling is a human-like action given to non-human wind!'
  },
  {
    id: 3,
    questionText: 'How does personification help a poem?',
    options: [
      'It creates vivid mood, atmosphere, and emotional connection for the reader',
      'It makes the poem shorter',
      'It removes all adjectives from the stanza'
    ],
    correctIndex: 0,
    hint: 'Personification makes scenes come alive with human feelings and atmospheric mood!'
  }
];

interface PersonificationPair {
  id: string;
  subject: string;
  humanAction: string;
  completedLine: string;
}

const PAIRS: PersonificationPair[] = [
  { id: 'p1', subject: 'The angry wind', humanAction: 'howled through the dark trees', completedLine: 'The angry wind howled through the dark trees.' },
  { id: 'p2', subject: 'The cheerful stars', humanAction: 'danced playfully in the night sky', completedLine: 'The cheerful stars danced playfully in the night sky.' },
  { id: 'p3', subject: 'The old camera', humanAction: 'winked its glass eye at the crowd', completedLine: 'The old camera winked its glass eye at the crowd.' }
];

export const RCRTPersonificationPlayer: React.FC<RCRTPersonificationPlayerProps> = ({
  conceptName = 'Concept 3.5: Personification',
  unitTitle = 'Cambridge Primary English Stage 4/5 (Unit 3: Poetry)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Test State
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
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
          'STEP 1: READ. Personification gives human qualities, actions, or feelings to non-human things like objects, animals, or nature. For example, "The wind howled angrily through the trees" gives the wind human anger!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Remember: personification gives human actions or feelings to non-human things.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Personification gives human feelings and actions to non-human things!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Put your memory to work! Match each non-human subject on the left to its human action on the right!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Personification with RCRT active recall and earned 3 stars!'
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

  const handleSubjectClick = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedSubject(id);
    const item = PAIRS.find((p) => p.id === id);
    if (item) {
      safeNarrate(`Selected subject: "${item.subject}". Now tap its matching human action!`);
    }
  };

  const handleActionClick = (id: string) => {
    if (!selectedSubject) {
      safeNarrate('Select a non-human subject on the left first!');
      return;
    }

    if (selectedSubject === id) {
      const updated = [...matchedPairs, id];
      setMatchedPairs(updated);
      setSelectedSubject(null);
      const matched = PAIRS.find((p) => p.id === id);
      if (matched) {
        safeNarrate(`Matched! "${matched.completedLine}"`);
      }

      if (updated.length === PAIRS.length) {
        setTestCompleted(true);
        setStars((prev) => prev + 1);
        safeNarrate('All 3 personification lines matched perfectly!');
      }
    } else {
      safeNarrate('Not quite the right match. Try selecting the matching human action!');
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
                  Rule: What is Personification?
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Human Traits to Non-Humans:</strong> Personification gives human actions, feelings, or qualities to non-human objects, animals, or weather.<br/>
                  • <strong>Creates Atmosphere:</strong> <em>"The wind howled angrily through the trees"</em> gives the wind human anger, creating a tense, stormy mood.<br/>
                  • <strong>Poetic Effect:</strong> Brings non-human elements alive in the reader's imagination!
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  🌬️ Personification Rule: Non-human subject + Human feeling/action = Personification!
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
                The rule card is now hidden from view. No peeking! Lock the personification rule in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Rule locked in memory...
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
                  "Personification gives human feelings and actions to non-human things!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Personification gives human feelings and actions to non-human things!');
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
                Ready for Step 4: Personification Matcher Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Personification Matcher
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Matched: {matchedPairs.length}/{PAIRS.length}
                </span>
              </div>

              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 space-y-3">
                <p className="text-xs font-bold text-[#16241f] text-center">
                  Tap a non-human subject on the left, then tap its matching human action on the right:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Left Column: Non-Human Subjects */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-[#9c6f1f] uppercase block text-center">
                      Non-Human Subject
                    </span>
                    {PAIRS.map((item) => {
                      const isMatched = matchedPairs.includes(item.id);
                      const isSelected = selectedSubject === item.id;

                      return (
                        <button
                          key={item.id}
                          disabled={isMatched}
                          onClick={() => handleSubjectClick(item.id)}
                          className={`w-full p-3 rounded-xl border-2 font-bold text-xs text-left transition-all ${
                            isMatched
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-400 opacity-60'
                              : isSelected
                              ? 'bg-[#16241f] text-white border-[#16241f] shadow-md scale-102'
                              : 'bg-white text-[#16241f] border-[#16241f]/15 hover:border-[#9c6f1f]'
                          }`}
                        >
                          {item.subject} {isMatched && '✅'}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: Human Actions */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-[#9c6f1f] uppercase block text-center">
                      Human Action / Feeling
                    </span>
                    {[...PAIRS]
                      .reverse() // Shuffle visual order slightly
                      .map((item) => {
                        const isMatched = matchedPairs.includes(item.id);

                        return (
                          <button
                            key={item.id}
                            disabled={isMatched}
                            onClick={() => handleActionClick(item.id)}
                            className={`w-full p-3 rounded-xl border-2 font-bold text-xs text-left transition-all ${
                              isMatched
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-400 opacity-60'
                                : 'bg-white text-[#16241f] border-[#16241f]/15 hover:border-[#9c6f1f]'
                            }`}
                          >
                            {item.humanAction} {isMatched && '✅'}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Matched Completed Lines */}
                {matchedPairs.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase block">Completed Personification Lines:</span>
                    {matchedPairs.map((id) => {
                      const p = PAIRS.find((pair) => pair.id === id);
                      return p ? (
                        <div key={id} className="p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-900">
                          ✨ "{p.completedLine}"
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 All Personification Lines Matched Perfectly! Active recall 100% accurate!
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
          <div className="text-5xl">🌬️⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent active recall memory for Personification!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setSelectedSubject(null);
              setMatchedPairs([]);
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

export default RCRTPersonificationPlayer;
