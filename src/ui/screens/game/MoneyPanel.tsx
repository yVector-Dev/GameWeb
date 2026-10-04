import { useState } from 'react';
import { HOME_PRICE, HOUSING, ITEMS } from '../../../content/items';
import { buyItem, changeHousing, netWorth, payDebt, sellItem } from '../../../engine';
import { checkHousing, checkPurchase, homeDownPayment, projectedExpenses } from '../../../engine/finance';
import type { GameState, Housing } from '../../../engine/types';
import { Requirements } from '../../components/Bits';
import { ConfirmDialog } from '../../components/Dialog';
import type { GameController } from '../../hooks/useGameController';
import { useI18n } from '../../i18n';

function Ledger({ game }: { game: GameState }) {
  const { t, money } = useI18n();
  const ledger = game.finance.lastLedger;
  if (!ledger) return <p className="empty">{t('finance.noLedger')}</p>;
  return (
    <div className="block">
      <h3 className="subsection-title">{t('finance.lastYear', { age: ledger.age })}</h3>
      <dl className="ledger">
        {ledger.lines.map((line, i) => (
          <div key={i} className="ledger__row">
            <dt>{t(line.key, line.params)}</dt>
            <dd className={line.amount >= 0 ? 'pos' : 'neg'}>{money(line.amount, { signed: true })}</dd>
          </div>
        ))}
        <div className="ledger__row ledger__row--total">
          <dt>{t('finance.net')}</dt>
          <dd className={ledger.net >= 0 ? 'pos' : 'neg'}>{money(ledger.net, { signed: true })}</dd>
        </div>
      </dl>
    </div>
  );
}

