import type { Totals } from '@/types/proposal';
import { formatUsd } from '@/lib/currency';
import { motion, AnimatePresence } from 'framer-motion';

interface StickyTotalBarProps {
  totals: Totals;
  visible: boolean;
}

export function StickyTotalBar({ totals, visible }: StickyTotalBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 right-0 top-0 z-40 border-b border-line bg-white/90 px-4 py-3 backdrop-blur-md shadow-sm"
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate">Total estimado Año 1</span>
              <div className="text-lg font-black text-navy">{formatUsd(totals.totalUsd)}</div>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate">Recurrente</span>
              <div className="text-[13px] font-bold text-navy">
                {formatUsd(totals.recurUsd)}<span className="text-[11px] font-normal text-slate">/año</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
