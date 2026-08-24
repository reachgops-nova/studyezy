# SmartIGCSE — content conversion kit

This is the missing piece between "parent uploads photos of the workbook" and
"child gets an interactive lesson". Drop it into the existing SmartIGCSE codebase.

```
HANDOFF.md                       paste this into a fresh Claude Code session
schema/pack.schema.json          the contract
engine/checks.js                 the 16 permitted ways to mark an answer
engine/convert.mjs               CLI runner: images -> pack -> validate -> repair
engine/validate.mjs              the publish gate
engine/player-app.js             the renderer (no content, no subject knowledge)
engine/convert-workbook.mjs      one-off proof that the schema holds real content
prompts/extract-worksheet.md     the vision prompt
packs/holy-sai-stage6-maths-numbers.json   6 worksheets, 44 questions, 111 fields
```

---

## Why the current conversion fails

The spec treats extracted content as **prose with metadata** — definition, key points,
examples, tips. Prose is fine for a chatbot to read out. It cannot be answered, cannot be
marked, and cannot be measured, so there is nothing for the assessment engine to score
and nothing for the progression logic to gate on.

What a worksheet actually needs is a **markable object**: for each blank, a rule that
decides whether what the child typed is right. That is the whole difference. Once
questions carry checks, everything downstream becomes possible — instant feedback,
per-skill diagnostics, brush-up gating, terminal test assembly.

The second failure is trust. A vision model reading a photographed page with a child's
pencil marks over it gets roughly one question in eight subtly wrong: a digit mis-read, a
diagram it cannot see but answers anyway, a hint that gives away the answer, a
multiple-choice list missing its own correct option. Shipping that to a child is worse
than shipping nothing, because the child gets marked wrong for being right and stops
trusting the app. So extraction must be **generated, then mechanically verified, then
repaired** before publish.

---

## The pipeline

```
parent uploads photos
        │
        ▼
  vision model  ─── prompts/extract-worksheet.md  (temperature 0, transcribe only)
        │
        ▼
  candidate pack (JSON, data only — never code)
        │
        ▼
  node engine/validate.mjs        ◄── exit 1 blocks publish
        │           │
        │           └── errors fed back verbatim as a repair prompt, max 2 retries
        ▼
  human review queue   ◄── anything still failing, plus every needsHuman:true
        │
        ▼
  published pack ──► engine/player-app.js renders it for the child
                └──► skill tags feed the diagnostic report and test assembly
```

### Why packs contain no code

Every answer is expressed through a fixed vocabulary of 16 check kinds
(`exact_number`, `sequence`, `number_set`, `sum_of_primes`,
`digit_completes_divisibility`, `keywords`, …). The model may only emit a kind that
exists in `checks.js`. This buys three things at once: generated content can never
execute anything, the validator can reason about every answer mechanically, and the same
pack renders identically on web, Android and a future offline build.

Diagrams work the same way. `media` is parameters, not markup —
`{"kind":"thermometer","min":-15,"max":35,"step":5,"reading":23}` — and the player owns
the drawing. A model that cannot express a figure must set `needsHuman: true` instead of
inventing one.

### What the validator actually catches

Run against a deliberately corrupted pack, these are real failures it blocks:

```
ERROR  [ws1] q1a.a  steps are not constant (8, 7) on a sequence sheet — a digit was probably mis-read
ERROR  [ws3] q1     prompt refers to something visual but the question has no media, table or grid
ERROR  [ws4] q1(ii) no usable explanation — this is what the parent reads aloud
ERROR  [ws5] q5.a   no two primes add to 23
ERROR  [ws5] q8.a   correct answer(s) not present in options: 2368, 2080
ERROR  [ws6] q1     table has 14 empty cells but 12 fields marked inTable
WARN   [ws1] q4.a   the hint contains the answer "155" verbatim — rewrite it as a nudge
```

The wording is written to be pasted straight back to the model as a correction prompt.

The rule that earns its keep most often is the constant-step check: a single mis-read
digit is the commonest OCR failure and the hardest to spot by eye, because the question
still looks completely plausible.

---

## Running it

```bash
# convert stored pages (write the loadPages adapter first; start with 3)
ANTHROPIC_API_KEY=... node engine/convert.mjs --pages ./scans --out packs/english.json \
  --book "Grade 4 English Coursebook" --subject English --board Cambridge --stage "Grade 4" --limit 3

node engine/validate.mjs packs/holy-sai-stage6-maths-numbers.json
#   6 sheets · 44 questions · 111 fields · 0 flagged for human review
#   clean — publishable
```

Open `smart-igcse-player.html` to see the pack rendered. Nothing in the player knows
anything about maths — point it at a Biology pack and it renders that instead.

---

## The parent language layer

`hint` and `explanation` are the two fields a parent reads aloud, so those are the only
two that need translating. The player calls the model per question, on demand, and caches
the result against `questionId:lang` — so each explanation is paid for once, ever, across
every family using that pack. Translating a whole pack up front would cost far more and
most of it would never be read.

Keep numbers and symbols in Western digits even in the translated text. A parent reading
Tamil still needs `275 − 120 = 155` to match what is printed in the child's book.

---

## What this does not solve

**Handwriting.** The extractor is told to ignore pencil and red pen. It cannot mark a
child's handwritten working, only what they type. Photographing completed work for
marking is a genuinely harder problem and a separate feature.

**Diagram-heavy subjects.** Six declarative media kinds cover most of lower-secondary
maths. Geometry, biology diagrams and chemistry apparatus will each need their own kinds
added to the player, or they fall through to `needsHuman`. Expect to add media kinds
steadily for the first year — that is normal and the schema is built for it.

**Free written answers.** `keywords` marks a short explanation by required ideas, which
is honest but blunt. Essay-length writing needs model grading with a rubric, and should
be presented to the parent as feedback rather than as a score.

**Copyright.** A parent photographing their own child's workbook for their own child's
use is one thing; storing extracted publisher content on your servers and serving it to
other families is another. Scope packs to the uploading family until you have cleared
this properly — it is the single biggest legal risk in the product.

---

## Suggested next steps

1. Wire `extract-worksheet.md` + `validate.mjs` into the existing upload endpoint. That
   alone fixes the conversion problem you are hitting today.
2. Replace whatever renders lessons now with `player-app.js`, so content and presentation
   are finally separate.
3. Add `misconception` to extraction. It costs nothing at generation time and it is what
   turns "you got 6/10" into "you are counting terms instead of gaps" — which is the
   thing a parent will actually pay for.
4. Only then build progression/terminal test assembly. It is a query over `skill` tags
   across published packs, which is easy once packs exist and near-impossible before.
