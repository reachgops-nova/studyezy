// Original, simple flat-style SVG illustrations used as sample/placeholder media
// for concepts. Not scanned or adapted from the textbook's own artwork -
// deliberately simple shapes so there's no ambiguity about originality.
// Swap these for licensed/produced illustrations once that pipeline exists.

function CockerelHyenaFable() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A rooster standing on a fence post next to a hyena, from Why Cockerels Crow">
      <rect width="300" height="180" fill="#dbeafe" />
      <ellipse cx="150" cy="160" rx="140" ry="18" fill="#bfdbfe" />
      {/* fence post */}
      <rect x="60" y="90" width="14" height="70" rx="3" fill="#92400e" />
      {/* cockerel body */}
      <ellipse cx="67" cy="80" rx="26" ry="22" fill="#f97316" />
      <circle cx="88" cy="65" r="12" fill="#f97316" />
      <path d="M85 50 L92 40 L96 52 L90 54 Z" fill="#dc2626" />
      <path d="M98 63 L110 66 L98 70 Z" fill="#eab308" />
      <circle cx="92" cy="62" r="1.6" fill="#1f2937" />
      {/* tail feathers */}
      <path d="M45 70 Q20 55 30 40 Q45 55 50 72 Z" fill="#16a34a" />
      <path d="M42 78 Q15 72 20 55 Q40 62 48 80 Z" fill="#0ea5e9" />
      {/* hyena */}
      <ellipse cx="200" cy="140" rx="42" ry="26" fill="#d6b98c" />
      <circle cx="245" cy="118" r="20" fill="#d6b98c" />
      <path d="M255 100 L266 92 L260 108 Z" fill="#d6b98c" />
      <circle cx="252" cy="115" r="2" fill="#1f2937" />
      <path d="M258 122 Q266 126 260 130" stroke="#1f2937" strokeWidth="2" fill="none" />
      <circle cx="215" cy="135" r="3" fill="#78350f" />
      <circle cx="228" cy="145" r="3" fill="#78350f" />
      <circle cx="190" cy="128" r="3" fill="#78350f" />
    </svg>
  );
}

function ImplicitMeaningClue() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A magnifying glass over footprint clues, representing implicit meaning">
      <rect width="300" height="180" fill="#fef3c7" />
      <circle cx="120" cy="90" r="45" fill="#fff7ed" stroke="#b45309" strokeWidth="8" />
      <line x1="152" y1="122" x2="200" y2="165" stroke="#b45309" strokeWidth="10" strokeLinecap="round" />
      <path d="M100 100 Q110 80 130 85 Q145 90 140 105" stroke="#92400e" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="150" rx="10" ry="6" fill="#b45309" opacity="0.5" />
      <ellipse cx="85" cy="140" rx="10" ry="6" fill="#b45309" opacity="0.5" />
      <ellipse cx="230" cy="60" rx="10" ry="6" fill="#b45309" opacity="0.4" />
      <ellipse cx="255" cy="45" rx="10" ry="6" fill="#b45309" opacity="0.4" />
    </svg>
  );
}

function ExplicitMeaningDirect() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A speech bubble with an exclamation mark, representing explicit meaning stated directly">
      <rect width="300" height="180" fill="#dcfce7" />
      <rect x="50" y="40" width="200" height="90" rx="16" fill="#ffffff" stroke="#16a34a" strokeWidth="6" />
      <path d="M90 130 L70 160 L110 132 Z" fill="#ffffff" stroke="#16a34a" strokeWidth="6" strokeLinejoin="round" />
      <text x="150" y="98" textAnchor="middle" fontSize="42" fontWeight="700" fill="#16a34a" fontFamily="sans-serif">
        !
      </text>
    </svg>
  );
}

function PredictingNextPage() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="An open book with a question mark and a dotted path leading forward, representing predicting what happens next">
      <rect width="300" height="180" fill="#e0f2fe" />
      <path d="M40 130 L150 115 L260 130 L260 150 L150 138 L40 150 Z" fill="#ffffff" stroke="#0369a1" strokeWidth="4" strokeLinejoin="round" />
      <line x1="150" y1="115" x2="150" y2="138" stroke="#0369a1" strokeWidth="3" />
      <path d="M50 135 L140 122" stroke="#7dd3fc" strokeWidth="2" />
      <path d="M55 143 L140 130" stroke="#7dd3fc" strokeWidth="2" />
      <path d="M160 122 L250 135" stroke="#7dd3fc" strokeWidth="2" />
      <path d="M160 130 L245 143" stroke="#7dd3fc" strokeWidth="2" />
      <circle cx="150" cy="65" r="26" fill="#0284c7" opacity="0.15" />
      <text x="150" y="76" textAnchor="middle" fontSize="34" fontWeight="700" fill="#0369a1" fontFamily="sans-serif">
        ?
      </text>
      <path d="M195 95 Q220 85 235 95" stroke="#0284c7" strokeWidth="3" fill="none" strokeDasharray="2 8" strokeLinecap="round" />
      <path d="M228 89 L237 96 L227 100" stroke="#0284c7" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PerspectiveTwoViews() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="Two figures on opposite sides of an object, each with their own speech bubble, representing different perspectives on the same event">
      <rect width="300" height="180" fill="#fdf4ff" />
      <circle cx="150" cy="95" r="24" fill="#e9d5ff" stroke="#9333ea" strokeWidth="4" />
      <circle cx="78" cy="120" r="18" fill="#60a5fa" />
      <rect x="66" y="136" width="24" height="34" rx="8" fill="#3b82f6" />
      <circle cx="222" cy="120" r="18" fill="#f97316" />
      <rect x="210" y="136" width="24" height="34" rx="8" fill="#ea580c" />
      <path d="M40 50 Q35 40 45 38 L85 38 Q95 40 90 50 L90 60 L78 68 L80 58 Q40 60 40 50 Z" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" />
      <path d="M260 50 Q265 40 255 38 L215 38 Q205 40 210 50 L210 60 L222 68 L220 58 Q260 60 260 50 Z" fill="#ffffff" stroke="#ea580c" strokeWidth="3" />
    </svg>
  );
}

