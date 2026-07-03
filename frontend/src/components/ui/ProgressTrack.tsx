import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface ProgressTrackProps {
  /** Current step (0-indexed) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Step labels (optional) */
  labels?: string[];
  /** Variant: 'segments' (bars) or 'dots' (circles) */
  variant?: 'segments' | 'dots';
  /** Show step label (e.g., "Paso 3 de 13") */
  showLabel?: boolean;
  /** Use light-on-dark colors (for placement on a dark header) */
  onDark?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * ProgressTrack - Wizard progress indicator
 * 
 * Based on DESIGN.md:
 * - Horizontal "Dot" or "Segment" indicator in header
 * - Active segments: Primary Blue
 * - Inactive segments: Muted Slate
 * - Segments: 2px height, 32px width, rounded-full
 * - Dots: 8px diameter, rounded-full
 * - Transition: all 0.3s ease
 * - Label: label-caps style (11px, uppercase, tracking-wide)
 */
export const ProgressTrack = ({
  currentStep,
  totalSteps,
  labels,
  variant = 'segments',
  showLabel = true,
  onDark = false,
  className = '',
}: ProgressTrackProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i);
  const inactiveColor = onDark ? 'rgba(255,255,255,0.15)' : 'var(--color-surface-container-high)';
  const labelColor = onDark ? 'text-white/80' : 'text-primary';

  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-2 ${className}`} role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
        {steps.map((step) => (
          <motion.div
            key={step}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${step === currentStep ? 'scale-125' : ''}
            `}
            style={{ backgroundColor: step <= currentStep ? 'var(--color-primary)' : inactiveColor }}
            animate={{ scale: step === currentStep ? 1.25 : 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        ))}
        {showLabel && labels && (
          <span className={`font-label-caps text-label-caps ${onDark ? 'text-white/60' : 'text-secondary'} ml-2`}>
            {labels[currentStep] || `Paso ${currentStep + 1} de ${totalSteps}`}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-unit ${className}`} role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
      {steps.map((step) => (
        <motion.div
          key={step}
          className="progress-segment"
          animate={{
            backgroundColor: step <= currentStep ? 'var(--color-primary)' : inactiveColor,
            width: step === currentStep ? '2.5rem' : '2rem',
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      ))}
      {showLabel && labels && (
        <span className={`font-label-caps text-label-caps ${labelColor} ml-sm`}>
          {labels[currentStep] || `Paso ${currentStep + 1} de ${totalSteps}`}
        </span>
      )}
    </div>
  );
};

// Sub-component for step indicator with icon (for header)
export interface StepIndicatorProps {
  /** Step number (1-indexed for display) */
  step: number;
  /** Total steps */
  total: number;
  /** Current active step (1-indexed) */
  current: number;
  /** Optional icon */
  icon?: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Whether completed */
  completed?: boolean;
}

export const StepIndicator = ({ step, total, current, icon, onClick, completed = false }: StepIndicatorProps) => {
  const isActive = step === current;
  const isPast = step < current;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`
        flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200
        ${isActive ? 'text-primary' : isPast ? 'text-primary/70' : 'text-ink-muted'}
        ${onClick ? 'hover:bg-accent-soft cursor-pointer' : ''}
      `}
      aria-current={isActive ? 'step' : undefined}
      aria-label={`Paso ${step} de ${total}`}
    >
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
        ${isActive ? 'bg-primary text-on-primary shadow-lg shadow-primary/25' : isPast ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-ink-muted'}
      `}>
        {completed && !isActive ? (
          <span className="material-symbols-outlined text-[18px]">check</span>
        ) : icon ? (
          icon
        ) : (
          <span className="font-label-caps text-label-caps">{step}</span>
        )}
      </div>
      <span className="font-label-caps text-label-caps hidden sm:block">
        {isPast ? 'Completado' : isActive ? 'Actual' : 'Pendiente'}
      </span>
    </button>
  );
};

ProgressTrack.displayName = 'ProgressTrack';
StepIndicator.displayName = 'StepIndicator';