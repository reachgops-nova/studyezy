# System Hand-off: StudyEzy Project Integration & Phase 2 Blueprint

*This document is formatted specifically to be pasted directly into Claude (your IDE/local developer agent) to align it with the exact current state, codebase architecture, and the new visual/interactive features designed in Gemini Notebook.*

---

## Part 1: Project Identity & Technical Stack
You are the **Lead Production Engineer** for **StudyEzy**, a voice-first, student-first learning companion designed to help children (specifically targeting Grade 4/5) master their curriculum.

### Core Stack:
*   **Frontend:** Next.js 16 (App Router, TypeScript, Tailwind CSS, Lucide React).
*   **Database:** PostgreSQL connected via Prisma ORM.
*   **Deployment:** Ready for Railway (configured with Volume mounts for parent uploads).
*   **Current AI Architecture (Frozen Stack):** 
    *   *Claude Sonnet/Haiku:* High-stakes grading, diagnostic extraction, and progression test generation (server-side only, API key secure).
    *   *Groq fallback tier:* High-frequency, low-cost voice Q&A, micro-checks, and contextual follow-up recommendations.
    *   *Local Fallback Layer (`lib/localAnswers.ts`):* Text-matching word-overlap heuristics to ensure voice Q&A works seamlessly if API keys fail.

---

## Part 2: Current Codebase Layout & Database State
Our current project is structured cleanly as follows:
```text
app/                    Next.js App Router Pages & API Routes
  register/, login/      Secure credentials-based auth (bcryptjs, opaque cookies)
  profiles/               Family profile picker (supports multiple student profiles)
  select/                 Curriculum -> Stage -> Subject -> Unit Cascading Picker
  manage/                 Admin interface to manually add subjects, units, or outline concepts
  learn/[unitId]/         Core lesson view (Unit overview, Diagnostic warmup, Avatar-led lesson)
  test/[unitId]/          Progression tests (15 mins, adaptive mastery grading)
  dashboard/              Student mastery dashboard showing concept breakdowns
  api/ask/                Voice Q&A handler (calls Claude, falls back to Groq / local answers)
  api/grade/              Short-answer grading engine against a formal mark scheme
  api/attempts/           Saves test/diagnostic progress directly to Postgres
components/              Reusable UI Components (Unit switcher, Avatar chatbot, test runners)
lib/                     Mastery logic, database query utilities, Claude/Groq clients
prisma/                  schema.prisma and seed.ts (Curriculum catalog & seed files)
tests/                   Vitest unit tests for scoring & progression logic
e2e/                     Playwright end-to-end tests for core auth and routing flows
```

---

## Part 3: The Gemini-Claude "Dual-Engine" Workflow
To keep this project highly scalable, extremely cost-effective, and fully grounded in pedagogical research, we are running a **Dual-Engine feedback loop**:

