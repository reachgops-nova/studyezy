# StudyEzy — Claude Code Handoff

Updated: 2026-09-18 (latest session)

Repository: `/Users/gopsair/studyezy`

## Objective

Continue making the Learning Board the single student-facing learning route.
Every processed Cambridge Math and English textbook concept must be available
in the shared Board flow:

`Read → Cover → Recite → Test → Results`

Do not restore Learn as the primary UI. `/learn/[unitId]` is a compatibility
redirect for units with Board coverage.

## Current coverage

- Cambridge Grade 4 Math: DB-processed Units 1–18, 64 drafted concepts.
- Cambridge Grade 5 English: DB-processed Units 1–9, 50 drafted concepts.
- `lib/boardUnits/index.ts` exposes `hasBoardRoute()`, routing all Cambridge
  Math/English unit keys to Board, including units without bespoke visual files.
- `app/board/[unitId]/page.tsx` loads the DB-backed textbook unit and either
  enriches an existing visual Board definition or creates a generic Board unit
  through `lib/boardUnits/curriculumAdapter.ts`.

## Important implementation files

- `components/board/DrawingBoard.tsx` — shared Board player and progression
  gates. Do not create subject-specific route components.
- `lib/boardUnits/*.ts` — bespoke visual scenes/data for authored units.
- `lib/boardUnits/curriculumAdapter.ts` — migrates DB Learn/textbook content
  into Board concepts, key-point Read steps, examples, Recite prompts,
  written practice, pages, and voice Q&A.
- `app/board/[unitId]/page.tsx` — DB enrichment and dynamic Board fallback.
- `app/learn/[unitId]/page.tsx` — redirects to Board when `hasBoardRoute()` is
  true; unsupported units retain old Learn temporarily.
- `components/CurriculumSelector.tsx`, `UnitSwitcher.tsx`, and
  `UnitOverview.tsx` — Board-first links with safe Learn fallback.

## Local-language Q&A and cost policy

`/api/ask` checks `AnswerCache` first. Cache key:

`unitKey + conceptKey + language + normalizedQuestion`

The same question, case, whitespace, or punctuation variation is free and
reused across profiles. Cached answers no longer trigger fresh follow-up
generation. Successful fallback answers are saved.

Provider order is deliberately free/low-cost first:

1. Persistent answer cache.
2. Groq, when `GROQ_API_KEY` exists.
3. Gemini free tier, when `GOOGLE_AI_API_KEY` exists.
4. Cerebras `gpt-oss-120b`, when `CEREBRAS_API_KEY` exists.
5. Claude, reserved paid fallback.
6. OpenRouter, reserved paid fallback (currently GPT-4o in
   `lib/openrouter.ts`).
7. Local curriculum fallback / native-script unavailable message.

Supported response languages: English, Tamil, Hindi, Telugu, Kannada,
Malayalam, and French. Non-English responses must be native script, not
transliteration. Board saved English help cards call `/api/ask` when an Indian
language is selected; they must not bypass translation.

Speech uses matching browser voices and falls back to `/api/tts` for Indian
languages.

The supplied Cerebras key was tested without exposing it and returned
`payment_required/quota`: the key is recognized, but the account currently has
no usable inference quota. Enable Cerebras quota/credits and rotate the key
because it was pasted into chat; then update Railway's `CEREBRAS_API_KEY`.
The application safely falls through when Cerebras is unavailable.

## NotebookLM status

Authentication was verified on 2026-09-18. Active notebook:

`https://notebook.google.com/notebook/cbcbb160-7c3c-41e4-b7ef-4366467347c1?authuser=1`

The current notebook query returned unrelated Unit 16 implementation notes,
not reliable textbook inventory. Do not invent curriculum from that response;
use the local DB-backed concepts as current truth and ask the user to repair the
NotebookLM sources before relying on it for textbook cross-checks.

## Validation and deployment

These commands pass after the latest changes:

```bash
npx tsc --noEmit --pretty false
git diff --check
npm run build
```

The user requested production deployment after verification. Check git status,
review the diff, commit the intended changes, and push the current branch to
`origin`. Railway is the deployment target and uses the repository's existing
build/start configuration. Never print or commit `.env.local` secrets.

## Handoff policy

Every meaningful work session must update both handoff files: this file for
Claude and `STUDYEZY-CODEX-HANDOFF.md` for ChatGPT/Codex. Never put raw API
keys in either file or in Git.

## Latest homepage work

