# Per-unit concept extraction from a whole textbook

Used by `lib/textbookConceptExtraction.ts` to fill in the Learn-phase `Concept` rows for ONE unit
that was created via the table-of-contents textbook upload (`lib/textbookToc.ts` /
`createUnitsFromTextbook`). That flow attaches the *entire* uploaded PDF to every created unit as a
`UnitResource` - it never splits the book by unit. This prompt is the piece that finally reads the
whole book but writes content for only the one unit named in the request, since the existing
page-photo extraction prompts (`EXTRACTION_SYSTEM_PROMPT` / `FREEFORM_EXTRACTION_SYSTEM_PROMPT` in
`lib/claude.ts`) assume a handful of discrete page images, not "the relevant few dozen pages inside
a 150+ page book."

---

## SYSTEM

You are structuring curriculum content for a voice-led tutoring app, from ONE textbook that covers
MANY units. You are given the WHOLE book, plus the exact title of ONE unit within it and that
unit's position among the book's other units (e.g. "unit 5 of 18").

Find that unit's own section of the book using its title and position, and extract concepts ONLY
from that section. Completely ignore every other unit's content, even if it looks related.

CRITICAL - originality: Write your OWN explanations of what that section teaches, in your own
words, the way a tutor would explain it out loud. Do NOT copy or closely paraphrase sentences
directly from the book - this becomes original teaching content, not a reproduction of it.

Propose a sensible breakdown of THIS UNIT ONLY into distinct concepts/topics it actually covers -
however many the material genuinely supports (typically 2-6), never padding out topics that aren't
really there. For each concept, produce:
- concept_id: a short id in "{unit_number}.M" form, numbered in teaching order (e.g. "5.1", "5.2")
- concept_name: a short, clear topic name
- definition: 1-2 original sentences, grade-appropriate
- key_points: 2-4 original bullet points
- examples: 1-2 original examples
- tips_to_remember: 1 short original memory tip
- voice_qa_samples: 3-4 short PRACTICE PROBLEMS the student solves, not curiosity trivia - real
  feedback 2026-09-08: "Math unit 1 is more like conversation, not making much sense... this is not
  a language... give example exercises, 2-4 sums per topic so they are clear and answer correctly."
  If the concept involves calculation or problem-solving (most Math concepts, and many Science
  ones), each "question" must be a real, specific, solvable problem in that concept's own
  vocabulary/numbers (e.g. "What is 0.5 + 0.3?", not "What does the tenths place mean?"), and
  "answer" the specific correct result, stated plainly (e.g. "0.8"). If the concept genuinely has no
  solvable-problem shape (e.g. a purely descriptive/reading concept), fall back to a real
  comprehension question with one clear correct answer instead of a made-up problem - never invent
  a problem that doesn't actually fit the concept just to force this shape.

Also report page_start and page_end: the actual PDF page numbers (this file's own page position,
counting the very first page of the file as page 1 - NOT any printed page number in the book,
which may differ) where this unit's section begins and ends.

Respond with ONLY a JSON object, no markdown fences, no commentary:
{"page_start": number, "page_end": number, "concepts": [{"concept_id": string, "concept_name": string, "definition": string, "key_points": string[], "examples": string[], "tips_to_remember": string[], "voice_qa_samples": [{"question": string, "answer": string}]}]}

If you cannot clearly find this unit's own section in the book (title doesn't match anything, or
the position doesn't line up with what's actually printed), do not guess or borrow another unit's
content - respond with {"error": "..."} explaining what's missing instead.

---

## After the model returns

`lib/textbookConceptExtraction.ts` parses this into `Concept` rows (`source: "extracted"`,
`status: "drafted"`), one per returned entry, with no `sourceImagePath` (there is no single page
image for a whole-book extraction - `lib/conceptIllustration.ts`'s generated illustrations are the
picture these concepts get instead, exactly as they already are for AI-generated concepts with no
source photo).

`page_start`/`page_end` let the caller render a few real pages from this unit's own section
(`lib/pdfCrop.ts`'s `renderPdfPageToPng`, already used for diagram cropping) and save them as
`UploadedPage` rows - real feedback 2026-09-08: a parent testing the first textbook-sourced unit
could see the lesson content but not the actual book pages it came from. This is what makes the
existing "pages we're working from" booklet (already built for the photo-upload flow) show real
pages for a textbook-sourced unit too, without needing the whole book rendered.
