import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 4 (Time)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-4.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_4_INK: InkUnit = {
  unitKey: "cambridge-4-math-4",
  title: "Time",
  badge: "Grade 4 · Unit 4",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "4.1",
      title: "⏱️ Decimals of time",
      scenes: [
        {
          label: "1. Decimals of time",
          say: "Connect decimal hours and days to minutes and hours.",
          ops: [
            { type: "text", value: "⏱️ Decimals of time", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Connect decimal hours and days to minutes and hours.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 1 · Meet the idea",
          say: "Connect decimal hours and days to minutes and hours.",
          ops: [
            { type: "text", value: "1 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 60\n0 = start\n30 = finish: 30 min\njump: 0 -> 30 (0.5 hours)", labelSize: 20 },
          ],
        },
        {
          label: "3. 1 · Tap and explain",
          say: "Tap the highlighted part and explain what Decimals of time is doing.",
          ops: [
            { type: "text", value: "1 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 60\n0 = start\n30 = finish: 30 min\njump: 0 -> 30 (0.5 hours)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Guss walked to school in 0.5 hours. How many minutes is that?\n2. Is 0.5 hours the same as 5 minutes, 50 minutes, or 30 minutes?", labelSize: 18 },
            { type: "text", value: "1) 30 minutes: 0.5 hours is half an hour, and half of 60 minutes is 30.\n2) 30 minutes - both 5 and 50 minutes are common wrong guesses that ignore what the decimal point actually means.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Decimals of time. Connect decimal hours and days to minutes and hours.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Decimals of time.\n\nConnect decimal hours and days to minutes and hours.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "4.1-q1", prompt: "Milo cycled to the park in 0.25 hours. Drag the marker to how many minutes that is.", options: ["15","not 15"], correctIndex: 0, explanation: "Yes - 15 minutes. 0.25 is a quarter, and a quarter of 60 minutes is 15." },
      ],
    },

    {
      topicId: "4.2",
      title: "🕒 Time intervals",
      scenes: [
        {
          label: "1. Time intervals",
          say: "Find elapsed time by jumping to the next hour, then to the finish.",
          ops: [
            { type: "text", value: "🕒 Time intervals", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 158, color: "#0369a1", label: "Find elapsed time by jumping to the next hour, then to the finish.\nTap the board, talk through the example, then check your thinking.", labelSize: 20 },
          ],
        },
        {
          label: "2. 2 · Meet the idea",
          say: "Find elapsed time by jumping to the next hour, then to the finish.",
          ops: [
            { type: "text", value: "2 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n0 = start 07:57\n3 = 08:00\n7 = finish 08:04\njump: 0 -> 3 (+3 min)\njump: 3 -> 7 (+4 min)", labelSize: 20 },
          ],
        },
        {
          label: "3. 2 · Tap and explain",
          say: "Tap the highlighted part and explain what Time intervals is doing.",
          ops: [
            { type: "text", value: "2 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 10\n0 = start 07:57\n3 = 08:00\n7 = finish 08:04\njump: 0 -> 3 (+3 min)\njump: 3 -> 7 (+4 min)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Find the time interval from 07:04 to 07:57.\n2. Find the time interval from 07:57 to 08:04, jumping to the hour first.", labelSize: 18 },
            { type: "text", value: "1) 53 minutes: 57 − 4 = 53, since both times are within the same hour.\n2) 7 minutes: +3 minutes to reach 08:00, then +4 more minutes to 08:04, so 3 + 4 = 7.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Time intervals. Find elapsed time by jumping to the next hour, then to the finish.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Time intervals.\n\nFind elapsed time by jumping to the next hour, then to the finish.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "4.2-q1", prompt: "Garden World starts at 09:45. Cartoons starts at 10:35. How long is Garden World?", options: ["50 minutes","90 minutes","45 minutes"], correctIndex: 0, explanation: "Correct. Jump to the hour first: 09:45 to 10:00 is 15 minutes, then 10:00 to 10:35 is 35 more - 15 + 35 = 50." },
      ],
    },
  ],
};
