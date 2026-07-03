import { describe, expect, it } from 'vitest';
import { mdm } from './mdm';
import { computeTotals, emptyAddonSelections, emptySelections } from '@/lib/totals';

// Regla dura de no regresión de precios (ver docs/spec-redesign-addons.md):
// cualquier combinación tier+addons equivalente a un tier existente debe dar el mismo total que ese tier hoy.
describe('mdm addons — regresión de precios', () => {
  const groups = [mdm];
  const selections = emptySelections();

  function totalsFor(optionId: string, addonIds: string[] = []) {
    return computeTotals(groups, { ...selections, mdm: optionId }, 80, {
      ...emptyAddonSelections(),
      mdm: addonIds,
    });
  }

  it('MDM-A (oss) sin addons mantiene su precio actual', () => {
    expect(totalsFor('mdm-oss').totalUsd).toBe(6200);
  });

  it('MDM-B (hybrid) sin addons mantiene su precio actual', () => {
    expect(totalsFor('mdm-hybrid').totalUsd).toBe(8500);
  });

  it('MDM-C (custom/Ideal) sin addons mantiene su precio actual', () => {
    expect(totalsFor('mdm-custom').totalUsd).toBe(11800);
  });

  it('MDM-A + Canal SMS + Políticas avanzadas reproduce exactamente el precio de MDM-B', () => {
    const built = totalsFor('mdm-oss', ['mdm-addon-sms', 'mdm-addon-politicas']);
    const tier = totalsFor('mdm-hybrid');
    expect(built.totalUsd).toBe(tier.totalUsd);
  });

  it('MDM-B + Consola a medida reproduce exactamente el precio de MDM-C', () => {
    const built = totalsFor('mdm-hybrid', ['mdm-addon-consola']);
    const tier = totalsFor('mdm-custom');
    expect(built.totalUsd).toBe(tier.totalUsd);
  });

  it('MDM-A + los 3 addons de desarrollo propio reproduce exactamente el precio de MDM-C', () => {
    const built = totalsFor('mdm-oss', ['mdm-addon-sms', 'mdm-addon-politicas', 'mdm-addon-consola']);
    const tier = totalsFor('mdm-custom');
    expect(built.totalUsd).toBe(tier.totalUsd);
  });

  it('marcar un addon ya incluido en el tier elegido no duplica el cobro', () => {
    const withAddon = totalsFor('mdm-hybrid', ['mdm-addon-sms']);
    const withoutAddon = totalsFor('mdm-hybrid');
    expect(withAddon.totalUsd).toBe(withoutAddon.totalUsd);
  });

  it('la entrega de código fuente solo aplica sobre MDM-C, no se cobra sobre MDM-A/B', () => {
    const onBase = totalsFor('mdm-oss', ['mdm-addon-codigo-fuente']);
    expect(onBase.totalUsd).toBe(totalsFor('mdm-oss').totalUsd);
  });
});
