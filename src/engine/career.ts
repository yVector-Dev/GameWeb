import { CAREER_MAP, getCareer, type CareerDef } from '../content/careers';
import { getCountry, wageRatio } from '../content/countries';
import { checkAll, describeRequirements, type RequirementStatus } from './conditions';
import { EngineError, addCounter, addLog, changeStat, clamp, setFeedback, setFlag, transition } from './core';
import type { YearContext } from './context';
import { isInSchool } from './education';
import { assertCanAct, spendAction } from './guards';
import type { CareerRecord, Delta, GameState, JobState, TParam } from './types';

export const RETIREMENT_MIN_AGE = 60;
export const STATE_PENSION_AGE = 67;
export const STATE_PENSION = 8000;
export const FIRE_THRESHOLD = 25;

/** Grammatical context for the player's job titles, derived from pronouns. */
export function playerCtx(state: GameState): string | undefined {
  const p = state.character.pronouns;
  return p === 'he' ? 'm' : p === 'she' ? 'f' : undefined;
}

export function jobTitle(careerId: string, level: number, state?: GameState): TParam {
  const ctx = state ? playerCtx(state) : undefined;
  return ctx ? { t: `career.${careerId}.l${level}`, ctx } : { t: `career.${careerId}.l${level}` };
}

/** Students and teenagers in school work part-time for half the salary. */
export function isPartTime(state: GameState): boolean {
  return isInSchool(state) || state.education.enrolled !== null;
}

/** Salary of a career level in this country (local price units). */
export function salaryFor(state: GameState, careerId: string, level: number): number {
  return Math.round(getCareer(careerId).levels[level].salary * wageRatio(getCountry(state.character.country)));
}

export function currentSalary(state: GameState): number {
  const job = state.career.job;
  if (!job) return 0;
  const salary = salaryFor(state, job.careerId, job.level);
  return isPartTime(state) ? Math.round(salary * 0.5) : salary;
}

export function startLevelFor(state: GameState, careerId: string): number {
  const best = state.career.bestLevel[careerId];
  return best === undefined ? 0 : Math.max(0, best - 1);
}

export interface ApplyCheck {
  career: CareerDef;
  ok: boolean;
  reason?: string;
  requirements: RequirementStatus[];
  chance: number;
  startLevel: number;
}

export function applicationChance(state: GameState, careerId: string): number {
  const career = getCareer(careerId);
  const s = state.character.stats;
  const exp = Math.min(20, (state.career.experience[careerId] ?? 0) * 5);
  const readiness = Math.min(3, state.counters.jobReadiness ?? 0) * 5;
  let chance = 50 + (s[career.keyStat] - 50) * 0.6 + (s.reputation - 50) * 0.3 + (s.social - 50) * 0.2 + exp + readiness;
  if (state.flags.focus_work !== undefined && state.character.age <= 25) chance += 10;
  if (state.flags.criminal_record !== undefined) chance -= 15;
  chance += getCountry(state.character.country).jobMarket;
  return clamp(Math.round(chance), 10, 95) / 100;
}

export function checkApplication(state: GameState, careerId: string): ApplyCheck {
  const career = getCareer(careerId);
  const requirements = describeRequirements(state, career.requires);
  const base = { career, requirements, chance: applicationChance(state, careerId), startLevel: startLevelFor(state, careerId) };
  const age = state.character.age;
  if (career.hidden) return { ...base, ok: false, reason: 'error.hiddenCareer' };
  if (age < career.minAge) return { ...base, ok: false, reason: 'error.tooYoung' };
  if (state.career.retired && age >= 75) return { ...base, ok: false, reason: 'error.tooOld' };
  if (state.career.job?.careerId === careerId) return { ...base, ok: false, reason: 'error.alreadyInCareer' };
  if (isInSchool(state) && !career.teenFriendly) return { ...base, ok: false, reason: 'error.stillInSchool' };
  if (state.career.appliedThisYear.includes(careerId)) return { ...base, ok: false, reason: 'error.appliedThisYear' };
  if (!checkAll(state, career.requires)) return { ...base, ok: false, reason: 'error.requirements' };
  return { ...base, ok: true };
}

