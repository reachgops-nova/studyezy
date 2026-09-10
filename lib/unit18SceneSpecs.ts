import type { NumberSceneSpec } from "@/components/interactive/NumberConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 18
// (Time: world time zones, start/end times) reuses NumberConceptScene's
// existing equationSolve/numberLine variants - the same shapes proven on
// Units 1, 3, 7, and 9, no new scene component needed. Every value below
// is grounded in this unit's real, production content (fetched via
// railway ssh), never invented.
export const UNIT18_CONCEPT_SCENES: Record<string, NumberSceneSpec[]> = {
  "18.1": [
    {
      type: "equationSolve",
      equation: "12:00 noon Lagos, +5h Delhi",
      operation: "12:00 + 5 hours",
      answer: "17:00 (5:00pm) in Delhi",
      caption: "If it is 12:00 noon in Lagos and Delhi is 5 hours ahead, you add 5 hours to find that it is 17:00, or 5:00 p.m., in Delhi",
    },
    {
      type: "equationSolve",
      equation: "7:00am 13 July Sydney, -14h",
      operation: "7:00 - 14 hours",
      answer: "5:00pm on 12 July",
      caption: "If it is 7:00 a.m. on 13 July in Sydney, a city that is 14 hours behind is still at 5:00 p.m. on 12 July",
    },
    {
      type: "equationSolve",
      equation: "24 time zones",
      operation: "around the Earth",
      answer: "same local clock time",
      caption: "The world is divided into 24 hourly time zones",
    },
    {
      type: "equationSolve",
      equation: "East = ahead (add)",
      operation: "West = behind (subtract)",
      answer: "memory rule",
      caption: "Remember: East is ahead, West is behind. Add hours as you move east and subtract hours as you move west",
    },
  ],
  "18.2": [
    {
      type: "numberLine",
      from: 0,
      to: 45,
      marker: 45,
      path: [40, 45],
      caption: "A show lasts 45 minutes and starts at 11:20. Jump 40 minutes to reach 12:00, then 5 more minutes to find the end time is 12:05",
    },
    {
      type: "numberLine",
      from: 0,
      to: 90,
      marker: 90,
      path: [60, 90],
      caption: "A film finishes at 8:15 p.m. and lasts 90 minutes. Counting back 60 minutes gives 7:15 p.m., and back another 30 minutes gives the start time of 6:45 p.m.",
    },
    {
      type: "equationSolve",
      equation: "end time",
      operation: "start time + duration",
      answer: "work forward",
      caption: "To calculate an end time, start with the beginning time and add the duration",
    },
    {
      type: "equationSolve",
      equation: "start time",
      operation: "finish time - duration",
      answer: "work backward",
      caption: "To calculate a start time, work backwards from the finish time and subtract the duration",
    },
  ],
};
