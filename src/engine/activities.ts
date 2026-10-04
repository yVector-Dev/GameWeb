import { ACTIVITIES, ACTIVITY_MAP, type ActivityDef } from '../content/activities';
import { checkAll } from './conditions';
import {
  EngineError,
  addCounter,
  addLog,
  changeBond,
  changeMoney,
  changeStat,
  clamp,
  livingNpcs,
  setFeedback,
  transition,
} from './core';
import { isInSchool } from './education';
import { assertCanAct, spendAction } from './guards';
import { makeFriend } from './relationships';
import type { Delta, GameState, HobbyId, Params, StatKey } from './types';
import { HOBBY_IDS, STAT_KEYS } from './types';

/** Repeating an activity within the same year yields less each time. */
export const DIMINISHING = [1, 0.6, 0.35, 0.2];

export function diminishingFactor(timesUsed: number): number {
  return DIMINISHING[Math.min(timesUsed, DIMINISHING.length - 1)];
}

export function activityCost(state: GameState, def: ActivityDef): number {
  if (!def.cost) return 0;
  return state.character.age >= (def.costFromAge ?? 0) ? def.cost : 0;
}

function multiplier(state: GameState, def: ActivityDef): number {
  let mult = 1;
  if (def.traitBoost?.some((t) => state.character.traits.includes(t))) mult *= 1.25;
  for (const boost of def.assetBoost ?? []) {
    if (state.finance.assets.includes(boost.asset)) mult *= boost.factor;
  }
  if (state.character.age >= 75 && def.id === 'exercise') mult *= 0.8;
  return mult;
}

function hobbyMultiplier(state: GameState, hobby: HobbyId): number {
  const assets = state.finance.assets;
  if (hobby === 'music' && assets.includes('instrument')) return 1.4;
  if ((hobby === 'writing' || hobby === 'gaming' || hobby === 'art') && assets.includes('computer')) return 1.2;
  return 1;
}

export function sideGigEarnings(state: GameState): number {
  const s = state.character.stats;
  return Math.round(300 + s.social * 6 + s.knowledge * 4);
}

export interface ActivityPreview {
  def: ActivityDef;
  available: boolean;
  reason?: string;
  cost: number;
  timesUsed: number;
  gains: Partial<Record<StatKey, number>>;
  money?: number;
}

/** Expected gains, after traits, items and diminishing returns. */
export function previewGains(state: GameState, def: ActivityDef): Partial<Record<StatKey, number>> {
  const factor = diminishingFactor(state.actions.counts[def.id] ?? 0);
  const mult = multiplier(state, def);
  const out: Partial<Record<StatKey, number>> = {};
  for (const stat of STAT_KEYS) {
    const base = def.gains[stat];
    if (base === undefined) continue;
    out[stat] = base > 0 ? Math.max(1, Math.round(base * factor * mult)) : base;
  }
  return out;
}

export function activityAvailability(state: GameState, def: ActivityDef): { ok: boolean; reason?: string } {
  const age = state.character.age;
  const used = state.actions.counts[def.id] ?? 0;
  if (!state.alive) return { ok: false, reason: 'error.gameOver' };
  if (age < def.minAge || age > def.maxAge) return { ok: false, reason: 'error.wrongAge' };
  if (state.actions.used >= state.actions.max) return { ok: false, reason: 'error.noActions' };
  if (def.perYearLimit !== undefined && used >= def.perYearLimit) return { ok: false, reason: 'error.onceAYear' };
  if (!checkAll(state, def.requires)) return { ok: false, reason: 'error.requirements' };
  if (state.character.money < activityCost(state, def)) return { ok: false, reason: 'error.notEnoughMoney' };
  return { ok: true };
}

export function listActivities(state: GameState): ActivityPreview[] {
  const age = state.character.age;
  return ACTIVITIES.filter((def) => age >= def.minAge && age <= def.maxAge).map((def) => {
    const availability = activityAvailability(state, def);
    return {
      def,
      available: availability.ok,
      reason: availability.reason,
      cost: activityCost(state, def),
      timesUsed: state.actions.counts[def.id] ?? 0,
      gains: previewGains(state, def),
      money: def.special === 'sideGig' ? sideGigEarnings(state) : undefined,
    };
  });
}

