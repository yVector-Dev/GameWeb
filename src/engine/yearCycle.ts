import { getCountry } from '../content/countries';
import { HOUSING } from '../content/items';
import { checkAchievements } from './achievements';
import { processCareerYear, jobTitle } from './career';
import { actionsForAge } from './character';
import type { YearContext } from './context';
import { addLog, changeStat, currentPartner, hasFlag, livingNpcs, setFeedback, transition, EngineError } from './core';
import { processEducationYear } from './education';
import { scheduleEvent } from './effects';
import { processScheduled, rollRandomEvents } from './events';
import { processFinanceYear } from './finance';
import { processInvestmentsYear } from './extras';
import { processRelationshipsYear } from './relationships';
import type { Rng } from './rng';
import type { Delta, GameState } from './types';

export const MAX_AGE = 115;

/**
 * Simplified game rule for the yearly chance of the life ending. It grows
 * with age and is multiplied by poor health. It is a balancing formula, not a
 * medical model.
 */
export function deathChance(age: number, health: number): number {
  if (age >= MAX_AGE) return 1;
  const base = 0.0005 * Math.exp(0.088 * (age - 30));
  const factor = health >= 50 ? 1 - (health - 50) / 100 : 1 + Math.pow((50 - health) / 50, 2) * 6;
  let p = base * factor;
  if (health <= 5) p += 0.12;
  else if (health <= 15) p += 0.03;
  return Math.min(0.95, p);
}

function deathCause(state: GameState, rng: Rng): string {
  const { age } = state.character;
  const health = state.character.stats.health;
  if (health < 25) return 'death.illness';
  if (hasFlag(state, 'smoker') && age > 40 && rng.chance(0.5)) return 'death.heart';
  if (age >= 80) return 'death.oldAge';
  if (state.character.traits.includes('reckless') && rng.chance(0.5)) return 'death.accident';
  return 'death.sudden';
}

export function canAgeUp(state: GameState): { ok: boolean; reason?: string } {
  if (!state.alive) return { ok: false, reason: 'error.gameOver' };
  if (state.pending) return { ok: false, reason: 'error.decisionPending' };
  return { ok: true };
}

function processLifeStages(state: GameState): void {
  const age = state.character.age;
  if (age === 13) addLog(state, 'log.stage.teen', { tone: 'milestone' });
  if (age === 18) addLog(state, 'log.stage.adult', { tone: 'milestone' });
  if (age === 65) addLog(state, 'log.stage.senior', { tone: 'milestone' });
  if (age === 67 && state.career.job && !state.career.retired) scheduleEvent(state, 'retirement_offer', age);
}

function processNaturalStats(state: GameState, ctx: YearContext): void {
  const c = state.character;
  const age = c.age;
  const rng = ctx.rng;

  // Aging
  let decline = 0;
  if (age >= 85) decline = 3;
  else if (age >= 75) decline = 2;
  else if (age >= 60) decline = 1.2;
  else if (age >= 40) decline = 0.5;
  if (c.traits.includes('athletic') && decline > 0) decline *= 0.8;
  if (decline > 0) {
    const whole = Math.floor(decline) + (rng.chance(decline - Math.floor(decline)) ? 1 : 0);
    if (whole > 0) changeStat(state, 'health', -whole, ctx.deltas);
  }
  if (hasFlag(state, 'smoker')) changeStat(state, 'health', -2, ctx.deltas);
  if (age >= 60 && !(ctx.prevCounts.study > 0) && !(ctx.prevCounts.hobby > 0)) {
    if (rng.chance(0.5)) changeStat(state, 'knowledge', -1, ctx.deltas);
  }

  // Use it or lose it: high attributes fade a little when neglected for a year.
  if (age >= 13) {
    const used = (...ids: string[]) => ids.some((id) => (ctx.prevCounts[id] ?? 0) > 0);
    if (c.stats.knowledge > 70 && !used('study', 'read', 'skill') && !state.education.enrolled) changeStat(state, 'knowledge', -2, ctx.deltas);
    if (c.stats.discipline > 70 && !used('study', 'exercise', 'chores', 'skill')) changeStat(state, 'discipline', -2, ctx.deltas);
    if (c.stats.social > 70 && !used('socialize', 'volunteer') && (ctx.prevInteractions ?? 0) === 0) changeStat(state, 'social', -2, ctx.deltas);
  }

  // Life circumstances shape happiness.
  if (age >= 18) {
    let mood = 0;
    const working = age < 67 && !state.career.retired;
    if (working && !state.career.job && !state.education.enrolled) mood -= 3;
    const close = livingNpcs(state, ['friend', 'partner', 'spouse', 'child', 'sibling', 'parent']).some((n) => n.bond >= 50);
    if (!close) mood -= 3;
    const partner = currentPartner(state);
    if (partner && partner.bond >= 70) mood += 2;
    if (state.finance.housing === 'family' && age >= 26) mood -= age >= 32 ? 4 : 2;
    mood += HOUSING[state.finance.housing].happiness;
    if (mood !== 0) changeStat(state, 'happiness', mood, ctx.deltas);
  }
  const drift = Math.round((55 - c.stats.happiness) * 0.08);
  if (drift !== 0) changeStat(state, 'happiness', drift, ctx.deltas);
}

