import { useState } from 'react';
import { motion } from 'framer-motion';
import type {
  AddonItem,
  AddonSelections,
  CanvasContent,
  GroupId,
  OptionGroupContent,
  PlanOption,
} from '@/types/proposal';
import { formatUsd } from '@/lib/currency';
import type { Totals } from '@/types/proposal';
import { CostBreakdownModal } from '../ui/CostBreakdownModal';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { PrimaryButton, SecondaryButton, GhostButton } from '@/components/ui/ActionButton';

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
        <div className={`bg-${group.id === 'mdm' || group.id === 'srv' ? 'primary-container' : group.id === 'net' ? 'positive' : group.id === 'aud' ? 'warning' : 'surface-container-high'} p-3 rounded-lg text-${group.id === 'mdm' || group.id === 'srv' ? 'primary' : group.id === 'net' ? 'positive' : group.id === 'aud' ? 'warning' : 'ink-secondary'}`}>
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
  totals: Totals;
  exchangeRate: number;
  onConsulta: () => void;
  onDownloadPdf: () => void;
  onReject: () => void;
  onAccept: () => void;
  pdfPending?: boolean;
}

export function CanvasStep({
  content,
  groups,
  selections,
  addonSelections,
  totals,
  // exchangeRate reserved for future Gs-equivalent display on this step.
  exchangeRate: _exchangeRate,
  onConsulta,
  onDownloadPdf,
  onReject,
  onAccept,
  pdfPending,
}: CanvasStepProps) {
  const [detailGroupId, setDetailGroupId] = useState<GroupId | null>(null);

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
        className="mb-12 text-center md:text-left"
      >
        <span className="inline-block px-3 py-1 bg-success/20 text-success font-label-caps text-label-caps rounded-full mb-4">FINALIZADO</span>
        <h1 className="font-display-lg-mobile md:font-display-lg text-ink-navy mb-2">{content.title}</h1>
        <p className="font-body-base text-body-base text-ink-secondary">{content.subtitle || 'Configuración final y detalles de inversión. Revisa los módulos seleccionados antes de confirmar.'}</p>
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
            <div className="space-y-3">
              <SecondaryButton
                onClick={onDownloadPdf}
                disabled={pdfPending}
                className="w-full"
                leftIcon={
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                    picture_as_pdf
                  </span>
                }
              >
                {pdfPending ? 'Generando…' : 'Descargar PDF'}
              </SecondaryButton>
              <PrimaryButton
                onClick={onAccept}
                className="w-full"
                leftIcon={
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                }
              >
                Confirmar Propuesta
              </PrimaryButton>
              <div className="flex items-center justify-center gap-1 pt-1">
                <GhostButton
                  onClick={onConsulta}
                  size="sm"
                  className="text-ink-secondary hover:text-primary"
                  leftIcon={
                    <span className="material-symbols-outlined text-[16px]">
                      chat_bubble
                    </span>
                  }
                >
                  Solicitar consulta
                </GhostButton>
                <GhostButton
                  onClick={onReject}
                  size="sm"
                  className="text-ink-muted hover:text-danger"
                  leftIcon={
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                  }
                >
                  Rechazar
                </GhostButton>
              </div>
            </div>
          </GlassPanel>
        </div>
      </motion.div>

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
        groupIcon={detailGroupId ?? undefined}
        optionCode={selectedDetailOption?.code}
      />
    </div>
  );
}
