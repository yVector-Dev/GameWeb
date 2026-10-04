// Health conditions, doctors and surgery, gambling, crime and prison, and
// emigration. Every action here uses one action from a yearly category.
import { COUNTRY_MAP, getCountry, wageRatio } from '../content/countries';
import { loseJob } from './career';
import type { YearContext } from './context';
import {
  EngineError,
  addCounter,
  addLog,
  changeBond,
  changeMoney,
  changeStat,
  clamp,
  hasFlag,
  livingNpcs,
  setFeedback,
  setFlag,
  transition,
} from './core';
import { assertCanAct, poolLeft, spendAction } from './guards';
import type { Rng } from './rng';
import type { ActionPool, Delta, GameState, LogTone, Params, StatKey } from './types';

// ---------------------------------------------------------------------------
// Diseases (simplified game rules, not medical advice)
// ---------------------------------------------------------------------------

export interface DiseaseDef {
  id: string;
  minAge: number;
  /** Yearly chance of getting it. */
  chance: (s: GameState) => number;
  /** Yearly effects while sick (halved for treated chronic conditions). */
  yearly: Partial<Record<StatKey, number>>;
  /** Extra yearly chance of dying while sick. */
  deathRisk: number;
  /** Heals on its own after a year. */
  acute?: boolean;
  /** Chance a doctor's treatment cures it; 0 = can only be managed. */
  cure: number;
  /** Treatment cost in local price units. */
  treatmentCost: number;
}

const smoker = (s: GameState) => (hasFlag(s, 'smoker') ? 1 : 0);
const lowHealth = (s: GameState) => (s.character.stats.health < 40 ? 1 : 0);

export const DISEASES: DiseaseDef[] = [
  { id: 'flu', minAge: 0, chance: () => 0.05, yearly: { health: -3, happiness: -1 }, deathRisk: 0, acute: true, cure: 1, treatmentCost: 60 },
  { id: 'brokenBone', minAge: 5, chance: (s) => 0.012 + (s.character.traits.includes('reckless') ? 0.02 : 0), yearly: { health: -4, happiness: -2 }, deathRisk: 0, acute: true, cure: 1, treatmentCost: 400 },
  { id: 'depression', minAge: 13, chance: (s) => 0.008 + (s.character.stats.happiness < 30 ? 0.12 : 0), yearly: { happiness: -6, health: -1 }, deathRisk: 0.002, cure: 0.55, treatmentCost: 700 },
  { id: 'std', minAge: 18, chance: () => 0, yearly: { health: -2, happiness: -2 }, deathRisk: 0, cure: 0.95, treatmentCost: 150 },
  { id: 'diabetes', minAge: 30, chance: (s) => 0.005 + lowHealth(s) * 0.015 + (s.character.age > 55 ? 0.006 : 0), yearly: { health: -3 }, deathRisk: 0.006, cure: 0, treatmentCost: 900 },
  { id: 'hypertension', minAge: 35, chance: (s) => 0.01 + smoker(s) * 0.01 + (s.character.age > 55 ? 0.01 : 0), yearly: { health: -2 }, deathRisk: 0.004, cure: 0, treatmentCost: 400 },
  { id: 'heartDisease', minAge: 45, chance: (s) => 0.004 + smoker(s) * 0.015 + lowHealth(s) * 0.008, yearly: { health: -5, happiness: -2 }, deathRisk: 0.03, cure: 0, treatmentCost: 3000 },
  { id: 'cancer', minAge: 25, chance: (s) => 0.0008 + Math.max(0, s.character.age - 40) * 0.00025 + smoker(s) * 0.006, yearly: { health: -12, happiness: -5 }, deathRisk: 0.12, cure: 0.55, treatmentCost: 25000 },
  { id: 'dementia', minAge: 70, chance: (s) => 0.008 + (s.character.age - 70) * 0.002, yearly: { knowledge: -4, happiness: -3 }, deathRisk: 0.02, cure: 0, treatmentCost: 2000 },
];

export const DISEASE_MAP: Record<string, DiseaseDef> = Object.fromEntries(DISEASES.map((d) => [d.id, d]));

export function conditionsOf(state: GameState) {
  return state.character.conditions ?? [];
}

export function hasCondition(state: GameState, id: string): boolean {
  return conditionsOf(state).some((c) => c.id === id);
}

