// Static catalog describing what's selectable in the app right now vs. "coming soon".
// This drives the curriculum -> stage -> subject -> unit picker without needing a database yet.

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

export const CATALOG: CatalogCurriculum[] = [
  {
    id: "cambridge",
    name: "Cambridge Primary / IGCSE pathway",
    stages: [
      { id: 4, label: "Stage 4 (Grade 4)", available: false, subjects: [] },
      {
        id: 5,
        label: "Stage 5 (Grade 5)",
        available: true,
        subjects: [
          {
            id: "english",
            name: "English",
            available: true,
            units: [
              { id: 1, title: "Fiction: Stories from different cultures", available: true },
              { id: 2, title: "Non-fiction: Biography", available: false },
              { id: 3, title: "Poetry: Narrative poems", available: false },
              { id: 4, title: "Non-fiction: Information and explanation texts", available: false },
              { id: 5, title: "Fiction: Stories that have been developed into a film", available: false },
              { id: 6, title: "Fiction: Classic literature", available: false },
              { id: 7, title: "Playscripts", available: false },
              { id: 8, title: "Poetry: Poems by famous poets", available: false },
              { id: 9, title: "Non-fiction: Persuasive texts", available: false },
            ],
          },
          { id: "math", name: "Math", available: false, units: [] },
          { id: "science", name: "Science", available: false, units: [] },
        ],
      },
      { id: 6, label: "Stage 6 (Grade 6)", available: false, subjects: [] },
    ],
  },
];
