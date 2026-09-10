import GeometryConceptScene from "@/components/interactive/GeometryConceptScene";
import NumberConceptScene from "@/components/interactive/NumberConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 12
// (Angles and shapes: perimeter, area, nets, visualising 3D shapes) needs
// two new GeometryConceptScene variants (shapeNet, topDownView) that
// didn't exist before this unit, plus reuses coordinateGrid (for labeled
// perimeter/area outlines) and NumberConceptScene's equationSolve (for
// rule-only captions) - a genuinely mixed-component unit, so this file
// returns ready ReactNode arrays per concept instead of a single spec
// array/component pair like every prior unit. Every value below is
// grounded in this unit's real, production content (fetched via railway
// ssh), never invented.
export function getUnit12ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "12.1") {
    return [
      <GeometryConceptScene
        key={0}
        spec={{
          type: "coordinateGrid",
          gridSize: 6,
          shapes: [{ points: [[2, 0], [4, 0], [6, 2], [6, 4], [4, 6], [2, 6], [0, 4], [0, 2]], color: "ink" }],
          labels: [{ at: [3, 0], text: "5 cm" }],
          caption: "A regular octagon with 8 equal sides of 5 cm each has a perimeter of 8 x 5 = 40 centimetres",
        }}
      />,
      <GeometryConceptScene
        key={1}
        spec={{
          type: "coordinateGrid",
          gridSize: 8,
          shapes: [{ points: [[0, 0], [8, 0], [8, 2], [3, 2], [3, 6], [0, 6]], color: "accent" }],
          labels: [
            { at: [4, 0], text: "8" },
            { at: [8, 1], text: "2" },
            { at: [5.5, 2], text: "5" },
            { at: [3, 4], text: "4" },
            { at: [1.5, 6], text: "3" },
            { at: [0, 3], text: "6" },
          ],
          caption: "An L-shaped figure with outer sides of 8, 2, 5, 4, 3, and 6 cm has a total perimeter of 28 centimetres - add only the outer edges, never the inside corner",
        }}
      />,
      <NumberConceptScene
        key={2}
        spec={{
          type: "equationSolve",
          equation: "regular polygon",
          operation: "side length x number of sides",
          answer: "quick perimeter",
          caption: "A regular polygon has sides that are all the same length, so you can find its perimeter quickly by multiplying one side length by the total number of sides",
        }}
      />,
      <NumberConceptScene
        key={3}
        spec={{
          type: "equationSolve",
          equation: "missing edge?",
          operation: "use opposite parallel edges",
          answer: "work it out before adding",
          caption: "If an outer edge length is missing, use opposite parallel edges to work out the missing length before adding",
        }}
      />,
    ];
  }

  if (conceptId === "12.2") {
    return [
      <GeometryConceptScene
        key={0}
        spec={{
          type: "coordinateGrid",
          gridSize: 12,
          shapes: [{ points: [[0, 0], [12, 0], [12, 4], [0, 4]], color: "ink" }],
          labels: [
            { at: [5, 0], text: "12 cm" },
            { at: [12, 2], text: "4 cm" },
          ],
          caption: "A rectangle that is 12 centimetres long and 4 centimetres wide has an area of 12 x 4 = 48 square centimetres",
        }}
      />,
      <GeometryConceptScene
        key={1}
        spec={{
          type: "coordinateGrid",
          gridSize: 8,
          shapes: [
            { points: [[0, 0], [6, 0], [6, 2], [0, 2]], color: "ink" },
            { points: [[0, 2], [7, 2], [7, 5], [0, 5]], color: "accent" },
          ],
          labels: [
            { at: [2, 1], text: "12 cm2" },
            { at: [2, 3.5], text: "21 cm2" },
          ],
          caption: "An L-shaped figure splits into a 6x2 rectangle (12 cm2) and a 7x3 rectangle (21 cm2), for a total area of 33 square centimetres",
        }}
      />,
      <NumberConceptScene
        key={2}
        spec={{
          type: "equationSolve",
          equation: "length x width",
          operation: "any rectangle",
          answer: "= area",
          caption: "The area of any rectangle is found by multiplying its length by its width",
        }}
      />,
      <NumberConceptScene
        key={3}
        spec={{
          type: "equationSolve",
          equation: "same perimeter",
          operation: "does not guarantee",
          answer: "same area",
          caption: "Shapes with identical perimeters do not always have the same area, and shapes with the same area can have very different perimeters",
        }}
      />,
    ];
  }

  if (conceptId === "12.3") {
    return [
      <GeometryConceptScene
        key={0}
        spec={{
          type: "shapeNet",
          cols: 4,
          rows: 3,
          cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]],
          foldsInto: "Closed cube (6 faces)",
          caption: "Six equal squares arranged in a cross fold up to make a closed cube",
        }}
      />,
      <GeometryConceptScene
        key={1}
        spec={{
          type: "shapeNet",
          cols: 4,
          rows: 2,
          cells: [[0, 0], [1, 0], [2, 0], [3, 0], [1, 1]],
          foldsInto: "Open cube (5 faces, no lid)",
          caption: "A row of four squares with a fifth square attached to one side folds into an open box with no lid",
        }}
      />,
      <NumberConceptScene
        key={2}
        spec={{
          type: "equationSolve",
          equation: "6 squares",
          operation: "correctly arranged",
          answer: "closed cube",
          caption: "A complete closed cube has six square faces, so its net must contain six correctly arranged squares",
        }}
      />,
      <NumberConceptScene
        key={3}
        spec={{
          type: "equationSolve",
          equation: "3 pairs",
          operation: "matching rectangular faces",
          answer: "cuboid net",
          caption: "Cuboid nets are formed from three pairs of matching rectangular faces that fold into a box shape",
        }}
      />,
    ];
  }

  if (conceptId === "12.4") {
    return [
      <GeometryConceptScene
        key={0}
        spec={{
          type: "topDownView",
          shapeEmoji: "🥫",
          shapeLabel: "Cylinder",
          viewLabel: "Top-down view",
          outline: "circle",
          caption: "Looking straight down at a cylinder shows a simple flat circle",
        }}
      />,
      <GeometryConceptScene
        key={1}
        spec={{
          type: "topDownView",
          shapeEmoji: "🥫",
          shapeLabel: "Cylinder",
          viewLabel: "Side view",
          outline: "rectangle",
          caption: "Looking at the same cylinder from the side makes it appear rectangular",
        }}
      />,
      <GeometryConceptScene
        key={2}
        spec={{
          type: "topDownView",
          shapeEmoji: "🔺",
          shapeLabel: "Square-based pyramid",
          viewLabel: "Top-down view",
          outline: "squareWithX",
          caption: "Looking directly down from the top of a square-based pyramid shows a square with an X connecting the opposite corners",
        }}
      />,
      <NumberConceptScene
        key={3}
        spec={{
          type: "equationSolve",
          equation: "dot grids",
          operation: "guide for sketching",
          answer: "cubes & cuboids with parallel edges",
          caption: "Dot grids provide a guide for sketching accurate three-dimensional shapes like cubes and cuboids with parallel edges",
        }}
      />,
    ];
  }

  return undefined;
}
