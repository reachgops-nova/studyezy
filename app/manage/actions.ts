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

export async function createSubject(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stageId = String(formData.get("stageId") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!stageId || !name) {
    redirect("/manage?error=missing_subject_fields");
  }

  const slug = slugify(name);
  const stage = await db.stage.findUnique({ where: { id: stageId } });
  if (!stage) {
    redirect("/manage?error=unknown_stage");
  }

  await db.subject.upsert({
    where: { stageId_slug: { stageId, slug } },
    create: { stageId, slug, name, available: true, createdByUserId: user.id },
    update: { available: true },
  });

  redirect("/manage?success=subject_added");
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
      progressionTestDraft: { test_id: `PROG_TEST_${unitKey.toUpperCase()}`, covers_concepts: [], questions: [] },
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

  redirect(`/learn/${unitKey}`);
}
