"use client";

import type { CurriculumUnit } from "@/lib/types";

export default function UnitOverview({
  unit,
  onStartDiagnostic,
  onSkipToTeaching,
}: {
  unit: CurriculumUnit;
  onStartDiagnostic: () => void;
  onSkipToTeaching: () => void;
}) {
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
        <h2 className="text-lg font-semibold">The pages we&apos;re working from</h2>
        {unit.page_images && unit.page_images.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {unit.page_images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Textbook page ${i + 1} for ${unit.unit_title}`}
                className="w-full rounded-lg border border-slate-200 object-cover"
              />
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            Your scanned pages for this unit will appear here once added.
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
