"use client";

import React, { useState, useEffect, useRef } from 'react';
import WidgetDispatcher from './interactive/WidgetDispatcher';

interface Message {
  id: string;
  sender: 'ezy' | 'student';
  text: string;
  timestamp: string;
  isAction?: boolean;
}

// Textbook page mappings for active visual widgets
const CONCEPT_MAPPINGS: Record<string, { page: number; title: string; widgetId: string; unitKey: string; sequence: number; defaultStatement?: string }> = {
  '1.2': { page: 5, title: "Implicit Meaning (Jo's Face)", widgetId: "jo-wink", unitKey: "fiction-fables", sequence: 1, defaultStatement: "Jo winked at Charlie and grinned as she placed the chewing gum." },
  '1.7': { page: 10, title: "Fact vs. Opinion", widgetId: "1.7", unitKey: "fiction-fables", sequence: 2, defaultStatement: "The sun rises early in the morning" },
  '1.9': { page: 15, title: "Sentence Types & Connectors", widgetId: "1.9", unitKey: "fiction-fables", sequence: 3, defaultStatement: "The magpies loved the warmth [?] the wombats missed their cool burrows." },
  '2.1': { page: 26, title: "Features of a Biography", widgetId: "biography-scan", unitKey: "nonfiction-biography", sequence: 4, defaultStatement: "Poorna Malavath, the youngest girl to climb Mount Everest." },
  '2.5': { page: 38, title: "Prefixes & Suffixes", widgetId: "prefix-suffix-machine", unitKey: "nonfiction-biography", sequence: 5, defaultStatement: "Add prefix to 'happy' to make it opposite." },
  '4.1': { page: 61, title: "Our Watery World (Water Cycle)", widgetId: "droppy-water-cycle", unitKey: "nonfiction-explanation", sequence: 6, defaultStatement: "Oceans recycle rain through evaporation." },
};

const FACT_OPINION_STATEMENTS = [
  { text: "The sun rises early in the morning", isFact: true, pageRef: 10 },
  { text: "Hyena is kinder than Cockerel", isFact: false, pageRef: 10 },
  { text: "Cockerel didn't have a care in the world", isFact: true, pageRef: 6 },
  { text: "Fables date back thousands of years", isFact: true, pageRef: 5 },
  { text: "Malawi is the most beautiful country", isFact: false, pageRef: 10 },
];

interface UnitViewProps {
  unit?: any;
  unitKey?: string;
  initialPageImages?: string[];
  resourceGroups?: any[];
  diagnosticQuestions?: any[];
  contentPack?: any;
}

/**
 * StudyEzy Visual Layout Canvas (Split-Desk 2.0)
 * Visually exquisite, adaptive layout with auto textbook page flipping, Spaced brain brush-ups, 
 * and perfect compile safety for Next.js and Railway.
 */
