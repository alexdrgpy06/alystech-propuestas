import { motion } from 'framer-motion';
import type { TcoContent, Totals, OptionGroupContent } from '@/types/proposal';
import { formatUsd } from '@/lib/currency';
import { GlassPanel } from '@/components/ui/GlassPanel';

interface TcoComparisonStepProps {
  content: TcoContent;
  totals: Totals;
  groups: OptionGroupContent[];
}

// Material Symbols icons for each module
const MODULE_ICONS: Record<string, string> = {
  mdm: 'devices',
  srv: 'dns',
  net: 'hub',
  aud: 'security',
  sup: 'support_agent',
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
    <div className="w-full flex flex-col gap-6 py-4">
      {/* Step Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center"
      >
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full font-label-caps text-label-caps mb-4">
          Paso 12 de 13
        </span>
        <h1 className="font-headline-md md:font-display-lg text-headline-md md:text-display-lg text-on-surface mb-sm">
          Comparativa de Inversión a 3 Años (TCO)
        </h1>
        <p className="font-body-medium md:font-headline-md text-body-medium md:text-headline-md text-ink-secondary font-medium">
          Análisis proyectado de costos operativos y profesionales
        </p>
        {content.intro && (
          <p className="font-body-medium md:font-body-base text-body-medium md:text-body-base text-ink-muted max-w-2xl mx-auto mt-sm flex items-start gap-1.5 text-left">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 0" }}>
              info
            </span>
            {content.intro}
          </p>
        )}
      </motion.div>

      {/* Financial Dashboard Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-lg"
      >
        {/* Dev Cost Card */}
        <GlassPanel variant="light" elevated className="p-xl flex flex-col justify-between h-full">
          <div className="flex items-start justify-between mb-lg">
            <div className="bg-surface-container-low p-sm rounded-lg text-tertiary">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                code_blocks
              </span>
            </div>
            <span className="font-label-caps text-label-caps text-ink-muted bg-surface-container-low px-sm py-xs rounded-md uppercase">Pago único</span>
          </div>
          <div>
            <h3 className="font-body-medium text-body-medium text-ink-secondary mb-xs">Costo único de Desarrollo</h3>
            <div className="text-headline-md md:text-display-lg text-on-background">
              {formatUsd(alystechDev)} <span className="text-body-base font-body-base text-ink-muted font-normal">USD</span>
            </div>
            <p className="font-body-base text-body-base text-ink-muted mt-sm text-sm">
              Inversión inicial para arquitectura, diseño e implementación del sistema core.
            </p>
          </div>
        </GlassPanel>

        {/* Support Cost Card */}
        <GlassPanel variant="light" elevated className="p-xl flex flex-col justify-between h-full">
          <div className="flex items-start justify-between mb-lg">
            <div className="bg-surface-container-low p-sm rounded-lg text-tertiary">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                support_agent
              </span>
            </div>
            <span className="font-label-caps text-label-caps text-ink-muted bg-surface-container-low px-sm py-xs rounded-md uppercase">Recurrente anual</span>
          </div>
          <div>
            <h3 className="font-body-medium text-body-medium text-ink-secondary mb-xs">Soporte Acumulado (3 años)</h3>
            <div className="text-headline-md md:text-display-lg text-on-background">
              {formatUsd(alystechSupport3Years)} <span className="text-body-base font-body-base text-ink-muted font-normal">USD</span>
            </div>
            <p className="font-body-base text-body-base text-ink-muted mt-sm text-sm">
              Mantenimiento, actualizaciones de seguridad y soporte técnico garantizado.
            </p>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Total TCO Card (Full Width) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="bg-accent-soft border-2 border-primary rounded-xl p-xl shadow-md relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container opacity-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-xl">
          <div className="flex-1 w-full text-center md:text-left">
            <div className="inline-flex items-center gap-sm font-label-caps text-label-caps text-primary mb-sm uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance
              </span>
              Total Cost of Ownership Proyectado
            </div>
            <div className="text-[28px] md:text-[48px] leading-tight font-extrabold text-on-primary-fixed-variant">
              {formatUsd(alystechTotal3Years)} <span className="text-[24px] text-primary/70 font-normal">USD</span>
            </div>
          </div>
          {/* Visual Breakdown Bar */}
          <div className="w-full md:w-1/2">
            <div className="flex justify-between text-body-medium font-body-medium text-ink-secondary mb-xs">
              <span>Desarrollo ({Math.round((alystechDev / alystechTotal3Years) * 100)}%)</span>
              <span>Soporte ({Math.round((alystechSupport3Years / alystechTotal3Years) * 100)}%)</span>
            </div>
            <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden flex shadow-inner">
              <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${Math.round((alystechDev / alystechTotal3Years) * 100)}%` }} />
              <div className="h-full bg-secondary-fixed transition-all duration-1000 ease-out delay-300" style={{ width: `${Math.round((alystechSupport3Years / alystechTotal3Years) * 100)}%` }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Savings vs SaaS Alternative */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="rounded-xl border border-positive/25 bg-positive/5 p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <p className="font-label-caps text-label-caps text-positive mb-1">Justificación del Retorno de Inversión</p>
            <p className="font-body-base text-body-base text-ink-secondary leading-relaxed">
              Al optar por Alystech, Araucanos S.A. evita cargos recurrentes de suscripción y reduce su costo total a 3 años en un <strong>{savingsPct}%</strong>, representando un ahorro neto de <strong>{formatUsd(savingsUsd)}</strong> en servicios profesionales, desarrollo e ingeniería.
            </p>
          </div>
          <div className="bg-positive px-6 py-4 text-center flex flex-col items-center justify-center gap-1 shrink-0">
            <span className="font-label-caps text-label-caps text-white/80">Ahorro Proyectado</span>
            <span className="text-headline-md md:text-display-lg text-white">{savingsPct}%</span>
            <span className="font-body-medium text-body-medium text-white/80">{formatUsd(savingsUsd)}</span>
          </div>
        </div>
      </motion.div>

      {/* Module-specific regional comparisons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border-slate" />
          <p className="font-label-caps text-label-caps text-ink-muted shrink-0">Comparativa Regional por Módulo</p>
          <div className="flex-1 h-px bg-border-slate" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups
            .filter((g) => g.tcoRegional)
            .map((g, idx) => {
              const competitorLabel = g.tcoRegional!.competitorLabel;
              const competitorValue = g.tcoRegional!.competitorValue;
              const alystechLabel = g.tcoRegional!.alystechLabel;
              const alystechValue = g.tcoRegional!.alystechValue;
              const description = g.tcoRegional!.description;
              const savingsText = g.tcoRegional!.savingsText;

              const icon = MODULE_ICONS[g.id] || 'settings';

              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05, duration: 0.3 }}
                  className="rounded-xl border border-border-slate bg-surface-container-lowest p-4 sm:p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Module header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                        {icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="font-label-caps text-label-caps text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                        Bloque {g.code}
                      </span>
                      <p className="font-body-medium text-body-medium text-on-surface mt-1 leading-tight line-clamp-2">
                        {g.title}
                      </p>
                    </div>
                  </div>

                  <p className="font-body-base text-body-base text-ink-secondary leading-relaxed">{description}</p>

                  {/* Comparison rows */}
                  <div className="space-y-2 pt-2 border-t border-border-slate">
                    <div className="flex justify-between items-center gap-3 py-1">
                      <span className="font-body-base text-body-base text-ink-secondary leading-snug flex-1">{competitorLabel}</span>
                      <span className="bg-red-soft text-danger font-bold rounded-lg px-3 py-1.5 font-label-caps text-label-caps whitespace-nowrap border border-danger/20">
                        {competitorValue}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-3 py-1">
                      <span className="font-body-base text-body-base text-on-surface font-semibold leading-snug flex-1">{alystechLabel}</span>
                      <span className="bg-positive-soft text-positive font-extrabold rounded-lg px-3 py-1.5 font-label-caps text-label-caps whitespace-nowrap border border-positive/20">
                        {alystechValue}
                      </span>
                    </div>
                  </div>

                  <p className="font-body-medium text-body-medium text-ink-muted italic leading-snug pt-2 border-t border-dashed border-border-slate">
                    {savingsText}
                  </p>
                </motion.div>
              );
            })}
        </div>
      </motion.div>
    </div>
  );
}
