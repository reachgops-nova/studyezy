import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Science Stage 4, Unit 10 (The Earth in space)
 * - mechanically generated 2026-11-10 from the already-vetted, real-textbook
 * content in lib/boardUnits/cambridge-4-science-10.ts (same concepts, key points,
 * examples, images/hotspots, quick checks and recite prompts), per real
 * user direction: "can you change the entire science and math cambridge
 * 4th grade books into this format". Every image/hotspot/focus region below
 * is reused byte-for-byte from that file, not re-authored.
 */
export const CAMBRIDGE_4_SCIENCE_10_INK: InkUnit = {
  unitKey: "cambridge-4-science-10",
  title: "The Earth in space",
  badge: "Grade 4 · Earth & Space · Unit 10",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "10.1",
      title: "🌐 Earth's rotation and axis",
      scenes: [
        {
          label: "1. Earth's rotation and axis",
          say: "The Earth spins on an imaginary line called its axis. One full rotation takes 24 hours (one day), and this rotation causes day and night. The axis is always tilted at 23.5 degrees.",
          ops: [
            { type: "text", value: "🌐 Earth's rotation and axis", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 290, color: "#0369a1", label: "Axis - the imaginary line the Earth spins (rotates) around, running between the North Pole and South Pole.\nOne complete rotation = one day (24 hours).\nThe Earth's rotation causes day and night.\nThe axis is always tilted at 23.5 degrees, and always points in the same direction.\nThe equator is an imaginary line around the middle, dividing the Earth into the northern and southern hemispheres.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Rotation and axis",
          say: "The Earth spins around its axis once every 24 hours - that's a day. The axis runs from the North Pole to the South Pole, always tilted at 23.5 degrees.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit10-earth-in-space.png",
            "alt": "Five panels on the Earth in space: rotation and axis, why seasons happen, seasons around the world, satellites, and space junk.",
            "title": "The Earth in space",
            "hotspots": [
              {
                "label": "North Pole",
                "at": [
                  25,
                  23
                ],
                "note": "Top of the axis.",
                "tone": "gold"
              },
              {
                "label": "Axis (tilted 23.5 degrees)",
                "at": [
                  32.25,
                  29
                ],
                "note": "The imaginary line it spins around.",
                "tone": "green"
              },
              {
                "label": "Equator",
                "at": [
                  4.4,
                  30
                ],
                "note": "The middle line, dividing hemispheres.",
                "tone": "blue"
              },
              {
                "label": "South Pole",
                "at": [
                  7,
                  74
                ],
                "note": "Bottom of the axis.",
                "tone": "red"
              }
            ],
            "focus": {
              "x": 0,
              "y": 0,
              "w": 41,
              "h": 100
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. How long does it take the Earth to make one complete rotation?\n2. What does the Earth's rotation cause?\n3. At what angle is the Earth's axis tilted?", labelSize: 18 },
            { type: "text", value: "1) One day - 24 hours. (p.133)\n2) Day and night. (p.133)\n3) 23.5 degrees. (p.134)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What causes day and night, and how long does it take? The Earth's rotation on its axis - one full rotation takes 24 hours (one day).",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What causes day and night, and how long does it take?\n\nThe Earth's rotation on its axis - one full rotation takes 24 hours (one day).", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "10.1-q1", prompt: "How long does one full rotation of the Earth take?", options: ["24 hours (one day)","365 days (one year)"], correctIndex: 0, explanation: "Correct - one rotation is one day." },
        { id: "10.1-q2", prompt: "What causes day and night on Earth?", options: ["The Earth rotating on its axis","The Earth orbiting the Sun"], correctIndex: 0, explanation: "Correct - one full rotation, every 24 hours, causes day and night." },
        { id: "10.1-q3", prompt: "One full rotation of the Earth on its axis takes...", options: ["24 hours","365 days"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "10.2",
      title: "🛰️ Earth's elliptical orbit",
      scenes: [
        {
          label: "1. Earth's elliptical orbit",
          say: "The Earth's path around the Sun is not a perfect circle - it is an ellipse, so we say the Earth takes an elliptical orbit. It travels anticlockwise, taking 365 days (about a year) to go all the way around.",
          ops: [
            { type: "text", value: "🛰️ Earth's elliptical orbit", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "The Earth's orbit is shaped like an ellipse, not a circle.\nThe Earth travels anticlockwise around the Sun.\nIt takes 365 days (approximately one year) to complete one orbit.\nThe Earth orbits the Sun at around 107,807 kilometres per hour.", labelSize: 20 },
          ],
        },
        {
          label: "2. An elliptical orbit",
          say: "The Earth doesn't travel in a perfect circle around the Sun - its path is an ellipse, and it takes 365 days, travelling anticlockwise, to go all the way round.",
          ops: [
            { type: "text", value: "An elliptical orbit", x: 60, y: 60, color: "#1e293b", size: 26 },
            { type: "box", x: 60, y: 120, w: 400, h: 220, color: "#16a34a", label: "Shape\nEllipse, not a circle\nThe Earth's orbit is oval-shaped.", labelSize: 17 },
            { type: "box", x: 480, y: 120, w: 400, h: 220, color: "#16a34a", label: "Direction\nAnticlockwise\nThe Earth travels anticlockwise around the Sun.", labelSize: 17 },
            { type: "box", x: 900, y: 120, w: 400, h: 220, color: "#16a34a", label: "Time\n365 days = 1 year\nOne full orbit takes about a year.", labelSize: 17 },
          ],
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What shape is the Earth's orbit around the Sun?\n2. How long does it take the Earth to orbit the Sun once?\n3. Which direction does the Earth travel around the Sun?", labelSize: 18 },
            { type: "text", value: "1) An ellipse - not a perfect circle. (p.133)\n2) 365 days - about one year. (p.133)\n3) Anticlockwise. (p.133)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What shape is the Earth's orbit, and how long does it take? An ellipse, not a perfect circle - it takes 365 days (about a year), travelling anticlockwise.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What shape is the Earth's orbit, and how long does it take?\n\nAn ellipse, not a perfect circle - it takes 365 days (about a year), travelling anticlockwise.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "10.2-q1", prompt: "What shape best describes the Earth's orbit around the Sun?", options: ["An ellipse (oval)","A perfect circle"], correctIndex: 0, explanation: "Correct - the Earth's orbit is elliptical, not a perfect circle." },
        { id: "10.2-q2", prompt: "The Earth's path around the Sun is best described as...", options: ["An ellipse","A perfect circle"], correctIndex: 0, explanation: "Correct." },
        { id: "10.2-q3", prompt: "What shape is the Earth's orbit?", options: ["An ellipse","A square"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "10.3",
      title: "☀️ Understanding the seasons: the real cause",
      scenes: [
        {
          label: "1. Understanding the seasons: the real cause",
          say: "It is a misconception that summer happens because Earth is closer to the Sun. The real cause is Earth's tilt: when a place is tilted towards the Sun, sunlight is more direct and concentrated (hotter); tilted away, sunlight is angled and spread out (colder).",
          ops: [
            { type: "text", value: "☀️ Understanding the seasons: the real cause", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Misconception: summer is NOT caused by the Earth being closer to the Sun, nor winter by being farther away.\nReal cause: as Earth orbits, different parts tilt towards or away from the Sun, because the axis always points the same way.\nTilted towards the Sun: direct/overhead rays = concentrated energy = hotter, with longer daylight hours.\nTilted away from the Sun: angled rays = spread-out energy = colder, with shorter daylight hours.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Direct or angled sunlight",
          say: "It's not about distance from the Sun. When a place is tilted towards the Sun, the light hits it directly and concentrated - hotter. Tilted away, the light spreads out at an angle - colder.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit10-earth-in-space.png",
            "alt": "Five panels on the Earth in space: rotation and axis, why seasons happen, seasons around the world, satellites, and space junk.",
            "title": "The Earth in space",
            "hotspots": [
              {
                "label": "Concentrated Light = Hotter",
                "at": [
                  49.5,
                  46
                ],
                "note": "Direct, overhead sunlight.",
                "tone": "gold"
              },
              {
                "label": "Angled Light = Colder",
                "at": [
                  65.25,
                  46
                ],
                "note": "Spread-out, angled sunlight.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 41,
              "y": 0,
              "w": 32,
              "h": 52
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. Is it true that summer happens because the Earth is closer to the Sun?\n2. Why is it hotter when a place is tilted towards the Sun?\n3. Why is it colder when a place is tilted away from the Sun?", labelSize: 18 },
            { type: "text", value: "1) No - that is a misconception. The real cause is the Earth's tilt. (p.134)\n2) The Sun's rays hit more directly, concentrating the energy (light and heat). (p.134)\n3) The Sun's rays hit at an angle and are spread out over a larger area, so the energy is less concentrated. (p.135)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is the real cause of the seasons? The Earth's tilt - not its distance from the Sun. Being tilted towards the Sun gives direct, concentrated sunlight (hotter); tilted away gives angled, spread-out sunlight (colder).",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is the real cause of the seasons?\n\nThe Earth's tilt - not its distance from the Sun. Being tilted towards the Sun gives direct, concentrated sunlight (hotter); tilted away gives angled, spread-out sunlight (colder).", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "10.3-q1", prompt: "What actually causes the seasons?", options: ["The Earth's tilt, which changes which parts face the Sun directly","The changing distance between the Earth and the Sun"], correctIndex: 0, explanation: "Correct - the tilt causes different amounts of direct sunlight throughout the year." },
        { id: "10.3-q2", prompt: "Why is it summer in a place at a certain time of year?", options: ["That part of Earth is tilted towards the Sun","The Earth is closer to the Sun at that time"], correctIndex: 0, explanation: "Correct - being tilted towards the Sun causes direct, concentrated sunlight." },
        { id: "10.3-q3", prompt: "What really causes the seasons?", options: ["The Earth's tilt","Distance from the Sun"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "10.4",
      title: "🌍 Seasons around the world",
      scenes: [
        {
          label: "1. Seasons around the world",
          say: "The northern and southern hemispheres have opposite seasons at the same time. Some tropical places have just two seasons (rainy and dry) instead of four, and the equator has no seasons at all.",
          ops: [
            { type: "text", value: "🌍 Seasons around the world", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Northern and southern hemispheres have opposite seasons at the same time (summer in one = winter in the other).\nA year is 12 months, so each of the four seasons lasts about three months.\nTropical/subtropical places may have just two seasons: rainy (wet/monsoon) and dry.\nNo seasons at the equator - the Sun strikes at about the same angle every day, giving about 12 hours of sunlight daily, all year.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Opposite hemispheres",
          say: "While the northern hemisphere has summer, the southern hemisphere has winter - always the opposite, at the same time.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit10-earth-in-space.png",
            "alt": "Five panels on the Earth in space: rotation and axis, why seasons happen, seasons around the world, satellites, and space junk.",
            "title": "The Earth in space",
            "hotspots": [
              {
                "label": "Summer",
                "at": [
                  94.25,
                  20
                ],
                "note": "Northern hemisphere, in this example.",
                "tone": "gold"
              },
              {
                "label": "Winter",
                "at": [
                  77.5,
                  37
                ],
                "note": "Southern hemisphere, at the same time.",
                "tone": "blue"
              },
              {
                "label": "Opposite seasons at the same time",
                "at": [
                  90,
                  46
                ],
                "note": "Always opposite.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 73,
              "y": 0,
              "w": 27,
              "h": 52
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. If it is summer in the northern hemisphere, what season is it in the southern hemisphere?\n2. What two seasons do some tropical and subtropical places have, instead of four?\n3. Why are there no seasons at the equator?", labelSize: 18 },
            { type: "text", value: "1) Winter - the hemispheres have opposite seasons at the same time. (p.137)\n2) A rainy (wet/monsoon) season and a dry season. (p.137)\n3) The Sun strikes the Earth at about the same angle every day of the year there, giving about 12 hours of sunlight daily with no temperature difference. (p.137)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "Why do the northern and southern hemispheres have opposite seasons, and why does the equator have none? Opposite hemispheres tilt towards/away from the Sun at opposite times. The equator gets sunlight at about the same angle all year, so there's no seasonal change.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "Why do the northern and southern hemispheres have opposite seasons, and why does the equator have none?\n\nOpposite hemispheres tilt towards/away from the Sun at opposite times. The equator gets sunlight at about the same angle all year, so there's no seasonal change.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "10.4-q1", prompt: "It is winter in the northern hemisphere. What season is it in the southern hemisphere?", options: ["Summer","Winter, the same as the north"], correctIndex: 0, explanation: "Correct - the hemispheres always have opposite seasons at the same time." },
        { id: "10.4-q2", prompt: "Why does the equator have no seasons?", options: ["The Sun strikes it at about the same angle every day, all year","It has all four seasons at once"], correctIndex: 0, explanation: "Correct - roughly 12 hours of sunlight daily, with no temperature change." },
        { id: "10.4-q3", prompt: "When it's summer in the northern hemisphere, what season is it in the southern hemisphere?", options: ["Winter","Summer, the same as the north"], correctIndex: 0, explanation: "Correct - opposite hemispheres have opposite seasons." },
      ],
    },

    {
      topicId: "10.5",
      title: "🛰️ Satellites",
      scenes: [
        {
          label: "1. Satellites",
          say: "A natural satellite orbits a planet naturally, like the Moon orbiting Earth. An artificial satellite is human-built and orbits Earth, like the International Space Station.",
          ops: [
            { type: "text", value: "🛰️ Satellites", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 202, color: "#0369a1", label: "Natural satellite - an object that naturally orbits a planet, e.g. the Moon (Earth's natural satellite).\nThere are hundreds of natural satellites (moons) in the Solar System - Saturn alone has 82.\nArtificial satellites - built by humans, orbiting Earth: communication satellites, weather satellites, the International Space Station.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Natural and artificial satellites",
          say: "The Moon is a natural satellite - it orbits Earth naturally. The International Space Station is an artificial satellite - built and launched by people.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit10-earth-in-space.png",
            "alt": "Five panels on the Earth in space: rotation and axis, why seasons happen, seasons around the world, satellites, and space junk.",
            "title": "The Earth in space",
            "hotspots": [
              {
                "label": "Natural satellite (e.g. the Moon)",
                "at": [
                  50.75,
                  64
                ],
                "note": "Orbits naturally.",
                "tone": "gold"
              },
              {
                "label": "Artificial satellite (e.g. the ISS)",
                "at": [
                  67.25,
                  64
                ],
                "note": "Built by humans.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 41,
              "y": 52,
              "w": 32,
              "h": 48
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What is Earth's natural satellite called?\n2. How many natural satellites (moons) does Saturn have?\n3. Name two kinds of artificial satellites.", labelSize: 18 },
            { type: "text", value: "1) The Moon. (p.138)\n2) 82. (p.138)\n3) Any two of: communication satellites, weather satellites, the International Space Station. (p.138)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is the difference between a natural and an artificial satellite? A natural satellite (like the Moon) orbits a planet naturally. An artificial satellite (like the ISS) is built by humans.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is the difference between a natural and an artificial satellite?\n\nA natural satellite (like the Moon) orbits a planet naturally. An artificial satellite (like the ISS) is built by humans.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "10.5-q1", prompt: "Which of these is a natural satellite?", options: ["The Moon","The International Space Station"], correctIndex: 0, explanation: "Correct - the Moon is Earth's natural satellite." },
        { id: "10.5-q2", prompt: "The International Space Station is an example of...", options: ["An artificial satellite","A natural satellite"], correctIndex: 0, explanation: "Correct - it was built by humans." },
        { id: "10.5-q3", prompt: "Which is a natural satellite of Earth?", options: ["The Moon","A weather satellite"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "10.6",
      title: "🚀 Space junk",
      scenes: [
        {
          label: "1. Space junk",
          say: "Space junk is old spacecraft parts and dropped tools that orbit the Earth. Even tiny pieces are dangerous because they travel so fast, acting like bullets and threatening spacecraft and astronauts.",
          ops: [
            { type: "text", value: "🚀 Space junk", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Trillions of pieces of space junk are currently orbiting Earth.\nSpace junk includes old spacecraft and tools dropped during spacewalk repairs.\nEven very small pieces are hazardous because they travel so fast they act like bullets.\nSpace agencies are trying to invent ways to collect space junk and clean up space.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Space junk",
          say: "Trillions of pieces of space junk orbit the Earth - old spacecraft parts and dropped tools. Even tiny pieces are dangerous because they travel so fast.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit10-earth-in-space.png",
            "alt": "Five panels on the Earth in space: rotation and axis, why seasons happen, seasons around the world, satellites, and space junk.",
            "title": "The Earth in space",
            "hotspots": [
              {
                "label": "Space junk - travels so fast it can act like a bullet",
                "at": [
                  89.75,
                  93
                ],
                "note": "Danger comes from speed.",
                "tone": "gold"
              }
            ],
            "focus": {
              "x": 73,
              "y": 52,
              "w": 27,
              "h": 48
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What is space junk?\n2. Why can even a tiny piece of space junk be dangerous?", labelSize: 18 },
            { type: "text", value: "1) Anything from old spacecraft to tools dropped by astronauts during spacewalks, orbiting the Earth. (p.139)\n2) Because it travels so fast that it acts like a bullet, and can damage spacecraft or harm astronauts. (p.139)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is space junk, and why is it dangerous? Old spacecraft parts and dropped tools orbiting Earth. Even tiny pieces are dangerous because they travel so fast they act like bullets.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is space junk, and why is it dangerous?\n\nOld spacecraft parts and dropped tools orbiting Earth. Even tiny pieces are dangerous because they travel so fast they act like bullets.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "10.6-q1", prompt: "Why can even a small piece of space junk be dangerous?", options: ["It travels extremely fast, like a bullet","It is radioactive"], correctIndex: 0, explanation: "Correct - its high speed makes it dangerous, no matter its size." },
        { id: "10.6-q2", prompt: "Why is a tiny piece of space junk still dangerous?", options: ["It travels so fast it can act like a bullet","It's too small to cause any real damage"], correctIndex: 0, explanation: "Correct." },
      ],
    },
  ],
};
