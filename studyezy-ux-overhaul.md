# StudyEzy: Unified UX Overhaul & Multi-Tier Visual Learning Engine

This blueprint provides a comprehensive architecture, component code, and implementation guide to redesign **StudyEzy** into a highly engaging, non-cropped, interactive study desk. It is optimized for kids of different cognitive stages (from lower primary up to high school) and is structured for direct integration by your local Claude agent.

---

## 1. UX Diagnosis: Why Current Issues Occur & How to Fix Them

### Issue A: Cropped Textbook Pages
*   **Root Cause:** The scanned textbook images are likely wrapped in a layout container with fixed height constraints (e.g., `h-96` or `h-[500px]`) combined with Tailwind's `object-cover` or improper flex alignments. This cuts off crucial headers or footers, especially on smaller tablets and mobile screens.
*   **The Fix:** We must transition the booklet container to use a responsive **intrinsic aspect-ratio box** (specifically `aspect-[3/4]` or `aspect-[7/9]` to match physical textbook standards) using CSS object scaling (`object-contain`). This ensures the page *always* shrinks dynamically to fit the viewport height without clipping a single word.

### Issue B: The "Siloed" Topic Discussion (No Page Flipping)
*   **Root Cause:** The textbook view is currently decoupled from the active conversation state. When a child is chatting with Ezy, they are locked to a single static cropped reference image. They cannot leaf backward to verify previous rules or slide forward to preview upcoming exercises.
*   **The Fix: The "Interactive Split-Desk" Layout**
    *   **Left Pane (The Book):** A swipeable, highly responsive 3D/2D digital textbook sheet that supports fluid backward/forward flipping with pagination controls.
    *   **Right Pane (The Playground):** The active AI chat, voiceover controls, and interactive widgets (like the "Clue Detective" and "Sentence Train").
    *   **Bi-Directional State Coordination:** If a student clicks a paragraph on page 5, the right pane instantly activates the "Clue Detective" game. If they flip to page 6, Ezy automatically chimes in: *"Let's read the next part of our Malawi fable together!"*

---

## 2. Dynamic Learning Profiles: Multi-Tier Visual Scaffolding

To scale the platform holistically across different student age bands, the interface dynamically morphs its interaction density and styling:

| Cognitive Tier | Target Grades | Visual Interface Style | AI Tutor Interaction Style |
| :--- | :--- | :--- | :--- |
| **Lower Primary** | Nursery - Grade 2 | **Full-Screen Tactile Canvas** (No chat interfaces, huge interactive SVG buttons, animated mascot animations). | **100% Spoken & Audio-Driven.** Ezy speaks, highlights letters visually, and guides through sound-effects. |
| **Primary** | Grades 3 - 5 | **Split-Screen Interactive Desk** (Illustrated pages on left, gamified conversational checkpoints & voice options on right). | **Character-Led Coach.** Emphasizes implicit meaning, reading comprehension, fables, and basic maths via physical drag-and-drop. |
| **Middle / High** | Grades 6 - 10 | **Document & Workspace View** (Full-width structural source documents, interactive charts, dynamic SVG graphing/geometry grids on demand). | **Collaborative Peer / Analyst.** Focuses on proofreading, rhetorical analysis, logical proofs, and geometric modeling. |
| **College** | Undergraduate | **Dual-Pane Research Workbench** (Source document on left, advanced interactive charts, analytical notes, code terminal playgrounds on right). | **Academic Research Partner.** Focuses on high-density data visualization, source comparison, and deep-dive critical critiques. |

---

## 3. Production Component: `InteractiveStudyDesk.tsx`

This React TypeScript component implements the responsive split-desk, the non-cropped aspect-ratio page viewer with backward/forward flipping, and seamless coordination with Ezy the Kangaroo. 

