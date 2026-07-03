import type { ConditionCard } from '@/types/proposal';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConditionsAccordionProps {
  conditions: ConditionCard[];
}

export function ConditionsAccordion({ conditions }: ConditionsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between bg-bg px-5 py-4 text-left transition-colors hover:bg-bg/80"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue/10 text-blue">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </span>
            <span className="text-[14px] font-bold text-navy">Condiciones comerciales</span>
          </div>
          <svg
            viewBox="0 0 24 24"
            className={`h-5 w-5 text-slate transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="grid gap-6 p-5 sm:grid-cols-2">
                {conditions.map((condition, i) => (
                  <div key={i}>
                    <h4 className="mb-1 text-[13px] font-bold text-navy">{condition.title}</h4>
                    <p className="text-[12.5px] leading-relaxed text-slate">{condition.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