function ProofreadingChecklist() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A clipboard checklist with a pencil, ticked boxes representing proofreading">
      <rect width="300" height="180" fill="#f0fdf4" />
      <rect x="90" y="30" width="120" height="150" rx="10" fill="#ffffff" stroke="#15803d" strokeWidth="5" />
      <rect x="120" y="20" width="60" height="20" rx="6" fill="#16a34a" />
      {[60, 88, 116, 144].map((y, i) => (
        <g key={y}>
          <rect x="106" y={y} width="16" height="16" rx="3" fill="none" stroke="#15803d" strokeWidth="3" />
          {i < 3 && <path d={`M109 ${y + 8} L113 ${y + 12} L119 ${y + 3}`} stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          <line x1="132" y1={y + 8} x2="192" y2={y + 8} stroke="#bbf7d0" strokeWidth="6" strokeLinecap="round" />
        </g>
      ))}
      <path d="M215 150 L245 115 L258 128 L228 163 L212 166 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function FactVsOpinionScale() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A balance scale with a document on one side representing fact and a thought bubble on the other representing opinion">
      <rect width="300" height="180" fill="#fff7ed" />
      <rect x="146" y="40" width="8" height="100" fill="#78350f" />
      <path d="M60 78 L240 78" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
      <line x1="70" y1="80" x2="70" y2="115" stroke="#78350f" strokeWidth="3" />
      <line x1="230" y1="80" x2="230" y2="115" stroke="#78350f" strokeWidth="3" />
      <path d="M45 115 Q70 140 95 115 Z" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="3" />
      <path d="M205 115 Q230 140 255 115 Z" fill="#fed7aa" stroke="#c2410c" strokeWidth="3" />
      <rect x="55" y="90" width="30" height="22" rx="2" fill="#ffffff" stroke="#1d4ed8" strokeWidth="2.5" />
      <line x1="60" y1="97" x2="80" y2="97" stroke="#1d4ed8" strokeWidth="2" />
      <line x1="60" y1="103" x2="80" y2="103" stroke="#1d4ed8" strokeWidth="2" />
      <path d="M212 88 Q205 78 215 74 Q225 66 235 74 Q248 72 246 84 Q252 92 242 98 Q234 108 222 100 Q210 100 212 88 Z" fill="#ffffff" stroke="#c2410c" strokeWidth="2.5" />
      <rect x="140" y="145" width="20" height="14" rx="3" fill="#78350f" />
    </svg>
  );
}

function IdiomLiteralVsMeaning() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A cloud raining small cats and dogs, illustrating the literal-versus-real-meaning gap in idiomatic phrases">
      <rect width="300" height="180" fill="#eef2ff" />
      <ellipse cx="150" cy="55" rx="70" ry="30" fill="#c7d2fe" />
      <ellipse cx="110" cy="45" rx="34" ry="24" fill="#c7d2fe" />
      <ellipse cx="195" cy="48" rx="30" ry="22" fill="#c7d2fe" />
      {[
        { x: 90, y: 110 },
        { x: 150, y: 130 },
        { x: 205, y: 105 },
      ].map((p, i) => (
        <g key={i}>
          <ellipse cx={p.x} cy={p.y} rx="12" ry="9" fill={i % 2 === 0 ? "#818cf8" : "#f472b6"} />
          <circle cx={p.x - 6} cy={p.y - 8} r="5" fill={i % 2 === 0 ? "#818cf8" : "#f472b6"} />
          <path d={`M${p.x - 9} ${p.y - 11} L${p.x - 11} ${p.y - 17} L${p.x - 5} ${p.y - 13} Z`} fill={i % 2 === 0 ? "#818cf8" : "#f472b6"} />
          <path d={`M${p.x - 3} ${p.y - 11} L${p.x - 1} ${p.y - 17} L${p.x + 3} ${p.y - 13} Z`} fill={i % 2 === 0 ? "#818cf8" : "#f472b6"} />
        </g>
      ))}
      <text x="150" y="170" textAnchor="middle" fontSize="14" fontWeight="600" fill="#4338ca" fontFamily="sans-serif">
        (means: it&apos;s pouring rain!)
      </text>
    </svg>
  );
}

