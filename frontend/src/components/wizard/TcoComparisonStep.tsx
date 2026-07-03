import type { JSX } from 'react';
import { motion } from 'framer-motion';
import type { TcoContent, Totals, OptionGroupContent } from '@/types/proposal';
import { formatUsd } from '@/lib/currency';

interface TcoComparisonStepProps {
  content: TcoContent;
  totals: Totals;
  groups: OptionGroupContent[];
}

// SVG icons for each module block
const MODULE_ICONS: Record<string, JSX.Element> = {
  mdm: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  srv: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="2" y="3" width="20" height="5" rx="1.5" />
      <rect x="2" y="10" width="20" height="5" rx="1.5" />
      <rect x="2" y="17" width="20" height="4" rx="1.5" />
      <circle cx="18" cy="5.5" r="1" fill="currentColor" />
      <circle cx="18" cy="12.5" r="1" fill="currentColor" />
    </svg>
  ),
  net: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  aud: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
    </svg>
  ),
  sup: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
};

export function TcoComparisonStep({ content, totals, groups }: TcoComparisonStepProps) {
  // Exclude hardware from both columns
  const alystechDev = totals.totalUsd - totals.hwUsd - totals.recurUsd;
  const alystechSupport3Years = totals.recurUsd * content.years;
  const alystechTotal3Years = alystechDev + alystechSupport3Years;

  const saasLicensing3Years = (content.saasPerDeviceUsd * content.deviceCount * content.years) + 20000;
  const saasSupport3Years = 25000;
  const saasTotal3Years = saasLicensing3Years + saasSupport3Years;

  const savingsUsd = saasTotal3Years - alystechTotal3Years;
  const savingsPct = Math.round((savingsUsd / saasTotal3Years) * 100);

  return (
    <div className="space-y-6 pb-6 w-full max-w-4xl mx-auto flex-1 flex flex-col">

      {/* Step header */}
      <div className="text-center space-y-2">
        <p className="text-2xs font-bold uppercase tracking-[0.2em] text-accent">Análisis Financiero</p>
        <h2 className="text-xl sm:text-2xl font-extrabold text-navy">{content.title}</h2>
        <p className="text-sm text-slate max-w-2xl mx-auto leading-relaxed">
          Comparación de costos enfocada en licenciamiento, desarrollo, implementación y soporte técnico. Hardware excluido de ambas columnas por ser activo directo del cliente.
        </p>
      </div>

      {/* Main comparison: 2 columns */}
      <div className="grid gap-4 md:grid-cols-2 items-stretch">
        {/* SaaS column */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col rounded-2xl border border-card-border bg-card overflow-hidden shadow-xs"
        >
          <div className="bg-card-hover px-5 py-4 border-b border-card-border">
            <span className="text-3xs font-bold uppercase tracking-widest text-ink-secondary">Alternativa de Mercado</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-navy">{formatUsd(saasTotal3Years)}</span>
              <span className="text-xs text-ink-muted">a {content.years} años</span>
            </div>
            <p className="text-2xs text-ink-muted mt-0.5">Servicio SaaS Licenciado Regional</p>
          </div>
          <div className="flex-1 p-5 space-y-3">
            {[
              { label: `Licenciamiento MDM Cloud (80 disp. × ${content.years} años)`, value: formatUsd(content.saasPerDeviceUsd * content.deviceCount * content.years) },
              { label: 'Licenciamiento Software Servidor / Firewall', value: '$20.000' },
              { label: `Soporte Técnico Especializado (SLA ${content.years} años)`, value: formatUsd(saasSupport3Years) },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-start gap-3 text-xs">
                <span className="text-slate leading-snug">{row.label}</span>
                <span className="font-semibold text-navy whitespace-nowrap shrink-0">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alystech column */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col rounded-2xl border-2 border-accent overflow-hidden shadow-md relative"
        >
          <div className="h-1 bg-gradient-to-r from-accent to-blue-dark" />
          <div className="bg-accent-soft/50 px-5 py-4 border-b border-accent/20">
            <span className="text-3xs font-bold uppercase tracking-widest text-accent">Solución Alystech</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-navy">{formatUsd(alystechTotal3Years)}</span>
              <span className="text-xs text-navy/60">a {content.years} años</span>
            </div>
            <p className="text-2xs text-navy/60 mt-0.5">Implementación y Soporte Propio</p>
          </div>
          <div className="flex-1 p-5 space-y-3">
            {[
              { label: 'Ingeniería, Desarrollo e Implementación (costo único)', value: formatUsd(alystechDev), color: 'text-navy' },
              { label: 'Licenciamiento de Software Lógico', value: '$0 — Código Abierto', color: 'text-positive font-bold' },
              { label: `Abono de Soporte y Suscripciones (${content.years} años acumulados)`, value: formatUsd(alystechSupport3Years), color: 'text-navy' },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-start gap-3 text-xs">
                <span className="text-slate leading-snug">{row.label}</span>
                <span className={`${row.color ?? 'font-semibold text-navy'} whitespace-nowrap shrink-0`}>{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Savings banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-positive/25 bg-positive-soft overflow-hidden"
      >
        <div className="grid sm:grid-cols-[1fr_auto] gap-0 items-center">
          <div className="px-5 sm:px-6 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-positive mb-1">Justificación del Retorno de Inversión</p>
            <p className="text-sm leading-relaxed text-navy">
              Al optar por Alystech, Araucanos S.A. evita cargos recurrentes de suscripción y reduce su costo total a 3 años en un <strong>{savingsPct}%</strong>, representando un ahorro neto de <strong>{formatUsd(savingsUsd)}</strong> en servicios profesionales, desarrollo e ingeniería.
            </p>
          </div>
          <div className="bg-positive px-6 py-5 text-center sm:h-full flex flex-col items-center justify-center gap-0.5 shrink-0">
            <span className="text-3xs font-bold uppercase tracking-widest text-white/80">Ahorro</span>
            <span className="text-3xl font-black text-white">{savingsPct}%</span>
            <span className="text-xs text-white/80">{formatUsd(savingsUsd)}</span>
          </div>
        </div>
      </motion.div>

      {/* Module-specific regional comparisons */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-card-border" />
          <p className="text-2xs font-bold uppercase tracking-widest text-ink-muted shrink-0">
            Comparativa Regional por Módulo
          </p>
          <div className="flex-1 h-px bg-card-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups
            .filter((g) => g.tcoRegional)
            .map((g, idx) => {
              let competitorLabel = g.tcoRegional!.competitorLabel;
              let competitorValue = g.tcoRegional!.competitorValue;
              let alystechLabel = g.tcoRegional!.alystechLabel;
              let alystechValue = g.tcoRegional!.alystechValue;
              let description = g.tcoRegional!.description;
              let savingsText = g.tcoRegional!.savingsText;

              if (g.id === 'srv') {
                competitorLabel = 'Licencias de virtualización SaaS regional';
                competitorValue = '$3.200 / año';
                alystechLabel = 'Hipervisor Proxmox VE (Alystech)';
                alystechValue = '$0 / año';
                description = 'Comparación de costos de licenciamiento lógico para servidores centrales sin contemplar adquisición de hardware.';
                savingsText = 'El uso de Proxmox VE evita abonos recurrentes por software de virtualización propietario.';
              }

              const icon = MODULE_ICONS[g.id];

              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="rounded-xl border border-card-border bg-card p-4 sm:p-5 space-y-3 shadow-xs hover:shadow-sm transition-shadow"
                >
                  {/* Module header */}
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-accent-soft border border-accent/15 flex items-center justify-center text-accent shrink-0">
                      {icon}
                    </span>
                    <div className="min-w-0">
                      <span className="text-3xs font-extrabold uppercase tracking-wider text-accent bg-accent-soft px-2 py-0.5 rounded-md border border-accent/15">
                        Bloque {g.code}
                      </span>
                      <p className="text-sm font-bold text-navy mt-0.5 leading-tight">
                        {g.title.split(' con ')[0].split(' y ')[0]}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate leading-relaxed">{description}</p>

                  {/* Comparison rows */}
                  <div className="space-y-2 pt-1 border-t border-card-border">
                    <div className="flex justify-between items-center gap-3 py-1">
                      <span className="text-xs text-slate leading-snug flex-1">{competitorLabel}</span>
                      <span className="bg-danger-soft text-danger font-bold rounded-lg px-2.5 py-1 text-2xs whitespace-nowrap border border-danger/15">
                        {competitorValue}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-3 py-1">
                      <span className="text-xs text-navy font-semibold leading-snug flex-1">{alystechLabel}</span>
                      <span className="bg-positive-soft text-positive font-extrabold rounded-lg px-2.5 py-1 text-2xs whitespace-nowrap border border-positive/15">
                        {alystechValue}
                      </span>
                    </div>
                  </div>

                  <p className="text-2xs text-slate/80 italic leading-snug pt-1 border-t border-dashed border-card-border">
                    {savingsText}
                  </p>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
