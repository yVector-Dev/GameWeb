import { getCountry } from '../../../content/countries';
import type { GameState } from '../../../engine/types';
import { HOBBY_IDS, STAT_KEYS } from '../../../engine/types';
import { Meter, StatBar } from '../../components/Bits';
import { useI18n } from '../../i18n';

export function AttributesPanel({ game }: { game: GameState }) {
  const { t, num } = useI18n();
  const c = game.character;
  const hobbies = HOBBY_IDS.filter((h) => (c.hobbies[h] ?? 0) > 0);
  return (
    <section className="panel" aria-labelledby="attr-title">
      <h2 id="attr-title" className="section-title">
        {t('attributes.title')}
      </h2>
      <p className="muted small">{t('attributes.about')}</p>
      <div className="stats">
        {STAT_KEYS.map((stat) => (
          <StatBar key={stat} stat={stat} value={c.stats[stat]} />
        ))}
      </div>

      <h3 className="subsection-title">{t('attributes.traits')}</h3>
      <ul className="trait-list">
        {c.traits.map((trait) => (
          <li key={trait} className="trait">
            <strong>{t(`trait.${trait}.name`)}</strong>
            <span className="muted small">{t(`trait.${trait}.desc`)}</span>
          </li>
        ))}
      </ul>

      <h3 className="subsection-title">{t('attributes.hobbies')}</h3>
      {hobbies.length === 0 ? (
        <p className="empty">{t('attributes.noHobbies')}</p>
      ) : (
        <ul className="hobby-list">
          {hobbies.map((h) => (
            <li key={h}>
              <div className="stat__row">
                <span>{t(`hobby.${h}`)}</span>
                <span className="stat__value">{t('attributes.level', { value: num(c.hobbies[h] ?? 0) })}</span>
              </div>
              <Meter value={c.hobbies[h] ?? 0} label={t(`hobby.${h}`)} />
            </li>
          ))}
        </ul>
      )}
      <p className="muted small origin">
        {t('econ.origin', { city: c.city, country: { t: `country.${c.country}` } })} · {t(`background.${c.background}`)}
      </p>
      <p className="muted small">
        {t('econ.label', { level: { t: `econ.${getCountry(c.country).difficulty}` } })}
      </p>
    </section>
  );
}
