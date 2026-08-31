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

// Curriculum concept metadata mapped directly from physical Stage 5 Hodder English textbook
const CONCEPT_MAPPINGS: Record<string, { page: number; title: string; widgetId: string; unitKey: string; sequence: number; defaultStatement?: string }> = {
  '1.2': { page: 5, title: "Implicit Meaning (Jo's Face)", widgetId: "jo-wink", unitKey: "fiction-fables", sequence: 1, defaultStatement: "Jo winked at Charlie and grinned as she placed the chewing gum." },
  '1.7': { page: 10, title: "Fact vs. Opinion", widgetId: "1.7", unitKey: "fiction-fables", sequence: 2, defaultStatement: "The sun rises early in the morning" },
  '1.9': { page: 15, title: "Sentence Types & Connectors", widgetId: "1.9", unitKey: "fiction-fables", sequence: 3, defaultStatement: "The magpies loved the warmth [?] the wombats missed their cool burrows." },
  '2.1': { page: 26, title: "Features of a Biography", widgetId: "biography-scan", unitKey: "nonfiction-biography", sequence: 4, defaultStatement: "Poorna Malavath, the youngest girl to climb Mount Everest." },
  '2.5': { page: 38, title: "Prefixes & Suffixes", widgetId: "prefix-suffix-machine", unitKey: "nonfiction-biography", sequence: 5, defaultStatement: "Add prefix to 'happy' to make it opposite." },
  '4.1': { page: 61, title: "Our Watery World (Water Cycle)", widgetId: "droppy-water-cycle", unitKey: "nonfiction-explanation", sequence: 6, defaultStatement: "Oceans recycle rain through evaporation." },
};

// Statements sequence for Fact vs Opinion game
const FACT_OPINION_STATEMENTS = [\n  { text: "The sun rises early in the morning", isFact: true, pageRef: 10 },
  { text: "Hyena is kinder than Cockerel", isFact: false, pageRef: 10 },
  { text: "Cockerel didn't have a care in the world", isFact: true, pageRef: 6 },
  { text: "Fables date back thousands of years", isFact: true, pageRef: 5 },
  { text: "Malawi is the most beautiful country", isFact: false, pageRef: 10 },
];

