import { formatUsd } from '@/lib/currency';

export interface WizardFooterProps {
  /** Back button click handler */
  onBack: () => void;
  /** Continue/Next button click handler */
  onContinue: () => void;
  /** Disable back button */
  backDisabled?: boolean;
  /** Disable continue button */
  continueDisabled?: boolean;
  /** Continue button loading state */
  continueLoading?: boolean;
  /** Continue button text */
  continueText?: string;
  /** Back button text */
  backText?: string;
  /** Running Año 1 total to show, omit to hide the total block entirely */
  totalUsd?: number;
  /** Label above the total amount */
  totalLabel?: string;
  /** Custom class name */
  className?: string;
}

/**
 * WizardFooter - Fixed bottom nav bar merging the running total with Back/Continue.
 *
 * Based on the AlysTech Precision reference: dark floating pill
 * (bottom-6 left-4 right-4, bg-inverse-surface), total on the left,
 * Back/Continue on the right, stacking to a column on very small screens.
 */
export function WizardFooter({
  onBack,
  onContinue,
  backDisabled = false,
  continueDisabled = false,
  continueLoading = false,
  continueText = 'Continuar',
  backText = 'Atrás',
  totalUsd,
  totalLabel = 'Inversión Año 1',
  className = '',
}: WizardFooterProps) {
  return (
    <nav className={`
      fixed bottom-6 left-4 right-4 z-50
      max-w-max-width-content mx-auto
      bg-inverse-surface border border-white/10
      shadow-xl rounded-2xl
      ${className}
    `}>
      <div className="px-margin-mobile md:px-margin-desktop py-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Left: Running total */}
        {totalUsd !== undefined ? (
          <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
            <span className="font-label-caps text-label-caps text-inverse-on-surface/70 uppercase">{totalLabel}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline-md text-headline-md text-on-secondary leading-tight">{formatUsd(totalUsd)}</span>
              <span className="font-body-medium text-body-medium text-inverse-on-surface/70">/año</span>
            </div>
          </div>
        ) : (
          <div className="hidden sm:block" />
        )}

        {/* Right: Back / Continue */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBack}
            disabled={backDisabled}
            className="flex-1 sm:flex-none flex items-center justify-center text-on-secondary bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none border border-white/10 rounded-xl px-lg py-2.5 font-body-medium font-medium transition-all min-h-[44px]"
          >
            <span className="material-symbols-outlined mr-2 text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>
              arrow_back
            </span>
            {backText}
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={continueDisabled || continueLoading}
            className="flex-1 sm:flex-none flex items-center justify-center bg-primary text-on-primary rounded-xl px-lg py-2.5 font-bold shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100 transition-all font-body-medium min-h-[44px]"
          >
            {continueLoading ? 'Generando…' : continueText}
            <span className="material-symbols-outlined ml-2 text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default WizardFooter;