-- ContentPack gains purpose/difficulty so it can represent progression and
-- terminal tests, not just worksheets - and unitId becomes optional since a
-- terminal test spans every unit a student has tested on, not one.
ALTER TABLE "ContentPack" DROP CONSTRAINT "ContentPack_unitId_fkey";
ALTER TABLE "ContentPack" ALTER COLUMN "unitId" DROP NOT NULL;
ALTER TABLE "ContentPack" ADD CONSTRAINT "ContentPack_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ContentPack" ADD COLUMN "subjectId" TEXT;
ALTER TABLE "ContentPack" ADD COLUMN "purpose" TEXT NOT NULL DEFAULT 'worksheet';
ALTER TABLE "ContentPack" ADD COLUMN "difficulty" TEXT;

CREATE UNIQUE INDEX "ContentPack_unitId_purpose_difficulty_key" ON "ContentPack"("unitId", "purpose", "difficulty");
