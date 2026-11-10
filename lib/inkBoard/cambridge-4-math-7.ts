import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 7 (Number)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-7.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_7_INK: InkUnit = {
  unitKey: "cambridge-4-math-7",
  title: "Number",
  badge: "Grade 4 · Unit 7",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "7.1",
      title: "🔟 Tenths and hundredths",
      scenes: [
        {
          label: "1. Tenths and hundredths",
          say: "Place decimal digits correctly and read what each place is worth.",
          ops: [
            { type: "text", value: "🔟 Tenths and hundredths", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Place decimal digits correctly and read what each place is worth.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: 1 · Poster · tenths",
          say: "One piece of a chocolate bar split into ten equal parts is one tenth - we write that as 0.1. Ten of these pieces make one whole.",
          ops: [],
          image: {
            "src": "/board-art/math7-decimals-negative.jpg",
            "alt": "A chocolate bar split into ten pieces, with one piece labelled 0.1.",
            "title": "Tenths",
            "focus": {
              "x": 0,
              "y": 16,
              "w": 24.5,
              "h": 84
            },
            "hotspots": [
              {
                "label": "0.1",
                "at": [
                  19,
                  50
                ],
                "note": "One piece out of ten equal pieces is one tenth of the whole bar.",
                "tone": "gold"
              }
            ]
          },
        },
        {
          label: "3. 1 · Tap and explain",
          say: "Tap the highlighted part and explain what Tenths and hundredths is doing.",
          ops: [
            { type: "text", value: "1 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n2 = Tenths and hundredths\njump: 0 -> 2 (show Tenths and hundredths)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Tenths and hundredths.\n2. What should you check when working with Tenths and hundredths?", labelSize: 18 },
            { type: "text", value: "1) Place decimal digits correctly and read what each place is worth. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Tenths and hundredths. Place decimal digits correctly and read what each place is worth.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Tenths and hundredths.\n\nPlace decimal digits correctly and read what each place is worth.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "7.1-q1", prompt: "Use the board model to show one worked example of Tenths and hundredths. Which response follows the rule?", options: ["The model shows Tenths and hundredths correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "7.2",
      title: "🧩 Decomposing and regrouping decimals",
      scenes: [
        {
          label: "1. Decomposing and regrouping decimals",
          say: "Split a decimal into place values and regroup without changing its value.",
          ops: [
            { type: "text", value: "🧩 Decomposing and regrouping decimals", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Split a decimal into place values and regroup without changing its value.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: 2 · Poster · decompose 45.8",
          say: "45.8 breaks apart into its place value parts - 40 in the tens, 5 in the ones, and 0.8 in the tenths.",
          ops: [],
          image: {
            "src": "/board-art/math7-decimals-negative.jpg",
            "alt": "45.8 broken into place value blocks: 40, 5, and 0.8.",
            "title": "Decompose 45.8",
            "focus": {
              "x": 25.3,
              "y": 16,
              "w": 24,
              "h": 84
            },
            "hotspots": [
              {
                "label": "40",
                "at": [
                  32,
                  58
                ],
                "note": "Four tens.",
                "tone": "blue"
              },
              {
                "label": "5",
                "at": [
                  40,
                  58
                ],
                "note": "Five ones.",
                "tone": "green"
              },
              {
                "label": "0.8",
                "at": [
                  46,
                  68
                ],
                "note": "Eight tenths.",
                "tone": "gold"
              }
            ]
          },
        },
        {
          label: "3. 🖼️ Explore: 2 · Poster · regroup 3.4",
          say: "3 wholes and 4 tenths can be regrouped: take one whole apart into ten tenths, leaving 2 wholes and 14 tenths - the same value, written differently.",
          ops: [],
          image: {
            "src": "/board-art/math7-decimals-negative.jpg",
            "alt": "3.4 regrouped from 3 wholes and 4 tenths into 2 wholes and 14 tenths.",
            "title": "Regroup 3.4",
            "focus": {
              "x": 50,
              "y": 16,
              "w": 24,
              "h": 84
            },
            "hotspots": [
              {
                "label": "3 wholes, 4 tenths",
                "at": [
                  57,
                  55
                ],
                "note": "The number as first written.",
                "tone": "blue"
              },
              {
                "label": "2 wholes, 14 tenths",
                "at": [
                  68,
                  58
                ],
                "note": "The same value - one whole regrouped into ten more tenths.",
                "tone": "green"
              }
            ]
          },
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Decomposing and regrouping decimals.\n2. What should you check when working with Decomposing and regrouping decimals?", labelSize: 18 },
            { type: "text", value: "1) Split a decimal into place values and regroup without changing its value. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Decomposing and regrouping decimals. Split a decimal into place values and regroup without changing its value.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Decomposing and regrouping decimals.\n\nSplit a decimal into place values and regroup without changing its value.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "7.2-q1", prompt: "Use the board model to show one worked example of Decomposing and regrouping decimals. Which response follows the rule?", options: ["The model shows Decomposing and regrouping decimals correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "7.3",
      title: "🎯 Rounding decimals",
      scenes: [
        {
          label: "1. Rounding decimals",
          say: "Look at the next digit to decide whether to round up or down.",
          ops: [
            { type: "text", value: "🎯 Rounding decimals", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Look at the next digit to decide whether to round up or down.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 3 · Meet the idea",
          say: "Look at the next digit to decide whether to round up or down.",
          ops: [
            { type: "text", value: "3 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n4.4 = Rounding decimals\njump: 0 -> 4.4 (show Rounding decimals)", labelSize: 20 },
          ],
        },
        {
          label: "3. 3 · Tap and explain",
          say: "Tap the highlighted part and explain what Rounding decimals is doing.",
          ops: [
            { type: "text", value: "3 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n4.4 = Rounding decimals\njump: 0 -> 4.4 (show Rounding decimals)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Rounding decimals.\n2. What should you check when working with Rounding decimals?", labelSize: 18 },
            { type: "text", value: "1) Look at the next digit to decide whether to round up or down. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Rounding decimals. Look at the next digit to decide whether to round up or down.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Rounding decimals.\n\nLook at the next digit to decide whether to round up or down.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "7.3-q1", prompt: "Use the board model to show one worked example of Rounding decimals. Which response follows the rule?", options: ["The model shows Rounding decimals correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "7.4",
      title: "↔️ Scaling decimals",
      scenes: [
        {
          label: "1. Scaling decimals",
          say: "See how digits shift when multiplying or dividing by powers of ten.",
          ops: [
            { type: "text", value: "↔️ Scaling decimals", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "See how digits shift when multiplying or dividing by powers of ten.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 4 · Meet the idea",
          say: "See how digits shift when multiplying or dividing by powers of ten.",
          ops: [
            { type: "text", value: "4 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n5.6 = Scaling decimals\njump: 0 -> 5.6 (show Scaling decimals)", labelSize: 20 },
          ],
        },
        {
          label: "3. 4 · Tap and explain",
          say: "Tap the highlighted part and explain what Scaling decimals is doing.",
          ops: [
            { type: "text", value: "4 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n5.6 = Scaling decimals\njump: 0 -> 5.6 (show Scaling decimals)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Scaling decimals.\n2. What should you check when working with Scaling decimals?", labelSize: 18 },
            { type: "text", value: "1) See how digits shift when multiplying or dividing by powers of ten. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Scaling decimals. See how digits shift when multiplying or dividing by powers of ten.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Scaling decimals.\n\nSee how digits shift when multiplying or dividing by powers of ten.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "7.4-q1", prompt: "Use the board model to show one worked example of Scaling decimals. Which response follows the rule?", options: ["The model shows Scaling decimals correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "7.5",
      title: "🔢 Linear sequence rules",
      scenes: [
        {
          label: "1. Linear sequence rules",
          say: "Find the constant difference and use it to continue a sequence.",
          ops: [
            { type: "text", value: "🔢 Linear sequence rules", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Find the constant difference and use it to continue a sequence.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 5 · Meet the idea",
          say: "Find the constant difference and use it to continue a sequence.",
          ops: [
            { type: "text", value: "5 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n6.8 = Linear sequence rules\njump: 0 -> 6.8 (show Linear sequence rules)", labelSize: 20 },
          ],
        },
        {
          label: "3. 5 · Tap and explain",
          say: "Tap the highlighted part and explain what Linear sequence rules is doing.",
          ops: [
            { type: "text", value: "5 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n6.8 = Linear sequence rules\njump: 0 -> 6.8 (show Linear sequence rules)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Linear sequence rules.\n2. What should you check when working with Linear sequence rules?", labelSize: 18 },
            { type: "text", value: "1) Find the constant difference and use it to continue a sequence. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Linear sequence rules. Find the constant difference and use it to continue a sequence.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Linear sequence rules.\n\nFind the constant difference and use it to continue a sequence.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "7.5-q1", prompt: "Use the board model to show one worked example of Linear sequence rules. Which response follows the rule?", options: ["The model shows Linear sequence rules correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },
  ],
};
