import { describe, expect, it } from 'vitest';
import { buildSummary } from '../src/engine';
import { playLife } from './helpers';

// Guards against economy or progression regressions using an automated
// player that uses every action every year. Bounds are deliberately loose.
describe('balance', () => {
  it('keeps lives, money and progression within plausible ranges', () => {
    const N = 16;
    const ages: number[] = [];
    let millionaires = 0;
    let topCareers = 0;
    const titles = new Set<string>();
    for (let i = 1; i <= N; i++) {
      const s = playLife(i * 13);
      const summary = buildSummary(s);
      ages.push(summary.finalAge);
      if (s.peaks.money >= 1_000_000) millionaires++;
      if (s.flags.top_of_ladder !== undefined) topCareers++;
      titles.add(summary.titleId);
      expect(s.finance.debt + s.finance.studentDebt).toBeLessThan(150000);
    }
    const avg = ages.reduce((a, b) => a + b, 0) / N;
    expect(avg).toBeGreaterThan(65);
    expect(avg).toBeLessThan(95);
    // Wealth and the top of a career are achievable, not automatic.
    expect(millionaires).toBeLessThan(N * 0.7);
    expect(topCareers).toBeLessThan(N * 0.85);
    // Different lives earn different titles.
    expect(titles.size).toBeGreaterThanOrEqual(3);
  }, 120000);
});
