import { getCountry, wageRatio } from '../content/countries';
import { CAREER_MAP } from '../content/careers';
import { loseJob, retireNow, startJob, jobTitle } from './career';
import {
  addCounter,
  addLog,
  changeBond,
  changeMoney,
  changeStat,
  clamp,
  currentPartner,
  findNpc,
  livingNpcs,
  nextId,
  npcAge,
  setFlag,
} from './core';
import { isInSchool } from './education';
import { createNpc } from './people';
import type { Rng } from './rng';
import type { Delta, Effect, GameState, NPC, NpcTarget, Params } from './types';

export interface EffectContext {
  rng: Rng;
  deltas: Delta[];
  npcId?: string;
  params?: Params;
}

export function resolveTargets(state: GameState, target: NpcTarget, npcId?: string): NPC[] {
  switch (target) {
    case 'event': {
      const npc = findNpc(state, npcId);
      return npc && npc.alive ? [npc] : [];
    }
    case 'parents':
      return livingNpcs(state, 'parent');
    case 'siblings':
      return livingNpcs(state, 'sibling');
    case 'partner': {
      const partner = currentPartner(state);
      return partner ? [partner] : [];
    }
    case 'friends':
      return livingNpcs(state, 'friend');
    case 'children':
      return livingNpcs(state, 'child');
    case 'pets':
      return livingNpcs(state, 'pet');
    case 'family':
      return livingNpcs(state, ['parent', 'sibling', 'grandparent', 'partner', 'spouse', 'child']);
  }
}

export function scheduleEvent(state: GameState, eventId: string, dueAge: number, npcId?: string): void {
  state.scheduled.push({ id: nextId(state), eventId, dueAge, npcId, createdAge: state.character.age });
}

export function applyEffects(state: GameState, effects: Effect[] | undefined, ctx: EffectContext): void {
  if (!effects) return;
  for (const effect of effects) applyEffect(state, effect, ctx);
}

