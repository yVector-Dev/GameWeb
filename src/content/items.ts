import type { Condition, Housing, StatKey } from '../engine/types';

// Purchases and housing options. Labels: `item.<id>.name` / `item.<id>.desc`,
// `housing.<id>.name` / `housing.<id>.desc`.

export interface ItemDef {
  id: string;
  price: number;
  minAge: number;
  /** One-time attribute change, granted only the first time the item is bought. */
  firstBuy?: Partial<Record<StatKey, number>>;
  /** Yearly cost while owned. */
  upkeep?: number;
  /** Fraction of the price recovered when sold; undefined = cannot be sold. */
  resale?: number;
  /** Consumed immediately instead of owned (e.g. a vacation), once per year. */
  consumable?: boolean;
  requires?: Condition[];
}

export const ITEMS: ItemDef[] = [
  { id: 'bike', price: 400, minAge: 8, firstBuy: { happiness: 3, health: 2 }, resale: 0.3 },
  { id: 'computer', price: 1200, minAge: 12, firstBuy: { knowledge: 2 }, resale: 0.3 },
  { id: 'instrument', price: 900, minAge: 10, firstBuy: { happiness: 3 }, resale: 0.4 },
  { id: 'gym', price: 0, minAge: 16, upkeep: 700, resale: 0 },
  {
    id: 'used_car',
    price: 6500,
    minAge: 18,
    firstBuy: { happiness: 4 },
    upkeep: 1500,
    resale: 0.45,
    requires: [{ type: 'flag', flag: 'license' }, { type: 'asset', asset: 'new_car', not: true }],
  },
  {
    id: 'new_car',
    price: 28000,
    minAge: 18,
    firstBuy: { happiness: 7, reputation: 3 },
    upkeep: 2500,
    resale: 0.55,
    requires: [{ type: 'flag', flag: 'license' }, { type: 'asset', asset: 'used_car', not: true }],
  },
  { id: 'wardrobe', price: 2200, minAge: 16, firstBuy: { social: 3, reputation: 2 } },
  { id: 'vacation', price: 2800, minAge: 18, firstBuy: { happiness: 10, health: 3 }, consumable: true },
];

export const ITEM_MAP: Record<string, ItemDef> = Object.fromEntries(ITEMS.map((i) => [i.id, i]));

export interface HousingDef {
  id: Housing;
  minAge: number;
  /** Yearly rent (0 for family or owned homes). */
  rent: number;
  /** Food, utilities and everyday costs per year. */
  living: number;
  /** Yearly happiness effect of living here. */
  happiness: number;
  movingCost: number;
}

export const HOUSING: Record<Housing, HousingDef> = {
  family: { id: 'family', minAge: 0, rent: 0, living: 4500, happiness: 0, movingCost: 0 },
  rent_small: { id: 'rent_small', minAge: 18, rent: 9000, living: 6000, happiness: 0, movingCost: 600 },
  rent_nice: { id: 'rent_nice', minAge: 18, rent: 18000, living: 8000, happiness: 2, movingCost: 900 },
  own: { id: 'own', minAge: 21, rent: 0, living: 7000, happiness: 3, movingCost: 1500 },
};

export const HOME_PRICE = 180000;
export const DOWN_PAYMENT_SHARE = 0.2;
export const MORTGAGE_YEARS = 25;
export const MORTGAGE_RATE = 0.04;
export const HOME_UPKEEP = 3000;
export const HOME_APPRECIATION = 0.02;
export const DEBT_RATE = 0.12;
export const STUDENT_DEBT_RATE = 0.03;
export const CHILD_COST = 4000;
