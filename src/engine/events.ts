import { EVENTS, EVENT_MAP } from '../content/events';
import { checkAll, describeRequirements, npcMatches, type RequirementStatus } from './conditions';
import { EngineError, addLog, changeMoney, clamp, findNpc, hasFlag, relationParam, setFeedback, transition } from './core';
import type { YearContext } from './context';
import { applyEffects, type EffectContext } from './effects';
import { checkAchievements } from './achievements';
import { createNpc } from './people';
import type { Rng } from './rng';
import type { ChanceDef, ChoiceDef, Delta, EventDef, GameState, LogTone, NPC, Params } from './types';

export const INTERACTIVE_CHANCE_CHILD = 0.55;
export const INTERACTIVE_CHANCE = 0.8;
export const PASSIVE_CHANCE = 0.45;
export const SKIP_CHOICE = '__continue';

export function computeChance(state: GameState, def: ChanceDef): number {
  const c = state.character;
  let value = def.base;
  for (const [stat, weight] of Object.entries(def.stats ?? {})) value += c.stats[stat as keyof typeof c.stats] * (weight as number);
  for (const [trait, bonus] of Object.entries(def.traits ?? {})) if (c.traits.includes(trait as never)) value += bonus as number;
  for (const [hobby, weight] of Object.entries(def.hobbies ?? {})) value += (c.hobbies[hobby as keyof typeof c.hobbies] ?? 0) * (weight as number);
  return clamp(value, def.min ?? 0.05, def.max ?? 0.95);
}

function eventWeight(state: GameState, def: EventDef): number {
  let weight = def.weight;
  for (const mod of def.weightMods ?? []) if (checkAll(state, mod.when)) weight *= mod.factor;
  return weight;
}

function passesBasics(state: GameState, def: EventDef, scheduled: boolean): boolean {
  const age = state.character.age;
  if (age < def.minAge || age > def.maxAge) return false;
  if (def.scheduledOnly && !scheduled) return false;
  const record = state.eventHistory[def.id];
  if (record && record.count >= (def.maxTimes ?? 1)) return false;
  if (record && def.cooldown !== undefined && age - record.lastAge < def.cooldown) return false;
  if (def.requiresFlags?.some((f) => !hasFlag(state, f))) return false;
  if (def.forbidsFlags?.some((f) => hasFlag(state, f))) return false;
  return true;
}

function candidatesFor(state: GameState, def: EventDef): NPC[] {
  if (!def.npc) return [];
  return state.npcs.filter((n) => npcMatches(state, n, def.npc!));
}

function pickNpc(state: GameState, rng: Rng, def: EventDef): NPC | undefined {
  const candidates = candidatesFor(state, def);
  if (candidates.length === 0) return undefined;
  const pick = def.npc?.pick ?? 'random';
  if (pick === 'highestBond') return [...candidates].sort((a, b) => b.bond - a.bond)[0];
  if (pick === 'lowestBond') return [...candidates].sort((a, b) => a.bond - b.bond)[0];
  return rng.pick(candidates);
}

/**
 * Checks whether an event makes sense in the current world. For scheduled
 * follow-ups the bound person must still exist (and be alive unless the
 * event is explicitly about their passing).
 */
export function isEligible(state: GameState, def: EventDef, options: { scheduled?: boolean; npcId?: string } = {}): boolean {
  if (!passesBasics(state, def, options.scheduled ?? false)) return false;
  let npcId = options.npcId;
  if (npcId) {
    const npc = findNpc(state, npcId);
    if (!npc) return false;
    if (!npc.alive && !def.allowDeadNpc) return false;
    if (npc.alive && def.npc && !npcMatches(state, npc, def.npc)) return false;
  } else if (def.npc) {
    const candidates = candidatesFor(state, def);
    if (candidates.length === 0) return false;
    // Conditions referring to the event NPC must hold for at least one candidate.
    return candidates.some((n) => checkAll(state, def.conditions, { npcId: n.id }));
  }
  return checkAll(state, def.conditions, { npcId });
}

export function eligibleEvents(state: GameState, interactive: boolean): EventDef[] {
  return EVENTS.filter((def) => Boolean(def.choices) === interactive && isEligible(state, def));
}

function buildParams(state: GameState, def: EventDef, rng: Rng, npc?: NPC): Params {
  const params: Params = { name: state.character.firstName };
  if (npc) {
    params.npc = npc.firstName;
    params.npcRel = relationParam(npc);
  }
  if (def.extraParams) Object.assign(params, def.extraParams(state, (items) => rng.pick(items)));
  return params;
}

function recordEvent(state: GameState, def: EventDef): void {
  const record = state.eventHistory[def.id] ?? { count: 0, lastAge: state.character.age };
  record.count += 1;
  record.lastAge = state.character.age;
  state.eventHistory[def.id] = record;
}

