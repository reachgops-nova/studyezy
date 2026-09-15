import type { BoardUnit } from "./types";

/**
 * Maths Unit 2 - Angles and shapes.
 *
 * Built from the Hodder Stage 5 learner's book, pages 21-29.
 *
 * The figures here are hand-authored SVG rather than generated artwork, and
 * deliberately so: a maths picture has to agree with its own labels. A
 * generated poster for the coordinates unit plotted a dot at (7,6) and
 * labelled it (4,3), which teaches the opposite of the lesson. Every angle
 * below is drawn at the degree it claims, and every triangle has the side
 * lengths its name requires.
 */

/** Four angles, each drawn at the size its name says. Vertices sit on y=170. */
const ANGLE_TYPES_SVG = `
  <line x1="10" y1="170" x2="550" y2="170" stroke="#1e293b" stroke-width="1" />

  <!-- acute, 45 degrees -->
  <line x1="70" y1="170" x2="130" y2="170" stroke="#94a3b8" stroke-width="3" />
  <line x1="70" y1="170" x2="112.4" y2="127.6" stroke="#94a3b8" stroke-width="3" />
  <path d="M 96 170 A 26 26 0 0 0 88.4 151.6" fill="none" stroke="#34d399" stroke-width="3" />
  <text x="70" y="200" fill="#34d399" font-size="15" font-weight="bold" text-anchor="middle">acute</text>
  <text x="70" y="216" fill="#64748b" font-size="12" text-anchor="middle">45°</text>

  <!-- right, 90 degrees -->
  <line x1="210" y1="170" x2="270" y2="170" stroke="#94a3b8" stroke-width="3" />
  <line x1="210" y1="170" x2="210" y2="110" stroke="#94a3b8" stroke-width="3" />
  <path d="M 210 154 L 226 154 L 226 170" fill="none" stroke="#38bdf8" stroke-width="3" />
  <text x="210" y="200" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">right</text>
  <text x="210" y="216" fill="#64748b" font-size="12" text-anchor="middle">90°</text>

  <!-- obtuse, 135 degrees -->
  <line x1="350" y1="170" x2="410" y2="170" stroke="#94a3b8" stroke-width="3" />
  <line x1="350" y1="170" x2="307.6" y2="127.6" stroke="#94a3b8" stroke-width="3" />
  <path d="M 376 170 A 26 26 0 0 0 331.6 151.6" fill="none" stroke="#f59e0b" stroke-width="3" />
  <text x="350" y="200" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">obtuse</text>
  <text x="350" y="216" fill="#64748b" font-size="12" text-anchor="middle">135°</text>

  <!-- reflex, 225 degrees - the long way round -->
  <line x1="490" y1="170" x2="550" y2="170" stroke="#94a3b8" stroke-width="3" />
  <line x1="490" y1="170" x2="447.6" y2="127.6" stroke="#94a3b8" stroke-width="3" />
  <path d="M 516 170 A 26 26 0 1 1 471.6 151.6" fill="none" stroke="#f43f5e" stroke-width="3" />
  <text x="490" y="200" fill="#f43f5e" font-size="15" font-weight="bold" text-anchor="middle">reflex</text>
  <text x="490" y="216" fill="#64748b" font-size="12" text-anchor="middle">225°</text>
`;

/** A straight line split into 60 and a missing angle. 180 - 60 = 120. */
const STRAIGHT_LINE_SVG = `
  <line x1="60" y1="170" x2="500" y2="170" stroke="#64748b" stroke-width="4" />
  <line x1="280" y1="170" x2="345" y2="57.4" stroke="#94a3b8" stroke-width="4" />
  <path d="M 340 170 A 60 60 0 0 0 310 118" fill="none" stroke="#f59e0b" stroke-width="3" />
  <text x="338" y="140" fill="#f59e0b" font-size="18" font-weight="bold">60°</text>
  <path d="M 220 170 A 60 60 0 0 1 310 118" fill="none" stroke="#f43f5e" stroke-width="3" />
  <text x="206" y="138" fill="#f43f5e" font-size="20" font-weight="bold">?</text>
  <text x="280" y="212" fill="#e2e8f0" font-size="17" font-weight="bold" text-anchor="middle">180 − 60 = ?</text>
  <text x="280" y="44" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">The angle on a straight line is 180°</text>
`;

