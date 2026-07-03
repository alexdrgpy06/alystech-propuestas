import { useMemo, useState, useCallback } from 'react';
import type { AddonSelections, GroupId, OptionGroupContent, PlanOption } from '@/types/proposal';
import { computeTotals, emptyAddonSelections, emptySelections, findOption, splitPercents } from '@/lib/totals';

export function useProposalSelections(groups: OptionGroupContent[], deviceCount: number) {
  // Start with NO selections — user must explicitly choose
  const [selections, setSelections] = useState<Record<GroupId, string>>(() => emptySelections());
  const [addonSelections, setAddonSelections] = useState<AddonSelections>(() => emptyAddonSelections());

  const selectOption = useCallback((group: GroupId, optionId: string) => {
    setSelections((prev) => ({ ...prev, [group]: optionId }));
  }, []);

  const toggleAddon = useCallback((group: GroupId, addonId: string) => {
    setAddonSelections((prev) => {
      const current = prev[group] ?? [];
      const next = current.includes(addonId) ? current.filter((id) => id !== addonId) : [...current, addonId];
      return { ...prev, [group]: next };
    });
  }, []);

  const resetGroup = useCallback(
    (group: GroupId) => {
      setSelections((prev) => ({ ...prev, [group]: '' }));
      setAddonSelections((prev) => ({ ...prev, [group]: [] }));
    },
    [],
  );

  const resetAll = useCallback(() => {
    setSelections(emptySelections());
    setAddonSelections(emptyAddonSelections());
  }, []);

  const totals = useMemo(
    () => computeTotals(groups, selections, deviceCount, addonSelections),
    [groups, selections, deviceCount, addonSelections],
  );
  const split = useMemo(() => splitPercents(totals.devUsd, totals.hwUsd), [totals.devUsd, totals.hwUsd]);

  const selectedOption = useCallback(
    (group: GroupId): PlanOption | undefined => findOption(groups, group, selections[group]),
    [groups, selections],
  );

  return {
    selections,
    selectOption,
    addonSelections,
    toggleAddon,
    resetGroup,
    resetAll,
    totals,
    split,
    selectedOption,
  };
}
