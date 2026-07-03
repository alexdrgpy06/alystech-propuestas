import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

type ButtonPropsForMotion = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>;

export interface ActionButtonProps extends ButtonPropsForMotion {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Icon to show before label */
  leftIcon?: ReactNode;
  /** Icon to show after label */
  rightIcon?: ReactNode;
  /** Whether button is loading */
  loading?: boolean;
  /** Whether to stretch full width */
  fullWidth?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * ActionButton - Primary interactive button component
 * 
 * Based on DESIGN.md:
 * - Primary: Rounded-xl (12px), Royal Blue background, white text, shadow-lg shadow-accent/25, hover scale-1.02
 * - Secondary: Transparent or soft-slate background with 1px border, min-height 44px
 * - Ghost: No background, no border, text only
 * - Danger: Red variant for destructive actions
 * - All: 44px minimum height for touch accessibility
 * - Micro-interactions: tap scale (0.98), hover lift/glow
 */
export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    loading = false,
    fullWidth = false,
    disabled,
    children,
    className = '',
    ...props
  }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center gap-2
      font-body-medium text-body-medium font-bold
      rounded-xl
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark
      disabled:opacity-50 disabled:cursor-not-allowed
      min-h-[44px]
    `;

    const variantClasses = {
      primary: `
        bg-primary text-on-primary
        shadow-lg shadow-primary/25
        hover:bg-surface-tint hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30
        active:scale-[0.98]
      `,
      secondary: `
        bg-transparent text-secondary border border-border-slate
        hover:bg-surface-container-high
        active:bg-surface-container
      `,
      ghost: `
        bg-transparent text-ink-secondary border border-transparent
        hover:bg-surface-container-high
        active:bg-surface-container
      `,
      danger: `
        bg-danger text-on-error
        shadow-lg shadow-danger/25
        hover:bg-danger-hover hover:scale-[1.02] hover:shadow-xl hover:shadow-danger/30
        active:scale-[0.98]
      `,
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm gap-1.5',
      md: 'px-6 py-3 gap-2',
      lg: 'px-8 py-4 text-lg gap-2.5',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span aria-hidden="true">{leftIcon}</span>}
        <span>{children}</span>
        {!loading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </motion.button>
    );
  }
);

ActionButton.displayName = 'ActionButton';

// Convenience exports for common variants
export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<ActionButtonProps, 'variant'>>(
  ({ className = '', ...props }, ref) => (
    <ActionButton ref={ref} variant="primary" className={className} {...props} />
  )
);
PrimaryButton.displayName = 'PrimaryButton';

export const SecondaryButton = forwardRef<HTMLButtonElement, Omit<ActionButtonProps, 'variant'>>(
  ({ className = '', ...props }, ref) => (
    <ActionButton ref={ref} variant="secondary" className={className} {...props} />
  )
);
SecondaryButton.displayName = 'SecondaryButton';

export const GhostButton = forwardRef<HTMLButtonElement, Omit<ActionButtonProps, 'variant'>>(
  ({ className = '', ...props }, ref) => (
    <ActionButton ref={ref} variant="ghost" className={className} {...props} />
  )
);
GhostButton.displayName = 'GhostButton';

export const DangerButton = forwardRef<HTMLButtonElement, Omit<ActionButtonProps, 'variant'>>(
  ({ className = '', ...props }, ref) => (
    <ActionButton ref={ref} variant="danger" className={className} {...props} />
  )
);
DangerButton.displayName = 'DangerButton';