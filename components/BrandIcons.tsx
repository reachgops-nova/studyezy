// Small STEM-flavored accent icons echoing the shared brand reference
// (kangaroo flanked by an atom + a lightbulb) - decorative, used sparingly
// around the hero mascot, not as functional UI icons.

export function AtomIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <circle cx="24" cy="24" r="3.5" fill="#1e2a4a" />
      <ellipse cx="24" cy="24" rx="20" ry="8" stroke="#1e2a4a" strokeWidth="2.5" />
      <ellipse cx="24" cy="24" rx="20" ry="8" stroke="#1e2a4a" strokeWidth="2.5" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="20" ry="8" stroke="#fb923c" strokeWidth="2.5" transform="rotate(120 24 24)" />
    </svg>
  );
}

export function LightbulbIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <path
        d="M24 6c-8 0-13 6-13 13 0 5 2.5 8 5.5 10.5.9.75 1.5 1.9 1.5 3.1V34h12v-1.4c0-1.2.6-2.35 1.5-3.1C34.5 27 37 24 37 19c0-7-5-13-13-13Z"
        stroke="#fb923c"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M20 40h8M21 44h6" stroke="#1e2a4a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 12v3M17 19h-3M34 19h-3" stroke="#fdba74" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
