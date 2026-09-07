import "server-only";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { extractPackFragmentClaude, isConfigured, type ExtractionSourceFile } from "./claude";
import { extractPackFragmentGroq, isGroqConfigured } from "./groq";
import { extractPackFragmentGemini, isGeminiConfigured, verifyChoiceAnswer, verifyChoiceAnswerFromDiagramData } from "./gemini";
import { renderPdfPageToPng, cropNormalizedBox } from "./pdfCrop";
import { UPLOADS_DIR } from "./uploads";
// @ts-ignore - plain JS module (allowJs handles resolution; this silences any type-inference gaps without failing the build if none turn out to exist)
import { validatePack } from "../content/engine/validate.mjs";

const PROMPT_PATH = path.join(process.cwd(), "content", "prompts", "extract-worksheet.md");
const MAX_REPAIR_ATTEMPTS = 3;

// Real, empirically-hit constraint (not assumed - measured live against a
// real English page): a single call here needs ~6800 of Groq's 8000 TPM
// budget on its own (dense system prompt + one photo full of body text +
// completion). Groq's limit is a ROLLING 60s window, so two such calls
// anywhere within 60s of each other still sum past the cap regardless of
// how they're spaced within that window - a first attempt at 25s spacing
// still collided. The only reliable fix is spacing calls a full minute-plus
// apart so each one's tokens age out of the window before the next starts.
const CALL_SPACING_MS = 65_000;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface PackMeta {
  book: string;
  subject: string;
  board: string;
  stage: string;
  year?: string;
}

export interface PageResult {
  imagePath: string;
  sheets: number;
  questions: number;
  errors: string[];
  modelUsed: string;
}

export interface ContentPackResult {
  pack: Record<string, unknown>;
  perPage: PageResult[];
  totals: { inputTokens: number; outputTokens: number };
  modelUsed: string;
  validation: { errors: string[]; warnings: string[]; counts: { sheets: number; questions: number; fields: number; needsHuman: number } };
}

// Real gap found live 2026-08-24: content/prompts/extract-worksheet.md tells
// the model to "return one JSON object matching schema/pack.schema.json" but
// neither this file nor the original content/engine/convert.mjs ever
// actually SENDS that schema's content in the call - it's referenced by
// name only. On a real run, Qwen3.6-27B put every single-answer question's
// "check" directly on the question object instead of wrapping it in a
// "fields" array (9/9 questions, survived 3 repair attempts even with the
// validator's exact error text fed back), and used "label" instead of the
// required "title"/"no" at the sheet level. A concrete worked example
// (proven more reliable for structured generation than an abstract JSON
// Schema) fixes both, without editing extract-worksheet.md itself.
//
// Second gap found live 2026-09-06, converting a real multiple-choice
// Olympiad paper via Gemini: every choice-type field wrote its answer
// options under "choices", but content/engine/validate.mjs requires
// "options" specifically (content/engine/checks.js's f.input === 'choice' /
// 'multi' branch) - 35/35 questions got this wrong the same way, a
// systematic naming guess rather than a random mistake, which the repair
// loop's generic "fix this validation error" feedback is unlikely to
// resolve on its own since it never states the correct key name. Added a
// second worked example below covering exactly this shape.
export const FIELD_SHAPE_REMINDER = `

IMPORTANT - exact shape reminder, because this is commonly gotten wrong: every question needs a "fields" array, even for a single blank. Never put "check" directly on the question object. Every sheet needs "title" (a short worksheet title) and "no" (its number) - "label" only belongs on questions and fields, never on a sheet. A choice/multiple-choice field's answer options go under "options" (never "choices"), and its "input" must be exactly "choice" (one answer) or "multi" (several answers) - not "multi_choice". Example of a correctly-shaped multiple-choice question:
{"id": "q1", "label": "1", "prompt": "Which type of network connects personal devices within a short range?", "fields": [{"key": "ans", "label": "Answer", "input": "choice", "options": ["Personal Area Network", "Local Area Network", "Wide Area Network", "Metropolitan Area Network"], "check": {"kind": "choice", "value": "Personal Area Network"}}], "hint": "Think about the range - a smartwatch talking to a phone, not a whole building.", "explanation": "A Personal Area Network (PAN) connects devices within a few metres of one person, like a phone and a smartwatch."}

Example of a correctly-shaped sheet with one single-answer question:
{"id": "sheet-1", "no": 1, "title": "Comprehension: Why Cockerels Crow", "objective": "Recall characters and setting from the story.", "skill": "reading-comprehension", "questions": [{"id": "q1a", "label": "a", "prompt": "Who are the main characters in this story?", "fields": [{"key": "a", "label": "Your answer", "input": "text", "check": {"kind": "keywords", "allOf": [["Hyena", "Cockerel"]], "modelAnswer": "Hyena and Cockerel."}}], "hint": "Look for the names mentioned in the dialogue.", "explanation": "The text names two characters: Hyena and Cockerel."}]}`;

