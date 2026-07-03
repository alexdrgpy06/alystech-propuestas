import { motion } from 'framer-motion';
import type { OptionGroupContent } from '../../types/proposal';

interface DiagnosticStepProps {
  content: OptionGroupContent;
}

export function DiagnosticStep({ content }: DiagnosticStepProps) {
  return (
    <div className="w-full flex flex-col gap-4 py-2">

      {/* Main card — not stretched, wraps its own content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-card-border bg-card shadow-sm overflow-hidden"
      >
        {/* Header bar */}
        <div className="px-6 pt-6 pb-4 border-b border-card-border">
          <span className="text-2xs font-bold uppercase tracking-[0.18em] text-accent">
            {content.groupTitle}
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-navy mt-1 leading-tight text-balance">
            {content.title}
          </h2>
        </div>

        {/* Risk + Impact — side by side on md+, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-card-border">
          {/* Risk */}
          <div className="px-6 py-5 space-y-2.5">
            <div className="flex items-center gap-2">
              {/* SVG icon: warning-triangle */}
              <span className="w-6 h-6 rounded-md bg-danger-soft border border-danger/15 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </span>
              <span className="text-2xs font-extrabold uppercase tracking-wider text-danger">
                Riesgo Identificado
              </span>
            </div>
            <p className="text-sm text-ink-secondary leading-relaxed pl-8">
              {content.risk}
            </p>
          </div>

          {/* Impact */}
          {content.impact && (
            <div className="px-6 py-5 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-soft border border-amber/15 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <span className="text-2xs font-extrabold uppercase tracking-wider text-amber">
                  Impacto Operacional
                </span>
              </div>
              <p className="text-sm text-ink-secondary leading-relaxed pl-8">
                {content.impact}
              </p>
            </div>
          )}
        </div>

        {/* Guarantee */}
        {content.guarantee && (
          <div className="border-t border-card-border px-6 py-4 flex items-start gap-3 bg-positive-soft/40">
            <span className="w-6 h-6 rounded-md bg-positive-soft border border-positive/15 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-positive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <div>
              <span className="text-2xs font-bold uppercase tracking-wider text-positive block">
                {content.guarantee.title}
              </span>
              <p className="text-sm text-ink-secondary leading-relaxed mt-1">
                {content.guarantee.text}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Engineering note — separate card below, compact */}
      {content.engineeringNote && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="rounded-xl border border-amber/20 bg-amber-soft/40 px-5 py-4 flex items-start gap-3"
        >
          <span className="w-6 h-6 rounded-md bg-amber-soft border border-amber/20 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-3.5 h-3.5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </span>
          <div>
            <span className="text-2xs font-bold uppercase tracking-wider text-amber block">
              {content.engineeringNote.title}
            </span>
            <p className="text-sm text-ink-secondary leading-relaxed mt-1">
              {content.engineeringNote.text}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
