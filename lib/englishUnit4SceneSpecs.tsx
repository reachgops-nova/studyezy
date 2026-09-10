import LiteracyConceptScene from "@/components/interactive/LiteracyConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." English Unit 4
// (Non-fiction: Information and explanation texts). Every value below is
// grounded in this unit's real, production content (fetched via railway
// ssh), never invented.
//
// Follows the same two fixes as Units 1-3's spec files (see Unit 1's
// header comment): scenes align to AvatarChat's fixed checkpoint index
// ([0] definition, [1] examples, [2] key_points, [3] tip), and a scene
// only appears where it's a genuine FORMAT change rather than prose
// re-boxed as a quote AvatarChat already renders as its own chat bubble.
export function getEnglishUnit4ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "4.1") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{ type: "checklistCard", items: ["Title, introduction, sub-headings", "Facts, diagrams, bullet points", "Topic-specific technical vocabulary"], caption: "Features of an information text" }}
      />,
      undefined,
    ];
  }

  if (conceptId === "4.2") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Information: non-chronological", "Explanation: chronological, a process", "The same topic can be either kind"],
          caption: "Telling the two text types apart",
        }}
      />,
      undefined,
    ];
  }

  if (conceptId === "4.3") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{ type: "checklistCard", items: ["who -> a name", "where -> a place", "when -> a time", "what/how/why -> a whole section"], caption: "Matching question words to answer types" }}
      />,
      undefined,
    ];
  }

  if (conceptId === "4.4") {
    return [
      undefined,
      undefined,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Formal: precise, technical, expert audience", "Informal: simpler, general audience", "-ology/-ogy = 'the study of'"],
          caption: "Styles of information text",
        }}
      />,
      undefined,
    ];
  }

  return undefined;
}
