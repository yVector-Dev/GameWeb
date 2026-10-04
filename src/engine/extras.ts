// Investments and context actions for school, university and work.
import { getCareer } from '../content/careers';
import { getCourse } from '../content/courses';
import { checkAll } from './conditions';
import type { YearContext } from './context';
import {
  EngineError,
  addCounter,
  addLog,
  changeBond,
  changeMoney,
  changeStat,
  clamp,
  livingNpcs,
  setFeedback,
  transition,
} from './core';
import { currentSalary, jobTitle } from './career';
import { applyEffects } from './effects';
import { isInSchool } from './education';
import { assertCanAct, poolLeft, spendAction } from './guards';
import type { Rng } from './rng';
import type { Delta, GameState, InvestmentKind, LogTone, Params } from './types';
import { INVESTMENT_KINDS } from './types';

// ---------------------------------------------------------------------------
// Investments
// ---------------------------------------------------------------------------

export interface InvestmentDef {
  /** Average yearly return. */
  mean: number;
  /** Yearly volatility (standard deviation). */
  sd: number;
  /** Chance of a crash year. */
  crash: number;
  /** Loss range in a crash year. */
  crashLoss: [number, number];
}

export const INVESTMENTS: Record<InvestmentKind, InvestmentDef> = {
  bonds: { mean: 0.035, sd: 0.02, crash: 0, crashLoss: [0, 0] },
  stocks: { mean: 0.07, sd: 0.15, crash: 0.04, crashLoss: [0.25, 0.45] },
  crypto: { mean: 0.12, sd: 0.55, crash: 0.12, crashLoss: [0.5, 0.85] },
};

export const MIN_INVEST_AGE = 18;

