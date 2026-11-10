import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 3 (Calculation)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-3.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_3_INK: InkUnit = {
  unitKey: "cambridge-4-math-3",
  title: "Calculation",
  badge: "Grade 4 · Unit 3",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "3.1",
      title: "➖ Calculating with negative numbers",
      scenes: [
        {
          label: "1. Calculating with negative numbers",
          say: "Use a number line to add and subtract across zero.",
          ops: [
            { type: "text", value: "➖ Calculating with negative numbers", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Use a number line to add and subtract across zero.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 1 · Start at −4, add 5",
          say: "Start at negative 4. Add 5 - watch the counter slide 5 steps right. Where does it land?",
          ops: [
            { type: "text", value: "1 · Start at −4, add 5", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: -5 to 9\n-4 = start −4\n0 = zero\n1 = finish 1\njump: -4 -> 1 (+5)", labelSize: 20 },
          ],
        },
        {
          label: "3. 1 · Start at −5, add 4",
          say: "Now start at negative 5 instead and add 4. Same idea, different numbers - watch where it lands this time.",
          ops: [
            { type: "text", value: "1 · Start at −5, add 4", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: -5 to 9\n-5 = start −5\n0 = zero\n-1 = finish −1\njump: -5 -> -1 (+4)", labelSize: 20 },
          ],
        },
        {
          label: "4. 🖼️ Explore: 1 · Poster · below zero",
          say: "Here is the same idea on a thermometer. Zero sits in the middle - counting down from six by fives lands on one, then negative four, then negative nine, the same way you just watched on the counter.",
          ops: [],
          image: {
            "src": "/board-art/math7-decimals-negative.jpg",
            "alt": "A thermometer and number line from -10 to 10, showing counting backwards by 5s from 6 to -9.",
            "title": "Below zero",
            "focus": {
              "x": 74.5,
              "y": 16,
              "w": 25.5,
              "h": 84
            },
            "hotspots": [
              {
                "label": "Backwards 5",
                "at": [
                  80,
                  46
                ],
                "note": "6 minus 5 is 1 - still above zero.",
                "tone": "gold"
              },
              {
                "label": "Backwards 5",
                "at": [
                  86,
                  46
                ],
                "note": "1 minus 5 is negative 4 - now below zero.",
                "tone": "red"
              },
              {
                "label": "Backwards 5",
                "at": [
                  92,
                  46
                ],
                "note": "Negative 4 minus 5 is negative 9 - keep counting the same way.",
                "tone": "red"
              }
            ]
          },
        },
        {
          label: "5. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Start at −4 and add 5. Where do you land?\n2. Start at −5 and add 4. Where do you land?", labelSize: 18 },
            { type: "text", value: "1) 1: from −4, slide 5 steps right, crossing zero, to land on 1.\n2) −1: from −5, slide 4 steps right - not quite enough to reach zero, so it lands on −1.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "6. 💡 Remember this",
          say: "Say the rule for Calculating with negative numbers. Use a number line to add and subtract across zero.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Calculating with negative numbers.\n\nUse a number line to add and subtract across zero.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "3.1-q1", prompt: "Start at −3. Now add 6. Drag the marker along the line to where you land.", options: ["3","not 3"], correctIndex: 0, explanation: "Yes - 3. From −3, six steps right crosses zero and lands on 3." },
      ],
    },

    {
      topicId: "3.2",
      title: "🧠 Mental addition and subtraction",
      scenes: [
        {
          label: "1. Mental addition and subtraction",
          say: "Break numbers into friendly parts and use estimation to check.",
          ops: [
            { type: "text", value: "🧠 Mental addition and subtraction", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Break numbers into friendly parts and use estimation to check.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 2 · Meet the idea",
          say: "Break numbers into friendly parts and use estimation to check.",
          ops: [
            { type: "text", value: "2 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 4000 to 8000\n4653 = start 4653\n4700 = finish 4700\njump: 4653 -> 7653 (+3000)\njump: 7653 -> 7154 (−499)\njump: 7154 -> 4668 (−2486)\njump: 4668 -> 4700 (+32)", labelSize: 20 },
          ],
        },
        {
          label: "3. 2 · Tap and explain",
          say: "Tap the highlighted part and explain what Mental addition and subtraction is doing.",
          ops: [
            { type: "text", value: "2 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 4000 to 8000\n4653 = start 4653\n4700 = finish 4700\njump: 4653 -> 7653 (+3000)\njump: 7653 -> 7154 (−499)\njump: 7154 -> 4668 (−2486)\njump: 4668 -> 4700 (+32)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Start at 4653. Add 3000, subtract 499, subtract 2486, then add 32. What is the answer?\n2. Which rowers in Team Yellow (88 kg, 79 kg, 96 kg, 81 kg) have a total mass that is a multiple of ten?", labelSize: 18 },
            { type: "text", value: "1) 4700: 4653 + 3000 = 7653, − 499 = 7154, − 2486 = 4668, + 32 = 4700.\n2) Rower 2 and Rower 4: 79 + 81 = 160, a multiple of ten.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Mental addition and subtraction. Break numbers into friendly parts and use estimation to check.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Mental addition and subtraction.\n\nBreak numbers into friendly parts and use estimation to check.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "3.2-q1", prompt: "Start at 6255 (that's 6345 − 90). Now subtract 255. Drag the marker to where you land.", options: ["6000","not 6000"], correctIndex: 0, explanation: "Yes - 6000. 6255 − 255 = 6000, a nice round number to land on." },
      ],
    },

    {
      topicId: "3.3",
      title: "🔎 Solving equations",
      scenes: [
        {
          label: "1. Solving equations",
          say: "Find the unknown by undoing the operation that was used.",
          ops: [
            { type: "text", value: "🔎 Solving equations", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Find the unknown by undoing the operation that was used.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 3 · Meet the idea",
          say: "Find the unknown by undoing the operation that was used.",
          ops: [
            { type: "text", value: "3 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 295, h: 220, color: "#16a34a", label: "Given\nTwo spinning tops cost $16\nSo one spinning top costs 16 ÷ 2 = $8.", labelSize: 17 },
            { type: "box", x: 375, y: 120, w: 295, h: 220, color: "#16a34a", label: "Given\nA spinning top and a toy car cost $20\nSo the toy car costs 20 − 8 = $12.", labelSize: 17 },
            { type: "box", x: 690, y: 120, w: 295, h: 220, color: "#16a34a", label: "Given\nA train set with a $20 note gives $3 change\nSo the train set costs 20 − 3 = $17.", labelSize: 17 },
            { type: "box", x: 1005, y: 120, w: 295, h: 220, color: "#16a34a", label: "Given\nA train set and a skipping rope cost $25\nSo the skipping rope costs 25 − 17 = $8.", labelSize: 17 },
          ],
        },
        {
          label: "3. 3 · Tap and explain",
          say: "Tap the highlighted part and explain what Solving equations is doing.",
          ops: [
            { type: "text", value: "3 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 295, h: 220, color: "#16a34a", label: "Given\nTwo spinning tops cost $16\nSo one spinning top costs 16 ÷ 2 = $8.", labelSize: 17 },
            { type: "box", x: 375, y: 120, w: 295, h: 220, color: "#16a34a", label: "Given\nA spinning top and a toy car cost $20\nSo the toy car costs 20 − 8 = $12.", labelSize: 17 },
            { type: "box", x: 690, y: 120, w: 295, h: 220, color: "#16a34a", label: "Given\nA train set with a $20 note gives $3 change\nSo the train set costs 20 − 3 = $17.", labelSize: 17 },
            { type: "box", x: 1005, y: 120, w: 295, h: 220, color: "#16a34a", label: "Given\nA train set and a skipping rope cost $25\nSo the skipping rope costs 25 − 17 = $8.", labelSize: 17 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Two spinning tops cost $16 together. What does one cost?\n2. A spinning top and a toy car cost $20 together. The spinning top is $8. What does the toy car cost?", labelSize: 18 },
            { type: "text", value: "1) $8: 16 ÷ 2 = 8, since both spinning tops cost the same.\n2) $12: 20 − 8 = 12, undoing the addition.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Solving equations. Find the unknown by undoing the operation that was used.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Solving equations.\n\nFind the unknown by undoing the operation that was used.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "3.3-q1", prompt: "A train set with a $20 note gives $3 change, so it costs $17. A train set and a skipping rope together cost $25. What does the skipping rope cost?", options: ["$8","$17","$5"], correctIndex: 0, explanation: "Correct. Undo the addition: 25 − 17 = 8, so the skipping rope costs $8." },
      ],
    },

    {
      topicId: "3.4",
      title: "✖️ Mental multiplication",
      scenes: [
        {
          label: "1. Mental multiplication",
          say: "Split a multiplication into helpful facts you already know.",
          ops: [
            { type: "text", value: "✖️ Mental multiplication", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Split a multiplication into helpful facts you already know.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 4 · Meet the idea",
          say: "Split a multiplication into helpful facts you already know.",
          ops: [
            { type: "text", value: "4 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 400, h: 220, color: "#16a34a", label: "Distributive\n19 × 5\nRegroup 19 as 20 − 1: 19 × 5 = (20 × 5) − 5 = 100 − 5 = 95.", labelSize: 17 },
            { type: "box", x: 480, y: 120, w: 400, h: 220, color: "#16a34a", label: "Commutative\n25 × 33 × 4\nReorder the factors: 25 × 33 × 4 = 25 × 4 × 33 = 100 × 33 = 3300.", labelSize: 17 },
            { type: "box", x: 900, y: 120, w: 400, h: 220, color: "#16a34a", label: "Associative\n46 × 2 × 5\nGroup 2 × 5 first: 46 × 2 × 5 = 46 × 10 = 460.", labelSize: 17 },
          ],
        },
        {
          label: "3. 4 · Tap and explain",
          say: "Tap the highlighted part and explain what Mental multiplication is doing.",
          ops: [
            { type: "text", value: "4 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 400, h: 220, color: "#16a34a", label: "Distributive\n19 × 5\nRegroup 19 as 20 − 1: 19 × 5 = (20 × 5) − 5 = 100 − 5 = 95.", labelSize: 17 },
            { type: "box", x: 480, y: 120, w: 400, h: 220, color: "#16a34a", label: "Commutative\n25 × 33 × 4\nReorder the factors: 25 × 33 × 4 = 25 × 4 × 33 = 100 × 33 = 3300.", labelSize: 17 },
            { type: "box", x: 900, y: 120, w: 400, h: 220, color: "#16a34a", label: "Associative\n46 × 2 × 5\nGroup 2 × 5 first: 46 × 2 × 5 = 46 × 10 = 460.", labelSize: 17 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Work out 19 × 5 by regrouping 19 as 20 − 1.\n2. Work out 46 × 2 × 5 by grouping the last two factors first.", labelSize: 18 },
            { type: "text", value: "1) 95: 19 × 5 = (20 × 5) − 5 = 100 − 5 = 95.\n2) 460: 2 × 5 = 10, so 46 × 2 × 5 = 46 × 10 = 460.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Mental multiplication. Split a multiplication into helpful facts you already know.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Mental multiplication.\n\nSplit a multiplication into helpful facts you already know.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "3.4-q1", prompt: "Use the commutative law to reorder the factors: what is 25 × 33 × 4?", options: ["3300","336","2533"], correctIndex: 0, explanation: "Yes. Reorder to 25 × 4 × 33 = 100 × 33 = 3300 - multiplying in a friendlier order gives the same product." },
      ],
    },

    {
      topicId: "3.5",
      title: "🧱 Partial products",
      scenes: [
        {
          label: "1. Partial products",
          say: "Partition numbers and add the partial products together.",
          ops: [
            { type: "text", value: "🧱 Partial products", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Partition numbers and add the partial products together.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Use the grid method to work out 34 × 13.\n2. Use the grid method to work out 27 × 12.", labelSize: 18 },
            { type: "text", value: "1) 442: 30×10=300, 4×10=40, 30×3=90, 4×3=12, and 300+40+90+12=442.\n2) 324: 20×10=200, 7×10=70, 20×2=40, 7×2=14, and 200+70+40+14=324.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Partial products. Partition numbers and add the partial products together.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Partial products.\n\nPartition numbers and add the partial products together.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "3.5-q1", prompt: "Use the grid method to work out 27 × 12.", options: ["324","270","290"], correctIndex: 0, explanation: "Correct. 20×10=200, 7×10=70, 20×2=40, 7×2=14, and 200+70+40+14=324." },
      ],
    },
  ],
};
