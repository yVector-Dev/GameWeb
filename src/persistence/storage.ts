// Thin, failure-tolerant wrapper around localStorage. Every call reports
// failures instead of throwing, so the game keeps running in memory when the
// browser blocks storage (private mode, quota exceeded, disabled cookies…).

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type StorageResult<T> = { ok: true; value: T } | { ok: false; error: 'unavailable' | 'storage' };

export function browserStore(): KeyValueStore | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const probe = '__lifepaths_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

/** In-memory fallback with the same interface (also used by tests). */
export class MemoryStore implements KeyValueStore {
  private data = new Map<string, string>();
  failWrites = false;

  getItem(key: string): string | null {
    return this.data.has(key) ? this.data.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    if (this.failWrites) throw new Error('QuotaExceededError');
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }
}

export function safeGet(store: KeyValueStore | null, key: string): StorageResult<string | null> {
  if (!store) return { ok: false, error: 'unavailable' };
  try {
    return { ok: true, value: store.getItem(key) };
  } catch {
    return { ok: false, error: 'storage' };
  }
}

export function safeSet(store: KeyValueStore | null, key: string, value: string): StorageResult<true> {
  if (!store) return { ok: false, error: 'unavailable' };
  try {
    store.setItem(key, value);
    return { ok: true, value: true };
  } catch {
    return { ok: false, error: 'storage' };
  }
}

export function safeRemove(store: KeyValueStore | null, key: string): StorageResult<true> {
  if (!store) return { ok: false, error: 'unavailable' };
  try {
    store.removeItem(key);
    return { ok: true, value: true };
  } catch {
    return { ok: false, error: 'storage' };
  }
}
