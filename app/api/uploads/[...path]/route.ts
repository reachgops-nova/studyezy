import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { UPLOADS_DIR } from "@/lib/uploads";

export const runtime = "nodejs";

// Personal family textbook photos - never served without an active login,
// never CDN-cached publicly.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { path: segments } = await params;
  const storageKey = segments.join("/");

  const page = await db.uploadedPage.findFirst({ where: { storageKey } });
  if (!page) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const bytes = await readFile(path.join(UPLOADS_DIR, storageKey));
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": page.mimeType,
        "Content-Length": String(page.byteSize),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}
