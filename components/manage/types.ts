// Real DB ids throughout (not lib/catalog.ts's slug/number scheme, which
// exists for student-facing URLs) - this admin page creates rows, so it
// needs ids it can pass straight to Prisma.
export interface ManageUnit {
  id: string;
  number: number;
  title: string;
}

export interface ManageSubject {
  id: string;
  name: string;
  units: ManageUnit[];
}

export interface ManageStage {
  id: string;
  number: number;
  label: string;
  subjects: ManageSubject[];
}

export interface ManageCurriculum {
  id: string;
  name: string;
  stages: ManageStage[];
}
