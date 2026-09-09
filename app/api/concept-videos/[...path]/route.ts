import { NextRequest, NextResponse } from "next/server";
import { open, stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { getCurrentUser } from "@/lib/session";
import { UPLOADS_DIR } from "@/lib/uploads";

export const runtime = "nodejs";

const VIDEOS_DIR = path.join(UPLOADS_DIR, "concept-videos");

/**
 * Serves pilot concept-explanation videos (e.g. the decimal-tenths
 * explainer - see WidgetDispatcher.tsx's DECIMAL_PILOT case) - same
 * disk-based, no-DB-row shape as /api/concept-illustrations/[...path], but
 * with real HTTP Range support (206 Partial Content), since a browser
 * <video> element needs that to seek/scrub through a real video file
 * instead of only ever downloading it from the start.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { path: segments } = await params;
  if (segments.some((s) => s.includes("..") || s.includes("/") || s.includes("\\"))) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  const filePath = path.join(VIDEOS_DIR, ...segments);

  let fileSize: number;
  try {
    fileSize = (await stat(filePath)).size;
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const range = req.headers.get("range");
  const commonHeaders = {
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=86400",
  };

  if (!range) {
    const handle = await open(filePath, "r");
    const stream = Readable.toWeb(handle.createReadStream()) as ReadableStream;
    return new NextResponse(stream, {
      status: 200,
      headers: { ...commonHeaders, "Content-Length": String(fileSize) },
    });
  }

  const match = /^bytes=(\d+)-(\d*)$/.exec(range);
  if (!match) {
    return NextResponse.json({ error: "Invalid range." }, { status: 416 });
  }
  const start = Number(match[1]);
  const end = match[2] ? Math.min(Number(match[2]), fileSize - 1) : fileSize - 1;
  if (start >= fileSize || start > end) {
    return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${fileSize}` } });
  }

  const handle = await open(filePath, "r");
  const stream = Readable.toWeb(handle.createReadStream({ start, end })) as ReadableStream;
  return new NextResponse(stream, {
    status: 206,
    headers: {
      ...commonHeaders,
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Content-Length": String(end - start + 1),
    },
  });
}
