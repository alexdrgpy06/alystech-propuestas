import { describe, expect, it } from 'vitest';
import { aud } from './aud';
import { computeTotals, emptyAddonSelections, emptySelections } from '@/lib/totals';

// Regla dura de no regresión de precios (ver docs/spec-redesign-addons.md):
// cualquier combinación tier+addons equivalente a un tier existente debe dar el mismo total que ese tier hoy.
describe('aud addons — regresión de precios', () => {
  const groups = [aud];
  const selections = emptySelections();

  function totalsFor(optionId: string, addonIds: string[] = []) {
    return computeTotals(groups, { ...selections, aud: optionId }, 80, {
      ...emptyAddonSelections(),
      aud: addonIds,
    });
  }

  it('AUD-A (base) sin addons mantiene su precio actual', () => {
    expect(totalsFor('aud-base').totalUsd).toBe(1548);
  });

  it('AUD-B (full) sin addons mantiene su precio actual', () => {
    expect(totalsFor('aud-full').totalUsd).toBe(2699);
  });

  it('AUD-C (edr) sin addons mantiene su precio actual', () => {
    expect(totalsFor('aud-edr').totalUsd).toBe(3299);
  });

  it('AUD-D (soc) sin addons mantiene su precio actual', () => {
    expect(totalsFor('aud-soc').totalUsd).toBe(4859);
  });

  it('AUD-B + SIEM/XDR + pentest reproduce exactamente el precio y recurrente de AUD-D', () => {
    const built = totalsFor('aud-full', ['aud-addon-siem', 'aud-addon-pentest']);
    const tier = totalsFor('aud-soc');
    expect(built.totalUsd).toBe(tier.totalUsd);
    expect(built.totalUsd).toBe(2699 + 1320 + 840);
    expect(built.recurUsd).toBe(tier.recurUsd);
    expect(built.recurUsd).toBe(659);
  });

  it('marcar los addons sobre AUD-D (ya incluidos) no duplica el cobro', () => {
    const withAddons = totalsFor('aud-soc', ['aud-addon-siem', 'aud-addon-pentest']);
    expect(withAddons.totalUsd).toBe(totalsFor('aud-soc').totalUsd);
  });

  it('los addons no aplican sobre AUD-A ni AUD-C, no se cobran', () => {
    expect(totalsFor('aud-base', ['aud-addon-siem', 'aud-addon-pentest']).totalUsd).toBe(
      totalsFor('aud-base').totalUsd,
    );
    expect(totalsFor('aud-edr', ['aud-addon-siem', 'aud-addon-pentest']).totalUsd).toBe(
      totalsFor('aud-edr').totalUsd,
    );
  });

  it('los addons no son recurrentes: no alteran el recurrente anual de AUD-B', () => {
    expect(totalsFor('aud-full', ['aud-addon-siem', 'aud-addon-pentest']).recurUsd).toBe(
      totalsFor('aud-full').recurUsd,
    );
  });
});
