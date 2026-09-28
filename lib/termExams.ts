import "server-only";
import { db } from "./db";
import type { Prisma } from "@prisma/client";

/** One question inside a TermExamPaper section - a flexible shape since
 * teachers confirmed there is no fixed board blueprint to conform to. */
export interface TermExamQuestion {
  number: string; // e.g. "1", "2(a)" - sections can nest sub-parts under one number
  prompt: string;
  marks: number;
  conceptTags?: string[]; // which concept(s)/unit this draws on, for admin traceability only
  // Real diagram (e.g. a unit's board-art poster or a cropped panel of one),
  // shown inline with the question when a subject like Science needs a real
  // labelled figure, not just text - src is a /board-art/... or /api/uploads/...
  // path, never a data URI, so the same asset already vetted for the unit's
  // lesson content is reused rather than a fresh image per paper.
  diagram?: { src: string; alt: string; caption?: string };
}

export interface TermExamSection {
  label: string; // "Section A - Multiple choice"
  instructions?: string;
  marks: number; // sum of this section's question marks
  questions: TermExamQuestion[];
}

export interface TermExamAnswerItem {
  number: string; // matches TermExamQuestion.number
  modelAnswer: string;
  marks: number;
  markingNotes?: string; // how partial credit is awarded across sub-parts
  // A labelled/annotated version of the question's diagram (or a different
  // crop of the same source image) showing the correct answer - e.g. the
  // same flower poster zoomed to the labelled part being asked about.
  diagram?: { src: string; alt: string; caption?: string };
}

export interface TermExamAnswerSection {
  label: string; // matches TermExamSection.label
  answers: TermExamAnswerItem[];
}

export interface TermExamPaperInput {
  subjectId: string;
  title: string;
  paperNumber: number;
  unitIds: string[];
  totalMarks: number;
  durationMinutes?: number;
  sections: TermExamSection[];
  answerSections: TermExamAnswerSection[];
  createdByUserId?: string;
  status?: "draft" | "published";
}

/** Creates a paper and its answer key together - a paper is never useful
 * without its key, so there is no path that creates one without the other. */
export async function createTermExamPaper(input: TermExamPaperInput) {
  return db.termExamPaper.create({
    data: {
      subjectId: input.subjectId,
      title: input.title,
      paperNumber: input.paperNumber,
      unitIds: input.unitIds,
      totalMarks: input.totalMarks,
      durationMinutes: input.durationMinutes,
      sections: input.sections as unknown as Prisma.InputJsonValue,
      status: input.status ?? "draft",
      createdByUserId: input.createdByUserId,
      answerKey: {
        create: {
          sections: input.answerSections as unknown as Prisma.InputJsonValue,
        },
      },
    },
    include: { answerKey: true },
  });
}

export async function getTermExamPapersForSubject(subjectId: string, opts?: { publishedOnly?: boolean }) {
  return db.termExamPaper.findMany({
    where: { subjectId, ...(opts?.publishedOnly ? { status: "published" } : {}) },
    orderBy: [{ paperNumber: "asc" }, { createdAt: "asc" }],
  });
}

export async function getPublishedTermExamPapersGrouped() {
  return db.termExamPaper.findMany({
    where: { status: "published" },
    include: { subject: { include: { stage: { include: { curriculum: true } } } } },
    orderBy: [{ subjectId: "asc" }, { paperNumber: "asc" }],
  });
}

export async function getAllTermExamPapersGroupedBySubject() {
  const papers = await db.termExamPaper.findMany({
    include: {
      subject: { include: { stage: { include: { curriculum: true } } } },
      accessRequests: { where: { status: "pending" }, select: { id: true } },
    },
    orderBy: [{ subjectId: "asc" }, { paperNumber: "asc" }],
  });
  return papers;
}

export async function getTermExamPaper(id: string) {
  return db.termExamPaper.findUnique({
    where: { id },
    include: { answerKey: true, subject: true },
  });
}

/** A parent's request to view one paper's answer key. Re-requesting after a
 * denial is allowed (a new row, not an update) so the admin sees the history
 * of both the original denial and the fresh ask. */
export async function requestAnswerKeyAccess(params: {
  paperId: string;
  requestedByUserId: string;
  studentProfileId?: string;
  note?: string;
}) {
  return db.termExamAccessRequest.create({
    data: {
      paperId: params.paperId,
      requestedByUserId: params.requestedByUserId,
      studentProfileId: params.studentProfileId,
      note: params.note,
    },
  });
}

export async function respondToAccessRequest(params: {
  requestId: string;
  adminId: string;
  approve: boolean;
}) {
  return db.termExamAccessRequest.update({
    where: { id: params.requestId },
    data: {
      status: params.approve ? "approved" : "denied",
      respondedByUserId: params.adminId,
      respondedAt: new Date(),
    },
  });
}

/** Whether this user has any approved request for this paper - admins always
 * have full access regardless (checked by the caller, not here). */
export async function hasApprovedAnswerKeyAccess(paperId: string, userId: string): Promise<boolean> {
  const approved = await db.termExamAccessRequest.findFirst({
    where: { paperId, requestedByUserId: userId, status: "approved" },
    select: { id: true },
  });
  return approved !== null;
}

export async function getAccessRequestsForUser(paperId: string, userId: string) {
  return db.termExamAccessRequest.findMany({
    where: { paperId, requestedByUserId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPendingAccessRequests() {
  return db.termExamAccessRequest.findMany({
    where: { status: "pending" },
    include: {
      paper: { include: { subject: true } },
      requestedBy: { select: { email: true } },
      studentProfile: { select: { displayName: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}
