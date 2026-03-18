import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useProducerStore } from '../../lib/producerStore';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
} from 'lucide-react';

export default function FacilityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allFacilities, producers } = useProducerStore();

  const facility = allFacilities.find(f => f.id === id);

  if (!facility) {
    return (
      <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-gray-500 text-sm">Facility not found.</p>
            <button
              onClick={() => navigate('/supply-chain')}
              className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
            >
              Back to Supply Chain
            </button>
          </div>
        </main>
      </div>
    );
  }

  const producer = producers.find(p => p.id === facility.producerId);
  const facilityCalculations = allFacilities.filter(f => f.facilityId === facility.facilityId);

  const getCalculationMetrics = (calc: typeof facility) => {
    const employeesCount = Math.floor(200 + Math.random() * 500);
    const percentageAboveLivingWage = Math.round(100 - calc.gapOverall);
    const avgGenderPayGap = Math.round(Math.abs(calc.gapFemale - calc.gapMale) * 10) / 10;
    const livingWageEstimate = `$${(450 + Math.random() * 200).toFixed(2)}`;

    const workersBelow = Math.floor(employeesCount * (calc.gapOverall / 100));
    const totalEmployees = employeesCount;
    const annualGap = `$${Math.floor(calc.gapOverall * 1000 + Math.random() * 5000)}K`;
    const lwBenchmark = livingWageEstimate.replace('$', '$') + '/mo';

    return {
      employeesCount,
      percentageAboveLivingWage,
      avgGenderPayGap,
      livingWageEstimate,
      workersBelow,
      totalEmployees,
      annualGap,
      lwBenchmark,
      currency: 'USD',
    };
  };

  const sortedCalculations = [...facilityCalculations].sort((a, b) => b.year - a.year);

  const getTrendIndicator = (currentGap: number, previousGap: number | null) => {
    if (previousGap === null) return null;
    const diff = currentGap - previousGap;
    const isImproving = diff < 0;
    const percentage = Math.abs(diff).toFixed(1);

    return {
      isImproving,
      percentage: `${isImproving ? '' : '+'}${percentage}%`,
      color: isImproving ? 'text-emerald-600' : 'text-red-600',
      icon: isImproving ? 'trending-down' : 'trending-up',
    };
  };

  const getStatusBadge = (phase: string) => {
    switch (phase) {
      case 'Final Report':
        return <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-emerald-600 text-white">Final</span>;
      case 'Draft Report':
        return <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">Draft</span>;
      default:
        return <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-gray-200 text-gray-500">{phase}</span>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-6xl mx-auto space-y-6">
          <button
            onClick={() => navigate('/supply-chain')}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Supply Chain
          </button>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7 text-primary-600" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{facility.name}</h1>
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Globe className="w-4 h-4 text-gray-300" strokeWidth={1.75} />
                    <span className="mr-1">{facility.flag}</span>
                    {facility.country}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-gray-300" strokeWidth={1.75} />
                    {facility.region}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Building2 className="w-4 h-4 text-gray-300" strokeWidth={1.75} />
                    {facility.sector}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Living Wage Analysis by Year</h2>
            </div>

            <div className="divide-y divide-gray-100">
              {sortedCalculations.map((calc, index) => {
                const metrics = getCalculationMetrics(calc);

                return (
                  <div key={calc.id} className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">{calc.year}</h3>
                      <span className="text-sm text-gray-500">Currency: {metrics.currency}</span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-gray-400" strokeWidth={1.75} />
                          <span className="text-xs font-medium text-gray-500">Living Wage Estimate</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{metrics.livingWageEstimate}</p>
                        <p className="text-xs text-gray-400 mt-1">per month</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-gray-400" strokeWidth={1.75} />
                          <span className="text-xs font-medium text-gray-500">Number of Employees</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{metrics.employeesCount.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">total workforce</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
                          <span className="text-xs font-medium text-gray-500">At or Above Living Wage</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{metrics.percentageAboveLivingWage}%</p>
                        <p className="text-xs text-gray-400 mt-1">of employees</p>
                      </div>

                      {calc.gapOverall > 0 && (
                        <div className="bg-amber-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-5 h-5 text-amber-400" strokeWidth={1.75} />
                            <span className="text-xs font-medium text-amber-700">Living Wage Gap</span>
                          </div>
                          <p className="text-2xl font-bold text-amber-900">{calc.gapOverall}%</p>
                          <p className="text-xs text-amber-600 mt-1">below living wage</p>
                        </div>
                      )}

                      {metrics.avgGenderPayGap > 0 && (
                        <div className="bg-blue-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-blue-400" strokeWidth={1.75} />
                            <span className="text-xs font-medium text-blue-700">Avg Gender Pay Gap</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-900">{metrics.avgGenderPayGap}%</p>
                          <p className="text-xs text-blue-600 mt-1">difference</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Living Wage Gap Calculations</h2>
              <p className="text-sm text-gray-400 mt-1">Historical wage gap analysis by year</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        YEAR
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">AVG GAP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">TREND</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5" />
                        ANNUAL GAP
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" />
                        WORKERS BELOW LW
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">LW BENCHMARK</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">GENDER GAP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sortedCalculations.map((calc, index) => {
                    const metrics = getCalculationMetrics(calc);
                    const previousCalc = sortedCalculations[index + 1];
                    const trend = getTrendIndicator(calc.gapOverall, previousCalc?.gapOverall ?? null);
                    const barColor = calc.gapOverall > 20 ? 'bg-red-400' : 'bg-amber-400';

                    return (
                      <tr key={calc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-900">{calc.year}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: barColor.replace('bg-', '#').replace('400', '') }}></div>
                            <span className="text-sm font-bold text-gray-900">{calc.gapOverall}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {trend ? (
                            <div className={`flex items-center gap-1 text-xs font-semibold ${trend.color}`}>
                              {trend.isImproving ? (
                                <TrendingDown className="w-3.5 h-3.5" strokeWidth={2} />
                              ) : (
                                <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
                              )}
                              {trend.percentage}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-gray-700">{metrics.annualGap}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{metrics.workersBelow} / {metrics.totalEmployees}</span>
                            <p className="text-xs text-gray-400 mt-0.5">{((metrics.workersBelow / metrics.totalEmployees) * 100).toFixed(1)}% below</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-gray-700">{metrics.lwBenchmark}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${metrics.avgGenderPayGap > 5 ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                            <span className="text-sm font-medium text-gray-700">{metrics.avgGenderPayGap}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(calc.phase)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <span>Showing {sortedCalculations.length} calculations</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Improving</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span>Worsening</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-gray-900 font-bold text-sm">Details</h3>
            </div>
            <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Data Consent</p>
                <p className="text-sm text-gray-800 font-medium mt-0.5">
                  {facility.consentType === 'full' ? 'Full Data' : 'Aggregated'}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Audited</p>
                <p className="text-sm text-gray-800 font-medium mt-0.5">
                  {facility.audited ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">SM Status</p>
                <p className="text-sm text-gray-800 font-medium mt-0.5 capitalize">
                  {facility.salaryMatrixStatus.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Last Updated</p>
                <p className="text-sm text-gray-800 font-medium mt-0.5">{facility.lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
