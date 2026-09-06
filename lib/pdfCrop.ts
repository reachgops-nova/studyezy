import "server-only";
import { createCanvas } from "@napi-rs/canvas";
import sharp from "sharp";

// Real question found live 2026-09-06: content-pack extraction's photo_crop
// fallback ("Original figure could not be rebuilt automatically... sent for
// review") is fine for a genuinely one-off diagram the model can't express
// declaratively, but most of a real Olympiad paper's "photo_crop" questions
// are actual photographed diagrams (a device, a toolbar, a motherboard) -
// the source PDF already HAS the real image, it just needs to be rendered
// and cropped, not redrawn. Verified locally before building this into the
// pipeline: pdfjs-dist + @napi-rs/canvas renders a real page correctly (no
// system PDF libraries needed - sharp's own bundled libvips can't read a
// PDF directly, confirmed live), and Gemini can return an accurate
// box_2d for a specific diagram on the page (verified against a real
// microphone icon - the crop matched exactly).

// pdfjs-dist's legacy Node build works without a DOM/worker; the "legacy"
// entry point is deliberate - the default entry assumes a browser or a
// module worker, neither of which exists in this server-only lib.
async function loadPdfjs() {
  return import("pdfjs-dist/legacy/build/pdf.mjs");
}

/** Renders one 1-indexed page of a PDF to a PNG buffer. */
export async function renderPdfPageToPng(pdfBytes: Buffer, pageNumber: number, scale = 2.0): Promise<Buffer> {
  const pdfjsLib = await loadPdfjs();
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes), disableFontFace: true }).promise;
  if (pageNumber < 1 || pageNumber > doc.numPages) {
    throw new Error(`Page ${pageNumber} is out of range (document has ${doc.numPages} pages).`);
  }
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const width = Math.floor(viewport.width);
  const height = Math.floor(viewport.height);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  // @ts-expect-error - pdfjs's RenderParameters type expects a DOM CanvasRenderingContext2D; @napi-rs/canvas's context is a compatible runtime shape but a different TS type.
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  return canvas.toBuffer("image/png");
}

/**
 * Crops a rendered page PNG to a box_2d region - Gemini's own object-detection
 * convention: [ymin, xmin, ymax, xmax], each normalized 0-1000 regardless of
 * the image's real pixel size. `pad` adds a small margin around the box so a
 * tight box doesn't clip the real figure's edge.
 */
export async function cropNormalizedBox(
  pageImage: Buffer,
  box2d: [number, number, number, number],
  pad = 20
): Promise<Buffer> {
  const meta = await sharp(pageImage).metadata();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  if (!W || !H) throw new Error("Could not read rendered page dimensions.");

  const [ymin, xmin, ymax, xmax] = box2d;
  const left = Math.max(0, Math.round((xmin / 1000) * W) - pad);
  const top = Math.max(0, Math.round((ymin / 1000) * H) - pad);
  const rawWidth = Math.round(((xmax - xmin) / 1000) * W) + pad * 2;
  const rawHeight = Math.round(((ymax - ymin) / 1000) * H) + pad * 2;
  const width = Math.max(1, Math.min(W - left, rawWidth));
  const height = Math.max(1, Math.min(H - top, rawHeight));

  return sharp(pageImage).extract({ left, top, width, height }).png().toBuffer();
}
