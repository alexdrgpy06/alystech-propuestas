import { motion } from 'framer-motion';

interface IntroStepProps {
  onStart: () => void;
}

const MODULE_CHIPS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="7" y="1" width="10" height="18" rx="2" /><circle cx="12" cy="16" r="0.8" fill="currentColor" />
      </svg>
    ),
    label: 'Gestión Móvil',
    cls: 'bg-blue-soft text-blue border-blue/20',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="2" y="3" width="20" height="5" rx="1.5" /><rect x="2" y="10.5" width="20" height="5" rx="1.5" /><circle cx="18.5" cy="5.5" r="1" fill="currentColor" />
      </svg>
    ),
    label: 'Infraestructura',
    cls: 'bg-accent-soft text-accent border-accent/20',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: 'Seguridad Perimetral',
    cls: 'bg-positive-soft text-positive border-positive/20',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
      </svg>
    ),
    label: 'Auditoría & SIEM',
    cls: 'bg-amber-soft text-amber border-amber/20',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    label: 'Soporte Técnico',
    cls: 'bg-card-hover text-ink-secondary border-card-border',
  },
];

export function IntroStep({ onStart }: IntroStepProps) {
  return (
    <div className="flex flex-col items-center text-center w-full max-w-2xl mx-auto py-4 space-y-6">

      {/* Logo — large, dark bg, colored border */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-3"
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#0a0f1e] border-2 border-accent/50 flex items-center justify-center shadow-2xl shadow-accent/20 overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Alystech"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (fb) fb.style.display = 'flex';
            }}
          />
          <span
            style={{ display: 'none' }}
            className="text-3xl font-black text-accent items-center justify-center w-full h-full"
          >
            AT
          </span>
        </div>
        <span className="text-3xs font-bold uppercase tracking-[0.25em] text-accent">Alystech</span>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        className="space-y-2"
      >
        <p className="text-2xs font-bold uppercase tracking-[0.2em] text-ink-muted">
          Propuesta Técnica Interactiva · Ref. AT-2026-0630-P Rev. 7
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink leading-tight text-balance">
          Plan Estratégico de Ciberseguridad
          <br />
          <span className="text-accent">para Araucanos S.A.</span>
        </h1>
      </motion.div>

      {/* Context cards */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left"
      >
        <div className="rounded-xl border border-danger/20 bg-danger-soft/30 p-4 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-danger-soft border border-danger/15 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-danger" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="7" y="1" width="10" height="18" rx="2" />
              </svg>
            </span>
            <h3 className="text-xs font-bold text-ink">Flota Móvil en Campo</h3>
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed pl-8">
            Personal desactiva geolocalización y apaga terminales Samsung para eludir controles de ruta.
          </p>
        </div>
        <div className="rounded-xl border border-danger/20 bg-danger-soft/30 p-4 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-danger-soft border border-danger/15 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-danger" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="2" y="3" width="20" height="5" rx="1.5" />
                <rect x="2" y="10.5" width="20" height="5" rx="1.5" />
              </svg>
            </span>
            <h3 className="text-xs font-bold text-ink">Infraestructura Administrativa</h3>
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed pl-8">
            Red sin aislamiento perimetral. Intrusiones activas de malware y troyanos registradas.
          </p>
        </div>
      </motion.div>

      {/* Explainer */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.4 }}
        className="rounded-2xl border border-card-border bg-card p-5 text-left space-y-3.5 shadow-xs w-full"
      >
        <p className="text-sm text-ink-secondary leading-relaxed">
          Alystech ha preparado este configurador interactivo para que la Gerencia evalúe, personalice y apruebe cada componente del plan de protección. En los pasos siguientes encontrará las alternativas técnicas para cada módulo de su infraestructura —{' '}
          <strong className="text-ink">seleccione la opción que mejor se ajuste a su presupuesto y objetivos</strong>. Al finalizar obtendrá un resumen ejecutivo con costos consolidados, cronograma y opciones de aprobación.
        </p>
        <div className="flex flex-wrap gap-2">
          {MODULE_CHIPS.map((chip) => (
            <span
              key={chip.label}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-2xs font-semibold ${chip.cls}`}
            >
              {chip.icon}
              {chip.label}
            </span>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.44, duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="w-full sm:w-auto bg-accent text-white hover:bg-accent-hover font-bold py-3.5 px-10 rounded-xl flex items-center justify-center gap-2.5 shadow-xl shadow-accent/25 transition-colors text-sm"
      >
        Iniciar Configuración
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      <p className="text-3xs text-ink-muted">
        Paraguay, 2026 · Confidencial para Araucanos S.A.
      </p>
    </div>
  );
}
