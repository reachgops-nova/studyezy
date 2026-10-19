import "server-only";
import { logAiCost } from "./aiCost";

// Napkin AI (napkin.ai) - added 2026-10-09 as the provider for STRUCTURED
// diagrams (flowcharts, timelines, comparisons, mindmaps) with real,
// correctly-typeset text labels. This is deliberately a different tool from
// lib/conceptIllustration.ts's Gemini pipeline: that one draws a text-free
// mascot SCENE on purpose (a real pilot found AI image models garble any
// text baked into pixels - see that file's HOUSE_STYLE comment), while
// Napkin lays out real text supplied by the caller into a clean diagram
// layout, so there is no garbled-text risk the same way. Use this when the
// visual itself needs labelled structure (steps, a timeline, a comparison);
// keep using conceptIllustration.ts for a plain illustrative scene.
//
// Full request/response contract confirmed live against
// https://api.napkin.ai/api/napkin-api-documentation on 2026-10-09 (the
// OpenAPI page is client-rendered, so this was read via a real browser, not
// guessed): POST /v1/visual creates an async job, GET
// /v1/visual/:id/status is polled until status is "completed"/"failed", and
// the completed response's generated_files[].url is a ready-to-download
// link (Bearer-authenticated) - no need to hand-build the /file/:file-id
// path documented separately. Both the status and file URLs expire 30
// minutes after generation, so a completed file must be downloaded
// immediately, not queued for later.
const BASE_URL = "https://api.napkin.ai";

export function isNapkinConfigured(): boolean {
  return Boolean(process.env.NAPKIN_API_KEY);
}

function authHeaders(accept = "application/json"): Record<string, string> {
  return { Accept: accept, Authorization: `Bearer ${process.env.NAPKIN_API_KEY ?? ""}` };
}

export type NapkinFormat = "svg" | "png" | "ppt";
export type NapkinColorMode = "light" | "dark" | "both";
export type NapkinOrientation = "auto" | "horizontal" | "vertical" | "square";

export interface CreateVisualRequestOptions {
  /** Main text content to visualize - must contain at least one real word. */
  content: string;
  /** Related context that should inform layout/tone but not appear verbatim in the visual. */
  context?: string;
  /** BCP 47 tag, e.g. "en", "en-IN" - strongly recommended for correct results. */
  language?: string;
  format?: NapkinFormat;
  /** e.g. "flowchart", "timeline", "mindmap", "comparison" - searches for a matching layout. */
  visualQuery?: string;
  styleId?: string;
  transparentBackground?: boolean;
  colorMode?: NapkinColorMode;
  orientation?: NapkinOrientation;
}

interface NapkinGeneratedFile {
  id?: string;
  url?: string;
  format?: string;
  [key: string]: unknown;
}

interface NapkinVisualResponse {
  id: string;
  status: "pending" | "completed" | "failed";
  generated_files?: NapkinGeneratedFile[];
  warnings?: unknown[];
  error?: { message?: string; code?: string } | null;
}

async function createVisualRequest(opts: CreateVisualRequestOptions): Promise<NapkinVisualResponse> {
  const res = await fetch(`${BASE_URL}/v1/visual`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({
      format: opts.format ?? "svg",
      content: opts.content,
      context: opts.context,
      language: opts.language ?? "en",
      style_id: opts.styleId,
      visual_query: opts.visualQuery,
      transparent_background: opts.transparentBackground,
      color_mode: opts.colorMode,
      orientation: opts.orientation,
    }),
  });
  if (res.status === 402) {
    throw new Error("Napkin request failed (402): no account credits remaining.");
  }
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(`Napkin create-visual request failed (${res.status}): ${bodyText.slice(0, 500)}`);
  }
  return (await res.json()) as NapkinVisualResponse;
}

