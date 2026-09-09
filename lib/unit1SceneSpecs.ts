import type { NumberSceneSpec } from "@/components/interactive/NumberConceptScene";

// Real user request 2026-09-09: "Rest of Math Unit 1 (recommended)" - extend
// the scene-synced-to-checkpoint pattern proven on concept 1.1 (see
// DECIMAL_PILOT_CONCEPT_ID) to concepts 1.2-1.5, reusing the same
// buildCheckpoints() 4-step shape (intro/definition, examples, key_points,
// tip). Every value below is grounded in this unit's real, already-verified
// production content (definition/examples/tips fetched from the live DB),
// never invented - matching the "strictly correct" standard used everywhere
// else content is generated for this app.
export const UNIT1_CONCEPT_SCENES: Record<string, NumberSceneSpec[]> = {
  "1.2": [
    {
      type: "placeValueChart",
      columns: ["Tens", "Ones", "", "Tenths"],
      values: [4, 5, "•", 8],
      caption: "45.8 has 4 tens, 5 ones, and 8 tenths",
    },
    {
      type: "regroup",
      from: "45.8",
      to: "40 + 5 + 0.8",
      caption: "Decomposing splits 45.8 into its place-value parts",
    },
    {
      type: "regroup",
      from: "3.4 = 3 wholes, 4 tenths",
      to: "2 wholes + 14 tenths",
      caption: "Regrouping trades 1 whole for 10 tenths - the total is still 3.4",
    },
    {
      type: "placeValueChart",
      columns: ["Tens", "Ones", "", "Tenths"],
      values: ["T", "O", "•", "t"],
      caption: "Decomposing splits by columns; regrouping trades between columns",
    },
  ],
  "1.3": [
    {
      type: "digitShift",
      before: "36",
      after: "3600",
      direction: "left",
      places: 2,
      caption: "Multiplying by 100 shifts every digit 2 places to the left",
    },
    {
      type: "digitShift",
      before: "36",
      after: "3600",
      direction: "left",
      places: 2,
      caption: "36 × 100 = 3600",
    },
    {
      type: "digitShift",
      before: "5380",
      after: "538",
      direction: "right",
      places: 1,
      caption: "5380 ÷ 10 = 538 - each digit shifts 1 place right",
    },
    {
      type: "digitShift",
      before: "36",
      after: "3600",
      direction: "left",
      places: 2,
      caption: "Left = bigger (×10, ×100, ×1000); right = smaller (÷10, ÷100, ÷1000)",
    },
  ],
  "1.4": [
    {
      type: "numberLine",
      from: -5,
      to: 5,
      marker: 0,
      caption: "Negative numbers sit to the left of 0 on the number line",
    },
    {
      type: "numberLine",
      from: -10,
      to: 8,
      marker: -9,
      path: [6, 1, -4, -9],
      caption: "Counting back in steps of 5 from 6 gives 1, then -4, then -9",
    },
    {
      type: "numberLine",
      from: -5,
      to: 5,
      marker: 3,
      path: [-2, 3],
      caption: "Starting at -2 degrees and rising 5 degrees crosses 0 and reaches 3 degrees",
    },
    {
      type: "numberLine",
      from: -5,
      to: 5,
      marker: 0,
      caption: "Think of a thermometer - 0 is the line between positive and negative",
    },
  ],
  "1.5": [
    {
      type: "sequenceSteps",
      terms: [3, 11, 19, 27],
      rule: "+8",
      caption: "Each term follows the last by adding a constant number",
    },
    {
      type: "sequenceSteps",
      terms: [3, 11, 19, 27],
      rule: "+8",
      caption: "3, 11, 19, 27: the difference is always 8, so the rule is add 8",
    },
    {
      type: "sequenceSteps",
      terms: [8, "", 14],
      rule: "+3",
      caption: "Between 8 and 14 the gap is 6; split into 2 equal steps of 3 to find the missing term, 11",
    },
    {
      type: "sequenceSteps",
      terms: [3, 11, 19, 27],
      rule: "+8",
      caption: "Always check that the difference between neighbouring terms stays the same",
    },
  ],
};
