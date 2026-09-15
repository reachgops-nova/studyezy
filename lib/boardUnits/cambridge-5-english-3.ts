import type { BoardUnit } from "./types";

/**
 * English Unit 3 - Poetry: Narrative poems.
 *
 * Built from the Hodder Stage 5 learner's book, pages 41-55. The unit runs
 * well past the poem itself: characters, dialogue, metaphor and
 * personification are all taught inside it.
 *
 * It is taught from Valerie Bloom's poem "Sandwich" (page 42), which is in
 * copyright: the board points a child at the page and works from the book's
 * own glossary, rhyme pairs and syllable table rather than reproducing
 * verses. The Test is set on an original poem written for it, so a child
 * meets the ideas on material they have not seen and nothing is reprinted.
 */
export const CAMBRIDGE_5_ENGLISH_3: BoardUnit = {
  unitKey: "cambridge-5-english-3",
  title: "Poetry: Narrative poems",
  badge: "Stage 5 · Unit 3",
  gridMax: 10,
  stage: "text",

  intro: {
    covers: [
      "What makes a poem a narrative poem, and how it differs from a story",
      "Syllables: the beats inside a word, and how to count them",
      "Rhyme: which line endings match, and which one is left out",
      "Dialect and standard English, and why a poet would choose dialect",
      "Planning a narrative poem of your own, verse by verse",
      "Working out what a character is like from what they say and do",
      "Punctuating dialogue, including a reporting clause inside the speech",
      "Metaphors, and how they differ from similes",
      "Personification: giving human behaviour to something that is not human",
    ],
    outcomes: [
      "Say what a narrative poem must have, and what it only might have",
      "Count the syllables in any word by listening for the vowel sounds",
      "Find the rhyming words in a verse and spot the line that does not rhyme",
      "Translate dialect into standard English, and explain what is lost",
      "Plan your own narrative poem with a character, a plot and a rhyme",
      "Infer a character's personality, and predict how they would behave",
      "Punctuate direct speech three different ways",
      "Tell a metaphor from a simile, and explain what each one does",
      "Spot personification and say what is being made human",
    ],
  },

  concepts: [
    {
      conceptId: "3.1",
      title: "Features of narrative poems",
      icon: "📜",
      summary:
        "A narrative poem tells a story. Like any story it has characters and a plot, but it is set out in verses.",
      keyPoints: [
        "The book's definition: narrative poems tell stories. They may or may not rhyme, but they will include characters and a plot.",
        "They may also include dialogue - direct speech - and descriptions of settings, as other stories do.",
        "So characters and plot are the must-haves. Rhyme, dialogue and setting are the maybes.",
      ],
      pages: [41],
      storyReference: "'Sandwich' by Valerie Bloom, page 42 - the narrator is Neil, getting ready for a school trip",
      examples: [
        { question: "Which two things must a narrative poem have?", answer: "Characters and a plot - a story being told. (page 41)" },
        { question: "Must a narrative poem rhyme?", answer: "No. The book says they may or may not rhyme. Rhyme is a choice, not a rule. (page 41)" },
        { question: "Name three characters mentioned in 'Sandwich' on page 42.", answer: "Neil the narrator, the teacher, and Granny Lenore. Lee and Neil's mother are mentioned too." },
        { question: "What is the plot of 'Sandwich' in one sentence?", answer: "Neil packs for a school trip, is told again and again to bring a sandwich, and Granny takes it off him at the door." },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.1",
          conceptId: "3.1",
          prompt: "A poem describes a sunset for twelve lines. Nothing happens and nobody speaks. Is it a narrative poem?",
          setup: { text: { title: "Is this a narrative poem?", cards: [{ tag: "The poem", title: "Twelve lines about a sunset", desc: "Beautiful descriptions of colour and light. No people. Nothing happens." }] } },
          options: [
            { label: "No - there is no story", correct: true, say: "Right. It is a poem, and a good one perhaps, but a narrative poem has to tell a story. No characters and no plot means no narrative.", frame: { text: { title: "Not a narrative poem", cards: [{ tag: "Missing", title: "Characters and a plot", desc: "Those are the two a narrative poem cannot do without.", quote: "Narrative poems tell stories. (page 41)" }] } } },
            { label: "Yes - all poems tell stories", correct: false, say: "Not all of them. Plenty of poems describe a thing or a feeling without telling any story at all. It is the story that makes a poem a narrative poem.", frame: { text: { title: "Not quite", passage: [{ text: "A poem can describe, or argue, or simply paint a picture. Only some poems tell stories.", tone: "red" }] } } },
            { label: "Yes - it rhymes", correct: false, say: "Rhyme is not the test. The book is clear that a narrative poem may or may not rhyme. What it must have is characters and a plot.", frame: { text: { title: "Rhyme is not the test", passage: [{ text: "May or may not rhyme.", tone: "gold" }, { text: " Must have characters and a plot.", tone: "green" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "3.2",
      title: "Syllables",
      icon: "🥁",
      summary:
        "A syllable is a vowel sound inside a word - one beat. Counting the beats tells you how many syllables a word has.",
      keyPoints: [
        "The book's definition: a syllable is a vowel sound inside a word; it may be a vowel sound on its own, or it may also have consonant sounds.",
        "The vowels are a, e, i, o and u. Every other letter is a consonant.",
        "The book's table: bat and school have 1, orange and water have 2, tomato and beautiful have 3, mysterious and appreciate have 4.",
      ],
      pages: [41],
      storyReference: "The syllable table on page 41, and the syllable count activity on page 42",
      examples: [
        { question: "How many syllables in 'school'?", answer: "One. It is a long word to look at, but only one beat. (page 41)" },
        { question: "How many syllables in 'beautiful'?", answer: "Three - beau-ti-ful. (page 41)" },
        { question: "How many syllables in 'appreciate'?", answer: "Four - a-ppre-ci-ate. (page 41)" },
        { question: "Clap the word 'sandwich'. How many beats?", answer: "Two - sand-wich." },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.2",
          conceptId: "3.2",
          prompt: "Drag 'tomato' into the column with the right number of syllables.",
          setup: {
            text: {
              title: "How many beats?",
              chips: [{ text: "tomato", tone: "blue" }],
              columns: [
                { label: "2 syllables", items: ["orange", "water"], tone: "gold" },
                { label: "3 syllables", items: ["beautiful"], tone: "green" },
                { label: "4 syllables", items: ["mysterious"], tone: "blue" },
              ],
            },
          },
          chipDrag: { chip: "tomato", toColumn: 1, hint: "drag me" },
          options: [
            { label: "3 syllables", correct: true, say: "Yes - to-ma-to. Three beats, three vowel sounds. It sits with beautiful.", frame: { text: { title: "3 syllables", chips: [{ text: "to · ma · to", tone: "green", note: "Three vowel sounds, so three syllables." }] } } },
            { label: "2 syllables", correct: false, say: "Say it slowly and clap: to - ma - to. That is three claps, not two.", frame: { text: { title: "Count again", chips: [{ text: "to · ma · to = 3", tone: "red" }] } } },
            { label: "4 syllables", correct: false, say: "Four would be a word like mysterious or appreciate. Tomato has three beats.", frame: { text: { title: "Four sounds like this", chips: [{ text: "my · ste · ri · ous = 4", tone: "gold" }, { text: "to · ma · to = 3", tone: "green" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "3.3",
      title: "Rhyme in a verse",
      icon: "🔔",
      summary:
        "Rhyming words end with the same sound. In a verse some lines rhyme with each other, and sometimes one line is deliberately left out.",
      keyPoints: [
        "Rhyme is about sound, not spelling: 'today' and 'Bay' rhyme, though they are spelled quite differently.",
        "In the first verse of 'Sandwich' the first two lines rhyme, then the next three rhyme with each other.",
        "One word is left with no rhyme at all - 'sandwich' - and that is the joke. The odd word out is the one the poem is about.",
      ],
      pages: [42],
      storyReference: "The rhyme table in question 2c, page 42",
      examples: [
        { question: "The book gives 'today / Bay' as the rhyme in the first two lines. Why do they rhyme when they look so different?", answer: "Rhyme is about the sound at the end, not the spelling. Both end with the same -ay sound. (page 42)" },
        { question: "Which word in the first verse has no rhyme?", answer: "Sandwich. Every verse ends on it, and it never rhymes with anything. (page 42)" },
        { question: "Why would a poet leave one word without a rhyme on purpose?", answer: "It makes that word stick out. Your ear expects a rhyme, does not get one, and notices the word instead." },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.3",
          conceptId: "3.3",
          prompt: "Which of these rhymes with 'Bay'?",
          setup: { text: { title: "Listen to the ending", chips: [{ text: "Bay", tone: "gold", note: "Ends with the -ay sound." }] } },
          options: [
            { label: "today", correct: true, say: "Yes. Bay and today end with the same sound, even though one is short and one is long and they are spelled differently.", frame: { text: { title: "They rhyme", chips: [{ text: "B-ay", tone: "green" }, { text: "tod-ay", tone: "green", note: "Same ending sound. (page 42)" }] } } },
            { label: "baby", correct: false, say: "It starts the same, but rhyme is about the end of the word, not the beginning. Baby ends with an -ee sound.", frame: { text: { title: "Same start, different end", chips: [{ text: "Bay / baby", tone: "red", note: "Rhyme lives at the END of a word." }] } } },
            { label: "bat", correct: false, say: "Bat starts like Bay but ends on a t. Listen right to the end of the word.", frame: { text: { title: "Listen to the end", chips: [{ text: "b-at", tone: "red" }, { text: "B-ay", tone: "green" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "3.4",
      title: "Dialect and standard English",
      icon: "🗣️",
      summary:
        "Dialect is the way people really speak in a place. A poet may spell words the way they sound instead of using standard English.",
      keyPoints: [
        "Valerie Bloom was born in Jamaica and writes in Jamaican Creole, also called Patois. (page 41)",
        "The book's note: her writing aims to capture the voices of the characters by spelling words how they should sound, using local dialect rather than standard English.",
        "The book's glossary translates it: goin' is going, an' is and, o' is of, teck is take, gwine is going to, and Ah is I. (page 42)",
        "Watch for words that already exist but mean something else here - the poem uses 'me' to mean 'my'.",
      ],
      pages: [41, 42],
      storyReference: "The glossary beside 'Sandwich', page 42",
      examples: [
        { question: "The poem uses 'me' where standard English would use a different word. Which?", answer: "'My'. The book points this out directly on page 42." },
        { question: "Put 'Ah teckin' me ball' into standard English.", answer: "I'm taking my ball. (glossary, page 42)" },
        { question: "What does 'gwine' mean?", answer: "Going to. (glossary, page 42)" },
        { question: "Why write in dialect instead of standard English?", answer: "To capture the real voice of the character, so the reader hears Neil rather than a narrator. (page 41)" },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.4",
          conceptId: "3.4",
          prompt: "The poem says 'me new Frisbee'. What would standard English say?",
          setup: { text: { title: "Dialect into standard English", passage: [{ text: "me new Frisbee", tone: "gold", note: "How Neil really speaks." }] } },
          options: [
            { label: "my new Frisbee", correct: true, say: "Correct. The poem uses me where standard English uses my - your book points at that exact word on page 42.", frame: { text: { title: "me = my", passage: [{ text: "me new Frisbee", tone: "gold" }, { text: "  →  " }, { text: "my new Frisbee", tone: "green" }] } } },
            { label: "the new Frisbee", correct: false, say: "Close, but it loses something. 'Me' here means it belongs to him - it is my, not the.", frame: { text: { title: "Whose Frisbee?", passage: [{ text: "'The' does not tell you it is his.", tone: "red" }] } } },
            { label: "It is already standard English", correct: false, say: "Not quite - standard English would not say 'me new Frisbee'. That spelling is the poet catching how Neil really talks.", frame: { text: { title: "This is dialect", passage: [{ text: "Spelling words how they sound is the poet's choice, not a mistake.", tone: "blue" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "3.5",
      title: "Planning your own narrative poem",
      icon: "✍️",
      summary:
        "Plan before you write: decide the story of each verse first, then find the words and the rhymes.",
      keyPoints: [
        "The book's plan gives one question per verse: where are you going and what will you pack, what food will you take, and who will you meet as you leave.",
        "Decide your narrator first, and how they speak - that voice holds the whole poem together.",
        "Try to keep the same number of syllables in each line, so the poem keeps its beat.",
      ],
      pages: [43],
      storyReference: "The verse planning table and the draft poem to finish, page 43",
      examples: [
        { question: "What does the book suggest each of the three verses should be about?", answer: "Verse 1 where you are going and what you pack, verse 2 what food you take, verse 3 who you meet as you leave. (page 43)" },
        { question: "Why decide your narrator before you write?", answer: "Because how they speak decides every word choice - the book asks 'Who is your narrator, and how might they speak and behave?' (page 43)" },
        { question: "Give a rhyming answer to 'Will the bus get there on time?'", answer: "The book's own example is 'Lateness is such a crime!' - any rhyme on time works. (page 43)" },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.5",
          conceptId: "3.5",
          prompt: "You are writing verse 1 of a school-trip poem. Which line belongs in it?",
          setup: { text: { title: "Verse 1: where you are going, and what you pack", cards: [{ tag: "The plan", title: "Verse 1", desc: "Where are you going? What toys or equipment will you put into your bag?", quote: "page 43" }] } },
          options: [
            { label: "I'll take my beach ball, yellow and bright", correct: true, say: "Yes - that is a thing going into the bag, which is exactly what verse one is for.", frame: { text: { title: "Verse 1", passage: [{ text: "Something packed - it belongs in verse one.", tone: "green" }] } } },
            { label: "And Granny took my sandwich away", correct: false, say: "That is who you meet as you leave, so it belongs in verse three. Keep each verse to its own job.", frame: { text: { title: "That is verse 3", passage: [{ text: "Who will you meet as you leave to go to school? (page 43)", tone: "gold" }] } } },
            { label: "Some crisps and an apple to munch on the sand", correct: false, say: "Food goes in verse two. It is a good line - it is just in the wrong verse.", frame: { text: { title: "That is verse 2", passage: [{ text: "What food will you take, as well as your sandwich? (page 43)", tone: "gold" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "3.6",
      title: "Finding out about characters",
      icon: "🕵️",
      summary:
        "You learn what a character is like by inferring from what they say and do - and once you know them, you can predict how they would behave.",
      keyPoints: [
        "The book's rule: we learn about characters by inferring what they are like from what they say and do.",
        "Neil keeps saying he must teck a sandwich. That suggests he likes to follow rules, or wants to fit in by being the same as everyone else.",
        "Poets take a view of their own characters - they may admire one, dislike one, or find one funny. Valerie Bloom clearly likes Granny Lenore and finds her funny.",
        "Knowing a character lets you predict: if the other children dressed a certain way, Neil would want to dress that way too.",
      ],
      pages: [44, 45, 46],
      storyReference: "Granny Lenore filling Neil's basket with home cooking, page 44",
      examples: [
        { question: "Neil repeats that he must 'teck a sandwich'. What does that suggest about him?", answer: "He likes to follow rules, or he wants to fit in by being the same as the other children. (page 44)" },
        { question: "How do you know Valerie Bloom finds Granny Lenore funny rather than annoying?", answer: "By how she is written - she keeps piling food in despite Neil begging, which is played for laughs, not for blame. (page 44)" },
        { question: "The book says knowing a character lets you predict. Predict what Neil would do if the class all wore red caps.", answer: "He would want a red cap too - he is someone who wants to fit in. (page 44)" },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.6",
          conceptId: "3.6",
          prompt: "Granny Lenore keeps filling the basket even while Neil begs her to stop. What does that tell you about her?",
          setup: { text: { title: "Infer from what she does", cards: [{ tag: "What she does", title: "Keeps loading the basket", desc: "Corn pone, chicken, rice and peas, hardo bread - while Neil begs for his sandwich back." }] } },
          options: [
            { label: "She shows love by feeding people, and will not be argued with", correct: true, say: "Good inference - and you can point at the evidence. She is not being unkind; she is making sure he is fed, and nothing he says changes her mind.", frame: { text: { title: "Inferred", passage: [{ text: "You worked it out from what she does, which is exactly what the book means by inferring. Page 44.", tone: "green" }] } } },
            { label: "She does not like Neil", correct: false, say: "The opposite - she is feeding him far too much because she cares. Dislike would look quite different.", frame: { text: { title: "Check the evidence", passage: [{ text: "Filling someone's basket with your best cooking is not dislike.", tone: "red" }] } } },
            { label: "Nothing - she is just a background character", correct: false, say: "She gets a whole section of the poem, and the book says Valerie Bloom likes her and finds her funny. Characters who get that much space are never background.", frame: { text: { title: "She matters", passage: [{ text: "The poet has a viewpoint about her, which is the point of page 44.", tone: "gold" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "3.7",
      title: "Writing dialogue",
      icon: "💬",
      summary:
        "Direct speech is separated from the reporting clause by a comma, question mark or exclamation mark - and the reporting clause can go before, after, or inside the speech.",
      keyPoints: [
        "The book's rule: separate the speech from the reporting clause with a comma, question mark or exclamation mark.",
        "After the speech: 'Make sure you bring a sandwich,' said the teacher.",
        "Before the speech: The teacher said, 'Make sure you bring a sandwich.'",
        "Inside the speech: 'Where,' asked the teacher, 'is your sandwich?' - commas on both sides.",
      ],
      pages: [47, 48, 49],
      storyReference: "The reporting clause panel and the second half of the poem, page 47",
      examples: [
        { question: "Punctuate: Make sure you bring a sandwich said the teacher.", answer: "'Make sure you bring a sandwich,' said the teacher. The comma goes inside the speech marks. (page 47)" },
        { question: "Move the reporting clause to the front of that sentence.", answer: "The teacher said, 'Make sure you bring a sandwich.' The comma now sits after said. (page 47)" },
        { question: "Why put the reporting clause in the middle?", answer: "To vary your writing, says the book - it breaks up a long speech and controls the pace. (page 47)" },
        { question: "The book notes Valerie Bloom does not punctuate her direct speech. Why is that hard for a reader?", answer: "You have to work out from the words alone who is speaking and where their speech starts and stops. (page 47)" },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.7",
          conceptId: "3.7",
          prompt: "Which sentence is punctuated correctly?",
          setup: { text: { title: "Speech and reporting clause", passage: [{ text: "The reporting clause is the bit that says WHO spoke.", tone: "blue" }] } },
          options: [
            { label: "'Where,' asked the teacher, 'is your sandwich?'", correct: true, say: "Correct - the reporting clause sits inside the speech with a comma on each side, exactly as your book shows on page forty-seven.", frame: { text: { title: "Correct", passage: [{ text: "'Where,' asked the teacher, 'is your sandwich?' Commas separate the reporting clause from the speech.", tone: "green" }] } } },
            { label: "'Where' asked the teacher 'is your sandwich?'", correct: false, say: "The words are right but nothing separates them. The book's rule is a comma, question mark or exclamation mark between speech and reporting clause.", frame: { text: { title: "Missing commas", passage: [{ text: "Without the commas the sentence runs together.", tone: "red" }] } } },
            { label: "'Where, asked the teacher, is your sandwich?'", correct: false, say: "That puts the teacher inside the speech - as if the speaker said the words 'asked the teacher' out loud. The speech marks have to close and reopen around it.", frame: { text: { title: "The teacher is not speaking those words", passage: [{ text: "'Where,' asked the teacher, 'is your sandwich?'", tone: "green" }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "3.8",
      title: "Metaphor",
      icon: "⭐",
      summary:
        "A metaphor says one thing IS another. A simile only says it is LIKE another, using like or as.",
      keyPoints: [
        "The book's pair: simile - you are like a shining star in this class. Metaphor - you are the shining star of the class.",
        "A metaphor is more direct than a simile, and the book says metaphors help to make your writing creatively rich.",
        "A simile compares two things that are not alike but do have something in common, using like or as: he is as tall as a giant.",
        "The book's metaphors include: the sun is a golden ball, he is a walking dictionary, her anger is a volcano, the lake was a mirror.",
      ],
      pages: [50, 51, 52],
      storyReference: "The metaphor and simile panels, page 50",
      examples: [
        { question: "Simile or metaphor: 'She runs as fast as a cheetah.'", answer: "Simile - it uses 'as' to compare. (page 50)" },
        { question: "Simile or metaphor: 'His heart is a stone.'", answer: "Metaphor - it says his heart IS a stone, with no like or as. (page 50)" },
        { question: "Turn 'He is like a giant' into a metaphor.", answer: "He is a giant. Drop the like and say it directly. (page 50)" },
        { question: "What does 'the road was a ribbon of moonlight across the valley' make you picture?", answer: "A long, thin, pale road curving away - far more than 'the road was lit by the moon' would give you. (page 50)" },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.8",
          conceptId: "3.8",
          prompt: "Which of these is a metaphor?",
          setup: { text: { title: "Metaphor or simile?", chips: [{ text: "like", tone: "gold", note: "A simile word." }, { text: "as", tone: "gold", note: "The other simile word." }] } },
          options: [
            { label: "Your room is a disaster zone.", correct: true, say: "Yes - it says the room IS a disaster zone. No like, no as, so it is a metaphor.", frame: { text: { title: "Metaphor", passage: [{ text: "Your room IS a disaster zone - said directly. Page 50.", tone: "green" }] } } },
            { label: "Her eyes were as cold as ice.", correct: false, say: "That one uses 'as', which makes it a simile. The metaphor version would be: her eyes were ice.", frame: { text: { title: "Simile", passage: [{ text: "as cold as ice", tone: "gold" }, { text: " → metaphor: her eyes were ice." }] } } },
            { label: "He is like a giant.", correct: false, say: "'Like' gives it away - that is a simile. Take the like out and you get the metaphor: he is a giant.", frame: { text: { title: "Simile", passage: [{ text: "He is LIKE a giant.", tone: "gold" }, { text: " The book's own example, page 50." }] } } },
          ],
        },
      ],
    },
    {
      conceptId: "3.9",
      title: "Personification",
      icon: "🌅",
      summary:
        "Personification is a special kind of metaphor: describing something that is not human as being, or behaving like, a person.",
      keyPoints: [
        "The book's definition: one special type of metaphor is called personification - when writers describe something that is not human as being or behaving like a person.",
        "The book's example: 'Sunshine tiptoed through my window.' Sunshine is not a person, but tiptoeing is what a person does.",
        "In 'Emily Hurricane' by Alan Smith, a hurricane is given a name, a voice, silver hair and 'electricity for eyes'.",
        "To spot it, ask two questions: is this thing human? And is it doing something only a person does?",
      ],
      pages: [53, 54, 55],
      storyReference: "'Emily Hurricane' by Alan Smith, about the 1987 Bermuda hurricane, page 53",
      examples: [
        { question: "Why is 'Sunshine tiptoed through my window' personification?", answer: "Sunshine is not a person, but tiptoeing is a person's action. Both halves have to be true. (page 53)" },
        { question: "The poem calls the hurricane 'Miss Emily Hurricane' and says she has 'electricity for eyes'. What is being personified?", answer: "The hurricane - a storm is given a name, a face and a personality. (page 53)" },
        { question: "Is 'the dog barked loudly' personification?", answer: "No. A dog is not human, but barking is exactly what dogs do - it is not a person's action." },
        { question: "Write personification for the wind.", answer: "For example: the wind whispered at the door. Whispering is a person's action, and wind is not a person." },
      ],
      quickCheck: [
        {
          title: "Quick check · 3.9",
          conceptId: "3.9",
          prompt: "Which sentence uses personification?",
          setup: { text: { title: "Two questions", cards: [{ tag: "Ask", title: "Is it human?", desc: "It must NOT be." }, { tag: "Ask", title: "Is it acting like a person?", desc: "It must BE." }] } },
          options: [
            { label: "The old clock groaned and coughed at midnight.", correct: true, say: "Yes. A clock is not a person, and groaning and coughing are things people do. Both halves are true, so it is personification.", frame: { text: { title: "Personification", passage: [{ text: "Not a person", tone: "blue" }, { text: " + " }, { text: "behaving like a person", tone: "green" }, { text: " - the book's own test. Page 53." }] } } },
            { label: "The old clock was as loud as a drum.", correct: false, say: "That is a simile - it compares the clock to a drum using 'as'. Nothing is behaving like a person.", frame: { text: { title: "Simile", passage: [{ text: "as loud as a drum", tone: "gold", note: "A comparison, not a person's action." }] } } },
            { label: "The old clock struck twelve.", correct: false, say: "Striking twelve is just what clocks do. For personification it would need to do something only a person does.", frame: { text: { title: "That is what clocks do", passage: [{ text: "Compare: the clock groaned. Groaning is a person's action.", tone: "gold" }] } } },
          ],
        },
      ],
    },
  ],

  conceptSteps: [
    {
      label: "1. A poem that tells a story",
      conceptId: "3.1",
      say: "A narrative poem is a story told in verses. It has characters and a plot, exactly like a story in prose. It may rhyme, and it may have speech and a setting - but those are choices. The story is the part it cannot do without.",
      frame: {
        text: {
          title: "Features of narrative poems · Page 41",
          cards: [
            { tag: "Must have", title: "Characters and a plot", desc: "Someone it happens to, and something that happens.", quote: "Narrative poems tell stories. (page 41)" },
            { tag: "May have", title: "Rhyme", desc: "The book is clear: they may or may not rhyme.", quote: "page 41" },
            { tag: "May have", title: "Dialogue and settings", desc: "Direct speech and descriptions of place, as other stories do.", quote: "page 41" },
          ],
        },
      },
    },
    {
      label: "2. Who is in 'Sandwich'?",
      conceptId: "3.1",
      say: "Open your book at page forty-two. The narrator is Neil, getting ready for a school trip. Look for the teacher, for Lee, for his mother, and for Granny Lenore at the door. Those are the characters - and what happens to them is the plot.",
      frame: {
        text: {
          title: "Characters in 'Sandwich' · Page 42",
          chips: [
            { text: "Neil", tone: "gold", note: "The narrator - the poem is in his voice." },
            { text: "the teacher", tone: "blue", note: "Keeps telling the class to bring a sandwich." },
            { text: "Lee", tone: "blue", note: "Who he will share the gobstoppers with." },
            { text: "me mother", tone: "blue", note: "Who he asks for the bread and butter." },
            { text: "Granny Lenore", tone: "red", note: "Who takes the sandwich away at the very end." },
          ],
        },
      },
    },
    {
      label: "3. Beats in a word",
      conceptId: "3.2",
      say: "A syllable is one beat in a word - one vowel sound. Clap as you say it. Bat is one clap. Water is two. Tomato is three. Mysterious is four. The letter count does not matter: school is a long word with only one beat.",
      frame: {
        text: {
          title: "Syllables · Page 41",
          columns: [
            { label: "1 beat", items: ["bat", "school"], tone: "gold" },
            { label: "2 beats", items: ["orange", "water"], tone: "green" },
            { label: "3 beats", items: ["tomato", "beautiful"], tone: "blue" },
            { label: "4 beats", items: ["mysterious", "appreciate"], tone: "red" },
          ],
        },
      },
    },
    {
      label: "4. Rhyme, and the word left out",
      conceptId: "3.3",
      say: "In the first verse of Sandwich, today and Bay rhyme. So do the next three line endings. But one word never rhymes with anything at all - sandwich. That is the joke of the whole poem, and your ear notices it because the rhyme it expected never comes.",
      frame: {
        text: {
          title: "Rhyme in verse 1 · Page 42",
          cards: [
            { tag: "First two lines", title: "today / Bay", desc: "Different spellings, same ending sound. Rhyme is about sound.", quote: "the book's own example, page 42" },
            { tag: "The odd one out", title: "sandwich", desc: "No rhyme anywhere. Every verse lands on it, and your ear keeps waiting.", quote: "page 42" },
          ],
        },
      },
    },
    {
      label: "5. Hearing Neil's voice",
      conceptId: "3.4",
      say: "Valerie Bloom was born in Jamaica and writes in Jamaican Creole. She spells the words the way Neil would really say them. Use the glossary beside the poem: goin' is going, an' is and, teck is take, and Ah is I. And watch out - me means my.",
      frame: {
        text: {
          title: "Dialect and standard English · Pages 41-42",
          columns: [
            { label: "In the poem", items: ["goin'", "an'", "o'", "teck", "gwine", "Ah", "me"], tone: "gold" },
            { label: "Standard English", items: ["going", "and", "of", "take", "going to", "I", "my"], tone: "green" },
          ],
        },
      },
    },
    {
      label: "6. Planning your own",
      conceptId: "3.5",
      say: "Now plan one of your own. The book gives you a question for each verse. Where are you going, and what goes in your bag? What food are you taking? And who do you meet on the way out? Answer those three and you have a plot.",
      frame: {
        text: {
          title: "Plan your narrative poem · Page 43",
          cards: [
            { tag: "Verse 1", title: "Where, and what you pack", desc: "Where are you going? What toys or equipment go into your bag?", quote: "page 43" },
            { tag: "Verse 2", title: "The food", desc: "What food will you take, as well as your sandwich?", quote: "page 43" },
            { tag: "Verse 3", title: "Who you meet", desc: "Who will you meet as you leave to go to school?", quote: "page 43" },
          ],
        },
      },
    },
    {
      label: "7. What Neil is like",
      conceptId: "3.6",
      say: "You are never told what Neil is like. You work it out. He says over and over that he must teck a sandwich - and that tells you he likes to follow the rules, or wants to be the same as everyone else. That is inferring.",
      frame: {
        text: {
          title: "Finding out about characters · Page 44",
          cards: [
            { tag: "What he says", title: "He must teck a sandwich", desc: "Repeated through the whole poem, in every verse.", quote: "page 44" },
            { tag: "What it suggests", title: "He wants to fit in", desc: "He likes following rules, or wants to be the same as the other children in his class.", quote: "page 44" },
            { tag: "So you can predict", title: "How he would behave", desc: "If the class all dressed a certain way, Neil would want to dress that way too.", quote: "page 44" },
          ],
        },
      },
    },
    {
      label: "8. Punctuating speech",
      conceptId: "3.7",
      say: "There are three places the reporting clause can go. After the speech, before it, or right in the middle of it. Whichever you choose, a comma separates the speech from the part that says who spoke.",
      frame: {
        text: {
          title: "Writing dialogue · Page 47",
          cards: [
            { tag: "After", title: "'Make sure you bring a sandwich,' said the teacher.", desc: "Comma inside the speech marks, before they close.", quote: "page 47" },
            { tag: "Before", title: "The teacher said, 'Make sure you bring a sandwich.'", desc: "Comma after the reporting clause.", quote: "page 47" },
            { tag: "Inside", title: "'Where,' asked the teacher, 'is your sandwich?'", desc: "A comma on each side of the reporting clause.", quote: "page 47" },
          ],
        },
      },
    },
    {
      label: "9. Metaphor, not simile",
      conceptId: "3.8",
      say: "A simile says something is LIKE something else. A metaphor goes further and says it IS. You are like a shining star is a simile. You are the shining star of the class is a metaphor - and it lands harder because it does not hedge.",
      frame: {
        text: {
          title: "Metaphor · Page 50",
          columns: [
            { label: "Simile - uses like or as", items: ["He is like a giant.", "She runs as fast as a cheetah.", "You are like a shining star."], tone: "gold" },
            { label: "Metaphor - says it IS", items: ["He is an ogre.", "Her anger is a volcano.", "You are the shining star of the class."], tone: "green" },
          ],
        },
      },
    },
    {
      label: "10. Giving things a personality",
      conceptId: "3.9",
      say: "Personification is a special kind of metaphor. Sunshine tiptoed through my window. Sunshine is not a person - but tiptoeing is what a person does. In Emily Hurricane, a whole storm gets a name, a voice and electricity for eyes.",
      frame: {
        text: {
          title: "Personification · Page 53",
          cards: [
            { tag: "The test", title: "Not a person, acting like one", desc: "Both halves must be true. A dog barking is not personification - barking is what dogs do.", quote: "page 53" },
            { tag: "The book's example", title: "Sunshine tiptoed through my window", desc: "Sunshine cannot tiptoe. That is the whole point.", quote: "page 53" },
            { tag: "In the poem", title: "Miss Emily Hurricane", desc: "A hurricane with a name, a voice, silver hair and electricity for eyes.", quote: "'Emily Hurricane' by Alan Smith, page 53" },
          ],
        },
      },
    },
  ],

  guidedTasks: [
    {
      title: "Task 1 · Is it a narrative poem?",
      conceptId: "3.1",
      setup: { text: { title: "Two poems", cards: [{ tag: "Poem A", title: "A cat chases a mouse across a kitchen and knocks over the milk", desc: "Twelve lines, no rhyme." }, { tag: "Poem B", title: "The colours of autumn", desc: "Twelve lines, all rhyming." }] } },
      prompt: "Which one is the narrative poem?",
      options: [
        { label: "Poem A", correct: true, say: "Right. It has a character and a plot - something happens to someone. The fact that it does not rhyme changes nothing.", frame: { text: { title: "Poem A", passage: [{ text: "Character: the cat. Plot: the chase and the spilt milk. That is a story.", tone: "green" }] } } },
        { label: "Poem B", correct: false, say: "Poem B rhymes beautifully, but nothing happens and nobody is in it. Rhyme does not make a poem narrative - a story does.", frame: { text: { title: "Rhyme is not the test", passage: [{ text: "May or may not rhyme.", tone: "gold" }, { text: " Must have characters and a plot.", tone: "green" }] } } },
        { label: "Both of them", correct: false, say: "Only one tells a story. Poem B describes autumn beautifully, but description is not a plot.", frame: { text: { title: "Only one", passage: [{ text: "Describing a thing is not the same as telling what happened to someone.", tone: "red" }] } } },
      ],
    },
    {
      title: "Task 2 · Count the beats",
      conceptId: "3.2",
      setup: { text: { title: "How many syllables?", chips: [{ text: "mysterious", tone: "blue" }] } },
      prompt: "How many syllables are in 'mysterious'?",
      options: [
        { label: "4", correct: true, say: "Yes - my-ste-ri-ous. Four vowel sounds, four beats. The book puts it in the four column on page forty-one.", frame: { text: { title: "4 syllables", chips: [{ text: "my · ste · ri · ous", tone: "green" }] } } },
        { label: "3", correct: false, say: "Nearly. Say it slowly - my-ste-ri-ous. The -ri- in the middle is its own beat, which is easy to swallow.", frame: { text: { title: "Do not swallow the middle", chips: [{ text: "my · ste · ri · ous = 4", tone: "red", note: "The -ri- counts." }] } } },
        { label: "10 - one for each letter", correct: false, say: "Letters are not beats. School has six letters and only one syllable. Listen for the vowel sounds instead.", frame: { text: { title: "Letters are not beats", chips: [{ text: "school = 6 letters, 1 beat", tone: "gold" }] } } },
      ],
    },
    {
      title: "Task 3 · The word with no rhyme",
      conceptId: "3.3",
      setup: { text: { title: "Verse 1 endings", chips: [{ text: "today", tone: "green" }, { text: "Bay", tone: "green" }, { text: "me", tone: "blue" }, { text: "see", tone: "blue" }, { text: "Frisbee", tone: "blue" }, { text: "sandwich", tone: "red" }] } },
      prompt: "Which of these has no rhyming partner in the verse?",
      options: [
        { label: "sandwich", correct: true, say: "Exactly. Today and Bay go together, me and see and Frisbee go together, and sandwich is left standing on its own - which is precisely why you remember it.", frame: { text: { title: "The odd one out", chips: [{ text: "today / Bay", tone: "green" }, { text: "me / see / Frisbee", tone: "blue" }, { text: "sandwich - no partner", tone: "red", note: "And the poem is named after it." }] } } },
        { label: "Frisbee", correct: false, say: "Frisbee does have partners - it rhymes with me and with see. Look for the one with nothing to pair with.", frame: { text: { title: "Frisbee has partners", chips: [{ text: "me / see / Frisbee", tone: "green" }] } } },
        { label: "today", correct: false, say: "Today rhymes with Bay in the very next line - the book gives you that pair on page forty-two.", frame: { text: { title: "today / Bay", chips: [{ text: "Both end with the -ay sound.", tone: "green" }] } } },
      ],
    },
    {
      title: "Task 4 · Into standard English",
      conceptId: "3.4",
      setup: { text: { title: "From the glossary", passage: [{ text: "An' ah just headin' for the door", tone: "gold" }] } },
      prompt: "Which is this line in standard English?",
      options: [
        { label: "And I'm just heading for the door", correct: true, say: "Correct. An' is and, ah is I, and headin' is heading. The glossary on page forty-two gives you every one of them.", frame: { text: { title: "Standard English", passage: [{ text: "And I'm just heading for the door", tone: "green" }] } } },
        { label: "An ant just headed for the door", correct: false, say: "That is reading the letters instead of listening. 'Ah' is how the poem writes I - it is in the glossary.", frame: { text: { title: "Ah = I", passage: [{ text: "Use the glossary beside the poem. (page 42)", tone: "red" }] } } },
        { label: "It cannot be translated", correct: false, say: "It can - the book translates it for you in the glossary. What is lost in translating is Neil's voice, not his meaning.", frame: { text: { title: "Meaning survives, voice does not", passage: [{ text: "The glossary gives the meaning. The dialect gives the person.", tone: "blue" }] } } },
      ],
    },
    {
      title: "Task 5 · Which verse?",
      conceptId: "3.5",
      setup: { text: { title: "Sort the line", columns: [{ label: "Verse 1 · packing", items: [], tone: "gold" }, { label: "Verse 2 · food", items: [], tone: "green" }, { label: "Verse 3 · who you meet", items: [], tone: "blue" }] } },
      prompt: "Where does 'I bumped into Mrs Shah at the gate' belong?",
      options: [
        { label: "Verse 3", correct: true, say: "Yes - that is someone you meet as you leave, which is what the book gives verse three for.", frame: { text: { title: "Verse 3", passage: [{ text: "Who will you meet as you leave to go to school? (page 43)", tone: "green" }] } } },
        { label: "Verse 1", correct: false, say: "Verse one is where you are going and what goes in the bag. Mrs Shah is a person you meet, not a thing you pack.", frame: { text: { title: "Verse 1 is the bag", passage: [{ text: "Where are you going? What goes into your bag? (page 43)", tone: "red" }] } } },
        { label: "Verse 2", correct: false, say: "Verse two is the food. Unless Mrs Shah is edible, she belongs in verse three.", frame: { text: { title: "Verse 2 is the food", passage: [{ text: "What food will you take, as well as your sandwich? (page 43)", tone: "red" }] } } },
      ],
    },
    {
      title: "Task 6 · Where does the comma go?",
      conceptId: "3.7",
      setup: { text: { title: "Punctuate it", passage: [{ text: "I forgot my sandwich said Neil", tone: "gold" }] } },
      prompt: "Which version is right?",
      options: [
        { label: "'I forgot my sandwich,' said Neil.", correct: true, say: "Correct. The comma goes inside the speech marks, and then the reporting clause tells you who spoke.", frame: { text: { title: "Correct", passage: [{ text: "'I forgot my sandwich,' said Neil.", tone: "green" }] } } },
        { label: "'I forgot my sandwich'. said Neil.", correct: false, say: "A full stop ends the sentence, so 'said Neil' is left stranded with nothing to attach to. The book's rule is a comma, question mark or exclamation mark.", frame: { text: { title: "Full stop ends it too soon", passage: [{ text: "Use a comma so the sentence can carry on to say who spoke.", tone: "red" }] } } },
        { label: "'I forgot my sandwich said Neil.'", correct: false, say: "That puts Neil's name inside the speech, as if he said 'said Neil' out loud. Close the speech marks before the reporting clause.", frame: { text: { title: "Too much inside the marks", passage: [{ text: "Only the spoken words go inside.", tone: "red" }] } } },
      ],
    },
    {
      title: "Task 7 · Simile into metaphor",
      conceptId: "3.8",
      setup: { text: { title: "Make it a metaphor", passage: [{ text: "The lake was like a mirror.", tone: "gold" }] } },
      prompt: "Which one is the metaphor version?",
      options: [
        { label: "The lake was a mirror.", correct: true, say: "Yes - drop the like and say it directly. That is the book's own metaphor on page fifty.", frame: { text: { title: "Metaphor", passage: [{ text: "The lake was a mirror.", tone: "green", note: "Said directly, with no hedge." }] } } },
        { label: "The lake was as smooth as a mirror.", correct: false, say: "You swapped one simile for another - 'as ... as' is still a comparison. A metaphor drops the comparison words entirely.", frame: { text: { title: "Still a simile", passage: [{ text: "as smooth as", tone: "red", note: "Comparison words." }] } } },
        { label: "The lake looked a bit like a mirror.", correct: false, say: "That is even more hedged than the simile. Metaphors are more direct, not less.", frame: { text: { title: "The opposite direction", passage: [{ text: "A metaphor is MORE direct than a simile. Page 50.", tone: "red" }] } } },
      ],
    },
    {
      title: "Task 8 · Spot the personification",
      conceptId: "3.9",
      setup: { text: { title: "Two questions", cards: [{ tag: "1", title: "Is it human?", desc: "It must not be." }, { tag: "2", title: "Is it acting like a person?", desc: "It must be." }] } },
      prompt: "Which one is personification?",
      options: [
        { label: "The wind whispered at the door.", correct: true, say: "Yes. Wind is not a person, and whispering is a person's action. Both halves true.", frame: { text: { title: "Personification", passage: [{ text: "Not human + behaving like a person. Page 53.", tone: "green" }] } } },
        { label: "The wind was strong that night.", correct: false, say: "That just describes the wind. Nothing human about being strong.", frame: { text: { title: "Just a description", passage: [{ text: "No person's action anywhere in it.", tone: "red" }] } } },
        { label: "The girl whispered at the door.", correct: false, say: "A girl IS a person, so whispering is simply what she did. Personification needs something that is not human.", frame: { text: { title: "She is already human", passage: [{ text: "The first question fails: is it human? Yes. So it cannot be personification.", tone: "red" }] } } },
      ],
    },
  ],

  lab: { prompt: "", start: [0, 0], shape: [[0, 0]], range: { min: 0, max: 1 } },

  recitePrompts: [
    { ask: "What must a narrative poem have, and what might it have?", answer: "It must have characters and a plot - it tells a story. It may have rhyme, dialogue and a setting, but none of those are required." },
    { ask: "What is a syllable?", answer: "A vowel sound inside a word - one beat. Clap as you say the word and count the claps." },
    { ask: "Is rhyme about spelling or sound?", answer: "Sound. Today and Bay rhyme although they are spelled quite differently." },
    { ask: "Why might a poet write in dialect instead of standard English?", answer: "To catch the real voice of the character, so the reader hears the person speaking rather than a narrator." },
    { ask: "What should you decide before writing your own narrative poem?", answer: "Who the narrator is and how they speak, and what story each verse will tell." },
    { ask: "How do you find out what a character is like?", answer: "By inferring from what they say and do. And once you know them, you can predict how they would behave somewhere else." },
    { ask: "What separates direct speech from the reporting clause?", answer: "A comma, question mark or exclamation mark. The reporting clause can go before the speech, after it, or inside it with a comma each side." },
    { ask: "What is the difference between a simile and a metaphor?", answer: "A simile says something is LIKE another thing, using like or as. A metaphor says it IS that thing." },
    { ask: "What is personification?", answer: "A special kind of metaphor: describing something that is not human as being, or behaving like, a person." },
  ],

  writtenPractice: [
    { question: "Write down five words from around your room. Next to each one, write how many syllables it has. Check by clapping.", answer: "Any five - the check is whether the claps match the number you wrote. Remember school has six letters and one beat." },
    { question: "Find three words that rhyme with 'door'. None of them may be spelled with -oor.", answer: "For example: more, four, your, floor is not allowed, saw is close but does not quite rhyme. This proves rhyme is about sound." },
    { question: "Write these in standard English: 'De whole class goin' to Whitney Bay.'", answer: "The whole class is going to Whitney Bay. (de = the, goin' = going - glossary, page 42)" },
    { question: "Plan a narrative poem about leaving for school. Use the book's three questions on page 43, one per verse. Write only the plan, not the poem.", answer: "Verse 1 where you are going and what you pack. Verse 2 the food. Verse 3 who you meet. A plan is enough - the poem comes after." },
    { question: "Write the first two lines of your poem so that they rhyme, and count the syllables in each. Are they close?", answer: "Lines with a similar number of syllables keep the beat. The book asks you to try for the same number in each line." },
    { question: "Write the same short conversation three times, putting the reporting clause before, after, and inside the speech.", answer: "'Come in,' said Mum. / Mum said, 'Come in.' / 'Come in,' said Mum, 'before you freeze.' Check every comma sits inside the speech marks where it belongs." },
    { question: "Write three similes about rain, then rewrite each one as a metaphor.", answer: "For example: the rain was like needles → the rain was needles. Dropping the like is the whole change." },
    { question: "Write four sentences that personify the sea. Each one must give it something only a person does.", answer: "The sea muttered, argued, held its breath, changed its mind. Check both halves: not human, and doing a person's action." },
    { question: "Pick any character from a story you know. Write two things they said or did, and what each one tells you about them.", answer: "This is inferring, exactly as page 44 describes. The evidence has to come first and the conclusion second." },
  ],

  // The Test is set on a poem written for this board, so the child meets the
  // ideas on material they have not seen - and nothing in copyright is
  // reprinted to do it.
  assessmentStory: {
    text: {
      title: "The Last Bus - a narrative poem you have not met yet",
      passage: [
        { text: "Me an' Jojo waitin' by the gate, " },
        { text: "The bus is comin' but the bus is late,", tone: "gold", note: "Dialect: 'me' for my or I, and 'comin'' spelled how it sounds." },
        { text: " Ah got me ticket an' me lunch inside, " },
        { text: "A book to read an' a coat to hide " },
        { text: "The rain that's fallin' on me head - " },
        { text: "An' Mum still shoutin' from the shed.", tone: "blue", note: "Gate/late rhyme, and inside/hide rhyme. Head and shed rhyme too." },
        { text: " " },
        { text: "The bus rolls up. The doors go wide. " },
        { text: "Jojo grins an' climbs inside. " },
        { text: "Ah reach me hand into me sleeve - " },
        { text: "Me ticket's gone. Ah cannot leave.", tone: "red", note: "The plot: something happens, and it changes everything." },
      ],
    },
  },

  assessment: {
    partA: [
      {
        title: "Q1 · Is it narrative?",
        conceptId: "3.1",
        prompt: "Is 'The Last Bus' a narrative poem? How do you know?",
        options: [
          { label: "Yes - it has characters and a plot", correct: true, say: "Correct. The narrator and Jojo are the characters, and the plot is waiting for the bus and losing the ticket.", frame: { text: { title: "Narrative", passage: [{ text: "Characters: the narrator, Jojo, Mum. Plot: the bus comes and the ticket is gone.", tone: "green" }] } } },
          { label: "No - it is too short", correct: false, say: "Length is not the test. A narrative poem can be four lines long as long as it tells a story.", frame: { text: { title: "Length is not the test", passage: [{ text: "Characters and a plot. That is the test.", tone: "red" }] } } },
          { label: "No - it rhymes, so it is a rhyming poem", correct: false, say: "A poem can be both. Rhyming does not stop it telling a story, and telling a story is what makes it narrative.", frame: { text: { title: "It can be both", passage: [{ text: "Narrative poems may or may not rhyme.", tone: "gold" }] } } },
        ],
      },
      {
        title: "Q2 · Count the beats",
        conceptId: "3.2",
        prompt: "How many syllables are in the word 'ticket'?",
        options: [
          { label: "2", correct: true, say: "Yes - tick-et. Two vowel sounds, two beats.", frame: { text: { title: "2 syllables", chips: [{ text: "tick · et", tone: "green" }] } } },
          { label: "1", correct: false, say: "Say it aloud and clap - tick-et. That is two claps.", frame: { text: { title: "Two claps", chips: [{ text: "tick · et = 2", tone: "red" }] } } },
          { label: "3", correct: false, say: "Three would be a word like tomato. Ticket has two beats.", frame: { text: { title: "Three sounds like this", chips: [{ text: "to · ma · to = 3", tone: "gold" }, { text: "tick · et = 2", tone: "green" }] } } },
        ],
      },
      {
        title: "Q3 · Find the rhyme",
        conceptId: "3.3",
        prompt: "Which word in the poem rhymes with 'gate'?",
        options: [
          { label: "late", correct: true, say: "Correct - gate and late, right at the end of the first two lines.", frame: { text: { title: "gate / late", chips: [{ text: "Same ending sound.", tone: "green" }] } } },
          { label: "inside", correct: false, say: "Inside rhymes with hide, not with gate. Listen to the ending sound.", frame: { text: { title: "inside / hide", chips: [{ text: "A different pair.", tone: "gold" }] } } },
          { label: "grins", correct: false, say: "Grins does not rhyme with gate at all - it ends on an -ins sound.", frame: { text: { title: "Listen to the end", chips: [{ text: "g-ate / gr-ins", tone: "red" }] } } },
        ],
      },
    ],
    partB: [
      {
        title: "Q4 · Dialect",
        conceptId: "3.4",
        prompt: "The poem says 'Ah reach me hand into me sleeve'. What is that in standard English?",
        options: [
          { label: "I reach my hand into my sleeve", correct: true, say: "Right. Ah is I and me is my - the same two swaps you met in Sandwich.", frame: { text: { title: "Standard English", passage: [{ text: "I reach my hand into my sleeve", tone: "green" }] } } },
          { label: "A hand reaches into a sleeve", correct: false, say: "That keeps the action but loses the person. 'Ah' means I - it is his hand, and he is telling you.", frame: { text: { title: "Who is speaking?", passage: [{ text: "Ah = I. The narrator is in the sentence.", tone: "red" }] } } },
          { label: "He reached his hand into his sleeve", correct: false, say: "The poem is in the first person - Ah means I, not he. Switching to he changes who is telling the story.", frame: { text: { title: "First person", passage: [{ text: "Ah = I, so it stays I.", tone: "gold" }] } } },
        ],
      },
      {
        title: "Q5 · The plot",
        conceptId: "3.1",
        prompt: "What is the plot of 'The Last Bus'?",
        options: [
          { label: "He waits for the bus and then finds his ticket is gone", correct: true, say: "Yes. A plot is what happens and what changes - and losing the ticket changes everything.", frame: { text: { title: "The plot", passage: [{ text: "Waiting → the bus arrives → the ticket is missing.", tone: "green" }] } } },
          { label: "It is raining", correct: false, say: "The rain is setting, not plot. Setting is where and when; plot is what happens.", frame: { text: { title: "Setting, not plot", passage: [{ text: "Rain tells you the weather. It does not tell you what happened.", tone: "red" }] } } },
          { label: "Jojo grins", correct: false, say: "That is a detail inside the story, not the story itself. Ask what changes by the end.", frame: { text: { title: "A detail, not the plot", passage: [{ text: "What changed between the first line and the last?", tone: "gold" }] } } },
        ],
      },
      {
        title: "Q6 · Punctuate the speech",
        conceptId: "3.7",
        prompt: "Which of these is punctuated correctly?",
        options: [
          { label: "'Hold on,' said Jojo, 'I dropped my ticket.'", correct: true, say: "Correct - the reporting clause sits inside the speech with a comma on each side.", frame: { text: { title: "Correct", passage: [{ text: "'Hold on,' said Jojo, 'I dropped my ticket.'", tone: "green" }] } } },
          { label: "'Hold on' said Jojo 'I dropped my ticket.'", correct: false, say: "Nothing separates the speech from the reporting clause. The rule is a comma, question mark or exclamation mark.", frame: { text: { title: "Missing commas", passage: [{ text: "Two commas are needed. Page 47.", tone: "red" }] } } },
          { label: "'Hold on, said Jojo, I dropped my ticket.'", correct: false, say: "That leaves Jojo's name inside the speech marks, as if he said it out loud.", frame: { text: { title: "Close the marks first", passage: [{ text: "Only spoken words belong inside.", tone: "red" }] } } },
        ],
      },
      {
        title: "Q7 · Metaphor or personification?",
        conceptId: "3.9",
        prompt: "'The bus coughed twice and refused to move.' What is that?",
        options: [
          { label: "Personification", correct: true, say: "Yes - a bus is not human, and coughing and refusing are things people do. That is the book's two-part test.", frame: { text: { title: "Personification", passage: [{ text: "Not human + behaving like a person. Page 53.", tone: "green" }] } } },
          { label: "A simile", correct: false, say: "There is no like or as anywhere in it, so it cannot be a simile.", frame: { text: { title: "No like or as", passage: [{ text: "Similes always carry one or the other.", tone: "red" }] } } },
          { label: "Neither - buses really do make that noise", correct: false, say: "They make a noise, but 'coughed' and 'refused' are the writer choosing human words for it. That choice is the personification.", frame: { text: { title: "The word choice is the point", passage: [{ text: "Compare: the engine made a noise and stopped.", tone: "gold" }] } } },
        ],
      },
      {
        title: "Q8 · Why dialect?",
        conceptId: "3.4",
        prompt: "Why might a poet write this poem in dialect rather than standard English?",
        options: [
          { label: "To let you hear the narrator's real voice", correct: true, say: "Exactly - your book says the poet spells words how they should sound to capture the voices of the characters.", frame: { text: { title: "The voice", passage: [{ text: "Spelling words how they sound puts the person in the poem. (page 41)", tone: "green" }] } } },
          { label: "Because the poet cannot spell", correct: false, say: "No - every one of those spellings is a deliberate choice, and the book explains why on page forty-one.", frame: { text: { title: "A choice, not a mistake", passage: [{ text: "Valerie Bloom writes in Jamaican Creole on purpose. (page 41)", tone: "red" }] } } },
          { label: "To make the poem harder", correct: false, say: "It is not there to be difficult. It is there so you hear a real person speaking rather than a narrator.", frame: { text: { title: "Not difficulty - voice", passage: [{ text: "That is why the book gives you a glossary beside it.", tone: "gold" }] } } },
        ],
      },
    ],
  },

  readymade: [
    { q: "What is a narrative poem?", a: "A poem that tells a story. It has characters and a plot, and it may or may not rhyme." },
    { q: "How do I count syllables?", a: "Say the word slowly and clap each beat. Each beat is one vowel sound. School has six letters but only one beat." },
    { q: "Do rhyming words have to be spelled alike?", a: "No. Rhyme is about sound. Today and Bay rhyme, and they are spelled quite differently." },
    { q: "What is dialect?", a: "The way people really speak in a place. A poet may spell words how they sound to catch that voice." },
    { q: "What does 'teck' mean in the poem?", a: "Take. The glossary beside the poem on page 42 translates it for you." },
    { q: "How do I start my own narrative poem?", a: "Plan first. Decide who your narrator is, then answer one question per verse: where you go, what you eat, who you meet." },
    { q: "What is the difference between a simile and a metaphor?", a: "A simile says something is LIKE another thing, using like or as. A metaphor says it IS. You are like a star is a simile; you are the star is a metaphor." },
    { q: "What is personification?", a: "Describing something that is not human as being or behaving like a person - sunshine tiptoed through my window." },
    { q: "Where does the comma go in speech?", a: "Inside the speech marks, before they close: 'Come in,' said Mum. If the reporting clause comes first, the comma goes after it." },
    { q: "How do I work out what a character is like?", a: "Infer it from what they say and do. Neil keeps saying he must bring a sandwich, which suggests he wants to fit in." },
  ],
};
