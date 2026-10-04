import {
  EngineError,
  addCounter,
  addLog,
  changeBond,
  changeMoney,
  changeStat,
  clamp,
  currentPartner,
  findNpc,
  hasFlag,
  livingNpcs,
  npcAge,
  relationParam,
  setFeedback,
  setFlag,
  transition,
} from './core';
import type { YearContext } from './context';
import { assertCanAct, spendAction } from './guards';
import { createNpc } from './people';
import type { Rng } from './rng';
import type { DatingPreference, Delta, GameState, Gender, NPC, Params } from './types';

export const MAX_INTERACTIONS_PER_NPC = 3;
export const MAX_CHILDREN = 6;
export const MAX_FRIENDS = 8;
export const ADOPTION_COST = 6000;
export const WEDDING_COST = 4000;
export const DATE_COST = 120;
export const FIND_PARTNER_COST = 80;

export type InteractionId =
  | 'talk'
  | 'time'
  | 'support'
  | 'resolve'
  | 'date'
  | 'propose'
  | 'breakup'
  | 'tryChild'
  | 'askMoney'
  | 'playPet';

export interface InteractionView {
  id: InteractionId;
  available: boolean;
  reason?: string;
  cost: number;
  usesAction: boolean;
  chance?: number;
  confirm?: boolean;
}

const ASK_MONEY = { struggling: 150, modest: 500, comfortable: 1500, wealthy: 5000 } as const;

function isRomantic(npc: NPC): boolean {
  return npc.relation === 'partner' || npc.relation === 'spouse';
}

function canRomance(state: GameState, npc: NPC): boolean {
  return state.character.age >= 18 && npcAge(state, npc) >= 18;
}

export function proposeChance(state: GameState, npc: NPC): number {
  return clamp(npc.bond / 100 + (state.character.stats.reputation - 50) / 400, 0.1, 0.95);
}

export function resolveChance(state: GameState): number {
  let chance = 0.35 + state.character.stats.social / 200;
  if (state.character.traits.includes('kind')) chance += 0.1;
  return clamp(chance, 0.1, 0.95);
}

export function askMoneyChance(npc: NPC): number {
  return clamp(npc.bond / 100, 0.1, 0.9);
}

export function interactionsFor(state: GameState, npc: NPC): InteractionView[] {
  const age = state.character.age;
  const adult = age >= 18;
  const used = state.actions.npcCounts[npc.id] ?? 0;
  const outOfActions = state.actions.used >= state.actions.max;
  const limitReached = used >= MAX_INTERACTIONS_PER_NPC;
  const money = state.character.money;
  const views: InteractionView[] = [];

  const push = (id: InteractionId, extra: Partial<InteractionView> & { ok?: boolean; why?: string } = {}) => {
    const usesAction = extra.usesAction ?? true;
    const cost = extra.cost ?? 0;
    let reason = extra.ok === false ? extra.why : undefined;
    if (!reason && usesAction && outOfActions) reason = 'error.noActions';
    if (!reason && usesAction && limitReached) reason = 'error.npcLimit';
    if (!reason && cost > money) reason = 'error.notEnoughMoney';
    views.push({ id, available: !reason, reason, cost, usesAction, chance: extra.chance, confirm: extra.confirm });
  };

  if (!npc.alive || age < 2) return views;

  if (npc.relation === 'pet') {
    push('playPet');
    return views;
  }
  if (npc.relation === 'ex') {
    push('talk');
    return views;
  }

  push('talk');
  push('time', { cost: adult ? 50 : 0 });
  if (age >= 8) push('support', { cost: adult ? 100 : 0 });
  if (npc.conflict) push('resolve', { chance: resolveChance(state) });

  if (npc.relation === 'parent' && age >= 12) {
    const asked = state.counters.askedMoneyAge === age;
    push('askMoney', { chance: askMoneyChance(npc), ok: !asked, why: 'error.onceAYear' });
  }

  if (isRomantic(npc) && canRomance(state, npc)) {
    push('date', { cost: DATE_COST });
    if (npc.relation === 'partner') {
      const together = state.year - (npc.sinceYear ?? state.year);
      push('propose', {
        chance: proposeChance(state, npc),
        ok: npc.bond >= 70 && together >= 1,
        why: npc.bond < 70 ? 'error.bondTooLow' : 'error.tooSoon',
      });
    }
    const kids = livingNpcs(state, 'child').length;
    const fertile = age <= 50 && npcAge(state, npc) <= 50;
    push('tryChild', {
      chance: 0.55,
      ok: fertile && kids < MAX_CHILDREN && !hasFlag(state, 'expecting'),
      why: !fertile ? 'error.tooOld' : kids >= MAX_CHILDREN ? 'error.maxChildren' : 'error.expecting',
    });
    push('breakup', { usesAction: false, confirm: true });
  }
  return views;
}

