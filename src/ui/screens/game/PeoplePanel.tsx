import { useState } from 'react';
import { adoptChild, findPartner, interact, npcAge, relationParam, setDatingPreference } from '../../../engine';
import {
  ADOPTION_COST,
  canAdopt,
  canFindPartner,
  FIND_PARTNER_COST,
  findPartnerChance,
  interactionsFor,
  MAX_INTERACTIONS_PER_NPC,
  type InteractionId,
} from '../../../engine/relationships';
import type { DatingPreference, GameState, NPC } from '../../../engine/types';
import { Meter } from '../../components/Bits';
import { ConfirmDialog } from '../../components/Dialog';
import type { GameController } from '../../hooks/useGameController';
import { useI18n } from '../../i18n';

const GROUPS: { key: string; relations: NPC['relation'][] }[] = [
  { key: 'people.family', relations: ['parent', 'sibling', 'grandparent', 'child'] },
  { key: 'people.love', relations: ['partner', 'spouse'] },
  { key: 'people.friends', relations: ['friend', 'mentor'] },
  { key: 'people.pets', relations: ['pet'] },
];

function PersonCard({ npc, ctl }: { npc: NPC; ctl: GameController }) {
  const { t, p, num } = useI18n();
  const game = ctl.game;
  const [open, setOpen] = useState(false);
  const [confirmBreakup, setConfirmBreakup] = useState(false);
  const age = npcAge(game, npc);
  const rel = p(relationParam(npc));
  const views = npc.alive ? interactionsFor(game, npc) : [];
  const used = game.actions.npcCounts[npc.id] ?? 0;
  const left = Math.max(0, MAX_INTERACTIONS_PER_NPC - used);

  const act = (id: InteractionId) => {
    if (id === 'breakup') {
      setConfirmBreakup(true);
      return;
    }
    ctl.run((g) => interact(g, npc.id, id));
  };

  return (
    <li className={`person${npc.alive ? '' : ' person--gone'}`}>
      <div className="person__head">
        <div>
          <p className="person__name">{npc.relation === 'pet' ? npc.firstName : `${npc.firstName} ${npc.lastName}`}</p>
          <p className="muted small">
            {rel} · {npc.alive ? t('people.age', { age }) : t('people.deceased', { age })}
            {npc.conflict && npc.alive && <span className="badge badge--bad"> {t('people.conflict')}</span>}
          </p>
          {npc.occupationKey && npc.alive && <p className="muted small">{t('people.occupation', { job: { t: npc.occupationKey, ctx: npc.gender } })}</p>}
        </div>
        {npc.alive && views.length > 0 && (
          <button type="button" className="button button--chip" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? '−' : '+'}
            <span className="sr-only"> {npc.firstName}</span>
          </button>
        )}
      </div>
      <div className="person__bond">
        <span className="small">{t('people.bond')}</span>
        <Meter value={npc.bond} label={`${t('people.bond')}: ${npc.firstName}`} />
        <span className="stat__value small">{num(npc.bond)}</span>
      </div>
      {open && npc.alive && (
        <div className="person__actions">
          <p className="muted small">{t('people.left', { count: left })}</p>
          <div className="chip-buttons">
            {views.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`button button--chip${v.id === 'breakup' ? ' button--danger-ghost' : ''}`}
                disabled={!v.available}
                title={v.available ? t(`interact.${v.id}.desc`, { name: npc.firstName }) : t(v.reason ?? 'error.interactionUnavailable')}
                onClick={() => act(v.id)}
              >
                {t(`interact.${v.id}.name`)}
                {v.cost > 0 && <small> · {p({ money: v.cost })}</small>}
                {v.chance !== undefined && <small> · {t('format.percent', { value: Math.round(v.chance * 100) })}</small>}
              </button>
            ))}
          </div>
        </div>
      )}
      {confirmBreakup && (
        <ConfirmDialog
          title={t('people.breakupTitle')}
          body={t('people.breakupBody', { name: npc.firstName })}
          confirmLabel={t('interact.breakup.name')}
          danger
          onCancel={() => setConfirmBreakup(false)}
          onConfirm={() => {
            ctl.run((g) => interact(g, npc.id, 'breakup'));
            setConfirmBreakup(false);
          }}
        />
      )}
    </li>
  );
}

function RomanceTools({ ctl }: { ctl: GameController }) {
  const { t } = useI18n();
  const game = ctl.game;
  if (game.character.age < 18) return <p className="muted small">{t('people.romanceAdults')}</p>;
  const partnerCheck = canFindPartner(game);
  const adoptCheck = canAdopt(game);
  const pref = game.character.datingPreference;
  return (
    <div className="block romance-tools">
      <div className="row">
        <span className="field__label">{t('people.datingPref')}</span>
        <div className="segmented" role="radiogroup" aria-label={t('people.datingPref')}>
          {(['any', 'f', 'm'] as DatingPreference[]).map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={pref === option}
              className={pref === option ? 'is-active' : ''}
              onClick={() => ctl.run((g) => setDatingPreference(g, option))}
            >
              {t(`dating.${option}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="row">
        <button type="button" className="button button--secondary" disabled={!partnerCheck.ok} onClick={() => ctl.run(findPartner)}>
          {t('people.findPartner')}
        </button>
        <span className="muted small">
          {partnerCheck.ok || partnerCheck.reason === 'error.notEnoughMoney'
            ? t('people.findPartnerInfo', { amount: { money: FIND_PARTNER_COST }, pct: Math.round(findPartnerChance(game) * 100) })
            : t(partnerCheck.reason ?? 'error.requirements')}
        </span>
      </div>
      {game.character.age >= 25 && (
        <div className="row">
          <button type="button" className="button button--secondary" disabled={!adoptCheck.ok} onClick={() => ctl.run(adoptChild)}>
            {t('people.adopt')}
          </button>
          <span className="muted small">
            {adoptCheck.ok ? t('people.adoptInfo', { amount: { money: ADOPTION_COST } }) : t(adoptCheck.reason ?? 'error.requirements')}
          </span>
        </div>
      )}
    </div>
  );
}

export function PeoplePanel({ ctl }: { ctl: GameController }) {
  const { t } = useI18n();
  const game: GameState = ctl.game;
  const past = game.npcs.filter((n) => !n.alive || n.relation === 'ex');
  return (
    <section className="panel" aria-labelledby="people-title">
      <h2 id="people-title" className="section-title">
        {t('people.title')}
      </h2>
      <p className="muted small">{t('people.interactionsNote')}</p>
      <RomanceTools ctl={ctl} />
      {GROUPS.map((group) => {
        const people = game.npcs.filter((n) => n.alive && group.relations.includes(n.relation)).sort((a, b) => b.bond - a.bond);
        return (
          <div key={group.key} className="block">
            <h3 className="subsection-title">{t(group.key)}</h3>
            {people.length === 0 ? (
              <p className="empty">{t('people.empty')}</p>
            ) : (
              <ul className="people">
                {people.map((npc) => (
                  <PersonCard key={npc.id} npc={npc} ctl={ctl} />
                ))}
              </ul>
            )}
          </div>
        );
      })}
      {past.length > 0 && (
        <details className="block">
          <summary className="subsection-title">{t('people.past')}</summary>
          <ul className="people">
            {past.map((npc) => (
              <PersonCard key={npc.id} npc={npc} ctl={ctl} />
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
