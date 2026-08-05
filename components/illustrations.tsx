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

const ILLUSTRATIONS: Record<string, () => JSX.Element> = {
  cockerel_hyena_fable: CockerelHyenaFable,
  implicit_meaning_clue: ImplicitMeaningClue,
  explicit_meaning_direct: ExplicitMeaningDirect,
};

export function Illustration({ illustrationKey }: { illustrationKey: string }) {
  const Component = ILLUSTRATIONS[illustrationKey];
  if (!Component) return null;
  return <Component />;
}
