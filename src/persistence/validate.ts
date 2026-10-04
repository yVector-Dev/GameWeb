import { COUNTRY_MAP, DEFAULT_COUNTRY } from '../content/countries';
import { CAREER_MAP } from '../content/careers';
import { COURSE_MAP } from '../content/courses';
import { EVENT_MAP } from '../content/events';
import { ITEM_MAP } from '../content/items';
import { ACHIEVEMENTS } from '../content/achievements';
import { MAX_NAME_LENGTH, SAVE_SCHEMA } from '../engine/character';
import type { GameState, Params } from '../engine/types';
import { HOBBY_IDS, STAT_KEYS, TRAIT_IDS } from '../engine/types';

// Structural validation of saved games. Anything that does not match the
// expected shape is rejected, and free text is sanitized, so a hand-edited or
// corrupted file can never crash the game or inject markup.

export class InvalidSave extends Error {
  readonly path: string;
  constructor(path: string, reason: string) {
    super(`${path}: ${reason}`);
    this.path = path;
    this.name = 'InvalidSave';
  }
}

type Obj = Record<string, unknown>;
const KEY_PATTERN = /^[A-Za-z0-9_.]{1,120}$/;
const ACHIEVEMENT_IDS = new Set(ACHIEVEMENTS.map((a) => a.id));

function fail(path: string, reason: string): never {
  throw new InvalidSave(path, reason);
}

function obj(v: unknown, path: string): Obj {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) fail(path, 'expected object');
  return v as Obj;
}

function arr(v: unknown, path: string, max: number): unknown[] {
  if (!Array.isArray(v)) fail(path, 'expected array');
  if (v.length > max) fail(path, 'too many items');
  return v;
}

function num(v: unknown, path: string, min = -Number.MAX_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) fail(path, 'expected number');
  if (v < min || v > max) fail(path, `out of range [${min}, ${max}]`);
  return v;
}

function int(v: unknown, path: string, min?: number, max?: number): number {
  const n = num(v, path, min, max);
  if (!Number.isInteger(n)) fail(path, 'expected integer');
  return n;
}

function bool(v: unknown, path: string): boolean {
  if (typeof v !== 'boolean') fail(path, 'expected boolean');
  return v;
}

/** Plain text: control characters and angle brackets removed, length capped. */
export function cleanText(v: unknown, path: string, max: number, allowEmpty = false): string {
  if (typeof v !== 'string') fail(path, 'expected string');
  // eslint-disable-next-line no-control-regex
  const cleaned = v.replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, max);
  if (!allowEmpty && cleaned.length === 0) fail(path, 'empty text');
  return cleaned;
}

function key(v: unknown, path: string): string {
  if (typeof v !== 'string' || !KEY_PATTERN.test(v)) fail(path, 'invalid key');
  return v;
}

function oneOf<T extends string>(v: unknown, path: string, options: readonly T[]): T {
  if (typeof v !== 'string' || !options.includes(v as T)) fail(path, 'unexpected value');
  return v as T;
}

function optional<T>(v: unknown, check: (x: unknown) => T): T | undefined {
  return v === undefined ? undefined : check(v);
}

function params(v: unknown, path: string, depth = 0): Params {
  if (depth > 3) fail(path, 'params nested too deeply');
  const o = obj(v, path);
  const out: Params = {};
  const entries = Object.entries(o);
  if (entries.length > 20) fail(path, 'too many params');
  for (const [k, value] of entries) {
    if (!/^\w{1,30}$/.test(k)) fail(`${path}.${k}`, 'invalid param name');
    const p = `${path}.${k}`;
    if (typeof value === 'string') out[k] = cleanText(value, p, 120, true);
    else if (typeof value === 'number') out[k] = num(value, p);
    else {
      const inner = obj(value, p);
      if ('money' in inner) out[k] = { money: num(inner.money, `${p}.money`) };
      else {
        const t: { t: string; p?: Params; ctx?: string } = { t: key(inner.t, `${p}.t`) };
        if (inner.p !== undefined) t.p = params(inner.p, `${p}.p`, depth + 1);
        if (inner.ctx !== undefined) t.ctx = oneOf(inner.ctx, `${p}.ctx`, ['m', 'f', 'x'] as const);
        out[k] = t;
      }
    }
  }
  return out;
}

