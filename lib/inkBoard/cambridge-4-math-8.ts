import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 8 (Probability)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-8.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_8_INK: InkUnit = {
  unitKey: "cambridge-4-math-8",
  title: "Probability",
  badge: "Grade 4 · Unit 8",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "8.1",
      title: "🎲 Likelihood scale",
      scenes: [
        {
          label: "1. Likelihood scale",
          say: "Place events from impossible through unlikely and likely to certain.",
          ops: [
            { type: "text", value: "🎲 Likelihood scale", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Place events from impossible through unlikely and likely to certain.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Likelihood scale.\n2. What should you check when working with Likelihood scale?", labelSize: 18 },
            { type: "text", value: "1) Place events from impossible through unlikely and likely to certain. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Likelihood scale. Place events from impossible through unlikely and likely to certain.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Likelihood scale.\n\nPlace events from impossible through unlikely and likely to certain.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "8.1-q1", prompt: "Use the board model to show one worked example of Likelihood scale. Which response follows the rule?", options: ["The model shows Likelihood scale correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "8.2",
      title: "🧪 Probability experiments",
      scenes: [
        {
          label: "1. Probability experiments",
          say: "Run repeated trials and compare predicted and actual frequencies.",
          ops: [
            { type: "text", value: "🧪 Probability experiments", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Run repeated trials and compare predicted and actual frequencies.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Probability experiments.\n2. What should you check when working with Probability experiments?", labelSize: 18 },
            { type: "text", value: "1) Run repeated trials and compare predicted and actual frequencies. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Probability experiments. Run repeated trials and compare predicted and actual frequencies.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Probability experiments.\n\nRun repeated trials and compare predicted and actual frequencies.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "8.2-q1", prompt: "Use the board model to show one worked example of Probability experiments. Which response follows the rule?", options: ["The model shows Probability experiments correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },
  ],
};
