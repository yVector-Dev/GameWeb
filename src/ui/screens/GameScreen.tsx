import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ageUp, canAgeUp, resolveChoice } from '../../engine';
import type { GameState } from '../../engine/types';
import type { KeyValueStore } from '../../persistence/storage';
import { downloadSave, type Notify } from '../App';
import { Pips } from '../components/Bits';
import { Dialog } from '../components/Dialog';
import { SettingsBar, type SettingsProps } from '../components/SettingsBar';
import { useGameController } from '../hooks/useGameController';
import { useI18n } from '../i18n';
import { lifeStage, statusLine } from '../status';
import { EndScreen } from './EndScreen';
import { AchievementsPanel } from './game/AchievementsPanel';
import { ActivitiesPanel } from './game/ActivitiesPanel';
import { AttributesPanel } from './game/AttributesPanel';
import { CareerPanel } from './game/CareerPanel';
import { EventDialog, OutcomeDialog } from './game/EventDialog';
import { MoneyPanel } from './game/MoneyPanel';
import { PeoplePanel } from './game/PeoplePanel';
import { FeedbackCard, StoryLog } from './game/StoryLog';

type PanelTab = 'activities' | 'career' | 'people' | 'money' | 'achievements';
type Tab = 'story' | 'you' | PanelTab;

const PANEL_TABS: PanelTab[] = ['activities', 'career', 'people', 'money', 'achievements'];
const ALL_TABS: Tab[] = ['story', 'you', ...PANEL_TABS];
const TAB_LABEL: Record<Tab, string> = {
  story: 'tab.life',
  you: 'tab.attributes',
  activities: 'tab.activities',
  career: 'tab.career',
  people: 'tab.people',
  money: 'tab.money',
  achievements: 'tab.achievements',
};

interface Props {
  initialGame: GameState;
  slot: number;
  store: KeyValueStore | null;
  settings: SettingsProps;
  notify: Notify;
  onQuit: () => void;
  onNewLife: () => void;
  onHowToPlay: () => void;
}

function isNarrow(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 1099px)').matches;
}

/** Tab list with arrow-key navigation (WAI-ARIA tabs pattern). */
function Tabs({ tabs, active, onSelect, label, className }: { tabs: Tab[]; active: Tab; onSelect: (t: Tab) => void; label: string; className: string }) {
  const { t } = useI18n();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (event: KeyboardEvent, index: number) => {
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next >= 0) {
      event.preventDefault();
      onSelect(tabs[next]);
      refs.current[next]?.focus();
    }
  };
  return (
    <div className={`tabs ${className}`} role="tablist" aria-label={label}>
      {tabs.map((tab, i) => (
        <button
          key={tab}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="tab"
          id={`tab-${className}-${tab}`}
          aria-selected={active === tab}
          aria-controls={`view-${tab}`}
          tabIndex={active === tab ? 0 : -1}
          className={active === tab ? 'tab is-active' : 'tab'}
          onClick={() => onSelect(tab)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          {t(TAB_LABEL[tab])}
        </button>
      ))}
    </div>
  );
}

