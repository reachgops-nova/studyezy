export const RESOURCE_TYPES = [
  "textbook",
  "worksheet",
  "classwork",
  "homework",
  "exam_question_paper",
  "answer_sheet",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  textbook: "Textbook",
  worksheet: "Worksheet",
  classwork: "Classwork",
  homework: "Homework",
  exam_question_paper: "Exam question paper",
  answer_sheet: "Answer sheet",
};

// Once a unit has an approved resource of one of these types, further
// non-admin uploads of that same type for that unit are blocked - one
// canonical copy is enough for every student of that grade/curriculum, and
// an admin can always add or replace it. Exam question papers and answer
// sheets are deliberately excluded: a family uploading one of those isn't
// contributing shared reference material, they're submitting their own
// kid's personal exam attempt (see ExamSubmission / Written Exam Capture &
// Coaching) - that's never "one copy for everyone," so it never freezes.
export const FREEZABLE_TYPES: ResourceType[] = ["textbook", "worksheet", "classwork", "homework"];

export function isResourceType(value: unknown): value is ResourceType {
  return typeof value === "string" && (RESOURCE_TYPES as readonly string[]).includes(value);
}

export function isFreezable(type: ResourceType): boolean {
  return FREEZABLE_TYPES.includes(type);
}
