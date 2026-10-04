import { EngineError } from './core';
import type { GameState } from './types';

/** Common preconditions for any player operation. */
export function assertCanAct(state: GameState, options: { needAction?: boolean } = {}): void {
  if (!state.alive) throw new EngineError('gameOver');
  if (state.pending) throw new EngineError('decisionPending');
  if ((options.needAction ?? true) && state.actions.used >= state.actions.max) throw new EngineError('noActions');
}

export function actionsLeft(state: GameState): number {
  return Math.max(0, state.actions.max - state.actions.used);
}

export function spendAction(state: GameState, amount = 1): void {
  if (state.actions.used + amount > state.actions.max) throw new EngineError('noActions');
  state.actions.used += amount;
}