let cachedPrompt: { system: string; userTemplate: string } | null = null;

async function loadPrompt(): Promise<{ system: string; userTemplate: string }> {
  if (cachedPrompt) return cachedPrompt;
  const raw = await readFile(PROMPT_PATH, "utf8");
  const system = raw.split("## SYSTEM")[1].split("## USER")[0].trim();
  const userTemplate = raw.split("## USER")[1].split("---")[0].trim();
  cachedPrompt = { system, userTemplate };
  return cachedPrompt;
}

function fillTemplate(template: string, meta: PackMeta): string {
  const values: Record<string, string> = {
    book: meta.book,
    subject: meta.subject,
    board: meta.board,
    stage: meta.stage,
    year: meta.year ?? "",
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, k: string) => values[k] ?? "");
}

// Groq-first, Claude-fallback - same tiering as lib/conceptImageTranscription.ts,
// for the same reason (this deployment has no ANTHROPIC_API_KEY configured).
// Images only - a PDF goes through callVisionModelForDocument below instead.
async function callVisionModel(
  image: { path: string; mediaType: "image/jpeg" | "image/png" | "image/webp"; base64: string },
  system: string,
  userText: string
): Promise<{ text: string; inputTokens: number; outputTokens: number; modelUsed: string }> {
  if (isGroqConfigured()) {
    try {
      const result = await extractPackFragmentGroq(image, system, userText);
      return { ...result, modelUsed: "qwen/qwen3.6-27b" };
    } catch (err) {
      console.error("extractPackFragmentGroq failed, trying Claude fallback", err);
    }
  }
  if (isConfigured()) {
    const result = await extractPackFragmentClaude(image, system, userText);
    return { ...result, modelUsed: "claude-sonnet-5" };
  }
  throw new Error("Neither Groq nor Claude is configured for content-pack extraction.");
}

// A bare `mediaType !== "application/pdf"` check narrows that one property
// read but not the whole containing object's assignability to
// callVisionModel's narrower parameter type - an explicit type predicate
// does, and is what actually lets the branch below typecheck.
function isImageFile(
  file: ExtractionSourceFile
): file is ExtractionSourceFile & { mediaType: "image/jpeg" | "image/png" | "image/webp" } {
  return file.mediaType !== "application/pdf";
}

// A whole PDF document, not one photographed page - added 2026-09-06 so this
// pipeline can read a PDF at all (Groq has no vision model; Claude isn't
// configured in production - neither was ever a candidate for this). Gemini
// only for now: verified live against a real workbook PDF, and unlike the
// image path above, no second PDF-capable fallback is wired in here yet -
// that gap is real, not silently papered over, hence the explicit throw.
async function callVisionModelForDocument(
  file: ExtractionSourceFile,
  system: string,
  userText: string
): Promise<{ text: string; inputTokens: number; outputTokens: number; modelUsed: string }> {
  if (!isGeminiConfigured()) {
    throw new Error("Gemini isn't configured - PDF content-pack conversion has no other capable provider right now.");
  }
  const result = await extractPackFragmentGemini(file, system, userText);
  return { ...result, modelUsed: "gemini-flash-latest" };
}

interface RawQuestion {
  id?: string;
  [key: string]: unknown;
}
interface RawSheet {
  id?: string;
  no?: number;
  questions?: RawQuestion[];
  [key: string]: unknown;
}

// Real bug found live 2026-08-24, converting a full unit across batches: each
// page is extracted independently, so every page's model call invents its
// own "sheet-1" - merging pages verbatim left 4 sheets all sharing the id
// "sheet-1" (and question ids like "q1a" reused too), which would silently
// break the player's per-sheet tab navigation (only one of the four sheets
// would ever be reachable, since ids are used as lookup keys). Renumbered
// deterministically here, using how many sheets are already in the running
// pack as the starting index, so ids stay unique across every batch.
export function renumberSheets(sheets: unknown[], startIndex: number): unknown[] {
  return sheets.map((s, i) => {
    const sheet = s as RawSheet;
    const newSheetId = `sheet-${startIndex + i + 1}`;
    const questions = (sheet.questions ?? []).map((q, qi) => {
      const question = q as RawQuestion;
      const originalId = question.id || `q${qi + 1}`;
      return { ...question, id: `${newSheetId}-${originalId}` };
    });
    return { ...sheet, id: newSheetId, no: startIndex + i + 1, questions };
  });
}