function closeJob(state: GameState, reason: CareerRecord['reason']): JobState | null {
  const job = state.career.job;
  if (!job) return null;
  state.career.history.push({
    careerId: job.careerId,
    level: job.level,
    fromAge: job.startedAge,
    toAge: state.character.age,
    reason,
  });
  state.career.job = null;
  return job;
}

/** Starts a job directly (used by applications and by events). */
export function startJob(state: GameState, careerId: string, level: number): void {
  const career = getCareer(careerId);
  if (state.career.job) closeJob(state, 'changed');
  const lvl = Math.max(0, Math.min(level, career.levels.length - 1));
  state.career.job = {
    careerId,
    level: lvl,
    yearsInLevel: 0,
    performance: 55,
    startedAge: state.character.age,
    lowPerfYears: 0,
  };
  state.career.retired = false;
  state.career.bestLevel[careerId] = Math.max(state.career.bestLevel[careerId] ?? 0, lvl);
  addCounter(state, 'jobsHeld');
  state.counters.jobReadiness = 0;
}

export function loseJob(state: GameState, reason: 'laidoff' | 'quit' | 'fired'): boolean {
  return closeJob(state, reason) !== null;
}

export function applyForJob(state: GameState, careerId: string): GameState {
  if (!CAREER_MAP[careerId]) throw new EngineError('unknownCareer');
  return transition(state, (s, rng) => {
    assertCanAct(s);
    const check = checkApplication(s, careerId);
    if (!check.ok) throw new EngineError((check.reason ?? 'error.requirements').replace(/^error\./, ''));
    spendAction(s);
    s.career.appliedThisYear.push(careerId);
    const title = jobTitle(careerId, check.startLevel, s);
    const deltas: Delta[] = [];
    if (rng.chance(check.chance)) {
      startJob(s, careerId, check.startLevel);
      changeStat(s, 'happiness', 5, deltas);
      const key = isPartTime(s) ? 'log.job.hiredPartTime' : 'log.job.hired';
      addLog(s, key, { tone: 'milestone', params: { job: title }, deltas });
      setFeedback(s, { titleKey: 'feedback.hired', titleParams: { job: title }, deltas, tone: 'good' });
    } else {
      changeStat(s, 'happiness', -2, deltas);
      addLog(s, 'log.job.rejected', { tone: 'bad', params: { job: title }, deltas });
      setFeedback(s, { titleKey: 'feedback.rejected', titleParams: { job: title }, deltas, tone: 'bad' });
    }
  });
}

export function quitJob(state: GameState): GameState {
  return transition(state, (s) => {
    assertCanAct(s, { needAction: false });
    const job = s.career.job;
    if (!job) throw new EngineError('noJob');
    closeJob(s, 'quit');
    const title = jobTitle(job.careerId, job.level, s);
    addLog(s, 'log.job.quit', { params: { job: title } });
    setFeedback(s, { titleKey: 'feedback.quit', titleParams: { job: title }, deltas: [], tone: 'neutral' });
  });
}

export function retireNow(state: GameState): void {
  closeJob(state, 'retired');
  state.career.retired = true;
  setFlag(state, 'retired');
}

export function retire(state: GameState): GameState {
  return transition(state, (s) => {
    assertCanAct(s, { needAction: false });
    if (s.character.age < RETIREMENT_MIN_AGE) throw new EngineError('tooYoungToRetire');
    if (s.career.retired) throw new EngineError('alreadyRetired');
    retireNow(s);
    const deltas: Delta[] = [];
    changeStat(s, 'happiness', 6, deltas);
    addLog(s, 'log.job.retired', { tone: 'milestone', params: { pension: { money: pensionFor(s) } }, deltas });
    setFeedback(s, { titleKey: 'feedback.retired', deltas, tone: 'milestone' });
  });
}

/** Yearly pension: a career share (if retired) plus a state pension from 67. */
export function pensionFor(state: GameState): number {
  let pension = 0;
  if (state.career.retired) {
    const share = Math.min(0.5, state.career.yearsWorked * 0.0125);
    pension += Math.round(state.career.lastSalary * share);
  }
  if (state.character.age >= STATE_PENSION_AGE) pension += Math.round(STATE_PENSION * getCountry(state.character.country).safetyNet);
  return pension;
}

