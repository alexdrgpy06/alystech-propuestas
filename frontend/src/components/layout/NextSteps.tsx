import type { NextStepsContent } from '@/types/proposal';

interface NextStepsProps {
  content: NextStepsContent;
}

export function NextSteps({ content }: NextStepsProps) {
  return (
    <section className="bg-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-2xl font-black text-navy sm:text-3xl">
            {content.title}
          </h2>
          <p className="text-[14px] leading-relaxed text-slate">
            {content.intro}
          </p>
        </div>

        <div className="relative mx-auto max-w-lg">
          {/* Vertical line */}
          <div className="absolute bottom-0 left-[27px] top-4 w-px bg-line-soft sm:left-[35px]" />
          
          <div className="space-y-6">
            {content.timeline.map((step, i) => (
              <div key={i} className="relative flex items-start gap-4 sm:gap-6">
                <div 
                  className={`relative z-10 flex h-[54px] w-[54px] shrink-0 flex-col items-center justify-center rounded-full border-4 border-bg sm:h-[70px] sm:w-[70px] ${
                    step.future 
                      ? 'bg-line-soft text-slate' 
                      : 'bg-navy text-white shadow-md shadow-navy/20'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wide sm:text-[11px]">Semana</span>
                  <span className="text-lg font-black leading-none sm:text-xl">{step.week}</span>
                </div>
                <div className="pt-3 sm:pt-5">
                  <p className={`text-[13px] sm:text-[14px] ${step.future ? 'text-slate' : 'font-bold text-navy'}`}>
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
