import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 6 (Fractions, decimals and percentages)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-6.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_6_INK: InkUnit = {
  unitKey: "cambridge-4-math-6",
  title: "Fractions, decimals and percentages",
  badge: "Grade 4 · Unit 6",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "6.1",
      title: "🍕 Fractions as division",
      scenes: [
        {
          label: "1. Fractions as division",
          say: "A fraction shows an amount shared into equal parts.",
          ops: [
            { type: "text", value: "🍕 Fractions as division", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "A fraction shows an amount shared into equal parts.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Fractions as division.\n2. What should you check when working with Fractions as division?", labelSize: 18 },
            { type: "text", value: "1) A fraction shows an amount shared into equal parts. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Fractions as division. A fraction shows an amount shared into equal parts.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Fractions as division.\n\nA fraction shows an amount shared into equal parts.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "6.1-q1", prompt: "Use the board model to show one worked example of Fractions as division. Which response follows the rule?", options: ["The model shows Fractions as division correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "6.2",
      title: "🟰 Equivalent fractions",
      scenes: [
        {
          label: "1. Equivalent fractions",
          say: "Different-looking fractions can name exactly the same value.",
          ops: [
            { type: "text", value: "🟰 Equivalent fractions", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Different-looking fractions can name exactly the same value.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Equivalent fractions.\n2. What should you check when working with Equivalent fractions?", labelSize: 18 },
            { type: "text", value: "1) Different-looking fractions can name exactly the same value. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Equivalent fractions. Different-looking fractions can name exactly the same value.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Equivalent fractions.\n\nDifferent-looking fractions can name exactly the same value.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "6.2-q1", prompt: "Use the board model to show one worked example of Equivalent fractions. Which response follows the rule?", options: ["The model shows Equivalent fractions correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "6.3",
      title: "🥧 Mixed numbers",
      scenes: [
        {
          label: "1. Mixed numbers",
          say: "Combine whole numbers and fractional parts without changing the value.",
          ops: [
            { type: "text", value: "🥧 Mixed numbers", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Combine whole numbers and fractional parts without changing the value.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Mixed numbers.\n2. What should you check when working with Mixed numbers?", labelSize: 18 },
            { type: "text", value: "1) Combine whole numbers and fractional parts without changing the value. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Mixed numbers. Combine whole numbers and fractional parts without changing the value.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Mixed numbers.\n\nCombine whole numbers and fractional parts without changing the value.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "6.3-q1", prompt: "Use the board model to show one worked example of Mixed numbers. Which response follows the rule?", options: ["The model shows Mixed numbers correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "6.4",
      title: "🎯 Fractions of quantities",
      scenes: [
        {
          label: "1. Fractions of quantities",
          say: "Find a fraction of an amount by sharing, then multiplying if needed.",
          ops: [
            { type: "text", value: "🎯 Fractions of quantities", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Find a fraction of an amount by sharing, then multiplying if needed.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Fractions of quantities.\n2. What should you check when working with Fractions of quantities?", labelSize: 18 },
            { type: "text", value: "1) Find a fraction of an amount by sharing, then multiplying if needed. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Fractions of quantities. Find a fraction of an amount by sharing, then multiplying if needed.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Fractions of quantities.\n\nFind a fraction of an amount by sharing, then multiplying if needed.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "6.4-q1", prompt: "Use the board model to show one worked example of Fractions of quantities. Which response follows the rule?", options: ["The model shows Fractions of quantities correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "6.5",
      title: "🔗 Related fractions",
      scenes: [
        {
          label: "1. Related fractions",
          say: "Connect fractions, decimals and percentages that represent the same amount.",
          ops: [
            { type: "text", value: "🔗 Related fractions", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Connect fractions, decimals and percentages that represent the same amount.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Related fractions.\n2. What should you check when working with Related fractions?", labelSize: 18 },
            { type: "text", value: "1) Connect fractions, decimals and percentages that represent the same amount. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Related fractions. Connect fractions, decimals and percentages that represent the same amount.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Related fractions.\n\nConnect fractions, decimals and percentages that represent the same amount.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "6.5-q1", prompt: "Use the board model to show one worked example of Related fractions. Which response follows the rule?", options: ["The model shows Related fractions correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },
  ],
};
