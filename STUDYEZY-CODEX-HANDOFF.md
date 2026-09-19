# StudyEzy — Codex Handoff

Updated: 2026-09-18 (latest session)

## Project

Repository: `/Users/gopsair/studyezy`

StudyEzy is a voice-first Cambridge learning companion. The current work is
focused on the two textbook tracks:

- Cambridge Grade 4 / Stage 4 Mathematics, Units 1–18.
- Cambridge English content stored under `cambridge-5-english-*` keys; the
  project migration moves/displays English for the Stage 4 pathway.

## Current product state

- English and Math textbook content are DB-backed and treated as processed.
- Math Unit 1 is the tested pilot.
- `components/AvatarChat.tsx` owns the lesson chat flow, checkpoint pauses,
  voice playback, and read-along highlighting.
- `components/VoicePicker.tsx` provides device voice selection.
- `lib/richScene.ts`, `lib/richSceneRegistry.ts`, and
  `components/interactive/RichSceneStage.tsx` support model-authored animated
  lesson scenes.
- `lib/conceptIllustration.ts` supports generated raster concept artwork.
- `lib/bespokeSceneRegistry.tsx` connects Math Unit 1 pilot scenes and other
  unit-specific scenes to lessons.

### Learning Board is now the primary teaching route

`/board/[unitId]` is the intended student-facing route for units that have a
Board definition. The Board template is the shared `Read -> Cover -> Recite ->
Test -> Results` flow in `components/board/DrawingBoard.tsx`; unit-specific
content belongs in `lib/boardUnits/*.ts`, not in a second page component.

Current Cambridge Board coverage is registered in `lib/boardUnits/index.ts`:

- Cambridge Grade 4 Math: Units 1–11 are represented (Units 1, 2 and 10 are
  hand-authored; the remaining units currently use the pending Board data
  definitions).
- Cambridge Grade 4 Math: Units 1–18 are now Board-routable. Units with
  bespoke visual files keep those files; all other processed DB units are
  built through `lib/boardUnits/curriculumAdapter.ts`.
- Cambridge Grade 5 English: Units 1–9 are Board-routable (Units 1–3 have
  hand-authored Board files; Units 4–9 have pending visual definitions and
  are enriched from the DB textbook concepts).

The DB audit on 2026-09-18 found drafted textbook concepts for all 18 Math
units and all 9 English units. Each record has a definition, key points, two
or more examples, and voice-Q&A data. `curriculumAdapter.ts` now enriches
registered Board definitions with those fields and builds a complete shared
Board flow for units without a bespoke visual file. This means random unit and
concept tests no longer fall back to the retired Learn layout. The next visual
pass can replace generic text cards with richer subject-specific frames without
changing the curriculum coverage or progression logic.

The active NotebookLM notebook is authenticated, but its current query
returned unrelated Unit 16 implementation notes rather than the source
textbooks. Do not use that notebook response as curriculum truth; the local
DB-backed textbook concepts are currently the trusted source for this audit.

Navigation rules:

- `/learn/[unitId]` redirects to `/board/[unitId]` when that unit exists in
  `BOARD_UNITS`; unsupported units retain the old Learn route temporarily.
- `/select`, the unit switcher, and next-unit links choose Board when a Board
  definition exists and otherwise use Learn.
- The Board header's `← Unit selection` button goes to `/select` (not back to
  `/learn`, which previously created a redirect loop or returned to the wrong
  screen).

## Board local-language Q&A and cache

`components/board/DrawingBoard.tsx` has a language selector for English,
Tamil, Hindi, Telugu, Kannada, and Malayalam. Typed questions call
`/api/ask` with the selected language. Saved English help cards now also call
`/api/ask` when a non-English language is selected; this fixes the earlier bug
where clicking a saved card always printed and spoke English.

