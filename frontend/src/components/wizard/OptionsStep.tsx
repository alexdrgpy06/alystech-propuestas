import { useState } from 'react';
import { motion } from 'framer-motion';
import type { OptionGroupContent, PlanOption } from '../../types/proposal';
import { formatUsd } from '../../lib/currency';
import { CostBreakdownModal } from '../ui/CostBreakdownModal';

interface OptionsStepProps {
  content: OptionGroupContent;
  selectedOptionId: string;
  onSelectOption: (id: string) => void;
  selectedAddonIds?: string[];
  onToggleAddon?: (addonId: string) => void;
}

export function OptionsStep({
  content,
  selectedOptionId,
  onSelectOption,
  selectedAddonIds = [],
  onToggleAddon,
}: OptionsStepProps) {
  const [modalOption, setModalOption] = useState<PlanOption | null>(null);

  // El precio de la tarjeta se muestra como "Desde $X" cuando el bloque tiene addons aplicables
  // a esa opción (el total real depende de lo que se marque en el modal de detalle).
  const hasApplicableAddons = (optionId: string) =>
    (content.addons ?? []).some((a) => !a.applicableTiers || a.applicableTiers.includes(optionId));

  return (
    <div className="w-full md:h-full md:flex md:flex-col md:justify-center py-2">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-card-border bg-card p-6 sm:p-10 flex flex-col justify-between shadow-sm md:flex-1 space-y-6 lg:space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-2xs sm:text-xs font-bold uppercase tracking-[0.15em] text-accent">
              {content.groupTitle} · Alternativas
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-navy mt-1.5 leading-tight">{content.title}</h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1.5">Seleccione una alternativa técnica para este módulo.</p>
          </div>
        </div>

        {/* Options grid - 2 columns on desktop with expanded font sizing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 flex-1 items-center">
          {content.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            const isRecommended = opt.badge?.tone === 'recommended';

            return (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * idx, duration: 0.25 }}
                whileHover={{ scale: 1.002 }}
                whileTap={{ scale: 0.998 }}
                onClick={() => onSelectOption(opt.id)}
                className={`relative rounded-xl border-2 cursor-pointer transition-all duration-150 p-5 sm:p-6 flex flex-col justify-between h-full shadow-xs ${
                  isSelected
                    ? 'border-accent bg-accent-soft/60 shadow-sm'
                    : 'border-card-border bg-card hover:border-ink-muted/30 hover:shadow-sm'
                }`}
              >
                {isRecommended && (
                  <span className="absolute -top-2.5 right-4 bg-accent text-white text-3xs sm:text-2xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    Recomendada
                  </span>
                )}

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Left Radio Selector */}
                      <div className={`w-5.5 h-5.5 rounded-full border shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-accent bg-accent' : 'border-ink-muted/30 bg-white'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <span className={`shrink-0 text-2xs font-bold px-2 py-0.5 rounded ${
                        isSelected ? 'bg-accent text-white' : 'bg-card-hover text-ink-secondary border border-card-border'
                      }`}>
                        {opt.code}
                      </span>
                      <h4 className="text-md sm:text-base font-bold text-navy whitespace-normal break-words leading-snug">{opt.name}</h4>
                    </div>
                  </div>

                  {/* Concise description block */}
                  <p className="text-2xs sm:text-md text-ink-secondary leading-relaxed pl-8.5 font-medium">
                    {opt.description.split('.')[0] + '.'}
                  </p>
                </div>

                <div className="mt-5 pl-8.5 flex items-center justify-between border-t border-card-border/40 pt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalOption(opt);
                    }}
                    className="text-2xs font-bold text-accent hover:text-accent-hover flex items-center gap-1 min-h-11 -my-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ver detalles
                  </button>

                  <div className="text-right shrink-0">
                    {hasApplicableAddons(opt.id) && (
                      <span className="block text-3xs sm:text-2xs font-semibold text-ink-muted uppercase tracking-wide">
                        Desde
                      </span>
                    )}
                    <span className={`text-base sm:text-lg font-extrabold ${isSelected ? 'text-accent' : 'text-navy'}`}>
                      {formatUsd(opt.priceUsd)}
                    </span>
                    {opt.priceUnit === '/año' ? (
                      <span className="text-2xs text-ink-muted inline ml-1">/año</span>
                    ) : (
                      opt.recurUsd > 0 && (
                        <span className="block text-2xs text-ink-muted">
                          + {formatUsd(opt.recurUsd)}/año
                        </span>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Details & Specs breakdown modal */}
      <CostBreakdownModal
        isOpen={modalOption !== null}
        onClose={() => setModalOption(null)}
        title={modalOption?.name || ''}
        description={modalOption?.description}
        features={modalOption?.features}
        costs={modalOption?.costBreakdown || []}
        total={modalOption?.priceUsd || 0}
        addons={content.addons}
        tierId={modalOption?.id}
        selectedAddonIds={selectedAddonIds}
        onToggleAddon={onToggleAddon}
      />
    </div>
  );
}