function gaussian(rng: Rng): number {
  const u = Math.max(1e-9, rng.next());
  const v = rng.next();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function investedIn(state: GameState, kind: InvestmentKind): number {
  return state.finance.investments?.[kind] ?? 0;
}

export function invest(state: GameState, kind: InvestmentKind, amount: number): GameState {
  return transition(state, (s) => {
    assertCanAct(s, { needAction: false });
    if (s.character.age < MIN_INVEST_AGE) throw new EngineError('tooYoung');
    if (!INVESTMENT_KINDS.includes(kind)) throw new EngineError('requirements');
    const value = Math.floor(Math.min(amount, s.character.money));
    if (value <= 0) throw new EngineError('notEnoughMoney', { amount: { money: 1 } });
    const deltas: Delta[] = [];
    changeMoney(s, -value, deltas);
    s.finance.investments = { ...s.finance.investments, [kind]: investedIn(s, kind) + value };
    const params = { kind: { t: `invest.${kind}.name` }, amount: { money: value } };
    addLog(s, 'log.invest.buy', { params, deltas });
    setFeedback(s, { titleKey: 'invest.title', textKey: 'log.invest.buy', textParams: params, deltas, tone: 'neutral' });
  });
}

export function withdraw(state: GameState, kind: InvestmentKind): GameState {
  return transition(state, (s) => {
    assertCanAct(s, { needAction: false });
    const value = investedIn(s, kind);
    if (value <= 0) throw new EngineError('noInvestment');
    const deltas: Delta[] = [];
    changeMoney(s, value, deltas);
    s.finance.investments = { ...s.finance.investments, [kind]: 0 };
    const params = { kind: { t: `invest.${kind}.name` }, amount: { money: value } };
    addLog(s, 'log.invest.sell', { params, deltas });
    setFeedback(s, { titleKey: 'invest.title', textKey: 'log.invest.sell', textParams: params, deltas, tone: 'neutral' });
  });
}

/** Applies one year of market returns to every investment. */
export function processInvestmentsYear(state: GameState, ctx: YearContext): void {
  const inv = state.finance.investments;
  if (!inv) return;
  for (const kind of INVESTMENT_KINDS) {
    const balance = inv[kind] ?? 0;
    if (balance <= 0) continue;
    const def = INVESTMENTS[kind];
    let rate: number;
    let key = 'log.invest.year';
    if (def.crash > 0 && ctx.rng.chance(def.crash)) {
      rate = -(def.crashLoss[0] + ctx.rng.next() * (def.crashLoss[1] - def.crashLoss[0]));
      key = 'log.invest.crash';
    } else {
      rate = Math.max(-0.9, def.mean + def.sd * gaussian(ctx.rng));
    }
    const next = Math.max(0, Math.round(balance * (1 + rate)));
    inv[kind] = next;
    addLog(state, key, {
      tone: rate >= 0 ? 'good' : 'bad',
      params: { kind: { t: `invest.${kind}.name` }, pct: Math.round(rate * 100), amount: { money: next } },
    });
  }
}

// ---------------------------------------------------------------------------
// School, university and work actions (each once per year, one action)
// ---------------------------------------------------------------------------

export type CareerActionContext = 'school' | 'uni' | 'work';

interface Outcome {
  key: string;
  tone: LogTone;
}

export interface CareerActionDef {
  id: string;
  context: CareerActionContext;
  minAge?: number;
  /** Money cost (local price units). */
  cost?: number;
  available?: (s: GameState) => boolean;
  run: (s: GameState, rng: Rng, deltas: Delta[]) => Outcome;
}

function schoolPerf(s: GameState, amount: number): void {
  if (isInSchool(s)) s.education.performance = clamp(s.education.performance + amount);
  if (s.education.enrolled) s.education.enrolled.performance = clamp(s.education.enrolled.performance + amount);
}

function jobPerf(s: GameState, amount: number, deltas: Delta[]): void {
  if (!s.career.job) return;
  s.career.job.performance = clamp(s.career.job.performance + amount);
  deltas.push({ key: 'delta.performance', amount });
}

export const CAREER_ACTIONS: CareerActionDef[] = [
  {
    id: 'club',
    context: 'school',
    minAge: 8,
    run: (s, _r, d) => {
      changeStat(s, 'social', 3, d);
      changeStat(s, 'discipline', 2, d);
      changeStat(s, 'happiness', 2, d);
      schoolPerf(s, 2);
      return { key: 'ca.club.log', tone: 'good' };
    },
  },
  {
    id: 'teacherHelp',
    context: 'school',
    run: (s, _r, d) => {
      changeStat(s, 'knowledge', 2, d);
      schoolPerf(s, 10);
      return { key: 'ca.teacherHelp.log', tone: 'good' };
    },
  },
  {
    id: 'cram',
    context: 'school',
    minAge: 10,
    run: (s, _r, d) => {
      changeStat(s, 'health', -3, d);
      changeStat(s, 'happiness', -2, d);
      schoolPerf(s, 15);
      return { key: 'ca.cram.log', tone: 'neutral' };
    },
  },
  {
    id: 'skipClass',
    context: 'school',
    minAge: 11,
    run: (s, r, d) => {
      changeStat(s, 'happiness', 4, d);
      schoolPerf(s, -10);
      if (r.chance(0.25)) {
        changeStat(s, 'reputation', -3, d);
        for (const p of livingNpcs(s, 'parent')) changeBond(s, p, -5, d);
        return { key: 'ca.skipClass.caught', tone: 'bad' };
      }
      return { key: 'ca.skipClass.log', tone: 'neutral' };
    },
  },
  {
    id: 'studyGroup',
    context: 'uni',
    run: (s, _r, d) => {
      changeStat(s, 'social', 2, d);
      schoolPerf(s, 10);
      return { key: 'ca.studyGroup.log', tone: 'good' };
    },
  },
  {
    id: 'internship',
    context: 'uni',
    run: (s, _r, d) => {
      changeStat(s, 'knowledge', 2, d);
      changeStat(s, 'reputation', 3, d);
      changeStat(s, 'happiness', -1, d);
      s.counters.jobReadiness = Math.min(3, (s.counters.jobReadiness ?? 0) + 2);
      return { key: 'ca.internship.log', tone: 'good' };
    },
  },
  {
    id: 'research',
    context: 'uni',
    available: (s) => {
      const e = s.education.enrolled;
      return !!e && ['university', 'graduate'].includes(getCourse(e.courseId).kind);
    },
    run: (s, _r, d) => {
      changeStat(s, 'knowledge', 4, d);
      changeStat(s, 'reputation', 2, d);
      changeStat(s, 'discipline', 1, d);
      schoolPerf(s, 6);
      return { key: 'ca.research.log', tone: 'good' };
    },
  },
  {
    id: 'campusParty',
    context: 'uni',
    cost: 40,
    run: (s, _r, d) => {
      changeStat(s, 'happiness', 5, d);
      changeStat(s, 'social', 3, d);
      schoolPerf(s, -6);
      return { key: 'ca.campusParty.log', tone: 'good' };
    },
  },
  {
    id: 'overtime',
    context: 'work',
    run: (s, _r, d) => {
      changeMoney(s, Math.round(currentSalary(s) * 0.06), d);
      changeStat(s, 'health', -3, d);
      changeStat(s, 'happiness', -2, d);
      jobPerf(s, 6, d);
      return { key: 'ca.overtime.log', tone: 'neutral' };
    },
  },
  {
    id: 'network',
    context: 'work',
    run: (s, _r, d) => {
      changeStat(s, 'social', 2, d);
      changeStat(s, 'reputation', 3, d);
      return { key: 'ca.network.log', tone: 'good' };
    },
  },
  {
    id: 'training',
    context: 'work',
    cost: 400,
    run: (s, _r, d) => {
      changeStat(s, 'knowledge', 3, d);
      jobPerf(s, 5, d);
      return { key: 'ca.training.log', tone: 'good' };
    },
  },
  {
    id: 'askBonus',
    context: 'work',
    run: (s, r, d) => {
      const perf = s.career.job?.performance ?? 0;
      if (r.chance(clamp((perf - 40) / 60, 0.05, 0.85))) {
        changeMoney(s, Math.round(currentSalary(s) * 0.08), d);
        changeStat(s, 'happiness', 3, d);
        return { key: 'ca.askBonus.ok', tone: 'good' };
      }
      changeStat(s, 'reputation', -1, d);
      jobPerf(s, -3, d);
      return { key: 'ca.askBonus.fail', tone: 'bad' };
    },
  },
  {
    id: 'askPromotion',
    context: 'work',
    available: (s) => {
      const job = s.career.job;
      if (!job) return false;
      const next = getCareer(job.careerId).levels[job.level + 1];
      return !!next && job.yearsInLevel >= Math.max(0, next.minYears - 1) && checkAll(s, next.requires);
    },
    run: (s, r, d) => {
      const job = s.career.job!;
      const next = getCareer(job.careerId).levels[job.level + 1];
      if (r.chance(clamp((job.performance - next.minPerf + 30) / 60, 0.05, 0.9))) {
        applyEffects(s, [{ type: 'promote' }], { rng: r, deltas: d });
        changeStat(s, 'happiness', 4, d);
        return { key: 'ca.askPromotion.ok', tone: 'milestone' };
      }
      jobPerf(s, -4, d);
      changeStat(s, 'happiness', -2, d);
      return { key: 'ca.askPromotion.fail', tone: 'bad' };
    },
  },
];

export function contextActive(state: GameState, context: CareerActionContext): boolean {
  if (context === 'school') return isInSchool(state);
  if (context === 'uni') return state.education.enrolled !== null;
  return state.career.job !== null;
}

export function careerActionStatus(state: GameState, def: CareerActionDef): { ok: boolean; reason?: string } {
  if (!contextActive(state, def.context)) return { ok: false, reason: 'error.requirements' };
  if (def.minAge !== undefined && state.character.age < def.minAge) return { ok: false, reason: 'error.tooYoung' };
  if (def.available && !def.available(state)) return { ok: false, reason: 'error.requirements' };
  if ((state.actions.counts[`ca_${def.id}`] ?? 0) > 0) return { ok: false, reason: 'error.onceAYear' };
  if (poolLeft(state, 'work') <= 0) return { ok: false, reason: 'error.noActions' };
  if ((def.cost ?? 0) > state.character.money) return { ok: false, reason: 'error.notEnoughMoney' };
  return { ok: true };
}

export function performCareerAction(state: GameState, id: string): GameState {
  const def = CAREER_ACTIONS.find((a) => a.id === id);
  if (!def) throw new EngineError('unknownActivity');
  return transition(state, (s, rng) => {
    assertCanAct(s);
    const status = careerActionStatus(s, def);
    if (!status.ok) throw new EngineError((status.reason ?? 'error.requirements').replace(/^error\./, ''));
    spendAction(s, 'work');
    s.actions.counts[`ca_${def.id}`] = 1;
    const deltas: Delta[] = [];
    if (def.cost) changeMoney(s, -def.cost, deltas);
    const out = def.run(s, rng, deltas);
    addCounter(s, 'careerActions');
    const job = s.career.job;
    const params: Params = job ? { job: jobTitle(job.careerId, job.level, s) } : {};
    addLog(s, out.key, { params, tone: out.tone, deltas });
    setFeedback(s, { titleKey: `ca.${def.id}.name`, textKey: out.key, textParams: params, deltas, tone: out.tone });
  });
}