export default function UnitView() {
  // State: active concept and synced textbook booklet
  const [activeConceptId, setActiveConceptId] = useState<'1.2' | '1.7' | '1.9' | '2.1' | '2.5' | '4.1'>('1.7');
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
  const [reviewMode, setReviewMode] = useState(false);
  const [masteredConcepts, setMasteredConcepts] = useState<Record<string, boolean>>({
    '1.2': true, // Mock completed previously
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync activePage whenever activeConceptId changes
  useEffect(() => {
    const mapping = CONCEPT_MAPPINGS[activeConceptId];
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
    // Check if browser/local storage has a user profile
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

      // Voice Ezy's instructions automatically
      speakText(data.ezyResponse);

    } catch (err) {
      console.error("Failed to connect with lesson-dispatcher state machine:", err);
    }
  };

  // Student makes a choice on the visual playground widget
  const handleWidgetSelection = (selection: 'fact' | 'opinion') => {
    if (lessonState === 'complete') return;

    setCurrentSelection(selection);
    
    // Check correctness based on physical textbook statements sequence
    const currentFactCheck = FACT_OPINION_STATEMENTS[currentStatementIndex];
    const correct = (selection === 'fact' && currentFactCheck.isFact) || (selection === 'opinion' && !currentFactCheck.isFact);
    
    setIsCorrectSelection(correct);

    // Push action log into chat history so the student sees their choice
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
      // Completed entire game track!
      setMasteredConcepts(prev => ({ ...prev, [activeConceptId]: true }));
      setLessonState('complete');
    }
  };

  const startWarmup = () => {
    setShowWarmup(true);
    speakText("Ready for our 60-second Spaced Brain Brush-up? Let's check what we remember from Implicit Meanings before we weigh facts and opinions!");
  };

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
          >\n            🧠 Start 60s Brush-up\n          </button>
        </div>

        {/* Textbook Units Checklist Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#16241f]/40 tracking-wider">Unit 1: Fiction Stories</span>
            <div className="mt-2 space-y-1">
              {[\n                { id: '1.2', title: "1.2 Implicit Meaning (Jo's Face)", page: 5 },
                { id: '1.7', title: '1.7 Fact vs. Opinion', page: 10 },
                { id: '1.9', title: '1.9 Sentence Train Connectors', page: 15 },
              ].map(concept => (
                <button
                  key={concept.id}
                  onClick={() => setActiveConceptId(concept.id as any)}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left text-xs transition-all border ${
                    activeConceptId === concept.id
                      ? 'bg-[#16241f] text-white border-[#16241f] shadow-md font-bold'
                      : 'bg-transparent text-[#16241f] border-transparent hover:bg-[#16241f]/5 hover:border-[#16241f]/10'
                  }`}
                >\n                  <span className="truncate">{concept.title}</span>\n                  {masteredConcepts[concept.id] ? (\n                    <span className="text-emerald-500 font-bold ml-1">✓</span>\n                  ) : (\n                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans font-bold ${activeConceptId === concept.id ? 'bg-white/20' : 'bg-[#16241f]/5 text-[#16241f]/60'}`}>\n                      p.{concept.page}\n                    </span>\n                  )}\n                </button>\n              ))}\n            </div>\n          </div>\n\n          <div>\n            <span className="text-[10px] uppercase font-bold text-[#16241f]/40 tracking-wider">Unit 2 & 4: Non-Fiction</span>\n            <div className="mt-2 space-y-1">\n              {[\n                { id: '2.1', title: '2.1 Biography Features', page: 26 },\n                { id: '2.5', title: '2.5 Prefix Suffix Gears', page: 38 },\n                { id: '4.1', title: '4.1 Explanation: Water Cycle', page: 61 },\n              ].map(concept => (\n                <button\n                  key={concept.id}\n                  onClick={() => setActiveConceptId(concept.id as any)}\n                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left text-xs transition-all border ${\n                    activeConceptId === concept.id\n                      ? 'bg-[#16241f] text-white border-[#16241f] shadow-md font-bold'\n                      : 'bg-transparent text-[#16241f] border-transparent hover:bg-[#16241f]/5 hover:border-[#16241f]/10'\n                  }`}\n                >\n                  <span className=\"truncate\">{concept.title}</span>\n                  {masteredConcepts[concept.id] ? (\n                    <span className=\"text-emerald-500 font-bold ml-1\">✓</span>\n                  ) : (\n                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans font-bold ${activeConceptId === concept.id ? 'bg-white/20' : 'bg-[#16241f]/5 text-[#16241f]/60'}`}>\n                      p.{concept.page}\n                    </span>\n                  )}\n                </button>\n              ))}\n            </div>\n          </div>\n        </div>\n\n        {/* Global Textbook Upload Button */}\n        <div className=\"p-4 border-t border-[#16241f]/10 bg-white\">\n          <button className=\"w-full py-2.5 rounded-xl border-2 border-dashed border-[#16241f]/20 text-[#16241f]/60 hover:text-[#16241f] hover:border-[#16241f]/40 transition-all font-sans font-bold text-xs flex items-center justify-center gap-1.5\">\n            📂 Upload Any Textbook PDF\n          </button>\n        </div>\n      </aside>\n\n      {/* COLUMN 2: CENTER TEXTBOOK BOOKLET PANEL (Aspect-Locked 3/4) */}\n      <main className={`transition-all duration-500 relative flex flex-col border-r border-[#16241f]/10 bg-white ${\n        isBookletCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-[42%] opacity-100'\n      }`}>\n        {/* Textbook Frame Header */}\n        <div className=\"p-3.5 border-b border-[#16241f]/10 flex items-center justify-between bg-white z-10\">\n          <div className=\"flex items-center gap-2\">\n            <span className=\"text-lg\">📖</span>\n            <span className=\"font-serif text-[#16241f] text-xs font-black tracking-tight\">\n              Hodder Cambridge Primary English (Stage 5)\n            </span>\n          </div>\n          <button\n            onClick={() => setIsBookletCollapsed(true)}\n            className=\"p-1 px-2.5 rounded-lg border border-[#16241f]/15 hover:bg-[#16241f]/5 text-[#16241f]/70 hover:text-[#16241f] font-sans font-bold text-[10px] transition-all\"\n          >\n            Hide Book ✖\n          </button>\n        </div>\n\n        {/* Physical Textbook Viewport */}\n        <div className=\"flex-1 p-5 flex flex-col justify-between bg-gray-50/70 relative\">\n          \n          {/* Sourced Reference Watermark */}\n          <div className=\"absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-[#16241f] text-white px-3 py-1 rounded-full text-[9px] font-sans font-bold tracking-wider uppercase shadow-md\">\n            Textbook Reference • Page {activePage} of 22\n          </div>\n\n          <div className=\"flex-1 flex items-center justify-center py-4\">\n            {/* The Aspect-Locked 3/4 Textbook Sheet Frame */}\n            <div className=\"aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden border-2 border-[#16241f]/15 shadow-xl relative bg-white group hover:border-[#9c6f1f]/40 transition-all duration-300\">\n              <img\n                src={`https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA3L3JvYm90X3BsYXlpbmdfd2l0aF9raWRzX2luc3BpcmVkX2J5X3BpeGFyX3N0eWxlX2ExX2Y5YTUzYWNlLWY0NzctNGRmYi1hMjZmLWU0NDMyYTZjYzg4Ni5qcGc.jpg`}\n                alt={`Booklet Page ${activePage}`}\n                className=\"w-full h-full object-cover select-none pointer-events-none filter brightness-95\"\n              />\n              \n              {/* Dynamic Overlay Box to show which exercise is highlighted on the page */}\n              {activeConceptId === '1.7' && (\n                <div className=\"absolute top-[52%] left-[4%] right-[4%] h-[32%] bg-[#9c6f1f]/10 border-2 border-[#9c6f1f] rounded-lg animate-pulse pointer-events-none flex items-start p-2\">\n                  <span className=\"bg-[#9c6f1f] text-white text-[8px] font-sans font-black uppercase px-1.5 py-0.5 rounded shadow\">\n                    Active Exercise 1 & 2\n                  </span>\n                </div>\n              )}\n            </div>\n          </div>\n\n          {/* Textbook Navigation Page Footer */}\n          <div className=\"flex items-center justify-between bg-white p-3 rounded-2xl border border-[#16241f]/5 shadow-sm\">\n            <button\n              onClick={() => setActivePage(prev => Math.max(1, prev - 1))}\n              disabled={activePage === 1}\n              className=\"px-3 py-1.5 rounded-lg border border-[#16241f]/15 hover:bg-[#16241f]/5 font-sans font-bold text-[10px] disabled:opacity-30 transition-all text-[#16241f]\"\n            >\n              ⬅ Prev Page\n            </button>\n            <span className=\"text-[10px] font-sans font-black uppercase tracking-wider text-[#16241f]/50\">\n              Ref page: <strong className=\"text-[#16241f]\">{activePage}</strong>\n            </span>\n            <button\n              onClick={() => setActivePage(prev => prev + 1)}\n              className=\"px-3 py-1.5 rounded-lg border border-[#16241f]/15 hover:bg-[#16241f]/5 font-sans font-bold text-[10px] transition-all text-[#16241f]\"\n            >\n              Next Page ➡\n            </button>\n          </div>\n        </div>\n      </main>\n\n      {/* COLUMN 3: RIGHT INTERACTIVE WORKSPACE (Interactive Widget + Conversational Chat) */}\n      <section className=\"flex-1 flex flex-col bg-[#f4f6f1] overflow-hidden relative\">\n        \n        {/* Toggler to restore Book Panel when hidden */}\n        {isBookletCollapsed && (\n          <div className=\"p-3 bg-white border-b border-[#16241f]/10 flex items-center justify-between\">\n            <span className=\"text-xs font-serif font-black text-[#16241f]\">Sourced from Page {activePage}</span>\n            <button\n              onClick={() => setIsBookletCollapsed(false)}\n              className=\"text-xs font-bold text-[#9c6f1f] hover:underline flex items-center gap-1.5 animate-bounce\"\n            >\n              📖 Open Textbook Page Reference\n            </button>\n          </div>\n        )}\n\n        {/* TOP PANEL: THE ANIMATED VISUAL PLAYGROUND CANVAS */}\n        <div className=\"flex-1 p-6 flex flex-col justify-between overflow-y-auto\">\n          <div className=\"w-full flex-1 flex items-center justify-center my-2 min-h-[280px]\">\n            {/* Active Widget loaded dynamically */}\n            <WidgetDispatcher\n              conceptId={activeConceptId}\n              unitKey={CONCEPT_MAPPINGS[activeConceptId]?.unitKey || \"fiction-fables\"}\n              statement={activeStatement}\n              isCorrect={isCorrectSelection}\n              currentSelection={currentSelection}\n              onSelect={handleWidgetSelection}\n              onAttempt={(correct) => {\n                if (correct) {\n                  setStarCount(prev => prev + 10);\n                  setLessonState('challenge');\n                } else {\n                  setLessonState('reassess');\n                }\n              }}\n            />\n          </div>\n\n          {/* Dynamic Action Controls for Widget states */}\n          {isCorrectSelection && (\n            <div className=\"w-full max-w-md mx-auto my-2 animate-bounce\">\n              <button\n                onClick={handleNextStatement}\n                className=\"w-full py-3 bg-[#9c6f1f] hover:bg-[#9c6f1f]/90 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2\"\n              >\n                🎉 Next Example Challenge ➡️\n              </button>\n            </div>\n          )}\n        </div>\n\n        {/* BOTTOM PANEL: EZY'S CONVERSATIONAL CHAT SCREEN */}\n        <div className=\"h-64 bg-white border-t border-[#16241f]/10 flex flex-col shadow-inner\">\n          {/* Chat Stream Header with Voice indicator */}\n          <div className=\"px-4 py-2 border-b border-[#16241f]/5 bg-gray-50 flex items-center justify-between\">\n            <div className=\"flex items-center gap-2\">\n              <span className=\"w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse\" />\n              <span className=\"text-[10px] font-sans font-bold uppercase tracking-wider text-[#16241f]/60\">\n                Ezy the Kangaroo Live Voice Session\n              </span>\n            </div>\n            {isVoiceSpeaking && (\n              <div className=\"flex items-center gap-1.5\">\n                <span className=\"text-[9px] font-sans font-bold text-[#9c6f1f] animate-pulse\">Ezy is speaking...</span>\n                <span className=\"w-1.5 h-4 bg-[#9c6f1f] animate-scale-wave\" />\n                <span className=\"w-1.5 h-6 bg-[#9c6f1f] animate-scale-wave-delay\" />\n              </div>\n            )}\n          </div>\n\n          {/* Active Conversational Message Stream */}\n          <div className=\"flex-1 overflow-y-auto p-4 space-y-3\">\n            {chatHistory.map((msg) => (\n              <div\n                key={msg.id}\n                className={`flex gap-3 max-w-[85%] ${\n                  msg.sender === 'student' ? 'ml-auto flex-row-reverse' : 'mr-auto'\n                }`}\n              >\n                {msg.sender === 'ezy' ? (\n                  <div className=\"w-8 h-8 rounded-full bg-[#9c6f1f]/15 flex items-center justify-center text-md flex-shrink-0 border border-[#9c6f1f]/10 shadow-sm\">\n                    🦘\n                  </div>\n                ) : (\n                  <div className=\"w-8 h-8 rounded-full bg-[#16241f]/10 flex items-center justify-center text-md flex-shrink-0 border border-[#16241f]/5 shadow-sm\">\n                    👦\n                  </div>\n                )}\n\n                <div\n                  className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${\n                    msg.isAction\n                      ? 'bg-amber-100/50 border border-amber-200/50 text-[#9c6f1f] font-sans font-bold'\n                      : msg.sender === 'student'\n                      ? 'bg-[#16241f] text-white rounded-tr-none'\n                      : 'bg-[#f4f6f1] text-[#16241f] border border-[#16241f]/5 rounded-tl-none'\n                  }`}\n                >\n                  {msg.text}\n                </div>\n              </div>\n            ))}\n            <div ref={chatEndRef} />\n          </div>\n\n          {/* Speech / Action Triggers Block */}\n          <div className=\"p-3 border-t border-[#16241f]/5 bg-gray-50 flex gap-2\">\n            <button\n              onClick={() => {\n                const prompt = \"How does this help me Ezy?\";\n                const studentMessage: Message = {\n                  id: Math.random().toString(),\n                  sender: 'student',\n                  text: prompt,\n                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),\n                };\n                setChatHistory(prev => [...prev, studentMessage]);\n                setLessonState('play_example');\n              }}\n              className=\"flex-1 py-2.5 px-4 bg-white hover:bg-gray-100 rounded-xl border border-[#16241f]/10 text-xs font-sans text-left text-[#16241f]/60 hover:text-[#16241f] shadow-sm transition-all\"\n            >\n              🎤 Tap to Talk back to Ezy... (Voice Mode Active)\n            </button>\n            <button\n              onClick={() => {\n                if (typeof window !== 'undefined' && window.speechSynthesis) {\n                  window.speechSynthesis.cancel();\n                  speakText(chatHistory[chatHistory.length - 1]?.text || \"\");\n                }\n              }}\n              className=\"p-2.5 px-4 bg-[#9c6f1f]/10 hover:bg-[#9c6f1f]/20 text-[#9c6f1f] rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-[#9c6f1f]/20 shadow-sm\"\n              title=\"Repeat Ezy's voice\"\n            >\n              🔊 Hear Clue\n            </button>\n          </div>\n        </div>\n\n      </section>\n\n      {/* 🧠 DYNAMIC BRUSH-UP WARM-UP MODAL OVERLAY */}\n      {showWarmup && (\n        <div className=\"fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4\">\n          <div className=\"bg-[#f4f6f1] rounded-3xl border-2 border-[#16241f]/10 max-w-md w-full shadow-2xl overflow-hidden animate-fade-in p-6\">\n            <div className=\"flex items-center gap-3 mb-4\">\n              <span className=\"text-3xl animate-bounce\">🧠</span>\n              <div>\n                <h3 className=\"font-serif font-black text-lg text-[#16241f]\">Spaced repetitions Brush-up</h3>\n                <span className=\"text-[10px] uppercase font-bold text-[#9c6f1f]\">Daily 60-Second Challenge</span>\n              </div>\n            </div>\n            \n            <p className=\"text-xs text-[#16241f]/80 leading-relaxed mb-4\">\n              Awesome job learning Jo's facial meanings! Before we weigh down our scale with Unit 1.7 facts, what was Jo's feeling when she **winked and grinned**?\n            </p>\n\n            <div className=\"space-y-2.5\">\n              {[\n                { text: \"😜 Mischievous or playful\", correct: true },\n                { text: \"😢 Sad and crying\", correct: false },\n                { text: \"😡 Very angry\", correct: false },\n              ].map((opt, i) => (\n                <button\n                  key={i}\n                  onClick={() => {\n                    if (opt.correct) {\n                      alert(\"🎉 Perfect! You mastered the Implicit Meaning brush-up. Earned +5 Stars!\");\n                      setStarCount(prev => prev + 5);\n                      setShowWarmup(false);\n                      setLessonState('intro');\n                    } else {\n                      alert(\"Whoops! Jo's wink is a mischievous expression. Try again!\");\n                    }\n                  }}\n                  className=\"w-full text-left p-3 rounded-xl border border-[#16241f]/10 bg-white hover:border-[#16241f] text-xs font-sans font-bold hover:bg-[#16241f]/5 transition-all flex items-center justify-between\"\n                >\n                  <span>{opt.text}</span>\n                  <span className=\"text-[#16241f]/40\">➡️</span>\n                </button>\n              ))}\n            </div>\n\n            <button\n              onClick={() => setShowWarmup(false)}\n              className=\"w-full mt-4 text-[10px] text-[#16241f]/50 hover:underline text-center block font-sans\"\n            >\n              Skip Warm-up and start Lesson\n            </button>\n          </div>\n        </div>\n      )}\n\n    </div>\n  );\n}