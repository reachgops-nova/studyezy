import type { NumberSceneSpec } from "@/components/interactive/NumberConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 7
// (Number - decimals, rounding, place-value shifting, linear sequences)
// reuses NumberConceptScene's existing placeValueChart/regroup/numberLine/
// digitShift/sequenceSteps variants - the same shapes proven on Unit 1,
// no new scene component needed. Every value below is grounded in this
// unit's real, production content (fetched via railway ssh), never invented.
export const UNIT7_CONCEPT_SCENES: Record<string, NumberSceneSpec[]> = {
  "7.1": [
    {
      type: "placeValueChart",
      columns: ["Ones", ".", "Tenths", "Hundredths"],
      values: [1, ".", 2, 5],
      caption: "In 1.25, the 1 is one whole, the 2 means two tenths, and the 5 means five hundredths",
    },
    {
      type: "equationSolve",
      equation: "45 cm",
      operation: "as a decimal of a metre",
      answer: "0.45 m",
      caption: "A strip of ribbon that measures 45 centimetres can be written as 0.45 metres",
    },
    {
      type: "equationSolve",
      equation: "10 hundredths",
      operation: "ten times smaller",
      answer: "1 tenth",
      caption: "A hundredth is ten times smaller than a tenth, so ten hundredths make one tenth",
    },
    {
      type: "equationSolve",
      equation: "3.48",
      operation: "say each digit separately",
      answer: "three point four eight",
      caption: "Always say the digits after the decimal point one by one, not as a whole number",
    },
  ],
  "7.2": [
    {
      type: "equationSolve",
      equation: "23.45",
      operation: "decompose",
      answer: "20 + 3 + 0.4 + 0.05",
      caption: "Decomposing means breaking a decimal into its standard place value parts",
    },
    {
      type: "equationSolve",
      equation: "4.3",
      operation: "regroup",
      answer: "3 ones and 13 tenths",
      caption: "Regrouping lets you trade one whole for ten tenths without changing the total size",
    },
    {
      type: "regroup",
      from: "1 one",
      to: "10 tenths",
      caption: "Whenever you trade one unit to the right on a place value chart, it splits into ten smaller pieces",
    },
    {
      type: "equationSolve",
      equation: "1.5",
      operation: "10 tenths + 5 tenths",
      answer: "15 tenths",
      caption: "One whole is ten tenths, plus five more tenths gives fifteen tenths altogether",
    },
  ],
  "7.3": [
    {
      type: "numberLine",
      from: 4,
      to: 5,
      marker: 5,
      caption: "4.8 lies between 4 and 5; because 8 tenths is past halfway, it rounds up to 5",
    },
    {
      type: "numberLine",
      from: 9,
      to: 10,
      marker: 9,
      caption: "9.3 has 3 tenths, which is less than halfway, so it rounds down to 9",
    },
    {
      type: "equationSolve",
      equation: "tenths digit",
      operation: "5 or more rounds up, 4 or less rounds down",
      answer: "",
      caption: "Look closely at the tenths digit to decide whether to round down or up",
    },
    {
      type: "numberLine",
      from: 6,
      to: 7,
      marker: 7,
      caption: "6.5 has exactly five tenths - right on the halfway mark - so by rule we round up to 7",
    },
  ],
  "7.4": [
    {
      type: "digitShift",
      before: "5.38",
      after: "53.8",
      direction: "left",
      places: 1,
      caption: "Multiplying by 10 shifts all digits one place to the left, making the number ten times larger",
    },
    {
      type: "digitShift",
      before: "5.38",
      after: "538",
      direction: "left",
      places: 2,
      caption: "Multiplying by 100 shifts all digits two places to the left, making the number 100 times larger",
    },
    {
      type: "digitShift",
      before: "48",
      after: "4.8",
      direction: "right",
      places: 1,
      caption: "Dividing by 10 shifts the digits one place to the right, making the number ten times smaller",
    },
    {
      type: "digitShift",
      before: "7",
      after: "0.07",
      direction: "right",
      places: 2,
      caption: "Dividing 7 by 100 moves it two places right into the hundredths column, giving 0.07",
    },
  ],
  "7.5": [
    {
      type: "sequenceSteps",
      terms: [18, 22, 26, 30],
      rule: "+4",
      caption: "In the sequence 18, 22, 26, 30, the rule is to add 4 each time",
    },
    {
      type: "sequenceSteps",
      terms: [30, 26, 22, 18],
      rule: "-4",
      caption: "Starting at 30 and dropping to 18 across 3 equal steps, each jump subtracts 4",
    },
    {
      type: "sequenceSteps",
      terms: [18, "", 26, ""],
      rule: "constant difference",
      caption: "Find the overall difference and divide by the number of steps to find a missing term",
    },
    {
      type: "sequenceSteps",
      terms: [18, 22, 26, 30],
      rule: "check the jump",
      caption: "Check the jump between any two side-by-side numbers - in a linear sequence, that jump never changes!",
    },
  ],
};
