import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { ParamValue, Params } from '../engine/types';
import { formatList, formatMoney, formatNumber, formatParam, translate, type Locale } from '../i18n/translate';

export interface I18n {
  locale: Locale;
  t: (key: string, params?: Params, ctx?: string) => string;
  /** Renders a stored parameter (nested translation, money, number or text). */
  p: (value: ParamValue) => string;
  money: (value: number, options?: { signed?: boolean }) => string;
  num: (value: number) => string;
  list: (items: string[], type?: 'conjunction' | 'disjunction') => string;
  date: (iso: string) => string;
}

const I18nContext = createContext<I18n | null>(null);

export function makeI18n(locale: Locale): I18n {
  return {
    locale,
    t: (key, params, ctx) => translate(locale, key, params, ctx),
    p: (value) => formatParam(locale, value),
    money: (value, options) => formatMoney(locale, value, options),
    num: (value) => formatNumber(locale, value),
    list: (items, type) => formatList(locale, items, type),
    date: (iso) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '';
      return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
    },
  };
}

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo(() => makeI18n(locale), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
