import { EngineError } from './core';
import type { ActionPool, GameState } from './types';

export const POOLS: ActionPool[] = ['personal', 'work', 'social'];

/** Actions per year in each category. Social is a bit larger on purpose. */
export function poolMaxForAge(age: number, pool: ActionPool): number {
  const personal = age <= 2 ? 2 : age <= 12 ? 3 : age <= 17 ? 4 : age <= 64 ? 4 : 3;
  if (pool === 'personal') return personal;
  if (pool === 'work') return age < 3 ? 0 : age < 6 ? 1 : age <= 17 ? 2 : 3;
  return age < 3 ? 1 : personal + 1;
}

/** Fresh yearly budget for an age. */
export function budgetFor(age: number, prison = false): GameState['actions'] {
  const pools = {
    personal: { used: 0, max: prison ? 2 : poolMaxForAge(age, 'personal') },
    work: { used: 0, max: prison ? 0 : poolMaxForAge(age, 'work') },
    social: { used: 0, max: prison ? 1 : poolMaxForAge(age, 'social') },
  };
  return { used: 0, max: pools.personal.max + pools.work.max + pools.social.max, counts: {}, npcCounts: {}, pools };
}

/** Saves made before action categories get pools that match their age. */
export function ensurePools(state: GameState): NonNullable<GameState['actions']['pools']> {
  if (!state.actions.pools) {
    const fresh = budgetFor(state.character.age);
    state.actions.pools = fresh.pools;
    state.actions.max = fresh.max;
  }
  return state.actions.pools!;
}

export function poolLeft(state: GameState, pool: ActionPool): number {
  const p = state.actions.pools?.[pool] ?? { used: 0, max: poolMaxForAge(state.character.age, pool) };
  return Math.max(0, p.max - p.used);
}

/** Common preconditions for any player operation. */
export function assertCanAct(state: GameState, _options: { needAction?: boolean } = {}): void {
  if (!state.alive) throw new EngineError('gameOver');
  if (state.pending) throw new EngineError('decisionPending');
}

export function actionsLeft(state: GameState): number {
  return POOLS.reduce((sum, p) => sum + poolLeft(state, p), 0);
}

export function spendAction(state: GameState, pool: ActionPool, amount = 1): void {
  const pools = ensurePools(state);
  if (pool === 'work' && (state.character.prisonUntil ?? -1) > state.character.age) throw new EngineError('inPrison');
  if (pools[pool].used + amount > pools[pool].max) throw new EngineError('noActions');
  pools[pool].used += amount;
  state.actions.used += amount;
}
