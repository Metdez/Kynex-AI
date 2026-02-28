import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import ApprovalQueuePage from './pages/ApprovalQueuePage';
import DashboardPage from './pages/DashboardPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import NewCampaignWizardPage from './pages/NewCampaignWizardPage';
import VoiceAgentPage from './pages/VoiceAgentPage';
import SmsEmailPage from './pages/SmsEmailPage';
import SequenceDetailPage from './pages/SequenceDetailPage';
import CrmPage from './pages/CrmPage';
import ContactDetailPage from './pages/ContactDetailPage';
import InboxPage from './pages/InboxPage';
import CalendarPage from './pages/CalendarPage';
import LandingPagesPage from './pages/LandingPagesPage';
import PageEditorPage from './pages/PageEditorPage';
import ActivityLogPage from './pages/ActivityLogPage';
import SettingsPage from './pages/SettingsPage';
import OnboardingPage from './pages/OnboardingPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Standalone protected route (no sidebar/topbar) */}
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

      {/* Protected routes inside MainLayout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<ApprovalQueuePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/campaigns/new" element={<NewCampaignWizardPage />} />
        <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
        <Route path="/voice-agent" element={<VoiceAgentPage />} />
        <Route path="/sms-email" element={<SmsEmailPage />} />
        <Route path="/sms-email/:id" element={<SequenceDetailPage />} />
        <Route path="/crm" element={<CrmPage />} />
        <Route path="/crm/:id" element={<ContactDetailPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/landing-pages" element={<LandingPagesPage />} />
        <Route path="/landing-pages/:id" element={<PageEditorPage />} />
        <Route path="/activity-log" element={<ActivityLogPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
