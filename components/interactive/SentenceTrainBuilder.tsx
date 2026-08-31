import React, { useState } from 'react';

interface TrainCarriage {
  id: string;
  text: string;
  type: 'clause1' | 'clause2' | 'connector';
}

interface SentenceTrainProps {
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
}

export const SentenceTrainBuilder: React.FC<SentenceTrainProps> = ({
  onSuccess,
  onAttempt,
}) => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  const [isCoupled, setIsCoupled] = useState(false);
  const [showError, setShowError] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  // Dynamic sentence puzzles sourced directly from physical textbook Pages 14-15
  const puzzles = [
    {
      sentenceType: 'Compound Sentence',
      clause1: 'The magpies loved the warmth',
      clause2: 'the wombats missed their cool burrows',
      correctConnector: 'but',
      options: ['and', 'but', 'because'],
      hint: "These two ideas are opposites (contrast)! Warmth is good for magpies, but wombats missed their dark burrows. What connector shows contrast?",
      explanation: "Excellent! 'But' connects two complete, contrasting ideas. The train is coupled!",
    },
    {
      sentenceType: 'Complex Sentence',
      clause1: 'The animals danced under the sun',
      clause2: 'they were filled with joy',
      correctConnector: 'because',
      options: ['although', 'but', 'because'],
      hint: "One idea explains the REASON for the other. Why did they dance? Connect the reason!",
      explanation: "Amazing! 'Because' introduces a dependent clause explaining the reason behind their dance.",
    },
    {
      sentenceType: 'Compound Sentence',
      clause1: 'The sun rose over the horizon',
      clause2: 'the golden light covered the land',
      correctConnector: 'and',
      options: ['although', 'and', 'because'],
      hint: "These are two related actions happening one after another. We just need to add them together!",
      explanation: "Perfect! 'And' is the ultimate addition connector for linking two parallel thoughts.",
    }
  ];

  const currentPuzzle = puzzles[activeQuestion];

  const handleSelectConnector = (option: string) => {
    if (isCoupled) return; // Prevent clicking after success
    setSelectedConnector(option);
    setShowError(false);

    if (option === currentPuzzle.correctConnector) {
      setIsCoupled(true);
      if (onAttempt) onAttempt(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2500);
    } else {
      setShowError(true);
      if (onAttempt) onAttempt(false);
      // Gentle wobble shake reset
      setTimeout(() => {
        setShowError(false);
        setSelectedConnector(null);
      }, 1000);
    }
  };

  const handleNext = () => {
    if (activeQuestion < puzzles.length - 1) {
      setActiveQuestion(prev => prev + 1);
      setSelectedConnector(null);
      setIsCoupled(false);
      setHint(null);
    } else {
      // Loop or finish
      setActiveQuestion(0);
      setSelectedConnector(null);
      setIsCoupled(false);
      setHint(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-6 bg-[#f4f6f1] rounded-2xl border-2 border-[#16241f]/10 shadow-sm max-w-lg mx-auto overflow-hidden">
      
      {/* Header Info */}
      <div className="text-center mb-4 w-full">
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-extrabold uppercase tracking-wider bg-[#9c6f1f]/10 text-[#9c6f1f]">
          {currentPuzzle.sentenceType}
        </span>
        <h3 className="font-serif text-[#16241f] text-lg font-bold mt-1">
          The Sentence Train Coupler
        </h3>
        <p className="text-xs text-[#16241f]/60 font-sans">
          Pick the correct linking word to snap the carriages together!
        </p>
      </div>

      {/* SVG ANIMATED TRAIN TRACK */}
      <div className="relative w-full h-40 flex items-center justify-center bg-white rounded-xl border border-[#16241f]/5 shadow-inner overflow-hidden px-4">
        
        {/* Steam Puffs (Animated) */}
        {isCoupled && (
          <div className="absolute left-[20px] top-[15px] flex space-x-1">
            <span className="w-3 h-3 bg-gray-300 rounded-full animate-ping opacity-75"></span>
            <span className="w-2.5 h-2.5 bg-gray-200 rounded-full animate-bounce delay-100"></span>
          </div>
        )}

        <div className="w-full flex items-center justify-between relative z-10 transition-all duration-700">
          
          {/* 1. LOCOMOTIVE (Static on Left) */}
          <div className="flex-shrink-0 transform translate-y-1">
            <svg viewBox="0 0 80 60" className="w-16 h-12 overflow-visible">
              {/* Train Body */}
              <rect x="5" y="20" width="40" height="25" fill="#16241f" rx="3" />
              <rect x="25" y="10" width="20" height="15" fill="#16241f" rx="2" />
              {/* Smokestack */}
              <rect x="10" y="8" width="6" height="12" fill="#9c6f1f" />
              <rect x="8" y="5" width="10" height="3" fill="#16241f" />
              {/* Cabin window */}
              <rect x="30" y="13" width="10" height="8" fill="#f4f6f1" rx="1" />
              {/* Wheels */}
              <circle cx="15" cy="48" r="7" fill="#9c6f1f" stroke="#16241f" strokeWidth="2" className={isCoupled ? "animate-spin" : ""} />
              <circle cx="35" cy="48" r="7" fill="#9c6f1f" stroke="#16241f" strokeWidth="2" className={isCoupled ? "animate-spin" : ""} />
              {/* Front bumper */}
              <path d="M 45 35 L 52 45 L 45 45 Z" fill="#9c6f1f" />
            </svg>
          </div>

          {/* 2. CARRIAGE A (Clause 1) */}
          <div className="flex-1 min-w-0 bg-[#16241f] text-white p-2.5 rounded-lg text-center text-xs font-medium shadow-sm transition-all duration-500 relative mx-1 border border-[#16241f]">
            <p className="line-clamp-2 leading-tight">{currentPuzzle.clause1}</p>
            {/* Wheels under carriage */}
            <div className="absolute -bottom-2.5 left-0 right-0 flex justify-around px-2">
              <span className={`w-2.5 h-2.5 rounded-full bg-gray-800 border border-white ${isCoupled ? "animate-ping" : ""}`} />
              <span className={`w-2.5 h-2.5 rounded-full bg-gray-800 border border-white ${isCoupled ? "animate-ping" : ""}`} />
            </div>
          </div>

          {/* 3. DYNAMIC COUPLER GAP */}
          <div className={`flex-shrink-0 flex items-center justify-center transition-all duration-700 ${isCoupled ? 'w-10' : 'w-16'} h-8 relative z-20`}>
            {isCoupled ? (
              // Connected State
              <svg viewBox="0 0 40 20" className="w-full h-full text-[#9c6f1f]">
                <line x1="0" y1="10" x2="40" y2="10" stroke="currentColor" strokeWidth="3" strokeDasharray="1 1" />
                <rect x="8" y="3" width="24" height="14" rx="3" fill="#9c6f1f" className="animate-bounce" />
                <text x="20" y="13" textAnchor="middle" fill="#f4f6f1" className="text-[8px] font-sans font-extrabold uppercase">
                  {selectedConnector}
                </text>
              </svg>
            ) : (
              // Disconnected State
              <div className={`w-12 h-6 border-2 border-dashed border-[#16241f]/30 rounded-md flex items-center justify-center bg-gray-50 text-[10px] text-[#16241f]/40 font-bold ${showError ? 'animate-shake border-red-400 bg-red-50' : ''}`}>
                ?
              </div>
            )}
          </div>

          {/* 4. CARRIAGE B (Clause 2) */}
          <div className={`flex-1 min-w-0 bg-[#16241f] text-white p-2.5 rounded-lg text-center text-xs font-medium shadow-sm transition-all duration-500 relative mx-1 border border-[#16241f] ${isCoupled ? 'translate-x-0' : 'translate-x-3'}`}>
            <p className="line-clamp-2 leading-tight">{currentPuzzle.clause2}</p>
            {/* Wheels under carriage */}
            <div className="absolute -bottom-2.5 left-0 right-0 flex justify-around px-2">
              <span className={`w-2.5 h-2.5 rounded-full bg-gray-800 border border-white ${isCoupled ? "animate-ping" : ""}`} />
              <span className={`w-2.5 h-2.5 rounded-full bg-gray-800 border border-white ${isCoupled ? "animate-ping" : ""}`} />
            </div>
          </div>

        </div>

        {/* Train Tracks Layer */}
        <div className="absolute bottom-4 left-0 right-0 h-1.5 bg-gray-200">
          <div className="w-full h-full flex justify-between px-2">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="w-1 h-3 bg-gray-400 transform -translate-y-0.5" />
            ))}
          </div>
        </div>

      </div>

      {/* ACTIVE SELECTION ZONE */}
      <div className="w-full my-4">
        {isCoupled ? (
          // Success State Feedback
          <div className="bg-[#16241f]/5 border-2 border-[#16241f] rounded-xl p-3.5 text-center animate-fade-in">
            <p className="text-sm font-sans font-bold text-[#16241f]">
              🎉 Chugga Chugga, Choo Choo!
            </p>
            <p className="text-xs text-[#16241f]/80 mt-1">
              {currentPuzzle.explanation}
            </p>
          </div>
        ) : (
          // Action Buttons
          <div className="flex flex-col items-center">
            <p className="text-xs font-sans text-[#16241f]/60 mb-2 uppercase tracking-widest font-bold">
              Select the Connector to Couple:
            </p>
            <div className="flex gap-2.5 w-full justify-center">
              {currentPuzzle.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectConnector(option)}
                  className="py-2.5 px-6 rounded-xl font-sans font-bold text-sm bg-white text-[#16241f] border-2 border-[#16241f]/10 shadow-sm hover:border-[#16241f] hover:bg-[#16241f]/5 transition-all duration-200 active:scale-95"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HELP & MASCOT ASSISTANT */}
      <div className="w-full border-t border-[#16241f]/5 pt-3.5 flex items-start gap-3">
        {/* Kangaroo Head Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#9c6f1f]/10 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">🦘</span>
        </div>

        {/* Balloon chat */}
        <div className="flex-1 bg-white p-3 rounded-xl border border-[#16241f]/5 relative shadow-sm">
          <p className="text-xs font-sans text-[#16241f] leading-relaxed">
            {hint ? hint : "Need some help coupling these sentences together? I'm right here!"}
          </p>
          {!isCoupled && !hint && (
            <button
              onClick={() => setHint(currentPuzzle.hint)}
              className="text-[10px] font-sans font-bold text-[#9c6f1f] hover:underline mt-1.5 block"
            >
              💡 Ask Ezy for a Clue!
            </button>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      {isCoupled && (
        <button
          onClick={handleNext}
          className="w-full mt-4 py-3 bg-[#9c6f1f] hover:bg-[#9c6f1f]/90 text-white font-sans font-bold text-sm rounded-xl transition-all duration-200 shadow-md uppercase tracking-wider animate-bounce"
        >
          Next Puzzle ➡️
        </button>
      )}

    </div>
  );
};
