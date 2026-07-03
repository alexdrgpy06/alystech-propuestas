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
    <div className="space-y-8 pb-10 w-full max-w-4xl mx-auto flex-1 flex flex-col justify-stretch h-full">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-2 text-xl sm:text-2xl font-extrabold text-navy">{content.title}</h2>
        <p className="text-sm leading-relaxed text-slate">
          Para facilitar una auditoría financiera clara, se presenta una comparación enfocada exclusivamente en costos de licenciamiento, desarrollo, implementación y soporte técnico. Se excluyen los costos de adquisición de hardware físico en ambas columnas por ser un activo directo del cliente.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 flex-1 items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col rounded-2xl border border-card-border bg-card p-6 shadow-xs h-full"
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
          className="flex flex-col rounded-2xl border-2 border-blue bg-blue-50/40 p-6 shadow-md relative overflow-hidden"
        >
          {/* Subtle highlight band at the top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue to-accent" />
          
          <div className="mb-4 text-center">
            <span className="mb-1 block text-2xs font-bold uppercase tracking-widest text-blue">Alystech (Implementación y Soporte Único)</span>
            <div className="text-2xl font-black text-navy">{formatUsd(alystechTotal3Years)}</div>
            <div className="text-xs font-medium text-navy/70">Costo acumulado (Desarrollo y Soporte) a {content.years} años</div>
          </div>
          <div className="mt-4 flex-1 space-y-3.5 border-t border-blue/20 pt-4 text-xs text-ink-secondary">
            <div className="flex justify-between gap-4">
              <span>Ingeniería, Desarrollo e Implementación (Costo Único)</span>
              <span className="font-semibold text-navy">{formatUsd(alystechDev)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Licenciamiento de Software Lógico</span>
              <span className="font-semibold text-positive">$0 (Código Abierto)</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Abono de Soporte y Suscripciones (3 años acumulados)</span>
              <span className="font-semibold text-navy">{formatUsd(alystechSupport3Years)}</span>
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
      <div className="space-y-5 pt-8 border-t border-line-soft">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate text-center">
          Comparativa Regional por Módulo Operativo (Excluyendo Hardware)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
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
                  className="rounded-xl border border-line bg-card p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-3xs font-extrabold uppercase tracking-wider text-blue bg-blue-soft px-2.5 py-1 rounded-md shrink-0 border border-blue/10">
                        Bloque {g.code}
                      </span>
                      <span className="text-sm font-bold text-navy text-right">{g.title.split(' con ')[0].split(' y ')[0]}</span>
                    </div>
                    <p className="text-xs text-slate leading-relaxed">
                      {g.id === 'srv' ? 'Comparación de costos de licenciamiento lógico para servidores centrales sin contemplar adquisición de fierros:' : g.tcoRegional!.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2.5 pt-2 border-t border-line-soft">
                    <div className="flex justify-between items-center text-xs py-1 border-b border-line-soft">
                      <span className="text-slate">{competitorLabel}</span>
                      <span className="bg-red-soft text-red font-bold rounded px-2.5 py-0.5 whitespace-nowrap">{competitorValue}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-1">
                      <span className="text-navy font-semibold">{alystechLabel}</span>
                      <span className="bg-green-soft text-green font-extrabold rounded px-2.5 py-0.5 whitespace-nowrap">{alystechValue}</span>
                    </div>
                  </div>
                  
                  <p className="text-2xs text-slate/80 italic leading-snug pt-2 border-t border-dashed border-line">
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
