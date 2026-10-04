// Public API of the simulation engine. The UI only talks to these functions;
// all of them are pure (state in, new state out) and deterministic given the
// state's persisted random seed.

import * as activities from './activities';
import { checkAchievements } from './achievements';
import * as career from './career';
import * as education from './education';
import * as events from './events';
import * as extras from './extras';
import * as finance from './finance';
import * as life from './life';
import * as relationships from './relationships';
import type { GameState } from './types';
import * as yearCycle from './yearCycle';

function withChecks<A extends unknown[]>(op: (state: GameState, ...args: A) => GameState) {
  return (state: GameState, ...args: A): GameState => {
    const next = op(state, ...args);
    // `next` is a fresh copy owned by us, so it is safe to finish it in place.
    if (next.alive) checkAchievements(next);
    return next;
  };
}

export const ageUp = yearCycle.ageUp;
export const resolveChoice = events.resolveChoice;
export const performActivity = withChecks(activities.performActivity);
export const enrollCourse = withChecks(education.enrollCourse);
export const dropCourse = withChecks(education.dropCourse);
export const takeLicenseTest = withChecks(education.takeLicenseTest);
export const applyForJob = withChecks(career.applyForJob);
export const quitJob = withChecks(career.quitJob);
export const retire = withChecks(career.retire);
export const buyItem = withChecks(finance.buyItem);
export const sellItem = withChecks(finance.sellItem);
export const changeHousing = withChecks(finance.changeHousing);
export const payDebt = withChecks(finance.payDebt);
export const interact = withChecks(relationships.interact);
export const findPartner = withChecks(relationships.findPartner);
export const adoptChild = withChecks(relationships.adoptChild);
export const setDatingPreference = relationships.setDatingPreference;
export const goClubbing = withChecks(relationships.goClubbing);
export const invest = withChecks(extras.invest);
export const withdraw = withChecks(extras.withdraw);
export const performCareerAction = withChecks(extras.performCareerAction);
export const seeDoctor = withChecks(life.seeDoctor);
export const plasticSurgery = withChecks(life.plasticSurgery);
export const playLottery = withChecks(life.playLottery);
export const goToCasino = withChecks(life.goToCasino);
export const commitCrime = withChecks(life.commitCrime);
export const prisonAppeal = withChecks(life.prisonAppeal);
export const emigrate = withChecks(life.emigrate);
export { DISEASE_MAP, CRIMES, SURGERY_COST, LOTTERY_COST, EMIGRATION_COST, treatmentCost, inPrison, conditionsOf, casinoBet } from './life';
export { poolLeft, POOLS } from './guards';

export { createNewGame, randomIdentity, sanitizeName, SAVE_SCHEMA, MAX_NAME_LENGTH } from './character';
export { canAgeUp, deathChance } from './yearCycle';
export { choiceViews, computeChance, SKIP_CHOICE } from './events';
export { listActivities } from './activities';
export { buildSummary } from './summary';
export { EngineError, netWorth, npcAge, relationParam, fullName, currentPartner } from './core';
export { actionsLeft } from './guards';
export type * from './types';
