import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 10 (Location and movement)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-10.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_10_INK: InkUnit = {
  unitKey: "cambridge-4-math-10",
  title: "Location and movement",
  badge: "Grade 4 · Unit 10",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "10.1",
      title: "🔺 Translating 2D shapes",
      scenes: [
        {
          label: "1. Translating 2D shapes",
          say: "A translation is sliding a shape in a straight direction across a grid without turning, flipping, or resizing it.",
          ops: [
            { type: "text", value: "🔺 Translating 2D shapes", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Every single vertex on the shape moves the exact same distance and direction.\nTranslations are described by stating how many units a shape moves horizontally (left or right) and vertically (up or down).\nConnecting lines drawn between each original vertex and its matching new vertex will always be parallel and equal in length.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. A shape at (2,3) is translated 4 right and 1 up. Where does it land?\n2. Describe the translation from (9,7) to (9,2).\n3. A triangle has corners (1,1), (3,1), (2,3). Write its corners after 2 right and 3 up.", labelSize: 18 },
            { type: "text", value: "1) (6,4)\n2) 5 down. The across number never changed.\n3) (3,4), (5,4) and (4,6).", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
      ],
      questions: [
        { id: "10.1-q1", prompt: "This triangle's bottom-left corner sits at (2,1). Slide the shape 4 right and 2 up. Drag the corner to where it lands, or pick below.", options: ["(6, 3)","(3, 5)","(4, 2)"], correctIndex: 0, explanation: "Yes. Two plus four is six across, and one plus two is three up. Every other corner moved exactly the same way." },
        { id: "10.1-q2", prompt: "Shape A starts at (1,2). It is translated 3 squares RIGHT and 2 squares UP. Where does its bottom-left corner land?", options: ["(3, 5)","(4, 4)","(4, 2)","(1, 4)"], correctIndex: 1, explanation: "Exactly right! 1 plus 3 is 4 across, and 2 plus 2 is 4 up. It lands at (4,4)." },
        { id: "10.1-q3", prompt: "A shape moves from (7,3) to (2,3). How would you describe that translation?", options: ["5 left","5 right","5 left, 3 down","3 left"], correctIndex: 0, explanation: "Yes. The across number went from 7 down to 2, so it moved 5 left. The up number never changed, so there is no vertical part at all." },
        { id: "10.1-q4", prompt: "A triangle at (1,1), (3,1), (2,3) is translated 4 right and 4 up. Which corner is NOT part of the new triangle?", options: ["(5, 5)","(6, 7)","(7, 7)","(7, 5)"], correctIndex: 2, explanation: "Well spotted. Adding 4 and 4 to each corner gives (5,5), (7,5) and (6,7). Nothing lands on (7,7)." },
      ],
    },

    {
      topicId: "10.2",
      title: "📍 Shapes on a coordinate grid",
      scenes: [
        {
          label: "1. Shapes on a coordinate grid",
          say: "Coordinates are read along the horizontal x-axis first, then up the vertical y-axis - always (x, y).",
          ops: [
            { type: "text", value: "📍 Shapes on a coordinate grid", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Coordinates are read along the horizontal x-axis first, then up the vertical y-axis.\nYou can work out the missing vertex of a shape like a rectangle by matching equal side lengths and parallel edges.\nGiven a set of vertices, sometimes more than one valid geometric shape can be formed depending on where you plot the final points.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Poster · across comes first",
          say: "Look at the two dots. One is at three across and eight up. The other is at eight across and three up. Same two numbers, completely different places. That is why the order matters - the across number is always written first.",
          ops: [],
          image: {
            "src": "/board-art/math10-order-xy.jpg",
            "alt": "A grid with a dot at (3,8) and another at (8,3), showing they are different places",
            "title": "Across always comes first",
            "hotspots": [
              {
                "label": "(3, 8)",
                "at": [
                  30,
                  30
                ],
                "note": "Three across, then eight up. High on the grid and near the left.",
                "tone": "gold"
              },
              {
                "label": "(8, 3)",
                "at": [
                  72,
                  60
                ],
                "note": "Eight across, then three up. Low on the grid and far to the right. The same two numbers, nowhere near the same place.",
                "tone": "red"
              },
              {
                "label": "Across first",
                "at": [
                  50,
                  95
                ],
                "note": "Walk along the bottom before you climb. Across, then up - every single time.",
                "tone": "blue"
              }
            ]
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Which point is 5 across and 2 up?\n2. Three corners of a rectangle are (1,1), (6,1), (6,4). Where is the fourth?\n3. Is (3,8) the same place as (8,3)?", labelSize: 18 },
            { type: "text", value: "1) (5,2)\n2) (1,4)\n3) No - across always comes first, so they are two different points.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
      ],
      questions: [
        { id: "10.2-q1", prompt: "Three corners of a rectangle are plotted at (2,2), (7,2) and (7,5). Drag the last corner into place, or pick below.", options: ["(2, 5)","(5, 2)","(2, 7)"], correctIndex: 0, explanation: "That is it. The bottom edge runs from 2 to 7, so the top edge must too - and it sits level with the corner at height five." },
        { id: "10.2-q2", prompt: "Two bottom corners of a square are at (2,1) and (5,1). Which top corners complete it?", options: ["(2,3) & (5,3)","(2,4) & (5,4)"], correctIndex: 1, explanation: "Correct! The bottom side runs from 2 to 5, so it is 3 units long. Every side must be 3, so the top corners sit at 1 plus 3, which is 4 up." },
        { id: "10.2-q3", prompt: "Which coordinate is 3 across and 7 up?", options: ["(3, 7)","(7, 3)"], correctIndex: 0, explanation: "Correct. Across first, then up - that is always the order." },
        { id: "10.2-q4", prompt: "Three corners of a rectangle are (1,2), (6,2) and (6,5). Where is the fourth?", options: ["(1, 5)","(5, 5)"], correctIndex: 0, explanation: "Yes. Opposite sides of a rectangle are equal and parallel, so the last corner lines up under (6,5) and across from (1,2)." },
      ],
    },
  ],
};
