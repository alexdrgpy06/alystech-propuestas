import { motion } from 'framer-motion';
import type { TcoContent, Totals, OptionGroupContent } from '@/types/proposal';
import { formatUsd } from '@/lib/currency';

interface TcoComparisonStepProps {
  content: TcoContent;
  totals: Totals;
  groups: OptionGroupContent[];
}

export function TcoComparisonStep({ content, totals, groups }: TcoComparisonStepProps) {
  // Exclude hardware from both columns as hardware is paid by client in any case
  const alystechDev = totals.totalUsd - totals.hwUsd - totals.recurUsd;
  const alystechSupport3Years = totals.recurUsd * content.years;
  const alystechTotal3Years = alystechDev + alystechSupport3Years;

  const saasLicensing3Years = (content.saasPerDeviceUsd * content.deviceCount * content.years) + 20000; // MDM + Server SaaS license
  const saasSupport3Years = 25000;
  const saasTotal3Years = saasLicensing3Years + saasSupport3Years;

  const savingsUsd = saasTotal3Years - alystechTotal3Years;
  const savingsPct = Math.round((savingsUsd / saasTotal3Years) * 100);

  return (
    <div className="space-y-8 pb-10 w-full max-w-4xl mx-auto">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-2 text-xl sm:text-2xl font-extrabold text-navy">{content.title}</h2>
        <p className="text-sm leading-relaxed text-slate">
          Para facilitar una auditoría financiera clara, se presenta una comparación enfocada exclusivamente en costos de licenciamiento, desarrollo, implementación y soporte técnico. Se excluyen los costos de adquisición de hardware físico en ambas columnas por ser un activo directo del cliente.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col rounded-2xl border border-card-border bg-card p-6 shadow-xs"
        >
          <div className="mb-4 text-center">
            <span className="mb-1 block text-2xs font-bold uppercase tracking-widest text-ink-secondary">Servicio SaaS Licenciado Regional</span>
            <div className="text-2xl font-black text-navy">{formatUsd(saasTotal3Years)}</div>
            <div className="text-xs font-medium text-ink-muted">Costo acumulado (Licencias y Soporte) a {content.years} años</div>
          </div>
          <div className="mt-4 flex-1 space-y-3.5 border-t border-card-border pt-4 text-xs text-ink-secondary">
            <div className="flex justify-between gap-4">
              <span>Licenciamiento MDM Cloud (80 disp. x {content.years} años)</span>
              <span className="font-semibold text-navy">{formatUsd(content.saasPerDeviceUsd * content.deviceCount * content.years)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Licenciamiento Software Servidor/Firewall</span>
              <span className="font-semibold text-navy">$20.000</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Soporte Técnico Especializado (SLA 3 años)</span>
              <span className="font-semibold text-navy">{formatUsd(saasSupport3Years)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col rounded-2xl border border-navy bg-navy-2 p-6 text-white shadow-md"
        >
          <div className="mb-4 text-center">
            <span className="mb-1 block text-2xs font-bold uppercase tracking-widest text-blue-300">Alystech (Implementación y Soporte Único)</span>
            <div className="text-2xl font-black text-white">{formatUsd(alystechTotal3Years)}</div>
            <div className="text-xs font-medium text-blue-200">Costo acumulado (Desarrollo y Soporte) a {content.years} años</div>
          </div>
          <div className="mt-4 flex-1 space-y-3.5 border-t border-white/10 pt-4 text-xs text-white/80">
            <div className="flex justify-between gap-4">
              <span>Ingeniería, Desarrollo e Implementación (Costo Único)</span>
              <span className="font-semibold text-white">{formatUsd(alystechDev)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Licenciamiento de Software Lógico</span>
              <span className="font-semibold text-white">$0 (Código Abierto)</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Abono de Soporte y Suscripciones (3 años acumulados)</span>
              <span className="font-semibold text-white">{formatUsd(alystechSupport3Years)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-hidden rounded-xl border border-green-200 bg-positive-soft text-center"
      >
        <div className="bg-positive px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white">
          Justificación del Retorno de Inversión (ROI)
        </div>
        <div className="p-5">
          <p className="text-md leading-relaxed text-navy">
            Al optar por el esquema de Alystech, Araucanos S.A. evita cargos recurrentes de suscripción de licencias y reduce su costo a 3 años en un <strong>{savingsPct}%</strong>. Esto representa un ahorro neto de <strong>{formatUsd(savingsUsd)}</strong> en servicios profesionales, desarrollo e ingeniería.
          </p>
        </div>
      </motion.div>

      {/* Module-specific Regional comparisons */}
      <div className="space-y-4 pt-8 border-t border-card-border">
        <h3 className="text-xs font-bold uppercase tracking-widest text-ink-muted text-center">
          Comparativa Regional por Módulo Operativo (Excluyendo Hardware)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups
            .filter((g) => g.tcoRegional)
            .map((g, idx) => {
              // Exclude hardware values for module display
              let competitorLabel = g.tcoRegional!.competitorLabel;
              let competitorValue = g.tcoRegional!.competitorValue;
              let alystechLabel = g.tcoRegional!.alystechLabel;
              let alystechValue = g.tcoRegional!.alystechValue;

              if (g.id === 'srv') {
                competitorLabel = 'Licencias de virtualización SaaS regional';
                competitorValue = '$3.200 / año';
                alystechLabel = 'Hipervisor Proxmox VE (Alystech)';
                alystechValue = '$0 / año';
              }

              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="rounded-xl border border-card-border bg-card p-5 space-y-3.5 shadow-xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-3xs font-bold uppercase tracking-wider text-accent bg-accent-soft px-2 py-0.5 rounded-full shrink-0">
                      {g.code}
                    </span>
                    <span className="text-xs font-bold text-navy text-right">{g.title}</span>
                  </div>
                  <p className="text-2xs text-ink-secondary leading-relaxed">
                    {g.id === 'srv' ? 'Comparación de costos de licenciamiento lógico para servidores centrales sin contemplar adquisición de fierros:' : g.tcoRegional!.description}
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-card-border/50 text-danger">
                      <span>{competitorLabel}</span>
                      <strong className="font-semibold">{competitorValue}</strong>
                    </div>
                    <div className="flex justify-between items-center py-1 text-positive">
                      <span>{alystechLabel}</span>
                      <strong className="font-bold">{alystechValue}</strong>
                    </div>
                  </div>
                  <p className="text-2xs text-ink-muted italic leading-snug pt-0.5">
                    {g.id === 'srv' ? 'El uso de Proxmox VE evita abonos recurrentes por software de virtualización propietario.' : g.tcoRegional!.savingsText}
                  </p>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
