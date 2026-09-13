import React, { useState, useEffect, useCallback } from 'react';

export interface RCRTExplicitMeaningPlayerProps {
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
    questionText: 'What is explicit meaning in a passage?',
    options: [
      'Meaning directly and clearly stated in the text with no guessing needed',
      'Hidden clues that require guessing',
      'The secret background music of a story'
    ],
    correctIndex: 0,
    hint: 'Explicit meaning is right there on the page—stated directly without needing to read between the lines!'
  },
  {
    id: 2,
    questionText: 'Which of the following is an example of EXPLICIT meaning?',
    options: [
      ' "She was feeling angry and tired."',
      ' "She slammed the heavy wooden door shut."',
      ' "He tapped his foot repeatedly on the floor."'
    ],
    correctIndex: 0,
    hint: '"She was feeling angry" directly names the emotion, making it explicit!'
  },
  {
    id: 3,
    questionText: 'Why do authors use explicit statements in instructions or key facts?',
    options: [
      'To provide absolute certainty and clarity so nothing is misunderstood',
      'To make the reader guess endlessly',
      'To hide facts from the reader'
    ],
    correctIndex: 0,
    hint: 'Explicit statements leave no room for confusion—they state facts directly!'
  }
];

interface MeaningCard {
  id: string;
  text: string;
  isExplicit: boolean;
}

const MEANING_CARDS: MeaningCard[] = [
  { id: '1', text: '📢 "She was feeling angry and disappointed."', isExplicit: true },
  { id: '2', text: '🏁 "The tortoise crossed the finish line in first place."', isExplicit: true },
  { id: '3', text: '👣 "He stomped his feet and crossed his arms tightly."', isExplicit: false },
  { id: '4', text: '😮 "Her eyes widened as her mouth fell wide open."', isExplicit: false }
];

