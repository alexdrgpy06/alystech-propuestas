import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { proposalContent } from './data';
import { useProposalSelections } from './hooks/useProposalSelections';
import { buildSelectionSummaries, totalsPayload, submitDecision, submitConsulta, downloadPdf } from './lib/api';
import { formatUsd } from './lib/currency';
import type { GroupId } from './types/proposal';

import { Wizard } from './components/wizard/Wizard';
import { DecisionModal } from './components/layout/DecisionModal';
import { ConsultaModal } from './components/layout/ConsultaModal';

const STEP_LABELS: Record<number, string> = {
  0: 'Bienvenida',
  1: 'Bloque A · Diagnóstico de Gestión Móvil',
  2: 'Bloque A · Alternativas de Gestión Móvil',
  3: 'Bloque B.1 · Diagnóstico de Infraestructura Central',
  4: 'Bloque B.1 · Alternativas de Infraestructura Central',
  5: 'Bloque B.2 · Diagnóstico de Seguridad Perimetral',
  6: 'Bloque B.2 · Alternativas de Seguridad Perimetral',
  7: 'Bloque C · Diagnóstico de Seguridad Informática',
  8: 'Bloque C · Alternativas de Seguridad Informática',
  9: 'Bloque D · Diagnóstico de Soporte Técnico',
  10: 'Bloque D · Alternativas de Soporte Técnico',
  11: 'Comparativa de Inversión (TCO)',
  12: 'Resumen Ejecutivo',
};

const TOTAL_STEPS = 13;
const CANVAS_STEP = 12;

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
        selections: buildSelectionSummaries(proposalContent.groups, selections),
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
      selections: buildSelectionSummaries(proposalContent.groups, selections),
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

  const hasTouchedAny = touched.size > 0;
  const totalDisplay = hasTouchedAny ? formatUsd(totals.totalUsd) : '$0';
  const recurDisplay = hasTouchedAny ? formatUsd(totals.recurUsd) : '$0';
  const isCanvasStep = currentStep === CANVAS_STEP;

  return (
    <div className="min-h-screen bg-surface font-sans antialiased flex items-center justify-center px-3 py-3 sm:px-4 sm:py-4 selection:bg-accent/20 selection:text-accent">
      {/* ── App Shell ── */}
      <div className="w-full max-w-[1440px] flex flex-col shadow-2xl md:h-[calc(100dvh-2rem)] overflow-hidden rounded-2xl">

        {/* ── HEADER ── */}
        <header className="bg-navy rounded-t-2xl border border-surface-border border-b-0 px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* Logo with dark bg + colored border */}
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-black/40 border border-accent/40 flex items-center justify-center shrink-0 overflow-hidden shadow-lg shadow-accent/10">
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="Alystech"
                className="h-8 sm:h-9 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const el = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (el) el.style.display = 'flex';
                }}
              />
              <span
                style={{ display: 'none' }}
                className="text-base font-black text-accent items-center justify-center w-full h-full"
              >
                AT
              </span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-ink-on-dark leading-tight tracking-tight">
                Alystech · Propuesta Técnica
              </h1>
              <p className="text-2xs text-ink-on-dark-secondary mt-0.5 leading-none">
                {STEP_LABELS[currentStep]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress dots */}
            <div className="hidden sm:flex gap-1 items-center">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? 'w-5 bg-accent'
                      : i < currentStep
                        ? 'w-1.5 bg-accent/50'
                        : 'w-1.5 bg-white/15'
                  }`}
                />
              ))}
            </div>
            <span
              aria-label={`Paso ${currentStep + 1} de ${TOTAL_STEPS}`}
              className="text-2xs font-semibold text-ink-on-dark-secondary bg-white/8 px-2.5 py-1 rounded-full"
            >
              {currentStep + 1}/{TOTAL_STEPS}
            </span>
          </div>
        </header>

        {/* ── CONTENT AREA ── */}
        <main className="flex-1 bg-card border-x border-card-border overflow-hidden flex flex-col min-h-0">
          {/* Skip warning */}
          <AnimatePresence>
            {skipWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-amber-soft border-b border-amber/20 px-6 py-3 flex items-center gap-2 text-sm text-amber shrink-0"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm">{skipWarning}</span>
                <button
                  onClick={() => setSkipWarning(null)}
                  aria-label="Cerrar aviso"
                  className="ml-auto shrink-0 p-2 -m-2 text-amber/60 hover:text-amber"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-5 sm:p-8 w-full mx-auto flex-1 overflow-y-auto min-h-0 flex flex-col">
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
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer className="bg-surface-alt rounded-b-2xl border border-surface-border border-t-0 px-5 sm:px-6 py-3.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Totals — left side */}
            <div className="flex items-center gap-5 text-ink-on-dark">
              <div>
                <span className="block text-3xs font-bold uppercase tracking-widest text-ink-on-dark-secondary">
                  Inversión Año 1
                </span>
                <motion.span
                  key={totalDisplay}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="block text-lg font-extrabold leading-tight"
                >
                  {totalDisplay}
                </motion.span>
              </div>
              {hasTouchedAny && totals.recurUsd > 0 && (
                <div className="border-l border-white/10 pl-5">
                  <span className="block text-3xs font-bold uppercase tracking-widest text-ink-on-dark-secondary">
                    Recurrente Anual
                  </span>
                  <span className="block text-base font-bold leading-tight">
                    {recurDisplay}
                    <span className="text-2xs font-normal text-ink-on-dark-secondary">/año</span>
                  </span>
                </div>
              )}
            </div>

            {/* Navigation — right side */}
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-end">
              {/* Back always visible (unless step 0) */}
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="min-h-10 px-4 py-2 rounded-xl text-sm font-bold bg-white/5 text-ink-on-dark hover:bg-white/10 border border-white/10 transition-colors"
                >
                  ← Atrás
                </button>
              )}

              {/* Canvas step: Consulta + PDF + Rechazar + Aceptar */}
              {isCanvasStep ? (
                <>
                  <button
                    onClick={() => setConsultaOpen(true)}
                    className="min-h-10 px-4 py-2 rounded-xl text-sm font-bold bg-white/5 text-ink-on-dark hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    Consultar
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    disabled={pdfPending}
                    className="min-h-10 px-4 py-2 rounded-xl text-sm font-bold bg-white/8 text-ink-on-dark hover:bg-white/15 border border-white/10 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 7.414V19a2 2 0 01-2 2z" />
                    </svg>
                    {pdfPending ? 'Generando…' : 'PDF'}
                  </button>
                  <button
                    onClick={() => setDecisionType('reject')}
                    className="min-h-10 px-4 py-2 rounded-xl text-sm font-bold bg-danger-soft/20 text-danger border border-danger/30 hover:bg-danger-soft/30 transition-colors"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => setDecisionType('accept')}
                    className="min-h-10 px-5 py-2 rounded-xl text-sm font-bold bg-positive text-white hover:bg-positive-hover shadow-lg shadow-positive/25 transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Aceptar propuesta
                  </button>
                </>
              ) : (
                /* Normal steps: Next */
                <button
                  onClick={handleNext}
                  disabled={currentStep === TOTAL_STEPS - 1}
                  className={`min-h-10 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${
                    currentStep === TOTAL_STEPS - 1
                      ? 'bg-white/5 text-ink-on-dark-secondary cursor-not-allowed'
                      : 'bg-accent text-white hover:bg-accent-hover shadow-accent/30'
                  }`}
                >
                  Siguiente →
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>

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
    </div>
  );
}

export default App;
