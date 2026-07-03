import type { GroupTechDetail } from '@/types/proposal';
import { formatUsd } from '@/lib/currency';
import { Modal } from './Modal';
import { ComparisonMatrixTable } from './ComparisonMatrixTable';

const BAR_COLOR: Record<string, string> = {
  b1: 'bg-steel',
  b2: 'bg-green',
  b3: 'bg-amber',
  b4: 'bg-navy-2',
};

interface GroupDetailModalProps {
  title: string;
  detail: GroupTechDetail | null;
  onClose: () => void;
}

export function GroupDetailModal({ title, detail, onClose }: GroupDetailModalProps) {
  return (
    <Modal open={detail !== null} onClose={onClose} title={title}>
      {detail && (
        <div className="space-y-6">
          {detail.architectureSteps && (
            <div>
              {detail.architectureHeading && <h4 className="mb-2 text-[13px] font-bold text-navy">{detail.architectureHeading}</h4>}
              <div className="space-y-2">
                {detail.architectureSteps.map((step, i) => (
                  <div key={i} className="flex gap-3 rounded-lg border border-line-soft bg-bg/60 p-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-steel text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    <div>
                      <h5 className="text-[12.5px] font-bold text-navy">{step.title}</h5>
                      <p className="text-[12px] leading-relaxed text-slate">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detail.narrative && (
            <div>
              <h4 className="mb-1 text-[13px] font-bold text-navy">{detail.narrative.heading}</h4>
              <p className="text-[12.5px] leading-relaxed text-slate">{detail.narrative.text}</p>
            </div>
          )}

          {detail.howItWorks && (
            <div className="overflow-hidden rounded-lg border border-line">
              <div className="border-b border-line-soft bg-bg px-3 py-2 text-[12px] font-bold text-navy">
                {detail.howItWorks.heading}
              </div>
              <div className="divide-y divide-dashed divide-line-soft">
                {detail.howItWorks.rows.map((row, i) => (
                  <div key={i} className="flex flex-col gap-1 px-3 py-2 sm:flex-row sm:gap-3">
                    <span className="flex-shrink-0 text-[12px] font-bold text-steel sm:w-40">{row.label}</span>
                    <span className="text-[12px] text-ink">{row.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detail.comparisonColumns && (
            <div className="grid gap-3 sm:grid-cols-2">
              {detail.comparisonColumns.map((col, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3.5 ${col.tone === 'bad' ? 'border-red-soft bg-red-soft' : 'border-green-soft bg-green-soft'}`}
                >
                  <h5 className={`mb-2 flex items-center gap-1.5 text-[12.5px] font-bold ${col.tone === 'bad' ? 'text-red' : 'text-green'}`}>
                    {col.heading}
                  </h5>
                  <ul className="space-y-1">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-[11.5px] text-ink">
                        <span className={col.tone === 'bad' ? 'text-red' : 'text-green'}>{col.tone === 'bad' ? '✕' : '✓'}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {detail.notes &&
            detail.notes.map((note, i) => (
              <div key={i} className="rounded-lg border-l-4 border-steel bg-blue-soft p-3">
                <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-wide text-steel">{note.label}</span>
                <p className="text-[12px] leading-relaxed text-ink">{note.text}</p>
              </div>
            ))}

          {detail.catalogMatrix && <ComparisonMatrixTable matrix={detail.catalogMatrix} />}

          {detail.costChart && (
            <div className="space-y-2">
              {detail.costChart.map((bar, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-32 flex-shrink-0 text-right text-[11.5px] text-slate">{bar.label}</div>
                  <div className="h-6 flex-1 overflow-hidden rounded bg-line-soft">
                    <div
                      className={`flex h-full items-center px-2 text-[11px] font-bold text-white ${BAR_COLOR[bar.tone]}`}
                      style={{ width: `${bar.widthPct}%` }}
                    >
                      {formatUsd(bar.amountUsd)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {detail.comparisonMatrix && <ComparisonMatrixTable matrix={detail.comparisonMatrix} />}
        </div>
      )}
    </Modal>
  );
}
