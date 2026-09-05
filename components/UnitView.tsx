"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import WidgetDispatcher from './interactive/WidgetDispatcher';
import { getWidgetForConcept, type InteractiveWidget } from '@/lib/interactiveWidgets';
import type { CurriculumUnit, Concept, MasteryBand, TestQuestion } from '@/lib/types';
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

interface UnitViewProps {
  unit?: CurriculumUnit;
  unitKey?: string;
  initialPageImages?: string[];
  resourceGroups?: any[];
  diagnosticQuestions?: any[];
  contentPack?: any;
  latestTestAttempt?: LatestTestAttempt | null;
  nextUnit?: NextUnitInfo | null;
  previousUnitRecap?: PreviousUnitRecap | null;
  /** Real, persisted ConceptMastery coverage for this unit - not the old session-only local state. */
  masteredConceptKeys?: string[];
  /** "Our class has covered up to here" marker (lib/queries or the /api/unit-progress route) - see UnitOverview's control for setting it. */
  taughtUpToConceptKey?: string | null;
}

export function UnitView({
  unit,
  unitKey,
  initialPageImages = [],
  resourceGroups,
  diagnosticQuestions,
  contentPack,
  latestTestAttempt,
  nextUnit,
  previousUnitRecap,
  masteredConceptKeys = [],
  taughtUpToConceptKey = null,
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

  // Defaults collapsed on phone/tablet widths (checked once, client-side
  // only, so this never fights server-rendered markup) - the booklet stacks
  // above the chat below the `lg` breakpoint now, and a kid opening a
  // lesson on a phone should land straight on the conversation, not have to
  // scroll past a full-width page photo first.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsBookletCollapsed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [starCount, setStarCount] = useState(40);

  // Overview -> optional diagnostic -> lesson. Every unit lands on the
  // overview first (objectives, lesson list, real upload/extract, the
  // diagnostic-or-skip choice) instead of dropping straight into the chat -
  // see UnitOverview.tsx/UnitDiagnostic.tsx, which existed already but had
  // gone disconnected from routing entirely.
  const [screen, setScreen] = useState<'overview' | 'diagnostic' | 'lesson' | 'unit_complete'>('overview');
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
  // Real feedback (2026-09-05): the practice widget used to render the whole
  // time, "hanging separately at the bottom" even while Ezy was still
  // mid-explanation - a kid saw the activity before there was any reason to
  // touch it. Now gated on AvatarChat's own onReachedPractice callback,
  // which only fires once the explanation/checkpoints are actually done.
  const [readyForPractice, setReadyForPractice] = useState(false);

  const currentWidget = getWidgetForConcept(activeConceptId);
  const currentConcept = concepts.find((c) => c.concept_id === activeConceptId);
  const activeIdx = activeConcepts.findIndex((c) => c.id === activeConceptId);
  const hasNextConcept = activeIdx >= 0 && activeIdx < activeConcepts.length - 1;

  // Real, persisted coverage (ConceptMastery) plus anything just finished
  // this session (masteredConcepts, before the page next reloads) - either
  // one counts as "covered" for the sidebar checkmark and the readiness
  // gate below.
  const isConceptCovered = (conceptId: string) => masteredConcepts[conceptId] || masteredConceptKeys.includes(conceptId);
  const taughtUpToIndex = taughtUpToConceptKey
    ? activeConcepts.findIndex((c) => c.id === taughtUpToConceptKey)
    : -1;

  // Out-of-sequence readiness check (real feedback 2026-09-05): "when I
  // directly jump to a concept not sequentially, assess the student if he
  // is aware of the earlier concepts... else advise him to cover the
  // previous concepts". Skips the check for anything at or before the
  // taughtUpToConceptKey marker - a school's own pacing doesn't have to
  // match this unit's 1.1/1.2/1.3 order.
  const [readinessCheck, setReadinessCheck] = useState<{
    targetConceptId: string;
    skippedIds: string[];
    questions: Extract<TestQuestion, { type: 'multiple_choice' }>[];
    answers: Record<number, number>;
    result: 'pass' | 'fail' | null;
  } | null>(null);

  const handleConceptClick = (conceptId: string) => {
    const targetIdx = activeConcepts.findIndex((c) => c.id === conceptId);
    if (targetIdx <= activeIdx) {
      // Going back to review, or re-clicking the current one - always fine.
      setActiveConceptId(conceptId);
      return;
    }
    const skipped = activeConcepts
      .slice(0, targetIdx)
      .filter((c, idx) => !isConceptCovered(c.id) && idx > taughtUpToIndex)
      .map((c) => c.id);
    if (skipped.length === 0) {
      setActiveConceptId(conceptId);
      return;
    }
    const candidates = ((diagnosticQuestions as TestQuestion[] | undefined) ?? []).filter(
      (q): q is Extract<TestQuestion, { type: 'multiple_choice' }> =>
        q.type === 'multiple_choice' && skipped.includes(q.concept_tested)
    );
    if (candidates.length === 0) {
      // Nothing to actually check them on - let them through rather than
      // block on a check that can't be run.
      setActiveConceptId(conceptId);
      return;
    }
    setReadinessCheck({
      targetConceptId: conceptId,
      skippedIds: skipped,
      questions: candidates.slice(0, 3),
      answers: {},
      result: null,
    });
  };

  const submitReadinessCheck = () => {
    if (!readinessCheck) return;
    const correct = readinessCheck.questions.filter((q, i) => readinessCheck.answers[i] === q.correct_answer).length;
    const pass = correct / readinessCheck.questions.length >= 0.6;
    setReadinessCheck({ ...readinessCheck, result: pass ? 'pass' : 'fail' });
    if (pass) {
      setTimeout(() => {
        setActiveConceptId(readinessCheck.targetConceptId);
        setReadinessCheck(null);
      }, 1200);
    }
  };

  // Sync the booklet's reference page and reset widget state whenever the
  // active concept changes - AvatarChat owns its own teaching/speech state
  // internally and resets that itself when its `concept` prop changes.
  useEffect(() => {
    const concept = concepts.find((c) => c.concept_id === activeConceptId);
    setActivePage(concept?.book_pages?.[0] || 1);
    setCurrentSelection(null);
    setIsCorrectSelection(null);
    setWidgetCompleted(false);
    setReadyForPractice(false);
  }, [activeConceptId, concepts]);

  const handleWidgetAttempt = (correct: boolean) => {
    setIsCorrectSelection(correct);
  };

  // Bounds-checked so both the widget's own "Mark finished" button and
  // AvatarChat's onAdvanceConcept can call this safely - on the unit's last
  // concept it now lands on the 'unit_complete' screen (quick revision +
  // "take the unit test" CTA, real feedback 2026-09-05: "after finishing a
  // unit, quick revision points and ask for a unit test") instead of
  // silently doing nothing (AvatarChat still hides its own "Next part"
  // button there, since onAdvanceConcept is undefined on the last concept -
  // this only fires from the widget's "Mark finished" button in that case).
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
    } else {
      setScreen('unit_complete');
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
        latestTestAttempt={latestTestAttempt}
        nextUnit={nextUnit}
        previousUnitRecap={previousUnitRecap}
        taughtUpToConceptKey={taughtUpToConceptKey}
      />
    );
  }

  if (screen === 'unit_complete' && unit) {
    const revisionByConcept = concepts
      .map((c) => ({ concept: c, points: (c.key_points?.length ? c.key_points : c.tips_to_remember) || [] }))
      .filter((entry) => entry.points.length > 0);

    return (
      <div className="mx-auto grid w-full max-w-3xl gap-6 p-4 sm:p-6">
        <div className="rounded-3xl border-2 border-[#9c6f1f]/20 bg-gradient-to-br from-[#9c6f1f]/10 to-[#f4f6f1] p-6 text-center shadow-sm sm:p-8">
          <span className="text-4xl sm:text-5xl">🏆</span>
          <h1 className="mt-3 font-serif text-xl font-black text-[#16241f] sm:text-2xl">
            You&apos;ve finished every lesson in this unit!
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#16241f]/70">
            Take a moment to skim the quick revision below, then take the unit test whenever you&apos;re ready -
            no rush.
          </p>
        </div>

        {revisionByConcept.length > 0 && (
          <div className="rounded-2xl border border-[#16241f]/10 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-base font-black text-[#16241f] sm:text-lg">🧠 Quick revision</h2>
            <p className="mt-1 text-xs text-[#16241f]/50">The key points from every lesson in this unit, in one place.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {revisionByConcept.map(({ concept, points }) => (
                <div key={concept.concept_id} className="rounded-xl border border-[#16241f]/5 bg-[#f4f6f1] p-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#9c6f1f]">
                    {concept.concept_id} {concept.concept_name}
                  </p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-[#16241f]/80">
                    {points.slice(0, 4).map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={`/test/${unitKey}`}
            className="flex flex-col items-center justify-center rounded-2xl border border-test-border bg-test-bg px-5 py-4 text-center shadow-sm transition hover:brightness-105"
          >
            <span className="text-2xl">🎯</span>
            <span className="mt-1 text-sm font-bold text-test-accent">Take the Unit Test</span>
            <span className="mt-0.5 text-xs text-test-accent/70">Pick your own difficulty - easy, moderate, or tough</span>
          </Link>
          <button
            onClick={() => setScreen('overview')}
            className="flex flex-col items-center justify-center rounded-2xl border border-[#16241f]/15 bg-white px-5 py-4 text-center shadow-sm transition hover:bg-[#16241f]/5"
          >
            <span className="text-2xl">📖</span>
            <span className="mt-1 text-sm font-bold text-[#16241f]">Back to unit overview</span>
            <span className="mt-0.5 text-xs text-[#16241f]/50">Revisit any lesson before testing</span>
          </button>
        </div>

        {nextUnit && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-800">
            When you&apos;re ready, <strong>Unit {nextUnit.title}</strong> is up next - the unit overview page will
            let you know if it&apos;s best to move on or brush up first, based on how the test goes.
          </div>
        )}
      </div>
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
    <div className="flex flex-col lg:flex-row w-full lg:h-[calc(100vh-3rem)] bg-[#f4f6f1] lg:overflow-hidden text-[#16241f] font-sans">
      {/* COLUMN 1: SIDEBAR NAVIGATION. Full-width block on mobile (stacked
          above the booklet/chat, concept list height-capped so it doesn't
          dominate the screen) rather than a fixed 256px column - that column
          used to render at phone width too, since nothing here had a
          breakpoint at all (real gap: "responsive for different devices and
          resolutions"). */}
      <aside className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-[#16241f]/10 bg-white flex flex-col shadow-sm">
        <div className="p-4 border-b border-[#16241f]/10 bg-[#16241f]/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👦</span>
            <div>
              <h2 className="font-serif text-sm font-bold text-[#16241f] sm:text-base">Viban Gopinath</h2>
              <p className="text-[10px] text-[#16241f]/60 font-semibold tracking-wide uppercase sm:text-xs">
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
            className="w-full py-2 bg-[#9c6f1f] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#9c6f1f]/90 transition-all shadow-sm text-center"
          >
            🧠 Quick brush-up (Prep Plan)
          </Link>
        </div>

        <div className="max-h-64 lg:max-h-none lg:flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#16241f]/40 tracking-wider">
              {unit?.unit_title || "Unit"}
            </span>
            <div className="mt-2 space-y-1">
              {activeConcepts.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => handleConceptClick(concept.id)}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left text-xs sm:text-sm transition-all border ${
                    activeConceptId === concept.id
                      ? 'bg-[#16241f] text-white border-[#16241f] shadow-md font-bold'
                      : 'bg-transparent text-[#16241f] border-transparent hover:bg-[#16241f]/5 hover:border-[#16241f]/10'
                  }`}
                >
                  <span className="truncate">{concept.title}</span>
                  {isConceptCovered(concept.id) ? (
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
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#16241f]/20 text-[#16241f]/60 hover:text-[#16241f] hover:border-[#16241f]/40 transition-all font-sans font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
          >
            📖 Unit overview &amp; textbook pages
          </button>
        </div>
      </aside>

      {/* COLUMN 2: TEXTBOOK BOOKLET PANEL. Conditionally mounted (not just
          CSS-collapsed) so "hidden" actually means zero height on the
          mobile stacked layout too, not just zero width - a width-only
          collapse left an invisible full-height sliver when this row
          stacks instead of sitting beside the others. */}
      {!isBookletCollapsed && (
        <main className="relative flex flex-col shrink-0 border-b lg:border-b-0 lg:border-r border-[#16241f]/10 bg-white w-full lg:w-[360px]">
          <div className="p-3.5 border-b border-[#16241f]/10 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-2">
              <span className="text-lg">📖</span>
              <span className="font-serif text-[#16241f] text-xs sm:text-sm font-black tracking-tight">
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
                    className="w-full h-full object-contain select-none pointer-events-none"
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
      )}

      {/* COLUMN 3: EZY'S CONVERSATION - explanation, checks, and the widget all
          share one scrolling thread instead of the widget sitting in a
          separate panel above a small chat box (ledger item 2). min-w-0
          (not min-w-[380px], the flex default is min-w-auto which refuses to
          shrink below content size) is the standard flexbox fix that stops a
          long unbroken line from forcing the whole page into horizontal
          scroll on a narrow phone - a real, reproducible bug the old fixed
          min-width caused below ~380px viewports. */}
      <section className="flex-1 min-w-0 flex flex-col bg-[#f4f6f1] lg:overflow-hidden relative">
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

        {/* max-w-3xl mx-auto keeps chat text at a readable line length on a
            wide monitor now that the 3-column layout can stretch much wider
            (AppShell's `wide` mode) - without this, a one-sentence reply
            would stretch edge-to-edge across 1000+px of column 3. */}
        <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {currentConcept ? (
            <AvatarChat
              key={activeConceptId}
              unitKey={unitKey || ''}
              concept={currentConcept}
              onAdvanceConcept={hasNextConcept ? handleNextConcept : undefined}
              onReachedPractice={() => setReadyForPractice(true)}
              hideSourceImage={!isBookletCollapsed}
              hideIllustration
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-[#16241f]/40">
              <span className="text-4xl mb-2">🦘</span>
              <p className="text-xs font-bold">Ezy is preparing this lesson...</p>
            </div>
          )}

          {/* The widget is Ezy's practice activity for this concept - only
              shown once AvatarChat says it's actually reached that point
              (onReachedPractice), not the whole time. Real feedback
              (2026-09-05): it used to render unconditionally and "hang
              separately at the bottom" while Ezy was still mid-explanation. */}
          {currentWidget && readyForPractice && (
            <div className="flex gap-3 max-w-[92%] mr-auto w-full animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-[#9c6f1f]/15 flex items-center justify-center text-md flex-shrink-0 border border-[#9c6f1f]/10 shadow-sm">
                🦘
              </div>
              <div className="flex-1 min-w-0">
                <p className="mb-1.5 text-xs font-sans font-bold text-[#16241f]">
                  🎯 Time to practise! Read it aloud if that helps, then give it a try.
                </p>
                <button
                  onClick={speakWidgetAloud}
                  className="mb-1.5 flex items-center gap-1 text-[10px] font-sans font-bold text-[#9c6f1f] hover:underline"
                >
                  🔊 Hear this activity
                </button>
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
          )}
        </div>
        </div>
      </section>

      {/* Out-of-sequence readiness check - real feedback 2026-09-05: "assess
          the student if he is aware of the earlier concepts... else advise
          him to cover the previous concepts and come back." */}
      {readinessCheck && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#f4f6f1] rounded-3xl border-2 border-[#16241f]/10 max-w-lg w-full shadow-2xl overflow-hidden p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🤔</span>
              <div>
                <h3 className="font-serif font-black text-lg text-[#16241f]">Quick check before you jump ahead</h3>
                <span className="text-[10px] uppercase font-bold text-[#9c6f1f]">
                  You&apos;re skipping {readinessCheck.skippedIds.length} concept{readinessCheck.skippedIds.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#16241f]/70 mb-4">
              Let&apos;s make sure the earlier bits are solid first - answer these, then you&apos;re free to move on.
            </p>

            <div className="space-y-4">
              {readinessCheck.questions.map((q, qi) => (
                <div key={qi} className="rounded-xl border border-[#16241f]/10 bg-white p-3">
                  <p className="text-xs font-bold text-[#16241f] mb-2">{q.question}</p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        disabled={readinessCheck.result !== null}
                        onClick={() =>
                          setReadinessCheck({ ...readinessCheck, answers: { ...readinessCheck.answers, [qi]: oi } })
                        }
                        className={`w-full text-left px-3 py-1.5 rounded-lg border text-xs transition-all ${
                          readinessCheck.answers[qi] === oi
                            ? 'border-[#16241f] bg-[#16241f] text-white font-bold'
                            : 'border-[#16241f]/10 bg-[#f4f6f1] hover:border-[#16241f]/30'
                        } disabled:opacity-60`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {readinessCheck.result === 'fail' && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                💡 A few of these need another look. It&apos;s worth going back and covering the earlier concepts
                first - but it&apos;s your call.
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setActiveConceptId(readinessCheck.skippedIds[0]);
                      setReadinessCheck(null);
                    }}
                    className="rounded-lg bg-[#9c6f1f] px-3 py-1.5 text-white font-bold"
                  >
                    Review earlier concepts first
                  </button>
                  <button
                    onClick={() => {
                      setActiveConceptId(readinessCheck.targetConceptId);
                      setReadinessCheck(null);
                    }}
                    className="rounded-lg border border-amber-300 px-3 py-1.5 text-amber-800"
                  >
                    Continue anyway
                  </button>
                </div>
              </div>
            )}
            {readinessCheck.result === 'pass' && (
              <p className="mt-4 text-xs font-bold text-emerald-600">✅ Nice - you&apos;ve got it. Moving on...</p>
            )}

            {readinessCheck.result === null && (
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setReadinessCheck(null)}
                  className="text-[10px] text-[#16241f]/50 hover:underline"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReadinessCheck}
                  disabled={Object.keys(readinessCheck.answers).length < readinessCheck.questions.length}
                  className="rounded-lg bg-[#16241f] px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
                >
                  Check my answers
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const UnitContentPack = UnitView;
export default UnitView;