1.  **The Architect & Compiler (Gemini Notebook):**
    *   Acts as the *offline* curriculum parser, telemetry analyzer, and compiler.
    *   Reads raw, scanned textbooks (like our newly uploaded *Cambridge Primary English Learner's Book 5*), designs physical/visual interactions, and compiles them into static PostgreSQL seed scripts (`seed.ts`).
    *   **Bypasses all live Vision/Extraction API costs.** No live OCR or vision models are called during runtime for lesson authoring.
2.  **The Local Builder (Claude / Local IDE):**
    *   Acts as the *online* production programmer.
    *   Implements the actual React interfaces, packages backend APIs, optimizes database operations, and commits code to GitHub.

---

## Part 4: Technical Specifications for Immediate Implementation

Claude, you are instructed to build the following four core enhancements into the Next.js codebase. Keep styling aligned with our **Kangaroo brand identity** (warm cream `#FFFDD0`, deep navy blue text, orange `#FF6F00` action buttons, rounded corners, soft shadows, and clean `Fredoka` typography).

### 1. Server-Side TTS Regional Voice Engine (`/api/tts/route.ts`)
*   **The Problem:** Browser-native Speech Synthesis lacks regional Indian language packs (Hindi, Tamil, Telugu, etc.) on most mobile devices, leading to silent or broken audio.
*   **The Solution:** Build a Next.js server route that uses Microsoft's Edge-TTS service (via the lightweight `edge-tts` npm or python integration) to synthesize natural, regional voice files on our server.
*   **API Specification:**
    ```typescript
    // app/api/tts/route.ts
    import { NextResponse } from 'next/server';
    // Import edge-tts or utilize a fetch to Microsoft's edge tts endpoints
    
    export async function GET(request: Request) {
      const { searchParams } = new URL(request.url);
      const text = searchParams.get('text');
      const lang = searchParams.get('lang') || 'en-IN'; // Default to Indian English
      
      if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });
      
      try {
        // Fetch synthesized audio stream from edge-tts
        // Return stream as audio/mpeg with caching headers
      } catch (error) {
        return NextResponse.json({ error: 'TTS Synthesis failed' }, { status: 500 });
      }
    }
    ```
*   **Client Playback:** Render a hidden HTML5 `<audio>` tag in `components/Avatar.tsx` and play the returned buffer URL dynamically.

### 2. "The Clue Detective" Text-Highlighting Game (Unit 1, Page 5)
*   **The Problem:** Low-performing or slow-paced students find reading abstract analytical paragraphs on "implicit meaning" overwhelming.
*   **The Solution:** Render sentences as dynamic interactive buttons that kids can click to reveal visual, animated emotional hints.
*   **React Implementation Guide:**
    ```typescript
    // components/ClueDetective.tsx
    'use client';
    import React, { useState } from 'react';
    import { Smile, Sparkles, AlertCircle } from 'lucide-react';
    
    interface WordClue {
      word: string;
      isClue: boolean;
      hint: string;
      emoji: string;
    }
    
    export default function ClueDetective() {
      const [activeClue, setActiveClue] = useState<WordClue | null>(null);
      const [solved, setSolved] = useState(false);
      
      const sentence: WordClue[] = [
        { word: "Jo", isClue: false, hint: "", emoji: "" },
        { word: "winked", isClue: true, hint: "A wink is a secret signal between two friends. It means they share a secret!", emoji: "😉" },
        { word: "at Charlie and", isClue: false, hint: "", emoji: "" },
        { word: "grinned", isClue: true, hint: "A grin is a cheeky, playful smile. She is definitely up to something!", emoji: "😏" },
        { word: "as she placed the chewing gum on the teacher's chair.", isClue: false, hint: "", emoji: "" }
      ];
      
      return (
        <div className="p-6 bg-brand-cream border-2 border-orange rounded-3xl shadow-soft">
          <h3 className="text-xl font-bold font-fredoka text-navy mb-4 flex items-center gap-2">
            <Sparkles className="text-orange animate-pulse" /> The Clue Detective! 🕵️‍♂️
          </h3>
          <p className="text-sm text-gray-600 mb-6 font-nunito">
            Writers hide secrets in words. Tap the glowing words to see what Jo is REALLY thinking!
          </p>
          <div className="flex flex-wrap gap-2 text-lg font-nunito leading-relaxed mb-6">
            {sentence.map((item, index) => (
              item.isClue ? (
                <button
                  key={index}
                  onClick={() => setActiveClue(item)}
                  className={`px-2 py-1 rounded-lg border-b-4 font-bold transition-all ${
                    activeClue?.word === item.word 
                      ? 'bg-orange text-white border-orange-dark scale-105' 
                      : 'bg-orange/20 text-orange-dark border-orange/40 hover:bg-orange/30'
                  }`}
                >
                  {item.word} ✨
                </button>
              ) : (
                <span key={index} className="py-1 text-navy">{item.word}</span>
              )
            ))}
          </div>
          
          {activeClue && (
            <div className="bg-white p-4 rounded-2xl border border-orange/20 shadow-inner animate-fadeIn">
              <p className="text-3xl mb-2">{activeClue.emoji}</p>
              <p className="text-sm font-semibold text-navy mb-1">Ezy says:</p>
              <p className="text-sm text-gray-700 font-nunito italic">"{activeClue.hint}"</p>
            </div>
          )}
        </div>
      );
    }
    ```

### 3. Interactive SVG Coordinate Grid for Geometry Lessons
*   **The Problem:** Math concepts like coordinates, shapes, and geometry are incredibly hard to explain via text or static images.
*   **The Solution:** Build a responsive, interactive SVG graphing component that renders grid lines dynamically and lets children plot and slide geometric points visually.
*   **React Implementation Guide:**
    ```typescript
    // components/InteractiveGrid.tsx
    'use client';
    import React, { useState } from 'react';
    
    interface Point {
      x: number;
      y: number;
    }
    
    export default function InteractiveGrid() {
      const [points, setPoints] = useState<Point[]>([]);
      const gridMax = 6;
      const svgSize = 300;
      const padding = 30;
      
      const toSvgCoords = (pt: Point) => {
        const x = padding + (pt.x / gridMax) * (svgSize - 2 * padding);
        const y = svgSize - padding - (pt.y / gridMax) * (svgSize - 2 * padding);
        return { x, y };
      };
      
      const handleGridClick = (e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Find nearest grid intersection
        let bestX = 0, bestY = 0;
        let minDist = Infinity;
        for (let gx = 0; gx <= gridMax; gx++) {
          for (let gy = 0; gx <= gridMax; gy++) {
            const gridCoords = toSvgCoords({ x: gx, y: gy });
            const dist = Math.hypot(clickX - gridCoords.x, clickY - gridCoords.y);
            if (dist < minDist) {
              minDist = dist;
              bestX = gx;
              bestY = gy;
            }
          }
        }
        
        if (minDist < 20) {
          setPoints([...points, { x: bestX, y: bestY }]);
        }
      };
      
      return (
        <div className="p-4 bg-white rounded-3xl border border-gray-100 shadow-soft">
          <svg width="100%" height="300" viewBox="0 0 300 300" onClick={handleGridClick} className="cursor-crosshair">
            {/* Draw Grid Lines */}
            {Array.from({ length: gridMax + 1 }).map((_, i) => {
              const startX = toSvgCoords({ x: i, y: 0 });
              const endX = toSvgCoords({ x: i, y: gridMax });
              const startY = toSvgCoords({ x: 0, y: i });
              const endY = toSvgCoords({ x: gridMax, y: i });
              return (
                <g key={i}>
                  <line x1={startX.x} y1={startX.y} x2={endX.x} y2={endX.y} stroke="#E5E7EB" strokeWidth="1" />
                  <line x1={startY.x} y1={startY.y} x2={endY.x} y2={endY.y} stroke="#E5E7EB" strokeWidth="1" />
                  {/* Axis Labels */}
                  <text x={startX.x} y={svgSize - 10} fontSize="10" textAnchor="middle" fill="#9CA3AF">{i}</text>
                  <text x={15} y={startY.y + 4} fontSize="10" textAnchor="middle" fill="#9CA3AF">{i}</text>
                </g>
              );
            })}
            
            {/* Draw Bounding Polygon */}
            {points.length > 1 && (
              <polygon
                points={points.map(p => { const s = toSvgCoords(p); return `${s.x},${s.y}`; }).join(' ')}
                fill="rgba(255, 111, 0, 0.15)"
                stroke="#FF6F00"
                strokeWidth="2"
              />
            )}
            
            {/* Draw Plotted Points */}
            {points.map((pt, idx) => {
              const sCoords = toSvgCoords(pt);
              return (
                <circle key={idx} cx={sCoords.x} cy={sCoords.y} r="6" fill="#FF6F00" className="animate-scaleIn" />
              );
            })}
          </svg>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xs text-gray-500 font-nunito">Points Plotted: {points.map(p => `(${p.x},${p.y})`).join(', ')}</span>
            <button onClick={() => setPoints([])} className="text-xs font-bold text-orange hover:underline">Reset Canvas</button>
          </div>
        </div>
      );
    }
    ```

---

## Part 5: Your Immediate Assignment
Claude, parse this configuration fully, inspect the local Git repository, and proceed with these tasks:
1.  Verify database schemas in `prisma/schema.prisma` are perfectly migrated.
2.  Implement `/app/api/tts/route.ts` using edge-tts or an edge-synthesizer stream.
3.  Inject our custom visual fables interfaces (`ClueDetective`, `SentenceTrain`) directly into `/app/learn/[unitId]/page.tsx` when rendering Unit 1.
4.  Write comprehensive tests for these endpoints. 
5.  Report back when these routes are active, fully tested, and ready for deployment to Railway!
