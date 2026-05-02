import { useApp } from './context/AppContext';
import AmbientBg from './components/AmbientBg';
import ToastHost from './components/Toast';
import AppLayout from './layouts/AppLayout';

import AuthPage      from './pages/auth/AuthPage';
import DashboardPage from './pages/dashboard';
import HRFlowPage    from './pages/hrflow';
import LiveCallsPage from './pages/live';

import EcommerceAgent  from './pages/ecommerce';
import FinancialAgent  from './pages/financial';
import LogisticsAgent  from './pages/logistics';
import HealthcareAgent from './pages/healthcare';
import MarketingAgent  from './pages/marketing';

// Voice-agent pages render full-screen with their own AgentShell — they
// supply their own header/back-button instead of the AppLayout chrome.
const AGENT_VIEWS = {
  ecommerce:  <EcommerceAgent />,
  financial:  <FinancialAgent />,
  logistics:  <LogisticsAgent />,
  healthcare: <HealthcareAgent />,
  marketing:  <MarketingAgent />,
};

const APP_VIEWS = {
  dashboard: <DashboardPage />,
  hr:        <HRFlowPage />,
  live:      <LiveCallsPage />,
};

export default function App() {
  const { currentView } = useApp();

  let body;
  if (currentView === 'auth') {
    body = (
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <AuthPage />
      </div>
    );
  } else if (AGENT_VIEWS[currentView]) {
    // Agent screens take over the full viewport — no sidebar, no topbar.
    body = AGENT_VIEWS[currentView];
  } else {
    body = (
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AppLayout>
          {APP_VIEWS[currentView] ?? <DashboardPage />}
        </AppLayout>
      </div>
    );
  }

  return (
    <>
      <AmbientBg />
      {body}
      <ToastHost />
    </>
  );
}
