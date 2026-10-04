import { describe, expect, it } from 'vitest';
import { ageUp, commitCrime, seeDoctor, EngineError, performActivity } from '../src/engine';
import { checkApplication } from '../src/engine/career';
import { budgetFor, poolLeft } from '../src/engine/guards';
import { addCondition, diseaseDeathRisk, inPrison } from '../src/engine/life';
import type { GameState } from '../src/engine/types';
import { newGame } from './helpers';

function adult(age = 30): GameState {
  const s = structuredClone(newGame(11));
  s.character.age = age;
  s.year += age;
  s.pending = null;
  s.character.money = 50000;
  s.character.country = 'US';
  s.actions = budgetFor(age);
  return s;
}

describe('diseases', () => {
  it('can be diagnosed, raise the death risk and be treated by a doctor', () => {
    const s = adult();
    addCondition(s, 'hypertension');
    expect(diseaseDeathRisk(s)).toBeGreaterThan(0);
    const after = seeDoctor(s, 'hypertension');
    expect(after.character.conditions![0].treated).toBe(true);
    expect(diseaseDeathRisk(after)).toBeLessThan(diseaseDeathRisk(s));
    expect(poolLeft(after, 'personal')).toBe(poolLeft(s, 'personal') - 1);
  });

  it('refuses a doctor visit for an illness you do not have', () => {
    expect(() => seeDoctor(adult(), 'cancer')).toThrowError(EngineError);
  });

  it('acute illnesses heal on their own the next year', () => {
    const s = adult();
    addCondition(s, 'flu');
    let next = ageUp(s);
    while (next.pending) next = { ...next, pending: null };
    expect(next.character.conditions?.some((c) => c.id === 'flu')).toBe(false);
  });
});

describe('prison', () => {
  it('limits actions and blocks work while serving a sentence', () => {
    let s = adult();
    s.character.prisonUntil = s.character.age + 3;
    expect(inPrison(s)).toBe(true);
    expect(() => performActivity(s, 'study')).toThrowError(EngineError);
    s = ageUp(s);
    expect(s.actions.pools!.work.max).toBe(0);
    expect(s.actions.pools!.personal.max).toBe(2);
    expect(() => commitCrime(s, 'shoplift')).toThrowError(EngineError);
  });

  it('crime pays sometimes and sends adults to prison sometimes', () => {
    let jailed = 0;
    let paid = 0;
    for (let seed = 1; seed < 60; seed++) {
      const s = adult();
      s.rng = seed * 7919;
      const after = commitCrime(s, 'burglary');
      if (inPrison(after)) jailed++;
      if (after.character.money > s.character.money) paid++;
    }
    expect(jailed).toBeGreaterThan(0);
    expect(paid).toBeGreaterThan(0);
  });
});

describe('informal careers', () => {
  it('need a specific characteristic', () => {
    const s = adult(22);
    s.character.stats.looks = 30;
    expect(checkApplication(s, 'model').ok).toBe(false);
    s.character.stats.looks = 95;
    s.actions = budgetFor(22);
    expect(checkApplication(s, 'model').requirements.every((r) => r.met)).toBe(true);
  });

  it('modeling ends with age', () => {
    const s = adult(41);
    s.character.stats.looks = 95;
    expect(checkApplication(s, 'model').ok).toBe(false);
  });
});
