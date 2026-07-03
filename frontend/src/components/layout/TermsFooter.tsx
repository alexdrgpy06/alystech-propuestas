import type { TermsContent } from '@/types/proposal';

interface TermsFooterProps {
  content: TermsContent;
}

export function TermsFooter({ content }: TermsFooterProps) {
  return (
    <footer className="bg-navy px-4 py-12 text-slate-light sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h4 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-white/70">
          {content.title}
        </h4>
        <ul className="mb-12 list-outside list-disc space-y-2 pl-4 text-[12px] leading-relaxed">
          {content.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        
        <div className="border-t border-white/10 pt-8 text-center text-[11px] text-white/40">
          <p>{content.footerLine1}</p>
          <p className="mt-1">{content.footerLine2}</p>
        </div>
      </div>
    </footer>
  );
}
