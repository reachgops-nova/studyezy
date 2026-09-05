"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import WidgetDispatcher from './interactive/WidgetDispatcher';
import { getWidgetForConcept, type InteractiveWidget } from '@/lib/interactiveWidgets';
import type { CurriculumUnit, Concept } from '@/lib/types';
import UnitOverview from './UnitOverview';
import UnitDiagnostic from './UnitDiagnostic';
import AvatarChat from './AvatarChat';
import { getSavedRate, getSavedVoiceName } from './VoicePicker';

// Builds one spoken string for a widget's instructions + main content, since
// none of the 9 widget components read their own text aloud (real gap
// reported live - a kid could see the clue sentence/scenario but never hear
// it, unlike every other piece of the lesson). Kept here rather than inside
// each widget so new widget kinds just need one more switch case, not a
// speech implementation each.
function getWidgetSpokenText(widget: InteractiveWidget): string {
  const parts: string[] = [widget.title, widget.instruction];
  switch (widget.spec.kind) {
    case 'clue_detective':
      parts.push(widget.spec.sentence);
      break;
    case 'fact_opinion':
      parts.push(widget.spec.statements[0]?.text ?? '');
      break;
    case 'sentence_train':
      parts.push(`${widget.spec.leftCarriage}. ${widget.spec.rightCarriage}.`);
      break;
    case 'predictive_brancher':
      parts.push(widget.spec.scenario);
      break;
    case 'biography_scanner':
      parts.push(widget.spec.passage.map((p) => p.text).join(''));
      break;
    case 'prefix_machine':
      if (widget.spec.challenges[0]) parts.push(`First word: ${widget.spec.challenges[0].root}`);
      break;
    // trait_matcher, idiom_connector, life_mountain: the instruction alone
    // already describes the task; their content is a shuffled list rather
    // than a passage, so reading it aloud in a fixed order would give away
    // (or contradict) the shuffle.
  }
  return parts.filter(Boolean).join('. ');
}

interface UnitViewProps {
  unit?: CurriculumUnit;
  unitKey?: string;
  initialPageImages?: string[];
  resourceGroups?: any[];
  diagnosticQuestions?: any[];
  contentPack?: any;
}

