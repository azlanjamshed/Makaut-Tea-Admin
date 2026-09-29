import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import ActivityChart from '../components/dashboard/ActivityChart';
import RecentRantsWidget from '../components/dashboard/RecentRantsWidget';
import RecentReportsWidget from '../components/dashboard/RecentReportsWidget';
import { CardSkeleton } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import RantDetailModal from '../components/rants/RantDetailModal';
import ReportDetailModal from '../components/reports/ReportDetailModal';
import HideRantModal from '../components/rants/HideRantModal';
import DeleteRantModal from '../components/rants/DeleteRantModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { useToast } from '../context/ToastContext';
import * as dashboardApi from '../api/dashboard';
import * as rantsApi from '../api/rants';
import * as reportsApi from '../api/reports';
import { Users, FileText, MessageSquare, Flame, Clock, UserCheck, AlertTriangle } from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentRants, setRecentRants] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected items for detail modals
  const [selectedRant, setSelectedRant] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  // Moderation action states
  const [hideTarget, setHideTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, rantsRes, reportsRes] = await Promise.all([
        dashboardApi.getDashboardStats(),
        rantsApi.getAdminPosts({ limit: 5 }),
        reportsApi.getReports({ status: 'pending', limit: 5 }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (rantsRes.success) setRecentRants(rantsRes.data || []);
      if (reportsRes.success) setRecentReports(reportsRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleHideConfirm = async (reason) => {
    if (!hideTarget) return;
    setIsProcessing(true);
    try {
      await rantsApi.hidePost(hideTarget._id || hideTarget.id, reason);
      showToast('Rant has been hidden from public feed', 'success');
      setHideTarget(null);
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to hide rant', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteConfirm = async (reason) => {
    if (!deleteTarget) return;
    setIsProcessing(true);
    try {
      await rantsApi.deletePost(deleteTarget._id || deleteTarget.id, reason);
      showToast('Rant has been soft-deleted', 'success');
      setDeleteTarget(null);
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to delete rant', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestoreConfirm = async () => {
    if (!restoreTarget) return;
    setIsProcessing(true);
    try {
      await rantsApi.restorePost(restoreTarget._id || restoreTarget.id);
      showToast('Rant restored to active', 'success');
      setRestoreTarget(null);
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to restore rant', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (error && !stats) {
    return (
      <ErrorState
        title="Could not load dashboard"
        message={error}
        onRetry={loadDashboardData}
        className="my-10"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 7 KPI Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {isLoading && !stats ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              subtitle="Registered students"
              icon={Users}
              color="sky"
              href="/users"
            />
            <StatCard
              title="Total Rants"
              value={stats?.totalRants || 0}
              subtitle="All-time confessions"
              icon={FileText}
              color="purple"
              href="/rants"
            />
            <StatCard
              title="Total Comments"
              value={stats?.totalComments || 0}
              subtitle="Community responses"
              icon={MessageSquare}
              color="emerald"
            />
            <StatCard
              title="Total Reactions"
              value={stats?.totalReactions || 0}
              subtitle="Engagement count"
              icon={Flame}
              color="rose"
            />
          </>
        )}
      </div>

      {/* Second Row: Today's Metrics & Pending Reports Flag */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {isLoading && !stats ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Today's Rants"
              value={stats?.todayRants || 0}
              subtitle="Fresh campus grievances"
              icon={Clock}
              color="sky"
            />
            <StatCard
              title="Today's Active Users"
              value={stats?.todayActiveUsers || 0}
              subtitle="Engaged today"
              icon={UserCheck}
              color="emerald"
            />
            <StatCard
              title="Pending Reports"
              value={stats?.pendingReports || 0}
              subtitle={stats?.pendingReports > 0 ? 'Requires investigation' : 'No backlog'}
              icon={AlertTriangle}
              color="amber"
              href="/reports"
              badge={stats?.pendingReports > 0 ? 'High Priority' : null}
            />
          </>
        )}
      </div>

      {/* Activity Chart Section */}
      <ActivityChart />

      {/* Recent Activity: Rants and Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentRantsWidget
          rants={recentRants}
          onSelectRant={(rant) => setSelectedRant(rant)}
        />
        <RecentReportsWidget
          reports={recentReports}
          onSelectReport={(report) => {
            navigate('/reports');
          }}
        />
      </div>

      {/* Rant Detail Modal */}
      <RantDetailModal
        isOpen={Boolean(selectedRant)}
        onClose={() => setSelectedRant(null)}
        rant={selectedRant}
        onHide={(r) => setHideTarget(r)}
        onUnhide={async (r) => {
          try {
            await rantsApi.unhidePost(r._id || r.id);
            showToast('Rant is now visible to public', 'success');
            loadDashboardData();
          } catch (err) {
            showToast(err.message, 'error');
          }
        }}
        onDelete={(r) => setDeleteTarget(r)}
        onRestore={(r) => setRestoreTarget(r)}
      />

      {/* Moderation Modals */}
      <HideRantModal
        isOpen={Boolean(hideTarget)}
        onClose={() => setHideTarget(null)}
        onConfirm={handleHideConfirm}
        rant={hideTarget}
        isLoading={isProcessing}
      />

      <DeleteRantModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        rant={deleteTarget}
        isLoading={isProcessing}
      />

      <ConfirmationModal
        isOpen={Boolean(restoreTarget)}
        onClose={() => setRestoreTarget(null)}
        onConfirm={handleRestoreConfirm}
        title="Restore Rant?"
        message="This will restore the rant to active status and make it visible again on public student feeds."
        confirmText="Restore Rant"
        variant="primary"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default DashboardPage;
