import { CAREER_MAP } from '../content/careers';
import { COURSE_MAP } from '../content/courses';
import { currentPartner, findNpc, hasFlag, npcAge } from './core';
import type { Condition, GameState, NPC, NpcBinding, Params } from './types';

export interface ConditionContext {
  npcId?: string;
}

export function npcMatches(state: GameState, npc: NPC, filter: Omit<NpcBinding, 'pick'>): boolean {
  if (!npc.alive) return false;
  const relations = Array.isArray(filter.relation) ? filter.relation : [filter.relation];
  if (!relations.includes(npc.relation)) return false;
  if (filter.tag && !npc.tags.includes(filter.tag)) return false;
  if (filter.notTag && npc.tags.includes(filter.notTag)) return false;
  if (filter.minBond !== undefined && npc.bond < filter.minBond) return false;
  if (filter.maxBond !== undefined && npc.bond > filter.maxBond) return false;
  const age = npcAge(state, npc);
  if (filter.minNpcAge !== undefined && age < filter.minNpcAge) return false;
  if (filter.maxNpcAge !== undefined && age > filter.maxNpcAge) return false;
  if (filter.conflict !== undefined && npc.conflict !== filter.conflict) return false;
  return true;
}

function courseKind(id: string): string | undefined {
  return COURSE_MAP[id]?.kind;
}

export function checkCondition(state: GameState, cond: Condition, ctx: ConditionContext = {}): boolean {
  const c = state.character;
  switch (cond.type) {
    case 'stat': {
      const v = c.stats[cond.stat];
      return (cond.min === undefined || v >= cond.min) && (cond.max === undefined || v <= cond.max);
    }
    case 'money':
      return c.money >= cond.min;
    case 'age':
      return (cond.min === undefined || c.age >= cond.min) && (cond.max === undefined || c.age <= cond.max);
    case 'flag': {
      const present = hasFlag(state, cond.flag);
      if (cond.not) return !present;
      if (!present) return false;
      if (cond.minYearsAgo !== undefined) return c.age - state.flags[cond.flag] >= cond.minYearsAgo;
      return true;
    }
    case 'trait': {
      const has = c.traits.includes(cond.trait);
      return cond.not ? !has : has;
    }
    case 'hobby':
      return (c.hobbies[cond.hobby] ?? 0) >= cond.min;
    case 'employed': {
      const job = state.career.job;
      let ok = job !== null;
      if (ok && cond.careerId) ok = job!.careerId === cond.careerId;
      if (ok && cond.minLevel !== undefined) ok = job!.level >= cond.minLevel;
      return cond.not ? !ok : ok;
    }
    case 'retired':
      return cond.not ? !state.career.retired : state.career.retired;
    case 'diploma':
      return cond.not ? !state.education.diploma : state.education.diploma;
    case 'inSchool': {
      const inSchool = state.education.stage === 'primary' || state.education.stage === 'secondary';
      return cond.not ? !inSchool : inSchool;
    }
    case 'enrolled': {
      const e = state.education.enrolled;
      let ok = e !== null;
      if (ok && cond.courseKind) ok = courseKind(e!.courseId) === cond.courseKind;
      return cond.not ? !ok : ok;
    }
    case 'completed': {
      const done = state.education.completed;
      let ok: boolean;
      if (cond.course) ok = done.includes(cond.course);
      else if (cond.kind) ok = done.some((id) => courseKind(id) === cond.kind);
      else ok = done.length > 0;
      return cond.not ? !ok : ok;
    }
    case 'schoolPerf': {
      const inSchool = state.education.stage === 'primary' || state.education.stage === 'secondary';
      const perf = inSchool ? state.education.performance : state.education.enrolled?.performance;
      if (perf === undefined) return false;
      return (cond.min === undefined || perf >= cond.min) && (cond.max === undefined || perf <= cond.max);
    }
    case 'npc': {
      const found = state.npcs.some((n) => npcMatches(state, n, cond));
      return cond.not ? !found : found;
    }
    case 'eventNpc': {
      const npc = findNpc(state, ctx.npcId);
      if (!npc || !npc.alive) return false;
      if (cond.minBond !== undefined && npc.bond < cond.minBond) return false;
      if (cond.maxBond !== undefined && npc.bond > cond.maxBond) return false;
      if (cond.minNpcAge !== undefined && npcAge(state, npc) < cond.minNpcAge) return false;
      if (cond.conflict !== undefined && npc.conflict !== cond.conflict) return false;
      return true;
    }
    case 'housing': {
      const ok = cond.is.includes(state.finance.housing);
      return cond.not ? !ok : ok;
    }
    case 'asset': {
      const ok = state.finance.assets.includes(cond.asset);
      return cond.not ? !ok : ok;
    }
    case 'partner': {
      const ok = currentPartner(state) !== undefined;
      return cond.not ? !ok : ok;
    }
    case 'debt':
      return state.finance.debt >= cond.min;
    case 'counter':
      return (state.counters[cond.counter] ?? 0) >= cond.min;
    case 'background':
      return cond.is.includes(c.background);
    case 'dreamJob': {
      const job = state.career.job;
      const dream = job ? CAREER_MAP[job.careerId]?.dream : undefined;
      const ok = dream !== undefined && hasFlag(state, `dream_${dream}`);
      return cond.not ? !ok : ok;
    }
    case 'any':
      return cond.of.some((sub) => checkCondition(state, sub, ctx));
  }
}

