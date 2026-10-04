import type { EventDef } from '../../engine/types';
import { ADULT_EVENTS } from './adult';
import { CHILDHOOD_EVENTS } from './childhood';
import { ELDER_EVENTS } from './elder';
import { TEEN_EVENTS } from './teen';

export const EVENTS: EventDef[] = [...CHILDHOOD_EVENTS, ...TEEN_EVENTS, ...ADULT_EVENTS, ...ELDER_EVENTS];

export const EVENT_MAP: Record<string, EventDef> = {};
for (const def of EVENTS) {
  if (EVENT_MAP[def.id]) throw new Error(`Duplicate event id: ${def.id}`);
  EVENT_MAP[def.id] = def;
}
