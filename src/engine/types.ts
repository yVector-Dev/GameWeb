// Core data model for LifePaths. Everything in GameState is plain JSON so it
// can be persisted, exported and validated. Visible text is never stored
// here: the log keeps translation keys plus named parameters.

export const STAT_KEYS = ['health', 'happiness', 'knowledge', 'social', 'discipline', 'reputation'] as const;
export type StatKey = (typeof STAT_KEYS)[number];
export type Stats = Record<StatKey, number>;

export type Pronouns = 'he' | 'she' | 'they';
/** Grammatical gender used to pick label variants (e.g. "amigo"/"amiga"). */
export type Gender = 'm' | 'f' | 'x';

export const TRAIT_IDS = [
  'curious',
  'outgoing',
  'athletic',
  'creative',
  'diligent',
  'anxious',
  'easygoing',
  'ambitious',
  'kind',
  'reckless',
  'resilient',
] as const;
export type TraitId = (typeof TRAIT_IDS)[number];

export const HOBBY_IDS = ['music', 'art', 'sports', 'writing', 'gaming', 'cooking', 'gardening'] as const;
export type HobbyId = (typeof HOBBY_IDS)[number];

export type Background = 'struggling' | 'modest' | 'comfortable' | 'wealthy';
export type Housing = 'family' | 'rent_small' | 'rent_nice' | 'own';
export type DatingPreference = 'any' | 'm' | 'f';

export type RelationKind =
  | 'parent'
  | 'sibling'
  | 'grandparent'
  | 'friend'
  | 'partner'
  | 'spouse'
  | 'ex'
  | 'child'
  | 'mentor'
  | 'pet';

// ---------------------------------------------------------------------------
// Translatable parameters
// ---------------------------------------------------------------------------

/** A nested translation, resolved at render time in the current language. */
export interface TParam {
  t: string;
  p?: Params;
  ctx?: string;
}
export interface MoneyParam {
  money: number;
}
export type ParamValue = string | number | TParam | MoneyParam;
export type Params = Record<string, ParamValue>;

export interface Delta {
  /** Translation key for the label, e.g. "stat.knowledge" or "delta.bond". */
  key: string;
  params?: Params;
  amount: number;
  money?: boolean;
}

export type LogTone = 'neutral' | 'good' | 'bad' | 'milestone' | 'event';

export interface LogEntry {
  id: number;
  age: number;
  key: string;
  params?: Params;
  title?: string;
  tone: LogTone;
  deltas?: Delta[];
}

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

export interface NPC {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthYear: number;
  relation: RelationKind;
  bond: number;
  alive: boolean;
  deathYear?: number;
  /** Player age when this person entered the story. */
  metAge: number;
  tags: string[];
  conflict: boolean;
  lastInteractionAge: number;
  species?: 'dog' | 'cat';
  /** Translation key of the person's occupation (flavour for family). */
  occupationKey?: string;
  /** For partners: the year the relationship started. */
  sinceYear?: number;
  /** Children who left home no longer cost money. */
  independent?: boolean;
}

export interface Character {
  firstName: string;
  lastName: string;
  pronouns: Pronouns;
  age: number;
  birthYear: number;
  city: string;
  /** ISO country code; drives currency and economic difficulty. */
  country: string;
  background: Background;
  stats: Stats;
  money: number;
  traits: TraitId[];
  hobbies: Partial<Record<HobbyId, number>>;
  datingPreference: DatingPreference;
}

// ---------------------------------------------------------------------------
// Systems
// ---------------------------------------------------------------------------

export type SchoolStage = 'none' | 'primary' | 'secondary' | 'graduated' | 'dropped';
export type Funding = 'savings' | 'family' | 'loan';

export interface Enrollment {
  courseId: string;
  yearsDone: number;
  performance: number;
  failures: number;
  startedAge: number;
  funding: Funding;
  /** Share of tuition covered by a scholarship, 0..1. */
  scholarship: number;
}

export interface EducationState {
  stage: SchoolStage;
  /** School year 1..12 while in school. */
  schoolYear: number;
  performance: number;
  repeats: number;
  diploma: boolean;
  enrolled: Enrollment | null;
  completed: string[];
  /** Scholarship share earned through events, applied to the next degree. */
  scholarship: number;
  license: boolean;
}

export interface JobState {
  careerId: string;
  level: number;
  yearsInLevel: number;
  performance: number;
  startedAge: number;
  lowPerfYears: number;
}

export interface CareerRecord {
  careerId: string;
  level: number;
  fromAge: number;
  toAge: number;
  reason: 'quit' | 'fired' | 'retired' | 'laidoff' | 'changed' | 'died';
}

