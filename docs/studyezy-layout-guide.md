# StudyEzy Split-Desk 2.0 & State-Machine Integration Guide

This guide details how to integrate our visually ecstatic cartoon components, state-machine backend dispatcher, and spaced-repetition schedules directly into your local codebase for deployment on Railway.

---

## 🎨 1. Split-Desk 2.0 Layout (Flex Grid Setup)

To completely eliminate UI clutter and keep the portrait textbook page reference synced directly to the active lesson, use a 3-column responsive layout.

### Layout Hierarchy (`components/UnitView.tsx`)
```tsx
export default function UnitView() {
  const [isBookletCollapsed, setIsBookletCollapsed] = useState(false);
  const [activePage, setActivePage] = useState(10); // Automatically synced to concept

  return (
    <div className="flex h-screen w-full bg-[#f4f6f1] overflow-hidden">
      
      {/* COLUMN 1: LEFT NAVIGATION CHECKLIST (Sidebar) */}
      <aside className="w-64 border-r border-[#16241f]/10 bg-white flex flex-col">
        <div className="p-4 border-b border-[#16241f]/10">
          <h2 className="font-serif text-[#16241f] text-md font-bold">Cambridge English</h2>
          <span className="text-[10px] text-[#16241f]/60 font-medium">Hodder Stage 5</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* Mapping through Unit 1 & Unit 2 Checklist Rows */}
        </nav>
      </aside>

      {/* COLUMN 2: CENTER TEXTBOOK BOOKLET (Aspect-Locked 3/4) */}
      <main className={`transition-all duration-300 ${isBookletCollapsed ? 'w-0 overflow-hidden' : 'w-[45%]'} border-r border-[#16241f]/10 bg-white flex flex-col relative`}>
        <div className="p-3 border-b border-[#16241f]/10 flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-[#16241f]">Page {activePage} of 22</span>
          <button 
            onClick={() => setIsBookletCollapsed(true)}
            className="text-[10px] font-sans font-bold text-[#9c6f1f] hover:underline"
          >
            Collapse Booklet
          </button>
        </div>
        {/* Aspect-Ratio Box to avoid camera-crop scaling issues */}
        <div className="flex-1 p-4 flex items-center justify-center bg-gray-50">
          <div className="aspect-[3/4] w-full max-w-sm rounded-xl overflow-hidden border-2 border-[#16241f]/20 shadow-md relative">
            <img 
              src={`/booklet/page-${activePage}.png`} 
              alt={`Physical Textbook Page ${activePage}`}
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </main>

      {/* COLUMN 3: RIGHT INTERACTIVE WORKSPACE (Visual Playground & Ezy Chat) */}
      <section className="flex-1 flex flex-col bg-[#f4f6f1]">
        {/* Dynamic header toggler to expand Booklet if collapsed */}
        {isBookletCollapsed && (
          <div className="p-3 bg-white border-b border-[#16241f]/10">
            <button 
              onClick={() => setIsBookletCollapsed(false)}
              className="text-xs font-bold text-[#9c6f1f] hover:underline"
            >
              📖 Show Textbook Page {activePage}
            </button>
          </div>
        )}
        
        {/* The Live Interactive Canvas (Scale, Train, or Gears) */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-center my-2">
            <WidgetDispatcher 
              conceptId={activeConceptId}
              unitKey={activeUnitKey}
              statement={activeStatement}
              isCorrect={lessonState.isCorrect}
              currentSelection={lessonState.selection}
            />
          </div>

          {/* Conversational Ezy Chat Window below the visual game */}
          <div className="h-48 border-t border-[#16241f]/5 pt-4 flex gap-3 items-start">
            <div className="w-12 h-12 rounded-full bg-[#9c6f1f]/10 flex items-center justify-center text-xl flex-shrink-0">🦘</div>
            <div className="flex-1 bg-white p-4 rounded-2xl border border-[#16241f]/5 shadow-sm">
              <p className="text-sm text-[#16241f] leading-relaxed">{lessonState.ezyResponse}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
```

---

## 🔁 2. Ezy's Pedagogical State Machine Loop

Your local Next.js client uses `api/lesson-dispatcher` to advance Ezy’s dialog and toggle visual components:

```text
  [ STATE: 'intro' ] ──► [ STATE: 'play_example' ] ──► [ STATE: 'challenge' ]
  Ezy explains what      Renders the visual            Student interacts.
  concept is and its     components (Scale/Train)      Correct ➡️ Success Mastery.
  real-world value.      with guides.                  Incorrect ➡️ 'reassess' State.
```

---

## 📈 3. Dynamic Curriculum Spaced-Review Scheduler

To trigger automatic Daily Warm-ups and Bi-Weekly reviews before progression tests, we query the `ConceptMastery` table:

```typescript
// Query inside lib/spacedRepetition.ts
export async function getDueConcepts(userId: string) {
  const now = new Date();

  return await prisma.conceptMastery.findMany({
    where: {
      userId,
      nextReviewDate: {
        lte: now, // Matches any concept due or overdue for a brush-up
      },
    },
    include: {
      concept: {
        include: { unit: true },
      },
    },
  });
}
```

### 🗓️ Scheduling Logic
*   **Success:** Adds `intervalDays` (e.g. 7 days ➡️ 14 days ➡️ 28 days) to make reviews less frequent as they master concepts.
*   **Failure:** Instantly resets review interval back to **2 days** to secure a fast, warm recovery brush-up session!

---

## 📖 4. Textbook-Agnostic JSON Manifest Structure

To support any textbook a user uploads, our backend maps the extracted text chapters to core curriculum widgets:

```json
{
  "textbookName": "Cambridge Global English Learner's Book 5",
  "mappings": [
    {
      "page": 10,
      "conceptTested": "fact-vs-opinion",
      "curriculumReference": "Unit 1.7",
      "visualWidget": "FactOpinionScale",
      "scaffoldScript": "Let's check our facts and opinions on this page!"
    },
    {
      "page": 15,
      "conceptTested": "sentence-connectors",
      "curriculumReference": "Unit 1.9",
      "visualWidget": "SentenceTrain",
      "scaffoldScript": "Time to connect compound sentences!"
    }
  ]
}
```

By uploading a matching JSON config alongside any PDF, our `WidgetDispatcher` instantly loads the correct visual games and positions the booklet at the exact coordinate pages!
