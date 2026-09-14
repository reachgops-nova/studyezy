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
    },
  ],

  // Phase 1. One idea per press - the child sets the pace, nothing auto-plays
  // past them ("one by one and steady for the kids").
  conceptSteps: [
    {
      label: "1. Start at (1,2)",
      say: "Here is our triangle. Its bottom-left corner sits at 1 across and 2 up - we write that as (1,2).",
      frame: {
        shapes: [{ points: [[1, 2], [3, 2], [2, 4]], look: "live" }],
        dots: [{ at: [1, 2], label: "(1,2)", tone: "gold" }],
      },
    },
    {
      label: "2. Slide right 3",
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
  ],

  // Phase 2. Every option draws its own outcome, right or wrong - a wrong
  // answer shows the child exactly where that answer lands, which is the
  // most valuable single behaviour in the reference build.
  guidedTasks: [
    {
      title: "Task 1 · Slide challenge",
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
  ],

  // Phase 3. Free play with an immediate visual answer - no marking, no score.
  lab: {
    prompt: "Move the sliders and watch the square travel. The sum underneath shows exactly how the landing coordinate is worked out.",
    start: [2, 2],
    shape: [[0, 0], [2, 0], [2, 2], [0, 2]],
    range: { min: -3, max: 5 },
  },

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
};