function Projected({ game }: { game: GameState }) {
  const { t, money } = useI18n();
  const lines = projectedExpenses(game);
  return (
    <div className="block">
      <h3 className="subsection-title">{t('finance.projected')}</h3>
      {game.character.age < 18 && <p className="muted small">{t('finance.minorNote')}</p>}
      {lines.length === 0 ? (
        <p className="empty">{t('finance.projectedNone')}</p>
      ) : (
        <dl className="ledger">
          {lines.map((line, i) => (
            <div key={i} className="ledger__row">
              <dt>{t(line.key, line.params)}</dt>
              <dd className="neg">{money(-line.amount)}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className="muted small">{t('finance.shortfallNote')}</p>
    </div>
  );
}

function Debts({ ctl }: { ctl: GameController }) {
  const { t, money } = useI18n();
  const f = ctl.game.finance;
  const debts = (['debt', 'studentDebt', 'mortgage'] as const).filter((k) => f[k] > 0);
  return (
    <div className="block">
      <h3 className="subsection-title">{t('finance.debts')}</h3>
      {debts.length === 0 ? (
        <p className="empty">{t('finance.noDebts')}</p>
      ) : (
        <ul className="plain-list">
          {debts.map((k) => (
            <li key={k} className="row">
              <span>
                {t(`finance.${k}`)}: <strong className="neg">{money(f[k])}</strong>
              </span>
              <button type="button" className="button button--chip" disabled={ctl.game.character.money <= 0} onClick={() => ctl.run((g) => payDebt(g, k))}>
                {t('finance.pay')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function HousingSection({ ctl }: { ctl: GameController }) {
  const { t, money } = useI18n();
  const game = ctl.game;
  const [confirm, setConfirm] = useState<{ housing: Housing; cost: number } | null>(null);
  if (game.character.age < 16) return null;
  const options = Object.values(HOUSING);
  return (
    <div className="block">
      <h3 className="subsection-title">{t('finance.housing')}</h3>
      {game.finance.housing === 'own' && <p className="muted small">{t('finance.homeValue', { amount: { money: game.finance.homeValue } })}</p>}
      <ul className="card-list">
        {options.map((h) => {
          const check = checkHousing(game, h.id);
          const current = game.finance.housing === h.id;
          return (
            <li key={h.id} className={`card${current ? ' card--highlight' : ''}`}>
              <div className="card__main">
                {current && <p className="kicker">{t('finance.current')}</p>}
                <h4 className="card__title">{t(`housing.${h.id}.name`)}</h4>
                <p className="card__desc">{t(`housing.${h.id}.desc`)}</p>
                <p className="card__meta">
                  {h.id === 'own'
                    ? t('finance.housingCostOwn', { price: { money: HOME_PRICE }, down: { money: homeDownPayment() } })
                    : t('finance.housingCost', { rent: { money: h.rent }, living: { money: h.living } })}
                </p>
                {h.movingCost > 0 && !current && <p className="muted small">{t('finance.movingCost', { amount: { money: h.movingCost } })}</p>}
              </div>
              {!current && (
                <div className="card__side">
                  <button type="button" className="button button--secondary" disabled={!check.ok} onClick={() => setConfirm({ housing: h.id, cost: check.cost })}>
                    {h.id === 'own' ? t('finance.buyHome') : t('finance.move')}
                  </button>
                  {!check.ok && check.reason && <span className="why">{t(check.reason)}</span>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {game.finance.housing === 'own' && <p className="muted small">{t('finance.sellHomeNote')}</p>}
      {confirm && (
        <ConfirmDialog
          title={t('finance.moveTitle', { place: { t: `housing.${confirm.housing}.name` } })}
          body={t('finance.moveBody', { amount: money(confirm.cost) })}
          confirmLabel={confirm.housing === 'own' ? t('finance.buyHome') : t('finance.move')}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            ctl.run((g) => changeHousing(g, confirm.housing));
            setConfirm(null);
          }}
        />
      )}
    </div>
  );
}

function Shop({ ctl }: { ctl: GameController }) {
  const { t, money } = useI18n();
  const game = ctl.game;
  const [selling, setSelling] = useState<{ id: string; value: number } | null>(null);
  const items = ITEMS.filter((i) => game.character.age >= i.minAge || game.finance.assets.includes(i.id));
  if (items.length === 0) return null;
  return (
    <div className="block">
      <h3 className="subsection-title">{t('finance.shop')}</h3>
      <ul className="card-list">
        {items.map((item) => {
          const check = checkPurchase(game, item.id);
          const owned = check.owned;
          const value = Math.round(item.price * (item.resale ?? 0));
          return (
            <li key={item.id} className={`card${owned ? ' card--highlight' : ''}`}>
              <div className="card__main">
                {owned && <p className="kicker">{t('finance.owned')}</p>}
                <h4 className="card__title">{t(`item.${item.id}.name`)}</h4>
                <p className="card__desc">{t(`item.${item.id}.desc`)}</p>
                <p className="card__meta">
                  {item.price > 0 ? money(item.price) : t('common.free')}
                  {item.upkeep ? <> · {t('finance.upkeep', { amount: { money: item.upkeep } })}</> : null}
                  {item.consumable ? <> · {t('finance.oncePerYear')}</> : null}
                </p>
                {!owned && <Requirements items={check.requirements} />}
              </div>
              <div className="card__side">
                {owned ? (
                  item.resale !== undefined && (
                    <button type="button" className="button button--ghost" onClick={() => setSelling({ id: item.id, value })}>
                      {value > 0 ? t('finance.sell') : t('finance.cancel')}
                    </button>
                  )
                ) : (
                  <>
                    <button type="button" className="button button--secondary" disabled={!check.ok} onClick={() => ctl.run((g) => buyItem(g, item.id))}>
                      {t('finance.buy')}
                    </button>
                    {!check.ok && check.reason && check.reason !== 'error.requirements' && <span className="why">{t(check.reason)}</span>}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {selling && (
        <ConfirmDialog
          title={t('finance.sellTitle', { item: { t: `item.${selling.id}.name` } })}
          body={t('finance.sellBody', { amount: { money: selling.value } })}
          confirmLabel={selling.value > 0 ? t('finance.sell') : t('finance.cancel')}
          danger
          onCancel={() => setSelling(null)}
          onConfirm={() => {
            ctl.run((g) => sellItem(g, selling.id));
            setSelling(null);
          }}
        />
      )}
    </div>
  );
}

export function MoneyPanel({ ctl }: { ctl: GameController }) {
  const { t, money } = useI18n();
  const game = ctl.game;
  return (
    <section className="panel" aria-labelledby="money-title">
      <h2 id="money-title" className="section-title">
        {t('finance.title')}
      </h2>
      <div className="money-summary">
        <div>
          <p className="kicker">{t('finance.balance')}</p>
          <p className="big-number">{money(game.character.money)}</p>
        </div>
        <div>
          <p className="kicker">{t('finance.netWorth')}</p>
          <p className="big-number">{money(netWorth(game))}</p>
        </div>
      </div>
      <Ledger game={game} />
      <Projected game={game} />
      <Debts ctl={ctl} />
      <HousingSection ctl={ctl} />
      <Shop ctl={ctl} />
    </section>
  );
}
