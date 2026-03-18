import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  Link,
  Factory,
  Mail,
  Users,
  Check,
  X,
  Clock,
  Calendar,
  UserX,
  Handshake,
  Building2,
} from 'lucide-react';
import {
  useIntermediaryCollaboration,
  BuyerInvite,
  BuyerRelationship,
} from '../../lib/intermediaryCollaborationStore';
import { useDemoStore } from '../../lib/demoStore';
import IntermediaryFacilitiesTab from './IntermediaryFacilitiesTab';

type Tab = 'facilities' | 'invites';

function InviteCard({
  invite,
  onAccept,
  onDecline,
}: {
  invite: BuyerInvite;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-sm font-bold text-amber-700 shrink-0">
          {invite.buyerInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-gray-900">{invite.buyerName}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              <Mail className="w-2.5 h-2.5" strokeWidth={2} />
              New Invite
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span>From <span className="font-medium text-gray-600">{invite.contactName}</span></span>
            <span className="text-gray-200">|</span>
            <span>{invite.contactEmail}</span>
            <span className="text-gray-200">|</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" strokeWidth={1.75} />
              {invite.receivedAt}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAccept}
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <Check className="w-3.5 h-3.5" strokeWidth={2} />
              Accept Invitation
            </button>
            <button
              onClick={onDecline}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 hover:text-gray-700 transition"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.75} />
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RelationshipCard({
  relationship,
  onEnd,
}: {
  relationship: BuyerRelationship;
  onEnd: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-sm font-bold text-teal-700 shrink-0">
          {relationship.buyerInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-gray-900">{relationship.buyerName}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Check className="w-2.5 h-2.5" strokeWidth={2} />
              Active
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span>Contact: <span className="font-medium text-gray-600">{relationship.contactName}</span></span>
            <span className="text-gray-200">|</span>
            <span>{relationship.contactEmail}</span>
          </div>

          <div className="flex items-center gap-5 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Factory className="w-3.5 h-3.5 text-blue-500" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Suppliers</p>
                <p className="text-sm font-bold text-gray-900">{relationship.suppliersManaged}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-teal-500" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Since</p>
                <p className="text-sm font-bold text-gray-900">{relationship.since}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onEnd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 hover:text-red-600 transition"
          >
            <UserX className="w-3.5 h-3.5" strokeWidth={1.75} />
            End Relationship
          </button>
        </div>
      </div>
    </div>
  );
}

function EndRelationshipModal({
  buyerName,
  onConfirm,
  onCancel,
}: {
  buyerName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50" onClick={onCancel} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <UserX className="w-4 h-4 text-red-500" strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-bold text-gray-900">End Relationship</h3>
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to stop acting as intermediary for <span className="font-semibold text-gray-900">{buyerName}</span>? You will no longer manage their supplier data collection.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition shadow-sm"
          >
            End Relationship
          </button>
        </div>
      </div>
    </>
  );
}

export default function IntermediarySupplyChainPage() {
  const { activeBuyer } = useDemoStore();
  const { invites, relationships, inviteCount, acceptInvite, declineInvite, endRelationship } = useIntermediaryCollaboration();

  const [activeTab, setActiveTab] = useState<Tab>('facilities');
  const [endTarget, setEndTarget] = useState<BuyerRelationship | null>(null);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-6xl mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-gray-900 text-xl font-bold">Supply Chain</h1>
              <span className="text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">Intermediary</span>
            </div>
            <p className="text-gray-400 text-xs">
              Track facility submissions and manage buyer relationships for <span className="font-semibold text-gray-600">{activeBuyer.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('facilities')}
              className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === 'facilities'
                  ? 'text-teal-700'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="flex items-center gap-2">
                <Factory className="w-4 h-4" strokeWidth={1.75} />
                Facilities
              </span>
              {activeTab === 'facilities' && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-teal-700 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('invites')}
              className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === 'invites'
                  ? 'text-teal-700'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" strokeWidth={1.75} />
                Buyer Invites
                {inviteCount > 0 && (
                  <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold px-1.5">
                    {inviteCount}
                  </span>
                )}
              </span>
              {activeTab === 'invites' && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-teal-700 rounded-full" />
              )}
            </button>
          </div>

          {activeTab === 'facilities' && <IntermediaryFacilitiesTab />}

          {activeTab === 'invites' && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <Mail className="w-5 h-5 text-teal-700" strokeWidth={1.75} />
                  <h2 className="text-gray-900 text-base font-bold">Pending Invitations</h2>
                  {inviteCount > 0 && (
                    <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold px-1.5">
                      {inviteCount}
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  {invites.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-16 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
                        <Mail className="w-7 h-7 text-teal-300" strokeWidth={1.5} />
                      </div>
                      <p className="text-gray-700 text-sm font-semibold mb-1">No pending invitations</p>
                      <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                        When buyers invite you to act as their intermediary, their requests will appear here.
                      </p>
                    </div>
                  ) : (
                    invites.map(invite => (
                      <InviteCard
                        key={invite.id}
                        invite={invite}
                        onAccept={() => acceptInvite(invite.id)}
                        onDecline={() => declineInvite(invite.id)}
                      />
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <Users className="w-5 h-5 text-teal-700" strokeWidth={1.75} />
                  <h2 className="text-gray-900 text-base font-bold">Active Buyer Relationships</h2>
                  {relationships.length > 0 && (
                    <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5">
                      {relationships.length}
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  {relationships.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-16 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
                        <Building2 className="w-7 h-7 text-teal-300" strokeWidth={1.5} />
                      </div>
                      <p className="text-gray-700 text-sm font-semibold mb-1">No active relationships</p>
                      <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                        Accept a buyer invitation to start managing supplier data on their behalf.
                      </p>
                    </div>
                  ) : (
                    relationships.map(rel => (
                      <RelationshipCard
                        key={rel.id}
                        relationship={rel}
                        onEnd={() => setEndTarget(rel)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {endTarget && (
        <EndRelationshipModal
          buyerName={endTarget.buyerName}
          onConfirm={() => {
            endRelationship(endTarget.id);
            setEndTarget(null);
          }}
          onCancel={() => setEndTarget(null)}
        />
      )}
    </div>
  );
}
