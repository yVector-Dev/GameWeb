import {
  CHILD_COST,
  DEBT_RATE,
  DOWN_PAYMENT_SHARE,
  HOME_APPRECIATION,
  HOME_PRICE,
  HOME_UPKEEP,
  HOUSING,
  ITEM_MAP,
  MORTGAGE_RATE,
  MORTGAGE_YEARS,
  STUDENT_DEBT_RATE,
} from '../content/items';
import { getCountry, wageRatio } from '../content/countries';
import { checkAll, describeRequirements, type RequirementStatus } from './conditions';
import {
  EngineError,
  addCounter,
  addLog,
  changeMoney,
  changeStat,
  hasFlag,
  livingNpcs,
  netWorth,
  npcAge,
  setFeedback,
  setFlag,
  transition,
} from './core';
import type { YearContext } from './context';
import { pensionFor } from './career';
import { assertCanAct } from './guards';
import type { Delta, GameState, Housing, LedgerLine } from './types';
import { STAT_KEYS } from './types';

export const GIFT_AT_18 = { struggling: 0, modest: 1000, comfortable: 5000, wealthy: 20000 } as const;
/** Minimum yearly income guaranteed to adults (a simple social safety net). */
export const SOCIAL_SUPPORT = 4000;
/** Share of net income above LIFESTYLE_THRESHOLD spent on a higher standard of living. */
export const LIFESTYLE_SHARE = 0.4;
export const LIFESTYLE_THRESHOLD = 15000;
/** Years between possible bankruptcies. */
export const BANKRUPTCY_COOLDOWN = 7;

/** Progressive income tax used for salary and pension. */
export function incomeTax(gross: number): number {
  const brackets: [number, number][] = [
    [10000, 0],
    [50000, 0.2],
    [100000, 0.3],
    [Infinity, 0.4],
  ];
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of brackets) {
    if (gross <= lower) break;
    tax += (Math.min(gross, upper) - lower) * rate;
    lower = upper;
  }
  return Math.round(tax);
}

export function mortgagePaymentFor(principal: number): number {
  const r = MORTGAGE_RATE;
  const n = MORTGAGE_YEARS;
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -n)));
}

export function dependentChildren(state: GameState): number {
  return livingNpcs(state, 'child').filter((c) => !c.independent && npcAge(state, c) < 18).length;
}

/** Expected yearly expenses with the current situation (shown in the UI). */
export function projectedExpenses(state: GameState): LedgerLine[] {
  const lines: LedgerLine[] = [];
  const f = state.finance;
  const adult = state.character.age >= 18;
  const housing = HOUSING[f.housing];
  if (adult) {
    if (housing.rent > 0) lines.push({ key: 'ledger.rent', amount: housing.rent });
    lines.push({ key: 'ledger.living', amount: housing.living });
  }
  if (f.housing === 'own') {
    lines.push({ key: 'ledger.homeUpkeep', amount: HOME_UPKEEP });
    if (f.mortgage > 0) lines.push({ key: 'ledger.mortgage', amount: Math.min(f.mortgagePayment, Math.round(f.mortgage * (1 + MORTGAGE_RATE))) });
  }
  for (const asset of f.assets) {
    const upkeep = ITEM_MAP[asset]?.upkeep;
    if (upkeep) lines.push({ key: 'ledger.upkeep', params: { item: { t: `item.${asset}.name` } }, amount: upkeep });
  }
  const kids = dependentChildren(state);
  if (kids > 0) lines.push({ key: 'ledger.children', params: { count: kids }, amount: kids * CHILD_COST });
  if (f.studentDebt > 0 && !state.education.enrolled) {
    lines.push({ key: 'ledger.studentLoan', amount: studentLoanPayment(state) });
  }
  return lines;
}

function studentLoanPayment(state: GameState): number {
  const balance = Math.round(state.finance.studentDebt * (1 + STUDENT_DEBT_RATE));
  return Math.min(balance, Math.max(1500, Math.round(balance * 0.08)));
}

/**
 * Applies one year of income and expenses. Guarded by lastProcessedAge so the
 * same year can never be charged or paid twice.
 */
