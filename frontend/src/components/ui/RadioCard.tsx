import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

type DivPropsForMotion = Omit<HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>;

export interface RadioCardProps extends DivPropsForMotion {
  /** Whether this card is selected */
  selected?: boolean;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Icon to display (Material Symbols name or ReactNode) */
  icon?: ReactNode;
  /** Icon background variant */
  iconVariant?: 'default' | 'primary' | 'success' | 'warning';
  /** Title of the card */
  title: string;
  /** Description text */
  description?: string;
  /** Price or badge text */
  price?: string;
  /** Price period label (e.g., "RECURRENTE ANUAL") */
  pricePeriod?: string;
  /** Small caps label shown above the price, e.g. "Desde" */
  priceLabel?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional content at the bottom */
  footer?: ReactNode;
  /** Custom class name */
  className?: string;
}

/**
 * RadioCard - Interactive selection card with custom radio indicator
 * 
 * Based on DESIGN.md:
 * - Standard state: 1px slate border
 * - Active/Selected: 2px Royal Blue border + #eff6ff background glow
 * - Radio Indicators: Custom 22px circular dials
 *   - Inactive: muted border
 *   - Active: solid blue fill with central white dot
 * - Hover: border-color primary, background accent-soft, subtle shadow
 * - Transition: all 0.2s ease-in-out
 */
export const RadioCard = forwardRef<HTMLDivElement, RadioCardProps>(
  ({
    selected = false,
    disabled = false,
    icon,
    iconVariant = 'default',
    title,
    description,
    price,
    pricePeriod,
    priceLabel,
    onClick,
    footer,
    className = '',
    ...props
  }, ref) => {
    const iconBgClasses = {
      default: 'bg-surface-container-high',
      primary: 'bg-primary/10',
      success: 'bg-positive/10',
      warning: 'bg-warning/10',
    };

    const iconColorClasses = {
      default: 'text-primary',
      primary: 'text-primary',
      success: 'text-positive',
      warning: 'text-warning',
    };

    const handleClick = () => {
      if (!disabled && onClick) {
        onClick();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !disabled && onClick) {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <motion.div
        ref={ref}
        role="radio"
        aria-checked={selected}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          card-option
          rounded-xl
          border
          p-5
          cursor-pointer
          relative
          flex
          flex-col
          justify-between
          min-h-[180px]
          transition-all
          duration-200
          ${selected ? 'border-2 border-primary bg-accent-soft' : 'border-border-slate bg-surface'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {/* Top section: Icon and Radio Indicator */}
        <div className="flex justify-between items-start mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ${selected ? iconBgClasses[iconVariant] : 'bg-surface-container-high'} ${iconColorClasses[iconVariant]}`}>
            {icon}
          </div>
          <div
            className={`
              radio-indicator
              ${selected ? 'border-primary bg-primary' : 'border-border-slate'}
            `}
            aria-hidden="true"
          />
        </div>

        {/* Content section */}
        <div className="flex-1">
          <h3 className="text-lg md:text-headline-md font-bold md:font-extrabold text-on-surface mb-1.5">
            {title}
          </h3>
          {description && (
            <p className="text-body-medium md:text-body-base text-secondary leading-snug mb-3 line-clamp-3">
              {description}
            </p>
          )}
        </div>

        {/* Price + footer: price bottom-left, actions bottom-right, same row */}
        {(price || pricePeriod || footer) && (
          <div className="mt-auto pt-4 border-t border-border-slate flex items-end justify-between gap-3">
            <div className="flex flex-col">
              {priceLabel && (
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-secondary">
                  {priceLabel}
                </span>
              )}
              {price && (
                <span className="font-extrabold text-primary text-xl md:text-2xl leading-tight">
                  {price}
                  {pricePeriod && (
                    <span className="text-xs font-semibold text-secondary ml-1">{pricePeriod}</span>
                  )}
                </span>
              )}
            </div>
            {footer && <div className="shrink-0">{footer}</div>}
          </div>
        )}
      </motion.div>
    );
  }
);

RadioCard.displayName = 'RadioCard';

// Sub-component for the radio indicator (can be used standalone)
export interface RadioIndicatorProps {
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}

export const RadioIndicator = ({ selected = false, disabled = false, className = '' }: RadioIndicatorProps) => (
  <div
    className={`
      radio-indicator
      ${selected ? 'border-primary bg-primary' : 'border-border-slate'}
      ${disabled ? 'opacity-50' : ''}
      ${className}
    `}
    aria-hidden="true"
  />
);