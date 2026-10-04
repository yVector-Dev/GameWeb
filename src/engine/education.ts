import { COURSE_MAP, getCourse, type CourseDef } from '../content/courses';
import { checkAll } from './conditions';
import {
  EngineError,
  addCounter,
  addLog,
  changeMoney,
  changeStat,
  clamp,
  livingNpcs,
  setFeedback,
  setFlag,
  transition,
} from './core';
import type { YearContext } from './context';
import { assertCanAct, spendAction } from './guards';
import type { Delta, Enrollment, Funding, GameState } from './types';
import { STAT_KEYS } from './types';

export const SCHOOL_START_AGE = 6;
export const SCHOOL_YEARS = 12;
export const SCHOOL_PASS_MARK = 30;
export const MAX_SCHOOL_REPEATS = 2;
export const LICENSE_COST = 300;

/** Interests discovered as a teenager make related courses a bit easier. */
const COURSE_INTEREST: Record<string, string> = {
  tech_it: 'interest_tech',
  uni_cs: 'interest_tech',
  uni_engineering: 'interest_tech',
  tech_health: 'interest_health',
  uni_medicine: 'interest_health',
  tech_trades: 'interest_trades',
  uni_education: 'interest_people',
  uni_law: 'interest_people',
};

const FAMILY_SHARE = { struggling: 0, modest: 0.3, comfortable: 0.6, wealthy: 1 } as const;

export function isInSchool(state: GameState): boolean {
  return state.education.stage === 'primary' || state.education.stage === 'secondary';
}

/** Share of tuition the family can cover (0 if no parent can help). */
export function familyTuitionShare(state: GameState): number {
  const share = FAMILY_SHARE[state.character.background];
  const helper = livingNpcs(state, 'parent').some((p) => p.bond >= 40);
  return helper ? share : 0;
}

export interface TuitionBreakdown {
  base: number;
  scholarship: number;
  family: number;
  student: number;
}

export function tuitionFor(state: GameState, enrollment: Pick<Enrollment, 'courseId' | 'funding' | 'scholarship'>): TuitionBreakdown {
  const course = getCourse(enrollment.courseId);
  const base = course.tuition;
  const scholarship = Math.round(base * enrollment.scholarship);
  let remaining = base - scholarship;
  let family = 0;
  if (enrollment.funding === 'family') {
    family = Math.round(remaining * familyTuitionShare(state));
    remaining -= family;
  }
  return { base, scholarship, family, student: remaining };
}

function expectedKnowledge(age: number): number {
  return Math.min(70, 10 + age * 3.3);
}

function expectedDiscipline(age: number): number {
  return Math.min(55, 8 + age * 2.2);
}

/** Baseline school performance from attributes, before effort bonuses. */
export function schoolBase(state: GameState): number {
  const { knowledge, discipline, happiness } = state.character.stats;
  const age = state.character.age;
  const relK = 50 + (knowledge - expectedKnowledge(age));
  const relD = 50 + (discipline - expectedDiscipline(age));
  return clamp(relK * 0.4 + relD * 0.3 + happiness * 0.2 + 8);
}

/** Baseline course performance from attributes. */
export function courseBase(state: GameState, course: CourseDef): number {
  const { knowledge, discipline, happiness } = state.character.stats;
  let base = knowledge * 0.35 + discipline * 0.4 + happiness * 0.15 + 5;
  if (course.kind === 'technical' || course.kind === 'adult') base += 6;
  if (state.career.job) base -= 8;
  if (state.character.traits.includes('curious')) base += 3;
  const interest = COURSE_INTEREST[course.id];
  if (interest && state.flags[interest] !== undefined) base += 4;
  return clamp(base);
}

