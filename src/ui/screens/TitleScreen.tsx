import type { SlotInfo } from '../../persistence/save';
import { SettingsBar, type SettingsProps } from '../components/SettingsBar';
import { useI18n } from '../i18n';

interface Props {
  settings: SettingsProps;
  slots: SlotInfo[];
  lastSlot: number | null;
  storageAvailable: boolean;
  onContinue: (slot: number) => void;
  onNew: () => void;
  onSlots: () => void;
  onHowToPlay: () => void;
}

export function TitleScreen({ settings, slots, lastSlot, storageAvailable, onContinue, onNew, onSlots, onHowToPlay }: Props) {
  const { t } = useI18n();
  const ok = slots.filter((s): s is Extract<SlotInfo, { status: 'ok' }> => s.status === 'ok');
  const alive = ok.filter((s) => s.alive);
  const preferred = alive.find((s) => s.slot === lastSlot) ?? [...alive].sort((a, b) => b.savedAt.localeCompare(a.savedAt))[0];

  return (
    <main id="main" className="title-screen">
      <div className="title-screen__inner">
        <header className="title-screen__header">
          <p className="kicker">{t('app.tagline')}</p>
          <h1 className="logo">
            Life<span>Paths</span>
          </h1>
          <svg className="logo-trail" viewBox="0 0 240 24" aria-hidden="true">
            <path d="M2 18 C 40 2, 70 22, 110 10 S 180 2, 238 14" />
            <circle cx="2" cy="18" r="2.5" />
            <circle cx="238" cy="14" r="2.5" />
          </svg>
        </header>

        <nav className="title-menu" aria-label={t('common.menu')}>
          {preferred && (
            <button type="button" className="button button--primary button--large" onClick={() => onContinue(preferred.slot)}>
              <span>{t('title.continue')}</span>
              <small>{t('title.continueHint', { name: preferred.name, age: preferred.age })}</small>
            </button>
          )}
          <button type="button" className={`button button--large ${preferred ? 'button--secondary' : 'button--primary'}`} onClick={onNew}>
            {t('title.newLife')}
          </button>
          <button type="button" className="button button--ghost button--stacked" onClick={onSlots}>
            <span>{t('title.load')}</span>
            <small>{t('title.import')}</small>
          </button>
          <button type="button" className="button button--ghost" onClick={onHowToPlay}>
            {t('title.howToPlay')}
          </button>
        </nav>

        <section className="title-settings" aria-label={t('settings.title')}>
          <SettingsBar settings={settings} />
        </section>

        <footer className="title-footer">
          <p className="notice">{storageAvailable ? t('title.localNotice') : t('save.error.unavailable')}</p>
          <p className="muted">{t('title.footer')}</p>
        </footer>
      </div>
    </main>
  );
}
