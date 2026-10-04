import type { Requirement, RequirementStatus } from '../../engine/conditions';
import type { Delta, LogTone, StatKey } from '../../engine/types';
import { LOCALES, type Locale } from '../../i18n/translate';
import { useI18n } from '../i18n';

/** "Knowledge +4", "Money −¤300": short, colored change chips. */
export function DeltaList({ deltas, compact = false }: { deltas: Delta[]; compact?: boolean }) {
  const { t, money, num } = useI18n();
  if (deltas.length === 0) return null;
  return (
    <ul className={`deltas${compact ? ' deltas--compact' : ''}`}>
      {deltas.map((d, i) => {
        const label = t(d.key, d.params);
        const value = d.money ? money(d.amount, { signed: true }) : `${d.amount > 0 ? '+' : '−'}${num(Math.abs(d.amount))}`;
        // A debt increase is bad even though the number goes up.
        const good = d.key === 'delta.debt' ? d.amount < 0 : d.amount > 0;
        return (
          <li key={`${d.key}-${i}`} className={`delta ${good ? 'delta--up' : 'delta--down'}`}>
            {d.key === 'delta.trait' ? label : t('format.delta', { label, value })}
          </li>
        );
      })}
    </ul>
  );
}

export function StatBar({ stat, value }: { stat: StatKey; value: number }) {
  const { t, num } = useI18n();
  const level = value >= 70 ? 'high' : value >= 35 ? 'mid' : 'low';
  return (
    <div className="stat" title={t(`statDesc.${stat}`)}>
      <div className="stat__row">
        <span className="stat__label">{t(`stat.${stat}`)}</span>
        <span className="stat__value">{num(value)}</span>
      </div>
      <div
        className={`meter meter--${level}`}
        role="meter"
        aria-label={t(`stat.${stat}`)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <div className="meter__fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function Meter({ value, label }: { value: number; label: string }) {
  const level = value >= 70 ? 'high' : value >= 35 ? 'mid' : 'low';
  return (
    <div className={`meter meter--${level}`} role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)}>
      <div className="meter__fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function requirementText(req: Requirement, t: ReturnType<typeof useI18n>['t'], list: ReturnType<typeof useI18n>['list']): string {
  if ('anyOf' in req) return list(req.anyOf.map((r) => requirementText(r, t, list)), 'disjunction');
  return t(req.key, req.params);
}

/** Lists requirements, marking the unmet ones. */
export function Requirements({ items }: { items: RequirementStatus[] }) {
  const { t, list } = useI18n();
  if (items.length === 0) return null;
  return (
    <ul className="reqs">
      {items.map((r, i) => (
        <li key={i} className={r.met ? 'req req--met' : 'req req--unmet'}>
          <span aria-hidden="true">{r.met ? '✓' : '✗'}</span> {requirementText(r.requirement, t, list)}
        </li>
      ))}
    </ul>
  );
}

export function toneClass(tone: LogTone): string {
  return `tone--${tone}`;
}

export function LanguageSelect({ value, onChange, id }: { value: Locale; onChange: (l: Locale) => void; id: string }) {
  const { t } = useI18n();
  return (
    <label className="field field--inline" htmlFor={id}>
      <span className="field__label">{t('settings.language')}</span>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as Locale)}>
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code} lang={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ThemeToggle({ theme, onChange }: { theme: 'dark' | 'light'; onChange: (t: 'dark' | 'light') => void }) {
  const { t } = useI18n();
  return (
    <div className="segmented" role="radiogroup" aria-label={t('settings.theme')}>
      {(['dark', 'light'] as const).map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={theme === option}
          className={theme === option ? 'is-active' : ''}
          onClick={() => onChange(option)}
        >
          {t(option === 'dark' ? 'settings.themeDark' : 'settings.themeLight')}
        </button>
      ))}
    </div>
  );
}

export function Pips({ used, max, label }: { used: number; max: number; label: string }) {
  return (
    <span className="pips" role="img" aria-label={label}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < max - used ? 'pip pip--on' : 'pip'} />
      ))}
    </span>
  );
}
