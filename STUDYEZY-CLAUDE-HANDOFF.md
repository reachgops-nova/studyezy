# StudyEzy — Claude Code Handoff

Updated: 2026-09-18

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

## Resume instruction

Continue StudyEzy Board coverage from
`/Users/gopsair/studyezy/STUDYEZY-CLAUDE-HANDOFF.md`. First inspect git status
and verify the production build, then randomly audit Cambridge Math and English
units against the DB-backed concepts before adding any bespoke visuals.