async function getVisualStatus(requestId: string): Promise<NapkinVisualResponse> {
  const res = await fetch(`${BASE_URL}/v1/visual/${requestId}/status`, { headers: authHeaders() });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(`Napkin status request failed (${res.status}): ${bodyText.slice(0, 500)}`);
  }
  return (await res.json()) as NapkinVisualResponse;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Napkin's own docs say most requests finish in 10-30s. Polling every 2s up
// to 45s gives real jobs room to finish without ever leaving a caller
// hanging much past the documented range.
async function pollUntilDone(requestId: string, timeoutMs = 45_000, intervalMs = 2_000): Promise<NapkinVisualResponse> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const result = await getVisualStatus(requestId);
    if (result.status !== "pending") return result;
    if (Date.now() > deadline) {
      throw new Error(`Napkin request ${requestId} did not finish within ${timeoutMs}ms (still pending).`);
    }
    await sleep(intervalMs);
  }
}

export interface GeneratedVisual {
  bytes: Buffer;
  contentType: string;
  format: NapkinFormat;
  requestId: string;
}

/**
 * End-to-end: create the request, poll until it either completes or fails,
 * then download the first generated file while its 30-minute link is still
 * valid. `feature` is only used for cost/usage logging (see lib/aiCost.ts) -
 * Napkin bills by credits, not tokens, so this logs 0/0 tokens with model
 * "napkin-visual" (cost shows as "unknown" in the log line, same as any
 * other non-token-priced call would) purely so every external call site
 * still shows up in one place.
 */
export async function generateVisualNapkin(feature: string, opts: CreateVisualRequestOptions): Promise<GeneratedVisual> {
  if (!isNapkinConfigured()) {
    throw new Error("NAPKIN_API_KEY isn't configured.");
  }
  const created = await createVisualRequest(opts);
  const result = created.status === "pending" ? await pollUntilDone(created.id) : created;

  if (result.status === "failed") {
    throw new Error(`Napkin visual generation failed: ${result.error?.message ?? result.error?.code ?? "unknown error"}`);
  }
  const file = result.generated_files?.[0];
  if (!file?.url) {
    throw new Error("Napkin request completed but returned no generated file.");
  }

  const fileRes = await fetch(file.url, { headers: authHeaders("*/*") });
  if (!fileRes.ok) {
    const bodyText = await fileRes.text().catch(() => "");
    throw new Error(`Napkin file download failed (${fileRes.status}): ${bodyText.slice(0, 500)}`);
  }
  const bytes = Buffer.from(await fileRes.arrayBuffer());
  const contentType = fileRes.headers.get("content-type") ?? "image/svg+xml";

  logAiCost(feature, "napkin-visual", 0, 0);
  return { bytes, contentType, format: opts.format ?? "svg", requestId: result.id };
}

export interface NapkinStyle {
  id: string;
  name?: string;
  [key: string]: unknown;
}

export async function listNapkinStyles(): Promise<NapkinStyle[]> {
  const res = await fetch(`${BASE_URL}/v1/styles`, { headers: authHeaders() });
  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(`Napkin list-styles request failed (${res.status}): ${bodyText.slice(0, 500)}`);
  }
  const data = (await res.json()) as { styles?: NapkinStyle[] };
  return data.styles ?? [];
}

/**
 * Builds Napkin's `content` input from a Concept's own already-vetted text
 * (never invented) - same "don't make anything up" rule as
 * lib/conceptIllustration.ts's buildPrompt, just feeding a diagram layout
 * instead of a scene. `visualQuery` lets the caller ask for a specific
 * layout family (e.g. "flowchart" for a process, "timeline" for a sequence
 * of events, "comparison" for two things side by side) - omit it to let
 * Napkin pick whatever layout best fits the content.
 */
export function buildConceptDiagramContent(concept: { name: string; definition?: string | null; keyPoints: string[]; examples: string[] }): string {
  const lines = [concept.name];
  if (concept.definition) lines.push(concept.definition);
  if (concept.keyPoints.length) lines.push(...concept.keyPoints);
  if (concept.examples.length) lines.push(...concept.examples);
  return lines.join("\n");
}
