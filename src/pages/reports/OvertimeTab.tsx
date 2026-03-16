import { WageCalculation } from '../../lib/reportsData';
import { formatPct } from './reportsAggregations';

interface Props {
  data: WageCalculation[];
}

function OvertimeKpis({ data }: Props) {
  const avgRegW = data.length > 0 ? data.reduce((s, c) => s + c.regular_hours_women, 0) / data.length : 0;
  const avgOtW = data.length > 0 ? data.reduce((s, c) => s + c.overtime_hours_women, 0) / data.length : 0;
  const avgRegM = data.length > 0 ? data.reduce((s, c) => s + c.regular_hours_men, 0) / data.length : 0;
  const avgOtM = data.length > 0 ? data.reduce((s, c) => s + c.overtime_hours_men, 0) / data.length : 0;

  const cards = [
    { label: 'Avg Regular Hours (Women)', value: avgRegW.toFixed(0) },
    { label: 'Avg Overtime Hours (Women)', value: avgOtW.toFixed(0) },
    { label: 'Avg Regular Hours (Men)', value: avgRegM.toFixed(0) },
    { label: 'Avg Overtime Hours (Men)', value: avgOtM.toFixed(0) },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(c => (
        <div key={c.label} className="bg-white rounded-xl border border-gray-100 px-5 py-4 text-center">
          <p className="text-xs text-primary-600 font-medium mb-1">{c.label}</p>
          <p className="text-2xl font-bold text-gray-900">{c.value}h</p>
        </div>
      ))}
    </div>
  );
}

