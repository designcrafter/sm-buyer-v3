import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useProducerStore } from '../../lib/producerStore';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  Lock,
  CheckCircle2,
  Circle,
  ChevronRight,
} from 'lucide-react';

const PHASE_STEPS = [
  'Training',
  'Submission',
  'Draft Report',
  'Audit Verification',
  'Final Report',
];

export default function IntermediaryFacilityDetailPage() {
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
              onClick={() => navigate('/intermediary/supply-chain')}
              className="text-teal-600 hover:text-teal-700 text-sm font-semibold"
            >
              Back to Supply Chain
            </button>
          </div>
        </main>
      </div>
    );
  }

  const producer = producers.find(p => p.id === facility.producerId);
  const currentPhaseIndex = PHASE_STEPS.indexOf(facility.phase);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-6xl mx-auto space-y-6">
          <button
            onClick={() => navigate('/intermediary/supply-chain')}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Supply Chain
          </button>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7 text-teal-600" strokeWidth={1.75} />
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
              <h2 className="text-lg font-semibold text-gray-900">Submission Progress</h2>
              <p className="text-sm text-gray-400 mt-1">Current phase: {facility.phase}</p>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-200">
                  <div
                    className="h-full bg-teal-500 transition-all duration-500"
                    style={{ width: `${(currentPhaseIndex / (PHASE_STEPS.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="relative flex items-start justify-between">
                  {PHASE_STEPS.map((step, index) => {
                    const isCompleted = index < currentPhaseIndex;
                    const isCurrent = index === currentPhaseIndex;
                    const isPending = index > currentPhaseIndex;

                    return (
                      <div key={step} className="flex flex-col items-center" style={{ width: '20%' }}>
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-teal-500 border-teal-500'
                              : isCurrent
                              ? 'bg-white border-teal-500'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                          ) : isCurrent ? (
                            <Circle className="w-4 h-4 text-teal-500 fill-teal-500" strokeWidth={0} />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300" strokeWidth={2} />
                          )}
                        </div>
                        <p
                          className={`mt-3 text-xs font-medium text-center leading-tight ${
                            isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 bg-teal-50 border border-teal-100 rounded-xl px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-teal-900">Overall Progress</p>
                    <p className="text-xs text-teal-700 mt-0.5">Facility submission completion</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2.5 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal-500 transition-all duration-300"
                        style={{ width: `${facility.progress}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-teal-900 min-w-[48px] text-right">{facility.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-gray-900 font-bold text-sm">Living Wage Analysis</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
              </div>
              <p className="text-gray-700 text-sm font-semibold">Restricted access</p>
              <p className="text-gray-400 text-xs mt-1.5 text-center max-w-md leading-relaxed">
                Living Wage Gap Calculation data is only visible to buyers. As an intermediary, your role focuses on managing the submission tracking process.
              </p>
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
