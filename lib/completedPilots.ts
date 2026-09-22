/**
 * Concepts that have the full animated template - watch it move, give them
 * the ball, diagnosed wrong answers, varied recite - not just the generic
 * Board scaffold every unit gets by default.
 *
 * Hand-maintained on purpose: this is a short, curated "what's actually
 * finished" list for one reviewer to jump straight to, not a computed
 * status derived from the unit data. Add one line here each time a concept
 * gets the full treatment.
 */
export type CompletedPilot = {
  unitKey: string;
  unitTitle: string;
  conceptId: string;
  conceptTitle: string;
  subject: "Math" | "English" | "Science";
  addedOn: string;
};

export const COMPLETED_PILOTS: CompletedPilot[] = [
  {
    unitKey: "cambridge-4-math-3",
    unitTitle: "Grade 4 Math · Unit 3 Calculation",
    conceptId: "3.1",
    conceptTitle: "Calculating with negative numbers",
    subject: "Math",
    addedOn: "2026-09-20",
  },
  {
    unitKey: "cambridge-5-english-1",
    unitTitle: "Grade 5 English · Unit 1",
    conceptId: "1.9",
    conceptTitle: "Sentence types: simple, compound, complex",
    subject: "English",
    addedOn: "2026-09-21",
  },
  {
    unitKey: "tamilnadustateboard-9-science-4",
    unitTitle: "TN Grade 9 Science · Unit 4 Electric charge and current",
    conceptId: "4.4",
    conceptTitle: "Circuit diagrams: series and parallel",
    subject: "Science",
    addedOn: "2026-09-21",
  },
];
