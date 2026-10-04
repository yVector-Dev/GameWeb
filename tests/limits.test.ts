import { describe, expect, it } from 'vitest';
import { ageUp, performActivity, EngineError } from '../src/engine';
import { DIMINISHING } from '../src/engine/activities';
import { poolLeft, poolMaxForAge } from '../src/engine/guards';
import { applyEffects } from '../src/engine/effects';
import { Rng } from '../src/engine/rng';
import { STAT_KEYS, type GameState } from '../src/engine/types';
import { advance, newGame, playLife } from './helpers';

function adult(seed = 7): GameState {
  return advance(newGame(seed), 20);
}

describe('attribute limits', () => {
  it('clamps every attribute to 0..100', () => {
    const s = structuredClone(newGame(1));
    const rng = new Rng(1);
    applyEffects(s, STAT_KEYS.map((stat) => ({ type: 'stat' as const, stat, amount: 500 })), { rng, deltas: [] });
    for (const stat of STAT_KEYS) expect(s.character.stats[stat]).toBe(100);
    applyEffects(s, STAT_KEYS.map((stat) => ({ type: 'stat' as const, stat, amount: -900 })), { rng, deltas: [] });
    for (const stat of STAT_KEYS) expect(s.character.stats[stat]).toBe(0);
  });

  it('reports the real (clamped) change in the feedback', () => {
    const s = structuredClone(newGame(2));
    s.character.stats.knowledge = 98;
    const deltas: { key: string; amount: number }[] = [];
    applyEffects(s, [{ type: 'stat', stat: 'knowledge', amount: 10 }], { rng: new Rng(2), deltas });
    expect(deltas).toEqual([{ key: 'stat.knowledge', amount: 2 }]);
  });

  it('keeps attributes and bonds within range through whole lives', () => {
    for (const seed of [3, 11, 29]) {
      const s = playLife(seed);
      for (const stat of STAT_KEYS) {
        expect(s.character.stats[stat]).toBeGreaterThanOrEqual(0);
        expect(s.character.stats[stat]).toBeLessThanOrEqual(100);
      }
      for (const npc of s.npcs) {
        expect(npc.bond).toBeGreaterThanOrEqual(0);
        expect(npc.bond).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe('action budget', () => {
  it('gives an age-appropriate budget per category, with social a bit larger', () => {
    expect(poolMaxForAge(0, 'work')).toBe(0);
    expect(poolMaxForAge(30, 'personal')).toBe(4);
    expect(poolMaxForAge(30, 'work')).toBe(3);
    for (const age of [5, 15, 30, 70]) expect(poolMaxForAge(age, 'social')).toBeGreaterThan(poolMaxForAge(age, 'personal'));
  });

  it('refuses activities once a category is spent, until the next year', () => {
    let s = adult();
    while (s.pending) s = advance(s, 0);
    const max = s.actions.pools!.personal.max;
    for (let i = 0; i < max; i++) s = performActivity(s, 'rest');
    expect(poolLeft(s, 'personal')).toBe(0);
    try {
      performActivity(s, 'exercise');
      expect.unreachable();
    } catch (err) {
      expect((err as EngineError).code).toBe('noActions');
    }
    // Other categories are separate.
    expect(() => performActivity(s, 'study')).not.toThrow();
    s = advance(s, 1);
    expect(s.actions.used).toBe(0);
    expect(() => performActivity(s, 'exercise')).not.toThrow();
  });

  it('gives diminishing returns when repeating the same activity', () => {
    let s = adult(9);
    s.character.stats.health = 10;
    const before = s.character.stats.health;
    s = performActivity(s, 'exercise');
    const first = s.character.stats.health - before;
    const mid = s.character.stats.health;
    s = performActivity(s, 'exercise');
    const second = s.character.stats.health - mid;
    expect(first).toBeGreaterThan(second);
    expect(DIMINISHING[1]).toBeLessThan(DIMINISHING[0]);
  });

  it('does not allow unlimited money: the side gig works once per year', () => {
    let s = adult(5);
    s = performActivity(s, 'sideGig');
    expect(() => performActivity(s, 'sideGig')).toThrowError(EngineError);
    // Over ten years the side gig adds a bounded amount.
    let total = 0;
    for (let i = 0; i < 10; i++) {
      s = advance(s, 1);
      if (!s.alive) break;
      while (s.pending) s = advance(s, 0);
      const before = s.character.money;
      s = performActivity(s, 'sideGig');
      total += s.character.money - before;
      expect(() => performActivity(s, 'sideGig')).toThrow();
    }
    expect(total).toBeLessThan(10 * 2000);
  });

  it('blocks Age Up while a decision is pending', () => {
    let s = newGame(13);
    let guard = 0;
    while (!s.pending && guard++ < 40) s = ageUp(s);
    expect(s.pending).not.toBeNull();
    expect(() => ageUp(s)).toThrowError(EngineError);
    expect(() => performActivity(s, 'rest')).toThrowError(EngineError);
  });
});

describe('people', () => {
  it('avoids repeated first names among living people', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const s = playLife(seed * 101, 45);
      const names = [s.character.firstName, ...s.npcs.filter((n) => n.alive).map((n) => n.firstName)];
      const repeated = names.filter((n, i) => names.indexOf(n) !== i);
      // Name pools are finite, so rare repeats are tolerated, never many.
      expect(repeated.length).toBeLessThanOrEqual(1);
    }
  });
});
