import type { PlanOption } from '@/types/proposal';
import { formatUsd } from '@/lib/currency';
import { FeatureList } from '../options/FeatureList';
import { CostBreakdownTable } from '../options/CostBreakdownTable';
import { Badge } from '../options/Badge';
import { Modal } from './Modal';

export function OptionDetailModal({ option, onClose }: { option: PlanOption | null; onClose: () => void }) {
  return (
    <Modal open={option !== null} onClose={onClose} title={option ? `${option.code} — ${option.name}` : ''}>
      {option && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {option.badge && <Badge badge={option.badge} />}
            <span className="text-xl font-extrabold text-navy">
              {formatUsd(option.priceUsd)} <span className="text-xs font-medium text-slate">{option.priceUnit}</span>
            </span>
            {option.recurUsd > 0 && (
              <span className="text-xs text-slate">· Recurrente: {formatUsd(option.recurUsd)}/año</span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-slate">{option.description}</p>
          <FeatureList features={option.features} />
          <CostBreakdownTable lines={option.costBreakdown} totalUsd={option.priceUsd} />
          {option.perDeviceNote && (
            <div className="inline-flex items-center gap-2 rounded-lg bg-navy px-3 py-1.5 text-[11px] font-semibold text-white">
              {option.perDeviceNote}
            </div>
          )}
          {option.extraNote && <p className="text-[12px] italic text-slate">{option.extraNote}</p>}
        </div>
      )}
    </Modal>
  );
}