export function addCondition(state: GameState, id: string): void {
  if (hasCondition(state, id)) return;
  state.character.conditions = [...conditionsOf(state), { id, sinceAge: state.character.age, treated: false }];
  addLog(state, 'log.health.diagnosed', { tone: 'bad', params: { disease: { t: `disease.${id}.name` } } });
}

/** Healthcare is cheaper where the public system is stronger. */
export function treatmentCost(state: GameState, id: string): number {
  const def = DISEASE_MAP[id];
  const net = getCountry(state.character.country).safetyNet;
  return Math.round(def.treatmentCost * (net >= 1 ? 0.15 : 1.2 - net));
}

export function diseaseDeathRisk(state: GameState): number {
  return conditionsOf(state).reduce((sum, c) => sum + (DISEASE_MAP[c.id]?.deathRisk ?? 0) * (c.treated ? 0.5 : 1), 0);
}

export function processHealthYear(state: GameState, ctx: YearContext): void {
  const kept = [];
  for (const cond of conditionsOf(state)) {
    const def = DISEASE_MAP[cond.id];
    if (!def) continue;
    const factor = cond.treated ? 0.5 : 1;
    for (const [stat, amount] of Object.entries(def.yearly)) changeStat(state, stat as StatKey, Math.round((amount as number) * factor), ctx.deltas);
    if (def.acute && cond.sinceAge < state.character.age) {
      addLog(state, 'log.health.recovered', { tone: 'good', params: { disease: { t: `disease.${def.id}.name` } } });
      continue;
    }
    kept.push(cond);
  }
  state.character.conditions = kept;
  for (const def of DISEASES) {
    if (state.character.age < def.minAge || hasCondition(state, def.id)) continue;
    if (ctx.rng.chance(def.chance(state))) addCondition(state, def.id);
  }
}

// ---------------------------------------------------------------------------
// Generic action runner
// ---------------------------------------------------------------------------

interface Result {
  key: string;
  tone: LogTone;
  params?: Params;
}

function lifeAction(
  state: GameState,
  pool: ActionPool,
  titleKey: string,
  run: (s: GameState, rng: Rng, deltas: Delta[]) => Result,
): GameState {
  return transition(state, (s, rng) => {
    assertCanAct(s);
    if (inPrison(s) && pool !== 'personal') throw new EngineError('inPrison');
    spendAction(s, pool);
    const deltas: Delta[] = [];
    const out = run(s, rng, deltas);
    addLog(s, out.key, { tone: out.tone, params: out.params, deltas });
    setFeedback(s, { titleKey, textKey: out.key, textParams: out.params, deltas, tone: out.tone });
  });
}

export function seeDoctor(state: GameState, id: string): GameState {
  if (!hasCondition(state, id)) throw new EngineError('notSick');
  const cost = treatmentCost(state, id);
  if (state.character.money < cost) throw new EngineError('notEnoughMoney', { amount: { money: cost } });
  return lifeAction(state, 'personal', 'health.doctor', (s, rng, d) => {
    changeMoney(s, -cost, d);
    const def = DISEASE_MAP[id];
    const params = { disease: { t: `disease.${id}.name` } };
    if (def.cure > 0 && rng.chance(def.cure)) {
      s.character.conditions = conditionsOf(s).filter((c) => c.id !== id);
      changeStat(s, 'happiness', 4, d);
      return { key: 'log.health.cured', tone: 'good', params };
    }
    if (def.cure === 0) {
      s.character.conditions = conditionsOf(s).map((c) => (c.id === id ? { ...c, treated: true } : c));
      changeStat(s, 'health', 2, d);
      return { key: 'log.health.managed', tone: 'good', params };
    }
    return { key: 'log.health.notCured', tone: 'bad', params };
  });
}

export const SURGERY_COST = 6000;

export function plasticSurgery(state: GameState): GameState {
  if (state.character.age < 18) throw new EngineError('tooYoung');
  if (state.character.money < SURGERY_COST) throw new EngineError('notEnoughMoney', { amount: { money: SURGERY_COST } });
  return lifeAction(state, 'personal', 'health.surgery', (s, rng, d) => {
    changeMoney(s, -SURGERY_COST, d);
    addCounter(s, 'surgeries');
    if (rng.chance(0.85)) {
      changeStat(s, 'looks', 15, d);
      changeStat(s, 'happiness', 4, d);
      return { key: 'log.surgery.ok', tone: 'good' };
    }
    changeStat(s, 'looks', -10, d);
    changeStat(s, 'happiness', -6, d);
    changeStat(s, 'health', -3, d);
    return { key: 'log.surgery.fail', tone: 'bad' };
  });
}

