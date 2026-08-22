-- CreateTable
CREATE TABLE "AnswerCache" (
    "id" TEXT NOT NULL,
    "unitKey" TEXT NOT NULL,
    "conceptKey" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "normalizedQuestion" TEXT NOT NULL,
    "originalQuestion" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "hitCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnswerCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnswerCache_unitKey_conceptKey_language_normalizedQuestion_key" ON "AnswerCache"("unitKey", "conceptKey", "language", "normalizedQuestion");

-- CreateIndex
CREATE INDEX "AnswerCache_unitKey_conceptKey_idx" ON "AnswerCache"("unitKey", "conceptKey");
