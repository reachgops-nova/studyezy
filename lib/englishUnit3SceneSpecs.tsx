import LiteracyConceptScene from "@/components/interactive/LiteracyConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." English Unit 3
// (Poetry: Narrative poems). Every value below is grounded in this unit's
// real, production content (fetched via railway ssh), never invented.
//
// Follows the same two fixes as Unit 1/2's spec files (see Unit 1's
// header comment): scenes align to AvatarChat's fixed checkpoint index
// ([0] definition, [1] examples, [2] key_points, [3] tip), and a scene
// only appears where it's a genuine FORMAT change rather than prose
// re-boxed as a quote AvatarChat already renders as its own chat bubble.
export function getEnglishUnit3ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "3.1") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{ type: "checklistCard", items: ["Always tells a story", "Rhyme is optional", "Syllables per line show its rhythm"], caption: "What defines a narrative poem" }}
      />,
      undefined,
    ];
  }

  if (conceptId === "3.2") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{ type: "checklistCard", items: ["What they say", "What they do", "What others say about them"], caption: "The three clues that reveal character" }}
      />,
      undefined,
    ];
  }

  if (conceptId === "3.3") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Reporting clause can come before or after", "A comma always separates it from the speech", "Vary its placement to avoid repetition"],
          caption: "How to punctuate dialogue",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "3.4") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Similes use 'like' or 'as'; metaphors don't", "The two things share some quality", "Metaphors appear in all kinds of poems"],
          caption: "How metaphors work",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "3.5") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Gives human qualities to non-human things", "It's a type of metaphor", "Helps create mood and atmosphere"],
          caption: "How personification works",
        }}
      />,
      undefined,
    ];
  }

  return undefined;
}
