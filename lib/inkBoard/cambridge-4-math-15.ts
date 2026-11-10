import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 15 (Calculation)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-15.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_15_INK: InkUnit = {
  unitKey: "cambridge-4-math-15",
  title: "Calculation",
  badge: "Grade 4 · Unit 15",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "15.1",
      title: "❓ Missing numbers and inverse operations",
      scenes: [
        {
          label: "1. Missing numbers and inverse operations",
          say: "Work backwards with the inverse operation to find an unknown.",
          ops: [
            { type: "text", value: "❓ Missing numbers and inverse operations", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Work backwards with the inverse operation to find an unknown.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 1 · Meet the idea",
          say: "Work backwards with the inverse operation to find an unknown.",
          ops: [
            { type: "text", value: "1 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n2 = Missing numbers and inverse operations\njump: 0 -> 2 (show Missing numbers and inverse operations)", labelSize: 20 },
          ],
        },
        {
          label: "3. 1 · Tap and explain",
          say: "Tap the highlighted part and explain what Missing numbers and inverse operations is doing.",
          ops: [
            { type: "text", value: "1 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n2 = Missing numbers and inverse operations\njump: 0 -> 2 (show Missing numbers and inverse operations)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Missing numbers and inverse operations.\n2. What should you check when working with Missing numbers and inverse operations?", labelSize: 18 },
            { type: "text", value: "1) Work backwards with the inverse operation to find an unknown. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Missing numbers and inverse operations. Work backwards with the inverse operation to find an unknown.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Missing numbers and inverse operations.\n\nWork backwards with the inverse operation to find an unknown.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "15.1-q1", prompt: "Use the board model to show one worked example of Missing numbers and inverse operations. Which response follows the rule?", options: ["The model shows Missing numbers and inverse operations correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "15.2",
      title: "🧭 Order of operations",
      scenes: [
        {
          label: "1. Order of operations",
          say: "Evaluate expressions in the correct order.",
          ops: [
            { type: "text", value: "🧭 Order of operations", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Evaluate expressions in the correct order.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 2 · Meet the idea",
          say: "Evaluate expressions in the correct order.",
          ops: [
            { type: "text", value: "2 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n3.2 = Order of operations\njump: 0 -> 3.2 (show Order of operations)", labelSize: 20 },
          ],
        },
        {
          label: "3. 2 · Tap and explain",
          say: "Tap the highlighted part and explain what Order of operations is doing.",
          ops: [
            { type: "text", value: "2 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n3.2 = Order of operations\njump: 0 -> 3.2 (show Order of operations)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Order of operations.\n2. What should you check when working with Order of operations?", labelSize: 18 },
            { type: "text", value: "1) Evaluate expressions in the correct order. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Order of operations. Evaluate expressions in the correct order.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Order of operations.\n\nEvaluate expressions in the correct order.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "15.2-q1", prompt: "Use the board model to show one worked example of Order of operations. Which response follows the rule?", options: ["The model shows Order of operations correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "15.3",
      title: "✍️ Written multiplication and division",
      scenes: [
        {
          label: "1. Written multiplication and division",
          say: "Organise place values so each written step is visible.",
          ops: [
            { type: "text", value: "✍️ Written multiplication and division", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Organise place values so each written step is visible.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 3 · Meet the idea",
          say: "Organise place values so each written step is visible.",
          ops: [
            { type: "text", value: "3 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n4.4 = Written multiplication and division\njump: 0 -> 4.4 (show Written multiplication and division)", labelSize: 20 },
          ],
        },
        {
          label: "3. 3 · Tap and explain",
          say: "Tap the highlighted part and explain what Written multiplication and division is doing.",
          ops: [
            { type: "text", value: "3 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n4.4 = Written multiplication and division\njump: 0 -> 4.4 (show Written multiplication and division)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Written multiplication and division.\n2. What should you check when working with Written multiplication and division?", labelSize: 18 },
            { type: "text", value: "1) Organise place values so each written step is visible. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Written multiplication and division. Organise place values so each written step is visible.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Written multiplication and division.\n\nOrganise place values so each written step is visible.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "15.3-q1", prompt: "Use the board model to show one worked example of Written multiplication and division. Which response follows the rule?", options: ["The model shows Written multiplication and division correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "15.4",
      title: "🔟 Adding and subtracting decimals",
      scenes: [
        {
          label: "1. Adding and subtracting decimals",
          say: "Line up decimal points before calculating.",
          ops: [
            { type: "text", value: "🔟 Adding and subtracting decimals", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Line up decimal points before calculating.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 4 · Meet the idea",
          say: "Line up decimal points before calculating.",
          ops: [
            { type: "text", value: "4 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n5.6 = Adding and subtracting decimals\njump: 0 -> 5.6 (show Adding and subtracting decimals)", labelSize: 20 },
          ],
        },
        {
          label: "3. 4 · Tap and explain",
          say: "Tap the highlighted part and explain what Adding and subtracting decimals is doing.",
          ops: [
            { type: "text", value: "4 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n5.6 = Adding and subtracting decimals\njump: 0 -> 5.6 (show Adding and subtracting decimals)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Adding and subtracting decimals.\n2. What should you check when working with Adding and subtracting decimals?", labelSize: 18 },
            { type: "text", value: "1) Line up decimal points before calculating. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Adding and subtracting decimals. Line up decimal points before calculating.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Adding and subtracting decimals.\n\nLine up decimal points before calculating.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "15.4-q1", prompt: "Use the board model to show one worked example of Adding and subtracting decimals. Which response follows the rule?", options: ["The model shows Adding and subtracting decimals correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },

    {
      topicId: "15.5",
      title: "✖️ Multiplying decimals",
      scenes: [
        {
          label: "1. Multiplying decimals",
          say: "Multiply the digits, then place the decimal using place value.",
          ops: [
            { type: "text", value: "✖️ Multiplying decimals", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Multiply the digits, then place the decimal using place value.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 5 · Meet the idea",
          say: "Multiply the digits, then place the decimal using place value.",
          ops: [
            { type: "text", value: "5 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n6.8 = Multiplying decimals\njump: 0 -> 6.8 (show Multiplying decimals)", labelSize: 20 },
          ],
        },
        {
          label: "3. 5 · Tap and explain",
          say: "Tap the highlighted part and explain what Multiplying decimals is doing.",
          ops: [
            { type: "text", value: "5 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n6.8 = Multiplying decimals\njump: 0 -> 6.8 (show Multiplying decimals)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the board model to show one worked example of Multiplying decimals.\n2. What should you check when working with Multiplying decimals?", labelSize: 18 },
            { type: "text", value: "1) Multiply the digits, then place the decimal using place value. Show the operation, label the units, and check that the answer makes sense.\n2) Check the units, the operation, and whether the answer makes sense in the model.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Multiplying decimals. Multiply the digits, then place the decimal using place value.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Multiplying decimals.\n\nMultiply the digits, then place the decimal using place value.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "15.5-q1", prompt: "Use the board model to show one worked example of Multiplying decimals. Which response follows the rule?", options: ["The model shows Multiplying decimals correctly","Skip the model and guess"], correctIndex: 0, explanation: "Yes. Now explain each step and check the result against the example." },
      ],
    },
  ],
};
