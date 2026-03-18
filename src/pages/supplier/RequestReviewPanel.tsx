import { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  ClipboardCheck,
  Heart,
  ChevronDown,
  Check,
  Factory,
  Package,
  CalendarRange,
} from 'lucide-react';
import {
  CollaborationRequest,
  DataAccessPreferences,
} from '../../lib/supplierCollaborationStore';

const CURRENT_YEAR = new Date().getFullYear();
const AVAILABLE_PAYROLL_YEARS = [
  CURRENT_YEAR,
  CURRENT_YEAR - 1,
  CURRENT_YEAR - 2,
  CURRENT_YEAR - 3,
  CURRENT_YEAR - 4,
];

interface Props {
  request: CollaborationRequest;
  mode: 'view' | 'manage';
  onClose: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onUpdate?: (prefs: DataAccessPreferences) => void;
}

function RequesterTypeBadge({ type }: { type: 'buyer' | 'intermediary' }) {
  return type === 'buyer' ? (
    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
      Buyer
    </span>
  ) : (
    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
      Intermediary
    </span>
  );
}

export default function RequestReviewPanel({ request, mode, onClose, onAccept, onDecline, onUpdate }: Props) {
  const source = mode === 'manage' && request.approved ? request.approved : request.requested;

  const [selectedYears, setSelectedYears] = useState<number[]>(source.selectedPayrollYears);
  const [auditData, setAuditData] = useState(source.requestAuditData);
  const [voluntaryContribution, setVoluntaryContribution] = useState(source.requestVoluntaryContribution);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  useEffect(() => {
    setSelectedYears(source.selectedPayrollYears);
    setAuditData(source.requestAuditData);
    setVoluntaryContribution(source.requestVoluntaryContribution);
  }, [request.id, source]);

  function toggleYear(year: number) {
    setSelectedYears(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year].sort((a, b) => b - a)
    );
  }

  function handleUpdate() {
    if (onUpdate) {
      onUpdate({
        selectedPayrollYears: selectedYears,
        requestAuditData: auditData,
        requestVoluntaryContribution: voluntaryContribution,
      });
    }
  }

  if (mode === 'view') {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose} />
        <div className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Access Request</h2>
              <p className="text-xs text-gray-400 mt-0.5">Review the details and accept or decline</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            <div className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
                  {request.requesterInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-gray-900">{request.requesterOrg}</p>
                    <RequesterTypeBadge type={request.requesterType} />
                  </div>
                  <p className="text-xs text-gray-500">{request.requesterName}</p>
                </div>
              </div>
              {request.actingOnBehalfOf && (
                <div className="mt-2 flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100">
                  <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-blue-600">{request.actingOnBehalfOfInitials}</span>
                  </div>
                  <span className="text-xs text-gray-500">Acting on behalf of <span className="font-semibold text-gray-700">{request.actingOnBehalfOf}</span></span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Details</p>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Factory className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
                  <span className="text-xs text-gray-500 font-medium">Facilities:</span>
                  <span className="text-xs font-semibold text-gray-700">{request.facilityIds.join(', ')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="w-3.5 h-3.5 text-gray-400 mt-0.5" strokeWidth={1.75} />
                  <span className="text-xs text-gray-500 font-medium">Products:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {request.products.map(product => (
                      <span key={product} className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">{product}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarRange className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
                  <span className="text-xs text-gray-500 font-medium">Date Range:</span>
                  <span className="text-xs font-semibold text-gray-700">{request.startDate} - {request.endDate}</span>
                </div>
                <div className="h-px bg-gray-100 my-3" />
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
                  <span className="text-xs text-gray-500 font-medium">Payroll Years:</span>
                  <div className="flex gap-1.5">
                    {request.requested.selectedPayrollYears.map(y => (
                      <span key={y} className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{y}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
                  <span className="text-xs text-gray-500 font-medium">Audit Data:</span>
                  <span className={`text-xs font-semibold ${request.requested.requestAuditData ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {request.requested.requestAuditData ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
                  <span className="text-xs text-gray-500 font-medium">Living Wage Contribution:</span>
                  <span className={`text-xs font-semibold ${request.requested.requestVoluntaryContribution ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {request.requested.requestVoluntaryContribution ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl border border-blue-100 px-4 py-3">
              <p className="text-xs text-blue-700 leading-relaxed">
                You can either accept this request as-is or decline it with a reason. If you need to share different data, decline this request and explain what you can provide.
              </p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
            <button
              onClick={onDecline}
              className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition"
            >
              Decline Request
            </button>
            <div className="flex-1" />
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
            <button
              onClick={onAccept}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition shadow-sm"
            >
              Accept Request
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Manage Access</h2>
            <p className="text-xs text-gray-400 mt-0.5">Update shared data permissions</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
                {request.requesterInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-gray-900">{request.requesterOrg}</p>
                  <RequesterTypeBadge type={request.requesterType} />
                </div>
                <p className="text-xs text-gray-500">{request.requesterName}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                <p className="text-sm font-semibold text-gray-700">Payroll Years</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setYearDropdownOpen(v => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 transition text-sm"
                >
                  <span className="text-gray-700 font-medium">
                    {selectedYears.length > 0 ? selectedYears.join(', ') : 'Select years'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${yearDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {yearDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setYearDropdownOpen(false)} />
                    <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1">
                      {AVAILABLE_PAYROLL_YEARS.map(year => {
                        const isSelected = selectedYears.includes(year);
                        return (
                          <button
                            key={year}
                            onClick={() => toggleYear(year)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition"
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                              isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={2.5} />}
                            </div>
                            <span className="font-medium text-gray-700">{year}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                  <p className="text-sm font-semibold text-gray-700">Share with auditors</p>
                </div>
                <button
                  onClick={() => setAuditData(v => !v)}
                  className={`relative inline-flex items-center shrink-0 rounded-full transition-colors ${
                    auditData ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}
                  style={{ width: 40, height: 22 }}
                >
                  <span
                    className="bg-white rounded-full shadow transition-transform"
                    style={{ width: 18, height: 18, transform: auditData ? 'translateX(20px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                  <p className="text-sm font-semibold text-gray-700">Living Wage Contribution</p>
                </div>
                <button
                  onClick={() => setVoluntaryContribution(v => !v)}
                  className={`relative inline-flex items-center shrink-0 rounded-full transition-colors ${
                    voluntaryContribution ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}
                  style={{ width: 40, height: 22 }}
                >
                  <span
                    className="bg-white rounded-full shadow transition-transform"
                    style={{ width: 18, height: 18, transform: voluntaryContribution ? 'translateX(20px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
          <div className="flex-1" />
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={selectedYears.length === 0}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Access
          </button>
        </div>
      </div>
    </>
  );
}