export function processEducationYear(state: GameState, ctx: YearContext): void {
  const e = state.education;
  const c = state.character;
  const rng = ctx.rng;

  if (c.age <= 5) {
    changeStat(state, 'knowledge', 3, ctx.deltas);
    changeStat(state, 'social', 2, ctx.deltas);
    changeStat(state, 'discipline', 1, ctx.deltas);
  }

  if (e.stage === 'none' && c.age >= SCHOOL_START_AGE && c.age < 18) {
    e.stage = 'primary';
    e.schoolYear = 1;
    e.performance = clamp(Math.round(schoolBase(state)));
    addLog(state, 'log.school.start', { tone: 'milestone' });
  } else if (isInSchool(state)) {
    const yearPerf = clamp(Math.round(e.performance * 0.5 + schoolBase(state) * 0.5 + rng.int(-5, 5)));
    e.performance = yearPerf;
    changeStat(state, 'knowledge', Math.round(1 + yearPerf / 30), ctx.deltas);
    changeStat(state, 'discipline', 1, ctx.deltas);
    changeStat(state, 'social', 1, ctx.deltas);
    if (yearPerf < SCHOOL_PASS_MARK && e.repeats < MAX_SCHOOL_REPEATS) {
      e.repeats += 1;
      changeStat(state, 'happiness', -5, ctx.deltas);
      addLog(state, 'log.school.repeat', { tone: 'bad', params: { year: e.schoolYear } });
    } else {
      if (yearPerf >= 85) addCounter(state, 'honorYears');
      e.schoolYear += 1;
      if (e.schoolYear > SCHOOL_YEARS) {
        e.stage = 'graduated';
        e.diploma = true;
        changeStat(state, 'happiness', 5, ctx.deltas);
        addLog(state, 'log.school.graduated', { tone: 'milestone' });
        state.scheduled.push({ id: state.nextId + 1, eventId: 'after_school', dueAge: c.age, createdAge: c.age });
        state.nextId += 1;
      } else if (e.schoolYear === 7) {
        e.stage = 'secondary';
        addLog(state, 'log.school.secondary', { tone: 'milestone' });
      }
    }
  }

  if (e.enrolled) processCourseYear(state, ctx);
}

function processCourseYear(state: GameState, ctx: YearContext): void {
  const e = state.education;
  const enrollment = e.enrolled!;
  const course = getCourse(enrollment.courseId);
  const courseName = { t: `course.${course.id}.name` };

  // Tuition for the year just studied.
  const bill = tuitionFor(state, enrollment);
  if (bill.student > 0) {
    if (enrollment.funding === 'loan') {
      state.finance.studentDebt += bill.student;
      ctx.expenses.push({ key: 'ledger.tuitionLoan', params: { course: courseName }, amount: 0 });
      addLog(state, 'log.course.loan', { params: { course: courseName, amount: { money: bill.student } } });
    } else {
      ctx.expenses.push({ key: 'ledger.tuition', params: { course: courseName }, amount: bill.student });
    }
  }

  const perf = clamp(Math.round(enrollment.performance * 0.5 + courseBase(state, course) * 0.5 + ctx.rng.int(-6, 6)));
  enrollment.performance = perf;
  if (perf >= course.passMark) {
    enrollment.yearsDone += 1;
    changeStat(state, 'knowledge', 2, ctx.deltas);
    if (enrollment.yearsDone >= course.years) {
      completeCourse(state, course, ctx.deltas);
    } else {
      addLog(state, 'log.course.year', {
        params: { course: courseName, year: enrollment.yearsDone, total: course.years },
      });
    }
  } else {
    enrollment.failures += 1;
    changeStat(state, 'happiness', -4, ctx.deltas);
    if (enrollment.failures >= 2) {
      e.enrolled = null;
      changeStat(state, 'happiness', -6, ctx.deltas);
      setFlag(state, 'expelled');
      addLog(state, 'log.course.expelled', { tone: 'bad', params: { course: courseName } });
    } else {
      addLog(state, 'log.course.fail', { tone: 'bad', params: { course: courseName } });
    }
  }
}

function completeCourse(state: GameState, course: CourseDef, deltas: Delta[]): void {
  const e = state.education;
  e.enrolled = null;
  if (!e.completed.includes(course.id)) e.completed.push(course.id);
  for (const stat of STAT_KEYS) {
    const amount = course.reward[stat];
    if (amount) changeStat(state, stat, amount, deltas);
  }
  if (course.kind === 'adult') {
    e.diploma = true;
    if (e.stage === 'dropped') setFlag(state, 'second_chance');
  }
  setFlag(state, `grad_${course.id}`);
  addCounter(state, 'degrees');
  addLog(state, 'log.course.graduated', { tone: 'milestone', params: { course: { t: `course.${course.id}.name` } } });
}

// ---------------------------------------------------------------------------
// Player operations
// ---------------------------------------------------------------------------

export interface CourseAvailability {
  course: CourseDef;
  available: boolean;
  reason?: string;
}

