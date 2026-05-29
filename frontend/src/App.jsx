import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AppShell from './pages/AppShell';
import GardenPage from './pages/app/GardenPage';
import PathPage from './pages/app/PathPage';
import JournalPage from './pages/app/JournalPage';
import DoubtGardenPage from './pages/app/DoubtGardenPage';
import CommunityPage from './pages/app/CommunityPage';
import LeaderboardPage from './pages/app/LeaderboardPage';
import SettingsPage from './pages/app/SettingsPage';
import GroupsPage from './pages/app/GroupsPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌸</div>
        <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>Loading your garden…</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/app/garden" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route index element={<Navigate to="garden" replace />} />
            <Route path="garden" element={<GardenPage />} />
            <Route path="path" element={<PathPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="doubts" element={<DoubtGardenPage />} />
            <Route path="feed" element={<CommunityPage />} />
            <Route path="community" element={<Navigate to="/app/feed" replace />} />
            <Route path="groups" element={<GroupsPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
