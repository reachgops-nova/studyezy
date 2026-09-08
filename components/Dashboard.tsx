"use client";

import { useState } from "react";
import type { SubjectProgress } from "@/lib/queries/dashboard";
import type { MasteryBand } from "@/lib/types";

// Fixed, named per-subject palette (not a generic default) - deterministic
// by subject name so the same subject always reads the same color across
// visits, rotating through a small set of distinct, tasteful hues rather
// than one accent repeated for every card. Each entry is {wash, accent,
// accentHex, text} - wash/text are Tailwind classes for the card chrome,
// accentHex feeds the inline-styled progress bar fill (Tailwind can't do
// arbitrary computed widths+colors together via class names alone).
const PALETTE = [
  { wash: "bg-indigo-50", ring: "ring-indigo-100", text: "text-indigo-700", accentHex: "#6366f1" },
  { wash: "bg-emerald-50", ring: "ring-emerald-100", text: "text-emerald-700", accentHex: "#10b981" },
  { wash: "bg-amber-50", ring: "ring-amber-100", text: "text-amber-700", accentHex: "#d97706" },
  { wash: "bg-rose-50", ring: "ring-rose-100", text: "text-rose-700", accentHex: "#e11d48" },
  { wash: "bg-sky-50", ring: "ring-sky-100", text: "text-sky-700", accentHex: "#0284c7" },
  { wash: "bg-violet-50", ring: "ring-violet-100", text: "text-violet-700", accentHex: "#7c3aed" },
];

function subjectAccent(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

function bandColor(band: MasteryBand): string {
  switch (band) {
    case "mastered":
      return "bg-emerald-100 text-emerald-700";
    case "needs_brush_up":
      return "bg-amber-100 text-amber-700";
    case "needs_reteach":
      return "bg-red-100 text-red-700";
  }
}

function bandLabel(band: MasteryBand): string {
  switch (band) {
    case "mastered":
      return "Mastered";
    case "needs_brush_up":
      return "Brush up";
    case "needs_reteach":
      return "Re-teach";
  }
}

export default function Dashboard({ subjects }: { subjects: SubjectProgress[] }) {
  if (subjects.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        No tests taken yet. Once a subject has a real attempt, its progress from where it started to
        where it stands now shows up here.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {subjects.map((s) => (
        <SubjectCard key={s.subjectId} subject={s} />
      ))}
    </div>
  );
}

function SubjectCard({ subject }: { subject: SubjectProgress }) {
  const [expanded, setExpanded] = useState(false);
  const accent = subjectAccent(subject.subjectName);
  const improving = subject.trend > 0;
  const declining = subject.trend < 0;
  const hasMovement = subject.attemptsCount > 1;

  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft ring-1 ${accent.ring}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`inline-flex items-center rounded-full ${accent.wash} px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${accent.text}`}>
            {subject.subjectName}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-800">
            {subject.currentPct}%
            {hasMovement && (
              <span
                className={`ml-2 align-middle text-sm font-semibold tabular-nums ${
                  improving ? "text-emerald-600" : declining ? "text-red-500" : "text-slate-400"
                }`}
              >
                {improving ? "▲" : declining ? "▼" : "―"} {Math.abs(subject.trend)}%
              </span>
            )}
          </p>
          <p className="text-xs text-slate-400">{subject.attemptsCount} test{subject.attemptsCount === 1 ? "" : "s"} taken</p>
        </div>
      </div>

      {/* Baseline -> current progress bar - real feedback 2026-09-08: "how
          they are improving from benchmark base to current situations" -
          the dashed marker is where they started, the filled bar is where
          they are now. */}
      <div className="mt-4">
        <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          <span>{subject.baselineIsDiagnostic ? "Starting point" : "First attempt"}</span>
          <span>Now</span>
        </div>
        <div className="relative mt-1 h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all"
            style={{ width: `${subject.currentPct}%`, backgroundColor: accent.accentHex }}
          />
          {hasMovement && (
            <div
              className="absolute inset-y-0 w-[3px] bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.25)]"
              style={{ left: `calc(${subject.baselinePct}% - 1.5px)` }}
              title={`Started at ${subject.baselinePct}%`}
            />
          )}
        </div>
        <div className="mt-1 flex justify-between text-[10px] font-medium tabular-nums text-slate-400">
          <span>{subject.baselinePct}%</span>
          <span>{subject.currentPct}%</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 text-xs font-semibold text-slate-500 hover:text-slate-700"
      >
        {expanded ? "Hide" : "Show"} unit by unit ({subject.units.length}) {expanded ? "▲" : "▼"}
      </button>

      {expanded && (
        <div className="mt-2 grid gap-1.5 border-t border-slate-100 pt-3">
          {subject.units.map((u) => (
            <div key={u.unitKey} className="flex items-center justify-between gap-2 text-xs">
              <span className="min-w-0 truncate text-slate-600">
                Unit {u.number}: {u.title}
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <span className={`rounded-full px-2 py-0.5 font-medium ${bandColor(u.band)}`}>{bandLabel(u.band)}</span>
                <span className="w-9 text-right font-semibold tabular-nums text-slate-700">{u.scorePct}%</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
