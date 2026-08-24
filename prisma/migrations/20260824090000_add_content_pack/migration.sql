-- Markable "content pack" research surface (content/schema/pack.schema.json)
-- - admin-only for now, not wired into the live teaching flow.
CREATE TABLE "ContentPack" (
    "id" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "sheetsCount" INTEGER NOT NULL DEFAULT 0,
    "questionsCount" INTEGER NOT NULL DEFAULT 0,
    "needsHumanCount" INTEGER NOT NULL DEFAULT 0,
    "errorsCount" INTEGER NOT NULL DEFAULT 0,
    "warningsCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "sourceImageKeys" TEXT[],
    "model" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentPack_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ContentPack_packId_key" ON "ContentPack"("packId");
CREATE INDEX "ContentPack_unitId_idx" ON "ContentPack"("unitId");

ALTER TABLE "ContentPack" ADD CONSTRAINT "ContentPack_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
