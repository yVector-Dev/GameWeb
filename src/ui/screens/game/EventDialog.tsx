import { choiceViews, SKIP_CHOICE } from '../../../engine';
import type { Feedback, GameState } from '../../../engine/types';
import { DeltaList, Requirements } from '../../components/Bits';
import { Dialog } from '../../components/Dialog';
import { useI18n } from '../../i18n';

/** The mandatory decision of the year. It cannot be dismissed. */
export function EventDialog({ game, onChoose }: { game: GameState; onChoose: (choiceId: string) => void }) {
  const { t } = useI18n();
  const pending = game.pending;
  if (!pending) return null;
  const id = pending.eventId;
  const views = choiceViews(game);
  const anyAvailable = views.some((v) => v.available);

  return (
    <Dialog title={t(`ev.${id}.title`, pending.params)} dismissible={false} kicker={`${t('event.decision')} · ${t('common.age', { age: pending.age })}`}>
      <p className="event-text">{t(`ev.${id}.text`, pending.params)}</p>
      <p className="event-prompt">{t('event.choose')}</p>
      <ul className="choices">
        {views.map((view) => (
          <li key={view.choice.id}>
            <button type="button" className="choice" disabled={!view.available} onClick={() => onChoose(view.choice.id)}>
              <span className="choice__label">{t(`ev.${id}.c.${view.choice.id}`, pending.params)}</span>
              <span className="choice__meta">
                {view.cost > 0 && <span className="chip chip--cost">{t('event.cost', { amount: { money: view.cost } })}</span>}
                {view.chance !== undefined && (
                  <span className="chip chip--chance">{t('event.chance', { pct: Math.round(view.chance * 20) * 5 })}</span>
                )}
                {view.cost > 0 && game.character.money < view.cost && (
                  <span className="chip chip--bad">{t('error.notEnoughMoney')}</span>
                )}
              </span>
              <Requirements items={view.requirements} />
            </button>
          </li>
        ))}
      </ul>
      {!anyAvailable && (
        <div className="dialog__actions">
          <p className="muted">{t('event.noOptions')}</p>
          <button type="button" className="button button--primary" onClick={() => onChoose(SKIP_CHOICE)}>
            {t('event.continue')}
          </button>
        </div>
      )}
    </Dialog>
  );
}

/** Shows the consequences right after a decision. */
export function OutcomeDialog({ feedback, onClose }: { feedback: Feedback; onClose: () => void }) {
  const { t } = useI18n();
  return (
    <Dialog title={t(feedback.titleKey, feedback.titleParams ?? feedback.textParams)} onClose={onClose} kicker={t('event.outcome')}>
      {feedback.textKey && <p className={`event-text tone-text--${feedback.tone}`}>{t(feedback.textKey, feedback.textParams)}</p>}
      <DeltaList deltas={feedback.deltas} />
      <div className="dialog__actions">
        <button type="button" className="button button--primary" onClick={onClose}>
          {t('event.continue')}
        </button>
      </div>
    </Dialog>
  );
}
