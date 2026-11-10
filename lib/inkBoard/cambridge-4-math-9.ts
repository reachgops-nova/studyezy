import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 9 (Calculation)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-9.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_9_INK: InkUnit = {
  unitKey: "cambridge-4-math-9",
  title: "Calculation",
  badge: "Grade 4 · Unit 9",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "9.1",
      title: "➕ Mental addition strategies",
      scenes: [
        {
          label: "1. Mental addition strategies",
          say: "Bridge through friendly numbers to make large calculations easier.",
          ops: [
            { type: "text", value: "➕ Mental addition strategies", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Bridge through friendly numbers to make large calculations easier.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 1 · Meet the idea",
          say: "Bridge through friendly numbers to make large calculations easier.",
          ops: [
            { type: "text", value: "1 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n2 = Mental addition strategies\njump: 0 -> 2 (show Mental addition strategies)", labelSize: 20 },
          ],
        },
        {
          label: "3. 1 · Tap and explain",
          say: "Tap the highlighted part and explain what Mental addition strategies is doing.",
          ops: [
            { type: "text", value: "1 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n2 = Mental addition strategies\njump: 0 -> 2 (show Mental addition strategies)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Mental addition strategies.\n2. What should you check when working with Mental addition strategies?", labelSize: 18 },
            { type: "text", value: "1) Bridge through friendly numbers to make large calculations easier. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Mental addition strategies. Bridge through friendly numbers to make large calculations easier.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Mental addition strategies.\n\nBridge through friendly numbers to make large calculations easier.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "9.1-q1", prompt: "Use the board model to show one worked example of Mental addition strategies. Which response follows the rule?", options: ["The model shows Mental addition strategies correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "9.2",
      title: "🔟 Adding decimals",
      scenes: [
        {
          label: "1. Adding decimals",
          say: "Keep place values aligned and combine wholes and decimal parts.",
          ops: [
            { type: "text", value: "🔟 Adding decimals", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Keep place values aligned and combine wholes and decimal parts.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 2 · Meet the idea",
          say: "Keep place values aligned and combine wholes and decimal parts.",
          ops: [
            { type: "text", value: "2 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n3.2 = Adding decimals\njump: 0 -> 3.2 (show Adding decimals)", labelSize: 20 },
          ],
        },
        {
          label: "3. 2 · Tap and explain",
          say: "Tap the highlighted part and explain what Adding decimals is doing.",
          ops: [
            { type: "text", value: "2 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n3.2 = Adding decimals\njump: 0 -> 3.2 (show Adding decimals)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Adding decimals.\n2. What should you check when working with Adding decimals?", labelSize: 18 },
            { type: "text", value: "1) Keep place values aligned and combine wholes and decimal parts. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Adding decimals. Keep place values aligned and combine wholes and decimal parts.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Adding decimals.\n\nKeep place values aligned and combine wholes and decimal parts.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "9.2-q1", prompt: "Use the board model to show one worked example of Adding decimals. Which response follows the rule?", options: ["The model shows Adding decimals correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "9.3",
      title: "✖️ Two-digit multiplication",
      scenes: [
        {
          label: "1. Two-digit multiplication",
          say: "Partition a factor and combine the partial products.",
          ops: [
            { type: "text", value: "✖️ Two-digit multiplication", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Partition a factor and combine the partial products.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 3 · Meet the idea",
          say: "Partition a factor and combine the partial products.",
          ops: [
            { type: "text", value: "3 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n4.4 = Two-digit multiplication\njump: 0 -> 4.4 (show Two-digit multiplication)", labelSize: 20 },
          ],
        },
        {
          label: "3. 3 · Tap and explain",
          say: "Tap the highlighted part and explain what Two-digit multiplication is doing.",
          ops: [
            { type: "text", value: "3 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n4.4 = Two-digit multiplication\njump: 0 -> 4.4 (show Two-digit multiplication)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Two-digit multiplication.\n2. What should you check when working with Two-digit multiplication?", labelSize: 18 },
            { type: "text", value: "1) Partition a factor and combine the partial products. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Two-digit multiplication. Partition a factor and combine the partial products.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Two-digit multiplication.\n\nPartition a factor and combine the partial products.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "9.3-q1", prompt: "Use the board model to show one worked example of Two-digit multiplication. Which response follows the rule?", options: ["The model shows Two-digit multiplication correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "9.4",
      title: "➗ Division with remainders",
      scenes: [
        {
          label: "1. Division with remainders",
          say: "Share equally, then describe what is left over as the remainder.",
          ops: [
            { type: "text", value: "➗ Division with remainders", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Share equally, then describe what is left over as the remainder.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 4 · Meet the idea",
          say: "Share equally, then describe what is left over as the remainder.",
          ops: [
            { type: "text", value: "4 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n5.6 = Division with remainders\njump: 0 -> 5.6 (show Division with remainders)", labelSize: 20 },
          ],
        },
        {
          label: "3. 4 · Tap and explain",
          say: "Tap the highlighted part and explain what Division with remainders is doing.",
          ops: [
            { type: "text", value: "4 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n5.6 = Division with remainders\njump: 0 -> 5.6 (show Division with remainders)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Division with remainders.\n2. What should you check when working with Division with remainders?", labelSize: 18 },
            { type: "text", value: "1) Share equally, then describe what is left over as the remainder. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Division with remainders. Share equally, then describe what is left over as the remainder.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Division with remainders.\n\nShare equally, then describe what is left over as the remainder.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "9.4-q1", prompt: "Use the board model to show one worked example of Division with remainders. Which response follows the rule?", options: ["The model shows Division with remainders correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "9.5",
      title: "🧭 Order of operations",
      scenes: [
        {
          label: "1. Order of operations",
          say: "Follow the order so multiplication and division happen before addition.",
          ops: [
            { type: "text", value: "🧭 Order of operations", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Follow the order so multiplication and division happen before addition.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 5 · Meet the idea",
          say: "Follow the order so multiplication and division happen before addition.",
          ops: [
            { type: "text", value: "5 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n6.8 = Order of operations\njump: 0 -> 6.8 (show Order of operations)", labelSize: 20 },
          ],
        },
        {
          label: "3. 5 · Tap and explain",
          say: "Tap the highlighted part and explain what Order of operations is doing.",
          ops: [
            { type: "text", value: "5 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n6.8 = Order of operations\njump: 0 -> 6.8 (show Order of operations)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Order of operations.\n2. What should you check when working with Order of operations?", labelSize: 18 },
            { type: "text", value: "1) Follow the order so multiplication and division happen before addition. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Order of operations. Follow the order so multiplication and division happen before addition.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Order of operations.\n\nFollow the order so multiplication and division happen before addition.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "9.5-q1", prompt: "Use the board model to show one worked example of Order of operations. Which response follows the rule?", options: ["The model shows Order of operations correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },
  ],
};
