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
    case 'Draft Report':
      return <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">{status}</span>;
    case 'Submission':
      return <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">{status}</span>;
    case 'Final Report':
      return <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-emerald-600 text-white">{status}</span>;
    case 'Training':
      return <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">{status}</span>;
    case 'Audit Verification':
      return <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-700">{status}</span>;
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

interface Props {
  facilities: FacilityDetail[];
}

export default function ProducerLivingWageTable({ facilities }: Props) {
  const navigate = useNavigate();

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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-gray-900 font-bold text-sm">Living Wage Gap Calculations</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Search by facility ID"
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
            {facilities.map(f => (
              <tr
                key={f.id}
                onClick={() => navigate(`/supply-chain/facilities/${f.id}`)}
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{f.name}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{f.facilityId}</p>
                    </div>
                    {f.salaryMatrixStatus === 'submitted' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 shrink-0" title="Salary Matrix updated">
                        <RefreshCw className="w-2.5 h-2.5" strokeWidth={2.5} />
                        SM Updated
                      </span>
                    )}
                  </div>
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
                  <span className="text-sm text-gray-500">{f.region}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-700">{f.year}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${Math.min(f.progress, 100)}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={f.phase} />
                </td>
                <td className="px-4 py-4">
                  <ConsentBadge type={f.consentType} />
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-400">{f.lastUpdated}</span>
                </td>
                <td className="px-4 py-4">
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-gray-50">
        <p className="text-xs text-gray-400">Page 1 of 1</p>
      </div>
    </div>
  );
}
