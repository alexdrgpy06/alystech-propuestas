import type { ReactNode } from 'react';
import { ProgressTrack } from '@/components/ui/ProgressTrack';
import { GhostButton } from '@/components/ui/ActionButton';

export interface WizardHeaderProps {
  /** Current step (0-indexed) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Step labels */
  stepLabels?: string[];
  /** Show help button */
  showHelp?: boolean;
  /** Help button click handler */
  onHelp?: () => void;
  /** Custom logo/brand */
  logo?: ReactNode;
  /** Custom class name */
  className?: string;
}

/**
 * WizardHeader - Fixed header with logo, progress track, and help button
 * 
 * Based on DESIGN.md:
 * - Fixed position at top
 * - Logo on left
 * - Progress track (segments) in center
 * - Help button on right
 * - Glassmorphism backdrop (surface/80 + backdrop-blur)
 * - Border bottom with border-slate
 */
export function WizardHeader({
  currentStep,
  totalSteps,
  stepLabels = [],
  showHelp = true,
  onHelp,
  logo,
  className = '',
}: WizardHeaderProps) {
  const defaultLabels = Array.from({ length: totalSteps }, (_, i) =>
    stepLabels[i] || `Paso ${i + 1}`
  );

  return (
    <header className={`
      fixed top-4 left-4 right-4 z-50
      flex justify-between items-center
      px-lg py-sm
      max-w-max-width-content mx-auto
      bg-surface/90 backdrop-blur-md
      border border-border-slate
      shadow-lg
      rounded-2xl
      ${className}
    `}>
      {/* Logo/Brand */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {logo || (
          <>
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt=""
              aria-hidden="true"
              className="h-9 w-14 object-cover object-top"
            />
            <span className="font-headline-md text-headline-md font-extrabold tracking-tight text-primary">
              AlysTech
            </span>
          </>
        )}
      </div>

      {/* Center: Progress Track */}
      <div className="hidden md:flex items-center gap-md flex-1 justify-center">
        <ProgressTrack
          currentStep={currentStep}
          totalSteps={totalSteps}
          labels={defaultLabels}
          variant="segments"
          showLabel={true}
        />
      </div>

      {/* Right: Help Button */}
      <div className="flex items-center gap-md flex-shrink-0">
        {showHelp && (
          <GhostButton
            onClick={onHelp}
            size="sm"
            aria-label="Ayuda"
            className="p-sm text-primary hover:bg-accent-soft rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>
              help_outline
            </span>
          </GhostButton>
        )}
      </div>
    </header>
  );
}

export default WizardHeader;