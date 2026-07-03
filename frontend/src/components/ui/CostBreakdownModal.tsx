import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AddonItem, CostLine } from '../../types/proposal';
import { formatUsd } from '../../lib/currency';
import { AddonMenu } from '../options/AddonMenu';

interface CostBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  features?: { status: string; text: string }[];
  costs: CostLine[];
  total: number;
  /** addons del bloque, si la opción abierta pertenece a un bloque con menú de addons */
  addons?: AddonItem[];
  /** id de la opción abierta, para resolver qué addons ya vienen incluidos / aplican */
  tierId?: string;
  selectedAddonIds?: string[];
  onToggleAddon?: (addonId: string) => void;
  /** optional group icon for richer header */
  groupIcon?: string;
  /** option code (e.g. "MDM-A") for header badge */
  optionCode?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  hw: 'Equipamiento',
  lab: 'Ingeniería',
  lic: 'Licencia',
  svc: 'Servicio',
};

const CATEGORY_COLORS: Record<string, string> = {
  hw: 'bg-amber-soft text-amber border-amber/20',
  lab: 'bg-blue-soft text-blue border-blue/20',
  lic: 'bg-accent-soft text-accent border-accent/20',
  svc: 'bg-positive-soft text-positive border-positive/20',
};

export function CostBreakdownModal({
  isOpen,
  onClose,
  title,
  description,
  features,
  costs,
  total,
  addons,
  tierId,
  selectedAddonIds = [],
  onToggleAddon,
  groupIcon,
  optionCode,
}: CostBreakdownModalProps) {
  // Cerrar con Escape y bloquear el scroll del body mientras el modal está abierto
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const addonsTotal =
    tierId && addons
      ? addons
          .filter((a) => selectedAddonIds.includes(a.id) && !a.includedInTiers.includes(tierId))
          .reduce((sum, a) => sum + a.amountUsd, 0)
      : 0;
  const grandTotal = total + addonsTotal;

  // Separate recurring costs from one-time for clarity
  const recurringCosts = costs.filter((c) => c.recurring);
  const oneTimeCosts = costs.filter((c) => !c.recurring);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
          />

          {/* Modal — max-w-2xl for more content space */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative bg-card rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-card-border flex flex-col max-h-[90dvh]"
          >
            {/* Header */}
            <div className="shrink-0 bg-navy px-5 sm:px-6 py-4 border-b border-white/10 flex justify-between items-start gap-3">
              <div className="flex items-start gap-3 min-w-0">
                {groupIcon && (
                  <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-xl shrink-0 mt-0.5">
                    {groupIcon}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-3xs font-bold uppercase tracking-wider text-accent/90">Ficha de Detalles</span>
                    {optionCode && (
                      <span className="text-3xs font-bold bg-white/10 text-ink-on-dark px-2 py-0.5 rounded-full">
                        {optionCode}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-ink-on-dark text-sm sm:text-base mt-0.5 leading-snug">
                    {title}
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar detalle"
                className="text-ink-on-dark-secondary hover:text-ink-on-dark transition-colors rounded-full p-2 -m-1.5 hover:bg-white/10 shrink-0"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content (scrollable) */}
            <div className="flex-1 overflow-y-auto">
              {/* Description — full width, top of modal */}
              {description && (
                <div className="px-5 sm:px-6 pt-5 pb-0">
                  <p className="text-sm text-ink-secondary leading-relaxed bg-card-hover p-4 rounded-xl border border-card-border/50">
                    {description}
                  </p>
                </div>
              )}

              {/* Two-column layout on desktop: features left, costs right */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-card-border/50">

                {/* Left: Features */}
                {features && features.length > 0 && (
                  <div className="p-5 sm:p-6 space-y-3">
                    <h4 className="text-2xs font-bold uppercase tracking-wider text-navy flex items-center gap-2">
                      <span className="w-4 h-4 bg-positive-soft rounded flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-positive" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                        </svg>
                      </span>
                      Características incluidas
                    </h4>
                    <ul className="space-y-2">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-ink-secondary leading-relaxed">
                          <span className={`text-xs shrink-0 mt-0.5 font-bold ${
                            feat.status === 'no' ? 'text-danger' : feat.status === 'partial' ? 'text-amber' : 'text-positive'
                          }`}>
                            {feat.status === 'no' ? '✕' : feat.status === 'partial' ? '◑' : '✓'}
                          </span>
                          <span>{feat.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Right: Cost breakdown */}
                {costs && costs.length > 0 && (
                  <div className="p-5 sm:p-6 space-y-4">
                    <h4 className="text-2xs font-bold uppercase tracking-wider text-navy flex items-center gap-2">
                      <span className="w-4 h-4 bg-accent-soft rounded flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-accent" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 1v10M3 4h6M3 8h6" />
                        </svg>
                      </span>
                      Desglose de inversión
                    </h4>

                    {oneTimeCosts.length > 0 && (
                      <div className="space-y-2">
                        {recurringCosts.length > 0 && (
                          <p className="text-3xs font-bold uppercase tracking-wider text-ink-muted">Costo único</p>
                        )}
                        {oneTimeCosts.map((cost, idx) => (
                          <div key={idx} className="flex justify-between items-start gap-2 text-xs py-1 border-b border-card-border/30 last:border-0">
                            <div className="flex items-start gap-1.5 flex-1 min-w-0">
                              {cost.category && (
                                <span className={`text-3xs font-bold border px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                                  CATEGORY_COLORS[cost.category] || 'bg-card-hover text-ink-muted border-card-border'
                                }`}>
                                  {CATEGORY_LABELS[cost.category] || cost.category}
                                </span>
                              )}
                              <span className="text-ink-secondary leading-snug">{cost.label}</span>
                            </div>
                            <span className="font-semibold text-navy shrink-0 whitespace-nowrap">
                              {formatUsd(cost.amountUsd)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {recurringCosts.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <p className="text-3xs font-bold uppercase tracking-wider text-ink-muted">Recurrente anual</p>
                        {recurringCosts.map((cost, idx) => (
                          <div key={idx} className="flex justify-between items-start gap-2 text-xs py-1 border-b border-card-border/30 last:border-0">
                            <div className="flex items-start gap-1.5 flex-1 min-w-0">
                              {cost.category && (
                                <span className={`text-3xs font-bold border px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                                  CATEGORY_COLORS[cost.category] || 'bg-card-hover text-ink-muted border-card-border'
                                }`}>
                                  {CATEGORY_LABELS[cost.category] || cost.category}
                                </span>
                              )}
                              <span className="text-ink-secondary leading-snug">{cost.label}</span>
                            </div>
                            <span className="font-semibold text-positive shrink-0 whitespace-nowrap">
                              {formatUsd(cost.amountUsd)}/año
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Addon menu — full width below the two columns */}
              {addons && tierId && onToggleAddon && (
                <div className="px-5 sm:px-6 pb-2">
                  <AddonMenu
                    addons={addons}
                    tierId={tierId}
                    selectedAddonIds={selectedAddonIds}
                    onToggle={onToggleAddon}
                  />
                </div>
              )}
            </div>

            {/* Total Footer (fijo, siempre visible) */}
            <div className="shrink-0 px-5 sm:px-6 py-4 border-t border-card-border bg-navy/5 flex justify-between items-center gap-3">
              <div>
                <p className="text-2xs font-bold uppercase tracking-wider text-ink-muted">
                  {addonsTotal > 0 ? 'Total con addons seleccionados' : 'Total de la alternativa'}
                </p>
                {addonsTotal > 0 && (
                  <p className="text-3xs text-ink-muted mt-0.5">
                    Base: {formatUsd(total)} + addons: {formatUsd(addonsTotal)}
                  </p>
                )}
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-accent shrink-0">
                {formatUsd(grandTotal)}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
