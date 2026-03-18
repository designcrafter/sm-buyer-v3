import { ReportsSummary, formatPct, formatNum } from './reportsAggregations';

interface KpiCardProps {
  value: string;
  label: string;
  threshold?: {
    value: number;
    currentValue: number;
    formatter: (val: number) => string;
  };
}

function KpiCard({ value, label, threshold }: KpiCardProps) {
  const isAboveThreshold = threshold && threshold.currentValue > threshold.value;

  return (
    <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 text-center">
      <p className={`text-xs font-medium mb-1 tracking-wide ${
        isAboveThreshold ? 'text-red-600' : 'text-primary-600'
      }`}>
        {label}
      </p>
      <p className={`text-2xl font-bold ${
        isAboveThreshold ? 'text-red-600' : 'text-gray-900'
      }`}>
        {value}
      </p>
      {threshold && (
        <p className="text-xs text-gray-400 mt-2">
          Threshold: {threshold.formatter(threshold.value)}
        </p>
      )}
    </div>
  );
}

export function KpiCards({ summary }: { summary: ReportsSummary }) {
  // Hardcoded thresholds
  const WORKERS_BELOW_LW_THRESHOLD = 10000;
  const PERCENT_BELOW_LW_THRESHOLD = 70;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 print:grid-cols-6">
      <KpiCard label="Total Facilities" value={String(summary.totalFacilities)} />
      <KpiCard label="Facilities with a Gap" value={String(summary.facilitiesWithGap)} />
      <KpiCard label="Average Living Wage Gap" value={formatPct(summary.avgLivingWageGapPct)} />
      <KpiCard
        label="% Workers Below a Living Wage"
        value={formatPct(summary.workersBelowLwPct)}
        threshold={{
          value: PERCENT_BELOW_LW_THRESHOLD,
          currentValue: summary.workersBelowLwPct,
          formatter: (val) => `${val}%`,
        }}
      />
      <KpiCard
        label="Workers Below a Living Wage"
        value={formatNum(summary.workersBelowLwCount)}
        threshold={{
          value: WORKERS_BELOW_LW_THRESHOLD,
          currentValue: summary.workersBelowLwCount,
          formatter: formatNum,
        }}
      />
      <KpiCard label="Total Number of Workers" value={formatNum(summary.totalWorkers)} />
    </div>
  );
}
