import { AnimatePresence, motion } from 'framer-motion';
import type { AddonSelections, ProposalContent, GroupId, Totals } from '@/types/proposal';
import { IntroStep } from './IntroStep';
import { DiagnosticStep } from './DiagnosticStep';
import { OptionsStep } from './OptionsStep';
import { TcoComparisonStep } from './TcoComparisonStep';
import { CanvasStep } from '../canvas/CanvasStep';

interface WizardProps {
  currentStep: number;
  onStart: () => void;
  proposalContent: ProposalContent;
  selections: Record<GroupId, string>;
  addonSelections: AddonSelections;
  onToggleAddon: (group: GroupId, addonId: string) => void;
  totals: Totals;
  onSelectOption: (group: GroupId, optionId: string) => void;
  onAccept: () => void;
  onReject: () => void;
  onConsulta: () => void;
  onDownloadPdf: () => void;
  pdfPending?: boolean;
}

export function Wizard({
  currentStep,
  onStart,
  proposalContent,
  selections,
  addonSelections,
  onToggleAddon,
  totals,
  onSelectOption,
  onAccept,
  onReject,
  onConsulta,
  onDownloadPdf,
  pdfPending,
}: WizardProps) {
  const getGroup = (id: GroupId) => proposalContent.groups.find((g) => g.id === id);

  return (
    <div className="w-full flex-1 flex flex-col justify-stretch min-h-0 h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full flex-1 flex flex-col justify-stretch min-h-0 h-full"
        >
          {/* Step 0: Welcome */}
          {currentStep === 0 && <IntroStep onStart={onStart} />}

          {/* Step 1 & 2: MDM */}
          {currentStep === 1 && getGroup('mdm') && (
            <DiagnosticStep content={getGroup('mdm')!} />
          )}
          {currentStep === 2 && getGroup('mdm') && (
            <OptionsStep
              content={getGroup('mdm')!}
              selectedOptionId={selections.mdm}
              onSelectOption={(optId) => onSelectOption('mdm', optId)}
              selectedAddonIds={addonSelections.mdm}
              onToggleAddon={(addonId) => onToggleAddon('mdm', addonId)}
            />
          )}

          {/* Step 3 & 4: Servidor */}
          {currentStep === 3 && getGroup('srv') && (
            <DiagnosticStep content={getGroup('srv')!} />
          )}
          {currentStep === 4 && getGroup('srv') && (
            <OptionsStep
              content={getGroup('srv')!}
              selectedOptionId={selections.srv}
              onSelectOption={(optId) => onSelectOption('srv', optId)}
              selectedAddonIds={addonSelections.srv}
              onToggleAddon={(addonId) => onToggleAddon('srv', addonId)}
            />
          )}

          {/* Step 5 & 6: Red */}
          {currentStep === 5 && getGroup('net') && (
            <DiagnosticStep content={getGroup('net')!} />
          )}
          {currentStep === 6 && getGroup('net') && (
            <OptionsStep
              content={getGroup('net')!}
              selectedOptionId={selections.net}
              onSelectOption={(optId) => onSelectOption('net', optId)}
              selectedAddonIds={addonSelections.net}
              onToggleAddon={(addonId) => onToggleAddon('net', addonId)}
            />
          )}

          {/* Step 7 & 8: Auditoría */}
          {currentStep === 7 && getGroup('aud') && (
            <DiagnosticStep content={getGroup('aud')!} />
          )}
          {currentStep === 8 && getGroup('aud') && (
            <OptionsStep
              content={getGroup('aud')!}
              selectedOptionId={selections.aud}
              onSelectOption={(optId) => onSelectOption('aud', optId)}
              selectedAddonIds={addonSelections.aud}
              onToggleAddon={(addonId) => onToggleAddon('aud', addonId)}
            />
          )}

          {/* Step 9 & 10: Soporte */}
          {currentStep === 9 && getGroup('sup') && (
            <DiagnosticStep content={getGroup('sup')!} />
          )}
          {currentStep === 10 && getGroup('sup') && (
            <OptionsStep
              content={getGroup('sup')!}
              selectedOptionId={selections.sup}
              onSelectOption={(optId) => onSelectOption('sup', optId)}
              selectedAddonIds={addonSelections.sup}
              onToggleAddon={(addonId) => onToggleAddon('sup', addonId)}
            />
          )}

          {/* Step 11: TCO Comparison */}
          {currentStep === 11 && (
            <TcoComparisonStep
              content={proposalContent.tco}
              totals={totals}
              groups={proposalContent.groups}
            />
          )}

          {/* Step 12: Canvas Summary */}
          {currentStep === 12 && (
            <CanvasStep
              content={proposalContent.canvas}
              groups={proposalContent.groups}
              selections={selections}
              addonSelections={addonSelections}
              totals={totals}
              exchangeRate={proposalContent.exchangeRate}
              onConsulta={onConsulta}
              onDownloadPdf={onDownloadPdf}
              onReject={onReject}
              onAccept={onAccept}
              pdfPending={pdfPending}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
