# SmartIGCSE v2: Student-First Learning Companion
## Pilot Scope: Cambridge Stage 5 English | 1–3 Kids | No School/Teacher Layer Yet

---

## STATUS TRACKER
*Updated every time a decision, feature, or milestone changes. This section is the source of truth for "where are we right now" — check here first.*

**Last updated:** 2026-08-05

**Where we are:** Opening a unit starts with a **Unit Overview** (objectives in kid-facing language, pulled from the book's own "What can you do?" checklist) and an optional **quick diagnostic check** ("how much do you already know?") before any teaching happens — the "brush up and skip" insight from the very first conversation, now implemented at concept granularity. Each concept gets a per-concept recommendation ("You've got this" vs. "Review this") routing into the avatar-led lesson only for what's weak. The lesson ("Ezy" the fox mascot) teaches via narrated chat bubbles at a slower, kid-friendly speech rate, with **word-by-word highlighting synced to the narration** (like a read-along highlighter) so kids can follow the text while listening — then asks a check-in question with quick-reply chips plus free voice/text input. **Parents can now upload textbook page photos directly through the app** (an "+ Add photos" button on the Unit Overview screen, backed by a real upload API that saves to the local filesystem and displays them immediately) - this replaced the earlier idea of manually copying files in via Finder, since real parents need a real upload flow. Uploaded scans are gitignored (personal copyrighted material, stays local, never pushed to GitHub). `ANTHROPIC_API_KEY` is configured (confirmed authenticating correctly) but the account has no credit yet, so live Q&A/grading answers aren't testable - fallback paths are confirmed working everywhere they're needed. Build/lint/tests pass. Dev server has been running locally at localhost:3000 for the user to test directly.

**What we're trying to achieve right now:** Validate the full pilot loop (overview → upload real pages → diagnostic → per-concept recommendation → avatar-taught lesson with read-along highlighting → progression test → dashboard) with 1–3 real kids on Cambridge Stage 5 English, Unit 1 — currently only concepts 1.1–1.3 are fully built; 1.4–1.13 are stubbed as "coming soon."

**Currently blocked on / waiting for:**
- Anthropic account credit top-up so voice Q&A and grading return real answers instead of the graceful fallback message
- User to actually try the photo upload feature with real textbook page photos
- Decision on when to deploy the current build to Vercel for real device testing vs. continuing to build out the rest of Unit 1 locally first — note the upload feature needs to move from local filesystem storage to real object storage (Vercel Blob/S3) before a Vercel deploy, since serverless filesystems are ephemeral (see README known gaps)
- Reasoning Interview and Written Exam Capture & Coaching (plan §2.4, §2.5) are not built yet

**Next milestone:** Once credits land, re-verify a live voice Q&A answer end-to-end, then either (a) deploy to Vercel for real device testing (requires swapping upload storage first), or (b) build out concepts 1.4–1.13 to finish Unit 1 first — whichever the user prioritizes next.

---

## WHAT CHANGED FROM v1

v1 was written as if the customer were schools/parents-as-payers. That's now explicitly **Phase 3+, not now**. This version is written as if the customer is **the kid sitting with the app**, and the job is: help them actually understand the subject, understand *how they think*, and get better at writing exams — without turning it into another scoring machine.

Concretely, four things are new that weren't in v1 at all:

1. **Reasoning Interview** — after a test, the system asks the kid to explain their answers out loud, not just marks them right/wrong. This is how you get at "understanding their thought process," not just their score.
2. **Written Exam Capture & Coaching** — kid writes a real exam on paper (as they do at school), photographs it, and gets feedback on *how to write it better* (structure, working shown, time use) — explicitly not framed as "you got 6/10."
3. **In-unit micro-checks** — short questions tied to a concept the moment it's being taught, not only after the unit ends.
4. **Prep Planner** — turns test results into a simple "here's what to revisit and when" plan, so the kid (or you) can see a path to the terminal exam, not just a pile of scores.

Everything about school partnerships, pricing tiers, and teacher dashboards from v1 is deferred, not deleted — it comes back in Phase 3 once the student-facing product actually works for 1–3 kids.

---

## 1. PRINCIPLES

- **No scoring pressure by default.** Practice mode and test mode are visually and behaviorally distinct. A wrong answer in practice mode gets a "let's look at this together," not a red X.
- **Understand *why*, not just *what*.** Every progression test is followed by a short voice conversation about 2–3 answers (right or wrong) to find out if a mistake was a concept gap, a careless slip, or a misread question. These are three completely different fixes and the current design (v1) can't tell them apart.
- **Match the classroom, don't replace it.** Content stays strictly unit-by-unit, in the same order the school teaches it. No "browse the whole book" mode for this age group — that's a Grade 7+ feature at earliest, and only if a pilot kid asks for it.
- **Exam-writing is a separate skill from knowing the answer.** A kid can know that 3/4 + 1/4 = 1 and still lose marks for not showing working, running out of time on the last question, or misreading "how many are left" as "how many in total." The platform should coach this explicitly.

---

## 2. CORE FEATURES FOR THE PILOT

### 2.1 Unit-Wise Content (English, Cambridge Stage 5 — pilot subject as of 2026-08-04, was originally drafted as Grade 4 Math below before the pilot switched subjects; Math sections are kept as reference for when a Math book is available)
Same structure as v1's JSON template (concept → definition → examples → voice Q&A samples → progression test), but only **one unit built at a time**, matching whatever the school is currently teaching. No get-ahead content unless a kid finishes early and asks.

### 2.2 In-Unit Micro-Checks
While a unit is "in progress" (kid has marked it as currently being taught in class), the app surfaces 2–3 short, ungraded questions per concept — something a kid can answer in the evening after that day's class, not a formal test. Purpose: catch confusion while it's still cheap to fix, before the progression test.

### 2.3 Progression Tests — Adaptive Retest Cadence
Same test structure as v1 (unit-based, 15 min), but the retest schedule is now **driven by performance, not a fixed calendar**:
- Score ≥85%: concept marked mastered, light single-question check-in at the next natural review point.
- Score 60–85%: retest the *specific weak concepts* in 3–4 days, not the whole unit.
- Score <60%: re-teach that concept (via voice + examples) before any retest, then retest within 2 days.

This replaces v1's fixed Day-1/3/7/21 schedule with one that tightens or loosens based on how the kid is actually doing — closer to how a good tutor would pace it.

### 2.4 Voice Q&A + Reasoning Interview
Voice Q&A stays as in v1 (ask a concept question, get an explanation, in English or Hindi/Tamil/Telugu/Kannada). New: after each progression test, a short voice follow-up —
> "You said the answer was 12. Walk me through how you got there."

The system classifies the response into: *correct reasoning* (confidence booster, move on), *conceptual gap* (re-teach), *careless slip* (flag as "you know this, just slow down and check"), or *misread the question* (coach on reading comprehension in math word problems specifically). This classification is what feeds the Prep Planner and the parent view — not raw scores.

### 2.5 Written Exam Capture & Coaching
This is the closest thing to "real exam practice":
1. Kid writes a full practice paper on actual paper, under a timer, exactly like at school.
2. Photographs each page and uploads.
3. System reads the handwriting (Claude's vision can read messy handwriting directly — no separate OCR step needed for this, unlike the printed-textbook extraction pipeline) and evaluates:
   - Correctness, but scoring is shown *after* the coaching, not first.
   - **How** the answer was written: was working shown? Was the final answer clearly indicated? Was time spent proportionally (e.g., 20 minutes on question 1 out of a 60-minute paper is a flag regardless of whether Q1 was right)?
   - Specific, kind, actionable feedback: "You got the right answer but didn't show your subtraction steps — in the real exam this loses method marks even when the final answer is correct."
4. Framing throughout: *"Here's how to write this better next time"* — never *"here's what you got wrong."* Marks are shown last, as one data point among several, not the headline.

This is a genuinely new pipeline (handwriting understanding + exam-technique rubric), not just a grading feature, and it directly serves "help them understand exam writing skills without pressure."

### 2.6 Prep Planner
A simple, visual "what to do before the next test / before the terminal exam" plan, generated from: current mastery per concept + weak concepts from the Reasoning Interview + how many weeks remain. Not a nagging to-do list — think "here are the 3 things worth 20 minutes each this week," refreshed after every test.

### 2.7 Interactive, Low-Pressure UI
- Practice mode and test mode look and feel different (color, framing, even the mascot/companion's tone) so a kid always knows which one they're in.
- Voice-first but never voice-only — always a text fallback, useful for quiet environments or kids who prefer typing.
- A simple companion character (not a leaderboard) that reacts to effort and improvement, not just correctness — the gamification layer should reward *trying and explaining*, not just speed/accuracy, to stay consistent with the "no pressure" principle.

---

## 3. CONTENT: HOW WE ACTUALLY GET THE MATH CONTENT IN

You asked whether I can just "prepare a book" myself. Being direct about what's realistic:

- **I cannot reproduce a specific copyrighted textbook's actual text, page layout, or exact wording** — that would be copying, not generating.
- **I can build original Grade 4 IGCSE Math content** (concept explanations, worked examples, practice/progression-test questions) aligned to the **publicly published Cambridge Primary Mathematics curriculum framework** (the framework/syllabus itself, unlike a specific textbook, is meant to be publicly referenced by anyone teaching to it). This gets you a working Unit 1 fast, without needing to wait on scans.
- **When you share the actual book name and scan pages unit by unit**, we align terminology, question style, and any page references to match exactly what the kid sees in class — so voice answers say "like in your textbook" and are actually true.

**Recommended approach for speed:** I draft Unit 1 from the curriculum framework now, you sanity-check it against the actual textbook (just eyeball it, doesn't need to be exact), and we correct anything that's off. Faster than waiting on scans first, and you still end up with content that matches the book once you've spot-checked it.

**On the copyright question you raised** — for a private pilot with your own child and your own purchased book, this is low-risk personal use, and your call to proceed on that basis is reasonable at this scale. Worth revisiting seriously only if/when this moves toward Phase 3 (multiple families, schools) — not a blocker for a 3-kid pilot.

---

## 4. TECH STACK RECOMMENDATION

For a 1–3 kid pilot, the goal is *speed to something usable*, not production polish. Recommendation:

| Layer | Choice | Why |
|---|---|---|
| **Client** | Web app (Next.js/React), installable as a PWA | No app-store review cycle, works instantly on any tablet/phone/laptop the kids already have, "Add to Home Screen" gives an app-like icon without native app overhead. Native (React Native) is a Phase 2+ decision once the product itself is validated. |
| **Voice (STT/TTS)** | Browser Web Speech API for quick prototyping → Google Cloud Speech-to-Text/TTS once multi-language (Hindi/Tamil/etc.) quality matters | Web Speech API is free and zero-setup for English-only testing in week 1; swap to Google Cloud once you need real multi-language accuracy. |
| **Handwriting reading (exam capture)** | Claude's vision capability directly on photographed pages | Avoids a separate OCR step; Claude can read handwriting and reason about the math/working in one pass, which a plain OCR+rules pipeline can't do. |
| **Printed textbook extraction** (once you start scanning book pages) | Claude's vision, same as above, for consistency | One extraction pipeline instead of two (skip AWS Textract for this pilot scale — added complexity you don't need yet). |
| **Content/Q&A/coaching intelligence** | Claude API | Structuring content, voice Q&A, reasoning classification, exam coaching feedback, Prep Planner generation. |
| **Backend** | Lightweight — Node.js or Python (FastAPI) + Postgres | Just needs to hold kids' profiles, concept mastery state, test history — no need for anything heavier at 3-user scale. |
| **Hosting** | Vercel (frontend) + a small managed Postgres (Supabase/Neon) | Both have generous free tiers, zero ops burden for a pilot. |

This stack lets you have something a kid can actually talk to within days, not weeks — and nothing here blocks moving to React Native or a bigger backend later if the pilot works.

---

## 5. DATA MODEL: BUILT NARROW, SHAPED FOR LATER

We build only **Grade 4 → IGCSE → Math → Unit 1** content right now, but the schema itself should already carry:
- `board / grade / subject / unit / concept` hierarchy (not just `unit / concept`) — costs nothing extra now, saves a migration when Math Unit 2 or a second subject shows up.
- A `prerequisite_concepts` field per concept (even if mostly empty at first) — this is what lets the brush-up/skip logic eventually work at concept-level instead of whole-unit level, which is the deeper version of your original insight.
- A `reasoning_log` per test attempt (not just score) — stores the Reasoning Interview classification (concept gap / careless / misread), so the Prep Planner has something real to work from.

---

## 6. QUICK-START PLAN (PILOT, NOT PRODUCTION)

This is deliberately much lighter than v1's 12-week production build — it's sized for proving the idea works with 1–3 kids, not launching.

**Week 1 — Get a kid talking to it**
- Draft Unit 1 Math content from the Cambridge Primary framework (me), you spot-check against the real textbook.
- Basic web app: concept view + voice Q&A (English + Hindi to start) using Web Speech API.
- No test engine yet — just "can a kid ask a question and get a good answer."

**Week 2 — Add the test loop**
- Progression test for Unit 1 (auto-generated questions + mark scheme).
- Adaptive retest logic (score bands → retest cadence).
- Reasoning Interview after the test (voice follow-up on 2–3 answers).

**Week 3 — Add exam coaching**
- Written Exam Capture: photograph a paper attempt, get technique-focused feedback.
- Prep Planner v1: simple "what to revisit this week" view.

**Week 4 — Pilot with your 1–3 kids**
- Run it for real on Unit 1, gather what's confusing/annoying/slow.
- Decide what's worth fixing before Unit 2 vs. what can wait.

After that: extend the same loop to Unit 2, then decide whether to add a second subject or go deeper on Math first — that's a call best made from actual pilot feedback, not planned in advance.

---

## 7. ROADMAP (WHERE SCHOOL/TEACHER STUFF COMES BACK)

- **Phase 1 (now):** This plan. 1–3 kids, Cambridge Stage 5 English, unit by unit (switched from the originally-planned Math pilot on 2026-08-04 since the Math textbook wasn't in hand yet — see changelog).
- **Phase 2:** Finish all English units for Stage 5, validate the full unit → progression test → exam coaching loop end to end. Add Math once that textbook is available, and/or another subject if the English pilot works.
- **Phase 3:** Reintroduce the teacher/school layer from v1 (class-level weak-concept view, school partnerships) — only once the student-facing product is proven, and only as an addition, not a redesign.
- **Phase 4:** Multi-grade, multi-board expansion, licensing conversation for textbook content if scaling beyond personal-use scans.

---

## OPEN ITEMS FOR YOU

1. ~~An `ANTHROPIC_API_KEY`~~ — done, key is in `.env.local`, confirmed working; just needs Anthropic account credit top-up to return live answers.
2. Names/ages of the 1–3 pilot kids (just for tailoring tone/difficulty, nothing else) — or keep it anonymous and just share their rough comfort level with English.
3. Priority call: finish building out Unit 1 concepts 1.4–1.13 next, or deploy the current build to Vercel now and start real pilot testing on just concepts 1.1–1.3.

---

## CHANGELOG
*Newest first. One entry per meaningful change — new feature, scope decision, milestone hit, or pivot.*

**2026-08-06** — Checkpoint pauses now understand natural replies, not just button taps - per feedback that clicking exact buttons "looks more artificial, not natural." Typing or saying something like "yes", "okay got it", or "sorry I didn't understand" during a pause is now recognized locally (regex-based, no AI call needed) as the same intent as tapping "Got it, keep going" / "Can you say that again?", with a short varied acknowledgment ("Great, let's keep going!" / "Sure, here it is again.") before continuing - makes the flow feel like a real conversation rather than forced button-clicking, and works even without Anthropic credits since it's local pattern matching, not an API call. Verified both the continue and repeat natural-language paths end-to-end in-browser. Build/lint/tests pass.

**2026-08-05 (later night)** — Made the lesson actually interactive per feedback that it "just reads continuously... not interactive." Previously the avatar read the entire concept (definition, key points, example, tip) straight through and only checked in once at the very end. Now `AvatarChat.tsx` groups the content into checkpoints (intro+definition / key points / example+tip) and **pauses after each one**, asking "Does that make sense so far?" and waiting for the kid to tap "👍 Got it, keep going" or "🔁 Can you say that again?" (or just ask a free-form question - the input stays live throughout) before continuing - only the final checkpoint transitions into the existing open Q&A quick-replies. Verified the full checkpoint-pause-continue-pause-continue-final-Q&A sequence in-browser; noted that headless Chrome's speechSynthesis appears to hang indefinitely on `onend` in this test sandbox specifically (worked around by testing with "Read aloud" off, which uses a timer fallback) - flagged as a sandbox-only concern to confirm on a real device, not something the code itself does differently now than before. Build/lint/tests pass.

**2026-08-05 (night)** — Follow-up fixes: upload UX was confusing (no separate in-app menu, just the native photo picker) - added inline explainer text, a success confirmation message, and removed `capture="environment"` so mobile users aren't forced straight into the camera. Narration accent switched from en-IN to en-GB (British English) per feedback that the accent was wrong, with explicit voice selection preferring a real en-GB system voice when available; speech rate dropped further from 0.82x to 0.7x since 0.82 still read too fast. **Push workflow changed:** at the user's explicit request, a GitHub PAT is now stored in this Mac's Keychain via git's standard `osxkeychain` credential helper (not a plaintext file) so pushes no longer need a token pasted in chat each time - tradeoff is the token stays live on this machine until it expires or is revoked at github.com/settings/tokens.

**2026-08-05 (evening)** — Three fixes per user feedback ("still don't see the pics... audio too fast... use a highlighter while reading"): (1) **Real photo upload** replacing the placeholder scanned-pages section - added `app/api/pages/upload/route.ts` (validates file type/size, saves to `public/uploads/{unitKey}/`, gitignored) and an "+ Add photos" button in UnitOverview.tsx; `lib/content.ts` gained `getUploadedPageImages()` to list them dynamically, so the `CurriculumUnit.page_images` static field from earlier today was removed as redundant. (2) **Slower speech rate** (0.82x, was default 1.0) in AvatarChat.tsx for both the teaching sequence and free Q&A answers. (3) **Word-by-word read-along highlighting** using `SpeechSynthesisUtterance.onboundary` events, tracking which word is currently being spoken and rendering it in a `<mark>` highlight - degrades gracefully to no highlighting (but still correct playback) in browsers that don't fire boundary events. Also added a subtle fade-in animation for new chat bubbles. Verified the upload API end-to-end via curl (login-cookie + multipart upload + static file serving all confirmed working) since headless browser tooling can't drive a real file picker; verified the lesson page still renders with no console errors after the TTS/highlighting rewrite. Build/lint/tests pass.

**2026-08-05 (later)** — Added Unit Overview + diagnostic check-in flow (components/UnitOverview.tsx, UnitDiagnostic.tsx), per feedback that the app "asked questions directly without showing the textbook first." Opening a unit now shows: unit objectives (from the book's own "What can you do?" checklist), a scanned-pages section (placeholder until real image files are provided), then a choice between a quick diagnostic ("how much do you already know?") or skipping straight to teaching. The diagnostic reuses the progression test's questions, scores per concept via the existing mastery-band logic, and renders a "You've got this" / "Review this" recommendation per concept - clicking "Review this" routes straight into that concept's avatar-led lesson. This is the original "brush up and skip mastered content" insight from the first conversation, now implemented at concept granularity. `CurriculumUnit` gained an optional `page_images` field for real scanned pages once provided. Manually verified end-to-end in-browser: overview → diagnostic → recommendation → routed lesson → dashboard all showing correct data. Build/lint/tests pass.

**2026-08-05** — Learning page redesigned as an avatar-led chat (components/AvatarChat.tsx, Avatar.tsx, illustrations.tsx), replacing the static content-block + separate Q&A box layout, per feedback that the old layout "asked questions directly without showing the textbook first." New flow: avatar greets → narrates the concept (definition, key points, example, tip) as sequential chat bubbles with TTS → asks a check-in question → shows quick-reply chips (from the concept's own sample questions) plus free voice/text input. Added original sample illustrations (simple SVG, not scanned from the book) per drafted concept and a labeled "video coming soon" media slot, since real video needs a licensing/production pipeline not built yet. Retired the old VoiceQA component (superseded by AvatarChat). `ANTHROPIC_API_KEY` added to `.env.local`; confirmed the key authenticates correctly but the Anthropic account currently has no credit balance, so live Q&A answers aren't testable until top-up — the graceful fallback error path is confirmed working. Build/lint/tests still pass.

**2026-08-04** — First working build committed. Next.js 16 app (TypeScript, Tailwind, deployable to Vercel) with: demo login (3 no-password profiles), curriculum → stage → subject → unit selector, Unit 1 English (Cambridge Stage 5) concept viewer with voice Q&A, adaptive-scoring progression test, and a basic dashboard. Pilot subject switched from the originally-planned Grade 4 Math to Cambridge Stage 5 English since the family had the English book in hand (Hodder Education, Cambridge Primary English Learner's Book 5, 2nd ed.) but not the Math one yet. Content for concepts 1.1-1.3 ("Why Cockerels Crow": features of a fable, implicit meaning, explicit meaning) is original writing aligned to the book's own page structure, not reproduced text. `npm run build`, `npm test`, and `npm run lint` pass; `npm audit` clean (upgraded off Next.js 14 after it surfaced several known CVEs). Manually smoke-tested end-to-end in-browser: login → selector → concept view → voice Q&A error path → progression test → scoring → dashboard, all working.

**2026-08-04 (earlier)** — v2 created. Reframed from v1's school/pricing-first doc to student-first: added Reasoning Interview, Written Exam Capture & Coaching, in-unit micro-checks, Prep Planner, adaptive retest cadence. Added Status Tracker + Changelog to make this doc a living tracker.
