import type { ReactNode } from 'react';
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
  /** Running Año 1 total to show, omit to hide the totals block entirely */
  totalUsd?: number;
  /** Recurring annual cost (shown as "+$X/año"), omit to hide just this half */
  recurUsd?: number;
  /** Replaces the Continue button with custom actions (e.g. Confirmar/Descargar/Consulta on the final step). Back stays. */
  actionsOverride?: ReactNode;
  /** Custom class name */
  className?: string;
}

/**
 * WizardFooter - Bottom strip of the fused Shell card.
 *
 * Based on the AlysTech Precision stitch reference:
 * - Light gray background (surface-container-low), border-t border-slate
 * - "Inversión Año 1" (one-time, no /año) + divider + "Costo Anual Recurrente" (/año)
 * - Back/Continue on the right
 * - Minimum 44px touch targets
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
  recurUsd,
  actionsOverride,
  className = '',
}: WizardFooterProps) {
  return (
    <nav className={`w-full bg-surface-container-low border-t border-border-slate shrink-0 ${className}`}>
      <div className="px-margin-mobile md:px-margin-desktop py-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Totals */}
        {totalUsd !== undefined ? (
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
            <div className="flex flex-col items-start">
              <span className="font-label-caps text-[10px] text-ink-muted uppercase tracking-widest font-bold">
                Inversión Año 1
              </span>
              <span className="font-headline-md text-2xl text-ink-navy font-extrabold leading-tight">
                {formatUsd(totalUsd)}
              </span>
            </div>
            {recurUsd !== undefined && recurUsd > 0 && (
              <>
                <div className="w-px h-10 bg-border-slate hidden sm:block" />
                <div className="flex flex-col items-start">
                  <span className="font-label-caps text-[10px] text-ink-muted uppercase tracking-widest font-bold">
                    Costo Anual Recurrente
                  </span>
                  <span className="font-body-medium text-lg text-primary font-bold leading-tight">
                    {formatUsd(recurUsd)}/año
                  </span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="hidden sm:block" />
        )}

        {/* Right: Back / Continue (or custom actions on the final step) */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap justify-end">
          <button
            type="button"
            onClick={onBack}
            disabled={backDisabled}
            className="flex-1 md:flex-none flex items-center justify-center text-ink-secondary bg-white hover:bg-surface-container-high disabled:opacity-40 disabled:pointer-events-none border border-border-slate rounded-xl px-lg py-2.5 font-body-medium font-bold transition-all min-h-[44px]"
          >
            <span className="material-symbols-outlined mr-2 text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>
              arrow_back
            </span>
            {backText}
          </button>
          {actionsOverride ?? (
            <button
              type="button"
              onClick={onContinue}
              disabled={continueDisabled || continueLoading}
              className="flex-1 md:flex-none flex items-center justify-center bg-primary text-on-primary rounded-xl px-lg py-2.5 font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100 transition-all font-body-medium min-h-[44px]"
            >
              {continueLoading ? 'Generando…' : continueText}
              <span className="material-symbols-outlined ml-2 text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                arrow_forward
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default WizardFooter;
