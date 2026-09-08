"use client";

import { useState } from "react";
import type { ManageCurriculum } from "./types";

// Real user request 2026-09-08: "give options to add units and textbook
// upload options. this must be textbook only no individual units. and from
// TOC all units should populate correctly." This is now the primary way to
// add units - upload the whole textbook once, every unit it actually
// contains gets created from its own table of contents.
export default function AddTextbookForm({
  action,
  curricula,
}: {
  action: (formData: FormData) => void;
  curricula: ManageCurriculum[];
}) {
  const [contentMode, setContentMode] = useState<"curriculum" | "olympiad">("curriculum");
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
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
        No subjects yet - add one above first, then come back here to upload its textbook.
      </p>
    );
  }

  return (
    <form
      action={action}
      onSubmit={() => setSubmitting(true)}
      className="mt-3 grid max-w-lg gap-3"
    >
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

      {subject && subject.units.length > 0 && (
        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          Already there: {subject.units.map((u) => `Unit ${u.number} (${u.title})`).join(", ")} - new units from this
          textbook are added after these, numbered in the book&apos;s own order.
        </div>
      )}

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Textbook title (optional)
        <input type="text" name="bookTitle" placeholder="e.g. Cambridge Primary Mathematics" className="rounded-xl border border-slate-300 px-3 py-2 text-base" />
      </label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Textbook publisher (optional)
        <input type="text" name="publisher" className="rounded-xl border border-slate-300 px-3 py-2 text-base" />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Upload the textbook (one PDF)
        <input
          type="file"
          name="textbook"
          required
          accept="application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return setFileError(null);
            if (file.type !== "application/pdf") {
              setFileError(`"${file.name}" isn't a PDF - upload the textbook as one PDF, including its table of contents.`);
            } else if (file.size > 200 * 1024 * 1024) {
              setFileError(`"${file.name}" is over the 200MB limit.`);
            } else {
              setFileError(null);
            }
          }}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand-ink file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
        />
        <span className="text-xs font-normal text-slate-500">
          One PDF of the whole book, including its table of contents - every unit it lists gets
          created automatically, with the same real book attached to each one so you can approve
          and extract its content from Curriculum Materials next, unit by unit.
        </span>
        {fileError && <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">{fileError}</div>}
      </label>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-slate-700">How do these units teach?</legend>
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
            contentMode === "curriculum" ? "border-brand-ink bg-brand-ink/5" : "border-slate-200 hover:border-brand-ink-light"
          }`}
        >
          <input type="radio" name="contentModeChoice" checked={contentMode === "curriculum"} onChange={() => setContentMode("curriculum")} className="mt-1" />
          <span>
            <span className="font-medium text-slate-800">📚 Curriculum teaching</span>
            <span className="mt-0.5 block text-xs text-slate-500">
              The full journey: lesson chat, then a workbook, then a tiered (easy/moderate/tough) test. Use this for
              school-curriculum subjects.
            </span>
          </span>
        </label>
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
            contentMode === "olympiad" ? "border-brand-ink bg-brand-ink/5" : "border-slate-200 hover:border-brand-ink-light"
          }`}
        >
          <input type="radio" name="contentModeChoice" checked={contentMode === "olympiad"} onChange={() => setContentMode("olympiad")} className="mt-1" />
          <span>
            <span className="font-medium text-slate-800">🏆 Olympiad-style</span>
            <span className="mt-0.5 block text-xs text-slate-500">
              No lesson chat - straight to fixed practice sets, then exam sets once a set is passed. Use this for
              Olympiad/competitive-exam prep books.
            </span>
          </span>
        </label>
      </fieldset>
      <input type="hidden" name="contentMode" value={contentMode} />

      <button
        type="submit"
        disabled={!!fileError || submitting}
        className="justify-self-start rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 disabled:opacity-50"
      >
        {submitting ? "Reading the table of contents..." : "Add units from this textbook"}
      </button>
      {submitting && (
        <p className="text-xs text-slate-500">
          This reads the whole PDF to find its real chapter list - can take a little while for a big book.
        </p>
      )}
    </form>
  );
}
