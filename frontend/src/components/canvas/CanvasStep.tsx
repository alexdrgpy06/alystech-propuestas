import { useState } from 'react';
import { motion } from 'framer-motion';
import type {
  AddonItem,
  AddonSelections,
  CanvasContent,
  ConditionCard,
  GroupId,
  NextStepsContent,
  OptionGroupContent,
  PlanOption,
  TermsContent,
} from '@/types/proposal';
import { formatUsd } from '@/lib/currency';
import type { Totals } from '@/types/proposal';
import { CostBreakdownModal } from '../ui/CostBreakdownModal';
import { GlassPanel } from '@/components/ui/GlassPanel';

// Material Symbols icons for each group
function GroupIcon({ id, className = 'w-4 h-4' }: { id: GroupId; className?: string }) {
  const icons: Record<GroupId, string> = {
    mdm: 'devices',
    srv: 'dns',
    net: 'hub',
    aud: 'security',
    sup: 'support_agent',
  };
  return (
    <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: "'FILL' 0" }}>
      {icons[id] || 'settings'}
    </span>
  );
}

const GROUP_LABELS: Record<GroupId, string> = {
  mdm: 'Plataforma Móvil',
  srv: 'Servidor Central',
  net: 'Red Perimetral',
  aud: 'Auditoría y SIEM',
  sup: 'Soporte Técnico',
};

const GROUP_COLOR_BG: Record<GroupId, string> = {
  mdm: 'bg-primary/10 border-primary/20 text-primary',
  srv: 'bg-primary/10 border-primary/20 text-primary',
  net: 'bg-positive/10 border-positive/20 text-positive',
  aud: 'bg-warning/10 border-warning/20 text-warning',
  sup: 'bg-surface-container-high border-border-slate text-ink-secondary',
};

const GROUP_ICON_BADGE: Record<GroupId, string> = {
  mdm: 'bg-primary/10 text-primary',
  srv: 'bg-primary/10 text-primary',
  net: 'bg-positive/10 text-positive',
  aud: 'bg-warning/10 text-warning',
  sup: 'bg-surface-container-high text-ink-secondary',
};

interface BlockAddonSummary {
  charged: AddonItem[];
  included: AddonItem[];
  availableCount: number;
  year1Usd: number;
  recurUsd: number;
}

function summarizeBlockAddons(
  group: OptionGroupContent,
  option: PlanOption,
  selectedAddonIds: string[],
): BlockAddonSummary {
  const charged: AddonItem[] = [];
  const included: AddonItem[] = [];
  let availableCount = 0;
  (group.addons ?? []).forEach((addon) => {
    if (addon.applicableTiers && !addon.applicableTiers.includes(option.id)) return;
    if (addon.includedInTiers.includes(option.id)) { included.push(addon); return; }
    if (selectedAddonIds.includes(addon.id)) charged.push(addon);
    else availableCount += 1;
  });
  const chargedUsd = charged.reduce((s, a) => s + a.amountUsd, 0);
  const chargedRecurUsd = charged.filter((a) => a.recurring).reduce((s, a) => s + a.amountUsd, 0);
  return {
    charged,
    included,
    availableCount,
    year1Usd: option.priceUsd + chargedUsd,
    recurUsd: option.recurUsd + chargedRecurUsd,
  };
}

