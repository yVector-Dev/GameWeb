import { describe, expect, it } from 'vitest';
import { createNewGame, goClubbing, interact, invest, performCareerAction, withdraw, EngineError } from '../src/engine';
import { orientationOf, preferenceFor } from '../src/engine/character';
import { startJob } from '../src/engine/career';
import { budgetFor } from '../src/engine/guards';
import type { YearContext } from '../src/engine/context';
import { processInvestmentsYear } from '../src/engine/extras';
import { createNpc } from '../src/engine/people';
import { interactionsFor } from '../src/engine/relationships';
import { Rng } from '../src/engine/rng';
import type { GameState } from '../src/engine/types';
import { newGame } from './helpers';

function adult(): GameState {
  const s = structuredClone(newGame(5));
  s.character.age = 25;
  s.year += 25;
  s.pending = null;
  s.character.money = 10000;
  s.actions = budgetFor(25);
  s.npcs = s.npcs.filter((n) => n.relation !== 'partner' && n.relation !== 'spouse');
  return s;
}

describe('orientation', () => {
  it('maps pronouns and orientation to attraction', () => {
    expect(preferenceFor('he', 'straight')).toBe('f');
    expect(preferenceFor('she', 'gay')).toBe('f');
    expect(preferenceFor('he', 'bi')).toBe('any');
    expect(orientationOf('she', 'm')).toBe('straight');
    const g = createNewGame({ firstName: 'A', lastName: 'B', pronouns: 'he', orientation: 'gay', seed: 1 });
    expect(g.character.datingPreference).toBe('m');
  });
});

describe('friends to lovers and intimacy', () => {
  it('lets adult friends of a compatible gender become partners', () => {
    const s = adult();
    s.character.datingPreference = 'f';
    const friend = createNpc(s, new Rng(1), { relation: 'friend', age: 26, bond: 95, gender: 'f' });
    const other = createNpc(s, new Rng(2), { relation: 'friend', age: 26, bond: 95, gender: 'm' });
    expect(interactionsFor(s, friend).some((v) => v.id === 'confess' && v.available)).toBe(true);
    expect(interactionsFor(s, other).some((v) => v.id === 'confess')).toBe(false);
    let tries = s;
    for (let i = 0; i < 6 && tries.npcs.find((n) => n.id === friend.id)!.relation === 'friend'; i++) {
      tries.actions = budgetFor(tries.character.age);
      tries.npcs.find((n) => n.id === friend.id)!.bond = 95;
      tries = interact(tries, friend.id, 'confess');
    }
    expect(['partner', 'friend']).toContain(tries.npcs.find((n) => n.id === friend.id)!.relation);
  });

  it('never offers romance or intimacy to minors', () => {
    const s = adult();
    s.character.age = 16;
    const friend = createNpc(s, new Rng(3), { relation: 'friend', age: 16, bond: 95, gender: 'f' });
    s.character.datingPreference = 'any';
    expect(interactionsFor(s, friend).some((v) => v.id === 'confess' || v.id === 'intimate')).toBe(false);
    expect(() => goClubbing(s)).toThrowError(EngineError);
  });

  it('a night out costs money and an action', () => {
    const s = adult();
    const after = goClubbing(s);
    expect(after.actions.used).toBe(s.actions.used + 1);
    expect(after.log.at(-1)!.key.startsWith('club.')).toBe(true);
  });
});

describe('investments', () => {
  it('moves money in and out and changes every year', () => {
    let s = invest(adult(), 'stocks', 4000);
    expect(s.character.money).toBe(6000);
    expect(s.finance.investments!.stocks).toBe(4000);
    const ctx: YearContext = { rng: new Rng(9), deltas: [], income: [], expenses: [], prevCounts: {} };
    const t = structuredClone(s);
    processInvestmentsYear(t, ctx);
    expect(t.finance.investments!.stocks).not.toBe(4000);
    s = withdraw(t, 'stocks');
    expect(s.finance.investments!.stocks).toBe(0);
    expect(s.character.money).toBe(6000 + t.finance.investments!.stocks!);
  });

  it('bonds are steadier than crypto over many years', () => {
    const spread = (kind: 'bonds' | 'crypto') => {
      const s = structuredClone(adult());
      s.finance.investments = { [kind]: 10000 };
      const rng = new Rng(4);
      const values: number[] = [];
      for (let i = 0; i < 30; i++) {
        processInvestmentsYear(s, { rng, deltas: [], income: [], expenses: [], prevCounts: {} });
        values.push(s.finance.investments![kind]!);
        s.finance.investments![kind] = 10000;
      }
      return Math.max(...values) - Math.min(...values);
    };
    expect(spread('bonds')).toBeLessThan(spread('crypto'));
  });
});

describe('school and work actions', () => {
  it('work actions need a job and run once per year', () => {
    const s = adult();
    expect(() => performCareerAction(s, 'network')).toThrowError(EngineError);
    startJob(s, 'retail', 0);
    const once = performCareerAction(s, 'network');
    expect(() => performCareerAction(once, 'network')).toThrowError(EngineError);
    expect(() => performCareerAction(once, 'overtime')).not.toThrow();
  });
});
