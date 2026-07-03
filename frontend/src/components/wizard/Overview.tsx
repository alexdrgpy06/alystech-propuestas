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
    <section className="space-y-8 w-full max-w-5xl mx-auto">
      <div className="text-center md:text-left">
        <p className="text-sm sm:text-md leading-relaxed text-slate max-w-3xl">{overview.lead}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line shadow-sm">
        <div className="flex items-center gap-2.5 bg-gradient-to-r from-navy via-navy-2 to-steel px-5 py-4 text-md font-bold text-white">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="3" width="12" height="18" rx="2" />
            <path d="M9 3v2h6V3M9 9h6M9 13h6M9 17h3" />
          </svg>
          {overview.execboxHeading}
        </div>
        <div className="grid gap-4 bg-white px-5 py-6 sm:grid-cols-2">
          {overview.execboxParagraphs.map((p, i) => (
            <div key={i} className="flex gap-3.5 rounded-xl border border-line-soft bg-slate-50/50 p-4 hover:shadow-xs transition-shadow">
              <div className="shrink-0 pt-0.5 text-accent">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h5 className="font-bold text-navy mb-1">{p.leadIn}</h5>
                <p className="text-sm leading-relaxed text-ink-secondary">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border-l-4 border-l-blue border-y border-y-line-soft border-r border-r-line-soft bg-blue-soft/40 p-5 shadow-sm">
        <span className="text-3xl shrink-0">{overview.scaleBannerIcon}</span>
        <div>
          <h5 className="mb-1 text-md font-extrabold uppercase tracking-wide text-navy">{overview.scaleBannerHeading}</h5>
          <p className="text-sm leading-relaxed text-navy/80">{overview.scaleBannerText}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-line">
        <h4 className="mb-5 text-lg font-extrabold text-navy text-center md:text-left">{overview.glanceHeading}</h4>
        <GlanceGrid cards={glanceCards} groups={groups} onGoto={onGoto} />
      </div>
    </section>
  );
}
