import type { NumberSceneSpec } from "@/components/interactive/NumberConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 4
// (Time) reuses NumberConceptScene's existing expressionSteps variant for
// both concepts - time-of-day values (07:57, 08:04) and decimal-to-minutes
// conversions read naturally as step chains, so no new scene component was
// needed. Every value below is grounded in this unit's real, production
// content (fetched via railway ssh), never invented.
export const UNIT4_CONCEPT_SCENES: Record<string, NumberSceneSpec[]> = {
  "4.1": [
    {
      type: "expressionSteps",
      steps: ["0.5 hours", "1/2 of 60 minutes", "30 minutes"],
      caption: "A decimal like 0.5 means half of whatever unit you're using - here, half of the 60 minutes in an hour",
    },
    {
      type: "expressionSteps",
      steps: ["1.5 hours", "1 hour + 0.5 hours", "60 + 30 minutes", "90 minutes total"],
      caption: "1.5 hours is 1 hour and 30 minutes, which is 90 minutes in total",
    },
    {
      type: "expressionSteps",
      steps: ["0.5 days", "1/2 of 24 hours", "12 hours"],
      caption: "To convert days written as decimals into hours, multiply the decimal amount by 24",
    },
    {
      type: "expressionSteps",
      steps: ["0.5 hours", "1/2 of 60 = 30", "NOT 50!"],
      caption: "Always remember that an hour has 60 minutes, so 0.5 means half of 60, not 50",
    },
  ],
  "4.2": [
    {
      type: "expressionSteps",
      steps: ["07:57", "+3 min → 08:00", "+4 min → 08:04", "Total: 7 minutes"],
      caption: "Jump to the next whole hour first, then add the remaining minutes",
    },
    {
      type: "expressionSteps",
      steps: ["09:45", "+15 min → 10:00", "+35 min → 10:35", "Total: 50 minutes"],
      caption: "A television program from 09:45 to 10:35 lasts 50 minutes in total",
    },
    {
      type: "expressionSteps",
      steps: ["Start time", "Jump to next o'clock", "Jump to finish time", "Add the jumps"],
      caption: "A number line helps you break a time calculation into easy jumps",
    },
    {
      type: "expressionSteps",
      steps: ["Bridge through the o'clock mark"],
      caption: "Jump to the next whole hour first - bridging through the o'clock mark makes counting minutes simple",
    },
  ],
};
