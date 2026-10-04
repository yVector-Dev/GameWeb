import { CAREER_MAP } from './careers';
import { COURSE_MAP } from './courses';
import type { GameState } from '../engine/types';

// Local achievements. Text: `ach.<id>.name` / `ach.<id>.desc`.

export interface AchievementDef {
  id: string;
  check: (state: GameState) => boolean;
}

const has = (s: GameState, flag: string) => Object.prototype.hasOwnProperty.call(s.flags, flag);
const counter = (s: GameState, key: string) => s.counters[key] ?? 0;

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'graduate', check: (s) => s.education.completed.some((id) => COURSE_MAP[id]?.kind === 'university') },
  { id: 'masters', check: (s) => s.education.completed.includes('grad_masters') },
  { id: 'second_chance', check: (s) => has(s, 'second_chance') },
  { id: 'top_of_ladder', check: (s) => has(s, 'top_of_ladder') },
  {
    id: 'dream_job',
    check: (s) => {
      const job = s.career.job;
      const dream = job ? CAREER_MAP[job.careerId]?.dream : undefined;
      return dream !== undefined && has(s, `dream_${dream}`);
    },
  },
  { id: 'entrepreneur', check: (s) => has(s, 'entrepreneur') },
  { id: 'millionaire', check: (s) => s.peaks.money >= 1_000_000 },
  { id: 'homeowner', check: (s) => has(s, 'homeowner') },
  { id: 'debt_free', check: (s) => has(s, 'debt_free') },
  { id: 'kindred_spirit', check: (s) => s.npcs.some((n) => n.alive && n.relation === 'friend' && n.bond >= 90) },
  {
    id: 'lifelong_friend',
    check: (s) => s.character.age >= 60 && s.npcs.some((n) => n.alive && n.tags.includes('childhood_friend') && n.relation === 'friend' && n.bond >= 50),
  },
  { id: 'big_family', check: (s) => counter(s, 'children') >= 3 },
  { id: 'pet_lover', check: (s) => counter(s, 'pets') >= 2 },
  { id: 'honest_soul', check: (s) => counter(s, 'honesty') >= 3 },
  { id: 'marathoner', check: (s) => has(s, 'marathon') },
  { id: 'rock_star', check: (s) => has(s, 'record_deal') },
  { id: 'globetrotter', check: (s) => counter(s, 'trips') >= 3 },
  { id: 'scholar', check: (s) => s.character.stats.knowledge >= 95 },
  { id: 'serenity', check: (s) => s.character.age >= 70 && s.character.stats.happiness >= 90 },
  { id: 'mentor', check: (s) => has(s, 'mentored_someone') },
  { id: 'golden_years', check: (s) => s.career.retired && s.character.age >= 80 },
  { id: 'centenarian', check: (s) => s.character.age >= 100 },
];
