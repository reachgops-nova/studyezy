import LiteracyConceptScene from "@/components/interactive/LiteracyConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." English Unit 3
// (Poetry: Narrative poems). Every value below is grounded in this unit's
// real, production content (fetched via railway ssh), never invented.
//
// Follows the same index-alignment fix as Unit 1/2's spec files (see
// Unit 1's header comment for the full explanation): AvatarChat.tsx's
// buildCheckpoints() pairs checkpointSceneNodes[i] to a FIXED checkpoint
// index - [0] definition, [1] examples, [2] key_points, [3] tips[0]
// (only if that field exists).
export function getEnglishUnit3ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "3.1") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "A narrative poem is a poem that tells a story. It can include characters, a plot, dialogue, and settings - but it's written in poetic form, and may or may not rhyme.",
          tag: "Definition",
          caption: "What a narrative poem is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "A narrative poem about a school trip might include a character (the narrator), a plot (getting ready, going on the trip), dialogue, and a setting.",
          tag: "Example",
          caption: "A narrative poem's storytelling elements",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Always tells a story", "Rhyme is optional", "Syllables per line show its rhythm"],
          caption: "What defines a narrative poem",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Before analysing a narrative poem's features, first check: does it actually tell a story with events happening in order?",
          tag: "Tip",
          caption: "Check this first",
        }}
      />,
    ];
  }

  if (conceptId === "3.2") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Poems reveal what characters are like through what they say, what they do, and what other characters think or say about them - readers must infer these traits.",
          tag: "Definition",
          caption: "How character is shown in poetry",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "If a poem's narrator describes fumbling with buttons and taking too long to get ready, readers infer nervousness, without the poem stating it directly.",
          tag: "Example",
          caption: "Inferring nervousness from actions",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["What they say", "What they do", "What others say about them"],
          caption: "The three clues that reveal character",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "List everything a character says, does, and what others say about them separately first - then combine the lists into one overall impression.",
          tag: "Tip",
          caption: "How to piece together character clues",
        }}
      />,
    ];
  }

  if (conceptId === "3.3") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Direct speech in a poem is punctuated the same way as in prose: speech marks around the exact words spoken, and a comma separating the reporting clause.",
          tag: "Definition",
          caption: "Punctuating dialogue",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "quotedExcerpt", quote: "'I love to read,' the teacher said.", tag: "Example", caption: "Comma before the closing speech mark, reporting clause after" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Reporting clause can come before or after", "A comma always separates it from the speech", "Vary its placement to avoid repetition"],
          caption: "How to punctuate dialogue",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Read the sentence aloud - if it doesn't naturally pause where you've placed the comma, you've probably put it in the wrong spot.",
          tag: "Tip",
          caption: "How to check your comma placement",
        }}
      />,
    ];
  }

  if (conceptId === "3.4") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "A metaphor compares two things by saying one thing IS another, without using 'like' or 'as' - unlike a simile, which uses those words.",
          tag: "Definition",
          caption: "Metaphor vs. simile",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "'He is a giant' - the person isn't literally a giant, but the metaphor suggests great size or an imposing presence.",
          tag: "Example",
          caption: "A metaphor in action",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Similes use 'like' or 'as'; metaphors don't", "The two things share some quality", "Metaphors appear in all kinds of poems"],
          caption: "How metaphors work",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Test whether a comparison is a metaphor or simile by checking for 'like' or 'as' - if those words are missing but a comparison is still being made, it's a metaphor.",
          tag: "Tip",
          caption: "Telling a metaphor from a simile",
        }}
      />,
    ];
  }

  if (conceptId === "3.5") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Personification is a special type of metaphor where a writer describes something non-human or not alive as if it were a person, giving it human actions or feelings.",
          tag: "Definition",
          caption: "What personification is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "quotedExcerpt", quote: "Sunshine tiptoed through my window.", tag: "Example", caption: "Gives sunshine the human action of tiptoeing" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Gives human qualities to non-human things", "It's a type of metaphor", "Helps create mood and atmosphere"],
          caption: "How personification works",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Ask: is a non-human thing doing something only a person or animal could really do? If yes, that's personification.",
          tag: "Tip",
          caption: "How to spot personification",
        }}
      />,
    ];
  }

  return undefined;
}
