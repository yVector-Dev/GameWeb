import { describe, expect, it } from 'vitest';
import { ageUp, resolveChoice } from '../src/engine';
import type { YearContext } from '../src/engine/context';
import { EVENT_MAP } from '../src/content/events';
import { processScheduled, startEvent } from '../src/engine/events';
import { scheduleEvent } from '../src/engine/effects';
import { Rng } from '../src/engine/rng';
import type { GameState } from '../src/engine/types';
import { newGame } from './helpers';

function ctx(seed = 5): YearContext {
  return { rng: new Rng(seed), deltas: [], income: [], expenses: [], prevCounts: {} };
}

/** A clean 8-year-old with no pending decisions. */
function child(seed = 31): GameState {
  const s = structuredClone(newGame(seed));
  s.character.age = 8;
  s.year += 8;
  s.education.stage = 'primary';
  s.education.schoolYear = 3;
  s.pending = null;
  s.scheduled = [];
  return s;
}

/** Ages up until a given scheduled event becomes the pending decision. */
function ageUntil(state: GameState, eventId: string, years: number): GameState {
  let s = state;
  for (let i = 0; i < years; i++) {
    // Keep the character healthy so the test is about consequences, not death.
    s = structuredClone(s);
    s.character.stats.health = 100;
    s = ageUp(s);
    if (s.pending?.eventId === eventId) return s;
    if (s.pending) s = resolveChoice(s, firstChoice(s));
  }
  return s;
}

/** Reads the pending decision without TypeScript's stale narrowing. */
function pendingOf(s: GameState): GameState['pending'] {
  return s.pending;
}

function firstChoice(s: GameState): string {
  const def = EVENT_MAP[s.pending!.eventId];
  const free = def.choices!.find((c) => !c.requires && !c.visibleIf && !c.cost)!;
  return free.id;
}

describe('future consequences', () => {
  it('a childhood friendship returns years later', () => {
    let s = child();
    startEvent(s, new Rng(1), EVENT_MAP.new_kid, 'random');
    const friendId = s.pending!.npcId!;
    s = resolveChoice(s, 'invite');
    const item = s.scheduled.find((x) => x.eventId === 'friend_in_trouble');
    expect(item).toBeDefined();
    expect(item!.npcId).toBe(friendId);
    expect(item!.dueAge - s.character.age).toBeGreaterThanOrEqual(5);
    // Keep the friendship alive so the follow-up still makes sense.
    s.npcs.find((n) => n.id === friendId)!.bond = 100;
    s = ageUntil(s, 'friend_in_trouble', 8);
    expect(s.pending?.eventId).toBe('friend_in_trouble');
    expect(s.pending?.npcId).toBe(friendId);
  });

  it('drops a consequence that no longer makes sense (the friend is gone)', () => {
    let s = child(32);
    startEvent(s, new Rng(2), EVENT_MAP.new_kid, 'random');
    const friendId = s.pending!.npcId!;
    s = resolveChoice(s, 'invite');
    s.npcs = s.npcs.filter((n) => n.id !== friendId);
    const item = s.scheduled.find((x) => x.eventId === 'friend_in_trouble')!;
    s.character.age = item.dueAge;
    processScheduled(s, ctx());
    expect(s.pending?.eventId).not.toBe('friend_in_trouble');
    expect(s.scheduled.some((x) => x.eventId === 'friend_in_trouble')).toBe(false);
  });

  it('a risky choice gives an advantage now and a problem later', () => {
    let s = structuredClone(newGame(33));
    s.character.age = 30;
    s.year += 30;
    s.character.money = 3000;
    s.pending = null;
    s.scheduled = [];
    startEvent(s, new Rng(3), EVENT_MAP.shady_investment, 'random');
    s = resolveChoice(s, 'buy_in');
    expect(s.character.money).toBe(3000 - 2000 + 5000);
    expect(s.scheduled.some((x) => x.eventId === 'moonpenny_probe')).toBe(true);
    s = ageUntil(s, 'moonpenny_probe', 5);
    expect(s.pending?.eventId).toBe('moonpenny_probe');
  });

  it('waits for the right age when a consequence comes early', () => {
    const s = child(34);
    s.character.age = 10;
    s.flags.capsule_letter = 10;
    scheduleEvent(s, 'time_capsule_open', 12);
    s.character.age = 12;
    processScheduled(s, ctx());
    expect(s.pending).toBeNull();
    const item = s.scheduled.find((x) => x.eventId === 'time_capsule_open');
    expect(item?.dueAge).toBe(EVENT_MAP.time_capsule_open.minAge);
  });

  it('keeps one decision per year and postpones the rest', () => {
    const s = structuredClone(newGame(35));
    s.character.age = 30;
    s.pending = null;
    s.scheduled = [];
    s.flags.moonpenny = 28;
    s.flags.smoker = 25;
    scheduleEvent(s, 'moonpenny_probe', 30);
    scheduleEvent(s, 'health_scare', 30);
    processScheduled(s, ctx());
    expect(s.pending).not.toBeNull();
    expect(s.scheduled).toHaveLength(1);
    expect(s.scheduled[0].dueAge).toBe(31);
  });

  it('runs a funeral for a parent who died', () => {
    const s = structuredClone(newGame(36));
    s.character.age = 40;
    s.pending = null;
    s.scheduled = [];
    const parent = s.npcs.find((n) => n.relation === 'parent')!;
    parent.alive = false;
    parent.deathYear = s.year;
    scheduleEvent(s, 'parent_funeral', 40, parent.id);
    processScheduled(s, ctx());
    const pending = pendingOf(s);
    expect(pending?.eventId).toBe('parent_funeral');
    expect(pending?.params.npc).toBe(parent.firstName);
  });
});
