import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 11 (Fractions, decimals, percentages and proportion)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-11.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_11_INK: InkUnit = {
  unitKey: "cambridge-4-math-11",
  title: "Fractions, decimals, percentages and proportion",
  badge: "Grade 4 · Unit 11",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "11.1",
      title: "% Percentages of a whole",
      scenes: [
        {
          label: "1. Percentages of a whole",
          say: "Percent means parts out of one hundred.",
          ops: [
            { type: "text", value: "% Percentages of a whole", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Percent means parts out of one hundred.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Percentages of a whole.\n2. What should you check when working with Percentages of a whole?", labelSize: 18 },
            { type: "text", value: "1) Percent means parts out of one hundred. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Percentages of a whole. Percent means parts out of one hundred.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Percentages of a whole.\n\nPercent means parts out of one hundred.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "11.1-q1", prompt: "Use the board model to show one worked example of Percentages of a whole. Which response follows the rule?", options: ["The model shows Percentages of a whole correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "11.2",
      title: "🔁 Fractions, decimals and percentages",
      scenes: [
        {
          label: "1. Fractions, decimals and percentages",
          say: "Translate between three ways of naming the same amount.",
          ops: [
            { type: "text", value: "🔁 Fractions, decimals and percentages", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Translate between three ways of naming the same amount.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Fractions, decimals and percentages.\n2. What should you check when working with Fractions, decimals and percentages?", labelSize: 18 },
            { type: "text", value: "1) Translate between three ways of naming the same amount. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Fractions, decimals and percentages. Translate between three ways of naming the same amount.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Fractions, decimals and percentages.\n\nTranslate between three ways of naming the same amount.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "11.2-q1", prompt: "Use the board model to show one worked example of Fractions, decimals and percentages. Which response follows the rule?", options: ["The model shows Fractions, decimals and percentages correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "11.3",
      title: "⚖️ Comparing and ordering quantities",
      scenes: [
        {
          label: "1. Comparing and ordering quantities",
          say: "Convert values to a common form before comparing them.",
          ops: [
            { type: "text", value: "⚖️ Comparing and ordering quantities", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Convert values to a common form before comparing them.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Comparing and ordering quantities.\n2. What should you check when working with Comparing and ordering quantities?", labelSize: 18 },
            { type: "text", value: "1) Convert values to a common form before comparing them. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Comparing and ordering quantities. Convert values to a common form before comparing them.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Comparing and ordering quantities.\n\nConvert values to a common form before comparing them.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "11.3-q1", prompt: "Use the board model to show one worked example of Comparing and ordering quantities. Which response follows the rule?", options: ["The model shows Comparing and ordering quantities correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "11.4",
      title: "🍰 Fractions of amounts",
      scenes: [
        {
          label: "1. Fractions of amounts",
          say: "Find a unit fraction first, then scale it to the numerator.",
          ops: [
            { type: "text", value: "🍰 Fractions of amounts", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Find a unit fraction first, then scale it to the numerator.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Fractions of amounts.\n2. What should you check when working with Fractions of amounts?", labelSize: 18 },
            { type: "text", value: "1) Find a unit fraction first, then scale it to the numerator. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Fractions of amounts. Find a unit fraction first, then scale it to the numerator.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Fractions of amounts.\n\nFind a unit fraction first, then scale it to the numerator.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "11.4-q1", prompt: "Use the board model to show one worked example of Fractions of amounts. Which response follows the rule?", options: ["The model shows Fractions of amounts correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "11.5",
      title: "🧃 Ratio and proportion",
      scenes: [
        {
          label: "1. Ratio and proportion",
          say: "Keep relationships equal while quantities grow or shrink.",
          ops: [
            { type: "text", value: "🧃 Ratio and proportion", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Keep relationships equal while quantities grow or shrink.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Ratio and proportion.\n2. What should you check when working with Ratio and proportion?", labelSize: 18 },
            { type: "text", value: "1) Keep relationships equal while quantities grow or shrink. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Ratio and proportion. Keep relationships equal while quantities grow or shrink.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Ratio and proportion.\n\nKeep relationships equal while quantities grow or shrink.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "11.5-q1", prompt: "Use the board model to show one worked example of Ratio and proportion. Which response follows the rule?", options: ["The model shows Ratio and proportion correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },
  ],
};
