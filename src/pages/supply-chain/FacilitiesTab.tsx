import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Building2, Factory } from 'lucide-react';
import { useProducerStore, FacilityPhase } from '../../lib/producerStore';
import SupplyChainKpiCards from './SupplyChainKpiCards';
import SupplyChainFilterBar, { SupplyChainFilters } from './SupplyChainFilterBar';

const EMPTY_FILTERS: SupplyChainFilters = {
  years: [],
  sectors: [],
  countries: [],
  regions: [],
  phases: [],
  producers: [],
};

const PHASE_BADGE_COLORS: Record<FacilityPhase, string> = {
  'Training': 'bg-blue-50 text-blue-700 border-blue-100',
  'Submission': 'bg-amber-50 text-amber-700 border-amber-100',
  'Draft Report': 'bg-orange-50 text-orange-700 border-orange-100',
  'Audit Verification': 'bg-teal-50 text-teal-700 border-teal-100',
  'Final Report': 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export default function FacilitiesTab() {
  const navigate = useNavigate();
  const { allFacilities, producers } = useProducerStore();
  const [filters, setFilters] = useState<SupplyChainFilters>(EMPTY_FILTERS);

  const allYears = useMemo(() => [...new Set(allFacilities.map(f => String(f.year)))].sort().reverse(), [allFacilities]);
  const allSectors = useMemo(() => [...new Set(allFacilities.map(f => f.sector))].sort(), [allFacilities]);
  const allCountries = useMemo(() => [...new Set(allFacilities.map(f => f.country))].sort(), [allFacilities]);
  const allRegions = useMemo(() => [...new Set(allFacilities.map(f => f.region))].sort(), [allFacilities]);
  const allPhases = useMemo(() => [...new Set(allFacilities.map(f => f.phase))].sort(), [allFacilities]);
  const allProducerNames = useMemo(() => [...new Set(allFacilities.map(f => f.producerName))].sort(), [allFacilities]);

  const hasFilters = Object.values(filters).some(arr => arr.length > 0);

  const toggleFilter = useCallback((key: keyof SupplyChainFilters, value: string) => {
    setFilters(prev => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  }, []);

  const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const filtered = useMemo(() => {
    return allFacilities.filter(f => {
      if (filters.years.length > 0 && !filters.years.includes(String(f.year))) return false;
      if (filters.sectors.length > 0 && !filters.sectors.includes(f.sector)) return false;
      if (filters.countries.length > 0 && !filters.countries.includes(f.country)) return false;
      if (filters.regions.length > 0 && !filters.regions.includes(f.region)) return false;
      if (filters.phases.length > 0 && !filters.phases.includes(f.phase)) return false;
      if (filters.producers.length > 0 && !filters.producers.includes(f.producerName)) return false;
      return true;
    });
  }, [allFacilities, filters]);

  if (allFacilities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-14 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-gray-700 text-sm font-medium">No facilities yet</p>
            <p className="text-gray-400 text-xs mt-1 max-w-xs leading-relaxed">
              Add producers to your supply chain to start tracking facility submissions.
            </p>
          </div>
          <button
            onClick={() => navigate('/add-producer')}
            className="mt-1 flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <Factory className="w-3.5 h-3.5" strokeWidth={1.75} />
            Add Producers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SupplyChainKpiCards facilities={filtered} />

      <SupplyChainFilterBar
        filters={filters}
        allYears={allYears}
        allSectors={allSectors}
        allCountries={allCountries}
        allRegions={allRegions}
        allPhases={allPhases}
        allProducers={allProducerNames}
        onToggle={toggleFilter}
        onClear={clearFilters}
        hasFilters={hasFilters}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-gray-900 font-semibold text-sm">Facilities</h2>
            <span className="text-xs bg-primary-50 text-primary-600 font-semibold px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <button
            onClick={() => navigate('/add-producer')}
            className="flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-2 rounded-xl transition"
          >
            <Factory className="w-3.5 h-3.5" strokeWidth={1.75} />
            Add more
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-12 flex flex-col items-center text-center gap-2">
            <p className="text-gray-400 text-sm">No facilities match the current filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Facility</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Producer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Phase</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Gap</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Updated</th>
                  <th className="px-4 py-3 w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(f => (
                  <tr
                    key={f.id}
                    onClick={() => navigate(`/supply-chain/facilities/${f.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-800 truncate">{f.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{f.sector}</p>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/producers/${f.producerId}`);
                        }}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline truncate block max-w-[140px]"
                      >
                        {f.producerName}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500 font-mono">{f.facilityId}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <span>{f.flag}</span>
                        {f.country}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">{f.year}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-400"
                            style={{ width: `${Math.min(f.progress, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{f.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${PHASE_BADGE_COLORS[f.phase]}`}>
                        {f.phase}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-gray-700">{f.gapOverall}%</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-gray-400">{f.lastUpdated}</span>
                    </td>
                    <td className="px-4 py-4">
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
