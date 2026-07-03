import { motion } from 'framer-motion';
import type { OptionGroupContent } from '../../types/proposal';
import { GlassPanel } from '@/components/ui/GlassPanel';

interface DiagnosticStepProps {
  content: OptionGroupContent;
}

export function DiagnosticStep({ content }: DiagnosticStepProps) {
  return (
    <div className="w-full flex flex-col gap-6 py-4">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center md:text-left"
      >
        <span className="inline-block px-3 py-1 bg-tertiary-container/20 text-tertiary rounded-full font-label-caps text-label-caps mb-4">
          {content.groupTitle}
        </span>
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">
          {content.title}
        </h1>
        <p className="font-body-base text-body-base text-secondary max-w-2xl mx-auto md:mx-0">
          {content.intro || 'Selecciona el nivel de control y seguridad para tu infraestructura. Cada nivel ofrece diferentes capacidades de administración y protección.'}
        </p>
      </motion.div>

      {/* Risk + Impact Cards — Side by side on desktop */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Risk Card */}
        <GlassPanel variant="light" className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-danger/10 flex items-center justify-center text-danger flex-shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-label-caps text-label-caps text-danger mb-2">Riesgo Identificado</h3>
              <p className="font-body-base text-body-base text-ink-secondary leading-relaxed">
                {content.risk}
              </p>
            </div>
          </div>
        </GlassPanel>

        {/* Impact Card */}
        {content.impact && (
          <GlassPanel variant="light" className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center text-warning flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-label-caps text-label-caps text-warning mb-2">Impacto Operacional</h3>
                <p className="font-body-base text-body-base text-ink-secondary leading-relaxed">
                  {content.impact}
                </p>
              </div>
            </div>
          </GlassPanel>
        )}

        {/* Guarantee Card (if present, spans full width on mobile, 2-col on desktop) */}
        {content.guarantee && (
          <GlassPanel variant="light" className="p-6 md:col-span-2">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-positive/10 flex items-center justify-center text-positive flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-label-caps text-label-caps text-positive mb-2">{content.guarantee.title}</h3>
                <p className="font-body-base text-body-base text-ink-secondary leading-relaxed">
                  {content.guarantee.text}
                </p>
              </div>
            </div>
          </GlassPanel>
        )}

        {/* Engineering Note Card (if present) */}
        {content.engineeringNote && (
          <GlassPanel variant="light" className="p-6 md:col-span-2 bg-amber-soft/50 border-amber/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber/10 flex items-center justify-center text-amber flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-label-caps text-label-caps text-amber mb-2">{content.engineeringNote.title}</h3>
                <p className="font-body-base text-body-base text-ink-secondary leading-relaxed">
                  {content.engineeringNote.text}
                </p>
              </div>
            </div>
          </GlassPanel>
        )}
      </motion.div>
    </div>
  );
}
