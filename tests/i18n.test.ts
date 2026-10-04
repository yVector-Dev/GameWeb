import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS } from '../src/content/achievements';
import { ACTIVITIES } from '../src/content/activities';
import { CAREERS } from '../src/content/careers';
import { COURSES } from '../src/content/courses';
import { EVENTS } from '../src/content/events';
import { HOUSING, ITEMS } from '../src/content/items';
import { TITLES } from '../src/content/titles';
import { HOBBY_IDS, STAT_KEYS, TRAIT_IDS } from '../src/engine/types';
import { DICTIONARIES } from '../src/i18n/locales';
import { LOCALES, formatMoney, placeholders, translate, type Locale } from '../src/i18n/translate';

const en = DICTIONARIES.en;
const VARIANT = /^(.*)_(m|f|x|he|she|they|zero|one|two|few|many|other)$/;

function isVariantOfEnglish(key: string): boolean {
  const m = VARIANT.exec(key);
  if (!m) return false;
  const base = m[1];
  return en[base] !== undefined || en[`${base}_other`] !== undefined || Object.keys(en).some((k) => k.startsWith(`${base}_`));
}

/** Placeholders a key should accept: its own English entry, or its base's. */
function expectedPlaceholders(key: string): string[] | null {
  if (en[key] !== undefined) return placeholders(en[key]);
  const m = VARIANT.exec(key);
  if (m && en[m[1]] !== undefined) return placeholders(en[m[1]]);
  return null;
}

describe('translation keys', () => {
  for (const { code } of LOCALES) {
    if (code === 'en') continue;
    const dict = DICTIONARIES[code];

    it(`${code}: has every English key`, () => {
      const missing = Object.keys(en).filter((k) => dict[k] === undefined);
      expect(missing).toEqual([]);
    });

    it(`${code}: has no unknown keys`, () => {
      const extra = Object.keys(dict).filter((k) => en[k] === undefined && !isVariantOfEnglish(k));
      expect(extra).toEqual([]);
    });

    it(`${code}: uses the same {placeholders} as English`, () => {
      const mismatched: string[] = [];
      for (const [key, template] of Object.entries(dict)) {
        const expected = expectedPlaceholders(key);
        if (!expected) continue;
        const own = Array.from(new Set(placeholders(template))).sort();
        const want = Array.from(new Set(expected)).sort();
        // Plural forms may omit {count} (e.g. "one sibling").
        const ownNoCount = own.filter((p) => p !== 'count');
        const wantNoCount = want.filter((p) => p !== 'count');
        if (JSON.stringify(ownNoCount) !== JSON.stringify(wantNoCount)) mismatched.push(`${key}: ${own} vs ${want}`);
      }
      expect(mismatched).toEqual([]);
    });

    it(`${code}: has no empty strings`, () => {
      expect(Object.entries(dict).filter(([, v]) => v.trim() === '').map(([k]) => k)).toEqual([]);
    });
  }
});

