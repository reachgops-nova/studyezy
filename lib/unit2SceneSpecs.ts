import type { GeometrySceneSpec } from "@/components/interactive/GeometryConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge" - same
// scene-per-checkpoint pattern proven on Unit 1 (Number), applied to Math
// Unit 2 (Angles and shapes). Every value below is grounded in this unit's
// real, production content (fetched via railway ssh), never invented.
export const UNIT2_CONCEPT_SCENES: Record<string, GeometrySceneSpec[]> = {
  "2.1": [
    {
      type: "symmetryGrid",
      axis: "vertical",
      cols: 8,
      rows: 4,
      shaded: [[1, 1], [1, 2], [6, 1], [6, 2]],
      caption: "A symmetrical pattern mirrors one side exactly across a line of symmetry",
    },
    {
      type: "symmetryGrid",
      axis: "vertical",
      cols: 8,
      rows: 4,
      shaded: [[0, 1], [0, 2], [7, 1], [7, 2]],
      caption: "Shading 2 squares 3 steps left of the mirror line, and 2 matching squares 3 steps right",
    },
    {
      type: "symmetryGrid",
      axis: "both",
      cols: 8,
      rows: 4,
      shaded: [[1, 1], [6, 1], [1, 2], [6, 2]],
      caption: "Some patterns have multiple lines of symmetry - both horizontal and vertical",
    },
    {
      type: "symmetryGrid",
      axis: "vertical",
      cols: 8,
      rows: 4,
      shaded: [[2, 1], [5, 1]],
      caption: "Fold the grid along the mirror line - every shaded square should land on its partner",
    },
  ],
  "2.2": [
    {
      type: "angleArc",
      degrees: 120,
      label: "angle at vertex",
      kind: "obtuse",
      caption: "An angle measures the amount of turn between two lines meeting at a vertex",
    },
    {
      type: "straightLineSplit",
      known: 75,
      missing: 105,
      caption: "One angle on the line is 75°, so the missing angle is 180 minus 75, which is 105°",
    },
    {
      type: "angleArc",
      degrees: 115,
      label: "115° - obtuse",
      kind: "obtuse",
      caption: "Angles under 90° are acute, over 90° (but under 180°) are obtuse, over 180° are reflex",
    },
    {
      type: "straightLineSplit",
      known: 140,
      missing: 40,
      caption: "A straight line is always 180° - subtract the angle you know to find the one you don't",
    },
  ],
  "2.3": [
    {
      type: "triangleClassify",
      kind: "equilateral",
      sides: [5, 5, 5],
      caption: "Triangles are sorted into categories based on their side lengths and angle sizes",
    },
    {
      type: "triangleClassify",
      kind: "isosceles",
      sides: [6, 6, 4],
      caption: "A triangle with sides 6cm, 6cm, and 4cm is isosceles because 2 sides are equal",
    },
    {
      type: "triangleClassify",
      kind: "scalene",
      sides: [3, 5, 7],
      caption: "A triangle with sides 3cm, 5cm, and 7cm is scalene - all 3 sides are different lengths",
    },
    {
      type: "triangleClassify",
      kind: "equilateral",
      sides: [4, 4, 4],
      caption: "Equilateral has 'equal' in its name; isosceles stands on 2 equal legs; scalene never matches",
    },
  ],
};
