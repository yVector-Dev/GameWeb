// Real countries with approximate economic conditions (2024-2025 figures,
// rounded). Internally every amount is expressed in "local price units": a
// price is what something costs at that country's price level. On screen,
// amounts are converted to the real currency with `priceLevel * fx`.
//
// Difficulty comes from the ratios: wages relative to prices, the safety
// net, tuition, taxes, healthcare (mortality) and the job market.

export type Difficulty = 'easy' | 'normal' | 'hard' | 'veryHard';

export interface CountryDef {
  /** ISO 3166-1 alpha-2 code (country name comes from Intl.DisplayNames). */
  id: string;
  /** ISO 4217 currency code. */
  currency: string;
  /** Approximate exchange rate: local currency per US dollar. */
  fx: number;
  /** Price level relative to the US (1 = US prices). */
  priceLevel: number;
  /** Wages relative to the US, in dollars. */
  wageLevel: number;
  /** Social support and state pension relative to the US baseline. */
  safetyNet: number;
  /** Multiplier on university and course tuition. */
  tuition: number;
  /** Multiplier on income tax. */
  tax: number;
  /** Multiplier on the yearly chance of dying (healthcare, safety). */
  mortality: number;
  /** Added to hiring chances, in percentage points. */
  jobMarket: number;
  difficulty: Difficulty;
  weight: number;
  cities: string[];
}

export const COUNTRIES: CountryDef[] = [
  { id: 'US', currency: 'USD', fx: 1, priceLevel: 1, wageLevel: 1, safetyNet: 0.7, tuition: 1.6, tax: 1, mortality: 1.05, jobMarket: 3, difficulty: 'normal', weight: 10, cities: ['Chicago', 'Denver', 'Atlanta', 'Seattle'] },
  { id: 'CA', currency: 'CAD', fx: 1.37, priceLevel: 0.88, wageLevel: 0.88, safetyNet: 1.1, tuition: 0.7, tax: 1.1, mortality: 0.9, jobMarket: 2, difficulty: 'easy', weight: 6, cities: ['Toronto', 'Montreal', 'Calgary'] },
  { id: 'GB', currency: 'GBP', fx: 0.79, priceLevel: 0.88, wageLevel: 0.82, safetyNet: 1.1, tuition: 1, tax: 1.1, mortality: 0.93, jobMarket: 1, difficulty: 'normal', weight: 7, cities: ['Manchester', 'Bristol', 'Leeds'] },
  { id: 'DE', currency: 'EUR', fx: 0.92, priceLevel: 0.82, wageLevel: 0.88, safetyNet: 1.4, tuition: 0.1, tax: 1.25, mortality: 0.93, jobMarket: 3, difficulty: 'easy', weight: 7, cities: ['Hamburg', 'Cologne', 'Leipzig'] },
  { id: 'ES', currency: 'EUR', fx: 0.92, priceLevel: 0.65, wageLevel: 0.55, safetyNet: 1, tuition: 0.2, tax: 1.1, mortality: 0.85, jobMarket: -8, difficulty: 'normal', weight: 7, cities: ['Valencia', 'Sevilla', 'Bilbao'] },
  { id: 'PT', currency: 'EUR', fx: 0.92, priceLevel: 0.6, wageLevel: 0.42, safetyNet: 0.8, tuition: 0.2, tax: 1.15, mortality: 0.9, jobMarket: -5, difficulty: 'hard', weight: 6, cities: ['Porto', 'Coimbra', 'Braga'] },
  { id: 'JP', currency: 'JPY', fx: 150, priceLevel: 0.7, wageLevel: 0.6, safetyNet: 1, tuition: 0.6, tax: 1.05, mortality: 0.8, jobMarket: 5, difficulty: 'normal', weight: 6, cities: ['Osaka', 'Sapporo', 'Fukuoka'] },
  { id: 'BR', currency: 'BRL', fx: 5.5, priceLevel: 0.45, wageLevel: 0.25, safetyNet: 0.5, tuition: 0.5, tax: 1, mortality: 1.2, jobMarket: -8, difficulty: 'hard', weight: 12, cities: ['Recife', 'Belo Horizonte', 'Curitiba', 'Salvador'] },
  { id: 'MX', currency: 'MXN', fx: 18, priceLevel: 0.45, wageLevel: 0.22, safetyNet: 0.3, tuition: 0.4, tax: 0.9, mortality: 1.2, jobMarket: -5, difficulty: 'hard', weight: 9, cities: ['Guadalajara', 'Monterrey', 'Puebla'] },
  { id: 'AR', currency: 'ARS', fx: 1000, priceLevel: 0.45, wageLevel: 0.14, safetyNet: 0.35, tuition: 0.1, tax: 1.15, mortality: 1.15, jobMarket: -12, difficulty: 'veryHard', weight: 7, cities: ['Córdoba', 'Rosario', 'Mendoza'] },
  { id: 'IN', currency: 'INR', fx: 84, priceLevel: 0.25, wageLevel: 0.08, safetyNet: 0.15, tuition: 0.3, tax: 0.8, mortality: 1.35, jobMarket: -10, difficulty: 'veryHard', weight: 7, cities: ['Pune', 'Jaipur', 'Kochi'] },
  { id: 'NG', currency: 'NGN', fx: 1500, priceLevel: 0.3, wageLevel: 0.06, safetyNet: 0.05, tuition: 0.3, tax: 0.8, mortality: 1.7, jobMarket: -15, difficulty: 'veryHard', weight: 6, cities: ['Lagos', 'Ibadan', 'Abuja'] },
];

export const COUNTRY_MAP: Record<string, CountryDef> = Object.fromEntries(COUNTRIES.map((c) => [c.id, c]));

/** Old saves without a country behave like the original game (US-like). */
export const DEFAULT_COUNTRY = 'US';

export function getCountry(id: string | undefined): CountryDef {
  return COUNTRY_MAP[id ?? DEFAULT_COUNTRY] ?? COUNTRY_MAP[DEFAULT_COUNTRY];
}

/** Wages measured in local price units (purchasing power relative to the US). */
export function wageRatio(country: CountryDef): number {
  return country.wageLevel / country.priceLevel;
}

/** Local currency per internal unit, for display. */
export function displayRate(country: CountryDef): number {
  return country.priceLevel * country.fx;
}
