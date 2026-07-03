import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { OptionGroupContent, PlanOption } from '../../types/proposal';
import { formatUsd } from '../../lib/currency';
import { CostBreakdownModal } from '../ui/CostBreakdownModal';
import { AddonMenu } from '../options/AddonMenu';

interface OptionsStepProps {
  content: OptionGroupContent;
  selectedOptionId: string;
  onSelectOption: (id: string) => void;
  selectedAddonIds?: string[];
  onToggleAddon?: (addonId: string) => void;
}

// SVG icon for each block
function GroupIcon({ id, className = 'w-5 h-5' }: { id: string; className?: string }) {
  switch (id) {
    case 'mdm':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="7" y="1" width="10" height="18" rx="2" />
          <circle cx="12" cy="16" r="0.8" fill="currentColor" />
        </svg>
      );
    case 'srv':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="2" y="3" width="20" height="5" rx="1.5" />
          <rect x="2" y="10.5" width="20" height="5" rx="1.5" />
          <circle cx="18.5" cy="5.5" r="1" fill="currentColor" />
          <circle cx="18.5" cy="13" r="1" fill="currentColor" />
        </svg>
      );
    case 'net':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'aud':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
        </svg>
      );
    case 'sup':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

function FeatureRow({ status, text }: { status: string; text: string }) {
  const icon =
    status === 'no' ? (
      <svg className="w-3 h-3 text-danger shrink-0 mt-0.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" d="M9 3 3 9M3 3l6 6" />
      </svg>
    ) : status === 'partial' ? (
      <svg className="w-3 h-3 text-amber shrink-0 mt-0.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="6" cy="6" r="4.5" />
        <path d="M6 2v8" strokeLinecap="round" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-positive shrink-0 mt-0.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
      </svg>
    );
  return (
    <li className="flex items-start gap-1.5 text-xs leading-snug text-ink-secondary">
      {icon}
      <span>{text}</span>
    </li>
  );
}

