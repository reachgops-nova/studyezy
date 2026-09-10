import React, { useState, useEffect, useCallback } from 'react';

export interface TriangleClassifyPlayerProps {
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
    questionText: 'How is a triangle with side lengths of 6 cm, 6 cm, and 4 cm classified?',
    options: [
      'An isosceles triangle because 2 sides are equal in length',
      'An equilateral triangle because all 3 sides are equal',
      'A scalene triangle because all 3 sides have different lengths'
    ],
    correctIndex: 0,
    hint: 'A triangle with sides measuring 6 cm, 6 cm, and 4 cm is an isosceles triangle because 2 sides are equal in length.'
  },
  {
    id: 2,
    questionText: 'How is a triangle with side lengths of 3 cm, 5 cm, and 7 cm classified?',
    options: [
      'An isosceles triangle with 1 line of symmetry',
      'A scalene triangle with 0 lines of symmetry because all 3 sides have different lengths',
      'An equilateral triangle with 3 lines of symmetry'
    ],
    correctIndex: 1,
    hint: 'A triangle with sides measuring 3 cm, 5 cm, and 7 cm is scalene because all 3 sides have different lengths and no lines of symmetry.'
  },
  {
    id: 3,
    questionText: 'What are the key properties of an equilateral triangle?',
    options: [
      '2 equal sides, 2 matching angles, and 1 line of symmetry',
      '3 sides of different lengths and 0 lines of symmetry',
      '3 sides of equal length, 3 equal angles, and 3 lines of symmetry'
    ],
    correctIndex: 2,
    hint: 'An equilateral triangle has 3 sides of equal length, 3 equal angles, and 3 lines of symmetry.'
  }
];

