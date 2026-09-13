import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTFeaturesOfNarrativePoemPlayerProps {
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
    questionText: 'What is the single defining feature that makes a poem a narrative poem?',
    options: [
      'It tells a complete story with characters, setting, and plot events in verse',
      'It must always rhyme every two lines',
      'It contains only factual non-fiction information'
    ],
    correctIndex: 0,
    hint: 'Narrative means story! A narrative poem always tells a story with characters and plot.'
  },
  {
    id: 2,
    questionText: 'Is rhyming mandatory for a poem to be classified as a narrative poem?',
    options: [
      'No, rhyme is optional—a narrative poem can be written in free or rhythmic verse without rhyming',
      'Yes, all narrative poems must rhyme',
      'Yes, every line must end with the exact same word'
    ],
    correctIndex: 0,
    hint: 'Some narrative poems rhyme and others do not, but they all tell a story!'
  },
  {
    id: 3,
    questionText: 'How is the rhythm of a narrative poem primarily created?',
    options: [
      'By the pattern and number of syllables per line',
      'By adding bold punctuation at the end of every stanza',
      'By using as many long words as possible'
    ],
    correctIndex: 0,
    hint: 'The number of syllables per line sets the musical beat and rhythm of verse!'
  }
];

interface FeatureCard {
  id: string;
  text: string;
  category: 'narrative' | 'non_narrative';
}

const FEATURE_CARDS: FeatureCard[] = [
  { id: 'f1', text: 'Tells a complete story with characters & plot', category: 'narrative' },
  { id: 'f2', text: 'Written in verse lines with syllable rhythm', category: 'narrative' },
  { id: 'f3', text: 'Rhyme is optional (can rhyme or not)', category: 'narrative' },
  { id: 'f4', text: 'Expresses a single emotion without any story', category: 'non_narrative' },
  { id: 'f5', text: 'Lists encyclopedia facts in numbered paragraphs', category: 'non_narrative' },
  { id: 'f6', text: 'A instruction manual for building furniture', category: 'non_narrative' }
];

export const RCRTFeaturesOfNarrativePoemPlayer: React.FC<RCRTFeaturesOfNarrativePoemPlayerProps> = ({
  conceptName = 'Concept 3.1: Features of a Narrative Poem',
  unitTitle = 'Cambridge Primary English Stage 4/5 (Unit 3: Poetry)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Test State
  const [classifications, setClassifications] = useState<Record<string, 'narrative' | 'non_narrative'>>({});
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
          'STEP 1: READ. A narrative poem is a poem that tells a complete story, with characters, a setting, and a sequence of events written in verse lines. Rhyme is optional, but syllable counts give it rhythm!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Store the key features of narrative poetry in working memory.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "A narrative poem tells a story in verse—rhyme is optional, rhythm comes from syllables!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Put your memory to work! Tap each card to classify it as a Narrative Poem Feature or Non-Narrative Feature!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Features of a Narrative Poem with RCRT active recall and earned 3 stars!'
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

  const handleClassify = (cardId: string, choice: 'narrative' | 'non_narrative') => {
    const updated = { ...classifications, [cardId]: choice };
    setClassifications(updated);

    const card = FEATURE_CARDS.find((c) => c.id === cardId);
    if (card && card.category === choice) {
      safeNarrate(`Correct! "${card.text}" is classified as ${choice === 'narrative' ? 'Narrative Poem' : 'Non-Narrative'}.`);
    } else {
      safeNarrate(`Try again for "${card?.text}".`);
    }

    if (Object.keys(updated).length === FEATURE_CARDS.length) {
      const allCorrect = FEATURE_CARDS.every((c) => updated[c.id] === c.category);
      if (allCorrect) {
        setTestCompleted(true);
        setStars((prev) => prev + 1);
        safeNarrate('All features classified correctly! You know what makes a poem a narrative poem!');
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
                  Rule: What is a Narrative Poem?
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Story in Verse:</strong> A narrative poem tells a complete story with characters, a setting, and a sequence of events.<br/>
                  • <strong>Rhyme is Optional:</strong> Some narrative poems rhyme, others do not—telling a story is what matters!<br/>
                  • <strong>Syllable Rhythm:</strong> The number of syllables per line creates the poem's musical beat and flow.<br/>
                  • <strong>Example:</strong> <em>"The Highwayman"</em> tells a dramatic story of love and danger in verse.
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  📜 Rule: Narrative Poem = Complete Story + Characters + Setting in Verse Lines
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
                The rule card is now hidden from view. No peeking! Lock the features of narrative poetry in working memory.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Features locked in memory...
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
                  "A narrative poem tells a story in verse—rhyme is optional, rhythm comes from syllables!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('A narrative poem tells a story in verse—rhyme is optional, rhythm comes from syllables!');
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
                Ready for Step 4: Feature Classifier Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Interactive Feature Classifier
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Classified: {Object.keys(classifications).length}/{FEATURE_CARDS.length}
                </span>
              </div>

              <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 space-y-3">
                <p className="text-xs font-bold text-[#16241f] text-center">
                  Classify each feature as <strong>Narrative Poem</strong> or <strong>Non-Narrative</strong>:
                </p>

                <div className="space-y-2">
                  {FEATURE_CARDS.map((card) => {
                    const currentChoice = classifications[card.id];
                    const isCorrect = currentChoice === card.category;

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
                        <span className="text-xs font-bold text-[#16241f] text-center sm:text-left">
                          {card.text}
                        </span>

                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => handleClassify(card.id, 'narrative')}
                            className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all ${
                              currentChoice === 'narrative'
                                ? 'bg-[#16241f] text-white shadow'
                                : 'bg-gray-100 text-[#16241f]/70 hover:bg-gray-200'
                            }`}
                          >
                            📜 Narrative Poem
                          </button>
                          <button
                            onClick={() => handleClassify(card.id, 'non_narrative')}
                            className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all ${
                              currentChoice === 'non_narrative'
                                ? 'bg-[#9c6f1f] text-white shadow'
                                : 'bg-gray-100 text-[#16241f]/70 hover:bg-gray-200'
                            }`}
                          >
                            🚫 Non-Narrative
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 All Features Classified Correctly! Active recall 100% accurate!
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
          <div className="text-5xl">📜⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent active recall memory for Features of a Narrative Poem!
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

export default RCRTFeaturesOfNarrativePoemPlayer;
