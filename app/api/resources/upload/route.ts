import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_FILE_BYTES, sanitizeFilename, UPLOADS_DIR } from "@/lib/uploads";
import { isFreezable, isResourceType } from "@/lib/unitResources";

export const runtime = "nodejs";

const UNIT_KEY_PATTERN = /^[a-z0-9]+-\d+-[a-z0-9]+-\d+$/i;
const MAX_FILES_PER_REQUEST = 20;

/**
 * Admin-curated curriculum content (PLATFORM_PLAN.md §2.7). Any signed-in
 * user can contribute a textbook/worksheet/classwork/homework page - it
 * lands as "pending" until an admin approves it, at which point it becomes
 * the one shared copy for every student of that grade+curriculum and
 * further non-admin uploads of that type freeze for this unit. An admin's
 * own upload auto-approves immediately. Exam question papers and answer
 * sheets skip the freeze check entirely - see lib/unitResources.ts.
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(user.id);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many uploads at once - try again shortly." }, { status: 429 });
  }

  const formData = await req.formData();
  const unitKey = formData.get("unitKey");
  const resourceTypeRaw = formData.get("resourceType");

  if (typeof unitKey !== "string" || !UNIT_KEY_PATTERN.test(unitKey)) {
    return NextResponse.json({ error: "Missing or invalid unit." }, { status: 400 });
  }
  if (!isResourceType(resourceTypeRaw)) {
    return NextResponse.json({ error: "Missing or invalid resource type." }, { status: 400 });
  }
  const resourceType = resourceTypeRaw;

  const unitRow = await db.unit.findUnique({ where: { unitKey } });
  const isAdmin = user.role === "admin";

  // Non-admins can only contribute to units already live for families - but
  // an admin curating a not-yet-published unit's reference pages (exactly
  // the authoring workflow this route now needs to support) must be able to
  // upload before the unit's `available` flag flips on.
  if (!unitRow || (!unitRow.available && !isAdmin)) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 });
  }

  if (!isAdmin && isFreezable(resourceType)) {
    const existingApproved = await db.unitResource.findFirst({
      where: { unitId: unitRow.id, resourceType, status: "approved" },
    });
    if (existingApproved) {
      return NextResponse.json(
        { error: "This unit already has approved material for this - no need to upload again." },
        { status: 409 }
      );
    }
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided." }, { status: 400 });
  }
  if (files.length > MAX_FILES_PER_REQUEST) {
    return NextResponse.json({ error: `Too many files - upload at most ${MAX_FILES_PER_REQUEST} at a time.` }, { status: 400 });
  }
  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: `"${file.name}" isn't a supported image type.` }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_FILE_BYTES) {
      return NextResponse.json({ error: `"${file.name}" is too large (max 12MB).` }, { status: 400 });
    }
  }

  // unitKey already validated against UNIT_KEY_PATTERN and a real unit lookup
  // above, so it's safe to use directly as a path segment.
  const targetDir = path.join(UPLOADS_DIR, "resources", unitKey);
  await mkdir(targetDir, { recursive: true });

  const now = new Date();
  const saved: { id: string; path: string }[] = [];
  for (const file of files) {
    const filename = sanitizeFilename(file.name);
    const storageKey = `resources/${unitKey}/${filename}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOADS_DIR, storageKey), bytes);

    const row = await db.unitResource.create({
      data: {
        unitId: unitRow.id,
        resourceType,
        storageKey,
        originalFilename: file.name,
        mimeType: file.type,
        byteSize: file.size,
        uploadedByUserId: user.id,
        status: isAdmin ? "approved" : "pending",
        approvedByUserId: isAdmin ? user.id : null,
        approvedAt: isAdmin ? now : null,
      },
    });

    saved.push({ id: row.id, path: `/api/uploads/${storageKey}` });
  }

  return NextResponse.json({ saved, status: isAdmin ? "approved" : "pending" });
}
