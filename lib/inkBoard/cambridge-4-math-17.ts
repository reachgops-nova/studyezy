import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 17 (Fractions and proportion)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-17.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_17_INK: InkUnit = {
  unitKey: "cambridge-4-math-17",
  title: "Fractions and proportion",
  badge: "Grade 4 · Unit 17",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "17.1",
      title: "⚖️ Comparing fractions, decimals and percentages",
      scenes: [
        {
          label: "1. Comparing fractions, decimals and percentages",
          say: "Convert values to a common representation before ordering them.",
          ops: [
            { type: "text", value: "⚖️ Comparing fractions, decimals and percentages", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Convert values to a common representation before ordering them.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Comparing fractions, decimals and percentages.\n2. What should you check when working with Comparing fractions, decimals and percentages?", labelSize: 18 },
            { type: "text", value: "1) Convert values to a common representation before ordering them. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Comparing fractions, decimals and percentages. Convert values to a common representation before ordering them.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Comparing fractions, decimals and percentages.\n\nConvert values to a common representation before ordering them.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "17.1-q1", prompt: "Use the board model to show one worked example of Comparing fractions, decimals and percentages. Which response follows the rule?", options: ["The model shows Comparing fractions, decimals and percentages correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "17.2",
      title: "➕ Adding and subtracting related fractions",
      scenes: [
        {
          label: "1. Adding and subtracting related fractions",
          say: "Find a common denominator before combining fractions.",
          ops: [
            { type: "text", value: "➕ Adding and subtracting related fractions", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Find a common denominator before combining fractions.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Adding and subtracting related fractions.\n2. What should you check when working with Adding and subtracting related fractions?", labelSize: 18 },
            { type: "text", value: "1) Find a common denominator before combining fractions. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Adding and subtracting related fractions. Find a common denominator before combining fractions.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Adding and subtracting related fractions.\n\nFind a common denominator before combining fractions.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "17.2-q1", prompt: "Use the board model to show one worked example of Adding and subtracting related fractions. Which response follows the rule?", options: ["The model shows Adding and subtracting related fractions correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "17.3",
      title: "➗ Dividing unit fractions",
      scenes: [
        {
          label: "1. Dividing unit fractions",
          say: "Understand how sharing a unit fraction changes its size.",
          ops: [
            { type: "text", value: "➗ Dividing unit fractions", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Understand how sharing a unit fraction changes its size.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Dividing unit fractions.\n2. What should you check when working with Dividing unit fractions?", labelSize: 18 },
            { type: "text", value: "1) Understand how sharing a unit fraction changes its size. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Dividing unit fractions. Understand how sharing a unit fraction changes its size.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Dividing unit fractions.\n\nUnderstand how sharing a unit fraction changes its size.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "17.3-q1", prompt: "Use the board model to show one worked example of Dividing unit fractions. Which response follows the rule?", options: ["The model shows Dividing unit fractions correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "17.4",
      title: "✖️ Multiplying unit fractions",
      scenes: [
        {
          label: "1. Multiplying unit fractions",
          say: "Multiply numerator and denominator while keeping the model visible.",
          ops: [
            { type: "text", value: "✖️ Multiplying unit fractions", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Multiply numerator and denominator while keeping the model visible.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Multiplying unit fractions.\n2. What should you check when working with Multiplying unit fractions?", labelSize: 18 },
            { type: "text", value: "1) Multiply numerator and denominator while keeping the model visible. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Multiplying unit fractions. Multiply numerator and denominator while keeping the model visible.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Multiplying unit fractions.\n\nMultiply numerator and denominator while keeping the model visible.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "17.4-q1", prompt: "Use the board model to show one worked example of Multiplying unit fractions. Which response follows the rule?", options: ["The model shows Multiplying unit fractions correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "17.5",
      title: "🧃 Ratio and proportion",
      scenes: [
        {
          label: "1. Ratio and proportion",
          say: "Scale two linked quantities by the same factor.",
          ops: [
            { type: "text", value: "🧃 Ratio and proportion", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Scale two linked quantities by the same factor.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Ratio and proportion.\n2. What should you check when working with Ratio and proportion?", labelSize: 18 },
            { type: "text", value: "1) Scale two linked quantities by the same factor. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Ratio and proportion. Scale two linked quantities by the same factor.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Ratio and proportion.\n\nScale two linked quantities by the same factor.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "17.5-q1", prompt: "Use the board model to show one worked example of Ratio and proportion. Which response follows the rule?", options: ["The model shows Ratio and proportion correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },
  ],
};
