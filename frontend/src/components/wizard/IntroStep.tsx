import { motion } from 'framer-motion';

interface IntroStepProps {
  onStart: () => void;
}

export function IntroStep({ onStart }: IntroStepProps) {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto py-8 md:py-16 space-y-10">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-xl shadow-accent/20"
      >
        <span className="text-3xl font-extrabold text-white tracking-tight">AT</span>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="space-y-4"
      >
        <p className="text-2xs font-bold uppercase tracking-[0.2em] text-accent">
          Propuesta Técnica Interactiva
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink leading-tight">
          Plan Estratégico de Ciberseguridad
          <br />
          <span className="text-accent">para Araucanos S.A.</span>
        </h1>
        <p className="text-sm text-ink-secondary leading-relaxed max-w-lg mx-auto">
          Alystech ha preparado este configurador interactivo para que la Gerencia de Araucanos S.A. evalúe, personalice y apruebe cada componente del plan de protección de infraestructura y gestión de la flota móvil corporativa.
        </p>
      </motion.div>

      {/* Diagnostic summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left"
      >
        <div className="rounded-xl border border-card-border bg-card-hover p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-danger-soft flex items-center justify-center text-base">📱</span>
            <h3 className="text-sm font-bold text-ink">Flota Móvil en Campo</h3>
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Se ha detectado que el personal de campo desactiva la geolocalización y apaga los terminales Samsung para eludir los controles de ruta y patrullaje.
          </p>
        </div>
        <div className="rounded-xl border border-card-border bg-card-hover p-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-danger-soft flex items-center justify-center text-base">🖥️</span>
            <h3 className="text-sm font-bold text-ink">Infraestructura Administrativa</h3>
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed">
            La administración central opera sobre un computador estándar sin aislamiento de red. Se registraron intrusiones activas de malware y troyanos.
          </p>
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="w-full space-y-4"
      >
        <h2 className="text-xs font-bold uppercase tracking-widest text-ink-muted">
          Cómo funciona este configurador
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { n: '01', t: 'Diagnóstico', d: 'Cada módulo presenta el riesgo detectado y su impacto en la operación.' },
            { n: '02', t: 'Selección', d: 'Elija la alternativa técnica que mejor se ajuste a su presupuesto.' },
            { n: '03', t: 'Resumen', d: 'Al finalizar, obtendrá el canvas consolidado con costos y plazos.' },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-3 rounded-lg border border-card-border p-4">
              <span className="text-lg font-extrabold text-accent/30">{item.n}</span>
              <div>
                <span className="text-sm font-bold text-ink block">{item.t}</span>
                <span className="text-xs text-ink-secondary">{item.d}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="w-full sm:w-auto bg-accent text-white hover:bg-accent-hover font-bold py-3.5 px-10 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-accent/25 transition-colors text-sm"
      >
        Iniciar Configuración
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      <p className="text-2xs text-ink-muted">
        Referencia: AT-2026-0630-P · Rev. 7 · Paraguay, 2026
      </p>
    </div>
  );
}