export function checkAll(state: GameState, conds: Condition[] | undefined, ctx: ConditionContext = {}): boolean {
  if (!conds) return true;
  return conds.every((cond) => checkCondition(state, cond, ctx));
}

// ---------------------------------------------------------------------------
// Human-readable requirements (rendered by the UI through translation keys)
// ---------------------------------------------------------------------------

export type Requirement = { key: string; params?: Params } | { anyOf: Requirement[] };

export function describeCondition(cond: Condition): Requirement | null {
  switch (cond.type) {
    case 'stat':
      if (cond.min !== undefined) return { key: 'req.statMin', params: { stat: { t: `stat.${cond.stat}` }, value: cond.min } };
      if (cond.max !== undefined) return { key: 'req.statMax', params: { stat: { t: `stat.${cond.stat}` }, value: cond.max } };
      return null;
    case 'money':
      return { key: 'req.money', params: { amount: { money: cond.min } } };
    case 'age':
      if (cond.min !== undefined) return { key: 'req.ageMin', params: { value: cond.min } };
      if (cond.max !== undefined) return { key: 'req.ageMax', params: { value: cond.max } };
      return null;
    case 'hobby':
      return { key: 'req.hobby', params: { hobby: { t: `hobby.${cond.hobby}` }, value: cond.min } };
    case 'trait':
      return { key: cond.not ? 'req.notTrait' : 'req.trait', params: { trait: { t: `trait.${cond.trait}.name` } } };
    case 'diploma':
      return { key: cond.not ? 'req.noDiploma' : 'req.diploma' };
    case 'inSchool':
      return { key: cond.not ? 'req.notInSchool' : 'req.inSchool' };
    case 'completed':
      if (cond.course) return { key: 'req.course', params: { course: { t: `course.${cond.course}.name` } } };
      if (cond.kind) return { key: 'req.courseKind', params: { kind: { t: `courseKind.${cond.kind}` } } };
      return null;
    case 'enrolled':
      return { key: cond.not ? 'req.notEnrolled' : 'req.enrolled' };
    case 'employed':
      return { key: cond.not ? 'req.unemployed' : 'req.employed' };
    case 'flag':
      if (cond.flag === 'license' && !cond.not) return { key: 'req.license' };
      if (cond.flag === 'record_deal' && !cond.not) return { key: 'req.recordDeal' };
      return null;
    case 'partner':
      return { key: cond.not ? 'req.noPartner' : 'req.partner' };
    case 'asset':
      return { key: cond.not ? 'req.noAsset' : 'req.asset', params: { item: { t: `item.${cond.asset}.name` } } };
    case 'eventNpc':
      if (cond.minBond !== undefined) return { key: 'req.bond', params: { value: cond.minBond } };
      return null;
    case 'dreamJob':
      return cond.not ? null : { key: 'req.dreamJob' };
    case 'any': {
      const parts = cond.of.map(describeCondition).filter((r): r is Requirement => r !== null);
      return parts.length > 0 ? { anyOf: parts } : null;
    }
    default:
      return null;
  }
}

export interface RequirementStatus {
  requirement: Requirement;
  met: boolean;
}

export function describeRequirements(
  state: GameState,
  conds: Condition[] | undefined,
  ctx: ConditionContext = {},
): RequirementStatus[] {
  if (!conds) return [];
  const out: RequirementStatus[] = [];
  for (const cond of conds) {
    const requirement = describeCondition(cond);
    if (requirement) out.push({ requirement, met: checkCondition(state, cond, ctx) });
  }
  return out;
}
