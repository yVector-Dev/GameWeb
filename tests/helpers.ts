import { CAREERS } from '../src/content/careers';
import { COURSES } from '../src/content/courses';
import {
  ageUp,
  applyForJob,
  choiceViews,
  createNewGame,
  enrollCourse,
  findPartner,
  interact,
  listActivities,
  performActivity,
  resolveChoice,
  SKIP_CHOICE,
} from '../src/engine';
import { checkApplication } from '../src/engine/career';
import { courseAvailability } from '../src/engine/education';
import { interactionsFor } from '../src/engine/relationships';
import { Rng } from '../src/engine/rng';
import type { GameState } from '../src/engine/types';

export function newGame(seed: number | string = 42): GameState {
  return createNewGame({ firstName: 'Test', lastName: 'Player', pronouns: 'they', seed });
}

/** Resolves a pending decision with the first available choice. */
export function resolveAny(state: GameState, rng?: Rng): GameState {
  if (!state.pending) return state;
  const options = choiceViews(state).filter((v) => v.available);
  if (options.length === 0) return resolveChoice(state, SKIP_CHOICE);
  const pick = rng ? rng.pick(options) : options[0];
  return resolveChoice(state, pick.choice.id);
}

/** Ages up, resolving any decision that appears. */
export function advance(state: GameState, years: number, rng?: Rng): GameState {
  let s = state;
  for (let i = 0; i < years && s.alive; i++) {
    s = resolveAny(s, rng);
    s = ageUp(s);
    s = resolveAny(s, rng);
  }
  return s;
}

const HOBBIES = ['music', 'art', 'sports', 'writing', 'cooking', 'gardening'] as const;

/**
 * A reasonable automated player: uses its actions, studies, looks for work,
 * enrolls in courses and keeps in touch with people. Used to exercise long
 * trajectories through every system.
 */
export function playYear(state: GameState, rng: Rng): GameState {
  let s = resolveAny(state, rng);
  if (!s.alive) return s;
  const tryOp = (op: (g: GameState) => GameState) => {
    try {
      s = op(s);
    } catch {
      // The engine refused (requirements, money, budget): fine for a bot.
    }
  };

  if (s.character.age >= 17 && !s.education.enrolled && rng.chance(0.5)) {
    const options = COURSES.filter((c) => courseAvailability(s, c.id).available);
    if (options.length > 0) {
      const course = rng.pick(options);
      tryOp((g) => enrollCourse(g, course.id, rng.chance(0.5) ? 'loan' : 'savings'));
    }
  }
  if (s.character.age >= 16 && !s.career.job && !s.career.retired) {
    const open = CAREERS.filter((c) => checkApplication(s, c.id).ok);
    if (open.length > 0) tryOp((g) => applyForJob(g, rng.pick(open).id));
  }
  // Look after a partner first: date, propose, start a family.
  const partner = s.npcs.find((n) => n.alive && (n.relation === 'partner' || n.relation === 'spouse'));
  if (partner) {
    const romance = interactionsFor(s, partner).filter((v) => v.available && ['propose', 'date', 'tryChild'].includes(v.id));
    if (romance.length > 0) tryOp((g) => interact(g, partner.id, romance[0].id));
  } else if (s.character.age >= 20 && s.character.age <= 50 && rng.chance(0.3)) {
    tryOp(findPartner);
  }
  const people = s.npcs.filter((n) => n.alive);
  if (people.length > 0 && rng.chance(0.7)) {
    const npc = rng.pick(people);
    const views = interactionsFor(s, npc).filter((v) => v.available && v.id !== 'breakup');
    if (views.length > 0) tryOp((g) => interact(g, npc.id, rng.pick(views).id));
  }
  for (let i = 0; i < 6 && s.actions.used < s.actions.max; i++) {
    const options = listActivities(s).filter((a) => a.available);
    if (options.length === 0) break;
    const a = rng.pick(options);
    tryOp((g) => performActivity(g, a.def.id, a.def.hobby ? { hobby: rng.pick(HOBBIES) } : {}));
  }
  s = resolveAny(s, rng);
  s = ageUp(s);
  return resolveAny(s, rng);
}

export function playLife(seed: number, maxYears = 130): GameState {
  const rng = new Rng(seed * 7919);
  let s = newGame(seed);
  for (let i = 0; i < maxYears && s.alive; i++) s = playYear(s, rng);
  return s;
}
