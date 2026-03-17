import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useProducerStore, FacilityPhase } from '../../lib/producerStore';
import LivingWageGapTable from './LivingWageGapTable';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  TrendingDown,
  ShieldCheck,
  Factory,
} from 'lucide-react';

const PHASE_BADGE_COLORS: Record<FacilityPhase, string> = {
  'Training': 'bg-blue-50 text-blue-700 border-blue-100',
  'Submission': 'bg-amber-50 text-amber-700 border-amber-100',
  'Draft Report': 'bg-orange-50 text-orange-700 border-orange-100',
  'Audit Verification': 'bg-teal-50 text-teal-700 border-teal-100',
  'Final Report': 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

const PHASE_ORDER: FacilityPhase[] = [
  'Training', 'Submission', 'Draft Report', 'Audit Verification', 'Final Report',
];

function PhaseTimeline({ current }: { current: FacilityPhase }) {
  const currentIdx = PHASE_ORDER.indexOf(current);
  return (
    <div className="flex items-center gap-1">
      {PHASE_ORDER.map((phase, i) => {
        const isComplete = i < currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={phase} className="flex items-center gap-1">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              isCurrent
                ? 'bg-primary-500 text-white'
                : isComplete
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {isComplete && <ShieldCheck className="w-3 h-3" strokeWidth={2} />}
              {phase}
            </div>
            {i < PHASE_ORDER.length - 1 && (
              <div className={`w-4 h-0.5 rounded-full ${
                i < currentIdx ? 'bg-emerald-300' : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

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
  const currentYear = new Date().getFullYear();
  const yearlyData = [
    { year: currentYear - 2, gap: Math.round((facility.gapOverall + 4 + Math.random() * 3) * 10) / 10 },
    { year: currentYear - 1, gap: Math.round((facility.gapOverall + 1.5 + Math.random() * 2) * 10) / 10 },
    { year: currentYear, gap: facility.gapOverall },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-5xl mx-auto space-y-6">
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
                <Factory className="w-6 h-6 text-primary-600" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-gray-900 text-lg font-bold">{facility.name}</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{facility.facilityId}</p>
                  </div>
                  <span className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border ${PHASE_BADGE_COLORS[facility.phase]}`}>
                    {facility.phase}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-5 flex-wrap text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-gray-300" strokeWidth={1.75} />
                    <span>Producer: </span>
                    <Link
                      to={`/producers/${facility.producerId}`}
                      className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                    >
                      {facility.producerName}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-300" strokeWidth={1.75} />
                    <span>{facility.flag} {facility.country}, {facility.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-300" strokeWidth={1.75} />
                    <span>Sector: {facility.sector}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-gray-900 font-bold text-sm">Submission Progress</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${Math.min(facility.progress, 100)}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-700">{facility.progress}%</span>
            </div>
            <PhaseTimeline current={facility.phase} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-rose-500" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{facility.gapOverall}%</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Overall gap</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-pink-500" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{facility.gapFemale}%</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Female gap</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-sky-500" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{facility.gapMale}%</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Male gap</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-gray-900 font-bold text-sm">Living Wage Gap Over Time</h3>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-end gap-6 h-40">
                {yearlyData.map(d => {
                  const maxGap = Math.max(...yearlyData.map(y => y.gap));
                  const barHeight = maxGap > 0 ? (d.gap / maxGap) * 100 : 0;
                  const isCurrentYear = d.year === currentYear;
                  return (
                    <div key={d.year} className="flex flex-col items-center gap-2 flex-1">
                      <span className="text-sm font-bold text-gray-700">{d.gap}%</span>
                      <div className="w-full max-w-[60px] bg-gray-50 rounded-t-lg relative" style={{ height: '120px' }}>
                        <div
                          className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all ${
                            isCurrentYear ? 'bg-primary-400' : 'bg-gray-200'
                          }`}
                          style={{ height: `${barHeight}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${isCurrentYear ? 'text-primary-600' : 'text-gray-400'}`}>
                        {d.year}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <LivingWageGapTable facilityId={facility.id} facilityName={facility.name} />

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

          {producer && producer.consent && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-gray-900 font-bold text-sm">Producer Consent</h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  From {facility.producerName}
                </p>
              </div>
              <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Duration</p>
                  <p className="text-sm text-gray-800 font-medium mt-0.5 capitalize">{producer.consent.duration}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Payroll Years</p>
                  <p className="text-sm text-gray-800 font-medium mt-0.5">{producer.consent.payrollYears.join(', ')}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Audit Data</p>
                  <p className="text-sm text-gray-800 font-medium mt-0.5">{producer.consent.auditData ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium">Voluntary Contribution</p>
                  <p className="text-sm text-gray-800 font-medium mt-0.5">{producer.consent.voluntaryContribution ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
