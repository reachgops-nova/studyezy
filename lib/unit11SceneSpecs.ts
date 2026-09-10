import type { NumberSceneSpec } from "@/components/interactive/NumberConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 11
// (Fractions, decimals, percentages and proportion) reuses
// NumberConceptScene's existing equationSolve/expressionSteps/blocksSplit
// variants - the same shapes proven on Units 1, 3, 7, and 9, no new scene
// component needed. Every value below is grounded in this unit's real,
// production content (fetched via railway ssh), never invented.
export const UNIT11_CONCEPT_SCENES: Record<string, NumberSceneSpec[]> = {
  "11.1": [
    {
      type: "equationSolve",
      equation: "25 out of 100 squares",
      operation: "shaded on a hundred-square grid",
      answer: "25%",
      caption: "Shading 25 squares out of a 100-square grid represents twenty-five hundredths or 25%",
    },
    {
      type: "equationSolve",
      equation: "8 out of 100 runners",
      operation: "finish in under an hour",
      answer: "8%",
      caption: "If 8 out of 100 runners finish in under an hour, that group is 8% of the total runners",
    },
    {
      type: "equationSolve",
      equation: "the whole amount",
      operation: "every part included",
      answer: "100%",
      caption: "The whole amount or complete object always equals one hundred percent",
    },
    {
      type: "equationSolve",
      equation: "any percentage",
      operation: "write as a fraction over 100",
      answer: "denominator is always 100",
      caption: "Think of a century having 100 years - 'cent' in percent always means 100!",
    },
  ],
  "11.2": [
    {
      type: "expressionSteps",
      steps: ["1/10", "0.1", "10%"],
      caption: "One tenth equals zero point one, which is also ten hundredths or 10%",
    },
    {
      type: "expressionSteps",
      steps: ["1/100", "0.01", "1%"],
      caption: "One hundredth equals zero point zero one or 1%",
    },
    {
      type: "expressionSteps",
      steps: ["3/5", "60/100", "0.6 = 60%"],
      caption: "Three fifths can be scaled up to sixty hundredths, which is written as 0.6 or 60%",
    },
    {
      type: "expressionSteps",
      steps: ["0.25", "25/100", "1/4 = 25%"],
      caption: "The decimal 0.25 equals twenty-five hundredths, which simplifies to one quarter or 25%",
    },
  ],
  "11.3": [
    {
      type: "equationSolve",
      equation: "0.4 vs 35%",
      operation: "0.4 = 40%",
      answer: "0.4 is greater",
      caption: "To compare 0.4 and 35%, change 0.4 into 40%; since 40% is larger than 35%, 0.4 is greater than 35%",
    },
    {
      type: "expressionSteps",
      steps: ["1/2, 0.7, 20%", "50%, 70%, 20%", "20%, 50%, 70%"],
      caption: "Ordering 1/2, 0.7, and 20% by converting to percentages gives 20%, 50%, and 70%",
    },
    {
      type: "equationSolve",
      equation: "match the clothes",
      operation: "convert every value to the same form",
      answer: "then compare",
      caption: "Always dress your numbers in matching clothes - turn them all into decimals or all into percentages before deciding which is bigger",
    },
    {
      type: "equationSolve",
      equation: "whole numbers first",
      operation: "then tenths, then hundredths",
      answer: "compare place by place",
      caption: "Check whole number parts first before examining tenths and hundredths",
    },
  ],
  "11.4": [
    {
      type: "equationSolve",
      equation: "$400 ÷ 10, then × 3",
      operation: "three tenths of $400",
      answer: "$120",
      caption: "To find three tenths of $400, divide $400 by 10 to get $40, then multiply by 3 to reach $120",
    },
    {
      type: "equationSolve",
      equation: "6 × 8",
      operation: "one eighth of a box is 6 items",
      answer: "48 items",
      caption: "If one eighth of a box contains 6 items, the whole box contains 6 times 8, which is 48 items",
    },
    {
      type: "equationSolve",
      equation: "unit fraction",
      operation: "divide the total by the denominator",
      answer: "gives one part",
      caption: "To find a unit fraction of an amount, divide the total by the denominator",
    },
    {
      type: "equationSolve",
      equation: "non-unit fraction",
      operation: "divide by denominator, then × numerator",
      answer: "gives several parts",
      caption: "To find a non-unit fraction, divide by the denominator first, then multiply the result by the numerator",
    },
  ],
  "11.5": [
    {
      type: "blocksSplit",
      count: 10,
      shaded: 4,
      unitLabel: "🍎",
      caption: "In a basket of 4 apples and 6 oranges, the proportion of apples is 4 out of 10, or 40%",
    },
    {
      type: "equationSolve",
      equation: "4 : 6",
      operation: "simplify by dividing both by 2",
      answer: "2 : 3",
      caption: "The ratio of apples to oranges is 4 to 6, written as 4:6, which means 2 apples for every 3 oranges",
    },
    {
      type: "equationSolve",
      equation: "proportion",
      operation: "part compared to the whole group",
      answer: "a fraction or percentage",
      caption: "Proportion tells you what fraction or percentage of the entire group belongs to one category",
    },
    {
      type: "equationSolve",
      equation: "ratio",
      operation: "part compared to part, using a colon",
      answer: "e.g. 4 : 6",
      caption: "Ratio describes a relationship using the phrase 'for every...' and can be recorded with a colon symbol",
    },
  ],
};