/** Three triangles, each with the side lengths its name requires. */
const TRIANGLES_SVG = `
  <polygon points="20,190 150,190 50,100" fill="#0284c7" fill-opacity="0.35" stroke="#38bdf8" stroke-width="3" />
  <text x="85" y="214" fill="#38bdf8" font-size="15" font-weight="bold" text-anchor="middle">scalene</text>
  <text x="85" y="230" fill="#64748b" font-size="11" text-anchor="middle">all 3 sides different</text>

  <polygon points="200,190 340,190 270,90" fill="#059669" fill-opacity="0.35" stroke="#34d399" stroke-width="3" />
  <line x1="231" y1="144" x2="239" y2="136" stroke="#34d399" stroke-width="3" />
  <line x1="301" y1="136" x2="309" y2="144" stroke="#34d399" stroke-width="3" />
  <text x="270" y="214" fill="#34d399" font-size="15" font-weight="bold" text-anchor="middle">isosceles</text>
  <text x="270" y="230" fill="#64748b" font-size="11" text-anchor="middle">2 sides equal</text>

  <polygon points="380,190 520,190 450,68.7564" fill="#be123c" fill-opacity="0.35" stroke="#f43f5e" stroke-width="3" />
  <line x1="411" y1="133" x2="419" y2="125" stroke="#f43f5e" stroke-width="3" />
  <line x1="481" y1="125" x2="489" y2="133" stroke="#f43f5e" stroke-width="3" />
  <line x1="446" y1="186" x2="446" y2="194" stroke="#f43f5e" stroke-width="3" />
  <line x1="454" y1="186" x2="454" y2="194" stroke="#f43f5e" stroke-width="3" />
  <text x="450" y="214" fill="#f43f5e" font-size="15" font-weight="bold" text-anchor="middle">equilateral</text>
  <text x="450" y="230" fill="#64748b" font-size="11" text-anchor="middle">all 3 sides equal</text>
`;

