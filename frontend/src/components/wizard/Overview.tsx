import type { GlanceCard, OptionGroupContent, OverviewContent } from '@/types/proposal';
import { GlanceGrid } from './GlanceGrid';

interface OverviewProps {
  overview: OverviewContent;
  glanceCards: GlanceCard[];
  groups: OptionGroupContent[];
  onGoto: (step: number) => void;
}

export function Overview({ overview, glanceCards, groups, onGoto }: OverviewProps) {
  return (
    <section className="space-y-6">
      <p className="text-sm leading-relaxed text-slate">{overview.lead}</p>

      <div className="overflow-hidden rounded-xl border border-line">
        <div className="flex items-center gap-2 bg-gradient-to-r from-navy via-navy-2 to-steel px-4 py-3 text-md font-bold text-white">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="3" width="12" height="18" rx="2" />
            <path d="M9 3v2h6V3M9 9h6M9 13h6M9 17h3" />
          </svg>
          {overview.execboxHeading}
        </div>
        <div className="space-y-3 bg-white px-4 py-4">
          {overview.execboxParagraphs.map((p, i) => (
            <p key={i} className="text-md leading-relaxed text-ink">
              <span className="font-bold text-navy">{p.leadIn}</span> {p.text}
            </p>
          ))}
        </div>
      </div>

      <div className="flex gap-3 rounded-xl border border-line-soft bg-blue-soft/60 p-4">
        <span className="text-2xl">{overview.scaleBannerIcon}</span>
        <div>
          <h5 className="mb-1 text-md font-bold uppercase tracking-wide text-navy">{overview.scaleBannerHeading}</h5>
          <p className="text-md leading-relaxed text-navy/80">{overview.scaleBannerText}</p>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-md font-bold text-navy">{overview.glanceHeading}</h4>
        <GlanceGrid cards={glanceCards} groups={groups} onGoto={onGoto} />
      </div>
    </section>
  );
}
