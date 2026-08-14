import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getActiveProfileId } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";
import { UPLOADS_DIR } from "@/lib/uploads";

export const runtime = "nodejs";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
const MAX_FILE_BYTES = 12 * 1024 * 1024; // 12MB - generous for a phone photo
const MAX_FILES_PER_REQUEST = 20;

function sanitizeFilename(name: string): string {
  const ext = path.extname(name).toLowerCase().replace(/[^a-z0-9.]/g, "");
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
}

export async function POST(req: NextRequest) {
  const [profileId, user] = await Promise.all([getActiveProfileId(), getCurrentUser()]);
  if (!profileId || !user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(profileId);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many uploads at once - try again shortly." }, { status: 429 });
  }

  const formData = await req.formData();
  const unitKey = formData.get("unitKey");
  const purposeRaw = formData.get("purpose");
  const purpose = purposeRaw === "exam_page" ? "exam_page" : "textbook_source";

  if (typeof unitKey !== "string" || !UNIT_KEY_PATTERN.test(unitKey)) {
    return NextResponse.json({ error: "Missing or invalid unit." }, { status: 400 });
  }

  const unitRow = await db.unit.findUnique({ where: { unitKey } });
  if (!unitRow || !unitRow.available) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided." }, { status: 400 });
  }
  if (files.length > MAX_FILES_PER_REQUEST) {
    return NextResponse.json({ error: `Too many files - upload at most ${MAX_FILES_PER_REQUEST} at a time.` }, { status: 400 });
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: `"${file.name}" isn't a supported image type.` }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: `"${file.name}" is too large (max 12MB).` }, { status: 400 });
    }
  }

  // unitKey already validated against UNIT_KEY_PATTERN and a real unit lookup above,
  // so it's safe to use directly as a path segment - no traversal characters possible.
  const targetDir = path.join(UPLOADS_DIR, unitKey);
  await mkdir(targetDir, { recursive: true });

  const savedPaths: string[] = [];
  for (const file of files) {
    const filename = sanitizeFilename(file.name);
    const storageKey = `${unitKey}/${filename}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOADS_DIR, storageKey), bytes);

    await db.uploadedPage.create({
      data: {
        unitId: unitRow.id,
        uploadedByUserId: user.id,
        storageKey,
        originalFilename: file.name,
        mimeType: file.type,
        byteSize: file.size,
        purpose,
      },
    });

    savedPaths.push(`/api/uploads/${storageKey}`);
  }

  return NextResponse.json({ saved: savedPaths });
}
