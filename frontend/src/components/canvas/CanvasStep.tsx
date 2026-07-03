import { useState } from 'react';
import type {
  AddonItem,
  AddonSelections,
  CanvasContent,
  GroupId,
  OptionGroupContent,
  PlanOption,
} from '@/types/proposal';
import { formatUsd, formatGs } from '@/lib/currency';
import type { Totals } from '@/types/proposal';
import { CostBreakdownModal } from '../ui/CostBreakdownModal';

const GROUP_LABELS: Record<GroupId, string> = {
  mdm: 'A · Plataforma Móvil',
  srv: 'B.1 · Servidor Central',
  net: 'B.2 · Red Perimetral',
  aud: 'C · Auditoría y SIEM',
  sup: 'D · Soporte Técnico',
};

/** Desglose de addons del bloque respecto del tier elegido (misma regla de cobro que computeTotals en @/lib/totals) */
interface BlockAddonSummary {
  /** addons marcados que se cobran sobre el tier elegido */
  charged: AddonItem[];
  /** addons ya incluidos de forma nativa en el tier elegido (no se cobran) */
  included: AddonItem[];
  /** addons aplicables al tier elegido que el cliente aún no marcó */
  availableCount: number;
  /** subtotal Año 1 del bloque: precio del tier + addons cobrados */
  year1Usd: number;
  /** recurrente anual del bloque: recurrente del tier + addons cobrados recurrentes */
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
    // el addon no aplica sobre el tier elegido
    if (addon.applicableTiers && !addon.applicableTiers.includes(option.id)) return;
    if (addon.includedInTiers.includes(option.id)) {
      included.push(addon);
      return;
    }
    if (selectedAddonIds.includes(addon.id)) charged.push(addon);
    else availableCount += 1;
  });

  const chargedUsd = charged.reduce((sum, a) => sum + a.amountUsd, 0);
  const chargedRecurUsd = charged
    .filter((a) => a.recurring)
    .reduce((sum, a) => sum + a.amountUsd, 0);

  return {
    charged,
    included,
    availableCount,
    year1Usd: option.priceUsd + chargedUsd,
    recurUsd: option.recurUsd + chargedRecurUsd,
  };
}

/** Alternativa elegida + addons cobrados/incluidos + teaser de addons disponibles (compartido por tabla y cards) */
function SelectionDetails({
  option,
  summary,
}: {
  option: PlanOption;
  summary: BlockAddonSummary;
}) {
  return (
    <div>
      <div>
        <span className="font-bold text-accent mr-1.5">{option.code}</span>
        {option.name}
      </div>
      {(summary.charged.length > 0 || summary.included.length > 0) && (
        <ul className="mt-1.5 space-y-1">
          {summary.charged.map((addon) => (
            <li key={addon.id} className="text-2xs leading-snug text-ink-secondary">
              + {addon.label}{' '}
              <span className="font-semibold text-navy whitespace-nowrap">
                + {formatUsd(addon.amountUsd)}
                {addon.recurring ? '/año' : ''}
              </span>
            </li>
          ))}
          {summary.included.map((addon) => (
            <li key={addon.id} className="text-2xs leading-snug text-ink-muted">
              {addon.label}{' '}
              <span className="ml-0.5 rounded border border-card-border/60 bg-card-hover px-1.5 py-0.5 text-3xs font-bold uppercase tracking-wider text-ink-muted whitespace-nowrap">
                Incluido
              </span>
            </li>
          ))}
        </ul>
      )}
      {summary.availableCount > 0 && (
        <p className="mt-1.5 text-3xs text-ink-muted">
          {summary.availableCount === 1
            ? '1 addon disponible'
            : `${summary.availableCount} addons disponibles`}{' '}
          — ver ficha
        </p>
      )}
    </div>
  );
}

