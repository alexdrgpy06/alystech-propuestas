import type { HeroContent } from '@/types/proposal';

interface HeroProps {
  content: HeroContent;
}

export function Hero({ content }: HeroProps) {
  return (
    <section className="bg-navy px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <span className="mb-4 inline-block rounded-full bg-blue/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-light">
          {content.eyebrow}
        </span>
        <h1 className="mb-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
          {content.title}
        </h1>
        <p className="mb-8 text-lg font-medium text-blue-light sm:text-xl">
          {content.subtitle}
        </p>
        
        <div className="space-y-4 rounded-2xl bg-white/5 p-6 backdrop-blur-sm sm:p-8">
          {content.letterParagraphs.map((paragraph, index) => (
            <p key={index} className="text-[14px] leading-relaxed text-slate-light">
              {paragraph}
            </p>
          ))}
          
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="font-bold">{content.signatureName}</p>
            <p className="text-[13px] text-slate-light">{content.signatureRole}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-[12px] text-slate-light">
          {content.meta.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="font-bold uppercase tracking-wider text-white/50">{item.label}:</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
