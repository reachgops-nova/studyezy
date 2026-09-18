import type { BoardFrame, BoardTask, BoardUnit } from "./types";

/**
 * Board definitions for the Math units that already have lesson scenes and
 * interactive widgets, but did not yet have a Drawing Board route. The
 * content names follow the existing unit/player registry; the shared player
 * supplies the same Read -> Cover -> Recite -> Test flow as the pilot.
 */
type MathDefinition = {
  number: number;
  title: string;
  concepts: { id: string; title: string; icon: string; summary: string }[];
  visual: "line" | "grid" | "bars";
};

const MATH_DEFINITIONS: MathDefinition[] = [
  {
    number: 3,
    title: "Calculation",
    visual: "line",
    concepts: [
      { id: "3.1", title: "Calculating with negative numbers", icon: "➖", summary: "Use a number line to add and subtract across zero." },
      { id: "3.2", title: "Mental addition and subtraction", icon: "🧠", summary: "Break numbers into friendly parts and use estimation to check." },
      { id: "3.3", title: "Solving equations", icon: "🔎", summary: "Find the unknown by undoing the operation that was used." },
      { id: "3.4", title: "Mental multiplication", icon: "✖️", summary: "Split a multiplication into helpful facts you already know." },
      { id: "3.5", title: "Partial products", icon: "🧱", summary: "Partition numbers and add the partial products together." },
    ],
  },
  {
    number: 4,
    title: "Time",
    visual: "line",
    concepts: [
      { id: "4.1", title: "Decimals of time", icon: "⏱️", summary: "Connect decimal hours and days to minutes and hours." },
      { id: "4.2", title: "Time intervals", icon: "🕒", summary: "Find elapsed time by jumping to the next hour, then to the finish." },
    ],
  },
  {
    number: 5,
    title: "Statistical methods",
    visual: "bars",
    concepts: [
      { id: "5.1", title: "Bar charts and dot plots", icon: "📊", summary: "Read exact totals and compare groups in a chart." },
      { id: "5.2", title: "Frequency charts", icon: "📋", summary: "Count how many values fall into each interval." },
      { id: "5.3", title: "Line graphs", icon: "📈", summary: "Track change over time and describe the trend." },
    ],
  },
  {
    number: 6,
    title: "Fractions, decimals and percentages",
    visual: "bars",
    concepts: [
      { id: "6.1", title: "Fractions as division", icon: "🍕", summary: "A fraction shows an amount shared into equal parts." },
      { id: "6.2", title: "Equivalent fractions", icon: "🟰", summary: "Different-looking fractions can name exactly the same value." },
      { id: "6.3", title: "Mixed numbers", icon: "🥧", summary: "Combine whole numbers and fractional parts without changing the value." },
      { id: "6.4", title: "Fractions of quantities", icon: "🎯", summary: "Find a fraction of an amount by sharing, then multiplying if needed." },
      { id: "6.5", title: "Related fractions", icon: "🔗", summary: "Connect fractions, decimals and percentages that represent the same amount." },
    ],
  },
  {
    number: 7,
    title: "Number",
    visual: "line",
    concepts: [
      { id: "7.1", title: "Tenths and hundredths", icon: "🔟", summary: "Place decimal digits correctly and read what each place is worth." },
      { id: "7.2", title: "Decomposing and regrouping decimals", icon: "🧩", summary: "Split a decimal into place values and regroup without changing its value." },
      { id: "7.3", title: "Rounding decimals", icon: "🎯", summary: "Look at the next digit to decide whether to round up or down." },
      { id: "7.4", title: "Scaling decimals", icon: "↔️", summary: "See how digits shift when multiplying or dividing by powers of ten." },
      { id: "7.5", title: "Linear sequence rules", icon: "🔢", summary: "Find the constant difference and use it to continue a sequence." },
    ],
  },
  {
    number: 8,
    title: "Probability",
    visual: "bars",
    concepts: [
      { id: "8.1", title: "Likelihood scale", icon: "🎲", summary: "Place events from impossible through unlikely and likely to certain." },
      { id: "8.2", title: "Probability experiments", icon: "🧪", summary: "Run repeated trials and compare predicted and actual frequencies." },
    ],
  },
  {
    number: 9,
    title: "Calculation",
    visual: "line",
    concepts: [
      { id: "9.1", title: "Mental addition strategies", icon: "➕", summary: "Bridge through friendly numbers to make large calculations easier." },
      { id: "9.2", title: "Adding decimals", icon: "🔟", summary: "Keep place values aligned and combine wholes and decimal parts." },
      { id: "9.3", title: "Two-digit multiplication", icon: "✖️", summary: "Partition a factor and combine the partial products." },
      { id: "9.4", title: "Division with remainders", icon: "➗", summary: "Share equally, then describe what is left over as the remainder." },
      { id: "9.5", title: "Order of operations", icon: "🧭", summary: "Follow the order so multiplication and division happen before addition." },
    ],
  },
  {
    number: 11,
    title: "Fractions, decimals, percentages and proportion",
    visual: "bars",
    concepts: [
      { id: "11.1", title: "Percentages of a whole", icon: "%", summary: "Percent means parts out of one hundred." },
      { id: "11.2", title: "Fractions, decimals and percentages", icon: "🔁", summary: "Translate between three ways of naming the same amount." },
      { id: "11.3", title: "Comparing and ordering quantities", icon: "⚖️", summary: "Convert values to a common form before comparing them." },
      { id: "11.4", title: "Fractions of amounts", icon: "🍰", summary: "Find a unit fraction first, then scale it to the numerator." },
      { id: "11.5", title: "Ratio and proportion", icon: "🧃", summary: "Keep relationships equal while quantities grow or shrink." },
    ],
  },
  {
    number: 12,
    title: "Angles and shapes",
    visual: "grid",
    concepts: [
      { id: "12.1", title: "Perimeter and polygons", icon: "⬡", summary: "Add the side lengths around a shape to find its perimeter." },
      { id: "12.2", title: "Area of rectangles", icon: "▦", summary: "Count the square units using length multiplied by width." },
      { id: "12.3", title: "Three-dimensional nets", icon: "📦", summary: "A net folds into a solid when its faces meet along matching edges." },
      { id: "12.4", title: "Visualising 3D shapes", icon: "🧊", summary: "Use faces, edges and vertices to describe a solid from different views." },
    ],
  },
  {
    number: 13,
    title: "Number patterns",
    visual: "grid",
    concepts: [
      { id: "13.1", title: "Square numbers", icon: "⬛", summary: "A square number is made by multiplying a number by itself." },
      { id: "13.2", title: "Triangular numbers", icon: "🔺", summary: "Growing rows of dots build the triangular-number sequence." },
      { id: "13.3", title: "Divisibility rules", icon: "✅", summary: "Use quick tests to decide whether a number divides exactly." },
      { id: "13.4", title: "Prime and composite numbers", icon: "🧱", summary: "A prime has exactly two factors; a composite has more." },
    ],
  },
  {
    number: 14,
    title: "Location and movement",
    visual: "grid",
    concepts: [
      { id: "14.1", title: "Reflections", icon: "🪞", summary: "Reflect a point the same distance across a mirror line." },
      { id: "14.2", title: "Translation and reflection", icon: "↔️", summary: "Tell the difference between sliding a shape and flipping it." },
    ],
  },
  {
    number: 15,
    title: "Calculation",
    visual: "line",
    concepts: [
      { id: "15.1", title: "Missing numbers and inverse operations", icon: "❓", summary: "Work backwards with the inverse operation to find an unknown." },
      { id: "15.2", title: "Order of operations", icon: "🧭", summary: "Evaluate expressions in the correct order." },
      { id: "15.3", title: "Written multiplication and division", icon: "✍️", summary: "Organise place values so each written step is visible." },
      { id: "15.4", title: "Adding and subtracting decimals", icon: "🔟", summary: "Line up decimal points before calculating." },
      { id: "15.5", title: "Multiplying decimals", icon: "✖️", summary: "Multiply the digits, then place the decimal using place value." },
    ],
  },
  {
    number: 16,
    title: "Statistical methods",
    visual: "bars",
    concepts: [
      { id: "16.1", title: "Mode and median", icon: "📍", summary: "Use the middle and most frequent values to describe data." },
      { id: "16.2", title: "Waffle diagrams", icon: "🧇", summary: "Represent a percentage by shading equal squares in a grid." },
    ],
  },
  {
    number: 17,
    title: "Fractions and proportion",
    visual: "bars",
    concepts: [
      { id: "17.1", title: "Comparing fractions, decimals and percentages", icon: "⚖️", summary: "Convert values to a common representation before ordering them." },
      { id: "17.2", title: "Adding and subtracting related fractions", icon: "➕", summary: "Find a common denominator before combining fractions." },
      { id: "17.3", title: "Dividing unit fractions", icon: "➗", summary: "Understand how sharing a unit fraction changes its size." },
      { id: "17.4", title: "Multiplying unit fractions", icon: "✖️", summary: "Multiply numerator and denominator while keeping the model visible." },
      { id: "17.5", title: "Ratio and proportion", icon: "🧃", summary: "Scale two linked quantities by the same factor." },
    ],
  },
  {
    number: 18,
    title: "Time and world time zones",
    visual: "line",
    concepts: [
      { id: "18.1", title: "World time zones", icon: "🌍", summary: "Add or subtract hours as you move east or west around the world." },
      { id: "18.2", title: "Start and end times", icon: "🕒", summary: "Use jumps through the hour to find an ending time or duration." },
    ],
  },
];

