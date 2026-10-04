import { describe, expect, it } from 'vitest';
import { buildSummary } from '../src/engine';
import { deathChance } from '../src/engine/yearCycle';
import { LOCALES, formatParam, translate } from '../src/i18n/translate';
import type { GameState, Params } from '../src/engine/types';
import { advance, newGame, playLife } from './helpers';

function renderParams(locale: (typeof LOCALES)[number]['code'], params: Params | undefined): void {
  for (const value of Object.values(params ?? {})) formatParam(locale, value);
}

/** Every story line must translate in every language with no leftovers. */
function expectFullyTranslated(state: GameState) {
  const problems: string[] = [];
  for (const { code } of LOCALES) {
    for (const entry of state.log) {
      const text = translate(code, entry.key, entry.params);
      if (text === entry.key || /\{\w+\}/.test(text)) problems.push(`${code}: ${entry.key} → ${text}`);
      if (entry.title && translate(code, entry.title, entry.params) === entry.title) problems.push(`${code}: title ${entry.title}`);
      renderParams(code, entry.params);
      for (const d of entry.deltas ?? []) {
        if (translate(code, d.key, d.params) === d.key) problems.push(`${code}: delta ${d.key}`);
      }
    }
  }
  expect(problems.slice(0, 10)).toEqual([]);
}

describe('a complete life', () => {
  it('goes from birth to death with a summary, in all three languages', () => {
    const ages: number[] = [];
    for (const seed of [101, 202, 303, 404, 505]) {
      const s = playLife(seed);
      expect(s.alive).toBe(false);
      expect(s.death).not.toBeNull();
      expect(s.death!.age).toBeGreaterThan(0);
      expect(s.death!.age).toBeLessThanOrEqual(115);
      expect(s.pending).toBeNull();
      ages.push(s.death!.age);

      const summary = buildSummary(s);
      expect(summary.finalAge).toBe(s.death!.age);
      expect(summary.highlights.length).toBeGreaterThan(0);
      for (const { code } of LOCALES) {
        expect(translate(code, `epithet.${summary.titleId}.name`)).not.toBe(`epithet.${summary.titleId}.name`);
        expect(translate(code, 'end.epitaph', { name: summary.firstName, age: summary.finalAge }, summary.pronouns)).toContain(summary.firstName);
      }
      expectFullyTranslated(s);
      // Systems were actually exercised by the automated player.
      expect(s.log.some((e) => e.key === 'log.school.start')).toBe(true);
      expect(s.log.some((e) => e.key.startsWith('ev.'))).toBe(true);
    }
    const average = ages.reduce((a, b) => a + b, 0) / ages.length;
    expect(average).toBeGreaterThan(55);
    expect(average).toBeLessThan(100);
  }, 60000);

  it('reaches adulthood with school, work and money systems engaged', () => {
    const s = advance(newGame(606), 40);
    expect(s.education.stage === 'graduated' || s.education.stage === 'dropped').toBe(true);
    expect(s.finance.lastLedger).not.toBeNull();
    expect(s.log.filter((e) => e.key === 'log.finance.year').length).toBeGreaterThan(5);
  });

  it('uses a simplified mortality rule that grows with age and poor health', () => {
    expect(deathChance(30, 80)).toBeLessThan(0.002);
    expect(deathChance(85, 80)).toBeGreaterThan(deathChance(60, 80));
    expect(deathChance(60, 10)).toBeGreaterThan(deathChance(60, 90));
    expect(deathChance(115, 100)).toBe(1);
  });
});
