"use client";

import { useState } from "react";
import type { ManageCurriculum } from "./types";

type Mode = "existing" | "new_grade" | "new_board";

export default function AddSubjectForm({
  action,
  curricula,
  initialCurriculumId,
}: {
  action: (formData: FormData) => void;
  curricula: ManageCurriculum[];
  /** Pre-selects a just-created board (createBoard redirects here with its id) instead of leaving the picker on whatever sorted first - real friction found live 2026-09-06: a newly added board wasn't auto-selected, so it looked like adding it hadn't worked. */
  initialCurriculumId?: string;
}) {
  const [mode, setMode] = useState<Mode>("existing");
  const initialCurriculum = curricula.find((c) => c.id === initialCurriculumId) ?? curricula[0];
  const [curriculumId, setCurriculumId] = useState(initialCurriculum?.id ?? "");
  const [stageId, setStageId] = useState(initialCurriculum?.stages[0]?.id ?? "");

  const curriculum = curricula.find((c) => c.id === curriculumId);
  const stage = curriculum?.stages.find((s) => s.id === stageId);

  return (
    <form action={action} className="mt-3 grid max-w-lg gap-3">
      <input type="hidden" name="boardMode" value={mode} />

      {mode === "existing" && curricula.length > 0 ? (
        <>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Board / curriculum
            <select
              value={curriculumId}
              onChange={(e) => {
                const next = e.target.value;
                setCurriculumId(next);
                setStageId(curricula.find((c) => c.id === next)?.stages[0]?.id ?? "");
              }}
              className="rounded-xl border border-slate-300 px-3 py-2 text-base"
            >
              {curricula.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {curriculum && curriculum.stages.length > 0 ? (
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Grade / stage
              <select
                name="stageId"
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                required
                className="rounded-xl border border-slate-300 px-3 py-2 text-base"
              >
                {curriculum.stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="text-sm text-slate-500">
              No grades yet under {curriculum?.name} -{" "}
              <button type="button" onClick={() => setMode("new_grade")} className="text-brand-ink underline">
                add one
              </button>
              .
            </p>
          )}

          {stage && (
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              {stage.subjects.length > 0 ? (
                <>
                  Already there: {stage.subjects.map((s) => s.name).join(", ")} - check this isn&apos;t a
                  duplicate before adding.
                </>
              ) : (
                "No subjects yet under this grade."
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-xs">
            <button type="button" onClick={() => setMode("new_grade")} className="text-brand-ink underline">
              + Add a new grade under this board
            </button>
            <button type="button" onClick={() => setMode("new_board")} className="text-brand-ink underline">
              + Add a whole new board
            </button>
          </div>
        </>
      ) : null}

      {mode === "new_grade" && (
        <div className="grid gap-3 rounded-xl border border-dashed border-slate-300 p-3">
          <input type="hidden" name="curriculumId" value={curriculumId} />
          <p className="text-sm font-medium text-slate-700">
            New grade under {curriculum?.name ?? "this board"}
          </p>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Grade label
            <input
              type="text"
              name="newStageLabel"
              required
              placeholder="e.g. Grade 9"
              className="rounded-xl border border-slate-300 px-3 py-2 text-base"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Grade number
            <input
              type="number"
              name="newStageNumber"
              required
              min={0}
              placeholder="e.g. 9"
              className="rounded-xl border border-slate-300 px-3 py-2 text-base"
            />
          </label>
          {curricula.length > 0 && (
            <button type="button" onClick={() => setMode("existing")} className="justify-self-start text-xs text-brand-ink underline">
              ← Back to existing grades
            </button>
          )}
        </div>
      )}

      {mode === "new_board" && (
        <div className="grid gap-3 rounded-xl border border-dashed border-slate-300 p-3">
          <p className="text-sm font-medium text-slate-700">New board</p>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Board name
            <input
              type="text"
              name="newBoardName"
              required
              placeholder="e.g. CBSE, ICSE, Matric / State Board"
              list="known-boards"
              className="rounded-xl border border-slate-300 px-3 py-2 text-base"
            />
            <datalist id="known-boards">
              <option value="CBSE" />
              <option value="ICSE" />
              <option value="Cambridge IGCSE" />
              <option value="IB" />
              <option value="Matric / State Board" />
            </datalist>
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Grade label
            <input
              type="text"
              name="newStageLabel"
              required
              placeholder="e.g. Grade 9"
              className="rounded-xl border border-slate-300 px-3 py-2 text-base"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Grade number
            <input
              type="number"
              name="newStageNumber"
              required
              min={0}
              placeholder="e.g. 9"
              className="rounded-xl border border-slate-300 px-3 py-2 text-base"
            />
          </label>
          {curricula.length > 0 && (
            <button type="button" onClick={() => setMode("existing")} className="justify-self-start text-xs text-brand-ink underline">
              ← Back to existing boards
            </button>
          )}
        </div>
      )}

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Subject name
        <input
          type="text"
          name="name"
          required
          placeholder="e.g. Math"
          className="rounded-xl border border-slate-300 px-3 py-2 text-base"
        />
      </label>

      <button
        type="submit"
        className="justify-self-start rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95"
      >
        Add subject
      </button>
    </form>
  );
}
