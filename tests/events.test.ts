import { describe, expect, it } from 'vitest';
import { EVENTS, EVENT_MAP } from '../src/content/events';
import { isEligible } from '../src/engine/events';
import { startJob } from '../src/engine/career';
import { createNpc } from '../src/engine/people';
import { Rng } from '../src/engine/rng';
import type { ChoiceDef, Condition, Effect, EventDef, GameState } from '../src/engine/types';
import { advance, newGame } from './helpers';

function allEffects(def: EventDef): Effect[] {
  const out: Effect[] = [...(def.effects ?? []), ...(def.onStart ?? [])];
  for (const c of def.choices ?? []) out.push(...(c.effects ?? []), ...(c.success ?? []), ...(c.failure ?? []));
  return out;
}

function flatConditions(conds: Condition[] | undefined): Condition[] {
  const out: Condition[] = [];
  for (const c of conds ?? []) {
    if (c.type === 'any') out.push(...flatConditions(c.of));
    else out.push(c);
  }
  return out;
}

// Flags the engine sets on its own (outside event data).
const ENGINE_FLAGS = new Set(['license', 'expelled', 'second_chance', 'top_of_ladder', 'retired', 'homeowner', 'debt_free', 'married', 'had_ex', 'widowed', 'expecting', 'dropped_out']);
// Scheduled events triggered by engine code rather than event data.
const ENGINE_SCHEDULED = new Set(['after_school', 'parent_funeral', 'retirement_offer']);

describe('event content', () => {
  it('has at least 60 distinct events spread over every life stage', () => {
    expect(EVENTS.length).toBeGreaterThanOrEqual(60);
    expect(new Set(EVENTS.map((e) => e.id)).size).toBe(EVENTS.length);
    const childhood = EVENTS.filter((e) => e.minAge <= 12);
    const teen = EVENTS.filter((e) => e.maxAge >= 13 && e.minAge <= 17);
    const adult = EVENTS.filter((e) => e.maxAge >= 18 && e.minAge <= 64);
    const elder = EVENTS.filter((e) => e.maxAge >= 65);
    expect(childhood.length).toBeGreaterThanOrEqual(15);
    expect(teen.length).toBeGreaterThanOrEqual(15);
    expect(adult.length).toBeGreaterThanOrEqual(25);
    expect(elder.length).toBeGreaterThanOrEqual(10);
  });

  it('has at least 8 narrative chains with follow-ups', () => {
    const chains = new Map<string, EventDef[]>();
    for (const e of EVENTS) if (e.chain) chains.set(e.chain, [...(chains.get(e.chain) ?? []), e]);
    const real = [...chains.values()].filter((list) => list.length >= 2 && list.some((e) => e.scheduledOnly || e.requiresFlags));
    expect(real.length).toBeGreaterThanOrEqual(8);
  });

  it('gives interactive events 2 to 4 choices, one of them always possible', () => {
    for (const e of EVENTS) {
      if (!e.choices) continue;
      expect(e.choices.length, e.id).toBeGreaterThanOrEqual(2);
      expect(e.choices.length, e.id).toBeLessThanOrEqual(4);
      const ids = e.choices.map((c) => c.id);
      expect(new Set(ids).size, e.id).toBe(ids.length);
      const free = e.choices.filter((c: ChoiceDef) => !c.requires && !c.visibleIf && !c.cost);
      expect(free.length, `${e.id} needs an always-available choice`).toBeGreaterThanOrEqual(1);
    }
  });

  it('defines age ranges, weights and repeat limits', () => {
    for (const e of EVENTS) {
      expect(e.minAge, e.id).toBeLessThanOrEqual(e.maxAge);
      expect(e.weight, e.id).toBeGreaterThanOrEqual(0);
      if (!e.scheduledOnly) expect(e.weight, e.id).toBeGreaterThan(0);
      // Random repeatable events need a cooldown; scheduled ones (e.g. a funeral per parent) do not.
      if ((e.maxTimes ?? 1) > 1 && !e.scheduledOnly) expect(e.cooldown ?? 0, `${e.id} repeats without cooldown`).toBeGreaterThan(0);
    }
  });

  it('only schedules events that exist, and every scheduled-only event can be reached', () => {
    const scheduled = new Set<string>(ENGINE_SCHEDULED);
    for (const e of EVENTS) {
      for (const eff of allEffects(e)) {
        if (eff.type === 'schedule') {
          expect(EVENT_MAP[eff.event], `${e.id} schedules ${eff.event}`).toBeDefined();
          scheduled.add(eff.event);
        }
      }
    }
    for (const e of EVENTS.filter((x) => x.scheduledOnly)) expect(scheduled.has(e.id), e.id).toBe(true);
  });

  it('only requires flags that something can produce', () => {
    const produced = new Set(ENGINE_FLAGS);
    for (const e of EVENTS) for (const eff of allEffects(e)) if (eff.type === 'flag') produced.add(eff.flag);
    for (const e of EVENTS) {
      const required = [...(e.requiresFlags ?? [])];
      const conds = [...flatConditions(e.conditions), ...(e.choices ?? []).flatMap((c) => flatConditions([...(c.requires ?? []), ...(c.visibleIf ?? [])]))];
      for (const c of conds) if (c.type === 'flag' && !c.not) required.push(c.flag);
      for (const flag of required) expect(produced.has(flag), `${e.id} requires unknown flag ${flag}`).toBe(true);
    }
  });
});