export function processFinanceYear(state: GameState, ctx: YearContext): boolean {
  const f = state.finance;
  const c = state.character;
  if (f.lastProcessedAge >= c.age) return false;
  f.lastProcessedAge = c.age;

  const income: LedgerLine[] = [...ctx.income];
  const pension = pensionFor(state);
  if (pension > 0) income.push({ key: 'ledger.pension', amount: pension });
  if (c.age === 18) {
    const gift = Math.round(GIFT_AT_18[c.background] * wageRatio(getCountry(c.country)));
    if (gift > 0 && livingNpcs(state, 'parent').length > 0) {
      income.push({ key: 'ledger.familyGift', amount: gift });
      addLog(state, 'log.finance.gift', { tone: 'good', params: { amount: { money: gift } } });
    }
  }

  const taxable = income.filter((l) => l.key === 'ledger.salary' || l.key === 'ledger.pension').reduce((a, l) => a + l.amount, 0);
  // Adults with little or no income receive a basic, untaxed top-up.
  const support = Math.round(SOCIAL_SUPPORT * getCountry(c.country).safetyNet);
  if (c.age >= 18 && taxable < support) {
    income.push({ key: 'ledger.support', amount: support - taxable });
  }
  const expenses: LedgerLine[] = [...ctx.expenses];
  const tax = Math.round(incomeTax(taxable) * getCountry(c.country).tax);
  if (tax > 0) expenses.push({ key: 'ledger.tax', amount: tax });
  // Higher incomes come with higher everyday spending.
  const lifestyle = c.age >= 18 ? Math.round(LIFESTYLE_SHARE * Math.max(0, taxable - tax - LIFESTYLE_THRESHOLD)) : 0;
  if (lifestyle > 0) expenses.push({ key: 'ledger.lifestyle', amount: lifestyle });

  // Student loan: interest accrues; repayments start after studies.
  if (f.studentDebt > 0) {
    f.studentDebt = Math.round(f.studentDebt * (1 + STUDENT_DEBT_RATE));
  }
  for (const line of projectedExpenses(state)) {
    expenses.push(line);
    if (line.key === 'ledger.studentLoan') f.studentDebt = Math.max(0, f.studentDebt - line.amount);
    if (line.key === 'ledger.mortgage') {
      const interest = Math.round(f.mortgage * MORTGAGE_RATE);
      f.mortgage = Math.max(0, f.mortgage + interest - line.amount);
      if (f.mortgage === 0) addLog(state, 'log.finance.mortgagePaid', { tone: 'milestone' });
    }
  }
  if (f.homeValue > 0) f.homeValue = Math.round(f.homeValue * (1 + HOME_APPRECIATION));

  const totalIn = income.reduce((a, l) => a + l.amount, 0);
  const totalOut = expenses.reduce((a, l) => a + l.amount, 0);
  const net = totalIn - totalOut;
  changeMoney(state, net);

  // Consumer debt grows with interest and is repaid from savings when possible.
  if (f.debt > 0) f.debt = Math.round(f.debt * (1 + DEBT_RATE));
  if (c.money < 0) {
    const shortfall = -c.money;
    f.debt += shortfall;
    c.money = 0;
    addLog(state, 'log.finance.shortfall', { tone: 'bad', params: { amount: { money: shortfall } } });
  } else if (f.debt > 0 && c.money > 0) {
    const pay = Math.min(c.money, f.debt);
    c.money -= pay;
    f.debt -= pay;
    if (f.debt === 0) {
      addLog(state, 'log.finance.debtCleared', { tone: 'good' });
      if ((state.counters.peakDebt ?? 0) >= 10000) setFlag(state, 'debt_free');
    }
  }
  state.counters.peakDebt = Math.max(state.counters.peakDebt ?? 0, f.debt);

  if (f.debt > 0) {
    f.debtYears += 1;
    changeStat(state, 'happiness', -3, ctx.deltas);
    applyDebtPressure(state, totalIn);
  } else {
    f.debtYears = 0;
  }

  f.lastLedger = { age: c.age, income: totalIn, expenses: totalOut, net, lines: [...income, ...expenses.map((l) => ({ ...l, amount: -l.amount }))] };
  if (totalIn > 0 || totalOut > 0) {
    addLog(state, 'log.finance.year', {
      params: { income: { money: totalIn }, expenses: { money: totalOut }, net: { money: net } },
    });
  }
  const worth = netWorth(state);
  if (worth > state.peaks.netWorth) state.peaks.netWorth = worth;
  return true;
}

