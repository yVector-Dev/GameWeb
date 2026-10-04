import type { GameState } from '../engine/types';

// Narrative end-of-life titles, evaluated in order: the first rule that
// matches wins. Text: `title.<id>.name` / `title.<id>.desc`.

export interface TitleDef {
  id: string;
  matches: (state: GameState) => boolean;
}

const has = (s: GameState, flag: string) => Object.prototype.hasOwnProperty.call(s.flags, flag);
const counter = (s: GameState, key: string) => s.counters[key] ?? 0;
const finalAge = (s: GameState) => s.death?.age ?? s.character.age;
const bestLevel = (s: GameState, career: string) => s.career.bestLevel[career] ?? -1;
const yearsIn = (s: GameState, career: string) => s.career.experience[career] ?? 0;

export const TITLES: TitleDef[] = [
  { id: 'unfinished_song', matches: (s) => finalAge(s) < 30 },
  { id: 'century_keeper', matches: (s) => finalAge(s) >= 100 },
  { id: 'rock_legend', matches: (s) => has(s, 'record_deal') },
  { id: 'self_made', matches: (s) => s.peaks.netWorth >= 1_000_000 },
  { id: 'founder', matches: (s) => has(s, 'entrepreneur') },
  {
    id: 'healer',
    matches: (s) => (bestLevel(s, 'medicine') >= 1 || bestLevel(s, 'nursing') >= 1) && yearsIn(s, 'medicine') + yearsIn(s, 'nursing') >= 10,
  },
  { id: 'beloved_teacher', matches: (s) => yearsIn(s, 'teaching') >= 15 },
  {
    id: 'family_anchor',
    matches: (s) => {
      const kids = s.npcs.filter((n) => n.relation === 'child');
      return kids.length >= 2 && kids.reduce((sum, k) => sum + k.bond, 0) / kids.length >= 60;
    },
  },
  { id: 'eternal_student', matches: (s) => counter(s, 'degrees') >= 3 },
  { id: 'risk_taker', matches: (s) => counter(s, 'risks') >= 4 },
  { id: 'kind_soul', matches: (s) => counter(s, 'kindness') >= 4 },
  { id: 'late_bloomer', matches: (s) => has(s, 'second_chance') },
  {
    id: 'loyal_friend',
    matches: (s) => s.npcs.filter((n) => n.relation === 'friend' && n.bond >= 75).length >= 2,
  },
  { id: 'restless_wanderer', matches: (s) => counter(s, 'jobsHeld') >= 5 },
  { id: 'steady_hand', matches: (s) => Object.values(s.career.experience).some((y) => y >= 30) },
  { id: 'bright_spirit', matches: (s) => s.character.stats.happiness >= 75 },
  { id: 'quiet_life', matches: () => true },
];

export function pickTitle(state: GameState): string {
  return (TITLES.find((t) => t.matches(state)) ?? TITLES[TITLES.length - 1]).id;
}
