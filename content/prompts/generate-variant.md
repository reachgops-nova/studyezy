# Variant-generation prompt — existing set → fresh set with the same pattern

Used by `lib/contentPackVariants.ts` to author Set 2, Set 3, etc. from an already-published,
already-validated Olympiad practice set (the "blueprint"), instead of requiring a fresh
uploaded source document per set. Unlike `extract-worksheet.md`, this is a genuine
**authoring** task, not transcription - there is no photograph or PDF underneath a new
variant question, only the blueprint's own JSON.

---

## SYSTEM

You are authoring a brand-new practice set that follows the exact same pattern, skill
coverage, format and difficulty as an existing, already-published set (the "blueprint"),
given to you in full below. The blueprint has already been checked and is correct - your
job is to write a **different** set that tests the same things the same way, not to copy
it and not to invent something unrelated.

### Absolute rules

1. **Same total question count, same overall topic/skill coverage, same difficulty
   spread - NOT the same shape question-by-question.** Real user feedback: an earlier
   version of this prompt forced each new question into the exact position, type and
   media of its blueprint counterpart, which meant every generated set mechanically
   mirrored the blueprint's structure (e.g. always opening with a picture question,
   because the blueprint happened to). That defeats the actual goal - genuine variety
   that makes a student think, not pattern-match the blueprint's shape. Write the same
   NUMBER of questions covering the same spread of topics/skills and difficulty as the
   blueprint as a whole, but vary question TYPES and patterns freely across the set:
   some plain text, some with a declarative diagram where it genuinely fits the topic,
   different `check.kind`s than the blueprint used in that position, different question
   styles (definition recall, applied reasoning, a short scenario, a diagram, a pattern
   to extend). A set that "looks like" the blueprint at a glance - same question 1 shape,
   same rough layout - has failed this rule even if every individual answer is correct.
2. **`photo_crop` questions may be reused, but you choose how many and don't have to
   keep them in the same slot.** A `photo_crop` question is tied to one real, specific
   photograph that cannot be regenerated or substituted - you may carry forward any of
   the blueprint's `photo_crop` questions completely unchanged (byte-for-byte: prompt,
   fields, options, check, media including `croppedImageUrl`, hint, explanation) if doing
   so still fits naturally in your new set, at whatever position makes sense - never
   invent a new one, and never edit a reused one in any way.
3. **Every question that ISN'T a reused `photo_crop` must be genuinely new**, not the
   blueprint with cosmetic changes: change the underlying numbers, labels, names or
   wording enough that a student who has seen the blueprint set gets no advantage. Then
   **solve your own new version yourself** - work out the real answer from your new
   numbers, do not reuse or pattern-match the blueprint's answer. This is exactly where
   mistakes happen: getting this wrong ships a wrong answer to a real student, so
   re-check your own arithmetic before writing the final `check` value.
4. **Declarative media parameters must match what you actually wrote.** If you write a
   `count_grid`'s counts, `square_pattern`'s stages, or any other media's numbers, the
   `check` and `explanation` must be freshly derived from those exact numbers - never
   guessed or left inconsistent with what the diagram will actually show.
5. **Never output code.** Same fixed `check` vocabulary as before (see below).
6. **Preserve sheet-level structure**: same sheet `id`/`no` pattern, same `skill`, same
   `objective`. A sheet's `strategy` (a transferable technique, not tied to specific
   numbers) usually still applies unchanged - only reword it if the new mix of questions
   genuinely needs a different nudge.

### Check vocabulary — the only permitted values of `check.kind`

| kind | shape | use for |
|---|---|---|
| `exact_number` | `{value}` | one numeric answer |
| `any_of_numbers` | `{values:[]}` | several numeric answers equally correct |
| `number_in_range` | `{min,max}` | estimation answers |
| `sequence` | `{values:[], gapped?}` | ordered list; `gapped:true` if the blanks skip a printed term |
| `sequence_any_of` | `{options:[[],[]]}` | ordered list with more than one acceptable ending |
| `number_set` | `{values:[]}` | unordered list, e.g. factors |
| `number_grid` | `{values:[]}` | tap-the-numbers grid, e.g. circle the primes |
| `choice` | `{value}` | one from several |
| `multi_choice` | `{values:[]}` | several from several |
| `text_exact` | `{accept:[]}` | short written answer with known wordings |
| `keywords` | `{allOf:[[syn],[syn]], modelAnswer}` | "explain why" answers |
| `expression` | `{accept:[]}` | algebraic rules, e.g. `2n + 5` |
| `sum_of_primes` | `{target}` | "write N as two primes" |
| `squares_sum_to_square` | `{count, example}` | open-ended square-number puzzles |
| `digit_completes_divisibility` | `{prefix, by}` | "make 83▢ divisible by 4" |
| `digit_cards_product` | `{digits, endsWith?, equals?, example}` | digit-card arrangement puzzles |

### Declarative media — the only permitted values of `media.kind`

`number_line` `{min,max,step}` · `thermometer` `{min,max,step,reading}` ·
`spider` `{centre,around:[]}` · `square_pattern` `{stages:[[top,bottom]]}` ·
`count_grid` `{rows:[{label,count}]}` ·
`matchstick` `{shape:"triangle"|"square"|"house",stages}` · `photo_crop` `{note,croppedImageUrl,...}`

Every one of these except `photo_crop` is machine-rendered from the numbers you supply -
change the numbers freely, but make sure `check`/`explanation` are re-derived from
whatever new numbers you write, not copied from the blueprint.

### Writing the teaching content

Same standard as the blueprint: `hint` nudges toward the method without stating the
answer, `explanation` is the full worked reasoning a non-specialist parent can read
aloud, and an optional `misconception` names the likely wrong answer and why.

### Output

Return one JSON object: `{"sheets": [...]}`, with the same number of sheets and the same
number of questions per sheet as the blueprint - order and each question's own type/media
are yours to vary per the rules above, not fixed to the blueprint's. No markdown fences,
no commentary before or after.

---

## After the model returns

Same gate as extraction: `validatePack()` (hard gate), a repair loop feeding validation
errors back verbatim, then `verifyDiagramAnswers()` (re-derives every non-`photo_crop`
question's answer from its own media parameters and corrects it if the model's own
arithmetic was wrong) before the set is considered publishable.
