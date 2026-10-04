import { ACHIEVEMENTS } from '../content/achievements';
import { CAREERS } from '../content/careers';
import { pickTitle } from '../content/titles';
import { netWorth, npcAge } from './core';
import type { GameState, LogEntry, NPC } from './types';

export interface LifeSummary {
  firstName: string;
  lastName: string;
  pronouns: GameState['character']['pronouns'];
  finalAge: number;
  birthYear: number;
  endYear: number;
  causeKey: string | null;
  titleId: string;
  highlights: LogEntry[];
  diploma: boolean;
  completedCourses: string[];
  bestJob: { careerId: string; level: number } | null;
  jobsHeld: number;
  yearsWorked: number;
  retired: boolean;
  money: number;
  netWorth: number;
  peakNetWorth: number;
  debt: number;
  relationships: Array<{ npc: NPC; age: number }>;
  achievements: Array<{ id: string; age: number }>;
  achievementTotal: number;
  children: number;
}

const HIGHLIGHT_LIMIT = 14;

function pickHighlights(log: LogEntry[]): LogEntry[] {
  const milestones = log.filter(
    (e) => e.tone === 'milestone' && e.key !== 'log.achievement' && !e.key.startsWith('log.year'),
  );
  // Results of decisions are the heart of the story: keep a few of them too.
  const decisions = log.filter((e) => e.key.startsWith('ev.') && e.key.includes('.r.') && (e.deltas?.length ?? 0) > 0);
  const merged = [...milestones, ...decisions.filter((_, i) => i % 3 === 0)];
  const unique = Array.from(new Map(merged.map((e) => [e.id, e])).values()).sort((a, b) => a.id - b.id);
  if (unique.length <= HIGHLIGHT_LIMIT) return unique;
  // Keep the first and last entries, sample the middle evenly.
  const out: LogEntry[] = [];
  const step = (unique.length - 1) / (HIGHLIGHT_LIMIT - 1);
  for (let i = 0; i < HIGHLIGHT_LIMIT; i++) out.push(unique[Math.round(i * step)]);
  return Array.from(new Map(out.map((e) => [e.id, e])).values());
}

function bestJob(state: GameState): { careerId: string; level: number } | null {
  let best: { careerId: string; level: number; salary: number } | null = null;
  for (const career of CAREERS) {
    const level = state.career.bestLevel[career.id];
    if (level === undefined) continue;
    const salary = career.levels[level].salary;
    if (!best || salary > best.salary) best = { careerId: career.id, level, salary };
  }
  return best ? { careerId: best.careerId, level: best.level } : null;
}

export function buildSummary(state: GameState): LifeSummary {
  const relationships = state.npcs
    .filter((n) => n.relation !== 'ex' || n.bond >= 50)
    .sort((a, b) => b.bond - a.bond)
    .slice(0, 6)
    .map((npc) => ({ npc, age: npcAge(state, npc) }));
  return {
    firstName: state.character.firstName,
    lastName: state.character.lastName,
    pronouns: state.character.pronouns,
    finalAge: state.death?.age ?? state.character.age,
    birthYear: state.character.birthYear,
    endYear: state.death?.year ?? state.year,
    causeKey: state.death?.causeKey ?? null,
    titleId: pickTitle(state),
    highlights: pickHighlights(state.log),
    diploma: state.education.diploma,
    completedCourses: [...state.education.completed],
    bestJob: bestJob(state),
    jobsHeld: state.counters.jobsHeld ?? 0,
    yearsWorked: state.career.yearsWorked,
    retired: state.career.retired,
    money: state.character.money,
    netWorth: netWorth(state),
    peakNetWorth: Math.max(state.peaks.netWorth, netWorth(state)),
    debt: state.finance.debt + state.finance.studentDebt,
    relationships,
    achievements: Object.entries(state.achievements)
      .map(([id, age]) => ({ id, age }))
      .sort((a, b) => a.age - b.age),
    achievementTotal: ACHIEVEMENTS.length,
    children: state.npcs.filter((n) => n.relation === 'child').length,
  };
}