function ModuleRow({ 
  group, 
  option, 
  summary, 
  onClick 
}: { 
  group: OptionGroupContent; 
  option: PlanOption; 
  summary: BlockAddonSummary;
  onClick: () => void;
}) {
  const colorCls = GROUP_COLOR_BG[group.id];
  
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`interactive-row flex items-center justify-between p-4 rounded-lg border border-border-slate w-full text-left ${colorCls}`}
      whileHover={{ backgroundColor: 'var(--color-accent-soft)' }}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${GROUP_ICON_BADGE[group.id]}`}>
          <GroupIcon id={group.id} className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-body-medium text-body-medium text-ink-navy font-bold">{GROUP_LABELS[group.id]}</h3>
          <p className="font-body-base text-body-base text-ink-muted text-sm">{option.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-headline-md text-headline-md text-ink-navy">{formatUsd(summary.year1Usd)}</p>
          <p className="font-body-medium text-body-medium text-ink-muted">Año 1</p>
          {summary.recurUsd > 0 && (
            <p className="font-body-medium text-body-medium text-ink-muted">+{formatUsd(summary.recurUsd)}/año</p>
          )}
        </div>
        <span className="material-symbols-outlined text-[20px] text-ink-muted" style={{ fontVariationSettings: "'FILL' 0" }}>chevron_right</span>
      </div>
    </motion.button>
  );
}

interface CanvasStepProps {
  content: CanvasContent;
  groups: OptionGroupContent[];
  selections: Record<GroupId, string>;
  addonSelections: AddonSelections;
  onToggleAddon: (group: GroupId, addonId: string) => void;
  totals: Totals;
  exchangeRate: number;
  nextSteps: NextStepsContent;
  conditions: ConditionCard[];
  terms: TermsContent;
}

export function CanvasStep({
  content,
  groups,
  selections,
  addonSelections,
  onToggleAddon,
  totals,
  // exchangeRate reserved for future Gs-equivalent display on this step.
  exchangeRate: _exchangeRate,
  nextSteps,
  conditions,
  terms,
}: CanvasStepProps) {
  const [detailGroupId, setDetailGroupId] = useState<GroupId | null>(null);
  const [conditionsOpen, setConditionsOpen] = useState(false);

  const selectedDetailGroup = groups.find((g) => g.id === detailGroupId);
  const selectedDetailOption = selectedDetailGroup?.options.find(
    (o) => o.id === selections[detailGroupId!],
  );

  const rows = groups.flatMap((group) => {
    const option = group.options.find((o) => o.id === selections[group.id]);
    if (!option) return [];
    return [{ group, option, summary: summarizeBlockAddons(group, option, addonSelections[group.id] ?? []) }];
  });

  return (
    <div className="w-full max-w-max-width-content mx-auto pb-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6 md:mb-12 text-center md:text-left"
      >
        <span className="inline-block px-3 py-1 bg-success/20 text-success font-label-caps text-label-caps rounded-full mb-3 md:mb-4">FINALIZADO</span>
        <h1 className="text-headline-md md:text-display-lg text-ink-navy mb-2">{content.title}</h1>
        <p className="text-body-medium md:text-body-base text-ink-secondary">{content.subtitle || 'Configuración final y detalles de inversión. Revisa los módulos seleccionados antes de confirmar.'}</p>
      </motion.div>

      {/* Bento Grid Layout */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column: Project Canvas (Modules) - spans 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-headline-md text-headline-md text-ink-navy mb-4 border-b border-border-slate pb-2">Módulos Seleccionados</h2>
          
          {rows.map(({ group, option, summary }) => (
            <ModuleRow
              key={group.id}
              group={group}
              option={option}
              summary={summary}
              onClick={() => setDetailGroupId(group.id)}
            />
          ))}
        </div>

        {/* Right Column: Financial Summary - spans 1 column */}
        <div className="lg:col-span-1">
          <GlassPanel variant="light" className="p-6 border border-border-slate shadow-sm sticky top-32">
            <h2 className="font-headline-md text-headline-md text-ink-navy mb-6">Inversión Estimada</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-end border-b border-border-slate pb-2">
                <div>
                  <p className="font-body-base text-body-base text-ink-secondary">Implementación</p>
                  <p className="font-label-caps text-label-caps text-ink-muted">PAGO ÚNICO</p>
                </div>
                <span className="font-headline-md text-headline-md text-ink-navy">{formatUsd(totals.totalUsd - totals.hwUsd - totals.recurUsd)}</span>
              </div>
              <div className="flex justify-between items-end border-b border-border-slate pb-2">
                <div>
                  <p className="font-body-base text-body-base text-ink-secondary">Licencias y Soporte</p>
                  <p className="font-label-caps text-label-caps text-ink-muted">RECURRENTE ANUAL</p>
                </div>
                <span className="font-headline-md text-headline-md text-ink-navy">{formatUsd(totals.recurUsd)}</span>
              </div>
            </div>
            <div className="bg-accent-soft p-4 rounded-lg border-2 border-primary/20 mb-8">
              <p className="font-body-base text-body-base text-primary font-bold mb-1">Total Año 1</p>
              <div className="flex items-baseline space-x-1">
                <span className="font-display-lg text-display-lg text-primary">{formatUsd(totals.totalUsd)}</span>
                <span className="font-body-medium text-body-medium text-primary">USD</span>
              </div>
              <p className="font-label-caps text-label-caps text-primary/70 mt-2">NO INCLUYE IMPUESTOS LOCALES</p>
            </div>
            <p className="font-body-medium text-body-medium text-ink-muted text-center">
              Confirmar, descargar o consultar: usa los botones fijos abajo.
            </p>
          </GlassPanel>
        </div>
      </motion.div>

      {/* Metodología de pago y próximos pasos */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="mt-12"
      >
        <h2 className="font-headline-md text-headline-md text-ink-navy mb-1">{nextSteps.title}</h2>
        <p className="font-body-base text-body-base text-ink-secondary mb-6">{nextSteps.intro}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nextSteps.timeline.map((step, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-4 ${
                step.future
                  ? 'border-dashed border-border-slate bg-surface-container-low/50'
                  : 'border-border-slate bg-white'
              }`}
            >
              <span className={`font-label-caps text-label-caps px-2 py-0.5 rounded-full border inline-block mb-2 ${
                step.future
                  ? 'text-ink-muted border-border-slate bg-surface-container-low'
                  : 'text-primary border-primary/20 bg-primary/10'
              }`}>
                {step.week}
              </span>
              <p className="font-body-base text-body-base text-ink-secondary leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Condiciones — colapsado por defecto, letra chica del negocio */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="mt-8 rounded-xl border border-border-slate bg-surface-container-low/50"
      >
        <button
          type="button"
          onClick={() => setConditionsOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 p-4 text-left min-h-[44px]"
          aria-expanded={conditionsOpen}
        >
          <span className="font-body-medium text-body-medium text-ink-navy font-bold">
            Condiciones comerciales
          </span>
          <span className="material-symbols-outlined text-[20px] text-ink-muted transition-transform" style={{ transform: conditionsOpen ? 'rotate(180deg)' : 'none' }}>
            expand_more
          </span>
        </button>
        {conditionsOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 pt-0">
            {conditions.map((cond, idx) => (
              <div key={idx} className="rounded-xl border border-border-slate bg-white p-4">
                <h3 className="font-label-caps text-label-caps text-primary mb-1.5">{cond.title}</h3>
                <p className="text-body-medium text-ink-secondary leading-relaxed">{cond.text}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Términos / pie legal */}
      <div className="mt-8 pt-4 border-t border-border-slate text-center">
        <p className="font-body-medium text-body-medium text-ink-muted">
          {terms.footerLine1} · Generado: {new Date().toLocaleDateString('es-PY', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <p className="font-body-medium text-body-medium text-ink-muted">{terms.footerLine2}</p>
      </div>

      {/* Modal */}
      <CostBreakdownModal
        isOpen={detailGroupId !== null}
        onClose={() => setDetailGroupId(null)}
        title={selectedDetailOption?.name || ''}
        description={selectedDetailOption?.description}
        features={selectedDetailOption?.features}
        costs={selectedDetailOption?.costBreakdown || []}
        total={selectedDetailOption?.priceUsd || 0}
        addons={selectedDetailGroup?.addons}
        tierId={selectedDetailOption?.id}
        selectedAddonIds={detailGroupId ? addonSelections[detailGroupId] : undefined}
        onToggleAddon={detailGroupId ? (addonId) => onToggleAddon(detailGroupId, addonId) : undefined}
        groupIcon={detailGroupId ?? undefined}
        optionCode={selectedDetailOption?.code}
      />
    </div>
  );
}
