import { useState } from 'react';
import type { DecisionModalContent } from '@/types/proposal';
import { Modal } from '../detail-modal/Modal';
import { PrimaryButton, SecondaryButton, DangerButton } from '../ui/ActionButton';

export interface DecisionFormValues {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  comments: string;
}

interface DecisionModalProps {
  kind: 'accept' | 'reject' | null;
  content: DecisionModalContent;
  summaryText: string;
  onClose: () => void;
  onSubmit: (values: DecisionFormValues) => Promise<void>;
}

const EMPTY: DecisionFormValues = { clientName: '', clientEmail: '', clientPhone: '', comments: '' };

const fieldLabelClass = 'mb-1.5 block font-label-caps text-label-caps text-ink-muted';
const inputClass =
  'w-full min-h-[44px] rounded-lg border border-border-slate bg-white px-3 py-2 font-body-base text-body-base text-on-surface placeholder:text-ink-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20';

export function DecisionModal({ kind, content, summaryText, onClose, onSubmit }: DecisionModalProps) {
  const [values, setValues] = useState<DecisionFormValues>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setValues(EMPTY);
      setStatus('idle');
    }, 200);
  };

  const handleSubmit = async () => {
    if (!values.clientName.trim() || !values.clientEmail.trim()) return;
    setStatus('sending');
    try {
      await onSubmit(values);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const isAccept = kind === 'accept';
  const title = isAccept ? content.acceptTitle : content.rejectTitle;
  const hint = isAccept ? content.acceptHint : content.rejectHint;
  const submitLabel = isAccept ? content.acceptSubmitLabel : content.rejectSubmitLabel;
  const SubmitButton = isAccept ? PrimaryButton : DangerButton;

  const footer =
    status !== 'done' ? (
      <>
        <SecondaryButton onClick={handleClose} size="sm">
          <span className="font-label-caps text-label-caps">Cancelar</span>
        </SecondaryButton>
        <SubmitButton onClick={handleSubmit} disabled={status === 'sending'} loading={status === 'sending'} size="sm">
          <span className="font-label-caps text-label-caps">{status === 'sending' ? 'Enviando…' : submitLabel}</span>
        </SubmitButton>
      </>
    ) : undefined;

  return (
    <Modal open={kind !== null} onClose={handleClose} title={title} footer={footer}>
      {status === 'done' ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-positive/10 text-positive">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <h4 className="font-headline-md text-headline-md text-on-surface">{content.okTitle}</h4>
          <p className="font-body-medium text-body-medium text-ink-secondary">{content.okText}</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          <p className="font-body-medium text-body-medium text-ink-secondary">{hint}</p>
          <div className="rounded-lg border border-border-slate bg-surface-container-low p-3 font-body-base text-body-base text-ink-secondary">
            <b className="mb-1 block text-on-surface">{content.summaryLabel}</b>
            {summaryText}
          </div>
          <label className="block">
            <span className={fieldLabelClass}>Nombre y apellido</span>
            <input
              type="text"
              value={values.clientName}
              onChange={(e) => setValues((v) => ({ ...v, clientName: e.target.value }))}
              placeholder="Nombre de quien confirma"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={fieldLabelClass}>Email</span>
            <input
              type="email"
              value={values.clientEmail}
              onChange={(e) => setValues((v) => ({ ...v, clientEmail: e.target.value }))}
              placeholder="tu@empresa.com"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={fieldLabelClass}>Teléfono (opcional)</span>
            <input
              type="text"
              value={values.clientPhone}
              onChange={(e) => setValues((v) => ({ ...v, clientPhone: e.target.value }))}
              placeholder="+595..."
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={fieldLabelClass}>Comentarios (opcional)</span>
            <textarea
              value={values.comments}
              onChange={(e) => setValues((v) => ({ ...v, comments: e.target.value }))}
              placeholder="Alguna aclaración sobre la decisión..."
              rows={3}
              className={inputClass}
            />
          </label>
          {status === 'error' && (
            <p className="font-body-medium text-body-medium text-danger">
              No pudimos enviar tu respuesta. Probá de nuevo en un momento.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
