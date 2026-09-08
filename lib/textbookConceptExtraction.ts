import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { extractPackFragmentGemini, isGeminiConfigured } from "./gemini";
import type { ExtractionSourceFile } from "./claude";
import type { Concept, VoiceQASample } from "./types";

const PROMPT_PATH = path.join(process.cwd(), "content", "prompts", "extract-unit-textbook-concepts.md");

let cachedSystem: string | null = null;
async function loadSystem(): Promise<string> {
  if (cachedSystem) return cachedSystem;
  const raw = await readFile(PROMPT_PATH, "utf8");
  cachedSystem = raw.split("## SYSTEM")[1].split("## After the model returns")[0].trim();
  return cachedSystem;
}

interface RawTextbookConcept {
  concept_id: string;
  concept_name: string;
  definition: string;
  key_points: string[];
  examples: string[];
  tips_to_remember: string[];
  voice_qa_samples: VoiceQASample[];
}

/** Evenly-spaced page numbers across [start, end], capped at `max` - enough for a parent to visually confirm the lesson matches the real book without rendering (and storing) every page of a large section. */
export function sampleUnitPageNumbers(start: number, end: number, max = 4): number[] {
  const span = end - start + 1;
  if (span <= max) {
    return Array.from({ length: span }, (_, i) => start + i);
  }
  const step = (span - 1) / (max - 1);
  const pages = new Set<number>();
  for (let i = 0; i < max; i++) pages.add(Math.round(start + i * step));
  return Array.from(pages).sort((a, b) => a - b);
}

export interface TextbookUnitExtraction {
  concepts: Concept[];
  /** 1-indexed PDF page numbers (this file's own position, not any printed page number) bounding this unit's section - lets the caller render a few real pages, see app/api/pages/extract-from-textbook/route.ts. Null if the model didn't return a usable range. */
  pageStart: number | null;
  pageEnd: number | null;
}

/**
 * Fills in Learn-phase Concepts for ONE unit that was created via the
 * table-of-contents textbook upload (lib/textbookToc.ts) - that flow attaches
 * the whole book to every created unit as a UnitResource, but never splits it
 * by unit, and the existing page-photo extraction (lib/claude.ts's
 * EXTRACTION_SYSTEM_PROMPT/FREEFORM_EXTRACTION_SYSTEM_PROMPT, driven by
 * app/api/pages/extract/route.ts) only ever reads discrete UploadedPage
 * photos - a completely separate table this flow never populates. This is
 * the missing piece: read the whole book once per unit, targeting only that
 * unit's own section by title+position.
 *
 * Gemini-only, same reason as lib/textbookToc.ts - it's the only provider
 * here with real native PDF support at this file size.
 */
export async function extractUnitConceptsFromTextbook(
  file: ExtractionSourceFile,
  unitTitle: string,
  unitNumber: number,
  totalUnits: number
): Promise<TextbookUnitExtraction> {
  if (!isGeminiConfigured()) {
    throw new Error("Gemini isn't configured - textbook concept extraction has no other capable provider right now.");
  }
  const system = await loadSystem();
  const result = await extractPackFragmentGemini(
    file,
    system,
    `Extract concepts for unit ${unitNumber} of ${totalUnits}: "${unitTitle}". Find this unit's own section of the book using its title and position among the other units, and extract only from that section.`
  );
  const cleaned = result.text.replace(/^```(?:json)?/m, "").replace(/```$/m, "").trim();

  let parsed: { concepts?: RawTextbookConcept[]; page_start?: number; page_end?: number; error?: string };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Couldn't read clear content for "${unitTitle}" from this textbook.`);
  }
  if (parsed.error) {
    throw new Error(parsed.error);
  }

  const concepts = (parsed.concepts ?? []).filter((c) => c.concept_id && c.concept_name);
  if (concepts.length === 0) {
    throw new Error(`Couldn't find "${unitTitle}"'s own section in this textbook.`);
  }

  return {
    concepts: concepts.map((c): Concept => ({
      concept_id: c.concept_id,
      concept_name: c.concept_name,
      status: "drafted",
      source: "extracted",
      definition: c.definition,
      key_points: c.key_points ?? [],
      examples: c.examples ?? [],
      tips_to_remember: c.tips_to_remember ?? [],
      voice_qa_samples: c.voice_qa_samples ?? [],
      media: { video_status: "coming_soon" },
    })),
    pageStart: typeof parsed.page_start === "number" && parsed.page_start > 0 ? parsed.page_start : null,
    pageEnd: typeof parsed.page_end === "number" && parsed.page_end > 0 ? parsed.page_end : null,
  };
}