export function courseAvailability(state: GameState, courseId: string): CourseAvailability {
  const course = getCourse(courseId);
  const e = state.education;
  if (e.completed.includes(course.id)) return { course, available: false, reason: 'error.courseDone' };
  if (e.enrolled) return { course, available: false, reason: 'error.alreadyEnrolled' };
  if (state.character.age < course.minAge) return { course, available: false, reason: 'error.tooYoung' };
  if (isInSchool(state)) return { course, available: false, reason: 'error.stillInSchool' };
  if (!checkAll(state, course.requires)) return { course, available: false, reason: 'error.requirements' };
  return { course, available: true };
}

export function enrollCourse(state: GameState, courseId: string, funding: Funding): GameState {
  if (!COURSE_MAP[courseId]) throw new EngineError('unknownCourse');
  return transition(state, (s) => {
    assertCanAct(s);
    const availability = courseAvailability(s, courseId);
    if (!availability.available) throw new EngineError(availability.reason ?? 'requirements');
    if (funding === 'family' && familyTuitionShare(s) === 0) throw new EngineError('noFamilyHelp');
    const course = availability.course;
    const scholarship = course.kind === 'university' ? s.education.scholarship : 0;
    const enrollment: Enrollment = {
      courseId,
      yearsDone: 0,
      performance: 55,
      failures: 0,
      startedAge: s.character.age,
      funding,
      scholarship,
    };
    if (funding !== 'loan') {
      const bill = tuitionFor(s, enrollment);
      if (s.character.money < bill.student) throw new EngineError('notEnoughMoneyTuition', { amount: { money: bill.student } });
    }
    if (scholarship > 0) s.education.scholarship = 0;
    spendAction(s);
    s.education.enrolled = enrollment;
    const params = { course: { t: `course.${courseId}.name` } };
    addLog(s, scholarship > 0 ? 'log.course.enrolledScholarship' : 'log.course.enrolled', {
      tone: 'milestone',
      params: { ...params, pct: Math.round(scholarship * 100) },
    });
    setFeedback(s, { titleKey: 'feedback.enrolled', titleParams: params, deltas: [], tone: 'milestone' });
  });
}

export function dropCourse(state: GameState): GameState {
  return transition(state, (s) => {
    assertCanAct(s, { needAction: false });
    const enrollment = s.education.enrolled;
    if (!enrollment) throw new EngineError('notEnrolled');
    s.education.enrolled = null;
    const deltas: Delta[] = [];
    changeStat(s, 'happiness', -3, deltas);
    const params = { course: { t: `course.${enrollment.courseId}.name` } };
    addLog(s, 'log.course.dropped', { tone: 'bad', params, deltas });
    setFeedback(s, { titleKey: 'feedback.dropped', titleParams: params, deltas, tone: 'bad' });
  });
}

export function licenseChance(state: GameState): number {
  const c = state.character;
  let chance = 0.45 + c.stats.discipline * 0.004 + (state.counters.licenseAttempts ?? 0) * 0.08;
  if (c.traits.includes('reckless')) chance -= 0.1;
  if (c.traits.includes('anxious')) chance -= 0.05;
  return clamp(chance, 0.1, 0.95);
}

export function takeLicenseTest(state: GameState): GameState {
  return transition(state, (s, rng) => {
    assertCanAct(s);
    if (s.character.age < 16) throw new EngineError('tooYoung');
    if (s.education.license) throw new EngineError('alreadyLicensed');
    if (s.character.money < LICENSE_COST) throw new EngineError('notEnoughMoney', { amount: { money: LICENSE_COST } });
    const chance = licenseChance(s);
    spendAction(s);
    const deltas: Delta[] = [];
    changeMoney(s, -LICENSE_COST, deltas);
    addCounter(s, 'licenseAttempts');
    if (rng.chance(chance)) {
      s.education.license = true;
      setFlag(s, 'license');
      changeStat(s, 'happiness', 4, deltas);
      addLog(s, 'log.license.pass', { tone: 'milestone', deltas });
      setFeedback(s, { titleKey: 'feedback.licensePass', deltas, tone: 'good' });
    } else {
      changeStat(s, 'happiness', -2, deltas);
      addLog(s, 'log.license.fail', { tone: 'bad', deltas });
      setFeedback(s, { titleKey: 'feedback.licenseFail', deltas, tone: 'bad' });
    }
  });
}