`app/api/ask/route.ts` checks the persistent `AnswerCache` before any model
call. Cache keys are unit, concept, language, and normalized question, so
repeat questions and punctuation/case variants are free and reusable across
profiles. Cache hits no longer generate follow-up suggestions, avoiding an
extra model request. Successful fallback answers are persisted too. The model
tier is free-first: Groq (if configured), Gemini free tier, Claude, OpenRouter,
then local fallback. If all
providers are unavailable for a non-English request, the route returns a
native-script retry message instead of silently showing English.

Board speech uses a matching browser voice where available, otherwise
`/api/tts` for server-side Indian-language TTS.

Important implementation detail: Board's local saved-answer path intentionally
only serves directly in English. Non-English saved-card requests go through
the cache/provider route so the displayed text and speech are translated.

## Recent code changes (2026-09-18)

- Fixed Board saved-help Tamil/Indian-language responses in
  `components/board/DrawingBoard.tsx`.
- Fixed Board return navigation to `/select`.
- Made all unit navigation Board-first but safe for units without a Board:
  `components/CurriculumSelector.tsx`, `components/UnitSwitcher.tsx`, and
  `components/UnitOverview.tsx`.
- Added `/learn` compatibility redirect for Board-covered units in
  `app/learn/[unitId]/page.tsx`.
- Added Math Unit 1 concept 1.3, topic-scoped Read/Cover/Recite/Test gating,
  progress statuses, and language-aware chat in the earlier 2026-09-17 work.
- Added OpenRouter Q&A/translation fallback in `lib/openrouter.ts` and
  strengthened native-script requirements in `lib/groq.ts` and `lib/claude.ts`.
- Added Gemini text Q&A/translation as the free-tier fallback before Claude in
  `lib/gemini.ts` and `app/api/ask/route.ts`.
- Added Cerebras `gpt-oss-120b` as the next free/credit fallback. Its supplied
  key was tested without printing it; Cerebras returned `payment_required/quota`,
  so the key is recognized but the account has no usable inference quota yet.
- Added the ignored private `STUDYEZY-API-CONNECTIONS.local.md` reference and
  documented setup variable names in `.env.example`. Never commit raw keys.
- Added Cerebras `gpt-oss-120b` as the next free/credit fallback, configured by
  the server-only `CEREBRAS_API_KEY` environment variable. The raw key remains
  only in ignored local/Railway secret storage, never Git.
- Added `lib/boardUnits/curriculumAdapter.ts`: all drafted DB textbook
  concepts now flow into the Board's examples, key-point steps, recitation,
  written practice, pages, and voice Q&A. Math Units 12–18 now get the same
  Board route even without bespoke visual data files.

Validation after the latest changes: `npx tsc --noEmit --pretty false`,
`git diff --check`, and `npm run build` pass. The worktree contains other pre-existing user edits;
do not reset or discard them.

## Visual enhancement direction

Review both textbooks unit by unit and improve visual impact wherever it helps:

1. Use AI-generated raster illustrations for story, context, vocabulary,
   literature, science-like processes, and visual analogies.
2. Use animated rich scenes or React/canvas interactions for transformations,
   sequences, processes, and worked explanations.
3. Keep precise mathematical models, equations, labels, and assessed answers
   data-driven or interactive so generated artwork cannot introduce errors.
4. Sync each visual to the exact AvatarChat checkpoint that explains it.
5. Avoid baked-in text in generated images; render factual text as real UI text.

NotebookLM should be used for source-grounded visual briefs and textbook
cross-checking. It is not the final image renderer.

## Local textbook source

The local Hodder Math source was found at:

`/Users/gopsair/Library/Application Support/anythingllm-desktop/storage/hotdir/hodder math learner5.pdf`

The project also contains uploaded English textbook pages under
`public/uploads/cambridge-5-english-1/`.

## Tamil Nadu Grade 9 Science audit (2026-09-18)

The supplied source textbook is present and readable at:

`/Users/gopsair/Downloads/Class_9_Science_English_2024_Edition-www.tntextbooks.in.pdf`