export function UnitView({
  unit,
  unitKey,
  initialPageImages = [],
  resourceGroups,
  diagnosticQuestions,
  contentPack
}: UnitViewProps) {
  // Safe mapping of dynamic concepts
  const activeConcepts = (unit?.concepts || [
    { id: '1.2', title: "1.2 Implicit Meaning (Jo's Face)", page: 5 },
    { id: '1.7', title: "1.7 Fact vs. Opinion", page: 10 },
    { id: '1.9', title: "1.9 Sentence Train Connectors", page: 15 },
    { id: '2.1', title: "2.1 Biography Features", page: 26 },
    { id: '2.5', title: "2.5 Prefix Suffix Gears", page: 38 },
    { id: '4.1', title: "4.1 Explanation: Water Cycle", page: 61 },
  ]).map((c: any) => ({
    id: c.id || '1.7',
    title: c.title || c.name || "Fact vs. Opinion",
    page: c.pageNumber || c.page || 10,
  }));

  // State: active concept and synced textbook booklet
  const [activeConceptId, setActiveConceptId] = useState<string>('1.7');
  const [activePage, setActivePage] = useState(10);
  const [isBookletCollapsed, setIsBookletCollapsed] = useState(false);
  const [starCount, setStarCount] = useState(40);
  
  // State-machine states: 'intro' | 'play_example' | 'challenge' | 'reassess' | 'complete'
  const [lessonState, setLessonState] = useState<'intro' | 'play_example' | 'challenge' | 'reassess' | 'complete'>('intro');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  
  // Game values
  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);
  const [activeStatement, setActiveStatement] = useState(FACT_OPINION_STATEMENTS[0].text);
  const [currentSelection, setCurrentSelection] = useState<'fact' | 'opinion' | null>(null);
  const [isCorrectSelection, setIsCorrectSelection] = useState<boolean | null>(null);
  
  // Gamified Warm-up & Review States
  const [showWarmup, setShowWarmup] = useState(false);
  const [masteredConcepts, setMasteredConcepts] = useState<Record<string, boolean>>({
    '1.2': true, // Mock completed previously
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync activePage whenever activeConceptId changes
  useEffect(() => {
    const mapping = CONCEPT_MAPPINGS[activeConceptId] || { page: 10, defaultStatement: "The sun rises early in the morning" };
    if (mapping) {
      setActivePage(mapping.page);
      setActiveStatement(mapping.defaultStatement || "");
      setCurrentSelection(null);
      setIsCorrectSelection(null);
      setLessonState('intro');
    }
  }, [activeConceptId]);

  // Handle conversational loop state transitions
  useEffect(() => {
    dispatchState();
  }, [lessonState, activeConceptId]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*🎉💡⚖️🚂💭🔍➡️]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onstart = () => setIsVoiceSpeaking(true);
      utterance.onend = () => setIsVoiceSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const dispatchState = async () => {
    const userId = "student_viban";
    try {
      const response = await fetch('/api/lesson-dispatcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          conceptId: activeConceptId,
          currentState: lessonState,
          isCorrectSelection: isCorrectSelection,
        }),
      });

      if (!response.ok) return;
      const data = await response.json();

      const newMessage: Message = {
        id: Math.random().toString(),
        sender: 'ezy',
        text: data.ezyResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory(prev => {
        // Prevent duplicate intro additions
        if (lessonState === 'intro' && prev.some(m => m.text === data.ezyResponse)) return prev;
        return [...prev, newMessage];
      });

      speakText(data.ezyResponse);
    } catch (err) {
      console.error("Failed to connect with lesson-dispatcher state machine:", err);
    }
  };

  // Student makes a choice on the visual playground widget
  const handleWidgetSelection = (selection: 'fact' | 'opinion') => {
    if (lessonState === 'complete') return;
    setCurrentSelection(selection);
    
    const currentFactCheck = FACT_OPINION_STATEMENTS[currentStatementIndex];
    const correct = (selection === 'fact' && currentFactCheck.isFact) || (selection === 'opinion' && !currentFactCheck.isFact);
    setIsCorrectSelection(correct);

    const actionMessage: Message = {
      id: Math.random().toString(),
      sender: 'student',
      text: `Selected "${selection.toUpperCase()}" for statement: "${currentFactCheck.text}"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAction: true,
    };
    setChatHistory(prev => [...prev, actionMessage]);

    if (correct) {
      setIsCorrectSelection(true);
      setStarCount(prev => prev + 10);
      setLessonState('challenge');
    } else {
      setIsCorrectSelection(false);
      setLessonState('reassess');
    }
  };

  const handleNextStatement = () => {
    if (currentStatementIndex < FACT_OPINION_STATEMENTS.length - 1) {
      const nextIdx = currentStatementIndex + 1;
      setCurrentStatementIndex(nextIdx);
      setActiveStatement(FACT_OPINION_STATEMENTS[nextIdx].text);
      setCurrentSelection(null);
      setIsCorrectSelection(null);
      setLessonState('play_example');
    } else {
      setMasteredConcepts(prev => ({ ...prev, [activeConceptId]: true }));
      setLessonState('complete');
    }
  };

  const startWarmup = () => {
    setShowWarmup(true);
    speakText("Ready for our 60-second Spaced Brain Brush-up? Let's check what we remember from Implicit Meanings before we weigh facts and opinions!");
  };

  // Fetch scanned booklet page images dynamically if available, otherwise fallback
  const pageIndex = Math.max(0, activePage - 1);
  const pageImage = (initialPageImages && initialPageImages.length > pageIndex)
    ? initialPageImages[pageIndex]
    : `https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA3L3JvYm90X3BsYXlpbmdfd2l0aF9raWRzX2luc3BpcmVkX2J5X3BpeGFyX3N0eWxlX2ExX2Y5YTUzYWNlLWY0NzctNGRmYi1hMjZmLWU0NDMyYTZjYzg4Ni5qcGc.jpg`;

  return (
    <div className="flex h-screen w-full bg-[#f4f6f1] overflow-hidden text-[#16241f] font-sans">
      
      {/* COLUMN 1: COLLAPSIBLE CHECKLIST NAVIGATION SIDEBAR */}
      <aside className="w-72 border-r border-[#16241f]/10 bg-white flex flex-col shadow-sm">
        {/* Profile Card / Gamification Header */}
        <div className="p-4 border-b border-[#16241f]/10 bg-[#16241f]/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👦</span>
            <div>
              <h2 className="font-serif text-sm font-bold text-[#16241f]">Viban Gopinath</h2>
              <p className="text-[10px] text-[#16241f]/60 font-semibold tracking-wide uppercase">Cambridge Primary • Stage 5</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#9c6f1f]/10 px-2 py-1 rounded-full border border-[#9c6f1f]/20">
            <span className="text-xs">⭐</span>
            <span className="text-xs font-black text-[#9c6f1f]">{starCount}</span>
          </div>
        </div>

        {/* Spaced-Repetition Warm-up Block */}
        <div className="p-3.5 border-b border-[#16241f]/10 bg-[#9c6f1f]/5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#9c6f1f] tracking-wider">Spaced repetition Warm-up</span>
            <span className="w-2 h-2 rounded-full bg-[#9c6f1f] animate-ping" />
          </div>
          <p className="text-xs text-[#16241f]/70 leading-relaxed font-medium">
            Your 2-week brush-up sequence is ready!
          </p>
          <button 
            onClick={startWarmup}
            className="w-full py-2 bg-[#9c6f1f] text-white rounded-xl text-xs font-bold hover:bg-[#9c6f1f]/90 transition-all shadow-sm"
          >
            🧠 Start 60s Brush-up
          </button>
        </div>

        {/* Textbook Units Checklist Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#16241f]/40 tracking-wider">
              {unit?.title || "Unit 1: Fiction Stories"}
            </span>
            <div className="mt-2 space-y-1">
              {activeConcepts.map((concept: any) => (
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
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans font-bold ${activeConceptId === concept.id ? 'bg-white/20' : 'bg-[#16241f]/5 text-[#16241f]/60'}`}>
                      p.{concept.page}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Textbook Upload Button */}
        <div className="p-4 border-t border-[#16241f]/10 bg-white">
          <button className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#16241f]/20 text-[#16241f]/60 hover:text-[#16241f] hover:border-[#16241f]/40 transition-all font-sans font-bold text-xs flex items-center justify-center gap-1.5">
            📂 Upload Any Textbook PDF
          </button>
        </div>
      </aside>

      {/* COLUMN 2: CENTER TEXTBOOK BOOKLET PANEL (Aspect-Locked 3/4) */}
      <main className={`transition-all duration-500 relative flex flex-col border-r border-[#16241f]/10 bg-white ${
        isBookletCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-[42%] opacity-100'
      }`}>
        <div className="p-3.5 border-b border-[#16241f]/10 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="text-lg">📖</span>
            <span className="font-serif text-[#16241f] text-xs font-black tracking-tight">
              {unit?.subject?.name || "Hodder Cambridge Primary English"} (Stage 5)
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
            Textbook Reference • Page {activePage} of 22
          </div>

          <div className="flex-1 flex items-center justify-center py-4">
            <div className="aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden border-2 border-[#16241f]/15 shadow-xl relative bg-white group hover:border-[#9c6f1f]/40 transition-all duration-300">
              <img
                src={pageImage}
                alt={`Booklet Page ${activePage}`}
                className="w-full h-full object-cover select-none pointer-events-none filter brightness-95"
              />
              
              {activeConceptId === '1.7' && (
                <div className="absolute top-[52%] left-[4%] right-[4%] h-[32%] bg-[#9c6f1f]/10 border-2 border-[#9c6f1f] rounded-lg animate-pulse pointer-events-none flex items-start p-2">
                  <span className="bg-[#9c6f1f] text-white text-[8px] font-sans font-black uppercase px-1.5 py-0.5 rounded shadow">
                    Active Exercise 1 & 2
                  </span>
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
              className="px-3 py-1.5 rounded-lg border border-[#16241f]/15 hover:bg-[#16241f]/5 font-sans font-bold text-[10px] transition-all text-[#16241f]"
            >
              Next Page ➡
            </button>
          </div>
        </div>
      </main>

      {/* COLUMN 3: RIGHT INTERACTIVE WORKSPACE (Interactive Widget + Conversational Chat) */}
      <section className="flex-1 flex flex-col bg-[#f4f6f1] overflow-hidden relative">
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

        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="w-full flex-1 flex items-center justify-center my-2 min-h-[280px]">
            <WidgetDispatcher
              conceptId={activeConceptId}
              unitKey={CONCEPT_MAPPINGS[activeConceptId]?.unitKey || "fiction-fables"}
              statement={activeStatement}
              isCorrect={isCorrectSelection}
              currentSelection={currentSelection}
              onSelect={handleWidgetSelection}
              onAttempt={(correct) => {
                if (correct) {
                  setStarCount(prev => prev + 10);
                  setLessonState('challenge');
                } else {
                  setLessonState('reassess');
                }
              }}
            />
          </div>

          {isCorrectSelection && (
            <div className="w-full max-w-md mx-auto my-2 animate-bounce">
              <button
                onClick={handleNextStatement}
                className="w-full py-3 bg-[#9c6f1f] hover:bg-[#9c6f1f]/90 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2"
              >
                🎉 Next Example Challenge ➡️
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM PANEL: EZY'S CONVERSATIONAL CHAT SCREEN */}
        <div className="h-64 bg-white border-t border-[#16241f]/10 flex flex-col shadow-inner">
          <div className="px-4 py-2 border-b border-[#16241f]/5 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#16241f]/60">
                Ezy the Kangaroo Live Voice Session
              </span>
            </div>
            {isVoiceSpeaking && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-sans font-bold text-[#9c6f1f] animate-pulse">Ezy is speaking...</span>
                <span className="w-1.5 h-4 bg-[#9c6f1f] animate-scale-wave" />
                <span className="w-1.5 h-6 bg-[#9c6f1f] animate-scale-wave-delay" />
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
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-[#16241f]/5 bg-gray-50 flex gap-2">
            <button
              onClick={() => {
                const promptResponse = window.prompt("Type or talk back to Ezy:", "How does this help me Ezy?");
                if (promptResponse) {
                  const studentMessage: Message = {
                    id: Math.random().toString(),
                    sender: 'student',
                    text: promptResponse,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  };
                  setChatHistory(prev => [...prev, studentMessage]);
                  setLessonState('play_example');
                }
              }}
              className="flex-1 py-2.5 px-4 bg-white hover:bg-gray-100 rounded-xl border border-[#16241f]/10 text-xs font-sans text-left text-[#16241f]/60 hover:text-[#16241f] shadow-sm transition-all"
            >
              🎤 Tap to Talk back to Ezy... (Voice Mode Active)
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                  speakText(chatHistory[chatHistory.length - 1]?.text || "");
                }
              }}
              className="p-2.5 px-4 bg-[#9c6f1f]/10 hover:bg-[#9c6f1f]/20 text-[#9c6f1f] rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-[#9c6f1f]/20 shadow-sm"
              title="Repeat Ezy's voice"
            >
              🔊 Hear Clue
            </button>
          </div>
        </div>
      </section>

      {/* 🧠 DYNAMIC BRUSH-UP WARM-UP MODAL OVERLAY */}
      {showWarmup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#f4f6f1] rounded-3xl border-2 border-[#16241f]/10 max-w-md w-full shadow-2xl overflow-hidden animate-fade-in p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl animate-bounce">🧠</span>
              <div>
                <h3 className="font-serif font-black text-lg text-[#16241f]">Spaced repetitions Brush-up</h3>
                <span className="text-[10px] uppercase font-bold text-[#9c6f1f]">Daily 60-Second Challenge</span>
              </div>
            </div>
            
            <p className="text-xs text-[#16241f]/80 leading-relaxed mb-4">
              Awesome job learning Jo's facial meanings! Before we weigh down our scale with Unit 1.7 facts, what was Jo's feeling when she **winked and grinned**?
            </p>

            <div className="space-y-2.5">
              {[
                { text: "😜 Mischievous or playful", correct: true },
                { text: "😢 Sad and crying", correct: false },
                { text: "😡 Very angry", correct: false },
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (opt.correct) {
                      alert("🎉 Perfect! You mastered the Implicit Meaning brush-up. Earned +5 Stars!");
                      setStarCount(prev => prev + 5);
                      setShowWarmup(false);
                      setLessonState('intro');
                    } else {
                      alert("Whoops! Jo's wink is a mischievous expression. Try again!");
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

// Named alias to resolve TS2614 'UnitContentPack' errors in app/learn/[unitId]/page.tsx
export const UnitContentPack = UnitView;

export default UnitView;
