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
};

export function Illustration({ illustrationKey }: { illustrationKey: string }) {
  const Component = ILLUSTRATIONS[illustrationKey];
  if (!Component) return null;
  return <Component />;
}
