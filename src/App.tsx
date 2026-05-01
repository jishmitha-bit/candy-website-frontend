import { useApp } from './context/AppContext';
import AmbientBg   from './components/AmbientBg';
import ToastHost   from './components/Toast';
import AppLayout   from './layouts/AppLayout';

import AuthPage      from './pages/auth/AuthPage';
import DashboardPage from './pages/dashboard';
import HRFlowPage    from './pages/hrflow';
import LiveCallsPage from './pages/live';

const appViews = {
  dashboard: <DashboardPage />,
  hr:        <HRFlowPage />,
  live:      <LiveCallsPage />,
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
