"use client";

import { useState } from "react";
import type { ManageCurriculum } from "./types";

const NEXT_STEP_OPTIONS = [
  {
    value: "learn",
    emoji: "📖",
    label: "Explanation & coaching content",
    description: "The actual lessons - start here first. Takes you to the unit page to upload textbook pages and extract the lesson content.",
  },
  {
    value: "resources",
    emoji: "📝",
    label: "Practice workbook",
    description: "Worksheets a student can retry. Takes you to Curriculum Materials to upload pages and convert them.",
  },
  {
    value: "resources",
    emoji: "🎯",
    label: "Final exam papers (1-3 tiers, with hints)",
    description: "Easy/moderate/tough progression tests, each with a hint button built in. Generated on the same Curriculum Materials page, once there's approved material to generate from.",
  },
] as const;

export default function AddUnitForm({
  action,
  curricula,
  isAdmin,
}: {
  action: (formData: FormData) => void;
  curricula: ManageCurriculum[];
  isAdmin: boolean;
}) {
  const [nextStep, setNextStep] = useState<"learn" | "resources">("learn");
  const curriculaWithSubjects = curricula.filter((c) => c.stages.some((s) => s.subjects.length > 0));

  const [curriculumId, setCurriculumId] = useState(curriculaWithSubjects[0]?.id ?? "");
  const curriculum = curriculaWithSubjects.find((c) => c.id === curriculumId);
  const stagesWithSubjects = curriculum?.stages.filter((s) => s.subjects.length > 0) ?? [];

  const [stageId, setStageId] = useState(stagesWithSubjects[0]?.id ?? "");
  const stage = stagesWithSubjects.find((s) => s.id === stageId);

  const [subjectId, setSubjectId] = useState(stage?.subjects[0]?.id ?? "");
  const subject = stage?.subjects.find((s) => s.id === subjectId);

  if (curriculaWithSubjects.length === 0) {
    return (
      <p className="mt-3 text-sm text-slate-500">
        No subjects yet - add one above first, then come back here to add its units.
      </p>
    );
  }

  return (
    <form action={action} className="mt-3 grid max-w-lg gap-3">
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Board / curriculum
        <select
          value={curriculumId}
          onChange={(e) => {
            const next = e.target.value;
            setCurriculumId(next);
            const nextStages = curriculaWithSubjects.find((c) => c.id === next)?.stages.filter((s) => s.subjects.length > 0) ?? [];
            const nextStageId = nextStages[0]?.id ?? "";
            setStageId(nextStageId);
            setSubjectId(nextStages[0]?.subjects[0]?.id ?? "");
          }}
          className="rounded-xl border border-slate-300 px-3 py-2 text-base"
        >
          {curriculaWithSubjects.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Grade / stage
        <select
          value={stageId}
          onChange={(e) => {
            const next = e.target.value;
            setStageId(next);
            setSubjectId(stagesWithSubjects.find((s) => s.id === next)?.subjects[0]?.id ?? "");
          }}
          className="rounded-xl border border-slate-300 px-3 py-2 text-base"
        >
          {stagesWithSubjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Subject
        <select
          name="subjectId"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          required
          className="rounded-xl border border-slate-300 px-3 py-2 text-base"
        >
          {(stage?.subjects ?? []).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      {subject && (
        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          {subject.units.length > 0 ? (
            <>
              Already there: {subject.units.map((u) => `Unit ${u.number} (${u.title})`).join(", ")} - check
              yours isn&apos;t a duplicate before adding.
            </>
          ) : (
            "No units yet in this subject."
          )}
        </div>
      )}

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Unit number
        <input
          type="number"
          name="number"
          min={1}
          required
          className="rounded-xl border border-slate-300 px-3 py-2 text-base"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Unit title
        <input
          type="text"
          name="title"
          required
          placeholder="e.g. Fractions and decimals"
          className="rounded-xl border border-slate-300 px-3 py-2 text-base"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Textbook publisher (optional)
        <input type="text" name="publisher" className="rounded-xl border border-slate-300 px-3 py-2 text-base" />
      </label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Textbook title (optional)
        <input type="text" name="bookTitle" className="rounded-xl border border-slate-300 px-3 py-2 text-base" />
      </label>
      <details className="rounded-xl border border-dashed border-slate-300 p-3 text-sm text-slate-600">
        <summary className="cursor-pointer font-medium">
          Advanced: list concepts manually (optional)
        </summary>
        <label className="mt-2 grid gap-1 text-sm font-medium text-slate-700">
          One per line as <code>id: name</code> - only if you already know the exact concept
          breakdown. Otherwise pick what to add below and do this from the real content tools
          instead.
          <textarea
            name="outline"
            rows={4}
            placeholder={"2.1: Adding fractions\n2.2: Comparing decimals"}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-mono"
          />
        </label>
      </details>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-slate-700">
          What do you want to add for this unit? Choose only what you actually want first.
        </legend>
        {NEXT_STEP_OPTIONS.map((opt, i) => (
          <label
            key={i}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
              nextStep === opt.value ? "border-brand-ink bg-brand-ink/5" : "border-slate-200 hover:border-brand-ink-light"
            }`}
          >
            <input
              type="radio"
              name="nextStepChoice"
              checked={nextStep === opt.value}
              onChange={() => setNextStep(opt.value)}
              className="mt-1"
            />
            <span>
              <span className="font-medium text-slate-800">
                {opt.emoji} {opt.label}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">{opt.description}</span>
            </span>
          </label>
        ))}
        {!isAdmin && (
          <p className="text-xs text-amber-700">
            Workbook and exam-paper generation live on the admin-only Curriculum Materials page -
            you&apos;ll need an admin account to finish those two once the unit is created.
          </p>
        )}
      </fieldset>
      <input type="hidden" name="nextStep" value={nextStep} />

      <button
        type="submit"
        className="justify-self-start rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95"
      >
        Add unit
      </button>
    </form>
  );
}
