"use server";

import { redirect } from "next/navigation";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_FILE_BYTES, sanitizeFilename, UPLOADS_DIR } from "@/lib/uploads";
import { extractTextbookUnits } from "@/lib/textbookToc";

// Real bug found live 2026-09-06: this used to collapse non-alphanumeric
// runs into a single hyphen (e.g. "Olympiad Computers 4th Grade" ->
// "olympiad-computers-4th-grade"). Every unitKey parser in the app
// (app/learn/[unitId]/page.tsx and ~8 others) does `unitKey.split("-")`
// expecting exactly 4 tokens - curriculum/[stage]/subject/unit - which only
// holds if the curriculum and subject slugs are themselves hyphen-free.
// A multi-word board/subject name broke that invariant and 404'd every
// unit under it. Concatenating instead of hyphenating keeps every existing
// `.split("-")` call site correct without having to touch all of them.
function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "");
}

// Resolves (or creates) the Stage a new subject/board should attach to.
// Three modes, matching the picker's three states (real feedback
// 2026-09-06: "Any board / Curriculum / Grade / Subject - check for
// existing books, if not available add yours"):
//   "existing"  - pick a real, already-seeded board+grade
//   "new_grade" - add a new grade under an existing board (e.g. a new
//                 Stage under the Cambridge curriculum)
//   "new_board" - add a whole new board/curriculum (also how a
//                 competitive/global exam gets created - see the exam
//                 preset form, which just calls this in "new_board" mode
//                 with a single general-purpose "grade")
// Upserts rather than requiring an exact match so re-submitting the same
// board/grade name is harmless (the "check existing" behaviour) instead of
// erroring or creating a duplicate.
async function resolveStageId(formData: FormData): Promise<string> {
  const boardMode = String(formData.get("boardMode") ?? "existing");

  if (boardMode === "existing") {
    const stageId = String(formData.get("stageId") ?? "");
    if (!stageId) redirect("/manage?error=missing_subject_fields");
    const stage = await db.stage.findUnique({ where: { id: stageId } });
    if (!stage) redirect("/manage?error=unknown_stage");
    return stageId;
  }

  const newStageLabel = String(formData.get("newStageLabel") ?? "").trim();
  const newStageNumber = Number(formData.get("newStageNumber"));
  if (!newStageLabel || !Number.isInteger(newStageNumber)) {
    redirect("/manage?error=missing_grade_fields");
  }

  let curriculumId: string;
  if (boardMode === "new_board") {
    const newBoardName = String(formData.get("newBoardName") ?? "").trim();
    if (!newBoardName) redirect("/manage?error=missing_board_fields");
    const slug = slugify(newBoardName);
    const curriculum = await db.curriculum.upsert({
      where: { slug },
      create: { slug, name: newBoardName },
      update: {},
    });
    curriculumId = curriculum.id;
  } else if (boardMode === "new_grade") {
    curriculumId = String(formData.get("curriculumId") ?? "");
    if (!curriculumId) redirect("/manage?error=missing_grade_fields");
    const curriculum = await db.curriculum.findUnique({ where: { id: curriculumId } });
    if (!curriculum) redirect("/manage?error=unknown_board");
  } else {
    redirect("/manage?error=missing_subject_fields");
  }

  const stage = await db.stage.upsert({
    where: { curriculumId_number: { curriculumId, number: newStageNumber } },
    create: { curriculumId, number: newStageNumber, label: newStageLabel, available: true },
    update: { available: true },
  });
  return stage.id;
}

export async function createSubject(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stageId = await resolveStageId(formData);
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect("/manage?error=missing_subject_fields");
  }

  const slug = slugify(name);
  await db.subject.upsert({
    where: { stageId_slug: { stageId, slug } },
    create: { stageId, slug, name, available: true, createdByUserId: user.id },
    update: { available: true },
  });

  redirect("/manage?success=subject_added");
}

// Adds a new board on its own, with no subject yet - used by the "global /
// competitive exam" preset form (Olympiad, NEET, GRE, ...), which don't fit
// a grade-numbered curriculum but reuse the exact same Curriculum+Stage
// shape with one general-purpose "grade". Once created it shows up in the
// board picker above like any other board, ready for a subject to be added
// under it.
export async function createBoard(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  void user;

  const name = String(formData.get("boardName") ?? "").trim();
  if (!name) redirect("/manage?error=missing_board_fields");

  const slug = slugify(name);
  const curriculum = await db.curriculum.upsert({
    where: { slug },
    create: { slug, name },
    update: {},
  });

  await db.stage.upsert({
    where: { curriculumId_number: { curriculumId: curriculum.id, number: 1 } },
    create: { curriculumId: curriculum.id, number: 1, label: "General", available: true },
    update: { available: true },
  });

  redirect(`/manage?success=board_added&curriculumId=${curriculum.id}`);
}

