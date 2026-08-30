#!/usr/bin/env python3
"""
Loads the easy/moderate/tough progression tests out of
curriculum-english-stage5.json into QuestionPaper rows, and emits the SQL on
stdout (run it through psql).

Why a generator rather than seed.ts: prisma/seed.ts is the catalog seed and is
not run against production, and this machine has no node toolchain at all. The
output is deterministic and idempotent, so re-running is safe.

THE CRITICAL PART is CONCEPT_MAP below. TestAttempt.perConcept keys are
resolved against real Concept.conceptKey values in app/api/attempts/route.ts
and app/api/pack-test-attempts/route.ts - a key that matches nothing is not an
error, it is SILENTLY DROPPED, and the student's ConceptMastery simply never
updates. Every key here was checked against the live database.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "curriculum-english-stage5.json")

UNIT_KEYS = {1: "cambridge-5-english-1", 2: "cambridge-5-english-2"}

# (unit number, tier, question id) -> live Concept.conceptKey
CONCEPT_MAP = {
    (1, "easy", "q1"): "1.1",      # purpose of a fable        -> Features of a fable
    (1, "easy", "q2"): "1.7",      # fact vs opinion           -> Fact vs. opinion
    (1, "moderate", "q1"): "1.2",  # implicit meaning          -> Implicit meaning
    (1, "moderate", "q2"): "1.9",  # compound sentence         -> Sentence types
    (1, "tough", "q1"): "1.9",     # complex sentence/'because'-> Sentence types
    (1, "tough", "q2"): "1.8",     # idiom 'in hot water'      -> Idiomatic phrases
    (2, "easy", "q1"): "2.1",      # third person              -> Features of a biography
    (2, "easy", "q2"): "2.6",      # prefix im-               -> Prefixes and suffixes
    (2, "moderate", "q1"): "2.2",  # time adverbs              -> Chronological order
    (2, "moderate", "q2"): "2.6",  # suffix -ing / doubling    -> Prefixes and suffixes
    (2, "tough", "q1"): "2.6",     # 'travelling' UK rule      -> Prefixes and suffixes
    (2, "tough", "q2"): "2.2",     # 3-step timeline           -> Chronological order
}

# Marks per short-answer question. The source JSON carries a prose rubric but
# no mark total, and full_marks is quoted verbatim to the grader
# (lib/claude.ts gradeShortAnswer), so it has to be a real number rather than
# a default. Split out into the separately-markable parts of each rubric.
MARK_SCHEMES = {
    (1, "moderate", "q2"): (2, [
        "Joins the two sentences into one compound sentence using a coordinating connective - 'and', 'but', 'or', 'so' or 'yet' (1 mark)",
        "Places a comma before that connective (1 mark)",
    ]),
    (1, "tough", "q1"): (2, [
        "Writes one complete complex sentence containing an independent clause and a dependent clause (1 mark)",
        "Uses the subordinating connective 'because' to link them correctly (1 mark)",
    ]),
    (1, "tough", "q2"): (2, [
        "Gives the literal meaning - actually being in physically hot water (1 mark)",
        "Gives the figurative meaning - being in trouble or facing difficulty (1 mark)",
    ]),
    (2, "moderate", "q2"): (1, [
        "Spells it 'stopping', doubling the final 'p' before '-ing' (1 mark)",
    ]),
    (2, "tough", "q1"): (2, [
        "Identifies the UK English rule that a final 'l' doubles before a suffix (1 mark)",
        "Explains that this applies regardless of which syllable is stressed, so 'travel' is an exception to the stress rule (1 mark)",
    ]),
    (2, "tough", "q2"): (3, [
        "Gives three distinct events from Usain Bolt's life in correct chronological order (1 mark)",
        "Opens at least two of them with different adverbial phrases of time, e.g. 'First,' / 'Later on,' / 'In the end,' (1 mark)",
        "Punctuates those opening phrases with a comma after them (1 mark)",
    ]),
}

# The source sentence is ungrammatical ("before whispered the news"). It is
# shown verbatim to a 10-year-old in a reading-comprehension question, so it
# is corrected here rather than loaded as-is.
TEXT_FIXES = {
    (1, "moderate", "q1"): (
        "before whispered the news",
        "before she whispered the news",
    ),
}


def build_question(unit_no, tier, q):
    qid = q["id"]
    key = (unit_no, tier, qid)
    concept = CONCEPT_MAP.get(key)
    if not concept:
        sys.exit(f"FATAL: no concept mapping for {key}")

    text = q["question"]
    if key in TEXT_FIXES:
        bad, good = TEXT_FIXES[key]
        if bad not in text:
            sys.exit(f"FATAL: expected text fix {bad!r} not found in {key}")
        text = text.replace(bad, good)

    if q["type"] == "multiple-choice":
        options = list(q["choices"])
        if q["answer"] not in options:
            sys.exit(f"FATAL: answer not among choices for {key}")
        return {
            "type": "multiple_choice",
            "question": text,
            "options": options,
            "correct_answer": options.index(q["answer"]),
            "concept_tested": concept,
        }

    full_marks, criteria = MARK_SCHEMES[key]
    model = q.get("modelAnswer")
    if model:
        criteria = criteria + [f"Example of a full-mark answer: {model}"]
    return {
        "type": "short_answer",
        "question": text,
        "concept_tested": concept,
        "mark_scheme": {"full_marks": full_marks, "criteria": criteria},
    }


def sql_str(value):
    return "'" + str(value).replace("'", "''") + "'"


def main():
    data = json.load(open(SRC))
    out = ["BEGIN;", ""]

    for unit in data["units"]:
        unit_no = unit["unitNumber"]
        unit_key = UNIT_KEYS[unit_no]

        for tier, body in unit["progressionTest"]["difficultyTiers"].items():
            questions = [build_question(unit_no, tier, q) for q in body["questions"]]
            concepts = sorted({q["concept_tested"] for q in questions})
            payload = json.dumps(questions, ensure_ascii=False)
            covers = "ARRAY[" + ",".join(sql_str(c) for c in concepts) + "]::text[]"
            note = (
                f"{body['instructions']} "
                f"(Loaded from curriculum-english-stage5.json, {len(questions)} questions.)"
            )
            row_id = f"qp-{unit_key}-{tier}"

            out.append(f"-- Unit {unit_no} / {tier}: {len(questions)} questions, concepts {concepts}")

            if unit_no == 1 and tier == "moderate":
                # This unit already has a real, hand-authored moderate paper
                # (3 questions on 1.1-1.3, explicitly noted as a partial
                # draft written when only three concepts existed). Appending
                # keeps that real content and widens coverage to 1.9 instead
                # of throwing three good questions away.
                first_q = questions[0]["question"]
                out.append(
                    'UPDATE "QuestionPaper" q SET\n'
                    f"  questions = q.questions || {sql_str(payload)}::jsonb,\n"
                    f'  "coversConcepts" = ARRAY(SELECT DISTINCT unnest(q."coversConcepts" || {covers}) ORDER BY 1),\n'
                    "  note = 'Hand-authored partial draft (1.1-1.3) plus the loaded moderate tier from curriculum-english-stage5.json.',\n"
                    '  "updatedAt" = now()\n'
                    'FROM "Unit" u\n'
                    f"WHERE u.id = q.\"unitId\" AND u.\"unitKey\" = {sql_str(unit_key)} AND q.difficulty = {sql_str(tier)}\n"
                    # Idempotency: never append the same questions twice.
                    f"  AND NOT q.questions @> jsonb_build_array(jsonb_build_object('question', {sql_str(first_q)}));"
                )
            else:
                out.append(
                    'INSERT INTO "QuestionPaper" (id, "unitId", difficulty, "coversConcepts", note, questions, "createdAt", "updatedAt")\n'
                    f"SELECT {sql_str(row_id)}, u.id, {sql_str(tier)}, {covers}, {sql_str(note)}, {sql_str(payload)}::jsonb, now(), now()\n"
                    f'FROM "Unit" u WHERE u."unitKey" = {sql_str(unit_key)}\n'
                    'ON CONFLICT ("unitId", difficulty) DO UPDATE SET\n'
                    "  questions = EXCLUDED.questions,\n"
                    '  "coversConcepts" = EXCLUDED."coversConcepts",\n'
                    "  note = EXCLUDED.note,\n"
                    '  "updatedAt" = now();'
                )
            out.append("")

    # lib/testPacks.ts caches the converted pack forever (upsert ... update:
    # {}), so a changed paper would otherwise keep serving the old questions.
    # Dropping the cached rows makes the next request rebuild them.
    keys = ",".join(sql_str(k) for k in UNIT_KEYS.values())
    out.append("-- Invalidate cached progression-test packs so they rebuild from the new papers.")
    out.append(
        'DELETE FROM "ContentPack"\n'
        f"WHERE purpose = 'progression_test'\n"
        f'  AND "unitId" IN (SELECT id FROM "Unit" WHERE "unitKey" IN ({keys}));'
    )
    out.append("")

    # Fail the whole transaction rather than half-load if any question points
    # at a concept that does not exist - a silent mastery-write no-op is
    # exactly the failure mode this guards against.
    out.append("-- Guard: every concept_tested must resolve to a real Concept for its unit.")
    out.append(
        "DO $$\nDECLARE bad int;\nBEGIN\n"
        "  SELECT count(*) INTO bad FROM (\n"
        "    SELECT q.\"unitId\", jsonb_array_elements(q.questions)->>'concept_tested' AS ck\n"
        '    FROM "QuestionPaper" q JOIN "Unit" u ON u.id = q."unitId"\n'
        f"    WHERE u.\"unitKey\" IN ({keys})\n"
        "  ) t\n"
        '  LEFT JOIN "Concept" c ON c."unitId" = t."unitId" AND c."conceptKey" = t.ck\n'
        "  WHERE c.id IS NULL;\n"
        "  IF bad > 0 THEN\n"
        "    RAISE EXCEPTION 'ABORT: % question(s) reference a concept_tested key with no matching Concept', bad;\n"
        "  END IF;\n"
        "END $$;"
    )
    out.append("")
    out.append("COMMIT;")
    print("\n".join(out))


if __name__ == "__main__":
    main()
