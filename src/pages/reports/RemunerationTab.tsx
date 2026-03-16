import { WageCalculation } from '../../lib/reportsData';
import { formatPct } from './reportsAggregations';

interface Props {
  data: WageCalculation[];
}

function RemunerationKpis({ data }: Props) {
  const avg = (key: keyof WageCalculation) =>
    data.length > 0 ? data.reduce((s, c) => s + (c[key] as number), 0) / data.length : 0;

  const cards = [
    { label: 'Avg Base Wage', value: formatPct(avg('base_wage_pct')) },
    { label: 'Avg Bonuses', value: formatPct(avg('bonuses_pct')) },
    { label: 'Avg In-Kind', value: formatPct(avg('in_kind_pct')) },
    { label: 'Avg Overtime Pay', value: formatPct(avg('overtime_pay_pct')) },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(c => (
        <div key={c.label} className="bg-white rounded-xl border border-gray-100 px-5 py-4 text-center">
          <p className="text-xs text-primary-600 font-medium mb-1">{c.label}</p>
          <p className="text-2xl font-bold text-gray-900">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

const COMP_COLORS = [
  { key: 'base_wage_pct' as const, label: 'Base Wage', color: 'bg-primary-500' },
  { key: 'bonuses_pct' as const, label: 'Bonuses', color: 'bg-primary-300' },
  { key: 'in_kind_pct' as const, label: 'In-Kind Benefits', color: 'bg-amber-400' },
  { key: 'overtime_pay_pct' as const, label: 'Overtime Pay', color: 'bg-gray-400' },
];

function CompositionChart({ data }: Props) {
  const byFacility = new Map<string, { name: string; country: string; flag: string; year: number; base: number; bonus: number; inkind: number; ot: number }>();
  for (const c of data) {
    const key = `${c.facility_id}-${c.year}`;
    byFacility.set(key, {
      name: c.facility_name, country: c.country, flag: c.flag, year: c.year,
      base: c.base_wage_pct, bonus: c.bonuses_pct, inkind: c.in_kind_pct, ot: c.overtime_pay_pct,
    });
  }
  const rows = Array.from(byFacility.values()).sort((a, b) => b.base - a.base);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-1">Composition of Total Remuneration</h3>
      <p className="text-xs text-gray-400 mb-4">Breakdown of pay components per facility</p>

      <div className="flex items-center gap-4 mb-5">
        {COMP_COLORS.map(cc => (
          <div key={cc.key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${cc.color}`} />
            <span className="text-xs text-gray-500">{cc.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-36 shrink-0">
              <p className="text-xs font-medium text-gray-700 truncate">{row.name}</p>
              <p className="text-[10px] text-gray-400">{row.flag} {row.country} &middot; {row.year}</p>
            </div>
            <div className="flex-1 flex h-5 rounded overflow-hidden">
              <div className="bg-primary-500 h-full transition-all duration-500" style={{ width: `${row.base}%` }} />
              <div className="bg-primary-300 h-full transition-all duration-500" style={{ width: `${row.bonus}%` }} />
              <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${row.inkind}%` }} />
              <div className="bg-gray-400 h-full transition-all duration-500" style={{ width: `${row.ot}%` }} />
            </div>
            <div className="w-12 shrink-0 text-right text-[10px] text-gray-500">
              {row.base}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RemunerationTable({ data }: Props) {
  const rows = data
    .map(c => ({
      facilityName: c.facility_name,
      facilityId: c.facility_id,
      country: c.country,
      flag: c.flag,
      year: c.year,
      base: c.base_wage_pct,
      bonus: c.bonuses_pct,
      inkind: c.in_kind_pct,
      ot: c.overtime_pay_pct,
      gap: c.avg_wage_gap_pct,
    }))
    .sort((a, b) => a.base - b.base);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h3 className="text-sm font-bold text-gray-900">Remuneration Detail by Facility</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-400">Facility</th>
              <th className="px-3 py-3 text-left text-[11px] font-medium text-gray-400">Country</th>
              <th className="px-3 py-3 text-left text-[11px] font-medium text-gray-400">Year</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-gray-400">Base Wage</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-gray-400">Bonuses</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-gray-400">In-Kind</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-gray-400">Overtime Pay</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-gray-400">LW Gap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3">
                  <p className="text-xs font-semibold text-gray-800">{r.facilityName}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{r.facilityId}</p>
                </td>
                <td className="px-3 py-3">
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <span>{r.flag}</span>{r.country}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs text-gray-600">{r.year}</td>
                <td className="px-3 py-3 text-xs text-right text-gray-700">{r.base}%</td>
                <td className="px-3 py-3 text-xs text-right text-gray-700">{r.bonus}%</td>
                <td className="px-3 py-3 text-xs text-right text-gray-700">{r.inkind}%</td>
                <td className="px-3 py-3 text-xs text-right text-gray-700">{r.ot}%</td>
                <td className="px-3 py-3 text-xs text-right font-semibold text-gray-800">{formatPct(r.gap)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RemunerationTab({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center">
        <p className="text-gray-400 text-sm">No data matches your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <RemunerationKpis data={data} />
      <CompositionChart data={data} />
      <RemunerationTable data={data} />
    </div>
  );
}
