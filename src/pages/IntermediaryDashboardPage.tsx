import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProducerTable from '../components/ProducerTable';
import { useProducerStore } from '../lib/producerStore';
import { useDemoStore } from '../lib/demoStore';
import {
  Building2,
  Info,
  X,
  Link2,
  Factory,
  Bell,
  Check,
  ArrowRight,
} from 'lucide-react';

function OnboardingBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex items-start gap-4 relative">
      <div className="bg-teal-600 rounded-xl p-2.5 shrink-0 mt-0.5">
        <Link2 className="w-4 h-4 text-white" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-teal-900 font-semibold text-sm">Welcome to your intermediary workspace</h3>
        <p className="text-teal-700 text-xs mt-1 leading-relaxed max-w-xl">
          You are currently acting on behalf of the selected buyer. Use the sidebar to switch between buyer accounts. New buyer invitations will appear here as notifications.
        </p>
      </div>
      <button onClick={onDismiss} className="text-teal-400 hover:text-teal-600 transition shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-5 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-gray-500 text-xs font-medium flex items-center gap-1">
          {label}
          <Info className="w-3 h-3 text-gray-300" />
        </p>
        <p className="text-gray-900 text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" strokeWidth={1.75} />
      </div>
    </div>
  );
}

function NotificationsCard() {
  const { pendingInvitations, dismissInvitation, acceptInvitation } = useDemoStore();

  if (pendingInvitations.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-amber-50 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center">
          <Bell className="w-3.5 h-3.5 text-amber-500" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-gray-900 text-sm font-semibold">Notifications</h2>
        </div>
        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
          {pendingInvitations.length} new
        </span>
      </div>
      <div className="divide-y divide-gray-50">
        {pendingInvitations.map(inv => (
          <div
            key={inv.id}
            className="px-6 py-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-amber-700">{inv.buyer.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                New buyer invitation
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                <span className="font-medium text-gray-600">{inv.buyer.name}</span> invited you to manage producer matching on their behalf
                <span className="text-gray-300 mx-1.5">&#183;</span>
                {inv.invitedAt}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => acceptInvitation(inv.id)}
                className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-sm"
              >
                <Check className="w-3.5 h-3.5" strokeWidth={2} />
                Accept
              </button>
              <button
                onClick={() => dismissInvitation(inv.id)}
                className="text-xs font-medium text-gray-400 hover:text-gray-600 px-2.5 py-2 rounded-xl hover:bg-gray-50 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IntermediaryDashboardPage() {
  const navigate = useNavigate();
  const [bannerVisible, setBannerVisible] = useState(true);
  const { producers } = useProducerStore();
  const { activeBuyer } = useDemoStore();

  const totalFacilities = producers.reduce((sum, p) => sum + p.facilitiesCount, 0);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-5xl mx-auto space-y-7">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-gray-900 text-xl font-bold">Overview</h1>
              <span className="text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">Intermediary</span>
            </div>
            <p className="text-gray-400 text-xs">
              Acting on behalf of <span className="font-semibold text-gray-600">{activeBuyer.name}</span>
            </p>
          </div>

          {bannerVisible && <OnboardingBanner onDismiss={() => setBannerVisible(false)} />}

          <NotificationsCard />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard label="Producers Matched" value={producers.length} icon={Building2} color="bg-amber-50 text-amber-500" />
            <StatCard label="Total Facilities" value={totalFacilities} icon={Factory} color="bg-blue-50 text-blue-500" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-700 text-sm font-semibold">Producers for {activeBuyer.name}</h2>
              <button
                onClick={() => navigate('/add-producer')}
                className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition"
              >
                Match producers
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
            <ProducerTable
              producers={producers}
              onAddProducer={() => navigate('/add-producer')}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
