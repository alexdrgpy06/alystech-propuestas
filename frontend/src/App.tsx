import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { proposalContent } from './data';
import { useProposalSelections } from './hooks/useProposalSelections';
import { buildSelectionSummaries, totalsPayload, submitDecision, submitConsulta, downloadPdf } from './lib/api';
import type { GroupId } from './types/proposal';

import { Wizard } from './components/wizard/Wizard';
import { DecisionModal } from './components/layout/DecisionModal';
import { ConsultaModal } from './components/layout/ConsultaModal';
import { Shell } from './components/layout';

const STEP_LABELS: Record<number, string> = {
  0: 'Bienvenida',
  1: 'Diagnóstico MDM',
  2: 'Opciones MDM',
  3: 'Diagnóstico Servidores',
  4: 'Opciones Servidores',
  5: 'Diagnóstico Red',
  6: 'Opciones Red',
  7: 'Diagnóstico Auditoría',
  8: 'Opciones Auditoría',
  9: 'Diagnóstico Soporte',
  10: 'Opciones Soporte',
  11: 'Comparativa TCO',
  12: 'Resumen Ejecutivo',
};

const TOTAL_STEPS = 13;

function App() {
  const { selections, selectOption, addonSelections, toggleAddon, totals } = useProposalSelections(
    proposalContent.groups,
    proposalContent.deviceCount,
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [skipWarning, setSkipWarning] = useState<string | null>(null);
  const [touched, setTouched] = useState<Set<GroupId>>(new Set());

  const MODULE_STEPS: Record<number, GroupId> = { 2: 'mdm', 4: 'srv', 6: 'net', 8: 'aud', 10: 'sup' };

  const handleSelectOption = useCallback(
    (group: GroupId, optionId: string) => {
      selectOption(group, optionId);
      setTouched((prev) => new Set(prev).add(group));
      setSkipWarning(null);
    },
    [selectOption],
  );

  const handleNext = () => {
    const moduleGroup = MODULE_STEPS[currentStep];
    if (moduleGroup && !touched.has(moduleGroup)) {
      const groupContent = proposalContent.groups.find((g) => g.id === moduleGroup);
      setSkipWarning(
        `No ha seleccionado una opción para ${groupContent?.title || 'este módulo'}. Puede regresar en cualquier momento.`,
      );
    } else {
      setSkipWarning(null);
    }
    setCurrentStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  };

  const handlePrev = () => {
    setSkipWarning(null);
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const [decisionType, setDecisionType] = useState<'accept' | 'reject' | null>(null);
  const [consultaOpen, setConsultaOpen] = useState(false);
  const [pdfPending, setPdfPending] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setPdfPending(true);
      await downloadPdf({
        proposalId: proposalContent.proposalId,
        selections: buildSelectionSummaries(proposalContent.groups, selections, addonSelections),
        totals: totalsPayload(totals),
      });
    } catch (e) {
      console.error(e);
      alert('Error al generar PDF. Por favor, intente nuevamente.');
    } finally {
      setPdfPending(false);
    }
  };

  const handleSubmitDecision = async (values: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    comments?: string;
  }) => {
    if (!decisionType) return;
    await submitDecision({
      proposalId: proposalContent.proposalId,
      decision: decisionType,
      clientName: values.clientName,
      clientEmail: values.clientEmail,
      clientPhone: values.clientPhone,
      comments: values.comments,
      selections: buildSelectionSummaries(proposalContent.groups, selections, addonSelections),
      totals: totalsPayload(totals),
    });
  };

  const handleSubmitConsulta = async (data: { name: string; email: string; phone?: string; message: string }) => {
    await submitConsulta({
      proposalId: proposalContent.proposalId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    });
  };

  const isCanvasStep = currentStep === 12;
  const isWelcomeStep = currentStep === 0;

  return (
    <div className="min-h-screen bg-surface-dark font-sans antialiased selection:bg-accent/20 selection:text-accent">
      <Shell
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        stepLabels={Object.values(STEP_LABELS)}
        showHelp={true}
        onHelp={() => { /* Help action */ }}
        onBack={handlePrev}
        onContinue={handleNext}
        backDisabled={isWelcomeStep}
        continueDisabled={isWelcomeStep ? false : !touched.has(MODULE_STEPS[currentStep]) && MODULE_STEPS[currentStep] !== undefined}
        continueLoading={pdfPending}
        continueText={isWelcomeStep ? 'Empezar' : isCanvasStep ? 'Confirmar' : 'Continuar'}
        totalUsd={isWelcomeStep || isCanvasStep ? undefined : totals.totalUsd}
      >
        {/* Skip warning - shown inside the shell content */}
        <AnimatePresence>
          {skipWarning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-center gap-2 text-sm text-warning shrink-0"
              role="alert"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              <span className="font-body-base text-body-base">{skipWarning}</span>
              <button
                onClick={() => setSkipWarning(null)}
                aria-label="Cerrar aviso"
                className="ml-auto shrink-0 p-1 -m-1 text-warning/60 hover:text-warning rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Wizard
          currentStep={currentStep}
          onStart={() => setCurrentStep(1)}
          proposalContent={proposalContent}
          selections={selections}
          addonSelections={addonSelections}
          onToggleAddon={toggleAddon}
          totals={totals}
          onSelectOption={handleSelectOption}
          onAccept={() => setDecisionType('accept')}
          onReject={() => setDecisionType('reject')}
          onConsulta={() => setConsultaOpen(true)}
          onDownloadPdf={handleDownloadPdf}
          pdfPending={pdfPending}
        />

        {/* ── Modals ── */}
        <DecisionModal
          kind={decisionType}
          summaryText={totalsPayload(totals).total}
          onClose={() => setDecisionType(null)}
          content={proposalContent.modals.decision}
          onSubmit={handleSubmitDecision}
        />
        <ConsultaModal
          open={consultaOpen}
          onClose={() => setConsultaOpen(false)}
          content={proposalContent.modals.consulta}
          onSubmit={handleSubmitConsulta}
        />
      </Shell>
    </div>
  );
}

export default App;
