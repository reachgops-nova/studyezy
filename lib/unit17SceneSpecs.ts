import type { NumberSceneSpec } from "@/components/interactive/NumberConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 17
// (Fractions, decimals, percentages and proportion) reuses
// NumberConceptScene's existing equationSolve/expressionSteps variants -
// the same shapes proven on Units 1, 3, 7, 9, and 11, no new scene
// component needed. Every value below is grounded in this unit's real,
// production content (fetched via railway ssh), never invented.
export const UNIT17_CONCEPT_SCENES: Record<string, NumberSceneSpec[]> = {
  "17.1": [
    {
      type: "equationSolve",
      equation: "0.7 vs 6/10",
      operation: "0.7 = 7/10",
      answer: "0.7 > 6/10",
      caption: "To compare 0.7 and 6/10, recognize that 0.7 is 7/10, so 0.7 is greater than 6/10",
    },
    {
      type: "expressionSteps",
      steps: ["40%, 6/10, 0.7", "0.4, 0.6, 0.7", "40% < 6/10 < 0.7"],
      caption: "Ordering 40%, 6/10, and 0.7 from least to greatest gives 40% (0.4), 6/10 (0.6), and 0.7",
    },
    {
      type: "equationSolve",
      equation: "percentages",
      operation: "parts per hundred",
      answer: "match /100 fractions or 2-place decimals",
      caption: "Percentages represent parts per hundred, making them easy to match with fractions over 100 or two-place decimals",
    },
    {
      type: "equationSolve",
      equation: "convert first",
      operation: "to percentages or decimals",
      answer: "then compare like with like",
      caption: "Convert everything to percentages or decimals first so you can compare like with like",
    },
  ],
  "17.2": [
    {
      type: "equationSolve",
      equation: "2/3 + 5/9",
      operation: "2/3 = 6/9, then + 5/9",
      answer: "11/9 = 1 and 2/9",
      caption: "To find 2/3 + 5/9, convert 2/3 into 6/9, then add 5/9 to get 11/9, or 1 and 2/9",
    },
    {
      type: "equationSolve",
      equation: "7/8 - 1/4",
      operation: "1/4 = 2/8, then 7/8 - 2/8",
      answer: "5/8",
      caption: "To solve 7/8 - 1/4, rewrite 1/4 as 2/8, giving 7/8 - 2/8 = 5/8",
    },
    {
      type: "equationSolve",
      equation: "common denominator",
      operation: "is one a multiple of the other?",
      answer: "check this first",
      caption: "Identify a common denominator by checking if one denominator is a multiple of the other",
    },
    {
      type: "equationSolve",
      equation: "add/subtract numerators only",
      operation: "denominator stays the same",
      answer: "never change the bottom",
      caption: "Only add or subtract the top numbers; never add or subtract the bottom denominators",
    },
  ],
  "17.3": [
    {
      type: "equationSolve",
      equation: "1/2 / 3",
      operation: "split among 3 people",
      answer: "1/6",
      caption: "Sharing 1/2 of a chocolate bar equally between 3 people gives 1/2 divided by 3, which equals 1/6 of the whole bar",
    },
    {
      type: "equationSolve",
      equation: "1/4 / 2",
      operation: "split ribbon into 2",
      answer: "1/8",
      caption: "Splitting 1/4 metre of ribbon into 2 equal lengths gives pieces that are each 1/8 of a metre long",
    },
    {
      type: "equationSolve",
      equation: "unit fraction",
      operation: "numerator of 1",
      answer: "one equal part of a whole",
      caption: "A unit fraction has a numerator of 1, representing one equal part of a whole",
    },
    {
      type: "equationSolve",
      equation: "new denominator",
      operation: "original x whole number divisor",
      answer: "gives the smaller piece size",
      caption: "When dividing a unit fraction, multiply the bottom denominator by the whole number to get the smaller piece size",
    },
  ],
  "17.4": [
    {
      type: "equationSolve",
      equation: "3 x 1/4",
      operation: "3 cups of 1/4 litre",
      answer: "3/4 litre",
      caption: "Taking 3 cups that each contain 1/4 litre gives 3 multiplied by 1/4, which equals 3/4 litre",
    },
    {
      type: "equationSolve",
      equation: "5 x 1/8",
      operation: "5 ribbon pieces",
      answer: "5/8 metre",
      caption: "Gathering 5 pieces of ribbon that are each 1/8 metre long gives 5 multiplied by 1/8, which equals 5/8 metre",
    },
    {
      type: "equationSolve",
      equation: "whole number x numerator",
      operation: "denominator unchanged",
      answer: "repeated addition",
      caption: "Multiplying a fraction by a whole number represents repeated addition of that fraction",
    },
    {
      type: "equationSolve",
      equation: "numerator > denominator?",
      operation: "write as a mixed number",
      answer: "e.g. 11/9 = 1 and 2/9",
      caption: "If the numerator ends up larger than the denominator, the answer can be written as a mixed number",
    },
  ],
  "17.5": [
    {
      type: "equationSolve",
      equation: "2 red : 3 blue",
      operation: "part to part",
      answer: "ratio = 2:3",
      caption: "If a pattern has 2 red tiles for every 3 blue tiles, the ratio of red to blue is 2:3",
    },
    {
      type: "equationSolve",
      equation: "2 out of 5 tiles",
      operation: "part to whole",
      answer: "2/5 or 40%",
      caption: "In that same pattern of 5 tiles total, the proportion of red tiles is 2 out of 5, which can be written as 2/5 or 40%",
    },
    {
      type: "equationSolve",
      equation: "red to blue",
      operation: "order matters",
      answer: "not the same as blue to red",
      caption: "The order of terms in a ratio matters; red to blue is different from blue to red",
    },
    {
      type: "equationSolve",
      equation: "ratio",
      operation: "part to part",
      answer: "proportion = part to whole",
      caption: "Ratio compares part to part, but proportion compares part to the whole",
    },
  ],
};
