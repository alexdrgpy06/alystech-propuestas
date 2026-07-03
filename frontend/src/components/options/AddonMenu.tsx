import type { AddonItem } from '@/types/proposal';
import { formatUsd } from '@/lib/currency';

interface AddonMenuProps {
  addons: AddonItem[];
  /** id de la opción (tier) abierta en el modal, para resolver "incluido" vs. "disponible" */
  tierId: string;
  selectedAddonIds: string[];
  onToggle: (addonId: string) => void;
}

export function AddonMenu({ addons, tierId, selectedAddonIds, onToggle }: AddonMenuProps) {
  const applicable = addons.filter((a) => !a.applicableTiers || a.applicableTiers.includes(tierId));
  if (applicable.length === 0) return null;

  const included = applicable.filter((a) => a.includedInTiers.includes(tierId));
  const available = applicable.filter((a) => !a.includedInTiers.includes(tierId));

  return (
    <div className="space-y-3 pt-4 border-t border-card-border/50 mt-2">
      <div className="flex items-center gap-2">
        <h4 className="text-2xs font-bold uppercase tracking-wider text-navy">Módulos Opcionales</h4>
        {available.length > 0 && (
          <span className="text-3xs font-bold bg-accent-soft text-accent border border-accent/20 px-1.5 py-0.5 rounded-full">
            {available.length} disponible{available.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {/* Available addons (toggleable) */}
        {available.map((addon) => {
          const checked = selectedAddonIds.includes(addon.id);
          return (
            <label
              key={addon.id}
              className={`flex items-start gap-3 rounded-xl border p-3.5 text-xs cursor-pointer transition-all ${
                checked
                  ? 'border-accent/40 bg-accent-soft/60 shadow-xs'
                  : 'border-card-border hover:border-accent/30 hover:bg-card-hover/50'
              }`}
            >
              <div className={`w-4.5 h-4.5 rounded border-2 mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                checked ? 'border-accent bg-accent' : 'border-ink-muted/40 bg-white'
              }`}>
                {checked && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(addon.id)}
                className="sr-only"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-navy">{addon.label}</span>
                  {addon.recommended && (
                    <span className="text-3xs font-bold uppercase tracking-wide text-positive bg-positive-soft border border-positive/20 px-1.5 py-0.5 rounded-full">
                      Recomendado
                    </span>
                  )}
                </div>
                <p className="text-ink-secondary mt-0.5 leading-relaxed text-2xs">{addon.description}</p>
              </div>
              <div className="text-right shrink-0">
                <span className={`font-bold whitespace-nowrap ${checked ? 'text-accent' : 'text-navy'}`}>
                  +{formatUsd(addon.amountUsd)}
                </span>
                {addon.recurring && (
                  <span className="block text-3xs text-ink-muted">/año</span>
                )}
              </div>
            </label>
          );
        })}

        {/* Included addons (read-only) */}
        {included.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-3xs font-bold uppercase tracking-wider text-ink-muted mt-1">Incluidos en esta alternativa</p>
            {included.map((addon) => (
              <div
                key={addon.id}
                className="flex items-center gap-3 rounded-xl border border-card-border/50 bg-card-hover/50 p-3 text-xs"
              >
                <div className="w-4.5 h-4.5 rounded border border-positive/30 bg-positive-soft shrink-0 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-positive" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-ink-secondary">{addon.label}</span>
                  <p className="text-2xs text-ink-muted mt-0.5 leading-snug">{addon.description}</p>
                </div>
                <span className="text-3xs font-bold uppercase tracking-wide text-positive bg-positive-soft border border-positive/20 px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                  Incluido
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
