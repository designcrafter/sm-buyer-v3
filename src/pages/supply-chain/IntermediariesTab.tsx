import { useState } from 'react';
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  MoreHorizontal,
  UserX,
  UserPlus,
  Building2,
} from 'lucide-react';

type IntermediaryStatus = 'active' | 'invited';

interface IntermediaryRecord {
  id: string;
  name: string;
  email: string;
  status: IntermediaryStatus;
  producersManaged: number;
  facilitiesManaged: number;
  since: string;
}

const DEMO_INTERMEDIARIES: IntermediaryRecord[] = [
  {
    id: '1',
    name: 'David Osei',
    email: 'david@intermediaryco.com',
    status: 'active',
    producersManaged: 12,
    facilitiesManaged: 34,
    since: 'Feb 3, 2026',
  },
  {
    id: '2',
    name: 'Elena Rossi',
    email: 'elena@fairtrade-connect.org',
    status: 'active',
    producersManaged: 8,
    facilitiesManaged: 22,
    since: 'Jan 15, 2026',
  },
  {
    id: '3',
    name: 'pending@tradelink.co',
    email: 'pending@tradelink.co',
    status: 'invited',
    producersManaged: 0,
    facilitiesManaged: 0,
    since: 'Mar 10, 2026',
  },
];

export default function IntermediariesTab() {
  const [intermediaries, setIntermediaries] = useState<IntermediaryRecord[]>(DEMO_INTERMEDIARIES);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  function handleSendInvite() {
    if (!email.trim()) return;
    setSentEmail(email);
    setSent(true);
    setIntermediaries(prev => [
      ...prev,
      {
        id: `inv-${Date.now()}`,
        name: email,
        email,
        status: 'invited',
        producersManaged: 0,
        facilitiesManaged: 0,
        since: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      },
    ]);
    setEmail('');
  }

  function handleRevoke(id: string) {
    setIntermediaries(prev => prev.filter(i => i.id !== id));
    setMenuOpen(null);
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
        {sent ? (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-sm">Invite sent</h3>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                An invitation has been sent to <span className="font-semibold text-gray-700">{sentEmail}</span>.
                They'll receive an email with instructions to join as an intermediary.
              </p>
              <button
                onClick={() => { setSent(false); setSentEmail(''); }}
                className="mt-3 text-xs text-primary-600 hover:text-primary-700 font-semibold"
              >
                Send another invite
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5 text-primary-600" strokeWidth={1.75} />
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
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-gray-900 text-sm font-semibold">Intermediaries</h2>
          <p className="text-gray-400 text-xs mt-0.5">{intermediaries.length} intermediar{intermediaries.length !== 1 ? 'ies' : 'y'}</p>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-[30%]">Intermediary</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-[15%]">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-[15%]">Producers</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-[15%]">Facilities</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-[18%]">Since</th>
              <th className="px-4 py-3 w-[7%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {intermediaries.map(intermediary => (
              <tr key={intermediary.id} className="hover:bg-gray-50 transition group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      intermediary.status === 'invited' ? 'bg-gray-100 text-gray-400' : 'bg-primary-100 text-primary-700'
                    }`}>
                      {intermediary.status === 'invited' ? (
                        <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                      ) : (
                        intermediary.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-900 text-sm font-medium truncate">
                        {intermediary.status === 'invited' ? intermediary.email : intermediary.name}
                      </p>
                      {intermediary.status === 'active' && (
                        <p className="text-gray-400 text-xs truncate">{intermediary.email}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    intermediary.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {intermediary.status === 'active' ? (
                      <ShieldCheck className="w-3 h-3" strokeWidth={2} />
                    ) : (
                      <Clock className="w-3 h-3" strokeWidth={2} />
                    )}
                    {intermediary.status === 'active' ? 'Active' : 'Invited'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-300" strokeWidth={1.75} />
                    <span className="text-sm font-semibold text-gray-700">{intermediary.producersManaged}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-600">{intermediary.facilitiesManaged}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs text-gray-400">
                    {intermediary.status === 'invited' ? `Invited ${intermediary.since}` : intermediary.since}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setMenuOpen(menuOpen === intermediary.id ? null : intermediary.id)}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuOpen === intermediary.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-8 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[150px]">
                          <button
                            onClick={() => handleRevoke(intermediary.id)}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                          >
                            <UserX className="w-3.5 h-3.5" strokeWidth={1.75} />
                            Revoke access
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {intermediaries.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No intermediaries yet.</p>
            <p className="text-gray-300 text-xs mt-1">Use the invite form above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
