import type {
  AddonSelections,
  ConsultaPayload,
  DecisionPayload,
  GroupId,
  OptionGroupContent,
  SelectionSummary,
  Totals,
} from '@/types/proposal';
import { emptyAddonSelections, findAddon, findOption } from './totals';
import { formatUsd } from './currency';

export function buildSelectionSummaries(
  groups: OptionGroupContent[],
  selections: Record<GroupId, string>,
  addonSelections: AddonSelections = emptyAddonSelections(),
): SelectionSummary[] {
  return (Object.keys(selections) as GroupId[])
    .map((group): SelectionSummary | null => {
      const option = findOption(groups, group, selections[group]);
      if (!option) return null;
      // charged addons: selected AND not already bundled into the tier — mirrors computeTotals in lib/totals.ts
      const addons = (addonSelections[group] ?? [])
        .map((addonId) => findAddon(groups, group, addonId))
        .filter((addon): addon is NonNullable<typeof addon> => {
          if (!addon) return false;
          if (addon.applicableTiers && !addon.applicableTiers.includes(option.id)) return false;
          if (addon.includedInTiers.includes(option.id)) return false;
          return true;
        })
        .map((addon) => ({ label: addon.label, amountUsd: addon.amountUsd, recurring: addon.recurring }));
      return {
        group,
        code: option.code,
        name: option.name,
        price: formatUsd(option.priceUsd),
        id: option.id,
        description: option.description,
        costBreakdown: option.costBreakdown,
        addons: addons.length > 0 ? addons : undefined,
      };
    })
    .filter((s): s is SelectionSummary => s !== null);
}

export function totalsPayload(totals: Totals): { total: string; recurrent: string } {
  return { total: formatUsd(totals.totalUsd), recurrent: formatUsd(totals.recurUsd) };
}

async function postJson(url: string, body: unknown): Promise<void> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`request to ${url} failed with status ${res.status}`);
}

export async function submitDecision(payload: DecisionPayload): Promise<void> {
  await postJson('/api/decision', payload);
}

export async function submitConsulta(payload: ConsultaPayload): Promise<void> {
  await postJson('/api/consulta', payload);
}

export interface PdfRequest {
  proposalId: string;
  selections: SelectionSummary[];
  totals: { total: string; recurrent: string };
}

export async function downloadPdf(payload: PdfRequest): Promise<void> {
  const res = await fetch('/api/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('pdf request failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Alystech-Presupuesto-Araucanos.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
