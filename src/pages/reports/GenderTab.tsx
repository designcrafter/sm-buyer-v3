import { WageCalculation } from '../../lib/reportsData';
import { formatPct, formatNum } from './reportsAggregations';

interface Props {
  data: WageCalculation[];
}

function GenderKpis({ data }: Props) {
  const countries = new Set(data.map(c => c.country)).size;
  const avgGap = data.length > 0 ? data.reduce((s, c) => s + c.avg_wage_gap_pct, 0) / data.length : 0;
  const avgGapFemale = data.length > 0
    ? data.reduce((s, c) => {
        const totalW = c.workers_above_lw_women + c.workers_below_lw_women;
        return s + (totalW > 0 ? (c.workers_below_lw_women / totalW) * c.avg_wage_gap_pct : 0);
      }, 0) / data.length
    : 0;
  const avgGapMale = data.length > 0
    ? data.reduce((s, c) => {
        const totalM = c.workers_above_lw_men + c.workers_below_lw_men;
        return s + (totalM > 0 ? (c.workers_below_lw_men / totalM) * c.avg_wage_gap_pct : 0);
      }, 0) / data.length
    : 0;

  const cards = [
    { label: 'Number of countries', value: String(countries) },
    { label: 'Average gap', value: formatPct(avgGap) },
    { label: 'Average gap female', value: formatPct(avgGapFemale) },
    { label: 'Average gap male', value: formatPct(avgGapMale) },
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

function WorkforceDistributionChart({ data }: Props) {
  const byCountry = new Map<string, { flag: string; women: number; men: number }>();
  for (const c of data) {
    if (!byCountry.has(c.country)) byCountry.set(c.country, { flag: c.flag, women: 0, men: 0 });
    const entry = byCountry.get(c.country)!;
    entry.women += c.workers_above_lw_women + c.workers_below_lw_women;
    entry.men += c.workers_above_lw_men + c.workers_below_lw_men;
  }
  const rows = Array.from(byCountry.entries())
    .map(([country, v]) => ({ country, ...v, total: v.women + v.men }))
    .sort((a, b) => b.total - a.total);

  const maxTotal = Math.max(...rows.map(r => r.total), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-1">Workforce Distribution by Gender</h3>
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
          <span className="text-xs text-gray-500">Women</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
          <span className="text-xs text-gray-500">Men</span>
        </div>
      </div>
      <div className="space-y-3">
        {rows.map(row => {
          const wPct = (row.women / maxTotal) * 100;
          const mPct = (row.men / maxTotal) * 100;
          return (
            <div key={row.country} className="flex items-center gap-3">
              <div className="w-28 shrink-0 flex items-center gap-1.5">
                <span className="text-sm leading-none">{row.flag}</span>
                <span className="text-xs font-medium text-gray-700 truncate">{row.country}</span>
              </div>
              <div className="flex-1 flex gap-0.5 h-5">
                <div
                  className="bg-primary-400 rounded-l h-full transition-all duration-500"
                  style={{ width: `${wPct}%` }}
                />
                <div
                  className="bg-gray-300 rounded-r h-full transition-all duration-500"
                  style={{ width: `${mPct}%` }}
                />
              </div>
              <div className="w-24 shrink-0 text-right">
                <span className="text-[10px] text-gray-500">
                  {formatNum(row.women)} / {formatNum(row.men)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GenderGapTable({ data }: Props) {
  const rows = data
    .map(c => ({
      facilityName: c.facility_name,
      facilityId: c.facility_id,
      country: c.country,
      flag: c.flag,
      year: c.year,
      aboveWomen: c.workers_above_lw_women,
      belowWomen: c.workers_below_lw_women,
      aboveMen: c.workers_above_lw_men,
      belowMen: c.workers_below_lw_men,
      genderGapPct: c.gender_gap_pct,
    }))
    .sort((a, b) => b.genderGapPct - a.genderGapPct);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h3 className="text-sm font-bold text-gray-900">Gender Breakdown by Facility</h3>
        <p className="text-xs text-gray-400 mt-0.5">Workers above and below a Living Wage by gender</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-400">Facility</th>
              <th className="px-3 py-3 text-left text-[11px] font-medium text-gray-400">Country</th>
              <th className="px-3 py-3 text-left text-[11px] font-medium text-gray-400">Year</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-primary-600">Women Above</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-amber-600">Women Below</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-primary-600">Men Above</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-amber-600">Men Below</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-gray-400">Gender Gap</th>
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
                    <span>{r.flag}</span>
                    {r.country}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs text-gray-600">{r.year}</td>
                <td className="px-3 py-3 text-xs text-right text-gray-700">{formatNum(r.aboveWomen)}</td>
                <td className="px-3 py-3 text-xs text-right text-gray-700">{formatNum(r.belowWomen)}</td>
                <td className="px-3 py-3 text-xs text-right text-gray-700">{formatNum(r.aboveMen)}</td>
                <td className="px-3 py-3 text-xs text-right text-gray-700">{formatNum(r.belowMen)}</td>
                <td className="px-3 py-3 text-xs text-right font-semibold text-gray-800">
                  {formatPct(r.genderGapPct)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function GenderTab({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center">
        <p className="text-gray-400 text-sm">No data matches your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <GenderKpis data={data} />
      <WorkforceDistributionChart data={data} />
      <GenderGapTable data={data} />
    </div>
  );
}
