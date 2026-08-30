import React from 'react';

// ============================================================================
// STUDY EZY CARTOON VISUAL ASSET PACK (P1 - INTERACTIVE PRODUCTION ENGINE)
// Place this file in: `/components/interactive/studyezy-cartoon-assets.tsx`
// Design Style: Brand Paper, Ink, and Gold, highly visual, kid-friendly
// ============================================================================

// ----------------------------------------------------------------------------
// 1. JO'S WINKING FACE (Unit 1, Concept 1.2 - Implicit Meaning)
// ----------------------------------------------------------------------------
interface JoWinkCartoonProps {
  isWinking: boolean;
  className?: string;
}

export const JoWinkCartoon: React.FC<JoWinkCartoonProps> = ({ isWinking, className = "" }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center p-4 bg-[#FFFDD0]/30 rounded-2xl border-2 border-[#1E1E24]/10 ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-48 h-48 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Face Background */}
        <circle cx="100" cy="100" r="80" fill="#FFECD1" stroke="#1E1E24" strokeWidth="4" />

        {/* Rosy Cheeks */}
        <circle cx="55" cy="115" r="12" fill="#FFB5A7" opacity="0.6" />
        <circle cx="145" cy="115" r="12" fill="#FFB5A7" opacity="0.6" />

        {/* Cute Hair Backing */}
        <path d="M20 100 C20 40, 180 40, 180 100" stroke="#1E1E24" strokeWidth="6" fill="none" />

        {/* Left Eye (Always Open, Big & Happy) */}
        <g id="left-eye">
          <ellipse cx="65" cy="90" rx="8" ry="12" fill="#1E1E24" />
          <circle cx="62" cy="85" r="3" fill="#FFFFFF" /> {/* Catchlight */}
          {/* Eyebrow */}
          <path d="M52 75 Q65 68 78 76" stroke="#1E1E24" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>

        {/* Right Eye (Dynamic: Open vs. Wink) */}
        <g id="right-eye" className="transition-all duration-300 ease-in-out">
          {isWinking ? (
            /* Wink State: A cute curved laughing/wink arc */
            <path
              d="M122 92 Q135 104 148 92"
              stroke="#1E1E24"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            /* Open State: Matching Left Eye */
            <>
              <ellipse cx="135" cy="90" rx="8" ry="12" fill="#1E1E24" />
              <circle cx="132" cy="85" r="3" fill="#FFFFFF" />
            </>
          )}
          {/* Eyebrow - Moves down slightly when winking */}
          <path
            d={isWinking ? "M122 79 Q135 75 148 81" : "M122 75 Q135 68 148 76"}
            stroke="#1E1E24"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300 ease-in-out"
          />
        </g>

        {/* Nose */}
        <path d="M96 102 Q100 108 104 102" stroke="#1E1E24" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Mouth (Grown/Grin state matched to Jo's expression) */}
        <path
          d={isWinking ? "M82 120 Q100 145 118 120" : "M85 124 Q100 135 115 124"}
          stroke="#1E1E24"
          strokeWidth="4"
          fill={isWinking ? "#FF70A6" : "none"}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />

        {/* Hair Strands (Front Bangs) */}
        <path d="M30 85 C50 60, 90 65, 100 80" stroke="#1E1E24" strokeWidth="4" fill="none" />
        <path d="M170 85 C150 60, 110 65, 100 80" stroke="#1E1E24" strokeWidth="4" fill="none" />
      </svg>
      <span className="mt-3 text-sm font-semibold text-[#1E1E24] font-display">
        {isWinking ? "😉 Jo is playing a mischievous prank! (Implicit)" : "😐 Jo sits quietly in the classroom..."}
      </span>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 2. THE SENTENCE TRAIN (Unit 1, Concept 1.5 - Clause Connectors)
// ----------------------------------------------------------------------------
interface SentenceTrainProps {
  leftClause: string;
  rightClause: string;
  connector: string | null; // e.g. "because", "but", "and"
  isSnapped: boolean;
  className?: string;
}

export const SentenceTrain: React.FC<SentenceTrainProps> = ({
  leftClause,
  rightClause,
  connector,
  isSnapped,
  className = ""
}) => {
  return (
    <div className={`w-full flex flex-col items-center p-6 bg-[#1E1E24]/5 rounded-3xl border-2 border-dashed border-[#1E1E24]/20 ${className}`}>
      {/* Train Track SVG */}
      <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
        {/* Ground Rails */}
        <div className="absolute bottom-10 left-0 right-0 h-2 bg-[#1E1E24]/30" />
        <div className="absolute bottom-8 left-0 right-0 h-1 bg-[#1E1E24]/20" />
        {/* Railway Sleepers */}
        <div className="absolute bottom-8 left-0 right-0 h-2 flex justify-between px-4 opacity-40">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-2 h-4 bg-[#1E1E24] rotate-12" />
          ))}
        </div>

        {/* The Animated Train Engine */}
        <div className={`flex items-end gap-1 transition-all duration-700 ease-out ${isSnapped ? "scale-105" : ""}`}>
          
          {/* Locomotive (Left Carriage / Main Clause) */}
          <div className="flex flex-col items-center">
            <div className="relative w-44 h-24 bg-[#FF6F00] border-3 border-[#1E1E24] rounded-t-xl px-3 flex flex-col justify-center text-white shadow-md">
              {/* Steam Chimney */}
              <div className="absolute -top-4 left-6 w-5 h-5 bg-[#1E1E24] rounded-t-sm" />
              {/* Puffing Steam Animation */}
              {isSnapped && (
                <div className="absolute -top-12 left-5 flex flex-col gap-1 animate-bounce">
                  <div className="w-4 h-4 bg-gray-300/80 rounded-full animate-ping" />
                  <div className="w-6 h-4 bg-gray-200/60 rounded-full delay-100" />
                </div>
              )}
              {/* Cabin window */}
              <div className="absolute top-2 right-2 w-10 h-10 bg-[#FFFDD0] border-2 border-[#1E1E24] rounded-md" />
              {/* Text Area */}
              <p className="text-[11px] font-bold leading-tight z-10 text-white font-sans pr-10">
                "{leftClause}"
              </p>
              <span className="absolute bottom-1 left-2 text-[8px] uppercase tracking-wider text-white/80 font-mono">
                Clause 1
              </span>
            </div>
            {/* Wheels */}
            <div className="flex gap-10 mt-1">
              <div className="w-8 h-8 rounded-full bg-[#1E1E24] border-2 border-[#FFFDD0] animate-spin" style={{ animationDuration: isSnapped ? '3s' : '0s' }} />
              <div className="w-8 h-8 rounded-full bg-[#1E1E24] border-2 border-[#FFFDD0] animate-spin" style={{ animationDuration: isSnapped ? '3s' : '0s' }} />
            </div>
          </div>

          {/* Connector Coupler (The Middle Connector Block) */}
          <div className="flex flex-col items-center justify-center h-24 z-20">
            {isSnapped ? (
              <div className="w-16 h-10 bg-[#FFD700] border-3 border-[#1E1E24] rounded-lg flex items-center justify-center text-[#1E1E24] font-bold text-xs shadow-lg animate-pulse">
                {connector}
              </div>
            ) : (
              <div className="w-10 h-2 bg-gray-400 border-t-2 border-b-2 border-[#1E1E24]" />
            )}
          </div>

          {/* Freight Carriage (Right Carriage / Dependent Clause) */}
          <div className={`flex flex-col items-center transition-all duration-700 ${isSnapped ? "translate-x-0" : "translate-x-12"}`}>
            <div className="relative w-44 h-20 bg-[#2E86AB] border-3 border-[#1E1E24] rounded-lg px-3 flex flex-col justify-center text-white shadow-md">
              <p className="text-[11px] font-bold leading-tight font-sans">
                "{rightClause}"
              </p>
              <span className="absolute bottom-1 right-2 text-[8px] uppercase tracking-wider text-white/80 font-mono">
                Clause 2
              </span>
            </div>
            {/* Wheels */}
            <div className="flex gap-12 mt-1">
              <div className="w-8 h-8 rounded-full bg-[#1E1E24] border-2 border-[#FFFDD0] animate-spin" style={{ animationDuration: isSnapped ? '3s' : '0s' }} />
              <div className="w-8 h-8 rounded-full bg-[#1E1E24] border-2 border-[#FFFDD0] animate-spin" style={{ animationDuration: isSnapped ? '3s' : '0s' }} />
            </div>
          </div>

        </div>
      </div>

      <div className="mt-4 text-center">
        {isSnapped ? (
          <p className="text-sm font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200">
            🎉 Snapped! You coupled a beautiful <strong>Compound Sentence</strong> using the conjunction <strong>"{connector}"</strong>!
          </p>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Drag the connector block onto the track to lock the carriages together!
          </p>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 3. DROPPY THE WATER CYCLE MASCOT (Unit 4 - Science Corner)
// ----------------------------------------------------------------------------
interface DroppyWaterCycleProps {
  stage: 'evaporation' | 'condensation' | 'precipitation' | 'collection';
  className?: string;
}

export const DroppyWaterCycle: React.FC<DroppyWaterCycleProps> = ({ stage, className = "" }) => {
  // Config states depending on which phase the child activates
  const stageConfig = {
    evaporation: {
      color: "#FFECD1",
      textColor: "text-amber-700",
      bgBorder: "border-amber-200",
      label: "Evaporation (वाष्पीकरण)",
      description: "Warm sun turns Droppy from liquid to a hot, rising gas!",
      droppyClass: "animate-bounce origin-bottom translate-y-[-20px] scale-95"
    },
    condensation: {
      color: "#E2E8F0",
      textColor: "text-slate-700",
      bgBorder: "border-slate-300",
      label: "Condensation (संघनन)",
      description: "Cold sky squeezes Droppy inside a heavy, gray cloud!",
      droppyClass: "scale-110 blur-[0.3px]"
    },
    precipitation: {
      color: "#D6E5E3",
      textColor: "text-blue-700",
      bgBorder: "border-blue-300",
      label: "Precipitation (वर्षा)",
      description: "Splash! Droppy falls downwards from the sky as refreshing rain!",
      droppyClass: "animate-bounce translate-y-[30px]"
    },
    collection: {
      color: "#FFFDD0",
      textColor: "text-emerald-700",
      bgBorder: "border-emerald-200",
      label: "Collection (संग्रहण)",
      description: "Droppy flows back down the river home to the massive ocean!",
      droppyClass: "animate-pulse"
    }
  };

  const current = stageConfig[stage];

  return (
    <div className={`flex flex-col items-center justify-center p-6 bg-[#FFFDD0]/40 rounded-3xl border-2 ${current.bgBorder} ${className}`}>
      <div className="relative w-48 h-48 flex items-center justify-center">
        
        {/* Backing elements like Sun/Cloud/Water according to state */}
        {stage === 'evaporation' && (
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-amber-400 animate-pulse border-2 border-[#1E1E24]" />
        )}
        {stage === 'condensation' && (
          <div className="absolute w-32 h-16 bg-gray-400 rounded-full border-3 border-[#1E1E24] opacity-80" />
        )}
        {stage === 'precipitation' && (
          <div className="absolute top-0 w-32 h-12 bg-gray-500 rounded-full border-3 border-[#1E1E24]" />
        )}
        {stage === 'collection' && (
          <div className="absolute bottom-0 w-full h-12 bg-blue-500 rounded-t-xl border-t-3 border-[#1E1E24]" />
        )}

        {/* Droppy Mascot Droplet SVG */}
        <svg
          viewBox="0 0 100 100"
          className={`w-32 h-32 transition-all duration-1000 ${current.droppyClass}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Tear Drop Body */}
          <path
            d="M50 10 C50 10, 80 55, 80 72 C80 88, 66 100, 50 100 C34 100, 20 88, 20 72 C20 55, 50 10, 50 10 Z"
            fill={stage === 'evaporation' ? '#FAD2E1' : '#A9D6E5'}
            stroke="#1E1E24"
            strokeWidth="3.5"
          />

          {/* Smiling Eyes */}
          {stage === 'evaporation' ? (
            // Sweating / dizzy eyes
            <>
              <path d="M38 58 L44 64" stroke="#1E1E24" strokeWidth="3" strokeLinecap="round" />
              <path d="M44 58 L38 64" stroke="#1E1E24" strokeWidth="3" strokeLinecap="round" />
              <path d="M56 58 L62 64" stroke="#1E1E24" strokeWidth="3" strokeLinecap="round" />
              <path d="M62 58 L56 64" stroke="#1E1E24" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="50" r="1.5" fill="#1E1E24" /> {/* Sweat bead */}
            </>
          ) : stage === 'condensation' ? (
            // Excited/surprised eyes
            <>
              <circle cx="40" cy="62" r="5" fill="#1E1E24" />
              <circle cx="60" cy="62" r="5" fill="#1E1E24" />
              <circle cx="38" cy="60" r="1.5" fill="#FFF" />
              <circle cx="58" cy="60" r="1.5" fill="#FFF" />
            </>
          ) : (
            // Happy closed eyes
            <>
              <path d="M32 64 Q40 54 44 64" stroke="#1E1E24" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M56 64 Q60 54 68 64" stroke="#1E1E24" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Rosy Cheek highlights */}
          <circle cx="30" cy="74" r="5" fill="#FFB5A7" opacity="0.6" />
          <circle cx="70" cy="74" r="5" fill="#FFB5A7" opacity="0.6" />

          {/* Mouth depending on state */}
          <path
            d={stage === 'precipitation' ? "M42 76 Q50 68 58 76" : "M42 74 Q50 86 58 74"}
            stroke="#1E1E24"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill={stage !== 'precipitation' ? '#FF70A6' : 'none'}
          />
        </svg>

        {/* Falling rain visual lines under Droppy when in Precipitation stage */}
        {stage === 'precipitation' && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-around opacity-70">
            <div className="w-1 h-6 bg-blue-400 rounded-full animate-bounce" />
            <div className="w-1 h-8 bg-blue-400 rounded-full animate-bounce delay-100" />
            <div className="w-1 h-6 bg-blue-400 rounded-full animate-bounce delay-200" />
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <h4 className={`text-lg font-bold font-display ${current.textColor}`}>
          {current.label}
        </h4>
        <p className="text-xs text-gray-600 max-w-xs mt-1">
          {current.description}
        </p>
      </div>
    </div>
  );
};
