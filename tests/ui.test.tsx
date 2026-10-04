import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { startEvent } from '../src/engine/events';
import { EVENT_MAP } from '../src/content/events';
import { Rng } from '../src/engine/rng';
import type { GameState } from '../src/engine/types';
import { DICTIONARIES } from '../src/i18n/locales';
import { LOCALES } from '../src/i18n/translate';
import type { GameController } from '../src/ui/hooks/useGameController';
import { I18nProvider } from '../src/ui/i18n';
import { CreateScreen } from '../src/ui/screens/CreateScreen';
import { EndScreen } from '../src/ui/screens/EndScreen';
import { GameScreen } from '../src/ui/screens/GameScreen';
import { SlotsScreen } from '../src/ui/screens/SlotsScreen';
import { TitleScreen } from '../src/ui/screens/TitleScreen';
import { AchievementsPanel } from '../src/ui/screens/game/AchievementsPanel';
import { AttributesPanel } from '../src/ui/screens/game/AttributesPanel';
import { CareerPanel } from '../src/ui/screens/game/CareerPanel';
import { EventDialog } from '../src/ui/screens/game/EventDialog';
import { MoneyPanel } from '../src/ui/screens/game/MoneyPanel';
import { PeoplePanel } from '../src/ui/screens/game/PeoplePanel';
import { ActivitiesPanel } from '../src/ui/screens/game/ActivitiesPanel';
import type { SlotInfo } from '../src/persistence/save';
import { advance, newGame, playLife } from './helpers';

const namespaces = Array.from(new Set(Object.keys(DICTIONARIES.en).map((k) => k.split('.')[0])));
const KEY_LIKE = new RegExp(`\\b(?:${namespaces.join('|')})\\.[A-Za-z0-9_]+`, 'g');

function textOf(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
}

/** Renders and checks that no raw key or {placeholder} leaks into the page. */
function check(node: React.ReactNode, locale: (typeof LOCALES)[number]['code']) {
  const html = renderToString(<I18nProvider locale={locale}>{node}</I18nProvider>);
  const text = textOf(html);
  expect(text.match(KEY_LIKE) ?? [], locale).toEqual([]);
  expect(text.match(/\{\w+\}/g) ?? [], locale).toEqual([]);
  return html;
}

function ctlFor(game: GameState): GameController {
  return { game, slot: 1, error: null, saveFailed: false, run: () => true, clearError: () => {} };
}

const settings = {
  locale: 'en' as const,
  theme: 'dark' as const,
  reduceMotion: false,
  onLocale: () => {},
  onTheme: () => {},
  onMotion: () => {},
};
const slots: SlotInfo[] = [
  { slot: 1, status: 'ok', name: 'Ana Silva', age: 33, alive: true, savedAt: '2026-01-01T10:00:00.000Z' },
  { slot: 2, status: 'corrupted', reason: 'invalid' },
  { slot: 3, status: 'empty' },
];

const adult = advance(newGame(901), 34);
const ended = playLife(902);
const withEvent = (() => {
  const s = structuredClone(advance(newGame(903), 30));
  s.pending = null;
  s.character.money = 50000;
  startEvent(s, new Rng(4), EVENT_MAP.shady_investment, 'random');
  return s;
})();

describe('interface renders in every language', () => {
  for (const { code } of LOCALES) {
    it(`${code}: title, slots and creation screens`, () => {
      check(<TitleScreen settings={settings} slots={slots} lastSlot={1} storageAvailable onContinue={() => {}} onNew={() => {}} onSlots={() => {}} onHowToPlay={() => {}} />, code);
      check(<SlotsScreen slots={slots} onLoad={() => {}} onDelete={() => {}} onExport={() => {}} onImport={() => {}} onBack={() => {}} />, code);
      check(<CreateScreen slots={slots} onCreate={() => {}} onBack={() => {}} />, code);
    });

    it(`${code}: game screen and every panel`, () => {
      const html = check(<GameScreen initialGame={adult} slot={1} store={null} settings={settings} notify={() => {}} onQuit={() => {}} onNewLife={() => {}} onHowToPlay={() => {}} />, code);
      expect(html).toContain(adult.character.firstName);
      const ctl = ctlFor(adult);
      check(<AttributesPanel game={adult} />, code);
      check(<ActivitiesPanel ctl={ctl} />, code);
      check(<CareerPanel ctl={ctl} />, code);
      check(<PeoplePanel ctl={ctl} />, code);
      check(<MoneyPanel ctl={ctl} />, code);
      check(<AchievementsPanel game={ended} />, code);
    });

    it(`${code}: a pending decision with costs and requirements`, () => {
      const html = check(<EventDialog game={withEvent} onChoose={() => {}} />, code);
      expect(html).toContain('role="dialog"');
    });

    it(`${code}: end-of-life summary`, () => {
      const html = check(<EndScreen game={ended} onNewLife={() => {}} onQuit={() => {}} onExport={() => {}} />, code);
      expect(html).toContain(ended.character.firstName);
    });
  }
});
