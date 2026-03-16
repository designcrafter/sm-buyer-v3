import { Globe, TrendingDown, Users } from 'lucide-react';
import type { FacilityDetail, FacilityPhase } from '../../lib/producerStore';

interface Props {
  facilities: FacilityDetail[];
}

const PHASE_ORDER: FacilityPhase[] = [
  'Training',
  'Submission',
  'Draft Report',
  'Audit Verification',
  'Final Report',
];

const PHASE_COLORS: Record<FacilityPhase, string> = {
  'Training': 'bg-blue-50 text-blue-700',
  'Submission': 'bg-amber-50 text-amber-700',
  'Draft Report': 'bg-orange-50 text-orange-700',
  'Audit Verification': 'bg-teal-50 text-teal-700',
  'Final Report': 'bg-emerald-50 text-emerald-700',
};

export default function SupplyChainKpiCards({ facilities }: Props) {
  const countries = new Set(facilities.map(f => f.country));
  const avgGap = facilities.length > 0
    ? (facilities.reduce((s, f) => s + f.gapOverall, 0) / facilities.length).toFixed(1)
    : '0';
  const avgGapFemale = facilities.length > 0
    ? (facilities.reduce((s, f) => s + f.gapFemale, 0) / facilities.length).toFixed(1)
    : '0';
  const avgGapMale = facilities.length > 0
    ? (facilities.reduce((s, f) => s + f.gapMale, 0) / facilities.length).toFixed(1)
    : '0';

  const completed = facilities.filter(f => f.phase === 'Final Report').length;
  const phaseCounts = PHASE_ORDER.map(phase => ({
    phase,
    count: facilities.filter(f => f.phase === phase).length,
  }));

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Globe className="w-4 h-4 text-blue-500" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{countries.size}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Number of countries</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-rose-500" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{avgGap}%</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Average gap</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-pink-500" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{avgGapFemale}%</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Average gap female</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-sky-500" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{avgGapMale}%</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Average gap male</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <div className="flex items-baseline gap-2 mb-4">
          <h3 className="text-base font-bold text-gray-900">Progress {currentYear}</h3>
          <span className="text-xs text-gray-400 font-medium">
            ({completed}/{facilities.length} Facilities completed)
          </span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {phaseCounts.map(({ phase, count }) => (
            <div
              key={phase}
              className={`rounded-xl px-4 py-3.5 ${PHASE_COLORS[phase]}`}
            >
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs font-medium mt-0.5 opacity-80">{phase}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