/** Explicit consequences of debt that keeps growing. */
function applyDebtPressure(state: GameState, yearlyIncome: number): void {
  const f = state.finance;
  const limit = Math.max(15000, yearlyIncome * 1.5);
  if (f.debt <= limit || f.debtYears < 2) return;

  const car = f.assets.find((a) => a === 'new_car' || a === 'used_car');
  if (car) {
    const value = Math.round(ITEM_MAP[car].price * (ITEM_MAP[car].resale ?? 0));
    f.assets = f.assets.filter((a) => a !== car);
    f.debt = Math.max(0, f.debt - value);
    addLog(state, 'log.finance.carRepossessed', { tone: 'bad', params: { item: { t: `item.${car}.name` } } });
    return;
  }
  if (f.housing === 'own') {
    const equity = f.homeValue - f.mortgage;
    f.homeValue = 0;
    f.mortgage = 0;
    f.mortgagePayment = 0;
    const leftover = equity - f.debt;
    if (leftover >= 0) {
      f.debt = 0;
      changeMoney(state, leftover);
    } else {
      f.debt = -leftover;
    }
    f.housing = 'rent_small';
    addLog(state, 'log.finance.foreclosure', { tone: 'bad' });
    return;
  }
  if (f.housing === 'rent_nice') {
    f.housing = 'rent_small';
    addLog(state, 'log.finance.downsized', { tone: 'bad' });
    return;
  }
  if (f.housing === 'rent_small' && livingNpcs(state, 'parent').length > 0) {
    f.housing = 'family';
    addLog(state, 'log.finance.movedHome', { tone: 'bad' });
    return;
  }
  // Nothing left to sell: as a last resort the debt is discharged, at a cost.
  const last = state.counters.lastBankruptcyAge;
  if (f.debtYears >= 4 && (last === undefined || state.character.age - last >= BANKRUPTCY_COOLDOWN)) {
    const amount = f.debt;
    f.debt = 0;
    f.debtYears = 0;
    state.counters.lastBankruptcyAge = state.character.age;
    setFlag(state, 'bankrupt');
    changeStat(state, 'reputation', -10);
    changeStat(state, 'happiness', -8);
    addLog(state, 'log.finance.bankruptcy', { tone: 'bad', params: { amount: { money: amount } } });
  }
}

// ---------------------------------------------------------------------------
// Player operations: purchases, housing, debt
// ---------------------------------------------------------------------------

export interface PurchaseCheck {
  ok: boolean;
  reason?: string;
  requirements: RequirementStatus[];
  owned: boolean;
}

export function checkPurchase(state: GameState, itemId: string): PurchaseCheck {
  const item = ITEM_MAP[itemId];
  if (!item) throw new EngineError('unknownItem');
  const requirements = describeRequirements(state, item.requires);
  const owned = state.finance.assets.includes(itemId);
  const base = { requirements, owned };
  if (owned) return { ...base, ok: false, reason: 'error.owned' };
  if (state.character.age < item.minAge) return { ...base, ok: false, reason: 'error.tooYoung' };
  if (item.consumable && state.finance.boughtThisYear.includes(itemId)) return { ...base, ok: false, reason: 'error.onceAYear' };
  if (!checkAll(state, item.requires)) return { ...base, ok: false, reason: 'error.requirements' };
  if (state.character.money < item.price) return { ...base, ok: false, reason: 'error.notEnoughMoney' };
  return { ...base, ok: true };
}

export function buyItem(state: GameState, itemId: string): GameState {
  return transition(state, (s) => {
    assertCanAct(s, { needAction: false });
    const check = checkPurchase(s, itemId);
    if (!check.ok) throw new EngineError((check.reason ?? 'error.requirements').replace(/^error\./, ''));
    const item = ITEM_MAP[itemId];
    const deltas: Delta[] = [];
    changeMoney(s, -item.price, deltas);
    const firstTime = !hasFlag(s, `bought_${itemId}`);
    if (item.firstBuy && (firstTime || item.consumable)) {
      for (const stat of STAT_KEYS) {
        const amount = item.firstBuy[stat];
        if (amount) changeStat(s, stat, amount, deltas);
      }
    }
    setFlag(s, `bought_${itemId}`);
    if (item.consumable) s.finance.boughtThisYear.push(itemId);
    if (itemId === 'vacation') addCounter(s, 'trips');
    else s.finance.assets.push(itemId);
    const params = { item: { t: `item.${itemId}.name` } };
    addLog(s, item.consumable ? `item.${itemId}.log` : 'log.purchase', { tone: 'good', params, deltas });
    setFeedback(s, { titleKey: 'feedback.bought', titleParams: params, deltas, tone: 'good' });
  });
}

