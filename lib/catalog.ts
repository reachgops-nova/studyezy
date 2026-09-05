// Curriculum -> Stage -> Subject -> Unit tree, now Postgres-backed via Prisma
// instead of a hardcoded const. Shape is unchanged from the old static
// CATALOG so components/CurriculumSelector.tsx needs no changes.
import "server-only";
import { db } from "./db";

export interface CatalogUnit {
  id: number;
  title: string;
  available: boolean;
  /** Total concepts currently drafted for this unit - undefined when getCatalog() was called without a profileId. */
  totalConcepts?: number;
  /** How many of those this student has a ConceptMastery row for (attempted via a widget or test, not just viewed). */
  coveredConcepts?: number;
}

export interface CatalogSubject {
  id: string;
  name: string;
  available: boolean;
  units: CatalogUnit[];
}

export interface CatalogStage {
  id: number;
  label: string;
  available: boolean;
  subjects: CatalogSubject[];
}

export interface CatalogCurriculum {
  id: string;
  name: string;
  stages: CatalogStage[];
}

// profileId is optional (SwitcherGroup/AppShell's own catalog read below
// doesn't need per-student progress, just the tree) - when passed (from
// /select, real feedback 2026-09-05: "it again stays to start... it should
// have status how much covered" - a unit list that never reflected any
// progress), each unit also carries totalConcepts/coveredConcepts so the
// picker can show real progress instead of a flat "Start" every time.
export async function getCatalog(profileId?: string): Promise<CatalogCurriculum[]> {
  const curricula = await db.curriculum.findMany({
    include: {
      stages: {
        orderBy: { number: "asc" },
        include: {
          subjects: {
            orderBy: { name: "asc" },
            include: {
              units: {
                orderBy: { number: "asc" },
                include: { concepts: { select: { id: true } } },
              },
            },
          },
        },
      },
    },
  });

  const coveredConceptIds = profileId
    ? new Set(
        (
          await db.conceptMastery.findMany({
            where: { studentProfileId: profileId },
            select: { conceptId: true },
          })
        ).map((m) => m.conceptId)
      )
    : null;

  return curricula.map((c) => ({
    id: c.slug,
    name: c.name,
    stages: c.stages.map((s) => ({
      id: s.number,
      label: s.label,
      available: s.available,
      subjects: s.subjects.map((subj) => ({
        id: subj.slug,
        name: subj.name,
        available: subj.available,
        units: subj.units.map((u) => ({
          id: u.number,
          title: u.title,
          available: u.available,
          totalConcepts: coveredConceptIds ? u.concepts.length : undefined,
          coveredConcepts: coveredConceptIds
            ? u.concepts.filter((concept) => coveredConceptIds.has(concept.id)).length
            : undefined,
        })),
      })),
    })),
  }));
}

export interface SwitcherGroup {
  subjectName: string;
  units: { unitKey: string; label: string }[];
}

/**
 * Flat, available-only unit list grouped by "Curriculum · Stage · Subject",
 * for the persistent switcher in AppShell's header (2026-08-26 - a parent
 * reported the app feeling like a separate silo per unit, since jumping
 * into a test/exam page meant losing all navigation). Reuses getCatalog()
 * rather than a second Prisma query - this app's catalog is small enough
 * that filtering client-side in JS after one fetch is simpler than a
 * second bespoke query, and keeps the "available" logic in one place.
 */
export async function getSwitcherGroups(): Promise<SwitcherGroup[]> {
  const curricula = await getCatalog();
  const groups: SwitcherGroup[] = [];

  for (const curriculum of curricula) {
    for (const stage of curriculum.stages) {
      if (!stage.available) continue;
      for (const subject of stage.subjects) {
        if (!subject.available) continue;
        const units = subject.units
          .filter((u) => u.available)
          .map((u) => ({
            unitKey: `${curriculum.id}-${stage.id}-${subject.id}-${u.id}`,
            label: `Unit ${u.id}: ${u.title}`,
          }));
        if (units.length === 0) continue;
        groups.push({ subjectName: `${curriculum.name} · ${stage.label} · ${subject.name}`, units });
      }
    }
  }

  return groups;
}

export interface AssignableStage {
  id: string; // Stage row id (cuid) - what StudentProfile.assignedStageId stores
  label: string; // "Cambridge Primary / IGCSE pathway · Stage 5 (Grade 5)"
}

/**
 * Flat list of every available Stage, for the "which book is this kid
 * using" picker on /profiles - a parent can put a kid on a different
 * grade's Stage than their nominal age would suggest (e.g. a Grade 4 kid
 * working from the Grade 5 book). Only Stages with real content available
 * are offered; assigning an empty "coming soon" Stage would just be a
 * dead end.
 */
export async function getAssignableStages(): Promise<AssignableStage[]> {
  const stages = await db.stage.findMany({
    where: { available: true },
    include: { curriculum: true },
    orderBy: [{ curriculum: { name: "asc" } }, { number: "asc" }],
  });

  return stages.map((s) => ({
    id: s.id,
    label: `${s.curriculum.name} · ${s.label}`,
  }));
}

/**
 * Resolves a Stage's DB id back into the (curriculumSlug, stageNumber)
 * pair CurriculumSelector's props are keyed on - used to default /select
 * to a profile's assignedStageId without changing that component's shape.
 */
export async function getStageRef(
  stageId: string
): Promise<{ curriculumSlug: string; stageNumber: number } | null> {
  const stage = await db.stage.findUnique({ where: { id: stageId }, include: { curriculum: true } });
  if (!stage) return null;
  return { curriculumSlug: stage.curriculum.slug, stageNumber: stage.number };
}
