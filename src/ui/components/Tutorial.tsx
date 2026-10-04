import { useState } from 'react';
import { useI18n } from '../i18n';
import { Dialog } from './Dialog';

const STEPS = [1, 2, 3, 4] as const;

export function Tutorial({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const n = STEPS[step];
  const last = step === STEPS.length - 1;
  return (
    <Dialog title={t('tutorial.title')} onClose={onClose} kicker={t('tutorial.stepOf', { n: step + 1, total: STEPS.length })}>
      <div className="tutorial" aria-live="polite">
        <h3 className="tutorial__heading">{t(`tutorial.step${n}Title`)}</h3>
        <p>{t(`tutorial.step${n}`)}</p>
      </div>
      <div className="dialog__actions">
        {step > 0 ? (
          <button type="button" className="button button--ghost" onClick={() => setStep(step - 1)}>
            {t('tutorial.previous')}
          </button>
        ) : (
          <button type="button" className="button button--ghost" onClick={onClose}>
            {t('tutorial.skip')}
          </button>
        )}
        <button type="button" className="button button--primary" onClick={() => (last ? onClose() : setStep(step + 1))}>
          {last ? t('tutorial.done') : t('tutorial.next')}
        </button>
      </div>
    </Dialog>
  );
}