function conceptFrame(definition: MathDefinition, index: number): BoardFrame {
  if (definition.number === 3 && definition.concepts[index]?.id === "3.1") {
    return {
      line: {
        min: -5,
        max: 9,
        step: 1,
        marks: [
          { at: -4, label: "start −4", tone: "blue" },
          { at: 0, label: "zero", tone: "gold" },
          { at: 5, label: "finish 5", tone: "green" },
        ],
        jumps: [
          { from: -4, to: 0, label: "+4 to zero" },
          { from: 0, to: 5, label: "+5 more" },
        ],
      },
    };
  }
  if (definition.number === 18 && definition.concepts[index]?.id === "18.1") {
    return {
      timeline: {
        title: "World time zones · add eastward, subtract westward",
        events: [
          { when: "12:00 noon", what: "Lagos", note: "Start here.", tone: "blue", direction: "neutral" },
          { when: "＋5 hours · EAST →", what: "Lagos to Delhi", note: "Moving east means add 5 hours: 12:00 + 5 = 17:00.", tone: "gold", direction: "east" },
          { when: "17:00 / 5:00 pm", what: "Delhi", note: "East is ahead, so the local clock is later.", tone: "green", direction: "neutral" },
          { when: "7:00 am · Sydney", what: "Starting westward example", note: "A second example from the book.", tone: "blue", direction: "neutral" },
          { when: "−14 hours · WEST ←", what: "Move west", note: "Moving west means subtract 14 hours: 7:00 am − 14 h = 5:00 pm on the previous day.", tone: "red", direction: "west" },
        ],
      },
    };
  }
  if (definition.number === 18 && definition.concepts[index]?.id === "18.2") {
    return {
      line: {
        min: 0,
        max: 90,
        step: 15,
        marks: [
          { at: 0, label: "11:20 start", tone: "blue" },
          { at: 40, label: "12:00", tone: "gold" },
          { at: 45, label: "12:05 finish", tone: "green" },
        ],
        jumps: [
          { from: 0, to: 40, label: "+40 min" },
          { from: 40, to: 45, label: "+5 min" },
        ],
      },
    };
  }
  if (definition.visual === "bars") {
    return {
      bar: {
        title: definition.concepts[index]?.title,
        max: 10,
        bars: [
          { label: "Start", value: 3 + (index % 3), tone: "blue" },
          { label: "Explore", value: 5 + (index % 4), tone: "gold" },
          { label: "Explain", value: 7 + (index % 3), tone: "green" },
        ],
        caption: "Tap a bar to hear what it represents.",
      },
    };
  }
  if (definition.visual === "grid") {
    const x = 2 + (index % 4);
    return {
      shapes: [{ points: [[x, 2], [x + 2, 2], [x + 2, 4], [x, 4]], look: "live" }],
      guides: [{ from: [5, 0], to: [5, 8], label: "reference line", tone: "blue" }],
      dots: [{ at: [x, 2], label: "tap and inspect", tone: "gold" }],
    };
  }
  const mark = Math.min(9, 2 + index * 1.2);
  return {
    line: {
      min: 0,
      max: 10,
      step: 1,
      marks: [{ at: mark, label: definition.concepts[index]?.title ?? "example", tone: "green" }],
      jumps: [{ from: 0, to: mark, label: `show ${definition.concepts[index]?.title ?? "the change"}` }],
    },
  };
}

