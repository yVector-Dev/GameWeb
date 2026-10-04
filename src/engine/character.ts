import { CITIES } from '../content/names';
import { addLog, clamp, setFeedback } from './core';
import { createNpc, randomFirstName, randomSurname } from './people';
import { Rng, seedFrom } from './rng';
import type { Background, Character, GameState, Gender, Pronouns, Stats, TraitId } from './types';
import { TRAIT_IDS } from './types';

export const SAVE_SCHEMA = 1;
export const MAX_NAME_LENGTH = 24;

export function actionsForAge(age: number): number {
  if (age <= 2) return 2;
  if (age <= 12) return 3;
  if (age <= 17) return 4;
  if (age <= 64) return 5;
  return 4;
}

/** Strips control characters and trims a player-provided name. */
export function sanitizeName(raw: string, fallback: string): string {
  // eslint-disable-next-line no-control-regex
  const cleaned = raw.replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LENGTH);
  return cleaned.length > 0 ? cleaned : fallback;
}

export interface NewGameOptions {
  firstName: string;
  lastName: string;
  pronouns: Pronouns;
  seed?: string | number;
}

const PARENT_JOBS: Record<Background, string[]> = {
  struggling: ['retail', 'warehouse', 'kitchen', 'courier'],
  modest: ['trades', 'nursing', 'teaching', 'courier', 'retail'],
  comfortable: ['it', 'engineering', 'business', 'nursing', 'teaching', 'design'],
  wealthy: ['medicine', 'law', 'business', 'engineering'],
};

const INCOMPATIBLE_TRAITS: [TraitId, TraitId][] = [
  ['anxious', 'resilient'],
  ['anxious', 'easygoing'],
  ['diligent', 'easygoing'],
  ['reckless', 'anxious'],
];

function pickTraits(rng: Rng): TraitId[] {
  const pool = TRAIT_IDS.filter((t) => t !== 'resilient');
  const first = rng.pick(pool);
  const rest = pool.filter(
    (t) => t !== first && !INCOMPATIBLE_TRAITS.some(([a, b]) => (a === first && b === t) || (b === first && a === t)),
  );
  return [first, rng.pick(rest)];
}

export function randomIdentity(rng: Rng): { firstName: string; lastName: string; pronouns: Pronouns } {
  const roll = rng.next();
  const pronouns: Pronouns = roll < 0.47 ? 'she' : roll < 0.94 ? 'he' : 'they';
  const gender: Gender = pronouns === 'she' ? 'f' : pronouns === 'he' ? 'm' : 'x';
  return { firstName: randomFirstName(rng, gender), lastName: randomSurname(rng), pronouns };
}

