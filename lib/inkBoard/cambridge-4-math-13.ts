import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 13 (Number patterns)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-13.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_13_INK: InkUnit = {
  unitKey: "cambridge-4-math-13",
  title: "Number patterns",
  badge: "Grade 4 · Unit 13",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "13.1",
      title: "⬛ Square numbers",
      scenes: [
        {
          label: "1. Square numbers",
          say: "A square number is made by multiplying a number by itself.",
          ops: [
            { type: "text", value: "⬛ Square numbers", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "A square number is made by multiplying a number by itself.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Square numbers.\n2. What should you check when working with Square numbers?", labelSize: 18 },
            { type: "text", value: "1) A square number is made by multiplying a number by itself. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Square numbers. A square number is made by multiplying a number by itself.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Square numbers.\n\nA square number is made by multiplying a number by itself.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "13.1-q1", prompt: "Use the board model to show one worked example of Square numbers. Which response follows the rule?", options: ["The model shows Square numbers correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "13.2",
      title: "🔺 Triangular numbers",
      scenes: [
        {
          label: "1. Triangular numbers",
          say: "Growing rows of dots build the triangular-number sequence.",
          ops: [
            { type: "text", value: "🔺 Triangular numbers", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Growing rows of dots build the triangular-number sequence.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Triangular numbers.\n2. What should you check when working with Triangular numbers?", labelSize: 18 },
            { type: "text", value: "1) Growing rows of dots build the triangular-number sequence. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Triangular numbers. Growing rows of dots build the triangular-number sequence.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Triangular numbers.\n\nGrowing rows of dots build the triangular-number sequence.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "13.2-q1", prompt: "Use the board model to show one worked example of Triangular numbers. Which response follows the rule?", options: ["The model shows Triangular numbers correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "13.3",
      title: "✅ Divisibility rules",
      scenes: [
        {
          label: "1. Divisibility rules",
          say: "Use quick tests to decide whether a number divides exactly.",
          ops: [
            { type: "text", value: "✅ Divisibility rules", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Use quick tests to decide whether a number divides exactly.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Divisibility rules.\n2. What should you check when working with Divisibility rules?", labelSize: 18 },
            { type: "text", value: "1) Use quick tests to decide whether a number divides exactly. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Divisibility rules. Use quick tests to decide whether a number divides exactly.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Divisibility rules.\n\nUse quick tests to decide whether a number divides exactly.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "13.3-q1", prompt: "Use the board model to show one worked example of Divisibility rules. Which response follows the rule?", options: ["The model shows Divisibility rules correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "13.4",
      title: "🧱 Prime and composite numbers",
      scenes: [
        {
          label: "1. Prime and composite numbers",
          say: "A prime has exactly two factors; a composite has more.",
          ops: [
            { type: "text", value: "🧱 Prime and composite numbers", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "A prime has exactly two factors; a composite has more.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Prime and composite numbers.\n2. What should you check when working with Prime and composite numbers?", labelSize: 18 },
            { type: "text", value: "1) A prime has exactly two factors; a composite has more. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Prime and composite numbers. A prime has exactly two factors; a composite has more.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Prime and composite numbers.\n\nA prime has exactly two factors; a composite has more.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "13.4-q1", prompt: "Use the board model to show one worked example of Prime and composite numbers. Which response follows the rule?", options: ["The model shows Prime and composite numbers correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },
  ],
};
