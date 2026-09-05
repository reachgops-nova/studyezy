"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import WidgetDispatcher from './interactive/WidgetDispatcher';
import { getWidgetForConcept } from '@/lib/interactiveWidgets';
import type { CurriculumUnit, Concept } from '@/lib/types';
import UnitOverview from './UnitOverview';
import UnitDiagnostic from './UnitDiagnostic';

interface Message {
  id: string;
  sender: 'ezy' | 'student';
  text: string;
  timestamp: string;
  isAction?: boolean;
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

  const [lessonState, setLessonState] = useState<'intro' | 'play_example' | 'challenge' | 'reassess' | 'complete'>('intro');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [isTTSLoading, setIsTTSLoading] = useState(false);

  const [currentSelection, setCurrentSelection] = useState<'fact' | 'opinion' | null>(null);
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(null);

  const [showWarmup, setShowWarmup] = useState(false);
  const [masteredConcepts, setMasteredConcepts] = useState<Record<string, boolean>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentWidget = getWidgetForConcept(activeConceptId);
  const currentConcept = concepts.find((c) => c.concept_id === activeConceptId);

  // Sync activePage when concept changes
  useEffect(() => {
    const concept = concepts.find((c) => c.concept_id === activeConceptId);
    const page = concept?.book_pages?.[0] || 1;
    setActivePage(page);
    setCurrentSelection(null);
    setIsCorrectSelection(null);
    setLessonState('intro');

    // Add intro message
    if (concept?.definition) {
      const introMsg: Message = {
        id: Math.random().toString(),
        sender: 'ezy',
        text: `Let's learn about **${concept.concept_name}**! ${concept.definition}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory([introMsg]);
      speak(introMsg.text);
    }
  }, [activeConceptId, concepts]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Server-side TTS via ElevenLabs
  const speak = useCallback(async (text: string) => {
    if (!text) return;

    // Cancel any playing speech
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsTTSLoading(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      if (!res.ok) throw new Error('TTS failed');
      
      const { audioUrl } = await res.json();
      const audio = new Audio(audioUrl);
      audio.onplay = () => {
        setIsVoiceSpeaking(true);
        setIsTTSLoading(false);
      };
      audio.onended = () => setIsVoiceSpeaking(false);
      audio.onerror = () => {
        setIsVoiceSpeaking(false);
        setIsTTSLoading(false);
        fallbackSpeak(text);
      };
      await audio.play();
    } catch (err) {
      setIsTTSLoading(false);
      fallbackSpeak(text);
    }
  }, []);

  // Browser fallback TTS
  const fallbackSpeak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const cleanText = text.replace(/[*🎉💡⚖️🚂💭🔍➡️]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onstart = () => setIsVoiceSpeaking(true);
      utterance.onend = () => setIsVoiceSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const addMessage = (sender: 'ezy' | 'student', text: string, isAction?: boolean) => {
    const msg: Message = {
      id: Math.random().toString(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAction,
    };
    setChatHistory(prev => [...prev, msg]);
    return msg;
  };

  const handleWidgetAttempt = (correct: boolean) => {
    setIsCorrectSelection(correct);
    if (correct) {
      setStarCount(prev => prev + 10);
      setLessonState('challenge');
      addMessage('ezy', '🎉 Excellent! You got it right! +10 stars!', true);
    } else {
      setLessonState('reassess');
      addMessage('ezy', '💡 Not quite! Let me give you a hint...', true);
    }
  };

  const handleNextConcept = () => {
    const idx = activeConcepts.findIndex(c => c.id === activeConceptId);
    if (idx < activeConcepts.length - 1) {
      setMasteredConcepts(prev => ({ ...prev, [activeConceptId]: true }));
      setActiveConceptId(activeConcepts[idx + 1].id);
    } else {
      setMasteredConcepts(prev => ({ ...prev, [activeConceptId]: true }));
      setLessonState('complete');
      addMessage('ezy', '🏆 Amazing! You have mastered all concepts in this unit!', true);
    }
  };

  const startWarmup = () => {
    setShowWarmup(true);
    speak("Ready for our Spaced Brain Brush-up? Let's check what we remember!");
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
            <span className="text-[10px] uppercase font-bold text-[#9c6f1f] tracking-wider">Spaced Repetition Warm-up</span>
            <span className="w-2 h-2 rounded-full bg-[#9c6f1f] animate-ping" />
          </div>
          <button 
            onClick={startWarmup}
            className="w-full py-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold hover:bg-[#9c6f1f]/90 transition-all shadow-sm"
          >
            🧠 Start 60s Brush-up
          </button>
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

        <div className="px-4 py-2 border-b border-[#16241f]/5 bg-gray-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#16241f]/60">
              Ezy the Kangaroo Live Voice Session
            </span>
          </div>
          {isTTSLoading && (
            <span className="text-[9px] font-sans font-bold text-[#9c6f1f] animate-pulse">Ezy is loading voice...</span>
          )}
          {isVoiceSpeaking && !isTTSLoading && (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-sans font-bold text-[#9c6f1f] animate-pulse">Ezy is speaking...</span>
              <span className="w-1.5 h-4 bg-[#9c6f1f] animate-bounce" />
              <span className="w-1.5 h-6 bg-[#9c6f1f] animate-bounce" style={{ animationDelay: '0.1s' }} />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'student' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {msg.sender === 'ezy' ? (
                <div className="w-8 h-8 rounded-full bg-[#9c6f1f]/15 flex items-center justify-center text-md flex-shrink-0 border border-[#9c6f1f]/10 shadow-sm">
                  🦘
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#16241f]/10 flex items-center justify-center text-md flex-shrink-0 border border-[#16241f]/5 shadow-sm">
                  👦
                </div>
              )}

              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.isAction
                    ? 'bg-amber-100/50 border border-amber-200/50 text-[#9c6f1f] font-sans font-bold'
                    : msg.sender === 'student'
                    ? 'bg-[#16241f] text-white rounded-tr-none'
                    : 'bg-[#f4f6f1] text-[#16241f] border border-[#16241f]/5 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* The widget renders as Ezy's next turn in the same thread, not a
              separate panel - same avatar-led bubble layout as a message. */}
          <div className="flex gap-3 max-w-[92%] mr-auto w-full">
            <div className="w-8 h-8 rounded-full bg-[#9c6f1f]/15 flex items-center justify-center text-md flex-shrink-0 border border-[#9c6f1f]/10 shadow-sm">
              🦘
            </div>
            <div className="flex-1 min-w-0">
              <div className="w-full min-h-[280px] flex items-center justify-center">
                <WidgetDispatcher
                  conceptId={activeConceptId}
                  unitKey={unitKey || ""}
                  conceptTested={activeConceptId}
                  isCorrect={isCorrectSelection}
                  currentSelection={currentSelection}
                  onAttempt={handleWidgetAttempt}
                  onSuccess={() => {
                    setStarCount(prev => prev + 10);
                    setLessonState('challenge');
                  }}
                />
              </div>

              {isCorrectSelection && (
                <div className="w-full max-w-md mx-auto mt-2 animate-bounce">
                  <button
                    onClick={handleNextConcept}
                    className="w-full py-3 bg-[#9c6f1f] hover:bg-[#9c6f1f]/90 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                  >
                    🎉 Next Challenge ➡️
                  </button>
                </div>
              )}
            </div>
          </div>

          <div ref={chatEndRef} />
        </div>

        <div className="p-3 border-t border-[#16241f]/5 bg-gray-50 flex gap-2 shrink-0">
          <button
            onClick={() => {
              const promptResponse = window.prompt("Type or talk back to Ezy:", "How does this help me Ezy?");
              if (promptResponse) {
                addMessage('student', promptResponse);
                setLessonState('play_example');
              }
            }}
            className="flex-1 py-2.5 px-4 bg-white hover:bg-gray-100 rounded-xl border border-[#16241f]/10 text-xs font-sans text-left text-[#16241f]/60 hover:text-[#16241f] shadow-sm transition-all"
          >
            🎤 Tap to Talk back to Ezy...
          </button>
          <button
            onClick={() => {
              const lastEzy = chatHistory.filter(m => m.sender === 'ezy').pop();
              if (lastEzy) speak(lastEzy.text);
            }}
            className="p-2.5 px-4 bg-[#9c6f1f]/10 hover:bg-[#9c6f1f]/20 text-[#9c6f1f] rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-[#9c6f1f]/20 shadow-sm"
          >
            🔊 Hear Clue
          </button>
        </div>
      </section>

      {/* WARM-UP MODAL */}
      {showWarmup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#f4f6f1] rounded-3xl border-2 border-[#16241f]/10 max-w-md w-full shadow-2xl overflow-hidden p-6 animate-shake">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl animate-bounce">🧠</span>
              <div>
                <h3 className="font-serif font-black text-lg text-[#16241f]">Spaced Repetition Brush-up</h3>
                <span className="text-[10px] uppercase font-bold text-[#9c6f1f]">Daily 60-Second Challenge</span>
              </div>
            </div>
            
            <p className="text-xs text-[#16241f]/80 leading-relaxed mb-4">
              What was the main thing we learned in the last concept? Tap the correct answer!
            </p>

            <div className="space-y-2.5">
              {[
                { text: "✅ The correct answer from previous concept", correct: true },
                { text: "❌ A distractor answer", correct: false },
                { text: "❌ Another distractor", correct: false },
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (opt.correct) {
                      setStarCount(prev => prev + 5);
                      setShowWarmup(false);
                      addMessage('ezy', '🎉 Warm-up complete! +5 Stars!', true);
                    } else {
                      addMessage('ezy', '💡 Not quite! Try again.', true);
                    }
                  }}
                  className="w-full text-left p-3 rounded-xl border border-[#16241f]/10 bg-white hover:border-[#16241f] text-xs font-sans font-bold hover:bg-[#16241f]/5 transition-all flex items-center justify-between"
                >
                  <span>{opt.text}</span>
                  <span className="text-[#16241f]/40">➡️</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowWarmup(false)}
              className="w-full mt-4 text-[10px] text-[#16241f]/50 hover:underline text-center block font-sans"
            >
              Skip Warm-up and start Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const UnitContentPack = UnitView;
export default UnitView;
