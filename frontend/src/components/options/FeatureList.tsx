import type { FeatureLine } from '@/types/proposal';

const ICON: Record<FeatureLine['status'], string> = { yes: '✓', no: '✕', mid: '!' };
const CLASS: Record<FeatureLine['status'], string> = {
  yes: 'text-green',
  no: 'text-red',
  mid: 'text-amber-line',
};

export function FeatureList({ features }: { features: FeatureLine[] }) {
  if (features.length === 0) return null;
  return (
    <ul className="space-y-1.5">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-2 text-md leading-snug text-ink">
          <span className={`mt-0.5 w-3.5 flex-shrink-0 text-center font-bold ${CLASS[f.status]}`}>{ICON[f.status]}</span>
          <span className={f.status === 'no' ? 'text-slate' : undefined}>{f.text}</span>
        </li>
      ))}
    </ul>
  );
}