export function parsePackJson(raw: string): { error?: string; sheets?: unknown[] } | null {
  const cleaned = raw.replace(/^```(?:json)?/m, "").replace(/```$/m, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

interface PhotoCropMedia {
  kind: "photo_crop";
  note?: string;
  sourcePage?: number;
  box_2d?: [number, number, number, number];
  croppedImageUrl?: string;
}

/**
 * Real region cropped from the source PDF, for every photo_crop question the
 * model confidently localized (sourcePage + box_2d - see extract-worksheet.md's
 * updated guidance). Mutates each question's media in place; a question the
 * model didn't localize, or one that fails to render/crop for any reason,
 * is left exactly as it was (still needsHuman - a missing crop is never
 * treated as a hard failure of the whole conversion).
 *
 * Only meaningful for the whole-document Gemini path - a per-page-image
 * conversion (Groq/Claude) has no multi-page PDF to look a page number up
 * against, so this is only called when the source file was itself a PDF.
 */
async function fillPhotoCrops(sheets: unknown[], pdfBytes: Buffer, packId: string): Promise<number> {
  const pageCache = new Map<number, Buffer>();
  let filled = 0;

  for (const s of sheets) {
    const sheet = s as RawSheet;
    for (const q of sheet.questions ?? []) {
      const question = q as RawQuestion;
      const media = question.media as PhotoCropMedia | undefined;
      if (!media || media.kind !== "photo_crop" || !media.sourcePage || !media.box_2d) continue;

      try {
        let pageImage = pageCache.get(media.sourcePage);
        if (!pageImage) {
          pageImage = await renderPdfPageToPng(pdfBytes, media.sourcePage);
          pageCache.set(media.sourcePage, pageImage);
        }
        const cropped = await cropNormalizedBox(pageImage, media.box_2d);

        const dir = path.join(UPLOADS_DIR, "content-crops", packId);
        await mkdir(dir, { recursive: true });
        const filename = `${question.id ?? `q${filled}`}.png`;
        await writeFile(path.join(dir, filename), cropped);

        media.croppedImageUrl = `/api/content-crops/${packId}/${filename}`;
        // A real image now stands in for the review flag that asked a human
        // to check this question - leaving both would show a real diagram
        // next to a "needs a check" banner that no longer applies, and would
        // keep inflating needsHumanCount (which drives the pack's clean/
        // needs_review status) for something that's now actually resolved.
        delete question.needsHuman;
        delete question.reviewReason;
        filled++;

        await verifyAndCorrectAnswer(question, cropped);
      } catch (err) {
        console.error(`Couldn't crop photo for question ${question.id} (page ${media.sourcePage})`, err);
      }
    }
  }

  return filled;
}

interface CheckableField {
  key?: string;
  input?: string;
  options?: string[];
  check?: { kind?: string; value?: string };
}

// A single-answer "choice" field with real options - the only shape either
// verification pass below knows how to check. Returns null (not throwing)
// when a question doesn't qualify, so both call sites can just skip it.
function singleChoiceField(question: RawQuestion): CheckableField | null {
  const fields = (question.fields as CheckableField[] | undefined) ?? [];
  if (fields.length !== 1 || fields[0].check?.kind !== "choice" || !fields[0].options) return null;
  return fields[0];
}

function applyCorrection(
  question: RawQuestion,
  field: CheckableField,
  recordedAnswer: string,
  result: { isCorrect: boolean; correctAnswer: string; reasoning: string }
): void {
  if (result.isCorrect || !field.options!.includes(result.correctAnswer)) return;
  console.log(
    `Corrected answer for question ${question.id}: "${recordedAnswer}" -> "${result.correctAnswer}" (${result.reasoning})`
  );
  field.check!.value = result.correctAnswer;
  question.explanation = result.reasoning;
}

/**
 * Real bug caught live 2026-09-07: extraction wrote "5 shirts" and answer 20
 * for a question whose real cropped image shows 4 shirts (correct answer
 * 16) - a wrong answer marked against a child, caught only by a human
 * spot-check after the fact. This is the automated version of that
 * spot-check: a focused second look at ONLY the real cropped image (see
 * lib/gemini.ts's verifyChoiceAnswer), scoped to single-answer "choice"
 * questions - the case that was actually caught, and the easiest to verify
 * unambiguously. Never throws - a verification failure leaves the recorded
 * answer untouched rather than blocking the whole conversion.
 */
async function verifyAndCorrectAnswer(question: RawQuestion, croppedImage: Buffer): Promise<void> {
  const field = singleChoiceField(question);
  if (!field) return;
  const prompt = typeof question.prompt === "string" ? question.prompt : "";
  const recordedAnswer = field.check!.value ?? "";

  try {
    const result = await verifyChoiceAnswer(croppedImage, prompt, field.options!, recordedAnswer);
    applyCorrection(question, field, recordedAnswer, result);
  } catch (err) {
    console.error(`Couldn't verify answer for question ${question.id}`, err);
  }
}

/**
 * The declarative-media counterpart of verifyAndCorrectAnswer, above - added
 * 2026-09-07 alongside the count_grid renderer (see
 * content/prompts/extract-worksheet.md), which the model now prefers over
 * photo_crop for any diagram that's really just "count these items"
 * (including a combinatorics question like the shirts/hangers case that
 * caught the original bug). There's no photograph to misread here, but the
 * model can still get its own arithmetic wrong when it first writes the
 * question - this re-derives the answer from the exact media parameters,
 * which are already the complete ground truth, so the check is a
 * re-derivation rather than a vision task.
 *
 * Deliberately excludes `photo_crop` (handled by verifyAndCorrectAnswer,
 * which has the real image) and any question with no media at all (nothing
 * declarative to re-derive from). Exported for reuse by
 * lib/contentPackVariants.ts, where it matters even more - an authored
 * variant's numbers are new, unverified-by-a-human content, not a copy of
 * something already checked once.
 */
export async function verifyDiagramAnswers(sheets: unknown[]): Promise<number> {
  let verified = 0;
  for (const s of sheets) {
    const sheet = s as RawSheet;
    for (const q of sheet.questions ?? []) {
      const question = q as RawQuestion;
      const media = question.media as { kind?: string } | undefined;
      if (!media || media.kind === "photo_crop") continue;
      const field = singleChoiceField(question);
      if (!field) continue;
      const prompt = typeof question.prompt === "string" ? question.prompt : "";
      const recordedAnswer = field.check!.value ?? "";

      try {
        const result = await verifyChoiceAnswerFromDiagramData(media, prompt, field.options!, recordedAnswer);
        applyCorrection(question, field, recordedAnswer, result);
        verified++;
      } catch (err) {
        console.error(`Couldn't verify diagram answer for question ${question.id}`, err);
      }
    }
  }
  return verified;
}

/**
 * Converts a set of real photographed pages into a validated "content pack"
 * (content/schema/pack.schema.json) - the declarative-check alternative to
 * Concept's plain-prose fields. Runs ONE page per model call (not one call
 * per whole book, unlike content/engine/convert.mjs's original design) -
 * Groq's Qwen3.6-27B has an 8000 TPM cap, incompatible with a single
 * multi-sheet 32000-token completion. Each page gets up to
 * MAX_REPAIR_ATTEMPTS tries, feeding the validator's own error text back as
 * a correction prompt, exactly like the original convert.mjs's repair loop.
 *
 * `existing` lets a full unit be converted across several smaller, more
 * observable calls (e.g. ~5 pages at a time) instead of one very long-lived
 * request: pass the previous batch's resulting sheets/photoCount back in and
 * this batch's pages get appended onto the same running pack.
 */
export async function convertPagesToPack(
  images: ExtractionSourceFile[],
  meta: PackMeta,
  packId: string,
  existing?: { sheets: unknown[]; photoCount: number }
): Promise<ContentPackResult> {
  const { system, userTemplate } = await loadPrompt();
  const filledUser = fillTemplate(userTemplate, meta);

  const allSheets: unknown[] = existing ? [...existing.sheets] : [];
  const perPage: PageResult[] = [];
  let totalInput = 0;
  let totalOutput = 0;
  let modelUsed = "";
  let isFirstCall = true;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const isDocument = image.mediaType === "application/pdf";
    const pagingNote = isDocument
      ? `\n\nYou are being sent the ENTIRE document as one file, not a single page - it may span many pages. Extract ` +
        `every distinct sheet you can find across the WHOLE document, not just the first page. If a question's ` +
        `content clearly continues past what you can read, set "needsHuman": true with a reviewReason explaining why.`
      : `\n\nYou are being sent ONE page at a time (page ${i + 1} of ${images.length} in this batch), not the whole ` +
        `book. Extract only the sheet(s) whose full content appears on this page. If a question's content clearly ` +
        `continues onto a page you don't have, set "needsHuman": true with a reviewReason explaining that it spans pages.`;

    let userText = filledUser + pagingNote + FIELD_SHAPE_REMINDER;
    let sheets: unknown[] = [];
    let lastErrors: string[] = [];

    for (let attempt = 1; attempt <= MAX_REPAIR_ATTEMPTS; attempt++) {
      // The 65s pacing below exists only for Groq's rolling rate limit - a
      // PDF always goes to Gemini (see callVisionModelForDocument), which
      // has no such constraint, so it skips the wait entirely.
      if (!isFirstCall && !isDocument) await sleep(CALL_SPACING_MS);
      isFirstCall = false;

      let result: { text: string; inputTokens: number; outputTokens: number; modelUsed: string };
      if (isImageFile(image)) {
        result = await callVisionModel(image, system, userText);
      } else {
        result = await callVisionModelForDocument(image, system, userText);
      }
      totalInput += result.inputTokens;
      totalOutput += result.outputTokens;
      modelUsed = result.modelUsed;

      const parsed = parsePackJson(result.text);
      if (!parsed) {
        lastErrors = ["model did not return valid JSON"];
        if (attempt === MAX_REPAIR_ATTEMPTS) break;
        userText = `${filledUser}${pagingNote}${FIELD_SHAPE_REMINDER}\n\nYour previous attempt did not return valid JSON. Return ONLY the JSON object, no markdown fences, no commentary.`;
        continue;
      }
      if (parsed.error) {
        lastErrors = [`model refused: ${parsed.error}`];
        break;
      }

      sheets = parsed.sheets ?? [];
      const probePack = {
        packVersion: "1.0",
        packId,
        source: { book: meta.book, capturedAs: "parent photo upload", confidence: "mixed" },
        curriculum: { board: meta.board, stage: meta.stage, subject: meta.subject },
        language: "en",
        sheets,
      };
      const v = validatePack(probePack) as { errors: string[]; warnings: string[] };
      if (v.errors.length === 0) {
        lastErrors = [];
        break;
      }
      lastErrors = v.errors;
      if (attempt === MAX_REPAIR_ATTEMPTS) break;
      userText =
        `${filledUser}${pagingNote}${FIELD_SHAPE_REMINDER}\n\nYour previous attempt failed automated validation. Fix exactly these ` +
        `problems and return the corrected pack in full. Do not change anything else.\n\n${v.errors.join("\n")}`;
    }

    if (isDocument && sheets.length > 0) {
      const filled = await fillPhotoCrops(sheets, Buffer.from(image.base64, "base64"), packId);
      if (filled > 0) console.log(`Filled ${filled} photo_crop image(s) from the source document.`);
    }
    if (sheets.length > 0) {
      const verified = await verifyDiagramAnswers(sheets);
      if (verified > 0) console.log(`Verified ${verified} declarative-diagram answer(s) against their own data.`);
    }

    allSheets.push(...renumberSheets(sheets, allSheets.length));
    perPage.push({
      imagePath: image.path,
      sheets: sheets.length,
      questions: sheets.reduce((a: number, s: unknown) => a + ((s as { questions?: unknown[] }).questions?.length ?? 0), 0),
      errors: lastErrors,
      modelUsed,
    });
  }

  const pack = {
    packVersion: "1.0",
    packId,
    source: {
      book: meta.book,
      capturedAs: "parent photo upload",
      photoCount: (existing?.photoCount ?? 0) + images.length,
      extractedOn: new Date().toISOString().slice(0, 10),
      confidence: perPage.some((p) => p.errors.length) ? "low" : "mixed",
    },
    curriculum: { board: meta.board, stage: meta.stage, subject: meta.subject },
    language: "en",
    sheets: allSheets,
  };

  const validation = validatePack(pack) as ContentPackResult["validation"];

  return { pack, perPage, totals: { inputTokens: totalInput, outputTokens: totalOutput }, modelUsed, validation };
}
