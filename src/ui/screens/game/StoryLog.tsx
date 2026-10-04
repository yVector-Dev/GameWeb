import { useMemo, useState } from 'react';
import type { Feedback, LogEntry } from '../../../engine/types';
import { DeltaList } from '../../components/Bits';
import { useI18n } from '../../i18n';

const VISIBLE_YEARS = 12;

export function FeedbackCard({ feedback, onDismiss }: { feedback: Feedback | null; onDismiss: () => void }) {
  const { t } = useI18n();
  if (!feedback) return null;
  return (
    <section key={feedback.seq} className={`feedback tone--${feedback.tone}`} aria-live="polite" aria-label={t('feedbackPanel.title')}>
      <div className="feedback__head">
        <p className="kicker">{t('feedbackPanel.title')}</p>
        <button type="button" className="icon-button" onClick={onDismiss} aria-label={t('feedbackPanel.dismiss')}>
          ×
        </button>
      </div>
      <h2 className="feedback__title">{t(feedback.titleKey, feedback.titleParams)}</h2>
      {feedback.textKey && <p className="feedback__text">{t(feedback.textKey, feedback.textParams)}</p>}
      <DeltaList deltas={feedback.deltas} />
    </section>
  );
}

export function LogItem({ entry }: { entry: LogEntry }) {
  const { t } = useI18n();
  const yearly = entry.key === 'log.year.changes';
  return (
    <li className={`entry tone--${entry.tone}${yearly ? ' entry--quiet' : ''}`}>
      {entry.title && <p className="entry__title">{t(entry.title, entry.params)}</p>}
      <p className="entry__text">{yearly ? t('story.yearChanges') : t(entry.key, entry.params)}</p>
      {entry.deltas && <DeltaList deltas={entry.deltas} compact />}
    </li>
  );
}

/** The life story, newest year first, grouped by age. */
export function StoryLog({ log }: { log: LogEntry[] }) {
  const { t } = useI18n();
  const [showAll, setShowAll] = useState(false);
  const groups = useMemo(() => {
    const byAge = new Map<number, LogEntry[]>();
    for (const entry of log) {
      const list = byAge.get(entry.age) ?? [];
      list.push(entry);
      byAge.set(entry.age, list);
    }
    return Array.from(byAge.entries()).sort((a, b) => b[0] - a[0]);
  }, [log]);
  const visible = showAll ? groups : groups.slice(0, VISIBLE_YEARS);

  return (
    <section className="story" aria-labelledby="story-title">
      <h2 id="story-title" className="section-title">
        {t('story.title')}
      </h2>
      <ol className="years">
        {visible.map(([age, entries]) => (
          <li key={age} className="year">
            <h3 className="year__age">{t('story.ageHeader', { age })}</h3>
            <ul className="entries">
              {entries.map((entry) => (
                <LogItem key={entry.id} entry={entry} />
              ))}
            </ul>
          </li>
        ))}
      </ol>
      {!showAll && groups.length > VISIBLE_YEARS && (
        <button type="button" className="button button--ghost" onClick={() => setShowAll(true)}>
          {t('story.showOlder')}
        </button>
      )}
    </section>
  );
}
