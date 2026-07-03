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

  return (
    <div className="space-y-2.5 pt-3 border-t border-card-border/50">
      <h4 className="text-2xs font-bold uppercase tracking-wider text-navy">Addons opcionales</h4>
      <div className="space-y-2">
        {applicable.map((addon) => {
          const included = addon.includedInTiers.includes(tierId);
          const checked = included || selectedAddonIds.includes(addon.id);
          return (
            <label
              key={addon.id}
              className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs transition-colors ${
                included
                  ? 'border-card-border/40 bg-card-hover/50 cursor-default'
                  : 'border-card-border cursor-pointer hover:border-accent/40'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={included}
                onChange={() => !included && onToggle(addon.id)}
                className="mt-0.5 w-4 h-4 shrink-0 accent-accent"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-navy">{addon.label}</span>
                  {included ? (
                    <span className="text-3xs font-bold uppercase tracking-wide text-accent bg-accent-soft px-1.5 py-0.5 rounded">
                      Incluido
                    </span>
                  ) : (
                    addon.recommended && (
                      <span className="text-3xs font-bold uppercase tracking-wide text-positive bg-positive-soft px-1.5 py-0.5 rounded">
                        Recomendado
                      </span>
                    )
                  )}
                </div>
                <p className="text-ink-secondary mt-0.5 leading-relaxed">{addon.description}</p>
              </div>
              {!included && (
                <span className="font-bold text-navy shrink-0 whitespace-nowrap">
                  +{formatUsd(addon.amountUsd)}
                  {addon.recurring ? '/año' : ''}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
