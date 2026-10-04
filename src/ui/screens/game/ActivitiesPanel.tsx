import { useState, type ReactNode } from 'react';
import { COUNTRIES } from '../../../content/countries';
import {
  commitCrime,
  CRIMES,
  casinoBet,
  conditionsOf,
  DISEASE_MAP,
  emigrate,
  EMIGRATION_COST,
  goToCasino,
  inPrison,
  listActivities,
  LOTTERY_COST,
  performActivity,
  plasticSurgery,
  playLottery,
  poolLeft,
  POOLS,
  prisonAppeal,
  seeDoctor,
  SURGERY_COST,
  treatmentCost,
} from '../../../engine';
import type { ActionPool, GameState, HobbyId, StatKey } from '../../../engine/types';
import { HOBBY_IDS } from '../../../engine/types';
import { DeltaList, Pips } from '../../components/Bits';
import { useI18n } from '../../i18n';
import type { GameController } from '../../hooks/useGameController';
import { CareerActions } from './ExtrasPanels';

/** Remaining actions in one category, as pips. */
export function PoolBudget({ game, pool, compact }: { game: GameState; pool: ActionPool; compact?: boolean }) {
  const { t } = useI18n();
  const p = game.actions.pools?.[pool];
  if (!p) return null;
  const left = poolLeft(game, pool);
  const label = `${t(`pool.${pool}`)}: ${t('pool.left', { left, max: p.max })}`;
  return (
    <span className={`pool-budget pool-budget--${pool}${compact ? ' pool-budget--compact' : ''}`} title={label}>
      <span className="pool-budget__label">{t(`pool.${pool}`)}</span>
      <Pips used={p.used} max={p.max} label={label} />
    </span>
  );
}

/** Kept for other panels: shows all three categories. */
export function ActionBudget({ game }: { game: GameState }) {
  return (
    <div className="budget">
      {POOLS.map((pool) => (
        <PoolBudget key={pool} game={game} pool={pool} compact />
      ))}
    </div>
  );
}

