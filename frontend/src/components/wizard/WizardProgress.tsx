import { motion } from 'framer-motion';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const progressPct = (currentStep / (totalSteps - 1)) * 100;
  return (
    <div className="mb-6 space-y-3">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={totalSteps - 1}
        aria-valuenow={currentStep}
        aria-label={`Paso ${currentStep + 1} de ${totalSteps}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-line-soft"
      >
        <motion.div
          className="h-full bg-blue"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      <div aria-hidden="true" className="flex justify-between px-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              i <= currentStep ? 'bg-blue' : 'bg-line'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
