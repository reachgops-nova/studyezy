# StudyEzy

A voice-first, student-first learning companion. See [`PLATFORM_PLAN.md`](./PLATFORM_PLAN.md)
for the product plan, status tracker, and changelog - that file is the source of truth for
"why" this app is built this way. This README covers "how to run it."

## Stack

Next.js 16 (App Router, TypeScript, Tailwind), Postgres via Prisma, deployable to Railway.
Claude API (`@anthropic-ai/sdk`) powers curriculum-aware voice Q&A, exam-answer grading, and
the textbook page-extraction pipeline - called only from server-side route handlers, the API
key never reaches the browser. Voice input/output uses the browser's built-in Web Speech API.

## Getting started

Requires Node.js 20+ and a Postgres database (local Postgres, `docker run postgres:16`, or any
hosted Postgres you already have).

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:
- `DATABASE_URL` - your Postgres connection string.
- `ANTHROPIC_API_KEY` - from https://console.anthropic.com/. Without it, the app still runs
  end-to-end (register, sign in, pick a curriculum, read content, take the test) - only the
  voice Q&A, grading, and page-extraction features return a friendly "not configured yet"
  message instead of a real answer.
- `UPLOADS_DIR` - defaults to `./uploads`, fine for local dev.

Then set up the database and start the app:

```bash
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open http://localhost:3000, create an account, add your kid's name, and you're in.

## Scripts

- `npm run dev` - local development server
- `npm run build` - production build
- `npm run start` - run a production build locally
- `npm test` - run the Vitest unit tests (mastery/scoring logic)
- `npm run lint` - ESLint (flat config, includes the React Compiler plugin)
- `npm run db:migrate:dev` - create/apply a Prisma migration in dev
- `npm run db:seed` - seed the curriculum catalog + Unit 1 English content
- `npm run db:studio` - open Prisma Studio to inspect the database

## Project layout

```
app/                    Next.js App Router pages + API routes
  register/, login/      Real account creation and sign-in (email + password)
  profiles/               Pick or add a kid's profile under the signed-in account
  select/                 Curriculum -> stage -> subject -> unit picker
  manage/                 Add new subjects/units to the catalog
  learn/[unitId]/         Unit overview, diagnostic, avatar-led lesson
  test/[unitId]/          Progression test
  dashboard/              Per-concept mastery view
  api/ask/                Curriculum-aware Q&A (calls Claude, server-side only)
  api/grade/              Short-answer grading against the mark scheme
  api/attempts/           Records progression-test/diagnostic results to Postgres
  api/pages/upload/       Parent-uploaded textbook page photos -> disk (UPLOADS_DIR)
  api/pages/extract/      Turns uploaded photos into structured lesson concepts
  api/uploads/[...path]/  Authenticated serving route for uploaded photos
lib/                     Types, content/catalog queries (Prisma), mastery/scoring logic,
                          auth/session, Claude client
prisma/                  schema.prisma + seed.ts (curriculum catalog + Unit 1 content)
content/curricula/       Unit 1 English source JSON, read once by the seed script
components/              Client components (selector, avatar chat, test runner, dashboard)
tests/                   Vitest unit tests
```

## Content sourcing

Content is original writing aligned to the family's own physical textbook (Hodder Education,
Cambridge Primary English Learner's Book 5) - no text is reproduced from the book itself:

- **Hand-authored** - Unit 1 concepts 1.1-1.3, written directly from photos shared during
  initial development, migrated into Postgres by `prisma/seed.ts`.
- **AI-extracted** - a parent uploads textbook page photos via the Unit Overview screen, then
  "Extract lesson content" sends them to Claude (`claude-sonnet-5` - a better model than the
  interactive Q&A calls, since this becomes the actual curriculum content and runs rarely)
  with an explicit instruction to write original explanations, not copy the page text. See
  `lib/claude.ts` → `extractConceptsFromPages` for the prompt.

Any signed-in user can add new subjects/units via `/manage` - see PLATFORM_PLAN.md section 3
for the copyright reasoning behind why this stays original-writing-only.

## Known gaps (read before treating this as production-ready)

- **Any signed-in user can author content for any subject/unit** - there's no separate
  admin/moderator role yet. Fine at pilot scale (a handful of trusted family accounts); add a
  role check before opening registration more broadly.
- **Rate limiting is in-memory**, per server process. It resets on every deploy and doesn't
  coordinate across serverless instances. Adequate for a single Railway instance during the
  pilot; replace with a durable store (e.g. Upstash Redis) before scaling to multiple instances.
- **Extracted content has no human review step.** `/api/pages/extract` writes straight into the
  `Concept` table and it's immediately live in the lesson - worth spot-checking extracted
  concepts against the real textbook before a kid sees them, same as hand-authored content.
- **Short-answer grading is single-pass AI grading with no human review loop yet.** Per
  PLATFORM_PLAN.md's "understand thought process" goal, the Reasoning Interview and Written
  Exam Capture & Coaching features described in the plan are not yet built.
- **No automated end-to-end tests.** Only the pure scoring/mastery logic has unit tests; the UI
  flow is verified manually. Worth adding Playwright coverage once the flow stabilizes.
- **No CI pipeline yet.** `npm run build`, `npm test`, and `npm run lint` all pass locally as of
  this commit, but nothing runs them automatically on push.
- **Sessions are simple opaque DB tokens** with no rotation, device list, or "sign out
  everywhere" UI yet - fine for a handful of family accounts, worth revisiting before wider use.
- **Uploaded textbook page photos need a persistent Volume on Railway** (`UPLOADS_DIR`,
  defaults to `/data/uploads` there) - without one, photos would be lost on every redeploy
  since container filesystems are otherwise ephemeral.
- **The `InteractionEvent` table exists but nothing writes to it yet** - it's the intended
  foundation for adapting teaching style to how a specific kid actually learns over time
  (question patterns, retry behavior, etc.), but that adaptive logic hasn't been built - this
  pass only ships the schema to log against later.

## Deployment (Railway)

`railway.json` runs `npx prisma migrate deploy` before `next start` on every deploy, so schema
changes roll out automatically. Required Railway setup (one-time, via the Railway dashboard):

1. Add a Postgres plugin to the project - `DATABASE_URL` is then auto-injected.
2. Add a persistent **Volume** mounted at `/data`, and set `UPLOADS_DIR=/data/uploads` in the
   service's environment variables - otherwise uploaded photos won't survive a redeploy.
3. Set `ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`) in the service's environment
   variables.
4. Set `NODE_ENV=production` explicitly - Railway doesn't set this automatically, and the
   session cookie's `secure` flag depends on it.

`PORT` is injected automatically by Railway; `package.json`'s `start` script already respects it.
