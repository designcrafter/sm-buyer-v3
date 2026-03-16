import { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  RefreshCw,
  ClipboardCheck,
  Heart,
  AlertTriangle,
  ChevronDown,
  Check,
  Shield,
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
  mode: 'review' | 'manage';
  onClose: () => void;
  onApprove: (prefs: DataAccessPreferences) => void;
  onDecline?: () => void;
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

function YearPill({ year, requested, active }: { year: number; requested: boolean; active: boolean }) {
  const isModified = requested && !active;
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
      active
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : isModified
          ? 'bg-amber-50 text-amber-600 border-amber-200 line-through'
          : 'bg-gray-50 text-gray-400 border-gray-200'
    }`}>
      {year}
    </span>
  );
}

export default function RequestReviewPanel({ request, mode, onClose, onApprove, onDecline }: Props) {
  const source = mode === 'manage' && request.approved ? request.approved : request.requested;

  const [selectedYears, setSelectedYears] = useState<number[]>(source.selectedPayrollYears);
  const [duration, setDuration] = useState<'single' | 'ongoing'>(source.duration);
  const [auditData, setAuditData] = useState(source.requestAuditData);
  const [voluntaryContribution, setVoluntaryContribution] = useState(source.requestVoluntaryContribution);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  useEffect(() => {
    setSelectedYears(source.selectedPayrollYears);
    setDuration(source.duration);
    setAuditData(source.requestAuditData);
    setVoluntaryContribution(source.requestVoluntaryContribution);
  }, [request.id, source]);

  const requestedYears = request.requested.selectedPayrollYears;
  const hasYearChanges = requestedYears.some(y => !selectedYears.includes(y));
  const hasDurationChange = duration !== request.requested.duration;
  const hasAuditChange = auditData !== request.requested.requestAuditData;
  const hasVoluntaryChange = voluntaryContribution !== request.requested.requestVoluntaryContribution;
  const hasAnyChange = hasYearChanges || hasDurationChange || hasAuditChange || hasVoluntaryChange;

  function toggleYear(year: number) {
    if (!requestedYears.includes(year)) return;
    setSelectedYears(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year].sort((a, b) => b - a)
    );
  }

  function handleApprove() {
    onApprove({
      selectedPayrollYears: selectedYears,
      duration,
      requestAuditData: auditData,
      requestVoluntaryContribution: voluntaryContribution,
    });
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === 'review' ? 'Review Access Request' : 'Manage Access'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {mode === 'review' ? 'Decide what data to share' : 'Update shared data permissions'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
                {request.requesterInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">{request.requesterName}</p>
                  <RequesterTypeBadge type={request.requesterType} />
                </div>
                <p className="text-xs text-gray-500">{request.requesterOrg}</p>
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
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">What was requested</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Payroll Years</span>
                <div className="flex gap-1.5">
                  {requestedYears.map(y => (
                    <span key={y} className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{y}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Duration</span>
                <span className="text-xs font-semibold text-gray-700">{request.requested.duration === 'ongoing' ? 'Ongoing access' : 'Single reporting period'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Audit Data</span>
                <span className={`text-xs font-semibold ${request.requested.requestAuditData ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {request.requested.requestAuditData ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Voluntary Contribution</span>
                <span className={`text-xs font-semibold ${request.requested.requestVoluntaryContribution ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {request.requested.requestVoluntaryContribution ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
              <p className="text-sm font-bold text-gray-900">Your Response</p>
              {hasAnyChange && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Modified</span>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                  <p className="text-sm font-semibold text-gray-700">Payroll Years</p>
                  {hasYearChanges && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">Modified</span>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setYearDropdownOpen(v => !v)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 transition text-sm"
                  >
                    <span className="text-gray-700 font-medium">
                      {selectedYears.length > 0
                        ? selectedYears.join(', ')
                        : 'Select years'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${yearDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {yearDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setYearDropdownOpen(false)} />
                      <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1">
                        {AVAILABLE_PAYROLL_YEARS.map(year => {
                          const wasRequested = requestedYears.includes(year);
                          const isSelected = selectedYears.includes(year);
                          return (
                            <button
                              key={year}
                              onClick={() => wasRequested && toggleYear(year)}
                              disabled={!wasRequested}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition ${
                                wasRequested ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-40 cursor-not-allowed'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                                isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={2.5} />}
                              </div>
                              <span className="font-medium text-gray-700">{year}</span>
                              {!wasRequested && <span className="text-[10px] text-gray-400 ml-auto">Not requested</span>}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {requestedYears.map(y => (
                    <YearPill key={y} year={y} requested active={selectedYears.includes(y)} />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <RefreshCw className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                  <p className="text-sm font-semibold text-gray-700">Request Duration</p>
                  {hasDurationChange && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">Modified</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDuration('single')}
                    className={`px-4 py-3 rounded-xl border text-left transition ${
                      duration === 'single'
                        ? 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${duration === 'single' ? 'text-emerald-700' : 'text-gray-700'}`}>Single period</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Until Dec {CURRENT_YEAR}</p>
                  </button>
                  <button
                    onClick={() => setDuration('ongoing')}
                    className={`px-4 py-3 rounded-xl border text-left transition ${
                      duration === 'ongoing'
                        ? 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${duration === 'ongoing' ? 'text-emerald-700' : 'text-gray-700'}`}>Ongoing access</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Renewed annually</p>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                    <p className="text-sm font-semibold text-gray-700">Audit Data</p>
                    {hasAuditChange && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">Modified</span>
                    )}
                  </div>
                  <button
                    onClick={() => request.requested.requestAuditData && setAuditData(v => !v)}
                    disabled={!request.requested.requestAuditData}
                    className={`relative inline-flex items-center shrink-0 rounded-full transition-colors ${
                      auditData ? 'bg-emerald-600' : 'bg-gray-200'
                    } ${!request.requested.requestAuditData ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
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
                    <p className="text-sm font-semibold text-gray-700">Voluntary Contribution</p>
                    {hasVoluntaryChange && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">Modified</span>
                    )}
                  </div>
                  <button
                    onClick={() => request.requested.requestVoluntaryContribution && setVoluntaryContribution(v => !v)}
                    disabled={!request.requested.requestVoluntaryContribution}
                    className={`relative inline-flex items-center shrink-0 rounded-full transition-colors ${
                      voluntaryContribution ? 'bg-emerald-600' : 'bg-gray-200'
                    } ${!request.requested.requestVoluntaryContribution ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
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

          {hasAnyChange && (
            <div className="bg-amber-50 rounded-xl border border-amber-100 px-4 py-3 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.75} />
              <p className="text-xs text-amber-700 leading-relaxed">
                Your response differs from the original request. The requester will be notified about which data you chose to share.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
          {mode === 'review' && onDecline && (
            <button
              onClick={onDecline}
              className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition"
            >
              Decline Request
            </button>
          )}
          <div className="flex-1" />
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={selectedYears.length === 0}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'review' ? 'Approve Access' : 'Update Access'}
          </button>
        </div>
      </div>
    </>
  );
}