function bondGain(state: GameState, base: number): number {
  return base + Math.round(state.character.stats.social / 25);
}

export function interact(state: GameState, npcId: string, id: InteractionId): GameState {
  return transition(state, (s, rng) => {
    assertCanAct(s, { needAction: false });
    const npc = findNpc(s, npcId);
    if (!npc || !npc.alive) throw new EngineError('npcUnavailable');
    const view = interactionsFor(s, npc).find((v) => v.id === id);
    if (!view) throw new EngineError('interactionUnavailable');
    if (!view.available) throw new EngineError((view.reason ?? 'error.interactionUnavailable').replace(/^error\./, ''));

    if (view.usesAction) {
      spendAction(s);
      s.actions.npcCounts[npc.id] = (s.actions.npcCounts[npc.id] ?? 0) + 1;
    }
    const deltas: Delta[] = [];
    if (view.cost > 0) changeMoney(s, -view.cost, deltas);
    npc.lastInteractionAge = s.character.age;
    const params: Params = { name: npc.firstName, rel: relationParam(npc) };
    let key = `interact.${id}.log`;
    let tone: 'neutral' | 'good' | 'bad' | 'milestone' = 'neutral';

    switch (id) {
      case 'talk':
        changeBond(s, npc, bondGain(s, 3), deltas);
        changeStat(s, 'social', 1, deltas);
        break;
      case 'time':
        changeBond(s, npc, bondGain(s, 6), deltas);
        changeStat(s, 'happiness', 2, deltas);
        break;
      case 'support':
        changeBond(s, npc, bondGain(s, 5) + (s.character.traits.includes('kind') ? 3 : 0), deltas);
        changeStat(s, 'reputation', 1, deltas);
        tone = 'good';
        break;
      case 'resolve':
        if (rng.chance(view.chance ?? 0.5)) {
          npc.conflict = false;
          changeBond(s, npc, 10, deltas);
          changeStat(s, 'happiness', 3, deltas);
          key = 'interact.resolve.ok';
          tone = 'good';
        } else {
          changeBond(s, npc, -3, deltas);
          key = 'interact.resolve.fail';
          tone = 'bad';
        }
        break;
      case 'askMoney': {
        s.counters.askedMoneyAge = s.character.age;
        changeBond(s, npc, -3, deltas);
        if (rng.chance(view.chance ?? 0.5)) {
          const amount = ASK_MONEY[s.character.background] * (s.character.age >= 18 ? 1 : 0.2);
          changeMoney(s, Math.round(amount), deltas);
          key = 'interact.askMoney.ok';
          tone = 'good';
        } else {
          key = 'interact.askMoney.fail';
          tone = 'bad';
        }
        break;
      }
      case 'date':
        changeBond(s, npc, bondGain(s, 7), deltas);
        changeStat(s, 'happiness', 3, deltas);
        break;
      case 'propose':
        if (rng.chance(view.chance ?? 0.5)) {
          npc.relation = 'spouse';
          setFlag(s, 'married');
          addCounter(s, 'marriages');
          const wedding = Math.min(WEDDING_COST, s.character.money);
          if (wedding > 0) changeMoney(s, -wedding, deltas);
          changeBond(s, npc, 10, deltas);
          changeStat(s, 'happiness', 10, deltas);
          key = 'interact.propose.ok';
          tone = 'milestone';
        } else {
          changeBond(s, npc, -10, deltas);
          changeStat(s, 'happiness', -5, deltas);
          key = 'interact.propose.fail';
          tone = 'bad';
        }
        break;
      case 'breakup': {
        const wasSpouse = npc.relation === 'spouse';
        npc.relation = 'ex';
        npc.tags.push('old_flame');
        setFlag(s, 'had_ex');
        if (wasSpouse) {
          const cost = Math.round(Math.max(0, s.character.money) * 0.25);
          if (cost > 0) changeMoney(s, -cost, deltas);
          addCounter(s, 'divorces');
          key = 'interact.breakup.divorce';
        }
        changeStat(s, 'happiness', -6, deltas);
        tone = 'bad';
        break;
      }
      case 'tryChild':
        if (rng.chance(view.chance ?? 0.5)) {
          setFlag(s, 'expecting');
          key = 'interact.tryChild.ok';
          tone = 'good';
        } else {
          key = 'interact.tryChild.fail';
        }
        changeBond(s, npc, 3, deltas);
        break;
      case 'playPet':
        changeBond(s, npc, 8, deltas);
        changeStat(s, 'happiness', 3, deltas);
        break;
    }
    addLog(s, key, { params, tone, deltas });
    setFeedback(s, { titleKey: `interact.${id}.name`, textKey: key, textParams: params, deltas, tone });
  });
}

