-- AlterTable: 30-day free trial window, set relative to each row's own insert time
ALTER TABLE "User" ADD COLUMN "trialEndsAt" TIMESTAMP(3) NOT NULL DEFAULT (now() + interval '30 days');

-- CreateTable
CREATE TABLE "PricingPlan" (
    "id" TEXT NOT NULL,
    "curriculumLabel" TEXT NOT NULL,
    "gradeBandLabel" TEXT NOT NULL,
    "minGrade" INTEGER NOT NULL,
    "maxGrade" INTEGER NOT NULL,
    "pricePerSubjectInr" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PricingPlan_curriculumLabel_gradeBandLabel_key" ON "PricingPlan"("curriculumLabel", "gradeBandLabel");

-- Seed the initial price list (PLATFORM_PLAN.md, 2026-08-20 pricing entries).
-- IGCSE has no Grade 11-12 row (that pathway becomes AS/A-Level, not built
-- yet) and IB has no Grade 9-10 row (MYP covers 6-8, DP covers 11-12) -
-- deliberately left out rather than priced for content that doesn't exist.
INSERT INTO "PricingPlan" ("id", "curriculumLabel", "gradeBandLabel", "minGrade", "maxGrade", "pricePerSubjectInr", "updatedAt") VALUES
    (gen_random_uuid()::text, 'Matric / State Board', 'Grade 3-5', 3, 5, 149, now()),
    (gen_random_uuid()::text, 'Matric / State Board', 'Grade 6-8', 6, 8, 199, now()),
    (gen_random_uuid()::text, 'Matric / State Board', 'Grade 9-10', 9, 10, 249, now()),
    (gen_random_uuid()::text, 'Matric / State Board', 'Grade 11-12', 11, 12, 279, now()),
    (gen_random_uuid()::text, 'CBSE', 'Grade 3-5', 3, 5, 169, now()),
    (gen_random_uuid()::text, 'CBSE', 'Grade 6-8', 6, 8, 229, now()),
    (gen_random_uuid()::text, 'CBSE', 'Grade 9-10', 9, 10, 289, now()),
    (gen_random_uuid()::text, 'CBSE', 'Grade 11-12', 11, 12, 339, now()),
    (gen_random_uuid()::text, 'ICSE', 'Grade 3-5', 3, 5, 179, now()),
    (gen_random_uuid()::text, 'ICSE', 'Grade 6-8', 6, 8, 239, now()),
    (gen_random_uuid()::text, 'ICSE', 'Grade 9-10', 9, 10, 299, now()),
    (gen_random_uuid()::text, 'ICSE', 'Grade 11-12', 11, 12, 349, now()),
    (gen_random_uuid()::text, 'Cambridge IGCSE', 'Grade 3-5', 3, 5, 199, now()),
    (gen_random_uuid()::text, 'Cambridge IGCSE', 'Grade 6-8', 6, 8, 269, now()),
    (gen_random_uuid()::text, 'Cambridge IGCSE', 'Grade 9-10', 9, 10, 339, now()),
    (gen_random_uuid()::text, 'IB', 'Grade 3-5', 3, 5, 229, now()),
    (gen_random_uuid()::text, 'IB', 'Grade 6-8', 6, 8, 309, now()),
    (gen_random_uuid()::text, 'IB', 'Grade 11-12', 11, 12, 449, now());
