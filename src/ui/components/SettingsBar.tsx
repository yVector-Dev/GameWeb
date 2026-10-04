import { useId } from 'react';
import type { Locale } from '../../i18n/translate';
import { useI18n } from '../i18n';
import { LanguageSelect, ThemeToggle } from './Bits';

export interface SettingsProps {
  locale: Locale;
  theme: 'dark' | 'light';
  reduceMotion: boolean;
  onLocale: (locale: Locale) => void;
  onTheme: (theme: 'dark' | 'light') => void;
  onMotion: (reduce: boolean) => void;
}

/** Language, theme and motion controls, usable on every screen. */
export function SettingsBar({ settings, showMotion = true }: { settings: SettingsProps; showMotion?: boolean }) {
  const { t } = useI18n();
  const id = useId();
  return (
    <div className="settings-bar">
      <LanguageSelect id={`${id}-lang`} value={settings.locale} onChange={settings.onLocale} />
      <ThemeToggle theme={settings.theme} onChange={settings.onTheme} />
      {showMotion && (
        <label className="check">
          <input type="checkbox" checked={settings.reduceMotion} onChange={(e) => settings.onMotion(e.target.checked)} />
          <span>{t('settings.motion')}</span>
        </label>
      )}
    </div>
  );
}
