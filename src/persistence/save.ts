import { SAVE_SCHEMA } from '../engine/character';
import type { GameState } from '../engine/types';
import { type KeyValueStore, safeGet, safeRemove, safeSet } from './storage';
import { InvalidSave, validateGameState } from './validate';

export const SAVE_FORMAT = 'lifepaths-save';
export const SLOT_COUNT = 3;
export const MAX_SAVE_BYTES = 5 * 1024 * 1024;
const SLOT_PREFIX = 'lifepaths:slot:';

export type SaveErrorCode = 'parse' | 'format' | 'version' | 'invalid' | 'tooLarge' | 'storage' | 'unavailable' | 'read';

/** Save problems the UI translates as `save.error.<code>`. */
export class SaveError extends Error {
  readonly code: SaveErrorCode;
  readonly detail?: string;
  readonly version?: number;

  constructor(code: SaveErrorCode, detail?: string, version?: number) {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'SaveError';
    this.code = code;
    this.detail = detail;
    this.version = version;
  }
}

export interface SaveEnvelope {
  format: typeof SAVE_FORMAT;
  version: number;
  savedAt: string;
  game: GameState;
}

export type SlotInfo =
  | { slot: number; status: 'empty' }
  | { slot: number; status: 'corrupted'; reason: SaveErrorCode }
  | { slot: number; status: 'ok'; name: string; age: number; alive: boolean; savedAt: string };

export function slotKey(slot: number): string {
  return `${SLOT_PREFIX}${slot}`;
}

export function serialize(game: GameState): string {
  const envelope: SaveEnvelope = { format: SAVE_FORMAT, version: SAVE_SCHEMA, savedAt: new Date().toISOString(), game };
  return JSON.stringify(envelope);
}

/**
 * Upgrades older save versions in place. Version 1 is the first public
 * format; future versions add a step here (v1 → v2 → …) so old saves keep
 * working.
 */
export function migrate(envelope: { version: number; game: unknown }): { version: number; game: unknown } {
  const current = envelope;
  // Example for the future:
  // if (current.version === 1) { current.game = upgradeV1toV2(current.game); current.version = 2; }
  return current;
}

/** Parses and validates save text (from storage or an imported file). */
export function parseSave(text: string): { game: GameState; savedAt: string } {
  if (text.length > MAX_SAVE_BYTES) throw new SaveError('tooLarge');
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new SaveError('parse');
  }
  if (typeof raw !== 'object' || raw === null || (raw as { format?: unknown }).format !== SAVE_FORMAT) {
    throw new SaveError('format');
  }
  const envelope = raw as { version?: unknown; savedAt?: unknown; game?: unknown };
  if (typeof envelope.version !== 'number' || !Number.isInteger(envelope.version) || envelope.version < 1) {
    throw new SaveError('format');
  }
  if (envelope.version > SAVE_SCHEMA) throw new SaveError('version', undefined, envelope.version);
  const migrated = migrate({ version: envelope.version, game: envelope.game });
  try {
    const game = validateGameState(migrated.game);
    const savedAt = typeof envelope.savedAt === 'string' ? envelope.savedAt.slice(0, 40) : game.updatedAt;
    return { game, savedAt };
  } catch (err) {
    if (err instanceof InvalidSave) throw new SaveError('invalid', err.message);
    throw new SaveError('invalid');
  }
}

export function listSlots(store: KeyValueStore | null): SlotInfo[] {
  const out: SlotInfo[] = [];
  for (let slot = 1; slot <= SLOT_COUNT; slot++) {
    const res = safeGet(store, slotKey(slot));
    if (!res.ok || res.value === null) {
      out.push({ slot, status: 'empty' });
      continue;
    }
    try {
      const { game, savedAt } = parseSave(res.value);
      out.push({
        slot,
        status: 'ok',
        name: `${game.character.firstName} ${game.character.lastName}`,
        age: game.character.age,
        alive: game.alive,
        savedAt,
      });
    } catch (err) {
      out.push({ slot, status: 'corrupted', reason: err instanceof SaveError ? err.code : 'invalid' });
    }
  }
  return out;
}

export function loadSlot(store: KeyValueStore | null, slot: number): GameState {
  const res = safeGet(store, slotKey(slot));
  if (!res.ok) throw new SaveError(res.error);
  if (res.value === null) throw new SaveError('invalid', 'empty slot');
  return parseSave(res.value).game;
}

export function saveSlot(store: KeyValueStore | null, slot: number, game: GameState): { ok: true } | { ok: false; error: SaveErrorCode } {
  if (slot < 1 || slot > SLOT_COUNT) return { ok: false, error: 'invalid' };
  const res = safeSet(store, slotKey(slot), serialize(game));
  return res.ok ? { ok: true } : { ok: false, error: res.error };
}

export function deleteSlot(store: KeyValueStore | null, slot: number): boolean {
  return safeRemove(store, slotKey(slot)).ok;
}

export function exportFileName(game: GameState): string {
  const safe = `${game.character.firstName}-${game.character.lastName}`
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
  return `lifepaths-${safe || 'life'}-age${game.character.age}.json`;
}
