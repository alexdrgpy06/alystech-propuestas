import { describe, expect, it } from 'vitest';
import type { AddonItem, OptionGroupContent } from '@/types/proposal';
import { computeTotals, defaultSelections, emptyAddonSelections, findAddon, findOption, splitPercents, toSelectionList } from './totals';

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

const groupB: OptionGroupContent = {
  ...makeGroup({
    id: 'srv',
    defaultOptionId: 'b-base',
    options: [
      {
        id: 'b-base',
        code: 'B-BASE',
        group: 'srv',
        name: 'Server base',
        priceUsd: 200,
        priceUnit: 'único',
        recurUsd: 0,
        hwUsd: 150,
        devUsd: 50,
        isDefault: true,
        description: '',
        features: [],
        costBreakdown: [],
      },
    ],
  }),
};

describe('defaultSelections', () => {
  it('picks each group default option', () => {
    const groups = [makeGroup(), groupB];
    expect(defaultSelections(groups)).toEqual({ mdm: 'a-base', srv: 'b-base' });
  });
});

describe('findOption', () => {
  it('returns the matching option', () => {
    const groups = [makeGroup()];
    expect(findOption(groups, 'mdm', 'a-pro')?.name).toBe('Pro');
  });

  it('returns undefined for an unknown id', () => {
    const groups = [makeGroup()];
    expect(findOption(groups, 'mdm', 'nope')).toBeUndefined();
  });

  it('returns undefined when optionId is undefined', () => {
    const groups = [makeGroup()];
    expect(findOption(groups, 'mdm', undefined)).toBeUndefined();
  });
});

describe('computeTotals', () => {
  it('sums price/recur/hw/dev across selected groups at the default selection', () => {
    const groups = [makeGroup(), groupB];
    const selections = defaultSelections(groups);
    const totals = computeTotals(groups, selections, 80);
    expect(totals).toEqual({ totalUsd: 300, recurUsd: 0, hwUsd: 170, devUsd: 130, perDeviceUsd: 4 });
  });

  it('reflects a changed selection', () => {
    const groups = [makeGroup(), groupB];
    const selections = { ...defaultSelections(groups), mdm: 'a-pro' };
    const totals = computeTotals(groups, selections, 80);
    expect(totals.totalUsd).toBe(500);
    expect(totals.recurUsd).toBe(50);
    expect(totals.hwUsd).toBe(210);
    expect(totals.devUsd).toBe(290);
  });

  it('returns zeroed totals when a selection points at a missing option', () => {
    const groups = [makeGroup()];
    const totals = computeTotals(groups, { mdm: 'does-not-exist' } as never, 80);
    expect(totals).toEqual({ totalUsd: 0, recurUsd: 0, hwUsd: 0, devUsd: 0, perDeviceUsd: 0 });
  });

  it('does not divide by zero when deviceCount is 0', () => {
    const groups = [makeGroup()];
    const totals = computeTotals(groups, defaultSelections(groups), 0);
    expect(totals.perDeviceUsd).toBe(0);
  });
});

describe('splitPercents', () => {
  it('splits dev/hw proportionally', () => {
    expect(splitPercents(80, 20)).toEqual({ devPct: 80, hwPct: 20 });
  });

  it('defaults to 100% dev when both are zero (matches legacy setBar behaviour)', () => {
    expect(splitPercents(0, 0)).toEqual({ devPct: 100, hwPct: 0 });
  });
});

describe('toSelectionList', () => {
  it('lists only groups with a resolvable option', () => {
    const groups = [makeGroup()];
    const list = toSelectionList(groups, { mdm: 'a-pro', srv: 'missing' } as never);
    expect(list).toEqual([{ group: 'mdm', optionId: 'a-pro' }]);
  });
});

describe('findAddon', () => {
  it('returns the matching addon', () => {
    const groups = [makeGroup()];
    expect(findAddon(groups, 'mdm', 'sms')?.label).toBe('Canal SMS');
  });

  it('returns undefined for an unknown id', () => {
    const groups = [makeGroup()];
    expect(findAddon(groups, 'mdm', 'nope')).toBeUndefined();
  });
});

describe('computeTotals with addons', () => {
  it('matches the tier-only totals when no addon is selected (regression, no behaviour change)', () => {
    const groups = [makeGroup(), groupB];
    const selections = defaultSelections(groups);
    const totals = computeTotals(groups, selections, 80, emptyAddonSelections());
    expect(totals).toEqual({ totalUsd: 300, recurUsd: 0, hwUsd: 170, devUsd: 130, perDeviceUsd: 4 });
  });

  it('adds an addon not included in the selected tier', () => {
    const groups = [makeGroup(), groupB];
    const selections = defaultSelections(groups); // mdm: a-base, doesn't include 'sms'
    const totals = computeTotals(groups, selections, 80, { ...emptyAddonSelections(), mdm: ['sms'] });
    expect(totals.totalUsd).toBe(300 + 50); // 100 (a-base) + 50 (sms) + 200 (b-base)
    expect(totals.devUsd).toBe(130 + 50);
    expect(totals.recurUsd).toBe(0); // sms is not recurring
  });

  it('does not double-charge an addon already included in the selected tier', () => {
    const groups = [makeGroup(), groupB];
    const selections = { ...defaultSelections(groups), mdm: 'a-pro' }; // a-pro already includes 'sms'
    const withAddon = computeTotals(groups, selections, 80, { ...emptyAddonSelections(), mdm: ['sms'] });
    const withoutAddon = computeTotals(groups, selections, 80, emptyAddonSelections());
    expect(withAddon).toEqual(withoutAddon);
  });

  it('adds a recurring addon to both totalUsd and recurUsd', () => {
    const groups = [makeGroup(), groupB];
    const selections = defaultSelections(groups);
    const totals = computeTotals(groups, selections, 80, { ...emptyAddonSelections(), mdm: ['training'] });
    expect(totals.totalUsd).toBe(300 + 30);
    expect(totals.recurUsd).toBe(30);
  });

  it('sums multiple addons on the same group', () => {
    const groups = [makeGroup(), groupB];
    const selections = defaultSelections(groups);
    const totals = computeTotals(groups, selections, 80, { ...emptyAddonSelections(), mdm: ['sms', 'training'] });
    expect(totals.totalUsd).toBe(300 + 50 + 30);
  });

  it('ignores an unknown addon id without throwing', () => {
    const groups = [makeGroup(), groupB];
    const selections = defaultSelections(groups);
    const totals = computeTotals(groups, selections, 80, { ...emptyAddonSelections(), mdm: ['does-not-exist'] });
    expect(totals.totalUsd).toBe(300);
  });

  it('does not charge an addon restricted to tiers that do not include the current selection', () => {
    const groups = [
      makeGroup({
        addons: [
          { id: 'custom-console', label: 'Consola a medida', description: '', amountUsd: 400, includedInTiers: [], applicableTiers: ['a-pro'] },
        ],
      }),
      groupB,
    ];
    const selections = defaultSelections(groups); // mdm: a-base, not in applicableTiers
    const totals = computeTotals(groups, selections, 80, { ...emptyAddonSelections(), mdm: ['custom-console'] });
    expect(totals.totalUsd).toBe(300); // addon not charged, not applicable to a-base
  });
});
