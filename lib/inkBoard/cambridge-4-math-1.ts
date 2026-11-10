import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 1 (Number)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-1.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_1_INK: InkUnit = {
  unitKey: "cambridge-4-math-1",
  title: "Number",
  badge: "Grade 4 · Unit 1",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "1.1",
      title: "🔟 Decimals and tenths",
      scenes: [
        {
          label: "1. Decimals and tenths",
          say: "When 1 whole unit is divided into 10 equal parts, each part is one tenth - written 0.1.",
          ops: [
            { type: "text", value: "🔟 Decimals and tenths", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "A 1-metre rod split into 10 identical pieces gives pieces of 0.1 metres each.\nThe number 2.6 represents 2 whole units and 6 additional tenths.\nYour book opens this unit with a long jumper and a tape measure marked 5, 6, 7, 8 - the tenths are the little marks in between. Page 6.", labelSize: 20 },
          ],
        },
        {
          label: "2. One whole",
          say: "Here is one whole unit, from 0 to 1. Nothing has been split up yet.",
          ops: [
            { type: "text", value: "One whole", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 1\n0 = 0\n1 = 1 whole", labelSize: 20 },
          ],
        },
        {
          label: "3. Split into 10",
          say: "Now split that one whole into 10 equal parts. Each single part is one tenth, and we write it as 0.1.",
          ops: [
            { type: "text", value: "Split into 10", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 1\n0.1 = 0.1 - one tenth", labelSize: 20 },
          ],
        },
        {
          label: "4. Reading 2.6",
          say: "The number 2.6 means 2 whole units and 6 more tenths. Find 2 first, then count on six tenths.",
          ops: [
            { type: "text", value: "Reading 2.6", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 2 to 3\n2 = 2 wholes\n2.6 = 2.6\njump: 2 -> 2.6 (6 tenths)", labelSize: 20 },
          ],
        },
        {
          label: "5. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. The book says the athlete jumped further than seven metres. Give a jump length that fits.\n2. Which two whole numbers is 7.5 positioned between on the book's tape measure?\n3. A 2-metre rope is split into 10 equal pieces. How long is each piece?\n4. How many tenths are in 1.3?", labelSize: 18 },
            { type: "text", value: "1) Anything past 7, such as 7.3 or 7.5 metres. (page 6)\n2) 7 and 8 - it sits exactly halfway. (page 6)\n3) 0.2 metres. Each tenth of 2 metres is 0.2.\n4) 13 tenths.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "6. 💡 Remember this",
          say: "What is one tenth, and how do you write it? One whole split into 10 equal parts. Each part is one tenth, written 0.1.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is one tenth, and how do you write it?\n\nOne whole split into 10 equal parts. Each part is one tenth, written 0.1.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "1.1-q1", prompt: "What does the 6 mean in 2.6?", options: ["6 tenths","6 wholes","6 hundredths"], correctIndex: 0, explanation: "Yes. The 6 is in the tenths place, so 2.6 is 2 wholes and 6 tenths." },
        { id: "1.1-q2", prompt: "One whole is split into 10 equal parts. What is each single part worth?", options: ["0.1","0.01","1.0","10"], correctIndex: 0, explanation: "Yes - one tenth, written 0.1. Ten of those make one whole again." },
        { id: "1.1-q3", prompt: "Where does 2.6 sit?", options: ["Between 2 and 3","Between 6 and 7","Between 25 and 27"], correctIndex: 0, explanation: "Correct - 2 whole units and 6 tenths more, so it sits six tenths of the way from 2 to 3." },
        { id: "1.1-q4", prompt: "How many tenths make one whole?", options: ["10","100","5"], correctIndex: 0, explanation: "Yes - ten tenths rebuild one whole." },
      ],
    },

    {
      topicId: "1.2",
      title: "🧩 Decomposing and regrouping",
      scenes: [
        {
          label: "1. Decomposing and regrouping",
          say: "Decomposing breaks a number into the exact place value of each digit; regrouping rearranges those values flexibly without changing the total.",
          ops: [
            { type: "text", value: "🧩 Decomposing and regrouping", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Decomposing 45.8 gives 40 plus 5 plus 0.8.\nRegrouping 3.4 could be shown as 2 wholes and 14 tenths, which still totals 3.4.\nYour book regroups 42.4 three ways on one line: 42 ones and 4 tenths, 42 + 0.4, and 4 tens and 24 tenths. Page 9.", labelSize: 20 },
          ],
        },
        {
          label: "2. Decompose 45.8",
          say: "Decomposing means splitting a number into the value each digit is really worth. 45.8 is 40, plus 5, plus 0.8.",
          ops: [
            { type: "text", value: "Decompose 45.8", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 40 to 50\n45.8 = 45.8", labelSize: 20 },
          ],
        },
        {
          label: "3. Regroup 3.4",
          say: "Regrouping shuffles those parts around without changing the total. 3.4 is 3 wholes and 4 tenths - but it is also 2 wholes and 14 tenths. Same number, written differently.",
          ops: [
            { type: "text", value: "Regroup 3.4", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 4\n3.4 = 3.4", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. The book asks which number decomposes as 40 000 + 5 000 + 0 + 40 + 3. What is it?\n2. '4 tens and 24 tenths' - what number is that, and why does it still work?\n3. Decompose 38.6 into place values.\n4. Which is bigger: 2 wholes and 13 tenths, or 3.2?", labelSize: 18 },
            { type: "text", value: "1) 45 043. (page 9)\n2) 42.4. The 24 tenths are 2 wholes and 4 tenths, so 40 + 2 + 0.4. Regrouping moves value about without changing the total. (page 9)\n3) 30 + 8 + 0.6\n4) 2 wholes and 13 tenths. 13 tenths is 1.3, so the number is 3.3 - bigger than 3.2.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "What does decomposing a number mean? Breaking it into the exact value each digit is worth - 45.8 becomes 40 plus 5 plus 0.8.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What does decomposing a number mean?\n\nBreaking it into the exact value each digit is worth - 45.8 becomes 40 plus 5 plus 0.8.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "1.2-q1", prompt: "Which one shows 45.8 decomposed correctly?", options: ["40 + 5 + 0.8","4 + 5 + 8","45 + 8"], correctIndex: 0, explanation: "Exactly - each digit written as what it is really worth." },
        { id: "1.2-q2", prompt: "3.4 is 3 wholes and 4 tenths. Which of these is the same number regrouped?", options: ["2 wholes and 14 tenths","2 wholes and 4 tenths","34 tenths"], correctIndex: 0, explanation: "Yes. One whole was traded for ten tenths, so the total has not changed at all." },
        { id: "1.2-q3", prompt: "Decompose 62.4.", options: ["60 + 2 + 0.4","6 + 2 + 4","62 + 4"], correctIndex: 0, explanation: "Right - tens, ones and tenths." },
      ],
    },

    {
      topicId: "1.3",
      title: "🔁 Multiplying and dividing by powers of ten",
      scenes: [
        {
          label: "1. Multiplying and dividing by powers of ten",
          say: "Multiplying or dividing by 10, 100 or 1000 shifts every digit the same number of place-value columns.",
          ops: [
            { type: "text", value: "🔁 Multiplying and dividing by powers of ten", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Multiplying by a power of ten makes a number larger: ×10 shifts one place left, ×100 two places, and ×1000 three places.\nDividing by a power of ten makes a number smaller: ÷10 shifts one place right, ÷100 two places, and ÷1000 three places.\nThe digits keep their order; only their place values change. For example, 36 × 100 = 3600 and 5380 ÷ 10 = 538.", labelSize: 20 },
          ],
        },
        {
          label: "2. Shift by powers of ten",
          say: "Multiplying by 100 shifts every digit two places to the left, so 36 becomes 3600. Dividing shifts digits to the right, so 5380 divided by 10 becomes 538.",
          ops: [
            { type: "text", value: "Shift by powers of ten", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 4000\n36 = 36\n3600 = 3600\njump: 36 -> 3600 (×100)", labelSize: 20 },
          ],
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What is 36 × 100?\n2. What is 5380 ÷ 10?\n3. Which way does a digit shift when dividing by 100?", labelSize: 18 },
            { type: "text", value: "1) 3600. Each digit shifts two places to the left.\n2) 538. Each digit shifts one place to the right.\n3) Two places to the right, because the number becomes 100 times smaller.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "How do digits shift when multiplying or dividing by 10, 100 or 1000? Multiplying shifts digits left; dividing shifts them right. The number of places matches the number of zeros.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "How do digits shift when multiplying or dividing by 10, 100 or 1000?\n\nMultiplying shifts digits left; dividing shifts them right. The number of places matches the number of zeros.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "1.3-q1", prompt: "What is 36 × 100?", options: ["3600","360","3.6"], correctIndex: 0, explanation: "Yes. Multiplying by 100 shifts every digit two places to the left: 36 becomes 3600." },
        { id: "1.3-q2", prompt: "What is 5380 divided by 10?", options: ["538","53800","53.8"], correctIndex: 0, explanation: "Yes - every digit shifts one place to the right." },
      ],
    },

    {
      topicId: "1.4",
      title: "🌡️ Negative numbers",
      scenes: [
        {
          label: "1. Negative numbers",
          say: "Negative numbers sit to the left of 0 on a horizontal number line, and counting in equal steps carries straight through zero.",
          ops: [
            { type: "text", value: "🌡️ Negative numbers", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Counting back in steps of 5 from 6 gives 1, then -4, then -9.\nA temperature starting at -2 degrees that rises by 5 degrees crosses 0 and reaches 3 degrees.\nYour book's thermometer runs from 50 right down past 0 to -20, which is why temperature is the easiest place to meet negative numbers. Page 14.", labelSize: 20 },
          ],
        },
        {
          label: "2. Below zero",
          say: "Negative numbers live to the left of zero. Counting back in steps of 5 from 6 gives 1, then minus 4, then minus 9 - the steps never change size just because we passed zero.",
          ops: [
            { type: "text", value: "Below zero", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: -10 to 8\n6 = start 6\n1 = 1\n-4 = -4\n-9 = -9\njump: 6 -> 1 (-5)\njump: 1 -> -4 (-5)\njump: -4 -> -9 (-5)", labelSize: 20 },
          ],
        },
        {
          label: "3. Rising past 0",
          say: "It works upward too. A temperature of minus 2 degrees that rises by 5 crosses zero and lands on 3.",
          ops: [
            { type: "text", value: "Rising past 0", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: -6 to 6\n-2 = -2°\n3 = 3°\njump: -2 -> 3 (+5)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. The book asks: could Banko have been counting back in steps of 5 degrees from 15 C? Write his count.\n2. Count back in steps of 3 from 4. Write the first five numbers.\n3. The temperature is -7 and rises by 4. What is it now?\n4. Which is colder, -9 or -2?", labelSize: 18 },
            { type: "text", value: "1) 15, 10, 5, 0, -5, -10, -15. Yes - equal steps carry straight on through zero. (page 14)\n2) 4, 1, -2, -5, -8.\n3) -3 degrees.\n4) -9, because it is further to the left of zero.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Where do negative numbers sit, and what happens to the step size at zero? To the left of 0 on the line. The step size does not change at all - counting carries straight through zero.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Where do negative numbers sit, and what happens to the step size at zero?\n\nTo the left of 0 on the line. The step size does not change at all - counting carries straight through zero.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "1.4-q1", prompt: "Counting back in steps of 5 from 6: what comes after 1?", options: ["-4","0","4"], correctIndex: 0, explanation: "Right. Taking 5 from 1 carries straight through zero to minus 4 - the step does not shrink at the bottom." },
        { id: "1.4-q2", prompt: "What is 3 - 8?", options: ["-5","5","0"], correctIndex: 0, explanation: "Correct. Three steps reach zero, and the remaining five carry on below it." },
        { id: "1.4-q3", prompt: "The temperature is -4 degrees. It rises 7, then falls 5. What is it now?", options: ["-2","2","-6"], correctIndex: 0, explanation: "Exactly. Up 7 from -4 reaches 3, then down 5 lands on -2." },
      ],
    },

    {
      topicId: "1.5",
      title: "📚 Linear sequences",
      scenes: [
        {
          label: "1. Linear sequences",
          say: "A linear sequence steps by the same amount every time, and that step is called the difference.",
          ops: [
            { type: "text", value: "📚 Linear sequences", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Each number in a sequence is a term. The gap between one term and the next is the difference.\nIn 3, 11, 19, 27 the difference is always 8, so the rule is add 8.\nWorking out the next term from the one before it is called a recursion rule.", labelSize: 20 },
          ],
        },
        {
          label: "2. Sequences",
          say: "A linear sequence steps by the same amount every time. In 3, 11, 19, 27 the difference is always 8, so the rule is add 8.",
          ops: [
            { type: "text", value: "Sequences", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 32\n3 = 3\n11 = 11\n19 = 19\n27 = 27\njump: 3 -> 11 (+8)\njump: 11 -> 19 (+8)\njump: 19 -> 27 (+8)", labelSize: 20 },
          ],
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. The book asks how many books are in the first six piles without counting them all. How would you do it?\n2. What is the difference in 5, 12, 19, 26?\n3. A sequence starts at 40 and the rule is subtract 6. Write the first five terms.", labelSize: 18 },
            { type: "text", value: "1) Find the difference between one pile and the next, then keep adding it. That is quicker and less error-prone than counting. (page 17)\n2) 7 - and the rule is add 7.\n3) 40, 34, 28, 22, 16.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "How do you find the term-to-term rule of a sequence? Find the difference between two numbers next to each other. If it is the same every time, that difference is the rule.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "How do you find the term-to-term rule of a sequence?\n\nFind the difference between two numbers next to each other. If it is the same every time, that difference is the rule.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "1.5-q1", prompt: "In the sequence 3, 11, 19, 27, what is the term-to-term rule?", options: ["Add 8","Add 7","Multiply by 3"], correctIndex: 0, explanation: "Correct - every gap is 8, so the rule is add 8 each time." },
        { id: "1.5-q2", prompt: "Between 8 and 14 there is one missing number, with equal steps. What is it?", options: ["11","12","6"], correctIndex: 0, explanation: "Well worked out - the gap is 6, shared into two equal steps of 3." },
      ],
    },
  ],
};