export function jobBasePerformance(state: GameState): number {
  const job = state.career.job;
  if (!job) return 0;
  const career = getCareer(job.careerId);
  const s = state.character.stats;
  const traits = state.character.traits;
  // Attributes set a baseline; staying at the top also takes regular skill
  // practice (the "Develop professional skills" activity).
  let base = s.discipline * 0.3 + s[career.keyStat] * 0.3 + s.happiness * 0.1 + 15;
  if (traits.includes('diligent')) base += 5;
  if (traits.includes('ambitious')) base += 4;
  if (traits.includes('anxious')) base -= 3;
  if (traits.includes('easygoing')) base -= 2;
  if (career.creative && traits.includes('creative')) base += 8;
  if (isPartTime(state)) base -= 6;
  if (state.character.age > 68) base -= 5;
  if (state.flags.mentored !== undefined) base += 4;
  return clamp(base);
}

export interface PromotionStatus {
  nextLevel: number;
  yearsNeeded: number;
  yearsHave: number;
  perfNeeded: number;
  perfHave: number;
  requirements: RequirementStatus[];
}

export function promotionStatus(state: GameState): PromotionStatus | null {
  const job = state.career.job;
  if (!job) return null;
  const career = getCareer(job.careerId);
  const next = career.levels[job.level + 1];
  if (!next) return null;
  return {
    nextLevel: job.level + 1,
    yearsNeeded: next.minYears,
    yearsHave: job.yearsInLevel,
    perfNeeded: next.minPerf,
    perfHave: job.performance,
    requirements: describeRequirements(state, next.requires),
  };
}

export function processCareerYear(state: GameState, ctx: YearContext): void {
  const c = state.character;
  const job = state.career.job;
  if (!job) {
    const working = c.age >= 18 && c.age < STATE_PENSION_AGE && !state.career.retired;
    if (working && !state.education.enrolled) {
      addCounter(state, 'unemployedYears');
    }
    return;
  }
  const career = getCareer(job.careerId);
  const salary = currentSalary(state);
  ctx.income.push({ key: 'ledger.salary', params: { job: jobTitle(job.careerId, job.level, state) }, amount: salary });
  state.career.lastSalary = salaryFor(state, job.careerId, job.level);
  state.career.experience[job.careerId] = (state.career.experience[job.careerId] ?? 0) + 1;
  state.career.yearsWorked += 1;
  job.yearsInLevel += 1;

  const perf = clamp(Math.round(job.performance * 0.5 + jobBasePerformance(state) * 0.5 + ctx.rng.int(-4, 4)));
  job.performance = perf;

  const next = career.levels[job.level + 1];
  if (next && job.yearsInLevel >= next.minYears) {
    if (perf >= next.minPerf && checkAll(state, next.requires)) {
      job.level += 1;
      job.yearsInLevel = 0;
      state.career.bestLevel[job.careerId] = Math.max(state.career.bestLevel[job.careerId] ?? 0, job.level);
      addCounter(state, 'promotions');
      const deltas: Delta[] = [];
      changeStat(state, 'reputation', 3, deltas);
      changeStat(state, 'happiness', 5, deltas);
      addLog(state, 'log.job.promoted', { tone: 'milestone', params: { job: jobTitle(job.careerId, job.level, state) }, deltas });
      if (job.level === career.levels.length - 1 && career.levels.length >= 4) setFlag(state, 'top_of_ladder');
    } else if (c.traits.includes('ambitious')) {
      changeStat(state, 'happiness', -2, ctx.deltas);
    }
  }

  if (perf < FIRE_THRESHOLD) {
    job.lowPerfYears += 1;
    if (job.lowPerfYears >= 2) {
      const title = jobTitle(job.careerId, job.level, state);
      closeJob(state, 'fired');
      addCounter(state, 'firings');
      const deltas: Delta[] = [];
      changeStat(state, 'reputation', -5, deltas);
      changeStat(state, 'happiness', -8, deltas);
      addLog(state, 'log.job.fired', { tone: 'bad', params: { job: title }, deltas });
      return;
    }
    addLog(state, 'log.job.warning', { tone: 'bad', params: { job: jobTitle(job.careerId, job.level, state) } });
  } else if (perf >= 35) {
    job.lowPerfYears = 0;
  }

  if (job.level >= 2) changeStat(state, 'reputation', 1, ctx.deltas);
}
