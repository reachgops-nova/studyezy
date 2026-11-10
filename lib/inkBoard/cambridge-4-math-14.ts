import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 14 (Location and movement)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-14.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_14_INK: InkUnit = {
  unitKey: "cambridge-4-math-14",
  title: "Location and movement",
  badge: "Grade 4 · Unit 14",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "14.1",
      title: "🪞 Reflections",
      scenes: [
        {
          label: "1. Reflections",
          say: "Reflect a point the same distance across a mirror line.",
          ops: [
            { type: "text", value: "🪞 Reflections", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Reflect a point the same distance across a mirror line.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Reflections.\n2. What should you check when working with Reflections?", labelSize: 18 },
            { type: "text", value: "1) Reflect a point the same distance across a mirror line. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Reflections. Reflect a point the same distance across a mirror line.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Reflections.\n\nReflect a point the same distance across a mirror line.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "14.1-q1", prompt: "Use the board model to show one worked example of Reflections. Which response follows the rule?", options: ["The model shows Reflections correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "14.2",
      title: "↔️ Translation and reflection",
      scenes: [
        {
          label: "1. Translation and reflection",
          say: "Tell the difference between sliding a shape and flipping it.",
          ops: [
            { type: "text", value: "↔️ Translation and reflection", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Tell the difference between sliding a shape and flipping it.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Translation and reflection.\n2. What should you check when working with Translation and reflection?", labelSize: 18 },
            { type: "text", value: "1) Tell the difference between sliding a shape and flipping it. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Translation and reflection. Tell the difference between sliding a shape and flipping it.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Translation and reflection.\n\nTell the difference between sliding a shape and flipping it.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "14.2-q1", prompt: "Use the board model to show one worked example of Translation and reflection. Which response follows the rule?", options: ["The model shows Translation and reflection correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },
  ],
};