export function startEvent(state: GameState, rng: Rng, def: EventDef, source: 'random' | 'scheduled', npcId?: string): void {
  let npc: NPC | undefined;
  if (npcId) npc = findNpc(state, npcId);
  else if (def.npc) {
    const candidates = candidatesFor(state, def).filter((n) => checkAll(state, def.conditions, { npcId: n.id }));
    if (candidates.length > 0) {
      const preferred = pickNpc(state, rng, def);
      npc = preferred && candidates.includes(preferred) ? preferred : rng.pick(candidates);
    }
  }
  if (!npc && def.spawnNpc) {
    const spec = def.spawnNpc;
    const age = spec.age
      ? rng.int(spec.age[0], spec.age[1])
      : state.character.age + rng.int(spec.ageOffset?.[0] ?? 0, spec.ageOffset?.[1] ?? 0);
    npc = createNpc(state, rng, {
      relation: spec.relation,
      age,
      bond: spec.bond,
      tags: spec.tags,
      species: spec.species,
      lastName: spec.sameSurname ? state.character.lastName : undefined,
    });
  }
  recordEvent(state, def);
  const params = buildParams(state, def, rng, npc);
  const title = `ev.${def.id}.title`;

  if (def.choices && def.choices.length > 0) {
    const startDeltas: Delta[] = [];
    if (def.onStart) applyEffects(state, def.onStart, { rng, deltas: startDeltas, npcId: npc?.id, params });
    state.pending = { eventId: def.id, npcId: npc?.id, params, source, age: state.character.age };
    addLog(state, `ev.${def.id}.text`, { tone: 'event', title, params, deltas: startDeltas });
    return;
  }

  const deltas: Delta[] = [];
  const ctx: EffectContext = { rng, deltas, npcId: npc?.id, params };
  applyEffects(state, def.effects, ctx);
  addLog(state, `ev.${def.id}.text`, { tone: def.tone ?? 'neutral', title, params, deltas });
}

/** Runs consequences whose time has come, dropping those that no longer make sense. */
export function processScheduled(state: GameState, ctx: YearContext): void {
  const age = state.character.age;
  const due = state.scheduled.filter((item) => item.dueAge <= age).sort((a, b) => a.dueAge - b.dueAge || a.id - b.id);
  for (const item of due) {
    state.scheduled = state.scheduled.filter((s) => s.id !== item.id);
    const def = EVENT_MAP[item.eventId];
    if (!def) continue;
    if (age > def.maxAge) continue;
    if (age < def.minAge) {
      state.scheduled.push({ ...item, dueAge: def.minAge });
      continue;
    }
    if (!isEligible(state, def, { scheduled: true, npcId: item.npcId })) continue;
    if (def.choices && state.pending) {
      // One decision per year: try again next year while it still fits.
      if (age + 1 <= def.maxAge) state.scheduled.push({ ...item, dueAge: age + 1 });
      continue;
    }
    startEvent(state, ctx.rng, def, 'scheduled', item.npcId);
  }
}

export function rollRandomEvents(state: GameState, ctx: YearContext): void {
  const rng = ctx.rng;
  const interactiveChance = state.character.age < 4 ? INTERACTIVE_CHANCE_CHILD : INTERACTIVE_CHANCE;
  if (!state.pending && rng.chance(interactiveChance)) {
    const pool = eligibleEvents(state, true);
    const def = rng.weighted(pool, (d) => eventWeight(state, d));
    if (def) startEvent(state, rng, def, 'random');
  }
  if (rng.chance(PASSIVE_CHANCE)) {
    const pool = eligibleEvents(state, false);
    const def = rng.weighted(pool, (d) => eventWeight(state, d));
    if (def) startEvent(state, rng, def, 'random');
  }
}

// ---------------------------------------------------------------------------
// Choices
// ---------------------------------------------------------------------------

export interface ChoiceView {
  choice: ChoiceDef;
  available: boolean;
  requirements: RequirementStatus[];
  cost: number;
  chance?: number;
}

export function choiceViews(state: GameState): ChoiceView[] {
  const pending = state.pending;
  if (!pending) return [];
  const def = EVENT_MAP[pending.eventId];
  if (!def?.choices) return [];
  const ctx = { npcId: pending.npcId };
  return def.choices
    .filter((choice) => checkAll(state, choice.visibleIf, ctx))
    .map((choice) => {
      const cost = choice.cost ?? 0;
      const met = checkAll(state, choice.requires, ctx);
      return {
        choice,
        available: met && state.character.money >= cost,
        requirements: describeRequirements(state, choice.requires, ctx),
        cost,
        chance: choice.chance ? computeChance(state, choice.chance) : undefined,
      };
    });
}

export function resolveChoice(state: GameState, choiceId: string): GameState {
  return transition(state, (s, rng) => {
    if (!s.alive) throw new EngineError('gameOver');
    const pending = s.pending;
    if (!pending) throw new EngineError('noPending');
    const def = EVENT_MAP[pending.eventId];
    if (!def?.choices) throw new EngineError('noPending');
    const views = choiceViews(s);
    const deltas: Delta[] = [];
    let resultKey: string;
    let tone: LogTone = 'neutral';

    if (choiceId === SKIP_CHOICE) {
      // Safety valve: only allowed if no choice can be taken at all.
      if (views.some((v) => v.available)) throw new EngineError('choiceUnavailable');
      resultKey = 'ev.generic.skipped';
    } else {
      const view = views.find((v) => v.choice.id === choiceId);
      if (!view) throw new EngineError('choiceUnavailable');
      if (!view.available) throw new EngineError('choiceUnavailable');
      const choice = view.choice;
      const ctx: EffectContext = { rng, deltas, npcId: pending.npcId, params: pending.params };
      if (view.cost > 0) changeMoney(s, -view.cost, deltas);
      applyEffects(s, choice.effects, ctx);
      resultKey = `ev.${def.id}.r.${choice.id}`;
      if (choice.chance) {
        const success = rng.chance(view.chance ?? 0.5);
        applyEffects(s, success ? choice.success : choice.failure, ctx);
        resultKey += success ? '_ok' : '_fail';
        tone = success ? 'good' : 'bad';
      }
      const net = deltas.reduce((sum, d) => sum + (d.money ? 0 : d.amount), 0);
      if (!choice.chance) tone = net > 0 ? 'good' : net < 0 ? 'bad' : 'neutral';
    }
    s.pending = null;
    addLog(s, resultKey, { tone, params: pending.params, deltas });
    setFeedback(s, {
      titleKey: `ev.${def.id}.title`,
      textKey: resultKey,
      textParams: pending.params,
      deltas,
      tone,
    });
    checkAchievements(s);
  });
}
