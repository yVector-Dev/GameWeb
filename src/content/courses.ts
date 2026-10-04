import type { Condition, StatKey } from '../engine/types';

// Courses taken after (or instead of) secondary school. Names live in the
// translation files under `course.<id>.name` and `course.<id>.desc`.

export type CourseKind = 'university' | 'technical' | 'adult' | 'graduate';

export interface CourseDef {
  id: string;
  kind: CourseKind;
  years: number;
  /** Tuition per year. */
  tuition: number;
  minAge: number;
  requires: Condition[];
  /** Minimum yearly performance needed to complete a year. */
  passMark: number;
  /** Rewards granted on graduation. */
  reward: Partial<Record<StatKey, number>>;
}

export const COURSES: CourseDef[] = [
  {
    id: 'adult_diploma',
    kind: 'adult',
    years: 1,
    tuition: 1200,
    minAge: 18,
    requires: [{ type: 'diploma', not: true }, { type: 'inSchool', not: true }],
    passMark: 30,
    reward: { knowledge: 4, reputation: 3, happiness: 4 },
  },
  {
    id: 'tech_culinary',
    kind: 'technical',
    years: 1,
    tuition: 3000,
    minAge: 17,
    requires: [{ type: 'diploma' }],
    passMark: 35,
    reward: { knowledge: 3, discipline: 3 },
  },
  {
    id: 'tech_trades',
    kind: 'technical',
    years: 2,
    tuition: 3500,
    minAge: 17,
    requires: [{ type: 'diploma' }],
    passMark: 35,
    reward: { knowledge: 4, discipline: 4 },
  },
  {
    id: 'tech_it',
    kind: 'technical',
    years: 2,
    tuition: 4500,
    minAge: 17,
    requires: [{ type: 'diploma' }, { type: 'stat', stat: 'knowledge', min: 40 }],
    passMark: 38,
    reward: { knowledge: 6 },
  },
  {
    id: 'tech_health',
    kind: 'technical',
    years: 2,
    tuition: 4500,
    minAge: 17,
    requires: [{ type: 'diploma' }, { type: 'stat', stat: 'knowledge', min: 40 }],
    passMark: 38,
    reward: { knowledge: 5, social: 2 },
  },
  {
    id: 'uni_education',
    kind: 'university',
    years: 4,
    tuition: 6000,
    minAge: 17,
    requires: [{ type: 'diploma' }, { type: 'stat', stat: 'knowledge', min: 40 }],
    passMark: 40,
    reward: { knowledge: 8, social: 3, reputation: 4 },
  },
  {
    id: 'uni_arts',
    kind: 'university',
    years: 4,
    tuition: 7000,
    minAge: 17,
    requires: [{ type: 'diploma' }, { type: 'stat', stat: 'knowledge', min: 35 }],
    passMark: 40,
    reward: { knowledge: 6, happiness: 4, reputation: 3 },
  },
  {
    id: 'uni_business',
    kind: 'university',
    years: 4,
    tuition: 9000,
    minAge: 17,
    requires: [{ type: 'diploma' }, { type: 'stat', stat: 'knowledge', min: 45 }],
    passMark: 40,
    reward: { knowledge: 8, reputation: 5 },
  },
  {
    id: 'uni_cs',
    kind: 'university',
    years: 4,
    tuition: 9000,
    minAge: 17,
    requires: [{ type: 'diploma' }, { type: 'stat', stat: 'knowledge', min: 55 }],
    passMark: 42,
    reward: { knowledge: 10, reputation: 4 },
  },
  {
    id: 'uni_engineering',
    kind: 'university',
    years: 5,
    tuition: 10000,
    minAge: 17,
    requires: [{ type: 'diploma' }, { type: 'stat', stat: 'knowledge', min: 60 }],
    passMark: 45,
    reward: { knowledge: 12, reputation: 5 },
  },
  {
    id: 'uni_law',
    kind: 'university',
    years: 5,
    tuition: 11000,
    minAge: 17,
    requires: [{ type: 'diploma' }, { type: 'stat', stat: 'knowledge', min: 62 }],
    passMark: 45,
    reward: { knowledge: 10, reputation: 8 },
  },
  {
    id: 'uni_medicine',
    kind: 'university',
    years: 6,
    tuition: 14000,
    minAge: 17,
    requires: [{ type: 'diploma' }, { type: 'stat', stat: 'knowledge', min: 70 }],
    passMark: 50,
    reward: { knowledge: 14, reputation: 8 },
  },
  {
    id: 'grad_masters',
    kind: 'graduate',
    years: 2,
    tuition: 12000,
    minAge: 21,
    requires: [{ type: 'completed', kind: 'university' }, { type: 'stat', stat: 'knowledge', min: 60 }],
    passMark: 50,
    reward: { knowledge: 8, reputation: 6 },
  },
];

export const COURSE_MAP: Record<string, CourseDef> = Object.fromEntries(COURSES.map((c) => [c.id, c]));

export function getCourse(id: string): CourseDef {
  const course = COURSE_MAP[id];
  if (!course) throw new Error(`Unknown course: ${id}`);
  return course;
}