function ActivityTiles({ ctl, pool }: { ctl: GameController; pool: ActionPool }) {
  const { t } = useI18n();
  const game = ctl.game;
  const [hobbyPicker, setHobbyPicker] = useState(false);
  const activities = listActivities(game).filter((a) => a.def.pool === pool);
  if (activities.length === 0) return null;

  const doActivity = (id: string, hobby?: HobbyId) => {
    ctl.run((g) => performActivity(g, id, hobby ? { hobby } : {}));
    setHobbyPicker(false);
  };

  return (
    <>
      <div className="tiles">
        {activities.map((a) => {
          const gains = Object.entries(a.gains).map(([stat, amount]) => ({ key: `stat.${stat as StatKey}`, amount: amount as number }));
          if (a.money) gains.push({ key: 'delta.money', amount: a.money });
          return (
            <button
              key={a.def.id}
              type="button"
              className="tile"
              disabled={!a.available}
              title={!a.available && a.reason ? t(a.reason, { amount: { money: a.cost } }) : t(`activity.${a.def.id}.desc`)}
              onClick={() => (a.def.hobby ? setHobbyPicker(!hobbyPicker) : doActivity(a.def.id))}
            >
              <span className="tile__name">{t(`activity.${a.def.id}.name`)}</span>
              <DeltaList deltas={gains.map((g) => ({ ...g, money: g.key === 'delta.money' }))} compact />
              <span className="tile__meta">
                {a.cost > 0 ? t('common.cost', { amount: { money: a.cost } }) : t('common.free')}
                {a.timesUsed > 0 && <> · {t('activities.used', { count: a.timesUsed })}</>}
              </span>
            </button>
          );
        })}
      </div>
      {hobbyPicker && (
        <div className="hobby-picker" role="group" aria-label={t('activities.pickHobby')}>
          <p className="field__label">{t('activities.pickHobby')}</p>
          <div className="chip-buttons">
            {HOBBY_IDS.map((h) => (
              <button key={h} type="button" className="button button--chip" onClick={() => doActivity('hobby', h)}>
                {t('activities.hobbyLevel', { hobby: { t: `hobby.${h}` }, value: game.character.hobbies[h] ?? 0 })}
              </button>
            ))}
            <button type="button" className="button button--ghost" onClick={() => setHobbyPicker(false)}>
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function HealthBlock({ ctl }: { ctl: GameController }) {
  const { t, money } = useI18n();
  const game = ctl.game;
  const conditions = conditionsOf(game);
  const noPersonal = poolLeft(game, 'personal') <= 0;
  return (
    <div className="subblock">
      <h4 className="subsection-title">{t('health.title')}</h4>
      {conditions.length === 0 ? (
        <p className="muted small">{t('health.none')}</p>
      ) : (
        <ul className="condition-list">
          {conditions.map((c) => {
            const def = DISEASE_MAP[c.id];
            const cost = treatmentCost(game, c.id);
            return (
              <li key={c.id} className="condition">
                <span>
                  <strong>{t(`disease.${c.id}.name`)}</strong>
                  {def && def.cure === 0 && <span className="badge"> {t('health.chronic')}</span>}
                  {c.treated && <span className="badge badge--good"> {t('health.treated')}</span>}
                </span>
                {!(def?.cure === 0 && c.treated) && (
                  <button type="button" className="button button--chip" disabled={noPersonal || game.character.money < cost} onClick={() => ctl.run((g) => seeDoctor(g, c.id))}>
                    {t('health.treat', { amount: money(cost) })}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {game.character.age >= 18 && !inPrison(game) && (
        <div className="chip-buttons">
          <button
            type="button"
            className="button button--chip"
            disabled={noPersonal || game.character.money < SURGERY_COST}
            title={t('health.surgeryDesc', { amount: money(SURGERY_COST) })}
            onClick={() => ctl.run(plasticSurgery)}
          >
            {t('health.surgery')} · {money(SURGERY_COST)}
          </button>
          <button
            type="button"
            className="button button--chip"
            disabled={noPersonal || (game.actions.counts.lottery ?? 0) > 0}
            title={t('gamble.lotteryDesc', { amount: money(LOTTERY_COST) })}
            onClick={() => ctl.run(playLottery)}
          >
            {t('gamble.lottery')} · {money(LOTTERY_COST)}
          </button>
        </div>
      )}
    </div>
  );
}

function RiskBlock({ ctl }: { ctl: GameController }) {
  const { t, money } = useI18n();
  const game = ctl.game;
  const [country, setCountry] = useState('');
  const age = game.character.age;
  if (age < 12 || inPrison(game)) return null;
  const noSocial = poolLeft(game, 'social') <= 0;
  const crimes = CRIMES.filter((c) => age >= c.minAge);
  return (
    <>
      {age >= 18 && (
        <div className="subblock">
          <h4 className="subsection-title">{t('gamble.title')}</h4>
          <div className="chip-buttons">
            <button
              type="button"
              className="button button--chip"
              disabled={noSocial || casinoBet(game) < 50}
              title={t('gamble.casinoDesc', { amount: money(500) })}
              onClick={() => ctl.run(goToCasino)}
            >
              {t('gamble.casino')}
            </button>
          </div>
        </div>
      )}
      <div className="subblock">
        <h4 className="subsection-title">{t('crime.title')}</h4>
        <p className="muted small">{t('crime.intro')}</p>
        <div className="chip-buttons">
          {crimes.map((c) => (
            <button key={c.id} type="button" className="button button--chip button--danger-ghost" disabled={noSocial} onClick={() => ctl.run((g) => commitCrime(g, c.id))}>
              {t(`crime.${c.id}.name`)}
            </button>
          ))}
        </div>
      </div>
      {age >= 18 && (
        <div className="subblock">
          <h4 className="subsection-title">{t('emigrate.title')}</h4>
          <p className="muted small">{t('emigrate.intro', { amount: money(EMIGRATION_COST) })}</p>
          <div className="row">
            <select className="input" value={country} onChange={(e) => setCountry(e.target.value)} aria-label={t('emigrate.title')}>
              <option value="">—</option>
              {COUNTRIES.filter((c) => c.id !== game.character.country).map((c) => (
                <option key={c.id} value={c.id}>
                  {t(`country.${c.id}`)}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="button button--chip"
              disabled={!country || noSocial || game.character.money < EMIGRATION_COST}
              onClick={() => ctl.run((g) => emigrate(g, country)) && setCountry('')}
            >
              {t('emigrate.go')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function PoolSection({ ctl, pool, children }: { ctl: GameController; pool: ActionPool; children?: ReactNode }) {
  const { t } = useI18n();
  const game = ctl.game;
  const p = game.actions.pools?.[pool];
  if (!p || p.max === 0) return null;
  return (
    <section className={`pool pool--${pool}`} aria-labelledby={`pool-${pool}`}>
      <header className="pool__head">
        <h3 id={`pool-${pool}`} className="pool__title">
          {t(`pool.${pool}`)}
        </h3>
        <PoolBudget game={game} pool={pool} />
      </header>
      <p className="muted small">{t(`pool.${pool}Intro`)}</p>
      <ActivityTiles ctl={ctl} pool={pool} />
      {children}
    </section>
  );
}

export function ActivitiesPanel({ ctl }: { ctl: GameController }) {
  const { t, money } = useI18n();
  const game = ctl.game;
  const jailed = inPrison(game);
  return (
    <section className="panel" aria-labelledby="act-title">
      <h2 id="act-title" className="section-title">
        {t('activities.title')}
      </h2>
      {jailed && (
        <div className="notice notice--bad">
          <p>{t('prison.notice', { age: game.character.prisonUntil ?? 0 })}</p>
          <button
            type="button"
            className="button button--chip"
            disabled={poolLeft(game, 'personal') <= 0 || game.character.money < 3000}
            title={t('prison.appealDesc', { amount: money(3000) })}
            onClick={() => ctl.run(prisonAppeal)}
          >
            {t('prison.appeal')} · {money(3000)}
          </button>
        </div>
      )}
      <PoolSection ctl={ctl} pool="personal">
        <HealthBlock ctl={ctl} />
      </PoolSection>
      {!jailed && (
        <PoolSection ctl={ctl} pool="work">
          <CareerActions ctl={ctl} context="school" />
          <CareerActions ctl={ctl} context="uni" />
          <CareerActions ctl={ctl} context="work" />
        </PoolSection>
      )}
      <PoolSection ctl={ctl} pool="social">
        <p className="muted small">{t('people.interactionsNote')}</p>
        <RiskBlock ctl={ctl} />
      </PoolSection>
    </section>
  );
}
