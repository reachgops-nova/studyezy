"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BoardFrame, BoardTask, BoardUnit } from "@/lib/boardUnits/types";

/**
 * The Drawing Board: a five-phase lesson surface built to the reference the
 * user approved (drawing_board_unit10_v5.py, 2026-09-14).
 *
 * The phases are the learning method made visible - concept, guided practice,
 * free practice, assessment, then what to do next. A child moves through them
 * one press at a time and nothing plays past them.
 *
 * Everything unit-specific lives in lib/boardUnits/*, so a new unit is a new
 * data file and never a change here.
 */

/**
 * The phases ARE the RCRT method, not a parallel set of names beside it -
 * real user direction 2026-09-14: "our curriculum teaching flow RCRT and this
 * UI/UX together we must be ready".
 *
 *   Read    - meet the idea, one press at a time
 *   Cover   - hide the explanation and try it, with the board showing what
 *             each answer would actually do
 *   Recite  - say the rule back in your own words, then play with it freely
 *   Test    - the graded check
 *   Results - the score, and what the schedule does about it
 */
const PHASES = [
  { id: 1, label: "Read", icon: "📖" },
  { id: 2, label: "Cover", icon: "🙈" },
  { id: 3, label: "Recite", icon: "🗣️" },
  { id: 4, label: "Test", icon: "📝" },
  { id: 5, label: "Results", icon: "📊" },
] as const;

// SVG geometry. Grid units in, pixels out - the one place this conversion
// happens, so a shape can never drift off its own grid.
const PAD_L = 44;
const PAD_B = 44;
const VB_W = 460;
const VB_H = 396;

