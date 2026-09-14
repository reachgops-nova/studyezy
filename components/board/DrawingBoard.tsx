"use client";

import Link from "next/link";
import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BoardFrame, BoardTask, BoardUnit } from "@/lib/boardUnits/types";
import { sanitizeSvgFragment } from "@/lib/richScene";

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
/** Reads a value the way a child should hear it: 0.3 as "three tenths". */
function nameValue(v: number): string {
  if (Number.isInteger(v)) return v < 0 ? `Minus ${Math.abs(v)}.` : `${v}.`;
  const whole = Math.trunc(v);
  const tenths = Math.round(Math.abs(v - whole) * 10);
  const tenthWord = `${tenths} ${tenths === 1 ? "tenth" : "tenths"}`;
  if (whole === 0) return `${v} - that is ${tenthWord}.`;
  return `${v} - that is ${Math.abs(whole)} ${Math.abs(whole) === 1 ? "whole" : "wholes"} and ${tenthWord}.`;
}

const PAD_L = 44;
const PAD_B = 44;
const VB_W = 460;
const VB_H = 396;

export default function DrawingBoard({ unit, paperTasks = [] }: { unit: BoardUnit; paperTasks?: BoardTask[] }) {
  const [phase, setPhase] = useState(1);
  const [step, setStep] = useState(0);
  const [frame, setFrame] = useState<BoardFrame>(unit.conceptSteps[0]?.frame ?? {});
  const [subtitle, setSubtitle] = useState(
    `Welcome to ${unit.title}. Press the buttons above the board to walk through it one step at a time.`,
  );
  const [voiceOn, setVoiceOn] = useState(true);
  const [answers, setAnswers] = useState<Record<string, { correct: boolean; label: string; locked?: boolean }>>({});
  const [dx, setDx] = useState(2);
  const [dy, setDy] = useState(3);
  const [chat, setChat] = useState<{ who: "kid" | "ezy"; text: string }[]>([
    { who: "ezy", text: "Tap a step above the board, or ask me one of the questions below." },
  ]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const audioRef = useRef<AudioContext | null>(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;
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

  const say = useCallback((text: string, onDone?: () => void) => {
    setSubtitle(text);
    // Fall back to a length-based estimate when there is no voice to wait on,
    // so the board behaves the same with narration off.
    const estimate = Math.min(9000, 1400 + text.length * 55);
    if (!voiceOnRef.current || typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onDone) setTimeout(onDone, estimate);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.05;
    if (onDone) {
      let fired = false;
      const once = () => {
        if (fired) return;
        fired = true;
        onDone();
      };
      u.onend = once;
      u.onerror = once;
      // Some installed voices never fire onend at all.
      setTimeout(once, estimate + 3000);
    }
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

  // Steps bucketed by the concept they belong to, in the order they appear.
  const conceptGroups = (() => {
    const out: { key: string; label: string; indexes: number[] }[] = [];
    unit.conceptSteps.forEach((st, i) => {
      const key = st.conceptId ?? st.label;
      const found = out.find((g) => g.key === key);
      if (found) found.indexes.push(i);
      else {
        const c = unit.concepts.find((x) => x.conceptId === key);
        out.push({ key, label: c ? `${c.conceptId} ${c.title}` : st.label, indexes: [i] });
      }
    });
    return out;
  })();
  const activeGroup = conceptGroups.find((g) => g.indexes.includes(step));

  const activeConcept = unit.concepts.find((c) => c.conceptId === unit.conceptSteps[step]?.conceptId);

  function loadStep(i: number) {
    const s = unit.conceptSteps[i];
    if (!s) return;
    setStep(i);
    setFrame(s.frame);
    sfx("tap");
    say(s.say);
  }

  /**
   * The first answer is the one that counts. A child can keep pressing to see
   * what each option does - that is how the board teaches - but a question
   * answered wrongly stays wrong, exactly as it would in a real test. Real
   * user direction 2026-09-14: "in test mark wrong answer as wrong only
   * though we explain them... their score for that answer will be zero".
   */
  /** Still-to-do questions first; finished ones sink to the bottom. */
  const byDone = (tasks: BoardTask[]) => [...tasks].sort((a, b) => Number(Boolean(answers[a.title])) - Number(Boolean(answers[b.title])));

  /** Put a finished question's working back on the board on demand. */
  function replayTask(task: BoardTask) {
    const chosen = answers[task.title];
    const opt = task.options.find((o) => o.label === chosen?.label);
    if (!opt) return;
    setFrame(opt.frame);
    say(opt.say);
  }

  /**
   * Once the explanation has been spoken, the board clears and sets up the
   * next question - real user direction 2026-09-14: "the old answer still
   * stays, it should populate for next question". Leaving the last answer's
   * working up while a new question is being read is exactly the confusion
   * receding the cards was meant to remove.
   */
  function handOverToNextTask(justAnswered: string) {
    if (phase === 1) {
      setFrame(unit.conceptSteps[step]?.frame ?? {});
      return;
    }
    const list = phase === 2 ? unit.guidedTasks : [...unit.assessment.partA, ...unit.assessment.partB, ...paperTasks];
    const next = list.find((t) => t.title !== justAnswered && !answersRef.current[t.title]);
    setFrame(next?.setup ?? {});
  }

  /** The question the board is currently offering to be dragged. */
  const dragTask =
    phase === 2 || phase === 4
      ? (phase === 2 ? unit.guidedTasks : [...unit.assessment.partA, ...unit.assessment.partB]).find(
          (t) => t.drag && !answers[t.title],
        )
      : undefined;
  const [dragAt, setDragAt] = useState<number[] | null>(null);
  useEffect(() => {
    setDragAt(dragTask?.drag ? [...dragTask.drag.from] : null);
  }, [dragTask]);

  /** Dropping the handle answers the question, same rules as tapping an option. */
  function dropDrag(at: number[]) {
    if (!dragTask?.drag) return;
    setDragAt(at);
    const hit = dragTask.drag.to.every((v, i) => Math.abs((at[i] ?? NaN) - v) < 1e-6);
    const idx = dragTask.options.findIndex((o) => o.correct === hit);
    const opt = dragTask.options[idx] ?? dragTask.options[0];
    setAnswers((prev) =>
      prev[dragTask.title]
        ? prev
        : { ...prev, [dragTask.title]: { correct: hit, label: `dragged to ${at.join(", ")}`, locked: true } },
    );
    sfx(hit ? "right" : "wrong");
    say(
      hit
        ? `That is the spot. ${opt?.say ?? ""}`
        : `Not quite - you put it at ${at.join(", ")}. ${dragTask.drag.to.length > 1 ? `It belongs at ${dragTask.drag.to.join(", ")}.` : `It belongs at ${dragTask.drag.to[0]}.`}`,
      () => handOverToNextTask(dragTask.title),
    );
  }

  /** The question currently offering a word to sort into a bucket. */
  const chipTask =
    phase === 2 || phase === 4
      ? (phase === 2 ? unit.guidedTasks : [...unit.assessment.partA, ...unit.assessment.partB]).find(
          (t) => t.chipDrag && !answers[t.title],
        )
      : undefined;

  function dropChip(columnIndex: number) {
    const cd = chipTask?.chipDrag;
    if (!cd || !chipTask) return;
    const hit = columnIndex === cd.toColumn;
    const opt = chipTask.options.find((o) => o.correct === hit);
    setAnswers((prev) =>
      prev[chipTask.title] ? prev : { ...prev, [chipTask.title]: { correct: hit, label: cd.chip, locked: true } },
    );
    sfx(hit ? "right" : "wrong");
    say(opt?.say ?? (hit ? "That's the one." : "Not quite - have another look."), () => handOverToNextTask(chipTask.title));
  }

  function answer(task: BoardTask, optionIndex: number) {
    const opt = task.options[optionIndex];
    setAnswers((prev) =>
      prev[task.title]
        ? { ...prev, [task.title]: { ...prev[task.title], label: opt.label } }
        : { ...prev, [task.title]: { correct: opt.correct, label: opt.label, locked: true } },
    );
    setFrame(opt.frame);
    sfx(opt.correct ? "right" : "wrong");
    say(opt.say, () => handOverToNextTask(task.title));
  }

  // Score is only ever the graded phase - the practice phases are for trying
  // things, and counting them would punish exploring.
  // Paper questions count the same as the board's own - they are this unit's
  // real progression-test content, not a warm-up.
  const graded = [...unit.assessment.partA, ...unit.assessment.partB, ...paperTasks];
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
      setFrame(unit.guidedTasks.find((t) => !answers[t.title])?.setup ?? {});
      say("Cover. The explanation is put away - try these from memory. Even a wrong answer will show you where it would land.");
    } else if (p === 3) {
      say("Recite. Say the rule back in your own words first, then play with the sliders and watch the shape travel.");
    } else if (p === 4) {
      setFrame(unit.assessmentStory ?? {});
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
          🏫 Learning Board
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
          {/* Grouped by concept. A unit where several concepts are walked
              across an illustration can reach forty steps, and a flat row of
              forty buttons is not navigable - so the row shows one button per
              concept, and its sub-steps appear underneath only while that
              concept is the one being read. */}
          {phase === 1 && (
            <div className="shrink-0 border-b border-slate-800 px-3 py-2">
              <div className="flex flex-wrap justify-center gap-2">
                {conceptGroups.map((g) => {
                  const isHere = g.indexes.includes(step);
                  return (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => loadStep(g.indexes[0])}
                      className={`rounded-xl border-2 px-3 py-1.5 text-xs font-bold transition-colors ${
                        isHere
                          ? "border-[#f59e0b] bg-[#f59e0b] text-[#020617]"
                          : "border-slate-700 bg-slate-900/95 text-slate-300 hover:border-[#38bdf8] hover:text-white"
                      }`}
                    >
                      {g.label}
                      {g.indexes.length > 1 ? ` · ${g.indexes.length}` : ""}
                    </button>
                  );
                })}
              </div>
              {activeGroup && activeGroup.indexes.length > 1 && (
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  {activeGroup.indexes.map((idx, n) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => loadStep(idx)}
                      className={`rounded-lg border px-2.5 py-1 text-[0.7rem] font-bold transition-colors ${
                        idx === step
                          ? "border-[#38bdf8] bg-[#38bdf8]/20 text-[#7dd3fc]"
                          : "border-slate-700 text-slate-400 hover:border-[#38bdf8] hover:text-white"
                      }`}
                    >
                      {n + 1}. {unit.conceptSteps[idx].label.replace(/^\S+\s*/, "")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="relative flex min-h-0 flex-1 items-center justify-center p-3">
            {frame.image ? (
              <ImageStage frame={frame} onTap={(t) => say(t)} />
            ) : frame.diagram ? (
              <DiagramStage frame={frame} onTap={(t) => say(t)} />
            ) : frame.bar ? (
              <BarStage frame={frame} onTap={(t) => say(t)} />
            ) : frame.chart ? (
              <ChartStage frame={frame} onTap={(t) => say(t)} />
            ) : frame.timeline ? (
              <TimelineStage frame={frame} onTap={(t) => say(t)} />
            ) : unit.stage === "text" ? (
              <TextStage
                frame={frame}
                onTap={(t) => say(t)}
                chipDrag={chipTask?.chipDrag && !answers[chipTask.title] ? chipTask.chipDrag : undefined}
                onDropChip={(col) => dropChip(col)}
              />
            ) : unit.stage === "numberLine" ? (
              <NumberLineStage
                frame={frame}
                onTap={(v) => say(nameValue(v))}
                drag={dragTask?.drag && dragAt ? { at: dragAt[0], hint: dragTask.drag.hint } : undefined}
                onDrag={(v) => setDragAt([v])}
                onDrop={(v) => dropDrag([v])}
              />
            ) : (
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              className="h-full max-h-[26rem] w-full max-w-[36rem] select-none touch-none rounded-2xl border-[3px] border-slate-700 bg-[#0b1329]"
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

              {/* Every whole-number point is touchable and says its
                  coordinates aloud. */}
              {Array.from({ length: unit.gridMax + 1 }, (_, ix) =>
                Array.from({ length: unit.gridMax + 1 }, (_, iy) => (
                  <rect
                    key={`h${ix}-${iy}`}
                    x={gx(ix) - 9}
                    y={gy(iy) - 9}
                    width={18}
                    height={18}
                    fill="transparent"
                    className="cursor-pointer"
                    onClick={() => say(`${ix} across and ${iy} up. We write that as ${ix}, ${iy}.`)}
                  />
                )),
              )}
              {dragTask?.drag && dragAt && (unit.stage ?? "grid") === "grid" && (
                <g
                  className="cursor-grab"
                  onPointerDown={(e) => {
                    const svg = e.currentTarget.ownerSVGElement;
                    if (!svg) return;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    const move = (ev: PointerEvent) => {
                      const r = svg.getBoundingClientRect();
                      const vx = ((ev.clientX - r.left) / r.width) * VB_W;
                      const vy = ((ev.clientY - r.top) / r.height) * VB_H;
                      const gxUnit = (VB_W - PAD_L - 20) / unit.gridMax;
                      const gyUnit = (VB_H - PAD_B - 20) / unit.gridMax;
                      const x = Math.round((vx - PAD_L) / gxUnit);
                      const y = Math.round((VB_H - PAD_B - vy) / gyUnit);
                      setDragAt([Math.max(0, Math.min(unit.gridMax, x)), Math.max(0, Math.min(unit.gridMax, y))]);
                    };
                    const up = (ev: PointerEvent) => {
                      window.removeEventListener("pointermove", move);
                      window.removeEventListener("pointerup", up);
                      const r = svg.getBoundingClientRect();
                      const vx = ((ev.clientX - r.left) / r.width) * VB_W;
                      const vy = ((ev.clientY - r.top) / r.height) * VB_H;
                      const gxUnit = (VB_W - PAD_L - 20) / unit.gridMax;
                      const gyUnit = (VB_H - PAD_B - 20) / unit.gridMax;
                      const x = Math.max(0, Math.min(unit.gridMax, Math.round((vx - PAD_L) / gxUnit)));
                      const y = Math.max(0, Math.min(unit.gridMax, Math.round((VB_H - PAD_B - vy) / gyUnit)));
                      dropDrag([x, y]);
                    };
                    window.addEventListener("pointermove", move);
                    window.addEventListener("pointerup", up);
                  }}
                >
                  <circle cx={gx(dragAt[0])} cy={gy(dragAt[1])} r={13} fill="#ec4899" fillOpacity={0.25} />
                  <circle cx={gx(dragAt[0])} cy={gy(dragAt[1])} r={8} fill="#ec4899" stroke="#fff" strokeWidth={2} />
                  <text x={gx(dragAt[0]) + 14} y={gy(dragAt[1]) - 12} fill="#ec4899" fontSize={12} fontWeight="bold">
                    {dragTask.drag.hint ?? "drag me"} ({dragAt[0]}, {dragAt[1]})
                  </text>
                </g>
              )}
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
            )}
          </div>

          {/* Narration */}
          <div className="flex shrink-0 items-center gap-3 border-t-[3px] border-[#38bdf8] bg-[#020617]/95 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#38bdf8] text-lg">🎙️</span>
            <p className="min-w-0 flex-1 text-[0.95rem] font-bold leading-snug text-[#e0f2fe]">{subtitle}</p>
          </div>

        </section>

        {/* ---------- Assistant / tasks ---------- */}
        <aside className="flex min-h-0 flex-col gap-3 overflow-y-auto rounded-3xl border-2 border-slate-700 bg-[#1e293b] p-4">
          {phase === 1 && (
            <>
              <h2 className="border-b-2 border-slate-700 pb-2 text-lg font-bold text-[#f59e0b]">📖 This chapter</h2>
              {/* A child should know what they are walking into and what they
                  will be able to do at the end of it - real feedback
                  2026-09-14: "it lacks some introduction on what we are going
                  to cover in this chapter and what will be achieved". */}
              <div className="rounded-2xl border-2 border-slate-700 bg-[#0f172a] p-3">
                <p className="text-[0.7rem] font-extrabold uppercase tracking-wider text-[#38bdf8]">What we will cover</p>
                <ul className="mt-1.5 flex flex-col gap-1">
                  {unit.intro.covers.map((c) => (
                    <li key={c} className="text-[0.8rem] leading-snug text-slate-300">• {c}</li>
                  ))}
                </ul>
                <p className="mt-3 text-[0.7rem] font-extrabold uppercase tracking-wider text-[#34d399]">By the end you can</p>
                <ul className="mt-1.5 flex flex-col gap-1">
                  {unit.intro.outcomes.map((o) => (
                    <li key={o} className="text-[0.8rem] leading-snug text-slate-300">✓ {o}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => say(`In this chapter we will cover: ${unit.intro.covers.join(". ")}. By the end you will be able to ${unit.intro.outcomes.join(", and ")}.`)}
                  className="mt-3 rounded-xl border-2 border-slate-600 px-3 py-1.5 text-[0.78rem] font-bold text-slate-300 hover:border-[#38bdf8] hover:text-[#38bdf8]"
                >
                  🎙️ Read this to me
                </button>
              </div>
              <div className="rounded-2xl border-2 border-[#f59e0b] bg-[#f59e0b]/10 px-3.5 py-2.5 text-[0.82rem] font-bold leading-snug text-[#fef08a]">
                💡 {unit.concepts[0].summary}
              </div>
              {activeConcept && (
                <>
                  <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-[#38bdf8]">
                    {activeConcept.icon} {activeConcept.conceptId} {activeConcept.title}
                  </p>
                  <p className="rounded-xl bg-[#0f172a] px-3 py-2 text-[0.8rem] leading-snug text-slate-300">{activeConcept.summary}</p>
                  {(activeConcept.pages?.length || activeConcept.storyReference) && (
                    <p className="rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-3 py-2 text-[0.76rem] font-semibold text-[#7dd3fc]">
                      📖 In your book:{" "}
                      {activeConcept.pages?.length
                        ? `page${activeConcept.pages.length > 1 ? "s" : ""} ${activeConcept.pages.join(" and ")}`
                        : ""}
                      {activeConcept.storyReference ? ` · ${activeConcept.storyReference}` : ""}
                    </p>
                  )}
                  {/* Examples sit at the end of each concept, to try before
                      moving on - real user direction 2026-09-14: "we have to
                      have examples at the end of each concept, that will be
                      practice". */}
                  <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-[#34d399]">
                    Try these before moving on
                  </p>
                  <div className="flex flex-col gap-2">
                    {activeConcept.examples.map((e, i) => (
                      <ReciteCard key={e.question} prompt={{ ask: `${i + 1}. ${e.question}`, answer: e.answer }} onSay={say} revealLabel="Check my answer" />
                    ))}
                  </div>
                  {activeConcept.quickCheck && activeConcept.quickCheck.length > 0 && (
                    <>
                      <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-[#f59e0b]">
                        Quick check before the next part
                      </p>
                      {activeConcept.quickCheck.map((t) => (
                        <TaskCard key={t.title} task={t} chosen={answers[t.title]} onPick={(i) => answer(t, i)} onReplay={() => replayTask(t)} />
                      ))}
                    </>
                  )}
                </>
              )}
              <ul className="hidden flex-col gap-1.5">
                {unit.concepts[0].keyPoints.map((k) => (
                  <li key={k} className="rounded-xl bg-[#0f172a] px-3 py-2 text-[0.8rem] leading-snug text-slate-300">• {k}</li>
                ))}
              </ul>
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
                  {" "}{graded.length} questions in all{paperTasks.length ? `, ${paperTasks.length} of them straight from your question paper` : ""}.
                </p>
              )}
              {/* Answered questions sink and dim so the one still to do has
                  the board to itself - real user direction 2026-09-14: "clear
                  or mark them light or move them backward for each answer
                  done... else old answer stays we work on new question that
                  may confuse". */}
              {byDone(phase === 2 ? unit.guidedTasks : unit.assessment.partA).map((t) => (
                <TaskCard key={t.title} task={t} chosen={answers[t.title]} onPick={(i) => answer(t, i)} onReplay={() => replayTask(t)} />
              ))}
              {phase === 4 && (
                <>
                  <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-[#f59e0b]">Part B · use it somewhere new</p>
                  {byDone(unit.assessment.partB).map((t) => (
                    <TaskCard key={t.title} task={t} chosen={answers[t.title]} onPick={(i) => answer(t, i)} onReplay={() => replayTask(t)} />
                  ))}
                  {paperTasks.length > 0 && (
                    <>
                      <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-[#38bdf8]">
                        From your question paper
                      </p>
                      {byDone(paperTasks).map((t) => (
                        <TaskCard key={t.title} task={t} chosen={answers[t.title]} onPick={(i) => answer(t, i)} onReplay={() => replayTask(t)} />
                      ))}
                    </>
                  )}
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
              <p className="pt-1 text-[0.7rem] font-extrabold uppercase tracking-wider text-slate-500">
                Write these in your rough book, then check
              </p>
              <div className="flex flex-col gap-2">
                {unit.writtenPractice.map((w, i) => (
                  <ReciteCard key={w.question} prompt={{ ask: `${i + 1}. ${w.question}`, answer: w.answer }} onSay={say} revealLabel="I've written it - check me" />
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

          {/* Ask-me sits under every phase, not just the first - real
              feedback 2026-09-14: "on the chat side there is no change,
              probably we should have some questions there". */}
          <details className="mt-2 rounded-2xl border-2 border-slate-700 bg-[#0f172a]" open={phase === 1}>
            <summary className="cursor-pointer px-3 py-2 text-[0.8rem] font-bold text-[#38bdf8]">
              📌 Stuck? Ask me ({unit.readymade.length})
            </summary>
            <div className="flex flex-col gap-1.5 px-3 pb-3">
              {unit.readymade.map((r) => (
                <button
                  key={r.q}
                  type="button"
                  onClick={() => ask(r.q, r.a)}
                  className="rounded-xl border-2 border-slate-700 bg-[#1e293b] px-3 py-2 text-left text-[0.8rem] font-semibold text-slate-300 transition-colors hover:border-[#38bdf8] hover:text-[#38bdf8]"
                >
                  {r.q}
                </button>
              ))}
              <div className="mt-1 flex max-h-36 flex-col gap-1.5 overflow-y-auto rounded-xl border border-slate-700 bg-[#090d16] p-2">
                {chat.map((m, i) => (
                  <p
                    key={i}
                    className={`rounded-lg px-2.5 py-1.5 text-[0.78rem] font-semibold ${
                      m.who === "kid" ? "self-end bg-[#0284c7] text-white" : "self-start border border-slate-700 bg-[#1e293b] text-[#38bdf8]"
                    }`}
                  >
                    {m.text}
                  </p>
                ))}
              </div>
            </div>
          </details>
        </aside>
      </div>
    </div>
  );
}

/**
 * Draws a number line frame: the line and its ticks, marks sitting on it,
 * hops drawn as arcs with their size written above, and place-value parts
 * underneath. Values in, pixels out - the same boundary the grid keeps.
 */
/**
 * A real illustration, panned and zoomed step by step. The transform is what
 * turns one big picture into a walkthrough - each step focuses a region, and
 * the move between them is the animation.
 */
function ImageStage({ frame, onTap }: { frame: BoardFrame; onTap?: (t: string) => void }) {
  const I = frame.image;
  if (!I) return null;
  const f = I.focus;
  // Zoom so the focused region fills the stage, then shift it to the middle.
  const scale = f ? Math.min(100 / f.w, 100 / f.h) : 1;
  const originX = f ? f.x + f.w / 2 : 50;
  const originY = f ? f.y + f.h / 2 : 50;

  return (
    <div className="flex h-full w-full select-none flex-col items-center gap-2 p-3">
      {I.title && <h3 className="shrink-0 text-center text-xl font-bold text-[#f59e0b]">{I.title}</h3>}
      <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-2xl border-[3px] border-slate-700 bg-[#0b1329]">
        <div
          className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out"
          style={{ transform: `scale(${scale})`, transformOrigin: `${originX}% ${originY}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={I.src} alt={I.alt} className="h-full w-full object-contain" />
          {/* Counter-scaled: the labels live in the image's coordinate space
              so they stay pinned to their features, but they must not
              magnify with it - at a 3x zoom a fixed-size label balloons and
              drifts away from the thing it names. */}
          {(I.hotspots ?? []).map((h, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onTap?.(`${h.label}. ${h.note}`)}
              style={{
                left: `${h.at[0]}%`,
                top: `${h.at[1]}%`,
                borderColor: TONE[h.tone ?? "gold"],
                transform: `translate(-50%, -50%) scale(${1 / scale})`,
              }}
              className="absolute whitespace-nowrap rounded-full border-2 bg-[#0b1329]/85 px-2 py-0.5 text-[0.7rem] font-bold text-white backdrop-blur-sm hover:bg-[#0b1329]"
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>
      <p className="shrink-0 text-[0.78rem] text-slate-500">Tap a label to hear more.</p>
    </div>
  );
}

/** A labelled figure. Artwork is repo source, still sanitised on the way in. */
function DiagramStage({ frame, onTap }: { frame: BoardFrame; onTap?: (t: string) => void }) {
  const D = frame.diagram;
  if (!D) return null;
  const [, , vw, vh] = D.viewBox.split(/\s+/).map(Number);
  return (
    <div className="flex h-full w-full select-none flex-col items-center gap-2 overflow-y-auto p-3">
      {D.title && <h3 className="text-center text-xl font-bold text-[#f59e0b]">{D.title}</h3>}
      <svg viewBox={D.viewBox} className="h-full max-h-[24rem] w-full max-w-[44rem] rounded-2xl border-[3px] border-slate-700 bg-[#0b1329]">
        <g dangerouslySetInnerHTML={{ __html: sanitizeSvgFragment(D.svg) }} />
        {(D.parts ?? []).map((p, i) => (
          <g key={i} className="cursor-pointer" onClick={() => onTap?.(`${p.label}. ${p.note}`)}>
            <circle cx={p.at[0]} cy={p.at[1]} r={Math.max(6, vw / 70)} fill={TONE[p.tone ?? "gold"]} stroke="#0b1329" strokeWidth={2} />
            <text
              x={p.at[0] + vw / 55}
              y={p.at[1] - vh / 45}
              fill={TONE[p.tone ?? "gold"]}
              fontSize={Math.max(11, vw / 42)}
              fontWeight="bold"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-[0.78rem] text-slate-500">Tap a label to hear what that part does.</p>
    </div>
  );
}

/** Bar models and arrays. */
function BarStage({ frame, onTap }: { frame: BoardFrame; onTap?: (t: string) => void }) {
  const B = frame.bar;
  if (!B) return null;
  const max = B.max ?? Math.max(1, ...(B.bars ?? []).map((b) => b.value));
  return (
    <div className="flex h-full w-full select-none flex-col justify-center gap-4 overflow-y-auto p-5">
      {B.title && <h3 className="text-center text-xl font-bold text-[#f59e0b]">{B.title}</h3>}
      {(B.bars ?? []).map((b, i) => (
        <button key={i} type="button" onClick={() => onTap?.(b.note ?? `${b.label}, ${b.value}`)} className="w-full text-left">
          <div className="mb-1 flex justify-between text-[0.82rem] font-bold text-slate-300">
            <span>{b.label}</span>
            <span className="tabular-nums" style={{ color: TONE[b.tone ?? "blue"] }}>{b.value}</span>
          </div>
          <div className="h-8 w-full overflow-hidden rounded-lg bg-[#0f172a] ring-1 ring-slate-700">
            <div className="h-full rounded-lg transition-all" style={{ width: `${(b.value / max) * 100}%`, backgroundColor: TONE[b.tone ?? "blue"] }} />
          </div>
        </button>
      ))}
      {B.array && (
        <div className="mx-auto flex flex-col gap-1.5">
          {Array.from({ length: B.array.rows }, (_, r) => (
            <div key={r} className="flex gap-1.5">
              {Array.from({ length: B.array!.cols }, (_, c) => {
                const n = r * B.array!.cols + c;
                const on = B.array!.highlight === undefined || n < B.array!.highlight;
                return <span key={c} className="h-6 w-6 rounded-full" style={{ backgroundColor: on ? TONE[B.array!.tone ?? "blue"] : "#1e293b" }} />;
              })}
            </div>
          ))}
        </div>
      )}
      {B.caption && <p className="text-center text-[0.9rem] font-bold text-slate-300">{B.caption}</p>}
    </div>
  );
}

/** A bar chart with axes. */
function ChartStage({ frame, onTap }: { frame: BoardFrame; onTap?: (t: string) => void }) {
  const C = frame.chart;
  if (!C) return null;
  const W = 620, H = 340, padL = 52, padB = 52;
  const max = Math.max(1, ...C.categories.map((c) => c.value));
  const step = (W - padL - 24) / C.categories.length;
  const ticks = Array.from({ length: max + 1 }, (_, i) => i).filter((i) => max <= 10 || i % Math.ceil(max / 5) === 0);
  return (
    <div className="flex h-full w-full select-none flex-col items-center gap-2 p-3">
      {C.title && <h3 className="text-center text-xl font-bold text-[#f59e0b]">{C.title}</h3>}
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full max-h-[24rem] w-full max-w-[42rem] rounded-2xl border-[3px] border-slate-700 bg-[#0b1329]">
        {ticks.map((t) => {
          const y = H - padB - (t / max) * (H - padB - 26);
          return (
            <g key={t}>
              <line x1={padL} y1={y} x2={W - 16} y2={y} stroke="#1e293b" strokeWidth={1} />
              <text x={padL - 8} y={y + 4} fill="#94a3b8" fontSize={11} fontWeight="bold" textAnchor="end">{t}</text>
            </g>
          );
        })}
        <line x1={padL} y1={H - padB} x2={W - 16} y2={H - padB} stroke="#64748b" strokeWidth={2.5} />
        <line x1={padL} y1={26} x2={padL} y2={H - padB} stroke="#64748b" strokeWidth={2.5} />
        {C.categories.map((c, i) => {
          const h = (c.value / max) * (H - padB - 26);
          const x = padL + i * step + step * 0.18;
          const w = step * 0.64;
          return (
            <g key={i} className="cursor-pointer" onClick={() => onTap?.(c.note ?? `${c.label}, ${c.value}`)}>
              <rect x={x} y={H - padB - h} width={w} height={h} rx={5} fill={TONE[c.tone ?? "blue"]} />
              <text x={x + w / 2} y={H - padB - h - 7} fill={TONE[c.tone ?? "blue"]} fontSize={12} fontWeight="bold" textAnchor="middle">{c.value}</text>
              <text x={x + w / 2} y={H - padB + 18} fill="#cbd5e1" fontSize={11} fontWeight="bold" textAnchor="middle">{c.label}</text>
            </g>
          );
        })}
        {C.yLabel && <text x={14} y={20} fill="#94a3b8" fontSize={11} fontWeight="bold">{C.yLabel}</text>}
        {C.xLabel && <text x={W - 16} y={H - 10} fill="#94a3b8" fontSize={11} fontWeight="bold" textAnchor="end">{C.xLabel}</text>}
      </svg>
    </div>
  );
}

/** Dated events along a line. */
function TimelineStage({ frame, onTap }: { frame: BoardFrame; onTap?: (t: string) => void }) {
  const T = frame.timeline;
  if (!T) return null;
  return (
    <div className="flex h-full w-full select-none flex-col gap-3 overflow-y-auto p-5">
      {T.title && <h3 className="text-center text-xl font-bold text-[#f59e0b]">{T.title}</h3>}
      <ol className="relative ml-3 border-l-[3px] border-[#38bdf8]/50 pl-5">
        {T.events.map((e, i) => (
          <li key={i} className="mb-4">
            <button type="button" onClick={() => onTap?.(e.note ?? `${e.when}. ${e.what}`)} className="text-left">
              <span
                className="absolute -left-[11px] mt-1 h-5 w-5 rounded-full border-[3px] border-[#0f172a]"
                style={{ backgroundColor: TONE[e.tone ?? "blue"] }}
              />
              <span className="block text-[0.8rem] font-extrabold uppercase tracking-wider" style={{ color: TONE[e.tone ?? "blue"] }}>{e.when}</span>
              <span className="block text-[0.95rem] font-bold text-white">{e.what}</span>
              {e.note && <span className="block text-[0.82rem] leading-snug text-slate-400">{e.note}</span>}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

const TONE: Record<string, string> = { gold: "#f59e0b", green: "#34d399", red: "#f43f5e", blue: "#38bdf8" };

/**
 * Renders a text frame: a passage with parts picked out in colour, a row of
 * tappable words, and buckets to sort them into. Every coloured part says its
 * note aloud when tapped, the same way a point on the grid does.
 */
function TextStage({
  frame,
  onTap,
  chipDrag,
  onDropChip,
}: {
  frame: BoardFrame;
  onTap?: (t: string) => void;
  chipDrag?: { chip: string; toColumn: number; hint?: string };
  onDropChip?: (columnIndex: number) => void;
}) {
  const T = frame.text;
  const [over, setOver] = React.useState<number | null>(null);
  if (!T) return <p className="text-sm text-slate-500">Press a step to begin.</p>;

  return (
    <div className="flex h-full w-full select-none flex-col gap-4 overflow-y-auto p-4">
      {T.title && <h3 className="text-center text-xl font-bold text-[#f59e0b]">{T.title}</h3>}

      {T.passage && (
        <p className="mx-auto max-w-3xl text-[1.05rem] leading-relaxed text-slate-200">
          {T.passage.map((part, i) =>
            part.tone ? (
              <button
                key={i}
                type="button"
                onClick={() => onTap?.(part.note ?? part.text)}
                className="mx-0.5 rounded-md px-1 font-bold underline decoration-dotted underline-offset-4"
                style={{ color: TONE[part.tone], backgroundColor: `${TONE[part.tone]}1f` }}
              >
                {part.text}
              </button>
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </p>
      )}

      {T.cards && (
        <div className="mx-auto grid w-full max-w-4xl gap-3 sm:grid-cols-2">
          {T.cards.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onTap?.(`${c.title}. ${c.desc}${c.quote ? ` The book says: ${c.quote}` : ""}`)}
              className="flex flex-col items-start gap-1.5 rounded-2xl border-2 border-slate-700 bg-[#0f172a] p-3.5 text-left transition-colors hover:border-[#38bdf8]"
            >
              <span className="rounded-full bg-[#f59e0b]/15 px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-[#f59e0b]">
                {c.tag}
              </span>
              <span className="text-[0.95rem] font-bold text-white">{c.title}</span>
              <span className="text-[0.82rem] leading-snug text-slate-400">{c.desc}</span>
              {c.quote && (
                <span className="mt-1 border-l-[3px] border-[#38bdf8] pl-2.5 text-[0.82rem] italic leading-snug text-[#7dd3fc]">
                  {c.quote}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {T.chips && (
        <div className="flex flex-wrap justify-center gap-2">
          {T.chips.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onTap?.(c.note ?? c.text)}
              className="rounded-xl border-2 px-3.5 py-2 text-[0.95rem] font-bold"
              style={{ borderColor: TONE[c.tone ?? "blue"], color: TONE[c.tone ?? "blue"], backgroundColor: `${TONE[c.tone ?? "blue"]}14` }}
            >
              {c.text}
            </button>
          ))}
        </div>
      )}

      {chipDrag && (
        <div
          className="mx-auto cursor-grab rounded-xl border-2 border-[#ec4899] bg-[#ec4899]/15 px-4 py-2.5 text-[1rem] font-bold text-[#ec4899]"
          draggable
          onDragStart={(e) => e.dataTransfer.setData("text/plain", chipDrag.chip)}
        >
          {chipDrag.chip}
          <span className="ml-2 text-[0.72rem] font-semibold opacity-80">{chipDrag.hint ?? "drag me into a box"}</span>
        </div>
      )}

      {T.columns && (
        <div className="mx-auto flex w-full max-w-3xl flex-wrap justify-center gap-3">
          {T.columns.map((col, ci) => (
            <div
              key={col.label}
              onDragOver={(e) => {
                if (!chipDrag) return;
                e.preventDefault();
                setOver(ci);
              }}
              onDragLeave={() => setOver((o) => (o === ci ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                setOver(null);
                onDropChip?.(ci);
              }}
              className={`min-w-[12rem] flex-1 rounded-2xl border-2 p-3 transition-colors ${
                over === ci ? "border-[#ec4899] bg-[#ec4899]/10" : "border-slate-700 bg-[#0f172a]"
              }`}
            >
              <p className="mb-2 text-center text-[0.8rem] font-extrabold uppercase tracking-wider" style={{ color: TONE[col.tone ?? "blue"] }}>
                {col.label}
              </p>
              <ul className="flex flex-col gap-1.5">
                {col.items.map((it) => (
                  <li key={it} className="rounded-lg bg-[#1e293b] px-2.5 py-1.5 text-[0.85rem] text-slate-300">{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NumberLineStage({
  frame,
  onTap,
  drag,
  onDrag,
  onDrop,
}: {
  frame: BoardFrame;
  onTap?: (v: number) => void;
  drag?: { at: number; hint?: string };
  onDrag?: (v: number) => void;
  onDrop?: (v: number) => void;
}) {
  const L = frame.line;
  if (!L) return <p className="text-sm text-slate-500">Press a step to begin.</p>;

  const W = 640;
  const H = 300;
  const padX = 46;
  const midY = 150;
  const span = L.max - L.min || 1;
  const px = (v: number) => padX + ((v - L.min) / span) * (W - padX * 2);
  const ticks: number[] = [];
  for (let v = L.min; v <= L.max + 1e-9; v += L.step) ticks.push(Number(v.toFixed(6)));
  const tone: Record<string, string> = { gold: "#f59e0b", green: "#34d399", red: "#f43f5e", blue: "#38bdf8" };
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(4))));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full max-h-[26rem] w-full max-w-[42rem] select-none touch-none rounded-2xl border-[3px] border-slate-700 bg-[#0b1329]" role="img" aria-label="Number line">
      <defs>
        <marker id="nl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#f59e0b" />
        </marker>
      </defs>

      <line x1={padX - 20} y1={midY} x2={W - padX + 20} y2={midY} stroke="#64748b" strokeWidth={3} />
      {ticks.map((v) => {
        const isZero = Math.abs(v) < 1e-9;
        return (
          <g key={v}>
            <line x1={px(v)} y1={midY - (isZero ? 14 : 9)} x2={px(v)} y2={midY + (isZero ? 14 : 9)} stroke={isZero ? "#94a3b8" : "#475569"} strokeWidth={isZero ? 3 : 2} />
            <text x={px(v)} y={midY + 32} fill={isZero ? "#e2e8f0" : "#94a3b8"} fontSize={12} fontWeight="bold" textAnchor="middle">{fmt(v)}</text>
            {/* Every tick is touchable and says what it is called - real user
                direction 2026-09-14: "sliding 0.1 to any tenths to understand
                how they are called". */}
            <rect x={px(v) - 14} y={midY - 26} width={28} height={64} fill="transparent" className="cursor-pointer" onClick={() => onTap?.(v)} />
          </g>
        );
      })}

      {(L.jumps ?? []).map((j, i) => {
        const x1 = px(j.from);
        const x2 = px(j.to);
        const top = midY - 52;
        return (
          <g key={`j${i}`}>
            <path d={`M ${x1} ${midY - 12} Q ${(x1 + x2) / 2} ${top} ${x2} ${midY - 12}`} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6,4" markerEnd="url(#nl-arrow)" />
            {j.label && <text x={(x1 + x2) / 2} y={top - 4} fill="#f59e0b" fontSize={13} fontWeight="bold" textAnchor="middle">{j.label}</text>}
          </g>
        );
      })}

      {(L.marks ?? []).map((m, i) => (
        <g key={`m${i}`}>
          <circle cx={px(m.at)} cy={midY} r={7} fill={tone[m.tone ?? "gold"]} />
          {m.label && <text x={px(m.at)} y={midY - 18} fill={tone[m.tone ?? "gold"]} fontSize={13} fontWeight="bold" textAnchor="middle">{m.label}</text>}
        </g>
      ))}

      {drag && (
        <g
          className="cursor-grab"
          onPointerDown={(e) => {
            const svg = e.currentTarget.ownerSVGElement;
            if (!svg) return;
            const toValue = (clientX: number) => {
              const r = svg.getBoundingClientRect();
              const vx = ((clientX - r.left) / r.width) * W;
              const raw = L.min + ((vx - padX) / (W - padX * 2)) * span;
              const snapped = L.min + Math.round((raw - L.min) / L.step) * L.step;
              return Number(Math.max(L.min, Math.min(L.max, snapped)).toFixed(6));
            };
            const move = (ev: PointerEvent) => onDrag?.(toValue(ev.clientX));
            const up = (ev: PointerEvent) => {
              window.removeEventListener("pointermove", move);
              window.removeEventListener("pointerup", up);
              onDrop?.(toValue(ev.clientX));
            };
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up);
          }}
        >
          <circle cx={px(drag.at)} cy={midY} r={14} fill="#ec4899" fillOpacity={0.25} />
          <circle cx={px(drag.at)} cy={midY} r={9} fill="#ec4899" stroke="#fff" strokeWidth={2} />
          <text x={px(drag.at)} y={midY - 24} fill="#ec4899" fontSize={13} fontWeight="bold" textAnchor="middle">
            {drag.hint ?? "drag me"} · {fmt(drag.at)}
          </text>
        </g>
      )}
      {(L.parts ?? []).map((p, i, arr) => {
        const boxW = Math.min(130, (W - padX * 2) / arr.length - 10);
        const x = padX + i * (boxW + 10);
        return (
          <g key={`p${i}`}>
            <rect x={x} y={midY + 56} width={boxW} height={54} rx={10} fill="#1e293b" stroke={tone[p.tone ?? "blue"]} strokeWidth={2} />
            <text x={x + boxW / 2} y={midY + 78} fill="#94a3b8" fontSize={11} fontWeight="bold" textAnchor="middle">{p.label}</text>
            <text x={x + boxW / 2} y={midY + 99} fill={tone[p.tone ?? "blue"]} fontSize={17} fontWeight="bold" textAnchor="middle">{p.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ReciteCard({
  prompt,
  onSay,
  revealLabel = "I've said it - show me",
}: {
  prompt: { ask: string; answer: string };
  onSay: (t: string) => void;
  revealLabel?: string;
}) {
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
          {revealLabel}
        </button>
      )}
    </div>
  );
}

function TaskCard({
  task,
  chosen,
  onPick,
  onReplay,
}: {
  task: BoardTask;
  chosen?: { correct: boolean; label: string; locked?: boolean };
  onPick: (index: number) => void;
  onReplay?: () => void;
}) {
  const done = Boolean(chosen);
  return (
    <div
      className={`flex flex-col gap-2.5 rounded-2xl border-2 p-3.5 transition-all ${
        done ? "scale-[0.98] border-slate-800 bg-[#0b1220] opacity-60" : "border-slate-700 bg-[#0f172a]"
      }`}
    >
      <div className="flex items-center justify-between gap-2 text-[0.9rem] font-bold text-white">
        <span className="min-w-0">{task.title}</span>
        <span className={`shrink-0 text-[0.75rem] ${chosen ? (chosen.correct ? "text-[#34d399]" : "text-[#f43f5e]") : "text-[#f59e0b]"}`}>
          {chosen ? (chosen.correct ? "✅ Right" : "❌ Marked wrong") : "· to do ·"}
        </span>
      </div>
      <p className="text-[0.82rem] font-semibold leading-snug text-slate-400">{task.prompt}</p>
      {done ? (
        <div className="flex items-center justify-between gap-2">
          <span className="text-[0.78rem] text-slate-400">
            You answered <strong className="text-slate-200">{chosen?.label}</strong>
          </span>
          <button type="button" onClick={onReplay} className="shrink-0 rounded-lg border border-slate-700 px-2 py-1 text-[0.7rem] font-bold text-slate-400 hover:border-[#38bdf8] hover:text-[#38bdf8]">
            Show on board
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
}
