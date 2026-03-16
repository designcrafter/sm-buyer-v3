import { ReportsSummary, formatPct, formatNum } from './reportsAggregations';

interface KpiCardProps {
  value: string;
  label: string;
}

function KpiCard({ value, label }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 text-center">
      <p className="text-xs text-primary-600 font-medium mb-1 tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export function KpiCards({ summary }: { summary: ReportsSummary }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 print:grid-cols-6">
      <KpiCard label="Total Facilities" value={String(summary.totalFacilities)} />
      <KpiCard label="Facilities with a Gap" value={String(summary.facilitiesWithGap)} />
      <KpiCard label="Average Living Wage Gap" value={formatPct(summary.avgLivingWageGapPct)} />
      <KpiCard
        label="% Workers Below a Living Wage"
        value={formatPct(summary.workersBelowLwPct)}
      />
      <KpiCard label="Workers Below a Living Wage" value={formatNum(summary.workersBelowLwCount)} />
      <KpiCard label="Total Number of Workers" value={formatNum(summary.totalWorkers)} />
    </div>
  );
}