function SentenceTypesBlocks() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="Three rows of connected blocks of increasing length, representing simple, compound, and complex sentences">
      <rect width="300" height="180" fill="#f5f3ff" />
      <rect x="30" y="35" width="70" height="28" rx="6" fill="#a78bfa" />
      <text x="150" y="35" textAnchor="middle" fontSize="12" fill="#5b21b6" fontFamily="sans-serif" fontWeight="600">
        simple
      </text>
      <rect x="30" y="85" width="70" height="28" rx="6" fill="#818cf8" />
      <rect x="110" y="85" width="70" height="28" rx="6" fill="#818cf8" />
      <text x="220" y="103" textAnchor="middle" fontSize="12" fill="#3730a3" fontFamily="sans-serif" fontWeight="600">
        compound
      </text>
      <rect x="30" y="135" width="55" height="28" rx="6" fill="#c4b5fd" />
      <rect x="95" y="135" width="90" height="28" rx="6" fill="#7c3aed" />
      <text x="240" y="153" textAnchor="middle" fontSize="12" fill="#4c1d95" fontFamily="sans-serif" fontWeight="600">
        complex
      </text>
    </svg>
  );
}

function NarrativeMountain() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A mountain shape labeled beginning, build up, problem at the peak, problem solved, and ending, representing story structure">
      <rect width="300" height="180" fill="#fef2f2" />
      <path d="M20 150 L110 55 L150 90 L190 40 L280 150 Z" fill="#fecaca" stroke="#b91c1c" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="190" cy="40" r="6" fill="#b91c1c" />
      <text x="190" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#991b1b" fontFamily="sans-serif">
        problem
      </text>
      <text x="45" y="168" textAnchor="middle" fontSize="9" fill="#7f1d1d" fontFamily="sans-serif">
        beginning
      </text>
      <text x="115" y="168" textAnchor="middle" fontSize="9" fill="#7f1d1d" fontFamily="sans-serif">
        build up
      </text>
      <text x="230" y="168" textAnchor="middle" fontSize="9" fill="#7f1d1d" fontFamily="sans-serif">
        solved
      </text>
      <text x="270" y="168" textAnchor="middle" fontSize="9" fill="#7f1d1d" fontFamily="sans-serif">
        ending
      </text>
    </svg>
  );
}

