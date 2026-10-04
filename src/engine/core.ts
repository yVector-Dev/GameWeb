import { Rng } from './rng';
import type { Delta, Feedback, GameState, LogEntry, LogTone, NPC, Params, RelationKind, StatKey } from './types';

export const STAT_MIN = 0;
export const STAT_MAX = 100;

export function clamp(value: number, min = STAT_MIN, max = STAT_MAX): number {
  return Math.min(max, Math.max(min, value));
}

/** Errors the UI can translate: `error.<code>`. */
export class EngineError extends Error {
  readonly code: string;
  readonly params?: Params;

  constructor(code: string, params?: Params) {
    super(code);
    this.name = 'EngineError';
    this.code = code;
    this.params = params;
  }
}

export function cloneState(state: GameState): GameState {
  return structuredClone(state);
}

/**
 * Runs a transition on a deep copy of the state with a generator restored
 * from the persisted seed state. Engine operations never mutate their input.
 */
export function transition(state: GameState, fn: (draft: GameState, rng: Rng) => void): GameState {
  const draft = cloneState(state);
  const rng = new Rng(draft.rng);
  fn(draft, rng);
  draft.rng = rng.state;
  draft.updatedAt = new Date().toISOString();
  return draft;
}

export function nextId(state: GameState): number {
  state.nextId += 1;
  return state.nextId;
}

export function addLog(
  state: GameState,
  key: string,
  options: { params?: Params; tone?: LogTone; title?: string; deltas?: Delta[] } = {},
): LogEntry {
  const entry: LogEntry = {
    id: nextId(state),
    age: state.character.age,
    key,
    tone: options.tone ?? 'neutral',
  };
  if (options.params && Object.keys(options.params).length > 0) entry.params = options.params;
  if (options.title) entry.title = options.title;
  if (options.deltas && options.deltas.length > 0) entry.deltas = mergeDeltas(options.deltas);
  state.log.push(entry);
  return entry;
}

export function setFeedback(state: GameState, feedback: Omit<Feedback, 'seq'>): void {
  const seq = (state.feedback?.seq ?? 0) + 1;
  state.feedback = { ...feedback, deltas: mergeDeltas(feedback.deltas), seq };
}

/** Combines deltas that share the same label and drops zero changes. */
export function mergeDeltas(deltas: Delta[]): Delta[] {
  const merged: Delta[] = [];
  for (const d of deltas) {
    const sig = `${d.key}|${JSON.stringify(d.params ?? {})}|${d.money ? 1 : 0}`;
    const existing = merged.find((m) => `${m.key}|${JSON.stringify(m.params ?? {})}|${m.money ? 1 : 0}` === sig);
    if (existing) existing.amount += d.amount;
    else merged.push({ ...d });
  }
  return merged.filter((d) => Math.round(d.amount) !== 0).map((d) => ({ ...d, amount: Math.round(d.amount) }));
}

/**
 * Changes an attribute, clamped to 0..100, and records the real change.
 * Personality traits make happiness losses heavier or lighter.
 */
export function changeStat(state: GameState, stat: StatKey, amount: number, deltas?: Delta[]): number {
  let value = amount;
  const traits = state.character.traits;
  if (stat === 'happiness' && value < 0) {
    if (traits.includes('anxious')) value *= 1.25;
    if (traits.includes('resilient')) value *= 0.7;
  }
  const before = state.character.stats[stat];
  const after = clamp(Math.round(before + value));
  state.character.stats[stat] = after;
  const real = after - before;
  if (deltas && real !== 0) deltas.push({ key: `stat.${stat}`, amount: real });
  return real;
}

/**
 * Softens gains for attributes that are already high, so reaching the top
 * takes sustained effort instead of a few years of repetition.
 */
export function softGain(current: number, amount: number): number {
  if (amount <= 0) return amount;
  const factor = current <= 40 ? 1 : Math.max(0.25, 1 - (current - 40) / 80);
  const value = Math.round(amount * factor);
  return value < 1 && current < 95 ? 1 : value;
}

export function changeMoney(state: GameState, amount: number, deltas?: Delta[]): void {
  const value = Math.round(amount);
  state.character.money += value;
  if (deltas && value !== 0) deltas.push({ key: 'delta.money', amount: value, money: true });
  if (state.character.money > state.peaks.money) state.peaks.money = state.character.money;
}

export function changeBond(state: GameState, npc: NPC, amount: number, deltas?: Delta[]): void {
  let value = amount;
  if (value > 0 && state.character.traits.includes('outgoing')) value *= 1.2;
  if (value > 0 && state.character.traits.includes('kind')) value *= 1.1;
  const before = npc.bond;
  npc.bond = clamp(Math.round(npc.bond + value));
  const real = npc.bond - before;
  if (deltas && real !== 0) deltas.push({ key: 'delta.bond', params: { name: npc.firstName }, amount: real });
}

export function npcAge(state: GameState, npc: NPC): number {
  return (npc.deathYear ?? state.year) - npc.birthYear;
}

export function findNpc(state: GameState, id: string | undefined): NPC | undefined {
  if (!id) return undefined;
  return state.npcs.find((n) => n.id === id);
}

export function livingNpcs(state: GameState, relation?: RelationKind | RelationKind[]): NPC[] {
  const relations = relation === undefined ? undefined : Array.isArray(relation) ? relation : [relation];
  return state.npcs.filter((n) => n.alive && (!relations || relations.includes(n.relation)));
}

export function currentPartner(state: GameState): NPC | undefined {
  return state.npcs.find((n) => n.alive && (n.relation === 'partner' || n.relation === 'spouse'));
}

export function hasFlag(state: GameState, flag: string): boolean {
  return Object.prototype.hasOwnProperty.call(state.flags, flag);
}

export function setFlag(state: GameState, flag: string): void {
  if (!hasFlag(state, flag)) state.flags[flag] = state.character.age;
}

export function addCounter(state: GameState, counter: string, amount = 1): void {
  state.counters[counter] = (state.counters[counter] ?? 0) + amount;
}

/** Relation label key with the NPC's grammatical gender as context. */
export function relationParam(npc: NPC): { t: string; ctx: string } {
  if (npc.relation === 'pet') return { t: `pet.${npc.species ?? 'dog'}`, ctx: npc.gender };
  return { t: `rel.${npc.relation}`, ctx: npc.gender };
}

export function fullName(npc: NPC): string {
  return npc.relation === 'pet' ? npc.firstName : `${npc.firstName} ${npc.lastName}`;
}

export function netWorth(state: GameState): number {
  const f = state.finance;
  return state.character.money + f.homeValue - f.mortgage - f.studentDebt - f.debt;
}