export function UnitView({
  unit,
  unitKey,
  initialPageImages = [],
  resourceGroups,
  diagnosticQuestions,
  contentPack
}: UnitViewProps) {
  const concepts = unit?.concepts || [];
  const activeConcepts = concepts.map((c: Concept) => ({
    id: c.concept_id,
    title: c.concept_name,
    page: c.book_pages?.[0] || 1,
  }));

  const [activeConceptId, setActiveConceptId] = useState<string>(activeConcepts[0]?.id || '1.1');
  const [activePage, setActivePage] = useState(activeConcepts[0]?.page || 1);
  const [isBookletCollapsed, setIsBookletCollapsed] = useState(false);
  const [starCount, setStarCount] = useState(40);

  // Overview -> optional diagnostic -> lesson. Every unit lands on the
  // overview first (objectives, lesson list, real upload/extract, the
  // diagnostic-or-skip choice) instead of dropping straight into the chat -
  // see UnitOverview.tsx/UnitDiagnostic.tsx, which existed already but had
  // gone disconnected from routing entirely.
  const [screen, setScreen] = useState<'overview' | 'diagnostic' | 'lesson'>('overview');
  const [pageImages, setPageImages] = useState<string[]>(initialPageImages);

  const handleStartDiagnostic = () => setScreen('diagnostic');
  const handleSkipToTeaching = (conceptId?: string) => {
    if (conceptId) setActiveConceptId(conceptId);
    setScreen('lesson');
  };
  const handleReviewConcept = (conceptId: string) => {
    setActiveConceptId(conceptId);
    setScreen('lesson');
  };
  const handleAllMastered = () => setScreen('lesson');
  const handlePageImagesUploaded = (paths: string[]) => setPageImages((prev) => [...prev, ...paths]);

  const [currentSelection, setCurrentSelection] = useState<'fact' | 'opinion' | null>(null);
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(null);
  // Distinct from isCorrectSelection (which only fact_opinion's onAttempt ever
  // sets) - real bug found live 2026-09-05: every other widget kind only
  // calls onSuccess, never onAttempt, so the "mark finished" button below
  // never appeared for 8 of the app's 9 widget kinds and a kid could not
  // advance past them at all. This is set from onSuccess directly instead.
  const [widgetCompleted, setWidgetCompleted] = useState(false);
  const [masteredConcepts, setMasteredConcepts] = useState<Record<string, boolean>>({});

  const currentWidget = getWidgetForConcept(activeConceptId);
  const currentConcept = concepts.find((c) => c.concept_id === activeConceptId);
  const activeIdx = activeConcepts.findIndex((c) => c.id === activeConceptId);
  const hasNextConcept = activeIdx >= 0 && activeIdx < activeConcepts.length - 1;

  // Sync the booklet's reference page and reset widget state whenever the
  // active concept changes - AvatarChat owns its own teaching/speech state
  // internally and resets that itself when its `concept` prop changes.
  useEffect(() => {
    const concept = concepts.find((c) => c.concept_id === activeConceptId);
    setActivePage(concept?.book_pages?.[0] || 1);
    setCurrentSelection(null);
    setIsCorrectSelection(null);
    setWidgetCompleted(false);
  }, [activeConceptId, concepts]);

  const handleWidgetAttempt = (correct: boolean) => {
    setIsCorrectSelection(correct);
  };

  // Bounds-checked so both the widget's own "Mark finished" button and
  // AvatarChat's onAdvanceConcept can call this safely - on the unit's last
  // concept it just marks mastery without moving (AvatarChat itself hides
  // its "Next part" button then, since onAdvanceConcept is undefined).
  //
  // This is also the one place a concept's completion gets reported to the
  // spaced-repetition backend (ConceptMastery/nextReviewDue, see
  // lib/recordMastery.ts and lib/queries/prepPlanner.ts) - real gap found
  // live 2026-09-05: that system was fully built (Prep Plan page, mastery
  // bands, review scheduling) but nothing in the live lesson screen ever
  // called it, so it never had real data to work from. Reuses
  // /api/widget-practice's existing "practice_widget" attempt type - a
  // fire-and-forget signal that's real evidence but capped below "mastered"
  // (a real progression test still owns that), whether this concept had an
  // interactive widget or was explanation-only.
  const handleNextConcept = () => {
    setMasteredConcepts((prev) => ({ ...prev, [activeConceptId]: true }));
    if (unitKey) {
      fetch('/api/widget-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitKey, conceptKey: activeConceptId, correct: 1, total: 1 }),
      }).catch(() => {});
    }
    setCurrentSelection(null);
    setIsCorrectSelection(null);
    setWidgetCompleted(false);
    const idx = activeConcepts.findIndex((c) => c.id === activeConceptId);
    if (idx < activeConcepts.length - 1) {
      setActiveConceptId(activeConcepts[idx + 1].id);
    }
  };

  const speakWidgetAloud = () => {
    if (!currentWidget || typeof window === 'undefined' || !window.speechSynthesis) return;
    const text = getWidgetSpokenText(currentWidget);
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const savedName = getSavedVoiceName();
    const voice = savedName ? window.speechSynthesis.getVoices().find((v) => v.name === savedName) : null;
    if (voice) utterance.voice = voice;
    utterance.rate = getSavedRate();
    window.speechSynthesis.speak(utterance);
  };

  const pageIndex = Math.max(0, activePage - 1);
  const pageImage = pageImages[pageIndex] || null;

  if (screen === 'overview' && unit) {
    return (
      <UnitOverview
        unit={unit}
        unitKey={unitKey || ''}
        pageImages={pageImages}
        resourceGroups={resourceGroups || []}
        onPageImagesUploaded={handlePageImagesUploaded}
        onStartDiagnostic={handleStartDiagnostic}
        onSkipToTeaching={handleSkipToTeaching}
      />
    );
  }

  if (screen === 'diagnostic' && unit) {
    return (
      <UnitDiagnostic
        unit={unit}
        unitKey={unitKey || ''}
        questions={diagnosticQuestions || []}
        onReviewConcept={handleReviewConcept}
        onAllMastered={handleAllMastered}
      />
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#f4f6f1] overflow-hidden text-[#16241f] font-sans">
      {/* COLUMN 1: SIDEBAR NAVIGATION */}
      <aside className="w-64 shrink-0 border-r border-[#16241f]/10 bg-white flex flex-col shadow-sm">
        <div className="p-4 border-b border-[#16241f]/10 bg-[#16241f]/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👦</span>
            <div>
              <h2 className="font-serif text-sm font-bold text-[#16241f]">Viban Gopinath</h2>
              <p className="text-[10px] text-[#16241f]/60 font-semibold tracking-wide uppercase">
                {unit?.curriculum || "Cambridge Primary"} • Stage {unit?.grade_stage || 5}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#9c6f1f]/10 px-2 py-1 rounded-full border border-[#9c6f1f]/20">
            <span className="text-xs">⭐</span>
            <span className="text-xs font-black text-[#9c6f1f]">{starCount}</span>
          </div>
        </div>

        <div className="p-3.5 border-b border-[#16241f]/10 bg-[#9c6f1f]/5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#9c6f1f] tracking-wider">Before your next test</span>
            <span className="w-2 h-2 rounded-full bg-[#9c6f1f] animate-ping" />
          </div>
          {/* Real Prep Plan (lib/queries/prepPlanner.ts), not the old fake
              hardcoded 3-option quiz - pulls the actual concepts this kid's
              ConceptMastery marks due for review, ranked by urgency. */}
          <Link
            href="/plan"
            className="w-full py-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold hover:bg-[#9c6f1f]/90 transition-all shadow-sm text-center"
          >
            🧠 Quick brush-up (Prep Plan)
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#16241f]/40 tracking-wider">
              {unit?.unit_title || "Unit"}
            </span>
            <div className="mt-2 space-y-1">
              {activeConcepts.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => setActiveConceptId(concept.id)}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left text-xs transition-all border ${
                    activeConceptId === concept.id
                      ? 'bg-[#16241f] text-white border-[#16241f] shadow-md font-bold'
                      : 'bg-transparent text-[#16241f] border-transparent hover:bg-[#16241f]/5 hover:border-[#16241f]/10'
                  }`}
                >
                  <span className="truncate">{concept.title}</span>
                  {masteredConcepts[concept.id] ? (
                    <span className="text-emerald-500 font-bold ml-1">✓</span>
                  ) : (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans font-bold ${
                      activeConceptId === concept.id ? 'bg-white/20' : 'bg-[#16241f]/5 text-[#16241f]/60'
                    }`}>
                      p.{concept.page}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#16241f]/10 bg-white">
          <button
            onClick={() => setScreen('overview')}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#16241f]/20 text-[#16241f]/60 hover:text-[#16241f] hover:border-[#16241f]/40 transition-all font-sans font-bold text-xs flex items-center justify-center gap-1.5"
          >
            📖 Unit overview &amp; textbook pages
          </button>
        </div>
      </aside>

      {/* COLUMN 2: TEXTBOOK BOOKLET PANEL */}
      {/* Fixed px rather than a % of the row: this page renders inside
          AppShell's max-w-6xl content area, which (once AppShell's own lg:
          sidebar is showing) leaves this 3-column layout only ~900px total -
          a % width here was squeezing COLUMN 3's interactive widget down to
          ~170px, wrapping its text one word per line. A fixed cap keeps the
          booklet reasonably sized and guarantees the widget column its
          min-width below instead. */}
      <main className={`transition-all duration-500 relative flex flex-col shrink-0 border-r border-[#16241f]/10 bg-white ${
        isBookletCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-[300px] opacity-100'
      }`}>
        <div className="p-3.5 border-b border-[#16241f]/10 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="text-lg">📖</span>
            <span className="font-serif text-[#16241f] text-xs font-black tracking-tight">
              {unit?.subject || "Cambridge English"} (Stage {unit?.grade_stage || 5})
            </span>
          </div>
          <button
            onClick={() => setIsBookletCollapsed(true)}
            className="p-1 px-2.5 rounded-lg border border-[#16241f]/15 hover:bg-[#16241f]/5 text-[#16241f]/70 hover:text-[#16241f] font-sans font-bold text-[10px] transition-all"
          >
            Hide Book ✖
          </button>
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between bg-gray-50/70 relative">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-[#16241f] text-white px-3 py-1 rounded-full text-[9px] font-sans font-bold tracking-wider uppercase shadow-md">
            Textbook Reference • Page {activePage}
          </div>

          <div className="flex-1 flex items-center justify-center py-4">
            <div className="aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden border-2 border-[#16241f]/15 shadow-xl relative bg-white group hover:border-[#9c6f1f]/40 transition-all duration-300">
              {pageImage ? (
                <img
                  src={pageImage}
                  alt={`Booklet Page ${activePage}`}
                  className="w-full h-full object-cover select-none pointer-events-none filter brightness-95"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#f4f6f1] text-[#16241f]/30 text-xs font-bold">
                  No page image uploaded yet
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#16241f]/5 shadow-sm">
            <button
              onClick={() => setActivePage(prev => Math.max(1, prev - 1))}
              disabled={activePage === 1}
              className="px-3 py-1.5 rounded-lg border border-[#16241f]/15 hover:bg-[#16241f]/5 font-sans font-bold text-[10px] disabled:opacity-30 transition-all text-[#16241f]"
            >
              ⬅ Prev Page
            </button>
            <span className="text-[10px] font-sans font-black uppercase tracking-wider text-[#16241f]/50">
              Ref page: <strong className="text-[#16241f]">{activePage}</strong>
            </span>
            <button
              onClick={() => setActivePage(prev => prev + 1)}
              disabled={activePage >= initialPageImages.length}
              className="px-3 py-1.5 rounded-lg border border-[#16241f]/15 hover:bg-[#16241f]/5 font-sans font-bold text-[10px] transition-all text-[#16241f] disabled:opacity-30"
            >
              Next Page ➡
            </button>
          </div>
        </div>
      </main>

      {/* COLUMN 3: EZY'S CONVERSATION - explanation, checks, and the widget all
          share one scrolling thread instead of the widget sitting in a
          separate panel above a small chat box (ledger item 2). */}
      <section className="flex-1 min-w-[380px] flex flex-col bg-[#f4f6f1] overflow-hidden relative">
        {isBookletCollapsed && (
          <div className="p-3 bg-white border-b border-[#16241f]/10 flex items-center justify-between">
            <span className="text-xs font-serif font-black text-[#16241f]">Sourced from Page {activePage}</span>
            <button
              onClick={() => setIsBookletCollapsed(false)}
              className="text-xs font-bold text-[#9c6f1f] hover:underline flex items-center gap-1.5 animate-bounce"
            >
              📖 Open Textbook Page Reference
            </button>
          </div>
        )}

        <div className="px-4 py-2 border-b border-[#16241f]/5 bg-gray-50 flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#16241f]/60">
            Ezy the Kangaroo Live Voice Session
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentConcept ? (
            <AvatarChat
              key={activeConceptId}
              unitKey={unitKey || ''}
              concept={currentConcept}
              onAdvanceConcept={hasNextConcept ? handleNextConcept : undefined}
              hideSourceImage={!isBookletCollapsed}
              hideIllustration
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-[#16241f]/40">
              <span className="text-4xl mb-2">🦘</span>
              <p className="text-xs font-bold">Ezy is preparing this lesson...</p>
            </div>
          )}

          {/* The widget is Ezy's practice activity for this concept, after the
              conversation above teaches it - "Hear this activity" covers the
              real gap where widget text (clue sentences, scenarios...) was
              never read aloud, unlike every other piece of the lesson. */}
          <div className="flex gap-3 max-w-[92%] mr-auto w-full">
            <div className="w-8 h-8 rounded-full bg-[#9c6f1f]/15 flex items-center justify-center text-md flex-shrink-0 border border-[#9c6f1f]/10 shadow-sm">
              🦘
            </div>
            <div className="flex-1 min-w-0">
              {currentWidget && (
                <button
                  onClick={speakWidgetAloud}
                  className="mb-1.5 flex items-center gap-1 text-[10px] font-sans font-bold text-[#9c6f1f] hover:underline"
                >
                  🔊 Hear this activity
                </button>
              )}
              <div className="w-full min-h-[280px] flex items-center justify-center">
                <WidgetDispatcher
                  conceptId={activeConceptId}
                  unitKey={unitKey || ""}
                  conceptTested={activeConceptId}
                  isCorrect={isCorrectSelection}
                  currentSelection={currentSelection}
                  onAttempt={handleWidgetAttempt}
                  onSuccess={() => {
                    setStarCount((prev) => prev + 10);
                    setWidgetCompleted(true);
                  }}
                />
              </div>

              {widgetCompleted && (
                <div className="w-full max-w-md mx-auto mt-2 animate-bounce">
                  <button
                    onClick={handleNextConcept}
                    className="w-full py-3 bg-[#9c6f1f] hover:bg-[#9c6f1f]/90 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                  >
                    ✅ Mark finished &amp; continue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export const UnitContentPack = UnitView;
export default UnitView;
