import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import RantTable from '../components/rants/RantTable';
import RantCardMobile from '../components/rants/RantCardMobile';
import RantCardFeed from '../components/rants/RantCardFeed';
import RantDetailModal from '../components/rants/RantDetailModal';
import HideRantModal from '../components/rants/HideRantModal';
import DeleteRantModal from '../components/rants/DeleteRantModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { TableSkeleton } from '../components/common/Skeleton';
import { useToast } from '../context/ToastContext';
import * as rantsApi from '../api/rants';
import CreatePostModal from '../components/rants/CreatePostModal';
import { DEPARTMENTS, RANT_STATUSES } from '../utils/constants';
import { Search, Filter, RefreshCw, X, Plus, Megaphone, LayoutList, Table as TableIcon } from 'lucide-react';

const RantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rants, setRants] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const observerTarget = useRef(null);

  // View mode: 'feed' (live student-like stream) or 'table' (moderation grid)
  const [viewMode, setViewMode] = useState('feed');

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [department, setDepartment] = useState(searchParams.get('department') || 'All');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Modals
  const [selectedRant, setSelectedRant] = useState(null);
  const [hideTarget, setHideTarget] = useState(null);
  const [unhideTarget, setUnhideTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { showToast } = useToast();

  const fetchRants = async (pageNum = page, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const params = {
        page: pageNum,
        limit: 10,
        status: status !== 'all' ? status : undefined,
        department: department !== 'All' ? department : undefined,
        search: search.trim() || undefined,
      };
      const res = await rantsApi.getAdminPosts(params);
      if (res.success) {
        const fetched = res.data || [];
        if (append) {
          setRants((prev) => [...prev, ...fetched]);
        } else {
          setRants(fetched);
        }
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
        setPage(pageNum);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch rants');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchRants(1, false);
  }, [status, department]);

  const hasMore = (pagination.page || page) < (pagination.totalPages || 1);

  // Auto-fetch next page on scroll when in feed view
  useEffect(() => {
    if (viewMode !== 'feed' || !hasMore || isLoading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchRants(page + 1, true);
        }
      },
      { threshold: 0.1, rootMargin: '250px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [viewMode, hasMore, isLoading, isLoadingMore, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRants(1, false);
  };

  const handleHideConfirm = async (reason) => {
    if (!hideTarget) return;
    setIsProcessing(true);
    try {
      await rantsApi.hidePost(hideTarget._id || hideTarget.id, reason);
      showToast('Rant successfully hidden from student feeds', 'success');
      setHideTarget(null);
      fetchRants();
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
      showToast('Rant soft-deleted', 'success');
      setDeleteTarget(null);
      fetchRants();
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
      fetchRants();
    } catch (err) {
      showToast(err.message || 'Failed to restore rant', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnhideConfirm = async () => {
    if (!unhideTarget) return;
    setIsProcessing(true);
    try {
      await rantsApi.unhidePost(unhideTarget._id || unhideTarget.id);
      showToast('Rant is now visible to public!', 'success');
      setUnhideTarget(null);
      if (selectedRant && (selectedRant._id === unhideTarget._id || selectedRant.id === unhideTarget.id)) {
        setSelectedRant(null);
      }
      fetchRants();
    } catch (err) {
      showToast(err.message || 'Failed to unhide rant', 'error');
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
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rants by keywords, text..."
              className="w-full bg-slate-50 border border-[var(--border-color)] text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl pl-9 pr-9 py-2.5 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Refresh and Department Filter */}
          <div className="flex items-center gap-2">
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 border border-[var(--border-color)] text-slate-700 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>

            <button
              onClick={fetchRants}
              className="p-2.5 rounded-xl bg-slate-50 border border-[var(--border-color)] text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[var(--color-primary)]' : ''}`} />
            </button>

            {/* Create Announcement Button */}
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all shrink-0 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Announcement</span>
              <span className="sm:hidden">Post</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs & View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {RANT_STATUSES.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setStatus(st.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  status === st.id
                    ? 'bg-[var(--color-primary)] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* View Mode Switcher: Feed vs Table */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-[var(--border-color)] shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'feed'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Student Post Feed View"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Feed View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Moderation Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Feed vs Table */}
      {isLoading ? (
        <TableSkeleton rows={8} cols={8} />
      ) : error ? (
        <ErrorState
          title="Could not load rants"
          message={error}
          onRetry={fetchRants}
        />
      ) : rants.length === 0 ? (
        <EmptyState
          emoji="📝"
          title="No rants found"
          message={
            search || status !== 'all' || department !== 'All'
              ? 'No rants match your current filter settings. Try adjusting search or filters.'
              : 'No rants have been posted to the platform yet.'
          }
          actionLabel={search || status !== 'all' || department !== 'All' ? 'Clear Filters' : null}
          onAction={() => {
            setSearch('');
            setStatus('all');
            setDepartment('All');
            setPage(1);
          }}
        />
      ) : viewMode === 'feed' ? (
        /* Live Post Feed Stream */
        <div className="space-y-5 max-w-2xl mx-auto">
          {rants.map((rant) => (
            <RantCardFeed
              key={rant._id || rant.id}
              rant={rant}
              onInspect={(r) => setSelectedRant(r)}
              onHide={(r) => setHideTarget(r)}
              onUnhide={(r) => setUnhideTarget(r)}
              onDelete={(r) => setDeleteTarget(r)}
              onRestore={(r) => setRestoreTarget(r)}
            />
          ))}

          {/* Infinite Scroll Sentinel in Feed View */}
          {hasMore && (
            <div ref={observerTarget} className="py-6 flex flex-col items-center justify-center gap-2">
              {isLoadingMore ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <RefreshCw className="w-4 h-4 animate-spin text-[var(--color-primary)]" />
                  <span>Loading more rants...</span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400">Scroll for more posts</span>
              )}
            </div>
          )}

          {!hasMore && rants.length > 0 && (
            <div className="py-6 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
              <span className="h-px w-10 bg-slate-200" />
              <span>End of campus rants stream</span>
              <span className="h-px w-10 bg-slate-200" />
            </div>
          )}
        </div>
      ) : (
        /* Moderation Table View */
        <div className="bg-white border border-[var(--border-color)] rounded-2xl shadow-2xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <RantTable
              rants={rants}
              onView={(r) => setSelectedRant(r)}
              onHide={(r) => setHideTarget(r)}
              onUnhide={(r) => setUnhideTarget(r)}
              onDelete={(r) => setDeleteTarget(r)}
              onRestore={(r) => setRestoreTarget(r)}
            />
          </div>

          {/* Mobile Card Conversion View */}
          <div className="md:hidden divide-y divide-dark-border/50">
            {rants.map((rant) => (
              <RantCardMobile
                key={rant._id || rant.id}
                rant={rant}
                onView={(r) => setSelectedRant(r)}
                onHide={(r) => setHideTarget(r)}
                onUnhide={(r) => setUnhideTarget(r)}
                onDelete={(r) => setDeleteTarget(r)}
                onRestore={(r) => setRestoreTarget(r)}
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

      {/* Rant Detail Modal */}
      <RantDetailModal
        isOpen={Boolean(selectedRant)}
        onClose={() => {
          setSelectedRant(null);
          fetchRants();
        }}
        rant={selectedRant}
        onHide={(r) => setHideTarget(r)}
        onUnhide={(r) => setUnhideTarget(r)}
        onDelete={(r) => setDeleteTarget(r)}
        onRestore={(r) => setRestoreTarget(r)}
      />

      {/* Hide Rant Modal */}
      <HideRantModal
        isOpen={Boolean(hideTarget)}
        onClose={() => setHideTarget(null)}
        onConfirm={handleHideConfirm}
        rant={hideTarget}
        isLoading={isProcessing}
      />

      {/* Delete Rant Modal */}
      <DeleteRantModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        rant={deleteTarget}
        isLoading={isProcessing}
      />

      {/* Restore Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(restoreTarget)}
        onClose={() => setRestoreTarget(null)}
        onConfirm={handleRestoreConfirm}
        title="Restore Rant to Active?"
        message="This will restore the rant and re-publish it to public student streams."
        confirmText="Restore Rant"
        variant="primary"
        isLoading={isProcessing}
      />

      {/* Unhide Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(unhideTarget)}
        onClose={() => setUnhideTarget(null)}
        onConfirm={handleUnhideConfirm}
        title="Unhide Rant?"
        message="This will unhide this rant and make it immediately visible to students on the campus platform."
        confirmText="Unhide Rant"
        variant="primary"
        isLoading={isProcessing}
      />

      {/* Create Official Post Modal */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={() => {
          fetchRants();
        }}
      />
    </div>
  );
};

export default RantsPage;
