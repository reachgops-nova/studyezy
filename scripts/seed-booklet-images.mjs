// Seeds every English unit's textbook page gallery (content/textbook-pages/)
// into UPLOADS_DIR + UploadedPage rows, and backfills UploadedPage.pageNumber
// for Unit 1's original rows (seeded before that column existed).
//
// Meant to run once against the deployed service (`railway ssh -- node
// scripts/seed-booklet-images.mjs`), not locally: UPLOADS_DIR there points at
// the mounted Volume, the one place DATABASE_URL and real upload storage are
// both correct simultaneously. Idempotent per unit - skips a unit that
// already has textbook_source pages, so safe to re-run (e.g. after adding a
// new unit's folder later).
import { PrismaClient } from "@prisma/client";
import { mkdir, copyFile, stat, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads");
const CONTENT_DIR = path.join(__dirname, "..", "content", "textbook-pages");

const UNIT_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `cambridge-5-english-${n}`);
const PAGE_FILE_RE = /^page-(\d+)\.jpg$/;

const db = new PrismaClient();

async function backfillUnit1PageNumbers() {
  const unit = await db.unit.findUnique({ where: { unitKey: "cambridge-5-english-1" } });
  if (!unit) return;
  const rows = await db.uploadedPage.findMany({
    where: { unitId: unit.id, purpose: "textbook_source", pageNumber: null },
    orderBy: { createdAt: "asc" },
  });
  if (rows.length === 0) {
    console.log("Unit 1: no rows need a pageNumber backfill.");
    return;
  }
  // Seeded in exact page order (1..25) with strictly increasing createdAt -
  // array position + 1 is the real page number.
  for (let i = 0; i < rows.length; i++) {
    await db.uploadedPage.update({ where: { id: rows[i].id }, data: { pageNumber: i + 1 } });
  }
  console.log(`Unit 1: backfilled pageNumber for ${rows.length} rows.`);
}

async function seedUnit(unitKey) {
  const unit = await db.unit.findUnique({ where: { unitKey } });
  if (!unit) {
    console.log(`${unitKey}: unit not found - skipping.`);
    return;
  }

  const existing = await db.uploadedPage.count({
    where: { unitId: unit.id, purpose: "textbook_source" },
  });
  if (existing > 0) {
    console.log(`${unitKey}: already has ${existing} textbook_source page(s) - skipping.`);
    return;
  }

  const sourceDir = path.join(CONTENT_DIR, unitKey);
  let filenames;
  try {
    filenames = await readdir(sourceDir);
  } catch {
    console.log(`${unitKey}: no content/textbook-pages folder - skipping.`);
    return;
  }

  const pages = filenames
    .map((name) => {
      const match = name.match(PAGE_FILE_RE);
      return match ? { name, pageNumber: Number(match[1]) } : null;
    })
    .filter((p) => p !== null)
    .sort((a, b) => a.pageNumber - b.pageNumber);

  if (pages.length === 0) {
    console.log(`${unitKey}: no page-NN.jpg files found - skipping.`);
    return;
  }

  const admin = await db.user.findFirst({
    where: { role: { in: ["admin", "ADMIN"] } },
    orderBy: { createdAt: "asc" },
  });
  if (!admin) throw new Error("No admin user found to attribute the upload to.");

  const targetDir = path.join(UPLOADS_DIR, unitKey);
  await mkdir(targetDir, { recursive: true });

  const baseTime = Date.now();
  for (let i = 0; i < pages.length; i++) {
    const { name, pageNumber } = pages[i];
    const srcPath = path.join(sourceDir, name);
    const filename = `${baseTime + i}-${name}`;
    const storageKey = `${unitKey}/${filename}`;
    await copyFile(srcPath, path.join(UPLOADS_DIR, storageKey));
    const { size } = await stat(srcPath);

    await db.uploadedPage.create({
      data: {
        unitId: unit.id,
        uploadedByUserId: admin.id,
        storageKey,
        originalFilename: name,
        mimeType: "image/jpeg",
        byteSize: size,
        purpose: "textbook_source",
        pageNumber,
        createdAt: new Date(baseTime + i * 1000),
      },
    });
  }
  console.log(`${unitKey}: seeded ${pages.length} booklet pages.`);
}

async function main() {
  await backfillUnit1PageNumbers();
  for (const unitKey of UNIT_KEYS) {
    await seedUnit(unitKey);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