function makeTask(definition: MathDefinition, concept: MathDefinition["concepts"][number], index: number, title: string): BoardTask {
  const frame = conceptFrame(definition, index);
  if (definition.number === 3 && concept.id === "3.1") {
    return {
      title,
      prompt: "Start at −4 on the number line and add 9. Where do you land?",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "5", correct: true, say: "Correct. Move 4 steps right to 0, then 5 more steps right to land on 5.", frame },
        { label: "−13", correct: false, say: "Adding 9 moves right, not left. From −4, cross zero and land on 5.", frame },
        { label: "−5", correct: false, say: "That is only one step left of −4. Adding 9 means nine steps to the right.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.1") {
    return {
      title,
      prompt: "It is 12:00 noon in Lagos. Delhi is 5 hours east. What time is it in Delhi?",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "17:00 (5:00 pm)", correct: true, say: "Correct. East is ahead, so add 5 hours: 12:00 + 5 = 17:00.", frame },
        { label: "07:00 (7:00 am)", correct: false, say: "That moved in the wrong direction. Delhi is east and ahead, so add 5 hours.", frame },
        { label: "12:00 noon", correct: false, say: "Different time zones do not keep the same local time. Add the 5-hour difference.", frame },
      ],
    };
  }
  if (definition.number === 18 && concept.id === "18.2") {
    return {
      title,
      prompt: "A show starts at 11:20 am and lasts 45 minutes. What time does it finish?",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "12:05 pm", correct: true, say: "Correct. Jump 40 minutes to 12:00, then 5 more minutes to 12:05.", frame },
        { label: "11:65 am", correct: false, say: "Minutes stop at 60. Regroup 40 minutes to reach 12:00, then add 5 minutes.", frame },
        { label: "10:35 am", correct: false, say: "That subtracted the duration. To find an end time, add the duration and work forward.", frame },
      ],
    };
  }
  return {
    title,
    prompt: `Use the board model to show one worked example of ${concept.title}. Which response follows the rule?`,
    conceptId: concept.id,
    setup: frame,
    options: [
      { label: `The model shows ${concept.title} correctly`, correct: true, say: `Yes. Now explain each step and check the result against the example.`, frame },
      { label: "Skip the model and guess", correct: false, say: `Use the visible model first, then explain why the result fits ${concept.title}.`, frame: {} },
    ],
  };
}

