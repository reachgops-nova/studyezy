import type { BoardFrame, BoardTask, BoardUnit, ConceptStep } from "./types";

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
  if (definition.number === 3 && definition.concepts[index]?.id === "3.2") {
    // Real book sequence (Learn, p33): start at 4653, add 3000, subtract
    // 499, subtract 2486, add 32 - the number-line jumps animate this one
    // step at a time for free, via the shared AnimatedNumberLineJumps fix.
    return {
      line: {
        min: 4000, max: 8000, step: 500,
        marks: [{ at: 4653, label: "start 4653", tone: "blue" }, { at: 4700, label: "finish 4700", tone: "green" }],
        jumps: [
          { from: 4653, to: 7653, label: "+3000" },
          { from: 7653, to: 7154, label: "−499" },
          { from: 7154, to: 4668, label: "−2486" },
          { from: 4668, to: 4700, label: "+32" },
        ],
      },
    };
  }
  if (definition.number === 3 && definition.concepts[index]?.id === "3.3") {
    // Real book scenario (Explore, p35): missing-number toy-shop problem,
    // solved by undoing each operation - inverse, not guesswork.
    return {
      text: {
        title: "Missing number problems · toy shop",
        cards: [
          { tag: "Given", title: "Two spinning tops cost $16", desc: "So one spinning top costs 16 ÷ 2 = $8." },
          { tag: "Given", title: "A spinning top and a toy car cost $20", desc: "So the toy car costs 20 − 8 = $12." },
          { tag: "Given", title: "A train set with a $20 note gives $3 change", desc: "So the train set costs 20 − 3 = $17." },
          { tag: "Given", title: "A train set and a skipping rope cost $25", desc: "So the skipping rope costs 25 − 17 = $8." },
        ],
      },
    };
  }
  if (definition.number === 3 && definition.concepts[index]?.id === "3.4") {
    // Real book laws (Learn, p38): distributive, commutative, associative -
    // each with the book's own worked numbers, not invented ones.
    return {
      text: {
        title: "Simplifying multiplications · the three laws",
        cards: [
          { tag: "Distributive", title: "19 × 5", desc: "Regroup 19 as 20 − 1: 19 × 5 = (20 × 5) − 5 = 100 − 5 = 95." },
          { tag: "Commutative", title: "25 × 33 × 4", desc: "Reorder the factors: 25 × 33 × 4 = 25 × 4 × 33 = 100 × 33 = 3300." },
          { tag: "Associative", title: "46 × 2 × 5", desc: "Group 2 × 5 first: 46 × 2 × 5 = 46 × 10 = 460." },
        ],
      },
    };
  }
  if (definition.number === 3 && definition.concepts[index]?.id === "3.5") {
    // Real book grid method (Learn, p41): 34 x 13 split into four partial
    // products that sum to the answer.
    return {
      bar: {
        title: "Partial products · 34 × 13",
        max: 300,
        bars: [
          { label: "30 × 10", value: 300, tone: "blue" },
          { label: "4 × 10", value: 40, tone: "gold" },
          { label: "30 × 3", value: 90, tone: "green" },
          { label: "4 × 3", value: 12, tone: "red" },
        ],
        caption: "300 + 40 + 90 + 12 = 442, so 34 × 13 = 442.",
      },
    };
  }
  if (definition.number === 4 && definition.concepts[index]?.id === "4.1") {
    // Real book example (Learn, p44): Guss walked to school in 0.5 hours.
    // The book itself flags both "5 minutes" and "50 minutes" as wrong
    // guesses - genuine, documented misconceptions worth animating past.
    return {
      line: {
        min: 0, max: 60, step: 10,
        marks: [{ at: 0, label: "start", tone: "blue" }, { at: 30, label: "finish: 30 min", tone: "green" }],
        jumps: [{ from: 0, to: 30, label: "0.5 hours" }],
      },
    };
  }
  if (definition.number === 4 && definition.concepts[index]?.id === "4.2") {
    // Real book method (Learn, p47): 07:57 to 08:04, jumping to the next
    // whole hour first, then on to the finish - two clean animated jumps.
    return {
      line: {
        min: 0, max: 10, step: 1,
        marks: [{ at: 0, label: "start 07:57", tone: "blue" }, { at: 3, label: "08:00", tone: "gold" }, { at: 7, label: "finish 08:04", tone: "green" }],
        jumps: [{ from: 0, to: 3, label: "+3 min" }, { from: 3, to: 7, label: "+4 min" }],
      },
    };
  }
  if (definition.number === 5 && definition.concepts[index]?.id === "5.1") {
    // Real book bar chart (Learn, p50): visitors to a Nature Garden by
    // month, read carefully off the gridlines at 100-visitor intervals.
    return {
      chart: {
        title: "Number of visitors each month",
        xLabel: "Month", yLabel: "Visitors",
        categories: [
          { label: "March", value: 50, tone: "blue" },
          { label: "April", value: 330, tone: "blue" },
          { label: "May", value: 200, tone: "blue" },
          { label: "June", value: 450, tone: "green" },
          { label: "July", value: 520, tone: "green" },
          { label: "August", value: 570, tone: "green" },
        ],
      },
    };
  }
  if (definition.number === 5 && definition.concepts[index]?.id === "5.2") {
    // Real book data (Practise, p53): 20 learners' distance to school,
    // grouped into the book's own 1 km bins - every count checked by hand.
    return {
      chart: {
        title: "Distance to school (20 learners)",
        xLabel: "Distance", yLabel: "Frequency",
        categories: [
          { label: "0-1 km", value: 3, tone: "blue" },
          { label: "1-2 km", value: 2, tone: "blue" },
          { label: "2-3 km", value: 5, tone: "gold" },
          { label: "3-4 km", value: 3, tone: "gold" },
          { label: "4-5 km", value: 5, tone: "green" },
          { label: "5-6 km", value: 2, tone: "green" },
        ],
      },
    };
  }
  if (definition.number === 5 && definition.concepts[index]?.id === "5.3") {
    // Real book table (Practise, p55): maximum temperature over 6 days -
    // coordinates computed from the table, not eyeballed off the printed
    // graph, so the polyline lands exactly on each real reading.
    return {
      diagram: {
        title: "Maximum temperature over 6 days",
        viewBox: "0 0 520 250",
        svg: `
          <line x1="60" y1="210" x2="460" y2="210" stroke="#475569" stroke-width="2"/>
          <line x1="60" y1="40" x2="60" y2="210" stroke="#475569" stroke-width="2"/>
          <polyline points="60,114 140,80 220,125 300,159 380,97 460,63" fill="none" stroke="#38bdf8" stroke-width="4"/>
          ${[["60","114"],["140","80"],["220","125"],["300","159"],["380","97"],["460","63"]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#f59e0b" stroke="#0b1329" stroke-width="2"/>`).join("")}
          <text x="60" y="228" font-size="12" fill="#94a3b8" text-anchor="middle">Day 1</text>
          <text x="140" y="228" font-size="12" fill="#94a3b8" text-anchor="middle">Day 2</text>
          <text x="220" y="228" font-size="12" fill="#94a3b8" text-anchor="middle">Day 3</text>
          <text x="300" y="228" font-size="12" fill="#94a3b8" text-anchor="middle">Day 4</text>
          <text x="380" y="228" font-size="12" fill="#94a3b8" text-anchor="middle">Day 5</text>
          <text x="460" y="228" font-size="12" fill="#94a3b8" text-anchor="middle">Day 6</text>
        `,
        parts: [
          { label: "17°C", at: [60, 114], tone: "blue", note: "Day 1: 17°C." },
          { label: "23°C", at: [140, 80], tone: "green", note: "Day 2: 23°C - the temperature rose." },
          { label: "9°C (lowest)", at: [300, 159], tone: "red", note: "Day 4: 9°C, the lowest point on the graph - the trend dipped here." },
          { label: "26°C (highest)", at: [460, 63], tone: "gold", note: "Day 6: 26°C, the highest point - the trend rose sharply from Day 4 to Day 6." },
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
      prompt: "Start at −3. Now add 6. Drag the marker along the line to where you land.",
      conceptId: concept.id,
      setup: frame,
      drag: { from: [-3], to: [3], hint: "drag to where −3 + 6 lands" },
      options: [
        { label: "3", correct: true, say: "Yes - 3. From −3, six steps right crosses zero and lands on 3.", frame },
        { label: "not 3", correct: false, say: "Not quite - try dragging again and count the steps from −3.", frame },
      ],
    };
  }
  if (definition.number === 3 && concept.id === "3.2") {
    // Real book Practise question (p33): 6345 - 90 - 255. Broken into its
    // final step so it fits a single drag, same give-them-the-ball pattern.
    return {
      title,
      prompt: "Start at 6255 (that's 6345 − 90). Now subtract 255. Drag the marker to where you land.",
      conceptId: concept.id,
      setup: frame,
      drag: { from: [6255], to: [6000], hint: "drag to where 6255 − 255 lands" },
      options: [
        { label: "6000", correct: true, say: "Yes - 6000. 6255 − 255 = 6000, a nice round number to land on.", frame },
        { label: "not 6000", correct: false, say: "Not quite - try dragging again and count back 255 from 6255.", frame },
      ],
    };
  }
  if (definition.number === 3 && concept.id === "3.3") {
    return {
      title,
      prompt: "A train set with a $20 note gives $3 change, so it costs $17. A train set and a skipping rope together cost $25. What does the skipping rope cost?",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "$8", correct: true, say: "Correct. Undo the addition: 25 − 17 = 8, so the skipping rope costs $8.", frame },
        { label: "$17", correct: false, say: "That is the train set's price, not the skipping rope's. Subtract the train set's cost from $25 to find what is left.", frame },
        { label: "$5", correct: false, say: "That comes from 25 − 20, using the $20 note instead of the $17 train set. Use the train set's actual price, $17.", frame },
      ],
    };
  }
  if (definition.number === 3 && concept.id === "3.4") {
    return {
      title,
      prompt: "Use the commutative law to reorder the factors: what is 25 × 33 × 4?",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "3300", correct: true, say: "Yes. Reorder to 25 × 4 × 33 = 100 × 33 = 3300 - multiplying in a friendlier order gives the same product.", frame },
        { label: "336", correct: false, say: "That looks like the digits were combined, not multiplied. Reorder the factors first: 25 × 4 = 100, then 100 × 33.", frame },
        { label: "2533", correct: false, say: "That is not a multiplication at all. Group 25 and 4 first (25 × 4 = 100), then multiply by 33.", frame },
      ],
    };
  }
  if (definition.number === 3 && concept.id === "3.5") {
    return {
      title,
      prompt: "Use the grid method to work out 27 × 12.",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "324", correct: true, say: "Correct. 20×10=200, 7×10=70, 20×2=40, 7×2=14, and 200+70+40+14=324.", frame },
        { label: "270", correct: false, say: "That is only 27 × 10 - you left out the × 2 part. 12 splits into 10 and 2, so you need all four partial products.", frame },
        { label: "290", correct: false, say: "One partial product is missing. Check all four: 200, 70, 40 and 14 - add every one of them.", frame },
      ],
    };
  }
  if (definition.number === 4 && concept.id === "4.1") {
    return {
      title,
      prompt: "Milo cycled to the park in 0.25 hours. Drag the marker to how many minutes that is.",
      conceptId: concept.id,
      setup: frame,
      drag: { from: [0], to: [15], hint: "drag to how many minutes 0.25 hours is" },
      options: [
        { label: "15", correct: true, say: "Yes - 15 minutes. 0.25 is a quarter, and a quarter of 60 minutes is 15.", frame },
        { label: "not 15", correct: false, say: "Not quite - 0.25 hours is a quarter of an hour. A quarter of 60 minutes is 15, try dragging again.", frame },
      ],
    };
  }
  if (definition.number === 4 && concept.id === "4.2") {
    return {
      title,
      prompt: "Garden World starts at 09:45. Cartoons starts at 10:35. How long is Garden World?",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "50 minutes", correct: true, say: "Correct. Jump to the hour first: 09:45 to 10:00 is 15 minutes, then 10:00 to 10:35 is 35 more - 15 + 35 = 50.", frame },
        { label: "90 minutes", correct: false, say: "That subtracts the hour digits (10 − 9 = 1 hour) and the minute digits separately, which does not work across an hour boundary. Jump to 10:00 first, then add on.", frame },
        { label: "45 minutes", correct: false, say: "That is just the minutes part of 10:35, not the interval. Jump from 09:45 to the next hour (15 min), then on to 10:35 (35 min more).", frame },
      ],
    };
  }
  if (definition.number === 5 && concept.id === "5.1") {
    return {
      title,
      prompt: "Looking at the bar chart, which month had about 200 visitors?",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "May", correct: true, say: "Correct. May's bar sits right around the 200 line - lower than April's, even though April comes first.", frame },
        { label: "March", correct: false, say: "March's bar is the shortest of all, only about 50 - nowhere near 200.", frame },
        { label: "June", correct: false, say: "June's bar is much taller, around 450 - more than double 200.", frame },
      ],
    };
  }
  if (definition.number === 5 && concept.id === "5.2") {
    return {
      title,
      prompt: "Using the frequency chart, how many learners travel between 3 km and 5 km to school?",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "8", correct: true, say: "Correct. Add the 3-4 km bar (3) and the 4-5 km bar (5): 3 + 5 = 8.", frame },
        { label: "5", correct: false, say: "That is only the 4-5 km bar. The question asks for 3 km to 5 km, so the 3-4 km bar counts too: 3 + 5 = 8.", frame },
        { label: "20", correct: false, say: "That is every learner in the whole survey, not just the ones travelling 3-5 km. Add only the 3-4 km and 4-5 km bars: 3 + 5 = 8.", frame },
      ],
    };
  }
  if (definition.number === 5 && concept.id === "5.3") {
    return {
      title,
      prompt: "Looking at the temperature line graph, between which two days did the temperature fall the most?",
      conceptId: concept.id,
      setup: frame,
      options: [
        { label: "Day 3 to Day 4", correct: true, say: "Correct. The line drops from 15°C to 9°C, a fall of 6°C - the steepest downward slope on the graph.", frame },
        { label: "Day 1 to Day 2", correct: false, say: "That section is actually rising, from 17°C to 23°C - look for where the line slopes downward instead.", frame },
        { label: "Day 4 to Day 5", correct: false, say: "That section is rising too, from 9°C to 20°C. The steepest fall is the line just before it, Day 3 to Day 4.", frame },
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
          { question: "Start at −4 and add 5. Where do you land?", answer: "1: from −4, slide 5 steps right, crossing zero, to land on 1." },
          { question: "Start at −5 and add 4. Where do you land?", answer: "−1: from −5, slide 4 steps right - not quite enough to reach zero, so it lands on −1." },
        ]
      : definition.number === 3 && concept.id === "3.2"
      ? [
          { question: "Start at 4653. Add 3000, subtract 499, subtract 2486, then add 32. What is the answer?", answer: "4700: 4653 + 3000 = 7653, − 499 = 7154, − 2486 = 4668, + 32 = 4700." },
          { question: "Which rowers in Team Yellow (88 kg, 79 kg, 96 kg, 81 kg) have a total mass that is a multiple of ten?", answer: "Rower 2 and Rower 4: 79 + 81 = 160, a multiple of ten." },
        ]
      : definition.number === 3 && concept.id === "3.3"
        ? [
            { question: "Two spinning tops cost $16 together. What does one cost?", answer: "$8: 16 ÷ 2 = 8, since both spinning tops cost the same." },
            { question: "A spinning top and a toy car cost $20 together. The spinning top is $8. What does the toy car cost?", answer: "$12: 20 − 8 = 12, undoing the addition." },
          ]
        : definition.number === 3 && concept.id === "3.4"
          ? [
              { question: "Work out 19 × 5 by regrouping 19 as 20 − 1.", answer: "95: 19 × 5 = (20 × 5) − 5 = 100 − 5 = 95." },
              { question: "Work out 46 × 2 × 5 by grouping the last two factors first.", answer: "460: 2 × 5 = 10, so 46 × 2 × 5 = 46 × 10 = 460." },
            ]
          : definition.number === 3 && concept.id === "3.5"
            ? [
                { question: "Use the grid method to work out 34 × 13.", answer: "442: 30×10=300, 4×10=40, 30×3=90, 4×3=12, and 300+40+90+12=442." },
                { question: "Use the grid method to work out 27 × 12.", answer: "324: 20×10=200, 7×10=70, 20×2=40, 7×2=14, and 200+70+40+14=324." },
              ]
      : definition.number === 4 && concept.id === "4.1"
        ? [
            { question: "Guss walked to school in 0.5 hours. How many minutes is that?", answer: "30 minutes: 0.5 hours is half an hour, and half of 60 minutes is 30." },
            { question: "Is 0.5 hours the same as 5 minutes, 50 minutes, or 30 minutes?", answer: "30 minutes - both 5 and 50 minutes are common wrong guesses that ignore what the decimal point actually means." },
          ]
        : definition.number === 4 && concept.id === "4.2"
          ? [
              { question: "Find the time interval from 07:04 to 07:57.", answer: "53 minutes: 57 − 4 = 53, since both times are within the same hour." },
              { question: "Find the time interval from 07:57 to 08:04, jumping to the hour first.", answer: "7 minutes: +3 minutes to reach 08:00, then +4 more minutes to 08:04, so 3 + 4 = 7." },
            ]
      : definition.number === 5 && concept.id === "5.1"
        ? [
            { question: "Reading the bar chart, about how many visitors came in July?", answer: "About 520 - the bar reaches just above the 500 line." },
            { question: "Which two months had the closest number of visitors?", answer: "July and August (about 520 and 570) - their bars are the closest in height of any pair." },
          ]
        : definition.number === 5 && concept.id === "5.2"
          ? [
              { question: "How many of the 20 learners travel 1 km or less to school?", answer: "3: the 0-1 km bar has a frequency of 3." },
              { question: "What is the most common distance range for this class?", answer: "2-3 km and 4-5 km are tied as the most common, each with 5 learners." },
            ]
          : definition.number === 5 && concept.id === "5.3"
            ? [
                { question: "What was the maximum temperature on Day 2?", answer: "23°C, read directly from the table and the graph's second point." },
                { question: "Describe the overall trend of the temperature across the 6 days.", answer: "It rises, falls to a low point on Day 4 (9°C), then rises sharply to the highest point on Day 6 (26°C)." },
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

  const conceptSteps = definition.concepts.flatMap((concept, index) => {
    if (definition.number === 3 && concept.id === "3.1") {
      // Two contrasting worked examples, watched one at a time - real user
      // direction 2026-09-20: "-4+5 = 1 and -5+4 = -1 show these one by one
      // and make kids understand." The counter actually slides for each.
      const steps: ConceptStep[] = [
        {
          label: "3.1 · Start at −4, add 5",
          conceptId: concept.id,
          say: "Start at negative 4. Add 5 - watch the counter slide 5 steps right. Where does it land?",
          frame: {
            line: {
              min: -5, max: 9, step: 1,
              marks: [{ at: -4, label: "start −4", tone: "blue" }, { at: 0, label: "zero", tone: "gold" }, { at: 1, label: "finish 1", tone: "green" }],
              jumps: [{ from: -4, to: 1, label: "+5" }],
            },
          },
        },
        {
          label: "3.1 · Start at −5, add 4",
          conceptId: concept.id,
          say: "Now start at negative 5 instead and add 4. Same idea, different numbers - watch where it lands this time.",
          frame: {
            line: {
              min: -5, max: 9, step: 1,
              marks: [{ at: -5, label: "start −5", tone: "blue" }, { at: 0, label: "zero", tone: "gold" }, { at: -1, label: "finish −1", tone: "green" }],
              jumps: [{ from: -5, to: -1, label: "+4" }],
            },
          },
        },
        {
          label: "3.1 · Poster · below zero",
          conceptId: concept.id,
          say: "Here is the same idea on a thermometer. Zero sits in the middle - counting down from six by fives lands on one, then negative four, then negative nine, the same way you just watched on the counter.",
          frame: {
            image: {
              src: "/board-art/math7-decimals-negative.jpg",
              alt: "A thermometer and number line from -10 to 10, showing counting backwards by 5s from 6 to -9.",
              title: "Below zero",
              focus: { x: 74.5, y: 16, w: 25.5, h: 84 },
              hotspots: [
                { label: "Backwards 5", at: [80, 46], note: "6 minus 5 is 1 - still above zero.", tone: "gold" },
                { label: "Backwards 5", at: [86, 46], note: "1 minus 5 is negative 4 - now below zero.", tone: "red" },
                { label: "Backwards 5", at: [92, 46], note: "Negative 4 minus 5 is negative 9 - keep counting the same way.", tone: "red" },
              ],
            },
          },
        },
      ];
      return steps;
    }
    if (definition.number === 7 && concept.id === "7.1") {
      const step: ConceptStep = {
        label: "7.1 · Poster · tenths",
        conceptId: concept.id,
        say: "One piece of a chocolate bar split into ten equal parts is one tenth - we write that as 0.1. Ten of these pieces make one whole.",
        frame: {
          image: {
            src: "/board-art/math7-decimals-negative.jpg",
            alt: "A chocolate bar split into ten pieces, with one piece labelled 0.1.",
            title: "Tenths",
            focus: { x: 0, y: 16, w: 24.5, h: 84 },
            hotspots: [
              { label: "0.1", at: [19, 50], note: "One piece out of ten equal pieces is one tenth of the whole bar.", tone: "gold" },
            ],
          },
        },
      };
      return [step, { label: `${concept.id} · Tap and explain`, conceptId: concept.id, say: `Tap the highlighted part and explain what ${concept.title} is doing.`, frame: conceptFrame(definition, index) }];
    }
    if (definition.number === 7 && concept.id === "7.2") {
      const steps: ConceptStep[] = [
        {
          label: "7.2 · Poster · decompose 45.8",
          conceptId: concept.id,
          say: "45.8 breaks apart into its place value parts - 40 in the tens, 5 in the ones, and 0.8 in the tenths.",
          frame: {
            image: {
              src: "/board-art/math7-decimals-negative.jpg",
              alt: "45.8 broken into place value blocks: 40, 5, and 0.8.",
              title: "Decompose 45.8",
              focus: { x: 25.3, y: 16, w: 24, h: 84 },
              hotspots: [
                { label: "40", at: [32, 58], note: "Four tens.", tone: "blue" },
                { label: "5", at: [40, 58], note: "Five ones.", tone: "green" },
                { label: "0.8", at: [46, 68], note: "Eight tenths.", tone: "gold" },
              ],
            },
          },
        },
        {
          label: "7.2 · Poster · regroup 3.4",
          conceptId: concept.id,
          say: "3 wholes and 4 tenths can be regrouped: take one whole apart into ten tenths, leaving 2 wholes and 14 tenths - the same value, written differently.",
          frame: {
            image: {
              src: "/board-art/math7-decimals-negative.jpg",
              alt: "3.4 regrouped from 3 wholes and 4 tenths into 2 wholes and 14 tenths.",
              title: "Regroup 3.4",
              focus: { x: 50, y: 16, w: 24, h: 84 },
              hotspots: [
                { label: "3 wholes, 4 tenths", at: [57, 55], note: "The number as first written.", tone: "blue" },
                { label: "2 wholes, 14 tenths", at: [68, 58], note: "The same value - one whole regrouped into ten more tenths.", tone: "green" },
              ],
            },
          },
        },
      ];
      return steps;
    }
    if (definition.number === 12 && ["12.1", "12.2", "12.3", "12.4"].includes(concept.id)) {
      const panel: Record<string, { focus: { x: number; y: number; w: number; h: number }; hotspots: { label: string; at: [number, number]; note: string; tone?: "blue" | "gold" | "green" | "red" }[] }> = {
        "12.1": {
          focus: { x: 0, y: 6, w: 49, h: 42 },
          hotspots: [{ label: "12 cm × 2 + 4 cm × 2", at: [25, 46], note: "Add all four side lengths: 12 + 4 + 12 + 4 = 32 cm.", tone: "gold" }],
        },
        "12.2": {
          focus: { x: 51, y: 6, w: 49, h: 42 },
          hotspots: [{ label: "length × width", at: [75, 46], note: "A 12 cm by 4 cm rectangle covers 12 × 4 = 48 square units.", tone: "green" }],
        },
        "12.3": {
          focus: { x: 0, y: 50, w: 49, h: 47 },
          hotspots: [{ label: "the cube net", at: [25, 74], note: "Six matching square faces fold until edges meet to form a closed cube.", tone: "gold" }],
        },
        "12.4": {
          focus: { x: 51, y: 50, w: 49, h: 47 },
          hotspots: [
            { label: "Face", at: [78, 60], note: "A flat surface of a 3D shape.", tone: "blue" },
            { label: "Edge", at: [58, 66], note: "The line where two faces of a solid meet.", tone: "gold" },
            { label: "Vertex", at: [79, 79], note: "A corner point where edges meet.", tone: "green" },
          ],
        },
      };
      const p = panel[concept.id];
      const step: ConceptStep = {
        label: `${concept.id} · Poster`,
        conceptId: concept.id,
        say: concept.summary,
        frame: {
          image: {
            src: "/board-art/math12-perimeter-area-3d.jpg",
            alt: "A four-panel poster covering perimeter, area of a rectangle, folding a cube net, and the parts of a 3D shape.",
            title: concept.title,
            focus: p.focus,
            hotspots: p.hotspots,
          },
        },
      };
      return [step, { label: `${concept.id} · Tap and explain`, conceptId: concept.id, say: `Tap the highlighted part and explain what ${concept.title} is doing.`, frame: conceptFrame(definition, index) }];
    }
    return [
      { label: `${concept.id} · Meet the idea`, conceptId: concept.id, say: concept.summary, frame: conceptFrame(definition, index) },
      { label: `${concept.id} · Tap and explain`, conceptId: concept.id, say: `Tap the highlighted part and explain what ${concept.title} is doing.`, frame: conceptFrame(definition, index) },
    ];
  });
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
    recitePrompts: concepts.flatMap((concept) => {
      const rule = { ask: `Say the rule for ${concept.title}.`, answer: concept.summary, conceptId: concept.conceptId };
      // Recite tests transfer, not memory of the exact example just watched -
      // real user direction 2026-09-20: "recite can have different example
      // ... practise them with more at each stage so they are well trained."
      if (definition.number === 3 && concept.conceptId === "3.1") {
        return [
          rule,
          { ask: "Start at −2 and add 7. Where do you land?", answer: "5: from −2, slide 7 steps right, crossing zero, to land on 5.", conceptId: concept.conceptId },
          { ask: "Start at −6 and add 8. Where do you land?", answer: "2: from −6, slide 8 steps right, crossing zero, to land on 2.", conceptId: concept.conceptId },
        ];
      }
      if (definition.number === 5 && concept.conceptId === "5.1") {
        return [
          rule,
          { ask: "Looking at the bar chart, which month had the fewest visitors?", answer: "March, with about 50 visitors - the shortest bar on the chart.", conceptId: concept.conceptId },
        ];
      }
      if (definition.number === 5 && concept.conceptId === "5.2") {
        return [
          rule,
          { ask: "How many of the 20 learners travel more than 3 km to school?", answer: "10: add the 3-4 km (3), 4-5 km (5) and 5-6 km (2) bars - 3 + 5 + 2 = 10.", conceptId: concept.conceptId },
        ];
      }
      if (definition.number === 5 && concept.conceptId === "5.3") {
        return [
          rule,
          { ask: "Between which two days did the temperature rise the most?", answer: "Day 4 to Day 6: it climbs from 9°C to 26°C, a rise of 17°C - the biggest change on the whole graph.", conceptId: concept.conceptId },
        ];
      }
      if (definition.number === 4 && concept.conceptId === "4.1") {
        return [
          rule,
          { ask: "A film lasts 0.75 hours. How many minutes is that?", answer: "45 minutes: 0.75 is three-quarters, and three-quarters of 60 minutes is 45.", conceptId: concept.conceptId },
        ];
      }
      if (definition.number === 4 && concept.conceptId === "4.2") {
        return [
          rule,
          { ask: "Music Special starts at 11:05 and News starts at 12:30. How long is Music Special?", answer: "85 minutes (1 hour 25 minutes): jump 11:05 to 12:00 is 55 minutes, then 12:00 to 12:30 is 30 more - 55 + 30 = 85.", conceptId: concept.conceptId },
        ];
      }
      if (definition.number === 3 && concept.conceptId === "3.2") {
        return [
          rule,
          { ask: "Start at 3826. Add 174, then subtract 500. What do you land on?", answer: "3500: 3826 + 174 = 4000, then 4000 − 500 = 3500.", conceptId: concept.conceptId },
        ];
      }
      if (definition.number === 3 && concept.conceptId === "3.3") {
        return [
          rule,
          { ask: "A book and a pencil cost $15 together. The pencil costs $3. What does the book cost?", answer: "$12: undo the addition, 15 − 3 = 12.", conceptId: concept.conceptId },
        ];
      }
      if (definition.number === 3 && concept.conceptId === "3.4") {
        return [
          rule,
          { ask: "Work out 18 × 5 by regrouping 18 as 20 − 2.", answer: "90: 18 × 5 = (20 × 5) − (2 × 5) = 100 − 10 = 90.", conceptId: concept.conceptId },
        ];
      }
      if (definition.number === 3 && concept.conceptId === "3.5") {
        return [
          rule,
          { ask: "Use the grid method to work out 23 × 14.", answer: "322: 20×10=200, 3×10=30, 20×4=80, 3×4=12, and 200+30+80+12=322.", conceptId: concept.conceptId },
        ];
      }
      return concept.examples[0]
        ? [rule, { ask: `Recite this worked example: ${concept.examples[0].question}`, answer: concept.examples[0].answer, conceptId: concept.conceptId }]
        : [rule];
    }),
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