// ---------------------------------------------------------------------------
// Global relationship actions
// ---------------------------------------------------------------------------

export function findPartnerChance(state: GameState): number {
  const s = state.character.stats;
  return clamp(0.25 + s.social / 200 + s.reputation / 400 + (s.happiness - 50) / 400, 0.1, 0.9);
}

export function canFindPartner(state: GameState): { ok: boolean; reason?: string } {
  if (state.character.age < 18) return { ok: false, reason: 'error.tooYoung' };
  if (currentPartner(state)) return { ok: false, reason: 'error.hasPartner' };
  if (state.actions.used >= state.actions.max) return { ok: false, reason: 'error.noActions' };
  if (state.character.money < FIND_PARTNER_COST) return { ok: false, reason: 'error.notEnoughMoney' };
  return { ok: true };
}

function partnerGender(rng: Rng, pref: DatingPreference): Gender {
  if (pref === 'm' || pref === 'f') return pref;
  const roll = rng.next();
  return roll < 0.48 ? 'f' : roll < 0.96 ? 'm' : 'x';
}

export function findPartner(state: GameState): GameState {
  return transition(state, (s, rng) => {
    assertCanAct(s);
    const check = canFindPartner(s);
    if (!check.ok) throw new EngineError((check.reason ?? 'error.requirements').replace(/^error\./, ''));
    spendAction(s);
    const deltas: Delta[] = [];
    changeMoney(s, -FIND_PARTNER_COST, deltas);
    if (rng.chance(findPartnerChance(s))) {
      const age = Math.max(18, s.character.age + rng.int(-5, 5));
      const npc = createNpc(s, rng, {
        relation: 'partner',
        gender: partnerGender(rng, s.character.datingPreference),
        age,
        bond: rng.int(45, 60),
      });
      changeStat(s, 'happiness', 5, deltas);
      const params = { name: npc.firstName };
      addLog(s, 'log.partner.found', { tone: 'good', params, deltas });
      setFeedback(s, { titleKey: 'feedback.partnerFound', titleParams: params, deltas, tone: 'good' });
    } else {
      changeStat(s, 'happiness', -1, deltas);
      addLog(s, 'log.partner.none', { deltas });
      setFeedback(s, { titleKey: 'feedback.partnerNone', deltas, tone: 'neutral' });
    }
  });
}

export function canAdopt(state: GameState): { ok: boolean; reason?: string } {
  if (state.character.age < 25) return { ok: false, reason: 'error.tooYoung' };
  if (state.character.age > 60) return { ok: false, reason: 'error.tooOld' };
  if (state.finance.housing === 'family') return { ok: false, reason: 'error.needOwnHome' };
  if (livingNpcs(state, 'child').length >= MAX_CHILDREN) return { ok: false, reason: 'error.maxChildren' };
  if (state.actions.used >= state.actions.max) return { ok: false, reason: 'error.noActions' };
  if (state.character.money < ADOPTION_COST) return { ok: false, reason: 'error.notEnoughMoney' };
  return { ok: true };
}

export function adoptChild(state: GameState): GameState {
  return transition(state, (s, rng) => {
    assertCanAct(s);
    const check = canAdopt(s);
    if (!check.ok) throw new EngineError((check.reason ?? 'error.requirements').replace(/^error\./, ''));
    spendAction(s);
    const deltas: Delta[] = [];
    changeMoney(s, -ADOPTION_COST, deltas);
    const child = createNpc(s, rng, {
      relation: 'child',
      age: rng.int(1, 6),
      bond: 65,
      lastName: s.character.lastName,
    });
    addCounter(s, 'children');
    changeStat(s, 'happiness', 8, deltas);
    const params = { name: child.firstName };
    addLog(s, 'log.child.adopted', { tone: 'milestone', params, deltas });
    setFeedback(s, { titleKey: 'feedback.adopted', titleParams: params, deltas, tone: 'milestone' });
  });
}

export function setDatingPreference(state: GameState, pref: DatingPreference): GameState {
  return transition(state, (s) => {
    s.character.datingPreference = pref;
  });
}

// ---------------------------------------------------------------------------
// Yearly processing
// ---------------------------------------------------------------------------

function npcHazard(state: GameState, npc: NPC): number {
  const age = npcAge(state, npc);
  if (npc.relation === 'pet') {
    const span = npc.species === 'cat' ? 16 : 13;
    if (age < span - 4) return 0.01;
    if (age < span) return 0.12;
    return 0.3;
  }
  if (age < 40) return 0.0005;
  return Math.min(0.9, 0.00045 * Math.exp(0.088 * (age - 30)));
}

const DECAY: Record<string, number> = {
  friend: 6,
  sibling: 3,
  parent: 2,
  grandparent: 3,
  partner: 5,
  spouse: 4,
  child: 2,
  mentor: 4,
  pet: 2,
  ex: 0,
};

