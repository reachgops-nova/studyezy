"use client";

import { useEffect, useRef, useState } from "react";
import type { CurriculumUnit, TestQuestion } from "@/lib/types";
import type { ResourceGroup } from "@/lib/queries/unitResources";
import AvatarChat from "./AvatarChat";
import UnitOverview from "./UnitOverview";
import UnitDiagnostic from "./UnitDiagnostic";
import VocabPractice from "./VocabPractice";
import Booklet from "./Booklet";

type Stage = "overview" | "warmup" | "diagnostic" | "lesson";

export interface UnitContentPack {
  packId: string;
  status: string;
  questionsCount: number;
}

export default function UnitView({
  unit,
  unitKey,
  initialPageImages,
  resourceGroups,
  diagnosticQuestions,
  contentPack,
}: {
  unit: CurriculumUnit;
  unitKey: string;
  initialPageImages: string[];
  resourceGroups: ResourceGroup[];
  diagnosticQuestions: TestQuestion[];
  contentPack: UnitContentPack | null;
}) {
  const [stage, setStage] = useState<Stage>("overview");
  const [selectedId, setSelectedId] = useState(unit.concepts[0]?.concept_id);
  const [pageImages, setPageImages] = useState(initialPageImages);
  const [docExpanded, setDocExpanded] = useState(true);
  // The textbook pane sitting beside the lesson chat. Open by default: the
  // whole point (2026-08-30) is that a kid mid-conversation can look back at
  // the story or the instructions without leaving the lesson, which they
  // previously could not do at all - the booklet only existed on the unit
  // overview and warm-up screens.
  const [bookOpen, setBookOpen] = useState(true);
  const loggedLessonStart = useRef(false);

  // Honest engagement signal (not a comprehension check - see
  // lib/worksheetGate.ts) that unlocks the worksheet banner and, later, the
  // formal test - fires once per mount the first time the lesson is reached.
  useEffect(() => {
    if (stage !== "lesson" || loggedLessonStart.current) return;
    loggedLessonStart.current = true;
    fetch("/api/interaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unitKey, eventType: "lesson_started" }),
    }).catch(() => {});
  }, [stage, unitKey]);
  // Where to land once the warm-up is done/skipped - captured at the moment
  // the kid picks "diagnostic" vs "skip to teaching" on the overview screen,
  // since the warm-up sits in front of both paths (2026-08-20: "before
  // starting every session" - not just one entry point).
  const [afterWarmup, setAfterWarmup] = useState<() => void>(() => () => {});
  const selected = unit.concepts.find((c) => c.concept_id === selectedId);
  const selectedIndex = unit.concepts.findIndex((c) => c.concept_id === selectedId);
  const nextConcept = selectedIndex >= 0 ? unit.concepts[selectedIndex + 1] : undefined;

  // Which booklet page belongs to the concept being taught right now.
  // Concept.sourceImagePath is the exact same served path the booklet lists,
  // so an indexOf is a real match, not a heuristic - verified against every
  // concept in English Units 1 and 2. -1 simply means this concept uses an
  // illustration rather than a scanned page, and the booklet is left alone.
  const conceptImagePath = selected?.media?.source_image_path;
  const conceptPageIndex = conceptImagePath ? pageImages.indexOf(conceptImagePath) : -1;
  const hasBook = pageImages.length > 0;
  const bookVisible = hasBook && bookOpen;

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
            <Booklet
              images={pageImages}
              alt={(i) => `Textbook page ${i + 1} for ${unit.unit_title}`}
              className="mt-3"
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
    <div className="grid gap-6">
      {contentPack && contentPack.status === "clean" && contentPack.questionsCount > 0 && (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-soft">
          <div className="flex items-center justify-between gap-3 p-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                {unit.unit_title} - the real textbook, right here
              </h2>
              <p className="text-xs text-slate-500">
                The actual unit pages, matching what&apos;s taught in class - read through it, then try the workbook
                below. Each attempt draws a fresh set of questions from this unit, so it&apos;s worth doing more than
                once.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={`/learn/${unitKey}/worksheet/${contentPack.packId}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gradient-to-br from-brand-gold-bright to-brand-gold px-4 py-2 text-xs font-medium text-white transition active:scale-95"
              >
                Practise this unit&apos;s workbook
              </a>
              <button
                type="button"
                onClick={() => setDocExpanded((v) => !v)}
                className="rounded-full border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                {docExpanded ? "Collapse" : "Expand"}
              </button>
            </div>
          </div>
          {docExpanded && (
            <iframe
              src={`/learn/${unitKey}/worksheet/${contentPack.packId}`}
              title={`${unit.unit_title} textbook and worksheet`}
              className="h-[70vh] w-full rounded-b-2xl border-t border-slate-100"
            />
          )}
        </div>
      )}

      {/* The lesson "desk": concept list, the real textbook, and the chat.
          Three columns from xl up (where there is genuinely room for all
          three); below that the textbook stacks above the chat in the same
          column rather than squeezing the conversation into a sliver. */}
      <div
        className={
          bookVisible
            ? "grid gap-5 md:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[200px_minmax(0,0.42fr)_minmax(0,0.58fr)]"
            : "grid gap-5 md:grid-cols-[200px_minmax(0,1fr)]"
        }
      >
      <nav className="grid content-start gap-1">
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
              c.concept_id === selectedId ? "bg-brand-ink text-white" : "hover:bg-slate-100"
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
        {hasBook && (
          <button
            type="button"
            onClick={() => setBookOpen((v) => !v)}
            aria-expanded={bookVisible}
            className="mt-3 rounded-xl border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {bookVisible ? "Hide textbook" : "Open textbook"}
          </button>
        )}
      </nav>

      {bookVisible && (
        <aside className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft xl:sticky xl:top-4 xl:self-start">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Your textbook</h2>
              <p className="text-xs text-slate-500">
                Flip back or forward any time - this is the real book.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBookOpen(false)}
              className="shrink-0 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50"
            >
              Hide
            </button>
          </div>
          <Booklet
            images={pageImages}
            alt={(i) => `Textbook page ${i + 1} for ${unit.unit_title}`}
            syncToIndex={conceptPageIndex >= 0 ? conceptPageIndex : undefined}
            className="mt-3"
          />
        </aside>
      )}

      {selected && (
        <div className="grid content-start gap-2">
          {selected.story_reference && (
            <p className="text-xs uppercase tracking-wide text-slate-400">
              From: {selected.story_reference.title}
            </p>
          )}
          <AvatarChat
            key={selected.concept_id}
            unitKey={unitKey}
            concept={selected}
            onAdvanceConcept={nextConcept ? () => setSelectedId(nextConcept.concept_id) : undefined}
            // The booklet beside this chat is already showing this exact
            // page, at full size - repeating it as a small cropped thumbnail
            // inside the conversation is pure duplication.
            hideSourceImage={bookVisible && conceptPageIndex >= 0}
          />
        </div>
      )}
      </div>
    </div>
  );
}
