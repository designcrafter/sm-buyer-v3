import { useState } from 'react';
import { Lock, BarChart3, Sparkles, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useDemoStore } from '../lib/demoStore';
import { useReportsFilters } from './reports/useReportsFilters';
import { computeSummary } from './reports/reportsAggregations';
import { FilterBar } from './reports/FilterBar';
import { KeyFindingsTab } from './reports/KeyFindingsTab';
import { GenderTab } from './reports/GenderTab';
import { RemunerationTab } from './reports/RemunerationTab';
import { WorkingHoursTab } from './reports/WorkingHoursTab';

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

const TABS = [
  { id: 'key-findings', label: 'Key Findings' },
  { id: 'gender', label: 'Gender' },
  { id: 'remuneration', label: 'Remuneration' },
  { id: 'working-hours', label: 'Working Hours' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function IntermediaryReportsRestricted() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-gray-900 text-xl font-bold">Buyer's Dashboard</h1>
            <p className="text-gray-400 text-xs mt-0.5">Living Wage Gap data across your supply chain.</p>
          </div>
          <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
              <Lock className="w-7 h-7 text-gray-300" strokeWidth={1.5} />
            </div>
            <p className="text-gray-800 text-base font-semibold">The Buyer's Dashboard is available to buyers only</p>
            <p className="text-gray-400 text-sm mt-2 text-center max-w-sm leading-relaxed">
              As an intermediary, you can match suppliers with buyers but cannot access Living Wage Gap data. Contact the buyer if you need specific data.
            </p>
            <div className="mt-6 flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <BarChart3 className="w-4 h-4 text-gray-300" strokeWidth={1.75} />
              <p className="text-gray-400 text-xs font-medium">Dashboard access is managed by buyer accounts</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ReportsPage() {
  const { activeRole } = useDemoStore();
  const [activeTab, setActiveTab] = useState<TabId>('key-findings');
  const [bannerVisible, setBannerVisible] = useState(true);

  if (activeRole === 'intermediary') {
    return <IntermediaryReportsRestricted />;
  }

  const filters = useReportsFilters();
  const summary = computeSummary(filters.filtered);

  function handleExportPdf() {
    window.print();
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-6xl mx-auto space-y-5 print:px-0 print:py-0 print:max-w-full">

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-gray-900 text-xl font-bold">Buyer's Dashboard</h1>
              <p className="text-gray-400 text-xs mt-0.5">
                Welcome back, Morgan
              </p>
            </div>
            <div className="hidden print:block text-right">
              <p className="text-xs text-gray-400">
                Generated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {bannerVisible && <OnboardingBanner onDismiss={() => setBannerVisible(false)} />}

          <FilterBar
            allCountries={filters.allCountries}
            allRegions={filters.allRegions}
            allYears={filters.allYears}
            allProducts={filters.allProducts}
            selectedCountries={filters.selectedCountries}
            selectedRegions={filters.selectedRegions}
            selectedYears={filters.selectedYears}
            selectedProducts={filters.selectedProducts}
            onToggleCountry={filters.toggleCountry}
            onToggleRegion={filters.toggleRegion}
            onToggleYear={filters.toggleYear}
            onToggleProduct={filters.toggleProduct}
            onExportPdf={handleExportPdf}
            hasFilters={filters.hasFilters}
            onClear={filters.clearFilters}
          />

          <div className="flex items-center gap-0 border-b border-gray-200 print:hidden">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-primary-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t" />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'key-findings' && (
            <KeyFindingsTab data={filters.filtered} summary={summary} />
          )}
          {activeTab === 'gender' && (
            <GenderTab data={filters.filtered} />
          )}
          {activeTab === 'remuneration' && (
            <RemunerationTab data={filters.filtered} />
          )}
          {activeTab === 'working-hours' && (
            <WorkingHoursTab data={filters.filtered} />
          )}

          <div className="text-xs text-gray-300 pb-4 leading-relaxed hidden print:block">
            The Salary Matrix creates a calculation of total remuneration that is comparable with Living Wage
            Estimates. This does not represent the actual remuneration received by workers. Data sourced from
            facility-submitted payroll records. Figures aggregated across selected filters.
          </div>
        </div>
      </main>
    </div>
  );
}