export default function DrawingBoard({ unit }: { unit: BoardUnit }) {
  const [phase, setPhase] = useState(1);
  const [step, setStep] = useState(0);
  const [frame, setFrame] = useState<BoardFrame>(unit.conceptSteps[0]?.frame ?? {});
  const [subtitle, setSubtitle] = useState(
    `Welcome to ${unit.title}. Press the buttons above the board to walk through it one step at a time.`,
  );
  const [voiceOn, setVoiceOn] = useState(true);
  const [answers, setAnswers] = useState<Record<string, { correct: boolean; label: string }>>({});
  const [dx, setDx] = useState(2);
  const [dy, setDy] = useState(3);
  const [chat, setChat] = useState<{ who: "kid" | "ezy"; text: string }[]>([
    { who: "ezy", text: "Tap a step above the board, or ask me one of the questions below." },
  ]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const audioRef = useRef<AudioContext | null>(null);
  const voiceOnRef = useRef(voiceOn);
  voiceOnRef.current = voiceOn;

  const gx = useCallback(
    (x: number) => PAD_L + (x * (VB_W - PAD_L - 20)) / unit.gridMax,
    [unit.gridMax],
  );
  const gy = useCallback(
    (y: number) => VB_H - PAD_B - (y * (VB_H - PAD_B - 20)) / unit.gridMax,
    [unit.gridMax],
  );

  const say = useCallback((text: string) => {
    setSubtitle(text);
    if (!voiceOnRef.current || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.05;
    window.speechSynthesis.speak(u);
  }, []);

  // Small synthesised cues rather than audio files: no asset to ship, no
  // request to make, and it works offline like the rest of the board.
  const sfx = useCallback((kind: "tap" | "right" | "wrong") => {
    if (!voiceOnRef.current) return;
    try {
      const ctx = audioRef.current ?? new AudioContext();
      audioRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      if (kind === "right") {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(783.99, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (kind === "wrong") {
        osc.frequency.setValueAtTime(196, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      }
    } catch {
      /* audio is a nicety; never let it break the lesson */
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function loadStep(i: number) {
    const s = unit.conceptSteps[i];
    if (!s) return;
    setStep(i);
    setFrame(s.frame);
    sfx("tap");
    say(s.say);
  }

  function answer(task: BoardTask, optionIndex: number) {
    const opt = task.options[optionIndex];
    setAnswers((prev) => ({ ...prev, [task.title]: { correct: opt.correct, label: opt.label } }));
    setFrame(opt.frame);
    sfx(opt.correct ? "right" : "wrong");
    say(opt.say);
  }

  // Score is only ever the graded phase - the practice phases are for trying
  // things, and counting them would punish exploring.
  const graded = [...unit.assessment.partA, ...unit.assessment.partB];
  const gradedAnswered = graded.filter((t) => answers[t.title]);
  const gradedCorrect = graded.filter((t) => answers[t.title]?.correct);
  const readiness = graded.length ? Math.round((gradedCorrect.length / graded.length) * 100) : 0;
  const passed = readiness >= 75;

  const labFrame: BoardFrame = useMemo(() => {
    const [sx, sy] = unit.lab.start;
    const at = (ox: number, oy: number): [number, number] => [sx + ox, sy + oy];
    const moved = (ox: number, oy: number): [number, number] => [sx + dx + ox, sy + dy + oy];
    return {
      shapes: [
        { points: unit.lab.shape.map(([ox, oy]) => at(ox, oy)), look: "ghost" },
        { points: unit.lab.shape.map(([ox, oy]) => moved(ox, oy)), look: "live" },
      ],
      arrows: [{ from: [sx, sy], to: [sx + dx, sy + dy] }],
      dots: [{ at: [sx + dx, sy + dy], label: `(${sx + dx}, ${sy + dy})`, tone: "blue" }],
    };
  }, [unit.lab, dx, dy]);

  function goPhase(p: number) {
    setPhase(p);
    sfx("tap");
    if (p === 1) {
      const s = unit.conceptSteps[step];
      setFrame(s?.frame ?? {});
      say(s?.say ?? "Let's look at the idea again.");
    } else if (p === 2) {
      setFrame(unit.guidedTasks[0]?.options.find((o) => o.correct)?.frame ?? {});
      say("Cover. The explanation is put away - try these from memory. Even a wrong answer will show you where it would land.");
    } else if (p === 3) {
      say("Recite. Say the rule back in your own words first, then play with the sliders and watch the shape travel.");
    } else if (p === 4) {
      setFrame({});
      say("Test time. Part A is straight recall, Part B asks you to use the idea somewhere new.");
    } else {
      say(
        passed
          ? `You scored ${readiness} percent. That is a solid pass - we will bring this back in three days to keep it fresh.`
          : `You scored ${readiness} percent. No problem - we will go over the weak parts tomorrow.`,
      );
    }
  }

  // Phase 5 writes into the same mastery record the Progression Test and Prep
  // Plan already read from, so a board session actually counts toward the
  // schedule instead of being a dead end.
  async function saveResult() {
    setSaveState("saving");
    const perConcept: Record<string, { correct: number; total: number }> = {};
    graded.forEach((t) => {
      const a = answers[t.title];
      if (!a) return;
      const bucket = (perConcept[t.conceptId] ??= { correct: 0, total: 0 });
      bucket.total += 1;
      if (a.correct) bucket.correct += 1;
    });

    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitKey: unit.unitKey,
          attemptType: "diagnostic",
          correct: gradedCorrect.length,
          total: graded.length,
          perConcept,
        }),
      });
      setSaveState(res.ok ? "saved" : "error");
    } catch {
      setSaveState("error");
    }
  }

  function ask(q: string, a: string) {
    setChat((prev) => [...prev, { who: "kid", text: q }, { who: "ezy", text: a }]);
    say(a);
  }

  const shapeFill: Record<string, string> = {
    ghost: "rgba(255,89,100,0.22)",
    live: "url(#g-blue)",
    correct: "url(#g-green)",
    wrong: "url(#g-red)",
  };
  const shapeStroke: Record<string, string> = {
    ghost: "#ff5964",
    live: "#38bdf8",
    correct: "#34d399",
    wrong: "#f43f5e",
  };
  const dotFill: Record<string, string> = { gold: "#f59e0b", green: "#34d399", red: "#f43f5e", blue: "#38bdf8" };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#090d16] font-board text-slate-100">
      {/* Header */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b-4 border-[#f59e0b] bg-[#020617] px-5 py-2.5">
        <div className="flex items-center gap-2.5 text-lg font-bold text-[#f59e0b]">
          {/* The board is a room inside the unit, not a separate app - real
              feedback 2026-09-14: "it has not synced up with our old link
              portion". */}
          <Link
            href={`/learn/${unit.unitKey}`}
            className="rounded-lg border-2 border-slate-700 px-2.5 py-1 text-sm text-slate-300 transition-colors hover:border-[#38bdf8] hover:text-[#38bdf8]"
          >
            ← Unit
          </Link>
          🏫 Drawing Board
          <span className="rounded-full bg-[#ec4899] px-3 py-0.5 text-xs text-white">{unit.badge}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border-2 border-[#38bdf8] bg-[#1e293b] px-3.5 py-1 text-sm font-bold tabular-nums">
            🎯 Readiness: <strong className="text-[#f59e0b]">{readiness}%</strong>
          </span>
          <button
            type="button"
            onClick={() => {
              const next = !voiceOn;
              setVoiceOn(next);
              if (!next && typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
            }}
            aria-pressed={voiceOn}
            className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors ${
              voiceOn ? "border-[#34d399] bg-[#10b981] text-white" : "border-slate-500 bg-slate-700 text-slate-200"
            }`}
          >
            {voiceOn ? "🎙️ Voice on" : "🔇 Voice off"}
          </button>
        </div>
      </header>

      {/* Phases */}
      <nav className="flex shrink-0 flex-wrap justify-center gap-2 border-b border-slate-700 bg-[#0f172a] px-3 py-2">
        {PHASES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => goPhase(p.id)}
            aria-current={phase === p.id}
            className={`rounded-xl border-2 px-4 py-1.5 text-sm font-bold transition-all ${
              phase === p.id
                ? "-translate-y-0.5 border-[#38bdf8] bg-[#38bdf8] text-[#052e3f] shadow-lg shadow-cyan-500/25"
                : "border-slate-700 bg-[#1e293b] text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {p.icon} {p.id}. {p.label}
          </button>
        ))}
      </nav>

      <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[1fr_22rem]">
        {/* ---------- Board ---------- */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border-4 border-slate-700 bg-[#0f172a] shadow-2xl">
          <div className="relative flex min-h-0 flex-1 items-center justify-center p-3">
            {phase === 1 && (
              <div className="absolute inset-x-3 top-3 z-10 flex flex-wrap justify-center gap-2">
                {unit.conceptSteps.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => loadStep(i)}
                    className={`rounded-xl border-2 px-3 py-1.5 text-xs font-bold transition-colors ${
                      i === step
                        ? "border-[#f59e0b] bg-[#f59e0b] text-[#020617]"
                        : "border-slate-700 bg-slate-900/95 text-slate-300 hover:border-[#38bdf8] hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              className="h-full max-h-[26rem] w-full max-w-[36rem] rounded-2xl border-[3px] border-slate-700 bg-[#0b1329]"
              role="img"
              aria-label={`Coordinate grid showing ${unit.title}`}
            >
              <defs>
                <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill="#f59e0b" />
                </marker>
                <linearGradient id="g-blue" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="g-green" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="g-red" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" /><stop offset="100%" stopColor="#be123c" />
                </linearGradient>
              </defs>

              {Array.from({ length: unit.gridMax + 1 }, (_, i) => (
                <g key={i}>
                  <line x1={gx(i)} y1={gy(unit.gridMax)} x2={gx(i)} y2={gy(0)} stroke="#1e293b" strokeWidth={1} />
                  <line x1={gx(0)} y1={gy(i)} x2={gx(unit.gridMax)} y2={gy(i)} stroke="#1e293b" strokeWidth={1} />
                  <text x={gx(i)} y={gy(0) + 16} fill="#94a3b8" fontSize={11} fontWeight="bold" textAnchor="middle">{i}</text>
                  {i > 0 && <text x={gx(0) - 10} y={gy(i) + 4} fill="#94a3b8" fontSize={11} fontWeight="bold" textAnchor="end">{i}</text>}
                </g>
              ))}
              <line x1={gx(0)} y1={gy(0)} x2={gx(unit.gridMax) + 12} y2={gy(0)} stroke="#64748b" strokeWidth={3} />
              <line x1={gx(0)} y1={gy(0)} x2={gx(0)} y2={gy(unit.gridMax) - 12} stroke="#64748b" strokeWidth={3} />

              {(frame.shapes ?? []).map((s, i) => (
                <polygon
                  key={`s${i}`}
                  points={s.points.map(([x, y]) => `${gx(x)},${gy(y)}`).join(" ")}
                  fill={shapeFill[s.look]}
                  stroke={shapeStroke[s.look]}
                  strokeWidth={s.look === "ghost" ? 2.5 : 3}
                  strokeDasharray={s.look === "ghost" ? "5,5" : undefined}
                  strokeLinejoin="round"
                  style={{ transition: "all .7s cubic-bezier(.34,1.56,.64,1)" }}
                />
              ))}
              {(frame.arrows ?? []).map((a, i) => (
                <line
                  key={`a${i}`}
                  x1={gx(a.from[0])} y1={gy(a.from[1])} x2={gx(a.to[0])} y2={gy(a.to[1])}
                  stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6,4" markerEnd="url(#ah)"
                />
              ))}
              {(frame.dots ?? []).map((d, i) => (
                <g key={`d${i}`}>
                  <circle cx={gx(d.at[0])} cy={gy(d.at[1])} r={6} fill={dotFill[d.tone ?? "gold"]} />
                  {d.label && (
                    <text x={gx(d.at[0]) + 10} y={gy(d.at[1]) - 8} fill={dotFill[d.tone ?? "gold"]} fontSize={12} fontWeight="bold">
                      {d.label}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Narration */}
          <div className="flex shrink-0 items-center gap-3 border-t-[3px] border-[#38bdf8] bg-[#020617]/95 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#38bdf8] text-lg">🎙️</span>
            <p className="min-w-0 flex-1 text-[0.95rem] font-bold leading-snug text-[#e0f2fe]">{subtitle}</p>
          </div>

          {/* Concept tray */}
          <div className="flex shrink-0 items-center gap-2.5 overflow-x-auto border-t-2 border-white/10 bg-[#020617] px-4 py-2.5">
            <span className="shrink-0 text-[0.7rem] font-extrabold uppercase tracking-wider text-slate-500">Topics</span>
            {unit.concepts.map((c) => (
              <button
                key={c.conceptId}
                type="button"
                onClick={() => say(`${c.title}. ${c.summary}`)}
                className="shrink-0 rounded-xl border-2 border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.82rem] font-bold text-white transition-colors hover:border-[#38bdf8]"
              >
                {c.icon} {c.conceptId} {c.title}
              </button>
            ))}
          </div>
        </section>

        {/* ---------- Assistant / tasks ---------- */}
        <aside className="flex min-h-0 flex-col gap-3 overflow-y-auto rounded-3xl border-2 border-slate-700 bg-[#1e293b] p-4">
          {phase === 1 && (
            <>
              <h2 className="border-b-2 border-slate-700 pb-2 text-lg font-bold text-[#f59e0b]">📖 What is happening</h2>
              <div className="rounded-2xl border-2 border-[#f59e0b] bg-[#f59e0b]/10 px-3.5 py-2.5 text-[0.82rem] font-bold leading-snug text-[#fef08a]">
                💡 {unit.concepts[0].summary}
              </div>
              <ul className="flex flex-col gap-1.5">
                {unit.concepts[0].keyPoints.map((k) => (
                  <li key={k} className="rounded-xl bg-[#0f172a] px-3 py-2 text-[0.8rem] leading-snug text-slate-300">• {k}</li>
                ))}
              </ul>
              <h3 className="pt-1 text-sm font-bold text-slate-200">📌 Ask me</h3>
              <div className="flex flex-col gap-1.5">
                {unit.readymade.map((r) => (
                  <button
                    key={r.q}
                    type="button"
                    onClick={() => ask(r.q, r.a)}
                    className="rounded-xl border-2 border-slate-700 bg-[#0f172a] px-3 py-2 text-left text-[0.82rem] font-semibold text-slate-300 transition-colors hover:border-[#38bdf8] hover:text-[#38bdf8]"
                  >
                    {r.q}
                  </button>
                ))}
              </div>
              <div className="flex max-h-40 flex-col gap-2 overflow-y-auto rounded-2xl border border-slate-700 bg-[#090d16] p-2.5">
                {chat.map((m, i) => (
                  <p
                    key={i}
                    className={`rounded-xl px-3 py-2 text-[0.8rem] font-semibold ${
                      m.who === "kid" ? "self-end bg-[#0284c7] text-white" : "self-start border border-slate-700 bg-[#1e293b] text-[#38bdf8]"
                    }`}
                  >
                    {m.text}
                  </p>
                ))}
              </div>
              <button type="button" onClick={() => goPhase(2)} className="mt-auto rounded-xl bg-[#ec4899] px-4 py-2.5 font-bold text-white shadow-[0_4px_0_#be185d] transition-transform hover:-translate-y-0.5">
                Cover it up and try ➔
              </button>
            </>
          )}

          {(phase === 2 || phase === 4) && (
            <>
              <h2 className="border-b-2 border-slate-700 pb-2 text-lg font-bold text-[#f59e0b]">
                {phase === 2 ? "🙈 Cover - try it from memory" : "📝 Test"}
              </h2>
              {phase === 4 && (
                <p className="text-[0.8rem] text-slate-400">
                  These count. Part A is straight recall; Part B asks you to use the idea somewhere new.
                  {" "}{graded.length} questions in all.
                </p>
              )}
              {(phase === 2 ? unit.guidedTasks : unit.assessment.partA).map((t) => (
                <TaskCard key={t.title} task={t} chosen={answers[t.title]} onPick={(i) => answer(t, i)} />
              ))}
              {phase === 4 && (
                <>
                  <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-[#f59e0b]">Part B · use it somewhere new</p>
                  {unit.assessment.partB.map((t) => (
                    <TaskCard key={t.title} task={t} chosen={answers[t.title]} onPick={(i) => answer(t, i)} />
                  ))}
                </>
              )}
              <button
                type="button"
                onClick={() => goPhase(phase === 2 ? 3 : 5)}
                className="mt-auto rounded-xl bg-[#ec4899] px-4 py-2.5 font-bold text-white shadow-[0_4px_0_#be185d] transition-transform hover:-translate-y-0.5"
              >
                {phase === 2 ? "Recite it back ➔" : "See how I did ➔"}
              </button>
            </>
          )}

          {phase === 3 && (
            <>
              <h2 className="border-b-2 border-slate-700 pb-2 text-lg font-bold text-[#f59e0b]">🗣️ Recite</h2>
              <p className="text-[0.8rem] text-slate-400">
                Have a go at saying each one out loud before you reveal the answer. Nothing here is marked - it is for
                you to hear whether you have really got it.
              </p>
              <div className="flex flex-col gap-2">
                {unit.recitePrompts.map((r) => (
                  <ReciteCard key={r.ask} prompt={r} onSay={say} />
                ))}
              </div>
              <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-slate-500">Then play with it</p>
              <p className="text-[0.82rem] leading-snug text-slate-400">{unit.lab.prompt}</p>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-700 bg-[#0f172a] p-3">
                <label className="flex items-center justify-between gap-3 text-[0.82rem] font-bold">
                  <span>Across</span>
                  <input type="range" min={unit.lab.range.min} max={unit.lab.range.max} value={dx}
                    onChange={(e) => setDx(Number(e.target.value))} className="flex-1 accent-[#38bdf8]" />
                  <strong className="w-20 text-right text-[#38bdf8] tabular-nums">{dx >= 0 ? `${dx} right` : `${-dx} left`}</strong>
                </label>
                <label className="flex items-center justify-between gap-3 text-[0.82rem] font-bold">
                  <span>Up</span>
                  <input type="range" min={unit.lab.range.min} max={unit.lab.range.max} value={dy}
                    onChange={(e) => setDy(Number(e.target.value))} className="flex-1 accent-[#f59e0b]" />
                  <strong className="w-20 text-right text-[#f59e0b] tabular-nums">{dy >= 0 ? `${dy} up` : `${-dy} down`}</strong>
                </label>
              </div>
              <div className="rounded-2xl border-2 border-[#f59e0b] bg-[#f59e0b]/10 px-3.5 py-2.5 text-[0.85rem] font-bold text-[#fef08a]">
                📍 ({unit.lab.start[0]} + {dx}, {unit.lab.start[1]} + {dy}) ={" "}
                <strong className="text-white">({unit.lab.start[0] + dx}, {unit.lab.start[1] + dy})</strong>
              </div>
              <button type="button" onClick={() => { setFrame(labFrame); say(`Landed at ${unit.lab.start[0] + dx}, ${unit.lab.start[1] + dy}.`); }}
                className="rounded-xl border-2 border-slate-600 bg-[#0f172a] px-4 py-2 text-sm font-bold text-slate-200 hover:border-[#38bdf8]">
                Show it on the board
              </button>
              <button type="button" onClick={() => goPhase(4)} className="mt-auto rounded-xl bg-[#ec4899] px-4 py-2.5 font-bold text-white shadow-[0_4px_0_#be185d] transition-transform hover:-translate-y-0.5">
                I'm ready for the test ➔
              </button>
            </>
          )}

          {phase === 5 && (
            <>
              <h2 className="border-b-2 border-slate-700 pb-2 text-lg font-bold text-[#f59e0b]">📊 How it went</h2>
              <div className={`rounded-2xl border-2 px-3.5 py-3 font-bold ${passed ? "border-[#34d399] bg-[#34d399]/15 text-[#a7f3d0]" : "border-[#f43f5e] bg-[#f43f5e]/15 text-[#fecdd3]"}`}>
                {passed ? "🎉 Nicely done" : "🔁 Worth another look"}
                <div className="mt-1 text-2xl tabular-nums text-white">{readiness}%</div>
                <div className="mt-1 text-[0.78rem] font-semibold opacity-80">
                  {gradedCorrect.length} of {graded.length} right{gradedAnswered.length < graded.length ? ` · ${graded.length - gradedAnswered.length} not answered` : ""}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-[#0f172a] p-3 text-[0.82rem] text-slate-300">
                <p className="mb-1.5 font-bold text-white">What we&apos;ll do next</p>
                {passed
                  ? "This comes back in 3 days as a quick brush-up, so it sticks for the test."
                  : "We&apos;ll revisit the concept walkthrough tomorrow, then try the check again."}
              </div>
              {graded.map((t) => {
                const a = answers[t.title];
                return (
                  <p key={t.title} className="flex items-center justify-between gap-2 rounded-xl bg-[#0f172a] px-3 py-2 text-[0.78rem]">
                    <span className="min-w-0 truncate text-slate-300">{t.title}</span>
                    <span className={a ? (a.correct ? "text-[#34d399]" : "text-[#f43f5e]") : "text-slate-500"}>
                      {a ? (a.correct ? "✓" : "✗") : "—"}
                    </span>
                  </p>
                );
              })}
              <button
                type="button"
                onClick={saveResult}
                disabled={saveState === "saving" || saveState === "saved" || gradedAnswered.length === 0}
                className="rounded-xl bg-[#10b981] px-4 py-2.5 font-bold text-white disabled:opacity-50"
              >
                {saveState === "saved" ? "✓ Saved to your progress" : saveState === "saving" ? "Saving..." : "Save this to my progress"}
              </button>
              {saveState === "error" && <p className="text-[0.78rem] text-red-400">Couldn&apos;t save that - your answers are still on screen, try again.</p>}
              {/* Everything this unit already has, reachable from the end of
                  the board rather than leaving the child at a dead end. */}
              <div className="flex flex-col gap-2">
                <p className="text-[0.7rem] font-extrabold uppercase tracking-wider text-slate-500">Carry on with</p>
                <Link href={`/exam/${unit.unitKey}`} className="rounded-xl border-2 border-slate-600 bg-[#0f172a] px-4 py-2.5 text-center text-sm font-bold text-slate-200 hover:border-[#38bdf8]">
                  ✍️ Written exam practice
                </Link>
                <Link href={`/test/${unit.unitKey}`} className="rounded-xl border-2 border-slate-600 bg-[#0f172a] px-4 py-2.5 text-center text-sm font-bold text-slate-200 hover:border-[#38bdf8]">
                  📋 Progression test
                </Link>
                <Link href="/plan" className="rounded-xl border-2 border-slate-600 bg-[#0f172a] px-4 py-2.5 text-center text-sm font-bold text-slate-200 hover:border-[#38bdf8]">
                  🧠 Prep plan &amp; brush-ups
                </Link>
                <Link href={`/learn/${unit.unitKey}`} className="rounded-xl border-2 border-slate-600 bg-[#0f172a] px-4 py-2.5 text-center text-sm font-bold text-slate-200 hover:border-[#38bdf8]">
                  💬 Talk it through with Ezy
                </Link>
              </div>
              <button type="button" onClick={() => { setAnswers({}); goPhase(1); }} className="mt-auto rounded-xl border-2 border-slate-600 bg-[#0f172a] px-4 py-2.5 font-bold text-slate-200 hover:border-[#38bdf8]">
                Walk through it again 🔄
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function ReciteCard({ prompt, onSay }: { prompt: { ask: string; answer: string }; onSay: (t: string) => void }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="rounded-2xl border-2 border-slate-700 bg-[#0f172a] p-3">
      <p className="text-[0.85rem] font-bold leading-snug text-white">{prompt.ask}</p>
      {shown ? (
        <p className="mt-2 rounded-xl bg-[#38bdf8]/10 px-3 py-2 text-[0.8rem] leading-snug text-[#7dd3fc]">{prompt.answer}</p>
      ) : (
        <button
          type="button"
          onClick={() => {
            setShown(true);
            onSay(prompt.answer);
          }}
          className="mt-2 rounded-xl border-2 border-slate-600 px-3 py-1.5 text-[0.78rem] font-bold text-slate-300 hover:border-[#38bdf8] hover:text-[#38bdf8]"
        >
          I&apos;ve said it - show me
        </button>
      )}
    </div>
  );
}

function TaskCard({
  task,
  chosen,
  onPick,
}: {
  task: BoardTask;
  chosen?: { correct: boolean; label: string };
  onPick: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border-2 border-slate-700 bg-[#0f172a] p-3.5">
      <div className="flex items-center justify-between gap-2 text-[0.9rem] font-bold text-white">
        <span className="min-w-0">{task.title}</span>
        <span className={`shrink-0 text-[0.75rem] ${chosen ? (chosen.correct ? "text-[#34d399]" : "text-[#f43f5e]") : "text-[#f59e0b]"}`}>
          {chosen ? (chosen.correct ? "✅ Right" : "❌ Not yet") : "· to do ·"}
        </span>
      </div>
      <p className="text-[0.82rem] font-semibold leading-snug text-slate-400">{task.prompt}</p>
      <div className="grid grid-cols-2 gap-2">
        {task.options.map((o, i) => {
          const isChosen = chosen?.label === o.label;
          return (
            <button
              key={o.label}
              type="button"
              onClick={() => onPick(i)}
              className={`rounded-xl border-2 px-3 py-2.5 text-[0.85rem] font-bold transition-all ${
                isChosen
                  ? o.correct
                    ? "border-[#34d399] bg-[#34d399]/20 text-[#34d399]"
                    : "border-[#f43f5e] bg-[#f43f5e]/20 text-[#f43f5e]"
                  : "border-slate-700 bg-[#1e293b] text-white hover:-translate-y-0.5 hover:border-[#38bdf8]"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