export const TriangleClassifyPlayer: React.FC<TriangleClassifyPlayerProps> = ({
  conceptName = 'Concept 2.3: Classifying Triangles and Their Properties',
  unitTitle = 'Unit 2: Angles and Shapes (Cambridge Primary Math Stage 4)',
  onSuccess,
  onAttempt,
  onNarrate
}) => {
  const [phase, setPhase] = useState<Phase>('visual_intro');
  const [triangleType, setTriangleType] = useState<'isosceles' | 'scalene' | 'equilateral'>('isosceles');
  const [showSymmetryLines, setShowSymmetryLines] = useState<boolean>(true);
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
        'Triangles are 3-sided 2D shapes that can be sorted into categories based on their side lengths and angle sizes. An equilateral triangle has 3 equal sides and 3 lines of symmetry. An isosceles triangle has 2 equal sides and 1 line of symmetry. A scalene triangle has 3 different side lengths and no lines of symmetry.'
      );
    } else if (phase === 'demo') {
      const desc =
        triangleType === 'isosceles'
          ? 'Isosceles triangle with sides measuring 6 cm, 6 cm, and 4 cm. It has 2 equal sides, 2 matching angles, and 1 line of symmetry.'
          : triangleType === 'scalene'
          ? 'Scalene triangle with sides measuring 3 cm, 5 cm, and 7 cm. It has 3 sides of different lengths and 0 lines of symmetry.'
          : 'Equilateral triangle with 3 equal sides, 3 equal angles, and 3 lines of symmetry.';
      safeNarrate(desc);
    } else if (phase === 'checkpoint_quiz') {
      const q = QUIZ_QUESTIONS[quizIndex];
      const optionsText = q.options.map((opt, idx) => `Option ${idx + 1}: ${opt}`).join('. ');
      safeNarrate(`Question ${q.id}: ${q.questionText} ${optionsText}`);
    } else if (phase === 'passed') {
      safeNarrate(
        'Congratulations! You mastered Classifying Triangles and Their Properties! You earned 3 stars!'
      );
    }
  }, [phase, triangleType, quizIndex, safeNarrate]);

  const handleSelectTriangleType = (type: 'isosceles' | 'scalene' | 'equilateral') => {
    setTriangleType(type);
    const desc =
      type === 'isosceles'
        ? 'Isosceles triangle with sides measuring 6 cm, 6 cm, and 4 cm. It has 2 equal sides, 2 matching angles, and 1 line of symmetry.'
        : type === 'scalene'
        ? 'Scalene triangle with sides measuring 3 cm, 5 cm, and 7 cm. It has 3 sides of different lengths and 0 lines of symmetry.'
        : 'Equilateral triangle with 3 equal sides, 3 equal angles, and 3 lines of symmetry.';
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
              Triangles are 3-sided 2D shapes sorted by side lengths and angle sizes. 
              An <strong>equilateral triangle</strong> has 3 equal sides and 3 lines of symmetry. 
              An <strong>isosceles triangle</strong> has 2 equal sides and 1 line of symmetry. 
              A <strong>scalene triangle</strong> has 3 different side lengths and 0 lines of symmetry.
            </p>
          </div>

          {/* Source Example Cards */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider block">
                  Isosceles Triangle Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Sides: 6 cm, 6 cm, 4 cm
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  2 equal sides, 2 matching angles, 1 line of symmetry.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#9c6f1f] bg-[#9c6f1f]/10 px-3 py-2 rounded-lg">
                📐 6 cm = 6 cm
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#16241f]/60 uppercase tracking-wider block">
                  Scalene Triangle Example
                </span>
                <p className="text-sm font-semibold text-[#16241f] mt-0.5">
                  Sides: 3 cm, 5 cm, 7 cm
                </p>
                <p className="text-xs text-[#16241f]/70 mt-1">
                  All 3 sides have different lengths, 0 lines of symmetry.
                </p>
              </div>
              <div className="text-2xl font-bold text-[#16241f] bg-[#16241f]/10 px-3 py-2 rounded-lg">
                📐 3 cm ≠ 5 cm ≠ 7 cm
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('demo')}
            className="w-full py-3.5 px-6 bg-[#16241f] text-[#f4f6f1] font-bold text-sm rounded-xl shadow-md hover:bg-[#16241f]/90 transition-all duration-200"
          >
            Try Interactive Triangle Classifier Demo ➔
          </button>
        </div>
      )}

      {/* Phase 2: Interactive Demo */}
      {phase === 'demo' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSelectTriangleType('isosceles')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                triangleType === 'isosceles'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              Isosceles (6, 6, 4 cm)
            </button>
            <button
              onClick={() => handleSelectTriangleType('scalene')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                triangleType === 'scalene'
                  ? 'bg-[#16241f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              Scalene (3, 5, 7 cm)
            </button>
            <button
              onClick={() => handleSelectTriangleType('equilateral')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                triangleType === 'equilateral'
                  ? 'bg-[#9c6f1f] text-white shadow-md'
                  : 'bg-white text-[#16241f] border border-[#16241f]/15'
              }`}
            >
              Equilateral
            </button>
          </div>

          {/* Interactive Visual Canvas */}
          <div className="p-5 bg-white rounded-xl border border-[#16241f]/10 shadow-sm text-center">
            <h3 className="text-xs font-bold text-[#9c6f1f] uppercase tracking-wider mb-2">
              {triangleType === 'isosceles'
                ? 'Isosceles Triangle (2 Equal Sides)'
                : triangleType === 'scalene'
                ? 'Scalene Triangle (3 Different Sides)'
                : 'Equilateral Triangle (3 Equal Sides)'}
            </h3>

            {/* SVG Triangle Rendering */}
            <div className="relative my-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/10 p-6 flex flex-col items-center">
              <svg viewBox="0 0 280 160" className="w-full max-w-[260px] h-36 overflow-visible">
                {triangleType === 'isosceles' && (
                  <>
                    {/* Isosceles 6cm, 6cm, 4cm */}
                    <polygon points="140,20 80,130 200,130" fill="#9c6f1f" fillOpacity="0.15" stroke="#9c6f1f" strokeWidth="4" />
                    {/* Side labels */}
                    <text x="100" y="70" className="text-xs font-bold fill-[#9c6f1f]">6 cm</text>
                    <text x="165" y="70" className="text-xs font-bold fill-[#9c6f1f]">6 cm</text>
                    <text x="135" y="150" className="text-xs font-bold fill-[#16241f]">4 cm</text>
                    {/* Symmetry Line */}
                    {showSymmetryLines && (
                      <line x1="140" y1="15" x2="140" y2="135" stroke="#16241f" strokeWidth="2" strokeDasharray="4 3" />
                    )}
                  </>
                )}

                {triangleType === 'scalene' && (
                  <>
                    {/* Scalene 3cm, 5cm, 7cm */}
                    <polygon points="60,30 40,130 230,130" fill="#16241f" fillOpacity="0.1" stroke="#16241f" strokeWidth="4" />
                    {/* Side labels */}
                    <text x="35" y="75" className="text-xs font-bold fill-[#16241f]">3 cm</text>
                    <text x="145" y="70" className="text-xs font-bold fill-[#16241f]">5 cm</text>
                    <text x="125" y="150" className="text-xs font-bold fill-[#9c6f1f]">7 cm</text>
                  </>
                )}

                {triangleType === 'equilateral' && (
                  <>
                    {/* Equilateral */}
                    <polygon points="140,20 60,140 220,140" fill="#9c6f1f" fillOpacity="0.2" stroke="#9c6f1f" strokeWidth="4" />
                    <text x="85" y="75" className="text-xs font-bold fill-[#9c6f1f]">Equal</text>
                    <text x="170" y="75" className="text-xs font-bold fill-[#9c6f1f]">Equal</text>
                    <text x="130" y="158" className="text-xs font-bold fill-[#9c6f1f]">Equal</text>
                    {/* 3 Symmetry Lines */}
                    {showSymmetryLines && (
                      <>
                        <line x1="140" y1="15" x2="140" y2="145" stroke="#16241f" strokeWidth="2" strokeDasharray="3 3" />
                        <line x1="55" y1="142" x2="185" y2="75" stroke="#16241f" strokeWidth="2" strokeDasharray="3 3" />
                        <line x1="225" y1="142" x2="95" y2="75" stroke="#16241f" strokeWidth="2" strokeDasharray="3 3" />
                      </>
                    )}
                  </>
                )}
              </svg>

              <div className="w-full grid grid-cols-3 gap-2 mt-2">
                <div className="p-2 bg-white rounded-lg border border-[#16241f]/10 text-center">
                  <span className="text-[10px] font-bold text-[#16241f]/50 uppercase block">Equal Sides</span>
                  <span className="text-sm font-black text-[#16241f]">
                    {triangleType === 'isosceles' ? '2 Sides' : triangleType === 'scalene' ? '0 Sides' : '3 Sides'}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-[#16241f]/10 text-center">
                  <span className="text-[10px] font-bold text-[#16241f]/50 uppercase block">Matching Angles</span>
                  <span className="text-sm font-black text-[#16241f]">
                    {triangleType === 'isosceles' ? '2 Angles' : triangleType === 'scalene' ? '0 Angles' : '3 Angles'}
                  </span>
                </div>
                <div className="p-2 bg-[#9c6f1f]/10 rounded-lg border border-[#9c6f1f]/30 text-center">
                  <span className="text-[10px] font-bold text-[#9c6f1f] uppercase block">Symmetry Lines</span>
                  <span className="text-sm font-black text-[#9c6f1f]">
                    {triangleType === 'isosceles' ? '1 Line' : triangleType === 'scalene' ? '0 Lines' : '3 Lines'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSymmetryLines(!showSymmetryLines)}
              className="py-2 px-4 bg-[#16241f]/5 text-[#16241f] border border-[#16241f]/15 font-bold text-xs rounded-xl hover:bg-[#16241f]/10 transition-all duration-200"
            >
              {showSymmetryLines ? '👁️ Hide Symmetry Lines' : '🪞 Show Lines of Symmetry'}
            </button>
          </div>

          {/* Explanation Banner */}
          <div className="p-4 bg-[#f4f6f1] rounded-xl border border-[#16241f]/20 text-center">
            <p className="text-sm font-semibold text-[#16241f]">
              {triangleType === 'isosceles' && (
                <>A triangle with sides measuring <strong>6 cm, 6 cm, and 4 cm</strong> is an isosceles triangle because 2 sides are equal in length and it has 1 line of symmetry.</>
              )}
              {triangleType === 'scalene' && (
                <>A triangle with sides measuring <strong>3 cm, 5 cm, and 7 cm</strong> is scalene because all 3 sides have different lengths and no lines of symmetry.</>
              )}
              {triangleType === 'equilateral' && (
                <>An <strong>equilateral triangle</strong> has 3 sides of equal length, 3 equal angles, and 3 lines of symmetry.</>
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
            Awesome job! You successfully completed the checkpoint quiz for <strong>Classifying Triangles and Their Properties</strong>.
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#16241f]/10 inline-block shadow-sm max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9c6f1f] block mb-1">
              Tip to Remember
            </span>
            <p className="text-xs font-semibold text-[#16241f]">
              Equilateral has "equal" in its name, isosceles stands tall on 2 equal legs, and scalene has sides that never match.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                setPhase('visual_intro');
                setQuizIndex(0);
                setSelectedOption(null);
                setShowHint(false);
                setTriangleType('isosceles');
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

export default TriangleClassifyPlayer;
