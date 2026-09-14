/**
 * One-off tidy of the Cambridge curriculum menu (2026-09-14).
 *
 *   1. Stage 4's label becomes "Stage 4" instead of bare "4".
 *   2. Stage 4's Math subject is renamed "Cambridge Mathematics" to match.
 *   3. Cambridge English moves from Stage 5 to Stage 4, carrying its units.
 *   4. The stray one-unit "Cambridge Mathematics" left on Stage 5 is removed,
 *      since the same unit already exists under Stage 4's 18-unit Math.
 *
 * Unit keys are deliberately NOT rewritten. English units stay
 * cambridge-5-english-N even under Stage 4 - renaming them would break the
 * board registry, the committed board data files and existing progress rows,
 * for a cosmetic gain. Which grade a child is actually on is carried by
 * StudentProfile.assignedStageId, not by the key.
 *
 * Run it against production with:
 *   DATABASE_URL="$(railway variables --service Postgres --kv | sed -n 's/^DATABASE_PUBLIC_URL=//p')" \
 *     npx tsx scripts/tidy-cambridge-stages.ts
 *
 * Step 4 deletes rows, so it asks to be confirmed explicitly:
 *   ... npx tsx scripts/tidy-cambridge-stages.ts --delete-stray
 * Without that flag it reports what it would remove and leaves it alone.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const DELETE_STRAY = process.argv.includes("--delete-stray");

async function main() {
  const stage4 = await db.stage.findFirst({ where: { curriculum: { slug: "cambridge" }, number: 4 } });
  const stage5 = await db.stage.findFirst({ where: { curriculum: { slug: "cambridge" }, number: 5 } });
  if (!stage4 || !stage5) throw new Error("Expected Cambridge stages 4 and 5 to exist.");

  await db.stage.update({ where: { id: stage4.id }, data: { label: "Stage 4" } });
  const renamed = await db.subject.updateMany({
    where: { stageId: stage4.id, slug: "math" },
    data: { name: "Cambridge Mathematics" },
  });
  console.log(`Stage 4 label set, ${renamed.count} maths subject renamed.`);

  const english = await db.subject.findFirst({ where: { stageId: stage5.id, slug: "english" } });
  if (english) {
    await db.subject.update({ where: { id: english.id }, data: { stageId: stage4.id } });
    console.log("Cambridge English moved to Stage 4, with its units.");
  } else {
    console.log("No English subject on Stage 5 - already moved.");
  }

  const stray = await db.subject.findFirst({
    where: { stageId: stage5.id, slug: "math" },
    include: { units: { select: { unitKey: true, title: true } } },
  });
  if (!stray) {
    console.log("No stray maths subject on Stage 5.");
  } else if (!DELETE_STRAY) {
    console.log(
      `Would remove stray Stage 5 maths subject (${stray.units.length} unit(s): ` +
        `${stray.units.map((u) => u.unitKey).join(", ")}). Re-run with --delete-stray to do it.`,
    );
  } else {
    await db.subject.delete({ where: { id: stray.id } });
    console.log(`Removed stray Stage 5 maths subject and its ${stray.units.length} unit(s).`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