describe('content is fully translatable', () => {
  const required: string[] = [];
  for (const e of EVENTS) {
    required.push(`ev.${e.id}.title`, `ev.${e.id}.text`);
    for (const c of e.choices ?? []) {
      required.push(`ev.${e.id}.c.${c.id}`);
      if (c.chance) required.push(`ev.${e.id}.r.${c.id}_ok`, `ev.${e.id}.r.${c.id}_fail`);
      else required.push(`ev.${e.id}.r.${c.id}`);
    }
  }
  for (const c of CAREERS) {
    required.push(`career.${c.id}.name`);
    c.levels.forEach((_, i) => required.push(`career.${c.id}.l${i}`));
  }
  for (const c of COURSES) required.push(`course.${c.id}.name`, `course.${c.id}.desc`, `courseKind.${c.kind}`);
  for (const a of ACTIVITIES) required.push(`activity.${a.id}.name`, `activity.${a.id}.desc`, `activity.${a.id}.log`);
  for (const i of ITEMS) {
    required.push(`item.${i.id}.name`, `item.${i.id}.desc`);
    if (i.consumable) required.push(`item.${i.id}.log`);
  }
  for (const h of Object.keys(HOUSING)) required.push(`housing.${h}.name`, `housing.${h}.desc`);
  for (const a of ACHIEVEMENTS) required.push(`ach.${a.id}.name`, `ach.${a.id}.desc`);
  for (const t of TITLES) required.push(`epithet.${t.id}.name`, `epithet.${t.id}.desc`);
  for (const t of TRAIT_IDS) required.push(`trait.${t}.name`, `trait.${t}.desc`);
  for (const h of HOBBY_IDS) required.push(`hobby.${h}`);
  for (const s of STAT_KEYS) required.push(`stat.${s}`, `statDesc.${s}`);
  for (const r of ['parent', 'sibling', 'grandparent', 'friend', 'partner', 'spouse', 'ex', 'child', 'mentor']) required.push(`rel.${r}`);
  for (const c of ['illness', 'heart', 'oldAge', 'accident', 'sudden']) required.push(`death.${c}`);

  it('every event, career, course, item, achievement and title has text', () => {
    expect(required.filter((k) => en[k] === undefined)).toEqual([]);
  });

  it('every event has the full set of texts and nothing left over', () => {
    const eventKeys = Object.keys(en).filter((k) => k.startsWith('ev.') && !k.startsWith('ev.generic.'));
    const expected = new Set(required.filter((k) => k.startsWith('ev.')));
    expect(eventKeys.filter((k) => !expected.has(k))).toEqual([]);
  });
});

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      // Locales define keys; persistence uses dotted paths for error messages, not keys.
      if (name !== 'locales' && name !== 'persistence') out.push(...sourceFiles(path));
    } else if (/\.(ts|tsx)$/.test(name)) {
      out.push(path);
    }
  }
  return out;
}

describe('keys used in source code exist', () => {
  it('finds every literal translation key in English', () => {
    const namespaces = new Set(Object.keys(en).map((k) => k.split('.')[0]));
    const keys = Object.keys(en);
    const problems: string[] = [];
    for (const file of sourceFiles(join(__dirname, '../src'))) {
      const text = readFileSync(file, 'utf8');
      for (const m of text.matchAll(/['"`]([a-zA-Z]+(?:\.[A-Za-z0-9_]+)+)['"`]/g)) {
        const key = m[1];
        const ns = key.split('.')[0];
        if (!namespaces.has(ns)) continue;
        const ok = en[key] !== undefined || keys.some((k) => k.startsWith(`${key}_`) || k.startsWith(`${key}.`));
        if (!ok) problems.push(`${file.split('/src/')[1]}: ${key}`);
      }
    }
    expect(problems).toEqual([]);
  });
});

describe('translation runtime', () => {
  it('falls back to English, then to the key', () => {
    const fake = 'tests.only.key';
    expect(translate('pt-BR', fake)).toBe(fake);
    expect(translate('es', 'app.name')).toBe('LifePaths');
  });

  it('picks plural forms and grammatical variants', () => {
    expect(translate('en', 'common.years', { count: 1 })).toBe('1 year');
    expect(translate('en', 'common.years', { count: 3 })).toBe('3 years');
    expect(translate('pt-BR', 'common.years', { count: 1 })).toBe('1 ano');
    expect(translate('es', 'common.years', { count: 2 })).toBe('2 años');
    expect(translate('es', 'common.years', { count: 1000000 })).toContain('años');
    expect(translate('pt-BR', 'rel.parent', undefined, 'f')).toBe('Mãe');
    expect(translate('pt-BR', 'rel.friend', undefined, 'x')).toBe('Pessoa amiga');
    expect(translate('es', 'career.nursing.l1', undefined, 'f')).toBe('Enfermera');
    expect(translate('en', 'career.nursing.l1', undefined, 'f')).toBe('Registered Nurse');
  });

  it('formats numbers and money per language', () => {
    const results: Record<Locale, string> = { en: formatMoney('en', 1234567), 'pt-BR': formatMoney('pt-BR', 1234567), es: formatMoney('es', 1234567) };
    expect(results.en).toBe('¤1,234,567');
    expect(results['pt-BR']).toBe('¤ 1.234.567');
    expect(results.es).toBe('1.234.567 ¤');
    expect(formatMoney('en', -300)).toBe('−¤300');
    expect(translate('en', 'ledger.salary', { job: { t: 'career.it.l1' } })).toBe('Salary: Software Developer');
  });
});
