import type { ReactNode } from 'react';
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
  /** Show help button in header */
  showHelp?: boolean;
  /** Help button handler */
  onHelp?: () => void;
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
}

/**
 * Shell - Main layout wrapper for the wizard
 * 
 * Based on DESIGN.md:
 * - 1440px max-width shell (max-w-[1440px])
 * - 1024px content track (max-w-max-width-content ≈ 1024px)
 * - Dark navy shell backdrop (#0f172a)
 * - Glass panel canvas (white/95 + backdrop-blur)
 * - Fixed header and footer
 * - Grid pattern background with gradient orb
 */
export function Shell({
  header,
  children,
  currentStep = 0,
  totalSteps = 13,
  stepLabels,
  showHelp = true,
  onHelp,
  onBack = () => {},
  onContinue = () => {},
  backDisabled = false,
  continueDisabled = false,
  continueLoading = false,
  continueText = 'Continuar',
  totalUsd,
}: ShellProps) {
  return (
    <div className="relative min-h-screen bg-surface-dark overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" aria-hidden="true" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-orb rounded-full blur-[100px] pointer-events-none z-0" aria-hidden="true" />

      {/* Main Shell Container */}
      <div className="max-w-[1440px] mx-auto relative min-h-screen">
        {/* Wizard Header — floating pill, fixed on all breakpoints */}
        <WizardHeader
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepLabels={stepLabels}
          showHelp={showHelp}
          onHelp={onHelp}
        />

        {/* Content Canvas */}
        <main className="glass-panel min-h-screen md:min-h-[calc(100vh-140px)] w-full md:rounded-b-2xl shadow-xl flex flex-col items-center pt-24 pb-32 px-margin-mobile md:px-margin-desktop border-b border-x border-border-slate">
          <div className="w-full max-w-max-width-content">
            {header}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </main>

        {/* Wizard Footer — floating dark pill, fixed on all breakpoints */}
        <WizardFooter
          onBack={onBack}
          onContinue={onContinue}
          backDisabled={backDisabled}
          continueDisabled={continueDisabled}
          continueLoading={continueLoading}
          continueText={continueText}
          totalUsd={totalUsd}
        />
      </div>
    </div>
  );
}

export default Shell;