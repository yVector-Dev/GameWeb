import { ACHIEVEMENTS } from '../content/achievements';
import { addLog } from './core';
import type { GameState } from './types';

/** Unlocks any newly satisfied achievement. Returns the ids unlocked now. */
export function checkAchievements(state: GameState): string[] {
  const unlocked: string[] = [];
  for (const def of ACHIEVEMENTS) {
    if (state.achievements[def.id] !== undefined) continue;
    if (!def.check(state)) continue;
    state.achievements[def.id] = state.character.age;
    unlocked.push(def.id);
    addLog(state, 'log.achievement', { tone: 'milestone', params: { name: { t: `ach.${def.id}.name` } } });
  }
  return unlocked;
}