function applyEffect(state: GameState, effect: Effect, ctx: EffectContext): void {
  const c = state.character;
  switch (effect.type) {
    case 'stat':
      changeStat(state, effect.stat, effect.amount, ctx.deltas);
      break;
    case 'money': {
      // Costs never push savings below zero: the shortfall becomes debt.
      if (effect.amount < 0 && c.money + effect.amount < 0) {
        const paid = Math.max(0, c.money);
        changeMoney(state, -paid, ctx.deltas);
        state.finance.debt += -effect.amount - paid;
        ctx.deltas.push({ key: 'delta.debt', amount: -effect.amount - paid, money: true });
      } else {
        const gain = effect.amount > 0 ? Math.round(effect.amount * wageRatio(getCountry(c.country))) : effect.amount;
        changeMoney(state, gain, ctx.deltas);
      }
      break;
    }
    case 'moneyPct': {
      let amount = Math.round(Math.max(0, c.money) * effect.pct);
      if (effect.max !== undefined) amount = Math.sign(amount) * Math.min(Math.abs(amount), effect.max);
      changeMoney(state, amount, ctx.deltas);
      break;
    }
    case 'flag':
      setFlag(state, effect.flag);
      break;
    case 'unflag':
      delete state.flags[effect.flag];
      break;
    case 'trait':
      if (effect.remove) c.traits = c.traits.filter((t) => t !== effect.trait);
      else if (!c.traits.includes(effect.trait)) {
        c.traits.push(effect.trait);
        ctx.deltas.push({ key: 'delta.trait', params: { trait: { t: `trait.${effect.trait}.name` } }, amount: 1 });
      }
      break;
    case 'hobby': {
      const before = c.hobbies[effect.hobby] ?? 0;
      const after = clamp(before + effect.amount);
      c.hobbies[effect.hobby] = after;
      if (after !== before) ctx.deltas.push({ key: 'delta.hobby', params: { hobby: { t: `hobby.${effect.hobby}` } }, amount: after - before });
      break;
    }
    case 'bond':
      for (const npc of resolveTargets(state, effect.target, ctx.npcId)) {
        changeBond(state, npc, effect.amount, ctx.deltas);
        npc.lastInteractionAge = c.age;
      }
      break;
    case 'conflict':
      for (const npc of resolveTargets(state, effect.target, ctx.npcId)) npc.conflict = effect.value;
      break;
    case 'perf':
      if (state.career.job) {
        state.career.job.performance = clamp(state.career.job.performance + effect.amount);
        ctx.deltas.push({ key: 'delta.performance', amount: effect.amount });
      }
      break;
    case 'schoolPerf':
      if (isInSchool(state)) state.education.performance = clamp(state.education.performance + effect.amount);
      else if (state.education.enrolled) state.education.enrolled.performance = clamp(state.education.enrolled.performance + effect.amount);
      break;
    case 'schedule': {
      const due = c.age + ctx.rng.int(effect.years[0], effect.years[1]);
      scheduleEvent(state, effect.event, due, effect.withNpc ? ctx.npcId : undefined);
      break;
    }
    case 'cancelSchedule':
      state.scheduled = state.scheduled.filter((s) => s.eventId !== effect.event);
      break;
    case 'addNpc': {
      const age = c.age + ctx.rng.int(effect.ageOffset[0], effect.ageOffset[1]);
      const npc = createNpc(state, ctx.rng, {
        relation: effect.relation,
        age,
        bond: effect.bond,
        tags: effect.tags,
        species: effect.species,
        lastName: effect.sameSurname ? c.lastName : undefined,
      });
      if (effect.bind) ctx.npcId = npc.id;
      if (effect.relation === 'child') addCounter(state, 'children');
      if (effect.relation === 'pet') addCounter(state, 'pets');
      break;
    }
    case 'npcRelation': {
      const npc = findNpc(state, ctx.npcId);
      if (!npc || !npc.alive) break;
      const romantic = effect.relation === 'partner' || effect.relation === 'spouse';
      // Romance only between adults, and only one partner at a time.
      if (romantic && (c.age < 18 || npcAge(state, npc) < 18 || (currentPartner(state) && currentPartner(state) !== npc))) break;
      npc.relation = effect.relation;
      if (romantic && !npc.sinceYear) npc.sinceYear = state.year;
      if (effect.relation === 'ex' && !npc.tags.includes('old_flame')) npc.tags.push('old_flame');
      break;
    }
    case 'npcTag': {
      const npc = findNpc(state, ctx.npcId);
      if (npc && !npc.tags.includes(effect.tag)) npc.tags.push(effect.tag);
      break;
    }
    case 'removeNpc':
      if (ctx.npcId) state.npcs = state.npcs.filter((n) => n.id !== ctx.npcId);
      break;
    case 'killNpc': {
      const npc = findNpc(state, ctx.npcId);
      if (npc && npc.alive) {
        npc.alive = false;
        npc.deathYear = state.year;
      }
      break;
    }
    case 'scholarship':
      state.education.scholarship = clamp(Math.max(state.education.scholarship, effect.amount), 0, 1);
      break;
    case 'startJob':
      if (CAREER_MAP[effect.careerId]) {
        startJob(state, effect.careerId, effect.level);
        addLog(state, 'log.job.hired', { tone: 'milestone', params: { job: jobTitle(effect.careerId, effect.level, state) } });
      }
      break;
    case 'loseJob':
      if (loseJob(state, effect.reason) && effect.reason === 'laidoff') addCounter(state, 'layoffs');
      break;
    case 'retire':
      retireNow(state);
      break;
    case 'promote': {
      const job = state.career.job;
      if (!job) break;
      const career = CAREER_MAP[job.careerId];
      if (!career || job.level >= career.levels.length - 1) break;
      job.level += 1;
      job.yearsInLevel = 0;
      state.career.bestLevel[job.careerId] = Math.max(state.career.bestLevel[job.careerId] ?? 0, job.level);
      addCounter(state, 'promotions');
      if (job.level === career.levels.length - 1 && career.levels.length >= 4) setFlag(state, 'top_of_ladder');
      addLog(state, 'log.job.promoted', { tone: 'milestone', params: { job: jobTitle(job.careerId, job.level, state) } });
      break;
    }
    case 'sellHome': {
      const f = state.finance;
      if (f.housing !== 'own') break;
      const equity = f.homeValue - f.mortgage;
      changeMoney(state, equity, ctx.deltas);
      f.homeValue = 0;
      f.mortgage = 0;
      f.mortgagePayment = 0;
      f.housing = 'rent_small';
      break;
    }
    case 'asset':
      if (effect.remove) state.finance.assets = state.finance.assets.filter((a) => a !== effect.asset);
      else if (!state.finance.assets.includes(effect.asset)) state.finance.assets.push(effect.asset);
      break;
    case 'debt':
      state.finance.debt = Math.max(0, state.finance.debt + effect.amount);
      break;
    case 'counter':
      addCounter(state, effect.counter, effect.amount);
      break;
    case 'housing':
      if (effect.housing !== 'own') state.finance.housing = effect.housing;
      break;
    case 'dropOut':
      if (isInSchool(state)) {
        state.education.stage = 'dropped';
        setFlag(state, 'dropped_out');
      }
      break;
    case 'license':
      state.education.license = true;
      setFlag(state, 'license');
      break;
    case 'log':
      addLog(state, effect.key, { tone: effect.tone ?? 'neutral', params: ctx.params });
      break;
  }
}