export function processRelationshipsYear(state: GameState, ctx: YearContext): void {
  const rng = ctx.rng;
  const c = state.character;

  // Births
  if (hasFlag(state, 'expecting')) {
    delete state.flags.expecting;
    const partner = currentPartner(state);
    const child = createNpc(state, rng, { relation: 'child', age: 0, bond: 80, lastName: c.lastName });
    addCounter(state, 'children');
    changeStat(state, 'happiness', 10, ctx.deltas);
    addLog(state, partner ? 'log.child.bornWith' : 'log.child.born', {
      tone: 'milestone',
      params: { name: child.firstName, partner: partner?.firstName ?? '' },
    });
  }

  // Deaths
  for (const npc of state.npcs) {
    if (!npc.alive) continue;
    if (!rng.chance(npcHazard(state, npc))) continue;
    npc.alive = false;
    npc.deathYear = state.year;
    const params = { name: npc.firstName, rel: relationParam(npc), age: npcAge(state, npc) };
    const grief = -Math.round(4 + npc.bond / 10);
    const deltas: Delta[] = [];
    changeStat(state, 'happiness', grief, deltas);
    addLog(state, npc.relation === 'pet' ? 'log.pet.died' : 'log.npc.died', { tone: 'bad', params, deltas });
    if (npc.relation === 'parent') {
      state.scheduled.push({ id: state.nextId + 1, eventId: 'parent_funeral', dueAge: c.age, npcId: npc.id, createdAge: c.age });
      state.nextId += 1;
    }
    if (npc.relation === 'spouse' || npc.relation === 'partner') setFlag(state, 'widowed');
  }

  // Bonds drift without attention; conflicts make it worse.
  const removed: NPC[] = [];
  for (const npc of state.npcs) {
    if (!npc.alive) continue;
    const neglected = npc.lastInteractionAge < c.age - 1;
    let decay = 0;
    if (neglected) {
      decay = DECAY[npc.relation] ?? 3;
      if (npc.relation === 'parent' && c.age < 18) decay = 1;
      if (npc.relation === 'child' && npcAge(state, npc) >= 18) decay = 3;
    }
    if (npc.conflict) decay += 4;
    if (decay > 0) npc.bond = clamp(npc.bond - decay);

    if (npc.relation === 'friend' && npc.bond < 12) {
      removed.push(npc);
      addLog(state, 'log.npc.drifted', { tone: 'bad', params: { name: npc.firstName } });
    } else if (npc.relation === 'partner' && npc.bond < 15) {
      npc.relation = 'ex';
      npc.tags.push('old_flame');
      setFlag(state, 'had_ex');
      changeStat(state, 'happiness', -6, ctx.deltas);
      addLog(state, 'log.npc.breakup', { tone: 'bad', params: { name: npc.firstName } });
    } else if (npc.relation === 'spouse' && npc.bond < 10) {
      npc.relation = 'ex';
      npc.tags.push('old_flame');
      setFlag(state, 'had_ex');
      addCounter(state, 'divorces');
      const cost = Math.round(Math.max(0, c.money) * 0.3);
      if (cost > 0) changeMoney(state, -cost);
      changeStat(state, 'happiness', -10, ctx.deltas);
      addLog(state, 'log.npc.divorce', { tone: 'bad', params: { name: npc.firstName, amount: { money: cost } } });
    }

    if (npc.relation === 'child' && !npc.independent && npcAge(state, npc) >= 18) {
      npc.independent = true;
      addLog(state, 'log.child.leaves', { params: { name: npc.firstName } });
    }
  }
  if (removed.length > 0) state.npcs = state.npcs.filter((n) => !removed.includes(n));

  // Occasional friction gives "resolve conflict" something to do.
  if (c.age >= 8 && rng.chance(0.12)) {
    const candidates = livingNpcs(state, ['sibling', 'friend', 'parent', 'spouse', 'partner']).filter((n) => !n.conflict);
    if (candidates.length > 0) {
      const npc = rng.pick(candidates);
      npc.conflict = true;
      addLog(state, 'log.npc.conflict', { tone: 'bad', params: { name: npc.firstName, rel: relationParam(npc) } });
    }
  }
}

/** Creates a new friend of a plausible age (used by socializing and events). */
export function makeFriend(state: GameState, rng: Rng, tags: string[] = [], bond = 40): NPC | null {
  if (livingNpcs(state, 'friend').length >= MAX_FRIENDS) return null;
  const age = state.character.age;
  const spread = age < 18 ? 1 : 8;
  return createNpc(state, rng, { relation: 'friend', age: Math.max(5, age + rng.int(-spread, spread)), bond, tags });
}