function MoodSettingWords() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A single house split down the middle, one side bright and cheerful, the other dark and eerie, representing mood created through word choice">
      <rect width="150" height="180" fill="#fef9c3" />
      <rect x="150" width="150" height="180" fill="#1e293b" />
      <circle cx="70" cy="45" r="24" fill="#fbbf24" />
      <path d="M60 150 L60 100 L110 100 L110 150 Z" fill="#fef3c7" stroke="#ca8a04" strokeWidth="4" />
      <path d="M50 100 L85 70 L120 100 Z" fill="#f59e0b" stroke="#ca8a04" strokeWidth="4" strokeLinejoin="round" />
      <rect x="76" y="118" width="16" height="32" fill="#ca8a04" />
      <path d="M190 150 L190 100 L240 100 L240 150 Z" fill="#334155" stroke="#0f172a" strokeWidth="4" />
      <path d="M180 100 L215 65 L250 100 Z" fill="#0f172a" stroke="#0f172a" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="205" cy="118" r="3" fill="#fde68a" />
      <circle cx="225" cy="130" r="3" fill="#fde68a" />
      <path d="M170 50 Q180 40 190 50" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M255 60 Q265 50 275 60" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function AdverbLadder() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="Three steps rising like a staircase, labeled well, better, and best, representing comparative and superlative adverbs">
      <rect width="300" height="180" fill="#ecfeff" />
      <rect x="30" y="128" width="70" height="30" fill="#67e8f9" stroke="#0e7490" strokeWidth="3" />
      <rect x="115" y="88" width="70" height="70" fill="#22d3ee" stroke="#0e7490" strokeWidth="3" />
      <rect x="200" y="48" width="70" height="110" fill="#06b6d4" stroke="#0e7490" strokeWidth="3" />
      <text x="65" y="148" textAnchor="middle" fontSize="12" fontWeight="600" fill="#164e63" fontFamily="sans-serif">
        well
      </text>
      <text x="150" y="108" textAnchor="middle" fontSize="12" fontWeight="600" fill="#164e63" fontFamily="sans-serif">
        better
      </text>
      <text x="235" y="68" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f0fdff" fontFamily="sans-serif">
        best
      </text>
      <path d="M235 44 L245 30 L255 44 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function WritingChecklistFinal() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A checklist with four checked boxes labeled mood, punctuation, apostrophes, and speech, representing a full writing checklist">
      <rect width="300" height="180" fill="#f0f9ff" />
      <rect x="70" y="20" width="160" height="150" rx="10" fill="#ffffff" stroke="#0369a1" strokeWidth="5" />
      {[
        { y: 45, label: "mood" },
        { y: 78, label: "punctuation" },
        { y: 111, label: "apostrophes" },
        { y: 144, label: "speech" },
      ].map((row) => (
        <g key={row.label}>
          <rect x="86" y={row.y} width="18" height="18" rx="3" fill="#e0f2fe" stroke="#0369a1" strokeWidth="3" />
          <path d={`M90 ${row.y + 9} L96 ${row.y + 15} L102 ${row.y + 4}`} stroke="#0369a1" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="112" y={row.y + 14} fontSize="13" fill="#0c4a6e" fontFamily="sans-serif">
            {row.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function EquivalentFractions() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A bar split into two equal halves with one shaded, above an identical bar split into four quarters with two shaded, showing 1/2 equals 2/4">
      <rect width="300" height="180" fill="#fff7ed" />
      <rect x="30" y="15" width="120" height="35" fill="#f97316" stroke="#9a3412" strokeWidth="3" />
      <rect x="150" y="15" width="120" height="35" fill="#ffffff" stroke="#9a3412" strokeWidth="3" />
      <text x="150" y="65" textAnchor="middle" fontSize="16" fontWeight="600" fill="#7c2d12" fontFamily="sans-serif">
        1/2
      </text>
      <text x="150" y="92" textAnchor="middle" fontSize="22" fontWeight="700" fill="#7c2d12" fontFamily="sans-serif">
        =
      </text>
      <rect x="30" y="105" width="60" height="35" fill="#f97316" stroke="#9a3412" strokeWidth="3" />
      <rect x="90" y="105" width="60" height="35" fill="#f97316" stroke="#9a3412" strokeWidth="3" />
      <rect x="150" y="105" width="60" height="35" fill="#ffffff" stroke="#9a3412" strokeWidth="3" />
      <rect x="210" y="105" width="60" height="35" fill="#ffffff" stroke="#9a3412" strokeWidth="3" />
      <text x="150" y="155" textAnchor="middle" fontSize="16" fontWeight="600" fill="#7c2d12" fontFamily="sans-serif">
        2/4
      </text>
    </svg>
  );
}

function ComparingFractions() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A bar showing two thirds shaded above a bar showing three quarters shaded, with a less-than sign between them">
      <rect width="300" height="180" fill="#eff6ff" />
      <rect x="30" y="15" width="80" height="35" fill="#3b82f6" stroke="#1e40af" strokeWidth="3" />
      <rect x="110" y="15" width="80" height="35" fill="#3b82f6" stroke="#1e40af" strokeWidth="3" />
      <rect x="190" y="15" width="80" height="35" fill="#ffffff" stroke="#1e40af" strokeWidth="3" />
      <text x="150" y="65" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1e3a8a" fontFamily="sans-serif">
        2/3
      </text>
      <text x="150" y="92" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1e3a8a" fontFamily="sans-serif">
        &lt;
      </text>
      <rect x="30" y="105" width="60" height="35" fill="#3b82f6" stroke="#1e40af" strokeWidth="3" />
      <rect x="90" y="105" width="60" height="35" fill="#3b82f6" stroke="#1e40af" strokeWidth="3" />
      <rect x="150" y="105" width="60" height="35" fill="#3b82f6" stroke="#1e40af" strokeWidth="3" />
      <rect x="210" y="105" width="60" height="35" fill="#ffffff" stroke="#1e40af" strokeWidth="3" />
      <text x="150" y="155" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1e3a8a" fontFamily="sans-serif">
        3/4
      </text>
    </svg>
  );
}

function MixedImproperFractions() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="Two full squares and a third square with one of three strips shaded, showing 2 and 1 third equals 7 thirds">
      <rect width="300" height="180" fill="#f0fdfa" />
      <rect x="15" y="35" width="70" height="75" fill="#0d9488" stroke="#134e4a" strokeWidth="3" />
      <rect x="100" y="35" width="70" height="75" fill="#0d9488" stroke="#134e4a" strokeWidth="3" />
      <rect x="185" y="35" width="23" height="75" fill="#0d9488" />
      <rect x="208" y="35" width="23" height="75" fill="#ffffff" />
      <rect x="231" y="35" width="24" height="75" fill="#ffffff" />
      <rect x="185" y="35" width="70" height="75" fill="none" stroke="#134e4a" strokeWidth="3" />
      <text x="150" y="150" textAnchor="middle" fontSize="17" fontWeight="700" fill="#134e4a" fontFamily="sans-serif">
        2 1/3 = 7/3
      </text>
    </svg>
  );
}

