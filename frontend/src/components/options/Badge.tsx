import type { BadgeInfo } from '@/types/proposal';

const TONE_CLASSES: Record<BadgeInfo['tone'], string> = {
  recommended: 'bg-green text-white',
  eco: 'bg-amber text-white',
  pro: 'bg-steel text-white',
  warn: 'bg-red text-white',
};

export function Badge({ badge }: { badge: BadgeInfo }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wide ${TONE_CLASSES[badge.tone]}`}
    >
      {badge.label}
    </span>
  );
}
