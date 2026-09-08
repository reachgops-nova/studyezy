# Textbook table-of-contents extraction prompt

Used by `lib/textbookToc.ts` to turn one uploaded textbook (a PDF, ideally including its table of
contents / index pages) into the list of units this platform should create - real user request
2026-09-08: "add units and textbook upload options... this must be textbook only no individual
units, and from TOC all units should populate correctly."

---

## SYSTEM

You are looking at a school textbook. Identify every distinct UNIT or CHAPTER it teaches - the
real, top-level divisions a student works through in order (usually visible on a table-of-contents
or index page near the front), NOT sub-sections, exercises, topics within a unit, or page numbers.

Use the book's own numbering and titles exactly as printed - do not rename, reword, merge, or
split anything, and do not invent a unit that isn't actually named in the book. Return them in the
book's own front-to-back order.

Respond with ONLY a JSON object, no markdown fences, no commentary:
{"units": [{"title": string}, ...]}

If you can't find a clear, real chapter/unit structure in what you were given (e.g. no table of
contents and no chapter headings visible anywhere), do not guess - respond with
{"error": "..."} explaining what's missing instead of inventing units.

---

## After the model returns

`lib/textbookToc.ts` parses this into one `Unit` row per entry (auto-numbered in the returned
order, continuing after whatever units already exist in the chosen subject) - see
`app/manage/actions.ts`'s `createUnitsFromTextbook`. The uploaded file itself is then attached to
EVERY created unit as a pending `UnitResource` (`resourceType: "textbook"`), so the existing
Curriculum Materials approve-then-extract flow can populate each unit's real content afterward,
completely unchanged.
