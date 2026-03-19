import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useProducerStore, Producer } from '../lib/producerStore';
import { formatAbsoluteDate } from '../lib/utils';
import {
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Factory,
  Check,
  X,
  ShieldCheck,
  UserPlus,
  ArrowRight,
  MoreHorizontal,
  UserX,
  Building2,
} from 'lucide-react';

type InviteType = 'Producer' | 'Intermediary';
type InviteSource = 'Direct' | 'Intermediary';

interface IntermediaryInvite {
  id: string;
  type: 'Intermediary';
  name: string;
  email: string;
  status: 'active' | 'invited';
  source: 'Direct';
  intermediaryName: null;
  producersManaged: number;
  facilitiesManaged: number;
  invitedAt: string;
}

interface ProducerInvite extends Producer {
  type: 'Producer';
  intermediaryName: string | null;
}

type UnifiedInvite = ProducerInvite | IntermediaryInvite;

const DEMO_INTERMEDIARIES: IntermediaryInvite[] = [
  {
    id: 'int-1',
    type: 'Intermediary',
    name: 'David Osei',
    email: 'david@intermediaryco.com',
    status: 'active',
    source: 'Direct',
    intermediaryName: null,
    producersManaged: 12,
    facilitiesManaged: 34,
    invitedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: 'int-2',
    type: 'Intermediary',
    name: 'Elena Rossi',
    email: 'elena@fairtrade-connect.org',
    status: 'active',
    source: 'Direct',
    intermediaryName: null,
    producersManaged: 8,
    facilitiesManaged: 22,
    invitedAt: new Date(Date.now() - 86400000 * 65).toISOString(),
  },
  {
    id: 'int-3',
    type: 'Intermediary',
    name: 'pending@tradelink.co',
    email: 'pending@tradelink.co',
    status: 'invited',
    source: 'Direct',
    intermediaryName: null,
    producersManaged: 0,
    facilitiesManaged: 0,
    invitedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}

function FilterDropdown({ label, options, selected, onToggle }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  const activeLabel = selected.length === 0
    ? label
    : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 text-xs font-medium border rounded-lg px-3 py-2 transition ${
          selected.length > 0
            ? 'bg-primary-50 border-primary-300 text-primary-700'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
      >
        <span className="text-gray-400 font-normal">{label}:</span>
        <span className="font-semibold">{selected.length === 0 ? 'All' : activeLabel}</span>
        {selected.length > 0 ? (
          <button
            onClick={e => { e.stopPropagation(); selected.forEach(onToggle); }}
            className="text-primary-400 hover:text-primary-600 transition"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg min-w-[200px] max-h-[280px] overflow-y-auto py-1">
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => onToggle(opt)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
              >
                <span>{opt}</span>
                {selected.includes(opt) && <Check className="w-3 h-3 text-primary-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ManageInvitesPage() {
  const navigate = useNavigate();
  const { producers } = useProducerStore();
  const [intermediaries] = useState<IntermediaryInvite[]>(DEMO_INTERMEDIARIES);

  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [email, setEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const allInvites: UnifiedInvite[] = useMemo(() => {
    const producerInvites: ProducerInvite[] = producers.map(p => ({
      ...p,
      type: 'Producer' as const,
      intermediaryName: p.source === 'intermediary' ? 'David Osei' : null,
    }));
    return [...producerInvites, ...intermediaries].sort((a, b) =>
      new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime()
    );
  }, [producers, intermediaries]);

  const filtered = useMemo(() => {
    return allInvites.filter(inv => {
      if (typeFilter.length > 0 && !typeFilter.includes(inv.type)) return false;
      if (sourceFilter.length > 0 && !sourceFilter.includes(inv.source === 'intermediary' || inv.intermediaryName ? 'Intermediary' : 'Direct')) return false;
      if (statusFilter.length > 0) {
        if (inv.type === 'Producer') {
          const statusMap = { invited: 'Invited', accepted: 'Accepted', declined: 'Declined', pending: 'Pending' };
          if (!statusFilter.includes(statusMap[inv.status])) return false;
        } else {
          const statusMap = { active: 'Active', invited: 'Invited' };
          if (!statusFilter.includes(statusMap[inv.status])) return false;
        }
      }
      return true;
    });
  }, [allInvites, typeFilter, sourceFilter, statusFilter]);

  const toggleType = useCallback((val: string) => {
    setTypeFilter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  }, []);

  const toggleSource = useCallback((val: string) => {
    setSourceFilter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  }, []);

  const toggleStatus = useCallback((val: string) => {
    setStatusFilter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  }, []);

  const clearFilters = useCallback(() => {
    setTypeFilter([]);
    setSourceFilter([]);
    setStatusFilter([]);
  }, []);

  const hasFilters = typeFilter.length > 0 || sourceFilter.length > 0 || statusFilter.length > 0;

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(inv => inv.id));
    }
  }, [filtered, selectedIds.length]);

  const handleSendReminders = useCallback(() => {
    alert(`Sending reminders to ${selectedIds.length} invitees`);
    setSelectedIds([]);
  }, [selectedIds.length]);

  const handleSendInvite = useCallback(() => {
    if (!email.trim()) return;
    setInviteSent(true);
    setEmail('');
    setTimeout(() => {
      setInviteSent(false);
      setShowInviteForm(false);
    }, 2000);
  }, [email]);

  const declinedCount = producers.filter(p => p.status === 'declined').length;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 text-xl font-bold">Manage Invites</h1>
              <p className="text-gray-400 text-xs mt-0.5">
                View and manage all producer and intermediary invitations.
              </p>
            </div>
            <button
              onClick={() => navigate('/add-producer')}
              className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <Factory className="w-3.5 h-3.5" strokeWidth={1.75} />
              Invite Producers
            </button>
          </div>

          {declinedCount > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div>
                <p className="text-sm font-semibold text-rose-700">
                  {declinedCount} {declinedCount === 1 ? 'producer has' : 'producers have'} declined your invitation
                </p>
                <p className="text-xs text-rose-600 mt-1">
                  Review declined requests to understand their concerns and potentially reach out directly.
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
            {inviteSent ? (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-sm">Invite sent</h3>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    An invitation has been sent. They'll receive an email with instructions to join.
                  </p>
                </div>
              </div>
            ) : showInviteForm ? (
              <>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5 text-teal-600" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold text-sm">Invite an intermediary</h3>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                      Add an external intermediary or agent who can map producers in their region on your behalf.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" strokeWidth={1.75} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendInvite()}
                      placeholder="agent@intermediary.com"
                      className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
                    />
                  </div>
                  <button
                    onClick={handleSendInvite}
                    className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-xs font-semibold px-4 rounded-xl transition-all duration-150 shadow-sm hover:shadow whitespace-nowrap h-[42px]"
                  >
                    Send invite
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setShowInviteForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowInviteForm(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl py-4 text-gray-400 hover:text-gray-600 transition text-sm font-medium"
              >
                <UserPlus className="w-4 h-4" strokeWidth={1.75} />
                Invite Intermediary
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-gray-900 text-sm font-semibold">All Invites</h2>
                  <span className="text-xs bg-primary-50 text-primary-600 font-semibold px-2 py-0.5 rounded-full">
                    {filtered.length}
                  </span>
                </div>
                {selectedIds.length > 0 && (
                  <button
                    onClick={handleSendReminders}
                    className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Send Reminders ({selectedIds.length})
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <FilterDropdown label="Type" options={['Producer', 'Intermediary']} selected={typeFilter} onToggle={toggleType} />
                <FilterDropdown label="Source" options={['Direct', 'Intermediary']} selected={sourceFilter} onToggle={toggleSource} />
                <FilterDropdown label="Status" options={['Invited', 'Accepted', 'Declined', 'Active']} selected={statusFilter} onToggle={toggleStatus} />
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-400 hover:text-gray-600 font-medium transition flex items-center gap-1 ml-1"
                  >
                    <X className="w-3 h-3" />
                    Reset filters
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filtered.length && filtered.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Intermediary</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Facilities</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Invited</th>
                    <th className="px-4 py-3 w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(inv => (
                    <tr
                      key={inv.id}
                      onClick={() => {
                        if (inv.type === 'Producer') {
                          navigate(`/producers/${inv.id}`);
                        }
                      }}
                      className="hover:bg-gray-50 cursor-pointer transition group"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(inv.id)}
                          onChange={e => { e.stopPropagation(); toggleSelection(inv.id); }}
                          onClick={e => e.stopPropagation()}
                          className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-50 text-gray-700">
                          {inv.type === 'Producer' ? <Building2 className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                          {inv.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-800">{inv.name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-500">{inv.email}</span>
                      </td>
                      <td className="px-4 py-4">
                        {inv.intermediaryName ? (
                          <span className="text-sm text-gray-600">{inv.intermediaryName}</span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-500">
                          {inv.source === 'intermediary' || inv.intermediaryName ? 'Intermediary' : 'Direct'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {inv.type === 'Producer' ? (
                          <>
                            {inv.status === 'invited' && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                                <Clock className="w-3 h-3" />
                                Invited
                              </span>
                            )}
                            {inv.status === 'accepted' && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                                <CheckCircle2 className="w-3 h-3" />
                                Accepted
                              </span>
                            )}
                            {inv.status === 'declined' && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-700">
                                <XCircle className="w-3 h-3" />
                                Declined
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {inv.status === 'active' ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                                <ShieldCheck className="w-3 h-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                                <Clock className="w-3 h-3" />
                                Invited
                              </span>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-gray-700">
                          {inv.type === 'Producer' ? inv.facilitiesCount : inv.facilitiesManaged}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-400">{formatAbsoluteDate(inv.invitedAt)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-gray-400 text-sm">No invites match the current filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
