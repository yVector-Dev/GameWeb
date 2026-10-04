import type { Rng } from './rng';
import type { Delta, LedgerLine } from './types';

/** Shared scratchpad for one Age Up: every subsystem reports into it. */
export interface YearContext {
  rng: Rng;
  /** Attribute changes caused by the passage of time (not by events). */
  deltas: Delta[];
  income: LedgerLine[];
  expenses: LedgerLine[];
  /** Activity usage of the year that just ended. */
  prevCounts: Record<string, number>;
  /** Number of interactions with people in the year that just ended. */
  prevInteractions?: number;
}
