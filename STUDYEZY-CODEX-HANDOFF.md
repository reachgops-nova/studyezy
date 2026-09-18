# StudyEzy — Codex Handoff

Updated: 2026-09-18

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

## Resume instruction

When returning, say:

> Continue the StudyEzy visual enhancement work from
> `/Users/gopsair/studyezy/STUDYEZY-CODEX-HANDOFF.md`. First verify NotebookLM
> authentication, then audit both Cambridge English and Math textbooks and
> implement the highest-impact synced visuals, starting with Math Unit 1.

Before continuing the visual work, verify NotebookLM authentication after the
restart. The current conversation should remain available in Codex/ChatGPT
history; reopen it and use the instruction above.
