import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Primary Science Stage 4, Unit 7 (Sound)
 * - mechanically generated 2026-11-10 from the already-vetted, real-textbook
 * content in lib/boardUnits/cambridge-4-science-7.ts (same concepts, key points,
 * examples, images/hotspots, quick checks and recite prompts), per real
 * user direction: "can you change the entire science and math cambridge
 * 4th grade books into this format". Every image/hotspot/focus region below
 * is reused byte-for-byte from that file, not re-authored.
 */
export const CAMBRIDGE_4_SCIENCE_7_INK: InkUnit = {
  unitKey: "cambridge-4-science-7",
  title: "Sound",
  badge: "Grade 4 · Physics · Unit 7",
  languageCode: "en-IN",

  topics: [
    {
      topicId: "7.1",
      title: "🎵 How sounds are made",
      scenes: [
        {
          label: "1. How sounds are made",
          say: "Sounds are made when objects vibrate - move backwards and forwards (or up and down) very quickly. A sound travels from its source as a vibration, through gases, liquids and solids.",
          ops: [
            { type: "text", value: "🎵 How sounds are made", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 290, color: "#0369a1", label: "Vibrate = move backwards and forward (or up and down) very quickly.\nA sound travels from its source as a vibration.\nVibrations travel through gases, liquids and solids.\nVibrations cannot always be seen, but can often be felt.\nWhen you talk, your vocal cords vibrate.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Vibration makes sound",
          say: "A vibrating tuning fork can make water splash. Sound always starts as a vibration at its source.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit7-sound.png",
            "alt": "Six panels on sound: how sounds are made, how sound travels, volume, pitch and length, wind instruments' column of air, and pan pipes.",
            "title": "Sound",
            "hotspots": [
              {
                "label": "Vibration",
                "at": [
                  25.5,
                  25
                ],
                "note": "The tuning fork moves very fast.",
                "tone": "gold"
              },
              {
                "label": "Sound travels from its source as a vibration.",
                "at": [
                  31,
                  35
                ],
                "note": "The starting point of every sound.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 0,
              "y": 14,
              "w": 38,
              "h": 33
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What does 'vibrate' mean?\n2. Name three states of matter that vibrations can travel through.\n3. What vibrates when you talk?", labelSize: 18 },
            { type: "text", value: "1) To move backwards and forward (or up and down) very quickly. (p.92)\n2) Gases, liquids and solids. (p.92)\n3) Your vocal cords. (p.92)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is vibration, and what does it have to do with sound? Vibrate means to move backwards and forward (or up and down) very quickly. Every sound starts as a vibration at its source.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is vibration, and what does it have to do with sound?\n\nVibrate means to move backwards and forward (or up and down) very quickly. Every sound starts as a vibration at its source.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "7.1-q1", prompt: "A tuning fork makes water splash when it touches a bowl of water. What is causing this?", options: ["The tuning fork is vibrating","The water is boiling"], correctIndex: 0, explanation: "Correct - the vibrating tuning fork makes the water move." },
        { id: "7.1-q2", prompt: "What must be happening if an object is making a sound?", options: ["Part of it is vibrating","It is getting hotter"], correctIndex: 0, explanation: "Correct - if something makes a sound, part of it must be vibrating." },
        { id: "7.1-q3", prompt: "What is a vibration?", options: ["Moving backwards and forwards (or up and down) very quickly","Staying completely still"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "7.2",
      title: "👂 How sound travels",
      scenes: [
        {
          label: "1. How sound travels",
          say: "When something vibrates, it makes the air particles next to it vibrate too. The air particles bump against each other, passing the vibration from one particle to the next until it reaches your ear.",
          ops: [
            { type: "text", value: "👂 How sound travels", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Vibrating objects make the air particles around them vibrate.\nAir particles bump against each other, passing the vibration along.\nThe vibration eventually reaches your ear.\nYour brain works out what the sound is.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Vibration to your ear",
          say: "The vibration makes nearby air particles vibrate too. They bump into each other, passing the vibration along, all the way to your ear.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit7-sound.png",
            "alt": "Six panels on sound: how sounds are made, how sound travels, volume, pitch and length, wind instruments' column of air, and pan pipes.",
            "title": "Sound",
            "hotspots": [
              {
                "label": "Air particles bump into each other, passing the vibration to your ear.",
                "at": [
                  74.5,
                  27
                ],
                "note": "How sound reaches you.",
                "tone": "gold"
              }
            ],
            "focus": {
              "x": 38,
              "y": 14,
              "w": 62,
              "h": 33
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. How does a vibration get from its source to your ear?\n2. What happens after the vibration reaches your ear?", labelSize: 18 },
            { type: "text", value: "1) Air particles bump against each other, passing the vibration from one particle to the next until it reaches your ear. (p.94)\n2) Your brain works out what the sound is. (p.94)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "How does a vibration travel from its source to your ear? It makes the air particles around it vibrate. Those particles bump into each other, passing the vibration along until it reaches your ear.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "How does a vibration travel from its source to your ear?\n\nIt makes the air particles around it vibrate. Those particles bump into each other, passing the vibration along until it reaches your ear.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "7.2-q1", prompt: "How does a vibration travel from a speaker to your ear?", options: ["Air particles bump into each other, passing it along","The air disappears and reappears at your ear"], correctIndex: 0, explanation: "Correct - each air particle bumps the next, carrying the vibration to your ear." },
        { id: "7.2-q2", prompt: "How does a vibration actually get from its source to your ear?", options: ["Air particles pass it from one to the next","It travels instantly with no medium needed"], correctIndex: 0, explanation: "Correct." },
        { id: "7.2-q3", prompt: "What carries a vibration through the air to your ear?", options: ["Air particles bumping into each other","Light waves"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "7.3",
      title: "🔊 Volume",
      scenes: [
        {
          label: "1. Volume",
          say: "Volume means how loud a sound is. A bigger vibration makes a louder sound; a smaller vibration makes a quieter sound.",
          ops: [
            { type: "text", value: "🔊 Volume", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "Volume = how loud a sound is.\nA bigger vibration makes a louder sound.\nA smaller vibration makes a quieter sound.\nHitting a drum harder makes a bigger vibration.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Loud or quiet",
          say: "A small vibration makes a quiet sound. Hit the drum harder, and a bigger vibration makes a louder sound.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit7-sound.png",
            "alt": "Six panels on sound: how sounds are made, how sound travels, volume, pitch and length, wind instruments' column of air, and pan pipes.",
            "title": "Sound",
            "hotspots": [
              {
                "label": "Quiet sound - small vibration",
                "at": [
                  18.5,
                  60.5
                ],
                "note": "Small vibration.",
                "tone": "gold"
              },
              {
                "label": "Loud sound - big vibration",
                "at": [
                  34.75,
                  60.5
                ],
                "note": "Bigger vibration.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 0,
              "y": 48,
              "w": 50,
              "h": 24
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What word describes how loud or quiet a sound is?\n2. What happens to the vibration when you hit a drum harder?", labelSize: 18 },
            { type: "text", value: "1) Volume. (p.93)\n2) It makes a bigger vibration, and a louder sound. (p.93)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is volume, and what changes it? Volume is how loud a sound is. A bigger vibration makes it louder; a smaller vibration makes it quieter.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is volume, and what changes it?\n\nVolume is how loud a sound is. A bigger vibration makes it louder; a smaller vibration makes it quieter.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "7.3-q1", prompt: "A drum is hit gently, making a small vibration. What kind of sound does this make?", options: ["A quiet sound","A loud sound"], correctIndex: 0, explanation: "Correct - a small vibration makes a quiet sound." },
        { id: "7.3-q2", prompt: "What makes a sound louder?", options: ["A bigger vibration","A smaller vibration"], correctIndex: 0, explanation: "Correct." },
        { id: "7.3-q3", prompt: "What makes a sound quieter?", options: ["A smaller vibration","A bigger vibration"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "7.4",
      title: "🎸 Musical instruments and pitch",
      scenes: [
        {
          label: "1. Musical instruments and pitch",
          say: "Pitch is how high or low a sound is. The length of a vibrating object affects its pitch: shorter objects vibrate faster and make a higher pitch; longer objects vibrate slower and make a lower pitch.",
          ops: [
            { type: "text", value: "🎸 Musical instruments and pitch", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 246, color: "#0369a1", label: "A guitar is a string instrument - plucking the strings makes them vibrate.\nPitch = how high or low a sound is.\nShorter objects vibrate faster, making a higher pitch.\nLonger objects vibrate slower, making a lower pitch.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: Shorter or longer, higher or lower",
          say: "A shorter string or ruler vibrates faster, giving a higher pitch. A longer one vibrates slower, giving a lower pitch.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit7-sound.png",
            "alt": "Six panels on sound: how sounds are made, how sound travels, volume, pitch and length, wind instruments' column of air, and pan pipes.",
            "title": "Sound",
            "hotspots": [
              {
                "label": "Shorter = vibrates faster = HIGHER pitch",
                "at": [
                  62.5,
                  65.4
                ],
                "note": "Fast vibration.",
                "tone": "gold"
              },
              {
                "label": "Longer = vibrates slower = LOWER pitch",
                "at": [
                  90.75,
                  65.4
                ],
                "note": "Slow vibration.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 50,
              "y": 48,
              "w": 50,
              "h": 24
            }
          },
        },
        {
          label: "3. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What is pitch?\n2. Why does a shorter guitar string or ruler make a higher-pitched sound?\n3. What kind of instrument is a guitar, and what makes its sound?", labelSize: 18 },
            { type: "text", value: "1) How high or low a sound is. (p.97)\n2) A shorter object vibrates faster, and the faster something vibrates, the higher its pitch. (p.98)\n3) A string instrument - plucking (pulling or picking) the strings makes them vibrate. (p.96)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "4. 💡 Remember this",
          say: "What is pitch, and how does the length of a vibrating object affect it? Pitch is how high or low a sound is. A shorter object vibrates faster and gives a higher pitch; a longer object vibrates slower and gives a lower pitch.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "What is pitch, and how does the length of a vibrating object affect it?\n\nPitch is how high or low a sound is. A shorter object vibrates faster and gives a higher pitch; a longer object vibrates slower and gives a lower pitch.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "7.4-q1", prompt: "Which vibrates faster, and makes a higher pitch: a shorter ruler or a longer ruler?", options: ["The shorter ruler","The longer ruler"], correctIndex: 0, explanation: "Correct - shorter objects vibrate faster, making a higher pitch." },
        { id: "7.4-q2", prompt: "A guitarist presses a string to make it shorter. What happens to the pitch?", options: ["It gets higher","It gets lower"], correctIndex: 0, explanation: "Correct - a shorter string vibrates faster, giving a higher pitch." },
        { id: "7.4-q3", prompt: "Which makes a higher-pitched sound: a shorter or a longer vibrating object?", options: ["A shorter object","A longer object"], correctIndex: 0, explanation: "Correct." },
      ],
    },

    {
      topicId: "7.5",
      title: "🎶 Wind instruments and the column of air",
      scenes: [
        {
          label: "1. Wind instruments and the column of air",
          say: "In a wind instrument like a recorder, the air itself vibrates to make a sound. The amount of air - the column of air - changes the pitch: a longer column gives a lower pitch, a shorter column gives a higher pitch.",
          ops: [
            { type: "text", value: "🎶 Wind instruments and the column of air", x: 60, y: 60, color: "#1e293b", size: 28 },
            { type: "box", x: 60, y: 120, w: 1260, h: 290, color: "#0369a1", label: "Wind instruments make sound when the air inside them vibrates.\nThe column of air = the amount of air inside (e.g. in a bottle).\nLonger column of air = lower pitch.\nShorter column of air = higher pitch.\nPan pipes are a wind instrument made of pipes of different lengths, played in Peru for 5000 years.", labelSize: 20 },
          ],
        },
        {
          label: "2. 🖼️ Explore: The column of air",
          say: "Blowing across bottles with different amounts of water changes the column of air inside - a longer column gives a lower pitch, a shorter column gives a higher pitch.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit7-sound.png",
            "alt": "Six panels on sound: how sounds are made, how sound travels, volume, pitch and length, wind instruments' column of air, and pan pipes.",
            "title": "Sound",
            "hotspots": [
              {
                "label": "Longer column of air = LOWER pitch",
                "at": [
                  24.5,
                  89.6
                ],
                "note": "More water, longer air column.",
                "tone": "gold"
              },
              {
                "label": "Shorter column of air = HIGHER pitch",
                "at": [
                  39.5,
                  89.6
                ],
                "note": "Less water, shorter air column.",
                "tone": "green"
              }
            ],
            "focus": {
              "x": 0,
              "y": 73,
              "w": 62,
              "h": 27
            }
          },
        },
        {
          label: "3. 🖼️ Explore: Pan pipes",
          say: "Pan pipes work the same way as the musical bottles - each pipe has a different length, giving a different pitch. People have played them in Peru for 5000 years.",
          ops: [],
          image: {
            "src": "/board-art/cambridge-4-science-unit7-sound.png",
            "alt": "Six panels on sound: how sounds are made, how sound travels, volume, pitch and length, wind instruments' column of air, and pan pipes.",
            "title": "Sound",
            "hotspots": [
              {
                "label": "Pan pipes - played in Peru for 5000 years",
                "at": [
                  98.75,
                  89.6
                ],
                "note": "Different pipe lengths, different pitches.",
                "tone": "gold"
              }
            ],
            "focus": {
              "x": 62,
              "y": 73,
              "w": 38,
              "h": 27
            }
          },
        },
        {
          label: "4. ✍️ Try it yourself",
          say: "Your turn! Think about these questions before checking the answers.",
          ops: [
            { type: "text", value: "✍️ Try it yourself", x: 60, y: 50, color: PRACTICE_COLOR, size: 24 },
            { type: "box", x: 60, y: 110, w: 610, h: 280, color: PRACTICE_COLOR, label: "1. What is the 'column of air' in a musical bottle?\n2. Does a bottle with more water (a shorter column of air) make a higher or lower pitch than an empty one?\n3. How long have people in Peru played pan pipes?", labelSize: 18 },
            { type: "text", value: "1) The amount of air inside the bottle. (p.99)\n2) A higher pitch - a shorter column of air gives a higher pitch. (p.99)\n3) About 5000 years. (p.100)", x: 720, y: 150, color: "#64748b", size: 16 },
          ],
        },
        {
          label: "5. 💡 Remember this",
          say: "How does the column of air in a wind instrument affect its pitch? A longer column of air gives a lower pitch. A shorter column of air gives a higher pitch.",
          ops: [
            { type: "text", value: "💡 Remember this", x: 60, y: 60, color: TIP_COLOR, size: 26 },
            { type: "box", x: 60, y: 120, w: 1260, h: 220, color: TIP_COLOR, label: "How does the column of air in a wind instrument affect its pitch?\n\nA longer column of air gives a lower pitch. A shorter column of air gives a higher pitch.", labelSize: 22 },
          ],
        },
      ],
      questions: [
        { id: "7.5-q1", prompt: "Which bottle makes the lowest-pitched sound: the one with the longest column of air, or the shortest?", options: ["The one with the longest column of air","The one with the shortest column of air"], correctIndex: 0, explanation: "Correct - a longer column of air gives a lower pitch." },
        { id: "7.5-q2", prompt: "A bottle is nearly full of water, leaving a short column of air. What pitch does it make when you blow across it?", options: ["A high pitch","A low pitch"], correctIndex: 0, explanation: "Correct - a shorter column of air gives a higher pitch." },
        { id: "7.5-q3", prompt: "Which gives a lower pitch: a longer column of air, or a shorter one?", options: ["A longer column of air","A shorter column of air"], correctIndex: 0, explanation: "Correct." },
      ],
    },
  ],
};
