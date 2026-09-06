"use client";

import { useState } from "react";

const EXAM_PRESETS = [
  "Olympiad (Math)",
  "Olympiad (Science)",
  "NEET",
  "JEE Main",
  "JEE Advanced",
  "GRE",
  "GMAT",
  "SAT",
  "IELTS",
  "TOEFL",
];

export default function ExamPresetForm({
  action,
  existingBoardNames,
}: {
  action: (formData: FormData) => void;
  existingBoardNames: string[];
}) {
  const [choice, setChoice] = useState(EXAM_PRESETS[0]);
  const [custom, setCustom] = useState("");
  const isCustom = choice === "Other";
  const boardName = isCustom ? custom.trim() : choice;
  const alreadyExists = boardName.length > 0 && existingBoardNames.some((n) => n.toLowerCase() === boardName.toLowerCase());

  return (
    <form action={action} className="mt-3 grid max-w-md gap-3">
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Exam
        <select
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-base"
        >
          {EXAM_PRESETS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
          <option value="Other">Other - type my own</option>
        </select>
      </label>

      {isCustom && (
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Exam name
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            required
            placeholder="e.g. UPSC, CAT"
            className="rounded-xl border border-slate-300 px-3 py-2 text-base"
          />
        </label>
      )}

      <input type="hidden" name="boardName" value={boardName} />

      {alreadyExists && (
        <p className="text-xs text-amber-700">
          &ldquo;{boardName}&rdquo; is already set up - adding it again just reuses it, nothing gets duplicated.
        </p>
      )}

      <button
        type="submit"
        disabled={!boardName}
        className="justify-self-start rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 disabled:opacity-50"
      >
        Add exam
      </button>
    </form>
  );
}
