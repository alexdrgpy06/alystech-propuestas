import { useState } from 'react';
import type { DecisionModalContent } from '@/types/proposal';
import { Modal } from '../detail-modal/Modal';

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
          className={`rounded-lg px-4 py-2 text-[13px] font-bold text-white disabled:opacity-60 ${
            isAccept ? 'bg-green hover:bg-green/90' : 'bg-red hover:bg-red/90'
          }`}
        >
          {status === 'sending' ? 'Enviando…' : submitLabel}
        </button>
      </div>
    ) : undefined;

  return (
    <Modal open={kind !== null} onClose={handleClose} title={title} footer={footer}>
      {status === 'done' ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-soft text-green">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l3 3 5-6" />
            </svg>
          </div>
          <h4 className="text-base font-bold text-navy">{content.okTitle}</h4>
          <p className="text-[13px] text-slate">{content.okText}</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          <p className="text-[13px] text-slate">{hint}</p>
          <div className="rounded-lg border border-line bg-bg/60 p-3 text-[12px] text-ink">
            <b className="mb-1 block text-navy">{content.summaryLabel}</b>
            {summaryText}
          </div>
          <label className="block">
            <span className="mb-1 block text-[12px] font-semibold text-navy">Nombre y apellido</span>
            <input
              type="text"
              value={values.clientName}
              onChange={(e) => setValues((v) => ({ ...v, clientName: e.target.value }))}
              placeholder="Nombre de quien confirma"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] font-semibold text-navy">Email</span>
            <input
              type="email"
              value={values.clientEmail}
              onChange={(e) => setValues((v) => ({ ...v, clientEmail: e.target.value }))}
              placeholder="tu@empresa.com"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] font-semibold text-navy">Teléfono (opcional)</span>
            <input
              type="text"
              value={values.clientPhone}
              onChange={(e) => setValues((v) => ({ ...v, clientPhone: e.target.value }))}
              placeholder="+595..."
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] font-semibold text-navy">Comentarios (opcional)</span>
            <textarea
              value={values.comments}
              onChange={(e) => setValues((v) => ({ ...v, comments: e.target.value }))}
              placeholder="Alguna aclaración sobre la decisión..."
              rows={3}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
            />
          </label>
          {status === 'error' && (
            <p className="text-[12px] font-medium text-red">No pudimos enviar tu respuesta. Probá de nuevo en un momento.</p>
          )}
        </div>
      )}
    </Modal>
  );
}
