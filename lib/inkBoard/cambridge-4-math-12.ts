import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 12 (Angles and shapes)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-12.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_12_INK: InkUnit = {
  unitKey: "cambridge-4-math-12",
  title: "Angles and shapes",
  badge: "Grade 4 · Unit 12",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "12.1",
      title: "⬡ Perimeter and polygons",
      scenes: [
        {
          label: "1. Perimeter and polygons",
          say: "Add the side lengths around a shape to find its perimeter.",
          ops: [
            { type: "text", value: "⬡ Perimeter and polygons", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Add the side lengths around a shape to find its perimeter.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: 1 · Poster",
          say: "Add the side lengths around a shape to find its perimeter.",
          ops: [],
          image: {
            "src": "/board-art/math12-perimeter-area-3d.jpg",
            "alt": "A four-panel poster covering perimeter, area of a rectangle, folding a cube net, and the parts of a 3D shape.",
            "title": "Perimeter and polygons",
            "focus": {
              "x": 0,
              "y": 6,
              "w": 49,
              "h": 42
            },
            "hotspots": [
              {
                "label": "12 cm × 2 + 4 cm × 2",
                "at": [
                  25,
                  46
                ],
                "note": "Add all four side lengths: 12 + 4 + 12 + 4 = 32 cm.",
                "tone": "gold"
              }
            ]
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Perimeter and polygons.\n2. What should you check when working with Perimeter and polygons?", labelSize: 18 },
            { type: "text", value: "1) Add the side lengths around a shape to find its perimeter. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Say the rule for Perimeter and polygons. Add the side lengths around a shape to find its perimeter.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Perimeter and polygons.\n\nAdd the side lengths around a shape to find its perimeter.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "12.1-q1", prompt: "Use the board model to show one worked example of Perimeter and polygons. Which response follows the rule?", options: ["The model shows Perimeter and polygons correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "12.2",
      title: "▦ Area of rectangles",
      scenes: [
        {
          label: "1. Area of rectangles",
          say: "Count the square units using length multiplied by width.",
          ops: [
            { type: "text", value: "▦ Area of rectangles", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Count the square units using length multiplied by width.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: 2 · Poster",
          say: "Count the square units using length multiplied by width.",
          ops: [],
          image: {
            "src": "/board-art/math12-perimeter-area-3d.jpg",
            "alt": "A four-panel poster covering perimeter, area of a rectangle, folding a cube net, and the parts of a 3D shape.",
            "title": "Area of rectangles",
            "focus": {
              "x": 51,
              "y": 6,
              "w": 49,
              "h": 42
            },
            "hotspots": [
              {
                "label": "length × width",
                "at": [
                  75,
                  46
                ],
                "note": "A 12 cm by 4 cm rectangle covers 12 × 4 = 48 square units.",
                "tone": "green"
              }
            ]
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Area of rectangles.\n2. What should you check when working with Area of rectangles?", labelSize: 18 },
            { type: "text", value: "1) Count the square units using length multiplied by width. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Say the rule for Area of rectangles. Count the square units using length multiplied by width.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Area of rectangles.\n\nCount the square units using length multiplied by width.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "12.2-q1", prompt: "Use the board model to show one worked example of Area of rectangles. Which response follows the rule?", options: ["The model shows Area of rectangles correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "12.3",
      title: "📦 Three-dimensional nets",
      scenes: [
        {
          label: "1. Three-dimensional nets",
          say: "A net folds into a solid when its faces meet along matching edges.",
          ops: [
            { type: "text", value: "📦 Three-dimensional nets", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "A net folds into a solid when its faces meet along matching edges.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: 3 · Poster",
          say: "A net folds into a solid when its faces meet along matching edges.",
          ops: [],
          image: {
            "src": "/board-art/math12-perimeter-area-3d.jpg",
            "alt": "A four-panel poster covering perimeter, area of a rectangle, folding a cube net, and the parts of a 3D shape.",
            "title": "Three-dimensional nets",
            "focus": {
              "x": 0,
              "y": 50,
              "w": 49,
              "h": 47
            },
            "hotspots": [
              {
                "label": "the cube net",
                "at": [
                  25,
                  74
                ],
                "note": "Six matching square faces fold until edges meet to form a closed cube.",
                "tone": "gold"
              }
            ]
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Three-dimensional nets.\n2. What should you check when working with Three-dimensional nets?", labelSize: 18 },
            { type: "text", value: "1) A net folds into a solid when its faces meet along matching edges. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Say the rule for Three-dimensional nets. A net folds into a solid when its faces meet along matching edges.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Three-dimensional nets.\n\nA net folds into a solid when its faces meet along matching edges.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "12.3-q1", prompt: "Use the board model to show one worked example of Three-dimensional nets. Which response follows the rule?", options: ["The model shows Three-dimensional nets correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "12.4",
      title: "🧊 Visualising 3D shapes",
      scenes: [
        {
          label: "1. Visualising 3D shapes",
          say: "Use faces, edges and vertices to describe a solid from different views.",
          ops: [
            { type: "text", value: "🧊 Visualising 3D shapes", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Use faces, edges and vertices to describe a solid from different views.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: 4 · Poster",
          say: "Use faces, edges and vertices to describe a solid from different views.",
          ops: [],
          image: {
            "src": "/board-art/math12-perimeter-area-3d.jpg",
            "alt": "A four-panel poster covering perimeter, area of a rectangle, folding a cube net, and the parts of a 3D shape.",
            "title": "Visualising 3D shapes",
            "focus": {
              "x": 51,
              "y": 50,
              "w": 49,
              "h": 47
            },
            "hotspots": [
              {
                "label": "Face",
                "at": [
                  78,
                  60
                ],
                "note": "A flat surface of a 3D shape.",
                "tone": "blue"
              },
              {
                "label": "Edge",
                "at": [
                  58,
                  66
                ],
                "note": "The line where two faces of a solid meet.",
                "tone": "gold"
              },
              {
                "label": "Vertex",
                "at": [
                  79,
                  79
                ],
                "note": "A corner point where edges meet.",
                "tone": "green"
              }
            ]
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Visualising 3D shapes.\n2. What should you check when working with Visualising 3D shapes?", labelSize: 18 },
            { type: "text", value: "1) Use faces, edges and vertices to describe a solid from different views. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Say the rule for Visualising 3D shapes. Use faces, edges and vertices to describe a solid from different views.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Visualising 3D shapes.\n\nUse faces, edges and vertices to describe a solid from different views.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "12.4-q1", prompt: "Use the board model to show one worked example of Visualising 3D shapes. Which response follows the rule?", options: ["The model shows Visualising 3D shapes correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },
  ],
};
