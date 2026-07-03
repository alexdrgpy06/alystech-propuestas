import type { ReactNode } from 'react';
import { ProgressTrack } from '@/components/ui/ProgressTrack';

export interface WizardHeaderProps {
  /** Current step (0-indexed) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Step labels */
  stepLabels?: string[];
  /** Custom logo/brand */
  logo?: ReactNode;
  /** Custom class name */
  className?: string;
}

/**
 * WizardHeader - Dark strip at the top of the fused Shell card.
 *
 * Based on the AlysTech Precision stitch reference:
 * - Dark navy background (#0f172a), border-b border-white/10
 * - Logo on a badge, "AlysTech" wordmark + "Propuesta Técnica" eyebrow
 * - Progress track centered (hidden on mobile)
 * - "Paso X/13" badge on the right (no help icon)
 */
export function WizardHeader({
  currentStep,
  totalSteps,
  stepLabels = [],
  logo,
  className = '',
}: WizardHeaderProps) {
  const defaultLabels = Array.from({ length: totalSteps }, (_, i) =>
    stepLabels[i] || `Paso ${i + 1}`
  );

  return (
    <header className={`w-full bg-surface-dark border-b border-white/10 shrink-0 ${className}`}>
      <div className="flex justify-between items-center gap-4 h-20 md:h-24 px-margin-mobile md:px-margin-desktop">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {logo || (
            <>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={`${import.meta.env.BASE_URL}logo.png`}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-headline-md text-headline-md md:text-[28px] font-extrabold text-white leading-none">
                  AlysTech
                </h1>
                <p className="font-label-caps text-[10px] text-white/50 uppercase tracking-widest font-bold mt-1">
                  Propuesta Técnica
                </p>
              </div>
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
            onDark
          />
        </div>

        {/* Right: Step badge */}
        <div className="flex items-center gap-md flex-shrink-0">
          <div className="bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-lg">
            <span className="font-body-medium text-body-medium text-primary font-bold whitespace-nowrap">
              Paso {currentStep + 1}/{totalSteps}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default WizardHeader;