function die(state: GameState, rng: Rng): void {
  state.alive = false;
  const causeKey = deathCause(state, rng);
  state.death = { age: state.character.age, causeKey, year: state.year };
  state.pending = null;
  state.scheduled = [];
  if (state.career.job) {
    state.career.history.push({
      careerId: state.career.job.careerId,
      level: state.career.job.level,
      fromAge: state.career.job.startedAge,
      toAge: state.character.age,
      reason: 'died',
    });
    state.career.lastSalary = 0;
    state.career.job = null;
  }
  addLog(state, 'log.death', { tone: 'milestone', params: { age: state.character.age, cause: { t: causeKey } } });
}

export function ageUp(state: GameState): GameState {
  return transition(state, (s, rng) => {
    const check = canAgeUp(s);
    if (!check.ok) throw new EngineError((check.reason ?? 'error.gameOver').replace(/^error\./, ''));

    const ctx: YearContext = {
      rng,
      deltas: [],
      income: [],
      expenses: [],
      prevCounts: { ...s.actions.counts },
      prevInteractions: Object.values(s.actions.npcCounts).reduce((a, b) => a + b, 0),
    };
    s.character.age += 1;
    s.year += 1;
    s.actions = { used: 0, max: actionsForAge(s.character.age), counts: {}, npcCounts: {} };
    s.career.appliedThisYear = [];
    s.finance.boughtThisYear = [];

    processRelationshipsYear(s, ctx);
    processEducationYear(s, ctx);
    processCareerYear(s, ctx);
    processLifeStages(s);
    processFinanceYear(s, ctx);
    processInvestmentsYear(s, ctx);
    processNaturalStats(s, ctx);
    if (ctx.deltas.length > 0) addLog(s, 'log.year.changes', { deltas: ctx.deltas });

    const deltas: Delta[] = [...ctx.deltas];
    const ledger = s.finance.lastLedger;
    if (ledger && ledger.age === s.character.age && ledger.net !== 0) {
      deltas.push({ key: 'delta.money', amount: ledger.net, money: true });
    }

    if (rng.chance(Math.min(1, deathChance(s.character.age, s.character.stats.health) * getCountry(s.character.country).mortality))) {
      die(s, rng);
      checkAchievements(s);
      setFeedback(s, { titleKey: 'feedback.died', titleParams: { age: s.character.age }, deltas: [], tone: 'milestone' });
      return;
    }

    processScheduled(s, ctx);
    rollRandomEvents(s, ctx);
    checkAchievements(s);

    const job = s.career.job;
    setFeedback(s, {
      titleKey: 'feedback.year',
      titleParams: { age: s.character.age },
      textKey: s.pending ? 'feedback.yearDecision' : job ? 'feedback.yearWorking' : undefined,
      textParams: job ? { job: jobTitle(job.careerId, job.level, s) } : undefined,
      deltas,
      tone: 'neutral',
    });
  });
}
