import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronRight, Clock, CheckCircle2, XCircle, Mail, Factory, MessageSquare, X } from 'lucide-react';
import { Producer, ProducerStatus } from '../lib/producerStore';

type TabKey = 'all' | 'invited' | 'accepted' | 'declined';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'invited', label: 'Invited' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'declined', label: 'Declined' },
];

function statusCountForTab(producers: Producer[], tab: TabKey): number {
  if (tab === 'all') return producers.length;
  return producers.filter(p => p.status === tab).length;
}

function StatusBadge({ status }: { status: ProducerStatus }) {
  switch (status) {
    case 'invited':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          <Mail className="w-3 h-3" strokeWidth={2} />
          Invited
        </span>
      );
    case 'accepted':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
          Accepted
        </span>
      );
    case 'declined':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
          <XCircle className="w-3 h-3" strokeWidth={2} />
          Declined
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
          <Clock className="w-3 h-3" strokeWidth={2} />
          Pending
        </span>
      );
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function DeclineReasonModal({ producer, onClose }: { producer: Producer; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Decline Reason</h3>
            <p className="text-xs text-gray-500 mt-0.5">{producer.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-gray-700 leading-relaxed">{producer.declineReason}</p>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
            Close
          </button>
        </div>
      </div>
    </>
  );
}

interface ProducerTableProps {
  producers: Producer[];
  onAddProducer?: () => void;
  compact?: boolean;
  showBuyerColumn?: boolean;
}

export default function ProducerTable({ producers, onAddProducer, compact = false, showBuyerColumn = false }: ProducerTableProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [declineReasonProducer, setDeclineReasonProducer] = useState<Producer | null>(null);

  const filtered = activeTab === 'all'
    ? producers
    : producers.filter(p => p.status === activeTab);

  if (producers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-gray-900 font-semibold text-sm">Producers</h2>
            <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">0</span>
          </div>
        </div>
        <div className="px-6 py-14 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-gray-700 text-sm font-medium">No producers yet</p>
            <p className="text-gray-400 text-xs mt-1 max-w-xs leading-relaxed">
              Invite producers to your supply chain to start tracking living wage compliance.
            </p>
          </div>
          {onAddProducer && (
            <button
              onClick={onAddProducer}
              className="mt-1 flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <Factory className="w-3.5 h-3.5" strokeWidth={1.75} />
              Invite Producers
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-900 font-semibold text-sm">Producers</h2>
          <span className="text-xs bg-primary-50 text-primary-600 font-semibold px-2 py-0.5 rounded-full">
            {producers.length}
          </span>
        </div>
        {onAddProducer && (
          <button
            onClick={onAddProducer}
            className="flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-2 rounded-xl transition"
          >
            <Factory className="w-3.5 h-3.5" strokeWidth={1.75} />
            Invite more
          </button>
        )}
      </div>

      <div className="px-6 border-b border-gray-100">
        <div className="flex items-center gap-1 -mb-px">
          {TABS.map(tab => {
            const count = statusCountForTab(producers, tab.key);
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {count}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gray-900 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-12 flex flex-col items-center text-center gap-2">
          <p className="text-gray-400 text-sm">No producers with this status</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Producer</th>
                {showBuyerColumn && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Buyers</th>
                )}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Facilities</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                {!compact && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Invited</th>
                )}
                <th className="px-4 py-3 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/producers/${p.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary-600">
                          {p.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  {showBuyerColumn && (
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.buyerNames && p.buyerNames.length > 0 ? (
                          p.buyerNames.map((buyerName, idx) => (
                            <span key={idx} className="text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">
                              {buyerName}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No buyers</span>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-300" strokeWidth={1.75} />
                      <span className="text-sm font-semibold text-gray-700">{p.facilitiesCount}</span>
                      <span className="text-xs text-gray-400">{p.facilitiesCount === 1 ? 'facility' : 'facilities'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={p.status} />
                      {p.status === 'declined' && p.declineReason && (
                        <button
                          onClick={e => { e.stopPropagation(); setDeclineReasonProducer(p); }}
                          className="p-1 rounded-lg hover:bg-red-50 transition"
                          title="View decline reason"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-red-400" strokeWidth={1.75} />
                        </button>
                      )}
                    </div>
                  </td>
                  {!compact && (
                    <td className="px-4 py-4">
                      <p className="text-xs text-gray-400">{formatDate(p.invitedAt)}</p>
                      {p.invitedBy && (
                        <p className="text-xs text-gray-400 mt-0.5">by {p.invitedBy}</p>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-4">
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {declineReasonProducer && (
        <DeclineReasonModal
          producer={declineReasonProducer}
          onClose={() => setDeclineReasonProducer(null)}
        />
      )}
    </div>
  );
}
