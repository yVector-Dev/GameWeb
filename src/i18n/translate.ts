import type { ParamValue, Params } from '../engine/types';
import { DICTIONARIES } from './locales';

export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
  { code: 'es', label: 'Español' },
] as const;

export type Locale = (typeof LOCALES)[number]['code'];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && LOCALES.some((l) => l.code === value);
}

/** Picks the best supported language from the browser preferences. */
export function detectLocale(languages: readonly string[] | undefined): Locale {
  for (const lang of languages ?? []) {
    const lower = lang.toLowerCase();
    if (lower.startsWith('pt')) return 'pt-BR';
    if (lower.startsWith('es')) return 'es';
    if (lower.startsWith('en')) return 'en';
  }
  return DEFAULT_LOCALE;
}

const missingReported = new Set<string>();
const pluralCache = new Map<Locale, Intl.PluralRules>();
const numberCache = new Map<Locale, Intl.NumberFormat>();

function pluralRules(locale: Locale): Intl.PluralRules {
  let rules = pluralCache.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(locale);
    pluralCache.set(locale, rules);
  }
  return rules;
}

export function formatNumber(locale: Locale, value: number): string {
  let fmt = numberCache.get(locale);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    numberCache.set(locale, fmt);
  }
  return fmt.format(value);
}

/** Currency of the life being played: real ISO code and display rate. */
let activeCurrency: { code: string; rate: number } | null = null;
const currencyCache = new Map<string, Intl.NumberFormat>();

/** Sets the currency used to display money (null = neutral ¤ symbol). */
export function setCurrency(code: string | null, rate = 1): void {
  activeCurrency = code ? { code, rate } : null;
}

/** Money formatted per language, in the real currency of the current country. */
export function formatMoney(locale: Locale, value: number, options: { signed?: boolean } = {}): string {
  let amount: string;
  if (activeCurrency) {
    const key = `${locale}|${activeCurrency.code}`;
    let fmt = currencyCache.get(key);
    if (!fmt) {
      fmt = new Intl.NumberFormat(locale, { style: 'currency', currency: activeCurrency.code, maximumFractionDigits: 0, minimumFractionDigits: 0 });
      currencyCache.set(key, fmt);
    }
    amount = fmt.format(Math.abs(Math.round(value * activeCurrency.rate)));
  } else {
    amount = translate(locale, 'format.money', { amount: formatNumber(locale, Math.abs(Math.round(value))) });
  }
  if (value < 0) return `−${amount}`;
  if (options.signed && value > 0) return `+${amount}`;
  return amount;
}

export function formatList(locale: Locale, items: string[], type: 'conjunction' | 'disjunction' = 'conjunction'): string {
  try {
    return new Intl.ListFormat(locale, { style: 'long', type }).format(items);
  } catch {
    return items.join(', ');
  }
}

function lookup(locale: Locale, key: string): string | undefined {
  return DICTIONARIES[locale][key] ?? DICTIONARIES[DEFAULT_LOCALE][key];
}

function exists(locale: Locale, key: string): boolean {
  return DICTIONARIES[locale][key] !== undefined || DICTIONARIES[DEFAULT_LOCALE][key] !== undefined;
}

function resolveKey(locale: Locale, key: string, params: Params | undefined, ctx: string | undefined): string {
  let base = key;
  if (ctx && exists(locale, `${key}_${ctx}`)) base = `${key}_${ctx}`;
  const count = params?.count;
  if (typeof count === 'number') {
    const rule = pluralRules(locale).select(count);
    if (exists(locale, `${base}_${rule}`)) return `${base}_${rule}`;
    if (exists(locale, `${base}_other`)) return `${base}_other`;
  }
  return base;
}

export function formatParam(locale: Locale, value: ParamValue): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return formatNumber(locale, value);
  if ('money' in value) return formatMoney(locale, value.money);
  return translate(locale, value.t, value.p, value.ctx);
}

/**
 * Translates a key with named parameters: "{name}". Falls back to English
 * and, as a last resort, returns the key itself (and reports it once).
 */
export function translate(locale: Locale, key: string, params?: Params, ctx?: string): string {
  const resolved = resolveKey(locale, key, params, ctx);
  const template = lookup(locale, resolved);
  if (template === undefined) {
    if (!missingReported.has(resolved)) {
      missingReported.add(resolved);
      if (typeof console !== 'undefined') console.warn(`[i18n] Missing translation key: ${resolved}`);
    }
    return key;
  }
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : formatParam(locale, value);
  });
}

/** Extracts the {placeholders} of a template (used by the key checker). */
export function placeholders(template: string): string[] {
  return Array.from(template.matchAll(/\{(\w+)\}/g), (m) => m[1]).sort();
}
