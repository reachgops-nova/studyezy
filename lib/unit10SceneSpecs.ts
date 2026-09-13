import type { GeometrySceneSpec } from "@/components/interactive/GeometryConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 10
// (Location and movement) adds a new coordinateGrid variant to
// GeometryConceptScene.tsx (points, shapes, translation arrows on an x-y
// grid) since neither the Number nor existing Geometry shapes fit
// coordinate-plane content. Every value below is grounded in this unit's
// real, production content (fetched via railway ssh), never invented.
export const UNIT10_CONCEPT_SCENES: Record<string, GeometrySceneSpec[]> = {
  "10.1": [
    {
      type: "translationDemo",
      gridSize: 8,
      originalPoints: [[5, 6], [7, 6], [6, 8]],
      delta: [-4, -1],
      caption: "Watch each point slide 4 squares left and 1 square down, the new triangle draw itself from those points, then the matching vertices join one by one - the connectors are always parallel and equal in length",
    },
    {
      type: "translationDemo",
      gridSize: 9,
      originalPoints: [[2, 3], [4, 3], [4, 4], [2, 4]],
      delta: [5, 2],
      caption: "Watch each corner slide 5 squares right and 2 squares up, the new rectangle draw itself from those points, then the matching corners join one by one",
    },
    {
      type: "coordinateGrid",
      gridSize: 9,
      shapes: [
        { points: [[2, 3], [4, 3], [4, 4], [2, 4]], color: "ink" },
        { points: [[7, 5], [9, 5], [9, 6], [7, 6]], color: "accent" },
      ],
      caption: "Translation has 'sl' in it - just think of a smooth 'slide' where nothing turns or twists!",
    },
  ],
  "10.2": [
    {
      type: "coordinateGrid",
      gridSize: 7,
      shapes: [{ points: [[1, 3], [5, 3], [5, 4], [1, 4]], color: "accent", dashed: true }],
      labels: [
        { at: [1, 3], text: "(1,3)" },
        { at: [5, 3], text: "(5,3)" },
        { at: [5, 4], text: "(5,4)" },
        { at: [1, 4], text: "(1,4)" },
      ],
      caption: "Plotting three corners of a rectangle at (1,3), (5,3), and (5,4) means the fourth corner must be at (1,4)",
    },
    {
      type: "coordinateGrid",
      gridSize: 8,
      shapes: [{ points: [[4, 3], [6, 3], [5, 7]], color: "ink" }],
      labels: [
        { at: [4, 3], text: "(4,3)" },
        { at: [6, 3], text: "(6,3)" },
        { at: [5, 7], text: "(5,7)" },
      ],
      caption: "Creating an isosceles triangle with a horizontal base between (4,3) and (6,3), top vertex at (5,7)",
    },
    {
      type: "coordinateGrid",
      gridSize: 6,
      shapes: [{ points: [[2, 1], [5, 1], [5, 4]], color: "accent" }],
      labels: [{ at: [2, 1], text: "(x,y)" }],
      caption: "Go along the corridor along the x-axis before you go up the stairs along the y-axis: (x, y)!",
    },
    {
      type: "coordinateGrid",
      gridSize: 8,
      shapes: [
        { points: [[4, 4], [6, 4], [5, 8]], color: "ink" },
        { points: [[4, 4], [6, 4], [5, 0]], color: "accent", dashed: true },
      ],
      caption: "Two given points can sometimes form more than one valid shape, pointing upwards or downwards from that side",
    },
  ],
};
