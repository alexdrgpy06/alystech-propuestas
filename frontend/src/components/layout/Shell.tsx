import { useEffect, useRef, type ReactNode } from 'react';
import { WizardHeader } from './WizardHeader';
import { WizardFooter } from './WizardFooter';

export interface ShellProps {
  /** Header component */
  header?: ReactNode;
  /** Main content */
  children: ReactNode;
  /** Current step for progress */
  currentStep?: number;
  /** Total steps */
  totalSteps?: number;
  /** Step labels for progress track */
  stepLabels?: string[];
  /** Back button handler */
  onBack?: () => void;
  /** Continue/Next button handler */
  onContinue?: () => void;
  /** Whether back button is disabled */
  backDisabled?: boolean;
  /** Whether continue button is disabled */
  continueDisabled?: boolean;
  /** Continue button loading state */
  continueLoading?: boolean;
  /** Continue button text */
  continueText?: string;
  /** Running Año 1 total shown in the footer; omit to hide the total block */
  totalUsd?: number;
  /** Recurring annual cost shown in the footer next to the Año 1 total */
  recurUsd?: number;
  /** Replaces the footer's Continue button with custom actions (e.g. on the final step) */
  footerActions?: ReactNode;
}

/**
 * Shell - Main layout wrapper for the wizard
 *
 * Based on the AlysTech Precision stitch reference (Downloads/stitch_alystech_responsive_wizard_system (2)),
 * refined per feedback: header and footer are PINNED (fixed height, never scroll away);
 * only the content canvas in between scrolls internally. The card itself never exceeds
 * the viewport height, so there is exactly one scroll region — no page-level scroll,
 * no nested scroll traps.
 * - Dark navy backdrop (#0f172a) behind a single fused card
 * - The card itself: dark header + white content canvas + light-gray footer,
 *   all inside ONE rounded-[2rem] bordered container (no floating disconnected pills)
 * - Edge-to-edge on mobile, floating with margin on desktop
 */
export function Shell({
  header,
  children,
  currentStep = 0,
  totalSteps = 13,
  stepLabels,
  onBack = () => {},
  onContinue = () => {},
  backDisabled = false,
  continueDisabled = false,
  continueLoading = false,
  continueText = 'Continuar',
  totalUsd,
  recurUsd,
  footerActions,
}: ShellProps) {
  const mainRef = useRef<HTMLElement>(null);

  // The content canvas is its own scroll region (header/footer are pinned outside
  // it), so the browser's own "scroll to top on navigation" never kicks in here —
  // without this, moving to a new step keeps whatever scroll position the
  // previous, possibly longer, step was left at.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentStep]);

  return (
    <div className="relative h-dvh bg-surface-dark overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" aria-hidden="true" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-orb rounded-full blur-[100px] pointer-events-none z-0" aria-hidden="true" />

      {/* Fused Card: header + canvas + footer as one bordered container, pinned to the viewport */}
      <div className="relative z-10 mx-auto w-full max-w-5xl h-dvh md:h-[calc(100dvh-4rem)] md:my-8 bg-white md:rounded-[2rem] md:border md:border-border-slate md:shadow-xl overflow-hidden flex flex-col">
        <WizardHeader
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepLabels={stepLabels}
        />

        {/* Only this region scrolls — header/footer stay pinned */}
        <main ref={mainRef} className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center w-full px-margin-mobile md:px-margin-desktop py-lg md:py-10">
          <div className="w-full max-w-max-width-content">
            {header}
            <div className="flex-1 w-full">
              {children}
            </div>
          </div>
        </main>

        <WizardFooter
          onBack={onBack}
          onContinue={onContinue}
          backDisabled={backDisabled}
          continueDisabled={continueDisabled}
          continueLoading={continueLoading}
          continueText={continueText}
          totalUsd={totalUsd}
          recurUsd={recurUsd}
          actionsOverride={footerActions}
        />
      </div>
    </div>
  );
}

export default Shell;