function makeBoardUnit(definition: MathDefinition): BoardUnit {
  const concepts = definition.concepts.map((concept, index) => ({
    conceptId: concept.id,
    title: concept.title,
    icon: concept.icon,
    summary: concept.summary,
    keyPoints: definition.number === 18 && concept.id === "18.1"
      ? ["The world is divided into 24 hourly time zones.", "East is ahead: add hours. West is behind: subtract hours.", "Subtracting across midnight can move the date to the previous day."]
      : definition.number === 18 && concept.id === "18.2"
        ? ["To find an end time, add the duration and work forward.", "Jump to the next round hour first, then add the remaining minutes.", "To find a start time, subtract the duration and work backward."]
        : [concept.summary, "Tap the board, talk through the example, then check your thinking."],
    examples: definition.number === 3 && concept.id === "3.1"
      ? [
          { question: "Start at −4 and add 9. Where do you land?", answer: "5: move 4 steps right to 0, then 5 more steps right." },
          { question: "Start at 5 and subtract 9. Where do you land?", answer: "−4: move 5 steps left to 0, then 4 more steps left." },
        ]
      : definition.number === 18 && concept.id === "18.1"
      ? [
          { question: "12:00 noon in Lagos; Delhi is 5 hours east. Find Delhi time.", answer: "17:00 (5:00 pm), because 12:00 + 5 hours = 17:00." },
          { question: "7:00 am on 13 July in Sydney; another city is 14 hours behind. Find its local time.", answer: "5:00 pm on 12 July: subtract 14 hours and cross into the previous day." },
        ]
      : definition.number === 18 && concept.id === "18.2"
        ? [
            { question: "A show starts at 11:20 am and lasts 45 minutes.", answer: "12:05 pm: +40 minutes reaches 12:00, then +5 minutes." },
            { question: "A film finishes at 8:15 pm and lasts 90 minutes.", answer: "6:45 pm: subtract 60 minutes to 7:15, then 30 minutes." },
          ]
        : [
            { question: `Use the board model to show one worked example of ${concept.title}.`, answer: `${concept.summary} Show the operation, label the units, and check that the answer makes sense.` },
            { question: `What should you check when working with ${concept.title}?`, answer: "Check the units, the operation, and whether the answer makes sense in the model." },
          ],
    quickCheck: [makeTask(definition, concept, index, `Ready check · ${concept.id}`)],
  }));

  const conceptSteps = definition.concepts.flatMap((concept, index) => [
    { label: `${concept.id} · Meet the idea`, conceptId: concept.id, say: concept.summary, frame: conceptFrame(definition, index) },
    { label: `${concept.id} · Tap and explain`, conceptId: concept.id, say: `Tap the highlighted part and explain what ${concept.title} is doing.`, frame: conceptFrame(definition, index) },
  ]);
  const guidedTasks = definition.concepts.map((concept, index) => makeTask(definition, concept, index, `Try it · ${concept.id}`));
  const assessmentTasks = definition.concepts.slice(0, Math.min(3, definition.concepts.length)).map((concept, index) => makeTask(definition, concept, index, `Test · ${concept.id}`));

  return {
    unitKey: `cambridge-4-math-${definition.number}`,
    title: definition.title,
    badge: `Grade 4 · Unit ${definition.number}`,
    gridMax: 10,
    stage: definition.visual === "grid" ? "grid" : definition.visual === "bars" ? "bar" : "numberLine",
    intro: {
      covers: definition.concepts.map((concept) => `${concept.id} ${concept.title}`),
      outcomes: definition.concepts.slice(0, 4).map((concept) => `explain ${concept.title.toLowerCase()} using a model`),
    },
    concepts,
    conceptSteps,
    guidedTasks,
    lab: { kind: definition.number === 18 ? "timeZone" : "coordinate", prompt: definition.number === 18
      ? "Use the visible time jumps to explain whether you are adding eastward or subtracting westward."
      : `Use the highlighted model to work one ${definition.title.toLowerCase()} example and explain each change.`, start: [2, 2], shape: [[0, 0], [2, 0], [2, 2], [0, 2]], range: { min: -2, max: 6 } },
    recitePrompts: concepts.flatMap((concept) => [
      { ask: `Say the rule for ${concept.title}.`, answer: concept.summary, conceptId: concept.conceptId },
      ...(concept.examples[0] ? [{ ask: `Recite this worked example: ${concept.examples[0].question}`, answer: concept.examples[0].answer, conceptId: concept.conceptId }] : []),
    ]),
    writtenPractice: concepts.flatMap((concept) => concept.examples[1] ? [{ question: `Write and explain: ${concept.examples[1].question}`, answer: concept.examples[1].answer, conceptId: concept.conceptId }] : []),
    assessmentStory: conceptFrame(definition, 0),
    assessment: { partA: assessmentTasks, partB: [] },
    readymade: definition.concepts.slice(0, 4).map((concept) => ({ q: `What is ${concept.title}?`, a: concept.summary })),
    chatAnswers: definition.concepts.map((concept) => ({ question: `What is ${concept.title}?`, answer: concept.summary, keywords: concept.title.toLowerCase().split(/\s+/).filter((word) => word.length > 2), conceptId: concept.id })),
  };
}

export const PENDING_MATH_BOARD_UNITS: Record<string, BoardUnit> = Object.fromEntries(
  MATH_DEFINITIONS.map((definition) => {
    const unit = makeBoardUnit(definition);
    return [unit.unitKey, unit];
  }),
) as Record<string, BoardUnit>;