export function performActivity(state: GameState, activityId: string, options: { hobby?: HobbyId } = {}): GameState {
  const def = ACTIVITY_MAP[activityId];
  if (!def) throw new EngineError('unknownActivity');
  return transition(state, (s, rng) => {
    assertCanAct(s);
    const availability = activityAvailability(s, def);
    if (!availability.ok) throw new EngineError((availability.reason ?? 'error.requirements').replace(/^error\./, ''));
    if (def.hobby && (!options.hobby || !HOBBY_IDS.includes(options.hobby))) throw new EngineError('pickHobby');

    const timesUsed = s.actions.counts[def.id] ?? 0;
    const factor = diminishingFactor(timesUsed);
    const deltas: Delta[] = [];
    const gains = previewGains(s, def);
    spendAction(s);
    s.actions.counts[def.id] = timesUsed + 1;

    const cost = activityCost(s, def);
    if (cost > 0) changeMoney(s, -cost, deltas);
    for (const stat of STAT_KEYS) {
      const amount = gains[stat];
      if (amount) changeStat(s, stat, amount, deltas);
    }
    if (def.bondFamily) {
      for (const parent of livingNpcs(s, 'parent')) {
        changeBond(s, parent, Math.max(1, Math.round(def.bondFamily * factor)), deltas);
        parent.lastInteractionAge = s.character.age;
      }
    }
    if (def.schoolPerf) {
      const boost = Math.round(def.schoolPerf * factor);
      if (isInSchool(s)) s.education.performance = clamp(s.education.performance + boost);
      if (s.education.enrolled) s.education.enrolled.performance = clamp(s.education.enrolled.performance + boost);
    }
    if (def.jobPerf) {
      if (s.career.job) {
        s.career.job.performance = clamp(s.career.job.performance + Math.round(def.jobPerf * factor));
        changeStat(s, 'reputation', 1, deltas);
        deltas.push({ key: 'delta.performance', amount: Math.round(def.jobPerf * factor) });
      } else {
        s.counters.jobReadiness = Math.min(3, (s.counters.jobReadiness ?? 0) + 1);
      }
    }

    let logKey = `activity.${def.id}.log`;
    const params: Params = {};
    if (def.hobby && options.hobby) {
      const hobby = options.hobby;
      const before = s.character.hobbies[hobby] ?? 0;
      const gain = Math.max(1, Math.round(6 * factor * multiplier(s, def) * hobbyMultiplier(s, hobby)));
      const after = clamp(before + gain);
      s.character.hobbies[hobby] = after;
      deltas.push({ key: 'delta.hobby', params: { hobby: { t: `hobby.${hobby}` } }, amount: after - before });
      params.hobby = { t: `hobby.${hobby}` };
      if (before === 0) logKey = 'log.hobby.start';
      for (const milestone of [25, 50, 75, 100]) {
        if (before < milestone && after >= milestone) {
          addLog(s, 'log.hobby.level', { tone: 'good', params: { hobby: { t: `hobby.${hobby}` }, level: milestone } });
        }
      }
      if (hobby === 'sports') changeStat(s, 'health', 1, deltas);
      if (hobby === 'writing') changeStat(s, 'knowledge', 1, deltas);
      if (hobby === 'gardening') changeStat(s, 'health', 1, deltas);
    }

    if (def.special === 'socialize') {
      const chance = 0.3 + (s.character.traits.includes('outgoing') ? 0.1 : 0) - timesUsed * 0.1;
      if (rng.chance(chance)) {
        const friend = makeFriend(s, rng);
        if (friend) {
          params.name = friend.firstName;
          logKey = 'log.friend.met';
        }
      }
    }
    if (def.special === 'sideGig') {
      const earned = sideGigEarnings(s);
      changeMoney(s, earned, deltas);
      addCounter(s, 'sideGigs');
    }

    addLog(s, logKey, { params, deltas });
    setFeedback(s, { titleKey: `activity.${def.id}.name`, textKey: logKey, textParams: params, deltas, tone: 'good' });
  });
}