export async function createUnit(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const subjectId = String(formData.get("subjectId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const publisher = String(formData.get("publisher") ?? "").trim();
  const bookTitle = String(formData.get("bookTitle") ?? "").trim();
  const outlineRaw = String(formData.get("outline") ?? "");
  // Real feedback (2026-09-06): "once I choose subject its asking for units
  // to add. Instead say textbook unit content etc. question paper workbook
  // etc. we will choose only what to add" - the old flow dropped straight
  // into a raw "id: name" concepts textarea with no guidance on what to do
  // next. nextStep sends them straight to the real tool for whichever kind
  // of content they actually want: the lesson/coaching content lives on the
  // unit's own overview page (upload pages, then extract); a practice
  // workbook or 1-3 final exam papers (with hints - already built into the
  // pack player) both live on /admin/resources, which is where approved
  // material and GeneratePaperButton already are.
  const nextStep = String(formData.get("nextStep") ?? "learn");
  // "curriculum" (default - Learn -> workbook -> tiered test) | "olympiad"
  // (skip Learn, practice sets -> 2 exam sets) - see AddUnitForm's "How does
  // this unit teach?" choice.
  const contentModeRaw = String(formData.get("contentMode") ?? "curriculum");
  const contentMode = contentModeRaw === "olympiad" ? "olympiad" : "curriculum";

  if (!subjectId || !title) {
    redirect("/manage?error=missing_unit_fields");
  }

  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    include: { stage: { include: { curriculum: true } }, units: { select: { number: true } } },
  });
  if (!subject) {
    redirect("/manage?error=unknown_subject");
  }

  // Real feedback (2026-09-06): "we don't need to feed unit numbers here
  // which makes it complicated" - just the next one after whatever's
  // already in this subject, instead of asking the family to track it.
  const number = subject.units.length > 0 ? Math.max(...subject.units.map((u) => u.number)) + 1 : 1;
  const unitKey = `${subject.stage.curriculum.slug}-${subject.stage.number}-${subject.slug}-${number}`;

  const unit = await db.unit.create({
    data: {
      subjectId,
      unitKey,
      number,
      title,
      available: true,
      contentMode,
      createdByUserId: user.id,
      sourcePublisher: publisher || null,
      sourceTitle: bookTitle || null,
      masteryChecklist: { source_note: "", items: [] },
      // No initial QuestionPaper rows - an admin generates each difficulty
      // tier from approved material once there's something to test (see
      // app/admin/resources's GeneratePaperButton), same as before this
      // moved off the old single-blob Unit.progressionTestDraft field.
    },
  });

  // One outline concept per non-empty line, formatted "id: name" - kept as a
  // plain textarea rather than a dynamic repeating field list, since this
  // authoring flow is for a handful of concepts at a time, not bulk entry.
  let orderIndex = 0;
  for (const line of outlineRaw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex === -1) continue;
    const conceptKey = trimmed.slice(0, separatorIndex).trim();
    const name = trimmed.slice(separatorIndex + 1).trim();
    if (!conceptKey || !name) continue;

    await db.concept.create({
      data: { unitId: unit.id, conceptKey, name, status: "outline", orderIndex: orderIndex++ },
    });
  }

  // "Take a picture and upload here... this subject can be processed with
  // Workbook and text explanation if chosen" (real feedback 2026-09-06) -
  // lets a brand-new unit get its source pages right at creation instead of
  // requiring a separate trip to the unit page or Curriculum Materials
  // first. Goes to whichever table matches what was actually chosen above:
  // UploadedPage (feeds the freeform-extraction path just added) for
  // explanation content, UnitResource (feeds Curriculum Materials'
  // approve-then-convert pipeline) for a workbook/exam papers.
  const files = formData.getAll("pages").filter((f): f is File => f instanceof File && f.size > 0);
  // Real feedback (2026-09-06): "throw exact error to uploaders" - a
  // rejected file used to just vanish with zero explanation (silently
  // filtered out). Each one now gets a specific, real reason instead of a
  // generic failure, and surfaces even though the unit itself (and
  // whichever files DID pass) still gets created - nothing is lost, the
  // family just needs to know which file(s) to try again separately.
  const rejectedFiles: string[] = [];
  if (files.length > 0) {
    const validFiles = files.filter((f) => {
      if (!ALLOWED_IMAGE_TYPES.has(f.type)) {
        rejectedFiles.push(`"${f.name}" isn't a supported file type - only images and PDF are accepted.`);
        return false;
      }
      if (f.size > MAX_UPLOAD_FILE_BYTES) {
        const mb = (f.size / (1024 * 1024)).toFixed(1);
        const maxMb = Math.round(MAX_UPLOAD_FILE_BYTES / (1024 * 1024));
        rejectedFiles.push(`"${f.name}" is ${mb}MB - over the ${maxMb}MB limit.`);
        return false;
      }
      return true;
    });
    if (nextStep === "resources") {
      const targetDir = path.join(UPLOADS_DIR, "resources", unitKey);
      await mkdir(targetDir, { recursive: true });
      const isAdmin = user.role === "admin";
      const now = new Date();
      for (const file of validFiles) {
        const filename = sanitizeFilename(file.name);
        const storageKey = `resources/${unitKey}/${filename}`;
        await writeFile(path.join(UPLOADS_DIR, storageKey), Buffer.from(await file.arrayBuffer()));
        await db.unitResource.create({
          data: {
            unitId: unit.id,
            resourceType: "textbook",
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
      }
    } else {
      const targetDir = path.join(UPLOADS_DIR, unitKey);
      await mkdir(targetDir, { recursive: true });
      for (const file of validFiles) {
        const filename = sanitizeFilename(file.name);
        const storageKey = `${unitKey}/${filename}`;
        await writeFile(path.join(UPLOADS_DIR, storageKey), Buffer.from(await file.arrayBuffer()));
        await db.uploadedPage.create({
          data: {
            unitId: unit.id,
            uploadedByUserId: user.id,
            storageKey,
            originalFilename: file.name,
            mimeType: file.type,
            byteSize: file.size,
            purpose: "textbook_source",
          },
        });
      }
    }
  }

  if (rejectedFiles.length > 0) {
    redirect(`/manage?error=file_rejected&detail=${encodeURIComponent(rejectedFiles.join(" "))}`);
  }

  redirect(nextStep === "resources" ? `/admin/resources?unitKey=${unitKey}` : `/learn/${unitKey}`);
}

// Real user request 2026-09-08: "give options to add units and textbook
// upload options. this must be textbook only no individual units. and from
// TOC all units should populate correctly." - createUnit above still exists
// for a genuine one-off unit, but this is now the primary way to add a real
// textbook's worth of units: upload the book once, every unit it actually
// contains gets created from its own table of contents, instead of an admin
// re-typing each unit title one at a time.
//
// Deliberately scoped: this only creates the Unit rows and hands the whole
// uploaded book to every one of them as a pending UnitResource - it does
// NOT attempt to split the PDF's pages across units or extract real lesson
// content itself. "Follow framework pattern to create learning content"
// means exactly that: content authoring stays the existing, unchanged
// Curriculum Materials approve-then-extract flow (see app/admin/resources),
// now with real units already there waiting for it, for every unit created.
export async function createUnitsFromTextbook(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const subjectId = String(formData.get("subjectId") ?? "");
  const publisher = String(formData.get("publisher") ?? "").trim();
  const bookTitle = String(formData.get("bookTitle") ?? "").trim();
  const contentModeRaw = String(formData.get("contentMode") ?? "curriculum");
  const contentMode = contentModeRaw === "olympiad" ? "olympiad" : "curriculum";
  const file = formData.get("textbook");

  if (!subjectId || !(file instanceof File) || file.size === 0) {
    redirect("/manage?error=missing_textbook_fields");
  }
  // Requires a real PDF specifically (not a single page photo) - detecting
  // a whole book's unit structure needs its table of contents, which only a
  // real multi-page document can meaningfully carry.
  if (file.type !== "application/pdf") {
    redirect(
      `/manage?error=file_rejected&detail=${encodeURIComponent(`"${file.name}" isn't a PDF - upload the textbook as one PDF (including its table of contents) so every unit can be detected.`)}`
    );
  }
  if (file.size > MAX_UPLOAD_FILE_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    const maxMb = Math.round(MAX_UPLOAD_FILE_BYTES / (1024 * 1024));
    redirect(`/manage?error=file_rejected&detail=${encodeURIComponent(`"${file.name}" is ${mb}MB - over the ${maxMb}MB limit.`)}`);
  }

  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    include: { stage: { include: { curriculum: true } }, units: { select: { number: true } } },
  });
  if (!subject) {
    redirect("/manage?error=unknown_subject");
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  let detected: { title: string }[];
  try {
    detected = await extractTextbookUnits({ path: file.name, mediaType: "application/pdf", base64: bytes.toString("base64") });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Couldn't read this file.";
    redirect(`/manage?error=toc_extraction_failed&detail=${encodeURIComponent(message)}`);
  }

  // Saved once, then the SAME storageKey is attached to every unit created
  // below - one real file, not N duplicated copies.
  const targetDir = path.join(UPLOADS_DIR, "resources", "_textbooks");
  await mkdir(targetDir, { recursive: true });
  const filename = sanitizeFilename(file.name);
  const storageKey = `resources/_textbooks/${subject.id}-${filename}`;
  await writeFile(path.join(UPLOADS_DIR, storageKey), bytes);

  let nextNumber = subject.units.length > 0 ? Math.max(...subject.units.map((u) => u.number)) + 1 : 1;
  const isAdmin = user.role === "admin";
  const now = new Date();
  const createdUnitKeys: string[] = [];

  for (const detectedUnit of detected) {
    const number = nextNumber++;
    const unitKey = `${subject.stage.curriculum.slug}-${subject.stage.number}-${subject.slug}-${number}`;
    const unit = await db.unit.create({
      data: {
        subjectId,
        unitKey,
        number,
        title: detectedUnit.title,
        available: true,
        contentMode,
        createdByUserId: user.id,
        sourcePublisher: publisher || null,
        sourceTitle: bookTitle || null,
        masteryChecklist: { source_note: "", items: [] },
      },
    });
    await db.unitResource.create({
      data: {
        unitId: unit.id,
        resourceType: "textbook",
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
    createdUnitKeys.push(unitKey);
  }

  redirect(`/manage?success=textbook_units_created&count=${createdUnitKeys.length}`);
}
