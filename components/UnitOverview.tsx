"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CurriculumUnit } from "@/lib/types";
import type { ResourceGroup } from "@/lib/queries/unitResources";
import UnitResources from "./UnitResources";

export default function UnitOverview({
  unit,
  unitKey,
  pageImages,
  resourceGroups,
  onPageImagesUploaded,
  onStartDiagnostic,
  onSkipToTeaching,
}: {
  unit: CurriculumUnit;
  unitKey: string;
  pageImages: string[];
  resourceGroups: ResourceGroup[];
  onPageImagesUploaded: (paths: string[]) => void;
  onStartDiagnostic: () => void;
  onSkipToTeaching: () => void;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractSuccess, setExtractSuccess] = useState<string | null>(null);

  async function handleExtract() {
    setExtracting(true);
    setExtractError(null);
    setExtractSuccess(null);

    try {
      const res = await fetch("/api/pages/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitKey }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't extract content - please try again.");
      }
      const data = (await res.json()) as { extracted: { concept_id: string; concept_name: string }[] };
      setExtractSuccess(
        data.extracted.length === 1
          ? `Added "${data.extracted[0].concept_name}".`
          : `Added ${data.extracted.length} new concepts.`
      );
      router.refresh();
    } catch (e) {
      setExtractError(e instanceof Error ? e.message : "Couldn't extract content - please try again.");
    } finally {
      setExtracting(false);
    }
  }

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
      <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
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

      <UnitResources unitKey={unitKey} groups={resourceGroups} />

      <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">The pages we&apos;re working from</h2>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
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
                className="w-full rounded-xl border border-slate-200 object-cover"
              />
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            No pages added yet - a parent can snap photos of this unit&apos;s textbook pages with &ldquo;+ Add
            photos&rdquo; above.
          </div>
        )}
      </div>

      {unit.remaining_unit_outline.length > 0 && (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Fill in the rest of the unit</h2>
          <p className="mt-1 text-sm text-slate-600">
            {pageImages.length > 0
              ? `${unit.remaining_unit_outline.length} concept${
                  unit.remaining_unit_outline.length === 1 ? "" : "s"
                } still marked "coming soon" - Ezy can read the uploaded pages and write the lesson content for whichever ones there's enough material for.`
              : "Add photos of this unit's remaining pages above, then come back here to fill in the rest of the unit automatically."}
          </p>
          <button
            type="button"
            onClick={handleExtract}
            disabled={extracting || pageImages.length === 0}
            className="mt-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 disabled:opacity-50"
          >
            {extracting ? "Reading the pages..." : "Extract lesson content from these pages"}
          </button>
          {extractError && <p className="mt-2 text-sm text-red-600">{extractError}</p>}
          {extractSuccess && <p className="mt-2 text-sm text-green-600">✓ {extractSuccess}</p>}
        </div>
      )}

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
            className="rounded-xl bg-test-accent px-4 py-2 text-sm font-medium text-white"
          >
            Quick check: how much do I know?
          </button>
          <button
            type="button"
            onClick={onSkipToTeaching}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            Skip it, teach me from the start
          </button>
        </div>
      </div>
    </div>
  );
}
