import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Science Stage 4, Unit 6 (Forces)
 * - mechanically generated 2026-11-10 from the already-vetted, real-textbook
 * content in lib/boardUnits/cambridge-4-science-6.ts (same concepts, key points,
 * examples, images/hotspots, quick checks and recite prompts), per real
 * user direction: "can you change the entire science and math cambridge
 * 4th grade books into this format". Every image/hotspot/focus region below
 * is reused byte-for-byte from that file, not re-authored.
 */
export const CAMBRIDGE_4_SCIENCE_6_INK: InkUnit = {
  unitKey: "cambridge-4-science-6",
  title: "Forces",
  badge: "Grade 4 · Physics · Unit 6",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "6.1",
      title: "👐 Applied forces and normal forces",
      scenes: [
        {
          label: "1. Applied forces and normal forces",
          say: "Pushes and pulls are forces called applied forces. A normal force only happens when objects are touching - like a wall pushing back when you lean on it.",
          ops: [
            { type: "text", value: "👐 Applied forces and normal forces", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Applied force - a push or pull applied to an object by a person or another object.\nExample: pushing a chair under a desk applies a force to the chair; pulling it out also applies a force to it.\nNormal force - only happens when objects are touching (e.g. a wall pushing back on you when you lean against it, or a chair pushing back when you sit on it).\nEven a still object, like you sitting on a chair, has forces acting on it.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Applied and normal forces",
          say: "Pushing an object applies a force to it - an applied force. When you lean against a wall, the wall pushes back - that's a normal force, which only happens when objects are touching.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit6-forces.png",
            "alt": "Six panels of forces: applied/normal force, force diagrams (weight/reaction), friction, gravity/air resistance, upthrust, water resistance and streamlining.",
            "title": "Forces",
            "hotspots": [
              {
                "label": "Applied Force",
                "at": [
                  15,
                  20
                ],
                "note": "A push or pull on an object.",
                "tone": "gold"
              },
              {
                "label": "Normal Force",
                "at": [
                  26,
                  27
                ],
                "note": "The wall pushing back - only when touching.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 0,
              "y": 13,
              "w": 33,
              "h": 44
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What is an applied force?\n2. When does a normal force happen?\n3. If you lean against a wall, what force is the wall applying back on you?", labelSize: 18 },
            { type: "text", value: "1) A push or a pull applied to an object by a person or another object. (p.76)\n2) Only when objects are touching. (p.77)\n3) A normal force. (p.77)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is an applied force, and what is a normal force? An applied force is a push or pull on an object. A normal force only happens when objects are touching, like a wall pushing back when you lean on it.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is an applied force, and what is a normal force?\n\nAn applied force is a push or pull on an object. A normal force only happens when objects are touching, like a wall pushing back when you lean on it.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "6.1-q1", prompt: "Pushing a box across the floor is an example of which force?", options: ["An applied force","A normal force"], correctIndex: 0, explanation: "Yes - a push you apply to an object is an applied force." },
        { id: "6.1-q2", prompt: "Sitting still on a chair, which force does the chair apply to you?", options: ["A normal force","An applied force"], correctIndex: 0, explanation: "Correct - the chair pushes back because you are touching it, even though nothing is moving." },
        { id: "6.1-q3", prompt: "A normal force only happens when objects are...", options: ["Touching","Far apart"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "6.2",
      title: "📐 Force diagrams: weight and reaction force",
      scenes: [
        {
          label: "1. Force diagrams: weight and reaction force",
          say: "Force diagrams use arrows to show forces: direction shows which way the force acts, and length shows strength. Weight (from gravity) and reaction force are a commonly used pair, acting in opposite directions.",
          ops: [
            { type: "text", value: "📐 Force diagrams: weight and reaction force", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 290, color: "#0369a1", label: "Force diagram arrows: direction = direction of the force; longer arrow = stronger force.\nForces act in pairs, in opposite directions.\nWeight - the downward force acting on all objects that are not falling, caused by gravity, measured in newtons (N).\nReaction force - an upward force that acts against a weight.\nExample: a mug on a table isn't moving, but its weight pulls down while the table's reaction force pushes up.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Weight and reaction force",
          say: "A resting mug isn't moving, but two forces still act on it: its weight pulling down, and a reaction force from the table pushing up, exactly balancing it.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit6-forces.png",
            "alt": "Six panels of forces: applied/normal force, force diagrams (weight/reaction), friction, gravity/air resistance, upthrust, water resistance and streamlining.",
            "title": "Forces",
            "hotspots": [
              {
                "label": "Reaction Force",
                "at": [
                  55,
                  20
                ],
                "note": "Pushes up, from the table.",
                "tone": "gold"
              },
              {
                "label": "Weight",
                "at": [
                  51,
                  39
                ],
                "note": "Pulls down, from gravity.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 33,
              "y": 13,
              "w": 34,
              "h": 44
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What does a longer force arrow mean in a force diagram?\n2. What is weight, and what unit is it measured in?\n3. A book rests on a table. What two forces act on it?", labelSize: 18 },
            { type: "text", value: "1) A stronger force. (p.78)\n2) The downward force on an object, caused by gravity, measured in newtons (N). (p.78)\n3) Its weight (down) and a reaction force from the table (up). (p.78)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What are weight and reaction force, and how do they relate for a resting object? Weight is the downward force from gravity; reaction force is the upward force against it. For a resting object, they are equal and opposite.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What are weight and reaction force, and how do they relate for a resting object?\n\nWeight is the downward force from gravity; reaction force is the upward force against it. For a resting object, they are equal and opposite.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "6.2-q1", prompt: "What is the reaction force in the mug-on-table example?", options: ["The upward force from the table","The downward pull of gravity"], correctIndex: 0, explanation: "Correct - the table pushes up against the mug's weight." },
        { id: "6.2-q2", prompt: "A book rests still on a table. What must be true of its weight and reaction force?", options: ["They are equal, balancing each other out","The reaction force must be bigger"], correctIndex: 0, explanation: "Correct - for a resting object, weight and reaction force are equal and opposite." },
        { id: "6.2-q3", prompt: "Weight is measured in which unit?", options: ["Newtons (N)","Metres (m)"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "6.3",
      title: "🧱 Friction",
      scenes: [
        {
          label: "1. Friction",
          say: "Friction is a force that acts in the opposite direction to an applied force, created by contact between an object and a surface. Friction slows moving objects down, and can be useful or not useful.",
          ops: [
            { type: "text", value: "🧱 Friction", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 290, color: "#0369a1", label: "Friction acts opposite to the applied force's direction.\nFriction is created by contact between an object and a surface.\nDifferent surfaces create different amounts of friction.\nFriction can be useful (e.g. gripping, striking a match) or not useful (e.g. making heavy furniture harder to push).\nFriction can be measured in newtons (N) with a force meter.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Friction opposes the push",
          say: "Friction acts in the opposite direction to the applied force, slowing the box down as it's pushed along the ground.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit6-forces.png",
            "alt": "Six panels of forces: applied/normal force, force diagrams (weight/reaction), friction, gravity/air resistance, upthrust, water resistance and streamlining.",
            "title": "Forces",
            "hotspots": [
              {
                "label": "Applied Force",
                "at": [
                  91,
                  30
                ],
                "note": "The push, moving the box right.",
                "tone": "gold"
              },
              {
                "label": "Friction",
                "at": [
                  82.5,
                  41
                ],
                "note": "Opposes the push.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 67,
              "y": 13,
              "w": 33,
              "h": 44
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Which direction does friction act, compared to the applied force?\n2. What creates friction?\n3. Give one example each of friction being useful and not useful.", labelSize: 18 },
            { type: "text", value: "1) The opposite direction. (p.79)\n2) Contact between an object and a surface. (p.79)\n3) Useful: e.g. striking a match, gripping an object. Not useful: e.g. making it harder to push heavy furniture. (p.80)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is friction, and which direction does it act? Friction is a force created by contact between an object and a surface, acting in the opposite direction to the applied force.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is friction, and which direction does it act?\n\nFriction is a force created by contact between an object and a surface, acting in the opposite direction to the applied force.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "6.3-q1", prompt: "A box is pushed to the right. Which direction does friction act?", options: ["To the left","To the right, same as the push"], correctIndex: 0, explanation: "Correct - friction always opposes the direction of the applied force." },
        { id: "6.3-q2", prompt: "Which is an example of friction being useful?", options: ["Gripping a jar lid to open it","Struggling to push heavy furniture across the floor"], correctIndex: 0, explanation: "Correct - friction between your hand and the lid helps you grip and turn it." },
        { id: "6.3-q3", prompt: "Friction acts in which direction, relative to the applied force?", options: ["The opposite direction","The same direction"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "6.4",
      title: "🪂 Gravity and air resistance",
      scenes: [
        {
          label: "1. Gravity and air resistance",
          say: "Gravity pulls objects towards huge objects like the Earth. As an object falls, air resistance (a type of friction with the air) pushes back - a bigger surface area means more air resistance and a slower fall.",
          ops: [
            { type: "text", value: "🪂 Gravity and air resistance", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 290, color: "#0369a1", label: "Gravity - the force with which the Sun, Earth, Moon and other huge objects pull objects towards themselves.\nGravity makes dropped objects fall, and keeps objects on the ground.\nAir resistance - the force of air pushing up on a falling/moving object; a type of friction, caused by contact with the surrounding air.\nBigger surface area = more air resistance = falls more slowly (a flat sheet of paper falls slower than the same paper scrunched up).\nA parachute uses a large canopy to increase air resistance and slow a fall - a bigger parachute takes longer to fall than a smaller one.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Air resistance and surface area",
          say: "Both the ball and the flat sheet are pulled down by gravity, but the flat sheet's bigger surface area means more air resistance, so it falls more slowly.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit6-forces.png",
            "alt": "Six panels of forces: applied/normal force, force diagrams (weight/reaction), friction, gravity/air resistance, upthrust, water resistance and streamlining.",
            "title": "Forces",
            "hotspots": [
              {
                "label": "Air Resistance",
                "at": [
                  9.5,
                  65
                ],
                "note": "Less on the small ball.",
                "tone": "gold"
              },
              {
                "label": "Gravity",
                "at": [
                  11.5,
                  83
                ],
                "note": "Pulls both down equally.",
                "tone": "blue"
              },
              {
                "label": "Air Resistance",
                "at": [
                  24,
                  64
                ],
                "note": "More on the flat sheet.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 0,
              "y": 55,
              "w": 33,
              "h": 45
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Why does a scrunched-up ball of paper fall faster than a flat sheet of the same paper?\n2. How does a parachute slow a fall?\n3. Would a bigger or smaller parachute take longer to land?", labelSize: 18 },
            { type: "text", value: "1) The flat sheet has a bigger surface area, so it experiences more air resistance and falls more slowly. (p.83)\n2) Its large canopy increases air resistance. (p.84)\n3) A bigger parachute - more area means more air resistance. (p.85)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What are gravity and air resistance? Gravity pulls objects towards the Earth (or other huge objects). Air resistance is a type of friction from the air pushing up on a falling object - more surface area means more air resistance.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What are gravity and air resistance?\n\nGravity pulls objects towards the Earth (or other huge objects). Air resistance is a type of friction from the air pushing up on a falling object - more surface area means more air resistance.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "6.4-q1", prompt: "Which falls more slowly: a flat sheet of paper or the same paper scrunched into a ball?", options: ["The flat sheet","The scrunched-up ball"], correctIndex: 0, explanation: "Correct - its bigger surface area means more air resistance, so it falls more slowly." },
        { id: "6.4-q2", prompt: "Which parachute takes longer to reach the ground: a large one or a small one?", options: ["The large parachute","The small parachute"], correctIndex: 0, explanation: "Correct - more area means more air resistance, so it falls more slowly." },
        { id: "6.4-q3", prompt: "Which object experiences more air resistance: one with a bigger surface area, or a smaller one?", options: ["The one with a bigger surface area","The smaller one"], correctIndex: 0, explanation: "Correct - bigger surface area means more air resistance." },
      ],
    },

    {
      topicId: "6.5",
      title: "🛁 Upthrust",
      scenes: [
        {
          label: "1. Upthrust",
          say: "Upthrust is the force of water pushing up on an object placed in it. Two forces act on an object in water: weight pulling down, and upthrust pushing up - which is why objects weigh less in water than in air.",
          ops: [
            { type: "text", value: "🛁 Upthrust", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Upthrust = 'up' + 'thrust' (a push) = a push upward.\nAn object in water has weight (down, from gravity) and upthrust (up, from the water) acting on it.\nA force meter shows a smaller reading for an object's weight in water than in air, because upthrust supports part of its weight.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Weighing less in water",
          say: "In air, the force meter reads the object's full weight. Lowered into water, upthrust pushes up on the object, so the force meter reads a smaller weight.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit6-forces.png",
            "alt": "Six panels of forces: applied/normal force, force diagrams (weight/reaction), friction, gravity/air resistance, upthrust, water resistance and streamlining.",
            "title": "Forces",
            "hotspots": [
              {
                "label": "Weight",
                "at": [
                  39.5,
                  83
                ],
                "note": "Full weight, measured in air.",
                "tone": "gold"
              },
              {
                "label": "Upthrust",
                "at": [
                  48.5,
                  70
                ],
                "note": "Pushes up in water.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 33,
              "y": 55,
              "w": 34,
              "h": 45
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What is upthrust?\n2. Why does an object weigh less in water than in air?\n3. What two forces act on an object under water?", labelSize: 18 },
            { type: "text", value: "1) The upward force of water pushing on an object placed in it. (p.86)\n2) Because upthrust from the water supports part of its weight. (p.86)\n3) Its weight (down) and upthrust (up). (p.86)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is upthrust, and why do objects weigh less in water? Upthrust is the upward force of water pushing on an object. Objects weigh less in water because upthrust supports part of their weight.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is upthrust, and why do objects weigh less in water?\n\nUpthrust is the upward force of water pushing on an object. Objects weigh less in water because upthrust supports part of their weight.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "6.5-q1", prompt: "Why does a force meter show a smaller reading when an object is lowered into water?", options: ["Upthrust supports part of its weight","The object actually becomes lighter"], correctIndex: 0, explanation: "Correct - upthrust pushes up on the object, so the force meter reads a smaller weight." },
        { id: "6.5-q2", prompt: "An object weighs 10N in air. In water, would you expect the force meter to read more or less than 10N?", options: ["Less than 10N","More than 10N"], correctIndex: 0, explanation: "Correct - upthrust from the water supports part of the object's weight." },
        { id: "6.5-q3", prompt: "What force pushes up on an object placed in water?", options: ["Upthrust","Water resistance"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "6.6",
      title: "🐬 Water resistance and streamlining",
      scenes: [
        {
          label: "1. Water resistance and streamlining",
          say: "Friction happens in water too - it's called water resistance, caused by contact between a moving object and the water. Streamlined shapes let objects move through water more easily, with less resistance.",
          ops: [
            { type: "text", value: "🐬 Water resistance and streamlining", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Water resistance - friction between a moving object and the surrounding water.\nStreamlined - a shape that allows an object to move through water (or air) more easily, with less resistance.\nMany animals (like sharks and turtles) have adapted a streamlined shape.\nHumans design streamlined objects too, like racing bikes, cars and boats, to reduce friction and move more easily.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Streamlined for less resistance",
          say: "A streamlined shape, like this dolphin, lets water flow smoothly around it - reducing water resistance so it can move faster and more easily.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit6-forces.png",
            "alt": "Six panels of forces: applied/normal force, force diagrams (weight/reaction), friction, gravity/air resistance, upthrust, water resistance and streamlining.",
            "title": "Forces",
            "hotspots": [
              {
                "label": "Streamlined shape",
                "at": [
                  88.5,
                  72
                ],
                "note": "Water flows smoothly around it - less resistance.",
                "tone": "gold"
              }
            ],
            "focus": {
              "x": 67,
              "y": 55,
              "w": 33,
              "h": 45
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What is water resistance?\n2. What does 'streamlined' mean?\n3. Name an animal and a human-made object that are both streamlined.", labelSize: 18 },
            { type: "text", value: "1) Friction between a moving object and the surrounding water. (p.87)\n2) A shape that lets an object move through water or air more easily, with less resistance. (p.87)\n3) Any real example, e.g. a shark or turtle (animal) and a racing bike, car, or boat (human-made). (p.88)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is water resistance, and what does streamlined mean? Water resistance is friction between a moving object and water. A streamlined shape lets an object move through water (or air) more easily, with less resistance.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is water resistance, and what does streamlined mean?\n\nWater resistance is friction between a moving object and water. A streamlined shape lets an object move through water (or air) more easily, with less resistance.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "6.6-q1", prompt: "Why are boat hulls often shaped to be streamlined?", options: ["To reduce water resistance and move more easily","To increase water resistance for extra grip"], correctIndex: 0, explanation: "Correct - a streamlined hull lets water flow around it smoothly, reducing friction." },
      ],
    },
  ],
};
