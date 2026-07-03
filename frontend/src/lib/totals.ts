import type { AddonItem, AddonSelections, GroupId, OptionGroupContent, PlanOption, Selection, Totals } from '@/types/proposal';

export function findOption(
  groups: OptionGroupContent[],
  group: GroupId,
  optionId: string | undefined,
): PlanOption | undefined {
  if (!optionId) return undefined;
  return groups.find((g) => g.id === group)?.options.find((o) => o.id === optionId);
}

export function findAddon(
  groups: OptionGroupContent[],
  group: GroupId,
  addonId: string | undefined,
): AddonItem | undefined {
  if (!addonId) return undefined;
  return groups.find((g) => g.id === group)?.addons?.find((a) => a.id === addonId);
}

export function defaultSelections(groups: OptionGroupContent[]): Record<GroupId, string> {
  const out = {} as Record<GroupId, string>;
  groups.forEach((g) => {
    out[g.id] = g.defaultOptionId;
  });
  return out;
}

export function emptySelections(): Record<GroupId, string> {
  return { mdm: '', srv: '', net: '', aud: '', sup: '' };
}

export function emptyAddonSelections(): AddonSelections {
  return { mdm: [], srv: [], net: [], aud: [], sup: [] };
}

export function computeTotals(
  groups: OptionGroupContent[],
  selections: Record<GroupId, string>,
  deviceCount: number,
  addonSelections: AddonSelections = emptyAddonSelections(),
): Totals {
  let totalUsd = 0;
  let recurUsd = 0;
  let hwUsd = 0;
  let devUsd = 0;

  (Object.keys(selections) as GroupId[]).forEach((group) => {
    const option = findOption(groups, group, selections[group]);
    if (!option) return;
    totalUsd += option.priceUsd;
    recurUsd += option.recurUsd;
    hwUsd += option.hwUsd;
    devUsd += option.devUsd;

    (addonSelections[group] ?? []).forEach((addonId) => {
      const addon = findAddon(groups, group, addonId);
      if (!addon) return;
      // no aplica a este tier (ej. addon exclusivo de desarrollo propio sobre una plataforma comercial de terceros)
      if (addon.applicableTiers && !addon.applicableTiers.includes(option.id)) return;
      // ya incluido de forma nativa en el tier elegido — no se cobra dos veces
      if (addon.includedInTiers.includes(option.id)) return;
      totalUsd += addon.amountUsd;
      devUsd += addon.amountUsd;
      if (addon.recurring) recurUsd += addon.amountUsd;
    });
  });

  const perDeviceUsd = deviceCount > 0 ? Math.round(totalUsd / deviceCount) : 0;

  return { totalUsd, recurUsd, hwUsd, devUsd, perDeviceUsd };
}

export function splitPercents(devUsd: number, hwUsd: number): { devPct: number; hwPct: number } {
  const total = devUsd + hwUsd;
  if (total <= 0) return { devPct: 100, hwPct: 0 };
  return { devPct: (devUsd / total) * 100, hwPct: (hwUsd / total) * 100 };
}

export function toSelectionList(
  groups: OptionGroupContent[],
  selections: Record<GroupId, string>,
): Selection[] {
  return (Object.keys(selections) as GroupId[])
    .filter((group) => findOption(groups, group, selections[group]))
    .map((group) => ({ group, optionId: selections[group] }));
}
