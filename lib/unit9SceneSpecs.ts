import type { NumberSceneSpec } from "@/components/interactive/NumberConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 9
// (Calculation) reuses NumberConceptScene's existing numberLine/
// equationSolve/partialProducts/expressionSteps variants - the same
// shapes proven on Units 1, 3, and 7, no new scene component needed.
// Every value below is grounded in this unit's real, production content
// (fetched via railway ssh), never invented.
export const UNIT9_CONCEPT_SCENES: Record<string, NumberSceneSpec[]> = {
  "9.1": [
    {
      type: "equationSolve",
      equation: "1972 + 28",
      operation: "bridge to a neat 2000",
      answer: "2000",
      caption: "Add 28 directly to 1972 to make a neat 2000 before adding other quantities",
    },
    {
      type: "numberLine",
      from: -160,
      to: 10,
      marker: -155,
      path: [5, 0, -155],
      caption: "Starting at 5 and subtracting 160: jump back 5 to reach zero, then 155 more to reach -155",
    },
    {
      type: "equationSolve",
      equation: "Round first",
      operation: "estimate before calculating",
      answer: "check the final answer is reasonable",
      caption: "Rounding numbers before calculating provides a sensible estimate to check your answer",
    },
    {
      type: "equationSolve",
      equation: "Bridge through 0, 10, 100...",
      operation: "friendly benchmark numbers",
      answer: "makes big jumps easier",
      caption: "Bridge through friendly benchmark numbers like zero, ten, or multiples of one hundred",
    },
  ],
  "9.2": [
    {
      type: "equationSolve",
      equation: "3.4 + 2.3",
      operation: "(3 + 2) + (0.4 + 0.3)",
      answer: "5.7",
      caption: "Split into whole numbers (3 + 2 = 5) and tenths (0.4 + 0.3 = 0.7) to give 5.7",
    },
    {
      type: "equationSolve",
      equation: "6.8 - 2.5",
      operation: "6.8 - 2 = 4.8, then - 0.5",
      answer: "4.3",
      caption: "Take away 2 wholes to get 4.8, then take away 5 tenths to get 4.3",
    },
    {
      type: "equationSolve",
      equation: "0.4 + 0.3",
      operation: "4 tenths + 3 tenths",
      answer: "7 tenths (0.7)",
      caption: "Ten tenths make one whole, so whenever tenths add up to ten or more, regroup as one whole",
    },
    {
      type: "equationSolve",
      equation: "keep place values aligned",
      operation: "",
      answer: "",
      caption: "Always keep the decimal points lined up so you never mix up whole ones with tenths",
    },
  ],
  "9.3": [
    {
      type: "partialProducts",
      factors: [247, 26],
      parts: [
        { label: "247 × 6", value: 1482 },
        { label: "247 × 20", value: 4940 },
      ],
      total: 6422,
      caption: "Partition 26 into 20 and 6, multiply 247 by each part, then add them together",
    },
    {
      type: "equationSolve",
      equation: "43 × 20",
      operation: "double 43 = 86, then × 10",
      answer: "860",
      caption: "To multiply 43 by 20 mentally, double 43 to get 86, then multiply by 10",
    },
    {
      type: "equationSolve",
      equation: "× tens digit",
      operation: "every value shifts one column left",
      answer: "placeholder 0 in ones column",
      caption: "When you multiply by the tens digit, put your placeholder zero in the ones column first",
    },
    {
      type: "equationSolve",
      equation: "48 × 65 estimate",
      operation: "round to 50 × 70",
      answer: "≈ 3500",
      caption: "Round both numbers to the nearest ten to estimate: 50 × 70 = 3500",
    },
  ],
  "9.4": [
    {
      type: "equationSolve",
      equation: "694 ÷ 3",
      operation: "short division",
      answer: "231 r 1",
      caption: "694 divided by 3 gives 231 full groups with a remainder of 1",
    },
    {
      type: "equationSolve",
      equation: "85 ÷ 4",
      operation: "21 remainder 1",
      answer: "21 and 1/4",
      caption: "85 shared equally among 4 leaves 1 part left over, expressed as 21 and 1/4",
    },
    {
      type: "equationSolve",
      equation: "remainder as a fraction",
      operation: "leftover ÷ divisor",
      answer: "numerator over denominator",
      caption: "A leftover remainder becomes the top number of your fraction, and the divisor stays on the bottom",
    },
    {
      type: "equationSolve",
      equation: "check your answer",
      operation: "quotient × divisor + remainder",
      answer: "= original number",
      caption: "Multiply your answer by the divisor, add any remainder, and see if you get the original number back",
    },
  ],
  "9.5": [
    {
      type: "expressionSteps",
      steps: ["5 + 6 × 2", "5 + 12", "17"],
      caption: "Solve 6 × 2 first to get 12, then add 5 to equal 17",
    },
    {
      type: "expressionSteps",
      steps: ["36 ÷ 4 − 5", "9 − 5", "4"],
      caption: "Divide 36 by 4 first to get 9, then subtract 5 to get 4",
    },
    {
      type: "expressionSteps",
      steps: ["× and ÷ first", "then + and −"],
      caption: "Multiplication and division always take precedence over addition and subtraction",
    },
    {
      type: "expressionSteps",
      steps: ["10 − 3 + 5", "left to right", "7 + 5", "12"],
      caption: "Addition and subtraction have equal priority and are completed from left to right",
    },
  ],
};