function FractionOfQuantity() {
  const cols = [60, 120, 180, 240];
  const rows = [40, 80, 120];
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A grid of twelve dots with nine of them highlighted, showing three quarters of twelve equals nine">
      <rect width="300" height="180" fill="#fffbeb" />
      {rows.map((y) =>
        cols.map((x, colIndex) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="16"
            fill={colIndex < 3 ? "#f59e0b" : "#ffffff"}
            stroke="#92400e"
            strokeWidth="3"
          />
        ))
      )}
      <text x="150" y="165" textAnchor="middle" fontSize="16" fontWeight="700" fill="#78350f" fontFamily="sans-serif">
        3/4 of 12 = 9
      </text>
    </svg>
  );
}

function PercentFractionDecimal() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="Three connected circles labeled 50 percent, 1/2, and 0.5, showing they are equal values">
      <rect width="300" height="180" fill="#f5f3ff" />
      <line x1="150" y1="45" x2="70" y2="140" stroke="#6d28d9" strokeWidth="3" />
      <line x1="150" y1="45" x2="230" y2="140" stroke="#6d28d9" strokeWidth="3" />
      <line x1="70" y1="140" x2="230" y2="140" stroke="#6d28d9" strokeWidth="3" />
      <circle cx="150" cy="45" r="36" fill="#8b5cf6" />
      <text x="150" y="52" textAnchor="middle" fontSize="15" fontWeight="700" fill="#ffffff" fontFamily="sans-serif">
        50%
      </text>
      <circle cx="70" cy="140" r="36" fill="#8b5cf6" />
      <text x="70" y="147" textAnchor="middle" fontSize="15" fontWeight="700" fill="#ffffff" fontFamily="sans-serif">
        1/2
      </text>
      <circle cx="230" cy="140" r="36" fill="#8b5cf6" />
      <text x="230" y="147" textAnchor="middle" fontSize="15" fontWeight="700" fill="#ffffff" fontFamily="sans-serif">
        0.5
      </text>
    </svg>
  );
}

function RatioBarModel() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A bar split into two blue segments and three orange segments, representing a ratio of 2 to 3">
      <rect width="300" height="180" fill="#f8fafc" />
      <text x="150" y="45" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1e293b" fontFamily="sans-serif">
        2 : 3
      </text>
      <rect x="30" y="60" width="48" height="50" fill="#3b82f6" stroke="#1e293b" strokeWidth="2" />
      <rect x="78" y="60" width="48" height="50" fill="#3b82f6" stroke="#1e293b" strokeWidth="2" />
      <rect x="126" y="60" width="48" height="50" fill="#f97316" stroke="#1e293b" strokeWidth="2" />
      <rect x="174" y="60" width="48" height="50" fill="#f97316" stroke="#1e293b" strokeWidth="2" />
      <rect x="222" y="60" width="48" height="50" fill="#f97316" stroke="#1e293b" strokeWidth="2" />
      <text x="78" y="130" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1e293b" fontFamily="sans-serif">
        2 parts
      </text>
      <text x="198" y="130" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1e293b" fontFamily="sans-serif">
        3 parts
      </text>
    </svg>
  );
}

function ProportionScaling() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="One small square scaling up by 4 into a 2 by 2 grid of four squares, representing proportion">
      <rect width="300" height="180" fill="#ecfdf5" />
      <rect x="30" y="80" width="45" height="45" fill="#10b981" stroke="#065f46" strokeWidth="3" />
      <text x="52" y="145" textAnchor="middle" fontSize="14" fontWeight="600" fill="#065f46" fontFamily="sans-serif">
        1 unit
      </text>
      <line x1="90" y1="100" x2="175" y2="100" stroke="#065f46" strokeWidth="4" />
      <path d="M175 100 L163 93 L163 107 Z" fill="#065f46" />
      <text x="132" y="85" textAnchor="middle" fontSize="15" fontWeight="700" fill="#065f46" fontFamily="sans-serif">
        x 4
      </text>
      <rect x="190" y="75" width="40" height="40" fill="#10b981" stroke="#065f46" strokeWidth="3" />
      <rect x="235" y="75" width="40" height="40" fill="#10b981" stroke="#065f46" strokeWidth="3" />
      <rect x="190" y="120" width="40" height="40" fill="#10b981" stroke="#065f46" strokeWidth="3" />
      <rect x="235" y="120" width="40" height="40" fill="#10b981" stroke="#065f46" strokeWidth="3" />
      <text x="232" y="175" textAnchor="middle" fontSize="14" fontWeight="600" fill="#065f46" fontFamily="sans-serif">
        4 units
      </text>
    </svg>
  );
}

