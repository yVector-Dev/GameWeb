import { DEFAULT_LOCALE, isLocale, type Locale } from '../i18n/translate';
import { SLOT_COUNT } from './save';
import { type KeyValueStore, safeGet, safeSet } from './storage';

const SETTINGS_KEY = 'lifepaths:settings';

export interface Settings {
  locale: Locale;
  theme: 'dark' | 'light';
  reduceMotion: boolean;
  tutorialSeen: boolean;
  lastSlot: number | null;
}

export function defaultSettings(locale: Locale = DEFAULT_LOCALE): Settings {
  return { locale, theme: 'dark', reduceMotion: false, tutorialSeen: false, lastSlot: null };
}

/** Reads settings, falling back to defaults field by field. */
export function loadSettings(store: KeyValueStore | null, fallbackLocale: Locale): Settings {
  const base = defaultSettings(fallbackLocale);
  const res = safeGet(store, SETTINGS_KEY);
  if (!res.ok || !res.value) return base;
  try {
    const raw = JSON.parse(res.value) as Partial<Record<keyof Settings, unknown>>;
    return {
      locale: isLocale(raw.locale) ? raw.locale : base.locale,
      theme: raw.theme === 'light' ? 'light' : 'dark',
      reduceMotion: raw.reduceMotion === true,
      tutorialSeen: raw.tutorialSeen === true,
      lastSlot:
        typeof raw.lastSlot === 'number' && Number.isInteger(raw.lastSlot) && raw.lastSlot >= 1 && raw.lastSlot <= SLOT_COUNT
          ? raw.lastSlot
          : null,
    };
  } catch {
    return base;
  }
}

export function saveSettings(store: KeyValueStore | null, settings: Settings): boolean {
  return safeSet(store, SETTINGS_KEY, JSON.stringify(settings)).ok;
}
