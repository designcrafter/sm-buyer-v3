import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Globe, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useProducerStore } from '../../lib/producerStore';

export default function ProducerFacilityDetailPage() {
  const navigate = useNavigate();
  const { facilityId } = useParams();
  const { allFacilities } = useProducerStore();

  const facilityCalculations = allFacilities.filter(f => f.facilityId === facilityId);

  if (facilityCalculations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Facility not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const facility = facilityCalculations[0];
  const producerId = facility.producerId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <button
          onClick={() => navigate(`/producers/${producerId}`)}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {facility.producerName}
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
            {facilityCalculations.map((calc) => {
              const employeesCount = Math.floor(200 + Math.random() * 500);
              const percentageAboveLivingWage = Math.round(100 - calc.gapOverall);
              const avgGenderPayGap = Math.round(Math.abs(calc.gapFemale - calc.gapMale) * 10) / 10;
              const livingWageEstimate = `$${(450 + Math.random() * 200).toFixed(2)}`;
              const currency = 'USD';

              return (
                <div key={calc.id} className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{calc.year}</h3>
                    <span className="text-sm text-gray-500">Currency: {currency}</span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-gray-400" strokeWidth={1.75} />
                        <span className="text-xs font-medium text-gray-500">Living Wage Estimate</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{livingWageEstimate}</p>
                      <p className="text-xs text-gray-400 mt-1">per month</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-gray-400" strokeWidth={1.75} />
                        <span className="text-xs font-medium text-gray-500">Number of Employees</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{employeesCount.toLocaleString()}</p>
                      <p className="text-xs text-gray-400 mt-1">total workforce</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
                        <span className="text-xs font-medium text-gray-500">At or Above Living Wage</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{percentageAboveLivingWage}%</p>
                      <p className="text-xs text-gray-400 mt-1">of employees</p>
                    </div>

                    {calc.gapOverall > 0 && (
                      <div className="bg-amber-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-amber-400" strokeWidth={1.75} />
                          <span className="text-xs font-medium text-amber-700">Living Wage Gap</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-900">{calc.gapOverall}%</p>
                        <p className="text-xs text-amber-600 mt-1">below living wage</p>
                      </div>
                    )}

                    {avgGenderPayGap > 0 && (
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-blue-400" strokeWidth={1.75} />
                          <span className="text-xs font-medium text-blue-700">Avg Gender Pay Gap</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">{avgGenderPayGap}%</p>
                        <p className="text-xs text-blue-600 mt-1">difference</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
