# HANDOFF — content conversion pipeline

Paste this as the first message of a fresh Claude Code session opened on the SmartIGCSE
repo. It carries everything from the chat where this was designed.

---

## Context

SmartIGCSE lets parents photograph their child's textbook or workbook and get back
interactive, markable practice. The upload → interactive-content conversion is the part
that does not work today.

**Root cause.** Extracted content is stored as prose (definition, key points, examples).
Prose can be read aloud but cannot be answered, so it cannot be marked, so the assessment
engine has nothing to score and the progression logic has nothing to gate on.

**Fix.** Every blank carries a declarative *check* — a rule that decides whether what the
child typed is right. Packs are data only and may never contain code. A model extracting
from a photo gets roughly 1 question in 8 subtly wrong, so extraction output is
mechanically validated and repaired before any child sees it.

## What is already in the repo

```
content/schema/pack.schema.json      the contract
content/engine/checks.js             16 permitted check kinds — the only ways to mark an answer
content/engine/validate.mjs          publish gate; exit 1 blocks release
content/engine/convert.mjs           CLI runner: images -> pack -> validate -> repair
content/engine/player-app.js         renderer; contains no content and no subject knowledge
content/prompts/extract-worksheet.md the vision prompt
content/packs/holy-sai-stage6-maths-numbers.json
                                     worked reference: 6 sheets, 44 questions, 111 fields, validator-clean
```

Read `content/README.md` first. Read the reference pack second — it is the ground truth
for what good output looks like.

## Task

Convert the ~20 scanned English textbook pages already sitting in application storage,
and report honestly on where the schema breaks.

1. **Locate the pages.** Find how uploads are persisted (S3 bucket, local volume, DB
   blob) and implement the `loadPages` adapter at the top of `content/engine/convert.mjs`.
   That function is the only thing standing between the runner and real data — leave the
   rest alone.
2. **Run the conversion** on 3 pages first, not 20. Inspect the pack by hand against the
   scans before spending tokens on the rest.
3. **Run the validator.** Every error must be resolved either by a repair pass or by
   flagging `needsHuman: true` with a reason. Do not silence a rule to make it pass — the
   rules encode real failure modes.
4. **Render it.** Load the pack into `player-app.js` and click through every question.
5. **Report what broke.** English will stress parts of the schema that maths never
   touched. Expect at least these, and say plainly which ones bit:
   - comprehension answers where many wordings are correct — is `keywords` good enough,
     or is a rubric-graded kind needed?
   - questions that make no sense without reprinting a passage — see the copyright note
     below before designing around this
   - grammar tables and cloze/gap-fill layouts the current `table` shape may not express
   - any diagram or figure with no matching `media` kind

## Rules for this work

- **Never invent content.** If a page is unreadable, the question is flagged, not guessed.
  A wrong answer key is worse than a missing question because the child gets marked wrong
  for being right.
- **Ignore handwriting.** The scans contain pencil answers and red teacher marks. They are
  neither the question nor the answer key. Solve each question independently.
- **Packs stay data.** Adding a new capability means adding a check kind to `checks.js`, a
  rule to `validate.mjs`, and a case to `player-app.js` — never a function inside a pack.
- **Extend, do not loosen.** If English needs a new check kind or media kind, add it and
  update the schema enum. Do not widen an existing kind until it accepts anything.
- **Copyright.** A scanned published textbook is the copyrighted work itself, unlike a
  school-made maths worksheet. Store extracted passages scoped to the uploading family
  only; do not build anything that serves one family's extracted textbook content to
  another. Raise it rather than quietly shipping it.

## Definition of done

- `node content/engine/validate.mjs content/packs/<english-pack>.json` exits 0
- every question renders and marks correctly in the player
- a written list of schema gaps English exposed, with a proposed check/media kind for each
- token and wall-clock cost per page, so per-upload unit economics can be worked out
