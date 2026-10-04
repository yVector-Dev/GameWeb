import { invest, performCareerAction, withdraw } from '../../../engine';
import { CAREER_ACTIONS, careerActionStatus, contextActive, investedIn, MIN_INVEST_AGE, type CareerActionContext } from '../../../engine/extras';
import { INVESTMENT_KINDS } from '../../../engine/types';
import type { GameController } from '../../hooks/useGameController';
import { useI18n } from '../../i18n';

const SHARES = [10, 25, 50];

export function InvestmentsSection({ ctl }: { ctl: GameController }) {
  const { t, money } = useI18n();
  const game = ctl.game;
  if (game.character.age < 16) return null;
  const adult = game.character.age >= MIN_INVEST_AGE;
  return (
    <div className="block">
      <h3 className="subsection-title">{t('invest.title')}</h3>
      <p className="muted small">{adult ? t('invest.intro') : t('invest.minAge')}</p>
      {adult && (
        <ul className="card-list">
          {INVESTMENT_KINDS.map((kind) => {
            const held = investedIn(game, kind);
            return (
              <li key={kind} className={`card${held > 0 ? ' card--highlight' : ''}`}>
                <div className="card__main">
                  <h4 className="card__title">{t(`invest.${kind}.name`)}</h4>
                  <p className="card__desc">{t(`invest.${kind}.desc`)}</p>
                  <p className="card__meta">{t('invest.balance', { amount: money(held) })}</p>
                  <div className="chip-buttons">
                    {SHARES.map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        className="button button--chip"
                        disabled={game.character.money <= 0}
                        onClick={() => ctl.run((g) => invest(g, kind, Math.floor((g.character.money * pct) / 100)))}
                      >
                        {t('invest.put', { pct })}
                      </button>
                    ))}
                    <button type="button" className="button button--chip button--danger-ghost" disabled={held <= 0} onClick={() => ctl.run((g) => withdraw(g, kind))}>
                      {t('invest.sellAll')}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function CareerActions({ ctl, context }: { ctl: GameController; context: CareerActionContext }) {
  const { t, money } = useI18n();
  const game = ctl.game;
  if (!contextActive(game, context)) return null;
  const actions = CAREER_ACTIONS.filter((a) => a.context === context && (a.minAge === undefined || game.character.age >= a.minAge));
  return (
    <div className="subblock">
      <h4 className="subsection-title">{t(`ca.title.${context}`)}</h4>
      <div className="chip-buttons">
        {actions.map((a) => {
          const status = careerActionStatus(game, a);
          return (
            <button
              key={a.id}
              type="button"
              className="button button--chip"
              disabled={!status.ok}
              title={status.ok ? t(`ca.${a.id}.desc`) : t(status.reason ?? 'error.requirements')}
              onClick={() => ctl.run((g) => performCareerAction(g, a.id))}
            >
              {t(`ca.${a.id}.name`)}
              {a.cost ? <small> · {money(a.cost)}</small> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
