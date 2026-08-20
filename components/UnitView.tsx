"use client";

import { useState } from "react";
import type { CurriculumUnit, TestQuestion } from "@/lib/types";
import type { ResourceGroup } from "@/lib/queries/unitResources";
import AvatarChat from "./AvatarChat";
import UnitOverview from "./UnitOverview";
import UnitDiagnostic from "./UnitDiagnostic";
import VocabPractice from "./VocabPractice";
import ImageLightbox from "./ImageLightbox";

type Stage = "overview" | "warmup" | "diagnostic" | "lesson";

export default function UnitView({
  unit,
  unitKey,
  initialPageImages,
  resourceGroups,
  diagnosticQuestions,
}: {
  unit: CurriculumUnit;
  unitKey: string;
  initialPageImages: string[];
  resourceGroups: ResourceGroup[];
  diagnosticQuestions: TestQuestion[];
}) {
  const [stage, setStage] = useState<Stage>("overview");
  const [selectedId, setSelectedId] = useState(unit.concepts[0]?.concept_id);
  const [pageImages, setPageImages] = useState(initialPageImages);
  // Where to land once the warm-up is done/skipped - captured at the moment
  // the kid picks "diagnostic" vs "skip to teaching" on the overview screen,
  // since the warm-up sits in front of both paths (2026-08-20: "before
  // starting every session" - not just one entry point).
  const [afterWarmup, setAfterWarmup] = useState<() => void>(() => () => {});
  const selected = unit.concepts.find((c) => c.concept_id === selectedId);

  if (stage === "overview") {
    return (
      <UnitOverview
        unit={unit}
        unitKey={unitKey}
        pageImages={pageImages}
        resourceGroups={resourceGroups}
        onPageImagesUploaded={(newPaths) => setPageImages((prev) => [...prev, ...newPaths])}
        onStartDiagnostic={() => {
          setAfterWarmup(() => () => setStage("diagnostic"));
          setStage("warmup");
        }}
        onSkipToTeaching={(conceptId) => {
          setAfterWarmup(() => () => {
            if (conceptId) setSelectedId(conceptId);
            setStage("lesson");
          });
          setStage("warmup");
        }}
      />
    );
  }

  if (stage === "warmup") {
    return (
      <div className="grid gap-4">
        {pageImages.length > 0 && (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold">Here&apos;s what we&apos;re learning from</h2>
            <p className="mt-1 text-sm text-slate-500">
              The actual textbook page{pageImages.length > 1 ? "s" : ""} for this unit - tap to zoom in and read it
              clearly.
            </p>
            <ImageLightbox
              images={pageImages}
              alt={(i) => `Textbook page ${i + 1} for ${unit.unit_title}`}
              className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3"
              imgClassName="w-full rounded-xl border border-slate-200 object-contain bg-slate-50"
            />
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold">Quick warm-up</h2>
          <p className="text-sm text-slate-500">A few words to get your brain going before we start.</p>
        </div>
        <VocabPractice onContinue={afterWarmup} continueLabel="Start" />
      </div>
    );
  }

  if (stage === "diagnostic") {
    return (
      <UnitDiagnostic
        unit={unit}
        unitKey={unitKey}
        questions={diagnosticQuestions}
        onReviewConcept={(conceptId) => {
          setSelectedId(conceptId);
          setStage("lesson");
        }}
        onAllMastered={() => setStage("lesson")}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <nav className="grid gap-1">
        <button
          onClick={() => setStage("overview")}
          className="mb-2 rounded-xl px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-400 hover:text-slate-600"
        >
          &larr; Unit overview
        </button>
        {unit.concepts.map((c) => (
          <button
            key={c.concept_id}
            onClick={() => setSelectedId(c.concept_id)}
            className={`rounded-xl px-3 py-2 text-left text-sm ${
              c.concept_id === selectedId ? "bg-brand-navy text-white" : "hover:bg-slate-100"
            }`}
          >
            {c.concept_id} {c.concept_name}
          </button>
        ))}
        {unit.remaining_unit_outline.map((c) => (
          <div
            key={c.concept_id}
            className="rounded-xl px-3 py-2 text-left text-sm text-slate-400"
            title="Not built yet"
          >
            {c.concept_id} {c.concept_name} <span className="text-[10px] uppercase">soon</span>
          </div>
        ))}
      </nav>

      {selected && (
        <div className="grid gap-2">
          {selected.story_reference && (
            <p className="text-xs uppercase tracking-wide text-slate-400">
              From: {selected.story_reference.title}
            </p>
          )}
          <AvatarChat key={selected.concept_id} unitKey={unitKey} concept={selected} />
        </div>
      )}
    </div>
  );
}
