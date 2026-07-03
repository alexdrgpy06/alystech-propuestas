import type { FeatureCard } from '@/types/proposal';

export function FeatureCardGrid({ cards }: { cards: FeatureCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {cards.map((c, i) => (
        <div key={i} className="rounded-lg border border-line bg-white p-3.5">
          <h4 className="mb-1 flex items-center gap-2 text-md font-bold text-navy">
            <span className="text-base">{c.emoji}</span>
            {c.title}
          </h4>
          <p className="text-xs leading-relaxed text-slate">{c.text}</p>
        </div>
      ))}
    </div>
  );
}
