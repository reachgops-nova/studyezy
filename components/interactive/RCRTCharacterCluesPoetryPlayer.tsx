import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTCharacterCluesPoetryPlayerProps {
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
    questionText: 'How do poets usually reveal what a character is like in a narrative poem?',
    options: [
      'Indirectly through character actions, dialogue, and what others say',
      'By writing a dictionary definition at the start of the poem',
      'By listing the character\'s height and shoe size'
    ],
    correctIndex: 0,
    hint: 'Show, don\'t tell! Poets reveal personality through speech, deeds, and others\' reactions.'
  },
  {
    id: 2,
    questionText: 'If a poem states a character "charged into danger while others ran away", what clue type is this?',
    options: [
      'An action clue showing courage',
      'A rhyming dictionary clue',
      'A setting description clue'
    ],
    correctIndex: 0,
    hint: 'Running toward danger is something the character DOES—which is an action clue!'
  },
  {
    id: 3,
    questionText: 'Why is dialogue ("what a character says") a powerful clue in poetry?',
    options: [
      'Speech reveals a character\'s true feelings, motives, and attitude directly from their own mouth',
      'Dialogue makes sentences longer',
      'Dialogue is only used to teach grammar rules'
    ],
    correctIndex: 0,
    hint: 'What characters say out loud shows how they think, feel, and react to events!'
  }
];

interface PoemClue {
  id: string;
  text: string;
  type: 'action' | 'dialogue' | 'others';
  label: string;
}

const POEM_CLUES: PoemClue[] = [
  { id: 'c1', text: '"charged straight into the dark cave"', type: 'action', label: 'Action Clue (What he did)' },
  { id: 'c2', text: '"shouting \'I will never back down!\'"', type: 'dialogue', label: 'Dialogue Clue (What he said)' },
  { id: 'c3', text: '"while others cowered in fear"', type: 'others', label: 'Others\' Reaction (How others acted)' }
];

export const RCRTCharacterCluesPoetryPlayer: React.FC<RCRTCharacterCluesPoetryPlayerProps> = ({
  conceptName = 'Concept 3.2: Revealing Character Through Clues',
  unitTitle = 'Cambridge Primary English Stage 4/5 (Unit 3: Poetry)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Test State
  const [selectedClues, setSelectedClues] = useState<string[]>([]);
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
          'STEP 1: READ. Poets reveal what a character is like indirectly through clues: what the character says, what they do, and what others say about them!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Store the three character clue types (speech, action, others) in working memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Character clues come from speech, actions, and what others say!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Put your memory to work! Tap all 3 character clues in the verse to reveal the character trait!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Revealing Character Through Clues with RCRT active recall and earned 3 stars!'
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

  const handleClueTap = (id: string) => {
    if (selectedClues.includes(id)) return;
    const updated = [...selectedClues, id];
    setSelectedClues(updated);

    const clue = POEM_CLUES.find((c) => c.id === id);
    if (clue) {
      safeNarrate(`Spotted ${clue.label}: ${clue.text}!`);
    }

    if (updated.length === POEM_CLUES.length) {
      setTestCompleted(true);
      setStars((prev) => prev + 1);
      safeNarrate('All 3 character clues spotted! Inferred trait unlocked: BRAVE and COURAGEOUS!');
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
                  Rule: Revealing Character Through Clues
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  Poets reveal what a character is like indirectly through 3 main clue types:<br/>
                  • <strong>Dialogue:</strong> What the character says.<br/>
                  • <strong>Actions:</strong> What the character does.<br/>
                  • <strong>Others' Reactions:</strong> What other characters say or how they react.
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  🔍 Example: Instead of saying "He was brave", the poet shows him running toward danger while others run away!
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
                The rule card is now hidden from view. No peeking! Lock the 3 character clue types (speech, action, others) in memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Clue types locked in memory...
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
                  "Character clues come from speech, actions, and what others say!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Character clues come from speech, actions, and what others say!');
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
                Ready for Step 4: Poetic Clue Spotter Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Poetic Clue Spotter
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Clues Found: {selectedClues.length}/3
                </span>
              </div>

              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 space-y-3">
                <p className="text-xs font-bold text-[#16241f] text-center">
                  Read the verse excerpt below. Tap the 3 character clues to reveal the trait:
                </p>

                <div className="p-4 bg-white rounded-xl border border-[#16241f]/20 font-serif text-sm leading-relaxed space-y-2 text-[#16241f]">
                  <p>
                    The brave knight{' '}
                    <button
                      onClick={() => handleClueTap('c1')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                        selectedClues.includes('c1')
                          ? 'bg-emerald-200 text-emerald-900 border border-emerald-500'
                          : 'bg-amber-100 hover:bg-amber-200 text-[#9c6f1f]'
                      }`}
                    >
                      "charged straight into the dark cave"
                    </button>{' '}
                    <button
                      onClick={() => handleClueTap('c3')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                        selectedClues.includes('c3')
                          ? 'bg-emerald-200 text-emerald-900 border border-emerald-500'
                          : 'bg-amber-100 hover:bg-amber-200 text-[#9c6f1f]'
                      }`}
                    >
                      "while others cowered in fear"
                    </button>
                    ,{' '}
                    <button
                      onClick={() => handleClueTap('c2')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                        selectedClues.includes('c2')
                          ? 'bg-emerald-200 text-emerald-900 border border-emerald-500'
                          : 'bg-amber-100 hover:bg-amber-200 text-[#9c6f1f]'
                      }`}
                    >
                      "shouting 'I will never back down!'"
                    </button>
                  </p>
                </div>

                {/* Unlocked Clues Display */}
                <div className="space-y-1.5 pt-2">
                  {POEM_CLUES.map((clue) => {
                    const isFound = selectedClues.includes(clue.id);
                    return (
                      <div
                        key={clue.id}
                        className={`p-2 rounded-lg text-xs flex justify-between items-center transition-all ${
                          isFound
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <span>{clue.label}: {clue.text}</span>
                        <span>{isFound ? '✅ Spotted' : '🔒 Tap phrase above'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Character Trait Unlocked: BRAVE & COURAGEOUS! Active recall 100% accurate!
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
          <div className="text-5xl">🔍⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent active recall memory for Revealing Character Through Clues!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setSelectedClues([]);
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

export default RCRTCharacterCluesPoetryPlayer;