// ---------------------------------------------------------------------------
// Gambling
// ---------------------------------------------------------------------------

export const LOTTERY_COST = 20;

export function playLottery(state: GameState): GameState {
  if (state.character.age < 18) throw new EngineError('tooYoung');
  if (state.character.money < LOTTERY_COST) throw new EngineError('notEnoughMoney', { amount: { money: LOTTERY_COST } });
  if ((state.actions.counts.lottery ?? 0) > 0) throw new EngineError('onceAYear');
  return lifeAction(state, 'personal', 'gamble.lottery', (s, rng, d) => {
    s.actions.counts.lottery = 1;
    changeMoney(s, -LOTTERY_COST, d);
    const roll = rng.next();
    const ratio = wageRatio(getCountry(s.character.country));
    if (roll < 0.0002) {
      changeMoney(s, Math.round(2_000_000 * ratio), d);
      changeStat(s, 'happiness', 20, d);
      setFlag(s, 'lottery_winner');
      return { key: 'log.lottery.jackpot', tone: 'milestone' };
    }
    if (roll < 0.06) {
      changeMoney(s, Math.round(200 * ratio), d);
      return { key: 'log.lottery.small', tone: 'good' };
    }
    return { key: 'log.lottery.lose', tone: 'neutral' };
  });
}

export function casinoBet(state: GameState): number {
  return Math.max(0, Math.min(state.character.money, 500));
}

export function goToCasino(state: GameState): GameState {
  if (state.character.age < 18) throw new EngineError('tooYoung');
  const bet = casinoBet(state);
  if (bet < 50) throw new EngineError('notEnoughMoney', { amount: { money: 50 } });
  return lifeAction(state, 'social', 'gamble.casino', (s, rng, d) => {
    addCounter(s, 'casinoVisits');
    const roll = rng.next();
    if (roll < 0.03) {
      changeMoney(s, bet * 10, d);
      changeStat(s, 'happiness', 10, d);
      return { key: 'log.casino.big', tone: 'good', params: { amount: { money: bet * 10 } } };
    }
    if (roll < 0.42) {
      changeMoney(s, bet, d);
      changeStat(s, 'happiness', 4, d);
      return { key: 'log.casino.win', tone: 'good', params: { amount: { money: bet } } };
    }
    changeMoney(s, -bet, d);
    changeStat(s, 'happiness', -3, d);
    if ((s.counters.casinoVisits ?? 0) >= 5 && !s.character.traits.includes('reckless') && rng.chance(0.2)) {
      s.character.traits.push('reckless');
      d.push({ key: 'delta.trait', params: { trait: { t: 'trait.reckless.name' } }, amount: 1 });
    }
    return { key: 'log.casino.lose', tone: 'bad', params: { amount: { money: bet } } };
  });
}

// ---------------------------------------------------------------------------
// Crime and prison
// ---------------------------------------------------------------------------

export interface CrimeDef {
  id: string;
  minAge: number;
  /** Base chance of success, raised by discipline-free daring and luck. */
  success: number;
  /** Loot in local price units. */
  loot: [number, number];
  /** Prison years if caught as an adult. */
  sentence: [number, number];
}

export const CRIMES: CrimeDef[] = [
  { id: 'shoplift', minAge: 12, success: 0.7, loot: [20, 150], sentence: [0, 1] },
  { id: 'pickpocket', minAge: 14, success: 0.6, loot: [50, 400], sentence: [1, 1] },
  { id: 'burglary', minAge: 16, success: 0.45, loot: [1000, 6000], sentence: [2, 4] },
  { id: 'fraud', minAge: 18, success: 0.4, loot: [5000, 30000], sentence: [3, 6] },
];

export function inPrison(state: GameState): boolean {
  return (state.character.prisonUntil ?? -1) > state.character.age;
}

