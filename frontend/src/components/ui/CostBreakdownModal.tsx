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
}

const CATEGORY_LABELS: Record<string, string> = {
  hw: 'Equipamiento',
  lab: 'Ingeniería',
  lic: 'Licencia',
  svc: 'Servicio',
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-card-border flex flex-col max-h-[85dvh]"
          >
            {/* Header */}
            <div className="shrink-0 bg-card-hover px-6 py-4 border-b border-card-border flex justify-between items-center">
              <div>
                <span className="text-3xs font-bold uppercase tracking-wider text-accent">Ficha de Detalles</span>
                <h3 className="font-bold text-navy text-sm sm:text-base mt-0.5">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar detalle"
                className="text-ink-muted hover:text-ink transition-colors rounded-full p-2.5 -m-1.5 hover:bg-card-border/50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content (scrollable) */}
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
              {/* Description */}
              {description && (
                <div className="space-y-1">
                  <h4 className="text-2xs font-bold uppercase tracking-wider text-navy">Descripción General</h4>
                  <p className="text-xs sm:text-md text-ink-secondary leading-relaxed bg-card-hover p-3 rounded-lg border border-card-border/40">
                    {description}
                  </p>
                </div>
              )}

              {/* Features list */}
              {features && features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-2xs font-bold uppercase tracking-wider text-navy">Características Incluidas</h4>
                  <ul className="space-y-1.5 text-xs text-ink-secondary">
                    {features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className={`text-xs shrink-0 mt-0.5 ${feat.status === 'no' ? 'text-danger' : 'text-positive'}`}>
                          {feat.status === 'no' ? '✕' : '✓'}
                        </span>
                        <span>{feat.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cost breakdown */}
              {costs && costs.length > 0 && (
                <div className="space-y-2.5 pt-3 border-t border-card-border/50">
                  <h4 className="text-2xs font-bold uppercase tracking-wider text-navy">Desglose de Inversión</h4>
                  <div className="space-y-2.5">
                    {costs.map((cost, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-ink-secondary flex-1 pr-4">{cost.label}</span>
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-navy">
                            {formatUsd(cost.amountUsd)}{cost.recurring ? '/año' : ''}
                          </span>
                          {cost.category && (
                            <span className="text-3xs uppercase tracking-wider text-ink-muted font-bold bg-card-hover px-1.5 py-0.5 rounded mt-0.5 border border-card-border/50">
                              {CATEGORY_LABELS[cost.category] || cost.category}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Addon menu */}
              {addons && tierId && onToggleAddon && (
                <AddonMenu
                  addons={addons}
                  tierId={tierId}
                  selectedAddonIds={selectedAddonIds}
                  onToggle={onToggleAddon}
                />
              )}
            </div>

            {/* Total Footer (fijo, siempre visible) */}
            <div className="shrink-0 px-6 py-4 border-t border-card-border bg-accent-soft/30 flex justify-between items-center">
              <span className="font-bold text-navy text-xs sm:text-sm">
                {addonsTotal > 0 ? 'Total con addons seleccionados:' : 'Total del bloque:'}
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-accent">
                {formatUsd(grandTotal)}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
