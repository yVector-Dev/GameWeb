import { describe, expect, it } from 'vitest';
import { ageUp, buyItem, EngineError } from '../src/engine';
import { startJob } from '../src/engine/career';
import type { YearContext } from '../src/engine/context';
import { incomeTax, processFinanceYear } from '../src/engine/finance';
import { Rng } from '../src/engine/rng';
import type { GameState } from '../src/engine/types';
import { advance, newGame } from './helpers';

function ctx(seed = 1): YearContext {
  return { rng: new Rng(seed), deltas: [], income: [], expenses: [], prevCounts: {} };
}

function employedAdult(): GameState {
  const s = structuredClone(advance(newGame(21), 25));
  s.pending = null;
  startJob(s, 'retail', 1);
  s.finance.housing = 'rent_small';
  s.finance.debt = 0;
  s.finance.studentDebt = 0;
  s.finance.assets = [];
  s.npcs = s.npcs.filter((n) => n.relation !== 'child');
  s.character.money = 50000;
  s.flags = {};
  s.scheduled = [];
  return s;
}

describe('yearly finances', () => {
  it('applies income and expenses exactly once per year', () => {
    const s = employedAdult();
    s.character.age += 1;
    const c = ctx();
    c.income.push({ key: 'ledger.salary', amount: 24000 });
    expect(processFinanceYear(s, c)).toBe(true);
    const after = s.character.money;
    // Running the same year again must not charge or pay anything.
    expect(processFinanceYear(s, c)).toBe(false);
    expect(s.character.money).toBe(after);
    expect(s.finance.lastProcessedAge).toBe(s.character.age);
  });

  it('matches the ledger: money changes by the net of the year', () => {
    const s = employedAdult();
    s.character.stats.health = 100;
    const before = s.character.money;
    const next = ageUp(s);
    const ledger = next.finance.lastLedger!;
    expect(ledger.age).toBe(next.character.age);
    // Events may add money of their own; finance changes must match the ledger.
    const eventMoney = next.log
      .filter((e) => e.age === next.character.age && e.key.startsWith('ev.'))
      .flatMap((e) => e.deltas ?? [])
      .filter((d) => d.money)
      .reduce((a, d) => a + d.amount, 0);
    expect(next.character.money - before - eventMoney).toBe(ledger.net);
    const salary = ledger.lines.filter((l) => l.key === 'ledger.salary');
    expect(salary).toHaveLength(1);
    expect(ledger.lines.filter((l) => l.key === 'ledger.rent')).toHaveLength(1);
  });

  it('turns a shortfall into debt instead of negative savings', () => {
    const s = employedAdult();
    s.career.job = null;
    s.character.money = 100;
    s.character.age += 1;
    processFinanceYear(s, ctx());
    expect(s.character.money).toBe(0);
    expect(s.finance.debt).toBeGreaterThan(0);
    expect(s.log.some((e) => e.key === 'log.finance.shortfall')).toBe(true);
  });

  it('uses progressive income tax', () => {
    expect(incomeTax(10000)).toBe(0);
    expect(incomeTax(20000)).toBe(2000);
    expect(incomeTax(60000)).toBe(8000 + 3000);
    expect(incomeTax(150000)).toBe(8000 + 15000 + 20000);
  });

  it('refuses purchases without enough money', () => {
    const s = employedAdult();
    s.character.money = 10;
    expect(() => buyItem(s, 'computer')).toThrowError(EngineError);
    s.character.money = 5000;
    const bought = buyItem(s, 'computer');
    expect(bought.finance.assets).toContain('computer');
    expect(bought.character.money).toBe(5000 - 1200);
    expect(() => buyItem(bought, 'computer')).toThrowError(EngineError);
  });

  it('never lets debt run away, even for someone who never works', () => {
    let s = newGame(77);
    for (let i = 0; i < 90 && s.alive; i++) {
      s = structuredClone(advance(s, 1));
      s.character.stats.health = 100; // keep the life going for the test
      s.career.job = null;
    }
    expect(s.finance.debt).toBeLessThan(60000);
    const ledger = s.finance.lastLedger!;
    expect(ledger.lines.some((l) => l.key === 'ledger.support' || l.key === 'ledger.pension')).toBe(true);
  });

  it('declares bankruptcy only as a last resort, with a reputation cost', () => {
    const s = employedAdult();
    s.career.job = null;
    s.finance.housing = 'family';
    s.character.money = 0;
    s.finance.debt = 90000;
    s.finance.debtYears = 5;
    const reputation = s.character.stats.reputation;
    s.character.age += 1;
    processFinanceYear(s, ctx());
    expect(s.finance.debt).toBe(0);
    expect(s.flags.bankrupt).toBeDefined();
    expect(s.character.stats.reputation).toBeLessThan(reputation);
  });

  it('minors pay no living costs', () => {
    const s = structuredClone(newGame(4));
    s.character.age = 10;
    s.finance.lastProcessedAge = 9;
    processFinanceYear(s, ctx());
    expect(s.character.money).toBe(0);
    expect(s.finance.debt).toBe(0);
  });
});