export function OptionsStep({
  content,
  selectedOptionId,
  onSelectOption,
  selectedAddonIds = [],
  onToggleAddon,
}: OptionsStepProps) {
  const [mobileModal, setMobileModal] = useState<PlanOption | null>(null);

  // For the split layout: which option is being previewed in the right panel
  // Defaults to the currently selected option
  const [previewId, setPreviewId] = useState<string>(selectedOptionId || content.options[0]?.id || '');

  const previewOption = content.options.find((o) => o.id === previewId) ?? content.options[0];

  const handleSelect = (id: string) => {
    onSelectOption(id);
    setPreviewId(id);
  };

  const hasAddons = (optionId: string) =>
    (content.addons ?? []).some(
      (a) => !a.includedInTiers.includes(optionId) && (!a.applicableTiers || a.applicableTiers.includes(optionId)),
    );

  return (
    <div className="w-full flex flex-col gap-4 py-2">
      {/* Step header */}
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl bg-accent-soft border border-accent/15 flex items-center justify-center text-accent shrink-0">
          <GroupIcon id={content.id} />
        </span>
        <div>
          <span className="text-2xs font-bold uppercase tracking-[0.18em] text-accent">
            {content.groupTitle} · Alternativas técnicas
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy leading-tight text-balance">
            {content.title}
          </h2>
        </div>
      </div>

      {/* ── SPLIT LAYOUT on lg+ / stacked on smaller ── */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1">

        {/* Left column: option list (stacked rows) */}
        <div className="flex flex-col gap-2 lg:w-[280px] xl:w-[320px] shrink-0">
          {content.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            const isPreviewing = previewId === opt.id;
            const isRecommended = opt.badge?.tone === 'recommended';

            return (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * idx }}
                onClick={() => handleSelect(opt.id)}
                className={`relative rounded-xl border-2 cursor-pointer transition-all duration-150 p-3.5 shadow-xs ${
                  isSelected
                    ? 'border-accent bg-accent-soft/60 shadow-accent/10'
                    : isPreviewing
                    ? 'border-accent/40 bg-accent-soft/25'
                    : 'border-card-border bg-card hover:border-accent/25 hover:bg-accent-soft/10'
                }`}
                onMouseEnter={() => setPreviewId(opt.id)}
              >
                {isRecommended && (
                  <span className="absolute -top-2.5 right-3 bg-accent text-white text-3xs font-bold px-2 py-0.5 rounded-full shadow-xs pointer-events-none">
                    Recomendada
                  </span>
                )}

                <div className="flex items-center gap-2.5">
                  {/* Radio dot */}
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    isSelected ? 'border-accent bg-accent' : 'border-ink-muted/30 bg-white'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  {/* Code badge */}
                  <span className={`text-3xs font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    isSelected ? 'bg-accent text-white' : 'bg-card-hover text-ink-secondary border border-card-border'
                  }`}>
                    {opt.code}
                  </span>

                  <span className="text-sm font-bold text-navy leading-snug flex-1 min-w-0">{opt.name}</span>
                </div>

                {/* Price row — compact */}
                <div className="mt-2 pl-6.5 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setMobileModal(opt); }}
                    className="text-3xs font-bold text-accent hover:text-accent-hover transition-colors hidden sm:lg:flex items-center gap-0.5 lg:hidden"
                  >
                    Ver detalles
                  </button>
                  <div className="ml-auto text-right">
                    {hasAddons(opt.id) && (
                      <span className="block text-3xs uppercase tracking-wider text-ink-muted leading-none mb-0.5">Desde</span>
                    )}
                    <span className={`text-base font-extrabold ${isSelected ? 'text-accent' : 'text-navy'}`}>
                      {formatUsd(opt.priceUsd)}
                    </span>
                    {opt.priceUnit === '/año' ? (
                      <span className="text-2xs text-ink-muted ml-0.5">/año</span>
                    ) : opt.recurUsd > 0 && (
                      <span className="block text-2xs text-ink-muted">+{formatUsd(opt.recurUsd)}/año</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right panel: detail preview — only on lg+ */}
        <AnimatePresence mode="wait">
          {previewOption && (
            <motion.div
              key={previewOption.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="hidden lg:flex flex-col flex-1 min-w-0 rounded-2xl border border-card-border bg-card shadow-xs overflow-hidden"
            >
              {/* Panel header */}
              <div className="bg-navy px-5 py-4 flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-accent shrink-0">
                  <GroupIcon id={content.id} className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-3xs font-bold bg-white/10 text-ink-on-dark px-2 py-0.5 rounded-md">
                      {previewOption.code}
                    </span>
                    {previewOption.badge?.tone === 'recommended' && (
                      <span className="text-3xs font-bold bg-accent text-white px-2 py-0.5 rounded-full">
                        Recomendada
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-ink-on-dark mt-0.5 leading-snug">
                    {previewOption.name}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  {hasAddons(previewOption.id) && (
                    <span className="block text-3xs uppercase tracking-wider text-ink-on-dark-secondary leading-none mb-0.5">Desde</span>
                  )}
                  <span className={`text-xl font-black ${selectedOptionId === previewOption.id ? 'text-accent' : 'text-ink-on-dark'}`}>
                    {formatUsd(previewOption.priceUsd)}
                  </span>
                  {previewOption.priceUnit !== '/año' && previewOption.recurUsd > 0 && (
                    <span className="block text-2xs text-ink-on-dark-secondary">
                      +{formatUsd(previewOption.recurUsd)}/año
                    </span>
                  )}
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto">
                {/* Description */}
                {previewOption.description && (
                  <div className="px-5 pt-4 pb-2">
                    <p className="text-sm text-ink-secondary leading-relaxed bg-card-hover rounded-xl border border-card-border/50 p-4">
                      {previewOption.description}
                    </p>
                  </div>
                )}

                {/* 2-column: features + cost */}
                <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-card-border/50">
                  {/* Features */}
                  {previewOption.features && previewOption.features.length > 0 && (
                    <div className="px-5 py-4 space-y-2">
                      <p className="text-2xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-positive" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 8l4 4 8-8" />
                        </svg>
                        Características
                      </p>
                      <ul className="space-y-1.5">
                        {previewOption.features.map((f, i) => (
                          <FeatureRow key={i} status={f.status} text={f.text} />
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cost breakdown */}
                  {previewOption.costBreakdown && previewOption.costBreakdown.length > 0 && (
                    <div className="px-5 py-4 space-y-2">
                      <p className="text-2xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" d="M8 1v14M4 5h8M4 11h8" />
                        </svg>
                        Desglose de inversión
                      </p>
                      <ul className="space-y-1.5">
                        {previewOption.costBreakdown.map((c, i) => (
                          <li key={i} className="flex items-start justify-between gap-2 text-xs text-ink-secondary py-0.5 border-b border-card-border/30 last:border-0">
                            <span className="leading-snug">{c.label}</span>
                            <span className={`font-semibold whitespace-nowrap shrink-0 ${c.recurring ? 'text-positive' : 'text-navy'}`}>
                              {formatUsd(c.amountUsd)}{c.recurring ? '/año' : ''}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Addons */}
                {content.addons && content.addons.length > 0 && onToggleAddon && (
                  <div className="px-5 pb-4">
                    <AddonMenu
                      addons={content.addons}
                      tierId={previewOption.id}
                      selectedAddonIds={selectedAddonIds}
                      onToggle={onToggleAddon}
                    />
                  </div>
                )}
              </div>

              {/* Select button */}
              <div className="px-5 py-3 border-t border-card-border bg-card-hover/40 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSelect(previewOption.id)}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                    selectedOptionId === previewOption.id
                      ? 'bg-positive text-white shadow-md shadow-positive/20'
                      : 'bg-accent text-white hover:bg-accent-hover shadow-md shadow-accent/20'
                  }`}
                >
                  {selectedOptionId === previewOption.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Alternativa seleccionada
                    </span>
                  ) : (
                    `Seleccionar ${previewOption.code}`
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: full modal for details (shown only on < lg) */}
      <CostBreakdownModal
        isOpen={mobileModal !== null}
        onClose={() => setMobileModal(null)}
        title={mobileModal?.name || ''}
        description={mobileModal?.description}
        features={mobileModal?.features}
        costs={mobileModal?.costBreakdown || []}
        total={mobileModal?.priceUsd || 0}
        addons={content.addons}
        tierId={mobileModal?.id}
        selectedAddonIds={selectedAddonIds}
        onToggleAddon={onToggleAddon}
        groupIcon={content.id}
        optionCode={mobileModal?.code}
      />
    </div>
  );
}
