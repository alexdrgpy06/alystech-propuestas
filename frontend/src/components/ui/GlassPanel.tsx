import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

type DivPropsForMotion = Omit<HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>;

export interface GlassPanelProps extends DivPropsForMotion {
  /** Variant of the glass panel */
  variant?: 'light' | 'dark' | 'modal';
  /** Whether to apply elevated shadow */
  elevated?: boolean;
  /** Additional class names */
  className?: string;
  /** Children content */
  children: ReactNode;
}

/**
 * GlassPanel - A glassmorphism container component
 * 
 * Variants:
 * - light: White/95 backdrop-blur for cards and content areas (Layer 1)
 * - dark: Slate/80 backdrop-blur for overlays and modals (Layer 2)
 * - modal: Dark overlay with stronger blur for modal backdrops
 * 
 * Based on DESIGN.md elevation system:
 * - Layer 0: Deep Navy (#0f172a) - shell backdrop
 * - Layer 1: Pure white with soft shadow + 1px border - containers
 * - Layer 2: Semi-transparent slate backdrop + backdrop-blur - overlays/modals
 */
export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ variant = 'light', elevated = false, className = '', children, ...props }, ref) => {
    const baseClasses = 'rounded-xl transition-all duration-200';
    
    const variantClasses = {
      light: 'bg-white/95 backdrop-blur-md border border-border-slate shadow-sm',
      dark: 'bg-surface-dark/80 backdrop-blur-md border border-white/10 shadow-lg',
      modal: 'bg-surface-dark/90 backdrop-blur-lg border border-white/10 shadow-xl',
    };
    
    const elevationClasses = elevated 
      ? 'shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20' 
      : '';

    return (
      <motion.div
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${elevationClasses} ${className}`}
        whileHover={elevated ? { y: -2, transition: { duration: 0.2 } } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

// Convenience sub-components for common patterns
export const GlassPanelHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`flex items-center justify-between border-b border-border-slate pb-4 mb-4 ${className}`} {...props}>
      {children}
    </div>
  )
);
GlassPanelHeader.displayName = 'GlassPanelHeader';

export const GlassPanelBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={` ${className}`} {...props}>
      {children}
    </div>
  )
);
GlassPanelBody.displayName = 'GlassPanelBody';

export interface GlassPanelFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Pin the footer to the bottom of the panel with its own backdrop, e.g. modal totals bar */
  sticky?: boolean;
}

export const GlassPanelFooter = forwardRef<HTMLDivElement, GlassPanelFooterProps>(
  ({ className = '', children, sticky = false, ...props }, ref) => (
    <div 
      ref={ref} 
      className={`flex items-center justify-end gap-3 border-t border-border-slate pt-4 mt-4 ${sticky ? 'sticky bottom-0 bg-white/95 backdrop-blur-sm -mx-6 -mb-6 px-6 pb-4' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
GlassPanelFooter.displayName = 'GlassPanelFooter';