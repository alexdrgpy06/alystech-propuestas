import { motion } from 'framer-motion';
import type { OptionGroupContent } from '../../types/proposal';

interface DiagnosticStepProps {
  content: OptionGroupContent;
}

export function DiagnosticStep({ content }: DiagnosticStepProps) {
  return (
    <div className="w-full md:h-full md:flex md:flex-col md:justify-center py-2">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-card-border bg-card p-6 sm:p-10 flex flex-col justify-between shadow-sm md:flex-1 space-y-6 lg:space-y-8"
      >
        {/* Header */}
        <div className="space-y-4">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-accent">
              {content.groupTitle}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy mt-1.5 leading-tight">{content.title}</h2>
          </div>
          <hr className="border-card-border" />
        </div>

        {/* Diagnostic body - 2 columns on desktop to maximize width utilization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 flex-1 items-center">
          <div className="space-y-3 h-full flex flex-col justify-center">
            <span className="font-extrabold text-navy block text-xs sm:text-sm lg:text-base uppercase tracking-wider">
              🚨 Riesgo Identificado:
            </span>
            <p className="bg-card-hover p-5 sm:p-6 rounded-xl border border-card-border/80 text-md sm:text-base lg:text-lg leading-relaxed text-ink-secondary flex-1 flex items-center shadow-xs">
              {content.risk}
            </p>
          </div>

          {content.impact && (
            <div className="space-y-3 h-full flex flex-col justify-center">
              <span className="font-extrabold text-danger block text-xs sm:text-sm lg:text-base uppercase tracking-wider">
                ⚠️ Impacto Operacional:
              </span>
              <p className="bg-danger-soft/30 p-5 sm:p-6 rounded-xl border border-danger/10 text-md sm:text-base lg:text-lg leading-relaxed text-ink-secondary flex-1 flex items-center shadow-xs">
                {content.impact}
              </p>
            </div>
          )}
        </div>

        {/* Guarantee */}
        {content.guarantee && (
          <div className="rounded-xl bg-positive-soft border border-positive/15 p-5 sm:p-6 flex items-start gap-4 shadow-xs">
            <span className="text-positive text-xl sm:text-2xl shrink-0 mt-0.5">🛡️</span>
            <div>
              <span className="text-xs sm:text-sm font-bold text-positive uppercase tracking-wide block">
                {content.guarantee.title}
              </span>
              <span className="text-md lg:text-sm text-ink-secondary leading-relaxed block mt-1.5">
                {content.guarantee.text}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Engineering Note */}
      {content.engineeringNote && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-2xl bg-amber-soft border border-amber/15 p-6 flex items-start gap-4 shadow-sm mt-4 lg:mt-6"
        >
          <span className="text-amber text-xl shrink-0 mt-0.5">💡</span>
          <div>
            <span className="text-xs sm:text-sm font-bold text-amber uppercase tracking-wide block">
              {content.engineeringNote.title}
            </span>
            <span className="text-xs sm:text-md lg:text-sm text-ink-secondary leading-relaxed block mt-1.5">
              {content.engineeringNote.text}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
