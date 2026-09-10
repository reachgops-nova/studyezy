import LiteracyConceptScene from "@/components/interactive/LiteracyConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." English Unit 2
// (Non-fiction: Biography). Every value below is grounded in this unit's
// real, production content (fetched via railway ssh), never invented.
//
// Follows the same index-alignment fix as Unit 1's spec file (see its
// header comment for the full explanation): AvatarChat.tsx's
// buildCheckpoints() pairs checkpointSceneNodes[i] to a FIXED checkpoint
// index - [0] definition, [1] examples, [2] key_points, [3] tips[0]
// (only if that field exists) - so each item below shows exactly the
// content being spoken at that index, not just a loosely related visual.
export function getEnglishUnit2ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "2.1") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "A biography is a true, non-fiction record of the real events in a person's life, written from the viewpoint of an author - someone else, not the person themselves.",
          tag: "Definition",
          caption: "What a biography is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "Poorna Malavath was born on 10 June 2000 in a village in Telangana, India. Her family was very poor... but she grew up to climb to the peak of Mount Everest on 25 May 2014 aged 13 years and 11 months.",
          tag: "Example",
          caption: "A real biography opening",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: [
            "Written in the third person (he, she, they)",
            "Opens with who they are and why they're famous",
            "Events told in chronological order",
            "Exact dates, places, and achievements",
            "Quotes from the person or people who knew them",
          ],
          caption: "The five features every biography shares",
        }}
      />,
    ];
  }

  if (conceptId === "2.2") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Chronological order means arranging events in the exact sequence they happened in time. We use time connectives and adverbial phrases of time to guide the reader through this sequence.",
          tag: "Definition",
          caption: "What chronological order is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "timeline",
          points: [
            { label: "First", note: "won locally" },
            { label: "Afterwards", note: "injuries, recovered" },
            { label: "Eventually", note: "fastest on Earth" },
          ],
          caption: "Usain Bolt's Career told in chronological order using time connectives",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Adverbs of time (first, now, eventually)", "Adverbial phrases (in the end, later on)", "Comma after a time phrase that opens a sentence"],
          caption: "How chronological order is signalled in writing",
        }}
      />,
    ];
  }

  if (conceptId === "2.3") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Register is the tone and level of formality a writer or speaker chooses, depending on who they're communicating with and why.",
          tag: "Definition",
          caption: "What register is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "Formal: 'I would be grateful if you could provide further information.' Informal: 'Can you tell me more about it?'",
          tag: "Example",
          caption: "The same message, two registers",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Formal avoids contractions and slang", "Informal uses casual, everyday phrasing", "The right register depends on audience and purpose"],
          caption: "Formal vs. informal register",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Check for contractions ('don't', 'it's') and slang - their presence is the biggest giveaway that a piece is informal.",
          tag: "Tip",
          caption: "How to spot informal register",
        }}
      />,
    ];
  }

  if (conceptId === "2.4") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Writing becomes more interesting and precise when you replace overused words with synonyms - words with very similar meanings - found using a thesaurus.",
          tag: "Definition",
          caption: "Why synonyms matter",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "'Win' can become 'triumph', 'succeed', or 'come out on top', depending on how dramatic the sentence should sound.",
          tag: "Example",
          caption: "One word, several synonyms",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["A thesaurus lists synonyms for any word type", "Repeating a word makes writing feel flat", "Not every synonym fits every context"],
          caption: "How to use synonyms well",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Circle any word you've used three or more times on a page - that's your shortlist for synonym replacement.",
          tag: "Tip",
          caption: "Finding where you need more variety",
        }}
      />,
    ];
  }

  if (conceptId === "2.5") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Biography writers sometimes phrase opinions in a confident, fact-like tone, using strong descriptive words - spotting these disguised opinions matters.",
          tag: "Definition",
          caption: "Opinions dressed up as facts",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "quotedExcerpt", quote: "She became a sensation overnight.", tag: "Example", caption: "Sounds fact-like, but 'sensation' is a judgement - it's an opinion" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["'prodigy', 'sensation' are opinion signals", "Biographies mix real facts and admiring opinions", "Turn a sentence into a question to test it"],
          caption: "Spotting opinions in biographies",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Watch for superlatives and glowing descriptions ('prodigy', 'the best', 'a sensation') - they're almost always opinions dressed up as facts.",
          tag: "Tip",
          caption: "What to watch for",
        }}
      />,
    ];
  }

  if (conceptId === "2.6") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Prefixes are letters added to the BEGINNING of a root word to change its meaning. Suffixes are letters added to the END of a word to change its grammatical form.",
          tag: "Definition",
          caption: "Prefixes vs. suffixes",
        }}
      />,
      <LiteracyConceptScene key={1} spec={{ type: "quotedExcerpt", quote: "patient + im- -> impatient (not patient)", tag: "Example", caption: "A negative prefix in action" }} />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["il- before l, im- before m/p, ir- before r", "Double the final letter (1-syllable verbs)", "Only double if the final syllable is stressed"],
          caption: "The prefix and suffix rules",
        }}
      />,
    ];
  }

  return undefined;
}
