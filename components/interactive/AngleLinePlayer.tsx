import React, { useState, useEffect, useCallback } from 'react';

export interface AngleLinePlayerProps {
  conceptName?: string;
  unitTitle?: string;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
  onNarrate?: (text: string) => void;
}

type Phase = 'visual_intro' | 'demo' | 'checkpoint_quiz' | 'passed';

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
    questionText: 'If a straight line is divided into two angles and one angle measures 75 degrees, what is the missing angle?',
    options: [
      '105 degrees (because 180 minus 75 equals 105)',
      '90 degrees (because 180 minus 90 equals 90)',
      '115 degrees (because 180 minus 65 equals 115)'
    ],
    correctIndex: 0,
    hint: 'Because the angles on a straight line total 180 degrees, subtract the known angle 75 from 180: 180 - 75 = 105 degrees.'
  },
  {
    id: 2,
    questionText: 'How are angles of 35 degrees, 115 degrees, and 210 degrees classified?',
    options: [
      '35 degrees is obtuse, 115 degrees is acute, and 210 degrees is reflex',
      '35 degrees is acute, 115 degrees is obtuse, and 210 degrees is reflex',
      '35 degrees is reflex, 115 degrees is acute, and 210 degrees is obtuse'
    ],
    correctIndex: 1,
    hint: '35 degrees is acute (smaller than 90°), 115 degrees is obtuse (between 90° and 180°), and 210 degrees is reflex (larger than 180°).'
  },
  {
    id: 3,
    questionText: 'What is the total amount of turn formed when angles meet along a straight line?',
    options: [
      'A quarter turn of 90 degrees',
      'A full turn of 360 degrees',
      'A half turn that always adds up to 180 degrees'
    ],
    correctIndex: 2,
    hint: 'When angles meet along a straight line, they form a half turn that always adds up to 180 degrees.'
  }
];

