import { describe, expect, it } from 'vitest';
import { srv } from './srv';
import { computeTotals, emptyAddonSelections, emptySelections } from '@/lib/totals';

// Regla dura de no regresión de precios (ver docs/spec-redesign-addons.md):
// cualquier combinación tier+addons equivalente a un tier existente debe dar el mismo total que ese tier hoy.
describe('srv addons — regresión de precios', () => {
  const groups = [srv];
  const selections = emptySelections();

  function totalsFor(optionId: string, addonIds: string[] = []) {
    return computeTotals(groups, { ...selections, srv: optionId }, 80, {
      ...emptyAddonSelections(),
      srv: addonIds,
    });
  }

  it('SRV-A (refurb) sin addons mantiene su precio actual', () => {
    expect(totalsFor('srv-refurb').totalUsd).toBe(2299);
  });

  it('SRV-B (mid) sin addons mantiene su precio actual', () => {
    expect(totalsFor('srv-mid').totalUsd).toBe(4399);
  });

  it('SRV-C (micro) sin addons mantiene su precio actual', () => {
    expect(totalsFor('srv-micro').totalUsd).toBe(3479);
  });

  it('SRV-D (ha) sin addons mantiene su precio actual', () => {
    expect(totalsFor('srv-ha').totalUsd).toBe(6799);
  });

  it('SRV-B + segundo nodo de replicación reproduce exactamente el precio de SRV-D', () => {
    const built = totalsFor('srv-mid', ['srv-addon-ha']);
    const tier = totalsFor('srv-ha');
    expect(built.totalUsd).toBe(tier.totalUsd);
    expect(built.totalUsd).toBe(6799);
  });

  it('marcar el addon sobre SRV-D (ya incluido) no duplica el cobro', () => {
    const withAddon = totalsFor('srv-ha', ['srv-addon-ha']);
    expect(withAddon.totalUsd).toBe(totalsFor('srv-ha').totalUsd);
  });

  it('el addon no aplica sobre SRV-A ni SRV-C, no se cobra', () => {
    expect(totalsFor('srv-refurb', ['srv-addon-ha']).totalUsd).toBe(totalsFor('srv-refurb').totalUsd);
    expect(totalsFor('srv-micro', ['srv-addon-ha']).totalUsd).toBe(totalsFor('srv-micro').totalUsd);
  });

  it('el addon no es recurrente: no altera el recurrente anual', () => {
    expect(totalsFor('srv-mid', ['srv-addon-ha']).recurUsd).toBe(totalsFor('srv-mid').recurUsd);
  });
});
