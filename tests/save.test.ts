import { describe, expect, it } from 'vitest';
import { ageUp, performActivity } from '../src/engine';
import { SAVE_SCHEMA } from '../src/engine/character';
import { SAVE_FORMAT, SaveError, deleteSlot, listSlots, loadSlot, parseSave, saveSlot, serialize, slotKey } from '../src/persistence/save';
import { MemoryStore } from '../src/persistence/storage';
import { loadSettings, saveSettings } from '../src/persistence/settings';
import { advance, newGame, resolveAny } from './helpers';

function strip(state: unknown): unknown {
  const copy = structuredClone(state) as { updatedAt?: string; createdAt?: string; id?: string };
  delete copy.updatedAt;
  delete copy.createdAt;
  delete copy.id;
  return copy;
}

function expectCode(fn: () => unknown, code: string) {
  try {
    fn();
  } catch (err) {
    expect(err).toBeInstanceOf(SaveError);
    expect((err as SaveError).code).toBe(code);
    return;
  }
  throw new Error(`expected SaveError ${code}`);
}

describe('save format', () => {
  it('round-trips a game through JSON', () => {
    const s = advance(newGame(51), 30);
    const parsed = parseSave(serialize(s)).game;
    expect(parsed).toEqual(s);
  });

  it('includes a format marker and version', () => {
    const envelope = JSON.parse(serialize(newGame(52)));
    expect(envelope.format).toBe(SAVE_FORMAT);
    expect(envelope.version).toBe(SAVE_SCHEMA);
  });

  it('rejects invalid JSON, foreign files, newer versions and damaged data', () => {
    expectCode(() => parseSave('{not json'), 'parse');
    expectCode(() => parseSave(JSON.stringify({ hello: 'world' })), 'format');
    const env = JSON.parse(serialize(newGame(53)));
    expectCode(() => parseSave(JSON.stringify({ ...env, version: SAVE_SCHEMA + 1 })), 'version');
    const broken = structuredClone(env);
    broken.game.character.stats.health = 500;
    expectCode(() => parseSave(JSON.stringify(broken)), 'invalid');
    const missing = structuredClone(env);
    delete missing.game.finance;
    expectCode(() => parseSave(JSON.stringify(missing)), 'invalid');
    const badEvent = structuredClone(env);
    badEvent.game.pending = { eventId: 'does_not_exist', params: {}, source: 'random', age: 0 };
    expectCode(() => parseSave(JSON.stringify(badEvent)), 'invalid');
    expectCode(() => parseSave('x'.repeat(6 * 1024 * 1024)), 'tooLarge');
  });

  it('treats imported names as plain text', () => {
    const env = JSON.parse(serialize(newGame(54)));
    env.game.character.firstName = '<b>Ana</b>';
    env.game.npcs[0].firstName = '<script>bad()</script>Bob';
    const game = parseSave(JSON.stringify(env)).game;
    expect(game.character.firstName).not.toContain('<');
    expect(game.character.firstName).toContain('Ana');
    expect(game.npcs[0].firstName).not.toContain('<');
  });
});

describe('local slots', () => {
  it('saves, lists, loads and deletes up to three slots', () => {
    const store = new MemoryStore();
    const a = newGame(61);
    const b = advance(newGame(62), 10);
    expect(saveSlot(store, 1, a).ok).toBe(true);
    expect(saveSlot(store, 3, b).ok).toBe(true);
    expect(saveSlot(store, 4, b).ok).toBe(false);
    const slots = listSlots(store);
    expect(slots.map((x) => x.status)).toEqual(['ok', 'empty', 'ok']);
    expect(loadSlot(store, 3)).toEqual(b);
    expect(deleteSlot(store, 1)).toBe(true);
    expect(listSlots(store)[0].status).toBe('empty');
  });

  it('marks damaged slots instead of crashing', () => {
    const store = new MemoryStore();
    store.setItem(slotKey(2), '{"format":"lifepaths-save","version":1,"game":{"oops":true}}');
    store.setItem(slotKey(3), 'garbage');
    const slots = listSlots(store);
    expect(slots[1].status).toBe('corrupted');
    expect(slots[2].status).toBe('corrupted');
    expect(() => loadSlot(store, 2)).toThrowError(SaveError);
  });

  it('reports storage failures without throwing', () => {
    const store = new MemoryStore();
    store.failWrites = true;
    const result = saveSlot(store, 1, newGame(63));
    expect(result).toEqual({ ok: false, error: 'storage' });
    expect(saveSlot(null, 1, newGame(63))).toEqual({ ok: false, error: 'unavailable' });
    expect(listSlots(null).every((x) => x.status === 'empty')).toBe(true);
  });

  it('keeps settings with safe fallbacks', () => {
    const store = new MemoryStore();
    expect(loadSettings(store, 'es').locale).toBe('es');
    saveSettings(store, { locale: 'pt-BR', theme: 'light', reduceMotion: true, tutorialSeen: true, lastSlot: 2 });
    expect(loadSettings(store, 'en')).toEqual({ locale: 'pt-BR', theme: 'light', reduceMotion: true, tutorialSeen: true, lastSlot: 2 });
    store.setItem('lifepaths:settings', '{"locale":"xx","theme":"neon","lastSlot":99}');
    expect(loadSettings(store, 'en')).toEqual({ locale: 'en', theme: 'dark', reduceMotion: false, tutorialSeen: false, lastSlot: null });
  });
});

describe('determinism', () => {
  it('replays the same life from the same seed and choices', () => {
    const a = advance(newGame('same-seed'), 40);
    const b = advance(newGame('same-seed'), 40);
    expect(strip(a)).toEqual(strip(b));
  });

  it('does not re-roll after reloading a save', () => {
    let s = resolveAny(advance(newGame(71), 12));
    s = performActivity(s, 'study');
    const reloaded = parseSave(serialize(s)).game;
    const direct = ageUp(s);
    const fromSave = ageUp(reloaded);
    expect(strip(fromSave)).toEqual(strip(direct));
  });
});
