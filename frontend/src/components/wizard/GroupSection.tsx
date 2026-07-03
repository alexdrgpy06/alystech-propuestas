import type { GroupId, OptionGroupContent } from '@/types/proposal';
import { OptionCard } from '../options/OptionCard';
import { NoteBlock } from './NoteBlock';
import { FeatureCardGrid } from './FeatureCardGrid';

interface GroupSectionProps {
  group: OptionGroupContent;
  selectedOptionId: string | undefined;
  onSelect: (group: GroupId, optionId: string) => void;
  onViewOption: (optionId: string) => void;
  onViewTechDetail?: () => void;
  showIntro?: boolean;
}

export function GroupSection({
  group,
  selectedOptionId,
  onSelect,
  onViewOption,
  onViewTechDetail,
  showIntro = true,
}: GroupSectionProps) {
  return (
    <section className="space-y-5">
      {showIntro && (
        <>
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-navy">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-blue to-steel text-2xs font-bold text-white">
              {group.code}
            </span>
            {group.title}
          </h3>
          {group.inSimple && (
            <div className="flex gap-3 rounded-xl border border-line bg-white p-3.5 shadow-sm">
              <span className="text-xl">💡</span>
              <div>
                <span className="mb-0.5 block text-2xs font-bold uppercase tracking-wide text-slate">En simple</span>
                <p className="text-md leading-relaxed text-ink">{group.inSimple}</p>
              </div>
            </div>
          )}
          {group.intro && <p className="text-md leading-relaxed text-slate">{group.intro}</p>}
        </>
      )}

      {group.featureCards && <FeatureCardGrid cards={group.featureCards} />}

      {group.notes.length > 0 && (
        <div className="space-y-3">
          {group.notes.map((note, i) => (
            <NoteBlock key={i} note={note} />
          ))}
        </div>
      )}

      {group.techDetail && (
        <button
          type="button"
          onClick={onViewTechDetail}
          className="inline-flex min-h-11 items-center gap-1.5 -my-2 text-md font-semibold text-blue hover:underline"
        >
          {group.techDetail.summary}
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      <div>
        <p className="mb-3 text-xs text-slate">{group.hint}</p>
        <div role="radiogroup" aria-label={group.title} className="space-y-3">
          {group.options.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              selected={option.id === selectedOptionId}
              onSelect={() => onSelect(group.id, option.id)}
              onViewDetail={() => onViewOption(option.id)}
            />
          ))}
        </div>
      </div>

      {group.trailingNotes && (
        <div className="space-y-3">
          {group.trailingNotes.map((note, i) => (
            <NoteBlock key={i} note={note} />
          ))}
        </div>
      )}
    </section>
  );
}
