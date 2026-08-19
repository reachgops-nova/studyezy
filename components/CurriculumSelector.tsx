"use client";

import { useState } from "react";
import Link from "next/link";
import type { CatalogCurriculum } from "@/lib/catalog";

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
            {subject.units.map((u) => (
              <div
                key={u.id}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  u.available ? "border-orange-200 bg-orange-50" : "border-slate-200 bg-slate-50 text-slate-400"
                }`}
              >
                <span>
                  Unit {u.id}: {u.title}
                </span>
                {u.available ? (
                  <Link
                    href={`/learn/${curriculumId}-${stageId}-${subjectId}-${u.id}`}
                    className="rounded-md bg-brand-navy px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-navy-dark"
                  >
                    Start
                  </Link>
                ) : (
                  <Badge>coming soon</Badge>
                )}
              </div>
            ))}
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
          ? "border-brand-navy bg-brand-navy text-white"
          : "border-slate-300 bg-white hover:border-brand-navy-light"
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
