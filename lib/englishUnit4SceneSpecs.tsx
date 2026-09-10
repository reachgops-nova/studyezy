import LiteracyConceptScene from "@/components/interactive/LiteracyConceptScene";
import type { ReactNode } from "react";

// Real user direction 2026-09-10: "start working on the other units...
// prepare those lessons for english and math cambridge." English Unit 4
// (Non-fiction: Information and explanation texts). Every value below is
// grounded in this unit's real, production content (fetched via railway
// ssh), never invented.
//
// Follows the same index-alignment fix as Units 1-3's spec files (see
// Unit 1's header comment for the full explanation): AvatarChat.tsx's
// buildCheckpoints() pairs checkpointSceneNodes[i] to a FIXED checkpoint
// index - [0] definition, [1] examples, [2] key_points, [3] tips[0]
// (only if that field exists).
export function getEnglishUnit4ConceptScenes(conceptId: string): ReactNode[] | undefined {
  if (conceptId === "4.1") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "An information text is a piece of non-fiction writing about a topic - it can be read in any order, which is why it's sometimes called a non-chronological report.",
          tag: "Definition",
          caption: "What an information text is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "An information text about volcanoes might use technical vocabulary like 'lava', 'magma', and 'ash cloud', organized under sub-headings like 'How volcanoes form.'",
          tag: "Example",
          caption: "Technical vocabulary and sub-headings",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Title, introduction, sub-headings", "Facts, diagrams, bullet points", "Topic-specific technical vocabulary"],
          caption: "Features of an information text",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Skim an information text first for a general impression, then scan it to find specific facts you actually need.",
          tag: "Tip",
          caption: "Two reading speeds for two different jobs",
        }}
      />,
    ];
  }

  if (conceptId === "4.2") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "An information text presents facts about a topic and can be read in any order; an explanation text describes a process, showing how or why something happens, usually chronologically.",
          tag: "Definition",
          caption: "Information vs. explanation texts",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{ type: "quotedExcerpt", quote: "Icebergs form when...then...eventually...", tag: "Example", caption: "An explanation text, chronologically describing a process" }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Information: non-chronological", "Explanation: chronological, a process", "The same topic can be either kind"],
          caption: "Telling the two text types apart",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Ask: does this text describe a PROCESS happening over time, or does it just present facts about a topic?",
          tag: "Tip",
          caption: "The question that answers which type it is",
        }}
      />,
    ];
  }

  if (conceptId === "4.3") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Scanning means reading an information text quickly to find the answer to a specific question, rather than reading every word.",
          tag: "Definition",
          caption: "What scanning is",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "For 'Where do coral reefs grow?', scan for a place name - the answer is 'in warm shallow seas and oceans.'",
          tag: "Example",
          caption: "Scanning for a place-name answer",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["who -> a name", "where -> a place", "when -> a time", "what/how/why -> a whole section"],
          caption: "Matching question words to answer types",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Before scanning, turn the question into the kind of answer you're hunting for - a name, a place, a time, or an explanation.",
          tag: "Tip",
          caption: "How to scan effectively",
        }}
      />,
    ];
  }

  if (conceptId === "4.4") {
    return [
      <LiteracyConceptScene
        key={0}
        spec={{
          type: "quotedExcerpt",
          quote: "Information texts can be written formally (technical language) or informally (simpler, everyday language) - and '-ology'/'-ogy' often means 'the study of' a topic.",
          tag: "Definition",
          caption: "Register and suffixes in information texts",
        }}
      />,
      <LiteracyConceptScene
        key={1}
        spec={{
          type: "quotedExcerpt",
          quote: "A formal information text about ecosystems might use 'photosynthesis' and 'biodiversity' without explaining them; an informal version might say 'how plants make food' instead.",
          tag: "Example",
          caption: "Formal vs. informal register",
        }}
      />,
      <LiteracyConceptScene
        key={2}
        spec={{
          type: "checklistCard",
          items: ["Formal: precise, technical, expert audience", "Informal: simpler, general audience", "-ology/-ogy = 'the study of'"],
          caption: "Styles of information text",
        }}
      />,
      <LiteracyConceptScene
        key={3}
        spec={{
          type: "quotedExcerpt",
          quote: "Check who the text seems to be written for - unexplained technical terms suggest a formal, expert audience.",
          tag: "Tip",
          caption: "How to spot the intended audience",
        }}
      />,
    ];
  }

  return undefined;
}
