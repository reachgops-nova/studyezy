import type { BoardUnit } from "./types";

/**
 * Unit 10 - Location and movement.
 *
 * The worked examples are carried over from the reference build the user
 * approved (drawing_board_unit10_v5.py): "we can use this template and
 * examples as is". The triangle sliding (1,2) -> (4,4), the square-vertex
 * task, the slider lab and the three assessment questions are all that
 * build's, deliberately unchanged.
 *
 * What is realigned is the teaching voice and the concept wording, which now
 * match this unit's real production content rather than the reference's own
 * phrasing - the definition, the key points and the tip are the same lines
 * the lesson already speaks, so a child moving between the two surfaces hears
 * one consistent explanation.
 */
export const CAMBRIDGE_4_MATH_10: BoardUnit = {
  unitKey: "cambridge-4-math-10",
  title: "Location and movement",
  badge: "Grade 4 · Unit 10",
  gridMax: 10,

  intro: {
    covers: [
      "What a translation is - sliding a shape without turning or resizing it",
      "Describing a slide properly: how far across, then how far up or down",
      "Reading and plotting coordinates as (across, up)",
      "Finding a missing corner of a rectangle or square on a grid",
    ],
    outcomes: [
      "Slide any shape on a grid and say exactly where it landed",
      "Describe a translation so someone else could copy it without seeing it",
      "Plot a point from its coordinates, and read coordinates off a plotted point",
      "Work out a missing vertex by matching equal sides and parallel edges",
    ],
  },

  concepts: [
    {
      conceptId: "10.1",
      title: "Translating 2D shapes",
      icon: "🔺",
      summary:
        "A translation is sliding a shape in a straight direction across a grid without turning, flipping, or resizing it.",
      keyPoints: [
        "Every single vertex on the shape moves the exact same distance and direction.",
        "Translations are described by stating how many units a shape moves horizontally (left or right) and vertically (up or down).",
        "Connecting lines drawn between each original vertex and its matching new vertex will always be parallel and equal in length.",
      ],
      examples: [
        { question: "A shape at (2,3) is translated 4 right and 1 up. Where does it land?", answer: "(6,4)" },
        { question: "Describe the translation from (9,7) to (9,2).", answer: "5 down. The across number never changed." },
        { question: "A triangle has corners (1,1), (3,1), (2,3). Write its corners after 2 right and 3 up.", answer: "(3,4), (5,4) and (4,6)." },
      ],
      quickCheck: [
        {
          title: "Quick check · 10.1",
          conceptId: "10.1",
          prompt: "This triangle's bottom-left corner sits at (2,1). Slide the shape 4 right and 2 up. Drag the corner to where it lands, or pick below.",
          setup: {
            shapes: [{ points: [[2, 1], [4, 1], [3, 3]], look: "live" }],
            dots: [{ at: [2, 1], label: "start (2,1)", tone: "gold" }],
          },
          drag: { from: [2, 1], to: [6, 3], hint: "drag me" },
          options: [
            {
              label: "(6, 3)",
              correct: true,
              say: "Yes. Two plus four is six across, and one plus two is three up. Every other corner moved exactly the same way.",
              frame: {
                shapes: [
                  { points: [[2, 1], [4, 1], [3, 3]], look: "ghost" },
                  { points: [[6, 3], [8, 3], [7, 5]], look: "correct" },
                ],
                arrows: [{ from: [2, 1], to: [6, 3] }, { from: [4, 1], to: [8, 3] }, { from: [3, 3], to: [7, 5] }],
                dots: [{ at: [6, 3], label: "(6,3) ✓", tone: "green" }],
              },
            },
            {
              label: "(3, 5)",
              correct: false,
              say: "That is the two numbers the wrong way round - you went 2 across and 4 up. The first number is always the across one.",
              frame: {
                shapes: [
                  { points: [[2, 1], [4, 1], [3, 3]], look: "ghost" },
                  { points: [[3, 5], [5, 5], [4, 7]], look: "wrong" },
                ],
                arrows: [{ from: [2, 1], to: [3, 5] }],
                dots: [{ at: [3, 5], label: "(3,5) ✗ swapped", tone: "red" }],
              },
            },
            {
              label: "(4, 2)",
              correct: false,
              say: "You moved, but only half as far. Count the squares again: four to the right, then two up.",
              frame: {
                shapes: [
                  { points: [[2, 1], [4, 1], [3, 3]], look: "ghost" },
                  { points: [[4, 2], [6, 2], [5, 4]], look: "wrong" },
                ],
                arrows: [{ from: [2, 1], to: [4, 2] }],
                dots: [{ at: [4, 2], label: "(4,2) ✗ too short", tone: "red" }],
              },
            },
          ],
        },
      ],
    },
    {
      conceptId: "10.2",
      title: "Shapes on a coordinate grid",
      icon: "📍",
      summary:
        "Coordinates are read along the horizontal x-axis first, then up the vertical y-axis - always (x, y).",
      keyPoints: [
        "Coordinates are read along the horizontal x-axis first, then up the vertical y-axis.",
        "You can work out the missing vertex of a shape like a rectangle by matching equal side lengths and parallel edges.",
        "Given a set of vertices, sometimes more than one valid geometric shape can be formed depending on where you plot the final points.",
      ],
      examples: [
        { question: "Which point is 5 across and 2 up?", answer: "(5,2)" },
        { question: "Three corners of a rectangle are (1,1), (6,1), (6,4). Where is the fourth?", answer: "(1,4)" },
        { question: "Is (3,8) the same place as (8,3)?", answer: "No - across always comes first, so they are two different points." },
      ],
      quickCheck: [
        {
          title: "Quick check · 10.2",
          conceptId: "10.2",
          prompt: "Three corners of a rectangle are plotted at (2,2), (7,2) and (7,5). Drag the last corner into place, or pick below.",
          setup: {
            dots: [
              { at: [2, 2], label: "(2,2)", tone: "blue" },
              { at: [7, 2], label: "(7,2)", tone: "blue" },
              { at: [7, 5], label: "(7,5)", tone: "blue" },
            ],
          },
          drag: { from: [5, 8], to: [2, 5], hint: "drag me" },
          options: [
            {
              label: "(2, 5)",
              correct: true,
              say: "That is it. The bottom edge runs from 2 to 7, so the top edge must too - and it sits level with the corner at height five.",
              frame: {
                shapes: [{ points: [[2, 2], [7, 2], [7, 5], [2, 5]], look: "correct" }],
                dots: [{ at: [2, 5], label: "(2,5) ✓", tone: "green" }],
              },
            },
            {
              label: "(5, 2)",
              correct: false,
              say: "Across and up are swapped. Five across and two up puts the corner back down on the bottom edge, where there is already a line.",
              frame: {
                shapes: [{ points: [[2, 2], [7, 2], [7, 5], [5, 2]], look: "wrong" }],
                dots: [{ at: [5, 2], label: "(5,2) ✗ on the bottom edge", tone: "red" }],
              },
            },
            {
              label: "(2, 7)",
              correct: false,
              say: "Too high. The third corner is at height five, and the top of a rectangle has to be level all the way along.",
              frame: {
                shapes: [{ points: [[2, 2], [7, 2], [7, 5], [2, 7]], look: "wrong" }],
                dots: [{ at: [2, 7], label: "(2,7) ✗ not level", tone: "red" }],
              },
            },
          ],
        },
      ],
    },
  ],

  // Phase 1. One idea per press - the child sets the pace, nothing auto-plays
  // past them ("one by one and steady for the kids").
  conceptSteps: [
    {
      label: "0. Poster · across comes first",
      conceptId: "10.2",
      say: "Look at the two dots. One is at three across and eight up. The other is at eight across and three up. Same two numbers, completely different places. That is why the order matters - the across number is always written first.",
      frame: {
        image: {
          src: "/board-art/math10-order-xy.jpg",
          alt: "A grid with a dot at (3,8) and another at (8,3), showing they are different places",
          title: "Across always comes first",
          hotspots: [
            { label: "(3, 8)", at: [30, 30], note: "Three across, then eight up. High on the grid and near the left.", tone: "gold" },
            { label: "(8, 3)", at: [72, 60], note: "Eight across, then three up. Low on the grid and far to the right. The same two numbers, nowhere near the same place.", tone: "red" },
            { label: "Across first", at: [50, 95], note: "Walk along the bottom before you climb. Across, then up - every single time.", tone: "blue" },
          ],
        },
      },
    },
    {
      label: "1. Start at (1,2)",
      conceptId: "10.1",
      say: "Here is our triangle. Its bottom-left corner sits at 1 across and 2 up - we write that as (1,2).",
      frame: {
        shapes: [{ points: [[1, 2], [3, 2], [2, 4]], look: "live" }],
        dots: [{ at: [1, 2], label: "(1,2)", tone: "gold" }],
      },
    },
    {
      label: "2. Slide right 3",
      conceptId: "10.1",
      say: "Now slide it 3 squares to the right. Count with me - one, two, three. The corner moves from 1 across to 4 across.",
      frame: {
        shapes: [
          { points: [[1, 2], [3, 2], [2, 4]], look: "ghost" },
          { points: [[4, 2], [6, 2], [5, 4]], look: "live" },
        ],
        arrows: [{ from: [1, 2], to: [4, 2] }],
        dots: [{ at: [4, 2], label: "right 3 → (4,2)", tone: "gold" }],
      },
    },
    {
      label: "3. Slide up 2",
      conceptId: "10.1",
      say: "Then slide it 2 squares up. The corner moves from 2 up to 4 up. Notice the triangle has not turned at all - it only moved.",
      frame: {
        shapes: [
          { points: [[1, 2], [3, 2], [2, 4]], look: "ghost" },
          { points: [[4, 4], [6, 4], [5, 6]], look: "live" },
        ],
        arrows: [
          { from: [1, 2], to: [4, 2] },
          { from: [4, 2], to: [4, 4] },
        ],
        dots: [{ at: [4, 4], label: "up 2 → (4,4)", tone: "gold" }],
      },
    },
    {
      label: "4. Landed (4,4)",
      conceptId: "10.1",
      say: "Landed! Three right and two up. Look at the three dashed arrows - every corner travelled the same distance in the same direction. That is what makes it a translation.",
      frame: {
        shapes: [
          { points: [[1, 2], [3, 2], [2, 4]], look: "ghost" },
          { points: [[4, 4], [6, 4], [5, 6]], look: "correct" },
        ],
        arrows: [
          { from: [1, 2], to: [4, 4] },
          { from: [3, 2], to: [6, 4] },
          { from: [2, 4], to: [5, 6] },
        ],
        dots: [{ at: [4, 4], label: "(4,4) ✓", tone: "green" }],
      },
    },
    {
      label: "5. Reading (x,y)",
      conceptId: "10.2",
      say: "Now the second half of this chapter - coordinates. This point is at 6 across and 3 up. We always say across first, so we write it as (6,3).",
      frame: {
        dots: [{ at: [6, 3], label: "(6,3)", tone: "blue" }],
        arrows: [{ from: [0, 0], to: [6, 0] }, { from: [6, 0], to: [6, 3] }],
      },
    },
    {
      label: "6. Order matters",
      conceptId: "10.2",
      say: "Swap the numbers and you land somewhere completely different. (6,3) and (3,6) are not the same place at all - across always comes first.",
      frame: {
        dots: [
          { at: [6, 3], label: "(6,3)", tone: "blue" },
          { at: [3, 6], label: "(3,6) - a different place", tone: "red" },
        ],
      },
    },
    {
      label: "7. Missing corner",
      conceptId: "10.2",
      say: "Here are three corners of a rectangle. Because opposite sides must be equal and parallel, there is only one place the fourth corner can go.",
      frame: {
        shapes: [{ points: [[2, 2], [7, 2], [7, 5]], look: "ghost" }],
        dots: [
          { at: [2, 2], label: "(2,2)", tone: "gold" },
          { at: [7, 2], label: "(7,2)", tone: "gold" },
          { at: [7, 5], label: "(7,5)", tone: "gold" },
          { at: [2, 5], label: "where must this be?", tone: "red" },
        ],
      },
    },
    {
      label: "8. Completed",
      conceptId: "10.2",
      say: "There it is - (2,5). It lines up above (2,2) and across from (7,5), so all four sides stay straight and the opposite sides match.",
      frame: {
        shapes: [{ points: [[2, 2], [7, 2], [7, 5], [2, 5]], look: "correct" }],
        dots: [{ at: [2, 5], label: "(2,5) ✓", tone: "green" }],
      },
    },
  ],

  // Phase 2. Every option draws its own outcome, right or wrong - a wrong
  // answer shows the child exactly where that answer lands, which is the
  // most valuable single behaviour in the reference build.
  guidedTasks: [
    {
      title: "Task 1 · Slide challenge",
      setup: {
        shapes: [{ points: [[1, 2], [3, 2], [2, 4]], look: "live" }],
        dots: [{ at: [1, 2], label: "start (1,2)", tone: "gold" }],
      },
      drag: { from: [1, 2], to: [4, 4], hint: "drag the corner" },
      prompt: "Shape A starts at (1,2). It is translated 3 squares RIGHT and 2 squares UP. Where does its bottom-left corner land?",
      conceptId: "10.1",
      options: [
        {
          label: "(3, 5)",
          correct: false,
          say: "Not quite - that would be 2 right and 3 up. Check again: we moved 3 right, so 1 plus 3 is 4.",
          frame: {
            shapes: [
              { points: [[1, 2], [3, 2], [2, 4]], look: "ghost" },
              { points: [[3, 5], [5, 5], [4, 7]], look: "wrong" },
            ],
            arrows: [{ from: [1, 2], to: [3, 5] }],
            dots: [{ at: [3, 5], label: "(3,5) ✗", tone: "red" }],
          },
        },
        {
          label: "(4, 4)",
          correct: true,
          say: "Exactly right! 1 plus 3 is 4 across, and 2 plus 2 is 4 up. It lands at (4,4).",
          frame: {
            shapes: [
              { points: [[1, 2], [3, 2], [2, 4]], look: "ghost" },
              { points: [[4, 4], [6, 4], [5, 6]], look: "correct" },
            ],
            arrows: [
              { from: [1, 2], to: [4, 4] },
              { from: [3, 2], to: [6, 4] },
              { from: [2, 4], to: [5, 6] },
            ],
            dots: [{ at: [4, 4], label: "(4,4) ✓", tone: "green" }],
          },
        },
        {
          label: "(4, 2)",
          correct: false,
          say: "Close - you moved 3 right correctly, but the shape still needs to go 2 squares up.",
          frame: {
            shapes: [
              { points: [[1, 2], [3, 2], [2, 4]], look: "ghost" },
              { points: [[4, 2], [6, 2], [5, 4]], look: "wrong" },
            ],
            arrows: [{ from: [1, 2], to: [4, 2] }],
            dots: [{ at: [4, 2], label: "(4,2) ✗ - still to go up", tone: "red" }],
          },
        },
        {
          label: "(1, 4)",
          correct: false,
          say: "That one only moved up. We need to go across first - 3 squares right - and then up 2.",
          frame: {
            shapes: [
              { points: [[1, 2], [3, 2], [2, 4]], look: "ghost" },
              { points: [[1, 4], [3, 4], [2, 6]], look: "wrong" },
            ],
            arrows: [{ from: [1, 2], to: [1, 4] }],
            dots: [{ at: [1, 4], label: "(1,4) ✗ - no sideways move", tone: "red" }],
          },
        },
      ],
    },
    {
      title: "Task 2 · Complete the square",
      prompt: "Two bottom corners of a square are at (2,1) and (5,1). Which top corners complete it?",
      conceptId: "10.2",
      options: [
        {
          label: "(2,3) & (5,3)",
          correct: false,
          say: "That makes a rectangle, not a square - it is 3 wide but only 2 tall. A square needs all four sides equal.",
          frame: {
            shapes: [{ points: [[2, 1], [5, 1], [5, 3], [2, 3]], look: "wrong" }],
            dots: [
              { at: [2, 3], label: "only 2 tall", tone: "red" },
              { at: [5, 3], tone: "red" },
            ],
          },
        },
        {
          label: "(2,4) & (5,4)",
          correct: true,
          say: "Correct! The bottom side runs from 2 to 5, so it is 3 units long. Every side must be 3, so the top corners sit at 1 plus 3, which is 4 up.",
          frame: {
            shapes: [{ points: [[2, 1], [5, 1], [5, 4], [2, 4]], look: "correct" }],
            dots: [
              { at: [2, 4], label: "(2,4)", tone: "green" },
              { at: [5, 4], label: "(5,4)", tone: "green" },
              { at: [2, 1], tone: "gold" },
              { at: [5, 1], tone: "gold" },
            ],
          },
        },
      ],
    },
    {
      title: "Task 3 · Which way did it go?",
      prompt: "A shape moves from (7,3) to (2,3). How would you describe that translation?",
      conceptId: "10.1",
      options: [
        {
          label: "5 left",
          correct: true,
          say: "Yes. The across number went from 7 down to 2, so it moved 5 left. The up number never changed, so there is no vertical part at all.",
          frame: {
            dots: [{ at: [7, 3], label: "(7,3)", tone: "gold" }, { at: [2, 3], label: "(2,3) ✓", tone: "green" }],
            arrows: [{ from: [7, 3], to: [2, 3] }],
          },
        },
        {
          label: "5 right",
          correct: false,
          say: "Check the numbers again - 7 going to 2 is getting smaller, and smaller across means left.",
          frame: {
            dots: [{ at: [7, 3], label: "(7,3)", tone: "gold" }, { at: [10, 3], label: "right goes the wrong way ✗", tone: "red" }],
            arrows: [{ from: [7, 3], to: [10, 3] }],
          },
        },
        {
          label: "5 left, 3 down",
          correct: false,
          say: "The across part is right, but look at the up number - it stayed at 3 the whole time, so there is no down move.",
          frame: {
            dots: [{ at: [7, 3], label: "(7,3)", tone: "gold" }, { at: [2, 0], label: "(2,0) ✗ - dropped too far", tone: "red" }],
            arrows: [{ from: [7, 3], to: [2, 0] }],
          },
        },
        {
          label: "3 left",
          correct: false,
          say: "Count the squares between 7 and 2 - that is 5, not 3.",
          frame: {
            dots: [{ at: [7, 3], label: "(7,3)", tone: "gold" }, { at: [4, 3], label: "(4,3) ✗ - not far enough", tone: "red" }],
            arrows: [{ from: [7, 3], to: [4, 3] }],
          },
        },
      ],
    },
    {
      title: "Task 4 · Same shape, new place",
      prompt: "A triangle at (1,1), (3,1), (2,3) is translated 4 right and 4 up. Which corner is NOT part of the new triangle?",
      conceptId: "10.1",
      options: [
        {
          label: "(5, 5)",
          correct: false,
          say: "That one is in the new triangle - 1 plus 4 is 5 across, and 1 plus 4 is 5 up.",
          frame: {
            shapes: [
              { points: [[1, 1], [3, 1], [2, 3]], look: "ghost" },
              { points: [[5, 5], [7, 5], [6, 7]], look: "correct" },
            ],
            dots: [{ at: [5, 5], label: "(5,5) is in it", tone: "green" }],
          },
        },
        {
          label: "(6, 7)",
          correct: false,
          say: "That one is in it too - the top corner (2,3) plus 4 and 4 lands exactly there.",
          frame: {
            shapes: [
              { points: [[1, 1], [3, 1], [2, 3]], look: "ghost" },
              { points: [[5, 5], [7, 5], [6, 7]], look: "correct" },
            ],
            dots: [{ at: [6, 7], label: "(6,7) is in it", tone: "green" }],
          },
        },
        {
          label: "(7, 7)",
          correct: true,
          say: "Well spotted. Adding 4 and 4 to each corner gives (5,5), (7,5) and (6,7). Nothing lands on (7,7).",
          frame: {
            shapes: [
              { points: [[1, 1], [3, 1], [2, 3]], look: "ghost" },
              { points: [[5, 5], [7, 5], [6, 7]], look: "correct" },
            ],
            dots: [{ at: [7, 7], label: "(7,7) is not a corner ✓", tone: "red" }],
          },
        },
        {
          label: "(7, 5)",
          correct: false,
          say: "That one is in it - the corner at (3,1) plus 4 and 4 lands there.",
          frame: {
            shapes: [
              { points: [[1, 1], [3, 1], [2, 3]], look: "ghost" },
              { points: [[5, 5], [7, 5], [6, 7]], look: "correct" },
            ],
            dots: [{ at: [7, 5], label: "(7,5) is in it", tone: "green" }],
          },
        },
      ],
    },
    {
      title: "Task 5 · Read the coordinate",
      setup: {},
      drag: { from: [0, 0], to: [3, 7], hint: "put the point here" },
      prompt: "Which coordinate is 3 across and 7 up?",
      conceptId: "10.2",
      options: [
        {
          label: "(3, 7)",
          correct: true,
          say: "Correct. Across first, then up - that is always the order.",
          frame: { dots: [{ at: [3, 7], label: "(3,7) ✓", tone: "green" }] },
        },
        {
          label: "(7, 3)",
          correct: false,
          say: "That is the same two numbers the other way round, which puts you somewhere completely different. Across always comes first.",
          frame: { dots: [{ at: [7, 3], label: "(7,3) ✗ - swapped", tone: "red" }, { at: [3, 7], label: "should be here", tone: "gold" }] },
        },
      ],
    },
    {
      title: "Task 6 · Find the fourth corner",
      prompt: "Three corners of a rectangle are (1,2), (6,2) and (6,5). Where is the fourth?",
      conceptId: "10.2",
      options: [
        {
          label: "(1, 5)",
          correct: true,
          say: "Yes. Opposite sides of a rectangle are equal and parallel, so the last corner lines up under (6,5) and across from (1,2).",
          frame: {
            shapes: [{ points: [[1, 2], [6, 2], [6, 5], [1, 5]], look: "correct" }],
            dots: [{ at: [1, 5], label: "(1,5) ✓", tone: "green" }],
          },
        },
        {
          label: "(5, 5)",
          correct: false,
          say: "That would not line up with the corner at (1,2) - the left side has to stay straight up and down.",
          frame: {
            shapes: [{ points: [[1, 2], [6, 2], [6, 5], [5, 5]], look: "wrong" }],
            dots: [{ at: [5, 5], label: "(5,5) ✗ - side is not straight", tone: "red" }],
          },
        },
      ],
    },
  ],

  // Phase 3. Free play with an immediate visual answer - no marking, no score.
  lab: {
    prompt: "Move the sliders and watch the square travel. The sum underneath shows exactly how the landing coordinate is worked out.",
    start: [2, 2],
    shape: [[0, 0], [2, 0], [2, 2], [0, 2]],
    range: { min: -3, max: 5 },
  },

  // Phase 3 also asks them to say the rule back before being tested on it.
  recitePrompts: [
    {
      ask: "In your own words - what is a translation?",
      answer: "Sliding a shape in a straight direction across a grid, without turning it, flipping it, or changing its size.",
    },
    {
      ask: "How do you describe a translation so someone else could copy it exactly?",
      answer: "Say how many squares it moves across - left or right - and then how many it moves up or down.",
    },
    {
      ask: "What is always true about the lines joining each old corner to its new one?",
      answer: "They are all parallel and all exactly the same length, because every corner travels the same journey.",
    },
    {
      ask: "Which number in a coordinate comes first, and what does it mean?",
      answer: "The across number comes first - how far along the bottom - and then the up number.",
    },
  ],

  // Work these on paper, then check - real user direction 2026-09-14: "they
  // can write down in rough note and check as well".
  writtenPractice: [
    { question: "A triangle has corners at (1,1), (4,1) and (2,4). Write the three new corners after a translation of 3 right and 2 up.", answer: "(4,3), (7,3) and (5,6). Add 3 to every across number and 2 to every up number." },
    { question: "A shape moves from (9,8) to (4,3). Describe the translation in words.", answer: "5 left and 5 down. 9 take away 4 is 5 across, and 8 take away 3 is 5 down." },
    { question: "Plot (2,7), (2,3) and (8,3). What are the coordinates of the fourth corner of the rectangle, and how long are its sides?", answer: "(8,7). The short sides are 4 units and the long sides are 6 units." },
    { question: "A square has one corner at (3,2) and sides 4 units long, going right and up. Write all four corners.", answer: "(3,2), (7,2), (7,6) and (3,6)." },
    { question: "A shape is translated 6 right and 3 down, then 2 left and 5 up. Write the single translation that would do the same job.", answer: "4 right and 2 up. Across: 6 take away 2 is 4. Up: 5 take away 3 is 2." },
    { question: "Point P is at (5,5). Point Q is 3 left of P. Point R is 4 up from Q. Write the coordinates of Q and R.", answer: "Q is (2,5) and R is (2,9)." },
  ],

  // Phase 4. Straight recall first, then a question that needs the idea
  // applied somewhere it was not taught.
  assessment: {
    partA: [
      {
        title: "Q1 · Reverse the translation",
        prompt: "Shape A translates 5 right and 2 up to reach B. How do you describe the translation from B back to A?",
        conceptId: "10.1",
        options: [
          {
            label: "5 left, 2 down",
            correct: true,
            say: "Right. Going back reverses both parts - left instead of right, down instead of up.",
            frame: {
              shapes: [
                { points: [[1, 1], [3, 1], [2, 3]], look: "ghost" },
                { points: [[6, 3], [8, 3], [7, 5]], look: "correct" },
              ],
              arrows: [{ from: [6, 3], to: [1, 1] }],
              dots: [{ at: [1, 1], label: "back to A", tone: "green" }],
            },
          },
          {
            label: "5 right, 2 down",
            correct: false,
            say: "Only half reversed. Going back must undo the sideways move too, so it is 5 left, not right.",
            frame: {
              shapes: [
                { points: [[6, 3], [8, 3], [7, 5]], look: "ghost" },
                { points: [[11, 1], [13, 1], [12, 3]], look: "wrong" },
              ],
              dots: [{ at: [10, 1], label: "off the grid ✗", tone: "red" }],
            },
          },
        ],
      },
      {
        title: "Q2 · Slide a point",
        setup: { dots: [{ at: [2, 5], label: "(2,5)", tone: "gold" }] },
        drag: { from: [2, 5], to: [6, 2], hint: "slide it" },
        prompt: "The point (2,5) is translated 4 right and 3 down. Where does it land?",
        conceptId: "10.2",
        options: [
          {
            label: "(6, 8)",
            correct: false,
            say: "Careful - down means the y number gets smaller, not bigger. 5 take away 3 is 2.",
            frame: { dots: [{ at: [2, 5], tone: "gold", label: "(2,5)" }, { at: [6, 8], label: "(6,8) ✗", tone: "red" }], arrows: [{ from: [2, 5], to: [6, 8] }] },
          },
          {
            label: "(6, 2)",
            correct: true,
            say: "Yes. 2 plus 4 is 6 across, and 5 take away 3 is 2 up. It lands at (6,2).",
            frame: { dots: [{ at: [2, 5], tone: "gold", label: "(2,5)" }, { at: [6, 2], label: "(6,2) ✓", tone: "green" }], arrows: [{ from: [2, 5], to: [6, 2] }] },
          },
        ],
      },
      {
        title: "Q3 · Name the slide",
        prompt: "A square moves from (1,1) to (1,6). Describe the translation.",
        conceptId: "10.1",
        options: [
          { label: "5 up", correct: true, say: "Right. The across number stayed at 1, so it is a straight climb of 5.",
            frame: { dots: [{ at: [1, 1], label: "(1,1)", tone: "gold" }, { at: [1, 6], label: "(1,6) ✓", tone: "green" }], arrows: [{ from: [1, 1], to: [1, 6] }] } },
          { label: "5 right", correct: false, say: "Look again - the first number never changed, so it did not move sideways at all.",
            frame: { dots: [{ at: [1, 1], label: "(1,1)", tone: "gold" }, { at: [6, 1], label: "(6,1) ✗", tone: "red" }], arrows: [{ from: [1, 1], to: [6, 1] }] } },
          { label: "6 up", correct: false, say: "Count the squares between 1 and 6 - that is 5 steps, not 6.",
            frame: { dots: [{ at: [1, 1], label: "(1,1)", tone: "gold" }, { at: [1, 7], label: "(1,7) ✗ - one too far", tone: "red" }] } },
          { label: "1 up", correct: false, say: "That is only one square. From 1 up to 6 is 5 squares.",
            frame: { dots: [{ at: [1, 1], label: "(1,1)", tone: "gold" }, { at: [1, 2], label: "(1,2) ✗", tone: "red" }] } },
        ],
      },
      {
        title: "Q4 · Move a corner",
        prompt: "A corner sits at (4,6). It is translated 2 left and 4 down. Where does it land?",
        conceptId: "10.2",
        options: [
          { label: "(2, 2)", correct: true, say: "Yes. 4 take away 2 is 2 across, and 6 take away 4 is 2 up.",
            frame: { dots: [{ at: [4, 6], label: "(4,6)", tone: "gold" }, { at: [2, 2], label: "(2,2) ✓", tone: "green" }], arrows: [{ from: [4, 6], to: [2, 2] }] } },
          { label: "(6, 10)", correct: false, say: "Left and down both make numbers smaller - that answer added instead.",
            frame: { dots: [{ at: [4, 6], label: "(4,6)", tone: "gold" }, { at: [6, 10], label: "(6,10) ✗", tone: "red" }] } },
          { label: "(2, 10)", correct: false, say: "The across part is right, but down means the up number gets smaller, not bigger.",
            frame: { dots: [{ at: [4, 6], label: "(4,6)", tone: "gold" }, { at: [2, 10], label: "(2,10) ✗", tone: "red" }] } },
          { label: "(6, 2)", correct: false, say: "You have the two moves swapped - 2 left makes the first number smaller.",
            frame: { dots: [{ at: [4, 6], label: "(4,6)", tone: "gold" }, { at: [6, 2], label: "(6,2) ✗", tone: "red" }] } },
        ],
      },
      {
        title: "Q5 · True or not?",
        prompt: "After a translation, is the new shape the same size as the old one?",
        conceptId: "10.1",
        options: [
          { label: "Yes, always", correct: true, say: "Correct. A translation only changes where a shape is, never its size or which way it faces.",
            frame: { shapes: [{ points: [[1, 1], [3, 1], [2, 3]], look: "ghost" }, { points: [[6, 4], [8, 4], [7, 6]], look: "correct" }], arrows: [{ from: [1, 1], to: [6, 4] }] } },
          { label: "No, it gets bigger", correct: false, say: "Making a shape bigger is a different move altogether. A slide leaves the size exactly as it was.",
            frame: { shapes: [{ points: [[1, 1], [3, 1], [2, 3]], look: "ghost" }, { points: [[5, 3], [9, 3], [7, 7]], look: "wrong" }] } },
        ],
      },
    ],
    partB: [
      {
        title: "Q3 · Work backwards",
        prompt: "Point X is at (10,4). Point A is 6 units left and 2 units down from X. Where is point A?",
        conceptId: "10.2",
        options: [
          {
            label: "(4, 2)",
            correct: true,
            say: "Well worked out. Left means subtract across - 10 take away 6 is 4 - and down means subtract up - 4 take away 2 is 2.",
            frame: {
              dots: [
                { at: [10, 4], label: "X (10,4)", tone: "gold" },
                { at: [4, 2], label: "A (4,2) ✓", tone: "green" },
              ],
              arrows: [{ from: [10, 4], to: [4, 2] }],
            },
          },
          {
            label: "(16, 6)",
            correct: false,
            say: "That added instead of subtracting. Left and down both make the numbers smaller.",
            frame: {
              dots: [
                { at: [10, 4], label: "X (10,4)", tone: "gold" },
                { at: [10, 6], label: "adding goes the wrong way ✗", tone: "red" },
              ],
            },
          },
        ],
      },
      {
        title: "Q7 · Two moves in a row",
        prompt: "A shape at (2,2) moves 3 right and 1 up, then 1 left and 2 up. Where does it end up?",
        conceptId: "10.1",
        options: [
          { label: "(4, 5)", correct: true, say: "Well done - that needed both moves. Across: 2 plus 3 take away 1 is 4. Up: 2 plus 1 plus 2 is 5.",
            frame: { dots: [{ at: [2, 2], label: "start", tone: "gold" }, { at: [5, 3], label: "after move 1", tone: "blue" }, { at: [4, 5], label: "(4,5) ✓", tone: "green" }], arrows: [{ from: [2, 2], to: [5, 3] }, { from: [5, 3], to: [4, 5] }] } },
          { label: "(5, 5)", correct: false, say: "Close - you added the 3 right but forgot to take the 1 left back off again.",
            frame: { dots: [{ at: [2, 2], label: "start", tone: "gold" }, { at: [5, 5], label: "(5,5) ✗", tone: "red" }] } },
          { label: "(4, 3)", correct: false, say: "The across part is right. Both moves went up though - 1 and then 2, so 3 in total.",
            frame: { dots: [{ at: [2, 2], label: "start", tone: "gold" }, { at: [4, 3], label: "(4,3) ✗", tone: "red" }] } },
          { label: "(6, 5)", correct: false, say: "That went right twice. The second move was 1 left, which comes back off.",
            frame: { dots: [{ at: [2, 2], label: "start", tone: "gold" }, { at: [6, 5], label: "(6,5) ✗", tone: "red" }] } },
        ],
      },
      {
        title: "Q8 · Work out the missing move",
        prompt: "A shape starts at (8,2) and ends at (3,7). What was the translation?",
        conceptId: "10.1",
        options: [
          { label: "5 left, 5 up", correct: true, say: "Exactly. 8 down to 3 is 5 left, and 2 up to 7 is 5 up. Both parts happen to be the same size here.",
            frame: { dots: [{ at: [8, 2], label: "(8,2)", tone: "gold" }, { at: [3, 7], label: "(3,7) ✓", tone: "green" }], arrows: [{ from: [8, 2], to: [3, 7] }] } },
          { label: "5 right, 5 up", correct: false, say: "The up part is right. Across went from 8 to 3 though - smaller, so left.",
            frame: { dots: [{ at: [8, 2], label: "(8,2)", tone: "gold" }, { at: [13, 7], label: "off the grid ✗", tone: "red" }] } },
          { label: "3 left, 7 up", correct: false, say: "Those are the finishing numbers, not the journey. Work out the difference between start and end.",
            frame: { dots: [{ at: [8, 2], label: "(8,2)", tone: "gold" }, { at: [5, 9], label: "(5,9) ✗", tone: "red" }] } },
        ],
      },
      {
        title: "Q9 · Which shape can it be?",
        prompt: "Three corners are at (2,2), (6,2) and (6,6). If the fourth corner is (2,6), what shape is it?",
        conceptId: "10.2",
        options: [
          { label: "A square", correct: true, say: "Yes. Every side is 4 units long and all the corners are square, so it is a square.",
            frame: { shapes: [{ points: [[2, 2], [6, 2], [6, 6], [2, 6]], look: "correct" }], dots: [{ at: [2, 6], label: "(2,6) ✓", tone: "green" }] } },
          { label: "A rectangle but not a square", correct: false, say: "Measure the sides - along the bottom is 4, and up the side is also 4. When all four match, it is a square.",
            frame: { shapes: [{ points: [[2, 2], [6, 2], [6, 6], [2, 6]], look: "correct" }] } },
          { label: "A triangle", correct: false, say: "Four corners means four sides, so it cannot be a triangle.",
            frame: { shapes: [{ points: [[2, 2], [6, 2], [6, 6], [2, 6]], look: "correct" }] } },
        ],
      },
    ],
  },

  readymade: [
    {
      q: "What is a translation?",
      a: "A translation is sliding a shape in a straight direction across a grid without turning, flipping, or resizing it.",
    },
    {
      q: "Why are the connector lines parallel?",
      a: "Because every vertex travels the same distance in the same direction. Connecting lines drawn between each original vertex and its matching new vertex will always be parallel and equal in length.",
    },
    {
      q: "How do I describe a slide accurately?",
      a: "State how many units the shape moves horizontally first - left or right - and then how many it moves vertically, up or down.",
    },
    {
      q: "How do I remember it?",
      a: "Translation has 's', 'l' in it - just think of a smooth slide where nothing turns or twists!",
    },
  ],

  chatAnswers: [
    { question: "What is a translation?", answer: "A translation is sliding a shape in a straight direction across a grid without turning, flipping, or resizing it.", keywords: ["translation", "slide", "shape"], conceptId: "10.1" },
    { question: "How do I describe a translation?", answer: "Say how many units the shape moves horizontally first, left or right, and then vertically, up or down.", keywords: ["describe", "translation", "left", "right", "up", "down"], conceptId: "10.1" },
    { question: "What is a reflection?", answer: "A reflection flips a shape across a mirror line. Each point stays the same distance from the line on the opposite side.", keywords: ["reflection", "mirror", "flip"], conceptId: "10.2" },
    { question: "How do I find a missing corner?", answer: "Match the equal side lengths and parallel edges. On a square grid, trace across and up from the known corners to complete the shape.", keywords: ["missing", "corner", "shape", "square", "rectangle"], conceptId: "10.2" },
  ],
};