describe('event eligibility respects the world', () => {
  it('never offers an interaction with a dead person', () => {
    let s = structuredClone(advance(newGame(8), 8));
    s.pending = null;
    const def = EVENT_MAP.grandparent_recipe;
    s.npcs = s.npcs.filter((n) => n.relation !== 'grandparent');
    const gp = createNpc(s, new Rng(1), { relation: 'grandparent', age: 70, bond: 80 });
    s.eventHistory = {};
    expect(isEligible(s, def)).toBe(true);
    gp.alive = false;
    gp.deathYear = s.year;
    expect(isEligible(s, def)).toBe(false);
  });

  it('does not offer job events to someone without a job', () => {
    const s = structuredClone(advance(newGame(9), 30));
    s.career.job = null;
    for (const id of ['boss_credit', 'relocation_offer', 'layoffs', 'burnout', 'mentor_offer']) {
      expect(isEligible(s, EVENT_MAP[id]), id).toBe(false);
    }
    startJob(s, 'retail', 0);
    s.character.age = 30;
    expect(isEligible(s, EVENT_MAP.boss_credit)).toBe(true);
  });

  it('respects age ranges and one-time limits', () => {
    const s = structuredClone(newGame(10));
    expect(isEligible(s, EVENT_MAP.midlife_crisis)).toBe(false);
    s.character.age = 45;
    expect(isEligible(s, EVENT_MAP.midlife_crisis)).toBe(true);
    s.eventHistory.midlife_crisis = { count: 1, lastAge: 44 };
    expect(isEligible(s, EVENT_MAP.midlife_crisis)).toBe(false);
  });

  it('never picks scheduled-only follow-ups at random', () => {
    const s: GameState = structuredClone(newGame(11));
    s.character.age = 30;
    s.flags.moonpenny = 25;
    expect(isEligible(s, EVENT_MAP.moonpenny_probe)).toBe(false);
    expect(isEligible(s, EVENT_MAP.moonpenny_probe, { scheduled: true })).toBe(true);
    delete s.flags.moonpenny;
    expect(isEligible(s, EVENT_MAP.moonpenny_probe, { scheduled: true })).toBe(false);
  });

  it('keeps romance strictly between adults', () => {
    const s = structuredClone(newGame(12));
    s.character.age = 16;
    expect(isEligible(s, EVENT_MAP.meet_cute)).toBe(false);
    s.character.age = 25;
    expect(isEligible(s, EVENT_MAP.meet_cute)).toBe(true);
    const npc = createNpc(s, new Rng(3), { relation: 'partner', age: 12, bond: 50 });
    expect(s.year - npc.birthYear).toBeGreaterThanOrEqual(18);
  });
});
