import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import AppShell from './components/layout/AppShell'
import DashboardPage from './pages/DashboardPage'
import VoiceAgentsPage from './pages/VoiceAgentsPage'
import LiveCallsPage from './pages/LiveCallsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import DataPage from './pages/DataPage'
import { ToastContainer } from './components/ui/Toast'

export default function App() {
  return (
    <BrowserRouter>
      <div className="ambient-bg" />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="voice-agents" element={<VoiceAgentsPage />} />
          <Route path="live" element={<LiveCallsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="data" element={<DataPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
