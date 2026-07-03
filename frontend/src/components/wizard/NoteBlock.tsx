import type { Note } from '@/types/proposal';

const TONE_CLASS: Record<Note['tone'], string> = {
  info: 'border-steel bg-blue-soft text-navy',
  warn: 'border-red bg-red-soft text-red',
  good: 'border-green bg-green-soft text-green',
  amber: 'border-amber-line bg-amber-soft text-amber',
};

export function NoteBlock({ note }: { note: Note }) {
  return (
    <div className={`rounded-r-lg border-l-[3px] p-3.5 text-md leading-relaxed ${TONE_CLASS[note.tone]}`}>
      <span className="mb-1 block text-2xs font-bold uppercase tracking-wide opacity-80">{note.label}</span>
      <span className="text-ink">{note.text}</span>
    </div>
  );
}
