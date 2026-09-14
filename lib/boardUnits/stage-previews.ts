import type { BoardUnit } from "./types";

/**
 * Stage previews - one concept per new stage, so each can be judged before a
 * real unit is built on it.
 *
 * The Vernier caliper is the one grounded in a real textbook (Tamil Nadu
 * Class 9 Science, Unit 1 Measurement); the other four are single worked
 * concepts standing in for the subjects they unlock, in the same shape as the
 * Math and English boards - concept, worked example, quick check.
 */
export const STAGE_PREVIEWS: BoardUnit = {
  unitKey: "stage-previews",
  title: "Stage previews",
  badge: "Preview · all stages",
  gridMax: 10,
  stage: "text",

  intro: {
    covers: [
      "Diagram - labelled apparatus you can tap, for Science",
      "Bar and array - fractions of an amount and multiplication",
      "Chart - data handling with real axes",
      "Timeline - events in order, for History",
      "Map - places on a region, for Geography",
    ],
    outcomes: [
      "See how each new stage teaches, before a whole unit is built on it",
      "Tap any labelled part and hear what it does",
    ],
  },

  concepts: [
    {
      conceptId: "P1",
      title: "Diagram · Vernier caliper",
      icon: "📏",
      summary:
        "A vernier caliper measures small lengths precisely. The main scale gives the whole millimetres and the vernier scale gives the fraction between two marks.",
      pages: [12, 13],
      storyReference: "Class 9 Science, Unit 1 Measurement",
      keyPoints: [
        "Least count = 1 main scale division − 1 vernier scale division = 0.01 cm.",
        "Reading = main scale reading + (coinciding vernier division × least count).",
      ],
      examples: [
        { question: "The main scale reads 2.4 cm and the 6th vernier division coincides. What is the measurement?", answer: "2.4 + (6 × 0.01) = 2.46 cm." },
      ],
      quickCheck: [
        {
          title: "Quick check · P1",
          conceptId: "P1",
          prompt: "What is the least count of a vernier caliper with 10 vernier divisions matching 9 mm?",
          options: [
            { label: "0.01 cm", correct: true, say: "Right - one main division is 0.1 cm, one vernier division is 0.09 cm, so the difference is 0.01 cm.", frame: { text: { passage: [{ text: "LC = 0.1 − 0.09 = 0.01 cm", tone: "green" }] } } },
            { label: "0.1 cm", correct: false, say: "That is one main scale division on its own. The least count is the difference between a main and a vernier division.", frame: { text: { passage: [{ text: "0.1 cm is one main division", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "P2",
      title: "Bar model · fraction of an amount",
      icon: "🟦",
      summary: "A bar model splits an amount into equal parts so you can see what a fraction of it is worth.",
      keyPoints: ["Split the whole into as many parts as the denominator.", "Take as many parts as the numerator."],
      examples: [{ question: "Find 3/4 of 20 using a bar split into 4 equal parts.", answer: "Each part is 5, so three parts is 15." }],
      quickCheck: [
        {
          title: "Quick check · P2",
          conceptId: "P2",
          prompt: "Using the bar, what is 3/4 of 20?",
          options: [
            { label: "15", correct: true, say: "Yes - 20 split into 4 parts is 5 each, and three of those is 15.", frame: { bar: { title: "3/4 of 20", bars: [{ label: "the whole", value: 20, tone: "blue" }, { label: "three quarters", value: 15, tone: "green", note: "Three parts of five." }], max: 20, caption: "20 ÷ 4 = 5, and 5 × 3 = 15" } } },
            { label: "5", correct: false, say: "That is only one quarter. The question asks for three of them.", frame: { bar: { title: "One quarter only", bars: [{ label: "the whole", value: 20, tone: "blue" }, { label: "one quarter", value: 5, tone: "red" }], max: 20, caption: "5 is 1/4, not 3/4" } } },
          ],
        },
      ],
    },
    {
      conceptId: "P3",
      title: "Chart · reading data",
      icon: "📊",
      summary: "A bar chart shows how many are in each group, so you can compare them at a glance and read values off the scale.",
      keyPoints: ["The height of a bar is the value - read it against the scale.", "Comparing bars answers 'how many more' questions."],
      examples: [{ question: "If apples are 7 and pears are 4, how many more apples?", answer: "3 more." }],
      quickCheck: [
        {
          title: "Quick check · P3",
          conceptId: "P3",
          prompt: "How many more chose apples than pears?",
          options: [
            { label: "3", correct: true, say: "Correct - 7 take away 4 is 3.", frame: { chart: { title: "Favourite fruit", yLabel: "children", xLabel: "fruit", categories: [{ label: "Apple", value: 7, tone: "green" }, { label: "Pear", value: 4, tone: "gold" }, { label: "Plum", value: 5, tone: "blue" }] } } },
            { label: "11", correct: false, say: "That added them. 'How many more' means find the difference.", frame: { chart: { title: "Find the difference, not the total", categories: [{ label: "Apple", value: 7, tone: "red" }, { label: "Pear", value: 4, tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "P4",
      title: "Timeline · events in order",
      icon: "🕰️",
      summary: "A timeline puts events in the order they happened, so you can see what came before what, and how far apart they were.",
      keyPoints: ["Earlier events sit higher up the line.", "The gap between two events tells you how much time passed."],
      examples: [{ question: "How many years passed between the first metre standard in 1799 and the SI system in 1960?", answer: "161 years." }],
      quickCheck: [
        {
          title: "Quick check · P4",
          conceptId: "P4",
          prompt: "Which came first?",
          options: [
            { label: "The metre standard of 1799", correct: true, say: "Yes - 1799 comes well before 1960.", frame: { timeline: { title: "The story of measurement", events: [{ when: "1799", what: "The first metre standard", note: "A metal bar kept in Paris defined the metre.", tone: "green" }, { when: "1875", what: "The Metre Convention", tone: "blue" }, { when: "1960", what: "The SI system agreed", tone: "gold" }] } } },
            { label: "The SI system of 1960", correct: false, say: "1960 is later. Look at which number is smaller.", frame: { timeline: { title: "Check the dates", events: [{ when: "1799", what: "First", tone: "green" }, { when: "1960", what: "Later", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "P5",
      title: "Map · places on a region",
      icon: "🗺️",
      summary: "A map shows where places are in relation to each other. Tapping a place tells you what is there.",
      keyPoints: ["North is usually at the top.", "A key or label explains what each mark means."],
      examples: [{ question: "Which direction is the coast from the highlands on this map?", answer: "To the south-east." }],
    },
  ],

  conceptSteps: [
    {
      label: "P1 Diagram",
      conceptId: "P1",
      say: "A vernier caliper. The main scale gives the whole millimetres, and the vernier scale beneath it gives the fraction between two marks. Tap any label to hear what that part does.",
      frame: {
        diagram: {
          title: "Vernier caliper · Class 9 Science, page 12",
          viewBox: "0 0 520 260",
          svg: `
            <rect x="40" y="70" width="430" height="26" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
            <g stroke="#94a3b8" stroke-width="1.5">
              ${Array.from({ length: 18 }, (_, i) => `<line x1="${60 + i * 22}" y1="70" x2="${60 + i * 22}" y2="82"/>`).join("")}
            </g>
            <rect x="150" y="96" width="150" height="24" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <g stroke="#38bdf8" stroke-width="1.5">
              ${Array.from({ length: 11 }, (_, i) => `<line x1="${158 + i * 13}" y1="108" x2="${158 + i * 13}" y2="120"/>`).join("")}
            </g>
            <path d="M40 96 L40 175 L62 175 L62 96 Z" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
            <path d="M150 120 L150 175 L172 175 L172 120 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <path d="M40 70 L40 38 L58 38 L58 70 Z" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
            <path d="M150 70 L150 38 L168 38 L168 70 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <rect x="300" y="100" width="170" height="10" rx="3" fill="#334155" stroke="#64748b" stroke-width="1.5"/>
          `,
          parts: [
            { label: "Main scale", at: [400, 70], note: "Marked in centimetres and millimetres. It gives you the whole part of the reading.", tone: "gold" },
            { label: "Vernier scale", at: [225, 120], note: "Slides along the main scale. The division that lines up with a main scale mark gives the fraction.", tone: "blue" },
            { label: "Outside jaws", at: [51, 175], note: "Grip an object from the outside to measure its width or diameter.", tone: "green" },
            { label: "Inside jaws", at: [49, 38], note: "Open inside a hollow object to measure the width across the inside.", tone: "green" },
            { label: "Depth rod", at: [455, 105], note: "Slides out of the end to measure how deep a hole is.", tone: "red" },
          ],
        },
      },
    },
    {
      label: "P2 Bar model",
      conceptId: "P2",
      say: "A bar model. Split the whole into as many equal parts as the bottom of the fraction, then take as many as the top. Three quarters of 20 is 15.",
      frame: {
        bar: {
          title: "Three quarters of 20",
          bars: [
            { label: "the whole", value: 20, tone: "blue", note: "Twenty altogether." },
            { label: "three quarters of it", value: 15, tone: "green", note: "Three parts of five each." },
          ],
          max: 20,
          array: { rows: 4, cols: 5, highlight: 15, tone: "green" },
          caption: "20 ÷ 4 = 5, and 5 × 3 = 15",
        },
      },
    },
    {
      label: "P3 Chart",
      conceptId: "P3",
      say: "A bar chart. The height of each bar is how many chose that fruit - read it off the scale on the left. Tap a bar to hear its value.",
      frame: {
        chart: {
          title: "Favourite fruit in our class",
          yLabel: "children",
          xLabel: "fruit",
          categories: [
            { label: "Apple", value: 7, tone: "green", note: "Seven children chose apples - the tallest bar." },
            { label: "Pear", value: 4, tone: "gold", note: "Four chose pears - the shortest here." },
            { label: "Plum", value: 5, tone: "blue" },
            { label: "Grape", value: 6, tone: "blue" },
          ],
        },
      },
    },
    {
      label: "P4 Timeline",
      conceptId: "P4",
      say: "A timeline. Earlier events sit higher up, and the gaps show how much time passed between them.",
      frame: {
        timeline: {
          title: "How measurement became standard",
          events: [
            { when: "1799", what: "The first metre standard", note: "A metal bar kept in Paris defined the metre for everyone.", tone: "green" },
            { when: "1875", what: "The Metre Convention", note: "Seventeen countries agreed to share one system.", tone: "blue" },
            { when: "1960", what: "The SI system agreed", note: "The seven base units we still use today.", tone: "gold" },
            { when: "2019", what: "Units redefined by constants", note: "The kilogram stopped being a lump of metal and became a definition.", tone: "red" },
          ],
        },
      },
    },
    {
      label: "P5 Map",
      conceptId: "P5",
      say: "A map uses the same machinery as a diagram - an outline with labelled places you can tap. North is at the top.",
      frame: {
        diagram: {
          title: "A region, with places to tap",
          viewBox: "0 0 440 300",
          svg: `
            <path d="M60 40 L340 30 L390 120 L350 250 L140 265 L40 170 Z" fill="#14532d" fill-opacity="0.35" stroke="#34d399" stroke-width="2.5"/>
            <path d="M350 250 L390 120 L430 140 L410 270 Z" fill="#0c4a6e" fill-opacity="0.5" stroke="#38bdf8" stroke-width="2"/>
            <path d="M90 70 L150 60 L180 110 L120 130 Z" fill="#78350f" fill-opacity="0.5" stroke="#f59e0b" stroke-width="2"/>
            <path d="M140 265 L200 200 L300 210 L350 250 Z" fill="#1e293b" fill-opacity="0.6" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="20" y="26" fill="#94a3b8" font-size="13" font-weight="bold">N ↑</text>
          `,
          parts: [
            { label: "Highlands", at: [135, 95], note: "High ground in the north west - cooler, and where the rivers begin.", tone: "gold" },
            { label: "Coast", at: [395, 195], note: "The sea lies to the south east, where the land meets the water.", tone: "blue" },
            { label: "Lowland plain", at: [245, 232], note: "Flat farmland in the south, fed by the rivers coming down from the highlands.", tone: "green" },
          ],
        },
      },
    },
  ],

  guidedTasks: [
    {
      title: "Practice · read the caliper",
      conceptId: "P1",
      prompt: "Main scale reads 2.4 cm and the 6th vernier division coincides. What is the measurement?",
      options: [
        { label: "2.46 cm", correct: true, say: "Correct - 2.4 plus 6 hundredths.", frame: { text: { passage: [{ text: "2.4 + (6 × 0.01) = 2.46 cm", tone: "green" }] } } },
        { label: "2.6 cm", correct: false, say: "That added 6 tenths. Each vernier division is worth one hundredth, not one tenth.", frame: { text: { passage: [{ text: "6 × 0.01 = 0.06, not 0.6", tone: "red" }] } } },
        { label: "8.4 cm", correct: false, say: "The vernier number is not added on as a whole - it is multiplied by the least count first.", frame: { text: { passage: [{ text: "Multiply by the least count first", tone: "red" }] } } },
      ],
    },
    {
      title: "Practice · read the chart",
      conceptId: "P3",
      prompt: "Which fruit was chosen by exactly 5 children?",
      options: [
        { label: "Plum", correct: true, say: "Yes - the plum bar reaches 5 on the scale.", frame: { chart: { title: "Favourite fruit", categories: [{ label: "Apple", value: 7, tone: "blue" }, { label: "Pear", value: 4, tone: "blue" }, { label: "Plum", value: 5, tone: "green" }, { label: "Grape", value: 6, tone: "blue" }] } } },
        { label: "Grape", correct: false, say: "Grape reaches 6. Follow the top of the bar across to the scale.", frame: { chart: { title: "Follow the bar across", categories: [{ label: "Plum", value: 5, tone: "green" }, { label: "Grape", value: 6, tone: "red" }] } } },
      ],
    },
  ],

  lab: { prompt: "", start: [0, 0], shape: [[0, 0]], range: { min: 0, max: 1 } },

  recitePrompts: [
    { ask: "How do you work out a vernier caliper reading?", answer: "Main scale reading plus the coinciding vernier division multiplied by the least count." },
    { ask: "How does a bar model help with a fraction of an amount?", answer: "It splits the whole into equal parts so you can see what one part is worth, then take as many as you need." },
    { ask: "What does the height of a bar on a chart tell you?", answer: "How many are in that group - read it against the scale at the side." },
  ],

  writtenPractice: [
    { question: "A caliper has a least count of 0.01 cm. The main scale reads 5.7 cm and the 3rd vernier division coincides. Write the reading.", answer: "5.73 cm." },
    { question: "Use a bar model to find 2/5 of 30.", answer: "30 ÷ 5 = 6, and 6 × 2 = 12." },
    { question: "In the fruit chart, how many children were asked altogether?", answer: "7 + 4 + 5 + 6 = 22." },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · Least count",
        conceptId: "P1",
        prompt: "What does the least count of an instrument tell you?",
        options: [
          { label: "The smallest measurement it can read", correct: true, say: "Yes - it is the finest division the instrument can resolve.", frame: { text: { passage: [{ text: "The smallest measurement it can read.", tone: "green" }] } } },
          { label: "The largest measurement it can read", correct: false, say: "That is its range, not its least count.", frame: { text: { passage: [{ text: "That is the range.", tone: "red" }] } } },
        ],
      },
      {
        title: "Q2 · Bar model",
        conceptId: "P2",
        prompt: "What is 2/5 of 30?",
        options: [
          { label: "12", correct: true, say: "Correct - 30 split into 5 parts is 6 each, and two of those is 12.", frame: { bar: { title: "2/5 of 30", bars: [{ label: "the whole", value: 30, tone: "blue" }, { label: "two fifths", value: 12, tone: "green" }], max: 30, caption: "30 ÷ 5 = 6, and 6 × 2 = 12" } } },
          { label: "6", correct: false, say: "That is one fifth. The question asks for two of them.", frame: { bar: { title: "One fifth only", bars: [{ label: "the whole", value: 30, tone: "blue" }, { label: "one fifth", value: 6, tone: "red" }], max: 30 } } },
        ],
      },
    ],
    partB: [
      {
        title: "Q3 · Use the timeline",
        conceptId: "P4",
        prompt: "How many years passed between the Metre Convention and the SI system being agreed?",
        options: [
          { label: "85 years", correct: true, say: "Right - 1960 take away 1875 is 85.", frame: { timeline: { title: "1875 to 1960", events: [{ when: "1875", what: "The Metre Convention", tone: "blue" }, { when: "1960", what: "SI system agreed", tone: "green", note: "85 years later." }] } } },
          { label: "161 years", correct: false, say: "That is from 1799, the first metre standard - not from the Convention.", frame: { timeline: { title: "Check which two", events: [{ when: "1799", what: "First standard", tone: "red" }, { when: "1875", what: "Convention - start here", tone: "green" }] } } },
        ],
      },
    ],
  },

  readymade: [
    { q: "What is a least count?", a: "The smallest measurement an instrument can read - for a vernier caliper, usually 0.01 centimetres." },
    { q: "How does a bar model work?", a: "Split the whole into as many equal parts as the bottom of the fraction, then take as many parts as the top." },
    { q: "How do I read a bar chart?", a: "Follow the top of the bar across to the scale at the side - that number is the value." },
  ],
};
