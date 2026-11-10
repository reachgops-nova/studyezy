import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 5 (Statistical methods)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-5.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_5_INK: InkUnit = {
  unitKey: "cambridge-4-math-5",
  title: "Statistical methods",
  badge: "Grade 4 · Unit 5",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "5.1",
      title: "📊 Bar charts and dot plots",
      scenes: [
        {
          label: "1. Bar charts and dot plots",
          say: "Read exact totals and compare groups in a chart.",
          ops: [
            { type: "text", value: "📊 Bar charts and dot plots", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Read exact totals and compare groups in a chart.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Reading the bar chart, about how many visitors came in July?\n2. Which two months had the closest number of visitors?", labelSize: 18 },
            { type: "text", value: "1) About 520 - the bar reaches just above the 500 line.\n2) July and August (about 520 and 570) - their bars are the closest in height of any pair.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Bar charts and dot plots. Read exact totals and compare groups in a chart.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Bar charts and dot plots.\n\nRead exact totals and compare groups in a chart.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "5.1-q1", prompt: "Looking at the bar chart, which month had about 200 visitors?", options: ["May","March","June"], correctIndex: 0, explanation: "Correct. May's bar sits right around the 200 line - lower than April's, even though April comes first." },
      ],
    },

    {
      topicId: "5.2",
      title: "📋 Frequency charts",
      scenes: [
        {
          label: "1. Frequency charts",
          say: "Count how many values fall into each interval.",
          ops: [
            { type: "text", value: "📋 Frequency charts", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Count how many values fall into each interval.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. How many of the 20 learners travel 1 km or less to school?\n2. What is the most common distance range for this class?", labelSize: 18 },
            { type: "text", value: "1) 3: the 0-1 km bar has a frequency of 3.\n2) 2-3 km and 4-5 km are tied as the most common, each with 5 learners.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Frequency charts. Count how many values fall into each interval.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Frequency charts.\n\nCount how many values fall into each interval.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "5.2-q1", prompt: "Using the frequency chart, how many learners travel between 3 km and 5 km to school?", options: ["8","5","20"], correctIndex: 0, explanation: "Correct. Add the 3-4 km bar (3) and the 4-5 km bar (5): 3 + 5 = 8." },
      ],
    },

    {
      topicId: "5.3",
      title: "📈 Line graphs",
      scenes: [
        {
          label: "1. Line graphs",
          say: "Track change over time and describe the trend.",
          ops: [
            { type: "text", value: "📈 Line graphs", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Track change over time and describe the trend.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What was the maximum temperature on Day 2?\n2. Describe the overall trend of the temperature across the 6 days.", labelSize: 18 },
            { type: "text", value: "1) 23°C, read directly from the table and the graph's second point.\n2) It rises, falls to a low point on Day 4 (9°C), then rises sharply to the highest point on Day 6 (26°C).", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for Line graphs. Track change over time and describe the trend.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Line graphs.\n\nTrack change over time and describe the trend.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "5.3-q1", prompt: "Looking at the temperature line graph, between which two days did the temperature fall the most?", options: ["Day 3 to Day 4","Day 1 to Day 2","Day 4 to Day 5"], correctIndex: 0, explanation: "Correct. The line drops from 15°C to 9°C, a fall of 6°C - the steepest downward slope on the graph." },
      ],
    },
  ],
};
