import { motion } from 'framer-motion';
import { PrimaryButton } from '@/components/ui/ActionButton';

interface IntroStepProps {
  onStart: () => void;
}

const MODULE_CHIPS = [
  {
    icon: (
      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0" }}>
        devices
      </span>
    ),
    label: 'Gestión Móvil',
    cls: 'bg-primary/10 text-primary border-primary/20',
  },
  {
    icon: (
      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0" }}>
        dns
      </span>
    ),
    label: 'Infraestructura',
    cls: 'bg-primary/10 text-primary border-primary/20',
  },
  {
    icon: (
      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0" }}>
        security
      </span>
    ),
    label: 'Seguridad Perimetral',
    cls: 'bg-positive/10 text-positive border-positive/20',
  },
  {
    icon: (
      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0" }}>
        search
      </span>
    ),
    label: 'Auditoría & SIEM',
    cls: 'bg-warning/10 text-warning border-warning/20',
  },
  {
    icon: (
      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0" }}>
        support_agent
      </span>
    ),
    label: 'Soporte Técnico',
    cls: 'bg-surface-container-high text-ink-secondary border-border-slate',
  },
];

export function IntroStep({ onStart }: IntroStepProps) {
  return (
    <div className="w-full max-w-[720px] mx-auto flex flex-col items-center text-center space-y-md md:space-y-lg py-md md:py-xl">
      {/* Logo/Icon Anchor */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-3"
      >
        <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl bg-ink-navy shadow-lg shadow-primary/20 flex items-center justify-center mb-md overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="AlysTech"
            className="w-[140%] h-full object-cover object-top"
          />
        </div>
        <span className="font-label-caps text-label-caps text-primary">Alystech</span>
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        className="space-y-sm"
      >
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-ink-navy">
          Bienvenido a AlysTech
        </h1>
        <p className="font-body-base text-body-base text-ink-secondary max-w-[32rem] mx-auto">
          Optimiza tus procesos y descubre soluciones tecnológicas avanzadas adaptadas a las necesidades de tu empresa. Configura tu entorno en unos simples pasos.
        </p>
      </motion.div>

      {/* Module Chips */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        className="flex flex-wrap justify-center gap-2 w-full"
      >
        {MODULE_CHIPS.map((chip) => (
          <span
            key={chip.label}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-label-caps font-semibold ${chip.cls}`}
          >
            {chip.icon}
            {chip.label}
          </span>
        ))}
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.4 }}
        className="pt-md md:pt-lg"
      >
        <PrimaryButton
          onClick={onStart}
          size="md"
          rightIcon={
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>
              arrow_forward
            </span>
          }
        >
          Empezar
        </PrimaryButton>
      </motion.div>

      {/* Progress Indicator (Decorative for welcome screen) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.42, duration: 0.4 }}
        className="flex gap-2 pt-lg mt-lg md:pt-xl md:mt-xl border-t border-border-slate w-full max-w-[200px] justify-center opacity-50"
      >
        <div className="w-8 h-1 bg-primary rounded-full" />
        <div className="w-8 h-1 bg-border-slate rounded-full" />
        <div className="w-8 h-1 bg-border-slate rounded-full" />
      </motion.div>

      <p className="font-body-medium text-body-medium text-ink-muted">
        Paraguay, 2026 · Confidencial para Araucanos S.A.
      </p>
    </div>
  );
}
