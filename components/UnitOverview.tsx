"use client";

import { useRef, useState } from "react";
import type { CurriculumUnit } from "@/lib/types";

export default function UnitOverview({
  unit,
  unitKey,
  pageImages,
  onPageImagesUploaded,
  onStartDiagnostic,
  onSkipToTeaching,
}: {
  unit: CurriculumUnit;
  unitKey: string;
  pageImages: string[];
  onPageImagesUploaded: (paths: string[]) => void;
  onStartDiagnostic: () => void;
  onSkipToTeaching: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("unitKey", unitKey);
    for (const file of Array.from(files)) formData.append("files", file);

    try {
      const res = await fetch("/api/pages/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Upload failed - please try again.");
      }
      const data = (await res.json()) as { saved: string[] };
      onPageImagesUploaded(data.saved);
      setUploadSuccess(
        data.saved.length === 1 ? "Added 1 photo below." : `Added ${data.saved.length} photos below.`
      );
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed - please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">What we&apos;re covering</h2>
        <p className="mt-1 text-sm text-slate-500">
          By the end of this unit, you&apos;ll be able to:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {unit.unit_mastery_checklist.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">The pages we&apos;re working from</h2>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "+ Add photos"}
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
        <p className="mt-1 text-xs text-slate-400">
          Tap &ldquo;+ Add photos&rdquo; to open your photo picker - choose one or more pages and they&apos;ll
          upload automatically, no extra confirm step needed.
        </p>

        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
        {uploadSuccess && <p className="mt-2 text-sm text-green-600">✓ {uploadSuccess}</p>}

        {pageImages.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {pageImages.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`Textbook page ${i + 1} for ${unit.unit_title}`}
                className="w-full rounded-lg border border-slate-200 object-cover"
              />
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            No pages added yet - a parent can snap photos of this unit&apos;s textbook pages with &ldquo;+ Add
            photos&rdquo; above.
          </div>
        )}
      </div>

      <div className="rounded-xl border border-test-border bg-test-bg p-5">
        <h2 className="text-lg font-semibold">Before we start...</h2>
        <p className="mt-1 text-sm text-slate-600">
          Have you already covered some of this in class? A quick 3-question check tells us what to skip
          and what&apos;s worth reviewing - no pressure, it&apos;s just to save time.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onStartDiagnostic}
            className="rounded-lg bg-test-accent px-4 py-2 text-sm font-medium text-white"
          >
            Quick check: how much do I know?
          </button>
          <button
            type="button"
            onClick={onSkipToTeaching}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            Skip it, teach me from the start
          </button>
        </div>
      </div>
    </div>
  );
}