function deltas(v: unknown, path: string) {
  return arr(v, path, 60).map((d, i) => {
    const o = obj(d, `${path}[${i}]`);
    const out: { key: string; amount: number; params?: Params; money?: boolean } = {
      key: key(o.key, `${path}[${i}].key`),
      amount: num(o.amount, `${path}[${i}].amount`),
    };
    if (o.params !== undefined) out.params = params(o.params, `${path}[${i}].params`);
    if (o.money !== undefined) out.money = bool(o.money, `${path}[${i}].money`);
    return out;
  });
}

function intRecord(v: unknown, path: string, max = 500): Record<string, number> {
  const o = obj(v, path);
  const entries = Object.entries(o);
  if (entries.length > max) fail(path, 'too many entries');
  const out: Record<string, number> = {};
  for (const [k, value] of entries) {
    if (!/^[\w.]{1,80}$/.test(k)) fail(`${path}.${k}`, 'invalid name');
    out[k] = num(value, `${path}.${k}`);
  }
  return out;
}

const TONES = ['neutral', 'good', 'bad', 'milestone', 'event'] as const;
const RELATIONS = ['parent', 'sibling', 'grandparent', 'friend', 'partner', 'spouse', 'ex', 'child', 'mentor', 'pet'] as const;

/** Validates and sanitizes a game state. Throws InvalidSave on any problem. */
export function validateGameState(raw: unknown): GameState {
  const s = obj(raw, 'game');
  const schema = int(s.schema, 'schema', 1, SAVE_SCHEMA);

  const c = obj(s.character, 'character');
  const statsRaw = obj(c.stats, 'character.stats');
  const stats = Object.fromEntries(STAT_KEYS.map((k) => [k, num(statsRaw[k] ?? (k === 'looks' ? 50 : undefined), `character.stats.${k}`, 0, 100)])) as GameState['character']['stats'];
  const hobbiesRaw = obj(c.hobbies, 'character.hobbies');
  const hobbies: GameState['character']['hobbies'] = {};
  for (const [k, value] of Object.entries(hobbiesRaw)) {
    hobbies[oneOf(k, `character.hobbies.${k}`, HOBBY_IDS)] = num(value, `character.hobbies.${k}`, 0, 100);
  }
  const traits = arr(c.traits, 'character.traits', TRAIT_IDS.length).map((t, i) => oneOf(t, `character.traits[${i}]`, TRAIT_IDS));
  const age = int(c.age, 'character.age', 0, 130);

  const character: GameState['character'] = {
    firstName: cleanText(c.firstName, 'character.firstName', MAX_NAME_LENGTH),
    lastName: cleanText(c.lastName, 'character.lastName', MAX_NAME_LENGTH),
    pronouns: oneOf(c.pronouns, 'character.pronouns', ['he', 'she', 'they'] as const),
    age,
    birthYear: int(c.birthYear, 'character.birthYear', 1000, 3000),
    city: cleanText(c.city, 'character.city', 40),
    country: typeof c.country === 'string' && COUNTRY_MAP[c.country] ? c.country : DEFAULT_COUNTRY,
    background: oneOf(c.background, 'character.background', ['struggling', 'modest', 'comfortable', 'wealthy'] as const),
    stats,
    money: num(c.money, 'character.money', -1e12, 1e12),
    traits: Array.from(new Set(traits)),
    hobbies,
    datingPreference: oneOf(c.datingPreference, 'character.datingPreference', ['any', 'm', 'f'] as const),
  };
  const conditions = optional(c.conditions, (v) =>
    arr(v, 'character.conditions', 20).map((x, i) => {
      const o = obj(x, `character.conditions[${i}]`);
      return { id: key(o.id, `character.conditions[${i}].id`), sinceAge: int(o.sinceAge, `character.conditions[${i}].sinceAge`, 0, 130), treated: bool(o.treated, `character.conditions[${i}].treated`) };
    }),
  );
  if (conditions) character.conditions = conditions;
  const prisonUntil = optional(c.prisonUntil, (v) => int(v, 'character.prisonUntil', 0, 200));
  if (prisonUntil !== undefined) character.prisonUntil = prisonUntil;

  const ids = new Set<string>();
  const npcs = arr(s.npcs, 'npcs', 300).map((n, i) => {
    const p = `npcs[${i}]`;
    const o = obj(n, p);
    const id = cleanText(o.id, `${p}.id`, 20);
    if (!/^n\d+$/.test(id) || ids.has(id)) fail(`${p}.id`, 'invalid or duplicate id');
    ids.add(id);
    const npc: GameState['npcs'][number] = {
      id,
      firstName: cleanText(o.firstName, `${p}.firstName`, 40),
      lastName: cleanText(o.lastName, `${p}.lastName`, 40, true),
      gender: oneOf(o.gender, `${p}.gender`, ['m', 'f', 'x'] as const),
      birthYear: int(o.birthYear, `${p}.birthYear`, 800, 3200),
      relation: oneOf(o.relation, `${p}.relation`, RELATIONS),
      bond: num(o.bond, `${p}.bond`, 0, 100),
      alive: bool(o.alive, `${p}.alive`),
      metAge: int(o.metAge, `${p}.metAge`, 0, 130),
      tags: arr(o.tags, `${p}.tags`, 20).map((t, j) => key(t, `${p}.tags[${j}]`)),
      conflict: bool(o.conflict, `${p}.conflict`),
      lastInteractionAge: int(o.lastInteractionAge, `${p}.lastInteractionAge`, 0, 130),
    };
    const deathYear = optional(o.deathYear, (v) => int(v, `${p}.deathYear`, 800, 3300));
    if (deathYear !== undefined) npc.deathYear = deathYear;
    const species = optional(o.species, (v) => oneOf(v, `${p}.species`, ['dog', 'cat'] as const));
    if (species) npc.species = species;
    const occupationKey = optional(o.occupationKey, (v) => key(v, `${p}.occupationKey`));
    if (occupationKey) npc.occupationKey = occupationKey;
    const sinceYear = optional(o.sinceYear, (v) => int(v, `${p}.sinceYear`, 800, 3300));
    if (sinceYear !== undefined) npc.sinceYear = sinceYear;
    const independent = optional(o.independent, (v) => bool(v, `${p}.independent`));
    if (independent !== undefined) npc.independent = independent;
    return npc;
  });

  const e = obj(s.education, 'education');
  let enrolled: GameState['education']['enrolled'] = null;
  if (e.enrolled !== null) {
    const en = obj(e.enrolled, 'education.enrolled');
    const courseId = key(en.courseId, 'education.enrolled.courseId');
    if (!COURSE_MAP[courseId]) fail('education.enrolled.courseId', 'unknown course');
    enrolled = {
      courseId,
      yearsDone: int(en.yearsDone, 'education.enrolled.yearsDone', 0, COURSE_MAP[courseId].years),
      performance: num(en.performance, 'education.enrolled.performance', 0, 100),
      failures: int(en.failures, 'education.enrolled.failures', 0, 2),
      startedAge: int(en.startedAge, 'education.enrolled.startedAge', 0, 130),
      funding: oneOf(en.funding, 'education.enrolled.funding', ['savings', 'family', 'loan'] as const),
      scholarship: num(en.scholarship, 'education.enrolled.scholarship', 0, 1),
    };
  }
  const education: GameState['education'] = {
    stage: oneOf(e.stage, 'education.stage', ['none', 'primary', 'secondary', 'graduated', 'dropped'] as const),
    schoolYear: int(e.schoolYear, 'education.schoolYear', 0, 13),
    performance: num(e.performance, 'education.performance', 0, 100),
    repeats: int(e.repeats, 'education.repeats', 0, 10),
    diploma: bool(e.diploma, 'education.diploma'),
    enrolled,
    completed: arr(e.completed, 'education.completed', 50).map((id, i) => {
      const k = key(id, `education.completed[${i}]`);
      if (!COURSE_MAP[k]) fail(`education.completed[${i}]`, 'unknown course');
      return k;
    }),
    scholarship: num(e.scholarship, 'education.scholarship', 0, 1),
    license: bool(e.license, 'education.license'),
  };

  const cr = obj(s.career, 'career');
  let job: GameState['career']['job'] = null;
  if (cr.job !== null) {
    const j = obj(cr.job, 'career.job');
    const careerId = key(j.careerId, 'career.job.careerId');
    const def = CAREER_MAP[careerId];
    if (!def) fail('career.job.careerId', 'unknown career');
    job = {
      careerId,
      level: int(j.level, 'career.job.level', 0, def.levels.length - 1),
      yearsInLevel: int(j.yearsInLevel, 'career.job.yearsInLevel', 0, 130),
      performance: num(j.performance, 'career.job.performance', 0, 100),
      startedAge: int(j.startedAge, 'career.job.startedAge', 0, 130),
      lowPerfYears: int(j.lowPerfYears, 'career.job.lowPerfYears', 0, 130),
    };
  }
  const careerIdList = (v: unknown, path: string) =>
    arr(v, path, 50).map((id, i) => {
      const k = key(id, `${path}[${i}]`);
      if (!CAREER_MAP[k]) fail(`${path}[${i}]`, 'unknown career');
      return k;
    });
  const career: GameState['career'] = {
    job,
    experience: intRecord(cr.experience, 'career.experience', 50),
    bestLevel: intRecord(cr.bestLevel, 'career.bestLevel', 50),
    history: arr(cr.history, 'career.history', 200).map((h, i) => {
      const o = obj(h, `career.history[${i}]`);
      const careerId = key(o.careerId, `career.history[${i}].careerId`);
      if (!CAREER_MAP[careerId]) fail(`career.history[${i}].careerId`, 'unknown career');
      return {
        careerId,
        level: int(o.level, `career.history[${i}].level`, 0, CAREER_MAP[careerId].levels.length - 1),
        fromAge: int(o.fromAge, `career.history[${i}].fromAge`, 0, 130),
        toAge: int(o.toAge, `career.history[${i}].toAge`, 0, 130),
        reason: oneOf(o.reason, `career.history[${i}].reason`, ['quit', 'fired', 'retired', 'laidoff', 'changed', 'died', 'agedOut', 'prison'] as const),
      };
    }),
    retired: bool(cr.retired, 'career.retired'),
    appliedThisYear: careerIdList(cr.appliedThisYear, 'career.appliedThisYear'),
    yearsWorked: int(cr.yearsWorked, 'career.yearsWorked', 0, 130),
    lastSalary: num(cr.lastSalary, 'career.lastSalary', 0, 1e9),
  };
  for (const [k, v] of Object.entries(career.bestLevel)) {
    const def = CAREER_MAP[k];
    if (!def || !Number.isInteger(v) || v < 0 || v >= def.levels.length) fail(`career.bestLevel.${k}`, 'invalid level');
  }

  const f = obj(s.finance, 'finance');
  const itemList = (v: unknown, path: string) =>
    arr(v, path, 20).map((id, i) => {
      const k = key(id, `${path}[${i}]`);
      if (!ITEM_MAP[k]) fail(`${path}[${i}]`, 'unknown item');
      return k;
    });
  let lastLedger: GameState['finance']['lastLedger'] = null;
  if (f.lastLedger !== null) {
    const l = obj(f.lastLedger, 'finance.lastLedger');
    lastLedger = {
      age: int(l.age, 'finance.lastLedger.age', 0, 130),
      income: num(l.income, 'finance.lastLedger.income'),
      expenses: num(l.expenses, 'finance.lastLedger.expenses'),
      net: num(l.net, 'finance.lastLedger.net'),
      lines: arr(l.lines, 'finance.lastLedger.lines', 60).map((line, i) => {
        const o = obj(line, `finance.lastLedger.lines[${i}]`);
        const out: { key: string; amount: number; params?: Params } = {
          key: key(o.key, `finance.lastLedger.lines[${i}].key`),
          amount: num(o.amount, `finance.lastLedger.lines[${i}].amount`),
        };
        if (o.params !== undefined) out.params = params(o.params, `finance.lastLedger.lines[${i}].params`);
        return out;
      }),
    };
  }
  const finance: GameState['finance'] = {
    housing: oneOf(f.housing, 'finance.housing', ['family', 'rent_small', 'rent_nice', 'own'] as const),
    homeValue: num(f.homeValue, 'finance.homeValue', 0, 1e12),
    mortgage: num(f.mortgage, 'finance.mortgage', 0, 1e12),
    mortgagePayment: num(f.mortgagePayment, 'finance.mortgagePayment', 0, 1e12),
    studentDebt: num(f.studentDebt, 'finance.studentDebt', 0, 1e12),
    debt: num(f.debt, 'finance.debt', 0, 1e12),
    assets: itemList(f.assets, 'finance.assets'),
    lastProcessedAge: int(f.lastProcessedAge, 'finance.lastProcessedAge', 0, 130),
    lastLedger,
    debtYears: int(f.debtYears, 'finance.debtYears', 0, 130),
    boughtThisYear: itemList(f.boughtThisYear, 'finance.boughtThisYear'),
  };
  if (f.investments !== undefined) {
    const inv = obj(f.investments, 'finance.investments');
    finance.investments = {};
    for (const kind of ['bonds', 'stocks', 'crypto'] as const) {
      if (inv[kind] !== undefined) finance.investments[kind] = num(inv[kind], `finance.investments.${kind}`, 0, 1e13);
    }
  }
  if (finance.lastProcessedAge > age) fail('finance.lastProcessedAge', 'ahead of character age');

  const a = obj(s.actions, 'actions');
  const max = int(a.max, 'actions.max', 0, 30);
  const actions: GameState['actions'] = {
    used: int(a.used, 'actions.used', 0, max),
    max,
    counts: intRecord(a.counts, 'actions.counts', 30),
    npcCounts: intRecord(a.npcCounts, 'actions.npcCounts', 300),
  };
  if (a.pools !== undefined) {
    const pools = obj(a.pools, 'actions.pools');
    const read = (k: 'personal' | 'work' | 'social') => {
      const p = obj(pools[k], `actions.pools.${k}`);
      const pm = int(p.max, `actions.pools.${k}.max`, 0, 10);
      return { used: int(p.used, `actions.pools.${k}.used`, 0, pm), max: pm };
    };
    actions.pools = { personal: read('personal'), work: read('work'), social: read('social') };
  }

  const eventHistory: GameState['eventHistory'] = {};
  for (const [k, v] of Object.entries(obj(s.eventHistory, 'eventHistory'))) {
    if (!EVENT_MAP[k]) continue; // Content removed in a later version: ignore.
    const o = obj(v, `eventHistory.${k}`);
    eventHistory[k] = { count: int(o.count, `eventHistory.${k}.count`, 0, 1000), lastAge: int(o.lastAge, `eventHistory.${k}.lastAge`, 0, 130) };
  }

  const scheduled = arr(s.scheduled, 'scheduled', 300)
    .map((item, i) => {
      const o = obj(item, `scheduled[${i}]`);
      const out: GameState['scheduled'][number] = {
        id: int(o.id, `scheduled[${i}].id`, 0),
        eventId: key(o.eventId, `scheduled[${i}].eventId`),
        dueAge: int(o.dueAge, `scheduled[${i}].dueAge`, 0, 200),
        createdAge: int(o.createdAge, `scheduled[${i}].createdAge`, 0, 130),
      };
      const npcId = optional(o.npcId, (v) => cleanText(v, `scheduled[${i}].npcId`, 20));
      if (npcId) out.npcId = npcId;
      return out;
    })
    .filter((item) => EVENT_MAP[item.eventId]);

  let pending: GameState['pending'] = null;
  if (s.pending !== null) {
    const p = obj(s.pending, 'pending');
    const eventId = key(p.eventId, 'pending.eventId');
    if (!EVENT_MAP[eventId]?.choices) fail('pending.eventId', 'unknown decision');
    pending = {
      eventId,
      params: params(p.params, 'pending.params'),
      source: oneOf(p.source, 'pending.source', ['random', 'scheduled'] as const),
      age: int(p.age, 'pending.age', 0, 130),
    };
    const npcId = optional(p.npcId, (v) => cleanText(v, 'pending.npcId', 20));
    if (npcId) {
      if (!ids.has(npcId)) fail('pending.npcId', 'unknown person');
      pending.npcId = npcId;
    }
  }

  const log = arr(s.log, 'log', 20000).map((entry, i) => {
    const p = `log[${i}]`;
    const o = obj(entry, p);
    const out: GameState['log'][number] = {
      id: int(o.id, `${p}.id`, 0),
      age: int(o.age, `${p}.age`, 0, 130),
      key: key(o.key, `${p}.key`),
      tone: oneOf(o.tone, `${p}.tone`, TONES),
    };
    if (o.params !== undefined) out.params = params(o.params, `${p}.params`);
    if (o.title !== undefined) out.title = key(o.title, `${p}.title`);
    if (o.deltas !== undefined) out.deltas = deltas(o.deltas, `${p}.deltas`);
    return out;
  });

  let feedback: GameState['feedback'] = null;
  if (s.feedback !== null && s.feedback !== undefined) {
    const fb = obj(s.feedback, 'feedback');
    feedback = {
      titleKey: key(fb.titleKey, 'feedback.titleKey'),
      deltas: deltas(fb.deltas, 'feedback.deltas'),
      tone: oneOf(fb.tone, 'feedback.tone', TONES),
      seq: int(fb.seq, 'feedback.seq', 0),
    };
    if (fb.titleParams !== undefined) feedback.titleParams = params(fb.titleParams, 'feedback.titleParams');
    if (fb.textKey !== undefined) feedback.textKey = key(fb.textKey, 'feedback.textKey');
    if (fb.textParams !== undefined) feedback.textParams = params(fb.textParams, 'feedback.textParams');
  }

  let death: GameState['death'] = null;
  if (s.death !== null) {
    const d = obj(s.death, 'death');
    death = { age: int(d.age, 'death.age', 0, 130), causeKey: key(d.causeKey, 'death.causeKey'), year: int(d.year, 'death.year', 1000, 3300) };
  }
  const alive = bool(s.alive, 'alive');
  if (alive === (death !== null)) fail('alive', 'inconsistent with death');

  const achievements: Record<string, number> = {};
  for (const [k, v] of Object.entries(obj(s.achievements, 'achievements'))) {
    if (!ACHIEVEMENT_IDS.has(k)) continue;
    achievements[k] = int(v, `achievements.${k}`, 0, 130);
  }

  const peaks = obj(s.peaks, 'peaks');

  return {
    schema,
    id: cleanText(s.id, 'id', 100),
    seed: int(s.seed, 'seed', 0, 0xffffffff),
    rng: int(s.rng, 'rng', 0, 0xffffffff),
    createdAt: cleanText(s.createdAt, 'createdAt', 40),
    updatedAt: cleanText(s.updatedAt, 'updatedAt', 40),
    year: int(s.year, 'year', 1000, 3300),
    character,
    npcs,
    education,
    career,
    finance,
    actions,
    flags: intRecord(s.flags, 'flags'),
    counters: intRecord(s.counters, 'counters'),
    achievements,
    eventHistory,
    scheduled,
    pending,
    log,
    nextId: int(s.nextId, 'nextId', 0),
    feedback,
    alive,
    death,
    peaks: { money: num(peaks.money, 'peaks.money'), netWorth: num(peaks.netWorth, 'peaks.netWorth') },
  };
}
