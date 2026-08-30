"use client";

import { useState } from "react";
import Avatar from "../Avatar";
import {
  WIDGET_GOLD,
  WIDGET_GOLD_BRIGHT,
  WIDGET_INK,
  WIDGET_PAPER,
  getWidgetForConcept,
  type ClueDetectiveSpec,
  type InteractiveWidget,
  type LifeMountainSpec,
  type PrefixMachineSpec,
  type SentenceTrainSpec,
} from "@/lib/interactiveWidgets";

/**
 * One dispatcher, one discriminated union, four small SVG canvases.
 *
 * Dispatch is on the spec's own `kind`, NOT on a test question's
 * `concept_tested` value: `concept_tested` is the mastery-mapping key that
 * app/api/attempts routes resolve against Concept.conceptKey, and reusing it
 * as a rendering discriminator would tie two unrelated things together (and
 * break the moment two concepts want the same widget, or one concept wants a
 * widget with no test question pointing at it). Which concept gets which
 * widget is a lookup in lib/interactiveWidgets.ts; what to draw is `kind`.
 */

// ---------------------------------------------------------------- Ezy bubble

function EzyBubble({ text }: { text: string }) {
  return (
    <div className="mt-3 flex items-start gap-2">
      <Avatar speaking={false} />
      <div className="message-enter rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm leading-relaxed text-slate-800 shadow-sm">
        {text}
      </div>
    </div>
  );
}

/** Shared chrome so all four widgets read as one family. */
function WidgetShell({
  widget,
  ezyText,
  onHint,
  hintUsed,
  children,
}: {
  widget: InteractiveWidget;
  ezyText: string | null;
  onHint: () => void;
  hintUsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-practice-border bg-practice-bg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold text-brand-ink">{widget.title}</h3>
          <p className="mt-0.5 text-xs text-slate-600">{widget.instruction}</p>
        </div>
        <button
          type="button"
          onClick={onHint}
          className="shrink-0 rounded-full border border-brand-gold/40 bg-white px-3 py-1.5 text-xs font-medium text-brand-gold transition active:scale-95"
        >
          {hintUsed ? "Hint again" : "Get hint"}
        </button>
      </div>

      <div className="mt-3 rounded-xl bg-white p-3">{children}</div>

      {ezyText && <EzyBubble text={ezyText} />}
    </section>
  );
}

// ------------------------------------------------------- W1 Clue Detective

function ClueDetective({ spec, onEzy }: { spec: ClueDetectiveSpec; onEzy: (t: string) => void }) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const winking = spec.clues.some((c) => c.reveals === "wink" && revealed[c.word]);
  const grinning = spec.clues.some((c) => c.reveals === "grin" && revealed[c.word]);

  const tap = (word: string, ezySays: string) => {
    setRevealed((r) => ({ ...r, [word]: true }));
    onEzy(ezySays);
  };

  // The sentence is split so the clue words become buttons in place, keeping
  // the sentence readable as a sentence rather than a word soup.
  const clueWords = new Set(spec.clues.map((c) => c.word));
  const tokens = spec.sentence.split(/(\s+)/);

  return (
    <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
      <svg viewBox="0 0 400 400" className="mx-auto h-48 w-48" role="img" aria-label="Jo's face">
        <rect x="10" y="10" width="380" height="380" rx="24" fill={WIDGET_PAPER} stroke={WIDGET_INK} strokeWidth="4" />
        <circle cx="200" cy="180" r="90" fill="#FFE0BD" stroke={WIDGET_INK} strokeWidth="4" />
        <path d="M 110,180 C 110,90 290,90 290,180 C 290,130 110,130 110,180 Z" fill="#4A3728" stroke={WIDGET_INK} strokeWidth="4" />

        {/* left eye is always open */}
        <circle cx="165" cy="170" r="12" fill="#fff" stroke={WIDGET_INK} strokeWidth="3" />
        <circle cx="165" cy="170" r="5" fill={WIDGET_INK} />

        {/* right eye: open circle scales to nothing as the wink arc draws in */}
        <g
          className="transition-transform duration-300"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            transform: winking ? "scaleY(0)" : "scaleY(1)",
          }}
        >
          <circle cx="235" cy="170" r="12" fill="#fff" stroke={WIDGET_INK} strokeWidth="3" />
          <circle cx="235" cy="170" r="5" fill={WIDGET_INK} />
        </g>
        <path
          d="M 220,170 Q 235,182 250,170"
          fill="none"
          stroke={WIDGET_INK}
          strokeWidth="6"
          strokeLinecap="round"
          className="transition-opacity duration-300"
          style={{ opacity: winking ? 1 : 0 }}
        />

        {/* mouth: neutral line crossfades into the grin */}
        <path
          d="M 175,220 Q 200,230 225,220"
          fill="none"
          stroke={WIDGET_INK}
          strokeWidth="4"
          strokeLinecap="round"
          className="transition-opacity duration-300"
          style={{ opacity: grinning ? 0 : 1 }}
        />
        <path
          d="M 165,210 Q 200,250 235,210 Z"
          fill="#FF8A8A"
          stroke={WIDGET_INK}
          strokeWidth="4"
          className="transition-all duration-300"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            opacity: grinning ? 1 : 0,
            transform: grinning ? "scale(1)" : "scale(0.6)",
          }}
        />

        {/* a little sparkle once both clues are found */}
        {winking && grinning && (
          <g className="animate-pulse">
            <path d="M 305,110 l 8,18 18,8 -18,8 -8,18 -8,-18 -18,-8 18,-8 Z" fill={WIDGET_GOLD_BRIGHT} />
          </g>
        )}
      </svg>

      <p className="text-base leading-loose text-slate-800">
        {tokens.map((tok, i) => {
          const bare = tok.replace(/[^A-Za-z]/g, "");
          const clue = clueWords.has(bare) ? spec.clues.find((c) => c.word === bare) : undefined;
          if (!clue) return <span key={i}>{tok}</span>;
          const done = revealed[clue.word];
          return (
            <button
              key={i}
              type="button"
              onClick={() => tap(clue.word, clue.ezySays)}
              className={`rounded-lg border-b-4 px-1.5 py-0.5 font-semibold transition active:scale-95 ${
                done
                  ? "border-brand-gold bg-brand-gold-bright/30 text-brand-ink-dark"
                  : "animate-pulse border-brand-gold/40 bg-brand-gold-bright/15 text-brand-gold hover:bg-brand-gold-bright/25"
              }`}
            >
              {tok}
            </button>
          );
        })}
      </p>
    </div>
  );
}

