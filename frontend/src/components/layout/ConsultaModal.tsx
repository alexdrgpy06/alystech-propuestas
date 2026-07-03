import { useState } from 'react';
import type { ConsultaModalContent } from '@/types/proposal';
import { Modal } from '../detail-modal/Modal';

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
      <div className="flex justify-end gap-2">
        <button type="button" onClick={handleClose} className="rounded-lg px-4 py-2 text-[13px] font-semibold text-slate hover:bg-line-soft">
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === 'sending'}
          className="rounded-lg bg-blue px-4 py-2 text-[13px] font-bold text-white hover:bg-blue-dark disabled:opacity-60"
        >
          {status === 'sending' ? 'Enviando…' : content.submitLabel}
        </button>
      </div>
    ) : undefined;

  return (
    <Modal open={open} onClose={handleClose} title={content.title} footer={footer}>
      {status === 'done' ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-soft text-blue">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h4 className="text-base font-bold text-navy">{content.okTitle}</h4>
          <p className="text-[13px] text-slate">{content.okText}</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          <p className="text-[13px] text-slate">{content.hint}</p>
          <label className="block">
            <span className="mb-1 block text-[12px] font-semibold text-navy">Nombre y apellido</span>
            <input
              type="text"
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] font-semibold text-navy">Email</span>
            <input
              type="email"
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] font-semibold text-navy">Teléfono (opcional)</span>
            <input
              type="text"
              value={values.phone}
              onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] font-semibold text-navy">Tu consulta</span>
            <textarea
              value={values.message}
              onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
              placeholder="Escribí tu pregunta acá..."
              rows={3}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
            />
          </label>
          {status === 'error' && <p className="text-[12px] font-medium text-red">No pudimos enviar tu consulta. Probá de nuevo en un momento.</p>}
        </div>
      )}
    </Modal>
  );
}