export interface CareerState {
  job: JobState | null;
  /** Total years worked per career id. */
  experience: Record<string, number>;
  /** Highest level ever reached per career id. */
  bestLevel: Record<string, number>;
  history: CareerRecord[];
  retired: boolean;
  /** Career ids already applied to this year (one application per year). */
  appliedThisYear: string[];
  yearsWorked: number;
  lastSalary: number;
}

export interface LedgerLine {
  key: string;
  params?: Params;
  amount: number;
}

export interface YearLedger {
  age: number;
  income: number;
  expenses: number;
  net: number;
  lines: LedgerLine[];
}

export interface FinanceState {
  housing: Housing;
  homeValue: number;
  mortgage: number;
  /** Fixed yearly mortgage payment set at purchase. */
  mortgagePayment: number;
  studentDebt: number;
  debt: number;
  assets: string[];
  /** Age at which yearly finances were last processed (idempotency guard). */
  lastProcessedAge: number;
  lastLedger: YearLedger | null;
  /** Count of consecutive years spent with consumer debt. */
  debtYears: number;
  /** Purchases that may only happen once per year (e.g. vacation). */
  boughtThisYear: string[];
}

export interface ActionBudget {
  used: number;
  max: number;
  /** How many times each activity was used this year (diminishing returns). */
  counts: Record<string, number>;
  /** Interactions per NPC this year. */
  npcCounts: Record<string, number>;
}

export interface PendingEvent {
  eventId: string;
  npcId?: string;
  params: Params;
  source: 'random' | 'scheduled';
  age: number;
}

export interface ScheduledItem {
  id: number;
  eventId: string;
  dueAge: number;
  npcId?: string;
  createdAge: number;
}

export interface EventRecord {
  count: number;
  lastAge: number;
}

export interface Feedback {
  /** Translation key of a short heading, e.g. "feedback.enrolled". */
  titleKey: string;
  titleParams?: Params;
  /** Optional narrative result. */
  textKey?: string;
  textParams?: Params;
  deltas: Delta[];
  tone: LogTone;
  /** Increments every time feedback is produced so the UI can animate it. */
  seq: number;
}

export interface Death {
  age: number;
  causeKey: string;
  year: number;
}

export interface GameState {
  schema: number;
  id: string;
  seed: number;
  rng: number;
  createdAt: string;
  updatedAt: string;
  year: number;
  character: Character;
  npcs: NPC[];
  education: EducationState;
  career: CareerState;
  finance: FinanceState;
  actions: ActionBudget;
  flags: Record<string, number>;
  counters: Record<string, number>;
  achievements: Record<string, number>;
  eventHistory: Record<string, EventRecord>;
  scheduled: ScheduledItem[];
  pending: PendingEvent | null;
  log: LogEntry[];
  nextId: number;
  feedback: Feedback | null;
  alive: boolean;
  death: Death | null;
  /** Peak values for the end-of-life summary. */
  peaks: { money: number; netWorth: number };
}

// ---------------------------------------------------------------------------
// Declarative content: conditions, effects, choices, events
// ---------------------------------------------------------------------------

export type NpcTarget = 'event' | 'parents' | 'siblings' | 'partner' | 'friends' | 'children' | 'pets' | 'family';

export type Condition =
  | { type: 'stat'; stat: StatKey; min?: number; max?: number }
  | { type: 'money'; min: number }
  | { type: 'age'; min?: number; max?: number }
  | { type: 'flag'; flag: string; not?: boolean; minYearsAgo?: number }
  | { type: 'trait'; trait: TraitId; not?: boolean }
  | { type: 'hobby'; hobby: HobbyId; min: number }
  | { type: 'employed'; not?: boolean; careerId?: string; minLevel?: number }
  | { type: 'retired'; not?: boolean }
  | { type: 'diploma'; not?: boolean }
  | { type: 'inSchool'; not?: boolean }
  | { type: 'enrolled'; not?: boolean; courseKind?: 'university' | 'technical' | 'adult' | 'graduate' }
  | { type: 'completed'; course?: string; kind?: 'university' | 'technical' | 'adult' | 'graduate'; not?: boolean }
  | { type: 'schoolPerf'; min?: number; max?: number }
  | {
      type: 'npc';
      relation: RelationKind | RelationKind[];
      tag?: string;
      minBond?: number;
      maxBond?: number;
      minNpcAge?: number;
      maxNpcAge?: number;
      conflict?: boolean;
      not?: boolean;
    }
  | { type: 'eventNpc'; minBond?: number; maxBond?: number; minNpcAge?: number; conflict?: boolean }
  | { type: 'housing'; is: Housing[]; not?: boolean }
  | { type: 'asset'; asset: string; not?: boolean }
  | { type: 'partner'; not?: boolean }
  | { type: 'debt'; min: number }
  | { type: 'counter'; counter: string; min: number }
  | { type: 'background'; is: Background[] }
  /** The current job matches a childhood dream chosen earlier. */
  | { type: 'dreamJob'; not?: boolean }
  | { type: 'any'; of: Condition[] };

