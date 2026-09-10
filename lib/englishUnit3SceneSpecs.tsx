import LiteracyConceptScene from "@/components/interactive/LiteracyConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." English Unit 3
// (Poetry: Narrative poems) reuses LiteracyConceptScene's existing
// quotedExcerpt/checklistCard variants as-is, no new scene shape needed.
// Every value below is grounded in this unit's real, production content
// (fetched via railway ssh), never invented.
export function getEnglishUnit3ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "3.1") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{ type: "checklistCard", items: ["Characters", "A plot", "Dialogue", "Descriptions of settings"], caption: "A narrative poem tells a story, just like other stories - but written in poetic form" }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "checklistCard",
          items: ["Rhyme is optional", "Storytelling elements define it, not the sound pattern"],
          caption: "What separates a narrative poem from other poems is that it tells a story",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "quotedExcerpt",
          quote: "'Bat' has 1 syllable; 'mysterious' has 4",
          tag: "Syllables",
          caption: "Counting syllables per line like this helps compare the rhythm of different lines in a poem",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{ type: "checklistCard", items: ["Does it tell a story?", "Events happening in order?"], caption: "Check this first before analysing a narrative poem's features" }}
      />,
    ];
  }

  if (conceptId === "3.2") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "checklistCard",
          items: ["What they say", "What they do", "What others say about them"],
          caption: "These three clues reveal character in poetry, just like in stories - readers must infer, not be told directly",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "fumbling with buttons and taking too long to get ready",
          tag: "Infer: nervous",
          caption: "Readers infer nervousness from this, without the poem stating it directly",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "quotedExcerpt",
          quote: "calling out warmly and packing an extra treat",
          tag: "Infer: caring",
          caption: "Readers infer this character is caring, from actions rather than a direct statement",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["List what they say, do, and what others say", "Then combine into one overall impression"],
          caption: "Piecing together character clues from a poem is like solving a puzzle",
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
          quote: "'I love to read,' the teacher said.",
          tag: "Reporting clause after",
          caption: "Comma before the closing speech mark when the reporting clause comes after",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "The teacher said, 'I love to read.'",
          tag: "Reporting clause before",
          caption: "Comma after the reporting clause when it comes before the speech",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Speech marks around the exact words spoken", "Comma separates the reporting clause"],
          caption: "Direct speech in a poem is punctuated the same way as in prose",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{ type: "checklistCard", items: ["Read the sentence aloud", "Does it pause where the comma is?"], caption: "A quick way to check if you've placed the comma correctly" }}
      />,
    ];
  }

  if (conceptId === "3.4") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{ type: "quotedExcerpt", quote: "The sky is shining like a star.", tag: "Simile", caption: "Compares using 'like' or 'as'" }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "quotedExcerpt", quote: "The sky is a shining star.", tag: "Metaphor", caption: "Drops 'like'/'as' and states the comparison directly" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{ type: "quotedExcerpt", quote: "He is a giant.", tag: "Metaphor", caption: "The person isn't literally a giant, but this suggests great size or an imposing presence" }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["Missing 'like' or 'as'?", "But still comparing two things?", "-> metaphor"],
          caption: "Test whether a comparison is a metaphor or simile this way",
        }}
      />,
    ];
  }

  if (conceptId === "3.5") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{ type: "quotedExcerpt", quote: "Sunshine tiptoed through my window.", tag: "Personification", caption: "Gives sunshine the human action of tiptoeing" }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "The wind howled angrily all night.",
          tag: "Personification",
          caption: "Gives the wind a human emotion (anger) and a human-like sound",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Is a non-human thing doing something only a person could do?", "If yes -> personification"],
          caption: "This question tells you whether you've spotted personification",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "checklistCard",
          items: ["'gentle breeze that whispered' -> calm mood", "'wind that screamed' -> frightening mood"],
          caption: "Pick a human action or feeling that matches the mood you want",
        }}
      />,
    ];
  }

  return undefined;
}
