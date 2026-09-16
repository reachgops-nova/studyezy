"use server";

import { redirect } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { getCurrentAdmin } from "@/lib/session";
import { extractTextbookUnits } from "@/lib/textbookToc";
import { UPLOADS_DIR } from "@/lib/uploads";
import { clearAnswerCache } from "@/lib/answerCache";
import { transcribeAndSaveConceptImage } from "@/lib/conceptImageTranscription";

export async function approveResource(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const id = String(formData.get("id") ?? "");
  const unitKey = String(formData.get("unitKey") ?? "");
  if (id) {
    await db.unitResource.update({
      where: { id },
      data: { status: "approved", approvedByUserId: admin.id, approvedAt: new Date() },
    });
  }
  redirect(`/admin/resources?unitKey=${unitKey}`);
}

// Also doubles as "remove" for an already-approved resource, not just
// rejecting a pending one - same effect either way, one less action to wire.
export async function rejectResource(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const id = String(formData.get("id") ?? "");
  const unitKey = String(formData.get("unitKey") ?? "");
  if (id) {
    await db.unitResource.delete({ where: { id } }).catch(() => {});
  }
  redirect(`/admin/resources?unitKey=${unitKey}`);
}

/** Validate a family-uploaded whole textbook, extract its TOC, then publish
 * the resulting units and canonical textbook resource in one admin action. */
export async function approveTextbookSubmission(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const id = String(formData.get("id") ?? "");
  const submission = id
    ? await db.textbookSubmission.findUnique({ where: { id }, include: { subject: { include: { stage: { include: { curriculum: true } }, units: { select: { number: true } } } } } })
    : null;
  if (!submission || submission.status === "approved") redirect("/admin/resources");

  await db.textbookSubmission.update({ where: { id: submission.id }, data: { status: "validating", validationNote: null } });
  try {
    const bytes = await readFile(path.join(UPLOADS_DIR, submission.storageKey));
    const detected = await extractTextbookUnits({
      path: submission.originalFilename,
      mediaType: "application/pdf",
      base64: bytes.toString("base64"),
    });
    const existingNumbers = submission.subject.units.map((u) => u.number);
    let nextNumber = existingNumbers.length ? Math.max(...existingNumbers) + 1 : 1;
    const now = new Date();

    for (const item of detected) {
      const number = nextNumber++;
      const unitKey = `${submission.subject.stage.curriculum.slug}-${submission.subject.stage.number}-${submission.subject.slug}-${number}`;
      const unit = await db.unit.create({
        data: {
          subjectId: submission.subjectId,
          unitKey,
          number,
          title: item.title,
          available: true,
          contentMode: "curriculum",
          createdByUserId: admin.id,
          sourceTitle: submission.originalFilename,
          masteryChecklist: { source_note: "Created from an approved textbook submission.", items: [] },
        },
      });
      await db.unitResource.create({
        data: {
          unitId: unit.id,
          resourceType: "textbook",
          storageKey: submission.storageKey,
          originalFilename: submission.originalFilename,
          mimeType: submission.mimeType,
          byteSize: submission.byteSize,
          uploadedByUserId: submission.uploadedByUserId,
          status: "approved",
          approvedByUserId: admin.id,
          approvedAt: now,
        },
      });
    }

    await db.textbookSubmission.update({
      where: { id: submission.id },
      data: { status: "approved", detectedUnits: detected as unknown as Prisma.InputJsonValue, validationNote: `Approved and created ${detected.length} unit(s).`, reviewedAt: now },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "This file could not be validated as a textbook.";
    await db.textbookSubmission.update({ where: { id: submission.id }, data: { status: "rejected", validationNote: message, reviewedAt: new Date() } });
  }
  redirect("/admin/resources");
}

export async function rejectTextbookSubmission(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");
  const id = String(formData.get("id") ?? "");
  if (id) {
    await db.textbookSubmission.update({
      where: { id },
      data: { status: "rejected", validationNote: "Rejected by an administrator.", reviewedAt: new Date() },
    }).catch(() => {});
  }
  redirect("/admin/resources");
}

// Sets (or clears, via an empty storageKey) which uploaded reference page
// shows as a concept's illustration - see getConceptImageAssignmentData.
// Empty selection reverts to the concept's original SVG icon, since
// AvatarChat only falls back to it when sourceImagePath is unset.
export async function assignConceptImage(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const conceptId = String(formData.get("conceptId") ?? "");
  const storageKey = String(formData.get("storageKey") ?? "").trim();
  const unitKey = String(formData.get("unitKey") ?? "");
  if (conceptId) {
    await db.concept.update({
      where: { id: conceptId },
      data: {
        sourceImagePath: storageKey ? `/api/uploads/${storageKey}` : null,
        // Clear the old transcript immediately on unassign/reassign so a
        // stale transcript from a previous image never lingers and gets fed
        // to the AI as if it described the new (or no) picture.
        sourceImageTranscript: null,
      },
    });

    // Best-effort: transcribe the newly-linked page so the AI tutor can
    // answer questions about its specific content (see
    // lib/conceptImageTranscription.ts). Awaited so the admin sees it take
    // effect immediately, but never blocks the actual image assignment - if
    // Claude is briefly unavailable, the image still saves and can be
    // backfilled later via the same helper.
    if (storageKey) {
      try {
        await transcribeAndSaveConceptImage(conceptId, storageKey);
      } catch (err) {
        console.error("transcribeAndSaveConceptImage failed", err);
      }
    }
  }
  redirect(`/admin/resources?unitKey=${unitKey}`);
}

// Operational safety valve for a wrong/stale cached answer (lib/answerCache.ts) -
// clears every cached AI answer for this unit, so the next matching
// question generates a fresh one instead of reusing a bad cache entry.
export async function clearUnitAnswerCache(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/select");

  const unitKey = String(formData.get("unitKey") ?? "");
  if (unitKey) {
    await clearAnswerCache(unitKey);
  }
  redirect(`/admin/resources?unitKey=${unitKey}`);
}
