import { motion } from 'framer-motion';
import type { PlanOption } from '@/types/proposal';
import { formatUsd } from '@/lib/currency';
import { Badge } from './Badge';

interface OptionCardProps {
  option: PlanOption;
  selected: boolean;
  onSelect: () => void;
  onViewDetail: () => void;
}

export function OptionCard({ option, selected, onSelect, onViewDetail }: OptionCardProps) {
  return (
    <motion.div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      initial={false}
      animate={{
        borderColor: selected ? 'var(--color-blue)' : 'var(--color-line)',
        backgroundColor: selected ? 'var(--color-blue-soft)' : '#ffffff',
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.16 }}
      className="relative cursor-pointer rounded-xl border-2 p-4 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue"
    >
      {selected && (
        <span className="absolute right-3 top-3 text-3xs font-bold uppercase tracking-wider text-blue">Seleccionada</span>
      )}
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 pr-20">
        <span className="rounded bg-gradient-to-br from-steel to-navy-2 px-2 py-0.5 text-2xs font-extrabold tracking-wide text-white">
          {option.code}
        </span>
        <span className="text-base font-bold text-navy">{option.name}</span>
        {option.badge && <Badge badge={option.badge} />}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="text-lg font-extrabold text-navy">{formatUsd(option.priceUsd)}</span>
        <span className="text-2xs font-medium text-slate">{option.priceUnit}</span>
      </div>
      <p className="mt-2 text-md leading-relaxed text-slate">{option.description}</p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onViewDetail();
        }}
        className="mt-1 inline-flex min-h-11 items-center gap-1 text-2xs font-semibold text-blue hover:underline"
      >
        Ver detalle y desglose de costos
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </motion.div>
  );
}
