"use client";

import { useEffect, useRef, useState } from "react";
import Avatar from "../Avatar";
import { JoWinkCartoon } from "./studyezy-cartoon-assets-v2";
import { FactOpinionScale } from "./FactOpinionScale";
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
  type TraitMatcherSpec,
  type PredictiveBrancherSpec,
  type FactOpinionSpec,
  type IdiomConnectorSpec,
  type BiographyScannerSpec,
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

function ClueDetective({ spec, onEzy, onItemResult }: { spec: ClueDetectiveSpec; onEzy: (t: string) => void; onItemResult: (correct: boolean) => void }) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const winking = spec.clues.some((c) => c.reveals === "wink" && revealed[c.word]);
  const grinning = spec.clues.some((c) => c.reveals === "grin" && revealed[c.word]);

  const tap = (word: string, ezySays: string) => {
    // Every clue word here is a real find, not a right/wrong judgment - the
    // only "item result" is whether it's been discovered yet at all.
    if (!revealed[word]) onItemResult(true);
    setRevealed((r) => ({ ...r, [word]: true }));
    onEzy(ezySays);
  };

  // The sentence is split so the clue words become buttons in place, keeping
  // the sentence readable as a sentence rather than a word soup.
  const clueWords = new Set(spec.clues.map((c) => c.word));
  const tokens = spec.sentence.split(/(\s+)/);

  return (
    <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
      <div className="relative mx-auto h-48 w-48">
        <JoWinkCartoon isWinking={winking} isGrinning={grinning} />
        {/* the imported asset has no completion flourish of its own -
            kept as a small overlay so finding both clues still feels
            rewarded, same as before this swap. */}
        {winking && grinning && (
          <svg viewBox="0 0 200 200" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <g className="animate-pulse">
              <path d="M 155,35 l 8,18 18,8 -18,8 -8,18 -8,-18 -18,-8 18,-8 Z" fill={WIDGET_GOLD_BRIGHT} />
            </g>
          </svg>
        )}
      </div>

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

function SentenceTrain({ spec, onEzy, onItemResult }: { spec: SentenceTrainSpec; onEzy: (t: string) => void; onItemResult: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const chosen = spec.couplers.find((c) => c.id === picked);
  const solved = chosen?.correct === true;
  const reportedRef = useRef(false);

  const choose = (id: string) => {
    setPicked(id);
    const c = spec.couplers.find((x) => x.id === id);
    if (!c) return;
    // Only the FIRST coupler tried counts as the attempt - trying again
    // after a wrong pick is how the widget teaches, not a second chance at
    // the score.
    if (!reportedRef.current) {
      reportedRef.current = true;
      onItemResult(c.correct);
    }
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

function LifeMountain({ spec, onEzy, onItemResult }: { spec: LifeMountainSpec; onEzy: (t: string) => void; onItemResult: (correct: boolean) => void }) {
  const [step, setStep] = useState(0); // how many checkpoints are correctly placed
  const done = step >= spec.checkpoints.length;
  const climber = spec.checkpoints[Math.max(0, step - 1)];
  const attemptedStepsRef = useRef<Set<number>>(new Set());

  const tap = (index: number) => {
    // Only the first tap made while a given checkpoint is "next" counts -
    // wrong taps after that are the child working it out, not new attempts.
    if (!attemptedStepsRef.current.has(step)) {
      attemptedStepsRef.current.add(step);
      onItemResult(index === step);
    }
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

function PrefixMachine({ spec, onEzy, onItemResult }: { spec: PrefixMachineSpec; onEzy: (t: string) => void; onItemResult: (correct: boolean) => void }) {
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);
  const challenge = spec.challenges[index];
  const finished = index >= spec.challenges.length;
  const attemptedRef = useRef<Set<number>>(new Set());

  const choose = (prefix: string) => {
    if (!challenge) return;
    if (!attemptedRef.current.has(index)) {
      attemptedRef.current.add(index);
      onItemResult(prefix === challenge.prefix);
    }
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

// ------------------------------------------------------ W5 Trait Matcher

function TraitMatcher({ spec, onEzy, onItemResult }: { spec: TraitMatcherSpec; onEzy: (t: string) => void; onItemResult: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  // Traits are shuffled once per mount so the answer is not just "same row".
  const [traits] = useState(() => [...spec.pairs].reverse().map((p) => p.trait));
  const attemptedRef = useRef<Set<string>>(new Set());

  const chooseTrait = (trait: string) => {
    if (!picked) {
      onEzy("Tap a character on the left first, then the trait their actions show.");
      return;
    }
    const pair = spec.pairs.find((p) => p.character === picked);
    if (!attemptedRef.current.has(picked)) {
      attemptedRef.current.add(picked);
      onItemResult(pair?.trait === trait);
    }
    if (pair && pair.trait === trait) {
      setSolved((v) => ({ ...v, [picked]: true }));
      onEzy(`Yes - the fable never says "${picked} is ${trait.split(" ")[0].toLowerCase()}". It shows you through what he does.`);
    } else {
      onEzy("Not that one. Think about what this character actually DOES in the story, not what you'd expect.");
    }
    setPicked(null);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="grid content-start gap-2">
        {spec.pairs.map((p) => (
          <button
            key={p.character}
            type="button"
            disabled={solved[p.character]}
            onClick={() => setPicked(p.character)}
            className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold transition active:scale-95 ${
              solved[p.character]
                ? "border-brand-gold bg-brand-gold-bright/25 text-brand-ink-dark"
                : picked === p.character
                ? "border-brand-gold bg-brand-gold-bright/15 text-brand-ink"
                : "border-slate-200 bg-white text-brand-ink hover:border-brand-gold/50"
            }`}
          >
            {p.character}
            {solved[p.character] && " ✓"}
          </button>
        ))}
      </div>
      <div className="grid content-start gap-2">
        {traits.map((t) => {
          const done = spec.pairs.some((p) => p.trait === t && solved[p.character]);
          return (
            <button
              key={t}
              type="button"
              disabled={done}
              onClick={() => chooseTrait(t)}
              className={`rounded-xl border-2 px-3 py-2 text-left text-xs transition active:scale-95 ${
                done
                  ? "border-brand-gold bg-brand-gold-bright/25 text-brand-ink-dark"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand-gold/50"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------- W6 Predictive Brancher

function PredictiveBrancher({ spec, onEzy, onItemResult }: { spec: PredictiveBrancherSpec; onEzy: (t: string) => void; onItemResult: (correct: boolean) => void }) {
  const [chosen, setChosen] = useState<string | null>(null);
  const reportedRef = useRef(false);
  const pick = (c: PredictiveBrancherSpec["choices"][number]) => {
    if (!reportedRef.current) {
      reportedRef.current = true;
      onItemResult(c.correct);
    }
    setChosen(c.text);
    onEzy(c.feedback);
  };

  return (
    <div>
      <div className="rounded-xl bg-practice-bg p-3">
        <p className="text-sm italic leading-relaxed text-brand-ink">{spec.scenario}</p>
      </div>
      <div className="mt-3 grid gap-2">
        {spec.choices.map((c) => {
          const isChosen = chosen === c.text;
          return (
            <button
              key={c.text}
              type="button"
              onClick={() => pick(c)}
              className={`rounded-xl border-2 px-3 py-2 text-left text-sm transition active:scale-95 ${
                isChosen
                  ? c.correct
                    ? "border-brand-gold bg-brand-gold-bright/25 text-brand-ink-dark"
                    : "border-test-border bg-test-bg text-test-accent"
                  : "border-slate-200 bg-white text-brand-ink hover:border-brand-gold/50"
              }`}
            >
              {c.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------------------------------- W7 Fact / Opinion Sorter

function FactOpinionSorter({ spec, onEzy, onItemResult }: { spec: FactOpinionSpec; onEzy: (t: string) => void; onItemResult: (correct: boolean) => void }) {
  const [index, setIndex] = useState(0);
  const [selection, setSelection] = useState<"fact" | "opinion" | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const finished = index >= spec.statements.length;
  const attemptedRef = useRef<Set<number>>(new Set());

  const select = (choice: "fact" | "opinion") => {
    if (finished) return;
    const st = spec.statements[index];
    const label = choice === "fact" ? "Fact" : "Opinion";
    const right = label === st.answer;
    if (!attemptedRef.current.has(index)) {
      attemptedRef.current.add(index);
      onItemResult(right);
    }
    setSelection(choice);
    setIsCorrect(right);
    onEzy(right ? `Correct - that's a ${st.answer.toLowerCase()}. ${st.hint}` : `Not quite. ${st.hint}`);
    if (right) {
      // Same "hold the success state, then move on" pacing as the prefix
      // machine below - long enough to see the scale settle and read Ezy's
      // line before the next statement replaces it.
      setTimeout(() => {
        setSelection(null);
        setIsCorrect(null);
        setIndex((i) => i + 1);
      }, 1300);
    }
    // A wrong tap leaves the statement in place - the child sees the scale
    // tip the wrong way and can just try the other side, no reset needed.
  };

  if (finished) {
    return (
      <p className="py-6 text-center text-sm font-medium text-brand-ink">
        All {spec.statements.length} sorted. You can tell a fact from an opinion every time.
      </p>
    );
  }

  return (
    <div>
      <FactOpinionScale
        statement={spec.statements[index].text}
        onSelect={(c) => select(c)}
        currentSelection={selection}
        isCorrect={isCorrect}
      />
      <p className="mt-2 text-center text-xs text-slate-500">
        Statement {index + 1} of {spec.statements.length}
      </p>
    </div>
  );
}

// ------------------------------------------------------ W8 Idiom Connector

function IdiomConnector({ spec, onEzy, onItemResult }: { spec: IdiomConnectorSpec; onEzy: (t: string) => void; onItemResult: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [meanings] = useState(() => [...spec.items].reverse().map((i) => i.meaning));
  const attemptedRef = useRef<Set<string>>(new Set());

  const chooseMeaning = (meaning: string) => {
    if (!picked) {
      onEzy("Pick an idiom on the left first, then tap what you think it really means.");
      return;
    }
    const item = spec.items.find((i) => i.idiom === picked);
    if (!attemptedRef.current.has(picked)) {
      attemptedRef.current.add(picked);
      onItemResult(item?.meaning === meaning);
    }
    if (item && item.meaning === meaning) {
      setSolved((v) => ({ ...v, [picked]: true }));
      onEzy(`"${item.idiom}" has nothing to do with its literal words - it means "${item.meaning.toLowerCase()}".`);
    } else {
      onEzy("Not that one. Remember: an idiom's real meaning is usually nothing like the picture the words paint.");
    }
    setPicked(null);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="grid content-start gap-2">
        {spec.items.map((i) => (
          <button
            key={i.idiom}
            type="button"
            disabled={solved[i.idiom]}
            onClick={() => setPicked(i.idiom)}
            className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold transition active:scale-95 ${
              solved[i.idiom]
                ? "border-brand-gold bg-brand-gold-bright/25 text-brand-ink-dark"
                : picked === i.idiom
                ? "border-brand-gold bg-brand-gold-bright/15 text-brand-ink"
                : "border-slate-200 bg-white text-brand-ink hover:border-brand-gold/50"
            }`}
          >
            {i.idiom}
            {solved[i.idiom] && " ✓"}
          </button>
        ))}
      </div>
      <div className="grid content-start gap-2">
        {meanings.map((m) => {
          const done = spec.items.some((i) => i.meaning === m && solved[i.idiom]);
          return (
            <button
              key={m}
              type="button"
              disabled={done}
              onClick={() => chooseMeaning(m)}
              className={`rounded-xl border-2 px-3 py-2 text-left text-xs transition active:scale-95 ${
                done ? "border-brand-gold bg-brand-gold-bright/25 text-brand-ink-dark" : "border-slate-200 bg-white text-slate-700 hover:border-brand-gold/50"
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------- W9 Biography Scanner

function BiographyScanner({ spec, onEzy, onItemResult }: { spec: BiographyScannerSpec; onEzy: (t: string) => void; onItemResult: (correct: boolean) => void }) {
  const [found, setFound] = useState<Record<string, boolean>>({});
  const total = spec.passage.filter((r) => r.feature).length;
  const foundCount = Object.keys(found).length;

  return (
    <div>
      <p className="text-base leading-loose text-slate-800">
        {spec.passage.map((run, i) =>
          run.feature ? (
            <button
              key={i}
              type="button"
              onClick={() => {
                // Same reveal-based scoring as the clue detective above -
                // finding it at all is the "correct" event.
                if (!found[run.text]) onItemResult(true);
                setFound((f) => ({ ...f, [run.text]: true }));
                onEzy(run.feature!);
              }}
              className={`rounded-lg border-b-4 px-1 py-0.5 font-semibold transition active:scale-95 ${
                found[run.text]
                  ? "border-brand-gold bg-brand-gold-bright/30 text-brand-ink-dark"
                  : "animate-pulse border-brand-gold/40 bg-brand-gold-bright/15 text-brand-gold hover:bg-brand-gold-bright/25"
              }`}
            >
              {run.text}
            </button>
          ) : (
            <span key={i}>{run.text}</span>
          )
        )}
      </p>
      <p className="mt-3 text-xs text-slate-500">
        {foundCount} of {total} biography features found
        {foundCount === total ? " - that's every one." : "."}
      </p>
    </div>
  );
}

// ------------------------------------------------------------- dispatcher

/** Item counts per widget kind - must match how many times each widget's own onItemResult call site can fire. */
function totalItemsFor(spec: InteractiveWidget["spec"]): number {
  switch (spec.kind) {
    case "clue_detective":
      return spec.clues.length;
    case "sentence_train":
      return 1;
    case "life_mountain":
      return spec.checkpoints.length;
    case "prefix_machine":
      return spec.challenges.length;
    case "trait_matcher":
      return spec.pairs.length;
    case "predictive_brancher":
      return 1;
    case "fact_opinion":
      return spec.statements.length;
    case "idiom_connector":
      return spec.items.length;
    case "biography_scanner":
      return spec.passage.filter((r) => r.feature).length;
  }
}

export default function WidgetDispatcher({ conceptId, unitKey }: { conceptId: string; unitKey: string }) {
  const widget = getWidgetForConcept(conceptId);
  const [ezyText, setEzyText] = useState<string | null>(null);

  // Aggregates first-attempt correctness across the widget's items, then
  // reports ONE practice_widget attempt when every item has a result -
  // see app/api/widget-practice/route.ts and lib/recordMastery.ts (this
  // attemptType is capped below "mastered": real, but weaker evidence than
  // a formal test, since every widget here lets a wrong tap just be
  // retried). Reset whenever the concept changes, since WidgetDispatcher
  // itself doesn't remount across a concept switch the way its child
  // widget component does.
  const resultsRef = useRef<boolean[]>([]);
  const submittedRef = useRef(false);
  useEffect(() => {
    resultsRef.current = [];
    submittedRef.current = false;
  }, [conceptId]);

  const recordItemResult = (correct: boolean) => {
    if (submittedRef.current || !widget) return;
    resultsRef.current = [...resultsRef.current, correct];
    const total = totalItemsFor(widget.spec);
    if (resultsRef.current.length >= total) {
      submittedRef.current = true;
      const correctCount = resultsRef.current.filter(Boolean).length;
      fetch("/api/widget-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitKey, conceptKey: conceptId, correct: correctCount, total }),
      }).catch(() => {});
    }
  };

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
      case "trait_matcher":
        return "Tap a character, then the trait their ACTIONS show - fables reveal character through behaviour, not description.";
      case "predictive_brancher":
        return "Use what you already know about this character. Which choice fits someone who wants the fire but is easily scared?";
      case "fact_opinion":
        return "Ask yourself: could somebody check this and prove it? If yes it's a fact. If it's what someone thinks, it's an opinion.";
      case "idiom_connector":
        return "Don't picture the words literally - a piece of cake has nothing to do with cake. Think about how people use the phrase.";
      case "biography_scanner":
        return "Look for dates, place names, and the word 'she' - those three are the biggest giveaways that this is a biography.";
    }
  };

  const body = (() => {
    switch (widget.spec.kind) {
      case "clue_detective":
        return <ClueDetective spec={widget.spec} onEzy={setEzyText} onItemResult={recordItemResult} />;
      case "sentence_train":
        return <SentenceTrain spec={widget.spec} onEzy={setEzyText} onItemResult={recordItemResult} />;
      case "life_mountain":
        return <LifeMountain spec={widget.spec} onEzy={setEzyText} onItemResult={recordItemResult} />;
      case "prefix_machine":
        return <PrefixMachine spec={widget.spec} onEzy={setEzyText} onItemResult={recordItemResult} />;
      case "trait_matcher":
        return <TraitMatcher spec={widget.spec} onEzy={setEzyText} onItemResult={recordItemResult} />;
      case "predictive_brancher":
        return <PredictiveBrancher spec={widget.spec} onEzy={setEzyText} onItemResult={recordItemResult} />;
      case "fact_opinion":
        return <FactOpinionSorter spec={widget.spec} onEzy={setEzyText} onItemResult={recordItemResult} />;
      case "idiom_connector":
        return <IdiomConnector spec={widget.spec} onEzy={setEzyText} onItemResult={recordItemResult} />;
      case "biography_scanner":
        return <BiographyScanner spec={widget.spec} onEzy={setEzyText} onItemResult={recordItemResult} />;
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
