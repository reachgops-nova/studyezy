import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Concept } from "./types";

// Concepts extracted from a parent's uploaded textbook photos, stored
// separately from the hand-authored content/curricula JSON. This is
// Claude's own original explanation of what's shown in the photos, not a
// copy of the book's text - see the extraction prompt in
// app/api/pages/extract/route.ts. Tracked in git (it's original writing);
// the source photos it was drawn from are gitignored separately.
const GENERATED_ROOT = path.join(process.cwd(), "content", "generated");

function filePathFor(unitKey: string): string {
  return path.join(GENERATED_ROOT, `${unitKey}.json`);
}

export async function getGeneratedConcepts(unitKey: string): Promise<Concept[]> {
  try {
    const raw = await readFile(filePathFor(unitKey), "utf8");
    const parsed = JSON.parse(raw) as { concepts: Concept[] };
    return parsed.concepts ?? [];
  } catch {
    return [];
  }
}

export async function saveGeneratedConcepts(unitKey: string, concepts: Concept[]): Promise<void> {
  await mkdir(GENERATED_ROOT, { recursive: true });
  await writeFile(filePathFor(unitKey), JSON.stringify({ concepts }, null, 2), "utf8");
}
