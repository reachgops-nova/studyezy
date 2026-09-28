import type { BoardUnit, ImageFrame } from "./types";

/**
 * Unit 7 - Sound.
 *
 * Cambridge Primary Science, Stage 4 (Hodder Education Learner's Book 4),
 * Physics strand, pages 90-103. Diagram art is real, NotebookLM-generated
 * illustration (Infographic studio, from the unit's own page-cited text as
 * the source) with hotspots laid over it - same method as Units 1-6, 8.
 *
 * Every definition below is pulled from the textbook's own text (vibration,
 * how sound travels through air particles, volume, pitch and the length of
 * a vibrating object, and wind instruments' column of air) rather than
 * invented, so the board and the real book teach the same words in the
 * same order.
 */

const SOUND_IMG = "/board-art/cambridge-4-science-unit7-sound.png";
const SOUND_ALT = "Six panels on sound: how sounds are made, how sound travels, volume, pitch and length, wind instruments' column of air, and pan pipes.";

const FULL_FOCUS = { x: 0, y: 0, w: 100, h: 100 };
const MADE_FOCUS = { x: 0, y: 14, w: 38, h: 33 };
const TRAVELS_FOCUS = { x: 38, y: 14, w: 62, h: 33 };
const VOLUME_FOCUS = { x: 0, y: 48, w: 50, h: 24 };
const PITCH_FOCUS = { x: 50, y: 48, w: 50, h: 24 };
const COLUMN_FOCUS = { x: 0, y: 73, w: 62, h: 27 };
const PANPIPES_FOCUS = { x: 62, y: 73, w: 38, h: 27 };

function frame(hotspots: NonNullable<ImageFrame["hotspots"]>, focus: ImageFrame["focus"] = FULL_FOCUS, motionPath?: ImageFrame["motionPath"]): { image: ImageFrame } {
  return {
    image: {
      src: SOUND_IMG,
      alt: SOUND_ALT,
      title: "Sound",
      hotspots,
      focus,
      motionPath,
    },
  };
}

