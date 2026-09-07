"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CurriculumUnit, MasteryBand } from "@/lib/types";
import type { ResourceGroup } from "@/lib/queries/unitResources";
import UnitResources from "./UnitResources";
import Booklet from "./Booklet";
import { Illustration, hasIllustration } from "./illustrations";

interface LatestTestAttempt {
  band: MasteryBand;
  scorePct: number;
  takenAt: string;
}

interface NextUnitInfo {
  unitKey: string;
  title: string;
}

interface PreviousUnitRecap {
  title: string;
  points: string[];
}

const BAND_COPY: Record<MasteryBand, { emoji: string; headline: string; tone: string }> = {
  mastered: { emoji: "🎉", headline: "Great result - you've got this unit down.", tone: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  needs_brush_up: { emoji: "💡", headline: "Close - a quick brush-up on a few concepts would help.", tone: "border-amber-200 bg-amber-50 text-amber-800" },
  needs_reteach: { emoji: "🔁", headline: "Worth revisiting a few concepts before moving on.", tone: "border-red-200 bg-red-50 text-red-800" },
};

export default function UnitOverview({
  unit,
  unitKey,
  pageImages,
  resourceGroups,
  onPageImagesUploaded,
  onStartDiagnostic,
  onSkipToTeaching,
  latestTestAttempt,
  nextUnit,
  previousUnitRecap,
  taughtUpToConceptKey,
}: {
  unit: CurriculumUnit;
  unitKey: string;
  pageImages: string[];
  resourceGroups: ResourceGroup[];
  onPageImagesUploaded: (paths: string[]) => void;
  onStartDiagnostic: () => void;
  onSkipToTeaching: (conceptId?: string) => void;
  latestTestAttempt?: LatestTestAttempt | null;
  nextUnit?: NextUnitInfo | null;
  previousUnitRecap?: PreviousUnitRecap | null;
  taughtUpToConceptKey?: string | null;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractSuccess, setExtractSuccess] = useState<string | null>(null);
  const [taughtUpTo, setTaughtUpTo] = useState(taughtUpToConceptKey ?? "");
  const [savingTaughtUpTo, setSavingTaughtUpTo] = useState(false);

  // "School might reserve certain concepts to be taught later, so kids can
  // mark till which concept within a unit was taught for our reference"
  // (real feedback 2026-09-05) - a manual claim about the SCHOOL's own
  // pacing, used by UnitView's out-of-sequence readiness check to exempt
  // concepts at or before this point.
  async function handleSaveTaughtUpTo(value: string) {
    setTaughtUpTo(value);
    setSavingTaughtUpTo(true);
    try {
      await fetch("/api/unit-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitKey, taughtUpToConceptKey: value || null }),
      });
      router.refresh();
    } finally {
      setSavingTaughtUpTo(false);
    }
  }

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
      {/* Adaptive "continue or not" decision (real feedback 2026-09-05: "you
          can decide if you continue or not depending on how the student is
          responding") - driven by the student's own latest TestAttempt on
          this unit, not a guess. Mastered -> point at the next unit if one
          exists; anything else -> point back at the concepts/Prep Plan
          instead of encouraging them to move on underprepared. */}
      {latestTestAttempt && (
        <div className={`rounded-2xl border p-5 shadow-soft ${BAND_COPY[latestTestAttempt.band].tone}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                {BAND_COPY[latestTestAttempt.band].emoji} {BAND_COPY[latestTestAttempt.band].headline}
              </p>
              <p className="mt-0.5 text-xs opacity-80">
                Last test: {latestTestAttempt.scorePct}% on {new Date(latestTestAttempt.takenAt).toLocaleDateString()}
              </p>
            </div>
            {latestTestAttempt.band === "mastered" && nextUnit ? (
              <Link
                href={`/learn/${nextUnit.unitKey}`}
                className="shrink-0 rounded-xl bg-gradient-to-br from-brand-gold-bright to-brand-gold px-4 py-2 text-sm font-medium text-white"
              >
                Continue to Unit {nextUnit.title} →
              </Link>
            ) : latestTestAttempt.band !== "mastered" ? (
              <Link
                href="/plan"
                className="shrink-0 rounded-xl border border-current px-4 py-2 text-sm font-medium"
              >
                Go to Prep Plan
              </Link>
            ) : null}
          </div>
        </div>
      )}

      {/* "While starting a unit, recollect main points from the previous unit
          and move forward" (real feedback 2026-09-05) - a <details> so it's
          there every visit without being repetitive after the first read. */}
      {previousUnitRecap && previousUnitRecap.points.length > 0 && (
        <details className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft" open>
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">🔁 Quick recap: {previousUnitRecap.title}</h2>
              <span className="text-xs text-slate-400 transition group-open:rotate-180">▾</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Before diving into this unit, here&apos;s what you covered last time.
            </p>
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {previousUnitRecap.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </details>
      )}

      {unit.unit_mastery_checklist?.items && unit.unit_mastery_checklist.items.length > 0 && (
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
      )}

      <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lessons in this unit</h2>
          <span className="text-xs font-medium text-slate-400">
            {unit.concepts.length} of {unit.concepts.length + unit.remaining_unit_outline.length} ready
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Shared with every {unit.grade_stage ? `Stage ${unit.grade_stage}` : ""} {unit.subject} student on{" "}
          {unit.curriculum} - not just yours.
        </p>
        <ul className="mt-3 grid gap-1.5">
          {unit.concepts.map((c) => {
            const illustrationKey = c.media?.illustration_key;
            const generatedUrl = c.media?.generated_illustration_url;
            const showIllustration = generatedUrl || (illustrationKey && hasIllustration(illustrationKey));
            return (
              <li key={c.concept_id}>
                <button
                  type="button"
                  onClick={() => onSkipToTeaching(c.concept_id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 transition hover:border-brand-ink-light hover:bg-white"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    {showIllustration && (
                      <span className="h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                        {generatedUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={generatedUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Illustration illustrationKey={illustrationKey!} />
                        )}
                      </span>
                    )}
                    <span className="truncate">
                      {c.concept_id} {c.concept_name}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-medium text-green-600">Ready</span>
                </button>
              </li>
            );
          })}
          {unit.remaining_unit_outline.map((c) => (
            <li
              key={c.concept_id}
              className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 px-3 py-2 text-sm text-slate-400"
            >
              <span>
                {c.concept_id} {c.concept_name}
              </span>
              <span className="text-xs uppercase">coming soon</span>
            </li>
          ))}
        </ul>

        {/* "School might reserve certain concepts to be taught later, so
            kids can mark till which concept was taught for our reference"
            (real feedback 2026-09-05) - a manual pacing marker, separate
            from what's actually been done in this app. */}
        {unit.concepts.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5">
            <label htmlFor="taught-up-to" className="text-xs text-slate-500">
              📌 Mark how far your class has covered this unit at school:
            </label>
            <select
              id="taught-up-to"
              value={taughtUpTo}
              disabled={savingTaughtUpTo}
              onChange={(e) => handleSaveTaughtUpTo(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
            >
              <option value="">Not marked</option>
              {unit.concepts.map((c) => (
                <option key={c.concept_id} value={c.concept_id}>
                  Up to {c.concept_id} {c.concept_name}
                </option>
              ))}
            </select>
          </div>
        )}
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
          <Booklet
            images={pageImages}
            alt={(i) => `Textbook page ${i + 1} for ${unit.unit_title}`}
            className="mt-3"
          />
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
            className="mt-3 rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 disabled:opacity-50"
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
            onClick={() => onSkipToTeaching()}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            Skip it, teach me from the start
          </button>
        </div>
      </div>
    </div>
  );
}