function OvertimeByGenderChart({ data }: Props) {
  const byCountry = new Map<string, { flag: string; regW: number; otW: number; regM: number; otM: number; count: number }>();
  for (const c of data) {
    if (!byCountry.has(c.country)) {
      byCountry.set(c.country, { flag: c.flag, regW: 0, otW: 0, regM: 0, otM: 0, count: 0 });
    }
    const e = byCountry.get(c.country)!;
    e.regW += c.regular_hours_women;
    e.otW += c.overtime_hours_women;
    e.regM += c.regular_hours_men;
    e.otM += c.overtime_hours_men;
    e.count += 1;
  }

  const rows = Array.from(byCountry.entries()).map(([country, v]) => ({
    country,
    flag: v.flag,
    regW: v.regW / v.count,
    otW: v.otW / v.count,
    regM: v.regM / v.count,
    otM: v.otM / v.count,
  })).sort((a, b) => (b.otW + b.otM) - (a.otW + a.otM));

  const maxHours = Math.max(...rows.map(r => Math.max(r.regW + r.otW, r.regM + r.otM)), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-1">Distribution of Regular and Overtime Hours by Gender</h3>
      <p className="text-xs text-gray-400 mb-4">Average monthly hours per country</p>

      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
          <span className="text-xs text-gray-500">Regular (Women)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary-300" />
          <span className="text-xs text-gray-500">Overtime (Women)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
          <span className="text-xs text-gray-500">Regular (Men)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          <span className="text-xs text-gray-500">Overtime (Men)</span>
        </div>
      </div>

      <div className="space-y-4">
        {rows.map(row => (
          <div key={row.country}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm leading-none">{row.flag}</span>
              <span className="text-xs font-medium text-gray-700">{row.country}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400 w-10 shrink-0">Women</span>
                <div className="flex-1 flex h-4 rounded overflow-hidden bg-gray-50">
                  <div
                    className="bg-primary-500 h-full transition-all duration-500"
                    style={{ width: `${(row.regW / maxHours) * 100}%` }}
                  />
                  <div
                    className="bg-primary-300 h-full transition-all duration-500"
                    style={{ width: `${(row.otW / maxHours) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 w-12 shrink-0 text-right">
                  {row.regW.toFixed(0)}+{row.otW.toFixed(0)}h
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400 w-10 shrink-0">Men</span>
                <div className="flex-1 flex h-4 rounded overflow-hidden bg-gray-50">
                  <div
                    className="bg-gray-500 h-full transition-all duration-500"
                    style={{ width: `${(row.regM / maxHours) * 100}%` }}
                  />
                  <div
                    className="bg-gray-300 h-full transition-all duration-500"
                    style={{ width: `${(row.otM / maxHours) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 w-12 shrink-0 text-right">
                  {row.regM.toFixed(0)}+{row.otM.toFixed(0)}h
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OvertimeByGapChart({ data }: Props) {
  const rows = data
    .map(c => ({
      facilityName: c.facility_name,
      facilityId: c.facility_id,
      country: c.country,
      flag: c.flag,
      year: c.year,
      totalOtWomen: c.overtime_hours_women,
      totalOtMen: c.overtime_hours_men,
      avgWageGapPct: c.avg_wage_gap_pct,
    }))
    .sort((a, b) => b.avgWageGapPct - a.avgWageGapPct);

  const maxOt = Math.max(...rows.map(r => Math.max(r.totalOtWomen, r.totalOtMen)), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-1">Overtime Hours by Living Wage Gap</h3>
      <p className="text-xs text-gray-400 mb-4">Facilities ordered by gap size, showing overtime hours</p>

      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary-400" />
          <span className="text-xs text-gray-500">Women OT hours</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
          <span className="text-xs text-gray-500">Men OT hours</span>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-32 shrink-0">
              <p className="text-xs font-medium text-gray-700 truncate">{row.facilityName}</p>
              <p className="text-[10px] text-gray-400">Gap: {formatPct(row.avgWageGapPct)}</p>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-3 bg-gray-50 rounded overflow-hidden">
                  <div
                    className="bg-primary-400 h-full rounded transition-all duration-500"
                    style={{ width: `${(row.totalOtWomen / maxOt) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 w-8 shrink-0 text-right">{row.totalOtWomen}h</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-3 bg-gray-50 rounded overflow-hidden">
                  <div
                    className="bg-gray-400 h-full rounded transition-all duration-500"
                    style={{ width: `${(row.totalOtMen / maxOt) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 w-8 shrink-0 text-right">{row.totalOtMen}h</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OvertimeTable({ data }: Props) {
  const rows = data
    .map(c => ({
      facilityName: c.facility_name,
      facilityId: c.facility_id,
      country: c.country,
      flag: c.flag,
      year: c.year,
      regW: c.regular_hours_women,
      otW: c.overtime_hours_women,
      regM: c.regular_hours_men,
      otM: c.overtime_hours_men,
      gap: c.avg_wage_gap_pct,
    }))
    .sort((a, b) => (b.otW + b.otM) - (a.otW + a.otM));

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h3 className="text-sm font-bold text-gray-900">Overtime Detail by Facility</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-400">Facility</th>
              <th className="px-3 py-3 text-left text-[11px] font-medium text-gray-400">Country</th>
              <th className="px-3 py-3 text-left text-[11px] font-medium text-gray-400">Year</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-gray-400">Reg. (W)</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-gray-400">OT (W)</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-gray-400">Reg. (M)</th>
              <th className="px-3 py-3 text-right text-[11px] font-medium text-gray-400">OT (M)</th>
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
                <td className="px-3 py-3 text-xs text-right text-gray-700">{r.regW}h</td>
                <td className="px-3 py-3 text-xs text-right text-gray-700">{r.otW}h</td>
                <td className="px-3 py-3 text-xs text-right text-gray-700">{r.regM}h</td>
                <td className="px-3 py-3 text-xs text-right text-gray-700">{r.otM}h</td>
                <td className="px-3 py-3 text-xs text-right font-semibold text-gray-800">{formatPct(r.gap)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OvertimeTab({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center">
        <p className="text-gray-400 text-sm">No data matches your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <OvertimeKpis data={data} />
      <OvertimeByGenderChart data={data} />
      <OvertimeByGapChart data={data} />
      <OvertimeTable data={data} />
    </div>
  );
}
