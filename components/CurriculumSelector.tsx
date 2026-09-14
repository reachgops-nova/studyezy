"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CatalogCurriculum } from "@/lib/catalog";

const LAST_PICK_KEY = "studyezy.lastPick";

export default function CurriculumSelector({
  catalog,
  defaultCurriculumId,
  defaultStageId,
}: {
  catalog: CatalogCurriculum[];
  /** A profile's assigned book, if set - pre-selects instead of the usual "first available" default. Still just a default: everything below stays freely browsable. */
  defaultCurriculumId?: string;
  defaultStageId?: number;
}) {
  // Remember where the child was last - real user direction 2026-09-14:
  // "when we use the board room and come back it should back to the unit list
  // where we left". Coming back from a lesson or the board landed on a reset
  // picker, so they had to re-choose curriculum, stage and subject every time.
  const [restored, setRestored] = useState(false);

  const [curriculumId, setCurriculumId] = useState(
    (defaultCurriculumId && catalog.some((c) => c.id === defaultCurriculumId) ? defaultCurriculumId : null) ??
      catalog[0]?.id ??
      ""
  );
  const curriculum = catalog.find((c) => c.id === curriculumId);

  const [stageId, setStageId] = useState<number | null>(
    (defaultStageId !== undefined && curriculum?.stages.some((s) => s.id === defaultStageId && s.available)
      ? defaultStageId
      : null) ??
      curriculum?.stages.find((s) => s.available)?.id ??
      null
  );
  const stage = curriculum?.stages.find((s) => s.id === stageId);

  const [subjectId, setSubjectId] = useState<string | null>(
    stage?.subjects.find((s) => s.available)?.id ?? null
  );
  // Plain lookup, not memoized: the list is tiny (a handful of subjects), so
  // memoizing here isn't worth it and trips the compiler's mutation heuristic.
  const subject = stage?.subjects.find((s) => s.id === subjectId);

  // The grades either side of the one chosen. Same curriculum only - a
  // Cambridge child is not offered a State Board book by accident.
  const nearbyStages = (curriculum?.stages ?? []).filter(
    (s) => s.available && s.id !== stageId && stageId !== null && Math.abs(s.id - stageId) <= 1,
  );

  // Restore on first paint only, and only to choices that still exist - a
  // remembered subject that has since moved stage must not strand the picker.
  useEffect(() => {
    if (restored) return;
    setRestored(true);
    try {
      const raw = localStorage.getItem(LAST_PICK_KEY);
      if (!raw) return;
      const last = JSON.parse(raw) as { curriculumId?: string; stageId?: number; subjectId?: string };
      const c = catalog.find((x) => x.id === last.curriculumId);
      if (!c) return;
      setCurriculumId(c.id);
      const st = c.stages.find((x) => x.id === last.stageId && x.available);
      if (!st) return;
      setStageId(st.id);
      const sub = st.subjects.find((x) => x.id === last.subjectId && x.available);
      if (sub) setSubjectId(sub.id);
    } catch {
      /* a corrupt or unavailable store just means no memory this time */
    }
  }, [restored, catalog]);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(LAST_PICK_KEY, JSON.stringify({ curriculumId, stageId, subjectId }));
    } catch {
      /* private browsing and blocked storage are fine - memory is a nicety */
    }
  }, [restored, curriculumId, stageId, subjectId]);

  return (
    <div className="grid gap-6">
      <Step label="1. Curriculum">
        <div className="flex flex-wrap gap-2">
          {catalog.map((c) => (
            <PillButton key={c.id} active={c.id === curriculumId} onClick={() => setCurriculumId(c.id)}>
              {c.name}
            </PillButton>
          ))}
        </div>
      </Step>

      <Step label="2. Class / Stage">
        <div className="flex flex-wrap gap-2">
          {curriculum?.stages.map((s) => (
            <PillButton
              key={s.id}
              active={s.id === stageId}
              disabled={!s.available}
              onClick={() => {
                setStageId(s.id);
                setSubjectId(null);
              }}
            >
              {s.label}
              {!s.available && <Badge>coming soon</Badge>}
            </PillButton>
          ))}
        </div>
      </Step>

      {/* Books from the grades either side, offered rather than hidden - real
          user direction 2026-09-14: "a 4th grade may use 5th textbook like in
          our case, so we need to ensure even when a 5th grade needs same
          textbook it must be mapped correctly... add nearby grade books
          available for them". Picking one simply moves the whole picker to
          that stage, so the choice is explicit and the mapping stays honest:
          the child is on that book, not on a guess about their age. */}
      {curriculum && stage && nearbyStages.length > 0 && (
        <Step label="Also available - books from nearby grades">
          <div className="flex flex-wrap gap-2">
            {nearbyStages.map((ns) =>
              ns.subjects
                .filter((sub) => sub.available && sub.units.length > 0)
                .map((sub) => (
                  <button
                    key={`${ns.id}-${sub.id}`}
                    type="button"
                    onClick={() => {
                      setStageId(ns.id);
                      setSubjectId(sub.id);
                    }}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-left text-sm hover:border-brand-gold"
                  >
                    <span className="block font-semibold text-slate-800">{sub.name}</span>
                    <span className="block text-xs text-slate-500">
                      {ns.label} · {sub.units.length} unit{sub.units.length === 1 ? "" : "s"}
                    </span>
                  </button>
                )),
            )}
          </div>
        </Step>
      )}

      {stage && (
        <Step label="3. Subject">
          <div className="flex flex-wrap gap-2">
            {stage.subjects.map((s) => (
              <PillButton
                key={s.id}
                active={s.id === subjectId}
                disabled={!s.available}
                onClick={() => setSubjectId(s.id)}
              >
                {s.name}
                {!s.available && <Badge>coming soon</Badge>}
              </PillButton>
            ))}
          </div>
        </Step>
      )}

      {subject && (
        <Step label="4. Unit">
          <div className="grid gap-2">
            {subject.units.map((u) => {
              // Real feedback (2026-09-05): this list always said "Start",
              // even for a unit already covered - undefined total/covered
              // means getCatalog() was called without a profileId (not this
              // page), so this degrades to the old plain "Start" then.
              const hasProgress = u.totalConcepts !== undefined && u.coveredConcepts !== undefined;
              const done = hasProgress && u.totalConcepts! > 0 && u.coveredConcepts === u.totalConcepts;
              const started = hasProgress && (u.coveredConcepts ?? 0) > 0;
              return (
                <div
                  key={u.id}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                    u.available ? "border-brand-gold/40 bg-brand-gold-bright/10" : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  <div className="min-w-0">
                    <span>
                      Unit {u.id}: {u.title}
                    </span>
                    {u.available && hasProgress && u.totalConcepts! > 0 && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${done ? "bg-emerald-500" : "bg-brand-gold"}`}
                            style={{ width: `${Math.round(((u.coveredConcepts ?? 0) / u.totalConcepts!) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {u.coveredConcepts}/{u.totalConcepts} covered
                        </span>
                      </div>
                    )}
                  </div>
                  {u.available ? (
                    <Link
                      href={`/learn/${curriculumId}-${stageId}-${subjectId}-${u.id}`}
                      className="shrink-0 rounded-md bg-brand-ink px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-ink-dark"
                    >
                      {done ? "Review" : started ? "Continue" : "Start"}
                    </Link>
                  ) : (
                    <Badge>coming soon</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </Step>
      )}
    </div>
  );
}

function Step({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</h2>
      {children}
    </div>
  );
}

function PillButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
        disabled
          ? "cursor-not-allowed border-slate-200 text-slate-400"
          : active
          ? "border-brand-ink bg-brand-ink text-white"
          : "border-slate-300 bg-white hover:border-brand-ink-light"
      }`}
    >
      {children}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
      {children}
    </span>
  );
}
