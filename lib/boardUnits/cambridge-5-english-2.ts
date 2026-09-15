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
        "The book's list of features: third person (he/she, not I), an opening statement, chronological order, dates and facts, paragraphs for different sections, pictures with captions, and comments as direct speech.",
      ],
      pages: [26, 27, 28],
      storyReference: "Poorna Malavath, the youngest girl to climb Mount Everest (page 26)",
      examples: [
        { question: "The book says a biography is written in the third person. Which words tell you that?", answer: "He or she, and not I. (page 26)" },
        { question: "'Poorna Malavath was born on 10 June 2000 in a village in Telangana, India.' Which biography feature is this?", answer: "An opening statement with dates and facts - it tells you who the person is. (page 26)" },
        { question: "Malavath said, 'It's not that tall. We can climb it in a day.' Which feature is that?", answer: "A comment given as direct speech, inside speech marks. (page 26)" },
        { question: "Turn 'Yes, I made good friends' into the third person, as the book does on page 28.", answer: "At school, Poorna Malavath made good friends. (page 28)" },
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
        "Page 28 asks you to build a timeline of Poorna Malavath's life - that timeline IS chronological order drawn out.",
      ],
      pages: [28, 29, 30],
      storyReference: "Usain Bolt's career (page 29); Poorna Malavath's timeline (page 28)",
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
        "Register is the tone and level of language you choose, depending on your audience and your purpose.",
      keyPoints: [
        "The book's words: register is 'the tone and level of language (for example, formal or informal) when you are speaking or writing'.",
        "Choose it for your audience AND your purpose: a news report needs a formal register; a humorous poem needs a fast, lively pace.",
        "Talking to a young audience? Slow your pace but keep your tone expressive.",
      ],
      pages: [31],
      storyReference: "The Learn panel on register, page 31, beside Usain Bolt's 'Did you know?'",
      examples: [
        { question: "Page 31 asks you to read a biography aloud 'as if you are talking on radio or television'. Which register would you choose?", answer: "A formal, clear register with an expressive tone - it is a public audience who do not know you." },
        { question: "You are texting a friend about a film. Formal or informal?", answer: "Informal - you know them well and it is a casual purpose." },
        { question: "Bolt says, 'Worrying gets you nowhere.' Is that formal or informal register?", answer: "Informal - it is his own speech, plain and direct, not the careful wording of the biography around it. (page 31)" },
      ],
    },
    {
      conceptId: "2.4",
      title: "Sharper words",
      icon: "✂️",
      summary:
        "A thesaurus gives you synonyms - words with very similar meanings - so you can replace overused vocabulary and keep a reader interested.",
      keyPoints: [
        "The book's own examples: winner → champion, victor; hit → strike, blast; best → most excellent, highest placed.",
        "A synonym should add meaning, never take it away.",
        "Page 32 shows one passage rewritten: 'Andre had the strength / power / might to hit / strike / blast the ball...'",
      ],
      pages: [32, 33, 34],
      storyReference: "The Andre tennis passage and Usain Bolt's comeback after his 2005 injury (page 32)",
      examples: [
        { question: "The book replaces 'beat his opponent'. What two synonyms does it give?", answer: "Wipe out and annihilate. (page 32)" },
        { question: "The Bolt passage on page 32 uses 'won' five times. Give two synonyms you could swap in.", answer: "Triumphed, claimed, took, secured - any word that still means winning." },
        { question: "Why is swapping 'beat' for 'do' a bad choice?", answer: "'Do' is vaguer than 'beat'. A synonym should sharpen the meaning, not blur it." },
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
        "The book's test: 'I have a sister' is a fact - I can show you my sister. 'I have the best sister in the world' is an opinion - I believe it, but I can't prove it.",
        "Biographies are mostly facts, but opinions creep in to show the writer's admiration or dislike.",
      ],
      pages: [35, 36, 37],
      storyReference: "Joey Alexander, the Indonesian child jazz prodigy (page 35)",
      examples: [
        { question: "Fact or opinion: 'He was born on 25 June 2003 in Denpasar, Bali.'", answer: "Fact - a date and a place you can check. (page 35)" },
        { question: "Fact or opinion: 'Joey Alexander became an international jazz piano sensation at the age of 11.'", answer: "Both. 'At the age of 11' is a fact; 'sensation' is the writer's judgement. (page 35)" },
        { question: "'Many people believed he was the world's best young musician.' Fact or opinion?", answer: "Opinion - 'believed' and 'best' are judgements, not measurements. (page 35)" },
        { question: "'He competed with 43 musicians from 17 nations.' Fact or opinion?", answer: "Fact - both numbers can be counted and checked. (page 35)" },
      ],
    },
    {
      conceptId: "2.6",
      title: "Prefixes and suffixes",
      icon: "🧱",
      summary:
        "Prefixes go on the beginning of a root word to change its meaning, often to the opposite. Suffixes go on the end.",
      keyPoints: [
        "The book's table: dis + agree, im + possible, in + correct, ir + responsible, il + legal.",
        "Most words take in-. But before l it becomes il- (illegal), before m or p it becomes im- (impossible), and before r it becomes ir- (irresponsible).",
        "Prefixes never change the spelling of the root word. Suffixes sometimes do: swim → swimming, prefer → preferred, enter → entered.",
      ],
      pages: [38, 39, 40],
      storyReference: "The prefix table and the three suffix rules, page 38",
      examples: [
        { question: "Add a prefix to 'possible' to mean 'not possible'.", answer: "impossible - in- becomes im- before p. (page 38)" },
        { question: "Why is it 'illegal' and not 'inlegal'?", answer: "Before a root word starting with l, the prefix in- becomes il-. (page 38)" },
        { question: "Rule 1: 'swim' + -ing. What happens and why?", answer: "Swimming - one syllable, vowel then consonant, so the final letter doubles. (page 38)" },
        { question: "Rule 3: 'enter' + -ed. Does the r double?", answer: "No - entered. The first syllable is the emphasised one, so the final letter stays single. (page 38)" },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. Poster · what a biography is",
      conceptId: "2.1",
      say: "A biography is a book about a real person's life. Not invented - real. It carries real dates and real photographs. And it is written in the third person: he, or she, and never I. The moment you see I, you are reading an autobiography instead.",
      frame: {
        image: {
          src: "/board-art/en2-what-is-biography.jpg",
          alt: "Poster panel: a biography is a book about a real person's life, written in the third person",
          title: "What is a biography?",
          hotspots: [
            { label: "A real person", at: [50, 22], note: "Always about someone who really lived. Your book's example is Poorna Malavath, the youngest girl to climb Everest. Page 26.", tone: "blue" },
            { label: "Dates and photographs", at: [50, 40], note: "'Poorna Malavath was born on 10 June 2000 in a village in Telangana, India.' Real, and checkable. Page 26.", tone: "green" },
            { label: "He or she, never I", at: [50, 64], note: "The book's first feature of a biography: it is written in the third person - he or she, and not I. Page 26.", tone: "gold" },
          ],
        },
      },
    },
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
      label: "3. Poster · in order",
      conceptId: "2.2",
      say: "Here is one life laid out left to right. First, Poorna was born. Afterwards, she went to school. Later, she climbed Everest. Eventually, she won an award. Those four words - first, afterwards, later, eventually - are what hold the order together.",
      frame: {
        image: {
          src: "/board-art/en2-in-order.jpg",
          alt: "Poster panel: a life timeline with first, afterwards, later and eventually",
          title: "In order",
          hotspots: [
            { label: "First", at: [10, 78], note: "Where the life starts. In a biography this is the opening statement that says who the person is.", tone: "blue" },
            { label: "Afterwards", at: [35, 78], note: "'Afterwards' always means something came before it. It can never be the first event.", tone: "gold" },
            { label: "Later", at: [61, 78], note: "The middle of the story. On page 28 your book asks you to build exactly this timeline for Malavath.", tone: "green" },
            { label: "Eventually", at: [87, 78], note: "The end. If you are looking for the last event in a life story, look for eventually or finally.", tone: "red" },
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
      label: "4. Poster · formal or informal",
      conceptId: "2.3",
      say: "The same brave deed, said two ways. Texting a friend: he was rly brave and did a gr8 job. Printed in a reference book: he demonstrated significant bravery during his difficult journey. Neither one is wrong. They are aimed at different readers.",
      frame: {
        image: {
          src: "/board-art/en2-register.jpg",
          alt: "Poster panel: the same message written informally in a text and formally in a reference book",
          title: "Formal or informal?",
          hotspots: [
            { label: "Informal", at: [30, 52], note: "Casual words for someone who knows you. Shortcuts like rly and gr8 are fine in a text and nowhere else.", tone: "gold" },
            { label: "Formal", at: [72, 52], note: "Careful words for readers who do not know you. Your book: a news report needs a formal register. Page 31.", tone: "blue" },
            { label: "Why it matters", at: [50, 24], note: "Register is the tone and level of language you choose. Pick it for your audience and your purpose. Page 31.", tone: "green" },
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
      label: "5. Poster · split the sentence",
      conceptId: "2.5",
      say: "Watch one sentence split in two. Poorna Malavath was born on 10 June 2000 - that half you can check, so it is a fact. And she is the most amazing climber ever - that half is a judgement, so it is an opinion. Both halves, one sentence.",
      frame: {
        image: {
          src: "/board-art/en2-fact-opinion.jpg",
          alt: "Poster panel: one sentence split into a checkable fact and a personal opinion",
          title: "Fact or opinion?",
          hotspots: [
            { label: "The fact", at: [33, 62], note: "Checkable and countable. A date is a fact because you could look it up and prove it. Page 35.", tone: "green" },
            { label: "The opinion", at: [66, 60], note: "'Most amazing' is a personal judgement. Your book's test: I believe it is true, but I can't prove it. Page 35.", tone: "red" },
            { label: "Check your evidence", at: [50, 24], note: "Biographies are mostly facts, but opinions creep in to show the writer's admiration. Page 35.", tone: "blue" },
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
      say: "A prefix goes on the front of a root word and changes its meaning, usually to the opposite. Correct becomes incorrect. Responsible becomes irresponsible.",
      frame: {
        text: {
          title: "Prefix + root",
          chips: [
            { text: "im- + patient → impatient", tone: "green", note: "im- means not. Not patient." },
            { text: "ir- + responsible → irresponsible", tone: "blue", note: "Before r, in- becomes ir-. Page 38." },
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
      prompt: "Which prefix turns 'responsible' into its opposite?",
      setup: { text: { title: "Build the word", chips: [{ text: "responsible", tone: "blue" }] } },
      options: [
        { label: "ir-", correct: true, say: "Correct - before a root word starting with r, in- becomes ir-, so you get irresponsible.", frame: { text: { title: "irresponsible", chips: [{ text: "ir- + responsible → irresponsible", tone: "green", note: "Page 38." }] } } },
        { label: "im-", correct: false, say: "im- is the form used before m or p, as in impossible. It does not fit responsible.", frame: { text: { title: "im- belongs elsewhere", chips: [{ text: "im- + possible → impossible", tone: "gold" }, { text: "im- + responsible → imresponsible ✗", tone: "red" }] } } },
        { label: "dis-", correct: false, say: "dis- makes words like disagree. The one that fits responsible is ir-.", frame: { text: { title: "Try again", chips: [{ text: "ir- + responsible → irresponsible", tone: "green" }] } } },
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
