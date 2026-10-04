import { useState } from 'react';
import { CAREERS } from '../../../content/careers';
import { COURSES, getCourse } from '../../../content/courses';
import { applyForJob, dropCourse, enrollCourse, quitJob, retire, takeLicenseTest } from '../../../engine';
import { checkApplication, currentSalary, salaryFor, isPartTime, jobTitle, pensionFor, promotionStatus, RETIREMENT_MIN_AGE } from '../../../engine/career';
import { describeRequirements } from '../../../engine/conditions';
import {
  canBorrowForStudies,
  courseAvailability,
  familyTuitionShare,
  isInSchool,
  LICENSE_COST,
  licenseChance,
  SCHOOL_PASS_MARK,
  STUDENT_LOAN_LIMIT,
  tuitionFor,
} from '../../../engine/education';
import type { Funding, GameState } from '../../../engine/types';
import { Meter, Requirements } from '../../components/Bits';
import { ConfirmDialog, Dialog } from '../../components/Dialog';
import type { GameController } from '../../hooks/useGameController';
import { useI18n } from '../../i18n';

function pct(n: number): number {
  return Math.round(n * 100);
}

function SchoolSection({ game }: { game: GameState }) {
  const { t } = useI18n();
  const e = game.education;
  return (
    <div className="block">
      <h3 className="subsection-title">{t('edu.school')}</h3>
      {e.stage === 'none' && <p className="empty">{t('edu.notStarted')}</p>}
      {isInSchool(game) && (
        <>
          <p>{t(e.stage === 'primary' ? 'status.primary' : 'status.secondary', { year: e.stage === 'primary' ? e.schoolYear : e.schoolYear - 6 })}</p>
          <p className="muted small">{t('edu.schoolYear', { year: e.schoolYear })}</p>
          <div className="stat__row">
            <span>{t('edu.performance')}</span>
            <span className="stat__value">{Math.round(e.performance)}</span>
          </div>
          <Meter value={e.performance} label={t('edu.performance')} />
          <p className="muted small">{t('edu.performanceHint', { mark: SCHOOL_PASS_MARK })}</p>
        </>
      )}
      {e.diploma && <p className="badge badge--good">{t('edu.diploma')}</p>}
      {!e.diploma && e.stage === 'dropped' && <p className="notice">{t('edu.dropped')}</p>}
      {!e.diploma && e.stage !== 'dropped' && e.stage !== 'none' && !isInSchool(game) && <p>{t('edu.noDiploma')}</p>}
      {e.completed.length > 0 && (
        <>
          <h4 className="mini-title">{t('edu.completedList')}</h4>
          <ul className="plain-list">
            {e.completed.map((id) => (
              <li key={id}>✓ {t(`course.${id}.name`)}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function CoursesSection({ ctl }: { ctl: GameController }) {
  const { t, money } = useI18n();
  const game = ctl.game;
  const e = game.education;
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [confirmDrop, setConfirmDrop] = useState(false);
  if (game.character.age < 15 && !e.enrolled) return null;

  const enrolled = e.enrolled;
  const enrolledCourse = enrolled ? getCourse(enrolled.courseId) : null;

  return (
    <div className="block">
      <h3 className="subsection-title">{t('edu.courses')}</h3>
      {enrolled && enrolledCourse && (
        <div className="card card--highlight">
          <div className="card__main">
            <p className="kicker">{t('edu.enrolled')}</p>
            <h4 className="card__title">{t(`course.${enrolled.courseId}.name`)}</h4>
            <p>{t('edu.progress', { done: enrolled.yearsDone, total: enrolledCourse.years })}</p>
            <div className="stat__row">
              <span>{t('edu.performance')}</span>
              <span className="stat__value">{Math.round(enrolled.performance)}</span>
            </div>
            <Meter value={enrolled.performance} label={t('edu.performance')} />
            <p className="muted small">{t('edu.passMark', { mark: enrolledCourse.passMark })}</p>
            <p className="muted small">{t('edu.failures', { count: enrolled.failures })}</p>
            {enrolled.scholarship > 0 && <p className="muted small">{t('edu.scholarship', { pct: pct(enrolled.scholarship) })}</p>}
          </div>
          <div className="card__side">
            <button type="button" className="button button--danger-ghost" onClick={() => setConfirmDrop(true)}>
              {t('edu.drop')}
            </button>
          </div>
        </div>
      )}
      {e.scholarship > 0 && !enrolled && <p className="badge badge--good">{t('edu.scholarship', { pct: pct(e.scholarship) })}</p>}
      <ul className="card-list">
        {COURSES.filter((c) => !e.completed.includes(c.id) && c.id !== enrolled?.courseId).map((course) => {
          const availability = courseAvailability(game, course.id);
          const reqs = describeRequirements(game, course.requires);
          return (
            <li key={course.id} className="card">
              <div className="card__main">
                <h4 className="card__title">{t(`course.${course.id}.name`)}</h4>
                <p className="card__meta">
                  {t('edu.kindLabel', { kind: { t: `courseKind.${course.kind}` }, years: { t: 'edu.duration', p: { count: course.years } } })}
                  {' · '}
                  {t('edu.tuition', { amount: { money: tuitionFor(game, { courseId: course.id, funding: 'savings', scholarship: 0 }).base } })}
                </p>
                <p className="card__desc">{t(`course.${course.id}.desc`)}</p>
                <Requirements items={reqs} />
              </div>
              <div className="card__side">
                <button type="button" className="button button--primary" disabled={!availability.available || game.actions.used >= game.actions.max} onClick={() => setEnrolling(course.id)}>
                  {t('edu.enroll')}
                </button>
                {!availability.available && availability.reason && availability.reason !== 'error.requirements' && (
                  <span className="why">{t(availability.reason)}</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {enrolling && (
        <Dialog title={t(`course.${enrolling}.name`)} onClose={() => setEnrolling(null)} kicker={t('edu.funding')}>
          <FundingOptions
            game={game}
            courseId={enrolling}
            onPick={(funding) => {
              if (ctl.run((g) => enrollCourse(g, enrolling, funding))) setEnrolling(null);
            }}
          />
          <p className="muted small">{money(game.character.money)}</p>
        </Dialog>
      )}
      {confirmDrop && enrolled && (
        <ConfirmDialog
          title={t('edu.dropTitle', { course: { t: `course.${enrolled.courseId}.name` } })}
          body={t('edu.dropBody')}
          confirmLabel={t('edu.drop')}
          danger
          onCancel={() => setConfirmDrop(false)}
          onConfirm={() => {
            ctl.run(dropCourse);
            setConfirmDrop(false);
          }}
        />
      )}
    </div>
  );
}

function FundingOptions({ game, courseId, onPick }: { game: GameState; courseId: string; onPick: (f: Funding) => void }) {
  const { t } = useI18n();
  const course = getCourse(courseId);
  const scholarship = course.kind === 'university' ? game.education.scholarship : 0;
  const familyShare = familyTuitionShare(game);
  const options: { funding: Funding; label: string; share: number; disabled: boolean }[] = [
    { funding: 'savings', label: t('edu.fundSavings'), share: tuitionFor(game, { courseId, funding: 'savings', scholarship }).student, disabled: false },
    { funding: 'family', label: t('edu.fundFamily', { pct: pct(familyShare) }), share: tuitionFor(game, { courseId, funding: 'family', scholarship }).student, disabled: familyShare === 0 },
    { funding: 'loan', label: t('edu.fundLoan'), share: 0, disabled: !canBorrowForStudies(game) },
  ];
  return (
    <>
      {scholarship > 0 && <p className="badge badge--good">{t('edu.scholarship', { pct: pct(scholarship) })}</p>}
      <ul className="choices">
        {options.map((o) => {
          const tooPoor = o.funding !== 'loan' && game.character.money < o.share;
          return (
            <li key={o.funding}>
              <button type="button" className="choice" disabled={o.disabled || tooPoor} onClick={() => onPick(o.funding)}>
                <span className="choice__label">{o.label}</span>
                <span className="choice__meta">
                  <span className="chip chip--cost">{t('common.perYear', { amount: { money: o.funding === 'loan' ? tuitionFor(game, { courseId, funding: 'loan', scholarship }).student : o.share } })}</span>
                  {tooPoor && <span className="chip chip--bad">{t('error.notEnoughMoney')}</span>}
                  {o.disabled && (
                    <span className="chip chip--bad">
                      {o.funding === 'loan' ? t('error.loanLimit', { amount: { money: STUDENT_LOAN_LIMIT } }) : t('error.noFamilyHelp')}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function LicenseSection({ ctl }: { ctl: GameController }) {
  const { t } = useI18n();
  const game = ctl.game;
  if (game.character.age < 14) return null;
  return (
    <div className="block">
      <h3 className="subsection-title">{t('edu.license')}</h3>
      {game.education.license ? (
        <p className="badge badge--good">{t('edu.licenseHave')}</p>
      ) : game.character.age < 16 ? (
        <p className="muted">{t('edu.licenseTooYoung')}</p>
      ) : (
        <div className="row">
          <span className="muted small">{t('edu.licenseInfo', { amount: { money: LICENSE_COST }, pct: pct(licenseChance(game)) })}</span>
          <button
            type="button"
            className="button button--secondary"
            disabled={game.character.money < LICENSE_COST || game.actions.used >= game.actions.max}
            onClick={() => ctl.run(takeLicenseTest)}
          >
            {t('edu.licenseTake')}
          </button>
        </div>
      )}
    </div>
  );
}

function JobSection({ ctl }: { ctl: GameController }) {
  const { t, p } = useI18n();
  const game = ctl.game;
  const job = game.career.job;
  const [confirm, setConfirm] = useState<'quit' | 'retire' | null>(null);
  const promo = promotionStatus(game);
  const canRetire = game.character.age >= RETIREMENT_MIN_AGE && !game.career.retired;

  return (
    <div className="block">
      <h3 className="subsection-title">{t('work.current')}</h3>
      {!job && !game.career.retired && <p className="empty">{game.character.age < 16 ? t('work.tooYoung') : t('work.none')}</p>}
      {game.career.retired && !job && (
        <>
          <p>{t('work.retired')}</p>
          <p className="muted">{t('work.pension', { amount: { money: pensionFor(game) } })}</p>
        </>
      )}
      {job && (
        <div className="card card--highlight">
          <div className="card__main">
            <p className="kicker">{t(`career.${job.careerId}.name`)}</p>
            <h4 className="card__title">{p(jobTitle(job.careerId, job.level, game))}</h4>
            <p>{t('work.salary', { amount: { money: currentSalary(game) } })}</p>
            {isPartTime(game) && <p className="muted small">{t('work.partTime')}</p>}
            <div className="stat__row">
              <span>{t('work.performance')}</span>
              <span className="stat__value">{Math.round(job.performance)}</span>
            </div>
            <Meter value={job.performance} label={t('work.performance')} />
            <p className="muted small">{t('work.yearsInRole', { count: job.yearsInLevel })}</p>
            {promo ? (
              <div className="promo">
                <p className="mini-title">{t('work.nextPromotion', { job: jobTitle(job.careerId, promo.nextLevel, game) })}</p>
                <ul className="reqs">
                  <li className={promo.yearsHave >= promo.yearsNeeded ? 'req req--met' : 'req req--unmet'}>
                    <span aria-hidden="true">{promo.yearsHave >= promo.yearsNeeded ? '✓' : '✗'}</span>{' '}
                    {t('work.reqYears', { have: promo.yearsHave, need: promo.yearsNeeded })}
                  </li>
                  <li className={promo.perfHave >= promo.perfNeeded ? 'req req--met' : 'req req--unmet'}>
                    <span aria-hidden="true">{promo.perfHave >= promo.perfNeeded ? '✓' : '✗'}</span>{' '}
                    {t('work.reqPerf', { need: promo.perfNeeded, have: Math.round(promo.perfHave) })}
                  </li>
                </ul>
                <Requirements items={promo.requirements} />
                <p className="muted small">{t('work.promoNote')}</p>
              </div>
            ) : (
              <p className="badge badge--good">{t('work.top')}</p>
            )}
          </div>
          <div className="card__side">
            <button type="button" className="button button--danger-ghost" onClick={() => setConfirm('quit')}>
              {t('work.quit')}
            </button>
          </div>
        </div>
      )}
      {canRetire && (
        <button type="button" className="button button--secondary" onClick={() => setConfirm('retire')}>
          {t('work.retire')}
        </button>
      )}
      {confirm === 'quit' && job && (
        <ConfirmDialog
          title={t('work.quitTitle')}
          body={t('work.quitBody', { job: jobTitle(job.careerId, job.level, game) })}
          confirmLabel={t('work.quit')}
          danger
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            ctl.run(quitJob);
            setConfirm(null);
          }}
        />
      )}
      {confirm === 'retire' && (
        <ConfirmDialog
          title={t('work.retireTitle')}
          body={t('work.retireBody', { amount: { money: pensionWithRetirement(game) } })}
          confirmLabel={t('work.retire')}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            ctl.run(retire);
            setConfirm(null);
          }}
        />
      )}
    </div>
  );
}

function pensionWithRetirement(game: GameState): number {
  return pensionFor({ ...game, career: { ...game.career, retired: true } });
}

function MarketSection({ ctl }: { ctl: GameController }) {
  const { t, p, money } = useI18n();
  const game = ctl.game;
  const [showAll, setShowAll] = useState(false);
  if (game.character.age < 15) return null;
  const careers = CAREERS.filter((c) => !c.hidden).map((c) => ({ career: c, check: checkApplication(game, c.id) }));
  const eligible = careers.filter((c) => c.check.ok || c.check.reason === 'error.appliedThisYear');
  const shown = showAll ? careers : eligible;

  return (
    <div className="block">
      <h3 className="subsection-title">{t('work.market')}</h3>
      <p className="muted small">{t('work.marketIntro')}</p>
      {shown.length === 0 && <p className="empty">{t('work.noneEligible')}</p>}
      <ul className="card-list">
        {shown.map(({ career, check }) => (
          <li key={career.id} className="card">
            <div className="card__main">
              <p className="kicker">{t(`career.${career.id}.name`)}</p>
              <h4 className="card__title">{p(jobTitle(career.id, check.startLevel, game))}</h4>
              <p className="card__meta">
                {t('work.salary', { amount: { money: salaryFor(game, career.id, check.startLevel) } })}
                {check.ok && <> · {t('work.chance', { pct: pct(check.chance) })}</>}
              </p>
              <Requirements items={check.requirements} />
              <details className="career-path">
                <summary>{t('work.path')}</summary>
                <ol className="plain-list">
                  {career.levels.map((_, i) => (
                    <li key={i}>
                      {p(jobTitle(career.id, i, game))} · {money(salaryFor(game, career.id, i))}
                    </li>
                  ))}
                </ol>
              </details>
            </div>
            <div className="card__side">
              <button
                type="button"
                className="button button--primary"
                disabled={!check.ok || game.actions.used >= game.actions.max || game.pending !== null}
                onClick={() => ctl.run((g) => applyForJob(g, career.id))}
              >
                {t('work.apply')}
              </button>
              {!check.ok && check.reason && check.reason !== 'error.requirements' && (
                <span className="why">{t(check.reason === 'error.appliedThisYear' ? 'work.applied' : check.reason)}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="button button--ghost" onClick={() => setShowAll(!showAll)}>
        {showAll ? t('work.showEligible') : t('work.showAll')}
      </button>
    </div>
  );
}

function HistorySection({ game }: { game: GameState }) {
  const { t, p } = useI18n();
  if (game.career.history.length === 0) return null;
  return (
    <div className="block">
      <h3 className="subsection-title">{t('work.history')}</h3>
      <ul className="plain-list">
        {[...game.career.history].reverse().map((h, i) => (
          <li key={i}>
            {t('work.historyEntry', { job: p(jobTitle(h.careerId, h.level, game)), from: h.fromAge, to: h.toAge })}{' '}
            <span className="muted small">({t(`reason.${h.reason}`)})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CareerPanel({ ctl }: { ctl: GameController }) {
  const { t } = useI18n();
  const game = ctl.game;
  return (
    <section className="panel" aria-labelledby="career-title">
      <h2 id="career-title" className="section-title">
        {t('edu.title')}
      </h2>
      <SchoolSection game={game} />
      <CoursesSection ctl={ctl} />
      <LicenseSection ctl={ctl} />
      <h2 className="section-title">{t('work.title')}</h2>
      <JobSection ctl={ctl} />
      <MarketSection ctl={ctl} />
      <HistorySection game={game} />
    </section>
  );
}
