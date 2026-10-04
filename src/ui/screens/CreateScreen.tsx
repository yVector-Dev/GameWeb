import { useId, useState, type FormEvent } from 'react';
import { MAX_NAME_LENGTH, randomIdentity, type NewGameOptions } from '../../engine/character';
import { Rng, seedFrom } from '../../engine/rng';
import type { Pronouns } from '../../engine/types';
import type { SlotInfo } from '../../persistence/save';
import { ConfirmDialog } from '../components/Dialog';
import { useI18n } from '../i18n';

interface Props {
  slots: SlotInfo[];
  onCreate: (options: NewGameOptions, slot: number) => void;
  onBack: () => void;
}

const PRONOUNS: Pronouns[] = ['she', 'he'];

export function CreateScreen({ slots, onCreate, onBack }: Props) {
  const { t } = useI18n();
  const id = useId();
  const firstEmpty = slots.find((s) => s.status === 'empty')?.slot ?? 1;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pronouns, setPronouns] = useState<Pronouns>('she');
  const [seed, setSeed] = useState('');
  const [slot, setSlot] = useState(firstEmpty);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);

  const randomize = () => {
    const identity = randomIdentity(new Rng(seedFrom(undefined)));
    setFirstName(identity.firstName);
    setLastName(identity.lastName);
    setPronouns(identity.pronouns);
  };

  const options = (): NewGameOptions => {
    // Blank names get a random identity, keeping the chosen pronouns.
    const fallback = randomIdentity(new Rng(seedFrom(undefined)));
    return {
      firstName: firstName.trim() || fallback.firstName,
      lastName: lastName.trim() || fallback.lastName,
      pronouns,
      seed: seed.trim() || undefined,
    };
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const target = slots.find((s) => s.slot === slot);
    if (target && target.status !== 'empty') {
      setConfirmOverwrite(true);
      return;
    }
    onCreate(options(), slot);
  };

  const occupied = slots.find((s) => s.slot === slot);
  const occupiedName = occupied?.status === 'ok' ? occupied.name : t('slots.corrupted');

  return (
    <main id="main" className="page">
      <form className="page__inner create" onSubmit={submit}>
        <header className="page__header">
          <button type="button" className="button button--ghost" onClick={onBack}>
            ← {t('common.back')}
          </button>
          <h1>{t('create.title')}</h1>
        </header>
        <p className="lead">{t('create.intro')}</p>

        <div className="create__grid">
          <label className="field" htmlFor={`${id}-first`}>
            <span className="field__label">{t('create.firstName')}</span>
            <input
              id={`${id}-first`}
              value={firstName}
              maxLength={MAX_NAME_LENGTH}
              autoComplete="off"
              onChange={(e) => setFirstName(e.target.value)}
              aria-describedby={`${id}-hint`}
            />
          </label>
          <label className="field" htmlFor={`${id}-last`}>
            <span className="field__label">{t('create.lastName')}</span>
            <input
              id={`${id}-last`}
              value={lastName}
              maxLength={MAX_NAME_LENGTH}
              autoComplete="off"
              onChange={(e) => setLastName(e.target.value)}
              aria-describedby={`${id}-hint`}
            />
          </label>
        </div>
        <p id={`${id}-hint`} className="muted small">
          {t('create.nameHint')}
        </p>

        <fieldset className="field">
          <legend className="field__label">{t('create.pronouns')}</legend>
          <div className="segmented">
            {PRONOUNS.map((p) => (
              <label key={p} className={pronouns === p ? 'is-active' : ''}>
                <input type="radio" name="pronouns" value={p} checked={pronouns === p} onChange={() => setPronouns(p)} />
                {t(`pronoun.${p}`)}
              </label>
            ))}
          </div>
        </fieldset>

        <button type="button" className="button button--ghost" onClick={randomize}>
          🎲 {t('create.random')}
        </button>

        <fieldset className="field">
          <legend className="field__label">{t('create.slot')}</legend>
          <div className="slot-picker">
            {slots.map((s) => (
              <label key={s.slot} className={`slot-option${slot === s.slot ? ' is-active' : ''}`}>
                <input type="radio" name="slot" value={s.slot} checked={slot === s.slot} onChange={() => setSlot(s.slot)} />
                <span className="slot-option__title">{t('slots.slot', { n: s.slot })}</span>
                <span className="slot-option__desc muted small">
                  {s.status === 'empty' && t('slots.empty')}
                  {s.status === 'corrupted' && t('slots.corrupted')}
                  {s.status === 'ok' && t(s.alive ? 'slots.alive' : 'slots.ended', { name: s.name, age: s.age })}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <details className="advanced">
          <summary>{t('create.advanced')}</summary>
          <label className="field" htmlFor={`${id}-seed`}>
            <span className="field__label">{t('create.seed')}</span>
            <input id={`${id}-seed`} value={seed} maxLength={40} autoComplete="off" onChange={(e) => setSeed(e.target.value)} />
            <span className="muted small">{t('create.seedHint')}</span>
          </label>
        </details>

        <div className="create__submit">
          <button type="submit" className="button button--primary button--large">
            {t('create.begin')}
          </button>
        </div>
      </form>
      {confirmOverwrite && (
        <ConfirmDialog
          title={t('slots.overwriteTitle', { n: slot })}
          body={t('slots.overwriteBody', { name: occupiedName })}
          confirmLabel={t('slots.overwrite')}
          danger
          onCancel={() => setConfirmOverwrite(false)}
          onConfirm={() => {
            setConfirmOverwrite(false);
            onCreate(options(), slot);
          }}
        />
      )}
    </main>
  );
}