function PizzaFractionSlices() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="Two pizzas cut into slices - one cut in half with one slice shaded, another cut into quarters with two slices shaded, showing 1/2 equals 2/4">
      <rect width="300" height="180" fill="#fff7ed" />
      <circle cx="75" cy="82" r="60" fill="#ffe8d1" stroke="#9a3412" strokeWidth="4" />
      <path d="M75,82 L75,22 A60,60 0 0,0 75,142 Z" fill="#f97316" stroke="#9a3412" strokeWidth="3" />
      <text x="75" y="168" textAnchor="middle" fontSize="16" fontWeight="600" fill="#7c2d12" fontFamily="sans-serif">
        1/2
      </text>
      <text x="150" y="90" textAnchor="middle" fontSize="26" fontWeight="700" fill="#7c2d12" fontFamily="sans-serif">
        =
      </text>
      <circle cx="225" cy="82" r="60" fill="#ffe8d1" stroke="#9a3412" strokeWidth="4" />
      <path d="M225,82 L225,22 A60,60 0 0,0 165,82 Z" fill="#f97316" stroke="#9a3412" strokeWidth="3" />
      <path d="M225,82 L165,82 A60,60 0 0,0 225,142 Z" fill="#f97316" stroke="#9a3412" strokeWidth="3" />
      <line x1="225" y1="22" x2="225" y2="142" stroke="#9a3412" strokeWidth="3" />
      <line x1="165" y1="82" x2="285" y2="82" stroke="#9a3412" strokeWidth="3" />
      <text x="225" y="168" textAnchor="middle" fontSize="16" fontWeight="600" fill="#7c2d12" fontFamily="sans-serif">
        2/4
      </text>
    </svg>
  );
}

// 2026-09-06: Unit 2 (Biography) illustrations - the first animated ones in
// this file. Real feedback: "graphically animated pictures... make it more
// inclined for the students". CSS keyframes scoped inside each <svg> via a
// unique class prefix (u2c1/u2c2/...) so multiple of these can render on
// the same page without their animations colliding, and gated behind
// prefers-reduced-motion like the rest of this app's animated UI.

function BiographyFeaturesPortrait() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A framed portrait with a twinkling star and a small dated ribbon, representing the features of a biography">
      <style>{`
        @keyframes u2c1-sparkle { 0%,100% { opacity: 0.2; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.15); } }
        @keyframes u2c1-frame { to { stroke-dashoffset: 0; } }
        .u2c1-star { animation: u2c1-sparkle 1.8s ease-in-out infinite; transform-origin: center; }
        .u2c1-frame { stroke-dasharray: 340; stroke-dashoffset: 340; animation: u2c1-frame 2.2s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) { .u2c1-star, .u2c1-frame { animation: none; opacity: 1; stroke-dashoffset: 0; } }
      `}</style>
      <rect width="300" height="180" fill="#fdf2e9" />
      <rect x="95" y="30" width="110" height="130" rx="6" fill="#ffffff" stroke="#b45309" strokeWidth="8" className="u2c1-frame" />
      <circle cx="150" cy="80" r="24" fill="#f59e0b" />
      <path d="M118 140 Q150 108 182 140 Z" fill="#f59e0b" />
      <rect x="110" y="150" width="80" height="14" rx="7" fill="#dc2626" />
      <text x="150" y="161" textAnchor="middle" fontSize="10" fontWeight="700" fill="#ffffff" fontFamily="sans-serif">1990 - 2024</text>
      <path className="u2c1-star" d="M232 55 L237 68 L251 68 L240 76 L244 90 L232 81 L220 90 L224 76 L213 68 L227 68 Z" fill="#eab308" />
      <path className="u2c1-star" d="M60 100 L63 108 L71 108 L64 113 L67 121 L60 116 L53 121 L56 113 L49 108 L57 108 Z" fill="#eab308" style={{ animationDelay: "0.6s" }} />
    </svg>
  );
}

function ChronologicalTimeline() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A timeline with four dots lighting up in order, representing chronological order in a biography">
      <style>{`
        @keyframes u2c2-light { 0%,20% { opacity: 0.25; r: 8; } 30%,100% { opacity: 1; r: 11; } }
        .u2c2-dot1 { animation: u2c2-light 3.2s ease-in-out infinite; }
        .u2c2-dot2 { animation: u2c2-light 3.2s ease-in-out infinite 0.5s; }
        .u2c2-dot3 { animation: u2c2-light 3.2s ease-in-out infinite 1s; }
        .u2c2-dot4 { animation: u2c2-light 3.2s ease-in-out infinite 1.5s; }
        @media (prefers-reduced-motion: reduce) { .u2c2-dot1,.u2c2-dot2,.u2c2-dot3,.u2c2-dot4 { animation: none; opacity: 1; } }
      `}</style>
      <rect width="300" height="180" fill="#eef2ff" />
      <line x1="40" y1="100" x2="260" y2="100" stroke="#6366f1" strokeWidth="4" />
      <circle className="u2c2-dot1" cx="60" cy="100" r="11" fill="#4f46e5" />
      <circle className="u2c2-dot2" cx="120" cy="100" r="11" fill="#4f46e5" />
      <circle className="u2c2-dot3" cx="180" cy="100" r="11" fill="#4f46e5" />
      <circle className="u2c2-dot4" cx="240" cy="100" r="11" fill="#4f46e5" />
      <text x="60" y="130" textAnchor="middle" fontSize="10" fontWeight="700" fill="#3730a3" fontFamily="sans-serif">Born</text>
      <text x="120" y="130" textAnchor="middle" fontSize="10" fontWeight="700" fill="#3730a3" fontFamily="sans-serif">School</text>
      <text x="180" y="130" textAnchor="middle" fontSize="10" fontWeight="700" fill="#3730a3" fontFamily="sans-serif">Career</text>
      <text x="240" y="130" textAnchor="middle" fontSize="10" fontWeight="700" fill="#3730a3" fontFamily="sans-serif">Today</text>
      <path d="M40 100 L52 94 L52 106 Z" fill="#4338ca" />
    </svg>
  );
}

