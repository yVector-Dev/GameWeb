import { FIRST_NAMES_F, FIRST_NAMES_M, FIRST_NAMES_X, PET_NAMES, SURNAMES } from '../content/names';
import { nextId } from './core';
import type { Rng } from './rng';
import type { GameState, Gender, NPC, RelationKind } from './types';

export function randomGender(rng: Rng): Gender {
  const roll = rng.next();
  if (roll < 0.48) return 'f';
  if (roll < 0.96) return 'm';
  return 'x';
}

export function randomFirstName(rng: Rng, gender: Gender): string {
  if (gender === 'f') return rng.pick(FIRST_NAMES_F);
  if (gender === 'm') return rng.pick(FIRST_NAMES_M);
  return rng.pick(FIRST_NAMES_X);
}

export function randomSurname(rng: Rng): string {
  return rng.pick(SURNAMES);
}

const FAMILY_RELATIONS: RelationKind[] = ['parent', 'sibling', 'grandparent', 'child'];

export interface NewNpcOptions {
  relation: RelationKind;
  age: number;
  bond: number;
  gender?: Gender;
  lastName?: string;
  tags?: string[];
  species?: 'dog' | 'cat';
  occupationKey?: string;
}

/** Creates an NPC, registers it in the state and returns it. */
export function createNpc(state: GameState, rng: Rng, options: NewNpcOptions): NPC {
  const isPet = options.relation === 'pet';
  // Family roles use grammatical m/f labels in some languages; friends,
  // partners and mentors may also be non-binary.
  const binaryOnly = isPet || FAMILY_RELATIONS.includes(options.relation);
  const gender = options.gender ?? (binaryOnly ? (rng.chance(0.5) ? 'm' : 'f') : randomGender(rng));
  let age = Math.max(0, Math.round(options.age));
  // Romance is strictly between adults.
  if ((options.relation === 'partner' || options.relation === 'spouse') && age < 18) age = 18;
  const npc: NPC = {
    id: `n${nextId(state)}`,
    firstName: isPet ? rng.pick(PET_NAMES) : randomFirstName(rng, gender),
    lastName: isPet ? '' : (options.lastName ?? randomSurname(rng)),
    gender,
    birthYear: state.year - age,
    relation: options.relation,
    bond: Math.max(0, Math.min(100, Math.round(options.bond))),
    alive: true,
    metAge: state.character.age,
    tags: options.tags ? [...options.tags] : [],
    conflict: false,
    lastInteractionAge: state.character.age,
  };
  if (options.species) npc.species = options.species;
  if (options.occupationKey) npc.occupationKey = options.occupationKey;
  if (options.relation === 'partner' || options.relation === 'spouse') npc.sinceYear = state.year;
  state.npcs.push(npc);
  return npc;
}