export const AngleLinePlayer: React.FC<AngleLinePlayerProps> = ({
  conceptName = 'Concept 2.2: Identifying and Calculating Angles on a Line',
  unitTitle = 'Unit 2: Angles and Shapes (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [demoMode, setDemoMode] = useState<'straight_line' | 'classify_angles'>('straight_line');
  const [knownAngle, setKnownAngle] = useState<number>(75);
  const [activeAngleType, setActiveAngleType] = useState<35 | 115 | 210>(35);
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
    if (phase === 'visual_intro') {
      safeNarrate(
        'An angle measures the amount of turn between two lines meeting at a vertex. When angles meet along a straight line, they form a half turn that always adds up to 180 degrees. Because angles on a straight line total 180 degrees, you can find a missing angle by subtracting the known angle from 180.'
      );
    } else if (phase === 'demo') {
      if (demoMode === 'straight_line') {
        const missing = 180 - knownAngle;
        safeNarrate(
          `Known angle is ${knownAngle} degrees. Subtracting ${knownAngle} from 180 gives a missing angle of ${missing} degrees. A straight line always totals 180 degrees!`
        );
      } else {
        const desc =
          activeAngleType === 35
            ? '35 degrees is acute because it is smaller than a quarter turn of 90 degrees.'
            : activeAngleType === 115
            ? '115 degrees is obtuse because it is greater than 90 degrees but less than 180 degrees.'
            : '210 degrees is a reflex angle because it is larger than a straight line of 180 degrees.';
        safeNarrate(desc);
      }
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Identifying and Calculating Angles on a Line! You earned 3 stars!'
      );
    }
  }, [phase, demoMode, knownAngle, activeAngleType, quizIndex, safeNarrate]);

  const handleSelectDemoMode = (mode: 'straight_line' | 'classify_angles') => {
    setDemoMode(mode);
    if (mode === 'straight_line') {
      setKnownAngle(75);
      safeNarrate(
        'Known angle is 75 degrees. Subtracting 75 from 180 gives a missing angle of 105 degrees. A straight line always totals 180 degrees!'
      );
    } else {
      setActiveAngleType(35);
      safeNarrate(
        '35 degrees is acute because it is smaller than a quarter turn of 90 degrees.'
      );
    }
  };

  const handleToggleKnownAngle = (angle: number) => {
    setKnownAngle(angle);
    const missing = 180 - angle;
    safeNarrate(
      `Known angle is ${angle} degrees. Subtracting ${angle} from 180 gives a missing angle of ${missing} degrees. A straight line always totals 180 degrees!`
    );
  };

  const handleSelectAngleType = (angle: 35 | 115 | 210) => {
    setActiveAngleType(angle);
    const desc =
      angle === 35
        ? '35 degrees is acute because it is smaller than a quarter turn of 90 degrees.'
        : angle === 115
        ? '115 degrees is obtuse because it is greater than 90 degrees but less than 180 degrees.'
        : '210 degrees is a reflex angle because it is larger than a straight line of 180 degrees.';
    safeNarrate(desc);
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
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#16241f]/10">
        <div>
          <p className="text-xs uppercase font-bold tracking-wider text-[#9c6f1f]">{unitTitle}</p>
          <h2 className="text-lg font-bold text-[#16241f] mt-0.5">{conceptName}</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#9c6f1f]/10 rounded-full border border-[#9c6f1f]/30">
          <span className="text-base">⭐</span>
          <span className="text-sm font-bold text-[#9c6f1f]">{stars} Stars</span>
        </div>
      </div>

      {/* Phase 1: Visual Intro */}
      {phase === 'visual_intro' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm">
            <h3 className="text-sm font-bold text-[#9c6f1f] uppercase tracking-wide mb-1">
              Core Definition & Rules
            </h3>
            <p className="text-sm leading-relaxed text-[#16241f]">
              An angle measures the amount of turn between two lines meeting at a vertex. When angles meet along a straight line, they form a half turn that 
              <strong> always adds up to 180 degrees</strong>. Because angles on a straight line total 180 degrees, you can find a missing angle by <strong>subtracting the known angle from 180</strong>.
            </p>
          </div>

          {/* Real Source Examples Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Calculating Missing Angle Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Known angle = 75° ➔ Missing angle = 180° - 75° = 105°
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  105° + 75° = 180° (Half turn along a straight line).
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                📐 180° - 75°
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Angle Classifications
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  35° (Acute) | 115° (Obtuse) | 210° (Reflex)
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  Acute &lt; 90° | Obtuse 90°-180° | Reflex &gt; 180°
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                🔄 3 Types
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Angle Calculator Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-3">
            <button
              onClick={() => handleSelectDemoMode('straight_line')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'straight_line'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              📐 Straight Line (180° - 75° = 105°)
            </button>
            <button
              onClick={() => handleSelectDemoMode('classify_angles')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                demoMode === 'classify_angles'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              🔄 Classify (35°, 115°, 210°)
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            {demoMode === 'straight_line' ? (
              <div>
                <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-2">
                  Angles on a Straight Line Total 180°
                </h3>

                {/* SVG Straight Line Angle Diagram */}
                <div className="relative my-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 p-6 flex flex-col items-center">
                  <svg viewBox="0 0 300 140" className="w-full max-w-[280px] h-32 overflow-visible">
                    {/* Base Straight Line (180 degrees) */}
                    <line x1="20" y1="110" x2="280" y2="110" stroke="#16241f" strokeWidth="4" strokeLinecap="round" />
                    
                    {/* Vertex point */}
                    <circle cx="150" cy="110" r="5" fill="#16241f" />

                    {/* Dividing Ray for Known Angle (e.g. 75 degrees) */}
                    {knownAngle === 75 ? (
                      <line x1="150" y1="110" x2="210" y2="30" stroke="#9c6f1f" strokeWidth="4" strokeLinecap="round" />
                    ) : (
                      <line x1="150" y1="110" x2="190" y2="20" stroke="#9c6f1f" strokeWidth="4" strokeLinecap="round" />
                    )}

                    {/* Arc for Known Angle */}
                    <path
                      d="M 200 110 A 50 50 0 0 0 185 60"
                      fill="none"
                      stroke="#9c6f1f"
                      strokeWidth="3"
                      strokeDasharray="4 2"
                    />

                    {/* Arc for Missing Angle */}
                    <path
                      d="M 185 60 A 50 50 0 0 0 100 110"
                      fill="none"
                      stroke="#16241f"
                      strokeWidth="3"
                    />

                    {/* Text Labels */}
                    <text x="215" y="95" className="text-xs font-bold fill-[#9c6f1f]">{knownAngle}°</text>
                    <text x="80" y="80" className="text-sm font-black fill-[#16241f]">{180 - knownAngle}°</text>
                  </svg>

                  <div className="w-full grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2.5 bg-[#9c6f1f]/10 rounded-lg border border-[#9c6f1f]/30">
                      <span className="text-[10px] font-bold text-[#9c6f1f] uppercase block">Known Angle</span>
                      <span className="text-lg font-black text-[#9c6f1f]">{knownAngle}°</span>
                    </div>
                    <div className="p-2.5 bg-[#16241f]/10 rounded-lg border border-[#16241f]/20">
                      <span className="text-[10px] font-bold text-[#16241f]/60 uppercase block">Calculated Missing Angle</span>
                      <span className="text-lg font-black text-[#16241f]">{180 - knownAngle}°</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mt-3">
                  <button
                    onClick={() => handleToggleKnownAngle(75)}
                    className={`py-2 px-4 rounded-xl font-bold text-xs transition-all duration-200 ${
                      knownAngle === 75
                        ? 'bg-[#9c6f1f] text-white shadow-sm'
                        : 'bg-[#16241f]/5 text-[#16241f] border border-[#16241f]/10'
                    }`}
                  >
                    Known = 75° (Missing = 105°)
                  </button>
                  <button
                    onClick={() => handleToggleKnownAngle(60)}
                    className={`py-2 px-4 rounded-xl font-bold text-xs transition-all duration-200 ${
                      knownAngle === 60
                        ? 'bg-[#9c6f1f] text-white shadow-sm'
                        : 'bg-[#16241f]/5 text-[#16241f] border border-[#16241f]/10'
                    }`}
                  >
                    Known = 60° (Missing = 120°)
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xs font-bold text-[#16241f] uppercase tracking-wider mb-2">
                  Classifying Angles: Acute, Obtuse, and Reflex
                </h3>

                {/* Angle Classification Display */}
                <div className="my-4 p-6 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 flex flex-col items-center">
                  <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center min-w-[200px]">
                    <span className="text-3xl font-black text-[#9c6f1f] block mb-1">
                      {activeAngleType}°
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 bg-[#16241f] text-white rounded-full inline-block">
                      {activeAngleType === 35 ? 'Acute Angle (< 90°)' : activeAngleType === 115 ? 'Obtuse Angle (90°-180°)' : 'Reflex Angle (> 180°)'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleSelectAngleType(35)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all duration-200 ${
                      activeAngleType === 35
                        ? 'bg-[#9c6f1f] text-white shadow-sm'
                        : 'bg-white text-[#16241f] border border-[#16241f]/15'
                    }`}
                  >
                    35° (Acute)
                  </button>
                  <button
                    onClick={() => handleSelectAngleType(115)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all duration-200 ${
                      activeAngleType === 115
                        ? 'bg-[#9c6f1f] text-white shadow-sm'
                        : 'bg-white text-[#16241f] border border-[#16241f]/15'
                    }`}
                  >
                    115° (Obtuse)
                  </button>
                  <button
                    onClick={() => handleSelectAngleType(210)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all duration-200 ${
                      activeAngleType === 210
                        ? 'bg-[#9c6f1f] text-white shadow-sm'
                        : 'bg-white text-[#16241f] border border-[#16241f]/15'
                    }`}
                  >
                    210° (Reflex)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {demoMode === 'straight_line' ? (
                <>
                  If a straight line is divided into two angles and one angle measures {knownAngle} degrees, the missing angle is 180 minus {knownAngle}, which equals <strong>{180 - knownAngle} degrees</strong>.
                </>
              ) : (
                <>
                  {activeAngleType === 35 && <>An angle of <strong>35 degrees</strong> is acute because it is smaller than a quarter turn (90 degrees).</>}
                  {activeAngleType === 115 && <>An angle of <strong>115 degrees</strong> is obtuse because it is greater than 90 degrees but less than 180 degrees.</>}
                  {activeAngleType === 210 && <>An angle of <strong>210 degrees</strong> is reflex because it is larger than a straight line (180 degrees).</>}
                </>
              )}
            </p>
          </div>

          <button
            onClick={() => setPhase('checkpoint_quiz')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Start Checkpoint Quiz ➔
          </button>
        </div>
      )}

      {/* Phase 3: Checkpoint Quiz */}
      {phase === 'checkpoint_quiz' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f]">
              Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <div className="flex gap-1">
              {QUIZ_QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full ${
                    idx === quizIndex
                      ? 'bg-[#9c6f1f]'
                      : idx < quizIndex
                      ? 'bg-[#16241f]'
                      : 'bg-[#16241f]/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Box */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm">
            <h3 className="text-base font-bold text-[#16241f] leading-snug">
              {QUIZ_QUESTIONS[quizIndex].questionText}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
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
                  className={`w-full p-4 text-left font-semibold text-sm rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {isSelected && isCorrectIndex && <span>✨ Correct!</span>}
                </button>
              );
            })}
          </div>

          {/* Hint Card on Error */}
          {showHint && (
            <div className="p-4 bg-[#9c6f1f]/10 rounded-xl border border-[#9c6f1f]/30 text-xs font-medium text-[#16241f] animate-fade-in">
              <span className="font-bold text-[#9c6f1f] block mb-1">💡 Helpful Hint:</span>
              {QUIZ_QUESTIONS[quizIndex].hint}
            </div>
          )}
        </div>
      )}

      {/* Phase 4: Passed State */}
      {phase === 'passed' && (
        <div className="text-center py-8 space-y-5 animate-fade-in">
          <div className="text-5xl">🎉</div>
          <h3 className="text-xl font-black text-[#16241f]">Concept Mastered!</h3>
          <p className="text-sm text-[#16241f]/80 max-w-md mx-auto leading-relaxed">
            Awesome job! You successfully completed the checkpoint quiz for <strong>Identifying and Calculating Angles on a Line</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              A straight flat line is always 180 degrees, so just subtract the angle you know to find the one you don't!
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setKnownAngle(75);
                setActiveAngleType(35);
              }}
              className="py-3 px-6 bg-[#16241f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
            >
              🔄 Replay Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AngleLinePlayer;
