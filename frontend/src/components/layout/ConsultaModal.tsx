import { useState } from 'react';
import type { ConsultaModalContent } from '@/types/proposal';
import { Modal } from '../detail-modal/Modal';
import { PrimaryButton, SecondaryButton } from '../ui/ActionButton';

export interface ConsultaFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ConsultaModalProps {
  open: boolean;
  content: ConsultaModalContent;
  onClose: () => void;
  onSubmit: (values: ConsultaFormValues) => Promise<void>;
}

const EMPTY: ConsultaFormValues = { name: '', email: '', phone: '', message: '' };

const fieldLabelClass = 'mb-1.5 block font-label-caps text-label-caps text-ink-muted';
const inputClass =
  'w-full min-h-[44px] rounded-lg border border-border-slate bg-white px-3 py-2 font-body-base text-body-base text-on-surface placeholder:text-ink-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20';

export function ConsultaModal({ open, content, onClose, onSubmit }: ConsultaModalProps) {
  const [values, setValues] = useState<ConsultaFormValues>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setValues(EMPTY);
      setStatus('idle');
    }, 200);
  };

  const handleSubmit = async () => {
    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) return;
    setStatus('sending');
    try {
      await onSubmit(values);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const footer =
    status !== 'done' ? (
      <>
        <SecondaryButton onClick={handleClose} size="sm">
          <span className="font-label-caps text-label-caps">Cancelar</span>
        </SecondaryButton>
        <PrimaryButton onClick={handleSubmit} disabled={status === 'sending'} loading={status === 'sending'} size="sm">
          <span className="font-label-caps text-label-caps">{status === 'sending' ? 'Enviando…' : content.submitLabel}</span>
        </PrimaryButton>
      </>
    ) : undefined;

  return (
    <Modal open={open} onClose={handleClose} title={content.title} footer={footer}>
      {status === 'done' ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              mark_email_read
            </span>
          </div>
          <h4 className="font-headline-md text-headline-md text-on-surface">{content.okTitle}</h4>
          <p className="font-body-medium text-body-medium text-ink-secondary">{content.okText}</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          <p className="font-body-medium text-body-medium text-ink-secondary">{content.hint}</p>
          <label className="block">
            <span className={fieldLabelClass}>Nombre y apellido</span>
            <input
              type="text"
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={fieldLabelClass}>Email</span>
            <input
              type="email"
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={fieldLabelClass}>Teléfono (opcional)</span>
            <input
              type="text"
              value={values.phone}
              onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={fieldLabelClass}>Tu consulta</span>
            <textarea
              value={values.message}
              onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
              placeholder="Escribí tu pregunta acá..."
              rows={3}
              className={inputClass}
            />
          </label>
          {status === 'error' && (
            <p className="font-body-medium text-body-medium text-danger">
              No pudimos enviar tu consulta. Probá de nuevo en un momento.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
