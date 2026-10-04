import type { Condition, StatKey } from '../engine/types';

// Career ladders. Each level's visible title lives in the translation files
// under `career.<id>.l<index>`; the career name is `career.<id>.name`.

export interface CareerLevel {
  salary: number;
  /** Years required in the previous level before this promotion. */
  minYears: number;
  /** Minimum job performance (0-100) for the promotion. */
  minPerf: number;
  /** Extra requirements for reaching this level. */
  requires?: Condition[];
}

export interface CareerDef {
  id: string;
  minAge: number;
  /** Requirements to be hired at the entry level. */
  requires: Condition[];
  /** Main attribute driving performance and hiring chances. */
  keyStat: StatKey;
  levels: CareerLevel[];
  /** Hidden careers can only be reached through events. */
  hidden?: boolean;
  /** Performance bonus for creative-trait characters. */
  creative?: boolean;
  /** Teenagers in school may hold this job part-time. */
  teenFriendly?: boolean;
  /** Childhood dream category this career satisfies. */
  dream?: 'health' | 'creative' | 'tech' | 'teach' | 'justice' | 'business' | 'food';
}

export const CAREERS: CareerDef[] = [
  {
    id: 'retail',
    minAge: 16,
    requires: [],
    keyStat: 'social',
    teenFriendly: true,
    levels: [
      { salary: 16000, minYears: 0, minPerf: 0 },
      { salary: 24000, minYears: 2, minPerf: 60 },
      { salary: 38000, minYears: 3, minPerf: 70, requires: [{ type: 'stat', stat: 'social', min: 45 }] },
    ],
  },
  {
    id: 'kitchen',
    minAge: 16,
    requires: [],
    keyStat: 'discipline',
    teenFriendly: true,
    dream: 'food',
    levels: [
      { salary: 15000, minYears: 0, minPerf: 0 },
      { salary: 22000, minYears: 1, minPerf: 55 },
      {
        salary: 32000,
        minYears: 3,
        minPerf: 65,
        requires: [{ type: 'any', of: [{ type: 'completed', course: 'tech_culinary' }, { type: 'hobby', hobby: 'cooking', min: 50 }] }],
      },
      { salary: 50000, minYears: 3, minPerf: 75, requires: [{ type: 'stat', stat: 'reputation', min: 50 }] },
    ],
  },
  {
    id: 'warehouse',
    minAge: 16,
    requires: [],
    keyStat: 'health',
    teenFriendly: true,
    levels: [
      { salary: 20000, minYears: 0, minPerf: 0 },
      { salary: 26000, minYears: 2, minPerf: 55 },
      { salary: 36000, minYears: 3, minPerf: 70, requires: [{ type: 'stat', stat: 'discipline', min: 50 }] },
    ],
  },
  {
    id: 'courier',
    minAge: 18,
    requires: [{ type: 'flag', flag: 'license' }],
    keyStat: 'discipline',
    levels: [
      { salary: 22000, minYears: 0, minPerf: 0 },
      { salary: 30000, minYears: 2, minPerf: 60 },
      { salary: 42000, minYears: 3, minPerf: 70, requires: [{ type: 'diploma' }] },
    ],
  },
  {
    id: 'trades',
    minAge: 18,
    requires: [{ type: 'completed', course: 'tech_trades' }],
    keyStat: 'discipline',
    levels: [
      { salary: 21000, minYears: 0, minPerf: 0 },
      { salary: 38000, minYears: 2, minPerf: 60 },
      { salary: 58000, minYears: 4, minPerf: 72, requires: [{ type: 'stat', stat: 'reputation', min: 45 }] },
    ],
  },
  {
    id: 'it',
    minAge: 18,
    requires: [{ type: 'any', of: [{ type: 'completed', course: 'tech_it' }, { type: 'completed', course: 'uni_cs' }] }],
    keyStat: 'knowledge',
    dream: 'tech',
    levels: [
      { salary: 28000, minYears: 0, minPerf: 0 },
      { salary: 52000, minYears: 2, minPerf: 62, requires: [{ type: 'stat', stat: 'knowledge', min: 55 }] },
      { salary: 78000, minYears: 3, minPerf: 70 },
      { salary: 105000, minYears: 4, minPerf: 78, requires: [{ type: 'stat', stat: 'social', min: 50 }] },
    ],
  },
  {
    id: 'nursing',
    minAge: 18,
    requires: [{ type: 'completed', course: 'tech_health' }],
    keyStat: 'discipline',
    dream: 'health',
    levels: [
      { salary: 26000, minYears: 0, minPerf: 0 },
      { salary: 44000, minYears: 2, minPerf: 60 },
      { salary: 60000, minYears: 4, minPerf: 72, requires: [{ type: 'stat', stat: 'social', min: 50 }] },
    ],
  },
  {
    id: 'medicine',
    minAge: 22,
    requires: [{ type: 'completed', course: 'uni_medicine' }],
    keyStat: 'knowledge',
    dream: 'health',
    levels: [
      { salary: 50000, minYears: 0, minPerf: 0 },
      { salary: 110000, minYears: 3, minPerf: 65 },
      { salary: 150000, minYears: 5, minPerf: 75 },
      { salary: 190000, minYears: 5, minPerf: 82, requires: [{ type: 'stat', stat: 'reputation', min: 65 }] },
    ],
  },
  {
    id: 'law',
    minAge: 22,
    requires: [{ type: 'completed', course: 'uni_law' }],
    keyStat: 'reputation',
    dream: 'justice',
    levels: [
      { salary: 55000, minYears: 0, minPerf: 0 },
      { salary: 85000, minYears: 3, minPerf: 65 },
      { salary: 115000, minYears: 3, minPerf: 72, requires: [{ type: 'stat', stat: 'social', min: 55 }] },
      { salary: 170000, minYears: 5, minPerf: 82, requires: [{ type: 'stat', stat: 'reputation', min: 70 }] },
    ],
  },
  {
    id: 'teaching',
    minAge: 18,
    requires: [{ type: 'diploma' }],
    keyStat: 'social',
    dream: 'teach',
    levels: [
      { salary: 22000, minYears: 0, minPerf: 0 },
      { salary: 38000, minYears: 1, minPerf: 55, requires: [{ type: 'completed', course: 'uni_education' }] },
      { salary: 48000, minYears: 4, minPerf: 68 },
      { salary: 66000, minYears: 5, minPerf: 78, requires: [{ type: 'stat', stat: 'reputation', min: 60 }] },
    ],
  },
  {
    id: 'engineering',
    minAge: 22,
    requires: [{ type: 'completed', course: 'uni_engineering' }],
    keyStat: 'knowledge',
    dream: 'tech',
    levels: [
      { salary: 50000, minYears: 0, minPerf: 0 },
      { salary: 70000, minYears: 2, minPerf: 62 },
      { salary: 92000, minYears: 4, minPerf: 72 },
      { salary: 125000, minYears: 5, minPerf: 80, requires: [{ type: 'completed', course: 'grad_masters' }] },
    ],
  },
  {
    id: 'business',
    minAge: 18,
    requires: [{ type: 'diploma' }],
    keyStat: 'reputation',
    dream: 'business',
    levels: [
      { salary: 24000, minYears: 0, minPerf: 0 },
      {
        salary: 45000,
        minYears: 2,
        minPerf: 60,
        requires: [{ type: 'any', of: [{ type: 'completed', course: 'uni_business' }, { type: 'stat', stat: 'knowledge', min: 65 }] }],
      },
      { salary: 70000, minYears: 3, minPerf: 68 },
      { salary: 110000, minYears: 4, minPerf: 76, requires: [{ type: 'stat', stat: 'social', min: 60 }] },
      {
        salary: 165000,
        minYears: 5,
        minPerf: 84,
        requires: [
          { type: 'stat', stat: 'reputation', min: 72 },
          { type: 'completed', course: 'grad_masters' },
        ],
      },
    ],
  },
  {
    id: 'design',
    minAge: 18,
    requires: [{ type: 'any', of: [{ type: 'completed', course: 'uni_arts' }, { type: 'hobby', hobby: 'art', min: 45 }] }],
    keyStat: 'knowledge',
    creative: true,
    dream: 'creative',
    levels: [
      { salary: 26000, minYears: 0, minPerf: 0 },
      { salary: 40000, minYears: 2, minPerf: 60 },
      { salary: 58000, minYears: 3, minPerf: 70 },
      { salary: 85000, minYears: 4, minPerf: 78, requires: [{ type: 'stat', stat: 'reputation', min: 60 }] },
    ],
  },
  {
    id: 'music',
    minAge: 16,
    requires: [{ type: 'hobby', hobby: 'music', min: 35 }],
    keyStat: 'social',
    creative: true,
    dream: 'creative',
    levels: [
      { salary: 9000, minYears: 0, minPerf: 0 },
      { salary: 24000, minYears: 2, minPerf: 60, requires: [{ type: 'hobby', hobby: 'music', min: 55 }] },
      { salary: 60000, minYears: 3, minPerf: 72, requires: [{ type: 'hobby', hobby: 'music', min: 70 }, { type: 'stat', stat: 'reputation', min: 50 }] },
      { salary: 200000, minYears: 3, minPerf: 85, requires: [{ type: 'flag', flag: 'record_deal' }, { type: 'stat', stat: 'reputation', min: 75 }] },
    ],
  },
  {
    id: 'startup',
    minAge: 18,
    requires: [],
    keyStat: 'knowledge',
    hidden: true,
    dream: 'business',
    levels: [
      { salary: 30000, minYears: 0, minPerf: 0 },
      { salary: 62000, minYears: 2, minPerf: 65 },
      { salary: 95000, minYears: 3, minPerf: 75 },
    ],
  },
];

export const CAREER_MAP: Record<string, CareerDef> = Object.fromEntries(CAREERS.map((c) => [c.id, c]));

export function getCareer(id: string): CareerDef {
  const career = CAREER_MAP[id];
  if (!career) throw new Error(`Unknown career: ${id}`);
  return career;
}
