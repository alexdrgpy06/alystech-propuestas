import type { ComparisonMatrix } from '@/types/proposal';

const TONE_CLASS: Record<'y' | 'n' | 'p', string> = {
  y: 'text-green font-bold',
  n: 'text-red',
  p: 'text-amber-line font-bold',
};

export function ComparisonMatrixTable({ matrix }: { matrix: ComparisonMatrix }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[13px] font-bold text-navy">{matrix.title}</h4>
      {matrix.intro && <p className="text-[12.5px] text-slate">{matrix.intro}</p>}
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[420px] border-collapse text-[12px]">
          <thead>
            <tr className="bg-navy text-white">
              {matrix.headers.map((h, i) => (
                <th key={i} className="whitespace-nowrap px-2.5 py-2 text-left text-[11px] font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row, i) => (
              <tr key={i} className="border-t border-line-soft">
                <td className="bg-bg px-2.5 py-2 font-semibold text-navy">{row.label}</td>
                {row.cells.map((cell, j) => (
                  <td key={j} className={`px-2.5 py-2 text-center text-ink ${cell.tone ? TONE_CLASS[cell.tone] : ''}`}>
                    {cell.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {matrix.footnote && <p className="text-[11.5px] italic text-slate">{matrix.footnote}</p>}
    </div>
  );
}