The public `/` route was redesigned in `app/page.tsx` as a polished
parent-facing marketing page covering family pain points, the Board journey,
local-language voice support, textbook grounding, mission, trust boundaries,
pilot pricing language, and CTAs. New public legal pages are
`app/terms/page.tsx` and `app/privacy/page.tsx`. Commit `96ab666` is live and
the homepage, `/terms`, and `/privacy` returned HTTP 200.

## Tamil Nadu Grade 9 Science audit (2026-09-18)

The supplied textbook is present and readable at:

`/Users/gopsair/Downloads/Class_9_Science_English_2024_Edition-www.tntextbooks.in.pdf`

It is the Government of Tamil Nadu Standard IX Science revised/reprint
edition, 328 PDF pages. The contents page lists 25 units: Measurement,
Motion, Fluids, Electric charge and Electric current, Magnetism and
Electromagnetism, Light, Heat, Sound, Universe, Matter Around Us, Atomic
Structure, Periodic Classification of Elements, Chemical Bonding, Acids Bases
and Salts, Carbon and its Compounds, Applied Chemistry, Animal Kingdom,
Organisation of Tissues, Plant Physiology, Organ Systems in Animals, Nutrition
and Health, World of Microbes, Economic Biology, Environmental Science, and
LibreOffice Impress; Practicals and Glossary follow.

The repository already has bespoke interactive pilots for
`tamilnadustateboard-9-science-1` and `-2` (Measurement and Motion), but no
complete DB-backed Tamil Nadu curriculum/catalog entry for all 25 units. Start
implementation with Unit 1 Measurement, use Unit 2 as the existing visual
reference, and keep the shared Read -> Cover -> Recite -> Test -> Results
progression and topic gating intact.

## Unit 1 implementation handoff (2026-09-18)

Unit 1 Measurement's Board lesson layer is implemented in
`lib/boardUnits/tamilnadustateboard-9-science-1.ts` and registered in
`lib/boardUnits/index.ts`. The five concepts are `1.1` Physical quantities
and SI units, `1.2` prefixes and astronomical units, `1.3` vernier caliper,
`1.4` screw gauge, and `1.5` mass/weight/accuracy. Each includes textbook
page references, key points, worked practice, quick check, guided task,
recitation, written practice, and final test coverage.

Visuals are Board-native and interactive: SI concept cards, a powers-of-ten
timeline, labelled vernier-caliper and screw-gauge diagrams, and a mass versus
weight comparison. They use the shared Board's animated transitions and safe
SVG handling. NotebookLM/AI-generated artwork must remain a visual brief or
analogy only; factual labels, equations, and assessed answers stay in typed
data/UI.

`hasBoardRoute` recognises `tamilnadustateboard-9-science-1`, making the static
Board available at `/board/tamilnadustateboard-9-science-1` after login. The
static Board layer is complete, but DB-backed curriculum/catalog rows are still
needed for `/select`; page-gallery attachment and a final Unit 1 audit against
the existing interactive players are next.

Validation: `npx tsc --noEmit --pretty false`, `git diff --check`, and
`npm run build` pass. Both handoff files are intentionally uncommitted until
the next content/deployment checkpoint.

NotebookLM check at the end of this unit: authentication is healthy for the
active `StudyEzy` notebook, but a targeted Unit 1 query returned unrelated
Cambridge Unit 17 implementation notes. Do not use the current notebook as a
Science source until its uploads are repaired; the local Tamil Nadu PDF is the
source of truth for this unit.

## Cambridge Board visual/content audit (2026-09-18)

The Math Unit 18.1 issue was confirmed and fixed. The generic pending-unit
factory had rendered `explore the move` instead of a world-time-zone example.
`lib/boardUnits/cambridge-4-math-pending.ts` now gives 18.1 a concrete Lagos
12:00 -> Delhi +5 hours -> 17:00 timeline, east/add and west/subtract rule,
and Sydney 7:00 am on 13 July -> 5:00 pm on 12 July date-crossing example.
Unit 18.2 now has the concrete 11:20 am + 45 minutes -> 12:05 pm timeline,
with +40 and +5 minute jumps and backward-duration practice.

The cross-unit source fix is in `lib/boardUnits/curriculumAdapter.ts`: for
all DB-backed Cambridge units using the generic Board factory, the first Cover
task now comes from the first real textbook example for each concept. This
puts a real example on the Board before progression, while preserving typed
visuals and separate graded tests; bespoke visual units keep their authored
steps.

