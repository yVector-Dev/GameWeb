import { useRef, useState } from 'react';
import type { SlotInfo } from '../../persistence/save';
import { ConfirmDialog } from '../components/Dialog';
import { useI18n } from '../i18n';

interface Props {
  slots: SlotInfo[];
  onLoad: (slot: number) => void;
  onDelete: (slot: number) => void;
  onExport: (slot: number) => void;
  onImport: (file: File, slot: number) => void;
  onBack: () => void;
}

type Pending = { kind: 'delete'; slot: number } | { kind: 'import'; slot: number; file: File; name: string };

export function SlotsScreen({ slots, onLoad, onDelete, onExport, onImport, onBack }: Props) {
  const { t, date } = useI18n();
  const [confirm, setConfirm] = useState<Pending | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [importSlot, setImportSlot] = useState<number | null>(null);

  const pickFile = (slot: number) => {
    setImportSlot(slot);
    fileRef.current?.click();
  };

  const onFile = (file: File | undefined) => {
    if (!file || importSlot === null) return;
    const info = slots.find((s) => s.slot === importSlot);
    if (info && info.status === 'ok') setConfirm({ kind: 'import', slot: importSlot, file, name: info.name });
    else onImport(file, importSlot);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <main id="main" className="page">
      <div className="page__inner">
        <header className="page__header">
          <button type="button" className="button button--ghost" onClick={onBack}>
            ← {t('common.back')}
          </button>
          <h1>{t('slots.title')}</h1>
        </header>
        <p className="notice">{t('title.localNotice')}</p>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        <ul className="slot-list">
          {slots.map((s) => (
            <li key={s.slot} className={`slot slot--${s.status}`}>
              <div className="slot__info">
                <p className="kicker">{t('slots.slot', { n: s.slot })}</p>
                {s.status === 'empty' && <p className="slot__name muted">{t('slots.empty')}</p>}
                {s.status === 'corrupted' && <p className="slot__name error-text">{t('slots.corrupted')}</p>}
                {s.status === 'ok' && (
                  <>
                    <p className="slot__name">{t(s.alive ? 'slots.alive' : 'slots.ended', { name: s.name, age: s.age })}</p>
                    <p className="muted small">{t('slots.savedAt', { date: date(s.savedAt) })}</p>
                  </>
                )}
              </div>
              <div className="slot__actions">
                {s.status === 'ok' && (
                  <>
                    <button type="button" className="button button--primary" onClick={() => onLoad(s.slot)}>
                      {t('slots.load')}
                    </button>
                    <button type="button" className="button button--ghost" onClick={() => onExport(s.slot)}>
                      {t('slots.export')}
                    </button>
                  </>
                )}
                <button type="button" className="button button--ghost" onClick={() => pickFile(s.slot)}>
                  {t('slots.importHere')}
                </button>
                {s.status !== 'empty' && (
                  <button type="button" className="button button--danger-ghost" onClick={() => setConfirm({ kind: 'delete', slot: s.slot })}>
                    {t('slots.delete')}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {confirm?.kind === 'delete' && (
        <ConfirmDialog
          title={t('slots.deleteTitle')}
          body={t('slots.deleteBody', { n: confirm.slot })}
          confirmLabel={t('slots.delete')}
          danger
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            onDelete(confirm.slot);
            setConfirm(null);
          }}
        />
      )}
      {confirm?.kind === 'import' && (
        <ConfirmDialog
          title={t('slots.overwriteTitle', { n: confirm.slot })}
          body={t('slots.overwriteBody', { name: confirm.name })}
          confirmLabel={t('slots.overwrite')}
          danger
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            onImport(confirm.file, confirm.slot);
            setConfirm(null);
          }}
        />
      )}
    </main>
  );
}
