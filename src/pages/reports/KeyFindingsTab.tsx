import { WageCalculation } from '../../lib/reportsData';
import {
  ReportsSummary,
  computeGapDistribution,
  formatNum,
} from './reportsAggregations';
import { KpiCards } from './KpiCards';

interface Props {
  data: WageCalculation[];
  summary: ReportsSummary;
}

function DonutChart({ summary }: { summary: ReportsSummary }) {
  const total = summary.totalWorkers;
  const below = summary.workersBelowLwCount;
  const above = total - below;
  const belowPct = total > 0 ? (below / total) * 100 : 0;
  const abovePct = total > 0 ? (above / total) * 100 : 0;

  const radius = 70;
  const stroke = 28;
  const circumference = 2 * Math.PI * radius;
  const aboveArc = (abovePct / 100) * circumference;
  const belowArc = (belowPct / 100) * circumference;

  const totalWomen = summary.workersAboveLwWomen + summary.workersBelowLwWomen;
  const totalMen = summary.workersAboveLwMen + summary.workersBelowLwMen;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-1">Share of Workers Earning a Living Wage</h3>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
          <span className="text-xs text-gray-500">Workers Above a Living Wage</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-xs text-gray-500">Workers Below a Living Wage</span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke="#e5e7eb" strokeWidth={stroke}
          />
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="#347774"
            strokeWidth={stroke}
            strokeDasharray={`${aboveArc} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="butt"
            transform="rotate(-90 100 100)"
            className="transition-all duration-700"
          />
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={stroke}
            strokeDasharray={`${belowArc} ${circumference}`}
            strokeDashoffset={-aboveArc}
            strokeLinecap="butt"
            transform="rotate(-90 100 100)"
            className="transition-all duration-700"
          />
          <text x="100" y="94" textAnchor="middle" className="fill-gray-800 text-lg font-bold" fontSize="18">
            {abovePct.toFixed(1)}%
          </text>
          <text x="100" y="114" textAnchor="middle" className="fill-gray-400 text-[10px]" fontSize="10">
            above LW
          </text>
        </svg>
      </div>

      <div className="text-center mb-5">
        <span className="text-xs text-amber-600 font-semibold">{belowPct.toFixed(1)}%</span>
        <span className="text-xs text-gray-400 ml-1">below a Living Wage</span>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 font-semibold text-gray-500">Gender</th>
            <th className="text-right py-2 font-semibold text-primary-600">Above a Living Wage</th>
            <th className="text-right py-2 font-semibold text-amber-600">Below a Living Wage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          <tr>
            <td className="py-2 text-gray-700 font-medium">Women</td>
            <td className="py-2 text-right text-gray-700">{formatNum(summary.workersAboveLwWomen)}</td>
            <td className="py-2 text-right text-gray-700">{formatNum(summary.workersBelowLwWomen)}</td>
          </tr>
          <tr>
            <td className="py-2 text-gray-700 font-medium">Men</td>
            <td className="py-2 text-right text-gray-700">{formatNum(summary.workersAboveLwMen)}</td>
            <td className="py-2 text-right text-gray-700">{formatNum(summary.workersBelowLwMen)}</td>
          </tr>
          <tr className="border-t border-gray-200">
            <td className="py-2 text-gray-900 font-bold">Total</td>
            <td className="py-2 text-right text-gray-900 font-bold">
              {formatNum(totalWomen + totalMen - summary.workersBelowLwWomen - summary.workersBelowLwMen)}
            </td>
            <td className="py-2 text-right text-gray-900 font-bold">
              {formatNum(summary.workersBelowLwWomen + summary.workersBelowLwMen)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function GapDistributionChart({ data }: { data: WageCalculation[] }) {
  const buckets = computeGapDistribution(data);
  const maxCount = Math.max(...buckets.map(b => b.count), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-1">Number Workers by Living Wage Gap Size</h3>
      <p className="text-xs text-gray-400 mb-6">
        Workers grouped by how far below the Living Wage Estimate their remuneration falls
      </p>

      <div className="flex items-end gap-2 h-56">
        {buckets.map((bucket, i) => {
          const heightPct = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;
          const isLargest = bucket.count === maxCount && bucket.count > 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <span className={`text-[10px] font-bold ${bucket.count > 0 ? 'text-gray-700' : 'text-gray-300'}`}>
                {formatNum(bucket.count)}
              </span>
              <div
                className={`w-full rounded-t transition-all duration-500 ${
                  isLargest ? 'bg-amber-500' : 'bg-primary-400'
                }`}
                style={{ height: `${Math.max(heightPct, bucket.count > 0 ? 2 : 0)}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-2 border-t border-gray-100 pt-2">
        {buckets.map((bucket, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[9px] text-gray-500 leading-tight block">{bucket.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KeyFindingsTab({ data, summary }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center">
        <p className="text-gray-400 text-sm">No data matches your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <KpiCards summary={summary} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <DonutChart summary={summary} />
        <GapDistributionChart data={data} />
      </div>
    </div>
  );
}