function RegisterFormalInformal() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="Two speech bubbles, one formal and one informal, fading in and out to represent register">
      <style>{`
        @keyframes u2c3-fade { 0%,45% { opacity: 1; } 50%,95% { opacity: 0.15; } 100% { opacity: 1; } }
        .u2c3-formal { animation: u2c3-fade 4s ease-in-out infinite; }
        .u2c3-informal { animation: u2c3-fade 4s ease-in-out infinite 2s; }
        @media (prefers-reduced-motion: reduce) { .u2c3-formal, .u2c3-informal { animation: none; opacity: 1; } }
      `}</style>
      <rect width="300" height="180" fill="#f0fdfa" />
      <g className="u2c3-formal">
        <rect x="30" y="35" width="115" height="60" rx="10" fill="#ffffff" stroke="#0f766e" strokeWidth="5" />
        <path d="M55 95 L40 118 L75 96 Z" fill="#ffffff" stroke="#0f766e" strokeWidth="5" strokeLinejoin="round" />
        <text x="87" y="58" textAnchor="middle" fontSize="9" fontWeight="700" fill="#134e4a" fontFamily="serif">Good morning,</text>
        <text x="87" y="75" textAnchor="middle" fontSize="9" fontWeight="700" fill="#134e4a" fontFamily="serif">how are you?</text>
      </g>
      <g className="u2c3-informal">
        <rect x="155" y="90" width="115" height="60" rx="26" fill="#fef08a" stroke="#ca8a04" strokeWidth="5" />
        <path d="M245 150 L262 170 L228 150 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="5" strokeLinejoin="round" />
        <text x="212" y="115" textAnchor="middle" fontSize="10" fontWeight="800" fill="#854d0e" fontFamily="sans-serif">Hey, what&apos;s up?</text>
      </g>
    </svg>
  );
}

function SynonymThesaurus() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="An open thesaurus with an arrow turning a plain word into a stronger synonym">
      <style>{`
        @keyframes u2c4-arrow { 0% { stroke-dashoffset: 60; opacity: 0.3; } 60%,100% { stroke-dashoffset: 0; opacity: 1; } }
        @keyframes u2c4-pop { 0%,55% { opacity: 0; transform: translateY(6px); } 75%,100% { opacity: 1; transform: translateY(0); } }
        .u2c4-arrow { stroke-dasharray: 60; animation: u2c4-arrow 2.4s ease-out infinite; }
        .u2c4-new { animation: u2c4-pop 2.4s ease-out infinite; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) { .u2c4-arrow, .u2c4-new { animation: none; opacity: 1; stroke-dashoffset: 0; transform: none; } }
      `}</style>
      <rect width="300" height="180" fill="#fdf4ff" />
      <path d="M35 45 L150 35 L150 145 L35 155 Z" fill="#ffffff" stroke="#7e22ce" strokeWidth="5" />
      <path d="M150 35 L265 45 L265 155 L150 145 Z" fill="#f3e8ff" stroke="#7e22ce" strokeWidth="5" />
      <text x="90" y="90" textAnchor="middle" fontSize="15" fontWeight="700" fill="#6b21a8" fontFamily="sans-serif" textDecoration="line-through">hit</text>
      <path className="u2c4-arrow" d="M115 95 Q150 115 185 100" stroke="#a855f7" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M178 92 L188 100 L177 106" stroke="#a855f7" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text className="u2c4-new" x="210" y="95" textAnchor="middle" fontSize="15" fontWeight="800" fill="#86198f" fontFamily="sans-serif">strike</text>
    </svg>
  );
}

