import type { ActionPool, Condition, StatKey, TraitId } from '../engine/types';

// Yearly activities. Each one spends one action from the yearly budget.
// Repeating the same activity in one year has diminishing returns (see
// engine/activities.ts). Labels: `activity.<id>.name` / `activity.<id>.desc`.

export interface ActivityDef {
  id: string;
  /** Which yearly action category this uses. */
  pool: ActionPool;
  minAge: number;
  maxAge: number;
  gains: Partial<Record<StatKey, number>>;
  /** Money cost, charged only from `costFromAge`. */
  cost?: number;
  costFromAge?: number;
  /** Bond change with living parents. */
  bondFamily?: number;
  /** Requires picking a hobby; raises that hobby's level. */
  hobby?: boolean;
  /** Traits that boost the gains by 25%. */
  traitBoost?: TraitId[];
  /** Owned items that multiply gains. */
  assetBoost?: { asset: string; factor: number }[];
  /** Added to school or course performance this year. */
  schoolPerf?: number;
  /** Added to job performance this year (only when employed). */
  jobPerf?: number;
  /** Maximum uses per year (default: limited only by the action budget). */
  perYearLimit?: number;
  special?: 'socialize' | 'sideGig' | 'skill';
  requires?: Condition[];
}

export const ACTIVITIES: ActivityDef[] = [
  { id: 'cuddle', pool: 'personal', minAge: 0, maxAge: 2, gains: { happiness: 3 }, bondFamily: 3 },
  { id: 'explore', pool: 'personal', minAge: 0, maxAge: 3, gains: { knowledge: 2, health: 1 }, traitBoost: ['curious'] },
  { id: 'play', pool: 'personal', minAge: 3, maxAge: 12, gains: { health: 3, happiness: 3, social: 2 }, traitBoost: ['athletic', 'outgoing'] },
  { id: 'read', pool: 'work', minAge: 3, maxAge: 12, gains: { knowledge: 3, discipline: 1 }, schoolPerf: 4, traitBoost: ['curious'] },
  { id: 'chores', pool: 'personal', minAge: 5, maxAge: 17, gains: { discipline: 3, reputation: 1 }, bondFamily: 3, traitBoost: ['diligent'] },
  {
    id: 'hobby', pool: 'personal',
    minAge: 6,
    maxAge: 120,
    gains: { happiness: 3 },
    hobby: true,
    traitBoost: ['creative'],
  },
  {
    id: 'study', pool: 'work',
    minAge: 10,
    maxAge: 120,
    gains: { knowledge: 4, discipline: 2, happiness: -1 },
    schoolPerf: 7,
    traitBoost: ['curious', 'diligent'],
    assetBoost: [{ asset: 'computer', factor: 1.2 }],
  },
  {
    id: 'exercise', pool: 'personal',
    minAge: 10,
    maxAge: 120,
    gains: { health: 4, discipline: 1, happiness: 1 },
    traitBoost: ['athletic'],
    assetBoost: [
      { asset: 'gym', factor: 1.3 },
      { asset: 'bike', factor: 1.1 },
    ],
  },
  {
    id: 'socialize', pool: 'social',
    minAge: 12,
    maxAge: 120,
    gains: { social: 4, happiness: 3 },
    cost: 60,
    costFromAge: 18,
    traitBoost: ['outgoing'],
    special: 'socialize',
  },
  { id: 'selfCare', pool: 'personal', minAge: 13, maxAge: 120, gains: { looks: 2, happiness: 1 }, cost: 40, costFromAge: 18, perYearLimit: 2 },
  { id: 'rest', pool: 'personal', minAge: 12, maxAge: 120, gains: { happiness: 3, health: 2 }, traitBoost: ['easygoing'] },
  {
    id: 'volunteer', pool: 'social',
    minAge: 14,
    maxAge: 120,
    gains: { reputation: 3, happiness: 2, social: 1 },
    traitBoost: ['kind'],
    perYearLimit: 2,
  },
  {
    id: 'skill', pool: 'work',
    minAge: 16,
    maxAge: 75,
    gains: { knowledge: 2, discipline: 2 },
    jobPerf: 9,
    traitBoost: ['ambitious', 'diligent'],
    special: 'skill',
    assetBoost: [{ asset: 'computer', factor: 1.1 }],
  },
  {
    id: 'sideGig', pool: 'work',
    minAge: 18,
    maxAge: 75,
    gains: { happiness: -1, health: -1 },
    perYearLimit: 1,
    special: 'sideGig',
  },
];

export const ACTIVITY_MAP: Record<string, ActivityDef> = Object.fromEntries(ACTIVITIES.map((a) => [a.id, a]));
