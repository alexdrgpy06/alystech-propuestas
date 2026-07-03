import type { JSX } from 'react';
import type { GlanceCard, OptionGroupContent } from '@/types/proposal';
import { formatUsd } from '@/lib/currency';

const ICONS: Record<string, JSX.Element> = {
  'mobile-device': (
    <rect x="7" y="2" width="10" height="20" rx="2" />
  ),
  'server-rack': (
    <>
      <rect x="4" y="3" width="16" height="7" rx="1.5" />
      <rect x="4" y="14" width="16" height="7" rx="1.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </>
  ),
  headset: (
    <>
      <path d="M3 12a9 9 0 0 1 18 0" />
      <path d="M21 12v5a2 2 0 0 1-2 2h-1v-7Z" />
      <path d="M3 12v5a2 2 0 0 0 2 2h1v-7Z" />
    </>
  ),
};

function priceRange(groups: OptionGroupContent[]): string {
  const prices = groups.flatMap((g) => g.options.map((o) => o.priceUsd));
  if (prices.length === 0) return '$0';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatUsd(min) : `${formatUsd(min)} – ${formatUsd(max)}`;
}

interface GlanceGridProps {
  cards: GlanceCard[];
  groups: OptionGroupContent[];
  onGoto: (step: number) => void;
}

export function GlanceGrid({ cards, groups, onGoto }: GlanceGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const groupIds = card.group === 'srv' ? (['srv', 'net'] as const) : ([card.group] as const);
        const relevant = groups.filter((g) => (groupIds as readonly string[]).includes(g.id));
        return (
          <button
            key={card.group}
            type="button"
            onClick={() => onGoto(card.gotoStep)}
            className="flex flex-col items-start gap-1 rounded-xl border border-line bg-white p-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue hover:shadow-md"
          >
            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-soft text-steel">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[card.icon] ?? null}
              </svg>
            </div>
            <h5 className="text-md font-bold text-navy">{card.title}</h5>
            <p className="text-2xs leading-relaxed text-slate">{card.text}</p>
            <span className="mt-1 text-2xs font-bold text-blue">{priceRange(relevant)}</span>
          </button>
        );
      })}
    </div>
  );
}