// ------------------------------------------------------ W2 Sentence Train

function SentenceTrain({ spec, onEzy }: { spec: SentenceTrainSpec; onEzy: (t: string) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const chosen = spec.couplers.find((c) => c.id === picked);
  const solved = chosen?.correct === true;

  const choose = (id: string) => {
    setPicked(id);
    const c = spec.couplers.find((x) => x.id === id);
    if (!c) return;
    onEzy(
      c.correct
        ? spec.ezyOnSuccess
        : c.type === "complex"
        ? `'${c.label}' makes a complex sentence - it explains a reason. These two ideas aren't a reason, they're opposites. Try again!`
        : `'${c.label}' just adds one idea to another. But these two ideas disagree with each other - you need a joining word that shows a contrast.`
    );
  };

  return (
    <div>
      <svg viewBox="0 0 600 250" className="w-full" role="img" aria-label="Sentence train">
        {/* track */}
        <rect x="10" y="170" width="580" height="6" rx="3" fill={WIDGET_INK} opacity="0.25" />
        {[...Array(12)].map((_, i) => (
          <rect key={i} x={20 + i * 48} y="176" width="28" height="6" rx="2" fill={WIDGET_INK} opacity="0.15" />
        ))}

        {/* carriages slide inward once solved */}
        <g className="transition-transform duration-500" style={{ transform: solved ? "translateX(28px)" : "translateX(0)" }}>
          <rect x="30" y="80" width="200" height="70" rx="12" fill="#E2E8F0" stroke={WIDGET_INK} strokeWidth="3" />
          <foreignObject x="40" y="90" width="180" height="52">
            <div className="flex h-full items-center text-[13px] font-medium leading-tight text-brand-ink">{spec.leftCarriage}</div>
          </foreignObject>
          <circle cx="70" cy="160" r="14" fill={WIDGET_INK} />
          <circle cx="190" cy="160" r="14" fill={WIDGET_INK} />
        </g>

        <g className="transition-transform duration-500" style={{ transform: solved ? "translateX(-28px)" : "translateX(0)" }}>
          <rect x="370" y="80" width="200" height="70" rx="12" fill="#E2E8F0" stroke={WIDGET_INK} strokeWidth="3" />
          <foreignObject x="380" y="90" width="180" height="52">
            <div className="flex h-full items-center text-[13px] font-medium leading-tight text-brand-ink">{spec.rightCarriage}</div>
          </foreignObject>
          <circle cx="410" cy="160" r="14" fill={WIDGET_INK} />
          <circle cx="530" cy="160" r="14" fill={WIDGET_INK} />
        </g>

        {/* coupler slot */}
        <rect
          x="250"
          y="100"
          width="100"
          height="40"
          rx="8"
          fill={solved ? WIDGET_GOLD_BRIGHT : "transparent"}
          stroke={solved ? WIDGET_GOLD : WIDGET_GOLD_BRIGHT}
          strokeWidth="3"
          strokeDasharray={solved ? "0" : "7 5"}
          className="transition-all duration-300"
        />
        {chosen && (
          <text x="300" y="127" textAnchor="middle" className="font-semibold" fontSize="20" fill={solved ? "#fff" : WIDGET_INK}>
            {chosen.label}
          </text>
        )}

        {/* steam puff on success */}
        {solved && (
          <g className="animate-pulse">
            <circle cx="60" cy="55" r="12" fill={WIDGET_PAPER} stroke={WIDGET_INK} strokeWidth="2" />
            <circle cx="85" cy="38" r="9" fill={WIDGET_PAPER} stroke={WIDGET_INK} strokeWidth="2" />
            <circle cx="106" cy="26" r="6" fill={WIDGET_PAPER} stroke={WIDGET_INK} strokeWidth="2" />
          </g>
        )}
      </svg>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {spec.couplers.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => choose(c.id)}
            className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition active:scale-95 ${
              picked === c.id
                ? c.correct
                  ? "border-brand-gold bg-brand-gold-bright/30 text-brand-ink-dark"
                  : "border-test-border bg-test-bg text-test-accent"
                : "border-slate-200 bg-white text-brand-ink hover:border-brand-gold/50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------ W3 Life Mountain

function LifeMountain({ spec, onEzy }: { spec: LifeMountainSpec; onEzy: (t: string) => void }) {
  const [step, setStep] = useState(0); // how many checkpoints are correctly placed
  const done = step >= spec.checkpoints.length;
  const climber = spec.checkpoints[Math.max(0, step - 1)];

  const tap = (index: number) => {
    if (index === step) {
      const next = step + 1;
      setStep(next);
      if (next === spec.checkpoints.length) onEzy(spec.ezyOnComplete);
      else onEzy(`Yes - '${spec.checkpoints[index].adverb}' comes next. Keep climbing!`);
    } else {
      onEzy(
        `Not quite - a biography goes in time order, so we climb from the bottom up. Look for what happened ${
          step === 0 ? "first" : `after "${spec.checkpoints[step - 1].description}"`
        }.`
      );
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
      <svg viewBox="0 0 500 500" className="mx-auto h-56 w-56" role="img" aria-label="Life mountain">
        <polygon points="50,450 250,50 450,450" fill="#94A3B8" stroke={WIDGET_INK} strokeWidth="4" />
        <polygon points="250,50 190,170 310,170" fill="#f8fafc" stroke={WIDGET_INK} strokeWidth="3" />
        {/* summit flag turns gold when the whole order is right */}
        <path
          d="M 250,50 L 250,20 L 285,35 Z"
          fill={done ? WIDGET_GOLD_BRIGHT : "#cbd5e1"}
          stroke={WIDGET_INK}
          strokeWidth="3"
          className="transition-colors duration-500"
        />
        <line x1="250" y1="50" x2="250" y2="20" stroke={WIDGET_INK} strokeWidth="4" />

        {spec.checkpoints.map((cp, i) => (
          <circle
            key={cp.adverb}
            cx={cp.x}
            cy={cp.y}
            r="13"
            className="transition-all duration-500"
            fill={i < step ? WIDGET_GOLD_BRIGHT : WIDGET_PAPER}
            stroke={WIDGET_INK}
            strokeWidth="3"
          />
        ))}

        {/* the climber sits on the highest reached checkpoint */}
        {step > 0 && climber && (
          <g className="transition-all duration-500" style={{ transform: `translate(${climber.x - 250}px, ${climber.y - 400}px)` }}>
            <circle cx="250" cy="382" r="9" fill={WIDGET_INK} />
            <rect x="245" y="391" width="10" height="16" rx="4" fill={WIDGET_INK} />
          </g>
        )}
      </svg>

      <div className="grid gap-2">
        {spec.checkpoints.map((cp, i) => {
          const placed = i < step;
          return (
            <button
              key={cp.adverb}
              type="button"
              onClick={() => tap(i)}
              disabled={placed}
              className={`rounded-xl border-2 px-3 py-2 text-left text-xs transition active:scale-95 ${
                placed
                  ? "border-brand-gold bg-brand-gold-bright/25 text-brand-ink-dark"
                  : "border-slate-200 bg-white text-brand-ink hover:border-brand-gold/50"
              }`}
            >
              <span className="font-semibold">{cp.adverb}</span>
              <span className="text-slate-600"> - {cp.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------- W4 Prefix Machine

function PrefixMachine({ spec, onEzy }: { spec: PrefixMachineSpec; onEzy: (t: string) => void }) {
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);
  const challenge = spec.challenges[index];
  const finished = index >= spec.challenges.length;

  const choose = (prefix: string) => {
    if (!challenge) return;
    if (prefix === challenge.prefix) {
      setLocked(true);
      setWrong(null);
      onEzy(`Locked in - "${prefix.replace("-", "")}${challenge.root}" is the opposite of "${challenge.root}".`);
      setTimeout(() => {
        setLocked(false);
        setIndex((i) => i + 1);
      }, 1100);
    } else {
      setWrong(prefix);
      onEzy(spec.ezyRemedial);
    }
  };

  if (finished) {
    return (
      <p className="py-6 text-center text-sm font-medium text-brand-ink">
        All five gears meshed. You&apos;ve got every prefix in this unit.
      </p>
    );
  }

  return (
    <div>
      <svg viewBox="0 0 450 200" className="mx-auto h-40 w-full max-w-sm" role="img" aria-label="Prefix machine">
        {/* prefix gear slides right and meshes when correct */}
        <g className="transition-transform duration-500" style={{ transform: locked ? "translateX(42px)" : "translateX(0)" }}>
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="#E2E8F0"
            stroke={WIDGET_INK}
            strokeWidth="3"
            className={locked ? "animate-spin" : ""}
            style={{ transformBox: "fill-box", transformOrigin: "center", animationDuration: "3s" }}
          />
          {[...Array(8)].map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <rect key={i} x={100 + Math.cos(a) * 60 - 6} y={100 + Math.sin(a) * 60 - 6} width="12" height="12" rx="2" fill={WIDGET_INK} opacity="0.35" />;
          })}
          <text x="100" y="108" textAnchor="middle" fontSize="24" className="font-semibold" fill={WIDGET_INK}>
            {locked ? challenge.prefix : "?"}
          </text>
        </g>

        <g>
          <circle cx="280" cy="100" r="80" fill="#FFE6C7" stroke={WIDGET_INK} strokeWidth="3" />
          <text x="280" y="110" textAnchor="middle" fontSize="26" className="font-semibold" fill={locked ? WIDGET_GOLD : WIDGET_INK}>
            {challenge.root}
          </text>
        </g>
      </svg>

      <p className="mt-1 text-center text-xs text-slate-500">
        Word {index + 1} of {spec.challenges.length} - make &ldquo;{challenge.root}&rdquo; mean its opposite.
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {spec.prefixes.map((p) => (
          <button
            key={p.prefix}
            type="button"
            onClick={() => choose(p.prefix)}
            className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition active:scale-95 ${
              wrong === p.prefix
                ? "border-test-border bg-test-bg text-test-accent"
                : "border-slate-200 bg-white text-brand-ink hover:border-brand-gold/50"
            }`}
          >
            {p.prefix}
          </button>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------- dispatcher

export default function WidgetDispatcher({ conceptId }: { conceptId: string }) {
  const widget = getWidgetForConcept(conceptId);
  const [ezyText, setEzyText] = useState<string | null>(null);

  if (!widget) return null;

  // "Get hint" surfaces the same coaching line the widget would give on
  // success, so a stuck child is nudged rather than stranded.
  const hintFor = (w: InteractiveWidget): string => {
    switch (w.spec.kind) {
      case "clue_detective":
        return `Try tapping "${w.spec.clues[0].word}" first - think about what someone's face is doing when they do that.`;
      case "sentence_train":
        return "These two ideas disagree with each other. Which joining word shows a contrast rather than just adding on?";
      case "life_mountain":
        return "Start at the bottom of the mountain with the earliest event in her life, then work upwards.";
      case "prefix_machine":
        return w.spec.ezyRemedial;
    }
  };

  const body = (() => {
    switch (widget.spec.kind) {
      case "clue_detective":
        return <ClueDetective spec={widget.spec} onEzy={setEzyText} />;
      case "sentence_train":
        return <SentenceTrain spec={widget.spec} onEzy={setEzyText} />;
      case "life_mountain":
        return <LifeMountain spec={widget.spec} onEzy={setEzyText} />;
      case "prefix_machine":
        return <PrefixMachine spec={widget.spec} onEzy={setEzyText} />;
    }
  })();

  return (
    <WidgetShell
      widget={widget}
      ezyText={ezyText}
      hintUsed={ezyText !== null}
      onHint={() => setEzyText(hintFor(widget))}
    >
      {body}
    </WidgetShell>
  );
}
