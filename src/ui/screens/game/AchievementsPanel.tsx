import { ACHIEVEMENTS } from '../../../content/achievements';
import type { GameState } from '../../../engine/types';
import { useI18n } from '../../i18n';

export function AchievementsPanel({ game }: { game: GameState }) {
  const { t } = useI18n();
  const done = Object.keys(game.achievements).length;
  return (
    <section className="panel" aria-labelledby="ach-title">
      <h2 id="ach-title" className="section-title">
        {t('achievements.title')}
      </h2>
      <p className="muted">{t('achievements.progress', { done, total: ACHIEVEMENTS.length })}</p>
      <ul className="achievements">
        {ACHIEVEMENTS.map((a) => {
          const age = game.achievements[a.id];
          const unlocked = age !== undefined;
          return (
            <li key={a.id} className={`achievement${unlocked ? ' achievement--unlocked' : ''}`}>
              <span className="achievement__icon" aria-hidden="true">
                {unlocked ? '★' : '☆'}
              </span>
              <div>
                <p className="achievement__name">{t(`ach.${a.id}.name`)}</p>
                <p className="muted small">{t(`ach.${a.id}.desc`)}</p>
                <p className="small">{unlocked ? t('achievements.unlockedAt', { age }) : t('achievements.locked')}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
