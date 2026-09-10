import GeometryConceptScene from "@/components/interactive/GeometryConceptScene";
import NumberConceptScene from "@/components/interactive/NumberConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 14
// (Location and movement: reflections, comparing translations/
// reflections) adds an optional mirrorLines field to GeometryConceptScene
// .tsx's coordinateGrid variant (a dashed mirror axis) rather than a new
// component, since it's the same coordinate-plane shape as Unit 10, just
// with a reflection line added. Mixed with NumberConceptScene's
// equationSolve for rule-only captions, following the Unit 12 precedent
// for units whose content doesn't reduce to one scene type. Every value
// below is grounded in this unit's real, production content (fetched via
// railway ssh), never invented.
export function getUnit14ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "14.1") {
    return [
      <GeometryConceptScene
        key={0}
        spec={{
          type: "coordinateGrid",
          gridSize: 8,
          mirrorLines: [{ axis: "horizontal", at: 4 }],
          shapes: [
            { points: [[5, 5], [7, 5], [5, 7]], color: "ink" },
            { points: [[5, 3], [7, 3], [5, 1]], color: "accent" },
          ],
          caption: "Reflecting a triangle across a horizontal mirror line places each vertex the same perpendicular distance on the opposite side - a vertex 3 squares above the line reflects to 3 squares below",
        }}
      />,
      <GeometryConceptScene
        key={1}
        spec={{
          type: "coordinateGrid",
          gridSize: 8,
          mirrorLines: [
            { axis: "vertical", at: 4 },
            { axis: "horizontal", at: 4 },
          ],
          shapes: [
            { points: [[5, 5], [7, 5], [5, 7]], color: "ink" },
            { points: [[3, 5], [1, 5], [3, 7]], color: "accent" },
            { points: [[5, 3], [7, 3], [5, 1]], color: "accent" },
            { points: [[3, 3], [1, 3], [3, 1]], color: "ink" },
          ],
          caption: "Reflecting a single right-angled triangle across both a vertical and a horizontal line builds a symmetrical diamond shape with four matching sections",
        }}
      />,
      <NumberConceptScene
        key={2}
        spec={{
          type: "equationSolve",
          equation: "each corner",
          operation: "same perpendicular distance from the mirror line",
          answer: "as the matching original corner",
          caption: "Each corner of a reflected shape is the same perpendicular distance from the mirror line as the matching corner on the original shape",
        }}
      />,
      <NumberConceptScene
        key={3}
        spec={{
          type: "equationSolve",
          equation: "2 mirror lines",
          operation: "one horizontal, one vertical",
          answer: "4 symmetrical sections",
          caption: "Reflecting across two perpendicular mirror lines - one horizontal and one vertical - creates four symmetrical sections",
        }}
      />,
    ];
  }

  if (conceptId === "14.2") {
    return [
      <GeometryConceptScene
        key={0}
        spec={{
          type: "coordinateGrid",
          gridSize: 9,
          shapes: [
            { points: [[1, 6], [3, 6], [1, 8]], color: "ink" },
            { points: [[5, 4], [7, 4], [5, 6]], color: "accent" },
          ],
          arrows: [
            { from: [1, 6], to: [5, 4] },
            { from: [3, 6], to: [7, 4] },
            { from: [1, 8], to: [5, 6] },
          ],
          caption: "Moving a triangle four squares to the right and two squares down is a translation because it does not turn or flip",
        }}
      />,
      <GeometryConceptScene
        key={1}
        spec={{
          type: "coordinateGrid",
          gridSize: 10,
          mirrorLines: [{ axis: "vertical", at: 6 }],
          shapes: [
            { points: [[3, 6], [6, 5], [6, 7]], color: "ink" },
            { points: [[9, 6], [6, 5], [6, 7]], color: "accent" },
          ],
          caption: "If a triangle pointing left now points right, it has been reflected across a vertical mirror line rather than translated",
        }}
      />,
      <NumberConceptScene
        key={2}
        spec={{
          type: "equationSolve",
          equation: "translation",
          operation: "every vertex - same distance & direction",
          answer: "shape faces the same way",
          caption: "In a translation, the shape slides so every vertex travels the same distance in the same direction, keeping the shape facing the exact same way",
        }}
      />,
      <NumberConceptScene
        key={3}
        spec={{
          type: "equationSolve",
          equation: "reflection",
          operation: "orientation reversed",
          answer: "connecting lines perpendicular to the mirror",
          caption: "In a reflection, the shape's orientation is reversed, and lines connecting matching vertices are perpendicular to the mirror line",
        }}
      />,
    ];
  }

  return undefined;
}
