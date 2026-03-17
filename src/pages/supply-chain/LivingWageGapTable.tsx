import { TrendingDown, TrendingUp, Minus, Users, DollarSign, Calendar } from 'lucide-react';

export interface WageCalculation {
  id: string;
  year: number;
  avgWageGapPct: number;
  annualFacilityLwgUsd: number;
  workersBelowLwPct: number;
  workersBelowLwCount: number;
  totalWorkers: number;
  lwBenchmarkUsd: number;
  lwEstimateUsd: number;
  genderGapPct: number;
  status: string;
}

interface Props {
  facilityId: string;
  facilityName: string;
}

function generateDemoCalculations(facilityId: string): WageCalculation[] {
  const seed = facilityId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const seededRandom = (n: number) => {
    const x = Math.sin(seed * 13 + n) * 10000;
    return x - Math.floor(x);
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  return years.map((year, i) => {
    const baseGap = 8 + seededRandom(i * 10) * 20;
    const improvementFactor = i * (2 + seededRandom(i * 11) * 3);
    const gap = Math.max(0, baseGap + improvementFactor);
    const totalWorkers = 150 + Math.floor(seededRandom(i * 12) * 350);
    const belowPct = 20 + seededRandom(i * 13) * 40 + i * 5;
    const belowCount = Math.floor((belowPct / 100) * totalWorkers);
    const benchmark = 350 + seededRandom(i * 14) * 200;
    const estimate = benchmark * (1 - gap / 100);

    return {
      id: `calc-${year}-${facilityId.slice(0, 8)}`,
      year,
      avgWageGapPct: Math.round(gap * 10) / 10,
      annualFacilityLwgUsd: Math.round((gap / 100) * totalWorkers * benchmark * 12),
      workersBelowLwPct: Math.round(belowPct * 10) / 10,
      workersBelowLwCount: belowCount,
      totalWorkers,
      lwBenchmarkUsd: Math.round(benchmark),
      lwEstimateUsd: Math.round(estimate),
      genderGapPct: Math.round((3 + seededRandom(i * 15) * 8) * 10) / 10,
      status: year === currentYear ? 'Draft' : 'Final',
    };
  });
}

function GapIndicator({ current, previous }: { current: number; previous?: number }) {
  if (previous === undefined) {
    return <Minus className="w-3.5 h-3.5 text-gray-300" />;
  }
  const diff = current - previous;
  if (Math.abs(diff) < 0.5) {
    return <Minus className="w-3.5 h-3.5 text-gray-400" />;
  }
  if (diff < 0) {
    return (
      <div className="flex items-center gap-1 text-emerald-600">
        <TrendingDown className="w-3.5 h-3.5" />
        <span className="text-[10px] font-semibold">{Math.abs(diff).toFixed(1)}%</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-rose-500">
      <TrendingUp className="w-3.5 h-3.5" />
      <span className="text-[10px] font-semibold">+{diff.toFixed(1)}%</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = status === 'Final'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
    : 'bg-amber-50 text-amber-700 border-amber-100';
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors}`}>
      {status}
    </span>
  );
}

export default function LivingWageGapTable({ facilityId }: Props) {
  const calculations = generateDemoCalculations(facilityId);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-gray-900 font-bold text-sm">Living Wage Gap Calculations</h3>
          <p className="text-gray-400 text-xs mt-0.5">Historical wage gap analysis by year</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Improving</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Worsening</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  Year
                </div>
              </th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                Avg Gap
              </th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                Trend
              </th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3" />
                  Annual Gap
                </div>
              </th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 h-3" />
                  Workers Below LW
                </div>
              </th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                LW Benchmark
              </th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                Gender Gap
              </th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {calculations.map((calc, idx) => {
              const previousCalc = calculations[idx + 1];
              return (
                <tr key={calc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-900">{calc.year}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-6 rounded-full ${
                        calc.avgWageGapPct < 10 ? 'bg-emerald-400' :
                        calc.avgWageGapPct < 20 ? 'bg-amber-400' : 'bg-rose-400'
                      }`} />
                      <span className="font-bold text-gray-800">{calc.avgWageGapPct}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <GapIndicator current={calc.avgWageGapPct} previous={previousCalc?.avgWageGapPct} />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-gray-700 font-medium">{formatCurrency(calc.annualFacilityLwgUsd)}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-medium">
                        {calc.workersBelowLwCount} / {calc.totalWorkers}
                      </span>
                      <span className="text-[10px] text-gray-400">{calc.workersBelowLwPct}% below</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-gray-700">${calc.lwBenchmarkUsd}/mo</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1 h-1 rounded-full ${
                        calc.genderGapPct < 5 ? 'bg-emerald-400' : 'bg-amber-400'
                      }`} />
                      <span className="text-gray-700">{calc.genderGapPct}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={calc.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 bg-gray-50/30 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Showing {calculations.length} calculations</span>
          <span>Last updated: {calculations[0]?.status === 'Draft' ? 'In progress' : 'Finalized'}</span>
        </div>
      </div>
    </div>
  );
}
