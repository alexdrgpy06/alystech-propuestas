import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassPanel, GlassPanelHeader, GlassPanelBody, GlassPanelFooter } from '../ui/GlassPanel';
import { GhostButton } from '../ui/ActionButton';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-dark/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal — GlassPanel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90dvh] overflow-hidden"
          >
            <GlassPanel variant="modal" className="h-full flex flex-col">
              {/* Header */}
              <GlassPanelHeader className="bg-white/95 border-border-slate">
                <h3 className="font-headline-md text-headline-md text-on-surface leading-snug">{title}</h3>
                <GhostButton
                  onClick={onClose}
                  size="sm"
                  aria-label="Cerrar"
                  className="p-2 -m-1 rounded-full"
                >
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                    close
                  </span>
                </GhostButton>
              </GlassPanelHeader>

              {/* Content (scrollable) */}
              <GlassPanelBody className="overflow-y-auto p-6">{children}</GlassPanelBody>

              {/* Footer */}
              {footer && (
                <GlassPanelFooter sticky className="bg-white/95 border-border-slate">
                  {footer}
                </GlassPanelFooter>
              )}
            </GlassPanel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