export function commitCrime(state: GameState, id: string): GameState {
  const def = CRIMES.find((c) => c.id === id);
  if (!def) throw new EngineError('requirements');
  if (state.character.age < def.minAge) throw new EngineError('tooYoung');
  if (inPrison(state)) throw new EngineError('inPrison');
  return lifeAction(state, 'social', `crime.${id}.name`, (s, rng, d) => {
    addCounter(s, 'crimes');
    addCounter(s, 'risks');
    const c = s.character;
    const chance = clamp(def.success + (c.traits.includes('reckless') ? 0.05 : 0) + (c.stats.knowledge - 50) / 400, 0.1, 0.9);
    if (rng.chance(chance)) {
      const loot = Math.round(rng.int(def.loot[0], def.loot[1]) * wageRatio(getCountry(c.country)));
      changeMoney(s, loot, d);
      changeStat(s, 'happiness', 2, d);
      return { key: 'log.crime.ok', tone: 'neutral', params: { crime: { t: `crime.${id}.name` }, amount: { money: loot } } };
    }
    setFlag(s, 'criminal_record');
    changeStat(s, 'reputation', -10, d);
    for (const p of livingNpcs(s, 'parent')) changeBond(s, p, -8, d);
    const params: Params = { crime: { t: `crime.${id}.name` } };
    const years = c.age < 18 ? 0 : rng.int(def.sentence[0], def.sentence[1]);
    if (years <= 0) {
      changeStat(s, 'happiness', -5, d);
      return { key: 'log.crime.caught', tone: 'bad', params };
    }
    c.prisonUntil = c.age + years;
    loseJob(s, 'fired');
    if (s.education.enrolled) s.education.enrolled = null;
    changeStat(s, 'happiness', -12, d);
    params.years = years;
    return { key: 'log.crime.prison', tone: 'bad', params };
  });
}

/** While in prison: lower mood each year, and release when time is served. */
export function processPrisonYear(state: GameState, ctx: YearContext): void {
  const until = state.character.prisonUntil;
  if (until === undefined) return;
  if (state.character.age >= until) {
    delete state.character.prisonUntil;
    addLog(state, 'log.prison.released', { tone: 'milestone' });
    return;
  }
  changeStat(state, 'happiness', -6, ctx.deltas);
  changeStat(state, 'health', -1, ctx.deltas);
}

/** Good behaviour or a lawyer can shorten the sentence. */
export function prisonAppeal(state: GameState): GameState {
  if (!inPrison(state)) throw new EngineError('notInPrison');
  const cost = 3000;
  if (state.character.money < cost) throw new EngineError('notEnoughMoney', { amount: { money: cost } });
  return lifeAction(state, 'personal', 'prison.appeal', (s, rng, d) => {
    changeMoney(s, -cost, d);
    if (rng.chance(0.35)) {
      delete s.character.prisonUntil;
      return { key: 'log.prison.appealOk', tone: 'good' };
    }
    return { key: 'log.prison.appealFail', tone: 'bad' };
  });
}

// ---------------------------------------------------------------------------
// Emigration
// ---------------------------------------------------------------------------

export const EMIGRATION_COST = 4000;

export function emigrate(state: GameState, countryId: string): GameState {
  const target = COUNTRY_MAP[countryId];
  if (!target || countryId === state.character.country) throw new EngineError('requirements');
  if (state.character.age < 18) throw new EngineError('tooYoung');
  if (inPrison(state)) throw new EngineError('inPrison');
  if (state.character.money < EMIGRATION_COST) throw new EngineError('notEnoughMoney', { amount: { money: EMIGRATION_COST } });
  return lifeAction(state, 'social', 'emigrate.title', (s, rng, d) => {
    changeMoney(s, -EMIGRATION_COST, d);
    // Savings convert at the new country's price level.
    const from = getCountry(s.character.country);
    s.character.money = Math.round(s.character.money * (from.priceLevel * from.fx) / (target.priceLevel * target.fx));
    s.character.country = target.id;
    s.character.city = rng.pick(target.cities);
    loseJob(s, 'quit');
    if (s.finance.housing === 'family' || s.finance.housing === 'own') {
      if (s.finance.housing === 'own') {
        changeMoney(s, s.finance.homeValue - s.finance.mortgage, d);
        s.finance.homeValue = 0;
        s.finance.mortgage = 0;
        s.finance.mortgagePayment = 0;
      }
      s.finance.housing = 'rent_small';
    }
    for (const n of s.npcs) if (n.alive && n.relation !== 'partner' && n.relation !== 'spouse' && n.relation !== 'pet') n.bond = clamp(n.bond - 10);
    changeStat(s, 'happiness', 3, d);
    addCounter(s, 'emigrations');
    return { key: 'log.emigrate', tone: 'milestone', params: { country: { t: `country.${target.id}` }, city: s.character.city } };
  });
}

export { poolLeft };