export function createNewGame(options: NewGameOptions): GameState {
  const seed = seedFrom(options.seed);
  const rng = new Rng(seed);
  const now = new Date().toISOString();

  const background = rng.weighted<Background>(['struggling', 'modest', 'comfortable', 'wealthy'], (b) =>
    b === 'struggling' ? 22 : b === 'modest' ? 40 : b === 'comfortable' ? 28 : 10,
  )!;
  const traits = pickTraits(rng);

  const bgBonus = { struggling: -4, modest: 0, comfortable: 3, wealthy: 6 }[background];
  const stats: Stats = {
    health: clamp(rng.int(68, 90)),
    happiness: clamp(rng.int(60, 78) + Math.round(bgBonus / 2)),
    knowledge: clamp(rng.int(2, 8)),
    social: clamp(rng.int(6, 14)),
    discipline: clamp(rng.int(5, 12)),
    reputation: clamp(rng.int(10, 18) + bgBonus),
  };
  if (traits.includes('athletic')) stats.health = clamp(stats.health + 5);

  const firstName = sanitizeName(options.firstName, 'Alex');
  const lastName = sanitizeName(options.lastName, 'Rivera');
  const birthYear = 1990 + rng.int(0, 30);

  const character: Character = {
    firstName,
    lastName,
    pronouns: options.pronouns,
    age: 0,
    birthYear,
    city: rng.pick(CITIES),
    background,
    stats,
    money: 0,
    traits,
    hobbies: {},
    datingPreference: 'any',
  };

  const state: GameState = {
    schema: SAVE_SCHEMA,
    id: `life-${seed.toString(36)}-${Date.now().toString(36)}`,
    seed,
    rng: 0,
    createdAt: now,
    updatedAt: now,
    year: birthYear,
    character,
    npcs: [],
    education: {
      stage: 'none',
      schoolYear: 0,
      performance: 50,
      repeats: 0,
      diploma: false,
      enrolled: null,
      completed: [],
      scholarship: 0,
      license: false,
    },
    career: {
      job: null,
      experience: {},
      bestLevel: {},
      history: [],
      retired: false,
      appliedThisYear: [],
      yearsWorked: 0,
      lastSalary: 0,
    },
    finance: {
      housing: 'family',
      homeValue: 0,
      mortgage: 0,
      mortgagePayment: 0,
      studentDebt: 0,
      debt: 0,
      assets: [],
      lastProcessedAge: 0,
      lastLedger: null,
      debtYears: 0,
      boughtThisYear: [],
    },
    actions: { used: 0, max: actionsForAge(0), counts: {}, npcCounts: {} },
    flags: {},
    counters: {},
    achievements: {},
    eventHistory: {},
    scheduled: [],
    pending: null,
    log: [],
    nextId: 0,
    feedback: null,
    alive: true,
    death: null,
    peaks: { money: 0, netWorth: 0 },
  };

  // Family -----------------------------------------------------------------
  const familyName = lastName;
  const parentCount = rng.chance(0.8) ? 2 : 1;
  const genders: Gender[] = [];
  if (parentCount === 2) {
    const combo = rng.next();
    if (combo < 0.9) genders.push('f', 'm');
    else if (combo < 0.95) genders.push('f', 'f');
    else genders.push('m', 'm');
  } else {
    genders.push(rng.chance(0.75) ? 'f' : 'm');
  }
  const parents = genders.map((gender) =>
    createNpc(state, rng, {
      relation: 'parent',
      gender,
      age: rng.int(21, 42),
      bond: rng.int(70, 90),
      lastName: familyName,
      occupationKey: `career.${rng.pick(PARENT_JOBS[background])}.l1`,
    }),
  );

  const siblingRoll = rng.next();
  const siblingCount = siblingRoll < 0.45 ? 0 : siblingRoll < 0.8 ? 1 : siblingRoll < 0.95 ? 2 : 3;
  const youngestParentAge = Math.min(...parents.map((p) => state.year - p.birthYear));
  for (let i = 0; i < siblingCount; i++) {
    const maxGap = Math.max(1, Math.min(12, youngestParentAge - 19));
    createNpc(state, rng, {
      relation: 'sibling',
      age: rng.int(1, maxGap),
      bond: rng.int(50, 80),
      lastName: familyName,
    });
  }

  if (rng.chance(0.6)) {
    createNpc(state, rng, {
      relation: 'grandparent',
      gender: rng.chance(0.55) ? 'f' : 'm',
      age: Math.max(55, youngestParentAge + rng.int(22, 34)),
      bond: rng.int(55, 85),
      lastName: rng.chance(0.5) ? familyName : undefined,
    });
  }

  // Opening entries ----------------------------------------------------------
  const [p1, p2] = parents;
  if (p2) {
    addLog(state, 'log.birth.two', {
      tone: 'milestone',
      params: { name: `${firstName} ${lastName}`, city: character.city, p1: p1.firstName, p2: p2.firstName },
    });
  } else {
    addLog(state, 'log.birth.one', {
      tone: 'milestone',
      params: { name: `${firstName} ${lastName}`, city: character.city, p1: p1.firstName },
    });
  }
  addLog(state, `log.background.${background}`);
  const siblings = state.npcs.filter((n) => n.relation === 'sibling');
  if (siblings.length > 0) {
    addLog(state, 'log.siblings', { params: { count: siblings.length, names: siblings.map((s) => s.firstName).join(', ') } });
  }
  addLog(state, 'log.traits', {
    params: { a: { t: `trait.${traits[0]}.name` }, b: { t: `trait.${traits[1]}.name` } },
  });

  setFeedback(state, {
    titleKey: 'feedback.born',
    titleParams: { name: firstName },
    deltas: [],
    tone: 'milestone',
  });

  state.rng = rng.state;
  return state;
}
