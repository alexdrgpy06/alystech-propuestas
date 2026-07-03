import type { AboutContent } from '@/types/proposal';

interface AboutProps {
  content: AboutContent;
}

export function About({ content }: AboutProps) {
  return (
    <section className="bg-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <span className="mb-3 block text-[11px] font-bold uppercase tracking-widest text-slate">
            {content.kicker}
          </span>
          <h2 className="mb-4 text-2xl font-black text-navy sm:text-3xl">
            {content.title}
          </h2>
          <p className="mx-auto max-w-2xl text-[14px] leading-relaxed text-slate">
            {content.lead}
          </p>
        </div>

        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.benefits.map((benefit, i) => (
            <div key={i} className="rounded-xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-3 text-2xl">{benefit.icon}</div>
              <h3 className="mb-2 text-[13px] font-bold text-navy">{benefit.title}</h3>
              <p className="text-[12.5px] leading-relaxed text-slate">{benefit.text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-navy to-steel p-6 text-white sm:p-8">
          <h3 className="mb-6 text-center text-[12px] font-bold uppercase tracking-wider text-blue-light">
            {content.paySubkicker}
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {content.payCards.map((card, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl">
                  {card.icon}
                </div>
                <h4 className="mb-1 text-[13px] font-bold">{card.title}</h4>
                <p className="text-[12px] text-white/70">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
