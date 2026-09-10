import type { NumberSceneSpec } from "@/components/interactive/NumberConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 6
// (Fractions, decimals, percentages and proportion) reuses
// NumberConceptScene's existing blocksSplit (fraction-bar shading) and
// equationSolve variants - fits fraction notation directly without a new
// scene component. Every value below is grounded in this unit's real,
// production content (fetched via railway ssh), never invented.
export const UNIT6_CONCEPT_SCENES: Record<string, NumberSceneSpec[]> = {
  "6.1": [
    {
      type: "blocksSplit",
      count: 10,
      shaded: 3,
      unitLabel: "🥧",
      caption: "Sharing 3 pies equally among 10 plates means each plate receives 3/10 of a pie",
    },
    {
      type: "blocksSplit",
      count: 8,
      shaded: 1,
      unitLabel: "💧",
      caption: "Dividing 1 litre of water equally into 8 glasses means each glass gets 1/8 of a litre",
    },
    {
      type: "equationSolve",
      equation: "1 ÷ 10",
      operation: "the fraction bar means division",
      answer: "1/10",
      caption: "A fraction represents sharing an amount into equal parts",
    },
    {
      type: "equationSolve",
      equation: "top ÷ bottom",
      operation: "numerator ÷ denominator",
      answer: "the fraction",
      caption: "Think of the fraction bar as a division sign: top divided by bottom!",
    },
  ],
  "6.2": [
    {
      type: "equationSolve",
      equation: "4/6 and 6/9",
      operation: "both simplify to",
      answer: "2/3",
      caption: "Equivalent fractions are different fractions that name the exact same value",
    },
    {
      type: "blocksSplit",
      count: 4,
      shaded: 2,
      unitLabel: "",
      caption: "Shading 2 out of 4 parts covers the exact same area as shading 1 out of 2 parts, so 2/4 = 1/2",
    },
    {
      type: "equationSolve",
      equation: "1/2",
      operation: "×2/×2",
      answer: "2/4",
      caption: "You can find an equivalent fraction by multiplying both the top and bottom by the same number",
    },
    {
      type: "equationSolve",
      equation: "keep it balanced",
      operation: "top and bottom together",
      answer: "same value",
      caption: "Whatever you do to the top, you must do to the bottom to keep the fraction balanced",
    },
  ],
  "6.3": [
    {
      type: "equationSolve",
      equation: "8/5",
      operation: "5/5 + 3/5",
      answer: "1 and 3/5",
      caption: "8/5 can be thought of as 5/5 plus 3/5, which equals the mixed number 1 and 3/5",
    },
    {
      type: "equationSolve",
      equation: "2 and 1/4",
      operation: "(2 × 4) + 1",
      answer: "9/4",
      caption: "2 and 1/4 equals 9/4 because 2 wholes are 8 fourths, plus 1 more fourth",
    },
    {
      type: "equationSolve",
      equation: "numerator ≥ denominator",
      operation: "",
      answer: "improper fraction",
      caption: "An improper fraction has a numerator that is larger than or equal to its denominator, like 7/5",
    },
    {
      type: "equationSolve",
      equation: "7/5",
      operation: "divide numerator by denominator",
      answer: "1 remainder 2 → 1 and 2/5",
      caption: "If the top is heavy, there is at least one whole hiding inside!",
    },
  ],
  "6.4": [
    {
      type: "equationSolve",
      equation: "3/10 of $50",
      operation: "$50 ÷ 10 = $5, then × 3",
      answer: "$15",
      caption: "To find 3/10 of $50, first divide $50 by 10 to get $5, then multiply $5 by 3",
    },
    {
      type: "equationSolve",
      equation: "1/8 of a bag = 4 marbles",
      operation: "4 × 8",
      answer: "32 marbles",
      caption: "If you know the value of a unit fraction, multiply that value by the denominator to find the whole",
    },
    {
      type: "equationSolve",
      equation: "unit fraction of a quantity",
      operation: "total ÷ denominator",
      answer: "one equal part",
      caption: "To find a unit fraction of an amount, divide the total quantity by the denominator",
    },
    {
      type: "equationSolve",
      equation: "divide, then multiply",
      operation: "÷ bottom, then × top",
      answer: "the part you need",
      caption: "Divide by the bottom to find one part, multiply by the top to get what you need",
    },
  ],
  "6.5": [
    {
      type: "equationSolve",
      equation: "2/5 + 3/10",
      operation: "2/5 → 4/10",
      answer: "4/10 + 3/10 = 7/10",
      caption: "If the denominators are different, first convert to an equivalent fraction with a common denominator",
    },
    {
      type: "equationSolve",
      equation: "7/8 − 1/4",
      operation: "1/4 → 2/8",
      answer: "7/8 − 2/8 = 5/8",
      caption: "Convert the fraction with the smaller denominator to match the larger one before subtracting",
    },
    {
      type: "equationSolve",
      equation: "same denominator",
      operation: "add or subtract numerators only",
      answer: "keep the denominator",
      caption: "When fractions already have the same denominator, add or subtract only the numerators",
    },
    {
      type: "equationSolve",
      equation: "match the bottoms first",
      operation: "",
      answer: "then add or subtract the tops",
      caption: "Never add or subtract the bottom numbers together!",
    },
  ],
};
