import type { StatisticsSceneSpec } from "@/components/interactive/StatisticsConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 8
// (Probability) reuses StatisticsConceptScene's likelihoodScale (new
// variant added for this unit) and barChart (already built for Unit 5)
// variants. Every value below is grounded in this unit's real,
// production content (fetched via railway ssh), never invented.
export const UNIT8_CONCEPT_SCENES: Record<string, StatisticsSceneSpec[]> = {
  "8.1": [
    {
      type: "likelihoodScale",
      event: "Picking a red block out of a bag filled with only blue blocks",
      position: "impossible",
      caption: "An event is impossible if it cannot happen at all",
    },
    {
      type: "likelihoodScale",
      event: "Picking a green marble from a bag of 8 green and 2 yellow marbles",
      position: "likely",
      caption: "With 8 green out of 10 marbles, picking green is likely",
    },
    {
      type: "likelihoodScale",
      event: "Flipping heads on an ordinary coin",
      position: "equally likely",
      caption: "Events are equally likely when each outcome has the exact same chance of occurring",
    },
    {
      type: "likelihoodScale",
      event: "Rolling a number smaller than 7 on a standard six-sided dice",
      position: "certain",
      caption: "An event is certain if it is guaranteed to happen - every number 1 to 6 is smaller than 7",
    },
  ],
  "8.2": [
    {
      type: "barChart",
      labels: ["1", "2", "3", "4", "5", "6"],
      values: [4, 6, 5, 5, 6, 4],
      caption: "Spinning a spinner with 6 equal slices 30 times and recording the frequency of each number",
    },
    {
      type: "barChart",
      labels: ["Predicted", "Actual"],
      values: [3, 4],
      unit: " draws",
      caption: "Drawing a colored counter from a hidden bag 8 times to estimate how many of each color are inside",
    },
    {
      type: "barChart",
      labels: ["Predicted Heads", "Actual Heads"],
      values: [50, 50],
      caption: "Flipping a fair coin 100 times, you would predict 50 heads since each flip is independent",
    },
    {
      type: "barChart",
      labels: ["Hearts drawn", "Total trials"],
      values: [5, 20],
      caption: "Drawing a heart 5 times in 20 trials gives an experimental probability of 5/20, or 0.25",
    },
  ],
};