It is the Government of Tamil Nadu Standard IX Science revised/reprint
edition, 328 PDF pages. The contents page lists 25 units: 1 Measurement, 2
Motion, 3 Fluids, 4 Electric charge and Electric current, 5 Magnetism and
Electromagnetism, 6 Light, 7 Heat, 8 Sound, 9 Universe, 10 Matter Around Us,
11 Atomic Structure, 12 Periodic Classification of Elements, 13 Chemical
Bonding, 14 Acids Bases and Salts, 15 Carbon and its Compounds, 16 Applied
Chemistry, 17 Animal Kingdom, 18 Organisation of Tissues, 19 Plant Physiology,
20 Organ Systems in Animals, 21 Nutrition and Health, 22 World of Microbes,
23 Economic Biology, 24 Environmental Science, and 25 LibreOffice Impress,
followed by Practicals and Glossary.

The codebase already contains bespoke interactive pilots for Tamil Nadu
Science Units 1 and 2 (`tamilnadustateboard-9-science-1` and `-2`), including
Measurement and Motion concepts, but there is not yet a complete DB-backed
Tamil Nadu curriculum/catalog entry for all 25 units. Next implementation
should start with Unit 1 Measurement, audit its textbook concepts/pages,
register the Grade 9 Science curriculum in the Board selector, and preserve
the shared Read -> Cover -> Recite -> Test -> Results gates. Unit 2 can then
reuse the existing pilot as the visual quality reference.

## NotebookLM MCP

Registered globally with:

```bash
codex mcp add notebooklm npx notebooklm-mcp@latest
```

The server is configured as a stdio MCP server. Running
`npx notebooklm-mcp@latest` directly waits for MCP JSON-RPC traffic; it is not
the login command. After restarting Codex, ask Codex:

> Log me in to NotebookLM.

This should invoke the package's `setup_auth` tool and open Chrome for Google
login. Then verify with:

```bash
codex mcp list
```

### Current Mac compatibility fix

Google moved NotebookLM to `https://notebook.google.com` (Gemini Notebook),
but the released MCP package only recognized `notebooklm.google.com` during
authentication. A patched local build is now available at:

`/Users/gopsair/notebooklm-mcp-patched`

The Codex MCP config points to its built server with `HEADLESS=false` and
`BROWSER_CHANNEL=chrome`. Restart the Codex host/session for the config change
to load, then run `setup_auth` again. Keep the newly opened Chrome window open
and signed in at `https://notebook.google.com/?pli=1` while restarting Codex;
Google has rebranded NotebookLM as Gemini Notebook and moved the live app to
that host. Codex CLI is not installed on this Mac; do not assume `codex mcp`
shell commands are available.

## Handoff policy

Update both handoff files after every meaningful work session: this file for
ChatGPT/Codex and `STUDYEZY-CLAUDE-HANDOFF.md` for Claude. Never put raw API
keys in either handoff or in Git.

## Latest homepage work

The public `/` page was redesigned as a parent-facing marketing site in
`app/page.tsx`: stronger promise, parent pain points, Board journey, local
language support, mission, trust boundaries, pilot pricing language, and CTAs.
Public legal pages were added at `/terms` and `/privacy`. Commit:
`96ab666`. Live smoke checks returned HTTP 200 for the homepage, Terms, and
Privacy pages.

## Resume instruction

When returning, say:

> Continue the StudyEzy visual enhancement work from
> `/Users/gopsair/studyezy/STUDYEZY-CODEX-HANDOFF.md`. First verify NotebookLM
> authentication, then audit both Cambridge English and Math textbooks and
> implement the highest-impact synced visuals, starting with Math Unit 1.

Before continuing the visual work, verify NotebookLM authentication after the
restart. The current conversation should remain available in Codex/ChatGPT
history; reopen it and use the instruction above.

## Unit 1 implementation handoff (2026-09-18)

Unit 1 Measurement's Board lesson layer is implemented in
`lib/boardUnits/tamilnadustateboard-9-science-1.ts` and registered in
`lib/boardUnits/index.ts`. It preserves the per-topic Read -> Cover -> Recite
-> Test -> Results gates.