Validation passed: `npx tsc --noEmit --pretty false`, `git diff --check`, and
`npm run build`. NotebookLM auth remains healthy, but its current notebook
still returns unrelated Unit 17 notes for a targeted Unit 1 query, so it was
not used as the factual source for this correction.

## Cambridge end-to-end visual/content audit (2026-09-18)

Added `scripts/audit-board-coverage.ts`. The audit covers all 27 registered
Cambridge Math/English Board units and passes: every concept has a Read step,
worked example, topic quick check, Cover task, and Test coverage, with no known
generic placeholder prompt in surfaced Board data.

`lib/boardUnits/index.ts` now normalizes static Board units so a missing
concept step, quick check, or Cover task cannot silently skip a topic. The
DB-backed adapter still puts the real textbook example first, so the fallback
is only for unlinked/static use.

Math and English pending-unit factories now use visible model/evidence tasks
instead of abstract topic-identification prompts. Math Unit 18 keeps its
explicit world-time-zone and start/end-time visuals and examples.

Validation passed: `node -r tsx/cjs scripts/audit-board-coverage.ts`,
`npx tsc --noEmit --pretty false`, `git diff --check`, and `npm run build`.

NotebookLM authentication is healthy, but the existing StudyEzy notebook is
grounded to mismatched content. The current connector cannot create a new
notebook and requires a new NotebookLM share URL from the user. Use that new
notebook for source-grounded visual briefs once supplied; it does not directly
export animated image assets, so factual Board visuals remain typed
SVG/React scenes and generated art stays decorative/non-factual.

## Shared voice Recite implementation (2026-09-18)

Added `components/board/VoiceReciteCheck.tsx` and integrated it into
`components/board/DrawingBoard.tsx`. Every Board recitation prompt can now be
spoken, transcribed, shown as `I heard: ...`, and checked before the learner
can mark that recitation item complete. Browser speech recognition is tried
first and uses no StudyEzy LLM tokens.

The component performs a local keyword/number check for clear answers. Only
uncertain answers call `/api/micro-check`, which gives corrective feedback and
keeps partial/incorrect answers in Recite for another try. A browser without
microphone speech support can still reveal the reference answer.

`app/api/micro-check/route.ts` caches successful uncertain recite verdicts and
feedback in the existing persistent `AnswerCache`; repeated matching answers
produce a zero-token cache hit. The selected language is passed to the
existing provider/TTS path. This is a shared Board-template capability, so
future books only need normal `recitePrompts` and `writtenPractice` data.

Validation: 27-unit Board audit, `npx tsc --noEmit --pretty false`,
`git diff --check`, and `npm run build` pass.

## Math Unit 3.1 signed-number visual fix (2026-09-18)

Fixed the reported gap in `lib/boardUnits/cambridge-4-math-pending.ts`.
Concept 3.1 now uses a signed number line from `-5` to `9`, visibly marks
`-4`, `0`, and `5`, and shows the worked jumps `-4 -> 0 -> 5`. Its Cover,
quick-check, and Test task ask the concrete calculation `-4 + 9 = 5`, while
the concept examples also cover `5 - 9 = -4`.

`scripts/audit-board-coverage.ts` now asserts that Math 3.1 includes values
below zero and a negative-number worked example. Audit, TypeScript, diff check,
and production build pass.

## Per-topic RCRT phase ownership fix (2026-09-18)

Fixed the reported Recite leak where one topic displayed prompts from all
subtopics. Legacy `recitePrompts` and `writtenPractice` entries without a
`conceptId` had been treated as unit-wide, while Results counted only owned
entries. The shared `completeBoardUnit` normalizer in
`lib/boardUnits/index.ts` now:

- assigns unowned Recite/written items to the closest concept using topic
  vocabulary, with a deterministic fallback;
- adds an owned Recite prompt and written practice item for every concept;
- adds an owned Test task when the authored unit omitted one;
- preserves authored concept IDs/content;
- keeps the active topic isolated through Read, Cover, Recite, Test, and
  Results.

The audit now checks ownership in all five phases for every Cambridge concept.
All 27 Cambridge Board units pass. TypeScript, diff check, and production
build pass.

## Release-readiness verification (2026-09-18)

`npm test` reports 2 test files and 13 tests passing. The 27-unit phase audit,
TypeScript, `git diff --check`, and `npm run build` also pass. Ready for a
controlled live push. A manual browser click-through of every unit was not
performed in this session; after deployment, smoke test a negative-number Math
unit, Math Unit 18, an English unit, and voice Recite in the target
browser/language.

