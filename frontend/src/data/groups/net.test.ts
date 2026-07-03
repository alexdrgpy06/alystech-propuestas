import { describe, expect, it } from 'vitest';
import { net } from './net';
import { computeTotals, emptyAddonSelections, emptySelections } from '@/lib/totals';

// Regla dura de no regresión de precios (ver docs/spec-redesign-addons.md).
// Nota: NET-B + punto de acceso NO equivale a NET-C (NET-C además amplía el switch a 24 puertos),
// por eso acá no hay test de equivalencia con NET-C — solo suma correcta y no-cobro donde corresponde.
describe('net addons — regresión de precios', () => {
  const groups = [net];
  const selections = emptySelections();

  function totalsFor(optionId: string, addonIds: string[] = []) {
    return computeTotals(groups, { ...selections, net: optionId }, 80, {
      ...emptyAddonSelections(),
      net: addonIds,
    });
  }

  it('NET-A (none) sin addons mantiene su precio actual', () => {
    expect(totalsFor('net-none').totalUsd).toBe(0);
  });

  it('NET-B (base) sin addons mantiene su precio actual', () => {
    expect(totalsFor('net-base').totalUsd).toBe(899);
  });

  it('NET-C (full) sin addons mantiene su precio actual', () => {
    expect(totalsFor('net-full').totalUsd).toBe(1899);
  });

  it('NET-D (mesh) sin addons mantiene su precio actual', () => {
    expect(totalsFor('net-mesh').totalUsd).toBe(2699);
  });

  it('NET-B + punto de acceso suma exactamente los $350 del desglose de NET-C', () => {
    expect(totalsFor('net-base', ['net-addon-ap']).totalUsd).toBe(899 + 350);
  });

  it('marcar el addon sobre NET-C o NET-D (ya incluido) no duplica el cobro', () => {
    expect(totalsFor('net-full', ['net-addon-ap']).totalUsd).toBe(totalsFor('net-full').totalUsd);
    expect(totalsFor('net-mesh', ['net-addon-ap']).totalUsd).toBe(totalsFor('net-mesh').totalUsd);
  });

  it('el addon no aplica sobre NET-A, no se cobra', () => {
    expect(totalsFor('net-none', ['net-addon-ap']).totalUsd).toBe(totalsFor('net-none').totalUsd);
  });

  it('el addon no es recurrente: no altera el recurrente anual', () => {
    expect(totalsFor('net-base', ['net-addon-ap']).recurUsd).toBe(totalsFor('net-base').recurUsd);
  });
});
