"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
  const number = Number(formData.get("number"));
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

  if (!subjectId || !title || !Number.isInteger(number) || number <= 0) {
    redirect("/manage?error=missing_unit_fields");
  }

  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    include: { stage: { include: { curriculum: true } } },
  });
  if (!subject) {
    redirect("/manage?error=unknown_subject");
  }

  const unitKey = `${subject.stage.curriculum.slug}-${subject.stage.number}-${subject.slug}-${number}`;
  const existing = await db.unit.findUnique({ where: { unitKey } });
  if (existing) {
    redirect("/manage?error=unit_exists");
  }

  const unit = await db.unit.create({
    data: {
      subjectId,
      unitKey,
      number,
      title,
      available: true,
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

  redirect(nextStep === "resources" ? `/admin/resources?unitKey=${unitKey}` : `/learn/${unitKey}`);
}
