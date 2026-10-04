import { isPartTime, jobTitle } from '../engine/career';
import type { GameState } from '../engine/types';
import type { I18n } from './i18n';

export function lifeStage(age: number): string {
  if (age <= 2) return 'status.baby';
  if (age <= 12) return 'status.child';
  if (age <= 17) return 'status.teen';
  if (age <= 64) return 'status.adult';
  return 'status.senior';
}

export function currentJobTitle(game: GameState, i18n: I18n): string | null {
  const job = game.career.job;
  return job ? i18n.p(jobTitle(job.careerId, job.level, game)) : null;
}

/** One-line description of what the character is doing now. */
export function statusLine(game: GameState, i18n: I18n): string {
  const { t } = i18n;
  if (!game.alive) return t('status.deceased');
  const e = game.education;
  const parts: string[] = [];
  const title = currentJobTitle(game, i18n);
  if (e.stage === 'primary') parts.push(t('status.primary', { year: e.schoolYear }));
  else if (e.stage === 'secondary') parts.push(t('status.secondary', { year: e.schoolYear - 6 }));
  if (e.enrolled) parts.push(t('status.enrolled', { course: { t: `course.${e.enrolled.courseId}.name` } }));
  if (title) parts.push(t(isPartTime(game) ? 'status.jobStudent' : 'status.job', { job: title }));
  if (parts.length > 0) return parts.join(' · ');
  if (game.career.retired) return t('status.retired');
  if (game.character.age < 6) return t('status.toddler');
  if (game.character.age >= 18) return t('status.unemployed');
  if (e.stage === 'dropped') return t('status.dropped');
  return t('status.graduated');
}
