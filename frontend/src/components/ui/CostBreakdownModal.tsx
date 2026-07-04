import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AddonItem, CostLine } from '../../types/proposal';
import { formatUsd } from '../../lib/currency';
import { AddonMenu } from '../options/AddonMenu';
import { GlassPanel, GlassPanelHeader, GlassPanelBody } from './GlassPanel';
import { GhostButton } from './ActionButton';

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
  hw: 'bg-amber/10 text-amber border-amber/20',
  lab: 'bg-primary/10 text-primary border-primary/20',
  lic: 'bg-primary/10 text-primary border-primary/20',
  svc: 'bg-positive/10 text-positive border-positive/20',
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

  // Material Symbols icon mapping for groupIcon
  const GROUP_ICONS: Record<string, string> = {
    mdm: 'devices',
    srv: 'dns',
    net: 'hub',
    aud: 'security',
    sup: 'support_agent',
  };

  const getGroupIcon = (id?: string) => {
    if (!id) return null;
    return (
      <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 0" }}>
        {GROUP_ICONS[id] || 'settings'}
      </span>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-dark/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal — GlassPanel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl md:max-w-3xl max-h-[85vh] overflow-hidden"
          >
            <GlassPanel variant="light" className="h-full flex flex-col !bg-white">
              {/* Header */}
              <GlassPanelHeader className="border-border-slate px-6 pt-6">
                <div className="flex items-start gap-3 min-w-0">
                  {groupIcon && (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {getGroupIcon(groupIcon)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-label-caps text-label-caps text-primary">Ficha de Detalles</span>
                      {optionCode && (
                        <span className="font-label-caps text-label-caps bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                          {optionCode}
                        </span>
                      )}
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface leading-snug">
                      {title}
                    </h3>
                  </div>
                </div>
                <GhostButton
                  onClick={onClose}
                  size="sm"
                  aria-label="Cerrar detalle"
                  className="p-2 -m-1 rounded-full"
                >
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                    close
                  </span>
                </GhostButton>
              </GlassPanelHeader>

              {/* Content (scrollable) */}
              <GlassPanelBody className="flex-1 min-h-0 max-h-[calc(85vh-160px)] overflow-y-auto p-6 space-y-6">
                {/* Description */}
                {description && (
                  <div className="bg-surface-container-low rounded-lg border border-border-slate p-4">
                    <p className="font-body-base text-body-base text-ink-secondary leading-relaxed">
                      {description}
                    </p>
                  </div>
                )}

                {/* Two-column layout on desktop: features left, costs right.
                    md: (768px viewport), not lg:, since the modal itself is
                    only max-w-3xl — lg:1024px rarely triggered even on real
                    desktop windows, forcing a single cramped column. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Features */}
                  {features && features.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-label-caps text-label-caps text-primary flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-positive/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] text-positive" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>
                        </span>
                        Características incluidas
                      </h4>
                      <ul className="space-y-2">
                        {features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 font-body-medium text-body-medium text-body-medium text-ink-secondary leading-relaxed">
                            <span className={`shrink-0 mt-0.5 ${
                              feat.status === 'no' ? 'text-danger' : 
                              feat.status === 'partial' ? 'text-warning' : 'text-positive'
                            }`}>
                              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {feat.status === 'no' ? 'close' : feat.status === 'partial' ? 'remove' : 'check'}
                              </span>
                            </span>
                            <span>{feat.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Right: Cost breakdown */}
                  {costs && costs.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-label-caps text-label-caps text-primary flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                            account_balance
                          </span>
                        </span>
                        Desglose de inversión
                      </h4>

                      {oneTimeCosts.length > 0 && (
                        <div className="space-y-2">
                          {recurringCosts.length > 0 && (
                            <p className="font-label-caps text-label-caps text-ink-muted">Costo único</p>
                          )}
                          {oneTimeCosts.map((cost, idx) => (
                            <div key={idx} className="py-2 border-b border-border-slate/30 last:border-0">
                              <div className="flex items-center justify-between gap-2">
                                {cost.category ? (
                                  <span className={`font-label-caps text-label-caps border px-2 py-0.5 rounded ${CATEGORY_COLORS[cost.category] || 'bg-surface-container-high text-ink-muted border-border-slate'}`}>
                                    {CATEGORY_LABELS[cost.category] || cost.category}
                                  </span>
                                ) : <span />}
                                <span className="font-body-base text-base font-bold text-ink-navy shrink-0 whitespace-nowrap">
                                  {formatUsd(cost.amountUsd)}
                                </span>
                              </div>
                              <p className="font-body-base text-body-base text-ink-secondary leading-snug mt-1">{cost.label}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {recurringCosts.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-border-slate">
                          <p className="font-label-caps text-label-caps text-ink-muted">Recurrente anual</p>
                          {recurringCosts.map((cost, idx) => (
                            <div key={idx} className="py-2 border-b border-border-slate/30 last:border-0">
                              <div className="flex items-center justify-between gap-2">
                                {cost.category ? (
                                  <span className={`font-label-caps text-label-caps border px-2 py-0.5 rounded ${CATEGORY_COLORS[cost.category] || 'bg-surface-container-high text-ink-muted border-border-slate'}`}>
                                    {CATEGORY_LABELS[cost.category] || cost.category}
                                  </span>
                                ) : <span />}
                                <span className="font-body-base text-base font-bold text-positive shrink-0 whitespace-nowrap">
                                  {formatUsd(cost.amountUsd)}/año
                                </span>
                              </div>
                              <p className="font-body-base text-body-base text-ink-secondary leading-snug mt-1">{cost.label}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Addon menu — full width below the two columns. Read-only when no onToggleAddon handler is given. */}
                {addons && tierId && (
                  <div className="pt-2 border-t border-border-slate">
                    <AddonMenu
                      addons={addons}
                      tierId={tierId}
                      selectedAddonIds={selectedAddonIds}
                      onToggle={onToggleAddon}
                    />
                  </div>
                )}

              </GlassPanelBody>

              {/* Total Footer (sticky, always visible) */}
              <div className="shrink-0 sticky bottom-0 bg-white border-t border-border-slate px-6 py-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-label-caps text-label-caps text-ink-muted">
                    {addonsTotal > 0 ? 'Total con addons seleccionados' : 'Total de la alternativa'}
                  </p>
                  {addonsTotal > 0 && (
                    <p className="font-body-medium text-body-medium text-ink-muted mt-0.5">
                      Base: {formatUsd(total)} + addons: {formatUsd(addonsTotal)}
                    </p>
                  )}
                </div>
                <span className="font-display-lg text-display-lg text-primary shrink-0">
                  {formatUsd(grandTotal)}
                </span>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}