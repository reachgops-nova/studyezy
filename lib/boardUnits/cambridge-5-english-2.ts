import type { BoardUnit } from "./types";

/**
 * English Unit 2 - Non-fiction: Biography.
 *
 * The first unit on the text stage. Its concepts are what a biography is,
 * chronological order, register, synonyms, opinions dressed up as facts, and
 * prefixes and suffixes - none of which a grid or a number line can show.
 *
 * Content is this unit's own, read from the concept rows: Poorna Malavath,
 * Usain Bolt's career, the formal/informal pair, and the prefix examples.
 */
export const CAMBRIDGE_5_ENGLISH_2: BoardUnit = {
  unitKey: "cambridge-5-english-2",
  title: "Non-fiction: Biography",
  badge: "Stage 5 · Unit 2",
  gridMax: 10,
  stage: "text",

  intro: {
    covers: [
      "What makes a biography different from a story someone made up",
      "Putting a life in chronological order using time connectives",
      "Register: choosing formal or informal language for your reader",
      "Swapping overused words for sharper synonyms",
      "Spotting an opinion that has been dressed up to sound like a fact",
      "Prefixes and suffixes, and how they change a word's meaning",
    ],
    outcomes: [
      "Tell a biography from an autobiography, and say how you know",
      "Order events in a life and join them with time connectives",
      "Choose formal or informal wording to suit who you are writing for",
      "Replace a dull word with a synonym that says more",
      "Point at a sentence and say whether it is fact or opinion, and why",
      "Build new words with prefixes like im-, ir- and un-",
    ],
  },

  concepts: [
    {
      conceptId: "2.1",
      title: "What a biography is",
      icon: "📖",
      summary:
        "A biography is a true, non-fiction record of the real events in a person's life, written by someone else about them.",
      keyPoints: [
        "Biography is written ABOUT a person by another author; autobiography is written BY that person.",
        "Everything in it should be true and checkable, not invented.",
      ],
      examples: [
        { question: "Nelson Mandela writes the story of his own life. Biography or autobiography?", answer: "Autobiography - he is writing about himself." },
        { question: "Name one thing you would expect to find in a biography but never in a fairy tale.", answer: "Real dates and real places that can be checked." },
        { question: "Poorna Malavath was born on 10 June 2000. Is that a fact or an opinion?", answer: "A fact - it is a date that can be checked." },
      ],
    },
    {
      conceptId: "2.2",
      title: "Chronological order",
      icon: "⏳",
      summary:
        "Chronological order means arranging events in the exact sequence they happened, joined with time connectives.",
      keyPoints: [
        "Time connectives include first, afterwards, later, eventually and finally.",
        "Usain Bolt: first he won races locally, afterwards he was injured, eventually he became the fastest man on Earth.",
      ],
      examples: [
        { question: "Put these in order: 'he broke the world record', 'he was born in Jamaica', 'he joined a running club'.", answer: "Born in Jamaica, joined a running club, broke the world record." },
        { question: "Which time connective would you use for the very last event in a life story?", answer: "Finally, or eventually." },
        { question: "Why would a biography be confusing without chronological order?", answer: "The reader could not tell what caused what, or how the person changed over time." },
      ],
    },
    {
      conceptId: "2.3",
      title: "Register",
      icon: "🎩",
      summary:
        "Register is the level of formality you choose, depending on who you are writing for and why.",
      keyPoints: [
        "Formal: 'I would be grateful if you could provide further information.'",
        "Informal: 'Can you tell me more about it?'",
        "A biography for a school reference book stays formal throughout.",
      ],
      examples: [
        { question: "Rewrite 'Give us a shout if you need owt' in a formal register.", answer: "Please contact me if you require anything further." },
        { question: "You are texting a friend about a film. Formal or informal?", answer: "Informal - you know them well and it is a casual purpose." },
        { question: "Why does a school reference book stay formal?", answer: "Because it is written for many readers who do not know the author, and it needs to sound reliable." },
      ],
    },
    {
      conceptId: "2.5",
      title: "Fact or opinion",
      icon: "🔍",
      summary:
        "Writers sometimes phrase opinions in a confident, fact-like tone using strong descriptive words - spotting them is the skill.",
      keyPoints: [
        "'She became a sensation overnight' sounds fact-like but 'sensation' is a judgement, not something measurable.",
        "'She performed at 17 national concerts in one year' is a fact - it can be counted and checked.",
      ],
      examples: [
        { question: "Fact or opinion: 'He scored 42 goals that season.'", answer: "Fact - it is countable and checkable." },
        { question: "Fact or opinion: 'He was the greatest player ever to wear the shirt.'", answer: "Opinion - 'greatest' is a judgement." },
        { question: "Which word makes 'an astonishing 12 medals' part opinion?", answer: "'Astonishing' - the 12 medals is the fact, the astonishment is the writer's view." },
      ],
    },
    {
      conceptId: "2.6",
      title: "Prefixes and suffixes",
      icon: "🧱",
      summary:
        "Prefixes go on the beginning of a root word to change its meaning, often to the opposite. Suffixes go on the end.",
      keyPoints: ["patient + im- → impatient (not patient)", "regular + ir- → irregular (not regular)"],
      examples: [
        { question: "Add a prefix to 'possible' to mean 'not possible'.", answer: "impossible" },
        { question: "Add a prefix to 'lucky' to mean 'not lucky'.", answer: "unlucky" },
        { question: "What does the prefix 'ir-' do in 'irresponsible'?", answer: "It makes it the opposite - not responsible." },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. A real life",
      conceptId: "2.1",
      say: "A biography is a true record of someone's real life, written by another person about them. Every part of it should be checkable.",
      frame: {
        text: {
          title: "Poorna Malavath",
          passage: [
            { text: "Poorna Malavath was " },
            { text: "born on 10 June 2000", tone: "green", note: "A fact - a date anyone can check." },
            { text: " in a village in Telangana, India. Her family was " },
            { text: "very poor", tone: "gold", note: "True, but a description rather than a measurement." },
            { text: ", but she grew up to climb to the summit of Everest." },
          ],
        },
      },
    },
    {
      label: "2. By or about?",
      conceptId: "2.1",
      say: "If someone else writes your life story, that is a biography. If you write it yourself, that is an autobiography.",
      frame: {
        text: {
          title: "Who is holding the pen?",
          columns: [
            { label: "Biography", items: ["Written ABOUT a person", "By another author", "Uses 'she', 'he', 'they'"], tone: "blue" },
            { label: "Autobiography", items: ["Written BY that person", "About their own life", "Uses 'I' and 'my'"], tone: "gold" },
          ],
        },
      },
    },
    {
      label: "3. In order",
      conceptId: "2.2",
      say: "Chronological order means the events come in the sequence they really happened. Time connectives hold them together.",
      frame: {
        text: {
          title: "Usain Bolt's career",
          chips: [
            { text: "First, he won races locally in Jamaica", tone: "green", note: "The earliest event - where it all began." },
            { text: "Afterwards, he suffered injuries", tone: "gold", note: "Afterwards tells us this came next." },
            { text: "But he recovered and won again", tone: "gold" },
            { text: "Eventually, the fastest man on Earth", tone: "blue", note: "Eventually signals the end of the journey." },
          ],
        },
      },
    },
    {
      label: "4. Register",
      conceptId: "2.3",
      say: "Register is how formal your words are. The same message can be dressed up or down, depending on who is reading it.",
      frame: {
        text: {
          title: "Same meaning, different register",
          columns: [
            { label: "Formal", items: ["I would be grateful if you could provide further information.", "The athlete subsequently retired."], tone: "blue" },
            { label: "Informal", items: ["Can you tell me more about it?", "Then he packed it in."], tone: "gold" },
          ],
        },
      },
    },
    {
      label: "5. Fact or opinion",
      conceptId: "2.5",
      say: "Watch for opinions wearing a fact's clothing. A number you can count is a fact. A judgement word is an opinion, however confidently it is written.",
      frame: {
        text: {
          title: "Which is which?",
          passage: [
            { text: "She " },
            { text: "performed at 17 national concerts in one year", tone: "green", note: "Fact - you could count them." },
            { text: ", and she " },
            { text: "became a sensation overnight", tone: "red", note: "Opinion - 'sensation' is a judgement, not a measurement." },
            { text: "." },
          ],
        },
      },
    },
    {
      label: "6. Build a word",
      conceptId: "2.6",
      say: "A prefix goes on the front of a root word and changes its meaning, usually to the opposite. Patient becomes impatient. Regular becomes irregular.",
      frame: {
        text: {
          title: "Prefix + root",
          chips: [
            { text: "im- + patient → impatient", tone: "green", note: "im- means not. Not patient." },
            { text: "ir- + regular → irregular", tone: "blue", note: "ir- means not. Not regular." },
            { text: "un- + kind → unkind", tone: "gold", note: "un- means not. Not kind." },
          ],
        },
      },
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · Biography or autobiography?",
      conceptId: "2.1",
      prompt: "Malala writes a book about her own childhood. Which is it?",
      setup: { text: { title: "Who is holding the pen?", columns: [{ label: "Biography", items: ["written by someone else"], tone: "blue" }, { label: "Autobiography", items: ["written by the person"], tone: "gold" }] } },
      chipDrag: { chip: "Malala writes about her own childhood", toColumn: 1, hint: "drop it in the right box" },
      options: [
        { label: "Autobiography", correct: true, say: "Right - she is writing about herself, so it is an autobiography.", frame: { text: { title: "Autobiography", passage: [{ text: "Written BY the person, about their own life. Look for 'I' and 'my'.", tone: "green" }] } } },
        { label: "Biography", correct: false, say: "A biography is written about someone by a different author. Malala is writing about herself.", frame: { text: { title: "Not quite", passage: [{ text: "Biography = written ABOUT a person by someone else.", tone: "red" }] } } },
      ],
    },
    {
      title: "Task 2 · Which came first?",
      conceptId: "2.2",
      prompt: "In Usain Bolt's story, which event comes first?",
      setup: { text: { title: "Usain Bolt's career", chips: [{ text: "won races locally" }, { text: "suffered injuries" }, { text: "fastest man on Earth" }] } },
      options: [
        { label: "Won races locally", correct: true, say: "Yes - that is where it began, before the injuries and long before the world record.", frame: { text: { title: "In order", chips: [{ text: "1. First, won races locally", tone: "green" }, { text: "2. Afterwards, injuries", tone: "gold" }, { text: "3. Eventually, fastest on Earth", tone: "blue" }] } } },
        { label: "Fastest man on Earth", correct: false, say: "That is where the story ends, not where it starts. 'Eventually' is the clue.", frame: { text: { title: "Look at the connectives", chips: [{ text: "Eventually = the end", tone: "red" }, { text: "First = the beginning", tone: "green" }] } } },
        { label: "Suffered injuries", correct: false, say: "'Afterwards' tells you this came after something else - the local races.", frame: { text: { title: "Afterwards means...", chips: [{ text: "something came before it", tone: "red" }] } } },
      ],
    },
    {
      title: "Task 3 · Fact or opinion?",
      conceptId: "2.5",
      prompt: "'She became a sensation overnight.' Sort it.",
      setup: { text: { title: "Sort the sentence", columns: [{ label: "Fact", items: ["can be counted or checked"], tone: "green" }, { label: "Opinion", items: ["a judgement the writer made"], tone: "red" }] } },
      chipDrag: { chip: "She became a sensation overnight", toColumn: 1, hint: "which box?" },
      options: [
        { label: "Opinion", correct: true, say: "Correct. It sounds confident, but 'sensation' is a judgement - there is no way to measure it.", frame: { text: { title: "Opinion", passage: [{ text: "sensation", tone: "red", note: "A judgement word." }, { text: " - confident sounding, but not measurable." }] } } },
        { label: "Fact", correct: false, say: "It is written in a fact-like tone, which is exactly the trap. Ask yourself: could you count it? You cannot count a sensation.", frame: { text: { title: "The trap", passage: [{ text: "Fact-like tone", tone: "gold" }, { text: " does not make it a fact." }] } } },
      ],
    },
    {
      title: "Task 4 · Choose the register",
      conceptId: "2.3",
      prompt: "You are writing a biography for a school reference book. Which opening fits?",
      setup: { text: { title: "Pick the register", columns: [{ label: "Formal", items: ["for readers who do not know you"], tone: "blue" }, { label: "Informal", items: ["for friends and family"], tone: "gold" }] } },
      options: [
        { label: "'Poorna Malavath was born in 2000 in Telangana.'", correct: true, say: "Yes - clear, formal and reliable, which is what a reference book needs.", frame: { text: { title: "Formal register", passage: [{ text: "Poorna Malavath was born in 2000 in Telangana.", tone: "green" }] } } },
        { label: "'So there's this amazing girl, right...'", correct: false, say: "That is chatty and informal - fine for a friend, too casual for a reference book.", frame: { text: { title: "Too informal", passage: [{ text: "So there's this amazing girl, right...", tone: "red" }] } } },
      ],
    },
    {
      title: "Task 5 · Add the prefix",
      conceptId: "2.6",
      prompt: "Which prefix turns 'regular' into its opposite?",
      setup: { text: { title: "Build the word", chips: [{ text: "regular", tone: "blue" }] } },
      options: [
        { label: "ir-", correct: true, say: "Correct - ir- plus regular makes irregular, meaning not regular.", frame: { text: { title: "irregular", chips: [{ text: "ir- + regular → irregular", tone: "green", note: "Not regular." }] } } },
        { label: "im-", correct: false, say: "im- works on words like patient, giving impatient. It does not fit regular.", frame: { text: { title: "im- belongs elsewhere", chips: [{ text: "im- + patient → impatient", tone: "gold" }, { text: "im- + regular → imregular ✗", tone: "red" }] } } },
        { label: "dis-", correct: false, say: "dis- makes words like disagree. The one that fits regular is ir-.", frame: { text: { title: "Try again", chips: [{ text: "ir- + regular → irregular", tone: "green" }] } } },
      ],
    },
    {
      title: "Task 6 · Sharpen the word",
      conceptId: "2.4",
      prompt: "'Andre had the strength to hit the ball and beat his opponent.' Which synonym makes 'beat' more precise?",
      setup: { text: { title: "Choose a sharper word", chips: [{ text: "beat", tone: "gold", note: "Overused - what exactly happened?" }] } },
      options: [
        { label: "triumph over", correct: true, say: "Good choice - triumph tells the reader it was a real achievement, not just a win.", frame: { text: { title: "Sharper", passage: [{ text: "Andre had the power to smash the ball and " }, { text: "triumph over", tone: "green" }, { text: " his opponent." }] } } },
        { label: "do", correct: false, say: "'Do' is even vaguer than 'beat'. A synonym should add meaning, not take it away.", frame: { text: { title: "Vaguer, not sharper", passage: [{ text: "do", tone: "red" }] } } },
      ],
    },
  ],

  lab: { prompt: "", start: [0, 0], shape: [[0, 0]], range: { min: 0, max: 1 } },

  recitePrompts: [
    { ask: "What is the difference between a biography and an autobiography?", answer: "A biography is written about a person by someone else. An autobiography is written by that person about their own life." },
    { ask: "What does chronological order mean, and what holds it together?", answer: "Events in the sequence they really happened, joined by time connectives like first, afterwards, eventually and finally." },
    { ask: "What is register, and what decides it?", answer: "How formal your language is. It is decided by who you are writing for and why." },
    { ask: "How can you tell an opinion that is pretending to be a fact?", answer: "Ask whether it could be counted or checked. If it rests on a judgement word, it is an opinion however confident it sounds." },
    { ask: "What does a prefix do?", answer: "It goes on the front of a root word and changes its meaning, often to the opposite - patient becomes impatient." },
  ],

  writtenPractice: [
    { question: "Write one sentence about a famous person that is a fact, and one that is an opinion.", answer: "Fact: 'She won three Olympic medals.' Opinion: 'She was the most graceful runner of her generation.'" },
    { question: "Put in order and join with time connectives: left school / became a doctor / studied medicine.", answer: "First she left school. Afterwards she studied medicine. Eventually she became a doctor." },
    { question: "Rewrite formally: 'He was pretty good at maths and stuff.'", answer: "He demonstrated considerable ability in mathematics and related subjects." },
    { question: "Add prefixes to make opposites: possible, legal, honest, agree.", answer: "impossible, illegal, dishonest, disagree." },
    { question: "Replace the overused word: 'The journey was good.'", answer: "The journey was remarkable / gruelling / unforgettable - whichever matches what really happened." },
    { question: "Write the opening sentence of a biography of someone in your family, in a formal register.", answer: "Any answer that states who they are, when and where they were born, and avoids chatty language." },
  ],

  assessment: {
    partA: [
      {
        title: "Q1 · Who wrote it?",
        conceptId: "2.1",
        prompt: "A book about Gandhi's life, written by a historian. What is it?",
        options: [
          { label: "A biography", correct: true, say: "Yes - written about him by someone else.", frame: { text: { passage: [{ text: "Biography: written ABOUT a person by another author.", tone: "green" }] } } },
          { label: "An autobiography", correct: false, say: "That would need Gandhi to have written it himself.", frame: { text: { passage: [{ text: "Autobiography: written BY that person.", tone: "red" }] } } },
        ],
      },
      {
        title: "Q2 · Time connective",
        conceptId: "2.2",
        prompt: "Which word signals the final event in a life story?",
        options: [
          { label: "Eventually", correct: true, say: "Correct - eventually and finally both signal the end.", frame: { text: { chips: [{ text: "Eventually → the end", tone: "green" }] } } },
          { label: "First", correct: false, say: "First signals the beginning, not the end.", frame: { text: { chips: [{ text: "First → the beginning", tone: "red" }] } } },
          { label: "Meanwhile", correct: false, say: "Meanwhile means at the same time as something else, not last.", frame: { text: { chips: [{ text: "Meanwhile → at the same time", tone: "red" }] } } },
        ],
      },
      {
        title: "Q3 · Fact or opinion",
        conceptId: "2.5",
        prompt: "'He played 312 matches for his country.'",
        setup: { text: { title: "Sort it", columns: [{ label: "Fact", items: [], tone: "green" }, { label: "Opinion", items: [], tone: "red" }] } },
        chipDrag: { chip: "He played 312 matches for his country", toColumn: 0, hint: "which box?" },
        options: [
          { label: "Fact", correct: true, say: "Yes - a number you could check in the records.", frame: { text: { passage: [{ text: "312 matches", tone: "green", note: "Countable, so a fact." }] } } },
          { label: "Opinion", correct: false, say: "There is no judgement word here - just a number that can be checked.", frame: { text: { passage: [{ text: "No judgement word = fact.", tone: "red" }] } } },
        ],
      },
      {
        title: "Q4 · Prefix",
        conceptId: "2.6",
        prompt: "What does 'im-' do to 'patient'?",
        options: [
          { label: "Makes it mean NOT patient", correct: true, say: "Correct - impatient means not patient.", frame: { text: { chips: [{ text: "im- + patient → impatient", tone: "green" }] } } },
          { label: "Makes it mean VERY patient", correct: false, say: "Prefixes like im-, ir- and un- make opposites, not stronger versions.", frame: { text: { chips: [{ text: "im- = not", tone: "red" }] } } },
        ],
      },
    ],
    partB: [
      {
        title: "Q5 · Spot the hidden opinion",
        conceptId: "2.5",
        prompt: "'She won an astonishing 12 medals.' Which part is the opinion?",
        options: [
          { label: "astonishing", correct: true, say: "Well spotted. The 12 medals is the fact; the astonishment is the writer's judgement sitting inside it.", frame: { text: { passage: [{ text: "She won an " }, { text: "astonishing", tone: "red", note: "The writer's judgement." }, { text: " " }, { text: "12 medals", tone: "green", note: "The checkable fact." }, { text: "." }] } } },
          { label: "12 medals", correct: false, say: "That part can be counted and checked, so it is the fact. Look at the word in front of it.", frame: { text: { passage: [{ text: "12 medals", tone: "green" }, { text: " is countable - so it is the fact." }] } } },
          { label: "The whole sentence is fact", correct: false, say: "One word is doing the judging. Read it again and find the word that cannot be measured.", frame: { text: { passage: [{ text: "astonishing", tone: "red" }, { text: " cannot be measured." }] } } },
        ],
      },
      {
        title: "Q6 · Fix the register",
        conceptId: "2.3",
        prompt: "A letter to a head teacher opens: 'Hiya, just wondering if you could sort something for me.' What is wrong?",
        options: [
          { label: "The register is too informal", correct: true, say: "Exactly. The purpose and the reader both call for formal language here.", frame: { text: { columns: [{ label: "Should be", items: ["I am writing to ask whether you would be able to help with..."], tone: "blue" }, { label: "Not", items: ["Hiya, just wondering if you could sort something"], tone: "red" }] } } },
          { label: "It is too formal", correct: false, say: "The other way round - 'hiya' and 'sort something' are chatty, not formal.", frame: { text: { passage: [{ text: "Hiya", tone: "red", note: "Chatty - informal." }] } } },
          { label: "Nothing is wrong", correct: false, say: "Think about who is reading it. A head teacher you do not know well needs formal register.", frame: { text: { passage: [{ text: "Reader + purpose decide the register.", tone: "gold" }] } } },
        ],
      },
    ],
  },

  readymade: [
    { q: "What is a biography?", a: "A true, non-fiction record of the real events in a person's life, written by someone else about them." },
    { q: "What are time connectives?", a: "Words that show when things happened - first, afterwards, later, eventually, finally." },
    { q: "How do I know if it is fact or opinion?", a: "Ask whether it could be counted or checked. If it rests on a judgement word like 'amazing' or 'greatest', it is an opinion." },
    { q: "What is register?", a: "How formal your language is. Who you are writing for, and why, decides it." },
  ],
};