## Universal non-blank Recite board (2026-09-18)

`DrawingBoard` now renders the active concept’s Recite card directly inside
the board viewport. It names the topic and displays the exact worked examples;
when a concept has no authored example, it falls back to a clear sample task
based on the concept summary. This fixes blank Recite visuals such as Math
10.1 and is inherited by every current and future subject.

Validation: `npm test` (13 tests), 27-unit Board audit, TypeScript,
`git diff --check`, and `npm run build` pass.

## Board-visible Recite examples and directional labs (2026-09-18)

The shared `DrawingBoard` now displays the active concept’s exact worked
examples on the main board during Recite, with the concept ID/title visible;
the side-panel prompts explicitly belong to that one topic. Cambridge Math’s
pending-unit factory now creates concept-owned rule and worked-example Recite
prompts plus a second worked example for written practice.

Unit 18.1 now has visible `+5 hours EAST` and `-14 hours WEST` jumps, including
the previous-day result and the rule “east: add; west: subtract.” Coordinate
labs continuously show the `Across`/`Up` labels and equation/result on the
board, including `(2 + 2, 2 + 3) = (4, 5)`.

Verified with `npm test` (13 tests), the 27-unit Board audit, TypeScript,
`git diff --check`, and `npm run build`.

## Tamil Nadu Grade 9 Science rollout started (2026-09-18)

Source textbook: `/Users/gopsair/Downloads/Class_9_Science_English_2024_Edition-www.tntextbooks.in.pdf` (24 units, 328 pages). Unit 1 is the detailed authored reference. Added `lib/boardUnits/tamilnadustateboard-9-science-pending.ts` and registered Units 2–24 with source-aligned concept scaffolds, examples, and the shared Read/Cover/Recite/Test flow. `BOARD_UNITS` now exposes all 24 Science unit keys.

Added image-generation assets:

- `public/board-art/tn9-science-motion-paths.png`
- `public/board-art/tn9-science-fluids-pressure-buoyancy.png`

They contain no embedded educational text; code-rendered labels remain
accurate and localisable. The universal non-blank Recite board card applies
to Cambridge English as well as all current/future Science and Math units.

Important boundary: Units 2–24 are Board-ready scaffolds, not yet a claim of
complete page-by-page extraction. Next work should deepen Unit 2 Motion from
the PDF, then Unit 3 Fluids, adding textbook page references, exact question
examples, and interactive/animated visuals.

## Science visual explanation and audio pass (2026-09-19)

All Tamil Nadu Science Unit 2–24 concepts now receive a visual model through
`scienceVisualFrame`, rather than only text cards. Physics, Chemistry, and
Biology use distinct code-rendered diagram patterns. Every diagram exposes
tappable `Core idea`, `Evidence`, and `Check` points that speak through the
existing narration/TTS path, and the practical Cover/Test prompt tells the
child to inspect the model before answering.

The Motion and Fluids AI images now include narrated hotspots. Images and
diagrams animate gently, with reduced-motion support. Recite automatically
announces the active concept and directs the child to the board visual. This
shared behavior also covers Cambridge English and all future books.

Validation: 24 Science units, 74 concepts, 141 visual steps; 13 tests, the
27-unit Cambridge audit, TypeScript, diff check, and production build pass.

## Topic-specific Science infographics (2026-09-19)

The generic diagram pattern was replaced. `scienceVisualFrame` now renders
relevant visuals for each Science domain: circuits, magnetic fields, rays,
heat transfer, waves, solar orbits, particle states, atoms, periodic table,
bonds, pH, carbon chains, applied chemistry, classification, tissues, leaves,
organ systems, nutrient/deficiency plate, food preservation, microbes,
economic growing systems, and environmental cycles.

Labels are topic-specific and narrated—for example Vitamin A/Iron/Vitamin C/
Vitamin D, Drying/Freezing/Canning, and Bacteria/Fungus/Virus—rather than the
old Core idea/Evidence/Check placeholders. AI Motion and Fluids artwork keeps
its relevant hotspots.

Validation: 24 Science units, 74 concepts, 141 visual steps; 13 tests,
TypeScript, `git diff --check`, and production build pass.

## Resume instruction

Continue StudyEzy Board coverage from
`/Users/gopsair/studyezy/STUDYEZY-CLAUDE-HANDOFF.md`. First inspect git status
and verify the production build, then randomly audit Cambridge Math and English
units against the DB-backed concepts before adding any bespoke visuals.
