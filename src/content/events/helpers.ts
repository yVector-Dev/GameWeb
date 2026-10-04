import type { ChanceDef, Condition, Effect, HobbyId, NpcTarget, StatKey, TraitId } from '../../engine/types';

// Small constructors that keep event data readable.

export const st = (stat: StatKey, amount: number): Effect => ({ type: 'stat', stat, amount });
export const health = (n: number) => st('health', n);
export const happy = (n: number) => st('happiness', n);
export const know = (n: number) => st('knowledge', n);
export const social = (n: number) => st('social', n);
export const disc = (n: number) => st('discipline', n);
export const rep = (n: number) => st('reputation', n);
export const money = (amount: number): Effect => ({ type: 'money', amount });
export const flag = (name: string): Effect => ({ type: 'flag', flag: name });
export const unflag = (name: string): Effect => ({ type: 'unflag', flag: name });
export const hobby = (h: HobbyId, amount: number): Effect => ({ type: 'hobby', hobby: h, amount });
export const bond = (target: NpcTarget, amount: number): Effect => ({ type: 'bond', target, amount });
export const conflict = (target: NpcTarget, value: boolean): Effect => ({ type: 'conflict', target, value });
export const perf = (amount: number): Effect => ({ type: 'perf', amount });
export const schoolPerf = (amount: number): Effect => ({ type: 'schoolPerf', amount });
export const count = (counter: string, amount = 1): Effect => ({ type: 'counter', counter, amount });
export const trait = (t: TraitId): Effect => ({ type: 'trait', trait: t });
export const schedule = (event: string, min: number, max: number, withNpc = false): Effect => ({
  type: 'schedule',
  event,
  years: [min, max],
  withNpc,
});
export const tag = (name: string): Effect => ({ type: 'npcTag', tag: name });
export const removeNpc: Effect = { type: 'removeNpc' };
export const killNpc: Effect = { type: 'killNpc' };
export const kindness = count('kindness');
export const honesty = count('honesty');
export const risk = count('risks');

export const chance = (base: number, extra: Omit<ChanceDef, 'base'> = {}): ChanceDef => ({ base, ...extra });

export const hasFlag = (name: string): Condition => ({ type: 'flag', flag: name });
export const noFlag = (name: string): Condition => ({ type: 'flag', flag: name, not: true });
export const statMin = (stat: StatKey, min: number): Condition => ({ type: 'stat', stat, min });
export const employed: Condition = { type: 'employed' };
export const unemployed: Condition = { type: 'employed', not: true };
export const inSchool: Condition = { type: 'inSchool' };
export const any = (...of: Condition[]): Condition => ({ type: 'any', of });
