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
      className={`group relative cursor-pointer rounded-xl border-2 p-6 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-blue flex flex-col h-full ${selected ? 'shadow-lg bg-gradient-to-br from-blue-50/50 to-transparent' : 'shadow-md hover:shadow-lg'}`}
    >
      {selected ? (
        <span className="absolute right-4 top-4 text-3xs font-bold uppercase tracking-wider text-blue">Seleccionada</span>
      ) : (
        <span className="absolute right-4 top-4 text-3xs font-bold uppercase tracking-wider text-slate/50 opacity-0 transition-opacity group-hover:opacity-100 md:opacity-100">Seleccionar</span>
      )}
      <div className="flex flex-col flex-grow gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pr-24">
          <span className="rounded bg-gradient-to-br from-steel to-navy-2 px-2.5 py-1 text-xs font-extrabold tracking-wide text-white shadow-sm">
            {option.code}
          </span>
          <span className="text-lg font-bold text-navy">{option.name}</span>
          {option.badge && <Badge badge={option.badge} />}
        </div>
        
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl font-extrabold text-navy">{formatUsd(option.priceUsd)}</span>
          <span className="text-xs font-medium text-slate">{option.priceUnit}</span>
        </div>
        
        <p className="line-clamp-3 text-sm leading-relaxed text-slate/90 flex-grow">{option.description}</p>
        
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail();
          }}
          className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold text-blue transition-colors hover:bg-blue/10 bg-blue/5"
        >
          Ver detalle y desglose de costos
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
