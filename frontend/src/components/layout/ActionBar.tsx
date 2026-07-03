import type { Totals, CanvasContent } from '@/types/proposal';
import { formatUsd } from '@/lib/currency';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionBarProps {
  totals: Totals;
  content: CanvasContent;
  visible: boolean;
  onAccept: () => void;
  onReject: () => void;
  onConsulta: () => void;
  onDownloadPdf: () => void;
  pdfPending?: boolean;
}

export function ActionBar({
  totals,
  content,
  visible,
  onAccept,
  onReject,
  onConsulta,
  onDownloadPdf,
  pdfPending
}: ActionBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-white/95 px-4 py-4 backdrop-blur-md shadow-lg"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between sm:block">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-slate">Total Año 1</span>
                <div className="text-xl font-black text-navy">{formatUsd(totals.totalUsd)}</div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onConsulta}
                className="flex-1 sm:flex-none rounded-xl bg-slate px-4 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-slate/90"
              >
                {content.buttons.consulta}
              </button>
              <button
                type="button"
                onClick={onDownloadPdf}
                disabled={pdfPending}
                className="flex-1 sm:flex-none rounded-xl bg-navy px-4 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-navy-2 disabled:opacity-60"
              >
                {pdfPending ? '...' : content.buttons.pdf}
              </button>
              <button
                type="button"
                onClick={onReject}
                className="flex-1 sm:flex-none rounded-xl bg-red-soft px-4 py-2.5 text-[12px] font-bold text-red transition-colors hover:bg-red-soft/70"
              >
                {content.buttons.reject}
              </button>
              <button
                type="button"
                onClick={onAccept}
                className="flex-1 sm:flex-none rounded-xl bg-green px-4 py-2.5 text-[12px] font-bold text-white shadow-lg shadow-green/25 transition-colors hover:bg-green/90"
              >
                {content.buttons.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
