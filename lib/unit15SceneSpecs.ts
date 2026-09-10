import type { NumberSceneSpec } from "@/components/interactive/NumberConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 15
// (Calculation) reuses NumberConceptScene's existing equationSolve/
// expressionSteps/partialProducts variants - the same shapes proven on
// Units 1, 3, 7, and 9, no new scene component needed. Every value below
// is grounded in this unit's real, production content (fetched via
// railway ssh), never invented.
export const UNIT15_CONCEPT_SCENES: Record<string, NumberSceneSpec[]> = {
  "15.1": [
    {
      type: "equationSolve",
      equation: "star + star + star = 21",
      operation: "21 / 3",
      answer: "star = 7",
      caption: "If three identical stars add up to 21, divide 21 by 3 to find that each star is equal to 7",
    },
    {
      type: "equationSolve",
      equation: "100 - triangle = 30",
      operation: "100 - 30",
      answer: "triangle = 70",
      caption: "In the equation 100 minus a triangle equals 30, subtract 30 from 100 to discover that the triangle represents 70",
    },
    {
      type: "equationSolve",
      equation: "addition <-> subtraction",
      operation: "multiplication <-> division",
      answer: "inverse operations undo each other",
      caption: "Inverse operations undo each other, meaning addition is reversed by subtraction and multiplication is reversed by division",
    },
    {
      type: "equationSolve",
      equation: "work backward",
      operation: "do the opposite operation",
      answer: "find the unknown",
      caption: "To find an unknown, work backward and do the opposite operation: subtract to undo addition, and divide to undo multiplication",
    },
  ],
  "15.2": [
    {
      type: "expressionSteps",
      steps: ["4 + 6 x 3", "4 + 18", "22"],
      caption: "In 4 + 6 x 3, multiply 6 by 3 first to get 18, then add 4 to reach the correct answer of 22",
    },
    {
      type: "expressionSteps",
      steps: ["20 - 10 / 2", "20 - 5", "15"],
      caption: "In 20 - 10 / 2, divide 10 by 2 first to get 5, then subtract 5 from 20 to get 15",
    },
    {
      type: "equationSolve",
      equation: "brackets",
      operation: "always solved first",
      answer: "before anything else",
      caption: "Calculations inside brackets are always solved before anything else",
    },
    {
      type: "equationSolve",
      equation: "x and /",
      operation: "equal priority, before + and -",
      answer: "then left to right",
      caption: "Multiplication and division have equal priority and are completed before addition and subtraction; when priority is equal, solve left to right",
    },
  ],
  "15.3": [
    {
      type: "partialProducts",
      factors: [273, 28],
      parts: [
        { label: "273 × 8", value: 2184 },
        { label: "273 × 20", value: 5460 },
      ],
      total: 7644,
      caption: "To multiply 273 by 28, first multiply 273 by 8, then multiply 273 by 20, and add the two products together",
    },
    {
      type: "equationSolve",
      equation: "85 / 4",
      operation: "21 remainder 1",
      answer: "21 and 1/4",
      caption: "Dividing 85 by 4 gives 21 with a remainder of 1, which can also be written as the mixed number 21 and 1/4",
    },
    {
      type: "equationSolve",
      equation: "x tens digit",
      operation: "placeholder zero in the ones column",
      answer: "column multiplication",
      caption: "When multiplying by a two-digit number in columns, write a placeholder zero in the ones place when multiplying by the tens digit",
    },
    {
      type: "equationSolve",
      equation: "divide left to right",
      operation: "carry the remainder to the next column",
      answer: "short division",
      caption: "Divide digits from left to right, carrying any remaining amounts into the next place value column",
    },
  ],
  "15.4": [
    {
      type: "equationSolve",
      equation: "1.35 + 1.24",
      operation: "ones + tenths + hundredths separately",
      answer: "2.59",
      caption: "To add 1.35 and 1.24, add the ones (1+1), the tenths (0.3+0.2), and the hundredths (0.05+0.04) to get 2.59",
    },
    {
      type: "equationSolve",
      equation: "6.48 - 3.25",
      operation: "hundredths, tenths, ones separately",
      answer: "3.23",
      caption: "To calculate 6.48 - 3.25, subtract hundredths (8-5), tenths (4-2), and ones (6-3) to get 3.23",
    },
    {
      type: "equationSolve",
      equation: "line up the decimal point",
      operation: "tenths under tenths",
      answer: "hundredths under hundredths",
      caption: "Always line up digits by their decimal point so that tenths align with tenths and hundredths align with hundredths",
    },
    {
      type: "equationSolve",
      equation: "round first",
      operation: "to the nearest whole number",
      answer: "a quick estimate to check your answer",
      caption: "Rounding decimals to the nearest whole number provides a quick estimate to check your final calculation",
    },
  ],
  "15.5": [
    {
      type: "equationSolve",
      equation: "6 x 4 = 24",
      operation: "so 0.6 x 4",
      answer: "= 2.4 (24 tenths)",
      caption: "Since 6 x 4 = 24, four groups of 6 tenths equals 24 tenths, which is written as 2.4",
    },
    {
      type: "equationSolve",
      equation: "7 x 5 = 35",
      operation: "so 0.7 x 5",
      answer: "= 3.5 (35 tenths)",
      caption: "To calculate 0.7 x 5, use 7 x 5 = 35, meaning 35 tenths, or 3.5",
    },
    {
      type: "equationSolve",
      equation: "0.6 x 4",
      operation: "ten times smaller than 6 x 4",
      answer: "use known whole-number facts",
      caption: "Use related whole-number facts to calculate: for example, 0.6 x 4 is ten times smaller than 6 x 4",
    },
    {
      type: "equationSolve",
      equation: "multiply as whole numbers",
      operation: "then shift the place value",
      answer: "put back the tenths",
      caption: "Multiply as if the numbers were whole numbers first, then shift the place value to put back the tenths",
    },
  ],
};
