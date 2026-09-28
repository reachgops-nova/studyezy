"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export interface GenerateTermExamSubjectOption {
  id: string; // real Subject.id (cuid) - never a slug, which can repeat across curricula
  label: string; // "Cambridge Primary - Stage 4 - Cambridge Science"
  units: { id: string; number: number; title: string }[];
}

export default function GenerateTermExamForm({ subjects }: { subjects: GenerateTermExamSubjectOption[] }) {
  const router = useRouter();
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [selectedUnitIds, setSelectedUnitIds] = useState<Set<string>>(new Set());
  const [paperCount, setPaperCount] = useState(2);
  const [totalMarks, setTotalMarks] = useState(100);
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const subject = useMemo(() => subjects.find((s) => s.id === subjectId), [subjects, subjectId]);

  function toggleUnit(id: string) {
    setSelectedUnitIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectSubject(id: string) {
    setSubjectId(id);
    setSelectedUnitIds(new Set());
  }

  async function handleSubmit() {
    if (selectedUnitIds.size === 0) {
      setIsError(true);
      setMessage("Pick at least one unit for the portion.");
      return;
    }
    setBusy(true);
    setMessage(null);
    setIsError(false);

    try {
      const res = await fetch("/api/exams/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          unitIds: [...selectedUnitIds],
          paperCount,
          totalMarks,
          durationMinutes,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Couldn't generate terminal exam papers.");
      setMessage(`Generated ${body.paperIds?.length ?? paperCount} paper(s) as drafts - review and publish below.`);
      router.refresh();
    } catch (e) {
      setIsError(true);
      setMessage(e instanceof Error ? e.message : "Couldn't generate terminal exam papers.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
      <h2 className="font-semibold text-slate-800">Generate new papers</h2>
      <p className="mt-0.5 text-xs text-slate-500">
        Pick the subject and the portion (units) to cover. Papers are created as drafts with a separate answer key
        each - review both before publishing them for parents to see.
      </p>

      <div className="mt-3 grid gap-3">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Subject
          <select
            value={subjectId}
            onChange={(e) => selectSubject(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        {subject && (
          <div>
            <span className="text-sm font-medium text-slate-700">Portion (units to cover)</span>
            <div className="mt-1 grid gap-1.5 sm:grid-cols-2">
              {subject.units.map((u) => (
                <label key={u.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedUnitIds.has(u.id)}
                    onChange={() => toggleUnit(u.id)}
                    className="h-4 w-4"
                  />
                  Unit {u.number}: {u.title}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Papers
            <input
              type="number"
              min={1}
              max={4}
              value={paperCount}
              onChange={(e) => setPaperCount(Number(e.target.value))}
              className="w-24 rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Total marks
            <input
              type="number"
              min={10}
              max={200}
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value))}
              className="w-28 rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Duration (minutes)
            <input
              type="number"
              min={15}
              max={240}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-28 rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={busy || !subject}
          className="w-fit rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 disabled:opacity-50"
        >
          {busy ? "Generating (this can take a minute)..." : "Generate papers"}
        </button>

        {message && <p className={`text-sm ${isError ? "text-red-600" : "text-green-600"}`}>{message}</p>}
      </div>
    </div>
  );
}
