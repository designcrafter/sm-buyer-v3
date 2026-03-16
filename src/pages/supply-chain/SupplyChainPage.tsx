import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import FacilitiesTab from './FacilitiesTab';
import IntermediariesTab from './IntermediariesTab';

type Tab = 'facilities' | 'intermediaries';

export default function SupplyChainPage() {
  const [activeTab, setActiveTab] = useState<Tab>('facilities');

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-gray-900 text-xl font-bold">Supply Chain</h1>
            <p className="text-gray-400 text-xs mt-0.5">
              Track facility submissions and manage intermediary relationships.
            </p>
          </div>

          <div className="flex items-center gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('facilities')}
              className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === 'facilities'
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Facilities
              {activeTab === 'facilities' && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-900 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('intermediaries')}
              className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === 'intermediaries'
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Intermediaries
              {activeTab === 'intermediaries' && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-900 rounded-full" />
              )}
            </button>
          </div>

          {activeTab === 'facilities' && <FacilitiesTab />}
          {activeTab === 'intermediaries' && <IntermediariesTab />}
        </div>
      </main>
    </div>
  );
}
