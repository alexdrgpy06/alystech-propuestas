import type { CostLine } from '@/types/proposal';
import { formatUsd } from '@/lib/currency';

const CATEGORY_LABEL: Record<CostLine['category'], string> = {
  hw: 'Equipo',
  lab: 'Desarrollo',
  lic: 'Licencia',
  svc: 'Servicio',
};

const CATEGORY_CLASS: Record<CostLine['category'], string> = {
  hw: 'bg-steel',
  lab: 'bg-amber',
  lic: 'bg-slate',
  svc: 'bg-green',
};

export function CostBreakdownTable({ lines, totalUsd }: { lines: CostLine[]; totalUsd: number }) {
  if (lines.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-lg border border-line text-xs">
      <div className="bg-navy px-3 py-1.5 text-2xs font-bold uppercase tracking-wide text-white">
        Desglose (precios estimativos, IVA incluido)
      </div>
      {lines.map((line, i) => (
        <div key={i} className="flex items-center justify-between border-b border-line-soft px-3 py-1.5 last:border-b-0">
          <span className="flex items-center gap-2">
            <span className={`rounded px-1.5 py-0.5 text-3xs font-bold uppercase tracking-wide text-white ${CATEGORY_CLASS[line.category]}`}>
              {CATEGORY_LABEL[line.category]}
            </span>
            {line.label}
          </span>
          <span className="whitespace-nowrap font-medium">
            {formatUsd(line.amountUsd)}
            {line.recurring ? '/año' : ''}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between bg-blue-soft px-3 py-2 text-md font-bold text-navy">
        <span>Subtotal</span>
        <span>{formatUsd(totalUsd)}</span>
      </div>
    </div>
  );
}
