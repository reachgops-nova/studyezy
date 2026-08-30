#!/usr/bin/env python3
"""
Appends the three textbook-grounded Unit 1 questions from
studyezy-p1-workbook-tests.json to Unit 1's existing easy/moderate/tough
QuestionPapers, and emits SQL on stdout (run it through psql).

APPENDS rather than replaces: Unit 1's three papers already hold real
questions (the hand-authored moderate draft plus the tier loaded from
curriculum-english-stage5.json - see scripts/load-progression-tests.py).
These new ones are grounded in the actual fable text ('Why Cockerels Crow',
Hyena's wife, the spiky comb), which the earlier generic ones were not, so
they widen the paper rather than replace it.

THE CRITICAL NORMALIZATION: this source writes concept_tested as
"Concept 1.1", not "1.1". Concept keys are resolved against
Concept.conceptKey in app/api/attempts/route.ts and
app/api/pack-test-attempts/route.ts, and a key that matches nothing is not
an error - it is silently skipped, so the student's ConceptMastery would
never update and nobody would ever see a failure. The "Concept " prefix is
stripped here and the whole transaction aborts if any key fails to resolve.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "studyezy-p1-workbook-tests.json")
UNIT_KEY = "cambridge-5-english-1"


def concept_key(raw):
    """'Concept 1.3' -> '1.3'. Anything unrecognized is a hard failure."""
    if not raw:
        sys.exit("FATAL: question has no concept_tested")
    m = re.search(r"(\d+\.\d+)", str(raw))
    if not m:
        sys.exit(f"FATAL: cannot parse a concept key out of {raw!r}")
    return m.group(1)


def build(q):
    ck = concept_key(q.get("concept_tested"))
    if q.get("type") == "short_answer":
        rub = q.get("rubric", {})
        criteria = []
        if rub.get("criteria"):
            criteria.append(rub["criteria"])
        # The rubric's `points` map is the real per-mark breakdown; each entry
        # becomes one markable criterion so full_marks is a real number rather
        # than a guess, and the child sees the stages in the explanation.
        for stage, text in (rub.get("points") or {}).items():
            criteria.append(f"{stage.capitalize()}: {text} (1 mark)")
        return {
            "type": "short_answer",
            "question": q["question"],
            "concept_tested": ck,
            "mark_scheme": {
                "full_marks": max(1, len(rub.get("points") or {})),
                "criteria": criteria,
            },
        }

    options = list(q["options"])
    if q["answer"] not in options:
        sys.exit(f"FATAL: answer not among options for {q['question'][:40]!r}")
    return {
        "type": "multiple_choice",
        "question": q["question"],
        "options": options,
        "correct_answer": options.index(q["answer"]),
        "concept_tested": ck,
    }


def sql_str(v):
    return "'" + str(v).replace("'", "''") + "'"


def main():
    data = json.load(open(SRC))
    tiers = data["progressive_evaluations"]["unit_1_tests"]
    out = ["BEGIN;", ""]

    for tier, body in tiers.items():
        questions = [build(q) for q in body["questions"]]
        if not questions:
            continue
        payload = json.dumps(questions, ensure_ascii=False)
        concepts = sorted({q["concept_tested"] for q in questions})
        covers = "ARRAY[" + ",".join(sql_str(c) for c in concepts) + "]::text[]"
        first_q = questions[0]["question"]

        out.append(f"-- Unit 1 / {tier}: +{len(questions)} question(s), concepts {concepts}")
        out.append(
            'UPDATE "QuestionPaper" q SET\n'
            f"  questions = q.questions || {sql_str(payload)}::jsonb,\n"
            f'  "coversConcepts" = ARRAY(SELECT DISTINCT unnest(q."coversConcepts" || {covers}) ORDER BY 1),\n'
            '  "updatedAt" = now()\n'
            'FROM "Unit" u\n'
            f"WHERE u.id = q.\"unitId\" AND u.\"unitKey\" = {sql_str(UNIT_KEY)} AND q.difficulty = {sql_str(tier)}\n"
            # Idempotency: never append the same question twice.
            f"  AND NOT q.questions @> jsonb_build_array(jsonb_build_object('question', {sql_str(first_q)}));"
        )
        out.append("")

    out.append("-- Rebuild the cached packs from the widened papers.")
    out.append(
        'DELETE FROM "ContentPack"\n'
        "WHERE purpose = 'progression_test'\n"
        f'  AND "unitId" IN (SELECT id FROM "Unit" WHERE "unitKey" = {sql_str(UNIT_KEY)});'
    )
    out.append("")
    out.append("-- Guard: abort unless every concept_tested resolves to a real Concept.")
    out.append(
        "DO $$\nDECLARE bad int;\nBEGIN\n"
        "  SELECT count(*) INTO bad FROM (\n"
        "    SELECT q.\"unitId\", jsonb_array_elements(q.questions)->>'concept_tested' AS ck\n"
        '    FROM "QuestionPaper" q JOIN "Unit" u ON u.id = q."unitId"\n'
        f"    WHERE u.\"unitKey\" = {sql_str(UNIT_KEY)}\n"
        "  ) t\n"
        '  LEFT JOIN "Concept" c ON c."unitId" = t."unitId" AND c."conceptKey" = t.ck\n'
        "  WHERE c.id IS NULL;\n"
        "  IF bad > 0 THEN\n"
        "    RAISE EXCEPTION 'ABORT: % question(s) reference an unresolvable concept_tested key', bad;\n"
        "  END IF;\n"
        "END $$;"
    )
    out.append("")
    out.append("COMMIT;")
    print("\n".join(out))


if __name__ == "__main__":
    main()
