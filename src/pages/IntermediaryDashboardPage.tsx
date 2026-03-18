import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
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
  ChevronRight,
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
  const navigate = useNavigate();
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
                onClick={() => navigate('/intermediary/supply-chain')}
                className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-sm"
              >
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                View
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
            <button
              onClick={() => navigate('/intermediary/producers')}
              className="bg-white rounded-2xl border border-gray-100 px-5 py-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group"
            >
              <div>
                <p className="text-gray-500 text-xs font-medium flex items-center gap-1">
                  Producers Matched
                  <Info className="w-3 h-3 text-gray-300" />
                </p>
                <p className="text-gray-900 text-2xl font-bold mt-1">{producers.length}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-11 h-11 rounded-full flex items-center justify-center bg-amber-50 text-amber-500 group-hover:bg-amber-100 transition-colors">
                  <Building2 className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-600 transition-colors" strokeWidth={2} />
              </div>
            </button>

            <button
              onClick={() => navigate('/intermediary/supply-chain')}
              className="bg-white rounded-2xl border border-gray-100 px-5 py-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group"
            >
              <div>
                <p className="text-gray-500 text-xs font-medium flex items-center gap-1">
                  Total Facilities
                  <Info className="w-3 h-3 text-gray-300" />
                </p>
                <p className="text-gray-900 text-2xl font-bold mt-1">{totalFacilities}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-11 h-11 rounded-full flex items-center justify-center bg-blue-50 text-blue-500 group-hover:bg-blue-100 transition-colors">
                  <Factory className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-600 transition-colors" strokeWidth={2} />
              </div>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-teal-500" strokeWidth={1.75} />
            </div>
            <h3 className="text-gray-900 text-sm font-semibold mb-2">Quick Actions</h3>
            <p className="text-gray-400 text-xs mb-4 max-w-md mx-auto">
              Navigate to the Producers or Supply Chain pages to manage your intermediary work for {activeBuyer.name}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => navigate('/intermediary/producers')}
                className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
              >
                <Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                View Producers
              </button>
              <button
                onClick={() => navigate('/intermediary/supply-chain')}
                className="flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
              >
                <Factory className="w-3.5 h-3.5" strokeWidth={1.75} />
                View Supply Chain
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
