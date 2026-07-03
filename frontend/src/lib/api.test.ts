import { describe, expect, it } from 'vitest';
import type { AddonItem, OptionGroupContent } from '@/types/proposal';
import { buildSelectionSummaries } from './api';
import { defaultSelections, emptyAddonSelections } from './totals';

function makeGroup(overrides: Partial<OptionGroupContent> = {}): OptionGroupContent {
  return {
    id: 'mdm',
    stepIndex: 1,
    code: 'A',
    groupTitle: '',
    title: 'Test group',
    risk: '',
    impact: '',
    guarantee: { title: '', text: '' },
    inSimple: '',
    intro: '',
    notes: [],
    hint: '',
    defaultOptionId: 'a-base',
    options: [
      {
        id: 'a-base',
        code: 'A-BASE',
        group: 'mdm',
        name: 'Base',
        priceUsd: 100,
        priceUnit: 'único',
        recurUsd: 0,
        hwUsd: 20,
        devUsd: 80,
        isDefault: true,
        description: '',
        features: [],
        costBreakdown: [],
      },
      {
        id: 'a-pro',
        code: 'A-PRO',
        group: 'mdm',
        name: 'Pro',
        priceUsd: 300,
        priceUnit: 'único',
        recurUsd: 50,
        hwUsd: 60,
        devUsd: 240,
        isDefault: false,
        description: '',
        features: [],
        costBreakdown: [],
      },
    ],
    addons: [
      { id: 'sms', label: 'Canal SMS', description: '', amountUsd: 50, includedInTiers: ['a-pro'] },
      { id: 'training', label: 'Capacitación extra', description: '', amountUsd: 30, recurring: true, includedInTiers: [] },
    ] satisfies AddonItem[],
    ...overrides,
  };
}

describe('buildSelectionSummaries with addons', () => {
  it('includes a charged addon (selected, not bundled into the tier) with label/amount/recurring', () => {
    const groups = [makeGroup()];
    const selections = defaultSelections(groups); // mdm: a-base, doesn't include 'sms'
    const summaries = buildSelectionSummaries(groups, selections, { ...emptyAddonSelections(), mdm: ['training'] });

    const mdmSummary = summaries.find((s) => s.group === 'mdm');
    expect(mdmSummary?.addons).toEqual([{ label: 'Capacitación extra', amountUsd: 30, recurring: true }]);
  });

  it('excludes an addon already bundled into the selected tier even when also present in selectedAddonIds', () => {
    const groups = [makeGroup()];
    const selections = { ...defaultSelections(groups), mdm: 'a-pro' }; // a-pro already includes 'sms'
    const summaries = buildSelectionSummaries(groups, selections, { ...emptyAddonSelections(), mdm: ['sms'] });

    const mdmSummary = summaries.find((s) => s.group === 'mdm');
    expect(mdmSummary?.addons).toBeUndefined();
  });

  it('omits addons entirely when none were selected (backwards compatible payload)', () => {
    const groups = [makeGroup()];
    const selections = defaultSelections(groups);
    const summaries = buildSelectionSummaries(groups, selections);

    const mdmSummary = summaries.find((s) => s.group === 'mdm');
    expect(mdmSummary?.addons).toBeUndefined();
  });
});
