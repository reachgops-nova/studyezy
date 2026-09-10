import StatisticsConceptScene from "@/components/interactive/StatisticsConceptScene";
import NumberConceptScene from "@/components/interactive/NumberConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 16
// (Statistical methods: mode/median, waffle diagrams) adds a waffleGrid
// variant to StatisticsConceptScene.tsx (a shaded percent grid, distinct
// from Unit 11's interactive PercentageGridPlayer widget - this is a
// static scene) and reuses NumberConceptScene's equationSolve for
// rule-only captions. Every value below is grounded in this unit's real,
// production content (fetched via railway ssh), never invented.
export function getUnit16ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "16.1") {
    return [
      <NumberConceptScene
        key={0}
        spec={{ type: "equationSolve", equation: "2, 2, 9, 11, 12", operation: "2 appears most often", answer: "mode = 2", caption: "The mode is the value that appears most often in the dataset" }}
      />,
      <NumberConceptScene
        key={1}
        spec={{
          type: "equationSolve",
          equation: "2, 2, 9, 11, 12",
          operation: "middle value in order",
          answer: "median = 9",
          caption: "The median is the value that sits right in the middle when the numbers are ordered",
        }}
      />,
      <NumberConceptScene
        key={2}
        spec={{
          type: "equationSolve",
          equation: "0, 1, 1, 2, 4",
          operation: "ordered middle & most frequent",
          answer: "both = 1",
          caption: "For sibling counts of 0, 1, 1, 2, and 4, the ordered middle number and the most common number are both 1",
        }}
      />,
      <NumberConceptScene
        key={3}
        spec={{
          type: "equationSolve",
          equation: "Mode = Most",
          operation: "Median = Middle",
          answer: "memory trick",
          caption: "Remember that 'Mode' sounds like 'Most', and 'Median' sounds like 'Middle'!",
        }}
      />,
    ];
  }

  if (conceptId === "16.2") {
    return [
      <StatisticsConceptScene
        key={0}
        spec={{
          type: "waffleGrid",
          cols: 10,
          rows: 10,
          shaded: 25,
          caption: "On a 100-grid showing favourite sports, shading 25 squares blue means 25 out of 100 people, or 25 percent, chose that sport",
        }}
      />,
      <StatisticsConceptScene
        key={1}
        spec={{
          type: "waffleGrid",
          cols: 5,
          rows: 4,
          shaded: 3,
          caption: "In a 20-square grid representing school pets, shading 3 squares for fish shows that 3 out of 20 votes, or 15 percent, went to fish",
        }}
      />,
      <NumberConceptScene
        key={2}
        spec={{
          type: "equationSolve",
          equation: "100-square grid",
          operation: "each block = 1%",
          answer: "quick percent reading",
          caption: "On a 100-square grid, each individual block represents one hundredth, or exactly one percent of the whole",
        }}
      />,
      <NumberConceptScene
        key={3}
        spec={{
          type: "equationSolve",
          equation: "20-square grid",
          operation: "each block = 5%",
          answer: "different grid sizes work too",
          caption: "Waffle diagrams can also use other grid sizes, such as twenty squares where each block represents five percent",
        }}
      />,
    ];
  }

  return undefined;
}
