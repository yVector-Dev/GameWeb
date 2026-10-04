import { useCallback, useRef, useState } from 'react';
import { EngineError } from '../../engine';
import type { GameState, Params } from '../../engine/types';
import { saveSlot } from '../../persistence/save';
import type { KeyValueStore } from '../../persistence/storage';

export interface UiMessage {
  key: string;
  params?: Params;
}

export interface GameController {
  game: GameState;
  slot: number;
  error: UiMessage | null;
  saveFailed: boolean;
  /** Applies an engine operation, autosaves on success, reports errors. */
  run: (op: (game: GameState) => GameState) => boolean;
  clearError: () => void;
}

export function useGameController(initial: GameState, slot: number, store: KeyValueStore | null): GameController {
  const [game, setGame] = useState(initial);
  const [error, setError] = useState<UiMessage | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  // Keep the latest state in a ref so fast double clicks never apply an
  // operation twice to the same (stale) state.
  const latest = useRef(initial);

  const run = useCallback(
    (op: (g: GameState) => GameState) => {
      try {
        const next = op(latest.current);
        latest.current = next;
        setGame(next);
        setError(null);
        const saved = saveSlot(store, slot, next);
        setSaveFailed(!saved.ok);
        return true;
      } catch (err) {
        if (err instanceof EngineError) {
          setError({ key: `error.${err.code}`, params: err.params });
        } else {
          console.error(err);
          setError({ key: 'error.unknown' });
        }
        return false;
      }
    },
    [slot, store],
  );

  const clearError = useCallback(() => setError(null), []);

  return { game, slot, error, saveFailed, run, clearError };
}