export const CAMBRIDGE_4_MATH_2: BoardUnit = {
  unitKey: "cambridge-4-math-2",
  title: "Angles and shapes",
  badge: "Grade 4 · Unit 2",
  gridMax: 10,
  stage: "grid",

  intro: {
    covers: [
      "Lines of symmetry - horizontal, vertical and diagonal",
      "Naming angles: acute, right, obtuse and reflex",
      "The angle on a straight line, and using it to find a missing angle",
      "Triangles: scalene, isosceles and equilateral",
    ],
    outcomes: [
      "Reflect a pattern in a mirror line to complete it",
      "Name any angle by comparing it to a quarter turn and a half turn",
      "Work out a missing angle on a straight line by subtracting from 180",
      "Name a triangle from its side lengths, and say how you knew",
    ],
  },

  concepts: [
    {
      conceptId: "2.1",
      title: "Symmetrical patterns",
      icon: "🪞",
      summary:
        "A line of symmetry is a mirror line: every square on one side has a matching square the same distance away on the other.",
      keyPoints: [
        "Lines of symmetry can be horizontal and vertical. The book's point on page 21 is that they can also be diagonal.",
        "Distance is what matters. A square three across from the mirror line reflects to three across on the other side.",
        "A pattern can have more than one line of symmetry - the book's worked example ends up with two.",
      ],
      pages: [21, 22],
      storyReference: "The 'Copy these designs' patterns and the diagonal worked example, page 21",
      examples: [
        { question: "Name the three directions a line of symmetry can run, according to page 21.", answer: "Horizontal, vertical and diagonal. (page 21)" },
        { question: "A square sits 2 to the left of a vertical mirror line. Where does its reflection go?", answer: "2 to the right of the line, on the same row." },
        { question: "How would you check a finished pattern really is symmetrical?", answer: "Fold it along the line, or measure each square's distance from the line on both sides - they must match." },
      ],
      quickCheck: [
        {
          title: "Quick check · 2.1",
          conceptId: "2.1",
          prompt: "The mirror line is vertical at 5. The shape on the left has a corner at (2,3). Where does that corner reflect to?",
          setup: {
            shapes: [{ points: [[1, 2], [4, 2], [4, 5], [1, 5]], look: "live" }],
            dots: [{ at: [2, 3], label: "(2,3)", tone: "gold" }, { at: [5, 0], label: "mirror line", tone: "blue" }, { at: [5, 10], tone: "blue" }],
          },
          options: [
            {
              label: "(8, 3)",
              correct: true,
              say: "Yes. Two is three squares from the mirror line at five, so the reflection sits three squares the other side, at eight. The up number never changes.",
              frame: {
                shapes: [{ points: [[1, 2], [4, 2], [4, 5], [1, 5]], look: "ghost" }, { points: [[9, 2], [6, 2], [6, 5], [9, 5]], look: "correct" }],
                dots: [{ at: [2, 3], label: "3 away", tone: "gold" }, { at: [8, 3], label: "(8,3) - 3 away ✓", tone: "green" }],
              },
            },
            {
              label: "(3, 3)",
              correct: false,
              say: "That is still on the same side of the mirror. A reflection has to cross the line, not shuffle along beside it.",
              frame: {
                shapes: [{ points: [[1, 2], [4, 2], [4, 5], [1, 5]], look: "ghost" }],
                dots: [{ at: [3, 3], label: "(3,3) ✗ same side", tone: "red" }],
              },
            },
            {
              label: "(2, 7)",
              correct: false,
              say: "You reflected upwards instead. This mirror line is vertical, so the shape flips left to right - the up number stays put.",
              frame: {
                shapes: [{ points: [[1, 2], [4, 2], [4, 5], [1, 5]], look: "ghost" }],
                dots: [{ at: [2, 7], label: "(2,7) ✗ wrong direction", tone: "red" }],
              },
            },
          ],
        },
      ],
    },
    {
      conceptId: "2.2",
      title: "Naming angles",
      icon: "📐",
      summary:
        "Angles are named by comparing them to a quarter turn and a half turn - nothing has to be measured to name one.",
      keyPoints: [
        "The book's definitions: an acute angle is less than a quarter turn. A right angle is a quarter turn.",
        "An obtuse angle is greater than a right angle but less than a half turn.",
        "A reflex angle is greater than a half turn, but less than a whole turn.",
        "A half turn is an angle of 180 degrees.",
      ],
      pages: [23, 24],
      storyReference: "The angle maker and the turns-and-angles panel, page 23",
      examples: [
        { question: "An angle is 100 degrees. What is it called?", answer: "Obtuse - bigger than a right angle, smaller than a half turn. (page 23)" },
        { question: "An angle is 200 degrees. What is it called?", answer: "Reflex - more than a half turn but less than a whole turn. (page 23)" },
        { question: "Your book asks you to make an angle maker. What is it?", answer: "Two strips of card joined with a split pin, so you can open them to any angle. (page 23)" },
        { question: "Which angle gets a special square marking instead of an arc?", answer: "A right angle. The book asks you to use the correct marking for it. (page 23)" },
      ],
      quickCheck: [
        {
          title: "Quick check · 2.2",
          conceptId: "2.2",
          prompt: "An angle is a bit bigger than a quarter turn, but smaller than a half turn. What is it called?",
          setup: { diagram: { title: "Compare it to a turn", viewBox: "0 0 560 240", svg: ANGLE_TYPES_SVG } },
          options: [
            { label: "Obtuse", correct: true, say: "Correct. Bigger than a right angle, smaller than a half turn - that is obtuse, exactly as your book puts it on page twenty-three.", frame: { diagram: { title: "Obtuse", viewBox: "0 0 560 240", svg: ANGLE_TYPES_SVG, parts: [{ label: "obtuse", at: [350, 150], note: "Greater than a right angle, less than a half turn.", tone: "gold" }] } } },
            { label: "Acute", correct: false, say: "An acute angle is less than a quarter turn - smaller than a right angle, not bigger.", frame: { diagram: { title: "Acute is smaller", viewBox: "0 0 560 240", svg: ANGLE_TYPES_SVG, parts: [{ label: "acute", at: [70, 150], note: "Less than a quarter turn.", tone: "green" }] } } },
            { label: "Reflex", correct: false, say: "A reflex angle is bigger than a half turn. This one has not got that far yet.", frame: { diagram: { title: "Reflex is bigger", viewBox: "0 0 560 240", svg: ANGLE_TYPES_SVG, parts: [{ label: "reflex", at: [490, 150], note: "Greater than a half turn, less than a whole turn.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "2.3",
      title: "Angles on a straight line",
      icon: "➖",
      summary:
        "The angle on a straight line is 180 degrees, so a missing angle on a line is just 180 take away the one you know.",
      keyPoints: [
        "The book's fact: the angle on a straight line is 180 degrees. That is the same as a half turn, clockwise or anticlockwise.",
        "So if one angle on the line is 60, the other is 180 − 60 = 120.",
        "The book's second worked example: 180 − 145 = 35.",
      ],
      pages: [24, 25, 26],
      storyReference: "The 'Use this fact to calculate the missing angles' panel, page 24",
      examples: [
        { question: "The book's first example: 180 − 60 = ?", answer: "120 degrees. (page 24)" },
        { question: "The book's second example: 180 − 145 = ?", answer: "35 degrees. (page 24)" },
        { question: "Two angles on a straight line are equal. What must each one be?", answer: "90 degrees each, because they share 180 equally - so both are right angles." },
        { question: "One angle on a straight line is 90. What is the other?", answer: "90. 180 − 90 = 90, so a right angle always sits next to another right angle on a line." },
      ],
      quickCheck: [
        {
          title: "Quick check · 2.3",
          conceptId: "2.3",
          prompt: "One angle on this straight line is 60 degrees. What is the missing angle?",
          setup: { diagram: { title: "Find the missing angle", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG } },
          options: [
            { label: "120°", correct: true, say: "Right. A straight line is one hundred and eighty degrees, and one hundred and eighty take away sixty is one hundred and twenty.", frame: { diagram: { title: "180 − 60 = 120", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG, parts: [{ label: "120°", at: [230, 140], note: "The two angles together make the straight line: 60 and 120 make 180.", tone: "green" }] } } },
            { label: "60°", correct: false, say: "That would only work if the line split evenly, and it has not - the two angles are clearly different sizes. Take 60 away from 180 instead.", frame: { diagram: { title: "They are not equal", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG, parts: [{ label: "not equal", at: [280, 170], note: "Equal angles on a line would be 90 and 90.", tone: "red" }] } } },
            { label: "300°", correct: false, say: "That is bigger than a whole line. You added instead of subtracting - it is 180 minus 60, not 180 plus 120.", frame: { diagram: { title: "Subtract, do not add", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG, parts: [{ label: "180 is the whole", at: [280, 60], note: "Nothing on a straight line can be more than 180.", tone: "red" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "2.4",
      title: "Triangles",
      icon: "🔺",
      summary:
        "Triangles are named by their side lengths: all three different, exactly two equal, or all three equal.",
      keyPoints: [
        "Scalene: all three sides are different lengths.",
        "Isosceles: two sides are equal in length.",
        "Equilateral: all three sides are equal in length.",
        "The book comes at this through symmetry first - an isosceles triangle has one mirror line, an equilateral one has three.",
      ],
      pages: [27, 28, 29],
      storyReference: "The symmetrical triangles and their mirror lines, page 27",
      examples: [
        { question: "A triangle has sides 5cm, 5cm and 8cm. What is it?", answer: "Isosceles - exactly two sides equal. (page 28)" },
        { question: "A triangle has sides 4cm, 6cm and 7cm. What is it?", answer: "Scalene - all three different. (page 28)" },
        { question: "A triangle has sides 6cm, 6cm and 6cm. What is it?", answer: "Equilateral - all three equal. (page 28)" },
        { question: "How many mirror lines does an equilateral triangle have?", answer: "Three - one through each corner. An isosceles has just one." },
      ],
      quickCheck: [
        {
          title: "Quick check · 2.4",
          conceptId: "2.4",
          prompt: "A triangle has sides of 7cm, 7cm and 3cm. What kind of triangle is it?",
          setup: { diagram: { title: "Name it by its sides", viewBox: "0 0 560 244", svg: TRIANGLES_SVG } },
          options: [
            { label: "Isosceles", correct: true, say: "Yes - exactly two sides equal makes it isosceles. The little tick marks on the picture show which sides match.", frame: { diagram: { title: "Isosceles", viewBox: "0 0 560 244", svg: TRIANGLES_SVG, parts: [{ label: "two equal", at: [270, 140], note: "The ticks mark the two sides that are the same length.", tone: "green" }] } } },
            { label: "Equilateral", correct: false, say: "Equilateral needs all three sides equal. Here the third side is 3cm, so it is the odd one out.", frame: { diagram: { title: "Equilateral needs all three", viewBox: "0 0 560 244", svg: TRIANGLES_SVG, parts: [{ label: "all three equal", at: [450, 140], note: "Three ticks - every side the same.", tone: "red" }] } } },
            { label: "Scalene", correct: false, say: "Scalene means all three sides different. Two of these are both 7cm, so it cannot be scalene.", frame: { diagram: { title: "Scalene has none the same", viewBox: "0 0 560 244", svg: TRIANGLES_SVG, parts: [{ label: "all different", at: [85, 150], note: "No two sides match at all.", tone: "red" }] } } },
          ],
        },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. A mirror line",
      conceptId: "2.1",
      say: "A line of symmetry is a mirror. Every square on one side has a partner the same distance away on the other. Here the mirror runs down the middle, and the shape on the left has a matching shape on the right.",
      frame: {
        shapes: [{ points: [[1, 2], [4, 2], [4, 6], [1, 6]], look: "live" }],
        dots: [{ at: [5, 1], label: "mirror line", tone: "blue" }, { at: [5, 9], tone: "blue" }],
      },
    },
    {
      label: "2. Reflected across",
      conceptId: "2.1",
      say: "There it is reflected. The left edge was four squares from the mirror, so its reflection is four squares the other side. Nothing moved up or down - a vertical mirror only flips left to right.",
      frame: {
        shapes: [
          { points: [[1, 2], [4, 2], [4, 6], [1, 6]], look: "ghost" },
          { points: [[9, 2], [6, 2], [6, 6], [9, 6]], look: "correct" },
        ],
        dots: [{ at: [5, 1], label: "mirror line", tone: "blue" }, { at: [5, 9], tone: "blue" }],
        arrows: [{ from: [4, 4], to: [6, 4] }],
      },
    },
    {
      label: "3. Diagonal mirrors too",
      conceptId: "2.1",
      say: "Your book makes one extra point on page twenty-one. A line of symmetry does not have to be upright or flat. It can run diagonally, corner to corner - and a pattern can have more than one at the same time.",
      frame: {
        shapes: [{ points: [[2, 2], [6, 2], [6, 6], [2, 6]], look: "live" }],
        arrows: [{ from: [1, 1], to: [8, 8] }],
        dots: [{ at: [8, 8], label: "diagonal mirror", tone: "gold" }],
      },
    },
    {
      label: "4. Naming angles",
      conceptId: "2.2",
      say: "You can name an angle without measuring it. Compare it to a turn. Less than a quarter turn is acute. A quarter turn exactly is a right angle. Past that but under a half turn is obtuse. Past a half turn is reflex. Tap any one to hear it again.",
      frame: {
        diagram: {
          title: "Four angles · Page 23",
          viewBox: "0 0 560 240",
          svg: ANGLE_TYPES_SVG,
          parts: [
            { label: "acute", at: [70, 150], note: "Less than a quarter turn. This one is 45 degrees.", tone: "green" },
            { label: "right", at: [210, 150], note: "A quarter turn exactly - 90 degrees. It gets a square marking, not an arc.", tone: "blue" },
            { label: "obtuse", at: [350, 150], note: "Greater than a right angle but less than a half turn. This one is 135 degrees.", tone: "gold" },
            { label: "reflex", at: [490, 150], note: "Greater than a half turn but less than a whole turn. This one is 225 degrees.", tone: "red" },
          ],
        },
      },
    },
    {
      label: "5. A straight line is 180°",
      conceptId: "2.3",
      say: "Here is the fact that unlocks the rest. The angle on a straight line is one hundred and eighty degrees - a half turn. So if you know one angle on the line, the other is just one hundred and eighty take away it.",
      frame: {
        diagram: {
          title: "Angles on a straight line · Page 24",
          viewBox: "0 0 560 240",
          svg: STRAIGHT_LINE_SVG,
          parts: [
            { label: "60°", at: [352, 158], note: "The angle you are given.", tone: "gold" },
            { label: "?", at: [230, 150], note: "180 take away 60. That is 120 degrees.", tone: "red" },
          ],
        },
      },
    },
    {
      label: "6. Naming triangles",
      conceptId: "2.4",
      say: "Triangles are named by their sides. All three different is scalene. Exactly two the same is isosceles. All three the same is equilateral. The little tick marks tell you which sides match without measuring anything.",
      frame: {
        diagram: {
          title: "Three triangles · Pages 27-28",
          viewBox: "0 0 560 244",
          svg: TRIANGLES_SVG,
          parts: [
            { label: "scalene", at: [85, 150], note: "All three sides different lengths. No ticks, because nothing matches.", tone: "blue" },
            { label: "isosceles", at: [270, 140], note: "Two sides equal - the two with a single tick. It has one mirror line.", tone: "green" },
            { label: "equilateral", at: [450, 140], note: "All three sides equal. It has three mirror lines, one through each corner.", tone: "red" },
          ],
        },
      },
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · Reflect the corner",
      conceptId: "2.1",
      setup: {
        shapes: [{ points: [[1, 3], [3, 3], [3, 7], [1, 7]], look: "live" }],
        dots: [{ at: [3, 5], label: "(3,5)", tone: "gold" }, { at: [5, 1], label: "mirror", tone: "blue" }, { at: [5, 9], tone: "blue" }],
      },
      drag: { from: [3, 5], to: [7, 5], hint: "drag me" },
      prompt: "The mirror line is vertical at 5. Where does the corner at (3,5) reflect to?",
      options: [
        {
          label: "(7, 5)",
          correct: true,
          say: "Yes. Three is two squares from the mirror, so its reflection is two squares the other side, at seven. The height never changed.",
          frame: {
            shapes: [{ points: [[1, 3], [3, 3], [3, 7], [1, 7]], look: "ghost" }, { points: [[9, 3], [7, 3], [7, 7], [9, 7]], look: "correct" }],
            dots: [{ at: [7, 5], label: "(7,5) ✓", tone: "green" }],
          },
        },
        {
          label: "(5, 5)",
          correct: false,
          say: "That is on the mirror line itself. A reflection lands the same distance past the line, not on it.",
          frame: {
            shapes: [{ points: [[1, 3], [3, 3], [3, 7], [1, 7]], look: "ghost" }],
            dots: [{ at: [5, 5], label: "(5,5) ✗ on the line", tone: "red" }],
          },
        },
        {
          label: "(3, 5) - it stays put",
          correct: false,
          say: "Only a point sitting exactly on the mirror line stays put. This one is two squares away, so it has to move.",
          frame: {
            shapes: [{ points: [[1, 3], [3, 3], [3, 7], [1, 7]], look: "ghost" }],
            dots: [{ at: [3, 5], label: "(3,5) ✗ did not move", tone: "red" }],
          },
        },
      ],
    },
    {
      title: "Task 2 · Name that angle",
      conceptId: "2.2",
      setup: { diagram: { title: "Which is which?", viewBox: "0 0 560 240", svg: ANGLE_TYPES_SVG } },
      prompt: "Which of these is greater than a half turn?",
      options: [
        { label: "The reflex angle", correct: true, say: "Correct. Only the reflex angle has gone past a half turn - it carries on round, but stops before a whole turn.", frame: { diagram: { title: "Reflex", viewBox: "0 0 560 240", svg: ANGLE_TYPES_SVG, parts: [{ label: "past a half turn", at: [490, 150], note: "225 degrees - more than 180, less than 360.", tone: "green" }] } } },
        { label: "The obtuse angle", correct: false, say: "Obtuse gets past a right angle, but it stops short of a half turn. It is between 90 and 180.", frame: { diagram: { title: "Obtuse stops at 180", viewBox: "0 0 560 240", svg: ANGLE_TYPES_SVG, parts: [{ label: "135°", at: [350, 150], note: "Bigger than 90, smaller than 180.", tone: "red" }] } } },
        { label: "The right angle", correct: false, say: "A right angle is a quarter turn - 90 degrees. That is only half of a half turn.", frame: { diagram: { title: "A quarter turn", viewBox: "0 0 560 240", svg: ANGLE_TYPES_SVG, parts: [{ label: "90°", at: [210, 150], note: "Exactly a quarter turn.", tone: "red" }] } } },
      ],
    },
    {
      title: "Task 3 · The other worked example",
      conceptId: "2.3",
      setup: { diagram: { title: "180 − 145 = ?", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG } },
      prompt: "Your book's second example on page 24: one angle on a straight line is 145°. What is the other?",
      options: [
        { label: "35°", correct: true, say: "Right - one hundred and eighty take away one hundred and forty-five is thirty-five. And thirty-five is an acute angle, which fits: it looks small.", frame: { diagram: { title: "35°", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG, parts: [{ label: "35° - acute", at: [230, 140], note: "145 and 35 together make 180.", tone: "green" }] } } },
        { label: "45°", correct: false, say: "Close, but check the subtraction. 180 take away 145 - count up from 145 to 180 and you get 35, not 45.", frame: { diagram: { title: "Count up from 145", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG, parts: [{ label: "145 → 180 is 35", at: [280, 60], note: "145 to 150 is 5, then 150 to 180 is 30. 5 and 30 make 35.", tone: "red" }] } } },
        { label: "145°", correct: false, say: "Both angles are only equal when each one is 90. Here one is much bigger than the other.", frame: { diagram: { title: "Not equal", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG, parts: [{ label: "only 90 and 90 are equal", at: [280, 170], note: "Any other split gives two different angles.", tone: "red" }] } } },
      ],
    },
    {
      title: "Task 4 · Which triangle?",
      conceptId: "2.4",
      setup: { diagram: { title: "Sides: 4cm, 9cm, 6cm", viewBox: "0 0 560 244", svg: TRIANGLES_SVG } },
      prompt: "A triangle has sides of 4cm, 9cm and 6cm. Which is it?",
      options: [
        { label: "Scalene", correct: true, say: "Yes - all three lengths are different, so it is scalene. Notice it has no mirror line at all.", frame: { diagram: { title: "Scalene", viewBox: "0 0 560 244", svg: TRIANGLES_SVG, parts: [{ label: "all different", at: [85, 150], note: "4, 9 and 6 - no two the same.", tone: "green" }] } } },
        { label: "Isosceles", correct: false, say: "Isosceles needs exactly two sides the same. Here no two match.", frame: { diagram: { title: "Isosceles needs a pair", viewBox: "0 0 560 244", svg: TRIANGLES_SVG, parts: [{ label: "two equal", at: [270, 140], note: "Look for the tick marks - two sides the same.", tone: "red" }] } } },
        { label: "Equilateral", correct: false, say: "Equilateral needs all three the same. These are 4, 9 and 6 - about as different as they could be.", frame: { diagram: { title: "Equilateral", viewBox: "0 0 560 244", svg: TRIANGLES_SVG, parts: [{ label: "all three equal", at: [450, 140], note: "Every side the same length.", tone: "red" }] } } },
      ],
    },
  ],

  lab: {
    prompt: "Drag the square around the grid. Watch how far it sits from the mirror line at 5 - a reflection always lands the same distance the other side.",
    start: [2, 3],
    shape: [[0, 0], [2, 0], [2, 2], [0, 2]],
    range: { min: 0, max: 8 },
  },

  recitePrompts: [
    { ask: "What are the three directions a line of symmetry can run?", answer: "Horizontal, vertical and diagonal." },
    { ask: "Name the four kinds of angle, smallest first.", answer: "Acute, right, obtuse, reflex. Acute is under a quarter turn, right is a quarter turn, obtuse is under a half turn, reflex is over a half turn." },
    { ask: "What is the angle on a straight line, and what do you do with it?", answer: "180 degrees. Take away the angle you know to find the one you do not." },
    { ask: "How do you tell the three kinds of triangle apart?", answer: "By their sides. All different is scalene, exactly two equal is isosceles, all three equal is equilateral." },
  ],

  writtenPractice: [
    { question: "Draw a 6 by 6 grid, shade any five squares on the left half, then reflect them in a vertical mirror line down the middle.", answer: "Check each shaded square: count how far it is from the line, and its partner must be the same distance the other side, on the same row." },
    { question: "Look around the room and find one acute, one right and one obtuse angle. Write down what each one is.", answer: "Corners of books and tables are right angles. An open door makes acute or obtuse depending how far it swings." },
    { question: "Work these out: 180 − 30, 180 − 90, 180 − 175.", answer: "150, 90 and 5. Notice the last one is tiny and acute, and the middle one is a right angle." },
    { question: "Draw a triangle with two sides of 5cm and one of 7cm. Name it, then draw in its mirror line.", answer: "Isosceles. The mirror line runs from the corner between the two equal sides, down to the middle of the 7cm side." },
    { question: "Can a triangle have two right angles? Try to draw one and explain what goes wrong.", answer: "No. Two right angles already use 180 degrees, and the two sides never meet to close the shape." },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · Reflect it",
        conceptId: "2.1",
        prompt: "A vertical mirror line sits at 4. A corner is at (1,6). Where does it reflect to?",
        setup: { dots: [{ at: [1, 6], label: "(1,6)", tone: "gold" }, { at: [4, 1], label: "mirror", tone: "blue" }, { at: [4, 9], tone: "blue" }] },
        options: [
          { label: "(7, 6)", correct: true, say: "Correct - three squares from the line becomes three squares the other side, and the height stays at six.", frame: { dots: [{ at: [1, 6], label: "3 away", tone: "gold" }, { at: [7, 6], label: "(7,6) ✓", tone: "green" }] } },
          { label: "(6, 6)", correct: false, say: "Count again. From 1 to the mirror at 4 is three squares, so the reflection is three past 4, which is 7.", frame: { dots: [{ at: [6, 6], label: "(6,6) ✗ only 2 away", tone: "red" }] } },
          { label: "(1, 2)", correct: false, say: "That is a reflection in a horizontal line. This mirror is vertical, so the shape flips sideways.", frame: { dots: [{ at: [1, 2], label: "(1,2) ✗ wrong direction", tone: "red" }] } },
        ],
      },
      {
        title: "Q2 · Name it",
        conceptId: "2.2",
        prompt: "An angle measures 15 degrees. What is it called?",
        setup: { diagram: { title: "Compare to a turn", viewBox: "0 0 560 240", svg: ANGLE_TYPES_SVG } },
        options: [
          { label: "Acute", correct: true, say: "Yes - 15 is well under a quarter turn, so it is acute.", frame: { diagram: { title: "Acute", viewBox: "0 0 560 240", svg: ANGLE_TYPES_SVG, parts: [{ label: "under 90", at: [70, 150], note: "Anything less than a quarter turn is acute.", tone: "green" }] } } },
          { label: "Right", correct: false, say: "A right angle is exactly 90. Fifteen is far smaller than that.", frame: { diagram: { title: "A right angle is 90", viewBox: "0 0 560 240", svg: ANGLE_TYPES_SVG, parts: [{ label: "90°", at: [210, 150], note: "Exactly a quarter turn.", tone: "red" }] } } },
          { label: "Obtuse", correct: false, say: "Obtuse is bigger than a right angle. Fifteen is smaller than one.", frame: { diagram: { title: "Obtuse is over 90", viewBox: "0 0 560 240", svg: ANGLE_TYPES_SVG, parts: [{ label: "135°", at: [350, 150], note: "Between 90 and 180.", tone: "red" }] } } },
        ],
      },
      {
        title: "Q3 · Missing angle",
        conceptId: "2.3",
        prompt: "One angle on a straight line is 110 degrees. What is the other?",
        setup: { diagram: { title: "A straight line is 180°", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG } },
        options: [
          { label: "70°", correct: true, say: "Correct - 180 take away 110 is 70.", frame: { diagram: { title: "180 − 110 = 70", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG, parts: [{ label: "70°", at: [230, 140], note: "110 and 70 together make 180.", tone: "green" }] } } },
          { label: "90°", correct: false, say: "That would need the other angle to be 90 too. Subtract instead: 180 take away 110.", frame: { diagram: { title: "Subtract", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG, parts: [{ label: "180 − 110", at: [280, 60], note: "Count up from 110 to 180 - that is 70.", tone: "red" }] } } },
          { label: "290°", correct: false, say: "You added. Nothing on a straight line can be bigger than 180 in the first place.", frame: { diagram: { title: "180 is the whole line", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG, parts: [{ label: "the whole line", at: [280, 60], note: "Both angles together are 180, so neither can be more.", tone: "red" }] } } },
        ],
      },
    ],
    partB: [
      {
        title: "Q4 · Name the triangle",
        conceptId: "2.4",
        prompt: "Every side of a triangle is 8cm. What is it?",
        setup: { diagram: { title: "Name it by its sides", viewBox: "0 0 560 244", svg: TRIANGLES_SVG } },
        options: [
          { label: "Equilateral", correct: true, say: "Yes - all three sides equal is equilateral, and it has three mirror lines.", frame: { diagram: { title: "Equilateral", viewBox: "0 0 560 244", svg: TRIANGLES_SVG, parts: [{ label: "all three equal", at: [450, 140], note: "Three ticks, three mirror lines.", tone: "green" }] } } },
          { label: "Isosceles", correct: false, say: "Isosceles is exactly two equal. When all three match it earns a different name.", frame: { diagram: { title: "Two, not three", viewBox: "0 0 560 244", svg: TRIANGLES_SVG, parts: [{ label: "two equal", at: [270, 140], note: "Isosceles has one pair.", tone: "red" }] } } },
          { label: "Scalene", correct: false, say: "Scalene means no two sides match. Here they all do.", frame: { diagram: { title: "Scalene has none the same", viewBox: "0 0 560 244", svg: TRIANGLES_SVG, parts: [{ label: "all different", at: [85, 150], note: "The opposite of this triangle.", tone: "red" }] } } },
        ],
      },
      {
        title: "Q5 · Two at once",
        conceptId: "2.3",
        prompt: "Two angles on a straight line are exactly the same size. What is each one?",
        setup: { diagram: { title: "Split 180 evenly", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG } },
        options: [
          { label: "90° each", correct: true, say: "Correct - 180 shared equally is 90 each, so both of them are right angles.", frame: { diagram: { title: "90 and 90", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG, parts: [{ label: "90 + 90 = 180", at: [280, 60], note: "The only way to split a straight line evenly.", tone: "green" }] } } },
          { label: "180° each", correct: false, say: "That would be 360 altogether - a whole turn, not a straight line.", frame: { diagram: { title: "That is a whole turn", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG, parts: [{ label: "180 is the total", at: [280, 60], note: "Both angles share 180 between them.", tone: "red" }] } } },
          { label: "60° each", correct: false, say: "Sixty and sixty make a hundred and twenty, which leaves a gap. They have to add up to 180.", frame: { diagram: { title: "They must total 180", viewBox: "0 0 560 240", svg: STRAIGHT_LINE_SVG, parts: [{ label: "60 + 60 = 120", at: [280, 60], note: "That is short of a straight line.", tone: "red" }] } } },
        ],
      },
      {
        title: "Q6 · How many mirrors?",
        conceptId: "2.4",
        prompt: "How many lines of symmetry does an isosceles triangle have?",
        setup: { diagram: { title: "Mirror lines", viewBox: "0 0 560 244", svg: TRIANGLES_SVG } },
        options: [
          { label: "One", correct: true, say: "Yes - one, running from the corner between the two equal sides down to the middle of the third.", frame: { diagram: { title: "One mirror line", viewBox: "0 0 560 244", svg: TRIANGLES_SVG, parts: [{ label: "one mirror", at: [270, 140], note: "Fold it down the middle and the two equal sides land on each other.", tone: "green" }] } } },
          { label: "Three", correct: false, say: "Three is the equilateral triangle, where every side is the same so every fold works.", frame: { diagram: { title: "Three is equilateral", viewBox: "0 0 560 244", svg: TRIANGLES_SVG, parts: [{ label: "three mirrors", at: [450, 140], note: "One through each corner.", tone: "red" }] } } },
          { label: "None", correct: false, say: "None is the scalene triangle. An isosceles has a matching pair of sides, so it folds in half once.", frame: { diagram: { title: "None is scalene", viewBox: "0 0 560 244", svg: TRIANGLES_SVG, parts: [{ label: "no mirror", at: [85, 150], note: "Nothing matches, so nothing folds.", tone: "red" }] } } },
        ],
      },
    ],
  },

  readymade: [
    { q: "What is a line of symmetry?", a: "A mirror line. Every part on one side has a matching part the same distance away on the other. It can be horizontal, vertical or diagonal." },
    { q: "What are the four kinds of angle?", a: "Acute is less than a quarter turn, right is a quarter turn, obtuse is between a right angle and a half turn, reflex is more than a half turn." },
    { q: "How many degrees is a straight line?", a: "180 - a half turn. So a missing angle on a line is 180 take away the one you know." },
    { q: "What is the difference between isosceles and equilateral?", a: "Isosceles has exactly two sides equal. Equilateral has all three equal." },
    { q: "What is a scalene triangle?", a: "One where all three sides are different lengths. It has no lines of symmetry." },
    { q: "How do I remember obtuse and acute?", a: "Acute angles are small and sharp. Obtuse ones are wide and blunt - they have pushed past a right angle." },
  ],
};
