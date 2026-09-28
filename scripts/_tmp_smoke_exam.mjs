import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const subject = await db.subject.findFirst({ where: { slug: "science" }, include: { stage: true } });
const admin = await db.user.findFirst({ where: { role: "admin" } });

const paper = await db.termExamPaper.create({
  data: {
    subjectId: subject.id,
    title: "Grade 4 Science - Terminal Exam - Paper 1 (SMOKE TEST)",
    paperNumber: 1,
    unitIds: [],
    totalMarks: 10,
    durationMinutes: 30,
    status: "draft",
    createdByUserId: admin.id,
    sections: [
      {
        label: "Section A - Short answer",
        marks: 10,
        questions: [
          { number: "1", prompt: "Why does the Earth have day and night?", marks: 5 },
          { number: "2", prompt: "Name one natural and one artificial satellite.", marks: 5 },
        ],
      },
    ],
    answerKey: {
      create: {
        sections: [
          {
            label: "Section A - Short answer",
            answers: [
              { number: "1", modelAnswer: "The Earth's rotation on its axis causes day and night.", marks: 5 },
              { number: "2", modelAnswer: "Natural: the Moon. Artificial: the ISS.", marks: 5 },
            ],
          },
        ],
      },
    },
  },
});
console.log("Created smoke-test paper:", paper.id);
await db.$disconnect();