function FactOpinionBalanceScale() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A balance scale tilting between a fact checkmark and an opinion thought bubble">
      <style>{`
        @keyframes u2c5-tilt { 0%,100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
        .u2c5-beam { animation: u2c5-tilt 3s ease-in-out infinite; transform-origin: 150px 70px; }
        @media (prefers-reduced-motion: reduce) { .u2c5-beam { animation: none; transform: none; } }
      `}</style>
      <rect width="300" height="180" fill="#fff7ed" />
      <rect x="145" y="70" width="10" height="80" fill="#78350f" />
      <path d="M120 155 L180 155 L170 165 L130 165 Z" fill="#78350f" />
      <g className="u2c5-beam">
        <line x1="55" y1="70" x2="245" y2="70" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
        <circle cx="150" cy="70" r="8" fill="#92400e" />
        <line x1="55" y1="70" x2="55" y2="105" stroke="#78350f" strokeWidth="3" />
        <path d="M30 105 Q55 130 80 105 Z" fill="#dcfce7" stroke="#16a34a" strokeWidth="3" />
        <path d="M40 108 L48 118 L64 100" stroke="#15803d" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="245" y1="70" x2="245" y2="105" stroke="#78350f" strokeWidth="3" />
        <path d="M220 105 Q245 130 270 105 Z" fill="#fce7f3" stroke="#db2777" strokeWidth="3" />
        <circle cx="238" cy="112" r="2.5" fill="#be185d" />
        <circle cx="245" cy="107" r="3.5" fill="#be185d" />
        <circle cx="254" cy="110" r="4.5" fill="#be185d" />
      </g>
      <text x="63" y="45" textAnchor="middle" fontSize="12" fontWeight="800" fill="#15803d" fontFamily="sans-serif">FACT</text>
      <text x="237" y="45" textAnchor="middle" fontSize="12" fontWeight="800" fill="#be185d" fontFamily="sans-serif">OPINION</text>
    </svg>
  );
}

function PrefixSuffixBuilder() {
  return (
    <svg viewBox="0 0 300 180" className="h-full w-full" role="img" aria-label="A prefix block and a suffix block sliding in to attach to a root word, building a new word">
      <style>{`
        @keyframes u2c6-slide-left { 0%,15% { transform: translateX(-40px); opacity: 0; } 45%,100% { transform: translateX(0); opacity: 1; } }
        @keyframes u2c6-slide-right { 0%,15% { transform: translateX(40px); opacity: 0; } 45%,100% { transform: translateX(0); opacity: 1; } }
        .u2c6-prefix { animation: u2c6-slide-left 3s ease-out infinite; }
        .u2c6-suffix { animation: u2c6-slide-right 3s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .u2c6-prefix, .u2c6-suffix { animation: none; transform: none; opacity: 1; } }
      `}</style>
      <rect width="300" height="180" fill="#eff6ff" />
      <rect x="115" y="70" width="70" height="46" rx="8" fill="#1d4ed8" />
      <text x="150" y="99" textAnchor="middle" fontSize="16" fontWeight="800" fill="#ffffff" fontFamily="sans-serif">happy</text>
      <g className="u2c6-prefix">
        <rect x="35" y="70" width="55" height="46" rx="8" fill="#f97316" />
        <text x="62" y="99" textAnchor="middle" fontSize="16" fontWeight="800" fill="#ffffff" fontFamily="sans-serif">un-</text>
      </g>
      <g className="u2c6-suffix">
        <rect x="210" y="70" width="60" height="46" rx="8" fill="#16a34a" />
        <text x="240" y="99" textAnchor="middle" fontSize="16" fontWeight="800" fill="#ffffff" fontFamily="sans-serif">-ness</text>
      </g>
    </svg>
  );
}

const ILLUSTRATIONS: Record<string, () => JSX.Element> = {
  cockerel_hyena_fable: CockerelHyenaFable,
  implicit_meaning_clue: ImplicitMeaningClue,
  explicit_meaning_direct: ExplicitMeaningDirect,
  predicting_next_page: PredictingNextPage,
  perspective_two_views: PerspectiveTwoViews,
  proofreading_checklist: ProofreadingChecklist,
  fact_vs_opinion_scale: FactVsOpinionScale,
  idiom_literal_vs_meaning: IdiomLiteralVsMeaning,
  sentence_types_blocks: SentenceTypesBlocks,
  narrative_mountain: NarrativeMountain,
  mood_setting_words: MoodSettingWords,
  adverb_ladder: AdverbLadder,
  writing_checklist_final: WritingChecklistFinal,
  equivalent_fractions: EquivalentFractions,
  comparing_fractions: ComparingFractions,
  mixed_improper_fractions: MixedImproperFractions,
  fraction_of_quantity: FractionOfQuantity,
  percent_fraction_decimal: PercentFractionDecimal,
  ratio_bar_model: RatioBarModel,
  proportion_scaling: ProportionScaling,
  pizza_fraction_slices: PizzaFractionSlices,
  biography_features_portrait: BiographyFeaturesPortrait,
  chronological_timeline: ChronologicalTimeline,
  register_formal_informal: RegisterFormalInformal,
  synonym_thesaurus: SynonymThesaurus,
  fact_opinion_balance_scale: FactOpinionBalanceScale,
  prefix_suffix_builder: PrefixSuffixBuilder,
};

// Lets callers check a key is real before rendering a wrapper around it -
// Illustration itself silently returns null for an unknown key, which is
// fine for a full-card slot but would leave an empty box if wrapped in a
// fixed-aspect chat bubble (see AvatarChat.tsx's inline illustration token).
export function hasIllustration(illustrationKey: string): boolean {
  return illustrationKey in ILLUSTRATIONS;
}

export function Illustration({ illustrationKey }: { illustrationKey: string }) {
  const Component = ILLUSTRATIONS[illustrationKey];
  if (!Component) return null;
  return <Component />;
}
