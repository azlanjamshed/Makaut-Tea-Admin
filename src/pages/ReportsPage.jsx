import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReportTable from '../components/reports/ReportTable';
import ReportCardMobile from '../components/reports/ReportCardMobile';
import ReportDetailModal from '../components/reports/ReportDetailModal';
import ResolveReportModal from '../components/reports/ResolveReportModal';
import CommentDetailModal from '../components/reports/CommentDetailModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import RantDetailModal from '../components/rants/RantDetailModal';
import HideRantModal from '../components/rants/HideRantModal';
import DeleteRantModal from '../components/rants/DeleteRantModal';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { TableSkeleton } from '../components/common/Skeleton';
import { useToast } from '../context/ToastContext';
import * as reportsApi from '../api/reports';
import * as rantsApi from '../api/rants';
import { REPORT_STATUSES, TARGET_TYPES } from '../utils/constants';
import { Search, RefreshCw, X } from 'lucide-react';

const ReportsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [targetType, setTargetType] = useState(searchParams.get('targetType') || 'all');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Modals
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolveTarget, setResolveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [investigateTarget, setInvestigateTarget] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Target Inspection & Moderation Modals
  const [targetPost, setTargetPost] = useState(null);
  const [targetCommentData, setTargetCommentData] = useState(null);
  const [hidePostTarget, setHidePostTarget] = useState(null);
  const [deletePostTarget, setDeletePostTarget] = useState(null);

  const { showToast } = useToast();

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
        status: status !== 'all' ? status : undefined,
        targetType: targetType !== 'all' ? targetType : undefined,
      };
      const res = await reportsApi.getReports(params);
      if (res.success) {
        let fetched = res.data || [];
        // Filter in-memory if user searched by query
        if (search.trim()) {
          const q = search.toLowerCase();
          fetched = fetched.filter(
            (r) =>
              r.reason?.toLowerCase().includes(q) ||
              r.description?.toLowerCase().includes(q) ||
              r.reporter?.name?.toLowerCase().includes(q) ||
              String(r.targetId || '').toLowerCase().includes(q)
          );
        }
        setReports(fetched);
        if (res.pagination) {
          setPagination({
            ...res.pagination,
            totalPages:
              res.pagination.totalPages ||
              res.pagination.pages ||
              Math.ceil((res.pagination.total || 0) / (res.pagination.limit || 10)) ||
              1,
          });
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, status, targetType]);

  const handleInvestigateConfirm = async () => {
    if (!investigateTarget) return;
    setIsProcessing(true);
    try {
      await reportsApi.updateReportStatus(investigateTarget._id || investigateTarget.id, {
        status: 'investigating',
        notes: 'Under review by platform administrator',
      });
      showToast('Report marked as investigating', 'success');
      setInvestigateTarget(null);
      fetchReports();
    } catch (err) {
      showToast(err.message || 'Failed to update report', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResolveConfirm = async ({ actionTaken, notes, durationDays }) => {
    if (!resolveTarget) return;
    setIsProcessing(true);
    try {
      if (actionTaken && actionTaken !== 'dismiss') {
        // Execute direct action
        await reportsApi.takeReportAction(resolveTarget._id || resolveTarget.id, {
          action: actionTaken,
          reason: notes || resolveTarget.reason,
          durationDays,
          notes,
        });
      } else {
        await reportsApi.resolveReport(resolveTarget._id || resolveTarget.id, {
          actionTaken: 'dismiss',
          notes,
        });
      }

      showToast('Report resolved successfully', 'success');
      setResolveTarget(null);
      fetchReports();
    } catch (err) {
      showToast(err.message || 'Failed to resolve report', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    setIsProcessing(true);
    try {
      await reportsApi.rejectReport(rejectTarget._id || rejectTarget.id, {
        notes: 'Report deemed invalid or unverified by administrator',
      });
      showToast('Report marked as rejected', 'info');
      setRejectTarget(null);
      fetchReports();
    } catch (err) {
      showToast(err.message || 'Failed to reject report', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenReporter = (report) => {
    const reporterId =
      report.reporter?._id ||
      report.reporter?.id ||
      (typeof report.reporter === 'string' ? report.reporter : null);

    if (reporterId) {
      navigate(`/users/${reporterId}`);
    } else {
      showToast('Reporter account details not available', 'info');
    }
  };

  const fetchAndOpenPost = async (postId) => {
    setIsProcessing(true);
    try {
      const res = await rantsApi.getAdminPostById(postId);
      if (res.data) {
        setTargetPost(res.data);
      } else {
        showToast('Reported post could not be retrieved', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch reported post', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenTarget = (report) => {
    const targetType = (report.targetType || 'post').toLowerCase();

    if (targetType === 'user') {
      const userId =
        report.reportedUser?._id ||
        report.reportedUser?.id ||
        (typeof report.reportedUser === 'string' ? report.reportedUser : null) ||
        report.targetId;

      if (userId) {
        navigate(`/users/${userId}`);
      } else {
        showToast('Reported user profile not found', 'error');
      }
    } else if (targetType === 'comment') {
      const commentObj =
        report.comment && typeof report.comment === 'object'
          ? report.comment
          : { text: report.description, _id: report.targetId };
      setTargetCommentData({ comment: commentObj, report });
    } else {
      // Default: post / rant
      const postId =
        report.post?._id ||
        report.post?.id ||
        (typeof report.post === 'string' ? report.post : null) ||
        report.targetId;

      if (postId) {
        fetchAndOpenPost(postId);
      } else {
        showToast('Reported post reference not found', 'error');
      }
    }
  };

  const handlePostHideConfirm = async (reason) => {
    if (!hidePostTarget) return;
    setIsProcessing(true);
    try {
      await rantsApi.hidePost(hidePostTarget._id || hidePostTarget.id, reason);
      showToast('Post hidden from student feeds', 'success');
      setHidePostTarget(null);
      if (
        targetPost &&
        (targetPost._id === hidePostTarget._id || targetPost.id === hidePostTarget.id)
      ) {
        setTargetPost((prev) => ({ ...prev, isHidden: true, moderationReason: reason }));
      }
      fetchReports();
    } catch (err) {
      showToast(err.message || 'Failed to hide post', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePostDeleteConfirm = async (reason) => {
    if (!deletePostTarget) return;
    setIsProcessing(true);
    try {
      await rantsApi.deletePost(deletePostTarget._id || deletePostTarget.id, reason);
      showToast('Post soft-deleted', 'success');
      setDeletePostTarget(null);
      if (
        targetPost &&
        (targetPost._id === deletePostTarget._id || targetPost.id === deletePostTarget.id)
      ) {
        setTargetPost((prev) => ({ ...prev, isDeleted: true }));
      }
      fetchReports();
    } catch (err) {
      showToast(err.message || 'Failed to delete post', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePostUnhide = async (post) => {
    setIsProcessing(true);
    try {
      await rantsApi.unhidePost(post._id || post.id);
      showToast('Post restored to visible', 'success');
      if (targetPost && (targetPost._id === post._id || targetPost.id === post.id)) {
        setTargetPost((prev) => ({ ...prev, isHidden: false }));
      }
      fetchReports();
    } catch (err) {
      showToast(err.message || 'Failed to unhide post', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePostRestore = async (post) => {
    setIsProcessing(true);
    try {
      await rantsApi.restorePost(post._id || post.id);
      showToast('Post restored to active', 'success');
      if (targetPost && (targetPost._id === post._id || targetPost.id === post.id)) {
        setTargetPost((prev) => ({ ...prev, isDeleted: false }));
      }
      fetchReports();
    } catch (err) {
      showToast(err.message || 'Failed to restore post', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Filter & Search Controls Bar */}
      <div className="bg-white border border-[var(--border-color)] rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search form */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports by reason, user, target..."
              className="w-full bg-slate-50/70 border border-[var(--border-color)] text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl pl-9 pr-9 py-2.5 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Target Type Filter & Refresh */}
          <div className="flex items-center gap-2">
            <select
              value={targetType}
              onChange={(e) => {
                setTargetType(e.target.value);
                setPage(1);
              }}
              className="bg-white border border-[var(--border-color)] text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/30 cursor-pointer font-medium"
            >
              {TARGET_TYPES.map((t) => (
                <option key={t.id} value={t.id} className="bg-white text-slate-900">
                  {t.label}
                </option>
              ))}
            </select>

            <button
              onClick={fetchReports}
              className="p-2.5 rounded-xl bg-slate-50 border border-[var(--border-color)] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[var(--color-primary)]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar border-t border-[var(--border-color)]">
          {REPORT_STATUSES.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setStatus(st.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                status === st.id
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table / Mobile Card Content */}
      {isLoading ? (
        <TableSkeleton rows={8} cols={7} />
      ) : error ? (
        <ErrorState
          title="Could not load reports"
          message={error}
          onRetry={fetchReports}
        />
      ) : reports.length === 0 ? (
        <EmptyState
          emoji="🚨"
          title="No pending reports"
          message={
            search || status !== 'all' || targetType !== 'all'
              ? 'No reports match your current filter settings.'
              : 'There are no reported grievances awaiting investigation.'
          }
          actionLabel={search || status !== 'all' || targetType !== 'all' ? 'Clear Filters' : null}
          onAction={() => {
            setSearch('');
            setStatus('all');
            setTargetType('all');
            setPage(1);
          }}
        />
      ) : (
        <div className="bg-white border border-[var(--border-color)] rounded-2xl shadow-2xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <ReportTable
              reports={reports}
              onView={(rep) => setSelectedReport(rep)}
              onResolve={(rep) => setResolveTarget(rep)}
              onReject={(rep) => setRejectTarget(rep)}
              onInvestigate={(rep) => setInvestigateTarget(rep)}
              onOpenTarget={handleOpenTarget}
              onOpenReporter={handleOpenReporter}
            />
          </div>

          {/* Mobile Card Conversion View */}
          <div className="md:hidden divide-y divide-[var(--border-color)]">
            {reports.map((rep) => (
              <ReportCardMobile
                key={rep._id || rep.id}
                report={rep}
                onView={(r) => setSelectedReport(r)}
                onResolve={(r) => setResolveTarget(r)}
                onInvestigate={(r) => setInvestigateTarget(r)}
                onOpenTarget={handleOpenTarget}
                onOpenReporter={handleOpenReporter}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page || page}
            totalPages={pagination.totalPages || 1}
            totalItems={pagination.total}
            pageSize={10}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Report Detail Modal */}
      <ReportDetailModal
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
        onInvestigate={(r) => setInvestigateTarget(r)}
        onResolve={(r) => setResolveTarget(r)}
        onReject={(r) => setRejectTarget(r)}
        onOpenTarget={handleOpenTarget}
      />

      {/* Resolve Report Modal */}
      <ResolveReportModal
        isOpen={Boolean(resolveTarget)}
        onClose={() => setResolveTarget(null)}
        onConfirm={handleResolveConfirm}
        report={resolveTarget}
        isLoading={isProcessing}
      />

      {/* Target Rant / Post Detail Modal */}
      <RantDetailModal
        isOpen={Boolean(targetPost)}
        onClose={() => setTargetPost(null)}
        rant={targetPost}
        onHide={(p) => setHidePostTarget(p)}
        onUnhide={handlePostUnhide}
        onDelete={(p) => setDeletePostTarget(p)}
        onRestore={handlePostRestore}
      />

      {/* Target Comment Detail Modal */}
      <CommentDetailModal
        isOpen={Boolean(targetCommentData)}
        onClose={() => setTargetCommentData(null)}
        commentData={targetCommentData}
        onInspectPost={(postId) => fetchAndOpenPost(postId)}
      />

      {/* Moderation: Hide Post Modal */}
      <HideRantModal
        isOpen={Boolean(hidePostTarget)}
        onClose={() => setHidePostTarget(null)}
        onConfirm={handlePostHideConfirm}
        rant={hidePostTarget}
        isLoading={isProcessing}
      />

      {/* Moderation: Delete Post Modal */}
      <DeleteRantModal
        isOpen={Boolean(deletePostTarget)}
        onClose={() => setDeletePostTarget(null)}
        onConfirm={handlePostDeleteConfirm}
        rant={deletePostTarget}
        isLoading={isProcessing}
      />

      {/* Investigate Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(investigateTarget)}
        onClose={() => setInvestigateTarget(null)}
        onConfirm={handleInvestigateConfirm}
        title="Mark Under Investigation?"
        message="This will update the report status to 'Investigating' to inform other administrators that review is in progress."
        confirmText="Start Investigation"
        variant="primary"
        isLoading={isProcessing}
      />

      {/* Reject Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleRejectConfirm}
        title="Reject Report?"
        message="This will dismiss the complaint and mark its status as 'Rejected'. No moderation penalty will be applied to the target."
        confirmText="Reject Report"
        variant="warning"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default ReportsPage;
