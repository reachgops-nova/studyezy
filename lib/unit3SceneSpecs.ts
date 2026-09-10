import type { NumberSceneSpec } from "@/components/interactive/NumberConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 3
// (Calculation) reuses NumberConceptScene's existing numberLine variant
// for 3.1, and adds three new lightweight variants (expressionSteps,
// equationSolve, partialProducts - see NumberConceptScene.tsx) for the
// mental-maths/multiplication concepts, rather than a whole new scene
// component. Every value below is grounded in this unit's real,
// production content (fetched via railway ssh), never invented.
export const UNIT3_CONCEPT_SCENES: Record<string, NumberSceneSpec[]> = {
  "3.1": [
    {
      type: "numberLine",
      from: -5,
      to: 5,
      marker: 0,
      caption: "0 acts as a bridge when moving between positive and negative numbers",
    },
    {
      type: "numberLine",
      from: -5,
      to: 9,
      marker: 5,
      path: [-4, 0, 5],
      caption: "Starting at -4 and adding 9: jump 4 steps right to 0, then 5 more to land on 5",
    },
    {
      type: "numberLine",
      from: -5,
      to: 5,
      marker: -4,
      path: [5, 0, -4],
      caption: "Starting at 5 and subtracting 9: jump 5 steps left to 0, then 4 more to reach -4",
    },
    {
      type: "numberLine",
      from: -5,
      to: 5,
      marker: 0,
      caption: "Always aim for 0 first when crossing the line, then see how much more you have left to jump",
    },
  ],
  "3.2": [
    {
      type: "expressionSteps",
      steps: ["3804 + 2043", "≈ 3800 + 2000", "= 5800"],
      caption: "Rounding large numbers before calculating gives an estimate to spot mistakes",
    },
    {
      type: "expressionSteps",
      steps: ["94 + 2328 + 306", "(94 + 306) + 2328", "400 + 2328", "2728"],
      caption: "Swap the order to pair 94 and 306 first to make 400, then add 2328 to get 2728",
    },
    {
      type: "expressionSteps",
      steps: ["− 499", "− 500, then + 1"],
      caption: "Near-multiples can be adjusted quickly, like subtracting 500 instead of 499, then adding 1 back",
    },
    {
      type: "expressionSteps",
      steps: ["7 + 3 = 10"],
      caption: "Look for pairs of digits that add up to 10 before you start adding in order",
    },
  ],
  "3.3": [
    {
      type: "equationSolve",
      equation: "? + 6 = 15",
      operation: "subtract 6 from both sides",
      answer: "? = 9",
      caption: "Missing number puzzles use shapes or symbols for a quantity we don't know yet",
    },
    {
      type: "equationSolve",
      equation: "3 × truck = $18",
      operation: "divide both sides by 3",
      answer: "truck = $6",
      caption: "If 3 identical toy trucks cost $18 altogether, one truck costs $18 ÷ 3 = $6",
    },
    {
      type: "equationSolve",
      equation: "□ + □ + □ = 18",
      operation: "18 ÷ 3",
      answer: "□ = 6",
      caption: "If an equation has multiple identical shapes, divide the total equally to find one shape's value",
    },
    {
      type: "equationSolve",
      equation: "? + 6 = 15",
      operation: "use the opposite operation",
      answer: "? = 15 − 6",
      caption: "To find a missing part, use the opposite operation to work backward",
    },
  ],
  "3.4": [
    {
      type: "expressionSteps",
      steps: ["19 × 5", "(20 × 5) − (1 × 5)", "100 − 5", "95"],
      caption: "Break a tricky factor into two simpler numbers, like multiplying by 20 and taking 1 away",
    },
    {
      type: "expressionSteps",
      steps: ["25 × 33 × 4", "25 × 4 × 33", "100 × 33", "3300"],
      caption: "Regroup and reorder factors to create a helpful multiple of 10 - here, 25 × 4 = 100",
    },
    {
      type: "expressionSteps",
      steps: ["a × (b + c)", "(a × b) + (a × c)"],
      caption: "The distributive law lets you break a tricky factor into two simpler numbers",
    },
    {
      type: "expressionSteps",
      steps: ["25 × 4 = 100", "50 × 2 = 100"],
      caption: "Whenever you see numbers like 25 and 4, or 50 and 2, pair them up first to make 100",
    },
  ],
  "3.5": [
    {
      type: "partialProducts",
      factors: [234, 3],
      parts: [
        { label: "200 × 3", value: 600 },
        { label: "30 × 3", value: 90 },
        { label: "4 × 3", value: 12 },
      ],
      total: 702,
      caption: "Multi-digit multiplication partitions numbers into hundreds, tens, and ones, then adds the partial products",
    },
    {
      type: "partialProducts",
      factors: [34, 13],
      parts: [
        { label: "30 × 10", value: 300 },
        { label: "30 × 3", value: 90 },
        { label: "4 × 10", value: 40 },
        { label: "4 × 3", value: 12 },
      ],
      total: 442,
      caption: "To multiply 34 by 13, split into 30+4 and 10+3, multiply the four sections, then sum them",
    },
    {
      type: "partialProducts",
      factors: [234, 3],
      parts: [
        { label: "200 × 3", value: 600 },
        { label: "30 × 3", value: 90 },
        { label: "4 × 3", value: 12 },
      ],
      total: 702,
      caption: "An area or grid model shows how each place-value part multiplies with the other parts",
    },
    {
      type: "partialProducts",
      factors: [34, 13],
      parts: [
        { label: "30 × 10", value: 300 },
        { label: "30 × 3", value: 90 },
        { label: "4 × 10", value: 40 },
        { label: "4 × 3", value: 12 },
      ],
      total: 442,
      caption: "Never forget the placeholder 0 in the ones column when you multiply by the tens digit",
    },
  ],
};
