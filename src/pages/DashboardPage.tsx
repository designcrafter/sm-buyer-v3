import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProducerTable from '../components/ProducerTable';
import { useProducerStore } from '../lib/producerStore';
import {
  Users,
  Building2,
  Info,
  Sparkles,
  X,
  BarChart3,
} from 'lucide-react';

function OnboardingBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 flex items-start gap-4 relative">
      <div className="bg-primary-500 rounded-xl p-2.5 shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4 text-white" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-primary-900 font-semibold text-sm">Welcome to the Salary Matrix</h3>
        <p className="text-primary-700 text-xs mt-1 leading-relaxed max-w-xl">
          You're all set up. To get started, add the producers in your supply chain — or invite a teammate
          from the settings to help you identify and match the right facilities.
        </p>
      </div>
      <button onClick={onDismiss} className="text-primary-400 hover:text-primary-600 transition shrink-0">
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

export default function DashboardPage() {
  const navigate = useNavigate();
  const [bannerVisible, setBannerVisible] = useState(true);
  const { producers } = useProducerStore();

  const totalFacilities = producers.reduce((sum, p) => sum + p.facilitiesCount, 0);
  const acceptedCount = producers.filter(p => p.status === 'accepted').length;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-5xl mx-auto space-y-7">
          <div>
            <h1 className="text-gray-900 text-xl font-bold">Overview</h1>
            <p className="text-gray-400 text-xs mt-0.5">Welcome back, Morgan</p>
          </div>

          {bannerVisible && <OnboardingBanner onDismiss={() => setBannerVisible(false)} />}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Producers" value={producers.length} icon={Building2} color="bg-primary-50 text-primary-500" />
            <StatCard label="Facilities Tracked" value={totalFacilities} icon={BarChart3} color="bg-amber-50 text-amber-500" />
            <StatCard label="Approved" value={acceptedCount} icon={Users} color="bg-emerald-50 text-emerald-500" />
          </div>

          <ProducerTable
            producers={producers}
            onAddProducer={() => navigate('/add-producer')}
          />
        </div>
      </main>
    </div>
  );
}
