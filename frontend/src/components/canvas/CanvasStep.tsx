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
import { formatUsd, formatGs } from '@/lib/currency';
import type { Totals } from '@/types/proposal';
import { CostBreakdownModal } from '../ui/CostBreakdownModal';

// SVG icons — one per group
function BlockIcon({ id, className = 'w-4 h-4' }: { id: GroupId; className?: string }) {
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
  }
}

const GROUP_LABELS: Record<GroupId, string> = {
  mdm: 'Plataforma Móvil',
  srv: 'Servidor Central',
  net: 'Red Perimetral',
  aud: 'Auditoría y SIEM',
  sup: 'Soporte Técnico',
};

const GROUP_BLOCK: Record<GroupId, string> = {
  mdm: 'A',
  srv: 'B.1',
  net: 'B.2',
  aud: 'C',
  sup: 'D',
};

const GROUP_COLOR: Record<GroupId, string> = {
  mdm: 'text-blue bg-blue-soft border-blue/20',
  srv: 'text-accent bg-accent-soft border-accent/20',
  net: 'text-positive bg-positive-soft border-positive/20',
  aud: 'text-amber bg-amber-soft border-amber/20',
  sup: 'text-ink-secondary bg-card-hover border-card-border',
};

// Quadrant icons
const QUAD_ICONS: Record<string, JSX.Element> = {
  'Diagnóstico Operativo': (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  'Arquitectura Tecnológica': (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="3" width="20" height="5" rx="1.5" />
      <path strokeLinecap="round" d="M6 8v3m12-3v3M12 8v3M6 11h12" />
      <rect x="4" y="14" width="4" height="4" rx="1" />
      <rect x="10" y="14" width="4" height="4" rx="1" />
      <rect x="16" y="14" width="4" height="4" rx="1" />
    </svg>
  ),
  'Configuración de Alcance': (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 3v2m0 14v2M3 12h2m14 0h2" />
    </svg>
  ),
  'Viabilidad y Cronograma': (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
      <path strokeLinecap="round" d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  ),
  'Resumen de Presupuesto': (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
};

function BlockInvestment({ option, summary }: { option: PlanOption; summary: BlockAddonSummary }) {
  const isAño = option.priceUnit === '/año' && summary.year1Usd === summary.recurUsd;
  return (
    <div className="text-right">
      <span className="text-sm font-extrabold text-navy">
        {formatUsd(summary.year1Usd)}
      </span>
      <span className="text-2xs text-ink-muted ml-0.5">{isAño ? '/año' : ' Año 1'}</span>
      {!isAño && summary.recurUsd > 0 && (
        <div className="text-2xs text-ink-secondary mt-0.5">
          +{formatUsd(summary.recurUsd)}<span className="text-ink-muted">/año</span>
        </div>
      )}
    </div>
  );
}

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

import type { JSX } from 'react';

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
    (o) => o.id === selections[detailGroupId!],
  );

  const rows = groups.flatMap((group) => {
    const option = group.options.find((o) => o.id === selections[group.id]);
    if (!option) return [];
    return [{ group, option, summary: summarizeBlockAddons(group, option, addonSelections[group.id] ?? []) }];
  });

  return (
    <section className="space-y-5 w-full max-w-4xl mx-auto pb-8">

      {/* ── Executive header ── */}
      <div className="rounded-2xl overflow-hidden border border-card-border shadow-sm">
        <div className="bg-navy px-5 py-3.5 flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Alystech"
            className="h-7 w-auto object-contain opacity-90 shrink-0"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-3xs font-bold uppercase tracking-widest text-accent/90">Resumen Ejecutivo</p>
            <h3 className="text-sm sm:text-base font-extrabold text-ink-on-dark leading-snug truncate">
              {content.title}
            </h3>
          </div>
          <div className="hidden sm:block text-right shrink-0">
            <p className="text-3xs text-ink-on-dark-secondary leading-tight">Ref. AT-2026-0630-P · Rev. 7</p>
            <p className="text-3xs text-ink-on-dark-secondary leading-tight">Paraguay, junio 2026</p>
          </div>
        </div>
        {content.subtitle && (
          <div className="bg-card-hover px-5 py-2.5 border-t border-card-border/60">
            <p className="text-xs text-slate">{content.subtitle}</p>
          </div>
        )}
      </div>

      {/* ── Investment hero ── */}
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent-soft/70 via-blue-50/50 to-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xs font-bold uppercase tracking-widest text-accent">Inversión Estimada Total</p>
            <motion.p
              key={totals.totalUsd}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-navy mt-0.5 leading-none"
            >
              {formatUsd(totals.totalUsd)}
            </motion.p>
            <p className="mt-1.5 text-xs text-ink-secondary">
              Año 1 estimativo, IVA incluido · <span className="font-semibold">≈ {formatGs(totals.totalUsd, exchangeRate)}</span>
              {totals.recurUsd > 0 && (
                <> · Recurrente: <span className="font-semibold text-navy">{formatUsd(totals.recurUsd)}/año</span></>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <button
              type="button"
              onClick={onConsulta}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-card-border text-xs font-bold text-navy hover:bg-card-hover shadow-xs transition-colors min-h-[40px]"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {content.buttons.consulta}
            </button>
            <button
              type="button"
              onClick={onDownloadPdf}
              disabled={pdfPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy text-xs font-bold text-white shadow-md shadow-navy/25 hover:bg-navy-2 disabled:opacity-60 transition-colors min-h-[40px]"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 7.414V19a2 2 0 01-2 2z" />
              </svg>
              {pdfPending ? 'Generando…' : content.buttons.pdf}
            </button>
          </div>
        </div>
      </div>

      {/* ── Selection table ── */}
      {rows.length > 0 && (
        <div className="rounded-xl border border-card-border bg-card overflow-hidden shadow-xs">
          {/* Desktop table */}
          <table className="hidden sm:table w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-card-hover border-b border-card-border">
                <th className="py-2.5 px-4 text-2xs font-bold uppercase tracking-wider text-ink-muted">Bloque</th>
                <th className="py-2.5 px-4 text-2xs font-bold uppercase tracking-wider text-ink-muted">Alternativa seleccionada</th>
                <th className="py-2.5 px-4 text-2xs font-bold uppercase tracking-wider text-ink-muted text-right">Inversión</th>
                <th className="py-2.5 px-3 text-2xs font-bold uppercase tracking-wider text-ink-muted text-center w-16">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/50">
              {rows.map(({ group, option, summary }) => {
                const colorCls = GROUP_COLOR[group.id];
                return (
                  <tr key={group.id} className="hover:bg-card-hover/30 transition-colors">
                    <td className="py-3 px-4 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${colorCls}`}>
                          <BlockIcon id={group.id} className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <div className="text-3xs font-bold uppercase tracking-wider text-ink-muted">{GROUP_BLOCK[group.id]}</div>
                          <div className="text-xs font-bold text-navy">{GROUP_LABELS[group.id]}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 align-middle">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-3xs font-bold bg-accent-soft text-accent border border-accent/20 px-1.5 py-0.5 rounded shrink-0">
                          {option.code}
                        </span>
                        <span className="font-semibold text-navy">{option.name}</span>
                      </div>
                      {/* Addons summary */}
                      {(summary.charged.length > 0 || summary.included.length > 0) && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {summary.charged.map((a) => (
                            <span key={a.id} className="text-3xs bg-accent-soft text-accent border border-accent/15 px-1.5 py-0.5 rounded-full">
                              +{a.label}
                            </span>
                          ))}
                          {summary.included.map((a) => (
                            <span key={a.id} className="text-3xs bg-card-hover text-ink-muted border border-card-border px-1.5 py-0.5 rounded-full">
                              ✓ {a.label}
                            </span>
                          ))}
                          {summary.availableCount > 0 && (
                            <span className="text-3xs text-ink-muted">
                              +{summary.availableCount} addon{summary.availableCount > 1 ? 's' : ''} disponible{summary.availableCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 align-middle text-right">
                      <BlockInvestment option={option} summary={summary} />
                    </td>
                    <td className="py-3 px-3 align-middle text-center">
                      <button
                        type="button"
                        onClick={() => setDetailGroupId(group.id)}
                        className="inline-flex items-center gap-1 text-2xs font-bold text-accent hover:text-accent-hover transition-colors min-h-[36px]"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-card-border/50">
            {rows.map(({ group, option, summary }) => {
              const colorCls = GROUP_COLOR[group.id];
              return (
                <div key={group.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md border flex items-center justify-center ${colorCls}`}>
                        <BlockIcon id={group.id} className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs font-bold text-navy">{GROUP_LABELS[group.id]}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDetailGroupId(group.id)}
                      className="text-2xs font-bold text-accent hover:text-accent-hover"
                    >
                      Ver ficha
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-3xs font-bold bg-accent-soft text-accent border border-accent/20 px-1.5 py-0.5 rounded">
                        {option.code}
                      </span>
                      <span className="text-xs font-semibold text-navy">{option.name}</span>
                    </div>
                    <BlockInvestment option={option} summary={summary} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Strategy quadrants ── */}
      {content.quadrants && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-card-border" />
            <span className="text-2xs font-bold uppercase tracking-widest text-ink-muted shrink-0 flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              Cuadrantes de estrategia
            </span>
            <div className="flex-1 h-px bg-card-border" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.quadrants.map((quad, i) => {
              const icon = QUAD_ICONS[quad.title];
              return (
                <div key={i} className="rounded-xl border border-card-border bg-card p-4 space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    {icon && (
                      <span className="w-6 h-6 rounded-md bg-accent-soft border border-accent/15 flex items-center justify-center text-accent shrink-0">
                        {icon}
                      </span>
                    )}
                    <h5 className="text-xs font-extrabold text-navy leading-snug">{quad.title}</h5>
                  </div>
                  <ul className="space-y-1.5 pl-1">
                    {quad.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-xs text-ink-secondary leading-snug">
                        <span className="text-accent/50 shrink-0 mt-0.5">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Roadmap ── */}
      {content.roadmap && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-card-border" />
            <span className="text-2xs font-bold uppercase tracking-widest text-ink-muted shrink-0 flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M9 19V6l12-3v13" />
                <circle cx="6" cy="19" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              Roadmap de implementación
            </span>
            <div className="flex-1 h-px bg-card-border" />
          </div>
          <div className="rounded-xl border border-card-border bg-card p-5 shadow-xs">
            <div className="space-y-5 border-l-2 border-accent/25 pl-5 ml-2">
              {content.roadmap.map((phase, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-accent shadow-sm" />
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="rounded-md bg-accent-soft border border-accent/15 px-2 py-0.5 text-3xs font-bold uppercase tracking-wider text-accent">
                      {phase.week}
                    </span>
                    <span className="text-xs font-bold text-navy">{phase.phase}</span>
                  </div>
                  {phase.milestone && (
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-md border border-positive/20 bg-positive-soft px-2.5 py-1 text-2xs font-semibold text-positive">
                      <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Hito: {phase.milestone}
                    </div>
                  )}
                  <ul className="space-y-1">
                    {phase.actions.map((act, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-xs text-ink-secondary leading-relaxed">
                        <span className="text-accent/40 shrink-0 mt-0.5">—</span>
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Accept / Reject ── */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-card-border">
        <button
          type="button"
          onClick={onReject}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border-2 border-danger/20 bg-danger-soft/60 hover:bg-danger-soft px-6 py-3 text-sm font-bold text-danger transition-colors min-h-[44px]"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {content.buttons.reject}
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-positive hover:bg-positive-hover px-8 py-3 text-sm font-bold text-white shadow-lg shadow-positive/20 transition-colors min-h-[44px]"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {content.buttons.accept}
        </button>
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
        groupIcon={detailGroupId ?? undefined}
        optionCode={selectedDetailOption?.code}
      />
    </section>
  );
}
