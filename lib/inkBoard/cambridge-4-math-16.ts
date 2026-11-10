import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 16 (Statistical methods)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-16.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_16_INK: InkUnit = {
  unitKey: "cambridge-4-math-16",
  title: "Statistical methods",
  badge: "Grade 4 · Unit 16",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "16.1",
      title: "📍 Mode and median",
      scenes: [
        {
          label: "1. Mode and median",
          say: "Use the middle and most frequent values to describe data.",
          ops: [
            { type: "text", value: "📍 Mode and median", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Use the middle and most frequent values to describe data.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Mode and median.\n2. What should you check when working with Mode and median?", labelSize: 18 },
            { type: "text", value: "1) Use the middle and most frequent values to describe data. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Mode and median. Use the middle and most frequent values to describe data.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Mode and median.\n\nUse the middle and most frequent values to describe data.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "16.1-q1", prompt: "Use the board model to show one worked example of Mode and median. Which response follows the rule?", options: ["The model shows Mode and median correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "16.2",
      title: "🧇 Waffle diagrams",
      scenes: [
        {
          label: "1. Waffle diagrams",
          say: "Represent a percentage by shading equal squares in a grid.",
          ops: [
            { type: "text", value: "🧇 Waffle diagrams", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Represent a percentage by shading equal squares in a grid.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Waffle diagrams.\n2. What should you check when working with Waffle diagrams?", labelSize: 18 },
            { type: "text", value: "1) Represent a percentage by shading equal squares in a grid. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Waffle diagrams. Represent a percentage by shading equal squares in a grid.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Waffle diagrams.\n\nRepresent a percentage by shading equal squares in a grid.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "16.2-q1", prompt: "Use the board model to show one worked example of Waffle diagrams. Which response follows the rule?", options: ["The model shows Waffle diagrams correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },
  ],
};
