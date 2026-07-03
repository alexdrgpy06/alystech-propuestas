import type { ComparisonMatrix } from '@/types/proposal';

const TONE_CLASS: Record<'y' | 'n' | 'p', string> = {
  y: 'bg-positive-soft text-positive font-bold rounded px-2 py-1',
  n: 'text-slate-400 font-medium',
  p: 'bg-amber-100 text-amber-line font-bold rounded px-2 py-1',
};

export function ComparisonMatrixTable({ matrix }: { matrix: ComparisonMatrix }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-md font-bold text-navy">{matrix.title}</h4>
        {matrix.intro && <p className="text-sm text-slate mt-1">{matrix.intro}</p>}
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-line-soft shadow-xs">
        <table className="w-full min-w-[500px] border-collapse text-xs">
          <thead>
            <tr className="bg-navy-2 text-white">
              {matrix.headers.map((h, i) => (
                <th key={i} className={`whitespace-nowrap px-4 py-3 text-left font-bold tracking-wide uppercase ${i === 0 ? 'bg-navy w-[40%]' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row, i) => (
              <tr key={i} className="border-t border-line hover:bg-slate-50/50 transition-colors">
                <td className="bg-bg px-4 py-3 font-semibold text-navy border-r border-line/50 leading-snug">{row.label}</td>
                {row.cells.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-center align-middle">
                    <span className={`inline-block text-ink ${cell.tone ? TONE_CLASS[cell.tone] : ''}`}>
                      {cell.value}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {matrix.footnote && <p className="text-xs italic text-slate/80">{matrix.footnote}</p>}
    </div>
  );
}
