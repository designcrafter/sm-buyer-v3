import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Users,
  CreditCard,
  User,
  Plug,
  MoreHorizontal,
  ShieldCheck,
  Clock,
  UserX,
  UserPlus,
  Mail,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

type SettingsTab = 'team' | 'subscription' | 'account' | 'integrations';

const TABS: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: 'team', label: 'Team', icon: Users },
  { key: 'subscription', label: 'Subscription', icon: CreditCard },
  { key: 'account', label: 'Account', icon: User },
  { key: 'integrations', label: 'Integrations', icon: Plug },
];

type MemberStatus = 'active' | 'pending';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  status: MemberStatus;
  joinedAt: string;
  avatarInitials: string;
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@abcinc.com',
    status: 'active',
    joinedAt: 'Jan 14, 2026',
    avatarInitials: 'SC',
  },
  {
    id: '2',
    name: 'Morgan Green',
    email: 'morgan@abcinc.com',
    status: 'active',
    joinedAt: 'Dec 1, 2025',
    avatarInitials: 'MG',
  },
];

const AVATAR_COLORS = [
  'bg-primary-100 text-primary-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
];

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
        <Lock className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
      </div>
      <p className="text-gray-700 text-sm font-semibold">{label}</p>
      <p className="text-gray-400 text-xs mt-1.5 max-w-xs leading-relaxed">
        This section is coming soon. Stay tuned for updates.
      </p>
    </div>
  );
}

function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  function handleRevoke(id: string) {
    setMembers(prev => prev.filter(m => m.id !== id));
    setMenuOpen(null);
  }

  function handleSend() {
    if (!email.trim()) return;
    setSentEmail(email);
    setSent(true);
    setMembers(prev => [
      ...prev,
      {
        id: `tm-${Date.now()}`,
        name: email,
        email,
        status: 'pending',
        joinedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        avatarInitials: '?',
      },
    ]);
    setEmail('');
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
                They'll receive an email with instructions to join your team.
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
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5 text-blue-600" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold text-sm">Invite a teammate</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Add a sourcing colleague from your organisation who can help manage producers and review wage data.
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
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="colleague@company.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
                />
              </div>
              <button
                onClick={handleSend}
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
          <h2 className="text-gray-900 text-sm font-semibold">Team Members</h2>
          <p className="text-gray-400 text-xs mt-0.5">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-[45%]">Member</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-[20%]">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-[28%]">Joined</th>
              <th className="px-4 py-3 w-[7%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {members.map((member, i) => (
              <tr key={member.id} className="hover:bg-gray-50 transition group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      member.status === 'pending' ? 'bg-gray-100 text-gray-400' : AVATAR_COLORS[i % AVATAR_COLORS.length]
                    }`}>
                      {member.status === 'pending' ? (
                        <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                      ) : (
                        member.avatarInitials
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-900 text-sm font-medium truncate">
                        {member.status === 'pending' ? member.email : member.name}
                      </p>
                      {member.status === 'active' && (
                        <p className="text-gray-400 text-xs truncate">{member.email}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    member.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {member.status === 'active' ? (
                      <ShieldCheck className="w-3 h-3" strokeWidth={2} />
                    ) : (
                      <Clock className="w-3 h-3" strokeWidth={2} />
                    )}
                    {member.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs text-gray-400">
                    {member.status === 'pending' ? `Invited ${member.joinedAt}` : member.joinedAt}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setMenuOpen(menuOpen === member.id ? null : member.id)}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuOpen === member.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-8 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[150px]">
                          <button
                            onClick={() => handleRevoke(member.id)}
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

        {members.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No team members yet.</p>
            <p className="text-gray-300 text-xs mt-1">Use the invite form above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('team');

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-gray-900 text-xl font-bold">Settings</h1>
            <p className="text-gray-400 text-xs mt-0.5">Manage your account, team, and subscription</p>
          </div>

          <div className="flex gap-6">
            <nav className="w-48 shrink-0 space-y-1">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                const isDisabled = tab.key !== 'team';
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : isDisabled
                        ? 'text-gray-300 cursor-default'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                    {tab.label}
                    {isDisabled && (
                      <span className="ml-auto text-[9px] font-semibold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="flex-1 min-w-0">
              {activeTab === 'team' && <TeamSection />}
              {activeTab === 'subscription' && <ComingSoon label="Subscription Management" />}
              {activeTab === 'account' && <ComingSoon label="Account Settings" />}
              {activeTab === 'integrations' && <ComingSoon label="Integrations" />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
