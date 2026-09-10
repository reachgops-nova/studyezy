import type { NumberSceneSpec } from "@/components/interactive/NumberConceptScene";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." Math Unit 13
// (Number: square/triangular numbers, divisibility, prime/composite)
// adds a new dotArray variant to NumberConceptScene.tsx (rows of dots -
// a square grid or a growing triangle) since nothing existing shows that
// shape; divisibility and prime/composite reuse the proven equationSolve
// shape. Every value below is grounded in this unit's real, production
// content (fetched via railway ssh), never invented.
export const UNIT13_CONCEPT_SCENES: Record<string, NumberSceneSpec[]> = {
  "13.1": [
    {
      type: "dotArray",
      rows: [4, 4, 4, 4],
      caption: "Four times four equals sixteen, arranged as a perfect 4x4 square of dots",
    },
    {
      type: "equationSolve",
      equation: "1 + 3 + 5",
      operation: "sum of the first 3 odd numbers",
      answer: "9 = 3 squared",
      caption: "You can also build square numbers by adding consecutive odd numbers starting from one",
    },
    {
      type: "equationSolve",
      equation: "5 x 5",
      operation: "identical factor pair",
      answer: "25",
      caption: "A square number has an identical factor pair, such as five and five for twenty-five",
    },
    {
      type: "equationSolve",
      equation: "n squared",
      operation: "n x n",
      answer: "a square number",
      caption: "You can write a square number using an exponent of two, like three squared, which means three times three",
    },
  ],
  "13.2": [
    {
      type: "dotArray",
      rows: [1, 2, 3],
      caption: "One plus two plus three equals six, the third triangular number, arranged as a growing triangle of dots",
    },
    {
      type: "dotArray",
      rows: [1, 2, 3, 4],
      caption: "One plus two plus three plus four equals ten, making ten the fourth triangular number",
    },
    {
      type: "equationSolve",
      equation: "3 + 6",
      operation: "two consecutive triangular numbers",
      answer: "9 (a square number)",
      caption: "Adding any two consecutive triangular numbers together, like three and six, gives a square number, like nine",
    },
    {
      type: "equationSolve",
      equation: "each new row",
      operation: "one more than the row above",
      answer: "the next triangular number",
      caption: "Each new triangular number adds another row that has one more item than the row above it",
    },
  ],
  "13.3": [
    {
      type: "equationSolve",
      equation: "536",
      operation: "last 2 digits: 36 / 4",
      answer: "divisible by 4",
      caption: "The number 536 ends in thirty-six, and since thirty-six divides by four, 536 is divisible by four",
    },
    {
      type: "equationSolve",
      equation: "1,200",
      operation: "last 3 digits: 200 / 8",
      answer: "divisible by 8 (= 25)",
      caption: "The number 1,200 is divisible by eight because its last three digits, two hundred, divide evenly by eight to make twenty-five",
    },
    {
      type: "equationSolve",
      equation: "last digit 0, 2, 4, 6, 8",
      operation: "an even final digit",
      answer: "divisible by 2",
      caption: "A number is divisible by two if its final digit is even: zero, two, four, six, or eight",
    },
    {
      type: "equationSolve",
      equation: "1 digit / 2 digits / 3 digits",
      operation: "for 2 / 4 / 8",
      answer: "quick divisibility check",
      caption: "Look at one digit for two, two digits for four, and three digits for eight!",
    },
  ],
  "13.4": [
    {
      type: "equationSolve",
      equation: "7",
      operation: "only 1 x 7 = 7",
      answer: "prime",
      caption: "Seven is prime because only one times seven equals seven",
    },
    {
      type: "equationSolve",
      equation: "9",
      operation: "divides by 1, 3, and 9",
      answer: "composite",
      caption: "Nine is composite because it can be divided evenly by one, three, and nine",
    },
    {
      type: "equationSolve",
      equation: "1",
      operation: "only one divisor",
      answer: "neither prime nor composite",
      caption: "The number one is neither prime nor composite because it only has one divisor",
    },
    {
      type: "equationSolve",
      equation: "2",
      operation: "the smallest prime",
      answer: "the only even prime number",
      caption: "Two is the smallest prime number and the only even prime number",
    },
  ],
};
