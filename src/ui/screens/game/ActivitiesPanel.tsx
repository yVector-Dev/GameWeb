import { useState } from 'react';
import { listActivities, performActivity } from '../../../engine';
import type { GameState, HobbyId, StatKey } from '../../../engine/types';
import { HOBBY_IDS } from '../../../engine/types';
import { DeltaList, Pips } from '../../components/Bits';
import { useI18n } from '../../i18n';
import type { GameController } from '../../hooks/useGameController';

export function ActionBudget({ game }: { game: GameState }) {
  const { t } = useI18n();
  const left = game.actions.max - game.actions.used;
  return (
    <div className="budget">
      <span className="budget__label">{t('actions.label')}</span>
      <Pips used={game.actions.used} max={game.actions.max} label={t('actions.remaining', { left, max: game.actions.max })} />
      <span className="budget__count">{t('actions.remaining', { left, max: game.actions.max })}</span>
    </div>
  );
}

export function ActivitiesPanel({ ctl }: { ctl: GameController }) {
  const { t } = useI18n();
  const game = ctl.game;
  const [hobbyPicker, setHobbyPicker] = useState(false);
  const activities = listActivities(game);
  const left = game.actions.max - game.actions.used;

  const doActivity = (id: string, hobby?: HobbyId) => {
    ctl.run((g) => performActivity(g, id, hobby ? { hobby } : {}));
    setHobbyPicker(false);
  };

  return (
    <section className="panel" aria-labelledby="act-title">
      <h2 id="act-title" className="section-title">
        {t('activities.title')}
      </h2>
      <ActionBudget game={game} />
      <p className="muted small">{t('activities.intro')}</p>
      {left === 0 && <p className="notice">{t('activities.noneLeft')}</p>}
      <ul className="card-list">
        {activities.map((a) => {
          const gains = Object.entries(a.gains).map(([stat, amount]) => ({ key: `stat.${stat as StatKey}`, amount: amount as number }));
          if (a.money) gains.push({ key: 'delta.money', amount: a.money });
          return (
            <li key={a.def.id} className="card">
              <div className="card__main">
                <h3 className="card__title">{t(`activity.${a.def.id}.name`)}</h3>
                <p className="card__desc">{t(`activity.${a.def.id}.desc`)}</p>
                <DeltaList deltas={gains.map((g) => ({ ...g, money: g.key === 'delta.money' }))} compact />
                <p className="card__meta">
                  {a.cost > 0 ? t('common.cost', { amount: { money: a.cost } }) : t('common.free')}
                  {a.timesUsed > 0 && <> · {t('activities.used', { count: a.timesUsed })}</>}
                </p>
              </div>
              <div className="card__side">
                <button
                  type="button"
                  className="button button--primary"
                  disabled={!a.available}
                  onClick={() => (a.def.hobby ? setHobbyPicker(true) : doActivity(a.def.id))}
                  aria-describedby={!a.available && a.reason ? `why-${a.def.id}` : undefined}
                >
                  {t(`activity.${a.def.id}.name`)}
                </button>
                {!a.available && a.reason && (
                  <span id={`why-${a.def.id}`} className="why">
                    {t(a.reason, { amount: { money: a.cost } })}
                  </span>
                )}
              </div>
              {a.def.hobby && hobbyPicker && a.available && (
                <div className="hobby-picker" role="group" aria-label={t('activities.pickHobby')}>
                  <p className="field__label">{t('activities.pickHobby')}</p>
                  <div className="chip-buttons">
                    {HOBBY_IDS.map((h) => (
                      <button key={h} type="button" className="button button--chip" onClick={() => doActivity(a.def.id, h)}>
                        {t('activities.hobbyLevel', { hobby: { t: `hobby.${h}` }, value: game.character.hobbies[h] ?? 0 })}
                      </button>
                    ))}
                    <button type="button" className="button button--ghost" onClick={() => setHobbyPicker(false)}>
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
