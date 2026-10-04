import { displayRate, getCountry } from '../../content/countries';
import { setCurrency } from '../../i18n/translate';
import { useMemo, useState } from 'react';
import { buildSummary, relationParam } from '../../engine';
import { jobTitle } from '../../engine/career';
import type { GameState } from '../../engine/types';
import { Meter } from '../components/Bits';
import { useI18n } from '../i18n';
import { LogItem, StoryLog } from './game/StoryLog';

interface Props {
  game: GameState;
  onNewLife: () => void;
  onQuit: () => void;
  onExport: () => void;
}

export function EndScreen({ game, onNewLife, onQuit, onExport }: Props) {
  const { t, p, money } = useI18n();
  const country = getCountry(game.character.country);
  setCurrency(country.currency, displayRate(country));
  const summary = useMemo(() => buildSummary(game), [game]);
  const [showStory, setShowStory] = useState(false);
  const name = `${summary.firstName} ${summary.lastName}`;

  return (
    <main id="main" className="end">
      <div className="end__inner">
        <header className="end__header">
          <p className="kicker">{t('end.heading')}</p>
          <h1 className="end__name">{name}</h1>
          <p className="end__years">
            {t('end.lived', { from: String(summary.birthYear), to: String(summary.endYear) })} · {t('end.finalAge', { age: summary.finalAge })}
          </p>
          {summary.causeKey && <p className="muted">{t('log.death', { age: summary.finalAge, cause: { t: summary.causeKey } })}</p>}
          <div className="epithet">
            <p className="kicker">{t('end.rememberedAs')}</p>
            <h2 className="epithet__name">{t(`epithet.${summary.titleId}.name`)}</h2>
            <p className="epithet__desc">{t(`epithet.${summary.titleId}.desc`)}</p>
          </div>
          <p className="epitaph">{t('end.epitaph', { name: summary.firstName, age: summary.finalAge }, summary.pronouns)}</p>
        </header>

        <div className="end__grid">
          <section className="end__card">
            <h2 className="section-title">{t('end.highlights')}</h2>
            <ul className="entries">
              {summary.highlights.map((entry) => (
                <LogItem key={entry.id} entry={entry} />
              ))}
            </ul>
          </section>

          <section className="end__card">
            <h2 className="section-title">{t('end.education')}</h2>
            <p>{summary.diploma ? t('end.diplomaYes') : t('end.diplomaNo')}</p>
            {summary.completedCourses.length > 0 ? (
              <ul className="plain-list">
                {summary.completedCourses.map((id) => (
                  <li key={id}>✓ {t(`course.${id}.name`)}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">{t('end.noCourses')}</p>
            )}

            <h2 className="section-title">{t('end.career')}</h2>
            {summary.bestJob ? (
              <>
                <p>{t('end.bestJob', { job: jobTitle(summary.bestJob.careerId, summary.bestJob.level, game) })}</p>
                <p className="muted">
                  {t('end.jobsHeld', { count: summary.jobsHeld })} · {t('end.yearsWorked', { count: summary.yearsWorked })}
                </p>
                {summary.retired && <p className="muted">{t('end.retired')}</p>}
              </>
            ) : (
              <p className="muted">{t('end.noCareer')}</p>
            )}

            <h2 className="section-title">{t('end.finances')}</h2>
            <p>{t('end.netWorth', { amount: { money: summary.netWorth } })}</p>
            <p className="muted">{t('end.peak', { amount: { money: summary.peakNetWorth } })}</p>
            {summary.debt > 0 && <p className="neg">{t('end.debtLeft', { amount: money(summary.debt) })}</p>}
          </section>

          <section className="end__card">
            <h2 className="section-title">{t('end.relationships')}</h2>
            {summary.relationships.length === 0 ? (
              <p className="muted">{t('end.noRelationships')}</p>
            ) : (
              <ul className="people">
                {summary.relationships.map(({ npc, age }) => (
                  <li key={npc.id} className="person">
                    <p className="person__name">{npc.relation === 'pet' ? npc.firstName : `${npc.firstName} ${npc.lastName}`}</p>
                    <p className="muted small">
                      {p(relationParam(npc))} · {npc.alive ? t('people.age', { age }) : t('people.deceased', { age })}
                    </p>
                    <Meter value={npc.bond} label={`${t('people.bond')}: ${npc.firstName}`} />
                  </li>
                ))}
              </ul>
            )}
            {summary.children > 0 && <p className="muted">{t('end.children', { count: summary.children })}</p>}

            <h2 className="section-title">{t('end.achievements')}</h2>
            <p className="muted">{t('achievements.progress', { done: summary.achievements.length, total: summary.achievementTotal })}</p>
            {summary.achievements.length === 0 ? (
              <p className="muted">{t('end.noAchievements')}</p>
            ) : (
              <ul className="plain-list">
                {summary.achievements.map((a) => (
                  <li key={a.id}>
                    ★ {t(`ach.${a.id}.name`)} <span className="muted small">({t('achievements.unlockedAt', { age: a.age })})</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="end__actions">
          <button type="button" className="button button--primary button--large" onClick={onNewLife}>
            {t('end.newLife')}
          </button>
          <button type="button" className="button button--ghost" onClick={onExport}>
            {t('end.exportLife')}
          </button>
          <button type="button" className="button button--ghost" onClick={onQuit}>
            {t('end.backToTitle')}
          </button>
          <button type="button" className="button button--ghost" aria-expanded={showStory} onClick={() => setShowStory(!showStory)}>
            {showStory ? t('end.hideStory') : t('end.fullStory')}
          </button>
        </div>
        {showStory && <StoryLog log={game.log} />}
      </div>
    </main>
  );
}
