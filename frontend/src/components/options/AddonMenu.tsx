import type { AddonItem } from '@/types/proposal';
import { formatUsd } from '@/lib/currency';
import { GlassPanel } from '@/components/ui/GlassPanel';

interface AddonMenuProps {
  addons: AddonItem[];
  /** id de la opción (tier) abierta en el modal, para resolver "incluido" vs. "disponible" */
  tierId: string;
  selectedAddonIds: string[];
  /** omitir para renderizar en modo solo-lectura (p.ej. desde el resumen ejecutivo) */
  onToggle?: (addonId: string) => void;
}

export function AddonMenu({ addons, tierId, selectedAddonIds, onToggle }: AddonMenuProps) {
  const applicable = addons.filter((a) => !a.applicableTiers || a.applicableTiers.includes(tierId));
  if (applicable.length === 0) return null;

  const included = applicable.filter((a) => a.includedInTiers.includes(tierId));
  const available = applicable.filter((a) => !a.includedInTiers.includes(tierId));
  const readOnly = !onToggle;

  return (
    <GlassPanel variant="light" className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <h4 className="font-label-caps text-label-caps text-ink-navy">Módulos Opcionales</h4>
        {available.length > 0 && (
          <span className="font-label-caps text-label-caps bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
            {available.length} disponible{available.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {/* Available addons (toggleable, or read-only when no onToggle handler is provided) */}
        {available.map((addon) => {
          const checked = selectedAddonIds.includes(addon.id);
          const Tag = readOnly ? 'div' : 'label';
          return (
            <Tag
              key={addon.id}
              className={`flex items-start gap-3 rounded-xl border p-4 text-sm transition-all ${
                readOnly ? 'cursor-default' : 'cursor-pointer'
              } ${
                checked
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : readOnly
                    ? 'border-border-slate'
                    : 'border-border-slate hover:border-primary/30 hover:bg-surface-container-low/50'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                checked ? 'border-primary bg-primary' : 'border-border-slate bg-white'
              }`}>
                {checked && (
                  <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check
                  </span>
                )}
              </div>
              {!readOnly && (
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(addon.id)}
                  className="sr-only"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-body-medium text-body-medium text-ink-navy font-bold">{addon.label}</span>
                  {addon.recommended && (
                    <span className="font-label-caps text-label-caps bg-positive/10 text-positive px-2 py-0.5 rounded-full border border-positive/20">
                      Recomendado
                    </span>
                  )}
                  {readOnly && checked && (
                    <span className="font-label-caps text-label-caps bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                      Seleccionado
                    </span>
                  )}
                </div>
                <p className="font-body-base text-body-base text-ink-secondary mt-1 leading-relaxed">{addon.description}</p>
              </div>
              <div className="text-right shrink-0">
                <span className={`font-headline-md text-headline-md whitespace-nowrap ${checked ? 'text-primary' : 'text-ink-navy'}`}>
                  +{formatUsd(addon.amountUsd)}
                </span>
                {addon.recurring && (
                  <span className="font-body-medium text-body-medium text-ink-muted block">/año</span>
                )}
              </div>
            </Tag>
          );
        })}

        {/* Included addons (read-only) */}
        {included.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border-slate">
            <p className="font-label-caps text-label-caps text-ink-muted">Incluidos en esta alternativa</p>
            {included.map((addon) => (
              <div
                key={addon.id}
                className="flex items-center gap-3 rounded-xl border border-border-slate/50 bg-surface-container-low/50 p-3 text-sm"
              >
                <div className="w-6 h-6 rounded-full border border-positive/30 bg-positive/10 shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-positive" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-body-medium text-body-medium text-ink-secondary font-semibold">{addon.label}</span>
                  <p className="font-body-base text-body-base text-ink-muted mt-0.5 leading-snug">{addon.description}</p>
                </div>
                <span className="font-label-caps text-label-caps bg-positive/10 text-positive px-2 py-0.5 rounded-full border border-positive/20 whitespace-nowrap shrink-0">
                  Incluido
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