The five textbook-grounded concepts are `1.1` Physical quantities and SI
units, `1.2` prefixes and astronomical units, `1.3` vernier caliper, `1.4`
screw gauge, and `1.5` mass/weight/accuracy. Each has page references, key
points, worked practice, a quick check, guided task, recitation prompt,
written practice, and test coverage. Visuals include SI cards, a powers-of-ten
timeline, labelled caliper and screw-gauge diagrams, and a mass-versus-weight
comparison. They use the shared Board's animated transitions and safe SVG
handling; factual labels and assessed answers remain typed UI data.

`hasBoardRoute` recognises `tamilnadustateboard-9-science-1`, making the static
Board available at `/board/tamilnadustateboard-9-science-1` after login. The
static Board layer is complete. DB-backed curriculum/catalog rows are still
needed for `/select`, followed by textbook page-gallery attachment and a final
audit of the existing Unit 1 interactive players.

Validation completed: `npx tsc --noEmit --pretty false`, `git diff --check`,
and `npm run build` all pass. These handoff files remain uncommitted until the
next content/deployment checkpoint.

NotebookLM check at the end of this unit: authentication is healthy for the
active `StudyEzy` notebook, but a targeted Unit 1 query returned unrelated
Cambridge Unit 17 implementation notes. Do not use the current notebook as a
Science source until its uploads are repaired; the local Tamil Nadu PDF is the
source of truth for this unit.

## Cambridge Board visual/content audit (2026-09-18)

The reported Math Unit 18.1 problem was confirmed: the generic pending-unit
factory rendered a number line with `explore the move` instead of the topic's
world-time-zone example. Fixed in `lib/boardUnits/cambridge-4-math-pending.ts`:

- 18.1 now shows the concrete Lagos 12:00 -> Delhi +5 hours -> 17:00 worked
  timeline, the east/add and west/subtract rule, and the Sydney 7:00 am on 13
  July -> 5:00 pm on 12 July date-crossing example.
- 18.2 now shows the concrete 11:20 am + 45 minutes -> 12:05 pm timeline,
  with +40 and +5 minute jumps and a backward-duration example.
- Cover tasks for both topics now ask the actual worked question and offer
  topic-specific feedback rather than asking the child to identify a generic
  concept.

The broader fix is in `lib/boardUnits/curriculumAdapter.ts`: when a
DB-backed Cambridge unit uses the generic Board factory, its first Cover task
is now built from the first real textbook example for every concept. This
keeps the typed Board visuals/assessment safe while ensuring the real concept
example is visible before the child advances. Existing bespoke units retain
their hand-authored visual steps.

Validation completed after this fix: `npx tsc --noEmit --pretty false`,
`git diff --check`, and `npm run build` pass. NotebookLM authentication is
still healthy, but its current notebook returned unrelated Unit 17 notes for a
targeted Unit 1 query, so it was not used as a factual source for this fix.

## Cambridge end-to-end visual/content audit (2026-09-18)

Added `scripts/audit-board-coverage.ts` and ran it against all 27 registered
Cambridge Math/English Board units. It passes: every concept has a Board Read
step, worked example, topic quick check, Cover task, and Test coverage, and no
known generic placeholder prompt remains in the surfaced Board data.

Added a safety-net normalizer in `lib/boardUnits/index.ts`. If a static visual
file is missing a concept step, quick check, or Cover task, the Board now adds
one instead of silently allowing the topic to be skipped. The DB-backed
adapter continues to put the real textbook example first for each concept, so
the safety net is not the normal production content path.

The pending Math/English factories were also tightened so their fallback
tasks ask the child to use a visible model and explain evidence, rather than
identify a topic abstractly. Unit 18 retains its explicit time-zone visuals
and worked examples.

Validation: `node -r tsx/cjs scripts/audit-board-coverage.ts`,
`npx tsc --noEmit --pretty false`, `git diff --check`, and `npm run build` all
pass.

