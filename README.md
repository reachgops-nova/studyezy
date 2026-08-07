# StudyEzy

A voice-first, student-first learning companion. Pilot scope: Cambridge Stage 5 English,
Unit 1, for 1-3 kids. See [`PLATFORM_PLAN.md`](./PLATFORM_PLAN.md) for the product plan,
status tracker, and changelog - that file is the source of truth for "why" this app is
built this way. This README covers "how to run it."

## Stack

Next.js 16 (App Router, TypeScript, Tailwind), deployable to Vercel. Claude API
(`@anthropic-ai/sdk`) powers curriculum-aware voice Q&A and exam-answer grading, called
only from server-side route handlers - the API key never reaches the browser. Voice
input/output uses the browser's built-in Web Speech API (no extra service needed for
that part).

## Getting started

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` and add an Anthropic API key from https://console.anthropic.com/.
Without it, the app still runs end-to-end (login, curriculum selection, reading
content, taking the test) - only the voice Q&A and short-answer grading features
return a friendly "not configured yet" message instead of a real answer.

```bash
npm run dev
```

Then open http://localhost:3000. Pick any of the three demo profiles - there's no
real login system, see "Security notes" below for why that's intentional right now.

## Scripts

- `npm run dev` - local development server
- `npm run build` - production build
- `npm run start` - run a production build locally
- `npm test` - run the Vitest unit tests (mastery/scoring logic)
- `npm run lint` - ESLint (flat config, includes the React Compiler plugin)

## Project layout

```
app/                    Next.js App Router pages + API routes
  login/                Demo profile picker (server action sets a cookie)
  select/                Curriculum -> stage -> subject -> unit picker
  learn/[unitId]/        Unit overview, diagnostic, avatar-led lesson
  test/[unitId]/         Progression test
  dashboard/              Per-concept mastery view
  api/ask/                Curriculum-aware Q&A (calls Claude, server-side only)
  api/grade/              Short-answer grading against the mark scheme
  api/pages/upload/       Parent-uploaded textbook page photos -> public/uploads/
  api/pages/extract/      Turns uploaded photos into structured lesson concepts
lib/                     Types, content loading, mastery/scoring logic, auth, Claude client
content/curricula/       Hand-authored curriculum content as JSON (source-referenced, not copied text)
content/generated/       AI-extracted concepts from uploaded photos (gitignored images, tracked text)
components/              Client components (selector, avatar chat, test runner, dashboard)
tests/                   Vitest unit tests
```

## Content sourcing

Content comes from two paths, both original writing aligned to the family's own
physical textbook (Hodder Education, Cambridge Primary English Learner's Book 5) -
no text is reproduced from the book itself either way:

- **Hand-authored** (`content/curricula/`) - concepts 1.1-1.3, written directly from
  photos shared in chat during initial development.
- **AI-extracted** (`content/generated/`, created at runtime) - a parent uploads
  textbook page photos via the Unit Overview screen, then "Extract lesson content"
  sends them to Claude (`claude-sonnet-5` - a better model than the interactive Q&A
  calls, since this becomes the actual curriculum content and runs rarely) with an
  explicit instruction to write original explanations, not copy the page text. See
  `lib/claude.ts` → `extractConceptsFromPages` for the prompt.

See the `source_reference.note` field in each unit JSON file and PLATFORM_PLAN.md
section 3 for the copyright reasoning.

## Known gaps (read before treating this as production-ready)

This is a pilot build for 1-3 known users, optimized for getting the learning loop in
front of real kids quickly - not a hardened multi-tenant product yet. Specifically:

- **No database.** Progress/test results live in the browser's `localStorage`, keyed
  by demo profile id. Clearing browser data or switching devices loses history. Move
  to Postgres before onboarding more families or supporting multiple devices per kid.
- **Demo auth has no real accounts.** Profile selection is a signed-nothing cookie -
  fine because no passwords or personal data are collected, but it means anyone with
  the URL can pick any of the three profiles. Do not point this at a public URL with
  real usage data you care about protecting without adding real auth first.
- **Rate limiting is in-memory**, per server process. It resets on every deploy and
  doesn't coordinate across serverless instances. Adequate for a single Vercel preview
  during the pilot; replace with a durable store (e.g. Upstash Redis) before scaling.
- **Only Unit 1 concepts 1.1-1.3 are hand-authored.** The rest of Unit 1 (1.4-1.13) and
  every other unit/subject/stage are stubbed as "coming soon" - a parent can now fill
  these in via the page-extraction pipeline (upload photos -> "Extract lesson content"
  on the Unit Overview screen), but nothing has been extracted yet at time of writing.
- **Short-answer grading is single-pass AI grading with no human review loop yet.**
  Per PLATFORM_PLAN.md's "understand thought process" goal, the Reasoning Interview
  and Written Exam Capture & Coaching features described in the plan are not yet
  built - grading currently only covers the progression test's short-answer questions.
- **No automated end-to-end tests.** Only the pure scoring/mastery logic has unit
  tests; the UI flow was verified manually. Worth adding Playwright coverage once the
  flow stabilizes.
- **No CI pipeline yet.** `npm run build`, `npm test`, and `npm run lint` all pass
  locally as of this commit, but nothing runs them automatically on push.
- **Extracted content has no human review step.** `/api/pages/extract` writes straight
  to `content/generated/{unitKey}.json` and it's immediately live in the lesson - worth
  spot-checking extracted concepts against the real textbook before a kid sees them,
  same as the hand-authored content already was. Not yet verified against a real API
  response either (no Anthropic credit at time of writing - request shape confirmed
  correct via the same credit-balance error path as `/api/ask`).
- **Uploaded textbook page photos are written to the local filesystem** (`public/uploads/`,
  gitignored - personal copyrighted scans never get pushed to GitHub). This works
  fine for local/dev use, but Vercel's serverless filesystem is ephemeral - uploads
  would NOT persist there. Before deploying to Vercel, swap the upload route
  (`app/api/pages/upload/route.ts`) to write to real object storage (e.g. Vercel
  Blob or S3) instead of `fs.writeFile`.

## Deployment

Not deployed yet - the plan is Vercel for the Next.js app once the pilot flow is
validated locally. `next.config.mjs` and the env var contract (`ANTHROPIC_API_KEY`,
`ANTHROPIC_MODEL`) are already Vercel-compatible; no code changes should be needed,
just setting the environment variables in the Vercel project settings.