export interface ChanceDef {
  base: number;
  stats?: Partial<Record<StatKey, number>>;
  traits?: Partial<Record<TraitId, number>>;
  hobbies?: Partial<Record<HobbyId, number>>;
  min?: number;
  max?: number;
}

export type Effect =
  | { type: 'stat'; stat: StatKey; amount: number }
  | { type: 'money'; amount: number }
  | { type: 'moneyPct'; pct: number; max?: number }
  | { type: 'flag'; flag: string }
  | { type: 'unflag'; flag: string }
  | { type: 'trait'; trait: TraitId; remove?: boolean }
  | { type: 'hobby'; hobby: HobbyId; amount: number }
  | { type: 'bond'; target: NpcTarget; amount: number }
  | { type: 'conflict'; target: NpcTarget; value: boolean }
  | { type: 'perf'; amount: number }
  | { type: 'schoolPerf'; amount: number }
  | { type: 'schedule'; event: string; years: [number, number]; withNpc?: boolean }
  | { type: 'cancelSchedule'; event: string }
  | {
      type: 'addNpc';
      relation: RelationKind;
      tags?: string[];
      bond: number;
      /** NPC age relative to the player's age: [min, max]. */
      ageOffset: [number, number];
      bind?: boolean;
      species?: 'dog' | 'cat';
      sameSurname?: boolean;
    }
  | { type: 'npcRelation'; relation: RelationKind }
  | { type: 'npcTag'; tag: string }
  | { type: 'removeNpc' }
  | { type: 'killNpc' }
  | { type: 'scholarship'; amount: number }
  | { type: 'startJob'; careerId: string; level: number }
  | { type: 'loseJob'; reason: 'laidoff' | 'quit' | 'fired' }
  | { type: 'retire' }
  | { type: 'promote' }
  | { type: 'sellHome' }
  | { type: 'asset'; asset: string; remove?: boolean }
  | { type: 'debt'; amount: number }
  | { type: 'counter'; counter: string; amount: number }
  | { type: 'housing'; housing: Housing }
  | { type: 'dropOut' }
  | { type: 'license' }
  | { type: 'log'; key: string; tone?: LogTone };

export interface ChoiceDef {
  id: string;
  /** Requirements shown to the player; the choice is disabled if unmet. */
  requires?: Condition[];
  /** Hidden entirely unless these hold (e.g. "blame your sibling" needs a sibling). */
  visibleIf?: Condition[];
  /** Money cost, shown on the button and deducted when chosen. */
  cost?: number;
  effects?: Effect[];
  /** If present, the choice succeeds with this probability. */
  chance?: ChanceDef;
  success?: Effect[];
  failure?: Effect[];
}

export interface NpcBinding {
  relation: RelationKind | RelationKind[];
  tag?: string;
  /** Excludes people already marked with this tag (e.g. a decision already made about them). */
  notTag?: string;
  minBond?: number;
  maxBond?: number;
  minNpcAge?: number;
  maxNpcAge?: number;
  conflict?: boolean;
  pick?: 'random' | 'highestBond' | 'lowestBond';
}

export interface WeightMod {
  when: Condition[];
  factor: number;
}

export interface EventDef {
  id: string;
  minAge: number;
  maxAge: number;
  weight: number;
  weightMods?: WeightMod[];
  /** Maximum number of times the event may happen in one life (default 1). */
  maxTimes?: number;
  /** Minimum years between repetitions. */
  cooldown?: number;
  conditions?: Condition[];
  requiresFlags?: string[];
  forbidsFlags?: string[];
  /** Only reachable through a scheduled consequence, never picked at random. */
  scheduledOnly?: boolean;
  npc?: NpcBinding;
  /** Scheduled follow-ups may refer to someone who has since died (e.g. a funeral). */
  allowDeadNpc?: boolean;
  /** Creates a new person when the event starts and binds it to the event. */
  spawnNpc?: {
    relation: RelationKind;
    /** Age relative to the player's age... */
    ageOffset?: [number, number];
    /** ...or an absolute age range (used for babies and pets). */
    age?: [number, number];
    bond: number;
    tags?: string[];
    species?: 'dog' | 'cat';
    sameSurname?: boolean;
  };
  /** Interactive events have 2-4 choices and block Age Up until resolved. */
  choices?: ChoiceDef[];
  /** Passive events apply these immediately. */
  effects?: Effect[];
  /** Applied when an interactive event starts, before the player chooses. */
  onStart?: Effect[];
  chain?: string;
  tone?: LogTone;
  /** Optional named parameter generator, e.g. a random first word. */
  extraParams?: (state: GameState, pick: <T>(items: readonly T[]) => T) => Params;
}
