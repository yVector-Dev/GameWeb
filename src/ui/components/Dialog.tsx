import { createPortal } from 'react-dom';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { useI18n } from '../i18n';

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogProps {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  /** Mandatory decisions cannot be dismissed with Escape or a close button. */
  dismissible?: boolean;
  wide?: boolean;
  kicker?: string;
}

/** Accessible modal: traps focus, restores it on close, Escape to dismiss. */
export function Dialog({ title, children, onClose, dismissible = true, wide = false, kicker }: DialogProps) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const first = node?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? node)?.focus();
    return () => {
      if (previous && document.contains(previous)) previous.focus();
    };
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && dismissible && onClose) {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !ref.current) return;
    const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const content = (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && dismissible && onClose?.()}>
      <div
        ref={ref}
        className={`dialog${wide ? ' dialog--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <header className="dialog__header">
          <div>
            {kicker && <p className="kicker">{kicker}</p>}
            <h2 id={titleId} className="dialog__title">
              {title}
            </h2>
          </div>
          {dismissible && onClose && (
            <button type="button" className="icon-button" onClick={onClose} aria-label={t('common.close')}>
              ×
            </button>
          )}
        </header>
        <div className="dialog__body">{children}</div>
      </div>
    </div>
  );
  // Render at the page root so scrolling panels never clip the dialog.
  return typeof document === 'undefined' ? content : createPortal(content, document.body);
}

interface ConfirmProps {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, body, confirmLabel, danger, onConfirm, onCancel }: ConfirmProps) {
  const { t } = useI18n();
  return (
    <Dialog title={title} onClose={onCancel}>
      <p>{body}</p>
      <div className="dialog__actions">
        <button type="button" className="button button--ghost" onClick={onCancel}>
          {t('common.cancel')}
        </button>
        <button type="button" className={`button ${danger ? 'button--danger' : 'button--primary'}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}