/** Subtotal del bloque: Año 1 (tier + addons cobrados) y recurrente anual aparte, para que la suma de filas cuadre con el total superior */
function BlockInvestment({
  option,
  summary,
}: {
  option: PlanOption;
  summary: BlockAddonSummary;
}) {
  if (option.priceUnit === '/año' && summary.year1Usd === summary.recurUsd) {
    return (
      <>
        {formatUsd(summary.recurUsd)}
        <span className="text-3xs text-ink-muted font-normal ml-0.5">/año</span>
      </>
    );
  }
  return (
    <div className="flex flex-col items-end leading-tight">
      <span>
        {formatUsd(summary.year1Usd)}
        <span className="text-3xs text-ink-muted font-normal ml-0.5">Año 1</span>
      </span>
      {summary.recurUsd > 0 && (
        <span className="text-2xs font-semibold text-ink-secondary">
          + {formatUsd(summary.recurUsd)}
          <span className="text-3xs text-ink-muted font-normal ml-0.5">/año</span>
        </span>
      )}
    </div>
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
  exchangeRate,
  onConsulta,
  onDownloadPdf,
  onReject,
  onAccept,
  pdfPending,
}: CanvasStepProps) {
  const [detailGroupId, setDetailGroupId] = useState<GroupId | null>(null);

  const selectedDetailGroup = groups.find((g) => g.id === detailGroupId);
  const selectedDetailOption = selectedDetailGroup?.options.find(
    (o) => o.id === selections[detailGroupId!]
  );

  // una fila por bloque con opción elegida, con el desglose de addons ya resuelto
  const rows = groups.flatMap((group) => {
    const option = group.options.find((o) => o.id === selections[group.id]);
    if (!option) return [];
    return [
      {
        group,
        option,
        summary: summarizeBlockAddons(group, option, addonSelections[group.id] ?? []),
      },
    ];
  });

  return (
    <section className="space-y-8 w-full max-w-5xl mx-auto pb-12">
      <div className="text-center md:text-left">
        <h3 className="text-xl sm:text-2xl font-extrabold text-navy">{content.title}</h3>
        <p className="mt-1.5 text-sm text-slate">{content.subtitle}</p>
      </div>

      {/* ── 1. Resumen de Inversión y Selecciones (MOVED TO THE TOP) ── */}
      <div className="space-y-4">
        <div className="rounded-2xl border-2 border-accent/20 bg-accent-soft/40 p-6 shadow-xs flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">Inversión Estimada Total (Año 1)</span>
            <div className="text-3xl font-black text-navy mt-1">{formatUsd(totals.totalUsd)}</div>
            <p className="mt-1.5 text-xs sm:text-sm text-ink-secondary font-medium">
              Año 1 (estimativo, IVA incluido) · ≈ {formatGs(totals.totalUsd, exchangeRate)} · Recurrente anual: {formatUsd(totals.recurUsd)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onConsulta}
              className="px-4 py-2.5 rounded-xl bg-slate text-xs sm:text-sm font-bold text-white transition-colors hover:bg-slate/90 shadow-xs"
            >
              {content.buttons.consulta}
            </button>
            <button
              type="button"
              onClick={onDownloadPdf}
              disabled={pdfPending}
              className="px-4 py-2.5 rounded-xl bg-navy text-xs sm:text-sm font-bold text-white shadow-md shadow-navy/25 transition-colors hover:bg-navy-2 disabled:opacity-60"
            >
              {pdfPending ? 'Generando…' : content.buttons.pdf}
            </button>
          </div>
        </div>

        {/* Structured Selection Table - Highly symmetric and neat (≥sm) */}
        <div className="hidden sm:block rounded-xl border border-card-border bg-card overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-card-border bg-card-hover text-navy font-bold">
                <th className="py-3 px-4 sm:px-5">Bloque Técnico</th>
                <th className="py-3 px-4 sm:px-5">Alternativa Seleccionada</th>
                <th className="py-3 px-4 sm:px-5 text-right">Inversión</th>
                <th className="py-3 px-4 sm:px-5 text-center">Ficha</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ group, option, summary }) => (
                <tr key={group.id} className="border-b border-card-border hover:bg-card-hover/40 last:border-0">
                  <td className="py-3.5 px-4 sm:px-5 font-bold text-navy whitespace-nowrap align-top">{GROUP_LABELS[group.id]}</td>
                  <td className="py-3.5 px-4 sm:px-5 text-ink-secondary align-top">
                    <SelectionDetails option={option} summary={summary} />
                  </td>
                  <td className="py-3.5 px-4 sm:px-5 text-right font-extrabold text-navy whitespace-nowrap align-top">
                    <BlockInvestment option={option} summary={summary} />
                  </td>
                  <td className="py-3.5 px-4 sm:px-5 text-center align-top">
                    <button
                      type="button"
                      onClick={() => setDetailGroupId(group.id)}
                      className="text-xs font-bold text-accent hover:text-accent-hover transition-colors"
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stacked cards per block (<sm) — sin scroll horizontal en 375px */}
        <div className="sm:hidden space-y-3">
          {rows.map(({ group, option, summary }) => (
            <div key={group.id} className="rounded-xl border border-card-border bg-card p-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <span className="text-2xs font-bold uppercase tracking-wider text-navy">{GROUP_LABELS[group.id]}</span>
                <button
                  type="button"
                  onClick={() => setDetailGroupId(group.id)}
                  className="text-2xs font-bold text-accent hover:text-accent-hover transition-colors whitespace-nowrap"
                >
                  Ver detalles
                </button>
              </div>
              <div className="mt-2 text-xs text-ink-secondary">
                <SelectionDetails option={option} summary={summary} />
              </div>
              <div className="mt-3 pt-2.5 border-t border-card-border/60 flex items-center justify-between gap-3">
                <span className="text-3xs font-bold uppercase tracking-wider text-ink-muted">Inversión</span>
                <div className="text-md font-extrabold text-navy text-right">
                  <BlockInvestment option={option} summary={summary} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. Cuadrantes Project Canvas ── */}
      {content.quadrants && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.quadrants.map((quad, i) => (
            <div key={i} className="rounded-xl border border-card-border bg-card p-5 shadow-xs space-y-3">
              <h4 className="text-[11.5px] font-extrabold uppercase tracking-wider text-navy border-b border-card-border/50 pb-2">{quad.title}</h4>
              <ul className="space-y-2">
                {quad.items.map((item, j) => (
                  <li key={j} className="text-[12px] leading-relaxed text-ink-secondary">• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* ── 3. Plan de Implementación (Roadmap) ── */}
      {content.roadmap && (
        <div className="rounded-xl border border-card-border bg-card p-5 shadow-xs">
          <h4 className="mb-4 text-xs sm:text-sm font-bold text-navy">6. Plan de Implementación de Ingeniería (Roadmap de 8 Semanas)</h4>
          <div className="space-y-5 border-l-2 border-accent-soft pl-4">
            {content.roadmap.map((phase, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-accent" />
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">{phase.week}</span>
                  <span className="text-xs sm:text-[13px] font-bold text-navy">{phase.phase}</span>
                </div>
                {phase.milestone && (
                  <p className="mb-2 text-[10.5px] font-bold text-positive">{phase.milestone}</p>
                )}
                <ul className="space-y-1">
                  {phase.actions.map((act, j) => (
                    <li key={j} className="text-[11.5px] text-ink-secondary leading-relaxed">— {act}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Final Accept/Reject Footer Actions ── */}
      <div className="flex flex-wrap gap-3.5 pt-6 border-t border-card-border justify-end">
        <button
          type="button"
          onClick={onReject}
          className="inline-flex items-center gap-2 rounded-xl bg-red-soft px-6 py-3 text-[13px] font-bold text-red transition-colors hover:bg-red-soft/70 shadow-xs"
        >
          {content.buttons.reject}
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="inline-flex items-center gap-2 rounded-xl bg-green px-7 py-3 text-[13px] font-bold text-white shadow-md shadow-green/25 transition-colors hover:bg-green/90"
        >
          {content.buttons.accept}
        </button>
      </div>

      {/* ── Cost/Specs Details Breakdown Modal ── */}
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
      />
    </section>
  );
}
