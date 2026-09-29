import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminLayout from './components/layout/AdminLayout';
import { Loader2 } from 'lucide-react';

// Lazy-loaded route components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const RantsPage = lazy(() => import('./pages/RantsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const AnnouncementsPage = lazy(() => import('./pages/AnnouncementsPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const AdminPageLoader = () => (
  <div className="min-h-[40vh] w-full flex flex-col items-center justify-center text-[var(--color-primary)] gap-2.5 font-mono text-xs">
    <Loader2 className="w-5 h-5 animate-spin" />
    <span>Loading administrative panel...</span>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center text-[var(--color-primary)] gap-2 font-mono text-xs">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Authenticating administrative credentials...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center text-[var(--color-primary)] gap-2 font-mono text-xs">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Verifying access...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Suspense fallback={<AdminPageLoader />}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="rants" element={<RantsPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserProfilePage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AdminAuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AdminAuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
