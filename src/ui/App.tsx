import { useCallback, useEffect, useMemo, useState } from 'react';
import { createNewGame, type NewGameOptions } from '../engine/character';
import type { GameState, Params } from '../engine/types';
import { detectLocale, type Locale } from '../i18n/translate';
import { MAX_SAVE_BYTES, SaveError, deleteSlot, exportFileName, listSlots, loadSlot, parseSave, saveSlot, serialize, type SlotInfo } from '../persistence/save';
import { loadSettings, saveSettings, type Settings } from '../persistence/settings';
import { browserStore } from '../persistence/storage';
import { Tutorial } from './components/Tutorial';
import { I18nProvider, useI18n } from './i18n';
import { CreateScreen } from './screens/CreateScreen';
import { GameScreen } from './screens/GameScreen';
import { SlotsScreen } from './screens/SlotsScreen';
import { TitleScreen } from './screens/TitleScreen';

type Screen = { name: 'title' } | { name: 'slots' } | { name: 'create' } | { name: 'game'; slot: number; game: GameState; key: number };

export interface Toast {
  id: number;
  key: string;
  params?: Params;
  tone: 'good' | 'bad' | 'neutral';
}

export type Notify = (key: string, params?: Params, tone?: Toast['tone']) => void;

/** Triggers a JSON download of a saved life. */
export function downloadSave(game: GameState): void {
  const blob = new Blob([serialize(game)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = exportFileName(game);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readSaveFile(file: File): Promise<GameState> {
  if (file.size > MAX_SAVE_BYTES) throw new SaveError('tooLarge');
  let text: string;
  try {
    text = await file.text();
  } catch {
    throw new SaveError('read');
  }
  return parseSave(text).game;
}

export function App() {
  const store = useMemo(() => browserStore(), []);
  const [settings, setSettings] = useState<Settings>(() =>
    loadSettings(store, detectLocale(typeof navigator !== 'undefined' ? navigator.languages : undefined)),
  );

  useEffect(() => {
    const root = document.documentElement;
    root.lang = settings.locale;
    root.dataset.theme = settings.theme;
    root.dataset.motion = settings.reduceMotion ? 'reduce' : 'auto';
  }, [settings]);

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        saveSettings(store, next);
        return next;
      });
    },
    [store],
  );

  return (
    <I18nProvider locale={settings.locale}>
      <Shell store={store} settings={settings} updateSettings={updateSettings} />
    </I18nProvider>
  );
}

interface ShellProps {
  store: ReturnType<typeof browserStore>;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
}

function Shell({ store, settings, updateSettings }: ShellProps) {
  const { t } = useI18n();
  const [screen, setScreen] = useState<Screen>({ name: 'title' });
  const [slots, setSlots] = useState<SlotInfo[]>(() => listSlots(store));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  const refreshSlots = useCallback(() => setSlots(listSlots(store)), [store]);

  const notify = useCallback<Notify>((key, params, tone = 'neutral') => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list.slice(-3), { id, key, params, tone }]);
    setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 6000);
  }, []);

  const reportSaveError = useCallback(
    (err: unknown) => {
      if (err instanceof SaveError) notify(`save.error.${err.code}`, { version: err.version ?? 0 }, 'bad');
      else notify('error.unknown', undefined, 'bad');
    },
    [notify],
  );

  const openGame = useCallback(
    (slot: number, game: GameState) => {
      setScreen({ name: 'game', slot, game, key: Date.now() });
      updateSettings({ lastSlot: slot });
    },
    [updateSettings],
  );

  const create = (options: NewGameOptions, slot: number) => {
    const game = createNewGame(options);
    const saved = saveSlot(store, slot, game);
    if (!saved.ok) notify(`save.error.${saved.error}`, undefined, 'bad');
    refreshSlots();
    openGame(slot, game);
    if (!settings.tutorialSeen) setTutorialOpen(true);
  };

  const load = (slot: number) => {
    try {
      openGame(slot, loadSlot(store, slot));
    } catch (err) {
      reportSaveError(err);
      refreshSlots();
    }
  };

  const remove = (slot: number) => {
    if (deleteSlot(store, slot)) notify('slots.deleted', { n: slot });
    else notify('save.error.storage', undefined, 'bad');
    if (settings.lastSlot === slot) updateSettings({ lastSlot: null });
    refreshSlots();
  };

  const exportSlot = (slot: number) => {
    try {
      downloadSave(loadSlot(store, slot));
    } catch (err) {
      reportSaveError(err);
    }
  };

  const importInto = async (file: File, slot: number) => {
    try {
      const game = await readSaveFile(file);
      const saved = saveSlot(store, slot, game);
      if (!saved.ok) {
        notify(`save.error.${saved.error}`, undefined, 'bad');
        return;
      }
      notify('slots.imported', { n: slot }, 'good');
      refreshSlots();
    } catch (err) {
      reportSaveError(err);
    }
  };

  const goTitle = () => {
    refreshSlots();
    setScreen({ name: 'title' });
  };

  const settingsProps = {
    locale: settings.locale,
    theme: settings.theme,
    reduceMotion: settings.reduceMotion,
    onLocale: (locale: Locale) => updateSettings({ locale }),
    onTheme: (theme: 'dark' | 'light') => updateSettings({ theme }),
    onMotion: (reduceMotion: boolean) => updateSettings({ reduceMotion }),
  };

  return (
    <>
      <a className="skip-link" href="#main">
        {t('app.skipToContent')}
      </a>
      {screen.name === 'title' && (
        <TitleScreen
          settings={settingsProps}
          slots={slots}
          lastSlot={settings.lastSlot}
          storageAvailable={store !== null}
          onContinue={load}
          onNew={() => setScreen({ name: 'create' })}
          onSlots={() => setScreen({ name: 'slots' })}
          onHowToPlay={() => setTutorialOpen(true)}
        />
      )}
      {screen.name === 'slots' && (
        <SlotsScreen slots={slots} onLoad={load} onDelete={remove} onExport={exportSlot} onImport={importInto} onBack={goTitle} />
      )}
      {screen.name === 'create' && <CreateScreen slots={slots} onCreate={create} onBack={goTitle} />}
      {screen.name === 'game' && (
        <GameScreen
          key={screen.key}
          initialGame={screen.game}
          slot={screen.slot}
          store={store}
          settings={settingsProps}
          notify={notify}
          onQuit={goTitle}
          onNewLife={() => {
            refreshSlots();
            setScreen({ name: 'create' });
          }}
          onHowToPlay={() => setTutorialOpen(true)}
        />
      )}
      {tutorialOpen && (
        <Tutorial
          onClose={() => {
            setTutorialOpen(false);
            updateSettings({ tutorialSeen: true });
          }}
        />
      )}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.tone}`}>
            {t(toast.key, toast.params)}
          </div>
        ))}
      </div>
    </>
  );
}
