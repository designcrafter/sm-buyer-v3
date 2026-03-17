import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProducerStoreProvider } from './lib/producerStore';
import { DemoStoreProvider } from './lib/demoStore';
import { SupplierCollaborationProvider } from './lib/supplierCollaborationStore';
import { IntermediaryCollaborationProvider } from './lib/intermediaryCollaborationStore';
import DemoBar, { DEMO_BAR_HEIGHT } from './components/DemoBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import IntermediaryRegisterPage from './pages/IntermediaryRegisterPage';
import IntermediaryDashboardPage from './pages/IntermediaryDashboardPage';
import AddProducerPage from './pages/AddProducerPage';
import ProducersPage from './pages/ProducersPage';
import SupplyChainPage from './pages/supply-chain/SupplyChainPage';
import FacilityDetailPage from './pages/supply-chain/FacilityDetailPage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';
import SupplierDashboardPage from './pages/supplier/SupplierDashboardPage';
import SupplierCollaborationPage from './pages/supplier/SupplierCollaborationPage';
import SupplierPlaceholderPage from './pages/supplier/SupplierPlaceholderPage';
import IntermediaryCollaborationPage from './pages/intermediary/IntermediaryCollaborationPage';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingTop: DEMO_BAR_HEIGHT }}>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <DemoStoreProvider>
      <ProducerStoreProvider>
        <SupplierCollaborationProvider>
          <IntermediaryCollaborationProvider>
          <BrowserRouter>
            <DemoBar />
            <Routes>
              <Route path="/" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/intermediary/register" element={<IntermediaryRegisterPage />} />
              <Route path="/dashboard" element={<AppLayout><ReportsPage /></AppLayout>} />
              <Route path="/intermediary/dashboard" element={<AppLayout><IntermediaryDashboardPage /></AppLayout>} />
              <Route path="/intermediary/collaboration" element={<AppLayout><IntermediaryCollaborationPage /></AppLayout>} />
              <Route path="/supply-chain" element={<AppLayout><SupplyChainPage /></AppLayout>} />
              <Route path="/supply-chain/facilities/:id" element={<AppLayout><FacilityDetailPage /></AppLayout>} />
              <Route path="/add-producer" element={<AppLayout><AddProducerPage /></AppLayout>} />
              <Route path="/producers" element={<AppLayout><ProducersPage /></AppLayout>} />
              <Route path="/producers/:id" element={<AppLayout><ProducersPage /></AppLayout>} />
              <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
              <Route path="/reports" element={<Navigate to="/dashboard" replace />} />
              <Route path="/supplier/dashboard" element={<AppLayout><SupplierDashboardPage /></AppLayout>} />
              <Route path="/supplier/collaboration" element={<AppLayout><SupplierCollaborationPage /></AppLayout>} />
              <Route path="/supplier/facilities" element={<AppLayout><SupplierPlaceholderPage title="Facilities" /></AppLayout>} />
              <Route path="/supplier/wage-calculations" element={<AppLayout><SupplierPlaceholderPage title="Wage Calculations" /></AppLayout>} />
              <Route path="/suppliers" element={<Navigate to="/producers" replace />} />
              <Route path="/suppliers/:id" element={<Navigate to="/producers" replace />} />
              <Route path="/team" element={<Navigate to="/settings" replace />} />
              <Route path="/add-supplier" element={<Navigate to="/add-producer" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          </IntermediaryCollaborationProvider>
        </SupplierCollaborationProvider>
      </ProducerStoreProvider>
    </DemoStoreProvider>
  );
}
