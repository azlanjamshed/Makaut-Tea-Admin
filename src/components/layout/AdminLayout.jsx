import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import GlobalSearchModal from '../search/GlobalSearchModal';
import * as reportsApi from '../../api/reports';
import * as announcementsApi from '../../api/announcements';
import * as feedbackApi from '../../api/feedback';

const PAGE_TITLES = {
  '/': 'Platform Dashboard',
  '/rants': 'Rant Management',
  '/announcements': 'Campus Announcements Pipeline',
  '/reports': 'Moderation Reports',
  '/users': 'User Management',
  '/feedback': 'Student Feedback & Suggestions',
  '/profile': 'Admin Profile',
  '/settings': 'System Settings',
};

const AdminLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [pendingAnnouncementsCount, setPendingAnnouncementsCount] = useState(0);
  const [newFeedbackCount, setNewFeedbackCount] = useState(0);
  const location = useLocation();

  const title = location.pathname.startsWith('/users/')
    ? 'User Profile'
    : (PAGE_TITLES[location.pathname] || 'Control Center');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchPendingCounts = async () => {
      try {
        const [repRes, annRes, feedRes] = await Promise.allSettled([
          reportsApi.getReports({ status: 'pending', limit: 1 }),
          announcementsApi.getAnnouncementRequestCounts(),
          feedbackApi.getFeedback({ status: 'new', limit: 1 }),
        ]);

        if (repRes.status === 'fulfilled' && repRes.value.success && repRes.value.pagination) {
          setPendingReportsCount(repRes.value.pagination.total || 0);
        }

        if (annRes.status === 'fulfilled' && annRes.value.success && annRes.value.data) {
          setPendingAnnouncementsCount(annRes.value.data.pending || 0);
        }

        if (feedRes.status === 'fulfilled' && feedRes.value.success && feedRes.value.pagination) {
          setNewFeedbackCount(feedRes.value.pagination.total || 0);
        }
      } catch (err) {
        // silently ignore
      }
    };
    fetchPendingCounts();
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[var(--bg-page)] text-slate-900 font-sans">
      {/* Sidebar (Desktop fixed + Mobile drawer) */}
      <AdminSidebar
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        pendingReportsCount={pendingReportsCount}
        pendingAnnouncementsCount={pendingAnnouncementsCount}
        newFeedbackCount={newFeedbackCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={title}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ refreshPendingCount: () => {} }} />
        </main>
      </div>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default AdminLayout;
