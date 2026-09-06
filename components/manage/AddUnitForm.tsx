"use client";

import { useState } from "react";
import type { ManageCurriculum } from "./types";

const NEXT_STEP_OPTIONS = [
  {
    value: "learn",
    emoji: "📖",
    label: "Explanation & coaching content",
    description: "The actual lessons - start here first. Takes any pages you uploaded above straight to the unit page, ready to extract lesson content from.",
    curriculumOnly: true, // olympiad-mode units skip the Learn/chat phase entirely - see app/learn/[unitId]/page.tsx's redirect.
  },
  {
    value: "resources",
    emoji: "📝",
    label: "Practice workbook",
    description: "Worksheets a student can retry. Takes any pages you uploaded above to Curriculum Materials, ready to convert.",
    curriculumOnly: false,
  },
  {
    value: "resources",
    emoji: "🎯",
    label: "Final exam papers (1-3 tiers, with hints)",
    description: "Easy/moderate/tough progression tests, each with a hint button built in. Generated on the same Curriculum Materials page, once there's approved material to generate from.",
    curriculumOnly: true, // olympiad-mode units get exactly 2 exam sets instead - see the "How does this unit teach?" choice above.
  },
] as const;

// Mirrors lib/uploads.ts's ALLOWED_IMAGE_TYPES/MAX_UPLOAD_FILE_BYTES - kept
// as a separate copy since that file is server-only and can't be imported
// into a client component. Checked here too (real feedback 2026-09-06:
// "throw exact error to uploaders") so a bad file gets a specific reason
// immediately, rather than only after a round trip - or, for a large
// enough file, instead of the browser's own opaque "this page couldn't
// load" if it were left to hit Next.js's Server Action body-size cap.
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"]);
const MAX_FILE_BYTES = 200 * 1024 * 1024;

function validateFiles(files: FileList): string[] {
  const errors: string[] = [];
  for (const file of Array.from(files)) {
    if (!ALLOWED_TYPES.has(file.type)) {
      errors.push(`"${file.name}" isn't a supported file type - only images and PDF are accepted.`);
    } else if (file.size > MAX_FILE_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      errors.push(`"${file.name}" is ${mb}MB - over the ${MAX_FILE_BYTES / (1024 * 1024)}MB limit.`);
    }
  }
  return errors;
}

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
  const [contentMode, setContentMode] = useState<"curriculum" | "olympiad">("curriculum");
  const [fileErrors, setFileErrors] = useState<string[]>([]);
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

      {/* Real feedback (2026-09-06): "we don't need to feed unit numbers here
          which makes it complicated" - createUnit now picks the next number
          after whatever's already in this subject, so this just isn't asked
          for any more. */}
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
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Upload pages now (optional)
        <input
          type="file"
          name="pages"
          multiple
          accept="image/*,application/pdf"
          onChange={(e) => setFileErrors(e.target.files ? validateFiles(e.target.files) : [])}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand-ink file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
        />
        <span className="text-xs font-normal text-slate-500">
          A photo of each page, or a single PDF of the whole workbook - either works. Goes
          straight to whichever tool matches what you pick below, so the unit already has real
          material to work from.
        </span>
        {fileErrors.length > 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
            {fileErrors.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
            Remove or replace {fileErrors.length === 1 ? "this file" : "these files"} before adding the unit.
          </div>
        )}
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
        <legend className="text-sm font-medium text-slate-700">How does this unit teach?</legend>
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
            contentMode === "curriculum" ? "border-brand-ink bg-brand-ink/5" : "border-slate-200 hover:border-brand-ink-light"
          }`}
        >
          <input
            type="radio"
            name="contentModeChoice"
            checked={contentMode === "curriculum"}
            onChange={() => setContentMode("curriculum")}
            className="mt-1"
          />
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
          <input
            type="radio"
            name="contentModeChoice"
            checked={contentMode === "olympiad"}
            onChange={() => {
              setContentMode("olympiad");
              if (nextStep === "learn") setNextStep("resources");
            }}
            className="mt-1"
          />
          <span>
            <span className="font-medium text-slate-800">🏆 Olympiad-style</span>
            <span className="mt-0.5 block text-xs text-slate-500">
              No lesson chat - straight to 2-4 fixed practice sets, then 2 exam sets once a set is passed. Use this
              for Olympiad/competitive-exam prep.
            </span>
          </span>
        </label>
      </fieldset>
      <input type="hidden" name="contentMode" value={contentMode} />

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-slate-700">
          What do you want to add for this unit? Choose only what you actually want first.
        </legend>
        {NEXT_STEP_OPTIONS.filter((opt) => contentMode === "curriculum" || !opt.curriculumOnly).map((opt, i) => (
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
        disabled={fileErrors.length > 0}
        className="justify-self-start rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 disabled:opacity-50"
      >
        Add unit
      </button>
    </form>
  );
}
