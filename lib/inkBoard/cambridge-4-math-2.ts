import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Maths Stage 4, Unit 2 (Angles and shapes)
 * - mechanically generated 2026-11-10 from the already-vetted, real
 * content in lib/boardUnits/cambridge-4-math-2.ts (same concepts, key points,
 * worked examples, quick checks/guided tasks/assessment questions and
 * recite prompts), per real user direction: "can you change the entire
 * science and math cambridge 4th grade books into this format".
 */
export const CAMBRIDGE_4_MATH_2_INK: InkUnit = {
  unitKey: "cambridge-4-math-2",
  title: "Angles and shapes",
  badge: "Grade 4 · Unit 2",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "2.1",
      title: "🪞 Symmetrical patterns",
      scenes: [
        {
          label: "1. Symmetrical patterns",
          say: "A line of symmetry is a mirror line: every square on one side has a matching square the same distance away on the other.",
          ops: [
            { type: "text", value: "🪞 Symmetrical patterns", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Lines of symmetry can be horizontal and vertical. The book's point on page 21 is that they can also be diagonal.\nDistance is what matters. A square three across from the mirror line reflects to three across on the other side.\nA pattern can have more than one line of symmetry - the book's worked example ends up with two.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Name the three directions a line of symmetry can run, according to page 21.\n2. A square sits 2 to the left of a vertical mirror line. Where does its reflection go?\n3. How would you check a finished pattern really is symmetrical?", labelSize: 18 },
            { type: "text", value: "1) Horizontal, vertical and diagonal. (page 21)\n2) 2 to the right of the line, on the same row.\n3) Fold it along the line, or measure each square's distance from the line on both sides - they must match.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
      ],
      questions: [
        { id: "2.1-q1", prompt: "The mirror line is vertical at 5. The shape on the left has a corner at (2,3). Where does that corner reflect to?", options: ["(8, 3)","(3, 3)","(2, 7)"], correctIndex: 0, explanation: "Yes. Two is three squares from the mirror line at five, so the reflection sits three squares the other side, at eight. The up number never changes." },
        { id: "2.1-q2", prompt: "The mirror line is vertical at 5. Where does the corner at (3,5) reflect to?", options: ["(7, 5)","(5, 5)","(3, 5) - it stays put"], correctIndex: 0, explanation: "Yes. Three is two squares from the mirror, so its reflection is two squares the other side, at seven. The height never changed." },
        { id: "2.1-q3", prompt: "A vertical mirror line sits at 4. A corner is at (1,6). Where does it reflect to?", options: ["(7, 6)","(6, 6)","(1, 2)"], correctIndex: 0, explanation: "Correct - three squares from the line becomes three squares the other side, and the height stays at six." },
      ],
    },

    {
      topicId: "2.2",
      title: "📐 Naming angles",
      scenes: [
        {
          label: "1. Naming angles",
          say: "Angles are named by comparing them to a quarter turn and a half turn - nothing has to be measured to name one.",
          ops: [
            { type: "text", value: "📐 Naming angles", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "The book's definitions: an acute angle is less than a quarter turn. A right angle is a quarter turn.\nAn obtuse angle is greater than a right angle but less than a half turn.\nA reflex angle is greater than a half turn, but less than a whole turn.\nA half turn is an angle of 180 degrees.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. An angle is 100 degrees. What is it called?\n2. An angle is 200 degrees. What is it called?\n3. Your book asks you to make an angle maker. What is it?\n4. Which angle gets a special square marking instead of an arc?", labelSize: 18 },
            { type: "text", value: "1) Obtuse - bigger than a right angle, smaller than a half turn. (page 23)\n2) Reflex - more than a half turn but less than a whole turn. (page 23)\n3) Two strips of card joined with a split pin, so you can open them to any angle. (page 23)\n4) A right angle. The book asks you to use the correct marking for it. (page 23)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
      ],
      questions: [
        { id: "2.2-q1", prompt: "An angle is a bit bigger than a quarter turn, but smaller than a half turn. What is it called?", options: ["Obtuse","Acute","Reflex"], correctIndex: 0, explanation: "Correct. Bigger than a right angle, smaller than a half turn - that is obtuse, exactly as your book puts it on page twenty-three." },
        { id: "2.2-q2", prompt: "Which of these is greater than a half turn?", options: ["The reflex angle","The obtuse angle","The right angle"], correctIndex: 0, explanation: "Correct. Only the reflex angle has gone past a half turn - it carries on round, but stops before a whole turn." },
        { id: "2.2-q3", prompt: "An angle measures 15 degrees. What is it called?", options: ["Acute","Right","Obtuse"], correctIndex: 0, explanation: "Yes - 15 is well under a quarter turn, so it is acute." },
      ],
    },

    {
      topicId: "2.3",
      title: "➖ Angles on a straight line",
      scenes: [
        {
          label: "1. Angles on a straight line",
          say: "The angle on a straight line is 180 degrees, so a missing angle on a line is just 180 take away the one you know.",
          ops: [
            { type: "text", value: "➖ Angles on a straight line", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "The book's fact: the angle on a straight line is 180 degrees. That is the same as a half turn, clockwise or anticlockwise.\nSo if one angle on the line is 60, the other is 180 − 60 = 120.\nThe book's second worked example: 180 − 145 = 35.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. The book's first example: 180 − 60 = ?\n2. The book's second example: 180 − 145 = ?\n3. Two angles on a straight line are equal. What must each one be?\n4. One angle on a straight line is 90. What is the other?", labelSize: 18 },
            { type: "text", value: "1) 120 degrees. (page 24)\n2) 35 degrees. (page 24)\n3) 90 degrees each, because they share 180 equally - so both are right angles.\n4) 90. 180 − 90 = 90, so a right angle always sits next to another right angle on a line.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
      ],
      questions: [
        { id: "2.3-q1", prompt: "One angle on this straight line is 60 degrees. What is the missing angle?", options: ["120°","60°","300°"], correctIndex: 0, explanation: "Right. A straight line is one hundred and eighty degrees, and one hundred and eighty take away sixty is one hundred and twenty." },
        { id: "2.3-q2", prompt: "Your book's second example on page 24: one angle on a straight line is 145°. What is the other?", options: ["35°","45°","145°"], correctIndex: 0, explanation: "Right - one hundred and eighty take away one hundred and forty-five is thirty-five. And thirty-five is an acute angle, which fits: it looks small." },
        { id: "2.3-q3", prompt: "One angle on a straight line is 110 degrees. What is the other?", options: ["70°","90°","290°"], correctIndex: 0, explanation: "Correct - 180 take away 110 is 70." },
        { id: "2.3-q4", prompt: "Two angles on a straight line are exactly the same size. What is each one?", options: ["90° each","180° each","60° each"], correctIndex: 0, explanation: "Correct - 180 shared equally is 90 each, so both of them are right angles." },
      ],
    },

    {
      topicId: "2.4",
      title: "🔺 Triangles",
      scenes: [
        {
          label: "1. Triangles",
          say: "Triangles are named by their side lengths: all three different, exactly two equal, or all three equal.",
          ops: [
            { type: "text", value: "🔺 Triangles", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Scalene: all three sides are different lengths.\nIsosceles: two sides are equal in length.\nEquilateral: all three sides are equal in length.\nThe book comes at this through symmetry first - an isosceles triangle has one mirror line, an equilateral one has three.", labelSize: 20 },
          ],
        },
        {
          label: "2. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. A triangle has sides 5cm, 5cm and 8cm. What is it?\n2. A triangle has sides 4cm, 6cm and 7cm. What is it?\n3. A triangle has sides 6cm, 6cm and 6cm. What is it?\n4. How many mirror lines does an equilateral triangle have?", labelSize: 18 },
            { type: "text", value: "1) Isosceles - exactly two sides equal. (page 28)\n2) Scalene - all three different. (page 28)\n3) Equilateral - all three equal. (page 28)\n4) Three - one through each corner. An isosceles has just one.", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
      ],
      questions: [
        { id: "2.4-q1", prompt: "A triangle has sides of 7cm, 7cm and 3cm. What kind of triangle is it?", options: ["Isosceles","Equilateral","Scalene"], correctIndex: 0, explanation: "Yes - exactly two sides equal makes it isosceles. The little tick marks on the picture show which sides match." },
        { id: "2.4-q2", prompt: "A triangle has sides of 4cm, 9cm and 6cm. Which is it?", options: ["Scalene","Isosceles","Equilateral"], correctIndex: 0, explanation: "Yes - all three lengths are different, so it is scalene. Notice it has no mirror line at all." },
        { id: "2.4-q3", prompt: "Every side of a triangle is 8cm. What is it?", options: ["Equilateral","Isosceles","Scalene"], correctIndex: 0, explanation: "Yes - all three sides equal is equilateral, and it has three mirror lines." },
        { id: "2.4-q4", prompt: "How many lines of symmetry does an isosceles triangle have?", options: ["One","Three","None"], correctIndex: 0, explanation: "Yes - one, running from the corner between the two equal sides down to the middle of the third." },
      ],
    },
  ],
};