NotebookLM status: authentication is healthy, but the existing StudyEzy
notebook contains mismatched content. The current NotebookLM connector cannot
create a new notebook; it requires a new NotebookLM share URL supplied by the
user. Once provided, use the new notebook for source-grounded visual briefs.
The connector exposes NotebookLM research/audio, not direct animated image
asset export; typed Board SVG/React scenes remain the safe renderer, with
ChatGPT/image generation reserved for non-factual illustration briefs.

## Shared voice Recite implementation (2026-09-18)

Recite now supports spoken self-retrieval for every Board unit through the
shared `components/board/VoiceReciteCheck.tsx` component. `DrawingBoard.tsx`
passes each prompt, expected explanation, unit/concept IDs, and selected speech
language into it, so future books inherit the feature automatically.

Browser SpeechRecognition transcribes the child's answer; a local
keyword/number check accepts clearly correct answers without an LLM call; an
uncertain answer uses `/api/micro-check`; partial/incorrect answers stay in
Recite for retry; and a correct answer marks that recitation item complete.
The child sees the exact `I heard:` transcript and can reveal the reference
answer if microphone support is unavailable.

`app/api/micro-check/route.ts` persists successful uncertain recite
verdict/feedback pairs through the existing `AnswerCache` and logs cache hits
as zero-token calls. Normal answers therefore cost no LLM tokens, repeated
uncertain answers are reused, and only genuinely new uncertain answers use the
configured low-cost provider.

Validation: 27-unit Board audit, `npx tsc --noEmit --pretty false`,
`git diff --check`, and `npm run build` pass.

## Math Unit 3.1 signed-number visual fix (2026-09-18)

Fixed the reported gap in `lib/boardUnits/cambridge-4-math-pending.ts`.
Concept 3.1 now uses a signed number line from `-5` to `9`, visibly marks
`-4`, `0`, and `5`, and animates the worked jumps `-4 -> 0 -> 5`. Its Cover,
quick-check, and Test task now ask the concrete calculation `-4 + 9 = 5`, and
the concept examples also show `5 - 9 = -4`.

`scripts/audit-board-coverage.ts` now has a regression assertion that Math
3.1's visual range must include values below zero and contain a negative-number
worked example. Audit, TypeScript, diff check, and production build all pass.

## Per-topic RCRT phase ownership fix (2026-09-18)

The user found that Recite showed prompts from every subtopic. Root cause:
legacy `recitePrompts` and `writtenPractice` entries without `conceptId` were
treated as unit-wide by `DrawingBoard.tsx`, while Results counted only
concept-owned entries. Fixed in the shared `completeBoardUnit` normalizer in
`lib/boardUnits/index.ts`:

- unowned Recite and written prompts are matched to the closest concept using
  title/summary/key-point/example vocabulary, with a deterministic fallback;
- every concept receives an owned Recite prompt and written practice item;
- every concept receives an owned Test task if the authored unit omitted one;
- existing concept IDs and authored content are preserved;
- the existing active-topic filters now show only the current concept in
  Read -> Cover -> Recite -> Test -> Results.

The audit script now checks all five phase ownerships for every Cambridge
concept. Result: all 27 Cambridge Board units pass with no known generic
placeholder prompts. TypeScript, diff check, and production build pass.

## Release-readiness verification (2026-09-18)

`npm test` reports 2 test files and 13 tests passing. The 27-unit phase audit,
TypeScript, `git diff --check`, and `npm run build` also pass. This is ready
for a controlled live push. A manual browser click-through of every unit was
not performed in this session; after deployment, smoke test a negative-number
Math unit, Math Unit 18, an English unit, and voice Recite in the target
browser/language.

## Universal non-blank Recite board (2026-09-18)

The shared `DrawingBoard` now places a prominent Recite card inside the board
viewport, not only in the side panel. It always names the active concept and
shows its exact worked examples; if a DB/static concept has no authored
example, it supplies a clear “show one example” revisit sample from the
concept summary. This prevents blank Recite boards such as the reported Math
10.1 experience and applies to all existing and future subjects.

