import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import type { FacilityDetail, DataConsentLevel } from '../../lib/producerStore';

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'Draft':
      return <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">{status}</span>;
    case 'Submitted':
      return <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">{status}</span>;
    case 'Final Report':
      return <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-emerald-600 text-white">{status}</span>;
    case 'Not Started':
      return <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-gray-200 text-gray-500">{status}</span>;
    default:
      return <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-gray-200 text-gray-500">{status}</span>;
  }
}

function ConsentBadge({ type }: { type: DataConsentLevel }) {
  return type === 'full' ? (
    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
      Full data
    </span>
  ) : (
    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
      Aggregate
    </span>
  );
}

interface FacilityGroup {
  name: string;
  facilities: FacilityDetail[];
}

interface Props {
  facilities: FacilityDetail[];
}

export default function ProducerLivingWageTable({ facilities }: Props) {
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const groupFacilitiesByName = (): FacilityGroup[] => {
    const grouped = new Map<string, FacilityDetail[]>();

    facilities.forEach(facility => {
      const existing = grouped.get(facility.name) || [];
      grouped.set(facility.name, [...existing, facility]);
    });

    return Array.from(grouped.entries()).map(([name, facilities]) => ({
      name,
      facilities: facilities.sort((a, b) => b.year - a.year),
    }));
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  if (facilities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-gray-900 font-bold text-sm">Living Wage Gap Calculations</h3>
        </div>
        <div className="px-6 py-12 text-center">
          <p className="text-gray-400 text-sm">No facility data available yet.</p>
        </div>
      </div>
    );
  }

  const groupedFacilities = groupFacilitiesByName();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-gray-900 font-bold text-sm">Living Wage Gap Calculations</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Search by facility name"
              readOnly
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-300 focus:outline-none w-52"
            />
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 hover:bg-gray-100 transition">
            All Years
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px]">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">Facility</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Year</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Progress</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Phase</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Data Consent</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Updated</th>
              <th className="px-4 py-3 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {groupedFacilities.map(group => {
              const isExpanded = expandedGroups.has(group.name);
              const mainFacility = group.facilities[0];
              const olderFacilities = group.facilities.slice(1);
              const hasMultipleYears = olderFacilities.length > 0;

              return (
                <>
                  <tr
                    key={mainFacility.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {hasMultipleYears && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleGroup(group.name);
                            }}
                            className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0"
                          >
                            <ChevronRight
                              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                                isExpanded ? 'rotate-90' : ''
                              }`}
                              strokeWidth={2}
                            />
                          </button>
                        )}
                        <div
                          onClick={() => navigate(`/producers/facilities/${mainFacility.facilityId}`)}
                          className="cursor-pointer"
                        >
                          <p className="text-sm font-semibold text-gray-900">{mainFacility.name}</p>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">{mainFacility.facilityId}</p>
                        </div>
                        {mainFacility.salaryMatrixStatus === 'submitted' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 shrink-0" title="Salary Matrix updated">
                            <RefreshCw className="w-2.5 h-2.5" strokeWidth={2.5} />
                            SM Updated
                          </span>
                        )}
                        {hasMultipleYears && (
                          <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 shrink-0">
                            {group.facilities.length} years
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      className="px-4 py-4 cursor-pointer"
                      onClick={() => navigate(`/producers/facilities/${mainFacility.facilityId}`)}
                    >
                      <span className="text-sm text-gray-500 font-mono">{mainFacility.facilityId}</span>
                    </td>
                    <td
                      className="px-4 py-4 cursor-pointer"
                      onClick={() => navigate(`/producers/facilities/${mainFacility.facilityId}`)}
                    >
                      <span className="text-sm text-gray-700 flex items-center gap-1.5">
                        <span>{mainFacility.flag}</span>
                        {mainFacility.country}
                      </span>
                    </td>
                    <td
                      className="px-4 py-4 cursor-pointer"
                      onClick={() => navigate(`/producers/facilities/${mainFacility.facilityId}`)}
                    >
                      <span className="text-sm text-gray-500">{mainFacility.region}</span>
                    </td>
                    <td
                      className="px-4 py-4 cursor-pointer"
                      onClick={() => navigate(`/producers/facilities/${mainFacility.facilityId}`)}
                    >
                      <span className="text-sm text-gray-700 font-semibold">{mainFacility.year}</span>
                    </td>
                    <td
                      className="px-4 py-4 cursor-pointer"
                      onClick={() => navigate(`/producers/facilities/${mainFacility.facilityId}`)}
                    >
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-400"
                          style={{ width: `${Math.min(mainFacility.progress, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td
                      className="px-4 py-4 cursor-pointer"
                      onClick={() => navigate(`/producers/facilities/${mainFacility.facilityId}`)}
                    >
                      <StatusBadge status={mainFacility.reportStatus} />
                    </td>
                    <td
                      className="px-4 py-4 cursor-pointer"
                      onClick={() => navigate(`/producers/facilities/${mainFacility.facilityId}`)}
                    >
                      <ConsentBadge type={mainFacility.consentType} />
                    </td>
                    <td
                      className="px-4 py-4 cursor-pointer"
                      onClick={() => navigate(`/producers/facilities/${mainFacility.facilityId}`)}
                    >
                      <span className="text-sm text-gray-400">{mainFacility.lastUpdated}</span>
                    </td>
                    <td
                      className="px-4 py-4 cursor-pointer"
                      onClick={() => navigate(`/producers/facilities/${mainFacility.facilityId}`)}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />
                    </td>
                  </tr>
                  {isExpanded && olderFacilities.map(facility => (
                    <tr
                      key={facility.id}
                      onClick={() => navigate(`/producers/facilities/${facility.facilityId}`)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer group bg-gray-25"
                    >
                      <td className="px-6 py-4 pl-14">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-medium text-gray-700">{facility.name}</p>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">{facility.facilityId}</p>
                          </div>
                          {facility.salaryMatrixStatus === 'submitted' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 shrink-0" title="Salary Matrix updated">
                              <RefreshCw className="w-2.5 h-2.5" strokeWidth={2.5} />
                              SM Updated
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-500 font-mono">{facility.facilityId}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700 flex items-center gap-1.5">
                          <span>{facility.flag}</span>
                          {facility.country}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-500">{facility.region}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{facility.year}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-400"
                            style={{ width: `${Math.min(facility.progress, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={facility.reportStatus} />
                      </td>
                      <td className="px-4 py-4">
                        <ConsentBadge type={facility.consentType} />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-400">{facility.lastUpdated}</span>
                      </td>
                      <td className="px-4 py-4">
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />
                      </td>
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-gray-50">
        <p className="text-xs text-gray-400">
          Showing {groupedFacilities.length} {groupedFacilities.length === 1 ? 'facility' : 'facilities'} ({facilities.length} total calculations)
        </p>
      </div>
    </div>
  );
}
