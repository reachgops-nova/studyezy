import type { BoardUnit } from "./types";

/**
 * Unit 1 - Number.
 *
 * The first unit built on the number-line stage rather than the coordinate
 * grid. Its concepts are decimals, decomposing and regrouping, scaling by
 * powers of ten, negative numbers and linear sequences - a coordinate grid
 * says nothing about any of them.
 *
 * Every definition and worked example below is this unit's own production
 * content, pulled from the concept rows rather than invented, so the board
 * and the existing lesson teach the same words.
 */
export const CAMBRIDGE_4_MATH_1: BoardUnit = {
  unitKey: "cambridge-4-math-1",
  title: "Number",
  badge: "Grade 4 · Unit 1",
  gridMax: 10,
  stage: "numberLine",

  intro: {
    covers: [
      "Tenths: what happens when one whole is split into 10 equal parts",
      "Decomposing a number into its place values, and regrouping it flexibly",
      "Multiplying and dividing by 10, 100 and 1000",
      "Negative numbers, and counting in steps straight through zero",
      "Linear sequences and the term-to-term rule",
    ],
    outcomes: [
      "Read and place a decimal like 2.6 on a number line",
      "Break 45.8 into 40 + 5 + 0.8, and regroup 3.4 as 2 wholes and 14 tenths",
      "Shift digits confidently when multiplying or dividing by 10, 100 or 1000",
      "Count back past zero without losing your place",
      "Find the step size in a sequence and use it to fill a missing term",
    ],
  },

  concepts: [
    {
      conceptId: "1.1",
      title: "Decimals and tenths",
      icon: "🔟",
      summary:
        "When 1 whole unit is divided into 10 equal parts, each part is one tenth - written 0.1.",
      keyPoints: [
        "A 1-metre rod split into 10 identical pieces gives pieces of 0.1 metres each.",
        "The number 2.6 represents 2 whole units and 6 additional tenths.",
      ],
      examples: [
        { question: "A 2-metre rope is split into 10 equal pieces. How long is each piece?", answer: "0.2 metres. Each tenth of 2 metres is 0.2." },
        { question: "Write the number that is 4 wholes and 7 tenths.", answer: "4.7" },
        { question: "How many tenths are in 1.3?", answer: "13 tenths." },
      ],
    },
    {
      conceptId: "1.2",
      title: "Decomposing and regrouping",
      icon: "🧩",
      summary:
        "Decomposing breaks a number into the exact place value of each digit; regrouping rearranges those values flexibly without changing the total.",
      keyPoints: [
        "Decomposing 45.8 gives 40 plus 5 plus 0.8.",
        "Regrouping 3.4 could be shown as 2 wholes and 14 tenths, which still totals 3.4.",
      ],
      examples: [
        { question: "Decompose 38.6 into place values.", answer: "30 + 8 + 0.6" },
        { question: "Regroup 6.1 so it has only 5 wholes.", answer: "5 wholes and 11 tenths." },
        { question: "Which is bigger: 2 wholes and 13 tenths, or 3.2?", answer: "They are equal - 2 + 1.3 makes 3.3, which is bigger than 3.2. So 2 wholes and 13 tenths is bigger." },
      ],
    },
    {
      conceptId: "1.4",
      title: "Negative numbers",
      icon: "🌡️",
      summary:
        "Negative numbers sit to the left of 0 on a horizontal number line, and counting in equal steps carries straight through zero.",
      keyPoints: [
        "Counting back in steps of 5 from 6 gives 1, then -4, then -9.",
        "A temperature starting at -2 degrees that rises by 5 degrees crosses 0 and reaches 3 degrees.",
      ],
      examples: [
        { question: "Count back in steps of 3 from 4. Write the first five numbers.", answer: "4, 1, -2, -5, -8." },
        { question: "The temperature is -7 and rises by 4. What is it now?", answer: "-3 degrees." },
        { question: "Which is colder, -9 or -2?", answer: "-9, because it is further to the left of zero." },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1.1 Poster · tenths",
      conceptId: "1.1",
      say: "Look at the chocolate bar. One whole bar cut into ten equal pieces - each single piece is one tenth, and we write it 0.1.",
      frame: {
        image: {
          src: "/board-art/math1-number-poster.jpg",
          alt: "Four panels: tenths as a chocolate bar, decomposing 45.8, regrouping 3.4, and counting below zero.",
          title: "Mastering numbers: decimals and below zero",
          focus: { x: 1, y: 26, w: 25, h: 70 },
          hotspots: [
            { label: "Tenths", at: [13, 20], note: "One piece of a ten-part chocolate bar is one tenth, written 0.1.", tone: "gold" },
            { label: "Decompose", at: [38, 20], note: "Break the number into what each digit is really worth: 40, 5 and 0.8.", tone: "blue" },
            { label: "Regroup", at: [62, 20], note: "3 wholes and 4 tenths is the same amount as 2 wholes and 14 tenths.", tone: "green" },
            { label: "Below zero", at: [86, 20], note: "Count backwards in fives from 6, straight through zero, down to minus 9.", tone: "red" },
          ],
        },
      },
    },
    {
      label: "1.2 Poster · decompose",
      conceptId: "1.2",
      say: "Decomposing means breaking a number into what each digit is really worth. 45.8 comes apart into 40, then 5, then 0.8.",
      frame: {
        image: {
          src: "/board-art/math1-number-poster.jpg",
          alt: "Four panels: tenths as a chocolate bar, decomposing 45.8, regrouping 3.4, and counting below zero.",
          title: "Mastering numbers: decimals and below zero",
          focus: { x: 25, y: 26, w: 25, h: 70 },
          hotspots: [
            { label: "Tenths", at: [13, 20], note: "One piece of a ten-part chocolate bar is one tenth, written 0.1.", tone: "gold" },
            { label: "Decompose", at: [38, 20], note: "Break the number into what each digit is really worth: 40, 5 and 0.8.", tone: "blue" },
            { label: "Regroup", at: [62, 20], note: "3 wholes and 4 tenths is the same amount as 2 wholes and 14 tenths.", tone: "green" },
            { label: "Below zero", at: [86, 20], note: "Count backwards in fives from 6, straight through zero, down to minus 9.", tone: "red" },
          ],
        },
      },
    },
    {
      label: "1.2 Poster · regroup",
      conceptId: "1.2",
      say: "Regrouping shuffles those parts without changing the total. Three wholes and four tenths is the very same amount as two wholes and fourteen tenths.",
      frame: {
        image: {
          src: "/board-art/math1-number-poster.jpg",
          alt: "Four panels: tenths as a chocolate bar, decomposing 45.8, regrouping 3.4, and counting below zero.",
          title: "Mastering numbers: decimals and below zero",
          focus: { x: 49, y: 26, w: 26, h: 70 },
          hotspots: [
            { label: "Tenths", at: [13, 20], note: "One piece of a ten-part chocolate bar is one tenth, written 0.1.", tone: "gold" },
            { label: "Decompose", at: [38, 20], note: "Break the number into what each digit is really worth: 40, 5 and 0.8.", tone: "blue" },
            { label: "Regroup", at: [62, 20], note: "3 wholes and 4 tenths is the same amount as 2 wholes and 14 tenths.", tone: "green" },
            { label: "Below zero", at: [86, 20], note: "Count backwards in fives from 6, straight through zero, down to minus 9.", tone: "red" },
          ],
        },
      },
    },
    {
      label: "1.4 Poster · below zero",
      conceptId: "1.4",
      say: "And here is counting below zero. Watch the hops of five going backwards from 6, straight through zero, all the way down to minus 9.",
      frame: {
        image: {
          src: "/board-art/math1-number-poster.jpg",
          alt: "Four panels: tenths as a chocolate bar, decomposing 45.8, regrouping 3.4, and counting below zero.",
          title: "Mastering numbers: decimals and below zero",
          focus: { x: 73, y: 26, w: 26, h: 70 },
          hotspots: [
            { label: "Tenths", at: [13, 20], note: "One piece of a ten-part chocolate bar is one tenth, written 0.1.", tone: "gold" },
            { label: "Decompose", at: [38, 20], note: "Break the number into what each digit is really worth: 40, 5 and 0.8.", tone: "blue" },
            { label: "Regroup", at: [62, 20], note: "3 wholes and 4 tenths is the same amount as 2 wholes and 14 tenths.", tone: "green" },
            { label: "Below zero", at: [86, 20], note: "Count backwards in fives from 6, straight through zero, down to minus 9.", tone: "red" },
          ],
        },
      },
    },
    {
      label: "1. One whole",
      conceptId: "1.1",
      say: "Here is one whole unit, from 0 to 1. Nothing has been split up yet.",
      frame: { line: { min: 0, max: 1, step: 1, marks: [{ at: 0, label: "0", tone: "blue" }, { at: 1, label: "1 whole", tone: "gold" }] } },
    },
    {
      label: "2. Split into 10",
      conceptId: "1.1",
      say: "Now split that one whole into 10 equal parts. Each single part is one tenth, and we write it as 0.1.",
      frame: { line: { min: 0, max: 1, step: 0.1, marks: [{ at: 0.1, label: "0.1 - one tenth", tone: "green" }] } },
    },
    {
      label: "3. Reading 2.6",
      conceptId: "1.1",
      say: "The number 2.6 means 2 whole units and 6 more tenths. Find 2 first, then count on six tenths.",
      frame: {
        line: {
          min: 2, max: 3, step: 0.1,
          marks: [{ at: 2, label: "2 wholes", tone: "gold" }, { at: 2.6, label: "2.6", tone: "green" }],
          jumps: [{ from: 2, to: 2.6, label: "6 tenths" }],
        },
      },
    },
    {
      label: "4. Decompose 45.8",
      conceptId: "1.2",
      say: "Decomposing means splitting a number into the value each digit is really worth. 45.8 is 40, plus 5, plus 0.8.",
      frame: {
        line: {
          min: 40, max: 50, step: 1,
          marks: [{ at: 45.8, label: "45.8", tone: "green" }],
          parts: [
            { label: "tens", value: "40", tone: "gold" },
            { label: "ones", value: "5", tone: "blue" },
            { label: "tenths", value: "0.8", tone: "green" },
          ],
        },
      },
    },
    {
      label: "5. Regroup 3.4",
      conceptId: "1.2",
      say: "Regrouping shuffles those parts around without changing the total. 3.4 is 3 wholes and 4 tenths - but it is also 2 wholes and 14 tenths. Same number, written differently.",
      frame: {
        line: {
          min: 0, max: 4, step: 1,
          marks: [{ at: 3.4, label: "3.4", tone: "green" }],
          parts: [
            { label: "the usual way", value: "3 + 0.4", tone: "blue" },
            { label: "regrouped", value: "2 + 1.4", tone: "gold" },
          ],
        },
      },
    },
    {
      label: "6. Below zero",
      conceptId: "1.4",
      say: "Negative numbers live to the left of zero. Counting back in steps of 5 from 6 gives 1, then minus 4, then minus 9 - the steps never change size just because we passed zero.",
      frame: {
        line: {
          min: -10, max: 8, step: 2,
          marks: [
            { at: 6, label: "start 6", tone: "gold" },
            { at: 1, label: "1", tone: "blue" },
            { at: -4, label: "-4", tone: "blue" },
            { at: -9, label: "-9", tone: "green" },
          ],
          jumps: [{ from: 6, to: 1, label: "-5" }, { from: 1, to: -4, label: "-5" }, { from: -4, to: -9, label: "-5" }],
        },
      },
    },
    {
      label: "7. Rising past 0",
      conceptId: "1.4",
      say: "It works upward too. A temperature of minus 2 degrees that rises by 5 crosses zero and lands on 3.",
      frame: {
        line: {
          min: -6, max: 6, step: 1,
          marks: [{ at: -2, label: "-2°", tone: "gold" }, { at: 3, label: "3°", tone: "green" }],
          jumps: [{ from: -2, to: 3, label: "+5" }],
        },
      },
    },
    {
      label: "8. Sequences",
      conceptId: "1.5",
      say: "A linear sequence steps by the same amount every time. In 3, 11, 19, 27 the difference is always 8, so the rule is add 8.",
      frame: {
        line: {
          min: 0, max: 32, step: 4,
          marks: [
            { at: 3, label: "3", tone: "gold" }, { at: 11, label: "11", tone: "gold" },
            { at: 19, label: "19", tone: "gold" }, { at: 27, label: "27", tone: "green" },
          ],
          jumps: [{ from: 3, to: 11, label: "+8" }, { from: 11, to: 19, label: "+8" }, { from: 19, to: 27, label: "+8" }],
        },
      },
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · Read the decimal",
      setup: { line: { min: 0, max: 1, step: 0.1 } },
      drag: { from: [0], to: [0.1], hint: "drag to one tenth" },
      prompt: "One whole is split into 10 equal parts. What is each single part worth?",
      conceptId: "1.1",
      options: [
        { label: "0.1", correct: true, say: "Yes - one tenth, written 0.1. Ten of those make one whole again.",
          frame: { line: { min: 0, max: 1, step: 0.1, marks: [{ at: 0.1, label: "0.1 ✓", tone: "green" }] } } },
        { label: "0.01", correct: false, say: "That is one hundredth - it would take a hundred of those to make a whole, not ten.",
          frame: { line: { min: 0, max: 1, step: 0.1, marks: [{ at: 0.01, label: "0.01 ✗ - far too small", tone: "red" }] } } },
        { label: "1.0", correct: false, say: "That is the whole thing, not one of the parts.",
          frame: { line: { min: 0, max: 1, step: 0.1, marks: [{ at: 1, label: "1.0 ✗ - the whole", tone: "red" }] } } },
        { label: "10", correct: false, say: "Splitting something makes the parts smaller, not bigger.",
          frame: { line: { min: 0, max: 1, step: 0.1, marks: [{ at: 1, label: "✗", tone: "red" }] } } },
      ],
    },
    {
      title: "Task 2 · Place 2.6",
      setup: { line: { min: 2, max: 3, step: 0.1 } },
      drag: { from: [2], to: [2.6], hint: "drag to 2.6" },
      prompt: "Where does 2.6 sit?",
      conceptId: "1.1",
      options: [
        { label: "Between 2 and 3", correct: true, say: "Correct - 2 whole units and 6 tenths more, so it sits six tenths of the way from 2 to 3.",
          frame: { line: { min: 2, max: 3, step: 0.1, marks: [{ at: 2.6, label: "2.6 ✓", tone: "green" }], jumps: [{ from: 2, to: 2.6, label: "6 tenths" }] } } },
        { label: "Between 6 and 7", correct: false, say: "The 6 is the tenths digit, not the whole part. The whole part is 2.",
          frame: { line: { min: 0, max: 8, step: 1, marks: [{ at: 6.2, label: "✗ - digits swapped", tone: "red" }, { at: 2.6, label: "2.6 belongs here", tone: "gold" }] } } },
        { label: "Between 25 and 27", correct: false, say: "A decimal point is not a gap between two whole numbers - 2.6 is a little more than 2.",
          frame: { line: { min: 0, max: 8, step: 1, marks: [{ at: 2.6, label: "2.6 is here", tone: "gold" }] } } },
      ],
    },
    {
      title: "Task 3 · Decompose it",
      prompt: "Which one shows 45.8 decomposed correctly?",
      conceptId: "1.2",
      options: [
        { label: "40 + 5 + 0.8", correct: true, say: "Exactly - each digit written as what it is really worth.",
          frame: { line: { min: 40, max: 50, step: 1, marks: [{ at: 45.8, label: "45.8 ✓", tone: "green" }], parts: [{ label: "tens", value: "40", tone: "gold" }, { label: "ones", value: "5", tone: "blue" }, { label: "tenths", value: "0.8", tone: "green" }] } } },
        { label: "4 + 5 + 8", correct: false, say: "Those are the digits, not their values. The 4 is really worth 40 and the 8 is really worth 0.8.",
          frame: { line: { min: 0, max: 50, step: 10, marks: [{ at: 17, label: "4+5+8 = 17 ✗", tone: "red" }, { at: 45.8, label: "should be 45.8", tone: "gold" }] } } },
        { label: "45 + 8", correct: false, say: "Close, but the 8 is in the tenths column, so it is worth 0.8 and not 8.",
          frame: { line: { min: 40, max: 55, step: 5, marks: [{ at: 53, label: "45+8 = 53 ✗", tone: "red" }, { at: 45.8, label: "45.8", tone: "gold" }] } } },
      ],
    },
    {
      title: "Task 4 · Regroup it",
      prompt: "3.4 is 3 wholes and 4 tenths. Which of these is the same number regrouped?",
      conceptId: "1.2",
      options: [
        { label: "2 wholes and 14 tenths", correct: true, say: "Yes. One whole was traded for ten tenths, so the total has not changed at all.",
          frame: { line: { min: 0, max: 4, step: 1, marks: [{ at: 3.4, label: "3.4 either way ✓", tone: "green" }], parts: [{ label: "the usual way", value: "3 + 0.4", tone: "blue" }, { label: "regrouped", value: "2 + 1.4", tone: "gold" }] } } },
        { label: "2 wholes and 4 tenths", correct: false, say: "That has lost a whole along the way - it makes 2.4, not 3.4.",
          frame: { line: { min: 0, max: 4, step: 1, marks: [{ at: 2.4, label: "2.4 ✗", tone: "red" }, { at: 3.4, label: "3.4", tone: "gold" }] } } },
        { label: "34 tenths", correct: true, say: "Also right - 34 tenths really is 3.4. Regrouping can go all the way down to a single column.",
          frame: { line: { min: 0, max: 4, step: 1, marks: [{ at: 3.4, label: "34 tenths = 3.4 ✓", tone: "green" }] } } },
      ],
    },
    {
      title: "Task 5 · Count back past zero",
      setup: { line: { min: -10, max: 8, step: 2, marks: [{ at: 1, label: "you are here", tone: "gold" }] } },
      drag: { from: [1], to: [-4], hint: "drag back 5" },
      prompt: "Counting back in steps of 5 from 6: what comes after 1?",
      conceptId: "1.4",
      options: [
        { label: "-4", correct: true, say: "Right. Taking 5 from 1 carries straight through zero to minus 4 - the step does not shrink at the bottom.",
          frame: { line: { min: -10, max: 8, step: 2, marks: [{ at: 1, label: "1", tone: "gold" }, { at: -4, label: "-4 ✓", tone: "green" }], jumps: [{ from: 1, to: -4, label: "-5" }] } } },
        { label: "0", correct: false, say: "Zero is only 1 step below - we still owe 4 more of the jump.",
          frame: { line: { min: -10, max: 8, step: 2, marks: [{ at: 1, label: "1", tone: "gold" }, { at: 0, label: "0 ✗ - stopped early", tone: "red" }, { at: -4, label: "-4", tone: "green" }] } } },
        { label: "4", correct: false, say: "That went up instead of back. Counting back makes the number smaller.",
          frame: { line: { min: -10, max: 8, step: 2, marks: [{ at: 4, label: "4 ✗ - wrong way", tone: "red" }] } } },
      ],
    },
    {
      title: "Task 6 · Find the rule",
      prompt: "In the sequence 3, 11, 19, 27, what is the term-to-term rule?",
      conceptId: "1.5",
      options: [
        { label: "Add 8", correct: true, say: "Correct - every gap is 8, so the rule is add 8 each time.",
          frame: { line: { min: 0, max: 32, step: 4, marks: [{ at: 3 }, { at: 11 }, { at: 19 }, { at: 27, label: "+8 each time ✓", tone: "green" }], jumps: [{ from: 3, to: 11, label: "+8" }, { from: 11, to: 19, label: "+8" }, { from: 19, to: 27, label: "+8" }] } } },
        { label: "Add 7", correct: false, say: "Check the first gap - from 3 to 11 is 8, not 7.",
          frame: { line: { min: 0, max: 32, step: 4, marks: [{ at: 3, label: "3", tone: "gold" }, { at: 10, label: "+7 lands on 10 ✗", tone: "red" }, { at: 11, label: "should be 11", tone: "green" }] } } },
        { label: "Multiply by 3", correct: false, say: "3 times 3 would be 9, not 11. The steps are equal in size, which means it is an adding rule.",
          frame: { line: { min: 0, max: 32, step: 4, marks: [{ at: 9, label: "×3 gives 9 ✗", tone: "red" }, { at: 11, label: "11", tone: "green" }] } } },
      ],
    },
  ],

  lab: { prompt: "Slide the two numbers and watch the jump between them.", start: [2, 2], shape: [[0, 0], [2, 0], [2, 2], [0, 2]], range: { min: -3, max: 5 } },

  recitePrompts: [
    { ask: "What is one tenth, and how do you write it?", answer: "One whole split into 10 equal parts. Each part is one tenth, written 0.1." },
    { ask: "What does decomposing a number mean?", answer: "Breaking it into the exact value each digit is worth - 45.8 becomes 40 plus 5 plus 0.8." },
    { ask: "What does regrouping do that decomposing does not?", answer: "It rearranges the parts flexibly - 3.4 can be 3 wholes and 4 tenths, or 2 wholes and 14 tenths. The total never changes." },
    { ask: "Where do negative numbers sit, and what happens to the step size at zero?", answer: "To the left of 0 on the line. The step size does not change at all - counting carries straight through zero." },
    { ask: "How do you find the term-to-term rule of a sequence?", answer: "Find the difference between two numbers next to each other. If it is the same every time, that difference is the rule." },
  ],

  writtenPractice: [
    { question: "Write 7.3 as a decomposition into place values.", answer: "7 + 0.3." },
    { question: "Regroup 5.2 so it has only 4 wholes. How many tenths are there?", answer: "4 wholes and 12 tenths. One whole was traded for ten tenths." },
    { question: "Count back in steps of 4 from 5. Write the first five numbers.", answer: "5, 1, -3, -7, -11." },
    { question: "A temperature is -6 degrees and rises by 9 degrees. What is it now?", answer: "3 degrees. It crosses zero after 6 of the 9 degrees." },
    { question: "Fill the gap: 4, 10, __, 22, 28. What is the rule?", answer: "16. The rule is add 6." },
    { question: "Multiply 36 by 100, then divide the answer by 10. Write both results.", answer: "3600, then 360." },
    { question: "Between 8 and 14 there is one missing number, with equal steps. What is it?", answer: "11. The difference is 6, shared into 2 equal steps of 3." },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · Tenths",
        prompt: "How many tenths make one whole?",
        conceptId: "1.1",
        options: [
          { label: "10", correct: true, say: "Yes - ten tenths rebuild one whole.", frame: { line: { min: 0, max: 1, step: 0.1, marks: [{ at: 1, label: "10 tenths = 1 ✓", tone: "green" }] } } },
          { label: "100", correct: false, say: "That is how many hundredths make a whole.", frame: { line: { min: 0, max: 1, step: 0.1, marks: [{ at: 1, label: "✗", tone: "red" }] } } },
          { label: "5", correct: false, say: "Five tenths is only half a whole.", frame: { line: { min: 0, max: 1, step: 0.1, marks: [{ at: 0.5, label: "5 tenths = half ✗", tone: "red" }] } } },
        ],
      },
      {
        title: "Q2 · Decompose",
        prompt: "Decompose 62.4.",
        conceptId: "1.2",
        options: [
          { label: "60 + 2 + 0.4", correct: true, say: "Right - tens, ones and tenths.", frame: { line: { min: 60, max: 70, step: 1, marks: [{ at: 62.4, label: "62.4 ✓", tone: "green" }], parts: [{ label: "tens", value: "60", tone: "gold" }, { label: "ones", value: "2", tone: "blue" }, { label: "tenths", value: "0.4", tone: "green" }] } } },
          { label: "6 + 2 + 4", correct: false, say: "Those are the digits, not their values.", frame: { line: { min: 0, max: 70, step: 10, marks: [{ at: 12, label: "= 12 ✗", tone: "red" }] } } },
          { label: "62 + 4", correct: false, say: "The 4 is in the tenths column, so it is 0.4.", frame: { line: { min: 60, max: 70, step: 2, marks: [{ at: 66, label: "= 66 ✗", tone: "red" }] } } },
        ],
      },
      {
        title: "Q3 · Below zero",
        setup: { line: { min: -8, max: 6, step: 2, marks: [{ at: 3, label: "3", tone: "gold" }] } },
        drag: { from: [3], to: [-5], hint: "drag to the answer" },
        prompt: "What is 3 - 8?",
        conceptId: "1.4",
        options: [
          { label: "-5", correct: true, say: "Correct. Three steps reach zero, and the remaining five carry on below it.", frame: { line: { min: -8, max: 6, step: 2, marks: [{ at: 3, label: "3", tone: "gold" }, { at: -5, label: "-5 ✓", tone: "green" }], jumps: [{ from: 3, to: -5, label: "-8" }] } } },
          { label: "5", correct: false, say: "The sign matters - we went below zero, so the answer is negative.", frame: { line: { min: -8, max: 6, step: 2, marks: [{ at: 5, label: "5 ✗", tone: "red" }, { at: -5, label: "-5", tone: "green" }] } } },
          { label: "0", correct: false, say: "Zero is only 3 steps down. There were 8.", frame: { line: { min: -8, max: 6, step: 2, marks: [{ at: 0, label: "0 ✗ - stopped early", tone: "red" }] } } },
        ],
      },
      {
        title: "Q4 · Scaling",
        prompt: "What is 5380 divided by 10?",
        conceptId: "1.3",
        options: [
          { label: "538", correct: true, say: "Yes - every digit shifts one place to the right.", frame: { line: { min: 0, max: 6000, step: 1000, marks: [{ at: 538, label: "538 ✓", tone: "green" }, { at: 5380, label: "5380", tone: "gold" }] } } },
          { label: "53800", correct: false, say: "That multiplied instead of dividing - dividing makes it smaller.", frame: { line: { min: 0, max: 6000, step: 1000, marks: [{ at: 5380, label: "went the wrong way ✗", tone: "red" }] } } },
          { label: "53.8", correct: false, say: "That shifted two places instead of one.", frame: { line: { min: 0, max: 600, step: 100, marks: [{ at: 53.8, label: "53.8 ✗", tone: "red" }, { at: 538, label: "538", tone: "green" }] } } },
        ],
      },
    ],
    partB: [
      {
        title: "Q5 · Missing term",
        prompt: "Between 8 and 14 there is one missing number, with equal steps. What is it?",
        conceptId: "1.5",
        options: [
          { label: "11", correct: true, say: "Well worked out - the gap is 6, shared into two equal steps of 3.", frame: { line: { min: 6, max: 16, step: 1, marks: [{ at: 8, label: "8", tone: "gold" }, { at: 11, label: "11 ✓", tone: "green" }, { at: 14, label: "14", tone: "gold" }], jumps: [{ from: 8, to: 11, label: "+3" }, { from: 11, to: 14, label: "+3" }] } } },
          { label: "12", correct: false, say: "That would make uneven steps - 4 then 2. They have to match.", frame: { line: { min: 6, max: 16, step: 1, marks: [{ at: 12, label: "12 ✗ - uneven", tone: "red" }, { at: 11, label: "11", tone: "green" }] } } },
          { label: "6", correct: false, say: "The missing number sits between 8 and 14, so it must be bigger than 8.", frame: { line: { min: 6, max: 16, step: 1, marks: [{ at: 6, label: "6 ✗ - outside", tone: "red" }] } } },
        ],
      },
      {
        title: "Q6 · Two moves",
        prompt: "The temperature is -4 degrees. It rises 7, then falls 5. What is it now?",
        conceptId: "1.4",
        options: [
          { label: "-2", correct: true, say: "Exactly. Up 7 from -4 reaches 3, then down 5 lands on -2.", frame: { line: { min: -8, max: 6, step: 2, marks: [{ at: -4, label: "start", tone: "gold" }, { at: 3, label: "after +7", tone: "blue" }, { at: -2, label: "-2 ✓", tone: "green" }], jumps: [{ from: -4, to: 3, label: "+7" }, { from: 3, to: -2, label: "-5" }] } } },
          { label: "2", correct: false, say: "Check the sign - we ended up below zero again.", frame: { line: { min: -8, max: 6, step: 2, marks: [{ at: 2, label: "2 ✗", tone: "red" }, { at: -2, label: "-2", tone: "green" }] } } },
          { label: "-6", correct: false, say: "That subtracted both moves. The first one was a rise.", frame: { line: { min: -8, max: 6, step: 2, marks: [{ at: -6, label: "-6 ✗", tone: "red" }] } } },
        ],
      },
    ],
  },

  readymade: [
    { q: "What is a tenth?", a: "One whole split into 10 equal parts. Each part is one tenth, written 0.1." },
    { q: "What is the difference between decomposing and regrouping?", a: "Decomposing breaks a number into what each digit is worth. Regrouping rearranges those parts flexibly - the total stays the same either way." },
    { q: "Why do negative numbers go to the left?", a: "Because the line gets smaller as you go left, and negative numbers are smaller than zero." },
    { q: "How do I find a sequence rule?", a: "Find the difference between two numbers next to each other. If every gap is the same, that difference is the term-to-term rule." },
  ],
};