Validation: `npm test` (13 passed), 27-unit Board audit, TypeScript,
`git diff --check`, and `npm run build` pass.

## Board-visible Recite examples and directional labs (2026-09-18)

Fixed the reported Unit 18 gap in the shared `DrawingBoard` template. During
Recite, the main board now keeps the active concept ID/title and every exact
worked example visible, while the side-panel prompts explicitly say which
active topic they belong to. The pending Cambridge Math factory now gives each
concept an owned rule prompt, an owned worked-example Recite prompt, and a
second worked example for written practice.

Math Unit 18.1 now visibly shows `+5 hours EAST` (Lagos 12:00 -> Delhi
17:00) and `-14 hours WEST` (Sydney 7:00 am -> 5:00 pm on the previous day),
with the explicit rule “east: add; west: subtract.” Coordinate labs now keep
their live `Across`/`Up` equation and result synced on the board as sliders
move, including `(2 + 2, 2 + 3) = (4, 5)`.

Validation: `npm test` (13 passed), Cambridge 27-unit audit, TypeScript,
`git diff --check`, and `npm run build` pass.

## Tamil Nadu Grade 9 Science rollout started (2026-09-18)

The textbook source is `/Users/gopsair/Downloads/Class_9_Science_English_2024_Edition-www.tntextbooks.in.pdf` (24 units, 328 pages). Unit 1 remains the detailed authored Board lesson. Added `lib/boardUnits/tamilnadustateboard-9-science-pending.ts`, which registers source-aligned concept scaffolds, worked examples, Cover/Recite/Test ownership, and visual cards for Units 2–24. `BOARD_UNITS` now exposes all 24 Science unit keys in the shared Board template.

Generated and copied two project assets using the built-in image-generation skill, with no educational text embedded in the images so labels remain accurate/localisable in code:

- `public/board-art/tn9-science-motion-paths.png` — distance versus displacement
- `public/board-art/tn9-science-fluids-pressure-buoyancy.png` — depth pressure and buoyancy

The universal Recite board card applies to Cambridge English, Cambridge Math,
Science Unit 1, Science Units 2–24, DB-backed textbook units, and future
subjects. Validation: 24 Science units registered, `npm test` (13 passed),
Cambridge 27-unit audit, TypeScript, `git diff --check`, and `npm run build`
pass. The Science shells are not yet a claim of full page-by-page textbook
extraction; deepen each unit's source examples, question-paper links, and
visuals in order starting with Unit 2.

## Science visual explanation and audio pass (2026-09-19)

The Science scaffold no longer renders text-only concepts. `scienceVisualFrame`
now gives every Unit 2–24 concept a visual model: Physics uses motion/force
geometry, Chemistry uses atom/bond models, and Biology uses cell/organism
models. Every model has tappable `Core idea`, `Evidence`, and `Check` points;
the child sees the picture, hears the explanation through the existing Board
narration/TTS path, and then answers a concrete Cover/Test question.

The generated Motion and Fluids images now have narrated hotspots. Board images
and diagrams have gentle animation with `prefers-reduced-motion` support, and
entering Recite automatically narrates the active concept and directs the child
to the visible model/example. This shared behavior applies to Cambridge
English, Cambridge Math, Tamil Nadu Science, DB-backed units, and future books.

Validation: 24 Science units, 74 Science concepts, 141 visual steps; 13 tests,
27-unit Cambridge audit, TypeScript, diff check, and production build pass.

## Topic-specific Science infographics (2026-09-19)

Replaced the generic Core idea/Evidence/Check diagram pattern after review.
`scienceVisualFrame` now chooses a relevant infographic by textbook unit:
circuits (4), magnetic fields (5), ray reflection (6), heat transfer (7),
sound waves (8), solar orbits (9), particle states (10), atomic structure
(11), periodic table (12), bonding (13), pH (14), carbon chains (15), applied
chemistry flow (16), animal classification (17), cell -> tissue -> organ
(18), leaf/photosynthesis (19), digestive/excretory paths (20), nutrient and
deficiency plate plus preservation/safety visuals (21), microbe forms (22),
growing systems (23), and environmental cycles (24).

