import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 18 (Time and world time zones)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-18.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_18_INK: InkUnit = {
  unitKey: "cambridge-4-math-18",
  title: "Time and world time zones",
  badge: "Grade 4 · Unit 18",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "18.1",
      title: "🌍 World time zones",
      scenes: [
        {
          label: "1. World time zones",
          say: "Add or subtract hours as you move east or west around the world.",
          ops: [
            { type: "text", value: "🌍 World time zones", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "The world is divided into 24 hourly time zones.\nEast is ahead: add hours. West is behind: subtract hours.\nSubtracting across midnight can move the date to the previous day.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. 12:00 noon in Lagos; Delhi is 5 hours east. Find Delhi time.\n2. 7:00 am on 13 July in Sydney; another city is 14 hours behind. Find its local time.", labelSize: 18 },
            { type: "text", value: "1) 17:00 (5:00 pm), because 12:00 + 5 hours = 17:00.\n2) 5:00 pm on 12 July: subtract 14 hours and cross into the previous day.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "3. 💡 Remember this",
          say: "Say the rule for World time zones. Add or subtract hours as you move east or west around the world.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for World time zones.\n\nAdd or subtract hours as you move east or west around the world.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "18.1-q1", prompt: "It is 12:00 noon in Lagos. Delhi is 5 hours east. What time is it in Delhi?", options: ["17:00 (5:00 pm)","07:00 (7:00 am)","12:00 noon"], correctIndex: 0, explanation: "Correct. East is ahead, so add 5 hours: 12:00 + 5 = 17:00." },
      ],
    },

    {
      topicId: "18.2",
      title: "🕒 Start and end times",
      scenes: [
        {
          label: "1. Start and end times",
          say: "Use jumps through the hour to find an ending time or duration.",
          ops: [
            { type: "text", value: "🕒 Start and end times", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "To find an end time, add the duration and work forward.\nJump to the next round hour first, then add the remaining minutes.\nTo find a start time, subtract the duration and work backward.", labelSize: 20 },
          ],
        },
        {
          label: "2. 2 · Meet the idea",
          say: "Use jumps through the hour to find an ending time or duration.",
          ops: [
            { type: "text", value: "2 · Meet the idea", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 90\n0 = 11:20 start\n40 = 12:00\n45 = 12:05 finish\njump: 0 -> 40 (+40 min)\njump: 40 -> 45 (+5 min)", labelSize: 20 },
          ],
        },
        {
          label: "3. 2 · Tap and explain",
          say: "Tap the highlighted part and explain what Start and end times is doing.",
          ops: [
            { type: "text", value: "2 · Tap and explain", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 200, color: "#0ea5e9", label: "Number line: 0 to 90\n0 = 11:20 start\n40 = 12:00\n45 = 12:05 finish\njump: 0 -> 40 (+40 min)\njump: 40 -> 45 (+5 min)", labelSize: 20 },
          ],
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. A show starts at 11:20 am and lasts 45 minutes.\n2. A film finishes at 8:15 pm and lasts 90 minutes.", labelSize: 18 },
            { type: "text", value: "1) 12:05 pm: +40 minutes reaches 12:00, then +5 minutes.\n2) 6:45 pm: subtract 60 minutes to 7:15, then 30 minutes.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "Say the rule for Start and end times. Use jumps through the hour to find an ending time or duration.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Say the rule for Start and end times.\n\nUse jumps through the hour to find an ending time or duration.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "18.2-q1", prompt: "A show starts at 11:20 am and lasts 45 minutes. What time does it finish?", options: ["12:05 pm","11:65 am","10:35 am"], correctIndex: 0, explanation: "Correct. Jump 40 minutes to 12:00, then 5 more minutes to 12:05." },
      ],
    },
  ],
};