export function sellItem(state: GameState, itemId: string): GameState {
  return transition(state, (s) => {
    assertCanAct(s, { needAction: false });
    const item = ITEM_MAP[itemId];
    if (!item || !s.finance.assets.includes(itemId)) throw new EngineError('notOwned');
    const value = Math.round(item.price * (item.resale ?? 0));
    s.finance.assets = s.finance.assets.filter((a) => a !== itemId);
    const deltas: Delta[] = [];
    changeMoney(s, value, deltas);
    const params = { item: { t: `item.${itemId}.name` } };
    addLog(s, value > 0 ? 'log.sold' : 'log.cancelled', { params, deltas });
    setFeedback(s, { titleKey: value > 0 ? 'feedback.sold' : 'feedback.cancelled', titleParams: params, deltas, tone: 'neutral' });
  });
}

export interface HousingCheck {
  ok: boolean;
  reason?: string;
  cost: number;
}

export function homeDownPayment(): number {
  return Math.round(HOME_PRICE * DOWN_PAYMENT_SHARE);
}

export function checkHousing(state: GameState, housing: Housing): HousingCheck {
  const def = HOUSING[housing];
  const f = state.finance;
  const cost = housing === 'own' ? homeDownPayment() + def.movingCost : def.movingCost;
  if (f.housing === housing) return { ok: false, reason: 'error.alreadyHere', cost };
  if (state.character.age < def.minAge) return { ok: false, reason: 'error.tooYoung', cost };
  if (housing === 'family' && livingNpcs(state, 'parent').length === 0) return { ok: false, reason: 'error.noFamilyHome', cost };
  if (housing === 'own') {
    if (!state.career.job && !state.career.retired) return { ok: false, reason: 'error.needIncome', cost };
    if (f.debt > 0) return { ok: false, reason: 'error.hasDebt', cost };
  }
  if (state.character.money < cost) return { ok: false, reason: 'error.notEnoughMoney', cost };
  return { ok: true, cost };
}

export function changeHousing(state: GameState, housing: Housing): GameState {
  return transition(state, (s) => {
    assertCanAct(s, { needAction: false });
    const check = checkHousing(s, housing);
    if (!check.ok) throw new EngineError((check.reason ?? 'error.requirements').replace(/^error\./, ''));
    const f = s.finance;
    const deltas: Delta[] = [];
    // Leaving an owned home sells it.
    if (f.housing === 'own' && housing !== 'own') {
      const equity = f.homeValue - f.mortgage;
      changeMoney(s, equity, deltas);
      addLog(s, 'log.housing.sold', { params: { amount: { money: equity } } });
      f.homeValue = 0;
      f.mortgage = 0;
      f.mortgagePayment = 0;
    }
    changeMoney(s, -HOUSING[housing].movingCost, deltas);
    if (housing === 'own') {
      const down = homeDownPayment();
      changeMoney(s, -down, deltas);
      f.homeValue = HOME_PRICE;
      f.mortgage = HOME_PRICE - down;
      f.mortgagePayment = mortgagePaymentFor(f.mortgage);
      setFlag(s, 'homeowner');
      changeStat(s, 'happiness', 6, deltas);
    }
    f.housing = housing;
    const params = { place: { t: `housing.${housing}.name` } };
    addLog(s, housing === 'own' ? 'log.housing.bought' : 'log.housing.moved', { tone: housing === 'own' ? 'milestone' : 'neutral', params, deltas });
    setFeedback(s, { titleKey: 'feedback.moved', titleParams: params, deltas, tone: 'good' });
  });
}

export function payDebt(state: GameState, kind: 'debt' | 'studentDebt' | 'mortgage'): GameState {
  return transition(state, (s) => {
    assertCanAct(s, { needAction: false });
    const f = s.finance;
    const balance = f[kind];
    if (balance <= 0) throw new EngineError('noDebt');
    const pay = Math.min(balance, s.character.money);
    if (pay <= 0) throw new EngineError('notEnoughMoney', { amount: { money: 1 } });
    const deltas: Delta[] = [];
    changeMoney(s, -pay, deltas);
    f[kind] = balance - pay;
    if (kind === 'mortgage' && f.mortgage === 0) f.mortgagePayment = 0;
    if (kind === 'debt' && f.debt === 0 && (s.counters.peakDebt ?? 0) >= 10000) setFlag(s, 'debt_free');
    addLog(s, 'log.finance.paid', { params: { amount: { money: pay }, kind: { t: `debtKind.${kind}` } }, deltas });
    setFeedback(s, { titleKey: 'feedback.paid', titleParams: { amount: { money: pay } }, deltas, tone: 'good' });
  });
}