export function GameScreen({ initialGame, slot, store, settings, notify, onQuit, onNewLife, onHowToPlay }: Props) {
  const i18n = useI18n();
  const { t, money } = i18n;
  const ctl = useGameController(initialGame, slot, store);
  const game = ctl.game;
  const [tab, setTab] = useState<Tab>('story');
  const [panel, setPanel] = useState<PanelTab>('activities');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [feedbackHidden, setFeedbackHidden] = useState<number | null>(null);
  const saveWarned = useRef(false);

  const { error, clearError } = ctl;
  useEffect(() => {
    if (error) {
      notify(error.key, error.params, 'bad');
      clearError();
    }
  }, [error, clearError, notify]);

  useEffect(() => {
    if (ctl.saveFailed && !saveWarned.current) {
      saveWarned.current = true;
      notify(store ? 'save.error.storage' : 'save.error.unavailable', undefined, 'bad');
    }
    if (!ctl.saveFailed) saveWarned.current = false;
  }, [ctl.saveFailed, notify, store]);

  const select = (next: Tab) => {
    setTab(next);
    if (PANEL_TABS.includes(next as PanelTab)) setPanel(next as PanelTab);
  };

  if (!game.alive) {
    return <EndScreen game={game} onNewLife={onNewLife} onQuit={onQuit} onExport={() => downloadSave(game)} />;
  }

  const ageCheck = canAgeUp(game);
  const left = game.actions.max - game.actions.used;
  const doAgeUp = () => {
    if (ctl.run(ageUp) && isNarrow()) setTab('story');
  };
  const choose = (choiceId: string) => {
    if (ctl.run((g) => resolveChoice(g, choiceId))) setShowOutcome(true);
  };

  const panelVisible = (p: PanelTab) => panel === p;
  const viewClass = (v: Tab) => (tab === v ? 'is-current' : '');

  return (
    <div className="game" data-tab={tab}>
      <header className="topbar">
        <div className="topbar__id">
          <p className="topbar__name">
            {game.character.firstName} {game.character.lastName}
          </p>
          <p className="topbar__status">
            <strong>{t('common.age', { age: game.character.age })}</strong> · {t(lifeStage(game.character.age))} · {statusLine(game, i18n)}
          </p>
        </div>
        <div className="topbar__money" aria-label={t('game.money')}>
          <span className="kicker">{t('game.money')}</span>
          <span className={game.character.money < 0 ? 'neg' : ''}>{money(game.character.money)}</span>
        </div>
        <button type="button" className="button button--ghost topbar__menu" onClick={() => setMenuOpen(true)} aria-haspopup="dialog">
          ☰ <span className="topbar__menu-label">{t('common.menu')}</span>
        </button>
      </header>

      <Tabs tabs={ALL_TABS} active={tab} onSelect={select} label={t('game.region', { name: game.character.firstName })} className="tabs--mobile" />

      <main id="main" className="game__grid">
        <aside id="view-you" className={`col col--you ${viewClass('you')}`} role="tabpanel" aria-labelledby="tab-tabs--mobile-you">
          <AttributesPanel game={game} />
        </aside>

        <section id="view-story" className={`col col--story ${viewClass('story')}`} role="tabpanel" aria-labelledby="tab-tabs--mobile-story">
          {feedbackHidden !== game.feedback?.seq && <FeedbackCard feedback={game.feedback} onDismiss={() => setFeedbackHidden(game.feedback?.seq ?? null)} />}
          <StoryLog log={game.log} />
        </section>

        <section className={`col col--panel ${PANEL_TABS.includes(tab as PanelTab) ? 'is-current' : ''}`}>
          <Tabs tabs={PANEL_TABS} active={panel} onSelect={select} label={t('game.region', { name: game.character.firstName })} className="tabs--desktop" />
          <div id={`view-${panel}`} role="tabpanel" aria-labelledby={`tab-tabs--desktop-${panel}`}>
            {panelVisible('activities') && <ActivitiesPanel ctl={ctl} />}
            {panelVisible('career') && <CareerPanel ctl={ctl} />}
            {panelVisible('people') && <PeoplePanel ctl={ctl} />}
            {panelVisible('money') && <MoneyPanel ctl={ctl} />}
            {panelVisible('achievements') && <AchievementsPanel game={game} />}
          </div>
        </section>
      </main>

      <footer className="ageup-bar">
        <div className="ageup-bar__info">
          <Pips used={game.actions.used} max={game.actions.max} label={t('actions.remaining', { left, max: game.actions.max })} />
          <span className="small">{left > 0 ? t('ageUp.left', { count: left }) : t('ageUp.none')}</span>
          {left > 0 && <span className="muted small ageup-bar__hint">{t('ageUp.hint')}</span>}
        </div>
        <button type="button" className="ageup" onClick={doAgeUp} disabled={!ageCheck.ok}>
          {ageCheck.ok ? t('ageUp.button') : t('ageUp.blocked')}
          <span className="ageup__age" aria-hidden="true">
            {game.character.age} → {game.character.age + 1}
          </span>
        </button>
      </footer>

      {game.pending && <EventDialog game={game} onChoose={choose} />}
      {!game.pending && showOutcome && game.feedback && <OutcomeDialog feedback={game.feedback} onClose={() => setShowOutcome(false)} />}

      {menuOpen && (
        <Dialog title={t('game.menuTitle')} onClose={() => setMenuOpen(false)}>
          <div className="menu">
            <SettingsBar settings={settings} />
            <button type="button" className="button button--ghost" onClick={() => downloadSave(game)}>
              {t('game.exportLife')}
            </button>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => {
                setMenuOpen(false);
                onHowToPlay();
              }}
            >
              {t('game.howToPlay')}
            </button>
            <button type="button" className="button button--secondary" onClick={onQuit}>
              {t('game.backToTitle')}
            </button>
            <p className="muted small">{t('title.localNotice')}</p>
            <p className="muted small">
              {t('slots.slot', { n: slot })} · {t('game.seedInfo', { seed: String(game.seed) })}
            </p>
          </div>
        </Dialog>
      )}
    </div>
  );
}
