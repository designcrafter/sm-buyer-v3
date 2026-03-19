import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  Inbox,
  ShieldCheck,
  Calendar,
  Clock,
  ClipboardCheck,
  Heart,
  ShieldOff,
  Handshake,
  Factory,
  Package,
  CalendarRange,
} from 'lucide-react';
import {
  useSupplierCollaboration,
  CollaborationRequest,
} from '../../lib/supplierCollaborationStore';
import RequestReviewPanel from './RequestReviewPanel';
import DeclineModal from './DeclineModal';
import RevokeModal from './RevokeModal';

type Tab = 'incoming' | 'active';

function RequesterTypeBadge({ type }: { type: 'buyer' | 'intermediary' }) {
  return type === 'buyer' ? (
    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
      Buyer
    </span>
  ) : (
    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
      Intermediary
    </span>
  );
}

function PreferencesSummary({ prefs, label }: { prefs: DataAccessPreferences; label?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
      {label && <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-gray-400" strokeWidth={1.75} />
          <span className="text-xs text-gray-500">Years:</span>
          <div className="flex gap-1">
            {prefs.selectedPayrollYears.map(y => (
              <span key={y} className="text-xs font-semibold bg-white text-gray-700 px-1.5 py-0.5 rounded border border-gray-200">{y}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-3 h-3 text-gray-400" strokeWidth={1.75} />
          <span className="text-xs text-gray-500">Audit:</span>
          <span className={`text-xs font-semibold ${prefs.requestAuditData ? 'text-primary-600' : 'text-gray-400'}`}>
            {prefs.requestAuditData ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <Heart className="w-3 h-3 text-gray-400" strokeWidth={1.75} />
          <span className="text-xs text-gray-500">Voluntary:</span>
          <span className={`text-xs font-semibold ${prefs.requestVoluntaryContribution ? 'text-primary-600' : 'text-gray-400'}`}>
            {prefs.requestVoluntaryContribution ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
}

function IncomingRequestCard({
  request,
  onReview,
  onDecline,
}: {
  request: CollaborationRequest;
  onReview: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700 shrink-0">
            {request.requesterInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-gray-900">{request.requesterOrg}</p>
              <RequesterTypeBadge type={request.requesterType} />
            </div>
            <p className="text-xs text-gray-500">{request.requesterName}</p>
            {request.actingOnBehalfOf && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-4 h-4 rounded bg-blue-50 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-blue-600">{request.actingOnBehalfOfInitials}</span>
                </div>
                <span className="text-[11px] text-gray-400">On behalf of <span className="font-semibold text-gray-600">{request.actingOnBehalfOf}</span></span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-gray-300" strokeWidth={1.75} />
          <span className="text-[11px] text-gray-400">{request.requestedAt}</span>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <Factory className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
          <span className="text-xs text-gray-500">Facilities:</span>
          <span className="text-xs font-semibold text-gray-700">{request.facilityIds.join(', ')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
          <span className="text-xs text-gray-500">Products:</span>
          <div className="flex gap-1.5 flex-wrap">
            {request.products.map(product => (
              <span key={product} className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">{product}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarRange className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
          <span className="text-xs text-gray-500">Date Range:</span>
          <span className="text-xs font-semibold text-gray-700">{request.startDate} - {request.endDate}</span>
        </div>
      </div>

      <PreferencesSummary prefs={request.requested} />

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={onReview}
          className="flex-1 bg-primary-700 hover:bg-primary-800 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow-sm"
        >
          Review & Respond
        </button>
        <button
          onClick={onDecline}
          className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

function ActiveAccessCard({
  request,
  onRevoke,
}: {
  request: CollaborationRequest;
  onRevoke: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700 shrink-0">
            {request.requesterInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-gray-900">{request.requesterOrg}</p>
              <RequesterTypeBadge type={request.requesterType} />
            </div>
            <p className="text-xs text-gray-500">{request.requesterName}</p>
            {request.actingOnBehalfOf && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-4 h-4 rounded bg-blue-50 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-blue-600">{request.actingOnBehalfOfInitials}</span>
                </div>
                <span className="text-[11px] text-gray-400">On behalf of <span className="font-semibold text-gray-600">{request.actingOnBehalfOf}</span></span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Granted</p>
          <p className="text-xs font-semibold text-gray-600">{request.respondedAt}</p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <Factory className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
          <span className="text-xs text-gray-500">Facilities:</span>
          <span className="text-xs font-semibold text-gray-700">{request.facilityIds.join(', ')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
          <span className="text-xs text-gray-500">Products:</span>
          <div className="flex gap-1.5 flex-wrap">
            {request.products.map(product => (
              <span key={product} className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">{product}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarRange className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
          <span className="text-xs text-gray-500">Date Range:</span>
          <span className="text-xs font-semibold text-gray-700">{request.startDate} - {request.endDate}</span>
        </div>
      </div>

      {request.approved && (
        <PreferencesSummary prefs={request.approved} label="Shared data" />
      )}

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={onRevoke}
          className="flex items-center justify-center gap-1.5 flex-1 border border-red-200 text-red-600 text-xs font-semibold py-2.5 rounded-xl hover:bg-red-50 transition"
        >
          <ShieldOff className="w-3.5 h-3.5" strokeWidth={1.75} />
          Revoke Access
        </button>
      </div>
    </div>
  );
}

export default function SupplierCollaborationPage() {
  const {
    incomingRequests,
    activeAccess,
    pendingCount,
    approveRequest,
    declineRequest,
    revokeAccess,
  } = useSupplierCollaboration();

  const [activeTab, setActiveTab] = useState<Tab>('incoming');
  const [reviewTarget, setReviewTarget] = useState<CollaborationRequest | null>(null);
  const [declineTarget, setDeclineTarget] = useState<CollaborationRequest | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<CollaborationRequest | null>(null);

  function handleOpenReview(request: CollaborationRequest) {
    setReviewTarget(request);
  }

  function handleAccept() {
    if (!reviewTarget) return;
    approveRequest(reviewTarget.id, reviewTarget.requested);
    setReviewTarget(null);
  }

  function handleDeclineFromPanel() {
    if (reviewTarget) {
      setDeclineTarget(reviewTarget);
      setReviewTarget(null);
    }
  }

  function handleConfirmDecline(reason?: string) {
    if (declineTarget) {
      declineRequest(declineTarget.id, reason);
      setDeclineTarget(null);
    }
  }

  function handleConfirmRevoke(reason?: string) {
    if (revokeTarget) {
      revokeAccess(revokeTarget.id);
      setRevokeTarget(null);
    }
  }

  const pendingRequests = incomingRequests.filter(r => r.status === 'pending');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="flex items-center gap-3 mb-1">
            <Handshake className="w-6 h-6 text-primary-700" strokeWidth={1.75} />
            <h1 className="text-2xl font-bold text-gray-900">Collaboration</h1>
          </div>
          <p className="text-sm text-gray-500 mb-8">Manage data access requests and permissions for your salary matrix data.</p>

          <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'incoming' ? 'text-primary-700' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Inbox className="w-4 h-4" strokeWidth={1.75} />
              Incoming Requests
              {pendingCount > 0 && (
                <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold px-1.5">
                  {pendingCount}
                </span>
              )}
              {activeTab === 'incoming' && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-700 rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'active' ? 'text-primary-700' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
              Active Access
              {activeAccess.length > 0 && (
                <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5">
                  {activeAccess.length}
                </span>
              )}
              {activeTab === 'active' && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-700 rounded-full" />}
            </button>
          </div>

          {activeTab === 'incoming' && (
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-16 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center mb-4">
                    <Inbox className="w-7 h-7 text-primary-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-gray-700 text-sm font-semibold mb-1">No pending requests</p>
                  <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                    When buyers or intermediaries request access to your salary matrix data, their requests will appear here.
                  </p>
                </div>
              ) : (
                pendingRequests.map(request => (
                  <IncomingRequestCard
                    key={request.id}
                    request={request}
                    onReview={() => handleOpenReview(request)}
                    onDecline={() => setDeclineTarget(request)}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'active' && (
            <div className="space-y-4">
              {activeAccess.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-16 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-7 h-7 text-primary-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-gray-700 text-sm font-semibold mb-1">No active access grants</p>
                  <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                    Once you approve data access requests, active grants will be listed here for you to manage or revoke.
                  </p>
                </div>
              ) : (
                activeAccess.map(request => (
                  <ActiveAccessCard
                    key={request.id}
                    request={request}
                    onRevoke={() => setRevokeTarget(request)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {reviewTarget && (
        <RequestReviewPanel
          request={reviewTarget}
          mode="view"
          onClose={() => setReviewTarget(null)}
          onAccept={handleAccept}
          onDecline={handleDeclineFromPanel}
        />
      )}

      {declineTarget && (
        <DeclineModal
          requesterName={declineTarget.requesterName}
          onConfirm={handleConfirmDecline}
          onCancel={() => setDeclineTarget(null)}
        />
      )}

      {revokeTarget && (
        <RevokeModal
          recipientName={revokeTarget.requesterName}
          onConfirm={handleConfirmRevoke}
          onCancel={() => setRevokeTarget(null)}
        />
      )}
    </div>
  );
}
