"use client";

import { useRef, useState } from "react";

interface CoachingResult {
  technique_notes: string[];
  overall_note: string;
  marks_note: string;
}

export default function ExamCapture({ unitKey }: { unitKey: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pagePaths, setPagePaths] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState("");
  const [coaching, setCoaching] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);
  const [result, setResult] = useState<CoachingResult | null>(null);

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("unitKey", unitKey);
    formData.append("purpose", "exam_page");
    for (const file of Array.from(files)) formData.append("files", file);

    try {
      const res = await fetch("/api/pages/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Upload failed - please try again.");
      }
      const data = (await res.json()) as { saved: string[] };
      setPagePaths((prev) => [...prev, ...data.saved]);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed - please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function getFeedback() {
    if (pagePaths.length === 0 || coaching) return;
    setCoaching(true);
    setCoachError(null);

    try {
      const res = await fetch("/api/exam/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitKey,
          pagePaths,
          timeSpentMinutes: timeSpent ? Number(timeSpent) : null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't read that paper right now - please try again.");
      }
      setResult((await res.json()) as CoachingResult);
    } catch (e) {
      setCoachError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setCoaching(false);
    }
  }

  if (result) {
    return (
      <div className="grid gap-4">
        <div className="rounded-xl border border-practice-border bg-practice-bg p-6">
          <h2 className="text-lg font-bold text-slate-800">How you wrote it</h2>
          <p className="mt-2 text-sm text-slate-700">{result.overall_note}</p>
          <ul className="mt-4 grid gap-2">
            {result.technique_notes.map((note, i) => (
              <li key={i} className="rounded-xl bg-white p-3 text-sm text-slate-700">
                {note}
              </li>
            ))}
          </ul>
        </div>
        {result.marks_note && (
          <p className="text-xs text-slate-400">
            <span className="font-medium uppercase tracking-wide">One more thing</span> - {result.marks_note}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Photograph each page</h2>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "+ Add pages"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
        </div>
        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}

        {pagePaths.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {pagePaths.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="Exam page" className="w-full rounded-xl border border-slate-200 object-cover" />
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            No pages added yet.
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          How many minutes did this take? (optional)
          <input
            type="number"
            min={0}
            value={timeSpent}
            onChange={(e) => setTimeSpent(e.target.value)}
            className="w-32 rounded-xl border border-slate-300 px-3 py-2 text-base"
          />
        </label>

        <button
          type="button"
          onClick={getFeedback}
          disabled={pagePaths.length === 0 || coaching}
          className="mt-4 rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 disabled:opacity-50"
        >
          {coaching ? "Reading your paper..." : "Get feedback"}
        </button>
        {coachError && <p className="mt-2 text-sm text-red-600">{coachError}</p>}
      </div>
    </div>
  );
}
