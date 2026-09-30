import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Lightbulb,
  Bug,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  Smartphone,
  Mail,
  User as UserIcon,
  X,
  Sparkles,
  Paperclip,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import * as feedbackApi from '../api/feedback';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { TableSkeleton } from '../components/common/Skeleton';

const STATUS_CONFIG = {
  new: { label: 'New', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  in_review: { label: 'In Review', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  planned: { label: 'Planned', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  resolved: { label: 'Resolved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  dismissed: { label: 'Dismissed', color: 'bg-slate-100 text-slate-600 border-slate-200' },
};

const TYPE_CONFIG = {
  suggestion: { label: 'Feature Idea', icon: Lightbulb, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  bug: { label: 'Bug Report', icon: Bug, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  general: { label: 'General Feedback', icon: MessageSquare, color: 'text-sky-700 bg-sky-50 border-sky-200' },
};

const FeedbackPage = () => {
  const [searchParams] = useSearchParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [page, setPage] = useState(1);

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      const res = await feedbackApi.getFeedback({
        page,
        limit: 12,
        type: selectedType,
        status: selectedStatus,
        search: search.trim() || undefined,
      });

      if (res.success) {
        setFeedbacks(res.data || []);
        if (res.pagination) {
          setPagination({
            ...res.pagination,
            totalPages:
              res.pagination.totalPages ||
              res.pagination.pages ||
              Math.ceil((res.pagination.total || 0) / (res.pagination.limit || 12)) ||
              1,
          });
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to load suggestions & feedback', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [page, selectedType, selectedStatus]);

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setAdminNotes(item.adminNotes || '');
    setEditStatus(item.status || 'new');
  };

  const handleUpdateStatusAndNotes = async (newStatus) => {
    if (!selectedItem) return;
    setIsUpdating(true);
    const targetStatus = newStatus || editStatus;
    try {
      const res = await feedbackApi.updateFeedback(selectedItem._id || selectedItem.id, {
        status: targetStatus,
        adminNotes: adminNotes.trim(),
      });

      if (res.success) {
        showToast('Feedback updated successfully', 'success');
        setFeedbacks((prev) =>
          prev.map((f) =>
            (f._id || f.id) === (selectedItem._id || selectedItem.id) ? res.data : f
          )
        );
        setSelectedItem(res.data);
        setEditStatus(res.data.status);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update feedback', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const id = deleteTarget._id || deleteTarget.id;
      await feedbackApi.deleteFeedback(id);
      showToast('Feedback entry deleted', 'success');
      setFeedbacks((prev) => prev.filter((f) => (f._id || f.id) !== id));
      setDeleteTarget(null);
      if (selectedItem && (selectedItem._id || selectedItem.id) === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete feedback', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick stats
  const totalCount = pagination.total || feedbacks.length;
  const suggestionCount = feedbacks.filter((f) => f.type === 'suggestion').length;
  const bugCount = feedbacks.filter((f) => f.type === 'bug').length;
  const newCount = feedbacks.filter((f) => f.status === 'new').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </span>
            <span>Student Feedback & Suggestions</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review feature proposals, bug submissions, and messages directly sent by college students.
          </p>
        </div>

        <button
          onClick={fetchFeedback}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[var(--border-color)] text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors text-xs font-semibold self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[var(--color-primary)]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[var(--border-color)] shadow-2xs flex flex-col">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Feedback</span>
          <span className="text-2xl font-black text-slate-900 font-display mt-1">{totalCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[var(--border-color)] shadow-2xs flex flex-col">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Needs Review</span>
          <span className="text-2xl font-black text-amber-600 font-display mt-1">{newCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[var(--border-color)] shadow-2xs flex flex-col">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Feature Suggestions</span>
          <span className="text-2xl font-black text-purple-600 font-display mt-1">{suggestionCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[var(--border-color)] shadow-2xs flex flex-col">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Bug Reports</span>
          <span className="text-2xl font-black text-rose-600 font-display mt-1">{bugCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[var(--border-color)] shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-[var(--border-color)]">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'suggestion', label: 'Suggestions', icon: Lightbulb },
              { id: 'bug', label: 'Bugs', icon: Bug },
              { id: 'general', label: 'General', icon: MessageSquare },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedType(tab.id);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    selectedType === tab.id
                      ? 'bg-[var(--color-primary)] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {TabIcon && <TabIcon className="w-3.5 h-3.5" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Status select */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/30 cursor-pointer"
          >
            <option value="all" className="bg-white text-slate-900">All Statuses</option>
            <option value="new" className="bg-white text-slate-900">New</option>
            <option value="in_review" className="bg-white text-slate-900">In Review</option>
            <option value="planned" className="bg-white text-slate-900">Planned</option>
            <option value="resolved" className="bg-white text-slate-900">Resolved</option>
            <option value="dismissed" className="bg-white text-slate-900">Dismissed</option>
          </select>
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            fetchFeedback();
          }}
          className="relative w-full md:w-72"
        >
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords, email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50/70 border border-[var(--border-color)] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </form>
      </div>

      {/* Main Feedback Grid */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : feedbacks.length === 0 ? (
        <EmptyState
          emoji="💡"
          title="No feedback found"
          message="No suggestions or reports match your current filter settings."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbacks.map((item) => {
            const typeConf = TYPE_CONFIG[item.type] || TYPE_CONFIG.suggestion;
            const statusConf = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
            const TypeIcon = typeConf.icon;

            return (
              <div
                key={item._id || item.id}
                className="p-5 rounded-2xl bg-white border border-[var(--border-color)] hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Card Header: Type & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${typeConf.color}`}
                    >
                      <TypeIcon className="w-3.5 h-3.5" />
                      <span>{typeConf.label}</span>
                    </span>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusConf.color}`}
                    >
                      {statusConf.label}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-[var(--color-primary)] transition-colors line-clamp-1 font-display">
                      {item.subject}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Attachment indicator if present */}
                  {item.screenshotUrl && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-[var(--border-color)] text-xs text-slate-600">
                      <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate text-[11px] font-medium">Screenshot attached</span>
                    </div>
                  )}

                  {/* Sender & Meta details */}
                  <div className="pt-3 border-t border-[var(--border-color)] flex flex-col gap-1 text-[11px] text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <UserIcon className="w-3 h-3 text-slate-400" />
                        <span>{item.user ? item.user.name : 'Anonymous Student'}</span>
                        {item.user?.department && (
                          <span className="text-[10px] text-slate-400">({item.user.department})</span>
                        )}
                      </span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    {item.contactEmail && (
                      <div className="flex items-center gap-1.5 text-slate-500 truncate">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{item.contactEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 mt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenDetail(item)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-[var(--border-color)] hover:border-indigo-200 text-xs font-bold text-slate-700 hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                    <span>View & Action</span>
                  </button>

                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Detail / Action Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white border border-[var(--border-color)] shadow-modal rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-white border border-[var(--border-color)] flex items-center justify-center">
                  {selectedItem.type === 'suggestion' ? (
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                  ) : selectedItem.type === 'bug' ? (
                    <Bug className="w-5 h-5 text-rose-500" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-indigo-500" />
                  )}
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-display">
                    {selectedItem.subject}
                  </h2>
                  <span className="text-xs text-slate-500">
                    Submitted on {new Date(selectedItem.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Status & Submitter Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-[var(--border-color)]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Submitted By
                  </span>
                  <div className="flex items-center gap-2 text-sm text-slate-900 font-semibold">
                    <UserIcon className="w-4 h-4 text-indigo-500" />
                    <span>{selectedItem.user ? selectedItem.user.name : 'Anonymous Student'}</span>
                  </div>
                  {selectedItem.contactEmail && (
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Email: {selectedItem.contactEmail}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Device / Platform
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <Smartphone className="w-4 h-4 text-purple-500" />
                    <span>{selectedItem.deviceInfo || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Student Message / Proposal
                </label>
                <div className="p-4 rounded-xl bg-slate-50 border border-[var(--border-color)] text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedItem.description}
                </div>
              </div>

              {/* Screenshot Preview if available */}
              {selectedItem.screenshotUrl && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Attached Screenshot
                  </label>
                  <a
                    href={selectedItem.screenshotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block group relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-slate-100 max-h-60"
                  >
                    <img
                      src={selectedItem.screenshotUrl}
                      alt="Student attachment"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white text-xs font-semibold transition-opacity">
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Full Image</span>
                    </div>
                  </a>
                </div>
              )}

              {/* Admin Resolution & Notes */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Update Status & Administrative Notes
                </label>

                {/* Status Badges to quickly change */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => handleUpdateStatusAndNotes(key)}
                      disabled={isUpdating}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedItem.status === key
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-2xs'
                          : 'bg-white text-slate-700 border-[var(--border-color)] hover:border-slate-300'
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal notes regarding this suggestion or bug fix (e.g. Scheduled for sprint v2.1, resolved in commit abc, etc.)..."
                  rows={3}
                  className="w-full p-3 text-xs rounded-xl bg-white border border-[var(--border-color)] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-indigo-100 resize-none transition-all"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--border-color)] bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => handleUpdateStatusAndNotes()}
                disabled={isUpdating}
                className="px-5 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                {isUpdating ? 'Saving...' : 'Save Notes & Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this feedback?"
        message="This action cannot be undone. Are you sure you want to permanently remove this record?"
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FeedbackPage;
