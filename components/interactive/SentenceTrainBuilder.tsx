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
      setActiveQuestion(0);
      setSelectedConnector(null);
      setIsCoupled(false);
      setHint(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-6 rounded-2xl border border-slate-200/70 bg-white shadow-soft max-w-lg mx-auto overflow-hidden">

      {/* Header Info */}
      <div className="text-center mb-4 w-full">
        <span className="inline-block rounded-full border border-brand-gold/20 bg-brand-gold-bright/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-ink">
          {currentPuzzle.sentenceType}
        </span>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
          The sentence train coupler
        </h3>
        <p className="text-xs font-semibold text-slate-500">
          Pick the correct linking word to snap the carriages together!
        </p>
      </div>

      {/* SVG ANIMATED TRAIN TRACK WORKBENCH - the bold, solid carriage blocks
          below are a deliberate part of the train metaphor (a real train car
          reads as solid/blocky, not soft/pastel), so only this outer
          workbench frame is softened to match the rest of the app - the
          carriages themselves keep their bolder styling. */}
      <div className="relative w-full h-48 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200/70 overflow-hidden px-4">
        
        {/* Sky gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#bae6fd]/30 to-transparent pointer-events-none" />

        {/* Animated Steam Clouds rising from locomotive */}
        {isCoupled && (
          <div className="absolute left-[38px] top-[15px] flex space-x-1.5 z-20">
            <span className="w-5 h-5 bg-gray-200 border-2 border-[#16241f] rounded-full animate-ping opacity-75"></span>
            <span className="w-4 h-4 bg-gray-100 border-2 border-[#16241f] rounded-full animate-bounce delay-100"></span>
            <span className="w-3 h-3 bg-gray-300 border-2 border-[#16241f] rounded-full animate-pulse delay-200"></span>
          </div>
        )}

        <div className="w-full flex items-center justify-between relative z-10 transition-all duration-700">
          
          {/* 1. LOCOMOTIVE (Fabulous Cartoon Steam Engine on Left) */}
          <div className="flex-shrink-0 transform translate-y-1 mr-1">
            <svg viewBox="0 0 100 80" className="w-20 h-16 overflow-visible">
              <defs>
                <linearGradient id="cabinGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fca5a5" />
                  <stop offset="1" stopColor="#ef4444" />
                </linearGradient>
                <linearGradient id="boilerGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#16241f" />
                  <stop offset="1" stopColor="#2c3e35" />
                </linearGradient>
              </defs>

              {/* Locomotive Cowcatcher/Bumper */}
              <path d="M 68 55 L 85 68 L 68 68 Z" fill="#9c6f1f" stroke="#16241f" strokeWidth="2.5" />
              
              {/* Retro Boiler Body */}
              <rect x="25" y="32" width="45" height="28" fill="url(#boilerGrad)" stroke="#16241f" strokeWidth="2.5" rx="3" />
              {/* Warm Wood Cabin */}
              <rect x="5" y="15" width="28" height="45" fill="url(#cabinGrad)" stroke="#16241f" strokeWidth="2.5" rx="3" />
              {/* Roof */}
              <path d="M 1 15 L 37 15 L 31 10 L 7 10 Z" fill="#16241f" stroke="#16241f" strokeWidth="2" />
              
              {/* Cute Cabin Window */}
              <rect x="11" y="22" width="16" height="16" fill="#bae6fd" stroke="#16241f" strokeWidth="2.5" rx="2" />
              {/* Cute face/light inside window */}
              <circle cx="19" cy="30" r="3" fill="#e5a93b" />

              {/* Gold Steam Smokestack */}
              <rect x="48" y="16" width="10" height="16" fill="#e5a93b" stroke="#16241f" strokeWidth="2.5" />
              <ellipse cx="53" cy="16" rx="6" ry="2" fill="#16241f" />

              {/* Front Toy Lantern */}
              <circle cx="72" cy="44" r="5" fill="#fff4d4" stroke="#16241f" strokeWidth="2" />
              <polygon points="72,41 84,36 84,52 72,47" fill="#fffdf0" opacity="0.3" />

              {/* Bouncy Cartoon Locomotive Wheels */}
              <circle cx="16" cy="62" r="10" fill="#e5a93b" stroke="#16241f" strokeWidth="3" className={isCoupled ? "animate-spin" : ""} />
              <circle cx="16" cy="62" r="4" fill="#16241f" />
              
              <circle cx="44" cy="62" r="10" fill="#e5a93b" stroke="#16241f" strokeWidth="3" className={isCoupled ? "animate-spin" : ""} />
              <circle cx="44" cy="62" r="4" fill="#16241f" />

              <circle cx="62" cy="62" r="10" fill="#e5a93b" stroke="#16241f" strokeWidth="3" className={isCoupled ? "animate-spin" : ""} />
              <circle cx="62" cy="62" r="4" fill="#16241f" />
              
              {/* Connecting Steel Rod */}
              {isCoupled && (
                <line x1="16" y1="62" x2="62" y2="62" stroke="#16241f" strokeWidth="3.5" strokeLinecap="round" />
              )}
            </svg>
          </div>

          {/* 2. CARRIAGE A (Clause 1 - Rounded Wooden Carriage) */}
          <div className="flex-1 min-w-0 bg-[#16241f] text-white p-3 rounded-2xl text-center text-xs font-black shadow-[4px_4px_0px_0px_rgba(156,111,31,0.2)] transition-all duration-500 relative mx-1 border-3 border-[#16241f]">
            <p className="line-clamp-2 leading-tight font-sans tracking-wide">{currentPuzzle.clause1}</p>
            {/* Playful wooden details */}
            <div className="absolute top-1 left-2 text-[7px] text-white/30 font-mono">CAR-1</div>
            {/* Spinning wheels under carriage */}
            <div className="absolute -bottom-3 left-0 right-0 flex justify-around px-3">
              <span className={`w-3.5 h-3.5 rounded-full bg-[#e5a93b] border-2 border-black ${isCoupled ? "animate-spin" : ""}`} />
              <span className={`w-3.5 h-3.5 rounded-full bg-[#e5a93b] border-2 border-black ${isCoupled ? "animate-spin" : ""}`} />
            </div>
          </div>

          {/* 3. DYNAMIC INTERACTIVE COUPLER GAP */}
          <div className={`flex-shrink-0 flex items-center justify-center transition-all duration-700 ${isCoupled ? 'w-12' : 'w-16'} h-10 relative z-20`}>
            {isCoupled ? (
              // Connected Magnetic Spark State
              <svg viewBox="0 0 50 30" className="w-full h-full text-[#9c6f1f] overflow-visible">
                <line x1="0" y1="15" x2="50" y2="15" stroke="#16241f" strokeWidth="4.5" strokeDasharray="2 1" />
                {/* Golden Magnetic Coupler */}
                <rect x="8" y="4" width="34" height="22" rx="6" fill="#9c6f1f" stroke="#16241f" strokeWidth="2.5" className="animate-bounce" />
                <text x="25" y="18" textAnchor="middle" fill="#f4f6f1" className="text-[10px] font-sans font-black uppercase">
                  {selectedConnector}
                </text>
                {/* Little cartoon spark points */}
                <path d="M 25 1 L 25 -3 M 25 29 L 25 33" stroke="#e5a93b" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              // Disconnected Question Box
              <div className={`w-14 h-8 border-3 border-dashed border-[#16241f] rounded-xl flex items-center justify-center bg-gray-50 text-base text-[#16241f] font-black ${showError ? 'animate-shake border-red-500 bg-red-50 text-red-500' : ''}`}>
                ?
              </div>
            )}
          </div>

          {/* 4. CARRIAGE B (Clause 2 - Rounded Wooden Carriage) */}
          <div className={`flex-1 min-w-0 bg-[#16241f] text-white p-3 rounded-2xl text-center text-xs font-black shadow-[4px_4px_0px_0px_rgba(156,111,31,0.2)] transition-all duration-500 relative mx-1 border-3 border-[#16241f] ${isCoupled ? 'translate-x-0' : 'translate-x-3'}`}>
            <p className="line-clamp-2 leading-tight font-sans tracking-wide">{currentPuzzle.clause2}</p>
            <div className="absolute top-1 left-2 text-[7px] text-white/30 font-mono">CAR-2</div>
            {/* Spinning wheels under carriage */}
            <div className="absolute -bottom-3 left-0 right-0 flex justify-around px-3">
              <span className={`w-3.5 h-3.5 rounded-full bg-[#e5a93b] border-2 border-black ${isCoupled ? "animate-spin" : ""}`} />
              <span className={`w-3.5 h-3.5 rounded-full bg-[#e5a93b] border-2 border-black ${isCoupled ? "animate-spin" : ""}`} />
            </div>
          </div>

        </div>

        {/* Curved Toy Train Tracks backdrop */}
        <div className="absolute bottom-4 left-0 right-0 h-2 bg-[#805634] border-t-2 border-b-2 border-black z-0">
          <div className="w-full h-full flex justify-between px-1">
            {[...Array(14)].map((_, i) => (
              <span key={i} className="w-1.5 h-4 bg-[#c28c5f] border-l border-r border-black transform -translate-y-1" />
            ))}
          </div>
        </div>

      </div>

      {/* ACTIVE SELECTION ZONE */}
      <div className="w-full my-4">
        {isCoupled ? (
          // Success State Feedback
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center shadow-sm animate-bounce">
            <p className="text-base font-bold text-emerald-800">
              🎉 Chugga chugga, choo choo! 🚂
            </p>
            <p className="mt-1 text-xs font-medium text-emerald-700">
              {currentPuzzle.explanation}
            </p>
          </div>
        ) : (
          // Action Buttons
          <div className="flex flex-col items-center">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Select the connector to couple:
            </p>
            <div className="flex gap-3 w-full justify-center">
              {currentPuzzle.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectConnector(option)}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition-all duration-200 hover:border-brand-ink-light hover:bg-slate-50"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HELP & MASCOT ASSISTANT */}
      <div className="w-full border-t border-dashed border-slate-200 pt-4 flex items-start gap-3">
        {/* Kangaroo Head Avatar */}
        <div className="w-12 h-10 rounded-2xl bg-brand-gold-bright/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0 text-xl font-bold">
          🦘
        </div>

        {/* Balloon chat */}
        <div className="flex-1 bg-white p-3 rounded-2xl border border-slate-200/70 relative shadow-sm">
          <p className="text-xs font-medium leading-relaxed text-slate-700">
            {hint ? hint : "Need some help coupling these sentences together? I'm right here!"}
          </p>
          {!isCoupled && !hint && (
            <button
              onClick={() => setHint(currentPuzzle.hint)}
              className="text-[10px] font-semibold text-brand-ink hover:underline mt-1.5 block"
            >
              💡 Ask Ezy for a clue!
            </button>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      {isCoupled && (
        <button
          onClick={handleNext}
          className="w-full mt-4 rounded-2xl bg-gradient-to-br from-brand-gold-bright to-brand-gold px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-all duration-200 animate-bounce"
        >
          Next Puzzle ➡️
        </button>
      )}

    </div>
  );
};
