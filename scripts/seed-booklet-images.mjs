// One-time (idempotent) content seed: copies Unit 1 English's real textbook
// page photos - re-extracted from ~/Downloads/hodder english learner5.pdf
// after the 2026-09-05 data-loss wipe took the original 22-page gallery's
// UploadedPage rows (and, since those files lived on the Railway Volume, not
// git, the underlying photos too) - into UPLOADS_DIR and creates the
// matching UploadedPage rows, exactly like a real /api/pages/upload request
// would. Meant to be run once against the deployed service (`railway ssh --
// node scripts/seed-booklet-images.mjs`), not locally: UPLOADS_DIR there
// points at the mounted Volume, so this is the one environment where both
// the real DATABASE_URL and the real upload storage are simultaneously
// correct. Safe to re-run - skips entirely if the unit already has any
// textbook_source pages.
import { PrismaClient } from "@prisma/client";
import { mkdir, copyFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UNIT_KEY = "cambridge-5-english-1";
const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads");
const SOURCE_DIR = path.join(__dirname, "..", "content", "textbook-pages", UNIT_KEY);

// index = printed page number - 1 (matches UnitView.tsx's
// `pageImages[activePage - 1]` lookup). Pages 1-2 aren't in this scan at
// all (it starts at the Contents page, page 3); pages 20-21 exist in the
// book's own numbering but aren't present as distinct scanned images either
// (verified directly - page 19's next scanned page is printed "22", not
// "20") - both gaps get the same honest placeholder rather than silently
// showing the wrong page.
const PLACEHOLDER = "page-unavailable.jpg";
const PAGE_FILES = [
  PLACEHOLDER, // 1
  PLACEHOLDER, // 2
  "page-03.jpg",
  "page-04.jpg",
  "page-05.jpg",
  "page-06.jpg",
  "page-07.jpg",
  "page-08.jpg",
  "page-09.jpg",
  "page-10.jpg",
  "page-11.jpg",
  "page-12.jpg",
  "page-13.jpg",
  "page-14.jpg",
  "page-15.jpg",
  "page-16.jpg",
  "page-17.jpg",
  "page-18.jpg",
  "page-19.jpg",
  PLACEHOLDER, // 20
  PLACEHOLDER, // 21
  "page-22.jpg",
  "page-23.jpg",
  "page-24.jpg",
  "page-25.jpg",
];

const db = new PrismaClient();

async function main() {
  const unit = await db.unit.findUnique({ where: { unitKey: UNIT_KEY } });
  if (!unit) throw new Error(`Unit ${UNIT_KEY} not found.`);

  const existing = await db.uploadedPage.count({
    where: { unitId: unit.id, purpose: "textbook_source" },
  });
  if (existing > 0) {
    console.log(`Unit ${UNIT_KEY} already has ${existing} textbook_source page(s) - skipping.`);
    return;
  }

  const admin = await db.user.findFirst({ where: { role: "admin" }, orderBy: { createdAt: "asc" } });
  if (!admin) throw new Error("No admin user found to attribute the upload to.");

  const targetDir = path.join(UPLOADS_DIR, UNIT_KEY);
  await mkdir(targetDir, { recursive: true });

  const baseTime = Date.now();
  let created = 0;
  for (let i = 0; i < PAGE_FILES.length; i++) {
    const srcName = PAGE_FILES[i];
    const srcPath = path.join(SOURCE_DIR, srcName);
    const filename = `${baseTime + i}-page-${String(i + 1).padStart(2, "0")}.jpg`;
    const storageKey = `${UNIT_KEY}/${filename}`;
    await copyFile(srcPath, path.join(UPLOADS_DIR, storageKey));
    const { size } = await stat(srcPath);

    await db.uploadedPage.create({
      data: {
        unitId: unit.id,
        uploadedByUserId: admin.id,
        storageKey,
        originalFilename: srcName,
        mimeType: "image/jpeg",
        byteSize: size,
        purpose: "textbook_source",
        createdAt: new Date(baseTime + i * 1000),
      },
    });
    created++;
  }

  console.log(`Seeded ${created} booklet pages for ${UNIT_KEY}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