Each diagram's tappable labels now name real pictured parts (for example
Vitamin A, Iron, Vitamin C, Vitamin D; Drying, Freezing, Canning; Bacteria,
Fungus, Virus), and the narration explains the selected part with the unit's
actual example. The AI Motion/Fluids images keep their specific hotspots.

Validation: 24 Science units, 74 concepts, 141 visual steps; 13 tests,
TypeScript, `git diff --check`, and production build pass.

## Interactive visual mission layer (2026-09-19)

Reviewed `/Users/gopsair/Downloads/What codex offered.docx`. Its nutrition
reference makes the expected behavior explicit: the learner should tap a
labelled body/food region and learn from the resulting evidence, rather than
watch a picture while narration plays.

Updated `components/board/DrawingBoard.tsx` with a shared `VisualMission` for
all Board stages. Every topic now presents a visible “your turn” action and a
progress counter. Tappable image hotspots, diagram parts, charts, bars,
timelines, text cards/chips, number-line marks, and coordinate points feed the
same immediate audio/subtitle response and are counted as explored. Recite
changes the prompt to touch the worked example and explain what changed. This
is deterministic in-browser (no LLM request per tap), so it is instant, cheap,
and reusable for Cambridge, Tamil Nadu Science, DB units, and future books.

LLM/NotebookLM/ChatGPT should author source-aligned prompts, hints, language
translations, visual/animation briefs, and uncertain spoken-answer feedback;
the Board should run taps, drags, sorting, sequencing, and visual state
changes locally. This separation keeps the experience genuinely interactive
and controls API cost while retaining an upgrade path for richer simulations.

Validation after this change: TypeScript and `git diff --check` pass. Run
`npm test` and `npm run build` before the next deployment.

## Codex-generated visual pilot (2026-09-19)

NotebookLM was not usable in the current session because its authentication
expired and its connector does not expose Infographic/Video downloads. The
Codex image-generation workflow was therefore used for a stronger visual
pilot. Added project assets:

- `public/board-art/tn9-science-measurement-lab.png`
- `public/board-art/tn9-science-vernier-caliper.png`

Unit 1's SI/physical-quantities frame and Vernier-caliper frame now use these
rich, source-aligned scenes. Artwork intentionally contains no educational
text; `tamilnadustateboard-9-science-1.ts` supplies accurate hotspot labels,
facts, local-language narration, and interaction state. This prevents image
model text errors while preserving the visual quality the reference DOCX
expects. Continue this pattern for the remaining Unit 1 concepts, then the
highest-impact Cambridge and Tamil Nadu Science concepts: generate the scene,
inspect it, copy it into `public/board-art`, add code-owned hotspots/animation
steps, and verify the relevant textbook facts.

## Student action engine (2026-09-19)

Added `components/board/InteractiveChallenge.tsx` as a reusable activity
engine, but it is intentionally not mounted over the visual viewport. The
Board viewport must remain a clear, full-size concept image/diagram: the child
taps the labelled pictured parts and hears the relevant idea. Clock, pipette,
vocabulary, and quick-check activities belong in the practice/task area, not
on top of the explanation artwork.

Future activity data should replace heuristic mode selection with explicit
per-concept actions: clock/time-zone setting, measurement/lab manipulation,
drag-and-drop sequencing, vocabulary construction, prediction/reveal,
drawing, and explanation. The visual, action, feedback, and RCRT phase must
belong to the same concept.

Validation: 13 tests, TypeScript, `git diff --check`, and production build
pass.

## Visual viewport cleanup (2026-09-19)

Removed the permanent `VisualMission` and `InteractiveChallenge` overlays from
the main Board viewport after review. This restores the full visual area and
prevents a frozen panel such as “Which is written correctly? 25 kg / 25 kgs”
from covering the actual concept image. Hotspots, diagram parts, text cards,
number-line marks, and grid points still remain the direct interaction surface.
