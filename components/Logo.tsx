// Brand marks, both cropped/sourced directly from the user's shared
// artwork (public/brand/studyezy-*) - not hand-redrawn.
//
// - LogoMark / Logo: just the bear, for compact nav/header spots -
//   object-contain so a non-square source crop never distorts inside a
//   square className box.
// - Banner: the complete original image (bear + atom + lightbulb + full
//   wordmark + tagline), reserved for a prominent hero placement, not the
//   nav - see app/page.tsx.

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/studyezy-bear.png"
      alt="StudyEzy"
      className={`object-contain ${className}`}
    />
  );
}

export function Banner({ className = "h-auto w-full" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/studyezy-logo-banner.webp"
      alt="StudyEzy - making complexity easy, from kids to grown-ups"
      className={className}
    />
  );
}

export default function Logo({
  className = "h-8 w-8",
  textClassName = "text-lg",
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className={className} />
      <span className={`font-display font-bold tracking-tight text-brand-navy ${textClassName}`}>
        StudyEzy
      </span>
    </span>
  );
}