export const RCRTExplicitMeaningPlayer: React.FC<RCRTExplicitMeaningPlayerProps> = ({
  conceptName = 'Concept 1.3: Explicit Meaning (Directly Stated)',
  unitTitle = 'Cambridge Primary English Stage 4/5 (Unit 1: Fiction - Stories from Cultures)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('rcrt_loop');
  const [rcrtStep, setRcrtStep] = useState<RCRTStep>('READ');

  // Interactive Test State (Classifier)
  const [explicitList, setExplicitList] = useState<string[]>([]);
  const [implicitList, setImplicitList] = useState<string[]>([]);
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
          'STEP 1: READ. Explicit meaning is directly and clearly stated in the text—nothing needs to be inferred or guessed. For example, "She was angry" is explicit because it directly states the emotion!'
        );
      } else if (rcrtStep === 'COVER') {
        safeNarrate(
          'STEP 2: COVER. The rule card is now hidden! Store the rule in working memory: explicit meaning directly states facts with no reading between the lines required.'
        );
      } else if (rcrtStep === 'RECITE') {
        safeNarrate(
          'STEP 3: RECITE. Say the rule aloud: "Explicit meaning is directly stated, no guessing needed!" Tap the button when ready.'
        );
      } else if (rcrtStep === 'TEST') {
        safeNarrate(
          'STEP 4: TEST! Put your memory to work! Tap each statement card to classify it as Explicit Meaning or Implicit Meaning!'
        );
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      safeNarrate(`Checkpoint Question ${q.id}: ${q.questionText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Explicit Meaning with RCRT active recall and earned 3 stars!'
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

  const handleClassify = (card: MeaningCard, category: 'explicit' | 'implicit') => {
    if (explicitList.includes(card.id) || implicitList.includes(card.id)) return;

    if (category === 'explicit' && card.isExplicit) {
      const nextExplicit = [...explicitList, card.id];
      setExplicitList(nextExplicit);
      safeNarrate(`Correct! "${card.text}" is directly stated explicit meaning.`);
      checkTestCompletion(nextExplicit, implicitList);
    } else if (category === 'implicit' && !card.isExplicit) {
      const nextImplicit = [...implicitList, card.id];
      setImplicitList(nextImplicit);
      safeNarrate(`Correct! "${card.text}" gives action clues, so it is implicit meaning.`);
      checkTestCompletion(explicitList, nextImplicit);
    } else {
      safeNarrate('Try again! If a sentence names the feeling directly (e.g. "was angry"), it is explicit. If it shows actions (e.g. "stomped feet"), it is implicit.');
    }
  };

  const checkTestCompletion = (exp: string[], imp: string[]) => {
    if (exp.length === 2 && imp.length === 2) {
      setTestCompleted(true);
      setStars((prev) => prev + 1);
      safeNarrate('Fantastic! You correctly classified all explicit and implicit statements!');
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
                  Rule: Explicit Meaning (Directly Stated)
                </h3>
                <p className="text-xs text-[#16241f] leading-relaxed">
                  • <strong>Direct Statements:</strong> Directly and clearly stated in text—no guessing required.<br/>
                  • <strong>Zero Ambiguity:</strong> Writers use it for instructions, facts, and certainty.<br/>
                  • <strong>Contrast:</strong> "She was angry" = Explicit. "She slammed the door" = Implicit.
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg text-center font-bold text-xs text-[#9c6f1f]">
                  📢 Explicit Rule: Direct Facts ("She was angry") ➔ Clear & Stated!
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
                The rule card is now hidden from view. No peeking! Remember: explicit statements directly name facts with no inference required.
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs font-mono text-amber-200">
                🔒 Rule stored in memory...
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
                  "Explicit meaning is directly stated, no guessing needed!"
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setReciteSpoken(true);
                    safeNarrate('Explicit meaning is directly stated, no guessing needed!');
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
                Ready for Step 4: Active Classification Test 🚀 ➔
              </button>
            </div>
          )}

          {/* STEP 4: TEST (HANDS-ON TAP-TO-CLASSIFY CANVAS) */}
          {rcrtStep === 'TEST' && (
            <div className="p-5 bg-white rounded-2xl border-2 border-[#16241f]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider">
                  🎯 Step 4: Hands-On Statement Classifier
                </span>
                <span className="text-xs font-bold text-[#16241f]">
                  Progress: {explicitList.length + implicitList.length} / 4
                </span>
              </div>

              <div className="space-y-3">
                {MEANING_CARDS.map((card) => {
                  const isExp = explicitList.includes(card.id);
                  const isImp = implicitList.includes(card.id);
                  const isDone = isExp || isImp;

                  return (
                    <div
                      key={card.id}
                      className={`p-3.5 rounded-xl border-2 transition-all ${
                        isDone ? 'bg-gray-50 border-gray-300 opacity-80' : 'bg-[#f4f6f1] border-[#16241f]/15'
                      }`}
                    >
                      <p className="text-xs font-bold text-[#16241f] mb-2">{card.text}</p>
                      {!isDone ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleClassify(card, 'explicit')}
                            className="flex-1 py-1.5 bg-[#9c6f1f] text-white font-bold text-[11px] rounded-lg shadow hover:bg-[#9c6f1f]/90"
                          >
                            📢 Explicit (Direct)
                          </button>
                          <button
                            onClick={() => handleClassify(card, 'implicit')}
                            className="flex-1 py-1.5 bg-[#16241f] text-white font-bold text-[11px] rounded-lg shadow hover:bg-[#16241f]/90"
                          >
                            🕵️ Implicit (Clues)
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] font-black text-emerald-700">
                          {isExp ? '📢 Classified as EXPLICIT (Directly Stated)' : '🕵️ Classified as IMPLICIT (Action Clues)'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {testCompleted && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-500/30 animate-bounce">
                  🎉 Outstanding! You correctly distinguished all explicit and implicit statements!
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
          <div className="text-5xl">📢⭐</div>
          <h3 className="text-xl font-black text-[#16241f]">RCRT Method Mastered!</h3>
          <p className="text-xs text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            By Reading, Covering, Reciting, and Testing without looking, you built permanent memory for Explicit Meaning!
          </p>

          <button
            onClick={() => {
              setPhase('rcrt_loop');
              setRcrtStep('READ');
              setExplicitList([]);
              setImplicitList([]);
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

export default RCRTExplicitMeaningPlayer;
