import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getActiveProfileId } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_FILE_BYTES, sanitizeFilename, UPLOADS_DIR } from "@/lib/uploads";

export const runtime = "nodejs";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;
const REFERENCE_TYPES = new Set(["worksheet", "question", "homework", "other"]);

// Chat references are deliberately not UnitResource or UploadedPage rows.
// They are family-provided research material that may later inform better
// hints/homework, but they do not become canonical curriculum automatically.
export async function POST(req: NextRequest) {
  const [profileId, user] = await Promise.all([getActiveProfileId(), getCurrentUser()]);
  if (!profileId || !user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const rateLimit = checkRateLimit(`reference:${user.id}`);
  if (!rateLimit.allowed) return NextResponse.json({ error: "Too many uploads at once - try again shortly." }, { status: 429 });

  const formData = await req.formData();
  const unitKey = formData.get("unitKey");
  const conceptId = formData.get("conceptId");
  const referenceType = formData.get("referenceType");
  const file = formData.get("file");
  if (typeof unitKey !== "string" || !UNIT_KEY_PATTERN.test(unitKey) || !(file instanceof File)) {
    return NextResponse.json({ error: "Choose a worksheet or question file first." }, { status: 400 });
  }
  if (typeof referenceType !== "string" || !REFERENCE_TYPES.has(referenceType)) {
    return NextResponse.json({ error: "Invalid reference type." }, { status: 400 });
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Use a PDF, JPG, PNG, or WEBP file." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_FILE_BYTES) {
    return NextResponse.json({ error: "That file is too large (maximum 200MB)." }, { status: 400 });
  }

  const unit = await db.unit.findUnique({ where: { unitKey }, select: { id: true, available: true } });
  if (!unit || !unit.available) return NextResponse.json({ error: "Unit not found." }, { status: 404 });

  const storageDir = path.join(UPLOADS_DIR, "references", user.id);
  await mkdir(storageDir, { recursive: true });
  const storageKey = `references/${user.id}/${sanitizeFilename(file.name)}`;
  await writeFile(path.join(UPLOADS_DIR, storageKey), Buffer.from(await file.arrayBuffer()));
  const saved = await db.referenceUpload.create({
    data: {
      unitId: unit.id,
      uploadedByUserId: user.id,
      conceptId: typeof conceptId === "string" ? conceptId : null,
      storageKey,
      originalFilename: file.name,
      mimeType: file.type,
      byteSize: file.size,
      referenceType,
      status: "pending",
    },
  });

  return NextResponse.json({ ok: true, id: saved.id, message: "Saved as reference material for future homework and hints." });
}
