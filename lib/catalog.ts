// Curriculum -> Stage -> Subject -> Unit tree, now Postgres-backed via Prisma
// instead of a hardcoded const. Shape is unchanged from the old static
// CATALOG so components/CurriculumSelector.tsx needs no changes.
import "server-only";
import { db } from "./db";

export interface CatalogUnit {
  id: number;
  title: string;
  available: boolean;
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

export async function getCatalog(): Promise<CatalogCurriculum[]> {
  const curricula = await db.curriculum.findMany({
    include: {
      stages: {
        orderBy: { number: "asc" },
        include: {
          subjects: {
            orderBy: { name: "asc" },
            include: { units: { orderBy: { number: "asc" } } },
          },
        },
      },
    },
  });

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
        })),
      })),
    })),
  }));
}