```tsx
"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Volume2, Languages, Sparkles } from "lucide-react";

interface PageData {
  pageNumber: number;
  imageUrl: string;
  associatedConcepts: string[];
  audioScriptEn: string;
  audioScriptHn: string;
}

const SAMPLE_PAGES: PageData[] = [
  {
    pageNumber: 5,
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000", // Placeholder for Page 5
    associatedConcepts: ["Implicit Meaning", "Fable Features"],
    audioScriptEn: "Look at Page 5! Jo is winking and grinning. This is a sneaky secret! Tap the glowing words to read between the lines.",
    audioScriptHn: "पेज 5 को देखिए! जो आंख मार रही है और मुस्कुरा रही है। यह एक गुप्त शरारत है! छिपे हुए अर्थ को समझने के लिए चमकते शब्दों पर टैप करें।"
  },
  {
    pageNumber: 6,
    imageUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=1000", // Placeholder for Page 6
    associatedConcepts: ["Character Analysis", "Adjective Choice"],
    audioScriptEn: "Now on Page 6, meet Cockerel and Hyena. Cockerel is parched, and Hyena is helping. Let's find out how they become friends!",
    audioScriptHn: "अब पेज 6 पर, मुर्गे और लकड़बग्घे से मिलें। मुर्गा बहुत प्यासा है, और लकड़बग्घा उसकी मदद कर रहा है।"
  }
];

export default function InteractiveStudyDesk() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [language, setLanguage] = useState<"en" | "hn">("en");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  const currentPage = SAMPLE_PAGES[currentPageIndex];

  // Handles edge-TTS mimicking on browser
  const playPageExplanation = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = language === "en" ? currentPage.audioScriptEn : currentPage.audioScriptHn;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "en" ? "en-GB" : "hi-IN";
      utterance.rate = 0.85; // Cozy, slow pace for easy understanding

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Automatically trigger audio overlay on page flip (highly engaging for kids!)
    playPageExplanation();
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [currentPageIndex, language]);

  const handlePrevPage = () => {
    if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1);
  };

  const handleNextPage = () => {
    if (currentPageIndex < SAMPLE_PAGES.length - 1) setCurrentPageIndex(currentPageIndex + 1);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#FAF8F5] font-sans text-[#1E293B]">
      
      {/* LEFT PANE: The Intrinsic Aspect-Ratio Book (No Cropping) */}
      <div className="flex-1 flex flex-col items-center justify-between p-4 border-r border-[#E2E8F0] bg-white h-1/2 lg:h-full lg:w-1/2">
        <div className="w-full flex items-center justify-between border-b border-[#F1F5F9] pb-2">
          <span className="text-xs font-bold tracking-wider text-orange-500 uppercase">Cambridge English Stage 5</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLanguage(language === "en" ? "hn" : "en")}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
            >
              <Languages size={14} />
              {language === "en" ? "Translate to Hindi" : "English में सुनें"}
            </button>
          </div>
        </div>

        {/* Intrinsic aspect-ratio container holding scanned images securely */}
        <div className="relative flex-1 w-full max-h-[80%] my-4 flex items-center justify-center bg-zinc-50 rounded-xl shadow-inner border border-[#E2E8F0] overflow-hidden">
          <img 
            src={currentPage.imageUrl} 
            alt={`Textbook Page ${currentPage.pageNumber}`}
            className="w-auto h-full max-h-full object-contain rounded-lg p-2 transition-transform duration-300"
          />
          
          {/* Overlay highlight hot-spot demo */}
          {currentPageIndex === 0 && (
            <div 
              onClick={() => setActiveHighlight("implicit")}
              className="absolute top-[45%] left-[20%] w-[35%] h-[8%] border-2 border-orange-500 bg-orange-400/20 rounded cursor-pointer animate-pulse flex items-center justify-center"
            >
              <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">Tap Clue!</span>
            </div>
          )}
        </div>

        {/* Swipe / Page Flip Footer */}
        <div className="w-full flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
          <button 
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className="flex items-center gap-1 text-sm font-semibold py-2 px-4 rounded-lg bg-[#FAF8F5] border border-[#E2E8F0] disabled:opacity-40 text-orange-600"
          >
            <ChevronLeft size={18} /> Prev Page
          </button>
          <span className="text-sm font-bold bg-[#FAF8F5] px-4 py-1.5 rounded-full border border-[#E2E8F0]">
            Page {currentPage.pageNumber}
          </span>
          <button 
            onClick={handleNextPage}
            disabled={currentPageIndex === SAMPLE_PAGES.length - 1}
            className="flex items-center gap-1 text-sm font-semibold py-2 px-4 rounded-lg bg-[#FAF8F5] border border-[#E2E8F0] disabled:opacity-40 text-orange-600"
          >
            Next Page <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* RIGHT PANE: Interactive Playground & Active Chat */}
      <div className="flex-1 flex flex-col justify-between p-6 bg-[#FAF8F5] h-1/2 lg:h-full lg:w-1/2 overflow-y-auto">
        <div className="space-y-4">
          
          {/* Ezy character bubble */}
          <div className="flex gap-3 items-start bg-white p-4 rounded-2xl border border-orange-100 shadow-sm">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-2xl shadow-md border-2 border-white">
              🦘
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-bold text-orange-500 flex items-center gap-1.5">
                Ezy the Kangaroo Mascot
                <Sparkles size={14} className="animate-pulse" />
              </h4>
              <p className="text-sm leading-relaxed text-[#475569]">
                {language === "en" 
                  ? "We are exploring the Malawian fable! Click on highlighted paragraphs in the textbook on your left, and let's solve the mysteries together!"
                  : "हम मलावी की लोककथा को देख रहे हैं! बाईं ओर पाठ्यपुस्तक में चमकते वाक्यों पर टैप करें, और रहस्यों को मिलकर सुलझाएं!"}
              </p>
              <button 
                onClick={playPageExplanation}
                className={`flex items-center gap-1.5 mt-2 text-xs font-bold px-3 py-1.5 rounded-full ${isSpeaking ? 'bg-orange-500 text-white animate-bounce' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
              >
                <Volume2 size={12} /> {isSpeaking ? "Speaking..." : "Listen to Page Guide"}
              </button>
            </div>
          </div>

          {/* Contextual Concept Widgets */}
          {activeHighlight === "implicit" && currentPageIndex === 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 space-y-3 animate-fade-in shadow-sm">
              <h5 className="font-bold text-orange-600 flex items-center gap-1.5 text-sm">
                🕵️ Clue Detective: "Jo winked and grinned..."
              </h5>
              <p className="text-xs text-[#475569] leading-relaxed">
                Textbooks tell us that Jo "winked". What does a wink hide? It is a secret signal. Let's practice reading between the lines (Implicit Meaning)!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                <button 
                  onClick={() => alert("Try again! Gum on a chair is sticky—not very helpful.")}
                  className="bg-white border border-orange-200 p-2.5 rounded-xl text-left text-xs font-semibold hover:border-orange-400 transition-all text-[#475569]"
                >
                  Option A: Jo is helping the teacher clean.
                </button>
                <button 
                  onClick={() => alert("Correct! You are a brilliant detective!")}
                  className="bg-white border border-orange-200 p-2.5 rounded-xl text-left text-xs font-semibold hover:border-orange-400 transition-all text-[#475569]"
                >
                  Option B: Jo is playing a cheeky trick!
                </button>
              </div>
            </div>
          )}

          {/* Standard Chat Sandbox placeholder */}
          <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl space-y-3 shadow-sm">
            <h5 className="text-xs font-bold text-[#64748B] tracking-wider uppercase">Active Conversation Logs</h5>
            <div className="space-y-2 max-h-48 overflow-y-auto text-xs leading-relaxed text-[#475569]">
              <p className="bg-zinc-50 p-2 rounded-lg"><span className="font-bold text-orange-500">Ezy:</span> Try reading the first line of page {currentPage.pageNumber} aloud using your microphone!</p>
            </div>
          </div>
        </div>

        {/* Action input deck */}
        <div className="pt-4 border-t border-[#E2E8F0] flex gap-2">
          <input 
            type="text" 
            placeholder="Ask Ezy a question or type your answer..."
            className="flex-1 bg-white border border-[#E2E8F0] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-all"
          />
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md text-sm">
            Send
          </button>
        </div>
      </div>

    </div>
  );
}
```

---

## 4. Claude Code Builder Implementation Directives

Give these exact instructions to **Claude** locally to implement the split-pane study desk and resolve the visual cropping issue across the repository:

```markdown
# Local Code integration Directives:
1. Replace the legacy single-page template inside `app/learn/[unitId]/page.tsx` with a dual-pane layout using Tailwind CSS: `flex flex-col lg:flex-row h-screen overflow-hidden`.
2. Anchor the textbook image component on the left side using `max-h-[80%] max-w-full object-contain` inside an explicit Tailwind aspect ratio block (e.g., `aspect-[3/4]`) to prevent any image cropping.
3. Integrate `useState` tracking for `currentPageIndex` so that flipping pages backward or forward updates the visible textbook page and corresponding key fables instantly.
4. Hook the page navigation index directly into the conversational playground props. When `currentPageIndex` changes, fetch and display matching `Concept` nodes from Prisma and trigger localized, slow-paced audio guides (Edge-TTS fallback or window.speechSynthesis) automatically.
```
