import { useApp } from './context/AppContext';
import AmbientBg from './components/AmbientBg';
import ToastHost from './components/Toast';
import AppLayout from './layouts/AppLayout';

import AuthPage      from './pages/auth/AuthPage';
import DashboardPage from './pages/dashboard';
import HRFlowPage    from './pages/hrflow';
import LiveCallsPage from './pages/live';

// Industry agent pages — each lives in its own folder under src/pages/.
import EcommerceAgent  from './pages/ecommerce';
import FinancialAgent  from './pages/financial';
import LogisticsAgent  from './pages/logistics';
import HealthcareAgent from './pages/healthcare';
import MarketingAgent  from './pages/marketing';

const appViews = {
  dashboard:  <DashboardPage />,
  hr:         <HRFlowPage />,
  live:       <LiveCallsPage />,
  ecommerce:  <EcommerceAgent />,
  financial:  <FinancialAgent />,
  logistics:  <LogisticsAgent />,
  healthcare: <HealthcareAgent />,
  marketing:  <MarketingAgent />,
};

export default function App() {
  const { currentView } = useApp();

  return (
    <>
      <AmbientBg />

      {currentView === 'auth' ? (
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
          <AuthPage />
        </div>
      ) : (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AppLayout>
            {appViews[currentView] ?? <DashboardPage />}
          </AppLayout>
        </div>
      )}

      <ToastHost />
    </>
  );
}