export const CAMBRIDGE_4_SCIENCE_7: BoardUnit = {
  unitKey: "cambridge-4-science-7",
  title: "Sound",
  badge: "Grade 4 · Physics · Unit 7",
  gridMax: 10,
  stage: "diagram",

  intro: {
    covers: [
      "How sounds are made - vibration",
      "How sound travels through the air to your ear",
      "Volume: what makes a sound loud or quiet",
      "Pitch: what makes a sound high or low, and how length affects it",
      "Wind instruments and the column of air",
    ],
    outcomes: [
      "Explain that sound is made by vibration, and name materials it can travel through",
      "Describe how a sound's vibration travels through the air to your ear",
      "Explain what volume is and how a bigger vibration changes it",
      "Explain what pitch is and how the length of a vibrating object changes it",
      "Explain how a wind instrument's column of air changes its pitch",
    ],
  },

  concepts: [
    {
      conceptId: "7.1",
      title: "How sounds are made",
      icon: "🎵",
      summary:
        "Sounds are made when objects vibrate - move backwards and forwards (or up and down) very quickly. A sound travels from its source as a vibration, through gases, liquids and solids.",
      keyPoints: [
        "Vibrate = move backwards and forward (or up and down) very quickly.",
        "A sound travels from its source as a vibration.",
        "Vibrations travel through gases, liquids and solids.",
        "Vibrations cannot always be seen, but can often be felt.",
        "When you talk, your vocal cords vibrate.",
      ],
      pages: [92],
      storyReference: "How sounds are made, page 92",
      examples: [
        { question: "What does 'vibrate' mean?", answer: "To move backwards and forward (or up and down) very quickly. (p.92)" },
        { question: "Name three states of matter that vibrations can travel through.", answer: "Gases, liquids and solids. (p.92)" },
        { question: "What vibrates when you talk?", answer: "Your vocal cords. (p.92)" },
      ],
      quickCheck: [
        {
          title: "Quick check · what is vibrating",
          prompt: "A tuning fork makes water splash when it touches a bowl of water. What is causing this?",
          conceptId: "7.1",
          options: [
            { label: "The tuning fork is vibrating", correct: true, say: "Correct - the vibrating tuning fork makes the water move.", frame: frame([{ label: "Vibration", at: [25.5, 25], note: "The tuning fork vibrates.", tone: "gold" }], MADE_FOCUS) },
            { label: "The water is boiling", correct: false, say: "The water isn't being heated - it's moving because the tuning fork is vibrating against it.", frame: frame([{ label: "Vibration", at: [25.5, 25], note: "It's vibration, not heat.", tone: "red" }], MADE_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "7.2",
      title: "How sound travels",
      icon: "👂",
      summary:
        "When something vibrates, it makes the air particles next to it vibrate too. The air particles bump against each other, passing the vibration from one particle to the next until it reaches your ear.",
      keyPoints: [
        "Vibrating objects make the air particles around them vibrate.",
        "Air particles bump against each other, passing the vibration along.",
        "The vibration eventually reaches your ear.",
        "Your brain works out what the sound is.",
      ],
      pages: [94],
      storyReference: "How sounds travel, page 94",
      examples: [
        { question: "How does a vibration get from its source to your ear?", answer: "Air particles bump against each other, passing the vibration from one particle to the next until it reaches your ear. (p.94)" },
        { question: "What happens after the vibration reaches your ear?", answer: "Your brain works out what the sound is. (p.94)" },
      ],
      quickCheck: [
        {
          title: "Quick check · how vibration travels",
          prompt: "How does a vibration travel from a speaker to your ear?",
          conceptId: "7.2",
          options: [
            { label: "Air particles bump into each other, passing it along", correct: true, say: "Correct - each air particle bumps the next, carrying the vibration to your ear.", frame: frame([{ label: "Air particles bump into each other, passing the vibration to your ear.", at: [74.5, 27], note: "How the vibration reaches your ear.", tone: "gold" }], TRAVELS_FOCUS) },
            { label: "The air disappears and reappears at your ear", correct: false, say: "The vibration is passed along through bumping air particles, not by air vanishing and reappearing.", frame: frame([{ label: "Air particles bump into each other, passing the vibration to your ear.", at: [74.5, 27], note: "It travels through particles.", tone: "red" }], TRAVELS_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "7.3",
      title: "Volume",
      icon: "🔊",
      summary:
        "Volume means how loud a sound is. A bigger vibration makes a louder sound; a smaller vibration makes a quieter sound.",
      keyPoints: [
        "Volume = how loud a sound is.",
        "A bigger vibration makes a louder sound.",
        "A smaller vibration makes a quieter sound.",
        "Hitting a drum harder makes a bigger vibration.",
      ],
      pages: [93],
      storyReference: "Volume - loud and quiet sounds, page 93",
      examples: [
        { question: "What word describes how loud or quiet a sound is?", answer: "Volume. (p.93)" },
        { question: "What happens to the vibration when you hit a drum harder?", answer: "It makes a bigger vibration, and a louder sound. (p.93)" },
      ],
      quickCheck: [
        {
          title: "Quick check · loud or quiet",
          prompt: "A drum is hit gently, making a small vibration. What kind of sound does this make?",
          conceptId: "7.3",
          options: [
            { label: "A quiet sound", correct: true, say: "Correct - a small vibration makes a quiet sound.", frame: frame([{ label: "Quiet sound - small vibration", at: [18.5, 60.5], note: "Small vibration = quiet.", tone: "gold" }], VOLUME_FOCUS) },
            { label: "A loud sound", correct: false, say: "A loud sound needs a bigger vibration - hitting the drum harder.", frame: frame([{ label: "Loud sound - big vibration", at: [34.75, 60.5], note: "This needs a bigger vibration.", tone: "red" }], VOLUME_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "7.4",
      title: "Musical instruments and pitch",
      icon: "🎸",
      summary:
        "Pitch is how high or low a sound is. The length of a vibrating object affects its pitch: shorter objects vibrate faster and make a higher pitch; longer objects vibrate slower and make a lower pitch.",
      keyPoints: [
        "A guitar is a string instrument - plucking the strings makes them vibrate.",
        "Pitch = how high or low a sound is.",
        "Shorter objects vibrate faster, making a higher pitch.",
        "Longer objects vibrate slower, making a lower pitch.",
      ],
      pages: [96, 97, 98],
      storyReference: "Musical instruments around the world / Changing the pitch of a sound, pages 96-98",
      examples: [
        { question: "What is pitch?", answer: "How high or low a sound is. (p.97)" },
        { question: "Why does a shorter guitar string or ruler make a higher-pitched sound?", answer: "A shorter object vibrates faster, and the faster something vibrates, the higher its pitch. (p.98)" },
        { question: "What kind of instrument is a guitar, and what makes its sound?", answer: "A string instrument - plucking (pulling or picking) the strings makes them vibrate. (p.96)" },
      ],
      quickCheck: [
        {
          title: "Quick check · shorter or longer",
          prompt: "Which vibrates faster, and makes a higher pitch: a shorter ruler or a longer ruler?",
          conceptId: "7.4",
          options: [
            { label: "The shorter ruler", correct: true, say: "Correct - shorter objects vibrate faster, making a higher pitch.", frame: frame([{ label: "Shorter = vibrates faster = HIGHER pitch", at: [62.5, 65.4], note: "Faster vibration, higher pitch.", tone: "gold" }], PITCH_FOCUS) },
            { label: "The longer ruler", correct: false, say: "Longer objects vibrate slower, giving a lower pitch, not a higher one.", frame: frame([{ label: "Longer = vibrates slower = LOWER pitch", at: [90.75, 65.4], note: "This one is slower and lower.", tone: "red" }], PITCH_FOCUS) },
          ],
        },
      ],
    },
    {
      conceptId: "7.5",
      title: "Wind instruments and the column of air",
      icon: "🎶",
      summary:
        "In a wind instrument like a recorder, the air itself vibrates to make a sound. The amount of air - the column of air - changes the pitch: a longer column gives a lower pitch, a shorter column gives a higher pitch.",
      keyPoints: [
        "Wind instruments make sound when the air inside them vibrates.",
        "The column of air = the amount of air inside (e.g. in a bottle).",
        "Longer column of air = lower pitch.",
        "Shorter column of air = higher pitch.",
        "Pan pipes are a wind instrument made of pipes of different lengths, played in Peru for 5000 years.",
      ],
      pages: [99, 100],
      storyReference: "Volume and pitch in wind instruments / Making pan pipes, pages 99-100",
      examples: [
        { question: "What is the 'column of air' in a musical bottle?", answer: "The amount of air inside the bottle. (p.99)" },
        { question: "Does a bottle with more water (a shorter column of air) make a higher or lower pitch than an empty one?", answer: "A higher pitch - a shorter column of air gives a higher pitch. (p.99)" },
        { question: "How long have people in Peru played pan pipes?", answer: "About 5000 years. (p.100)" },
      ],
      quickCheck: [
        {
          title: "Quick check · column of air",
          prompt: "Which bottle makes the lowest-pitched sound: the one with the longest column of air, or the shortest?",
          conceptId: "7.5",
          options: [
            { label: "The one with the longest column of air", correct: true, say: "Correct - a longer column of air gives a lower pitch.", frame: frame([{ label: "Longer column of air = LOWER pitch", at: [24.5, 89.6], note: "Longest column, lowest pitch.", tone: "gold" }], COLUMN_FOCUS) },
            { label: "The one with the shortest column of air", correct: false, say: "A shorter column of air gives a higher pitch, not a lower one.", frame: frame([{ label: "Shorter column of air = HIGHER pitch", at: [39.5, 89.6], note: "This one is higher, not lower.", tone: "red" }], COLUMN_FOCUS) },
          ],
        },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. Vibration makes sound",
      conceptId: "7.1",
      say: "A vibrating tuning fork can make water splash. Sound always starts as a vibration at its source.",
      frame: frame(
        [
          { label: "Vibration", at: [25.5, 25], note: "The tuning fork moves very fast.", tone: "gold" },
          { label: "Sound travels from its source as a vibration.", at: [31, 35], note: "The starting point of every sound.", tone: "green" },
        ],
        MADE_FOCUS,
      ),
    },
    {
      label: "2. Vibration to your ear",
      conceptId: "7.2",
      say: "The vibration makes nearby air particles vibrate too. They bump into each other, passing the vibration along, all the way to your ear.",
      frame: frame(
        [
          { label: "Air particles bump into each other, passing the vibration to your ear.", at: [74.5, 27], note: "How sound reaches you.", tone: "gold" },
        ],
        TRAVELS_FOCUS,
      ),
    },
    {
      label: "3. Loud or quiet",
      conceptId: "7.3",
      say: "A small vibration makes a quiet sound. Hit the drum harder, and a bigger vibration makes a louder sound.",
      frame: frame(
        [
          { label: "Quiet sound - small vibration", at: [18.5, 60.5], note: "Small vibration.", tone: "gold" },
          { label: "Loud sound - big vibration", at: [34.75, 60.5], note: "Bigger vibration.", tone: "green" },
        ],
        VOLUME_FOCUS,
      ),
    },
    {
      label: "4. Shorter or longer, higher or lower",
      conceptId: "7.4",
      say: "A shorter string or ruler vibrates faster, giving a higher pitch. A longer one vibrates slower, giving a lower pitch.",
      frame: frame(
        [
          { label: "Shorter = vibrates faster = HIGHER pitch", at: [62.5, 65.4], note: "Fast vibration.", tone: "gold" },
          { label: "Longer = vibrates slower = LOWER pitch", at: [90.75, 65.4], note: "Slow vibration.", tone: "green" },
        ],
        PITCH_FOCUS,
      ),
    },
    {
      label: "5. The column of air",
      conceptId: "7.5",
      say: "Blowing across bottles with different amounts of water changes the column of air inside - a longer column gives a lower pitch, a shorter column gives a higher pitch.",
      frame: frame(
        [
          { label: "Longer column of air = LOWER pitch", at: [24.5, 89.6], note: "More water, longer air column.", tone: "gold" },
          { label: "Shorter column of air = HIGHER pitch", at: [39.5, 89.6], note: "Less water, shorter air column.", tone: "green" },
        ],
        COLUMN_FOCUS,
      ),
    },
    {
      label: "6. Pan pipes",
      conceptId: "7.5",
      say: "Pan pipes work the same way as the musical bottles - each pipe has a different length, giving a different pitch. People have played them in Peru for 5000 years.",
      frame: frame(
        [
          { label: "Pan pipes - played in Peru for 5000 years", at: [98.75, 89.6], note: "Different pipe lengths, different pitches.", tone: "gold" },
        ],
        PANPIPES_FOCUS,
      ),
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · What makes sound",
      prompt: "What must be happening if an object is making a sound?",
      conceptId: "7.1",
      setup: frame([], MADE_FOCUS),
      options: [
        { label: "Part of it is vibrating", correct: true, say: "Correct - if something makes a sound, part of it must be vibrating.", frame: frame([{ label: "Vibration", at: [25.5, 25], note: "Sound always means vibration.", tone: "green" }], MADE_FOCUS) },
        { label: "It is getting hotter", correct: false, say: "Temperature isn't what makes a sound - vibration is.", frame: frame([{ label: "Vibration", at: [25.5, 25], note: "Not about temperature.", tone: "red" }], MADE_FOCUS) },
      ],
    },
    {
      title: "Task 2 · Reaching your ear",
      prompt: "How does a vibration actually get from its source to your ear?",
      conceptId: "7.2",
      setup: frame([], TRAVELS_FOCUS),
      options: [
        { label: "Air particles pass it from one to the next", correct: true, say: "Correct.", frame: frame([{ label: "Air particles bump into each other, passing the vibration to your ear.", at: [74.5, 27], note: "Correct mechanism.", tone: "green" }], TRAVELS_FOCUS) },
        { label: "It travels instantly with no medium needed", correct: false, say: "Sound needs air particles (or another medium) to carry the vibration - it doesn't just appear at your ear.", frame: frame([{ label: "Air particles bump into each other, passing the vibration to your ear.", at: [74.5, 27], note: "A medium is required.", tone: "red" }], TRAVELS_FOCUS) },
      ],
    },
    {
      title: "Task 3 · Volume",
      prompt: "What makes a sound louder?",
      conceptId: "7.3",
      setup: frame([], VOLUME_FOCUS),
      options: [
        { label: "A bigger vibration", correct: true, say: "Correct.", frame: frame([{ label: "Loud sound - big vibration", at: [34.75, 60.5], note: "Bigger vibration = louder.", tone: "green" }], VOLUME_FOCUS) },
        { label: "A smaller vibration", correct: false, say: "A smaller vibration makes a quieter sound, not a louder one.", frame: frame([{ label: "Quiet sound - small vibration", at: [18.5, 60.5], note: "Smaller vibration = quieter.", tone: "red" }], VOLUME_FOCUS) },
      ],
    },
    {
      title: "Task 4 · Pitch",
      prompt: "A guitarist presses a string to make it shorter. What happens to the pitch?",
      conceptId: "7.4",
      setup: frame([], PITCH_FOCUS),
      options: [
        { label: "It gets higher", correct: true, say: "Correct - a shorter string vibrates faster, giving a higher pitch.", frame: frame([{ label: "Shorter = vibrates faster = HIGHER pitch", at: [62.5, 65.4], note: "Shorter means higher.", tone: "green" }], PITCH_FOCUS) },
        { label: "It gets lower", correct: false, say: "Shortening a string raises the pitch - lowering it would need a longer string.", frame: frame([{ label: "Longer = vibrates slower = LOWER pitch", at: [90.75, 65.4], note: "That's the opposite direction.", tone: "red" }], PITCH_FOCUS) },
      ],
    },
    {
      title: "Task 5 · Column of air",
      prompt: "A bottle is nearly full of water, leaving a short column of air. What pitch does it make when you blow across it?",
      conceptId: "7.5",
      setup: frame([], COLUMN_FOCUS),
      options: [
        { label: "A high pitch", correct: true, say: "Correct - a shorter column of air gives a higher pitch.", frame: frame([{ label: "Shorter column of air = HIGHER pitch", at: [39.5, 89.6], note: "Short column, high pitch.", tone: "green" }], COLUMN_FOCUS) },
        { label: "A low pitch", correct: false, say: "A low pitch needs a longer column of air (less water), not a shorter one.", frame: frame([{ label: "Longer column of air = LOWER pitch", at: [24.5, 89.6], note: "That needs more air, not less.", tone: "red" }], COLUMN_FOCUS) },
      ],
    },
  ],

  lab: {
    kind: "visual",
    prompt: "Touch each panel on the board and explain, in your own words, what it shows about sound.",
    start: [0, 0],
    shape: [[0, 0]],
    range: { min: 0, max: 1 },
  },

  recitePrompts: [
    { ask: "What is vibration, and what does it have to do with sound?", answer: "Vibrate means to move backwards and forward (or up and down) very quickly. Every sound starts as a vibration at its source.", conceptId: "7.1" },
    { ask: "How does a vibration travel from its source to your ear?", answer: "It makes the air particles around it vibrate. Those particles bump into each other, passing the vibration along until it reaches your ear.", conceptId: "7.2" },
    { ask: "What is volume, and what changes it?", answer: "Volume is how loud a sound is. A bigger vibration makes it louder; a smaller vibration makes it quieter.", conceptId: "7.3" },
    { ask: "What is pitch, and how does the length of a vibrating object affect it?", answer: "Pitch is how high or low a sound is. A shorter object vibrates faster and gives a higher pitch; a longer object vibrates slower and gives a lower pitch.", conceptId: "7.4" },
    { ask: "How does the column of air in a wind instrument affect its pitch?", answer: "A longer column of air gives a lower pitch. A shorter column of air gives a higher pitch.", conceptId: "7.5" },
  ],

  writtenPractice: [
    { question: "Explain, using the word 'vibrate', how your vocal cords let you talk.", answer: "When you talk, your vocal cords vibrate very quickly, and this vibration becomes the sound of your voice.", conceptId: "7.1" },
    { question: "Describe, step by step, how a vibration from a clap reaches a friend's ear across the room.", answer: "The clap makes the air particles next to your hands vibrate. Those particles bump into the next particles, passing the vibration along through the air, until it reaches your friend's ear.", conceptId: "7.2" },
    { question: "Explain why hitting a drum harder makes it louder.", answer: "Hitting it harder makes a bigger vibration, and a bigger vibration makes a louder sound (a higher volume).", conceptId: "7.3" },
    { question: "Two rulers overhang a table by different amounts. Explain which one will make the higher-pitched sound, and why.", answer: "The ruler with the shorter overhang will make the higher pitch, because a shorter vibrating length vibrates faster, and faster vibration means higher pitch.", conceptId: "7.4" },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · Vibration",
        prompt: "What is a vibration?",
        conceptId: "7.1",
        options: [
          { label: "Moving backwards and forwards (or up and down) very quickly", correct: true, say: "Correct.", frame: frame([{ label: "Vibration", at: [25.5, 25], note: "Correct definition.", tone: "green" }], MADE_FOCUS) },
          { label: "Staying completely still", correct: false, say: "A vibration is fast movement, the opposite of staying still.", frame: frame([{ label: "Vibration", at: [25.5, 25], note: "This is movement, not stillness.", tone: "red" }], MADE_FOCUS) },
        ],
      },
      {
        title: "Q2 · Reaching the ear",
        prompt: "What carries a vibration through the air to your ear?",
        conceptId: "7.2",
        options: [
          { label: "Air particles bumping into each other", correct: true, say: "Correct.", frame: frame([{ label: "Air particles bump into each other, passing the vibration to your ear.", at: [74.5, 27], note: "Correct.", tone: "green" }], TRAVELS_FOCUS) },
          { label: "Light waves", correct: false, say: "Sound travels via vibrating air particles, not light.", frame: frame([{ label: "Air particles bump into each other, passing the vibration to your ear.", at: [74.5, 27], note: "Not light.", tone: "red" }], TRAVELS_FOCUS) },
        ],
      },
      {
        title: "Q3 · Pitch and length",
        prompt: "Which makes a higher-pitched sound: a shorter or a longer vibrating object?",
        conceptId: "7.4",
        options: [
          { label: "A shorter object", correct: true, say: "Correct.", frame: frame([{ label: "Shorter = vibrates faster = HIGHER pitch", at: [62.5, 65.4], note: "Correct.", tone: "green" }], PITCH_FOCUS) },
          { label: "A longer object", correct: false, say: "Longer objects vibrate slower, giving a lower pitch.", frame: frame([{ label: "Longer = vibrates slower = LOWER pitch", at: [90.75, 65.4], note: "This one is lower, not higher.", tone: "red" }], PITCH_FOCUS) },
        ],
      },
    ],
    partB: [
      {
        title: "Q4 · Volume",
        prompt: "What makes a sound quieter?",
        conceptId: "7.3",
        options: [
          { label: "A smaller vibration", correct: true, say: "Correct.", frame: frame([{ label: "Quiet sound - small vibration", at: [18.5, 60.5], note: "Correct.", tone: "green" }], VOLUME_FOCUS) },
          { label: "A bigger vibration", correct: false, say: "A bigger vibration makes a sound louder, not quieter.", frame: frame([{ label: "Loud sound - big vibration", at: [34.75, 60.5], note: "This makes it louder.", tone: "red" }], VOLUME_FOCUS) },
        ],
      },
      {
        title: "Q5 · Column of air",
        prompt: "Which gives a lower pitch: a longer column of air, or a shorter one?",
        conceptId: "7.5",
        options: [
          { label: "A longer column of air", correct: true, say: "Correct.", frame: frame([{ label: "Longer column of air = LOWER pitch", at: [24.5, 89.6], note: "Correct.", tone: "green" }], COLUMN_FOCUS) },
          { label: "A shorter column of air", correct: false, say: "A shorter column of air gives a higher pitch, not lower.", frame: frame([{ label: "Shorter column of air = HIGHER pitch", at: [39.5, 89.6], note: "This one is higher.", tone: "red" }], COLUMN_FOCUS) },
        ],
      },
    ],
  },

  readymade: [
    { q: "What makes a sound?", a: "A vibration - an object moving backwards and forwards, or up and down, very quickly." },
    { q: "What is volume?", a: "How loud a sound is. A bigger vibration makes it louder; a smaller vibration makes it quieter." },
    { q: "What is pitch?", a: "How high or low a sound is. Shorter vibrating objects give a higher pitch; longer ones give a lower pitch." },
    { q: "How does the column of air affect a wind instrument's pitch?", a: "A longer column of air gives a lower pitch; a shorter column gives a higher pitch." },
  ],

  chatAnswers: [
    { question: "How are sounds made?", answer: "Sounds are made when objects vibrate - move backwards and forward, or up and down, very quickly. The vibration travels from its source through gases, liquids or solids.", keywords: ["sound", "vibrate", "vibration"], conceptId: "7.1" },
    { question: "How does sound travel to your ear?", answer: "A vibrating object makes nearby air particles vibrate. Those particles bump into each other, passing the vibration along until it reaches your ear, where your brain works out what the sound is.", keywords: ["sound travels", "air particles", "ear"], conceptId: "7.2" },
    { question: "What is volume?", answer: "Volume is how loud or quiet a sound is. A bigger vibration makes a louder sound; a smaller vibration makes a quieter sound.", keywords: ["volume", "loud", "quiet"], conceptId: "7.3" },
    { question: "What is pitch and how do you change it?", answer: "Pitch is how high or low a sound is. Shorter vibrating objects (like a shorter guitar string) vibrate faster and give a higher pitch; longer objects vibrate slower and give a lower pitch.", keywords: ["pitch", "high", "low", "length"], conceptId: "7.4" },
    { question: "How do wind instruments make different pitches?", answer: "In a wind instrument, the air itself vibrates. The amount of air - the column of air - changes the pitch: a longer column gives a lower pitch, a shorter column gives a higher pitch.", keywords: ["wind instrument", "column of air", "pitch"], conceptId: "7.5" },
  ],
};
