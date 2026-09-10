import type { StatisticsSceneSpec } from "@/components/interactive/StatisticsConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 5
// (Statistical methods) - every value below is grounded in this unit's
// real, production content (fetched via railway ssh), never invented.
export const UNIT5_CONCEPT_SCENES: Record<string, StatisticsSceneSpec[]> = {
  "5.1": [
    {
      type: "barChart",
      labels: ["Jan", "Feb"],
      values: [20, 30],
      caption: "A bar chart shows exact totals with distinct bars - 20 people cycled to work in January, 30 in February",
    },
    {
      type: "dotPlot",
      labels: ["Apr", "May", "Jun", "Jul"],
      counts: [2, 3, 4, 5],
      caption: "A dot plot lets you easily spot that sunnier days increase as summer approaches",
    },
    {
      type: "barChart",
      labels: ["Mar", "Apr"],
      values: [8, 10],
      caption: "The bar for April is 2 units taller than March - March had 8 units, so April has 10",
    },
    {
      type: "dotPlot",
      labels: ["Jun", "Jul"],
      counts: [12, 12],
      caption: "Bars are great for comparing exact totals, while dots help you see the shape of the trend",
    },
  ],
  "5.2": [
    {
      type: "frequencyChart",
      intervals: ["0-1km", "1-2km", "2-3km"],
      values: [6, 12, 4],
      caption: "Data is organized into equal ranges, such as how far learners travel to school",
    },
    {
      type: "frequencyChart",
      intervals: ["100-150g", "150-200g", "200-250g"],
      values: [8, 15, 5],
      caption: "Counting how many apples in a harvest weigh between 100 and 150 grams, and so on",
    },
    {
      type: "frequencyChart",
      intervals: ["5-10", "10-15", "15-20"],
      values: [8, 12, 6],
      caption: "No gaps between bars when the numbers flow smoothly from one range into the next!",
    },
    {
      type: "frequencyChart",
      intervals: ["3-5km", "5-7km"],
      values: [12, 7],
      caption: "Frequency tells us how many individuals or items fall within each specific range",
    },
  ],
  "5.3": [
    {
      type: "lineGraph",
      xLabels: ["1pm", "2pm", "3pm"],
      values: [100, 150, 200],
      unit: "m",
      highlightIndex: 1,
      caption: "Tracking a hot air balloon's altitude every hour lets us estimate values in between, like 175m at 2:30pm",
    },
    {
      type: "lineGraph",
      xLabels: ["2pm", "3pm", "4pm"],
      values: [20, 22.5, 25],
      unit: "°C",
      highlightIndex: 1,
      caption: "Recording hourly temperatures shows the trend - 20°C at 2pm and 25°C at 4pm means about 22.5°C at 3pm",
    },
    {
      type: "lineGraph",
      xLabels: ["Start", "2hr", "4hr"],
      values: [0.5, 1, 1.5],
      unit: "L",
      highlightIndex: 1,
      caption: "The water level rose from 0.5L to 1.5L over 4 hours, reaching about 1L after 2 hours",
    },
    {
      type: "lineGraph",
      xLabels: ["6am", "7am", "8am", "9am", "10am"],
      values: [10, 12, 15, 17, 20],
      unit: "°C",
      caption: "If you are tracking changes that flow steadily over time, connect the dots with a line graph!",
    },
  ],
};
